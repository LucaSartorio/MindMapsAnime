# Social content queue

JSON configs of videos to render, one file per video (same format as
`../examples/`). This folder is the hand-off point for a future content
planner (phase 2: an agent picks a topic and writes a config here) — nothing
generates files here automatically yet.

- Every `*.json` here is validated by `npm run social:validate`.
- Render one with `npm run social:render -- --config tools/social-engine/content/<file>.json`.
- Format and fields: `docs/SOCIAL_ENGINE.md`.
