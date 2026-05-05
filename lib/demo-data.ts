import type { PublicData } from "@/lib/types";

export const demoData: PublicData = {
  settings: {
    associationName: "Shoqata Rainca",
    officialEmail: "info@shoqata-rainca.ch",
    domain: "shoqata-rainca.ch",
    heroImageUrl: "/demo/rainca-aerial-placeholder.svg",
    qrImageUrl: "/demo/qr-payment-placeholder.svg",
    iban: "CH00 0000 0000 0000 0000 0",
    bankName: "E editueshme nga administrimi",
    paymentNote: "Të dhënat e pagesës janë shembull për demo dhe duhet të verifikohen nga kryesia.",
    contactAddress: "Zürich, Schweiz",
    contactPhone: ""
  },
  projects: [
    {
      id: "demo-road",
      titleSq: "Bashkëfinancim për infrastrukturë lokale",
      titleDe: "Kofinanzierung lokaler Infrastruktur",
      summarySq: "Mbështetje për projekte që përmirësojnë qasjen, sigurinë dhe cilësinë e jetës në Raincë.",
      summaryDe: "Unterstützung für Vorhaben, die Zugang, Sicherheit und Lebensqualität in Raincë verbessern.",
      category: "Infrastrukturë",
      status: "Në planifikim",
      year: 2026,
      budget: 25000,
      imageUrl: "/demo/project-infrastructure.svg"
    },
    {
      id: "demo-youth",
      titleSq: "Rinia, sporti dhe arsimi",
      titleDe: "Jugend, Sport und Bildung",
      summarySq: "Aktivitete për të rinjtë, mbështetje arsimore dhe bashkëpunim me diasporën.",
      summaryDe: "Aktivitäten für junge Menschen, Bildungsförderung und Zusammenarbeit mit der Diaspora.",
      category: "Rini",
      status: "Aktiv",
      year: 2026,
      budget: 8000,
      imageUrl: "/demo/project-youth.svg"
    },
    {
      id: "demo-humanitarian",
      titleSq: "Ndihmë humanitare dhe shëndetësi",
      titleDe: "Humanitäre Hilfe und Gesundheit",
      summarySq: "Fond solidariteti për raste emergjente, shëndetësi dhe familje në nevojë.",
      summaryDe: "Solidaritätsfonds für Notfälle, Gesundheit und Familien mit Unterstützungsbedarf.",
      category: "Humanitare",
      status: "I hapur",
      year: 2026,
      budget: 12000,
      imageUrl: "/demo/project-health.svg"
    }
  ],
  reports: [
    {
      id: "demo-2025",
      year: 2025,
      title: "Raporti financiar 2025",
      income: 38400,
      expenses: 29750,
      balance: 8650,
      categories: [
        { label: "Anëtarësi", amount: 16800 },
        { label: "Donacione", amount: 21600 },
        { label: "Projekte", amount: 20500 },
        { label: "Aktivitete", amount: 5250 },
        { label: "Administrim", amount: 4000 }
      ],
      hasPdf: false
    },
    {
      id: "demo-2024",
      year: 2024,
      title: "Raporti financiar 2024",
      income: 31200,
      expenses: 28800,
      balance: 2400,
      categories: [
        { label: "Anëtarësi", amount: 15100 },
        { label: "Donacione", amount: 16100 },
        { label: "Projekte", amount: 19600 },
        { label: "Aktivitete", amount: 6200 },
        { label: "Administrim", amount: 3000 }
      ],
      hasPdf: false
    }
  ],
  members: [
    {
      id: "demo-member-1",
      name: "Arben",
      surname: "Imeri",
      country: "Schweiz",
      year: 2010,
      status: "APPROVED",
      amount: 100,
      currency: "CHF"
    },
    {
      id: "demo-member-2",
      name: "Besnik",
      surname: "Jahiu",
      country: "Schweiz",
      year: 2022,
      status: "APPROVED",
      amount: null,
      currency: null
    },
    {
      id: "demo-member-3",
      name: "Drita",
      surname: "Limani",
      country: "Deutschland",
      year: 2024,
      status: "PENDING",
      amount: null,
      currency: null
    }
  ],
  board: [
    {
      id: "demo-board-1",
      fullName: "Emër Mbiemër",
      positionSq: "Kryetar/e",
      positionDe: "Präsident/in",
      bioSq: "Profil i editueshëm nga administrimi.",
      bioDe: "Bearbeitbares Profil im Adminbereich."
    },
    {
      id: "demo-board-2",
      fullName: "Emër Mbiemër",
      positionSq: "Arkëtar/e",
      positionDe: "Kassier/in",
      bioSq: "Të dhënat zyrtare vendosen pas miratimit.",
      bioDe: "Offizielle Angaben werden nach Freigabe eingetragen."
    }
  ],
  events: [
    {
      id: "demo-event-1",
      titleSq: "Takim informues me anëtarët",
      titleDe: "Informationsabend mit Mitgliedern",
      descriptionSq: "Prezantim i demos, diskutim për prioritetet dhe mbledhje idesh nga komuniteti.",
      descriptionDe: "Vorstellung der Demo, Diskussion der Prioritäten und Sammlung von Ideen aus der Gemeinschaft.",
      location: "Zürich",
      startsAt: "2026-06-14T18:00:00.000Z"
    }
  ],
  gallery: [
    {
      id: "demo-gallery-1",
      titleSq: "Raincë nga ajri",
      titleDe: "Raincë aus der Luft",
      imageUrl: "/demo/rainca-aerial-placeholder.svg",
      captionSq: "Foto e ngarkueshme nga administrimi.",
      captionDe: "Bild im Adminbereich austauschbar."
    }
  ]
};
