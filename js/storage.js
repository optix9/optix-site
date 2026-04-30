import { db } from "./firebase.js";
import {
  collection,
  addDoc,
  serverTimestamp,
  getDocs,
  query,
  orderBy,
  limit,
} from "https://www.gstatic.com/firebasejs/12.12.0/firebase-firestore.js";

function getUserId() {
  let id = localStorage.getItem("userId");
  if (!id) {
    id = crypto.randomUUID();
    localStorage.setItem("userId", id);
    console.log("Generated new user ID:", id);
  }
  return id;
}

export async function saveQuizResult(result) {
  try {
    const userId = getUserId();

    await addDoc(collection(db, "users", userId, "attempts"), {
      ...result,
      createdAt: serverTimestamp()
    });

    streakUpdate();
    console.log("Saved to Firebase:", result);
  } catch (error) {
    console.error("Failed to save quiz result to Firebase:", error);
  }
}

export async function getRecentResults() {
  try {
    const userId = getUserId();

    const q = query(
      collection(db, "users", userId, "attempts"),
      orderBy("createdAt", "desc"),
      limit(20)
    );

    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => doc.data());
  } catch (error) {
    console.error("Failed to load recent results:", error);
    return [];
  }
}

export function streakUpdate(){
  const today = new Date().toDateString();
  const lastPlayed = localStorage.getItem("lastTimePlayed");
  let streak = parseInt(localStorage.getItem("streak") || "0");

  if (!lastPlayed){
    streak = 1;
  } else if (lastPlayed === today){
    return streak;
  } else {
    const yesterday = new Date(Date.now() - 86400000).toDateString();
    if (lastPlayed === yesterday){
      streak += 1;
    } else {
      streak = 1;
    }
  }

  localStorage.setItem("streak", streak);
  localStorage.setItem("lastTimePlayed", today);
  return streak;
}


