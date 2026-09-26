import Link from "next/link";
import { redirect } from "next/navigation";
import DirectUploadField from "@/components/admin/DirectUploadField";
import { getV2Gallery } from "@/lib/v2-gallery";
import { isV2Admin } from "@/lib/v2-auth";
import { logoutV2 } from "../actions";
import { createGalleryItem, deleteGalleryItem, updateGalleryItem } from "./actions";

export const dynamic = "force-dynamic";

export default async function AdminGalleryPage({
  searchParams
}: {
  searchParams: Promise<Record<string,string | string[] | undefined>>;
}) {
  if (!(await isV2Admin())) redirect("/admin-v2");
  const params = await searchParams;
  const items = await getV2Gallery(true);

  return (
    <main className="admin-v2">
      <div className="shell">
        <div className="admin-v2-topbar">
          <div><span className="eyebrow">ADMIN · SHOQATA RAINCA</span><h1>Galeria</h1></div>
          <div className="admin-v2-actions">
            <Link href="/admin-v2">Pagesat</Link>
            <Link href="/admin-v2/permbajtja">Përmbajtja</Link>
            <Link href="/admin-v2/transparenca">Transparenca</Link>
            <Link href="/galeria">Publikisht</Link>
            <form action={logoutV2}><button type="submit">Dil</button></form>
          </div>
        </div>

        {(params.created || params.saved || params.deleted) && <div className="admin-v2-success">Galeria u përditësua.</div>}
        {params.error && <div className="admin-v2-alert">Kontrollo të dhënat ({String(params.error)}).</div>}

        <section className="admin-content-section">
          <div className="admin-content-heading">
            <div><span className="eyebrow">MEDIA</span><h2>Foto & video</h2></div>
          </div>

          <div className="admin-content-grid">
            <form action={createGalleryItem} className="admin-v2-card admin-content-form">
              <h3>Shto në galeri</h3>
              <label><span>Titulli</span><input name="title" required /></label>
              <div className="admin-content-inline">
                <label><span>Viti</span><input name="year" type="number" defaultValue="2026" required /></label>
                <label><span>Lloji</span><select name="mediaType" defaultValue="image"><option value="image">Foto</option><option value="video">Video / link</option></select></label>
              </div>
              <label><span>Eventi / grupi</span><input name="eventLabel" placeholder="p.sh. Festa 2026" /></label>
              <label><span>Përshkrimi</span><textarea name="caption" rows={3} /></label>
              <DirectUploadField name="mediaUrl" label="Foto / media URL" accept="image/jpeg,image/png,image/webp,image/gif" placeholder="Ngarko foto ose vendos URL të videos" />
              <label><span>Renditja</span><input name="sortOrder" type="number" defaultValue="0" /></label>
              <label className="admin-check"><input name="published" type="checkbox" defaultChecked /> Publiko</label>
              <button type="submit">Shto në galeri</button>
            </form>

            <div className="admin-content-list">
              {items.length === 0 && <div className="admin-v2-empty">Galeria është ende bosh.</div>}
              {items.map((item) => (
                <details key={item.id} className="admin-content-item">
                  <summary>
                    <div><strong>{item.title}</strong><span>{item.year} · {item.eventLabel || "Pa grup"} · {item.mediaType === "video" ? "Video" : "Foto"}</span></div>
                    <b>{item.published ? "Publik" : "Draft"}</b>
                  </summary>
                  <form action={updateGalleryItem} className="admin-content-edit">
                    <input type="hidden" name="id" value={item.id} />
                    <label><span>Titulli</span><input name="title" defaultValue={item.title} required /></label>
                    <label><span>Viti</span><input name="year" type="number" defaultValue={item.year} required /></label>
                    <label><span>Lloji</span><select name="mediaType" defaultValue={item.mediaType}><option value="image">Foto</option><option value="video">Video / link</option></select></label>
                    <label><span>Eventi / grupi</span><input name="eventLabel" defaultValue={item.eventLabel || ""} /></label>
                    <label className="span-two"><span>Përshkrimi</span><textarea name="caption" rows={3} defaultValue={item.caption || ""} /></label>
                    <DirectUploadField className="span-two" name="mediaUrl" label="Foto / media URL" accept="image/jpeg,image/png,image/webp,image/gif" defaultValue={item.mediaUrl} />
                    <label><span>Renditja</span><input name="sortOrder" type="number" defaultValue={item.sortOrder} /></label>
                    <label className="admin-check"><input name="published" type="checkbox" defaultChecked={item.published} /> Publiko</label>
                    <button type="submit">Ruaj</button>
                  </form>
                  <form action={deleteGalleryItem} className="admin-content-delete"><input type="hidden" name="id" value={item.id} /><button type="submit">Fshi nga galeria</button></form>
                </details>
              ))}
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
