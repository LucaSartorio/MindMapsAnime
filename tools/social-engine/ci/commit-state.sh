#!/usr/bin/env bash
# Commits the social pipeline state written by a workflow run and pushes it with
# GITHUB_TOKEN (whose pushes never start workflows). Shared by Social render and
# Social publication state — only the given paths are ever staged.
#
#   bash tools/social-engine/ci/commit-state.sh "<commit subject with [skip …] [skip ci]>" <path>...
#   env: GITHUB_TOKEN, BRANCH, GITHUB_REPOSITORY, GITHUB_SERVER_URL, GITHUB_RUN_ID
#
# If the branch moved meanwhile (the other workflow committed its state), the
# commit is rebased: history.json is merged FIELD BY FIELD by the merge driver
# (render fields vs publication fields — a real conflict fails, nothing is
# guessed), the generated catalog is kept and then regenerated from the result.
set -euo pipefail
subject="$1"
shift
: "${GITHUB_TOKEN:?}" "${BRANCH:?}" "${GITHUB_REPOSITORY:?}"

git config user.name "github-actions[bot]"
git config user.email "41898282+github-actions[bot]@users.noreply.github.com"
git config merge.social-history.name "social history.json field-level merge"
git config merge.social-history.driver "npx --no-install tsx --tsconfig tools/social-engine/tsconfig.json tools/social-engine/cli/merge-history.ts %O %A %B"
git config merge.social-generated.name "keep, then regenerate"
git config merge.social-generated.driver true

git add -A -- "$@"
if git diff --cached --quiet; then
  echo "No state change to persist."
  exit 0
fi
git diff --cached --stat
git commit -q -m "$subject" -m "Run: ${GITHUB_SERVER_URL:-https://github.com}/${GITHUB_REPOSITORY}/actions/runs/${GITHUB_RUN_ID:-local}"

remote="https://x-access-token:${GITHUB_TOKEN}@github.com/${GITHUB_REPOSITORY}.git"
for attempt in 1 2 3 4; do
  if git push "$remote" "HEAD:refs/heads/${BRANCH}"; then
    echo "State committed: $(git rev-parse --short HEAD)"
    exit 0
  fi
  echo "Push rejected (branch moved?) — rebasing on the latest ${BRANCH} (attempt $attempt)"
  sleep $((attempt * 5))
  git pull --rebase "$remote" "${BRANCH}"
  npm run --silent social:catalog > /dev/null
  git add -A -- tools/social-engine/catalog
  git diff --cached --quiet || git commit -q --amend --no-edit
done
echo "::error::Could not persist the social state (the branch kept moving or history.json had a real conflict). Nothing was lost in the repository: re-run this job."
exit 1
