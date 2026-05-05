import { SafeImage } from "@/components/SafeImage";

type LogoProps = {
  logoUrl?: string | null;
  compact?: boolean;
};

export function Logo({ logoUrl, compact = false }: LogoProps) {
  return (
    <div className="flex items-center gap-3">
      {logoUrl ? (
        <SafeImage src={logoUrl} alt="Shoqata Rainca" className="h-11 w-11 overflow-hidden rounded-full" fallbackClassName="bg-ember" imgClassName="object-contain" />
      ) : (
        <div className="grid h-11 w-11 place-items-center rounded-full bg-ember text-sm font-black text-white ring-4 ring-white">
          SR
        </div>
      )}
      {!compact && (
        <div className="leading-tight">
          <div className="font-black text-ink">Shoqata Rainca</div>
          <div className="text-xs font-semibold uppercase tracking-wide text-ink/55">Zürich - Raincë</div>
        </div>
      )}
    </div>
  );
}
