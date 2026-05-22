import { useTranslation } from 'react-i18next';
import type { WorldDataset } from '@/types';
import { useLocaleStore } from '@/store/useLocaleStore';
import {
  getChakraNatureLabel,
  getJutsuTypeLabel,
  getLocalizedText,
} from '@/utils/localization';
import { Modal } from '@/components/common/Modal';
import { Badge } from '@/components/common/Badge';
import { Button } from '@/components/common/Button';
import { EntityImage } from '@/components/common/EntityImage';
import { ReferencePill } from '@/components/common/StatusPill';
import { useUiStore } from '@/store';
import { findCharacter, findFaction, findJutsu } from '@/lib/entities';

interface JutsuDetailsModalProps {
  dataset: WorldDataset;
  jutsuId: string;
}

export function JutsuDetailsModal({ dataset, jutsuId }: JutsuDetailsModalProps) {
  const locale = useLocaleStore((s) => s.locale);
  const { t } = useTranslation();
  const jutsu = findJutsu(dataset, jutsuId);
  const close = useUiStore((s) => s.closeModal);
  const openCharacter = useUiStore((s) => s.openCharacterModal);
  const openFaction = useUiStore((s) => s.openFactionModal);

  if (!jutsu) {
    return (
      <Modal open onClose={close} title={t('modals.notFound')} size="sm">
        <p>{t('modals.invalidRef')}</p>
      </Modal>
    );
  }

  const characters = (jutsu.characterIds ?? [])
    .map((id) => findCharacter(dataset, id))
    .filter((c): c is NonNullable<typeof c> => !!c);
  const clans = (jutsu.clanIds ?? [])
    .map((id) => findFaction(dataset, id))
    .filter((c): c is NonNullable<typeof c> => !!c);

  return (
    <Modal
      open
      onClose={close}
      media={
        <EntityImage
          kind="jutsu"
          id={jutsu.id}
          name={getLocalizedText(jutsu.localizedName, locale) || jutsu.name}
          chakraNature={jutsu.chakraNature?.[0]}
        />
      }
      eyebrow={t('modals.jutsu')}
      title={getLocalizedText(jutsu.localizedName, locale) || jutsu.name}
      badges={
        <>
          <Badge variant="accent">{getJutsuTypeLabel(jutsu.type, locale)}</Badge>
          {jutsu.rank && <Badge variant="ember">{t('jutsu.rankLabel', { rank: jutsu.rank })}</Badge>}
          {(jutsu.chakraNature ?? []).map((n) => (
            <Badge key={n} variant="danger">
              {getChakraNatureLabel(n, locale)}
            </Badge>
          ))}
          {jutsu.referenceStatus && (
            <ReferencePill status={jutsu.referenceStatus} />
          )}
        </>
      }
      footer={
        <Button variant="primary" onClick={close}>
          {t('modals.close')}
        </Button>
      }
    >
      {jutsu.japaneseName && (
        <p className="text-xs text-ink-300 italic -mt-2">{jutsu.japaneseName}</p>
      )}
      <p className="leading-relaxed">
        {getLocalizedText(jutsu.shortDescription, locale)}
      </p>
      {jutsu.longDescription && (
        <p className="text-ink-300 leading-relaxed">
          {getLocalizedText(jutsu.longDescription, locale)}
        </p>
      )}

      {(jutsu.chakraNature ?? []).length > 0 && (
        <Section title={t('modals.chakraNature')}>
          <div className="flex flex-wrap gap-1.5">
            {jutsu.chakraNature!.map((n) => (
              <Badge key={n} variant="danger">
                {getChakraNatureLabel(n, locale)}
              </Badge>
            ))}
          </div>
        </Section>
      )}

      {(jutsu.handSeals ?? []).length > 0 && (
        <Section title={t('modals.handSeals')}>
          <div className="flex flex-wrap items-center gap-1.5">
            {jutsu.handSeals!.map((seal, i) => (
              <span key={`${seal}-${i}`} className="inline-flex items-center gap-1.5">
                {i > 0 && <span aria-hidden className="text-ink-500">→</span>}
                <span className="chip text-xs">{seal}</span>
              </span>
            ))}
          </div>
        </Section>
      )}

      {(jutsu.classification ?? []).length > 0 && (
        <Section title={t('modals.classification')}>
          <div className="flex flex-wrap gap-1.5">
            {jutsu.classification!.map((c) => (
              <Badge key={c} className="capitalize">
                {c.replace(/_/g, ' ')}
              </Badge>
            ))}
          </div>
        </Section>
      )}

      {clans.length > 0 && (
        <Section title={t('modals.relatedClans')}>
          <div className="flex flex-wrap gap-1.5">
            {clans.map((c) => (
              <button
                key={c.id}
                type="button"
                onClick={() => openFaction(c.id)}
                className="chip-accent hover:border-chakra-300 hover:text-white"
              >
                {getLocalizedText(c.localizedName, locale) || c.name}
              </button>
            ))}
          </div>
        </Section>
      )}

      {characters.length > 0 && (
        <Section title={t('modals.usedBy')}>
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
        </Section>
      )}
    </Modal>
  );
}

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section>
      <h3 className="font-display text-[11px] uppercase tracking-widest text-chakra-300 mb-2">
        {title}
      </h3>
      {children}
    </section>
  );
}
