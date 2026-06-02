export const postDocs = [
  {
    name: "GET /api/posts/in",
    description: "Ping healthcheck endpoint to verify if the posting API layer is online and responsive. Does not require authentication or route parameters.",
    request: {
      headers: {},
      query: {},
      body: {}
    },
    response: {
      msg: "in posting api"
    },
    done: true
  },

  {
    name: "GET /api/posts",
    description: "Fetch public global feed for active items. Use pagination via 'limit' and 'offset' query parameters. Do not pass a request body. Note: The under-the-hood implementation enforces a fallback limit of 10 if missing or invalid.",
    request: {
      headers: {},
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
          id: "post_xyz123",
          entity_id: "entity_abc456",
          content: {
            title: "Market Update",
            body: "Stable rates today.",
            description: "Optional secondary descriptions go here.",
            media: ["https://cloudinary.com"],
            unit: "kg",
            type: "OFFER",
            price_cents: 5000,
            currency: "USD",
            location: "Kigali",
            tags: ["trading", "market"],
            category: "Agriculture"
          },
          status: "active",
          created_at: "2026-05-21T21:00:00.000Z",
          updated_at: "2026-05-21T21:00:00.000Z",
          is_deleted: false,
          deleted_at: null
        }
      ]
    },
    done: true
  },

 {
    name: "GET /api/posts/active",
    description: "Fetch a window list of active posts sorted by creation timestamp. Use 'limit' query parameters to size the window (defaults to 20 inside the service). Do not send an offset parameter or a request body.",
    request: {
      headers: {},
      query: {
        limit: 20
      },
      body: {}
    },
    response: {
      msg: "success",
      ans: [
        {
          id: "post_xyz123",
          entity_id: "entity_abc456",
          content: {
            title: "Market Update",
            body: "Stable rates today.",
            media: ["https://cloudinary.com"],
            unit: "ton",
            type: "INFO",
            price_cents: 120000,
            currency: "EUR",
            location: "Nairobi",
            category: "Logistics",
            tags: ["trading"]
          },
          status: "active",
          created_at: "2026-05-21T21:00:00.000Z",
          updated_at: "2026-05-21T21:00:00.000Z",
          is_deleted: false,
          deleted_at: null
        }
      ]
    },
    done: true
  },

  {
    name: "GET /api/posts/search",
    description: "Perform an ILIKE text search across stringified Post JSON content columns. 'q' is a mandatory text query parameter (returns 400 error status if missing). Optional 'limit' query caps total records returned.",
    request: {
      headers: {},
      query: {
        q: "maize",
        limit: 10
      },
      body: {}
    },
    response: {
      msg: "success",
      ans: [
        {
          id: "post_maize01",
          entity_id: "entity_farm789",
          content: {
            title: "Maize Harvest Listing",
            body: "Yields look great this season.",
            unit: "ton",
            type: "OFFER",
            price_cents: 45000,
            currency: "RWF",
            location: "Musanze",
            category: "Grains",
            tags: ["agriculture"]
          },
          status: "active",
          created_at: "2026-05-20T10:15:00.000Z",
          updated_at: "2026-05-20T10:15:00.000Z",
          is_deleted: false,
          deleted_at: null
        }
      ]
    },
    done: true
  },

  {
    name: "GET /api/posts/admin/all",
    description: "Protected administrative system global feed snapshot. Requires both authGuard and adminGuard session bearer tokens in the authorization header. Supports optional pagination parameters 'limit' and 'offset'.",
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
          id: "post_001",
          entity_id: "entity_002",
          content: {
            title: "Admin Tracked Post",
            body: "System testing log content.",
            unit: "unit",
            type: "INFO",
            price_cents: 0,
            currency: "USD",
            location: "System Core",
            category: "Logs"
          },
          status: "active",
          created_at: "2026-04-23T12:30:06.673Z",
          updated_at: "2026-04-23T12:30:06.673Z",
          is_deleted: false,
          deleted_at: null
        }
      ]
    },
    done: true
  },

  {
    name: "POST /api/posts",
    description: "Publish a listing. Requires authGuard headers. Payload must be submitted as multipart/form-data. Fields 'title', 'body', 'unit', 'type', 'price_cents', 'location', and 'category' are strictly required text primitives. 'tags' field string values can accept a raw array JSON string structure '[\"a\",\"b\"]' or comma-separated text values. Binary file streams map to key name 'media' (maxCount: 10 files).",
    request: {
      headers: {
        Authorization: "Bearer <user_jwt_token>",
        "Content-Type": "multipart/form-data"
      },
      query: {},
      body: {
        title: "Trade Update",
        body: "Market is stable",
        description: "Detailed contextual text block",
        unit: "kg",
        type: "WANT",
        price_cents: "250",
        currency: "USD",
        location: "Kigali Hub",
        category: "Produce",
        tags: "news,update",
        status: "active"
      },
      files: {
        media: "Array of file binary buffers"
      }
    },
    response: {
      msg: "success",
      ans: {
        id: "post_gen789",
        entity_id: "entity_auth456",
        content: {
          title: "Trade Update",
          body: "Market is stable",
          description: "Detailed contextual text block",
          media: [
            "https://cloudinary.com",
            "https://cloudinary.com"
          ],
          unit: "kg",
          type: "WANT",
          price_cents: 250,
          currency: "USD",
          location: "Kigali Hub",
          tags: ["news", "update"],
          category: "Produce"
        },
        status: "active",
        created_at: "2026-05-21T21:00:57.000Z",
        updated_at: "2026-05-21T21:00:57.000Z",
        is_deleted: false,
        deleted_at: null
      }
    },
    done: true
  },

  {
    name: "GET /api/posts/:id",
    description: "Fetch a single target post structure by its string primary key UUID parameter. If the post is soft-deleted or non-existent, the endpoint yields a 404 response framework structure.",
    request: {
      headers: {},
      params: {
        id: "post_xyz123"
      },
      query: {},
      body: {}
    },
    response: {
      msg: "success",
      ans: {
        id: "post_xyz123",
        entity_id: "entity_abc456",
        content: {
          title: "Market Update",
          body: "Stable rates today.",
          unit: "unit",
          type: "OFFER",
          price_cents: 5500,
          currency: "USD",
          location: "Online",
          category: "General",
          media: ["https://cloudinary.com"],
          tags: ["trading"]
        },
        status: "active",
        created_at: "2026-05-21T18:00:00.000Z",
        updated_at: "2026-05-21T18:00:00.000Z",
        is_deleted: false,
        deleted_at: null
      }
    },
    done: true
  },

  {
    name: "PATCH /api/posts/:id",
    description: "Update fields of a post dynamically. Requires an authorized user token. Accepts a JSON request body mapping to patch structures (e.g., updates to root fields like 'status' or nested 'content' fields). Explicitly merges tag tracking array metrics over existing collections.",
    request: {
      headers: {
        Authorization: "Bearer <user_jwt_token>",
        "Content-Type": "application/json"
      },
      params: {
        id: "post_xyz123"
      },
      query: {},
      body: {
        content: {
          title: "Revised Trade Update",
          body: "Market remains stable",
          tags: ["revised"]
        }
      }
    },
    response: {
      msg: "success",
      ans: {
        id: "post_xyz123",
        entity_id: "entity_abc456",
        content: {
          title: "Revised Trade Update",
          body: "Market remains stable",
          media: ["https://cloudinary.com"],
          unit: "unit",
          type: "OFFER",
          price_cents: 5500,
          currency: "USD",
          location: "Online",
          category: "General",
          tags: ["trading", "revised"]
        },
        status: "active",
        created_at: "2026-05-21T18:00:00.000Z",
        updated_at: "2026-05-21T18:10:00.000Z",
        is_deleted: false,
        deleted_at: null
      }
    },
    done: true
  },

  {
    name: "PATCH /api/posts/:id/archive",
    description: "Transition a specific listing's business cycle status into an expired archive state. Requires authGuard verification headers. No body content parameters are parsed or required.",
    request: {
      headers: {
        Authorization: "Bearer <user_jwt_token>"
      },
      params: {
        id: "post_xyz123"
      },
      query: {},
      body: {}
    },
    response: {
      msg: "success",
      ans: {
        id: "post_xyz123",
        entity_id: "entity_abc456",
        content: {
          title: "Revised Trade Update",
          body: "Market remains stable",
          media: ["cloudinary.com"],
          unit: "unit",
          type: "OFFER",
          price_cents: 5500,
          currency: "USD",
          location: "Online",
          category: "General",
          tags: ["trading", "revised"]
        },
        status: "expired",
        created_at: "2026-05-21T18:00:00.000Z",
        updated_at: "2026-05-31T16:33:00.000Z",
        is_deleted: false,
        deleted_at: null
      }
    },
    done: true
  },

  {
    name: "PATCH /api/posts/:id/soft-delete",
    description: "Flag a record tracking item as deleted by updating 'is_deleted' flags to true and applying timestamps to the 'deleted_at' key index. Future non-admin select queries will omit this context automatically.",
    request: {
      headers: {
        Authorization: "Bearer <user_jwt_token>"
      },
      params: {
        id: "post_xyz123"
      },
      query: {},
      body: {}
    },
    response: {
      msg: "success",
      ans: {
        id: "post_xyz123",
        entity_id: "entity_abc456",
        content: {
          title: "Revised Trade Update",
          body: "Market remains stable",
          media: ["cloudinary.com"],
          unit: "unit",
          type: "OFFER",
          price_cents: 5500,
          currency: "USD",
          location: "Online",
          category: "General",
          tags: ["trading", "revised"]
        },
        status: "expired",
        created_at: "2026-05-21T18:00:00.000Z",
        updated_at: "2026-05-31T16:33:00.000Z",
        is_deleted: true,
        deleted_at: "2026-05-31T16:33:00.000Z"
      }
    },
    done: true
  },

 {
    name: "DELETE /api/posts/:id",
    description: "Hard destructive removal operation executed on database records. Cascade flushes matching entries out of system entity registers and appends historical diagnostic data blocks inside audit tracking layers. Restrictive access requiring authGuard and adminGuard validation tokens.",
    request: {
      headers: {
        Authorization: "Bearer <admin_jwt_token>"
      },
      params: {
        id: "post_xyz123"
      },
      query: {},
      body: {}
    },
    response: {
      msg: "success",
      ans: {
        id: "post_xyz123",
        entity_id: "entity_abc456",
        content: {
          title: "Revised Trade Update",
          body: "Market remains stable",
          media: ["cloudinary.com"],
          unit: "unit",
          type: "OFFER",
          price_cents: 5500,
          currency: "USD",
          location: "Online",
          category: "General",
          tags: ["trading", "revised"]
        },
        status: "expired",
        created_at: "2026-05-21T18:00:00.000Z",
        updated_at: "2026-05-31T16:33:00.000Z",
        is_deleted: true,
        deleted_at: "2026-05-31T16:33:00.000Z"
      }
    },
    done: true
  }
];
