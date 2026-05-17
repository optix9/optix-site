import { saveQuizResult } from "./storage.js";

let currentIndex = 0;
let score = 0;
let selectedAnswer = null;

let selectedTopic = localStorage.getItem('selectedTopic');

let quizQuestions =
  JSON.parse(localStorage.getItem("generatedQuestions")) || [];

const questionEl = document.getElementById('question');
const optionsEl = document.getElementById('options');
const submitBtn = document.getElementById('submit-answer');

if (submitBtn) {
  submitBtn.style.display = 'none';
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
        difficulty: "AI Generated"
      };

      let history = JSON.parse(localStorage.getItem('quizHistory')) || [];
      history.push(resultData);
      localStorage.setItem('quizHistory', JSON.stringify(history));
      
      await saveQuizResult(resultData);
      localStorage.setItem('latestResult', JSON.stringify(resultData));
      
      localStorage.removeItem('selectedTopic');
      localStorage.removeItem("generatedQuestions");
      window.location.href = './results.html';
    }
  });
}

if (document.getElementById('question')) {
  loadQuestion();
}