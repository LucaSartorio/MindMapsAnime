# Analytics (internal)

The repository never calls Metricool. The external **Analyst Agent** (ChatGPT Work + Metricool)
reads the metrics of published posts and reports them as **analytics snapshots**.

| Folder / file | Who writes | What |
| --- | --- | --- |
| `pending/` | Analyst Agent (via PR) | New snapshots, one JSON per published render × platform |
| `applied/` | pipeline only | Audit trail of applied snapshots |
| `failed/` | pipeline only | Rejected snapshots + `.error.json` |
| `metrics.json` | pipeline only | Latest metrics per render × platform (input of the performance engine) |
| `schemas/` | `npm run social:schema` | `analytics-snapshot.schema.json` (generated) |

Contract: [`docs/SOCIAL_ANALYTICS_CONTRACT.md`](../../../docs/SOCIAL_ANALYTICS_CONTRACT.md) ·
engine docs: [`docs/SOCIAL_ENGINE.md`](../../../docs/SOCIAL_ENGINE.md) › Analytics.
