import { getCurrentUser, getUserProgress } from "../shared/storage.js";
import { getRecentResults } from '../shared/storage.js';

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
    topicElement.textContent.trim() ||
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
  const topicName = getTopicLabel(topicElement);
  if (!topicName) {
    console.error("Roadmap topic has no label.");
    showQuizGenerationError("Selected roadmap topic is invalid.");
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
      error.message ||
        "AI quiz generation failed. Please make sure the quiz API server is running and try again."
    );
  }
}

function setupRoadmapClickHandlers() {
  const roadmapContainer = document.getElementById("roadmap-scroll");
  if (!roadmapContainer) return;

  roadmapContainer.addEventListener("click", event => {
    const topic = event.target.closest(".roadmap-topic");
    if (!topic) return;
    handleRoadmapTopicClick(topic);
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
  // load recent activity into the right-panel recent activity card
  try {
    const results = Array.isArray(await getRecentResults()) ? await getRecentResults() : [];
    renderRecentActivity(results);
  } catch (err) {
    console.error('Failed to load recent activity for dashboard:', err);
  }
}

document.addEventListener("DOMContentLoaded", () => {
  initDashboard().catch(err => {
    console.error("Dashboard initialization failed:", err);
  });
});

const quizzesTakenEl = document.getElementById("quizzes-taken");
const averageScoreEl = document.getElementById("average-score");
const topicsMasteredEl = document.getElementById("topics-mastered");

async function loadDashboardResults(){
  const results = await getRecentResults();
  const quizzesTaken = results.length;
    if (quizzesTakenEl) quizzesTakenEl.textContent = quizzesTaken;

  const avg = results.length
		? Math.round(results.reduce((s, r) => s + (Number(r && r.percentage) || 0), 0) / results.length)
		: 0;
	if (averageScoreEl) averageScoreEl.textContent = `${avg}%`;

  const statRingAvgScore = document.querySelector(".stat-card-ring-avgscore");
  if (statRingAvgScore) {
    statRingAvgScore.style.background = `conic-gradient(#2da2ff 0deg ${avg * 3.6}deg, #1b2947 ${avg * 3.6}deg)`;
  }
}

document.addEventListener('DOMContentLoaded', () => {
  loadDashboardResults().catch(err => {
    console.error('Failed to load dashboard results:', err);
  });
});

// --- recent activity helpers (copied from pages/history.js) ---
function safeDate(result) {
  if (!result) return new Date();
  const createdAt = result.createdAt || result.date;
  if (createdAt && typeof createdAt.toDate === 'function') return createdAt.toDate();
  if (createdAt && createdAt.seconds) return new Date(createdAt.seconds * 1000);
  if (typeof createdAt === 'string' || typeof createdAt === 'number') return new Date(createdAt);
  return new Date();
}

function formatRelativeTime(date) {
  const now = new Date();
  const diff = Math.max(0, now - date);
  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);

  if (days > 0) return `${days}d ago`;
  if (hours > 0) return `${hours}h ago`;
  if (minutes > 0) return `${minutes}m ago`;
  return 'Just now';
}

function renderRecentActivity(results) {
  const list = document.getElementById('dashboard-activity-list') || document.querySelector('.activity-list');
  if (!list) return;
  list.innerHTML = '';

  if (!results || !results.length) {
    const p = document.createElement('p');
    p.textContent = 'No recent activity yet.';
    p.className = 'history-empty';
    list.appendChild(p);
    return;
  }

  results.slice(0, 4).forEach(result => {
    const date = safeDate(result);
    const title = result.topic || result.name || 'Unknown Quiz';

    const item = document.createElement('div');
    item.className = 'activity-item';

    const check = document.createElement('div');
    check.className = 'activity-check';
    check.textContent = '✓';

    const info = document.createElement('div');
    info.className = 'activity-info';
    const titleSpan = document.createElement('span');
    titleSpan.textContent = title;
    titleSpan.className = 'activity-title';
    info.appendChild(titleSpan);

    const time = document.createElement('div');
    time.className = 'activity-time';
    time.textContent = formatRelativeTime(date);

    item.appendChild(check);
    item.appendChild(info);
    item.appendChild(time);

    list.appendChild(item);
  });
}

