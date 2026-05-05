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
