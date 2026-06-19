/*
 * Dane modlitewnika EPP.
 * Aby ręcznie dodać modlitwę, dopisz na końcu listy kolejny blok:
 * { title: "Tytuł", text: `Treść modlitwy` },
 */
const EPP_GODZINKI_STANDARD_OPENING = `Przybądź nam, miłościwa Pani, ku pomocy,
A wyrwij nas z potężnych nieprzyjaciół mocy.

Chwała Ojcu, Synowi Jego przedwiecznemu,
I równemu im w Bóstwie Duchowi Świętemu.

Jak była na początku, i zawsze, i ninie,
Niech Bóg w Trójcy jedyny na wiek wieków słynie.`;

const EPP_GODZINKI_COMMON_PRAYER = `P. Pani, wysłuchaj modlitwy nasze.
W. A wołanie nasze niech do Ciebie przyjdzie.

Módlmy się:

Święta Maryjo, Królowo niebieska,
Matko Pana naszego Jezusa Chrystusa i Pani świata, która
nikogo nie opuszczasz i nikim nie gardzisz,
wejrzyj na nas, Pani nasza, łaskawym okiem miłosierdzia
swego i uproś nam u Syna swego miłego odpuszczenie
wszystkich grzechów naszych, abyśmy, którzy teraz święte
Twoje i Niepokalane Poczęcie nabożnym sercem
rozpamiętywamy, wiecznego błogosławieństwa zapłatę
w niebie otrzymać mogli; co niechaj da Ten, któregoś Ty,
Panno, porodziła, Syn Twój, a Pan nasz Jezus Chrystus,
który z Ojcem i Duchem Świętym żyje i króluje w Trójcy
Świętej jedyny Bóg na wieki wieków.

W. Amen.`;

const EPP_GODZINKI_JUTRZNIA_BLESSING = `P. Pani, wysłuchaj modlitwy naszej.
W. A wołanie nasze niech do Ciebie przyjdzie.
P. Błogosławimy Panu.
W. Bogu chwała.
P. A dusze wiernych zmarłych przez miłosierdzie Boże
niech odpoczywają w pokoju.
W. Amen.`;

function eppGodzinkiHour(title, hymn, versicle, options = {}) {
  const opening = options.opening || EPP_GODZINKI_STANDARD_OPENING;
  const ending = options.includeBlessing
    ? `${EPP_GODZINKI_COMMON_PRAYER}\n\n${EPP_GODZINKI_JUTRZNIA_BLESSING}`
    : EPP_GODZINKI_COMMON_PRAYER;

  return {
    title,
    text: `${opening}\n\nHymn\n\n${hymn}\n\n${versicle}\n\n${ending}`
  };
}

window.EPP_PRAYERS = [
  {
    title: "Modlitwa Pielgrzyma",
    text: `Panie Jezu,
Wyruszyłem na pątniczy szlak z wiarą i nadzieją w sercu.
Spraw, aby ten trud drogi: upał, deszcz, ból fizyczny i zmęczenie,
stały się dla mnie czasem oczyszczenia i zbliżenia do Ciebie.

Pomóż mi w drugim człowieku dostrzegać Twoją obecność,
uczyć się cierpliwości, pokory i dzielenia się chlebem oraz uśmiechem.
Niech wstawiennictwo Matki Bożej Jasnogórskiej,
do której zmierzam, chroni mnie przed zniechęceniem i niebezpieczeństwami na drodze.

Przemieniaj moje serce, bym po powrocie z pielgrzymki
był lepszym świadkiem Twojej Ewangelii w codziennym życiu. Amen.`
  },
  {
    title: "Anioł Pański",
    text: `Anioł Pański zwiastował Pannie Maryi.
I poczęła z Ducha Świętego.
Zdrowaś Maryjo...

Oto Ja służebnica Pańska.
Niech mi się stanie według słowa twego.
Zdrowaś Maryjo...

A Słowo ciałem się stało.
I mieszkało między nami.
Zdrowaś Maryjo...

Módl się za nami, święta Boża Rodzicielko.
Abyśmy się stali godnymi obietnic Chrystusowych.

Módlmy się: Łaskę Twoją, prosimy Cię, Panie, wlej w serca nasze, abyśmy, którzy za zwiastowaniem anielskim Wcielenie Chrystusa, Syna Twego, poznali, przez mękę Jego i krzyż do chwały zmartwychwstania zostali doprowadzeni. Przez Chrystusa, Pana naszego. Amen.`
  },
  {
    title: "Pod Twoją Obronę",
    text: `Pod Twoją obronę uciekamy się,
święta Boża Rodzicielko,
naszymi prośbami racz nie gardzić w potrzebach naszych,
ale od wszelakich złych przygód racz nas zawsze wybawiać,
Panno chwalebna i błogosławiona.

O Pani nasza, Orędowniczko nasza,
Pośredniczko nasza, Pocieszycielko nasza.
Z Synem swoim nas pojednaj,
Synowi supremo nas polecaj,
swojemu Synowi nas oddawaj.`
  },
  {
    title: "Różaniec - Tajemnice Radosne",
    text: `1. Zwiastowanie Najświętszej Maryi Pannie
2. Nawiedzenie św. Elżbiety
3. Narodzenie Pana Jezusa w Betlejem
4. Ofiarowanie Pana Jezusa w Świątyni
5. Odnalezienie Pana Jezusa w Świątyni

Wskazówka pielgrzymkowa: Każda dziesiątka to doskonała okazja do refleksji nad kolejnymi krokami Jezusa i Maryi oraz ofiarowania intencji niesionych w sercu.`
  },
  {
    title: "Godzinki o Niepokalanym Poczęciu Najświętszej Maryi Panny",
    includeInSongs: true,
    sections: [
      eppGodzinkiHour(
        "Na Jutrznię",
        `1. Zawitaj, Pani świata, niebieska Królowa,
Witaj, Panno nad panny, gwiazdo porankowa!

2. Zawitaj, pełna łaski, prześliczna światłości,
Pani, na pomoc świata śpiesz się, zbaw nas złości.

3. Ciebie Monarcha wieczny od wieków swojemu
Za Matkę obrał Słowu Jednorodzonemu.

4. Przez które ziemi okrąg i nieba ogniste,
I powietrze, i wody stworzył przeźroczyste.

5. Ciebie, Oblubienicę, przyozdobił sobie,
Bo przestępstwo Adama nie ma prawa w Tobie.`,
        `P. Wybrał Ją Bóg i wywyższył ponad wszystko.
W. I wziął Ją na mieszkanie do przybytku Swego.`,
        {
          opening: `Zacznijcie, wargi nasze, chwalić Pannę świętą,
Zacznijcie opowiadać cześć Jej niepojętą.

${EPP_GODZINKI_STANDARD_OPENING}`,
          includeBlessing: true
        }
      ),
      eppGodzinkiHour(
        "Na Prymę",
        `1. Zawitaj, Panno mądra, domie poświęcony,
Siedmioma kolumnami pięknie ozdobiony.

2. Od wszelakiej zarazy świata ochroniona,
Pierwej święta w żywocie matki, niż zrodzona.

3. Tyś matką wszech żyjących, Tyś jest świętych drzwiami,
Nowa gwiazdo z Jakuba. Tyś nad Aniołami.

4. Ogromna czartu jesteś, w szyku obóz silny,
Bądź chrześcijan ucieczką i port nieomylny.`,
        `P. Sam Ją stworzył w Duchu Świętym.
W. I wyniósł Ją nad wszystkie dzieła rąk Swoich.`
      ),
      eppGodzinkiHour(
        "Na Tercję",
        `1. Witaj, Arko przymierza, tronie Salomona,
Tęczo, wszechmocną ręką z pięknych farb złożona.

2. Tyś krzak Mojżesza, boskim ogniem gorejąca,
Tyś różdżka Aronowa, śliczny kwiat rodząca.

3. Bramo rajska zamkniona, runo Gedeona,
Tyś niezwyciężonego plastr miodu Samsona.

4. Przystało, aby Cię Syn tak zacny od winy
Pierworodnej zachował i zmazy Ewinej.

5. Który Ciebie za Matkę obierając Sobie,
Chciał, by przywara grzechu nie powstała w Tobie.`,
        `P. Ja mieszkam na wysokościach.
W. I tron Mój w słupie obłoku.`
      ),
      eppGodzinkiHour(
        "Na Sekstę",
        `1. Witaj, świątynio Boga, w Trójcy jedynego,
Tyś raj Aniołów, pałac wstydu panieńskiego!

2. Pociecho utrapionych, ogrodzie wdzięczności,
O palmo cierpliwości, o cedrze czystości!

3. Ziemią jesteś kapłańską i błogosławioną,
Świętą i pierworodną zmazą niedotknioną.

4. Miasto Pańskie i brama na wschód wystawiona,
Wszelkąś łaską, jedyna Panno, wypełniona.`,
        `P. Jak lilia między cierniem.
W. Tak przyjaciółka moja między córkami Adamowymi.`
      ),
      eppGodzinkiHour(
        "Na Nonę",
        `1. Witaj, miasto ucieczki, wieżo utwierdzona,
Dawidowa, basztami i bronią wzmocniona.

2. Tyś przy poczęciu ogniem miłości pałała,
Przez Cię władza piekielnych mocarzów stajała.

3. O mężna białogłowo, Judyt wojująca,
Od niewoli okrutnej lud swój ratująca.

4. Rachel ożywiciela Egiptu nosiła,
Nam Zbawiciela świata Maryja powiła.`,
        `P. Wszystka piękna jesteś, przyjaciółko moja.
W. A zmaza pierworodna nigdy w Tobie nie postała.`
      ),
      eppGodzinkiHour(
        "Na Nieszpory",
        `1. Witaj, światło z Gabaon, coś zwycięstwo dało,
Z Ciebie Słowo przedwieczne w ciało się przybrało.

2. Aby człowiek z padołu powstał wywyższony,
Niewiele od Aniołów jest on umniejszony.

3. Słońca tego promieńmi Maryja jaśnieje,
W poczęciu Swym, jak złota zorza światłem sieje.

4. Między cierniem lilija kruszy łeb smokowi,
Piękna jak w pełni księżyc, świeci człowiekowi.`,
        `P. Jam sprawiła na niebie, aby wschodziła światłość nieustająca.
W. I jako mgła okryłam wszystką ziemię.`
      ),
      eppGodzinkiHour(
        "Na Kompletę",
        `1. Witaj, Matko szlachetna, w panieńskiej czystości,
Gwiazdami uwieńczona, Pani łaskawości.

2. Niepokalana, czystsza niżli Aniołowie,
Po prawej stronie Króla stoisz w złotogłowie.

3. O Rodzicielko łaski, nadziejo grzeszących,
O jasna gwiazdo morska, o porcie tonących!

4. Bramo rajska, niemocnych zdrowie w Twej obronie,
Niech Boga oglądamy na górnym Syjonie.`,
        `P. Jako olej wylany, o Maryjo, Imię Twoje.
W. Słudzy Twoi zakochali się bardzo w Tobie.`,
        {
          opening: `Niech nas Syn Twój, o Pani, do Siebie nawróci,
A swoje zagniewanie niech od nas odwróci.

${EPP_GODZINKI_STANDARD_OPENING}`
        }
      ),
      {
        title: "Ofiarowanie i zakończenie",
        text: `Ofiarowanie Godzinek

1. Z pokłonem, Panno święta, ofiarujem Tobie
Te Godzinki ku większej czci Twej i ozdobie.

2. Prosząc, byś nas zbawienną drogą prowadziła,
A przy śmierci nam słodką Opiekunką była.

Antyfona

Tać to różdżka, w której ani pierworodnej,
ani uczynkowej winy skaza nie postała.

P. W poczęciu Swoim, Panno, niepokalanaś była.
W. Módl się za nami do Ojca, któregoś Syna porodziła.

Módlmy się:

Boże, któryś przez Niepokalane Poczęcie Maryi Panny
godny Synowi Swemu przybytek zgotował, Ciebie prosimy,
abyś przez wstawiennictwo Tej, którąś dla przewidzianej
śmierci Tegoż Syna od wszelkiej zmazy zachował, nam
niepokalanymi przyjść do Siebie dozwolił. Przez Chrystusa,
Pana naszego, który z Tobą żyje i króluje na wieki wieków.

W. Amen.`
      }
    ]
  }
];
