# Ahmed Fathi portfolio

Source based on published Sites version 34. Edit pages and downloads in public/ and chat behaviour in worker/.

Local preview: npx wrangler dev. For local chat, set DAHL_API_KEY in .dev.vars.

Cloudflare Workers Builds: connect main, use the repository root, leave the dashboard build command empty and deploy with npx wrangler deploy. Wrangler runs npm run build from wrangler.jsonc. Configure DAHL_API_KEY as a runtime secret.
