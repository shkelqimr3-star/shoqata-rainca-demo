import Link from "next/link";
import {
  formatMoney,
  formatPublicDate,
  getV2Donations,
  getV2TransparencySettings
} from "@/lib/v2-transparency";

export const dynamic = "force-dynamic";

export default async function DonationsPage() {
  const [settings, donations] = await Promise.all([
    getV2TransparencySettings(),
    getV2Donations()
  ]);

  return (
    <>
      <header className="site-header"><div className="shell nav-wrap"><Link className="brand" href="/"><span className="brand-mark">R</span><span><strong>Shoqata Rainca</strong><small>Që nga viti 2010</small></span></Link><nav><Link href="/">Ballina</Link><Link href="/transparenca">Transparenca</Link><Link href="/dokumentet">Dokumentet</Link><Link href="/donacionet">Donacionet</Link></nav></div></header>
      <main>
        <section className="listing-hero"><div className="shell"><span className="eyebrow light">DONACIONET</span><h1>Mbështet Raincën.</h1><p>Donacionet janë të ndara nga pagesa vjetore e anëtarësisë.</p></div></section>

        <section className="section">
          <div className="shell donation-public-grid">
            <article className="donation-bank-card">
              <span className="eyebrow">TRANSFER BANKAR</span>
              <h2>{settings.associationName}</h2>
              <dl>
                <div><dt>IBAN</dt><dd>{settings.iban || "Ende pa u publikuar"}</dd></div>
                <div><dt>Banka</dt><dd>{settings.bankName || "—"}</dd></div>
                <div><dt>BIC / SWIFT</dt><dd>{settings.bic || "—"}</dd></div>
              </dl>
              {settings.donationNote && <p>{settings.donationNote}</p>}
              {settings.germanyPaymentNote && <div className="public-details"><strong>Pagesa nga Gjermania:</strong> {settings.germanyPaymentNote}</div>}
            </article>

            <article className="donation-qr-card">
              <span className="eyebrow">QR</span>
              <h2>Pagesa me QR</h2>
              {settings.qrUrl ? <img src={settings.qrUrl} alt="QR pagesa e Shoqatës Rainca" /> : <div className="qr-placeholder">QR do të shfaqet pasi të vendoset nga Admini.</div>}
              <small>Kontrollo gjithmonë përfituesin dhe shumën para konfirmimit.</small>
            </article>
          </div>
        </section>

        <section className="section soft">
          <div className="shell">
            <div className="section-head"><div><span className="eyebrow">EVIDENCA PUBLIKE</span><h2>Donacionet e publikuara</h2></div></div>
            {donations.length === 0 ? <div className="public-empty">Ende nuk ka donacione të publikuara në këtë faqe.</div> :
            <div className="donation-public-list">{donations.map((donation) => <article key={donation.id}><div><strong>{donation.purpose}</strong><span>{formatPublicDate(donation.donationDate)}{donation.note ? ` · ${donation.note}` : ""}</span></div><b>{formatMoney(donation.amount, donation.currency)}</b></article>)}</div>}
          </div>
        </section>
      </main>
    </>
  );
}
