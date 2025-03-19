let currentQuestion = 0;
const userAnswers = new Array(15).fill(null);

const questions = [
  { file: 'questions/question1.html', correctAnswer: 'a' },
  { file: 'questions/question2.html', correctAnswer: 'b' },
  { file: 'questions/question3.html', correctAnswer: 'b' },
  { file: 'questions/question4.html', correctAnswer: 'a' },
  { file: 'questions/question5.html', correctAnswer: 'a' },
  { file: 'questions/question6.html', correctAnswer: 'b' },
  { file: 'questions/question7.html', correctAnswer: 'a' },
  { file: 'questions/question8.html', correctAnswer: 'a' },
  { file: 'questions/question9.html', correctAnswer: 'a' },
  { file: 'questions/question10.html', correctAnswer: 'a' },
  { file: 'questions/question11.html', correctAnswer: 'a' },
  { file: 'questions/question12.html', correctAnswer: 'a' },
  { file: 'questions/question13.html', correctAnswer: 'a' },
  { file: 'questions/question14.html', correctAnswer: 'a' },
  { file: 'questions/question15.html', correctAnswer: 'b' }
];

function loadQuestion() {
  const question = questions[currentQuestion];
  const percentage = ((currentQuestion + 1) / questions.length) * 100;

  document.querySelector('.progress').style.width = `${percentage}%`;
  fetch(question.file)
    .then(response => {
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      return response.text();
    })
    .then(data => {
      document.getElementById('quiz').innerHTML = data;
      if (userAnswers[currentQuestion] !== null) {
        document.querySelector(`input[value="${userAnswers[currentQuestion]}"]`).checked = true;
      }
    })
    .catch(error => {
      console.error('Error loading question:', error);
      document.getElementById('quiz').innerHTML = `<p>Error loading question. Please check the console for details.</p>`;
    });

  document.getElementById('prev').disabled = currentQuestion === 0;
  document.getElementById('next').textContent =
    currentQuestion === questions.length - 1 ? 'Submit' : 'Next';
}

function saveAnswer() {
  const selected = document.querySelector('input[name="question"]:checked');
  userAnswers[currentQuestion] = selected ? selected.value : null;
}

function nextQuestion() {
  saveAnswer();
  if (currentQuestion < questions.length - 1) {
    currentQuestion++;
    loadQuestion();
  } else {
    showResults();
  }
}

function previousQuestion() {
  saveAnswer();
  currentQuestion--;
  loadQuestion();
}

function showResults() {
  saveAnswer();
  let score = 0;
  const results = questions.map((question, index) => {
    const isCorrect = userAnswers[index] === question.correctAnswer;
    if (isCorrect) score++;
    return `
      <div style="color: ${isCorrect ? 'green' : 'red'}; margin: 10px 0;">
        Q${index + 1}: ${isCorrect ? 'Correct' : 'Wrong'} (Correct answer: ${question.correctAnswer.toUpperCase()})
      </div>
    `;
  }).join('');

  document.getElementById('quiz').innerHTML = '';
  document.getElementById('results').innerHTML = `
    <h3>Your Score: ${score}/${questions.length}</h3>
    ${results}
  `;
  document.querySelector('.nav-buttons').style.display = 'none';
  document.querySelector('.progress-bar').style.display = 'none';
}

// Initialize quiz
loadQuestion();