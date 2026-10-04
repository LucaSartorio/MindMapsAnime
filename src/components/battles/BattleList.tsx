import type { ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import type { TimelineEvent, WorldDataset } from '@/types';
import { useLocaleStore } from '@/store/useLocaleStore';
import { getEntityDisplayName, getLocalizedText } from '@/utils/localization';
import { Badge } from '@/components/common/Badge';
import { battleRecord, characterBattles, type BattleResult } from '@/lib/battles';

const VARIANT: Record<BattleResult, 'success' | 'danger' | 'default' | 'warning'> = {
  win: 'success',
  loss: 'danger',
  draw: 'default',
  interrupted: 'warning',
};

/**
 * Gli scontri di un personaggio con il loro esito e il bilancio complessivo.
 * L'esito è sempre scritto (badge testuale), mai affidato solo al colore.
 * `renderEvent`/`renderName` decidono link (pagina SEO) o bottoni (scheda).
 */
export function BattleList({
  dataset,
  characterId,
  renderEvent,
  renderName,
}: {
  dataset: WorldDataset;
  characterId: string;
  renderEvent: (event: TimelineEvent, label: string) => ReactNode;
  renderName: (characterId: string, label: string) => ReactNode;
}) {
  const { t } = useTranslation();
  const locale = useLocaleStore((s) => s.locale);
  const battles = characterBattles(dataset, characterId);
  if (battles.length === 0) return null;
  const record = battleRecord(battles);
  const byId = new Map(dataset.characters.map((c) => [c.id, c]));
  const names = (ids: string[]) =>
    ids
      .filter((id) => byId.has(id))
      .map((id, i) => (
        <span key={id}>
          {i > 0 && ', '}
          {renderName(id, getEntityDisplayName(byId.get(id)!, locale))}
        </span>
      ));

  return (
    <div className="space-y-2">
      <p className="text-sm text-ink-200">{t('battles.record', record)}</p>
      <ol className="space-y-1.5">
        {battles.map((b) => (
          <li key={b.event.id} className="flex items-start gap-2 text-sm text-ink-200">
            <Badge variant={VARIANT[b.result]} className="shrink-0 mt-0.5">
              {t(`battles.${b.result}`)}
            </Badge>
            <span className="min-w-0">
              {renderEvent(b.event, getLocalizedText(b.event.title, locale))}
              {b.opponents.length > 0 && (
                <span className="text-ink-400">
                  {' '}
                  · {t('battles.vs')} {names(b.opponents)}
                </span>
              )}
              {b.allies.length > 0 && (
                <span className="text-ink-500">
                  {' '}
                  · {t('battles.with')} {names(b.allies)}
                </span>
              )}
            </span>
          </li>
        ))}
      </ol>
    </div>
  );
}

/** Esito di uno scontro in una riga ("Esito: vince X" / "Pareggio"), per la scheda evento. */
export function BattleOutcomeLine({
  dataset,
  event,
  renderName,
}: {
  dataset: WorldDataset;
  event: TimelineEvent;
  renderName: (characterId: string, label: string) => ReactNode;
}) {
  const { t } = useTranslation();
  const locale = useLocaleStore((s) => s.locale);
  const b = event.battle;
  if (!b) return null;
  const byId = new Map(dataset.characters.map((c) => [c.id, c]));
  const side = (ids: string[]) =>
    ids
      .filter((id) => byId.has(id))
      .map((id, i) => (
        <span key={id}>
          {i > 0 && ' & '}
          {renderName(id, getEntityDisplayName(byId.get(id)!, locale))}
        </span>
      ));
  return (
    <p className="text-sm text-ink-200">
      <strong className="text-ember-300">{t('battles.outcome')}:</strong>{' '}
      {b.winner !== undefined ? (
        <>
          {t('battles.wins')} {side(b.sides[b.winner])}
          <span className="text-ink-400">
            {' '}
            ({t('battles.vs')} {side(b.sides.filter((_, i) => i !== b.winner).flat())})
          </span>
        </>
      ) : (
        <>
          {t(`battles.${b.result === 'interrupted' ? 'interrupted' : 'draw'}`)}
          <span className="text-ink-400">
            {' '}
            ({b.sides.map((s, i) => (
              <span key={i}>
                {i > 0 && ` ${t('battles.vs')} `}
                {side(s)}
              </span>
            ))})
          </span>
        </>
      )}
      {b.note && <span className="text-ink-400"> — {getLocalizedText(b.note, locale)}</span>}
    </p>
  );
}
