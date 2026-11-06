import Link from "next/link";

const LOGO_URL = "https://image.jimcdn.com/app/cms/image/transf/dimension%3D634x10000%3Aformat%3Djpg/path/s64b15c26dfda5342/image/i900b47b3a13f12d8/version/1638393383/image.jpg";

const navItems = [
  ["/eventet", "Eventet"],
  ["/projektet", "Projektet"],
  ["/antaret", "Anëtarët"],
  ["/galeria", "Galeria"],
  ["/transparenca", "Transparenca"],
  ["/rreth", "Rreth nesh"],
  ["/kontakt", "Kontakt"]
] as const;

export default function SiteHeader() {
  return (
    <header className="site-header">
      <div className="shell nav-wrap">
        <Link className="brand brand-final" href="/" aria-label="Shoqata Rainca">
          <span className="brand-logo-wrap">
            <img src={LOGO_URL} alt="Logo Shoqata Rainca" />
          </span>
          <span className="brand-copy">
            <strong>Shoqata Rainca</strong>
            <small>Që nga viti 2010</small>
          </span>
        </Link>

        <nav className="desktop-nav" aria-label="Navigimi kryesor">
          {navItems.map(([href, label]) => (
            <Link href={href} key={href}>{label}</Link>
          ))}
        </nav>

        <details className="mobile-nav">
          <summary aria-label="Hape menunë">
            <span></span><span></span><span></span>
          </summary>
          <div className="mobile-nav-panel">
            <div className="mobile-nav-title">Navigimi</div>
            {navItems.map(([href, label]) => (
              <Link href={href} key={href}>{label}<b>→</b></Link>
            ))}
            <Link className="mobile-membership-link" href="/#anetaresia">Anëtarësia <b>→</b></Link>
          </div>
        </details>
      </div>
    </header>
  );
}
