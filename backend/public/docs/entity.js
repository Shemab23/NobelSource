export const entityDocs = [
  {
    name: "GET /api/entities/in",
    description: "Health and debug entry point to verify the connectivity of the entity API routing system. It executes outside any authentication middleware chains.",
    request: {
      headers: {},
      params: {},
      query: {},
      body: {}
    },
    response: {
      msg: "in entity api"
    },
    done: true
  },

  {
    name: "GET /api/entities/:id",
    description: "Fetches an active, non-deleted entity record from the database by its ID and logs a READ operation to the audit service. Requires an authorized user token context containing an actor entity_id. Throws a 401 status code if the user context is missing, a 400 status code if the target ID parameter is omitted, and a 404 status code if the record is missing or has been soft-deleted (is_deleted: true).",
    request: {
      headers: {
        Authorization: "Bearer <token>"
      },
      params: {
        id: "string (The distinct ID of the target entity record)"
      },
      query: {},
      body: {}
    },
    response: {
      msg: "success",
      ans: {
        id: "usr_823947ab",
        type: "user",
        created_at: "2026-05-31T17:06:00.000Z",
        updated_at: "2026-05-31T17:06:00.000Z",
        is_deleted: false
      }
    },
    done: true
  },

  {
    name: "GET /api/entities/:id/exists",
    description: "Verifies the presence and active state of an entity. Internally invokes the lookup engine and logs a corresponding READ action. Returns a 200 response with ans: true if found. If the record is missing or soft-deleted, it intercepts the internal exception and returns a 200 response with msg: 'not found' and ans: false. Drops with a 401 if unauthorized, and a 400 if the ID parameter is missing.",
    request: {
      headers: {
        Authorization: "Bearer <token>"
      },
      params: {
        id: "string (The ID of the entity to verify)"
      },
      query: {},
      body: {}
    },
    response: {
      msg: "success",
      ans: true
    },
    done: true
  },

  {
    name: "GET /api/entities/:id/type-check",
    description: "Checks if the stored entity configuration matches a specified classification type string. Requires both parameters. Emits a 400 error status if either the id parameter or type query is omitted. Emits a 401 error if the token context is missing, and a 404 error if the entity is not found. Returns ans: true with msg: 'success' upon a valid structural match. Returns ans: false with msg: 'type mismatch' if the entity exists but belongs to a different classification.",
    request: {
      headers: {
        Authorization: "Bearer <token>"
      },
      params: {
        id: "string (The target entity ID)"
      },
      query: {
        type: "string (The entity classification type to match against, e.g., 'user' or 'room')"
      },
      body: {}
    },
    response: {
      msg: "success",
      ans: true
    },
    done: true
  },

  {
    name: "POST /api/entities/admin",
    description: "Generates a new underlying entity container using a database transaction block, mapping custom ID prefixes based on the payload value. Values must be either 'user' or 'room'. Automatically formats system-managed parameters (created_at, updated_at, and is_deleted: false). Logs a structural CREATE record inside the audit system tracking the actor's ID. Fires a 401 if authorization drops, a 400 if type is missing or invalid, and a 500 if database insertions fail.",
    request: {
      headers: {
        Authorization: "Bearer <token>"
      },
      params: {},
      query: {},
      body: {
        type: "string ('user' | 'room')"
      }
    },
    response: {
      msg: "success",
      ans: {
        id: "room_928374df",
        type: "room",
        created_at: "2026-05-31T17:06:00.000Z",
        updated_at: "2026-05-31T17:06:00.000Z",
        is_deleted: false
      }
    },
    done: true
  },

  {
    name: "GET /api/entities/admin/all",
    description: "Provides an administrative pagination mechanism to scan all active entity containers. Bypasses soft-deleted rows. If limit or offset values are non-numeric, less than 1 (for limit), or less than 0 (for offset), the framework safely falls back to standard system defaults (limit = 10, offset = 0). Tracks the operation in the audit system as an 'ADMIN ACTION'. Fires a 401 if unauthorized and a 500 on execution failures.",
    request: {
      headers: {
        Authorization: "Bearer <token>"
      },
      params: {},
      query: {
        limit: "number (Optional. System default: 10)",
        offset: "number (Optional. System default: 0)"
      },
      body: {}
    },
    response: {
      msg: "success",
      ans: [
        {
          id: "usr_382910ff",
          type: "user",
          created_at: "2026-05-30T10:15:00.000Z",
          updated_at: "2026-05-30T10:15:00.000Z",
          is_deleted: false
        }
      ]
    },
    done: true
  },

  {
    name: "PATCH /api/entities/admin/:id",
    description: "Updates an existing entity's structural classification value inside a controlled transaction block, overwriting the type column and forcing an updated_at timestamp generation. Logs an UPDATE message inside the audit engine linked to the actor. Emits a 400 code if either id or type fields are missing from execution contexts, a 401 code if unauthorized, and a 500 code if database mutations fail or reference an untracked target ID.",
    request: {
      headers: {
        Authorization: "Bearer <token>"
      },
      params: {
        id: "string (The ID of the entity to alter)"
      },
      query: {},
      body: {
        type: "string ('user' | 'room')"
      }
    },
    response: {
      msg: "success",
      ans: [
        {
          id: "usr_382910ff",
          type: "room",
          created_at: "2026-05-30T10:15:00.000Z",
          updated_at: "2026-05-31T17:06:00.000Z",
          is_deleted: false
        }
      ]
    },
    done: true
  },

  {
    name: "DELETE /api/entities/admin/:id",
    description: "Performs a safe soft-delete on a target entity record within a database transaction context. Flags the targeted record's is_deleted field to true and logs the deleted_at deletion date timestamp, keeping database constraints clean. Writes an explicit DELETE record to the audit service logs tracking the actor. Returns a 400 error status if the entity ID parameter is missing, a 401 code if unauthorized, and a 500 code if the database execution fails.",
    request: {
      headers: {
        Authorization: "Bearer <token>"
      },
      params: {
        id: "string (The target entity ID to soft-delete)"
      },
      query: {},
      body: {}
    },
    response: {
      msg: "success",
      ans: {
        id: "room_928374df",
        type: "room",
        created_at: "2026-05-31T17:06:00.000Z",
        updated_at: "2026-05-31T17:06:00.000Z",
        is_deleted: true,
        deleted_at: "2026-05-31T17:06:15.000Z"
      }
    },
    done: true
  }
];
