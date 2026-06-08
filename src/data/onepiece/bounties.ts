import type { BountyEntry } from '@/types';

/**
 * Progressione delle taglie dei personaggi di One Piece, in ordine cronologico
 * crescente, con il capitolo del manga e l'episodio dell'anime in cui ciascuna
 * taglia viene mostrata. Mappato per id personaggio e unito al dataset in `index.ts`.
 * Gli importi sono in Berry (฿).
 */
const b = (
  amount: string, mangaChapter?: string, animeEpisode?: string, nit?: string, nen?: string,
): BountyEntry => ({
  amount,
  ...(mangaChapter ? { mangaChapter } : {}),
  ...(animeEpisode ? { animeEpisode } : {}),
  ...(nit && nen ? { note: { it: nit, en: nen } } : {}),
});

export const onepieceBounties: Record<string, BountyEntry[]> = {
  /* ---------------------- Cappello di Paglia ---------------------- */
  'char-op-luffy': [
    b('30.000.000', '96', '45', 'dopo Arlong Park', 'after Arlong Park'),
    b('100.000.000', '234', '151', 'dopo Alabasta', 'after Alabasta'),
    b('300.000.000', '435', '320', 'dopo Enies Lobby', 'after Enies Lobby'),
    b('400.000.000', '597', '516', 'dopo la Guerra al Vertice', 'after the Summit War'),
    b('500.000.000', '801', '746', 'dopo Dressrosa', 'after Dressrosa'),
    b('1.500.000.000', '903', '879', 'dopo Whole Cake Island', 'after Whole Cake Island'),
    b('3.000.000.000', '1058', '1086', 'dopo Wano, nuovo Imperatore', 'after Wano, a new Emperor'),
  ],
  'char-op-zoro': [
    b('60.000.000', '234', '151', 'prima taglia, dopo Alabasta', 'first bounty, after Alabasta'),
    b('120.000.000', '435', '320', 'dopo Enies Lobby', 'after Enies Lobby'),
    b('320.000.000', '801', '746', 'dopo Dressrosa', 'after Dressrosa'),
    b('1.111.000.000', '1058', '1086', 'dopo Wano', 'after Wano'),
  ],
  'char-op-nami': [
    b('16.000.000', '435', '320', 'dopo Enies Lobby', 'after Enies Lobby'),
    b('66.000.000', '801', '746', 'dopo Dressrosa', 'after Dressrosa'),
    b('366.000.000', '1058', '1086', 'dopo Wano', 'after Wano'),
  ],
  'char-op-usopp': [
    b('30.000.000', '435', '320', 'come «Sogeking», dopo Enies Lobby', "as 'Sogeking', after Enies Lobby"),
    b('200.000.000', '801', '746', 'dopo Dressrosa', 'after Dressrosa'),
    b('500.000.000', '1058', '1086', 'dopo Wano', 'after Wano'),
  ],
  'char-op-sanji': [
    b('77.000.000', '435', '320', 'dopo Enies Lobby', 'after Enies Lobby'),
    b('177.000.000', '801', '746', 'dopo Dressrosa', 'after Dressrosa'),
    b('330.000.000', '903', '879', 'dopo Whole Cake Island', 'after Whole Cake Island'),
    b('1.032.000.000', '1058', '1086', 'dopo Wano', 'after Wano'),
  ],
  'char-op-chopper': [
    b('50', '435', '320', 'considerato un animale domestico', 'mistaken for a pet'),
    b('100', '801', '746', 'dopo Dressrosa', 'after Dressrosa'),
    b('1.000', '1058', '1086', 'dopo Wano', 'after Wano'),
  ],
  'char-op-robin': [
    b('79.000.000', '398', '278', 'da bambina, dopo Ohara', 'as a child, after Ohara'),
    b('80.000.000', '435', '320', 'dopo Enies Lobby', 'after Enies Lobby'),
    b('130.000.000', '801', '746', 'dopo Dressrosa', 'after Dressrosa'),
    b('930.000.000', '1058', '1086', 'dopo Wano', 'after Wano'),
  ],
  'char-op-franky': [
    b('44.000.000', '435', '320', 'dopo Enies Lobby', 'after Enies Lobby'),
    b('94.000.000', '801', '746', 'dopo Dressrosa', 'after Dressrosa'),
    b('394.000.000', '1058', '1086', 'dopo Wano', 'after Wano'),
  ],
  'char-op-brook': [
    b('33.000.000', '651', '571', 'rivelata dopo i due anni', 'revealed after the two years'),
    b('83.000.000', '801', '746', 'dopo Dressrosa', 'after Dressrosa'),
    b('383.000.000', '1058', '1086', 'dopo Wano', 'after Wano'),
  ],
  'char-op-jinbe': [
    b('250.000.000', '528', '430', 'da ex Corsaro', 'as a former Warlord'),
    b('438.000.000', '1058', '1086', 'dopo Wano, timoniere', 'after Wano, as helmsman'),
  ],

  /* ---------------------- Supernove ---------------------- */
  'char-op-law': [
    b('200.000.000', '508', '400', 'a Sabaody', 'at Sabaody'),
    b('440.000.000', '700', '629', 'dopo Punk Hazard', 'after Punk Hazard'),
    b('500.000.000', '801', '746', 'dopo Dressrosa', 'after Dressrosa'),
    b('3.000.000.000', '1058', '1086', 'dopo Wano', 'after Wano'),
  ],
  'char-op-kid': [
    b('315.000.000', '508', '400', 'a Sabaody', 'at Sabaody'),
    b('470.000.000', '801', '746', 'dopo Dressrosa', 'after Dressrosa'),
    b('3.000.000.000', '1058', '1086', 'dopo Wano', 'after Wano'),
  ],
  'char-op-killer': [b('200.000.000', '508', '400', 'a Sabaody', 'at Sabaody')],
  'char-op-hawkins': [b('320.000.000', '508', '400', 'a Sabaody', 'at Sabaody')],
  'char-op-drake': [b('222.000.000', '508', '400', 'a Sabaody', 'at Sabaody')],
  'char-op-apoo': [b('350.000.000', '508', '400', 'a Sabaody', 'at Sabaody')],
  'char-op-bege': [b('300.000.000', '508', '400', 'a Sabaody', 'at Sabaody')],
  'char-op-urouge': [b('108.000.000', '508', '400', 'a Sabaody', 'at Sabaody')],
  'char-op-bonney': [b('140.000.000', '508', '400', 'a Sabaody', 'at Sabaody')],

  /* ---------------------- Quattro Imperatori / leggende ---------------------- */
  'char-op-roger': [b('5.564.800.000', '1096', '1116', 'la taglia più alta della storia', 'the highest bounty in history')],
  'char-op-whitebeard': [b('5.046.000.000', '957', '958', 'la taglia più alta da vivo', 'the highest bounty while alive')],
  'char-op-kaido': [b('4.611.100.000', '957', '958', 'Imperatore', 'an Emperor')],
  'char-op-big-mom': [b('4.388.000.000', '957', '958', 'Imperatrice', 'an Empress')],
  'char-op-shanks': [b('4.048.900.000', '957', '958', 'Imperatore', 'an Emperor')],
  'char-op-blackbeard': [b('3.996.000.000', '957', '958', 'Imperatore', 'an Emperor')],
  'char-op-buggy': [b('3.189.000.000', '1058', '1086', 'Imperatore della Cross Guild', 'Emperor of the Cross Guild')],

  /* ---------------------- ex Corsari / Cross Guild ---------------------- */
  'char-op-mihawk': [b('3.590.000.000', '1058', '1086', 'rivelata con la Cross Guild', 'revealed with the Cross Guild')],
  'char-op-crocodile': [
    b('81.000.000', '155', '92', 'taglia da pirata congelata da Corsaro', 'pirate bounty frozen as Warlord'),
    b('1.965.000.000', '1058', '1086', 'rivelata con la Cross Guild', 'revealed with the Cross Guild'),
  ],
  'char-op-hancock': [b('1.659.000.000', '1058', '1086', 'rivelata dopo l\'abolizione dei Corsari', 'revealed after the Warlords were abolished')],
  'char-op-doflamingo': [b('340.000.000', '700', '629', 'taglia da pirata congelata da Corsaro', 'pirate bounty frozen as Warlord')],
  'char-op-moria': [b('320.000.000', '466', '362', 'da ex Corsaro', 'as a former Warlord')],
  'char-op-kuma': [b('296.000.000', '234', '151', 'da ex Corsaro', 'as a former Warlord')],

  /* ---------------------- Barbabianca / Barbanera / altri ---------------------- */
  'char-op-ace': [b('550.000.000', '552', '461', 'comandante della 2ª divisione', 'commander of the 2nd division')],
  'char-op-sabo': [b('602.000.000', '956', '957', 'n.2 dell\'Armata Rivoluzionaria', 'No. 2 of the Revolutionary Army')],
  'char-op-marco': [b('1.374.000.000', '1010', '1052', 'ex comandante di Barbabianca', "former Whitebeard commander")],
  'char-op-katakuri': [b('1.057.000.000', '861', '836', 'Comandante dei Dolci di Big Mom', "Big Mom's Sweet Commander")],
  'char-op-king': [b('1.390.000.000', '1000', '1048', 'braccio destro di Kaido', "Kaido's right hand")],
  'char-op-queen': [b('1.320.000.000', '1000', '1048', 'Calamità di Kaido', "a Calamity of Kaido")],
  'char-op-jack': [b('1.000.000.000', '925', '959', 'Calamità di Kaido', "a Calamity of Kaido")],
  'char-op-smoothie': [b('932.000.000', '845', '810', 'Comandante dei Dolci di Big Mom', "Big Mom's Sweet Commander")],
  'char-op-cracker': [b('860.000.000', '834', '798', 'Comandante dei Dolci di Big Mom', "Big Mom's Sweet Commander")],
  'char-op-perospero': [b('700.000.000', '829', '791', 'Ministro delle Caramelle', 'Minister of Candy')],
  'char-op-caesar': [b('300.000.000', '658', '581', 'scienziato ricercato', 'a wanted scientist')],
  'char-op-bellamy': [b('195.000.000', '233', '151', '«la Iena»', "'the Hyena'")],
  'char-op-bartolomeo': [b('150.000.000', '704', '633', 'gladiatore e fan di Rufy', "gladiator and Luffy fan")],
  'char-op-cavendish': [b('330.000.000', '702', '631', '«il Cavaliere Bianco»', "'the White Horse'")],
  'char-op-arlong': [b('20.000.000', '69', '31', 'uomo-pesce di East Blue', 'a fish-man of East Blue')],
  'char-op-don-krieg': [b('17.000.000', '69', '31', '«l\'Ammiraglio della Flotta»', "'the Foul Play'")],
  'char-op-kuro': [b('16.000.000', '232', '149', 'ex Capitano dei Gatti Neri', 'former Black Cat captain')],
  'char-op-fisher-tiger': [b('230.000.000', '623', '542', 'eroe degli uomini-pesce', 'a fish-man hero')],
  'char-op-hody': [b('100.000.000', '633', '551', 'capo dei Nuovi Pirati Uomini-Pesce', 'leader of the New Fish-Man Pirates')],
  'char-op-vergo': [b('300.000.000', '683', '610', 'spia dei Donquijote nella Marina', "Donquixote spy in the Marines")],
  'char-op-pizarro': [b('500.000.000', '925', '959', 'comandante di Barbanera', 'a Blackbeard commander')],
  'char-op-rocks': [b('—', '966', '966', 'capitano dei Pirati di Rocks', 'captain of the Rocks Pirates')],
};
