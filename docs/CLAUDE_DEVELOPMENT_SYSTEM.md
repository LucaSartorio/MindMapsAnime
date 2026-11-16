# AniMapVerse — Claude Code Development System

Guida operativa al sistema di sviluppo multi-agent versionato nella repository (`CLAUDE.md` + `.claude/`).
Serve a scrivere richieste brevi ("Aggiungi Fullmetal Alchemist", "Controlla il SEO") e lasciare che Claude Code
scelga file, skill, sub-agent, modello, verifiche e consegna.

> Stato delle verifiche: vedi §15. Ciò che non è stato osservato in esecuzione è indicato come *nominale*.

---

## 1. Architettura

```text
CLAUDE.md                 core sempre caricato (~13 KB): progetto, orchestrazione, mappa del contesto,
                          comandi, invarianti, matrice di validazione, regole git
.claude/
├── rules/*.md            dettagli architetturali, caricati SOLO quando si toccano i file corrispondenti (paths)
├── agents/*.md           9 sub-agent specializzati (modello + effort + strumenti propri)
├── skills/<n>/SKILL.md   12 procedure ripetibili, invocabili con /<nome> [argomenti]
├── hooks/guard-bash.mjs  blocca push forzati / su main / cancellazioni di branch (+ test)
└── settings.json         permessi least-privilege + hook (nessun modello forzato)
scripts/data-coverage.ts          report deterministico delle lacune dei dataset (npm run data:coverage)
scripts/validate-claude-config.mjs validatore della configurazione (npm run claude:validate)
docs/world-pipeline/              manifest di avanzamento + provenienza dei dati per mondo
```

Principio: **la sessione principale è l'orchestratore**. Classifica la richiesta, carica la skill giusta, delega
solo quando conviene, integra, valida e consegna. Le *rules* sono vincoli, le *skills* procedure, gli *script*
verificano ciò che non richiede ragionamento AI.

## 2. Sub-agent

| Agent | Modello | Effort | Strumenti | Responsabilità | Quando NON usarlo |
|---|---|---|---|---|---|
| `code-architect` | opus | high | Read, Grep, Glob, Bash (sola lettura) | piani incrementali per lavori complessi/critici, dipendenze, rischi | fix banali, modifiche a un file |
| `frontend-specialist` | sonnet | medium | tutti tranne Agent | UI, componenti, store, a11y, responsive, SSR-safety | internals della mappa, contenuti, SEO |
| `map-engineer` | sonnet | high | tutti tranne Agent | React Flow, pin/cluster, coordinate, mapgen, performance mappa | UI generica, lore |
| `anime-data-curator` | sonnet | high | tutti tranne Agent | ricerca, verifica, dataset, relazioni, provenienza | codice UI/SEO |
| `seo-growth-engineer` | sonnet | high | tutti tranne Agent | metadata, canonical, hreflang, sitemap, thin content, linking | inventare dati Search Console |
| `qa-performance-engineer` | sonnet | high | tutti tranne Agent | verifiche, regressioni, test proporzionati, misure | implementare feature |
| `social-engine-specialist` | sonnet | medium | tutti tranne Agent | codice del motore social, template, test | pubblicare, stato di produzione, piano editoriale |
| `security-devops` | sonnet | high | Read, Grep, Glob, Bash (sola lettura) | workflow, permessi, dipendenze, CODEOWNERS, settings | applicare ruleset/secret/permessi |
| `lightweight-research` | haiku | low | Read, Grep, Glob, Bash (sola lettura) | trovare file/simboli/id, riassunti brevi | decisioni, modifiche, verifica canonica |

Scelte progettuali:
- **Nessun agent può creare altri agent** (`Agent` escluso): un solo coordinatore, niente catene costose.
- `lightweight-research` esiste perché l'Explore integrato usa il **modello della sessione** (Opus se l'owner usa
  Opus): per semplici ricerche un agent Haiku/low costa molto meno. Per esplorazioni ampie l'Explore integrato resta
  disponibile.
- Ogni agent risponde con il contratto `STATUS / FILES / CHANGES / VALIDATION / RISKS / NEXT ACTION`.

## 3. Skills

| Comando | Funzione | Invocazione | Contesto |
|---|---|---|---|
| `/add-anime-world <mondo> [resume]` | crea un nuovo mondo in 12 batch riprendibili | auto + manuale | principale |
| `/enrich-anime-world <mondo> [focus]` | colma le lacune di un mondo esistente | auto + manuale | principale |
| `/analyze-data-coverage [mondo]` | report di completezza + prossima azione | auto + manuale | fork su `lightweight-research` |
| `/optimize-map <mondo\|all> [livello\|problema]` | collisioni, zoom, cluster, sotto-mappe, performance mappa | auto + manuale | principale |
| `/seo-opportunities [mondo] [export.csv]` | problemi verificati / opportunità / ipotesi SEO | auto + manuale | principale |
| `/audit-animapverse [area]` | audit tecnico (data, seo, i18n, a11y, perf, security, social, code) | auto + manuale | principale |
| `/fix-ticket <descrizione\|issue>` | bug fix o piccola feature end-to-end | auto + manuale | principale |
| `/optimize-performance [target]` | baseline → modifica → misura | auto + manuale | principale |
| `/sync-translations <mondo\|ui> [es\|fr]` | overlay es/fr, indice traduzioni, chiavi UI | auto + manuale | principale |
| `/social-engine-maintenance <task>` | sviluppo del motore social senza toccare la produzione | auto + manuale | principale |
| `/review-pr <numero\|branch> [focus]` | review indipendente | **solo manuale** | fork su `code-architect` |
| `/validate-release [quick]` | tutti i gate + smoke + a11y, GO/NO-GO | **solo manuale** | principale |

`review-pr` e `validate-release` sono manuali (`disable-model-invocation: true`): la prima produce giudizi da
condividere, la seconda dura molti minuti. Le altre si attivano anche da richieste in linguaggio naturale.
Nessuna skill usa `allowed-tools` per concedere comandi rischiosi (solo `analyze-data-coverage` pre-autorizza i due
report in sola lettura).

## 4. Project rules

| Rule | Si carica toccando | Contenuto |
|---|---|---|
| `frontend.md` | componenti, pagine, route, store, stili | filtri, tool rail/header, schede, Story/Relations, ricerca ⌘K, a11y, Zustand/SSR |
| `maps.md` | componenti mappa, lib mappa, `mapLevels/mapConstants/boundaries/locations*`, `scripts/mapgen` | React Flow, coordinate per mondo, marker, tornei, focus mode, pannelli |
| `graph.md` | `src/lib/graph`, relazioni, modali, ricerca | knowledge graph e layer relazioni |
| `entity-art.md` | `EntityImage`, arte, `appearance.ts`, `fruitLooks.ts` | segnaposto per mondo, ritratti |
| `data-integrity.md` | `src/data/**`, `src/types/**`, validatori | dataset, `WorldConfig`, battaglie/famiglie/strutture, convenzioni, nuovo mondo |
| `i18n.md` | `src/i18n`, overlay, localizzazione | sei lingue, `Localizable`, overlay es/fr |
| `seo.md` | `src/seo`, pagine SEO, `slugs.ts`, script SEO | URL, slug, metadata, index/noindex, checklist |
| `social-safety.md` | `tools/social-engine/**`, workflow social, contratti | motore social, State Bot, comandi social, divieti |
| `security.md` | `.github/**`, `package*.json`, `vercel.json`, settings/hook | Site CI, SEC-01, guardrail |
| `testing.md` | script di test, test social, test degli hook | come si scrivono e si riportano i test |

`development.md` e `token-efficiency.md` del piano iniziale sono stati **accorpati in `CLAUDE.md`** (sezioni
"How Claude works" e "Core invariants"): sarebbero state regole senza `paths`, quindi caricate comunque sempre;
tenerle nel core evita duplicazioni.

Tutto il testo del vecchio `CLAUDE.md` (78 KB) è stato **spostato parola per parola** nelle rules (verifica
automatica: ogni riga non vuota del file originale è presente nel nuovo core o in una rule, tranne il titolo
"## Architecture").

## 5. Modelli

- **Orchestratore**: modello ed effort scelti dall'owner (es. Opus High). `.claude/settings.json` non imposta
  `model`, `effortLevel` né variabili d'ambiente.
- **Sub-agent**: campo `model` nel frontmatter (`opus`, `sonnet`, `haiku` sono alias: puntano sempre all'ultima
  versione disponibile, nessuna versione bloccata).
- **Precedenza del modello di un sub-agent** (documentazione ufficiale): parametro `model` della singola
  invocazione → `model` nel frontmatter → `CLAUDE_CODE_SUBAGENT_MODEL` → modello del chiamante.
  `CLAUDE_CODE_SUBAGENT_MODEL` + `CLAUDE_CODE_SUBAGENT_MODEL_FORCE=1` sovrascrivono tutto: **non impostarle**,
  annullerebbero il routing. Anche `availableModels` / limiti dell'account possono restringere le scelte.
- Gli agent Explore/Plan integrati usano il modello della sessione.

## 6. Effort

- Campo `effort` nel frontmatter (`low | medium | high | xhigh | max`; i livelli disponibili dipendono dal modello —
  su modelli che non supportano un livello vale quello più vicino supportato).
- **Precedenza**: `CLAUDE_CODE_EFFORT_LEVEL` (env) → parametro `effort` della singola delega → frontmatter.
  Non impostare `CLAUDE_CODE_EFFORT_LEVEL` globalmente.
- Un agent con modello diverso dal principale ha sempre un effort esplicito (il validatore lo segnala se manca).
- **Override per delega** (routing dinamico): l'orchestratore può passare `effort` a una singola chiamata dell'agent
  quando il compito lo richiede — es. `anime-data-curator` a `medium` per un batch di sole traduzioni IT/EN,
  `map-engineer` a `xhigh` per un algoritmo di clustering. Regola: low = ricerca/estrazione; medium = fix ordinari;
  high = algoritmi mappa, dataset complessi, SEO, debugging, sicurezza; xhigh/max solo se giustificati.

## 7. Delegation policy

| Classe | Esempi | Comportamento |
|---|---|---|
| TRIVIAL | testo, label, condizione | nessuna delega, modifica diretta, verifica mirata |
| STANDARD | piccola feature, bug di un componente | al massimo uno specialista (o nessuno) |
| COMPLEX | feature multi-modulo, refactor, batch di contenuti | piano breve, analisi parallele in sola lettura, modifiche serializzate, gate completo |
| CRITICAL | sicurezza, CI, pipeline social, SEO globale, migrazioni dati | analisi profonda + review indipendente + gate completo + approvazione owner per operazioni sensibili |

- Minimo numero di agent; nessuna sovrapposizione; mai due agent che modificano gli stessi file insieme.
- Parallelizza solo analisi indipendenti, in un unico messaggio; serializza le modifiche. Worktree isolati
  (`isolation: worktree`) solo per lavori lunghi davvero indipendenti.
- Non delegare ciò che uno script fa meglio (`validate:data`, `data:coverage`, `i18n:status`, `rg`).
- Fallimenti: identificare la causa, riprendere lo stesso agent (SendMessage) invece di ricominciare, nessun loop di
  retry, mai trattare un risultato parziale come completo.

Esempio — "Correggi un problema di zoom della mappa": `map-engineer` (+ eventualmente `qa-performance-engineer` per la
verifica). Niente data curator, SEO o social.

## 8. Token optimization (interventi concreti)

1. **CLAUDE.md da 78 384 a ~13 000 caratteri** (−83 % di istruzioni caricate in ogni sessione e in ogni sub-agent;
   misura con `wc -c`). Il resto si carica solo quando serve, tramite rules con `paths`.
2. **Rules a grana fine**: toccare un componente mappa carica `frontend.md` + `maps.md` (~26 KB), non tutto il
   vecchio file; toccare un dataset carica `data-integrity.md` (~9 KB).
3. **Skills on demand**: nel contesto c'è solo la descrizione; il corpo si carica all'invocazione.
4. **Contesti isolati**: `analyze-data-coverage` gira in fork su Haiku e restituisce ~25 righe; `review-pr` in fork
   su `code-architect`; gli agent restituiscono il contratto sintetico, non file o log interi.
5. **Deterministic first**: `npm run data:coverage` (~2 s per tutti i mondi) sostituisce letture AI di dataset da
   migliaia di righe; il validatore della config sostituisce controlli manuali.
6. **Routing per costo**: Haiku/low per le ricerche, Sonnet per l'esecuzione, Opus solo per l'architettura.
7. **Nessun agent annidato** e nessuna doppia review automatica.
8. **Costo fisso della delega (misurato)**: ogni sub-agent parte caricando ~20 000 token di contesto (system prompt
   + CLAUDE.md). Una ricerca di una riga è costata $0.0015 su Haiku ma $0.096 su Sonnet: per lookup banali è più
   economico `rg` diretto; delegare conviene quando il lavoro produrrebbe molto contesto nella sessione principale.

Metriche: misurata solo la dimensione delle istruzioni sempre caricate (78 384 → ~13 000 caratteri). Il consumo
reale per task va confrontato con `/cost` / `/usage` (o la pagina di utilizzo dell'account) su task equivalenti
prima/dopo: nessuna percentuale di risparmio sui token è stata misurata in questa sessione.

## 9. Utilizzo quotidiano

Richieste in linguaggio naturale (la skill si attiva da sola) oppure comandi espliciti:

```text
/add-anime-world fullmetalalchemist
/add-anime-world frieren resume
/enrich-anime-world bleach events
/analyze-data-coverage jujutsukaisen
/optimize-map onepiece "pin sovrapposti a Wano"
/seo-opportunities naruto
/audit-animapverse security
/fix-ticket "il language switch perde il filtro attivo"
/optimize-performance bundle
/sync-translations dragonball fr
/social-engine-maintenance "aggiungi test per il segmentatore"
/review-pr 320
/validate-release
```

I mondi si indicano con lo slug interno (`fullmetalalchemist`) o con lo slug URL (`fullmetal-alchemist`).

## 10. Aggiungere un anime

`/add-anime-world <mondo>`:
1. risolve il mondo in `worlds.ts` (gli slug dei mondi `coming_soon` sono già fissati e non cambiano);
2. crea o riprende `docs/world-pipeline/<slug>.md` (template in `docs/world-pipeline/README.md`);
3. discovery: titoli, adattamenti, perimetro canonico (es. FMA 2003 ≠ Brotherhood), mappatura sul modello dati,
   piano delle fonti;
4. 12 batch (config/skeleton → mappa → personaggi principali → luoghi → archi → eventi → fazioni/relazioni →
   battaglie/tornei/marker → poteri → percorsi/ritratti → traduzioni → gate di pubblicazione), ognuno con verifica,
   aggiornamento del manifest e commit;
5. il mondo resta `coming_soon` finché l'owner non approva il passaggio ad `available`.

**Mondo in costruzione** = `status: 'coming_soon'` + loader in `src/data/registry.ts`. Resta privato ovunque (sito,
sitemap, catalogo social filtrano su `available`), ma `validate:data` (integrità), `validate:i18n` (IT/EN) e
`coverage:chapters` lo controllano già: ogni batch può andare su `main` senza rompere la build e senza pubblicare
nulla. Gli slug SEO si congelano alla pubblicazione (`npm run seo:slugs`, batch 12). Questo comportamento è stato
aggiunto durante il collaudo: prima i validatori ignoravano ogni mondo non pubblicato, quindi i controlli per batch
non avrebbero verificato nulla.

Dipendenze esterne: la ricerca richiede accesso web (WebSearch/WebFetch o l'agent `web-fetch` nelle sessioni Cloud);
senza accesso la skill si ferma al piano delle fonti e lo dichiara. Le mappe sono SVG originali generati da
`scripts/mapgen/<slug>.py`: nessuna immagine ufficiale.

## 11. Enrichment dei dati

`/enrich-anime-world <mondo> [focus]`: misura con `npm run data:coverage -- <mondo> --json`, `validate:data`,
`coverage:chapters`; priorità = importanza narrativa > relazioni mancanti utili alla mappa > pagine sotto soglia
recuperabili con contenuto reale > buchi di capitoli > `needs_verification`; batch di 10-30 entità con verifica e
commit; report prima → dopo dei contatori. Non conta il numero di entità aggiunte ma la qualità.

`npm run data:coverage` elenca per mondo: conteggi; pagine SEO indicizzabili/totali per categoria; pagine sotto
soglia; entità orfane nel grafo; personaggi senza luoghi/eventi; principali senza `longDescription` o ritratto
dettagliato; luoghi senza eventi/personaggi/archi; eventi senza luogo/arco/capitoli; archi senza eventi; fazioni
senza membri; entità `needs_verification`. Opzioni: `-- <mondo>`, `--json`, `--limit N`.

## 12. SEO audit

`/seo-opportunities [mondo] [export.csv]`: usa solo fatti verificabili (test, `seo:check`, `data:coverage`,
`i18n:status`, HTML in `dist/`); classifica ogni punto come *verified issue*, *opportunity* o *hypothesis*; usa dati
Search Console solo se forniti dall'owner. Non abbassa soglie e non genera pagine sottili.

## 13. Performance audit

`/optimize-performance [target]`: baseline → causa → una modifica alla volta → nuova misura con lo stesso comando;
distingue dati di laboratorio da dati reali (LCP/INP/CLS reali: Vercel Speed Insights). Non usa mai
`npm run optimize:images` (distruttivo).

## 14. GitHub workflow

- Branch di lavoro dedicato; mai push su `main`, mai force push, mai merge o approvazioni automatiche (l'hook
  `guard-bash.mjs` blocca push forzati, su `main`/`master`, `--mirror`, `--delete`).
- PR solo su richiesta dell'owner; Site CI esegue `npm run build` su ogni PR che tocca `.claude/` o `CLAUDE.md`.
- `.claude/` è sotto CODEOWNERS (`@LucaSartorio`) come `CLAUDE.md`: sono istruzioni per agenti.
- Le automazioni social (State Bot, PR giornaliere) non vanno mai toccate: vedi `social-safety.md`.

### Permessi in `.claude/settings.json`
- **allow** (senza prompt): validatori e report in sola lettura, `npm run build`/`smoke`, `git status/diff/log/show`, `rg`.
- **ask**: modifiche a `.github/**`, `.claude/settings.json`, `.claude/hooks/**`.
- **deny**: lettura di `.env`/`.env.local`; modifica dei file generati o di stato (`slugs.ts`, `translationIndex.ts`,
  `*.meta.json` degli overlay, `history/`, `catalog/`, `publication/applied|failed/`, `analytics/metrics.json` del
  motore social). Gli script ufficiali (`npm run seo:slugs`, `i18n:index`, pipeline social) restano l'unico modo
  di aggiornarli. Per un'eccezione consapevole l'owner può usare `.claude/settings.local.json` (non versionato).

## 15. Validazione

`npm run claude:validate` = `scripts/validate-claude-config.mjs` + test dell'hook. Controlla: campi YAML noti,
nomi = file/cartelle, modelli/effort/colori validi, strumenti noti, descrizioni, uso degli argomenti, glob delle
rules che corrispondono a file reali (rileva percorsi obsoleti), settings senza override di modello/bypass/allow
generici, script degli hook esistenti, ogni `npm run <script>` citato esistente in `package.json`, ogni file
citato esistente, ogni agent/skill/rule elencato in `CLAUDE.md` e in questa guida, budget delle istruzioni sempre
caricate.

Verificato in esecuzione durante il bootstrap (Cloud, Claude Code 2.1.325, 2026-11-16):
- rules con `paths` caricate automaticamente alla lettura/modifica di un file corrispondente (`data-integrity.md`,
  `security.md`, `seo.md`, `testing.md` osservate);
- skill registrate nella sessione appena create (le 10 auto-invocabili compaiono nell'elenco del modello;
  `review-pr` e `validate-release` no, come previsto da `disable-model-invocation`);
- hook `guard-bash` attivo anche a metà sessione: un push di prova (`--dry-run`) verso `main` è stato bloccato;
  un falso positivo (testo di documentazione dentro un heredoc) è stato corretto e coperto dai test (29 casi);
- regola `deny` attiva: modifica di `src/data/naruto/slugs.ts` rifiutata prima dell'esecuzione;
- **routing dei modelli** (processo `claude -p` nuovo, uso per modello dal campo `modelUsage`):
  orchestratore `claude-opus-5-5` → `lightweight-research` eseguito su `claude-haiku-5-5` (risposta corretta,
  $0.0015); → `seo-growth-engineer` eseguito su `claude-sonnet-5-5` (risposta corretta, $0.096);
- **skill in fork**: `/analyze-data-coverage jujutsukaisen` riconosciuta, argomento passato, eseguita in fork su
  `claude-haiku-5-5` ($0.0017), i due comandi pre-autorizzati da `allowed-tools` eseguiti senza dinieghi;
- `npm run data:coverage`, `npm run claude:validate`, `npm run build` (vedi report della PR).

Nominale (configurato, non osservato): l'effort effettivo dei sub-agent (non esposto nell'output), gli agent `opus`
(`code-architect`, stesso modello dell'orchestratore usato nei test) e le skill non provate singolarmente. Gli agent
creati a metà sessione non entrano nel registro della sessione corrente (cartella `.claude/agents/` nuova): in una
sessione nuova `/agents` li elenca e `/tasks` mostra il modello di ogni sub-agent (v2.1.242+).
Nota: in modalità `-p` su un workspace non ancora "trusted" le regole `allow` di settings.json vengono ignorate
(deny/ask e hook restano attivi).

## 16. Troubleshooting

| Sintomo | Causa / rimedio |
|---|---|
| Una skill non compare in `/` | sessione avviata prima del commit della skill → nuova sessione; nei thread Cloud di *Projects* le skill di repo non sono disponibili: chiedi "leggi `.claude/skills/<n>/SKILL.md` e seguilo" |
| Un agent usa il modello sbagliato | `CLAUDE_CODE_SUBAGENT_MODEL(_FORCE)` impostata, `availableModels` dell'account, o override per invocazione; controlla `/tasks` |
| Effort ignorato | `CLAUDE_CODE_EFFORT_LEVEL` impostata (vince su tutto) o livello non supportato dal modello |
| Una rule non si carica | il file toccato non corrisponde ai `paths` (`npm run claude:validate` segnala glob morti); nei thread Projects le rules con `paths` non si caricano: il core dice di leggerle a mano |
| Edit rifiutato su un file generato | è voluto (deny): usa lo script ufficiale |
| Push rifiutato dall'hook | push forzato o su `main`: usa il branch di lavoro |
| `npm run lint` | non configurato nel repo (nessun eslint): non è un controllo |

## 17. Differenze Cloud / locale

| Superficie | CLAUDE.md | rules senza paths | rules con paths | agents | skills | settings/hook |
|---|---|---|---|---|---|---|
| CLI / Desktop locale | sì | sì | sì | sì | sì | sì |
| Cloud (Desktop/web), repo singola | sì | sì | sì (verificato) | sì | sì | sì (verificato) |
| Cloud multi-repo | non documentato | non documentato | non documentato | non documentato | non documentato | solo plugin: permessi/hook **no** |
| Thread Cloud di Claude Code **Projects** | sì | sì | **no** | non documentato | **no** | **no** |

Fallback per i thread Projects (già nel core): la mappa del contesto dice di leggere la rule prima di modificare
un'area, e l'indice delle skill dice di leggere ed eseguire il `SKILL.md`. Le protezioni di `settings.json` (deny,
hook) lì non valgono: restano le istruzioni, CODEOWNERS e la CI. Le configurazioni personali
(`~/.claude/`, `.claude/settings.local.json`) non arrivano mai nelle sessioni Cloud.

ECC (Enhanced Claude Code): non presente né nel repository né nell'ambiente; il sistema non dipende da plugin esterni.

## 18. Aggiornare il sistema

- Nuova area di codice → aggiorna i `paths` della rule competente (il validatore segnala i glob morti, non quelli mancanti).
- Nuova regola architetturale → nella rule dell'area, non nel core; nel core solo se è un'invariante trasversale.
- Nuovo agent/skill → file + riga in `CLAUDE.md` + riga in questa guida → `npm run claude:validate`.
- Nuovi campi ufficiali di Claude Code → aggiorna gli insiemi `AGENT_FIELDS`/`SKILL_FIELDS` nel validatore dopo
  averli verificati sulla documentazione (code.claude.com/docs/en/sub-agents, /skills, /memory, /settings).
- Mantieni il core sotto ~20 000 caratteri (il validatore avvisa oltre).
