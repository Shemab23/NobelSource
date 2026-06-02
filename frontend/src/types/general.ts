export type user_role = "user"|"admin";


export type entity_type_enum =  "user"| "room";

export type  post_status_enum = "active"| "filled"| "expired";

export type shipment_status_enum =  "pending"| "in_transit"| "collected"| "delivered"| "canceled"| "paid";

export type thread_status_enum = "open" | "closed";

export type audit_flag_enum = "info"| "critical"| "security_breach"

export type message_flag_enum =  "system" | "notification"| "proposal"| "chat";

export type AuditAction = 'CREATE' | 'UPDATE' | 'DELETE'| 'SIGN_CONTRACT'|'VERIFY_CREDENTIAL' | 'LOGIN' | 'SWITCH_PERSONA' | 'DISPUTE';

export type AuditFlag = 'info'| 'critical'| 'security_breach';

export type Currency = "USD"| "RWF"|"EUR";

export type permission_status = "authorised"| "denied"| "pending";

export type TransportType = "sole"| "company";

export type  supported_platform = "whatsapp"| "telegram"| "youtube"|"instagram"|"linkedin" | "twitter"| "tiktok"| "snapchat"| "facebook";

export type Profile = {
    name: string;
    image?: string;
    phone?: string;
    country?: string;
    website?: string;
    currency?: Currency;
};

export type Permission = {
    right: string;
    status: PermissionStatus;
    by: string;
    document: string;
};

export type User_meta = {
  profile: Profile;
  rating?: number;
  permissions?: Permission[]
};

export type members_rules = {
    actor: string;
    role: string;
    isAdmin: boolean;
}

export type Room_meta = {
  description?: string;
  tags?: string[];
  members_rules?: members_rules[];
};

export type Room_Contract = {
  introduction: string;
  terms: string;
  version: number;
};

export type PostContent = {
  title: string;
  body: string;
  media?: string[];
};
export type Weekly_status = {
    week_ending: string;
    total_sales: number;
    expense: number;
    demand_score: number;
}
export type ItemAnalytics = {
  instore: number;
  weekly_status?: Weekly_status[];
};
export type Transport = {
  type: TransportType;
  name: string;
  phone: string;
  plate_number: string;
};
export type Payment = {
  amount: number;
  currency: Currency;
};

// table based
export type Entity = {
  id: string;
  type: entity_type_enum;
  created_at: string;
  updated_at: string;
}

export type User = {
  id: string;
  email: string;
  password: string;
  registration_number: string;
  role: user_role;
  metadata: User_meta;
  created_at: string;
  updated_at: string;
}

export type Room = {
  id: string;
  name: string;
  metadata: Room_meta;
  contract: Room_Contract;
  permissions: string[];
  created_at: string;
  updated_at: string;
}

export type Room_members = {
  room_id: string;
  user_id: string;
  created_at: string;
}

export type Post = {
  id: string;
  entity_id: string;
  content: PostContent;
  status: post_status_enum;
  created_at: string;
  updated_at: string;
}

export type Item = {
  id: string;
  room_id: string;
  amount: string;
  analytics: ItemAnalytics;
  created_at: string;
}

export type Messages = {
  id: string;
  from_id: string;
  to_id: string;
  body: string;
  flag: message_flag_enum;
  created_at: string;
}

export type Logistics = {
  id: string;
  item_id: string;
  from_id: string;
  to_id: string;
  transport_metadata: Transport;
  payment: Payment;
  status: shipment_status_enum;
  created_at: string;
}

export type Sessions = {
  id: string;
  user_id: string;
  created_at: string;
}

export type Audit_logs = {
  id: string;
  entity_id: string;
  action: string;
  detail: string;
  flag: string;
  created_at: string;
}

export type Methods = "GET" | "POST" | "PUT" | "DELETE";
