import {
  ref, push, set, update, remove, get,
  onValue, off, serverTimestamp,
} from "firebase/database";
import { db } from "./config";

// ── Rooms ──────────────────────────────────────────────
export const createRoom = async (roomData, uid) => {
  const roomsRef = ref(db, "rooms");
  const newRoom  = push(roomsRef);
  await set(newRoom, {
    ...roomData,
    createdBy: uid,
    createdAt: Date.now(),
    status:    "open",
    synthesis: null,
  });
  return newRoom.key;
};

export const listenToRoom = (roomId, callback) => {
  const r = ref(db, `rooms/${roomId}`);
  onValue(r, (snap) => {
    if (snap.exists()) {
      callback({ id: roomId, ...snap.val() });
    } else {
      callback(null);
    }
  });
  return () => off(r);
};

export const listenToRooms = (callback) => {
  const r = ref(db, "rooms");
  onValue(r, (snap) => {
    if (!snap.exists()) {
      callback([]);
      return;
    }
    const rooms = [];
    snap.forEach((child) => {
      rooms.push({ id: child.key, ...child.val() });
    });
    // Sort newest first
    rooms.sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0));
    callback(rooms);
  });
  return () => off(r);
};

// ── Proposals ─────────────────────────────────────────
export const addProposal = async (roomId, proposal) => {
  const r    = ref(db, `rooms/${roomId}/proposals`);
  const newP = push(r);
  await set(newP, {
    ...proposal,
    createdAt: Date.now(),
    votes:     {},
    objections:{},
  });
  return newP.key;
};

export const toggleVote = async (roomId, proposalId, uid, userName) => {
  const voteRef = ref(db, `rooms/${roomId}/proposals/${proposalId}/votes/${uid}`);
  const snap    = await get(voteRef);
  if (snap.exists()) {
    await remove(voteRef);
  } else {
    await set(voteRef, { uid, userName, votedAt: Date.now() });
  }
};

export const addObjection = async (roomId, proposalId, objection) => {
  const r    = ref(db, `rooms/${roomId}/proposals/${proposalId}/objections`);
  const newO = push(r);
  await set(newO, { ...objection, createdAt: Date.now() });
};

export const saveSynthesis = async (roomId, synthesis) => {
  await update(ref(db, `rooms/${roomId}`), {
    synthesis,
    synthesisAt: Date.now(),
    status:      "synthesised",
  });
};

export const closeRoom = async (roomId) => {
  await update(ref(db, `rooms/${roomId}`), { status: "closed" });
};
export const deleteRoom = async (roomId) => {
  await remove(ref(db, `rooms/${roomId}`));
};