# livemap.in

The LiveMap website and live demo.

- `src/` holds the pages and the Vercel config.
- `build/` holds the demo data and the scripts that assemble the site.

On Vercel, `build/vercel-build.sh` builds LiveMap from source, embeds the demo session into its replay page, copies the pages and fonts, takes the screenshots and writes everything to `public/`.
