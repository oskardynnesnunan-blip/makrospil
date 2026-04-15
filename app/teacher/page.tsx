"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

type TeamSetup = {
  code: string;
  teamName: string;
  members: string[];
  startedAt: string;
};

function setupKey(teamCode: string) {
  return `bank_game_team_setup_${teamCode.toLowerCase()}`;
}

export default function HomePage() {
  const router = useRouter();

  const [teamCode, setTeamCode] = useState("hold01");
  const [teamName, setTeamName] = useState("Team Kredit");
  const [membersText, setMembersText] = useState("Medlem 1\nMedlem 2");
  const [lastTeamCode, setLastTeamCode] = useState("");

  useEffect(() => {
    const savedLastTeamCode = localStorage.getItem("bank_game_last_team_code");
    if (savedLastTeamCode) {
      setLastTeamCode(savedLastTeamCode);
    }
  }, []);

  function handleStartGame() {
    const cleanCode = teamCode.trim().toLowerCase() || "hold01";
    const cleanName = teamName.trim() || cleanCode.toUpperCase();
    const members = membersText
      .split("\n")
      .map((item) => item.trim())
      .filter(Boolean);

    const payload: TeamSetup = {
      code: cleanCode,
      teamName: cleanName,
      members,
      startedAt: new Date().toISOString(),
    };

    localStorage.setItem(setupKey(cleanCode), JSON.stringify(payload));
    localStorage.setItem("bank_game_team_setup", JSON.stringify(payload));
    localStorage.setItem("bank_game_last_team_code", cleanCode);

    router.push(`/team/${cleanCode}`);
  }

  function handleContinueLastGame() {
    if (!lastTeamCode) return;
    router.push(`/team/${lastTeamCode}`);
  }

  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top,_rgba(180,140,40,0.18),_transparent_30%),linear-gradient(180deg,_#09111f_0%,_#0b1324_35%,_#050913_100%)] p-8 text-white">
      <div className="mx-auto max-w-6xl">
        <div className="grid gap-8 lg:grid-cols-2">
          <section className="rounded-3xl border border-amber-700 bg-slate-900/90 p-8 shadow-2xl">
            <div className="mb-3 text-xs uppercase tracking-[0.3em] text-amber-300">
              Bankspil • Kreditvurdering
            </div>
            <h1 className="mb-6 text-5xl font-bold">Kan kunden få lånet?</h1>
            <p className="mb-6 leading-8 text-slate-300">
              I er bankrådgivere i en række kundemøder. I skal vurdere, om banken bør sige ja,
              nej eller ja med betingelser. I skal forklare jeres beslutning klart og bruge
              bankens måde at tænke på.
            </p>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="rounded-2xl border border-slate-800 bg-slate-950/70 p-4">
                <div className="mb-2 text-sm font-semibold text-amber-300">Spilletid</div>
                <div className="text-slate-300">8 min pr. case</div>
              </div>

              <div className="rounded-2xl border border-slate-800 bg-slate-950/70 p-4">
                <div className="mb-2 text-sm font-semibold text-amber-300">Fokus</div>
                <div className="text-slate-300">Lån, risiko og dokumentation</div>
              </div>

              <div className="rounded-2xl border border-slate-800 bg-slate-950/70 p-4">
                <div className="mb-2 text-sm font-semibold text-amber-300">Point</div>
                <div className="text-slate-300">10 point pr. runde</div>
              </div>

              <div className="rounded-2xl border border-slate-800 bg-slate-950/70 p-4">
                <div className="mb-2 text-sm font-semibold text-amber-300">Autosave</div>
                <div className="text-slate-300">Spillet gemmes automatisk</div>
              </div>
            </div>

            <div className="mt-8 rounded-2xl border border-slate-800 bg-slate-950/70 p-5">
              <div className="mb-3 text-sm font-semibold text-amber-300">Sådan fungerer det</div>
              <div className="space-y-2 text-sm text-slate-300">
                <p>1. I læser kundens situation.</p>
                <p>2. I vælger bankens beslutning.</p>
                <p>3. I begrunder den med økonomi og risiko.</p>
                <p>4. I får helt tydelig feedback og point.</p>
              </div>
            </div>
          </section>

          <section className="rounded-3xl border border-slate-700 bg-slate-900/80 p-8 shadow-2xl">
            <h2 className="mb-6 text-2xl font-semibold">Start spillet</h2>

            <div className="space-y-5">
              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-200">Kode</label>
                <input
                  value={teamCode}
                  onChange={(e) => setTeamCode(e.target.value)}
                  className="w-full rounded-2xl border border-slate-700 bg-slate-950/80 px-4 py-3 text-white"
                  placeholder="fx hold01"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-200">Holdnavn</label>
                <input
                  value={teamName}
                  onChange={(e) => setTeamName(e.target.value)}
                  className="w-full rounded-2xl border border-slate-700 bg-slate-950/80 px-4 py-3 text-white"
                  placeholder="fx Team Kredit"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-200">
                  Holdmedlemmer
                </label>
                <textarea
                  value={membersText}
                  onChange={(e) => setMembersText(e.target.value)}
                  className="min-h-36 w-full rounded-2xl border border-slate-700 bg-slate-950/80 px-4 py-3 text-white"
                  placeholder={"Ét navn pr. linje"}
                />
              </div>

              <div className="flex flex-wrap gap-3">
                <button
                  type="button"
                  onClick={handleStartGame}
                  className="rounded-2xl bg-amber-400 px-6 py-3 font-semibold text-slate-950 hover:bg-amber-300"
                >
                  Start spillet
                </button>

                {lastTeamCode && (
                  <button
                    type="button"
                    onClick={handleContinueLastGame}
                    className="rounded-2xl border border-slate-700 px-6 py-3 font-semibold text-slate-200 hover:bg-slate-800"
                  >
                    Fortsæt gemt spil
                  </button>
                )}
              </div>

              {lastTeamCode && (
                <p className="text-sm text-slate-400">
                  Sidst brugte holdkode: {lastTeamCode}
                </p>
              )}
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}