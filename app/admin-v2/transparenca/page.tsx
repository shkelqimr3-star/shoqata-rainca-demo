import Link from "next/link";
import DirectUploadField from "@/components/admin/DirectUploadField";
import { redirect } from "next/navigation";
import { isV2Admin } from "@/lib/v2-auth";
import {
  formatMoney,
  formatPublicDate,
  getV2Documents,
  getV2Donations,
  getV2FinancialReports,
  getV2TransparencySettings
} from "@/lib/v2-transparency";
import { logoutV2 } from "../actions";
import {
  createDocumentV2,
  createDonationV2,
  createFinancialReport,
  deleteDocumentV2,
  deleteDonationV2,
  deleteFinancialReport,
  saveTransparencySettings,
  updateDocumentV2,
  updateDonationV2,
  updateFinancialReport
} from "./actions";

export const dynamic = "force-dynamic";

export default async function AdminTransparencyPage({
  searchParams
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  if (!(await isV2Admin())) redirect("/admin-v2");
  const params = await searchParams;

  const [settings, reports, documents, donations] = await Promise.all([
    getV2TransparencySettings(),
    getV2FinancialReports(true),
    getV2Documents(true),
    getV2Donations(true)
  ]);

  const saved =
    params.settingsSaved ||
    params.reportCreated ||
    params.reportSaved ||
    params.reportDeleted ||
    params.documentCreated ||
    params.documentSaved ||
    params.documentDeleted ||
    params.donationCreated ||
    params.donationSaved ||
    params.donationDeleted;

  return (
    <main className="admin-v2">
      <div className="shell">
        <div className="admin-v2-topbar">
          <div>
            <span className="eyebrow">ADMIN · SHOQATA RAINCA</span>
            <h1>Transparenca</h1>
          </div>
          <div className="admin-v2-actions">
            <Link href="/admin-v2">Pagesat</Link>
            <Link href="/admin-v2/antaret">Anëtarët</Link>
            <Link href="/admin-v2/permbajtja">Përmbajtja</Link>
            <Link href="/transparenca">Publikisht</Link>
            <form action={logoutV2}><button type="submit">Dil</button></form>
          </div>
        </div>

        {saved && <div className="admin-v2-success">Ndryshimi u ruajt dhe faqja publike u përditësua.</div>}
        {params.error && <div className="admin-v2-alert">Kontrollo fushat e formularit ({String(params.error)}).</div>}

        <section className="admin-content-section">
          <div className="admin-content-heading">
            <div><span className="eyebrow">SETTINGS</span><h2>Të dhënat kryesore</h2></div>
          </div>
          <form action={saveTransparencySettings} className="admin-v2-card transparency-settings-form">
            <label><span>Emri i Shoqatës</span><input name="associationName" defaultValue={settings.associationName} /></label>
            <label><span>Email</span><input name="officialEmail" type="email" defaultValue={settings.officialEmail} /></label>
            <label><span>Domain</span><input name="domain" defaultValue={settings.domain} /></label>
            <label><span>Tarifa vjetore</span><input name="membershipFee" type="number" min="0" step="0.01" defaultValue={settings.membershipFee} /></label>
            <label><span>Valuta</span><input name="currency" defaultValue={settings.currency} /></label>
            <label className="span-two"><span>IBAN</span><input name="iban" defaultValue={settings.iban || ""} /></label>
            <label><span>Banka</span><input name="bankName" defaultValue={settings.bankName || ""} /></label>
            <label><span>BIC / SWIFT</span><input name="bic" defaultValue={settings.bic || ""} /></label>
            <DirectUploadField className="span-two" name="qrUrl" label="QR image" accept="image/jpeg,image/png,image/webp,image/gif" defaultValue={settings.qrUrl || ""} />
            <label className="span-two"><span>Facebook</span><input name="facebookUrl" defaultValue={settings.facebookUrl || ""} /></label>
            <label className="span-two"><span>Udhëzim për pagesa nga Gjermania</span><textarea name="germanyPaymentNote" rows={3} defaultValue={settings.germanyPaymentNote || ""} /></label>
            <label className="span-two"><span>Shënim për donacionet</span><textarea name="donationNote" rows={3} defaultValue={settings.donationNote || ""} /></label>
            <button className="span-two" type="submit">Ruaj Settings</button>
          </form>
        </section>

        <section className="admin-content-section">
          <div className="admin-content-heading">
            <div><span className="eyebrow">FINANCAT</span><h2>Raportet financiare</h2></div>
            <Link href="/transparenca">Shiko publikisht →</Link>
          </div>
          <div className="admin-content-grid">
            <form action={createFinancialReport} className="admin-v2-card admin-content-form">
              <h3>Shto raport</h3>
              <div className="admin-content-inline">
                <label><span>Viti</span><input name="year" type="number" defaultValue="2026" required /></label>
                <label><span>Titulli</span><input name="title" placeholder="Raporti financiar 2026" required /></label>
              </div>
              <div className="admin-content-inline">
                <label><span>Të hyra (opsionale)</span><input name="income" type="number" min="0" step="0.01" /></label>
                <label><span>Shpenzime (opsionale)</span><input name="expenses" type="number" min="0" step="0.01" /></label>
              </div>
              <label><span>Shënim</span><textarea name="note" rows={3} /></label>
              <DirectUploadField name="pdfUrl" label="PDF / URL" accept="application/pdf" />
              <label className="admin-check"><input name="published" type="checkbox" /> Publiko</label>
              <button type="submit">Shto raportin</button>
            </form>

            <div className="admin-content-list">
              {reports.length === 0 && <div className="admin-v2-empty">Ende nuk ka raporte financiare. Nuk po krijojmë shifra pa dokumente reale.</div>}
              {reports.map((report) => (
                <details key={report.id} className="admin-content-item">
                  <summary>
                    <div><strong>{report.year} · {report.title}</strong><span>Të hyra: {formatMoney(report.income)} · Shpenzime: {formatMoney(report.expenses)}</span></div>
                    <b>{report.published ? "Publik" : "Draft"}</b>
                  </summary>
                  <form action={updateFinancialReport} className="admin-content-edit">
                    <input type="hidden" name="id" value={report.id} />
                    <label><span>Viti</span><input name="year" type="number" defaultValue={report.year} required /></label>
                    <label><span>Titulli</span><input name="title" defaultValue={report.title} required /></label>
                    <label><span>Të hyra</span><input name="income" type="number" min="0" step="0.01" defaultValue={report.income || ""} /></label>
                    <label><span>Shpenzime</span><input name="expenses" type="number" min="0" step="0.01" defaultValue={report.expenses || ""} /></label>
                    <label className="span-two"><span>Shënim</span><textarea name="note" rows={3} defaultValue={report.note || ""} /></label>
                    <DirectUploadField className="span-two" name="pdfUrl" label="PDF / URL" accept="application/pdf" defaultValue={report.pdfUrl || ""} />
                    <label className="admin-check span-two"><input name="published" type="checkbox" defaultChecked={report.published} /> Publiko</label>
                    <button type="submit">Ruaj raportin</button>
                  </form>
                  <form action={deleteFinancialReport} className="admin-content-delete"><input type="hidden" name="id" value={report.id} /><button type="submit">Fshi raportin</button></form>
                </details>
              ))}
            </div>
          </div>
        </section>

        <section className="admin-content-section">
          <div className="admin-content-heading">
            <div><span className="eyebrow">DOKUMENTET</span><h2>PDF & formularë</h2></div>
            <Link href="/dokumentet">Shiko publikisht →</Link>
          </div>
          <div className="admin-content-grid">
            <form action={createDocumentV2} className="admin-v2-card admin-content-form">
              <h3>Shto dokument</h3>
              <label><span>Titulli</span><input name="title" required /></label>
              <div className="admin-content-inline">
                <label><span>Kategoria</span><input name="category" placeholder="Statut / Raport / Formular" required /></label>
                <label><span>Viti</span><input name="year" type="number" /></label>
              </div>
              <label><span>Përshkrimi</span><textarea name="description" rows={3} /></label>
              <DirectUploadField name="fileUrl" label="File / URL" accept="application/pdf,image/jpeg,image/png,image/webp" />
              <label className="admin-check"><input name="published" type="checkbox" defaultChecked /> Publiko</label>
              <button type="submit">Shto dokumentin</button>
            </form>

            <div className="admin-content-list">
              {documents.length === 0 && <div className="admin-v2-empty">Ende nuk ka dokumente publike të regjistruara.</div>}
              {documents.map((document) => (
                <details key={document.id} className="admin-content-item">
                  <summary>
                    <div><strong>{document.title}</strong><span>{document.category}{document.year ? ` · ${document.year}` : ""}</span></div>
                    <b>{document.published ? "Publik" : "Draft"}</b>
                  </summary>
                  <form action={updateDocumentV2} className="admin-content-edit">
                    <input type="hidden" name="id" value={document.id} />
                    <label><span>Titulli</span><input name="title" defaultValue={document.title} required /></label>
                    <label><span>Kategoria</span><input name="category" defaultValue={document.category} required /></label>
                    <label><span>Viti</span><input name="year" type="number" defaultValue={document.year || ""} /></label>
                    <DirectUploadField name="fileUrl" label="File / URL" accept="application/pdf,image/jpeg,image/png,image/webp" defaultValue={document.fileUrl} />
                    <label className="span-two"><span>Përshkrimi</span><textarea name="description" rows={3} defaultValue={document.description || ""} /></label>
                    <label className="admin-check span-two"><input name="published" type="checkbox" defaultChecked={document.published} /> Publiko</label>
                    <button type="submit">Ruaj dokumentin</button>
                  </form>
                  <form action={deleteDocumentV2} className="admin-content-delete"><input type="hidden" name="id" value={document.id} /><button type="submit">Fshi dokumentin</button></form>
                </details>
              ))}
            </div>
          </div>
        </section>

        <section className="admin-content-section">
          <div className="admin-content-heading">
            <div><span className="eyebrow">DONACIONET</span><h2>Evidenca publike</h2></div>
            <Link href="/donacionet">Shiko publikisht →</Link>
          </div>
          <div className="admin-content-grid">
            <form action={createDonationV2} className="admin-v2-card admin-content-form">
              <h3>Shto donacion</h3>
              <div className="admin-content-inline">
                <label><span>Data</span><input name="donationDate" type="date" required /></label>
                <label><span>Shuma</span><input name="amount" type="number" min="0" step="0.01" required /></label>
              </div>
              <label><span>Valuta</span><input name="currency" defaultValue="CHF" /></label>
              <label><span>Qëllimi</span><input name="purpose" required placeholder="p.sh. Ndihmë familjare" /></label>
              <label><span>Shënim</span><textarea name="note" rows={3} /></label>
              <label className="admin-check"><input name="published" type="checkbox" /> Publiko në faqe</label>
              <button type="submit">Shto donacionin</button>
            </form>

            <div className="admin-content-list">
              {donations.length === 0 && <div className="admin-v2-empty">Ende nuk ka donacione të regjistruara.</div>}
              {donations.map((donation) => (
                <details key={donation.id} className="admin-content-item">
                  <summary>
                    <div><strong>{donation.purpose}</strong><span>{formatPublicDate(donation.donationDate)} · {formatMoney(donation.amount, donation.currency)}</span></div>
                    <b>{donation.published ? "Publik" : "Privat"}</b>
                  </summary>
                  <form action={updateDonationV2} className="admin-content-edit">
                    <input type="hidden" name="id" value={donation.id} />
                    <label><span>Data</span><input name="donationDate" type="date" defaultValue={donation.donationDate} required /></label>
                    <label><span>Shuma</span><input name="amount" type="number" min="0" step="0.01" defaultValue={donation.amount} required /></label>
                    <label><span>Valuta</span><input name="currency" defaultValue={donation.currency} /></label>
                    <label><span>Qëllimi</span><input name="purpose" defaultValue={donation.purpose} required /></label>
                    <label className="span-two"><span>Shënim</span><textarea name="note" rows={3} defaultValue={donation.note || ""} /></label>
                    <label className="admin-check span-two"><input name="published" type="checkbox" defaultChecked={donation.published} /> Publiko</label>
                    <button type="submit">Ruaj donacionin</button>
                  </form>
                  <form action={deleteDonationV2} className="admin-content-delete"><input type="hidden" name="id" value={donation.id} /><button type="submit">Fshi donacionin</button></form>
                </details>
              ))}
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
