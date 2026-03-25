import { LogOut, Waves } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { logOut } from "../../firebase/auth";
import ThemeToggle from "./ThemeToggle";
import { useNavigate } from "react-router-dom";

export default function Navbar() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logOut();
    navigate("/login");
  };

  return (
    <nav className="sticky top-0 z-40 border-b border-[var(--border)] bg-[var(--bg-primary)]/80 backdrop-blur-md">
      <div className="max-w-5xl mx-auto px-4 h-14 flex items-center justify-between">
        {/* Logo */}
        <button
          onClick={() => navigate("/")}
          className="flex items-center gap-2 group"
        >
          <div className="h-7 w-7 rounded-lg bg-brand-600 flex items-center justify-center shadow-sm">
            <Waves size={14} className="text-white" />
          </div>
          <span className="font-display font-semibold text-[var(--text-primary)] text-lg leading-none">
            Silent<span className="text-brand-500">Meet</span>
          </span>
        </button>

        {/* Right */}
        <div className="flex items-center gap-3">
          <ThemeToggle />
          {user && (
            <div className="flex items-center gap-2">
              <img
                src={user.photoURL}
                alt={user.displayName}
                className="h-7 w-7 rounded-full border border-[var(--border)]"
              />
              <span className="text-sm text-[var(--text-primary)] hidden sm:block font-medium">
                {user.displayName?.split(" ")[0]}
              </span>
              <button
                onClick={handleLogout}
                className="p-1.5 rounded-lg hover:bg-[var(--border)] text-[var(--text-muted)] transition-colors"
                title="Sign out"
              >
                <LogOut size={15} />
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}