const activities = [
  {
    tag: "Komunitet",
    title: "Mirëmbajtja e fshatit",
    text: "Angazhim i vazhdueshëm për pastrim, kositje dhe mirëmbajtje të hapësirave të Raincës."
  },
  {
    tag: "Arsim",
    title: "Mbështetje për çerdhen",
    text: "Shoqata ka mbështetur çerdhen me pajisje klime për kushte më të mira gjatë verës."
  },
  {
    tag: "Aktivitet",
    title: "Pastrimi dhe kositja",
    text: "Punë të organizuara për pastrimin e rrugëve dhe hapësirave të përbashkëta të fshatit."
  }
];

export default function Home() {
  return (
    <>
      <header className="site-header">
        <div className="shell nav-wrap">
          <a className="brand" href="#top" aria-label="Shoqata Rainca">
            <span className="brand-mark">R</span>
            <span>
              <strong>Shoqata Rainca</strong>
              <small>Që nga viti 2010</small>
            </span>
          </a>
          <nav>
            <a href="#aktivitetet">Aktivitetet</a>
            <a href="#anetaresia">Anëtarësia</a>
            <a href="#transparenca">Transparenca</a>
            <a href="#kontakt">Kontakt</a>
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
                <a className="button primary" href="#eventi">Eventi i ardhshëm</a>
                <a className="button ghost" href="#anetaresia">Anëtarësia</a>
              </div>
            </div>
          </div>
        </section>

        <section id="eventi" className="section event-section">
          <div className="shell">
            <div className="section-head">
              <div>
                <span className="eyebrow">EVENTI I ARDHSHËM</span>
                <h2>Festa e Shoqatës</h2>
              </div>
              <div className="date-badge">
                <strong>07</strong>
                <span>NËNTOR 2026</span>
              </div>
            </div>
            <div className="event-card">
              <div className="event-main">
                <span className="pill">Shoqata Rainca feston Ditën e Flamurit</span>
                <h3>Sternensaal Wangs</h3>
                <p className="event-meta">Dorfstrasse 10, 7323 Wangs · Ora 18:00</p>
                <p>Agimi Band, darkë dhe dessert. Rezervimi bëhet përmes kontakteve të publikuara në flyer.</p>
              </div>
              <div className="prices">
                <div><span>Të rriturit</span><strong>20 CHF</strong></div>
                <div><span>10–16 vjeç</span><strong>10 CHF</strong></div>
                <div><span>Nën 10 vjeç</span><strong>Falas</strong></div>
              </div>
            </div>
          </div>
        </section>

        <section id="aktivitetet" className="section soft">
          <div className="shell">
            <div className="section-head">
              <div>
                <span className="eyebrow">AKTIVITETET</span>
                <h2>Punë konkrete për Raincën</h2>
              </div>
              <p className="section-note">Faqja e re do të mbajë vetëm informacionet që kanë vlerë reale për komunitetin.</p>
            </div>
            <div className="cards">
              {activities.map((item, i) => (
                <article className="activity-card" key={item.title}>
                  <span className="card-no">{String(i + 1).padStart(2, "0")}</span>
                  <span className="pill muted">{item.tag}</span>
                  <h3>{item.title}</h3>
                  <p>{item.text}</p>
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
            </div>
            <div className="fee">
              <span>Anëtarësia vjetore</span>
              <strong>100</strong>
              <em>CHF</em>
              <small>Pagesa me QR / bankë. Mënyrat automatike do të shtohen pasi të aktivizohen zyrtarisht.</small>
            </div>
          </div>
        </section>

        <section id="transparenca" className="section">
          <div className="shell transparency">
            <div>
              <span className="eyebrow">TRANSPARENCA</span>
              <h2>Raportet, projektet dhe dokumentet në një vend.</h2>
            </div>
            <div className="link-grid">
              <div><strong>Raportet financiare</strong><span>Sipas viteve, vetëm me të dhëna të verifikuara.</span></div>
              <div><strong>Projektet</strong><span>Aktivitetet dhe mbështetjet e Shoqatës.</span></div>
              <div><strong>Dokumentet</strong><span>Formularë, statut dhe dokumente publike.</span></div>
              <div><strong>Donacionet</strong><span>Të ndara nga pagesat e anëtarësisë.</span></div>
            </div>
          </div>
        </section>
      </main>

      <footer id="kontakt">
        <div className="shell footer-grid">
          <div>
            <strong>Shoqata Rainca</strong>
            <span>shoqata-rainca.ch</span>
          </div>
          <div>
            <span>info@shoqata-rainca.ch</span>
            <span>Facebook: Shoqata Rainca</span>
          </div>
          <div className="footer-note">Versioni i ri · Preview</div>
        </div>
      </footer>
    </>
  );
}
