export const roomMemberDocs = [
  {
    name: "GET /api/room-members/member/in",
    description: "Public baseline handshake to verify operational readiness and service connectivity for the room members context paths.",
    request: {},
    response: {
      msg: "in room member api"
    },
    done: true
  },

  {
    name: "POST /api/room-members/:id/join",
    description: "Secure atomic protocol allowing an authenticated token user to self-join a target room. Executes a concurrency-safe look-up validation inside a database transaction to prevent duplicate entries or array bloating. Resolves with a bad request status if a linking relation already exists, and logs a standard tracking record upon a first-time join.",
    request: null,
    response: {
      msg: "success",
      ans: {
        room_id: "RM_20269322535ab5c64ea",
        user_id: "USR_202611A9F4B3C2D1",
        created_at: "2026-05-31T16:15:00.000Z"
      }
    },
    done: true
  },

  {
    name: "GET /api/room-members/:id",
    description: "Fetches and automatically hydrates all active members registered within the specified room. Queries junction records inside a transaction context, matches raw participant identification tokens against full user identity tables, filters out broken dependencies, and outputs dynamic user profiles including registration numbers and metadata configurations.",
    request: null,
    response: [
      {
        id: "USR_202611A9F4B3C2D1",
        regNumber: "REG_2026_88310",
        metadata: {
          profile: {
            name: "John Doe Logistics",
            image: "https://cloudinary.com",
            phone: "+250788123456",
            country: "Rwanda",
            currency: "RWF"
          },
          rating: 4.85,
          rating_count: 14
        }
      }
    ],
    done: true
  },

  {
    name: "DELETE /api/room-members/:id/members",
    description: "Revokes a member's linking relationship from a target workspace using an explicit body argument mapping. Executes an atomic row modification inside a shared transaction block, changes visibility configurations, and registers a critical audit entry tracing the deletion action.",
    request: {
      user_id: "USR_202677B4A3C2F9"
    },
    response: {
      msg: "success",
      ans: {
        room_id: "RM_20269322535ab58c64ea",
        user_id: "USR_202677B4A3C2F9",
        is_deleted: true,
        deleted_at: "2026-05-31T16:17:45.000Z",
        created_at: "2026-05-30T10:00:00.000Z"
      }
    },
    done: true
  },

  {
    name: "GET /api/room-members/all",
    description: "Global registry evaluation route secured via adminGuard. Pulls paginated member rows out of the junction directory table, validates boundary offsets, checks execution limits (default 10, capped at 50), and files metric logs inside tracking archives.",
    request: null,
    response: {
      msg: "success",
      ans: [
        {
          room_id: "RM_20269322535ab58c64ea",
          user_id: "USR_202611A9F4B3C2D1",
          created_at: "2026-05-31T16:15:00.000Z",
          is_deleted: false,
          deleted_at: null
        }
      ]
    },
    done: true
  }
];
