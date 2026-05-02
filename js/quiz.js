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

let selectedTopic = localStorage.getItem('selectedTopic');
let selectedDifficulty = localStorage.getItem('selectedDifficulty');
const storedLength = localStorage.getItem('selectedLength');
let selectedLength = storedLength ? parseInt(storedLength) : null;

let quizQuestions = [];

const questionEl = document.getElementById('question');
const optionsEl = document.getElementById('options');
const submitBtn = document.getElementById('submit-answer');

if (submitBtn) {
  submitBtn.style.display = 'none';
}

const topicBtns = document.querySelectorAll(".topic-btn");
const difficultyBtns = document.querySelectorAll(".difficulty-btn");
const lengthBtns = document.querySelectorAll(".length-btn");

topicBtns.forEach(btn => {
  btn.addEventListener("click", () => {
    topicBtns.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    selectedTopic = btn.textContent.trim();
    localStorage.setItem('selectedTopic', selectedTopic);
  });
});

difficultyBtns.forEach(btn => {
  btn.addEventListener("click", () => {
    difficultyBtns.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    selectedDifficulty = btn.textContent.trim();
    localStorage.setItem('selectedDifficulty', selectedDifficulty);
  });
});

lengthBtns.forEach(btn => {
  btn.addEventListener("click", () => {
    lengthBtns.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    selectedLength = parseInt(btn.textContent.match(/\d+/)[0]);
    localStorage.setItem('selectedLength', selectedLength.toString());
  });
});

function mapDifficulty(diff) {
  const diffMap = {
    'Easy': '1',
    'Medium': '2',
    'Hard': '3'
  };
  return diffMap[diff] || null;
}

function applyFilters() {
  let filtered = [...allQuestions];
  
  if (selectedTopic && selectedTopic !== 'All Topics') {
    filtered = filtered.filter(q => q.topic.toLowerCase() === selectedTopic.toLowerCase());
  }
  
  if (selectedDifficulty) {
    const diffCode = mapDifficulty(selectedDifficulty);
    if (diffCode) {
      filtered = filtered.filter(q => q.difficulty === diffCode);
    }
  }
  
  filtered.sort(() => Math.random() - 0.5);
  
  if (selectedLength && selectedLength > 0) {
    filtered = filtered.slice(0, selectedLength);
  }
  
  quizQuestions = filtered;
}

function loadQuestion() {
  if (quizQuestions.length === 0) {
    questionEl.textContent = 'No questions match your filters. Please go back and try again.';
    return;
  }

  const q = quizQuestions[currentIndex];

  questionEl.textContent = q.question;
  optionsEl.innerHTML = '';
  selectedAnswer = null;
  submitBtn.style.display = 'none';
  
  document.getElementById("question-title").textContent = `Question ${currentIndex + 1}`;
  document.getElementById("question-count").textContent = `${currentIndex + 1} of ${quizQuestions.length}`;

  const progressFill = document.querySelector('.progress-fill');
  if (progressFill) {
    const progressPercent = ((currentIndex) / quizQuestions.length) * 100;
    progressFill.style.width = `${progressPercent}%`;
  }

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

if (submitBtn) {
  submitBtn.addEventListener('click', async () => {
    const q = quizQuestions[currentIndex];
    if (selectedAnswer === q.answer) score++;

    currentIndex++;
    if (currentIndex < quizQuestions.length) {
      loadQuestion();
    } else {
      const total = quizQuestions.length;
      const percentage = Math.round((score / total) * 100);

      const resultData = {
        score: score,
        total: total,
        percentage: percentage,
        date: new Date().toLocaleString(),
        topic: selectedTopic || 'All Topics',
        difficulty: selectedDifficulty || 'All Difficulties'
      };

      let history = JSON.parse(localStorage.getItem('quizHistory')) || [];
      history.push(resultData);
      localStorage.setItem('quizHistory', JSON.stringify(history));
      
      await saveQuizResult(resultData);
      localStorage.setItem('latestResult', JSON.stringify(resultData));
      
      localStorage.removeItem('selectedTopic');
      localStorage.removeItem('selectedDifficulty');
      localStorage.removeItem('selectedLength');
      
      window.location.href = './results.html';
    }
  });
}

window.addEventListener('DOMContentLoaded', () => {
  if (document.getElementById('question')) {
    applyFilters();
    loadQuestion();
  }
});