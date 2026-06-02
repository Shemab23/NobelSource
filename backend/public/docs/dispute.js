export const disputesDocs = [
 {
    name: "POST /api/disputes",
    description: "Raise a new dispute contract tied to a logistics instance row. Gated via authGuard. Requesting actor must pass room membership validation. Passing an optional 'arbitrator' user ID will validate that the target account is in the room and ensure the creator is not trying to select themselves as an arbitrator. Returns a 201 status on success.",
    request: {
      headers: {
        Authorization: "Bearer <user_jwt_token>",
        "Content-Type": "application/json"
      },
      params: {},
      query: {},
      body: {
        room_id: "RM_LOGI001",
        logistics_id: "SHIP_004",
        claim: "claim 10 test explaining inventory weight mismatch",
        arbitrator: "USR_ARB001"
      }
    },
    response: {
      msg: "success",
      ans: {
        id: "dispute_gen123",
        room_id: "RM_LOGI001",
        logistics_id: "SHIP_004",
        opened_by: "USR_SND001",
        claim: "claim 10 test explaining inventory weight mismatch",
        status: "open",
        resolved: false,
        arbitrator_id: "USR_ARB001",
        resolution: null,
        selected_at: null,
        resolved_at: null,
        is_deleted: false,
        deleted_at: null,
        created_at: "2026-05-31T17:15:00.000Z"
      }
    },
    done: true
  },

  {
    name: "GET /api/disputes/:id",
    description: "Fetch a single active dispute object by its unique key index path parameter. Requires standard authentication. If the record is flagged as deleted or non-existent, the application drops through to a 404 response framework sequence.",
    request: {
      headers: {
        Authorization: "Bearer <user_jwt_token>"
      },
      params: {
        id: "dispute_gen123"
      },
      query: {},
      body: {}
    },
    response: {
      msg: "success",
      ans: {
        id: "dispute_gen123",
        room_id: "RM_LOGI001",
        logistics_id: "SHIP_004",
        opened_by: "USR_SND001",
        claim: "claim 10 test explaining inventory weight mismatch",
        status: "open",
        resolved: false,
        arbitrator_id: "USR_ARB001",
        resolution: null,
        selected_at: null,
        resolved_at: null,
        is_deleted: false,
        deleted_at: null,
        created_at: "2026-05-31T17:15:00.000Z"
      }
    },
    done: true
  },

  {
    name: "GET /api/disputes/room/:room_id",
    description: "Fetch disputes linked to a room index. Note: The database implementation filters strictly on active items where status is explicitly 'open' (utilizing eq!(this.table.status, 'open')) and omission of soft deletion states. Supports optional pagination parameters limit (defaults to 20) and offset.",
    request: {
      headers: {
        Authorization: "Bearer <user_jwt_token>"
      },
      params: {
        room_id: "RM_LOGI001"
      },
      query: {
        limit: 20,
        offset: 0
      },
      body: {}
    },
    response: {
      msg: "success",
      ans: [
        {
          id: "dispute_gen123",
          room_id: "RM_LOGI001",
          logistics_id: "SHIP_004",
          opened_by: "USR_SND001",
          claim: "claim 10 test explaining inventory weight mismatch",
          status: "open",
          resolved: false,
          arbitrator_id: "USR_ARB001",
          resolution: null,
          selected_at: null,
          resolved_at: null,
          is_deleted: false,
          deleted_at: null,
          created_at: "2026-05-31T17:15:00.000Z"
        }
      ]
    },
    done: true
  },

  {
    name: "GET /api/disputes/admin/all",
    description: "Administrative global monitor ledger showing all available system disputes that have not been soft deleted. Access strictly requires both authGuard and adminGuard signatures.",
    request: {
      headers: {
        Authorization: "Bearer <admin_jwt_token>"
      },
      params: {},
      query: {
        limit: 20,
        offset: 0
      },
      body: {}
    },
    response: {
      msg: "success",
      ans: [
        {
          id: "dispute_gen123",
          room_id: "RM_LOGI001",
          logistics_id: "SHIP_004",
          opened_by: "USR_SND001",
          claim: "claim 10 test explaining inventory weight mismatch",
          status: "open",
          resolved: false,
          arbitrator_id: "USR_ARB001",
          resolution: null,
          selected_at: null,
          resolved_at: null,
          is_deleted: false,
          deleted_at: null,
          created_at: "2026-05-31T17:15:00.000Z"
        }
      ]
    },
    done: true
  },

 {
    name: "GET /api/disputes/arbitrator/all",
    description: "Fetch all active dispute records assigned strictly to the authenticated requesting arbitrator context. Isolate query row rows mapping to the user's active context parameter.",
    request: {
      headers: {
        Authorization: "Bearer <arbitrator_jwt_token>"
      },
      params: {},
      query: {
        limit: 20,
        offset: 0
      },
      body: {}
    },
    response: {
      msg: "success",
      ans: [
        {
          id: "dispute_gen123",
          room_id: "RM_LOGI001",
          logistics_id: "SHIP_004",
          opened_by: "USR_SND001",
          claim: "claim 10 test explaining inventory weight mismatch",
          status: "open",
          resolved: false,
          arbitrator_id: "USR_ARB001",
          resolution: null,
          selected_at: null,
          resolved_at: null,
          is_deleted: false,
          deleted_at: null,
          created_at: "2026-05-31T17:15:00.000Z"
        }
      ]
    },
    done: true
  },

  {
    name: "PATCH /api/disputes/:id/assign",
    description: "Assign an active dispute to an investigator context. Gated under authorization. The transaction ensures that the case status evaluates explicitly to 'open' and has no pre-existing assignment signatures. Successful operations adjust status to 'investigating' and instantiate selected timestamps.",
    request: {
      headers: {
        Authorization: "Bearer <user_jwt_token>",
        "Content-Type": "application/json"
      },
      params: {
        id: "dispute_gen123"
      },
      query: {},
      body: {
        arbitrator_id: "USR_ARB001"
      }
    },
    response: {
      msg: "success",
      ans: {
        id: "dispute_gen123",
        room_id: "RM_LOGI001",
        logistics_id: "SHIP_004",
        opened_by: "USR_SND001",
        claim: "claim 10 test explaining inventory weight mismatch",
        status: "investigating",
        resolved: false,
        arbitrator_id: "USR_ARB001",
        resolution: null,
        selected_at: "2026-05-31T17:16:00.000Z",
        resolved_at: null,
        is_deleted: false,
        deleted_at: null,
        created_at: "2026-05-31T17:15:00.000Z"
      }
    },
    done: true
  },

  {
    name: "PATCH /api/disputes/:id/judgement",
    description: "Submit final binding case ruling resolution notes. The controller validates that the status property argument equals either 'resolved' or 'rejected'. The transaction code requires an assigned matching investigator context block, sets the internal resolved flag parameter to true, and appends a closing resolution timeline signature.",
    request: {
      headers: {
        Authorization: "Bearer <arbitrator_jwt_token>",
        "Content-Type": "application/json"
      },
      params: {
        id: "dispute_gen123"
      },
      query: {},
      body: {
        resolution: "Partial refund approved due to delayed delivery tracking proofs.",
        status: "resolved"
      }
    },
    response: {
      msg: "success",
      ans: {
        id: "dispute_gen123",
        room_id: "RM_LOGI001",
        logistics_id: "SHIP_004",
        opened_by: "USR_SND001",
        claim: "claim 10 test explaining inventory weight mismatch",
        status: "resolved",
        resolved: true,
        arbitrator_id: "USR_ARB001",
        resolution: "Partial refund approved due to delayed delivery tracking proofs.",
        selected_at: "2026-05-31T17:16:00.000Z",
        resolved_at: "2026-05-31T17:17:00.000Z",
        is_deleted: false,
        deleted_at: null,
        created_at: "2026-05-31T17:15:00.000Z"
      }
    },
    done: true
  },

  {
    name: "POST /api/disputes/:id/rate",
    description: "Submit quality rating reviews regarding resolved cases. Valid integer rating options must exist inside bounded mathematical scale benchmarks from 1 to 5 inclusive. Controller checks member permissions against room records and verifies inside transaction code that the target case row status is resolved before outputting confirmation details.",
    request: {
      headers: {
        Authorization: "Bearer <user_jwt_token>",
        "Content-Type": "application/json"
      },
      params: {
        id: "dispute_gen123"
      },
      query: {},
      body: {
        rating: 5,
        review: "Fair and transparent resolution process"
      }
    },
    response: {
      msg: "success",
      ans: {
        dispute_id: "dispute_gen123",
        rating: 5,
        review: "Fair and transparent resolution process"
      }
    },
    done: true
  },

  {
    name: "DELETE /api/disputes/:id",
    description: "Soft delete dispute archives out of primary workspace views. Requires administrative security clearing layers (authGuard + adminGuard). Mutates the model state layout by enabling the soft delete tracking flag and configuring current timestamp logs into the deleted_at row space.",
    request: {
      headers: {
        Authorization: "Bearer <admin_jwt_token>"
      },
      params: {
        id: "dispute_gen123"
      },
      query: {},
      body: {}
    },
    response: {
      msg: "success",
      ans: {
        id: "dispute_gen123",
        room_id: "RM_LOGI001",
        logistics_id: "SHIP_004",
        opened_by: "USR_SND001",
        claim: "claim 10 test explaining inventory weight mismatch",
        status: "resolved",
        resolved: true,
        arbitrator_id: "USR_ARB001",
        resolution: "Partial refund approved due to delayed delivery tracking proofs.",
        selected_at: "2026-05-31T17:16:00.000Z",
        resolved_at: "2026-05-31T17:17:00.000Z",
        is_deleted: true,
        deleted_at: "2026-05-31T17:17:30.000Z",
        created_at: "2026-05-31T17:15:00.000Z"
      }
    },
    done: true
  }
];
