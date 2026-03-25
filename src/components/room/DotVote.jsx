import { useState } from "react";
import { toggleVote } from "../../firebase/db";
import { useAuth } from "../../context/AuthContext";
import clsx from "clsx";

export default function DotVote({ roomId, proposalId, votes = {} }) {
  const { user }       = useAuth();
  const [busy, setBusy] = useState(false);
  const count           = Object.keys(votes).length;
  const hasVoted        = !!votes[user?.uid];

  const handleVote = async () => {
    if (busy) return;
    setBusy(true);
    try {
      await toggleVote(roomId, proposalId, user.uid, user.displayName);
    } finally {
      setBusy(false);
    }
  };

  return (
    <button
      onClick={handleVote}
      disabled={busy}
      className={clsx(
        "flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-200 active:scale-95 border",
        hasVoted
          ? "bg-brand-500/10 border-brand-500/30 text-brand-500"
          : "bg-[var(--bg-primary)] border-[var(--border)] text-[var(--text-muted)] hover:border-brand-400 hover:text-brand-500"
      )}
    >
      <span className="text-base leading-none">{hasVoted ? "●" : "○"}</span>
      <span>{count}</span>
    </button>
  );
}