import type { Jutsu } from '@/types';

/**
 * Frutti del Diavolo mancanti + le tre forme dell’Ambizione (Haki), modellate
 * come abilità con `type: 'haki'` (categoria aggiunta al WorldConfig di One Piece).
 */
const J = (
  id: string, name: string, nit: string, nen: string,
  type: 'paramecia' | 'zoan' | 'logia' | 'haki', characterIds: string[],
  it: string, en: string, lit: string, len: string, tags: string[],
): Jutsu => ({
  id, worldId: 'world-onepiece', name,
  localizedName: { it: nit, en: nen },
  type, characterIds,
  shortDescription: { it, en },
  longDescription: { it: lit, en: len },
  canonStatus: 'canon', referenceStatus: 'verified',
  tags: type === 'haki' ? ['ambizione', 'haki', ...tags] : ['frutto-del-diavolo', type, ...tags],
});

export const onepieceDevilFruitsExtra3: Jutsu[] = [
  /* ---------------------- Frutti mancanti ---------------------- */
  J('fruit-op-kira-kira', 'Kira Kira no Mi', 'Frutto Splendore Splendore', 'Glint-Glint Fruit', 'paramecia', ['char-op-jozu'],
    "Permette di trasformare il corpo — o parti di esso — in diamante indistruttibile.",
    "Lets the user turn their body — or parts of it — into indestructible diamond.",
    "Paramecia di Jozu «Diamante», terzo comandante di Barbabianca: il diamante è la sostanza naturale più dura, e ne fa al tempo stesso una corazza impenetrabile e un’arma da urto devastante.",
    "The Paramecia of Jozu 'Diamond', Whitebeard's third-division commander: diamond is the hardest natural substance, making it both an impenetrable armor and a devastating striking weapon.",
    ['jozu', 'barbabianca']),
  J('fruit-op-sube-sube', 'Sube Sube no Mi', 'Frutto Sdrucciola Sdrucciola', 'Slip-Slip Fruit', 'paramecia', ['char-op-alvida'],
    "Rende la pelle perfettamente liscia: ogni attacco e ogni oggetto scivolano via.",
    "Makes the skin perfectly smooth: every attack and object slides right off.",
    "Paramecia di Alvida: oltre a deviare i colpi, ne lisciò il corpo eliminando ogni imperfezione, trasformando la temuta «Mazza Chiodata» in una donna affascinante.",
    "Alvida's Paramecia: besides deflecting blows, it smoothed her body of every blemish, turning the feared 'Iron Mace' into an alluring woman.",
    ['alvida', 'east-blue']),
  J('fruit-op-kobu-kobu', 'Kobu Kobu no Mi', 'Frutto Incita Incita', 'Rouse-Rouse Fruit', 'paramecia', ['char-op-betty'],
    "Risveglia e amplifica il potenziale nascosto degli altri, spronando le folle alla rivolta.",
    "Awakens and amplifies others' hidden potential, rousing crowds to revolt.",
    "Paramecia di Belo Betty, comandante dei Rivoluzionari: sventolando la sua bandiera può far emergere la forza latente di chiunque, trasformando un popolo oppresso in un esercito.",
    "The Paramecia of Belo Betty, a Revolutionary commander: by waving her flag she can draw out anyone's latent strength, turning an oppressed people into an army.",
    ['betty', 'rivoluzionari']),
  J('fruit-op-inu-inu-dachshund', 'Inu Inu no Mi, Model: Dachshund', 'Frutto Cane Cane (Bassotto)', 'Dog-Dog Fruit, Model: Dachshund', 'zoan', ['char-op-mr-4'],
    "Frutto Zoan mangiato da un’arma: Lassoo, il cane-fucile di Mr. 4, che spara palle esplosive.",
    "A Zoan fruit eaten by a weapon: Lassoo, Mr. 4's dog-gun, which fires explosive cannonballs.",
    "Esempio di Frutto Zoan dato in pasto a un oggetto: il fucile Lassoo è diventato un bassotto vivente capace di sparare proiettili esplosivi, usato dall’agente Mr. 4 della Baroque Works.",
    "An example of a Zoan fruit fed to an object: the gun Lassoo became a living dachshund able to fire explosive shells, used by Baroque Works' agent Mr. 4.",
    ['baroque-works', 'arma-vivente']),
  J('fruit-op-smile', 'SMILE', 'SMILE (frutto artificiale)', 'SMILE (artificial fruit)', 'zoan', ['char-op-holdem', 'char-op-page-one', 'char-op-ulti', 'char-op-sasaki'],
    "Frutti Zoan artificiali prodotti da Caesar e Kaido: danno poteri animali ma cancellano ogni emozione tranne il riso.",
    "Artificial Zoan fruits produced by Caesar and Kaido: they grant animal powers but erase every emotion except laughter.",
    "Sintetizzati dai frutti Sara Sara e prodotti in serie nella fabbrica di Dressrosa, gli SMILE funzionano solo per una persona su dieci; chi fallisce non ride mai più. Sono la base dell’esercito di «gifter» dei Pirati delle Cento Bestie.",
    "Synthesized from Sara Sara fruits and mass-produced in the Dressrosa factory, SMILEs work for only one person in ten; those who fail can never laugh again. They are the basis of the Beasts Pirates' 'gifter' army.",
    ['cento-bestie', 'artificiale', 'dressrosa']),

  /* ---------------------- Ambizione (Haki) ---------------------- */
  J('haki-op-observation', 'Kenbunshoku Haki', 'Ambizione dell’Osservazione', 'Observation Haki', 'haki',
    ['char-op-luffy', 'char-op-katakuri', 'char-op-enel', 'char-op-tama'],
    "Permette di percepire la presenza, le emozioni e le intenzioni altrui, anticipandone le mosse.",
    "Lets the user sense others' presence, emotions and intent, anticipating their moves.",
    "Detta «Mantra» a Skypiea, affina i sensi fino a «vedere» il nemico a occhi chiusi. Spinta all’estremo, come in Katakuri, consente di scorgere brevi sprazzi del futuro.",
    "Called 'Mantra' in Skypiea, it sharpens the senses until one can 'see' a foe with eyes closed. Pushed to the limit, as with Katakuri, it allows glimpses of the near future.",
    ['osservazione', 'mantra']),
  J('haki-op-armament', 'Busoshoku Haki', 'Ambizione dell’Armatura', 'Armament Haki', 'haki',
    ['char-op-luffy', 'char-op-rayleigh', 'char-op-zoro', 'char-op-sanji', 'char-op-hyogoro'],
    "Crea un’armatura invisibile che indurisce il corpo e colpisce persino gli utenti Logia.",
    "Creates an invisible armor that hardens the body and can strike even Logia users.",
    "Riveste arti e armi di un’energia simile a metallo nero, annullando l’intangibilità dei Logia. Il livello avanzato (il «Ryuo» di Wano) permette di proiettare l’Ambizione all’interno del bersaglio, oltre la difesa.",
    "It coats limbs and weapons in a black-metal-like energy, negating Logia intangibility. The advanced level (Wano's 'Ryuo') lets one project the Haki inside a target, past its defenses.",
    ['armatura', 'ryuo']),
  J('haki-op-conqueror', 'Haoshoku Haki', 'Ambizione del Re Conquistatore', 'Conqueror’s Haki', 'haki',
    ['char-op-luffy', 'char-op-shanks', 'char-op-roger', 'char-op-kaido', 'char-op-big-mom', 'char-op-katakuri', 'char-op-yamato'],
    "Rarissima: impone la propria volontà, facendo svenire i deboli di spirito. La possiede solo chi ha l’animo di un re.",
    "Extremely rare: it imposes one's will, knocking out the weak-spirited. Only those with the spirit of a king have it.",
    "Non si può allenare, solo affinare: un utente su milioni la possiede. Chi la padroneggia può rivestirla sui propri colpi (il «lampo» nero), come fanno Roger, Shanks, Rufy e gli Imperatori.",
    "It cannot be trained, only refined: one in a million has it. Masters can coat their attacks with it (the black 'lightning'), as do Roger, Shanks, Luffy and the Emperors.",
    ['conquistatore', 'imperatori']),
];
