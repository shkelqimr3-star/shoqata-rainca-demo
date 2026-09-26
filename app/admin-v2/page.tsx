// redeploy-after-admin-v2-preview-env-2
import Link from "next/link";
import { getV2Members } from "@/lib/v2-members";
import { isV2Admin, v2AdminConfigured } from "@/lib/v2-auth";
import { deletePaymentOverride, loginV2, logoutV2, savePaymentOverride } from "./actions";

function methodLabel(value: string) {
  const map: Record<string,string> = { bank: "Bankë", qr: "QR", cash: "Cash", twint: "TWINT", "ch-dd": "CH-DD" };
  return map[value] || value;
}

export default async function AdminV2Page({ searchParams }: { searchParams: Promise<Record<string,string | string[] | undefined>> }) {
  const params = await searchParams;
  const admin = await isV2Admin();

  if (!admin) {
    return (
      <main className="admin-v2-login">
        <div className="admin-v2-login-card">
          <Link href="/" className="admin-v2-back">← Ballina</Link>
          <span className="eyebrow">ADMIN · V2</span>
          <h1>Paneli i Shoqatës</h1>
          <p>Ky panel nuk shfaqet në menunë publike. Përdoret vetëm nga administratori i autorizuar.</p>
          {!v2AdminConfigured() && <div className="admin-v2-alert">Fjalëkalimi i adminit nuk është konfiguruar ende në Vercel.</div>}
          {params.error === "1" && <div className="admin-v2-alert">Fjalëkalimi nuk është i saktë.</div>}
          <form action={loginV2}>
            <label><span>Fjalëkalimi</span><input name="password" type="password" autoComplete="current-password" required /></label>
            <button type="submit" disabled={!v2AdminConfigured()}>Hyr në Admin</button>
          </form>
        </div>
      </main>
    );
  }

  const { members, databaseMode, overrides } = await getV2Members();
  const activeMembers = members.filter((m) => !m.archived);
  const recent = [...overrides].sort((a,b) => b.updatedAt.getTime() - a.updatedAt.getTime()).slice(0,20);

  return (
    <main className="admin-v2">
      <div className="shell">
        <div className="admin-v2-topbar">
          <div>
            <span className="eyebrow">ADMIN · SHOQATA RAINCA</span>
            <h1>Pagesat e anëtarëve</h1>
          </div>
          <div className="admin-v2-actions">
            <Link href="/admin-v2/antaret">Anëtarët</Link>
            <Link href="/admin-v2/permbajtja">Përmbajtja</Link>
            <Link href="/admin-v2/transparenca">Transparenca</Link>
            <Link href="/admin-v2/galeria">Galeria</Link>
            <Link href="/antaret">Shiko listën publike</Link>
            <form action={logoutV2}><button type="submit">Dil</button></form>
          </div>
        </div>

        <div className="admin-v2-stats">
          <article><span>Anëtarë</span><strong>{members.length}</strong><small>lista bazë</small></article>
          <article><span>Ndryshime Admin</span><strong>{overrides.length}</strong><small>pagesa të ruajtura</small></article>
          <article><span>Databaza</span><strong className={databaseMode ? "db-ok" : "db-off"}>{databaseMode ? "LIVE" : "OFF"}</strong><small>{databaseMode ? "ruajtje reale" : "vetëm preview"}</small></article>
        </div>

        {!databaseMode && <div className="admin-v2-alert">DATABASE_URL nuk është aktiv në këtë environment. Formulari nuk duhet përdorur derisa databaza të lidhet.</div>}
        {params.saved === "1" && <div className="admin-v2-success">Pagesa u ruajt dhe lista publike u përditësua.</div>}
        {params.reverted === "1" && <div className="admin-v2-success">Ndryshimi i pagesës u hoq dhe u rikthye vlera nga lista bazë.</div>}
        {params.error && params.error !== "1" && <div className="admin-v2-alert">Nuk u ruajt ndryshimi ({String(params.error)}).</div>}

        <div className="admin-v2-grid">
          <section className="admin-v2-card">
            <span className="eyebrow">REGJISTRO / NDRYSHO</span>
            <h2>Pagesa vjetore</h2>
            <p>Një ndryshim këtu mbivendos vetëm pagesën e zgjedhur. Lista burimore mbetet e paprekur si referencë.</p>
            <form action={savePaymentOverride} className="admin-v2-form">
              <label><span>Anëtari</span><select name="sourceIndex" required defaultValue="">
                <option value="" disabled>Zgjidh anëtarin…</option>
                {activeMembers.map((m) => <option key={m.sourceIndex} value={m.sourceIndex}>{m.sourceNo}. {m.firstName} {m.lastName}</option>)}
              </select></label>
              <div className="admin-v2-inline">
                <label><span>Viti</span><select name="year" defaultValue="2026"><option>2023</option><option>2024</option><option>2025</option><option>2026</option></select></label>
                <label><span>Shuma CHF</span><input name="amount" type="number" min="0" step="1" defaultValue="100" required /></label>
              </div>
              <label><span>Mënyra</span><select name="method" defaultValue="bank"><option value="bank">Bankë</option><option value="qr">QR</option><option value="cash">Cash</option><option value="twint">TWINT</option><option value="ch-dd">CH-DD</option></select></label>
              <button type="submit" disabled={!databaseMode}>Ruaj pagesën</button>
            </form>
          </section>

          <section className="admin-v2-card">
            <span className="eyebrow">HISTORIKU</span>
            <h2>Ndryshimet e fundit</h2>
            {recent.length === 0 ? <div className="admin-v2-empty">Ende nuk ka ndryshime të ruajtura nga Admin v2.</div> :
              <div className="admin-v2-recent">{recent.map((row) => {
                const member = members.find((m) => m.sourceIndex === row.sourceIndex);
                return <article key={row.id}><div><strong>{member?.firstName} {member?.lastName}</strong><span>{row.year} · {methodLabel(row.method)}</span></div><div className="admin-payment-row-actions"><b>{row.amount > 0 ? `${row.amount} CHF` : "Pa pagesë"}</b><form action={deletePaymentOverride}><input type="hidden" name="id" value={row.id} /><button type="submit">Hiq ndryshimin</button></form></div></article>;
              })}</div>
            }
          </section>
        </div>

        <div className="admin-v2-info">
          <strong>Siguri e të dhënave:</strong> ndryshimet e Admin v2 ruhen si rekorde private dhe nuk shfaqen në faqen e vjetër. Faqja e re i lexon vetëm si mbivendosje për historikun e pagesave.
        </div>
      </div>
    </main>
  );
}
