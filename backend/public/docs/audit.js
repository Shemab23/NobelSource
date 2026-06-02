export const auditDocs = [
  {
    name: "GET /api/audit",
    description: "Fetches a global, chronologically ordered feed (newest first) of all active audit records across the system and logs an 'ADMIN ACTION' tracking row. Strictly gated behind administrative check middlewares. Requires an authorized token context containing an actor entity_id. Throws a 401 status code if the user context is missing. If limit or offset values are omitted or non-numeric, the service layer applies explicit fallback values (limit = 20, offset = 0) override parameters.",
    request: {
      headers: {
        Authorization: "Bearer <token>"
      },
      params: {},
      query: {
        limit: "number (Optional. Controller default: 50. Service fallback: 20)",
        offset: "number (Optional. Controller default: 0. Service fallback: 0)"
      },
      body: {}
    },
    response: {
      msg: "success",
      ans: [
        {
          id: "aud_928374ab",
          entity_id: "usr_102938ff",
          action: "ADMIN ACTION",
          detail: "User of id: usr_102938ff queried 50 audits ;time: Sun May 31 2026 17:19:00 GMT+0000",
          flag: "log",
          created_at: "2026-05-31T17:19:00.000Z"
        }
      ]
    },
    done: true
  },

  {
    name: "GET /api/audit/entity/:id",
    description: "Retrieves a chronologically ordered list of log actions performed by or against a specific target entity identifier. Automatically appends a new tracking row into the audit system registering this inspection history. Requires an authorized user token context or drops with a 401 error. Evaluates numbers using runtime validation logic checks: if limit is less than or equal to 0, it falls back to 10; if offset is less than 0, it falls back to 0. Emits a 500 status code on unexpected internal database transaction connection failures.",
    request: {
      headers: {
        Authorization: "Bearer <token>"
      },
      params: {
        id: "string (The user ID or room ID whose audit footprint is being inspected)"
      },
      query: {
        limit: "number (Optional. Controller default: 50. Service fallback: 10 if "
      },
      params: {
        id: "string (The precise ID of the targeted audit item)"
      },
      query: {},
      body: {}
    },
    response: {
      msg: "success",
      ans: {
        id: "aud_883920fe",
        entity_id: "usr_443322aa",
        action: "SECURITY_BREACH",
        detail: "Unauthorised access attempt blocked at resource route layer",
        flag: "critical",
        created_at: "2026-05-30T14:22:15.000Z"
      }
    },
    done: true
  },

  // ==========================================
  // ROOM TIMELINE
  // ==========================================

  {
    name: "GET /api/audit/room/:roomId",
    description: "Aggregates an operational timeline tracking row activity for a conversation room layout structure. It performs a sequential twin-layer resolution chain: first, it fetches room member records via the RoomMembersService helper mapping target user IDs. If the collection returns empty or missing, it halts execution immediately and throws a 404 status code with an empty payload array. Otherwise, it extracts individual user IDs and queries matching entity rows via inArray parameters. Query defaults fall back to limit = 50 and offset = 0 if omitted.",
    request: {
      headers: {
        Authorization: "Bearer <token>"
      },
      params: {
        roomId: "string (The unique room ID identifier)"
      },
      query: {
        limit: "number (Optional. System default: 50)",
        offset: "number (Optional. System default: 0)"
      },
      body: {}
    },
    response: {
      msg: "success",
      ans: [
        {
          id: "aud_774920aa",
          entity_id: "usr_member11",
          action: "UPDATE",
          detail: "entity id: room_abc123 changed to type room by actor :usr_member11",
          flag: "log",
          created_at: "2026-05-31T12:00:00.000Z"
        }
      ]
    },
    done: true
  },

  // ==========================================
  // TIME FILTER
  // ==========================================

  {
    name: "GET /api/audit/since",
    description: "Filters and yields all historical logs captured sequentially after a specific threshold chronological mark using a greater-than (gt) conditional query check parameter. Evaluates inputs meticulously using instance matching: if the since query parameter is invalid, unrecognizable, or cannot be parsed into a real JavaScript Date object structure, the service layer intercepts execution and automatically resets the timestamp threshold to the current engine time (new Date()). Pagination variables default to limit = 20 and offset = 0 if falsy.",
    request: {
      headers: {
        Authorization: "Bearer <token>"
      },
      params: {},
      query: {
        since: "string (ISO 8601 Datetime string configuration. Required)",
        limit: "number (Optional. Controller default: 50. Service fallback: 20)",
        offset: "number (Optional. Controller default: 0. Service fallback: 0)"
      },
      body: {}
    },
    response: {
      msg: "success",
      ans: [
        {
          id: "aud_554930bc",
          entity_id: "usr_admin01",
          action: "DELETE",
          detail: "entity id: usr_deprecated is deleted by actor :usr_admin01",
          flag: "log",
          created_at: "2026-05-31T16:45:00.000Z"
        }
      ]
    },
    done: true
  }
];
