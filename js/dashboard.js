import { auth, db } from "./firebase.js";
import { getRecentResults } from "./storage.js";

$(function () {
  let name = localStorage.getItem("username");

  if (name) {
    $("#welcome-text").text("Welcome, " + name);
  }
});

async function loadDashboard() {
  const results = await getRecentResults();

  console.log("Dashboard data:", results);

  if (results.length === 0) return;

  // total quizzes
  const totalQuizzes = results.length;

  // average score
  const avgScore = Math.round(
    results.reduce((sum, r) => sum + r.percentage, 0) / totalQuizzes
  );

  // update stats
  document.querySelector(".stats-main").innerHTML = `
    <h3>Stats</h3>
    <p>Quizzes Taken: ${totalQuizzes}</p>
    <p>Average Score: ${avgScore}%</p>
  `;

  // recent activity
  const recentDiv = document.querySelector(".recent-activity-main");
  recentDiv.innerHTML = "<h3>Recent Activity</h3>";

  results.forEach(r => {
    const p = document.createElement("p");
    p.textContent = `${r.percentage}% on ${r.date}`;
    recentDiv.appendChild(p);
  });
}

loadDashboard();