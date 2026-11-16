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

## 5. Fuori da questa proposta

Ruleset per tag/release, impostazioni Actions (SEC-01 passo 2), collaboratori e token (passi 3-4): restano come
descritti in SEC-01 §12, decisioni del proprietario.
