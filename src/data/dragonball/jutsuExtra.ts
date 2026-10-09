import type { Jutsu, Localizable } from '@/types';

/**
 * Tecniche, trasformazioni e oggetti aggiunti nella revisione di completezza.
 * Categorie (`type`, etichettate in `worlds.ts`): energy_blast, power_up,
 * movement, support, seal, fusion, divine, martial_art, transformation, item.
 * Gli utilizzatori sono in `characterIds`: l'index li riflette in
 * `character.jutsuIds`, così la relazione resta bidirezionale.
 */
const t = (
  id: string,
  name: string,
  type: string,
  users: string[],
  shortDescription: Localizable,
  extra: Partial<Jutsu> = {},
): Jutsu => ({
  id: `jutsu-dbz-${id}`,
  worldId: 'world-dragonball',
  name,
  type,
  characterIds: users.map((u) => `char-dbz-${u}`),
  shortDescription,
  canonStatus: 'canon',
  referenceStatus: 'verified',
  ...extra,
});

export const dragonballJutsuExtra: Jutsu[] = [
  /* ============================== ONDE ENERGETICHE ============================== */
  t('kikoho', 'Tri-Beam', 'energy_blast', ['tenshinhan'], {
    it: "Il colpo di Tensing: le mani formano un triangolo attraverso cui viene sparata un'onda devastante che consuma la vita stessa di chi la usa. Contro Cell, Tensing la lancia senza sosta per dare a C-18 il tempo di fuggire, fino a crollare stremato.",
    en: "Tien's blow: his hands form a triangle through which a devastating wave is fired, consuming the user's very life. Against Cell, Tien fires it again and again to buy time for Android 18 to flee, until he collapses exhausted.",
  }, { localizedName: { it: 'Kikoho', en: 'Tri-Beam' }, japaneseName: '気功砲', tags: ['scuola-della-gru'] }),
  t('dodonpa', 'Dodon Ray', 'energy_blast', ['tao-pai-pai', 'tenshinhan', 'crane-hermit'], {
    it: "Il raggio sottile e letale della Scuola della Gru, sparato dalla punta del dito. Tao Pai Pai lo usa per battere Goku la prima volta; Tensing lo impara dal suo maestro.",
    en: "The Crane School's thin, deadly ray, fired from the fingertip. Tao Pai Pai uses it to beat Goku the first time; Tien learns it from his master.",
  }, { localizedName: { it: 'Dodonpa', en: 'Dodon Ray' }, japaneseName: 'どどん波', tags: ['scuola-della-gru'] }),
  t('sokidan', 'Spirit Ball', 'energy_blast', ['yamcha'], {
    it: "Una sfera di energia che Yamcha guida a distanza con i movimenti delle dita, cambiandone la traiettoria anche più volte. È una delle tecniche originali di Yamcha, accanto al pugno del lupo: gli permette di colpire alle spalle anche un avversario più veloce.",
    en: "An energy sphere that Yamcha steers from a distance with his finger movements, changing its course even several times. It is one of Yamcha's original techniques, alongside the Wolf Fang Fist: it lets him strike even a faster opponent from behind.",
  }, { localizedName: { it: 'Sokidan', en: 'Spirit Ball' }, japaneseName: '操気弾' }),
  t('father-son-kamehameha', 'Father-Son Kamehameha', 'energy_blast', ['gohan', 'goku'], {
    it: "La Kamehameha con cui Gohan, con un braccio solo, sconfigge Cell Perfetto: la voce dello spirito di Goku lo guida dall'Aldilà, e padre e figlio la lanciano idealmente insieme.",
    en: "The one-armed Kamehameha with which Gohan defeats Perfect Cell: Goku's spirit voice guides him from Other World, and father and son fire it, in spirit, together.",
  }, { localizedName: { it: 'Kamehameha padre-figlio', en: 'Father-Son Kamehameha' }, japaneseName: '親子かめはめ波', tags: ['cell-games'] }),
  t('instant-kamehameha', 'Instant Kamehameha', 'energy_blast', ['goku'], {
    it: "Goku carica una Kamehameha in aria, poi usa il Teletrasporto per riapparire a bruciapelo davanti all'avversario e scaricargliela addosso. Lo fa ai Cell Games, cancellando la parte superiore del corpo di Cell Perfetto, che però si rigenera.",
    en: "Goku charges a Kamehameha in the air, then uses Instant Transmission to reappear point-blank in front of his opponent and unleash it. He does so at the Cell Games, blasting away Perfect Cell's upper body — which then regenerates.",
  }, { localizedName: { it: 'Kamehameha istantanea', en: 'Instant Kamehameha' }, japaneseName: '瞬間移動かめはめ波', tags: ['cell-games'] }),
  t('final-explosion', 'Final Explosion', 'energy_blast', ['vegeta'], {
    it: "Il sacrificio di Vegeta contro Majin Bu: dopo aver abbracciato per l'ultima volta Trunks e aver fatto svenire lui e Goten, libera in un'unica esplosione tutta la sua energia vitale. Bu si rigenera, ma Vegeta muore per proteggere la famiglia.",
    en: "Vegeta's sacrifice against Majin Buu: after hugging Trunks for the last time and knocking him and Goten out, he releases all his life energy in a single explosion. Buu regenerates, but Vegeta dies protecting his family.",
  }, { localizedName: { it: 'Esplosione finale', en: 'Final Explosion' }, japaneseName: 'ファイナルエクスプロージョン', tags: ['majin-bu'] }),
  t('light-grenade', 'Light Grenade', 'energy_blast', ['piccolo'], {
    it: "Una sfera di energia compressa che Piccolo forma unendo le mani davanti al viso e lancia come una granata. La usa contro Cell, quando affronta da solo gli Androidi dopo essersi fuso con Dio, e torna a sfoggiarla in Super Hero.",
    en: "A sphere of compressed energy that Piccolo forms by joining his hands in front of his face and hurls like a grenade. He uses it against Cell, when he faces the Androids alone after fusing with Kami, and shows it again in Super Hero.",
  }, { localizedName: { it: 'Light Grenade', en: 'Light Grenade' }, japaneseName: '激烈光弾' }),
  t('bakuretsu-makoha', 'Explosive Demon Wave', 'energy_blast', ['king-piccolo', 'piccolo'], {
    it: "L'onda demoniaca del Grande Mago Piccolo, capace di radere al suolo un'intera città: è il modo in cui annuncia al mondo il suo ritorno. Il figlio Piccolo Junior la eredita.",
    en: "King Piccolo's demonic wave, able to raze an entire city: it is how he announces his return to the world. His son Piccolo Jr. inherits it.",
  }, { localizedName: { it: 'Bakuretsu Makoha', en: 'Explosive Demon Wave' }, japaneseName: '爆力魔波', tags: ['grande-mago-piccolo'] }),
  t('burning-attack', 'Burning Attack', 'energy_blast', ['future-trunks'], {
    it: "Una sequenza rapidissima di gesti con le mani che termina in una sfera di fuoco energetico. Trunks del Futuro la lancia contro Freezer Meka appena arrivato sulla Terra, poco prima di tagliarlo a pezzi con la spada.",
    en: "A lightning-fast sequence of hand movements ending in a fiery energy sphere. Future Trunks hurls it at Mecha Frieza just after landing on Earth, shortly before cutting him to pieces with his sword.",
  }, { longDescription: { it: "Trunks del Futuro la mostra appena arrivato dal futuro, prima di rivelare di essere figlio di Vegeta e Bulma.", en: "Future Trunks shows it right after arriving from the future, before revealing he is Vegeta and Bulma's son." }, localizedName: { it: 'Burning Attack', en: 'Burning Attack' }, japaneseName: 'バーニングアタック' }),
  t('galactic-donut', 'Galactic Donut', 'seal', ['gotenks'], {
    it: "Uno degli attacchi buffi di Gotenks: un anello di energia che si stringe attorno all'avversario per immobilizzarlo. Lo usa contro Super Bu nella Stanza dello Spirito e del Tempo.",
    en: "One of Gotenks's goofy attacks: a ring of energy that tightens around the opponent to pin them down. He uses it against Super Buu in the Hyperbolic Time Chamber.",
  }, { longDescription: { it: "È una delle mosse dai nomi buffi che Gotenks inventa sul momento, sicuro di battere Bu da solo.", en: "It is one of the funny-named moves Gotenks makes up on the spot, convinced he can beat Buu alone." }, localizedName: { it: 'Ciambella galattica', en: 'Galactic Donut' }, japaneseName: 'ギャラクティカドーナツ', tags: ['majin-bu'] }),
  t('super-ghost-kamikaze', 'Super Ghost Kamikaze Attack', 'energy_blast', ['gotenks'], {
    it: "Gotenks soffia fuori dalla bocca piccoli fantasmi che gli somigliano: esplodono quando toccano il bersaglio. Contro Super Bu ne crea un intero esercito, che prende in giro il nemico prima di farsi saltare in aria.",
    en: "Gotenks blows small ghosts that look like him out of his mouth: they explode on contact with the target. Against Super Buu he creates a whole army of them, which mocks the enemy before blowing itself up.",
  }, { localizedName: { it: 'Super attacco kamikaze dei fantasmi', en: 'Super Ghost Kamikaze Attack' }, japaneseName: 'スーパーゴーストカミカゼアタック', tags: ['majin-bu'] }),
  t('chocolate-beam', 'Transfiguration Beam', 'energy_blast', ['majin-buu', 'kid-buu'], {
    it: "Il raggio che parte dall'antenna sulla testa di Majin Bu e trasforma qualsiasi cosa in un dolce — cioccolata, biscotti, caramelle — che poi Bu mangia. Così Bu Malvagio trasforma il Bu buono in cioccolato e lo mangia, diventando Super Bu.",
    en: "The beam fired from the antenna on Majin Buu's head that turns anything into a sweet — chocolate, cookies, candy — which Buu then eats. This is how Evil Buu turns the good Buu into a chocolate and eats him, becoming Super Buu.",
  }, { localizedName: { it: 'Raggio trasformante', en: 'Transfiguration Beam' }, japaneseName: 'お菓子光線', tags: ['majin-bu'] }),
  t('recoome-eraser-gun', 'Recoome Eraser Gun', 'energy_blast', ['recoome'], {
    it: "La fiammata d'energia che Recoom spara dalla bocca dopo una lunga e ridicola posa. La sfoggia su Namecc nello scontro con Vegeta, Gohan e Crilin, prima dell'arrivo di Goku.",
    en: "The energy blast Recoome fires from his mouth after a long, ridiculous pose. He shows it off on Namek in the fight with Vegeta, Gohan and Krillin, before Goku arrives.",
  }, { longDescription: { it: "Recoom è il colosso delle Forze Speciali Ginew, famoso per le pose da supereroe che precedono ogni attacco.", en: "Recoome is the Ginyu Force's giant, famous for the superhero poses that precede every attack." }, localizedName: { it: 'Recoom Eraser Gun', en: 'Recoome Eraser Gun' }, japaneseName: 'リクームイレイザーガン', tags: ['squadra-ginyu'] }),
  t('crusher-ball', 'Crusher Ball', 'energy_blast', ['jeice'], {
    it: "Una sfera di energia rossa che Jeeth delle Forze Speciali Ginew lancia contro gli avversari. La usa su Namecc combattendo al fianco di Butter contro i Guerrieri Z.",
    en: "A red energy sphere that the Ginyu Force's Jeice hurls at his opponents. He uses it on Namek fighting alongside Burter against the Z Fighters.",
  }, { longDescription: { it: "Jeeth, il membro dalla pelle rossa delle Forze Speciali Ginew, combatte quasi sempre in coppia con Butter.", en: "Jeice, the Ginyu Force's red-skinned member, almost always fights in tandem with Burter." }, localizedName: { it: 'Crusher Ball', en: 'Crusher Ball' }, japaneseName: 'クラッシャーボール', tags: ['squadra-ginyu'] }),
  t('death-saucer', 'Death Saucer', 'energy_blast', ['frieza'], {
    it: "La versione di Freezer del Kienzan di Crilin: dischi d'energia taglienti che inseguono il bersaglio. Nello scontro finale su Namecc il disco torna indietro e taglia in due Freezer stesso.",
    en: "Frieza's version of Krillin's Destructo Disc: cutting energy discs that home in on the target. In the final fight on Namek the disc comes back and cuts Frieza himself in two.",
  }, { longDescription: { it: "Il colpo che si ritorce contro il suo creatore è uno dei momenti più celebri dello scontro su Namecc.", en: "The blow that turns against its creator is one of the most famous moments of the fight on Namek." }, localizedName: { it: 'Kienzan di Freezer', en: 'Death Saucer' }, japaneseName: '気円斬', tags: ['namecc'] }),
  /* ============================== ARTI MARZIALI ============================== */
  t('wolf-fang-fist', 'Wolf Fang Fist', 'martial_art', ['yamcha'], {
    it: "La raffica di colpi a mani aperte che imita le zanne di un lupo, firma di Yamcha fin da quando era un predone del deserto. Nel tempo ne sviluppa una versione potenziata, il «Neo Wolf Fang Fist», che sfoggia ai Tornei Tenkaichi.",
    en: "The flurry of open-handed blows imitating a wolf's fangs, Yamcha's signature since his days as a desert bandit. Over time he develops a powered-up version, the 'Neo Wolf Fang Fist', which he shows off at the World Tournaments.",
  }, { localizedName: { it: 'Pugno del lupo', en: 'Wolf Fang Fist' }, japaneseName: '狼牙風風拳' }),
  t('jan-ken', 'Rock-Paper-Scissors', 'martial_art', ['goku'], {
    it: "La prima tecnica di Goku bambino, insegnata dal nonno Gohan: un pugno «sasso», due dita negli occhi «forbici», uno schiaffo a mano aperta «carta». La usa al 21° Torneo Tenkaichi e la riprende da adulto contro avversari molto più forti.",
    en: "Young Goku's first technique, taught by Grandpa Gohan: a 'rock' punch, two fingers in the eyes for 'scissors', an open-handed 'paper' slap. He uses it at the 21st World Tournament and returns to it as an adult against much stronger foes.",
  }, { localizedName: { it: 'Jan Ken', en: 'Rock-Paper-Scissors' }, japaneseName: 'ジャン拳', tags: ['dragon-ball'] }),
  t('suiken', 'Drunken Fist', 'martial_art', ['master-roshi'], {
    it: "Lo stile del pugno ubriaco: movimenti sbilanciati e imprevedibili che confondono l'avversario. Jackie Chun — cioè il Maestro Muten travestito — lo usa contro Goku al 21° Torneo Tenkaichi.",
    en: "The drunken fist style: off-balance, unpredictable movements that confuse the opponent. Jackie Chun — that is, Master Roshi in disguise — uses it against Goku at the 21st World Martial Arts Tournament.",
  }, { longDescription: { it: "Il travestimento da Jackie Chun serve al Maestro Muten per impedire che i suoi allievi vincano il torneo troppo presto e si montino la testa.", en: "Master Roshi's Jackie Chun disguise is meant to stop his pupils from winning the tournament too early and getting big-headed." }, localizedName: { it: 'Pugno ubriaco', en: 'Drunken Fist' }, japaneseName: '酔拳', tags: ['torneo', 'jackie-chun'] }),
  t('bankoku-bikkuri-sho', 'Thunder Shock Surprise', 'martial_art', ['master-roshi'], {
    it: "Una scarica elettrica che Jackie Chun trasmette all'avversario afferrandolo: la usa al 21° Torneo contro Goku, che però resiste: è una delle tecniche segrete con cui il Maestro Muten mette alla prova i suoi allievi senza farsi riconoscere.",
    en: "An electric shock Jackie Chun sends through the opponent by grabbing them: he uses it at the 21st Tournament against Goku, who holds out: it is one of the secret techniques with which Master Roshi tests his pupils without being recognised.",
  }, { localizedName: { it: 'Bankoku Bikkuri Shō', en: 'Thunder Shock Surprise' }, japaneseName: '萬國驚天掌', referenceStatus: 'needs_verification', tags: ['torneo', 'jackie-chun'] }),
  t('shishin-no-ken', 'Multi-Form', 'martial_art', ['tenshinhan'], {
    it: "La tecnica con cui Tensing si divide in quattro copie identiche — ciascuna con un quarto della sua forza. La mostra al 23° Torneo contro Goku; più tardi usa anche la variante delle quattro braccia.",
    en: "The technique with which Tien splits into four identical copies — each with a quarter of his strength. He shows it at the 23rd Tournament against Goku; later he also uses the four-armed variant.",
  }, { longDescription: { it: "Goku la contrasta osservando le ombre delle copie, che si muovono come un'unica persona.", en: "Goku counters it by watching the copies' shadows, which move as one person." }, localizedName: { it: 'Shishin no Ken', en: 'Multi-Form' }, japaneseName: '四身の拳', tags: ['scuola-della-gru'] }),
  t('afterimage', 'Afterimage Technique', 'movement', ['goku', 'master-roshi', 'krillin', 'tenshinhan', 'vegeta', 'frieza'], {
    it: "Ci si muove così in fretta da lasciare dietro di sé un'immagine residua che l'avversario colpisce a vuoto. Il Maestro Muten la usa al 21° Torneo e Goku la copia subito; diventa di uso comune fra i combattenti più veloci.",
    en: "Moving so fast that you leave an afterimage behind for the opponent to strike at. Master Roshi uses it at the 21st Tournament and Goku copies it at once; it becomes common among the fastest fighters.",
  }, { localizedName: { it: 'Zanzoken', en: 'Afterimage Technique' }, japaneseName: '残像拳' }),
  t('bukujutsu', 'Flight', 'movement', ['goku', 'krillin', 'gohan', 'videl', 'tenshinhan', 'piccolo', 'goten'], {
    it: "Il Bukujutsu, la tecnica del volo con l'energia: Tensing e Jiaozi la usano già al 22° Torneo, Goku la impara al Santuario di Dio. Gohan la insegna a Videl prima del 25° Torneo, e lei la passa a Goten.",
    en: "Bukujutsu, the technique of flying with energy: Tien and Chiaotzu already use it at the 22nd Tournament, Goku learns it on Kami's Lookout. Gohan teaches it to Videl before the 25th Tournament, and Goten picks it up too.",
  }, { localizedName: { it: 'Volo (Bukujutsu)', en: 'Flight' }, japaneseName: '舞空術' }),
  t('ki-sense', 'Ki Sense', 'support', ['goku', 'krillin', 'piccolo', 'vegeta', 'gohan', 'tenshinhan'], {
    it: "La capacità di percepire l'energia degli altri senza bisogno di scouter. I Guerrieri Z la usano per nascondersi ai Saiyan, che si affidano agli apparecchi; Vegeta la impara su Namecc.",
    en: "The ability to sense others' energy without a scouter. The Z Fighters use it to hide from the Saiyans, who rely on the devices; Vegeta learns it on Namek.",
  }, { localizedName: { it: "Percezione dell'aura", en: 'Ki Sense' } }),
  t('telekinesis', 'Telekinesis', 'support', ['chaozu'], {
    it: "Il potere psichico di Jiaozi, che può immobilizzare gli avversari o interferire con i loro movimenti. Al 22° Torneo lo usa contro Crilin; contro Nappa sceglie invece di sacrificarsi facendosi esplodere sulla sua schiena.",
    en: "Chiaotzu's psychic power, able to immobilise opponents or interfere with their movements. At the 22nd Tournament he uses it on Krillin; against Nappa he instead sacrifices himself by exploding on his back.",
  }, { localizedName: { it: 'Telecinesi', en: 'Telekinesis' }, japaneseName: '超能力', tags: ['scuola-della-gru'] }),
  t('regeneration', 'Regeneration', 'support', ['piccolo', 'cell', 'majin-buu', 'kid-buu', 'nail'], {
    it: "La capacità di ricostruire arti o interi corpi: i Namecciani rigenerano braccia e gambe, Cell la eredita dalle cellule di Piccolo, Majin Bu si ricompone anche dal vapore. Per distruggere Bu bisogna cancellarne ogni frammento.",
    en: "The ability to rebuild limbs or whole bodies: Namekians regrow arms and legs, Cell inherits it from Piccolo's cells, Majin Buu reassembles even from vapour. To destroy Buu every fragment must be erased.",
  }, { localizedName: { it: 'Rigenerazione', en: 'Regeneration' }, japaneseName: '再生' }),
  t('absorption', 'Absorption', 'support', ['cell', 'majin-buu', 'android-19', 'dr-gero'], {
    it: "Assorbire gli altri per diventare più forti: C-19 e il Dottor Gelo rubano l'energia dai palmi, Cell assorbe C-17 e C-18 per diventare Perfetto, Majin Bu ingloba Gotenks, Piccolo e Gohan nel proprio corpo.",
    en: "Absorbing others to grow stronger: Android 19 and Dr. Gero steal energy through their palms, Cell absorbs Androids 17 and 18 to become Perfect, Majin Buu engulfs Gotenks, Piccolo and Gohan into his body.",
  }, { localizedName: { it: 'Assorbimento', en: 'Absorption' }, japaneseName: '吸収' }),
  t('materialization', 'Magic Materialization', 'support', ['piccolo', 'kami'], {
    it: "La magia namecciana che crea oggetti dal nulla: Piccolo la usa per vestire Gohan con la sua stessa tenuta da combattimento e per confezionarsi il mantello e il turbante appesantiti con cui si allena.",
    en: "The Namekian magic that creates objects out of nothing: Piccolo uses it to dress Gohan in his own fighting outfit and to make the weighted cape and turban he trains in.",
  }, { localizedName: { it: 'Materializzazione', en: 'Magic Materialization' }, japaneseName: '魔術' }),
  t('self-destruct', 'Self-Destruct', 'support', ['chaozu', 'android-16'], {
    it: "Il sacrificio estremo: farsi esplodere aggrappati al nemico. Jiaozi lo fa sulla schiena di Nappa, che però sopravvive; C-16 vorrebbe farlo su Cell, ma Bulma gli ha rimosso la bomba durante la riparazione.",
    en: "The ultimate sacrifice: blowing yourself up while clinging to the enemy. Chiaotzu does it on Nappa's back, who survives anyway; Android 16 tries it on Cell, but Bulma had removed his bomb during repairs.",
  }, { localizedName: { it: 'Autodistruzione', en: 'Self-Destruct' }, japaneseName: '自爆' }),
  t('time-rewind', 'Temporal Do-Over', 'divine', ['whis'], {
    it: "Il potere di Whis di riavvolgere il tempo di tre minuti. Lo usa quando Freezer fa esplodere la Terra ne La resurrezione di F: torna indietro quel tanto che basta perché Goku lo elimini prima che possa farlo.",
    en: "Whis's power to rewind time by three minutes. He uses it when Frieza blows up the Earth in Resurrection F: he goes back just enough for Goku to finish Frieza before he can do it.",
  }, { longDescription: { it: "È uno dei pochissimi momenti in cui Whis interviene direttamente nelle vicende dei mortali.", en: "It is one of the very few times Whis intervenes directly in mortals' affairs." }, localizedName: { it: 'Riavvolgimento del tempo', en: 'Temporal Do-Over' }, tags: ['angeli', 'resurrection-f'] }),
  t('erasure', 'Erasure', 'divine', ['zeno'], {
    it: "Il potere assoluto di Zeno, il Re di Tutto: cancellare dall'esistenza qualsiasi cosa con un gesto. Lo usa per cancellare la linea temporale di Trunks infestata da Zamasu e gli universi sconfitti al Torneo del Potere.",
    en: "The absolute power of Zeno, the Omni-King: erasing anything from existence with a gesture. He uses it to erase Trunks's timeline infested by Zamasu and the universes defeated at the Tournament of Power.",
  }, { localizedName: { it: 'Cancellazione', en: 'Erasure' }, tags: ['zeno'] }),
  t('energy-drain-magic', 'Energy Absorption Magic', 'divine', ['moro'], {
    it: "La magia di Moro, il Divoratore di pianeti: prosciuga l'energia vitale di interi mondi e quella dei suoi avversari per accrescere la propria forza. Prosciuga così il Nuovo Namecc e indebolisce Goku e Vegeta.",
    en: "The magic of Moro, the Planet Eater: he drains the life energy of entire worlds and of his opponents to increase his own strength. This is how he drains New Namek and weakens Goku and Vegeta.",
  }, { longDescription: { it: "La magia di Moro era stata sigillata molto tempo prima dal Vecchio Kaiōshin: la recupera con il primo desiderio a Porunga dopo l'evasione.", en: "Moro's magic had been sealed long ago by the Elder Kai: he gets it back with his first wish to Porunga after his escape." }, localizedName: { it: "Magia dell'assorbimento", en: 'Energy Absorption Magic' }, tags: ['moro'] }),
  /* ============================== TRASFORMAZIONI ============================== */
  t('great-ape', 'Great Ape', 'transformation', ['goku', 'vegeta', 'gohan', 'raditz', 'nappa', 'bardock'], {
    it: "La trasformazione in scimmione gigante (Ōzaru) che i Saiyan con la coda subiscono guardando la luna piena e moltiplica per dieci la loro forza. Goku bambino uccide così il nonno Gohan senza saperlo; Vegeta crea una luna artificiale contro Goku.",
    en: "The transformation into a giant ape (Ōzaru) that Saiyans with tails undergo by looking at the full moon, multiplying their strength tenfold. This is how young Goku unknowingly kills Grandpa Gohan; Vegeta creates an artificial moon against Goku.",
  }, { localizedName: { it: 'Ōzaru (scimmione)', en: 'Great Ape' }, japaneseName: '大猿', tags: ['saiyan'] }),
  t('super-saiyan', 'Super Saiyan', 'transformation', ['goku', 'vegeta', 'gohan', 'goten', 'trunks', 'future-trunks'], {
    it: "La leggendaria trasformazione dei Saiyan: capelli dorati, occhi verdi e una forza che si moltiplica. Goku la risveglia su Namecc per la rabbia della morte di Crilin; da allora Vegeta, Gohan, Trunks e Goten la raggiungono uno dopo l'altro.",
    en: "The Saiyans' legendary transformation: golden hair, green eyes and multiplied strength. Goku awakens it on Namek out of rage at Krillin's death; from then on Vegeta, Gohan, Trunks and Goten reach it one after another.",
  }, { localizedName: { it: 'Super Saiyan', en: 'Super Saiyan' }, japaneseName: '超サイヤ人', tags: ['saiyan', 'trasformazione'] }),
  t('super-saiyan-2', 'Super Saiyan 2', 'transformation', ['gohan', 'goku', 'vegeta', 'caulifla'], {
    it: "Il livello oltre il Super Saiyan, con aura attraversata da scariche elettriche. Gohan lo raggiunge per primo ai Cell Games quando C-16 viene ucciso davanti ai suoi occhi; Goku e Vegeta lo padroneggiano negli anni seguenti.",
    en: "The level beyond Super Saiyan, with an aura crackling with electricity. Gohan reaches it first at the Cell Games when Android 16 is killed before his eyes; Goku and Vegeta master it in the following years.",
  }, { localizedName: { it: 'Super Saiyan 2', en: 'Super Saiyan 2' }, japaneseName: '超サイヤ人2', tags: ['saiyan', 'trasformazione', 'cell-games'] }),
  t('super-saiyan-3', 'Super Saiyan 3', 'transformation', ['goku', 'gotenks', 'vegeta'], {
    it: "La trasformazione con i capelli lunghissimi e senza sopracciglia, potentissima ma estenuante. Goku la mostra per la prima volta contro Majin Bu per guadagnare tempo; Gotenks la raggiunge nella Stanza dello Spirito e del Tempo, Vegeta in Dragon Ball DAIMA.",
    en: "The transformation with extremely long hair and no eyebrows, hugely powerful but exhausting. Goku first shows it against Majin Buu to buy time; Gotenks reaches it in the Hyperbolic Time Chamber, Vegeta in Dragon Ball DAIMA.",
  }, { localizedName: { it: 'Super Saiyan 3', en: 'Super Saiyan 3' }, japaneseName: '超サイヤ人3', tags: ['saiyan', 'trasformazione', 'majin-bu', 'daima'] }),
  t('super-saiyan-god', 'Super Saiyan God', 'transformation', ['goku', 'vegeta'], {
    it: "La forma divina dai capelli rossi, ottenuta con un rituale in cui cinque Saiyan dal cuore puro infondono la loro energia in un sesto. Goku la raggiunge ne La battaglia degli dei per affrontare Bills, grazie a Vegeta, Gohan, Goten, Trunks e Pan non ancora nata.",
    en: "The red-haired divine form, obtained through a ritual in which five pure-hearted Saiyans pour their energy into a sixth. Goku reaches it in Battle of Gods to face Beerus, thanks to Vegeta, Gohan, Goten, Trunks and the unborn Pan.",
  }, { localizedName: { it: 'Super Saiyan God', en: 'Super Saiyan God' }, japaneseName: '超サイヤ人ゴッド', tags: ['saiyan', 'trasformazione', 'battle-of-gods'] }),
  t('super-saiyan-blue', 'Super Saiyan Blue', 'transformation', ['goku', 'vegeta', 'vegito'], {
    it: "Il Super Saiyan God Super Saiyan: un Super Saiyan con l'aura divina, dai capelli azzurri. Goku e Vegeta lo raggiungono allenandosi con Whis e lo mostrano contro Freezer d'oro ne La resurrezione di F; Vegeth lo usa contro Zamasu fuso.",
    en: "Super Saiyan God Super Saiyan: a Super Saiyan with divine ki, with blue hair. Goku and Vegeta reach it training with Whis and show it against Golden Frieza in Resurrection F; Vegito uses it against Fused Zamasu.",
  }, { localizedName: { it: 'Super Saiyan Blue', en: 'Super Saiyan Blue' }, japaneseName: '超サイヤ人ゴッド超サイヤ人', tags: ['saiyan', 'trasformazione', 'super'] }),
  t('super-saiyan-4', 'Super Saiyan 4', 'transformation', ['goku', 'vegeta', 'gogeta'], {
    it: "La forma con pelliccia rossa e coda che unisce il potere dello scimmione al Super Saiyan. In Dragon Ball GT Goku la raggiunge contro Baby, Vegeta grazie al generatore di onde Blutz di Bulma; in DAIMA Goku la sblocca contro Gomah grazie allo stregone Neva.",
    en: "The red-furred form with a tail that merges the Great Ape's power with Super Saiyan. In Dragon Ball GT Goku reaches it against Baby, Vegeta thanks to Bulma's Blutz Wave generator; in DAIMA Goku unlocks it against Gomah thanks to the sorcerer Neva.",
  }, { localizedName: { it: 'Super Saiyan 4', en: 'Super Saiyan 4' }, japaneseName: '超サイヤ人4', tags: ['saiyan', 'trasformazione', 'gt', 'daima'] }),
  t('super-saiyan-rose', 'Super Saiyan Rosé', 'transformation', ['goku-black'], {
    it: "La versione del Super Saiyan divino di Goku Black, dai capelli rosa: Zamasu, nel corpo di Goku, la ottiene perché è già un dio. È il simbolo della linea temporale di Trunks devastata dall'«operazione Zero Mortali».",
    en: "Goku Black's version of the divine Super Saiyan, with pink hair: Zamasu, in Goku's body, obtains it because he is already a god. It is the symbol of Trunks's timeline ravaged by the 'Zero Mortals Plan'.",
  }, { localizedName: { it: 'Super Saiyan Rosé', en: 'Super Saiyan Rosé' }, japaneseName: '超サイヤ人ロゼ', tags: ['trasformazione', 'goku-black'] }),
  t('golden-frieza', 'Golden Frieza', 'transformation', ['frieza'], {
    it: "La forma dorata che Freezer raggiunge allenandosi per la prima volta in vita sua, quattro mesi soli, dopo essere stato riportato in vita ne La resurrezione di F. Potentissima, ma consuma energia in fretta: Goku lo batte per questo.",
    en: "The golden form Frieza reaches by training for the first time in his life, just four months, after being brought back in Resurrection F. Immensely powerful, but it burns energy fast: that is how Goku beats him.",
  }, { localizedName: { it: "Freezer d'oro", en: 'Golden Frieza' }, japaneseName: 'ゴールデンフリーザ', tags: ['trasformazione', 'resurrection-f'] }),
  t('gohan-beast', 'Beast', 'transformation', ['gohan'], {
    it: "La forma dai capelli bianco-argento che Gohan risveglia in Super Hero contro Cell Max, quando la rabbia per Piccolo ferito sblocca un potere nascosto oltre il suo potenziale. Con essa abbatte Cell Max con un Makankosappo.",
    en: "The silver-white-haired form Gohan awakens in Super Hero against Cell Max, when rage over the wounded Piccolo unlocks a power hidden beyond his potential. With it he brings down Cell Max with a Special Beam Cannon.",
  }, { localizedName: { it: 'Gohan Beast', en: 'Beast' }, japaneseName: '孫悟飯ビースト', canonStatus: 'movie', tags: ['trasformazione', 'super-hero'] }),
  t('orange-piccolo', 'Orange Piccolo', 'transformation', ['piccolo'], {
    it: "La forma arancione e gigantesca che Piccolo ottiene in Super Hero chiedendo a Shenron, tramite Dende, di sbloccare il proprio potenziale. Con essa tiene testa ai Gamma e può crescere fino a dimensioni enormi.",
    en: "The orange, giant form Piccolo gains in Super Hero by asking Shenron, through Dende, to unlock his potential. With it he holds his own against the Gammas and can grow to enormous size.",
  }, { longDescription: { it: "È la prima vera trasformazione di Piccolo in tutta la serie.", en: "It is Piccolo's first true transformation in the entire series." }, localizedName: { it: 'Piccolo arancione', en: 'Orange Piccolo' }, japaneseName: 'オレンジピッコロ', canonStatus: 'movie', tags: ['trasformazione', 'super-hero'] }),
  t('potential-unleashed', 'Potential Unleashed', 'power_up', ['gohan', 'krillin'], {
    it: "Lo sblocco del potenziale latente: il Capo Anziano Guru lo fa a Gohan e Crilin su Namecc imponendo le mani sulla testa; il Kaiōshin anziano, con un rituale di molte ore, risveglia in Gohan il potere che lo rende «Ultimate Gohan».",
    en: "Unlocking latent potential: Grand Elder Guru does it for Gohan and Krillin on Namek by laying hands on their heads; Elder Kai, with a ritual lasting many hours, awakens in Gohan the power that makes him 'Ultimate Gohan'.",
  }, { localizedName: { it: 'Sblocco del potenziale', en: 'Potential Unleashed' }, japaneseName: '潜在能力解放', tags: ['namecc', 'majin-bu'] }),
  /* ================================== OGGETTI ================================== */
  t('dragon-balls', 'Dragon Balls', 'item', ['kami', 'guru', 'shenron', 'porunga', 'super-shenron', 'bulma', 'goku'], {
    it: "Sette sfere arancioni con da una a sette stelle: riunite, evocano un drago che esaudisce un desiderio (tre quelle di Namecc). Le Sfere della Terra sono di Dio, poi di Dende; quelle Super sono grandi quanto pianeti. Ogni caccia della serie parte da qui.",
    en: "Seven orange balls bearing one to seven stars: gathered, they summon a dragon that grants a wish (three for Namek's). Earth's Balls belong to Kami, then Dende; the Super ones are as large as planets. Every quest in the series starts here.",
  }, { localizedName: { it: 'Sfere del Drago', en: 'Dragon Balls' }, japaneseName: 'ドラゴンボール', tags: ['sfere-del-drago'] }),
  t('dragon-radar', 'Dragon Radar', 'item', ['bulma'], {
    it: "Il dispositivo inventato da Bulma che rileva il segnale delle Sfere del Drago e ne mostra la posizione. È il motivo per cui Bulma incontra Goku: il radar la porta sul Monte Paoz, dove il bambino custodisce la Sfera a quattro stelle.",
    en: "The device invented by Bulma that detects the Dragon Balls' signal and shows their position. It is why Bulma meets Goku: the radar leads her to Mt. Paozu, where the boy keeps the Four-Star Ball.",
  }, { longDescription: { it: "Nel corso della serie Bulma ne costruisce più versioni, fino a quelle per le Sfere dai Sette Stelle di GT.", en: "Over the series Bulma builds several versions, up to those for GT's Black Star Dragon Balls." }, localizedName: { it: 'Radar del drago', en: 'Dragon Radar' }, japaneseName: 'ドラゴンレーダー', tags: ['sfere-del-drago', 'capsule-corp'] }),
  t('senzu-bean', 'Senzu Bean', 'item', ['korin', 'yajirobe', 'goku', 'krillin'], {
    it: "Il fagiolo di Balzar coltivato da Karin: un solo chicco sfama per dieci giorni e guarisce all'istante qualsiasi ferita, restituendo l'energia. Yajirobe li porta in battaglia contro i Saiyan; Goku ne regala uno a Cell ai Cell Games.",
    en: "The Senzu bean grown by Korin: a single one feeds you for ten days and instantly heals any wound, restoring energy. Yajirobe brings them to the battle against the Saiyans; Goku gives one to Cell at the Cell Games.",
  }, { localizedName: { it: 'Fagiolo di Balzar', en: 'Senzu Bean' }, japaneseName: '仙豆', tags: ['karin'] }),
  t('hoipoi-capsule', 'Hoipoi Capsule', 'item', ['bulma', 'dr-brief'], {
    it: "Le capsule della Capsule Corporation che contengono, rimpiccioliti, case, moto, navicelle e laboratori: basta premere il pulsante e lanciarle. Bulma ne porta sempre con sé; sono l'invenzione che ha reso ricchissima la famiglia Brief.",
    en: "Capsule Corporation's capsules holding shrunken houses, motorbikes, spaceships and labs: just press the button and throw them. Bulma always carries some; they are the invention that made the Briefs family immensely rich.",
  }, { localizedName: { it: 'Capsule Hoi-Poi', en: 'Hoipoi Capsule' }, japaneseName: 'ホイポイカプセル', tags: ['capsule-corp'] }),
  t('time-machine', 'Time Machine', 'item', ['future-trunks', 'bulma', 'cell'], {
    it: "La macchina costruita dalla Bulma del futuro con cui Trunks torna indietro per salvare Goku dalla malattia e avvertirlo degli Androidi. Cell, nato in un'altra linea temporale, la ruba a Trunks per viaggiare nel passato.",
    en: "The machine built by the future Bulma with which Trunks travels back to save Goku from his illness and warn him about the Androids. Cell, born in another timeline, steals it from Trunks to travel to the past.",
  }, { localizedName: { it: 'Macchina del tempo', en: 'Time Machine' }, japaneseName: 'タイムマシン', tags: ['capsule-corp', 'futuro'] }),
  t('nyoibo', 'Power Pole', 'item', ['goku', 'grandpa-gohan', 'korin'], {
    it: "Il bastone magico che si allunga a comando, regalo del nonno Gohan a Goku. In origine apparteneva a Karin: inserito in cima alla sua Torre, collega quest'ultima al Santuario di Dio. Goku lo riprende in Dragon Ball DAIMA.",
    en: "The magic staff that extends on command, a gift from Grandpa Gohan to Goku. It originally belonged to Korin: set at the top of his Tower, it links it to Kami's Lookout. Goku takes it up again in Dragon Ball DAIMA.",
  }, { localizedName: { it: 'Nyoibo (bastone magico)', en: 'Power Pole' }, japaneseName: '如意棒', tags: ['dragon-ball', 'daima'] }),
  t('flying-nimbus', 'Flying Nimbus', 'item', ['goku', 'gohan', 'chichi'], {
    it: "La nuvoletta d'oro che il Maestro Muten regala a Goku: vola velocissima, ma può salirci solo chi ha il cuore puro. Goku la usa per tutta la prima serie; Gohan da bambino ci sale senza problemi.",
    en: "The golden cloud Master Roshi gives Goku: it flies extremely fast, but only the pure of heart can ride it. Goku uses it throughout the first series; Gohan as a child rides it with no trouble.",
  }, { localizedName: { it: 'Nuvola Speedy', en: 'Flying Nimbus' }, japaneseName: '筋斗雲', tags: ['dragon-ball'] }),
  t('ultra-divine-water', 'Ultra Divine Water', 'item', ['goku', 'korin'], {
    it: "Il veleno conservato sopra la Torre di Karin che, se non uccide chi lo beve, ne risveglia il potenziale. Goku lo beve per affrontare il Grande Mago Piccolo e sopravvive: ne esce molto più forte.",
    en: "The poison kept above Korin Tower that, if it does not kill whoever drinks it, awakens their potential. Goku drinks it to face King Piccolo and survives: he comes out much stronger.",
  }, { localizedName: { it: 'Acqua Ultrasacra', en: 'Ultra Divine Water' }, japaneseName: '超神水', tags: ['karin', 'grande-mago-piccolo'] }),
];
