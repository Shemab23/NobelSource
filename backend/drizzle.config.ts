import { defineConfig } from 'drizzle-kit';
import path from 'node:path'
import dotenv from 'dotenv'

dotenv.config({path:path.resolve(process.cwd(),".env")})

export default defineConfig({
  out: './drizzle',
  schema: './src/dataBase/schema.ts',
  dialect: 'postgresql',
  dbCredentials: {
    host:process.env.DB_HOST||'localhost',
    port: process.env.DB_PORT ? parseInt(process.env.DB_PORT) : 5432,
    user:process.env.DB_USER!,
    database:process.env.DB_NAME!,
    password:process.env.DB_PASSWORD!,
    ssl: false,
  },
});
