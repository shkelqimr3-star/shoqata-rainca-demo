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
  const [neighborhood, setNeighborhood] = useState("all");

  const neighborhoods = useMemo(
    () =>
      Array.from(
        new Set(
          members
            .map((member) => member.neighborhood)
            .filter((value): value is string => Boolean(value))
        )
      ).sort((a, b) => a.localeCompare(b, "sq")),
    [members]
  );

  const filtered = useMemo(() => {
    const q = query.trim().toLocaleLowerCase("sq");

    return members.filter((member) => {
      const searchable = `${member.firstName} ${member.lastName} ${member.neighborhood || ""}`.toLocaleLowerCase("sq");

      if (q && !searchable.includes(q)) return false;
      if (neighborhood !== "all" && member.neighborhood !== neighborhood) return false;

      if (year !== "all" && status !== "all") {
        const paid = member.payments[year] > 0;
        if (status === "paid" && !paid) return false;
        if (status === "open" && paid) return false;
      }

      return true;
    });
  }, [members, neighborhood, query, year, status]);

  return (
    <div className="member-directory">
      <div className="member-filters">
        <label className="member-search">
          <span>Kërko</span>
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Emri, mbiemri ose lagjja…"
          />
        </label>

        <label>
          <span>Viti</span>
          <select
            value={year}
            onChange={(event) => setYear(event.target.value as PaymentYear | "all")}
          >
            <option value="all">Të gjitha</option>
            {years.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>
        </label>

        {neighborhoods.length > 0 && (
          <label>
            <span>Lagjja</span>
            <select
              value={neighborhood}
              onChange={(event) => setNeighborhood(event.target.value)}
            >
              <option value="all">Të gjitha</option>
              {neighborhoods.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>
          </label>
        )}

        <label>
          <span>Statusi</span>
          <select
            value={status}
            onChange={(event) =>
              setStatus(event.target.value as "all" | "paid" | "open")
            }
            disabled={year === "all"}
          >
            <option value="all">Të gjithë</option>
            <option value="paid">Me pagesë</option>
            <option value="open">Pa pagesë</option>
          </select>
        </label>
      </div>

      <div className="member-meta">
        <span>
          <strong>{filtered.length}</strong> rezultate
        </span>
        <span>
          {neighborhoods.length
            ? "Mund të filtrosh edhe sipas lagjes."
            : "Lagjet / mahallat shtohen pasi të verifikohen."}
        </span>
      </div>

      <div className="member-table-wrap">
        <table className="member-table">
          <thead>
            <tr>
              <th>Nr.</th>
              <th>Anëtari</th>
              <th>Lagjja</th>
              <th>2023</th>
              <th>2024</th>
              <th>2025</th>
              <th>2026</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((member) => (
              <tr key={member.sourceIndex}>
                <td className="member-no">{member.sourceNo}</td>
                <td>
                  <strong>
                    {member.firstName} {member.lastName}
                  </strong>
                </td>
                <td className="member-neighborhood">
                  {member.neighborhood || "—"}
                </td>
                {(["2023", "2024", "2025", "2026"] as PaymentYear[]).map(
                  (paymentYear) => {
                    const amount = member.payments[paymentYear];
                    return (
                      <td key={paymentYear}>
                        <span
                          className={
                            amount
                              ? "payment-badge paid"
                              : "payment-badge open"
                          }
                          title={
                            amount
                              ? `${amount} CHF sipas listës`
                              : "Pa pagesë të regjistruar"
                          }
                        >
                          {paymentLabel(amount)}
                        </span>
                      </td>
                    );
                  }
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
