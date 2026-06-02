export const authDocs = [
  {
    name: "POST /register",
    description: "Initialize and Register New User. Executes an ACID-compliant database transaction block to safely enforce core entity registration records. Generates a fresh lower-level entity row coupled to a specialized user profile model while ensuring the target email is not already occupied. Automatically hashes credentials using an asynchronous blowfish or specialized primitive derivative algorithm. If file data payloads populate multipart requests, they stream into Cloudinary folders, appending specific secured file urls directly into nested metadata configurations. Mapped verification nodes auto-initialize to status 'pending' and by 'system'. Upon completion of transaction queries, generates an opaque cryptographically secure 48-byte hex database-backed session token structured to timeout exactly 7 days out, drops a session cookie track, and commits a CREATE_USER audit trail log.",
    request: {
      headers: {
        "Content-Type": "multipart/form-data"
      },
      params: {},
      query: {},
      body: {
        email: "string (REQUIRED)",
        password: "string (REQUIRED)",
        registration_number: "string (REQUIRED)",
        profile: "string (REQUIRED JSON String - e.g., '{\"name\":\"John Doe\",\"phone\":\"+12345\"}')",
        permission_names: "string (Optional JSON Stringified Array - e.g., '[\"Tax_Exemption\",\"License\"]')",
        display_image: "file (Optional - Single profile image buffer)",
        permissions: "file[] (Optional - Up to 20 verification document buffers)"
      }
    },
    response: {
      msg: "success",
      ans: {
        entity: {
          id: "string",
          type: "user",
          created_at: "string (ISO Date)",
          updated_at: "string (ISO Date) | null"
        },
        user: {
          id: "string",
          created_at: "string (ISO Date) | null",
          updated_at: "string (ISO Date) | null",
          is_deleted: "boolean",
          deleted_at: "string (ISO Date) | null",
          email: "string",
          registration_number: "string",
          role: "user",
          metadata: {
            profile: {
              name: "string",
              image: "string (Cloudinary URL) | undefined",
              phone: "string | undefined",
              country: "string | undefined",
              website: "string | undefined",
              currency: "USD | RWF | EUR | undefined"
            },
            rating: "number | undefined",
            rating_count: "number | undefined",
            permissions: [
              {
                right: "string",
                status: "pending",
                by: "system",
                document: "string (Cloudinary URL)"
              }
            ]
          }
        },
        session: {
          msg: "success",
          ans: {
            id: "string",
            entity_id: "string",
            token: "string (Opaque 48-byte hex string)",
            created_at: "string (ISO Date)",
            expires_at: "string (ISO Date)"
          }
        }
      }
    },
    done: true
  },
  {
    name: "POST /login",
    description: "Authenticate User Credentials. Checks input strings against the lower data frame using high-performance target scanning filters. Returns a 400 status if inputs fail validation metrics, and an explicit 401 response if email lookup targets return empty or password comparison matches trigger failure results. Succeeding authorization paths call inner crypto libraries to provision a 48-byte session token with a sliding 7-day durability window. Persists a global standalone LOGIN audit log tracking row to trace historical access timestamps, binds context to user sessions, and packages full payloads directly inside response maps.",
    request: {
      headers: {
        "Content-Type": "application/json"
      },
      params: {},
      query: {},
      body: {
        email: "string (REQUIRED)",
        password: "string (REQUIRED)"
      }
    },
    response: {
      msg: "success",
      ans: {
        user: {
          id: "string",
          created_at: "string (ISO Date) | null",
          updated_at: "string (ISO Date) | null",
          is_deleted: "boolean",
          deleted_at: "string (ISO Date) | null",
          email: "string",
          registration_number: "string",
          role: "user | admin | arbitrator",
          metadata: {
            profile: {
              name: "string",
              image: "string | undefined",
              phone: "string | undefined",
              country: "string | undefined",
              website: "string | undefined",
              currency: "USD | RWF | EUR | undefined"
            },
            rating: "number | undefined",
            rating_count: "number | undefined",
            permissions: [
              {
                right: "string",
                status: "pending | authorised | denied",
                by: "string",
                document: "string"
              }
            ]
          }
        },
        session: {
          msg: "success",
          ans: {
            id: "string",
            entity_id: "string",
            token: "string (Opaque 48-byte hex string)",
            created_at: "string (ISO Date)",
            expires_at: "string (ISO Date)"
          }
        }
      }
    },
    done: true
  },
  {
    name: "POST /logout",
    description: "Terminate User Session. Guarded explicitly by the global authGuard middleware layer. Pulls session keys directly out of client request cookie properties. If verification checks find the token parameter string value missing entirely, an immediate 400 error schema intercepts processing. Passes parameters to sessionService.revokeSession to delete, clear, or flag data row indexes out of database structures permanently. Missing, invalid, or expired session tokens drop a 404 status object. Cleans local client session cookies completely on successful clear actions to fully terminate state footprints.",
    request: {
      headers: {
        Authorization: "string (Bearer Token REQUIRED via authGuard)",
        Cookie: "session_token=string (REQUIRED)"
      },
      params: {},
      query: {},
      body: {}
    },
    response: {
      msg: "success",
      ans: {
        id: "string (Revoked Session Identifier ID)",
        entity_id: "string",
        token: "string",
        created_at: "string (ISO Date)",
        expires_at: "string (ISO Date)",
        is_active: "boolean"
      }
    },
    done: true
  }
];
