import SiteFooter from "@/components/public/SiteFooter";
import SiteHeader from "@/components/public/SiteHeader";
import { getV2TransparencySettings } from "@/lib/v2-transparency";

export const dynamic = "force-dynamic";

export default async function ContactPage() {
  const settings = await getV2TransparencySettings();

  return (
    <>
      <SiteHeader />
      <main>
        <section className="listing-hero contact-hero">
          <div className="shell">
            <span className="eyebrow light">KONTAKT</span>
            <h1>Na kontaktoni.</h1>
            <p>Për anëtarësi, pagesa, dokumente ose informacione rreth aktiviteteve të Shoqatës.</p>
          </div>
        </section>

        <section className="section">
          <div className="shell contact-grid">
            <article className="contact-card primary-contact-card">
              <span className="eyebrow">EMAIL</span>
              <h2>{settings.officialEmail}</h2>
              <p>Përdoreni emailin zyrtar për kërkesa dhe dokumente që duhen trajtuar nga Shoqata.</p>
              <a className="button dark-public-button" href={`mailto:${settings.officialEmail}`}>Shkruaj email</a>
            </article>

            <div className="contact-side-grid">
              <article className="contact-card">
                <span className="eyebrow">WEB</span>
                <h3>{settings.domain}</h3>
                <p>Faqja zyrtare e Shoqatës Rainca.</p>
              </article>
              <article className="contact-card">
                <span className="eyebrow">FACEBOOK</span>
                <h3>Shoqata Rainca</h3>
                <p>Lajme dhe njoftime nga aktivitetet e Shoqatës.</p>
                {settings.facebookUrl && <a href={settings.facebookUrl} target="_blank" rel="noreferrer">Hape Facebook →</a>}
              </article>
              <article className="contact-card">
                <span className="eyebrow">ANËTARËSIA</span>
                <h3>{settings.membershipFee} {settings.currency} / vit</h3>
                <p>Anëtarët e rinj kontaktojnë fillimisht Shoqatën dhe regjistrohen nga administratori.</p>
              </article>
              <article className="contact-card">
                <span className="eyebrow">EVENTET</span>
                <h3>Rezervimet</h3>
                <p>Rezervimet për evente bëhen përmes kontakteve që Shoqata publikon në njoftimin ose flyer-in përkatës.</p>
              </article>
            </div>
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
