# Social Publishing Contract

> The contract between the **Publishing Agent** (ChatGPT Work + the Metricool plugin, external) and
> the AniMapVerse repository. The agent schedules/publishes videos that are **already rendered**;
> the repository is the **source of truth** of what was scheduled or published, and refuses
> anything that would publish the same video twice on the same platform.
> Machine-readable twin: [`tools/social-engine/publication/schemas/publication-receipt.schema.json`](../tools/social-engine/publication/schemas/publication-receipt.schema.json)
> (JSON Schema 2020-12, generated from the TypeScript constants — `npm run social:schema`).
> Engine side: [`docs/SOCIAL_ENGINE.md` › Publication State](SOCIAL_ENGINE.md#publication-state).

## 0. Roles

| Agent | Does | Contract |
| --- | --- | --- |
| **Content Agent** | chooses what to produce → queue JSON PR → videos rendered (GitHub artifact) | [`SOCIAL_AGENT_CONTRACT.md`](SOCIAL_AGENT_CONTRACT.md) |
| **Publishing Agent** | publishes **already-rendered** videos through Metricool → reports with **publication receipts** | this document |

The repository contains **no** Metricool / Instagram / Facebook / TikTok / YouTube API call, SDK, token, brand id,
account name or timezone. All of that belongs to the Publishing Agent's own configuration and never
enters the repository (not in receipts, not in PRs, not in notes).

## 1. The agent's whole job

```
read catalog.publishing.ready (default branch)
  → pick a render × platform still notScheduled / failed
  → check no open receipt PR already covers it
  → download the GitHub artifact → render-summary.json → manifest → MP4 (by renderId)
  → Metricool: schedule (or publish) → keep post id · UUID · planner URL · scheduled time
  → write ONE receipt per platform in tools/social-engine/publication/pending/
  → branch → PR → "Social publication validate" green → merge
  → "Social publication state" applies it → history + catalog updated
  → later, when the post is live: a "published" receipt (publishedAt + public URL)
```

**Priority rule.** PRIORITY 1: rendered videos not yet scheduled/published on the target platform
(`catalog.publishing.ready`) — publish those first. PRIORITY 2: only when that list is empty for the
platform, ask the Content Agent for new content.

## 2. What to read (never edit)

| File (default branch) | Use |
| --- | --- |
| `tools/social-engine/catalog/catalog.json` → **`publishing`** | Your work list. `ready[]`: rendered, MP4 downloadable, ≥ 1 platform `notScheduled`/`failed`; oldest render first. `unavailable[]`: rendered but the MP4 can't be downloaded (local render / artifact expired) — skip, it needs a new render. `summary`: counts by status. |
| `tools/social-engine/history/history.json` | The truth per `renderId`: `renderStatus`, `artifact`, `publicationStatus`, `platforms[]`. Re-read it right before calling Metricool. |
| `catalog.json` → `templates.*.items[].publication` | Same state per catalog item (per locale/variant), with `scheduledLocales` / `publishedLocales`. |
| `tools/social-engine/publication/failed/*.error.json` | Why one of your receipts was rejected. |

A `ready[]` entry:

```json
{
  "renderId": "character-journey:dragonball:goku:part-01@en",
  "contentId": "character-journey:dragonball:goku:part-01",
  "anime": "dragonball", "subject": "goku", "subjectName": "Goku",
  "locale": "en", "variant": null,
  "segment": "part-01", "partNumber": 1, "partCount": 5,
  "renderedAt": "2026-10-02T10:45:46.778Z", "durationSeconds": 25,
  "publicationStatus": "notPublished",
  "platforms": { "instagram": "notScheduled", "facebook": "notScheduled", "tiktok": "notScheduled", "youtube": "notScheduled" },
  "artifact": {
    "name": "animapverse-social-render-36996948068-1", "runId": "36996948068", "runAttempt": "1",
    "runUrl": "https://github.com/LucaSartorio/MindMapsAnime/actions/runs/36996948068",
    "video": "videos/dragonball_goku_character-journey_part-01_en.mp4",
    "manifest": "manifests/dragonball_goku_character-journey_part-01_en.manifest.json",
    "sha256": null, "expiresAt": "2026-11-01T10:45:48Z"
  }
}
```

To do on platform P ⇔ `platforms[P]` is `notScheduled` or `failed`. **`scheduled` or `published` on P
= never again on P** (another platform is independent). `renderedBefore` / `renderedLocales` in the
catalog only mean "an MP4 exists" — never "published".

**Series.** Every part is its own `renderId` with its own state: Goku Part 1 scheduled says nothing
about Part 2. Publish parts in order (`partNumber`) on a platform: don't schedule Part N before
Part N − 1 is scheduled/published there, unless a human asks.

## 3. From the artifact to the right MP4

1. `artifact.name` / `artifact.runId` → GitHub API: list the artifacts of run `runId`, take the one
   named `artifact.name` (`animapverse-social-render-<runId>-<attempt>`), download the zip. It expires
   at `expiresAt` (30-day retention): an expired one appears in `unavailable[]`.
2. Read **`render-summary.json`** at the zip root; find the `rendered[]` entry whose **`renderId`
   equals** yours (never match by "similar" names).
3. That entry gives `video` (`videos/<stem>.mp4`), `manifest` (`manifests/<stem>.manifest.json`) and
   `sha256`. Check the MP4's sha256 against it (and against `artifact.sha256` when not null).
4. The manifest (`renderId` must match again) gives the caption facts: `publication.title`
   (e.g. "Goku · Character Journey · Part 1 of 5"), hook, CTA, page URL, series facts.

Never re-render, edit or re-encode the video; never commit it, the zip or a thumbnail.

## 4. Avoiding duplicates (BEFORE calling Metricool)

The repository rejects a second scheduling record — but only **you** can avoid creating the second
post. Before scheduling `renderId` on platform P:

1. re-read `history.json` on the default branch: `platforms[]` for P must be absent or `failed`;
2. check there is **no open PR** adding a receipt for the same `renderId` + P (and nothing for it in
   `publication/pending/` on the default branch) — a receipt that isn't merged/applied yet is not in
   history;
3. check Metricool itself (the planner) for a post already created for this video, e.g. after a crash
   between "scheduled in Metricool" and "receipt written": if it exists, **don't create a new post** —
   write the receipt for the existing one.

## 5. Metricool data to keep

Keep everything Metricool returns, as returned: **post id** → `providerPostId`, **UUID** →
`providerPostUuid` (keep both: the id may change after edits, the UUID is stable — the repository
matches posts by UUID first), **planner URL** → `plannerUrl` (back-office link; NOT the public post),
**scheduled date-time with its offset** → `scheduledFor`. Later: the **public URL** of the live post →
`publicUrl`, and **publishedAt**. If Metricool doesn't return an id or UUID, omit the field (never
invent one) — but without any id a later receipt can't prove it is about the same post.

## 6. Publication receipts

One JSON object per file in `tools/social-engine/publication/pending/`, **one event × one platform**:

- file name: `[A-Za-z0-9][A-Za-z0-9._-]*.json`, recommended
  `<yyyymmddThhmmssZ>-<stem>-<platform>-<status>.json`, e.g.
  `20261002T120000Z-dragonball_goku_character-journey_part-01_en-instagram-scheduled.json`;
- ≤ 16 KB, UTF-8, no duplicate keys, **no unknown fields**;
- `receiptVersion: 1`; `provider: "metricool"`; `platform`: `instagram` | `facebook` | `tiktok` | `youtube` (all handled through Metricool);
- timestamps: full ISO 8601 **with seconds and an offset** (`2026-10-05T10:00:00+02:00` or `…Z`),
  stored exactly as written (keep the original offset of `scheduledFor`);
- URLs: `https://` only, no credentials; `providerPostId`: `[A-Za-z0-9][A-Za-z0-9._:-]{0,127}`;
  `providerPostUuid`: the same plus ONE optional leading `-` (`^-?[A-Za-z0-9][A-Za-z0-9._:-]{0,127}$` —
  Metricool returns signed numeric UUIDs such as `-2035779932044177791`; copy them exactly, sign included).

| Field | scheduled | published | failed |
| --- | --- | --- | --- |
| `receiptVersion`, `renderId`, `platform`, `provider`, `status`, `recordedAt` | required | required | required |
| `scheduledFor` | **required** | optional | optional |
| `publishedAt` | — | **required** | — |
| `error` | — | — | **required** (≤ 1000 chars) |
| `providerPostId`, `providerPostUuid`, `plannerUrl` | when available | when available | when available |
| `publicUrl` | — | when available | — |
| `recordedBy` (e.g. `chatgpt-work-publishing-agent`), `notes` (≤ 500) | optional | optional | optional |

`recordedAt` = when you write the receipt. The repository derives the **receipt id** itself
(`<stem>.<platform>.<status>.<hash>`): the same event sent twice is applied once.

### scheduled

```json
{
  "receiptVersion": 1,
  "renderId": "character-journey:dragonball:goku:part-01@en",
  "platform": "instagram",
  "provider": "metricool",
  "status": "scheduled",
  "scheduledFor": "2026-10-05T10:00:00+02:00",
  "providerPostId": "123456",
  "providerPostUuid": "0b8e4c1a-5d7f-4a7e-9a52-3c1d2b9e8f00",
  "plannerUrl": "https://app.metricool.com/planner",
  "recordedAt": "2026-10-02T12:00:00Z",
  "recordedBy": "chatgpt-work-publishing-agent"
}
```

### published

```json
{
  "receiptVersion": 1,
  "renderId": "character-journey:dragonball:goku:part-01@en",
  "platform": "instagram",
  "provider": "metricool",
  "status": "published",
  "publishedAt": "2026-10-05T10:00:14+02:00",
  "providerPostId": "123456",
  "providerPostUuid": "0b8e4c1a-5d7f-4a7e-9a52-3c1d2b9e8f00",
  "publicUrl": "https://www.instagram.com/reel/C0d3Ex4mpl3/",
  "recordedAt": "2026-10-05T08:30:00Z",
  "recordedBy": "chatgpt-work-publishing-agent"
}
```

Send it only once the post is really live (Metricool shows it published / the public URL works).
A video published immediately (no scheduling step) can go straight to `published`.

### failed

```json
{
  "receiptVersion": 1,
  "renderId": "character-journey:dragonball:goku:part-01@en",
  "platform": "instagram",
  "provider": "metricool",
  "status": "failed",
  "providerPostUuid": "0b8e4c1a-5d7f-4a7e-9a52-3c1d2b9e8f00",
  "error": "Metricool: Instagram rejected the media (aspect ratio)",
  "recordedAt": "2026-10-05T08:12:00Z",
  "recordedBy": "chatgpt-work-publishing-agent"
}
```

A failure keeps the video usable: the platform goes back to "to do" and a new `scheduled` receipt is
a **retry** (new post). Never put tokens, account names or raw API responses in `error` / `notes`.

## 7. What the repository accepts (state machine per renderId × platform)

| current \ receipt | scheduled | published | failed |
| --- | --- | --- | --- |
| notScheduled | ✔ | ✔ (immediate publish / import) | ✔ |
| scheduled | only the **same post** (same UUID, else same id): identical → no-op; new `scheduledFor` → reschedule. Another or unidentifiable post → **rejected** | ✔ (same post) | ✔ (same post) |
| failed | ✔ retry | ✔ | ✔ |
| published | **rejected** | same post, no conflicting `publishedAt`/`publicUrl` → no-op / adds missing `publicUrl` | **rejected** |

Also rejected: unknown `renderId`; a video whose `renderStatus` is not `rendered`; any contract error.
The aggregate `publicationStatus` is derived: none → `notPublished`; something scheduled, nothing
published → `scheduled`; all touched platforms published → `published`; published + scheduled/failed
elsewhere → `partiallyPublished`; only failures → `failed`. `scheduled` is never `published`.

## 8. Pull request flow

1. Branch from the default branch: `social/publication-<stem>-<platform>-<status>` (any name works).
2. Commit **only new files** in `tools/social-engine/publication/pending/` — the check
   *Receipt PR scope* fails if the PR edits or deletes anything, or touches any other path.
3. Open the PR. **Social publication validate** must be green (scope + contract + history +
   transitions + tests). Red = read the log: it names the receipt, renderId, platform, current and
   requested state and the error.
4. Merge (auto-merge is fine once green). **Social publication state** runs on `main`: it re-validates,
   applies **all receipts or none**, moves them to `publication/applied/` (audit trail) and commits
   history + catalog (`chore(social): record publication state [skip social-publication] [skip ci]`).
5. Verify: `history.json` → `records[renderId].platforms[]` shows your platform with the new status.

Several receipts in one PR are fine (they are applied in event order). If one is invalid, none is
applied: the invalid ones land in `publication/failed/` with a `.error.json`, the valid ones stay
pending and are applied by the next run (next receipt PR, or a manual run of the workflow).
To fix a rejected receipt, submit a **new** file — never edit `failed/` or `applied/`.

## 9. Never

- publish/schedule a render × platform that is `scheduled` or `published` in history (or has an open receipt PR);
- pick an MP4 by file-name similarity instead of `renderId`;
- edit `history.json`, `catalog.json`, `publication/applied|failed/`, the engine, workflows or anything
  outside `publication/pending/`;
- change, re-render or re-encode a video; commit MP4s, zips, thumbnails or Metricool media;
- put tokens, brand ids, account names, cookies or API keys anywhere in the repository;
- report `published` for a post that is only scheduled.

## 10. Later: analytics

Not implemented. The keys to correlate metrics (views, watch time, likes, comments, shares) are
already recorded per platform: `renderId` + `platform` + `providerPostUuid` (+ `providerPostId`) +
`publicUrl`, with the receipt trail in `publication/applied/`.
