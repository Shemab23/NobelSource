## setup
- verification : node --version
- npm init -y
<!-- runtime dependency express -->
- npm install express
  - import express
  - app= express()
  - app.get('/',(req,res)=>{....})
  - app.listen(port,()=>{....http//localhost:port})
<!-- adding typescript -->
- npm install  -D
  - ts-node <!--run ts no need coverting to js-->
  - typescript
  - @types/node <!--typescript definiion-->
  - @types/express
  - npm i --save-dev @types/pg

  - prettier // better formatting
  - eslint // error flagging

  - npx tsc --init
  - npm i -D tsx

  - dotenv
<!-- postgres -->
- npm i pg
- npm i @types/pg


<!-- create database pool -->
import dotenv;;Pool

new Pool({user,host,database,password,port})

pool.query('select Now()',(err,res)=>{
    if(err) console.error('....',err.stack);
    else console.log('....',res.rows[0].now);
}
pool.end()
)


<!-- manually limite your self from desaster -->
```
PS C:\Users\Shema> docker container ls
CONTAINER ID   IMAGE                COMMAND                  CREATED          STATUS          PORTS                                         NAMES
6bbc00d5df59   postgres:17-alpine   "docker-entrypoint.s…"   27 minutes ago   Up 27 minutes   0.0.0.0:5432->5432/tcp, [::]:5432->5432/tcp   test-postgres
PS C:\Users\Shema> docker exec -it test-postgres psql -U postgres
psql (17.8)
Type "help" for help.

postgres=# create database test_db;
CREATE DATABASE
postgres=# create user dev_user with password 'pass1234';
CREATE ROLE
postgres=# grant all privilages on database test_db to dev_user;
ERROR:  syntax error at or near "privilages"
LINE 1: grant all privilages on database test_db to dev_user;
                  ^
postgres=# grant all privileges on database test_db to dev_user;
GRANT
postgres=# \q
PS C:\Users\Shema>
```
now change the password and database in .env
<!-- we may now get a container with a volume -->
<!-- drizzle -->
- install
  - drizzle-orm
  - -D drizzle-kit
<!-- create drizzle.config.ts -->
```
import { defineConfig } from 'drizzle-kit';
import dotenv from 'dotenv';
import path from 'node:path';

dotenv.config({ path: path.resolve(process.cwd(), ".env") });

export default defineConfig({
  out: './drizzle',
  schema: './src/db/schema.ts', // Adjust this if your schema is elsewhere!
  dialect: 'postgresql',
  dbCredentials: {
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT ? parseInt(process.env.DB_PORT) : 5432,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    ssl: false,
  },
});
```

<!-- postgres url format:
postgres://<user>:<password>@<host>:<port>/<database> -->
- export db as a bundler from drizzel, of pool and schemas

- schemas we use "drizzle-orm/pg-core" it have its translation to all queries.
- drizzle-kit thing
  - npx drizzle-kit introspect
    - like a pull
    - i have an existing database i want drizzle to write a schema for it ? is it optmised???
  - npx drizzle-kit generate
    - the blue print
    - after any edit in schema.ts // record datachange history
  - npx drizzle-kit push
    - fast track
    - skip the sql trackings, and directly aply change to db. good if you are changing things more offetenly
  - npx drizzle-kit studio
    - the viewer
    - like viewing my data in the browser

- npx drizzle-kit generate --config=drizzle.config.ts // runned generate firsttime
- npx drizzle-kit push --config=drizzle.config.ts

<!-- catch up -->
# folder structure
- server
  - create app
  - apply global middlewares
  - mount routers
  - atart listening
# feature creation rode map
- create folder specifi for it, in modules
  - controller //call service
  - repository // drizzle inserts
  - route // validate imput zod
  - schema // i think this is covered generaly??
  - service //call repository
<!-- zod -->
- npm i drizzle-zod zod
<!-- guide -->
- schema + zod
- npx drizzle-kit push --config=drizzle.config.ts
- seed ; end pool
- any middleware if needed?
- do your routes // crud if possible/ per table
- npx tsx src/server.ts


## Task 1: Reference Files

# `reference.md` (The Instructor's View)

*This is a professional log of the backend architecture and setup.*

#### 1. Environment & Core Setup

* **Runtime**: Node.js (verified v20+)
* **Framework**: Express.js for RESTful API routing.
* **Language**: TypeScript for type safety and catching "undefined" errors at compile time.
* **Key Installs**:
* `express`, `@types/express`: Core server.
* `typescript`, `tsx`, `ts-node`: Development environment.
* `dotenv`: Secure environment variable management.



#### 2. Database Infrastructure

* **Driver**: `pg` (node-postgres) to manage the connection pool.
* **ORM**: Drizzle ORM for type-safe SQL construction.
* **Tooling**: `drizzle-kit` for schema migrations and database introspection.
* **Workflow**:
* `generate`: History tracking of schema changes.
* `push`: Rapid prototyping by syncing schema to DB without manual SQL files.
* `studio`: Visual verification of data integrity.



#### 3. Folder Architecture

* `/src/db`: Schema definitions and connection pooling.
* `/src/middleware`: Request interception (Validation & Auth).
* `/src/routes`: API endpoint definitions.
* `/src/modules`: (Planned) Feature-based logic (Controller/Service/Repository).

#### 4. Validation Layer

* **Zod**: Schema validation to ensure the "Bad Data" never reaches the database.
* **Integration**: `drizzle-zod` for inferring types directly from database tables.
<!-- cleaining up and starting -->
- docker ps -a
- docker rm -f test-postgres
- docker volume ls
- docker volume rm [volume_name]


docker run --name nobel-db-prod `
  -e POSTGRES_PASSWORD=your_secure_password `
  -v nobel_data_vol:/var/lib/postgresql/data `
  -p 5432:5432 `
  -d postgres:17-alpine
# database schema
## mapping resolution
- 1:N // add reference to the many part
- M:N // additional table holding the primary keys as foregein and composite pk
- 1:1 // any cal have the other as foreign key but must also be made unique
# Table of content
- [Table of content](#table-of-content)
  - [project initialisation](#project-initialisation)
## project initialisation
1. Core Node & TypeScript Setup
- npm init -y
- npm install express dotenv pg
- npm install -D typescript tsx ts-node @types/node @types/express @types/pg prettier eslint

2. Drizzle & Validation Setup
- npm install drizzle-orm zod drizzle-zod
- npm install -D drizzle-kit

3. Initialize TypeScript
- npx tsc --init
# notes

### `src/services/`

* `user.service.ts`
* `profile.service.ts`
* `notice.service.ts`
* `shipment.service.ts`
* `engagement.service.ts`
* `communication.service.ts`
* `room.service.ts`

### `src/controllers/`

* `auth.controller.ts`
* `profile.controller.ts`
* `notice.controller.ts`
* `shipment.controller.ts`
* `admin.controller.ts`
* `room.controller.ts`

### `src/routes/`

* `index.ts` (Master Router)
* `auth.routes.ts`
* `profile.routes.ts`
* `notice.routes.ts`
* `shipment.routes.ts`
* `admin.routes.ts`

### `src/middlewares/`

* `auth.middleware.ts`
* `role.middleware.ts`
* `validation.middleware.ts` (For Zod schemas)
* `error.middleware.ts`

### `src/dataBase/`

* `db.ts` (Connection instance)
* `schema.ts` (Your provided schema)
* `seed.ts`

---

### Mini Code Audit Update

| Folder | Status | Logic Struggle / Focus |
| --- | --- | --- |
| `services/` | **Next Step** | Mapping Drizzle `relations` to clean query outputs. |
| `controllers/` | **Next Step** | Handling the `30-char` ID length in request params. |
| `middlewares/` | **Critical** | Ensuring `user` vs `admin` roles are strictly separated. |
<!-- set up the connect-pg-simple -->
```
CREATE TABLE "user_sessions" (
  "sid" varchar NOT NULL COLLATE "default",
  "sess" json NOT NULL,
  "expire" timestamp(6) NOT NULL
) WITH (OIDS=FALSE);

ALTER TABLE "user_sessions" ADD CONSTRAINT "session_pkey" PRIMARY KEY ("sid") NOT DEFERRABLE INITIALLY IMMEDIATE;

CREATE INDEX "IDX_session_expire" ON "user_sessions" ("expire");
```
psql -U shema22243402 -d nobelsourcedb


# api development:
- do service
- controller & manage session
- routes
- server.ts
# tests
1. register
```
{
    "email": "test@example.com",
    "password_harsh": "supersecret123",
    "legal_name": "John Doe Corp",
    "registration_number": 12345
}
{
    "email": "test2@example1.com",
    "password_harsh": "supersecret321",
    "legal_name": "shema bruno ltd",
    "registration_number": 18445
}
```
2. login
```
{
    "email": "test2@example1.com",
    "password": "supersecret321"
}
{
    "email": "test@example.com",
    "password": "supersecret123"
}
```
# Session ,Cookies
## product behavior
- system must remeber the user between requests and page reloads.
```
log in -> navigate anywhere-> refreshes-> still loged in |unles logged out.
```
> we need persintent id : **session_id**
> browser must send something identfying the user on every request , called **cookie**
## server structure for this aproach
- server
  - /api
    - auth
      - login
      - logout
      - register
    - users
    - .....
> only auth route is to be public
```
api/auth/*  public
api/*       protected
```
>so we need middlewares to do these
## protection layer
- for any api request which is protected; we ask. is authenticated? if not401 unauthorized if yes do what is required
> requireAuth *middleware*
```
request -> requireAuth -> route handler
```
## Authentication source
> how will requireAuth know the user? `req.user`
> something creates it before the middleware runs `session middleware`
```
request ->cookie parser ->session middleware -> requireAuth -> route handler
```
> now how will session middleware know the user?
## cookie transport layer
when browser makes a equest x it sends cookie: `session_id=abcn123`

this cookie exist because during login  server sent `set_cookie:session=....`
## what is happening in session middleware
- read cookie, from request header
- load session, check if the session of that id exists?
- attach the session detail to request, so routes now knows you
>this should happend in the top most enrty point, `server.ts`
  - app.use
    - cookieparser
    - sessionMiddleware
    - "/api",other routes

## code
### table creation
```
nobelsourcedb=> create index idx_sessions_expiry on sessions(expires_at);
CREATE INDEX
nobelsourcedb=> \d sessions;
                                        Table "public.sessions"
   Column   |            Type             | Collation | Nullable |               Default
------------+-----------------------------+-----------+----------+--------------------------------------
 id         | integer                     |           | not null | nextval('sessions_id_seq'::regclass)
 token      | text                        |           | not null |
 user_id    | character varying(30)       |           |          |
 expires_at | timestamp without time zone |           | not null |
 created_at | timestamp without time zone |           |          | now()
Indexes:
    "sessions_pkey" PRIMARY KEY, btree (id)
    "idx_sessions_expiry" btree (expires_at)
Foreign-key constraints:
    "sessions_user_id_fkey" FOREIGN KEY (user_id) REFERENCES users(id)


nobelsourcedb=>
```
### type
```
import {type Request} from 'express';

export interface AuthRequest extends Request {
    //  user_id         now we can do req.userId
    userId?: string;
}

```
### service
---
import {pool } from '../dataBase/db';

type responce = {
    user_id:string
}

export const getSessionByToken = async (token: string):Promise<responce> =>{
    const result = await pool.query(
        `
        select user_id
        from sessions
        where token = $1
        and expires_at > NOW()
        `,
        [token]
    );
    return result.rows[0];
}

```

### middleware
```
import {type Response,type NextFunction} from 'express';
import { type AuthRequest } from '../types/request';

import { getSessionByToken } from '../services/sessionService';

export const sessionLoader = async (req: AuthRequest, res: Response, next: NextFunction)=>{
    const {token} = req.cookies?.session_token || {};

    if(!token) return next();

    try{
        const session = await getSessionByToken(token);

        if(session){
            req.userId = session.user_id;
        }

        next();
    }catch(e){
        next(e);
    }
}
```
### auth protector
```
import {type Response,type NextFunction} from 'express';
import { type AuthRequest } from '../types/request';

export const requireAuth = (req: AuthRequest, res: Response, next: NextFunction) =>{
    if(!req.userId){
        return res.status(401).json({message:'Unauthorized'});
    }
    next();
}
```
```
## service creation
> do the basics for each tale crud
- create // validate , insert ,return the inserted object
- get by id
- get many // options[limit,offset,orderby,filters]
- update // (id, data) ; validate, apply patch, return neew object
- delete // remove, return success

> fo revery table have a check of existance by id
> provide a counting ability for some unique entries

### basic select
- select * from users
  - db.select().from(users).where()
    - select // id: users.id , x: users.x , value: count() , exists(..query...)
    - from // users
    - where // eq , gt, lt, gte, lte (=,>,<,>=,<=) , [and , or], like(..x..)
    - limit
    - offset
    - orderBy // asc(...) | desc
    - innerJoin ; leftJoin
      - table
      - eq ...




-----

# clean up
```
-- 1. Drop Level 4 & 3 (The Leaf Nodes)
DROP TABLE IF EXISTS "shipment_access";
DROP TABLE IF EXISTS "shipment";
DROP TABLE IF EXISTS "interaction";
DROP TABLE IF EXISTS "communicate";
DROP TABLE IF EXISTS "audit_log";
DROP TABLE IF EXISTS "sessions";
DROP TABLE IF EXISTS "users";

-- 2. Drop Level 2 (The Middle Nodes)
DROP TABLE IF EXISTS "engagement";
DROP TABLE IF EXISTS "document";
DROP TABLE IF EXISTS "notice";
DROP TABLE IF EXISTS "room_member";
DROP TABLE IF EXISTS "admin_action";

-- 3. Drop Level 1 (The Core Nodes)
DROP TABLE IF EXISTS "profile";
DROP TABLE IF EXISTS "room";

-- 4. Drop Level 0 (The Root)
DROP TABLE IF EXISTS "users";

-- 5. Drop the Custom Types (Enums)
DROP TYPE IF EXISTS "admin_action_type", "audit_tables", "communicate_status", "communicate_type",
"document_status", "engagement_currency", "engagement_status", "interaction_type",
"notice_status", "notice_type", "profile_status", "shipment_access_type",
"shipment_status", "user_role", "user_status";
```


## testing
```
GET http://localhost:3000/health

POST http://localhost:3000/api/auth/login
 {
  "email": "farmer@sunrise.com",
  "password": "pass12345"
}

GET http://localhost:3000/api/onboarding/status

GET http://localhost:3000/api/onboarding/requirements



```
