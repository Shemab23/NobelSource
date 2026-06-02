export const roomDocs = [
  {
    name: "POST /api/rooms",
    description: "Initializes a brand-new workspace contract room, automatically fetches the creating actor's user profile to inherit and accredit 'authorised' functional permissions to the group, assigns the creator as the founding room member, and registers a 'CREATE' audit track record. The request supports a shortcut macro 'me' which automatically converts to the active context actor's ID inside metadata fields and signatures. It sanitizes input rule objects to block unauthorized privilege escalation requests.",
    request: {
      name: "Kigali Logistics Hub Alpha",
      metadata: {
        description: "Exclusive escrow group chat for Eastern Corridor freight logistics clearing operations.",
        tags: ["freight", "escrow", "rwanda", "east_africa"],
        members_rules: [
          {
            actor: "USR_ADMIN001",
            role: "Moderator",
            isAdmin: false
          }
        ],
        goals: {
          monthly_target: 1500000,
          currency: "RWF"
        }
      },
      contract: {
        version: 1,
        introduction: "This binding digital charter details rules governing multi-party escrow clearing pools.",
        sections: {
          shipment_rules: "All consignments must be loaded with active GPS logging trackers active within 2 hours.",
          payment_terms: "Funds clear only when two or more distinct participants log signatures via confirmation nodes.",
          penalties: "Late drop-offs exceeding 24 hours incur an automated 10% cash deduction penalty.",
          dispute_resolution: "Unresolved contract exceptions automatically dispatch case files to platform arbitrators."
        },
        metadata: {
          provider_id: "me",
          receiver_id: "USR_ADMIN001",
          jurisdiction: "USR_ARB001"
        },
        signed: ["me"]
      }
    },
    response: {
      msg: "success",
      ans: {
        id: "RM_20269322535ab58c64ea",
        name: "Kigali Logistics Hub Alpha",
        metadata: {
          description: "Exclusive escrow group chat for Eastern Corridor freight logistics clearing operations.",
          tags: ["freight", "escrow", "rwanda", "east_africa"],
          members_rules: [
            {
              actor: "USR_ADMIN001",
              role: "Moderator",
              isAdmin: false
            },
            {
              actor: "USR_CURRENT_ACTOR_ID",
              role: "admin",
              isAdmin: true
            }
          ],
          goals: {
            monthly_target: 1500000,
            currency: "RWF"
          }
        },
        contract: {
          version: 1,
          introduction: "This binding digital charter details rules governing multi-party escrow clearing pools.",
          sections: {
            shipment_rules: "All consignments must be loaded with active GPS logging trackers active within 2 hours.",
            payment_terms: "Funds clear only when two or more distinct participants log signatures via confirmation nodes.",
            penalties: "Late drop-offs exceeding 24 hours incur an automated 10% cash deduction penalty.",
            dispute_resolution: "Unresolved contract exceptions automatically dispatch case files to platform arbitrators."
          },
          metadata: {
            provider_id: "USR_CURRENT_ACTOR_ID",
            receiver_id: "USR_ADMIN001",
            jurisdiction: "USR_ARB001"
          },
          signed: ["USR_CURRENT_ACTOR_ID"]
        },
        permissions: ["SHIPMENT_OPERATOR", "ESCROW_SIGNER"],
        created_at: "2026-05-31T03:13:56.259Z",
        updated_at: "2026-05-31T03:13:56.259Z",
        is_deleted: false,
        deleted_at: null
      }
    },
    done: true
  },

  {
    name: "GET /api/rooms/mine",
    description: "Secure parameterless retrieval of all active, un-deleted workspace contract rooms where the authenticated token actor is an established participant. Queries entries directly using a high-utility room_members junction join inside a database transaction block and saves an evaluation trail log.",
    request: null,
    response: {
      msg: "success",
      ans: [
        {
          id: "RM_20269322535ab58c64ea",
          name: "Kigali Logistics Hub Alpha",
          permissions: ["SHIPMENT_OPERATOR"],
          metadata: {},
          contract: {},
          created_at: "2026-05-31T03:13:56.259Z",
          updated_at: "2026-05-31T03:13:56.259Z",
          is_deleted: false,
          deleted_at: null
        }
      ]
    },
    done: true
  },

  {
    name: "GET /api/rooms/:id",
    description: "Fetches complete layout data fields for a single target room utilizing its active unique identification hash token.",
    request: null,
    response: {
      msg: "success",
      ans: {
        id: "RM_20269322535ab58c64ea",
        name: "Kigali Logistics Hub Alpha",
        metadata: {},
        contract: {},
        permissions: [],
        created_at: "2026-05-31T03:13:56.259Z",
        updated_at: "2026-05-31T03:13:56.259Z",
        is_deleted: false,
        deleted_at: null
      }
    },
    done: true
  },

  {
    name: "PATCH /api/rooms/:id",
    description: "Performs explicit level-by-level spreading mutations onto the target room entry. Primitives are cleanly replaced, while nested sub-objects (goals, contract metadata, sections) are combined. Crucially, array fields (tags, signed, members_rules) are appended natively instead of overwritten, and are instantly passed through Set and Map mechanisms to filter out data duplicates or repetitions. 'me' macros are dynamically substituted with the actor's session identifier.",
    request: {
      metadata: {
        tags: ["east_africa_express"],
        goals: {
          monthly_target: 2000000
        }
      },
      contract: {
        signed: ["me"]
      }
    },
    response: {
      msg: "success",
      ans: {
        id: "RM_20269322535ab58c64ea",
        name: "Kigali Logistics Hub Alpha",
        metadata: {
          description: "Exclusive escrow group chat for Eastern Corridor freight logistics clearing operations.",
          tags: ["freight", "escrow", "rwanda", "east_africa", "east_africa_express"],
          members_rules: [
            {
              actor: "USR_CURRENT_ACTOR_ID",
              role: "admin",
              isAdmin: true
            }
          ],
          goals: {
            monthly_target: 2000000,
            currency: "RWF"
          }
        },
        contract: {
          version: 1,
          sections: {},
          metadata: {},
          signed: ["USR_CURRENT_ACTOR_ID"]
        },
        created_at: "2026-05-31T03:13:56.259Z",
        updated_at: "2026-05-31T03:22:15.958Z",
        is_deleted: false,
        deleted_at: null
      }
    },
    done: true
  },

  {
    name: "PATCH /api/rooms/:id/soft-delete",
    description: "Executes a transaction-locked soft-deletion protocol. Flips the internal database is_deleted visibility flat status to true, stamps current timestamps on deleted_at parameters, calls entityService cleanup methods, and logs a critical audit trail entry.",
    request: null,
    response: {
      msg: "success",
      ans: {
        id: "RM_20269322535ab58c64ea",
        is_deleted: true,
        deleted_at: "2026-05-31T03:25:00.000Z",
        updated_at: "2026-05-31T03:25:00.000Z"
      }
    },
    done: true
  },

  {
    name: "GET /api/rooms/:id/financials",
    description: "Aggregates complex, real-time financial intelligence variables for the room inside a unified transaction. It scans all linked items to calculate aggregate valuation recorded cents, gross sales cents from closed contracts, operating expenses, and margins. It measures progress percentage vectors against monthly targets, tracks inventory anomalies (where items instore dip below zero), and combines historical item trends by matching week-ending dates cleanly.",
    request: null,
    response: {
      msg: "success",
      ans: {
        room_id: "RM_20269322535ab58c64ea",
        room_name: "Kigali Logistics Hub Alpha",
        currency_scope: "RWF",
        pipeline_summary: {
          total_items_tracked: 3,
          active_listings: 1,
          negotiating_threads: 1,
          closed_deals: 1
        },
        financial_totals: {
          total_valuation_recorded_cents: 850000,
          gross_sales_cents: 350000,
          operating_expenses_cents: 70000,
          net_profit_cents: 280000
        },
        goal_tracking: {
          monthly_target_cents: 1500000,
          completion_percentage: 23.33,
          target_status: "IN_PROGRESS"
        },
        inventory_integrity: {
          unlogged_stock_warnings: 0,
          status: "STABLE"
        },
        interaction_analytics: {
          global_demand_score: 14
        },
        weekly_trend_history: [
          {
            week_ending: "2026-06-06",
            total_sales: 350000,
            expense: 70000,
            demand_score: 14
          }
        ]
      }
    },
    done: true
  },

  {
    name: "GET /api/rooms/:id/items",
    description: "Retrieves an array of all active, un-deleted inventory item rows linked directly to this room's context parameters. Enforces shared transaction mapping isolation and registers a standard telemetry audit log.",
    request: null,
    response: {
      msg: "success",
      ans: [
        {
          id: "ITEM_2026af9032",
          room_id: "RM_20269322535ab58c64ea",
          amount_cents: 350000,
          analytics: {
            instore: 12,
            product_name: "Industrial Wood Pallets",
            participants: {
              seller_id: "USR_ADMIN001",
              buyer_id: "USR_BUY002"
            },
            status: "completed"
          },
          created_at: "2026-05-31T03:15:00.000Z",
          updated_at: "2026-05-31T03:18:00.000Z",
          is_deleted: false,
          deleted_at: null
        }
      ]
    },
    done: true
  },

  {
    name: "GET /api/rooms/all",
    description: "Administrative directory search locked strictly behind adminGuard. Accepts query limits and offsets parameters, cleans boundaries to a maximum 50-row window limit, and files granular metrics inside transaction tracking records.",
    request: null,
    response: {
      msg: "success",
      ans: [
        {
          id: "RM_20269322535ab58c64ea",
          name: "Kigali Logistics Hub Alpha",
          is_deleted: false
        }
      ]
    },
    done: true
  }
];
