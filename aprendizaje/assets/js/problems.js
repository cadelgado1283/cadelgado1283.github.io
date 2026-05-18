async function loadProblems() {
  const res = await fetch('../data/problems.json');
  const data = await res.json();

  const wrap = document.getElementById('problems');
  const theme = document.getElementById('theme');
  const difficulty = document.getElementById('difficulty');
  const method = document.getElementById('method');
  const qInput = document.getElementById('q');

  [...new Set(data.map(p => p.theme))].sort().forEach(t => {
    theme.innerHTML += `<option value="${t}">${t}</option>`;
  });

  [...new Set(data.map(p => p.difficulty))].forEach(d => {
    difficulty.innerHTML += `<option value="${d}">${d}</option>`;
  });

  [...new Set(data.map(p => p.method))].sort().forEach(m => {
    method.innerHTML += `<option value="${m}">${m}</option>`;
  });

  function normalize(text) {
    return String(text || '').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
  }

  function render() {
    const q = normalize(qInput.value);
    const filtered = data.filter(p => {
      const text = normalize(`${p.id} ${p.title} ${p.theme} ${p.difficulty} ${p.method} ${p.context} ${p.objective}`);
      return (!theme.value || p.theme === theme.value) &&
             (!difficulty.value || p.difficulty === difficulty.value) &&
             (!method.value || p.method === method.value) &&
             (!q || text.includes(q));
    });

    document.getElementById('count').textContent = `${filtered.length} problema(s) encontrado(s)`;
    wrap.innerHTML = '';

    filtered.forEach(p => {
      const deliverables = (p.deliverables || []).map(x => `<li>${x}</li>`).join('');
      const hints = (p.hints || []).map(x => `<li>${x}</li>`).join('');
      wrap.innerHTML += `
        <article class="problem-card card">
          <div class="problem-head">
            <span class="badge">${p.id}</span>
            <span class="pill">${p.theme}</span>
            <span class="pill">${p.difficulty}</span>
            <span class="pill">${p.method}</span>
          </div>
          <h2>${p.title}</h2>
          <section>
            <h3>Descripción del problema</h3>
            <p>${p.context}</p>
          </section>
          <section>
            <h3>Datos del caso</h3>
            ${p.data}
          </section>
          <section>
            <h3>Objetivo del estudiante</h3>
            <p>${p.objective}</p>
          </section>
          <section>
            <h3>Entregables esperados</h3>
            <ul>${deliverables}</ul>
          </section>
          <details>
            <summary>Pistas opcionales sin revelar la solución</summary>
            <ul>${hints}</ul>
          </details>
        </article>`;
    });
  }

  qInput.oninput = render;
  theme.onchange = render;
  difficulty.onchange = render;
  method.onchange = render;
  render();
}

loadProblems();
