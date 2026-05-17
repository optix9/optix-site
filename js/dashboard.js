import { getRecentResults, streakUpdate } from "./storage.js";

function getTopicId(topicName) {
  return topicName.toLowerCase().trim().replaceAll(" ", "-");
}

function loadProgress() {
  const savedProgress = JSON.parse(localStorage.getItem("progress")) || {};
  const progress = {
    completedTopics: savedProgress.completedTopics || [],
    unlockedTopics: savedProgress.unlockedTopics || ["addition-basics"]
  };

  progress.completedTopics = progress.completedTopics.map(getTopicId);
  progress.unlockedTopics = progress.unlockedTopics.map(getTopicId);

  return progress;
}

let progress = loadProgress();

$(function () {
  let name = localStorage.getItem("username");

  if (name) {
    $("#welcome-text").text("Welcome, " + name);
  }
});

async function loadDashboard() {
  let results = [];
  try {
    results = await getRecentResults();
    console.log("Dashboard data:", results);
    console.log("Is array?", Array.isArray(results));
    
    if (!Array.isArray(results)) {
      console.error("getRecentResults() must return an array.");
      results = [];
    }
  } catch (err) {
    console.error("Error loading dashboard data:", err);
    results = [];
  }

  if (results.length === 0) {
    document.querySelector(".stats-main-4").innerHTML = `
      <h3>Stats</h3>
      <p>Quizzes Taken: 0</p>
      <p>Average Score: 0%</p>
    `;
    document.querySelector(".recent-activity-main-5").innerHTML = `
      <h3>Recent Activity</h3>
      <p>No recent quiz results yet.</p>
    `;
    document.getElementById("avgscore").textContent = "Average Score: 0%";
    document.getElementById("bestscore").textContent = "Best Score: 0%";
    document.getElementById("xp-level").textContent = "XP: ";
    document.getElementById("hardesttopic").textContent = "Hardest Topic: N/A";
    document.getElementById("quizestaken").textContent = "Quizzes Taken: 0";
    document.getElementById("currentstreak").textContent = "Current Streak: 0";
    document.getElementById("longeststreak").textContent = "Longest Streak: 0";
    return;
  }

  // total quizzes
  const totalQuizzes = results.length;

  function safeDate(r) {
    if (!r) return new Date();
    if (r.createdAt && typeof r.createdAt.toDate === 'function') return r.createdAt.toDate();
    if (r.createdAt && r.createdAt.seconds) return new Date(r.createdAt.seconds * 1000);
    if (r.createdAt && typeof r.createdAt === 'string') return new Date(r.createdAt);
    return new Date();
  }
  // average score
  const avgScore = Math.round(
    results.reduce((sum, r) => sum + r.percentage, 0) / totalQuizzes
  );

  // update stats
  document.querySelector(".stats-main-4").innerHTML = `
    <h3>Stats</h3>
    <p>Quizzes Taken: ${totalQuizzes}</p>
    <p>Average Score: ${avgScore}%</p>
  `;

  // recent activity
  const recentDiv = document.querySelector(".recent-activity-main-5");
  recentDiv.innerHTML = "<h3>Recent Activity</h3>";

  results.slice(0,12).forEach(r => {
    const p = document.createElement("p");
    const dateObj = safeDate(r);
    p.textContent = `${r.percentage}% on ${dateObj.toLocaleDateString("en-US", { month: "numeric", day: "numeric" })}`;
    recentDiv.appendChild(p);
    if (r.percentage > 85) {
      p.style.color = "#2cdaaf";
    }
    else if (r.percentage > 70) {
      p.style.color = "#6973ce";
    }
    else if (r.percentage > 50) {
      p.style.color = "#f9c245";
    }
    else {
      p.style.color = "#ff6b6b";
    }
  });

  document.getElementById("avgscore").textContent = `Average Score: ${avgScore}%`;
  document.getElementById("quizestaken").textContent = `Quizzes Taken: ${totalQuizzes}`;
  document.getElementById("bestscore").textContent = `Best Score: ${Math.max(...results.map(r => r.percentage))}%`;
  

 
  const streak = streakUpdate();
  document.getElementById("currentstreak").textContent = `Current Streak: ${streak}`;
  document.getElementById("longeststreak").textContent = `Longest Streak: ${streak}`;
  if (streak > 1) {
    document.getElementById("streakptag").textContent = `Streak: ${streak} days`;
  } else {
    document.getElementById("streakptag").textContent = `Streak: ${streak} day`;
  }

  // populate history table
  let shown = 5;
  const tableBody = document.querySelector("#history-table tbody");
  const showMoreBtn = document.getElementById("show-more");

  function populateTable() {
    tableBody.innerHTML = "";
    results.slice(0, shown).forEach(r => {
      const row = tableBody.insertRow();
      const date = safeDate(r).toLocaleDateString();
      row.innerHTML = `
        <td>${date}</td>
        <td>${r.topic || "Unknown"}</td>
        <td>${r.difficulty || "Unknown"}</td>
        <td>${r.percentage}%</td>
      `;
    });
    if (shown >= results.length) {
      showMoreBtn.style.display = "none";
    }
  }

  populateTable();

  showMoreBtn.addEventListener("click", () => {
    shown += 5;
    populateTable();
  });

    //   line graph js !!!! its so cool 

  const myChart = new Chart(document.getElementById("performance-chart"), {
    type: "line",
    data: {
      labels: results.map(r => safeDate(r).toLocaleDateString("en-US", { month: "numeric", day: "numeric" })),
      datasets: [{
        label: "Score",
        data: results.map(r => r.percentage),
        borderColor: "#41a5ff",
        backgroundColor: "#41a5ff38",
        pointBackgroundColor: "#c6e8ff",
        pointBorderColor: "#ffffff",
        tension: 0.13,
        fill: true
      }]
    },
    options: {
      plugins: {
        legend: {
          labels: {
            color: "#bfe8ff",
            font: {
              family: "Funnel Display",
              size: 12
            }
          }
        }
      },
      scales: {
        x: {
          ticks: {
            color: "#bfe8ff",
            font: {
              family: "Funnel Display",
              size: 12
            }
          },
          grid: {
            color: "#1e3b5a"
          }
        },
        y: {
          beginAtZero: true,
          max: 100,
          ticks: {
            color: "#bfe8ff",
            font: {
              family: "Funnel Display",
              size: 12
            }
          },
          grid: {
            color: "#1e3b5a"
          },
          title: {
            display: true,
            text: "Score (%)",
            color: "#bfe8ff",
            font: {
              family: "Funnel Display",
              size: 12
            }
          }
        }
      }
    }
  });

  //recent quizzes section history page

  document.getElementById("quiz-card").innerHTML = `
    <h1 style="font-family: 'Funnel Display', sans-serif; font-weight: 800; color: #abcdda; margin: 0 0 10px 0; font-size: 20px;">Most Recent Quiz</h1>
    <p>Topic: ${results[0].topic}</p>
    <p>Date: ${safeDate(results[0]).toLocaleDateString()}</p>
    <p>Score: ${results[0].percentage}%</p>
  `;

  document.getElementById("quiz-card-2").innerHTML = `
    <h1 style="font-family: 'Funnel Display', sans-serif; font-weight: 800; color: #abcdda; margin: 0 0 10px 0; font-size: 18px;">Second Most Recent Quiz</h1>
    <p>Topic: ${results[1] ? results[1].topic : "N/A"}</p>
    <p>Date: ${results[1] ? safeDate(results[1]).toLocaleDateString() : "N/A"}</p>
    <p>Score: ${results[1] ? results[1].percentage + "%" : "N/A"}</p>
  `;

  document.getElementById("quiz-card-3").innerHTML = `
    <h1 style="font-family: 'Funnel Display', sans-serif; font-weight: 800; color: #abcdda; margin: 0 0 10px 0; font-size: 18px;">Third Most Recent Quiz</h1>
    <p>Topic: ${results[2] ? results[2].topic : "N/A"}</p>
    <p>Date: ${results[2] ? safeDate(results[2]).toLocaleDateString() : "N/A"}</p>
    <p>Score: ${results[2] ? results[2].percentage + "%" : "N/A"}</p>
   `
  ;  
}

//Quiz page aigroq generation

document.querySelectorAll(".roadmap-topic").forEach(topic => {

  topic.addEventListener("click", async () => {

    if (topic.classList.contains("upcoming")) {
      return;
    }

    const topicName =
      topic.querySelector(".quiz-name").textContent;

    localStorage.setItem("selectedTopic", topicName);

    try {

      const response = await fetch(
        "http://localhost:3001/generate-quiz",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            topic: topicName,
            difficulty: "Easy",
            count: 10
          })
        }
      );

      const questions = await response.json();

      localStorage.setItem(
        "generatedQuestions",
        JSON.stringify(questions)
      );

      window.location.href = "./quiz.html";

    } catch (err) {

      console.error(err);

    }

  });

});

//Load Roadmap classes

document.querySelectorAll(".roadmap-topic").forEach(topic => {

  const topicId = topic.dataset.id;

  topic.classList.remove(
    "completed",
    "current",
    "upcoming"
  );

  if (progress.completedTopics.includes(topicId)) {
    topic.classList.add("completed");
  }

  else if (progress.unlockedTopics.includes(topicId)) {
    topic.classList.add("current");
  }

  else {
    topic.classList.add("upcoming");
  }

});

document.addEventListener('DOMContentLoaded', () => {
  loadDashboard().catch(err => console.error('loadDashboard failed:', err));
});
