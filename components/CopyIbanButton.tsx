"use client";

import { useState } from "react";

type CopyIbanButtonProps = {
  iban: string;
  label: string;
  copiedLabel: string;
};

export function CopyIbanButton({ iban, label, copiedLabel }: CopyIbanButtonProps) {
  const [copied, setCopied] = useState(false);

  async function copyIban() {
    await navigator.clipboard.writeText(iban);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 2500);
  }

  return (
    <div className="flex flex-wrap items-center gap-3">
      <button className="rounded-md bg-pine px-4 py-2 text-sm font-black text-white" type="button" onClick={copyIban}>
        {label}
      </button>
      {copied && <span className="text-sm font-bold text-pine">{copiedLabel}</span>}
    </div>
  );
}
