#!/usr/bin/env bash
# Prepara il bundle di stato FINALE nel job NON privilegiato (nessun token di scrittura,
# nessun segreto): è l'unico punto in cui gira codice dell'applicazione (merge driver di
# history.json, rigenerazione del catalogo). Il job privilegiato riceve solo il risultato.
#
#   bash tools/social-engine/ci/prepare-state.sh <render|publication> <raw-bundle-dir> <out-dir>
#   cwd: checkout di `main` con node_modules installati (npm ci) e storia sufficiente.
#
# 1. verifica il bundle "grezzo" prodotto dal job di render/apply (relativo alla sua base B0);
# 2. lo ricostruisce come commit locale su B0;
# 3. se main è avanzato, rebase su main con il merge driver campo-per-campo di history.json
#    (come commit-state.sh: un conflitto reale fallisce, nulla viene indovinato) e
#    rigenerazione del catalogo dallo stato risultante;
# 4. esporta il bundle finale relativo all'HEAD di main appena letto.
# Non fa mai push: il commit locale serve solo a calcolare le differenze.
set -euo pipefail
profile="${1:?profilo (render|publication)}"
raw="${2:?cartella del bundle grezzo}"
out="${3:?cartella di output}"
case "$profile" in render|publication) ;; *) echo "::error::profilo non valido: $profile"; exit 1 ;; esac

script="tools/social-engine/ci/state-bundle.mjs"
# Origine attesa (SEC-01): il bundle deve dichiarare il run e il workflow che l'hanno prodotto.
# Il workflow chiamante verifica le stesse due cose via API prima di arrivare qui.
expect=()
[ -n "${STATE_EXPECT_RUN:-}" ] && expect+=(--expect-run "$STATE_EXPECT_RUN")
[ -n "${STATE_EXPECT_WORKFLOW:-}" ] && expect+=(--expect-workflow "$STATE_EXPECT_WORKFLOW")
node "$script" verify --bundle "$raw" --profile "$profile" "${expect[@]}" >/dev/null
base="$(node -e 'const m=JSON.parse(require("fs").readFileSync(process.argv[1]+"/manifest.json","utf8"));process.stdout.write(m.baseSha)' "$raw")"

git fetch --quiet --no-tags origin "+refs/heads/main:refs/remotes/origin/main"
head="$(git rev-parse refs/remotes/origin/main)"
git cat-file -e "${base}^{commit}" 2>/dev/null || git fetch --quiet --no-tags --deepen=200 origin main
git merge-base --is-ancestor "$base" "$head" || { echo "::error::la base $base non è un antenato di main"; exit 1; }

git config user.name "AniMapVerse state (prepare)"
git config user.email "state-prepare@users.noreply.github.com"
git config merge.social-history.name "social history.json field-level merge"
git config merge.social-history.driver "npx --no-install tsx --tsconfig tools/social-engine/tsconfig.json tools/social-engine/cli/merge-history.ts %O %A %B"
git config merge.social-generated.name "keep, then regenerate"
git config merge.social-generated.driver true

git checkout --quiet --detach "$base"
node "$script" apply --repo . --bundle "$raw" --profile "$profile" >/dev/null
git add -A -- tools/social-engine
if git diff --cached --quiet; then
  echo "[prepare] il bundle grezzo non contiene cambiamenti"
  git checkout --quiet --detach "$head"
else
  git commit --quiet --no-verify -m "state (prepare)"
  if [ "$base" != "$head" ]; then
    echo "[prepare] main è avanzato ($(git rev-parse --short "$base") → $(git rev-parse --short "$head")): rebase con il merge driver"
    if ! git rebase --quiet "$head"; then
      git rebase --abort || true
      echo "::error::conflitto reale su history.json o su un file di stato: nulla è stato scritto su main; il bundle grezzo resta nell'artifact per il recupero"
      exit 1
    fi
    npm run --silent social:catalog > /dev/null
    git add -A -- tools/social-engine/catalog
    git diff --cached --quiet || git commit --quiet --no-verify --amend --no-edit
  fi
fi

mkdir -p "$out"
node "$script" export --repo . --base "$head" --profile "$profile" --out "$out"
