# AniMapVerse — Claude Code development system

Guida operativa all'infrastruttura Claude Code del repository. Principio: **il sistema più piccolo che permetta di
sviluppare AniMapVerse in modo affidabile**; ogni componente esiste perché aggiunge qualcosa che Claude Code non fa
già da solo (verificato con misure, §8).

## 1. Cosa viene caricato e quando

| Componente | Quando entra nel contesto | Contenuto |
|---|---|---|
| `CLAUDE.md` (~9,6k caratteri, ~44,2k token di un turno banale con Sonnet, §8) | ogni sessione e ogni sub-agent (tranne `lightweight-research`) | progetto, triage T0-T3, delega, escalation, contratto di completamento, mappa del contesto, comandi, invarianti, matrice di validazione, git |
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
| `/seo-opportunities [mondo] [quick] [export.csv]` | problemi verificati / opportunità / ipotesi SEO | auto + manuale |
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
   Claude Code li salta nelle cartelle non trusted e nei processi `-p`. Dal 2026-11-18 la sola lettura chiude anche
   le scritture indirette (`sort -o`, `uniq IN OUT`, `xxd IN OUT`, `tree -o`, `sed` con `w`/`W`/`e`/`r`/`-f`: ammessi
   solo indirizzi, `p`/`d`/`q`… e `s///` con flag `gpiImM`) e l'esecuzione di comandi via git (`git -c`,
   `--config-env`, `--exec-path=`, `--ext-diff`, `--upload-pack`, `grep -O`; `git -c core.fsmonitor=…` e
   `diff.external` verificati), via `rg --pre`, `sort --compress-program` e via variabili `GIT_*`, `PAGER`,
   `LESSOPEN`, `NODE_OPTIONS`, `HOME`, `XDG_CONFIG_HOME`. Hotfix 2026-11-18: `sed` è analizzato come getopt (`-e'…'`,
   `-ne'…'`, `--expression`; opzioni sconosciute o abbreviate rifiutate: prima lo script attaccato a `-e` era ignorato e
   veniva controllato il nome del file), abbreviazioni GNU/git delle opzioni pericolose (`sort --outp=`, `git fetch
   --upload-p=`, `git grep --open-files=`), `tree -fo`; rifiutate per gli agent di sola lettura le espansioni che il
   lexer non vede (`$VAR`, `${…}`, `{a,b}`, `$'…'`) e `$(…)` come nome del programma. Il lexer condiviso decodifica
   `$'…'` come bash (`\'` non chiude la stringa: prima nascondeva un intero comando, `git push --force origin main`
   incluso) e rappresenta l'output di `$(…)`/backtick con il segnaposto `$`; il guard dei push rifiuta un `git push` con
   argomenti espansi e i push impliciti/`HEAD` dopo `cd`/`-C` verso una directory non risolvibile (`$(…)`, `$VAR`, `cd -`,
   `~`). Resta un'analisi statica euristica: un guard-rail, non un confine di sicurezza (es. un nome di programma
   costruito con variabili, `G=git; $G push …`, resta invisibile al guard dei push: lo copre solo il ruleset di `main`).

`settings.json`: allow per validatori e report, ask su `.github/**` e sui file di hook/settings, deny sulla lettura di
`.env`, `.env.local`, `.env.*.local`, `.env.{production,development,test}` e sulla modifica dei file generati o di
stato. `.gitignore` esclude `.env` e `.env.*` (tranne `.env.example`): una chiave locale non finisce in un commit.
Secondo la documentazione (permissions, verificata 2026-11-18) i deny di `Read` valgono per i tool di file, per i
comandi Bash riconosciuti che nominano il file (`cat`, `head`, `tail`, `sed`, redirezioni) e best-effort per
Grep/Glob, e si applicano anche in cartelle non trusted e in `claude -p`; non coprono comandi che leggono senza
nominare il file (`grep -r pattern .`) né sottoprocessi arbitrari (es. uno script Node). Vale l'istruzione di `security.md`;
oggi nel repo non esiste alcun `.env`. **Sandbox nativo non attivato dal repo**: su Linux richiede `bubblewrap`/`socat`,
assenti nell'immagine Cloud, e senza di essi Claude Code esegue i comandi senza sandbox (con `failIfUnavailable` uscirebbe
all'avvio); l'isolamento di rete bloccherebbe npm e il proxy. Localmente il proprietario può attivarlo nelle impostazioni
utente (`sandbox.enabled`, `sandbox.filesystem.denyRead` per i `.env`); i thread *Projects* ignorano comunque
`settings.json`.
**Gli hook non sostituiscono il ruleset di `main`**
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

Metodo per confronti prima/dopo: stessi prompt in processi `claude -p` nuovi, stesso modello; confronta i token di
input totali (cache inclusa), non i dollari (dipendono dallo stato della cache) e annota il numero di turni. Il peso
della configurazione = token di un turno banale nel repo meno lo stesso turno in una cartella vuota.

**Riepilogo**: `node scripts/claude-usage-report.mjs [--outcomes esiti.json] <run.json|sessione.jsonl>…` (test:
`node --test scripts/claude-usage-report.test.mjs`). Per riga: modelli, effort, token input/output/cache, durata,
turni, tool call e deleghe (dai transcript, sub-agent inclusi), costo API stimato; totale, task risolti (`pass` in
`esiti.json`, assegnato a mano dopo aver verificato il risultato), token e costo **per task risolto**. Non stampa
prompt, risposte né input dei tool. I transcript ripetono lo stesso `usage` su ogni blocco di una risposta: lo script
deduplica per `requestId` (senza, i token risultano moltiplicati). Il costo è la stima API a listino: non è
l'addebito dell'abbonamento né il consumo dei limiti d'uso.

**Insidie verificate (2026-11-18, Cloud, Claude Code 2.1.327)**:
- `CLAUDE.md` è caricato solo nella cartella del repository: in una copia in scratchpad (anche dopo `git init`) non
  lo era. Per confrontare due versioni della configurazione si scambiano i file nel checkout
  (`git checkout <sha> -- CLAUDE.md .claude`, poi `git checkout HEAD -- CLAUDE.md .claude`), alternando le esecuzioni.
- `claude -p` in una cartella non *trusted* ignora `permissions.allow` di `settings.json` (i comandi di sola lettura
  girano comunque, gli altri no): passare gli stessi `--allowedTools` a entrambe le esecuzioni.
- La varianza di un singolo task dipende dalla strategia di ricerca del modello (es. una finestra `rg -A8` troppo
  corta → un tool call in più): servono ≥ 3 esecuzioni per lato e non si dichiarano differenze dentro la varianza.

**Set di benchmark** (stesso modello, ≥ 3 esecuzioni per versione, alternate; nessun push, nessuna produzione):

| # | Livello | Task | Esito `pass` se |
|---|---|---|---|
| 1 | T0 | "Which file registers the world whose slug is 'bleach', and what is its status? Answer only as path:line + status." | `src/data/worlds.ts`, riga dell'entry, `available` |
| 2 | T1 | rigiocare una piccola PR UI già mergiata sul suo commit base, in un worktree usa e getta | check della matrice verdi, diff equivalente a quello mergiato |
| 3 | T2 (analisi) | `/analyze-data-coverage bleach` | numeri identici a `npm run -s data:coverage -- bleach` |
| 4 | T2 (verifica) | `/audit-animapverse perf` | una sola build, chunk riportati = output di `vite build` |
| 5 | T2/T3 | rigiocare una PR multi-modulo già mergiata (es. #328) sul suo base, senza push | stessi check della PR verdi, nessuna regressione allo smoke |

**Misure registrate**:

| Misura (2026-11-18, Cloud 4 vCPU) | Prima (`main` 96c28a4) | Dopo (questo branch) | Differenza |
|---|---|---|---|
| `npm run build` | 91,6 s | invariato | — |
| fase browser di `npm run smoke` (dopo la build) | fallita in 1,6 s (Chromium non trovato) | 82 s, OK | smoke di nuovo utilizzabile in Cloud |
| sequenza "build poi smoke" sullo stesso albero (release gate, `optimize-map`, `optimize-performance`, agent frontend/map) | ≈ 265 s (2 build + browser) | ≈ 174 s (1 build + browser) | −1 build ≈ −92 s per occorrenza |
| turno banale ("OK", Sonnet, 3+3 run) | 43.615 token | 44.189 token | +574 token (+1,3 %) a sessione: costo del triage/escalation in `CLAUDE.md` |
| task 1 (T0, Sonnet, 3+3 run, tutti `pass`) | media 90.072 token · 2 turni · 1 tool call · 3,1 s | media 120.314 token · 2,7 turni · 1,7 tool call · 3,7 s | dentro la varianza: in 2 run "dopo" il primo `rg` non arrivava alla riga di `status` |

I task 2-5 non sono ancora stati misurati: nessuna baseline, nessun risparmio di token dichiarato. Il beneficio atteso
del triage (meno deleghe e build inutili, escalation senza tentativi ciechi) va verificato con loro.

**Delega `/analyze-data-coverage` (2026-11-18, `claude -p --model opus`, stessi `--allowedTools`, run alternati)**:
A = la sessione principale esegue gli stessi passi della skill (Skill e Agent disattivati); B = la skill attuale
(`context: fork` → `lightweight-research`, Haiku). Correttezza verificata sul testo contro l'output deterministico
(numeri chiave, range di capitoli, `NEXT ACTION`; per `frieren` nessun dataset e nessun numero inventato).

| Scenario | A: token · costo API stimato · durata | B: token · costo · durata | Corretti A / B |
|---|---|---|---|
| `bleach` (report piccolo, n=3) | 235.712 · $0,239 (±0,158) · 24,3 s | 12.169 · $0,001 · 7,9 s | 3/3 · 3/3 |
| `naruto` (report articolato, n=3) | 89.124 · $0,117 · 21,8 s | 14.611 · $0,002 · 8,4 s | 3/3 · 3/3 |
| `frieren` (nessun dataset, n=3) | 247.819 · $0,142 · 20,3 s | 15.248 · $0,001 · 5,2 s | 3/3 · 3/3 |
| tutti i mondi (n=2) | 486.326 · $0,358 · 52,8 s | 36.823 · $0,003 · 16,0 s | 2/2 · 2/2 |

Decisione: configurazione invariata (B è corretta quanto A, con costo e durata nettamente inferiori in tutti gli
scenari). Limite del metodo: con `claude -p "/skill"` la skill in fork gira senza alcun turno del modello principale
(`num_turns` 0, solo Haiku in `modelUsage`); in sessione interattiva si aggiunge il turno che riporta il risultato,
quindi il costo reale di B è un po' più alto di quello misurato.

## 9. Cloud e locale

| Superficie | CLAUDE.md | rules con `paths` | agent | skill | settings/hook |
|---|---|---|---|---|---|
| CLI / Desktop locale | sì | sì | sì | sì | sì (cartella trusted) |
| Cloud, repo singola | sì | sì (verificato) | sì (verificato) | sì (verificato) | sì (verificato) |
| Thread Cloud di *Projects* | sì | **no** | non documentato | **no** | **no** |

Nei thread *Projects* il core dice di leggere a mano rule e `SKILL.md`; le protezioni restano CI, CODEOWNERS e ruleset.
Nei processi `claude -p` (benchmark, automazioni) la cartella non è *trusted*: `permissions.allow` è ignorato, mentre
l'hook di `settings.json` gira (§4); `CLAUDE.md` si carica solo dentro il repository (§8).
Le modifiche ai file degli agent valgono dalla sessione successiva.

## 10. Troubleshooting

| Sintomo | Causa / rimedio |
|---|---|
| Una skill non compare in `/` | sessione avviata prima del commit → nuova sessione; nei thread *Projects* leggere il `SKILL.md` |
| Un agent usa un modello/effort diverso | variabili `CLAUDE_CODE_SUBAGENT_MODEL(_FORCE)`/`CLAUDE_CODE_EFFORT_LEVEL`, `availableModels` o override della delega; controllare i transcript |
| Un agent ignora un `tools:` appena cambiato | definizioni lette all'avvio della sessione |
| `[readonly-bash]` blocca un agent di analisi | voluto; se manca un comando di sola lettura legittimo, aggiungerlo in `readonly-bash.mjs` con un test |
| `[guard-bash]` blocca un push | push forzato o verso `main`: usare il branch di lavoro; "shell expansion" o "unresolved directory": scrivere remote e branch letteralmente (`git push -u origin claude/x`, non `"$(git branch --show-current)"`) |
| Edit rifiutato su un file generato | voluto (deny): usare lo script ufficiale |
| Una rule non si carica | il file non corrisponde ai `paths` (`claude:validate` segnala i glob morti) |

## 11. Aggiornare il sistema

- Nuovo vincolo d'area → nella rule (breve), la spiegazione in `ARCHITECTURE.md`; in `CLAUDE.md` solo invarianti
  trasversali.
- Nuovo agent o skill solo se una misura mostra un vantaggio (costo, isolamento del contesto, procedura specifica del
  progetto) rispetto a Claude Code e agli strumenti integrati; aggiungerlo qui, poi `npm run claude:validate`.
- Nuova area di codice → aggiornare i `paths` della rule competente.

## 12. Routing: triage, escalation e completamento

Il criterio è in `CLAUDE.md` (*Classify, then act*); qui il perché e la meccanica. Il rischio prevale sulla dimensione
del diff: una riga in un workflow è T3, cento righe di dati di un mondo sono T2.

| Livello | Chi lavora | Controlli |
|---|---|---|
| T0 diretto | sessione principale con `rg`/validatori; nessun sub-agent | solo il controllo deterministico pertinente, nessuna build |
| T1 circoscritto | sessione principale, o uno specialista se isolare il contesto conviene | mirati durante il lavoro, la riga della matrice prima della consegna |
| T2 articolato | skill + specialisti necessari, modifiche serializzate; agent `Plan` se il disegno non è ovvio | matrice completa, una build/smoke finale |
| T3 critico | sessione principale; `Plan` e `security-devops` in sola lettura; review indipendente `/code-review` / `/security-review` | gate completo; approvazione del proprietario per permessi, secret, ruleset, produzione |

**Trajectory routing**: nessun agent dedicato. Dopo l'esplorazione iniziale la sessione rivaluta il livello se il
raggio d'azione cresce (store condiviso, hydration SSR, route SEO, CI, stato social) e lo alza *prima* di modificare.

**Escalation (casi A-D di `CLAUDE.md`)**: un solo intervento per fallimento, sempre con un'informazione nuova.
- A, contesto mancante → leggere il file/la rule mancante e rieseguire il solo controllo fallito.
- B, errore implementativo circoscritto → una correzione mirata e lo stesso controllo.
- C, ragionamento errato con i fatti giusti → più effort o un modello più forte: nella sessione principale lo decide il
  proprietario (`/model`, effort); per uno specialista si rilancia la singola delega con l'override `model` (precedenza
  in §2) passando l'evidenza raccolta, senza ripetere la ricerca. Mai cambiare frontmatter o variabili globali per un task.
- D, stesso fallimento dopo una correzione, o area critica → stop: causa, evidenze, opzioni. Mai aggirare un hook, un
  deny o un controllo.

**Contratto di completamento**: il report finale della sessione usa `STATUS: PASS | FAIL | PARTIAL | BLOCKED`; gli
stati degli agent si traducono (`done`/`batch-done`/`found`/`ok`/`pass` → PASS solo se i controlli sono stati eseguiti;
`partial` → PARTIAL; `blocked` → BLOCKED; `fail` → FAIL). Seguono file, controlli eseguiti con esito reale, controlli
non eseguiti e perché, rischi residui, passi manuali. Nessun agent `verifier` né Stop hook: `qa-performance-engineer`,
`/code-review` e i validatori bastano, e uno Stop hook con la build costerebbe ~90 s a ogni risposta.

**Cascade dei controlli**: prima i più economici (validatori ~1 s, `claude:validate` ~1 s, `tsc -b`, `test:seo`
~8 s), stop al primo fallimento; i superset una volta per stato dell'albero (`smoke` ⊃ `build` ⊃ validatori,
`tsc -b`, `test:seo`, `i18n:audit`). Uno stato è "lo stesso" solo se `node scripts/state-fingerprint.mjs` stampa lo
stesso valore (contenuto di file tracciati e non tracciati, dipendenze installate, stat dei `.env*` senza aprirli,
Node, variabili di build; ~70 ms; test `node --test scripts/state-fingerprint.test.mjs`, non in CI per non legare le PR
social quotidiane a un test che usa git): l'elenco dei file non tracciati non basta (contenuto modificato con lo stesso
nome). Modifiche solo sotto `tools/social-engine/`: `social:validate` senza build (`social-safety.md`), come la Site CI.

**Del Model Routing Playbook non si applica**: router esterni o classificatori automatici del modello (il modello
della sessione è del proprietario, gli specialisti hanno il loro nel frontmatter); worker generici `quick`/`build`/
`deep` (duplicherebbero gli specialisti senza la loro conoscenza del dominio); modifica automatica degli effort (nessuna
misura riproducibile lo giustifica); escalation automatica tra modelli (la sessione non può cambiare il proprio modello;
la policy C la rende esplicita); nuovi agent, hook o skill.
