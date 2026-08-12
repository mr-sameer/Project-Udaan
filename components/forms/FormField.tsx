import { InputHTMLAttributes, LabelHTMLAttributes, TextareaHTMLAttributes } from "react";

export function Field({
  label,
  htmlFor,
  children,
}: {
  label: string;
  htmlFor: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <label
        htmlFor={htmlFor}
        className="text-xs font-bold uppercase tracking-wide text-ink-soft"
        {...({} as LabelHTMLAttributes<HTMLLabelElement>)}
      >
        {label}
      </label>
      {children}
    </div>
  );
}

export function TextInput(props: InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      {...props}
      className={
        "w-full rounded-xl border px-4 py-2.5 text-sm font-body text-ink border-sandstone bg-white focus:outline-none focus-visible:ring-2 focus-visible:ring-kesari " +
        (props.className ?? "")
      }
    />
  );
}

export function TextArea(props: TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <textarea
      {...props}
      className={
        "w-full rounded-xl border px-4 py-2.5 text-sm font-body text-ink border-sandstone bg-white focus:outline-none focus-visible:ring-2 focus-visible:ring-kesari " +
        (props.className ?? "")
      }
    />
  );
}

export function SubmitButton({
  children,
  pending,
}: {
  children: React.ReactNode;
  pending: boolean;
}) {
  return (
    <button
      type="submit"
      disabled={pending}
      className="w-full rounded-full bg-kesari px-6 py-3 text-sm font-bold text-parchment transition-transform hover:scale-[1.02] disabled:opacity-60 disabled:hover:scale-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-kesari"
    >
      {pending ? "Please wait…" : children}
    </button>
  );
}

export function FormMessage({ error, success }: { error?: string; success?: string }) {
  if (!error && !success) return null;
  return (
    <p
      role="status"
      className={
        "text-sm rounded-lg px-4 py-2.5 " +
        (error
          ? "bg-red-50 text-red-700 border border-red-200"
          : "bg-forest/10 text-forest border border-forest/30")
      }
    >
      {error ?? success}
    </p>
  );
}
