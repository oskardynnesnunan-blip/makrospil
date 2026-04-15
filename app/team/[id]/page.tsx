"use client";

import { useEffect, useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { gameCases } from "@/app/data/cases";

type RuntimeOption = {
  id: string;
  title: string;
  text: string;
  next: string;
  feedback: string;
  hiddenPoints: number;
};

type RuntimeGameCase = {
  id: string;
  title: string;
  description: string;
  theme: string;
  macroQuestion: string;
  timeLimitSeconds: number;
  hints: string[];
  options: RuntimeOption[];
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

type HistoryEntry = {
  round: number;
  caseId: string;
  caseTitle: string;
  optionTitle: string;
  reason: string;
  level: string;
  score: number;
};

type EvalResult = {
  totalScore: number;
  level: string;
  good: string[];
  missing: string[];
  whyItMatters: string[];
  strongerAnswer: string[];
  choiceScore: number;
  incomeScore: number;
  debtScore: number;
  riskScore: number;
  clarityScore: number;
};

type SavedGameState = {
  round: number;
  currentCaseId: string;
  selectedChoice: string;
  reason: string;
  submitted: boolean;
  feedback: string;
  history: HistoryEntry[];
  secondsLeft: number;
  teamScore: number;
  overallMeter: string;
  opponents: Opponent[];
  showModal: boolean;
  modalTitle: string;
  modalBody: string;
  nextCasePendingId: string | null;
  gameFinished: boolean;
  revealedHints: number;
  isPaused: boolean;
  savedAt: string;
};

const DEFAULT_CASE_ID = "young_couple_home";
const DEFAULT_CASE_TIME = 480;
const TOTAL_ROUNDS = Object.keys(gameCases).length;

const FALLBACK_HINTS = [
  "Se på kundens indkomst og faste udgifter.",
  "Se på gæld, opsparing og rådighedsbeløb.",
  "Tænk på bankens risiko og manglende dokumentation.",
];

const FOCUS_GUIDE = [
  "Hvem er kunden, og hvad vil kunden låne til?",
  "Kan kunden realistisk betale lånet hver måned?",
  "Hvad ville banken være mest bekymret for?",
];

const initialOpponents: Opponent[] = [
  { name: "Nordbank", score: 0, lastAction: "Afventer" },
  { name: "Bybanken", score: 0, lastAction: "Afventer" },
  { name: "Tryg Kredit", score: 0, lastAction: "Afventer" },
];

const CASE_POINTS: Record<string, { optionA: number; optionB: number }> = {
  young_couple_home: { optionA: 2, optionB: 1 },
  self_employed_van: { optionA: 2, optionB: 1 },
  debt_consolidation: { optionA: 2, optionB: 1 },
  student_first_home: { optionA: 1, optionB: 2 },
  cafe_startup: { optionA: 1, optionB: 2 },
  energy_renovation: { optionA: 2, optionB: 1 },
  family_car_loan: { optionA: 2, optionB: 1 },
  variable_income_mortgage: { optionA: 1, optionB: 2 },
  overdrawn_customer: { optionA: 1, optionB: 2 },
  divorce_refinance: { optionA: 2, optionB: 1 },
  buy_to_live_condo: { optionA: 2, optionB: 1 },
  guarantor_case: { optionA: 2, optionB: 1 },
};

function saveKey(teamCode: string) {
  return `bank_game_state_${teamCode.toLowerCase()}`;
}

function setupKey(teamCode: string) {
  return `bank_game_team_setup_${teamCode.toLowerCase()}`;
}

function normalizeCase(caseId: string): RuntimeGameCase {
  const source = gameCases[caseId] ?? gameCases[DEFAULT_CASE_ID];

  return {
    id: source.id,
    title: source.title,
    description: source.description,
    theme: source.theme,
    macroQuestion: source.macroQuestion,
    timeLimitSeconds: source.timeLimitSeconds ?? DEFAULT_CASE_TIME,
    hints: source.hints?.length ? source.hints : FALLBACK_HINTS,
    options: [
      {
        id: source.optionA.id,
        title: source.optionA.title,
        text: source.optionA.text,
        next: source.optionA.next,
        feedback: source.optionA.feedback,
        hiddenPoints: CASE_POINTS[source.id]?.optionA ?? 1,
      },
      {
        id: source.optionB.id,
        title: source.optionB.title,
        text: source.optionB.text,
        next: source.optionB.next,
        feedback: source.optionB.feedback,
        hiddenPoints: CASE_POINTS[source.id]?.optionB ?? 1,
      },
    ],
  };
}

function formatTime(totalSeconds: number) {
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes}:${seconds.toString().padStart(2, "0")}`;
}

function includesAny(text: string, words: string[]) {
  return words.some((word) => text.includes(word));
}

function getOverallMeter(score: number) {
  if (score >= 90) return "Meget stærk";
  if (score >= 70) return "Stærk";
  if (score >= 50) return "Fornuftig";
  if (score >= 30) return "Usikker";
  return "Sårbar";
}

function compareToPrevious(currentScore: number, previous?: HistoryEntry | null) {
  if (!previous) {
    return "Det er jeres første svar i spillet.";
  }

  if (currentScore > previous.score) {
    return "Jeres svar er stærkere end sidst.";
  }

  if (currentScore < previous.score) {
    return "Jeres svar er svagere end sidst.";
  }

  return "Jeres svar ligger på samme niveau som sidst.";
}

function buildCritique(reason: string, selectedOption: RuntimeOption): EvalResult {
  const text = reason.toLowerCase();

  const incomeWords = [
    "indkomst",
    "løn",
    "indtægt",
    "fast arbejde",
    "ansættelse",
    "betalingsevne",
    "rådighedsbeløb",
    "budget",
  ];

  const debtWords = [
    "gæld",
    "lån",
    "afdrag",
    "faste udgifter",
    "overtræk",
    "billån",
    "forbrugslån",
    "ydelse",
  ];

  const riskWords = [
    "risiko",
    "sikkerhed",
    "pant",
    "opsparing",
    "udbetaling",
    "kaution",
    "kreditværdighed",
    "stabil",
  ];

  const docWords = [
    "dokumentation",
    "bankudskrift",
    "lønseddel",
    "årsopgørelse",
    "regnskab",
    "bevise",
    "tal",
  ];

  const tradeoffWords = [
    "men",
    "dog",
    "samtidig",
    "ulempe",
    "fordel",
    "på den anden side",
  ];

  const seesIncome = includesAny(text, incomeWords);
  const seesDebt = includesAny(text, debtWords);
  const seesRisk = includesAny(text, riskWords) || includesAny(text, docWords);
  const seesTradeoff = includesAny(text, tradeoffWords);

  const good: string[] = [];
  const missing: string[] = [];
  const whyItMatters: string[] = [];
  const strongerAnswer: string[] = [];

  const choiceScore = Math.max(0, Math.min(2, selectedOption.hiddenPoints));

  let incomeScore = 0;
  let debtScore = 0;
  let riskScore = 0;
  let clarityScore = 0;

  if (seesIncome) {
    incomeScore = 2;
    good.push("I ser på kundens indkomst eller betalingsevne.");
  } else {
    missing.push("I vurderer ikke tydeligt, om kunden faktisk har råd til lånet.");
    whyItMatters.push("Banken ser altid på, om kunden kan betale ydelsen hver måned.");
    strongerAnswer.push(
      "Skriv direkte, om kundens løn og rådighedsbeløb gør lånet realistisk eller ikke realistisk."
    );
  }

  if (seesDebt) {
    debtScore = 2;
    good.push("I inddrager gæld eller faste udgifter.");
  } else {
    missing.push("I overser kundens eksisterende gæld eller faste udgifter.");
    whyItMatters.push("En kunde kan godt have høj løn og stadig være for presset økonomisk.");
    strongerAnswer.push(
      "Skriv, hvordan eksisterende gæld og faste udgifter påvirker bankens vurdering."
    );
  }

  if (seesRisk) {
    riskScore = 2;
    good.push("I nævner risiko, sikkerhed, opsparing eller dokumentation.");
  } else {
    missing.push("I forklarer ikke bankens risiko godt nok.");
    whyItMatters.push("Banken vurderer ikke kun kundens ønske, men også risikoen ved at sige ja.");
    strongerAnswer.push(
      "Skriv, om banken mangler opsparing, sikkerhed eller dokumentation, før den kan godkende lånet."
    );
  }

  if (reason.trim().length >= 180 && seesTradeoff) {
    clarityScore = 2;
    good.push("Jeres forklaring er både tydelig og nuanceret.");
  } else if (reason.trim().length >= 100) {
    clarityScore = 1;
    missing.push("Forklaringen er brugbar, men kunne være mere præcis.");
    strongerAnswer.push(
      "Skriv både hvad der taler for lånet, og hvad der taler imod."
    );
  } else {
    clarityScore = 0;
    missing.push("Svarteksten er for kort eller for løs.");
    whyItMatters.push("Banken skal kunne se en klar begrundelse, ikke kun en hurtig mavefornemmelse.");
    strongerAnswer.push(
      "Skriv kort, men konkret om indkomst, gæld, risiko og bankens beslutning."
    );
  }

  const totalScore = choiceScore + incomeScore + debtScore + riskScore + clarityScore;

  let level = "svagt";
  if (totalScore >= 9) level = "meget stærkt";
  else if (totalScore >= 7) level = "stærkt";
  else if (totalScore >= 5) level = "fornuftigt";
  else if (totalScore >= 3) level = "usikkert";

  if (good.length === 0) {
    good.push("I har taget stilling til sagen, og det er en god start.");
  }

  if (missing.length === 0) {
    missing.push("Der er ikke nogen tydelige mangler i svaret.");
  }

  if (whyItMatters.length === 0) {
    whyItMatters.push("Banken vil altid vurdere både betalingsevne og risiko samlet.");
  }

  if (strongerAnswer.length === 0) {
    strongerAnswer.push(
      "Et stærkt svar siger klart ja, nej eller ja med betingelser og forklarer hvorfor."
    );
  }

  return {
    totalScore,
    level,
    good,
    missing,
    whyItMatters,
    strongerAnswer,
    choiceScore,
    incomeScore,
    debtScore,
    riskScore,
    clarityScore,
  };
}

function buildFinalAssessment(history: HistoryEntry[], finalScore: number, winner: string) {
  const strongRounds = history.filter(
    (item) => item.level === "meget stærkt" || item.level === "stærkt"
  ).length;

  const weakRounds = history.filter(
    (item) => item.level === "svagt" || item.level === "usikkert"
  ).length;

  const avgScore =
    history.length > 0
      ? Math.round(history.reduce((sum, item) => sum + item.score, 0) / history.length)
      : 0;

  let verdict = "";
  if (finalScore >= 90) {
    verdict =
      "I arbejder meget sikkert med bankens måde at tænke på. I ser både betalingsevne, gæld og risiko.";
  } else if (finalScore >= 65) {
    verdict =
      "I har godt styr på flere vigtige dele, men nogle vurderinger bliver stadig for hurtige eller for lidt begrundede.";
  } else {
    verdict =
      "I mangler stadig at tænke mere som banken. Især betalingsevne, risiko og dokumentation skal stå tydeligere i svarene.";
  }

  const summary =
    winner === "Jer"
      ? "I vinder spillet. Jeres samlede vurderinger var stærkest."
      : `Vinderen blev ${winner}. Jeres hold skal være endnu skarpere i kreditvurderingen.`;

  return {
    strongRounds,
    weakRounds,
    avgScore,
    verdict,
    summary,
  };
}

export default function TeamPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const teamCode = String(params?.id ?? "hold01").toLowerCase();

  const [isHydrated, setIsHydrated] = useState(false);
  const [setup, setSetup] = useState<TeamSetup | null>(null);

  const [currentCase, setCurrentCase] = useState<RuntimeGameCase>(
    normalizeCase(DEFAULT_CASE_ID)
  );
  const [selectedChoice, setSelectedChoice] = useState("");
  const [reason, setReason] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [feedback, setFeedback] = useState("");
  const [history, setHistory] = useState<HistoryEntry[]>([]);
  const [secondsLeft, setSecondsLeft] = useState(DEFAULT_CASE_TIME);
  const [teamScore, setTeamScore] = useState(0);
  const [overallMeter, setOverallMeter] = useState("Fornuftig");
  const [opponents, setOpponents] = useState<Opponent[]>(initialOpponents);
  const [showModal, setShowModal] = useState(false);
  const [modalTitle, setModalTitle] = useState("");
  const [modalBody, setModalBody] = useState("");
  const [nextCasePending, setNextCasePending] = useState<RuntimeGameCase | null>(null);
  const [round, setRound] = useState(1);
  const [gameFinished, setGameFinished] = useState(false);
  const [revealedHints, setRevealedHints] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [lastSavedAt, setLastSavedAt] = useState<string>("");

  const safeHints = useMemo(() => {
    return currentCase.hints?.length ? currentCase.hints : FALLBACK_HINTS;
  }, [currentCase.hints]);

  const selectedOption = useMemo(
    () => currentCase.options.find((option) => option.id === selectedChoice),
    [currentCase, selectedChoice]
  );

  useEffect(() => {
    const rawSetup =
      localStorage.getItem(setupKey(teamCode)) ||
      localStorage.getItem("bank_game_team_setup") ||
      localStorage.getItem("macro_game_team_setup");

    if (rawSetup) {
      try {
        setSetup(JSON.parse(rawSetup));
      } catch {
        setSetup(null);
      }
    }

    const rawSavedState = localStorage.getItem(saveKey(teamCode));

    if (rawSavedState) {
      try {
        const parsed: SavedGameState = JSON.parse(rawSavedState);

        setRound(parsed.round);
        setCurrentCase(normalizeCase(parsed.currentCaseId));
        setSelectedChoice(parsed.selectedChoice);
        setReason(parsed.reason);
        setSubmitted(parsed.submitted);
        setFeedback(parsed.feedback);
        setHistory(parsed.history ?? []);
        setSecondsLeft(parsed.secondsLeft);
        setTeamScore(parsed.teamScore);
        setOverallMeter(parsed.overallMeter);
        setOpponents(parsed.opponents ?? initialOpponents);
        setShowModal(parsed.showModal);
        setModalTitle(parsed.modalTitle);
        setModalBody(parsed.modalBody);
        setGameFinished(parsed.gameFinished);
        setRevealedHints(parsed.revealedHints ?? 0);
        setIsPaused(parsed.isPaused ?? false);
        setLastSavedAt(parsed.savedAt ?? "");

        if (parsed.nextCasePendingId) {
          setNextCasePending(normalizeCase(parsed.nextCasePendingId));
        }
      } catch {
        localStorage.removeItem(saveKey(teamCode));
      }
    }

    setIsHydrated(true);
  }, [teamCode]);

  useEffect(() => {
    if (!isHydrated) return;
    if (isPaused || showModal || gameFinished || submitted) return;

    const timer = setInterval(() => {
      setSecondsLeft((prev) => (prev <= 1 ? 0 : prev - 1));
    }, 1000);

    return () => clearInterval(timer);
  }, [isHydrated, isPaused, showModal, gameFinished, submitted]);

  useEffect(() => {
    if (!isHydrated) return;

    const payload: SavedGameState = {
      round,
      currentCaseId: currentCase.id,
      selectedChoice,
      reason,
      submitted,
      feedback,
      history,
      secondsLeft,
      teamScore,
      overallMeter,
      opponents,
      showModal,
      modalTitle,
      modalBody,
      nextCasePendingId: nextCasePending?.id ?? null,
      gameFinished,
      revealedHints,
      isPaused,
      savedAt: new Date().toLocaleTimeString("da-DK", {
        hour: "2-digit",
        minute: "2-digit",
      }),
    };

    localStorage.setItem(saveKey(teamCode), JSON.stringify(payload));
    localStorage.setItem("bank_game_last_team_code", teamCode);
    setLastSavedAt(payload.savedAt);
  }, [
    isHydrated,
    round,
    currentCase.id,
    selectedChoice,
    reason,
    submitted,
    feedback,
    history,
    secondsLeft,
    teamScore,
    overallMeter,
    opponents,
    showModal,
    modalTitle,
    modalBody,
    nextCasePending?.id,
    gameFinished,
    revealedHints,
    isPaused,
    teamCode,
  ]);

  useEffect(() => {
    function handleEscape(event: KeyboardEvent) {
      if (event.key === "Escape" && showModal) {
        continueAfterModal();
        return;
      }

      if (event.key === "Escape" && !showModal && !gameFinished) {
        setIsPaused((prev) => !prev);
      }
    }

    window.addEventListener("keydown", handleEscape);
    return () => window.removeEventListener("keydown", handleEscape);
  });

  useEffect(() => {
    if (secondsLeft === 0 && !submitted && !gameFinished && !showModal && !isPaused) {
      handleTimeout();
    }
  }, [secondsLeft, submitted, gameFinished, showModal, isPaused]);

  function updateOpponents() {
    setOpponents((prev) =>
      prev
        .map((team) => ({
          ...team,
          score: Math.max(0, Math.min(120, team.score + Math.floor(Math.random() * 4))),
          lastAction: [
            "Bad om flere dokumenter",
            "Godkendte med betingelser",
            "Afviste lånet",
            "Bad kunden vente",
          ][Math.floor(Math.random() * 4)],
        }))
        .sort((a, b) => b.score - a.score)
    );
  }

  function handleTimeout() {
    const penalty = 0;
    const nextCase = normalizeCase(currentCase.options[0]?.next || DEFAULT_CASE_ID);

    setHistory((prev) => [
      ...prev,
      {
        round,
        caseId: currentCase.id,
        caseTitle: currentCase.title,
        optionTitle: "Intet svar",
        reason: "",
        level: "timeout",
        score: penalty,
      },
    ]);

    setTeamScore((prev) => {
      const next = prev + penalty;
      setOverallMeter(getOverallMeter(next));
      return next;
    });

    setModalTitle("Evaluering af jeres svar");
    setModalBody(
      "Vurdering: I nåede ikke at svare.\n\nDet betyder: Banken fik ikke en brugbar vurdering fra jer.\n\nHvorfor det er vigtigt: I et kundemøde skal rådgiveren kunne tage stilling og begrunde det.\n\nSådan bliver I stærkere: Skriv et kort svar med beslutning, betalingsevne, gæld og risiko."
    );

    setShowModal(true);
    setSubmitted(true);
    setSelectedChoice("");
    setReason("");
    setNextCasePending(nextCase);
  }

  function continueAfterModal() {
    if (round >= TOTAL_ROUNDS) {
      setGameFinished(true);
      setShowModal(false);
      setSubmitted(false);
      return;
    }

    if (nextCasePending) {
      setCurrentCase(nextCasePending);
      setRound((prev) => prev + 1);
      updateOpponents();
    }

    setShowModal(false);
    setSubmitted(false);
    setFeedback("");
    setNextCasePending(null);
    setSelectedChoice("");
    setReason("");
    setRevealedHints(0);
    setIsPaused(false);
    setSecondsLeft(nextCasePending?.timeLimitSeconds ?? DEFAULT_CASE_TIME);
  }

  function handleStartOver() {
    localStorage.removeItem(saveKey(teamCode));
    setCurrentCase(normalizeCase(DEFAULT_CASE_ID));
    setSelectedChoice("");
    setReason("");
    setSubmitted(false);
    setFeedback("");
    setHistory([]);
    setSecondsLeft(DEFAULT_CASE_TIME);
    setTeamScore(0);
    setOverallMeter("Fornuftig");
    setOpponents(initialOpponents);
    setShowModal(false);
    setModalTitle("");
    setModalBody("");
    setNextCasePending(null);
    setRound(1);
    setGameFinished(false);
    setRevealedHints(0);
    setIsPaused(false);
    setLastSavedAt("");
  }

  function handleSubmit() {
    if (!selectedOption || !reason.trim() || isPaused || showModal) return;

    const critique = buildCritique(reason, selectedOption);
    const previous = history.length > 0 ? history[history.length - 1] : null;
    const compareText = compareToPrevious(critique.totalScore, previous);
    const nextCase = normalizeCase(selectedOption.next);

    setHistory((prev) => [
      ...prev,
      {
        round,
        caseId: currentCase.id,
        caseTitle: currentCase.title,
        optionTitle: selectedOption.title,
        reason,
        level: critique.level,
        score: critique.totalScore,
      },
    ]);

    setTeamScore((prev) => {
      const next = prev + critique.totalScore;
      setOverallMeter(getOverallMeter(next));
      return next;
    });

    setFeedback(`Jeres svar er gemt. Næste kundemøde er klar.`);
    setModalTitle("Evaluering af jeres svar");
    setModalBody(
      `Vurdering: ${critique.level}.\n\nDet gjorde I godt:\n- ${critique.good.join("\n- ")}\n\nDet mangler i svaret:\n- ${critique.missing.join("\n- ")}\n\nHvorfor det betyder noget for banken:\n- ${critique.whyItMatters.join("\n- ")}\n\nSådan kunne et stærkere svar lyde:\n- ${critique.strongerAnswer.join("\n- ")}\n\nMakrofeedback på valget:\n${selectedOption.feedback}\n\nSammenligning:\n${compareText}\n\nPoint:\n- Beslutning: ${critique.choiceScore}/2\n- Indkomst og betalingsevne: ${critique.incomeScore}/2\n- Gæld og faste udgifter: ${critique.debtScore}/2\n- Risiko, sikkerhed og dokumentation: ${critique.riskScore}/2\n- Klar forklaring: ${critique.clarityScore}/2\n\nSlutscore denne runde: ${critique.totalScore}/10`
    );

    setShowModal(true);
    setSubmitted(true);
    setSelectedChoice("");
    setReason("");
    setNextCasePending(nextCase);
  }

  const leaderboard = [
    ...opponents,
    {
      name: setup?.teamName || "Jer",
      score: teamScore,
      lastAction: selectedOption?.title ?? "Afventer",
    },
  ].sort((a, b) => b.score - a.score);

  const winner = leaderboard[0]?.name ?? "Jer";
  const finalAssessment = buildFinalAssessment(history, teamScore, winner);

  if (!isHydrated) {
    return (
      <main className="min-h-screen bg-slate-950 p-8 text-white">
        <div className="mx-auto max-w-3xl rounded-3xl border border-slate-800 bg-slate-900/80 p-8">
          Indlæser spil...
        </div>
      </main>
    );
  }

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
              </div>
            </div>

            <div className="rounded-3xl border border-slate-700 bg-slate-900/80 p-6 shadow-2xl">
              <h2 className="mb-4 text-2xl font-semibold">Samlet vurdering</h2>
              <p className="leading-8 text-slate-300">{finalAssessment.verdict}</p>
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

          <div className="flex gap-3">
            <button
              type="button"
              onClick={handleStartOver}
              className="rounded-2xl border border-slate-700 px-5 py-3 font-semibold text-slate-200 hover:bg-slate-800"
            >
              Start forfra
            </button>
            <button
              type="button"
              onClick={() => router.push("/")}
              className="rounded-2xl bg-amber-400 px-5 py-3 font-semibold text-slate-950 hover:bg-amber-300"
            >
              Til forsiden
            </button>
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
              Timeren er stoppet. Jeres tekst og score bliver gemt automatisk.
            </p>

            <div className="mt-6 flex justify-end">
              <button
                type="button"
                onClick={() => setIsPaused(false)}
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
                Bankspil
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
                onClick={() => setIsPaused((prev) => !prev)}
                disabled={showModal || gameFinished}
                className="rounded-2xl border border-amber-500 px-4 py-3 font-semibold text-amber-300 hover:bg-amber-500/10 disabled:opacity-40"
              >
                {isPaused ? "Fortsæt" : "Pause"}
              </button>
            </div>
          </div>

          <div className="mb-4 flex flex-wrap gap-3">
            <div className="rounded-2xl border border-emerald-700 bg-emerald-950/20 px-4 py-3 text-sm text-emerald-200">
              Gemt automatisk {lastSavedAt ? `kl. ${lastSavedAt}` : ""}
            </div>
            <button
              type="button"
              onClick={handleStartOver}
              className="rounded-2xl border border-slate-700 px-4 py-3 text-sm font-semibold text-slate-200 hover:bg-slate-800"
            >
              Start forfra
            </button>
            <button
              type="button"
              onClick={() => router.push("/")}
              className="rounded-2xl border border-slate-700 px-4 py-3 text-sm font-semibold text-slate-200 hover:bg-slate-800"
            >
              Til forsiden
            </button>
          </div>

          <p className="mb-4 text-slate-300">
            I sidder i et kundemøde i banken. I skal tage stilling til, om kunden bør få lånet,
            få afslag eller få ja med betingelser.
          </p>

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
            <div className="mb-2 flex items-center justify-between gap-3">
              <div className="text-xs uppercase tracking-widest text-amber-400">
                Tema: {currentCase.theme}
              </div>
              <div className="text-xs uppercase tracking-widest text-slate-400">
                Kundemøde
              </div>
            </div>
            <h2 className="mb-2 text-2xl font-semibold">{currentCase.title}</h2>
            <p className="mb-4 leading-8 text-slate-300">{currentCase.description}</p>

            <div className="rounded-2xl border border-amber-700/50 bg-amber-950/20 p-4">
              <div className="mb-2 text-xs uppercase tracking-widest text-amber-300">
                Opgave
              </div>
              <p className="leading-8 text-slate-100">{currentCase.macroQuestion}</p>
            </div>
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
              <p className="text-slate-400">Brug hints, hvis I går i stå. De vises ét ad gangen.</p>
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
            <h2 className="mb-4 text-xl font-semibold">Begrund jeres beslutning</h2>
            <textarea
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              disabled={isPaused}
              className="min-h-40 w-full rounded-3xl border border-slate-700 bg-slate-950/80 p-4 text-white disabled:opacity-50"
              placeholder="Skriv om indkomst, rådighedsbeløb, gæld, risiko, sikkerhed og dokumentation."
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
            <p className="mt-2 text-sm text-slate-400">10 point pr. runde</p>
          </div>

          <div className="rounded-3xl border border-slate-700 bg-slate-900/80 p-6 shadow-2xl">
            <h2 className="mb-3 text-xl font-semibold">Sådan gives point</h2>
            <div className="space-y-2 text-sm text-slate-300">
              <p>2 point for rimelig beslutning</p>
              <p>2 point for indkomst og betalingsevne</p>
              <p>2 point for gæld og faste udgifter</p>
              <p>2 point for risiko, sikkerhed eller dokumentation</p>
              <p>2 point for klar forklaring</p>
            </div>
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
                    {item.caseTitle} • {item.optionTitle} • {item.level} • {item.score} point
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