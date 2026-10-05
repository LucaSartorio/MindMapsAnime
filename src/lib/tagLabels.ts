import type { Localizable, SupportedLocale } from '@/types';
import { getLocalizedText } from '@/utils/localization';
import { humanizeId } from '@/lib/worldConfig';

/**
 * Etichette localizzate dei `tags`.
 *
 * I tag sono **chiavi**, non testo: `src/lib/series.ts` filtra su `'boruto-era'`
 * e `src/lib/search.ts` ci fa scoring sopra, quindi i valori nei dataset non
 * vanno tradotti (vedi la regola "IDs, slugs, and keys are never translated").
 * Qui si traduce solo l'ETICHETTA mostrata a schermo, con la stessa cascata
 * usata altrove nel progetto:
 *
 *   mappa dei tag noti → `humanizeId(tag)`
 *
 * Un tag sconosciuto — tipicamente un nome proprio (`akatsuki`, `zoldyck`,
 * `hokage`, `team-7`) che resta identico in ogni lingua — ricade su
 * `humanizeId` e viene comunque mostrato in modo leggibile. Aggiungere un tag
 * a un dataset non richiede quindi di toccare questo file.
 */

export const TAG_LABELS: Record<string, Localizable> = {
  /* --- Tag mostrati di nazioni, confini e mondi (nomi propri: stringa unica, uguale in ogni lingua) --- */
  'paese-onorevole': { it: 'Paese onorevole', en: 'Honorable nation', es: 'País honorable', ja: '名誉ある国', fr: 'Pays honorable', de: 'Ehrenwertes Land' },
  hokage: 'Hokage',
  tsuchikage: 'Tsuchikage',
  raikage: 'Raikage',
  pain: 'Pain',
  akatsuki: 'Akatsuki',
  orochimaru: 'Orochimaru',
  sound: { it: 'Suono', en: 'Sound', es: 'Sonido', ja: '音', fr: 'Son', de: 'Klang' },
  kusa: 'Kusagakure',
  taki: 'Takigakure',
  kakuzu: 'Kakuzu',
  hidan: 'Hidan',
  mifune: 'Mifune',
  'team-7': { it: 'Team 7', en: 'Team 7', es: 'Equipo 7', ja: '第七班', fr: 'Équipe 7', de: 'Team 7' },
  sasori: 'Sasori',
  hoshigakure: 'Hoshigakure',
  yukigakure: 'Yukigakure',
  soragakure: 'Soragakure',
  uzumaki: 'Uzumaki',
  fuinjutsu: { it: 'Fūinjutsu', en: 'Fūinjutsu', es: 'Fūinjutsu', ja: '封印術', fr: 'Fūinjutsu', de: 'Fūinjutsu' },
  takigakure: 'Takigakure',
  yugakure: 'Yugakure',
  zabuza: 'Zabuza',
  haku: 'Haku',
  koyuki: 'Koyuki',
  shion: 'Shion',
  yorbian: { it: 'Yorbian', en: 'Yorbian', es: 'Yorbian', ja: 'ヨルビアン', fr: 'Yorbian', de: 'Yorbian' },
  azian: { it: 'Azian', en: 'Azian', es: 'Azian', ja: 'アイジエン', fr: 'Azian', de: 'Azian' },
  calamita: { it: 'Calamità', en: 'Calamities', es: 'Calamidades', ja: '厄災', fr: 'Calamités', de: 'Katastrophen' },
  zoldyck: 'Zoldyck',
  mimbo: 'Mimbo',
  kukanyu: "Kukan'yu",
  saherta: 'Saherta',
  mitene: 'Mitene',
  ngl: { it: 'NGL', en: 'NGL', es: 'NGL', ja: 'NGL', fr: 'NGL', de: 'NGL' },
  kakin: 'Kakin',
  ochima: 'Ochima',
  begerosse: 'Begerosse',
  'east-blue': 'East Blue',
  'north-blue': 'North Blue',
  'west-blue': 'West Blue',
  'south-blue': 'South Blue',
  'grand-line': 'Grand Line',
  paradise: { it: 'Paradise', en: 'Paradise', es: 'Paraíso', ja: '楽園', fr: 'Paradis', de: 'Paradies' },
  'calm-belt': 'Calm Belt',
  'red-line': 'Red Line',
  gt: 'Dragon Ball GT',
  'sfere-del-drago-nere': { it: 'Sfere del Drago Nere', en: 'Black Star Dragon Balls', es: 'Bolas de Dragón Definitivas', ja: '究極のドラゴンボール', fr: 'Dragon Balls noires', de: 'Schwarze Dragon Balls' },
  mura: { it: 'Mura', en: 'Walls', es: 'Murallas', ja: '壁', fr: 'Murs', de: 'Mauern' },
  'wall-maria': { it: 'Wall Maria', en: 'Wall Maria', es: 'Muralla María', ja: 'ウォール・マリア', fr: 'Mur Maria', de: 'Mauer Maria' },
  'wall-rose': { it: 'Wall Rose', en: 'Wall Rose', es: 'Muralla Rose', ja: 'ウォール・ローゼ', fr: 'Mur Rose', de: 'Mauer Rose' },
  'wall-sina': { it: 'Wall Sina', en: 'Wall Sina', es: 'Muralla Sina', ja: 'ウォール・シーナ', fr: 'Mur Sina', de: 'Mauer Sina' },
  capitale: { it: 'Capitale', en: 'Capital', es: 'Capital', ja: '首都', fr: 'Capitale', de: 'Hauptstadt' },
  paradis: { it: 'Paradis', en: 'Paradis', es: 'Paradis', ja: 'パラディ', fr: 'Paradis', de: 'Paradis' },
  eldia: 'Eldia',
  marley: 'Marley',
  isola: { it: 'Isola', en: 'Island', es: 'Isla', ja: '島', fr: 'Île', de: 'Insel' },
  guerrieri: { it: 'Guerrieri', en: 'Warriors', es: 'Guerreros', ja: '戦士', fr: 'Guerriers', de: 'Krieger' },
  guerra: { it: 'Guerra', en: 'War', es: 'Guerra', ja: '戦争', fr: 'Guerre', de: 'Krieg' },
  oriente: { it: 'Oriente', en: 'East', es: 'Oriente', ja: '東洋', fr: 'Orient', de: 'Osten' },
  azumabito: 'Azumabito',
  sentieri: { it: 'Sentieri', en: 'Paths', es: 'Caminos', ja: '道', fr: 'Chemins', de: 'Pfade' },
  coordinate: { it: 'Coordinata', en: 'Coordinate', es: 'Coordenada', ja: '座標', fr: 'Coordonnée', de: 'Koordinate' },
  ymir: 'Ymir',
  mondo: { it: 'Mondo', en: 'World', es: 'Mundo', ja: '世界', fr: 'Monde', de: 'Welt' },
  karakura: 'Karakura',
  umani: { it: 'Umani', en: 'Humans', es: 'Humanos', ja: '人間', fr: 'Humains', de: 'Menschen' },
  'gotei-13': { it: 'Gotei 13', en: 'Gotei 13', es: 'Gotei 13', ja: '護廷十三隊', fr: 'Gotei 13', de: 'Gotei 13' },
  hollow: 'Hollow',
  arrancar: 'Arrancar',
  dimensione: { it: 'Dimensione', en: 'Dimension', es: 'Dimensión', ja: '次元', fr: 'Dimension', de: 'Dimension' },
  senkaimon: 'Senkaimon',
  're-delle-anime': { it: 'Re delle Anime', en: 'Soul King', es: 'Rey de las Almas', ja: '霊王', fr: 'Roi des Âmes', de: 'Seelenkönig' },
  'divisione-zero': { it: 'Divisione Zero', en: 'Squad Zero', es: 'División Cero', ja: '零番隊', fr: 'Division Zéro', de: 'Division Null' },
  quincy: 'Quincy',
  yhwach: 'Yhwach',
  inferno: { it: 'Inferno', en: 'Hell', es: 'Infierno', ja: '地獄', fr: 'Enfer', de: 'Hölle' },
  'one-shot': { it: 'One-shot', en: 'One-shot', es: 'One-shot', ja: '読切', fr: 'One-shot', de: 'One-Shot' },
  prefettura: { it: 'Prefettura', en: 'Prefecture', es: 'Prefectura', ja: '都道府県', fr: 'Préfecture', de: 'Präfektur' },
  regno: { it: 'Regno', en: 'Kingdom', es: 'Reino', ja: '王国', fr: 'Royaume', de: 'Königreich' },
  clover: { it: 'Clover', en: 'Clover', es: 'Trébol', ja: 'クローバー', fr: 'Clover', de: 'Clover' },
  'cavalieri-magici': { it: 'Cavalieri Magici', en: 'Magic Knights', es: 'Caballeros Mágicos', ja: '魔法騎士団', fr: 'Chevaliers-Mages', de: 'Magische Ritter' },
  diamond: { it: 'Diamond', en: 'Diamond', es: 'Diamante', ja: 'ダイヤモンド', fr: 'Diamant', de: 'Diamant' },
  'maghi-guerrieri': { it: 'Maghi guerrieri', en: 'Mage warriors', es: 'Magos guerreros', ja: '魔道戦士', fr: 'Mages guerriers', de: 'Magierkrieger' },
  spade: { it: 'Spade', en: 'Spade', es: 'Pica', ja: 'スペード', fr: 'Pique', de: 'Pik' },
  'triade-oscura': { it: 'Triade Oscura', en: 'Dark Triad', es: 'Tríada Oscura', ja: '漆黒の三極性', fr: 'Triade Obscure', de: 'Dunkle Triade' },
  heart: { it: 'Heart', en: 'Heart', es: 'Corazón', ja: 'ハート', fr: 'Cœur', de: 'Herz' },
  'spirit-guardian': { it: 'Guardiano dello spirito', en: 'Spirit Guardian', es: 'Guardián del espíritu', ja: '精霊守', fr: "Gardien d'esprit", de: 'Geisterwächter' },
  elfi: { it: 'Elfi', en: 'Elves', es: 'Elfos', ja: 'エルフ', fr: 'Elfes', de: 'Elfen' },
  'villaggio-nascosto': { it: 'Villaggio nascosto', en: 'Hidden village', es: 'Aldea oculta', ja: '隠れ里', fr: 'Village caché', de: 'Verborgenes Dorf' },
  'paese-del-sole': { it: 'Paese del Sol Levante', en: 'Land of the Rising Sun', es: 'País del Sol Naciente', ja: '日ノ国', fr: 'Pays du Soleil Levant', de: 'Land der aufgehenden Sonne' },
  ki: 'Ki',
  yami: 'Yami',
  neutrale: { it: 'Neutrale', en: 'Neutral', es: 'Neutral', ja: '中立', fr: 'Neutre', de: 'Neutral' },
  dungeon: { it: 'Dungeon', en: 'Dungeon', es: 'Mazmorra', ja: 'ダンジョン', fr: 'Donjon', de: 'Dungeon' },
  streghe: { it: 'Streghe', en: 'Witches', es: 'Brujas', ja: '魔女', fr: 'Sorcières', de: 'Hexen' },
  diavoli: { it: 'Diavoli', en: 'Devils', es: 'Demonios', ja: '悪魔', fr: 'Démons', de: 'Teufel' },
  inframondo: { it: 'Inframondo', en: 'Underworld', es: 'Inframundo', ja: '冥域', fr: 'Monde souterrain', de: 'Unterwelt' },
  'yuki tabata': 'Yūki Tabata',
  /* --- Generi e temi (tag dei mondi) --- */
  shonen: { it: 'Shōnen', en: 'Shōnen', ja: '少年', fr: 'Shōnen', de: 'Shōnen', es: 'Shōnen' },
  azione: { it: 'Azione', en: 'Action', ja: 'アクション', fr: 'Action', de: 'Action', es: 'Acción' },
  fantasy: {
    it: 'Fantasy', en: 'Fantasy', ja: 'ファンタジー',
    fr: 'Fantasy', de: 'Fantasy', es: 'Fantasía',
  },
  ninja: { it: 'Ninja', en: 'Ninja', ja: '忍者', fr: 'Ninja', de: 'Ninja', es: 'Ninja' },
  pirati: {
    it: 'Pirati', en: 'Pirates', ja: '海賊',
    fr: 'Pirates', de: 'Piraten', es: 'Piratas',
  },
  'arti marziali': {
    it: 'Arti marziali', en: 'Martial arts', ja: '武術',
    fr: 'Arts martiaux', de: 'Kampfkunst', es: 'Artes marciales',
  },
  hunter: {
    it: 'Hunter', en: 'Hunters', ja: 'ハンター',
    fr: 'Hunters', de: 'Hunter', es: 'Hunters',
  },
  titani: {
    it: 'Giganti', en: 'Titans', ja: '巨人',
    fr: 'Titans', de: 'Titanen', es: 'Titanes',
  },
  shinigami: {
    it: 'Shinigami', en: 'Soul Reapers', ja: '死神',
    fr: 'Shinigami', de: 'Shinigami', es: 'Segadores de almas',
  },
  alchimia: {
    it: 'Alchimia', en: 'Alchemy', ja: '錬金術',
    fr: 'Alchimie', de: 'Alchemie', es: 'Alquimia',
  },
  magia: { it: 'Magia', en: 'Magic', ja: '魔法', fr: 'Magie', de: 'Magie', es: 'Magia' },
  gourmet: {
    it: 'Gourmet', en: 'Gourmet', ja: 'グルメ',
    fr: 'Gastronomie', de: 'Gourmet', es: 'Gourmet',
  },
  gilde: {
    it: 'Gilde', en: 'Guilds', ja: 'ギルド',
    fr: 'Guildes', de: 'Gilden', es: 'Gremios',
  },
  stregoni: {
    it: 'Stregoni', en: 'Sorcerers', ja: '呪術師',
    fr: 'Exorcistes', de: 'Jujutsu-Zauberer', es: 'Hechiceros',
  },
  demoni: {
    it: 'Demoni', en: 'Demons', ja: '鬼',
    fr: 'Démons', de: 'Dämonen', es: 'Demonios',
  },

  /* --- Autori: identici in alfabeto latino, in kanji per il giapponese --- */
  'masashi kishimoto': {
    it: 'Masashi Kishimoto', en: 'Masashi Kishimoto', ja: '岸本斉史',
    fr: 'Masashi Kishimoto', de: 'Masashi Kishimoto', es: 'Masashi Kishimoto',
  },
  'yoshihiro togashi': {
    it: 'Yoshihiro Togashi', en: 'Yoshihiro Togashi', ja: '冨樫義博',
    fr: 'Yoshihiro Togashi', de: 'Yoshihiro Togashi', es: 'Yoshihiro Togashi',
  },
  'eiichiro oda': {
    it: 'Eiichiro Oda', en: 'Eiichiro Oda', ja: '尾田栄一郎',
    fr: 'Eiichiro Oda', de: 'Eiichiro Oda', es: 'Eiichiro Oda',
  },
  'akira toriyama': {
    it: 'Akira Toriyama', en: 'Akira Toriyama', ja: '鳥山明',
    fr: 'Akira Toriyama', de: 'Akira Toriyama', es: 'Akira Toriyama',
  },
  'hajime isayama': {
    it: 'Hajime Isayama', en: 'Hajime Isayama', ja: '諫山創',
    fr: 'Hajime Isayama', de: 'Hajime Isayama', es: 'Hajime Isayama',
  },
  'tite kubo': {
    it: 'Tite Kubo', en: 'Tite Kubo', ja: '久保帯人',
    fr: 'Tite Kubo', de: 'Tite Kubo', es: 'Tite Kubo',
  },
  'hiromu arakawa': {
    it: 'Hiromu Arakawa', en: 'Hiromu Arakawa', ja: '荒川弘',
    fr: 'Hiromu Arakawa', de: 'Hiromu Arakawa', es: 'Hiromu Arakawa',
  },
  'kanehito yamada': {
    it: 'Kanehito Yamada', en: 'Kanehito Yamada', ja: '山田鐘人',
    fr: 'Kanehito Yamada', de: 'Kanehito Yamada', es: 'Kanehito Yamada',
  },
  'mitsutoshi shimabukuro': {
    it: 'Mitsutoshi Shimabukuro', en: 'Mitsutoshi Shimabukuro', ja: '島袋光年',
    fr: 'Mitsutoshi Shimabukuro', de: 'Mitsutoshi Shimabukuro', es: 'Mitsutoshi Shimabukuro',
  },
  'hiro mashima': {
    it: 'Hiro Mashima', en: 'Hiro Mashima', ja: '真島ヒロ',
    fr: 'Hiro Mashima', de: 'Hiro Mashima', es: 'Hiro Mashima',
  },
  'gege akutami': {
    it: 'Gege Akutami', en: 'Gege Akutami', ja: '芥見下々',
    fr: 'Gege Akutami', de: 'Gege Akutami', es: 'Gege Akutami',
  },
  'koyoharu gotouge': {
    it: 'Koyoharu Gotouge', en: 'Koyoharu Gotouge', ja: '吾峠呼世晴',
    fr: 'Koyoharu Gotouge', de: 'Koyoharu Gotouge', es: 'Koyoharu Gotouge',
  },

  /* --- Riviste / editori --- */
  jump: {
    it: 'Weekly Shōnen Jump', en: 'Weekly Shōnen Jump', ja: '週刊少年ジャンプ',
    fr: 'Weekly Shōnen Jump', de: 'Weekly Shōnen Jump', es: 'Weekly Shōnen Jump',
  },
  kodansha: {
    it: 'Kōdansha', en: 'Kōdansha', ja: '講談社',
    fr: 'Kōdansha', de: 'Kōdansha', es: 'Kōdansha',
  },
  shogakukan: {
    it: 'Shōgakukan', en: 'Shōgakukan', ja: '小学館',
    fr: 'Shōgakukan', de: 'Shōgakukan', es: 'Shōgakukan',
  },
  'square enix': {
    it: 'Square Enix', en: 'Square Enix', ja: 'スクウェア・エニックス',
    fr: 'Square Enix', de: 'Square Enix', es: 'Square Enix',
  },

  /* --- Geografia e ambienti (tag di nazioni e confini) --- */
  mare: { it: 'Mare', en: 'Sea', ja: '海', fr: 'Mer', de: 'Meer', es: 'Mar' },
  isole: { it: 'Isole', en: 'Islands', ja: '島々', fr: 'Îles', de: 'Inseln', es: 'Islas' },
  continente: {
    it: 'Continente', en: 'Continent', ja: '大陸',
    fr: 'Continent', de: 'Kontinent', es: 'Continente',
  },
  deserto: {
    it: 'Deserto', en: 'Desert', ja: '砂漠',
    fr: 'Désert', de: 'Wüste', es: 'Desierto',
  },
  foresta: { it: 'Foresta', en: 'Forest', ja: '森', fr: 'Forêt', de: 'Wald', es: 'Bosque' },
  foreste: {
    it: 'Foreste', en: 'Forests', ja: '森林',
    fr: 'Forêts', de: 'Wälder', es: 'Bosques',
  },
  montagne: {
    it: 'Montagne', en: 'Mountains', ja: '山地',
    fr: 'Montagnes', de: 'Berge', es: 'Montañas',
  },
  valli: { it: 'Valli', en: 'Valleys', ja: '谷', fr: 'Vallées', de: 'Täler', es: 'Valles' },
  praterie: {
    it: 'Praterie', en: 'Grasslands', ja: '草原',
    fr: 'Prairies', de: 'Grasland', es: 'Praderas',
  },
  cascate: {
    it: 'Cascate', en: 'Waterfalls', ja: '滝',
    fr: 'Cascades', de: 'Wasserfälle', es: 'Cascadas',
  },
  rocce: { it: 'Rocce', en: 'Rocks', ja: '岩', fr: 'Roches', de: 'Felsen', es: 'Rocas' },
  sabbia: { it: 'Sabbia', en: 'Sand', ja: '砂', fr: 'Sable', de: 'Sand', es: 'Arena' },
  gelo: { it: 'Gelo', en: 'Ice', ja: '氷', fr: 'Glace', de: 'Eis', es: 'Hielo' },
  nebbia: { it: 'Nebbia', en: 'Mist', ja: '霧', fr: 'Brume', de: 'Nebel', es: 'Niebla' },
  pioggia: { it: 'Pioggia', en: 'Rain', ja: '雨', fr: 'Pluie', de: 'Regen', es: 'Lluvia' },
  terme: {
    it: 'Terme', en: 'Hot springs', ja: '温泉',
    fr: 'Sources chaudes', de: 'Thermen', es: 'Termas',
  },
  ponte: { it: 'Ponte', en: 'Bridge', ja: '橋', fr: 'Pont', de: 'Brücke', es: 'Puente' },
  nord: { it: 'Nord', en: 'North', ja: '北', fr: 'Nord', de: 'Norden', es: 'Norte' },
  terra: { it: 'Terra', en: 'Earth', ja: '土', fr: 'Terre', de: 'Erde', es: 'Tierra' },
  fire: { it: 'Fuoco', en: 'Fire', ja: '火', fr: 'Feu', de: 'Feuer', es: 'Fuego' },
  fulmine: {
    it: 'Fulmine', en: 'Lightning', ja: '雷',
    fr: 'Foudre', de: 'Blitz', es: 'Rayo',
  },
  foglia: { it: 'Foglia', en: 'Leaf', ja: '木ノ葉', fr: 'Feuille', de: 'Blatt', es: 'Hoja' },
  iron: { it: 'Ferro', en: 'Iron', ja: '鉄', fr: 'Fer', de: 'Eisen', es: 'Hierro' },
  tea: { it: 'Tè', en: 'Tea', ja: '茶', fr: 'Thé', de: 'Tee', es: 'Té' },
  rice: { it: 'Riso', en: 'Rice', ja: '稲', fr: 'Riz', de: 'Reis', es: 'Arroz' },
  samurai: {
    it: 'Samurai', en: 'Samurai', ja: '侍',
    fr: 'Samouraï', de: 'Samurai', es: 'Samurái',
  },
  successione: {
    it: 'Successione', en: 'Succession', ja: '継承',
    fr: 'Succession', de: 'Nachfolge', es: 'Sucesión',
  },

  /* --- Razze e luoghi ricorrenti --- */
  saiyan: {
    it: 'Saiyan', en: 'Saiyan', ja: 'サイヤ人',
    fr: 'Saiyan', de: 'Saiyajin', es: 'Saiyan',
  },
  namecciani: {
    it: 'Namecciani', en: 'Namekians', ja: 'ナメック星人',
    fr: 'Neks', de: 'Namekianer', es: 'Namekianos',
  },
  tsufuru: {
    it: 'Tsufuru', en: 'Tuffles', ja: 'ツフル人',
    fr: 'Tuffles', de: 'Tuffles', es: 'Tsufuru',
  },
  aldila: {
    it: 'Aldilà', en: 'Afterlife', ja: 'あの世',
    fr: 'Au-delà', de: 'Jenseits', es: 'Más allá',
  },
  'universo-7': {
    it: 'Universo 7', en: 'Universe 7', ja: '第7宇宙',
    fr: 'Univers 7', de: 'Universum 7', es: 'Universo 7',
  },
  'pianeta-distrutto': {
    it: 'Pianeta distrutto', en: 'Destroyed planet', ja: '消滅した惑星',
    fr: 'Planète détruite', de: 'Zerstörter Planet', es: 'Planeta destruido',
  },
  'chimera-ant': {
    it: 'Formicheliante', en: 'Chimera Ant', ja: 'キメラアント',
    fr: 'Fourmi-Chimère', de: 'Chimären-Ameise', es: 'Hormiga Quimera',
  },
  'continente-oscuro': {
    it: 'Continente Oscuro', en: 'Dark Continent', ja: '暗黒大陸',
    fr: 'Continent Obscur', de: 'Dunkler Kontinent', es: 'Continente Oscuro',
  },
  'nuovo-continente': {
    it: 'Nuovo Continente', en: 'New Continent', ja: '新大陸',
    fr: 'Nouveau Continent', de: 'Neuer Kontinent', es: 'Nuevo Continente',
  },
  'hunter-exam': {
    it: 'Esame da Hunter', en: 'Hunter Exam', ja: 'ハンター試験',
    fr: 'Examen Hunter', de: 'Hunter-Prüfung', es: 'Examen de Hunter',
  },
  'new-world': {
    it: 'Nuovo Mondo', en: 'New World', ja: '新世界',
    fr: 'Nouveau Monde', de: 'Neue Welt', es: 'Nuevo Mundo',
  },
  'kage-summit': {
    it: 'Summit dei Kage', en: 'Kage Summit', ja: '五影会談',
    fr: 'Sommet des Kage', de: 'Kage-Gipfel', es: 'Cumbre de los Kage',
  },

  /* --- Metadati di canonicità --- */
  'anime-only': {
    it: 'Solo anime', en: 'Anime only', ja: 'アニメオリジナル',
    fr: 'Anime uniquement', de: 'Nur Anime', es: 'Solo anime',
  },
  filler: {
    it: 'Filler', en: 'Filler', ja: 'フィラー',
    fr: 'Filler', de: 'Filler', es: 'Relleno',
  },
  movie: {
    it: 'Film', en: 'Movie', ja: '劇場版',
    fr: 'Film', de: 'Film', es: 'Película',
  },
  destroyed: {
    it: 'Distrutto', en: 'Destroyed', ja: '破壊済み',
    fr: 'Détruit', de: 'Zerstört', es: 'Destruido',
  },
};

/**
 * Etichetta localizzata di un tag. I nomi propri (personaggi, clan, villaggi)
 * non sono in mappa e ricadono su `humanizeId`, che li rende leggibili senza
 * tradurli — è il comportamento voluto: "Akatsuki" resta "Akatsuki" ovunque.
 */
export function getTagLabel(tag: string, locale: SupportedLocale): string {
  const known = TAG_LABELS[tag];
  return known ? getLocalizedText(known, locale) : humanizeId(tag);
}

/** Elenco dei tag con etichetta nota (usato dai test di copertura). */
export function knownTagIds(): string[] {
  return Object.keys(TAG_LABELS);
}
