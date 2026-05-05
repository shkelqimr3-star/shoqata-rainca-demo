"use client";

import { useRef, useState } from "react";

type ImageUploadFieldProps = {
  label: string;
  name: string;
  defaultValue?: string;
  placeholder?: string;
  required?: boolean;
};

export function ImageUploadField({ label, name, defaultValue, placeholder, required = false }: ImageUploadFieldProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [value, setValue] = useState(defaultValue || "");
  const [status, setStatus] = useState("");

  async function upload(file: File) {
    setStatus("Uploading...");
    const formData = new FormData();
    formData.append("file", file);

    const response = await fetch("/api/admin/upload", {
      method: "POST",
      body: formData
    });

    if (!response.ok) {
      const message = await response.text();
      setStatus(message || "Upload failed");
      return;
    }

    const result = (await response.json()) as { url: string };
    setValue(result.url);
    setStatus("Uploaded");
    if (inputRef.current) inputRef.current.value = result.url;
  }

  return (
    <label>
      <span className="admin-label">{label}</span>
      <div className="mt-1 grid gap-2 sm:grid-cols-[1fr_auto]">
        <input
          ref={inputRef}
          className="admin-input"
          name={name}
          value={value}
          onChange={(event) => setValue(event.target.value)}
          placeholder={placeholder}
          required={required}
        />
        <input
          className="admin-input max-w-full sm:w-48"
          type="file"
          accept="image/jpeg,image/png,image/webp"
          onChange={(event) => {
            const file = event.target.files?.[0];
            if (file) void upload(file);
          }}
        />
      </div>
      {status && <span className="mt-1 block text-xs font-bold text-ink/55">{status}</span>}
    </label>
  );
}
