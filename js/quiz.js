import questions from '../data/questions.js';

let currentIndex = 0;
let score = 0;

const questions = document.getElementById('question');
const options = document.getElementById('options');
const submitBtn = document.getElementById('submit-answer');

function loadQuestion(){
    const currentQuestion = questions[currentIndex];

    questions.textContent = q.question;
    options.innerHTML = '';

    q.options.forEach(option => {
        const btn = document.createElement('button');
        btn.textContent = option;

        btn.onclick = () => selectAnswer(option, q.answer);

        options.appendChild(btn);
    });
}

function selectAnswer(selected, correct){
    if(selected==correct){
        score++;
    } 

    submitBtn.style.display = 'block';
}

submitBtn.onclick = () => {
  currentIndex++;

  if (currentIndex < questions.length){
    loadQuestion();
    nextButton.style.display = 'none';  
  } else{
    localStorage.setItem('score', score);
    window.location.href = '../html/results.html';
  }
};