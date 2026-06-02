import {
  pgEnum,
  pgTable,
  text,
  varchar,
  index,
  jsonb,
  timestamp,
  primaryKey,
  integer,
  boolean
} from "drizzle-orm/pg-core";

import { sql } from "drizzle-orm";

//  Ids
export const IDs = {
  entity: "ENT_",
  user: "USR_",
  room: "RM_",
  room_member: "RMME_",
  post: "POST_",
  item: "ITEM_",
  message: "MSG_",
  logistics: "SHIP_",
  session: "SESS_",
  audit: "AUDIT_",
  dispute: "DSP_"
} as const;

export type IdTypes = keyof typeof IDs;

// Enums
export const user_role = pgEnum("user_role", [
  "user",
  "admin",
  "arbitrator"
]);

export const entity_type_enum = pgEnum(
  "entity_type",
  ["user", "room"]
);

export const post_status_enum = pgEnum(
  "post_status",
  ["active", "filled", "expired"]
);

export const shipment_status_enum = pgEnum(
  "shipment_status",
  [
    "pending",
    "in_transit",
    "collected",
    "delivered",
    "canceled",
    "paid",
    "disputed"
  ]
);

export const audit_flag_enum = pgEnum(
  "audit_flag",
  [
    "info",
    "critical",
    "security_breach",
    "log"
  ]
);

export const message_flag_enum = pgEnum(
  "message_flag",
  [
    "system",
    "notification",
    "proposal",
    "chat",
    "dispute"
  ]
);

export const dispute_status_enum = pgEnum(
  "dispute_status",
  [
    "open",
    "investigating",
    "resolved",
    "rejected"
  ]
);

// core types
export type AuditAction =
  | "CREATE"
  | "CREATE_USER"
  | "UPDATE"
  | "DELETE"
  | "ADMIN ACTION"
  | "SIGN_CONTRACT"
  | "VERIFY_CREDENTIAL"
  | "LOGIN"
  | "LOGOUT"
  | "ROOM"
  | "SOLO"
  | "READ"
  | "RATE"
  | "SHIPMENT"
  | "DISPUTE";

export const currencies = [
  "USD",
  "RWF",
  "EUR"
] as const;

export type Currency =
  (typeof currencies)[number];

export const permission_status = [
  "authorised",
  "denied",
  "pending"
] as const;

export type PermissionStatus =
  (typeof permission_status)[number];

export const transport_types = [
  "sole",
  "company"
] as const;

export type TransportType =
  (typeof transport_types)[number];

// json types
export type UserMeta = {
  profile: {
    name: string;
    image?: string;
    phone?: string;
    country?: string;
    website?: string;
    currency?: Currency;
  };

  rating?: number;
  rating_count?: number;
  permissions?: {
    right: string;
    status: PermissionStatus;
    by: string;
    document: string;
  }[];
};

export type RoomMeta = {
  description?: string;

  tags?: string[];

  members_rules?: {
    actor: string;
    role: string;
    isAdmin: boolean;
  }[];

  goals: {
    monthly_target: number;
    currency: Currency;
  };
};

export type RoomContract = {
  version: number;
  introduction: string;
  sections: {
    shipment_rules: string;
    payment_terms: string;
    penalties: string;
    dispute_resolution: string;
  };
  metadata: {
    provider_id: string;
    receiver_id: string;
    jurisdiction: string;
  };
  signed: string[];
};

export type PostContent = {
  title: string;
  body: string;
  description?: string;
  media?: string[];
  unit:"kg" | "ton" | "unit" | "letter"| "item"| "hour" | "day";
  type:"OFFER"  | "WANT" | "INFO";
  price_cents: number;
  currency?: Currency;
  location: string;
  tags?: string[];
  category: string;
};

export type ItemAnalytics = {
  instore: number;
  weekly_status?: {
    week_ending: string;
    total_sales: number;
    expense: number;
    demand_score: number;
  }[];

  product_name: string;

  participants: {
    seller_id: string;
    buyer_id: string;
    logistics_id?: string;
  };

  status:
    | "negotiating"
    | "active"
    | "completed";
};

export type Transport = {
  type: "sole" | "company";
  name: string;
  phone: string;
  plate_number: string;
  schedule?: {
    pattern: "one-time" | "weekly" | "monthly";
    start_date: string;
    end_date?: string;
    time_window: string;
    recurring_day?: number;
  };
}

export type Payment = {
  amount_cents: number;
  currency: "USD" | "RWF" | "EUR";
  proof?: string;
  proof_status?: "pending" | "verified" | "rejected";
  confirmed_by?: string[];
  account_number: string;
  method_of_payment: string;
};

export type MessageMetadata = {
  type?:
    | "dispute_opened"
    | "dispute_response"
    | "shipment_update"
    | "system_notice";

  logistics_id?: string;

  dispute_id?: string;

  audit_refs?: string[];
};

// tables

// entity
export const entities = pgTable(
  "entities",
  {
    id: varchar("id", {
      length: 30
    }).primaryKey(),

    type: entity_type_enum("type")
      .notNull(),

    created_at: timestamp(
      "created_at"
    ).defaultNow(),

    updated_at: timestamp(
      "updated_at"
    )
      .defaultNow()
      .$onUpdate(() => new Date()),
    is_deleted: boolean("is_deleted").default(false).notNull(),
    deleted_at: timestamp("deleted_at"),
  }
);

// users

export const users = pgTable(
  "users",
  {
    id: varchar("id", {
      length: 30
    })
      .primaryKey()
      .references(() => entities.id, {
        onDelete: "cascade"
      }),

    email: varchar("email", {
      length: 255
    })
      .notNull()
      .unique(),

    password: text("password")
      .notNull(),

    registration_number: varchar(
      "registration_number",
      {
        length: 100
      }
    ).notNull(),

    role: user_role("role")
      .default("user")
      .notNull(),

    metadata: jsonb("metadata")
      .$type<UserMeta>()
      .notNull(),

    created_at: timestamp(
      "created_at"
    ).defaultNow(),

    updated_at: timestamp(
      "updated_at"
    )
      .defaultNow()
      .$onUpdate(() => new Date()),
    is_deleted: boolean("is_deleted").default(false).notNull(),
    deleted_at: timestamp("deleted_at"),
  }
);

// rooms

export const rooms = pgTable(
  "rooms",
  {
    id: varchar("id", {
      length: 30
    })
      .primaryKey()
      .references(() => entities.id, {
        onDelete: "cascade"
      }),

    name: varchar("name", {
      length: 255
    }).notNull(),

    metadata: jsonb("metadata")
      .$type<RoomMeta>()
      .notNull(),

    contract: jsonb("contract")
      .$type<RoomContract>()
      .notNull(),

    permissions: jsonb("permissions")
      .$type<string[]>()
      .default(sql`'[]'::jsonb`)
      .notNull(),

    created_at: timestamp(
      "created_at"
    ).defaultNow(),

    updated_at: timestamp(
      "updated_at"
    )
      .defaultNow()
      .$onUpdate(() => new Date()),

    is_deleted: boolean("is_deleted").default(false).notNull(),
    deleted_at: timestamp("deleted_at")}
);

// room_member

export const room_members = pgTable(
  "room_members",
  {
    room_id: varchar("room_id", {
      length: 30
    })
      .references(() => rooms.id, {
        onDelete: "cascade"
      })
      .notNull(),

    user_id: varchar("user_id", {
      length: 30
    })
      .references(() => users.id, {
        onDelete: "cascade"
      })
      .notNull(),

    created_at: timestamp(
      "created_at"
    ).defaultNow(),
    is_deleted: boolean("is_deleted").default(false).notNull(),
    deleted_at: timestamp("deleted_at"),
  },
  (t) => [
    primaryKey({
      name: "room_members_pk",
      columns: [t.room_id, t.user_id]
    })
  ]
);

// post

export const posts = pgTable(
  "posts",
  {
    id: varchar("id", {
      length: 30
    }).primaryKey(),

    entity_id: varchar("entity_id", {
      length: 30
    })
      .references(() => entities.id, {
        onDelete: "cascade"
      })
      .notNull(),

    content: jsonb("content")
      .$type<PostContent>()
      .notNull(),

    status: post_status_enum("status")
      .default("active")
      .notNull(),

    created_at: timestamp(
      "created_at"
    ).defaultNow(),

    updated_at: timestamp(
      "updated_at"
    )
      .defaultNow()
      .$onUpdate(() => new Date()),

    deleted_at: timestamp(
      "deleted_at"
    ),
    is_deleted: boolean("is_deleted").default(false).notNull(),
  },
  (t) => [
    index("post_entity_idx").on(
      t.entity_id
    )
  ]
);

// items

export const items = pgTable(
  "items",
  {
    id: varchar("id", {
      length: 30
    }).primaryKey(),

    room_id: varchar("room_id", {
      length: 30
    })
      .references(() => rooms.id, {
        onDelete: "cascade"
      })
      .notNull(),

    amount_cents: integer(
      "amount_cents"
    ).notNull(),

    analytics: jsonb("analytics")
      .$type<ItemAnalytics>()
      .notNull(),

    created_at: timestamp(
      "created_at"
    ).defaultNow(),

    updated_at: timestamp(
      "updated_at"
    )
      .defaultNow()
      .$onUpdate(() => new Date()),
    is_deleted: boolean("is_deleted").default(false).notNull(),
    deleted_at: timestamp("deleted_at"),
  },
  (t) => [
    index("item_room_idx").on(
      t.room_id
    )
  ]
);

// message

export const messages = pgTable(
  "messages",
  {
    id: varchar("id", {
      length: 30
    }).primaryKey(),

    room_id: varchar("room_id", {
      length: 30
    }).references(() => rooms.id, {
      onDelete: "cascade"
    }),

    participants: jsonb(
      "participants"
    )
      .$type<string[]>()
      .default(sql`'[]'::jsonb`)
      .notNull(),

    from_id: varchar("from_id", {
      length: 30
    })
      .references(() => entities.id, {
        onDelete: "cascade"
      })
      .notNull(),

    body: text("body").notNull(),

    metadata: jsonb("metadata")
      .$type<MessageMetadata>(),

    flag: message_flag_enum("flag")
      .default("chat")
      .notNull(),

    created_at: timestamp(
      "created_at"
    ).defaultNow(),
    is_deleted: boolean("is_deleted").default(false).notNull(),
    deleted_at: timestamp("deleted_at"),
  },
  (t) => [
    index("msg_from_idx").on(
      t.from_id
    ),

    index("msg_room_idx").on(
      t.room_id
    )
  ]
);

//  logistic

export const logistics = pgTable(
  "logistics",
  {
    id: varchar("id", {
      length: 30
    }).primaryKey(),

    room_id: varchar("room_id", {
      length: 30
    })
      .references(() => rooms.id, {
        onDelete: "cascade"
      })
      .notNull(),

    item_id: varchar("item_id", {
      length: 30
    })
      .references(() => items.id, {
        onDelete: "cascade"
      })
      .notNull(),

    from_id: varchar("from_id", {
      length: 30
    })
      .references(() => entities.id, {
        onDelete: "cascade"
      })
      .notNull(),

    to_id: varchar("to_id", {
      length: 30
    })
      .references(() => entities.id, {
        onDelete: "cascade"
      })
      .notNull(),

    transport_metadata: jsonb(
      "transport_metadata"
    )
      .$type<Transport>()
      .notNull(),

    payment: jsonb("payment")
      .$type<Payment>()
      .notNull(),

    status: shipment_status_enum(
      "status"
    )
      .default("pending")
      .notNull(),

    created_at: timestamp(
      "created_at"
    ).defaultNow(),

    updated_at: timestamp(
      "updated_at"
    )
      .defaultNow()
      .$onUpdate(() => new Date()),
    is_deleted: boolean("is_deleted").default(false).notNull(),
    deleted_at: timestamp("deleted_at"),
  },
  (t) => [
    index("logistics_room_idx").on(
      t.room_id
    ),

    index("logistics_item_idx").on(
      t.item_id
    )
  ]
);

// dispute

export const disputes = pgTable(
  "disputes",
  {
    id: varchar("id", {
      length: 30
    }).primaryKey(),

    room_id: varchar("room_id", {
      length: 30
    })
      .references(() => rooms.id, {
        onDelete: "cascade"
      })
      .notNull(),

    logistics_id: varchar(
      "logistics_id",
      {
        length: 30
      }
    )
      .references(() => logistics.id)
      .notNull(),

    opened_by: varchar(
      "opened_by",
      {
        length: 30
      }
    )
      .references(() => users.id)
      .notNull(),

    arbitrator_id: varchar(
      "arbitrator_id",
      {
        length: 30
      }
    ).references(() => users.id),

    resolution: text("resolution"),

    claim: text("claim"),

    status: dispute_status_enum(
      "status"
    )
      .default("open")
      .notNull(),

    resolved: boolean("resolved")
      .default(false)
      .notNull(),

    selected_at: timestamp(
      "selected_at"
    ),

    created_at: timestamp(
      "created_at"
    ).defaultNow(),

    resolved_at: timestamp(
      "resolved_at"
    ),
    is_deleted: boolean("is_deleted").default(false).notNull(),
    deleted_at: timestamp("deleted_at"),
  },
  (t) => [
    index("dispute_room_idx").on(
      t.room_id
    ),

    index(
      "dispute_logistics_idx"
    ).on(t.logistics_id)
  ]
);

// session

export const sessions = pgTable(
  "sessions",
  {
    token: text("token")
      .primaryKey(),

    entity_id: varchar("entity_id", {
      length: 30
    })
      .references(() => entities.id, {
        onDelete: "cascade"
      })
      .notNull(),

    expires_at: timestamp(
      "expires_at"
    ).notNull()
  }
);

// audit logs

export const audit_logs = pgTable(
  "audit_logs",
  {
    id: varchar("id", {
      length: 30
    }).primaryKey(),

    entity_id: varchar("entity_id", {
      length: 30
    })
      .references(() => entities.id)
      .notNull(),

    action: text("action")
      .$type<AuditAction>()
      .notNull(),

    detail: text("detail"),

    flag: audit_flag_enum("flag")
      .default("info"),

    created_at: timestamp(
      "created_at"
    ).defaultNow()
  },
  (t) => [
    index("audit_entity_idx").on(
      t.entity_id
    )
  ]
);

//  select types

export type Entity =  typeof entities.$inferSelect;
export type User =  typeof users.$inferSelect;
export type Room =  typeof rooms.$inferSelect;
export type RoomMember =  typeof room_members.$inferSelect;
export type Post =  typeof posts.$inferSelect;
export type Item =  typeof items.$inferSelect;
export type Message =  typeof messages.$inferSelect;
export type Logistics =  typeof logistics.$inferSelect;
export type Dispute =  typeof disputes.$inferSelect;
export type Session =  typeof sessions.$inferSelect;
export type AuditLog =  typeof audit_logs.$inferSelect;

// Insert types

export type EntityInsert =  typeof entities.$inferInsert;
export type UserInsert =  typeof users.$inferInsert;
export type RoomInsert =  typeof rooms.$inferInsert;
export type RoomMemberInsert =  typeof room_members.$inferInsert;
export type PostInsert =  typeof posts.$inferInsert;
export type ItemInsert =  typeof items.$inferInsert;
export type MessageInsert =  typeof messages.$inferInsert;
export type LogisticsInsert =  typeof logistics.$inferInsert;
export type DisputeInsert =  typeof disputes.$inferInsert;
export type SessionInsert =  typeof sessions.$inferInsert;
export type AuditLogInsert = typeof audit_logs.$inferInsert;
