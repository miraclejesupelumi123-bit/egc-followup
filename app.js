let allReports = [];
let memberCount = 1;

window.addEventListener('DOMContentLoaded', () => {
  document.getElementById('contact-date').value = today();
  if (!isConfigured) {
    document.getElementById('loading-overlay').style.display = 'none';
    document.getElementById('config-modal').style.display = 'flex';
    return;
  }
  db.collection('followup_reports')
    .orderBy('submittedAt', 'desc')
    .onSnapshot(snapshot => {
      allReports = snapshot.docs.map(d => ({ id: d.id, ...d.data() }));
      if (document.getElementById('view-admin').classList.contains('active')) {
        renderAdmin();
      }
      document.getElementById('loading-overlay').style.display = 'none';
    }, err => {
      console.error(err);
      showToast('Could not connect to database. Check your Firebase config.', true);
      document.getElementById('loading-overlay').style.display = 'none';
    });
  addMemberBlock();
});

function switchView(v, btn) {
  document.querySelectorAll('.view').forEach(el => el.classList.remove('active'));
  document.querySelectorAll('.tab-btn').forEach(el => el.classList.remove('active'));
  document.getElementById('view-' + v).classList.add('active');
  btn.classList.add('active');
  if (v === 'admin') renderAdmin();
}

function addMemberBlock() {
  const container = document.getElementById('members-container');
  const idx = memberCount++;
  const div = document.createElement('div');
  div.className = 'member-block';
  div.id = 'member-block-' + idx;
  div.innerHTML = memberBlockHTML(idx);
  container.appendChild(div);
}

function removeMemberBlock(idx) {
  const el = document.getElementById('member-block-' + idx);
  if (el) el.remove();
}

function memberBlockHTML(idx) {
  return '<div class="member-block-header">' +
    '<span class="member-block-title">Member ' + idx + '</span>' +
    (idx > 1 ? '<button class="remove-member-btn" onclick="removeMemberBlock(' + idx + ')">X</button>' : '') +
    '</div>' +
    '<div class="form-row">' +
      '<div class="form-field"><label class="field-label">Member Name</label>' +
      '<input type="text" id="m' + idx + '-name" placeholder="Full name"/></div>' +
      '<div class="form-field"><label class="field-label">Weeks Followed Up</label>' +
      '<input type="number" id="m' + idx + '-weeks" min="1" max="52" placeholder="e.g. 1, 2, 3"/></div>' +
    '</div>' +
    '<div class="form-field" style="margin-bottom:14px;">' +
      '<label class="field-label">Integration Status</label>' +
      '<div class="radio-group" id="m' + idx + '-integration-group">' +
        '<label class="radio-pill" onclick="selectPill(this,\'m' + idx + '-integration-group\',\'green\')"><input type="radio" name="m' + idx + '-integration" value="Fully Integrated"/> Fully Integrated</label>' +
        '<label class="radio-pill" onclick="selectPill(this,\'m' + idx + '-integration-group\',\'amber\')"><input type="radio" name="m' + idx + '-integration" value="In Progress"/> In Progress</label>' +
        '<label class="radio-pill" onclick="selectPill(this,\'m' + idx + '-integration-group\',\'\')"><input type="radio" name="m' + idx + '-integration" value="Not Yet"/> Not Yet</label>' +
      '</div>' +
    '</div>' +
    '<div class="section-divider">Method of Contact</div>' +
    '<div class="radio-group" id="m' + idx + '-method-group">' +
      '<label class="radio-pill" onclick="selectPill(this,\'m' + idx + '-method-group\',\'green\')"><input type="radio" name="m' + idx + '-method" value="Phone Call"/> Phone Call</label>' +
      '<label class="radio-pill" onclick="selectPill(this,\'m' + idx + '-method-group\',\'green\')"><input type="radio" name="m' + idx + '-method" value="WhatsApp"/> WhatsApp</label>' +
      '<label class="radio-pill" onclick="selectPill(this,\'m' + idx + '-method-group\',\'green\')"><input type="radio" name="m' + idx + '-method" value="Home Visit"/> Home Visit</label>' +
      '<label class="radio-pill" onclick="selectPill(this,\'m' + idx + '-method-group\',\'green\')"><input type="radio" name="m' + idx + '-method" value="In Person"/> In Person</label>' +
    '</div>' +
    '<div class="section-divider">Did They Respond?</div>' +
    '<div class="radio-group" id="m' + idx + '-response-group">' +
      '<label class="radio-pill" onclick="selectPill(this,\'m' + idx + '-response-group\',\'green\');showCond(' + idx + ',\'responded\')"><input type="radio" name="m' + idx + '-responded" value="Yes — Responded"/> Yes — Responded</label>' +
      '<label class="radio-pill" onclick="selectPill(this,\'m' + idx + '-response-group\',\'amber\');showCond(' + idx + ',\'no-response\')"><input type="radio" name="m' + idx + '-responded" value="No — No Response"/> No Response</label>' +
      '<label class="radio-pill" onclick="selectPill(this,\'m' + idx + '-response-group\',\'blue\');showCond(' + idx + ',\'not-around\')"><input type="radio" name="m' + idx + '-responded" value="Not Around / Travelling"/> Not Around</label>' +
      '<label class="radio-pill" onclick="selectPill(this,\'m' + idx + '-response-group\',\'\');showCond(' + idx + ',\'other-church\')"><input type="radio" name="m' + idx + '-responded" value="Now Attending Another Church"/> Other Church</label>' +
    '</div>' +
    '<div class="cond-field" id="m' + idx + '-cond-responded">' +
      '<div class="form-field" style="margin-bottom:12px;"><label class="field-label">How did the conversation go?</label>' +
      '<textarea id="m' + idx + '-convo" placeholder="Their attitude, spiritual state, openness..."></textarea></div>' +
      '<div class="response-box"><label class="field-label">Members Response in their own words</label>' +
      '<textarea id="m' + idx + '-words" placeholder="Quote or paraphrase exactly what they said..."></textarea></div>' +
      '<div class="form-field" style="margin-top:12px;"><label class="field-label">Prayer Needs</label>' +
      '<textarea id="m' + idx + '-prayer" placeholder="Any prayer request they mentioned..."></textarea></div>' +
      '<div class="form-field" style="margin-top:12px;"><label class="field-label">Will they return to church?</label>' +
      '<div class="radio-group" id="m' + idx + '-returning-group">' +
        '<label class="radio-pill" onclick="selectPill(this,\'m' + idx + '-returning-group\',\'green\')"><input type="radio" name="m' + idx + '-returning" value="Yes — Confirmed"/> Yes, confirmed</label>' +
        '<label class="radio-pill" onclick="selectPill(this,\'m' + idx + '-returning-group\',\'amber\')"><input type="radio" name="m' + idx + '-returning" value="Maybe — Unsure"/> Maybe</label>' +
        '<label class="radio-pill" onclick="selectPill(this,\'m' + idx + '-returning-group\',\'\')"><input type="radio" name="m' + idx + '-returning" value="No — Not returning"/> Not returning</label>' +
      '</div></div>' +
    '</div>' +
    '<div class="cond-field" id="m' + idx + '-cond-no-response"></div>' +
    '<div class="cond-field" id="m' + idx + '-cond-not-around">' +
      '<div class="form-row">' +
        '<div class="form-field"><label class="field-label">Reason for absence</label>' +
        '<input type="text" id="m' + idx + '-absence" placeholder="e.g. Travelling, relocated..."/></div>' +
        '<div class="form-field"><label class="field-label">Expected return</label>' +
        '<input type="text" id="m' + idx + '-return" placeholder="e.g. Back in 2 weeks..."/></div>' +
      '</div>' +
      '<div class="response-box" style="margin-top:10px;"><label class="field-label">What did they say?</label>' +
      '<textarea id="m' + idx + '-words-away" placeholder="e.g. She said she is in Abuja for work..."></textarea></div>' +
    '</div>' +
    '<div class="cond-field" id="m' + idx + '-cond-other-church">' +
      '<div class="form-row">' +
        '<div class="form-field"><label class="field-label">Which church?</label>' +
        '<input type="text" id="m' + idx + '-church-name" placeholder="Church name if known"/></div>' +
        '<div class="form-field"><label class="field-label">Open to returning to EGC?</label>' +
        '<div class="radio-group" id="m' + idx + '-open-group" style="margin-top:8px;">' +
          '<label class="radio-pill" onclick="selectPill(this,\'m' + idx + '-open-group\',\'green\')"><input type="radio" name="m' + idx + '-open" value="Yes"/> Yes</label>' +
          '<label class="radio-pill" onclick="selectPill(this,\'m' + idx + '-open-group\',\'amber\')"><input type="radio" name="m' + idx + '-open" value="Maybe"/> Maybe</label>' +
          '<label class="radio-pill" onclick="selectPill(this,\'m' + idx + '-open-group\',\'\')"><input type="radio" name="m' + idx + '-open" value="No"/> No</label>' +
        '</div></div>' +
      '</div>' +
      '<div class="response-box" style="margin-top:10px;"><label class="field-label">What did they say?</label>' +
      '<textarea id="m' + idx + '-words-church" placeholder="e.g. He said he joined a church closer to his house..."></textarea></div>' +
    '</div>' +
    '<div class="section-divider">Next Steps</div>' +
    '<div class="radio-group" id="m' + idx + '-next-group">' +
      '<label class="radio-pill" onclick="selectPill(this,\'m' + idx + '-next-group\',\'green\')"><input type="radio" name="m' + idx + '-next" value="Contact again next week"/> Contact again</label>' +
      '<label class="radio-pill" onclick="selectPill(this,\'m' + idx + '-next-group\',\'amber\')"><input type="radio" name="m' + idx + '-next" value="Escalate to Pastor"/> Escalate to Pastor</label>' +
      '<label class="radio-pill" onclick="selectPill(this,\'m' + idx + '-next-group\',\'blue\')"><input type="radio" name="m' + idx + '-next" value="Schedule a visit"/> Schedule visit</label>' +
      '<label class="radio-pill" onclick="selectPill(this,\'m' + idx + '-next-group\',\'purple\')"><input type="radio" name="m' + idx + '-next" value="Connect to cell group"/> Cell group</label>' +
      '<label class="radio-pill" onclick="selectPill(this,\'m' + idx + '-next-group\',\'\')"><input type="radio" name="m' + idx + '-next" value="No further action needed"/> Close</label>' +
    '</div>' +
    '<div class="form-field" style="margin-top:12px;"><label class="field-label">Officer Suggestion</label>' +
    '<textarea id="m' + idx + '-suggestion" placeholder="e.g. Assign a mentor, pastoral visit needed..."></textarea></div>';
}

function showCond(idx, type) {
  ['responded','no-response','not-around','other-church'].forEach(t => {
    const el = document.getElementById('m' + idx + '-cond-' + t);
    if (el) el.style.display = 'none';
  });
  const target = document.getElementById('m' + idx + '-cond-' + type);
  if (target) target.style.display = 'block';
}

function selectPill(el, groupId, colorClass) {
  document.querySelectorAll('#' + groupId + ' .radio-pill').forEach(p => {
    p.classList.remove('selected','green','amber','blue','purple');
  });
  el.classList.add('selected');
  if (colorClass) el.classList.add(colorClass);
}

function collectMember(idx) {
  const name  = val('m' + idx + '-name');
  const weeks = parseInt(val('m' + idx + '-weeks')) || 0;
  const method  = radio('m' + idx + '-method');
  const status  = radio('m' + idx + '-responded');
  const integ   = radio('m' + idx + '-integration');
  if (!name)   { showToast('Member ' + idx + ': Name is required.', true); return null; }
  if (!weeks)  { showToast(name + ': Enter number of weeks.', true); return null; }
  if (!method) { showToast(name + ': Select contact method.', true); return null; }
  if (!status) { showToast(name + ': Select response status.', true); return null; }
  if (!integ)  { showToast(name + ': Select integration status.', true); return null; }
  let memberWords = '';
  if (status === 'Yes — Responded') memberWords = val('m' + idx + '-words');
  if (status === 'Not Around / Travelling') memberWords = val('m' + idx + '-words-away');
  if (status === 'Now Attending Another Church') memberWords = val('m' + idx + '-words-church');
  return {
    member: name, weeksCount: weeks, integration: integ, method, status, memberWords,
    convoNotes: val('m' + idx + '-convo'), prayerNoted: val('m' + idx + '-prayer'),
    returning: radio('m' + idx + '-returning') || '',
    absenceReason: val('m' + idx + '-absence'), expectedReturn: val('m' + idx + '-return'),
    otherChurch: val('m' + idx + '-church-name'), openReturn: radio('m' + idx + '-open') || '',
    nextAction: radio('m' + idx + '-next') || '', suggestion: val('m' + idx + '-suggestion'),
  };
}

async function submitReport() {
  if (!isConfigured) { showToast('Firebase not configured yet.', true); return; }
  const officer = val('officer-name');
  const date = val('contact-date');
  if (!officer) { showToast('Please select your name.', true); return; }
  if (!date) { showToast('Please select the contact date.', true); return; }
  const blocks = document.querySelectorAll('.member-block');
  const members = [];
  for (const block of blocks) {
    const idx = block.id.replace('member-block-','');
    const m = collectMember(idx);
    if (!m) return;
    members.push(m);
  }
  const btn = document.getElementById('submit-btn');
  btn.disabled = true; btn.textContent = 'Submitting...';
  try {
    const batch = db.batch();
    const now = new Date().toISOString();
    members.forEach(m => {
      const ref = db.collection('followup_reports').doc();
      batch.set(ref, { officer, date, submittedAt: now, ...m });
    });
    await batch.commit();
    showToast(members.length + ' report(s) submitted successfully!');
    resetForm();
  } catch (err) {
    console.error(err);
    showToast('Submission failed. Check your connection.', true);
  } finally {
    btn.disabled = false; btn.textContent = 'Submit Follow-Up Report';
  }
}

function resetForm() {
  document.getElementById('officer-name').value = '';
  document.getElementById('contact-date').value = today();
  document.getElementById('members-container').innerHTML = '';
  memberCount = 1;
  addMemberBlock();
}

function renderAdmin() {
  const fo = document.getElementById('filter-officer')?.value || '';
  const fs = document.getElementById('filter-status')?.value || '';
  const fi = document.getElementById('filter-integration')?.value || '';
  const fq = (document.getElementById('filter-search')?.value || '').toLowerCase();
  const filtered = allReports.filter(r => {
    if (fo && r.officer !== fo) return false;
    if (fs && r.status !== fs) return false;
    if (fi && r.integration !== fi) return false;
    if (fq && !r.member.toLowerCase().includes(fq)) return false;
    return true;
  });
  setText('stat-total', allReports.length);
  setText('stat-responded', allReports.filter(r => r.status === 'Yes — Responded').length);
  setText('stat-noresp', allReports.filter(r => r.status === 'No — No Response').length);
  setText('stat-other', allReports.filter(r => ['Not Around / Travelling','Now Attending Another Church'].includes(r.status)).length);
  setText('stat-integrated', allReports.filter(r => r.integration === 'Fully Integrated').length);
  setText('report-count-label', filtered.length + ' report(s) shown');
  const memberMap = {};
  allReports.forEach(r => {
    const key = r.member.toLowerCase().trim();
    if (!memberMap[key] || r.submittedAt > memberMap[key].submittedAt) memberMap[key] = r;
  });
  const members = Object.values(memberMap).sort((a,b) => (b.weeksCount||0) - (a.weeksCount||0));
  setText('tracker-count', members.length + ' member(s)');
  const tbody = document.getElementById('tracker-body');
  tbody.innerHTML = members.length ? members.map(r => {
    const wk = r.weeksCount || 0;
    const wkClass = wk >= 3 ? 'weeks-3' : wk === 2 ? 'weeks-2' : 'weeks-1';
    const intClass = r.integration === 'Fully Integrated' ? 'tag-integrated' : r.integration === 'In Progress' ? 'tag-progress' : 'tag-not-yet';
    return '<tr><td><strong>' + r.member + '</strong></td><td style="font-size:12px;color:var(--mid)">' + r.officer + '</td>' +
      '<td><span class="weeks-badge ' + wkClass + '">' + wk + '</span></td>' +
      '<td>' + statusBadge(r.status) + '</td>' +
      '<td><span class="integration-tag ' + intClass + '">' + (r.integration||'—') + '</span></td>' +
      '<td style="font-size:12px;color:var(--mid)">' + (r.date||'—') + '</td></tr>';
  }).join('') : '<tr><td colspan="6" class="empty-cell">No members yet</td></tr>';
  const list = document.getElementById('reports-list');
  if (!filtered.length) {
    list.innerHTML = '<div class="empty-state"><div class="icon">📋</div><h3>No reports found</h3><p>Reports will appear here in real time.</p></div>';
    return;
  }
  list.innerHTML = filtered.map(r => {
    const sc = statusClass(r.status);
    const sub = r.submittedAt ? new Date(r.submittedAt).toLocaleDateString('en-GB',{day:'numeric',month:'short',year:'numeric'}) : '';
    const wk = r.weeksCount || '—';
    const intClass = r.integration === 'Fully Integrated' ? 'tag-integrated' : r.integration === 'In Progress' ? 'tag-progress' : 'tag-not-yet';
    let extra = '';
    if (r.convoNotes) extra += '<div class="rc-field rc-full"><label>Conversation Notes</label><span>' + r.convoNotes + '</span></div>';
    if (r.memberWords) extra += '<div class="rc-member-words">Member\'s Words: ' + r.memberWords + '</div>';
    if (r.prayerNoted) extra += '<div class="rc-prayer">Prayer Point: ' + r.prayerNoted + '</div>';
    if (r.returning) extra += '<div class="rc-field"><label>Returning?</label><span>' + r.returning + '</span></div>';
    if (r.absenceReason) extra += '<div class="rc-field"><label>Absence Reason</label><span>' + r.absenceReason + '</span></div>';
    if (r.expectedReturn) extra += '<div class="rc-field"><label>Expected Return</label><span>' + r.expectedReturn + '</span></div>';
    if (r.otherChurch) extra += '<div class="rc-field"><label>Other Church</label><span>' + r.otherChurch + '</span></div>';
    if (r.openReturn) extra += '<div class="rc-field"><label>Open to Return?</label><span>' + r.openReturn + '</span></div>';
    if (r.suggestion) extra += '<div class="rc-suggestion">Officer Suggestion: ' + r.suggestion + '</div>';
    return '<div class="report-card ' + sc + '">' +
      '<div class="rc-header"><div><div class="rc-member-name">' + r.member + '</div>' +
      '<div class="rc-officer">Officer: ' + r.officer + '</div></div>' +
      '<div class="rc-badges">' + statusBadge(r.status) +
      '<span class="weeks-tag">Week ' + wk + '</span>' +
      '<span class="integration-tag ' + intClass + '">' + (r.integration||'—') + '</span></div>' +
      '<div class="rc-date">Contact: ' + (r.date||'—') + ' | Logged: ' + sub + '</div></div>' +
      '<div class="rc-body"><div class="rc-field"><label>Method</label><span>' + r.method + '</span></div>' +
      '<div class="rc-field"><label>Next Action</label><span>' + (r.nextAction||'—') + '</span></div>' +
      '<div class="rc-field"><label>Status</label><span>' + r.status + '</span></div>' + extra + '</div></div>';
  }).join('');
}

function applyFilters() { renderAdmin(); }

function exportToCSV() {
  if (!allReports.length) { showToast('No reports to export.', true); return; }
  const headers = ['Date','Officer','Member','Weeks','Status','Integration','Method','Conversation Notes','Member Words','Prayer Point','Returning','Absence Reason','Expected Return','Other Church','Open to Return','Next Action','Suggestion','Submitted At'];
  const rows = allReports.map(r => [r.date,r.officer,r.member,r.weeksCount,r.status,r.integration,r.method,r.convoNotes,r.memberWords,r.prayerNoted,r.returning,r.absenceReason,r.expectedReturn,r.otherChurch,r.openReturn,r.nextAction,r.suggestion,r.submittedAt].map(v => '"' + (v||'').toString().replace(/"/g,'""') + '"'));
  const csv = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
  const blob = new Blob([csv], {type:'text/csv'});
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = 'EGC_Reports_' + today() + '.csv';
  a.click();
}

function val(id) { return (document.getElementById(id)?
.value || '').trim(); }
function radio(name) { return document.querySelector('input[name="' + name + '"]:checked')?.value || ''; }
function setText(id, text) { const el = document.getElementById(id); if (el) el.textContent = text; }
function today() { return new Date().toISOString().split('T')[0]; }
function statusClass(s) {
  if (s === 'Yes — Responded') return 'responded';
  if (s === 'No — No Response') return 'no-response';
  if (s === 'Not Around / Travelling') return 'not-around';
  return 'other-church';
}
function statusBadge(s) {
  var map = {'Yes — Responded':['status-responded','Responded'],'No — No Response':['status-no-response','No Response'],'Not Around / Travelling':['status-not-around','Not Around'],'Now Attending Another Church':['status-other-church','Other Church']};
  var cls = map[s] ? map[s][0] : 'status-other-church';
  var label = map[s] ? map[s][1] : (s||'—');
  return '<span class="rc-status ' + cls + '">' + label + '</span>';
}
function showToast(msg, isError) {
  var t = document.getElementById('toast');
  t.textContent = msg;
  t.style.background = isError ? '#B84040' : 'var(--green)';
  t.classList.add('show');
  setTimeout(function(){ t.classList.remove('show'); }, 3500);
}
