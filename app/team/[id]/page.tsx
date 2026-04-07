"use client";

import { useEffect, useMemo, useState } from "react";
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

type Opponent = {
  name: string;
  score: number;
  lastAction: string;
};

const TOTAL_ROUNDS = 22;
const INTRO_MINUTES = 4;
const DEFAULT_CASE_ID = "intro_inflation";
const DEFAULT_CASE_TIME = 480;

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

  const sourceWithOptionalMacro = source as typeof source & {
    macroQuestion?: string;
  };

  return {
    id: source.id,
    title: source.title,
    description: source.description,
    theme: source.theme,
    macroQuestion:
      sourceWithOptionalMacro.macroQuestion ??
      "Hvordan bør økonomisk politik reagere i denne situation? Brug makroøkonomisk teori og forklar konsekvenserne for inflation, vækst, arbejdsløshed, tillid og offentlige finanser.",
    timeLimitSeconds: source.timeLimitSeconds ?? DEFAULT_CASE_TIME,
    hints: source.hints ?? [],
    difficulty: CASE_DIFFICULTY[source.id] ?? "hard",
    options: [
      {
        id: source.optionA.id,
        title: source.optionA.title,
        text: source.optionA.text,
        next: source.optionA.next,
        feedback: source.optionA.feedback,
        hiddenPoints: CASE_POINTS[source.id]?.optionA ?? 7,
      },
      {
        id: source.optionB.id,
        title: source.optionB.title,
        text: source.optionB.text,
        next: source.optionB.next,
        feedback: source.optionB.feedback,
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

    const timer = setInterval(() => {
      setSecondsLeft((prev) => (prev <= 1 ? 0 : prev - 1));
    }, 1000);

    return () => clearInterval(timer);
  }, [currentCase.id, currentCase.timeLimitSeconds]);

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

    setNewsBanner(null);
    return normalizeCase(baseNextId);
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
    setNextCasePending(null);
    setSelectedChoice("");
    setReason("");
  }

  function handleTimeout() {
    const penalty = -4;
    const nextCase = pickNextCase("market_panic", round + 1);

    setHistory((prev) => [
      ...prev,
      {
        round,
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
      "Kritik: I svarede ikke inden for 8 minutter. Det ligner handlelammelse under pres. I mister derfor samlet styrke i vurderingen. Point denne runde: -4 ud af maks 12 og min -4. Pointlogik: Manglende svar udløser minus, fordi passivitet under usikkerhed også er en økonomisk beslutning."
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
    const timeoutPenalty = secondsLeft < 60 ? -2 : 0;
    const hintPenalty = revealedHints > 1 ? -1 : 0;
    const hiddenRoundScore = critique.hiddenScore + timeoutPenalty + hintPenalty;
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
        ? "I afleverede meget sent i runden, og det svækker den samlede vurdering lidt."
        : "I afleverede inden for tiden, hvilket styrker jeres samlede beslutningskraft.";

    const hintText =
      revealedHints === 0
        ? "I klarede jer uden hints."
        : revealedHints === 1
        ? "I brugte ét hint."
        : `I brugte ${revealedHints} hints, hvilket trækker en smule ned i point for selvstændighed.`;

    const maxPossible = selectedOption.hiddenPoints + 11;
    const minPossible = Math.max(-4, selectedOption.hiddenPoints - 9);

    const macroFeedbackText = `Makroøkonomisk feedback på valget: ${selectedOption.feedback}`;

    const pointReasonText = `Pointlogik: Jeres valg havde en basisværdi på ${selectedOption.hiddenPoints}. I blev løftet, hvis I brugte fagbegreber som inflation, vækst, arbejdsløshed, gæld, tillid eller renter. I blev også løftet, hvis I viste trade-offs, konsekvenser og langsigtede effekter. I blev trukket ned, hvis svaret var for kort, for overfladisk, internt modstridende, afleveret sent eller byggede meget på hints. Point denne runde: ${hiddenRoundScore}. Maks i denne runde: ${maxPossible}. Min i denne runde: ${minPossible}.`;

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

    setModalTitle("Evaluering af jeres svar");
    setModalBody(
      `I valgte: "${selectedOption.title}". I skrev: "${reason}". Vurdering: Jeres svar vurderes som ${critique.level}. ${praiseText} ${criticismText} ${macroFeedbackText} ${directFeedbackText} ${improvementText} Sammenligning: ${compareText} ${timeText} ${hintText} ${pointReasonText}`
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
                <p>Format: 22 cases á 8 minutter</p>
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
            <h2 className="mb-4 text-2xl font-semibold">Hvorfor fik I de point, I gjorde?</h2>
            <div className="space-y-4 text-slate-300">
              <p>
                Jeres point blev skabt af en kombination af strategiske valg og kvaliteten af jeres
                begrundelser. Hver runde havde en basisværdi ud fra, hvor makroøkonomisk holdbart
                valget var i situationen.
              </p>
              <p>
                I blev løftet, når I arbejdede med inflation, vækst, arbejdsløshed, gæld,
                troværdighed, renter og langsigtede konsekvenser på samme tid. I blev især belønnet,
                når I viste tydelige trade-offs.
              </p>
              <p>
                I blev trukket ned, når svarene blev for korte, for politiske uden økonomisk
                substans, eller når begrundelsen ikke passede til det valg, I faktisk tog.
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
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-6">
          <div className="w-full max-w-3xl rounded-3xl border border-amber-700 bg-slate-950 p-6 shadow-2xl">
            <div className="mb-2 text-xs uppercase tracking-widest text-amber-300">
              Feedback
            </div>
            <h2 className="mb-4 text-2xl font-bold">{modalTitle}</h2>
            <p className="leading-8 text-slate-200">{modalBody}</p>

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

            <div className="flex gap-3">
              <div className="rounded-2xl border border-slate-700 bg-slate-900/80 px-4 py-3 text-lg font-semibold text-slate-100">
                Runde {round}/{TOTAL_ROUNDS}
              </div>
              <div
                className={`rounded-2xl border px-4 py-3 text-lg font-semibold ${
                  secondsLeft < 60
                    ? "border-red-700 bg-red-950/60 text-red-200"
                    : "border-slate-700 bg-slate-900/80 text-amber-300"
                }`}
              >
                Tid tilbage: {formatTime(secondsLeft)}
              </div>
            </div>
          </div>

          <p className="mb-4 text-slate-300">
            I har 8 minutter pr. case. Aktuelle nyheder og uforudsete hændelser kan bryde ind
            undervejs. Hele spillet er planlagt til 22 cases á 8 minutter, plus 4 minutters intro.
          </p>

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

          <div className="mb-6 rounded-3xl border border-slate-700 bg-slate-900/80 p-6 shadow-2xl">
            <div className="mb-4 flex items-center justify-between gap-3">
              <h2 className="text-xl font-semibold">Hints</h2>
              <button
                onClick={() =>
                  setRevealedHints((prev) =>
                    prev < currentCase.hints.length ? prev + 1 : prev
                  )
                }
                disabled={revealedHints >= currentCase.hints.length}
                className="rounded-2xl border border-amber-500 px-4 py-2 font-semibold text-amber-300 hover:bg-amber-500/10 disabled:opacity-40"
              >
                Vis næste hint
              </button>
            </div>

            {revealedHints === 0 ? (
              <p className="text-slate-400">
                Brug hints, hvis I går i stå. De vises ét ad gangen.
              </p>
            ) : (
              <div className="space-y-3">
                {currentCase.hints.slice(0, revealedHints).map((hint, index) => (
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
                key={option.id}
                onClick={() => setSelectedChoice(option.id)}
                className={`rounded-3xl border p-6 text-left transition ${
                  selectedChoice === option.id
                    ? "border-amber-400 bg-amber-400/10 ring-1 ring-amber-300/40"
                    : "border-slate-700 bg-slate-900/70 hover:border-amber-500 hover:bg-slate-800/90"
                }`}
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
              className="min-h-40 w-full rounded-3xl border border-slate-700 bg-slate-950/80 p-4 text-white"
              placeholder="Forklar jeres valg fagligt. Brug gerne inflation, vækst, arbejdsløshed, gæld, tillid, renter, trade-offs og langsigtede konsekvenser."
            />
          </div>

          <button
            onClick={handleSubmit}
            disabled={!selectedChoice || !reason.trim() || secondsLeft === 0}
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