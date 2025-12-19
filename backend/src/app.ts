import express from "express";
import cors from "cors";
import { errorHandler } from "./interfaces/middleware/errorHandler";
import chatRoutes from "./interfaces/routes/chat.routes";

const app = express()

app.use(cors())
app.use(express.json())

app.use("/api", chatRoutes)

app.get("/", (_req, res) => {
  res.send('Spur_AI is running')
})

app.use(errorHandler);

export default app;
