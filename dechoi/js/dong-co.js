/* ĐỘNG CƠ BẢN DỄ CHƠI: nút Đi tiếp tự đi, nút Nói chuyện, hội thoại chữ to, đọc to, hướng dẫn từng bước.
   Bản đồ, nhân vật, câu hỏi dùng chung với Bản Phiêu lưu (phieuluu/js, chung/). */

/* ===== TRẠNG THÁI ===== */
let S=null;const npcs=[];
const STEP_FR=11,AUTO_FR=9;
const QNEED=4,QTOTAL=7; /* mỗi màn 7 câu, đúng từ 4 câu nhận thưởng */
function newGame(name){
  S={name:name||"Bạn",score:0,hints:0,slog:shuffle(SLOGANS.map((_,i)=>i)),items:0,evTypes:shuffle(Object.keys(EVTS)),
     pending:null,busy:true,ended:false,arrowAng:0,res:{},rw:{},path:null,
     p:{x:0,y:0,px:0,py:0,dir:0,frame:0,moving:null,walk:0,pal:PAL.me}};
  loadLevel(L1);
}
function loadLevel(L){
  LV=L;MW=L.MW;MH=L.MH;map=new Uint8Array(MW*MH);L.build();renderMap();
  npcs.length=0;
  L.npcDef.forEach(d=>npcs.push({...d,pal:d.obj?null:PAL[d.pal||d.id],px:d.x*TS,py:d.y*TS,frame:0,moving:null,home:d.dir}));
  const p=S.p;Object.assign(p,{x:L.start.x,y:L.start.y,px:L.start.x*TS,py:L.start.y*TS,dir:L.start.dir,moving:null});
  S.done=new Set();S.correct=0;S.answered=0;S.joined=new Set();S.quiz={};S.evDone=0;S.pending=null;S.ended=false;S.lvScore0=S.score;S.path=null;
  S.events=S.evTypes.splice(0,L.nEv||1).map(t=>({type:t,...EVTS[t][Math.random()*EVTS[t].length|0]}));
  if(L.init)L.init();
  updHud();fitStage();
}
const fmt=t=>String(t).replace(/\{name\}/g,S?S.name:"bạn");
function updHud(){
  if(!S||!LV)return;
  $("quest").innerHTML=LV.quest()+` <span class="qc">· Đúng ${S.correct}/${QTOTAL}</span>`;
  $("hintc").textContent="💡 "+S.hints;
}
function pts(){const e=$("pts");e.textContent="★ "+(S?S.score:0);e.classList.remove("bump");void e.offsetWidth;e.classList.add("bump")}
function addScore(d){S.score=Math.max(0,S.score+d);pts()}
function toast(t,cls){const d=document.createElement("div");d.className="toast "+(cls||"");d.textContent=t;$("stage").appendChild(d);setTimeout(()=>d.remove(),1900)}

/* ===== ÂM THANH, NHẠC NỀN 8-BIT, ĐỌC TO ===== */
let AC=null,soundOn=store.get("pl_sound",true);
function ac(){try{AC=AC||new (window.AudioContext||window.webkitAudioContext)();if(AC.state==="suspended")AC.resume()}catch(e){}return AC}
function tone(f,t,d,type,vol){const o=AC.createOscillator(),g=AC.createGain();o.type=type;o.frequency.value=f;g.gain.setValueAtTime(vol,t);g.gain.exponentialRampToValueAtTime(.0001,t+d);o.connect(g).connect(AC.destination);o.start(t);o.stop(t+d+.02)}
function sfx(k){
  if(!soundOn||!ac())return;
  const seq={blip:[[880,.03]],ok:[[660,.08],[880,.08],[1320,.14]],no:[[300,.12],[250,.16]],win:[[523,.08],[659,.08],[784,.08],[1047,.24]],ring:[[1200,.08],[900,.08],[1200,.08],[900,.08]],bump:[[120,.05]],alert:[[1000,.06],[1400,.1]],item:[[784,.06],[988,.06],[1175,.06],[1568,.2]]}[k]||[[600,.05]];
  let t=AC.currentTime;seq.forEach(([f,d])=>{tone(f,t,d,"square",.05);t+=d});
}
const mid=n=>440*Math.pow(2,(n-69)/12);
const MEL=[72,0,76,79,76,0,72,74,76,0,74,72,69,0,72,0, 74,0,77,81,79,77,76,74,72,0,76,0,79,0,0,0, 72,0,76,79,81,79,76,74,72,74,76,77,79,0,76,0, 74,74,76,74,72,0,67,0,72,0,0,0,0,0,0,0];
const BAS=[48,48,55,55,45,45,52,52,50,50,57,57,43,43,48,48];
const MEL2=[67,0,72,0,71,72,74,0,72,0,69,0,67,0,0,0, 65,0,69,0,72,74,72,0,71,0,67,0,69,0,0,0, 67,0,72,0,76,74,72,0,74,0,77,76,74,0,72,0, 71,0,72,74,72,0,67,0,72,0,0,0,0,0,0,0];
const BAS2=[48,48,45,45,41,41,43,43,48,48,45,45,43,43,48,48];
let musT=null,musStep=0,musNext=0;
function music(on){
  const two=LV&&LV.id===2,M=two?MEL2:MEL,B=two?BAS2:BAS,st=two?.24:.2;
  clearInterval(musT);musT=null;if(!on||!soundOn||!ac())return;
  musNext=AC.currentTime+.1;
  musT=setInterval(()=>{if(!AC)return;while(musNext<AC.currentTime+.25){const n=M[musStep%M.length];if(n)tone(mid(n),musNext,.16,"square",.018);if(musStep%4===0)tone(mid(B[(musStep/4|0)%B.length]),musNext,.3,"triangle",.04);musStep++;musNext+=st}},60);
}
$("snd").onclick=()=>{soundOn=!soundOn;store.set("pl_sound",soundOn);$("snd").textContent=soundOn?"♪":"×";music(soundOn&&S&&!S.ended)};
$("snd").textContent=soundOn?"♪":"×";
const vib=p=>{try{navigator.vibrate&&navigator.vibrate(p)}catch(e){}};
/* đọc to bằng giọng tiếng Việt có sẵn trong máy */
let ttsOn=store.get("dc_tts",false);
function speak(t){
  if(!ttsOn||!window.speechSynthesis)return;
  try{speechSynthesis.cancel();
    const u=new SpeechSynthesisUtterance(String(t).replace(/[\u{1F300}-\u{1FAFF}☀-➿★➜▶▲▼◀]/gu,"").replace(/\s+/g," "));
    u.lang="vi-VN";u.rate=.95;const v=speechSynthesis.getVoices().find(v=>/^vi/i.test(v.lang));if(v)u.voice=v;speechSynthesis.speak(u)}catch(e){}
}
function hush(){try{window.speechSynthesis&&speechSynthesis.cancel()}catch(e){}}
function setTts(on){ttsOn=on;store.set("dc_tts",on);$("tts").textContent=on?"🔊":"🔇";$("tts").classList.toggle("on",on);if(!on)hush();else speak("Đã bật đọc to.")}
$("tts").onclick=()=>setTts(!ttsOn);$("tts").textContent=ttsOn?"🔊":"🔇";$("tts").classList.toggle("on",ttsOn);
/* cỡ chữ */
const FS=[.9,1,1.15,1.3,1.45];let fsI=store.get("dc_fs",1);
function applyFs(){fsI=Math.max(0,Math.min(FS.length-1,fsI));document.documentElement.style.setProperty("--fs",FS[fsI]);store.set("dc_fs",fsI);setTimeout(fitStage,30)}
$("fsm").onclick=()=>{fsI--;applyFs()};$("fsp").onclick=()=>{fsI++;applyFs()};applyFs();

/* ===== VẬT PHẨM GỢI Ý & KHẨU HIỆU ===== */
function giveHint(why){
  S.hints++;S.items++;updHud();sfx("item");vib(60);
  const idx=S.slog.length?S.slog.shift():Math.random()*SLOGANS.length|0;
  const item=ITEMS[(S.items-1)%ITEMS.length];
  return new Promise(res=>{
    const d=document.createElement("div");d.className="slog";
    const t=esc(SLOGANS[idx]),lg=LOGO_URI;
    const art={
     "Băng rôn tuyên truyền":`<div class="it it-banner"><span class="pole l"></span><span class="pole r"></span><span class="rope"></span><div class="cloth">${t}</div></div>`,
     "Áp phích Ngày 10/10":`<div class="it it-poster"><div class="top">Hưởng ứng<b>NGÀY CHUYỂN ĐỔI SỐ 10/10</b><span class="city"></span></div><div class="body">${t}</div><div class="foot">Phường Gia Định · 2026</div></div>`,
     "Cờ phướn chuyển đổi số":`<div class="it it-phuon"><span class="rod"></span><div class="cloth"><span class="h">CHUYỂN ĐỔI SỐ</span>${t}</div></div>`,
     "Tờ rơi Công dân số":`<div class="it it-flyer"><div class="a">${t}</div><div class="b"><b>Công dân số<br>phường Gia Định</b><span>Học kỹ năng số, dùng dịch vụ số an toàn.</span><span class="qr"></span></div></div>`,
     "Standee Ngày hội":`<div class="it it-standee"><div class="board"><img src="${lg}" alt=""><span class="h">NGÀY HỘI 10/10</span><br>${t}</div></div>`
    }[item];
    d.innerHTML=`<div class="lbl">🎁 Nhận: ${esc(item)} · +1 💡 gợi ý${why?" · "+esc(why):""}</div>${art}<button class="go" type="button">Tiếp tục ➜</button>`;
    $("app").appendChild(d);speak("Bạn nhận được "+item+". "+SLOGANS[idx]);
    const done=()=>{if(!d.isConnected)return;d.remove();hush();res()};
    d.querySelector("button").onclick=e=>{e.stopPropagation();done()};setTimeout(()=>{if(S)S._slogClose=done},250);
  });
}

/* ===== HỘI THOẠI (chữ hiện ngay, nút lớn) ===== */
let D={res:null,choices:null};
const whoName=n=>typeof n==="string"?n:n.name;
const nl=t=>esc(t).replace(/\n/g,"<br>");
function openDlg(){if($("dlg").hidden){$("ctrl").hidden=true;$("dlg").hidden=false;fitStage()}held=null;stopPath()}
function closeDlg(){if(!$("dlg").hidden){$("dlg").hidden=true;$("dhint").hidden=true;$("ctrl").hidden=false;fitStage()}hush()}
async function say(n,text,html){
  openDlg();$("dwho").textContent=whoName(n);$("dch").innerHTML="";D.choices=null;$("dhint").hidden=true;
  const t=fmt(text);$("dtxt").innerHTML=html||nl(t);$("dnext").hidden=false;$("dlg").scrollTop=0;speak(t);
  return new Promise(r=>D.res=r);
}
/* ask: opts là mảng chữ; hintCfg={correct:k} để cho phép dùng gợi ý */
async function ask(n,text,opts,hintCfg){
  openDlg();$("dwho").textContent=whoName(n);$("dnext").hidden=true;D.res=null;
  const t=fmt(text);$("dtxt").innerHTML=nl(t);$("dlg").scrollTop=0;
  speak(t+(hintCfg?". "+opts.map((o,i)=>"Ý "+"ABC"[i]+": "+fmt(o)).join(". "):""));
  return new Promise(r=>{
    const gone=new Set();D.choices=opts;
    const draw=()=>{$("dch").innerHTML=opts.map((o,k)=>`<button class="choice ${gone.has(k)?"gone":""}" type="button" data-k="${k}">${hintCfg?`<span class="n">${"ABCD"[k]}</span>`:""}${esc(fmt(o))}</button>`).join("");
      $("dch").querySelectorAll("button").forEach(b=>b.onclick=e=>{e.stopPropagation();pick(+b.dataset.k)});
      const hb=$("dhint");hb.hidden=!hintCfg;
      if(hintCfg){hb.disabled=S.hints<=0||gone.size>=opts.length-2;hb.textContent=S.hints>0?`💡 Gợi ý: bỏ 1 đáp án sai (còn ${S.hints})`:"💡 Hết lượt gợi ý"}};
    const pick=k=>{if(gone.has(k))return;D.choices=null;D.pickFn=null;D.useHint=null;$("dch").innerHTML="";$("dhint").hidden=true;sfx("blip");hush();r(k)};
    D.useHint=()=>{if(!hintCfg||S.hints<=0)return;const wrong=opts.map((_,k)=>k).filter(k=>k!==hintCfg.correct&&!gone.has(k));if(wrong.length<1||gone.size>=opts.length-2)return;const k=wrong[Math.random()*wrong.length|0];gone.add(k);S.hints--;updHud();sfx("item");draw();if(coachEl&&coachEl.t.id==="dhint")coachOff()};
    $("dhint").onclick=e=>{e.stopPropagation();D.useHint&&D.useHint()};
    D.pickFn=pick;draw();
  });
}
function advance(){
  if(S&&S._slogClose){const f=S._slogClose;S._slogClose=null;f();return true}
  if($("dlg").hidden)return false;
  if(D.choices)return true;
  if(D.res){const r=D.res;D.res=null;sfx("blip");r()}
  return true;
}
$("dnext").addEventListener("click",e=>{e.stopPropagation();advance()});
$("dtxt").addEventListener("click",()=>{if(!D.choices)advance()});
/* câu hỏi chấm điểm: đúng +10, sai không trừ; hiện kết quả to, giải thích và căn cứ */
async function quiz(n,qz,pre){
  const opts=shuffle([qz.a,...qz.w]);const correct=opts.indexOf(qz.a);
  const pr=ask(n,(pre?pre+"\n":"")+qz.q,opts,{correct});D.correctText=qz.a;
  if(!store.get("dc_tut2",false))tutQuiz();
  const k=await pr;coachOff();
  const ok=k===correct;S.answered++;
  if(ok){S.correct++;addScore(10);sfx("ok");vib(40)}else{sfx("no");vib(80)}
  updHud();
  const html=`<div class="res ${ok?"ok":"no"}">${ok?"✔ ĐÚNG RỒI! +10 ★":"✘ CHƯA ĐÚNG"}</div>`+
    (ok?"":`<p class="ans">Đáp án đúng: <b>${esc(qz.a)}</b></p>`)+`<p>${esc(qz.ex)}</p>`+
    (qz.law?`<div class="law"><b>📘 Căn cứ:</b> ${esc(qz.law)}</div>`:"");
  await say(n,(ok?"Đúng rồi! ":"Chưa đúng. Đáp án đúng là: "+qz.a+". ")+qz.ex+(qz.law?" Căn cứ: "+qz.law:""),html);
  return ok;
}

/* ===== HƯỚNG DẪN TỪNG BƯỚC (bàn tay chỉ vào nút) ===== */
let coachEl=null;
function coach(target,html,btn){
  coachOff();const t=typeof target==="string"?$(target.replace(/^#/,"")):target;if(!t||t.hidden)return Promise.resolve();
  const c=document.createElement("div");c.className="coach";
  c.innerHTML=`<div class="cb"><div>${html}</div>${btn?`<button type="button" class="go">${btn}</button>`:""}</div><div class="hand">👇</div>`;
  document.body.appendChild(c);t.classList.add("coach-t");
  const place=()=>{if(!coachEl)return;const r=t.getBoundingClientRect(),cb=c.querySelector(".cb"),hd=c.querySelector(".hand");
    hd.style.left=(r.left+Math.min(r.width/2,90)-22)+"px";hd.style.top=Math.max(4,r.top-46)+"px";
    cb.style.left=Math.max(8,Math.min(innerWidth-cb.offsetWidth-8,r.left+Math.min(r.width/2,90)-cb.offsetWidth/2))+"px";
    cb.style.top=Math.max(8,Math.min(r.top-50-cb.offsetHeight,$("stage").getBoundingClientRect().top+8))+"px"};
  speak(c.querySelector(".cb").textContent.replace(btn||"",""));
  return new Promise(res=>{coachEl={c,t,res,place};place();if(btn)c.querySelector("button").onclick=()=>coachOff()});
}
function coachOff(){if(!coachEl)return;const {c,t,res}=coachEl;coachEl=null;c.remove();t.classList.remove("coach-t");res()}
addEventListener("resize",()=>coachEl&&coachEl.place());
async function tutQuiz(){
  store.set("dc_tut2",true);await sleep(60);
  if(!$("dhint").hidden&&S.hints>0)await coach("#dhint","<b>Hướng dẫn 1/3.</b> Câu khó thì bấm nút <b>💡 Gợi ý</b> để bỏ bớt 1 đáp án sai.","Đã hiểu");
  if(D.choices)coach("#dch","<b>Hướng dẫn 2/3.</b> Đọc câu hỏi rồi <b>chạm vào đáp án</b> bạn chọn. Trả lời sai cũng không bị trừ điểm.");
}

/* ===== DI CHUYỂN ===== */
const DIRS=[[0,1],[-1,0],[1,0],[0,-1]];
function solid(x,y,self){
  if(x<0||y<0||x>=MW||y>=MH)return true;
  if(LV.solidT.has(at(x,y)))return true;
  if(S&&self!==S.p&&S.p.x===x&&S.p.y===y)return true;
  return npcs.some(n=>n!==self&&!n.hidden&&n.x===x&&n.y===y);
}
function startMove(e,dir,frames){
  e.dir=dir;const [dx,dy]=DIRS[dir];const nx=e.x+dx,ny=e.y+dy;
  if(solid(nx,ny,e))return false;
  e.moving={fx:e.x,fy:e.y,t:0,n:frames||STEP_FR};e.x=nx;e.y=ny;e.walk=(e.walk||0)+1;return true;
}
function stepEntity(e){
  if(!e.moving)return false;const m=e.moving;m.t++;
  const k=m.t/m.n;e.px=(m.fx+(e.x-m.fx)*k)*TS;e.py=(m.fy+(e.y-m.fy)*k)*TS;
  e.frame=m.t<m.n/2?(e.walk%2?1:2):0;
  if(m.t>=m.n){e.moving=null;e.px=e.x*TS;e.py=e.y*TS;e.frame=0;if(e.onArrive){const f=e.onArrive;e.onArrive=null;f()}return true}
  return false;
}
const moveNpc=(n,dir)=>new Promise(res=>{if(!startMove(n,dir,12)){n.dir=dir;return res(false)}n.onArrive=()=>res(true)});

/* ===== TỰ ĐI TỚI NGƯỜI CẦN GẶP (tìm đường) ===== */
const canTalkFrom=(x,y,n)=>{const dx=n.x-x,dy=n.y-y,ch=Math.max(Math.abs(dx),Math.abs(dy));return (ch===1&&(dx===0||dy===0))||(ch===2&&(dx===0||dy===0))};
function findPath(goal){
  const p=S.p,W=MW,H=MH,prev=new Int32Array(W*H).fill(-2),q=[p.y*W+p.x];prev[q[0]]=-1;let h=0;
  while(h<q.length){const c=q[h++],x=c%W,y=c/W|0;
    if(goal(x,y)){const path=[];let k=c;while(prev[k]!==-1){const pk=prev[k],dx=(k%W)-(pk%W),dy=(k/W|0)-(pk/W|0);path.unshift(dx===1?2:dx===-1?1:dy===1?0:3);k=pk}return path}
    for(let d=0;d<4;d++){const nx=x+DIRS[d][0],ny=y+DIRS[d][1];if(nx<0||ny<0||nx>=W||ny>=H)continue;const k=ny*W+nx;if(prev[k]!==-2||solid(nx,ny,p))continue;prev[k]=c;q.push(k)}}
  return null;
}
function stopPath(){if(S)S.path=null}
function goTo(tg,tries){
  if(!S||S.busy||S.ended)return;
  const goal=tg.exit?LV.exitGoal:tg.tile?(x,y)=>x===tg.x&&y===tg.y:(x,y)=>canTalkFrom(x,y,tg);
  const path=findPath(goal);
  if(!path){toast("Đường đang bị chắn, thử lại nha!");return}
  S.path={steps:path,tg,tries:tries||0};
  if(!path.length&&!S.p.moving)arrive();
}
function arrive(){
  const P=S.path;S.path=null;if(!P)return;const tg=P.tg;
  if(tg.exit){if(LV.onStep)LV.onStep(S.p);return}
  if(!tg.tile&&tg.kind)talkTo(tg);
}
function goNext(){
  if(coachEl&&coachEl.t.id==="go")coachOff();
  if(advance())return;
  if(!S||S.busy||S.ended)return;
  const t=LV.target();if(!t)return;
  if(!t.exit&&!S.p.moving&&canTalkFrom(S.p.x,S.p.y,t)){talkTo(t);return}
  goTo(t);
}
$("go").addEventListener("click",e=>{e.preventDefault();ac();goNext()});

/* ===== ĐIỀU KHIỂN: nút mũi tên, bàn phím, chạm bản đồ ===== */
let held=null;
const KEYS={ArrowDown:0,ArrowLeft:1,ArrowRight:2,ArrowUp:3,s:0,a:1,d:2,w:3,S:0,A:1,D:2,W:3};
const anyOver=()=>["title","lvend","tvv","end","lbv","helpv"].some(id=>!$(id).hidden);
addEventListener("keydown",e=>{
  if(!S||anyOver())return;
  if(!$("dlg").hidden&&D.choices&&/^[1-4]$/.test(e.key)){e.preventDefault();D.pickFn(+e.key-1);return}
  if(e.key in KEYS){e.preventDefault();if($("dlg").hidden){held=KEYS[e.key];stopPath()}return}
  if(e.key==="h"||e.key==="H"){if(D.useHint&&D.choices){e.preventDefault();D.useHint()}return}
  if(e.key==="f"||e.key==="F"||e.key===" "){e.preventDefault();action();return}
  if(e.key==="Enter"){e.preventDefault();goNext()}
});
addEventListener("keyup",e=>{if(e.key in KEYS&&held===KEYS[e.key])held=null});
document.querySelectorAll(".dpad button").forEach(b=>{
  const d=+b.dataset.d;
  b.addEventListener("pointerdown",e=>{e.preventDefault();b.setPointerCapture(e.pointerId);held=d;stopPath();b.classList.add("on")});
  const up=()=>{if(held===d)held=null;b.classList.remove("on")};
  ["pointerup","pointercancel","lostpointercapture"].forEach(t=>b.addEventListener(t,up));
});
$("fbtn").addEventListener("click",e=>{e.preventDefault();action()});
/* chạm vào bản đồ: đi tới chỗ đó; chạm vào người: đi tới và nói chuyện */
$("cv").addEventListener("pointerdown",e=>{
  if(!S||S.busy||S.ended||!$("dlg").hidden)return;
  const r=cv.getBoundingClientRect(),[cx,cy]=camera();
  const sc=Math.min(r.width/cv.width,r.height/cv.height),ox=(r.width-cv.width*sc)/2,oy=(r.height-cv.height*sc)/2;
  const mx=(e.clientX-r.left-ox)/sc+cx,my=(e.clientY-r.top-oy)/sc+cy;
  const n=npcs.find(n=>!n.hidden&&!n.temp&&mx>=n.px-2&&mx<=n.px+18&&my>=n.py-8&&my<=n.py+18);
  if(n){if(!S.p.moving&&canTalkFrom(S.p.x,S.p.y,n))talkTo(n);else goTo(n);return}
  const tx=Math.floor(mx/TS),ty=Math.floor(my/TS);
  if(!solid(tx,ty,S.p))goTo({tile:true,x:tx,y:ty});
});

/* NPC ở cạnh (kể cả chéo), ưu tiên người đang đối mặt */
function nearNpc(){
  if(!S)return null;const p=S.p;const [fx,fy]=DIRS[p.dir];
  let best=null,bs=1e9;
  npcs.forEach(n=>{if(n.hidden||n.temp)return;
    const dx=n.x-p.x,dy=n.y-p.y,ch=Math.max(Math.abs(dx),Math.abs(dy));
    const ok=ch===1||(ch===2&&(dx===0||dy===0));if(!ok)return;
    const s=ch*10+((dx===fx*ch&&dy===fy*ch)?0:1)+Math.hypot(n.px-p.px,n.py-p.py)/100;if(s<bs){bs=s;best=n}});
  return best;
}
const face=(n,p)=>{const dx=p.x-n.x,dy=p.y-n.y;n.dir=Math.abs(dx)>Math.abs(dy)?(dx<0?1:2):(dy<0?3:0)};
async function talkTo(n){
  if(!S||S.busy||S.ended)return;
  S.busy=true;held=null;stopPath();if(!n.obj)face(n,S.p);
  const pdx=n.x-S.p.x,pdy=n.y-S.p.y;S.p.dir=Math.abs(pdx)>Math.abs(pdy)?(pdx<0?1:2):(pdy<0?3:0);
  try{await LV.talk(n)}finally{closeDlg();if(!n.temp)n.dir=n.home;if(S){S.busy=false;updHud()}}
}
function action(){
  if(!S)return;
  if(advance())return;
  if(S.busy||S.ended)return;
  if(S.p.moving){S.p.onArrive=()=>action();return}
  const n=nearNpc();if(!n){toast("Chưa có ai ở gần. Bấm Đi tiếp nha!");return}
  talkTo(n);
}

/* ===== SỰ KIỆN NGẪU NHIÊN ===== */
let phoneRes=null;
function phoneUI(html,buzz){
  $("pscreen").innerHTML=html;$("phone").classList.toggle("buzz",!!buzz);$("phonebox").hidden=false;
  return new Promise(r=>phoneRes=r);
}
$("pscreen").addEventListener("click",e=>{const b=e.target.closest(".pbtn");if(b&&phoneRes){const r=phoneRes;phoneRes=null;r()}});
async function evQuiz(who,ev){
  const ok=await quiz(who,{q:ev.q,a:ev.a,w:ev.w,ex:ev.ex});
  S.evDone++;closeDlg();
  if(ok){toast("Né bẫy thành công!","good");await giveHint("Né bẫy thành công")}
}
function queueEvent(walk){const ev=S.events[S.evDone];if(ev&&!S.pending)S.pending={ev,walk:walk||2}}
async function runEvent(ev){
  S.busy=true;held=null;S.path=null;
  try{
  if(ev.type==="stranger"){
    let spot=null;
    for(const dir of shuffle([0,1,2,3])){const [dx,dy]=DIRS[dir];
      if(!solid(S.p.x+dx,S.p.y+dy)&&!solid(S.p.x+2*dx,S.p.y+2*dy)){spot={x:S.p.x+2*dx,y:S.p.y+2*dy,back:[3,2,1,0][dir]};break}}
    if(!spot){S.pending={ev,walk:2};return}
    const st={id:"la",name:ev.who,pal:PAL.la,x:spot.x,y:spot.y,px:spot.x*TS,py:spot.y*TS,dir:spot.back,frame:0,moving:null,home:spot.back,temp:true};
    npcs.push(st);S.alert=60;sfx("alert");vib(80);
    await sleep(500);await moveNpc(st,spot.back);
    S.p.dir=[3,2,1,0][spot.back];
    await say(st,ev.line);
    await evQuiz(st,ev);
    const away=[3,2,1,0][spot.back];for(let i=0;i<3;i++)await moveNpc(st,away);
    npcs.splice(npcs.indexOf(st),1);
  }else if(ev.type==="notify"){
    sfx("alert");vib(120);
    const d=document.createElement("div");d.className="notif";
    d.innerHTML=`<div class="from">${esc(ev.app)} · ${esc(ev.who)} · bây giờ</div><b>${esc(ev.title)}</b><div>${esc(ev.body)}</div><button class="pbtn" type="button" style="justify-self:end">Xem</button>`;
    $("app").appendChild(d);speak("Có thông báo mới. "+ev.title+". "+ev.body);
    await new Promise(r=>d.querySelector("button").onclick=r);d.remove();
    await evQuiz(ev.app+" lạ",ev);
  }else{
    sfx("ring");vib([200,100,200,100,200]);
    const ringT=setInterval(()=>sfx("ring"),1400);
    if(ev.type==="call"){
      speak("Có cuộc gọi đến.");
      await phoneUI(`<div class="sub">Cuộc gọi đến…</div><div class="av">?</div><div class="nm">${esc(ev.who)}</div><div class="sub">${esc(ev.sub)}</div><button class="pbtn" type="button">Nghe máy</button>`,true);
      clearInterval(ringT);$("phonebox").hidden=true;await say(ev.who,ev.line);
    }else if(ev.type==="sms"){
      speak("Có tin nhắn mới. "+ev.sms);
      await phoneUI(`<div class="sub">Tin nhắn mới · bây giờ</div><div class="nm">${esc(ev.who)}</div><div class="sms">${esc(ev.sms)}<span class="lnk">${esc(ev.link)}</span></div><button class="pbtn" type="button">Xử lý tin nhắn</button>`,true);
      clearInterval(ringT);$("phonebox").hidden=true;
    }else if(ev.type==="zalo"){
      clearInterval(ringT);
      const p=phoneUI(`<div class="zhead">💬 ${esc(ev.who)}</div><div class="chat" id="chat"></div><button class="pbtn" type="button" id="zbtn" hidden>Trả lời</button>`,false);
      for(const m of ev.msgs){const c=$("chat");const t=document.createElement("div");t.className="typing";t.textContent="•••";c.appendChild(t);await sleep(800);t.remove();const mm=document.createElement("div");mm.className="m";mm.textContent=m;c.appendChild(mm);sfx("blip")}
      speak("Tin nhắn Zalo từ "+ev.who+". "+ev.msgs.join(". "));
      $("zbtn").hidden=false;await p;$("phonebox").hidden=true;
    }else if(ev.type==="video"){
      await phoneUI(`<div class="sub">Cuộc gọi video đến…</div><div class="av">📹</div><div class="nm">${esc(ev.who)}</div><button class="pbtn" type="button">Nghe máy</button>`,true);
      clearInterval(ringT);
      const p=phoneUI(`<div class="vid"><canvas id="vcv" width="48" height="64"></canvas><div class="rec">● ${esc(ev.who)}</div></div><div class="sms" id="vsub">…</div><button class="pbtn" type="button" id="vbtn" hidden>Cuộc gọi đã kết thúc · Xử lý</button>`,false);
      let run=true;const vc=$("vcv").getContext("2d");let f=0;
      (function anim(){if(!run)return;f++;drawFace(vc,f);requestAnimationFrame(anim)})();
      speak(ev.line);
      const words=ev.line.split(" ");for(let i=1;i<=words.length;i++){$("vsub").textContent=words.slice(0,i).join(" ");await sleep(150)}
      await sleep(500);$("vbtn").hidden=false;await p;run=false;$("phonebox").hidden=true;
    }
    await evQuiz(ev.who,ev);
  }
  }finally{if(S)S.busy=false;closeDlg();updHud()}
}
/* khuôn mặt giả mạo: giật hình, môi lệch, nền nhòe */
function drawFace(c,f){
  c.fillStyle="#3B4A5A";c.fillRect(0,0,48,64);
  for(let i=0;i<20;i++){c.fillStyle=`rgba(255,255,255,${.04+Math.random()*.06})`;c.fillRect(Math.random()*48,Math.random()*64,3,3)}
  const j=(f%23<3)?(Math.random()*6-3)|0:0;
  c.fillStyle="#F2C29B";c.fillRect(12+j,16,24,28);c.fillStyle="#2B1B14";c.fillRect(10+j,10,28,10);c.fillRect(10+j,14,4,14);c.fillRect(34+j,14,4,14);
  c.fillStyle="#11111F";c.fillRect(18+j,26,4,3);c.fillRect(27+j,26,4,3);
  const mo=Math.sin(f/3)>0?3:1, lag=(f%40<20)?3:-2;c.fillStyle="#B03A2E";c.fillRect(21+j+lag,36,7,mo);
  c.fillStyle="#E57373";c.fillRect(8+j,46,32,18);
  if(f%17<2){const y=Math.random()*60|0;const img=c.getImageData(0,y,48,4);c.putImageData(img,(Math.random()*8-4)|0,y)}
}

/* ===== VÒNG LẶP, KHUNG HÌNH ===== */
const cv=$("cv"),ctx=cv.getContext("2d");
function fitStage(){
  const r=$("stage").getBoundingClientRect();if(!r.width||!r.height)return;
  VH=Math.max(4,Math.min(20,Math.round(VW*r.height/r.width)));
  if(cv.height!==VH*TS)cv.height=VH*TS;if(cv.width!==VW*TS)cv.width=VW*TS;ctx.imageSmoothingEnabled=false;
  if(coachEl)coachEl.place();
}
try{new ResizeObserver(()=>fitStage()).observe($("stage"))}catch(e){addEventListener("resize",fitStage)}
fitStage();
let tick=0;
function camera(){const p=S.p;
  return [Math.max(0,Math.min(MW*TS-VW*TS,Math.round(p.px+8-VW*TS/2))),Math.max(0,Math.min(MH*TS-VH*TS,Math.round(p.py+8-VH*TS*.5)))]}
function update(){
  tick++;if(!S)return;
  const p=S.p;
  if(stepEntity(p)){
    if(LV.onStep&&LV.onStep(p)){S.path=null}
    else if(S.pending&&--S.pending.walk<=0&&!S.busy){const ev=S.pending.ev;S.pending=null;runEvent(ev)}
  }
  npcs.forEach(stepEntity);
  const free=!S.busy&&$("dlg").hidden&&$("phonebox").hidden&&!S.ended;
  if(!p.moving&&free){
    if(held!==null){if(!startMove(p,held)){p.dir=held;if(tick%18===0)sfx("bump")}}
    else if(S.path){
      if(S.path.steps.length){const d=S.path.steps.shift();
        if(!startMove(p,d,AUTO_FR)){const P=S.path;S.path=null;if(P.tries<4)setTimeout(()=>goTo(P.tg,P.tries+1),150)}}
      else arrive();
    }
  }
  if(LV.tick)LV.tick();
  if(S.alert)S.alert--;
  const near=free?nearNpc():null;$("fbtn").classList.toggle("near",!!near);$("fbtn").disabled=!near;
  $("go").classList.toggle("walking",!!S.path);
}
/* dấu trên đầu: ? vàng (cần giúp), mặt cười (đã giúp), ! xanh (việc tiếp theo) */
function drawQ(x,y,col){
  const b=Math.round(Math.sin(tick/9)*3);
  ctx.fillStyle="rgba(255,230,120,.38)";ctx.beginPath();ctx.arc(x+8,y-16+b,11+Math.sin(tick/7)*1.5,0,7);ctx.fill();
  ctx.fillStyle="#11111F";ctx.fillRect(x+1,y-27+b,14,20);ctx.fillRect(x+6,y-8+b,4,3);
  ctx.fillStyle=col||"#FFD23F";ctx.fillRect(x+2,y-26+b,12,18);
  ctx.fillStyle="#11111F";ctx.fillRect(x+5,y-24+b,6,2);ctx.fillRect(x+10,y-23+b,2,4);ctx.fillRect(x+7,y-19+b,4,2);ctx.fillRect(x+7,y-17+b,2,2);ctx.fillRect(x+7,y-13+b,2,2);
}
function drawBang(x,y,col){
  const b=Math.round(Math.sin(tick/9)*3);
  ctx.fillStyle="rgba(255,230,120,.35)";ctx.beginPath();ctx.arc(x+8,y-16+b,10+Math.sin(tick/7)*1.5,0,7);ctx.fill();
  ctx.fillStyle="#11111F";ctx.fillRect(x+2,y-26+b,12,20);
  ctx.fillStyle=col;ctx.fillRect(x+3,y-25+b,10,18);
  ctx.fillStyle="#11111F";ctx.fillRect(x+6,y-23+b,4,9);ctx.fillRect(x+6,y-12+b,4,3);
}
function drawSmile(x,y){
  ctx.fillStyle="#11111F";ctx.beginPath();ctx.arc(x+8,y-12,7,0,7);ctx.fill();
  ctx.fillStyle="#FFD23F";ctx.beginPath();ctx.arc(x+8,y-12,6,0,7);ctx.fill();
  ctx.fillStyle="#11111F";ctx.fillRect(x+5,y-15,2,2);ctx.fillRect(x+9,y-15,2,2);ctx.fillRect(x+4,y-11,1,1);ctx.fillRect(x+11,y-11,1,1);ctx.fillRect(x+5,y-10,6,1);
}
function drawBubble(x,y){
  const b=Math.round(Math.sin(tick/14)*1);
  ctx.fillStyle="#11111F";ctx.fillRect(x+1,y-15+b,16,11);ctx.fillStyle="#FFFFFF";ctx.fillRect(x+2,y-14+b,14,9);
  ctx.fillStyle="#11111F";ctx.fillRect(x+4,y-6+b,3,3);
  const k=(tick/12|0)%4;for(let i=0;i<3;i++){ctx.fillStyle=i<k?"#1E6FE0":"#9AA3B5";ctx.fillRect(x+4+i*4,y-11+b,2,2)}
}
function draw(){
  ctx.fillStyle="#000";ctx.fillRect(0,0,cv.width,cv.height);
  if(!S||!mapImg)return;
  const p=S.p,[cx,cy]=camera();
  ctx.drawImage(mapImg,cx,cy,VW*TS,VH*TS,0,0,VW*TS,VH*TS);
  const tg=LV.target();
  if(tg&&!tg.exit&&!S.busy){const x=tg.px-cx,y=tg.py-cy;const r=6+Math.sin(tick/8)*1.5;ctx.fillStyle="rgba(255,214,64,.5)";ctx.beginPath();ctx.ellipse(x+8,y+15,r+3,r/2+1,0,0,7);ctx.fill()}
  /* đường đi tự động */
  if(S.path&&S.path.steps.length){let x=p.x,y=p.y;ctx.fillStyle="rgba(255,255,255,.55)";S.path.steps.forEach((d,i)=>{x+=DIRS[d][0];y+=DIRS[d][1];if(i%2===0)ctx.fillRect(x*TS+6-cx,y*TS+6-cy,4,4)})}
  const ents=npcs.filter(n=>!n.hidden).concat([p]).sort((a,b)=>a.py-b.py);
  ents.forEach(e=>{
    const x=Math.round(e.px-cx),y=Math.round(e.py-cy);if(x<-20||y<-30||x>VW*TS+20||y>VH*TS+20)return;
    if(!e.obj){ctx.fillStyle="rgba(0,0,0,.28)";ctx.fillRect(x+3,y+14,10,3)}
    if(e.obj)LV.drawObj(ctx,e,x,y);else ctx.drawImage(sprite(e.pal,e.dir,e.frame),x,y-2);
  });
  LV.overhead(cx,cy);
  if(!S.busy){
    npcs.forEach(n=>{if(n.hidden)return;const x=Math.round(n.px-cx),y=Math.round(n.py-cy);if(x<-20||y<-30||x>VW*TS||y>VH*TS)return;LV.mark(n,x,y)});
    if(tg){const x=tg.px+8-cx,y=tg.py+8-cy,H=VH*TS;
      const onScreen=x>4&&x<VW*TS-4&&y>24&&y<H-8;
      if(!onScreen){
        const x0=14,x1=VW*TS-14,y0=20,y1=H-16,vx=(x0+x1)/2,vy=(y0+y1)/2,ang=Math.atan2(y-vy,x-vx);
        let d=ang-S.arrowAng;while(d>Math.PI)d-=2*Math.PI;while(d<-Math.PI)d+=2*Math.PI;S.arrowAng+=d*.12;
        const a=S.arrowAng,rr=Math.min((x1-vx)/Math.abs(Math.cos(a)||1e-6),(y1-vy)/Math.abs(Math.sin(a)||1e-6));
        const wob=Math.sin(tick/20)*2,ax=vx+Math.cos(a)*(rr+wob),ay=vy+Math.sin(a)*(rr+wob);
        ctx.save();ctx.translate(ax,ay);ctx.rotate(a);
        ctx.fillStyle="#11111F";ctx.beginPath();ctx.moveTo(12,0);ctx.lineTo(-8,-10);ctx.lineTo(-3,0);ctx.lineTo(-8,10);ctx.closePath();ctx.fill();
        ctx.fillStyle=tg.exit?"#7CD6FF":"#FFD23F";ctx.beginPath();ctx.moveTo(8,0);ctx.lineTo(-6,-7);ctx.lineTo(-2,0);ctx.lineTo(-6,7);ctx.closePath();ctx.fill();
        ctx.restore();
      }else S.arrowAng=Math.atan2(y-H/2,x-VW*TS/2);
    }
  }
  if(S.alert)drawBang(p.px-cx,p.py-cy,"#FF5A5A");
}
function loop(){update();draw();requestAnimationFrame(loop)}

/* ===== MÀN 1 · KHU PHỐ (luật chơi bản dễ: 4 người cần giúp + 2 câu đố vui + 1 sự kiện) ===== */
L1.nEv=1;
const Q1=["cuba","taphoa","banh","xeom"];
const TIP1={
 cohx:"Cô mới được Công an phường kích hoạt tài khoản VNeID mức 2, giờ đi làm giấy tờ chỉ cần mở điện thoại, khỏi mang bản photo. Tiện ghê con!",
 bem:"Cô giáo nói ngày 10 tháng 10 là Ngày Chuyển đổi số quốc gia đó! Em còn được học cách đặt mật khẩu thật khó đoán nữa nè.",
 cafe:"Quán chú giờ khách quét mã QR trả tiền gần hết. Chú dặn khách nhìn đúng tên người nhận rồi mới bấm chuyển nha.",
 ship:"Anh nhận đơn, giao hàng, nhận tiền đều trên ứng dụng. Ai nhắn xin mã OTP là anh chặn liền, không đưa đâu!",
 cns2:"Hôm nay bàn hỗ trợ của Tổ công nghệ số mở cả ngày. Bà con cần cài VNeID, nộp hồ sơ trực tuyến cứ ra đây, tụi mình chỉ miễn phí.",
 cns3:"Mỗi người dân một kỹ năng số, mỗi gia đình thêm một tiện ích số! Bạn rủ người nhà cùng học trên nền tảng Bình dân học vụ số nha."
};
L1.init=()=>{
  const qs=shuffle(BANK1.slice());let i=0;S.helped=0;S.dovui=false;
  npcs.forEach(n=>{if(n.kind!=="quiz")return;if(Q1.includes(n.id))S.quiz[n.id]=qs[i++];else{n.kind="idle";n.line=TIP1[n.id]||"Chúc bạn một ngày 10/10 thật vui!"}});
};
L1.quest=()=>!S.dovui?"Màn 1 · Gặp <b>Tổ công nghệ số</b>":S.helped<4?`Màn 1 · Giúp bà con có dấu <b>?</b> vàng: <b>${S.helped}/4</b>`:"Màn 1 · Xong! Bấm <b>Đi tiếp</b> để ra <b>đầu hẻm</b> lên phường";
L1.target=function(){
  if(!S.dovui)return npcs.find(n=>n.id==="cns1");
  const p=S.p;let best=null,bd=1e9;
  npcs.forEach(n=>{if(n.kind!=="quiz"||S.done.has(n.id))return;const d=Math.hypot(n.x-p.x,n.y-p.y);if(d<bd){bd=d;best=n}});
  return best||{x:35,y:12,px:35*TS,py:12.5*TS,exit:true};
};
L1.exitGoal=(x,y)=>x===35&&(y===12||y===13);
L1.mark=(n,x,y)=>{
  if(n.kind==="quiz"){if(S.done.has(n.id))drawSmile(x,y);else drawQ(x,y)}
  else if(n.kind==="intro"){if(!S.dovui)drawBang(x,y,"#7CD6FF")}
  else if(n.kind==="hong"&&!S.joined.has(n.pair)&&HONG[n.pair].lines[0][0]===n.id)drawBubble(x+8,y);
  else if(n.kind==="idle"&&!S.joined.has(n.id))drawBubble(x,y);
};
L1.talk=async function(n){
  if(n.kind==="quiz"){
    if(S.done.has(n.id)){await say(n,n.thanks);return}
    await quiz(n,S.quiz[n.id],n.lead);
    S.done.add(n.id);S.helped++;updHud();
    await say(n,n.thanks);
    if(S.helped===2)queueEvent(2);
    if(S.helped===4){sfx("win");toast("Đã giúp đủ 4 bà con!","good");await say("Hướng dẫn","Tuyệt vời! Bạn đã giúp đủ 4 bà con. Bấm Đi tiếp để ra đầu hẻm lên phường nhé!")}
    return;
  }
  if(n.kind==="hong"){
    const H=HONG[n.pair];
    if(S.joined.has(n.pair)){await say(n,"Tụi tui đang nói chuyện vui lắm, cảm ơn bạn ghé nghe nha!");return}
    const k=await ask("Hóng chuyện","Ở "+H.title+" đang có người trò chuyện. Bạn có muốn nghe không?",["👂 Nghe","Bỏ qua"]);
    if(k===1)return;
    for(const [id,l] of H.lines){const sp=npcs.find(x=>x.id===id);await say(sp||id,l)}
    S.joined.add(n.pair);sfx("ok");toast("Hóng chuyện +1","good");return;
  }
  if(n.kind==="idle"){await say(n,n.line);S.joined.add(n.id);return}
  if(n.kind==="intro"){
    if(!S.dovui){await intro();return}
    await say(n,S.helped<4?`Còn ${4-S.helped} bà con có dấu ? vàng đang chờ bạn giúp đó!`:"Bạn giúp đủ rồi, lên phường thôi! Bấm Đi tiếp để ra đầu hẻm nha.");
  }
};
L1.onStep=p=>{if(p.x>=35&&!S.ended&&!S.busy){onExit1();return true}return false};
async function onExit1(){
  if(S.helped<4){
    S.busy=true;held=null;
    await say("Bác xe ôm đầu hẻm",`Khoan đã con! Trong hẻm còn ${4-S.helped} người đang cần con giúp (có dấu ? vàng). Giúp xong rồi hẵng lên phường nha.`);
    closeDlg();startMove(S.p,1);S.busy=false;return;
  }
  if(S.evDone<S.events.length){S.pending=null;await runEvent(S.events[S.evDone]);return}
  S.ended=true;S.busy=true;held=null;music(false);sfx("win");
  await say("Hướng dẫn","Bạn ra tới đầu hẻm rồi! Cùng xem kết quả Màn 1 nhé…");closeDlg();
  S.res[1]={correct:S.correct,score:S.score-S.lvScore0,joined:S.joined.size};S.rw[1]=S.correct>=QNEED;
  showLvEnd(1);
}

/* ===== MỞ ĐẦU ===== */
const canStart=()=>{$("start").disabled=!$("pname").value.trim()};
$("pname").oninput=canStart;
$("pname").value=store.get("pl_name","");canStart();
$("pname").addEventListener("keydown",e=>{if(e.key==="Enter"&&!$("start").disabled)$("start").click()});
$("start").onclick=async()=>{
  const nm=$("pname").value.trim().replace(/[<>]/g,"").slice(0,20);store.set("pl_name",nm);
  newGame(nm);$("title").hidden=true;ac();sfx("win");music(true);pts();fitStage();
  await intro();
};
async function intro(){
  S.busy=true;
  await say(S.name,"Ủa, sao hôm nay khu phố có băng rôn, cờ phướn rộn ràng vậy ta? Có chuyện gì mà vui vậy?");
  const n=npcs.find(x=>x.id==="cns1");face(n,S.p);S.p.dir=2;
  await say(n,"Chào bạn! Mình là thành viên Tổ công nghệ số cộng đồng của khu phố nè.");
  await say(n,"Hôm nay 10 tháng 10 là Ngày Chuyển đổi số quốc gia. Chuyển đổi số giúp bà con làm thủ tục ngay trên điện thoại, trả tiền bằng mã QR, học kỹ năng số miễn phí, đỡ tốn công đi lại.");
  await say(n,"Nhưng dùng dịch vụ số cũng phải biết cách cho an toàn, kẻo bị kẻ gian lừa. Nên hôm nay cả khu phố cùng học, cùng giúp nhau đó!");
  await say(n,"Tặng bạn 2 vật phẩm tuyên truyền. Mỗi vật phẩm là 1 lượt gợi ý 💡, dùng để bỏ bớt 1 đáp án sai khi gặp câu khó.");
  closeDlg();await giveHint();await giveHint();
  await say(n,"Trước khi đi, mình đố bạn 2 câu vui về Ngày 10/10 nha!");
  const qs=shuffle(DOVUI.slice()).slice(0,2);
  for(let i=0;i<2;i++)await quiz(n,qs[i],`Đố vui ${i+1}/2:`);
  S.dovui=true;S.joined.add("dovui");updHud();
  await say(n,"Giỏi lắm! Giờ nhờ bạn đi giúp bà con trong hẻm: có 4 người đang cần giúp, ai có dấu ? vàng trên đầu là đang chờ bạn đó. Giúp xong, dấu ? sẽ thành mặt cười.");
  await say(n,"Giúp đủ 4 người rồi ra đầu hẻm bên phải để lên phường. Đường đi có thể gặp chiêu lừa đảo, cẩn thận nha!");
  await ask(n,"Bạn sẵn sàng chưa?",["▶ Bắt đầu chơi"]);
  closeDlg();n.dir=n.home;S.busy=false;updHud();
  if(!store.get("dc_tut1",false)){store.set("dc_tut1",true);coach("#go","<b>Hướng dẫn 3/3.</b> Bấm nút <b>Đi tiếp</b>, nhân vật sẽ tự đi tới người cần gặp và nói chuyện.")}
}
