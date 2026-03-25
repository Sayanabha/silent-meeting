import { useState, useEffect } from "react";
import { listenToRoom } from "../firebase/db";

export default function useRoom(roomId) {
  const [room,    setRoom]    = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!roomId) return;
    const unsub = listenToRoom(roomId, (data) => {
      setRoom(data);
      setLoading(false);
    });
    return unsub;
  }, [roomId]);

  return { room, loading };
}