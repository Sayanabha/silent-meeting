import { useState, useEffect } from "react";
import { Plus, Waves, Search } from "lucide-react";
import Navbar from "../layout/Navbar";
import RoomCard from "./RoomCard";
import Button from "../ui/Button";
import Modal from "../ui/Modal";
import { useAuth } from "../../context/AuthContext";
import { createRoom, listenToRooms } from "../../firebase/db";

export default function Dashboard() {
  const { user }           = useAuth();
  const [rooms,  setRooms] = useState([]);
  const [search, setSearch]= useState("");
  const [modal,  setModal] = useState(false);
  const [loading,setLoading]=useState(false);
  const [form,   setForm]  = useState({ title: "", goal: "" });

  useEffect(() => {
  const unsub = listenToRooms((data) => {
    setRooms(data);
  });
  return () => unsub && unsub();
}, []);

  const filtered = rooms.filter(r =>
    r.title?.toLowerCase().includes(search.toLowerCase())
  ).sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0));

  const handleCreate = async () => {
    if (!form.title.trim()) return;
    setLoading(true);
    try {
      await createRoom(form, user.uid);
      setModal(false);
      setForm({ title: "", goal: "" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[var(--bg-primary)]">
      <Navbar />

      <main className="max-w-5xl mx-auto px-4 py-8">
        {/* Hero */}
        <div className="mb-8 animate-slide-up">
          <h1 className="font-display text-4xl font-semibold text-[var(--text-primary)] mb-1">
            Good morning,{" "}
            <span className="text-brand-500 italic">
              {user?.displayName?.split(" ")[0]}
            </span>
          </h1>
          <p className="text-[var(--text-muted)] text-sm">
            Your async meeting rooms — no screen sharing required.
          </p>
        </div>

        {/* Toolbar */}
        <div className="flex items-center gap-3 mb-6">
          <div className="relative flex-1 max-w-xs">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)]" />
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search rooms…"
              className="w-full pl-9 pr-4 py-2 text-sm bg-[var(--bg-card)] border border-[var(--border)] rounded-xl text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:outline-none focus:ring-2 focus:ring-brand-500 transition-all"
            />
          </div>
          <Button onClick={() => setModal(true)}>
            <Plus size={15} /> New Room
          </Button>
        </div>

        {/* Rooms grid */}
        {filtered.length === 0 ? (
          <div className="text-center py-20 animate-fade-in">
            <div className="h-14 w-14 rounded-2xl bg-[var(--bg-card)] border border-[var(--border)] flex items-center justify-center mx-auto mb-4">
              <Waves size={22} className="text-[var(--text-muted)]" />
            </div>
            <p className="font-display text-lg text-[var(--text-primary)] mb-1">No rooms yet</p>
            <p className="text-sm text-[var(--text-muted)] mb-5">Create your first silent meeting room</p>
            <Button onClick={() => setModal(true)}>
              <Plus size={15} /> Create Room
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filtered.map(room => <RoomCard key={room.id} room={room} />)}
          </div>
        )}
      </main>

      {/* Create Room Modal */}
      <Modal open={modal} onClose={() => setModal(false)} title="New Meeting Room">
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-[var(--text-muted)] mb-1.5">
              Meeting Topic *
            </label>
            <input
              autoFocus
              value={form.title}
              onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
              placeholder="e.g. Q3 Product Roadmap Review"
              className="w-full px-4 py-2.5 text-sm bg-[var(--bg-primary)] border border-[var(--border)] rounded-xl text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:outline-none focus:ring-2 focus:ring-brand-500"
              onKeyDown={e => e.key === "Enter" && handleCreate()}
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-[var(--text-muted)] mb-1.5">
              Meeting Goal <span className="text-[var(--text-muted)]">(optional)</span>
            </label>
            <textarea
              value={form.goal}
              onChange={e => setForm(f => ({ ...f, goal: e.target.value }))}
              placeholder="What should this meeting achieve?"
              rows={3}
              className="w-full px-4 py-2.5 text-sm bg-[var(--bg-primary)] border border-[var(--border)] rounded-xl text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:outline-none focus:ring-2 focus:ring-brand-500 resize-none"
            />
          </div>
          <div className="flex justify-end gap-2 pt-1">
            <Button variant="secondary" onClick={() => setModal(false)}>Cancel</Button>
            <Button onClick={handleCreate} loading={loading} disabled={!form.title.trim()}>
              Create Room
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}