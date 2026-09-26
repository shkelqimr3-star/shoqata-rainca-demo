import Link from "next/link";
import { formatEventDate, formatEventTime, getV2Events } from "@/lib/v2-content";

export const dynamic = "force-dynamic";

export default async function EventsPage() {
  const events = await getV2Events();
  const now = new Date();
  const upcoming = events.filter((event) => event.startsAt >= now);
  const past = events.filter((event) => event.startsAt < now).reverse();

  return (
    <>
      <header className="site-header">
        <div className="shell nav-wrap">
          <Link className="brand" href="/"><span className="brand-mark">R</span><span><strong>Shoqata Rainca</strong><small>Që nga viti 2010</small></span></Link>
          <nav><Link href="/">Ballina</Link><Link href="/eventet">Eventet</Link><Link href="/projektet">Projektet</Link><Link href="/antaret">Anëtarët</Link></nav>
        </div>
      </header>
      <main>
        <section className="listing-hero"><div className="shell"><span className="eyebrow light">SHOQATA RAINCA</span><h1>Eventet</h1><p>Datat, lokacionet dhe informacionet kryesore për aktivitetet e Shoqatës.</p></div></section>
        <section className="section"><div className="shell">
          <div className="section-head"><div><span className="eyebrow">NË VAZHDIM</span><h2>Eventet e ardhshme</h2></div></div>
          <div className="public-content-list">
            {upcoming.length ? upcoming.map((event) => <article key={event.id} className="public-event-card">
              <div className="public-date"><strong>{new Intl.DateTimeFormat("sq-AL",{timeZone:"Europe/Zurich",day:"2-digit"}).format(event.startsAt)}</strong><span>{new Intl.DateTimeFormat("sq-AL",{timeZone:"Europe/Zurich",month:"short"}).format(event.startsAt)}</span></div>
              <div><span className="pill">Event</span><h3>{event.title}</h3><p className="event-meta">{formatEventDate(event.startsAt)} · Ora {formatEventTime(event.startsAt)} · {event.location}</p><p>{event.description}</p>{event.details && <div className="public-details">{event.details}</div>}</div>
            </article>) : <div className="public-empty">Nuk ka evente të ardhshme të publikuara.</div>}
          </div>

          {past.length > 0 && <><div className="section-head past-head"><div><span className="eyebrow">ARKIVA</span><h2>Eventet e kaluara</h2></div></div><div className="public-project-grid">{past.map((event) => <article className="public-project-card" key={event.id}><span className="pill muted">{formatEventDate(event.startsAt)}</span><h3>{event.title}</h3><p>{event.description}</p><small>{event.location}</small></article>)}</div></>}
        </div></section>
      </main>
    </>
  );
}
