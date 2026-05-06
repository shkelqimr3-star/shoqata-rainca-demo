import type { Lang, PublicData } from "@/lib/types";

type MembershipStat = PublicData["membershipStats"][number];

type ChartRow = MembershipStat & {
  percentChange: number | null;
};

function tx(lang: Lang, sq: string, de: string) {
  return lang === "de" ? de : sq;
}

function formatPercent(value: number) {
  const sign = value > 0 ? "+" : "";
  return `${sign}${value.toFixed(1)}%`;
}

function formatDate(value: string | null | undefined, lang: Lang) {
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  return new Intl.DateTimeFormat(lang === "de" ? "de-CH" : "sq-AL", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric"
  }).format(date);
}

function buildRows(stats: MembershipStat[]) {
  let previousClosed: MembershipStat | null = null;
  return [...stats]
    .sort((a, b) => a.year - b.year)
    .map((stat): ChartRow => {
      const isClosed = stat.status === "closed";
      const percentChange = isClosed && previousClosed
        ? ((stat.memberCount - previousClosed.memberCount) / previousClosed.memberCount) * 100
        : null;

      if (isClosed) previousClosed = stat;
      return { ...stat, percentChange };
    });
}

export function MembershipStatsChart({ stats, lang }: { stats: MembershipStat[]; lang: Lang }) {
  const rows = buildRows(stats);
  if (!rows.length) return null;

  const maxMembers = Math.max(...rows.map((stat) => stat.memberCount), 1);

  return (
    <section className="mt-6 rounded-lg border border-ink/10 bg-white p-5 shadow-sm">
      <div className="mb-5 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h4 className="text-xl font-black text-ink">{tx(lang, "Zhvillimi sipas viteve", "Entwicklung nach Jahren")}</h4>
          <p className="mt-1 text-sm font-semibold text-ink/60">
            {tx(lang, "Të dhënat publikohen nga administrimi.", "Die Daten werden im Adminbereich veröffentlicht.")}
          </p>
        </div>
      </div>

      <div className="space-y-4">
        {rows.map((stat) => {
          const inProgress = stat.status === "in_progress";
          const updated = formatDate(stat.dateUpdated, lang);
          const changeClass =
            stat.percentChange === null
              ? "bg-ink/5 text-ink/55"
              : stat.percentChange >= 0
                ? "bg-pine/10 text-pine"
                : "bg-ember/10 text-ember";

          return (
            <div key={stat.id} className="grid gap-2 md:grid-cols-[4rem_1fr_12rem] md:items-center">
              <div className="text-sm font-black text-ink/70">{stat.year}</div>
              <div>
                <div className="mb-1 flex items-center justify-between gap-3 text-sm">
                  <span className="font-black text-ink">{stat.memberCount}</span>
                  <span className="font-semibold text-ink/55">{tx(lang, "anëtarë", "Mitglieder")}</span>
                </div>
                <div className="h-3 overflow-hidden rounded-full bg-ink/10">
                  <div
                    className={`h-full rounded-full ${inProgress ? "bg-gold" : "bg-pine"}`}
                    style={{ width: `${Math.max(6, (stat.memberCount / maxMembers) * 100)}%` }}
                  />
                </div>
              </div>
              <div className={`rounded-md px-3 py-2 text-sm font-black ${changeClass}`}>
                {inProgress ? (
                  <span>
                    {tx(lang, "Në progres", "In Bearbeitung")}
                    {updated ? <span className="block text-xs font-bold opacity-75">{tx(lang, "Përditësuar", "Aktualisiert")}: {updated}</span> : null}
                  </span>
                ) : stat.percentChange === null ? (
                  <span>{tx(lang, "Viti bazë", "Basisjahr")}</span>
                ) : (
                  <span>{formatPercent(stat.percentChange)}</span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
