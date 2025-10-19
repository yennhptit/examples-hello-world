// server.ts
import { Application, Router } from "https://deno.land/x/oak/mod.ts";

const app = new Application();
const router = new Router();

router
  .get("/health", (ctx) => {
    ctx.response.status = 200;
    ctx.response.body = { status: "OK", service: "Critique Polish API" };
  })
  .post("/api/polish-critique", async (ctx) => {
    try {
      const body = await ctx.request.body({ type: "json" }).value;
      const text: string = body.text;

      if (!text || text.trim().length === 0) {
        ctx.response.status = 400;
        ctx.response.body = { error: "Text is required" };
        return;
      }

      const GEMINI_API_KEY = Deno.env.get("GEMINI_API_KEY");
      if (!GEMINI_API_KEY) {
        ctx.response.status = 500;
        ctx.response.body = { error: "Gemini API key not configured" };
        return;
      }

      const GEMINI_MODEL = "gemini-2.0-flash";

      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent?key=${GEMINI_API_KEY}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            contents: [
              {
                parts: [
                  {
                    text: `You are a transcription cleaner.
Remove filler words and speech disfluencies.
User text: ${text}`,
                  },
                ],
              },
            ],
            generationConfig: { maxOutputTokens: 1000, temperature: 0.3 },
          }),
        }
      );

      const data = await response.json();
      const polishedText = data?.candidates?.[0]?.content?.parts?.[0]?.text?.trim();

      ctx.response.status = 200;
      ctx.response.body = { polishedText };
    } catch (error) {
      console.error(error);
      ctx.response.status = 500;
      ctx.response.body = { error: "Failed to polish text" };
    }
  });

app.use(router.routes());
app.use(router.allowedMethods());

console.log("✅ Deno server running...");
await app.listen({ port: 8000 });
