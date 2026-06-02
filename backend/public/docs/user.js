export const userDocs = [
  {
    name: "GET /api/users/in",
    description: "Public baseline handshake to verify operational readiness and service connectivity.",
    request: {},
    response: {
      msg: "welcome to user API"
    },
    done: true
  },
    {
    name: "GET /api/users/me",
    description: "Fetch Current Authenticated User Session Profile. Actively guarded by the global authGuard middleware layer. Pulls secure cryptographic tracking tokens out of incoming client cookie request parameters to parse the active actor's context framework. If no valid, database-backed session token exists, the service layer instantly short-circuits execution with a 401 Unauthorized status block. On verified data lookup cycles, performs a database fetch matching req.userContext.entity_id to return a deep structural profile object containing registration numbers, verified corporate capabilities, and unstripped operational metadata matrices.",
    request: {
      headers: {
        Authorization: "Bearer <user_jwt_token> (Optional if httpOnly cookie tracking is active)",
        Cookie: "session_token=string (REQUIRED)"
      },
      params: {},
      query: {},
      body: {}
    },
    response: {
      msg: "success",
      ans: {
        id: "string (Unique User Entity ID Prefix: USR_)",
        email: "string (Unique business registration email)",
        password: "string (Cryptographically hashed credential string)",
        registration_number: "string (Unique state or system issued tracking number)",
        role: "user | admin | arbitrator",
        metadata: {
          rating: "number (Calculated mathematical moving average)",
          rating_count: "number (Total historical dispute or escrow transactions reviewed)",
          profile: {
            name: "string (Encoded structural layout: Title_TradeName^SummaryDescription)",
            image: "string (Cloudinary asset URL reference pointer)",
            phone: "string",
            country: "string",
            website: "string",
            currency: "USD | RWF | EUR | TRY"
          },
          permissions: [
            {
              right: "string (Designated transaction actions like 'sell', 'buy', 'clear')",
              status: "pending | authorised | denied",
              by: "string (Administrator entity ID who authorized the node)",
              document: "string (Verification reference token or path index)"
            }
          ]
        },
        created_at: "string (ISO 8601 Datetime string configuration)",
        updated_at: "string (ISO 8601 Datetime string configuration)",
        is_deleted: "boolean",
        deleted_at: "string (ISO Date) | null"
      }
    },
    done: true
  },

  {
    name: "GET /api/users/:id",
    description: "Authenticated fetch of an un-deleted user identity record by their entity ID. Logs a 'READ' audit entry tracing the requesting actor.",
    request: null,
    response: {
      msg: "success",
      ans: {
        id: "USR_20269322535ab",
        email: "developer@domain.local",
        registration_number: "REG_2026_9948",
        role: "user",
        metadata: {
          profile: {
            name: "John Doe",
            image: "https://cloudinary.com",
            phone: "+250788123456",
            country: "Rwanda",
            currency: "RWF"
          },
          rating: 4.85,
          rating_count: 14,
          permissions: []
        },
        created_at: "2026-05-31T03:13:56.259Z",
        updated_at: "2026-05-31T03:18:17.958Z",
        is_deleted: false,
        deleted_at: null
      }
    },
    done: true
  },

  {
    name: "GET /api/users",
    description: "Authenticated directory listing with safe query filters. Accepts pagination query params (e.g., ?limit=10&offset=0). Limit capped at 50.",
    request: null,
    response: {
      msg: "success",
      ans: [
        {
          id: "USR_20269322535ab",
          email: "developer@domain.local",
          registration_number: "REG_2026_9948",
          role: "user",
          metadata: {
            profile: {
              name: "John Doe",
              image: "https://cloudinary.com"
            }
          }
        }
      ]
    },
    done: true
  },

  {
    name: "PATCH /api/users/profile/update",
    description: "Secure parameterless self profile update using the authenticated token context. Automatically strips out protected administrative and identity parameters (id, role, email, password, registration_number, and metadata.permissions) to prevent malicious escalation. Merges data using targeted deep destructuring to avoid losing existing unpatched nested keys.",
    request: {
      metadata: {
        profile: {
          name: "John Updated",
          website: "https://johndoe-logistics.rw"
        }
      }
    },
    response: {
      msg: "success",
      ans: {
        id: "USR_20269322535ab",
        email: "developer@domain.local",
        registration_number: "REG_2026_9948",
        role: "user",
        metadata: {
          profile: {
            name: "John Updated",
            image: "https://cloudinary.com",
            phone: "+250788123456",
            country: "Rwanda",
            website: "https://johndoe-logistics.rw",
            currency: "RWF"
          },
          rating: 4.85,
          rating_count: 14,
          permissions: []
        },
        created_at: "2026-05-31T03:13:56.259Z",
        updated_at: "2026-05-31T15:45:00.000Z",
        is_deleted: false,
        deleted_at: null
      }
    },
    done: true
  },

  {
    name: "PUT /api/users/profile/image",
    description: "Secure parameterless profile avatar update utilizing single multipart/form-data file tracking under the form field name 'image'. Safely extracts and deletes the user's previous asset directly from the Cloudinary bucket storage cluster before streaming the new file buffer, preventing memory or storage leaks. Merges explicitly with a deep layout spread.",
    request: {
      image: "{binary_image_file_form_data}"
    },
    response: {
      msg: "success",
      ans: {
        id: "USR_20269322535ab",
        email: "developer@domain.local",
        registration_number: "REG_2026_9948",
        role: "user",
        metadata: {
          profile: {
            name: "John Updated",
            image: "https://cloudinary.com",
            phone: "+250788123456",
            country: "Rwanda",
            website: "https://johndoe-logistics.rw",
            currency: "RWF"
          },
          rating: 4.85,
          rating_count: 14,
          permissions: []
        },
        created_at: "2026-05-31T03:13:56.259Z",
        updated_at: "2026-05-31T15:46:12.000Z",
        is_deleted: false,
        deleted_at: null
      }
    },
    done: true
  },

  {
    name: "PATCH /api/users/:id/role",
    description: "Administrative operational route secured strictly via adminGuard. Bypasses the profile updates stripping filters to directly mutate account roles across user, admin, or arbitrator parameters.",
    request: {
      role: "arbitrator"
    },
    response: {
      msg: "success",
      ans: {
        id: "USR_20269322535ab",
        email: "developer@domain.local",
        registration_number: "REG_2026_9948",
        role: "arbitrator",
        metadata: {
          profile: {
            name: "John Updated",
            image: "https://cloudinary.com"
          },
          permissions: []
        },
        created_at: "2026-05-31T03:13:56.259Z",
        updated_at: "2026-05-31T15:47:45.000Z",
        is_deleted: false,
        deleted_at: null
      }
    },
    done: true
  },

  {
    name: "DELETE /api/users/:id",
    description: "Authenticated owner-only soft deletion framework. Sets the internal database soft-delete flag to true, stamps the deleted_at context variable, clean registers via entityService tracking, and files a 'critical' level log inside system transaction audit trails.",
    request: null,
    response: {
      msg: "success",
      ans: {
        id: "USR_20269322535ab",
        email: "developer@domain.local",
        role: "user",
        is_deleted: true,
        deleted_at: "2026-05-31T15:50:00.000Z"
      }
    },
    done: true
  }
];
