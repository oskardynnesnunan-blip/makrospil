export type GameCase = {
  id: string;
  title: string;
  description: string;
  theme: string;
  macroQuestion: string;
  timeLimitSeconds: number;
  hints: string[];
  optionA: {
    id: string;
    title: string;
    text: string;
    next: string;
    feedback: string;
  };
  optionB: {
    id: string;
    title: string;
    text: string;
    next: string;
    feedback: string;
  };
};

export const gameCases: Record<string, GameCase> = {
  intro_inflation: {
    id: "intro_inflation",
    title: "Inflationen bider stadig",
    description:
      "Centralbanken er presset. Inflation er stadig høj, men væksten er svag. Hvad gør I?",
    theme: "inflation",
    macroQuestion:
      "Hvordan bør økonomien reagere, når inflationen er høj samtidig med, at væksten er svag? Brug makroøkonomisk teori i jeres vurdering.",
    timeLimitSeconds: 480,
    hints: [
      "Tænk på pengepolitik og samlet efterspørgsel.",
      "Hvordan påvirker en rentestigning forbrug og investeringer?",
      "Overvej konflikten mellem inflation og arbejdsløshed.",
    ],
    optionA: {
      id: "rente",
      title: "Hæv renten",
      text: "Dæmp inflationen, men risiko for lavere vækst og højere arbejdsløshed.",
      next: "labor_pressure",
      feedback:
        "Dette valg svarer til kontraktiv pengepolitik. En højere rente dæmper forbrug og investeringer, reducerer samlet efterspørgsel og kan derfor dæmpe inflationen. Til gengæld kan BNP-væksten falde, og arbejdsløsheden kan stige.",
    },
    optionB: {
      id: "stimulus",
      title: "Stimuler økonomien",
      text: "Beskyt jobs, men risiko for mere inflation og større gæld.",
      next: "debt_doubt",
      feedback:
        "Dette valg svarer til ekspansiv økonomisk politik. Det kan støtte beskæftigelse og aktivitet på kort sigt, men når inflationen allerede er høj, kan ekstra efterspørgsel forstærke prisstigningerne og øge den offentlige gæld.",
    },
  },

  labor_pressure: {
    id: "labor_pressure",
    title: "Arbejdsløsheden stiger",
    description:
      "Jeres stramme linje dæmpede prispresset, men flere virksomheder holder igen. Hvad gør I nu?",
    theme: "arbejdsmarked",
    macroQuestion:
      "Hvordan bør staten reagere, når arbejdsløsheden stiger efter en stram pengepolitik? Brug makroøkonomisk teori om arbejdsmarked, efterspørgsel og stabiliseringspolitik.",
    timeLimitSeconds: 480,
    hints: [
      "Tænk på sammenhængen mellem efterspørgsel og beskæftigelse.",
      "Hvordan påvirker støtteordninger virksomhedernes aktivitet?",
      "Overvej kortsigtet hjælp mod langsigtet inflationskontrol.",
    ],
    optionA: {
      id: "help_business",
      title: "Hjælp udsatte virksomheder",
      text: "Beskyt arbejdspladser, men det kan belaste budgettet.",
      next: "budget_strain",
      feedback:
        "Dette valg er ekspansiv finanspolitik rettet mod arbejdsmarkedet. Støtte til virksomheder kan holde beskæftigelsen oppe og dæmpe stigningen i arbejdsløshed. Ulempen er, at det kan øge de offentlige udgifter og gøre det sværere at holde inflationen nede.",
    },
    optionB: {
      id: "stay_hard",
      title: "Fasthold den stramme linje",
      text: "Hold inflationen nede, men risiko for social uro.",
      next: "social_unrest",
      feedback:
        "Dette valg prioriterer inflationsbekæmpelse over beskæftigelse. Hvis den stramme linje fastholdes, kan prispresset falde yderligere, men lavere efterspørgsel kan også føre til højere arbejdsløshed og svagere vækst.",
    },
  },

  debt_doubt: {
    id: "debt_doubt",
    title: "Gælden vokser",
    description:
      "Jeres hjælpepakker løftede aktiviteten, men markedet begynder at tvivle på jeres økonomiske disciplin. Hvad gør I nu?",
    theme: "gæld",
    macroQuestion:
      "Hvordan bør staten reagere, når ekspansiv politik har øget aktiviteten, men også skabt tvivl om gældens holdbarhed? Brug teori om offentlig gæld, tillid og finanspolitik.",
    timeLimitSeconds: 480,
    hints: [
      "Tænk på forholdet mellem underskud, gæld og troværdighed.",
      "Hvordan reagerer investorer, når de mister tillid?",
      "Overvej kortsigtet vækst mod langsigtet holdbarhed.",
    ],
    optionA: {
      id: "save_plan",
      title: "Start en spareplan",
      text: "Skab tillid, men risiko for at bremse væksten hurtigt.",
      next: "growth_slump",
      feedback:
        "Dette valg er kontraktiv finanspolitik. En spareplan kan forbedre statens troværdighed og dæmpe bekymringer om gælden. Ulempen er, at lavere offentligt forbrug eller højere skatter kan reducere samlet efterspørgsel og svække væksten.",
    },
    optionB: {
      id: "continue_support",
      title: "Fortsæt støtten",
      text: "Beskyt væksten nu, men risiko for mere inflation og gæld.",
      next: "market_panic",
      feedback:
        "Dette valg holder aktiviteten oppe gennem fortsat ekspansiv finanspolitik. Det kan begrænse fald i BNP og beskæftigelse på kort sigt, men det øger risikoen for højere gæld, inflation og svækket tillid på finansmarkederne.",
    },
  },

  budget_strain: {
    id: "budget_strain",
    title: "Budgettet er under pres",
    description:
      "Flere støtteordninger hjælper kortsigtet, men finansministeriet advarer om voksende underskud.",
    theme: "finanspolitik",
    macroQuestion:
      "Hvordan bør staten reagere, når støtteordninger presser de offentlige finanser? Brug makroøkonomisk teori om budgetunderskud, gæld og stabiliseringspolitik.",
    timeLimitSeconds: 480,
    hints: [
      "Tænk på forskellen mellem kortsigtet stabilisering og langsigtet holdbarhed.",
      "Hvordan påvirker offentlige underskud økonomiens troværdighed?",
      "Overvej effekten på vækst og renter.",
    ],
    optionA: {
      id: "cut_spending",
      title: "Skær i udgifterne",
      text: "Vis ansvarlighed, men risiko for politisk modstand.",
      next: "election_pressure",
      feedback:
        "Dette valg er kontraktiv finanspolitik. Lavere offentlige udgifter kan forbedre budgetbalancen og dæmpe gældsopbygningen. Til gengæld kan det reducere samlet efterspørgsel og svække vækst og beskæftigelse på kort sigt.",
    },
    optionB: {
      id: "borrow_more",
      title: "Lån mere",
      text: "Køb tid, men gør økonomien mere sårbar senere.",
      next: "bond_selloff",
      feedback:
        "Dette valg udsætter tilpasningen ved at finansiere underskud med mere gæld. Det kan holde hånden under aktiviteten nu, men højere gæld kan øge rentebyrden og gøre staten mere sårbar over for stigende renter og mistillid fra investorer.",
    },
  },

  social_unrest: {
    id: "social_unrest",
    title: "Vreden vokser i gaderne",
    description:
      "Høj arbejdsløshed og svag vækst skaber protester. Medierne spørger, om I har været for hårde.",
    theme: "social uro",
    macroQuestion:
      "Hvordan bør økonomisk politik reagere, når høj arbejdsløshed skaber social uro? Brug teori om beskæftigelse, efterspørgsel og finanspolitik.",
    timeLimitSeconds: 480,
    hints: [
      "Tænk på sammenhængen mellem arbejdsløshed og social stabilitet.",
      "Hvordan påvirker støtte til husholdninger privatforbruget?",
      "Overvej risikoen for at øge budgetunderskuddet.",
    ],
    optionA: {
      id: "support_households",
      title: "Støt husholdningerne",
      text: "Dæmp presset, men det koster på budgettet.",
      next: "budget_strain",
      feedback:
        "Dette valg kan øge husholdningernes disponible indkomst og støtte privatforbruget. Det kan dæmpe faldet i efterspørgslen og begrænse arbejdsløshed, men det presser samtidig de offentlige finanser og kan gøre det sværere at reducere underskuddet.",
    },
    optionB: {
      id: "hold_course",
      title: "Hold kursen",
      text: "Signalér fasthed, men risiko for mere vrede og faldende tillid.",
      next: "election_pressure",
      feedback:
        "Dette valg holder fast i en stram stabiliseringslinje. Det kan styrke troværdigheden i økonomisk politik, men hvis arbejdsløsheden forbliver høj, kan det svække efterspørgslen yderligere og forværre de sociale og økonomiske problemer.",
    },
  },

  growth_slump: {
    id: "growth_slump",
    title: "Væksten går i stå",
    description:
      "Virksomhederne investerer mindre, og forbrugerne bliver mere forsigtige. Hvad prioriterer I?",
    theme: "vækst",
    macroQuestion:
      "Hvordan bør staten stimulere en økonomi med svag vækst og lav investeringslyst? Brug teori om efterspørgsel, investeringer og finanspolitik.",
    timeLimitSeconds: 480,
    hints: [
      "Tænk på hvad der driver BNP i efterspørgselsmodellen.",
      "Hvordan påvirker offentlige investeringer aktiviteten?",
      "Overvej forskellen på skattelettelser og offentlige investeringer.",
    ],
    optionA: {
      id: "public_investment",
      title: "Offentlige investeringer",
      text: "Løft aktiviteten, men øg presset på de offentlige finanser.",
      next: "energy_shock",
      feedback:
        "Dette valg er ekspansiv finanspolitik gennem offentlige investeringer. Det kan øge samlet efterspørgsel direkte og samtidig forbedre produktiviteten på længere sigt. Ulempen er højere offentlige udgifter og mulig forværring af budgetbalancen.",
    },
    optionB: {
      id: "tax_cuts",
      title: "Sænk skatterne",
      text: "Skab aktivitet, men usikker effekt og færre indtægter.",
      next: "trade_break",
      feedback:
        "Dette valg øger husholdningers og virksomheders disponible midler og kan stimulere privatforbrug og investeringer. Effekten afhænger dog af, om de faktisk bruger pengene. Samtidig falder statens indtægter, hvilket kan øge underskuddet.",
    },
  },

  market_panic: {
    id: "market_panic",
    title: "Markederne bliver nervøse",
    description:
      "Renterne på jeres statsobligationer stiger, og investorerne tvivler på jeres troværdighed.",
    theme: "finansmarked",
    macroQuestion:
      "Hvordan bør staten reagere, når investorer mister tillid, og obligationsrenterne stiger? Brug teori om troværdighed, statsfinanser og finansielle markeder.",
    timeLimitSeconds: 480,
    hints: [
      "Tænk på hvorfor obligationsrenter stiger.",
      "Hvordan påvirker tillid statens låneomkostninger?",
      "Overvej konflikten mellem vækst og budgetdisciplin.",
    ],
    optionA: {
      id: "restore_trust",
      title: "Genopret tillid",
      text: "Vis budgetdisciplin og ro på markederne.",
      next: "growth_slump",
      feedback:
        "Dette valg søger at sænke risikopræmien på statens gæld ved at signalere ansvarlig finanspolitik. Hvis troværdigheden genoprettes, kan renterne falde. Ulempen er, at stram finanspolitik kan dæmpe væksten yderligere.",
    },
    optionB: {
      id: "defend_growth",
      title: "Forsvar væksten",
      text: "Bevar aktiviteten, men markedet kan straffe jer hårdere.",
      next: "bond_selloff",
      feedback:
        "Dette valg prioriterer realøkonomien her og nu, men hvis markederne allerede er nervøse, kan fortsat ekspansion øge mistilliden. Det kan føre til endnu højere renter, større rentebetalinger og svagere finanspolitisk holdbarhed.",
    },
  },

  election_pressure: {
    id: "election_pressure",
    title: "Valgår og folkelig vrede",
    description:
      "Valget nærmer sig. Presset stiger for at love hurtige forbedringer, selv om økonomien er skrøbelig.",
    theme: "politik",
    macroQuestion:
      "Hvordan bør økonomisk politik håndtere presset for populære løsninger i et valgår? Brug teori om politisk konjunkturpolitik, gæld og inflation.",
    timeLimitSeconds: 480,
    hints: [
      "Tænk på forskellen mellem politisk gevinst og økonomisk holdbarhed.",
      "Hvordan påvirker lempelig politik inflation og gæld?",
      "Overvej troværdighed på længere sigt.",
    ],
    optionA: {
      id: "popular_relief",
      title: "Lov hurtige lettelser",
      text: "Vælg populær politik, men risiko for større gæld og inflation.",
      next: "energy_shock",
      feedback:
        "Dette valg er politisk attraktivt, fordi det kan øge efterspørgslen og mindske utilfredshed på kort sigt. Makroøkonomisk kan det dog føre til større underskud, højere gæld og mere inflation, især hvis økonomien allerede er presset.",
    },
    optionB: {
      id: "responsible_line",
      title: "Hold en ansvarlig linje",
      text: "Bevar troværdigheden, men bliv upopulær på kort sigt.",
      next: "trade_break",
      feedback:
        "Dette valg prioriterer troværdighed og økonomisk holdbarhed. En ansvarlig linje kan styrke tilliden hos investorer og mindske risikoen for inflation og gældsproblemer, men den kan være svær at sælge politisk, hvis befolkningen ønsker hurtige forbedringer.",
    },
  },

  bond_selloff: {
    id: "bond_selloff",
    title: "Obligationsmarkedet straffer jer",
    description:
      "Investorerne sælger ud. Jeres låneomkostninger stiger hurtigt, og budgettet bliver hårdt ramt.",
    theme: "gældskrise",
    macroQuestion:
      "Hvordan bør staten reagere, når obligationsmarkedet mister tillid, og låneomkostningerne stiger hurtigt? Brug teori om gældskrise, renter og finanspolitik.",
    timeLimitSeconds: 480,
    hints: [
      "Tænk på hvad stigende obligationsrenter gør ved budgettet.",
      "Hvordan kan tillid genoprettes?",
      "Overvej forskellen på ekstern hjælp og interne nedskæringer.",
    ],
    optionA: {
      id: "imf_help",
      title: "Søg international hjælp",
      text: "Få støtte udefra, men mist noget politisk frihed.",
      next: "trade_break",
      feedback:
        "Dette valg kan give adgang til finansiering og genoprette tillid, fordi eksterne institutioner signalerer kontrol og reformvilje. Til gengæld følger der ofte krav om stram økonomisk politik, som kan dæmpe vækst og beskæftigelse på kort sigt.",
    },
    optionB: {
      id: "emergency_cuts",
      title: "Lav akutte nedskæringer",
      text: "Vis handlekraft, men risiko for recession og vrede.",
      next: "bank_stress",
      feedback:
        "Dette valg kan hurtigt forbedre budgetbalancen og sende et signal om disciplin. Makroøkonomisk kan akutte nedskæringer dog trække efterspørgslen ned og forværre recessionen, især hvis økonomien allerede er svag.",
    },
  },

  energy_shock: {
    id: "energy_shock",
    title: "Energipriserne eksploderer",
    description:
      "En ny konflikt presser olie- og gaspriserne op. Inflation og usikkerhed blusser op igen.",
    theme: "energi",
    macroQuestion:
      "Hvordan bør økonomisk politik reagere på et energichok, der både øger inflation og usikkerhed? Brug teori om udbudschok og stagflation.",
    timeLimitSeconds: 480,
    hints: [
      "Tænk på forskellen mellem efterspørgselsinflation og udbudsinflation.",
      "Hvordan påvirker dyrere energi virksomheder og husholdninger?",
      "Overvej hvorfor dette kan føre til stagflation.",
    ],
    optionA: {
      id: "subsidize_energy",
      title: "Giv energisubsidier",
      text: "Skærm borgere og virksomheder, men det koster dyrt.",
      next: "bank_stress",
      feedback:
        "Dette valg dæmper det direkte pres på husholdninger og virksomheder og kan begrænse fald i forbrug og produktion. Ulempen er, at subsidier er dyre for staten og kan svække incitamentet til at tilpasse energiforbruget.",
    },
    optionB: {
      id: "let_prices_rise",
      title: "Lad priserne stige",
      text: "Beskyt budgettet, men skab social og politisk frustration.",
      next: "climate_damage",
      feedback:
        "Dette valg undgår store offentlige udgifter, men husholdninger og virksomheder må selv bære chokket. Det kan dæmpe statens underskud, men reducerer realindkomst, svækker efterspørgsel og kan øge social uro.",
    },
  },

  trade_break: {
    id: "trade_break",
    title: "Handelskonflikten breder sig",
    description:
      "Toldsatser og eksportrestriktioner skaber problemer i forsyningskæderne. Produktionen bliver dyrere.",
    theme: "handel",
    macroQuestion:
      "Hvordan bør økonomien reagere, når handelskonflikter gør import dyrere og svækker produktionen? Brug teori om handel, inflation og vækst.",
    timeLimitSeconds: 480,
    hints: [
      "Tænk på hvordan dyrere import påvirker virksomhedernes omkostninger.",
      "Hvordan påvirker handel vækst og produktivitet?",
      "Overvej forskellen på beskyttelse og åbenhed.",
    ],
    optionA: {
      id: "protect_market",
      title: "Beskyt hjemmemarkedet",
      text: "Skærm egne virksomheder, men gør varer dyrere.",
      next: "currency_slide",
      feedback:
        "Dette valg kan beskytte udvalgte virksomheder mod udenlandsk konkurrence på kort sigt. Makroøkonomisk kan mere protektionisme dog føre til højere priser, lavere effektivitet og svagere handel, hvilket kan dæmpe væksten.",
    },
    optionB: {
      id: "new_allies",
      title: "Søg nye handelsallierede",
      text: "Byg nye relationer, men det tager tid og er usikkert.",
      next: "climate_damage",
      feedback:
        "Dette valg forsøger at mindske afhængigheden af konfliktområder og genopbygge handelsstrømme. På længere sigt kan det støtte vækst og forsyningssikkerhed, men tilpasningen tager tid, og gevinsten kommer ikke med det samme.",
    },
  },

  bank_stress: {
    id: "bank_stress",
    title: "Bankerne er under pres",
    description:
      "Højere renter og svag vækst rammer finanssektoren. Nogle banker ser sårbare ud.",
    theme: "banker",
    macroQuestion:
      "Hvordan bør staten reagere, når banker bliver sårbare under høj rente og svag vækst? Brug teori om finansiel stabilitet, kredit og recession.",
    timeLimitSeconds: 480,
    hints: [
      "Tænk på bankernes rolle i økonomien.",
      "Hvordan påvirker bankkriser kreditgivning og investeringer?",
      "Overvej moral hazard mod systemisk risiko.",
    ],
    optionA: {
      id: "rescue_banks",
      title: "Red bankerne",
      text: "Skab ro nu, men vækker kritik af elitær politik.",
      next: "currency_slide",
      feedback:
        "Dette valg kan forhindre kreditkollaps og begrænse smitte til resten af økonomien. Hvis bankerne reddes, kan det støtte finansiel stabilitet og beskytte investeringer og beskæftigelse. Ulempen er risikoen for moral hazard og kritik af, at staten redder finanssektoren.",
    },
    optionB: {
      id: "let_fail",
      title: "Lad svage banker falde",
      text: "Undgå redningspakker, men risiko for større panik.",
      next: "global_crisis",
      feedback:
        "Dette valg undgår direkte statslig støtte og kan reducere moral hazard. Makroøkonomisk er risikoen dog, at banknedbrud spreder usikkerhed, reducerer kreditgivning og forværrer recessionen gennem lavere investeringer og forbrug.",
    },
  },

  climate_damage: {
    id: "climate_damage",
    title: "Klimachok rammer økonomien",
    description:
      "Ekstremt vejr rammer høst, energi og transport. Forsyninger bliver ustabile.",
    theme: "klima",
    macroQuestion:
      "Hvordan bør økonomisk politik reagere på klimachok, der rammer produktion, forsyninger og priser? Brug teori om udbudschok, produktivitet og langsigtet vækst.",
    timeLimitSeconds: 480,
    hints: [
      "Tænk på hvordan klimachok påvirker samlet udbud.",
      "Hvordan adskiller akut hjælp sig fra langsigtede investeringer?",
      "Overvej både kortsigtet stabilisering og langsigtet robusthed.",
    ],
    optionA: {
      id: "acute_relief",
      title: "Akut nødhjælp",
      text: "Hjælp hurtigt, men det er dyrt og kortsigtet.",
      next: "global_crisis",
      feedback:
        "Dette valg er relevant, hvis målet er at dæmpe de umiddelbare økonomiske tab og støtte husholdninger og virksomheder hurtigt. Ulempen er, at det ikke i sig selv øger økonomiens robusthed over for fremtidige chok og kan belaste budgettet.",
    },
    optionB: {
      id: "green_transition",
      title: "Invester i grøn omstilling",
      text: "Styrk robustheden, men det tager tid før gevinsten kommer.",
      next: "currency_slide",
      feedback:
        "Dette valg fokuserer på langsigtet udbudsside og produktivitet. Investeringer i grøn omstilling kan gøre økonomien mere modstandsdygtig og mindske sårbarhed over for energichok og klimaskader. Effekten kommer dog langsommere end ved akut støtte.",
    },
  },

  currency_slide: {
    id: "currency_slide",
    title: "Valutaen svækkes",
    description:
      "Kapital flytter sig, og jeres valuta kommer under pres. Import bliver dyrere, og nervøsiteten stiger.",
    theme: "valuta",
    macroQuestion:
      "Hvordan bør staten eller centralbanken reagere, når valutaen svækkes, og importpriserne stiger? Brug teori om valutakurser, kapitalbevægelser og inflation.",
    timeLimitSeconds: 480,
    hints: [
      "Tænk på hvorfor en svag valuta kan øge inflationen.",
      "Hvordan påvirker renten kapitalbevægelser?",
      "Overvej fordele og ulemper ved kapitalkontrol.",
    ],
    optionA: {
      id: "raise_rates_again",
      title: "Hæv renten igen",
      text: "Forsvar valutaen, men det går ud over væksten.",
      next: "global_crisis",
      feedback:
        "Dette valg følger klassisk pengepolitisk forsvar af valutaen. Højere rente kan tiltrække kapital og dæmpe valutafaldet. Samtidig gør det lån dyrere og reducerer efterspørgslen, hvilket kan svække vækst og beskæftigelse.",
    },
    optionB: {
      id: "capital_controls",
      title: "Indfør kontrol",
      text: "Brems kapitalflugt, men skræm investorerne.",
      next: "global_crisis",
      feedback:
        "Dette valg kan kortsigtet begrænse kapitalflugt og stabilisere valutaen. Ulempen er, at kapitalkontrol kan mindske investorernes tillid, svække fremtidige investeringer og gøre økonomien mindre attraktiv internationalt.",
    },
  },

  global_crisis: {
    id: "global_crisis",
    title: "Global krise ryster systemet",
    description:
      "Flere chok rammer samtidig. Nu skal I vælge mellem dårlige løsninger og redde det, der kan reddes.",
    theme: "global krise",
    macroQuestion:
      "Hvordan bør et land reagere, når flere globale chok rammer samtidig? Brug makroøkonomisk teori om international koordinering, stabilisering og krisehåndtering.",
    timeLimitSeconds: 480,
    hints: [
      "Tænk på forskellen mellem nationale og internationale løsninger.",
      "Hvordan kan koordinering påvirke handel, renter og tillid?",
      "Overvej hvad der sker, hvis alle kun tænker på sig selv.",
    ],
    optionA: {
      id: "coordinate",
      title: "Koordiner internationalt",
      text: "Søg fælles løsninger, men giv afkald på noget kontrol.",
      next: "housing_bubble",
      feedback:
        "Dette valg kan styrke krisehåndtering gennem fælles finanspolitik, handelssamarbejde og koordinering af pengepolitik. Makroøkonomisk kan det mindske usikkerhed og forhindre, at nationale løsninger forværrer den globale situation. Ulempen er mindre national handlefrihed.",
    },
    optionB: {
      id: "national_first",
      title: "Sæt nationen først",
      text: "Beskyt jer selv først, men øg risikoen for nye konflikter.",
      next: "housing_bubble",
      feedback:
        "Dette valg kan være politisk attraktivt og give hurtig kontrol over egne prioriteringer. Makroøkonomisk kan ensidige løsninger dog forværre handelsproblemer, kapitalflugt og internationale spændinger, hvilket kan gøre krisen dybere og længere.",
    },
  },

  housing_bubble: {
    id: "housing_bubble",
    title: "Boligboblen vokser",
    description:
      "Boligpriserne stiger hurtigt, husholdninger låner mere, og bankerne øger udlån. Flere økonomer frygter en boble.",
    theme: "banker",
    macroQuestion:
      "Hvordan bør politikere og centralbank reagere, når boligmarkedet bliver overophedet? Brug makroøkonomisk teori om renter, kredit, finansiel stabilitet og samlet efterspørgsel.",
    timeLimitSeconds: 480,
    hints: [
      "Tænk på finansiel stabilitet og privat gæld.",
      "Overvej hvordan billig kredit påvirker boligpriserne.",
      "Forklar forskellen på kortsigtet vækst og langsigtet risiko.",
    ],
    optionA: {
      id: "tighten_housing_credit",
      title: "Stram kredit og boligregler",
      text: "Dæmp lånevæksten og mindske risikoen for en farlig boligboble.",
      next: "supply_chain_freeze",
      feedback:
        "Dette valg prioriterer finansiel stabilitet. Strammere kreditkrav kan dæmpe spekulativ efterspørgsel og begrænse risikoen for et senere boligkrak. Ulempen er, at aktiviteten i byggeri og privatforbrug kan falde på kort sigt.",
    },
    optionB: {
      id: "let_boom_continue",
      title: "Lad markedet køre videre",
      text: "Bevar høj aktivitet nu, men med risiko for større ubalancer senere.",
      next: "tax_revolt",
      feedback:
        "Dette valg kan støtte vækst og beskæftigelse på kort sigt, fordi høj boligaktivitet øger efterspørgslen. Makroøkonomisk øger det dog risikoen for overophedning, høj gæld og større finansiel uro, hvis boblen brister.",
    },
  },

  supply_chain_freeze: {
    id: "supply_chain_freeze",
    title: "Forsyningskæderne fryser til",
    description:
      "En ny global forstyrrelse betyder, at virksomheder mangler komponenter og råvarer. Produktion forsinkes, og priser presses op.",
    theme: "handel",
    macroQuestion:
      "Hvordan bør økonomisk politik reagere, når udbudschok og forsyningsproblemer rammer samtidig? Brug teori om udbud, inflation og vækst.",
    timeLimitSeconds: 480,
    hints: [
      "Er problemet efterspørgsel eller udbud?",
      "Hvordan kan et udbudschok skabe både inflation og lavere vækst?",
      "Overvej forskellen på bred støtte og målrettet støtte.",
    ],
    optionA: {
      id: "target_key_sectors",
      title: "Målret hjælp til nøglesektorer",
      text: "Hold kritisk produktion i gang uden at stimulere hele økonomien.",
      next: "export_collapse",
      feedback:
        "Dette valg forsøger at afbøde et udbudschok uden at øge samlet efterspørgsel for meget. Målrettet støtte kan holde produktionen i gang i vigtige sektorer, men det presser budgettet og kan skabe krav om hjælp fra mange andre virksomheder.",
    },
    optionB: {
      id: "accept_short_term_weakness",
      title: "Accepter midlertidig svækkelse",
      text: "Undgå brede indgreb og beskyt troværdigheden, men væksten bliver ramt.",
      next: "food_price_spike",
      feedback:
        "Dette valg beskytter de offentlige finanser og undgår at forstærke inflationen gennem bred stimulans. Ulempen er, at virksomheder og husholdninger må bære mere af chokket selv, hvilket kan give lavere aktivitet og højere arbejdsløshed.",
    },
  },

  tax_revolt: {
    id: "tax_revolt",
    title: "Skatteoprør vokser",
    description:
      "Regeringen møder massiv modstand mod nye skatter, samtidig med at budgetunderskuddet stiger.",
    theme: "politik",
    macroQuestion:
      "Hvordan bør staten reagere, når behovet for budgetdisciplin kolliderer med politisk modstand? Brug teori om offentlige finanser, troværdighed og politisk økonomi.",
    timeLimitSeconds: 480,
    hints: [
      "Tænk på forholdet mellem legitimitet og troværdighed.",
      "Hvordan reagerer markederne på politisk usikkerhed?",
      "Overvej forskellen på kortsigtet ro og langsigtet holdbarhed.",
    ],
    optionA: {
      id: "hold_budget_line",
      title: "Hold fast i budgetdisciplin",
      text: "Bevar tillid til de offentlige finanser trods modstand.",
      next: "pension_gap",
      feedback:
        "Dette valg kan styrke troværdighed og dæmpe investorernes bekymring om gæld og underskud. Ulempen er, at politisk modstand og utilfredshed kan vokse, hvis vælgerne oplever hårde stramninger uden hurtige forbedringer.",
    },
    optionB: {
      id: "delay_tightening",
      title: "Udskyd stramningerne",
      text: "Skab politisk ro nu, men risikoen vokser senere.",
      next: "public_strike_wave",
      feedback:
        "Dette valg kan give kortsigtet politisk stabilitet og mindre modstand mod regeringen. Makroøkonomisk øger det dog risikoen for voksende underskud, højere gæld og svækket troværdighed på længere sigt.",
    },
  },

  export_collapse: {
    id: "export_collapse",
    title: "Eksporten kollapser",
    description:
      "Vigtige eksportmarkeder svækkes pludseligt. Efterspørgslen efter landets varer falder kraftigt, og virksomheder varsler fyringer.",
    theme: "handel",
    macroQuestion:
      "Hvordan bør økonomisk politik reagere, når eksportdrevet vækst falder hurtigt? Brug teori om efterspørgsel, konkurrenceevne og arbejdsmarked.",
    timeLimitSeconds: 480,
    hints: [
      "Tænk på hvordan lavere eksport påvirker BNP.",
      "Hvordan hænger eksport, investeringer og jobs sammen?",
      "Vurder både kortsigtet støtte og langsigtet konkurrenceevne.",
    ],
    optionA: {
      id: "support_activity_and_jobs",
      title: "Støt aktivitet og beskæftigelse",
      text: "Brug midlertidige tiltag til at dæmpe faldet i økonomien.",
      next: "tech_boom",
      feedback:
        "Dette valg kan dæmpe ledighed og fald i BNP, fordi staten forsøger at holde samlet efterspørgsel oppe. Ulempen er, at det kan øge underskuddet og gøre økonomien mere sårbar, hvis støtten bliver langvarig.",
    },
    optionB: {
      id: "focus_competitiveness",
      title: "Fokusér på konkurrenceevne",
      text: "Hold igen nu og styrk økonomiens robusthed på længere sigt.",
      next: "currency_attack",
      feedback:
        "Dette valg prioriterer økonomiens tilpasning og langsigtede styrke. Det kan forbedre konkurrenceevnen over tid, men på kort sigt kan lavere efterspørgsel og svag eksport føre til højere arbejdsløshed og lavere vækst.",
    },
  },

  pension_gap: {
    id: "pension_gap",
    title: "Pensionsgabet vokser",
    description:
      "En aldrende befolkning lægger pres på pensioner og offentlige udgifter. Arbejdsstyrken vokser ikke nok til at bære byrden.",
    theme: "gæld",
    macroQuestion:
      "Hvordan bør politik reagere på en langsigtet demografisk udfordring med store budgetkonsekvenser? Brug teori om arbejdsudbud, offentlige finanser og holdbarhed.",
    timeLimitSeconds: 480,
    hints: [
      "Tænk langsigtet og strukturelt.",
      "Hvordan påvirkes arbejdsudbud, vækst og budget?",
      "Overvej forskellen på reform nu og udsættelse.",
    ],
    optionA: {
      id: "reform_now",
      title: "Gennemfør reformer nu",
      text: "Stram systemet tidligt for at sikre holdbarhed.",
      next: "green_transition_shock",
      feedback:
        "Dette valg styrker holdbarheden i de offentlige finanser og kan øge tilliden til økonomisk politik. Ulempen er, at reformer ofte er politisk upopulære og kan skabe modstand, hvis byrderne mærkes hurtigt.",
    },
    optionB: {
      id: "postpone_changes",
      title: "Udskyd ændringerne",
      text: "Skån vælgere nu og vent med de hårde beslutninger.",
      next: "food_price_spike",
      feedback:
        "Dette valg undgår konflikt på kort sigt, men øger risikoen for større problemer senere. Hvis reformer udskydes for længe, kan gæld og udgifter vokse hurtigere end økonomiens bæreevne.",
    },
  },

  food_price_spike: {
    id: "food_price_spike",
    title: "Fødevarepriserne eksploderer",
    description:
      "Dårlige høster og højere transportomkostninger driver fødevarepriserne hurtigt op. Husholdningerne mærker presset med det samme.",
    theme: "inflation",
    macroQuestion:
      "Hvordan bør staten reagere, når et nødvendighedsgode stiger kraftigt i pris og rammer skævt socialt? Brug teori om inflation, realindkomst og fordelingsvirkninger.",
    timeLimitSeconds: 480,
    hints: [
      "Tænk på inflation og husholdningernes købekraft.",
      "Hvordan adskiller målrettet hjælp sig fra bred støtte?",
      "Overvej konsekvenserne for budget og efterspørgsel.",
    ],
    optionA: {
      id: "targeted_relief",
      title: "Giv målrettet hjælp",
      text: "Støt de mest pressede husholdninger uden at stimulere hele økonomien.",
      next: "public_strike_wave",
      feedback:
        "Dette valg kan dæmpe de sociale konsekvenser af stigende priser og beskytte de mest udsatte husholdninger. Makroøkonomisk er målrettet hjælp ofte mindre inflationsskabende end brede tiltag, men den belaster stadig de offentlige finanser.",
    },
    optionB: {
      id: "protect_budget",
      title: "Beskyt budgettet",
      text: "Undgå ny støtte, men risikér større utilfredshed og svagere forbrug.",
      next: "tech_boom",
      feedback:
        "Dette valg undgår nye offentlige udgifter og beskytter budgetbalancen. Til gengæld falder husholdningernes reale købekraft mere, hvilket kan svække privatforbruget og øge den sociale utilfredshed.",
    },
  },

  tech_boom: {
    id: "tech_boom",
    title: "Teknologiboom skaber overophedning",
    description:
      "Store investeringer i ny teknologi løfter væksten kraftigt, men lønninger og aktivpriser stiger også hurtigt.",
    theme: "arbejdsmarked",
    macroQuestion:
      "Hvordan bør økonomisk politik reagere, når høj vækst samtidig skaber risiko for overophedning? Brug teori om vækst, inflation og produktionsgab.",
    timeLimitSeconds: 480,
    hints: [
      "Tænk på forskellen mellem sund vækst og overophedning.",
      "Hvordan hænger høj aktivitet sammen med lønpres og inflation?",
      "Overvej hvad der sker, hvis økonomien ikke køles ned i tide.",
    ],
    optionA: {
      id: "cool_economy",
      title: "Køl økonomien lidt ned",
      text: "Dæmp presset for at undgå senere inflation og ubalancer.",
      next: "currency_attack",
      feedback:
        "Dette valg kan være fornuftigt, hvis økonomien bevæger sig over sit bæredygtige niveau. En nedkøling kan begrænse lønpres, aktivbobler og inflation, men den kan også dæmpe investeringer og beskæftigelse mere end ønsket.",
    },
    optionB: {
      id: "ride_the_boom",
      title: "Lad væksten fortsætte",
      text: "Udnyt momentum og accepter højere risiko.",
      next: "green_transition_shock",
      feedback:
        "Dette valg kan holde væksten og optimismen oppe på kort sigt. Makroøkonomisk øger det dog risikoen for overophedning, højere inflation, lønpres og større korrektion senere.",
    },
  },

  currency_attack: {
    id: "currency_attack",
    title: "Valutaen angribes",
    description:
      "Internationale investorer sælger landets valuta, og presset på centralbanken vokser time for time.",
    theme: "renter",
    macroQuestion:
      "Hvordan bør myndigheder reagere, når valuta og tillid er under direkte pres? Brug teori om renter, kapitalbevægelser og troværdighed.",
    timeLimitSeconds: 480,
    hints: [
      "Tænk på hvorfor investorer flytter kapital.",
      "Hvordan påvirker renten valutakursen?",
      "Overvej hvad det koster at forsvare en valuta.",
    ],
    optionA: {
      id: "defend_currency",
      title: "Forsvar valutaen hårdt",
      text: "Brug klare signaler og stram linje for at genskabe tillid.",
      next: "public_strike_wave",
      feedback:
        "Dette valg kan beskytte valutaen og styrke troværdigheden, fordi højere renter eller fast styring kan bremse kapitalflugt. Ulempen er, at stram politik kan svække vækst, kredit og beskæftigelse.",
    },
    optionB: {
      id: "accept_weaker_currency",
      title: "Accepter svækkelsen",
      text: "Undgå hård opstramning, men tag risikoen for mere inflation.",
      next: "green_transition_shock",
      feedback:
        "Dette valg kan skåne aktiviteten på kort sigt, fordi økonomien ikke mødes af hård opstramning. Til gengæld kan en svagere valuta gøre import dyrere, løfte inflationen og øge usikkerheden på markederne.",
    },
  },

  public_strike_wave: {
    id: "public_strike_wave",
    title: "Strejkebølge i den offentlige sektor",
    description:
      "Store grupper i den offentlige sektor strejker for højere løn. Presset på både budget og arbejdsmarked vokser.",
    theme: "arbejdsmarked",
    macroQuestion:
      "Hvordan bør staten reagere, når lønpres, serviceproblemer og budgethensyn kolliderer? Brug teori om løndannelse, inflation og offentlige finanser.",
    timeLimitSeconds: 480,
    hints: [
      "Tænk på lønpres og andenrunde-effekter.",
      "Hvordan påvirker højere offentlige lønninger budgettet?",
      "Overvej forskellen mellem ro nu og pres senere.",
    ],
    optionA: {
      id: "costly_deal_now",
      title: "Indgå dyr aftale nu",
      text: "Skab ro hurtigt, men løft udgifterne markant.",
      next: "green_transition_shock",
      feedback:
        "Dette valg kan skabe hurtig ro og genoprette den offentlige service. Makroøkonomisk kan det dog øge lønpres, offentlige udgifter og forventninger om nye lønstigninger i resten af økonomien.",
    },
    optionB: {
      id: "tight_line_strikes",
      title: "Hold en stram linje",
      text: "Forsvar budgettet og undgå en dyr præcedens.",
      next: "intro_inflation",
      feedback:
        "Dette valg styrker budgetdisciplin og kan dæmpe risikoen for bredere løn- og inflationspres. Ulempen er, at konflikten kan trække ud og forværre både utilfredshed og tab af offentlig service.",
    },
  },

  green_transition_shock: {
    id: "green_transition_shock",
    title: "Grøn omstilling giver prischok",
    description:
      "Nye klimaafgifter og hurtig omstilling løfter energiomkostningerne på kort sigt. Samtidig er der behov for store investeringer.",
    theme: "energi",
    macroQuestion:
      "Hvordan bør politik balancere grøn omstilling, inflation, konkurrenceevne og social accept? Brug teori om udbudschok, investeringer og langsigtet vækst.",
    timeLimitSeconds: 480,
    hints: [
      "Tænk på forskellen mellem kortsigtede omkostninger og langsigtede gevinster.",
      "Hvordan påvirker energiomkostninger inflation og konkurrenceevne?",
      "Overvej om målrettet kompensation kan være en løsning.",
    ],
    optionA: {
      id: "green_support_path",
      title: "Hold fast i omstillingen med støtte",
      text: "Bevar kursen, men hjælp udsatte grupper og virksomheder målrettet.",
      next: "intro_inflation",
      feedback:
        "Dette valg forsøger at balancere grøn omstilling og social stabilitet. Målrettet støtte kan gøre overgangen mere politisk holdbar, men det øger de offentlige udgifter og kræver præcis styring for ikke at presse inflationen yderligere.",
    },
    optionB: {
      id: "slow_transition",
      title: "Sænk tempoet i omstillingen",
      text: "Dæmp prispres nu, men udskyd investeringer og langsigtede gevinster.",
      next: "housing_bubble",
      feedback:
        "Dette valg kan lette presset på virksomheder og husholdninger på kort sigt, fordi omkostningsstigningerne dæmpes. Makroøkonomisk kan det dog forsinke produktive investeringer og gøre økonomien mere sårbar over for fremtidige energi- og klimachok.",
    },
  },
};