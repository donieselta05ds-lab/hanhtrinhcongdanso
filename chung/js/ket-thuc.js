/* KẾT THÚC (dùng cho cả 2 bản): tổng kết từng màn, bản tin tối, giấy chứng nhận, chia sẻ, bảng xếp hạng, khởi động */
const LVNAME={1:"Màn 1 · Khu phố rộn ràng",2:"Màn 2 · Trung tâm Phục vụ hành chính công",3:"Màn 3 · Ngày hội Chuyển đổi số"};
const BADGE={1:"Huy hiệu “Hàng xóm số”",2:"Huy hiệu “Thủ tục nhanh gọn”",3:"Quà Ngày hội Chuyển đổi số"};
let lvGo=null;
function showLvEnd(lv){
  const r=S.res[lv],ok=S.rw[lv];
  $("lvlabel").textContent="Hoàn thành "+LVNAME[lv];
  $("lvtitle").textContent=ok?BADGE[lv]:"Chưa đạt phần thưởng";$("lvmedal").textContent=ok?"🏅":"🙂";
  let ev;
  if(lv===1){const j=r.joined;ev=j>=8?"Tai thính mắt tinh, cả hẻm không chuyện gì qua mặt bạn! Bạn biết kha khá về chuyển đổi số rồi đó.":j>=4?"Vừa lo việc mình vừa ngó xung quanh, cân bằng ghê!":"Bạn tập trung vào việc của mình thật đấy. Hãy ngó xung quanh tí nào, băng rôn còn chưa kịp chào bạn!"}
  else ev=ok?"Bạn nắm chắc quy trình, vừa làm xong thủ tục vừa giúp được bà con xung quanh!":"Bạn đã làm xong thủ tục, lần sau cố gắng thêm chút nữa nha!";
  if(lv===2)ev+=" Thủ tục: "+r.proc+".";
  if(!ok)ev+=` (Cần trả lời đúng từ ${QNEED}/${QTOTAL} câu để nhận phần thưởng.)`;
  $("lveval").textContent=ev;
  $("lvstats").style.gridTemplateColumns=lv===1?"repeat(3,1fr)":"1fr 1fr";
  $("lvstats").innerHTML=`<div class="stat"><b>${r.correct}/${QTOTAL}</b><span>câu trả lời đúng</span></div><div class="stat"><b>${r.score}</b><span>điểm ở màn này</span></div>`+(lv===1?`<div class="stat"><b>${r.joined}</b><span>lần trò chuyện</span></div>`:"");
  const nx={1:["Tiếp theo · Màn 2: Trung tâm Phục vụ hành chính công","Lên phường làm thủ tục, lấy số thứ tự và giúp bà con trong lúc chờ."],2:["Tiếp theo · Màn 3: Ngày hội Chuyển đổi số","Tham quan 4 gian trưng bày và giao lưu với sân khấu Ngày hội."]}[lv];
  $("lvnextt").textContent=nx[0];$("lvnextp").textContent=nx[1];
  $("lvgo").textContent=`Vào Màn ${lv+1} ➜`;lvGo=lv===1?startM2:startM3;
  saveGame(lv);
  $("lvend").hidden=false;$("lvend").scrollTop=0;closeDlg();speak(LVNAME[lv]+". "+$("lvtitle").textContent+". "+ev);
}
$("lvgo").onclick=()=>{hush();lvGo&&lvGo()};
$("lvstop").onclick=async()=>{hush();$("lvend").hidden=true;await showEnd()};
/* bản tin tối trên TV */
function showTv(){
  const total=[1,2,3].filter(i=>S.rw[i]).length,good=total>=2;
  $("tvtxt").textContent="Hôm nay, đông đảo người dân phường Gia Định tích cực tham gia Ngày hội Chuyển đổi số: học kỹ năng số, làm thủ tục trực tuyến, cùng nhau nhận diện các chiêu lừa đảo trên mạng.";
  $("tvtick").textContent=good?`★ Chúc mừng người dân ${S.name} đạt ${total}/3 phần thưởng Hành trình Công dân số · Mỗi người dân một kỹ năng số, mỗi gia đình thêm một tiện ích số ★`:"★ Mỗi người dân một kỹ năng số, mỗi gia đình thêm một tiện ích số · Chuyển đổi số thiết thực, an toàn, hiệu quả ★";
  $("tvv").hidden=false;$("tvv").scrollTop=0;speak("Bản tin tối 10 tháng 10. Phường Gia Định rộn ràng Ngày Chuyển đổi số quốc gia. "+$("tvtxt").textContent+(good?" Chúc mừng người dân "+S.name+".":""));
  if(good){sfx("win");confetti()}
}
$("tvok").onclick=async()=>{hush();$("tvv").hidden=true;await showEnd()};
async function showEnd(){
  const rewards=[1,2,3].filter(i=>S.rw[i]).length;
  $("end").hidden=false;$("end").scrollTop=0;
  $("endok").hidden=rewards===0;$("endsad").hidden=rewards>0;$("save").hidden=rewards===0;$("share").hidden=rewards===0;
  $("sadbtns").hidden=false;$("again").hidden=rewards===0;$("lbshow").hidden=rewards===0;
  $("sadt").textContent="Bạn vô tâm quá…";$("sadm").textContent="Cả phường đang vui mà! Chơi lại nhé?";
  submitScore();clearSave();
  if(rewards>0){
    $("etitle").textContent=rewards>=3?"Đại sứ Công dân số":"Đã tham gia Hành trình Công dân số";
    $("emsg").textContent=`${S.score} điểm · ${[1,2,3].filter(i=>S.res[i]).map(i=>`Màn ${i}: ${S.res[i].correct}/${QTOTAL} câu đúng`).join(" · ")} · nhận ${rewards}/3 phần thưởng.`;
    await drawCert(rewards);speak($("etitle").textContent+". "+$("emsg").textContent);
  }else{sadAnim(false);speak("Bạn vô tâm quá. Cả phường đang vui mà! Chơi lại nhé?")}
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
function restart(){clearInterval(sadT);hush();["end","lvend","tvv"].forEach(id=>$(id).hidden=true);S=null;closeDlg();coachOff();$("title").hidden=false;$("title").scrollTop=0;music(false);showResume()}
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
  x.fillStyle="#1A1A2E";x.font="800 30px 'Be Vietnam Pro',sans-serif";
  x.fillText([S.rw[1]?"🏅 Hàng xóm số":"",S.rw[2]?"🏅 Thủ tục nhanh gọn":"",S.rw[3]?"🎁 Quà Ngày hội":""].filter(Boolean).join("   "),W/2,465,W-160);
  x.fillStyle="#1E6FE0";x.font="800 40px 'Be Vietnam Pro',sans-serif";x.fillText(S.score+" điểm",W/2,535);
  x.fillStyle="#5E5D75";x.font="500 24px 'Be Vietnam Pro',sans-serif";x.fillText("“"+SLOGANS[3]+"”",W/2,620,W-160);
  x.fillStyle="#1A1A2E";x.font="700 26px 'Be Vietnam Pro',sans-serif";x.fillText("#CongDanSoGiaDinh",W/2,H-100);
  $("cert").src=c.toDataURL("image/png");
}
function saveCert(){const a=document.createElement("a");a.href=$("cert").src;a.download="chung-nhan-cong-dan-so.png";document.body.appendChild(a);a.click();a.remove()}
$("save").onclick=saveCert;
/* chia sẻ qua Zalo, Facebook… bằng bảng chia sẻ có sẵn của điện thoại */
$("share").onclick=async()=>{
  try{
    const blob=await (await fetch($("cert").src)).blob();
    const file=new File([blob],"chung-nhan-cong-dan-so.png",{type:"image/png"});
    const data={title:"Phiêu lưu Công dân số",text:"Mình vừa hoàn thành Hành trình Công dân số của phường Gia Định! #CongDanSoGiaDinh",files:[file]};
    if(navigator.canShare&&navigator.canShare(data)){await navigator.share(data);return}
    if(navigator.share){await navigator.share({title:data.title,text:data.text,url:location.href.replace(/dechoi\.html.*/,"phieuluu.html")});return}
  }catch(e){if(e&&e.name==="AbortError")return}
  saveCert();toastOver("Máy chưa hỗ trợ chia sẻ trực tiếp, ảnh đã được lưu về máy để bạn gửi Zalo, Facebook.");
};
function toastOver(t){const d=document.createElement("div");d.className="toast";d.style.position="fixed";d.style.whiteSpace="normal";d.style.width="86%";d.style.zIndex=40;d.textContent=t;document.body.appendChild(d);setTimeout(()=>d.remove(),3000)}

/* ===== BẢNG XẾP HẠNG (chỉ tên và điểm) ===== */
const BAN_NAME={de:"Bản Dễ chơi",phieuluu:"Bản Phiêu lưu"}[BAN];
function localBoard(){return store.get("pl_board_"+BAN,[])}
async function submitScore(){
  if(!S||S.submitted)return;S.submitted=true;
  const rec={name:S.name,score:S.score};
  const b=localBoard();b.push(rec);b.sort((a,c)=>c.score-a.score);store.set("pl_board_"+BAN,b.slice(0,50));
  if(LB_URL){try{await fetch(LB_URL,{method:"POST",body:JSON.stringify({...rec,ban:BAN})})}catch(e){}}
}
async function loadBoard(){
  if(LB_URL){try{const r=await fetch(LB_URL+(LB_URL.includes("?")?"&":"?")+"ban="+BAN+"&t="+Date.now());const j=await r.json();if(j&&Array.isArray(j.top))return {list:j.top,online:true,split:j.ban===BAN}}catch(e){}}
  const best={};localBoard().forEach(r=>{if(!best[r.name]||best[r.name]<r.score)best[r.name]=r.score});
  return {list:Object.entries(best).map(([name,score])=>({name,score})).sort((a,b)=>b.score-a.score).slice(0,20),online:false};
}
async function openBoard(){
  $("lbv").hidden=false;$("lbv").scrollTop=0;$("lblist").innerHTML='<p class="center">Đang tải…</p>';
  const {list,online,split}=await loadBoard();
  $("lbnote").textContent=(online?(split?"Bảng xếp hạng "+BAN_NAME+".":"Bảng xếp hạng chung (máy chủ chưa tách 2 bản)."):"Đang hiển thị điểm lưu trên máy này ("+BAN_NAME+").");$("lbtitle")&&($("lbtitle").textContent="🏆 Top "+BAN_NAME);
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

/* ===== NÚT ? (xem lại hướng dẫn) ===== */
$("help").onclick=()=>{$("helpv").hidden=false;$("helpv").scrollTop=0;speak($("helpv").querySelector(".howto").textContent)};
$("helpok").onclick=()=>{hush();$("helpv").hidden=true};
if($("helpreset"))$("helpreset").onclick=()=>{hush();store.set("dc_tut1",false);store.set("dc_tut2",false);$("helpv").hidden=true;
  if(S&&!S.busy&&$("dlg").hidden){store.set("dc_tut1",true);coach("#go","Bấm nút <b>Đi tiếp</b>, nhân vật sẽ tự đi tới người cần gặp và nói chuyện.")}};

LV=L1;buildMap();renderMap();loop();
(async()=>{try{await document.fonts.ready}catch(e){}renderMap()})();
