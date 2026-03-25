import { useState } from "react";
import { Plus, X } from "lucide-react";
import { addProposal } from "../../firebase/db";
import { useAuth } from "../../context/AuthContext";
import Button from "../ui/Button";

export default function AddProposal({ roomId }) {
  const { user }              = useAuth();
  const [open,    setOpen]    = useState(false);
  const [loading, setLoading] = useState(false);
  const [form,    setForm]    = useState({ title: "", description: "" });

  const handleSubmit = async () => {
    if (!form.title.trim()) return;
    setLoading(true);
    try {
      await addProposal(roomId, {
        title:       form.title.trim(),
        description: form.description.trim(),
        authorId:    user.uid,
        authorName:  user.displayName,
        authorPhoto: user.photoURL,
      });
      setForm({ title: "", description: "" });
      setOpen(false);
    } finally {
      setLoading(false);
    }
  };

  if (!open) {
    return (
      <button
        onClick={() => setOpen(true)}
        className="w-full flex items-center gap-3 px-5 py-4 bg-[var(--bg-card)] border border-dashed border-[var(--border)] rounded-2xl text-[var(--text-muted)] hover:border-brand-400 hover:text-brand-500 transition-all duration-200 group"
      >
        <div className="h-7 w-7 rounded-lg bg-[var(--bg-primary)] border border-[var(--border)] flex items-center justify-center group-hover:bg-brand-500/10 group-hover:border-brand-400 transition-all">
          <Plus size={14} />
        </div>
        <span className="text-sm font-medium">Add a proposal</span>
      </button>
    );
  }

  return (
    <div className="bg-[var(--bg-card)] border border-brand-400 rounded-2xl p-5 animate-scale-in shadow-md shadow-brand-500/5">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-display font-semibold text-[var(--text-primary)]">New Proposal</h3>
        <button
          onClick={() => { setOpen(false); setForm({ title: "", description: "" }); }}
          className="p-1.5 rounded-lg hover:bg-[var(--border)] text-[var(--text-muted)] transition-colors"
        >
          <X size={15} />
        </button>
      </div>

      <div className="space-y-3">
        <input
          autoFocus
          value={form.title}
          onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
          placeholder="Proposal title *"
          className="w-full px-4 py-2.5 text-sm bg-[var(--bg-primary)] border border-[var(--border)] rounded-xl text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:outline-none focus:ring-2 focus:ring-brand-500"
        />
        <textarea
          value={form.description}
          onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
          placeholder="Describe your proposal in detail… (optional)"
          rows={3}
          className="w-full px-4 py-2.5 text-sm bg-[var(--bg-primary)] border border-[var(--border)] rounded-xl text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:outline-none focus:ring-2 focus:ring-brand-500 resize-none"
        />
        <div className="flex justify-end gap-2">
          <Button variant="secondary" size="sm" onClick={() => setOpen(false)}>Cancel</Button>
          <Button size="sm" onClick={handleSubmit} loading={loading} disabled={!form.title.trim()}>
            Submit Proposal
          </Button>
        </div>
      </div>
    </div>
  );
}