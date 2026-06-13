import { getRecentResults } from '../shared/storage.js';
import { streakUpdate } from "../shared/storage.js";

/* CARDS INFO */
const quizzesTakenEl = document.getElementById('quizzestaken');
const timeSpentEl = document.getElementById('timespent');
const questionsAnsweredEl = document.getElementById('questionsanswered');
const averageScoreEl = document.getElementById('avgscore');

async function loadHistoryCards() {

    //LOAD ARRAY
	let results = [];
	try {
		results = await getRecentResults();
		if (!Array.isArray(results)) results = [];
	} catch (err) {
		console.error('Failed to load recent results for history cards:', err);
		results = [];
	}

	// QUIZZES TAKEN 
	const quizzesTaken = results.length;
    if (quizzesTakenEl) quizzesTakenEl.textContent = quizzesTaken;

	// QUESTIONS ANSWERED
	const questionsAnswered = results.reduce((sum, r) => {
		const t = Number(r && r.total) || 0;
		return sum + t;
	}, 0);
	if (questionsAnsweredEl) questionsAnsweredEl.textContent = questionsAnswered;

	// AVG SCORE
	const avg = results.length
		? Math.round(results.reduce((s, r) => s + (Number(r && r.percentage) || 0), 0) / results.length)
		: 0;
	if (averageScoreEl) averageScoreEl.textContent = `${avg}%`;

}

//HISTORY TABLE

const historyTable = document.querySelector('.history-table');

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

  if (days > 0) return `${days}d Ago`;
  if (hours > 0) return `${hours}h Ago`;
  if (minutes > 0) return `${minutes}m Ago`;
  return 'Just now';
}

function formatDuration(seconds) {
  if (!seconds || seconds <= 0) return '—';
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const parts = [];
  if (hours) parts.push(`${hours}h`);
  parts.push(`${minutes}m`);
  return parts.join(' ');
}

function renderHistoryTable(results) {
  if (!historyTable) return;

  historyTable.innerHTML = '<h1>RECENT ACTIVITY</h1>';

  if (!results.length) {
    const empty = document.createElement('p');
    empty.textContent = 'No recent activity yet.';
    empty.className = 'history-empty';
    historyTable.appendChild(empty);
    return;
  }

  results.slice(0, 10).forEach(result => {
    const row = document.createElement('div');
    row.className = 'history-row';

    const date = safeDate(result);
    const total = Number(result.total) || 0;
    const score = Number(result.score != null ? result.score : Math.round((Number(result.percentage) || 0) * total / 100)) || 0;
    const percentage = Number(result.percentage) || (total ? Math.round((score / total) * 100) : 0);
    const durationSeconds = Number(result.durationSeconds || result.duration || result.timeSpentSeconds) || 0;
    const status = percentage >= 50 ? 'Completed' : 'Incomplete';

    row.innerHTML = `
      <h2 class="history-time">${formatRelativeTime(date)}</h2>
      <div class="data-bundle">
        <div class="dimg">
          <img src="../../images/arithmetic.png" class="history-icon">
        </div>
        <div class="bundlehistory">
          <span class="history-quiz-name">${result.topic || 'Unknown Quiz'}</span>
          <span class="history-amount">${total} Questions</span>
        </div>
      </div>
      <h2 class="history-score">Score: ${percentage}%</h2>
      <h2 class="history-questions">${score}/${total}</h2>
      <h2 class="history-time-spent">${formatDuration(durationSeconds)}</h2>
      <h2 class="history-status">${status}</h2>
    `;

    historyTable.appendChild(row);
  });
}

document.addEventListener('DOMContentLoaded', () => {
  loadHistoryCards().catch(err => console.error('loadHistoryCards failed:', err));
  getRecentResults()
    .then(results => renderHistoryTable(Array.isArray(results) ? results : []))
    .catch(err => {
      console.error('Failed to render history table:', err);
      renderHistoryTable([]);
    });
});


const streak = document.getElementById("streaktextd");
const streakVal = streakUpdate();

streak.textContent = `${streakVal} ${streakVal === 1 ? "day" : "days"}`;