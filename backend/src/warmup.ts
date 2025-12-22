// src/warmup.ts
import axios from "axios";

export async function warmUpLLM() {
  try {
    await axios.post(
      `${process.env.OLLAMA_BASE_URL}/api/generate`,
      {
        model: "phi3:mini",
        prompt: "Warm up",
        stream: false,
        options: { num_predict: 1 }
      },
      { timeout: 120_000 }
    );
    console.log("Ollama warmed up");
  } catch {
    console.warn("Ollama warmup skipped");
  }
}
