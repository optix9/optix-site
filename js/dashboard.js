import { getRecentResults, streakUpdate } from "./storage.js";

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
    p.textContent = `${r.percentage}% on ${r.createdAt.toDate().toLocaleDateString("en-US", { month: "numeric", day: "numeric" })}`;
    recentDiv.appendChild(p);
  });

  document.getElementById("avgscore").textContent = `Average Score: ${avgScore}%`;
  document.getElementById("quizestaken").textContent = `Quizzes Taken: ${totalQuizzes}`;  
  document.getElementById("bestscore").textContent = `Best Score: ${Math.max(...results.map(r => r.percentage))}%`;
  
  const streak = streakUpdate();
  document.getElementById("currentstreak").textContent = `Current Streak: ${streak}`;
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
      const date = r.createdAt.toDate().toLocaleDateString();
      row.innerHTML = `
        <td>${date}</td>
        <td>--</td>
        <td>--</td>
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
      labels: results.map(r => r.createdAt.toDate().toLocaleDateString("en-US", { month: "numeric", day: "numeric" })),
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
    <p>Date: ${results[0].createdAt.toDate().toLocaleDateString()}</p>
    <p>Score: ${results[0].percentage}%</p>
  `;

  document.getElementById("quiz-card-2").innerHTML = `
    <h1 style="font-family: 'Funnel Display', sans-serif; font-weight: 800; color: #abcdda; margin: 0 0 10px 0; font-size: 18px;">Second Most Recent Quiz</h1>
    <p>Topic: ${results[1] ? results[1].topic : "N/A"}</p>
    <p>Date: ${results[1] ? results[1].createdAt.toDate().toLocaleDateString() : "N/A"}</p>
    <p>Score: ${results[1] ? results[1].percentage + "%" : "N/A"}</p>
  `;

  document.getElementById("quiz-card-3").innerHTML = `
    <h1 style="font-family: 'Funnel Display', sans-serif; font-weight: 800; color: #abcdda; margin: 0 0 10px 0; font-size: 18px;">Third Most Recent Quiz</h1>
    <p>Topic: ${results[2] ? results[2].topic : "N/A"}</p>
    <p>Date: ${results[2] ? results[2].createdAt.toDate().toLocaleDateString() : "N/A"}</p>
    <p>Score: ${results[2] ? results[2].percentage + "%" : "N/A"}</p>
   `
  ;  
}

loadDashboard();