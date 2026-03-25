export default function Spinner({ size = "md" }) {
  const s = { sm: "h-4 w-4", md: "h-8 w-8", lg: "h-12 w-12" }[size];
  return (
    <div className={`${s} animate-spin rounded-full border-2 border-[var(--border)] border-t-brand-500`} />
  );
}