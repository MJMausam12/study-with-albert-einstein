// ===== STUDY WITH ALBERT EINSTEIN — APP LOGIC =====

let soundEnabled = true;
let currentCategory = null;
let currentSet = null;
let quizQuestions = [];
let currentQIndex = 0;
let score = 0;
let answered = false;
let pendingDelete = null;
let pendingExitQuiz = false;

// ===== SOUND =====
function playSound(id) {
  if (!soundEnabled) return;
  try {
    const s = document.getElementById(id);
    if (s) { s.currentTime = 0; s.play().catch(() => {}); }
  } catch(e) {}
}
function playClick()   { playSound('snd-click'); }
function playCorrect() { playSound('snd-correct'); }
function playWrong()   { playSound('snd-wrong'); }

function toggleSound() {
  soundEnabled = !soundEnabled;
  document.getElementById('sound-btn').textContent = soundEnabled ? '🔊' : '🔇';
  showToast(soundEnabled ? 'Sound ON' : 'Sound OFF');
}

// ===== NAVIGATION =====
function showPage(page) {
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  document.getElementById('page-' + page).classList.add('active');
  document.querySelectorAll('.nav-link').forEach(l => l.classList.remove('active'));
  const navEl = document.getElementById('nav-' + (page === 'admin' ? 'admin' : page));
  if (navEl) navEl.classList.add('active');
  window.scrollTo(0, 0);
  if (page === 'home') updateHomeStats();
  if (page === 'categories') renderCategories();
}

// ===== HOME STATS =====
function updateHomeStats() {
  const qs = getAllQuestions();
  const db = getDB();
  document.getElementById('total-questions').textContent = qs.length;
  document.getElementById('total-cats').textContent = db.categories.length;
  let sets = 0;
  Object.values(db.sets).forEach(s => sets += s.length);
  document.getElementById('total-sets').textContent = sets;
}

// ===== CATEGORIES =====
function renderCategories() {
  const cats = getCategories();
  const grid = document.getElementById('categories-grid');
  grid.innerHTML = '';
  cats.forEach(cat => {
    const qs = getAllQuestions().filter(q => q.category === cat.id);
    const sets = getSetsForCategory(cat.id);
    const card = document.createElement('div');
    card.className = 'cat-card';
    card.innerHTML = `
      <div class="cat-icon">${cat.icon}</div>
      <div class="cat-name">${cat.name}</div>
      <div class="cat-count">${sets.length} sets • ${qs.length} questions</div>
    `;
    card.onclick = () => { playClick(); openCategory(cat); };
    grid.appendChild(card);
  });
}

// ===== SETS =====
function openCategory(cat) {
  currentCategory = cat;
  document.getElementById('sets-title').textContent = cat.icon + ' ' + cat.name;
  document.getElementById('sets-desc').textContent = 'Choose a set to start your quiz';
  const sets = getSetsForCategory(cat.id);
  const grid = document.getElementById('sets-grid');
  grid.innerHTML = '';
  if (sets.length === 0) {
    grid.innerHTML = '<p style="color:var(--text-muted);text-align:center;padding:40px;">No sets available yet. Check back later.</p>';
  } else {
    sets.forEach((setName, idx) => {
      const qs = getQuestions(cat.id, setName);
      const card = document.createElement('div');
      card.className = 'set-card';
      card.innerHTML = `
        <div class="set-number">${idx + 1}</div>
        <div class="set-name">${setName}</div>
        <div class="set-qcount">${qs.length} questions</div>
      `;
      card.onclick = () => { playClick(); startQuiz(cat, setName); };
      grid.appendChild(card);
    });
  }
  showPage('sets');
}

// ===== QUIZ =====
function startQuiz(cat, setName) {
  const qs = getQuestions(cat.id, setName);
  if (qs.length === 0) {
    showToast('No questions in this set yet!', 'warning');
    return;
  }
  currentCategory = cat;
  currentSet = setName;
  quizQuestions = shuffleArray([...qs]);
  currentQIndex = 0;
  score = 0;
  answered = false;
  document.getElementById('quiz-title-bar').textContent = cat.icon + ' ' + setName;
  document.getElementById('q-total').textContent = quizQuestions.length;
  document.getElementById('live-score').textContent = 0;
  showPage('quiz');
  renderQuestion();
}

function shuffleArray(arr) {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

function renderQuestion() {
  answered = false;
  const q = quizQuestions[currentQIndex];
  const total = quizQuestions.length;
  document.getElementById('q-current').textContent = currentQIndex + 1;
  document.getElementById('q-number').textContent = `Question ${currentQIndex + 1}`;
  document.getElementById('q-text').textContent = q.question;
  const pct = ((currentQIndex) / total) * 100;
  document.getElementById('progress-bar').style.width = pct + '%';

  const optGrid = document.getElementById('options-grid');
  optGrid.innerHTML = '';
  const letters = ['A','B','C','D'];
  letters.forEach(letter => {
    const btn = document.createElement('button');
    btn.className = 'option-btn';
    btn.innerHTML = `<span class="opt-letter">${letter}</span><span class="opt-text">${q.options[letter]}</span>`;
    btn.onclick = () => selectAnswer(letter, btn);
    optGrid.appendChild(btn);
  });

  const fb = document.getElementById('q-feedback');
  fb.className = 'q-feedback';
  fb.textContent = '';

  document.getElementById('btn-next').style.display = 'none';
}

function selectAnswer(chosen, btn) {
  if (answered) return;
  answered = true;
  const q = quizQuestions[currentQIndex];
  const correct = q.correct;
  const allBtns = document.querySelectorAll('.option-btn');
  allBtns.forEach(b => b.disabled = true);

  const fb = document.getElementById('q-feedback');

  if (chosen === correct) {
    btn.classList.add('correct');
    score++;
    document.getElementById('live-score').textContent = score;
    fb.className = 'q-feedback correct-fb show';
    fb.textContent = '✅ Correct! ' + (q.explanation || '');
    playCorrect();
  } else {
    btn.classList.add('wrong');
    // Highlight correct
    allBtns.forEach(b => {
      const letter = b.querySelector('.opt-letter').textContent;
      if (letter === correct) b.classList.add('correct');
    });
    fb.className = 'q-feedback wrong-fb show';
    fb.textContent = `❌ Wrong. Correct answer is ${correct}: ${q.options[correct]}. ${q.explanation || ''}`;
    playWrong();
  }

  document.getElementById('btn-next').style.display = 'block';
  document.getElementById('btn-next').textContent =
    currentQIndex + 1 < quizQuestions.length ? 'Next Question →' : 'See Results 🎉';
}

function nextQuestion() {
  playClick();
  currentQIndex++;
  if (currentQIndex >= quizQuestions.length) {
    showResult();
  } else {
    renderQuestion();
  }
}

function showResult() {
  const total = quizQuestions.length;
  const wrong = total - score;
  const pct = Math.round((score / total) * 100);
  document.getElementById('result-percent').textContent = pct + '%';
  document.getElementById('res-correct').textContent = score;
  document.getElementById('res-wrong').textContent = wrong;
  document.getElementById('res-total').textContent = total;
  document.getElementById('progress-bar').style.width = '100%';

  let emoji = '😔', msg = 'Keep practicing! You can do better.';
  if (pct >= 90) { emoji = '🏆'; msg = 'Outstanding! You\'re exam-ready!'; }
  else if (pct >= 75) { emoji = '🎉'; msg = 'Excellent! Great job!'; }
  else if (pct >= 60) { emoji = '👍'; msg = 'Good effort! A little more practice needed.'; }
  else if (pct >= 40) { emoji = '📚'; msg = 'Keep studying. You\'re getting there!'; }

  document.getElementById('result-emoji').textContent = emoji;
  document.getElementById('result-msg').textContent = msg;
  showPage('result');
}

function retryQuiz() {
  playClick();
  startQuiz(currentCategory, currentSet);
}

function confirmExitQuiz() {
  pendingExitQuiz = true;
  openModal('⚠️', 'Exit Quiz?', 'Your progress will be lost. Are you sure?', () => {
    pendingExitQuiz = false;
    showPage('sets');
  });
}

// ===== MODAL =====
let modalCallback = null;
function openModal(icon, title, msg, callback) {
  document.getElementById('modal-icon').textContent = icon;
  document.getElementById('modal-title').textContent = title;
  document.getElementById('modal-msg').textContent = msg;
  modalCallback = callback;
  document.getElementById('modal-overlay').classList.add('open');
}
function closeModal() {
  document.getElementById('modal-overlay').classList.remove('open');
  modalCallback = null;
}
function modalConfirm() {
  closeModal();
  if (modalCallback) modalCallback();
}

// ===== TOAST =====
let toastTimer = null;
function showToast(msg, type = '') {
  const t = document.getElementById('toast');
  t.textContent = msg;
  t.className = 'toast show ' + type;
  if (toastTimer) clearTimeout(toastTimer);
  toastTimer = setTimeout(() => { t.classList.remove('show'); }, 3000);
}

// ===== ADMIN AUTH =====
const ADMIN_CREDS = {
  admin1: 'Mausam@9127',
  admin2: 'Gogoi@7861005'
};
let currentAdmin = null;

function adminLogin() {
  const role = document.getElementById('admin-role').value;
  const pass = document.getElementById('admin-password').value;
  const errEl = document.getElementById('auth-error');

  if (!pass) { errEl.textContent = 'Please enter your password.'; return; }
  if (ADMIN_CREDS[role] !== pass) {
    errEl.textContent = 'Incorrect password. Please try again.';
    document.getElementById('admin-password').value = '';
    return;
  }
  errEl.textContent = '';
  currentAdmin = role;
  document.getElementById('admin-user-label').textContent =
    role === 'admin1' ? '👑 Admin 1 (Full Access)' : '🔒 Admin 2 (Add Only)';

  // Show/hide admin1-only items
  document.querySelectorAll('.admin1-only').forEach(el => {
    el.style.display = role === 'admin1' ? 'block' : 'none';
  });

  showPage('admin');
  adminTab('dashboard');
  populateAdminDropdowns();
  updateDashboard();
  showToast('Welcome, ' + (role === 'admin1' ? 'Admin 1' : 'Admin 2') + '!', 'success');
}

function adminLogout() {
  currentAdmin = null;
  document.getElementById('admin-password').value = '';
  showPage('home');
  showToast('Logged out successfully');
}

function adminTab(tab) {
  document.querySelectorAll('.admin-tab').forEach(t => t.classList.remove('active'));
  document.querySelectorAll('.admin-nav-link').forEach(l => l.classList.remove('active'));
  document.getElementById('admin-tab-' + tab).classList.add('active');
  const tabEl = document.getElementById('tab-' + tab);
  if (tabEl) tabEl.classList.add('active');
  playClick();
  if (tab === 'dashboard') updateDashboard();
  if (tab === 'manage') renderManageList();
  if (tab === 'categories-mgr') renderCatManager();
}

// ===== INIT =====
document.addEventListener('DOMContentLoaded', () => {
  updateHomeStats();
});
