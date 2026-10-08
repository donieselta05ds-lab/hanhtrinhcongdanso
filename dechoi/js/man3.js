/* MÀN 3 · Ngày hội Chuyển đổi số 10/10 · bản đồ quảng trường, 4 gian trưng bày, sân khấu (Bản Dễ chơi)
   7 câu: 4 gian x 1 câu + sân khấu 1 câu + 2 sự kiện */
const STAGE=40,CHAIR=41,TENT=42,CARPET=43,SPK=44,LAMP=45,ARCH=46;
const BOOTHS=[
 {x:2,y:6,w:6,col:"#1E6FE0",t:"GIAN 1 · CHÍNH QUYỀN SỐ"},
 {x:2,y:13,w:6,col:"#8E24AA",t:"GIAN 2 · TRÍ TUỆ NHÂN TẠO"},
 {x:26,y:6,w:6,col:"#2E9E44",t:"GIAN 3 · GIÁO DỤC SỐ"},
 {x:26,y:13,w:6,col:"#EF6C00",t:"GIAN 4 · KINH TẾ SỐ"}];
function buildMap3(){
  map.fill(PAVE);
  fill(0,0,33,3,BLD);
  fill(0,4,0,27,TREE);fill(33,4,33,27,TREE);
  fill(11,4,22,8,STAGE);put(10,7,SPK);put(23,7,SPK);
  for(const y of [10,11,12]){fill(12,y,15,y,CHAIR);fill(18,y,21,y,CHAIR)}
  BOOTHS.forEach(b=>fill(b.x,b.y,b.x+b.w-1,b.y+2,TENT));
  fill(14,15,19,16,BED);
  fill(2,19,9,24,CARPET);[[3,21],[4,21],[7,21],[8,21],[3,23],[4,23]].forEach(([x,y])=>put(x,y,TABLE));
  fill(24,19,31,24,PARK);for(const y of [20,22,24])fill(25,y,30,y,BIKE);
  [[1,4],[1,11],[1,17],[32,4],[32,11],[32,17],[10,10],[23,10],[11,18],[22,18],[1,26],[32,26]].forEach(([x,y])=>put(x,y,POT));
  [[9,5],[24,5],[9,14],[24,14],[12,21],[21,21]].forEach(([x,y])=>put(x,y,LAMP));
  put(13,26,ARCH);put(20,26,ARCH);
  fill(0,28,33,28,FENCE);fill(15,28,18,28,GATE);fill(0,29,33,29,ROAD);
}
function drawTile3(c,t,x,y){
  const X=x*TS,Y=y*TS,h=hash(x,y);
  if(t===PAVE||t===LAMP||t===ARCH||t===SPK){px(c,(x+y)%2?"#E8D7A8":"#F2E3B6",X,Y,TS,TS);px(c,"#D9C27F",X,Y,TS,1);px(c,"#D9C27F",X,Y,1,TS);
    if((x===16||x===17)&&y>8)px(c,"#E2B65C",X,Y,TS,TS);}
  if(t===PAVE)return;
  if(t===BLD){px(c,"#9EC9EE",X,Y,TS,TS);return}
  if(t===STAGE){px(c,"#5B2C83",X,Y,TS,TS);px(c,"#7B3FA8",X,Y,TS,1);for(let i=0;i<TS;i+=4)px(c,"#4A2370",X+i,Y+4,1,1);if(y===8){px(c,"#2B1640",X,Y+10,TS,6);px(c,"#FFD23F",X,Y+10,TS,1)}return}
  if(t===CHAIR){px(c,(x+y)%2?"#E8D7A8":"#F2E3B6",X,Y,TS,TS);px(c,"#1A1A2E",X+2,Y+3,12,11);px(c,"#C62828",X+3,Y+4,10,5);px(c,"#E53935",X+3,Y+9,10,3);px(c,"#555",X+3,Y+13,2,3);px(c,"#555",X+11,Y+13,2,3);return}
  if(t===TENT){px(c,"#F7F7F2",X,Y,TS,TS);const b=BOOTHS.find(b=>x>=b.x&&x<b.x+b.w&&y>=b.y&&y<=b.y+2);
    if(y===b.y+2){px(c,"#FFFFFF",X,Y+2,TS,11);px(c,b.col,X,Y+9,TS,4);px(c,"#1A1A2E",X,Y+13,TS,1);if(x===b.x+1||x===b.x+4){px(c,"#1A1A2E",X+3,Y-3,10,7);px(c,"#3A6EA5",X+4,Y-2,8,5)}}
    return}
  if(t===CARPET){px(c,"#4DD0E1",X,Y,TS,TS);if((x+y)%2)px(c,"#26C6DA",X+2,Y+2,12,12);return}
  if(t===TABLE){px(c,"#4DD0E1",X,Y,TS,TS);px(c,"#D9B27C",X,Y+5,TS,8);px(c,"#1A1A2E",X,Y+13,TS,1);px(c,"#1A1A2E",X+3,Y+1,10,7);px(c,"#90CAF9",X+4,Y+2,8,5);px(c,"#555",X+2,Y+8,12,2);return}
  if(t===POT){px(c,(x+y)%2?"#E8D7A8":"#F2E3B6",X,Y,TS,TS);drawTile(c,POT,x,y);return}
  if(t===TREE){drawTile(c,G,x,y);drawTile(c,TREE,x,y);return}
  drawTile2(c,t,x,y);
}
function paint3(c){
  /* tòa nhà cao tầng phía sau */
  const tw=[[0,5,"#7FA7C9"],[5,7,"#5C88B3"],[12,10,"#E3E8EF"],[22,6,"#6E95BD"],[28,6,"#8AB0D1"]];
  tw.forEach(([x,w,col],i)=>{const X=x*TS,W=w*TS,top=i===2?0:6+(i%2)*10;px(c,"#1A1A2E",X,top,W,4*TS-top);px(c,col,X+1,top+1,W-2,4*TS-top-1);
    for(let wy=top+5;wy<4*TS-8;wy+=9)for(let wx=X+4;wx<X+W-6;wx+=8){px(c,(hash(wx,wy)>.7)?"#FFF59D":"#2F4F6F",wx,wy,5,5)}});
  /* tòa giữa có biển */
  c.font="bold 7px 'Be Vietnam Pro',sans-serif";c.textBaseline="middle";c.textAlign="center";
  
  /* màn hình LED sân khấu */
  const SX=11*TS,SY=4*TS;px(c,"#1A1A2E",SX+6,SY-2,12*TS-12,30);px(c,"#0D47A1",SX+8,SY,12*TS-16,26);
  for(let i=0;i<12*TS-16;i+=6)px(c,"rgba(255,255,255,.06)",SX+8+i,SY,3,26);
  c.fillStyle="#FFD23F";c.font="bold 8px 'Be Vietnam Pro',sans-serif";c.fillText("NGÀY CHUYỂN ĐỔI SỐ QUỐC GIA",SX+6*TS,SY+8);
  c.fillStyle="#FFFFFF";c.font="bold 7px 'Be Vietnam Pro',sans-serif";c.fillText("10/10/2026 · PHƯỜNG GIA ĐỊNH",SX+6*TS,SY+19);
  /* bục, ghế trên sân khấu */
  px(c,"#1A1A2E",15*TS+3,6*TS+12,10,12);px(c,"#8D5A34",15*TS+4,6*TS+13,8,10);
  /* loa */
  [[10,7],[23,7]].forEach(([x,y])=>{const X=x*TS,Y=y*TS;px(c,"#1A1A2E",X+2,Y-12,12,28);px(c,"#333",X+3,Y-11,10,26);c.fillStyle="#666";c.beginPath();c.arc(X+8,Y-4,4,0,7);c.arc(X+8,Y+7,3,0,7);c.fill()});
  /* đèn sân */
  [[9,5],[24,5],[9,14],[24,14],[12,21],[21,21]].forEach(([x,y])=>{const X=x*TS,Y=y*TS;px(c,"#1A1A2E",X+7,Y-14,2,30);px(c,"#1A1A2E",X+4,Y-18,8,5);px(c,"#FFF59D",X+5,Y-17,6,3)});
  /* mái gian trưng bày + biển tên */
  BOOTHS.forEach(b=>{const X=b.x*TS,Y=b.y*TS,W=b.w*TS;px(c,"#1A1A2E",X-2,Y-6,W+4,22);
    for(let i=0;i<W+2;i+=8){px(c,b.col,X-1+i,Y-5,4,20);px(c,"#FFFFFF",X+3+i,Y-5,4,20)}
    for(let i=0;i<W;i+=8){c.fillStyle=i/8%2?"#FFFFFF":b.col;c.beginPath();c.moveTo(X+i,Y+15);c.lineTo(X+i+8,Y+15);c.lineTo(X+i+4,Y+20);c.closePath();c.fill()}
    px(c,"#1A1A2E",X+4,Y-4,W-8,12);px(c,"#FFF8E7",X+5,Y-3,W-10,10);c.fillStyle=b.col;c.font="bold 6px 'Be Vietnam Pro',sans-serif";c.fillText(b.t,X+W/2,Y+2,W-12)});
  /* biển góc học tập số, bãi xe */
  const lab=(x,y,t,col)=>{c.font="bold 7px 'Be Vietnam Pro',sans-serif";const w=Math.ceil(c.measureText(t).width)+10;const X=x-w/2;px(c,"#1A1A2E",X-1,y-1,w+2,12);px(c,col,X,y,w,10);c.fillStyle="#fff";c.fillText(t,x,y+5.5)};
  lab(6*TS,18*TS+2,"GÓC HỌC TẬP SỐ · BÌNH DÂN HỌC VỤ SỐ","#00838F");
  lab(28*TS,18*TS+2,"BÃI GỬI XE MÁY","#455A64");
  /* bảng 10/10 giữa bồn hoa */
  px(c,"#1A1A2E",16*TS-2,15*TS+2,36,20);px(c,"#FFF8E7",16*TS-1,15*TS+3,34,18);c.fillStyle="#C62828";c.font="bold 10px 'Be Vietnam Pro',sans-serif";c.fillText("10/10",17*TS,15*TS+12.5);
  c.textAlign="left";
}
function overhead3(cx,cy){
  /* cổng chào */
  const X=13*TS-cx,Y=26*TS-cy,W=8*TS;
  px(ctx,"#1A1A2E",X+2,Y-34,12,50);px(ctx,"#1E6FE0",X+3,Y-33,10,49);px(ctx,"#1A1A2E",X+W-14,Y-34,12,50);px(ctx,"#1E6FE0",X+W-13,Y-33,10,49);
  px(ctx,"#1A1A2E",X-4,Y-46,W+8,22);px(ctx,"#C8102E",X-3,Y-45,W+6,20);px(ctx,"#FFD23F",X-3,Y-45,W+6,2);px(ctx,"#FFD23F",X-3,Y-27,W+6,2);
  ctx.textBaseline="middle";ctx.textAlign="center";ctx.fillStyle="#FFE27A";ctx.font="bold 7px 'Be Vietnam Pro',sans-serif";
  ctx.fillText("NGÀY HỘI CHUYỂN ĐỔI SỐ",X+W/2,Y-40,W);ctx.fillText("PHƯỜNG GIA ĐỊNH 2026",X+W/2,Y-31,W);
  /* băng rôn hàng rào */
  const ban=(x1,x2,y,txt)=>{const X=x1*TS-cx,W=(x2-x1)*TS,Y=y-cy;px(ctx,"#1A1A2E",X-1,Y-1,W+2,14);px(ctx,"#C8102E",X,Y,W,12);px(ctx,"#FFD23F",X,Y,W,1);px(ctx,"#FFD23F",X,Y+11,W,1);
    ctx.fillStyle="#FFE27A";ctx.font="bold 7px 'Be Vietnam Pro',sans-serif";ctx.fillText(txt,X+W/2,Y+6.5,W-6)};
  ban(1,14,28*TS+2,"MỖI NGƯỜI DÂN MỘT KỸ NĂNG SỐ");ban(19,33,28*TS+2,"CHUYỂN ĐỔI SỐ THIẾT THỰC, AN TOÀN, HIỆU QUẢ");
  ctx.textAlign="left";
  /* dây cờ đuôi nheo từ sân khấu ra cổng */
  const cols=["#E53935","#FFD23F","#1E6FE0","#2E9E44"];
  const line=(x1,y1,x2,y2)=>{const n=Math.hypot(x2-x1,y2-y1)/6|0;for(let i=0;i<n;i++){const t=i/n,x=x1+(x2-x1)*t-cx,y=y1+(y2-y1)*t+Math.sin(t*Math.PI)*10-cy;px(ctx,"#555",x,y,6,1);ctx.fillStyle=cols[i%4];ctx.beginPath();ctx.moveTo(x,y+1);ctx.lineTo(x+5,y+1);ctx.lineTo(x+2.5,y+6);ctx.closePath();ctx.fill()}};
  line(9*TS+8,5*TS-14,12*TS+8,21*TS-14);line(24*TS+8,5*TS-14,21*TS+8,21*TS-14);line(9*TS+8,14*TS-14,24*TS+8,14*TS-14);
}
const PAL3={
 mc:{id:"mc",H:"#1A1A1A",C:"#FFFFFF",D:"#E0E0E0",P:"#212121"},
 khachmoi:{id:"khachmoi",H:"#555",C:"#37474F",D:"#263238",P:"#263238"}
};
Object.assign(PAL,PAL3);

/* ===== NHÂN VẬT MÀN 3 ===== */
const NPC3=[
 {id:"mc",pal:"mc",name:"Người dẫn chương trình",x:15,y:8,dir:0,kind:"stage"},
 {id:"km",pal:"khachmoi",name:"Khách mời",x:18,y:8,dir:0,kind:"guest"},
 {id:"b1",pal:"cns",name:"Cán bộ Gian 1 · Chính quyền số",x:3,y:7,dir:0,kind:"booth",tag:"g1",
  intro:"Chào bạn! Gian Chính quyền số: ở đây bà con thử tra cứu tiến độ hồ sơ bằng mã hồ sơ, phản ánh hiện trường qua ứng dụng Công dân số TP.HCM."},
 {id:"b2",pal:"cns",name:"Cán bộ Gian 2 · Trí tuệ nhân tạo",x:5,y:14,dir:0,kind:"booth",tag:"g2",
  intro:"Gian Trí tuệ nhân tạo nè! Bạn thử trò chuyện với trợ lý ảo, rồi xem một đoạn video giả mạo (deepfake) để biết cách nhận ra nha."},
 {id:"b3",pal:"cns",name:"Cán bộ Gian 3 · Giáo dục số",x:28,y:7,dir:0,kind:"booth",tag:"g3",
  intro:"Gian Giáo dục số: kho học liệu số và nền tảng Bình dân học vụ số, học miễn phí ngay trên điện thoại."},
 {id:"b4",pal:"cns",name:"Cán bộ Gian 4 · Kinh tế số",x:29,y:14,dir:0,kind:"booth",tag:"g4",
  intro:"Gian Kinh tế số: xem livestream bán hàng của các hộ kinh doanh trong phường, thử thanh toán bằng mã QR an toàn."},
 {id:"v1",pal:"ongcu",name:"Cụ ông tham quan",x:4,y:10,dir:3,kind:"idle",line:"Ông mới tra cứu được hồ sơ của ông bằng mã hồ sơ, khỏi phải lên phường hỏi. Hay thiệt!"},
 {id:"v2",pal:"cho",name:"Chị tham quan",x:6,y:17,dir:3,kind:"idle",line:"Coi video giả mạo xong mới thấy sợ, giống y người thật. Từ nay ai gọi video xin tiền là chị gọi lại số quen để hỏi cho chắc."},
 {id:"v3",pal:"hs",name:"Cậu học sinh",x:27,y:10,dir:3,kind:"idle",line:"Em hay học thêm trên mạng, mà mẹ dặn không đưa số điện thoại, địa chỉ nhà cho người lạ trên mạng."},
 {id:"v4",pal:"banh",name:"Chị bán hàng online",x:30,y:17,dir:3,kind:"idle",line:"Chị bán hàng online, giờ dùng hóa đơn điện tử, khách quét mã QR trả tiền, sổ sách rõ ràng lắm."},
 {id:"a1",pal:"cuba",name:"Cụ bà ngồi xem",x:13,y:10,dir:3,kind:"idle",line:"Bà ngồi đây nghe sân khấu nói chuyện chuyển đổi số, dễ hiểu lắm con."},
 {id:"a2",pal:"chuA",name:"Chú ngồi xem",x:19,y:11,dir:3,kind:"idle",line:"Lát nữa sân khấu có câu hỏi nhận quà đó, con lên trả lời thử đi!"},
 {id:"a3",pal:"bem",name:"Em bé",x:14,y:12,dir:3,kind:"idle",line:"Ngày hội vui quá! Em thích nhất gian có robot trò chuyện."},
 {id:"l1",pal:"bacu",name:"Bác ở góc học tập số",x:3,y:22,dir:0,kind:"hong",pair:"h5"},
 {id:"l2",pal:"cns",name:"Thành viên Tổ công nghệ số",x:5,y:22,dir:1,kind:"hong",pair:"h5"},
 {id:"l3",pal:"ong2",name:"Ông học kỹ năng số",x:7,y:22,dir:0,kind:"idle",line:"Ông học xong bài cài VNeID trên Bình dân học vụ số rồi đó. Già rồi học vẫn kịp con à!"},
 {id:"bv",pal:"baove",name:"Bác bảo vệ",x:24,y:25,dir:2,kind:"idle",line:"Xe máy gửi ở bãi bên này nha con. Đi hết các gian rồi hẵng về!"},
 {id:"w1",pal:"chay",name:"Bác đi dạo",x:17,y:19,dir:2,kind:"idle",line:"Năm nay Ngày hội đông vui ghê, có cả gian trí tuệ nhân tạo nữa."},
 {id:"w2",pal:"khach",name:"Anh đi xem hội",x:11,y:24,dir:1,kind:"idle",line:"Mình vừa đặt mật khẩu mới cho tài khoản ngân hàng theo hướng dẫn ở Ngày hội, dài và khó đoán hơn rồi."}
];
HONG.h5={title:"góc học tập số",lines:[["l2","Bác ơi, Bình dân học vụ số có bài học ngắn, bác học trên điện thoại lúc nào cũng được."],["l1","Vậy hả con? Bác muốn học cách làm thủ tục trên VNeID."],["l2","Có bài đó luôn bác, miễn phí. Học xong bác chỉ lại cho mấy bà trong xóm nha!"],["l1","Ừ, để bác rủ cả nhà cùng học."]]};
const L3={id:3,MW:34,MH:30,build:buildMap3,buildings:[],decos:[],tile:drawTile3,deco:()=>{},paint:paint3,overhead:overhead3,drawObj:()=>{},npcDef:NPC3,start:{x:16,y:27,dir:3},nEv:2,
 solidT:new Set([TREE,FENCE,POT,BLD,STAGE,CHAIR,TENT,TABLE,SPK,LAMP,ARCH,BIKE,BED])};
const SPOTS3=["b1","b2","b3","b4","mc"];
L3.init=()=>{S.m3={n:0};NPC3.forEach(d=>{if(d.kind==="booth")S.quiz[d.id]=shuffle(BANK3[d.tag].slice())[0]});S.quiz.mc=shuffle(BANK3.st.slice())[0]};
L3.quest=()=>S.m3.n<5?`Màn 3 · Tham quan gian trưng bày và sân khấu: <b>${S.m3.n}/5</b>`:"Màn 3 · Xong! Bấm <b>Đi tiếp</b> để ra <b>cổng chào</b> về nhà";
L3.target=()=>{const p=S.p;let best=null,bd=1e9;npcs.forEach(n=>{if(!SPOTS3.includes(n.id)||S.done.has(n.id))return;const d=Math.hypot(n.x-p.x,n.y-p.y);if(d<bd){bd=d;best=n}});
  return best||{x:16,y:28,px:16.5*TS,py:28*TS,exit:true}};
L3.exitGoal=(x,y)=>at(x,y)===GATE;
L3.mark=(n,x,y)=>{
  if(SPOTS3.includes(n.id)){if(S.done.has(n.id))drawSmile(x,y);else drawQ(x,y);return}
  if(n.kind==="hong"&&!S.joined.has(n.pair)&&HONG[n.pair].lines[0][0]===n.id)drawBubble(x+8,y);
  else if(n.kind==="idle"&&!S.joined.has(n.id))drawBubble(x,y)};
L3.onStep=p=>{
  if(at(p.x,p.y)===GATE&&!S.ended&&!S.busy){
    if(S.m3.n>=5){
      if(S.evDone<S.events.length){S.pending=null;runEvent(S.events[S.evDone]);return true}
      endM3();return true}
    S.busy=true;held=null;
    (async()=>{await say("Bác bảo vệ",`Ngày hội còn ${5-S.m3.n} điểm có dấu ? chưa ghé đó con. Đi hết rồi hẵng về nha!`);closeDlg();startMove(S.p,3);S.busy=false})();return true}
  return false};
function m3Done(id){S.done.add(id);S.m3.n++;updHud();if(S.m3.n===2||S.m3.n===4)queueEvent(2)}
L3.talk=async function(n){
  if(n.kind==="booth"){
    if(S.done.has(n.id)){await say(n,"Cảm ơn bạn đã ghé gian của tụi mình nha!");return}
    await say(n,n.intro);
    await quiz(n,S.quiz[n.id],"Câu hỏi của gian:");
    m3Done(n.id);
    if(S.m3.n>=5){sfx("win");await say("Hướng dẫn","Bạn đã đi hết các gian và sân khấu! Bấm Đi tiếp để ra cổng chào về nhà.")}
    return;
  }
  if(n.kind==="stage"||n.kind==="guest"){
    const mc=npcs.find(x=>x.id==="mc"),km=npcs.find(x=>x.id==="km");
    if(S.done.has("mc")){await say(n,"Cảm ơn bạn đã tham gia giao lưu cùng sân khấu!");return}
    await say(mc,"Kính chào bà con! Hôm nay 10/10 là Ngày Chuyển đổi số quốc gia. Mời khách mời chia sẻ: chuyển đổi số mang lại gì cho người dân?");
    await say(km,"Chủ đề năm nay là đi tới kết quả thực chất. Bà con làm thủ tục trên VNeID, Cổng Dịch vụ công, nhận kết quả điện tử, đỡ phải đi lại nhiều lần.");
    await say(mc,"Còn chuyện an toàn trên mạng thì sao ạ?");
    await say(km,"Từ 1/1/2026 Luật Bảo vệ dữ liệu cá nhân có hiệu lực, từ 1/7/2026 Luật An ninh mạng 2025 và Luật Chuyển đổi số có hiệu lực. Bà con nhớ giữ kỹ mật khẩu, mã OTP, ảnh căn cước, không đưa cho người lạ.");
    await say(mc,"Cảm ơn khách mời! Giờ là câu hỏi nhận quà dành cho khán giả!");
    const ok=await quiz(mc,S.quiz.mc,"Câu hỏi sân khấu:");
    if(ok){toast("🎁 Nhận quà sân khấu!","good");await say(mc,"Chúc mừng bạn! Mời bạn nhận phần quà của Ngày hội.")}
    m3Done("mc");
    if(S.m3.n>=5){sfx("win");await say("Hướng dẫn","Bạn đã đi hết các gian và sân khấu! Bấm Đi tiếp để ra cổng chào về nhà.")}
    return;
  }
  if(n.kind==="hong"){
    const H=HONG[n.pair];
    if(S.joined.has(n.pair)){await say(n,"Cảm ơn bạn ghé góc học tập số nha!");return}
    const k=await ask("Hóng chuyện","Ở "+H.title+" đang có người trò chuyện. Bạn có muốn nghe không?",["👂 Nghe","Bỏ qua"]);
    if(k===1)return;
    for(const [id,l] of H.lines){const sp=npcs.find(x=>x.id===id);await say(sp||id,l)}
    S.joined.add(n.pair);sfx("ok");toast("Hóng chuyện +1","good");return;
  }
  if(n.kind==="idle"){await say(n,n.line);S.joined.add(n.id);return}
};
async function startM3(){
  $("lvend").hidden=true;S.busy=true;loadLevel(L3);music(true);
  await say("Hướng dẫn","Màn 3 · Ngày hội Chuyển đổi số 10/10 của phường Gia Định. Quảng trường đông vui quá!");
  await say(S.name,"Ghé hết 4 gian trưng bày và sân khấu (có dấu ? vàng) rồi mới về nha!");
  closeDlg();S.busy=false;updHud();
}
async function endM3(){
  S.ended=true;S.busy=true;held=null;music(false);sfx("win");
  await say("Hướng dẫn","Bạn đã tham quan hết Ngày hội Chuyển đổi số!");closeDlg();
  S.res[3]={correct:S.correct,score:S.score-S.lvScore0};S.rw[3]=S.correct>=QNEED;
  showTv();
}
