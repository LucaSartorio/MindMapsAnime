# SEC-01 — Protezione di `main` e identità delle automazioni

Stato: **preparazione** (sprint 10, 2026-11-08). Questo documento e `.github/CODEOWNERS` sono le uniche modifiche:
**nessuna impostazione GitHub è stata cambiata** (ruleset, branch protection, token, collaboratori, Actions, release).
Le configurazioni descritte qui restano proposte finché il proprietario non le applica.

Legenda delle fonti:
- 🟢 **evidenza GitHub reale** (API in sola lettura, cronologia, check run);
- 🔵 **verifica statica** (lettura di workflow e script);
- 🟣 **simulazione locale** (repository di prova con regole equivalenti);
- ⚪ **non verificato**: impostazione non leggibile da qui o comportamento GitHub non provato. Va controllato a mano.

---

## 1. Stato attuale

| # | Controllo | Risultato | Fonte |
|---|---|---|---|
| 1 | Branch protection classica su `main` | **Assente** (`protected: false`, come su tutti gli altri 100+ branch) | 🟢 API branches |
| 2 | Ruleset | **Nessuna regola attiva su `main`**: `GET /repos/…/rules/branches/main` restituisce `[]` e `GET /repos/…/rulesets` restituisce `[]`. Un ruleset *disabilitato* non comparirebbe | 🟢 API in lettura (review indipendente) |
| 3 | Required status checks | Nessuno; la Site CI gira ma non è obbligatoria | 🟢 righe 1–2 + check run #292–#298 |
| 4 | `CODEOWNERS` | Assente prima di questa PR (né root, né `.github/`, né `docs/`) | 🟢 repository |
| 5 | Collaboratori | `LucaSartorio` proprietario/admin; `DanieleMasone` collaboratore (repository personale: un solo livello di accesso, in scrittura), **0 commit** nella storia | 🟢 API collaborators + commits |
| 6 | Visibilità | Repository **pubblico**: ruleset disponibili senza piano a pagamento; chiunque può aprire PR da fork | 🟢 API repos |
| 7 | Identità delle PR | **Tutte** le PR recenti (#259–#298: sito, coda social, receipt) sono **create e mergiate come `LucaSartorio`**; i commit delle receipt (#293) hanno autore `Luca Sartorio` | 🟢 API pulls/commits |
| 8 | Identità di Claude Code | I commit di Claude hanno nei metadati git autore/committer `Claude <noreply@anthropic.com>`. Questi dati non provano chi ha eseguito il push. Le PR risultano aperte come `LucaSartorio` | 🟢 API pulls · ⚪ identità del push |
| 9 | Commit diretti del bot | `github-actions[bot]` spinge su `main` 2 volte al giorno (≈06:07 render, ≈06:16 publication state) con `GITHUB_TOKEN` | 🟢 commit `6190293`, `2fdcad0` · 🔵 workflow |
| 10 | Workflow "ops" temporanei | **Killua** (06/10): workflow `ada5670` su branch, **PR #200 aperta 06:56:14 e mergiata 06:56:29**, quindi 15 s, senza attendere alcun check. **Orihime** (08/10): `44fee74`, `237f20f`, `7e99ade` scritti **direttamente su `main`** via API/web. Entrambi con `contents: write`, poi rimossi. Tutto è avvenuto nella finestra oraria degli agenti: **probabile** che le loro credenziali possano scrivere workflow | 🟢 PR #200, commit · ⚪ scope del token |
| 11 | Release pubbliche | **Esiste ancora** la release `temp-killua-20261006` (pubblicata da `github-actions[bot]` il 2026-10-06), creata dal workflow temporaneo con l'MP4 renderizzato come asset pubblico | 🟢 API releases |
| 12 | Ritmo degli agenti | PR coda ≈06:00, check verdi in ≈40 s, merge ≈4 min dopo; PR receipt ≈06:10, merge ≈5 min dopo. Le PR social quotidiane attendono i check; la PR ops #200 no | 🟢 #292, #293, #200 |
| 13 | Permessi dei workflow | Tutti dichiarano `permissions: contents: read` a livello di workflow; solo i job `render` e `apply` chiedono `contents: write`. Nessun secret oltre `GITHUB_TOKEN` | 🔵 |
| 14 | Impostazioni Actions del repository (permessi di default del token, PR create da Actions, approvazione dei workflow da fork) | Non leggibili (l'API è bloccata dal proxy di questo ambiente) | ⚪ |
| 15 | Origine e scope del token degli agenti (ChatGPT Work + Metricool) | Non leggibili: le azioni risultano tutte come `LucaSartorio` | ⚪ |

## 2. Rischi confermati

1. **`main` modificabile senza review da chiunque abbia le credenziali del proprietario**, comprese quelle date agli
   agenti. Un agente compromesso, o un prompt injection nei dati che legge, può cambiare codice, dipendenze e workflow
   in produzione: Vercel distribuisce `main`. Evidenza: punti 7 e 10.
2. **Identità condivisa.** Agenti ChatGPT, PR di Claude e proprietario compaiono come la stessa identità
   (`LucaSartorio`), quindi:
   - non si distingue chi ha fatto cosa;
   - qualunque esenzione concessa al proprietario (bypass admin) vale anche per agenti e Claude;
   - una review obbligatoria è impossibile da soddisfare, perché l'autore non può approvare la propria PR.
3. **Workflow temporanei con scrittura e pubblicazione di media.**
   - Per pubblicare due video è stato creato un workflow con `contents: write` che ha pubblicato l'MP4 come
     **release GitHub pubblica**; la release Killua è ancora online (punto 11).
   - È il segno che l'agente di pubblicazione ha avuto bisogno, almeno una volta, di un URL pubblico del media.
   - Se si tolgono alle credenziali degli agenti i permessi sui workflow, o si attiva il Livello B, quella scorciatoia
     sparisce. Il flusso normale (artifact + Metricool, receipt #282–#293 di novembre) non ne ha bisogno.
   - Se ricapitasse, va risolto senza workflow ad hoc.
4. **Workflow con permesso di scrittura modificabili via PR "solo social".**
   - Una PR che cambia solo `social-render.yml` o `tools/social-engine/ci/commit-state.sh` è classificata
     "social-only", quindi la build del sito viene saltata (🟣 simulato).
   - Social validate gira, ma controlla la coda, non la sicurezza. Nessuna review obbligatoria protegge questi file.
5. **Codice eseguito nei job con `contents: write`.** Il token è passato solo allo step "Persist", ma:
   - gli step precedenti (`npm ci`, Remotion, il social engine che importa `src/`) girano sullo stesso runner e
     possono alterare git, `node_modules` o lo script;
   - nello step Persist, `commit-state.sh` esegue codice del repository con il token nell'ambiente (`npm run
     social:catalog` e il merge driver `tsx` nel percorso di rebase) e passa il token nell'URL del `git push`.

   `GITHUB_TOKEN` non può toccare `.github/workflows/`, ma può spingere qualunque altro file su `main`.
6. **Escalation via workflow di PR.**
   - Su `pull_request` da branch dello **stesso** repository, un workflow modificato dalla PR può chiedere
     `contents: write`: chi può pubblicare un branch ottiene un token in scrittura.
   - Oggi non aggiunge poteri, perché ha già accesso in scrittura. Diventa un **aggiramento** se "GitHub Actions"
     venisse messo in bypass di un ruleset (§7, Opzione 1).
   - Le PR da fork ricevono un token in sola lettura e nessun secret.
7. **Action non fissate a uno SHA.** I workflow social con scrittura usano `actions/*@v4`, cioè tag mobili; la Site CI
   invece li fissa a uno SHA.
8. **Collaboratore inattivo con accesso in scrittura.** `DanieleMasone` può spingere direttamente su `main`: è
   superficie d'attacco senza uso.
9. **Nessun loop oggi.** I push con `GITHUB_TOKEN` non avviano workflow; ci sono inoltre `[skip ci]`, `[skip social-*]`
   e il controllo sull'attore. Questo cambia se i commit di stato passano a un'altra identità (§7).

## 3. Matrice degli attori

| Attore | Permessi necessari | Permessi attuali verificabili | Azioni consentite | Da limitare | Scrive su `main`? | Identità dedicata proposta | Rischio se compromesso |
|---|---|---|---|---|---|---|---|
| **Proprietario** (`LucaSartorio`) | Admin | Admin 🟢 | Tutto: impostazioni, merge, review | Push diretti su `main`; uso della propria identità da parte di agenti e Claude | Solo via PR (dopo il Livello B) | — (unico admin) | Totale |
| **Collaboratori** (`DanieleMasone`) | Nessuno oggi (0 commit) | Collaboratore = scrittura 🟢 (repo personale: livello unico) | Push di branch, PR | Accesso non necessario → **rimozione** (resta la lettura pubblica) | No | — | Codice e workflow su `main` (oggi senza review) |
| **Claude Code Cloud** | Leggere il repo, pushare branch di lavoro, aprire PR | PR come `LucaSartorio` 🟢; identità del push e permessi dell'integrazione ⚪ | Branch + PR. Il "mai merge" è un'istruzione, **non un controllo** | Merge, push su `main`, impostazioni | No | Identità **non admin** per le PR (prerequisito della code-owner review, §9 passo 8) | Con l'identità del proprietario: quella del proprietario. Con regole B e identità separata: PR soggette a check |
| **Social Publishing Agent** (ChatGPT Work + Metricool, giornaliero) | Contents R/W + Pull requests R/W solo per aggiungere `content/queue/*.json`, `publication/pending/*.json`, `analytics/pending/*.json` e mergiare dopo i check; Actions read (attende i run) | Agisce come `LucaSartorio` 🟢; scope del token ⚪ (probabile `workflow`, punto 10) | Branch, PR, merge dopo check verdi | Workflow, Administration, push diretti su `main`, file fuori dalle 3 cartelle, release | No, solo via PR | **Account macchina** dedicato (collaboratore, quindi scrittura), oppure GitHub App se il connettore lo consente ⚪ | Oggi pari al proprietario; con identità dedicata: PR soggette alle regole |
| **Social Growth Engine** | Nessun accesso GitHub proprio (codice nei workflow e in locale) | — | Calcola `next.json`, scritto nei commit di stato | — | Indirettamente | — | Pari al job che lo esegue (`contents: write`) |
| **GitHub Actions bot** (`GITHUB_TOKEN`) | `contents: write` solo nei job `render`/`apply`, per `history/`, `content/`, `catalog/`, `publication/`, `analytics/` | Come dichiarato 🔵; default del repository ⚪ | Commit di stato su `main` con `[skip ci]` | Tutto il resto; creare release (oggi possibile a qualunque workflow con `contents: write`) | **Sì, oggi** (2×/giorno) | **GitHub App "state bot"** (§7, Opzione 3) | Push arbitrario su `main` (non sui workflow), tag e release |
| **Vercel** (`vercel[bot]`) | Leggere il codice, commenti e stati di deploy | App installata 🟢 (commenti e check su ogni PR); permessi ⚪ | Preview per PR, produzione da `main` | Nessuna scrittura sul codice | No | — (già app separata) | Deploy di codice non approvato solo se `main` è compromesso |
| **Utenti esterni** (PR da fork) | Nessuno | Nessuno (repo pubblico) | Aprire PR; workflow con token read-only, senza secret | Approvazione manuale dei workflow per i nuovi contributori ⚪ | No | — | Basso |

## 4. Compatibilità delle regole con le automazioni

Effetto di ogni regola, applicata a `main` **senza bypass**:

| Flusso | Block force pushes | Restrict deletions | Require a pull request (0 approvazioni) | Require status check `Site CI` | Approvazioni richieste ≥ 1 | Require review from Code Owners (0 approvazioni) ⚪ |
|---|---|---|---|---|---|---|
| Commit di stato del render (bot, push diretto) | ✅ push fast-forward dopo rebase locale 🟣 | ✅ | ❌ **rifiutato** 🟣: stato non registrato, video re-renderizzati al giro dopo, pubblicazioni ferme | ❌ rifiutato (il commit non ha check) | — | — |
| Commit di stato publication/receipt | ✅ 🟣 | ✅ | ❌ **rifiutato** (stesso script) | ❌ | — | — |
| Commit del catalogo (stesso commit dei due sopra) | ✅ | ✅ | ❌ | ❌ | — | — |
| PR coda/receipt/analytics degli agenti | ✅ | ✅ | ✅ (già PR) | ✅ `Site CI` verde in ~15 s 🟢; merge dopo ~4–5 min 🟢 | ❌ **bloccate**: l'approvazione vale per ogni PR, nessuno la darebbe | ✅ file esclusi dal CODEOWNERS 🟣 (da collaudare su una PR reale) |
| PR applicative Claude / del proprietario | ✅ | ✅ | ✅ | ✅ `Site CI` 2–3 min 🟢 | ❌ autore = `LucaSartorio`, non può approvare | ❌ se tocca percorsi con owner, finché l'autore è il proprietario |
| PR "ops" mergiata subito (tipo #200) | ✅ | ✅ | ✅ | ❌ **rifiutata** finché il check non è verde (effetto voluto) | — | ❌ (`.github/` ha owner) |
| Commit con `[skip ci]` in una **PR** | ✅ | ✅ | ✅ | ❌ **bloccata**: nessun workflow parte e il check resta "Expected" (GitHub salta i workflow su push e pull_request) | — | — |

Conclusioni:
- Solo **Block force pushes** e **Restrict deletions** sono applicabili oggi senza interrompere nulla.
- "Require a pull request" e "Require status checks" bloccano i commit di stato, finché questi non passano da
  un'identità in **bypass esplicito** (§7).
- Le **approvazioni obbligatorie** non vanno mai attivate: fermerebbero le PR quotidiane degli agenti.

Check da **non** rendere obbligatori:
- `Validate social queue` / `Validate publication receipts`: partono solo con certi path e resterebbero "Expected"
  sulle PR del sito;
- `Validate & build site`: è "skipped" sulle PR social;
- `Vercel`: è esterno.

L'unico check obbligatorio adatto è **`Site CI`**, che conclude sempre.

## 5. Livello A — protezione immediata, basso rischio (consigliata ora)

Ruleset **solo su `main`** con **Restrict deletions** e **Block force pushes**: enforcement Active, nessun bypass.
- 🟣 Simulato con `receive.denyNonFastForwards` + `receive.denyDeletes`: `commit-state.sh` spinge normalmente, anche
  quando render e publication state si sovrappongono (rebase locale, poi push fast-forward).
- Nessun flusso usa push forzati o cancella `main`; i merge delle PR non sono force push.
- Non protegge tag e release (vedi punto 11); per quelli serve un *tag ruleset*, valutabile a parte.
- Istruzioni nella **guida, §9 passo 1**.

## 6. Livello B — controlli obbligatori sulle PR (solo dopo §7 Opzione 3)

Ruleset `main-pr` (target `main`):

| Opzione | Valore | Motivo |
|---|---|---|
| Require a pull request before merging | ✔, **Required approvals: 0** | Un'approvazione richiesta varrebbe anche per le PR degli agenti, che nessuno approva |
| Require review from Code Owners | ✗ ora; passo 8 della guida, sempre con **0 approvazioni** ⚪ | Il comportamento con 0 approvazioni va collaudato su una PR degli agenti e su una PR con percorsi owned |
| Require approval of the most recent reviewable push | ✗ ⚪ | Potrebbe chiedere un'approvazione su ogni PR, comprese quelle degli agenti |
| Require status checks to pass | ✔ **`Site CI`**, sorgente **GitHub Actions** | Conclude sempre (vedi nota sotto) |
| Require branches to be up to date | ✗ | Con le PR quotidiane e i commit del bot costringerebbe a rebase continui |
| Bypass list | **Solo** la GitHub App "state bot" (§7 Opzione 3), modalità *Always*. **Nessun bypass per il ruolo admin** | Con l'identità condivisa un bypass admin varrebbe anche per agenti e Claude. In emergenza: *Enforcement → Disabled* |
| Block force pushes / Restrict deletions | Già nel Livello A | Le regole dei ruleset si sommano |

**Cosa garantisce davvero `Site CI` obbligatorio.**
- Fissare la sorgente "GitHub Actions" scarta uno stato "Site CI" pubblicato da un'altra app o da un token (API
  Statuses/Checks).
- **Non** scarta un workflow modificato dalla PR stessa: `pull_request` esegue la copia della PR, e un job chiamato
  `Site CI` con `exit 0` basterebbe.
- È quindi una protezione dagli **errori** (e da merge prematuri come #200), non da chi ha accesso in scrittura e vuole
  aggirarla. La difesa da quel caso è la code-owner review su `/.github/` (passo 8).

**Prerequisiti** (se ne manca uno, B interrompe le pubblicazioni):
1. I commit di stato usano l'identità in bypass (§7 Opzione 3).
2. Gli agenti non usano `[skip ci]` nei commit delle PR (oggi non lo fanno 🟢).
3. Gli agenti mergiano solo dopo i check (oggi lo fanno 🟢). Con il ruleset attivo un merge prematuro viene rifiutato.

**Collaudo.** Non esiste un branch di prova possibile: l'environment del bot accetta solo `main`, e i workflow girano
in `dry` (senza push) fuori da `main`. La verifica è quindi **il primo run reale su `main`**:
- attiva `main-pr` poco prima del ciclo delle ~06:00 UTC, oppure lancia un run manuale;
- osservalo, con il rollback pronto (Disabled).

**Evaluate mode.** "Evaluate" (registra senza bloccare) è disponibile solo sui piani Enterprise ⚪: su questo
repository personale di norma non compare. Se compare, usalo per una settimana prima di Active e controlla
*Rules → Insights*.

## 7. Identità separate (Livello C) — confronto e raccomandazione

| | Opzione 1. `GITHUB_TOKEN` + bypass "GitHub Actions" | Opzione 2. Commit di stato via PR automatiche | **Opzione 3. GitHub App dedicata ai commit di stato** |
|---|---|---|---|
| Supportato | ⚪ Va verificato nel menu "Add bypass": non assumere che `github-actions[bot]` sia selezionabile | Sì | Sì: le GitHub App installate sono attori di bypass dei ruleset |
| Sicurezza | **Bassa.** Il bypass vale per **ogni** workflow, anche quelli di PR da branch interni (§2.6): chi ha accesso in scrittura aggira la protezione | Media: serve comunque un'identità capace di avviare e mergiare PR | **Media-alta, a condizioni**: chiave in un environment limitato a `main`, token esposto solo al `git push` (prerequisiti sotto). Resta pari alla review su `tools/social-engine/` + `package*.json` e al rischio di supply chain delle dipendenze |
| Complessità | Bassa | **Alta**: 2 PR in più al giorno. I conflitti su `history.json` non si risolvono lato GitHub (che ignora i merge driver). Le PR create con `GITHUB_TOKEN` non avviano la Site CI, che resta "Expected" | Media: un'app, un environment, uno step di token, un piccolo refactoring dello script |
| Compatibilità con le automazioni | Totale, se supportato | Cambia contratto e tempi | Totale: stesso flusso, cambia solo chi spinge |
| Impatto sulle pubblicazioni quotidiane | Nessuno | Ritardi e nuovi punti di blocco | Nessuno, dopo il collaudo |
| Rischio di workflow ricorsivi | Nessuno | Alto | **Da gestire**: i push con il token dell'app **avviano** workflow. Restano `[skip ci]` (GitHub lo rispetta per i push) e `[skip social-*]`; il controllo `github.actor != 'github-actions[bot]'` va esteso all'attore dell'app |
| Manutenzione | Nessuna | Alta | Bassa (rotazione della chiave) |
| Rollback | Rimuovere il bypass | Lungo | Prima *Disabled* su `main-pr`, poi revert della PR ai workflow |

Alternative scartate:
- **Deploy key in bypass**: bypass per l'intera categoria "deploy keys", senza scadenza. Una deploy key in scrittura
  può spingere anche `.github/workflows/`.
- **Bypass del ruolo admin**: con l'identità condivisa vale anche per agenti e Claude (§2.2).

**Raccomandazione: Opzione 3 + identità dedicata per gli agenti.**

1. **GitHub App "AniMapVerse State Bot"** (privata, installata solo su questo repository):
   - permessi Contents R/W e Metadata R; niente Workflows, Administration o Pull requests; nessun webhook;
   - limite noto: con Contents R/W l'app può anche creare tag e release e spingere altri branch; i ruleset di branch
     non coprono tag e release;
   - **environment `social-state`**:
     - *Deployment branches* → **Selected branches** → esattamente `main`;
     - creato **prima** di unire la PR ai workflow: un job che cita un environment inesistente lo crea senza regole;
     - secret: la chiave privata; l'App ID può essere una *variable*.
   - Solo `social-render.yml` e `social-publication-state.yml` possono citare `social-state`, e mai da trigger che
     eseguono input non fidato con ref `main` (`pull_request_target`, `workflow_run`, `issue_comment`).
   - app nella bypass list di `main-pr`, modalità *Always*.
2. **Prerequisiti sul workflow** (PR dedicata con collaudo; non in questa PR):
   - token generato con `actions/create-github-app-token`, fissato a uno SHA, `permission-contents: write`, revocato
     a fine job;
   - token generato **subito prima del push** e mai nell'ambiente del rebase o della rigenerazione del catalogo (il
     repo è pubblico: fetch e rebase possono avvenire senza credenziali); niente token nell'URL visibile nei processi;
   - commit di stato in un **job separato**, che riceve solo i file di stato (artifact) da un checkout pulito, così il
     codice del render non tocca lo script che ha il token;
   - `actions/*` fissati a SHA nei workflow con scrittura;
   - loop guard estesi all'attore dell'app.
3. **Agenti ChatGPT Work/Metricool con un account macchina** (es. `animapverse-agent`):
   - collaboratore, quindi scrittura: nei repository personali il livello è unico;
   - credenziali del connettore emesse da quell'account; se il connettore accetta una GitHub App, preferirla con
     Contents/Pull requests R/W e **Workflows: No access** ⚪;
   - le loro PR non sono più del proprietario: le regole B valgono per loro e il proprietario può approvare.
4. **PR di Claude** da un'identità non admin, se la code-owner review deve valere anche per loro (passo 8).

Nota: spostare il repository in un'**organizzazione** (gratuita) sbloccherebbe ruoli (Read/Triage/Write/Maintain),
team e attori di bypass più fini. Decisione del proprietario; non è necessaria per i livelli A e B.

**Ordine di migrazione** (nessun passo è eseguito in questa PR):
1. Livello A.
2. Impostazioni Actions, collaboratore, release temporanea (§9 passi 2–4).
3. App state bot + environment + PR ai workflow con i prerequisiti del punto 2, collaudata su `main`.
4. Account macchina per gli agenti.
5. Livello B con 0 approvazioni + `Site CI`, senza bypass admin.
6. Code-owner review (0 approvazioni, collaudata) dopo l'identità non admin per le PR di Claude, oppure un'eccezione
   consapevole (passo 8).

## 8. CODEOWNERS

`.github/CODEOWNERS` assegna a `@LucaSartorio` (unico admin 🟢):
- `.github/`;
- `package.json`, `package-lock.json` e `.npmrc` (registry di `npm ci` nei job con scrittura);
- `vercel.json`, e in via preventiva `api/` e `middleware.*` (codice server Vercel);
- `.gitattributes` (seleziona il merge driver di `history.json`);
- il classificatore della Site CI e il suo test;
- `CLAUDE.md` e `docs/SOCIAL_*.md`, che sono di fatto le istruzioni degli agenti;
- `docs/SECURITY_*.md`;
- **tutto** `tools/social-engine/`.

Restano **esclusi** solo i `*.json` aggiunti dagli agenti in `content/queue/`, `publication/pending/` e
`analytics/pending/`. I README e `.gitkeep` di quelle cartelle restano coperti.

Verifica locale 🟣: 17 regole, owner collaboratore, file campione assegnati come previsto. Alcune regole sono
preventive (`.npmrc`, `api/`, `middleware.*`, oggi assenti).

Dopo il merge apri il file su GitHub: un errore di sintassi viene segnalato con un avviso ⚪.

- **Effetto oggi.** Nessun blocco. GitHub non chiede la review all'autore della PR, che oggi è sempre il proprietario.
- **Per renderlo vincolante:** passo 8 della guida.
- **Non coperto.** `src/` resta fuori: richiederebbe una review del proprietario su ogni PR del sito. Anche `src/`
  viene eseguito nel job di render (il social engine lo importa): il rimedio strutturale è il job di commit separato
  (§7 punto 2).

## 9. Guida operativa per il proprietario

### Passo 1 — Ruleset Livello A (sicuro subito)

1. GitHub → repository **MindMapsAnime** → **Settings** → menu a sinistra **Rules** → **Rulesets** →
   **New ruleset** → **New branch ruleset**.
2. **Ruleset Name**: `main-baseline`.
3. **Enforcement status**: **Active**.
4. **Bypass list**: lascia **vuota**.
5. **Target branches** → **Add target** → **Include default branch** (oppure *Include by pattern* `main`).
   L'anteprima deve mostrare solo `main`.
6. **Rules**, seleziona **solo**:
   - ✔ **Restrict deletions**
   - ✔ **Block force pushes**
7. **NON** selezionare ancora:
   - Restrict creations / updates;
   - Require linear history;
   - Require deployments to succeed;
   - Require signed commits;
   - **Require a pull request before merging**;
   - **Require status checks to pass**;
   - Require code scanning results.

   Alcune possono essere preselezionate: lascia attive solo le due sopra.
8. **Create**.

Effetto sulle automazioni: nessuno. I commit di stato sono push normali (simulati 🟣).

Verifica, il giorno dopo:
- **Actions** → *Social render* e *Social publication state* verdi;
- su `main` i commit `chore(social): record rendered content …` e `… record publication state …` di
  `github-actions[bot]`.

Rollback: Settings → Rules → Rulesets → `main-baseline` → **Enforcement status: Disabled** (o *Delete ruleset*).

### Passo 2 — Impostazioni Actions (sicuro; annota i valori prima di cambiarli)

Settings → **Actions** → **General**:
- **Workflow permissions** → **Read repository contents and packages permissions**. Tutti i workflow e i job
  dichiarano già i propri permessi 🔵, quindi i job che scrivono non cambiano.
- **Allow GitHub Actions to create and approve pull requests**: **disattivato**. Nessun workflow apre o approva PR.
- **Fork pull request workflows from outside collaborators** → **Require approval for first-time contributors** (o
  più restrittivo).

Verifica: il primo run di *Social render* dopo il cambio deve riuscire a spingere lo stato.

Rollback: ripristina i valori annotati.

### Passo 3 — Collaboratore

Settings → **Collaborators** → `DanieleMasone` → **Remove**, se non serve più (0 commit).

In un repository personale non esistono ruoli Read/Write: un collaboratore ha sempre accesso in scrittura. La lettura
resta comunque possibile perché il repository è pubblico.

Decisione del proprietario.

### Passo 4 — Credenziali e release (solo controllo, poi decisione)

1. Account → **Settings** → **Developer settings** → **Personal access tokens** (*Fine-grained* e *Tokens
   (classic)*): elenca i token, gli scope (`repo`, `workflow`, `admin:*`) e la scadenza.
2. Account → **Settings** → **Applications** (*Authorized OAuth Apps*, *Authorized GitHub Apps*, *Installed GitHub
   Apps*): quali app accedono a MindMapsAnime (ChatGPT, Claude, Vercel, Metricool?).
3. Annota quale credenziale usano gli agenti giornalieri. Se ha `workflow` o è un token classico `repo`, l'agente può
   oggi modificare workflow e impostazioni come te.
4. Repository → **Releases** → `temp-killua-20261006`: decidi se eliminarla (Delete) insieme al tag. È un MP4
   pubblico creato da un workflow temporaneo.

### Passo 5 — App "state bot" (Livello C, con una PR ai workflow)

Da fare **solo** con la PR dedicata che modifica `social-render.yml` e `social-publication-state.yml` secondo i
prerequisiti del §7.

1. Account → Settings → Developer settings → **GitHub Apps** → **New GitHub App**:
   - nome `AniMapVerse State Bot`;
   - webhook disattivato;
   - Repository permissions: **Contents: Read and write**, Metadata: Read-only, **nient'altro**;
   - *Only on this account*.
2. **Install App** → *Only select repositories* → MindMapsAnime.
3. Generate a private key.
4. **Prima** di unire la PR ai workflow: Repository → Settings → **Environments** → **New environment**
   `social-state`:
   - *Deployment branches and tags* → **Selected branches** → `main` (esatto);
   - secret: la chiave privata; variable: l'App ID.
5. Unisci la PR. *Social render* con `dry_run = true` verifica solo la configurazione: **non** usa il token e non fa
   push. Il collaudo vero è il primo run reale su `main`, da osservare.
6. Rollback: revert della PR ai workflow (finché `main-pr` non è attivo, si torna subito a `GITHUB_TOKEN`).

### Passo 6 — Identità degli agenti

1. Crea un account GitHub macchina, ad esempio `animapverse-agent`.
2. Invitalo come collaboratore.
3. Ricollega il connettore GitHub di ChatGPT Work con quell'account.
4. Dopo una settimana di run regolari, revoca dal tuo account l'autorizzazione o il token usato prima.

Decisione del proprietario: il connettore deve supportarlo ⚪.

### Passo 7 — Ruleset Livello B (solo dopo i passi 5 e 6)

Crea un secondo ruleset `main-pr`, **Active**, target `main`, con:
- ✔ **Require a pull request before merging**, Required approvals **0**, nessun'altra sotto-opzione;
- ✔ **Require status checks to pass** → *Add checks* → `Site CI`, sorgente **GitHub Actions**;
- ✗ *Require branches to be up to date*;
- **Bypass list**: solo `AniMapVerse State Bot` → *Always*. **Nessun** ruolo admin.

Attivalo poco prima del ciclo delle ~06:00 UTC e osserva:
- PR coda e receipt degli agenti mergiate;
- *Social render* e *Social publication state* verdi;
- commit di stato su `main`;
- nessun rifiuto in *Rules → Insights*.

Rollback immediato: `main-pr` → Enforcement **Disabled**, poi *Re-run jobs* dei run di stato falliti.

### Passo 8 — Code-owner review (ultimo, con decisione esplicita)

Prerequisito: le PR di Claude non escono più a nome del proprietario, altrimenti non sono approvabili. In alternativa
puoi scegliere consapevolmente un bypass **Repository admin → For pull requests only**, sapendo che vale per ogni
credenziale che agisce come te (oggi anche Claude).

In `main-pr`:
- ✔ **Require review from Code Owners**;
- Required approvals **0**;
- ✗ Require approval of the most recent reviewable push.

Collaudo ⚪: una PR degli agenti (solo `*.json` esclusi) deve restare mergiabile senza review; una PR che tocca
`.github/` deve chiedere la tua approvazione. Se la prima chiede un'approvazione, disattiva subito la regola.

## 10. Rollback generale

| Modifica | Come annullarla | Effetto |
|---|---|---|
| Ruleset `main-baseline` | Enforcement → Disabled, o Delete | Immediato |
| Ruleset `main-pr` | Enforcement → Disabled; poi rilanciare i run di stato falliti | Immediato |
| Impostazioni Actions | Ripristinare i valori annotati | Immediato |
| CODEOWNERS (questa PR) | Revert della PR | Nessun effetto finché la code-owner review non è attiva |
| App state bot | **Prima** `main-pr` → Disabled, **poi** revert della PR ai workflow | L'ordine inverso farebbe rifiutare i push di `GITHUB_TOKEN` nel frattempo |

## 11. Test e simulazioni

| Scenario | Tipo | Risultato |
|---|---|---|
| PR sito con Site CI verde | 🟢 #297, #298 | `Site CI` success dopo `Validate & build site` (~2 min) |
| PR sito con Site CI rossa | 🔵 `site-ci.yml` | `result` esce con 1 se validate ≠ success. Con `Site CI` obbligatorio il merge viene rifiutato. Nessuna PR rossa recente da citare ⚪ |
| PR social con validatori verdi | 🟢 #292, #293 | `Site CI` success in ~15 s (social-only); `Validate social queue` / `Validate publication receipts` success |
| PR social con validatori rossi | 🔵 | Validatori rossi, ma non obbligatori: proteggono solo se l'agente attende il verde, come richiede il contratto. Renderli obbligatori lascerebbe "Expected" le PR del sito |
| Commit diretto del bot di rendering | 🟣 | Livello A: riuscito, fast-forward. Con "Require a pull request" senza bypass: rifiutato 4 volte, exit 1, stato **non** salvato |
| Commit diretto del bot publication state | 🟣 (stesso script) | Come sopra, anche con concorrenza simulata (rebase poi push) |
| PR che modifica file workflow | 🟣 + 🔵 | `site-ci.yml` → validazione completa; `social-*.yml` → "social-only". `Site CI` obbligatorio **non** protegge da una PR che riscrive la propria CI: serve la code-owner review su `/.github/` |
| PR che modifica il classificatore CI | 🟣 + 🔵 | Validazione completa con il classificatore di `main`, ma il workflow eseguito è quello della PR: difesa reale = review |
| PR con `[skip ci]` | 🔵 | Nessun workflow: `Site CI` "Expected", merge bloccato se obbligatorio. Gli agenti non lo usano nelle PR 🟢 |
| PR creata con credenziali dell'agente | 🟢 | Autore e merge come `LucaSartorio`; le PR quotidiane mergiano dopo i check (~4–5 min), la PR ops #200 dopo 15 s. Compatibile con `Site CI` obbligatorio e 0 approvazioni; **incompatibile** con approvazioni ≥ 1 |
| CODEOWNERS | 🟣 | 17 regole valide, owner collaboratore, esclusioni solo `*.json` degli agenti |
| Review indipendente | ✅ | Eseguita prima della PR; correzioni bloccanti applicate (approvazioni, bypass admin, sorgente del check, provenienza di `ada5670`, ruoli nei repo personali, esposizione del token nell'Opzione 3) |

**Non eseguito:**
- nessun ruleset reale è stato applicato, nemmeno per prova;
- non ho letto le impostazioni Actions, gli environment, i token o le app autorizzate;
- non ho verificato nell'interfaccia la disponibilità di "GitHub Actions" come attore di bypass né di "Evaluate";
- la combinazione "Require review from Code Owners" + 0 approvazioni non è stata provata.

## 12. Decisioni che spettano al proprietario

1. Applicare il Livello A (consigliato subito).
2. Valori delle impostazioni Actions (passo 2).
3. Rimuovere `DanieleMasone`.
4. Eliminare la release pubblica `temp-killua-20261006`.
5. Creare l'account macchina per gli agenti (verificando il connettore ChatGPT Work) e un'identità non admin per le
   PR di Claude.
6. Approvare lo sprint "state bot" (PR ai workflow social con i prerequisiti del §7 e collaudo).
7. Data di attivazione del Livello B e, dopo, della code-owner review o dell'eccezione admin consapevole.
8. Eventuale spostamento del repository in un'organizzazione.
