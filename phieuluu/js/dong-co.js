/* ĐỘNG CƠ GAME: trạng thái, âm thanh, hội thoại, điều khiển, sự kiện, vẽ màn hình */

/* ===== TRẠNG THÁI ===== */
let S=null;const npcs=[];
const STEP_FR=11; /* số khung hình mỗi ô: chậm hơn bản cũ khoảng 30% */
function newGame(name){
  const types=shuffle(Object.keys(EVTS));
  S={name:name||"Bạn",score:0,hints:0,slog:shuffle(SLOGANS.map((_,i)=>i)),items:0,evTypes:types,
     pending:null,busy:true,ended:false,arrowAng:0,res:{},
     p:{x:0,y:0,px:0,py:0,dir:0,frame:0,moving:null,walk:0,pal:PAL.me}};
  loadLevel(L1);
}
/* nạp màn chơi: bản đồ, NPC, vị trí xuất phát */
function loadLevel(L){
  LV=L;MW=L.MW;MH=L.MH;map=new Uint8Array(MW*MH);L.build();renderMap();
  npcs.length=0;
  L.npcDef.forEach(d=>npcs.push({...d,pal:d.obj?null:PAL[d.pal||d.id],px:d.x*TS,py:d.y*TS,frame:0,moving:null,home:d.dir}));
  const p=S.p;Object.assign(p,{x:L.start.x,y:L.start.y,px:L.start.x*TS,py:L.start.y*TS,dir:L.start.dir,moving:null});
  S.done=new Set();S.correct=0;S.answered=0;S.joined=new Set();S.quiz={};S.evDone=0;S.pending=null;S.ended=false;S.lvScore0=S.score;
  S.events=S.evTypes.splice(0,2).map(t=>({type:t,...EVTS[t][Math.random()*EVTS[t].length|0]}));
  if(L.init)L.init();
  updHud();
}
L1.init=()=>{
  const qs=shuffle(BANK1.slice()).slice(0,10);
  NPCDEF.filter(d=>d.kind==="quiz").forEach((d,i)=>S.quiz[d.id]=qs[i]);S.dovui=null;
};
L1.quest=()=>S.answered<10?`Màn 1 · Giúp bà con <b>${S.answered}/10</b> ▾`:`Ra <b>đầu hẻm</b> bên phải ➜ ▾`;
L1.more=()=>`• Người có dấu <b>!</b> vàng đang cần bạn giúp.<br>• Bong bóng 💬 là chỗ đang có chuyện để hóng.<br>• Gặp ai đó, bấm <b>F</b> hoặc chạm vào người đó để nói chuyện.<br>• Bấm 💡 trong câu hỏi để loại 1 đáp án sai.<br>• Đúng +10 ★, sai −5 ★. Hóng chuyện: ${S.joined.size}/10.`;
const fmt=t=>String(t).replace(/\{name\}/g,S?S.name:"bạn");
function updHud(){
  if(!S)return;
  $("quest").innerHTML=LV.quest()+`<div class="more">${LV.more()}</div>`;
  $("hintc").textContent="💡 "+S.hints;
}
function pts(delta){const e=$("pts");e.textContent="★ "+S.score;e.classList.remove("bump");void e.offsetWidth;e.classList.add("bump")}
function addScore(d){S.score=Math.max(0,S.score+d);pts()}
function toast(t,cls){const d=document.createElement("div");d.className="toast "+(cls||"");d.textContent=t;$("stage").appendChild(d);setTimeout(()=>d.remove(),1900)}
$("quest").onclick=()=>$("quest").classList.toggle("open");

/* ===== ÂM THANH & NHẠC NỀN 8-BIT (tạo bằng code, không dùng file nhạc) ===== */
let AC=null,soundOn=store.get("pl_sound",true);
function ac(){try{AC=AC||new (window.AudioContext||window.webkitAudioContext)();if(AC.state==="suspended")AC.resume()}catch(e){}return AC}
function tone(f,t,d,type,vol){const o=AC.createOscillator(),g=AC.createGain();o.type=type;o.frequency.value=f;g.gain.setValueAtTime(vol,t);g.gain.exponentialRampToValueAtTime(.0001,t+d);o.connect(g).connect(AC.destination);o.start(t);o.stop(t+d+.02)}
function sfx(k){
  if(!soundOn||!ac())return;
  const seq={blip:[[880,.03]],ok:[[660,.08],[880,.08],[1320,.14]],no:[[220,.12],[150,.2]],win:[[523,.08],[659,.08],[784,.08],[1047,.24]],ring:[[1200,.08],[900,.08],[1200,.08],[900,.08]],bump:[[120,.05]],alert:[[1000,.06],[1400,.1]],item:[[784,.06],[988,.06],[1175,.06],[1568,.2]]}[k]||[[600,.05]];
  let t=AC.currentTime;seq.forEach(([f,d])=>{tone(f,t,d,"square",.05);t+=d});
}
const mid=n=>440*Math.pow(2,(n-69)/12);
/* giai điệu vui tươi cho Màn 1 (tự sáng tác) */
const MEL=[72,0,76,79,76,0,72,74,76,0,74,72,69,0,72,0, 74,0,77,81,79,77,76,74,72,0,76,0,79,0,0,0, 72,0,76,79,81,79,76,74,72,74,76,77,79,0,76,0, 74,74,76,74,72,0,67,0,72,0,0,0,0,0,0,0];
const BAS=[48,48,55,55,45,45,52,52,50,50,57,57,43,43,48,48];
/* giai điệu Màn 2: nhẹ nhàng, chậm hơn */
const MEL2=[67,0,72,0,71,72,74,0,72,0,69,0,67,0,0,0, 65,0,69,0,72,74,72,0,71,0,67,0,69,0,0,0, 67,0,72,0,76,74,72,0,74,0,77,76,74,0,72,0, 71,0,72,74,72,0,67,0,72,0,0,0,0,0,0,0];
const BAS2=[48,48,45,45,41,41,43,43,48,48,45,45,43,43,48,48];
let musT=null,musStep=0,musNext=0;
function music(on){
  const M=LV&&LV.id===2?MEL2:MEL,B=LV&&LV.id===2?BAS2:BAS,st=LV&&LV.id===2?.24:.2;
  clearInterval(musT);musT=null;if(!on||!soundOn||!ac())return;
  musNext=AC.currentTime+.1;
  musT=setInterval(()=>{if(!AC)return;while(musNext<AC.currentTime+.25){const n=M[musStep%M.length];if(n)tone(mid(n),musNext,.16,"square",.022);if(musStep%4===0)tone(mid(B[(musStep/4|0)%B.length]),musNext,.3,"triangle",.05);musStep++;musNext+=st}},60);
}
$("snd").onclick=()=>{soundOn=!soundOn;store.set("pl_sound",soundOn);$("snd").textContent=soundOn?"♪":"×";music(soundOn&&S&&!S.ended)};
$("snd").textContent=soundOn?"♪":"×";
const vib=p=>{try{navigator.vibrate&&navigator.vibrate(p)}catch(e){}};

/* ===== VẬT PHẨM GỢI Ý & KHẨU HIỆU ===== */
function giveHint(why){
  S.hints++;S.items++;updHud();sfx("item");vib(60);
  const idx=S.slog.length?S.slog.shift():Math.random()*SLOGANS.length|0;
  const item=ITEMS[(S.items-1)%ITEMS.length];
  return new Promise(res=>{
    const d=document.createElement("div");d.className="slog";
    const t=esc(SLOGANS[idx]),lg=document.querySelector(".logo img").src;
    const art={
     "Băng rôn tuyên truyền":`<div class="it it-banner"><span class="pole l"></span><span class="pole r"></span><span class="rope"></span><div class="cloth">${t}</div></div>`,
     "Áp phích Ngày 10/10":`<div class="it it-poster"><div class="top">Hưởng ứng<b>NGÀY CHUYỂN ĐỔI SỐ 10/10</b><span class="city"></span></div><div class="body">${t}</div><div class="foot">Phường Gia Định · 2026</div></div>`,
     "Cờ phướn chuyển đổi số":`<div class="it it-phuon"><span class="rod"></span><div class="cloth"><span class="h">CHUYỂN ĐỔI SỐ</span>${t}</div></div>`,
     "Tờ rơi Công dân số":`<div class="it it-flyer"><div class="a">${t}</div><div class="b"><b>Công dân số<br>phường Gia Định</b><span>Học kỹ năng số, dùng dịch vụ số an toàn.</span><span class="qr"></span></div></div>`,
     "Standee Ngày hội":`<div class="it it-standee"><div class="board"><img src="${lg}" alt=""><span class="h">NGÀY HỘI 10/10</span><br>${t}</div></div>`
    }[item];
    d.innerHTML=`<div class="lbl">🎁 Nhận: ${esc(item)} · +1 💡 gợi ý${why?" · "+esc(why):""}</div>${art}<div class="s">Bấm để tiếp tục</div>`;
    $("stage").appendChild(d);
    const done=()=>{if(!d.isConnected)return;d.remove();res()};
    d.addEventListener("click",done);setTimeout(()=>{S._slogClose=done},250);
  });
}

/* ===== HỘI THOẠI ===== */
let D={res:null,typing:null,choices:null,sel:0};
function openDlg(){$("ctrl").hidden=true;$("dlg").hidden=false;held=null;resetJoy()}
function closeDlg(){$("dlg").hidden=true;$("dhint").hidden=true;$("ctrl").hidden=false}
function typeText(text){
  const el=$("dtxt");el.textContent="";let i=0;clearInterval(D.typing);$("dmore").hidden=true;
  return new Promise(res=>{D.typing=setInterval(()=>{i+=2;el.textContent=text.slice(0,i);if(i%8===0)sfx("blip");if(i>=text.length){clearInterval(D.typing);D.typing=null;res()}},20);D.skip=()=>{clearInterval(D.typing);D.typing=null;el.textContent=text;res()}});
}
const whoName=n=>typeof n==="string"?n:n.name;
async function say(n,text){
  openDlg();$("dwho").textContent=whoName(n);$("dch").innerHTML="";D.choices=null;$("dhint").hidden=true;
  await typeText(fmt(text));$("dmore").hidden=false;
  return new Promise(r=>D.res=r);
}
/* ask: opts là mảng chữ; hintCfg={correct:k} để cho phép dùng gợi ý */
async function ask(n,text,opts,hintCfg){
  openDlg();$("dwho").textContent=whoName(n);$("dch").innerHTML="";D.choices=null;$("dhint").hidden=true;
  await typeText(fmt(text));
  return new Promise(r=>{
    const gone=new Set();D.sel=0;D.choices=opts;
    const vis=()=>opts.map((_,k)=>k).filter(k=>!gone.has(k));
    const draw=()=>{$("dch").innerHTML=opts.map((o,k)=>`<button class="choice ${k===D.sel?"sel":""} ${gone.has(k)?"gone":""}" type="button" data-k="${k}">${esc(fmt(o))}</button>`).join("");
      $("dch").querySelectorAll("button").forEach(b=>b.onclick=e=>{e.stopPropagation();pick(+b.dataset.k)});
      if(hintCfg){const hb=$("dhint");hb.hidden=false;hb.disabled=S.hints<=0||gone.size>=opts.length-2;hb.textContent=`💡 Dùng gợi ý (còn ${S.hints})`}};
    const pick=k=>{if(gone.has(k))return;D.choices=null;D.pickFn=null;D.move=null;D.useHint=null;$("dch").innerHTML="";$("dhint").hidden=true;sfx("blip");r(k)};
    D.move=s=>{const v=vis();let i=v.indexOf(D.sel);i=(i+s+v.length)%v.length;D.sel=v[i];draw();sfx("blip")};
    D.useHint=()=>{if(!hintCfg||S.hints<=0)return;const wrong=opts.map((_,k)=>k).filter(k=>k!==hintCfg.correct&&!gone.has(k));if(wrong.length<=1&&gone.size>=opts.length-2)return;const k=wrong[Math.random()*wrong.length|0];if(k==null)return;gone.add(k);S.hints--;updHud();sfx("item");if(D.sel===k)D.sel=vis()[0];draw()};
    $("dhint").onclick=e=>{e.stopPropagation();D.useHint&&D.useHint()};
    D.draw=draw;D.pickFn=pick;draw();
  });
}
function advance(){
  if(S&&S._slogClose){const f=S._slogClose;S._slogClose=null;f();return true}
  if($("dlg").hidden)return false;
  if(D.typing){D.skip();return true}
  if(D.choices){D.pickFn(D.sel);return true}
  if(D.res){const r=D.res;D.res=null;r()}
  return true;
}
$("dlg").addEventListener("click",()=>advance());
/* câu hỏi chấm điểm: đúng +10, sai −5, có giải thích */
async function quiz(n,qz,pre){
  const opts=shuffle([qz.a,...qz.w]);const correct=opts.indexOf(qz.a);
  const k=await ask(n,(pre?pre+"\n":"")+qz.q,opts,{correct});
  const law=qz.law?"\n📘 Căn cứ: "+qz.law:"";
  if(k===correct){addScore(10);sfx("ok");vib(40);toast("+10 ★","good");await say(n,"Chính xác! "+qz.ex+law);return true}
  addScore(-5);sfx("no");vib([100,50,100]);const st=$("stage");st.classList.remove("shake");void st.offsetWidth;st.classList.add("shake");toast("−5 ★","badt");
  await say(n,"Chưa đúng rồi. Đáp án đúng: “"+qz.a+"”.\n"+qz.ex+law);return false;
}

/* ===== DI CHUYỂN ===== */
const DIRS=[[0,1],[-1,0],[1,0],[0,-1]];
function solid(x,y,self){
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

/* ===== ĐIỀU KHIỂN: joystick xanh, nút mũi tên, phím F ===== */
let held=null;
const KEYS={ArrowDown:0,ArrowLeft:1,ArrowRight:2,ArrowUp:3,s:0,a:1,d:2,w:3,S:0,A:1,D:2,W:3};
addEventListener("keydown",e=>{
  if(!S||!$("title").hidden||!$("end").hidden||!$("m1end").hidden||!$("m2end").hidden||!$("lbv").hidden)return;
  if(e.key in KEYS){e.preventDefault();
    if(!$("dlg").hidden&&D.choices){const k=KEYS[e.key];D.move(k===3||k===1?-1:1);return}
    held=KEYS[e.key];return}
  if(e.key==="h"||e.key==="H"){if(D.useHint&&D.choices){e.preventDefault();D.useHint()}return}
  if(e.key===" "||e.key==="Enter"||e.key==="f"||e.key==="F"){e.preventDefault();action()}
});
addEventListener("keyup",e=>{if(e.key in KEYS&&held===KEYS[e.key])held=null});
const joy=$("joy"),knob=$("knob");let joyId=null;
function resetJoy(){joyId=null;knob.style.transform="";if(!$("dpad").hidden)return;held=null}
function joyMove(e){
  const r=joy.getBoundingClientRect(),cx=r.left+r.width/2,cy=r.top+r.height/2;
  let dx=e.clientX-cx,dy=e.clientY-cy;const m=Math.hypot(dx,dy),max=r.width/2-14;
  if(m>max){dx*=max/m;dy*=max/m}
  knob.style.transform=`translate(${dx}px,${dy}px)`;
  if(m<12){held=null;return}
  held=Math.abs(dx)>Math.abs(dy)?(dx<0?1:2):(dy<0?3:0);
}
joy.addEventListener("pointerdown",e=>{e.preventDefault();joyId=e.pointerId;joy.setPointerCapture(e.pointerId);joyMove(e)});
joy.addEventListener("pointermove",e=>{if(e.pointerId===joyId)joyMove(e)});
["pointerup","pointercancel","lostpointercapture"].forEach(t=>joy.addEventListener(t,e=>{if(e.pointerId===joyId){joyId=null;held=null;knob.style.transform=""}}));
document.querySelectorAll(".dpad button").forEach(b=>{
  const d=+b.dataset.d;
  b.addEventListener("pointerdown",e=>{e.preventDefault();b.setPointerCapture(e.pointerId);held=d;b.classList.add("on")});
  const up=()=>{if(held===d)held=null;b.classList.remove("on")};
  ["pointerup","pointercancel","lostpointercapture"].forEach(t=>b.addEventListener(t,up));
});
function setPad(kind){$("joy").hidden=kind==="dpad";$("dpad").hidden=kind!=="dpad";store.set("pl_pad",kind);held=null}
setPad(store.get("pl_pad","joy"));
$("swap").onclick=()=>setPad($("dpad").hidden?"dpad":"joy");
$("fbtn").addEventListener("pointerdown",e=>{e.preventDefault();action()});
/* chạm thẳng vào NPC trên màn hình để nói chuyện */
$("cv").addEventListener("pointerdown",e=>{
  if(!S||S.busy||!$("dlg").hidden)return;
  const r=cv.getBoundingClientRect(),[cx,cy]=camera();
  const mx=(e.clientX-r.left)/r.width*cv.width+cx,my=(e.clientY-r.top)/r.height*cv.height+cy;
  const n=npcs.find(n=>!n.hidden&&!n.temp&&mx>=n.px-2&&mx<=n.px+18&&my>=n.py-6&&my<=n.py+18);
  if(!n)return;
  if(Math.max(Math.abs(n.x-S.p.x),Math.abs(n.y-S.p.y))>2){toast("Lại gần hơn chút nha!");return}
  const save=S.p.dir;S.p.dir=Math.abs(n.x-S.p.x)>Math.abs(n.y-S.p.y)?(n.x<S.p.x?1:2):(n.y<S.p.y?3:0);
  const near=nearNpc();if(near!==n){S.p.dir=save;toast("Lại gần hơn chút nha!");return}
  action();
});

/* NPC ở cạnh (kể cả chéo), ưu tiên người đang đối mặt */
function nearNpc(){
  if(!S)return null;const p=S.p;const [fx,fy]=DIRS[p.dir];
  let best=null,bs=1e9;
  npcs.forEach(n=>{if(n.hidden||n.temp)return;
    const dx=n.x-p.x,dy=n.y-p.y,ch=Math.max(Math.abs(dx),Math.abs(dy));
    /* đứng cạnh hoặc chéo, hoặc cách 2 ô theo đường thẳng (kể cả khi bị bàn, người khác chắn) */
    const ok=ch===1||(ch===2&&(dx===0||dy===0));if(!ok)return;
    const s=ch*10+((dx===fx*ch&&dy===fy*ch)?0:1)+Math.hypot(n.px-p.px,n.py-p.py)/100;if(s<bs){bs=s;best=n}});
  return best;
}
const face=(n,p)=>{const dx=p.x-n.x,dy=p.y-n.y;n.dir=Math.abs(dx)>Math.abs(dy)?(dx<0?1:2):(dy<0?3:0)};
async function action(){
  if(!S)return;
  if(advance())return;
  if(S.busy||S.ended)return;
  if(S.p.moving){S.p.onArrive=()=>action();return}
  const n=nearNpc();if(!n)return;
  S.busy=true;held=null;face(n,S.p);
  const pdx=n.x-S.p.x,pdy=n.y-S.p.y;S.p.dir=Math.abs(pdx)>Math.abs(pdy)?(pdx<0?1:2):(pdy<0?3:0);
  try{await talk(n)}finally{closeDlg();if(!n.temp)n.dir=n.home;S.busy=false;updHud()}
}
L1.talk=async function(n){
  if(n.kind==="quiz"){
    if(S.done.has(n.id)){await say(n,n.thanks);return}
    const ok=await quiz(n,S.quiz[n.id],n.lead);
    S.done.add(n.id);S.answered++;if(ok)S.correct++;
    updHud();
    if(S.answered===10){sfx("win");toast("Đã giúp đủ 10 người!","good");await say("Gợi ý","Tuyệt vời! Bạn đã giúp đủ 10 người. Giờ ra đầu hẻm bên phải để lên phường nhé!")}
    else if(S.answered===3||S.answered===7){const ev=S.events[S.evDone];if(ev)S.pending={ev,walk:3+(Math.random()*4|0)}}
    return;
  }
  if(n.kind==="hong"){
    const H=HONG[n.pair];
    if(S.joined.has(n.pair)){await say(n,"Tụi tui đang nói chuyện vui lắm, cảm ơn bạn ghé nghe nha!");return}
    const k=await ask("Hóng chuyện","Ở "+H.title+" đang có người trò chuyện. Bạn muốn…",["👂 Ngồi hóng","🚶 Đi tiếp"]);
    if(k===1){await say(S.name,"Thôi, mình đi tiếp đã.");return}
    for(const [id,l] of H.lines){const sp=npcs.find(x=>x.id===id);if(sp)face(sp,id===H.lines[0][0]?npcs.find(x=>x.id===H.lines[1][0]):npcs.find(x=>x.id===H.lines[0][0]));await say(sp||id,l)}
    S.joined.add(n.pair);sfx("ok");toast("Hóng chuyện +1","good");return;
  }
  if(n.kind==="idle"){await say(n,n.line);if(!S.joined.has(n.id)){S.joined.add(n.id);toast("Trò chuyện +1","good")}return}
  if(n.kind==="intro"){
    if(S.dovui===null){await dovuiOffer(n);return}
    await say(n,S.answered<10?`Bà con có dấu ! đang cần bạn giúp đó. Còn ${10-S.answered} người nữa nha!`:"Bạn giúp đủ rồi, lên phường thôi! Ra đầu hẻm bên phải nha.");
  }
};
const talk=n=>LV.talk(n);
async function dovuiOffer(n){
  const k=await ask(n,"Bạn có muốn chơi đố vui 3 câu về Ngày 10/10 không? Đúng mỗi câu +10 ★, sai −5 ★.",["🎯 Chơi luôn","🏃 Tôi đang vội lên phường"]);
  if(k===1){S.dovui=false;await say(n,"Không sao, lúc nào rảnh quay lại tìm mình nha!");return}
  S.dovui=true;S.joined.add("dovui");
  const qs=shuffle(DOVUI.slice()).slice(0,3);let ok=0;
  for(let i=0;i<3;i++){if(await quiz(n,qs[i],`Câu ${i+1}/3:`))ok++}
  await say(n,ok===3?"Đúng cả 3 câu, bạn đúng là công dân số!":`Bạn đúng ${ok}/3 câu. Giỏi lắm!`);
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
  S.evDone++;
  if(ok){S.evOk++;toast("Né bẫy thành công!","good");closeDlg();await giveHint("Né bẫy thành công")}
  else{closeDlg()}
}
async function runEvent(ev){
  S.busy=true;held=null;resetJoy();
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
    $("stage").appendChild(d);
    await new Promise(r=>d.querySelector("button").onclick=r);d.remove();
    await evQuiz(ev.app+" lạ",ev);
  }else{
    sfx("ring");vib([200,100,200,100,200]);
    const ringT=setInterval(()=>sfx("ring"),1400);
    if(ev.type==="call"){
      await phoneUI(`<div class="sub">Cuộc gọi đến…</div><div class="av">?</div><div class="nm">${esc(ev.who)}</div><div class="sub">${esc(ev.sub)}</div><button class="pbtn" type="button">Nghe máy</button>`,true);
      clearInterval(ringT);$("phonebox").hidden=true;await say(ev.who,ev.line);
    }else if(ev.type==="sms"){
      await phoneUI(`<div class="sub">Tin nhắn mới · bây giờ</div><div class="nm">${esc(ev.who)}</div><div class="sms">${esc(ev.sms)}<span class="lnk">${esc(ev.link)}</span></div><button class="pbtn" type="button">Xử lý tin nhắn</button>`,true);
      clearInterval(ringT);$("phonebox").hidden=true;
    }else if(ev.type==="zalo"){
      clearInterval(ringT);
      const p=phoneUI(`<div class="zhead">💬 ${esc(ev.who)}</div><div class="chat" id="chat"></div><button class="pbtn" type="button" id="zbtn" hidden>Trả lời</button>`,false);
      for(const m of ev.msgs){const c=$("chat");const t=document.createElement("div");t.className="typing";t.textContent="•••";c.appendChild(t);await sleep(900);t.remove();const mm=document.createElement("div");mm.className="m";mm.textContent=m;c.appendChild(mm);sfx("blip")}
      $("zbtn").hidden=false;await p;$("phonebox").hidden=true;
    }else if(ev.type==="video"){
      await phoneUI(`<div class="sub">Cuộc gọi video đến…</div><div class="av">📹</div><div class="nm">${esc(ev.who)}</div><button class="pbtn" type="button">Nghe máy</button>`,true);
      clearInterval(ringT);
      const p=phoneUI(`<div class="vid"><canvas id="vcv" width="48" height="64"></canvas><div class="rec">● ${esc(ev.who)}</div></div><div class="sms" id="vsub">…</div><button class="pbtn" type="button" id="vbtn" hidden>Cuộc gọi đã kết thúc · Xử lý</button>`,false);
      let run=true;const vc=$("vcv").getContext("2d");let f=0;
      (function anim(){if(!run)return;f++;drawFace(vc,f);requestAnimationFrame(anim)})();
      const words=ev.line.split(" ");for(let i=1;i<=words.length;i++){$("vsub").textContent=words.slice(0,i).join(" ");await sleep(170)}
      await sleep(600);$("vbtn").hidden=false;await p;run=false;$("phonebox").hidden=true;
    }
    await evQuiz(ev.who,ev);
  }
  }finally{S.busy=false;closeDlg()}
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

/* ===== VÒNG LẶP ===== */
const cv=$("cv"),ctx=cv.getContext("2d");
function fitStage(){
  const W=innerWidth-12,H=innerHeight-12;
  VH=Math.max(12,Math.min(18,Math.round(VW*H/W)));
  if(cv.height!==VH*TS)cv.height=VH*TS;ctx.imageSmoothingEnabled=false;
  const st=$("stage");st.style.aspectRatio=`${VW*TS}/${VH*TS}`;st.style.width=Math.min(W,H*VW/VH,620)+"px";
}
fitStage();addEventListener("resize",fitStage);
let tick=0;
function camera(){const p=S.p;
  return [Math.max(0,Math.min(MW*TS-VW*TS,Math.round(p.px+8-VW*TS/2))),Math.max(0,Math.min(MH*TS-VH*TS,Math.round(p.py+8-VH*TS*.42)))]}
function update(){
  tick++;if(!S)return;
  const p=S.p;
  if(stepEntity(p)){
    if(LV.onStep&&LV.onStep(p)){}
    else if(S.pending&&--S.pending.walk<=0&&!S.busy){const ev=S.pending.ev;S.pending=null;runEvent(ev)}
  }
  npcs.forEach(stepEntity);
  if(!p.moving&&held!==null&&!S.busy&&$("dlg").hidden&&$("phonebox").hidden&&!S.ended){
    if(!startMove(p,held)){p.dir=held;if(tick%18===0)sfx("bump")}
  }
  if(LV.tick)LV.tick();
  if(S.alert)S.alert--;
  const near=!S.busy&&$("dlg").hidden?nearNpc():null;$("fbtn").classList.toggle("near",!!near);
  const [,cy]=camera();$("hud").classList.toggle("dim",p.py-cy<52&&!$("quest").classList.contains("open"));
}
L1.onStep=p=>{if(p.x>=35&&!S.ended){onExit();return true}return false};
L1.tick=()=>{if(tick%170===0&&!S.busy)npcs.forEach(n=>{if(n.id==="bem"&&!n.moving){const d=Math.random()*4|0;const [dx,dy]=DIRS[d];const tx=n.x+dx,ty=n.y+dy;if(tx===12&&ty>=19&&ty<=23)startMove(n,d,16)}})};
async function onExit(){
  if(S.answered<10){
    S.busy=true;held=null;
    await say("Bác xe ôm đầu hẻm",`Khoan đã con! Trong hẻm còn ${10-S.answered} người đang cần con giúp (có dấu ! vàng). Giúp xong rồi hẵng lên phường nha.`);
    closeDlg();startMove(S.p,1);S.busy=false;return;
  }
  S.ended=true;S.busy=true;held=null;music(false);sfx("win");
  await say("Gợi ý","Bạn ra tới đầu hẻm rồi! Cùng xem bà con khu phố đánh giá bạn thế nào nhé…");closeDlg();
  S.res[1]={correct:S.correct,score:S.score-S.lvScore0,joined:S.joined.size};
  showM1End();
}
function drawBang(x,y,col){ // dấu "!" to, nảy, có vầng sáng
  const b=Math.round(Math.sin(tick/9)*3);
  ctx.fillStyle="rgba(255,230,120,.35)";ctx.beginPath();ctx.arc(x+8,y-16+b,10+Math.sin(tick/7)*1.5,0,7);ctx.fill();
  ctx.fillStyle="#11111F";ctx.fillRect(x+2,y-26+b,12,20);
  ctx.fillStyle=col;ctx.fillRect(x+3,y-25+b,10,18);
  ctx.fillStyle="#11111F";ctx.fillRect(x+6,y-23+b,4,9);ctx.fillRect(x+6,y-12+b,4,3);
}
function drawBubble(x,y){
  const b=Math.round(Math.sin(tick/14)*1);
  ctx.fillStyle="#11111F";ctx.fillRect(x+1,y-15+b,16,11);ctx.fillStyle="#FFFFFF";ctx.fillRect(x+2,y-14+b,14,9);
  ctx.fillStyle="#11111F";ctx.fillRect(x+4,y-6+b,3,3);
  const k=(tick/12|0)%4;for(let i=0;i<3;i++){ctx.fillStyle=i<k?"#1E6FE0":"#9AA3B5";ctx.fillRect(x+4+i*4,y-11+b,2,2)}
}
const target=()=>LV.target();
L1.target=function(){
  const p=S.p;let best=null,bd=1e9;
  npcs.forEach(n=>{if(n.kind!=="quiz"||S.done.has(n.id))return;const d=Math.hypot(n.x-p.x,n.y-p.y);if(d<bd){bd=d;best=n}});
  return best||{x:35,y:12.5,px:35*TS,py:12.5*TS,exit:true};
}
function draw(){
  ctx.fillStyle="#000";ctx.fillRect(0,0,cv.width,cv.height);
  if(!S||!mapImg)return;
  const p=S.p,[cx,cy]=camera();
  ctx.drawImage(mapImg,cx,cy,VW*TS,VH*TS,0,0,VW*TS,VH*TS);
  const tg=target();
  if(!tg.exit&&!S.busy){const x=tg.px-cx,y=tg.py-cy;const r=6+Math.sin(tick/8)*1.5;ctx.fillStyle="rgba(255,214,64,.45)";ctx.beginPath();ctx.ellipse(x+8,y+15,r+3,r/2+1,0,0,7);ctx.fill()}
  const ents=npcs.filter(n=>!n.hidden).concat([p]).sort((a,b)=>a.py-b.py);
  ents.forEach(e=>{
    const x=Math.round(e.px-cx),y=Math.round(e.py-cy);if(x<-20||y<-30||x>VW*TS+20||y>VH*TS+20)return;
    if(!e.obj){ctx.fillStyle="rgba(0,0,0,.28)";ctx.fillRect(x+3,y+14,10,3)}
    if(e.obj)LV.drawObj(ctx,e,x,y);else ctx.drawImage(sprite(e.pal,e.dir,e.frame),x,y-2);
  });
  LV.overhead(cx,cy);
  if(!S.busy){
    npcs.forEach(n=>{if(n.hidden)return;const x=Math.round(n.px-cx),y=Math.round(n.py-cy);if(x<-20||y<-30||x>VW*TS||y>VH*TS)return;
      if(LV.mark){LV.mark(n,x,y,tg);return}
      if(n.kind==="quiz"&&!S.done.has(n.id))drawBang(x,y,"#FFD23F");
      else if(n.kind==="hong"&&!S.joined.has(n.pair)&&HONG[n.pair].lines[0][0]===n.id)drawBubble(x+8,y);
      else if(n.kind==="idle"&&!S.joined.has(n.id))drawBubble(x,y);
      else if(n.kind==="intro"&&S.dovui===null)drawBang(x,y,"#7CD6FF");});
    // mũi tên chỉ đường mượt
    const x=tg.px+8-cx,y=tg.py+8-cy,H=VH*TS;
    const onScreen=x>4&&x<VW*TS-4&&y>30&&y<H*.66;
    if(!onScreen){
      const x0=14,x1=VW*TS-14,y0=40,y1=H*.64,vx=(x0+x1)/2,vy=(y0+y1)/2,ang=Math.atan2(y-vy,x-vx);
      let d=ang-S.arrowAng;while(d>Math.PI)d-=2*Math.PI;while(d<-Math.PI)d+=2*Math.PI;S.arrowAng+=d*.12;
      const a=S.arrowAng,rr=Math.min((x1-vx)/Math.abs(Math.cos(a)||1e-6),(y1-vy)/Math.abs(Math.sin(a)||1e-6));
      const wob=Math.sin(tick/20)*2,ax=vx+Math.cos(a)*(rr+wob),ay=vy+Math.sin(a)*(rr+wob);
      ctx.save();ctx.translate(ax,ay);ctx.rotate(a);
      ctx.fillStyle="#11111F";ctx.beginPath();ctx.moveTo(12,0);ctx.lineTo(-8,-10);ctx.lineTo(-3,0);ctx.lineTo(-8,10);ctx.closePath();ctx.fill();
      ctx.fillStyle=tg.exit?"#7CD6FF":"#FFD23F";ctx.beginPath();ctx.moveTo(8,0);ctx.lineTo(-6,-7);ctx.lineTo(-2,0);ctx.lineTo(-6,7);ctx.closePath();ctx.fill();
      ctx.restore();
    }else S.arrowAng=Math.atan2(y-H/2,x-VW*TS/2);
  }
  if(S.alert)drawBang(p.px-cx,p.py-cy,"#FF5A5A");
}
function loop(){update();draw();requestAnimationFrame(loop)}

/* ===== MỞ ĐẦU ===== */
const canStart=()=>{$("start").disabled=!$("pname").value.trim()};
$("pname").oninput=canStart;
$("pname").value=store.get("pl_name","");canStart();
$("pav").getContext("2d").drawImage(sprite(PAL.me,0,0),0,0);
$("start").onclick=async()=>{
  const nm=$("pname").value.trim().replace(/[<>]/g,"").slice(0,20);store.set("pl_name",nm);
  newGame(nm);$("title").hidden=true;ac();sfx("win");music(true);pts();
  await intro();
};
async function intro(){
  S.busy=true;
  await say(S.name,"Ủa, sao hôm nay khu phố có băng rôn, cờ phướn rộn ràng vậy ta? Có chuyện gì mà vui vậy?");
  const n=npcs.find(x=>x.id==="cns1");face(n,S.p);S.p.dir=2;
  await say(n,"Chào bạn! Mình là thành viên Tổ công nghệ số cộng đồng của khu phố nè.");
  await say(n,"Ngày 10 tháng 10 hằng năm là Ngày Chuyển đổi số quốc gia đó. Phường mình đang tổ chức Ngày hội, cả khu phố trang trí hưởng ứng!");
  await say(n,"Tặng bạn 2 vật phẩm tuyên truyền. Mỗi vật phẩm là 1 lượt gợi ý 💡, dùng để loại bớt 1 đáp án sai khi gặp câu khó.");
  closeDlg();await giveHint();await giveHint();
  await dovuiOffer(n);
  await say(n,"Trong hẻm có 10 bà con đang cần giúp, ai có dấu ! vàng là đang chờ bạn đó. Giúp đủ 10 người rồi ra đầu hẻm bên phải để lên phường nha!");
  await say(n,"À, đường đi có thể gặp chiêu lừa đảo. Né được bẫy sẽ nhận thêm gợi ý. Đi cẩn thận nha!");
  closeDlg();n.dir=n.home;S.busy=false;
}
