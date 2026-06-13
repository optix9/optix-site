import { streakUpdate } from "../shared/storage.js";

const streak = document.getElementById("streaktextd");
const streakVal = streakUpdate();

streak.textContent = `${streakVal} ${streakVal === 1 ? "day" : "days"}`;