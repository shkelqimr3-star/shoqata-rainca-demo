import Link from "next/link";
import {
  formatEventDate,
  formatEventTime,
  getV2Events,
  getV2Projects
} from "@/lib/v2-content";

export const dynamic = "force-dynamic";

export default async function Home() {
  const [events, projects] = await Promise.all([getV2Events(), getV2Projects()]);
  const now = new Date();
  const nextEvent = events.find((event) => event.startsAt >= now) || events[0];
  const activityCards = projects.slice(0, 3);

  return (
    <>
      <header className="site-header">
        <div className="shell nav-wrap">
          <Link className="brand" href="/" aria-label="Shoqata Rainca">
            <span className="brand-mark">R</span>
            <span><strong>Shoqata Rainca</strong><small>Që nga viti 2010</small></span>
          </Link>
          <nav>
            <Link href="/eventet">Eventet</Link>
            <Link href="/projektet">Projektet</Link>
            <Link href="/antaret">Anëtarët</Link>
            <Link href="/galeria">Galeria</Link>
            <a href="#anetaresia">Anëtarësia</a>
            <Link href="/transparenca">Transparenca</Link>
          </nav>
        </div>
      </header>

      <main id="top">
        <section className="hero">
          <div className="hero-overlay" />
          <div className="shell hero-inner">
            <div className="hero-copy">
              <span className="eyebrow light">SHOQATA RAINCA</span>
              <h1>Për Raincën.<br />Bashkë.</h1>
              <p>Informacione, aktivitete, projekte dhe transparencë për anëtarët dhe bashkëfshatarët.</p>
              <div className="hero-actions">
                <Link className="button primary" href="/eventet">Eventet</Link>
                <Link className="button ghost" href="/antaret">Lista e anëtarëve</Link>
              </div>
            </div>
          </div>
        </section>

        {nextEvent && <section id="eventi" className="section event-section">
          <div className="shell">
            <div className="section-head">
              <div><span className="eyebrow">EVENTI I ARDHSHËM</span><h2>{nextEvent.title}</h2></div>
              <Link className="quietLink desktopOnly" href="/eventet">Të gjitha eventet →</Link>
            </div>
            <div className="event-card">
              <div className="event-main">
                <span className="pill">Event</span>
                <h3>{nextEvent.location}</h3>
                <p className="event-meta">{formatEventDate(nextEvent.startsAt)} · Ora {formatEventTime(nextEvent.startsAt)}</p>
                <p>{nextEvent.description}</p>
                {nextEvent.details && <div className="public-details">{nextEvent.details}</div>}
              </div>
              <div className="event-side-callout">
                <span>Informacionet e eventit</span>
                <strong>{formatEventDate(nextEvent.startsAt)}</strong>
                <Link href="/eventet">Shiko detajet →</Link>
              </div>
            </div>
          </div>
        </section>}

        <section id="aktivitetet" className="section soft">
          <div className="shell">
            <div className="section-head">
              <div><span className="eyebrow">AKTIVITETET E FUNDIT</span><h2>Punë konkrete për Raincën</h2></div>
              <Link className="quietLink desktopOnly" href="/projektet">Të gjitha projektet →</Link>
            </div>
            <div className="cards">
              {activityCards.map((project, index) => (
                <article className="activity-card" key={project.id}>
                  <span className="card-no">{String(index + 1).padStart(2, "0")}</span>
                  <span className="pill muted">{project.category}</span>
                  <h3>{project.title}</h3>
                  <p>{project.summary}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section id="anetaresia" className="section membership">
          <div className="shell membership-grid">
            <div>
              <span className="eyebrow light">ANËTARËSIA</span>
              <h2>Një tarifë.<br />Një pasqyrë e qartë.</h2>
              <p>Anëtarët regjistrohen nga administratori i Shoqatës. Pagesat ruhen sipas vitit dhe shfaqen në listën e anëtarëve.</p>
              <Link className="text-link-light" href="/antaret">Shiko listën e anëtarëve →</Link>
            </div>
            <div className="fee">
              <span>Anëtarësia vjetore</span><strong>100</strong><em>CHF</em>
              <small>Pagesa me QR / bankë. Mënyrat automatike do të shtohen pasi të aktivizohen zyrtarisht.</small>
            </div>
          </div>
        </section>

        <section id="transparenca" className="section">
          <div className="shell transparency">
            <div><span className="eyebrow">TRANSPARENCA</span><h2>Raportet, projektet dhe dokumentet në një vend.</h2></div>
            <div className="link-grid">
              <Link href="/transparenca"><strong>Raportet financiare</strong><span>Sipas viteve, vetëm me të dhëna të verifikuara.</span></Link>
              <Link href="/projektet"><strong>Projektet</strong><span>Aktivitetet dhe mbështetjet e Shoqatës.</span></Link>
              <Link href="/dokumentet"><strong>Dokumentet</strong><span>Formularë, statut dhe dokumente publike.</span></Link>
              <Link href="/donacionet"><strong>Donacionet</strong><span>Të ndara nga pagesat e anëtarësisë.</span></Link>
            </div>
          </div>
        </section>
      </main>

      <footer id="kontakt">
        <div className="shell footer-grid">
          <div><strong>Shoqata Rainca</strong><span>shoqata-rainca.ch</span></div>
          <div><span>info@shoqata-rainca.ch</span><span>Facebook: Shoqata Rainca</span></div>
          <div className="footer-note">Versioni i ri · Preview</div>
        </div>
      </footer>
    </>
  );
}
