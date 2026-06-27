var allReports=[];var memberCount=1;
window.addEventListener('DOMContentLoaded',function(){
document.getElementById('contact-date').value=today();
if(!isConfigured){document.getElementById('loading-overlay').style.display='none';document.getElementById('config-modal').style.display='flex';return;}
db.collection('followup_reports').orderBy('submittedAt','desc').onSnapshot(function(snapshot){
allReports=snapshot.docs.map(function(d){var data=d.data();data.id=d.id;return data;});
if(document.getElementById('view-admin').classList.contains('active')){renderAdmin();}
document.getElementById('loading-overlay').style.display='none';
},function(err){console.error(err);showToast('Could not connect to database.',true);document.getElementById('loading-overlay').style.display='none';});
addMemberBlock();});
function switchView(v,btn){if(v==='admin'){var pwd=prompt('Enter admin password:');if(pwd!=='Embrace_global'){showToast('Wrong password.',true);return;}}document.querySelectorAll('.view').forEach(function(el){el.classList.remove('active');});document.querySelectorAll('.tab-btn').forEach(function(el){el.classList.remove('active');});document.getElementById('view-'+v).classList.add('active');btn.classList.add('active');if(v==='admin')renderAdmin();}
function addMemberBlock(){var container=document.getElementById('members-container');var idx=memberCount++;var div=document.createElement('div');div.className='member-block';div.id='member-block-'+idx;div.innerHTML=memberBlockHTML(idx);container.appendChild(div);}
function removeMemberBlock(idx){var el=document.getElementById('member-block-'+idx);if(el)el.remove();}
function memberBlockHTML(i){
return '<div class="member-block-header"><span class="member-block-title">Member '+i+'</span>'+(i>1?'<button class="remove-member-btn" onclick="removeMemberBlock('+i+')">X</button>':'')+'</div>'+
'<div class="form-row"><div class="form-field"><label class="field-label">Member Name</label><input type="text" id="m'+i+'-name" placeholder="Full name"/></div>'+
'<div class="form-field"><label class="field-label">Weeks Followed Up</label><input type="number" id="m'+i+'-weeks" min="1" max="52" placeholder="1, 2, 3..."/></div></div>'+
'<div class="form-field" style="margin-bottom:14px;"><label class="field-label">Integration Status</label>'+
'<div class="radio-group" id="m'+i+'-integration-group">'+
'<label class="radio-pill" onclick="selectPill(this,\'m'+i+'-integration-group\',\'green\')"><input type="radio" name="m'+i+'-integration" value="Fully Integrated"/> Fully Integrated</label>'+
'<label class="radio-pill" onclick="selectPill(this,\'m'+i+'-integration-group\',\'amber\')"><input type="radio" name="m'+i+'-integration" value="In Progress"/> In Progress</label>'+
'<label class="radio-pill" onclick="selectPill(this,\'m'+i+'-integration-group\',\'\')"><input type="radio" name="m'+i+'-integration" value="Not Yet"/> Not Yet</label>'+
'</div></div>'+
'<div class="section-divider">Method of Contact</div>'+
'<div class="radio-group" id="m'+i+'-method-group">'+
'<label class="radio-pill" onclick="selectPill(this,\'m'+i+'-method-group\',\'green\')"><input type="radio" name="m'+i+'-method" value="Phone Call"/> Phone Call</label>'+
'<label class="radio-pill" onclick="selectPill(this,\'m'+i+'-method-group\',\'green\')"><input type="radio" name="m'+i+'-method" value="WhatsApp"/> WhatsApp</label>'+
'<label class="radio-pill" onclick="selectPill(this,\'m'+i+'-method-group\',\'green\')"><input type="radio" name="m'+i+'-method" value="Home Visit"/> Home Visit</label>'+
'<label class="radio-pill" onclick="selectPill(this,\'m'+i+'-method-group\',\'green\')"><input type="radio" name="m'+i+'-method" value="In Person"/> In Person</label>'+
'</div>'+
'<div class="section-divider">Did They Respond?</div>'+
'<div class="radio-group" id="m'+i+'-response-group">'+
'<label class="radio-pill" onclick="selectPill(this,\'m'+i+'-response-group\',\'green\');showCond('+i+',\'responded\')"><input type="radio" name="m'+i+'-responded" value="Yes — Responded"/> Yes</label>'+
'<label class="radio-pill" onclick="selectPill(this,\'m'+i+'-response-group\',\'amber\');showCond('+i+',\'no-response\')"><input type="radio" name="m'+i+'-responded" value="No — No Response"/> No Response</label>'+
'<label class="radio-pill" onclick="selectPill(this,\'m'+i+'-response-group\',\'blue\');showCond('+i+',\'not-around\')"><input type="radio" name="m'+i+'-responded" value="Not Around / Travelling"/> Not Around</label>'+
'<label class="radio-pill" onclick="selectPill(this,\'m'+i+'-response-group\',\'\');showCond('+i+',\'other-church\')"><input type="radio" name="m'+i+'-responded" value="Now Attending Another Church"/> Other Church</label>'+
'</div>'+
'<div class="cond-field" id="m'+i+'-cond-responded">'+
'<div class="form-field" style="margin-bottom:12px;"><label class="field-label">How did it go?</label><textarea id="m'+i+'-convo" placeholder="Their attitude, openness..."></textarea></div>'+
'<div class="response-box"><label class="field-label">Members words</label><textarea id="m'+i+'-words" placeholder="What did they say..."></textarea></div>'+
'<div class="form-field" style="margin-top:12px;"><label class="field-label">Prayer Needs</label><textarea id="m'+i+'-prayer" placeholder="Prayer request..."></textarea></div>'+
'<div class="form-field" style="margin-top:12px;"><label class="field-label">Will they return?</label>'+
'<div class="radio-group" id="m'+i+'-returning-group">'+
'<label class="radio-pill" onclick="selectPill(this,\'m'+i+'-returning-group\',\'green\')"><input type="radio" name="m'+i+'-returning" value="Yes — Confirmed"/> Yes</label>'+
'<label class="radio-pill" onclick="selectPill(this,\'m'+i+'-returning-group\',\'amber\')"><input type="radio" name="m'+i+'-returning" value="Maybe — Unsure"/> Maybe</label>'+
'<label class="radio-pill" onclick="selectPill(this,\'m'+i+'-returning-group\',\'\')"><input type="radio" name="m'+i+'-returning" value="No — Not returning"/> No</label>'+
'</div></div></div>'+
'<div class="cond-field" id="m'+i+'-cond-no-response"></div>'+
'<div class="cond-field" id="m'+i+'-cond-not-around">'+
'<div class="form-row">'+
'<div class="form-field"><label class="field-label">Reason for absence</label><input type="text" id="m'+i+'-absence" placeholder="Travelling, relocated..."/></div>'+
'<div class="form-field"><label class="field-label">Expected return</label><input type="text" id="m'+i+'-return" placeholder="Back in 2 weeks..."/></div>'+
'</div>'+
'<div class="response-box" style="margin-top:10px;"><label class="field-label">What did they say?</label><textarea id="m'+i+'-words-away" placeholder="She said she is in Abuja..."></textarea></div>'+
'</div>'+
'<div class="cond-field" id="m'+i+'-cond-other-church">'+
'<div class="form-row">'+
'<div class="form-field"><label class="field-label">Which church?</label><input type="text" id="m'+i+'-church-name" placeholder="Church name"/></div>'+
'<div class="form-field"><label class="field-label">Open to returning?</label>'+
'<div class="radio-group" id="m'+i+'-open-group" style="margin-top:8px;">'+
'<label class="radio-pill" onclick="selectPill(this,\'m'+i+'-open-group\',\'green\')"><input type="radio" name="m'+i+'-open" value="Yes"/> Yes</label>'+
'<label class="radio-pill" onclick="selectPill(this,\'m'+i+'-open-group\',\'amber\')"><input type="radio" name="m'+i+'-open" value="Maybe"/> Maybe</label>'+
'<label class="radio-pill" onclick="selectPill(this,\'m'+i+'-open-group\',\'\')"><input type="radio" name="m'+i+'-open" value="No"/> No</label>'+
'</div></div></div>'+
'<div class="response-box" style="margin-top:10px;"><label class="field-label">What did they say?</label><textarea id="m'+i+'-words-church" placeholder="He said he joined a church..."></textarea></div>'+
'</div>'+
'<div class="section-divider">Next Steps</div>'+
'<div class="radio-group" id="m'+i+'-next-group">'+
'<label class="radio-pill" onclick="selectPill(this,\'m'+i+'-next-group\',\'green\')"><input type="radio" name="m'+i+'-next" value="Contact again next week"/> Contact again</label>'+
'<label class="radio-pill" onclick="selectPill(this,\'m'+i+'-next-group\',\'amber\')"><input type="radio" name="m'+i+'-next" value="Escalate to Pastor"/> Escalate to Pastor</label>'+
'<label class="radio-pill" onclick="selectPill(this,\'m'+i+'-next-group\',\'blue\')"><input type="radio" name="m'+i+'-next" value="Schedule a visit"/> Schedule visit</label>'+
'<label class="radio-pill" onclick="selectPill(this,\'m'+i+'-next-group\',\'purple\')"><input type="radio" name="m'+i+'-next" value="Connect to cell group"/> Cell group</label>'+
'<label class="radio-pill" onclick="selectPill(this,\'m'+i+'-next-group\',\'\')"><input type="radio" name="m'+i+'-next" value="No further action needed"/> Close</label>'+
'</div>'+
'<div class="form-field" style="margin-top:12px;"><label class="field-label">Officer Suggestion</label><textarea id="m'+i+'-suggestion" placeholder="Assign a mentor, pastoral visit..."></textarea></div>';}
function showCond(idx,type){['responded','no-response','not-around','other-church'].forEach(function(t){var el=document.getElementById('m'+idx+'-cond-'+t);if(el)el.style.display='none';});var target=document.getElementById('m'+idx+'-cond-'+type);if(target)target.style.display='block';}
function selectPill(el,groupId,colorClass){document.querySelectorAll('#'+groupId+' .radio-pill').forEach(function(p){p.classList.remove('selected','green','amber','blue','purple');});el.classList.add('selected');if(colorClass)el.classList.add(colorClass);}
function getVal(id){var el=document.getElementById(id);return el?el.value.trim():'';}
function getRadio(name){var el=document.querySelector('input[name="'+name+'"]:checked');return el?el.value:'';}
function collectMember(idx){
var name=getVal('m'+idx+'-name');
var weeks=parseInt(getVal('m'+idx+'-weeks'))||0;
var method=getRadio('m'+idx+'-method');
var status=getRadio('m'+idx+'-responded');
var integ=getRadio('m'+idx+'-integration');
if(!name){showToast('Member '+idx+': Name required.',true);return null;}
if(!weeks){showToast(name+': Enter weeks.',true);return null;}
if(!method){showToast(name+': Select method.',true);return null;}
if(!status){showToast(name+': Select response.',true);return null;}
if(!integ){showToast(name+': Select integration.',true);return null;}
var words='';
if(status==='Yes — Responded')words=getVal('m'+idx+'-words');
if(status==='Not Around / Travelling')words=getVal('m'+idx+'-words-away');
if(status==='Now Attending Another Church')words=getVal('m'+idx+'-words-church');
return{member:name,weeksCount:weeks,integration:integ,method:method,status:status,memberWords:words,convoNotes:getVal('m'+idx+'-convo'),prayerNoted:getVal('m'+idx+'-prayer'),returning:getRadio('m'+idx+'-returning'),absenceReason:getVal('m'+idx+'-absence'),expectedReturn:getVal('m'+idx+'-return'),otherChurch:getVal('m'+idx+'-church-name'),openReturn:getRadio('m'+idx+'-open'),nextAction:getRadio('m'+idx+'-next'),suggestion:getVal('m'+idx+'-suggestion')};}
function submitReport(){
if(!isConfigured){showToast('Firebase not configured.',true);return;}
var officer=getVal('officer-name');var date=getVal('contact-date');
if(!officer){showToast('Select your name.',true);return;}
if(!date){showToast('Select date.',true);return;}
var blocks=document.querySelectorAll('.member-block');var members=[];
for(var b=0;b<blocks.length;b++){var idx=blocks[b].id.replace('member-block-','');var m=collectMember(idx);if(!m)return;members.push(m);}
var btn=document.getElementById('submit-btn');btn.disabled=true;btn.textContent='Submitting...';
var batch=db.batch();var now=new Date().toISOString();
members.forEach(function(m){var ref=db.collection('followup_reports').doc();var data={officer:officer,date:date,submittedAt:now};Object.keys(m).forEach(function(k){data[k]=m[k];});batch.set(ref,data);});
batch.commit().then(function(){showToast(members.length+' report(s) submitted!');resetForm();}).catch(function(err){console.error(err);showToast('Submission failed.',true);}).finally(function(){btn.disabled=false;btn.textContent='Submit Follow-Up Report';});}
function resetForm(){document.getElementById('officer-name').value='';document.getElementById('contact-date').value=today();document.getElementById('members-container').innerHTML='';memberCount=1;addMemberBlock();}
function renderAdmin(){
var fo=document.getElementById('filter-officer')?document.getElementById('filter-officer').value:'';
var fs=document.getElementById('filter-status')?document.getElementById('filter-status').value:'';
var fi=document.getElementById('filter-integration')?document.getElementById('filter-integration').value:'';
var fq=document.getElementById('filter-search')?document.getElementById('filter-search').value.toLowerCase():'';
var filtered=allReports.filter(function(r){if(fo&&r.officer!==fo)return false;if(fs&&r.status!==fs)return false;if(fi&&r.integration!==fi)return false;if(fq&&r.member.toLowerCase().indexOf(fq)===-1)return false;return true;});
setText('stat-total',allReports.length);
setText('stat-responded',allReports.filter(function(r){return r.status==='Yes — Responded';}).length);
setText('stat-noresp',allReports.filter(function(r){return r.status==='No — No Response';}).length);
setText('stat-other',allReports.filter(function(r){return r.status==='Not Around / Travelling'||r.status==='Now Attending Another Church';}).length);
setText('stat-integrated',allReports.filter(function(r){return r.integration==='Fully Integrated';}).length);
setText('report-count-label',filtered.length+' report(s) shown');
var memberMap={};
allReports.forEach(function(r){var key=r.member.toLowerCase().trim();if(!memberMap[key]||r.submittedAt>memberMap[key].submittedAt)memberMap[key]=r;});
var members=Object.values(memberMap).sort(function(a,b){return(b.weeksCount||0)-(a.weeksCount||0);});
setText('tracker-count',members.length+' member(s)');
var tbody=document.getElementById('tracker-body');
tbody.innerHTML=members.length?members.map(function(r){var wk=r.weeksCount||0;var wkClass=wk>=3?'weeks-3':wk===2?'weeks-2':'weeks-1';var intClass=r.integration==='Fully Integrated'?'tag-integrated':r.integration==='In Progress'?'tag-progress':'tag-not-yet';return'<tr><td><strong>'+r.member+'</strong></td><td style="font-size:12px">'+r.officer+'</td><td><span class="weeks-badge '+wkClass+'">'+wk+'</span></td><td>'+statusBadge(r.status)+'</td><td><span class="integration-tag '+intClass+'">'+(r.integration||'—')+'</span></td><td style="font-size:12px">'+(r.date||'—')+'</td></tr>';}).join(''):'<tr><td colspan="6" class="empty-cell">No members yet</td></tr>';
var list=document.getElementById('reports-list');
if(!filtered.length){list.innerHTML='<div class="empty-state"><div class="icon">📋</div><h3>No reports found</h3></div>';return;}
list.innerHTML=filtered.map(function(r){
var sc=r.status==='Yes — Responded'?'responded':r.status==='No — No Response'?'no-response':r.status==='Not Around / Travelling'?'not-around':'other-church';
var sub=r.submittedAt?new Date(r.submittedAt).toLocaleDateString('en-GB',{day:'numeric',month:'short',year:'numeric'}):'';
var wk=r.weeksCount||'—';
var intClass=r.integration==='Fully Integrated'?'tag-integrated':r.integration==='In Progress'?'tag-progress':'tag-not-yet';
var extra='';
if(r.convoNotes)extra+='<div class="rc-field rc-full"><label>Conversation Notes</label><span>'+r.convoNotes+'</span></div>';
if(r.memberWords)extra+='<div class="rc-member-words">Members Words: '+r.memberWords+'</div>';
if(r.prayerNoted)extra+='<div class="rc-prayer">Prayer Point: '+r.prayerNoted+'</div>';
if(r.returning)extra+='<div class="rc-field"><label>Returning?</label><span>'+r.returning+'</span></div>';
if(r.absenceReason)extra+='<div class="rc-field"><label>Absence</label><span>'+r.absenceReason+'</span></div>';
if(r.otherChurch)extra+='<div class="rc-field"><label>Other Church</label><span>'+r.otherChurch+'</span></div>';
if(r.suggestion)extra+='<div class="rc-suggestion">Suggestion: '+r.suggestion+'</div>';
return'<div class="report-card '+sc+'"><div class="rc-header"><div><div class="rc-member-name">'+r.member+'</div><div class="rc-officer">Officer: '+r.officer+'</div></div>'+
'<div class="rc-badges">'+statusBadge(r.status)+'<span class="weeks-tag">Week '+wk+'</span><span class="integration-tag '+intClass+'">'+(r.integration||'—')+'</span></div>'+
'<div class="rc-date">Contact: '+(r.date||'—')+' | Logged: '+sub+'</div></div>'+
'<div class="rc-body"><div class="rc-field"><label>Method</label><span>'+r.method+'</span></div>'+
'<div class="rc-field"><label>Next Action</label><span>'+(r.nextAction||'—')+'</span></div>'+
'<div class="rc-field"><label>Status</label><span>'+r.status+'</span></div>'+extra+'</div></div>';}).join('');}
function applyFilters(){renderAdmin();}
function exportToCSV(){if(!allReports.length){showToast('No reports.',true);return;}var headers=['Date','Officer','Member','Weeks','Status','Integration','Method','Notes','Words','Prayer','Returning','Absence','Church','Next','Suggestion'];var rows=allReports.map(function(r){return[r.date,r.officer,r.member,r.weeksCount,r.status,r.integration,r.method,r.convoNotes,r.memberWords,r.prayerNoted,r.returning,r.absenceReason,r.otherChurch,r.nextAction,r.suggestion].map(function(v){return'"'+(v||'').toString().replace(/"/g,'""')+'"';});});var csv=[headers.join(',')].concat(rows.map(function(r){return r.join(',');})).join('\n');var blob=new Blob([csv],{type:'text/csv'});var a=document.createElement('a');a.href=URL.createObjectURL(blob);a.download='EGC_Reports_'+today()+'.csv';a.click();}
function setText(id,text){var el=document.getElementById(id);if(el)el.textContent=text;}
function today(){return new Date().toISOString().split('T')[0];}
function statusBadge(s){var map={'Yes — Responded':['status-responded','Responded'],'No — No Response':['status-no-response','No Response'],'Not Around / Travelling':['status-not-around','Not Around'],'Now Attending Another Church':['status-other-church','Other Church']};var pair=map[s]||['status-other-church',s||'—'];return'<span class="rc-status '+pair[0]+'">'+pair[1]+'</span>';}
function showToast(msg,isError){var t=document.getElementById('toast');t.textContent=msg;t.style.background=isError?'#B84040':'var(--green)';t.classList.add('show');setTimeout(function(){t.classList.remove('show');},3500);}
