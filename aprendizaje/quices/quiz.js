let quiz;
let current = 0;
let score = 0;
let answered = false;

function getQuizFile() {
  const params = new URLSearchParams(window.location.search);
  return params.get('quiz') || 'quiz-a1.json';
}

async function init() {
  const quizFile = getQuizFile();
  try {
    quiz = await (await fetch(`../data/${quizFile}`)).json();
  } catch (error) {
    document.getElementById('quiz-card').innerHTML = '<h2>No se pudo cargar el quiz.</h2><p>Verifica que el archivo JSON exista en la carpeta data.</p>';
    return;
  }
  document.title = quiz.title;
  document.getElementById('quiz-title').textContent = quiz.title;
  document.getElementById('quiz-description').textContent = quiz.description || '';
  load();
}

function load() {
  answered = false;
  const q = quiz.questions[current];
  document.getElementById('question').textContent = q.question;
  document.getElementById('feedback').textContent = '';
  document.getElementById('feedback').className = '';
  document.getElementById('next').style.display = 'none';
  document.getElementById('submit').disabled = false;

  const opts = document.getElementById('options');
  opts.innerHTML = '';

  const num = document.getElementById('numeric');
  num.value = '';
  num.style.display = q.type === 'numeric' ? 'inline-block' : 'none';

  if (q.type !== 'numeric') {
    q.options.forEach((option, index) => {
      const label = document.createElement('label');
      label.className = 'option';
      label.innerHTML = `<input type="radio" name="ans" value="${index}"> ${option}`;
      opts.appendChild(label);
    });
  }

  document.getElementById('progress').textContent = `Pregunta ${current + 1} de ${quiz.questions.length}`;
}

document.getElementById('submit').onclick = () => {
  if (answered) return;
  const q = quiz.questions[current];
  let ans;

  if (q.type === 'numeric') {
    const raw = document.getElementById('numeric').value;
    if (raw === '') return;
    ans = Number(raw);
  } else {
    const selected = document.querySelector('input[name="ans"]:checked');
    if (!selected) return;
    ans = Number(selected.value);
  }

  const ok = ans === q.answer;
  if (ok) score++;
  answered = true;

  const feedback = document.getElementById('feedback');
  feedback.textContent = `${ok ? 'Correcto.' : 'Incorrecto.'} ${q.feedback}`;
  feedback.className = ok ? 'correct' : 'incorrect';
  document.getElementById('submit').disabled = true;
  document.getElementById('next').style.display = 'inline-block';
};

document.getElementById('next').onclick = () => {
  current++;
  if (current < quiz.questions.length) {
    load();
  } else {
    const pct = Math.round((score / quiz.questions.length) * 100);
    document.getElementById('quiz-card').innerHTML = `<h2>Resultado final</h2><p class="correct">${score}/${quiz.questions.length} respuestas correctas (${pct}%).</p><p>Revisa las preguntas que fallaste y vuelve a intentar el quiz para reforzar el tema.</p><a class="button" href="index.html">Volver a la lista de quices</a>`;
  }
};

init();
