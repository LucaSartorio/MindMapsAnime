import type { ReactNode } from 'react';
import type { Faction, FactionMember, WorldDataset } from '@/types';
import { useLocaleStore } from '@/store/useLocaleStore';
import { getEntityDisplayName, getLocalizedText } from '@/utils/localization';

/** Un membro: il nome (link o bottone via `renderName`) o l'etichetta, più il ruolo. */
function Member({
  dataset,
  member,
  renderName,
}: {
  dataset: WorldDataset;
  member: FactionMember;
  renderName: (characterId: string, label: string) => ReactNode;
}) {
  const locale = useLocaleStore((s) => s.locale);
  const c = member.characterId ? dataset.characters.find((x) => x.id === member.characterId) : undefined;
  const label = getLocalizedText(member.label, locale);
  return (
    <>
      {c ? renderName(c.id, label || getEntityDisplayName(c, locale)) : <span className="text-ink-100">{label}</span>}
      {member.role && <span className="text-ink-400"> · {getLocalizedText(member.role, locale)}</span>}
    </>
  );
}

/** Organigramma: i gruppi interni della fazione come riquadri. */
export function FactionGroups({
  dataset,
  faction,
  renderName,
}: {
  dataset: WorldDataset;
  faction: Faction;
  renderName: (characterId: string, label: string) => ReactNode;
}) {
  const locale = useLocaleStore((s) => s.locale);
  if (!faction.structure?.length) return null;
  return (
    <ul className="grid gap-2 sm:grid-cols-2">
      {faction.structure.map((g, gi) => (
        <li key={gi} className="panel-soft px-3 py-2">
          <p className="text-[11px] font-semibold uppercase tracking-wide text-chakra-300">
            {getLocalizedText(g.name, locale)}
          </p>
          <ul className="mt-1 space-y-0.5 text-sm text-ink-200">
            {g.members.map((m, mi) => (
              <li key={mi}>
                <Member dataset={dataset} member={m} renderName={renderName} />
              </li>
            ))}
          </ul>
          {g.note && <p className="mt-1 text-xs text-ink-400">{getLocalizedText(g.note, locale)}</p>}
        </li>
      ))}
    </ul>
  );
}

/** Successioni: ogni carica con i suoi titolari in ordine (1°, 2°, …). */
export function FactionSuccessions({
  dataset,
  faction,
  renderName,
}: {
  dataset: WorldDataset;
  faction: Faction;
  renderName: (characterId: string, label: string) => ReactNode;
}) {
  const locale = useLocaleStore((s) => s.locale);
  if (!faction.succession?.length) return null;
  return (
    <div className="space-y-3">
      {faction.succession.map((sc, si) => (
        <div key={si}>
          <p className="text-[11px] font-semibold uppercase tracking-wide text-ink-400">
            {getLocalizedText(sc.title, locale)}
          </p>
          <ol className="mt-1 flex flex-wrap items-center gap-1 text-sm text-ink-200">
            {sc.holders.map((h, hi) => (
              <li key={hi} className="flex items-center gap-1">
                {hi > 0 && (
                  <span aria-hidden className="text-ink-500">
                    →
                  </span>
                )}
                <span className="rounded-md border border-ink-700/60 bg-ink-900/70 px-2 py-0.5">
                  <span className="mr-1 font-mono text-[11px] text-ink-500">{hi + 1}.</span>
                  <Member dataset={dataset} member={h} renderName={renderName} />
                </span>
              </li>
            ))}
          </ol>
        </div>
      ))}
    </div>
  );
}
