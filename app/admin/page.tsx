import { isAdmin } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { ConfirmDeleteForm } from "@/components/ConfirmDeleteForm";
import { ImageUploadField } from "@/components/ImageUploadField";
import { MemberCsvImport } from "@/components/MemberCsvImport";

export const dynamic = "force-dynamic";

const defaultMembershipStats = [
  { year: 2023, memberCount: 214, status: "closed", dateUpdated: null, noteSq: null, noteDe: null, sortOrder: 2023, isPublished: true },
  { year: 2024, memberCount: 239, status: "closed", dateUpdated: null, noteSq: null, noteDe: null, sortOrder: 2024, isPublished: true },
  { year: 2025, memberCount: 226, status: "closed", dateUpdated: null, noteSq: null, noteDe: null, sortOrder: 2025, isPublished: true },
  {
    year: 2026,
    memberCount: 93,
    status: "in_progress",
    dateUpdated: new Date("2026-05-05T00:00:00.000Z"),
    noteSq: "Për vitin 2026 janë llogaritur vetëm pagesat e regjistruara deri më 05.05.2026.",
    noteDe: "Für das Jahr 2026 wurden nur die bis zum 05.05.2026 erfassten Zahlungen berücksichtigt.",
    sortOrder: 2026,
    isPublished: true
  }
];

async function ensureMembershipStats() {
  const count = await prisma.membershipStatistic.count();
  if (count === 0) {
    await prisma.membershipStatistic.createMany({ data: defaultMembershipStats });
  }
}

async function getAdminData() {
  if (!process.env.DATABASE_URL) return null;

  await ensureMembershipStats();

  const [settings, projects, membershipStats, reports, members, applications, board, events, gallery] = await Promise.all([
    prisma.siteSettings.findFirst({ orderBy: { updatedAt: "desc" } }),
    prisma.project.findMany({ orderBy: { updatedAt: "desc" } }),
    prisma.membershipStatistic.findMany({ orderBy: [{ sortOrder: "asc" }, { year: "asc" }] }),
    prisma.financialReport.findMany({ orderBy: { year: "desc" } }),
    prisma.member.findMany({ orderBy: { updatedAt: "desc" } }),
    prisma.membershipApplication.findMany({ orderBy: { createdAt: "desc" } }),
    prisma.boardMember.findMany({ orderBy: [{ sortOrder: "asc" }, { updatedAt: "desc" }] }),
    prisma.event.findMany({ orderBy: { startsAt: "desc" } }),
    prisma.galleryItem.findMany({ orderBy: { createdAt: "desc" } })
  ]);

  return { settings, projects, membershipStats, reports, members, applications, board, events, gallery };
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
                <ImageUploadField label="Logo URL" name="logoUrl" defaultValue={data.settings?.logoUrl || ""} placeholder="/uploads/logo.png" />
                <ImageUploadField label="Hero image URL" name="heroImageUrl" defaultValue={data.settings?.heroImageUrl || ""} placeholder="/uploads/rainca-aerial.jpg" />
                <ImageUploadField label="QR image URL" name="qrImageUrl" defaultValue={data.settings?.qrImageUrl || ""} placeholder="/uploads/qr-payment.png" />
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
                <YearField label="Viti" name="year" defaultValue={String(new Date().getFullYear())} required />
                <Field label="Buxheti CHF" name="budget" type="number" />
                <ImageUploadField label="Image URL" name="imageUrl" />
                <label className="flex items-center gap-2 pt-6 font-bold"><input name="isPublished" type="checkbox" defaultChecked /> Publiko</label>
                <Textarea label="Përshkrim shqip" name="summarySq" required />
                <Textarea label="Beschreibung Deutsch" name="summaryDe" required />
                <button className="rounded-md bg-pine px-5 py-3 font-black text-white lg:col-span-2" type="submit">Shto projekt</button>
              </form>
              <ProjectsEditor projects={data.projects} />
            </AdminSection>

            <AdminSection title="Raportet financiare">
              <form action="/api/admin/report" method="post" encType="multipart/form-data" className="grid gap-4 lg:grid-cols-2">
                <YearField label="Viti" name="year" defaultValue={String(new Date().getFullYear())} required />
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
              <ReportsEditor reports={data.reports} />
            </AdminSection>

            <AdminSection title="Statistikat e anëtarësisë">
              <form action="/api/admin/membership-stat" method="post" className="grid gap-4 lg:grid-cols-3">
                <YearField label="Viti" name="year" defaultValue={String(new Date().getFullYear())} required />
                <Field label="Numri i anëtarëve" name="memberCount" type="number" defaultValue="0" required />
                <label>
                  <span className="admin-label">Statusi</span>
                  <select className="admin-input mt-1" name="status" defaultValue="in_progress">
                    <option value="in_progress">in_progress</option>
                    <option value="closed">closed</option>
                  </select>
                </label>
                <label>
                  <span className="admin-label">Data e përditësimit</span>
                  <input className="admin-input mt-1" name="dateUpdated" type="date" />
                </label>
                <Field label="Renditja" name="sortOrder" type="number" defaultValue={String(new Date().getFullYear())} />
                <label className="flex items-center gap-2 pt-6 font-bold"><input name="isPublished" type="checkbox" defaultChecked /> Publiko</label>
                <Textarea label="Shënim shqip" name="noteSq" />
                <Textarea label="Hinweis Deutsch" name="noteDe" />
                <button className="rounded-md bg-pine px-5 py-3 font-black text-white lg:col-span-3" type="submit">Shto statistikë</button>
              </form>
              <MembershipStatsEditor stats={data.membershipStats} />
            </AdminSection>

            <AdminSection title="Anëtarët dhe privatësia">
              <form action="/api/admin/member" method="post" className="grid gap-4 lg:grid-cols-3">
                <Field label="Emri" name="name" required />
                <Field label="Mbiemri" name="surname" required />
                <Field label="Shteti" name="country" />
                <Field label="Qyteti" name="city" />
                <YearField label="Viti" name="year" />
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
              <div className="mt-6 flex flex-wrap items-center justify-between gap-3 rounded-lg border border-ink/10 bg-white p-4 shadow-sm">
                <div>
                  <h3 className="font-black text-ink">Eksport CSV</h3>
                  <p className="text-sm font-semibold text-ink/60">Shkarko të gjitha rekordet e anëtarëve për administrim.</p>
                </div>
                <a className="rounded-md bg-ink px-4 py-2 text-sm font-black text-white" href="/api/admin/members/export">
                  Export CSV
                </a>
              </div>
              <MemberCsvImport />
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
                <ImageUploadField label="Image URL" name="imageUrl" />
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
                <ImageUploadField label="Image URL" name="imageUrl" />
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
                <ImageUploadField label="Image URL" name="imageUrl" required />
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

function YearField({
  label,
  name,
  defaultValue,
  required = false
}: {
  label: string;
  name: string;
  defaultValue?: string;
  required?: boolean;
}) {
  return (
    <label>
      <span className="admin-label">{label}</span>
      <input
        className="admin-input mt-1"
        name={name}
        type="number"
        min="2010"
        max="2035"
        step="1"
        defaultValue={defaultValue}
        placeholder="2025"
        required={required}
      />
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

type AdminReport = NonNullable<Awaited<ReturnType<typeof getAdminData>>>["reports"][number];
type AdminProject = NonNullable<Awaited<ReturnType<typeof getAdminData>>>["projects"][number];
type AdminMembershipStat = NonNullable<Awaited<ReturnType<typeof getAdminData>>>["membershipStats"][number];

function dateInputValue(value: Date | string | null) {
  if (!value) return "";
  const date = typeof value === "string" ? new Date(value) : value;
  if (Number.isNaN(date.getTime())) return "";
  return date.toISOString().slice(0, 10);
}

function ProjectsEditor({ projects }: { projects: AdminProject[] }) {
  if (!projects.length) return <p className="mt-5 text-sm font-bold text-ink/55">Ende nuk ka projekte.</p>;

  return (
    <div className="mt-6 space-y-4">
      <h3 className="text-lg font-black text-ink">Projektet ekzistuese dhe arkiva</h3>
      {projects.map((project) => (
        <article key={project.id} className="rounded-lg border border-ink/10 bg-ink/[0.03] p-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h4 className="font-black text-ink">{project.year} · {project.titleSq}</h4>
              <p className="text-sm font-semibold text-ink/60">
                {project.category} · {project.status} · {project.isPublished ? "Publikuar" : "I fshehur"}
              </p>
            </div>
            <ConfirmDeleteForm id={project.id} model="project" label="Fshi" message={`A jeni të sigurt që doni ta fshini projektin ${project.titleSq}?`} />
          </div>

          <details className="mt-4">
            <summary className="cursor-pointer rounded-md bg-ink px-4 py-3 text-sm font-black text-white">Edit</summary>
            <form action="/api/admin/project-update" method="post" className="mt-4 grid gap-4 lg:grid-cols-2">
              <input type="hidden" name="id" value={project.id} />
              <Field label="Titulli shqip" name="titleSq" defaultValue={project.titleSq} required />
              <Field label="Titel Deutsch" name="titleDe" defaultValue={project.titleDe} required />
              <Field label="Kategori" name="category" defaultValue={project.category} required />
              <Field label="Status" name="status" defaultValue={project.status} required />
              <YearField label="Viti" name="year" defaultValue={String(project.year)} required />
              <Field label="Buxheti CHF" name="budget" type="number" defaultValue={moneyText(project.budget)} />
              <ImageUploadField label="Image URL" name="imageUrl" defaultValue={project.imageUrl || ""} />
              <label className="flex items-center gap-2 pt-6 font-bold"><input name="isPublished" type="checkbox" defaultChecked={project.isPublished} /> Publiko</label>
              <label>
                <span className="admin-label">Përshkrim shqip</span>
                <textarea className="admin-input mt-1" name="summarySq" rows={4} defaultValue={project.summarySq} required />
              </label>
              <label>
                <span className="admin-label">Beschreibung Deutsch</span>
                <textarea className="admin-input mt-1" name="summaryDe" rows={4} defaultValue={project.summaryDe} required />
              </label>
              <button className="rounded-md bg-pine px-5 py-3 font-black text-white lg:col-span-2" type="submit">Ruaj ndryshimet</button>
            </form>
          </details>
        </article>
      ))}
    </div>
  );
}

function MembershipStatsEditor({ stats }: { stats: AdminMembershipStat[] }) {
  if (!stats.length) return <p className="mt-5 text-sm font-bold text-ink/55">Ende nuk ka statistika.</p>;

  return (
    <div className="mt-6 space-y-4">
      <h3 className="text-lg font-black text-ink">Statistikat ekzistuese</h3>
      {stats.map((stat) => (
        <article key={stat.id} className="rounded-lg border border-ink/10 bg-ink/[0.03] p-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h4 className="font-black text-ink">{stat.year} · {stat.memberCount} anëtarë</h4>
              <p className="text-sm font-semibold text-ink/60">
                {stat.status} · renditja {stat.sortOrder} · {stat.isPublished ? "Publikuar" : "I fshehur"}
              </p>
            </div>
            <ConfirmDeleteForm id={stat.id} model="membershipStat" label="Fshi" message={`A jeni të sigurt që doni ta fshini statistikën për vitin ${stat.year}?`} />
          </div>

          <details className="mt-4">
            <summary className="cursor-pointer rounded-md bg-ink px-4 py-3 text-sm font-black text-white">Edit</summary>
            <form action="/api/admin/membership-stat-update" method="post" className="mt-4 grid gap-4 lg:grid-cols-3">
              <input type="hidden" name="id" value={stat.id} />
              <YearField label="Viti" name="year" defaultValue={String(stat.year)} required />
              <Field label="Numri i anëtarëve" name="memberCount" type="number" defaultValue={String(stat.memberCount)} required />
              <label>
                <span className="admin-label">Statusi</span>
                <select className="admin-input mt-1" name="status" defaultValue={stat.status}>
                  <option value="in_progress">in_progress</option>
                  <option value="closed">closed</option>
                </select>
              </label>
              <label>
                <span className="admin-label">Data e përditësimit</span>
                <input className="admin-input mt-1" name="dateUpdated" type="date" defaultValue={dateInputValue(stat.dateUpdated)} />
              </label>
              <Field label="Renditja" name="sortOrder" type="number" defaultValue={String(stat.sortOrder)} />
              <label className="flex items-center gap-2 pt-6 font-bold"><input name="isPublished" type="checkbox" defaultChecked={stat.isPublished} /> Publiko</label>
              <label className="lg:col-span-3">
                <span className="admin-label">Shënim shqip</span>
                <textarea className="admin-input mt-1" name="noteSq" rows={3} defaultValue={stat.noteSq || ""} />
              </label>
              <label className="lg:col-span-3">
                <span className="admin-label">Hinweis Deutsch</span>
                <textarea className="admin-input mt-1" name="noteDe" rows={3} defaultValue={stat.noteDe || ""} />
              </label>
              <button className="rounded-md bg-pine px-5 py-3 font-black text-white lg:col-span-3" type="submit">Ruaj ndryshimet</button>
            </form>
          </details>
        </article>
      ))}
    </div>
  );
}

function ReportsEditor({ reports }: { reports: AdminReport[] }) {
  if (!reports.length) return <p className="mt-5 text-sm font-bold text-ink/55">Ende nuk ka raporte financiare.</p>;

  return (
    <div className="mt-6 space-y-4">
      <h3 className="text-lg font-black text-ink">Raportet ekzistuese</h3>
      {reports.map((report) => (
        <article key={report.id} className="rounded-lg border border-ink/10 bg-ink/[0.03] p-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h4 className="font-black text-ink">{report.year} · {report.title}</h4>
              <p className="text-sm font-semibold text-ink/60">
                Të hyrat: {moneyText(report.income)} CHF · Shpenzimet: {moneyText(report.expenses)} CHF · {report.isPublished ? "Publikuar" : "I fshehur"}
              </p>
            </div>
            <div className="flex gap-2">
              <ConfirmDeleteForm id={report.id} model="report" label="Fshi" message={`A jeni të sigurt që doni ta fshini raportin ${report.year}?`} />
            </div>
          </div>

          <details className="mt-4">
            <summary className="cursor-pointer rounded-md bg-ink px-4 py-3 text-sm font-black text-white">Edit</summary>
            <form action="/api/admin/report-update" method="post" encType="multipart/form-data" className="mt-4 grid gap-4 lg:grid-cols-2">
              <input type="hidden" name="id" value={report.id} />
              <YearField label="Viti" name="year" defaultValue={String(report.year)} required />
              <Field label="Titulli" name="title" defaultValue={report.title} required />
              <Field label="Të hyrat CHF" name="income" type="number" defaultValue={moneyText(report.income)} required />
              <Field label="Shpenzimet CHF" name="expenses" type="number" defaultValue={moneyText(report.expenses)} required />
              <Field label="PDF URL" name="pdfUrl" defaultValue={report.pdfUrl || ""} />
              <label>
                <span className="admin-label">Ngarko PDF të ri</span>
                <input className="admin-input mt-1" name="pdf" type="file" accept="application/pdf" />
              </label>
              <label className="lg:col-span-2">
                <span className="admin-label">Kategoritë, një për rresht: Emri: shuma</span>
                <textarea className="admin-input mt-1" name="categories" rows={5} defaultValue={categoriesText(report.categories)} />
              </label>
              <label className="flex items-center gap-2 font-bold"><input name="isPublished" type="checkbox" defaultChecked={report.isPublished} /> Publiko</label>
              <button className="rounded-md bg-pine px-5 py-3 font-black text-white lg:col-span-2" type="submit">Ruaj ndryshimet</button>
            </form>
          </details>
        </article>
      ))}
    </div>
  );
}

function moneyText(value: unknown) {
  if (typeof value === "number") return String(value);
  if (typeof value === "string") return value;
  if (value && typeof value === "object" && "toString" in value) return value.toString();
  return "0";
}

function categoriesText(value: unknown) {
  if (!Array.isArray(value)) return "";
  return value
    .map((item) => {
      if (!item || typeof item !== "object") return "";
      const category = item as { label?: unknown; amount?: unknown };
      return `${String(category.label ?? "Kategori")}: ${String(category.amount ?? 0)}`;
    })
    .filter(Boolean)
    .join("\n");
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
