# SEO Recovery — calo organico del 26 ottobre 2026

Report versionato (28/11/2026). Metodo: dati storici forniti dal proprietario (Search Console, non presenti nel
repository) + verifiche deterministiche su git, build storiche ricostruite in `git worktree`, HTML di produzione
(campione di 13 URL) e documentazione Google Search Central. Ogni affermazione è marcata **verificato** (codice,
build, HTTP), **dato del proprietario** (GSC, da riconfermare) o **ipotesi**. Nessuna metrica GSC è stata stimata.

## 1. Executive summary

- Il crollo (impressioni −97,5 %, posizione media 11,1 → 55,1, indicizzate stabili) **non è stato causato da una
  modifica del sito**: il sorgente pubblicato era identico dal 22 al 27 ottobre (i deploy del 26 toccavano solo
  `tools/social-engine/`, che la build non legge). **Verificato.**
- Nessun aggiornamento Google annunciato il 26 ottobre (spam update 24/09–08/10, core update 10/11–24/11).
  **Verificato** su `status.search.google.com`.
- La versione attuale di `main` non ha regressioni rispetto a quella pre-crollo sugli stessi 16.103 URL:
  canonical, robots, title, H1, hreflang, dati strutturati e link invariati; cambiano solo le description (frasi
  intere, SEO-04) e 14 pagine diventano indicizzabili. **Verificato.**
- Causa più probabile: **rivalutazione a livello di sito dei sistemi di ranking di Google** dopo una crescita
  programmatica molto rapida: URL indicizzabili da **3.842 (30/09) a 13.812 (09/10)** in nove giorni (quattro mondi
  completi aggiunti il 2–3 ottobre, poi tutti gli 8 mondi in `/es` e `/fr`), contenuti e traduzioni generati con
  sessioni AI in pochi giorni, 722 pagine entità indicizzabili (× 4 lingue) con meno di 120 caratteri di testo
  proprio, solo ~38 % degli URL in sitemap indicizzati. **Altamente probabile, non dimostrabile senza i dati
  query × pagina.** Il picco del 6–25 ottobre era a sua volta recente: la baseline "pre-crollo" è di ~3 settimane.
- Interventi: gate anti-regressione permanente (baseline SEO bloccante in `seo:check`), analizzatore degli export
  Search Console, correzione dei dati di Fukasaku, agente/skill/regola SEO aggiornati, lista esplicita delle pagine
  da arricchire o (con approvazione) escludere. Nessun noindex, rewrite o redirect di massa applicato.
- Il recupero dipende da Google: le linee guida indicano che possono servire **mesi** perché i sistemi riconoscano
  un miglioramento del sito nel suo insieme. Nessuna promessa di ranking.

## 2. Root cause analysis

### Cronologia (date locali Europe/Rome; GSC usa l'ora del Pacifico, i commit sono +01/+02:00, Vercel UTC)

| Data | Evento | Effetto sul sito pubblicato |
| --- | --- | --- |
| 27/06 | Dominio canonico `animapverse.com` (certificati dal 26/06) | canonical sull'apex da allora |
| 30/09 | `feat(seo)`: architettura di indicizzazione scalabile | 3.842 URL indicizzabili (it+en, 5 mondi) |
| 02–03/10 | Bleach, Attack on Titan, Jujutsu Kaisen, Dragon Ball completi | 5.946 |
| 04/10 | tecniche, battaglie, percorsi derivati | 7.108 |
| 05/10 | tutti i mondi in `/es` | ~10.500 |
| 06/10 | inizio della "forte crescita" delle impressioni (`SEO-AUDIT.md`) | — |
| 08–09/10 | tutti i mondi in `/fr`; revisione canon Black Clover (sparisce il percorso derivato di Licht) | 13.812 |
| 19/10 | PR #246: hub Black Clover/AoT (landing, `/map`, indici) | 96 pagine hub cambiano title/description |
| 22/10 | Footer: link YouTube/Discord, `Organization.sameAs` | nessun effetto di indicizzazione |
| 23–27/10 | solo commit della pipeline social | **nessuno** (sorgente del sito identico) |
| 26/10 | crollo: impressioni giornaliere 18.573 → 316 (dato del proprietario) | — |
| 10–24/11 | November 2026 core update | successivo al crollo |
| 19/11 | GSC legge la sitemap: 13.812 URL = esattamente la build del 25/10 (verificato) | — |

### Classificazione delle cause candidate

| Causa | Esito | Evidenza | Confidenza |
| --- | --- | --- | --- |
| Deploy del 26/10 | **Smentita** | `git diff 89ab3ce 9876aa6 -- . ':!tools/social-engine'` vuoto; nessun file di `src/`, `scripts/`, `vite.config.ts` importa `tools/social-engine` | alta |
| PR #246 (19/10) | **Smentita come causa principale** | cambia solo 96 hub (landing/mappa/indici), non i template personaggi/abilità; il calo è uniforme (sito −97,5 %, `/characters/` −96,8 %, `/abilities/` −96,4 %) e arriva 7 giorni dopo | alta |
| Regressione tecnica attuale (noindex, canonical, hreflang, 404, robots, sitemap, rendering) | **Smentita** | build attuale: `seo:check` pulito; A/C identici sugli stessi URL; produzione = build (campione HTTP); SSR = DOM idratato | alta |
| Aggiornamento Google annunciato | **Smentita** per il 26/10 | `incidents.json`: nessun evento attivo il 26/10 | alta |
| Penalizzazione manuale | **Smentita** | nessuna azione manuale (dato del proprietario) | alta |
| Rivalutazione algoritmica di qualità del sito (sistemi di ranking continui, inclusi i segnali su contenuti scalati) | **Altamente probabile** | calo istantaneo e uniforme della posizione con indicizzazione stabile (forma "algorithmic, site-wide" della guida Google); crescita 3,6× in 9 giorni; 62 % degli URL in sitemap mai indicizzati ("rilevate, non indicizzate" 8.530); contenuti e traduzioni AI su larga scala; pagine sottili | media — serve il dettaglio GSC |
| Cambio di proprietà/host in Search Console | **Non verificabile** | `mind-maps-anime.vercel.app` risponde 308 → `animapverse.com` (impostazione Vercel, non nel repo; data sconosciuta). Se i numeri vengono dalla proprietà vercel.app, parte del calo è uno spostamento di proprietà; la canonical punta all'apex da giugno, quindi è improbabile come causa unica | — |
| Calo di domanda | **Smentita come causa principale** (Trends non consultato) | un −98 % in un giorno, su 9 franchise e 4 lingue, non è un effetto di domanda | alta |
| Anomalia di reporting GSC | **Possibile per il 23/11**, non per il 26/10 | "rilevate non indicizzate" 8.530 → 0 con indicizzate +75: ricalcolo del report, non indicizzazione | media |

Citazioni (Search Central, verificate il 28/11/2026): "*using generative AI tools or other similar tools to generate
many pages without adding value for users may violate Google's spam policy on scaled content abuse*" (using-gen-ai-content);
"*it could take several months for our systems to learn and confirm that the site as a whole is now producing
helpful, reliable, people-first content*" (core-updates); la guida ai cali distingue "*Large drop from an
algorithmic update, site-wide security or spam issue*" da problemi tecnici e glitch di reporting.

## 3. Evidenze tecniche raccolte

| Controllo | A: 25/10 (`89ab3ce`) | C: `main` 28/11 |
| --- | --- | --- |
| Pagine generate · indicizzabili · in sitemap | 16.102 · 13.812 · 13.812 | 16.700 · 14.348 · 14.348 (+ Fullmetal Alchemist) |
| Per lingua (indicizzabili) | 3.453 × 4 | 3.587 × 4 |
| noindex per motivo (per lingua it/en) | thin 469, legal 2, coming soon 5 | thin 479, legal 2, coming soon 4 |
| Canonicalizzate altrove (percorsi derivati) | 396 | 420 |
| Stessi URL (16.103): title / canonical / robots / H1 cambiati | — | 0 / 0 / 14 (→ index) / 2 (FMA pubblicato) |
| Description cambiate | — | 11.993 (frasi intere invece di tagli a metà frase) |
| Link interni verificati | 739.852 | 766.008 |

- **Scansione/indicizzazione**: robots.txt non blocca contenuti; nessun `X-Robots-Tag`; 404 reali con `noindex`
  (`/en/black-clover/journeys/licht-journey`, URL inventati); query string → canonical senza query; nessun
  redirect a catena (`vercel.json` + 12 redirect di slug). Tutti i noindex hanno un motivo (`noindexReason`):
  i 565 "esclusi da noindex" di GSC sono un sottoinsieme dei ~1.930 noindex intenzionali (thin, legali, in arrivo).
- **Sitemap**: solo URL indicizzabili, canonici, unici, senza `lastmod` (nessuna data per URL affidabile).
- **Rendering** (Chromium, UA Googlebot mobile): HTML SSR e DOM idratato con gli stessi H1, metadati e link, zero
  errori console. Gli indici archivio usano `content-visibility: auto` (da giugno): il testo resta nel DOM.
  La guida di `/map` è un `<details>` chiuso ma presente nel DOM (scelta documentata).
- **Hreflang**: reciproci, solo fra versioni indicizzabili, `x-default`, `<html lang>` corretto (`seo:check`).
- **Dati strutturati**: BreadcrumbList + WebPage/CollectionPage su ogni pagina, Organization/WebSite in home;
  invariati fra A e C; ora validati anche nelle posizioni e nelle destinazioni.
- **Link interni**: nessuna pagina indicizzabile orfana; tutte entro 3 clic dalla home della lingua; mediana dei
  link contestuali in ingresso: personaggi 8, luoghi 37, abilità 3.
- **Host**: `www.animapverse.com` → apex con **307** (temporaneo, impostazione del dominio su Vercel).

## 4. Qualità dei contenuti

Misura deterministica su `dist/` (testo in `<main>` senza nav/footer; blocchi presenti su ≤ 3 pagine = testo
proprio) e sui dati (`entityQuality`: testo dell'entità + relazioni nel grafo), senza inviare pagine a modelli.

| Tipo (/en, indicizzabili) | Pagine | Testo proprio mediano (caratteri) | < 120 car. di testo dell'entità |
| --- | ---: | ---: | ---: |
| Personaggi | 1.417 | 248 | 272 |
| Luoghi | 634 | 193 | 150 |
| Abilità | 766 | 202 | 157 |
| Fazioni | 310 | 212 | 57 |
| Percorsi | 156 | 209 | 44 |
| Archi | 204 | 441 | 30 |
| Regioni | 68 | 188 | 12 |

Classificazione: **A** (preservare) hub, mappe, archi e le ~2.700 entità con testo ≥ 120 caratteri; **B/C**
(migliorare/approfondire) le **687** entità con testo breve ma relazioni reali; **E** (candidate all'esclusione,
*solo dopo* un tentativo di arricchimento) **35** entità con < 80 caratteri e ≤ 4 relazioni; **D** (consolidare) i
percorsi derivati sono già canonicalizzati sul personaggio. Lista completa:
[`docs/seo-recovery/thin-entity-pages-2026-11.csv`](seo-recovery/thin-entity-pages-2026-11.csv) (URL /en; la
decisione vale per le 4 lingue). Alcune candidate E sono entità cercate (es. *Hokage Monument*): vanno arricchite,
non escluse. Nessuna soglia di parole è un criterio assoluto e le soglie di `quality.ts` restano invariate.

Valore distintivo da rafforzare (già nei dati): mappe con luoghi reali, relazioni personaggio ↔ luogo ↔ evento ↔
arco, percorsi in ordine cronologico, battaglie e alberi genealogici. Le pagine sottili sono quelle in cui questi
collegamenti esistono ma il testo che li spiega manca.

## 5. Problemi trovati (P0–P3)

| P | Problema | Stato |
| --- | --- | --- |
| P0 | Scala dei contenuti programmatici superiore alla loro profondità (crescita 3,6× in 9 giorni; ~2.900 URL sottili) | **Strategia + lista**; richiede decisioni del proprietario (§11) |
| P1 | Nessun controllo contro regressioni o crescite di massa (categoria sparita, noindex/canonical in massa, template svuotati) | **Corretto**: baseline in `seo:check` |
| P1 | Mancano i dati GSC per confermare la causa e scegliere le pagine | **Azione del proprietario** (§11) + `npm run seo:gsc` pronto |
| P2 | Prima visita: l'LCP è il banner cookie, montato dopo l'idratazione (mobile limitato, produzione: Fukasaku 1,4–4,1 s, `/en/one-piece` ~6 s; contenuto dipinto a ~0,6 s) | **Corretto** in un commit separato (§7.1) |
| P2 | `www` → apex con 307 | **Azione del proprietario** (Vercel → Domains → redirect 308) |
| P2 | Strategia `/es` `/fr` (metà degli URL indicizzabili, traduzioni AI) | in attesa del segmento per lingua in GSC |
| P3 | Fukasaku segnato vivo (muore nell'assalto di Pain) | **Corretto** (`status: 'deceased'`) |
| P3 | 53 title lunghi in `/es` | preesistente, avviso |
| P3 | 450–600 KB di JS (brotli) per pagina entità: il dataset del mondo serve all'idratazione | da valutare in `/optimize-performance` |

## 6. Notifiche GSC

**Fukasaku — Soft 404.** La pagina risponde 200, è completa nell'HTML iniziale (H1, descrizione, fatti, 3
relazioni, 2 eventi, link), identica dopo l'idratazione, senza rendering intermittente: il template SSR non ha
ramificazioni client-only per il contenuto. Il test live positivo conferma che non è riproducibile. Causa
plausibile: testo proprio molto breve (125 caratteri) rispetto alla cornice del template. Unica correzione utile e
verificata: lo stato errato. Dopo il deploy: *Convalida correzione* nel report Soft 404 (o *Richiedi
indicizzazione* sull'URL); arricchire la scheda con `/enrich-anime-world` (fonti) è il rimedio vero. Lo stesso
rischio riguarda le 722 entità della lista.

**Licht — 404.** Il percorso derivato `licht-journey` è esistito dal 04/10 al 09/10 (commit `5732644`, revisione
canon: gli eventi di Licht non hanno più 3 luoghi distinti). Era una proiezione canonicalizzata su
`/characters/licht` (mai indicizzata in proprio); non è in sitemap né linkata (verificato). Lo slug resta
riservato nel lock. Il 404 è la risposta corretta per un contenuto rimosso; un redirect fra categorie non è
supportato dal sistema degli slug e non porterebbe valore misurabile. Nessuna azione.

**Report Esperienza e Miglioramenti.** HTTPS 23 → 19, Core Web Vitals e Breadcrumb in calo: i dati strutturati e
l'HTTPS sono invariati fra A e C (verificato), quindi il calo dei conteggi segue la minore quantità di URL con
traffico/campioni (CrUX raggruppa solo URL con visite), non un errore tecnico.

## 7. Correzioni implementate

| File | Modifica |
| --- | --- |
| `scripts/seo-baseline.ts` (nuovo) | snapshot per gruppo `lingua\|mondo\|tipo` e confronto con soglie (errori/avvisi/note) |
| `scripts/seo-baseline.json` (nuovo, generato) | baseline post-intervento (625 gruppi, 14.348 indicizzabili) |
| `scripts/seo-check.ts` | testo principale minimo, orfane, BreadcrumbList strutturato, confronto con la baseline, `--update-baseline` |
| `scripts/seo-gsc-report.ts` (nuovo) | analisi export GSC (it/en, confronto, righe API/BigQuery, query × pagina) |
| `scripts/test-seo.ts` | test della baseline e del parser GSC (27 test) |
| `package.json`, `CLAUDE.md` | `seo:baseline`, `seo:gsc` |
| `.claude/agents/seo-growth-engineer.md`, `.claude/skills/seo-opportunities/SKILL.md`, `.claude/rules/seo.md` | playbook dei cali, gate baseline, uso dell'analizzatore |
| `src/data/naruto/charactersBatch1.ts` | Fukasaku `deceased` |
| `docs/seo-recovery/thin-entity-pages-2026-11.csv` | lista per arricchimento / decisione |
| `scripts/a11y-contrast.mjs` | (commit separato) il campionamento dei pixel ignora l'anello/ombra degli overlay fissi che non contengono il testo: il fallimento "home + cookie banner @320" su `main` era l'anello di focus del banner, non lo sfondo del testo |

### 7.1 Banner cookie e LCP (commit separato, revertibile da solo)

Il banner era montato solo dopo l'idratazione (dataset del mondo incluso) e diventava l'elemento LCP delle prime
visite. Ora è nell'HTML pre-renderizzato; uno script di `<head>` (`index.html`, stesse regole di chiave, versione e
scadenza dello store, verificate in sandbox da `test-seo`) lo nasconde prima del primo paint se esiste un consenso
valido; SSR e primo render client restano identici, dopo l'idratazione decide lo store; il dialog preferenze resta
solo client; il link all'informativa usa la lingua dell'URL (`/en/cookie-policy`, prima `/cookie-policy` →
redirect verso `/it`). Consenso, focus, padding di scorrimento e ordine dell'onboarding invariati.

| Pagina (Moto G4, CPU 4×, 1,6 Mbps, `preview:static` senza compressione, mediana di 3) | LCP prima | LCP dopo |
| --- | ---: | ---: |
| `/en/naruto/characters/fukasaku` | 9.988 ms | 2.820 ms |
| `/en/one-piece` | 15.752 ms | 3.244 ms |
| `/en/one-piece/characters/monkey-d-luffy` · `/en/black-clover/abilities/anti-magic` · `/en` | 3.304 · 2.772 · 2.644 ms | 3.304 · 2.808 · 2.608 ms |

CLS ≤ 0,064 ovunque (invariato entro il rumore). Su `/en/one-piece/map` l'LCP resta l'immagine della mappa (scelta
progettuale, precaricata) e sull'indice da 863 KB `/it/naruto/characters` il banner arriva in fondo all'HTML non
compresso del server locale: in produzione la pagina pesa 60 KB (brotli). Visitatore di ritorno: banner nascosto
prima dell'idratazione (nessun flash) e rimosso dopo. Rollback: revert del solo commit del banner.

Ogni nuovo controllo è stato provato contro la regressione che deve bloccare (noindex su 300 personaggi Naruto,
`<main>` svuotato, posizione del breadcrumb errata, link rimossi verso una pagina): tutti falliscono come atteso.

## 8. Risultati dei test

Vedi la sezione *Validazione* della PR (comandi e risultati reali). Riepilogo: `validate:data`, `validate:i18n`,
`test:seo` (27), `build` completo con `seo:check` e baseline, `smoke`, `claude:validate`, `social:validate`.

## 9. Confronto prima/dopo

L'unica variazione dell'HTML pubblicato introdotta da questo intervento è lo stato di Fukasaku (4 pagine). Il
confronto A (25/10) ↔ C (`main`) è nella §3.

## 10. Problemi aperti

- Conferma della causa con i dati query × pagina (§11).
- Programma di arricchimento delle 722 entità (per priorità GSC), decisione sulle 35 candidate E, strategia es/fr.
- `www` 307.

## 11. Azioni richieste al proprietario

1. **Proprietà**: indicare da quale proprietà vengono i dati (Dominio `animapverse.com` o prefisso
   `mind-maps-anime.vercel.app`) e da quando Vercel reindirizza `mind-maps-anime.vercel.app` → apex. Se i numeri
   sono della proprietà vercel.app, esportare anche quelli della proprietà Dominio.
2. **Export** (Prestazioni → Risultati di ricerca, Tipo: Web, *Confronta* 28/09–25/10/2026 vs 26/10–22/11/2026 →
   Esporta CSV): lo zip intero (Query, Pagine, Paesi, Dispositivi, Aspetto, Date). Poi Date: ultimi 16 mesi.
   Analisi: `npm run seo:gsc -- <cartella> --out report.md`. Se disponibile, API o BigQuery bulk export per
   query × pagina (`--split 2026-10-26`).
3. **Indicizzazione → Pagine**: esportare gli esempi di "Rilevata, non indicizzata", "Scansionata, non
   indicizzata", "Esclusa da noindex", "Soft 404", "Non trovata (404)". **Impostazioni → Statistiche di
   scansione**: richieste per risposta e per tipo, 01/10–28/11.
4. **Vercel → Domains**: `www.animapverse.com` con redirect permanente (308).
5. **Decisioni** (nessuna applicata): approvare il programma di arricchimento a campione (§12) e, solo dopo, le
   eventuali esclusioni dalla lista E; decidere la strategia `/es` `/fr` con il segmento per lingua.
6. Dopo il deploy: *Convalida correzione* sul Soft 404 di Fukasaku.

## 12. Piano di recupero e rollback

1. **Settimana 0** — deploy di questa PR; export GSC (§11); `seo:gsc` per confermare se la perdita è uniforme per
   template, lingua e mondo (segnale di sito) o concentrata (causa locale).
2. **Campione** — 20 entità con la maggiore perdita di impressioni, arricchite con fonti verificate
   (`/enrich-anime-world`, `anime-data-curator`; testo che spiega relazioni, luoghi ed eventi già nei dati, it/en +
   overlay es/fr), confrontate con 20 entità simili non toccate (gruppo di controllo) per 4–6 settimane.
3. **Estensione** — solo se il campione migliora rispetto al controllo; per lotti, con la baseline a segnalare le
   crescite. Le entità che restano sotto soglia dopo il tentativo → noindex con lista approvata.
4. **Nessuna nuova espansione di massa** (mondi o lingue interi in pochi giorni) finché i segnali non si stabilizzano;
   pubblicazione a lotti, ognuno con controllo di qualità.

Limiti noti della baseline (bloccano per scelta, si risolvono con `npm run seo:baseline` motivato nella PR): molte
entità brevi aggiunte a un gruppo esistente (mediana del testo −25 %), ≥ 20 nuove pagine noindex o canonicalizzate
in un gruppo. Conflitto di merge sul file: versione di `main`, build, `seo:baseline`.

Rollback: revert del commit. La baseline può bloccare una PR legittima: `npm run seo:baseline` + commit (diff
visibile in review); in caso di falso positivo sistematico si alzano le soglie in `scripts/seo-baseline.ts` (non i
controlli per pagina). Nessun cambiamento di URL, canonical, robots, sitemap o template da ripristinare.

## 13. Monitoraggio (7 · 14 · 30 · 60 · 90 giorni dal deploy)

Baseline storica 28/09–25/10/2026; baseline del calo 26/10–22/11/2026; post-intervento: 28 giorni dal deploy,
sempre confrontati a parità di giorni della settimana. Gruppo di controllo: sezioni meno colpite in `seo:gsc` e le
entità non arricchite del campione.

| Metrica | Fonte | 7 g | 14 g | 30 g | 60 g | 90 g |
| --- | --- | --- | --- | --- | --- | --- |
| Clic, impressioni, CTR, posizione (sito, per template, per lingua) | GSC Prestazioni → `seo:gsc` | ● | ● | ● | ● | ● |
| Query in top 3 / 10 / 20; query storiche (prime 100 del periodo pre-crollo) | `seo:gsc` (fasce) | | ● | ● | ● | ● |
| Campione arricchito vs controllo | `seo:gsc` filtrato sugli URL | | ● | ● | ● | ● |
| Pagine indicizzate vs URL in sitemap (14.348) | GSC Pagine / Sitemap | ● | ● | ● | ● | ● |
| Soft 404, 404, canonical scelte da Google diverse | GSC Pagine, Controllo URL | ● | ● | ● | ● | ● |
| Errori di scansione e host | GSC Statistiche di scansione | ● | | ● | | ● |
| Core Web Vitals (campo, mobile) | GSC CWV, Vercel Speed Insights | | | ● | ● | ● |
| Regressioni tecniche | `seo:check` + baseline a ogni PR | continuo | | | | |

Decisioni a 30 e 90 giorni, non a 7 (riscansione e test di Google). Un core update durante la finestra va annotato
e il confronto ripetuto dopo la sua fine.
