# Publication state (internal)

The repository never publishes. The external **Publishing Agent** (ChatGPT Work + Metricool)
schedules/publishes a rendered video, then reports what happened with a **publication receipt**.

| Folder | Who writes | What |
| --- | --- | --- |
| `pending/` | Publishing Agent (via PR) | New receipts, one JSON per event per platform |
| `applied/` | pipeline only | Audit trail: `<receiptId>.json` = original receipt + transition + run |
| `failed/` | pipeline only | Rejected receipts + `.error.json` (why) |
| `schemas/` | `npm run social:schema` | `publication-receipt.schema.json` (generated) |

Contract: [`docs/SOCIAL_PUBLISHING_CONTRACT.md`](../../../docs/SOCIAL_PUBLISHING_CONTRACT.md) ·
engine docs: [`docs/SOCIAL_ENGINE.md`](../../../docs/SOCIAL_ENGINE.md) › Publication State.
