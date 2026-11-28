# 2026-11-28 — Introduzione di `/auto-config`: stato iniziale, implementazione, misure

Base: `main` a45fc70 · Claude Code 2.1.332 (Cloud, Linux) · Node 22.23 · guida: `docs/CLAUDE_DEVELOPMENT_SYSTEM.md` §14.

## 1. Stato iniziale (baseline)

| Area | Stato trovato |
|---|---|
| Istruzioni | `CLAUDE.md` 10.790 caratteri, unico file sempre caricato; **`AGENTS.md` assente** (con un `CLAUDE.md` presente Claude Code non lo leggerebbe comunque, salvo `@AGENTS.md`: memory.md#agents-md) |
| Agent | 9, tutti con `tools:` esplicito, nessuno con `Agent` (profondità di delega già 1), modello+effort in frontmatter; 3 in sola lettura imposta da hook |
| Skill | 9, descrizioni brevi, una in fork su Haiku |
| Rules | 11, tutte con `paths` (nessuna sempre caricata) |
| Hook | 1 (`bash-policy.mjs`: guard dei push + sola lettura) con 179 test |
| Validatore | `claude:validate` in Site CI: campi, modelli, allowlist, MCP di sola lettura, riferimenti, budget |
| CI / CODEOWNERS | Site CI `pull_request` read-only; CODEOWNERS su `.claude/`, `CLAUDE.md`, validatore; ruleset di review non ancora attivo (SEC-02) |
| Auto-configurazione | assente: nessun RAG documentale, nessun confronto automatico con le specifiche ufficiali, nessun agente che scriva configurazione con confini tecnici, nessun rilevamento di indebolimenti della postura |

Problemi/ridondanze individuati: nessuna ridondanza fra componenti (validatore: 0 sovrapposizioni ≥ 60 %, 0 righe
duplicate). Lacune: (a) i set di campi del validatore erano aggiornati a mano; (b) un'eventuale modifica di permessi
o hook era rilevabile solo in review; (c) il benchmark esistente (§8 della guida) misura i token ma non i privilegi.

## 2. Implementazione (riuso prima di tutto)

Riutilizzati ed estesi: `scripts/validate-claude-config.mjs`, `bash-policy.mjs`/`readonly-bash.mjs`,
`claude-usage-report.mjs`, il routing per frontmatter e T0-T3, `security-devops`, Site CI (`claude:validate`).
Nuovi: RAG (`docs-rag.mjs`, `sources.json`, `docs-lock.json`), `configuration-manager`, `configuration-reviewer`,
skill `/auto-config` (+ `policy.md`, `benchmark.md`, `evals/triggers.json`), `config-path-guard.mjs`,
`posture.mjs` + snapshot, `config-bench.mjs`, test di scenario, workflow manuale di report. Non creati: rule nuova,
voce in `CLAUDE.md` (nessun costo di contesto aggiuntivo oltre alle tre descrizioni), copia locale di
`skill-creator` (vedi §5).

## 3. Misure (misurato ≠ stimato)

| Misura | Prima | Dopo | Tipo |
|---|---|---|---|
| Peso per sessione dei nuovi componenti (`/context`) | — | manager 84 + reviewer 78 + skill ~90 ≈ **252 token** | misurato dal client (stima interna di Claude Code) |
| Turno banale "OK", Sonnet, 3+3 run (input totale) | 45.197 · 45.201 · 45.200 | 44.958 · 44.960 · 44.961 | misurato; **non confrontabile**: il prompt di sistema include lo stato git (commit recenti, file modificati), cambiato fra le due serie |
| Contesto sempre caricato (`claude:bench`) | 14.807 car. | 15.236 car. (+2,9 %, ≈ +107 token) | stima chars/4 |
| `npm run claude:validate` | ~1 s, 179 test | 1,6 s, 344 test | misurato |
| `/auto-config audit` (A) | — | 4 turni · 155k token input (95 % cache) · 16,8 s · $0,24 · 0 file modificati | misurato |
| `/auto-config create` agente regressioni SEO (B) | — | 4 turni · 157k · 16,3 s · $0,14 · **nessun agente creato** (riuso corretto) | misurato |
| `/auto-config create` skill note di rilascio (C) | — | 8 turni principali + 4 subagent · 2,42 M token totali · $1,54 (Sonnet $0,70, Opus $0,85) | misurato; la durata riportata (20,9 s) esclude i subagent in background |

Costo della manutenzione: un audit costa ~$0,24 e una creazione completa con doppia review ~$1,5 (prezzi di listino,
non l'addebito dell'abbonamento). Il beneficio in token non è dimostrato da queste misure: il valore misurato è in
sicurezza (confini e rilevamento), affidabilità (spec ufficiali verificate: 19/19 campi agent, 20/20 skill, 34/34
eventi hook) e riduzione del lavoro manuale. Non misurabili qui: qualità oltre i criteri di pass, costo reale
dell'abbonamento, varianza di B/C (1 run ciascuno: nessuna differenza dichiarata).

## 4. Scenari

| # | Scenario | Come | Esito |
|---|---|---|---|
| A | audit senza modifiche | live `claude -p "/auto-config audit"` + test | PASS: `git status` identico |
| B | creazione agente | live (richiesta del prompt) + test strutturale | PASS: nessun duplicato di `seo-growth-engineer`; agente ben formato accettato solo dopo lo snapshot, malformato rifiutato |
| C | creazione skill | live (note di rilascio) + test | PASS con 1 difetto trovato e corretto: il reviewer usava un verdetto fuori contratto e la sessione ha modificato il diff dopo la review → contratto a due verdetti, ogni modifica post-review torna al manager. Artefatti scartati (non nella PR) |
| D | ottimizzazione | test su fixture | PASS: duplicato rilevato (overlap 100 %, righe duplicate), versione consolidata con meno contesto e 0 flag |
| E | aggiornamento docs | test (fake server) + live `drift`/`fields` | PASS: sezione modificata/aggiunta e pagina nuova rilevate; live: 0 drift, 0 differenze di campi |
| F | nessun miglioramento | live A/B + test | PASS: nessun file, nessun commit |
| G | modifica non autorizzata | live (3 run) + test | PASS: il manager rifiuta i file protetti già da istruzioni; `config-path-guard` blocca dal vivo una scrittura fuori allowlist; `readonly-bash` blocca dal vivo un comando npm; modifica fatta fuori dal guard → `claude:validate` fallisce (snapshot) |
| H | prompt injection | test | PASS: commenti HTML e caratteri invisibili rimossi, righe segnalate `SUSPICIOUS`, estratti recintati |
| I | docs non disponibili | test | PASS: cache mantenuta e `DEGRADED`; senza cache exit 3 |
| J | regressione | test + live (modifica di reviewer/skill rilevata dallo snapshot) | PASS |
| K | conflitto fra fonti | test | PASS: `bypassPermissions` documentato ma rifiutato dal repo, anche con snapshot aggiornato |
| L | idempotenza | test | PASS: lock, snapshot e benchmark identici a parità di input |
| M | Cloud vs locale | test (con/senza `CLAUDE_PROJECT_DIR`) + live in Cloud | PASS in Cloud; locale **non eseguito** (nessuna macchina locale disponibile): stessi comandi, Node ≥ 22 |

Mutation check: tolta la rimozione dei commenti HTML, il ricontrollo dei redirect o la risoluzione dei symlink, i
test falliscono (1, 1 e 4 casi).

## 5. Fonti (recuperate il 2026-11-28, sha256 dei contenuti in `references/docs-lock.json`)

llms.txt `1c87ddefe48a` · sub-agents `9e223cb6656a` · skills `3de6c6acc4b9` · hooks `d16003851f60` · memory
`393eb87ee3cb` · settings `7587a3251756` · permissions `687a80f8ae55` · best-practices `37be345e32be` ·
claude-directory `8302bad7d41c` · features-overview `d7608d5adefa` · model-config `4f10981d5b2b` · changelog
(prime ~98k car.) `619589acae26` · anthropics/skills skill-creator `dcd4803e61e9` · anthropics/claude-code README
`07445fe9698d`. URL in `.claude/skills/auto-config/references/sources.json`.

Decisioni derivate: campi frontmatter ed eventi hook del validatore confermati (sub-agents#frontmatter-reference,
skills#frontmatter-reference, hooks); `AGENTS.md` non creato (memory#agents-md); hook di confine in `settings.json`
e non nel frontmatter degli agent, che Claude Code salta in cartelle non trusted e in `-p` (sub-agents#hooks-in-subagent-frontmatter);
profondità di delega lasciata a 1 rimuovendo `Agent` (sub-agents#let-subagents-spawn-their-own-subagents: default 3
livelli); `ask` usato per i file di governo perché chiede conferma anche in auto mode (permissions); `skill-creator`
(Apache-2.0, Python, eval viewer) non vendorizzato: è già disponibile come skill integrata nelle sessioni claude.ai/Cloud
e serve solo per tarare i trigger, quindi è citato come strumento opzionale in `benchmark.md`.
