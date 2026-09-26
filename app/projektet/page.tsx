import Link from "next/link";
import { getV2Projects } from "@/lib/v2-content";

export const dynamic = "force-dynamic";

export default async function ProjectsPage() {
  const projects = await getV2Projects();

  return (
    <>
      <header className="site-header">
        <div className="shell nav-wrap">
          <Link className="brand" href="/"><span className="brand-mark">R</span><span><strong>Shoqata Rainca</strong><small>Që nga viti 2010</small></span></Link>
          <nav><Link href="/">Ballina</Link><Link href="/eventet">Eventet</Link><Link href="/projektet">Projektet</Link><Link href="/antaret">Anëtarët</Link></nav>
        </div>
      </header>
      <main>
        <section className="listing-hero"><div className="shell"><span className="eyebrow light">PUNA E SHOQATËS</span><h1>Projektet</h1><p>Aktivitete dhe mbështetje konkrete për Raincën dhe komunitetin.</p></div></section>
        <section className="section"><div className="shell">
          <div className="public-project-grid">
            {projects.map((project, index) => <article key={project.id} className="public-project-card">
              <div className="project-card-top"><span className="card-no">{String(index+1).padStart(2,"0")}</span><span className="pill muted">{project.category}</span></div>
              <h3>{project.title}</h3>
              <p>{project.summary}</p>
              <div className="project-card-meta"><span>{project.year}</span><b>{project.status}</b>{project.budget && <span>{project.budget} CHF</span>}</div>
            </article>)}
          </div>
        </div></section>
      </main>
    </>
  );
}
