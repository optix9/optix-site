import { getCurrentUser, getRecentResults, getUserProgress, streakUpdate } from "./storage.js";

const QUIZ_API_URL =
  localStorage.getItem("optixQuizApiUrl") ||
  (["localhost", "127.0.0.1"].includes(window.location.hostname)
    ? "http://localhost:3001"
    : "");

function getTopicId(topicName) {
  return topicName.toLowerCase().trim().replaceAll(" ", "-");
}

async function loadProgress() {
  const savedProgress = await getUserProgress();
  const progress = {
    completedTopics: savedProgress.completedTopics || [],
    unlockedTopics: savedProgress.unlockedTopics || ["addition-basics"]
  };

  progress.completedTopics = progress.completedTopics.map(getTopicId);
  progress.unlockedTopics = progress.unlockedTopics.map(getTopicId);

  return progress;
}

$(async function () {
  const user = await getCurrentUser();
  let name = user ? user.displayName : "";

  if (name) {
    $("#welcome-text").text("Welcome, " + name);
  }
});

async function loadDashboard() {
  const setText = (id, text) => {
    const element = document.getElementById(id);
    if (element) {
      element.textContent = text;
    }
  };

  const statsMain = document.querySelector(".stats-main-4");
  const recentDiv = document.querySelector(".recent-activity-main-5");

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
    if (statsMain) {
      statsMain.innerHTML = `
        <h3>Stats</h3>
        <p>Quizzes Taken: 0</p>
        <p>Average Score: 0%</p>
      `;
    }
    if (recentDiv) {
      recentDiv.innerHTML = `
        <h3>Recent Activity</h3>
        <p>No recent quiz results yet.</p>
      `;
    }
    setText("avgscore", "Average Score: 0%");
    setText("bestscore", "Best Score: 0%");
    setText("xp-level", "XP: ");
    setText("hardesttopic", "Hardest Topic: N/A");
    setText("quizestaken", "Quizzes Taken: 0");
    setText("currentstreak", "Current Streak: 0");
    setText("longeststreak", "Longest Streak: 0");
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
  if (statsMain) {
    statsMain.innerHTML = `
      <h3>Stats</h3>
      <p>Quizzes Taken: ${totalQuizzes}</p>
      <p>Average Score: ${avgScore}%</p>
    `;
  }

  // recent activity
  if (recentDiv) {
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
  }

  setText("avgscore", `Average Score: ${avgScore}%`);
  setText("quizestaken", `Quizzes Taken: ${totalQuizzes}`);
  setText("bestscore", `Best Score: ${Math.max(...results.map(r => r.percentage))}%`);
  

 
  const streak = streakUpdate();
  setText("currentstreak", `Current Streak: ${streak}`);
  setText("longeststreak", `Longest Streak: ${streak}`);
  setText("streakptag", streak > 1 ? `Streak: ${streak} days` : `Streak: ${streak} day`);

  // populate history table
  let shown = 5;
  const tableBody = document.querySelector("#history-table tbody");
  const showMoreBtn = document.getElementById("show-more");

  function populateTable() {
    if (!tableBody || !showMoreBtn) return;

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

  if (showMoreBtn) {
    showMoreBtn.addEventListener("click", () => {
      shown += 5;
      populateTable();
    });
  }

    //   line graph js !!!! its so cool 

  const performanceChart = document.getElementById("performance-chart");
  if (performanceChart) {
    const myChart = new Chart(performanceChart, {
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
  }

  //recent quizzes section history page

  const quizCard = document.getElementById("quiz-card");
  const quizCard2 = document.getElementById("quiz-card-2");
  const quizCard3 = document.getElementById("quiz-card-3");

  if (quizCard) {
    quizCard.innerHTML = `
    <h1 style="font-family: 'Funnel Display', sans-serif; font-weight: 800; color: #abcdda; margin: 0 0 10px 0; font-size: 20px;">Most Recent Quiz</h1>
    <p>Topic: ${results[0].topic}</p>
    <p>Date: ${safeDate(results[0]).toLocaleDateString()}</p>
    <p>Score: ${results[0].percentage}%</p>
  `;
  }

  if (quizCard2) {
    quizCard2.innerHTML = `
    <h1 style="font-family: 'Funnel Display', sans-serif; font-weight: 800; color: #abcdda; margin: 0 0 10px 0; font-size: 18px;">Second Most Recent Quiz</h1>
    <p>Topic: ${results[1] ? results[1].topic : "N/A"}</p>
    <p>Date: ${results[1] ? safeDate(results[1]).toLocaleDateString() : "N/A"}</p>
    <p>Score: ${results[1] ? results[1].percentage + "%" : "N/A"}</p>
  `;
  }

  if (quizCard3) {
    quizCard3.innerHTML = `
    <h1 style="font-family: 'Funnel Display', sans-serif; font-weight: 800; color: #abcdda; margin: 0 0 10px 0; font-size: 18px;">Third Most Recent Quiz</h1>
    <p>Topic: ${results[2] ? results[2].topic : "N/A"}</p>
    <p>Date: ${results[2] ? safeDate(results[2]).toLocaleDateString() : "N/A"}</p>
    <p>Score: ${results[2] ? results[2].percentage + "%" : "N/A"}</p>
   `
  ; 
  } 
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
      if (!QUIZ_API_URL) {
        throw new Error("Quiz API URL is not configured for this public site.");
      }

      const response = await fetch(
        `${QUIZ_API_URL}/generate-quiz`,
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

      if (!response.ok) {
        throw new Error("Quiz API request failed.");
      }

      const questions = await response.json();

      if (!Array.isArray(questions)) {
        throw new Error("Quiz API returned invalid questions.");
      }

      localStorage.setItem(
        "generatedQuestions",
        JSON.stringify(questions)
      );

      window.location.href = "../quiz.html";

    } catch (err) {

      console.error(err);
      localStorage.setItem(
        "generatedQuestions",
        JSON.stringify(createBackupQuestions(topicName))
      );
      window.location.href = "../quiz.html";

    }

  });

});

function createBackupQuestions(topicName) {
  return Array.from({ length: 10 }, (_, index) => {
    const a = index + 2;
    const b = index + 3;
    const answer = a + b;

    return {
      question: `${topicName}: ${a} + ${b} = ?`,
      options: [answer, answer + 1, answer - 1, answer + 2].map(String),
      answer: String(answer)
    };
  });
}
function renderRoadmap(progress) {
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
}

document.addEventListener('DOMContentLoaded', () => {
  getCurrentUser().then(user => {
    if (!user) return;

    loadProgress()
      .then(renderRoadmap)
      .catch(err => console.error('loadProgress failed:', err));

    loadDashboard().catch(err => console.error('loadDashboard failed:', err));
  });
});
