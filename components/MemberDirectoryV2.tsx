"use client";

import { useMemo, useState } from "react";
import type { MemberRecord, PaymentYear } from "@/data/member-records";

const years: PaymentYear[] = ["2026", "2025", "2024", "2023"];

function paymentLabel(amount: number) {
  if (!amount) return "—";
  return amount === 100 ? "✓" : String(amount);
}

export default function MemberDirectoryV2({ members }: { members: MemberRecord[] }) {
  const [query, setQuery] = useState("");
  const [year, setYear] = useState<PaymentYear | "all">("2026");
  const [status, setStatus] = useState<"all" | "paid" | "open">("all");

  const filtered = useMemo(() => {
    const q = query.trim().toLocaleLowerCase("sq");
    return members.filter((member) => {
      const name = `${member.firstName} ${member.lastName}`.toLocaleLowerCase("sq");
      if (q && !name.includes(q)) return false;
      if (year !== "all" && status !== "all") {
        const paid = member.payments[year] > 0;
        if (status === "paid" && !paid) return false;
        if (status === "open" && paid) return false;
      }
      return true;
    });
  }, [members, query, year, status]);

  return (
    <div className="member-directory">
      <div className="member-filters">
        <label className="member-search">
          <span>Kërko</span>
          <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Emri ose mbiemri…" />
        </label>
        <label>
          <span>Viti</span>
          <select value={year} onChange={(e) => setYear(e.target.value as PaymentYear | "all")}>
            <option value="all">Të gjitha</option>
            {years.map((y) => <option key={y} value={y}>{y}</option>)}
          </select>
        </label>
        <label>
          <span>Statusi</span>
          <select value={status} onChange={(e) => setStatus(e.target.value as "all" | "paid" | "open")} disabled={year === "all"}>
            <option value="all">Të gjithë</option>
            <option value="paid">Me pagesë</option>
            <option value="open">Pa pagesë</option>
          </select>
        </label>
      </div>

      <div className="member-meta">
        <span><strong>{filtered.length}</strong> rezultate</span>
        <span>Lagjet / mahallat shtohen pasi të verifikohen.</span>
      </div>

      <div className="member-table-wrap">
        <table className="member-table">
          <thead>
            <tr><th>Nr.</th><th>Anëtari</th><th>2023</th><th>2024</th><th>2025</th><th>2026</th></tr>
          </thead>
          <tbody>
            {filtered.map((member) => (
              <tr key={member.sourceIndex}>
                <td className="member-no">{member.sourceNo}</td>
                <td><strong>{member.firstName} {member.lastName}</strong></td>
                {(["2023","2024","2025","2026"] as PaymentYear[]).map((y) => {
                  const amount = member.payments[y];
                  return (
                    <td key={y}>
                      <span className={amount ? "payment-badge paid" : "payment-badge open"} title={amount ? `${amount} CHF sipas listës` : "Pa pagesë të regjistruar"}>
                        {paymentLabel(amount)}
                      </span>
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
