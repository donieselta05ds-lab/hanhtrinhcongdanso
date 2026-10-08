/* MÀN 2 · Trung tâm Phục vụ hành chính công: bản đồ, nhân vật, diễn biến */

/* ===== MÀN 2: TRUNG TÂM PHỤC VỤ HÀNH CHÍNH CÔNG PHƯỜNG GIA ĐỊNH =====
   Bản đồ dựng theo bản vẽ tay và ảnh chụp bên trong Trung tâm (đã vẽ lại thành pixel, không dùng ảnh gốc). */
const FLOOR=20,WWALL=21,WALLW=22,COUNTER=23,GLASS=24,BENCH=25,PCDESK=26,PILLAR=27,PARK=28,BIKE=29,BED=30,STAIRS=31,GATE=32,DOORT=33,COPY=34,TABLE=35;
const B2=[{x:1,y:22,w:5,h:5,door:[3,26],wall:"#FFF3E0",roof:"#C62828",sign:"QUẦY TIẾP DÂN"}];
function buildMap2(){
  map.fill(G);
  /* trong nhà */
  fill(0,0,29,0,WALLW);fill(0,0,0,12,WALLW);fill(29,0,29,12,WALLW);
  fill(1,1,28,1,WWALL);fill(1,2,28,11,FLOOR);
  fill(5,3,24,3,COUNTER);fill(4,2,4,3,GLASS);fill(25,2,25,3,GLASS);
  /* phòng tiếp công dân (vách kính) */
  fill(1,5,6,5,GLASS);fill(1,9,6,9,GLASS);fill(6,5,6,9,GLASS);put(6,7,DOORT);put(2,7,TABLE);put(3,7,TABLE);
  /* ghế chờ inox */
  fill(8,6,12,6,BENCH);fill(16,6,20,6,BENCH);fill(8,8,12,8,BENCH);fill(16,8,20,8,BENCH);put(14,8,PILLAR);
  /* bàn tra cứu, máy photocopy */
  fill(28,5,28,8,PCDESK);put(28,11,COPY);put(1,2,POT);put(24,11,POT);put(1,11,POT);
  /* vách kính mặt tiền + 2 cửa đẩy */
  fill(1,12,28,12,GLASS);put(11,12,DOORT);put(12,12,DOORT);put(17,12,DOORT);put(18,12,DOORT);
  /* ngoài sân */
  fill(0,13,0,30,TREE);fill(29,13,29,30,TREE);
  fill(1,13,28,14,PAVE);fill(24,13,27,14,STAIRS);
  fill(1,15,6,19,PARK);fill(1,15,6,15,FENCE);fill(7,15,7,20,FENCE);fill(1,20,6,20,FENCE);
  [[2,17],[3,17],[5,17],[2,19],[4,19]].forEach(([x,y])=>put(x,y,BIKE));
  fill(9,16,12,17,BED);fill(17,16,21,17,BED);fill(13,15,16,28,PAVE);
  fill(8,19,12,27,PARK);fill(17,19,22,27,PARK);
  for(const y of [20,22,24,26]){fill(9,y,11,y,BIKE);fill(18,y,21,y,BIKE)}
  B2.forEach(b=>fill(b.x,b.y,b.x+b.w-1,b.y+b.h-1,BLD));
  fill(1,28,28,28,PAVE);fill(0,29,29,29,FENCE);put(14,29,GATE);put(15,29,GATE);fill(0,30,29,30,ROAD);
  [[24,16],[27,17],[25,20],[27,23],[24,25],[26,26],[23,18],[2,21]].forEach(([x,y])=>{if(at(x,y)===G)put(x,y,TREE)});
}
function drawTile2(c,t,x,y){
  const X=x*TS,Y=y*TS,h=hash(x,y);
  if(t===FLOOR||t===DOORT||t===GLASS||t===TABLE||t===PCDESK||t===COPY||t===BENCH||t===PILLAR||t===COUNTER||(t===POT&&y<=12)){
    px(c,(x+y)%2?"#E9ECEF":"#F3F5F7",X,Y,TS,TS);px(c,"#D5DAE0",X,Y,TS,1);px(c,"#D5DAE0",X,Y,1,TS);
    if(t===DOORT){px(c,"#9AA3B5",X,Y,1,TS);px(c,"#9AA3B5",X+15,Y,1,TS)}
  }
  if(t===WWALL){px(c,"#C8955A",X,Y,TS,TS);for(let i=0;i<TS;i+=3)px(c,"#A87440",X+i,Y,1,TS);px(c,"#8A5A2B",X,Y+15,TS,1);return}
  if(t===WALLW){px(c,"#F7F7F2",X,Y,TS,TS);px(c,"#DADAD2",X,Y+15,TS,1);return}
  if(t===COUNTER){px(c,"#D9B27C",X,Y+3,TS,10);px(c,"#B98A4E",X,Y+12,TS,3);px(c,"#1A1A2E",X,Y+15,TS,1);px(c,"#BFE6FF",X,Y-2,TS,5);px(c,"#8FB8D6",X,Y-2,TS,1);if(x%4===0)px(c,"#8FB8D6",X,Y-6,1,9);
    if(x%4===2){px(c,"#1A1A2E",X+2,Y-4,9,7);px(c,"#3A6EA5",X+3,Y-3,7,5);px(c,"#FFFFFF",X+12,Y+4,3,4)}return}
  if(t===GLASS){px(c,"rgba(150,205,235,.45)",X,Y,TS,TS);px(c,"#8FB8D6",X,Y,TS,2);px(c,"#8FB8D6",X,Y+14,TS,2);px(c,"rgba(255,255,255,.7)",X+3+(h*6|0),Y+3,2,9);return}
  if(t===BENCH){px(c,"#1A1A2E",X,Y+5,TS,8);px(c,"#C9CED6",X,Y+6,TS,6);for(let i=1;i<TS;i+=3)px(c,"#8C949F",X+i,Y+8,1,1);px(c,"#9AA3B5",X+2,Y+12,2,4);px(c,"#9AA3B5",X+12,Y+12,2,4);px(c,"#E6E9EE",X,Y+2,TS,3);return}
  if(t===PCDESK){px(c,"#D9B27C",X,Y+6,TS,8);px(c,"#1A1A2E",X,Y+14,TS,2);px(c,"#1A1A2E",X+3,Y-2,10,9);px(c,"#2F4F6F",X+4,Y-1,8,6);px(c,"#1A1A2E",X+7,Y+7,2,2);px(c,"#333",X+3,Y+10,10,2);return}
  if(t===PILLAR){px(c,"#C8955A",X+3,Y-8,10,24);for(let i=0;i<10;i+=3)px(c,"#A87440",X+3+i,Y-8,1,24);px(c,"#1A1A2E",X+3,Y+15,10,1);return}
  if(t===COPY){px(c,"#1A1A2E",X+1,Y-4,14,20);px(c,"#F5F5F5",X+2,Y-3,12,18);px(c,"#9E9E9E",X+3,Y-2,10,3);px(c,"#BDBDBD",X+3,Y+5,10,2);px(c,"#BDBDBD",X+3,Y+9,10,2);return}
  if(t===TABLE){px(c,"#D9B27C",X,Y+5,TS,7);px(c,"#1A1A2E",X,Y+12,TS,1);px(c,"#FFFFFF",X+3,Y+6,6,4);return}
  if(t===POT&&y<=12){px(c,"#B5532A",X+4,Y+9,8,6);c.fillStyle="#2E9E44";c.beginPath();c.arc(X+8,Y+7,5,0,7);c.fill();return}
  if(t===PARK||t===BIKE){px(c,"#6B707C",X,Y,TS,TS);if(y%2===0)px(c,"#F5F5F5",X,Y,TS,1);
    if(t===BIKE){ /* xe máy tay ga nhìn ngang */
      const col=["#E53935","#1E88E5","#43A047","#FB8C00","#8E24AA","#F5F5F5"][(x*3+y)%6];
      c.fillStyle="#111";c.beginPath();c.arc(X+4,Y+12,3.2,0,7);c.arc(X+12.5,Y+12,3.2,0,7);c.fill();
      px(c,"#9E9E9E",X+3,Y+11,2,2);px(c,"#9E9E9E",X+12,Y+11,2,2);
      px(c,col,X+3,Y+7,7,3);px(c,col,X+9,Y+5,4,6);px(c,col,X+2,Y+8,2,2);
      px(c,"#1A1A2E",X+3,Y+5,6,2);px(c,"#555",X+7,Y+10,5,1);
      px(c,"#333",X+12,Y+2,1,4);px(c,"#333",X+11,Y+2,3,1);px(c,"#FFF59D",X+13,Y+5,2,2);
      px(c,"rgba(0,0,0,.25)",X+1,Y+15,14,1)}return}
  if(t===BED){px(c,"#B5532A",X,Y+2,TS,14);px(c,"#8D3F1F",X,Y+15,TS,1);c.fillStyle=h>.5?"#2E9E44":"#3CB55A";c.beginPath();c.arc(X+8,Y+6,7,0,7);c.fill();if(h>.6){px(c,"#FF4D6D",X+5,Y+3,2,2);px(c,"#FFD23F",X+10,Y+6,2,2)}return}
  if(t===STAIRS){for(let i=0;i<4;i++)px(c,i%2?"#C9CED6":"#E6E9EE",X,Y+i*4,TS,4);px(c,"#9AA3B5",X,Y,1,TS);return}
  if(t===GATE){px(c,"#F2DFA8",X,Y,TS,TS);px(c,"#555",X,Y,2,TS);px(c,"#555",X+14,Y,2,TS);return}
  if(t===FENCE&&y===29){px(c,"#74C94F",X,Y,TS,TS);px(c,"#3A3F4B",X,Y+4,TS,3);px(c,"#3A3F4B",X,Y+11,TS,3);for(let i=1;i<TS;i+=5)px(c,"#3A3F4B",X+i,Y,2,TS);return}
  if(t===FENCE){px(c,"#6B707C",X,Y,TS,TS);px(c,"#E6E9EE",X,Y+6,TS,2);px(c,"#C62828",X,Y+8,TS,2);px(c,"#9E9E9E",X+7,Y+2,2,14);return}
  if(t===BLD){drawTile(c,G,x,y);return}
  if(t===FLOOR||t===DOORT)return;
  drawTile(c,t,x,y);
}
function paint2(c){
  c.font="bold 7px 'Be Vietnam Pro',sans-serif";c.textBaseline="middle";c.textAlign="center";
  const T=(col,s,x,y,w)=>{c.fillStyle=col;c.fillText(s,x,y,w)};
  px(c,"#B71C1C",9*TS,1*TS+3,12*TS,10);T("#FFE27A","TRUNG TÂM PHỤC VỤ HÀNH CHÍNH CÔNG PHƯỜNG GIA ĐỊNH",15*TS,1*TS+8.5,12*TS-4);
  px(c,"#1E6FE0",1*TS+4,4*TS+3,5*TS-8,10);T("#fff","PHÒNG TIẾP CÔNG DÂN",3.5*TS,4*TS+8.5,5*TS-10);
  px(c,"#1E6FE0",26*TS+2,4*TS+3,3*TS-6,10);T("#fff","BÀN TRA CỨU",27.4*TS,4*TS+8.5,3*TS-8);
  px(c,"#C62828",1*TS+2,16*TS+2,5*TS-4,22);T("#fff","XE CÁN BỘ, CÔNG CHỨC",3.5*TS,16*TS+8,5*TS-6);T("#fff","Người dân không vào",3.5*TS,16*TS+17,5*TS-6);
  px(c,"#1E6FE0",8*TS,18*TS+4,5*TS,10);T("#fff","NƠI GỬI XE",10.5*TS,18*TS+9.5);
  px(c,"#1E6FE0",17*TS,18*TS+4,6*TS,10);T("#fff","NƠI GỬI XE",20*TS,18*TS+9.5);
  px(c,"#1A1A2E",13*TS+8,30*TS+3,3*TS,10);T("#FFE27A","CỔNG RA VÀO",15*TS,30*TS+8.5,3*TS-2);
  T("#1A1A2E","CẦU THANG ↑",26*TS,13*TS+4,4*TS);
  c.textAlign="left";
}
/* màn hình treo trên quầy + bảng gọi số lớn */
function banner2(x1,x2,Yp,txt,cx,cy){
  const X=x1*TS-cx,W=(x2-x1)*TS,Y=Yp-cy;if(X>VW*TS||X+W<0||Y<-20||Y>VH*TS)return;
  px(ctx,"#5D4037",X-6,Y-4,6,1);px(ctx,"#5D4037",X+W,Y-4,6,1);
  px(ctx,"#1A1A2E",X-1,Y-1,W+2,14);px(ctx,"#C8102E",X,Y,W,12);px(ctx,"#FFD23F",X,Y,W,1);px(ctx,"#FFD23F",X,Y+11,W,1);
  for(let i=0;i<W;i+=10)px(ctx,"rgba(0,0,0,.12)",X+i+5,Y+1,1,10);px(ctx,"#EEE",X+2,Y+2,2,2);px(ctx,"#EEE",X+W-4,Y+2,2,2);
  ctx.fillStyle="#FFE27A";ctx.font="bold 7px 'Be Vietnam Pro',sans-serif";ctx.textBaseline="middle";ctx.textAlign="center";ctx.fillText(txt,X+W/2,Y+6.5,W-8);ctx.textAlign="left";
}
function overhead2(cx,cy){
  banner2(5,24,12*TS-4,"NHIỆT LIỆT CHÀO MỪNG NGÀY CHUYỂN ĐỔI SỐ QUỐC GIA 10/10",cx,cy);
  banner2(1,13,29*TS-8,"CHUYỂN ĐỔI SỐ THIẾT THỰC, AN TOÀN, HIỆU QUẢ",cx,cy);
  banner2(17,28,29*TS-8,"MỖI NGƯỜI DÂN MỘT KỸ NĂNG SỐ",cx,cy);
  ctx.font="bold 6px 'Be Vietnam Pro',sans-serif";ctx.textBaseline="middle";ctx.textAlign="center";
  const Q=[{n:1,x:5},{n:2,x:9},{n:3,x:13},{n:4,x:17},{n:5,x:21}];
  const lab={1:"QUẦY 1",2:"SAO Y – CHỨNG THỰC",3:"tạm nghỉ",4:"KINH TẾ – CÔNG THƯƠNG",5:"ĐỊA CHÍNH – XÂY DỰNG"};
  const num={4:"4014",5:"5029"};if(S.m2&&S.m2.called&&S.m2.quay)num[S.m2.quay]=S.m2.ticket;
  Q.forEach(q=>{const X=q.x*TS+4-cx,Y=2*TS-14-cy;if(X>VW*TS||X+56<0)return;
    px(ctx,"#333",X+27,Y-8,2,8);px(ctx,"#1A1A2E",X-1,Y-1,58,22);px(ctx,"#D61F2C",X,Y,56,10);px(ctx,"#FFFFFF",X,Y+10,56,10);
    ctx.fillStyle="#fff";ctx.fillText("QUẦY "+q.n,X+28,Y+3.5);ctx.font="bold 4px 'Be Vietnam Pro',sans-serif";ctx.fillText(lab[q.n],X+28,Y+8,54);ctx.font="bold 7px 'Be Vietnam Pro',sans-serif";
    ctx.fillStyle="#C62828";ctx.fillText(num[q.n]||"",X+28,Y+15.5);ctx.font="bold 6px 'Be Vietnam Pro',sans-serif"});
  /* bảng gọi số lớn trên tường trái */
  const X=1*TS-cx+2,Y=2*TS-cy-4;
  if(X<VW*TS&&Y<VH*TS){px(ctx,"#1A1A2E",X-1,Y-1,48,46);px(ctx,"#D61F2C",X,Y,46,7);px(ctx,"#EAF2FA",X,Y+7,46,37);
    ctx.fillStyle="#fff";ctx.font="bold 4px 'Be Vietnam Pro',sans-serif";ctx.fillText("BẢNG GỌI SỐ",X+23,Y+3.8);
    for(let i=1;i<=5;i++){ctx.fillStyle="#1E6FE0";ctx.fillText("QUẦY "+i,X+12,Y+5+i*7);ctx.fillStyle="#C62828";ctx.fillText(num[i]||"—",X+34,Y+5+i*7)}}
  ctx.textAlign="left";
}
/* đồ vật: kiosk, bảng chỉ dẫn, standee */
function drawObj2(c,e,x,y){
  if(e.obj==="kiosk"||e.obj==="kiosk2"){px(c,"#1A1A2E",x+2,y-12,12,28);px(c,"#FFFFFF",x+3,y-11,10,26);px(c,"#1A1A2E",x+4,y-9,8,8);px(c,e.obj==="kiosk"?"#E8F1FB":"#FDECEA",x+5,y-8,6,6);px(c,"#D61F2C",x+5,y-8,6,1);px(c,"#9E9E9E",x+5,y+2,6,1);px(c,"#D61F2C",x+6,y+6,4,4);return}
  if(e.obj==="standee"){px(c,"#555",x+4,y+8,2,8);px(c,"#555",x+10,y+8,2,8);px(c,"#1A1A2E",x+1,y-12,14,21);px(c,"#1E6FE0",x+2,y-11,12,19);px(c,"#FFC93C",x+3,y-9,10,3);px(c,"#FFFFFF",x+4,y-4,8,1);px(c,"#FFFFFF",x+4,y-1,8,1);px(c,"#FFFFFF",x+4,y+2,6,1);return}
  if(e.obj==="sign"){px(c,"#555",x+7,y-2,2,18);px(c,"#1A1A2E",x-6,y-12,28,12);px(c,"#1E6FE0",x-5,y-11,26,10);c.fillStyle="#fff";c.font="bold 4px 'Be Vietnam Pro',sans-serif";c.textBaseline="middle";c.textAlign="center";c.fillText("CÔNG AN PHƯỜNG ➜",x+8,y-6,25);c.textAlign="left";return}
}
const PAL2={
 doan:{id:"doan2",H:"#141414",C:"#1E88E5",D:"#1565C0",P:"#1B2A49",vest:"#FFD23F"},
 baove:{id:"baove",H:"#333",C:"#5D7A3A",D:"#465E2B",P:"#2E3B1F",hat:"#465E2B"},
 canbo:{id:"canbo",H:"#1A1A1A",C:"#DCEBF7",D:"#B9D3E8",P:"#2C3E50"},
 canbo2:{id:"canbo2",H:"#2B1B14",C:"#DCEBF7",D:"#B9D3E8",P:"#37474F"},
 ca:{id:"ca2",H:"#111",C:"#6B8E3D",D:"#557230",P:"#4A6328",hat:"#4A6328"}
};
Object.assign(PAL,PAL2);
const NPC2=[
 {id:"doan2",pal:"doan",name:"Bạn đoàn viên hỗ trợ",x:10,y:14,dir:0,kind:"door"},
 {id:"st1",obj:"standee",name:"Standee",x:9,y:13,dir:0,kind:"idle",line:"Standee hướng dẫn: Quét mã để nộp hồ sơ trực tuyến, tra cứu tiến độ hồ sơ trên Cổng Dịch vụ công."},
 {id:"st2",obj:"standee",name:"Standee",x:20,y:13,dir:0,kind:"idle",line:"Standee: Thủ tục, thành phần hồ sơ, lệ phí đều được niêm yết công khai. Cần hỗ trợ, hỏi bạn đoàn viên nha!"},
 {id:"baove",pal:"baove",name:"Bác bảo vệ",x:8,y:17,dir:2,kind:"idle",line:"Khu bên trái là chỗ để xe của cán bộ, công chức, viên chức và người lao động, người dân không vào nha con. Bà con gửi xe ở hai bãi phía trước."},
 {id:"tiepdan",pal:"canbo2",name:"Cán bộ quầy tiếp dân",x:3,y:27,dir:3,kind:"idle",line:"Quầy tiếp dân tiếp nhận ý kiến, phản ánh, kiến nghị của bà con. Làm thủ tục hành chính thì vào Trung tâm bên trong nha."},
 {id:"sign",obj:"sign",name:"Bảng chỉ dẫn",x:27,y:27,dir:0,kind:"police"},
 {id:"k1",obj:"kiosk",name:"Kiosk cấp số thứ tự",x:14,y:11,dir:0,kind:"kiosk"},
 {id:"k2",obj:"kiosk2",name:"Kiosk tra cứu, scan hồ sơ",x:15,y:11,dir:0,kind:"idle",line:"Máy hỗ trợ tra cứu thủ tục và scan hồ sơ giấy để số hóa. Hồ sơ đã số hóa được lưu lại, lần sau không phải nộp lại."},
 {id:"q1",pal:"canbo",name:"Cán bộ Quầy 1",x:6,y:2,dir:0,kind:"counter",quay:1},
 {id:"q2",pal:"canbo2",name:"Cán bộ Quầy 2 · Sao y – Chứng thực",x:10,y:2,dir:0,kind:"counter",quay:2},
 {id:"q4",pal:"canbo",name:"Cán bộ Quầy 4 · Kinh tế – Công thương",x:18,y:2,dir:0,kind:"counter",quay:4},
 {id:"q5",pal:"canbo2",name:"Cán bộ Quầy 5 · Địa chính – Xây dựng",x:22,y:2,dir:0,kind:"counter",quay:5},
 {id:"tcd",pal:"canbo",name:"Cán bộ tiếp công dân",x:2,y:6,dir:0,kind:"idle",line:"Phòng tiếp công dân tiếp nhận khiếu nại, tố cáo, kiến nghị, phản ánh của người dân theo quy định."},
 {id:"g1",pal:"cohx",name:"Cô ngồi chờ",x:9,y:7,dir:0,kind:"gen",lead:"Con ơi, ngồi chờ buồn quá, cô hỏi cái này:"},
 {id:"g2",pal:"chuB",name:"Chú ngồi chờ",x:18,y:7,dir:0,kind:"gen",lead:"Chờ tới số mình còn lâu, chú hỏi con nè:"},
 {id:"g3",pal:"ongcu",name:"Cụ ông cần giúp",x:11,y:9,dir:3,kind:"gen",lead:"Cháu ơi, giúp ông với, ông không rành cái này:"},
 {id:"g4",pal:"cho",name:"Chị bế con",x:19,y:9,dir:3,kind:"gen",lead:"Em ơi, chị đang thắc mắc:"},
 {id:"g5",pal:"khach",name:"Anh tra cứu hồ sơ",x:27,y:6,dir:2,kind:"gen",lead:"Bạn ơi, mình đang tra cứu thì gặp câu này:"},
 {id:"g6",pal:"dv",name:"Bạn đoàn viên ở bàn tra cứu",x:27,y:9,dir:2,kind:"gen",lead:"Thử thách nhỏ của Đoàn phường nè:"},
 {id:"g7",pal:"chuA",name:"Chú chờ photocopy",x:27,y:11,dir:2,kind:"gen",lead:"Chờ photo, chú hỏi con chút:"}
];
const L2={id:2,MW:30,MH:31,build:buildMap2,buildings:B2,decos:[],tile:drawTile2,deco:()=>{},paint:paint2,overhead:overhead2,drawObj:drawObj2,npcDef:NPC2,start:{x:14,y:28,dir:3},
 solidT:new Set([TREE,FENCE,POT,BLD,WWALL,WALLW,COUNTER,GLASS,BENCH,PCDESK,PILLAR,BIKE,BED,STAIRS,COPY,TABLE])};
L2.init=()=>{
  const proc=["A","B","C"][Math.random()*3|0];
  S.m2={phase:"arrive",proc,quay:PROC[proc].quay,ticket:null,called:false,gen:0};
  const qs=shuffle(BANK2.slice());NPC2.filter(d=>d.kind==="gen").forEach((d,i)=>S.quiz[d.id]=qs[i]);
};
L2.quest=()=>{const m=S.m2,P=PROC[m.proc];return "Màn 2 · "+({arrive:"Gặp <b>bạn đoàn viên</b> ở cửa",ticket:"Lấy <b>số thứ tự</b> ở kiosk",police:"Sang <b>Công an phường</b> (bảng chỉ dẫn)",gen:`Trong lúc chờ, giúp mọi người <b>${m.gen}/6</b>`,called:`Mời số <b>${m.ticket}</b> đến <b>${P.place}</b>`,done:"Xong thủ tục! Ra <b>cổng</b> để về"}[m.phase])+" ▾"};
L2.more=()=>{const m=S.m2,P=PROC[m.proc];return `• Thủ tục của bạn: <b>${P.name}</b>${m.ticket?" · số thứ tự <b>"+m.ticket+"</b>":""}.<br>• Dấu <b>!</b> xanh là việc cần làm tiếp; dấu <b>!</b> vàng là người đang cần giúp.<br>• Bấm <b>F</b> hoặc chạm vào người, đồ vật để tương tác.<br>• Đúng +10 ★, sai −5 ★. Câu đúng: ${S.correct}/${S.answered}.`};
L2.taskNpc=()=>{const m=S.m2;
  if(m.phase==="arrive")return npcs.find(n=>n.id==="doan2");
  if(m.phase==="ticket")return npcs.find(n=>n.id==="k1");
  if(m.phase==="police")return npcs.find(n=>n.id==="sign");
  if(m.phase==="called")return npcs.find(n=>n.kind==="counter"&&n.quay===m.quay);
  return null};
L2.target=()=>{const m=S.m2,t=L2.taskNpc();if(t)return t;
  if(m.phase==="gen"){const p=S.p;let best=null,bd=1e9;npcs.forEach(n=>{if(n.kind!=="gen"||S.done.has(n.id))return;const d=Math.hypot(n.x-p.x,n.y-p.y);if(d<bd){bd=d;best=n}});if(best)return best}
  return {x:14.5,y:29,px:14.5*TS,py:29*TS,exit:true}};
L2.mark=(n,x,y,tg)=>{const m=S.m2;
  if(n===L2.taskNpc()){drawBang(x,y,"#7CD6FF");return}
  if(n.kind==="gen"&&!S.done.has(n.id)&&(m.phase==="gen"||m.phase==="called"||m.phase==="done"))drawBang(x,y,"#FFD23F");
  else if(n.kind==="idle"&&!S.joined.has(n.id))drawBubble(x,y)};
L2.onStep=p=>{
  if(at(p.x,p.y)===GATE&&!S.ended&&!S.busy){
    if(S.m2.phase==="done"){endM2();return true}
    S.busy=true;held=null;
    (async()=>{await say("Bác bảo vệ","Con chưa làm xong thủ tục mà, vào lại Trung tâm đi con!");closeDlg();startMove(S.p,3);S.busy=false})();return true}
  return false};
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
      await say(n,"Bạn vào trong, lấy số thứ tự ở kiosk cạnh cửa trước nha. Trong lúc chờ gọi số, có nhiều bà con cần giúp lắm đó!");m.phase="ticket";
    }
    sfx("win");toast("Nhiệm vụ mới!");return;
  }
  if(n.kind==="kiosk"){
    if(m.phase==="arrive"){await say(n,"Màn hình: Chào mừng bạn đến Trung tâm. Hỏi bạn đoàn viên ở cửa nếu cần hướng dẫn nha.");return}
    if(m.proc==="C"){await say(n,"Màn hình: Đăng ký cư trú thực hiện tại Công an phường.");return}
    if(m.ticket){await say(n,"Bạn đã có số thứ tự "+m.ticket+" rồi, ngồi chờ gọi số nha.");return}
    const opts=["Đăng ký khai sinh","Chứng thực bản sao","Đăng ký thường trú"];
    while(true){const k=await ask(n,"Kiosk cấp số thứ tự · Bạn chọn thủ tục cần làm:",opts);
      if(opts[k]===P.name)break;
      await say(n,k===2?"Màn hình: Đăng ký thường trú thực hiện tại Công an phường. Bạn chọn lại nhé.":"Đây không phải thủ tục bạn cần làm. Chọn lại nhé!")}
    m.ticket=String(m.quay*1000+30+(Math.random()*9|0));sfx("item");
    await say(n,`🎫 Phiếu số thứ tự: ${m.ticket} · ${P.place}.\nVui lòng ngồi chờ, số sẽ hiện trên màn hình và được đọc qua loa.`);
    m.phase="gen";return;
  }
  if(n.kind==="police"){
    if(m.proc!=="C"){await say(n,"Bảng chỉ dẫn: Lối sang Công an phường ➜. Thủ tục của bạn làm ngay tại Trung tâm nha.");return}
    if(m.phase!=="police"){await say(n,"Bạn đã làm xong ở Công an phường rồi.");return}
    await say(n,"Bạn đi theo bảng chỉ dẫn sang Công an phường…");
    const ca={name:"Cán bộ Công an phường"};
    await say(ca,"Chào bạn! Đăng ký thường trú làm tại đây nha. Trước khi nộp, mình hỏi bạn vài câu để nắm quy định nhé.");
    for(let i=0;i<4;i++){const ok=await quiz(ca,P.qs[i],`Câu ${i+1}/4:`);S.answered++;if(ok)S.correct++;updHud()}
    await say(ca,"Hồ sơ của bạn đã được tiếp nhận, đây là phiếu tiếp nhận. Thông tin sẽ cập nhật vào Cơ sở dữ liệu về cư trú, bạn xem trên VNeID nha!");
    await say("Gợi ý","Quay lại Trung tâm, trong sảnh có nhiều bà con đang cần giúp (dấu ! vàng). Giúp đủ 6 người rồi ra cổng về nhé.");
    m.phase="gen";return;
  }
  if(n.kind==="gen"){
    if(S.done.has(n.id)){await say(n,"Cảm ơn bạn đã giúp nha!");return}
    if(m.phase==="arrive"||m.phase==="ticket"){await say(n,"Bạn lấy số thứ tự rồi ngồi chờ đi, lát mình hỏi bạn chuyện này nha!");return}
    if(m.phase==="police"){await say(n,"Đăng ký thường trú bên Công an phường đó, bạn đi theo bảng chỉ dẫn ngoài sân nha!");return}
    const ok=await quiz(n,S.quiz[n.id],n.lead);S.done.add(n.id);S.answered++;if(ok)S.correct++;
    if(m.phase==="gen"){m.gen++;updHud();
      if(m.gen===2||m.gen===5){const ev=S.events[S.evDone];if(ev)S.pending={ev,walk:3+(Math.random()*3|0)}}
      if(m.gen>=6){
        closeDlg();
        if(m.proc==="C"){m.phase="done";sfx("win");await say("Gợi ý","Tuyệt vời! Bạn đã giúp đủ 6 người. Ra cổng để về nhé!")}
        else{m.called=true;m.phase="called";sfx("ring");await sleep(300);sfx("win");toast("🔔 Đến lượt bạn!","good");
          await say("Loa Trung tâm",`Kính mời công dân có số thứ tự ${m.ticket} đến ${P.place}.`)}
      }}
    return;
  }
  if(n.kind==="counter"){
    if(m.phase==="called"&&n.quay===m.quay){
      await say(n,"Chào bạn, mời bạn ngồi. Trước khi tiếp nhận hồ sơ "+P.name.toLowerCase()+", mình hỏi nhanh vài câu nha.");
      for(let i=0;i<4;i++){const ok=await quiz(n,P.qs[i],`Câu ${i+1}/4:`);S.answered++;if(ok)S.correct++;updHud()}
      await say(n,"Hồ sơ của bạn đã được tiếp nhận. Kết quả có thể nhận bản điện tử hoặc qua bưu chính công ích nha.");
      const k=await ask(n,"Mời bạn đánh giá mức độ hài lòng trên máy tính bảng ở quầy:",["😊 Rất hài lòng","🙂 Hài lòng","😐 Chưa hài lòng"]);
      await say(n,k===2?"Cảm ơn góp ý của bạn, Trung tâm sẽ cố gắng phục vụ tốt hơn!":"Cảm ơn bạn đã đánh giá! Chúc bạn một ngày vui.");
      m.phase="done";sfx("win");toast("Xong thủ tục!","good");return;
    }
    if(m.called&&n.quay!==m.quay){await say(n,`Số ${m.ticket} được gọi ở ${P.place} nha bạn.`);return}
    const line={1:"Bạn lấy số thứ tự ở kiosk rồi chờ gọi số nha.",2:"Quầy 2 giải quyết thủ tục sao y, chứng thực. Bạn lấy số ở kiosk rồi chờ gọi số nha.",4:"Quầy 4 giải quyết thủ tục lĩnh vực kinh tế, công thương.",5:"Quầy 5 giải quyết thủ tục lĩnh vực địa chính, xây dựng, đô thị và môi trường."}[n.quay];
    await say(n,m.phase==="done"?"Chúc bạn một ngày vui!":line);return;
  }
  if(n.kind==="idle"){await say(n,n.line);if(!S.joined.has(n.id)){S.joined.add(n.id)}return}
};
async function startM2(){
  $("m1end").hidden=true;S.busy=true;loadLevel(L2);music(true);
  await say("Gợi ý","Màn 2 · Trung tâm Phục vụ hành chính công phường Gia Định. Bạn gửi xe xong, đi lên sân trước Trung tâm…");
  await say(S.name,"Hôm nay mình phải làm thủ tục "+PROC[S.m2.proc].name.toLowerCase()+". Hỏi bạn đoàn viên ở cửa trước đã!");
  closeDlg();S.busy=false;
}
async function endM2(){
  S.ended=true;S.busy=true;held=null;music(false);sfx("win");
  await say("Gợi ý","Bạn đã hoàn thành thủ tục ở Trung tâm Phục vụ hành chính công!");closeDlg();
  S.res[2]={correct:S.correct,score:S.score-S.lvScore0};
  const ok=S.correct>=7;S.reward2=ok;
  $("m2title").textContent=ok?"Huy hiệu “Thủ tục nhanh gọn”":"Chưa đạt huy hiệu";$("m2medal").textContent=ok?"🏅":"🙂";
  $("m2eval").textContent=(ok?"Bạn nắm chắc quy trình, vừa làm xong thủ tục vừa giúp được bà con xung quanh!":"Bạn đã làm xong thủ tục. Cần trả lời đúng từ 7/10 câu để nhận huy hiệu nha.")+" Thủ tục: "+PROC[S.m2.proc].name+".";
  $("m2ok").textContent=S.correct+"/10";$("m2pts").textContent=S.res[2].score;
  $("m2end").hidden=false;$("m2end").scrollTop=0;
}
