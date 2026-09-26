import Link from "next/link";
import { redirect } from "next/navigation";
import {
  createEventV2,
  createProjectV2,
  deleteEventV2,
  deleteProjectV2,
  updateEventV2,
  updateProjectV2
} from "./actions";
import {
  formatEventDate,
  formatEventTime,
  getV2Events,
  getV2Projects
} from "@/lib/v2-content";
import { isV2Admin } from "@/lib/v2-auth";
import { logoutV2 } from "../actions";

export const dynamic = "force-dynamic";

function inputDateTime(date: Date) {
  const parts = new Intl.DateTimeFormat("sv-SE", {
    timeZone: "Europe/Zurich",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false
  }).formatToParts(date);

  const get = (type: string) => parts.find((part) => part.type === type)?.value || "";
  return `${get("year")}-${get("month")}-${get("day")}T${get("hour")}:${get("minute")}`;
}

export default async function AdminContentPage({
  searchParams
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  if (!(await isV2Admin())) redirect("/admin-v2");

  const params = await searchParams;
  const [events, projects] = await Promise.all([
    getV2Events(true),
    getV2Projects(true)
  ]);

  return (
    <main className="admin-v2">
      <div className="shell">
        <div className="admin-v2-topbar">
          <div>
            <span className="eyebrow">ADMIN · SHOQATA RAINCA</span>
            <h1>Përmbajtja</h1>
          </div>
          <div className="admin-v2-actions">
            <Link href="/admin-v2">Pagesat</Link>
            <Link href="/admin-v2/antaret">Anëtarët</Link>
            <Link href="/">Ballina</Link>
            <form action={logoutV2}><button type="submit">Dil</button></form>
          </div>
        </div>

        {(params.eventCreated || params.eventSaved || params.eventDeleted || params.projectCreated || params.projectSaved || params.projectDeleted) && (
          <div className="admin-v2-success">Ndryshimi u ruajt dhe faqja publike u përditësua.</div>
        )}
        {params.error && <div className="admin-v2-alert">Kontrollo fushat e formularit ({String(params.error)}).</div>}

        <section className="admin-content-section">
          <div className="admin-content-heading">
            <div><span className="eyebrow">EVENTET</span><h2>Eventet e Shoqatës</h2></div>
            <Link href="/eventet">Shiko publikisht →</Link>
          </div>

          <div className="admin-content-grid">
            <form action={createEventV2} className="admin-v2-card admin-content-form">
              <h3>Shto event</h3>
              <label><span>Titulli</span><input name="title" required /></label>
              <label><span>Përshkrimi</span><textarea name="description" rows={4} required /></label>
              <label><span>Detaje</span><textarea name="details" rows={3} placeholder="Çmimet, rezervimi, kontakte..." /></label>
              <label><span>Lokacioni</span><input name="location" required /></label>
              <label><span>Data dhe ora</span><input name="startsAt" type="datetime-local" required /></label>
              <label><span>Foto / URL</span><input name="imageUrl" placeholder="https://..." /></label>
              <label className="admin-check"><input name="published" type="checkbox" defaultChecked /> Publiko</label>
              <button type="submit">Shto eventin</button>
            </form>

            <div className="admin-content-list">
              {events.map((event) => (
                <details key={event.id} className="admin-content-item">
                  <summary>
                    <div><strong>{event.title}</strong><span>{formatEventDate(event.startsAt)} · {formatEventTime(event.startsAt)} · {event.location}</span></div>
                    <b>{event.published ? "Publik" : "Draft"}</b>
                  </summary>
                  <form action={updateEventV2} className="admin-content-edit">
                    <input type="hidden" name="id" value={event.id} />
                    <label><span>Titulli</span><input name="title" defaultValue={event.title} required /></label>
                    <label className="span-two"><span>Përshkrimi</span><textarea name="description" rows={4} defaultValue={event.description} required /></label>
                    <label className="span-two"><span>Detaje</span><textarea name="details" rows={3} defaultValue={event.details || ""} /></label>
                    <label><span>Lokacioni</span><input name="location" defaultValue={event.location} required /></label>
                    <label><span>Data dhe ora</span><input name="startsAt" type="datetime-local" defaultValue={inputDateTime(event.startsAt)} required /></label>
                    <label className="span-two"><span>Foto / URL</span><input name="imageUrl" defaultValue={event.imageUrl || ""} /></label>
                    <label className="admin-check span-two"><input name="published" type="checkbox" defaultChecked={event.published} /> Publiko</label>
                    <button type="submit">Ruaj eventin</button>
                  </form>
                  <form action={deleteEventV2} className="admin-content-delete">
                    <input type="hidden" name="id" value={event.id} />
                    <button type="submit">Fshi eventin</button>
                  </form>
                </details>
              ))}
            </div>
          </div>
        </section>

        <section className="admin-content-section">
          <div className="admin-content-heading">
            <div><span className="eyebrow">PROJEKTET</span><h2>Projektet & aktivitetet</h2></div>
            <Link href="/projektet">Shiko publikisht →</Link>
          </div>

          <div className="admin-content-grid">
            <form action={createProjectV2} className="admin-v2-card admin-content-form">
              <h3>Shto projekt</h3>
              <label><span>Titulli</span><input name="title" required /></label>
              <label><span>Përshkrimi</span><textarea name="summary" rows={4} required /></label>
              <div className="admin-content-inline">
                <label><span>Kategoria</span><input name="category" placeholder="Komunitet" required /></label>
                <label><span>Statusi</span><input name="status" placeholder="Në vazhdim" required /></label>
              </div>
              <div className="admin-content-inline">
                <label><span>Viti</span><input name="year" type="number" defaultValue="2026" required /></label>
                <label><span>Buxheti (opsional)</span><input name="budget" type="number" min="0" step="0.01" /></label>
              </div>
              <label><span>Foto / URL</span><input name="imageUrl" placeholder="https://..." /></label>
              <label className="admin-check"><input name="published" type="checkbox" defaultChecked /> Publiko</label>
              <button type="submit">Shto projektin</button>
            </form>

            <div className="admin-content-list">
              {projects.map((project) => (
                <details key={project.id} className="admin-content-item">
                  <summary>
                    <div><strong>{project.title}</strong><span>{project.year} · {project.category} · {project.status}</span></div>
                    <b>{project.published ? "Publik" : "Draft"}</b>
                  </summary>
                  <form action={updateProjectV2} className="admin-content-edit">
                    <input type="hidden" name="id" value={project.id} />
                    <label><span>Titulli</span><input name="title" defaultValue={project.title} required /></label>
                    <label className="span-two"><span>Përshkrimi</span><textarea name="summary" rows={4} defaultValue={project.summary} required /></label>
                    <label><span>Kategoria</span><input name="category" defaultValue={project.category} required /></label>
                    <label><span>Statusi</span><input name="status" defaultValue={project.status} required /></label>
                    <label><span>Viti</span><input name="year" type="number" defaultValue={project.year} required /></label>
                    <label><span>Buxheti</span><input name="budget" type="number" min="0" step="0.01" defaultValue={project.budget || ""} /></label>
                    <label className="span-two"><span>Foto / URL</span><input name="imageUrl" defaultValue={project.imageUrl || ""} /></label>
                    <label className="admin-check span-two"><input name="published" type="checkbox" defaultChecked={project.published} /> Publiko</label>
                    <button type="submit">Ruaj projektin</button>
                  </form>
                  <form action={deleteProjectV2} className="admin-content-delete">
                    <input type="hidden" name="id" value={project.id} />
                    <button type="submit">Fshi projektin</button>
                  </form>
                </details>
              ))}
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
