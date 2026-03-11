export type GameCase = {
  id: string;
  title: string;
  description: string;
  theme: string;
  optionA: {
    id: string;
    title: string;
    text: string;
    next: string;
  };
  optionB: {
    id: string;
    title: string;
    text: string;
    next: string;
  };
};

export const gameCases: Record<string, GameCase> = {
  intro_inflation: {
    id: "intro_inflation",
    title: "Inflationen bider stadig",
    description:
      "Centralbanken er presset. Inflation er stadig høj, men væksten er svag. Hvad gør I?",
    theme: "inflation",
    optionA: {
      id: "rente",
      title: "Hæv renten",
      text: "Dæmp inflationen, men risiko for lavere vækst og højere arbejdsløshed.",
      next: "labor_pressure",
    },
    optionB: {
      id: "stimulus",
      title: "Stimuler økonomien",
      text: "Beskyt jobs, men risiko for mere inflation og større gæld.",
      next: "debt_doubt",
    },
  },

  labor_pressure: {
    id: "labor_pressure",
    title: "Arbejdsløsheden stiger",
    description:
      "Jeres stramme linje dæmpede prispresset, men flere virksomheder holder igen. Hvad gør I nu?",
    theme: "arbejdsmarked",
    optionA: {
      id: "help_business",
      title: "Hjælp udsatte virksomheder",
      text: "Beskyt arbejdspladser, men det kan belaste budgettet.",
      next: "budget_strain",
    },
    optionB: {
      id: "stay_hard",
      title: "Fasthold den stramme linje",
      text: "Hold inflationen nede, men risiko for social uro.",
      next: "social_unrest",
    },
  },

  debt_doubt: {
    id: "debt_doubt",
    title: "Gælden vokser",
    description:
      "Jeres hjælpepakker løftede aktiviteten, men markedet begynder at tvivle på jeres økonomiske disciplin. Hvad gør I nu?",
    theme: "gæld",
    optionA: {
      id: "save_plan",
      title: "Start en spareplan",
      text: "Skab tillid, men risiko for at bremse væksten hurtigt.",
      next: "growth_slump",
    },
    optionB: {
      id: "continue_support",
      title: "Fortsæt støtten",
      text: "Beskyt væksten nu, men risiko for mere inflation og gæld.",
      next: "market_panic",
    },
  },

  budget_strain: {
    id: "budget_strain",
    title: "Budgettet er under pres",
    description:
      "Flere støtteordninger hjælper kortsigtet, men finansministeriet advarer om voksende underskud.",
    theme: "finanspolitik",
    optionA: {
      id: "cut_spending",
      title: "Skær i udgifterne",
      text: "Vis ansvarlighed, men risiko for politisk modstand.",
      next: "election_pressure",
    },
    optionB: {
      id: "borrow_more",
      title: "Lån mere",
      text: "Køb tid, men gør økonomien mere sårbar senere.",
      next: "bond_selloff",
    },
  },

  social_unrest: {
    id: "social_unrest",
    title: "Vreden vokser i gaderne",
    description:
      "Høj arbejdsløshed og svag vækst skaber protester. Medierne spørger, om I har været for hårde.",
    theme: "social uro",
    optionA: {
      id: "support_households",
      title: "Støt husholdningerne",
      text: "Dæmp presset, men det koster på budgettet.",
      next: "budget_strain",
    },
    optionB: {
      id: "hold_course",
      title: "Hold kursen",
      text: "Signalér fasthed, men risiko for mere vrede og faldende tillid.",
      next: "election_pressure",
    },
  },

  growth_slump: {
    id: "growth_slump",
    title: "Væksten går i stå",
    description:
      "Virksomhederne investerer mindre, og forbrugerne bliver mere forsigtige. Hvad prioriterer I?",
    theme: "vækst",
    optionA: {
      id: "public_investment",
      title: "Offentlige investeringer",
      text: "Løft aktiviteten, men øg presset på de offentlige finanser.",
      next: "energy_shock",
    },
    optionB: {
      id: "tax_cuts",
      title: "Sænk skatterne",
      text: "Skab aktivitet, men usikker effekt og færre indtægter.",
      next: "trade_break",
    },
  },

  market_panic: {
    id: "market_panic",
    title: "Markederne bliver nervøse",
    description:
      "Renterne på jeres statsobligationer stiger, og investorerne tvivler på jeres troværdighed.",
    theme: "finansmarked",
    optionA: {
      id: "restore_trust",
      title: "Genopret tillid",
      text: "Vis budgetdisciplin og ro på markederne.",
      next: "growth_slump",
    },
    optionB: {
      id: "defend_growth",
      title: "Forsvar væksten",
      text: "Bevar aktiviteten, men markedet kan straffe jer hårdere.",
      next: "bond_selloff",
    },
  },

  election_pressure: {
    id: "election_pressure",
    title: "Valgår og folkelig vrede",
    description:
      "Valget nærmer sig. Presset stiger for at love hurtige forbedringer, selv om økonomien er skrøbelig.",
    theme: "politik",
    optionA: {
      id: "popular_relief",
      title: "Lov hurtige lettelser",
      text: "Vælg populær politik, men risiko for større gæld og inflation.",
      next: "energy_shock",
    },
    optionB: {
      id: "responsible_line",
      title: "Hold en ansvarlig linje",
      text: "Bevar troværdigheden, men bliv upopulær på kort sigt.",
      next: "trade_break",
    },
  },

  bond_selloff: {
    id: "bond_selloff",
    title: "Obligationsmarkedet straffer jer",
    description:
      "Investorerne sælger ud. Jeres låneomkostninger stiger hurtigt, og budgettet bliver hårdt ramt.",
    theme: "gældskrise",
    optionA: {
      id: "imf_help",
      title: "Søg international hjælp",
      text: "Få støtte udefra, men mist noget politisk frihed.",
      next: "trade_break",
    },
    optionB: {
      id: "emergency_cuts",
      title: "Lav akutte nedskæringer",
      text: "Vis handlekraft, men risiko for recession og vrede.",
      next: "bank_stress",
    },
  },

  energy_shock: {
    id: "energy_shock",
    title: "Energipriserne eksploderer",
    description:
      "En ny konflikt presser olie- og gaspriserne op. Inflation og usikkerhed blusser op igen.",
    theme: "energi",
    optionA: {
      id: "subsidize_energy",
      title: "Giv energisubsidier",
      text: "Skærm borgere og virksomheder, men det koster dyrt.",
      next: "bank_stress",
    },
    optionB: {
      id: "let_prices_rise",
      title: "Lad priserne stige",
      text: "Beskyt budgettet, men skab social og politisk frustration.",
      next: "climate_damage",
    },
  },

  trade_break: {
    id: "trade_break",
    title: "Handelskonflikten breder sig",
    description:
      "Toldsatser og eksportrestriktioner skaber problemer i forsyningskæderne. Produktionen bliver dyrere.",
    theme: "handel",
    optionA: {
      id: "protect_market",
      title: "Beskyt hjemmemarkedet",
      text: "Skærm egne virksomheder, men gør varer dyrere.",
      next: "currency_slide",
    },
    optionB: {
      id: "new_allies",
      title: "Søg nye handelsallierede",
      text: "Byg nye relationer, men det tager tid og er usikkert.",
      next: "climate_damage",
    },
  },

  bank_stress: {
    id: "bank_stress",
    title: "Bankerne er under pres",
    description:
      "Højere renter og svag vækst rammer finanssektoren. Nogle banker ser sårbare ud.",
    theme: "banker",
    optionA: {
      id: "rescue_banks",
      title: "Red bankerne",
      text: "Skab ro nu, men vækker kritik af elitær politik.",
      next: "currency_slide",
    },
    optionB: {
      id: "let_fail",
      title: "Lad svage banker falde",
      text: "Undgå redningspakker, men risiko for større panik.",
      next: "global_crisis",
    },
  },

  climate_damage: {
    id: "climate_damage",
    title: "Klimachok rammer økonomien",
    description:
      "Ekstremt vejr rammer høst, energi og transport. Forsyninger bliver ustabile.",
    theme: "klima",
    optionA: {
      id: "acute_relief",
      title: "Akut nødhjælp",
      text: "Hjælp hurtigt, men det er dyrt og kortsigtet.",
      next: "global_crisis",
    },
    optionB: {
      id: "green_transition",
      title: "Invester i grøn omstilling",
      text: "Styrk robustheden, men det tager tid før gevinsten kommer.",
      next: "currency_slide",
    },
  },

  currency_slide: {
    id: "currency_slide",
    title: "Valutaen svækkes",
    description:
      "Kapital flytter sig, og jeres valuta kommer under pres. Import bliver dyrere, og nervøsiteten stiger.",
    theme: "valuta",
    optionA: {
      id: "raise_rates_again",
      title: "Hæv renten igen",
      text: "Forsvar valutaen, men det går ud over væksten.",
      next: "global_crisis",
    },
    optionB: {
      id: "capital_controls",
      title: "Indfør kontrol",
      text: "Brems kapitalflugt, men skræm investorerne.",
      next: "global_crisis",
    },
  },

  global_crisis: {
    id: "global_crisis",
    title: "Global krise ryster systemet",
    description:
      "Flere chok rammer samtidig. Nu skal I vælge mellem dårlige løsninger og redde det, der kan reddes.",
    theme: "global krise",
    optionA: {
      id: "coordinate",
      title: "Koordiner internationalt",
      text: "Søg fælles løsninger, men giv afkald på noget kontrol.",
      next: "intro_inflation",
    },
    optionB: {
      id: "national_first",
      title: "Sæt nationen først",
      text: "Beskyt jer selv først, men øg risikoen for nye konflikter.",
      next: "intro_inflation",
    },
  },
};