import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Rreth Shoqatës | Shoqata Rainca",
  description: "Historia, misioni dhe veprimtaria e Shoqatës Rainca, e themeluar në vitin 2010."
};

const angazhimet = [
  {
    title: "Solidariteti",
    text: "Ndihmë për familjet në nevojë, përkrahje për jetimët dhe mbështetje në periudha të vështira."
  },
  {
    title: "Arsimi",
    text: "Mbështetje për nxënësit dhe studentët, si dhe nisma që ndihmojnë të rinjtë e komunitetit."
  },
  {
    title: "Komuniteti",
    text: "Mirëmbajtja e fshatit dhe mbështetja e aktiviteteve kulturore e sportive."
  }
];

export default function AboutAssociationPage() {
  return (
    <>
      <header className="site-header">
        <div className="shell nav-wrap">
          <Link className="brand" href="/" aria-label="Shoqata Rainca – Ballina">
            <img className="brand-symbol" src="/rainca-trees.svg" alt="" width={56} height={40} />
            <span><strong>Shoqata Rainca</strong><small>Që nga viti 2010</small></span>
          </Link>
          <nav aria-label="Navigimi kryesor">
            <Link href="/">Ballina</Link>
            <Link href="/rreth-shoqates" aria-current="page">Rreth Shoqatës</Link>
            <Link href="/projektet">Projektet</Link>
            <Link href="/antaret">Anëtarët</Link>
            <Link href="/galeria">Galeria</Link>
            <Link href="/transparenca">Transparenca</Link>
          </nav>
        </div>
      </header>

      <main>
        <section className="listing-hero about-page-hero">
          <div className="shell">
            <span className="eyebrow light">SHOQATA RAINCA · QË NGA VITI 2010</span>
            <h1>Rreth Shoqatës</h1>
            <p>Bashkë për vendlindjen, komunitetin dhe të ardhmen.</p>
          </div>
        </section>

        <section className="section about-story-section">
          <div className="shell about-story-grid">
            <div>
              <span className="eyebrow">HISTORIA DHE MISIONI</span>
              <h2>Bashkë për vendlindjen tonë.</h2>
              <p className="about-story-lead">Shoqata Rainca është themeluar më 23 maj 2010 në Regensdorf të Zürichut, Zvicër, nga bashkëvendas të bashkuar me një qëllim të përbashkët: të kontribuojnë për mirëqenien e banorëve dhe zhvillimin e fshatit Raincë.</p>
            </div>
            <div className="about-story-text">
              <p>E mbështetur në solidaritetin dhe kontributet vullnetare të anëtarëve dhe bashkëvendasve, Shoqata ndër vite ka realizuar dhe mbështetur nisma humanitare, arsimore, kulturore, sportive dhe komunitare.</p>
              <p>Përmes bashkëpunimit mes bashkëvendasve në mërgim dhe banorëve të Raincës, Shoqata synon të ruajë lidhjet me vendlindjen dhe të kontribuojë për një të ardhme më të mirë të komunitetit.</p>
              <p className="statute-about-note">Sipas statutit, themelimi i Shoqatës erdhi pas realizimit të projektit “Rrethimi i varrezave”. <Link href="/dokumentet">Lexo statutin origjinal →</Link></p>
            </div>
          </div>
        </section>

        <section className="section soft about-commitment-section" aria-labelledby="commitment-heading">
          <div className="shell">
            <span className="eyebrow">ANGAZHIMI YNË</span>
            <h2 id="commitment-heading">Kontribut që ndihet në komunitet.</h2>
            <div className="about-commitment-grid">
              {angazhimet.map((item, index) => (
                <article className="about-commitment-card" key={item.title}>
                  <span className="card-no">{String(index + 1).padStart(2, "0")}</span>
                  <h3>{item.title}</h3>
                  <p>{item.text}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="section about-contribution-section">
          <div className="shell about-contribution-grid">
            <div>
              <span className="eyebrow light">KONTRIBUTI I PËRBASHKËT</span>
              <h2>Çdo kontribut ka vlerë.</h2>
            </div>
            <div>
              <p>Çdo anëtarësi dhe donacion përfaqëson një kontribut në këtë përpjekje të përbashkët. Shoqata synon që projektet, aktivitetet dhe raportet financiare të paraqiten qartë, me informacione të verifikuara.</p>
              <div className="about-contribution-actions">
                <Link className="button primary" href="/projektet">Shiko projektet</Link>
                <Link className="button ghost" href="/transparenca">Transparenca</Link>
              </div>
            </div>
          </div>
        </section>

        <section className="section about-ending-section">
          <div className="shell">
            <span className="eyebrow">SHOQATA RAINCA</span>
            <h2>Për Raincën. Bashkë.</h2>
            <p>Një lidhje e vazhdueshme mes bashkëvendasve dhe vendlindjes.</p>
          </div>
        </section>
      </main>

      <footer>
        <div className="shell footer-grid">
          <div><strong>Shoqata Rainca</strong><span>shoqata-rainca.ch</span></div>
          <div><span>info@shoqata-rainca.ch</span><span>Facebook: Shoqata Rainca</span></div>
          <div className="footer-note">Bashkë për Raincën</div>
        </div>
      </footer>
    </>
  );
}
