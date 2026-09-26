import Link from "next/link";
import { getV2Gallery } from "@/lib/v2-gallery";

export const dynamic = "force-dynamic";

export default async function GalleryPage() {
  const items = await getV2Gallery();
  const years = Array.from(new Set(items.map((item) => item.year))).sort((a,b) => b-a);

  return (
    <>
      <header className="site-header">
        <div className="shell nav-wrap">
          <Link className="brand" href="/"><span className="brand-mark">R</span><span><strong>Shoqata Rainca</strong><small>Që nga viti 2010</small></span></Link>
          <nav><Link href="/">Ballina</Link><Link href="/eventet">Eventet</Link><Link href="/projektet">Projektet</Link><Link href="/galeria">Galeria</Link><Link href="/transparenca">Transparenca</Link></nav>
        </div>
      </header>
      <main>
        <section className="listing-hero"><div className="shell"><span className="eyebrow light">GALERIA</span><h1>Rainca në fotografi.</h1><p>Foto dhe video nga aktivitetet e Shoqatës, të organizuara sipas vitit dhe eventit.</p></div></section>

        <section className="section">
          <div className="shell">
            {items.length === 0 ? <div className="public-empty">Ende nuk ka materiale të publikuara në galeri.</div> :
              years.map((year) => {
                const yearItems = items.filter((item) => item.year === year);
                return <section key={year} className="gallery-year">
                  <div className="section-head"><div><span className="eyebrow">GALERIA</span><h2>{year}</h2></div></div>
                  <div className="gallery-grid">
                    {yearItems.map((item) => <article key={item.id} className="gallery-card">
                      {item.mediaType === "image" ? (
                        <a href={item.mediaUrl} target="_blank" rel="noreferrer" className="gallery-media"><img src={item.mediaUrl} alt={item.title} loading="lazy" /></a>
                      ) : (
                        <a href={item.mediaUrl} target="_blank" rel="noreferrer" className="gallery-video"><span>▶</span><strong>Hape videon</strong></a>
                      )}
                      <div className="gallery-copy">
                        <span>{item.eventLabel || "Shoqata Rainca"}</span>
                        <h3>{item.title}</h3>
                        {item.caption && <p>{item.caption}</p>}
                      </div>
                    </article>)}
                  </div>
                </section>;
              })
            }
          </div>
        </section>
      </main>
    </>
  );
}
