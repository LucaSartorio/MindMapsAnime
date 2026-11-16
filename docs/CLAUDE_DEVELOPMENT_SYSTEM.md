# AniMapVerse — Claude Code development system

Guida operativa all'infrastruttura Claude Code del repository. Principio: **il sistema più piccolo che permetta di
sviluppare AniMapVerse in modo affidabile**; ogni componente esiste perché aggiunge qualcosa che Claude Code non fa
già da solo (verificato con misure, §8).

## 1. Cosa viene caricato e quando

| Componente | Quando entra nel contesto | Contenuto |
|---|---|---|
| `CLAUDE.md` (~7,8k caratteri) | ogni sessione e ogni sub-agent (tranne `lightweight-research`) | progetto, criteri di lavoro e delega, mappa del contesto, comandi principali, invarianti, matrice di validazione, git |
| `.claude/rules/*.md` (10 file, `paths`) | quando si legge/modifica un file corrispondente | solo vincoli, errori da evitare e verifiche dell'area |
| `docs/ARCHITECTURE.md` | solo se letto (on-demand) | come funziona il codice e perché: descrizioni, decisioni e misure storiche (testo originale di CLAUDE.md, invariato) |
| Descrizioni di agent e skill | ogni sessione (le skill manuali no) | una riga ciascuna, per il routing |
| Corpo di skill e agent | solo all'invocazione | la procedura |
| `.claude/settings.json` + hook | applicati dal client, non occupano contesto | permessi, guardie su Bash |

Fonte unica per ogni vincolo: invarianti trasversali in `CLAUDE.md`, vincoli d'area nella rule, contratti social in
`docs/SOCIAL_*.md`, SEO in `docs/SEO.md`, i18n in `docs/I18N.md`. `ARCHITECTURE.md` spiega, non prescrive.

## 2. Sub-agent (8)

| Agent | Modello · effort | Tool | Perché esiste |
|---|---|---|---|
| `anime-data-curator` | sonnet · high | Read, Grep, Glob, Edit, Write, Bash, WebSearch, WebFetch | ricerca con fonti e batch di dati fuori dal contesto principale |
| `map-engineer` | sonnet · high | Read, Grep, Glob, Edit, Write, Bash | mappe, coordinate, generatori `mapgen` |
| `frontend-specialist` | sonnet · medium | Read, Grep, Glob, Edit, Write, Bash | UI, store, a11y a costo Sonnet |
| `seo-growth-engineer` | sonnet · high | Read, Grep, Glob, Edit, Write, Bash, WebFetch | layer SEO, analisi di indicizzazione |
| `qa-performance-engineer` | sonnet · high | Read, Grep, Glob, Edit, Write, Bash | build, smoke, audit a11y e misure con i log fuori dal contesto principale |
| `social-engine-specialist` | sonnet · medium | Read, Grep, Glob, Edit, Write, Bash | codice del motore social, nessun MCP/web |
| `security-devops` | sonnet · high | Read, Grep, Glob, Bash (**sola lettura imposta**), GitHub MCP in lettura | review di workflow, permessi, dipendenze |
| `lightweight-research` | haiku · low, `omitClaudeMd` | Read, Grep, Glob, Bash (**sola lettura imposta**) | ricerche economiche; esegue il fork di `/analyze-data-coverage` |

Funzioni coperte da strumenti integrati di Claude Code (nessun duplicato nel repo): progettazione → agent `Plan`
(stesso modello della sessione, sola lettura imposta dall'hook); review indipendente di diff/PR → `/code-review
<PR|branch>`; review di sicurezza delle modifiche → `/security-review`; esplorazione ampia → `Explore`.

Modello ed effort sono nel frontmatter, indipendenti dal modello della sessione. Precedenza: parametro della singola
delega → frontmatter → `CLAUDE_CODE_SUBAGENT_MODEL` → modello della sessione; per l'effort
`CLAUDE_CODE_EFFORT_LEVEL` vince su tutto (non impostarla). Verifica: i transcript dei sub-agent
(`~/.claude/projects/<repo>/<sessione>/subagents/*.jsonl`) registrano `model` ed `effort` di ogni messaggio.

## 3. Skill (8)

| Comando | Cosa automatizza | Invocazione |
|---|---|---|
| `/add-anime-world <mondo> [resume]` | nuovo mondo in 12 batch riprendibili: fonti, perimetro canonico, dataset, mappa, IT/EN, privato fino all'approvazione | auto + manuale |
| `/enrich-anime-world <mondo> [focus]` | lacune di un mondo esistente, batch prioritizzati con delta misurato | auto + manuale |
| `/analyze-data-coverage [mondo]` | report di completezza (fork economico su Haiku) | auto + manuale |
| `/optimize-map <mondo\|all> [livello\|problema]` | collisioni, cluster, zoom, sotto-mappe, generatori, performance mappa | auto + manuale |
| `/seo-opportunities [mondo] [export.csv]` | problemi verificati / opportunità / ipotesi SEO | auto + manuale |
| `/sync-translations <mondo\|ui> [es\|fr]` | overlay es/fr, indice traduzioni, chiavi UI | auto + manuale |
| `/optimize-performance [target]` | baseline → modifica → misura (vieta lo script distruttivo `optimize:images`) | auto + manuale |
| `/audit-animapverse [area\|release]` | audit con risultati verificati; `release` = gate completo GO/NO-GO | auto + manuale |

Le skill sono scoperte automaticamente da `.claude/skills/` (nessun index, nessuna `.claude/commands/`: i comandi sono
confluiti nelle skill). Nel contesto entra solo la descrizione; il corpo all'invocazione.

## 4. Permessi e protezioni

Tre livelli, da non confondere:
1. **Istruzioni** nel prompt di agent/skill: orientano, non impediscono.
2. **Allowlist `tools:`** (ogni agent ne ha una): impedisce davvero un tool. Senza, un agent eredita tutti i tool,
   compresi i tool MCP di scrittura (merge di PR, push di file) che agiscono via API.
3. **Hook `bash-policy.mjs`** (in `settings.json`, riceve `agent_type`): per tutti blocca push forzati, verso
   `main`/`master` (anche impliciti: `git push`, `git push origin HEAD` risolti da branch, upstream, `push.default`),
   di massa o cancellazioni, anche dentro `bash -c`, `eval`, `$(…)`, alias; per `Plan`, `security-devops` e
   `lightweight-research` ammette solo comandi in sola lettura. Gli hook nel frontmatter degli agent non si usano:
   Claude Code li salta nelle cartelle non trusted e nei processi `-p`.

`settings.json`: allow per validatori e report, ask su `.github/**` e sui file di hook/settings, deny sulla lettura di
`.env` e sulla modifica dei file generati o di stato. **Gli hook non sostituiscono il ruleset di `main`**
(`docs/SECURITY_SEC-02.md`): valgono solo per `git` nelle sessioni Claude Code.

## 5. CI

Site CI esegue `npm run claude:validate` nel job `scope` (ogni PR, anche social, senza `npm ci`, pochi secondi). Il
validatore controlla: campi YAML noti, nomi, modelli/effort, allowlist esplicite, solo tool MCP di lettura, lista
read-only allineata all'hook, `paths` delle rules che corrispondono a file reali, ogni `npm run` e file citato
esistente, rules elencate nella mappa del contesto, agent e skill documentati qui, budget di `CLAUDE.md`; poi i test
degli hook.

## 6. World Engine (`/add-anime-world`, `/enrich-anime-world`)

Stato persistente in `docs/world-pipeline/<slug>.md` (template nel README): batch, fonti, ledger delle affermazioni
contestate o non verificate, decisioni aperte, prossimo passo; un commit per batch. Un mondo in costruzione
(`coming_soon` + loader) è privato ovunque ma validato da `validate:data`, `validate:i18n`, `coverage:chapters`.
Ricerca: `anime-data-curator` con WebSearch/WebFetch; dove mancano, nelle sessioni Cloud c'è l'agent `web-fetch` del
harness; altrimenti ci si ferma al piano delle fonti. Mappe: SVG originali da `scripts/mapgen/<slug>.py`.
Pubblicazione (`available`) solo con approvazione del proprietario.

## 7. Uso quotidiano

```text
Aggiungi Frieren ad AniMapVerse            → /add-anime-world frieren
Completa gli eventi di Bleach               → /enrich-anime-world bleach events
Quanto è completo Jujutsu Kaisen?           → /analyze-data-coverage jujutsukaisen
I pin di Wano si sovrappongono              → /optimize-map onepiece
Controlla il SEO di Naruto                  → /seo-opportunities naruto
Rivedi la PR 330                            → /code-review 330 (integrato)
È pronto per il rilascio?                   → /audit-animapverse release
```

## 8. Misurare

- `/context` (anche con `claude -p "/context"`): token per categoria (system, tool, agent, memory, skill).
- Costo di un task: `claude -p --output-format json "<prompt>"` → `usage` e `modelUsage` per modello.
- Effort effettivo dei sub-agent: transcript (§2). Il placeholder `${CLAUDE_EFFORT}` riporta l'effort della sessione,
  non dell'agent.
- `/doctor prompt-audit`: audit di istruzioni obsolete o contraddittorie (non modifica nulla).

Misure di riferimento (2026-11-16, `claude -p`, processo nuovo, stessi prompt) — vedi la PR di ottimizzazione per i
valori prima/dopo: contesto iniziale del progetto, regole caricate per file, costo di ricerca, task frontend, analisi
SEO e copertura.

## 9. Cloud e locale

| Superficie | CLAUDE.md | rules con `paths` | agent | skill | settings/hook |
|---|---|---|---|---|---|
| CLI / Desktop locale | sì | sì | sì | sì | sì (cartella trusted) |
| Cloud, repo singola | sì | sì (verificato) | sì (verificato) | sì (verificato) | sì (verificato) |
| Thread Cloud di *Projects* | sì | **no** | non documentato | **no** | **no** |

Nei thread *Projects* il core dice di leggere a mano rule e `SKILL.md`; le protezioni restano CI, CODEOWNERS e ruleset.
Le modifiche ai file degli agent valgono dalla sessione successiva.

## 10. Troubleshooting

| Sintomo | Causa / rimedio |
|---|---|
| Una skill non compare in `/` | sessione avviata prima del commit → nuova sessione; nei thread *Projects* leggere il `SKILL.md` |
| Un agent usa un modello/effort diverso | variabili `CLAUDE_CODE_SUBAGENT_MODEL(_FORCE)`/`CLAUDE_CODE_EFFORT_LEVEL`, `availableModels` o override della delega; controllare i transcript |
| Un agent ignora un `tools:` appena cambiato | definizioni lette all'avvio della sessione |
| `[readonly-bash]` blocca un agent di analisi | voluto; se manca un comando di sola lettura legittimo, aggiungerlo in `readonly-bash.mjs` con un test |
| `[guard-bash]` blocca un push | push forzato o verso `main`: usare il branch di lavoro |
| Edit rifiutato su un file generato | voluto (deny): usare lo script ufficiale |
| Una rule non si carica | il file non corrisponde ai `paths` (`claude:validate` segnala i glob morti) |

## 11. Aggiornare il sistema

- Nuovo vincolo d'area → nella rule (breve), la spiegazione in `ARCHITECTURE.md`; in `CLAUDE.md` solo invarianti
  trasversali.
- Nuovo agent o skill solo se una misura mostra un vantaggio (costo, isolamento del contesto, procedura specifica del
  progetto) rispetto a Claude Code e agli strumenti integrati; aggiungerlo qui, poi `npm run claude:validate`.
- Nuova area di codice → aggiornare i `paths` della rule competente.
