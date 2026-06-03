const stored = localStorage.getItem("latestResult");
const result = stored ? JSON.parse(stored) : null;

const score = result && result.score != null ? result.score : 0;
const total = result && result.total != null ? result.total : 0;
const percentage = result && result.percentage != null ? result.percentage : 0;
const date = result && result.date ? result.date : null;

const message = document.getElementById("message");

// populate fields if present
const totalEl = document.getElementById('total');
const scoreEl = document.getElementById('score');
const percEl = document.getElementById('percentage');
const dateEl = document.getElementById('date');

if (totalEl) totalEl.textContent = `Total Questions: ${total}`;
if (scoreEl) scoreEl.textContent = `Your Score: ${score} / ${total}`;
if (percEl) percEl.textContent = `Percentage: ${percentage}%`;
if (dateEl && date) dateEl.textContent = `Date Taken: ${date}`;

// ensure we compare numbers, not strings
const perc = Number(percentage) || 0;

if (!message) {
  // nothing to do
} else if (!result) {
  message.textContent = "No results found. Take the quiz to see your results.";
} else if (perc >= 85) {
  message.textContent = "🧠 Excellent work! You have a strong grasp of the material!";
} else if (perc >= 70) {
  message.textContent = "👍 Good job! You have a solid understanding, but there's room for improvement.";
} else if (perc >= 50) {
  message.textContent = "💡 Not bad, but consider reviewing the material to improve your understanding.";
} else {
  message.textContent = "😬 It looks like you struggled with this quiz. Don't be discouraged - review the material and try again!";
}
