import { getCurrentUser, getUserProgress } from "../shared/storage.js";

const QUIZ_API_URL =
  localStorage.getItem("optixQuizApiUrl") ||
  (["localhost", "127.0.0.1"].includes(window.location.hostname)
    ? "http://localhost:3001"
    : "");

function getTopicId(topicName) {
  return topicName.toLowerCase().trim().replaceAll(" ", "-");
}

function getTopicLabel(topicElement) {
  return (
    topicElement.dataset.topic?.trim() ||
    topicElement.querySelector(".quiz-name")?.textContent.trim() ||
    ""
  );
}

function setWelcomeText(user) {
  if (!user || !user.displayName) return;
  const welcomeText = document.getElementById("welcome-text");
  if (welcomeText) {
    welcomeText.textContent = `Welcome, ${user.displayName}`;
  }
}

function showQuizGenerationError(message) {
  alert(message || "Unable to generate AI quiz questions right now.");
}

async function requestGeneratedQuiz(topic, difficulty = "Easy", count = 10) {
  if (!QUIZ_API_URL) {
    throw new Error("Quiz API URL is not configured.");
  }

  const response = await fetch(`${QUIZ_API_URL}/generate-quiz`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      topic,
      difficulty,
      count
    })
  });

  if (!response.ok) {
    const responseText = await response.text();
    throw new Error(
      `Quiz API request failed (${response.status}): ${response.statusText} - ${responseText}`
    );
  }

  const questions = await response.json();
  if (!Array.isArray(questions)) {
    throw new Error("Quiz API returned invalid question data.");
  }

  return questions;
}

async function handleRoadmapTopicClick(topicElement) {
  if (topicElement.classList.contains("upcoming")) {
    return;
  }

  const topicName = getTopicLabel(topicElement);
  if (!topicName) {
    console.error("Roadmap topic has no label.");
    return;
  }

  localStorage.setItem("selectedTopic", topicName);

  try {
    const questions = await requestGeneratedQuiz(topicName, "Easy", 10);
    localStorage.setItem("generatedQuestions", JSON.stringify(questions));
    window.location.href = "../quiz.html";
  } catch (error) {
    console.error("AI quiz generation failed:", error);
    localStorage.removeItem("generatedQuestions");
    showQuizGenerationError(
      "AI quiz generation failed. Please make sure the quiz API server is running and try again."
    );
  }
}

function setupRoadmapClickHandlers() {
  document.querySelectorAll(".roadmap-topic").forEach(topic => {
    topic.addEventListener("click", () => handleRoadmapTopicClick(topic));
  });
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

function renderRoadmap(progress) {
  document.querySelectorAll(".roadmap-topic").forEach(topic => {
    const topicId = topic.dataset.id;
    topic.classList.remove("completed", "current", "upcoming");

    if (progress.completedTopics.includes(topicId)) {
      topic.classList.add("completed");
    } else if (progress.unlockedTopics.includes(topicId)) {
      topic.classList.add("current");
    } else {
      topic.classList.add("upcoming");
    }
  });
}

async function initDashboard() {
  const user = await getCurrentUser();
  setWelcomeText(user);

  if (!user) {
    return;
  }

  const progress = await loadProgress();
  renderRoadmap(progress);
  setupRoadmapClickHandlers();
}

document.addEventListener("DOMContentLoaded", () => {
  initDashboard().catch(err => {
    console.error("Dashboard initialization failed:", err);
  });
});
