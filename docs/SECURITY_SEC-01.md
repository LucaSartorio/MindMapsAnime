# SEC-01 — Protezione di `main` e identità delle automazioni

Stato: **preparazione** (sprint 10, 2026-11-08). Questo documento e `.github/CODEOWNERS` sono le uniche
modifiche: **nessuna impostazione GitHub è stata cambiata** (ruleset, branch protection, token, collaboratori,
Actions). Le configurazioni descritte qui restano proposte finché il proprietario non le applica.

Legenda delle fonti:
- 🟢 **evidenza GitHub reale** (API, cronologia, check run);
- 🔵 **verifica statica** (lettura di workflow e script);
- 🟣 **simulazione locale** (repository di prova con regole equivalenti);
- ⚪ **non verificato** (impostazione non leggibile da questo ambiente: va controllata a mano).

---

## 1. Stato attuale

| # | Controllo | Risultato | Fonte |
|---|---|---|---|
| 1 | Branch protection classica su `main` | **Assente** (`protected: false`, anche su tutti gli altri 100+ branch) | 🟢 API branches |
| 2 | Ruleset sul repository | Non leggibile da qui. La cronologia mostra merge di PR in 3–5 minuti senza review e commit diretti del bot riusciti oggi, compatibili con l'assenza di regole | ⚪ / 🟢 indiretta |
| 3 | Required status checks | Nessuno dimostrabile; la Site CI gira ma non è obbligatoria | 🟢 check run #292–#298 |
| 4 | `CODEOWNERS` | Assente prima di questa PR (né root, né `.github/`, né `docs/`) | 🟢 repository |
| 5 | Collaboratori | `LucaSartorio` **admin**; `DanieleMasone` **write**, **0 commit** nella storia | 🟢 API collaborators + commits |
| 6 | Visibilità | Repository **pubblico**: i ruleset sono disponibili senza piano a pagamento; chiunque può aprire PR da fork | 🟢 API repos |
| 7 | Identità delle PR | **Tutte** le PR recenti (#259–#298: sito, coda social, receipt) sono **create e mergiate come `LucaSartorio`**. I commit delle receipt (#293) hanno autore `Luca Sartorio` | 🟢 API pulls/commits |
| 8 | Identità di Claude Code | I commit di Claude hanno autore/committer `claude`, ma le PR risultano aperte come `LucaSartorio` (connessione GitHub dell'account) | 🟢 API commits/pulls |
| 9 | Commit diretti del bot | `github-actions[bot]` spinge su `main` 2 volte al giorno (≈06:07 render, ≈06:16 publication state) con `GITHUB_TOKEN` | 🟢 commit `6190293`, `2fdcad0` · 🔵 workflow |
| 10 | Workflow scritti senza PR | `ada5670` (06/10, 06:56 UTC, push git come `LucaSartorio`) e `44fee74` (08/10, 05:37 UTC, via API/web) hanno **aggiunto workflow direttamente su `main`**, poi rimossi. Sono nella finestra oraria degli agenti: **probabile** che le credenziali degli agenti abbiano lo scope `workflow` | 🟢 commit · ⚪ token |
| 11 | Ritmo degli agenti | PR coda ≈06:00 → check verdi in ≈40 s → merge ≈4 min dopo; PR receipt ≈06:10 → merge ≈5 min dopo. Gli agenti mergiano dopo i check | 🟢 #292, #293 |
| 12 | Permessi dei workflow | Tutti dichiarano `permissions: contents: read` a livello workflow; solo i job `render` e `apply` chiedono `contents: write`. Nessun secret oltre `GITHUB_TOKEN` | 🔵 |
| 13 | Impostazioni Actions del repository (permessi di default del token, approvazione PR da parte di Actions, approvazione dei workflow da fork) | Non leggibili | ⚪ |
| 14 | Origine e scope del token degli agenti (ChatGPT Work + Metricool) | Non leggibili: le azioni risultano come `LucaSartorio` | ⚪ |

## 2. Rischi confermati

1. **`main` modificabile senza review da chiunque abbia le credenziali del proprietario**, comprese quelle date agli
   agenti. Un agente compromesso, o un prompt injection nei dati che legge, può cambiare codice, dipendenze e workflow
   in produzione: Vercel distribuisce `main`. Evidenza: punti 7 e 10.
2. **Identità condivisa.** Agenti e proprietario sono la stessa identità GitHub, quindi:
   - non si distingue chi ha fatto cosa;
   - una regola "per il proprietario" vale anche per gli agenti (un bypass admin li esenterebbe);
   - una review obbligatoria è impossibile da soddisfare, perché l'autore non può approvare la propria PR.
3. **Workflow con permesso di scrittura modificabili via PR "solo social".**
   - Una PR che cambia solo `social-render.yml` o `tools/social-engine/ci/commit-state.sh` è classificata
     "social-only", quindi la build del sito viene saltata (🟣 simulato). Social validate gira, ma controlla la coda,
     non la sicurezza.
   - Nessuna review obbligatoria protegge questi file, che eseguono codice con `contents: write`.
4. **Codice eseguito nei job con `contents: write`.**
   - Il token viene passato solo allo step "Persist", ma gli step precedenti (`npm ci`, codice del social engine, che
     importa `src/`) girano nello stesso runner.
   - Codice malevolo può riscrivere `commit-state.sh` prima che venga eseguito con il token.
   - `GITHUB_TOKEN` non può toccare `.github/workflows/` (gli manca il permesso `workflows`), ma può spingere
     qualunque altro file su `main`.
5. **Escalation via workflow di PR.**
   - Su `pull_request` da branch dello **stesso** repository, un workflow modificato dalla PR può chiedere
     `contents: write`.
   - Chi può pubblicare un branch può quindi ottenere un token in scrittura. Oggi questo non aggiunge poteri (ha già
     write), ma diventa un **aggiramento** se in futuro "GitHub Actions" fosse messo in bypass di un ruleset (§6, A).
   - Le PR da fork ricevono invece un token in sola lettura e nessun secret.
6. **Action non fissate a uno SHA.** I workflow social con permesso di scrittura usano `actions/*@v4`, cioè tag
   mobili. La Site CI invece le fissa a uno SHA. Un tag compromesso eseguirebbe codice nel job con scrittura.
7. **Collaboratore con write inattivo.** `DanieleMasone` può spingere direttamente su `main`: è superficie d'attacco
   senza uso.
8. **Nessun rischio di loop oggi.** I push con `GITHUB_TOKEN` non avviano workflow; inoltre ci sono `[skip ci]`,
   `[skip social-*]` e il controllo sull'attore. Questo cambia se i commit di stato passano a un'altra identità (§6).

## 3. Matrice degli attori

| Attore | Permessi necessari | Permessi attuali verificabili | Azioni consentite | Da limitare | Scrive su `main`? | Identità dedicata proposta | Rischio se compromesso |
|---|---|---|---|---|---|---|---|
| **Proprietario** (`LucaSartorio`) | Admin | Admin 🟢 | Tutto: impostazioni, merge, review | Push diretti su `main`; uso del proprio token da parte di agenti | Solo via PR (dopo B) | — (resta l'unico admin) | Totale |
| **Collaboratori** (`DanieleMasone`) | Nessuno oggi (0 commit) | Write 🟢 | Push di branch, PR | Write non necessario → Read o rimozione (decisione del proprietario) | No | — | Codice e workflow su `main` (oggi senza review) |
| **Claude Code Cloud** | Leggere il repo, pushare branch `claude/*`, `fix/*`, `security/*`, aprire PR | Push via app/proxy di sessione (autore `claude`); PR come `LucaSartorio` 🟢. Installazione e scope dell'app ⚪ | Branch + PR; **mai merge** (regola delle istruzioni) | Merge, push su `main`, impostazioni | No | GitHub App Claude già separata per i commit; le PR restano a nome del proprietario | Branch e PR malevole; con le regole B non arrivano su `main` senza check |
| **Social Publishing Agent** (ChatGPT Work + Metricool, giornaliero) | Contents R/W e Pull requests R/W solo per aggiungere `content/queue/*.json`, `publication/pending/*.json`, `analytics/pending/*.json` e mergiare dopo i check; Actions read (attende i run) | Agisce come `LucaSartorio` 🟢; scope del token ⚪ (probabile `workflow`, punto 10) | Branch, PR, merge dopo check verdi | Workflow, Administration, push diretti su `main`, file fuori dalle 3 cartelle | No, solo via PR | **Account macchina** dedicato (es. `animapverse-agent`, ruolo Write), o GitHub App se il connettore lo consente ⚪ | Oggi totale (identità del proprietario); con identità dedicata limitato a PR soggette a regole |
| **Social Growth Engine** | Nessun accesso GitHub proprio: è codice che gira nei workflow e localmente | — | Calcola `next.json`, scritto nei commit di stato | — | Indirettamente (commit di stato) | — | Pari al job che lo esegue (`contents: write`) |
| **GitHub Actions bot** (`GITHUB_TOKEN`) | `contents: write` solo nei job `render` e `apply`, solo su `history/`, `content/`, `catalog/`, `publication/`, `analytics/` | Come dichiarato 🔵; default del repository ⚪ | Commit di stato su `main` con `[skip ci]` | Tutto il resto (i workflow sono già read-only per default) | **Sì, oggi** (2×/giorno) | **GitHub App "state bot"** con Contents R/W, chiave in un environment vincolato a `main` (§6, C) | Push arbitrario su `main` (non sui workflow) |
| **Vercel** (app `vercel[bot]`) | Leggere il codice, scrivere commenti e stati di deploy | App installata 🟢 (commenti/check su ogni PR); permessi ⚪ | Preview per PR, produzione da `main` | Nessuna scrittura sul codice | No | — (già app separata) | Deploy di codice non approvato solo se `main` è compromesso |
| **Utenti esterni** (PR da fork) | Nessuno | Nessuno (repo pubblico) | Aprire PR; i workflow girano con token read-only, senza secret | Approvazione manuale dei workflow per i nuovi contributori ⚪ | No | — | Basso (nessun secret, nessuna scrittura) |

## 4. Compatibilità delle regole con le automazioni

Effetto di ogni regola, applicata a `main` **senza bypass**:

| Flusso | Block force pushes | Restrict deletions | Require a pull request (0 approvazioni) | Require status check `Site CI` | Require review from Code Owners |
|---|---|---|---|---|---|
| Commit di stato del render (bot, push diretto) | ✅ (push fast-forward, rebase locale) 🟣 | ✅ | ❌ **rifiutato** 🟣: stato non registrato, video re-renderizzati al giro dopo, pubblicazioni ferme | ❌ rifiutato (il commit non ha check) | — (non è una PR) |
| Commit di stato publication/receipt | ✅ 🟣 | ✅ | ❌ **rifiutato** (stesso script) | ❌ | — |
| Commit del catalogo (stesso commit dei due sopra) | ✅ | ✅ | ❌ | ❌ | — |
| PR coda/receipt degli agenti | ✅ | ✅ | ✅ (già PR) | ✅ `Site CI` verde in ~15 s (social-only) 🟢; gli agenti mergiano dopo ~4–5 min 🟢 | ✅ i file sono esclusi dal CODEOWNERS 🟣. **Ma** con identità condivisa la regola li tratta come il proprietario |
| PR applicative Claude | ✅ | ✅ | ✅ | ✅ `Site CI` 2–3 min 🟢 | ❌ **bloccante**: autore = `LucaSartorio`, che non può approvare la propria PR. Serve bypass "solo PR" per l'admin, quindi identità degli agenti separata prima |
| Commit con `[skip ci]` in una **PR** | ✅ | ✅ | ✅ | ❌ **bloccato**: nessun workflow parte, il check resta "Expected" (è un comportamento di GitHub, per push e pull_request) | — |
| Commit `[skip ci]` del bot **su `main`** | ✅ | ✅ | ❌ | ❌ | — |

Conclusione: solo **Block force pushes** e **Restrict deletions** sono applicabili oggi senza interrompere nulla.
"Require a pull request" e "Require status checks" bloccano i commit di stato, finché questi non usano un'identità
in **bypass esplicito** (§6).

Check da **non** rendere obbligatori:
- `Validate social queue` e `Validate publication receipts`: partono solo con certi path e resterebbero "Expected" per
  sempre sulle PR del sito;
- `Validate & build site`: è "skipped" sulle PR social;
- `Vercel`: è esterno e dipende dal deploy.

L'unico check obbligatorio adatto è **`Site CI`**, che conclude sempre.

## 5. Livello A — protezione immediata, basso rischio (consigliata ora)

Ruleset **solo su `main`**, con **Restrict deletions** e **Block force pushes**, enforcement Active, nessun bypass.
- 🟣 Simulato: con `receive.denyNonFastForwards` + `receive.denyDeletes`, `commit-state.sh` spinge normalmente, anche
  nel caso di concorrenza tra render e publication state (rebase locale poi push fast-forward).
- Nessun flusso usa push forzati o cancella `main`. I merge delle PR (merge commit) non sono force push.
- Istruzioni esatte nella **guida, §9 passo 1**.

## 6. Livello B — controlli obbligatori sulle PR (dopo il Livello C)

Ruleset `main-pr` (target `main`):

| Opzione | Valore | Motivo |
|---|---|---|
| Require a pull request before merging | ✔, **Required approvals: 0** | Con identità condivise un'approvazione è impossibile (l'autore non approva) |
| Dismiss stale approvals / Require approval of the most recent push | ✗ (finché le approvazioni sono 0) | Non hanno effetto |
| Require review from Code Owners | ✗ ora; ✔ quando gli agenti hanno un'identità propria **e** l'admin ha bypass "solo PR" | Altrimenti blocca le PR di Claude |
| Require conversation resolution | Facoltativo | Nessun impatto sugli agenti (nessun commento) |
| Require status checks to pass | ✔ **`Site CI`**, sorgente **GitHub Actions** | Conclude sempre; la sorgente impedisce che un altro workflow pubblichi uno stato omonimo |
| Require branches to be up to date | ✗ | Con PR quotidiane e commit del bot ogni giorno costringerebbe a rebase continui |
| Bypass list | **Solo** la GitHub App "state bot" (C) in modalità *Always*; il ruolo Repository admin in modalità **"For pull requests only"** solo dopo la separazione delle identità | Il bot deve poter spingere lo stato; l'admin può mergiare in emergenza, ma non spingere direttamente |
| Block force pushes / Restrict deletions | Già nel Livello A | — |

Prerequisiti (se manca anche uno solo, B interrompe le pubblicazioni):

1. I commit di stato usano un'identità **in bypass** (C), **verificata in modo realistico** su un branch di prova o in
   finestra di manutenzione.
2. Gli agenti non usano `[skip ci]` nei commit delle PR (oggi non lo fanno 🟢).
3. Gli agenti mergiano solo dopo i check (oggi lo fanno 🟢). Con il ruleset attivo un merge prematuro viene rifiutato
   invece di passare.

**Evaluate mode.** GitHub offre "Evaluate" (registra senza bloccare) solo su piani Enterprise ⚪: sui repository
personali di norma non compare. Se compare tra gli "Enforcement status", usalo per una settimana prima di Active e
controlla *Rules → Insights*. Altrimenti il collaudo va fatto sui fatti, con una finestra di rollback pronta (§10).

## 7. Livello C — identità separate (la scelta architetturale)

| | A. `GITHUB_TOKEN` + bypass per "GitHub Actions" | B. Commit di stato tramite PR automatiche | **C. GitHub App dedicata ai commit di stato** |
|---|---|---|---|
| Supportato | ⚪ Va verificato nel menu "Add bypass": non assumere che `github-actions[bot]` sia selezionabile in un repo personale | Sì | Sì: le GitHub App installate sono attori di bypass dei ruleset |
| Sicurezza | **Bassa.** Il bypass vale per **ogni** workflow, anche quelli di PR da branch interni (§2.5): chi ha write aggira la protezione | Media: lo stato passa da PR, ma serve un'identità capace di farle partire e mergiare | **Alta**, se la chiave privata vive in un environment `social-state` limitato al branch `main`: solo i workflow già su `main` ottengono il token |
| Complessità | Bassa | **Alta**: 2 PR in più al giorno. I conflitti su `history.json` non si risolvono con il merge driver lato GitHub. Una PR creata con `GITHUB_TOKEN` non avvia la Site CI, quindi il check obbligatorio resta "Expected" | Media: un'app, un environment, uno step di generazione del token |
| Compatibilità con le automazioni | Totale, se supportato | Cambia contratto e tempi (render → PR → check → merge → poi pubblicazione) | Totale: stesso `commit-state.sh`, cambia solo il token |
| Impatto sulle pubblicazioni quotidiane | Nessuno | Ritardo e nuovi punti di blocco | Nessuno, dopo un collaudo |
| Rischio di workflow ricorsivi | Nessuno (`GITHUB_TOKEN` non avvia workflow) | Alto (PR che avviano workflow) | **Da gestire**: i push con il token dell'app **avviano** workflow. Restano `[skip ci]` nel messaggio (GitHub lo rispetta per i push) e il filtro `[skip social-*]`; il controllo `github.actor != 'github-actions[bot]'` va esteso al nome dell'app |
| Manutenzione | Nessuna | Alta | Bassa (rotazione della chiave, permessi minimi) |
| Rollback | Rimuovere il bypass | Lungo (contratti e workflow) | Rimuovere lo step del token: si torna a `GITHUB_TOKEN` (e B va disattivato) |

**Raccomandazione: C**, insieme a un'**identità dedicata per gli agenti**.

1. **GitHub App "AniMapVerse State Bot"** (privata, installata solo su questo repository):
   - permessi Contents R/W e Metadata R; niente Workflows, Administration o Pull requests; nessun webhook;
   - chiave privata nei secret di un **environment `social-state`** con *Deployment branches: Selected → `main`*;
   - i job `render`/`apply` dichiarano `environment: social-state` e generano il token nello step Persist, con
     un'action fissata a uno SHA;
   - app nella bypass list di `main-pr`.
2. **Agenti ChatGPT Work/Metricool con un account macchina** (es. `animapverse-agent`):
   - ruolo **Write**, senza Admin, con le credenziali del connettore emesse da quell'account. Le PR non sono più del
     proprietario: le regole B valgono per loro e il proprietario può approvare;
   - se il connettore permette una GitHub App invece di un utente, preferirla con Contents/Pull requests R/W e
     **Workflows: No access**;
   - revocare dal tuo account le credenziali usate oggi dagli agenti (§9 passo 6).
3. **Rafforzamenti dei workflow** (in una PR dedicata, con collaudo):
   - fissare `actions/*` a SHA nei workflow con scrittura;
   - spostare il commit di stato in un job separato, che riceve i soli file di stato come artifact ed esegue
     `commit-state.sh` da un checkout pulito, così il codice del render non tocca lo script che ha il token;
   - estendere i loop guard all'attore dell'app.

**Ordine di migrazione** (nessuno di questi passi è eseguito in questa PR):

1. Livello A.
2. Impostazioni Actions e collaboratore (§9).
3. App state bot + environment + PR ai workflow, collaudata con `workflow_dispatch` `dry_run` e un render reale
   monitorato.
4. Account macchina per gli agenti.
5. Livello B con 0 approvazioni + `Site CI`.
6. Code owner review con bypass admin "solo PR".

## 8. CODEOWNERS

`.github/CODEOWNERS` assegna a `@LucaSartorio` (unico admin, verificato 🟢):
- `.github/`;
- `package.json` e `package-lock.json`;
- `vercel.json`;
- `.gitattributes`, che seleziona il merge driver di `history.json`;
- il classificatore della Site CI e il suo test;
- **tutto** `tools/social-engine/`, che gira con `contents: write`.

Ne restano **escluse** le cartelle in cui gli agenti aggiungono file ogni giorno: `content/queue/`,
`publication/pending/` e `analytics/pending/`.

Verifica locale 🟣: 11 regole, tutte corrispondono a file tracciati, owner valido, file campione assegnati come
previsto.

GitHub segnala eventuali errori di sintassi aprendo il file nell'interfaccia (avviso "This CODEOWNERS file contains
errors"): controllalo dopo il merge ⚪.

- **Effetto oggi.** Nessun blocco. GitHub può chiedere la review al code owner, ma non all'autore della PR, che oggi è
  sempre il proprietario.
- **Per renderlo vincolante.** Ruleset con "Require a pull request" + "Require review from Code Owners" e almeno
  1 approvazione. Solo dopo il passo 6 dell'ordine di migrazione, altrimenti le PR di Claude e quelle del proprietario
  non sono approvabili.
- **Non coperto.** `src/` resta fuori: richiederebbe una review del proprietario su ogni PR del sito. Anche `src/`
  viene eseguito nel job di render (il social engine lo importa): il rimedio strutturale è il job di commit separato
  (§7.3).

## 9. Guida operativa per il proprietario

### Passo 1 — Ruleset Livello A (sicuro subito)

1. GitHub → repository **MindMapsAnime** → **Settings** → menu a sinistra **Rules** → **Rulesets** →
   **New ruleset** → **New branch ruleset**.
2. **Ruleset Name**: `main-baseline`.
3. **Enforcement status**: **Active**.
4. **Bypass list**: lascia **vuota**.
5. **Target branches** → **Add target** → **Include default branch** (oppure *Include by pattern* `main`).
   Controlla che l'anteprima mostri solo `main`.
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

   Alcune sono preselezionate: togli quelle che non sono le due sopra.
8. **Create**.

Effetto sulle automazioni: nessuno. I commit di stato sono push normali, già simulati 🟣.

Verifica, il giorno dopo:
- **Actions** → *Social render* e *Social publication state* verdi;
- su `main` compaiono i commit `chore(social): record rendered content …` e `… record publication state …` di
  `github-actions[bot]`;
- *Settings → Rules → Insights* non mostra rifiuti per quei push.

Rollback: Settings → Rules → Rulesets → `main-baseline` → **Enforcement status: Disabled** (o *Delete ruleset*).

### Passo 2 — Impostazioni Actions (sicuro, verifica prima i valori)

Settings → **Actions** → **General**:
- **Workflow permissions** → **Read repository contents and packages permission**. I job che scrivono dichiarano già
  `contents: write`. Annota il valore attuale prima di cambiarlo, per il rollback.
- **Allow GitHub Actions to create and approve pull requests**: **disattivato**. Nessun workflow apre o approva PR.
- **Fork pull request workflows from outside collaborators**: **Require approval for first-time contributors** (o
  più restrittivo).

Verifica: il primo run di *Social render* dopo il cambio deve riuscire a spingere lo stato. Il suo job dichiara
`contents: write`, che prevale sul default.

Rollback: ripristina il valore annotato.

### Passo 3 — Collaboratore

Settings → **Collaborators**: per `DanieleMasone` scegli **Read**, oppure **Remove**, se l'accesso in scrittura non
serve più (0 commit nella storia).

Decisione del proprietario.

### Passo 4 — Credenziali in uso (solo controllo)

1. Account → **Settings** → **Developer settings** → **Personal access tokens**, sia *Fine-grained* sia
   *Tokens (classic)*: elenca i token, gli scope (`repo`, `workflow`, `admin:*`) e la scadenza.
2. Account → **Settings** → **Applications**, schede *Authorized OAuth Apps*, *Authorized GitHub Apps* e
   *Installed GitHub Apps*: quali app hanno accesso a MindMapsAnime (ChatGPT, Claude, Vercel, Metricool?).
3. Annota quale credenziale usano gli agenti giornalieri. Se ha `workflow` o è un token classico `repo`, l'agente può
   oggi modificare workflow e impostazioni come te.

### Passo 5 — App "state bot" (Livello C, richiede una PR ai workflow)

Da fare **solo** con la PR dedicata che modifica `social-render.yml` e `social-publication-state.yml`.

1. Account → Settings → Developer settings → **GitHub Apps** → **New GitHub App**, con:
   - nome `AniMapVerse State Bot`;
   - webhook disattivato;
   - Repository permissions: **Contents: Read and write**, Metadata: Read-only, **nient'altro**;
   - *Only on this account*.
2. **Install App** → *Only select repositories* → MindMapsAnime.
3. Generate a private key.
4. Repository → Settings → **Environments** → **New environment** `social-state`:
   - *Deployment branches and tags* → **Selected branches** → `main`;
   - **Environment secrets**: l'ID dell'app e la chiave privata.
5. Unisci la PR ai workflow e lancia *Social render* da **Actions** con **dry_run = true**, poi osserva un render
   reale.
6. Rollback: revert della PR ai workflow, così si torna a `GITHUB_TOKEN`.

### Passo 6 — Identità degli agenti

1. Crea un account GitHub macchina, ad esempio `animapverse-agent`.
2. Invitalo come collaboratore **Write**.
3. Ricollega il connettore GitHub di ChatGPT Work con quell'account.
4. Dopo una settimana di run regolari revoca, dal tuo account, l'autorizzazione o il token usato prima.

Decisione del proprietario: il connettore deve supportarlo ⚪.

### Passo 7 — Ruleset Livello B (solo dopo i passi 5 e 6)

Crea un secondo ruleset `main-pr`, **Active**, target `main`, con queste regole:
- ✔ **Require a pull request before merging**, Required approvals **0**;
- ✔ **Require status checks to pass** → *Add checks* → `Site CI`, sorgente **GitHub Actions**;
- ✗ *Require branches to be up to date*.

**Bypass list**:
- `AniMapVerse State Bot` → *Always*;
- **Repository admin** → *For pull requests only*.

Se compare "Evaluate", usalo per 7 giorni prima di Active.

Verifica il giorno dopo:
- PR coda e PR receipt degli agenti mergiate;
- run *Social render* e *Social publication state* verdi;
- commit di stato presenti su `main`;
- nessun rifiuto in *Rules → Insights*.

Rollback immediato: `main-pr` → Enforcement **Disabled**. I commit di stato riprendono al run successivo; un run
fallito si rilancia da Actions con *Re-run jobs*.

### Passo 8 — Code owner review (ultimo)

In `main-pr`:
- ✔ **Require review from Code Owners**;
- Required approvals **1**;
- ✔ **Require approval of the most recent reviewable push**.

Le PR degli agenti, sulle cartelle escluse, non richiedono review. Le PR di Claude e le tue passano con il bypass
admin "solo PR" oppure con la tua approvazione, se l'autore è un'altra identità.

## 10. Rollback generale

| Modifica | Come annullarla | Effetto |
|---|---|---|
| Ruleset `main-baseline` | Enforcement → Disabled, o Delete | Immediato |
| Ruleset `main-pr` | Enforcement → Disabled | Immediato. Rilanciare da Actions i run di stato falliti |
| Impostazioni Actions | Ripristinare i valori annotati | Immediato |
| CODEOWNERS (questa PR) | Revert della PR | Nessun effetto finché non c'è "Require review from Code Owners" |
| App state bot | Revert della PR ai workflow, poi disattivare `main-pr` | Si torna a `GITHUB_TOKEN` |

## 11. Test e simulazioni

| Scenario | Tipo | Risultato |
|---|---|---|
| PR sito con Site CI verde | 🟢 #297, #298 | `Site CI` success dopo `Validate & build site` (~2 min) |
| PR sito con Site CI rossa | 🔵 `site-ci.yml` | `result` esce con 1 se validate ≠ success. Con `Site CI` obbligatorio il merge viene rifiutato. Nessuna PR rossa recente da citare ⚪ |
| PR social con validatori verdi | 🟢 #292, #293 | `Site CI` success in ~15 s (social-only), `Validate social queue` / `Validate publication receipts` success |
| PR social con validatori rossi | 🔵 | `Social validate` / `Social publication validate` rossi. Non sono obbligatori: proteggono solo se l'agente attende il verde, come richiede il contratto. Renderli obbligatori lascerebbe "Expected" le PR del sito |
| Commit diretto del bot di rendering | 🟣 | Livello A: riuscito, fast-forward. Con `Require a pull request` senza bypass: rifiutato 4 volte, exit 1, stato **non** salvato |
| Commit diretto del bot publication state | 🟣 (stesso script) | Come sopra, anche con concorrenza simulata (rebase poi push) |
| PR che modifica file workflow | 🟣 classificatore + 🔵 | `site-ci.yml` → validazione completa; `social-*.yml` → "social-only", build saltata, gira Social validate. CODEOWNERS: owner `@LucaSartorio`. Senza ruleset B + code owner review nessuna protezione |
| PR che modifica il classificatore CI | 🟣 + 🔵 | Validazione completa; la Site CI usa la copia del classificatore su `main` (la PR non può rilassare la propria classificazione), ma il workflow della PR è quello della PR stessa: la difesa reale è la review (CODEOWNERS) |
| PR con `[skip ci]` | 🔵 (comportamento GitHub documentato) | Nessun workflow: `Site CI` "Expected", merge bloccato se obbligatorio. Gli agenti non lo usano nelle PR 🟢 |
| PR creata con le credenziali dell'agente | 🟢 | Autore e merge come `LucaSartorio`, merge dopo check verdi (~4–5 min). Compatibile con `Site CI` obbligatorio; incompatibile con approvazioni ≥ 1 finché l'identità è condivisa |
| CODEOWNERS | 🟣 | 11 regole valide, owner collaboratore admin, esclusioni corrette |

**Non eseguito:**
- nessun ruleset reale è stato applicato, nemmeno per prova;
- non ho letto le impostazioni Actions, i token o le app autorizzate;
- non ho verificato se "GitHub Actions" o "Evaluate" sono disponibili nell'interfaccia di questo repository.

## 12. Decisioni che spettano al proprietario

1. Applicare il Livello A (consigliato subito).
2. Valori delle impostazioni Actions (passo 2).
3. Ridurre o rimuovere il permesso write di `DanieleMasone`.
4. Creare l'account macchina per gli agenti e verificare che il connettore ChatGPT Work lo supporti.
5. Approvare lo sprint "state bot" (PR ai workflow social con collaudo).
6. Data di attivazione del Livello B e, dopo, della code owner review.
