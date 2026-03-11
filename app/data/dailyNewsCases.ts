export type DailyNewsCase = {
  id: string;
  title: string;
  description: string;
  region: "Danmark" | "Europa" | "USA" | "Kina" | "Global";
  theme:
    | "inflation"
    | "renter"
    | "boligmarked"
    | "arbejdsmarked"
    | "energi"
    | "handel"
    | "gæld"
    | "banker"
    | "klima"
    | "teknologi"
    | "geopolitik";
  sourceLabel: string;
  freshness: "today" | "recent";
  options: {
    id: string;
    title: string;
    text: string;
    nextTag: string;
    hiddenPoints: number;
  }[];
};

export const dailyNewsCases: DailyNewsCase[] = [
  {
    id: "dk_nationalbank_pressure",
    title: "Nationalbanken under pres",
    description:
      "Danske renter og finansielle forhold er igen i fokus. Skal I prioritere prisstabilitet, ro på markedet eller vækst?",
    region: "Danmark",
    theme: "renter",
    sourceLabel: "Nationalbanken",
    freshness: "recent",
    options: [
      {
        id: "dk_raise_signal",
        title: "Støt en stram linje",
        text: "Signalér prisstabilitet, men risiko for lavere aktivitet.",
        nextTag: "inflation_strict",
        hiddenPoints: 8,
      },
      {
        id: "dk_soft_signal",
        title: "Signaler tålmodighed",
        text: "Undgå overreaktion, men risiko for vedvarende pres.",
        nextTag: "market_doubt",
        hiddenPoints: 5,
      },
      {
        id: "dk_targeted_support",
        title: "Brug målrettet støtte",
        text: "Skærm sårbare grupper, men pres budgettet.",
        nextTag: "budget_stress",
        hiddenPoints: 6,
      },
      {
        id: "dk_growth_push",
        title: "Pres på for vækst",
        text: "Beskyt aktivitet nu, men risiko for troværdighedstab.",
        nextTag: "debt_fear",
        hiddenPoints: 4,
      },
    ],
  },

  {
    id: "dk_housing_heat",
    title: "Boligmarkedet skifter retning",
    description:
      "Boligmarkedet sender blandede signaler. Nogle frygter fald, andre ny overophedning. Hvordan reagerer I?",
    region: "Danmark",
    theme: "boligmarked",
    sourceLabel: "Danske økonominyheder",
    freshness: "recent",
    options: [
      {
        id: "dk_macroprudence",
        title: "Stram kreditpolitikken",
        text: "Dæmp risiko, men pres boligaktiviteten.",
        nextTag: "housing_cooldown",
        hiddenPoints: 8,
      },
      {
        id: "dk_wait",
        title: "Se tiden an",
        text: "Undgå at overstyre, men risiko for større ubalance.",
        nextTag: "housing_risk",
        hiddenPoints: 5,
      },
      {
        id: "dk_household_relief",
        title: "Hjælp pressede husholdninger",
        text: "Skab social ro, men risiko for forvridning.",
        nextTag: "budget_stress",
        hiddenPoints: 6,
      },
      {
        id: "dk_build_more",
        title: "Frem boligbyggeri",
        text: "Tænk strukturelt, men langsom effekt.",
        nextTag: "long_term_gain",
        hiddenPoints: 9,
      },
    ],
  },

  {
    id: "eu_ecb_watch",
    title: "ECB sender nyt signal",
    description:
      "Euroområdets inflationspres er ikke helt væk. Markederne læser alle formuleringer fra ECB tæt.",
    region: "Europa",
    theme: "renter",
    sourceLabel: "ECB / europæiske nyheder",
    freshness: "recent",
    options: [
      {
        id: "eu_follow_ecb",
        title: "Støt ECB’s hårde linje",
        text: "Signalér disciplin, men risiko for svagere vækst.",
        nextTag: "euro_slowdown",
        hiddenPoints: 8,
      },
      {
        id: "eu_growth_flex",
        title: "Efterspørg mere fleksibilitet",
        text: "Beskyt vækst, men risiko for lavere troværdighed.",
        nextTag: "inflation_return",
        hiddenPoints: 5,
      },
      {
        id: "eu_targeted_industry",
        title: "Støt presset industri",
        text: "Hjælp virksomheder, men pres statsbudgetter.",
        nextTag: "budget_stress",
        hiddenPoints: 6,
      },
      {
        id: "eu_reform_push",
        title: "Skub på reformer",
        text: "Styrk konkurrenceevne, men uden hurtig gevinst.",
        nextTag: "long_term_gain",
        hiddenPoints: 9,
      },
    ],
  },

  {
    id: "us_fed_divide",
    title: "USA splittet om næste rentetræk",
    description:
      "Nogle frygter inflation, andre recession. Jeres blok skal tolke, hvad der er farligst nu.",
    region: "USA",
    theme: "renter",
    sourceLabel: "Internationale økonominyheder",
    freshness: "recent",
    options: [
      {
        id: "us_hawkish",
        title: "Gå hårdt efter inflation",
        text: "Beskyt prisstabiliteten, men risiko for jobtab.",
        nextTag: "labor_pain",
        hiddenPoints: 8,
      },
      {
        id: "us_pause",
        title: "Sæt renten på pause",
        text: "Skab ro, men risiko for vedvarende inflation.",
        nextTag: "market_doubt",
        hiddenPoints: 5,
      },
      {
        id: "us_soft_landing",
        title: "Jag en blød landing",
        text: "Forsøg balance, men svært at ramme præcist.",
        nextTag: "balanced_path",
        hiddenPoints: 7,
      },
      {
        id: "us_stimulus",
        title: "Tænk vækst først",
        text: "Løft aktivitet, men pres gæld og inflation.",
        nextTag: "debt_fear",
        hiddenPoints: 4,
      },
    ],
  },

  {
    id: "china_export_shift",
    title: "Kina ændrer det globale pres",
    description:
      "Udviklingen i Kina rammer eksport, råvarer og verdenshandlen. Jeres strategi skal tage højde for smitteeffekter.",
    region: "Kina",
    theme: "handel",
    sourceLabel: "Internationale økonominyheder",
    freshness: "recent",
    options: [
      {
        id: "china_diversify",
        title: "Spred afhængigheden",
        text: "Byg robusthed, men det tager tid.",
        nextTag: "supply_rebuild",
        hiddenPoints: 9,
      },
      {
        id: "china_wait",
        title: "Afvent udviklingen",
        text: "Undgå dyre fejl, men risiko for passivitet.",
        nextTag: "trade_shock",
        hiddenPoints: 4,
      },
      {
        id: "china_support_exporters",
        title: "Støt eksportører",
        text: "Skærm virksomheder, men pres budgettet.",
        nextTag: "budget_stress",
        hiddenPoints: 6,
      },
      {
        id: "china_domestic_shift",
        title: "Styrk hjemlig kapacitet",
        text: "Tænk langsigtet robusthed frem for pris.",
        nextTag: "long_term_gain",
        hiddenPoints: 8,
      },
    ],
  },

  {
    id: "global_oil_jump",
    title: "Olieprisen hopper igen",
    description:
      "Energi bliver dyrere, og frygten for nyt inflationspres vokser. Hvad er jeres bedste svar?",
    region: "Global",
    theme: "energi",
    sourceLabel: "Internationale markedsnyheder",
    freshness: "today",
    options: [
      {
        id: "oil_subsidy",
        title: "Brug subsidier",
        text: "Skærm økonomien, men betal en høj pris på budgettet.",
        nextTag: "budget_stress",
        hiddenPoints: 6,
      },
      {
        id: "oil_tight_policy",
        title: "Hold stram linje",
        text: "Beskyt troværdighed, men pres vækst og husholdninger.",
        nextTag: "labor_pain",
        hiddenPoints: 8,
      },
      {
        id: "oil_reserves",
        title: "Brug reserver",
        text: "Køb tid, men ikke en permanent løsning.",
        nextTag: "balanced_path",
        hiddenPoints: 7,
      },
      {
        id: "oil_green",
        title: "Fremskynd grøn omstilling",
        text: "Tænk langsigtet, men begrænset kort sigt-effekt.",
        nextTag: "long_term_gain",
        hiddenPoints: 9,
      },
    ],
  },

  {
    id: "global_trade_split",
    title: "Handlen bliver mere politisk",
    description:
      "Told, eksportkontrol og geopolitik gør verdenshandel mere usikker. Jeres blok skal vælge retning.",
    region: "Global",
    theme: "handel",
    sourceLabel: "Internationale økonominyheder",
    freshness: "today",
    options: [
      {
        id: "trade_allies",
        title: "Byg nye alliancer",
        text: "Spred risiko, men det tager tid.",
        nextTag: "supply_rebuild",
        hiddenPoints: 8,
      },
      {
        id: "trade_protect",
        title: "Beskyt hjemmemarkedet",
        text: "Skab kort ro, men dyrere varer og lavere effektivitet.",
        nextTag: "inflation_return",
        hiddenPoints: 5,
      },
      {
        id: "trade_industry",
        title: "Støt strategisk industri",
        text: "Byg modstandskraft, men risiko for dyr politik.",
        nextTag: "budget_stress",
        hiddenPoints: 7,
      },
      {
        id: "trade_wait",
        title: "Vent og se",
        text: "Undgå fejl, men risiko for at blive hægtet af.",
        nextTag: "trade_shock",
        hiddenPoints: 3,
      },
    ],
  },

  {
    id: "banking_stress_story",
    title: "Banksektoren viser nye sprækker",
    description:
      "En ny historie om finansiel uro får markederne til at reagere. Nu skal I vælge mellem ro og risiko.",
    region: "Global",
    theme: "banker",
    sourceLabel: "Finansielle nyheder",
    freshness: "today",
    options: [
      {
        id: "bank_backstop",
        title: "Skab sikkerhedsnet",
        text: "Dæmp panik, men øg moral hazard.",
        nextTag: "balanced_path",
        hiddenPoints: 7,
      },
      {
        id: "bank_market_discipline",
        title: "Lad markedet rense ud",
        text: "Undgå redningspakker, men risiko for større chok.",
        nextTag: "financial_panic",
        hiddenPoints: 4,
      },
      {
        id: "bank_deposit_focus",
        title: "Beskyt indskydere",
        text: "Begræns panik, men pres staten.",
        nextTag: "budget_stress",
        hiddenPoints: 8,
      },
      {
        id: "bank_restructure",
        title: "Tving omstrukturering",
        text: "Søg en mellemvej, men med høj kompleksitet.",
        nextTag: "long_term_gain",
        hiddenPoints: 9,
      },
    ],
  },

  {
    id: "climate_supply_story",
    title: "Klimahændelse rammer forsyninger",
    description:
      "Ekstremt vejr påvirker transport, landbrug eller energi. Hvordan reagerer I økonomisk?",
    region: "Global",
    theme: "klima",
    sourceLabel: "Klima- og økonominyheder",
    freshness: "today",
    options: [
      {
        id: "climate_relief",
        title: "Akut hjælp",
        text: "Lindr smerte nu, men det er dyrt og kortsigtet.",
        nextTag: "budget_stress",
        hiddenPoints: 6,
      },
      {
        id: "climate_resilience",
        title: "Invester i robusthed",
        text: "Tænk langsigtet, men med begrænset øjeblikkelig lettelse.",
        nextTag: "long_term_gain",
        hiddenPoints: 9,
      },
      {
        id: "climate_market",
        title: "Lad markedet tilpasse sig",
        text: "Undgå store udgifter, men risiko for større social skade.",
        nextTag: "social_strain",
        hiddenPoints: 4,
      },
      {
        id: "climate_mix",
        title: "Kombinér hjælp og reform",
        text: "Søg balance, men det kræver præcision.",
        nextTag: "balanced_path",
        hiddenPoints: 8,
      },
    ],
  },

  {
    id: "dk_export_story",
    title: "Dansk eksport bliver udfordret",
    description:
      "Store danske eksportområder mærker mere usikker global efterspørgsel. Hvordan bør I reagere?",
    region: "Danmark",
    theme: "handel",
    sourceLabel: "Danske erhvervsnyheder",
    freshness: "recent",
    options: [
      {
        id: "dk_export_support",
        title: "Støt eksporten",
        text: "Skab luft hurtigt, men pres budgettet.",
        nextTag: "budget_stress",
        hiddenPoints: 6,
      },
      {
        id: "dk_productivity",
        title: "Fokusér på produktivitet",
        text: "Tænk langsigtet konkurrenceevne.",
        nextTag: "long_term_gain",
        hiddenPoints: 9,
      },
      {
        id: "dk_diversify",
        title: "Spred markederne",
        text: "Reducer risiko, men det tager tid.",
        nextTag: "supply_rebuild",
        hiddenPoints: 8,
      },
      {
        id: "dk_wait_export",
        title: "Vent på bedring",
        text: "Undgå forhastede greb, men risiko for tab af momentum.",
        nextTag: "trade_shock",
        hiddenPoints: 3,
      },
    ],
  },
];