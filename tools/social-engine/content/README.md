# Social content (file-based queue)

| Folder | State | Who writes |
| --- | --- | --- |
| `queue/` | waiting to be rendered, processed in file-name order | `npm run social:queue`, a person, or (later) an agent |
| `rendered/` | rendered (the config that produced the MP4) | the batch |
| `failed/` | rejected or failed + `<file>.error.json` | the batch |
| `archive/` | set aside by hand (cancelled ideas); never read by the pipeline | people |

One JSON object per file — contract: [`docs/SOCIAL_AGENT_CONTRACT.md`](../../../docs/SOCIAL_AGENT_CONTRACT.md),
schema: [`../schemas/social-content.schema.json`](../schemas/social-content.schema.json).

```bash
npm run social:validate:queue
npm run social:render:queue -- --dry-run
npm run social:render:queue
npm run social:retry:failed
```
