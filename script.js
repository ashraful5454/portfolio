const $=s=>document.querySelector(s),esc=s=>String(s??"").replace(/[&<>"]/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c]));
const I={ph:'<path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.13.96.36 1.9.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.91.34 1.85.57 2.81.7A2 2 0 0 1 22 16.92z"/>',
wa:'<path d="M21 11.5a8.4 8.4 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.4 8.4 0 0 1-3.8-.9L3 21l1.9-5.7a8.4 8.4 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.4 8.4 0 0 1 3.8-.9h.5a8.5 8.5 0 0 1 8 8z"/><path d="M9 9.5c0 3 2.5 5.5 5.5 5.5l1-1.2-1.8-.9-.7.6a3.4 3.4 0 0 1-1.6-1.6l.6-.7-.9-1.8z"/>',
ml:'<rect x="2" y="4" width="20" height="16" rx="3"/><path d="m22 7-10 6.5L2 7"/>'};
const ic=(k,l,v,h,x)=>`<a class="cc rv" href="${h}" ${x||""}><span class="ic"><svg viewBox="0 0 24 24">${I[k]}</svg></span><span><small>${l}</small><b>${esc(v)}</b></span></a>`;
const av=n=>"data:image/svg+xml;utf8,"+encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200"><rect width="200" height="200" fill="#1c1440"/><text x="100" y="128" font-size="84" text-anchor="middle" fill="#ffb02e" font-family="sans-serif" font-weight="800">${n.split(" ").map(w=>w[0]).slice(0,2).join("")}</text></svg>`);
const row=(a,r)=>{const x=[...a,...a,...a,...a];return`<div class="mq${r?" rev":""}"><div>${x.map(s=>`<span>${esc(s)}</span>`).join("")}</div></div>`};
fetch("data/content.json?"+Date.now()).then(r=>r.json()).then(D=>{build(D);init()}).catch(e=>console.error(e));

function build(D){
 theme(D.theme);document.title=D.name+" – WordPress Developer";
 $("#name").setAttribute("aria-label",D.name);
 $("#name").innerHTML=[...D.name].map((c,i)=>c===" "?'<span class="sp"></span>':`<span class="l" aria-hidden="true" style="--i:${i}">${esc(c)}</span>`).join("");
 $("#hello").textContent="হ্যালো, আমি";$("#bio").textContent=D.bio;
 $("#photo").src=D.photo||av(D.name);
 $("#chips").innerHTML=D.skills.slice(0,4).map(s=>`<span class="chip">${esc(s)}</span>`).join("");
 const p=D.phone.replace(/\D/g,""),w="https://wa.me/"+(p.startsWith("0")?"88"+p:p)+"?text="+encodeURIComponent("Hello "+D.name);
 $("#wa").href=w;
 $("#stats").innerHTML=D.stats.map(s=>`<div class="rv"><span class="num" data-n="${esc(s.n)}">${esc(s.n)}</span><span>${esc(s.t)}</span></div>`).join("");
 $("#srv").innerHTML=D.services.map(s=>`<article class="srv rv"><i></i><h3>${esc(s.t)}</h3><p>${esc(s.d)}</p></article>`).join("");
 $("#pg").innerHTML=D.projects.map(s=>{const t=s.l?"a":"div";return`<${t} class="pj rv" ${s.l?`href="${esc(s.l)}" target="_blank" rel="noopener"`:""}>${s.img?`<img src="${esc(s.img)}" alt="${esc(s.t)}" loading="lazy">`:""}${s.l?'<span class="go">↗</span>':""}<div><h3>${esc(s.t)}</h3><p>${esc(s.d)}</p></div></${t}>`}).join("");
 $("#mq").innerHTML=row(D.skills)+row([...D.skills].reverse(),1);
 $("#cg").innerHTML=ic("ph","ফোন করুন",D.phone,"tel:"+D.phone)+ic("wa","WhatsApp",D.phone,w,'target="_blank" rel="noopener"')+ic("ml","Email",D.email,"mailto:"+D.email);
 $("#soc").innerHTML=[["facebook","Facebook"],["linkedin","LinkedIn"],["github","GitHub"]].filter(([k])=>D[k]).map(([k,l])=>`<a href="${esc(D[k])}" target="_blank" rel="noopener">${l}</a>`).join("");
 $("#ft").textContent="© "+new Date().getFullYear()+" "+D.name;
 let r=0,c=0,del=false;const el=$("#typ");
 (function t(){const w=D.roles[r%D.roles.length]||"";c+=del?-1:1;el.textContent=w.slice(0,c);let d=del?35:85;
  if(!del&&c>=w.length){del=true;d=1400}else if(del&&c<=0){del=false;r++;d=300}setTimeout(t,d)})();
}

function count(e){const m=/^(\d+)(.*)$/.exec(e.dataset.n);if(!m)return;const to=+m[1];let s=null;
 const f=t=>{s??=t;const p=Math.min((t-s)/1500,1);e.textContent=Math.round(to*(1-Math.pow(1-p,3)))+m[2];if(p<1)requestAnimationFrame(f)};requestAnimationFrame(f)}

function init(){
 const io=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){e.target.classList.add("on");e.target.querySelectorAll("[data-n]").forEach(count);io.unobserve(e.target)}}),{threshold:.15});
 document.querySelectorAll(".rv").forEach(e=>io.observe(e));
 const links=[...document.querySelectorAll("header nav a")],secs=links.map(a=>$(a.getAttribute("href")));
 const hd=$("header"),pb=$("#pb");
 addEventListener("scroll",()=>{const h=document.documentElement;pb.style.width=h.scrollTop/(h.scrollHeight-h.clientHeight||1)*100+"%";hd.classList.toggle("sc",scrollY>40);
  let cur=-1;secs.forEach((s,i)=>{if(s.getBoundingClientRect().top<innerHeight*.45)cur=i});links.forEach((a,i)=>a.classList.toggle("act",i===cur))},{passive:true});
 if(matchMedia("(pointer:fine)").matches&&!matchMedia("(prefers-reduced-motion:reduce)").matches){
  const cu=$("#cur");cu.style.display="block";let x=0,y=0,tx=0,ty=0;
  addEventListener("mousemove",e=>{tx=e.clientX;ty=e.clientY});
  (function l(){x+=(tx-x)*.18;y+=(ty-y)*.18;cu.style.transform=`translate(${x-18}px,${y-18}px)`;requestAnimationFrame(l)})();
  document.addEventListener("mouseover",e=>cu.classList.toggle("big",!!e.target.closest("a,button")));
  document.querySelectorAll(".btn").forEach(b=>{b.onmousemove=e=>{const r=b.getBoundingClientRect();b.style.transform=`translate(${(e.clientX-r.left-r.width/2)*.25}px,${(e.clientY-r.top-r.height/2)*.35}px)`};b.onmouseleave=()=>b.style.transform=""});
  const hr=$(".hr"),bl=$(".blob");hr.onmousemove=e=>{const r=hr.getBoundingClientRect();bl.style.transform=`rotateY(${((e.clientX-r.left)/r.width-.5)*18}deg) rotateX(${-((e.clientY-r.top)/r.height-.5)*18}deg)`};hr.onmouseleave=()=>bl.style.transform="";
 }
}
