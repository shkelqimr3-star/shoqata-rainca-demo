import Link from "next/link";
import { redirect } from "next/navigation";
import AdminMembersManager from "@/components/admin/AdminMembersManager";
import { getV2Members } from "@/lib/v2-members";
import { isV2Admin } from "@/lib/v2-auth";
import { logoutV2 } from "../actions";

export const dynamic = "force-dynamic";

export default async function AdminMembersPage({ searchParams }: { searchParams: Promise<Record<string,string | string[] | undefined>> }) {
  if (!(await isV2Admin())) redirect("/admin-v2");
  const params = await searchParams;
  const { members, databaseMode } = await getV2Members();
  const active = members.filter((m) => !m.archived).length;
  const withNeighborhood = members.filter((m) => !m.archived && m.neighborhood).length;

  return (
    <main className="admin-v2">
      <div className="shell">
        <div className="admin-v2-topbar">
          <div><span className="eyebrow">ADMIN · SHOQATA RAINCA</span><h1>Anëtarët</h1></div>
          <div className="admin-v2-actions">
            <Link href="/admin-v2">Pagesat</Link>
            <Link href="/antaret">Lista publike</Link>
            <form action={logoutV2}><button type="submit">Dil</button></form>
          </div>
        </div>

        <div className="admin-v2-stats">
          <article><span>Aktivë</span><strong>{active}</strong><small>shfaqen publikisht</small></article>
          <article><span>Me lagje</span><strong>{withNeighborhood}</strong><small>të verifikuar</small></article>
          <article><span>Databaza</span><strong className={databaseMode ? "db-ok" : "db-off"}>{databaseMode ? "LIVE" : "OFF"}</strong><small>ruajtje reale</small></article>
        </div>

        {params.created === "1" && <div className="admin-v2-success">Anëtari i ri u shtua.</div>}
        {params.saved === "1" && <div className="admin-v2-success">Të dhënat e anëtarit u ruajtën.</div>}
        {params.error && <div className="admin-v2-alert">Ndryshimi nuk u ruajt ({String(params.error)}).</div>}

        <AdminMembersManager members={members} databaseMode={databaseMode} />
      </div>
    </main>
  );
}
