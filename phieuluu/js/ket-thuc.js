/* KẾT THÚC: tổng kết màn, giấy chứng nhận, bảng xếp hạng, khởi động game */

/* ===== KẾT THÚC MÀN 1 ===== */
function showM1End(){
  const j=S.joined.size,ok=S.correct>=7;S.reward1=ok;
  $("m1title").textContent=ok?"Huy hiệu “Hàng xóm số”":"Chưa đạt huy hiệu";
  $("m1medal").textContent=ok?"🏅":"🙂";
  $("m1eval").textContent=(j>=8?"Tai thính mắt tinh, cả hẻm không chuyện gì qua mặt bạn! Bạn biết kha khá về chuyển đổi số rồi đó.":j>=4?"Vừa lo việc mình vừa ngó xung quanh, cân bằng ghê!":"Bạn tập trung vào việc của mình thật đấy. Hãy ngó xung quanh tí nào, băng rôn còn chưa kịp chào bạn!")+(ok?"":" (Cần trả lời đúng từ 7/10 câu để nhận huy hiệu.)");
  $("m1ok").textContent=S.correct+"/10";$("m1pts").textContent=S.score;$("m1join").textContent=j+"/10";
  $("m1end").hidden=false;$("m1end").scrollTop=0;closeDlg();
}
$("toresult").onclick=async()=>{$("m1end").hidden=true;await showEnd()};
$("toresult2").onclick=async()=>{$("m2end").hidden=true;await showEnd()};
$("tom2").onclick=()=>startM2();
async function showEnd(){
  const rewards=(S.reward1?1:0)+(S.reward2?1:0);
  $("end").hidden=false;$("end").scrollTop=0;
  $("endok").hidden=rewards===0;$("endsad").hidden=rewards>0;$("save").hidden=rewards===0;
  $("sadbtns").hidden=false;$("again").hidden=rewards===0;$("lbshow").hidden=rewards===0;
  $("sadt").textContent="Bạn vô tâm quá…";$("sadm").textContent="Cả phường đang vui mà! Chơi lại không?";
  submitScore();
  if(rewards>0){
    $("etitle").textContent=rewards>=3?"Đại sứ Công dân số":"Đã tham gia Hành trình Công dân số";
    $("emsg").textContent=`${S.score} điểm · ${[1,2].filter(i=>S.res[i]).map(i=>`Màn ${i}: ${S.res[i].correct}/10 câu đúng`).join(" · ")} · đã nhận ${rewards}/3 phần thưởng.`;
    await drawCert(rewards);
  }else{sadAnim(false)}
}
$("sadyes").onclick=()=>restart();
$("sadno").onclick=()=>{$("sadbtns").hidden=true;$("sadt").textContent="Huhu…";$("sadm").textContent="Bạn không chơi lại thật hả? Buồn ghê… Hẹn gặp bạn ở Ngày hội 10/10 nhé!";sadAnim(true);$("again").hidden=false;$("lbshow").hidden=false};
let sadT=null;
function sadAnim(cry){
  clearInterval(sadT);const c=$("sad").getContext("2d");c.imageSmoothingEnabled=false;let f=0;
  const drops=Array.from({length:40},()=>[Math.random()*160,Math.random()*120]);
  sadT=setInterval(()=>{if($("end").hidden){clearInterval(sadT);return}f++;
    c.fillStyle="#1C2B44";c.fillRect(0,0,160,120);c.fillStyle="#2A3B57";c.fillRect(0,90,160,30);
    c.fillStyle="#4A5568";[[20,10,50,14],[70,6,60,16],[110,14,40,12]].forEach(([x,y,w,h])=>c.fillRect(x,y,w,h));
    c.fillStyle="#7FB3E6";drops.forEach(d=>{d[1]+=3;d[0]-=.6;if(d[1]>120){d[1]=-4;d[0]=Math.random()*170}c.fillRect(d[0]|0,d[1]|0,1,4)});
    c.drawImage(sprite(PAL.me,0,0,true),cry?48:64,cry?34:58,cry?64:32,cry?64:32);
    if(cry&&f%10<5){c.fillStyle="#5DADEC";c.fillRect(66,62,4,8);c.fillRect(90,62,4,8)}
  },70);
}
function restart(){clearInterval(sadT);$("end").hidden=true;$("m1end").hidden=true;$("m2end").hidden=true;S=null;closeDlg();$("title").hidden=false;$("title").scrollTop=0;music(false)}
$("again").onclick=restart;
async function drawCert(rewards){
  try{await document.fonts.ready}catch(e){}
  const c=$("ccv"),x=c.getContext("2d"),W=c.width,H=c.height,gold=rewards>=3;
  x.imageSmoothingEnabled=false;
  x.fillStyle="#13233A";x.fillRect(0,0,W,H);
  for(let i=0;i<W;i+=40)for(let j=0;j<H;j+=40)if(((i+j)/40)%2===0){x.fillStyle="#1B3150";x.fillRect(i,j,40,40)}
  x.fillStyle=gold?"#FFC93C":"#1E6FE0";x.fillRect(40,40,W-80,H-80);x.fillStyle="#FFF8E7";x.fillRect(52,52,W-104,H-104);
  x.fillStyle="#1A1A2E";[[52,52],[W-68,52],[52,H-68],[W-68,H-68]].forEach(([a,b])=>x.fillRect(a,b,16,16));
  const lg=document.querySelector(".logo img");try{x.drawImage(lg,90,80,110,110)}catch(e){}
  x.drawImage(sprite(PAL.me,0,0),W-220,70,128,128);
  x.textAlign="center";x.fillStyle="#1E6FE0";x.font="700 26px 'Be Vietnam Pro',sans-serif";x.fillText("HƯỞNG ỨNG NGÀY CHUYỂN ĐỔI SỐ QUỐC GIA 10/10",W/2,120);
  x.fillStyle="#B71C1C";x.font="800 60px 'Be Vietnam Pro',sans-serif";x.fillText(gold?"GIẤY KHEN":"GIẤY CHỨNG NHẬN",W/2,200);
  x.fillStyle="#5E5D75";x.font="500 26px 'Be Vietnam Pro',sans-serif";x.fillText(gold?"Danh hiệu “Đại sứ Công dân số”":"Đã tham gia trò chơi Phiêu lưu Công dân số",W/2,245);
  x.fillStyle="#1A1A2E";x.font="800 58px 'Be Vietnam Pro',sans-serif";x.fillText(S.name,W/2,340,W-200);
  x.fillStyle="#5E5D75";x.font="600 26px 'Be Vietnam Pro',sans-serif";x.fillText("Người dân phường Gia Định",W/2,385);
  x.fillStyle="#1A1A2E";x.font="800 34px 'Be Vietnam Pro',sans-serif";x.fillText([S.reward1?"🏅 Hàng xóm số":"",S.reward2?"🏅 Thủ tục nhanh gọn":""].filter(Boolean).join("   "),W/2,465);
  x.fillStyle="#1E6FE0";x.font="800 40px 'Be Vietnam Pro',sans-serif";x.fillText(S.score+" điểm",W/2,535);
  x.fillStyle="#5E5D75";x.font="500 24px 'Be Vietnam Pro',sans-serif";x.fillText("“"+SLOGANS[3]+"”",W/2,620,W-160);
  x.fillStyle="#1A1A2E";x.font="700 26px 'Be Vietnam Pro',sans-serif";x.fillText("#CongDanSoGiaDinh",W/2,H-100);
  $("cert").src=c.toDataURL("image/png");
}
$("save").onclick=()=>{const a=document.createElement("a");a.href=$("cert").src;a.download="chung-nhan-cong-dan-so.png";document.body.appendChild(a);a.click();a.remove()};

/* ===== BẢNG XẾP HẠNG (chỉ tên và điểm) ===== */
function localBoard(){return store.get("pl_board",[])}
async function submitScore(){
  if(!S||S.submitted)return;S.submitted=true;
  const rec={name:S.name,score:S.score};
  const b=localBoard();b.push(rec);b.sort((a,c)=>c.score-a.score);store.set("pl_board",b.slice(0,50));
  if(LB_URL){try{await fetch(LB_URL,{method:"POST",body:JSON.stringify(rec)})}catch(e){}}
}
async function loadBoard(){
  if(LB_URL){try{const r=await fetch(LB_URL+(LB_URL.includes("?")?"&":"?")+"t="+Date.now());const j=await r.json();if(j&&Array.isArray(j.top))return {list:j.top,online:true}}catch(e){}}
  const best={};localBoard().forEach(r=>{if(!best[r.name]||best[r.name]<r.score)best[r.name]=r.score});
  return {list:Object.entries(best).map(([name,score])=>({name,score})).sort((a,b)=>b.score-a.score).slice(0,20),online:false};
}
async function openBoard(){
  $("lbv").hidden=false;$("lbv").scrollTop=0;$("lblist").innerHTML='<p class="center">Đang tải…</p>';
  const {list,online}=await loadBoard();
  $("lbnote").textContent=online?"Bảng xếp hạng chung của mọi người chơi.":"Đang hiển thị điểm lưu trên máy này.";
  const me=S?S.name:store.get("pl_name","");
  const crowns=["👑","🥈","🥉"];
  $("lblist").innerHTML=list.length?list.map((r,i)=>`<div class="lbrow ${r.name===me?"me":""}"><span class="rk ${i<3?"c":""}">${i<3?crowns[i]:i+1}</span><span>${esc(r.name)}</span><b>${r.score|0} ★</b></div>`).join(""):'<p class="center">Chưa có ai trên bảng. Bạn là người đầu tiên nhé!</p>';
  confetti();
}
function confetti(){
  const box=document.createElement("div");box.className="conf";const cols=["#FFC93C","#E53935","#1E6FE0","#2E9E44","#fff"];
  for(let i=0;i<45;i++){const e=document.createElement("i");e.style.left=Math.random()*100+"%";e.style.background=cols[i%5];e.style.animationDuration=(1.6+Math.random()*1.8)+"s";e.style.animationDelay=(Math.random()*.6)+"s";box.appendChild(e)}
  document.body.appendChild(box);setTimeout(()=>box.remove(),4200);
}
$("lbopen").onclick=openBoard;$("lbshow").onclick=openBoard;$("lbclose").onclick=()=>{$("lbv").hidden=true};

LV=L1;buildMap();renderMap();loop();
(async()=>{try{await document.fonts.ready}catch(e){}renderMap()})();
