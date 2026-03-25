import clsx from "clsx";
import Spinner from "./Spinner";

export default function Button({
  children, onClick, variant = "primary",
  size = "md", disabled, loading, className, type = "button",
}) {
  const base = "inline-flex items-center justify-center gap-2 font-medium rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed active:scale-95";

  const variants = {
    primary:  "bg-brand-600 hover:bg-brand-700 text-white shadow-sm shadow-brand-600/20",
    secondary:"bg-[var(--bg-card)] hover:bg-[var(--border)] text-[var(--text-primary)] border border-[var(--border)]",
    ghost:    "hover:bg-[var(--border)] text-[var(--text-primary)]",
    danger:   "bg-red-500 hover:bg-red-600 text-white",
  };

  const sizes = {
    sm: "px-3 py-1.5 text-sm",
    md: "px-4 py-2 text-sm",
    lg: "px-6 py-3 text-base",
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      className={clsx(base, variants[variant], sizes[size], className)}
    >
      {loading && <Spinner size="sm" />}
      {children}
    </button>
  );
}