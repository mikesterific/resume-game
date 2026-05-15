# Level 2 Enhancement Reflection: Subfolder Deep-Link Routing

## Enhancement Summary
Direct refreshes and shared links to Portfolio Quest routes such as `/portfolio-quest/museum` were returning the host's 404 page because the static server attempted to resolve the deep path as a physical file. The implementation aligned the Vite build with the `/portfolio-quest/` deployment base and added static-host rewrite files so deep links route back to the SPA entrypoint.

## What Went Well
- The root cause was narrowed quickly by distinguishing client-side Vue Router routes from server-side static file resolution.
- The deployed URL confirmed that the app was served from a subfolder, which made the `base` and rewrite requirements concrete.
- Verification included both local build output inspection and user confirmation that the deployed refresh behavior now works.

## Challenges Encountered
- The first fallback assumption targeted GitHub Pages, but the actual deployment was not GitHub Pages.
- A Vue type-check issue in `SpaceMuseum.vue` surfaced during build validation and had to be corrected before the full build could pass.
- Hidden files such as `.htaccess` are easy to omit during manual deployment, which can make the code appear correct while the server still 404s.

## Solutions Applied
- Set Vite's default base path to `/portfolio-quest/` so generated assets load from the deployed subfolder.
- Added `public/.htaccess` with an Apache rewrite that maps non-file/non-directory requests under `/portfolio-quest/` back to `index.html`.
- Added `public/_redirects` as a lightweight fallback for static hosts that support redirect rules.
- Updated the `SpaceMuseum.vue` state interface to include existing `jetpackFired` and `jumpCount` fields so `npm run build` succeeds.

## Key Technical Insights
- Vue Router route definitions are not enough for refresh/deep-link support on static hosting; the web server must rewrite deep paths to the SPA entrypoint.
- Vite's `base` controls generated asset URLs, while server rewrites control whether the app loads at all on a deep URL.
- Subfolder deployments need both pieces: `/portfolio-quest/` asset paths and a rewrite from `/portfolio-quest/*` to `/portfolio-quest/index.html`.

## Process Insights
- Confirm the deployment host type before choosing an SPA fallback strategy.
- Inspect `dist/index.html` after builds to verify the emitted asset paths match the production mount point.
- For manual uploads, explicitly verify hidden deployment files are included in the artifact.

## Action Items for Future Work
- Add deployment documentation that calls out the `/portfolio-quest/` mount path and `.htaccess` upload requirement.
- Consider making `VITE_BASE_PATH` part of the deployment command if the app may move between root and subfolder hosting.
- If the server is not Apache-compatible, capture the exact host rewrite format in the Memory Bank during archive.

## Time Estimation Accuracy
- Estimated time: 20-30 minutes
- Actual time: ~45 minutes
- Variance: +50-125%
- Reason for variance: The initial GitHub Pages assumption had to be corrected after deployment context clarified, and an unrelated TypeScript state-interface mismatch surfaced during build validation.
