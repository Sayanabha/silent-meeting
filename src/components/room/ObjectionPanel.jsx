import { useState } from "react";
import { AlertTriangle, ChevronDown, ChevronUp, Plus, X } from "lucide-react";
import { addObjection } from "../../firebase/db";
import { useAuth } from "../../context/AuthContext";
import clsx from "clsx";

export default function ObjectionPanel({ roomId, proposalId, objections = {} }) {
  const { user }             = useAuth();
  const [open,    setOpen]   = useState(false);
  const [adding,  setAdding] = useState(false);
  const [text,    setText]   = useState("");
  const [loading, setLoading]= useState(false);

  const list  = Object.entries(objections).map(([id, o]) => ({ id, ...o }));
  const count = list.length;

  const handleSubmit = async () => {
    if (!text.trim()) return;
    setLoading(true);
    try {
      await addObjection(roomId, proposalId, {
        text:     text.trim(),
        uid:      user.uid,
        userName: user.displayName,
      });
      setText("");
      setAdding(false);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mt-3">
      <button
        onClick={() => setOpen(o => !o)}
        className={clsx(
          "flex items-center gap-1.5 text-xs font-medium transition-colors",
          count > 0 ? "text-amber-500" : "text-[var(--text-muted)] hover:text-[var(--text-primary)]"
        )}
      >
        <AlertTriangle size={12} />
        {count} objection{count !== 1 ? "s" : ""}
        {open ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
      </button>

      {open && (
        <div className="mt-2 space-y-2 animate-slide-up">
          {list.map(o => (
            <div key={o.id} className="flex gap-2 bg-amber-500/5 border border-amber-500/20 rounded-xl px-3 py-2">
              <AlertTriangle size={13} className="text-amber-500 shrink-0 mt-0.5" />
              <div>
                <p className="text-xs text-[var(--text-primary)]">{o.text}</p>
                <p className="text-xs text-[var(--text-muted)] mt-0.5">— {o.userName}</p>
              </div>
            </div>
          ))}

          {adding ? (
            <div className="flex gap-2">
              <input
                autoFocus
                value={text}
                onChange={e => setText(e.target.value)}
                placeholder="Describe your objection…"
                className="flex-1 px-3 py-1.5 text-xs bg-[var(--bg-primary)] border border-[var(--border)] rounded-lg text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:outline-none focus:ring-2 focus:ring-amber-400"
                onKeyDown={e => e.key === "Enter" && handleSubmit()}
              />
              <button
                onClick={handleSubmit}
                disabled={loading || !text.trim()}
                className="px-3 py-1.5 text-xs bg-amber-500 hover:bg-amber-600 text-white rounded-lg disabled:opacity-50 transition-colors"
              >
                Add
              </button>
              <button
                onClick={() => { setAdding(false); setText(""); }}
                className="p-1.5 rounded-lg hover:bg-[var(--border)] text-[var(--text-muted)]"
              >
                <X size={13} />
              </button>
            </div>
          ) : (
            <button
              onClick={() => setAdding(true)}
              className="flex items-center gap-1 text-xs text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors"
            >
              <Plus size={12} /> Raise objection
            </button>
          )}
        </div>
      )}
    </div>
  );
}