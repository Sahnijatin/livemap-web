# livemap.in

The LiveMap website and live demo.

- `src/` holds the pages and the Vercel config.
- `build/` holds the demo data and the scripts that assemble the site.
- `public/` is the built site. The "Build site" workflow writes it; do not edit it by hand.

The workflow builds LiveMap from source, embeds the demo session into its replay page, takes the screenshots and commits `public/`.
