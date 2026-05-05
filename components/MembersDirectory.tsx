"use client";

import { useMemo, useState } from "react";
import type { PublicData } from "@/lib/types";

type Member = PublicData["members"][number];

type MembersDirectoryProps = {
  members: Member[];
  lang: "sq" | "de";
};

const labels = {
  sq: {
    search: "Kërko sipas emrit ose mbiemrit",
    year: "Viti",
    country: "Shteti",
    status: "Statusi",
    all: "Të gjitha",
    name: "Emri",
    surname: "Mbiemri",
    amount: "Shuma publike",
    noResults: "Nuk u gjet asnjë anëtar me këto filtra."
  },
  de: {
    search: "Nach Name oder Nachname suchen",
    year: "Jahr",
    country: "Land",
    status: "Status",
    all: "Alle",
    name: "Name",
    surname: "Nachname",
    amount: "Öffentlicher Betrag",
    noResults: "Keine Mitglieder mit diesen Filtern gefunden."
  }
};

function normalize(value: string) {
  return value.trim().toLowerCase();
}

function amountLabel(member: Member) {
  if (member.amount == null || !member.currency) return "";
  return new Intl.NumberFormat("de-CH", {
    style: "currency",
    currency: member.currency,
    maximumFractionDigits: 0
  }).format(member.amount);
}

export function MembersDirectory({ members, lang }: MembersDirectoryProps) {
  const t = labels[lang];
  const [search, setSearch] = useState("");
  const [year, setYear] = useState("all");
  const [country, setCountry] = useState("all");
  const [status, setStatus] = useState("all");

  const years = useMemo(
    () => Array.from(new Set(members.map((member) => member.year).filter(Boolean))).sort((a, b) => Number(b) - Number(a)),
    [members]
  );
  const countries = useMemo(
    () => Array.from(new Set(members.map((member) => member.country).filter(Boolean))).sort(),
    [members]
  );
  const statuses = useMemo(
    () => Array.from(new Set(members.map((member) => member.status).filter(Boolean))).sort(),
    [members]
  );

  const filtered = useMemo(() => {
    const query = normalize(search);
    return members.filter((member) => {
      const memberText = normalize(`${member.name} ${member.surname}`);
      const matchesSearch = !query || memberText.includes(query);
      const matchesYear = year === "all" || String(member.year) === year;
      const matchesCountry = country === "all" || member.country === country;
      const matchesStatus = status === "all" || member.status === status;
      return matchesSearch && matchesYear && matchesCountry && matchesStatus;
    });
  }, [country, members, search, status, year]);

  return (
    <div className="space-y-5">
      <div className="grid gap-3 rounded-lg border border-ink/10 bg-white p-4 shadow-sm lg:grid-cols-[1.4fr_0.6fr_0.8fr_0.7fr]">
        <input
          className="admin-input"
          type="search"
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          placeholder={t.search}
          aria-label={t.search}
        />
        <FilterSelect label={t.year} value={year} onChange={setYear} options={years.map(String)} allLabel={t.all} />
        <FilterSelect label={t.country} value={country} onChange={setCountry} options={countries as string[]} allLabel={t.all} />
        <FilterSelect label={t.status} value={status} onChange={setStatus} options={statuses} allLabel={t.all} />
      </div>

      <div className="overflow-hidden rounded-lg border border-ink/10 bg-white shadow-sm">
        <div className="hidden grid-cols-[1fr_1fr_0.6fr_0.9fr_0.9fr_0.8fr] gap-4 border-b border-ink/10 bg-ink/[0.03] px-4 py-3 text-xs font-black uppercase tracking-wide text-ink/56 md:grid">
          <span>{t.name}</span>
          <span>{t.surname}</span>
          <span>{t.year}</span>
          <span>{t.country}</span>
          <span>{t.status}</span>
          <span>{t.amount}</span>
        </div>
        <div className="divide-y divide-ink/10">
          {filtered.map((member) => (
            <article key={member.id} className="grid gap-3 px-4 py-4 md:grid-cols-[1fr_1fr_0.6fr_0.9fr_0.9fr_0.8fr] md:items-center">
              <div>
                <div className="text-xs font-black uppercase tracking-wide text-ink/45 md:hidden">{t.name}</div>
                <div className="font-black text-ink">{member.name}</div>
              </div>
              <div>
                <div className="text-xs font-black uppercase tracking-wide text-ink/45 md:hidden">{t.surname}</div>
                <div className="font-bold text-ink/76">{member.surname}</div>
              </div>
              <div className="text-sm font-semibold text-ink/68">{member.year || "-"}</div>
              <div className="text-sm font-semibold text-ink/68">{member.country || "-"}</div>
              <div>
                <span className="rounded-full bg-pine/10 px-3 py-1 text-xs font-black text-pine">{member.status}</span>
              </div>
              <div className="text-sm font-black text-ink">{amountLabel(member) || "-"}</div>
            </article>
          ))}
          {!filtered.length && <p className="px-4 py-8 text-center font-bold text-ink/55">{t.noResults}</p>}
        </div>
      </div>
    </div>
  );
}

function FilterSelect({
  label,
  value,
  onChange,
  options,
  allLabel
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: string[];
  allLabel: string;
}) {
  return (
    <label>
      <span className="sr-only">{label}</span>
      <select className="admin-input" value={value} onChange={(event) => onChange(event.target.value)} aria-label={label}>
        <option value="all">{allLabel}</option>
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
    </label>
  );
}
