import type { SourceNames } from '@/data/shared/translations';

/**
 * Nomi it/en che differiscono dal `name` dei dati o lo correggono (doppiaggi ed
 * edizioni ufficiali): personaggi, epiteti, gradi, clan, tecniche, luoghi.
 * Chiavi = quelle degli overlay (vedi `withSourceNames`, docs/I18N.md).
 */
export const bcNames: SourceNames = {
  "locations[loc-bc-silver-eagle-base].localizedName": { it: "Base dell'Aquila d'Argento", en: "Silver Eagles base" },
  "locations[loc-bc-crimson-lion-base].localizedName": { it: "Base del Leone Cremisi", en: "Crimson Lions base" },
  "locations[loc-bc-coral-peacock-base].localizedName": { it: "Base del Pavone di Corallo", en: "Coral Peacocks base" },
  "locations[loc-bc-purple-orca-base].localizedName": { it: "Base dell'Orca Viola", en: "Purple Orcas base" },
  "locations[loc-bc-capital-return].localizedName": { it: "Torna alla mappa del mondo", en: "Back to the world map" },
  "locations[loc-bc-spade-return].localizedName": { it: "Torna alla mappa del mondo", en: "Back to the world map" },
  "locations[loc-bc-heart-return].localizedName": { it: "Torna alla mappa del mondo", en: "Back to the world map" },
  "locations[loc-bc-diamond-return].localizedName": { it: "Torna alla mappa del mondo", en: "Back to the world map" },
  "characters[char-bc-asta].aliases[0]": { it: "Il ragazzo senza magia", en: "The boy without magic" },
  "characters[char-bc-asta].aliases[1]": { it: "Il Cavaliere Magico Diabolico", en: "The Devil Magic Knight" },
  "characters[char-bc-yami].aliases[0]": { it: "Il capitano del Toro Nero", en: "The Black Bulls captain" },
  "characters[char-bc-yuno].aliases[1]": { it: "Principe di Spade", en: "Prince of Spade" },
  "characters[char-bc-mereoleona].aliases[0]": { it: "La leonessa infernale", en: "The infernal lioness" },
  "characters[char-bc-julius].aliases[0]": { it: "28° Imperatore Magico", en: "28th Wizard King" },
  "characters[char-bc-lumiere].aliases[0]": { it: "Primo Imperatore Magico", en: "First Wizard King" },
  "characters[char-bc-patry].aliases[1]": { it: "Licht (falso)", en: "Licht (fake)" },
  "characters[char-bc-fana-elf].localizedName": { it: "Fana la Senza Amore", en: "Fana the Hateful" },
  "factions[faction-bc-silver-eagle].localizedName": { it: "Aquila d'Argento", en: "Silver Eagles" },
  "factions[faction-bc-crimson-lion].localizedName": { it: "Leone Cremisi", en: "Crimson Lions" },
  "factions[faction-bc-coral-peacock].localizedName": { it: "Pavone di Corallo", en: "Coral Peacocks" },
  "factions[faction-bc-purple-orca].localizedName": { it: "Orca Viola", en: "Purple Orcas" },
};
