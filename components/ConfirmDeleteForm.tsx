"use client";

type ConfirmDeleteFormProps = {
  id: string;
  model: string;
  message: string;
  label: string;
};

export function ConfirmDeleteForm({ id, model, message, label }: ConfirmDeleteFormProps) {
  return (
    <form
      action="/api/admin/delete"
      method="post"
      onSubmit={(event) => {
        if (!window.confirm(message)) event.preventDefault();
      }}
    >
      <input type="hidden" name="id" value={id} />
      <input type="hidden" name="model" value={model} />
      <button className="rounded-md border border-ember/25 px-3 py-2 text-sm font-black text-ember" type="submit">
        {label}
      </button>
    </form>
  );
}
