// ===== STUDY WITH ALBERT EINSTEIN — ADMIN LOGIC =====
// Fixed: delete modal works, no naming conflicts, camera OCR feature added

// ===== POPULATE DROPDOWNS =====
function populateAdminDropdowns() {
  const cats = getCategories();
  const selectIds = ['aq-category', 'scan-category', 'cam-category', 'filter-cat', 'set-cat-select'];
  selectIds.forEach(function(id) {
    var el = document.getElementById(id);
    if (!el) return;
    var prev = el.value;
    el.innerHTML = '<option value="">-- Select Category --</option>';
    cats.forEach(function(c) {
      var opt = document.createElement('option');
      opt.value = c.id;
      opt.textContent = c.icon + ' ' + c.name;
      el.appendChild(opt);
    });
    if (prev) el.value = prev;
  });
}

function loadSetsForAdmin() {
  loadSetsFor('aq-category', 'aq-set');
}

function loadSetsFor(catSelectId, setSelectId) {
  var catId = document.getElementById(catSelectId).value;
  var setEl = document.getElementById(setSelectId);
  if (!setEl) return;
  setEl.innerHTML = '<option value="">-- Select Set --</option>';
  if (!catId) return;
  getSetsForCategory(catId).forEach(function(s) {
    var opt = document.createElement('option');
    opt.value = s; opt.textContent = s;
    setEl.appendChild(opt);
  });
}

// ===== ADD QUESTION =====
function submitQuestion() {
  var cat = document.getElementById('aq-category').value;
  var set = document.getElementById('aq-set').value;
  var question = document.getElementById('aq-question').value.trim();
  var a = document.getElementById('aq-a').value.trim();
  var b = document.getElementById('aq-b').value.trim();
  var c = document.getElementById('aq-c').value.trim();
  var d = document.getElementById('aq-d').value.trim();
  var correct = document.getElementById('aq-correct').value;
  var explanation = document.getElementById('aq-explanation').value.trim();
  var msgEl = document.getElementById('aq-msg');

  if (!cat || !set || !question || !a || !b || !c || !d) {
    msgEl.textContent = '⚠️ Please fill in all required fields.';
    msgEl.className = 'form-msg error';
    return;
  }

  var result = addQuestion({ category: cat, set: set, question: question, options: { A: a, B: b, C: c, D: d }, correct: correct, explanation: explanation });

  if (!result.success && result.duplicate) {
    msgEl.textContent = '⚠️ Duplicate Entry! This question already exists.';
    msgEl.className = 'form-msg dup';
    openModal('⚠️', 'Duplicate Entry Detected!', 'A question with the same text already exists in this category. Please check your entries.', null);
    return;
  }

  msgEl.textContent = '✅ Question added successfully!';
  msgEl.className = 'form-msg success';
  showToast('Question added!', 'success');
  playClick();
  clearAddForm();
  updateDashboard();
  setTimeout(function() { msgEl.textContent = ''; }, 3000);
}

function clearAddForm() {
  ['aq-question','aq-a','aq-b','aq-c','aq-d','aq-explanation'].forEach(function(id) {
    document.getElementById(id).value = '';
  });
  document.getElementById('aq-correct').value = 'A';
}

// ===== PASTE TEXT PARSER =====
function parseScanText() {
  var raw = document.getElementById('scan-text-input').value.trim();
  var cat = document.getElementById('scan-category').value;
  var set = document.getElementById('scan-set').value;
  if (!raw) { showToast('Please paste some text first!', 'warning'); return; }
  if (!cat || !set) { showToast('Please select category and set first!', 'warning'); return; }
  var parsed = parseQAText(raw);
  if (parsed.length === 0) {
    showToast('No questions detected. Check the format.', 'error');
    document.getElementById('scan-preview').innerHTML =
      '<div style="color:var(--wrong);margin-top:16px;padding:16px;background:rgba(239,68,68,0.1);border-radius:10px;">' +
      '<strong>Could not detect questions.</strong><br><br>' +
      '<small>Expected format:<br>1. Question text?<br>A) Option A &nbsp; B) Option B &nbsp; C) Option C &nbsp; D) Option D<br>Answer: B</small></div>';
    return;
  }
  renderScanPreview(parsed, cat, set, 'scan-preview');
}

function parseQAText(text) {
  var results = [];
  var blocks = text.split(/\n(?=\s*(?:Q?\.?\s*)?\d+[\.\)]\s)/i).filter(function(b) { return b.trim(); });
  if (blocks.length <= 1) {
    // Try splitting differently if no numbered blocks detected
    blocks = text.split(/\n\n+/).filter(function(b) { return b.trim(); });
  }

  blocks.forEach(function(block) {
    var lines = block.split('\n').map(function(l) { return l.trim(); }).filter(function(l) { return l; });
    if (!lines.length) return;
    var qLine = lines[0].replace(/^\s*Q?\.?\s*\d+[\.\)]\s*/i, '').trim();
    if (!qLine || qLine.length < 5) return;

    var opts = { A: '', B: '', C: '', D: '' };
    var answerLine = '';

    lines.slice(1).forEach(function(line) {
      // Answer line
      var matchAns = line.match(/^(?:ans(?:wer)?|correct|ans\.?)[:\s]+([A-Da-d])\b/i);
      if (matchAns) { answerLine = matchAns[1].toUpperCase(); return; }
      // Options on one line: A) x  B) y  C) z  D) w
      var inlineMatch = line.match(/A[)\.]\s*(.+?)\s{2,}B[)\.]\s*(.+?)\s{2,}C[)\.]\s*(.+?)\s{2,}D[)\.]\s*(.+)/i);
      if (inlineMatch) { opts.A = inlineMatch[1].trim(); opts.B = inlineMatch[2].trim(); opts.C = inlineMatch[3].trim(); opts.D = inlineMatch[4].trim(); return; }
      // Single option per line
      var singleOpt = line.match(/^([A-Da-d])[)\.\s]\s*(.+)/);
      if (singleOpt) { opts[singleOpt[1].toUpperCase()] = singleOpt[2].trim(); }
    });

    if (qLine && opts.A && opts.B && opts.C && opts.D && answerLine) {
      results.push({ question: qLine, options: opts, correct: answerLine, explanation: '' });
    }
  });
  return results;
}

function renderScanPreview(items, cat, set, previewId) {
  var preview = document.getElementById(previewId);
  if (!items.length) { preview.innerHTML = ''; return; }

  var html = '<h3 style="margin:20px 0 12px;color:var(--accent2);">📋 ' + items.length + ' Question(s) Detected — Preview & Edit</h3>';

  items.forEach(function(item, idx) {
    html += '<div class="scan-q-item" id="' + previewId + '-item-' + idx + '">' +
      '<h4 style="color:var(--accent);margin-bottom:12px;">Question ' + (idx+1) + '</h4>' +
      '<div class="form-group"><label>Question Text</label>' +
      '<textarea class="form-control" id="' + previewId + '-q-' + idx + '" rows="2">' + escHtml(item.question) + '</textarea></div>' +
      '<div style="display:grid;grid-template-columns:1fr 1fr;gap:10px;margin-bottom:10px;">' +
      '<div class="form-group"><label>A</label><input class="form-control" id="' + previewId + '-a-' + idx + '" value="' + escHtml(item.options.A) + '"/></div>' +
      '<div class="form-group"><label>B</label><input class="form-control" id="' + previewId + '-b-' + idx + '" value="' + escHtml(item.options.B) + '"/></div>' +
      '<div class="form-group"><label>C</label><input class="form-control" id="' + previewId + '-c-' + idx + '" value="' + escHtml(item.options.C) + '"/></div>' +
      '<div class="form-group"><label>D</label><input class="form-control" id="' + previewId + '-d-' + idx + '" value="' + escHtml(item.options.D) + '"/></div>' +
      '</div>' +
      '<div style="display:flex;gap:12px;flex-wrap:wrap;">' +
      '<div class="form-group" style="flex:1;min-width:120px;"><label>Correct Answer</label>' +
      '<select class="form-control" id="' + previewId + '-ans-' + idx + '">' +
      ['A','B','C','D'].map(function(l) { return '<option value="' + l + '"' + (item.correct===l?' selected':'') + '>' + l + '</option>'; }).join('') +
      '</select></div>' +
      '<div class="form-group" style="flex:3;min-width:200px;"><label>Explanation (optional)</label>' +
      '<input class="form-control" id="' + previewId + '-exp-' + idx + '" value="' + escHtml(item.explanation || '') + '"/></div>' +
      '</div></div>';
  });

  html += '<div class="scan-actions" style="margin-top:20px;display:flex;gap:12px;flex-wrap:wrap;">' +
    '<button class="btn-primary" onclick="importScanned(' + items.length + ',\'' + cat + '\',\'' + set + '\',\'' + previewId + '\')">✅ Import All Questions</button>' +
    '<button class="btn-secondary" onclick="document.getElementById(\'' + previewId + '\').innerHTML=\'\'">🗑️ Clear Preview</button>' +
    '</div>';

  preview.innerHTML = html;
  preview.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

function importScanned(count, cat, set, previewId) {
  var added = 0, dups = 0, failed = 0;
  for (var i = 0; i < count; i++) {
    var q = document.getElementById(previewId + '-q-' + i);
    var a = document.getElementById(previewId + '-a-' + i);
    var b = document.getElementById(previewId + '-b-' + i);
    var c = document.getElementById(previewId + '-c-' + i);
    var d = document.getElementById(previewId + '-d-' + i);
    var ans = document.getElementById(previewId + '-ans-' + i);
    var exp = document.getElementById(previewId + '-exp-' + i);
    if (!q || !a || !b || !c || !d) { failed++; continue; }
    var qVal = q.value.trim(), aVal = a.value.trim(), bVal = b.value.trim(), cVal = c.value.trim(), dVal = d.value.trim();
    if (!qVal || !aVal || !bVal || !cVal || !dVal) { failed++; continue; }
    var res = addQuestion({ category: cat, set: set, question: qVal, options: { A: aVal, B: bVal, C: cVal, D: dVal }, correct: ans ? ans.value : 'A', explanation: exp ? exp.value.trim() : '' });
    if (res.success) added++;
    else if (res.duplicate) dups++;
  }
  var msg = '✅ ' + added + ' question(s) imported!';
  if (dups > 0) msg += ' ⚠️ ' + dups + ' duplicate(s) skipped.';
  if (failed > 0) msg += ' ❌ ' + failed + ' incomplete entries skipped.';
  showToast(msg, added > 0 ? 'success' : 'warning');
  document.getElementById(previewId).innerHTML = '';
  if (previewId === 'scan-preview') document.getElementById('scan-text-input').value = '';
  if (previewId === 'cam-scan-preview') document.getElementById('ocr-text-output').value = '';
  updateDashboard();
}

function escHtml(str) {
  return (str || '').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
}

// ===== CAMERA OCR =====
var camStream = null;
var camCurrentSource = 'camera';

function setCamSource(source) {
  camCurrentSource = source;
  document.getElementById('btn-src-camera').classList.toggle('active', source === 'camera');
  document.getElementById('btn-src-upload').classList.toggle('active', source === 'upload');
  document.getElementById('cam-live-wrap').style.display = source === 'camera' ? 'block' : 'none';
  document.getElementById('cam-upload-wrap').style.display = source === 'upload' ? 'block' : 'none';
  document.getElementById('cam-preview-wrap').style.display = 'none';
  document.getElementById('ocr-progress-wrap').style.display = 'none';
  document.getElementById('ocr-result-wrap').style.display = 'none';
  document.getElementById('cam-scan-preview').innerHTML = '';
  if (source === 'camera') { startCamera(); }
  else { stopCamera(); }
}

function startCamera() {
  var video = document.getElementById('cam-video');
  document.getElementById('cam-live-wrap').style.display = 'block';
  if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
    navigator.mediaDevices.getUserMedia({ video: { facingMode: { ideal: 'environment' }, width: { ideal: 1280 }, height: { ideal: 720 } } })
      .then(function(stream) {
        camStream = stream;
        video.srcObject = stream;
      })
      .catch(function(err) {
        document.getElementById('cam-live-wrap').innerHTML =
          '<div style="padding:32px;text-align:center;color:var(--wrong);">' +
          '<div style="font-size:2rem;margin-bottom:12px;">📵</div>' +
          '<strong>Camera access denied or not available.</strong><br>' +
          '<small style="color:var(--text-muted)">Please allow camera permission in your browser, or use the "Upload Image" option instead.</small></div>';
        showToast('Camera access denied. Use Upload Image instead.', 'error');
      });
  } else {
    document.getElementById('cam-live-wrap').innerHTML =
      '<div style="padding:32px;text-align:center;color:var(--text-muted);">' +
      '<div style="font-size:2rem;margin-bottom:12px;">❌</div>' +
      'Camera not supported in this browser.<br><small>Please use the Upload Image option.</small></div>';
  }
}

function stopCamera() {
  if (camStream) {
    camStream.getTracks().forEach(function(t) { t.stop(); });
    camStream = null;
  }
  var video = document.getElementById('cam-video');
  if (video) video.srcObject = null;
}

function capturePhoto() {
  var video = document.getElementById('cam-video');
  var canvas = document.getElementById('cam-canvas');
  if (!video || !video.videoWidth) { showToast('Camera not ready yet. Please wait.', 'warning'); return; }
  canvas.width = video.videoWidth;
  canvas.height = video.videoHeight;
  canvas.getContext('2d').drawImage(video, 0, 0);
  var dataUrl = canvas.toDataURL('image/jpeg', 0.9);
  showCapturedPreview(dataUrl);
  stopCamera();
}

function handleImageUpload(event) {
  var file = event.target.files[0];
  if (!file) return;
  if (!file.type.startsWith('image/')) { showToast('Please select a valid image file.', 'error'); return; }
  var reader = new FileReader();
  reader.onload = function(e) {
    showCapturedPreview(e.target.result);
  };
  reader.readAsDataURL(file);
}

function showCapturedPreview(dataUrl) {
  document.getElementById('cam-preview-img').src = dataUrl;
  document.getElementById('cam-preview-wrap').style.display = 'block';
  document.getElementById('ocr-progress-wrap').style.display = 'none';
  document.getElementById('ocr-result-wrap').style.display = 'none';
  document.getElementById('cam-scan-preview').innerHTML = '';
  // hide live/upload panels
  document.getElementById('cam-live-wrap').style.display = 'none';
  document.getElementById('cam-upload-wrap').style.display = 'none';
}

function resetCameraPanel() {
  document.getElementById('cam-preview-wrap').style.display = 'none';
  document.getElementById('ocr-progress-wrap').style.display = 'none';
  document.getElementById('ocr-result-wrap').style.display = 'none';
  document.getElementById('cam-scan-preview').innerHTML = '';
  document.getElementById('ocr-text-output').value = '';
  // Reset file input
  var fi = document.getElementById('img-file-input');
  if (fi) fi.value = '';
  // Restore chosen source
  if (camCurrentSource === 'camera') {
    document.getElementById('cam-live-wrap').style.display = 'block';
    document.getElementById('cam-upload-wrap').style.display = 'none';
    startCamera();
  } else {
    document.getElementById('cam-live-wrap').style.display = 'none';
    document.getElementById('cam-upload-wrap').style.display = 'block';
  }
}

function runOCR() {
  var img = document.getElementById('cam-preview-img').src;
  if (!img || img === window.location.href) { showToast('No image captured.', 'error'); return; }

  document.getElementById('cam-preview-wrap').style.display = 'none';
  document.getElementById('ocr-progress-wrap').style.display = 'block';
  document.getElementById('ocr-result-wrap').style.display = 'none';
  document.getElementById('cam-scan-preview').innerHTML = '';

  var progressText = document.getElementById('ocr-progress-text');
  var progressBar = document.getElementById('ocr-bar');

  // Use Tesseract.js v5
  Tesseract.recognize(img, 'eng', {
    logger: function(m) {
      if (m.status === 'recognizing text') {
        var pct = Math.round((m.progress || 0) * 100);
        progressBar.style.width = pct + '%';
        progressText.textContent = 'Reading text... ' + pct + '%';
      } else {
        progressText.textContent = m.status ? (m.status.charAt(0).toUpperCase() + m.status.slice(1) + '...') : 'Processing...';
      }
    }
  }).then(function(result) {
    var text = result.data.text || '';
    document.getElementById('ocr-progress-wrap').style.display = 'none';
    document.getElementById('ocr-text-output').value = text.trim();
    document.getElementById('ocr-result-wrap').style.display = 'block';
    if (!text.trim()) {
      showToast('No text detected. Try a clearer image.', 'warning');
    } else {
      showToast('Text extracted! Review and parse questions below.', 'success');
    }
  }).catch(function(err) {
    document.getElementById('ocr-progress-wrap').style.display = 'none';
    document.getElementById('cam-preview-wrap').style.display = 'block';
    showToast('OCR failed: ' + (err.message || 'Unknown error'), 'error');
    console.error('OCR Error:', err);
  });
}

function parseOCRText() {
  var cat = document.getElementById('cam-category').value;
  var set = document.getElementById('cam-set').value;
  var text = document.getElementById('ocr-text-output').value.trim();
  if (!cat || !set) { showToast('Please select category and set first!', 'warning'); return; }
  if (!text) { showToast('No text to parse.', 'warning'); return; }
  var parsed = parseQAText(text);
  if (parsed.length === 0) {
    showToast('No questions detected in the extracted text. Try editing it manually.', 'error');
    document.getElementById('cam-scan-preview').innerHTML =
      '<div style="color:var(--wrong);margin-top:16px;padding:16px;background:rgba(239,68,68,0.1);border-radius:10px;">' +
      '<strong>No questions detected.</strong><br><br>' +
      '<small>The OCR text may not follow the expected Q&A format. You can manually edit the text above to match this format:<br><br>' +
      '1. What is the capital of India?<br>A) Mumbai &nbsp; B) Delhi &nbsp; C) Kolkata &nbsp; D) Chennai<br>Answer: B</small></div>';
    return;
  }
  renderScanPreview(parsed, cat, set, 'cam-scan-preview');
}

// ===== DASHBOARD =====
function updateDashboard() {
  var qs = getAllQuestions();
  var db = getDB();
  document.getElementById('dc-questions').textContent = qs.length;
  document.getElementById('dc-cats').textContent = db.categories.length;
  var sets = 0;
  Object.values(db.sets).forEach(function(s) { sets += s.length; });
  document.getElementById('dc-sets').textContent = sets;

  var recent = qs.slice().reverse().slice(0, 10);
  var list = document.getElementById('recent-list');
  list.innerHTML = '';
  if (!recent.length) { list.innerHTML = '<p style="color:var(--text-muted)">No questions yet.</p>'; return; }
  var cats = getCategories();
  recent.forEach(function(q) {
    var cat = cats.find(function(c) { return c.id === q.category; });
    var item = document.createElement('div');
    item.className = 'recent-item';
    item.innerHTML = '<span>' + escHtml(q.question.substring(0,70)) + (q.question.length>70?'...':'') + '</span>' +
      '<span class="ri-cat">' + (cat ? cat.icon + ' ' + cat.name : q.category) + '</span>';
    list.appendChild(item);
  });

  // Sync home page stats
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
  var cats = getCategories();
  var filterCat = document.getElementById('filter-cat');
  var prev = filterCat.value;
  filterCat.innerHTML = '<option value="">All Categories</option>';
  cats.forEach(function(c) {
    var opt = document.createElement('option');
    opt.value = c.id;
    opt.textContent = c.icon + ' ' + c.name;
    filterCat.appendChild(opt);
  });
  if (prev) filterCat.value = prev;
}

function filterQuestions() {
  var catFilter = document.getElementById('filter-cat').value;
  var setEl = document.getElementById('filter-set');
  var prevSet = setEl.value;
  setEl.innerHTML = '<option value="">All Sets</option>';
  if (catFilter) {
    getSetsForCategory(catFilter).forEach(function(s) {
      var opt = document.createElement('option');
      opt.value = s; opt.textContent = s;
      setEl.appendChild(opt);
    });
    if (prevSet) setEl.value = prevSet;
  }
  var setFilter = setEl.value;
  var search = document.getElementById('filter-search').value.toLowerCase();

  var qs = getAllQuestions();
  if (catFilter) qs = qs.filter(function(q) { return q.category === catFilter; });
  if (setFilter) qs = qs.filter(function(q) { return q.set === setFilter; });
  if (search) qs = qs.filter(function(q) { return q.question.toLowerCase().includes(search); });

  var cats = getCategories();
  var list = document.getElementById('manage-list');
  list.innerHTML = '';

  if (!qs.length) {
    list.innerHTML = '<p style="color:var(--text-muted);padding:20px;">No questions found.</p>';
    return;
  }

  qs.forEach(function(q) {
    var cat = cats.find(function(c) { return c.id === q.category; });
    var item = document.createElement('div');
    item.className = 'manage-item';

    var deleteBtn = currentAdmin === 'admin1'
      ? '<button class="btn-del" data-id="' + q.id + '">🗑️ Delete</button>'
      : '';

    item.innerHTML =
      '<div class="mi-content">' +
        '<div class="mi-q">' + escHtml(q.question) + '</div>' +
        '<div class="mi-meta">' +
          '<span class="mi-badge">' + (cat ? cat.icon + ' ' + cat.name : q.category) + '</span>' +
          '<span class="mi-badge">📁 ' + escHtml(q.set) + '</span>' +
          '<span class="mi-badge">✅ ' + q.correct + ': ' + escHtml(q.options[q.correct]) + '</span>' +
        '</div>' +
      '</div>' +
      '<div class="mi-actions">' + deleteBtn + '</div>';

    list.appendChild(item);
  });

  // Attach delete button events AFTER inserting into DOM (avoid inline onclick with special chars)
  list.querySelectorAll('.btn-del[data-id]').forEach(function(btn) {
    btn.addEventListener('click', function() {
      doConfirmDelete(btn.getAttribute('data-id'));
    });
  });
}

function doConfirmDelete(qId) {
  if (currentAdmin !== 'admin1') return;
  openModal('🗑️', 'Delete Question?', 'This action cannot be undone. The question will be permanently deleted.', function() {
    deleteQuestion(qId);
    renderManageList();
    updateDashboard();
    showToast('Question deleted successfully.', 'success');
  });
}

// ===== CATEGORIES MANAGER =====
function renderCatManager() {
  populateAdminDropdowns();
  var cats = getCategories();
  var list = document.getElementById('existing-cats-list');
  list.innerHTML = '';

  cats.forEach(function(cat) {
    var sets = getSetsForCategory(cat.id);
    var item = document.createElement('div');
    item.className = 'cat-mgr-item';

    var setBtns = sets.map(function(s) {
      return '<button class="btn-del" style="font-size:0.75rem;padding:4px 10px;" data-cat="' + cat.id + '" data-set="' + escHtml(s) + '">× ' + escHtml(s) + '</button>';
    }).join('');
    var catDelBtn = currentAdmin === 'admin1'
      ? '<button class="btn-del" style="font-size:0.75rem;" data-delcat="' + cat.id + '">🗑️ Del Category</button>'
      : '';

    item.innerHTML =
      '<div>' +
        '<div class="cat-mgr-item-name">' + cat.icon + ' <strong>' + escHtml(cat.name) + '</strong></div>' +
        '<div class="cat-sets-list">Sets: ' + (sets.length ? escHtml(sets.join(', ')) : 'None') + '</div>' +
      '</div>' +
      '<div style="display:flex;gap:6px;flex-wrap:wrap;align-items:flex-start;">' + setBtns + catDelBtn + '</div>';

    list.appendChild(item);
  });

  // Attach events after DOM insert
  list.querySelectorAll('.btn-del[data-cat]').forEach(function(btn) {
    btn.addEventListener('click', function() {
      doConfirmDeleteSet(btn.getAttribute('data-cat'), btn.getAttribute('data-set'));
    });
  });
  list.querySelectorAll('.btn-del[data-delcat]').forEach(function(btn) {
    btn.addEventListener('click', function() {
      doConfirmDeleteCat(btn.getAttribute('data-delcat'));
    });
  });
}
// Renamed to avoid conflict with data.js addCategory function
function addNewCategory() {
  if (currentAdmin !== 'admin1') return;
  var name = document.getElementById('new-cat-name').value.trim();
  var icon = document.getElementById('new-cat-icon').value.trim() || '📋';
  var msgEl = document.getElementById('cat-msg');
  if (!name) { msgEl.textContent = 'Please enter a category name.'; msgEl.className = 'form-msg error'; return; }
  var id = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
  var ok = addCategory({ id: id, name: name, icon: icon }); // calls data.js addCategory
  if (!ok) { msgEl.textContent = '⚠️ Category already exists!'; msgEl.className = 'form-msg dup'; return; }
  msgEl.textContent = '✅ Category "' + name + '" added!';
  msgEl.className = 'form-msg success';
  document.getElementById('new-cat-name').value = '';
  document.getElementById('new-cat-icon').value = '';
  populateAdminDropdowns();
  renderCatManager();
  setTimeout(function() { msgEl.textContent = ''; }, 3000);
}

// Renamed to avoid conflict
function addNewSet() {
  var catId = document.getElementById('set-cat-select').value;
  var setName = document.getElementById('new-set-name').value.trim();
  var msgEl = document.getElementById('set-msg');
  if (!catId || !setName) { msgEl.textContent = 'Please select category and enter set name.'; msgEl.className = 'form-msg error'; return; }
  var ok = addSetToCategory(catId, setName);
  if (!ok) { msgEl.textContent = '⚠️ Set already exists in this category!'; msgEl.className = 'form-msg dup'; return; }
  msgEl.textContent = '✅ Set "' + setName + '" added!';
  msgEl.className = 'form-msg success';
  document.getElementById('new-set-name').value = '';
  populateAdminDropdowns();
  renderCatManager();
  setTimeout(function() { msgEl.textContent = ''; }, 3000);
}

function doConfirmDeleteCat(catId) {
  if (currentAdmin !== 'admin1') return;
  var cat = getCategories().find(function(c) { return c.id === catId; });
  var catName = cat ? cat.name : catId;
  openModal('🗑️', 'Delete Category?', 'Delete "' + catName + '" and ALL its questions? This cannot be undone.', function() {
    deleteCategory(catId);
    populateAdminDropdowns();
    renderCatManager();
    updateDashboard();
    showToast('Category "' + catName + '" deleted.', 'success');
  });
}

function doConfirmDeleteSet(catId, setName) {
  if (currentAdmin !== 'admin1') return;
  openModal('🗑️', 'Delete Set?', 'Delete set "' + setName + '" and all its questions?', function() {
    deleteSet(catId, setName);
    populateAdminDropdowns();
    renderCatManager();
    updateDashboard();
    showToast('Set "' + setName + '" deleted.', 'success');
  });
            }
