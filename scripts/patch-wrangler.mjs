// Merge deploy vars from .cf-vars.json into the generated dist/server/wrangler.json.
// The build regenerates wrangler.json each time (dropping name/vars/routes), so run
// this after `bun run build` and before `wrangler deploy`.
import fs from "node:fs";

const varsPath = ".cf-vars.json";
const wranglerPath = "dist/server/wrangler.json";

const cfg = JSON.parse(fs.readFileSync(varsPath, "utf8"));
const wrangler = JSON.parse(fs.readFileSync(wranglerPath, "utf8"));

wrangler.name = cfg.name ?? wrangler.name;
wrangler.vars = cfg.vars ?? {};
wrangler.routes = cfg.routes ?? [];

fs.writeFileSync(wranglerPath, JSON.stringify(wrangler, null, 2) + "\n");
console.log(`patched ${wranglerPath}: name=${wrangler.name}, ${Object.keys(wrangler.vars).length} vars, ${wrangler.routes.length} routes`);
