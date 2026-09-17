// ================= ۱) تبدیل شمسی <-> میلادی (اصلاح‌شده) =================
function div(a,b){return Math.trunc(a/b)}
function mod(a,b){return a-Math.trunc(a/b)*b}
function jalCal(jy){
  const breaks=[-61,9,38,199,426,686,756,818,1111,1181,1210,1635,2060,2097,2192,2262,2324,2394,2456,3178];
  const bl=breaks.length; let gy=jy+621, leapJ=-14, jp=breaks[0], jm, jump;
  if(jy<jp||jy>=breaks[bl-1]) throw new Error('سال خارج از محدوده');
  for(let i=1;i<bl;i++){ jm=breaks[i]; jump=jm-jp;
    if(jy<jm) break; leapJ+=div(jump,33)*8+div(mod(jump,33),4); jp=jm; }
  let n=jy-jp;
  leapJ+=div(n,33)*8+div(mod(n,33)+3,4);
  if(mod(jump,33)===4&&jump-n===4) leapJ+=1;
  const leapG=div(gy,4)-div((div(gy,100)+1)*3,4)-150;
  const march=20+leapJ-leapG;
  if(jump-n<6) n=n-jump+div(jump+4,33)*33;
  let leap=mod(mod(n+1,33)-1,4); if(leap===-1) leap=4;
  return {leap, gy, march};
}
function j2d(jy,jm,jd){ const r=jalCal(jy); return g2d(r.gy,3,r.march)+(jm-1)*31-div(jm,7)*(jm-7)+jd-1; }
function d2g(jdn){
  let j=4*jdn+139361631; j=j+div(div(4*jdn+183187720,146097)*3,4)*4-3908;
  const i=div(mod(j,1461),4)*5+308;
  const gm=mod(div(i,153),12)+1;
  const gd=div(mod(i,153),5)+1;
  const gy=div(j,1461)-100100+div(8-gm,6);
  return {gy,gm,gd};
}
function g2d(gy,gm,gd){
  let d=div((gy+div(gm-8,6)+100100)*1461,4)+div(153*mod(gm+9,12)+2,5)+gd-34840408;
  d=d-div(div(gy+100100+div(gm-8,6),100)*3,4)+752; return d;
}
function d2j(jdn){
  const gy=d2g(jdn).gy; let jy=gy-621; const r=jalCal(jy);
  const jdn1f=g2d(gy,3,r.march); let jd, jm, k=jdn-jdn1f;
  if(k>=0){ if(k<=185){ jm=1+div(k,31); jd=mod(k,31)+1; return {jy,jm,jd}; } else k-=186; }
  else { jy-=1; k+=179; if(r.leap===1) k+=1; }
  jm=7+div(k,30); jd=mod(k,30)+1; return {jy,jm,jd};
}
function toJalaali(gy,gm,gd){ return d2j(g2d(gy,gm,gd)); }
function toGregorian(jy,jm,jd){ return d2g(j2d(jy,jm,jd)); }
function jMonthLength(jy,jm){
  if(jm<=6) return 31; if(jm<=11) return 30;
  return jalCal(jy).leap===0?30:29;
}
const J_MONTHS=['فروردین','اردیبهشت','خرداد','تیر','مرداد','شهریور','مهر','آبان','آذر','دی','بهمن','اسفند'];
const FA_DIGITS='۰۱۲۳۴۵۶۷۸۹';
const faNum=n=>String(n).replace(/[0-9]/g,d=>FA_DIGITS[d]);
const faDate=j=>`${faNum(j.jd)} ${J_MONTHS[j.jm-1]} ${faNum(j.jy)}`;

// ================= ۲) وضعیت هوا =================
const WMO_FA={
  0:['صاف و آفتابی','☀️'],1:['کم و بیش صاف','🌤️'],2:['نیمه‌ابری','⛅'],3:['ابری','☁️'],
  45:['مه‌آلود','🌫️'],48:['مه یخ‌زده','🌫️'],
  51:['نم‌نم باران','🌦️'],53:['نم‌نم باران','🌦️'],55:['نم‌نم شدید','🌧️'],
  56:['نم‌نم یخ‌زده','🌧️'],57:['نم‌نم یخ‌زده','🌧️'],
  61:['باران خفیف','🌧️'],63:['باران','🌧️'],65:['باران شدید','⛈️'],
  66:['باران یخ‌زده','🌧️'],67:['باران یخ‌زده','🌧️'],
  71:['برف خفیف','🌨️'],73:['برف','❄️'],75:['برف سنگین','❄️'],77:['دانه‌های برف','❄️'],
  80:['رگبار خفیف','🌦️'],81:['رگبار','🌧️'],82:['رگبار شدید','⛈️'],
  85:['برف و باران','🌨️'],86:['برف و باران','🌨️'],
  95:['رعد و برق','⛈️'],96:['رعد و برق با تگرگ','⛈️'],99:['رعد و برق با تگرگ','⛈️']
};
const wmo=c=>WMO_FA[c]||['نامشخص','🌡️'];
const COMPASS=['شمالی','شمال‌شرقی','شرقی','جنوب‌شرقی','جنوبی','جنوب‌غربی','غربی','شمال‌غربی'];
const compass=d=>COMPASS[Math.round(((d%360)+360)%360/45)%8];

// ================= ۳) مناسبت‌ها و تعطیلات =================
const FIXED={
 '1-1':{t:'جشن نوروز',off:1},'1-2':{t:'نوروز',off:1},'1-3':{t:'نوروز',off:1},'1-4':{t:'نوروز',off:1},
 '1-12':{t:'روز جمهوری اسلامی ایران',off:1},'1-13':{t:'روز طبیعت',off:1},
 '1-29':{t:'روز ارتش',off:0},
 '2-1':{t:'روز بزرگداشت سعدی',off:0},'2-10':{t:'روز ملی خلیج فارس',off:0},'2-12':{t:'روز معلم',off:0},
 '2-25':{t:'روز بزرگداشت فردوسی',off:0},'2-28':{t:'روز بزرگداشت خیام',off:0},
 '3-14':{t:'رحلت حضرت امام خمینی',off:1,mourn:1},'3-15':{t:'قیام خونین ۱۵ خرداد',off:1,mourn:1},
 '4-7':{t:'شهادت دکتر بهشتی و روز قوه قضاییه',off:0,mourn:1},
 '5-17':{t:'روز خبرنگار',off:0},
 '6-8':{t:'شهادت رجایی و باهنر',off:0,mourn:1},'6-17':{t:'قیام ۱۷ شهریور',off:0},'6-31':{t:'آغاز هفته دفاع مقدس',off:0},
 '7-20':{t:'روز بزرگداشت حافظ',off:0},
 '8-13':{t:'روز دانش‌آموز',off:0},
 '9-5':{t:'روز بسیج مستضعفان',off:0},'9-7':{t:'روز نیروی دریایی',off:0},'9-10':{t:'روز مجلس',off:0},'9-12':{t:'تصویب قانون اساسی',off:0},
 '9-16':{t:'روز دانشجو',off:0},'9-30':{t:'شب یلدا',off:0},
 '10-4':{t:'میلاد حضرت مسیح (ع)',off:0},'10-5':{t:'سالروز زلزله بم',off:0,mourn:1},
 '11-12':{t:'بازگشت امام خمینی به میهن',off:0},'11-19':{t:'روز نیروی هوایی',off:0},
 '11-22':{t:'پیروزی انقلاب اسلامی',off:1},
 '12-15':{t:'روز درختکاری',off:0},'12-29':{t:'روز ملی شدن صنعت نفت',off:1},
};
const ISLAMIC_OCC={
 '1-9':{t:'تاسوعای حسینی',off:1,mourn:1},'1-10':{t:'عاشورای حسینی',off:1,mourn:1},
 '2-20':{t:'اربعین حسینی',off:1,mourn:1},'2-28':{t:'رحلت پیامبر اکرم (ص) و شهادت امام حسن (ع)',off:1,mourn:1},
 '3-8':{t:'شهادت امام حسن عسکری (ع)',off:0,mourn:1},
 '3-12':{t:'میلاد پیامبر اکرم (ص) به روایت اهل سنت',off:0},
 '3-17':{t:'میلاد پیامبر اکرم (ص) و امام جعفر صادق (ع)',off:1},
 '6-3':{t:'شهادت حضرت فاطمه زهرا (س)',off:1,mourn:1},
 '6-20':{t:'ولادت حضرت فاطمه زهرا (س) و روز زن و مادر',off:0},
 '7-1':{t:'میلاد امام محمد باقر (ع)',off:0},
 '7-3':{t:'شهادت امام علی النقی (ع)',off:0,mourn:1},
 '7-10':{t:'میلاد امام محمد تقی (ع)',off:0},
 '7-13':{t:'میلاد امیرالمؤمنین علی (ع) و روز پدر',off:1},'7-27':{t:'مبعث پیامبر اکرم (ص)',off:1},
 '7-15':{t:'وفات حضرت زینب (س)',off:0,mourn:1},
 '7-25':{t:'شهادت امام موسی کاظم (ع)',off:0,mourn:1},
 '8-3':{t:'میلاد امام حسین (ع)',off:0},'8-4':{t:'میلاد حضرت ابوالفضل (ع)',off:0},
 '8-15':{t:'میلاد حضرت مهدی (عج) و جشن نیمه شعبان',off:1},
 '9-10':{t:'وفات حضرت خدیجه (س)',off:0,mourn:1},
 '9-15':{t:'میلاد امام حسن مجتبی (ع)',off:0},'9-19':{t:'شب قدر و ضربت خوردن امام علی (ع)',off:0,mourn:1},
 '9-21':{t:'شهادت امیرالمؤمنین علی (ع)',off:1,mourn:1},'9-23':{t:'شب قدر',off:0,mourn:1},
 '10-1':{t:'عید سعید فطر',off:1},'10-25':{t:'شهادت امام جعفر صادق (ع)',off:0,mourn:1},
 '11-1':{t:'میلاد حضرت معصومه (س) و روز دختر',off:0},'11-11':{t:'میلاد امام رضا (ع)',off:0},
 '12-7':{t:'شهادت امام محمد باقر (ع)',off:0,mourn:1},'12-9':{t:'روز عرفه',off:0},
 '12-10':{t:'عید سعید قربان',off:1},'12-18':{t:'عید سعید غدیر خم',off:1},
};
// مناسبت‌های قمری تأییدشده با تقویم رسمی ایران (منبع: همشهری/تقویم رسمی کشور)
// برای سایر سال‌ها، محاسبه خودکار ام‌القری در ادامه انجام می‌شود
const OFFICIAL={
 1404:{
  '1-1':[],
  '1-2':[{t:'شهادت امیرالمؤمنین علی (ع)',off:1,mourn:1}],
  '1-10':[],
  '1-11':[{t:'عید سعید فطر',off:1}],
  '1-12':[{t:'عید سعید فطر (روز دوم)',off:1}],
  '2-4':[{t:'شهادت امام جعفر صادق (ع)',off:1,mourn:1}],
  '3-16':[{t:'عید سعید قربان',off:1}],
  '3-24':[{t:'عید سعید غدیر خم',off:1}],
  '4-13':[],
  '4-14':[{t:'تاسوعای حسینی',off:1,mourn:1}],
  '4-15':[{t:'عاشورای حسینی',off:1,mourn:1}],
  '5-23':[{t:'اربعین حسینی',off:1,mourn:1}],
  '5-31':[{t:'رحلت پیامبر اکرم (ص) و شهادت امام حسن (ع)',off:1,mourn:1}],
  '6-1':[],
  '6-2':[{t:'شهادت امام رضا (ع)',off:1,mourn:1}],
  '6-3':[{t:'هجرت پیامبر اکرم (ص) از مکه به مدینه',off:0}],
  '6-9':[],
  '6-10':[{t:'شهادت امام حسن عسکری (ع)',off:1,mourn:1}],
  '6-14':[{t:'میلاد پیامبر اکرم (ص) به روایت اهل سنت',off:0}],
  '6-18':[],
  '6-19':[{t:'میلاد پیامبر اکرم (ص) و امام جعفر صادق (ع)',off:1}],
  '9-3':[{t:'شهادت حضرت فاطمه زهرا (س)',off:1,mourn:1}],
  '9-19':[],
  '9-20':[{t:'ولادت حضرت فاطمه زهرا (س) و روز زن و مادر',off:0}],
  '10-1':[{t:'میلاد امام محمد باقر (ع)',off:0}],
  '10-3':[{t:'شهادت امام علی النقی (ع)',off:0,mourn:1}],
  '10-12':[],
  '10-13':[{t:'میلاد امیرالمؤمنین علی (ع) و روز پدر',off:1},{t:'شهادت حاج قاسم سلیمانی',off:0,mourn:1}],
  '10-24':[],
  '10-25':[{t:'شهادت امام موسی کاظم (ع)',off:1,mourn:1}],
  '10-26':[],
  '10-27':[{t:'مبعث پیامبر اکرم (ص)',off:1}],
  '11-14':[],
  '11-15':[{t:'میلاد حضرت مهدی (عج) و جشن نیمه شعبان',off:1}],
  '12-9':[{t:'وفات حضرت خدیجه (س)',off:0,mourn:1}],
  '12-14':[{t:'میلاد امام حسن مجتبی (ع)',off:0}],
  '12-18':[{t:'شب قدر و ضربت خوردن امام علی (ع)',off:0,mourn:1}],
  '12-19':[],
  '12-20':[{t:'شهادت امیرالمؤمنین علی (ع)',off:1,mourn:1}],
  '12-22':[{t:'شب قدر',off:0,mourn:1}],
  '12-29':[],
 },
 1405:{
  '1-1':[{t:'عید سعید فطر',off:1}],
  '3-6':[{t:'عید سعید قربان',off:1}],
  '3-11':[{t:'میلاد امام علی النقی (ع)',off:0}],
  '3-14':[{t:'عید سعید غدیر خم',off:1}],
  '3-16':[{t:'میلاد امام موسی کاظم (ع)',off:0}],
  '5-12':[],
  '5-13':[{t:'اربعین حسینی',off:1,mourn:1}],
  '5-20':[],
  '5-21':[{t:'رحلت پیامبر اکرم (ص) و شهادت امام حسن (ع)',off:1,mourn:1}],
  '5-22':[{t:'شهادت امام رضا (ع)',off:1,mourn:1}],
  '5-23':[{t:'هجرت پیامبر اکرم از مکه به مدینه',off:0}],
  '5-30':[{t:'شهادت امام حسن عسکری (ع)',off:1,mourn:1}],
  '6-3':[{t:'میلاد پیامبر اکرم (ص) به روایت اهل سنت',off:0}],
  '6-8':[{t:'میلاد پیامبر اکرم (ص) و امام جعفر صادق (ع)',off:1}],
  '8-22':[{t:'شهادت حضرت فاطمه زهرا (س)',off:1,mourn:1}],
  '9-9':[{t:'ولادت حضرت فاطمه زهرا (س) و روز زن و مادر',off:0}],
  '9-19':[],
  '9-20':[{t:'میلاد امام محمد باقر (ع)',off:0}],
  '9-21':[],
  '9-22':[{t:'شهادت امام علی النقی (ع)',off:0,mourn:1}],
  '9-28':[],
  '9-29':[{t:'میلاد امام محمد تقی (ع)',off:0}],
  '10-1':[],
  '10-2':[{t:'میلاد امیرالمؤمنین علی (ع) و روز پدر',off:1}],
  '10-3':[],
  '10-4':[{t:'وفات حضرت زینب (س)',off:0,mourn:1}],
  '10-14':[{t:'شهادت امام موسی کاظم (ع)',off:0,mourn:1}],
  '10-15':[],
  '10-16':[{t:'مبعث پیامبر اکرم (ص)',off:1}],
 },
};
let islamicFmt=null;
try{ islamicFmt=new Intl.DateTimeFormat('en-u-ca-islamic-umalqura',{day:'numeric',month:'numeric',year:'numeric'}); }catch(e){}
const islamicCache={};
function islamicOf(g){
  const k=gStr(g);
  if(islamicCache[k]) return islamicCache[k];
  if(!islamicFmt) return null;
  try{
    const p={}; islamicFmt.formatToParts(new Date(g.gy,g.gm-1,g.gd)).forEach(x=>p[x.type]=x.value);
    const o={y:+p.year,m:+p.month,d:+p.day}; islamicCache[k]=o; return o;
  }catch(e){ return null; }
}
function nextG(g){ const d=new Date(g.gy,g.gm-1,g.gd+1); return {gy:d.getFullYear(),gm:d.getMonth()+1,gd:d.getDate()}; }
let hijriFmt=null;
try{ hijriFmt=new Intl.DateTimeFormat('fa-IR-u-ca-islamic-umalqura',{day:'numeric',month:'long',year:'numeric'}); }catch(e){}
function hijriStr(g){ if(!hijriFmt) return ''; try{ return hijriFmt.format(new Date(g.gy,g.gm-1,g.gd)); }catch(e){ return ''; } }
function dayMinutes(t){ // "HH:MM"
  const [h,m]=t.split(':').map(Number); return h*60+m;
}
function fmtHM(min){ const h=Math.floor(min/60), m=min%60; return String(h).padStart(2,'0')+':'+String(m).padStart(2,'0'); }
// خروجی: آرایه‌ای از مناسبت‌ها (شمسی ثابت + جدول رسمی + قمری خودکار)
function occasions(jy,jm,jd,g){
  const out=[];
  const f=FIXED[jm+'-'+jd]; if(f) out.push({...f,src:'شمسی'});
  const ov=(OFFICIAL[jy]||{})[jm+'-'+jd];
  if(ov){ ov.forEach(o=>out.push({...o,src:'رسمی'})); return dedupOcc(out); } // آرایه خالی = روز عادیِ تأییدشده، بدون محاسبه قمری
  const h=islamicOf(g);
  if(h){
    const v=ISLAMIC_OCC[h.m+'-'+h.d]; if(v) out.push({...v,src:'قمری'});
    if(h.m===2&&h.d>=29){ // شهادت امام رضا (آخر ماه صفر)
      const nx=islamicOf(nextG(g));
      if(nx&&nx.m!==2&&!out.some(o=>o.t.includes('امام رضا'))) out.push({t:'شهادت امام رضا (ع)',off:1,mourn:1,src:'قمری'});
    }
  }
  return dedupOcc(out);
}
function dedupOcc(arr){
  const seen=new Set();
  return arr.filter(o=>{ if(seen.has(o.t)) return false; seen.add(o.t); return true; });
}

// ================= ۴) state و ابزار =================
const DEFAULT_CITIES=[
  {name:'تهران',lat:35.6892,lon:51.3890},{name:'مشهد',lat:36.31,lon:59.57},
  {name:'اصفهان',lat:32.65,lon:51.67},{name:'شیراز',lat:29.59,lon:52.58},
  {name:'تبریز',lat:38.08,lon:46.29},{name:'رشت',lat:37.28,lon:49.58},
  {name:'اهواز',lat:31.32,lon:48.68},{name:'کرمانشاه',lat:34.31,lon:47.06},
];
let city=DEFAULT_CITIES[0];
let todayJ, viewJ, selectedG=null, forecast=null;
let climaMap=null, climaKey=null, climaLoading=false;
let favs=[]; try{ favs=JSON.parse(localStorage.getItem('fav_cities_v1')||'[]'); }catch(e){ favs=[]; }
try{
  const t=localStorage.getItem('theme_v1');
  if(t==='dark') document.documentElement.setAttribute('data-theme','dark');
  else if(t==='light') document.documentElement.removeAttribute('data-theme');
  else if(window.matchMedia&&window.matchMedia('(prefers-color-scheme: dark)').matches) document.documentElement.setAttribute('data-theme','dark');
}catch(e){}
function isDark(){ return document.documentElement.getAttribute('data-theme')==='dark'; }

const $=id=>document.getElementById(id);
const grid=$('grid'), monthTitle=$('monthTitle'), gregRange=$('gregRange');
const WD_S=['ی','د','س','چ','پ','ج','ش']; // شنبه آخر (getDay=6)

function gStr(g){return `${g.gy}-${String(g.gm).padStart(2,'0')}-${String(g.gd).padStart(2,'0')}`}
function localToday(){const n=new Date();return{gy:n.getFullYear(),gm:n.getMonth()+1,gd:n.getDate()};}
function refreshToday(){const t=localToday();todayJ=toJalaali(t.gy,t.gm,t.gd);return t;}
let toastTimer;
function toast(msg){const t=$('toast');t.textContent=msg;t.classList.remove('hidden');clearTimeout(toastTimer);toastTimer=setTimeout(()=>t.classList.add('hidden'),3000);}
function updateHash(){
  try{ history.replaceState(null,'','#c='+city.lat.toFixed(4)+','+city.lon.toFixed(4)+','+encodeURIComponent(city.name)+'&d='+gStr(selectedG)); }catch(e){}
}
function parseHash(){
  try{
    const m=location.hash.match(/c=(-?\d+\.?\d*),(-?\d+\.?\d*),([^&]*)&d=(\d{4})-(\d{2})-(\d{2})/);
    if(!m) return null;
    const y=+m[4],mo=+m[5],d=+m[6];
    if(mo<1||mo>12||d<1||d>31||y<1900||y>2100) return null;
    return {city:{name:decodeURIComponent(m[3]),lat:+m[1],lon:+m[2]},date:{gy:y,gm:mo,gd:d}};
  }catch(e){ return null; }
}

// ================= ۵) شهرها و منتخب‌ها =================
function renderChips(){
  const box=$('cityChips'); box.innerHTML='';
  DEFAULT_CITIES.forEach(c=>{
    const b=document.createElement('button');
    b.textContent=c.name;
    if(c.name===city.name&&Math.abs(c.lat-city.lat)<0.01) b.classList.add('active');
    b.onclick=()=>setCity(c);
    box.appendChild(b);
  });
}
function renderFavs(){
  const row=$('favRow'), box=$('favChips'); box.innerHTML='';
  row.classList.toggle('hidden',!favs.length);
  favs.forEach((c,i)=>{
    const s=document.createElement('span'); s.className='fav-chip';
    s.innerHTML=`<b>${c.name}</b><i title="حذف">×</i>`;
    s.querySelector('b').onclick=()=>setCity(c);
    s.querySelector('i').onclick=()=>{favs.splice(i,1);saveFavs();renderFavs();toast('از منتخب‌ها حذف شد');};
    box.appendChild(s);
  });
}
function saveFavs(){ try{localStorage.setItem('fav_cities_v1',JSON.stringify(favs));}catch(e){} }
function setCity(c){
  weatherRequest++;
  weatherController?.abort();
  weatherController=null; fetchingNow=false; weatherError=''; weatherCached=false;
  city={name:c.name,lat:+c.lat,lon:+c.lon}; forecast=null; lastFetchAt=0;
  climaMap=null; climaKey=null; climaLoading=false;
  renderChips();
  $('cityName').textContent=city.name+' 📍';
  updateHash();
  renderCalendar(); renderDetail(); renderFetchInfo();
  loadWeather(); loadClimate();
}

// ================= ۶) داده هواشناسی =================
const WX_CACHE_PREFIX='wx_v1_', WX_TTL=15*60*1000;
let lastFetchAt=0, autoTimer=null, fetchingNow=false;
let weatherController=null, weatherRequest=0, weatherError='', weatherCached=false;

function wxCacheKey(){
  return WX_CACHE_PREFIX+city.lat.toFixed(3)+','+city.lon.toFixed(3);
}
function validWeather(data){
  const d=data?.daily, h=data?.hourly;
  return !data?.error && Array.isArray(d?.time) && d.time.length>0 &&
    ['weathercode','temperature_2m_max','temperature_2m_min'].every(k=>Array.isArray(d[k])&&d[k].length===d.time.length) &&
    Array.isArray(h?.time) && ['weathercode','temperature_2m'].every(k=>Array.isArray(h[k])&&h[k].length===h.time.length);
}
function readWxCache(){
  try{
    const s=localStorage.getItem(wxCacheKey()); if(!s) return null;
    const o=JSON.parse(s);
    if(!validWeather(o?.data)||!Number.isFinite(o.at)||o.at>Date.now()||Date.now()-o.at>24*60*60*1000) return null;
    return o;
  }catch(e){ return null; }
}
function writeWxCache(){
  if(!forecast) return;
  try{ localStorage.setItem(wxCacheKey(),JSON.stringify({at:lastFetchAt||Date.now(),data:forecast})); }catch(e){}
}
function renderFetchInfo(){
  const el=$('fetchInfo'); if(!el) return;
  const button=$('refreshBtn');
  if(button){
    button.disabled=fetchingNow||!navigator.onLine;
    button.setAttribute('aria-busy',String(fetchingNow));
  }
  const stale=weatherCached||weatherError||!navigator.onLine||Date.now()-lastFetchAt>=WX_TTL;
  el.classList.toggle('stale',Boolean(stale));
  const state=fetchingNow?'در حال دریافت داده هواشناسی':!navigator.onLine?'آفلاین':weatherError?'دریافت ناموفق':weatherCached?'نسخه ذخیره‌شده':stale?'نیازمند به‌روزرسانی':'دریافت موفق';
  const received=lastFetchAt?new Date(lastFetchAt).toLocaleString('fa-IR',{month:'short',day:'numeric',hour:'2-digit',minute:'2-digit'}):'هنوز دریافتی انجام نشده';
  el.textContent=state+' — آخرین دریافت موفق: '+received+(forecast&&stale?' — داده قبلی؛ زنده نیست.':'');
}
async function loadWeather(force){
  if(fetchingNow) return;
  if(!force&&forecast){renderCalendar();renderDetail();return;}
  if(!forecast){
    const c=readWxCache();
    if(c){ forecast=c.data; lastFetchAt=c.at; weatherCached=true; renderCalendar(); renderDetail(); renderFetchInfo(); }
  }
  if(!navigator.onLine){weatherError='offline';renderFetchInfo();renderCalendar();renderDetail();return;}
  fetchingNow=true;
  weatherError='';
  renderFetchInfo();
  if(!forecast) $('nowBox').innerHTML='<div class="skeleton now"></div>';
  const token=++weatherRequest;
  const ctrl=new AbortController();
  if(weatherController) weatherController.abort();
  weatherController=ctrl;
  const timeout=setTimeout(()=>ctrl.abort(),15000);
  try{
    const url=`https://api.open-meteo.com/v1/forecast?latitude=${city.lat}&longitude=${city.lon}`+
      `&current=temperature_2m,relative_humidity_2m,weathercode,wind_speed_10m`+
      `&daily=weathercode,temperature_2m_max,temperature_2m_min,precipitation_probability_max,wind_speed_10m_max,sunrise,sunset,uv_index_max,wind_direction_10m_dominant,wind_gusts_10m_max`+
      `&hourly=temperature_2m,weathercode,precipitation_probability,relative_humidity_2m`+
      `&timezone=Asia%2FTehran&forecast_days=16&past_days=8`;
    const r=await fetch(url,{signal:ctrl.signal,cache:'no-store'});
    if(!r.ok) throw new Error('http');
    const j=await r.json();
    if(token!==weatherRequest) return;
    if(!validWeather(j)) throw new Error('api');
    clearTimeout(timeout);
    forecast=j; lastFetchAt=Date.now(); weatherError=''; weatherCached=false;
    writeWxCache();
  }catch(e){
    clearTimeout(timeout);
    if(token!==weatherRequest) return;
    weatherError='fetch';
    if(!forecast){
      const c=readWxCache();
      if(c){ forecast=c.data; lastFetchAt=c.at; weatherCached=true; }
    }
    if(!forecast) $('nowBox').innerHTML='⚠️ اتصال به سامانه هواشناسی برقرار نشد؛ تقویم و میانگین آماری همچنان نمایش داده می‌شود.';
    else if(force) toast('به‌روزرسانی ناموفق؛ داده قبلی نمایش داده می‌شود');
  }finally{ clearTimeout(timeout); }
  if(token!==weatherRequest) return;
  fetchingNow=false;
  $('refreshBtn')?.removeAttribute('aria-busy');
  $('refreshBtn')?.removeAttribute('disabled');
  renderFetchInfo();
  renderCalendar(); renderDetail();
}
function startAutoRefresh(){
  clearInterval(autoTimer);
  autoTimer=setInterval(()=>{
    if(document.hidden||!navigator.onLine||fetchingNow) return;
    if(lastFetchAt&&Date.now()-lastFetchAt<WX_TTL) return;
    loadWeather(true);
  },60*1000);
}
document.addEventListener('visibilitychange',()=>{
  if(!document.hidden&&navigator.onLine&&(!lastFetchAt||Date.now()-lastFetchAt>=WX_TTL)) loadWeather(true);
});
window.addEventListener('online',()=>{
  updateOfflineBar();
  if(!document.hidden) loadWeather(true);
});
function dailyIndex(g){
  if(!forecast||!forecast.daily) return -1;
  return forecast.daily.time.indexOf(gStr(g));
}
// برش ۱۶ روزه از امروز به بعد (ایمن در برابر داده‌های قدیمی)
function forecastSlice(){
  if(!forecast||!forecast.daily||!forecast.daily.time||!forecast.daily.time.length) return [];
  const t=gStr(localToday());
  let s=forecast.daily.time.indexOf(t);
  if(s<0) s=forecast.daily.time.length-1; // اگر امروز در داده نیست (مثلاً گذشته)، از آخرین روزها استفاده کن
  return forecast.daily.time.slice(s,s+16).map((time,i)=>{
    const k=s+i; if(k>=forecast.daily.time.length) return null;
    const g={gy:+time.slice(0,4),gm:+time.slice(5,7),gd:+time.slice(8,10)};
    const j=toJalaali(g.gy,g.gm,g.gd);
    return {time,g,j,mx:Math.round(forecast.daily.temperature_2m_max[k]),mn:Math.round(forecast.daily.temperature_2m_min[k]),
      code:forecast.daily.weathercode[k],pr:forecast.daily.precipitation_probability_max?.[k]??0,
      wind:Math.round(forecast.daily.wind_speed_10m_max?.[k]??0)};
  }).filter(Boolean);
}

// ---- میانگین آماری ۶ ساله (۲۰۱۹-۲۰۲۴) برای همه روزهای سال ----
async function loadClimate(){
  const key=city.lat.toFixed(2)+','+city.lon.toFixed(2);
  const requestCity=city;
  if(climaKey===key&&(climaMap||climaLoading)) return;
  climaKey=key; climaMap=null; climaLoading=true; renderCalendar();
  try{
    const s=localStorage.getItem('clima_'+key);
    if(s){climaMap=JSON.parse(s);climaLoading=false;renderCalendar();renderDetail();return;}
  }catch(e){}
  try{
    const url=`https://archive-api.open-meteo.com/v1/archive?latitude=${city.lat}&longitude=${city.lon}`+
      `&start_date=2019-01-01&end_date=2024-12-31`+
      `&daily=temperature_2m_max,temperature_2m_min,precipitation_sum,weathercode&timezone=Asia%2FTehran`;
    const r=await fetch(url); const j=await r.json();
    if(city!==requestCity) return;
    if(!r.ok||!j.daily) throw new Error('no daily');
    const acc={};
    j.daily.time.forEach((t,i)=>{
      const mx=j.daily.temperature_2m_max[i];
      if(mx==null) return;
      const md=t.slice(5);
      const o=acc[md]||(acc[md]={sx:0,sn:0,sp:0,n:0,codes:{}});
      o.sx+=mx; o.sn+=j.daily.temperature_2m_min[i]??mx; o.sp+=j.daily.precipitation_sum[i]||0; o.n++;
      const c=j.daily.weathercode[i]; o.codes[c]=(o.codes[c]||0)+1;
    });
    const map={};
    for(const md in acc){
      const o=acc[md];
      const top=Object.entries(o.codes).sort((a,b)=>b[1]-a[1])[0][0];
      map[md]={mx:Math.round(o.sx/o.n),mn:Math.round(o.sn/o.n),pr:+(o.sp/o.n).toFixed(1),code:Number(top)};
    }
    climaMap=map;
    try{localStorage.setItem('clima_'+key,JSON.stringify(map));}catch(e){}
  }catch(e){ if(city!==requestCity) return; climaMap=null; }
  climaLoading=false; renderCalendar(); renderDetail();
}
function climaFor(g){
  if(!climaMap) return null;
  return climaMap[String(g.gm).padStart(2,'0')+'-'+String(g.gd).padStart(2,'0')]||null;
}

// ================= ۷) تقویم =================
function buildJumpSelects(){
  const ms=$('monthSel'); ms.innerHTML='';
  J_MONTHS.forEach((m,i)=>{const o=document.createElement('option');o.value=i+1;o.textContent=m;ms.appendChild(o);});
  const ys=$('yearSel'); ys.innerHTML='';
  for(let y=1375;y<=1465;y++){const o=document.createElement('option');o.value=y;o.textContent=faNum(y);ys.appendChild(o);}
  ms.onchange=()=>{viewJ.jm=+ms.value;renderCalendar();renderDetail();};
  ys.onchange=()=>{viewJ.jy=+ys.value;renderCalendar();renderDetail();};
}
function renderCalendar(){
  refreshToday();
  const {jy,jm}=viewJ;
  monthTitle.textContent=`${J_MONTHS[jm-1]} ${faNum(jy)}`;
  const len=jMonthLength(jy,jm);
  const gFirst=toGregorian(jy,jm,1), gLast=toGregorian(jy,jm,len);
  gregRange.textContent=`${faNum(gFirst.gd)}/${faNum(gFirst.gm)} تا ${faNum(gLast.gd)}/${faNum(gLast.gm)} میلادی`;
  $('todayJalali').textContent='امروز: '+faDate(todayJ);
  $('monthSel').value=jm; $('yearSel').value=jy;
  try{ $('calTitle')?.setAttribute?.('aria-label',J_MONTHS[jm-1]+' '+jy); }catch(e){}

  // شمارش تعطیلات ماه
  let offs=0;
  for(let d=1;d<=len;d++){ if(occasions(jy,jm,d,toGregorian(jy,jm,d)).some(o=>o.off)) offs++; }
  $('monthInfo').textContent=offs?`🔴 ${faNum(offs)} تعطیلی رسمی در این ماه`:'بدون تعطیلی رسمی در این ماه';

  const dt=new Date(gFirst.gy,gFirst.gm-1,gFirst.gd);
  const offset=(dt.getDay()+1)%7;
  grid.innerHTML='';
  for(let i=0;i<offset;i++){const d=document.createElement('div');d.className='cell other';grid.appendChild(d);}

  for(let d=1;d<=len;d++){
    const g=toGregorian(jy,jm,d);
    const occ=occasions(jy,jm,d,g);
    const isOff=occ.some(o=>o.off);
    const cell=document.createElement('div');
    cell.className='cell'+(isOff?' holiday':'');
    if(new Date(g.gy,g.gm-1,g.gd).getDay()===5) cell.classList.add('friday');
    const isToday=(jy===todayJ.jy&&jm===todayJ.jm&&d===todayJ.jd);
    if(isToday) cell.classList.add('today');
    if(selectedG&&g.gy===selectedG.gy&&g.gm===selectedG.gm&&g.gd===selectedG.gd) cell.classList.add('selected');
    if(occ.length) cell.title=occ.map(o=>o.t+(o.off?' (تعطیل رسمی)':'')).join(' • ');

    let inner=`<span class="d">${faNum(d)}${isToday?' <em class="today-badge">امروز</em>':''}</span>`;
    const idx=dailyIndex(g);
    if(idx>=0){
      const code=forecast.daily.weathercode[idx];
      const mx=Math.round(forecast.daily.temperature_2m_max[idx]), mn=Math.round(forecast.daily.temperature_2m_min[idx]);
      const pr=forecast.daily.precipitation_probability_max?.[idx]??0;
      cell.classList.add('has-fc');
      inner+=`<span class="ico">${wmo(code)[1]}</span><span class="t">${faNum(mx)}° / ${faNum(mn)}°</span>`;
      if(pr>=20) inner+=`<span class="pr">🌧️ ${faNum(pr)}٪</span>`;
    } else {
      const c=climaFor(g);
      cell.classList.add('has-cl');
      if(c){
        inner+=`<span class="ico dim" title="${wmo(c.code)[0]} (میانگین آماری)">${wmo(c.code)[1]}</span><span class="t">~${faNum(c.mx)}° / ${faNum(c.mn)}°</span><span class="avg-tag">📊 آمار</span>`;
      } else if(climaLoading){
        inner+=`<span class="ico">⏳</span><span class="t" style="color:#94a3b8">...</span>`;
      } else {
        inner+=`<span class="ico" style="opacity:.4">📊</span><span class="t" style="color:#94a3b8">آمار</span>`;
      }
    }
    if(isOff) inner+=`<span class="hol-tag">تعطیل</span>`;
    else if(occ.length) inner+=`<span class="occ-dot" title="${occ[0].t}">${occ[0].mourn?'🏴':'🎉'}</span>`;
    cell.innerHTML=inner;
    cell.onclick=()=>{selectedG=g;updateHash();renderCalendar();renderDetail();};
    grid.appendChild(cell);
  }
  renderStrip();
}

// ---- نوار روزهای آینده ----
function renderStrip(){
  const box=$('strip'); const days=forecastSlice();
  if(!days.length){box.innerHTML='<span class="muted">پیش‌بینی در دسترس نیست (آفلاین؟)</span>';return;}
  box.innerHTML='';
  days.forEach(d=>{
    const g=d.g, off=occasions(d.j.jy,d.j.jm,d.j.jd,g).some(o=>o.off);
    const b=document.createElement('button');
    b.className='strip-item'+(selectedG&&gStr(g)===gStr(selectedG)?' sel':'')+(off?' hol':'');
    b.innerHTML=`<b>${WD_S[new Date(g.gy,g.gm-1,g.gd).getDay()]} ${faNum(d.j.jd)}</b><span class="ico">${wmo(d.code)[1]}</span><span>${faNum(d.mx)}°/${faNum(d.mn)}°</span>`;
    b.title=faDate(d.j);
    b.onclick=()=>{
      selectedG=g;
      if(viewJ.jy!==d.j.jy||viewJ.jm!==d.j.jm) viewJ={jy:d.j.jy,jm:d.j.jm};
      updateHash(); renderCalendar(); renderDetail();
    };
    box.appendChild(b);
  });
}

// ---- نمودار دما ----
function drawChart(){
  const cv=$('tempChart'); if(!cv) return;
  const days=forecastSlice();
  if(days.length<2){cv.parentElement.style.display='none';return;}
  cv.parentElement.style.display='';
  const dpr=window.devicePixelRatio||1;
  const W=cv.clientWidth||600, H=cv.clientHeight||150;
  cv.width=W*dpr; cv.height=H*dpr;
  const ctx=cv.getContext('2d'); ctx.scale(dpr,dpr);
  const pad={l:36,r:10,t:12,b:20};
  const hi=Math.max(...days.map(d=>d.mx))+1, lo=Math.min(...days.map(d=>d.mn))-1;
  const X=i=>pad.l+(W-pad.l-pad.r)*(i/(days.length-1));
  const Y=v=>pad.t+(H-pad.t-pad.b)*(1-(v-lo)/((hi-lo)||1));
  ctx.font='10px Vazirmatn,Tahoma';
  ctx.strokeStyle='#e2e8f0'; ctx.fillStyle='#64748b'; ctx.textAlign='left'; ctx.lineWidth=1;
  [lo,(lo+hi)/2,hi].forEach(v=>{ctx.beginPath();ctx.moveTo(pad.l,Y(v));ctx.lineTo(W-pad.r,Y(v));ctx.stroke();ctx.fillText(faNum(Math.round(v))+'°',2,Y(v)+3);});
  const line=(arr,color)=>{ctx.strokeStyle=color;ctx.lineWidth=2.5;ctx.beginPath();arr.forEach((v,i)=>i?ctx.lineTo(X(i),Y(v)):ctx.moveTo(X(i),Y(v)));ctx.stroke();ctx.fillStyle=color;arr.forEach((v,i)=>{ctx.beginPath();ctx.arc(X(i),Y(v),3,0,7);ctx.fill();});};
  line(days.map(d=>d.mx),'#ef4444'); line(days.map(d=>d.mn),'#0ea5e9');
  ctx.fillStyle='#94a3b8'; ctx.textAlign='center';
  const k=Math.ceil(days.length/4);
  let lastM=0;
  days.forEach((d,i)=>{
    if(i%k===0||i===days.length-1){
      ctx.fillText(faNum(d.j.jd),X(i),H-5);
      if(d.j.jm!==lastM){ ctx.fillStyle='#64748b'; ctx.fillText(J_MONTHS[d.j.jm-1],X(i),H-16); ctx.fillStyle='#94a3b8'; lastM=d.j.jm; }
    }
  });
}
let rsTimer; window.addEventListener('resize',()=>{clearTimeout(rsTimer);rsTimer=setTimeout(drawChart,200);});

// ================= ۸) پنل جزئیات =================
function buildAlerts(idx){
  const out=[];
  if(idx<0) return out;
  const d=forecast.daily, code=d.weathercode[idx];
  const mx=forecast.daily.temperature_2m_max[idx], mn=forecast.daily.temperature_2m_min[idx];
  const pr=d.precipitation_probability_max?.[idx]??0;
  const wind=d.wind_speed_10m_max?.[idx]??0;
  const uv=d.uv_index_max?.[idx];
  if([71,73,75,77,85,86].includes(code)) out.push({l:'danger',t:'❄️ هشدار برف و لغزندگی معابر'});
  else if([95,96,99].includes(code)) out.push({l:'danger',t:'⛈️ هشدار رعد و برق و تندباد'});
  else if([65,82].includes(code)) out.push({l:'danger',t:'🌧️ هشدار بارش شدید و احتمال آب‌گرفتگی'});
  else if(pr>=70) out.push({l:'warn',t:`🌧️ احتمال بارش بالا (${faNum(pr)}٪) — چتر و لباس مناسب همراه داشته باشید`});
  else if(pr>=40) out.push({l:'info',t:`🌦️ احتمال بارش ${faNum(pr)}٪`});
  if(wind>=50) out.push({l:'danger',t:`💨 هشدار باد شدید (${faNum(Math.round(wind))} کیلومتر بر ساعت)`});
  else if(wind>=35) out.push({l:'warn',t:`💨 وزش باد نسبتاً شدید (${faNum(Math.round(wind))} km/h)`});
  if(mx>=38) out.push({l:'danger',t:`🔥 هشدار گرمای شدید (بیشینه ${faNum(Math.round(mx))}°) — آب کافی بنوشید`});
  else if(mx>=34) out.push({l:'warn',t:`🌡️ هوای گرم (بیشینه ${faNum(Math.round(mx))}°)`});
  if(mn<=-5) out.push({l:'danger',t:`🧊 هشدار یخبندان (کمینه ${faNum(Math.round(mn))}°)`});
  else if(mn<0) out.push({l:'warn',t:`🧊 کمینه زیر صفر (${faNum(Math.round(mn))}°) — احتمال یخ‌زدگی`});
  if(uv!=null&&uv>=8) out.push({l:'warn',t:`☀️ شاخص فرابنفش بسیار بالا (${faNum(uv.toFixed(0))}) — ضدآفتاب و عینک`});
      if([45,48].includes(code)) out.push({l:'info',t:'🌫️ مه‌آلود — در رانندگی احتیاط کنید'});
  // از تکرار اطلاع بارش بعد از هشدار مهم‌تر جلوگیری کن
  const hasDanger=out.some(o=>o.l==='danger'&&o.t.includes('بارش'));
  if(hasDanger) return out.filter(o=>!(o.l==='info'&&o.t.includes('بارش')));
  return out;
}
function renderDetail(){
  if(!selectedG) return;
  const j=toJalaali(selectedG.gy,selectedG.gm,selectedG.gd);
  const week=new Date(selectedG.gy,selectedG.gm-1,selectedG.gd).toLocaleDateString('fa-IR',{weekday:'long'});
  $('selectedTitle').textContent=`${week} • ${faDate(j)} • ${faNum(selectedG.gd)}/${faNum(selectedG.gm)}/${faNum(selectedG.gy)} میلادی`;
  const hj=hijriStr(selectedG);
  const hl=$('hijriLine'); if(hl) hl.textContent=hj?`هجری قمری: ${hj} — میلادی: ${faNum(selectedG.gd)}/${faNum(selectedG.gm)}/${faNum(selectedG.gy)}`:'';
  const idx=dailyIndex(selectedG);
  syncDayLen(selectedG, idx);

  // مناسبت‌ها
  const occ=occasions(j.jy,j.jm,j.jd,selectedG);
  const ob=$('occBox');
  if(occ.length){
    ob.classList.remove('hidden');
    ob.innerHTML=occ.map(o=>`<span class="occ-pill ${o.off?'off':o.mourn?'mourn':'fest'}">${o.mourn?'🏴':o.off?'🔴':'🎉'} ${o.t}${o.off?' (تعطیل رسمی)':''}</span>`).join('');
  } else { ob.classList.add('hidden'); ob.innerHTML=''; }
  const al=$('alerts'); al.innerHTML='';
  if(idx>=0&&forecast){
    const d=forecast.daily, code=d.weathercode[idx];
    const [txt,ico]=wmo(code);
    const mx=Math.round(d.temperature_2m_max[idx]), mn=Math.round(d.temperature_2m_min[idx]);
    const pr=d.precipitation_probability_max?.[idx]??0;
    const wind=Math.round(d.wind_speed_10m_max?.[idx]??0);
    const gust=Math.round(d.wind_gusts_10m_max?.[idx]??NaN);
    const wdir=d.wind_direction_10m_dominant?.[idx];
    const uv=d.uv_index_max?.[idx];
    const sr=d.sunrise?.[idx]?.slice(11,16), ss=d.sunset?.[idx]?.slice(11,16);
    const isToday=gStr(selectedG)===gStr(localToday());
    const cur=forecast.current;
    if(isToday&&cur){
      $('nowBox').innerHTML=`<div class="big-ico">${wmo(cur.weathercode)[1]}</div>
        <div><div class="big-temp">${faNum(Math.round(cur.temperature_2m))}°</div>
        <div class="desc">${wmo(cur.weathercode)[0]} • آخرین وضعیت دریافتی در ${city.name} • رطوبت ${faNum(cur.relative_humidity_2m)}٪</div></div>`;
    } else {
      $('nowBox').innerHTML=`<div class="big-ico">${ico}</div>
        <div><div class="big-temp">${faNum(mx)}° / ${faNum(mn)}°</div>
        <div class="desc">${txt} • ${faDate(j)}</div></div>`;
    }
    buildAlerts(idx).forEach(a=>{const p=document.createElement('div');p.className='alert '+a.l;p.textContent=a.t;al.appendChild(p);});
    const gustStr=!isNaN(gust)?` • تندباد تا ${faNum(gust)}`:'';
    const wdirStr=wdir!=null?' از '+compass(wdir):'';
    $('statsGrid').innerHTML=`
      <div class="stat"><b>${ico} ${txt}</b><span>وضعیت هوا</span></div>
      <div class="stat"><b>${faNum(mx)}° / ${faNum(mn)}°</b><span>بیشینه / کمینه</span></div>
      <div class="stat"><b>${faNum(pr)}٪</b><span>احتمال بارش</span></div>
      <div class="stat"><b>${faNum(wind)} km/h</b><span>باد${wdirStr}${gustStr}</span></div>
      <div class="stat"><b>${sr?faNum(sr):'—'} / ${ss?faNum(ss):'—'}</b><span>طلوع / غروب آفتاب</span></div>
      <div class="stat"><b>${uv!=null?faNum(uv.toFixed(1)):'—'}</b><span>شاخص UV</span></div>`;
    let hh='';
    forecast.hourly.time.forEach((t,i)=>{
      if(t.slice(0,10)===gStr(selectedG)){
        const h=t.slice(11,13);
        if(['00','06','12','18'].includes(h)){
          hh+=`<div class="h"><b>${faNum(h)}:۰۰</b><div>${wmo(forecast.hourly.weathercode[i])[1]}</div><div>${faNum(Math.round(forecast.hourly.temperature_2m[i]))}°</div><div class="hm">🌧️${faNum(forecast.hourly.precipitation_probability?.[i]??0)}٪ 💧${faNum(forecast.hourly.relative_humidity_2m?.[i]??0)}٪</div></div>`;
        }
      }
    });
    $('hourly').innerHTML=hh||'داده ساعتی موجود نیست.';
    // مقایسه با میانگین تاریخی
    const c=climaFor(selectedG);
    let cmp='';
    if(c){
      const dm=mx-c.mx;
      cmp=dm>=2?` و ${faNum(dm)} درجه <b>گرم‌تر</b> از میانگین تاریخی` : dm<=-2?` و ${faNum(-dm)} درجه <b>سردتر</b> از میانگین تاریخی` : ' و نزدیک به میانگین تاریخی';
    }
    $('climateBox').innerHTML=`🌤️ طبق مدل‌های هواشناسی، هوای <b>${city.name}</b> در <b>${faDate(j)}</b> «<b>${txt}</b>» پیش‌بینی می‌شود؛ بیشینه ${faNum(mx)} و کمینه ${faNum(mn)} درجه، احتمال بارش ${faNum(pr)}٪${cmp}.`;
    drawChart();
    return;
  }
  // روزهای دور: میانگین آماری
  $('tempChart').parentElement.style.display='none';
  const c=climaFor(selectedG);
  if(c){
    const [txt,ico]=wmo(c.code);
    $('nowBox').innerHTML=`<div class="big-ico">${ico}</div>
      <div><div class="big-temp">~${faNum(c.mx)}° / ~${faNum(c.mn)}°</div>
      <div class="desc">${txt} • میانگین آماری ${faDate(j)}</div></div>`;
    $('statsGrid').innerHTML=`
      <div class="stat"><b>${ico} ${txt}</b><span>هوای غالب این روز</span></div>
      <div class="stat"><b>~${faNum(c.mx)}° / ~${faNum(c.mn)}°</b><span>میانگین بیشینه/کمینه</span></div>
      <div class="stat"><b>${faNum(c.pr)} م.م</b><span>میانگین بارش روزانه</span></div>
      <div class="stat"><b>📊 آماری</b><span>نوع داده (۶ سال)</span></div>`;
    $('hourly').innerHTML='پیش‌بینی ساعتی فقط تا ۱۶ روز آینده موجود است.';
    $('climateBox').innerHTML=`${ico} طبق آمار هواشناسی ۶ سال گذشته، هوای <b>${city.name}</b> در <b>${faDate(j)}</b> معمولاً <b>${txt}</b> بوده است؛ میانگین بیشینه ~${faNum(c.mx)}° و کمینه ~${faNum(c.mn)}°، میانگین بارش ${faNum(c.pr)} میلی‌متر. ${c.pr>1?'☔ معمولاً بارش قابل توجه دارد.':c.pr>0.2?'🌦️ گاهی بارش خفیف دارد.':'☀️ معمولاً هوای خشکی است.'}`;
  } else {
    $('nowBox').innerHTML=`<div class="big-ico">📊</div>
      <div><div class="big-temp" style="font-size:22px">${climaLoading&&navigator.onLine?'در حال دریافت آمار...':'داده هواشناسی در دسترس نیست'}</div>
      <div class="desc">${climaLoading&&navigator.onLine?'میانگین تاریخی در حال دریافت است':'تقویم فعال است؛ برای داده تازه دوباره تلاش کنید.'}</div></div>`;
    $('statsGrid').innerHTML=''; $('hourly').innerHTML='—';
    $('climateBox').innerHTML=`برای <b>${faDate(j)}</b> پیش‌بینی دقیق وجود ندارد.<br>⏳ آمار در حال بارگذاری است...<br><button class="load-btn" id="avgBtn">📊 تلاش مجدد / محاسبه تکی این روز</button><div id="avgRes" style="margin-top:8px"></div>`;
    const b=$('avgBtn'); if(b) b.onclick=()=>loadSingleDayAvg(j);
  }
}
async function loadSingleDayAvg(j){
  const res=$('avgRes'); if(!res) return;
  res.innerHTML='⏳ در حال دریافت آرشیو هواشناسی...';
  const g=toGregorian(j.jy,j.jm,j.jd);
  const mm=String(g.gm).padStart(2,'0'), dd=String(g.gd).padStart(2,'0');
  try{
    const reqs=[2019,2020,2021,2022,2023,2024].map(y=>fetch(
      `https://archive-api.open-meteo.com/v1/archive?latitude=${city.lat}&longitude=${city.lon}`+
      `&start_date=${y}-${mm}-${dd}&end_date=${y}-${mm}-${dd}`+
      `&daily=temperature_2m_max,temperature_2m_min,precipitation_sum,weathercode&timezone=Asia%2FTehran`
    ).then(r=>r.json()));
    const arr=await Promise.all(reqs);
    let sx=0,sn=0,sp=0,n=0; const codes={};
    arr.forEach(a=>{
      if(a.daily?.temperature_2m_max?.[0]!=null){
        sx+=a.daily.temperature_2m_max[0]; sn+=a.daily.temperature_2m_min[0]; sp+=a.daily.precipitation_sum[0]||0; n++;
        const c=a.daily.weathercode[0]; codes[c]=(codes[c]||0)+1;
      }
    });
    if(!n){res.innerHTML='داده آرشیوی برای این روز یافت نشد.';return;}
    const top=Object.entries(codes).sort((a,b)=>b[1]-a[1])[0][0];
    const [txt,ico]=wmo(Number(top));
    res.innerHTML=`${ico} طبق آمار ۶ سال گذشته: <b>${txt}</b>، میانگین بیشینه ${faNum(Math.round(sx/n))}° و کمینه ${faNum(Math.round(sn/n))}°، بارش ${faNum((sp/n).toFixed(1))} م.م.`;
  }catch(e){ res.innerHTML='⚠️ خطا در دریافت آرشیو.'; }
}

function syncDayLen(g, idx){
  const el=$('dayLen'); if(!el) return;
  if(idx>=0&&forecast&&forecast.daily&&forecast.daily.sunrise&&forecast.daily.sunset){
    const sr=forecast.daily.sunrise[idx]?.slice(11,16), ss=forecast.daily.sunset[idx]?.slice(11,16);
    if(sr&&ss){
      const len=dayMinutes(ss)-dayMinutes(sr);
      const h=Math.floor(len/60), m=len%60;
      el.innerHTML=`<span class="dl">🌅 طلوع ${faNum(sr)}</span><span class="dl">🌇 غروب ${faNum(ss)}</span><span class="dl">⏱️ طول روز ${faNum(h)} ساعت و ${faNum(m)} دقیقه</span>`;
      el.classList.remove('hidden'); return;
    }
  }
  el.classList.add('hidden'); el.innerHTML='';
}
function buildICSForSelected(){
  if(!selectedG) return null;
  const j=toJalaali(selectedG.gy,selectedG.gm,selectedG.gd);
  const occ=occasions(j.jy,j.jm,j.jd,selectedG).map(o=>o.t).join('، ');
  const title=occ||faDate(j);
  const d=gStr(selectedG).replace(/-/g,'');
  const dt=d; // all-day
  const desc=`شهر: ${city.name} — ${faDate(j)} — میلادی ${selectedG.gy}/${selectedG.gm}/${selectedG.gd} — هجری ${hijriStr(selectedG)}`;
  return ['BEGIN:VCALENDAR','VERSION:2.0','PRODID:-//Jalali Weather//FA','BEGIN:VEVENT',
    'UID:'+d+'@jalali-weather.local','DTSTAMP:'+d+'T000000Z','DTSTART;VALUE=DATE:'+dt,
    'SUMMARY:'+title.replace(/,/g,'\\,'),'DESCRIPTION:'+desc.replace(/,/g,'\\,'),'END:VEVENT','END:VCALENDAR'].join('\r\n');
}

// ================= ۹) ناوبری، کیبورد، موقعیت، اشتراک، تم، آفلاین =================
function moveDay(delta){
  const d=new Date(selectedG.gy,selectedG.gm-1,selectedG.gd+delta);
  selectedG={gy:d.getFullYear(),gm:d.getMonth()+1,gd:d.getDate()};
  const j=toJalaali(selectedG.gy,selectedG.gm,selectedG.gd);
  if(j.jy!==viewJ.jy||j.jm!==viewJ.jm) viewJ={jy:j.jy,jm:j.jm};
  updateHash(); renderCalendar(); renderDetail();
}
$('prevMonth').onclick=()=>{viewJ.jm--;if(viewJ.jm<1){viewJ.jm=12;viewJ.jy--;}renderCalendar();renderDetail();};
$('nextMonth').onclick=()=>{viewJ.jm++;if(viewJ.jm>12){viewJ.jm=1;viewJ.jy++;}renderCalendar();renderDetail();};
$('todayBtn').onclick=()=>{const t=refreshToday();viewJ={jy:todayJ.jy,jm:todayJ.jm};selectedG=t;updateHash();renderCalendar();renderDetail();};
document.addEventListener('keydown',e=>{
  const tag=(e.target.tagName||'').toUpperCase();
  if(['INPUT','SELECT','TEXTAREA'].includes(tag)) return;
  if(e.key==='ArrowLeft') moveDay(1);
  else if(e.key==='ArrowRight') moveDay(-1);
  else if(e.key==='ArrowDown') moveDay(7);
  else if(e.key==='ArrowUp') moveDay(-7);
  else if(e.key==='PageDown') $('nextMonth').click();
  else if(e.key==='PageUp') $('prevMonth').click();
  else return;
  e.preventDefault();
});
$('geoBtn').onclick=()=>{
  if(!navigator.geolocation){toast('مرورگر شما از موقعیت‌یاب پشتیبانی نمی‌کند');return;}
  toast('📍 در حال یافتن موقعیت شما...');
  navigator.geolocation.getCurrentPosition(async pos=>{
    const {latitude:lat,longitude:lon}=pos.coords;
    let name='موقعیت من';
    try{
      const r=await fetch(`https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${lat}&longitude=${lon}&localityLanguage=fa`);
      const j=await r.json();
      name=j.city||j.locality||j.principalSubdivision||name;
    }catch(e){}
    setCity({name,lat:+lat.toFixed(4),lon:+lon.toFixed(4)});
    toast('📍 موقعیت شما تنظیم شد: '+name);
  },()=>toast('⚠️ دسترسی به موقعیت داده نشد'),{timeout:12000});
};
$('favBtn').onclick=()=>{
  const i=favs.findIndex(f=>Math.abs(f.lat-city.lat)<0.05&&Math.abs(f.lon-city.lon)<0.05);
  if(i>=0){favs.splice(i,1);toast('از منتخب‌ها حذف شد');}
  else{favs.push({...city});toast('⭐ '+city.name+' به منتخب‌ها اضافه شد');}
  saveFavs(); renderFavs();
};
$('shareBtn').onclick=async()=>{
  updateHash();
  const link=location.href.split('#')[0]+location.hash;
  try{
    if(navigator.share){
      try{ await navigator.share({title:document.title, url:link}); toast('🔗 اشتراک‌گذاری شد'); return; }catch(e){ /* fallback to clipboard */ }
    }
    await navigator.clipboard.writeText(link); toast('🔗 لینک این روز و شهر کپی شد');
  }
  catch(e){
    const ta=document.createElement('textarea'); ta.value=link; document.body.appendChild(ta);
    ta.select(); try{document.execCommand('copy');toast('🔗 لینک کپی شد');}catch(_){toast('لینک: '+link);}
    ta.remove();
  }
};

// دکمه‌های اقدام روز
$('copyDateBtn')?.addEventListener('click', async()=>{
  if(!selectedG) return;
  const j=toJalaali(selectedG.gy,selectedG.gm,selectedG.gd);
  const t=`${faDate(j)} — ${faNum(selectedG.gd)}/${faNum(selectedG.gm)}/${faNum(selectedG.gy)} میلادی — ${hijriStr(selectedG)||''} — ${city.name}`;
  try{ await navigator.clipboard.writeText(t); toast('📋 تاریخ کپی شد'); }catch(e){ toast(t); }
});
$('gcalBtn')?.addEventListener('click', ()=>{
  if(!selectedG) return;
  const d=gStr(selectedG).replace(/-/g,'');
  const j=toJalaali(selectedG.gy,selectedG.gm,selectedG.gd);
  const occ=occasions(j.jy,j.jm,j.jd,selectedG).map(o=>o.t).join('، ')||faDate(j);
  const url=`https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(occ)}&dates=${d}/${d}&details=${encodeURIComponent('شهر: '+city.name+' — '+faDate(j))}&location=${encodeURIComponent(city.name)}`;
  window.open(url,'_blank');
});
$('icsBtn')?.addEventListener('click', ()=>{
  const ics=buildICSForSelected(); if(!ics) return;
  const blob=new Blob([ics],{type:'text/calendar;charset=utf-8'});
  const a=document.createElement('a'); a.href=URL.createObjectURL(blob); a.download=gStr(selectedG)+'.ics'; a.click(); setTimeout(()=>URL.revokeObjectURL(a.href),2000);
  toast('⬇️ فایل تقویم دانلود شد');
});
$('printBtn')?.addEventListener('click', ()=>window.print());
$('refreshBtn')?.addEventListener('click', ()=>{ loadWeather(true); toast('🔄 در حال به‌روزرسانی داده هواشناسی...'); });
$('themeBtn')?.addEventListener('click', ()=>{
  const cur=document.documentElement.getAttribute('data-theme');
  const next=cur==='dark'?'light':'dark';
  if(next==='dark') document.documentElement.setAttribute('data-theme','dark');
  else document.documentElement.removeAttribute('data-theme');
  try{ localStorage.setItem('theme_v1', next); }catch(e){}
  $('themeBtn').textContent=next==='dark'?'☀️':'🌙';
  syncThemeColor();
  toast(next==='dark'?'🌙 تم تیره فعال شد':'☀️ تم روشن فعال شد');
});
function syncThemeColor(){
  let m=document.querySelector('meta[name="theme-color"]');
  if(!m){ m=document.createElement('meta'); m.name='theme-color'; document.head.appendChild(m); }
  m.content=isDark()?'#0f172a':'#bae6fd';
}
syncThemeColor();
(function syncThemeBtn(){ const b=$('themeBtn'); if(b) b.textContent=isDark()?'☀️':'🌙'; })();
function updateOfflineBar(){ const el=$('offlineBar'); if(el) el.classList.toggle('hidden', navigator.onLine); renderFetchInfo(); }
window.addEventListener('online', updateOfflineBar); window.addEventListener('offline', updateOfflineBar); updateOfflineBar();

// ================= ۱۰) جستجوی شهر =================
let timer, suggestIdx=-1;
function setSuggestExpanded(exp){ const inp=$('cityInput'); if(inp) inp.setAttribute('aria-expanded',exp?'true':'false'); }
$('cityInput').addEventListener('input',e=>{
  clearTimeout(timer); suggestIdx=-1;
  const q=e.target.value.trim();
  if(q.length<2){$('suggestList').classList.add('hidden'); setSuggestExpanded(false); return;}
  timer=setTimeout(async()=>{
    try{
      const ctrl=new AbortController(); const to=setTimeout(()=>ctrl.abort(),6000);
      const r=await fetch(`https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(q)}&count=5&language=fa&format=json`,{signal:ctrl.signal});
      clearTimeout(to); const j=await r.json();
      const ul=$('suggestList'); ul.innerHTML=''; suggestIdx=-1;
      if(j.results&&j.results.length){ j.results.forEach((p,i)=>{
        const li=document.createElement('li'); li.id='sugg-'+i; li.setAttribute('role','option');
        li.textContent=`${p.name} ${p.admin1?'(' +p.admin1+')':''} ${p.country||''}`;
        li.onclick=()=>{setCity({name:p.name,lat:p.latitude,lon:p.longitude}); ul.classList.add('hidden'); setSuggestExpanded(false); $('cityInput').value=''; suggestIdx=-1;};
        ul.appendChild(li);
      }); ul.classList.remove('hidden'); setSuggestExpanded(true); }
      else { ul.classList.add('hidden'); setSuggestExpanded(false); }
    }catch(e){ $('suggestList').classList.add('hidden'); setSuggestExpanded(false); }
  },400);
});
$('cityInput').addEventListener('keydown',e=>{
  const ul=$('suggestList'), items=[...ul.querySelectorAll('li')];
  if(ul.classList.contains('hidden')||!items.length) return;
  if(e.key==='ArrowDown'){ e.preventDefault(); suggestIdx=(suggestIdx+1)%items.length; items.forEach((li,i)=>li.style.background=i===suggestIdx?'#eef6ff':''); $('cityInput').setAttribute('aria-activedescendant',items[suggestIdx].id); }
  else if(e.key==='ArrowUp'){ e.preventDefault(); suggestIdx=(suggestIdx-1+items.length)%items.length; items.forEach((li,i)=>li.style.background=i===suggestIdx?'#eef6ff':''); $('cityInput').setAttribute('aria-activedescendant',items[suggestIdx].id); }
  else if(e.key==='Enter'&&suggestIdx>=0){ e.preventDefault(); items[suggestIdx].click(); }
  else if(e.key==='Escape'){ ul.classList.add('hidden'); setSuggestExpanded(false); suggestIdx=-1; }
});
$('cityInput').addEventListener('blur',()=>setTimeout(()=>{ $('suggestList').classList.add('hidden'); setSuggestExpanded(false); },180));
$('searchBtn').onclick=()=>{if($('cityInput').value.trim().length>=2) $('cityInput').dispatchEvent(new Event('input')); };

// ================= ۱۱) شروع =================
(function init(){
  const h=parseHash();
  if(h&&h.date){
    city=h.city; selectedG=h.date;
    try{ const j=toJalaali(h.date.gy,h.date.gm,h.date.gd); viewJ={jy:j.jy,jm:j.jm}; }
    catch(e){ const t=refreshToday(); viewJ={jy:todayJ.jy,jm:todayJ.jm}; }
  } else {
    const t=refreshToday();
    viewJ={jy:todayJ.jy,jm:todayJ.jm}; selectedG=t;
  }
  buildJumpSelects(); renderChips(); renderFavs();
  $('cityName').textContent=city.name+' 📍';
  renderCalendar(); renderDetail();
  loadWeather(); loadClimate();
  startAutoRefresh();
  setInterval(renderFetchInfo,60*1000);
  if('serviceWorker' in navigator&&/^https?:/.test(location.protocol)){
    navigator.serviceWorker.register('sw.js').catch(()=>{});
  }
})();
