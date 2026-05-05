type LogoProps = {
  logoUrl?: string | null;
  compact?: boolean;
};

export function Logo({ compact = false }: LogoProps) {
  return (
    <div className="min-w-0 leading-none">
      <div className="text-[1.35rem] font-black tracking-wide text-ink sm:text-[1.55rem]">
        Shoqata Rainca
      </div>
      <div className="my-1 h-px w-full max-w-[12rem] bg-ember" />
      {!compact && (
        <div className="text-[0.7rem] font-bold uppercase tracking-[0.18em] text-ink/60">
          Zürich – Raincë
        </div>
      )}
    </div>
  );
}
