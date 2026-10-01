# Test fixtures (never processed: the pipeline only reads content/queue/)

Used to test the cloud renderer (`.github/workflows/social-render.yml`). To replay the
partial-failure test, copy both files into `tools/social-engine/content/queue/` (in a PR):
the valid one renders, the invalid one goes to `content/failed/` with a `.error.json`, the
run ends red but still uploads the artifact and commits the state.

**Clean up afterwards**: delete the fake item from `content/failed/` (`*.json` + `.error.json`)
in a follow-up PR. Real renders stay in `history/history.json` (that's the point of history);
to forget a test render, delete its record there and its file in `content/rendered/`.
