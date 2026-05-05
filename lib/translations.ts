import type { Lang } from "@/lib/types";

export const navItems = [
  { href: "/", sq: "Ballina", de: "Start" },
  { href: "/rreth-shoqates", sq: "Rreth Shoqatës", de: "Über uns" },
  { href: "/projekte", sq: "Projektet", de: "Projekte" },
  { href: "/raportet-financiare", sq: "Raportet financiare", de: "Finanzberichte" },
  { href: "/anetaret", sq: "Anëtarët", de: "Mitglieder" },
  { href: "/behu-anetar", sq: "Bëhu anëtar", de: "Mitglied werden" },
  { href: "/donacione", sq: "Donacione", de: "Spenden" },
  { href: "/kryesia", sq: "Kryesia", de: "Vorstand" },
  { href: "/eventet", sq: "Eventet", de: "Veranstaltungen" },
  { href: "/galeria", sq: "Galeria", de: "Galerie" },
  { href: "/statuti", sq: "Statuti", de: "Statuten" },
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
    applyText: "Dërgo të dhënat bazë. Kryesia mund ta shqyrtojë aplikimin nga administrimi.",
    submit: "Dërgo",
    saved: "Faleminderit. Aplikimi u regjistrua për shqyrtim.",
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
    applyText: "Senden Sie die Basisdaten. Der Vorstand kann den Antrag im Adminbereich prüfen.",
    submit: "Senden",
    saved: "Danke. Der Antrag wurde zur Prüfung erfasst.",
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
