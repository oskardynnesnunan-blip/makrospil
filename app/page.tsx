"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function HomePage() {
  const router = useRouter();
  const [code, setCode] = useState("");
  const [teamName, setTeamName] = useState("");
  const [member1, setMember1] = useState("");
  const [member2, setMember2] = useState("");
  const [member3, setMember3] = useState("");
  const [member4, setMember4] = useState("");
  const [error, setError] = useState("");

  function handleStart() {
    const trimmedCode = code.trim().toLowerCase();
    const trimmedTeamName = teamName.trim();

    if (!trimmedCode) {
      setError("Skriv en kode for at starte.");
      return;
    }

    if (trimmedCode !== "lærer123" && !trimmedTeamName) {
      setError("Skriv et holdnavn.");
      return;
    }

    const members = [member1, member2, member3, member4]
      .map((m) => m.trim())
      .filter(Boolean);

    if (trimmedCode !== "lærer123" && members.length === 0) {
      setError("Skriv mindst ét gruppemedlem.");
      return;
    }

    localStorage.setItem(
      "macro_game_team_setup",
      JSON.stringify({
        code: trimmedCode,
        teamName: trimmedTeamName || "Ukendt hold",
        members,
        startedAt: new Date().toISOString(),
      })
    );

    if (trimmedCode === "lærer123") {
      router.push("/teacher");
      return;
    }

    const validTeamCodes = ["usa01", "eu01", "kina01", "norden01"];
    const finalCode = validTeamCodes.includes(trimmedCode) ? trimmedCode : "usa01";

    router.push(`/team/${finalCode}`);
  }

  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top,_rgba(180,140,40,0.18),_transparent_28%),linear-gradient(180deg,_#09111f_0%,_#0b1324_40%,_#050913_100%)] text-white px-6 py-10">
      <div className="max-w-6xl mx-auto grid lg:grid-cols-2 gap-8 items-start">
        <section className="rounded-3xl border border-slate-700 bg-slate-900/80 backdrop-blur p-8 shadow-2xl">
          <div className="text-xs uppercase tracking-[0.3em] text-amber-300 mb-3">
            Makrospil • Krisestyring • 180 minutter
          </div>
          <h1 className="text-5xl font-bold leading-tight mb-4">
            Verdensøkonomien
            <br />
            brænder
          </h1>
          <p className="text-slate-300 text-lg leading-8 mb-6">
            I er et økonomisk beslutningsteam midt i en verden med inflation, renter,
            geopolitik, handelskriser og dagsaktuelle nyheder. I skal vælge under pres,
            argumentere fagligt og leve med konsekvenserne.
          </p>

          <div className="grid gap-4 sm:grid-cols-2 mb-6">
            <div className="rounded-2xl border border-slate-800 bg-slate-950/70 p-4">
              <div className="text-amber-300 font-semibold mb-1">Spilletid</div>
              <div className="text-slate-300">180 minutter</div>
            </div>
            <div className="rounded-2xl border border-slate-800 bg-slate-950/70 p-4">
<div className="text-amber-300 font-semibold mb-1">Tid pr. runde</div>
<div className="text-slate-300">8 min</div>            </div>
            <div className="rounded-2xl border border-slate-800 bg-slate-950/70 p-4">
              <div className="text-amber-300 font-semibold mb-1">Mål</div>
              <div className="text-slate-300">Vind over de andre hold</div>
            </div>
            <div className="rounded-2xl border border-slate-800 bg-slate-950/70 p-4">
              <div className="text-amber-300 font-semibold mb-1">Vurdering</div>
              <div className="text-slate-300">Valg + faglig begrundelse</div>
            </div>
          </div>

          <div className="rounded-2xl border border-slate-800 bg-slate-950/70 p-5">
            <h2 className="text-xl font-semibold mb-3">Sådan fungerer det</h2>
            <div className="space-y-2 text-slate-300">
              <p>1. I får en case med et makroøkonomisk dilemma.</p>
              <p>2. I vælger en strategi og begrunder den fagligt.</p>
              <p>3. Systemet vurderer både valget og kvaliteten af jeres begrundelse.</p>
              <p>4. Dagsaktuelle nyheder bliver aktivt brugt som ekstra cases.</p>
              <p>5. Når alle runder er færdige, kårer systemet en vinder og vurderer jeres finansminister-profil.</p>
            </div>
          </div>
        </section>

        <section className="rounded-3xl border border-slate-700 bg-slate-900/80 backdrop-blur p-8 shadow-2xl">
          <h2 className="text-2xl font-bold mb-5">Start spillet</h2>

          <div className="space-y-4">
            <div>
              <label className="block text-sm text-slate-300 mb-2">Kode</label>
              <input
                value={code}
                onChange={(e) => setCode(e.target.value)}
                className="w-full rounded-2xl border border-slate-700 bg-slate-950/80 px-4 py-3 text-white"
                placeholder="fx usa01 eller lærer123"
              />
              <div className="text-xs text-slate-500 mt-2">
                Testkoder: lærer123, usa01, eu01, kina01, norden01
              </div>
            </div>

            <div>
              <label className="block text-sm text-slate-300 mb-2">Holdnavn</label>
              <input
                value={teamName}
                onChange={(e) => setTeamName(e.target.value)}
                className="w-full rounded-2xl border border-slate-700 bg-slate-950/80 px-4 py-3 text-white"
                placeholder="fx Team Nationalbank"
              />
            </div>

            <div className="rounded-2xl border border-slate-800 bg-slate-950/70 p-4">
              <div className="text-sm font-semibold text-amber-300 mb-3">Hvad hedder medlemmerne i gruppen?</div>
              <div className="grid gap-3">
                <input
                  value={member1}
                  onChange={(e) => setMember1(e.target.value)}
                  className="w-full rounded-2xl border border-slate-700 bg-slate-950/80 px-4 py-3 text-white"
                  placeholder="Medlem 1"
                />
                <input
                  value={member2}
                  onChange={(e) => setMember2(e.target.value)}
                  className="w-full rounded-2xl border border-slate-700 bg-slate-950/80 px-4 py-3 text-white"
                  placeholder="Medlem 2"
                />
                <input
                  value={member3}
                  onChange={(e) => setMember3(e.target.value)}
                  className="w-full rounded-2xl border border-slate-700 bg-slate-950/80 px-4 py-3 text-white"
                  placeholder="Medlem 3"
                />
                <input
                  value={member4}
                  onChange={(e) => setMember4(e.target.value)}
                  className="w-full rounded-2xl border border-slate-700 bg-slate-950/80 px-4 py-3 text-white"
                  placeholder="Medlem 4"
                />
              </div>
            </div>

            {error && (
              <div className="rounded-2xl border border-red-700 bg-red-950/30 px-4 py-3 text-red-200">
                {error}
              </div>
            )}

            <button
              onClick={handleStart}
              className="w-full rounded-2xl bg-amber-400 px-6 py-4 font-semibold text-slate-950 hover:bg-amber-300"
            >
              Start spillet
            </button>
          </div>
        </section>
      </div>
    </main>
  );
}