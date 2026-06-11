import type { Faction } from '@/types';

/**
 * Le tre Armi Ancestrali di One Piece, inserite tra «ciurme e organizzazioni»
 * come voci a sé: chi sono / cosa sono, dove si trovano e chi vi è legato.
 * Forgiate o nate nel Secolo Vuoto, hanno potenza sufficiente a distruggere il
 * mondo; il loro nome è preso dagli dèi (Plutone, Poseidon, Uranus).
 */
export const onepieceFactionsWeapons: Faction[] = [
  {
    id: 'faction-op-pluton',
    worldId: 'world-onepiece',
    type: 'organization',
    name: 'Pluton',
    localizedName: { it: 'Plutone (Arma Ancestrale)', en: 'Pluton (Ancient Weapon)' },
    description: {
      it: "Arma Ancestrale: una colossale corazzata capace di radere al suolo un'intera isola con un solo colpo.",
      en: "Ancient Weapon: a colossal battleship able to raze an entire island with a single blow.",
    },
    longDescription: {
      it: "Plutone è la nave da guerra più potente mai costruita. I suoi progetti furono tramandati di nascosto dai carpentieri di Water Seven — da Tom all'allievo Cutty Flam (Franky), che alla fine li bruciò per impedirne l'abuso. La nave originale, costruita nel Secolo Vuoto, giace nascosta nel Paese di Wano: il Poneglyph della Tomba Reale di Alabasta — bramato da Crocodile — ne custodiva l'ubicazione.",
      en: "Pluton is the most powerful battleship ever built. Its blueprints were passed down secretly by the shipwrights of Water Seven — from Tom to his apprentice Cutty Flam (Franky), who finally burned them to prevent their misuse. The original ship, built in the Void Century, lies hidden in the Wano Country: the Poneglyph in Alabasta's Royal Tomb — coveted by Crocodile — held its location.",
    },
    characterIds: ['char-op-franky', 'char-op-tom', 'char-op-iceburg', 'char-op-crocodile'],
    locationIds: ['loc-op-wano', 'loc-op-water-seven', 'loc-op-alabasta'],
    canonStatus: 'canon',
    referenceStatus: 'verified',
    tags: ['arma-ancestrale', 'plutone', 'secolo-vuoto'],
  },
  {
    id: 'faction-op-poseidon',
    worldId: 'world-onepiece',
    type: 'organization',
    name: 'Poseidon',
    localizedName: { it: 'Poseidon (Arma Ancestrale)', en: 'Poseidon (Ancient Weapon)' },
    description: {
      it: "Arma Ancestrale «vivente»: non un oggetto, ma una Principessa Sirena capace di comandare i giganteschi Re del Mare.",
      en: "A 'living' Ancient Weapon: not an object, but a Mermaid Princess able to command the giant Sea Kings.",
    },
    longDescription: {
      it: "Poseidon è il titolo che spetta a una rarissima sirena in grado di richiamare e dare ordini ai Re del Mare, creature capaci di affondare interi continenti. L'attuale Poseidon è la principessa Shirahoshi dell'Isola degli Uomini-Pesce. Nel Secolo Vuoto, Joy Boy strinse un patto con la Poseidon dell'epoca e le lasciò il Poneglyph delle scuse nella Foresta Marina.",
      en: "Poseidon is the title borne by an extremely rare mermaid able to call and command the Sea Kings, creatures capable of sinking whole continents. The current Poseidon is Princess Shirahoshi of Fish-Man Island. In the Void Century, Joy Boy made a pact with the Poseidon of that age and left her the apology Poneglyph in the Sea Forest.",
    },
    leaderIds: ['char-op-shirahoshi'],
    characterIds: ['char-op-shirahoshi'],
    locationIds: ['loc-op-fishman-island'],
    canonStatus: 'canon',
    referenceStatus: 'verified',
    tags: ['arma-ancestrale', 'poseidon', 'sirene', 'shirahoshi'],
  },
  {
    id: 'faction-op-uranus',
    worldId: 'world-onepiece',
    type: 'organization',
    name: 'Uranus',
    localizedName: { it: 'Uranus (Arma Ancestrale)', en: 'Uranus (Ancient Weapon)' },
    description: {
      it: "Arma Ancestrale: la più misteriosa delle tre, la cui vera natura non è ancora del tutto svelata.",
      en: "Ancient Weapon: the most mysterious of the three, whose true nature is not yet fully revealed.",
    },
    longDescription: {
      it: "Di Uranus si sa pochissimo. Indizi recenti la collegano al cielo e all'energia delle «fiamme» del Primo Mondo: la «Mother Flame» — l'arma con cui Imu ha cancellato dalle mappe il Regno di Lulusia — sembra esserne una manifestazione o una ricreazione. È custodita tra i segreti del Governo Mondiale a Mary Geoise.",
      en: "Very little is known about Uranus. Recent clues tie it to the sky and the energy of the First World's 'flames': the 'Mother Flame' — the weapon with which Imu wiped the Lulusia Kingdom off the maps — appears to be a manifestation or recreation of it. It is kept among the World Government's secrets at Mary Geoise.",
    },
    characterIds: ['char-op-imu', 'char-op-vegapunk'],
    locationIds: ['loc-op-mary-geoise', 'loc-op-lulusia-kingdom'],
    canonStatus: 'canon',
    referenceStatus: 'verified',
    tags: ['arma-ancestrale', 'uranus', 'mother-flame', 'imu'],
  },
];
