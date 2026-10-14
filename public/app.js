const $ = id => document.getElementById(id);
const CASES_CACHE_KEY = "mysterybox.progress.v1";
const state = { cases: [], caseData: null, game: null, clues: [], activeTab: "dossier", currentClue: null, sound: false, timer: null, hint: null, busy: false, mechanics: {clueCostSeconds:18,clueCostPoints:80}, lastResult:null, storyLog:[], wrongVerdicts:0, storySequence:0 };
let audioContext;
let ambientNodes = null;
let ambientGain = null;
let ambientOscillators = [];

async function enableAmbientAudio(){
 const AudioCtx = window.AudioContext || window.webkitAudioContext;
 if(!AudioCtx) throw new Error("This browser does not support audio playback.");
 audioContext ||= new AudioCtx();
 if(audioContext.state === "suspended") await audioContext.resume();
 if(!ambientNodes){
  ambientGain = audioContext.createGain();
  ambientGain.gain.value = 0;
  ambientGain.connect(audioContext.destination);
  // A quiet, generated noir-style ambient pad; no external audio asset is required.
  [55, 82.41, 110].forEach((frequency,index)=>{
   const oscillator = audioContext.createOscillator();
   const voiceGain = audioContext.createGain();
   oscillator.type = index === 1 ? "triangle" : "sine";
   oscillator.frequency.value = frequency;
   voiceGain.gain.value = index === 0 ? 0.20 : index === 1 ? 0.07 : 0.035;
   oscillator.connect(voiceGain); voiceGain.connect(ambientGain); oscillator.start();
   ambientOscillators.push(oscillator);
  });
  // A quiet, repeating low pulse gives the soundtrack a suspense-thriller heartbeat.
  const pulseOsc=audioContext.createOscillator(),pulseGain=audioContext.createGain(),pulseLfo=audioContext.createOscillator(),pulseDepth=audioContext.createGain();
  pulseOsc.type="sine";pulseOsc.frequency.value=43;pulseGain.gain.value=0.055;
  pulseLfo.type="sine";pulseLfo.frequency.value=1.15;pulseDepth.gain.value=0.035;
  pulseLfo.connect(pulseDepth);pulseDepth.connect(pulseGain.gain);pulseOsc.connect(pulseGain);pulseGain.connect(ambientGain);
  pulseOsc.start();pulseLfo.start();ambientOscillators.push(pulseOsc,pulseLfo);
  ambientNodes = true;
 }
 const now = audioContext.currentTime;
 ambientGain.gain.cancelScheduledValues(now);
 ambientGain.gain.setTargetAtTime(0.12, now, 0.7);
 state.sound = true;
 updateSoundButton();
}
function disableAmbientAudio(){
 state.sound = false;
 if(audioContext && ambientGain){
  const now = audioContext.currentTime;
  ambientGain.gain.cancelScheduledValues(now);
  ambientGain.gain.setTargetAtTime(0, now, 0.12);
 }
 updateSoundButton();
}
function updateSoundButton(){
 const button = $("soundToggle");
 $("soundState").textContent = state.sound ? "ON" : "OFF";
 button.setAttribute("aria-pressed",String(state.sound));
 button.setAttribute("aria-label",state.sound ? "Turn ambient music off" : "Turn ambient music on");
 button.classList.toggle("sound-on",state.sound);
}
function timeOfDay(){
 const n=state.caseData?.number||1;
 return n%4===0?"just after midnight":n%4===1?"late in the evening":n%4===2?"in the last hour before dawn":"well past closing";
}
function buildPrologue(c){
 return `Rain needles the windows of ${c.location}. The street beyond the cordon is empty, every passing headlight briefly turning the wet pavement to silver. Inside, the ordinary details of the room feel staged: a chair left at an angle, a clock that seems too loud, a silence that arrived before the police did. At ${timeOfDay()}, officers were called to investigate ${c.crime.toLowerCase()}. The victim or central subject is ${c.victim}. The first report is careful with facts and evasive about certainty. Your name is on the file now. Until you can explain what happened, every alibi is only a story told by someone who wants to be believed.`;
}
function addStory(heading, body, kind="note"){
 if(!state.storyLog)state.storyLog=[];
 state.storyLog.push({heading,body,kind,stamp:++state.storySequence});
 if(state.storyLog.length>30)state.storyLog=state.storyLog.slice(-30);
 renderStorybook();
}
function clueStory(c){
 const title=String(c.title||"the evidence").toLowerCase();
 const category=String(c.category||"record").toLowerCase();
 const openings=[
  `You angle the desk lamp over ${title}. The room seems to contract around the small detail. At first glance, it is merely ${category}; under closer inspection, it becomes a question no one has answered.`,
  `The seal gives way with a dry crack. Inside, you find ${title}. You write down what is observable first and what it might mean second. A detective who confuses those two things is easy to deceive.`,
  `You return to the scene with fresh eyes. ${title} catches your attention, and the timeline in your notebook suddenly has an uncomfortable gap. Someone's version of events may not survive this detail.`
 ];
 return `${openings[(state.game.unlockedClues.length-1)%openings.length]} ${c.description||""} ${c.detail||""}`;
}
function renderStorybook(){
 const log=$("storyLog"); if(!log||!state.caseData)return;
 // Rebuild the notes DOM only when the actual story entries have changed.
 const entries=state.storyLog||[];
 const signature=JSON.stringify(entries.map(item=>[item.stamp,item.heading,item.body,item.kind]));
 if(signature!==state.storybookRenderSignature){
  const markup=entries.length
   ?entries.map(item=>`<article class="story-entry story-${escapeHtml(item.kind)}"><span class="story-stamp">NOTE ${String(item.stamp).padStart(2,"0")}</span><h4>${escapeHtml(item.heading)}</h4><p>${escapeHtml(item.body)}</p></article>`).join("")
   :'<p class="story-empty">Your notes will appear as the investigation unfolds.</p>';
  log.innerHTML=markup;
  state.storybookRenderSignature=signature;
  log.scrollTop=log.scrollHeight;
 }
 // Case heat is refreshed only when the case is rendered after a meaningful action,
 // never from the countdown interval.
 const opened=state.game?.unlockedClues?.length||0;
 const total=state.caseData.clueCount||4;
 const remaining=state.game?Math.max(0,Math.ceil((state.game.deadline-Date.now())/1000)):720;
 const heat=Math.min(100,Math.round(opened/total*58+(state.wrongVerdicts||0)*13+(remaining<180?(180-remaining)/180*20:0)));
 const fill=$("heatFill"),label=$("heatLabel");
 if(fill&&fill.dataset.heat!==String(heat)){fill.style.width=`${heat}%`;fill.dataset.heat=String(heat);}
 const level=heat<25?"LOW":heat<55?"RISING":heat<80?"HIGH":"CRITICAL";
 if(label&&label.textContent!==level)label.textContent=level;
 if(fill)fill.classList.toggle("heat-critical",heat>=80);
}
function addIncidentPrologue(c){
 state.storyLog=[];
 addStory("Incident report · "+c.location,buildPrologue(c),"prologue");
 addStory("Your first instruction","Keep your conclusions provisional. Read the statements, open the evidence, and record every contradiction before you gather the suspects for a formal verdict.","note");
}
function dialogueFor(s){
 return `“Detective, I understand why you want to speak to me. I have already given the officers my account, but I will say it again. ${s.alibi} I know how that sounds, especially with ${s.profile.toLowerCase()} in the report. But an uncomfortable motive is not the same thing as proof. If you have something that contradicts me, put it on the table.”`;
}

function progressData(){ try{return JSON.parse(localStorage.getItem(CASES_CACHE_KEY)) || {unlocked:[1],completed:{},highScores:{}}}catch{return {unlocked:[1],completed:{},highScores:{}}} }
function saveProgress(data){localStorage.setItem(CASES_CACHE_KEY,JSON.stringify(data))}
function isUnlocked(n){return progressData().unlocked.includes(n)}
function isCompleted(n){return !!progressData().completed[n]}
async function api(url, options={}) {
 const response=await fetch(url,{credentials:"same-origin",headers:{"Content-Type":"application/json",...(options.headers||{})},...options});
 const data=await response.json().catch(()=>({}));
 if(!response.ok) throw new Error(data.error||`Request failed (${response.status})`);
 return data;
}
function escapeHtml(v){return String(v??"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]))}
function toast(msg){const el=$("toast");el.textContent=msg;el.classList.add("show");clearTimeout(toast.t);toast.t=setTimeout(()=>el.classList.remove("show"),3000)}
function playNoise({duration=.12,filterType="lowpass",frequency=900,q=.7,volume=.08,attack=.004,decay=null,pan=0}={}){
 try{
  const Ctx=window.AudioContext||window.webkitAudioContext;if(!Ctx)return;
  const ctx=audioContext||(audioContext=new Ctx());if(ctx.state==="suspended")ctx.resume().catch(()=>{});
  const now=ctx.currentTime,frames=Math.max(1,Math.floor(ctx.sampleRate*duration));
  const buffer=ctx.createBuffer(1,frames,ctx.sampleRate),samples=buffer.getChannelData(0);
  // Shaped noise is used for the physical texture; the filter removes harsh high-frequency hiss.
  for(let i=0;i<frames;i++){const t=i/frames;const envelope=Math.pow(Math.max(0,1-t),decay===null?1.8:decay);samples[i]=(Math.random()*2-1)*envelope;}
  const source=ctx.createBufferSource(),filter=ctx.createBiquadFilter(),gain=ctx.createGain(),panner=ctx.createStereoPanner?ctx.createStereoPanner():null;
  filter.type=filterType;filter.frequency.setValueAtTime(frequency,now);filter.Q.value=q;
  gain.gain.setValueAtTime(.0001,now);gain.gain.exponentialRampToValueAtTime(Math.max(.0002,volume),now+attack);gain.gain.exponentialRampToValueAtTime(.0001,now+duration);
  source.buffer=buffer;source.connect(filter);filter.connect(gain);
  if(panner){panner.pan.value=pan;gain.connect(panner);panner.connect(ctx.destination)}else gain.connect(ctx.destination);
  source.start(now);source.stop(now+duration+.01);
 }catch{}
}
function typewriterClick(){
 // A short, low-pass noise impact with a small resonant body: a mechanical key, not a high-pitched beep.
 playNoise({duration:.075,filterType:"lowpass",frequency:720,q:.85,volume:.12,attack:.002,decay:2.7});
 try{const ctx=audioContext,now=ctx.currentTime,o=ctx.createOscillator(),g=ctx.createGain(),f=ctx.createBiquadFilter();o.type="triangle";o.frequency.setValueAtTime(118,now);o.frequency.exponentialRampToValueAtTime(72,now+.035);f.type="lowpass";f.frequency.value=380;g.gain.setValueAtTime(.065,now);g.gain.exponentialRampToValueAtTime(.0001,now+.055);o.connect(f);f.connect(g);g.connect(ctx.destination);o.start(now);o.stop(now+.06)}catch{}
}
function playPaperRustle(){
 playNoise({duration:.22,filterType:"bandpass",frequency:1450,q:.48,volume:.065,attack:.012,decay:1.1,pan:-.08});
 // A second softer, lower pass adds the weight of a sheet sliding over paper.
 window.setTimeout(()=>playNoise({duration:.14,filterType:"lowpass",frequency:650,q:.55,volume:.026,attack:.008,decay:1.5,pan:.08}),45);
}
function playLockClick(){
 playNoise({duration:.09,filterType:"lowpass",frequency:1100,q:1.1,volume:.14,attack:.001,decay:3});
 try{const ctx=audioContext||(audioContext=new(window.AudioContext||window.webkitAudioContext)());if(ctx.state==="suspended")ctx.resume().catch(()=>{});const now=ctx.currentTime,o=ctx.createOscillator(),g=ctx.createGain(),f=ctx.createBiquadFilter();o.type="sine";o.frequency.setValueAtTime(104,now);o.frequency.exponentialRampToValueAtTime(48,now+.12);f.type="lowpass";f.frequency.value=300;g.gain.setValueAtTime(.17,now);g.gain.exponentialRampToValueAtTime(.0001,now+.16);o.connect(f);f.connect(g);g.connect(ctx.destination);o.start(now);o.stop(now+.17)}catch{}
}
function addActionSfx(kind="typewriter"){
 if(kind==="folder"||kind==="paper"){playPaperRustle();return;}
 if(kind==="lock"){playLockClick();return;}
 if(kind==="stamp"){playStampImpact();return;}
 typewriterClick();
}

function playStampImpact(){
 // Heavy sub-bass impact plus a filtered paper/felt transient.
 playNoise({duration:.16,filterType:"lowpass",frequency:260,q:.7,volume:.20,attack:.001,decay:2.1});
 // Add a low, paper-like secondary thump even when background music is muted.
 try{
  const ctx=audioContext||(audioContext=new(window.AudioContext||window.webkitAudioContext)());
  if(ctx.state==="suspended")ctx.resume().catch(()=>{});
  const now=ctx.currentTime,osc=ctx.createOscillator(),g=ctx.createGain();
  osc.type="sine";osc.frequency.setValueAtTime(58,now);osc.frequency.exponentialRampToValueAtTime(28,now+.34);
  g.gain.setValueAtTime(.42,now);g.gain.exponentialRampToValueAtTime(.001,now+.42);
  osc.connect(g);g.connect(ctx.destination);osc.start(now);osc.stop(now+.44);
 }catch{}
}
function showJusticeStamp(label,onComplete){
 let overlay=document.getElementById("justiceStampOverlay");
 if(overlay)overlay.remove();
 overlay=document.createElement("div");overlay.id="justiceStampOverlay";overlay.className="justice-stamp-overlay";
 overlay.innerHTML=`<div class="justice-stamp-paper"><span>OFFICIAL FINDING</span><strong>${escapeHtml(label)}</strong><small>MYSTERYBOX · INVESTIGATION UNIT</small></div>`;
 document.body.appendChild(overlay);
 window.setTimeout(()=>overlay.classList.add("stamp-landed"),40);
 window.setTimeout(()=>{overlay.classList.add("stamp-fade");window.setTimeout(()=>{overlay.remove();onComplete();},360);},1450);
}
function tone(freq=440,duration=.08){if(!state.sound)return;try{audioContext ||= new(window.AudioContext||window.webkitAudioContext)();const o=audioContext.createOscillator(),g=audioContext.createGain();o.type="sine";o.frequency.value=freq;g.gain.value=.035;o.connect(g);g.connect(audioContext.destination);o.start();g.gain.exponentialRampToValueAtTime(.001,audioContext.currentTime+duration);o.stop(audioContext.currentTime+duration)}catch{}}
function showModal(title,html,action="Understood ↗",cb=closeModal){$("modalTitle").textContent=title;$("modalBody").innerHTML=html;$("modalAction").textContent=action;$("modalAction").onclick=cb;$("modal").classList.remove("hidden")}
function openCasesArchive(){
 const p=progressData();
 const rows=state.cases.map(c=>{
  const unlocked=p.unlocked.includes(c.number),done=Boolean(p.completed[c.number]);
  return `<button class="archive-case ${done?"is-solved":""}" data-archive-case="${c.number}" ${unlocked?"":"disabled"}><span class="archive-case-number">FILE ${String(c.number).padStart(2,"0")}</span><strong>${escapeHtml(c.title)}</strong><span>${unlocked?(done?"SOLVED · REOPEN FILE":"UNLOCKED · OPEN FILE"):"LOCKED · SOLVE PREVIOUS CASE"}</span></button>`;
 }).join("");
 showModal("CASES ARCHIVE",`<p>Choose any file you have unlocked. Reopening a file starts a fresh investigation but keeps your career progress and scores.</p><div class="archive-grid">${rows}</div>`,"Close archive",closeModal);
 document.querySelectorAll("[data-archive-case]").forEach(button=>button.addEventListener("click",()=>{const n=Number(button.dataset.archiveCase);closeModal();startCase(n)}));
}
function showVictoryOverlay(result,debrief){
 const old=document.getElementById("victoryOverlay");if(old)old.remove();
 const n=state.caseData.number,hasNext=n<20,nextLabel=hasNext?"PROCEED TO NEXT CASE":"RETURN TO CASES ARCHIVE";
 const stars=Math.max(0,Math.min(3,result.stars||(result.evidenceComplete?3:2)));
 const time=Math.max(0,Number(result.elapsedSeconds)||0);
 const score=Number(result.score)||0;
 const epilogue=debrief?.explanation||`The evidence has been entered into the official record. ${debrief?.culprit||"The responsible party"} can no longer hide behind the contradictions. Outside, the rain softens against the windows. Another file waits beyond this one.`;
 const overlay=document.createElement("div");overlay.id="victoryOverlay";overlay.className="victory-overlay";overlay.setAttribute("role","dialog");overlay.setAttribute("aria-modal","true");overlay.setAttribute("aria-labelledby","victoryTitle");
 overlay.innerHTML=`<section class="victory-card"><div class="victory-kicker">MYSTERYBOX · CASE FILE ${String(n).padStart(3,"0")}</div><div class="victory-stamp" aria-hidden="true">CASE<br>SOLVED</div><p class="eyebrow">OFFICIAL FINDING · FILE CLOSED</p><h2 id="victoryTitle">The truth leaves a mark.</h2><p class="victory-verdict">${escapeHtml(result.verdictGrade||"CASE CLOSED")}</p><p class="victory-epilogue">${escapeHtml(epilogue)}</p>${debrief?.culprit?`<p class="victory-culprit"><span>RESPONSIBLE PARTY</span><strong>${escapeHtml(debrief.culprit)}</strong></p>`:""}<div class="score-breakdown victory-score"><div><span>FINAL SCORE</span><strong>${score.toLocaleString()}</strong></div><div><span>TIME USED</span><strong>${Math.floor(time/60)}:${String(time%60).padStart(2,"0")}</strong></div><div><span>EVIDENCE MATCHED</span><strong>${Number(result.matchedEvidence)||0}/${Number(result.requiredEvidenceCount)||state.caseData.clueCount}</strong></div><div><span>INVESTIGATION GRADE</span><strong>${"★".repeat(stars)}${"☆".repeat(3-stars)}</strong></div></div><p class="victory-note">${result.evidenceComplete?"Flawless investigation. Every required exhibit supports your conclusion.":"Case closed. Your correct verdict stands; the evidence chain was not complete."} ${hasNext?`File ${String(n+1).padStart(3,"0")} is now unlocked.`:"You have reached the final file in the archive."}</p><button id="proceedNextCase" class="primary-button victory-proceed">${nextLabel} <span>↗</span></button><button id="victoryArchive" class="text-button victory-archive">VIEW CASES ARCHIVE</button></section>`;
 document.body.appendChild(overlay);document.body.classList.add("victory-open");
 const proceed=()=>{overlay.classList.add("victory-closing");playPaperRustle();window.setTimeout(()=>{overlay.remove();document.body.classList.remove("victory-open");if(hasNext)startCase(n+1);else returnToArchive()},220)};
 $("proceedNextCase").onclick=proceed;
 $("victoryArchive").onclick=()=>{overlay.remove();document.body.classList.remove("victory-open");returnToArchive()};
 $("proceedNextCase").focus();
}
async function resetCurrentCase(){
 if(!state.caseData)return;
 const caseNumber=state.caseData.number;
 clearInterval(state.timer);
 state.game=null;state.caseData=null;state.clues=[];state.currentClue=null;state.hint=null;state.lastResult=null;
 state.storyLog=[];state.storySequence=0;state.storybookRenderSignature=null;state.wrongVerdicts=0;state.busy=false;
 addActionSfx("lock");
 await startCase(caseNumber);
 toast("Case reset. The clock and evidence have been restored.");
}
function resetAllProgress(){
 clearInterval(state.timer);
 localStorage.clear();
 state.game=null;state.caseData=null;state.clues=[];state.currentClue=null;state.storyLog=[];state.storySequence=0;state.storybookRenderSignature=null;state.lastResult=null;state.wrongVerdicts=0;
 $("modal").classList.add("hidden");
 $("gameScreen").classList.add("hidden");$("startScreen").classList.remove("hidden");
 updateArchiveStats();renderCaseGrid();
 toast("Progress reset. Your investigation begins again.");
}
function openResetConfirmation(){
 const autoReset=localStorage.getItem("mysterybox.autoResetAfterAllSolved")==="true";
 $("modalTitle").textContent="Full System Reset";
 $("modalBody").innerHTML=`<p><strong>Reset all career progress?</strong></p><p class="reset-warning">This permanently clears all local storage for MysteryBox, including solved cases, scores, unlocked files, pins, and audio preferences. All cases return to their original locked state except Case 01.</p>`;
 $("modalAction").textContent="Reset career progress";
 $("modalAction").onclick=()=>resetAllProgress();
 $("modal").classList.remove("hidden");
}
function closeModal(){$("modal").classList.add("hidden")}
$("modalClose").onclick=closeModal;
$("casesArchive").onclick=openCasesArchive;
$("resetProgress").onclick=openResetConfirmation;
$("resetCurrentCase").onclick=resetCurrentCase;
$("soundToggle").onclick=async()=>{
 const button=$("soundToggle");
 button.disabled=true;
 try{
  if(state.sound){disableAmbientAudio();localStorage.setItem("mysterybox.audioEnabled","false");toast("Ambient music paused.");}
  else {await enableAmbientAudio();localStorage.setItem("mysterybox.audioEnabled","true");toast("Ambient music enabled.");tone(520);}
 }catch(error){
  disableAmbientAudio();
  localStorage.setItem("mysterybox.audioEnabled","false");
  toast(error?.message || "Audio could not start. Click the sound button to try again.");
 }finally{button.disabled=false;}
};
$("homeLink").onclick=e=>{e.preventDefault();returnToArchive()};
$("startCase").onclick=()=>{const p=progressData();const next=Math.max(1,...p.unlocked);startCase(next)};
$("howToPlay").onclick=()=>showModal("HOW TO INVESTIGATE",`<p><b>1. Read the dossier.</b> Establish the timeline and learn each suspect's alibi.</p><p><b>2. Open the mystery boxes.</b> Each box reveals a clue but costs 18 seconds and 80 points.</p><p><b>3. Compare evidence.</b> Find contradictions, not just suspicious motives. Select the culprit and the decisive evidence.</p><p><b>4. Submit your verdict.</b> You have three attempts. Correct verdicts earn a debrief and unlock the next case.</p><p>Progress and stars are saved in this browser. Server-side logic validates the answer.</p>`);
$("exitCase").onclick=returnToArchive;
document.querySelectorAll(".nav-tab").forEach(btn=>btn.onclick=()=>{if(btn.dataset.tab===state.activeTab)return;activateTab(btn.dataset.tab)});

async function init(){
 try{const data=await api("/api/cases");state.cases=data.cases;renderCaseGrid();updateArchiveStats();
 const prior=localStorage.getItem("mysterybox.lastCase");
 // We deliberately return to archive on refresh; a new game starts with a fresh server session.
 }catch(e){$("caseGrid").innerHTML=`<div class="empty-state">Could not load case files. Is the server running? ${escapeHtml(e.message)}</div>`}
}
function renderCaseGrid(){
 const p=progressData();
 $("caseGrid").innerHTML=state.cases.map(c=>{
  const unlocked=p.unlocked.includes(c.number),done=!!p.completed[c.number],high=p.highScores[c.number]||0;
  return `<button class="case-tile ${done?"completed":""}" data-case="${c.number}" ${unlocked?"":"disabled"}><span class="case-number">FILE ${String(c.number).padStart(2,"0")}</span>${!unlocked?'<span class="case-lock">▣</span>':""}<h3>${escapeHtml(c.title)}</h3><span class="case-difficulty">${escapeHtml(c.difficulty)}${done?" · SOLVED":""}</span>${high?`<div class="case-score">${high} PTS</div>`:""}</button>`
 }).join("");
 document.querySelectorAll("[data-case]").forEach(btn=>btn.onclick=()=>startCase(Number(btn.dataset.case)));
}
function detectiveRank(count){
 if(count>=20)return "MASTER SLEUTH";
 if(count>=15)return "CHIEF INSPECTOR";
 if(count>=9)return "SENIOR DETECTIVE";
 if(count>=4)return "JUNIOR INVESTIGATOR";
 return "ROOKIE DETECTIVE";
}
function updateArchiveStats(){
 const p=progressData(),count=Object.keys(p.completed).length,rank=detectiveRank(count);
 $("solvedCount").textContent=`${String(count).padStart(2,"0")} / 20`;
 $("rankLabel").textContent=rank;
 $("rankStatus").textContent=`RANK: ${rank}`;
 $("topStatus").textContent=`${String(count).padStart(2,"0")} / 20 CASES SOLVED`;
}
async function startCase(number){
 clearInterval(state.timer);
 if(!isUnlocked(number)){toast("Solve the previous case to unlock this file.");return}
 const c=state.cases.find(x=>x.number===number);if(!c)return;
 try{
  const data=await api("/api/game/start",{method:"POST",body:JSON.stringify({caseId:c.id})});
  state.caseData=data.case;state.game=data.game;state.mechanics=data.mechanics;state.clues=[];state.currentClue=null;state.hint=null;state.lastResult=null;state.activeTab="dossier";state.wrongVerdicts=0;state.storySequence=0;state.storyLog=[];
  localStorage.setItem("mysterybox.lastCase",String(number));
  $("startScreen").classList.add("hidden");$("gameScreen").classList.remove("hidden");
  document.querySelectorAll(".nav-tab").forEach(b=>b.classList.toggle("active",b.dataset.tab==="dossier"));
  $("sideCaseTitle").textContent=state.caseData.title.toUpperCase();$("sideCaseMeta").textContent=`NO. ${String(number).padStart(3,"0")} / ${state.caseData.difficulty.toUpperCase()}`;$("suspectCount").textContent=String(state.caseData.suspects.length).padStart(2,"0");
  addIncidentPrologue(state.caseData);startTimer();render();tone(330,.15);
 }catch(e){toast(e.message)}
}
function returnToArchive(){clearInterval(state.timer);$("gameScreen").classList.add("hidden");$("startScreen").classList.remove("hidden");state.game=null;state.caseData=null;state.clues=[];state.currentClue=null;state.storyLog=[];state.storySequence=0;state.storybookRenderSignature=null;renderCaseGrid();updateArchiveStats();window.scrollTo({top:0,behavior:"smooth"})}
function startTimer(){
 clearInterval(state.timer);
 state.timer=setInterval(()=>{
  if(!state.game)return;
  const seconds=Math.max(0,Math.ceil((state.game.deadline-Date.now())/1000));
  const timerElement=$("timer");
  if(timerElement)timerElement.textContent=`${String(Math.floor(seconds/60)).padStart(2,"0")}:${String(seconds%60).padStart(2,"0")}`;
  if(seconds<=0){
   clearInterval(state.timer);
   state.game.status="time-up";
   showResult({correct:false,message:"The clock ran out before the verdict could be submitted.",score:0,elapsedSeconds:720,matchedEvidence:0,requiredEvidenceCount:state.caseData.clueCount},null,"time-up");
  }
 },500)
}
function updateHud(){
 if(!state.game)return;const count=state.game.unlockedClues.length,total=state.caseData.clueCount;
 $("clueCount").textContent=`${String(count).padStart(2,"0")}/${String(total).padStart(2,"0")}`;$("progressFill").style.width=`${count/total*100}%`;$("progressText").textContent=`${count} OF ${total} EVIDENCE BOXES OPENED`;$("guesses").textContent=state.game.guessesRemaining;$("score").textContent=state.game.score;
 const sec=Math.max(0,Math.ceil((state.game.deadline-Date.now())/1000));$("timer").textContent=`${String(Math.floor(sec/60)).padStart(2,"0")}:${String(sec%60).padStart(2,"0")}`;
}
function render(){
 if(!state.game)return;updateHud();
 const titles={dossier:"Active case dossier",suspects:"Suspect register",evidence:"Evidence & mystery boxes",accuse:"Submit your verdict"};$("panelTitle").textContent=titles[state.activeTab]||titles.dossier;
 if(state.activeTab==="dossier")renderDossier();if(state.activeTab==="suspects")renderSuspects();if(state.activeTab==="evidence")renderEvidence();if(state.activeTab==="accuse")renderAccusation();renderStorybook();
}
function renderDossier(){
 const c=state.caseData;
 $("panel").innerHTML=`<p class="eyebrow">CHAPTER I · THE CALL</p><p class="panel-intro">${escapeHtml(c.briefing)}</p>
 <article class="prologue-card"><div class="prologue-top"><span>INCIDENT PROLOGUE</span><span>FILE ${String(c.number).padStart(3,"0")} · ${escapeHtml(c.difficulty.toUpperCase())}</span></div>
 <h3>${escapeHtml(c.title)}</h3><p class="prologue-scene">${escapeHtml(buildPrologue(c))}</p>
 <div class="report-divider"></div><p class="report-label">INITIAL POLICE REPORT</p><p>${escapeHtml(c.crime)} · ${escapeHtml(c.location)}</p><p><b>Victim / subject:</b> ${escapeHtml(c.victim)}</p><p>${escapeHtml(c.rules)}</p>
 <div class="dossier-stats"><div class="stat-box"><span>TIME TO VERDICT</span><strong>12:00</strong></div><div class="stat-box"><span>ATTEMPTS</span><strong>03</strong></div><div class="stat-box"><span>SEALED BOXES</span><strong>${c.clueCount}</strong></div><div class="stat-box"><span>DIFFICULTY</span><strong>${escapeHtml(c.difficulty)}</strong></div></div>
 <div class="card-actions"><button class="primary-button" id="openEvidence">Enter the scene ↗</button><button class="secondary-button" id="readStatements">Question the suspects</button></div></article>
 <div class="chapter-note"><span>FIELD NOTE 01</span><p>Do not mistake atmosphere for evidence. The truth will be in the details people forgot to control: a timestamp, a trace, a sentence repeated too quickly.</p></div>`;
 $("openEvidence").onclick=()=>{addStory("The scene","You pull on your gloves and step past the cordon. The sealed boxes are not answers; they are fragments of a story that someone has tried to keep apart.","scene");activateTab("evidence")};
 $("readStatements").onclick=()=>{addStory("Interview room","You ask the witnesses to wait in separate rooms. Their accounts are now part of the record; contradictions will matter more than confidence.","interview");activateTab("suspects")};
}
function renderSuspects(){
 $("panel").innerHTML=`<p class="eyebrow">CHAPTER II · THE WITNESSES</p><p class="panel-intro">The interview room smells of wet wool and old coffee. Each person has rehearsed a version of the night. Read the statements slowly; the way a person explains a gap can matter as much as the gap itself.</p><div class="suspect-grid">${state.caseData.suspects.map((s,i)=>`<article class="suspect-card"><div class="suspect-avatar">${escapeHtml(s.name.split(/\s+/).map(x=>x[0]).join("").slice(0,2))}</div><div class="suspect-role">STATEMENT ${String(i+1).padStart(2,"0")} · ${escapeHtml(s.role)}</div><h3>${escapeHtml(s.name)}</h3><p>${escapeHtml(s.profile)}</p><details class="witness-dialogue" data-witness="${escapeHtml(s.id)}"><summary>Read full testimony ↗</summary><p class="statement dialogue-text">${escapeHtml(dialogueFor(s))}</p><p class="interview-note">DETECTIVE'S NOTE: “An alibi is a claim. Find the record that can confirm or contradict it.”</p></details></article>`).join("")}</div><div class="card-actions"><button class="secondary-button" id="returnDossier">← Return to dossier</button><button class="primary-button" id="inspectStatements">Inspect evidence ↗</button></div>`;
 document.querySelectorAll("[data-witness]").forEach(details=>details.addEventListener("toggle",()=>{if(details.open){const s=state.caseData.suspects.find(x=>x.id===details.dataset.witness);if(s)addStory("Witness statement · "+s.name,`${s.name} leans back, then repeats the alibi: “${s.alibi}” You mark the time and the details that could be checked against physical evidence.`,"interview")}}));
 $("returnDossier").onclick=()=>{activateTab("dossier")};
 $("inspectStatements").onclick=()=>{addStory("Back to the evidence","You leave the interview room without making an arrest. A convincing performance can still be a lie; the scene must speak for itself.","scene");activateTab("evidence")};
}
function renderEvidence(){
 if(state.currentClue){const c=state.currentClue;const important=Boolean(c.isImportant);$("panel").innerHTML=`<div class="clue-detail"><div class="chapter-ribbon">CHAPTER III · THE RECORDS SPEAK</div><div class="evidence-meta">${escapeHtml(c.category)} / ${escapeHtml(c.id.toUpperCase())}</div><div class="big-symbol">⌕</div><h3>${escapeHtml(c.title)}</h3><p class="clue-narration">${escapeHtml(clueStory(c))}</p><p>${escapeHtml(c.description)}</p><div class="detail-note"><b>FORENSIC INTERPRETATION</b><br>${escapeHtml(c.detail)}</div><div class="card-actions"><button class="secondary-button" id="backBoxes">← Back to boxes</button><button class="secondary-button ${important?"important-active":""}" id="pinEvidence" aria-pressed="${important}">${important?"★ Marked important":"⚑ Mark important"}</button></div></div>`;$("backBoxes").onclick=()=>{state.currentClue=null;renderEvidence()};$("pinEvidence").onclick=()=>{c.isImportant=!Boolean(c.isImportant);const pins=JSON.parse(localStorage.getItem("mysterybox.pins")||"[]");const next=c.isImportant?[...new Set([...pins,c.id])]:pins.filter(id=>id!==c.id);localStorage.setItem("mysterybox.pins",JSON.stringify(next));tone(c.isImportant?590:390);toast(c.isImportant?"Evidence marked important.":"Importance removed.");renderEvidence()};return}
 const unlocked=new Set(state.game.unlockedClues);const importantIds=new Set(JSON.parse(localStorage.getItem("mysterybox.pins")||"[]"));
 $("panel").innerHTML=`<p class="panel-intro">Each box holds a record from the scene. Opening one costs <b>${state.mechanics.clueCostSeconds} seconds</b> and <b>${state.mechanics.clueCostPoints} points</b>. Choose carefully, then connect what you find.</p><div class="box-grid">${state.caseData.lockedClues.map((b,i)=>{const opened=unlocked.has(b.id),clue=state.clues.find(x=>x.id===b.id);const important=importantIds.has(b.id);return `<button class="mystery-box ${opened?"opened":""} ${important?"important-evidence":""}" data-box="${b.id}" ${state.game.status!=="playing"?"disabled":""}><div class="box-lid"><span class="box-glyph">${opened?"✧":"◇"}</span></div>${important?'<span class="important-tag">★ IMPORTANT</span>':opened?'<span class="opened-tag">OPENED</span>':`<span class="box-cost">−${state.mechanics.clueCostPoints} PTS</span>`}<div class="box-body"><div class="evidence-meta">BOX ${String(i+1).padStart(2,"0")} · ${escapeHtml(b.category)}</div><h3>${opened?escapeHtml(clue?.title||"Evidence revealed"):"Sealed mystery box"}</h3><p>${opened?"Click to inspect discovered evidence.":"Click to break the seal and inspect this evidence."}</p></div></button>`}).join("")}</div>${state.hint?`<div class="hint-box"><b>FIELD HINT</b><br>${escapeHtml(state.hint)}</div>`:""}<div class="card-actions"><button class="secondary-button" id="requestHint">Request a hint (−100 points)</button><button class="secondary-button" id="goAccuse">Prepare verdict ↗</button></div>`;
 document.querySelectorAll("[data-box]").forEach(btn=>btn.onclick=()=>openBox(btn.dataset.box));
 $("requestHint").onclick=requestHint;$("goAccuse").onclick=()=>{activateTab("accuse")};
}
async function openBox(id){
 if(state.busy)return;state.busy=true;
 try{const wasOpen=state.game.unlockedClues.includes(id);if(!wasOpen){addActionSfx("lock");await new Promise(r=>setTimeout(r,220))}
  const data=await api("/api/game/clue",{method:"POST",body:JSON.stringify({clueId:id})});
  state.game=data.game;state.game.deadline=data.game.deadline;
  const importantIds=new Set(JSON.parse(localStorage.getItem("mysterybox.pins")||"[]"));data.clue.isImportant=importantIds.has(data.clue.id);if(!state.clues.some(c=>c.id===data.clue.id))state.clues.push(data.clue);else{const existing=state.clues.find(c=>c.id===data.clue.id);data.clue.isImportant=Boolean(existing.isImportant);}
  state.currentClue=data.clue;addStory("Evidence recovered · "+data.clue.title,clueStory(data.clue),"evidence");render();addActionSfx("lock");tone(650,.12);
 }catch(e){toast(e.message)}finally{state.busy=false}
}
async function requestHint(){try{const data=await api("/api/game/hint",{method:"POST",body:JSON.stringify({})});state.hint=data.hint;state.game=data.game;render();toast("Hint recorded. −100 points.");tone(380)}catch(e){toast(e.message)}}
function renderAccusation(){
 if(state.game.status!=="playing"){ $("panel").innerHTML=`<div class="empty-state">This case is concluded. Review the case debrief or return to the archive.</div>`;return}
 $("panel").innerHTML=`<p class="eyebrow">CHAPTER IV · THE CONFRONTATION</p><div class="confrontation-intro"><h3>Gather them in the parlor.</h3><p>The room falls quiet as you lay the evidence on the table. The suspect you name will have one final chance to explain the contradictions. Choose carefully: a verdict is a statement you must be able to defend.</p></div><p class="panel-intro">Choose the suspect and the evidence that proves your theory. You can only submit evidence you have opened. You have <b>${state.game.guessesRemaining}</b> verdict attempts remaining.</p><form id="accuseForm" class="accuse-form"><div class="field"><label for="suspect">WHO IS RESPONSIBLE?</label><select id="suspect" name="suspectId" required><option value="">Select a suspect…</option>${state.caseData.suspects.map(s=>`<option value="${escapeHtml(String(s.id))}">${escapeHtml(s.name)} — ${escapeHtml(s.role)}</option>`).join("")}</select></div><div class="field"><label>SELECT SUPPORTING EVIDENCE</label><div class="check-list">${state.clues.length?state.clues.map(c=>`<label><input type="checkbox" name="evidence" value="${c.id}"> ${escapeHtml(c.title)} <span class="muted-inline">(${escapeHtml(c.category)})</span></label>`).join(""):'<p class="error-text">Open at least one mystery box first.</p>'}</div></div><button class="primary-button" type="submit">Submit verdict ↗</button><p id="accuseError" class="error-text" role="alert"></p></form>`;
 $("accuseForm").onsubmit=submitVerdict;
 const suspectSelect=$("suspect");
 suspectSelect.addEventListener("change",()=>{if(suspectSelect.value){$("accuseError").textContent="";suspectSelect.removeAttribute("aria-invalid");}});
}
async function submitVerdict(e){
 e.preventDefault();if(state.busy)return;state.busy=true;
 const form=new FormData(e.currentTarget),suspectId=String(form.get("suspectId")||"").trim(),payload={suspectId,evidenceIds:form.getAll("evidence")},button=e.currentTarget.querySelector('button[type="submit"]');
 const validSuspect=state.caseData.suspects.some(s=>String(s.id)===suspectId);
 if(!validSuspect){state.busy=false;$("accuseError").textContent="Select a valid suspect.";$("suspect").setAttribute("aria-invalid","true");$("suspect").focus();return;}
 $("accuseError").textContent="";$("suspect").removeAttribute("aria-invalid");button.disabled=true;button.textContent="Examining evidence…";
 try{addStory("Formal accusation",`You stand and name ${state.caseData.suspects.find(s=>s.id===suspectId)?.name||"the suspect"}. One by one, you place the selected exhibits before the room. “Here is what the timeline says. Here is what the evidence says. Now explain the difference.”`,"verdict");const data=await api("/api/game/accuse",{method:"POST",body:JSON.stringify(payload)});state.game=data.game;state.lastResult=data;
  if(data.game.status==="won"||data.game.status==="lost"){clearInterval(state.timer);showResult(data.result,data.debrief,data.game.status)}
  else{state.wrongVerdicts=(state.wrongVerdicts||0)+1;addStory("The room turns against your theory",`${data.result.message} A witness looks away. Your theory has not accounted for everything; return to the details before the clock runs down.`,"warning");toast(data.result.message);tone(210,.13);render()}
 }catch(err){if($("accuseError"))$("accuseError").textContent=err.message;toast(err.message)}
 finally{state.busy=false;if($("accuseForm")){const b=$("accuseForm").querySelector('button[type="submit"]');if(b){b.disabled=false;b.textContent="Submit verdict ↗"}}}
}
function showResult(result,debrief,status){
 const won=status==="won"&&result.correct;
 if(won){
  const n=state.caseData.number,p=progressData();p.completed[n]={score:result.score,stars:result.stars||(result.evidenceComplete?3:2),at:new Date().toISOString()};p.highScores[n]=Math.max(p.highScores[n]||0,result.score);if(n<20&&!p.unlocked.includes(n+1))p.unlocked.push(n+1);saveProgress(p);renderCaseGrid();updateArchiveStats();
 }
 const chain=debrief?.chain||[];
 const chainHtml=chain.map(item=>`<div class="debrief-item"><strong>${escapeHtml(item.title)}</strong><p>${escapeHtml(item.explanation)}</p></div>`).join("");
 const html=`<div class="win-mark">${won?"✦":"×"}</div><p class="eyebrow">CHAPTER V · THE RECKONING</p><h3 class="verdict-headline">${won?"The silence breaks.":status==="time-up"?"The last minute slips away.":"The theory collapses."}</h3><p><b>${won?escapeHtml(result.verdictGrade||"Correct verdict. Case closed."):status==="time-up"?"Time expired.":"Case debrief"}</b></p><p>${escapeHtml(won?(result.evidenceComplete?"The room goes still. Every exhibit forms a chain no alibi can break.":"The room goes still. You identified the culprit, though parts of the evidence chain remain unproven."):(result.message||"The case has concluded."))}</p>${debrief?`<p><b>Responsible party:</b> ${escapeHtml(debrief.culprit)}<br><b>Motive:</b> ${escapeHtml(debrief.motive)}</p><p>${escapeHtml(debrief.explanation)}</p><div class="debrief-chain">${chainHtml}</div>`:""}<div class="score-breakdown"><div><span>FINAL SCORE</span><strong>${result.score||0}</strong></div><div><span>TIME USED</span><strong>${Math.floor((result.elapsedSeconds||0)/60)}:${String((result.elapsedSeconds||0)%60).padStart(2,"0")}</strong></div><div><span>CLUES MATCHED</span><strong>${result.matchedEvidence||0}/${result.requiredEvidenceCount||state.caseData.clueCount}</strong></div><div><span>VERDICTS LEFT</span><strong>${result.guessesRemaining??state.game.guessesRemaining}</strong></div></div><p>${won?"Stars earned: "+("★".repeat(result.stars|| (result.evidenceComplete?3:2))+"☆".repeat(3-(result.stars|| (result.evidenceComplete?3:2))))+". "+(result.evidenceComplete?"Flawless Investigation — full score.":"Case Closed — Weak Evidence — 75% score.")+" The next case is now unlocked.":"You can return to the archive and retry this case."}</p>`;
 if(won)addStory("Case closed",`You have named ${debrief?.culprit||"the culprit"} and established the chain of evidence. Outside, the rain has softened to a whisper. The file is closed—but another waits in the archive.`,"resolution");else addStory("Unresolved",`The file remains open. ${debrief?.culprit?`The debrief names ${debrief.culprit}, but the case was not solved in time.`:"The evidence has not yet yielded a defensible verdict."}`,"warning");
 const reveal=()=>showVictoryOverlay(result,debrief);
 if(won){playStampImpact();showJusticeStamp("CASE SOLVED",reveal);}
 else {addActionSfx("typewriter");showModal(status==="time-up"?"TIME EXPIRED":"CASE DEBRIEF",html,"Return to archive",()=>{closeModal();returnToArchive()});}
}
let tabTransitionToken = 0;
function activateTab(tab){
 const panel=$("panel"),current=state.activeTab;
 if(!panel){state.activeTab=tab;return;}
 if(current===tab&&!panel.classList.contains("page-flip-out"))return;
 const token=++tabTransitionToken;
 document.querySelectorAll(".nav-tab").forEach(button=>{
  const active=button.dataset.tab===tab;button.classList.toggle("active",active);button.setAttribute("aria-current",active?"page":"false");
 });
 playPaperRustle();
 // Animate the currently visible page away before changing its contents; this avoids a flash of the new HTML.
 panel.classList.remove("page-flip-in","page-flip-out");
 panel.classList.add("page-flip-out");panel.setAttribute("aria-busy","true");
 window.setTimeout(()=>{
  if(token!==tabTransitionToken)return;
  state.activeTab=tab;state.currentClue=null;
  render();
  panel.classList.remove("page-flip-out");panel.classList.add("page-flip-in");panel.setAttribute("aria-busy","false");
  panel.querySelectorAll(".eyebrow,h2,h3,.prologue-top,.chapter-ribbon").forEach(el=>el.classList.add("folder-stagger-title"));
  panel.querySelectorAll(".prologue-card,.suspect-card,.mystery-box,.clue-detail,.confrontation-intro,.debrief-item,.card-actions").forEach(el=>el.classList.add("folder-stagger-card"));
  const notes=document.querySelector(".casebook");if(notes){notes.classList.remove("casebook-stagger");void notes.offsetWidth;notes.classList.add("casebook-stagger");}
  window.setTimeout(()=>{if(token===tabTransitionToken){panel.classList.remove("page-flip-in");panel.querySelectorAll(".folder-stagger-title,.folder-stagger-card").forEach(el=>el.classList.remove("folder-stagger-title","folder-stagger-card"));}},360);
 },300);
}
// Mechanical button sound is deliberately delegated; page tabs use paper rustle instead.
document.addEventListener("click",event=>{
 const button=event.target.closest("button");if(!button||button.disabled)return;
 if(button.classList.contains("nav-tab")||button.id==="soundToggle")return;
 if(button.id==="proceedNextCase"||button.id==="victoryArchive")return;
 typewriterClick();
},true);

init();
