import Link from "next/link";
import { getV2TransparencySettings } from "@/lib/v2-transparency";

export default async function SiteFooter() {
  const settings = await getV2TransparencySettings();

  return (
    <footer className="site-footer">
      <div className="shell final-footer-grid">
        <div className="footer-brand-block">
          <strong>Shoqata Rainca</strong>
          <p>Për Raincën. Bashkë me diasporën.</p>
          <span>Që nga viti 2010</span>
        </div>

        <div className="footer-link-column">
          <span>Faqja</span>
          <Link href="/rreth">Rreth nesh</Link>
          <Link href="/kontakt">Kontakt</Link>
          <Link href="/eventet">Eventet</Link>
          <Link href="/projektet">Projektet</Link>
        </div>

        <div className="footer-link-column">
          <span>Informacion</span>
          <Link href="/antaret">Anëtarët</Link>
          <Link href="/transparenca">Transparenca</Link>
          <Link href="/dokumentet">Dokumentet</Link>
          <Link href="/donacionet">Donacionet</Link>
        </div>

        <div className="footer-contact-block">
          <span>Kontakt</span>
          <a href={`mailto:${settings.officialEmail}`}>{settings.officialEmail}</a>
          {settings.facebookUrl && <a href={settings.facebookUrl} target="_blank" rel="noreferrer">Facebook</a>}
          <small>{settings.domain}</small>
        </div>
      </div>
      <div className="shell footer-bottom">
        <span>© 2026 Shoqata Rainca</span>
        <span>Version prezantimi · faqja e re</span>
      </div>
    </footer>
  );
}
