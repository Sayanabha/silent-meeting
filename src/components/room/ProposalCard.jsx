import { useState } from "react";
import { User } from "lucide-react";
import DotVote from "./DotVote";
import ObjectionPanel from "./ObjectionPanel";
import clsx from "clsx";

export default function ProposalCard({ proposal, roomId, index }) {
  const voteCount = Object.keys(proposal.votes || {}).length;

  return (
    <div
      className="bg-[var(--bg-card)] border border-[var(--border)] rounded-2xl p-5 animate-slide-up hover:border-[var(--text-muted)] transition-all duration-200"
      style={{ animationDelay: `${index * 60}ms` }}
    >
      {/* Header */}
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-mono text-[var(--text-muted)] bg-[var(--bg-primary)] border border-[var(--border)] px-2 py-0.5 rounded-md">
              #{String(index + 1).padStart(2, "0")}
            </span>
            {voteCount >= 3 && (
              <span className="text-xs font-medium text-emerald-500 bg-emerald-500/10 px-2 py-0.5 rounded-full">
                🔥 Popular
              </span>
            )}
          </div>
          <h3 className="font-display font-semibold text-[var(--text-primary)] text-lg leading-snug">
            {proposal.title}
          </h3>
        </div>
        <DotVote
          roomId={roomId}
          proposalId={proposal.id}
          votes={proposal.votes || {}}
        />
      </div>

      {/* Description */}
      {proposal.description && (
        <p className="text-sm text-[var(--text-muted)] mb-4 leading-relaxed">
          {proposal.description}
        </p>
      )}

      {/* Footer */}
      <div className="flex items-center justify-between pt-3 border-t border-[var(--border)]">
        <div className="flex items-center gap-2">
          {proposal.authorPhoto ? (
            <img
              src={proposal.authorPhoto}
              alt={proposal.authorName}
              className="h-5 w-5 rounded-full"
            />
          ) : (
            <div className="h-5 w-5 rounded-full bg-[var(--border)] flex items-center justify-center">
              <User size={10} className="text-[var(--text-muted)]" />
            </div>
          )}
          <span className="text-xs text-[var(--text-muted)]">{proposal.authorName}</span>
        </div>

        <ObjectionPanel
          roomId={roomId}
          proposalId={proposal.id}
          objections={proposal.objections || {}}
        />
      </div>
    </div>
  );
}