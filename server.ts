import { Application, send } from "https://deno.land/x/oak/mod.ts";
import { polishCritiqueHandler } from "./api.ts";

const app = new Application();
const PORT = 3000;

app.use(async (ctx, next) => {
  if (ctx.request.url.pathname === "/api/polish-critique") {
    await polishCritiqueHandler(ctx);
  } else {
    await send(ctx, ctx.request.url.pathname, {
      root: `${Deno.cwd()}/public`,
      index: "index.html",
    });
  }
  await next();
});

console.log(`Server running on http://localhost:${PORT}`);
await app.listen({ port: PORT });
