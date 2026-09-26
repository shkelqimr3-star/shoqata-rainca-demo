"use client";

import { useMemo, useState } from "react";
import type { MemberRecord, PaymentYear } from "@/data/member-records";
import { createV2Member, deleteV2Member, updateV2MemberProfile } from "@/app/admin-v2/actions";

const years: PaymentYear[] = ["2023","2024","2025","2026"];

export default function AdminMembersManager({ members, databaseMode }: { members: MemberRecord[]; databaseMode: boolean }) {
  const [query, setQuery] = useState("");
  const [visibility, setVisibility] = useState<"active"|"archived"|"all">("active");

  const filtered = useMemo(() => {
    const q = query.trim().toLocaleLowerCase("sq");
    return members.filter((member) => {
      if (visibility === "active" && member.archived) return false;
      if (visibility === "archived" && !member.archived) return false;
      if (!q) return true;
      return `${member.firstName} ${member.lastName} ${member.neighborhood || ""}`.toLocaleLowerCase("sq").includes(q);
    });
  }, [members, query, visibility]);

  return (
    <div className="admin-members-manager">
      <section className="admin-v2-card admin-add-member">
        <span className="eyebrow">ANËTAR I RI</span>
        <h2>Shto anëtar</h2>
        <p>Anëtari shtohet vetëm nga administratori. Nuk ka regjistrim publik.</p>
        <form action={createV2Member} className="admin-member-create">
          <label><span>Emri</span><input name="firstName" required /></label>
          <label><span>Mbiemri</span><input name="lastName" required /></label>
          <label><span>Lagjja / mahalla</span><input name="neighborhood" placeholder="Lëre bosh nëse nuk është verifikuar" /></label>
          <button type="submit" disabled={!databaseMode}>Shto anëtarin</button>
        </form>
      </section>

      <section className="admin-v2-card">
        <div className="admin-member-toolbar">
          <div>
            <span className="eyebrow">MENAXHIMI</span>
            <h2>Lista e anëtarëve</h2>
          </div>
          <div className="admin-member-filters">
            <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Kërko emër, mbiemër ose lagje…" />
            <select value={visibility} onChange={(e) => setVisibility(e.target.value as "active"|"archived"|"all")}>
              <option value="active">Aktivë</option>
              <option value="archived">Arkivuar</option>
              <option value="all">Të gjithë</option>
            </select>
          </div>
        </div>

        <div className="admin-member-count"><strong>{filtered.length}</strong> anëtarë</div>
        <div className="admin-member-list">
          {filtered.map((member) => (
            <details key={member.sourceIndex} className="admin-member-row">
              <summary>
                <div>
                  <strong>{member.sourceNo}. {member.firstName} {member.lastName}</strong>
                  <span>{member.neighborhood || "Lagjja pa verifikuar"}{member.isNew ? " · anëtar i shtuar nga Admin" : ""}{member.archived ? " · ARKIVUAR" : ""}</span>
                </div>
                <div className="admin-member-years">
                  {years.map((year) => <span key={year} className={member.payments[year] > 0 ? "has-payment" : ""}>{year.slice(2)}: {member.payments[year] || "—"}</span>)}
                </div>
              </summary>

              <form action={updateV2MemberProfile} className="admin-member-edit">
                <input type="hidden" name="sourceIndex" value={member.sourceIndex} />
                <label><span>Nr.</span><input name="sourceNo" type="number" min="1" defaultValue={member.sourceNo} required /></label>
                <label><span>Emri</span><input name="firstName" defaultValue={member.firstName} required /></label>
                <label><span>Mbiemri</span><input name="lastName" defaultValue={member.lastName} required /></label>
                <label><span>Lagjja / mahalla</span><input name="neighborhood" defaultValue={member.neighborhood || ""} /></label>
                <label><span>Statusi</span><select name="status" defaultValue={member.archived ? "ARCHIVED" : "APPROVED"}><option value="APPROVED">Aktiv</option><option value="ARCHIVED">Arkivuar</option></select></label>
                <button type="submit" disabled={!databaseMode}>Ruaj ndryshimet</button>
              </form>
            </details>
          ))}
        </div>
      </section>
    </div>
  );
}
