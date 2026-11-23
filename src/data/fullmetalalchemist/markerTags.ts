/**
 * Eventi già esistenti marcati per i filtri della mappa (`WorldConfig.mapMarkers`, vedi `worlds.ts`).
 * Un evento è marcato solo se la sua descrizione lo dice; i marcatori si accendono sui luoghi degli eventi
 * collocati (`locationId`): Central City, Ishval, Fort Briggs, Table City.
 */
export const fmaMarkerTags: Record<string, string[]> = {
  morte: [
    'evt-fma-xerxes-falls', 'evt-fma-ishval-war-of-extermination', 'evt-fma-cornello-exposed-liore', 'evt-fma-tucker-chimera',
    'evt-fma-hughes-killed', 'evt-fma-mustang-kills-lust', 'evt-fma-milos-atlas-unmasked', 'evt-fma-milos-lava-and-independence',
    'evt-fma-greed-allies-with-edward', 'evt-fma-pride-devours-gluttony', 'evt-fma-sloth-killed', 'evt-fma-kimblee-killed',
    'evt-fma-mustang-burns-envy', 'evt-fma-bradley-assault-fu-dies', 'evt-fma-scar-kills-bradley', 'evt-fma-final-battle-father-defeated',
  ],
  omuncoli: [
    'evt-fma-ishval-war-begins', 'evt-fma-xerxes-falls', 'evt-fma-cornello-exposed-liore', 'evt-fma-fifth-laboratory',
    'evt-fma-hughes-killed', 'evt-fma-greed-captures-alphonse', 'evt-fma-bradley-raids-greeds-hideout', 'evt-fma-ling-arrested-ross-framed',
    'evt-fma-mustang-kills-lust', 'evt-fma-bradley-homunculus-exposed', 'evt-fma-inside-gluttony', 'evt-fma-father-disables-alchemy',
    'evt-fma-olivier-and-sloth', 'evt-fma-selim-revealed-as-pride', 'evt-fma-briggs-repels-drachma', 'evt-fma-greed-allies-with-edward',
    'evt-fma-alphonse-captured-pride-gluttony', 'evt-fma-pride-devours-gluttony', 'evt-fma-sloth-killed', 'evt-fma-kimblee-killed',
    'evt-fma-mustang-burns-envy', 'evt-fma-hohenheim-confronts-father', 'evt-fma-bradley-assault-fu-dies', 'evt-fma-scar-kills-bradley',
    'evt-fma-pride-destroyed', 'evt-fma-final-battle-father-defeated',
  ],
  'pietra-filosofale': [
    'evt-fma-cornello-exposed-liore', 'evt-fma-marcoh-research-decoded', 'evt-fma-ling-arrives-in-amestris', 'evt-fma-bradley-raids-greeds-hideout',
    'evt-fma-inside-gluttony', 'evt-fma-father-disables-alchemy', 'evt-fma-marcoh-confesses-ishval-truth', 'evt-fma-olivier-and-sloth',
    'evt-fma-selim-revealed-as-pride', 'evt-fma-briggs-repels-drachma', 'evt-fma-mustang-burns-envy', 'evt-fma-hohenheim-confronts-father',
    'evt-fma-scar-kills-bradley', 'evt-fma-milos-black-bats-and-sanguine-star', 'evt-fma-milos-lava-and-independence',
  ],
};
