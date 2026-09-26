"use client";

import { useRef, useState } from "react";

type Props = {
  name: string;
  label: string;
  accept?: string;
  defaultValue?: string;
  className?: string;
  placeholder?: string;
};

export default function DirectUploadField({
  name,
  label,
  accept = "image/*,application/pdf",
  defaultValue = "",
  className = "",
  placeholder = "ose vendos URL"
}: Props) {
  const [value, setValue] = useState(defaultValue);
  const [state, setState] = useState<"idle" | "uploading" | "done" | "error">("idle");
  const [message, setMessage] = useState("");
  const fileRef = useRef<HTMLInputElement>(null);

  async function upload(file: File) {
    setState("uploading");
    setMessage("Duke ngarkuar…");

    try {
      const data = new FormData();
      data.append("file", file);

      const response = await fetch("/api/v2-upload", {
        method: "POST",
        body: data
      });
      const result = await response.json();

      if (!response.ok || !result.url) {
        if (result.error === "size") throw new Error("Skedari është mbi 4 MB.");
        if (result.error === "type") throw new Error("Ky format nuk pranohet.");
        throw new Error("Ngarkimi dështoi.");
      }

      setValue(result.url);
      setState("done");
      setMessage(`U ngarkua: ${result.filename}`);
    } catch (error) {
      setState("error");
      setMessage(error instanceof Error ? error.message : "Ngarkimi dështoi.");
    }
  }

  return (
    <label className={`direct-upload-field ${className}`.trim()}>
      <span>{label}</span>
      <div className="direct-upload-row">
        <input
          ref={fileRef}
          className="direct-upload-file"
          type="file"
          accept={accept}
          onChange={(event) => {
            const file = event.target.files?.[0];
            if (file) void upload(file);
          }}
        />
        <button
          type="button"
          className="direct-upload-button"
          disabled={state === "uploading"}
          onClick={() => fileRef.current?.click()}
        >
          {state === "uploading" ? "Po ngarkohet…" : "Ngarko skedar"}
        </button>
        <small className={state === "error" ? "upload-error" : ""}>
          {message || "Foto/PDF deri në 4 MB. Për skedarë më të mëdhenj mund të përdoret URL."}
        </small>
      </div>
      <input
        name={name}
        value={value}
        onChange={(event) => setValue(event.target.value)}
        placeholder={placeholder}
      />
      {value && (
        <a className="direct-upload-preview" href={value} target="_blank" rel="noreferrer">
          Hape skedarin →
        </a>
      )}
    </label>
  );
}
