import type { CategoryValue } from "@/lib/types";

type FinancialChartProps = {
  income: number;
  expenses: number;
  balance: number;
  labels: {
    income: string;
    expenses: string;
    balance: string;
    categories: string;
  };
  categories: CategoryValue[];
};

function currency(value: number) {
  return new Intl.NumberFormat("de-CH", {
    style: "currency",
    currency: "CHF",
    maximumFractionDigits: 0
  }).format(value);
}

export function FinancialChart({ income, expenses, balance, labels, categories }: FinancialChartProps) {
  const max = Math.max(income, expenses, Math.abs(balance), ...categories.map((item) => item.amount), 1);
  const bars = [
    { label: labels.income, value: income, className: "bg-pine" },
    { label: labels.expenses, value: expenses, className: "bg-ember" },
    { label: labels.balance, value: balance, className: balance >= 0 ? "bg-gold" : "bg-ember" }
  ];

  return (
    <div className="grid gap-5 lg:grid-cols-[1fr_0.85fr]">
      <div className="space-y-4">
        {bars.map((bar) => (
          <div key={bar.label}>
            <div className="mb-2 flex items-center justify-between gap-3 text-sm">
              <span className="font-bold text-ink">{bar.label}</span>
              <span className="font-semibold text-ink/70">{currency(bar.value)}</span>
            </div>
            <div className="h-3 overflow-hidden rounded-full bg-ink/10">
              <div
                className={`h-full rounded-full ${bar.className}`}
                style={{ width: `${Math.max(6, (Math.abs(bar.value) / max) * 100)}%` }}
              />
            </div>
          </div>
        ))}
      </div>
      <div>
        <div className="mb-3 text-sm font-black text-ink">{labels.categories}</div>
        <div className="space-y-3">
          {categories.map((item) => (
            <div key={item.label}>
              <div className="mb-1 flex justify-between gap-3 text-xs text-ink/70">
                <span>{item.label}</span>
                <span>{currency(item.amount)}</span>
              </div>
              <div className="h-2 overflow-hidden rounded-full bg-ink/10">
                <div className="h-full rounded-full bg-leaf" style={{ width: `${Math.max(5, (item.amount / max) * 100)}%` }} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

type ReportSummary = {
  id: string;
  year: number;
  title: string;
  income: number;
  expenses: number;
  balance: number;
  categories: CategoryValue[];
  pdfUrl?: string | null;
  hasPdf?: boolean;
};

type FinancialDashboardProps = {
  reports: ReportSummary[];
  labels: {
    income: string;
    expenses: string;
    balance: string;
    download: string;
    noPdf: string;
    yearlyBalance: string;
    incomeVsExpenses: string;
    categoryExpenses: string;
  };
};

export function FinancialDashboard({ reports, labels }: FinancialDashboardProps) {
  const sortedReports = [...reports].sort((a, b) => b.year - a.year);
  const chartReports = [...reports].sort((a, b) => a.year - b.year);
  const maxMoney = Math.max(...reports.flatMap((report) => [report.income, report.expenses, Math.abs(report.balance)]), 1);
  const latestReport = sortedReports[0];
  const categoryTotal = Math.max(...(latestReport?.categories.map((item) => item.amount) ?? [1]), 1);

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-3">
        {sortedReports.map((report) => (
          <article key={report.id} className="rounded-lg border border-ink/10 bg-white p-5 shadow-sm">
            <div className="mb-4 flex items-start justify-between gap-3">
              <div>
                <p className="text-sm font-black uppercase tracking-wide text-pine">{report.year}</p>
                <h3 className="mt-1 text-xl font-black text-ink">{report.title}</h3>
              </div>
              {report.hasPdf || report.pdfUrl ? (
                <a href={report.pdfUrl || "#"} className="rounded-md bg-ink px-3 py-2 text-xs font-black text-white">
                  {labels.download}
                </a>
              ) : (
                <span className="rounded-md bg-ink/5 px-3 py-2 text-xs font-bold text-ink/55">{labels.noPdf}</span>
              )}
            </div>
            <div className="grid gap-3">
              <MoneyLine label={labels.income} value={report.income} />
              <MoneyLine label={labels.expenses} value={report.expenses} />
              <MoneyLine label={labels.balance} value={report.balance} strong />
            </div>
          </article>
        ))}
      </div>

      <div className="grid gap-5 lg:grid-cols-[1.1fr_0.9fr]">
        <section className="rounded-lg border border-ink/10 bg-white p-5 shadow-sm">
          <h3 className="mb-5 text-xl font-black text-ink">{labels.incomeVsExpenses}</h3>
          <div className="space-y-5">
            {sortedReports.map((report) => (
              <div key={report.id}>
                <div className="mb-2 flex justify-between text-sm font-black text-ink">
                  <span>{report.year}</span>
                  <span>{currency(report.income)} / {currency(report.expenses)}</span>
                </div>
                <div className="grid gap-2">
                  <ChartBar label={labels.income} value={report.income} max={maxMoney} className="bg-pine" />
                  <ChartBar label={labels.expenses} value={report.expenses} max={maxMoney} className="bg-ember" />
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="rounded-lg border border-ink/10 bg-white p-5 shadow-sm">
          <h3 className="mb-5 text-xl font-black text-ink">{labels.categoryExpenses}</h3>
          <div className="space-y-4">
            {(latestReport?.categories ?? []).map((item) => (
              <div key={item.label}>
                <div className="mb-1 flex justify-between gap-3 text-sm font-bold text-ink/70">
                  <span>{item.label}</span>
                  <span>{currency(item.amount)}</span>
                </div>
                <div className="h-3 overflow-hidden rounded-full bg-ink/10">
                  <div className="h-full rounded-full bg-leaf" style={{ width: `${Math.max(4, (item.amount / categoryTotal) * 100)}%` }} />
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>

      <section className="rounded-lg border border-ink/10 bg-white p-5 shadow-sm">
        <h3 className="mb-5 text-xl font-black text-ink">{labels.yearlyBalance}</h3>
        <div className="grid gap-3">
          {chartReports.map((report) => (
            <div key={report.id} className="grid grid-cols-[4rem_1fr] items-center gap-3">
              <span className="text-sm font-black text-ink/65">{report.year}</span>
              <ChartBar value={Math.abs(report.balance)} max={maxMoney} label={currency(report.balance)} className={report.balance >= 0 ? "bg-gold" : "bg-ember"} />
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

function MoneyLine({ label, value, strong = false }: { label: string; value: number; strong?: boolean }) {
  return (
    <div className="flex items-center justify-between gap-3 border-t border-ink/10 pt-3">
      <span className="text-sm font-bold text-ink/60">{label}</span>
      <span className={strong ? "text-lg font-black text-ink" : "font-black text-ink"}>{currency(value)}</span>
    </div>
  );
}

function ChartBar({ label, value, max, className }: { label: string; value: number; max: number; className: string }) {
  return (
    <div className="grid grid-cols-[5rem_1fr] items-center gap-3">
      <span className="text-xs font-bold text-ink/55">{label}</span>
      <div className="h-3 overflow-hidden rounded-full bg-ink/10">
        <div className={`h-full rounded-full ${className}`} style={{ width: `${Math.max(5, (value / max) * 100)}%` }} />
      </div>
    </div>
  );
}
