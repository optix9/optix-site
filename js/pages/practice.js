const QUIZ_API_URL =
  localStorage.getItem("optixQuizApiUrl") ||
  "http://localhost:3001";

async function requestGeneratedQuiz(topic, difficulty = "Easy", count = 10) {
  if (!QUIZ_API_URL) {
    throw new Error("Quiz API URL is not configured.");
  }

  const response = await fetch(`${QUIZ_API_URL}/generate-quiz`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ topic, difficulty, count })
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(
      `Quiz API request failed (${response.status}): ${response.statusText} - ${text}`
    );
  }

  const questions = await response.json();
  if (!Array.isArray(questions)) {
    throw new Error("Quiz API returned invalid question data.");
  }

  return questions;
}

function getPracticeTopic() {
  return document.getElementById("searchInput")?.value.trim() || "";
}

function getPracticeSettings() {
  const difficulty =
    document.querySelector(".difficulty-btn.current")?.textContent.trim() ||
    "Easy";

  const count =
    parseInt(document.getElementById("questions")?.value, 10) || 20;

  return { difficulty, count };
}


function showPracticeError(message) {
  alert(message || "Unable to generate practice quiz right now.");
}

document.addEventListener("DOMContentLoaded", () => {
  const startPracticeBtn = document.getElementById("start-practice");
  const difficultyBtns = document.querySelectorAll(".difficulty-btn");

  difficultyBtns.forEach(btn => {
    btn.addEventListener("click", () => {
      difficultyBtns.forEach(otherBtn => otherBtn.classList.remove("current"));
      btn.classList.add("current");
    });
  });

  if (difficultyBtns.length > 0) {
    difficultyBtns[0].classList.add("current");
  }

  if (!startPracticeBtn) return;

  startPracticeBtn.addEventListener("click", async () => {
    const topic = getPracticeTopic();
    if (!topic) {
      alert("Please choose a topic from the search list first.");
      return;
    }

    const { difficulty, count } = getPracticeSettings();
    localStorage.setItem("selectedTopic", topic);

    startPracticeBtn.disabled = true;
    const originalText = startPracticeBtn.textContent;
    startPracticeBtn.textContent = "Loading...";

    try {
      const questions = await requestGeneratedQuiz(topic, difficulty, count);
      localStorage.setItem("generatedQuestions", JSON.stringify(questions));
      window.location.href = "../quiz.html";
    } catch (error) {
      console.error("Practice quiz generation failed:", error);
      showPracticeError(
        "AI quiz generation failed. Please make sure the quiz API is running and try again."
      );
    } finally {
      startPracticeBtn.disabled = false;
      startPracticeBtn.textContent = originalText;
    }
  });
});
