# SEC-02 — Protezione di `main`: stato verificato e proposta di attivazione

Seguito di `docs/SECURITY_SEC-01.md` (piano completo, passi 1-8) dopo la migrazione al State Bot
(`docs/SOCIAL_STATE_BOT.md`) e l'introduzione del sistema Claude Code (`docs/CLAUDE_DEVELOPMENT_SYSTEM.md`).
**Questo documento è una proposta: nessun ruleset, permesso o impostazione GitHub è stato modificato.**

## 1. Stato verificato (2026-11-16, API pubblica GitHub, sola lettura)

| Controllo | Risultato |
|---|---|
| `GET /repos/LucaSartorio/MindMapsAnime/branches/main` | `protected: false`, `protection.enabled: false`, nessun check richiesto |
| `GET /repos/…/rulesets` · `GET /repos/…/rules/branches/main` | `[]` · `[]`: **nessun ruleset attivo** |
| Commit di stato su `main` | autore `animapverse-state-bot[bot]` (es. `dc0edc8`, `c482b4c`, `652db9b`): **State Bot in produzione** (passo 5 di SEC-01 completato) |
| PR quotidiane degli agenti | aperte e mergiate con l'identità `LucaSartorio` dopo i check (es. #318, #319) |
| PR di Claude Code | push su branch `claude/*`, PR come `LucaSartorio` (#320) |

**Ri-verifica 2026-11-18** (stessa API pubblica, sola lettura; nessuna modifica): `main` ancora `protected: false`,
`required_status_checks.enforcement_level: off`; `rulesets` e `rules/branches/main` ancora `[]`. Dal 2026-11-13 tutti
i commit di stato su `main` sono di `animapverse-state-bot[bot]` (2 al giorno, l'ultimo `96c28a4`); i commit
`github-actions[bot]` si fermano al 2026-11-12. *Social render* e *Social publication state*: `success` negli ultimi 8
run (11-11 → 11-18); *Site CI*: `success` sulle ultime 8 PR (social e `claude/*`). Nel first-parent di `main` dal
2026-10-15 ogni commit non-bot arriva da una PR (anche `3011e1c`, senza numero nel titolo: è la PR #329): la fase B
non romperebbe flussi esistenti. Non verificabili senza accesso autenticato: la variabile `STATE_BOT_LOGIN`, il job
*State Bot credentials (dry run)*, i permessi dell'installazione dell'App.

Conseguenza: oggi chiunque agisca come proprietario (tu, gli agenti ChatGPT, Claude) **può** fare push diretto, force
push o cancellare `main`. Gli hook di `.claude/` lo impediscono solo alle sessioni Claude Code che li caricano (non nei
thread Cloud di *Projects*, non via API GitHub/MCP): sono un guard-rail, non una protezione.

## 2. Cosa protegge cosa

| Rischio | Hook `.claude/` (sessione) | Ruleset (server GitHub) |
|---|---|---|
| Force push / cancellazione di `main` | sì, solo `git` nelle sessioni Claude Code | **sì, per ogni identità e strumento** (livello A) |
| Push diretto su `main` | sì, solo `git` nelle sessioni Claude Code | **sì** (livello B, "Require a pull request") |
| Merge di PR con build/config rotta | no | **sì** con `Site CI` obbligatorio (include `claude:validate`) |
| Modifica non revisionata di `.github/`, `.claude/`, social engine | no | solo con la code-owner review (livello C) |
| Merge via API/MCP da un agente | no (gli specialisti Claude non hanno più tool MCP di scrittura) | sì, check e PR obbligatori valgono anche via API |

## 3. Proposta

### Fase A — subito (SEC-01, passo 1): ruleset `main-baseline`
Settings → Rules → Rulesets → New branch ruleset: nome `main-baseline`, **Active**, target *default branch* (`main`),
bypass list **vuota**, regole **solo** ✔ *Restrict deletions* + ✔ *Block force pushes*.

Compatibilità: i commit del State Bot sono fast-forward (nessun force push) → nessun effetto sulle automazioni.
Rollback: *Enforcement status → Disabled*.

### Fase B — dopo i prerequisiti: ruleset `main-pr`
Regole: ✔ *Require a pull request before merging* con **0 approvazioni** e nessuna sotto-opzione; ✔ *Require status
checks to pass* → check **`Site CI`** (sorgente *GitHub Actions*), ✗ *Require branches to be up to date*.
**Bypass list: solo la GitHub App `AniMapVerse State Bot` (modalità *Always*). Nessun bypass per il ruolo admin.**

Prerequisiti da verificare (tutti in sola lettura o con `dry_run`):
1. *Social render* → *Run workflow* su `main` con `dry_run` spuntato: il job *State Bot credentials (dry run)* deve
   mostrare nel riepilogo **"State Bot credentials OK"**. Senza questo, con `main-pr` attivo i commit di stato verrebbero
   rifiutati e lo stato del social engine non sarebbe salvato.
2. La variabile di repository `STATE_BOT_LOGIN` coincide con l'autore dei commit di stato
   (`animapverse-state-bot[bot]`), così i workflow continuano a ignorare i propri push (nessun loop); lo controlla il
   job *Check STATE_BOT_LOGIN (repository variable)* di `social-state-persist.yml`.
3. Le PR degli agenti non usano `[skip ci]` (con `Site CI` obbligatorio resterebbero "Expected"): oggi non lo usano.
4. `Site CI` conclude sempre: ~15 s per le PR social (scope + `claude:validate`), build completa per le PR del sito.

Attivazione: poco prima del ciclo delle ~06:00 UTC; osserva PR coda/receipt mergiate, *Social render* e *Social
publication state* verdi, commit di stato su `main`, nessun rifiuto in *Rules → Insights*.
Rollback immediato: `main-pr` → *Disabled*, poi *Re-run* dei job di stato falliti.

Nota: il passo 6 di SEC-01 (identità separata per gli agenti) **non** è necessario per la fase B: con 0 approvazioni
le PR mergiate dal proprietario restano valide. È invece il prerequisito della fase C.

### Fase C — con decisione esplicita (SEC-01, passo 8): code-owner review
Solo dopo che agenti e Claude usano identità diverse dal proprietario (altrimenti le loro PR non sono approvabili).
`.github/CODEOWNERS` copre già `.github/`, `package*.json`, `CLAUDE.md`, `.claude/`, il classificatore CI,
`scripts/validate-claude-config.mjs`, `docs/SOCIAL_*.md`, `docs/SECURITY_*.md` e il social engine (eccetto i JSON
quotidiani degli agenti).

## 4. Verifica dopo l'attivazione

```bash
curl -s https://api.github.com/repos/LucaSartorio/MindMapsAnime/rules/branches/main
```

Deve elencare `deletion` e `non_fast_forward` (fase A), poi `pull_request` e `required_status_checks` (fase B).

## 4-bis. Procedura operativa per il proprietario (aggiornata 2026-11-18)

| Passo | Fase A — `main-baseline` | Fase B — `main-pr` |
|---|---|---|
| Stato rilevato | nessuna protezione (§1) | idem; State Bot stabile da 6 giorni (§1) |
| Modifica | ruleset *Active* su `main`: *Restrict deletions* + *Block force pushes*, bypass vuoto | *Require a pull request* (0 approvazioni) + *Require status checks* = `Site CI` (GitHub Actions, senza "up to date"), bypass **solo** `AniMapVerse State Bot` (*Always*) |
| Prerequisiti | nessuno (i push del bot sono fast-forward) | i 4 di §3 fase B: dry run delle credenziali, `STATE_BOT_LOGIN` = `animapverse-state-bot[bot]`, nessun `[skip ci]` nelle PR, `Site CI` che conclude sempre |
| Operazione del proprietario | Settings → Rules → Rulesets → New branch ruleset | idem, poco prima del ciclo delle ~06:00 UTC |
| Verifica | `curl` di §4 → `deletion`, `non_fast_forward`; il ciclo social successivo resta verde | `curl` di §4 → anche `pull_request`, `required_status_checks`; nel ciclo successivo: commit `record rendered content` e `record publication state` del bot su `main`, PR coda/receipt mergiate, *Rules → Insights* senza rifiuti |
| Rollback | ruleset → *Enforcement status: Disabled* | `main-pr` → *Disabled*, poi *Re-run failed jobs* di *Social render* / *Social publication state* (lo stato non salvato viene ripersistito) |

Le sessioni Claude non eseguono nessuno di questi passi (`.claude/rules/security.md`): li applica il proprietario.

## 4-ter. Altri rilievi (2026-11-18)

- `social-validate.yml` e `social-publication-validate.yml` usano `actions/checkout@v4` e `actions/setup-node@v4`
  (tag mobile) invece degli SHA fissati del resto dei workflow. Sono job `pull_request` in sola lettura senza secret:
  rischio basso, ma una tag riscritta a monte eseguirebbe codice nuovo nella CI delle PR quotidiane. Proposta:
  fissare gli stessi SHA di `site-ci.yml` (`checkout@11d5960…` v4.4.0, `setup-node@49933ea…` v4.4.0) in una PR
  dedicata con review del proprietario, perché sono workflow delle automazioni social.
- `.gitignore` non escludeva `.env`/`.env.production`: corretto (`.env`, `.env.*`, eccetto `.env.example`).
- Un hook di sessione non impedisce a Claude di fare push su branch `social/*` (es. `d8b33c0` di Claude sul branch della PR #326). La
  protezione giusta resta organizzativa (CLAUDE.md: "never touch their branches") e, in fase C, la code-owner review.

## 5. Fuori da questa proposta

Ruleset per tag/release, impostazioni Actions (SEC-01 passo 2), collaboratori e token (passi 3-4): restano come
descritti in SEC-01 §12, decisioni del proprietario.
