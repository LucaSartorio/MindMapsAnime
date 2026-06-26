import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Modal } from '@/components/common/Modal';
import { Button } from '@/components/common/Button';
import { animeWorlds } from '@/data/worlds';
import { useReportStore } from '@/store/useReportStore';

type ReportType = 'bug' | 'improvement';
type Status = 'idle' | 'submitting' | 'success' | 'error';

/** Categorie generiche dell'app per indirizzare la segnalazione. */
const CATEGORY_KEYS = [
  'map',
  'characters',
  'factions',
  'abilities',
  'arcs',
  'routes',
  'search',
  'sources',
  'ui',
  'other',
] as const;

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
// Access key Web3Forms: è pubblica per design (consente solo l'invio verso
// l'email del titolare, con protezione anti-spam) → ok averla nel client.
// Sovrascrivibile con VITE_WEB3FORMS_ACCESS_KEY se un giorno servisse.
const ACCESS_KEY =
  import.meta.env.VITE_WEB3FORMS_ACCESS_KEY ??
  'fcb04440-4ad1-4d79-a153-e0148cb1d5bb';

const inputClass =
  'w-full panel-soft px-3 py-2 text-sm text-ink-100 placeholder-ink-400 focus:border-chakra-500';
const labelClass = 'block text-xs font-medium text-ink-200 mb-1';

/**
 * Modale "Segnala un bug / Proponi una miglioria".
 *
 * Raccoglie dati personali facoltativi (nome, email) → richiede consenso
 * esplicito al trattamento (link alla privacy). L'invio usa Web3Forms, che
 * recapita la segnalazione via email al titolare (vedi VITE_WEB3FORMS_ACCESS_KEY).
 */
export function ReportModal() {
  const { t } = useTranslation();
  const isOpen = useReportStore((s) => s.isOpen);
  const close = useReportStore((s) => s.close);

  const [type, setType] = useState<ReportType>('bug');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [worlds, setWorlds] = useState<string[]>([]);
  const [category, setCategory] = useState<string>('map');
  const [description, setDescription] = useState('');
  const [consent, setConsent] = useState(false);
  const [botField, setBotField] = useState(''); // honeypot anti-spam
  const [status, setStatus] = useState<Status>('idle');
  const [errorMsg, setErrorMsg] = useState('');

  // Reset del form a ogni apertura.
  useEffect(() => {
    if (isOpen) {
      setType('bug');
      setName('');
      setEmail('');
      setWorlds([]);
      setCategory('map');
      setDescription('');
      setConsent(false);
      setBotField('');
      setStatus('idle');
      setErrorMsg('');
    }
  }, [isOpen]);

  const emailValid = email === '' || EMAIL_RE.test(email);
  const canSubmit =
    description.trim().length > 0 && consent && emailValid && status !== 'submitting';

  function toggleWorld(slug: string) {
    setWorlds((prev) =>
      prev.includes(slug) ? prev.filter((s) => s !== slug) : [...prev, slug],
    );
  }

  async function handleSubmit() {
    if (!canSubmit) return;
    // Honeypot: se compilato è un bot → fingi successo senza inviare.
    if (botField.trim() !== '') {
      setStatus('success');
      return;
    }
    if (!ACCESS_KEY) {
      setStatus('error');
      setErrorMsg(t('report.errorNoKey'));
      return;
    }

    const typeLabel = t(`report.types.${type}`);
    const categoryLabel = t(`report.categories.${category}`);
    const worldLabels =
      worlds
        .map((slug) => animeWorlds.find((w) => w.slug === slug)?.title ?? slug)
        .join(', ') || t('report.worldsNone');

    const payload: Record<string, string> = {
      access_key: ACCESS_KEY,
      subject: `[${typeLabel}] Mappe Interattive — ${categoryLabel}`,
      from_name: name.trim() || 'Mappe Interattive',
      [t('report.fields.type')]: typeLabel,
      [t('report.fields.name')]: name.trim() || '—',
      [t('report.fields.email')]: email.trim() || '—',
      [t('report.fields.worlds')]: worldLabels,
      [t('report.fields.category')]: categoryLabel,
      [t('report.fields.description')]: description.trim(),
      [t('report.fields.page')]: window.location.href,
    };
    if (email.trim()) payload.email = email.trim(); // reply-to

    setStatus('submitting');
    setErrorMsg('');
    try {
      const res = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify(payload),
      });
      const data = (await res.json()) as { success?: boolean; message?: string };
      if (res.ok && data.success) {
        setStatus('success');
      } else {
        setStatus('error');
        setErrorMsg(data.message || t('report.errorGeneric'));
      }
    } catch {
      setStatus('error');
      setErrorMsg(t('report.errorNetwork'));
    }
  }

  const footer =
    status === 'success' ? (
      <Button variant="primary" onClick={close}>
        {t('common.close')}
      </Button>
    ) : (
      <>
        <Button variant="ghost" onClick={close}>
          {t('report.cancel')}
        </Button>
        <Button
          variant={canSubmit ? 'primary' : 'disabled'}
          disabled={!canSubmit}
          onClick={handleSubmit}
        >
          {status === 'submitting' ? t('report.sending') : t('report.submit')}
        </Button>
      </>
    );

  return (
    <Modal
      open={isOpen}
      onClose={close}
      title={t('report.title')}
      eyebrow={t('report.eyebrow')}
      size="md"
      shareable={false}
      footer={footer}
    >
      {status === 'success' ? (
        <div className="py-6 text-center space-y-3">
          <div className="text-4xl" aria-hidden>
            ✓
          </div>
          <h3 className="font-display text-xl text-ink-100">
            {t('report.successTitle')}
          </h3>
          <p className="text-sm text-ink-300">{t('report.successBody')}</p>
        </div>
      ) : (
        <form
          className="space-y-4"
          onSubmit={(e) => {
            e.preventDefault();
            void handleSubmit();
          }}
        >
          {/* Tipo */}
          <div>
            <label htmlFor="report-type" className={labelClass}>
              {t('report.fields.type')} *
            </label>
            <select
              id="report-type"
              value={type}
              onChange={(e) => setType(e.target.value as ReportType)}
              className={inputClass}
            >
              <option value="bug">{t('report.types.bug')}</option>
              <option value="improvement">{t('report.types.improvement')}</option>
            </select>
          </div>

          {/* Nome + Email */}
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label htmlFor="report-name" className={labelClass}>
                {t('report.fields.name')}
              </label>
              <input
                id="report-name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                autoComplete="name"
                className={inputClass}
                placeholder={t('report.placeholders.name')}
              />
            </div>
            <div>
              <label htmlFor="report-email" className={labelClass}>
                {t('report.fields.email')}
              </label>
              <input
                id="report-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="email"
                aria-invalid={!emailValid}
                className={inputClass}
                placeholder={t('report.placeholders.email')}
              />
              {!emailValid && (
                <p className="mt-1 text-xs text-ember-300">
                  {t('report.errorEmail')}
                </p>
              )}
            </div>
          </div>

          {/* Mondi (multi) */}
          <fieldset>
            <legend className={labelClass}>{t('report.fields.worlds')}</legend>
            <div className="flex flex-wrap gap-2">
              {animeWorlds.map((w) => {
                const checked = worlds.includes(w.slug);
                return (
                  <label
                    key={w.slug}
                    className={`chip cursor-pointer select-none ${
                      checked ? 'border-chakra-500 text-chakra-100' : ''
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={checked}
                      onChange={() => toggleWorld(w.slug)}
                      className="sr-only"
                    />
                    {w.title}
                  </label>
                );
              })}
            </div>
          </fieldset>

          {/* Categoria */}
          <div>
            <label htmlFor="report-category" className={labelClass}>
              {t('report.fields.category')}
            </label>
            <select
              id="report-category"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className={inputClass}
            >
              {CATEGORY_KEYS.map((key) => (
                <option key={key} value={key}>
                  {t(`report.categories.${key}`)}
                </option>
              ))}
            </select>
          </div>

          {/* Descrizione */}
          <div>
            <label htmlFor="report-description" className={labelClass}>
              {t('report.fields.description')} *
            </label>
            <textarea
              id="report-description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={5}
              required
              className={`${inputClass} resize-y`}
              placeholder={t('report.placeholders.description')}
            />
          </div>

          {/* Honeypot anti-spam (nascosto agli utenti) */}
          <input
            type="text"
            tabIndex={-1}
            autoComplete="off"
            value={botField}
            onChange={(e) => setBotField(e.target.value)}
            className="hidden"
            aria-hidden
          />

          {/* Consenso privacy */}
          <label className="flex items-start gap-2 text-xs text-ink-300 cursor-pointer">
            <input
              type="checkbox"
              checked={consent}
              onChange={(e) => setConsent(e.target.checked)}
              className="mt-0.5 h-4 w-4 shrink-0 accent-chakra-500"
            />
            <span>
              {t('report.consent')}{' '}
              <Link to="/privacy" className="text-chakra-300 hover:underline">
                {t('report.consentLink')}
              </Link>
              . *
            </span>
          </label>

          {status === 'error' && (
            <p className="text-sm text-ember-300" role="alert">
              {errorMsg}
            </p>
          )}
        </form>
      )}
    </Modal>
  );
}
