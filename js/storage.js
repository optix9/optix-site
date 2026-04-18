import { auth, db, authReady } from "./firebase.js";
import {
  collection,
  addDoc,
  serverTimestamp,
  getDocs,
  query,
  orderBy,
  limit,
} from "https://www.gstatic.com/firebasejs/12.12.0/firebase-firestore.js";

export async function saveQuizResult(result) {
  try {
    await authReady;

    const user = auth.currentUser;
    if (!user) {
      console.warn("Firebase auth has no currentUser; cannot save quiz result.");
      return;
    }

    await addDoc(collection(db, "users", user.uid, "attempts"), {
      ...result,
      createdAt: serverTimestamp()
    });

    console.log("Saved to Firebase:", result);
  } catch (error) {
    console.error("Failed to save quiz result to Firebase:", error);
  }
}

export async function getRecentResults() {
  await authReady;

  const user = auth.currentUser;
  if (!user) return [];

  const q = query(
    collection(db, "users", user.uid, "attempts"),
    orderBy("createdAt", "desc"),
    limit(5)
  );

  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => doc.data());
}