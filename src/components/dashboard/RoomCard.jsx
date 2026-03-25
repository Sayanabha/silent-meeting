import { useNavigate } from "react-router-dom";
import { MessageSquare, Clock, Trash2 } from "lucide-react";
import { deleteRoom } from "../../firebase/db";
import { useAuth } from "../../context/AuthContext";
import clsx from "clsx";
import { useState } from "react";

const statusConfig = {
  open:        { label: "Open",        color: "text-emerald-500 bg-emerald-500/10" },
  synthesised: { label: "Synthesised", color: "text-brand-500 bg-brand-500/10"    },
  closed:      { label: "Closed",      color: "text-[var(--text-muted)] bg-[var(--border)]" },
};

export default function RoomCard({ room }) {
  const navigate        = useNavigate();
  const { user }        = useAuth();
  const [busy, setBusy] = useState(false);
  const proposals       = Object.keys(room.proposals || {}).length;
  const status          = statusConfig[room.status] || statusConfig.open;
  const isCreator       = room.createdBy === user?.uid;

  const handleDelete = async (e) => {
    e.stopPropagation();
    if (!confirm(`Delete "${room.title}"? This cannot be undone.`)) return;
    setBusy(true);
    try {
      await deleteRoom(room.id);
    } catch {
      setBusy(false);
    }
  };

  return (
    <div
      onClick={() => navigate(`/room/${room.id}`)}
      className="relative w-full text-left bg-[var(--bg-card)] border border-[var(--border)] rounded-2xl p-5 hover:border-brand-400 hover:shadow-md hover:shadow-brand-500/5 transition-all duration-200 group animate-fade-in cursor-pointer"
    >
      {/* Title row */}
      <h3 className="font-display font-semibold text-[var(--text-primary)] text-lg leading-snug group-hover:text-brand-500 transition-colors line-clamp-2 mb-2">
        {room.title}
      </h3>

      {/* Goal */}
      {room.goal && (
        <p className="text-sm text-[var(--text-muted)] mb-4 line-clamp-2">{room.goal}</p>
      )}

      {/* Footer row — status + meta + delete */}
      <div className="flex items-center justify-between gap-2 mt-3">

        {/* Left: status + counts */}
        <div className="flex items-center gap-2 flex-wrap">
          <span className={clsx("text-xs font-medium px-2.5 py-1 rounded-full", status.color)}>
            {status.label}
          </span>
          <span className="flex items-center gap-1 text-xs text-[var(--text-muted)]">
            <MessageSquare size={11} />
            {proposals} proposal{proposals !== 1 ? "s" : ""}
          </span>
          <span className="flex items-center gap-1 text-xs text-[var(--text-muted)]">
            <Clock size={11} />
            {room.createdAt
              ? new Date(room.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric" })
              : "Just now"}
          </span>
        </div>

        {/* Right: delete (creator only, shows on hover) */}
        {isCreator && (
          <button
            onClick={handleDelete}
            disabled={busy}
            className="p-1.5 rounded-lg opacity-0 group-hover:opacity-100 hover:bg-red-500/10 text-[var(--text-muted)] hover:text-red-500 transition-all duration-200 disabled:opacity-50 shrink-0"
            title="Delete room"
          >
            <Trash2 size={14} />
          </button>
        )}
      </div>
    </div>
  );
}