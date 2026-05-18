import { auth, db } from "./firebase.js";
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/12.12.0/firebase-auth.js";
import {
  collection,
  addDoc,
  serverTimestamp,
  getDocs,
  doc,
  getDoc,
  query,
  orderBy,
  limit,
  setDoc,
} from "https://www.gstatic.com/firebasejs/12.12.0/firebase-firestore.js";

export function getCurrentUser() {
  return new Promise((resolve) => {
    if (auth.currentUser) {
      resolve(auth.currentUser);
      return;
    }

    const unsubscribe = onAuthStateChanged(auth, user => {
      unsubscribe();
      resolve(user);
    });
  });
}

async function getUserId() {
  const user = await getCurrentUser();

  if (!user) {
    throw new Error("No signed-in user found.");
  }

  return user.uid;
}

function getUserStorageKey(key) {
  const userId = auth.currentUser ? auth.currentUser.uid : "signed-out";
  return `${userId}:${key}`;
}

export async function getUserProgress() {
  try {
    const userId = await getUserId();
    const userDoc = await getDoc(doc(db, "users", userId));
    const data = userDoc.exists() ? userDoc.data() : {};

    return data.progress || {
      completedTopics: [],
      unlockedTopics: ["addition-basics"]
    };
  } catch (error) {
    console.error("Failed to load user progress:", error);
    return {
      completedTopics: [],
      unlockedTopics: ["addition-basics"]
    };
  }
}

export async function saveUserProgress(progress) {
  const userId = await getUserId();

  await setDoc(
    doc(db, "users", userId),
    { progress },
    { merge: true }
  );
}

export async function saveQuizResult(result) {
  try {
    const userId = await getUserId();

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
    const userId = await getUserId();

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
  const lastPlayedKey = getUserStorageKey("lastTimePlayed");
  const streakKey = getUserStorageKey("streak");
  const lastPlayed = localStorage.getItem(lastPlayedKey);
  let streak = parseInt(localStorage.getItem(streakKey) || "0");

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

  localStorage.setItem(streakKey, streak);
  localStorage.setItem(lastPlayedKey, today);
  return streak;
}


