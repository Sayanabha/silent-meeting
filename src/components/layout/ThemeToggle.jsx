import { Sun, Moon } from "lucide-react";
import { useTheme } from "../../context/ThemeContext";

export default function ThemeToggle() {
  const { dark, toggle } = useTheme();
  return (
    <button
      onClick={toggle}
      className="relative h-8 w-14 rounded-full border border-[var(--border)] bg-[var(--bg-card)] transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-brand-500"
      aria-label="Toggle theme"
    >
      <span
        className={`absolute top-1 h-6 w-6 rounded-full bg-brand-500 shadow-sm transition-all duration-300 flex items-center justify-center
          ${dark ? "left-7" : "left-1"}`}
      >
        {dark
          ? <Moon size={12} className="text-white" />
          : <Sun  size={12} className="text-white" />
        }
      </span>
    </button>
  );
}