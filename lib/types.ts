export type Lang = "sq" | "de";

export type CategoryValue = {
  label: string;
  amount: number;
};

export type PublicData = {
  settings: {
    associationName: string;
    officialEmail: string;
    domain: string;
    heroImageUrl: string;
    logoUrl?: string | null;
    qrImageUrl: string;
    iban?: string | null;
    bankName?: string | null;
    paymentNote?: string | null;
    contactAddress?: string | null;
    contactPhone?: string | null;
    statutePdfUrl?: string | null;
  };
  projects: Array<{
    id: string;
    titleSq: string;
    titleDe: string;
    summarySq: string;
    summaryDe: string;
    category: string;
    status: string;
    year: number;
    budget?: number | null;
    imageUrl?: string | null;
  }>;
  reports: Array<{
    id: string;
    year: number;
    title: string;
    income: number;
    expenses: number;
    balance: number;
    categories: CategoryValue[];
    pdfUrl?: string | null;
    hasPdf?: boolean;
  }>;
  members: Array<{
    id: string;
    name: string;
    surname: string;
    country?: string | null;
    year?: number | null;
    status: string;
    amount?: number | null;
    currency?: string | null;
  }>;
  board: Array<{
    id: string;
    fullName: string;
    positionSq: string;
    positionDe: string;
    bioSq?: string | null;
    bioDe?: string | null;
    imageUrl?: string | null;
  }>;
  events: Array<{
    id: string;
    titleSq: string;
    titleDe: string;
    descriptionSq: string;
    descriptionDe: string;
    location: string;
    startsAt: string;
    imageUrl?: string | null;
  }>;
  gallery: Array<{
    id: string;
    titleSq: string;
    titleDe: string;
    imageUrl: string;
    captionSq?: string | null;
    captionDe?: string | null;
  }>;
};
