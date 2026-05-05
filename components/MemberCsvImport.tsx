"use client";

import { useMemo, useState } from "react";

type ParsedMember = {
  firstName: string;
  lastName: string;
  city: string;
  country: string;
  year: number | null;
  status: string;
  paidAmount: string;
  currency: string;
  paymentStatus: string;
  isPublic: boolean;
  showAmountPublicly: boolean;
  privateNotes: string;
};

type Preview = {
  rows: ParsedMember[];
  errors: string[];
};

const headers = [
  "firstName",
  "lastName",
  "city",
  "country",
  "year",
  "status",
  "paidAmount",
  "currency",
  "paymentStatus",
  "isPublic",
  "showAmountPublicly",
  "privateNotes"
];

function splitCsvLine(line: string) {
  const cells: string[] = [];
  let current = "";
  let quoted = false;

  for (let index = 0; index < line.length; index += 1) {
    const char = line[index];
    const next = line[index + 1];

    if (char === '"' && quoted && next === '"') {
      current += '"';
      index += 1;
    } else if (char === '"') {
      quoted = !quoted;
    } else if (char === "," && !quoted) {
      cells.push(current.trim());
      current = "";
    } else {
      current += char;
    }
  }

  cells.push(current.trim());
  return cells;
}

function truthy(value: string) {
  return ["true", "1", "yes", "y", "po", "ja"].includes(value.trim().toLowerCase());
}

function parseAmount(value: string) {
  const normalized = value.trim().replace(",", ".");
  if (!normalized) return "";
  const number = Number(normalized);
  return Number.isFinite(number) ? normalized : "INVALID";
}

function parseCsv(text: string, forcePrivate: boolean): Preview {
  const lines = text.split(/\r?\n/).filter((line) => line.trim());
  const errors: string[] = [];
  const rows: ParsedMember[] = [];

  if (lines.length < 2) return { rows, errors: ["CSV duhet të ketë header dhe të paktën një rresht."] };

  const columns = splitCsvLine(lines[0]);
  const missing = headers.filter((header) => !columns.includes(header));
  if (missing.length) errors.push(`Mungojnë kolonat: ${missing.join(", ")}`);

  lines.slice(1).forEach((line, index) => {
    const values = splitCsvLine(line);
    const row = Object.fromEntries(columns.map((column, columnIndex) => [column, values[columnIndex] || ""]));
    const rowNumber = index + 2;
    const firstName = String(row.firstName || "").trim();
    const lastName = String(row.lastName || "").trim();
    const yearText = String(row.year || "").trim();
    const paidAmount = parseAmount(String(row.paidAmount || ""));
    const year = Number(yearText);
    const status = String(row.status || "APPROVED").trim().toUpperCase();
    const currency = String(row.currency || "CHF").trim().toUpperCase() || "CHF";
    const amountNumber = paidAmount && paidAmount !== "INVALID" ? Number(paidAmount) : 0;
    const paymentStatus = String(row.paymentStatus || (amountNumber > 0 ? "PAID" : "UNPAID")).trim().toUpperCase();

    if (!firstName) errors.push(`Rreshti ${rowNumber}: firstName është i detyrueshëm.`);
    if (!lastName) errors.push(`Rreshti ${rowNumber}: lastName është i detyrueshëm.`);
    if (!Number.isInteger(year) || year < 2010 || year > 2035) errors.push(`Rreshti ${rowNumber}: year duhet të jetë vit i vlefshëm.`);
    if (paidAmount === "INVALID") errors.push(`Rreshti ${rowNumber}: paidAmount nuk është numër i vlefshëm.`);
    if (!["PENDING", "APPROVED", "ARCHIVED"].includes(status)) errors.push(`Rreshti ${rowNumber}: status nuk është i vlefshëm.`);
    if (!["UNPAID", "PARTIAL", "PAID", "WAIVED"].includes(paymentStatus)) errors.push(`Rreshti ${rowNumber}: paymentStatus nuk është i vlefshëm.`);

    rows.push({
      firstName,
      lastName,
      city: String(row.city || "").trim(),
      country: String(row.country || "").trim(),
      year: Number.isInteger(year) ? year : null,
      status,
      paidAmount: paidAmount === "INVALID" ? "" : paidAmount,
      currency,
      paymentStatus,
      isPublic: forcePrivate ? false : truthy(String(row.isPublic || "")),
      showAmountPublicly: truthy(String(row.showAmountPublicly || "")),
      privateNotes: String(row.privateNotes || "").trim()
    });
  });

  return { rows, errors };
}

export function MemberCsvImport() {
  const [csvText, setCsvText] = useState("");
  const [forcePrivate, setForcePrivate] = useState(true);
  const [message, setMessage] = useState("");
  const preview = useMemo(() => parseCsv(csvText, forcePrivate), [csvText, forcePrivate]);
  const validRows = preview.errors.length ? [] : preview.rows;

  async function importRows() {
    setMessage("Importing...");
    const response = await fetch("/api/admin/members/import", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ rows: validRows })
    });

    if (!response.ok) {
      setMessage(await response.text());
      return;
    }

    const result = (await response.json()) as { imported: number };
    setMessage(`${result.imported} anëtarë u importuan.`);
    window.setTimeout(() => window.location.reload(), 1200);
  }

  return (
    <div className="mt-6 rounded-lg border border-ink/10 bg-white p-5 shadow-sm">
      <h3 className="text-xl font-black text-ink">Import CSV për anëtarë</h3>
      <p className="mt-2 text-sm font-semibold leading-6 text-ink/62">Ngarko ose ngjit CSV, kontrollo preview dhe pastaj ruaje importin.</p>

      <div className="mt-4 overflow-x-auto rounded-md border border-ink/10">
        <table className="min-w-full text-left text-xs">
          <thead className="bg-ink/[0.04] font-black text-ink/60">
            <tr>{headers.map((header) => <th key={header} className="px-3 py-2">{header}</th>)}</tr>
          </thead>
          <tbody>
            <tr className="font-semibold text-ink/70">
              {["Arben", "Imeri", "Zürich", "CH", "2025", "APPROVED", "100,00", "CHF", "PAID", "false", "false", "internal note"].map((cell) => (
                <td key={cell} className="px-3 py-2">{cell}</td>
              ))}
            </tr>
          </tbody>
        </table>
      </div>

      <label className="mt-4 block">
        <span className="admin-label">CSV file</span>
        <input
          className="admin-input mt-1"
          type="file"
          accept=".csv,text/csv"
          onChange={async (event) => {
            const file = event.target.files?.[0];
            if (file) setCsvText(await file.text());
          }}
        />
      </label>

      <label className="mt-4 flex items-center gap-2 font-bold">
        <input type="checkbox" checked={forcePrivate} onChange={(event) => setForcePrivate(event.target.checked)} />
        Do not import names publicly by default
      </label>

      <textarea
        className="admin-input mt-4"
        rows={6}
        value={csvText}
        onChange={(event) => setCsvText(event.target.value)}
        placeholder={headers.join(",")}
      />

      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        <div className="rounded-md bg-pine/10 px-4 py-3 font-bold text-pine">Valid rows: {validRows.length}</div>
        <div className="rounded-md bg-ember/10 px-4 py-3 font-bold text-ember">Rows with errors: {preview.errors.length}</div>
      </div>

      {preview.errors.length > 0 && (
        <ul className="mt-4 list-disc space-y-1 pl-5 text-sm font-semibold text-ember">
          {preview.errors.map((error) => <li key={error}>{error}</li>)}
        </ul>
      )}

      <button className="mt-4 rounded-md bg-pine px-5 py-3 font-black text-white disabled:cursor-not-allowed disabled:opacity-50" type="button" disabled={!validRows.length} onClick={importRows}>
        Importo anëtarët
      </button>
      {message && <p className="mt-3 text-sm font-bold text-ink/65">{message}</p>}
    </div>
  );
}
