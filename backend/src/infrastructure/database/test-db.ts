import { pgPool } from "./postgres";

(async () => {
  try {
    const result = await pgPool.query("SELECT NOW()");
    console.log("✅ PostgreSQL connected at:", result.rows[0].now);
  } catch (error) {
    console.error("❌ PostgreSQL connection failed:", error);
  } finally {
    await pgPool.end();
    process.exit(0);
  }
})();
