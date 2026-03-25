import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Copy, CheckCheck, Users, Lock } from "lucide-react";
import { useState } from "react";
import Navbar from "../layout/Navbar";
import ProposalCard from "./ProposalCard";
import AddProposal from "./AddProposal";
import AISynthesis from "./AISynthesis";
import Spinner from "../ui/Spinner";
import Button from "../ui/Button";
import useRoom from "../../hooks/useRoom";
import useProposals from "../../hooks/useProposals";
import { closeRoom } from "../../firebase/db";
import { useAuth } from "../../context/AuthContext";
import clsx from "clsx";

export default function MeetingRoom() {
  const { roomId }           = useParams();
  const navigate             = useNavigate();
  const { user }             = useAuth();
  const { room, loading }    = useRoom(roomId);
  const proposals            = useProposals(room);
  const [copied,  setCopied] = useState(false);
  const [closing, setClosing]= useState(false);

  const copyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleClose = async () => {
    if (!confirm("Close this room? No new proposals will be accepted.")) return;
    setClosing(true);
    await closeRoom(roomId);
    setClosing(false);
  };

  if (loading) return (
    <div className="min-h-screen bg-[var(--bg-primary)]">
      <Navbar />
      <div className="flex items-center justify-center h-[80vh]">
        <Spinner size="lg" />
      </div>
    </div>
  );

  if (!room) return (
    <div className="min-h-screen bg-[var(--bg-primary)]">
      <Navbar />
      <div className="flex flex-col items-center justify-center h-[80vh] gap-4">
        <p className="text-[var(--text-primary)] font-display text-xl">Room not found</p>
        <Button onClick={() => navigate("/")}>Back to Dashboard</Button>
      </div>
    </div>
  );

  const isClosed   = room.status === "closed";
  const isCreator  = room.createdBy === user?.uid;
  const voteTotal = Array.isArray(proposals)
  ? proposals.reduce((acc, p) => acc + Object.keys(p.votes || {}).length, 0)
  : 0;

  return (
    <div className="min-h-screen bg-[var(--bg-primary)]">
      <Navbar />

      <main className="max-w-3xl mx-auto px-4 py-8">

        {/* Back */}
        <button
          onClick={() => navigate("/")}
          className="flex items-center gap-1.5 text-sm text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors mb-6"
        >
          <ArrowLeft size={15} /> All rooms
        </button>

        {/* Room Header */}
        <div className="mb-6 animate-slide-up">
          <div className="flex items-start justify-between gap-4 mb-2">
            <h1 className="font-display text-3xl font-semibold text-[var(--text-primary)] leading-tight">
              {room.title}
            </h1>
            <span className={clsx(
              "shrink-0 mt-1 text-xs font-medium px-2.5 py-1 rounded-full",
              isClosed
                ? "text-[var(--text-muted)] bg-[var(--border)]"
                : room.status === "synthesised"
                  ? "text-brand-500 bg-brand-500/10"
                  : "text-emerald-500 bg-emerald-500/10"
            )}>
              {isClosed ? "Closed" : room.status === "synthesised" ? "Synthesised" : "Open"}
            </span>
          </div>

          {room.goal && (
            <p className="text-[var(--text-muted)] text-sm mb-4">{room.goal}</p>
          )}

          {/* Stats + actions */}
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-4 text-xs text-[var(--text-muted)] bg-[var(--bg-card)] border border-[var(--border)] rounded-xl px-4 py-2">
              <span className="flex items-center gap-1.5">
                <Users size={12} />
                {proposals.length} proposal{proposals.length !== 1 ? "s" : ""}
              </span>
              <span className="w-px h-3 bg-[var(--border)]" />
              <span>● {voteTotal} vote{voteTotal !== 1 ? "s" : ""}</span>
            </div>

            <button
              onClick={copyLink}
              className="flex items-center gap-1.5 text-xs text-[var(--text-muted)] hover:text-[var(--text-primary)] bg-[var(--bg-card)] border border-[var(--border)] rounded-xl px-3 py-2 transition-all"
            >
              {copied ? <CheckCheck size={12} className="text-emerald-500" /> : <Copy size={12} />}
              {copied ? "Copied!" : "Share link"}
            </button>

            {isCreator && !isClosed && (
              <Button
                size="sm"
                variant="secondary"
                onClick={handleClose}
                loading={closing}
              >
                <Lock size={13} /> Close Room
              </Button>
            )}
          </div>
        </div>

        {/* AI Synthesis */}
        <div className="mb-6 animate-fade-in">
          <AISynthesis room={room} roomId={roomId} />
        </div>

        {/* Proposals */}
        <div className="space-y-4">
          <h2 className="font-display text-lg font-semibold text-[var(--text-primary)]">
            Proposals
            <span className="ml-2 text-sm font-sans font-normal text-[var(--text-muted)]">
              ({proposals.length})
            </span>
          </h2>

          {proposals.length === 0 && (
            <div className="text-center py-10 border border-dashed border-[var(--border)] rounded-2xl animate-fade-in">
              <p className="text-[var(--text-muted)] text-sm">No proposals yet — be the first!</p>
            </div>
          )}

          {proposals.map((p, i) => (
            <ProposalCard
              key={p.id}
              proposal={p}
              roomId={roomId}
              index={i}
            />
          ))}

          {!isClosed && (
            <div className="pt-2 animate-fade-in">
              <AddProposal roomId={roomId} />
            </div>
          )}

          {isClosed && (
            <div className="text-center py-6 text-sm text-[var(--text-muted)] bg-[var(--bg-card)] border border-[var(--border)] rounded-2xl">
              🔒 This room is closed. No new proposals can be added.
            </div>
          )}
        </div>
      </main>
    </div>
  );
}