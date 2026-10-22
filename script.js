const $ = id => document.getElementById(id);
let contacts = JSON.parse(localStorage.getItem("rb_pro_contacts") || "null") || [
  {id:1,name:"Trusted Contact 1",phone:"Demo contact — edit later"},
  {id:2,name:"Trusted Contact 2",phone:"Demo contact — edit later"}
];
let history = JSON.parse(localStorage.getItem("rb_pro_history") || "[]");
let holdTimer = null, progressTimer = null, holdStart = 0, active = false;

function saveContacts(){localStorage.setItem("rb_pro_contacts",JSON.stringify(contacts));renderContacts();}
function renderContacts(){
  $("contactCount").textContent=`${contacts.length} contacts`;
  $("statContacts").textContent=contacts.length;
  const list=$("contactList");list.innerHTML="";
  if(!contacts.length){list.innerHTML='<div class="empty-state">No contacts yet. Add someone you trust.</div>';return;}
  contacts.forEach(c=>{
    const item=document.createElement("div");item.className="contact-item";
    const avatar=document.createElement("div");avatar.className="avatar";avatar.textContent=(c.name[0]||"?").toUpperCase();
    const info=document.createElement("div");info.className="contact-info";
    const name=document.createElement("strong");name.textContent=c.name;
    const phone=document.createElement("small");phone.textContent=c.phone;info.append(name,phone);
    const remove=document.createElement("button");remove.className="remove-contact";remove.textContent="×";remove.title="Remove contact";remove.setAttribute("aria-label",`Remove ${c.name}`);
    remove.addEventListener("click",()=>{contacts=contacts.filter(x=>x.id!==c.id);saveContacts();});
    item.append(avatar,info,remove);list.append(item);
  });
}
function renderHistory(){
  $("alertCount").textContent=history.filter(x=>x.kind==="alert").length;
  const list=$("historyList");list.innerHTML="";
  if(!history.length){list.innerHTML='<div class="empty-state">No activity yet. Try the SOS simulation.</div>';return;}
  history.slice().reverse().forEach(h=>{
    const item=document.createElement("div");item.className="history-item";
    const icon=document.createElement("div");icon.className="history-icon";icon.textContent="!";
    const copy=document.createElement("div");copy.className="history-copy";
    const title=document.createElement("strong");title.textContent=h.title;
    const detail=document.createElement("p");detail.textContent=h.detail;copy.append(title,detail);
    const time=document.createElement("time");time.textContent=h.time;
    item.append(icon,copy,time);list.append(item);
  });
}
function log(title,detail,kind="info"){
  history.push({title,detail,kind,time:new Date().toLocaleString()});history=history.slice(-30);
  localStorage.setItem("rb_pro_history",JSON.stringify(history));renderHistory();
}
function stopHold(reset=true){
  clearTimeout(holdTimer);clearInterval(progressTimer);holdTimer=null;progressTimer=null;
  if(reset&&!active){$("holdProgress").style.width="0%";$("holdHint").textContent="Hold the button to run a safe demo.";}
}
function fireSOS(){
  if(active)return;active=true;
  $("systemState").textContent="DEMO ALERT ACTIVE";$("systemState").style.color="var(--pink2)";$("systemState").style.borderColor="#ff527855";
  $("deviceStatus").textContent="Demo alert active";
  $("holdHint").textContent="Demo alert activated. No real message or call was sent.";
  $("sosButton").innerHTML='<span class="sos-symbol">✓</span><strong>ALERT</strong><small>DEMO ACTIVATED</small>';
  log("SOS simulation activated","Local demo only. No emergency service, SMS or call was contacted.","alert");
  if(navigator.vibrate)navigator.vibrate([100,60,100]);
}
function startHold(e){
  if(e.type==="keydown"&&![" ","Enter"].includes(e.key))return;
  if(e.type==="keydown"&&e.repeat)return;
  if(active||holdTimer)return;
  holdStart=Date.now();$("holdHint").textContent="Keep holding…";
  progressTimer=setInterval(()=>{$("holdProgress").style.width=`${Math.min(100,(Date.now()-holdStart)/20)}%`;},25);
  holdTimer=setTimeout(()=>{stopHold(false);fireSOS();},2000);
}
const sos=$("sosButton");
sos.addEventListener("pointerdown",e=>{e.preventDefault();startHold(e);});
["pointerup","pointerleave","pointercancel"].forEach(ev=>sos.addEventListener(ev,()=>stopHold(true)));
sos.addEventListener("keydown",startHold);sos.addEventListener("keyup",()=>stopHold(true));sos.addEventListener("contextmenu",e=>e.preventDefault());
$("resetButton").addEventListener("click",()=>{
  stopHold();active=false;$("systemState").textContent="SYSTEM READY";$("systemState").style.color="var(--mint)";$("systemState").style.borderColor="#65e2c23b";
  $("deviceStatus").textContent="Ready to test";$("sosButton").innerHTML='<span class="sos-symbol">!</span><strong>SOS</strong><small>HOLD FOR 2 SECONDS</small>';$("holdProgress").style.width="0%";$("holdHint").textContent="Demo reset. Hold to simulate another alert.";
  log("Demo reset","Interface returned to ready state.");
});
$("locationButton").addEventListener("click",()=>{
  const out=$("locationText");
  if(!navigator.geolocation){out.textContent="This browser does not support location.";return;}
  out.textContent="Requesting permission…";
  navigator.geolocation.getCurrentPosition(pos=>{
    out.textContent=`Lat ${pos.coords.latitude.toFixed(5)}, Lon ${pos.coords.longitude.toFixed(5)}. Stored nowhere by this demo.`;
    log("Location retrieved","Browser permission granted; location was not sent to anyone.");
  },err=>{
    out.textContent=err.code===1?"Permission denied. Allow location access to test.":err.code===3?"Request timed out. Try again.":"Location unavailable. Try again.";
  },{enableHighAccuracy:true,timeout:10000,maximumAge:0});
});
$("contactForm").addEventListener("submit",e=>{
  e.preventDefault();const name=$("contactName").value.trim(),phone=$("contactPhone").value.trim();if(!name||!phone)return;
  contacts.push({id:Date.now(),name,phone});saveContacts();$("contactForm").reset();log("Trusted contact added",`${name} was added to this browser's demo list.`);
});
$("clearHistory").addEventListener("click",()=>{history=[];localStorage.setItem("rb_pro_history","[]");renderHistory();});
$("themeToggle").addEventListener("click",()=>{document.body.classList.toggle("light");localStorage.setItem("rb_pro_light",document.body.classList.contains("light")?"1":"0");});
if(localStorage.getItem("rb_pro_light")==="1")document.body.classList.add("light");
$("scrollToSOS").addEventListener("click",()=>$("sosSection").scrollIntoView({behavior:"smooth",block:"start"}));
renderContacts();renderHistory();
