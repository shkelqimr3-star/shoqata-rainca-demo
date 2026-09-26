import Link from "next/link";
import MemberDirectoryV2 from "@/components/MemberDirectoryV2";
import { membershipSnapshot } from "@/data/member-records";
import { getV2Members } from "@/lib/v2-members";

export const dynamic = "force-dynamic";

export default async function MembersPage() {
  const { members, databaseMode, overrides } = await getV2Members();
  const paid2026 = members.filter((m) => m.payments["2026"] > 0).length;

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
              <small>Burimi fillestar: lista e përditësuar më {membershipSnapshot.updatedAt}.{databaseMode && overrides.length > 0 ? " Ndryshimet e verifikuara nga Admini aplikohen mbi listën burimore." : ""}</small>
            </div>
            <aside className="members-stat">
              <span>Anëtarë në listë</span>
              <strong>{activeMembers.length}</strong>
              <small>{paid2026} me pagesë të regjistruar për 2026</small>
            </aside>
          </div>
        </section>

        <section className="section members-section">
          <div className="shell">
            <div className="section-head">
              <div><span className="eyebrow">DIREKTORIA</span><h2>Kërko anëtarin</h2></div>
              <p className="section-note">Statusi tregon çfarë është regjistruar në listën burimore dhe çdo ndryshim të ruajtur nga administratori.</p>
            </div>
            <MemberDirectoryV2 members={activeMembers} />
            <div className="source-note">
              <strong>Shënim i burimit:</strong> numri 24 paraqitet dy herë në dokumentin origjinal. Të dhënat janë ruajtur siç janë në listë dhe korrigjohen vetëm pas verifikimit nga Shoqata.
            </div>
          </div>
        </section>

        <section className="section soft">
          <div className="shell neighborhood-note">
            <div><span className="eyebrow">LAGJET / MAHALLAT</span><h2>Ndarja shtohet më vonë.</h2></div>
            <p>Struktura është përgatitur që secilit anëtar t’i caktohet lagjja pa humbur historikun e pagesave. Për momentin nuk po vendosim lagje pa verifikim.</p>
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
