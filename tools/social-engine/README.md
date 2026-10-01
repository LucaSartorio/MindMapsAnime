# tools/social-engine — INTERNAL ONLY

Private Remotion renderer + file-based, agent-ready content pipeline for vertical social
videos built from the AniMapVerse datasets. Not part of the public site (no routes, UI or
endpoints), no AI/paid APIs, no publishing.

```bash
npm run social:catalog                 # what can be produced → catalog/catalog.json
npm run social:queue -- --template character-journey --anime naruto --character sasuke-uchiha --locale en
npm run social:validate:queue
npm run social:render:queue -- --dry-run
npm run social:render:queue            # → output/*.mp4 + *.manifest.json, history/history.json
npm run social:retry:failed
npm run social:validate                # typecheck + tests
npm run social:studio
```

- Engine & pipeline: [`docs/SOCIAL_ENGINE.md`](../../docs/SOCIAL_ENGINE.md)
- Agent contract (JSON requests): [`docs/SOCIAL_AGENT_CONTRACT.md`](../../docs/SOCIAL_AGENT_CONTRACT.md)
