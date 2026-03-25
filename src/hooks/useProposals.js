import { useMemo } from "react";

export default function useProposals(room) {
  const proposals = useMemo(() => {
    if (!room?.proposals) return [];
    if (typeof room.proposals !== "object") return [];
    return Object.entries(room.proposals)
      .map(([id, data]) => ({ id, ...data }))
      .sort((a, b) => (a.createdAt || 0) - (b.createdAt || 0));
  }, [room?.proposals]);

  return proposals;
}