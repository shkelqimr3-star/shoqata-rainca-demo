import Link from "next/link";
import { FinancialDashboard } from "@/components/Charts";
import { CopyIbanButton } from "@/components/CopyIbanButton";
import { Logo } from "@/components/Logo";
import { MembersDirectory } from "@/components/MembersDirectory";
import { MembershipStatsChart } from "@/components/MembershipStatsChart";
import { ProjectsDirectory } from "@/components/ProjectsDirectory";
import { SafeImage } from "@/components/SafeImage";
import { copy, navItems, withLang } from "@/lib/translations";
import type { Lang, PublicData } from "@/lib/types";

type PublicSiteProps = {
  data: PublicData;
  lang: Lang;
  page?: string;
  saved?: boolean;
};

const pageMap: Record<string, string> = {
  "rreth-shoqates": "about",
  projekte: "projects",
  "raportet-financiare": "reports",
  anetaret: "members",
  "behu-anetar": "join",
  donacione: "donations",
  kryesia: "board",
  eventet: "events",
  galeria: "gallery",
  statuti: "statute",
  kontakt: "contact"
};

function tx(lang: Lang, sq: string, de: string) {
  return lang === "de" ? de : sq;
}

function AssetImage({ src, alt, className }: { src?: string | null; alt: string; className: string }) {
  return <SafeImage src={src} alt={alt} className={className} />;
}

export function PublicSite({ data, lang, page = "home", saved = false }: PublicSiteProps) {
  const t = copy[lang];
  const officialIban = "CH28 0900 0000 8579 6173 2";
  const active = pageMap[page] ?? page;
  const showAll = active === "home";
  const latestReport = data.reports[0];

  return (
    <div>
      <header className="sticky top-0 z-40 border-b border-ink/10 bg-white/90 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3">
          <Link href={withLang("/", lang)} aria-label="Shoqata Rainca">
            <Logo logoUrl={data.settings.logoUrl} />
          </Link>
          <nav className="hidden items-center gap-1 xl:flex">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={withLang(item.href, lang)}
                className="rounded-md px-3 py-2 text-sm font-bold text-ink/70 transition hover:bg-pine/10 hover:text-pine"
              >
                {item[lang]}
              </Link>
            ))}
          </nav>
          <div className="flex items-center gap-2 text-sm font-black">
            <Link className={lang === "sq" ? "text-pine" : "text-ink/45"} href={page === "home" ? "/" : `/${page}`}>
              Shqip
            </Link>
            <span className="text-ink/20">|</span>
            <Link className={lang === "de" ? "text-pine" : "text-ink/45"} href={page === "home" ? "/?lang=de" : `/${page}?lang=de`}>
              Deutsch
            </Link>
          </div>
        </div>
        <div className="mx-auto flex max-w-7xl gap-2 overflow-x-auto px-4 pb-3 xl:hidden">
          {navItems.map((item) => (
            <Link key={item.href} href={withLang(item.href, lang)} className="shrink-0 rounded-full bg-ink/5 px-3 py-2 text-xs font-bold text-ink/70">
              {item[lang]}
            </Link>
          ))}
        </div>
      </header>

      {(showAll || active === "home") && (
        <section className="relative min-h-[76vh] overflow-hidden">
          <div className="absolute inset-0 asset-fallback">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <SafeImage
              src={data.settings.heroImageUrl}
              alt="Raincë aerial view"
              className="h-full w-full"
            />
          </div>
          <div className="absolute inset-0 bg-gradient-to-r from-ink/78 via-ink/42 to-ink/10" />
          <div className="relative mx-auto flex min-h-[76vh] max-w-7xl items-end px-4 pb-12 pt-24">
            <div className="max-w-3xl text-white">
              <p className="mb-4 inline-flex rounded-full bg-white/16 px-4 py-2 text-sm font-bold ring-1 ring-white/25">{t.heroEyebrow}</p>
              <h1 className="text-5xl font-black leading-[1.02] sm:text-7xl">{t.heroTitle}</h1>
              <p className="mt-5 max-w-2xl text-lg font-medium leading-8 text-white/88">{t.heroText}</p>
              <div className="mt-8 flex flex-wrap gap-3">
                <Link href={withLang("/behu-anetar", lang)} className="rounded-md bg-gold px-5 py-3 font-black text-ink shadow-soft">
                  {t.ctaMember}
                </Link>
                <Link href={withLang("/donacione", lang)} className="rounded-md bg-white/12 px-5 py-3 font-black text-white ring-1 ring-white/35">
                  {t.ctaDonate}
                </Link>
              </div>
            </div>
          </div>
        </section>
      )}

      <main className="mx-auto max-w-7xl px-4 py-12">
        {active === "about" && (
          <section className="grid gap-8 py-10 lg:grid-cols-[0.85fr_1.15fr]">
            <div>
              <p className="text-sm font-black uppercase tracking-wide text-pine">{tx(lang, "Rreth Shoqatës", "Über uns")}</p>
              <h2 className="mt-3 text-3xl font-black text-ink sm:text-4xl">{t.missionTitle}</h2>
            </div>
            <div className="grid gap-4 sm:grid-cols-3">
              {[t.founded, t.seat, t.neutral].map((item) => (
                <div key={item} className="rounded-lg border border-ink/10 bg-white p-5 shadow-sm">
                  <p className="font-bold leading-7 text-ink/76">{item}</p>
                </div>
              ))}
              <div className="rounded-lg border border-pine/20 bg-pine p-6 text-white sm:col-span-3">
                <p className="text-lg font-semibold leading-8">{t.missionText}</p>
              </div>
            </div>
          </section>
        )}

        {showAll && (
          <section className="py-10">
            <SectionTitle eyebrow={tx(lang, "Kalendari", "Kalender")} title={t.events} />
            <div className="grid gap-5 md:grid-cols-2">
              {data.events.map((event) => (
                <article key={event.id} className="overflow-hidden rounded-lg border border-ink/10 bg-white shadow-sm">
                  {event.imageUrl && (
                    <div className="h-44 bg-skywash">
                      <AssetImage src={event.imageUrl} alt={tx(lang, event.titleSq, event.titleDe)} className="h-full w-full" />
                    </div>
                  )}
                  <div className="p-5">
                    <p className="text-sm font-black text-gold">
                      {new Intl.DateTimeFormat(lang === "de" ? "de-CH" : "sq-AL", { dateStyle: "full", timeStyle: "short" }).format(new Date(event.startsAt))}
                    </p>
                    <h3 className="mt-2 text-xl font-black">{tx(lang, event.titleSq, event.titleDe)}</h3>
                    <p className="mt-3 leading-7 text-ink/68">{tx(lang, event.descriptionSq, event.descriptionDe)}</p>
                    <p className="mt-4 font-bold text-ink/64">{event.location}</p>
                  </div>
                </article>
              ))}
            </div>
          </section>
        )}

        {showAll && (
          <section className="py-10">
            <SectionTitle eyebrow={tx(lang, "Pamje", "Einblicke")} title={t.gallery} />
            <div className="grid gap-5 md:grid-cols-3">
              {data.gallery.map((item) => (
                <article key={item.id} className="overflow-hidden rounded-lg border border-ink/10 bg-white shadow-sm">
                  <div className="relative h-56 bg-skywash">
                    <AssetImage src={item.imageUrl} alt={tx(lang, item.titleSq, item.titleDe)} className="h-full w-full" />
                  </div>
                  <div className="p-4">
                    <h3 className="font-black">{tx(lang, item.titleSq, item.titleDe)}</h3>
                    <p className="mt-1 text-sm font-semibold text-ink/60">{tx(lang, item.captionSq || "", item.captionDe || "")}</p>
                  </div>
                </article>
              ))}
            </div>
          </section>
        )}

        {(showAll || active === "projects") && (
          <section className="py-10">
            <SectionTitle eyebrow={tx(lang, "Prioritetet", "Prioritäten")} title={t.projects} />
            <ProjectsDirectory projects={data.projects} lang={lang} />
          </section>
        )}

        {(showAll || active === "reports") && latestReport && (
          <section className="py-10">
            <SectionTitle eyebrow={tx(lang, "Besim përmes të dhënave", "Vertrauen durch Zahlen")} title={t.reports} />
            <p className="mb-6 max-w-3xl text-lg font-semibold leading-8 text-ink/70">
              Raportet financiare publikohen për transparencë ndaj anëtarëve, donatorëve dhe komunitetit të Raincës.
            </p>
            <FinancialDashboard
              reports={data.reports}
              labels={{
                income: t.income,
                expenses: t.expenses,
                balance: t.balance,
                download: t.download,
                noPdf: t.noPdf,
                yearlyBalance: tx(lang, "Bilanci sipas viteve", "Saldo nach Jahr"),
                incomeVsExpenses: tx(lang, "Të hyrat kundrejt shpenzimeve", "Einnahmen gegenüber Ausgaben"),
                categoryExpenses: tx(lang, "Shpenzimet sipas kategorive", "Ausgaben nach Kategorien")
              }}
            />
          </section>
        )}

        {(showAll || active === "members") && (
          <section className="py-10">
            <SectionTitle eyebrow={tx(lang, "Listë publike", "Öffentliche Liste")} title={t.members} />
            <p className="mb-5 max-w-3xl font-semibold leading-7 text-ink/65">{t.publicOnly}</p>
            <div className="mb-8 rounded-lg border border-ink/10 bg-white p-5 shadow-sm">
              <h3 className="text-2xl font-black text-ink">{tx(lang, "Statistika e anëtarësisë", "Mitgliederstatistik")}</h3>
              <MembershipStatsChart stats={data.membershipStats} lang={lang} />
              {data.membershipStats.some((stat) => stat.noteSq || stat.noteDe) && (
                <div className="mt-4 space-y-2 text-sm font-semibold leading-6 text-ink/62">
                  {data.membershipStats
                    .filter((stat) => stat.noteSq || stat.noteDe)
                    .map((stat) => (
                      <p key={`${stat.id}-note`}>{tx(lang, stat.noteSq || "", stat.noteDe || "")}</p>
                    ))}
                </div>
              )}
            </div>
            <MembersDirectory members={data.members} lang={lang} />
          </section>
        )}

        {(showAll || active === "join" || active === "donations") && (
          <section className="grid gap-6 py-10 lg:grid-cols-[1fr_0.9fr]">
            <div className="rounded-lg border border-ink/10 bg-white p-6 shadow-sm">
              <SectionTitle eyebrow={tx(lang, "Komuniteti", "Gemeinschaft")} title={t.applyTitle} compact />
              <p className="mb-5 leading-7 text-ink/70">{t.applyText}</p>
              <p className="mb-5 rounded-lg bg-pine/5 p-4 font-semibold leading-7 text-ink/72">{t.membershipFeeText}</p>
              <div className="mb-5 grid gap-3 rounded-lg bg-ink/[0.03] p-4 sm:grid-cols-3">
                <div>
                  <p className="text-xs font-black uppercase tracking-wide text-pine">{tx(lang, "Zvicër", "Schweiz")}</p>
                  <p className="mt-1 text-lg font-black text-ink">100 CHF</p>
                  <p className="text-sm font-semibold text-ink/60">{tx(lang, "në vit", "pro Jahr")}</p>
                </div>
                <div>
                  <p className="text-xs font-black uppercase tracking-wide text-pine">{tx(lang, "Gjermani", "Deutschland")}</p>
                  <p className="mt-1 text-lg font-black text-ink">100 EUR</p>
                  <p className="text-sm font-semibold text-ink/60">{tx(lang, "në vit", "pro Jahr")}</p>
                </div>
                <div>
                  <p className="text-xs font-black uppercase tracking-wide text-pine">{tx(lang, "Vende tjera", "Andere Länder")}</p>
                  <p className="mt-1 text-lg font-black text-ink">80 EUR</p>
                  <p className="text-sm font-semibold text-ink/60">{tx(lang, "sipas vendimit", "gemäß Beschluss")}</p>
                </div>
              </div>
              {saved && <p className="mb-5 rounded-md bg-pine/10 px-4 py-3 font-bold text-pine">{t.saved}</p>}
              <form action="/api/apply" method="post" className="grid gap-3 sm:grid-cols-2">
                <input className="admin-input" name="fullName" placeholder={tx(lang, "Emri dhe mbiemri", "Vor- und Nachname")} required />
                <input className="admin-input" name="email" type="email" placeholder="Email" required />
                <input className="admin-input" name="phone" placeholder={tx(lang, "Telefoni", "Telefon")} />
                <input className="admin-input" name="city" placeholder={tx(lang, "Qyteti", "Ort")} />
                <input className="admin-input" name="country" placeholder={tx(lang, "Shteti", "Land")} />
                <textarea className="admin-input sm:col-span-2" name="message" placeholder={tx(lang, "Mesazh", "Nachricht")} rows={4} />
                <button className="rounded-md bg-pine px-5 py-3 font-black text-white sm:col-span-2" type="submit">
                  {t.submit}
                </button>
              </form>
            </div>
            <div className="rounded-lg border border-ink/10 bg-white p-6 shadow-sm">
              <SectionTitle eyebrow={tx(lang, "Kontribute", "Beiträge")} title={t.payment} compact />
              <div className="relative mx-auto my-5 aspect-square max-w-[260px] overflow-hidden rounded-lg border border-ink/10 bg-white">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <SafeImage src={data.settings.qrImageUrl} alt="QR payment" className="h-full w-full p-3" fallbackClassName="bg-white" imgClassName="object-contain" />
              </div>
              <div className="space-y-4 text-sm font-semibold text-ink/72">
                <div className="rounded-lg border border-ink/10 bg-ink/[0.03] p-4">
                  <p className="font-black text-ink">Verein Rainca</p>
                  <p>8000 Zürich</p>
                  <p>PostFinance AG</p>
                  <p><span className="font-black text-ink">{t.iban}:</span> {officialIban}</p>
                  <p><span className="font-black text-ink">BIC:</span> POFICHBEXXX</p>
                </div>
                <CopyIbanButton iban={officialIban} label={tx(lang, "Kopjo IBAN", "IBAN kopieren")} copiedLabel={tx(lang, "IBAN u kopjua.", "IBAN kopiert.")} />
                <p>{t.membershipFeeText}</p>
                <p>{tx(lang, "Ju lutemi shënoni emrin dhe qëllimin e pagesës.", "Bitte Namen und Zahlungszweck angeben.")}</p>
              </div>
            </div>
          </section>
        )}

        {(showAll || active === "board") && (
          <section className="py-10">
            <SectionTitle eyebrow={tx(lang, "Udhëheqja", "Leitung")} title={t.board} />
            <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
              {data.board.map((person) => (
                <article key={person.id} className="rounded-lg border border-ink/10 bg-white p-5 shadow-sm">
                  {person.imageUrl ? (
                    <SafeImage src={person.imageUrl} alt={person.fullName} className="mb-4 h-14 w-14 overflow-hidden rounded-full" />
                  ) : (
                    <div className="mb-4 grid h-14 w-14 place-items-center rounded-full bg-pine/10 font-black text-pine">
                      {person.fullName.split(" ").map((part) => part[0]).join("").slice(0, 2)}
                    </div>
                  )}
                  <h3 className="text-xl font-black">{person.fullName}</h3>
                  <p className="font-bold text-pine">{tx(lang, person.positionSq, person.positionDe)}</p>
                  <p className="mt-3 leading-7 text-ink/68">{tx(lang, person.bioSq || "", person.bioDe || "")}</p>
                </article>
              ))}
            </div>
          </section>
        )}

        {active === "events" && (
          <section className="py-10">
            <SectionTitle eyebrow={tx(lang, "Kalendari", "Kalender")} title={t.events} />
            <div className="grid gap-5 md:grid-cols-2">
              {data.events.map((event) => (
                <article key={event.id} className="overflow-hidden rounded-lg border border-ink/10 bg-white shadow-sm">
                  {event.imageUrl && (
                    <div className="h-44 bg-skywash">
                      <AssetImage src={event.imageUrl} alt={tx(lang, event.titleSq, event.titleDe)} className="h-full w-full" />
                    </div>
                  )}
                  <div className="p-5">
                  <p className="text-sm font-black text-gold">
                    {new Intl.DateTimeFormat(lang === "de" ? "de-CH" : "sq-AL", { dateStyle: "full", timeStyle: "short" }).format(new Date(event.startsAt))}
                  </p>
                  <h3 className="mt-2 text-xl font-black">{tx(lang, event.titleSq, event.titleDe)}</h3>
                  <p className="mt-3 leading-7 text-ink/68">{tx(lang, event.descriptionSq, event.descriptionDe)}</p>
                  <p className="mt-4 font-bold text-ink/64">{event.location}</p>
                  </div>
                </article>
              ))}
            </div>
          </section>
        )}

        {active === "gallery" && (
          <section className="py-10">
            <SectionTitle eyebrow={tx(lang, "Pamje", "Einblicke")} title={t.gallery} />
            <div className="grid gap-5 md:grid-cols-3">
              {data.gallery.map((item) => (
                <article key={item.id} className="overflow-hidden rounded-lg border border-ink/10 bg-white shadow-sm">
                  <div className="relative h-56 bg-skywash">
                    <AssetImage src={item.imageUrl} alt={tx(lang, item.titleSq, item.titleDe)} className="h-full w-full" />
                  </div>
                  <div className="p-4">
                    <h3 className="font-black">{tx(lang, item.titleSq, item.titleDe)}</h3>
                    <p className="mt-1 text-sm font-semibold text-ink/60">{tx(lang, item.captionSq || "", item.captionDe || "")}</p>
                  </div>
                </article>
              ))}
            </div>
          </section>
        )}

        {showAll && (
          <section className="grid gap-8 py-10 lg:grid-cols-[0.85fr_1.15fr]">
            <div>
              <p className="text-sm font-black uppercase tracking-wide text-pine">{tx(lang, "Rreth Shoqatës", "Über uns")}</p>
              <h2 className="mt-3 text-3xl font-black text-ink sm:text-4xl">{t.missionTitle}</h2>
            </div>
            <div className="grid gap-4 sm:grid-cols-3">
              {[t.founded, t.seat, t.neutral].map((item) => (
                <div key={item} className="rounded-lg border border-ink/10 bg-white p-5 shadow-sm">
                  <p className="font-bold leading-7 text-ink/76">{item}</p>
                </div>
              ))}
              <div className="rounded-lg border border-pine/20 bg-pine p-6 text-white sm:col-span-3">
                <p className="text-lg font-semibold leading-8">{t.missionText}</p>
              </div>
            </div>
          </section>
        )}

        {(showAll || active === "statute" || active === "contact") && (
          <section className="grid gap-6 py-10 lg:grid-cols-2">
            {(showAll || active === "statute") && (
              <div className="rounded-lg border border-ink/10 bg-white p-6 shadow-sm">
                <SectionTitle eyebrow={tx(lang, "Dokumentet", "Dokumente")} title={t.statute} compact />
                <p className="mb-5 leading-7 text-ink/70">{t.statuteText}</p>
                {data.settings.statutePdfUrl ? (
                  <Link href={data.settings.statutePdfUrl} className="rounded-md bg-ink px-4 py-3 font-black text-white">{t.download}</Link>
                ) : (
                  <p className="font-bold text-ink/55">{t.noPdf}</p>
                )}
              </div>
            )}
            {(showAll || active === "contact") && (
              <div className="rounded-lg border border-ink/10 bg-white p-6 shadow-sm">
                <SectionTitle eyebrow={tx(lang, "Na shkruani", "Kontakt aufnehmen")} title={t.contact} compact />
                <div className="space-y-3 font-semibold leading-7 text-ink/72">
                  <p><span className="font-black text-ink">Email:</span> <a href={`mailto:${data.settings.officialEmail}`}>{data.settings.officialEmail}</a></p>
                  <p><span className="font-black text-ink">Domain:</span> {data.settings.domain}</p>
                  {data.settings.contactAddress && <p>{data.settings.contactAddress}</p>}
                  {data.settings.contactPhone && <p>{data.settings.contactPhone}</p>}
                </div>
              </div>
            )}
          </section>
        )}
      </main>

      <footer className="border-t border-ink/10 bg-white">
        <div className="mx-auto flex max-w-7xl flex-col gap-4 px-4 py-8 md:flex-row md:items-center md:justify-between">
          <Logo logoUrl={data.settings.logoUrl} />
          <div className="text-sm font-semibold text-ink/58">
            <Link href="/admin" className="font-black text-pine">{t.admin}</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}

function SectionTitle({ eyebrow, title, compact = false }: { eyebrow: string; title: string; compact?: boolean }) {
  return (
    <div className={compact ? "mb-4" : "mb-6"}>
      <p className="text-sm font-black uppercase tracking-wide text-pine">{eyebrow}</p>
      <h2 className={`${compact ? "text-2xl" : "text-3xl sm:text-4xl"} mt-2 font-black text-ink`}>{title}</h2>
    </div>
  );
}
