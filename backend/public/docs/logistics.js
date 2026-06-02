export const logisticsDocs = [
{
    name: "POST /api/logistics/:focus",
    description: "Initialize a new shipment contract row entry. Gated under authGuard. The path variable ':focus' is strictly mandatory and can only be set to either 'to' or 'from'. If focus is 'to', the actor context maps to 'from_id', and 'from_id' inside the body represents the recipient context. If focus is 'from', the actor context maps to 'to_id', and 'to_id' inside the body represents the sender context. Misaligned focus variables return a 400 bad request status.",
    request: {
      headers: {
        Authorization: "Bearer <user_jwt_token>",
        "Content-Type": "application/json"
      },
      params: {
        focus: "to"
      },
      query: {},
      body: {
        item_id: "item_xyz123",
        room_id: "room_market_99",
        from_id: "entity_recipient_456",
        transport_metadata: {
          type: "sole",
          name: "John Transport Services",
          phone: "+250788123456",
          plate_number: "RAA 123 A",
          schedule: {
            pattern: "one-time",
            start_date: "2026-06-01",
            time_window: "08:00 - 12:00"
          }
        },
        payment: {
          amount_cents: 15000,
          currency: "USD",
          account_number: "BK-902184-XYZ",
          method_of_payment: "bank_transfer",
          confirmed_by: []
        }
      }
    },
    response: {
      msg: "success",
      ans: {
        id: "logistics_gen789",
        room_id: "room_market_99",
        status: "pending",
        from_id: "entity_actor_777",
        item_id: "item_xyz123",
        to_id: "entity_recipient_456",
        transport_metadata: {
          type: "sole",
          name: "John Transport Services",
          phone: "+250788123456",
          plate_number: "RAA 123 A",
          schedule: {
            pattern: "one-time",
            start_date: "2026-06-01",
            time_window: "08:00 - 12:00"
          }
        },
        payment: {
          amount_cents: 15000,
          currency: "USD",
          account_number: "BK-902184-XYZ",
          method_of_payment: "bank_transfer",
          confirmed_by: []
        },
        created_at: "2026-05-31T17:00:00.000Z",
        updated_at: "2026-05-31T17:00:00.000Z",
        is_deleted: false,
        deleted_at: null
      }
    },
    done: true
  },

  {
    name: "GET /api/logistics",
    description: "Protected administrative global indexing service listing all available non-deleted shipment logs sequentially sorted downward from their creation timeline coordinates. Controlled via standard limits and offsets.",
    request: {
      headers: {
        Authorization: "Bearer <user_jwt_token>"
      },
      params: {},
      query: {
        limit: 10,
        offset: 0
      },
      body: {}
    },
    response: {
      msg: "success",
      ans: [
        {
          id: "logistics_gen789",
          room_id: "room_market_99",
          status: "pending",
          from_id: "entity_actor_777",
          item_id: "item_xyz123",
          to_id: "entity_recipient_456",
          transport_metadata: {
            type: "sole",
            name: "John Transport Services",
            phone: "+250788123456",
            plate_number: "RAA 123 A"
          },
          payment: {
            amount_cents: 15000,
            currency: "USD",
            account_number: "BK-902184-XYZ",
            method_of_payment: "bank_transfer",
            confirmed_by: []
          },
          created_at: "2026-05-31T17:00:00.000Z",
          updated_at: "2026-05-31T17:00:00.000Z",
          is_deleted: false,
          deleted_at: null
        }
      ]
    },
    done: true
  },

  {
    name: "GET /api/logistics/:id",
    description: "Look up a particular shipment instance structure directly from its alphanumeric primary key value parameter. Returns 404 if missing or if the active record row has had its deletion tracking flag flagged.",
    request: {
      headers: {
        Authorization: "Bearer <user_jwt_token>"
      },
      params: {
        id: "logistics_gen789"
      },
      query: {},
      body: {}
    },
    response: {
      msg: "success",
      ans: {
        id: "logistics_gen789",
        room_id: "room_market_99",
        status: "in_transit",
        from_id: "entity_actor_777",
        item_id: "item_xyz123",
        to_id: "entity_recipient_456",
        transport_metadata: {
          type: "sole",
          name: "John Transport Services",
          phone: "+250788123456",
          plate_number: "RAA 123 A"
        },
        payment: {
          amount_cents: 15000,
          currency: "USD",
          account_number: "BK-902184-XYZ",
          method_of_payment: "bank_transfer",
          confirmed_by: []
        },
        created_at: "2026-05-31T17:00:00.000Z",
        updated_at: "2026-05-31T17:15:00.000Z",
        is_deleted: false,
        deleted_at: null
      }
    },
    done: true
  },

  {
    name: "GET /api/logistics/item/:item_id",
    description: "Query and isolate all non-deleted shipment contract collections referencing a concrete inventory parent primary item key index. Yields a structured array layer inside the response envelope.",
    request: {
      headers: {
        Authorization: "Bearer <user_jwt_token>"
      },
      params: {
        item_id: "item_xyz123"
      },
      query: {},
      body: {}
    },
    response: {
      msg: "success",
      ans: [
        {
          id: "logistics_gen789",
          room_id: "room_market_99",
          status: "pending",
          from_id: "entity_actor_777",
          item_id: "item_xyz123",
          to_id: "entity_recipient_456",
          transport_metadata: {
            type: "sole",
            name: "John Transport Services",
            phone: "+250788123456",
            plate_number: "RAA 123 A"
          },
          payment: {
            amount_cents: 15000,
            currency: "USD",
            account_number: "BK-902184-XYZ",
            method_of_payment: "bank_transfer",
            confirmed_by: []
          },
          created_at: "2026-05-31T17:00:00.000Z",
          updated_at: "2026-05-31T17:00:00.000Z",
          is_deleted: false,
          deleted_at: null
        }
      ]
    },
    done: true
  },

  {
    name: "GET /api/logistics/room/:roomId",
    description: "Multi-layered operational cascade listing all logistics profiles corresponding to items grouped in a space. Loops inside-memory through the room items collection to resolve paired logistics logs.",
    request: {
      headers: {
        Authorization: "Bearer <user_jwt_token>"
      },
      params: {
        roomId: "room_market_99"
      },
      query: {},
      body: {}
    },
    response: {
      msg: "success",
      ans: [
        {
          item: {
            id: "item_xyz123",
            room_id: "room_market_99",
            amount_cents: 15000,
            analytics: {
              instore: 45,
              product_name: "Industrial Core Engine",
              participants: {
                seller_id: "entity_actor_777",
                buyer_id: "entity_recipient_456",
                logistics_id: "logistics_gen789"
              },
              status: "negotiating"
            },
            created_at: "2026-05-31T16:00:00.000Z",
            updated_at: "2026-05-31T16:00:00.000Z",
            is_deleted: false,
            deleted_at: null
          },
          logistics: [
            {
              id: "logistics_gen789",
              room_id: "room_market_99",
              status: "in_transit",
              from_id: "entity_actor_777",
              item_id: "item_xyz123",
              to_id: "entity_recipient_456",
              transport_metadata: {
                type: "sole",
                name: "John Transport Services",
                phone: "+250788123456",
                plate_number: "RAA 123 A"
              },
              payment: {
                amount_cents: 15000,
                currency: "USD",
                account_number: "BK-902184-XYZ",
                method_of_payment: "bank_transfer",
                confirmed_by: []
              },
              created_at: "2026-05-31T17:00:00.000Z",
              updated_at: "2026-05-31T17:15:00.000Z",
              is_deleted: false,
              deleted_at: null
            }
          ]
        }
      ]
    },
    done: true
  },

  {
    name: "GET /api/logistics/:id/pipeline",
    description: "Extract comprehensive timeline diagnostic records tracking a shipment's life cycle. Under-the-hood parameters pull a full list of audit logs tied to the shipment's participants where the action value string matches 'SHIPMENT'.",
    request: {
      headers: {
        Authorization: "Bearer <user_jwt_token>"
      },
      params: {
        id: "logistics_gen789"
      },
      query: {},
      body: {}
    },
    response: {
      msg: "success",
      ans: {
        shipment: [
          {
            id: "audit_001",
            entity_id: "entity_actor_777",
            action: "SHIPMENT",
            flag: "info",
            detail: "Shipment logistics_gen789 created by user : entity_actor_777",
            created_at: "2026-05-31T17:00:00.000Z"
          },
          {
            id: "audit_002",
            entity_id: "entity_actor_777",
            action: "SHIPMENT",
            flag: "info",
            detail: "User entity_actor_777 updated shipment logistics_gen789 status from pending to collected,Note: Package picked up from docking bay.",
            created_at: "2026-05-31T17:10:00.000Z"
          }
        ]
      }
    },
    done: true
  },

  {
    name: "PATCH /api/logistics/:id/status",
    description: "Transition a shipment contract into a different phase tracking space. Gated strictly by the ALLOWED_TRANSITIONS structural state mapping dictionary. Non-compliant status jumps or out-of-order calls output a 400 failed_to_update response code parameter.",
    request: {
      headers: {
        Authorization: "Bearer <user_jwt_token>",
        "Content-Type": "application/json"
      },
      params: {
        id: "logistics_gen789"
      },
      query: {},
      body: {
        status: "collected",
        note: "Package picked up from docking bay."
      }
    },
    response: {
      msg: "success",
      ans: {
        id: "logistics_gen789",
        room_id: "room_market_99",
        status: "collected",
        from_id: "entity_actor_777",
        item_id: "item_xyz123",
        to_id: "entity_recipient_456",
        transport_metadata: {
          type: "sole",
          name: "John Transport Services",
          phone: "+250788123456",
          plate_number: "RAA 123 A"
        },
        payment: {
          amount_cents: 15000,
          currency: "USD",
          account_number: "BK-902184-XYZ",
          method_of_payment: "bank_transfer",
          confirmed_by: []
        },
        created_at: "2026-05-31T17:00:00.000Z",
        updated_at: "2026-05-31T17:10:00.000Z",
        is_deleted: false,
        deleted_at: null
      }
    },
    done: true
  },

  {
    name: "PATCH /api/logistics/:id/payment-release",
    description: "Initiate payment processing. Handled exclusively as multipart/form-data. Requires 'amount' and 'rate' parameters passed as text fields. Accepts one optional file upload via form field identifier name 'proof' which processes through Cloudinary pipelines. Valid text string rate attributes must stay inside scale parameters from 0 to 5 inclusive, which calculates a running average rating adjustment against the provider account row context ('from_id').",
    request: {
      headers: {
        Authorization: "Bearer <user_jwt_token>",
        "Content-Type": "multipart/form-data"
      },
      params: {
        id: "logistics_gen789"
      },
      query: {},
      body: {
        amount: "15000",
        rate: "4.5"
      },
      file: {
        proof: "Binary image file buffer payload content"
      }
    },
    response: {
      msg: "success",
      ans: {
        id: "logistics_gen789",
        room_id: "room_market_99",
        status: "delivered",
        from_id: "entity_actor_777",
        item_id: "item_xyz123",
        to_id: "entity_recipient_456",
        transport_metadata: {
          type: "sole",
          name: "John Transport Services",
          phone: "+250788123456",
          plate_number: "RAA 123 A"
        },
        payment: {
          amount_cents: 15000,
          currency: "USD",
          account_number: "BK-902184-XYZ",
          method_of_payment: "bank_transfer",
          proof: "cloudinary.com",
          confirmed_by: ["entity_actor_777"]
        },
        created_at: "2026-05-31T17:00:00.000Z",
        updated_at: "2026-05-31T17:25:00.000Z",
        is_deleted: false,
        deleted_at: null
      }
    },
    done: true
  },

  {
    name: "PATCH /api/logistics/:id/payment-confirm",
    description: "Counterparty validation signing execution loop. Gated via authGuard. Takes a numeric string parameter 'rate' from the body to process a weighted moving average adjustment on the receiver account ('to_id'). If the confirmation array length reaches or exceeds 2 signing keys, 'proof_status' updates to 'verified', inventory levels deduct inside connected item records, and item status sets to 'completed'.",
    request: {
      headers: {
        Authorization: "Bearer <user_jwt_token>",
        "Content-Type": "application/json"
      },
      params: {
        id: "logistics_gen789"
      },
      query: {},
      body: {
        rate: "5"
      }
    },
    response: {
      msg: "success",
      ans: {
        id: "logistics_gen789",
        room_id: "room_market_99",
        status: "delivered",
        from_id: "entity_actor_777",
        item_id: "item_xyz123",
        to_id: "entity_recipient_456",
        transport_metadata: {
          type: "sole",
          name: "John Transport Services",
          phone: "+250788123456",
          plate_number: "RAA 123 A"
        },
        payment: {
          amount_cents: 15000,
          currency: "USD",
          account_number: "BK-902184-XYZ",
          method_of_payment: "bank_transfer",
          proof: "cloudinary.com",
          proof_status: "verified",
          confirmed_by: ["entity_actor_777", "entity_recipient_456"]
        },
        created_at: "2026-05-31T17:00:00.000Z",
        updated_at: "2026-05-31T17:30:00.000Z",
        is_deleted: false,
        deleted_at: null
      }
    },
    done: true
  },

  {
    name: "DELETE /api/logistics/:id",
    description: "Cancel active logistics contract. Admin restricted access requires authGuard + adminGuard headers. If status is already marked as 'delivered', updates trigger a 403 forbidden error tracking condition. Successful operations transition status to 'canceled', mark 'is_deleted' as true, and append deletion dates.",
    request: {
      headers: {
        Authorization: "Bearer <admin_jwt_token>"
      },
      params: {
        id: "logistics_gen789"
      },
      query: {},
      body: {}
    },
    response: {
      msg: "success",
      ans: {
        id: "logistics_gen789",
        room_id: "room_market_99",
        status: "canceled",
        from_id: "entity_actor_777",
        item_id: "item_xyz123",
        to_id: "entity_recipient_456",
        transport_metadata: {
          type: "sole",
          name: "John Transport Services"
        },
        payment: {
          amount_cents: 15000,
          currency: "USD"
        },
        created_at: "2026-05-31T17:00:00.000Z",
        updated_at: "2026-05-31T17:40:00.000Z",
        is_deleted: true,
        deleted_at: "2026-05-31T17:40:00.000Z"
      }
    },
    done: true
  }
];
