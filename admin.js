const $=s=>document.querySelector(s),esc=s=>String(s??"").replace(/[&<>"]/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c]));
let D,PW="",files={},prev={};
const lines=v=>v.split("\n").map(s=>s.trim()).filter(Boolean),csv=v=>v.split(",").map(s=>s.trim()).filter(Boolean);

async function api(body){
 let r,j={};try{r=await fetch("/api/save",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({password:PW,...body})});j=await r.json()}catch(e){throw new Error("API পাওয়া যায়নি। Vercel এ deploy করে খুলুন।")}
 if(!r.ok)throw new Error(j.error||"Error");return j}
const msg=(t,bad)=>{const m=$("#msg");m.textContent=t;m.style.color=bad?"#ff5d73":"#ffb02e"};

$("#go").onclick=async()=>{PW=$("#pw").value;$("#err").textContent="";
 try{await api({action:"verify"});D=await(await fetch("data/content.json?"+Date.now())).json();$("#login").hidden=true;$("#ed").hidden=false;draw()}catch(e){$("#err").textContent=e.message}};
$("#pw").onkeydown=e=>e.key==="Enter"&&$("#go").click();

const inp=(l,k,v,rows)=>`<label>${l}${rows?`<textarea data-k="${k}" rows="${rows}">${esc(v)}</textarea>`:`<input data-k="${k}" value="${esc(v)}">`}</label>`;
const box=(id,src)=>`<div class="drop" data-img="${id}"><img src="${esc(prev[src]||src||"")}" ${src?"":"hidden"} alt=""><span>ছবি drag and drop করুন, অথবা click করে বাছুন</span><input type="file" accept="image/*" hidden></div>`;
const list=(key,fs)=>`<div class="list">${D[key].map((o,i)=>`<div class="item">${fs.map(([f,l,ta])=>`<label>${l}${ta?`<textarea data-l="${key}" data-i="${i}" data-f="${f}" rows="2">${esc(o[f])}</textarea>`:`<input data-l="${key}" data-i="${i}" data-f="${f}" value="${esc(o[f])}">`}</label>`).join("")}${key==="projects"?box("projects."+i,o.img):""}<button class="x" data-del="${key}.${i}">মুছে ফেলুন</button></div>`).join("")}<button class="add" data-add="${key}">+ নতুন যোগ করুন</button></div>`;

function draw(){
 $("#body").innerHTML=`
 <section><h2>Color theme</h2><div class="sws">${T.map((t,i)=>`<button class="sw${D.theme==i?" on":""}" data-th="${i}" title="${t.n}" style="background:linear-gradient(110deg,${t.a},${t.b},${t.c})"></button>`).join("")}</div></section>
 <section><h2>Hero photo</h2>${box("photo",D.photo)}</section>
 <section><h2>মূল তথ্য</h2>${inp("নাম","name",D.name)}${inp("Typing animation এর লাইন (প্রতি লাইনে একটা)","roles",D.roles.join("\n"),4)}${inp("Bio","bio",D.bio,4)}${inp("Phone / WhatsApp","phone",D.phone)}${inp("Email","email",D.email)}${inp("Facebook link","facebook",D.facebook)}${inp("LinkedIn link","linkedin",D.linkedin)}${inp("GitHub link","github",D.github)}</section>
 <section><h2>Stats</h2>${list("stats",[["n","সংখ্যা (যেমন 3+)"],["t","লেখা"]])}</section>
 <section><h2>Services</h2>${list("services",[["t","Title"],["d","বিবরণ",1]])}</section>
 <section><h2>Projects</h2>${list("projects",[["t","Title"],["d","বিবরণ",1],["l","Link (ফাঁকা রাখলে link হবে না)"]])}</section>
 <section><h2>Skills</h2>${inp("Comma দিয়ে লিখুন","skills",D.skills.join(", "),3)}</section>`}

document.addEventListener("input",e=>{const t=e.target,k=t.dataset.k;
 if(k)D[k]=k==="roles"?lines(t.value):k==="skills"?csv(t.value):t.value;
 else if(t.dataset.l)D[t.dataset.l][+t.dataset.i][t.dataset.f]=t.value});

document.addEventListener("click",e=>{const t=e.target;
 if(t.dataset.th!==undefined){D.theme=+t.dataset.th;draw();theme(D.theme)}
 else if(t.dataset.del){const[k,i]=t.dataset.del.split(".");D[k].splice(+i,1);draw()}
 else if(t.dataset.add){const k=t.dataset.add;D[k].push({stats:{n:"",t:""},services:{t:"",d:""},projects:{t:"",d:"",l:"",img:""}}[k]);draw()}
 else{const d=t.closest(".drop");if(d&&t.type!=="file")d.querySelector("input").click()}});

function pick(f){return new Promise(res=>{const r=new FileReader();r.onload=()=>{const i=new Image();i.onload=()=>{
 const s=Math.min(1,900/Math.max(i.width,i.height)),c=document.createElement("canvas");c.width=i.width*s;c.height=i.height*s;c.getContext("2d").drawImage(i,0,0,c.width,c.height);
 const u=c.toDataURL("image/jpeg",.82),p="img/"+Date.now()+Math.random().toString(36).slice(2,6)+".jpg";files[p]=u.split(",")[1];prev[p]=u;res(p)};i.src=r.result};r.readAsDataURL(f)})}
async function setImg(d,f){if(!f||!/^image/.test(f.type))return;const p=await pick(f),id=d.dataset.img;
 if(id==="photo")D.photo=p;else D.projects[+id.split(".")[1]].img=p;const im=d.querySelector("img");im.src=prev[p];im.hidden=false;msg("ছবি প্রস্তুত, Save করুন")}
document.addEventListener("change",e=>{const d=e.target.closest(".drop");if(d)setImg(d,e.target.files[0])});
document.addEventListener("dragover",e=>{const d=e.target.closest(".drop");if(d){e.preventDefault();d.classList.add("over")}});
document.addEventListener("dragleave",e=>{const d=e.target.closest(".drop");d&&d.classList.remove("over")});
document.addEventListener("drop",e=>{const d=e.target.closest(".drop");if(d){e.preventDefault();d.classList.remove("over");setImg(d,e.dataTransfer.files[0])}});

$("#save").onclick=async()=>{const s=JSON.stringify(D),fs=Object.entries(files).filter(([p])=>s.includes(p)).map(([path,data])=>({path,data}));
 msg("Save হচ্ছে...");try{await api({content:D,files:fs});files={};msg("Save হয়েছে। ১–২ মিনিটের মধ্যে site এ live হবে।")}catch(e){msg(e.message,1)}};
