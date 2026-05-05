import { isAdmin } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

async function getAdminData() {
  if (!process.env.DATABASE_URL) return null;

  const [settings, projects, reports, members, applications, board, events, gallery] = await Promise.all([
    prisma.siteSettings.findFirst({ orderBy: { updatedAt: "desc" } }),
    prisma.project.findMany({ orderBy: { updatedAt: "desc" } }),
    prisma.financialReport.findMany({ orderBy: { year: "desc" } }),
    prisma.member.findMany({ orderBy: { updatedAt: "desc" } }),
    prisma.membershipApplication.findMany({ orderBy: { createdAt: "desc" } }),
    prisma.boardMember.findMany({ orderBy: [{ sortOrder: "asc" }, { updatedAt: "desc" }] }),
    prisma.event.findMany({ orderBy: { startsAt: "desc" } }),
    prisma.galleryItem.findMany({ orderBy: { createdAt: "desc" } })
  ]);

  return { settings, projects, reports, members, applications, board, events, gallery };
}

export default async function AdminPage({
  searchParams
}: {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
}) {
  const params = (await searchParams) ?? {};
  const authed = await isAdmin();

  if (!authed) {
    return (
      <main className="min-h-screen bg-skywash px-4 py-12">
        <div className="mx-auto max-w-md rounded-lg border border-ink/10 bg-white p-6 shadow-soft">
          <div className="mb-6">
            <p className="text-sm font-black uppercase tracking-wide text-pine">Shoqata Rainca</p>
            <h1 className="mt-2 text-3xl font-black text-ink">Admin login</h1>
            <p className="mt-3 text-sm font-semibold leading-6 text-ink/62">
              Hyrja përdor `ADMIN_PASSWORD` nga Vercel/environment. Për test lokal pa variabël, fjalëkalimi është rainca-demo-admin.
            </p>
          </div>
          {params.error === "1" && <p className="mb-4 rounded-md bg-ember/10 px-4 py-3 text-sm font-bold text-ember">Fjalëkalimi nuk është i saktë.</p>}
          <form action="/api/admin/login" method="post" className="space-y-4">
            <label className="block">
              <span className="admin-label">Password</span>
              <input className="admin-input mt-1" name="password" type="password" required />
            </label>
            <button className="w-full rounded-md bg-pine px-5 py-3 font-black text-white" type="submit">
              Login
            </button>
          </form>
        </div>
      </main>
    );
  }

  const data = await getAdminData();

  return (
    <main className="min-h-screen bg-skywash px-4 py-8">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-sm font-black uppercase tracking-wide text-pine">Demo administrimi</p>
            <h1 className="text-4xl font-black text-ink">Shoqata Rainca</h1>
            <p className="mt-2 max-w-3xl font-semibold leading-7 text-ink/65">
              Të dhënat zyrtare që shfaqen publikisht mbeten të editueshme këtu. Anëtarët publikohen vetëm kur kanë status të miratuar dhe leje publike.
            </p>
          </div>
          <form action="/api/admin/logout" method="post">
            <button className="rounded-md bg-ink px-4 py-2 font-black text-white" type="submit">Logout</button>
          </form>
        </div>

        {!data ? (
          <div className="admin-card">
            <h2 className="text-2xl font-black">Database not configured</h2>
            <p className="mt-3 max-w-3xl leading-7 text-ink/70">
              Set `DATABASE_URL` to a PostgreSQL database and run the Prisma migration before editing content. The public website still renders demo fallback data until the database is available.
            </p>
          </div>
        ) : (
          <div className="space-y-8">
            <AdminSection title="Kontakt, pagesa, logo, foto hero, statut">
              <form action="/api/admin/settings" method="post" encType="multipart/form-data" className="grid gap-4 lg:grid-cols-2">
                <Field label="Emri i shoqatës" name="associationName" defaultValue={data.settings?.associationName || "Shoqata Rainca"} />
                <Field label="Email zyrtar" name="officialEmail" defaultValue={data.settings?.officialEmail || "info@shoqata-rainca.ch"} />
                <Field label="Domain" name="domain" defaultValue={data.settings?.domain || "shoqata-rainca.ch"} />
                <Field label="Logo URL" name="logoUrl" defaultValue={data.settings?.logoUrl || ""} placeholder="/uploads/logo.png" />
                <Field label="Hero image URL" name="heroImageUrl" defaultValue={data.settings?.heroImageUrl || ""} placeholder="/uploads/rainca-aerial.jpg" />
                <Field label="QR image URL" name="qrImageUrl" defaultValue={data.settings?.qrImageUrl || ""} placeholder="/uploads/qr-payment.png" />
                <Field label="IBAN publik" name="iban" defaultValue={data.settings?.iban || ""} />
                <Field label="Banka / përfituesi publik" name="bankName" defaultValue={data.settings?.bankName || ""} />
                <Field label="Adresa kontaktuese" name="contactAddress" defaultValue={data.settings?.contactAddress || ""} />
                <Field label="Telefoni publik" name="contactPhone" defaultValue={data.settings?.contactPhone || ""} />
                <label className="lg:col-span-2">
                  <span className="admin-label">Shënim publik për pagesa</span>
                  <textarea className="admin-input mt-1" name="paymentNote" rows={3} defaultValue={data.settings?.paymentNote || ""} />
                </label>
                <Field label="Statut PDF URL" name="statutePdfUrl" defaultValue={data.settings?.statutePdfUrl || ""} />
                <label>
                  <span className="admin-label">Ngarko statut PDF</span>
                  <input className="admin-input mt-1" name="statutePdf" type="file" accept="application/pdf" />
                </label>
                <button className="rounded-md bg-pine px-5 py-3 font-black text-white lg:col-span-2" type="submit">Ruaj cilësimet</button>
              </form>
            </AdminSection>

            <AdminSection title="Projektet">
              <form action="/api/admin/project" method="post" className="grid gap-4 lg:grid-cols-2">
                <Field label="Titulli shqip" name="titleSq" required />
                <Field label="Titel Deutsch" name="titleDe" required />
                <Field label="Kategori" name="category" required />
                <Field label="Status" name="status" required />
                <Field label="Viti" name="year" type="number" defaultValue={String(new Date().getFullYear())} required />
                <Field label="Buxheti CHF" name="budget" type="number" />
                <Field label="Image URL" name="imageUrl" />
                <label className="flex items-center gap-2 pt-6 font-bold"><input name="isPublished" type="checkbox" defaultChecked /> Publiko</label>
                <Textarea label="Përshkrim shqip" name="summarySq" required />
                <Textarea label="Beschreibung Deutsch" name="summaryDe" required />
                <button className="rounded-md bg-pine px-5 py-3 font-black text-white lg:col-span-2" type="submit">Shto projekt</button>
              </form>
              <ItemList items={data.projects.map((item) => ({ id: item.id, title: item.titleSq, meta: `${item.year} · ${item.status}`, model: "project" }))} />
            </AdminSection>

            <AdminSection title="Raportet financiare">
              <form action="/api/admin/report" method="post" encType="multipart/form-data" className="grid gap-4 lg:grid-cols-2">
                <Field label="Viti" name="year" type="number" required />
                <Field label="Titulli" name="title" required />
                <Field label="Të hyrat CHF" name="income" type="number" required />
                <Field label="Shpenzimet CHF" name="expenses" type="number" required />
                <Field label="PDF URL" name="pdfUrl" />
                <label>
                  <span className="admin-label">Ngarko PDF</span>
                  <input className="admin-input mt-1" name="pdf" type="file" accept="application/pdf" />
                </label>
                <label className="lg:col-span-2">
                  <span className="admin-label">Kategoritë, një për rresht: Emri: shuma</span>
                  <textarea className="admin-input mt-1" name="categories" rows={5} placeholder={"Anëtarësi: 15000\nDonacione: 20000\nProjekte: 22000"} />
                </label>
                <label className="flex items-center gap-2 font-bold"><input name="isPublished" type="checkbox" defaultChecked /> Publiko</label>
                <button className="rounded-md bg-pine px-5 py-3 font-black text-white lg:col-span-2" type="submit">Shto raport</button>
              </form>
              <ItemList items={data.reports.map((item) => ({ id: item.id, title: item.title, meta: String(item.year), model: "report" }))} />
            </AdminSection>

            <AdminSection title="Anëtarët dhe privatësia">
              <form action="/api/admin/member" method="post" className="grid gap-4 lg:grid-cols-3">
                <Field label="Emri" name="name" required />
                <Field label="Mbiemri" name="surname" required />
                <Field label="Shteti" name="country" />
                <Field label="Qyteti" name="city" />
                <Field label="Viti" name="year" type="number" />
                <label>
                  <span className="admin-label">Status</span>
                  <select className="admin-input mt-1" name="status" defaultValue="PENDING">
                    <option value="PENDING">PENDING</option>
                    <option value="APPROVED">APPROVED</option>
                    <option value="ARCHIVED">ARCHIVED</option>
                  </select>
                </label>
                <Field label="Shuma e paguar" name="amountPaid" type="number" />
                <Field label="Valuta" name="currency" defaultValue="CHF" />
                <label>
                  <span className="admin-label">Statusi i pagesës</span>
                  <select className="admin-input mt-1" name="paymentStatus" defaultValue="UNPAID">
                    <option value="UNPAID">UNPAID</option>
                    <option value="PARTIAL">PARTIAL</option>
                    <option value="PAID">PAID</option>
                    <option value="WAIVED">WAIVED</option>
                  </select>
                </label>
                <label className="flex items-center gap-2 font-bold"><input name="isPublic" type="checkbox" /> Publiko anëtarin</label>
                <label className="flex items-center gap-2 font-bold"><input name="publicVisibleAmount" type="checkbox" /> Shfaq shumën publikisht</label>
                <label className="lg:col-span-3">
                  <span className="admin-label">Shënime private</span>
                  <textarea className="admin-input mt-1" name="notes" rows={3} />
                </label>
                <p className="rounded-md bg-ink/5 px-4 py-3 text-sm font-bold text-ink/62 lg:col-span-3">
                  Publiku sheh vetëm emrin, mbiemrin, vitin, statusin dhe shumën kur aktivizohet "Shfaq shumën publikisht".
                </p>
                <button className="rounded-md bg-pine px-5 py-3 font-black text-white lg:col-span-3" type="submit">Shto anëtar</button>
              </form>
              <div className="mt-5 grid gap-3">
                {data.members.map((member) => (
                  <div key={member.id} className="rounded-md border border-ink/10 bg-ink/[0.03] p-4">
                    <div className="flex flex-wrap items-center justify-between gap-3">
                      <div>
                        <h3 className="font-black">{member.name} {member.surname}</h3>
                        <p className="text-sm font-semibold text-ink/60">
                          {member.status} · {member.isPublic ? "publik" : "privat"} · {member.country || "-"} · {member.year || "-"} · {member.paymentStatus} · {member.amountPaid ? `${member.amountPaid} ${member.currency}` : "-"}
                        </p>
                        {member.notes && <p className="mt-2 text-sm font-semibold text-ink/55">Shënim privat: {member.notes}</p>}
                      </div>
                      <DeleteButton id={member.id} model="member" />
                    </div>
                  </div>
                ))}
              </div>
            </AdminSection>

            <AdminSection title="Aplikimet për anëtarësi">
              <div className="grid gap-3">
                {data.applications.map((app) => (
                  <div key={app.id} className="rounded-md border border-ink/10 bg-white p-4">
                    <div className="flex flex-col justify-between gap-3 md:flex-row md:items-center">
                      <div>
                        <h3 className="font-black">{app.fullName}</h3>
                        <p className="text-sm font-semibold text-ink/62">{app.email} · {app.phone || "-"} · {app.city || "-"} · {app.country || "-"}</p>
                        {app.message && <p className="mt-2 text-sm text-ink/70">{app.message}</p>}
                      </div>
                      <form action="/api/admin/application" method="post" className="flex gap-2">
                        <input type="hidden" name="id" value={app.id} />
                        <select className="admin-input" name="status" defaultValue={app.status}>
                          <option value="NEW">NEW</option>
                          <option value="REVIEWING">REVIEWING</option>
                          <option value="APPROVED">APPROVED</option>
                          <option value="DECLINED">DECLINED</option>
                        </select>
                        <button className="rounded-md bg-ink px-3 py-2 text-sm font-black text-white" type="submit">Ruaj</button>
                      </form>
                    </div>
                  </div>
                ))}
              </div>
            </AdminSection>

            <AdminSection title="Kryesia">
              <form action="/api/admin/board" method="post" className="grid gap-4 lg:grid-cols-2">
                <Field label="Emri" name="fullName" required />
                <Field label="Renditja" name="sortOrder" type="number" defaultValue="0" />
                <Field label="Pozita shqip" name="positionSq" required />
                <Field label="Position Deutsch" name="positionDe" required />
                <Field label="Image URL" name="imageUrl" />
                <label className="flex items-center gap-2 pt-6 font-bold"><input name="isPublished" type="checkbox" defaultChecked /> Publiko</label>
                <Textarea label="Bio shqip" name="bioSq" />
                <Textarea label="Bio Deutsch" name="bioDe" />
                <button className="rounded-md bg-pine px-5 py-3 font-black text-white lg:col-span-2" type="submit">Shto në kryesi</button>
              </form>
              <ItemList items={data.board.map((item) => ({ id: item.id, title: item.fullName, meta: item.positionSq, model: "board" }))} />
            </AdminSection>

            <AdminSection title="Eventet">
              <form action="/api/admin/event" method="post" className="grid gap-4 lg:grid-cols-2">
                <Field label="Titulli shqip" name="titleSq" required />
                <Field label="Titel Deutsch" name="titleDe" required />
                <Field label="Lokacioni" name="location" required />
                <Field label="Data dhe ora" name="startsAt" type="datetime-local" required />
                <Field label="Image URL" name="imageUrl" />
                <label className="flex items-center gap-2 pt-6 font-bold"><input name="isPublished" type="checkbox" defaultChecked /> Publiko</label>
                <Textarea label="Përshkrim shqip" name="descriptionSq" required />
                <Textarea label="Beschreibung Deutsch" name="descriptionDe" required />
                <button className="rounded-md bg-pine px-5 py-3 font-black text-white lg:col-span-2" type="submit">Shto event</button>
              </form>
              <ItemList items={data.events.map((item) => ({ id: item.id, title: item.titleSq, meta: item.location, model: "event" }))} />
            </AdminSection>

            <AdminSection title="Galeria">
              <form action="/api/admin/gallery" method="post" className="grid gap-4 lg:grid-cols-2">
                <Field label="Titulli shqip" name="titleSq" required />
                <Field label="Titel Deutsch" name="titleDe" required />
                <Field label="Image URL" name="imageUrl" required />
                <label className="flex items-center gap-2 pt-6 font-bold"><input name="isPublished" type="checkbox" defaultChecked /> Publiko</label>
                <Textarea label="Caption shqip" name="captionSq" />
                <Textarea label="Caption Deutsch" name="captionDe" />
                <button className="rounded-md bg-pine px-5 py-3 font-black text-white lg:col-span-2" type="submit">Shto foto</button>
              </form>
              <ItemList items={data.gallery.map((item) => ({ id: item.id, title: item.titleSq, meta: item.imageUrl, model: "gallery" }))} />
            </AdminSection>
          </div>
        )}
      </div>
    </main>
  );
}

function AdminSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="admin-card">
      <h2 className="mb-5 text-2xl font-black text-ink">{title}</h2>
      {children}
    </section>
  );
}

function Field({
  label,
  name,
  type = "text",
  defaultValue,
  placeholder,
  required = false
}: {
  label: string;
  name: string;
  type?: string;
  defaultValue?: string;
  placeholder?: string;
  required?: boolean;
}) {
  return (
    <label>
      <span className="admin-label">{label}</span>
      <input className="admin-input mt-1" name={name} type={type} defaultValue={defaultValue} placeholder={placeholder} required={required} />
    </label>
  );
}

function Textarea({ label, name, required = false }: { label: string; name: string; required?: boolean }) {
  return (
    <label>
      <span className="admin-label">{label}</span>
      <textarea className="admin-input mt-1" name={name} rows={4} required={required} />
    </label>
  );
}

function ItemList({ items }: { items: Array<{ id: string; title: string; meta: string; model: string }> }) {
  if (!items.length) return <p className="mt-5 text-sm font-bold text-ink/55">Ende nuk ka të dhëna.</p>;

  return (
    <div className="mt-5 grid gap-3">
      {items.map((item) => (
        <div key={item.id} className="flex flex-wrap items-center justify-between gap-3 rounded-md border border-ink/10 bg-ink/[0.03] p-4">
          <div>
            <h3 className="font-black">{item.title}</h3>
            <p className="text-sm font-semibold text-ink/60">{item.meta}</p>
          </div>
          <DeleteButton id={item.id} model={item.model} />
        </div>
      ))}
    </div>
  );
}

function DeleteButton({ id, model }: { id: string; model: string }) {
  return (
    <form action="/api/admin/delete" method="post">
      <input type="hidden" name="id" value={id} />
      <input type="hidden" name="model" value={model} />
      <button className="rounded-md border border-ember/25 px-3 py-2 text-sm font-black text-ember" type="submit">Fshi</button>
    </form>
  );
}
