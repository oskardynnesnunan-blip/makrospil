"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useParams } from "next/navigation";
import { gameCases } from "@/app/data/cases";

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

type RuntimeOption = {
  id: string;
  title: string;
  text: string;
  next: string;
  hiddenPoints: number;
  feedback: string;
};

type RuntimeGameCase = {
  id: string;
  title: string;
  description: string;
  theme: string;
  macroQuestion?: string;
  timeLimitSeconds: number;
  hints: string[];
  difficulty: "medium" | "hard" | "very hard";
  options: RuntimeOption[];
  isNewsCase?: boolean;
};

type EvalResult = {
  totalScore: number;
  level: string;
  praise: string[];
  criticism: string[];
  improvements: string[];
  directComments: string[];
  choiceScore: number;
  conceptScore: number;
  tradeoffScore: number;
  depthScore: number;
  consistencyPenalty: number;
  keywordCount: number;
  tradeoffCount: number;
  weakCount: number;
  length: number;
};

type HistoryEntry = {
  round: number;
  caseTitle: string;
  optionTitle: string;
  reason: string;
  level: string;
  hiddenScore: number;
  caseId?: string;
};

type TeamSetup = {
  code: string;
  teamName: string;
  members: string[];
  startedAt: string;
};

type Opponent = {
  name: string;
  score: number;
  lastAction: string;
};

const TOTAL_ROUNDS = 32;
const INTRO_MINUTES = 4;
const DEFAULT_CASE_ID = "intro_inflation";
const DEFAULT_CASE_TIME = 480;

const FALLBACK_HINTS = [
  "Forklar hvilket makroproblem situationen peger på.",
  "Vis både kortsigtede og langsigtede konsekvenser.",
  "Tag stilling til inflation, vækst, beskæftigelse og tillid.",
];

const FOCUS_GUIDE = [
  "Hvad er det vigtigste problem i casen?",
  "Hvad er trade-off mellem jeres løsning og alternativet?",
  "Brug mindst 3 fagbegreber i forklaringen.",
];

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

const initialOpponents: Opponent[] = [
  { name: "USA", score: 0, lastAction: "Ikke startet" },
  { name: "EU", score: 0, lastAction: "Ikke startet" },
  { name: "Kina", score: 0, lastAction: "Ikke startet" },
  { name: "Norden", score: 0, lastAction: "Ikke startet" },
];

const CASE_POINTS: Record<string, { optionA: number; optionB: number }> = {
  intro_inflation: { optionA: 8, optionB: 6 },
  labor_pressure: { optionA: 7, optionB: 8 },
  debt_doubt: { optionA: 9, optionB: 4 },
  budget_strain: { optionA: 8, optionB: 4 },
  social_unrest: { optionA: 7, optionB: 6 },
  growth_slump: { optionA: 9, optionB: 6 },
  market_panic: { optionA: 9, optionB: 4 },
  election_pressure: { optionA: 4, optionB: 9 },
  bond_selloff: { optionA: 8, optionB: 6 },
  energy_shock: { optionA: 7, optionB: 5 },
  trade_break: { optionA: 5, optionB: 9 },
  bank_stress: { optionA: 8, optionB: 4 },
  climate_damage: { optionA: 6, optionB: 9 },
  currency_slide: { optionA: 8, optionB: 5 },
  global_crisis: { optionA: 10, optionB: 4 },
  housing_bubble: { optionA: 8, optionB: 5 },
  supply_chain_freeze: { optionA: 8, optionB: 6 },
  tax_revolt: { optionA: 8, optionB: 5 },
  export_collapse: { optionA: 7, optionB: 8 },
  pension_gap: { optionA: 9, optionB: 4 },
  food_price_spike: { optionA: 8, optionB: 5 },
  tech_boom: { optionA: 7, optionB: 6 },
  currency_attack: { optionA: 9, optionB: 5 },
  public_strike_wave: { optionA: 6, optionB: 8 },
  green_transition_shock: { optionA: 8, optionB: 6 },
};

const CASE_DIFFICULTY: Record<string, "medium" | "hard" | "very hard"> = {
  intro_inflation: "medium",
  labor_pressure: "hard",
  debt_doubt: "hard",
  budget_strain: "hard",
  social_unrest: "very hard",
  growth_slump: "hard",
  market_panic: "very hard",
  election_pressure: "very hard",
  bond_selloff: "very hard",
  energy_shock: "very hard",
  trade_break: "very hard",
  bank_stress: "very hard",
  climate_damage: "very hard",
  currency_slide: "very hard",
  global_crisis: "very hard",
  housing_bubble: "hard",
  supply_chain_freeze: "very hard",
  tax_revolt: "hard",
  export_collapse: "hard",
  pension_gap: "very hard",
  food_price_spike: "hard",
  tech_boom: "hard",
  currency_attack: "very hard",
  public_strike_wave: "hard",
  green_transition_shock: "very hard",
};

const KEYWORDS = {
  inflation: ["inflation", "pris", "priser", "prisniveau", "prisudvikling"],
  growth: ["vækst", "bnp", "aktivitet", "produktion", "efterspørgsel"],
  unemployment: ["arbejdsløshed", "ledighed", "beskæftigelse", "jobs"],
  debt: ["gæld", "underskud", "statsbudget", "budget", "offentlige finanser"],
  trust: ["tillid", "troværdighed", "marked", "investor", "obligation"],
  rates: ["rente", "renter", "centralbank", "nationalbank", "pengepolitik"],
  tradeoff: ["men", "risiko", "ulempe", "omkost", "på den anden side"],
  longterm: [
    "langsigt",
    "struktur",
    "produktivitet",
    "konkurrenceevne",
    "reform",
    "holdbarhed",
  ],
};

const CORE_CASE_IDS = Object.keys(gameCases);

function includesAny(text: string, words: string[]) {
  return words.some((word) => text.includes(word));
}

function formatTime(totalSeconds: number) {
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes}:${seconds.toString().padStart(2, "0")}`;
}

function normalizeCase(caseId: string): RuntimeGameCase {
  const fallback = gameCases[DEFAULT_CASE_ID];
  const source = gameCases[caseId] ?? fallback;

  const sourceWithOptionalFields = source as typeof source & {
    macroQuestion?: string;
    timeLimitSeconds?: number;
    hints?: string[];
    optionA: typeof source.optionA & {
      feedback?: string;
    };
    optionB: typeof source.optionB & {
      feedback?: string;
    };
  };

  const rawHints = sourceWithOptionalFields.hints ?? [];
  const safeHints = rawHints.length > 0 ? rawHints : FALLBACK_HINTS;

  return {
    id: source.id,
    title: source.title,
    description: source.description,
    theme: source.theme,
    macroQuestion:
      sourceWithOptionalFields.macroQuestion ??
      "Hvordan bør økonomisk politik reagere i denne situation? Brug makroøkonomisk teori og forklar konsekvenserne for inflation, vækst, arbejdsløshed, tillid og offentlige finanser.",
    timeLimitSeconds:
      sourceWithOptionalFields.timeLimitSeconds ?? DEFAULT_CASE_TIME,
    hints: safeHints,
    difficulty: CASE_DIFFICULTY[source.id] ?? "hard",
    options: [
      {
        id: source.optionA.id,
        title: source.optionA.title,
        text: source.optionA.text,
        next: source.optionA.next,
        feedback:
          sourceWithOptionalFields.optionA.feedback ??
          "Dette valg kræver en tydelig makroøkonomisk begrundelse.",
        hiddenPoints: CASE_POINTS[source.id]?.optionA ?? 7,
      },
      {
        id: source.optionB.id,
        title: source.optionB.title,
        text: source.optionB.text,
        next: source.optionB.next,
        feedback:
          sourceWithOptionalFields.optionB.feedback ??
          "Dette valg kræver en tydelig makroøkonomisk begrundelse.",
        hiddenPoints: CASE_POINTS[source.id]?.optionB ?? 6,
      },
    ],
  };
}

function buildNewsCase(story: DailyStory): RuntimeGameCase {
  return {
    id: `news_${story.id}`,
    title: `Aktuel nyhed: ${story.title}`,
    description: `Ny makrohistorie fra ${story.sourceLabel} i ${story.region}. Temaet er ${story.theme}, og I skal nu reagere som et økonomisk beslutningsteam. Hvis I mislæser situationen, kan det koste både troværdighed, vækst og politisk stabilitet.`,
    theme: story.theme,
    macroQuestion:
      "Hvordan bør økonomisk politik reagere på denne udvikling? Brug makroøkonomisk teori og vurder konsekvenserne for inflation, vækst, arbejdsløshed, tillid og offentlige finanser.",
    timeLimitSeconds: DEFAULT_CASE_TIME,
    hints: [
      "Tænk på hvilket makroproblem nyheden peger på.",
      "Forklar både kortsigtede og langsigtede konsekvenser.",
      "Vis et trade-off mellem stabilitet og aktivitet.",
    ],
    difficulty: "very hard",
    isNewsCase: true,
    options: [
      {
        id: `${story.id}_strict`,
        title: "Vælg en stram linje",
        text: "Prioritér troværdighed, prisstabilitet og signalværdi, men risiko for svagere aktivitet.",
        next: "market_panic",
        hiddenPoints: 9,
        feedback:
          "Dette valg prioriterer troværdighed og stabilitet. Makroøkonomisk giver det mening, hvis risikoen for inflation, kapitalflugt eller tab af tillid er stor. Ulempen er, at lavere efterspørgsel kan svække vækst og beskæftigelse.",
      },
      {
        id: `${story.id}_balanced`,
        title: "Vælg en balanceret løsning",
        text: "Søg kompromis mellem stabilitet og aktivitet, men uden garanti for at markedet køber historien.",
        next: "growth_slump",
        hiddenPoints: 8,
        feedback:
          "Dette valg forsøger at afveje flere makromål på samme tid. Det er ofte stærkt, hvis situationen er kompleks, men det kræver præcis argumentation om både inflation, aktivitet og troværdighed.",
      },
      {
        id: `${story.id}_support`,
        title: "Brug målrettet støtte",
        text: "Skærm særligt udsatte grupper eller sektorer, men pres budgettet.",
        next: "budget_strain",
        hiddenPoints: 7,
        feedback:
          "Dette valg kan være makroøkonomisk fornuftigt, hvis chokket rammer skævt. Målrettet støtte kan dæmpe fald i aktivitet uden at stimulere hele økonomien for meget, men det belaster budgettet.",
      },
      {
        id: `${story.id}_political`,
        title: "Tænk politisk først",
        text: "Skab kort ro og lav konflikt nu, men med risiko for dårligere økonomisk troværdighed senere.",
        next: "election_pressure",
        hiddenPoints: 4,
        feedback:
          "Dette valg kan være politisk forståeligt på kort sigt, men makroøkonomisk er det ofte svagere, hvis det mangler klar kobling til inflation, vækst, gæld eller troværdighed.",
      },
    ],
  };
}

function buildCritique(reason: string, selectedOption: RuntimeOption): EvalResult {
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

  const praise: string[] = [];
  const criticism: string[] = [];
  const improvements: string[] = [];
  const directComments: string[] = [];

  const keywordFlags = [
    seesInflation,
    seesGrowth,
    seesUnemployment,
    seesDebt,
    seesTrust,
    seesRates,
    seesLongTerm,
  ];

  const keywordCount = keywordFlags.filter(Boolean).length;

  let choiceScore = Math.max(4, Math.min(10, selectedOption.hiddenPoints));
  let conceptScore = 0;
  let tradeoffScore = 0;
  let depthScore = 0;
  let consistencyPenalty = 0;

  if (seesInflation) {
    conceptScore += 1;
    praise.push("I inddrager inflation.");
  } else {
    criticism.push("I overser inflation.");
    improvements.push("Forklar hvordan valget påvirker inflation og prisniveau.");
  }

  if (seesGrowth) {
    conceptScore += 1;
    praise.push("I kobler svaret til vækst og aktivitet.");
  } else {
    criticism.push("I mangler vækst og aktivitet.");
    improvements.push("Skriv hvad der sker med BNP, aktivitet eller efterspørgsel.");
  }

  if (seesUnemployment) {
    conceptScore += 1;
    praise.push("I forholder jer til arbejdsmarkedet.");
  } else {
    criticism.push("I glemmer beskæftigelse eller ledighed.");
    improvements.push("Tag stilling til jobs, beskæftigelse eller arbejdsløshed.");
  }

  if (seesDebt) {
    conceptScore += 1;
    praise.push("I tager højde for offentlige finanser.");
  } else {
    criticism.push("I mangler budget, gæld eller underskud.");
    improvements.push("Inddrag de offentlige finanser.");
  }

  if (seesTrust) {
    conceptScore += 2;
    praise.push("I viser forståelse for tillid og troværdighed.");
    directComments.push("I kobler beslutningen til markedsreaktioner og troværdighed.");
  } else {
    criticism.push("I overser tillid og troværdighed.");
    improvements.push("Forklar hvordan markeder og investorer kan reagere.");
  }

  if (seesRates) {
    conceptScore += 2;
    praise.push("I kobler argumentet til renter eller centralbank.");
  }

  if (seesLongTerm) {
    conceptScore += 2;
    praise.push("I tænker også langsigtet.");
  } else {
    criticism.push("Svaret er for kortsigtet.");
    improvements.push("Vis også de langsigtede konsekvenser.");
  }

  conceptScore = Math.min(10, conceptScore);

  if (seesTradeoff) {
    tradeoffScore = 3;
    praise.push("I viser trade-offs tydeligt.");
    directComments.push("I forklarer både gevinster og omkostninger.");
  } else {
    criticism.push("I viser ikke tydeligt, hvad jeres valg koster.");
    improvements.push("Skriv både fordel og ulempe ved jeres løsning.");
  }

  if (reason.trim().length >= 220) {
    depthScore = 3;
    praise.push("I uddyber svaret grundigt.");
  } else if (reason.trim().length >= 140) {
    depthScore = 2;
    praise.push("I giver en rimelig uddybning.");
  } else if (reason.trim().length >= 90) {
    depthScore = 1;
  } else {
    depthScore = 0;
    criticism.push("Begrundelsen er for kort.");
    improvements.push("Skriv mere udfoldet og præcist.");
    directComments.push("Svaret er så kort, at flere vigtige hensyn mangler.");
  }

  if (weakHits.length > 0) {
    consistencyPenalty -= 2;
    criticism.push("Sproget bliver for løst og for lidt fagligt.");
    improvements.push("Brug færre løse formuleringer og flere fagbegreber.");
  }

  if (
    selectedOption.title.toLowerCase().includes("stram") &&
    text.includes("stimul")
  ) {
    consistencyPenalty -= 2;
    criticism.push("Der er modstrid mellem jeres valg og jeres begrundelse.");
    improvements.push("Sørg for at begrundelsen passer klart til det valg, I har taget.");
    directComments.push("Teksten peger i en anden retning end jeres valgte løsning.");
  }

  const totalScore = Math.max(
    0,
    Math.min(26, choiceScore + conceptScore + tradeoffScore + depthScore + consistencyPenalty)
  );

  let level = "svagt";
  if (totalScore >= 22) level = "meget stærkt";
  else if (totalScore >= 17) level = "stærkt";
  else if (totalScore >= 12) level = "fornuftigt";
  else if (totalScore >= 8) level = "usikkert";

  return {
    totalScore,
    level,
    praise,
    criticism,
    improvements,
    directComments,
    choiceScore,
    conceptScore,
    tradeoffScore,
    depthScore,
    consistencyPenalty,
    keywordCount,
    tradeoffCount: seesTradeoff ? 1 : 0,
    weakCount: weakHits.length,
    length: reason.trim().length,
  };
}

function compareToPrevious(current: EvalResult, previous?: HistoryEntry | null) {
  if (!previous) {
    return "Det er jeres første svar i denne session, så der er endnu ikke noget at sammenligne med.";
  }

  const parts: string[] = [];

  if (current.totalScore > previous.hiddenScore) {
    parts.push("Stærkere end sidst.");
  } else if (current.totalScore < previous.hiddenScore) {
    parts.push("Svagere end sidst.");
  } else {
    parts.push("Omtrent samme niveau som sidst.");
  }

  if (current.length > previous.reason.length) {
    parts.push("Mere udfoldet.");
  } else if (current.length < previous.reason.length) {
    parts.push("Kortere end sidst.");
  }

  return parts.join(" ");
}

function buildFinalAssessment(history: HistoryEntry[], finalScore: number, winner: string) {
  const strongRounds = history.filter(
    (h) => h.level === "meget stærkt" || h.level === "stærkt"
  ).length;
  const weakRounds = history.filter(
    (h) => h.level === "svagt" || h.level === "usikkert"
  ).length;
  const avgScore =
    history.length > 0
      ? Math.round(history.reduce((sum, h) => sum + h.hiddenScore, 0) / history.length)
      : 0;

  let financeMinisterVerdict = "";
  if (finalScore >= 520) {
    financeMinisterVerdict =
      "I ville sandsynligvis klare jer stærkt som finansminister. I viser robust dømmekraft, evne til at balancere modstridende mål og relativt høj troværdighed.";
  } else if (finalScore >= 380) {
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

function pickAlternativeCaseId(recentCaseIds: string[], excludeIds: string[] = []) {
  const blocked = new Set([...recentCaseIds, ...excludeIds]);
  const candidates = CORE_CASE_IDS.filter((id) => !blocked.has(id));

  if (candidates.length === 0) {
    const fallbackCandidates = CORE_CASE_IDS.filter((id) => !excludeIds.includes(id));
    return fallbackCandidates[Math.floor(Math.random() * fallbackCandidates.length)] ?? DEFAULT_CASE_ID;
  }

  return candidates[Math.floor(Math.random() * candidates.length)];
}

export default function TeamPage() {
  const params = useParams<{ id: string }>();
  const teamCode = String(params?.id ?? "usa01");
  const timeoutHandledRef = useRef(false);

  const [setup, setSetup] = useState<TeamSetup | null>(null);
  const [currentCase, setCurrentCase] = useState<RuntimeGameCase>(
    normalizeCase(DEFAULT_CASE_ID)
  );
  const [selectedChoice, setSelectedChoice] = useState("");
  const [reason, setReason] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [feedback, setFeedback] = useState("");
  const [history, setHistory] = useState<HistoryEntry[]>([]);
  const [activeCrisis, setActiveCrisis] = useState<Crisis | null>(null);
  const [activeSurprise, setActiveSurprise] = useState<SurpriseEvent | null>(null);
  const [secondsLeft, setSecondsLeft] = useState(DEFAULT_CASE_TIME);
  const [teamScore, setTeamScore] = useState(0);
  const [overallMeter, setOverallMeter] = useState("Stabil");
  const [opponents, setOpponents] = useState<Opponent[]>(initialOpponents);
  const [showModal, setShowModal] = useState(false);
  const [modalTitle, setModalTitle] = useState("");
  const [modalBody, setModalBody] = useState("");
  const [nextCasePending, setNextCasePending] = useState<RuntimeGameCase | null>(null);
  const [newsBanner, setNewsBanner] = useState<string | null>(null);
  const [round, setRound] = useState(1);
  const [gameFinished, setGameFinished] = useState(false);
  const [revealedHints, setRevealedHints] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  const safeHints = useMemo(() => {
    if (currentCase.hints && currentCase.hints.length > 0) {
      return currentCase.hints;
    }
    return FALLBACK_HINTS;
  }, [currentCase.hints]);

  const recentCaseIds = useMemo(() => {
    return history.slice(-4).map((item) => item.caseId).filter(Boolean) as string[];
  }, [history]);

  useEffect(() => {
    const raw = localStorage.getItem("macro_game_team_setup");
    if (raw) {
      try {
        setSetup(JSON.parse(raw));
      } catch {
        setSetup(null);
      }
    }
  }, []);

  useEffect(() => {
    setSecondsLeft(currentCase.timeLimitSeconds || DEFAULT_CASE_TIME);
    setRevealedHints(0);
    setIsPaused(false);
    setSelectedChoice("");
    setReason("");
    timeoutHandledRef.current = false;
  }, [currentCase.id, currentCase.timeLimitSeconds]);

  useEffect(() => {
    if (isPaused || showModal || gameFinished || submitted) return;

    const timer = setInterval(() => {
      setSecondsLeft((prev) => (prev <= 1 ? 0 : prev - 1));
    }, 1000);

    return () => clearInterval(timer);
  }, [isPaused, showModal, gameFinished, submitted, currentCase.id]);

  function handlePauseGame() {
    if (showModal || gameFinished) return;
    setIsPaused(true);
  }

  function handleResumeGame() {
    if (showModal || gameFinished) return;
    setIsPaused(false);
  }

  function togglePauseGame() {
    if (showModal || gameFinished) return;
    setIsPaused((prev) => !prev);
  }

  function maybeTriggerCrisis() {
    const shouldTrigger = Math.random() < 0.24;
    if (!shouldTrigger) {
      setActiveCrisis(null);
      return;
    }

    const randomIndex = Math.floor(Math.random() * crises.length);
    setActiveCrisis(crises[randomIndex]);
  }

  function maybeTriggerSurprise() {
    const shouldTrigger = Math.random() < 0.2;
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
          score: Math.max(0, Math.min(900, team.score + Math.floor(Math.random() * 15) - 1)),
          lastAction: [
            "Hæv renten",
            "Målrettet støtte",
            "Koordiner internationalt",
            "Hold en ansvarlig linje",
            "Støt eksportører",
            "Forsvar væksten",
          ][Math.floor(Math.random() * 6)],
        }))
        .sort((a, b) => b.score - a.score)
    );
  }

  function updateOverallMeter(score: number) {
    if (score >= 520) return "Meget stærk";
    if (score >= 380) return "Stærk";
    if (score >= 240) return "Stabil";
    if (score >= 120) return "Presset";
    return "Sårbar";
  }

  function pickNextCase(baseNextId: string, nextRound: number) {
    const forceNews = nextRound % 3 === 0;
    const currentId = currentCase.id;

    if (forceNews || Math.random() < 0.2) {
      const story = dailyStories[Math.floor(Math.random() * dailyStories.length)];
      setNewsBanner(`Aktuel nyhed bruges nu aktivt: ${story.title}`);
      return buildNewsCase(story);
    }

    let candidateId = baseNextId;

    const repeatedTooSoon =
      recentCaseIds.includes(candidateId) || candidateId === currentId;

    if (repeatedTooSoon) {
      candidateId = pickAlternativeCaseId(recentCaseIds, [currentId, baseNextId]);
    }

    setNewsBanner(null);
    return normalizeCase(candidateId);
  }

  function finishGame() {
    setGameFinished(true);
    setShowModal(false);
    setSubmitted(false);
    setIsPaused(false);
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
    setNextCasePending(null);
    setSelectedChoice("");
    setReason("");
    setIsPaused(false);
    timeoutHandledRef.current = false;
  }

  useEffect(() => {
    function handleEscape(event: KeyboardEvent) {
      if (event.key === "Escape" && showModal) {
        continueAfterModal();
        return;
      }

      if (event.key === "Escape" && !showModal && !gameFinished) {
        togglePauseGame();
      }
    }

    window.addEventListener("keydown", handleEscape);
    return () => window.removeEventListener("keydown", handleEscape);
  }, [showModal, gameFinished, nextCasePending, round]);

  const selectedOption = useMemo(
    () => currentCase.options.find((option) => option.id === selectedChoice),
    [currentCase, selectedChoice]
  );

  function handleTimeout() {
    if (timeoutHandledRef.current) return;
    timeoutHandledRef.current = true;

    const penalty = -4;
    const nextCase = pickNextCase("market_panic", round + 1);

    setHistory((prev) => [
      ...prev,
      {
        round,
        caseId: currentCase.id,
        caseTitle: currentCase.title,
        optionTitle: "Intet svar",
        reason: "",
        level: "timeout",
        hiddenScore: penalty,
      },
    ]);

    setTeamScore((prev) => {
      const next = prev + penalty;
      setOverallMeter(updateOverallMeter(next));
      return next;
    });

    setModalTitle("Evaluering af jeres svar");
    setModalBody(
      `Vurdering: timeout.\n\nProblem: I svarede ikke inden for tiden.\n\nPoint denne runde: -4.\n\nNæste skridt: Tag hurtigere stilling og skriv en kort, faglig begrundelse med mindst 2 til 3 begreber.`
    );
    setShowModal(true);
    setSubmitted(true);
    setSelectedChoice("");
    setReason("");
    setNextCasePending(nextCase);
  }

  useEffect(() => {
    if (secondsLeft === 0 && !submitted && !gameFinished && !isPaused && !showModal) {
      handleTimeout();
    }
  }, [secondsLeft, submitted, gameFinished, isPaused, showModal]);

  function handleSubmit() {
    if (!selectedOption || !reason.trim() || isPaused || showModal) return;

    const previous = history.length > 0 ? history[history.length - 1] : null;
    const critique = buildCritique(reason, selectedOption);

    const latePenalty = secondsLeft < 60 ? -2 : 0;
    const hintPenalty =
      revealedHints === 0 ? 0 : revealedHints === 1 ? 0 : revealedHints === 2 ? -1 : -2;

    const finalRoundScore = Math.max(
      0,
      Math.min(26, critique.totalScore + latePenalty + hintPenalty)
    );

    const nextCase = pickNextCase(selectedOption.next, round + 1);

    const topPraise =
      critique.praise.length > 0 ? critique.praise.slice(0, 2).join(" ") : "Der er enkelte gode takter.";

    const topCriticism =
      critique.criticism.length > 0
        ? critique.criticism.slice(0, 2).join(" ")
        : "Der er ikke nogen store svagheder i svaret.";

    const topImprovement =
      critique.improvements.length > 0
        ? critique.improvements.slice(0, 2).join(" ")
        : "Prøv næste gang at gøre forklaringen endnu mere præcis.";

    const directText =
      critique.directComments.length > 0
        ? critique.directComments.slice(0, 1).join(" ")
        : "Teksten kan stadig gøres skarpere.";

    const compareText = compareToPrevious(critique, previous);

    const timeText =
      latePenalty < 0 ? "Sent svar: -2." : "I afleverede i god tid.";

    const hintText =
      revealedHints === 0
        ? "Hints: 0."
        : revealedHints === 1
        ? "Hints: 1, ingen straf."
        : revealedHints === 2
        ? "Hints: 2, straf på -1."
        : `Hints: ${revealedHints}, straf på -2.`;

    const pointReasonText = `Point: valg ${critique.choiceScore}/10, faglighed ${critique.conceptScore}/10, trade-off ${critique.tradeoffScore}/3, dybde ${critique.depthScore}/3, konsistens ${critique.consistencyPenalty}, tid ${latePenalty}, hints ${hintPenalty}. Slutscore: ${finalRoundScore}/26.`;

    setHistory((prev) => [
      ...prev,
      {
        round,
        caseId: currentCase.id,
        caseTitle: currentCase.title,
        optionTitle: selectedOption.title,
        reason,
        level: critique.level,
        hiddenScore: finalRoundScore,
      },
    ]);

    setTeamScore((prev) => {
      const next = prev + finalRoundScore;
      setOverallMeter(updateOverallMeter(next));
      return next;
    });

    setFeedback(
      `Jeres valg "${selectedOption.title}" er registreret. Næste case formes nu af både strategien og kvaliteten af jeres begrundelse.`
    );

    setModalTitle("Evaluering af jeres svar");
    setModalBody(
      `Vurdering: ${critique.level}.\n\nDet fungerede: ${topPraise}\n\nDet mangler: ${topCriticism}\n\nDirekte feedback: ${directText}\n\nNæste skridt: ${topImprovement}\n\nMakrofeedback på valget: ${selectedOption.feedback}\n\nSammenligning: ${compareText}\n\n${timeText}\n${hintText}\n\n${pointReasonText}`
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
      <main className="min-h-screen bg-[radial-gradient(circle_at_top,_rgba(180,140,40,0.18),_transparent_30%),linear-gradient(180deg,_#09111f_0%,_#0b1324_35%,_#050913_100%)] p-8 text-white">
        <div className="mx-auto max-w-5xl space-y-6">
          <div className="rounded-3xl border border-amber-700 bg-slate-900/90 p-8 shadow-2xl">
            <div className="mb-3 text-xs uppercase tracking-[0.3em] text-amber-300">
              Spillet er afsluttet
            </div>
            <h1 className="mb-4 text-5xl font-bold">Vinderen er: {winner}</h1>
            <p className="text-lg leading-8 text-slate-300">{finalAssessment.summary}</p>
          </div>

          <div className="grid gap-6 lg:grid-cols-2">
            <div className="rounded-3xl border border-slate-700 bg-slate-900/80 p-6 shadow-2xl">
              <h2 className="mb-4 text-2xl font-semibold">Jeres slutresultat</h2>
              <div className="space-y-2 text-slate-300">
                <p>Hold: {setup?.teamName ?? teamCode.toUpperCase()}</p>
                <p>Samlet score: {teamScore}</p>
                <p>Samlet vurdering: {overallMeter}</p>
                <p>Stærke runder: {finalAssessment.strongRounds}</p>
                <p>Svage runder: {finalAssessment.weakRounds}</p>
                <p>Gennemsnitlig rundescore: {finalAssessment.avgScore}</p>
                <p>Format: {TOTAL_ROUNDS} cases á 8 minutter</p>
                <p>Planlagt intro: {INTRO_MINUTES} minutter</p>
              </div>
            </div>

            <div className="rounded-3xl border border-slate-700 bg-slate-900/80 p-6 shadow-2xl">
              <h2 className="mb-4 text-2xl font-semibold">
                Hvordan ville I klare jer som finansminister?
              </h2>
              <p className="leading-8 text-slate-300">
                {finalAssessment.financeMinisterVerdict}
              </p>
            </div>
          </div>

          <div className="rounded-3xl border border-slate-700 bg-slate-900/80 p-6 shadow-2xl">
            <h2 className="mb-4 text-2xl font-semibold">Slutrangliste</h2>
            <div className="space-y-3">
              {leaderboard.map((team, index) => (
                <div
                  key={team.name}
                  className="flex items-center justify-between rounded-2xl border border-slate-800 bg-slate-950/70 p-4"
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
            <h2 className="mb-4 text-2xl font-semibold">Jeres runder</h2>
            <div className="max-h-[420px] space-y-3 overflow-auto pr-1">
              {history.map((item, index) => (
                <div
                  key={index}
                  className="rounded-2xl border border-slate-800 bg-slate-950/70 p-4"
                >
                  <div className="font-semibold text-white">
                    Runde {item.round}: {item.caseTitle}
                  </div>
                  <div className="mt-1 text-slate-300">Valg: {item.optionTitle}</div>
                  <div className="mt-1 text-slate-400">Vurdering: {item.level}</div>
                  <div className="mt-1 text-slate-500">Rundescore: {item.hiddenScore}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top,_rgba(180,140,40,0.18),_transparent_30%),linear-gradient(180deg,_#09111f_0%,_#0b1324_35%,_#050913_100%)] p-8 text-white">
      {showModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4"
          onClick={continueAfterModal}
        >
          <div
            className="relative w-full max-w-2xl max-h-[85vh] overflow-hidden rounded-3xl border border-amber-700 bg-slate-950 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between gap-4 border-b border-slate-800 px-6 py-4">
              <div>
                <div className="mb-2 text-xs uppercase tracking-widest text-amber-300">
                  Feedback
                </div>
                <h2 className="text-2xl font-bold">{modalTitle}</h2>
              </div>

              <button
                type="button"
                onClick={continueAfterModal}
                aria-label="Luk feedback"
                className="shrink-0 rounded-xl border border-slate-700 px-3 py-2 text-sm font-semibold text-slate-200 hover:bg-slate-800"
              >
                Luk
              </button>
            </div>

            <div className="max-h-[calc(85vh-140px)] overflow-y-auto px-6 py-4">
              <p className="whitespace-pre-wrap leading-7 text-slate-200">{modalBody}</p>
            </div>

            <div className="border-t border-slate-800 px-6 py-4">
              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={continueAfterModal}
                  className="rounded-2xl bg-amber-400 px-5 py-3 font-semibold text-slate-950 hover:bg-amber-300"
                >
                  Videre til næste case
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {isPaused && !showModal && (
        <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/70 p-4">
          <div className="w-full max-w-xl rounded-3xl border border-amber-700 bg-slate-950 p-6 shadow-2xl">
            <div className="mb-2 text-xs uppercase tracking-widest text-amber-300">
              Pause
            </div>
            <h2 className="mb-3 text-2xl font-bold">Spillet er sat på pause</h2>
            <p className="leading-7 text-slate-300">
              Timeren er stoppet. I kan tale sammen, men I kan ikke vælge svar, bruge hints
              eller sende noget, før spillet fortsætter.
            </p>

            <div className="mt-6 flex justify-end">
              <button
                type="button"
                onClick={handleResumeGame}
                className="rounded-2xl bg-amber-400 px-5 py-3 font-semibold text-slate-950 hover:bg-amber-300"
              >
                Fortsæt spillet
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="mx-auto grid max-w-7xl gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <div className="mb-4 flex flex-wrap items-center justify-between gap-4">
            <div>
              <div className="mb-2 text-xs uppercase tracking-[0.25em] text-amber-300/80">
                Makrospil
              </div>
              <h1 className="text-4xl font-bold">
                {setup?.teamName ?? teamCode.toUpperCase()}
              </h1>
              <div className="mt-2 text-slate-400">
                {setup?.members?.length
                  ? `Medlemmer: ${setup.members.join(", ")}`
                  : "Ingen medlemmer registreret"}
              </div>
            </div>

            <div className="flex flex-wrap gap-3">
              <div className="rounded-2xl border border-slate-700 bg-slate-900/80 px-4 py-3 text-lg font-semibold text-slate-100">
                Runde {round}/{TOTAL_ROUNDS}
              </div>

              <div
                className={`rounded-2xl border px-4 py-3 text-lg font-semibold ${
                  isPaused
                    ? "border-amber-600 bg-amber-950/60 text-amber-200"
                    : secondsLeft < 60
                    ? "border-red-700 bg-red-950/60 text-red-200"
                    : "border-slate-700 bg-slate-900/80 text-amber-300"
                }`}
              >
                {isPaused ? "Pause" : `Tid tilbage: ${formatTime(secondsLeft)}`}
              </div>

              <button
                type="button"
                onClick={togglePauseGame}
                disabled={showModal || gameFinished}
                className="rounded-2xl border border-amber-500 px-4 py-3 font-semibold text-amber-300 hover:bg-amber-500/10 disabled:opacity-40"
              >
                {isPaused ? "Fortsæt" : "Pause"}
              </button>
            </div>
          </div>

          <p className="mb-4 text-slate-300">
            I har 8 minutter pr. case. Aktuelle nyheder og uforudsete hændelser kan bryde ind
            undervejs. Hele spillet er planlagt til {TOTAL_ROUNDS} cases á 8 minutter, plus {INTRO_MINUTES} minutters intro.
          </p>

          {isPaused && (
            <div className="mb-4 rounded-2xl border border-amber-700 bg-amber-950/30 p-4 text-amber-100">
              Spillet er sat på pause. Timeren står stille, indtil I trykker fortsæt.
            </div>
          )}

          {newsBanner && (
            <div className="mb-6 rounded-2xl border border-blue-700 bg-blue-950/30 p-4 text-blue-100">
              {newsBanner}
            </div>
          )}

          {activeSurprise && (
            <div className="mb-6 rounded-2xl border border-violet-700 bg-violet-950/30 p-4 text-violet-100">
              <div className="mb-2 text-xs uppercase tracking-widest">Uforudset hændelse</div>
              <div className="font-semibold">{activeSurprise.title}</div>
              <div className="mt-1">{activeSurprise.description}</div>
              <div className="mt-2 text-sm text-violet-300">Effekt: {activeSurprise.effect}</div>
            </div>
          )}

          <div className="mb-6 rounded-3xl border border-slate-700 bg-slate-900/80 p-6 shadow-2xl">
            <div className="mb-3 text-xs uppercase tracking-widest text-amber-300">
              Dagens makronyheder
            </div>
            <div className="space-y-3">
              {dailyStories.map((story) => (
                <div
                  key={story.id}
                  className="rounded-2xl border border-slate-800 bg-slate-950/70 p-3"
                >
                  <div className="font-semibold text-slate-100">{story.title}</div>
                  <div className="mt-1 text-sm text-slate-400">
                    {story.region} • {story.sourceLabel} • {story.theme}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {activeCrisis && (
            <div className="mb-6 rounded-3xl border border-red-700 bg-red-950/40 p-6 shadow-2xl">
              <div className="mb-2 text-xs uppercase tracking-widest text-red-300">
                Krise • {activeCrisis.severity}
              </div>
              <h2 className="mb-2 text-2xl font-semibold">{activeCrisis.title}</h2>
              <p className="text-slate-100">{activeCrisis.description}</p>
            </div>
          )}

          <div className="mb-6 rounded-3xl border border-slate-700 bg-slate-900/80 p-6 shadow-2xl">
            <div className="mb-2 flex items-center justify-between gap-3">
              <div className="text-xs uppercase tracking-widest text-amber-400">
                Tema: {currentCase.theme}
              </div>
              <div className="text-xs uppercase tracking-widest text-slate-400">
                Sværhedsgrad: {currentCase.difficulty}
              </div>
            </div>
            <h2 className="mb-2 text-2xl font-semibold">{currentCase.title}</h2>
            <p className="mb-4 leading-8 text-slate-300">{currentCase.description}</p>

            <div className="rounded-2xl border border-amber-700/50 bg-amber-950/20 p-4">
              <div className="mb-2 text-xs uppercase tracking-widest text-amber-300">
                Makrospørgsmål
              </div>
              <p className="leading-8 text-slate-100">{currentCase.macroQuestion}</p>
            </div>
          </div>

          <div className="mb-6 grid gap-4 md:grid-cols-3">
            {FOCUS_GUIDE.map((item) => (
              <div
                key={item}
                className="rounded-2xl border border-slate-800 bg-slate-950/70 p-4 text-sm text-slate-200"
              >
                {item}
              </div>
            ))}
          </div>

          <div className="mb-6 rounded-3xl border border-slate-700 bg-slate-900/80 p-6 shadow-2xl">
            <div className="mb-4 flex items-center justify-between gap-3">
              <h2 className="text-xl font-semibold">Hints</h2>
              <button
                type="button"
                onClick={() =>
                  setRevealedHints((prev) => (prev < safeHints.length ? prev + 1 : prev))
                }
                disabled={revealedHints >= safeHints.length || isPaused}
                className="rounded-2xl border border-amber-500 px-4 py-2 font-semibold text-amber-300 hover:bg-amber-500/10 disabled:cursor-not-allowed disabled:opacity-40"
              >
                {revealedHints >= safeHints.length ? "Alle hints vist" : "Vis næste hint"}
              </button>
            </div>

            {revealedHints === 0 ? (
              <p className="text-slate-400">
                Brug hints, hvis I går i stå. De vises ét ad gangen.
              </p>
            ) : (
              <div className="space-y-3">
                {safeHints.slice(0, revealedHints).map((hint, index) => (
                  <div
                    key={`${currentCase.id}-hint-${index}`}
                    className="rounded-2xl border border-slate-800 bg-slate-950/70 p-4 text-slate-200"
                  >
                    Hint {index + 1}: {hint}
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="mb-6 grid gap-4 md:grid-cols-2">
            {currentCase.options.map((option) => (
              <button
                type="button"
                key={option.id}
                onClick={() => setSelectedChoice(option.id)}
                disabled={isPaused}
                className={`rounded-3xl border p-6 text-left transition ${
                  selectedChoice === option.id
                    ? "border-amber-400 bg-amber-400/10 ring-1 ring-amber-300/40"
                    : "border-slate-700 bg-slate-900/70 hover:border-amber-500 hover:bg-slate-800/90"
                } ${isPaused ? "cursor-not-allowed opacity-50" : ""}`}
              >
                <h3 className="mb-2 text-lg font-semibold">{option.title}</h3>
                <p className="text-slate-300">{option.text}</p>
              </button>
            ))}
          </div>

          <div className="mb-6 rounded-3xl border border-slate-700 bg-slate-900/80 p-6 shadow-2xl">
            <h2 className="mb-4 text-xl font-semibold">Begrund jeres valg</h2>
            <textarea
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              disabled={isPaused}
              className="min-h-40 w-full rounded-3xl border border-slate-700 bg-slate-950/80 p-4 text-white disabled:opacity-50"
              placeholder="Forklar jeres valg fagligt. Brug gerne inflation, vækst, arbejdsløshed, gæld, tillid, renter, trade-offs og langsigtede konsekvenser."
            />
          </div>

          <button
            type="button"
            onClick={handleSubmit}
            disabled={!selectedChoice || !reason.trim() || secondsLeft === 0 || isPaused}
            className="rounded-3xl bg-amber-400 px-6 py-3 font-semibold text-slate-950 shadow-lg hover:bg-amber-300 disabled:opacity-50"
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
            <h2 className="mb-3 text-xl font-semibold">Samlet status</h2>
            <p className="text-slate-300">Samlet score: {teamScore}</p>
            <p className="text-slate-300">Vurdering: {overallMeter}</p>
          </div>

          <div className="rounded-3xl border border-slate-700 bg-slate-900/80 p-6 shadow-2xl">
            <h2 className="mb-3 text-xl font-semibold">Placering blandt holdene</h2>
            <div className="space-y-3">
              {leaderboard.map((team, index) => (
                <div
                  key={team.name}
                  className="rounded-2xl border border-slate-800 bg-slate-950/70 p-3"
                >
                  <div className="flex items-center justify-between">
                    <div className="font-semibold">
                      {index + 1}. {team.name}
                    </div>
                    <div className="text-amber-300">{team.score}</div>
                  </div>
                  <div className="mt-1 text-sm text-slate-400">
                    Seneste bevægelse: {team.lastAction}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-3xl border border-slate-700 bg-slate-900/80 p-6 shadow-2xl">
            <h2 className="mb-3 text-xl font-semibold">Jeres tidligere svar</h2>
            {history.length === 0 ? (
              <p className="text-slate-400">Ingen svar endnu.</p>
            ) : (
              <div className="max-h-[320px] space-y-3 overflow-auto pr-1">
                {history.map((item, index) => (
                  <div
                    key={index}
                    className="rounded-2xl border border-slate-800 bg-slate-950/70 p-3 text-sm text-slate-300"
                  >
                    {item.caseTitle} • {item.optionTitle} • {item.level} • {item.hiddenScore} point
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="rounded-3xl border border-slate-700 bg-slate-900/80 p-6 shadow-2xl">
            <h2 className="mb-3 text-xl font-semibold">Hvad vurderes jeres svar på?</h2>
            <div className="space-y-2 text-sm text-slate-300">
              <p>Brug af makroøkonomiske begreber</p>
              <p>Konsekvenser for inflation, vækst og arbejdsmarked</p>
              <p>Troværdighed, gæld og renter</p>
              <p>Tydelige trade-offs</p>
              <p>Langsigtede konsekvenser</p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}