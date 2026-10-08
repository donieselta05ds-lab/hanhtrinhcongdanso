/* Cấu hình chung: link bảng xếp hạng và các hàm tiện ích nhỏ */
/* ===== CẤU HÌNH BẢNG XẾP HẠNG =====
   Dán đường link Web App của Google Apps Script vào giữa hai dấu nháy.
   Để trống thì bảng xếp hạng chỉ lưu trên máy của người chơi. */
const LB_URL="https://script.google.com/macros/s/AKfycbzzQ48KrsKBHsG0lnqeeIYCaonkJLd4d4OwL8dFuGMiUl_DpYxfQ2-xaEqwzyhj1H26XQ/exec";

const $=id=>document.getElementById(id);
const esc=s=>String(s).replace(/[&<>"]/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c]));
const shuffle=a=>{for(let i=a.length-1;i>0;i--){const j=Math.random()*(i+1)|0;[a[i],a[j]]=[a[j],a[i]]}return a};
const sleep=ms=>new Promise(r=>setTimeout(r,ms));
const store={get(k,d){try{const v=localStorage.getItem(k);return v==null?d:JSON.parse(v)}catch(e){return d}},set(k,v){try{localStorage.setItem(k,JSON.stringify(v))}catch(e){}}};
