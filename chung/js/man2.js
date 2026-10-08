/* MÀN 2 · Trung tâm Phục vụ hành chính công · luật chơi (dùng cho cả 2 bản)
   (bản đồ, nhân vật lấy từ chung/js/man2-bando.js; ở đây chỉ đổi số câu và cách chơi)
   7 câu: 4 câu giúp bà con + 2 câu về thủ tục + 1 sự kiện */
L2.nEv=1;
const G2=["g1","g2","g3","g4"];
const TIP2={
 g5:"Mình tra cứu tiến độ hồ sơ bằng mã hồ sơ trên Cổng Dịch vụ công, khỏi phải chạy lên hỏi nhiều lần.",
 g6:"Ai chưa rành nộp hồ sơ trực tuyến cứ ra bàn tra cứu này, đoàn viên hướng dẫn miễn phí nha!",
 g7:"Hồi trước làm gì cũng photo cả xấp. Giờ nhiều thủ tục chỉ cần mở VNeID là cán bộ tra được thông tin."
};
L2.init=()=>{
  const proc=["A","B","C"][Math.random()*3|0];
  S.m2={phase:"arrive",proc,quay:PROC[proc].quay,ticket:null,called:false,gen:0,pq:shuffle(PROC[proc].qs.slice()).slice(0,2)};
  const qs=shuffle(BANK2.slice());let i=0;
  npcs.forEach(n=>{if(n.kind!=="gen")return;if(G2.includes(n.id))S.quiz[n.id]=qs[i++];else{n.kind="idle";n.line=TIP2[n.id]}});
};
L2.quest=()=>{const m=S.m2,P=PROC[m.proc];return "Màn 2 · "+({arrive:"Gặp <b>bạn đoàn viên</b> ở cửa",ticket:"Lấy <b>số thứ tự</b> ở kiosk",police:"Sang <b>Công an phường</b> theo bảng chỉ dẫn",gen:`Trong lúc chờ, giúp bà con có dấu <b>?</b>: <b>${m.gen}/4</b>`,called:`Mời số <b>${m.ticket}</b> đến <b>${P.place}</b>`,done:"Xong thủ tục! Bấm <b>Đi tiếp</b> để ra <b>cổng</b>"}[m.phase])};
L2.taskNpc=()=>{const m=S.m2;
  if(m.phase==="arrive")return npcs.find(n=>n.id==="doan2");
  if(m.phase==="ticket")return npcs.find(n=>n.id==="k1");
  if(m.phase==="police")return npcs.find(n=>n.id==="sign");
  if(m.phase==="called")return npcs.find(n=>n.kind==="counter"&&n.quay===m.quay);
  return null};
L2.target=()=>{const m=S.m2,t=L2.taskNpc();if(t)return t;
  if(m.phase==="gen"){const p=S.p;let best=null,bd=1e9;npcs.forEach(n=>{if(n.kind!=="gen"||S.done.has(n.id))return;const d=Math.hypot(n.x-p.x,n.y-p.y);if(d<bd){bd=d;best=n}});if(best)return best}
  return {x:14,y:29,px:14.5*TS,py:29*TS,exit:true}};
L2.exitGoal=(x,y)=>at(x,y)===GATE;
L2.mark=(n,x,y)=>{const m=S.m2;
  if(n===L2.taskNpc()){drawBang(x,y,"#7CD6FF");return}
  if(n.kind==="gen"){if(S.done.has(n.id))drawSmile(x,y);else if(m.phase==="gen")drawQ(x,y)}
  else if(n.kind==="idle"&&!S.joined.has(n.id))drawBubble(x,y)};
L2.onStep=p=>{
  if(at(p.x,p.y)===GATE&&!S.ended&&!S.busy){
    if(S.m2.phase==="done"){
      if(S.evDone<S.events.length){S.pending=null;runEvent(S.events[S.evDone]);return true}
      endM2();return true}
    S.busy=true;held=null;
    (async()=>{await say("Bác bảo vệ","Con chưa làm xong thủ tục mà, vào lại Trung tâm đi con! Bấm Đi tiếp để biết cần làm gì nha.");closeDlg();startMove(S.p,3);S.busy=false})();return true}
  return false};
async function m2Quiz(n,who){
  const m=S.m2;
  for(let i=0;i<2;i++)await quiz(who||n,m.pq[i],`Câu ${i+1}/2 về thủ tục:`);
}
function m2AfterGen(){
  const m=S.m2,P=PROC[m.proc];
  if(m.gen===2)queueEvent(2);
  if(m.gen<4)return null;
  if(m.proc==="C"){m.phase="done";sfx("win");return say("Hướng dẫn","Tuyệt vời! Bạn đã giúp đủ 4 bà con. Bấm Đi tiếp để ra cổng về nhé!")}
  m.called=true;m.phase="called";sfx("ring");toast("🔔 Đến lượt bạn!","good");
  return say("Loa Trung tâm",`Kính mời công dân có số thứ tự ${m.ticket} đến ${P.place}.`);
}
L2.talk=async function(n){
  const m=S.m2,P=PROC[m.proc];
  if(n.kind==="door"){
    if(m.phase!=="arrive"){await say(n,m.phase==="done"?"Bạn làm xong rồi, chúc bạn một ngày vui nha!":"Cần gì cứ hỏi mình nha! Thủ tục của bạn: "+P.name+".");return}
    await say(n,"Chào bạn! Mình là đoàn viên hỗ trợ ở Trung tâm Phục vụ hành chính công phường Gia Định. Bạn cần hỗ trợ gì nè?");
    await say(S.name,"Hôm nay mình đến làm thủ tục "+P.name.toLowerCase()+".");
    if(m.proc==="C"){
      await say(n,"À, đăng ký thường trú là thủ tục của Công an phường, không làm ở Trung tâm này đâu. Bạn đi theo bảng chỉ dẫn bên phải sân để sang Công an phường nha!");
      await say(n,"Bạn cũng có thể nộp hồ sơ trực tuyến trên Cổng Dịch vụ công hoặc ứng dụng VNeID cho nhanh.");m.phase="police";
    }else{
      await say(n,"Bạn vào trong, lấy số thứ tự ở kiosk cạnh cửa nha. Trong lúc chờ gọi số, có bà con cần giúp lắm đó!");m.phase="ticket";
    }
    sfx("win");toast("Nhiệm vụ mới!");return;
  }
  if(n.kind==="kiosk"){
    if(m.phase==="arrive"){await say(n,"Màn hình: Chào mừng bạn đến Trung tâm. Hỏi bạn đoàn viên ở cửa nếu cần hướng dẫn nha.");return}
    if(m.proc==="C"){await say(n,"Màn hình: Đăng ký cư trú thực hiện tại Công an phường.");return}
    if(m.ticket){await say(n,"Bạn đã có số thứ tự "+m.ticket+" rồi, ngồi chờ gọi số nha.");return}
    const opts=["Đăng ký khai sinh","Chứng thực bản sao","Đăng ký thường trú"];
    while(true){const k=await ask(n,"Kiosk cấp số thứ tự · Chạm vào thủ tục bạn cần làm:",opts);
      if(opts[k]===P.name)break;
      await say(n,k===2?"Màn hình: Đăng ký thường trú thực hiện tại Công an phường. Bạn chọn lại nhé.":"Đây không phải thủ tục bạn cần làm. Chọn lại nhé!")}
    m.ticket=String(m.quay*1000+30+(Math.random()*9|0));sfx("item");
    await say(n,`🎫 Phiếu số thứ tự: ${m.ticket} · ${P.place}.\nVui lòng ngồi chờ, số sẽ hiện trên màn hình và được đọc qua loa.`);
    m.phase="gen";
    await say("Hướng dẫn","Trong lúc chờ, giúp 4 bà con có dấu ? vàng nha. Bấm Đi tiếp để đi tới từng người.");return;
  }
  if(n.kind==="police"){
    if(m.proc!=="C"){await say(n,"Bảng chỉ dẫn: Lối sang Công an phường ➜. Thủ tục của bạn làm ngay tại Trung tâm nha.");return}
    if(m.phase!=="police"){await say(n,"Bạn đã làm xong ở Công an phường rồi.");return}
    await say(n,"Bạn đi theo bảng chỉ dẫn sang Công an phường…");
    const ca={name:"Cán bộ Công an phường"};
    await say(ca,"Chào bạn! Đăng ký thường trú làm tại đây nha. Trước khi nộp, mình hỏi bạn 2 câu để nắm quy định nhé.");
    await m2Quiz(n,ca);
    await say(ca,"Hồ sơ của bạn đã được tiếp nhận, đây là phiếu tiếp nhận. Thông tin sẽ cập nhật vào Cơ sở dữ liệu về cư trú, bạn xem trên VNeID nha!");
    await say("Hướng dẫn","Quay lại Trung tâm, trong sảnh có 4 bà con đang cần giúp (dấu ? vàng). Giúp đủ rồi ra cổng về nhé.");
    m.phase="gen";return;
  }
  if(n.kind==="gen"){
    if(S.done.has(n.id)){await say(n,"Cảm ơn bạn đã giúp nha!");return}
    if(m.phase==="arrive"||m.phase==="ticket"){await say(n,"Bạn lấy số thứ tự rồi ngồi chờ đi, lát mình hỏi bạn chuyện này nha!");return}
    if(m.phase==="police"){await say(n,"Đăng ký thường trú bên Công an phường đó, bạn đi theo bảng chỉ dẫn ngoài sân nha!");return}
    await quiz(n,S.quiz[n.id],n.lead);S.done.add(n.id);
    if(m.phase==="gen"){m.gen++;updHud();await m2AfterGen()}
    return;
  }
  if(n.kind==="counter"){
    if(m.phase==="called"&&n.quay===m.quay){
      await say(n,"Chào bạn, mời bạn ngồi. Trước khi tiếp nhận hồ sơ "+P.name.toLowerCase()+", mình hỏi nhanh 2 câu nha.");
      await m2Quiz(n);
      await say(n,"Hồ sơ của bạn đã được tiếp nhận. Kết quả có thể nhận bản điện tử hoặc qua bưu chính công ích nha.");
      const k=await ask(n,"Mời bạn đánh giá mức độ hài lòng trên máy tính bảng ở quầy:",["😊 Rất hài lòng","🙂 Hài lòng","😐 Chưa hài lòng"]);
      await say(n,k===2?"Cảm ơn góp ý của bạn, Trung tâm sẽ cố gắng phục vụ tốt hơn!":"Cảm ơn bạn đã đánh giá! Chúc bạn một ngày vui.");
      m.phase="done";sfx("win");toast("Xong thủ tục!","good");
      await say("Hướng dẫn","Xong thủ tục rồi! Bấm Đi tiếp để ra cổng.");return;
    }
    if(m.called&&n.quay!==m.quay){await say(n,`Số ${m.ticket} được gọi ở ${P.place} nha bạn.`);return}
    const line={1:"Bạn lấy số thứ tự ở kiosk rồi chờ gọi số nha.",2:"Quầy 2 giải quyết thủ tục sao y, chứng thực. Bạn lấy số ở kiosk rồi chờ gọi số nha.",4:"Quầy 4 giải quyết thủ tục lĩnh vực kinh tế, công thương.",5:"Quầy 5 giải quyết thủ tục lĩnh vực địa chính, xây dựng."}[n.quay];
    await say(n,m.phase==="done"?"Chúc bạn một ngày vui!":line);return;
  }
  if(n.kind==="idle"){await say(n,n.line);S.joined.add(n.id);return}
};
async function startM2(){
  $("lvend").hidden=true;S.busy=true;loadLevel(L2);music(true);
  await say("Hướng dẫn","Màn 2 · Trung tâm Phục vụ hành chính công phường Gia Định. Bạn gửi xe xong, đi lên sân trước Trung tâm…");
  await say(S.name,"Hôm nay mình phải làm thủ tục "+PROC[S.m2.proc].name.toLowerCase()+". Hỏi bạn đoàn viên ở cửa trước đã!");
  closeDlg();S.busy=false;updHud();saveGame();
}
async function endM2(){
  S.ended=true;S.busy=true;held=null;music(false);sfx("win");
  await say("Hướng dẫn","Bạn đã hoàn thành thủ tục ở Trung tâm Phục vụ hành chính công!");closeDlg();
  S.res[2]={correct:S.correct,score:S.score-S.lvScore0,proc:PROC[S.m2.proc].name};S.rw[2]=S.correct>=QNEED;
  showLvEnd(2);
}
