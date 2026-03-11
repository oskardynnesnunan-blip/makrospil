export default function TeacherPage() {
  const teams = [
    { name: "USA", score: 64, status: "Presset", choice: "Hæv renten" },
    { name: "EU", score: 61, status: "Sårbar", choice: "Stimuler økonomien" },
    { name: "Kina", score: 70, status: "Stabil", choice: "Hæv renten" },
    { name: "Norden", score: 73, status: "Stabil", choice: "Stimuler økonomien" },
  ];

  return (
    <main className="min-h-screen bg-slate-950 text-white p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold mb-4">Underviseroversigt</h1>
        <p className="text-slate-400 mb-8">
          Her kan du følge holdenes status, valg og foreløbige score.
        </p>

        <div className="grid md:grid-cols-2 xl:grid-cols-4 gap-4 mb-8">
          {teams.map((team) => (
            <div
              key={team.name}
              className="rounded-2xl border border-slate-800 bg-slate-900 p-6"
            >
              <h2 className="text-2xl font-semibold mb-3">{team.name}</h2>
              <p className="text-slate-400 mb-1">Score: {team.score}</p>
              <p className="text-slate-400 mb-1">Status: {team.status}</p>
              <p className="text-slate-400">Seneste valg: {team.choice}</p>
            </div>
          ))}
        </div>

        <div className="grid md:grid-cols-3 gap-4">
          <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
            <h2 className="text-xl font-semibold mb-2">Live feed</h2>
            <p className="text-slate-400 mb-2">USA valgte at hæve renten.</p>
            <p className="text-slate-400 mb-2">EU valgte at stimulere økonomien.</p>
            <p className="text-slate-400">Næste globale chok nærmer sig.</p>
          </div>

          <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
            <h2 className="text-xl font-semibold mb-2">Rangliste</h2>
            <p className="text-slate-400 mb-2">1. Norden</p>
            <p className="text-slate-400 mb-2">2. Kina</p>
            <p className="text-slate-400 mb-2">3. USA</p>
            <p className="text-slate-400">4. EU</p>
          </div>

          <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
            <h2 className="text-xl font-semibold mb-2">Næste case</h2>
            <p className="text-slate-400">
              Oliepriserne stiger. Holdene skal vælge mellem subsidier,
              renteforhøjelser eller strategiske reserver.
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}