import Link from "next/link";
import MemberDirectoryV2 from "@/components/MemberDirectoryV2";
import { memberRecords, membershipSnapshot } from "@/data/member-records";

export default function MembersPage() {
  return (
    <>
      <header className="site-header">
        <div className="shell nav-wrap">
          <Link className="brand" href="/" aria-label="Shoqata Rainca">
            <span className="brand-mark">R</span>
            <span><strong>Shoqata Rainca</strong><small>Që nga viti 2010</small></span>
          </Link>
          <nav>
            <Link href="/">Ballina</Link>
            <Link href="/#aktivitetet">Aktivitetet</Link>
            <Link href="/antaret">Anëtarët</Link>
            <Link href="/#anetaresia">Anëtarësia</Link>
          </nav>
        </div>
      </header>

      <main>
        <section className="members-hero">
          <div className="shell members-hero-grid">
            <div>
              <span className="eyebrow light">SHOQATA RAINCA · ANËTARËT</span>
              <h1>Lista e anëtarëve</h1>
              <p>Publikohen vetëm emri, mbiemri dhe pagesat e regjistruara sipas viteve. Adresa, telefoni dhe emaili nuk shfaqen publikisht.</p>
              <small>Burimi fillestar: lista e përditësuar më {membershipSnapshot.updatedAt}.</small>
            </div>
            <aside className="members-stat">
              <span>Anëtarë në listë</span>
              <strong>{memberRecords.length}</strong>
              <small>{membershipSnapshot.rowCounts[2026]} me pagesë të regjistruar për 2026</small>
            </aside>
          </div>
        </section>

        <section className="section members-section">
          <div className="shell">
            <div className="section-head">
              <div><span className="eyebrow">DIREKTORIA</span><h2>Kërko anëtarin</h2></div>
              <p className="section-note">Statusi tregon çfarë është regjistruar në listën burimore; nuk bëhen korrigjime automatike.</p>
            </div>
            <MemberDirectoryV2 members={memberRecords} />
            <div className="source-note">
              <strong>Shënim i burimit:</strong> numri 24 paraqitet dy herë në dokumentin origjinal. Të dhënat janë ruajtur siç janë në listë dhe do të korrigjohen vetëm pasi Shoqata t’i verifikojë.
            </div>
          </div>
        </section>

        <section className="section soft">
          <div className="shell neighborhood-note">
            <div><span className="eyebrow">LAGJET / MAHALLAT</span><h2>Ndarja shtohet më vonë.</h2></div>
            <p>Struktura e faqes është përgatitur që secilit anëtar t’i caktohet lagjja pa humbur historikun e pagesave. Për momentin nuk po vendosim lagje pa verifikim.</p>
          </div>
        </section>
      </main>

      <footer>
        <div className="shell footer-grid">
          <div><strong>Shoqata Rainca</strong><span>shoqata-rainca.ch</span></div>
          <div><span>info@shoqata-rainca.ch</span><span>Facebook: Shoqata Rainca</span></div>
          <div className="footer-note">Lista · {membershipSnapshot.updatedAt}</div>
        </div>
      </footer>
    </>
  );
}
