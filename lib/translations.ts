import type { Lang } from "@/lib/types";

export const navItems = [
  { href: "/", sq: "Ballina", de: "Startseite" },
  { href: "/eventet", sq: "Eventet", de: "Veranstaltungen" },
  { href: "/galeria", sq: "Galeria", de: "Galerie" },
  { href: "/projekte", sq: "Projektet", de: "Projekte" },
  { href: "/raportet-financiare", sq: "Raportet financiare", de: "Finanzberichte" },
  { href: "/anetaret", sq: "Anëtarët", de: "Mitglieder" },
  { href: "/behu-anetar", sq: "Bëhu anëtar", de: "Mitglied werden" },
  { href: "/donacione", sq: "Donacione", de: "Spenden" },
  { href: "/kryesia", sq: "Kryesia", de: "Vorstand" },
  { href: "/statuti", sq: "Statuti", de: "Statut" },
  { href: "/rreth-shoqates", sq: "Rreth Shoqatës", de: "Über uns" },
  { href: "/kontakt", sq: "Kontakt", de: "Kontakt" }
];

export const copy = {
  sq: {
    demo: "Demo vullnetare për prezantim te kryesia. Nuk është faqe zyrtarisht e miratuar ende.",
    heroEyebrow: "Shoqatë komunitare e diasporës",
    heroTitle: "Shoqata Rainca",
    heroText:
      "Një platformë moderne për transparencë, anëtarësi dhe projekte që përmirësojnë mirëqenien dhe cilësinë e jetës në Raincë.",
    ctaMember: "Bëhu anëtar",
    ctaDonate: "Mbështet me donacion",
    founded: "Themeluar më 23 maj 2010 në Regensdorf, Zürich, Zvicër",
    seat: "Selia: Zürich",
    neutral: "E pavarur, politikisht dhe konfesionalisht neutrale",
    missionTitle: "Misioni",
    missionText:
      "Shoqata punon për mirëqenien e Raincës përmes projekteve komunitare, bashkëfinancimit, aktiviteteve humanitare, arsimit, mbështetjes shëndetësore, sportit, rinisë, infrastrukturës dhe bashkëpunimit me diasporën.",
    projects: "Projektet",
    reports: "Transparenca financiare",
    members: "Anëtarët publikë",
    publicOnly: "Shfaqen vetëm fushat publike: emri, mbiemri, viti, statusi dhe shuma vetëm kur është lejuar publikisht.",
    board: "Kryesia",
    events: "Eventet",
    gallery: "Galeria",
    contact: "Kontakt",
    statute: "Statuti",
    statuteText: "Statuti zyrtar mund të ngarkohet nga administrimi dhe të shkarkohet këtu pas miratimit.",
    download: "Shkarko PDF",
    noPdf: "PDF nuk është ngarkuar ende.",
    income: "Të hyrat",
    expenses: "Shpenzimet",
    balance: "Bilanci",
    categories: "Kategoritë",
    payment: "Pagesa",
    iban: "IBAN",
    qrNote: "QR dhe të dhënat bankare janë të editueshme nga administrimi.",
    applyTitle: "Aplikim për anëtarësi",
    applyText: "Plotësoni aplikimin për anëtarësi. Pas pranimit, shoqata ju kontakton për konfirmim dhe pagesë.",
    membershipFeeText: "Anëtarësia vjetore është 100 CHF për anëtarët në Zvicër dhe 100 EUR për anëtarët në Gjermani, sipas vendimit të Shoqatës.",
    submit: "Dërgo",
    saved: "Faleminderit për aplikimin. Shoqata Rainca do t’ju kontaktojë për konfirmim dhe pagesë.",
    admin: "Admin"
  },
  de: {
    demo: "Freiwillige Demo zur Präsentation beim Vorstand. Diese Website ist noch nicht offiziell freigegeben.",
    heroEyebrow: "Gemeinschaftsverein der Diaspora",
    heroTitle: "Shoqata Rainca",
    heroText:
      "Eine moderne Plattform für Transparenz, Mitgliedschaft und Projekte, die Wohlergehen und Lebensqualität in Raincë stärken.",
    ctaMember: "Mitglied werden",
    ctaDonate: "Spenden",
    founded: "Gegründet am 23. Mai 2010 in Regensdorf, Zürich, Schweiz",
    seat: "Sitz: Zürich",
    neutral: "Unabhängig, politisch und konfessionell neutral",
    missionTitle: "Mission",
    missionText:
      "Der Verein fördert Raincë durch Gemeinschaftsprojekte, Kofinanzierung, humanitäre Aktivitäten, Bildung, Gesundheitsunterstützung, Sport, Jugend, Infrastruktur und Zusammenarbeit mit der Diaspora.",
    projects: "Projekte",
    reports: "Finanzielle Transparenz",
    members: "Öffentliche Mitglieder",
    publicOnly: "Angezeigt werden nur öffentliche Felder: Name, Nachname, Jahr, Status und Betrag nur bei öffentlicher Freigabe.",
    board: "Vorstand",
    events: "Veranstaltungen",
    gallery: "Galerie",
    contact: "Kontakt",
    statute: "Statuten",
    statuteText: "Die offiziellen Statuten können im Adminbereich hochgeladen und nach Freigabe hier heruntergeladen werden.",
    download: "PDF herunterladen",
    noPdf: "Noch kein PDF hochgeladen.",
    income: "Einnahmen",
    expenses: "Ausgaben",
    balance: "Saldo",
    categories: "Kategorien",
    payment: "Zahlung",
    iban: "IBAN",
    qrNote: "QR und Bankdaten sind im Adminbereich bearbeitbar.",
    applyTitle: "Mitgliedsantrag",
    applyText: "Füllen Sie den Mitgliedsantrag aus. Nach Eingang kontaktiert Sie der Verein zur Bestätigung und Zahlung.",
    membershipFeeText: "Der jährliche Mitgliederbeitrag beträgt 100 CHF für Mitglieder in der Schweiz und 100 EUR für Mitglieder in Deutschland, gemäß Beschluss des Vereins.",
    submit: "Senden",
    saved: "Danke für den Antrag. Shoqata Rainca wird Sie zur Bestätigung und Zahlung kontaktieren.",
    admin: "Admin"
  }
} satisfies Record<Lang, Record<string, string>>;

export function pickLang(value?: string | string[] | null): Lang {
  const raw = Array.isArray(value) ? value[0] : value;
  return raw === "de" ? "de" : "sq";
}

export function withLang(href: string, lang: Lang) {
  return lang === "de" ? `${href}?lang=de` : href;
}
