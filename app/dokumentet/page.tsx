import Link from "next/link";
import { getV2Documents } from "@/lib/v2-transparency";

export const dynamic = "force-dynamic";

export default async function DocumentsPage() {
  const documents = await getV2Documents();

  return (
    <>
      <header className="site-header"><div className="shell nav-wrap"><Link className="brand" href="/"><img className="brand-symbol" src="/rainca-trees.svg" alt="" width={56} height={40} /><span><strong>Shoqata Rainca</strong><small>Që nga viti 2010</small></span></Link><nav><Link href="/">Ballina</Link><Link href="/transparenca">Transparenca</Link><Link href="/dokumentet">Dokumentet</Link><Link href="/donacionet">Donacionet</Link></nav></div></header>
      <main>
        <section className="listing-hero"><div className="shell"><span className="eyebrow light">DOKUMENTET</span><h1>PDF & formularë</h1><p>Dokumentet zyrtare që Shoqata ka zgjedhur t’i bëjë publike.</p></div></section>
        <section className="section"><div className="shell">
          <article className="statute-feature" aria-labelledby="statute-heading">
            <div>
              <span className="eyebrow">DOKUMENT ZYRTAR · PDF</span>
              <h2 id="statute-heading">Statuti i Shoqatës Rainca</h2>
              <p>Versioni II · Janar 2017 · Zürich, Zvicër · 11 faqe.</p>
              <p className="statute-feature-description">Dokumenti origjinal, i publikuar i plotë dhe pa asnjë ndryshim. Mund ta lexoni ose ta shkarkoni në formatin PDF.</p>
              <div className="statute-feature-actions">
                <a className="button primary" href="/statuti-shoqates-rainca-versioni-II.pdf" target="_blank" rel="noopener noreferrer">Lexo PDF ↗</a>
                <a className="statute-download-link" href="/statuti-shoqates-rainca-versioni-II.pdf" download="Statuti-i-Shoqates-Rainca.pdf">Shkarko PDF ↓</a>
              </div>
            </div>
            <div className="statute-file-sign" aria-hidden="true"><strong>PDF</strong><span>11 faqe</span></div>
          </article>
          {documents.length > 0 && <div className="document-public-list">{documents.map((document) => <a key={document.id} href={document.fileUrl} target="_blank" rel="noopener noreferrer" className="document-public-row"><div><span className="pill muted">{document.category}</span><strong>{document.title}</strong><small>{document.description || "Dokument publik"}{document.year ? ` · ${document.year}` : ""}</small></div><b>Hape →</b></a>)}</div>}
        </div></section>
      </main>
    </>
  );
}
