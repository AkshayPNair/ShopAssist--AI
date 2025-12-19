import { Pool } from "pg";
import dotenv from "dotenv";

dotenv.config({ path: "src/config/.env" })

export const pgPool = new Pool({
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  user: process.env.DB_USER,
  password: String(process.env.DB_PASSWORD),
  database: process.env.DB_NAME,
})
