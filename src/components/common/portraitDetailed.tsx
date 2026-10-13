import type { ReactNode } from 'react';
import type { CharacterAppearance } from '@/types';
import { portraitColor, resolvePortrait, type ResolvedPortrait } from '@/lib/portrait';
import { shade } from '@/utils/entityImage';

/**
 * Ritratto DETTAGLIATO di un personaggio, in stile manga (quando `appearance.face`
 * è presente).
 *
 * Disegno proprio, ricostruito dalle descrizioni testuali dell'aspetto: volto con
 * mento a V, occhi grandi a ciglia spesse, ombreggiatura netta (cel shading: ombra
 * dei capelli sulla fronte, punte scure delle ciocche, ombra del mento sul collo),
 * abito, capigliatura (modello per `hairStyle` o sagoma scritta nei dati con
 * `hairFront`/`hairBack`) e segni distintivi. Nessuna immagine ufficiale è
 * scaricata o ricalcata.
 *
 * Coordinate nel `viewBox="0 0 100 100"`: cranio da y≈19, occhi a y=46 (x 42.8 e
 * 57.2), mento a y≈66, spalle da y≈72. Sinistra/destra = lato di chi guarda.
 */

const INK = '#16151c';
const WHITE = '#ffffff';
const SCAR = '#a34848';
const STRAW = '#f0c454';
const GOLD = '#e8c14a';
const BONE = '#ece5cf';
const EYE_L = 42.8;
const EYE_R = 57.2;
const EYE_Y = 46;

/* -------------------------------- Volti -------------------------------- */

const FACES: Record<string, string> = {
  male:
    'M33.5 39 C33.5 27.5 41 20.5 50 20.5 C59 20.5 66.5 27.5 66.5 39 L66.3 46 C66 52 63.5 57 59 61 ' +
    'L52.5 66.2 C51 67.2 49 67.2 47.5 66.2 L41 61 C36.5 57 34 52 33.7 46 Z',
  female:
    'M34 39 C34 27.5 41 21 50 21 C59 21 66 27.5 66 39 L65.8 45 C65.4 51 63 56 58.6 60 ' +
    'L52.6 64.4 C51 65.4 49 65.4 47.4 64.4 L41.4 60 C37 56 34.6 51 34.2 45 Z',
  round: 'M33 40 C33 27.5 41 20.5 50 20.5 C59 20.5 67 27.5 67 40 C67 53 60 65 50 65 C40 65 33 53 33 40 Z',
  square:
    'M33 39 C33 27 41 20 50 20 C59 20 67 27 67 39 L67 50 C67 57 63.5 61.5 58 64.5 L54 66.5 L46 66.5 ' +
    'L42 64.5 C36.5 61.5 33 57 33 50 Z',
  long:
    'M34.5 39 C34.5 26.5 41.5 19.5 50 19.5 C58.5 19.5 65.5 26.5 65.5 39 L65.3 49 C65 56 62 61.5 57.5 65.5 ' +
    'L52.4 69 C51 69.8 49 69.8 47.6 69 L42.5 65.5 C38 61.5 35 56 34.7 49 Z',
};

/* ------------------------------ Capelli ------------------------------ */

interface HairPaths {
  front?: string;
  back?: string;
}

/** Modelli di capigliatura disegnati per la testa del ritratto dettagliato. */
const HAIR: Record<string, HairPaths> = {
  short: {
    front:
      'M32.5 44 C30.5 31 38 18 50 18 C62 18 69.5 31 67.5 44 L66 40 L64.5 42 L63 35 L60 38 L57.5 33 L54.5 37 L51.5 33 ' +
      'L48.5 37 L45.5 33 L42.5 38 L40 34 L37 40 L35.5 37 L34 42 Z',
  },
  spiky: {
    front:
      'M30.5 46 L24 38 L31 37.5 L25.5 27 L34.5 30.5 L32 19 L41 25 L43 13 L49.5 22 L55 11.5 L58.5 22.5 L66 14 L65.5 26 ' +
      'L74 21 L69.5 31 L77 33 L70 39 L76 46 L68.5 44 L66 37 L62.5 40.5 L60.5 34 L57 39.5 L54.5 34 L51.5 40 L48.5 34.5 ' +
      'L45 41 L42.5 34.5 L39.5 40 L37 35.5 L34.5 41.5 L33 38 Z',
  },
  saiyan: {
    front:
      'M32 47 L25 44 L30 38 L21 30 L31 29 L24 16 L36 22 L37 9 L45 18 L50 5 L55 17 L64 8 L63 21 L75 15 L69 29 L79 30 ' +
      'L70 38 L75 44 L68 47 L66.5 38 L63 41 L61 33.5 L57.5 39 L56 32 L52.5 44 L50 34 L47 44 L44 32.5 L42.5 39 L39 33.5 ' +
      'L37 41 L33.5 38 Z',
  },
  messy: {
    front:
      'M32 46 C29 36 31 26 38 21.5 L36 16 L43 19 L46 12.5 L51 18 L57 13 L59 19.5 L66 17 L64.5 23.5 C69.5 28 70.5 37 68 46 ' +
      'L66.5 40 L64.5 43 L63 35.5 L59.5 39 L57.5 33.5 L54.5 39.5 L51.5 33.5 L48.5 40 L45.5 33.5 L42.5 39 L40 34.5 ' +
      'L37 41 L35.5 37 L33.5 43 Z',
  },
  swept: {
    back: 'M58 22 L77 14 L71 25 L83 26 L72 33 L81 39 L68 40 Z',
    front:
      'M32.5 50 C29.5 34 37 18 50 18 C63 18 70.5 34 67.5 50 L66 58 L64 46 L62.5 38 C60 34.5 57 33 53.5 33.5 L52 40 ' +
      'L50 34 L48 40 L46.5 33.5 C43 33 40 34.5 37.5 38 L36 46 L34 58 Z',
  },
  long: {
    back: 'M31 34 C27 52 29 70 26 92 L74 92 C71 70 73 52 69 34 C66 24 34 24 31 34 Z',
    front:
      'M33 46 C30.5 31 38 18.5 50 18.5 C62 18.5 69.5 31 67 46 C66 39 63.5 34.5 59 31.5 C56 31 52 32 50.5 34 ' +
      'C48 32 44 31 41 31.5 C36.5 34.5 34 39 33 46 Z M33.5 42 C31 54 32 64 30 74 L35 72 C35.5 62 35 52 36.5 44 Z ' +
      'M66.5 42 C69 54 68 64 70 74 L65 72 C64.5 62 65 52 63.5 44 Z',
  },
  long_spiky: {
    back:
      'M30 34 L20 46 L27 50 L17 62 L26 65 L19 80 L30 76 L28 92 L72 92 L70 76 L81 80 L74 65 L83 62 L73 50 L80 46 L70 34 ' +
      'C66 24 34 24 30 34 Z',
    front:
      'M32 46 C29.5 30 38 17.5 50 17.5 C62 17.5 70.5 30 68 46 L66.5 40 L64.5 43 L63 35 L59.5 38.5 L57 33 L53.5 39 ' +
      'L50.5 33.5 L47 39 L44 33 L41 38.5 L38 35 L36 42 L34 39 Z',
  },
  hime: {
    back: 'M31 34 C28 52 30 72 28 92 L72 92 C70 72 72 52 69 34 C66 24 34 24 31 34 Z',
    front:
      'M33 41 C31 28 39 18.5 50 18.5 C61 18.5 69 28 67 41 L67 40 L33 40 Z M32.6 38 H38.4 V74 H32.6 Z ' +
      'M61.6 38 H67.4 V74 H61.6 Z',
  },
  bob: {
    back: 'M31 34 C28.5 47 29.5 58 33 64.5 L67 64.5 C70.5 58 71.5 47 69 34 Z',
    front:
      'M32.5 46 C30.5 31 38 18.5 50 18.5 C62 18.5 69.5 31 67.5 46 L66.8 40 L64 41 L62.5 34.5 L58.5 38.5 L56.5 33 ' +
      'L52.5 38.5 L50 33 L47.5 38.5 L43.5 33 L41.5 38.5 L37.5 34.5 L36 41 L33.2 40 Z M32.6 40 C31 50 32 58 35 63 ' +
      'L38.5 60 C37 54 36.5 48 37 42 Z M67.4 40 C69 50 68 58 65 63 L61.5 60 C63 54 63.5 48 63 42 Z',
  },
  ponytail: {
    back: 'M58 21 C74 18 82 34 79 56 C77.6 66 73.6 74 71 78 C72 66 72 52 66.5 40 Z',
    front:
      'M33 44 C31 29.5 39 19 50 19 C61 19 69 29.5 67 44 L65.5 39.5 L63 41 L61.5 34.5 L57.5 37.5 L55.5 32.5 L51.5 37 ' +
      'L49.5 32.5 L46.5 37 L43.5 32.5 L41 37.5 L37.5 35 L36 41 L34.5 39 Z',
  },
  bun: {
    back: 'M42 15 a8.5 8.5 0 1 1 16 0 a8.5 8.5 0 1 1 -16 0 Z',
    front:
      'M33 44 C31 29.5 39 19 50 19 C61 19 69 29.5 67 44 L65.5 39.5 L63.5 41 L61.5 34.5 L58 38 L55.5 32.5 L52 37 ' +
      'L49.5 32.5 L46.5 37 L43.5 32.5 L41 37.5 L37.5 35 L36 41 L34.5 39 Z',
  },
  twin_tails: {
    back:
      'M36 24 C22 28 18 50 22 70 C23.5 78 26 84 28 88 C28 76 30 62 37 50 Z M64 24 C78 28 82 50 78 70 ' +
      'C76.5 78 74 84 72 88 C72 76 70 62 63 50 Z',
    front:
      'M33 44 C31 29.5 39 19 50 19 C61 19 69 29.5 67 44 L65.5 39.5 L63 41 L61.5 34.5 L57.5 37.5 L55.5 32.5 L51.5 37 ' +
      'L49.5 32.5 L46.5 37 L43.5 32.5 L41 37.5 L37.5 35 L36 41 L34.5 39 Z',
  },
  slick: {
    front: 'M33.5 42 C32 29 40 19 50 19 C60 19 68 29 66.5 42 C64 34 58 30.5 50 30.5 C42 30.5 36 34 33.5 42 Z',
  },
  buzz: {
    front:
      'M34.4 40 C33.5 28 41 21 50 21 C59 21 66.5 28 65.6 40 C62.5 34.5 57 32.5 50 32.5 C43 32.5 37.5 34.5 34.4 40 Z',
  },
  mohawk: { front: 'M45.5 33 L43 15 L50 7 L57 15 L54.5 33 Z' },
  afro: {
    back:
      'M27 40 a7 7 0 0 1 1 -12 a7 7 0 0 1 8 -9 a7 7 0 0 1 14 -5 a7 7 0 0 1 14 5 a7 7 0 0 1 8 9 a7 7 0 0 1 1 12 ' +
      'a7 7 0 0 1 -2 12 L29 52 a7 7 0 0 1 -2 -12 Z',
    front:
      'M33.5 40 a4 4 0 0 1 3 -7 a4 4 0 0 1 6 -4 a4 4 0 0 1 7.5 -1.5 a4 4 0 0 1 7.5 1.5 a4 4 0 0 1 6 4 a4 4 0 0 1 3 7 ' +
      'C63 35 57 33 50 33 C43 33 37 35 33.5 40 Z',
  },
  curly_long: {
    back:
      'M30 40 a6 6 0 0 1 2 -10 a6 6 0 0 1 8 -6 a6 6 0 0 1 10 -3 a6 6 0 0 1 10 3 a6 6 0 0 1 8 6 a6 6 0 0 1 2 10 ' +
      'a6 6 0 0 1 2 10 a6 6 0 0 1 0 10 a6 6 0 0 1 -2 10 a6 6 0 0 1 -6 6 L36 76 a6 6 0 0 1 -6 -6 a6 6 0 0 1 -2 -10 ' +
      'a6 6 0 0 1 0 -10 a6 6 0 0 1 2 -10 Z',
    front:
      'M34 38 a4 4 0 0 1 4 -7 a4 4 0 0 1 6 -3 a4 4 0 0 1 6 -1 a4 4 0 0 1 6 1 a4 4 0 0 1 6 3 a4 4 0 0 1 4 7 ' +
      'C62 34 56 32 50 32 C44 32 38 34 34 38 Z',
  },
  dome: {
    front: 'M33 47 C30 26 39 13 50 13 C61 13 70 26 67 47 C65 38 59 33 50 33 C41 33 35 38 33 47 Z',
  },
  crest: {
    back: 'M31 42 L25 18 L39 27 L50 6 L61 27 L75 18 L69 42 Z',
  },
  bald: {},
};

/* -------------------------------- Abiti -------------------------------- */

const TORSO = 'M7 100 C8 86 17 78 31 75 L42 72 L58 72 L69 75 C83 78 92 86 93 100 Z';
const LINE = { stroke: INK, strokeWidth: 1.1, strokeLinejoin: 'round' as const };

function Body({ a, p }: { a: CharacterAppearance; p: ResolvedPortrait }) {
  const c1 = p.outfit;
  const c2 = portraitColor(a.outfit2, '#f1f1f1');
  const c3 = portraitColor(a.outfit3, '#22232b');
  const skin = p.skin;
  const fold = shade(c1, -0.3);
  const folds = (
    <path d="M24 80 C27 88 28 94 27 100 M76 80 C73 88 72 94 73 100" stroke={fold} strokeWidth="1.1" fill="none" />
  );
  switch (a.clothes) {
    case 'shirtless':
      return (
        <>
          <path d={TORSO} fill={skin} {...LINE} />
          <path d="M36 86 C42 89 47 88 50 85 C53 88 58 89 64 86 M50 85 V100" stroke={shade(skin, -0.25)} strokeWidth="1" fill="none" />
        </>
      );
    // Gilet aperto sul petto nudo.
    case 'vest_open':
      return (
        <>
          <path d={TORSO} fill={skin} {...LINE} />
          <path d="M7 100 C8 86 17 78 31 75 L41 72.5 C39 82 37 92 36 100 Z" fill={c1} {...LINE} />
          <path d="M93 100 C92 86 83 78 69 75 L59 72.5 C61 82 63 92 64 100 Z" fill={c1} {...LINE} />
        </>
      );
    // Veste incrociata (kimono, vestaglia) aperta a V.
    case 'robe':
    case 'kimono':
      return (
        <>
          <path d={TORSO} fill={c1} {...LINE} />
          <path d="M42 72 L50 96 L58 72 Z" fill={a.outfit2 ? c2 : skin} {...LINE} />
          <path d="M42 72 L50 96 M58 72 L50 96" stroke={shade(c1, 0.22)} strokeWidth="2.6" />
          <path d="M42 72 L50 96 L58 72" fill="none" {...LINE} />
          {folds}
        </>
      );
    // Shihakushō (Bleach): kimono nero con sottoveste bianca a V; `haori` aggiunge la sopravveste (c1).
    case 'shihakusho':
    case 'haori':
      return (
        <>
          <path d={TORSO} fill={a.clothes === 'haori' ? c1 : '#1d1d24'} {...LINE} />
          {a.clothes === 'haori' && (
            <path d="M31 75 L42 72 L50 100 L28 100 C29 90 30 82 31 75 Z M69 75 L58 72 L50 100 L72 100 C71 90 70 82 69 75 Z" fill="#1d1d24" {...LINE} />
          )}
          <path d="M42 72 L50 92 L58 72 Z" fill={skin} {...LINE} />
          <path d="M42 72 L50 92 L45.4 72 Z M58 72 L50 92 L54.6 72 Z" fill="#f1f1f1" {...LINE} />
          {folds}
        </>
      );
    case 'tank':
      return (
        <>
          <path d={TORSO} fill={skin} {...LINE} />
          <path d="M27 100 C27 90 30 84 35 82 C40 86 60 86 65 82 C70 84 73 90 73 100 Z" fill={c1} {...LINE} />
          <path d="M35 82 L37 74 M65 82 L63 74" stroke={c1} strokeWidth="2.6" strokeLinecap="round" />
        </>
      );
    case 'dress':
      return (
        <>
          <path d={TORSO} fill={c1} {...LINE} />
          <path d="M38 73 C40 82 60 82 62 73 Z" fill={skin} {...LINE} />
          {folds}
        </>
      );
    case 'overalls':
      return (
        <>
          <path d={TORSO} fill={skin} {...LINE} />
          <path d="M33 100 L35 90 L65 90 L67 100 Z" fill={c1} {...LINE} />
          <path d="M31 75.5 L38 90 L43 90 L37 74 Z M69 75.5 L62 90 L57 90 L63 74 Z" fill={c1} {...LINE} />
          <circle cx="40.5" cy="88" r="1.3" fill={GOLD} stroke={INK} strokeWidth="0.5" />
          <circle cx="59.5" cy="88" r="1.3" fill={GOLD} stroke={INK} strokeWidth="0.5" />
        </>
      );
    // Completo: giacca (c1), camicia (c2), cravatta (c3).
    case 'suit':
      return (
        <>
          <path d={TORSO} fill={c1} {...LINE} />
          <path d="M42 72 L50 92 L58 72 Z" fill={c2} {...LINE} />
          <path d="M48.2 77 L51.8 77 L53 92 L50 96 L47 92 Z" fill={c3} {...LINE} />
          <path d="M47.6 73.5 L52.4 73.5 L51.8 77 L48.2 77 Z" fill={c3} {...LINE} />
          <path d="M42 72 L38 80 L45 82 L50 96 M58 72 L62 80 L55 82 L50 96" fill="none" {...LINE} />
          <path d="M43 72 L46 76 L50 74 L54 76 L57 72" fill={c2} {...LINE} />
        </>
      );
    // Cappotto con colletto rialzato.
    case 'coat':
      return (
        <>
          <path d={TORSO} fill={c1} {...LINE} />
          <path d="M42 72 L50 90 L58 72 Z" fill={c2} {...LINE} />
          <path d="M37 64 L42 72 L50 90 L39 79 Z M63 64 L58 72 L50 90 L61 79 Z" fill={shade(c1, 0.14)} {...LINE} />
          {folds}
        </>
      );
    // Collo alto che sale sul collo (Uchiha, Gaara); `uniform` aggiunge il bottone dorato (Jujutsu).
    case 'high_collar':
    case 'uniform':
      return (
        <>
          <path d={TORSO} fill={c1} {...LINE} />
          <path d="M41 62 C41 70 42 75 44 77 L56 77 C58 75 59 70 59 62 C55 64 45 64 41 62 Z" fill={shade(c1, 0.12)} {...LINE} />
          {a.clothes === 'uniform' && <circle cx="50" cy="71" r="1.8" fill={GOLD} stroke={INK} strokeWidth="0.6" />}
          <path d="M50 77 V100" stroke={fold} strokeWidth="1.1" />
          {folds}
        </>
      );
    // Mantello Akatsuki: nero, collo alto, nuvole rosse.
    case 'akatsuki':
      return (
        <>
          <path d={TORSO} fill="#1a1a22" {...LINE} />
          <path d="M39 60 C38 70 40 76 42 79 L58 79 C60 76 62 70 61 60 C56 63 44 63 39 60 Z" fill="#26262f" {...LINE} />
          <path d="M50 66 V100" stroke="#000" strokeWidth="1" />
          {[
            [24, 88],
            [74, 90],
          ].map(([x, y]) => (
            <path
              key={x}
              d={`M${x - 7} ${y} a3 3 0 0 1 3 -3.6 a3.4 3.4 0 0 1 6 -0.6 a3 3 0 0 1 4 4.2 Z`}
              fill="#c8303a"
              stroke="#f1f1f1"
              strokeWidth="0.9"
            />
          ))}
        </>
      );
    // Giubbotto da jōnin: gilet (c1) con colletto arrotolato su maglia scura (c2).
    case 'flak_vest':
      return (
        <>
          <path d={TORSO} fill={a.outfit2 ? c2 : '#2b3a6b'} {...LINE} />
          <path d="M18 100 C18 88 24 80 33 76 L40 74 L60 74 L67 76 C76 80 82 88 82 100 Z" fill={c1} {...LINE} />
          <path d="M38 73 C42 79 58 79 62 73 C60 70 40 70 38 73 Z" fill={shade(c1, 0.15)} {...LINE} />
          <path d="M50 79 V100 M38 86 h7 v6 h-7 Z M55 86 h7 v6 h-7 Z" fill="none" {...LINE} />
        </>
      );
    // Tuta da ninja con spalle scure (c2) e colletto bianco.
    case 'tracksuit':
      return (
        <>
          <path d={TORSO} fill={c1} {...LINE} />
          <path d="M7 100 C8 86 17 78 31 75 L39 73 C34 80 28 84 20 100 Z M93 100 C92 86 83 78 69 75 L61 73 C66 80 72 84 80 100 Z" fill={c2} {...LINE} />
          <path d="M40 71 C43 78 57 78 60 71 L58 76 C55 79 45 79 42 76 Z" fill="#f1f1f1" {...LINE} />
          <path d="M50 78 V100" stroke={INK} strokeWidth="1.1" />
        </>
      );
    // Dōgi delle arti marziali: casacca incrociata (c1) su maglia (c2).
    case 'gi':
      return (
        <>
          <path d={TORSO} fill={c1} {...LINE} />
          <path d="M40 72 L50 92 L60 72 Z" fill={c2} {...LINE} />
          <path d="M40 72 L50 92 L60 72" fill="none" stroke={shade(c1, -0.25)} strokeWidth="1.6" />
          {folds}
        </>
      );
    // Armatura Saiyan: tuta (c1), corazza (c2), spallacci (c3).
    case 'saiyan_armor':
      return (
        <>
          <path d={TORSO} fill={c1} {...LINE} />
          <path d="M26 100 L27 84 C33 80 42 80 50 82 C58 80 67 80 73 84 L74 100 Z" fill={c2} {...LINE} />
          <path d="M9 92 C10 82 18 76 30 76 C31 80 30 84 27 88 C20 88 14 90 9 92 Z M91 92 C90 82 82 76 70 76 C69 80 70 84 73 88 C80 88 86 90 91 92 Z" fill={c3} {...LINE} />
        </>
      );
    // Mantello bianco con spallacci (c2) su casacca (c1).
    case 'cape':
      return (
        <>
          <path d={TORSO} fill={c1} {...LINE} />
          <path d="M42 72 L50 90 L58 72 Z" fill={shade(c1, -0.2)} {...LINE} />
          <path d="M5 100 C5 86 10 78 22 74 C28 72 33 73 35 76 C30 84 26 92 24 100 Z M95 100 C95 86 90 78 78 74 C72 72 67 73 65 76 C70 84 74 92 76 100 Z" fill={c2} {...LINE} />
        </>
      );
    // Giacca corta (c1) su camicia (c2) con cinghie (Corpo di ricerca).
    case 'survey':
      return (
        <>
          <path d={TORSO} fill={c2} {...LINE} />
          <path d="M42 72 L50 80 L58 72 Z" fill={c2} {...LINE} />
          <path d="M9 100 C10 86 18 78 31 75 L42 72 L46 90 L36 92 L34 100 Z M91 100 C90 86 82 78 69 75 L58 72 L54 90 L64 92 L66 100 Z" fill={c1} {...LINE} />
          <path d="M40 92 L40 100 M60 92 L60 100 M36 94 H64" stroke="#3a2a1e" strokeWidth="2" />
        </>
      );
    // Giubbotto con zip.
    case 'jacket':
      return (
        <>
          <path d={TORSO} fill={c1} {...LINE} />
          <path d="M42 72 L50 82 L58 72 Z" fill={c2} {...LINE} />
          <path d="M40 70 L44 78 L50 82 L56 78 L60 70" fill="none" {...LINE} />
          <path d="M50 82 V100" stroke={INK} strokeWidth="1.1" />
          {folds}
        </>
      );
    // Felpa con cappuccio dietro il collo.
    case 'hoodie':
      return (
        <>
          <path d="M30 76 C30 66 38 62 50 62 C62 62 70 66 70 76 Z" fill={shade(c1, -0.15)} {...LINE} />
          <path d={TORSO} fill={c1} {...LINE} />
          <path d="M42 72 C44 77 56 77 58 72" fill={skin} {...LINE} />
          <path d="M46 77 V86 M54 77 V86" stroke={c2} strokeWidth="1.2" strokeLinecap="round" />
        </>
      );
    // Armatura a piastre (c1) con gorgiera (c2).
    case 'armor':
      return (
        <>
          <path d={TORSO} fill={c1} {...LINE} />
          <path d="M40 66 C40 72 42 75 44 77 L56 77 C58 75 60 72 60 66 C56 68 44 68 40 66 Z" fill={c2} {...LINE} />
          <path d="M9 92 C10 82 18 76 30 76 L32 90 C24 90 16 91 9 92 Z M91 92 C90 82 82 76 70 76 L68 90 C76 90 84 91 91 92 Z" fill={shade(c1, -0.15)} {...LINE} />
          <path d="M32 84 H68 M32 92 H68" stroke={INK} strokeWidth="1" />
        </>
      );
    // Mantello (c1) su veste (c2), fermaglio dorato.
    case 'cloak':
      return (
        <>
          <path d={TORSO} fill={c2} {...LINE} />
          <path d="M42 72 L50 84 L58 72 Z" fill={a.outfit3 ? c3 : skin} {...LINE} />
          <path d="M7 100 C8 86 17 78 31 75 L42 72 L44 100 Z M93 100 C92 86 83 78 69 75 L58 72 L56 100 Z" fill={c1} {...LINE} />
          <circle cx="50" cy="77" r="2" fill={GOLD} stroke={INK} strokeWidth="0.7" />
        </>
      );
    case 'tshirt':
    default:
      return (
        <>
          <path d={TORSO} fill={c1} {...LINE} />
          <path d="M42 72 C44 77 56 77 58 72" fill={skin} {...LINE} />
          {folds}
        </>
      );
  }
}

/* -------------------------------- Occhi -------------------------------- */

/** Iride col disegno dei dōjutsu (Sharingan, Rinnegan, Byakugan) o colore semplice. */
function Iris({ x, y, rx, ry, color }: { x: number; y: number; rx: number; ry: number; color: string }) {
  if (color === 'ripple')
    return (
      <g>
        <ellipse cx={x} cy={y} rx={rx} ry={ry} fill="#b6a6dc" />
        <g fill="none" stroke="#4a3a7a" strokeWidth="0.45">
          <ellipse cx={x} cy={y} rx={rx * 0.75} ry={ry * 0.75} />
          <ellipse cx={x} cy={y} rx={rx * 0.5} ry={ry * 0.5} />
          <ellipse cx={x} cy={y} rx={rx * 0.25} ry={ry * 0.25} />
        </g>
      </g>
    );
  if (color === 'sharingan')
    return (
      <g>
        <ellipse cx={x} cy={y} rx={rx} ry={ry} fill="#c8202a" />
        <ellipse cx={x} cy={y} rx={rx * 0.6} ry={ry * 0.6} fill="none" stroke="#3a0a0e" strokeWidth="0.35" />
        <circle cx={x} cy={y} r="0.9" fill={INK} />
        {[0, 120, 240].map((a) => {
          const r = (a * Math.PI) / 180;
          return <circle key={a} cx={x + Math.sin(r) * rx * 0.6} cy={y - Math.cos(r) * ry * 0.6} r="0.6" fill={INK} />;
        })}
      </g>
    );
  if (color === 'byakugan') return <ellipse cx={x} cy={y} rx={rx} ry={ry} fill="#e6e2f2" stroke="#b8b2cc" strokeWidth="0.4" />;
  const c = portraitColor(color, color);
  return (
    <g>
      <ellipse cx={x} cy={y} rx={rx} ry={ry} fill={c} />
      <path d={`M${x - rx} ${y - ry * 0.1} A${rx} ${ry} 0 0 1 ${x + rx} ${y - ry * 0.1} Z`} fill={shade(c, -0.45)} opacity="0.75" />
      <ellipse cx={x} cy={y + ry * 0.15} rx={rx * 0.42} ry={ry * 0.46} fill={INK} />
    </g>
  );
}

function Eye({ cx, style, color, side }: { cx: number; style: string; color: string; side: 'l' | 'r' }) {
  const cy = EYE_Y;
  const o = side === 'l' ? -1 : 1; // verso l'esterno del volto
  const hl = (x: number, y: number) => (
    <>
      <circle cx={x + 1.1} cy={y - 1.3} r="1.05" fill={WHITE} />
      <circle cx={x - 1} cy={y + 1.5} r="0.45" fill={WHITE} />
    </>
  );
  switch (style) {
    case 'hidden':
      return null;
    // Sclera nera con iride colorata (Hollow, demoni).
    case 'dark':
      return (
        <g>
          <path d={`M${cx - 4.6} ${cy + 0.6} C${cx - 4.4} ${cy - 3.8} ${cx + 4.4} ${cy - 3.8} ${cx + 4.6} ${cy + 0.6} C${cx + 3.8} ${cy + 3.4} ${cx - 3.8} ${cy + 3.4} ${cx - 4.6} ${cy + 0.6} Z`} fill={INK} />
          <circle cx={cx} cy={cy} r="2.3" fill={portraitColor(color, color)} />
          <circle cx={cx} cy={cy} r="0.9" fill={INK} />
        </g>
      );
    // Orbite vuote (Brook).
    case 'hollow':
      return <ellipse cx={cx} cy={cy} rx="4.6" ry="4.8" fill={INK} />;
    case 'closed':
      return (
        <path d={`M${cx - 4.6} ${cy + 0.4} Q${cx} ${cy + 2.6} ${cx + 4.6} ${cy + 0.4}`} fill="none" stroke={INK} strokeWidth="1.6" strokeLinecap="round" />
      );
    // Occhi chiusi "sorridenti" ad arco.
    case 'smile':
      return (
        <path d={`M${cx - 4.4} ${cy + 1.2} Q${cx} ${cy - 2.6} ${cx + 4.4} ${cy + 1.2}`} fill="none" stroke={INK} strokeWidth="1.6" strokeLinecap="round" />
      );
    // Taglio affilato: angolo esterno sollevato, palpebra spessa.
    case 'sharp': {
      const ix = cx - o * 4.6;
      const ox = cx + o * 5.2;
      return (
        <g>
          <path d={`M${ix} ${cy + 0.9} C${cx - o * 2} ${cy - 2.4} ${cx + o * 2.6} ${cy - 3} ${ox} ${cy - 1.8} C${cx + o * 3} ${cy + 2} ${cx - o * 2} ${cy + 2.6} ${ix} ${cy + 0.9} Z`} fill={WHITE} />
          <Iris x={cx + o * 0.4} y={cy - 0.1} rx={2.2} ry={2.5} color={color} />
          <circle cx={cx + o * 0.4 + 0.8} cy={cy - 1.1} r="0.7" fill={WHITE} />
          <path d={`M${ix - o * 0.4} ${cy + 1} C${cx - o * 2} ${cy - 2.8} ${cx + o * 2.6} ${cy - 3.4} ${ox + o * 0.6} ${cy - 2.2}`} fill="none" stroke={INK} strokeWidth="2" strokeLinecap="round" />
          <path d={`M${ox - o * 1.4} ${cy + 1.3} L${ox - o * 3.4} ${cy + 1.9}`} stroke={INK} strokeWidth="0.6" strokeLinecap="round" />
        </g>
      );
    }
    // Grandi, con ciglia (volti femminili).
    case 'big':
      return (
        <g>
          <path d={`M${cx - 4.6} ${cy - 0.6} C${cx - 4.4} ${cy - 5} ${cx + 4.4} ${cy - 5} ${cx + 4.6} ${cy - 0.6} C${cx + 4.4} ${cy + 3.6} ${cx - 4.4} ${cy + 3.6} ${cx - 4.6} ${cy - 0.6} Z`} fill={WHITE} />
          <Iris x={cx - o * 0.2} y={cy} rx={3.2} ry={4.2} color={color} />
          {hl(cx - o * 0.2, cy)}
          <path d={`M${cx - 5} ${cy - 0.4} C${cx - 4.6} ${cy - 5.4} ${cx + 4.6} ${cy - 5.4} ${cx + 5} ${cy - 0.4}`} fill="none" stroke={INK} strokeWidth="2.1" strokeLinecap="round" />
          <path d={`M${cx + o * 4.8} ${cy - 1.2} l${o * 1.8} -1.6 M${cx + o * 4.2} ${cy - 2.8} l${o * 1.6} -1.8`} stroke={INK} strokeWidth="1.2" strokeLinecap="round" />
          <path d={`M${cx - 3} ${cy + 3.4} Q${cx} ${cy + 4.4} ${cx + 3} ${cy + 3.4}`} fill="none" stroke={INK} strokeWidth="0.7" />
        </g>
      );
    // Piccoli con pupilla a punto (comici, anziani).
    case 'small':
      return (
        <g>
          <ellipse cx={cx} cy={cy} rx="4" ry="3.8" fill={WHITE} />
          <circle cx={cx} cy={cy + 0.3} r="1.5" fill={INK} />
          <path d={`M${cx - 4.4} ${cy - 0.8} C${cx - 3} ${cy - 4.4} ${cx + 3} ${cy - 4.4} ${cx + 4.4} ${cy - 0.8}`} fill="none" stroke={INK} strokeWidth="1.6" strokeLinecap="round" />
        </g>
      );
    // Socchiusi, palpebra bassa (annoiati, calmi).
    case 'narrow':
      return (
        <g>
          <path d={`M${cx - 4.8} ${cy + 0.6} Q${cx} ${cy - 1.6} ${cx + 4.8} ${cy + 0.6} Q${cx} ${cy + 2.4} ${cx - 4.8} ${cy + 0.6} Z`} fill={WHITE} />
          <Iris x={cx} y={cy + 0.8} rx={2} ry={1.8} color={color} />
          <path d={`M${cx - 5.2} ${cy + 0.6} Q${cx} ${cy - 2} ${cx + 5.2} ${cy + 0.6}`} fill="none" stroke={INK} strokeWidth="2" strokeLinecap="round" />
        </g>
      );
    // Tondi, grandi (protagonisti, ragazzi).
    case 'round':
    default:
      return (
        <g>
          <path d={`M${cx - 4.6} ${cy + 0.6} C${cx - 4.4} ${cy - 4.2} ${cx + 4.4} ${cy - 4.2} ${cx + 4.6} ${cy + 0.6} C${cx + 3.8} ${cy + 3.8} ${cx - 3.8} ${cy + 3.8} ${cx - 4.6} ${cy + 0.6} Z`} fill={WHITE} />
          <Iris x={cx - o * 0.3} y={cy + 0.2} rx={2.9} ry={3.5} color={color} />
          {hl(cx - o * 0.3, cy + 0.2)}
          <path d={`M${cx - 5} ${cy + 0.8} C${cx - 4.6} ${cy - 4.6} ${cx + 4.6} ${cy - 4.6} ${cx + 5} ${cy + 0.4}`} fill="none" stroke={INK} strokeWidth="2" strokeLinecap="round" />
          <path d={`M${cx + o * 4.9} ${cy + 0.2} l${o * 1.1} -1`} stroke={INK} strokeWidth="1.2" strokeLinecap="round" />
        </g>
      );
  }
}

function Brows({ style, color, eyeL, eyeR }: { style: string; color: string; eyeL: string; eyeR: string }) {
  const show = (e: string) => e !== 'hidden';
  // Sopracciglia a cuneo pieno (più "manga" di un tratto uniforme).
  const brow = (d: string, key: string) => <path key={key} d={d} fill={color} stroke={INK} strokeWidth="0.4" strokeLinejoin="round" />;
  const pair = (l: string, r: string) => (
    <>
      {show(eyeL) && brow(l, 'l')}
      {show(eyeR) && brow(r, 'r')}
    </>
  );
  switch (style) {
    case 'none':
      return null;
    case 'thick':
      return pair('M37.6 40 C40 37.4 44.6 37 48 38.8 L47.6 40.4 C44.6 39.2 40.6 39.4 37.6 40 Z', 'M62.4 40 C60 37.4 55.4 37 52 38.8 L52.4 40.4 C55.4 39.2 59.4 39.4 62.4 40 Z');
    case 'angry':
      return pair('M37.6 37.6 C41 37.8 45 39.2 48.2 41.4 L47.4 42.6 C44.4 41 41 40 37.4 39.4 Z', 'M62.4 37.6 C59 37.8 55 39.2 51.8 41.4 L52.6 42.6 C55.6 41 59 40 62.6 39.4 Z');
    case 'thin':
      return pair('M38.4 39.6 C41 37.8 45 37.6 47.6 38.8 L47.4 39.5 C45 38.6 41.2 38.8 38.4 39.6 Z', 'M61.6 39.6 C59 37.8 55 37.6 52.4 38.8 L52.6 39.5 C55 38.6 58.8 38.8 61.6 39.6 Z');
    case 'raised':
      return pair('M38.4 38.6 C40.6 35.6 45 35.2 47.6 37 L47.2 38.2 C44.6 36.8 41 37.2 38.4 38.6 Z', 'M61.6 38.6 C59.4 35.6 55 35.2 52.4 37 L52.8 38.2 C55.4 36.8 59 37.2 61.6 38.6 Z');
    // Sopracciglio a spirale (Sanji): la spirale è all'estremità interna di quello di destra.
    case 'spiral':
      return (
        <g fill="none" stroke={color} strokeLinecap="round" strokeWidth="1.7">
          {show(eyeL) && <path d="M38.4 39.6 C41 37.8 45 37.6 47.6 39" />}
          {show(eyeR) && <path d="M62 39.8 C59 37.8 55.5 37.8 53.4 39 C51.6 40 51.8 42.2 53.4 42.2 C54.8 42.2 55 40.6 53.8 40.4" />}
        </g>
      );
    case 'normal':
    default:
      return pair('M38 39.8 C40.6 37.6 45 37.2 47.8 38.6 L47.4 39.9 C44.8 38.9 41 39 38 39.8 Z', 'M62 39.8 C59.4 37.6 55 37.2 52.2 38.6 L52.6 39.9 C55.2 38.9 59 39 62 39.8 Z');
  }
}

function Nose({ style, skin }: { style: string; skin: string }) {
  const sh = shade(skin, -0.3);
  switch (style) {
    case 'none':
      return null;
    case 'long':
      return (
        <g>
          <path d="M48.5 49 C50 48 52 48.4 54 49.4 L70.5 55.4 C73 56.4 72.6 59.6 70 59.4 L52.5 56.4 C49.5 56 48 54 48.5 49 Z" fill={skin} stroke={INK} strokeWidth="1" strokeLinejoin="round" />
          <path d="M52.5 54.4 L69 58" stroke={sh} strokeWidth="1.2" strokeLinecap="round" />
        </g>
      );
    case 'big':
      return <path d="M50.6 47 C49.6 50 48 53 47.6 54.6 C49 55.8 51.6 55.8 53 54.4" fill="none" stroke={sh} strokeWidth="1.1" strokeLinecap="round" />;
    case 'flat':
      return <path d="M48 54 Q50 55.2 52 54" fill="none" stroke={sh} strokeWidth="1" strokeLinecap="round" />;
    // Naso a sega (Arlong).
    case 'saw':
      return (
        <path
          d="M48.6 48.6 L50.8 48.4 L73 52 L73.6 55 L52 54.6 C49.6 54.4 48.6 52 48.6 48.6 Z M56 54.8 l1 2 l1 -2 M61 54.9 l1 2 l1 -2 M66 55 l1 2 l1 -2"
          fill={skin}
          stroke={INK}
          strokeWidth="0.9"
          strokeLinejoin="round"
        />
      );
    // Naso a palla rossa (Bagy) / blu (Chopper).
    case 'clown':
      return <circle cx="50" cy="52.4" r="3.2" fill="#d8303a" stroke={INK} strokeWidth="0.9" />;
    case 'blue':
      return <ellipse cx="50" cy="52.6" rx="2.6" ry="2" fill="#3a6ad8" stroke={INK} strokeWidth="0.8" />;
    // Naso a cuore rovesciato del teschio (Brook).
    case 'skull':
      return <path d="M50 55 C47 52.6 47.6 50.2 49 50.6 L50 51.6 L51 50.6 C52.4 50.2 53 52.6 50 55 Z" fill={INK} />;
    // Naso manga: un'ombra triangolare sul lato.
    case 'small':
    default:
      return <path d="M50.8 49.6 L49.2 54 L51.4 54.2 Z" fill={sh} />;
  }
}

function Mouth({ style, skin }: { style: string; skin: string }) {
  const lip = shade(skin, -0.55);
  switch (style) {
    case 'grin':
      return (
        <g>
          <path d="M40.5 55.5 C44 64.5 56 64.5 59.5 55.5 Z" fill="#7a2a2e" stroke={INK} strokeWidth="1.1" strokeLinejoin="round" />
          <path d="M41.3 56 L58.7 56 C58.3 57.4 57.6 58.4 56.8 59.2 L43.2 59.2 C42.4 58.4 41.7 57.4 41.3 56 Z" fill={WHITE} />
          <path d="M45 62 C47.5 60.6 52.5 60.6 55 62" fill="#d8606a" />
        </g>
      );
    case 'smile':
      return <path d="M45.6 57.6 Q50 60.6 54.4 57.6" fill="none" stroke={lip} strokeWidth="1.1" strokeLinecap="round" />;
    case 'smirk':
      return <path d="M46 59 Q50.5 59.4 54.8 57" fill="none" stroke={lip} strokeWidth="1.1" strokeLinecap="round" />;
    case 'open':
      return <path d="M46.5 57.4 Q50 62.4 53.5 57.4 Z" fill="#7a2a2e" stroke={INK} strokeWidth="0.9" />;
    // Sorriso largo a labbra chiuse (Gin).
    case 'wide':
      return <path d="M40 55.6 Q50 62.6 60 55.6" fill="none" stroke={lip} strokeWidth="1.2" strokeLinecap="round" />;
    case 'frown':
      return <path d="M46.4 59.4 Q50 57.4 53.6 59.4" fill="none" stroke={lip} strokeWidth="1.1" strokeLinecap="round" />;
    // Ghigno a denti scoperti (antagonisti).
    case 'teeth':
      return (
        <g>
          <path d="M42 56.4 Q50 62.6 58 56.4 Q50 59 42 56.4 Z" fill={WHITE} stroke={INK} strokeWidth="1" />
          <path d="M45 57.6 V59.2 M48 58.2 V60 M51 58.3 V60 M54 57.9 V59.6" stroke={INK} strokeWidth="0.5" />
        </g>
      );
    // Zanne inferiori (Jinbe).
    case 'tusks':
      return (
        <g>
          <path d="M44.6 58.4 Q50 60.4 55.4 58.4" fill="none" stroke={lip} strokeWidth="1.1" strokeLinecap="round" />
          <path d="M45.4 59.2 L46.4 54.6 L47.6 59.4 Z M54.6 59.2 L53.6 54.6 L52.4 59.4 Z" fill={WHITE} stroke={INK} strokeWidth="0.6" strokeLinejoin="round" />
        </g>
      );
    // Bocca truccata che arriva alle guance (Corazon).
    case 'clown':
      return <path d="M38 54.6 C42 62 58 62 62 54.6 C58 58.4 42 58.4 38 54.6 Z" fill="#a8202a" stroke={INK} strokeWidth="0.7" />;
    case 'lips':
      return (
        <g>
          <path d="M44.6 58.6 C47 56.6 53 56.6 55.4 58.6 C53 61.6 47 61.6 44.6 58.6 Z" fill={shade(skin, -0.22)} stroke={INK} strokeWidth="0.9" />
          <path d="M44.8 58.6 Q50 59.6 55.2 58.6" fill="none" stroke={INK} strokeWidth="0.8" />
        </g>
      );
    case 'neutral':
    default:
      return <path d="M46.8 58.4 Q50 59 53.2 58.4" fill="none" stroke={lip} strokeWidth="1.05" strokeLinecap="round" />;
  }
}

/* ------------------------- Segni e accessori ------------------------- */

/** Segni sulla pelle (sotto i capelli). */
function skinMarks(m: Set<string>, p: ResolvedPortrait): ReactNode[] {
  const out: ReactNode[] = [];
  const acc = (fallback: string) => (p.hasAccent ? p.accent : fallback);
  const add = (k: string, node: ReactNode) => {
    if (m.has(k)) out.push(<g key={k}>{node}</g>);
  };
  add('scar_cheek', <path d="M54.3 52.4 Q57 53.6 59.8 52.4 M55.8 51.2 L55.6 54 M58.2 51.2 L58.4 53.8" fill="none" stroke={SCAR} strokeWidth="0.8" strokeLinecap="round" />);
  add('scar_eye', <path d="M56.6 38.5 L57.8 54.5" fill="none" stroke={SCAR} strokeWidth="1.2" strokeLinecap="round" />);
  add('scar_eye_left', <path d="M43.4 38.5 L42.2 54.5" fill="none" stroke={SCAR} strokeWidth="1.2" strokeLinecap="round" />);
  add('scar_nose', <path d="M40 51.6 L60 51.6" stroke={SCAR} strokeWidth="1.2" strokeLinecap="round" />);
  add('scar_x', <path d="M45 46 L55 56 M55 46 L45 56" stroke={SCAR} strokeWidth="1.1" strokeLinecap="round" />);
  add('chest_x_scar', <path d="M43 80 L57 96 M57 80 L43 96" stroke={SCAR} strokeWidth="1.6" strokeLinecap="round" />);
  add('chest_scar', <path d="M57 74 L45 96" stroke={SCAR} strokeWidth="1.6" strokeLinecap="round" />);
  add(
    'shoulder_tattoo',
    <g stroke={acc('#2c5aa8')} strokeWidth="0.8" strokeLinejoin="round" fill="none">
      <path d="M74 84 L74 80.6 L76.2 82.4 Z M74 84 L77.4 84 L75.6 86.2 Z M74 84 L74 87.4 L71.8 85.6 Z M74 84 L70.6 84 L72.4 81.8 Z" fill={acc('#2c5aa8')} />
      <circle cx="80.6" cy="87" r="2.4" fill={acc('#2c5aa8')} fillOpacity="0.35" />
      <path d="M80.6 84.6 C79.4 83 78 82.8 77.4 83.4 C78.4 84.4 79.6 84.8 80.6 84.6 Z M80.6 84.6 C81.8 83 83.2 82.8 83.8 83.4 C82.8 84.4 81.6 84.8 80.6 84.6 Z" />
    </g>,
  );
  add('whiskers', <path d="M35.6 51.8 L41.4 52.8 M35.4 54.4 L41.2 54.6 M36 57 L41.4 56.4 M64.4 51.8 L58.6 52.8 M64.6 54.4 L58.8 54.6 M64 57 L58.6 56.4" stroke={INK} strokeWidth="0.9" strokeLinecap="round" />);
  add('cheek_marks', <path d="M37.8 51.6 L42.2 51.6 L40 57.4 Z M57.8 51.6 L62.2 51.6 L60 57.4 Z" fill={acc('#c8303a')} />);
  add('eye_lines', <path d="M40.6 50.6 L41.4 56 M59.4 50.6 L58.6 56" stroke={acc('#3a2a2a')} strokeWidth="1.1" strokeLinecap="round" />);
  add(
    'eye_rings',
    <g fill="none" stroke={acc('#22232b')} strokeWidth="1.3">
      <ellipse cx={EYE_L} cy={EYE_Y} rx="5.6" ry="5" />
      <ellipse cx={EYE_R} cy={EYE_Y} rx="5.6" ry="5" />
    </g>,
  );
  add('forehead_mark', <path d="M50 33.5 L52.2 36.5 L50 39.5 L47.8 36.5 Z" fill={acc('#8e5ad0')} />);
  // Tatuaggio sulla fronte, lato destro (Gaara).
  add('forehead_tattoo', <path d="M57.4 33.2 L62 34.6 M59.6 31.8 L59 36.6 M57.4 35.6 L61.6 36.8" stroke="#c0303a" strokeWidth="1.1" strokeLinecap="round" />);
  // Sopracciglia tatuate (Renji).
  add('brow_tattoo', <path d="M38 37 L41 35 L43 36.6 L46 34.6 M62 37 L59 35 L57 36.6 L54 34.6" fill="none" stroke={INK} strokeWidth="0.9" strokeLinecap="round" />);
  // Stella sulla guancia destra e goccia sulla sinistra (Hisoka).
  add(
    'star_tear',
    <g>
      <path d="M40 50.6 L40.9 52.6 L43 52.8 L41.4 54.2 L41.9 56.2 L40 55.1 L38.1 56.2 L38.6 54.2 L37 52.8 L39.1 52.6 Z" fill={acc('#c8303a')} />
      <path d="M60 50.8 C61.4 53 62 54.4 60 56 C58 54.4 58.6 53 60 50.8 Z" fill="#3a6ad8" />
    </g>,
  );
  // Croce tatuata al centro della fronte (Chrollo).
  add('forehead_cross', <path d="M49 30.6 H51 V33 H53.4 V35 H51 V39.4 H49 V35 H46.6 V33 H49 Z" fill={acc('#4a2a6a')} />);
  // Sei punti sulla fronte (Crilin).
  add(
    'forehead_dots',
    <g fill={shade(p.skin, -0.45)}>
      {[[46, 30], [50, 29], [54, 30], [46, 33.6], [50, 32.6], [54, 33.6]].map(([x, y]) => <circle key={`${x}-${y}`} cx={x} cy={y} r="0.75" />)}
    </g>,
  );
  // Sfera sulla fronte (colore = accent; Omega Shenron).
  add('forehead_orb', <circle cx="50" cy="33" r="3" fill={acc('#f08a2a')} stroke={INK} strokeWidth="0.7" />);
  // Stella a sei punte sul lato destro della fronte (Julius).
  add('forehead_star', <path d="M58 30 L59.2 32.6 L62 32.6 L60 34.6 L61 37.4 L58 36 L55 37.4 L56 34.6 L54 32.6 L56.8 32.6 Z" fill={acc('#3a6ad8')} />);
  // Croce nera sul lato destro della fronte che scende sull'occhio (Zenon).
  add('cross_mark', <path d="M56 30 H58.6 V36 H63 V38.4 H58.6 V52 H56 V38.4 H52 V36 H56 Z" fill={acc('#16151c')} />);
  // Segno scuro lungo tutta la fronte (Dante).
  add('forehead_band_mark', <path d="M36 33 C42 30.4 58 30.4 64 33 L63 36.4 C57 34.4 43 34.4 37 36.4 Z" fill={acc('#16151c')} />);
  // Segno a sole sul lato sinistro della fronte (Lucius).
  add(
    'sun_mark',
    <g fill={acc('#16151c')}>
      <circle cx="42" cy="33" r="2" />
      <path d="M42 28.4 V29.8 M42 36.2 V37.6 M37.4 33 H38.8 M45.2 33 H46.6 M38.8 29.8 L39.8 30.8 M45.2 29.8 L44.2 30.8 M38.8 36.2 L39.8 35.2 M45.2 36.2 L44.2 35.2" stroke={acc('#16151c')} strokeWidth="0.9" strokeLinecap="round" />
    </g>,
  );
  // Trucco a teschio: interno del volto nero tranne il naso (Mayuri).
  add('face_paint', <path d="M38 40 C42 37 46 39 48 44 L50 48 L52 44 C54 39 58 37 62 40 C63 50 60 58 54 62 L50 63 L46 62 C40 58 37 50 38 40 Z" fill={INK} opacity="0.92" />);
  add('gills', <path d="M36.6 51 Q38.4 53 36.8 55 M38.2 50.4 Q40.2 52.6 38.6 55.2 M63.4 51 Q61.6 53 63.2 55 M61.8 50.4 Q59.8 52.6 61.4 55.2" fill="none" stroke={shade(p.skin, -0.4)} strokeWidth="0.8" strokeLinecap="round" />);
  add('scar_chin_x', <path d="M47.4 60.4 L52.6 64.6 M52.6 60.4 L47.4 64.6" stroke={SCAR} strokeWidth="0.9" strokeLinecap="round" />);
  // Cicatrici rugose sul lato sinistro del volto (Obito).
  add('scar_lines_left', <path d="M35 34 C38 36 37 40 40 42 M34.6 44 C37.6 45 37 49 40 51 M35.4 54 C38 54.6 38.4 57.6 41 59 M38 30 C40 31.6 41 33 44 33" fill="none" stroke={shade(p.skin, -0.35)} strokeWidth="0.9" strokeLinecap="round" />);
  // Piercing (Pain): borchie sul setto, sotto il labbro e sulle orecchie.
  add(
    'piercings',
    <g fill="#9aa0aa" stroke={INK} strokeWidth="0.4">
      {[[50, 50.4], [50, 52.6], [46.4, 60.8], [53.6, 60.8], [33, 43], [33.4, 46.4], [33.2, 49.8], [67, 43], [66.6, 46.4], [66.8, 49.8]].map(([x, y]) => (
        <circle key={`${x}-${y}`} cx={x} cy={y} r="0.9" />
      ))}
    </g>,
  );
  add(
    'third_eye',
    <g>
      <ellipse cx="50" cy="35.5" rx="2.8" ry="2" fill={WHITE} stroke={INK} strokeWidth="0.6" />
      <circle cx="50" cy="35.6" r="1.3" fill={p.hasAccent ? p.accent : '#c8202a'} />
    </g>,
  );
  add('stitches', <path d="M38 38 L62 58 M41 37.6 L40 40.6 M45 40.6 L44 43.6 M53 47.6 L52 50.6 M57 50.6 L56 53.6 M61 54 L60 57" stroke={INK} strokeWidth="0.8" strokeLinecap="round" />);
  add('wrinkles', <path d="M41 33 Q50 31.4 59 33 M42 35.4 Q50 34 58 35.4 M43 55 Q41.6 58 43 61 M57 55 Q58.4 58 57 61" fill="none" stroke={shade(p.skin, -0.3)} strokeWidth="0.7" strokeLinecap="round" />);
  add(
    'freckles',
    <g fill={shade(p.skin, -0.3)}>
      {[
        [39, 52],
        [41.4, 53.4],
        [43.4, 52.4],
        [56.6, 52.4],
        [58.6, 53.4],
        [61, 52],
      ].map(([x, y]) => (
        <circle key={x} cx={x} cy={y} r="0.45" />
      ))}
    </g>,
  );
  add(
    'blush',
    <g fill="#f08a9a" opacity="0.45">
      <ellipse cx="39" cy="53" rx="3" ry="1.5" />
      <ellipse cx="61" cy="53" rx="3" ry="1.5" />
    </g>,
  );
  // Tatuaggio a rombi sul lato destro del volto (Dragon); colore = accent.
  add(
    'face_tattoo',
    <g fill="none" stroke={acc('#b8202a')} strokeWidth="0.8">
      <path d="M58 37 L63.5 42.5 L58 48 L52.5 42.5 Z M58 48 L63 53 L58 58 L53 53 Z" />
      <path d="M58 40 L60.5 42.5 L58 45 L55.5 42.5 Z M58 50.5 L60.5 53 L58 55.5 L55.5 53 Z" />
    </g>,
  );
  // Grande cicatrice a X sulla fronte che attraversa gli occhi (Fujitora).
  add('scar_x_forehead', <path d="M43 30 L66 54 M66 30 L43 54" stroke={SCAR} strokeWidth="1.3" strokeLinecap="round" />);
  add('eye_bags', <path d="M39 50.2 Q42.8 51.8 46.6 50.2 M53.4 50.2 Q57.2 51.8 61 50.2" fill="none" stroke={shade(p.skin, -0.35)} strokeWidth="0.8" strokeLinecap="round" />);
  add(
    'necklace',
    <g fill={acc('#c8303a')} stroke={INK} strokeWidth="0.5">
      {[-12, -8, -4, 0, 4, 8, 12].map((dx) => (
        <circle key={dx} cx={50 + dx} cy={78 + Math.abs(dx) * -0.25 + 3} r="1.6" />
      ))}
    </g>,
  );
  add('goatee', <path d="M48.4 63.6 Q50 67 51.6 63.6 Z" fill={p.hair} stroke={INK} strokeWidth="0.5" />);
  add('split_face', <path d="M50 20.5 C42 20.5 33.5 28 33.5 39 L33.7 46 C34 52 36.5 57 41 61 L47.5 66.2 C48.3 66.7 49.2 67 50 67 Z" fill={INK} opacity="0.88" />);
  return out;
}

/** Accessori sopra tutto (cappelli, fasce, occhiali, corna…); `ink` = colore firma del mondo. */
function overMarks(m: Set<string>, p: ResolvedPortrait, ink: string, fur?: string): ReactNode[] {
  const out: ReactNode[] = [];
  const acc = (fallback: string) => (p.hasAccent ? p.accent : fallback);
  const furColor = fur ? portraitColor(fur, fur) : acc('#f1f1f1');
  const add = (k: string, node: ReactNode) => {
    if (m.has(k)) out.push(<g key={k}>{node}</g>);
  };
  add(
    'earrings3',
    <g fill="none" stroke={GOLD} strokeWidth="0.9">
      <circle cx="67.4" cy="49" r="1.1" />
      <circle cx="67.6" cy="51.4" r="1.1" />
      <circle cx="67.4" cy="53.8" r="1.1" />
    </g>,
  );
  add(
    'earrings',
    <g fill={GOLD} stroke={INK} strokeWidth="0.4">
      <circle cx="33.4" cy="52" r="1.3" />
      <circle cx="66.6" cy="52" r="1.3" />
    </g>,
  );
  add(
    'eyepatch',
    <g>
      <path d="M34 39 L66 52" stroke={INK} strokeWidth="1.1" />
      <ellipse cx={EYE_R} cy={EYE_Y} rx="5" ry="4.4" fill={INK} />
    </g>,
  );
  add(
    'eyepatch_left',
    <g>
      <path d="M66 39 L34 52" stroke={INK} strokeWidth="1.1" />
      <ellipse cx={EYE_L} cy={EYE_Y} rx="5" ry="4.4" fill={INK} />
    </g>,
  );
  add('blindfold', <path d="M32.6 42 C40 40.6 60 40.6 67.4 42 L67.4 50 C60 48.6 40 48.6 32.6 50 Z" fill="#111" stroke={INK} strokeWidth="0.8" />);
  add('bandage_eye', <path d="M33 40 L67 44 L67 51 L33 47 Z" fill="#ece8dc" stroke={INK} strokeWidth="0.8" />);
  add(
    'glasses',
    <g fill="none" stroke={INK} strokeWidth="1">
      <rect x="37.6" y="42.4" width="10.4" height="7.4" rx="2" />
      <rect x="52" y="42.4" width="10.4" height="7.4" rx="2" />
      <path d="M48 45.6 H52 M37.6 45 L33.6 44 M62.4 45 L66.4 44" />
    </g>,
  );
  add(
    'round_glasses',
    <g fill="none" stroke={INK} strokeWidth="1">
      <circle cx={EYE_L} cy={EYE_Y} r="5" />
      <circle cx={EYE_R} cy={EYE_Y} r="5" />
      <path d="M47.8 45.6 H52.2 M37.8 45 L33.6 44 M62.2 45 L66.4 44" />
    </g>,
  );
  add(
    'sunglasses',
    <g>
      <path d="M36.6 42.6 H48.4 L47.4 49.6 C45 51 39.6 51 37.6 49.4 Z M51.6 42.6 H63.4 L62.4 49.4 C60.4 51 55 51 52.6 49.6 Z" fill="#141418" stroke={INK} strokeWidth="0.8" />
      <path d="M48.4 43.4 H51.6 M36.6 43 L33.6 42.4 M63.4 43 L66.4 42.4" stroke={INK} strokeWidth="1" />
      <path d="M39 44 L41.6 44" stroke={WHITE} strokeWidth="0.8" opacity="0.5" />
    </g>,
  );
  add(
    'mask_lower',
    <path
      d="M34.2 50.5 C34.4 56 37 59.6 41 62 L47.5 66.5 C49 67.4 51 67.4 52.5 66.5 L59 62 C63 59.6 65.6 56 65.8 50.5 L56 50.5 L50 52.6 L44 50.5 Z M43.5 62 H56.5 V76 H43.5 Z"
      fill={acc('#2c3346')}
      stroke={INK}
      strokeWidth="0.9"
    />,
  );
  add('beard', <path d="M34.6 50 C35 60 42 68 50 68.4 C58 68 65 60 65.4 50 C62 58 57 61.6 50 61.6 C43 61.6 38 58 34.6 50 Z" fill={p.hair} stroke={INK} strokeWidth="0.9" />);
  add('long_beard', <path d="M35 52 C35 62 40 70 44 80 L50 90 L56 80 C60 70 65 62 65 52 C62 59 57 62 50 62 C43 62 38 59 35 52 Z" fill={p.hair} stroke={INK} strokeWidth="0.9" />);
  add('mustache', <path d="M41 57.6 C44 53.4 48 54 50 55.6 C52 54 56 53.4 59 57.6 C55.5 56.6 53 57 50 57.8 C47 57 44.5 56.6 41 57.6 Z" fill={p.hair} stroke={INK} strokeWidth="0.6" />);
  add('big_mustache', <path d="M34 54 C40 49 47 52 50 54.6 C53 52 60 49 66 54 C61 56 56 57.6 50 57.2 C44 57.6 39 56 34 54 Z" fill={p.hair} stroke={INK} strokeWidth="0.8" />);
  add(
    'headband',
    <g>
      <path d="M32 31.6 C40 30 60 30 68 31.6 L68 38.2 C60 36.6 40 36.6 32 38.2 Z" fill={acc('#25304a')} stroke={INK} strokeWidth="0.9" />
      <rect x="43" y="31" width="14" height="6.2" rx="1" fill={ink} stroke={INK} strokeWidth="0.8" />
      <path d="M46 34.6 C47 32.6 49 32.6 50 34 C51 35.4 53.4 35 54 33" fill="none" stroke={INK} strokeWidth="0.6" />
    </g>,
  );
  // Coprifronte inclinato che copre l'occhio di destra (Kakashi).
  add(
    'headband_tilt',
    <g>
      <path d="M32 30 C42 30 58 34 68 40 L67 50 C58 43 42 38 32 37 Z" fill={acc('#25304a')} stroke={INK} strokeWidth="0.9" />
      <path d="M50 32.4 L63 37.6 L61.6 44.8 L48.6 39.4 Z" fill={ink} stroke={INK} strokeWidth="0.8" />
      <path d="M52.6 37 C54 35.4 56 35.8 56.6 37.4 C57.2 39 59.4 39.4 60.4 38.2" fill="none" stroke={INK} strokeWidth="0.6" />
    </g>,
  );
  // Benda sull'occhio di sinistra (Danzō).
  add('bandage_left', <path d="M32.6 36 C38 37.4 44 39 50 41.6 L48.6 52 C43 50 38 49 33 48.4 Z" fill="#ece8dc" stroke={INK} strokeWidth="0.8" />);
  // Cappello da Kage: ampio cono con la fascia frontale (colore = accent).
  add(
    'kage_hat',
    <g>
      <path d="M14 34 L50 8 L86 34 C74 38 26 38 14 34 Z" fill="#f1f1f1" stroke={INK} strokeWidth="1.1" strokeLinejoin="round" />
      <path d="M40 15.6 L50 8 L60 15.6 C56 17 44 17 40 15.6 Z M30 26 C40 30 60 30 70 26 L74 29.6 C62 33.6 38 33.6 26 29.6 Z" fill={acc('#c8303a')} stroke={INK} strokeWidth="0.8" />
      <rect x="44" y="20" width="12" height="8" fill="#f1f1f1" stroke={INK} strokeWidth="0.7" />
      <path d="M47 22 H53 M50 22 V27 M47 25 H53" stroke={acc('#c8303a')} strokeWidth="0.9" />
    </g>,
  );
  // Foglie di dionea attorno alla testa (Zetsu).
  add(
    'flytrap',
    <g fill="#3f8a4a" stroke={INK} strokeWidth="1">
      <path d="M50 4 C30 4 18 22 20 48 L28 46 C26 26 36 14 50 13 Z" />
      <path d="M50 4 C70 4 82 22 80 48 L72 46 C74 26 64 14 50 13 Z" />
      <path d="M24 44 l-4 3 M23 36 l-5 1 M25 27 l-4 -2 M76 44 l4 3 M77 36 l5 1 M75 27 l4 -2" stroke={INK} strokeWidth="1.2" />
    </g>,
  );
  // Orecchie a punta (Namecciani, demoni): coprono quelle tonde.
  add(
    'pointy_ears',
    <g fill={p.skin} stroke={INK} strokeWidth="0.9" strokeLinejoin="round">
      <path d="M35 42 L24 34 L30 46 L34.6 51 Z" />
      <path d="M65 42 L76 34 L70 46 L65.4 51 Z" />
    </g>,
  );
  // Turbante bianco col bordo viola (Piccolo).
  add(
    'turban',
    <g>
      <path d="M32 38 C30 22 39 13 50 13 C61 13 70 22 68 38 C62 34 38 34 32 38 Z" fill="#f4f2ec" stroke={INK} strokeWidth="1.1" />
      <path d="M32 38 C38 34 62 34 68 38 L68 41 C62 37.4 38 37.4 32 41 Z" fill={acc('#6b3a9a')} stroke={INK} strokeWidth="0.9" />
      <path d="M40 18 C44 22 46 28 46 34 M58 17 C56 22 55 28 55 34" fill="none" stroke="#c8c4b8" strokeWidth="0.9" />
    </g>,
  );
  // Antenna/tentacolo sulla testa (Majin Bu).
  add('tentacle', <path d="M48 22 C44 14 46 6 54 4 C60 3 62 9 58 11 C55 12 53 9 55 8 C51 9 50 15 53 21 Z" fill={p.skin} stroke={INK} strokeWidth="1" />);
  // Lente-mirino sull'occhio di sinistra (Granolah).
  add(
    'scope_eye',
    <g>
      <path d="M33 40 L66 37" stroke="#5a3a24" strokeWidth="1.6" />
      <circle cx={EYE_L} cy={EYE_Y} r="5.6" fill="#8fc6f0" fillOpacity="0.45" stroke={GOLD} strokeWidth="1.6" />
    </g>,
  );
  // Maschera/elmo che copre la metà superiore del volto (William).
  add(
    'mask_upper',
    <g>
      <path d="M32 46 C31 30 39 20 50 20 C61 20 69 30 68 46 C62 51 56 52 50 50 C44 52 38 51 32 46 Z" fill={acc('#e8e0c8')} stroke={INK} strokeWidth="1" />
      <path d="M38.6 44 C40 41.4 45.6 41.4 47 44 C45 46 40.6 46 38.6 44 Z M53 44 C54.4 41.4 60 41.4 61.4 44 C59.4 46 55 46 53 44 Z" fill={INK} />
      <path d="M50 21 V38 M38 30 C44 27 56 27 62 30" fill="none" stroke={GOLD} strokeWidth="1" />
    </g>,
  );
  // Ciocca che cade tra gli occhi (Rukia, Ulquiorra).
  add('center_strand', <path d="M50 30 C48 36 48.6 42 50.6 48 C51.4 42 52 36 51.6 31 Z" fill={p.hair} stroke={INK} strokeWidth="0.8" strokeLinejoin="round" />);
  // Treccia lunga portata sul davanti (Unohana).
  add(
    'braid_front',
    <g fill={p.hair} stroke={INK} strokeWidth="0.7">
      {[70, 75, 80, 85, 90, 95].map((y, i) => <ellipse key={y} cx={50 + (i % 2 ? 0.6 : -0.6)} cy={y} rx="3" ry="3.2" />)}
    </g>,
  );
  // Treccia che pende tra gli occhi fino al naso (Nozel).
  add(
    'braid_center',
    <g fill={p.hair} stroke={INK} strokeWidth="0.7">
      {[34, 38, 42, 46, 50].map((y) => <ellipse key={y} cx="50" cy={y} rx="1.7" ry="2.3" />)}
      <circle cx="50" cy="53" r="1.2" fill={GOLD} />
    </g>,
  );
  add(
    'goggles',
    <g>
      <path d="M31 29 C40 25 60 25 69 29" fill="none" stroke={INK} strokeWidth="2.4" />
      <path d="M31 29 C40 25 60 25 69 29" fill="none" stroke="#6b4a2e" strokeWidth="1.4" />
      <circle cx="42" cy="25.5" r="5.4" fill={acc('#f2b23a')} stroke={INK} strokeWidth="1.3" />
      <circle cx="58" cy="25.5" r="5.4" fill={acc('#f2b23a')} stroke={INK} strokeWidth="1.3" />
      <circle cx="40.4" cy="24" r="1.5" fill={WHITE} opacity="0.7" />
      <circle cx="56.4" cy="24" r="1.5" fill={WHITE} opacity="0.7" />
      <path d="M47.4 25.5 H52.6" stroke={INK} strokeWidth="1.6" />
    </g>,
  );
  add(
    'bandana',
    <g>
      <path d="M32.5 40 C31.5 27 39.5 21 50 21 C60.5 21 68.5 27 67.5 40 C62 35 57 34 50 34 C43 34 38 35 32.5 40 Z" fill={acc('#2b2f3d')} stroke={INK} strokeWidth="1" />
      <path d="M66 35 L75 40 L70 45 Z" fill={acc('#2b2f3d')} stroke={INK} strokeWidth="0.9" />
    </g>,
  );
  add(
    'strawhat',
    <g>
      <ellipse cx="50" cy="31.5" rx="31" ry="7.2" fill={shade(STRAW, -0.2)} stroke={INK} strokeWidth="1.2" />
      <ellipse cx="50" cy="30.6" rx="30" ry="6.4" fill={STRAW} />
      <path d="M34.5 31 C34 13.5 66 13.5 65.5 31 Z" fill={STRAW} stroke={INK} strokeWidth="1.2" strokeLinejoin="round" />
      <path d="M34.7 25.5 C42 27 58 27 65.3 25.5 L65.5 30.4 C58 32 42 32 34.5 30.4 Z" fill="#cc2f36" stroke={INK} strokeWidth="1" />
      <g stroke={shade(STRAW, -0.28)} strokeWidth="0.6" fill="none" opacity="0.8">
        <path d="M40 22 C44 20.5 56 20.5 60 22 M38 17.5 C44 16 56 16 62 17.5" />
        <path d="M24 32 C32 36 68 36 76 32 M28 35 C36 38.4 64 38.4 72 35" />
      </g>
    </g>,
  );
  add(
    'hat',
    <g>
      <ellipse cx="50" cy="29.5" rx="27" ry="5.6" fill={shade(acc('#3a3a46'), -0.2)} stroke={INK} strokeWidth="1.1" />
      <path d="M36.5 29 C36.5 14 63.5 14 63.5 29 Z" fill={acc('#3a3a46')} stroke={INK} strokeWidth="1.1" />
      <path d="M36.7 25 H63.3 V29 H36.7 Z" fill={shade(acc('#3a3a46'), -0.45)} />
    </g>,
  );
  add(
    'cap',
    <g>
      <path d="M33 33 C32 20 40 15 50 15 C60 15 68 20 67 33 Z" fill={acc('#3a3a46')} stroke={INK} strokeWidth="1" />
      <path d="M30 33 C40 30.4 60 30.4 70 33 C66 36.4 58 37 50 37 C42 37 34 36.4 30 33 Z" fill={shade(acc('#3a3a46'), -0.25)} stroke={INK} strokeWidth="1" />
    </g>,
  );
  add('hood', <path d="M28 52 C24 30 34 14 50 14 C66 14 76 30 72 52 L66 50 C67 36 61 26 50 26 C39 26 33 36 34 50 Z" fill={acc('#3a3a46')} stroke={INK} strokeWidth="1" />);
  add(
    'top_hat',
    <g>
      <ellipse cx="50" cy="27" rx="21" ry="4.2" fill={shade(acc('#22232b'), -0.2)} stroke={INK} strokeWidth="1.1" />
      <path d="M38 27 L39 6 C44 4.6 56 4.6 61 6 L62 27 Z" fill={acc('#22232b')} stroke={INK} strokeWidth="1.1" strokeLinejoin="round" />
      <path d="M38.6 21 L61.4 21 L61.7 25 L38.3 25 Z" fill={shade(acc('#22232b'), -0.35)} />
      {m.has('hat_cross') && (
        <g transform="rotate(45 50 14)" fill={WHITE} stroke={INK} strokeWidth="0.5">
          <rect x="48.4" y="8.6" width="3.2" height="10.8" />
          <rect x="44.6" y="12.4" width="10.8" height="3.2" />
        </g>
      )}
    </g>,
  );
  add(
    'fur_hat',
    <g>
      <path d="M31 34 C29 17 39 10 50 10 C61 10 71 17 69 34 C62 31 38 31 31 34 Z" fill="#f4f2ec" stroke={INK} strokeWidth="1.1" />
      <path d="M30 34 C38 30 62 30 70 34 L69.6 38 C62 34.6 38 34.6 30.4 38 Z" fill="#f4f2ec" stroke={INK} strokeWidth="1" />
      <g fill="#7a5a3a">
        {[34, 40, 46, 52, 58, 64].map((x) => <circle key={x} cx={x} cy={34.2} r="1.1" />)}
      </g>
    </g>,
  );
  add(
    'antlers',
    <g fill="none" stroke="#8a6a3a" strokeWidth="2.2" strokeLinecap="round">
      <path d="M38 22 C33 16 30 10 30 4 M33 14 L26 12 M31 9 L36 5" />
      <path d="M62 22 C67 16 70 10 70 4 M67 14 L74 12 M69 9 L64 5" />
    </g>,
  );
  add(
    'sleep_mask',
    <g>
      <path d="M32 30 C40 27 60 27 68 30" fill="none" stroke={INK} strokeWidth="1.2" />
      <path d="M38 27 C42 24 47 25 49.4 28 C47 31 42 31.6 38 30 Z M62 27 C58 24 53 25 50.6 28 C53 31 58 31.6 62 30 Z" fill={acc('#e8e0c8')} stroke={INK} strokeWidth="0.8" />
    </g>,
  );
  add(
    'steering_wheel',
    <g fill="none" stroke="#7a5230" strokeWidth="2.2" strokeLinecap="round">
      <path d="M36 16 A15 15 0 0 1 64 16" />
      <path d="M50 18 V3 M41 18 L33 7 M59 18 L67 7" />
    </g>,
  );
  add('horns', <path d="M38 30 C33 24 32 17 34 10 C38 17 41 22 43.6 27 Z M62 30 C67 24 68 17 66 10 C62 17 59 22 56.4 27 Z" fill={acc(BONE)} stroke={INK} strokeWidth="0.8" />);
  add('horn_single', <path d="M57 26 C60 18 63 13 67 9 C66 15 64 21 61 28 Z" fill={acc(BONE)} stroke={INK} strokeWidth="0.8" />);
  add(
    'antennae',
    <g stroke={p.skin} strokeWidth="1.9" strokeLinecap="round">
      <path d="M45 24 L40 11 M55 24 L60 11" />
      <circle cx="40" cy="10.5" r="1.7" fill={p.skin} stroke={INK} strokeWidth="0.5" />
      <circle cx="60" cy="10.5" r="1.7" fill={p.skin} stroke={INK} strokeWidth="0.5" />
    </g>,
  );
  add(
    'animal_ears',
    <g stroke={INK} strokeWidth="0.9" strokeLinejoin="round">
      <path d="M34 30 L30 11 L45 22 Z M66 30 L70 11 L55 22 Z" fill={p.hairStyle === 'bald' ? p.skin : p.hair} />
      <path d="M35 26 L33 16 L41.6 22.4 Z M65 26 L67 16 L58.4 22.4 Z" fill="#f2a6b8" stroke="none" />
    </g>,
  );
  add('halo', <ellipse cx="50" cy="11" rx="13" ry="3.4" fill="none" stroke="#f3d36a" strokeWidth="2.2" />);
  add('crown', <path d="M38 24 L36 12 L43.4 18 L50 9 L56.6 18 L64 12 L62 24 Z" fill={GOLD} stroke={INK} strokeWidth="0.8" />);
  // Collo di pelliccia/piume: tanti batuffoli sovrapposti lungo le spalle.
  add(
    'fur_collar',
    <g fill={furColor} stroke={INK} strokeWidth="0.7">
      {[
        [12, 93, 6], [16, 87, 6.5], [21, 82, 6.5], [27, 78, 6.5], [33, 75.5, 6], [39, 74, 5.5],
        [88, 93, 6], [84, 87, 6.5], [79, 82, 6.5], [73, 78, 6.5], [67, 75.5, 6], [61, 74, 5.5],
      ].map(([x, y, r]) => (
        <circle key={`${x}-${y}`} cx={x} cy={y} r={r} />
      ))}
      <path d="M14 90 C20 82 28 76 40 74 M86 90 C80 82 72 76 60 74" fill="none" stroke={shade(furColor, -0.25)} strokeWidth="1" />
    </g>,
  );
  add('scarf', <path d="M36 68 C42 74 58 74 64 68 L66 76 C58 81 42 81 34 76 Z M56 76 L60 92 L66 90 L62 75 Z" fill={acc('#c8303a')} stroke={INK} strokeWidth="0.9" />);
  add(
    'bone_fragment',
    <g>
      <path d="M51 55 C58 56 64 54 66 49 L66 59 C62 64 56 66.6 51 65.6 Z" fill={BONE} stroke={INK} strokeWidth="0.7" />
      <path d="M54 57.5 V61.5 M57 57.2 V61.8 M60 56.4 V61 M63 55 V59" stroke={INK} strokeWidth="0.6" />
    </g>,
  );
  add('half_helmet', <path d="M50 18 C40 18 33 25 33 34 L33 40 L42 40 C44 34 47 31 50 30 Z M40 22 C37 15 34 11 30 8 C32 14 34 19 37 25 Z" fill={BONE} stroke={INK} strokeWidth="0.8" />);
  add('kenseikan', <path d="M38 24 h7 v4 h-7 Z M47 22 h7 v4 h-7 Z" fill={WHITE} stroke={INK} strokeWidth="0.7" />);
  add('hairclip', <path d="M60 28 L66 30 L64 33 L58 31 Z" fill={acc(GOLD)} stroke={INK} strokeWidth="0.6" />);
  add(
    'flower',
    <g transform="translate(64 26)">
      {[0, 72, 144, 216, 288].map((r) => (
        <ellipse key={r} cx="0" cy="-2.6" rx="1.6" ry="2.6" transform={`rotate(${r})`} fill={acc('#f29cc2')} stroke={INK} strokeWidth="0.4" />
      ))}
      <circle r="1.2" fill={GOLD} />
    </g>,
  );
  add(
    'cigarette',
    <g>
      <path d="M53 58.6 L61.5 56.4" stroke={INK} strokeWidth="2.6" strokeLinecap="round" />
      <path d="M53 58.6 L61.5 56.4" stroke="#f4f0e6" strokeWidth="1.5" strokeLinecap="round" />
      <circle cx="61.8" cy="56.3" r="0.9" fill="#e85a2a" />
      <path d="M62.5 55 C61 52 64.5 50 63 47 C61.8 44.6 64 42.6 63.4 40.4" fill="none" stroke={WHITE} strokeWidth="0.9" opacity="0.7" strokeLinecap="round" />
    </g>,
  );
  return out;
}

/* ------------------------------ Componente ------------------------------ */

/** Ritratto dettagliato; usato da `PortraitArt` quando l'aspetto ha `face`. */
export function DetailedPortrait({ appearance: a, uid, ink }: { appearance: CharacterAppearance; uid: string; ink: string }) {
  const p = resolvePortrait(a);
  const f = a.face ?? {};
  const m = p.marks;
  const eyes = f.eyes ?? 'round';
  const eyeL = f.eyeL ?? eyes;
  const eyeR = f.eyeR ?? eyes;
  const skinShadow = shade(p.skin, -0.18);
  const face = FACES[f.shape ?? 'male'] ?? FACES.male;
  const tpl = HAIR[p.hairStyle] ?? HAIR.short;
  const front = a.hairFront ?? tpl.front;
  const back = a.hairBack ?? tpl.back;
  const hairDark = shade(p.hair, -0.36);
  const hairHi = shade(p.hair, 0.38);
  const faceClip = `pf-${uid}`;
  const hairClip = `ph-${uid}`;
  const neckClip = `pn-${uid}`;
  const splitClip = `ps-${uid}`;
  const browColor = p.hairStyle === 'bald' || p.hairStyle === 'dome' ? INK : hairDark;

  return (
    <g>
      <defs>
        <clipPath id={faceClip}>
          <path d={face} />
        </clipPath>
        <clipPath id={splitClip}>
          <rect x="50" y="0" width="50" height="100" />
        </clipPath>
        <clipPath id={neckClip}>
          <path d="M43.5 58 L43.5 76 L56.5 76 L56.5 58 Z" />
        </clipPath>
        {front && (
          <clipPath id={hairClip}>
            <path d={front} />
          </clipPath>
        )}
      </defs>

      {back && <path d={back} fill={p.hair} stroke={INK} strokeWidth="1.2" strokeLinejoin="round" />}
      {back && a.hair2 && (
        <path d={back} fill={portraitColor(a.hair2, a.hair2)} clipPath={`url(#${splitClip})`} stroke={INK} strokeWidth="1.2" />
      )}
      <Body a={a} p={p} />

      {/* Collo con l'ombra netta del mento. */}
      <path d="M43.5 58 L43.5 73 C46 76 54 76 56.5 73 L56.5 58 Z" fill={p.skin} stroke={INK} strokeWidth="0.9" />
      <g clipPath={`url(#${neckClip})`}>
        <path d={face} transform="translate(0 4.5)" fill={skinShadow} />
      </g>

      <ellipse cx="33.8" cy="46.5" rx="2.8" ry="4.4" fill={p.skin} stroke={INK} strokeWidth="0.9" />
      <ellipse cx="66.2" cy="46.5" rx="2.8" ry="4.4" fill={p.skin} stroke={INK} strokeWidth="0.9" />
      <path d={face} fill={p.skin} />
      <g clipPath={`url(#${faceClip})`}>
        {/* Ombra laterale netta e ombra dei capelli sulla fronte. */}
        <path d="M61 26 C67 34 68 50 62 60 C59 64 55.5 66 52 67.5 C59.5 58 62.6 44 61 26 Z" fill={skinShadow} opacity="0.55" />
        {front && <path d={front} transform="translate(1.2 3)" fill={skinShadow} />}
      </g>
      <path d={face} fill="none" stroke={INK} strokeWidth="1.3" strokeLinejoin="round" />
      {skinMarks(m, p)}

      {m.has('cyclops') ? (
        <g>
          <ellipse cx="50" cy={EYE_Y} rx="7" ry="5" fill={WHITE} stroke={INK} strokeWidth="1.2" />
          <Iris x={50} y={EYE_Y} rx={4} ry={4} color={a.eyes ?? 'red'} />
        </g>
      ) : (
        <>
          <Eye cx={EYE_L} style={eyeL} color={a.eyes ?? 'darkbrown'} side="l" />
          <Eye cx={EYE_R} style={eyeR} color={a.eyes2 ?? a.eyes ?? 'darkbrown'} side="r" />
          <Brows style={f.brows ?? 'normal'} color={browColor} eyeL={eyeL} eyeR={eyeR} />
        </>
      )}
      <Mouth style={f.mouth ?? 'neutral'} skin={p.skin} />
      <Nose style={f.nose ?? 'small'} skin={p.skin} />

      {front && (
        <g>
          {/* Cel shading: base scura, poi la stessa sagoma alzata in tinta piena → punte delle ciocche in ombra. */}
          <path d={front} fill={hairDark} />
          <g clipPath={`url(#${hairClip})`}>
            <path d={front} transform="translate(0 -2.4)" fill={p.hair} />
            <path d="M38 27 C42 23 48 22 54 22.6 M40 30.4 C43 28 46 27.4 49 27.4" fill="none" stroke={hairHi} strokeWidth="1.5" strokeLinecap="round" opacity="0.85" />
          </g>
          {a.hair2 && (
            <g clipPath={`url(#${hairClip})`}>
              <rect x="50" y="0" width="50" height="100" fill={portraitColor(a.hair2, a.hair2)} />
            </g>
          )}
          {a.hairDetail && <path d={a.hairDetail} fill="none" stroke={hairDark} strokeWidth="0.85" strokeLinecap="round" />}
          <path d={front} fill="none" stroke={INK} strokeWidth="1.25" strokeLinejoin="round" />
        </g>
      )}
      {p.hairStyle === 'bald' && <ellipse cx="43" cy="27" rx="5" ry="2.2" fill={WHITE} opacity="0.3" />}
      {overMarks(m, p, ink, a.fur)}
    </g>
  );
}
