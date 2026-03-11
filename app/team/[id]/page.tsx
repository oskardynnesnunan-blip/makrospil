"use client";

import { useEffect, useMemo, useState } from "react";
import { useParams } from "next/navigation";

type Crisis = {
  id: string;
  title: string;
  description: string;
  severity: "low" | "medium" | "high";
};

type DailyStory = {
  id: string;
  title: string;
  region: string;
  sourceLabel: string;
  theme:
    | "inflation"
    | "renter"
    | "energi"
    | "handel"
    | "banker"
    | "gæld"
    | "arbejdsmarked"
    | "politik";
};

type SurpriseEvent = {
  id: string;
  title: string;
  description: string;
  effect: string;
};

type Option = {
  id: string;
  title: string;
  text: string;
  next: string;
  hiddenPoints: number;
};

type GameCase = {
  id: string;
  title: string;
  description: string;
  theme: string;
  difficulty: "medium" | "hard" | "very hard";
  options: Option[];
  isNewsCase?: boolean;
};

type EvalResult = {
  hiddenScore: number;
  level: string;
  praise: string[];
  criticism: string[];
  improvements: string[];
  directComments: string[];
  keywordCount: number;
  tradeoffCount: number;
  weakCount: number;
  length: number;
  consistencyPenalty: number;
};

type HistoryEntry = {
  round: number;
  caseTitle: string;
  optionTitle: string;
  reason: string;
  level: string;
  hiddenScore: number;
};

type TeamSetup = {
  code: string;
  teamName: string;
  members: string[];
  startedAt: string;
};

const TOTAL_ROUNDS = 60;

const crises: Crisis[] = [
  {
    id: "oil_shock",
    title: "Oliechok",
    description:
      "En ny konflikt sender olieprisen op. Inflation og produktionsomkostninger stiger hurtigt.",
    severity: "high",
  },
  {
    id: "bank_panic",
    title: "Bankpanik",
    description:
      "Flere banker kommer under pres. Investorer og kunder mister tillid til sektoren.",
    severity: "high",
  },
  {
    id: "trade_war",
    title: "Handelskrig",
    description:
      "Nye toldsatser og eksportrestriktioner skaber problemer i forsyningskæderne.",
    severity: "medium",
  },
  {
    id: "climate_disaster",
    title: "Klimakatastrofe",
    description:
      "Ekstremt vejr rammer transport, landbrug og energiforsyning. Flere sektorer bliver pressede.",
    severity: "high",
  },
];

const dailyStories: DailyStory[] = [
  {
    id: "story_1",
    title: "Nationalbanken under pres",
    region: "Danmark",
    sourceLabel: "Nationalbanken",
    theme: "renter",
  },
  {
    id: "story_2",
    title: "ECB sender nyt signal",
    region: "Europa",
    sourceLabel: "ECB",
    theme: "inflation",
  },
  {
    id: "story_3",
    title: "Olieprisen hopper igen",
    region: "Global",
    sourceLabel: "Markedsnyheder",
    theme: "energi",
  },
  {
    id: "story_4",
    title: "Ny tolduro rammer verdenshandlen",
    region: "Global",
    sourceLabel: "Internationale økonominyheder",
    theme: "handel",
  },
  {
    id: "story_5",
    title: "Arbejdsmarkedet viser nye spændinger",
    region: "USA",
    sourceLabel: "Makronyheder",
    theme: "arbejdsmarked",
  },
  {
    id: "story_6",
    title: "Statsgæld og budgetdisciplin fylder igen",
    region: "Europa",
    sourceLabel: "Finansnyheder",
    theme: "gæld",
  },
];

const surpriseEvents: SurpriseEvent[] = [
  {
    id: "ship_block",
    title: "Fragtruter bryder sammen",
    description:
      "Et logistisk chok rammer forsyningskæderne, og importpriser stiger hurtigere end forventet.",
    effect: "handel og inflation presses samtidig",
  },
  {
    id: "election_shock",
    title: "Politisk chok",
    description:
      "En meningsmåling ændrer den politiske virkelighed og skaber pres for hurtige løsninger.",
    effect: "politik og troværdighed kommer i konflikt",
  },
  {
    id: "wage_spike",
    title: "Lønpres stiger",
    description:
      "Lønkrav løfter presset i økonomien og skaber ny frygt for andenrunde-effekter.",
    effect: "inflation og arbejdsmarked kolliderer",
  },
  {
    id: "bank_leak",
    title: "Læk fra banksektoren",
    description:
      "Et nyt internt notat antyder sårbarhed i bankerne og giver uro på markederne.",
    effect: "tillid og finansiel stabilitet svækkes",
  },
];

const initialOpponents = [
  { name: "USA", score: 0, lastAction: "Ikke startet" },
  { name: "EU", score: 0, lastAction: "Ikke startet" },
  { name: "Kina", score: 0, lastAction: "Ikke startet" },
  { name: "Norden", score: 0, lastAction: "Ikke startet" },
];

const baseCases: Record<string, GameCase> = {
  intro_inflation: {
    id: "intro_inflation",
    title: "Inflationen bider stadig",
    description:
      "Inflationen er ikke under kontrol, men væksten er samtidig svag. Hvis I strammer for hårdt, risikerer I arbejdsløshed. Hvis I er for bløde, risikerer I at miste troværdighed. Hvad gør I?",
    theme: "inflation",
    difficulty: "medium",
    options: [
      {
        id: "raise_rates",
        title: "Hæv renten tydeligt",
        text: "Dæmp inflationen og signalér disciplin, men risiko for lavere vækst og højere arbejdsløshed.",
        next: "labor_pressure",
        hiddenPoints: 8,
      },
      {
        id: "hold_rates",
        title: "Hold renten og afvent data",
        text: "Undgå overreaktion, men risiko for at inflationen bider sig fast og markedet mister tillid.",
        next: "market_panic",
        hiddenPoints: 6,
      },
      {
        id: "targeted_support",
        title: "Målrettet finanspolitisk støtte",
        text: "Skærm udsatte grupper uden at stimulere alt for bredt, men det presser budgettet.",
        next: "budget_strain",
        hiddenPoints: 7,
      },
      {
        id: "broad_stimulus",
        title: "Bred vækstpakke",
        text: "Beskyt aktivitet og jobs hurtigt, men risiko for mere inflation, større gæld og tab af troværdighed.",
        next: "debt_doubt",
        hiddenPoints: 4,
      },
    ],
  },

  labor_pressure: {
    id: "labor_pressure",
    title: "Arbejdsløsheden stiger hurtigere end ventet",
    description:
      "Jeres tidligere linje har dæmpet prispresset, men flere virksomheder fyrer. Nu er dilemmaet ikke længere kun inflation mod vækst, men også social stabilitet mod troværdighed.",
    theme: "arbejdsmarked",
    difficulty: "hard",
    options: [
      {
        id: "help_business",
        title: "Hjælp udsatte virksomheder midlertidigt",
        text: "Beskyt arbejdspladser, men øg presset på budgettet og risikoen for at støtte ineffektive virksomheder.",
        next: "budget_strain",
        hiddenPoints: 7,
      },
      {
        id: "stay_hard",
        title: "Fasthold den stramme linje",
        text: "Hold inflationen nede og beskyt troværdigheden, men risiko for social uro og politisk modstand.",
        next: "social_unrest",
        hiddenPoints: 8,
      },
      {
        id: "retrain_workers",
        title: "Invester i omskoling og arbejdsudbud",
        text: "Tænk strukturelt og langsigtet, men effekten kommer langsomt.",
        next: "growth_slump",
        hiddenPoints: 9,
      },
      {
        id: "cut_taxes",
        title: "Sænk skatter på arbejde",
        text: "Styrk incitament og aktivitet, men mist skatteindtægter og risikér skæv effekt.",
        next: "election_pressure",
        hiddenPoints: 6,
      },
    ],
  },

  debt_doubt: {
    id: "debt_doubt",
    title: "Markederne tvivler på jeres gældskontrol",
    description:
      "Jeres hjælpepakker har understøttet aktiviteten, men markederne stiller nu spørgsmål ved, hvor længe staten kan fortsætte uden at miste tillid.",
    theme: "gæld",
    difficulty: "hard",
    options: [
      {
        id: "save_plan",
        title: "Fremlæg en troværdig spareplan",
        text: "Signalér disciplin og holdbarhed, men risiko for lavere vækst på kort sigt.",
        next: "growth_slump",
        hiddenPoints: 9,
      },
      {
        id: "continue_support",
        title: "Fortsæt støtten lidt endnu",
        text: "Beskyt økonomien nu, men risiko for større gæld og lavere troværdighed.",
        next: "market_panic",
        hiddenPoints: 4,
      },
      {
        id: "reform_state",
        title: "Gennemfør svære strukturreformer",
        text: "Løft langsigtet holdbarhed og produktivitet, men skab kortsigtet modstand.",
        next: "market_panic",
        hiddenPoints: 10,
      },
      {
        id: "sell_assets",
        title: "Sælg aktiver for at købe tid",
        text: "Skaf luft nu, men uden at løse de dybere problemer.",
        next: "market_panic",
        hiddenPoints: 5,
      },
    ],
  },

  budget_strain: {
    id: "budget_strain",
    title: "Budgettet er under hårdt pres",
    description:
      "Støtteordninger og højere udgifter får finansministeriet til at advare. Det næste valg handler ikke kun om økonomi, men også om politisk bæredygtighed.",
    theme: "finanspolitik",
    difficulty: "hard",
    options: [
      {
        id: "cut_spending",
        title: "Skær i udgifterne nu",
        text: "Vis ansvarlighed og ro markedet, men risiko for politisk modstand og lavere aktivitet.",
        next: "market_panic",
        hiddenPoints: 8,
      },
      {
        id: "borrow_more",
        title: "Lån mere og køb tid",
        text: "Hold hånden under økonomien nu, men gør staten mere sårbar senere.",
        next: "market_panic",
        hiddenPoints: 4,
      },
      {
        id: "raise_taxes",
        title: "Hæv udvalgte skatter",
        text: "Forbedr budgettet, men svæk efterspørgslen og risikér politisk modstand.",
        next: "labor_pressure",
        hiddenPoints: 7,
      },
      {
        id: "freeze_wages",
        title: "Hold igen med offentlige lønninger",
        text: "Dæmp udgifterne, men øg risikoen for konflikt og lavere motivation.",
        next: "labor_pressure",
        hiddenPoints: 6,
      },
    ],
  },

  market_panic: {
    id: "market_panic",
    title: "Markederne bliver nervøse",
    description:
      "Renterne på statsobligationer stiger, og jeres troværdighed bliver testet. Nu handler det ikke kun om rigtig politik, men også om, hvordan markederne læser den.",
    theme: "finansmarked",
    difficulty: "very hard",
    options: [
      {
        id: "restore_trust",
        title: "Genopret tillid med disciplin",
        text: "Vis ro, ansvarlighed og et klart signal til markederne.",
        next: "global_crisis",
        hiddenPoints: 9,
      },
      {
        id: "defend_growth",
        title: "Forsvar væksten trods pres",
        text: "Beskyt aktivitet nu, men risiko for at markedet straffer jer hårdere.",
        next: "global_crisis",
        hiddenPoints: 4,
      },
      {
        id: "central_bank_signal",
        title: "Koordiner budskabet med centralbanken",
        text: "Skab ro gennem signalpolitik, men uden garanti for effekt.",
        next: "global_crisis",
        hiddenPoints: 8,
      },
      {
        id: "capital_shield",
        title: "Byg ekstra sikkerhedsnet",
        text: "Skab robusthed, men med høj pris og risiko for moralsk hasard.",
        next: "global_crisis",
        hiddenPoints: 6,
      },
    ],
  },

  growth_slump: {
    id: "growth_slump",
    title: "Væksten går i stå",
    description:
      "Investeringer bremses, forbrugerne tøver, og virksomhederne bliver mere forsigtige. Det svære er nu at tænke længere end næste kvartal.",
    theme: "vækst",
    difficulty: "hard",
    options: [
      {
        id: "public_investment",
        title: "Invester offentligt i produktivitet",
        text: "Løft aktivitet og kapacitet, men øg underskuddet på kort sigt.",
        next: "energy_shock",
        hiddenPoints: 9,
      },
      {
        id: "tax_relief",
        title: "Sænk skatter for at stimulere",
        text: "Forsøg at løfte efterspørgslen hurtigt, men med usikker effekt og lavere indtægter.",
        next: "trade_break",
        hiddenPoints: 6,
      },
      {
        id: "structural_reforms",
        title: "Gennemfør strukturelle reformer",
        text: "Styrk langsigtet vækst og konkurrenceevne, men uden hurtig gevinst.",
        next: "election_pressure",
        hiddenPoints: 10,
      },
      {
        id: "wait_and_see",
        title: "Vent og se",
        text: "Undgå forhastede fejl, men risiko for passivitet og tab af momentum.",
        next: "market_panic",
        hiddenPoints: 3,
      },
    ],
  },

  social_unrest: {
    id: "social_unrest",
    title: "Social uro breder sig",
    description:
      "Strejker, protester og vrede vælgere gør presset større. Nu er makroøkonomi blevet direkte politisk og socialt eksplosiv.",
    theme: "social uro",
    difficulty: "very hard",
    options: [
      {
        id: "support_households",
        title: "Støt husholdningerne",
        text: "Skab ro hurtigt, men pres budgettet yderligere.",
        next: "budget_strain",
        hiddenPoints: 7,
      },
      {
        id: "hold_line",
        title: "Hold fast i linjen",
        text: "Vis fasthed, men risiko for mere vrede og lavere tillid.",
        next: "election_pressure",
        hiddenPoints: 6,
      },
      {
        id: "social_dialogue",
        title: "Indkald til et bredt socialt forlig",
        text: "Søg balance og legitimitet, men det tager tid og kræver kompromis.",
        next: "growth_slump",
        hiddenPoints: 9,
      },
      {
        id: "blame_external",
        title: "Skyd skylden på omverdenen",
        text: "Kan give kort politisk gevinst, men er økonomisk tyndt.",
        next: "election_pressure",
        hiddenPoints: 2,
      },
    ],
  },

  election_pressure: {
    id: "election_pressure",
    title: "Valgår og folkelig vrede",
    description:
      "Valget nærmer sig. Presset stiger for at love hurtige forbedringer, selv om økonomien er skrøbelig. Vil I være ansvarlige eller populære?",
    theme: "politik",
    difficulty: "very hard",
    options: [
      {
        id: "popular_relief",
        title: "Lov hurtige lettelser",
        text: "Populært nu, men risiko for større gæld, inflation og lavere troværdighed.",
        next: "energy_shock",
        hiddenPoints: 4,
      },
      {
        id: "responsible_line",
        title: "Hold en ansvarlig linje",
        text: "Beskyt troværdighed og langsigtet styring, men bliv upopulær.",
        next: "trade_break",
        hiddenPoints: 9,
      },
      {
        id: "targeted_compromise",
        title: "Lav et målrettet kompromis",
        text: "Søg balance mellem ansvar og ro, men kræver stor præcision.",
        next: "growth_slump",
        hiddenPoints: 10,
      },
      {
        id: "communication_blitz",
        title: "Kommuniker aggressivt uden store reformer",
        text: "Forsøg at styre fortællingen, men risiko for at det virker hult.",
        next: "social_unrest",
        hiddenPoints: 3,
      },
    ],
  },

  energy_shock: {
    id: "energy_shock",
    title: "Energipriserne eksploderer igen",
    description:
      "En ny konflikt presser olie- og gaspriserne op. Det rammer både inflation, virksomheder og husholdninger på samme tid.",
    theme: "energi",
    difficulty: "very hard",
    options: [
      {
        id: "subsidize_energy",
        title: "Giv energisubsidier",
        text: "Skærm økonomien hurtigt, men til høj pris for budgettet.",
        next: "global_crisis",
        hiddenPoints: 7,
      },
      {
        id: "let_prices_rise",
        title: "Lad priserne stige",
        text: "Beskyt budgettet og signalér disciplin, men skab frustration og risiko for recession.",
        next: "social_unrest",
        hiddenPoints: 5,
      },
      {
        id: "strategic_reserves",
        title: "Brug strategiske reserver",
        text: "Køb tid, men uden at løse den underliggende sårbarhed.",
        next: "trade_break",
        hiddenPoints: 8,
      },
      {
        id: "green_shift",
        title: "Fremskynd grøn omstilling",
        text: "Tænk langsigtet robusthed frem for kortsigtet lettelse.",
        next: "global_crisis",
        hiddenPoints: 10,
      },
    ],
  },

  trade_break: {
    id: "trade_break",
    title: "Handelskonflikten breder sig",
    description:
      "Toldsatser og eksportrestriktioner skaber problemer i forsyningskæderne. Nu handler det om robusthed mod verden, ikke bare om pris.",
    theme: "handel",
    difficulty: "very hard",
    options: [
      {
        id: "protect_market",
        title: "Beskyt hjemmemarkedet",
        text: "Skærm egne virksomheder, men gør varer dyrere og reducerer effektivitet.",
        next: "global_crisis",
        hiddenPoints: 5,
      },
      {
        id: "new_allies",
        title: "Søg nye handelsallierede",
        text: "Spred risiko og byg nye relationer, men det tager tid.",
        next: "global_crisis",
        hiddenPoints: 9,
      },
      {
        id: "subsidize_exporters",
        title: "Støt eksportører",
        text: "Hjælp erhvervslivet nu, men belaster budgettet.",
        next: "market_panic",
        hiddenPoints: 7,
      },
      {
        id: "domestic_capacity",
        title: "Byg hjemlig kapacitet",
        text: "Styrk robusthed og strategi, men med høj kortsigtet pris.",
        next: "growth_slump",
        hiddenPoints: 10,
      },
    ],
  },

  global_crisis: {
    id: "global_crisis",
    title: "Global krise ryster systemet",
    description:
      "Flere chok rammer samtidig. Nu skal I vælge mellem dårlige løsninger og redde det, der kan reddes. Hver beslutning har store omkostninger.",
    theme: "global krise",
    difficulty: "very hard",
    options: [
      {
        id: "coordinate",
        title: "Koordiner internationalt",
        text: "Søg fælles løsninger og del byrder, men giv afkald på noget kontrol.",
        next: "intro_inflation",
        hiddenPoints: 10,
      },
      {
        id: "national_first",
        title: "Sæt nationen først",
        text: "Beskyt jer selv først, men øg risikoen for mere konflikt og mindre samarbejde.",
        next: "intro_inflation",
        hiddenPoints: 4,
      },
      {
        id: "stimulus_wave",
        title: "Stor hjælpepakke",
        text: "Støt økonomien bredt, men øg gæld og inflationsrisiko.",
        next: "intro_inflation",
        hiddenPoints: 6,
      },
      {
        id: "austerity_push",
        title: "Hård økonomisk disciplin",
        text: "Styrk troværdighed, men risiko for dybere recession og utilfredshed.",
        next: "intro_inflation",
        hiddenPoints: 7,
      },
    ],
  },
};

const KEYWORDS = {
  inflation: ["inflation", "pris", "prisniveau"],
  growth: ["vækst", "bnp", "aktivitet", "produktion"],
  unemployment: ["arbejdsløshed", "ledighed", "beskæftigelse", "jobs"],
  debt: ["gæld", "underskud", "statsbudget", "budget", "offentlige finanser"],
  trust: ["tillid", "troværdighed", "marked", "investor", "obligation"],
  rates: ["rente", "renter", "centralbank", "nationalbank"],
  tradeoff: ["men", "risiko", "ulempe", "omkost", "på den anden side"],
  longterm: ["langsigt", "struktur", "produktivitet", "konkurrenceevne", "reform"],
};

function buildNewsCase(story: DailyStory): GameCase {
  return {
    id: `news_${story.id}`,
    title: `Aktuel nyhed: ${story.title}`,
    description: `Ny makrohistorie fra ${story.sourceLabel} i ${story.region}. Temaet er ${story.theme}, og I skal nu reagere som et økonomisk beslutningsteam. Hvis I mislæser situationen, kan det koste både troværdighed, vækst og politisk stabilitet.`,
    theme: story.theme,
    difficulty: "very hard",
    isNewsCase: true,
    options: [
      {
        id: `${story.id}_strict`,
        title: "Vælg en stram linje",
        text: "Prioritér troværdighed, prisstabilitet og signalværdi, men risiko for svagere aktivitet.",
        next: "market_panic",
        hiddenPoints: 9,
      },
      {
        id: `${story.id}_balanced`,
        title: "Vælg en balanceret løsning",
        text: "Søg kompromis mellem stabilitet og aktivitet, men uden garanti for at markedet køber historien.",
        next: "growth_slump",
        hiddenPoints: 8,
      },
      {
        id: `${story.id}_support`,
        title: "Brug målrettet støtte",
        text: "Skærm særligt udsatte grupper eller sektorer, men pres budgettet.",
        next: "budget_strain",
        hiddenPoints: 7,
      },
      {
        id: `${story.id}_political`,
        title: "Tænk politisk først",
        text: "Skab kort ro og lav konflikt nu, men med risiko for dårligere økonomisk troværdighed senere.",
        next: "election_pressure",
        hiddenPoints: 4,
      },
    ],
  };
}

function includesAny(text: string, words: string[]) {
  return words.some((word) => text.includes(word));
}

function formatTime(totalSeconds: number) {
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes}:${seconds.toString().padStart(2, "0")}`;
}

function buildCritique(reason: string, selectedOption: Option): EvalResult {
  const text = reason.toLowerCase();

  const seesInflation = includesAny(text, KEYWORDS.inflation);
  const seesGrowth = includesAny(text, KEYWORDS.growth);
  const seesUnemployment = includesAny(text, KEYWORDS.unemployment);
  const seesDebt = includesAny(text, KEYWORDS.debt);
  const seesTrust = includesAny(text, KEYWORDS.trust);
  const seesRates = includesAny(text, KEYWORDS.rates);
  const seesTradeoff = includesAny(text, KEYWORDS.tradeoff);
  const seesLongTerm = includesAny(text, KEYWORDS.longterm);

  const weakPatterns = [
    "det er bedst",
    "det lyder bedst",
    "vi tror bare",
    "det virker smartest",
    "det er nok smartest",
  ];

  const weakHits = weakPatterns.filter((pattern) => text.includes(pattern));

  let hiddenScore = selectedOption.hiddenPoints;
  const praise: string[] = [];
  const criticism: string[] = [];
  const improvements: string[] = [];
  const directComments: string[] = [];
  let tradeoffCount = 0;
  let consistencyPenalty = 0;

  if (seesTradeoff) {
    hiddenScore += 3;
    tradeoffCount += 1;
    praise.push("I viser, at I forstår trade-offs og ikke ser økonomisk politik som gratis.");
    directComments.push("I nævner omkostninger eller risici. Det gør svaret mere troværdigt.");
  } else {
    criticism.push("I forklarer ikke tydeligt, hvad jeres valg koster.");
    improvements.push("Skriv både fordel og ulempe ved jeres løsning.");
    directComments.push("I argumenterer mest i én retning. Det gør svaret mindre nuanceret.");
  }

  if (seesInflation) {
    hiddenScore += 1;
    praise.push("I forholder jer til inflation.");
    directComments.push("I inddrager inflation, hvilket passer godt til casen.");
  } else {
    criticism.push("I overser inflationsdimensionen.");
    improvements.push("Vis hvordan jeres valg påvirker inflation og prisniveau.");
  }

  if (seesGrowth) {
    hiddenScore += 1;
    praise.push("I kobler jeres valg til vækst og aktivitet.");
  } else {
    criticism.push("I siger for lidt om vækst og økonomisk aktivitet.");
    improvements.push("Forklar hvad der sker med vækst, BNP eller aktivitet.");
  }

  if (seesUnemployment) {
    hiddenScore += 1;
    praise.push("I inddrager arbejdsmarkedet.");
  } else {
    criticism.push("I glemmer arbejdsløshed eller beskæftigelse.");
    improvements.push("Tag stilling til jobs, ledighed eller beskæftigelse.");
  }

  if (seesDebt) {
    hiddenScore += 1;
    praise.push("I har blik for gæld og offentlige finanser.");
  } else {
    criticism.push("I mangler at diskutere budget, underskud eller gæld.");
    improvements.push("Inddrag de offentlige finanser i jeres argument.");
  }

  if (seesTrust) {
    hiddenScore += 2;
    praise.push("I viser stærk forståelse for markedets tillid og troværdighed.");
    directComments.push("I kobler valget til troværdighed og markedsreaktioner.");
  } else {
    criticism.push("I overser markedernes eller investorernes reaktion.");
    improvements.push("Forklar hvordan tillid og troværdighed kan påvirkes.");
  }

  if (seesRates) {
    hiddenScore += 1;
    praise.push("I kobler svaret til renter eller centralbank.");
  }

  if (seesLongTerm) {
    hiddenScore += 2;
    praise.push("I løfter svaret ved også at tænke langsigtet.");
  } else {
    criticism.push("Svaret er meget kortsigtet.");
    improvements.push("Vis også de langsigtede konsekvenser.");
  }

  if (reason.trim().length > 180) {
    hiddenScore += 2;
    praise.push("I uddyber jeres svar grundigt.");
    directComments.push("I udfolder jeres svar, så argumentationen bliver tydeligere.");
  } else if (reason.trim().length < 90) {
    hiddenScore -= 2;
    criticism.push("Begrundelsen er for kort.");
    improvements.push("Skriv mere udfoldet og præcist.");
    directComments.push("Jeres svar er så kort, at flere vigtige hensyn mangler.");
  }

  if (weakHits.length > 0) {
    hiddenScore -= 4;
    criticism.push("Begrundelsen bliver for overfladisk og for lidt faglig.");
    improvements.push("Brug færre løse formuleringer og flere fagbegreber.");
  }

  if (
    selectedOption.title.toLowerCase().includes("stram") &&
    text.includes("stimul")
  ) {
    consistencyPenalty -= 2;
    hiddenScore -= 2;
    criticism.push("Der er en vis modstrid mellem jeres valgte linje og jeres begrundelse.");
    improvements.push("Sørg for at begrundelsen passer klart til det valg, I har taget.");
    directComments.push("I skriver noget, der peger i en anden retning end det valg, I faktisk tog.");
  }

  let level = "svagt";
  if (hiddenScore >= 15) level = "meget stærkt";
  else if (hiddenScore >= 11) level = "stærkt";
  else if (hiddenScore >= 8) level = "fornuftigt";
  else if (hiddenScore >= 5) level = "usikkert";

  return {
    hiddenScore,
    level,
    praise,
    criticism,
    improvements,
    directComments,
    keywordCount: [
      seesInflation,
      seesGrowth,
      seesUnemployment,
      seesDebt,
      seesTrust,
      seesRates,
      seesLongTerm,
    ].filter(Boolean).length,
    tradeoffCount,
    weakCount: weakHits.length,
    length: reason.trim().length,
    consistencyPenalty,
  };
}

function compareToPrevious(current: EvalResult, previous?: HistoryEntry | null) {
  if (!previous) {
    return "Det er jeres første svar i denne session, så der er endnu ikke noget at sammenligne med.";
  }

  const parts: string[] = [];

  if (current.hiddenScore > previous.hiddenScore) {
    parts.push("Jeres svar er stærkere end sidste gang.");
  } else if (current.hiddenScore < previous.hiddenScore) {
    parts.push("Jeres svar er svagere end sidste gang.");
  } else {
    parts.push("Jeres svar ligger omtrent på samme niveau som sidste gang.");
  }

  if (current.length > previous.reason.length) {
    parts.push("I uddyber mere end før.");
  } else if (current.length < previous.reason.length) {
    parts.push("I skriver kortere end sidst.");
  }

  return parts.join(" ");
}

function buildFinalAssessment(history: HistoryEntry[], finalScore: number, winner: string) {
  const strongRounds = history.filter((h) => h.level === "meget stærkt" || h.level === "stærkt").length;
  const weakRounds = history.filter((h) => h.level === "svagt" || h.level === "usikkert").length;
  const avgScore =
    history.length > 0
      ? Math.round(history.reduce((sum, h) => sum + h.hiddenScore, 0) / history.length)
      : 0;

  let financeMinisterVerdict = "";
  if (finalScore >= 380) {
    financeMinisterVerdict =
      "I ville sandsynligvis klare jer stærkt som finansminister. I viser robust dømmekraft, evne til at balancere modstridende mål og relativt høj troværdighed.";
  } else if (finalScore >= 280) {
    financeMinisterVerdict =
      "I ville kunne fungere som finansminister, men med tydelige styrker og svagheder. I træffer flere solide beslutninger, men nogle svar bliver for kortsigtede eller uskarpe.";
  } else {
    financeMinisterVerdict =
      "I ville få det svært som finansminister. Der er for mange svar, hvor trade-offs, troværdighed eller langsigtet holdbarhed ikke bliver håndteret stærkt nok.";
  }

  const winnerText =
    winner === "Jer"
      ? "I vinder spillet. Det betyder, at jeres samlede linje var stærkere end de andre holds over tid."
      : `Vinderen blev ${winner}. Det betyder, at jeres samlede linje ikke var stærk nok i forhold til konkurrenterne.`;

  return {
    summary: winnerText,
    avgScore,
    strongRounds,
    weakRounds,
    financeMinisterVerdict,
  };
}

export default function TeamPage() {
  const params = useParams<{ id: string }>();
  const teamCode = String(params?.id ?? "usa01");

  const [setup, setSetup] = useState<TeamSetup | null>(null);
  const [currentCase, setCurrentCase] = useState<GameCase>(baseCases.intro_inflation);
  const [selectedChoice, setSelectedChoice] = useState("");
  const [reason, setReason] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [feedback, setFeedback] = useState("");
  const [history, setHistory] = useState<HistoryEntry[]>([]);
  const [activeCrisis, setActiveCrisis] = useState<Crisis | null>(null);
  const [activeSurprise, setActiveSurprise] = useState<SurpriseEvent | null>(null);
  const [secondsLeft, setSecondsLeft] = useState(180);
  const [teamScore, setTeamScore] = useState(0);
  const [overallMeter, setOverallMeter] = useState("Stabil");
  const [opponents, setOpponents] = useState(initialOpponents);
  const [showModal, setShowModal] = useState(false);
  const [modalTitle, setModalTitle] = useState("");
  const [modalBody, setModalBody] = useState("");
  const [nextCasePending, setNextCasePending] = useState<GameCase | null>(null);
  const [newsBanner, setNewsBanner] = useState<string | null>(null);
  const [round, setRound] = useState(1);
  const [gameFinished, setGameFinished] = useState(false);

  useEffect(() => {
    const raw = localStorage.getItem("macro_game_team_setup");
    if (raw) {
      try {
        setSetup(JSON.parse(raw));
      } catch {}
    }
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      setSecondsLeft((prev) => (prev <= 1 ? 0 : prev - 1));
    }, 1000);

    return () => clearInterval(timer);
  }, [currentCase.id]);

  const selectedOption = useMemo(
    () => currentCase.options.find((option) => option.id === selectedChoice),
    [currentCase, selectedChoice]
  );

  function maybeTriggerCrisis() {
    const shouldTrigger = Math.random() < 0.28;
    if (!shouldTrigger) {
      setActiveCrisis(null);
      return;
    }

    const randomIndex = Math.floor(Math.random() * crises.length);
    setActiveCrisis(crises[randomIndex]);
  }

  function maybeTriggerSurprise() {
    const shouldTrigger = Math.random() < 0.22;
    if (!shouldTrigger) {
      setActiveSurprise(null);
      return;
    }

    const randomIndex = Math.floor(Math.random() * surpriseEvents.length);
    setActiveSurprise(surpriseEvents[randomIndex]);
  }

  function updateOpponents() {
    setOpponents((prev) =>
      prev
        .map((team) => ({
          ...team,
          score: Math.max(0, Math.min(500, team.score + Math.floor(Math.random() * 11) - 1)),
          lastAction: [
            "Hæv renten",
            "Målrettet støtte",
            "Omskol arbejdskraft",
            "Koordiner internationalt",
            "Hold en ansvarlig linje",
            "Støt eksportører",
          ][Math.floor(Math.random() * 6)],
        }))
        .sort((a, b) => b.score - a.score)
    );
  }

  function updateOverallMeter(score: number) {
    if (score >= 380) return "Meget stærk";
    if (score >= 280) return "Stærk";
    if (score >= 180) return "Stabil";
    if (score >= 80) return "Presset";
    return "Sårbar";
  }

  function pickNextCase(baseNextId: string, nextRound: number) {
    const forceNews = nextRound % 3 === 0;

    if (forceNews || Math.random() < 0.25) {
      const story = dailyStories[Math.floor(Math.random() * dailyStories.length)];
      setNewsBanner(`Aktuel nyhed bruges nu aktivt: ${story.title}`);
      return buildNewsCase(story);
    }

    return baseCases[baseNextId] ?? baseCases.intro_inflation;
  }

  function finishGame() {
    setGameFinished(true);
    setShowModal(false);
    setSubmitted(false);
  }

  function continueAfterModal() {
    if (round >= TOTAL_ROUNDS) {
      finishGame();
      return;
    }

    if (nextCasePending) {
      maybeTriggerCrisis();
      maybeTriggerSurprise();
      updateOpponents();
      setCurrentCase(nextCasePending);
      setRound((prev) => prev + 1);
    }

    setShowModal(false);
    setSubmitted(false);
    setFeedback("");
    setSecondsLeft(180);
    setNextCasePending(null);
  }

  function handleTimeout() {
    const penalty = -4;
    const nextCase = pickNextCase("market_panic", round + 1);

    setTeamScore((prev) => {
      const next = prev + penalty;
      setOverallMeter(updateOverallMeter(next));
      return next;
    });

    setModalTitle("Evaluering af jeres svar");
    setModalBody(
      "Kritik: I svarede ikke inden for 3 minutter. Det ligner handlelammelse under pres. I mister derfor samlet styrke i vurderingen. Point denne runde: -4 ud af maks 12 og min -4. Pointlogik: Manglende svar udløser minus, fordi passivitet under usikkerhed også er en økonomisk beslutning."
    );
    setShowModal(true);
    setSubmitted(true);
    setSelectedChoice("");
    setReason("");
    setNextCasePending(nextCase);
  }

  useEffect(() => {
    if (secondsLeft === 0 && !submitted && !gameFinished) {
      handleTimeout();
    }
  }, [secondsLeft, submitted, gameFinished]);

  function handleSubmit() {
    if (!selectedOption || !reason.trim()) return;

    const previous = history.length > 0 ? history[history.length - 1] : null;
    const critique = buildCritique(reason, selectedOption);
    const timeoutPenalty = secondsLeft < 30 ? -2 : 0;
    const hiddenRoundScore = critique.hiddenScore + timeoutPenalty;
    const nextCase = pickNextCase(selectedOption.next, round + 1);

    const praiseText =
      critique.praise.length > 0
        ? `Det gode i jeres svar: ${critique.praise.slice(0, 3).join(" ")}`
        : "Der er kun få tydelige faglige styrker i svaret endnu.";

    const criticismText =
      critique.criticism.length > 0
        ? `Kritik: ${critique.criticism.slice(0, 4).join(" ")}`
        : "Der er ikke tydelige svagheder i jeres svar.";

    const improvementText =
      critique.improvements.length > 0
        ? `Næste skridt: ${critique.improvements.slice(0, 3).join(" ")}`
        : "Jeres svar er allerede fagligt ret stærkt.";

    const directFeedbackText =
      critique.directComments.length > 0
        ? `Direkte feedback på jeres tekst: ${critique.directComments.slice(0, 3).join(" ")}`
        : "Der var ikke nok konkrete elementer i teksten til at give mere direkte tekstfeedback.";

    const compareText = compareToPrevious(critique, previous);

    const timeText =
      timeoutPenalty < 0
        ? "I afleverede sent i runden, og det svækker den samlede vurdering lidt."
        : "I afleverede inden for tiden, hvilket styrker jeres samlede beslutningskraft.";

    const maxPossible = selectedOption.hiddenPoints + 11;
    const minPossible = Math.max(-4, selectedOption.hiddenPoints - 8);

    const pointReasonText = `Pointlogik: Jeres valg havde en basisværdi på ${selectedOption.hiddenPoints}. I blev løftet, hvis I brugte fagbegreber som inflation, vækst, arbejdsløshed, gæld, tillid eller renter. I blev også løftet, hvis I viste trade-offs, konsekvenser og langsigtede effekter. I blev trukket ned, hvis svaret var for kort, for overfladisk, internt modstridende eller afleveret sent. Point denne runde: ${hiddenRoundScore}. Maks i denne runde: ${maxPossible}. Min i denne runde: ${minPossible}.`;

    setHistory((prev) => [
      ...prev,
      {
        round,
        caseTitle: currentCase.title,
        optionTitle: selectedOption.title,
        reason,
        level: critique.level,
        hiddenScore: hiddenRoundScore,
      },
    ]);

    setTeamScore((prev) => {
      const next = prev + hiddenRoundScore;
      setOverallMeter(updateOverallMeter(next));
      return next;
    });

    setFeedback(
      `Jeres valg "${selectedOption.title}" er registreret. Næste case formes nu af både strategien og kvaliteten af jeres begrundelse.`
    );

    setModalTitle(`Evaluering af jeres svar`);
    setModalBody(
      `I valgte: "${selectedOption.title}". I skrev: "${reason}". Vurdering: Jeres svar vurderes som ${critique.level}. ${praiseText} ${criticismText} ${directFeedbackText} ${improvementText} Sammenligning: ${compareText} ${timeText} ${pointReasonText}`
    );
    setShowModal(true);
    setSubmitted(true);
    setSelectedChoice("");
    setReason("");
    setNextCasePending(nextCase);
  }

  const leaderboard = [
    ...opponents,
    { name: "Jer", score: teamScore, lastAction: selectedOption?.title ?? "Afventer" },
  ].sort((a, b) => b.score - a.score);

  const winner = leaderboard[0]?.name ?? "Jer";
  const finalAssessment = buildFinalAssessment(history, teamScore, winner);

  if (gameFinished) {
    return (
      <main className="min-h-screen bg-[radial-gradient(circle_at_top,_rgba(180,140,40,0.18),_transparent_30%),linear-gradient(180deg,_#09111f_0%,_#0b1324_35%,_#050913_100%)] text-white p-8">
        <div className="max-w-5xl mx-auto space-y-6">
          <div className="rounded-3xl border border-amber-700 bg-slate-900/90 p-8 shadow-2xl">
            <div className="text-xs uppercase tracking-[0.3em] text-amber-300 mb-3">
              Spillet er afsluttet
            </div>
            <h1 className="text-5xl font-bold mb-4">Vinderen er: {winner}</h1>
            <p className="text-slate-300 text-lg leading-8">{finalAssessment.summary}</p>
          </div>

          <div className="grid lg:grid-cols-2 gap-6">
            <div className="rounded-3xl border border-slate-700 bg-slate-900/80 p-6 shadow-2xl">
              <h2 className="text-2xl font-semibold mb-4">Jeres slutresultat</h2>
              <div className="space-y-2 text-slate-300">
                <p>Hold: {setup?.teamName ?? teamCode.toUpperCase()}</p>
                <p>Samlet score: {teamScore}</p>
                <p>Samlet vurdering: {overallMeter}</p>
                <p>Stærke runder: {finalAssessment.strongRounds}</p>
                <p>Svage runder: {finalAssessment.weakRounds}</p>
                <p>Gennemsnitlig rundescore: {finalAssessment.avgScore}</p>
              </div>
            </div>

            <div className="rounded-3xl border border-slate-700 bg-slate-900/80 p-6 shadow-2xl">
              <h2 className="text-2xl font-semibold mb-4">Hvordan ville I klare jer som finansminister?</h2>
              <p className="text-slate-300 leading-8">{finalAssessment.financeMinisterVerdict}</p>
            </div>
          </div>

          <div className="rounded-3xl border border-slate-700 bg-slate-900/80 p-6 shadow-2xl">
            <h2 className="text-2xl font-semibold mb-4">Hvorfor fik I de point, I gjorde?</h2>
            <div className="space-y-4 text-slate-300">
              <p>
                Jeres point blev skabt af en kombination af strategiske valg og kvaliteten af jeres begrundelser.
                Hver runde havde en basisværdi ud fra, hvor makroøkonomisk holdbart valget var i situationen.
              </p>
              <p>
                I blev løftet, når I arbejdede med inflation, vækst, arbejdsløshed, gæld, troværdighed,
                renter og langsigtede konsekvenser på samme tid. I blev især belønnet, når I viste tydelige trade-offs.
              </p>
              <p>
                I blev trukket ned, når svarene blev for korte, for politiske uden økonomisk substans,
                eller når begrundelsen ikke passede til det valg, I faktisk tog.
              </p>
            </div>
          </div>

          <div className="rounded-3xl border border-slate-700 bg-slate-900/80 p-6 shadow-2xl">
            <h2 className="text-2xl font-semibold mb-4">Slutrangliste</h2>
            <div className="space-y-3">
              {leaderboard.map((team, index) => (
                <div
                  key={team.name}
                  className="rounded-2xl border border-slate-800 bg-slate-950/70 p-4 flex items-center justify-between"
                >
                  <div className="font-semibold">
                    {index + 1}. {team.name}
                  </div>
                  <div className="text-amber-300">{team.score}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-3xl border border-slate-700 bg-slate-900/80 p-6 shadow-2xl">
            <h2 className="text-2xl font-semibold mb-4">Jeres runder</h2>
            <div className="space-y-3 max-h-[420px] overflow-auto pr-1">
              {history.map((item, index) => (
                <div
                  key={index}
                  className="rounded-2xl border border-slate-800 bg-slate-950/70 p-4"
                >
                  <div className="font-semibold text-white">
                    Runde {item.round}: {item.caseTitle}
                  </div>
                  <div className="text-slate-300 mt-1">Valg: {item.optionTitle}</div>
                  <div className="text-slate-400 mt-1">Vurdering: {item.level}</div>
                  <div className="text-slate-500 mt-1">Rundescore: {item.hiddenScore}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top,_rgba(180,140,40,0.18),_transparent_30%),linear-gradient(180deg,_#09111f_0%,_#0b1324_35%,_#050913_100%)] text-white p-8">
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-6">
          <div className="w-full max-w-3xl rounded-3xl border border-amber-700 bg-slate-950 shadow-2xl p-6">
            <div className="text-xs uppercase tracking-widest text-amber-300 mb-2">
              Feedback
            </div>
            <h2 className="text-2xl font-bold mb-4">{modalTitle}</h2>
            <p className="text-slate-200 leading-8">{modalBody}</p>

            <div className="mt-6 flex justify-end">
              <button
                onClick={continueAfterModal}
                className="rounded-2xl bg-amber-400 px-5 py-3 font-semibold text-slate-950 hover:bg-amber-300"
              >
                Videre til næste case
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
            <div>
              <div className="text-xs uppercase tracking-[0.25em] text-amber-300/80 mb-2">
                Makrospil
              </div>
              <h1 className="text-4xl font-bold">
                {setup?.teamName ?? teamCode.toUpperCase()}
              </h1>
              <div className="text-slate-400 mt-2">
                {setup?.members?.length ? `Medlemmer: ${setup.members.join(", ")}` : "Ingen medlemmer registreret"}
              </div>
            </div>

            <div
              className={`rounded-2xl px-4 py-3 text-lg font-semibold border ${
                secondsLeft < 30
                  ? "bg-red-950/60 border-red-700 text-red-200"
                  : "bg-slate-900/80 border-slate-700 text-amber-300"
              }`}
            >
              Tid tilbage: {formatTime(secondsLeft)}
            </div>
          </div>

          <p className="text-slate-300 mb-4">
            I har 3 minutter pr. case. Aktuelle nyheder og uforudsete hændelser kan bryde ind undervejs.
          </p>

          {newsBanner && (
            <div className="rounded-2xl border border-blue-700 bg-blue-950/30 p-4 mb-6 text-blue-100">
              {newsBanner}
            </div>
          )}

          {activeSurprise && (
            <div className="rounded-2xl border border-violet-700 bg-violet-950/30 p-4 mb-6 text-violet-100">
              <div className="text-xs uppercase tracking-widest mb-2">Uforudset hændelse</div>
              <div className="font-semibold">{activeSurprise.title}</div>
              <div className="mt-1">{activeSurprise.description}</div>
              <div className="mt-2 text-sm text-violet-300">Effekt: {activeSurprise.effect}</div>
            </div>
          )}

          <div className="rounded-3xl border border-slate-700 bg-slate-900/80 p-6 mb-6 shadow-2xl">
            <div className="text-xs uppercase tracking-widest text-amber-300 mb-3">
              Dagens makronyheder
            </div>
            <div className="space-y-3">
              {dailyStories.map((story) => (
                <div key={story.id} className="rounded-2xl bg-slate-950/70 p-3 border border-slate-800">
                  <div className="font-semibold text-slate-100">{story.title}</div>
                  <div className="text-sm text-slate-400 mt-1">
                    {story.region} • {story.sourceLabel} • {story.theme}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {activeCrisis && (
            <div className="rounded-3xl border border-red-700 bg-red-950/40 p-6 mb-6 shadow-2xl">
              <div className="text-xs uppercase tracking-widest text-red-300 mb-2">
                Krise • {activeCrisis.severity}
              </div>
              <h2 className="text-2xl font-semibold mb-2">{activeCrisis.title}</h2>
              <p className="text-slate-100">{activeCrisis.description}</p>
            </div>
          )}

          <div className="rounded-3xl border border-slate-700 bg-slate-900/80 p-6 mb-6 shadow-2xl">
            <div className="flex items-center justify-between gap-3 mb-2">
              <div className="text-xs uppercase tracking-widest text-amber-400">
                Tema: {currentCase.theme}
              </div>
              <div className="text-xs uppercase tracking-widest text-slate-400">
                Sværhedsgrad: {currentCase.difficulty}
              </div>
            </div>
            <h2 className="text-2xl font-semibold mb-2">{currentCase.title}</h2>
            <p className="text-slate-300 leading-8">{currentCase.description}</p>
          </div>

          <div className="grid md:grid-cols-2 gap-4 mb-6">
            {currentCase.options.map((option) => (
              <button
                key={option.id}
                onClick={() => setSelectedChoice(option.id)}
                className={`rounded-3xl border p-6 text-left transition ${
                  selectedChoice === option.id
                    ? "border-amber-400 bg-amber-400/10 ring-1 ring-amber-300/40"
                    : "border-slate-700 bg-slate-900/70 hover:border-amber-500 hover:bg-slate-800/90"
                }`}
              >
                <h3 className="text-lg font-semibold mb-2">{option.title}</h3>
                <p className="text-slate-300">{option.text}</p>
              </button>
            ))}
          </div>

          <div className="rounded-3xl border border-slate-700 bg-slate-900/80 p-6 mb-6 shadow-2xl">
            <h2 className="text-xl font-semibold mb-4">Begrund jeres valg</h2>
            <textarea
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              className="w-full min-h-40 rounded-3xl border border-slate-700 bg-slate-950/80 p-4 text-white"
              placeholder="Forklar jeres valg fagligt. Brug gerne inflation, vækst, arbejdsløshed, gæld, tillid, renter, trade-offs og langsigtede konsekvenser."
            />
          </div>

          <button
            onClick={handleSubmit}
            disabled={!selectedChoice || !reason.trim() || secondsLeft === 0}
            className="rounded-3xl bg-amber-400 px-6 py-3 font-semibold text-slate-950 hover:bg-amber-300 disabled:opacity-50 shadow-lg"
          >
            Send svar
          </button>

          {submitted && !showModal && (
            <div className="mt-6 rounded-3xl border border-emerald-700 bg-emerald-900/20 p-5 text-emerald-100">
              {feedback}
            </div>
          )}
        </div>

        <div className="space-y-6">
          <div className="rounded-3xl border border-slate-700 bg-slate-900/80 p-6 shadow-2xl">
            <h2 className="text-xl font-semibold mb-3">Samlet status</h2>
            <p className="text-slate-300">Samlet score: {teamScore}</p>
            <p className="text-slate-300">Vurdering: {overallMeter}</p>
          </div>

          <div className="rounded-3xl border border-slate-700 bg-slate-900/80 p-6 shadow-2xl">
            <h2 className="text-xl font-semibold mb-3">Placering blandt holdene</h2>
            <div className="space-y-3">
              {leaderboard.map((team, index) => (
                <div key={team.name} className="rounded-2xl bg-slate-950/70 p-3 border border-slate-800">
                  <div className="flex items-center justify-between">
                    <div className="font-semibold">
                      {index + 1}. {team.name}
                    </div>
                    <div className="text-amber-300">{team.score}</div>
                  </div>
                  <div className="text-sm text-slate-400 mt-1">
                    Seneste bevægelse: {team.lastAction}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-3xl border border-slate-700 bg-slate-900/80 p-6 shadow-2xl">
            <h2 className="text-xl font-semibold mb-3">Jeres tidligere svar</h2>
            {history.length === 0 ? (
              <p className="text-slate-400">Ingen svar endnu.</p>
            ) : (
              <div className="space-y-3 max-h-[320px] overflow-auto pr-1">
                {history.map((item, index) => (
                  <div key={index} className="rounded-2xl bg-slate-950/70 p-3 text-sm text-slate-300 border border-slate-800">
                    {item.caseTitle} • {item.optionTitle} • {item.level} • {item.hiddenScore} point
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}