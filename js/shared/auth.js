import { auth, db } from "./firebase.js";

import{
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  updateProfile,
  signOut,
  onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/12.12.0/firebase-auth.js";

import {
  doc,
  setDoc,
  serverTimestamp
} from "https://www.gstatic.com/firebasejs/12.12.0/firebase-firestore.js";

const googleProvider = new GoogleAuthProvider();

export async function signupWithEmail(name, email, password){
  const userCredential = await createUserWithEmailAndPassword(auth, email, password);

  await updateProfile(userCredential.user, {
    displayName: name
  });

  await setDoc(doc(db, "users", userCredential.user.uid), {
    name: name,
    email: email,
    createdAt: serverTimestamp()
  });

  return userCredential.user;
}

export async function loginWithEmail(email, password) {
  const userCredential = await signInWithEmailAndPassword(auth, email, password);
  return userCredential.user;
}

export async function loginWithGoogle(){
  const userCredential = await signInWithPopup(auth, googleProvider);
  const user = userCredential.user;

   await setDoc(
    doc(db, "users", user.uid),
    {
      name: user.displayName || "",
      email: user.email || "",
      photoURL: user.photoURL || "",
      lastLoginAt: serverTimestamp()
    },
    { merge: true }
  );

  return user;
}

export async function logoutUser() {
  await signOut(auth);
}

export function requireLogin() {
  onAuthStateChanged(auth, user => {
    if (!user) {
      window.location.href = window.location.pathname.includes("dashboard-files-html") ? "../login.html" : "./login.html";
    }
  });
}

export function redirectIfLoggedIn() {
  onAuthStateChanged(auth, user => {
    if (user) {
      window.location.href = "./dashboard-files-html/dashboard.html";
    }
  });
}

const authMessage = document.getElementById("auth-message");

function showAuthMessage(message) {
  if (authMessage) {
    authMessage.textContent = message;
  }
}

const loginBtn = document.querySelector(".login-btn");
const googleLoginBtn = document.querySelector(".google-login-btn");

if (loginBtn) {
  loginBtn.addEventListener("click", async () => {
    const email = document.getElementById("login-email").value.trim();
    const password = document.getElementById("login-password").value;

    try {
      await loginWithEmail(email, password);
      window.location.href = "dashboard-files-html/dashboard.html";
    } catch (error) {
      showAuthMessage(error.message);
    }
  });
}

if (googleLoginBtn) {
  googleLoginBtn.addEventListener("click", async () => {
    try {
      await loginWithGoogle();
      window.location.href = "dashboard-files-html/dashboard.html";
    } catch (error) {
      showAuthMessage(error.message);
    }
  });
}

const signupBtn = document.querySelector(".signup-btn");
const googleSignupBtn = document.querySelector(".google-signup-btn");

if (signupBtn){
  signupBtn.addEventListener("click", async () => {
  const name = document.getElementById("signup-name").value.trim();
  const email = document.getElementById("signup-email").value.trim();
  const password = document.getElementById("signup-password").value;

  try {
    await signupWithEmail(name, email, password);
    window.location.href = "dashboard-files-html/dashboard.html";
    } catch (error) {
      showAuthMessage(error.message);
    }
  });
}

if (googleSignupBtn){
  googleSignupBtn.addEventListener("click", async () =>{
    try {
      await loginWithGoogle();
      window.location.href = "dashboard-files-html/dashboard.html";
    } catch (error) {
      showAuthMessage(error.message);
    }
  });
}

if (loginBtn || signupBtn || googleLoginBtn || googleSignupBtn) {
  redirectIfLoggedIn();
}
