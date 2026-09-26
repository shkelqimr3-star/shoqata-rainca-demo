import Link from "next/link";
import {
  formatMoney,
  getV2Documents,
  getV2Donations,
  getV2FinancialReports,
  getV2TransparencySettings
} from "@/lib/v2-transparency";

export const dynamic = "force-dynamic";

export default async function TransparencyPage() {
  const [settings, reports, documents, donations] = await Promise.all([
    getV2TransparencySettings(),
    getV2FinancialReports(),
    getV2Documents(),
    getV2Donations()
  ]);

  const totalDonations = donations
    .filter((item) => item.currency === "CHF")
    .reduce((sum, item) => sum + Number(item.amount || 0), 0);

  return (
    <>
      <header className="site-header">
        <div className="shell nav-wrap">
          <Link className="brand" href="/"><span className="brand-mark">R</span><span><strong>Shoqata Rainca</strong><small>Që nga viti 2010</small></span></Link>
          <nav><Link href="/">Ballina</Link><Link href="/projektet">Projektet</Link><Link href="/transparenca">Transparenca</Link><Link href="/dokumentet">Dokumentet</Link><Link href="/donacionet">Donacionet</Link></nav>
        </div>
      </header>
      <main>
        <section className="listing-hero">
          <div className="shell"><span className="eyebrow light">TRANSPARENCA</span><h1>Raporte të qarta.</h1><p>Publikohen vetëm të dhënat dhe dokumentet që Shoqata i ka verifikuar.</p></div>
        </section>

        <section className="section">
          <div className="shell">
            <div className="section-head"><div><span className="eyebrow">FINANCAT</span><h2>Raportet financiare</h2></div></div>
            {reports.length === 0 ? (
              <div className="public-empty">Ende nuk ka raporte financiare të publikuara. Nuk shfaqen shifra të pa verifikuara.</div>
            ) : (
              <div className="transparency-report-grid">
                {reports.map((report) => {
                  const balance = report.income !== null && report.expenses !== null
                    ? Number(report.income) - Number(report.expenses)
                    : null;
                  return <article key={report.id} className="transparency-report-card">
                    <div className="report-year">{report.year}</div>
                    <h3>{report.title}</h3>
                    <div className="report-numbers">
                      <div><span>Të hyra</span><strong>{formatMoney(report.income)}</strong></div>
                      <div><span>Shpenzime</span><strong>{formatMoney(report.expenses)}</strong></div>
                      <div><span>Bilanci</span><strong>{balance === null ? "—" : formatMoney(String(balance))}</strong></div>
                    </div>
                    {report.note && <p>{report.note}</p>}
                    {report.pdfUrl && <a className="document-link" href={report.pdfUrl} target="_blank" rel="noreferrer">Hape raportin PDF →</a>}
                  </article>;
                })}
              </div>
            )}
          </div>
        </section>

        <section className="section soft">
          <div className="shell transparency-public-grid">
            <div>
              <span className="eyebrow">DOKUMENTET</span>
              <h2>{documents.length} dokumente publike</h2>
              <p>Statuti, formularët dhe raportet publikohen në një listë të veçantë.</p>
              <Link className="button dark-public-button" href="/dokumentet">Shiko dokumentet</Link>
            </div>
            <div>
              <span className="eyebrow">DONACIONET</span>
              <h2>{donations.length} evidenca publike</h2>
              <p>{donations.length ? `Totali i donacioneve publike në CHF: ${formatMoney(String(totalDonations))}.` : "Donacionet shfaqen vetëm kur administratori vendos t’i publikojë."}</p>
              <Link className="button dark-public-button" href="/donacionet">Shiko donacionet</Link>
            </div>
          </div>
        </section>

        <section className="section donation-bank-strip">
          <div className="shell bank-strip-grid">
            <div><span className="eyebrow light">ANËTARËSIA</span><h2>{settings.membershipFee} {settings.currency} / vit</h2></div>
            <div><span>IBAN</span><strong>{settings.iban || "Do të publikohet pasi të verifikohet nga Shoqata."}</strong></div>
          </div>
        </section>
      </main>
    </>
  );
}
