# AniMapVerse State Bot — commit di stato del social engine con privilegi separati

SEC-01, sprint 11 (`docs/SECURITY_SEC-01.md` §7, Opzione 3). Obiettivo: i commit automatici di stato
(render, receipt, analytics, catalogo) passano da una **GitHub App dedicata**. Così `main` potrà essere
protetto con PR e check obbligatori (ruleset `main-pr`), con bypass **solo** per quell'app.

Legenda: ✅ implementato e testato in locale · 🧭 da fare dal proprietario · ⚪ non verificabile da qui
(impostazione GitHub o primo run reale).

## 1. Stato della migrazione

| Pezzo | Dove | Stato |
|---|---|---|
| `tools/social-engine/ci/state-bundle.mjs`: export, verify, apply, plan, push (zero dipendenze) | PR 1 | ✅ |
| `tools/social-engine/ci/prepare-state.sh`: preparazione non privilegiata (merge driver + catalogo) | PR 1 | ✅ |
| Test (`npm run social:state:test`, anche dentro `social:validate`) | PR 1 (+ PR 2/3) | ✅ |
| `.github/workflows/social-state-persist.yml` (prepare → persist + `check-only` + recupero) | PR 2, **Draft** | ✅ codice · ⚪ mai eseguito su GitHub |
| Migrazione di *Social render* | PR 2, **Draft** | ✅ codice · ⚪ |
| Migrazione di *Social publication state* | PR 3, **Draft** | ✅ codice · ⚪ |
| GitHub App, installazione, environment `social-state`, secret e variable | — | 🧭 §6 |
| Ruleset `main-pr` con bypass per l'app | — | 🧭 §10, solo dopo il collaudo |

Finché le PR 2 e 3 non sono unite, la produzione resta **identica**: `commit-state.sh` con
`GITHUB_TOKEN`. La PR 1 aggiunge solo script e test, che nessun workflow usa ancora.

## 2. Flusso attuale (prima della migrazione)

```
PR coda (agente) ─► merge ─► Social render [job render: contents: WRITE]
                               npm ci · Remotion · render · catalogo · report · artifact video
                               commit-state.sh: git add → commit → push con GITHUB_TOKEN
                               (su rifiuto: pull --rebase + merge driver tsx + npm run social:catalog)
                             ─► main ◄── commit di stato di github-actions[bot] [skip ci]
Agente Publishing ─► Metricool ─► PR receipt ─► merge ─► Social publication state [job apply: WRITE]
                               npm ci · validate · apply · analytics · commit-state.sh ─► main
```

Problemi (SEC-01 §2.5):
- il token di scrittura sta nello stesso job che esegue `npm ci`, Remotion e tutto il codice del
  repository;
- lo script di commit esegue codice dell'app (merge driver, catalogo) con il token nell'ambiente;
- il token compare nell'URL del remote.

## 3. Flusso nuovo

```
PR coda ─► merge ─► Social render
   ┌─ job render ──────── contents: READ · nessun segreto ─────────────────────────────┐
   │ npm ci · Remotion · render · catalogo · artifact video (invariato)                 │
   │ state-bundle.mjs export ─► artifact "social-state-raw-<run>-<attempt>-render"     │
   └────────────────────────────────────────────────────────────────────────────────────┘
          │ (anche se un video fallisce: lo stato va salvato comunque)
          ▼  social-state-persist.yml (workflow riutilizzabile)
   ┌─ job prepare ─────── contents: READ · nessun segreto ─────────────────────────────┐
   │ checkout main · npm ci · prepare-state.sh:                                          │
   │   verify grezzo → commit locale sulla base → rebase su main con il merge driver   │
   │   di history.json → catalogo rigenerato → export ─► artifact "…-final-…"           │
   └────────────────────────────────────────────────────────────────────────────────────┘
          ▼
   ┌─ job persist ─────── environment social-state (solo main) · contents: READ ─────────┐
   │ checkout PULITO di main (nessun npm, nessun codice dell'app, nessun hook)          │
   │ state-bundle.mjs plan  (senza token): verify + confronto per percorso              │
   │ create-github-app-token (solo se c'è un commit; Contents: write; revocato a fine)  │
   │ state-bundle.mjs push: commit costruito con plumbing git, push NON forzato         │
   └─────────────────────────────── result: pushed | noop | conflict ───────────────────┘
          ▼ se conflict: secondo giro (prepare + persist) sul main più recente
   job "State persisted": verde se uno dei due giri ha dato pushed/noop, altrimenti rosso con le
   istruzioni di recupero.
```

*Social publication state* segue lo stesso schema, con il profilo `publication`.

## 4. Proprietà di sicurezza

| Proprietà | Come | Verifica |
|---|---|---|
| Il codice non fidato non vede mai la chiave né il token | Render, apply e prepare hanno `contents: read`, senza environment e senza `secrets.` | ✅ `workflows.test.mjs` |
| Il job con il token non esegue codice dell'app | persist esegue solo `state-bundle.mjs` dal checkout di main: niente `npm`, `npx`, `tsx`, merge driver, hook (`core.hooksPath=/dev/null`), config globale o di sistema | ✅ test statico + test 12 |
| Token coniato il più tardi possibile | Dopo `plan` e solo se c'è un commit; `create-github-app-token` lo revoca nel post-step | ✅ ordine verificato dal test |
| Token mai in URL, parametri, file o log | Header HTTP via `GIT_CONFIG_*` nell'ambiente di git; mascherato (`::add-mask::`); remote senza credenziali | ✅ test "il token non compare…" |
| Artifact trattato come dato ostile | Schema esatto, profilo atteso, allowlist **esatta** per percorso + operazione, niente symlink/dotfile/`..`/`\`, niente file extra, sha256, JSON valido, `history.json` con schema minimo | ✅ test 1, 2, 13 + traversal |
| Nessuna modifica fuori dallo stato | Allowlist: solo `history.json`, `catalog/*.json`, `content/{queue: delete, rendered, failed}`, `publication/{pending: delete, applied: SOLO add, failed}`, `analytics/{pending: delete, applied: SOLO add, failed, metrics.json}`. Workflow, script, `package.json`, codice, README e schemi sono rifiutati | ✅ |
| Audit trail immutabile | `publication/applied/` e `analytics/applied/` ammettono solo nuovi file; un contenuto diverso dallo stesso nome → `conflict` | ✅ test 9b |
| Commit indipendente dal working tree | Commit con indice temporaneo + `commit-tree` sui blob del bundle; le modifiche locali del checkout sono ignorate; modalità `100644` obbligatoria (un symlink su main fa fallire) | ✅ test 12 + symlink |
| Origine del bundle verificata | Il bundle deve venire da un run di `social-render.yml` / `social-publication-state.yml` **su main**, nello stesso repository, con evento push o workflow_dispatch: lo controlla l'API nel job `prepare`. Il manifest deve dichiarare quel run e quel workflow (`verify --expect-run/--expect-workflow`). Un artifact caricato da un altro run (branch, fork, workflow arbitrario) viene rifiutato | ✅ test + ⚪ verifica API su GitHub |
| Nessun fallback a credenziali più ampie | Senza `STATE_BOT_TOKEN` la CLI esce con errore; `GITHUB_TOKEN` non viene mai usato per il push | ✅ test 4 |
| Branch fisso | Solo `refs/heads/main`; environment limitato a `main`; `prepare` rifiuta ref diversi da `main` | ✅ test + ⚪ environment |
| Action fissate | Ogni `uses:` dei workflow social è fissato a uno SHA (le `@v4` già in uso fissate allo SHA attuale, comportamento invariato) | ✅ test |

**Limiti** (dettaglio al §11):
- `state-bundle.mjs` gira **dal checkout di `main`**, quindi chi può cambiare `main` può cambiare anche lo
  script che riceve il token. È la ragione della code-owner review su `tools/social-engine/` (SEC-01 passo 8).
- Con Contents: write l'app potrebbe anche creare tag o release, ma lo script non lo fa mai.

## 5. Concorrenza e consistenza

- **Niente force push, mai.** Il push è un fast-forward: GitHub lo rifiuta se `main` è cambiato. In quel caso
  lo script rifà fetch e plan (al massimo 4 tentativi). Anche la corsa sul ref (`cannot lock ref`, due push
  nello stesso istante) viene ritentata.
- **Confronto per percorso, mai merge di contenuto nel job privilegiato.** Per ogni file:
  - HEAD di main = base → si applica;
  - HEAD = contenuto nuovo (o già cancellato) → *già applicato* (idempotente: un re-run non duplica);
  - altrimenti → `conflict`, e main resta invariato.
- **Il merge vero lo fa il job non privilegiato.** Su `conflict` il secondo giro ri-prepara sul main nuovo con
  il merge driver campo per campo di `history.json` (identico a oggi) e rigenera il catalogo dallo stato
  risultante, così `catalog.publishing.ready` non viene mai da uno stato obsoleto.
- **Catalogo mai vecchio.** Se il bundle contiene il catalogo e tra la base e main sono cambiati dati del sito o file
  del social engine, il catalogo del bundle conta come `conflict`. Il secondo giro lo rigenera sul main nuovo.
- **Un conflitto reale** (stesso campo cambiato da entrambe le parti) fa fallire `prepare` in modo esplicito:
  nulla viene scritto e il bundle grezzo resta 7 giorni per il recupero (§9).
- **Niente gruppo di concurrency sul persist.** In GitHub un gruppo tiene solo *un* job in attesa e
  **cancella** il precedente: con tre persistenze ravvicinate si perderebbe uno stato. Bastano il push atomico
  e il secondo giro. I gruppi di concurrency dei due workflow restano come oggi.
- **Receipt o render già applicati** → `noop` (test 9 e 10). Una receipt è comunque idempotente anche nella
  macchina a stati della pubblicazione.

Simulazione end-to-end locale (repository reale, merge driver reale):
- render e publication modificano campi diversi dello **stesso record** di `history.json`;
- il secondo arriva su main per primo;
- `prepare` fa il rebase con il merge driver e rigenera 4 file di catalogo;
- `persist` spinge un solo commit fast-forward, e su main ci sono entrambi i campi.

## 6. Setup del proprietario (🧭) — prima di unire la PR 2

Non incollare mai chiavi o token in una chat: si inseriscono solo nei campi di GitHub.

### 6.1 Creare la GitHub App

1. GitHub → foto profilo → **Settings** → **Developer settings** → **GitHub Apps** → **New GitHub App**.
2. **GitHub App name**: `AniMapVerse State Bot`. Lo *slug* diventa ad esempio `animapverse-state-bot`.
3. **Homepage URL**: `https://github.com/LucaSartorio/MindMapsAnime`.
4. **Webhook** → togli la spunta a **Active**.
5. **Repository permissions**:
   - **Contents: Read and write**;
   - **Metadata: Read-only** (obbligatorio, già impostato);
   - **tutto il resto: No access**. In particolare niente Administration, Workflows, Pull requests,
     Actions o Secrets.
6. **Organization / Account permissions**: nessuna.
7. **Where can this GitHub App be installed?** → **Only on this account**.
8. **Create GitHub App**.
9. Nella pagina *General* annota il **Client ID** (inizia con `Iv…`) e lo **slug** (nell'URL
   `github.com/apps/<slug>`). L'App ID non serve: la versione dell'action usata accetta il Client ID e considera
   l'App ID deprecato.

### 6.2 Chiave privata

*General* → **Private keys** → **Generate a private key**: il browser scarica un file `.pem`. Tienilo solo sul
tuo computer, finché non lo inserisci nel secret (§6.4); poi cancellalo.

### 6.3 Installazione solo su questo repository

*Install App* (menu a sinistra) → **Install** sul tuo account → **Only select repositories** →
**MindMapsAnime** → **Install**.

Verifica in **Settings** → **Applications** → **Installed GitHub Apps** → *AniMapVerse State Bot* →
**Configure**:
- *Repository access* deve mostrare solo MindMapsAnime;
- i permessi devono essere *Read and write: code* e *Read: metadata*.

### 6.4 Environment `social-state`

Repository → **Settings** → **Environments** → **New environment** → nome `social-state`:
- **Deployment branches and tags** → **Selected branches and tags** → **Add deployment branch or tag rule**
  → tipo *Branch*, pattern **`main`** (esatto);
- **Required reviewers**: **nessuno**: bloccherebbe i run automatici delle 06:00;
- **Allow administrators to bypass configured protection rules**: **togli la spunta**. Oggi agenti e Claude agiscono
  come te (admin): non verificato se questa opzione esenti anche dalla regola sul branch, quindi va spenta. Non costa
  nulla, perché non ci sono reviewer;
- **Wait timer**: nessuno;
- **Environment secrets** → **Add environment secret** `STATE_BOT_PRIVATE_KEY` → incolla **l'intero
  contenuto** del `.pem` (da `-----BEGIN` a `END…-----`);
- **Environment variables** → **Add environment variable** `STATE_BOT_CLIENT_ID` = il Client ID.

L'environment va creato **prima** di unire la PR 2. Se un job cita un environment che non esiste, GitHub lo
crea da solo, **senza** la regola sul branch.

### 6.5 Variable del repository per il loop guard

Repository → **Settings** → **Secrets and variables** → **Actions** → **Variables** →
**New repository variable** `STATE_BOT_LOGIN` = `<slug>[bot]`, ad esempio `animapverse-state-bot[bot]`.

Va a livello di **repository**, non di environment: la legge l'`if:` dei job di lavoro, che non hanno
environment.

### 6.6 Verifica delle credenziali (senza push)

Va fatta dopo l'unione della PR 2, perché prima il workflow non esiste su main:
1. **Actions** → **Social state persist** → **Run workflow**;
2. branch **main**, *check-only* ✔ → **Run workflow**;
3. nel riepilogo deve comparire "State Bot credentials OK", con lo slug e la conferma di `STATE_BOT_LOGIN`.

Il job conia il token con Contents: write e **legge** `main` con `git ls-remote`: niente checkout, niente
commit, niente push. Se fallisce, controlla nell'ordine:
- Client ID;
- secret: il `.pem` deve essere completo;
- installazione sul repository;
- permesso Contents;
- regola `main` dell'environment.

## 7. Migrazione e collaudo

| Step | Chi | Cosa | Effetto sulla produzione |
|---|---|---|---|
| A | Claude | PR 1 (script e test) pronta; PR 2 e PR 3 in **Draft**, "DO NOT MERGE — REQUIRES MANUAL GITHUB APP SETUP" | Nessuno |
| B | 🧭 | §6.1–6.5 | Nessuno |
| — | 🧭 | Merge della PR 1 | Nessuno: script non ancora usati |
| C1 | 🧭 | La PR 2 esce dal Draft solo dopo B. Va unita **lontano dalle 06:00 UTC**, poi si esegue subito §6.6 (check-only) | Da qui il render usa l'app |
| C2 | 🧭 | Si osserva il primo run reale di *Social render* (quello del giorno dopo, o un run manuale se in coda c'è già qualcosa), §8 | Primo push dell'app |
| D | 🧭 | Se C2 è verde: merge della PR 3, poi si osserva il primo run di *Social publication state* | — |
| E | 🧭 | Solo con **entrambi** i workflow verdi via app per qualche giorno: ruleset `main-pr` (§10) | Protezione attiva |

**Perché il primo push è reale.** Il collaudo senza push (C1) verifica chiave, installazione, permessi e login.
Un push di prova separato richiederebbe commit fittizi su main. Il primo run reale è minimo (un solo commit di
stato, quello che oggi farebbe `github-actions[bot]`) e reversibile:
- se fallisce, main non cambia;
- il bundle resta nell'artifact;
- il recupero è un *Run workflow* (§9).

Nessuna receipt fittizia, nessuna modifica artificiale a `history.json`, nessuna pubblicazione.

## 8. Controllo del primo run reale

Nel run di *Social render* (lo stesso che l'agente già aspetta, quindi il contratto non cambia):

1. job **Render queued videos** verde. L'artifact dei video ha lo stesso nome di sempre;
   `social-state-raw-…-render` è un artifact in più.
2. **Persist state** → *Prepare state* verde, *Persist state (State Bot)* verde. Nel riepilogo: `push: pushed`
   e "pushed as `<slug>[bot]`".
3. **State persisted** verde.
4. Su `main`, l'ultimo commit `chore(social): record rendered content [skip social-render] [skip ci]` è stato
   spinto dall'app e tocca solo `tools/social-engine/{history,content,catalog}`. Il **nome** dell'autore è
   `<slug>[bot]`: senza l'id numerico nell'email, GitHub potrebbe non collegarlo all'avatar del bot. È solo un
   aspetto estetico: bypass e loop guard dipendono da chi spinge, non dall'autore.
5. **Nessun** nuovo run partito da quel commit, grazie a `[skip ci]`. Controlla in *Actions* che non ci sia un
   secondo *Social render* con quel commit.
6. L'agente di pubblicazione trova il video in `catalog.publishing.ready`, come oggi.

## 9. Errori e recupero

| Sintomo | Causa probabile | Cosa fare |
|---|---|---|
| *Mint State Bot token* rosso | Client ID / chiave / installazione / permesso | §6.6; nessun dato perso |
| `push rifiutato da una regola del repository` | Ruleset attivo senza l'app in bypass | Aggiungi l'app al bypass di `main-pr`, o disattiva il ruleset; poi recupero |
| `push non autorizzato` | Token scaduto o permesso mancante | §6.6, poi recupero |
| `Prepare` rosso: "conflitto reale" | Lo stesso campo di `history.json` cambiato da render e publication | Indagare: due workflow hanno scritto lo stesso campo. Correggere su main con una PR, poi recupero |
| `State persisted` rosso dopo due `conflict` | Main cambiato due volte di fila (raro) | Recupero |
| *Prepare* rosso: "base non è un antenato di main" | Storia riscritta su main (con il Livello A impossibile) | Indagare prima di tutto |
| *Export state bundle* rosso nel job di render/apply | Un file di stato fuori allowlist o non valido (nome, JSON, dimensione > 32 MB) | Non esiste un bundle da recuperare: il run è rosso e il lavoro si ripete al run successivo (la coda e le receipt restano dove sono). Correggere la causa con una PR |
| *Check inputs* rosso: "run non ammesso" | Recupero chiesto per un run che non è di `social-render.yml` / `social-publication-state.yml` su main | Usare il run giusto (quello indicato da **State persisted**) |

**Recupero** (nessun dato perso: le receipt restano in `publication/pending/`, la coda in `content/queue/`, il
bundle grezzo nell'artifact per 7 giorni):
1. **Actions** → **Social state persist** → **Run workflow**, branch **main**;
2. *check-only* ✗, *profile* = `render` o `publication`, *raw-artifact* e *raw-run-id* come indicati
   nell'errore del job **State persisted**.

Il recupero accetta solo bundle prodotti da un run di *Social render* / *Social publication state* **su main**
(controllo via API + manifest): chi ha accesso in scrittura non può far spingere all'app un artifact preparato in un
proprio run. In alternativa, *Re-run failed jobs* sul run originale; non è verificato se GitHub ripete solo il job
fallito o l'intero workflow chiamato. Per le receipt basta anche rilanciare *Social publication state*: quelle in
`pending/` vengono riapplicate.

## 10. Attivazione successiva del ruleset `main-pr` (🧭, step E)

Solo quando *Social render* **e** *Social publication state* hanno persistito via app senza errori per qualche
giorno. La guida completa è in SEC-01 §9, passo 7.

Le opzioni:
- *Require a pull request before merging*, **0** approvazioni;
- *Require status checks* = `Site CI` (sorgente GitHub Actions);
- **Bypass list: solo `AniMapVerse State Bot`**, modalità *Always*;
- **nessun** bypass per il ruolo admin e **nessun** bypass generico per "GitHub Actions".

Va attivato poco prima del ciclo delle 06:00 UTC, osservando il run. Rollback: *Enforcement → Disabled*.

## 11. Rotazione, revoca e rollback

**Rotazione della chiave**, senza interruzioni (un'app può avere più chiavi attive):
1. *Generate a private key*;
2. aggiorna il secret `STATE_BOT_PRIVATE_KEY`;
3. lancia §6.6;
4. **Delete** della vecchia chiave nella pagina dell'app.

Rotazione consigliata ogni 6–12 mesi, o subito se il `.pem` è stato esposto.

**Revoca d'emergenza**:
- *Delete* della chiave (nessun nuovo token potrà essere coniato);
- e/o *Installed GitHub Apps* → **Suspend** o **Uninstall**.

I token già emessi scadono entro un'ora; quelli dei job vengono comunque revocati a fine job. Nel frattempo i
run di stato falliscono senza perdere nulla (§9).

**Rollback della migrazione**, nell'ordine:
1. se attivo, `main-pr` → **Disabled**;
2. revert della PR 3, poi della PR 2: si torna a `commit-state.sh` con `GITHUB_TOKEN`;
3. recupero degli eventuali bundle non salvati: dopo il revert, un run manuale del workflow interessato
   ripete il lavoro con il vecchio meccanismo.

`commit-state.sh` resta nel repository finché entrambe le migrazioni non sono collaudate.

**Rischi residui:**
- chi può cambiare `main` può cambiare `state-bundle.mjs` e i workflow (difesa: code-owner review su
  `tools/social-engine/` e `.github/`, SEC-01 passo 8);
- i job di lavoro eseguono ancora `npm ci` e Remotion: oggi un pacchetto compromesso potrebbe solo produrre
  uno stato falso **dentro l'allowlist** (niente codice, niente workflow), che poi passa dal merge driver e
  dalla macchina a stati;
- `history.json` e il catalogo sono riscritti per intero ogni volta, come oggi;
- se `main` cambia tre volte durante un persist, servono i due giri più un recupero manuale;
- `Site CI`, l'unico check obbligatorio previsto, non esegue i test di questo script: una PR che tocca solo
  `tools/social-engine/ci/` o `social-*.yml` è "social-only". I test girano in *Social validate*, che non è
  obbligatorio: per quei percorsi conta la code-owner review;
- `prepare-state.sh` legge main senza credenziali, il che funziona finché il repository è pubblico;
- un run rosso solo per **State persisted** ha `failed[]` vuoto in `render-summary.json`: il contratto dell'agente
  lo dice esplicitamente (PR 2).
