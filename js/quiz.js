import {
  algebraQuestions,
  geometryQuestions,
  numberTheoryQuestions,
  probabilityQuestions
} from "../data/questions.js";

import { saveQuizResult } from "./storage.js";

const allQuestions = [
  ...algebraQuestions,
  ...geometryQuestions,
  ...numberTheoryQuestions,
  ...probabilityQuestions
];

let currentIndex = 0;
let score = 0;
let selectedAnswer = null;

let selectedTopic = null;
let selectedDifficulty = null;
let selectedLength = null;

const questionEl = document.getElementById('question');
const optionsEl = document.getElementById('options');
const submitBtn = document.getElementById('submit-answer');

submitBtn.style.display = 'none';

document.querySelectorAll(".topic-btn").forEach(btn => {
  btn.addEventListener("click", () => {
    selectedTopic = btn.textContent;
    console.log("Topic:", selectedTopic);
  });
});

document.querySelectorAll(".difficulty-btn").forEach(btn => {
  btn.addEventListener("click", () => {
    selectedDifficulty = btn.textContent;
    console.log("Difficulty:", selectedDifficulty);
  });
});

document.querySelectorAll(".length-btn").forEach(btn => {
  btn.addEventListener("click", () => {
    selectedLength = parseInt(btn.textContent);
    console.log("Length:", selectedLength);
  });
});

function mapDifficulty(diff) {
  if (diff === "Easy") return "1";
  if (diff === "Medium") return "2";
  if (diff === "Hard") return "3";
}

function loadQuestion(){
  const q = questions[currentIndex];

  questionEl.textContent = q.question;
  optionsEl.innerHTML = '';
  selectedAnswer = null;
  submitBtn.style.display = 'none';
  document.getElementById("question-title").textContent = `Question ${currentIndex + 1}`;
  document.getElementById("question-count").textContent = `${currentIndex + 1} of ${questions.length}`;

  const progressFill = document.querySelector('.progress-fill');
  const progressPercent = ((currentIndex) / questions.length) * 100;
  progressFill.style.width = `${progressPercent}%`;

  q.options.forEach(option => {
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.textContent = option;
    btn.className = 'option-btn';

    btn.onclick = () => {
      const prev = optionsEl.querySelector('.selected');
      if (prev) prev.classList.remove('selected');
      btn.classList.add('selected');
      selectedAnswer = option;
      submitBtn.style.display = 'inline-block';
    };

    optionsEl.appendChild(btn);
  });
}

submitBtn.addEventListener('click', async () => {
  const q = questions[currentIndex];
  if (selectedAnswer === q.answer) score++;

  currentIndex++;
  if (currentIndex < questions.length){
    loadQuestion();
  } else {

    const total = questions.length;
    const percentage = Math.round((score / total) * 100);

    const resultData = {
      score: score,
      total: total,
      percentage: percentage,
      date: new Date().toLocaleString()
    };

    let history = JSON.parse(localStorage.getItem('quizHistory')) || [];

    history.push(resultData);

    localStorage.setItem('quizHistory', JSON.stringify(history));
    
    await saveQuizResult(resultData);

    localStorage.setItem('latestResult', JSON.stringify(resultData));
    window.location.href = './results.html';
  }
});

window.addEventListener('DOMContentLoaded', loadQuestion);
