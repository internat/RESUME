// AI particles network (light)
// If prefers-reduced-motion is on — no animation
(function aiParticles() {
  const reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const canvas = document.getElementById('ai-bg');
  if (!canvas || reduce) return;

  const ctx = canvas.getContext('2d');
  let w = canvas.width = window.innerWidth;
  let h = canvas.height = window.innerHeight;

  const PARTICLES = Math.min(70, Math.round((w * h) / 18000)); // light amount depending on screen
  const MAX_SPEED = 0.4;
  const LINK_DIST = 120;

  const dots = [];
  for (let i = 0; i < PARTICLES; i++) {
    dots.push({
      x: Math.random() * w,
      y: Math.random() * h,
      vx: (Math.random() - 0.5) * MAX_SPEED,
      vy: (Math.random() - 0.5) * MAX_SPEED,
      r: Math.random() * 1.8 + 0.6
    });
  }

  const blue = 'rgba(13,110,253,0.8)';
  const lightBlue = 'rgba(58,176,255,0.6)';

  function draw() {
    ctx.clearRect(0, 0, w, h);
    // Lines
    for (let i = 0; i < dots.length; i++) {
      for (let j = i + 1; j < dots.length; j++) {
        const dx = dots[i].x - dots[j].x;
        const dy = dots[i].y - dots[j].y;
        const dist = Math.hypot(dx, dy);
        if (dist < LINK_DIST) {
          const opacity = 1 - dist / LINK_DIST;
          ctx.strokeStyle = `rgba(13,110,253,${0.15 * opacity})`;
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.moveTo(dots[i].x, dots[i].y);
          ctx.lineTo(dots[j].x, dots[j].y);
          ctx.stroke();
        }
      }
    }
    // Dots
    for (let i = 0; i < dots.length; i++) {
      const d = dots[i];
      d.x += d.vx; d.y += d.vy;
      if (d.x < 0 || d.x > w) d.vx *= -1;
      if (d.y < 0 || d.y > h) d.vy *= -1;
      const grad = ctx.createRadialGradient(d.x, d.y, 0, d.x, d.y, d.r * 2.4);
      grad.addColorStop(0, blue);
      grad.addColorStop(1, lightBlue);
      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.arc(d.x, d.y, d.r, 0, Math.PI * 2);
      ctx.fill();
    }
    requestAnimationFrame(draw);
  }
  draw();

  window.addEventListener('resize', () => {
    w = canvas.width = window.innerWidth;
    h = canvas.height = window.innerHeight;
  });
})();

// Hero typewriter effect (light)
(function typewriter() {
  const el = document.getElementById('typewriter');
  if (!el) return;

  const words = [
    'Technology',
    'Programming',
    'Projects',
    'Artificial intelligence',
    'Science and analytics'
  ];
  let i = 0, txt = '', del = false, char = 0;

  function tick() {
    const target = words[i];
    if (!del) {
      txt = target.slice(0, char++);
      if (char > target.length + 8) del = true; // pause
    } else {
      txt = target.slice(0, char--);
      if (char < 0) { del = false; i = (i + 1) % words.length; }
    }
    el.textContent = txt || ' ';
    const speed = del ? 60 : 90;
    setTimeout(tick, speed);
  }
  tick();
})();

// Premium: Scroll reveal and light "blink"
(function revealAndBlink() {
  const reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const sections = document.querySelectorAll('.reveal');
  if (sections.length) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) {
          e.target.classList.add('show');
        } else {
          e.target.classList.remove('show');
        }
      });
    }, { threshold: 0.12 });
    sections.forEach(s => io.observe(s));
  }

  if (!reduce) {
    const flashables = Array.from(document.querySelectorAll('.list li, .card h3, .typewriter'));
    setInterval(() => {
      const el = flashables[Math.floor(Math.random() * flashables.length)];
      if (!el) return;
      el.classList.add('blink');
      setTimeout(() => el.classList.remove('blink'), 500);
    }, 2200);
  }
})();

// AI assistant chat (client-side, safe): answers based on info about Qaisar
(function aiAssistant() {
  const btn = document.getElementById('ai-assistant-btn');
  const panel = document.getElementById('ai-assistant');
  const close = panel?.querySelector('.close');
  const messages = panel?.querySelector('.ai-messages');
  const form = panel?.querySelector('.ai-input');
  const input = panel?.querySelector('#ai-prompt');

  if (!btn || !panel || !messages || !form || !input) return;

  // Open/close
  btn.addEventListener('click', () => {
    panel.hidden = false;
    panel.classList.add('open');
    input.focus();
  });
  close.addEventListener('click', () => {
    panel.classList.remove('open');
    setTimeout(() => { panel.hidden = true; }, 240);
  });

  // Knowledge base (about you)
  const KB = {
    name: 'Qaisar Zhumabay',
    age: 15,
    grade: '10th grade, Kazakhstan',
    traits: [
      'structured thinking', 'high learning ability', 'turning ideas into results',
      'analytical thinking', 'responsibility', 'result-oriented'
    ],
    techSkills: [
      'Python (games, logic, algorithms)',
      'Web development: HTML, CSS, JavaScript',
      'Node.js', 'Basics of SQL',
      'Databases and Supabase', 'Platform/service logic',
      'UI/UX and product thinking'
    ],
    projects: [
      'Web platforms and interactive services',
      'Game and educational projects in Python',
      'Startup ideas and online platforms',
      'Chatbots (interest in voice interfaces)'
    ],
    weaknesses: [
      'Taking on many tasks at once → improving time planning',
      'High demands on quality → finding a balance between perfection and deadlines',
      'Tendency to do many things alone → developing teamwork/delegation'
    ],
    goalsShort: ['Develop portfolio', 'International programs and internships', 'Deepen programming and analytics'],
    goalsLong: ['International university', 'Technology products with social impact', 'Grow as a professional and entrepreneur in IT'],
    why: 'I am interested in challenging tasks, growth and long-term results. I am open to learning and collaboration in international and professional environments.'
  };

  // Simple search by keywords
  const intents = [
    { keys: ['name', 'what is your name'], fn: () => `My name is: ${KB.name}.` },
    { keys: ['age', 'old are you'], fn: () => `I am ${KB.age} years old.` },
    { keys: ['grade', 'school'], fn: () => `I am in ${KB.grade}.` },
    { keys: ['skill', 'skills', 'tech'], fn: () => `Technical skills: ${KB.techSkills.join('; ')}.` },
    { keys: ['project', 'projects', 'portfolio'], fn: () => `Projects: ${KB.projects.join('; ')}.` },
    { keys: ['weakness', 'weak sides'], fn: () => `Weaknesses: ${KB.weaknesses.join('; ')}.` },
    { keys: ['goal', 'goals'], fn: () => `Short-term: ${KB.goalsShort.join('; ')}. Long-term: ${KB.goalsLong.join('; ')}.` },
    { keys: ['why'], fn: () => KB.why },
    { keys: ['help', 'assistant', 'ai', 'bot'], fn: () => 'I answer based on the information about Qaisar on this site. Try asking: “skills”, “projects”, “goals”.' },
  ];

  function addMessage(text, who = 'assistant') {
    const div = document.createElement('div');
    div.className = `msg ${who}`;
    div.textContent = text;
    messages.appendChild(div);
    messages.scrollTop = messages.scrollHeight;
  }

  function typingSim(text) {
    // Premium light "typing" simulation
    const div = document.createElement('div');
    div.className = 'msg assistant';
    messages.appendChild(div);
    let i = 0;
    const tick = () => {
      div.textContent = text.slice(0, i++);
      messages.scrollTop = messages.scrollHeight;
      if (i <= text.length) setTimeout(tick, 18);
    };
    tick();
  }

  function answer(q) {
    const query = (q || '').toLowerCase();
    for (const intent of intents) {
      if (intent.keys.some(k => query.includes(k))) {
        return intent.fn();
      }
    }
    // If no specific keyword is found — generic answers
    if (query.includes('python')) {
      return 'Python: experience with games, logic and algorithms.';
    }
    if (query.includes('sql') || query.includes('supabase')) {
      return 'Experience with databases and Supabase: storing and retrieving data in projects.';
    }
    if (query.includes('university') || query.includes('education')) {
      return 'Goal: to study at an international university and build technology products.';
    }
    return 'Try making your question more specific: for example, “skills”, “projects”, “goals”, “age”, “why you?”.';
  }

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const q = input.value.trim();
    if (!q) return;
    addMessage(q, 'user');
    input.value = '';
    setTimeout(() => {
      const a = answer(q);
      typingSim(a);
    }, 260);
  });
})();

// Menu: open/close
(function menuToggle() {
  const btn = document.getElementById('menu-toggle');
  const dd = document.getElementById('menu-dropdown');
  if (!btn || !dd) return;

  btn.addEventListener('click', () => {
    const expanded = btn.getAttribute('aria-expanded') === 'true';
    btn.setAttribute('aria-expanded', String(!expanded));
    dd.hidden = expanded;
  });

  // Close when clicking outside
  document.addEventListener('click', (e) => {
    if (!dd.hidden && !e.target.closest('.menu')) {
      dd.hidden = true;
      btn.setAttribute('aria-expanded', 'false');
    }
  });

  // Close when a link is selected
  dd.addEventListener('click', (e) => {
    if (e.target.tagName === 'A') {
      dd.hidden = true;
      btn.setAttribute('aria-expanded', 'false');
    }
  });
})();
