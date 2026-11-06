import SiteFooter from "@/components/public/SiteFooter";
import SiteHeader from "@/components/public/SiteHeader";
import Link from "next/link";
import MemberDirectoryV2 from "@/components/MemberDirectoryV2";
import { membershipSnapshot } from "@/data/member-records";
import { getV2Members } from "@/lib/v2-members";

export const dynamic = "force-dynamic";

export default async function MembersPage() {
  const { members, databaseMode, overrides } = await getV2Members();
  const activeMembers = members.filter((m) => !m.archived);
  const years = ["2023", "2024", "2025", "2026"] as const;
  const paymentStats = years.map((year) => {
    const paid = activeMembers.filter((m) => m.payments[year] > 0).length;
    const percentage = activeMembers.length ? Math.round((paid / activeMembers.length) * 100) : 0;
    return { year, paid, percentage };
  });
  const currentStat = paymentStats.find((item) => item.year === "2026")!;
  const maxPaid = Math.max(...paymentStats.map((item) => item.paid), 1);

  return (
    <>
      <SiteHeader />
      <main>
        <section className="members-hero">
          <div className="shell members-hero-grid">
            <div>
              <span className="eyebrow light">SHOQATA RAINCA · ANËTARËT</span>
              <h1>Lista e anëtarëve</h1>
              <p>Publikohen vetëm emri, mbiemri dhe pagesat e regjistruara sipas viteve. Adresa, telefoni dhe emaili nuk shfaqen publikisht.</p>
              <small>Burimi fillestar: lista e përditësuar më {membershipSnapshot.updatedAt}.{databaseMode && overrides.length > 0 ? " Ndryshimet e verifikuara nga Admini aplikohen mbi listën burimore." : ""}</small>
            </div>
            <aside className="members-stat members-stat-current">
              <span>Pagesa e anëtarësisë · 2026</span>
              <div className="members-current-number">
                <strong>{currentStat.paid}</strong>
                <em>nga {activeMembers.length}</em>
              </div>
              <small>{currentStat.percentage}% e anëtarëve kanë pagesë të regjistruar për këtë vit</small>
            </aside>
          </div>
        </section>


        <section className="section payment-history-section">
          <div className="shell">
            <div className="section-head payment-history-head">
              <div>
                <span className="eyebrow">PAGESAT NDËR VITE</span>
                <h2>Sa anëtarë kanë paguar?</h2>
              </div>
              <p className="section-note">Numërohen anëtarët që kanë një pagesë të regjistruar më të madhe se 0 për vitin përkatës. Shifrat përditësohen automatikisht kur administratori regjistron ose korrigjon një pagesë.</p>
            </div>

            <div className="payment-history-grid">
              {paymentStats.map((stat) => (
                <article key={stat.year} className={`payment-year-card ${stat.year === "2026" ? "is-current" : ""}`}>
                  <div className="payment-year-top">
                    <span>{stat.year}</span>
                    {stat.year === "2026" && <b>Këtë vit</b>}
                  </div>
                  <div className="payment-year-number">
                    <strong>{stat.paid}</strong>
                    <span>anëtarë</span>
                  </div>
                  <div className="payment-progress" aria-label={`${stat.percentage}% kanë paguar në ${stat.year}`}>
                    <i style={{ width: `${(stat.paid / maxPaid) * 100}%` }} />
                  </div>
                  <div className="payment-year-bottom">
                    <span>{stat.percentage}% e listës aktuale</span>
                    <span>{activeMembers.length - stat.paid} pa pagesë</span>
                  </div>
                </article>
              ))}
            </div>
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

      <SiteFooter />
    </>
  );
}
