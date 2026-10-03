import type { ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import type { Tournament, TournamentMatch, TournamentSide, WorldDataset } from '@/types';
import { useLocaleStore } from '@/store/useLocaleStore';
import { getEntityDisplayName, getLocalizedText } from '@/utils/localization';

/**
 * Un torneo con il suo tabellone.
 *
 * - `format: 'bracket'` → tabellone a eliminazione diretta disegnato in SVG
 *   (colonne = turni, ogni incontro collegato a quello che alimenta). Lo SVG è
 *   decorativo per gli screen reader (`role="img"` + etichetta): il percorso
 *   accessibile, e quello con i link, è l'elenco degli incontri sotto.
 * - `format: 'rounds'` → solo l'elenco per turno (preliminari, prove a squadre).
 *
 * Puro e deterministico: identico su server e client (pagina pre-renderizzata).
 * `renderName` decide come mostrare un personaggio nell'elenco (link nella
 * pagina SEO, bottone che apre la scheda nell'app).
 */
export function TournamentView({
  dataset,
  tournament,
  renderName,
}: {
  dataset: WorldDataset;
  tournament: Tournament;
  renderName: (characterId: string, label: string) => ReactNode;
}) {
  const { t } = useTranslation();
  const locale = useLocaleStore((s) => s.locale);
  const byId = new Map(dataset.characters.map((c) => [c.id, c]));
  const charName = (id: string) => {
    const c = byId.get(id);
    return c ? getEntityDisplayName(c, locale) : t('tournaments.unknown');
  };
  const sideText = (side: TournamentSide) =>
    getLocalizedText(side.label, locale) || (side.characterIds ?? []).map(charName).join(' & ') || t('tournaments.unknown');
  const sideNode = (side: TournamentSide): ReactNode => {
    const label = getLocalizedText(side.label, locale);
    const ids = side.characterIds ?? [];
    if (ids.length === 0) return label || t('tournaments.unknown');
    const names = ids.map((id, i) => (
      <span key={id}>
        {i > 0 && ' & '}
        {renderName(id, charName(id))}
      </span>
    ));
    return label ? (
      <>
        {label} ({names})
      </>
    ) : (
      names
    );
  };
  const title = getLocalizedText(tournament.localizedName, locale) || tournament.name;
  const winners = (tournament.winnerIds ?? []).map((id) => ({ id, label: charName(id) }));

  return (
    <div className="space-y-3">
      <p className="text-sm leading-relaxed text-ink-200">{getLocalizedText(tournament.description, locale)}</p>
      {(winners.length > 0 || tournament.outcome) && (
        <p className="text-sm text-ink-200">
          <strong className="text-ember-300">
            {winners.length > 0 ? t('tournaments.winner') : t('tournaments.outcome')}:
          </strong>{' '}
          {winners.map((w, i) => (
            <span key={w.id}>
              {i > 0 && ' & '}
              {renderName(w.id, w.label)}
            </span>
          ))}
          {winners.length > 0 && tournament.outcome && ' — '}
          {getLocalizedText(tournament.outcome, locale)}
        </p>
      )}
      {(tournament.mangaChapters?.length || tournament.animeEpisodes?.length) && (
        <p className="text-xs text-ink-400">
          {tournament.mangaChapters?.length ? <>Manga: {tournament.mangaChapters.join(', ')}</> : null}
          {tournament.mangaChapters?.length && tournament.animeEpisodes?.length ? ' · ' : null}
          {tournament.animeEpisodes?.length ? <>Anime: {tournament.animeEpisodes.join(', ')}</> : null}
        </p>
      )}

      {tournament.format === 'bracket' && (
        <div className="overflow-x-auto rounded-lg border border-ink-700/60 bg-ink-950/60 p-2">
          <BracketSvg
            tournament={tournament}
            sideText={sideText}
            label={t('tournaments.bracketAria', { name: title })}
            championLabel={t('tournaments.champion')}
            roundName={(i) => getLocalizedText(tournament.rounds[i].name, locale)}
          />
        </div>
      )}

      <div className="space-y-2">
        {tournament.rounds.map((round, ri) => (
          <section key={ri} aria-label={getLocalizedText(round.name, locale)}>
            <h4 className="text-[11px] font-semibold uppercase tracking-wide text-ink-400">
              {getLocalizedText(round.name, locale)}
            </h4>
            <ol className="mt-1 space-y-1 text-sm text-ink-200">
              {round.matches.map((m, mi) => (
                <li key={mi} className="leading-relaxed">
                  <MatchLine
                    match={m}
                    sideNode={sideNode}
                    vs={t('tournaments.vs')}
                    wins={t('tournaments.wins')}
                    noWinner={t('tournaments.noWinner')}
                  />
                  {m.note && (
                    <span className="text-ink-400"> — {getLocalizedText(m.note, locale)}</span>
                  )}
                </li>
              ))}
            </ol>
          </section>
        ))}
      </div>
    </div>
  );
}

function MatchLine({
  match,
  sideNode,
  vs,
  wins,
  noWinner,
}: {
  match: TournamentMatch;
  sideNode: (s: TournamentSide) => ReactNode;
  vs: string;
  wins: string;
  noWinner: string;
}) {
  return (
    <>
      {match.sides.map((side, i) => (
        <span key={i}>
          {i > 0 && <span className="text-ink-500"> {vs} </span>}
          <span className={match.winner === i ? 'font-semibold text-ember-200' : undefined}>{sideNode(side)}</span>
        </span>
      ))}
      <span className="text-ink-400">
        {' · '}
        {match.winner !== undefined ? (
          <>
            {wins} {sideNode(match.sides[match.winner])}
          </>
        ) : (
          noWinner
        )}
      </span>
    </>
  );
}

/* ------------------------------------------------------------------ SVG */

const BOX_W = 176;
const ROW_H = 22;
const COL_GAP = 44;
const MATCH_GAP = 18;
const HEADER_H = 26;
const PAD = 10;
const MAX_CHARS = 24;

const clip = (s: string) => (s.length > MAX_CHARS ? `${s.slice(0, MAX_CHARS - 1)}…` : s);

/**
 * Tabellone a eliminazione diretta. Il turno 0 impila i suoi incontri; ogni
 * incontro dei turni successivi è centrato fra i due che lo alimentano
 * (2j e 2j+1), collegati da linee a gomito. Il vincitore della finale va nel
 * riquadro "Campione".
 */
function BracketSvg({
  tournament,
  sideText,
  label,
  championLabel,
  roundName,
}: {
  tournament: Tournament;
  sideText: (s: TournamentSide) => string;
  label: string;
  championLabel: string;
  roundName: (i: number) => string;
}) {
  const rounds = tournament.rounds;
  const boxH = 2 * ROW_H;
  const first = rounds[0]?.matches.length ?? 0;
  // Centro verticale di ogni incontro, turno per turno.
  const centers: number[][] = [
    Array.from({ length: first }, (_, i) => HEADER_H + PAD + i * (boxH + MATCH_GAP) + boxH / 2),
  ];
  for (let r = 1; r < rounds.length; r++) {
    const prev = centers[r - 1];
    centers.push(rounds[r].matches.map((_, j) => ((prev[2 * j] ?? 0) + (prev[2 * j + 1] ?? prev[2 * j] ?? 0)) / 2));
  }
  const colX = (r: number) => PAD + r * (BOX_W + COL_GAP);
  const last = rounds[rounds.length - 1];
  const final = last?.matches.length === 1 ? last.matches[0] : undefined;
  const champion = final && final.winner !== undefined ? sideText(final.sides[final.winner]) : undefined;
  const width = colX(rounds.length) + (champion ? BOX_W : 0) + PAD;
  const height = HEADER_H + PAD * 2 + first * (boxH + MATCH_GAP) - MATCH_GAP;

  return (
    <svg
      role="img"
      aria-label={label}
      viewBox={`0 0 ${width} ${height}`}
      width={width}
      height={height}
      className="block max-w-none font-sans"
    >
      {rounds.map((round, r) => (
        <g key={r}>
          <text x={colX(r) + BOX_W / 2} y={16} textAnchor="middle" className="fill-ink-400" fontSize={11} fontWeight={600}>
            {clip(roundName(r)).toUpperCase()}
          </text>
          {round.matches.map((m, j) => {
            const cy = centers[r][j];
            const x = colX(r);
            const y = cy - boxH / 2;
            return (
              <g key={j}>
                {/* Connettore verso l'incontro successivo. */}
                {r < rounds.length - 1 && (
                  <path
                    d={`M${x + BOX_W},${cy} H${x + BOX_W + COL_GAP / 2} V${centers[r + 1][Math.floor(j / 2)]} H${colX(r + 1)}`}
                    fill="none"
                    className="stroke-ink-600"
                    strokeWidth={1.5}
                  />
                )}
                {r === rounds.length - 1 && champion && (
                  <path d={`M${x + BOX_W},${cy} H${colX(r + 1)}`} fill="none" className="stroke-ember-500" strokeWidth={1.5} />
                )}
                <rect x={x} y={y} width={BOX_W} height={boxH} rx={6} className="fill-ink-900 stroke-ink-600" strokeWidth={1} />
                <line x1={x} x2={x + BOX_W} y1={cy} y2={cy} className="stroke-ink-700" strokeWidth={1} />
                {m.sides.slice(0, 2).map((side, i) => {
                  const won = m.winner === i;
                  const lost = m.winner !== undefined && !won;
                  return (
                    <g key={i}>
                      {won && <rect x={x + 1} y={y + 1 + i * ROW_H} width={4} height={ROW_H - 2} rx={2} className="fill-ember-500" />}
                      <text
                        x={x + 11}
                        y={y + i * ROW_H + ROW_H / 2 + 4}
                        fontSize={12}
                        fontWeight={won ? 700 : 400}
                        className={won ? 'fill-ember-100' : lost ? 'fill-ink-500' : 'fill-ink-200'}
                      >
                        {clip(sideText(side))}
                      </text>
                    </g>
                  );
                })}
              </g>
            );
          })}
        </g>
      ))}
      {champion && (
        <g>
          <text
            x={colX(rounds.length) + BOX_W / 2}
            y={16}
            textAnchor="middle"
            className="fill-ember-300"
            fontSize={11}
            fontWeight={600}
          >
            {championLabel.toUpperCase()}
          </text>
          <rect
            x={colX(rounds.length)}
            y={centers[rounds.length - 1][0] - ROW_H / 2 - 2}
            width={BOX_W}
            height={ROW_H + 4}
            rx={6}
            className="fill-ember-900 stroke-ember-500"
            strokeWidth={1.5}
          />
          <text
            x={colX(rounds.length) + BOX_W / 2}
            y={centers[rounds.length - 1][0] + 4}
            textAnchor="middle"
            fontSize={12}
            fontWeight={700}
            className="fill-ember-100"
          >
            ★ {clip(champion)}
          </text>
        </g>
      )}
    </svg>
  );
}
