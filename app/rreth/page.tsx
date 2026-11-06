import Link from "next/link";
import SiteFooter from "@/components/public/SiteFooter";
import SiteHeader from "@/components/public/SiteHeader";

export default function AboutPage() {
  return (
    <>
      <SiteHeader />
      <main>
        <section className="listing-hero about-hero">
          <div className="shell">
            <span className="eyebrow light">RRETH SHOQATËS</span>
            <h1>Për Raincën.<br />Që nga 2010.</h1>
            <p>Shoqata Rainca është një bashkim vullnetar i bashkëvendasve, i krijuar për të mbështetur Raincën, familjet në nevojë dhe projekte me vlerë për komunitetin.</p>
          </div>
        </section>

        <section className="section">
          <div className="shell about-story-grid">
            <div>
              <span className="eyebrow">HISTORIA</span>
              <h2>Një lidhje mes Raincës dhe diasporës.</h2>
            </div>
            <div className="about-copy">
              <p>Shoqata Rainca u themelua në vitin 2010 si një bashkim vullnetar i bashkëvendasve të Raincës. Qëllimi i saj është të bashkojë kontributin e anëtarëve dhe diasporës për nevojat e fshatit dhe komunitetit.</p>
              <p>Ndër vite, angazhimi i Shoqatës ka përfshirë ndihmë për familjet në nevojë, mbështetje për nxënës dhe studentë, mirëmbajtje të fshatit, aktivitete bamirëse, kulturore dhe sportive.</p>
              <p>Buxheti i Shoqatës mbështetet kryesisht te anëtarësia dhe kontributet vullnetare. Faqja e re synon që aktivitetet, pagesat dhe dokumentet publike të paraqiten më qartë dhe në një vend.</p>
            </div>
          </div>
        </section>

        <section className="section soft">
          <div className="shell values-grid">
            <article><span>01</span><h3>Komuniteti</h3><p>Mbështetje për nevojat konkrete të Raincës dhe bashkëfshatarëve.</p></article>
            <article><span>02</span><h3>Transparenca</h3><p>Informacion publik për projektet, dokumentet dhe raportet e verifikuara.</p></article>
            <article><span>03</span><h3>Diaspora</h3><p>Një urë praktike mes bashkëvendasve jashtë vendit dhe Raincës.</p></article>
          </div>
        </section>

        <section className="section communityBand">
          <div className="shell communityBandInner">
            <div><span className="eyebrow light">SHOQATA RAINCA</span><h2>Informacioni duhet të jetë i thjeshtë dhe i qartë.</h2></div>
            <div className="hero-actions"><Link className="button primary" href="/projektet">Shiko projektet</Link><Link className="button ghost" href="/kontakt">Kontakt</Link></div>
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
