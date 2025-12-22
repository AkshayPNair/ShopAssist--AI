import dotenv from "dotenv";
import app from "./app";
import { warmUpLLM } from "./warmup";

dotenv.config({ path: "src/config/.env" });

const PORT = process.env.PORT || 3000

app.listen(PORT,async () => {
  console.log(`Server running on http://localhost:${PORT}`)

  await warmUpLLM();
});
