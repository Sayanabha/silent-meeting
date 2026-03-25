import { useState } from "react";
import { Sparkles, ChevronDown, ChevronUp, Zap, AlertTriangle, CheckSquare, Lightbulb } from "lucide-react";
import Button from "../ui/Button";
import { synthesiseMeeting } from "../../services/gemini";
import { saveSynthesis } from "../../firebase/db";
import clsx from "clsx";

export default function AISynthesis({ room, roomId }) {
  const [loading,   setLoading]   = useState(false);
  const [expanded,  setExpanded]  = useState(true);
  const [error,     setError]     = useState("");

  const synthesis = room?.synthesis;

  const handleSynthesise = async () => {
    const proposals = Object.keys(room?.proposals || {}).length;
    if (proposals === 0) {
      setError("Add at least one proposal before synthesising.");
      return;
    }
    setLoading(true);
    setError("");
    try {
      const result = await synthesiseMeeting(room);
      await saveSynthesis(roomId, result);
    } catch (e) {
      setError("AI synthesis failed. Check your Gemini API key and try again.");
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-gradient-to-br from-brand-600/10 to-brand-500/5 border border-brand-500/20 rounded-2xl overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-4">
        <div className="flex items-center gap-2">
          <div className="h-7 w-7 rounded-lg bg-brand-600 flex items-center justify-center shadow-sm shadow-brand-600/30">
            <Sparkles size={13} className="text-white" />
          </div>
          <div>
            <p className="text-sm font-semibold text-[var(--text-primary)]">AI Synthesis</p>
            <p className="text-xs text-[var(--text-muted)]">
              {synthesis ? "Consensus generated" : "Analyse proposals with Gemini"}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {synthesis && (
            <button
              onClick={() => setExpanded(e => !e)}
              className="p-1.5 rounded-lg hover:bg-[var(--border)] text-[var(--text-muted)] transition-colors"
            >
              {expanded ? <ChevronUp size={15} /> : <ChevronDown size={15} />}
            </button>
          )}
          <Button
            size="sm"
            onClick={handleSynthesise}
            loading={loading}
            disabled={loading}
          >
            <Sparkles size={13} />
            {synthesis ? "Re-synthesise" : "Synthesise"}
          </Button>
        </div>
      </div>

      {/* Error */}
      {error && (
        <div className="mx-5 mb-4 text-xs text-red-500 bg-red-500/10 border border-red-500/20 rounded-xl px-3 py-2">
          {error}
        </div>
      )}

      {/* Results */}
      {synthesis && expanded && (
        <div className="px-5 pb-5 space-y-4 animate-slide-up">
          <hr className="border-brand-500/20" />

          {/* Consensus */}
          <div>
            <p className="text-xs font-semibold text-brand-500 uppercase tracking-wider mb-2 flex items-center gap-1">
              <Zap size={11} /> Consensus
            </p>
            <p className="text-sm text-[var(--text-primary)] leading-relaxed bg-[var(--bg-card)] rounded-xl px-4 py-3 border border-[var(--border)]">
              {synthesis.consensus}
            </p>
          </div>

          {/* Key Insights */}
          {synthesis.keyInsights?.length > 0 && (
            <div>
              <p className="text-xs font-semibold text-brand-500 uppercase tracking-wider mb-2 flex items-center gap-1">
                <Lightbulb size={11} /> Key Insights
              </p>
              <ul className="space-y-1.5">
                {synthesis.keyInsights.map((insight, i) => (
                  <li key={i} className="flex gap-2 text-sm text-[var(--text-primary)]">
                    <span className="text-brand-500 mt-0.5 shrink-0">→</span>
                    {insight}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Action Items */}
          {synthesis.actionItems?.length > 0 && (
            <div>
              <p className="text-xs font-semibold text-emerald-500 uppercase tracking-wider mb-2 flex items-center gap-1">
                <CheckSquare size={11} /> Action Items
              </p>
              <ul className="space-y-2">
                {synthesis.actionItems.map((item, i) => (
                  <li key={i} className="flex gap-2 bg-emerald-500/5 border border-emerald-500/20 rounded-xl px-3 py-2">
                    <CheckSquare size={13} className="text-emerald-500 shrink-0 mt-0.5" />
                    <div>
                      <p className="text-sm text-[var(--text-primary)]">{item.action}</p>
                      <p className="text-xs text-[var(--text-muted)] mt-0.5">Owner: {item.owner}</p>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Risks */}
          {synthesis.risks?.length > 0 && (
            <div>
              <p className="text-xs font-semibold text-amber-500 uppercase tracking-wider mb-2 flex items-center gap-1">
                <AlertTriangle size={11} /> Risks & Concerns
              </p>
              <ul className="space-y-1.5">
                {synthesis.risks.map((risk, i) => (
                  <li key={i} className="flex gap-2 text-sm text-[var(--text-primary)]">
                    <span className="text-amber-500 mt-0.5 shrink-0">⚠</span>
                    {risk}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Recommendation */}
          {synthesis.recommendation && (
            <div className="bg-brand-600/10 border border-brand-500/20 rounded-xl px-4 py-3">
              <p className="text-xs font-semibold text-brand-500 mb-1">💡 Recommendation</p>
              <p className="text-sm text-[var(--text-primary)]">{synthesis.recommendation}</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}