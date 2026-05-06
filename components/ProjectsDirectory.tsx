"use client";

import { useMemo, useState } from "react";
import { SafeImage } from "@/components/SafeImage";
import type { Lang, PublicData } from "@/lib/types";

type Project = PublicData["projects"][number];

function tx(lang: Lang, sq: string, de: string) {
  return lang === "de" ? de : sq;
}

function currency(value?: number | null) {
  if (!value) return "";
  return new Intl.NumberFormat("de-CH", {
    style: "currency",
    currency: "CHF",
    maximumFractionDigits: 0
  }).format(value);
}

export function ProjectsDirectory({ projects, lang }: { projects: Project[]; lang: Lang }) {
  const [year, setYear] = useState("all");
  const [category, setCategory] = useState("all");

  const years = useMemo(() => Array.from(new Set(projects.map((project) => project.year))).sort((a, b) => b - a), [projects]);
  const categories = useMemo(() => Array.from(new Set(projects.map((project) => project.category))).sort(), [projects]);

  const filteredProjects = projects.filter((project) => {
    const matchesYear = year === "all" || String(project.year) === year;
    const matchesCategory = category === "all" || project.category === category;
    return matchesYear && matchesCategory;
  });

  return (
    <div>
      <div className="mb-5 grid gap-3 rounded-lg border border-ink/10 bg-white p-4 shadow-sm sm:grid-cols-2">
        <label>
          <span className="admin-label">{tx(lang, "Filtro sipas vitit", "Nach Jahr filtern")}</span>
          <select className="admin-input mt-1" value={year} onChange={(event) => setYear(event.target.value)}>
            <option value="all">{tx(lang, "Të gjitha vitet", "Alle Jahre")}</option>
            {years.map((projectYear) => (
              <option key={projectYear} value={projectYear}>
                {projectYear}
              </option>
            ))}
          </select>
        </label>
        <label>
          <span className="admin-label">{tx(lang, "Filtro sipas kategorisë", "Nach Kategorie filtern")}</span>
          <select className="admin-input mt-1" value={category} onChange={(event) => setCategory(event.target.value)}>
            <option value="all">{tx(lang, "Të gjitha kategoritë", "Alle Kategorien")}</option>
            {categories.map((projectCategory) => (
              <option key={projectCategory} value={projectCategory}>
                {projectCategory}
              </option>
            ))}
          </select>
        </label>
      </div>
      <div className="grid gap-5 md:grid-cols-3">
        {filteredProjects.map((project) => (
          <article key={project.id} className="overflow-hidden rounded-lg border border-ink/10 bg-white shadow-sm">
            <div className="relative h-44 bg-skywash">
              <SafeImage src={project.imageUrl} alt={tx(lang, project.titleSq, project.titleDe)} className="h-full w-full" />
            </div>
            <div className="p-5">
              <div className="mb-3 flex flex-wrap gap-2 text-xs font-black">
                <span className="rounded-full bg-pine/10 px-3 py-1 text-pine">{project.category}</span>
                <span className="rounded-full bg-gold/15 px-3 py-1 text-ink">{project.status}</span>
              </div>
              <h3 className="text-xl font-black text-ink">{tx(lang, project.titleSq, project.titleDe)}</h3>
              <p className="mt-3 leading-7 text-ink/70">{tx(lang, project.summarySq, project.summaryDe)}</p>
              <div className="mt-4 flex justify-between text-sm font-bold text-ink/62">
                <span>{project.year}</span>
                <span>{currency(project.budget)}</span>
              </div>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
