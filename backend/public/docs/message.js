export const messageDocs = [
  {
    name: "GET /api/messages/in",
    description: "Ping healthcheck endpoint to verify if the message gateway API layer is online and operational. Does not require authentication or route parameters.",
    request: {
      headers: {},
      query: {},
      body: {}
    },
    response: {
      msg: "in message api"
    },
    done: true
  },
  {
    name: "GET /api/messages/mymessages",
    description: "Fetch all message rows where the authenticated user context is listed as an active member inside the database string array column 'participants' (handles direct + room scoped matches). Uses standard pagination. Note: Internal database records format the message body string with structural metadata keys like '[senderIndex:timestamp]textContent'.",
    request: {
      headers: {
        Authorization: "Bearer <user_jwt_token>"
      },
      query: {
        limit: 50,
        offset: 0
      },
      body: {}
    },
    response: {
      msg: "success",
      ans: [
        {
          id: "message_msg001",
          room_id: null,
          created_at: "2026-05-21T14:22:00.000Z",
          is_deleted: false,
          deleted_at: null,
          metadata: {},
          participants: ["entity_current", "entity_other"],
          from_id: "entity_current",
          body: "[0:1779459720]Let me know when the stock arrives.",
          flag: "chat"
        }
      ]
    },
    done: true
  },
  {
    name: "GET /api/messages/admin/all",
    description: "Protected administrative workspace endpoint providing a raw, ordered snapshot of the complete global messaging table dataset. Access requires passing validation constraints across both authGuard and adminGuard layers.",
    request: {
      headers: {
        Authorization: "Bearer <admin_jwt_token>"
      },
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
          id: "message_msg999",
          room_id: "global_room",
          created_at: "2026-05-21T10:00:00.000Z",
          is_deleted: false,
          deleted_at: null,
          metadata: {
            type: "system_notice"
          },
          participants: ["entity_admin_id", "entity_user_x"],
          from_id: "entity_system",
          body: "[0:1779444000]Global maintenance notice updated.",
          flag: "system"
        }
      ]
    },
    done: true
  },
  {
    name: "POST /api/messages",
    description: "Publish a fresh communication unit string. Requires authorization headers. Messages targeting an omitted room_id parameter require a direct 'to_id' receiver property to safely derive and instantiate participant tracking pairs. 'message_flag' values fall back cleanly onto standard 'chat' status definitions if missing or outside specified system sets (e.g. system, notification, proposal, chat, dispute).",
    request: {
      headers: {
        Authorization: "Bearer <user_jwt_token>",
        "Content-Type": "application/json"
      },
      query: {},
      body: {
        to_id: "ENT_2002",
        room_id: null,
        body: "We can proceed with the agreement.",
        message_flag: "proposal",
        participants: [],
        metadata: {}
      }
    },
    response: {
      msg: "success",
      ans: {
        id: "message_gen554",
        room_id: null,
        created_at: "2026-05-21T21:05:00.000Z",
        is_deleted: false,
        deleted_at: null,
        metadata: {},
        participants: ["entity_sender_id", "ENT_2002"],
        from_id: "entity_sender_id",
        body: "[0:1779483900]We can proceed with the agreement.",
        flag: "proposal"
      }
    },
    done: true
  },
  {
    name: "PATCH /api/messages/:id/respond",
    description: "Append a fresh contextual reply string layer directly on top of an existing historical chat instance row text block. Internal parsing mechanisms safely look up historical arrays to confirm member access before transforming internal text values into compound hashes formatted like: '[new_index:time]new_message # old_body_chain'.",
    request: {
      headers: {
        Authorization: "Bearer <user_jwt_token>",
        "Content-Type": "application/json"
      },
      params: {
        id: "message_gen554"
      },
      query: {},
      body: {
        body: "Adding clarifying detail to the proposal sequence."
      }
    },
    response: {
      msg: "success",
      ans: {
        id: "message_gen554",
        room_id: null,
        created_at: "2026-05-21T21:05:00.000Z",
        is_deleted: false,
        deleted_at: null,
        metadata: {},
        participants: ["entity_sender_id", "ENT_2002"],
        from_id: "entity_sender_id",
        body: "[1:1779484100]Adding clarifying detail to the proposal sequence. # [0:1779483900]We can proceed with the agreement.",
        flag: "proposal"
      }
    },
    done: true
  },
  {
    name: "GET /api/messages/:roomId/room",
    description: "Fetch all database conversation entries tied strictly onto a concrete room parent relationship index field. Automatically orders history entries downward from the newest timestamp logs.",
    request: {
      headers: {
        Authorization: "Bearer <user_jwt_token>"
      },
      params: {
        roomId: "room_market_updates"
      },
      query: {
        limit: 100,
        offset: 0
      },
      body: {}
    },
    response: {
      msg: "success",
      ans: [
        {
          id: "message_rm01",
          room_id: "room_market_updates",
          created_at: "2026-05-21T09:00:00.000Z",
          is_deleted: false,
          deleted_at: null,
          metadata: {},
          participants: ["entity_user_a", "entity_user_b"],
          from_id: "entity_user_a",
          body: "[0:1779440400]Welcome to the group conversation thread!",
          flag: "chat"
        }
      ]
    },
    done: true
  },
  {
    name: "GET /api/messages/conversation/:id",
    description: "Pull matching private communication channels occurring between the requesting client and a target individual entity path variable. The controller relies on a temporary inside-memory sorting algorithm that queries global history blocks to extract records matching mutual participant fields.",
    request: {
      headers: {
        Authorization: "Bearer <user_jwt_token>"
      },
      params: {
        id: "entity_target_id"
      },
      query: {
        limit: 50,
        offset: 0
      },
      body: {}
    },
    response: {
      msg: "success",
      ans: [
        {
          id: "message_x7812",
          room_id: null,
          created_at: "2026-05-21T19:30:11.000Z",
          is_deleted: false,
          deleted_at: null,
          metadata: {},
          participants: ["entity_current_id", "entity_target_id"],
          from_id: "entity_target_id",
          body: "[1:1779478211]Received your order invoice.",
          flag: "chat"
        }
      ]
    },
    done: true
  },
  {
    name: "DELETE /api/messages/:id",
    description: "Triggers soft-deletion of a targeted data row by mapping tracking parameters onto true boolean flags and configuring server clock timestamps into the 'deleted_at' slot index. Execution remains gated exclusively under authGuard and adminGuard validation controls.",
    request: {
      headers: {
        Authorization: "Bearer <admin_jwt_token>"
      },
      params: {
        id: "message_to_purge"
      },
      query: {},
      body: {}
    },
    response: {
      msg: "success",
      ans: {
        id: "message_to_purge",
        room_id: null,
        created_at: "2026-05-21T11:00:00.000Z",
        is_deleted: true,
        deleted_at: "2026-05-31T16:41:00.000Z",
        metadata: {},
        participants: ["entity_owner_id", "entity_recipient"],
        from_id: "entity_owner_id",
        body: "[0:1779447600]Accidental or redacted message copy text goes here.",
        flag: "chat"
      }
    },
    done: true
  }
];
