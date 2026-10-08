/* MÀN 1 · Khu phố: bản đồ, nhà cửa, nhân vật, hội thoại hóng chuyện */

/* ===== BẢN ĐỒ MÀN 1: HẺM KHU PHỐ ===== */
const TS=16,VW=11;let MW=36,MH=26,VH=14;let LV=null;
const G=0,R=1,TREE=2,PAVE=3,BLD=4,FENCE=5,BUSH=6,FLOW=7,POT=8,DECO=9,ROAD=10;
let map=new Uint8Array(MW*MH);
const at=(x,y)=>(x<0||y<0||x>=MW||y>=MH)?TREE:map[y*MW+x];
const put=(x,y,v)=>{if(x>=0&&y>=0&&x<MW&&y<MH)map[y*MW+x]=v};
const fill=(x1,y1,x2,y2,v)=>{for(let y=y1;y<=y2;y++)for(let x=x1;x<=x2;x++)put(x,y,v)};
const hash=(x,y)=>{let h=x*374761393+y*668265263;h=(h^(h>>13))*1274126177;return ((h^(h>>16))>>>0)/4294967295};
const BUILDINGS=[
 {x:2,y:7,w:4,h:4,door:[3,10],wall:"#FFE7B0",roof:"#E0533D",sign:"NHÀ BẠN"},
 {x:6,y:7,w:4,h:4,door:[7,10],wall:"#D8F0FF",roof:"#2F80ED"},
 {x:2,y:2,w:4,h:4,door:[3,5],wall:"#FFF1D6",roof:"#27AE60"},
 {x:6,y:2,w:4,h:4,door:[7,5],wall:"#FDE2F3",roof:"#9B51E0"},
 {x:13,y:2,w:10,h:4,door:[17,5],wall:"#FFF4C2",roof:"#D35400",sign:"NHÀ VĂN HÓA KHU PHỐ"},
 {x:26,y:7,w:5,h:4,door:[27,10],wall:"#F7E1C8",roof:"#8B4513",sign:"CÀ PHÊ",awning:"#2E7D32"},
 {x:31,y:7,w:4,h:4,door:[32,10],wall:"#E3F6E8",roof:"#16A085"},
 {x:26,y:2,w:4,h:4,door:[27,5],wall:"#FFF0E0",roof:"#C0392B"},
 {x:30,y:2,w:5,h:4,door:[31,5],wall:"#E8EEFF",roof:"#34495E"},
 {x:1,y:15,w:5,h:4,door:[3,18],wall:"#FFF3E0",roof:"#E74C3C",sign:"TẠP HÓA",awning:"#E74C3C"},
 {x:6,y:15,w:4,h:4,door:[7,18],wall:"#FFF8DC",roof:"#A0522D"},
 {x:1,y:20,w:4,h:4,door:[2,23],wall:"#E0F7FA",roof:"#00897B"},
 {x:5,y:20,w:5,h:4,door:[7,23],wall:"#FCE4EC",roof:"#D81B60"},
 {x:13,y:15,w:4,h:4,door:[14,18],wall:"#F1F8E9",roof:"#558B2F"},
 {x:18,y:15,w:5,h:4,door:[20,18],wall:"#FFFDE7",roof:"#F39C12"},
 {x:13,y:20,w:4,h:4,door:[14,23],wall:"#EDE7F6",roof:"#5E35B1"},
 {x:18,y:20,w:5,h:4,door:[20,23],wall:"#E3F2FD",roof:"#1565C0"},
 {x:26,y:15,w:4,h:4,door:[27,18],wall:"#FFEBEE",roof:"#C62828"},
 {x:30,y:15,w:5,h:4,door:[32,18],wall:"#F9FBE7",roof:"#827717"},
 {x:26,y:20,w:4,h:4,door:[27,23],wall:"#E0F2F1",roof:"#00695C"},
 {x:30,y:20,w:5,h:4,door:[32,23],wall:"#FFF3E0",roof:"#EF6C00"}
];
const DECOS=[{t:"table",x:14,y:8},{t:"table2",x:15,y:8},{t:"cafe",x:29,y:11},{t:"cafe",x:30,y:11},{t:"pole",x:12,y:11},{t:"pole",x:23,y:11},{t:"exit",x:34,y:11},{t:"pole",x:26,y:14},{t:"pole",x:34,y:14}];
function buildMap(){
  map.fill(G);
  fill(0,0,MW-1,0,TREE);fill(0,MH-1,MW-1,MH-1,TREE);fill(0,0,0,MH-1,TREE);fill(MW-1,0,MW-1,MH-1,TREE);
  fill(1,12,34,13,R);fill(35,12,35,13,ROAD);
  fill(10,2,11,24,R);fill(24,2,25,24,R);
  fill(12,6,23,11,PAVE);
  BUILDINGS.forEach(b=>fill(b.x,b.y,b.x+b.w-1,b.y+b.h-1,BLD));
  DECOS.forEach(d=>put(d.x,d.y,DECO));
  [[1,1],[2,1],[1,6],[12,1],[23,1],[34,6],[1,24],[9,24],[12,24],[23,24],[26,24],[34,24],[12,14],[23,14],[1,19],[34,19]].forEach(([x,y])=>{if(at(x,y)===G)put(x,y,TREE)});
  [[1,11],[9,11],[25,11]].forEach(([x,y])=>{if(at(x,y)===G)put(x,y,POT)});
  for(let y=1;y<MH-1;y++)for(let x=1;x<MW-1;x++)if(at(x,y)===G&&hash(x,y)>.88)put(x,y,FLOW);
}
/* ===== VẼ ===== */
function px(c,col,x,y,w=1,h=1){c.fillStyle=col;c.fillRect(x,y,w,h)}
function drawTile(c,t,x,y){
  const X=x*TS,Y=y*TS,h=hash(x,y);
  if(t===R){px(c,"#B9BEC9",X,Y,TS,TS);for(let i=0;i<4;i++){const a=hash(x*7+i,y*3);px(c,"#A3A9B6",X+(a*15|0),Y+((a*97)%15|0),2,1)}px(c,"#CDD2DB",X,Y,TS,1);return}
  if(t===ROAD){px(c,"#4A4E5A",X,Y,TS,TS);px(c,"#FFFFFF",X+6,Y+7,4,2);return}
  if(t===PAVE){px(c,"#F2DFA8",X,Y,TS,TS);px(c,"#D9C27F",X,Y,TS,1);px(c,"#D9C27F",X,Y,1,TS);px(c,"#E8D193",X+8,Y+8,8,1);return}
  px(c,h>.5?"#7FD35B":"#74C94F",X,Y,TS,TS);
  for(let i=0;i<3;i++){const a=hash(x+i*11,y*5+i);px(c,"#4FA83A",X+(a*14|0),Y+((a*131)%13|0),1,2)}
  if(t===FLOW){[["#FF4D6D",3,4],["#FFD23F",10,9],["#FFFFFF",6,12],["#FF4D6D",12,3]].forEach(([col,a,b])=>{px(c,col,X+a,Y+b,2,2);px(c,"#2E7D32",X+a,Y+b+2,1,2)})}
  if(t===TREE){px(c,"#6B4226",X+6,Y+10,4,6);c.fillStyle="#1B7A2E";c.beginPath();c.arc(X+8,Y+7,7,0,7);c.fill();c.fillStyle="#2FA84F";c.beginPath();c.arc(X+6,Y+5,4,0,7);c.fill();px(c,"#0F4D1C",X+3,Y+11,10,1)}
  if(t===POT){px(c,"#B5532A",X+4,Y+9,8,6);px(c,"#1A1A2E",X+4,Y+15,8,1);c.fillStyle="#2E9E44";c.beginPath();c.arc(X+8,Y+7,5,0,7);c.fill();px(c,"#FF4D6D",X+6,Y+4,2,2);px(c,"#FFD23F",X+10,Y+6,2,2)}
}
function drawBuilding(c,b){
  const X=b.x*TS,Y=b.y*TS,W=b.w*TS,H=b.h*TS,rh=Math.min(26,H*.42)|0;
  px(c,"rgba(0,0,0,.28)",X+3,Y+H-2,W,5);
  px(c,b.wall,X,Y+rh-4,W,H-rh+4);px(c,"#1A1A2E",X,Y+rh-4,1,H-rh+4);px(c,"#1A1A2E",X+W-1,Y+rh-4,1,H-rh+4);px(c,"#1A1A2E",X,Y+H-1,W,1);
  px(c,b.roof,X-2,Y,W+4,rh);for(let i=0;i<W+4;i+=6)px(c,"rgba(0,0,0,.12)",X-2+i,Y,2,rh);px(c,"rgba(255,255,255,.3)",X-2,Y,W+4,2);px(c,"#1A1A2E",X-2,Y+rh,W+4,1);px(c,"#1A1A2E",X-2,Y,1,rh);px(c,"#1A1A2E",X+W+1,Y,1,rh);
  if(b.awning)for(let i=0;i<W;i+=8){px(c,b.awning,X+i,Y+rh,4,6);px(c,"#FFFFFF",X+i+4,Y+rh,4,6)}
  const dx=b.door[0]*TS,dy=b.door[1]*TS;
  for(let wx=X+4;wx<X+W-10;wx+=15){if(Math.abs(wx-dx)<13)continue;const wy=Y+rh+(b.awning?8:4);if(wy+10>Y+H-3)continue;px(c,"#1A1A2E",wx,wy,10,10);px(c,"#8FD3FF",wx+1,wy+1,8,8);px(c,"#FFFFFF",wx+2,wy+2,2,3);px(c,"#1A1A2E",wx+5,wy+1,1,8)}
  px(c,"#1A1A2E",dx+3,dy+2,10,14);px(c,"#9C5B2E",dx+4,dy+3,8,13);px(c,"#FFC93C",dx+10,dy+9,1,2);
  if(b.sign){c.font="bold 7px 'Be Vietnam Pro',sans-serif";const tw=Math.ceil(c.measureText(b.sign).width)+8;const sx=Math.round(X+W/2-tw/2),sy=Y+3;
    px(c,"#1A1A2E",sx-1,sy-1,tw+2,12);px(c,"#FFF8E7",sx,sy,tw,10);c.fillStyle="#B71C1C";c.textBaseline="middle";c.fillText(b.sign,sx+4,sy+5.5)}
  // cờ phướn trước nhà mặt hẻm
  if(b.y+b.h===11||b.y===15){const fx=X+2,fy=Y+rh-2;px(c,"#7A7A7A",fx,fy,1,12);px(c,"#1E6FE0",fx+1,fy,4,9);px(c,"#FFFFFF",fx+1,fy+3,4,1);px(c,"#2E9E44",fx+1,fy+6,4,1)}
}
function drawDeco(c,d){
  const X=d.x*TS,Y=d.y*TS;
  if(d.t==="table"||d.t==="table2"){px(c,"#8D5A34",X+1,Y+8,14,3);px(c,"#1A1A2E",X+1,Y+11,14,1);px(c,"#6D4426",X+3,Y+11,2,5);px(c,"#6D4426",X+11,Y+11,2,5);
    if(d.t==="table"){px(c,"#555",X+15,Y-14,2,22);c.fillStyle="#E53935";c.beginPath();c.moveTo(X+16,Y-22);c.lineTo(X-6,Y-10);c.lineTo(X+38,Y-10);c.closePath();c.fill();px(c,"#FFFFFF",X+6,Y-12,4,2);px(c,"#FFFFFF",X+22,Y-12,4,2)}
    else{px(c,"#1A1A2E",X+3,Y-6,11,13);px(c,"#FFFFFF",X+4,Y-5,9,11);for(let i=0;i<9;i++)for(let j=0;j<9;j++)if(hash(i,j*3)>.5)px(c,"#1A1A2E",X+4+i,Y-4+j,1,1);px(c,"#1A1A2E",X+4,Y-4,3,3);px(c,"#1A1A2E",X+10,Y-4,3,3);px(c,"#1A1A2E",X+4,Y+2,3,3)}}
  if(d.t==="cafe"){c.fillStyle="#1A1A2E";c.beginPath();c.arc(X+8,Y+9,6,0,7);c.fill();c.fillStyle="#2E7D32";c.beginPath();c.arc(X+8,Y+9,5,0,7);c.fill();px(c,"#FFFFFF",X+6,Y+6,3,3);px(c,"#6D4426",X+7,Y+13,2,3)}
  if(d.t==="pole"){px(c,"#1A1A2E",X+6,Y-10,4,26);px(c,"#B0B6C2",X+7,Y-10,2,25)}
  if(d.t==="exit"){px(c,"#1A1A2E",X+7,Y+4,2,12);px(c,"#1A1A2E",X-2,Y-6,20,12);px(c,"#1E6FE0",X-1,Y-5,18,10);c.fillStyle="#fff";c.font="bold 6px 'Be Vietnam Pro',sans-serif";c.textBaseline="middle";c.fillText("PHƯỜNG ➜",X,Y)}
}
let mapImg=null;
function renderMap(){
  mapImg=document.createElement("canvas");mapImg.width=MW*TS;mapImg.height=MH*TS;const c=mapImg.getContext("2d");
  for(let y=0;y<MH;y++)for(let x=0;x<MW;x++)LV.tile(c,at(x,y),x,y);
  LV.buildings.forEach(b=>drawBuilding(c,b));
  LV.decos.forEach(d=>LV.deco(c,d));
  if(LV.paint)LV.paint(c);
}
/* phần treo phía trên (băng rôn, dây cờ) vẽ đè lên nhân vật */
function overhead1(cx,cy){
  const ban=(x1,x2,y,txt)=>{const X=x1*TS+8-cx,W=(x2-x1)*TS,Y=y-cy;if(X>VW*TS||X+W<0||Y<-30||Y>VH*TS)return;
    px(ctx,"#5D4037",X-8,Y-6,8,1);px(ctx,"#5D4037",X+W,Y-6,8,1);px(ctx,"#5D4037",X-1,Y-6,1,6);px(ctx,"#5D4037",X+W,Y-6,1,6);
    px(ctx,"#1A1A2E",X-1,Y-1,W+2,14);px(ctx,"#C8102E",X,Y,W,12);for(let i=0;i<W;i+=10)px(ctx,"rgba(0,0,0,.12)",X+i+5,Y+1,1,10);px(ctx,"#EEE",X+2,Y+2,2,2);px(ctx,"#EEE",X+W-4,Y+2,2,2);px(ctx,"#FFD23F",X,Y,W,1);px(ctx,"#FFD23F",X,Y+11,W,1);
    ctx.fillStyle="#FFE27A";ctx.font="bold 7px 'Be Vietnam Pro',sans-serif";ctx.textBaseline="middle";ctx.textAlign="center";ctx.fillText(txt,X+W/2,Y+6.5,W-6);ctx.textAlign="left"};
  ban(12,23,11*TS-12,"NHIỆT LIỆT CHÀO MỪNG NGÀY CHUYỂN ĐỔI SỐ QUỐC GIA 10/10");
  ban(26,34,14*TS-18,"MỖI NGƯỜI DÂN MỘT KỸ NĂNG SỐ");
  const bunting=(x1,x2,y)=>{const cols=["#E53935","#FFD23F","#1E6FE0","#2E9E44"];const Y=y*TS-cy;if(Y<-10||Y>VH*TS)return;
    for(let x=x1*TS-cx,i=0;x<x2*TS-cx;x+=6,i++){const sag=Math.sin((x-(x1*TS-cx))/((x2-x1)*TS)*Math.PI)*4;px(ctx,"#555",x,Y+sag,6,1);ctx.fillStyle=cols[i%4];ctx.beginPath();ctx.moveTo(x,Y+sag+1);ctx.lineTo(x+5,Y+sag+1);ctx.lineTo(x+2.5,Y+sag+6);ctx.closePath();ctx.fill()}};
  [4,9,17,22].forEach(y=>{bunting(10,12,y);bunting(24,26,y)});
}

/* ===== NHÂN VẬT 8-BIT ===== */
const HEAD={
 0:["................",".....KKKKKK.....","....KHHHHHHK....","...KHHHHHHHHK...","...KHSSSSSSHK...","...KSSESSESSK...","...KSSSSSSSSK...","....KSSMMSSK...."],
 3:["................",".....KKKKKK.....","....KHHHHHHK....","...KHHHHHHHHK...","...KHHHHHHHHK...","...KHHHHHHHHK...","...KHHHHHHHHK...","....KHHHHHHK...."],
 2:["................",".....KKKKK......","....KHHHHHK.....","...KHHHHHHHK....","...KHHHHSSSK....","...KHHHSSESK....","...KHHSSSSSK....","....KKSSSSK....."]
};
const BODY={
 0:["...KDCCCCCCDK...","..KSKCCCCCCKSK..","..KSKCCCCCCKSK..","...KKCCCCCCKK..."],
 3:["...KDCCCCCCDK...","..KSKCCCCCCKSK..","..KSKCCCCCCKSK..","...KKCCCCCCKK..."],
 2:["....KDCCCCK.....","....KCCSCCK.....","....KCCSCCK.....","....KCCCCCK....."]
};
const LEGS={
 0:[["....KPPPPPPK....","....KPPKKPPK....","....KBBKKBBK....","................"],["....KPPPPPPK....","....KPPKKPPK....","....KBBK.KPK....",".........KBK...."],["....KPPPPPPK....","....KPPKKPPK....","....KPK.KBBK....","....KBK........."]],
 2:[["....KPPPPPK.....","....KPPKPPK.....","....KBBKBBK.....","................"],["....KPPPPPK.....","...KPPK.KPPK....","...KBBK.KBBK....","................"],["....KPPPPPK.....","....KPPPPK......","....KBBBBK......","................"]]
};
const spriteCache={};
function sprite(pal,dir,frame,sad){
  const key=pal.id+dir+frame+(sad?"s":"");if(spriteCache[key])return spriteCache[key];
  const d=dir===1?2:dir, rows=HEAD[d].concat(BODY[d],LEGS[d===3?0:d][frame]);
  const cv=document.createElement("canvas");cv.width=16;cv.height=16;const c=cv.getContext("2d");
  const col={H:pal.H,S:pal.S||"#F8C89A",C:pal.C,D:pal.D||pal.C,P:pal.P||"#2C3E66",B:pal.B||"#4E342E",K:"#11111F",E:"#11111F",M:sad?"#11111F":"#E8806A"};
  rows.forEach((r,y)=>{for(let x=0;x<16;x++){const ch=r[dir===1?15-x:x];if(ch!=="."&&col[ch]){c.fillStyle=col[ch];c.fillRect(x,y,1,1)}}});
  if(pal.hat){c.fillStyle=pal.hat;c.fillRect(4,1,8,2);c.fillRect(3,3,10,1)}
  if(pal.vest&&dir!==3){c.fillStyle=pal.vest;c.fillRect(5,8,1,3);c.fillRect(10,8,1,3)}
  if(sad&&dir===0){c.fillStyle="#5DADEC";c.fillRect(5,6,1,2)}
  return spriteCache[key]=cv;
}
const PAL={
 me:{id:"me",H:"#3B2A20",C:"#FF5A4E",D:"#D13E33"},
 cns:{id:"cns",H:"#141414",C:"#1E88E5",D:"#1565C0",P:"#1B2A49",vest:"#FFD23F"},
 cuba:{id:"cuba",H:"#D6D6D6",C:"#AB47BC",D:"#8E24AA",P:"#212121"},
 taphoa:{id:"taphoa",H:"#2B2B2B",C:"#FF9800",D:"#EF6C00",P:"#3E2723"},
 cohx:{id:"cohx",H:"#2B1B14",C:"#EC407A",D:"#C2185B",P:"#37474F"},
 bem:{id:"bem",H:"#3A2A1A",C:"#FFEB3B",D:"#FBC02D",P:"#1976D2"},
 banh:{id:"banh",H:"#1B1B1B",C:"#26C6DA",D:"#0097A7",P:"#455A64"},
 cafe:{id:"cafe",H:"#333",C:"#795548",D:"#5D4037",P:"#263238"},
 xeom:{id:"xeom",H:"#333",C:"#43A047",D:"#2E7D32",P:"#3E2723",hat:"#2E7D32"},
 ship:{id:"ship",H:"#222",C:"#FF7043",D:"#E64A19",P:"#263238",hat:"#FF7043"},
 ongcu:{id:"ongcu",H:"#E0E0E0",C:"#F5F5F5",D:"#CFCFCF",P:"#5D4037"},
 bacu:{id:"bacu",H:"#CFCFCF",C:"#7E57C2",D:"#5E35B1",P:"#212121"},
 chuA:{id:"chuA",H:"#444",C:"#5C6BC0",D:"#3949AB",P:"#263238"},
 chuB:{id:"chuB",H:"#222",C:"#8D6E63",D:"#6D4C41",P:"#3E2723"},
 rau:{id:"rau",H:"#2B1B14",C:"#66BB6A",D:"#43A047",P:"#37474F",hat:"#F4D03F"},
 khach:{id:"khach",H:"#111",C:"#29B6F6",D:"#0288D1",P:"#283593"},
 ong2:{id:"ong2",H:"#BDBDBD",C:"#A1887F",D:"#8D6E63",P:"#424242"},
 cho:{id:"cho",H:"#2B1B14",C:"#F06292",D:"#E91E63",P:"#37474F"},
 dv:{id:"dv",H:"#141414",C:"#1E88E5",D:"#1565C0",P:"#1B2A49"},
 hs:{id:"hs",H:"#222",C:"#FFFFFF",D:"#E0E0E0",P:"#1A237E"},
 chay:{id:"chay",H:"#777",C:"#FF5252",D:"#D32F2F",P:"#212121"},
 la:{id:"la",H:"#0D0D0D",C:"#2B2B2B",D:"#1A1A1A",P:"#111",S:"#E6B88A"}
};
/* kind: intro | quiz | hong | idle */
const NPCDEF=[
 {id:"cns1",pal:"cns",name:"Thành viên Tổ công nghệ số cộng đồng",x:5,y:12,dir:1,kind:"intro"},
 {id:"cuba",name:"Cụ bà hàng xóm",x:7,y:14,dir:3,kind:"quiz",lead:"Cháu ơi, bà hỏi chút nha:",thanks:"Cảm ơn cháu, bà nhớ rồi!"},
 {id:"taphoa",name:"Chủ tiệm tạp hóa",x:3,y:14,dir:3,kind:"quiz",lead:"Con ơi, chú hỏi cái này:",thanks:"Cảm ơn con, ghé tiệm chú hoài nha!"},
 {id:"cohx",name:"Cô hàng xóm",x:7,y:11,dir:0,kind:"quiz",lead:"Ê con, cô đang thắc mắc nè:",thanks:"Hay quá, để cô kể lại cho mấy bà trong xóm!"},
 {id:"bem",name:"Em bé trong xóm",x:12,y:21,dir:2,kind:"quiz",lead:"Anh chị ơi, em đố nè:",thanks:"Hihi, anh chị giỏi ghê!"},
 {id:"banh",name:"Chị bán bánh online",x:23,y:18,dir:1,kind:"quiz",lead:"Em ơi, chị hỏi xíu:",thanks:"Cảm ơn em nha, bánh chị ngon lắm đó!"},
 {id:"cns2",pal:"cns",name:"Thành viên Tổ công nghệ số cộng đồng",x:17,y:8,dir:0,kind:"quiz",lead:"Bạn ơi, thử thách nhỏ của Tổ công nghệ số nè:",thanks:"Bạn nắm chắc ghê!"},
 {id:"cns3",pal:"cns",name:"Thành viên Tổ công nghệ số cộng đồng",x:21,y:7,dir:0,kind:"quiz",lead:"Câu này nhiều người hay nhầm lắm:",thanks:"Cảm ơn bạn đã ghé bàn hỗ trợ!"},
 {id:"cafe",name:"Chú chủ quán cà phê",x:28,y:11,dir:0,kind:"quiz",lead:"Ngồi uống ly cà phê, chú hỏi nè:",thanks:"Lần sau ghé, chú mời ly cà phê!"},
 {id:"xeom",name:"Bác xe ôm đầu hẻm",x:32,y:13,dir:1,kind:"quiz",lead:"Chờ khách buồn quá, bác hỏi con:",thanks:"Con lên phường vui vẻ nha!"},
 {id:"ship",name:"Anh shipper",x:25,y:20,dir:1,kind:"quiz",lead:"Anh giao hàng cả ngày, gặp chuyện này nè:",thanks:"Cảm ơn em, anh chạy đơn tiếp đây!"},
 {id:"cns4",pal:"cns",name:"Thành viên Tổ công nghệ số cộng đồng",x:14,y:9,dir:2,kind:"hong",pair:"h1"},
 {id:"ongcu",name:"Cụ ông",x:15,y:9,dir:1,kind:"hong",pair:"h1"},
 {id:"bacu",name:"Bà cụ ngồi hóng mát",x:8,y:19,dir:2,kind:"hong",pair:"h2"},
 {id:"cohx2",pal:"cohx",name:"Cô hàng xóm",x:9,y:19,dir:1,kind:"hong",pair:"h2"},
 {id:"chuA",name:"Chú khách quán cà phê",x:31,y:11,dir:2,kind:"hong",pair:"h3"},
 {id:"chuB",name:"Chú khách quán cà phê",x:32,y:11,dir:1,kind:"hong",pair:"h3"},
 {id:"rau",name:"Cô bán rau",x:1,y:14,dir:2,kind:"hong",pair:"h4"},
 {id:"khach",name:"Khách quen tiệm tạp hóa",x:2,y:14,dir:1,kind:"hong",pair:"h4"},
 {id:"ong2",name:"Ông cụ tưới cây",x:20,y:24,dir:3,kind:"idle",line:"Ông mới học trên nền tảng Bình dân học vụ số đó, miễn phí mà dễ hiểu lắm con."},
 {id:"cho",name:"Chị đi chợ",x:12,y:17,dir:2,kind:"idle",line:"Chị toàn trả tiền bằng mã QR, có lịch sử giao dịch, khỏi lo tiền giả. Mà nhớ nhìn tên người nhận nha!"},
 {id:"dv",name:"Bạn đoàn viên",x:20,y:10,dir:0,kind:"idle",line:"Bà con cần cài VNeID, nộp hồ sơ trực tuyến thì ra bàn hỗ trợ ở sân Nhà văn hóa nha!"},
 {id:"hs",name:"Cậu học sinh",x:4,y:6,dir:0,kind:"idle",line:"Năm sau em lên lớp 6, mẹ em đăng ký tuyển sinh trực tuyến trên cổng tuyển sinh đầu cấp đó!"},
 {id:"chay",name:"Bác chạy bộ",x:29,y:6,dir:1,kind:"idle",line:"Đèn đường hư, ổ gà… bác phản ánh qua ứng dụng Công dân số TP.HCM, nhanh lắm!"}
];
const HONG={
 h1:{title:"bàn hỗ trợ của Tổ công nghệ số",lines:[["cns4","Bác cài VNeID thì chỉ tải trên CH Play hoặc App Store thôi nha."],["ongcu","Hôm bữa có người gửi link bảo cài bản mới, may bác chưa bấm."],["cns4","Đúng rồi bác. Mật khẩu, mã OTP cũng không đưa ai, kể cả người xưng cán bộ."],["ongcu","Ờ, để bác dặn mấy đứa nhỏ trong nhà luôn."]]},
 h2:{title:"chuyện nhà cụ bà",lines:[["bacu","Hôm qua có đứa gọi xưng Công an, bảo bà liên quan vụ án, phải chuyển tiền."],["cohx2","Trời, Công an không làm việc qua điện thoại hay bắt chuyển tiền đâu bà."],["bacu","Bà cúp máy liền, rồi ra Công an phường hỏi cho chắc."],["cohx2","Gặp chuyện vậy cứ ra Công an phường trình báo. Cần phản ánh gì với Thành phố thì gọi tổng đài 1022 nha bà."]]},
 h3:{title:"chuyện quán cà phê",lines:[["chuA","Ông thấy tin trên mạng nói mai cúp điện cả phường chưa?"],["chuB","Thấy, mà chưa trang chính thức nào đăng. Tôi không chia sẻ đâu."],["chuA","Ừ, Luật An ninh mạng mới cấm phát tán tin sai sự thật gây hoang mang mà."],["chuB","Muốn biết thì xem trang của phường, của điện lực cho chắc."]]},
 h4:{title:"chuyện ở tiệm tạp hóa",lines:[["khach","Quét mã QR này trả tiền hả cô?"],["rau","Ừ, quét xong nhớ nhìn tên người nhận nha, có tiệm bị dán đè mã QR giả đó."],["khach","Vậy hả, để con coi kỹ."],["rau","Tiệm thấy báo tiền vào rồi mới giao hàng, hai bên đều yên tâm."]]}
};
const L1={id:1,MW:36,MH:26,build:buildMap,buildings:BUILDINGS,decos:DECOS,
 tile:(c,t,x,y)=>drawTile(c,(t===BLD||t===DECO)?((x>=12&&x<=23&&y>=6&&y<=11)?PAVE:G):t,x,y),
 deco:drawDeco,overhead:overhead1,npcDef:NPCDEF,start:{x:3,y:11,dir:0},
 solidT:new Set([TREE,BLD,FENCE,BUSH,POT,DECO])};
