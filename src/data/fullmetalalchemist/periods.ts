import type { Localizable } from '@/types';

/**
 * Periodi della timeline (valori fissi, così il filtro non si frammenta). Il manga non ha un
 * calendario ufficiale consultato: i periodi sono fasi editoriali ancorate ai capitoli.
 */
export const P = {
  remote: { it: 'Passato remoto (retroscena)', en: 'Distant past (backstory)' },
  backstory: { it: 'Retroscena (prima del capitolo 1)', en: 'Backstory (before chapter 1)' },
  start: { it: "L'inizio della ricerca (capp. 1-19)", en: 'The search begins (ch. 1-19)' },
  homunculi: { it: 'Dublith e gli Homunculi (capp. 20-56)', en: 'Dublith and the Homunculi (ch. 20-56)' },
  ishval: { it: 'Ishval e il Nord (capp. 57-83)', en: 'Ishval and the North (ch. 57-83)' },
  promised: { it: 'Il Giorno Promesso (capp. 84-108)', en: 'The Promised Day (ch. 84-108)' },
  epilogue: { it: 'Epilogo (fine della storia)', en: 'Epilogue (end of the story)' },
  film: { it: 'Materiale originale (film)', en: 'Original material (film)' },
} satisfies Record<string, Localizable>;
