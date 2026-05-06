import type { Lang, PublicData } from "@/lib/types";

type MembershipStat = PublicData["membershipStats"][number];

type ChartRow = MembershipStat & {
  percentChange: number | null;
};

function tx(lang: Lang, sq: string, de: string) {
  return lang === "de" ? de : sq;
}

function formatPercent(value: number | null) {
  if (value === null) return "-";
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

function statText(stat: MembershipStat, lang: Lang) {
  const inProgress = stat.status === "in_progress";
  if (lang === "de") return `${stat.memberCount} Mitglieder ${inProgress ? "bisher" : "insgesamt"}`;
  return `${stat.memberCount} anëtarë ${inProgress ? "deri tani" : "gjithsej"}`;
}

function changeClass(value: number | null) {
  if (value === null) return "bg-ink/5 text-ink/55";
  return value >= 0 ? "bg-pine/10 text-pine" : "bg-ember/10 text-ember";
}

export function MembershipStatsChart({ stats, lang }: { stats: MembershipStat[]; lang: Lang }) {
  const rows = buildRows(stats);
  if (!rows.length) return null;

  const closedRows = rows.filter((stat) => stat.status === "closed");
  const inProgressRows = rows.filter((stat) => stat.status === "in_progress");
  const latestClosed = closedRows.at(-1) ?? null;
  const currentInProgress = inProgressRows.at(-1) ?? null;
  const highest = rows.reduce((best, stat) => (stat.memberCount > best.memberCount ? stat : best), rows[0]);
  const lastClosedChange = [...closedRows].reverse().find((stat) => stat.percentChange !== null) ?? null;
  const chartRows = rows.slice(-6);
  const maxMembers = Math.max(...chartRows.map((stat) => stat.memberCount), 1);

  return (
    <section className="mt-5">
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <SummaryCard
          label={tx(lang, "Viti i fundit i mbyllur", "Letztes abgeschlossenes Jahr")}
          value={latestClosed ? statText(latestClosed, lang) : "-"}
          meta={latestClosed ? String(latestClosed.year) : ""}
        />
        <SummaryCard
          label={tx(lang, "Viti aktual", "Aktuelles Jahr")}
          value={currentInProgress ? statText(currentInProgress, lang) : tx(lang, "Nuk ka vit në progres", "Kein Jahr in Bearbeitung")}
          meta={currentInProgress ? `${currentInProgress.year}${currentInProgress.dateUpdated ? ` · ${formatDate(currentInProgress.dateUpdated, lang)}` : ""}` : ""}
        />
        <SummaryCard
          label={tx(lang, "Viti me më shumë anëtarë", "Höchster Mitgliederstand")}
          value={statText(highest, lang)}
          meta={String(highest.year)}
        />
        <SummaryCard
          label={tx(lang, "Ndryshimi i fundit", "Letzte Veränderung")}
          value={lastClosedChange ? formatPercent(lastClosedChange.percentChange) : "-"}
          meta={lastClosedChange ? tx(lang, `krahasuar me vitin paraprak · ${lastClosedChange.year}`, `gegenüber Vorjahr · ${lastClosedChange.year}`) : ""}
          tone={lastClosedChange?.percentChange ?? null}
        />
      </div>

      <div className="mt-5 rounded-lg border border-ink/10 bg-ink/[0.02] p-4">
        <div className="mb-4">
          <h4 className="text-lg font-black text-ink">{tx(lang, "Zhvillimi i fundit", "Aktuelle Entwicklung")}</h4>
          <p className="mt-1 text-sm font-semibold text-ink/60">
            {tx(lang, "Shfaqen deri në 6 vitet e fundit të publikuara.", "Es werden bis zu 6 zuletzt veröffentlichte Jahre angezeigt.")}
          </p>
        </div>
        <div className="space-y-3">
          {chartRows.map((stat) => {
            const inProgress = stat.status === "in_progress";
            const updated = formatDate(stat.dateUpdated, lang);
            return (
              <div key={stat.id} className="grid gap-2 md:grid-cols-[4rem_1fr_11rem] md:items-center">
                <div className="text-sm font-black text-ink/70">{stat.year}</div>
                <div>
                  <div className="mb-1 flex items-center justify-between gap-3 text-sm">
                    <span className="font-black text-ink">{stat.memberCount}</span>
                    <span className="font-semibold text-ink/55">{tx(lang, "anëtarë", "Mitglieder")}</span>
                  </div>
                  <div className="h-2.5 overflow-hidden rounded-full bg-ink/10">
                    <div
                      className={`h-full rounded-full ${inProgress ? "bg-gold" : "bg-pine"}`}
                      style={{ width: `${Math.max(6, (stat.memberCount / maxMembers) * 100)}%` }}
                    />
                  </div>
                </div>
                <div className={`rounded-md px-3 py-2 text-sm font-black ${inProgress ? "bg-gold/15 text-ink" : changeClass(stat.percentChange)}`}>
                  {inProgress ? (
                    <span>
                      {tx(lang, "Në progres", "In Bearbeitung")}
                      {updated ? <span className="block text-xs font-bold opacity-70">{updated}</span> : null}
                    </span>
                  ) : (
                    <span>{formatPercent(stat.percentChange)}</span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <details className="mt-4 rounded-lg border border-ink/10 bg-white">
        <summary className="cursor-pointer px-4 py-3 text-sm font-black text-pine">
          {tx(lang, "Shfaq historikun e plotë", "Vollständigen Verlauf anzeigen")}
        </summary>
        <div className="overflow-x-auto border-t border-ink/10">
          <table className="w-full min-w-[620px] text-left text-sm">
            <thead className="bg-ink/[0.03] text-xs font-black uppercase tracking-wide text-ink/55">
              <tr>
                <th className="px-4 py-3">{tx(lang, "Viti", "Jahr")}</th>
                <th className="px-4 py-3">{tx(lang, "Anëtarë", "Mitglieder")}</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">{tx(lang, "Ndryshimi", "Veränderung")}</th>
                <th className="px-4 py-3">{tx(lang, "Përditësuar", "Aktualisiert")}</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((stat) => (
                <tr key={`${stat.id}-history`} className="border-t border-ink/10">
                  <td className="px-4 py-3 font-black text-ink">{stat.year}</td>
                  <td className="px-4 py-3 font-semibold text-ink/70">{stat.memberCount}</td>
                  <td className="px-4 py-3 font-semibold text-ink/70">
                    {stat.status === "in_progress" ? tx(lang, "Në progres", "In Bearbeitung") : tx(lang, "I mbyllur", "Abgeschlossen")}
                  </td>
                  <td className={`px-4 py-3 font-black ${stat.percentChange !== null && stat.percentChange < 0 ? "text-ember" : "text-pine"}`}>
                    {stat.status === "in_progress" ? "-" : formatPercent(stat.percentChange)}
                  </td>
                  <td className="px-4 py-3 font-semibold text-ink/60">{formatDate(stat.dateUpdated, lang) || "-"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </details>
    </section>
  );
}

function SummaryCard({
  label,
  value,
  meta,
  tone
}: {
  label: string;
  value: string;
  meta?: string;
  tone?: number | null;
}) {
  const toneClass = tone === undefined || tone === null ? "bg-pine/5" : tone >= 0 ? "bg-pine/10" : "bg-ember/10";

  return (
    <div className={`rounded-lg p-4 ${toneClass}`}>
      <p className="text-xs font-black uppercase tracking-wide text-pine">{label}</p>
      <p className="mt-2 text-xl font-black text-ink">{value}</p>
      {meta ? <p className="mt-1 text-xs font-bold text-ink/55">{meta}</p> : null}
    </div>
  );
}
