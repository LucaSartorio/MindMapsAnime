import type { WorldDataset } from '@/types';
import { useNavigate } from 'react-router-dom';
import { Modal } from '@/components/common/Modal';
import { useTranslation } from 'react-i18next';
import { Badge } from '@/components/common/Badge';
import { Button } from '@/components/common/Button';
import { CanonPill, ReferencePill } from '@/components/common/StatusPill';
import { useUiStore } from '@/store';
import { useLocaleStore } from '@/store/useLocaleStore';
import { getLocalizedText } from '@/utils/localization';
import { findArc, findCharacter, findLocation } from '@/lib/entities';

interface StoryArcDetailsModalProps {
  dataset: WorldDataset;
  arcId: string;
}

export function StoryArcDetailsModal({
  dataset,
  arcId,
}: StoryArcDetailsModalProps) {
  const locale = useLocaleStore((s) => s.locale);
  const { t } = useTranslation();
  const arc = findArc(dataset, arcId);
  const close = useUiStore((s) => s.closeModal);
  const openLocation = useUiStore((s) => s.openLocationModal);
  const openCharacter = useUiStore((s) => s.openCharacterModal);
  const openEvent = useUiStore((s) => s.openEventModal);
  const openStory = useUiStore((s) => s.openStory);
  const navigate = useNavigate();

  if (!arc) {
    return (
      <Modal open onClose={close} title={t("modals.notFound")} size="sm">
        <p>{t("modals.invalidRef")}</p>
      </Modal>
    );
  }

  const locations = (arc.locationIds ?? [])
    .map((id) => findLocation(dataset, id))
    .filter((l): l is NonNullable<typeof l> => !!l);
  const characters = (arc.characterIds ?? [])
    .map((id) => findCharacter(dataset, id))
    .filter((c): c is NonNullable<typeof c> => !!c);
  const events = dataset.events
    .filter((e) => e.arcId === arc.id)
    .sort((a, b) => a.order - b.order);

  return (
    <Modal
      open
      onClose={close}
      eyebrow={arc.saga ? t('modals.saga', { saga: getLocalizedText(arc.saga, locale) }) : t('modals.storyArc')}
      title={getLocalizedText(arc.localizedName, locale) || arc.name}
      badges={
        <>
          <Badge>#{arc.order}</Badge>
          <CanonPill canon={arc.canon} />
          {arc.referenceStatus && <ReferencePill status={arc.referenceStatus} />}
          <Badge>{t("modals.eventCount", { count: events.length })}</Badge>
        </>
      }
      footer={
        <>
          {events.length > 0 && (
            <Button
              variant="ember"
              onClick={() => {
                openStory(arc.id);
                navigate(`/worlds/${dataset.world.slug}`);
              }}
            >
              ▶ {t('map.story.start')}
            </Button>
          )}
          <Button variant="primary" onClick={close}>
            {t('modals.close')}
          </Button>
        </>
      }
    >
      <p className="leading-relaxed">
        {getLocalizedText(arc.description, locale)}
      </p>

      {(arc.mangaChapters?.length || arc.animeEpisodes?.length) ? (
        <section>
          <h3 className="font-display text-[11px] uppercase tracking-widest text-chakra-300 mb-2">
            {t("modals.references")}
          </h3>
          {arc.mangaChapters?.length ? (
            <p className="text-ink-300">
              <strong>Manga:</strong> {arc.mangaChapters.join(', ')}
            </p>
          ) : null}
          {arc.animeEpisodes?.length ? (
            <p className="text-ink-300">
              <strong>Anime:</strong> {arc.animeEpisodes.join(', ')}
            </p>
          ) : null}
        </section>
      ) : (
        arc.referenceStatus !== 'verified' && (
          <div className="rounded-md border border-yellow-700/40 bg-yellow-900/20 px-3 py-2 text-xs text-yellow-200">
            {t('modals.needsVerification')}
          </div>
        )
      )}

      {locations.length > 0 && (
        <section>
          <h3 className="font-display text-[11px] uppercase tracking-widest text-chakra-300 mb-2">
            {t('modals.relatedLocations')}
          </h3>
          <div className="flex flex-wrap gap-1.5">
            {locations.map((l) => (
              <button
                key={l.id}
                type="button"
                onClick={() => openLocation(l.id)}
                className="chip hover:border-chakra-500/70 hover:text-white"
              >
                {getLocalizedText(l.localizedName, locale) || l.name}
              </button>
            ))}
          </div>
        </section>
      )}

      {characters.length > 0 && (
        <section>
          <h3 className="font-display text-[11px] uppercase tracking-widest text-chakra-300 mb-2">
            {t("modals.relatedCharacters")}
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

      {events.length > 0 && (
        <section>
          <h3 className="font-display text-[11px] uppercase tracking-widest text-chakra-300 mb-2">
            {t('modals.arcEvents')}
          </h3>
          <ol className="space-y-1.5">
            {events.map((e) => (
              <li key={e.id}>
                <button
                  type="button"
                  onClick={() => openEvent(e.id)}
                  className="text-left w-full panel-soft px-3 py-2 hover:border-chakra-500/60 flex items-center gap-2"
                >
                  <Badge>#{e.order}</Badge>
                  <span className="text-ink-100 text-sm flex-1 truncate">
                    {getLocalizedText(e.title, locale)}
                  </span>
                  <span className="text-[11px] text-ink-400">
                    {getLocalizedText(e.period, locale)}
                  </span>
                </button>
              </li>
            ))}
          </ol>
        </section>
      )}
    </Modal>
  );
}
