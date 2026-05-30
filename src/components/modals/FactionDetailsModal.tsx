import type { WorldDataset } from '@/types';
import { Modal } from '@/components/common/Modal';
import { useTranslation } from 'react-i18next';
import { Badge } from '@/components/common/Badge';
import { Button } from '@/components/common/Button';
import { EntityImage } from '@/components/common/EntityImage';
import { ReferencePill } from '@/components/common/StatusPill';
import { useUiStore } from '@/store';
import { useLocaleStore } from '@/store/useLocaleStore';
import { getLocalizedText, getTechniqueTerm } from '@/utils/localization';
import {
  findCharacter,
  findFaction,
  findJutsu,
  findLocation,
} from '@/lib/entities';

interface FactionDetailsModalProps {
  dataset: WorldDataset;
  factionId: string;
}

export function FactionDetailsModal({
  dataset,
  factionId,
}: FactionDetailsModalProps) {
  const locale = useLocaleStore((s) => s.locale);
  const { t } = useTranslation();
  const faction = findFaction(dataset, factionId);
  const close = useUiStore((s) => s.closeModal);
  const openCharacter = useUiStore((s) => s.openCharacterModal);
  const openLocation = useUiStore((s) => s.openLocationModal);
  const openArc = useUiStore((s) => s.openArcModal);
  const openJutsu = useUiStore((s) => s.openJutsuModal);

  if (!faction) {
    return (
      <Modal open onClose={close} title={t("modals.notFound")} size="sm">
        <p>{t("modals.invalidRef")}</p>
      </Modal>
    );
  }

  const village = findLocation(dataset, faction.villageLocationId);
  const characters = (faction.characterIds ?? [])
    .map((id) => findCharacter(dataset, id))
    .filter((c): c is NonNullable<typeof c> => !!c);
  const locations = (faction.locationIds ?? [])
    .map((id) => findLocation(dataset, id))
    .filter((l): l is NonNullable<typeof l> => !!l);
  const arcs = (faction.arcIds ?? [])
    .map((id) => dataset.arcs.find((a) => a.id === id))
    .filter((a): a is NonNullable<typeof a> => !!a);
  const jutsu = (faction.jutsuIds ?? [])
    .map((id) => findJutsu(dataset, id))
    .filter((j): j is NonNullable<typeof j> => !!j);

  return (
    <Modal
      open
      onClose={close}
      media={
        <EntityImage
          kind="clan"
          id={faction.id}
          name={getLocalizedText(faction.localizedName, locale) || faction.name}
          villageId={faction.villageLocationId}
          fit="cover"
        />
      }
      eyebrow={`${faction.type.replace('_', ' ')}`}
      title={getLocalizedText(faction.localizedName, locale) || faction.name}
      badges={
        <>
          <Badge
            variant={
              faction.type === 'clan'
                ? 'accent'
                : faction.type === 'organization'
                  ? 'ember'
                  : 'default'
            }
            className="capitalize"
          >
            {faction.type}
          </Badge>
          {village && <Badge>{getLocalizedText(village.localizedName, locale) || village.name}</Badge>}
          {faction.kekkeiGenkai && (
            <Badge variant="danger">{faction.kekkeiGenkai}</Badge>
          )}
          {faction.referenceStatus && (
            <ReferencePill status={faction.referenceStatus} />
          )}
        </>
      }
      footer={
        <Button variant="primary" onClick={close}>
          {t('modals.close')}
        </Button>
      }
    >
      {faction.nameLocal && (
        <p className="text-xs text-ink-300 italic -mt-2">{faction.nameLocal}</p>
      )}
      <p className="leading-relaxed">
        {getLocalizedText(faction.description, locale)}
      </p>

      {(faction.signatureAbilities ?? []).length > 0 && (
        <section>
          <h3 className="font-display text-[11px] uppercase tracking-widest text-chakra-300 mb-2">
            Abilità principali
          </h3>
          <div className="flex flex-wrap gap-1.5">
            {faction.signatureAbilities!.map((a) => (
              <Badge key={a} variant="ember">
                {a}
              </Badge>
            ))}
          </div>
        </section>
      )}

      {jutsu.length > 0 && (
        <section>
          <h3 className="font-display text-[11px] uppercase tracking-widest text-chakra-300 mb-2">
            {t('modals.relatedJutsu', { term: getTechniqueTerm(dataset.world.slug, locale) })}
          </h3>
          <div className="flex flex-wrap gap-1.5">
            {jutsu.map((j) => (
              <button
                key={j.id}
                type="button"
                onClick={() => openJutsu(j.id)}
                className="chip hover:border-chakra-500/70 hover:text-white"
              >
                {getLocalizedText(j.localizedName, locale) || j.name}
              </button>
            ))}
          </div>
        </section>
      )}

      {characters.length > 0 && (
        <section>
          <h3 className="font-display text-[11px] uppercase tracking-widest text-chakra-300 mb-2">
            Personaggi principali
          </h3>
          <div className="flex flex-wrap gap-1.5">
            {characters.map((c) => (
              <button
                key={c.id}
                type="button"
                onClick={() => openCharacter(c.id)}
                className="chip hover:border-chakra-500/70 hover:text-white"
              >
                {c.name}
              </button>
            ))}
          </div>
        </section>
      )}

      {locations.length > 0 && (
        <section>
          <h3 className="font-display text-[11px] uppercase tracking-widest text-chakra-300 mb-2">
            Luoghi collegati
          </h3>
          <div className="flex flex-wrap gap-1.5">
            {locations.map((l) => (
              <button
                key={l.id}
                type="button"
                onClick={() => openLocation(l.id)}
                className="chip hover:border-chakra-500/70 hover:text-white"
              >
                {l.name}
              </button>
            ))}
          </div>
        </section>
      )}

      {arcs.length > 0 && (
        <section>
          <h3 className="font-display text-[11px] uppercase tracking-widest text-chakra-300 mb-2">
            Archi coinvolti
          </h3>
          <ul className="space-y-1.5">
            {arcs.map((a) => (
              <li key={a.id}>
                <button
                  type="button"
                  onClick={() => openArc(a.id)}
                  className="text-left text-ink-100 hover:text-chakra-200 inline-flex items-center gap-2"
                >
                  <span className="text-ember-400">◆</span>
                  {a.name}
                </button>
              </li>
            ))}
          </ul>
        </section>
      )}
    </Modal>
  );
}
