import Link from "next/link";
import { getV2Documents } from "@/lib/v2-transparency";

export const dynamic = "force-dynamic";

export default async function DocumentsPage() {
  const documents = await getV2Documents();

  return (
    <>
      <header className="site-header"><div className="shell nav-wrap"><Link className="brand" href="/"><span className="brand-mark">R</span><span><strong>Shoqata Rainca</strong><small>Që nga viti 2010</small></span></Link><nav><Link href="/">Ballina</Link><Link href="/transparenca">Transparenca</Link><Link href="/dokumentet">Dokumentet</Link><Link href="/donacionet">Donacionet</Link></nav></div></header>
      <main>
        <section className="listing-hero"><div className="shell"><span className="eyebrow light">DOKUMENTET</span><h1>PDF & formularë</h1><p>Dokumentet zyrtare që Shoqata ka zgjedhur t’i bëjë publike.</p></div></section>
        <section className="section"><div className="shell">
          {documents.length === 0 ? <div className="public-empty">Ende nuk ka dokumente të publikuara.</div> :
          <div className="document-public-list">{documents.map((document) => <a key={document.id} href={document.fileUrl} target="_blank" rel="noreferrer" className="document-public-row"><div><span className="pill muted">{document.category}</span><strong>{document.title}</strong><small>{document.description || "Dokument publik"}{document.year ? ` · ${document.year}` : ""}</small></div><b>Hape →</b></a>)}</div>}
        </div></section>
      </main>
    </>
  );
}
