// ===== STUDY WITH ALBERT EINSTEIN — ADMIN LOGIC =====

// ===== DROPDOWNS =====
function populateAdminDropdowns() {
  const cats = getCategories();
  const selects = ['aq-category', 'scan-category', 'filter-cat', 'set-cat-select'];
  selects.forEach(id => {
    const el = document.getElementById(id);
    if (!el) return;
    const prev = el.value;
    el.innerHTML = '<option value="">-- Select Category --</option>';
    cats.forEach(c => {
      const opt = document.createElement('option');
      opt.value = c.id;
      opt.textContent = c.icon + ' ' + c.name;
      el.appendChild(opt);
    });
    if (prev) el.value = prev;
  });

  // Scan set
  document.getElementById('scan-category').addEventListener('change', function() {
    loadSetsFor('scan-category', 'scan-set');
  });
}

function loadSetsForAdmin() {
  loadSetsFor('aq-category', 'aq-set');
}

function loadSetsFor(catSelectId, setSelectId) {
  const catId = document.getElementById(catSelectId).value;
  const setEl = document.getElementById(setSelectId);
  setEl.innerHTML = '<option value="">-- Select Set --</option>';
  if (!catId) return;
  const sets = getSetsForCategory(catId);
  sets.forEach(s => {
    const opt = document.createElement('option');
    opt.value = s;
    opt.textContent = s;
    setEl.appendChild(opt);
  });
}

// ===== ADD QUESTION =====
function submitQuestion() {
  const cat = document.getElementById('aq-category').value;
  const set = document.getElementById('aq-set').value;
  const question = document.getElementById('aq-question').value.trim();
  const a = document.getElementById('aq-a').value.trim();
  const b = document.getElementById('aq-b').value.trim();
  const c = document.getElementById('aq-c').value.trim();
  const d = document.getElementById('aq-d').value.trim();
  const correct = document.getElementById('aq-correct').value;
  const explanation = document.getElementById('aq-explanation').value.trim();

  const msgEl = document.getElementById('aq-msg');

  if (!cat || !set || !question || !a || !b || !c || !d) {
    msgEl.textContent = '⚠️ Please fill in all required fields.';
    msgEl.className = 'form-msg error';
    return;
  }

  const result = addQuestion({ category: cat, set, question, options: { A: a, B: b, C: c, D: d }, correct, explanation });

  if (!result.success && result.duplicate) {
    msgEl.textContent = '⚠️ Duplicate Entry! This question already exists in this category.';
    msgEl.className = 'form-msg dup';
    openModal('⚠️', 'Duplicate Entry!', 'This exact question already exists in the selected category. Please check your entries.', null);
    document.querySelector('#modal-actions .btn-primary') && (document.querySelector('#modal-confirm').style.display = 'none');
    return;
  }

  msgEl.textContent = '✅ Question added successfully!';
  msgEl.className = 'form-msg success';
  showToast('Question added!', 'success');
  playClick();
  clearAddForm();
  updateDashboard();
  setTimeout(() => { msgEl.textContent = ''; }, 3000);
}

function clearAddForm() {
  ['aq-question','aq-a','aq-b','aq-c','aq-d','aq-explanation'].forEach(id => {
    document.getElementById(id).value = '';
  });
  document.getElementById('aq-correct').value = 'A';
}

// ===== SCAN TEXT PARSER =====
function parseScanText() {
  const raw = document.getElementById('scan-text-input').value.trim();
  if (!raw) { showToast('Please paste some text first!', 'warning'); return; }

  const cat = document.getElementById('scan-category').value;
  const set = document.getElementById('scan-set').value;
  if (!cat || !set) { showToast('Please select category and set first!', 'warning'); return; }

  const parsed = parseQAText(raw);
  if (parsed.length === 0) {
    showToast('No questions detected. Check the format.', 'error');
    document.getElementById('scan-preview').innerHTML = `
      <div style="color:var(--wrong);margin-top:16px;">
        <strong>Could not detect questions.</strong><br>
        <small>Expected format:<br>1. Question text?<br>A) Option A  B) Option B  C) Option C  D) Option D<br>Answer: B</small>
      </div>`;
    return;
  }

  renderScanPreview(parsed, cat, set);
}

function parseQAText(text) {
  const results = [];
  // Split by question numbers: 1. or 1) or Q1.
  const blocks = text.split(/\n(?=\s*(?:Q?\.?\s*)?\d+[\.\)]\s)/i).filter(b => b.trim());

  blocks.forEach(block => {
    const lines = block.split('\n').map(l => l.trim()).filter(l => l);
    if (!lines.length) return;

    // Extract question text
    const qLine = lines[0].replace(/^\s*Q?\.?\s*\d+[\.\)]\s*/i, '').trim();
    if (!qLine) return;

    // Find options
    const opts = { A: '', B: '', C: '', D: '' };
    let answerLine = '';

    lines.slice(1).forEach(line => {
      const matchAns = line.match(/^(?:ans(?:wer)?|correct)[:\s]+([A-Da-d])/i);
      if (matchAns) { answerLine = matchAns[1].toUpperCase(); return; }

      // Options on same line: A) x  B) y  C) z  D) w
      const inlineMatch = line.match(/A[)\.]\s*(.+?)\s+B[)\.]\s*(.+?)\s+C[)\.]\s*(.+?)\s+D[)\.]\s*(.+)/i);
      if (inlineMatch) {
        opts.A = inlineMatch[1].trim();
        opts.B = inlineMatch[2].trim();
        opts.C = inlineMatch[3].trim();
        opts.D = inlineMatch[4].trim();
        return;
      }

      // Single option per line: A) ...
      const singleOpt = line.match(/^([A-Da-d])[)\.]\s+(.+)/);
      if (singleOpt) {
        opts[singleOpt[1].toUpperCase()] = singleOpt[2].trim();
        return;
      }
    });

    if (qLine && opts.A && opts.B && opts.C && opts.D && answerLine) {
      results.push({ question: qLine, options: opts, correct: answerLine, explanation: '' });
    }
  });

  return results;
}

function renderScanPreview(items, cat, set) {
  const preview = document.getElementById('scan-preview');
  if (items.length === 0) { preview.innerHTML = ''; return; }

  let html = `<h3 style="margin:20px 0 12px;color:var(--accent2);">📋 ${items.length} Question(s) Detected — Preview & Edit</h3>`;

  items.forEach((item, idx) => {
    html += `
    <div class="scan-q-item" id="scan-item-${idx}">
      <h4>Question ${idx + 1}</h4>
      <div class="form-group"><label>Question Text</label>
        <textarea class="form-control" id="si-q-${idx}" rows="2">${escHtml(item.question)}</textarea></div>
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:10px;margin-bottom:10px;">
        <div class="form-group"><label>A</label><input class="form-control" id="si-a-${idx}" value="${escHtml(item.options.A)}"/></div>
        <div class="form-group"><label>B</label><input class="form-control" id="si-b-${idx}" value="${escHtml(item.options.B)}"/></div>
        <div class="form-group"><label>C</label><input class="form-control" id="si-c-${idx}" value="${escHtml(item.options.C)}"/></div>
        <div class="form-group"><label>D</label><input class="form-control" id="si-d-${idx}" value="${escHtml(item.options.D)}"/></div>
      </div>
      <div class="form-group"><label>Correct Answer</label>
        <select class="form-control" id="si-ans-${idx}">
          ${['A','B','C','D'].map(l => `<option value="${l}" ${item.correct===l?'selected':''}>${l}</option>`).join('')}
        </select></div>
      <div class="form-group"><label>Explanation (optional)</label>
        <input class="form-control" id="si-exp-${idx}" value="${escHtml(item.explanation || '')}"/></div>
    </div>`;
  });

  html += `
    <div class="scan-actions">
      <button class="btn-primary" onclick="importScanned(${items.length},'${cat}','${set}')">✅ Import All Questions</button>
      <button class="btn-secondary" onclick="document.getElementById('scan-preview').innerHTML='';document.getElementById('scan-text-input').value=''">Clear</button>
    </div>`;

  preview.innerHTML = html;
}

function importScanned(count, cat, set) {
  let added = 0, dups = 0;
  for (let i = 0; i < count; i++) {
    const q = document.getElementById(`si-q-${i}`)?.value.trim();
    const a = document.getElementById(`si-a-${i}`)?.value.trim();
    const b = document.getElementById(`si-b-${i}`)?.value.trim();
    const c = document.getElementById(`si-c-${i}`)?.value.trim();
    const d = document.getElementById(`si-d-${i}`)?.value.trim();
    const ans = document.getElementById(`si-ans-${i}`)?.value;
    const exp = document.getElementById(`si-exp-${i}`)?.value.trim();
    if (!q || !a || !b || !c || !d) continue;
    const res = addQuestion({ category: cat, set, question: q, options:{A:a,B:b,C:c,D:d}, correct: ans, explanation: exp||'' });
    if (res.success) added++;
    else if (res.duplicate) dups++;
  }
  let msg = `✅ ${added} question(s) imported!`;
  if (dups > 0) msg += ` ⚠️ ${dups} duplicate(s) skipped.`;
  showToast(msg, added > 0 ? 'success' : 'warning');
  document.getElementById('scan-preview').innerHTML = '';
  document.getElementById('scan-text-input').value = '';
  updateDashboard();
}

function escHtml(str) {
  return (str || '').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
}

// ===== DASHBOARD =====
function updateDashboard() {
  const qs = getAllQuestions();
  const db = getDB();
  document.getElementById('dc-questions').textContent = qs.length;
  document.getElementById('dc-cats').textContent = db.categories.length;
  let sets = 0;
  Object.values(db.sets).forEach(s => sets += s.length);
  document.getElementById('dc-sets').textContent = sets;

  // Recent 10
  const recent = [...qs].reverse().slice(0, 10);
  const list = document.getElementById('recent-list');
  list.innerHTML = '';
  if (recent.length === 0) { list.innerHTML = '<p style="color:var(--text-muted)">No questions yet.</p>'; return; }
  const cats = getCategories();
  recent.forEach(q => {
    const cat = cats.find(c => c.id === q.category);
    const item = document.createElement('div');
    item.className = 'recent-item';
    item.innerHTML = `<span>${q.question.substring(0,70)}${q.question.length>70?'...':''}</span>
      <span class="ri-cat">${cat ? cat.icon + ' ' + cat.name : q.category}</span>`;
    list.appendChild(item);
  });

  // Sync home stats too
  document.getElementById('total-questions').textContent = qs.length;
  document.getElementById('total-cats').textContent = db.categories.length;
  document.getElementById('total-sets').textContent = sets;
}

// ===== MANAGE QUESTIONS =====
function renderManageList() {
  populateFilterDropdowns();
  filterQuestions();
}

function populateFilterDropdowns() {
  const cats = getCategories();
  const filterCat = document.getElementById('filter-cat');
  const prev = filterCat.value;
  filterCat.innerHTML = '<option value="">All Categories</option>';
  cats.forEach(c => {
    const opt = document.createElement('option');
    opt.value = c.id;
    opt.textContent = c.icon + ' ' + c.name;
    filterCat.appendChild(opt);
  });
  if (prev) filterCat.value = prev;
}

function filterQuestions() {
  const catFilter = document.getElementById('filter-cat').value;
  const setFilter = document.getElementById('filter-set').value;
  const search = document.getElementById('filter-search').value.toLowerCase();

  // Update sets dropdown
  const setEl = document.getElementById('filter-set');
  const prevSet = setEl.value;
  setEl.innerHTML = '<option value="">All Sets</option>';
  if (catFilter) {
    getSetsForCategory(catFilter).forEach(s => {
      const opt = document.createElement('option');
      opt.value = s; opt.textContent = s;
      setEl.appendChild(opt);
    });
    if (prevSet) setEl.value = prevSet;
  }

  let qs = getAllQuestions();
  if (catFilter) qs = qs.filter(q => q.category === catFilter);
  if (setFilter) qs = qs.filter(q => q.set === setFilter);
  if (search) qs = qs.filter(q => q.question.toLowerCase().includes(search));

  const cats = getCategories();
  const list = document.getElementById('manage-list');
  list.innerHTML = '';

  if (qs.length === 0) {
    list.innerHTML = '<p style="color:var(--text-muted);padding:20px;">No questions found.</p>';
    return;
  }

  qs.forEach(q => {
    const cat = cats.find(c => c.id === q.category);
    const item = document.createElement('div');
    item.className = 'manage-item';
    item.innerHTML = `
      <div class="mi-content">
        <div class="mi-q">${escHtml(q.question)}</div>
        <div class="mi-meta">
          <span class="mi-badge">${cat ? cat.icon + ' ' + cat.name : q.category}</span>
          <span class="mi-badge">📁 ${q.set}</span>
          <span class="mi-badge">✅ ${q.correct}: ${escHtml(q.options[q.correct])}</span>
        </div>
      </div>
      <div class="mi-actions">
        ${currentAdmin === 'admin1' ? `<button class="btn-del" onclick="confirmDelete('${q.id}')">🗑️ Delete</button>` : ''}
      </div>`;
    list.appendChild(item);
  });
}

function confirmDelete(qId) {
  if (currentAdmin !== 'admin1') return;
  openModal('🗑️', 'Delete Question?', 'This action cannot be undone. The question will be permanently deleted.', () => {
    deleteQuestion(qId);
    renderManageList();
    updateDashboard();
    showToast('Question deleted.', 'success');
  });
}

// ===== CATEGORIES MANAGER =====
function renderCatManager() {
  populateAdminDropdowns();
  const cats = getCategories();
  const list = document.getElementById('existing-cats-list');
  list.innerHTML = '';

  cats.forEach(cat => {
    const sets = getSetsForCategory(cat.id);
    const item = document.createElement('div');
    item.className = 'cat-mgr-item';
    item.innerHTML = `
      <div>
        <div class="cat-mgr-item-name">${cat.icon} <strong>${cat.name}</strong></div>
        <div class="cat-sets-list">Sets: ${sets.length > 0 ? sets.join(', ') : 'None'}</div>
      </div>
      <div style="display:flex;gap:6px;flex-wrap:wrap">
        ${sets.map(s => `<button class="btn-del" style="font-size:0.75rem;padding:4px 8px;" onclick="confirmDeleteSet('${cat.id}','${s.replace(/'/g,"\\'")}')">×${s}</button>`).join('')}
        ${currentAdmin === 'admin1' ? `<button class="btn-del" onclick="confirmDeleteCat('${cat.id}')">🗑️ Cat</button>` : ''}
      </div>`;
    list.appendChild(item);
  });
}

function addCategory() {
  if (currentAdmin !== 'admin1') return;
  const name = document.getElementById('new-cat-name').value.trim();
  const icon = document.getElementById('new-cat-icon').value.trim() || '📋';
  const msgEl = document.getElementById('cat-msg');
  if (!name) { msgEl.textContent = 'Please enter a category name.'; msgEl.className = 'form-msg error'; return; }
  const id = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
  const ok = addCategory_data({ id, name, icon });
  if (!ok) { msgEl.textContent = '⚠️ Category already exists!'; msgEl.className = 'form-msg dup'; return; }
  msgEl.textContent = '✅ Category added!';
  msgEl.className = 'form-msg success';
  document.getElementById('new-cat-name').value = '';
  document.getElementById('new-cat-icon').value = '';
  populateAdminDropdowns();
  renderCatManager();
  setTimeout(() => { msgEl.textContent = ''; }, 3000);
}

function addCategory_data(cat) {
  return addCategory(cat);
}

function addSet() {
  const catId = document.getElementById('set-cat-select').value;
  const setName = document.getElementById('new-set-name').value.trim();
  const msgEl = document.getElementById('set-msg');
  if (!catId || !setName) { msgEl.textContent = 'Please select category and enter set name.'; msgEl.className = 'form-msg error'; return; }
  const ok = addSetToCategory(catId, setName);
  if (!ok) { msgEl.textContent = '⚠️ Set already exists in this category!'; msgEl.className = 'form-msg dup'; return; }
  msgEl.textContent = '✅ Set added!';
  msgEl.className = 'form-msg success';
  document.getElementById('new-set-name').value = '';
  populateAdminDropdowns();
  renderCatManager();
  setTimeout(() => { msgEl.textContent = ''; }, 3000);
}

function confirmDeleteCat(catId) {
  if (currentAdmin !== 'admin1') return;
  const cat = getCategories().find(c => c.id === catId);
  openModal('🗑️', 'Delete Category?', `Delete "${cat ? cat.name : catId}" and ALL its questions? This cannot be undone.`, () => {
    deleteCategory(catId);
    populateAdminDropdowns();
    renderCatManager();
    updateDashboard();
    showToast('Category deleted.', 'success');
  });
}

function confirmDeleteSet(catId, setName) {
  if (currentAdmin !== 'admin1') return;
  openModal('🗑️', 'Delete Set?', `Delete set "${setName}" and all its questions?`, () => {
    deleteSet(catId, setName);
    populateAdminDropdowns();
    renderCatManager();
    updateDashboard();
    showToast('Set deleted.', 'success');
  });
        }
                             
