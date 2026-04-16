const result = JSON.parse(localStorage.getItem("latestResult"));

const score = result.score;
const total = result.total;
const percentage = result.percentage;
const date = result.date;

const message = document.getElementById("message");

document.getElementById('total').textContent = `Total Questions: ${total}`;
document.getElementById('score').textContent = `Your Score: ${score} / ${total}`;
document.getElementById('percentage').textContent = `Percentage: ${percentage}%`;

document.getElementById('date').textContent = `Date Taken: ${date}`;

if (percentage >= 85){
  message.textContent = "🧠 Excellent work! You have a strong grasp of the material!";
}

if (percentage >= 70 && percentage < 85){
  message.textContent = "👍 Good job! You have a solid understanding, but there's room for improvement.";
}

if (percentage >= 50 && percentage < 70){
  message.textContent = "💡 Not bad, but consider reviewing the material to improve your understanding.";
}

if (percentage < 50){
  message.textContent = "😬 It looks like you struggled with this quiz. Don't be discouraged - review the material and try again!";
}