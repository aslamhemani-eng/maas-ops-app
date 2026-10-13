// Maa's Operations – clickable preview. Sample people only; all state in localStorage; nothing is sent.
const DISHES={"Appetizer":["Samosa","Pakora","Veggie Patties","Lal Aloo","Dahi Phulki","Khaman Dhokla"],"Rice":["Jeera Rice","Daal Rice"],
"Veggie":["Chora Aloo Curry","Chora Guvar Aloo","Doodhi Daal","Mix Veg","Aloo Palak","Daal Palak","Paneer Palak","Chana Daal","Bhindi","Baingan Aloo","Pakora Kadhi","Baghare Baingan"],
"Meat":["Karahi Chicken","Chicken Korma","Chicken Katakat","Achari Chicken","Chicken Aloo Curry","Qeema Matar Aloo","Chicken 65","Chicken Palak","Kofta Curry","Bhuna Chicken","Nihari"],
"Bread":["Roti","Long Naan","Naan"]};
const SPECIALS=["Pulao","Masoor Biryani"];
const VENDORS=[{n:"Al Markaz",what:"Weekly menu dishes (quantity per dish)",day:"Saturday"},{n:"Popeyes",what:"Drop off",day:"Saturday"},
{n:"Chinese (Stir Fry Chicken, Fried Rice)",what:"For Austin Street Center",day:"Friday"},{n:"Chinese (Stir Fry Chicken, Fried Rice)",what:"For The Bridge North Texas",day:"Saturday"}];
const SHELTERS=[["The Bridge North Texas","Adults","1818 Corsicana St, Dallas 75201"],["Genesis Women's Shelter","Women & children (DV)","4411 Lemmon Ave Ste 201, Dallas 75219"],
["Union Gospel Mission – Center of Hope","Women & children","4815 Cass St, Dallas 75235"],["Family Gateway","Homeless families","711 S St Paul St, Dallas 75201"],
["Dallas Life Foundation","Men, women & children","1100 Cadiz St, Dallas 75215"],["Salvation Army – Carr P. Collins Center","Families, men & women","5302 Harry Hines Blvd, Dallas 75235"],
["Austin Street Center","Men & women (emergency)","2929 Hickory St, Dallas 75226"],["The Stewpot","Homeless outreach","1835 Young St, Dallas 75201"],
["Housing Crisis Center","Adults","4210 Junius St, Dallas 75246"],["Mosaic Family Services","Families","12225 Greenville Ave #800, Dallas 75243"],
["Buckner Family Pathways","Women & children","700 N Pearl St, Dallas 75201"],["Presbyterian Night Shelter","Men, women, families","2400 Cypress St, Fort Worth 76102"],
["Union Gospel Mission of Tarrant County","Men, women & families","1321 E Lancaster Ave, Fort Worth 76102"],["Arlington Life Shelter","Men, women & children","325 W Division St, Arlington 76011"],
["The Samaritan Inn","Men, women & families","1710 N McDonald St, McKinney 75071"],["Monsignor King Outreach Center","Adults (emergency)","300 S Woodrow Ln, Denton 76205"]];
const PROGRAMS=[{n:"Maa's Meals",d:"Saturday",t:"10 AM – 12 PM",x:"About 2,200 fresh meals",loc:"1445 MacArthur Dr, Suite 104, Carrollton"},
{n:"Maa's Place",d:"Monday – Thursday",t:"10 AM – 2 PM",x:"Free senior center · opening soon",loc:"2700 Old Denton Rd, Suite 102, Carrollton"},
{n:"Blooming Star Village",d:"Monday – Thursday",t:"9 AM – 2 PM",x:"Ages 5–17 · coming soon",loc:"2700 Old Denton Rd, Suite 102, Carrollton"}];
const PEOPLE=["Sample Volunteer A","Sample Volunteer B","Sample Volunteer C","Sample Volunteer D","Sample Volunteer E","Sample Volunteer F","Sample Driver G","Sample Driver H"];
function fresh(){return{menu:{Appetizer:"Samosa",Rice:"Jeera Rice",Veggie:"Mix Veg",Meat:"Karahi Chicken",Bread:"Roti"},qty:2200,special:"",locked:false,sent:false,
sand:100,sandHist:[["Week 1",175],["Week 2",150],["Week 3",120],["Week 4",100]],sandSent:false,
inv:[["Large Brown Bags","boxes",5,8,1,0],["Small Brown Bags #4","boxes",4,6,1,0],["Plastic Containers with Cover","cases",20,25,4,0],["Medium Gloves","cases",1,3,1,0],["Hair Nets","packs",6,4,1,1],
["Plastic Roti Bags","packs",8,6,2,1],["Garbage Bags","cases",1,2,1,0],["Paper Towels","rolls",34,24,8,1],["Wipes","packs",10,8,2,1],["Clear Plastic Bags","bags",300,400,100,0],["Toilet Paper","rolls",24,20,6,1],["Hand Soap","bottles",10,5,2,0]],
weeks:0,checked:{},hours:{"Sample Volunteer A":12,"Sample Volunteer B":8,"Sample Volunteer C":4.5,"Sample Volunteer D":6},
pending:[{n:"Sample Student E",h:4,w:"School hours · Street handout"},{n:"Sample Student F",h:3.5,w:"School hours · Packing"}],
admins:{"Sample Volunteer A":true,"Sample Volunteer B":false,"Sample Volunteer C":false,"Sample Driver G":false},
routes:[{d:"Sample Driver G",stops:["Austin Street Center","The Stewpot","The Bridge North Texas"]},{d:"Sample Driver H",stops:["Family Gateway","Dallas Life Foundation"]}]}}
let S=JSON.parse(localStorage.getItem("maasOps")||"null")||fresh();const save=()=>localStorage.setItem("maasOps",JSON.stringify(S));
const $=id=>document.getElementById(id),esc=s=>String(s).replace(/[&<>"]/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c]));
let role=localStorage.getItem("maasOpsRole")||"Owner";$("role").value=role;
const SECTIONS=[["overview","🏠","Overview",["Owner","Admin","Volunteer"]],["menu","🍛","Menu & vendors",["Owner","Admin"]],["handout","🥪","Street handout",["Owner","Admin"]],
["inventory","📦","Inventory",["Owner","Admin"]],["team","👥","Volunteers & routes",["Owner","Admin","Volunteer"]],["kiosk","✅","Check-in kiosk",["Owner","Admin","Volunteer"]],["schedule","📅","Program schedules",["Owner","Admin","Volunteer"]]];
const can=()=>role!=="Volunteer";
function toast(t){const x=$("toast");x.textContent=t;x.style.display="block";clearTimeout(x._t);x._t=setTimeout(()=>x.style.display="none",3200)}
function low(){return S.inv.filter(i=>i[2]<i[3]*0.5||i[2]<i[4])}
function head(eb,t,right=""){return`<div class="top"><div><div class="eb">${eb}</div><h1>${t}</h1></div><div>${right}</div></div>`}
const V={
overview(){const l=low(),ci=Object.keys(S.checked).length;return head("This week","Overview",`<button class="btn o" onclick="resetDemo()">↺ Reset demo</button>`)+
`<div class="note">You are viewing as <b>${role}</b>. ${role=="Owner"?"Owners see everything, including who is an admin.":role=="Admin"?"Admins run menus, counts, supplies and routes, but can't change access.":"Volunteers see schedules, check-in and their hours only."}</div>
<div class="g g4"><div class="c k"><small>Saturday meals</small><b>${S.qty.toLocaleString()}</b><small>Maa's Meals · Sat 10 AM–12 PM</small></div>
<div class="c k"><small>Street sandwiches</small><b>${S.sand}</b><small>${S.sandSent?"Sent to store ✓":"Not confirmed yet"}</small></div>
<div class="c k"><small>Volunteers checked in</small><b>${ci} / ${PEOPLE.length}</b><small>Check-in opens Sat 9:30 AM</small></div>
<div class="c k"><small>Low supplies</small><b class="${l.length?"red":""}">${l.length}</b><small>${l.slice(0,3).map(i=>i[0]).join(", ")||"All good"}</small></div></div>
<div class="g g2"><div class="c"><h3>This week's timeline</h3><div class="tl">
<div><b>Thu 9:00 AM</b>Suggested menu made from the dish list</div><div><b>Thu – Mon 10:00 AM</b>Admins can edit menu and sandwich count</div>
<div><b>Mon 12:00 PM</b>Final menu + sandwich count sent to vendors ${S.sent?'<span class="tag ok">Sent (preview)</span>':""}</div><div><b>Sat 9:30 AM</b>Volunteer check-in opens · meals 10 AM–12 PM</div></div></div>
<div class="c"><h3>Pending approvals</h3>${!can()?'<p class="muted">Admins approve hours.</p>':S.pending.length?S.pending.map((p,i)=>`<div class="row"><div><b>${esc(p.n)}</b><div class="muted">${p.h} hrs · ${esc(p.w)}</div></div><div><button class="btn g" onclick="appr(${i},1)">✓</button> <button class="btn o" onclick="appr(${i},0)">✕</button></div></div>`).join(""):'<p class="muted">Nothing waiting.</p>'}</div></div>`},
menu(){const ed=can()&&!S.locked;return head("Week menu","Menu & vendors",can()?`<button class="btn" ${S.locked?"disabled":""} onclick="lockMenu()">Approve & lock menu</button>`:"")+
`<div class="note"><b>Suggested Thursday 9:00 AM.</b> Editable until <b>Monday 10:00 AM</b>, then sent to vendors at <b>12:00 PM</b>. ${S.locked?"<b>Menu locked.</b>":""}</div>
<div class="g g3">${Object.keys(DISHES).map(k=>`<div class="c"><div class="eb">${k}</div><select ${ed?"":"disabled"} onchange="S.menu['${k}']=this.value;save()" style="width:100%;margin-top:6px">${DISHES[k].map(d=>`<option ${S.menu[k]==d?"selected":""}>${d}</option>`).join("")}</select></div>`).join("")}
<div class="c"><div class="eb">Special (replaces menu)</div><select ${ed?"":"disabled"} onchange="S.special=this.value;save()" style="width:100%;margin-top:6px"><option value="">None</option>${SPECIALS.map(d=>`<option ${S.special==d?"selected":""}>${d}</option>`).join("")}</select></div></div>
<div class="c"><h3>Meals this Saturday</h3><input type="number" value="${S.qty}" ${ed?"":"disabled"} onchange="S.qty=+this.value;save()" style="width:140px"> meals</div>
<div class="c"><div class="top"><h3>Vendors</h3>${can()?`<button class="btn g" ${S.sent?"disabled":""} onclick="sendV()">${S.sent?"Sent ✓ (preview)":"Send to vendors (Mon 12 PM)"}</button>`:""}</div>
${VENDORS.map(v=>`<div class="row"><div><b>${esc(v.n)}</b><div class="muted">${esc(v.what)}</div></div><span class="tag pp">${v.day}</span></div>`).join("")}</div>`},
handout(){return head("Downtown street handout","Sandwich count")+`<div class="g g2"><div class="c"><div class="eb">This Saturday</div><div class="cnt" style="margin:12px 0">
<button ${can()?"":"disabled"} onclick="S.sand=Math.max(0,S.sand-10);S.sandSent=false;save();go()">−</button><b>${S.sand}</b><button ${can()?"":"disabled"} onclick="S.sand+=10;S.sandSent=false;save();go()">+</button><span class="muted">chicken sandwiches</span></div>
<p class="muted">Last week: ${S.sandHist[3][1]} · trending down from ${S.sandHist[0][1]} as we match real demand.</p>
${can()?`<button class="btn" ${S.sandSent?"disabled":""} onclick="S.sandSent=true;save();go();toast('Preview only: count of '+S.sand+' would be sent to the store. Nothing was sent.')">${S.sandSent?"Confirmed ✓ (preview)":"Confirm & send count to store"}</button>`:""}
<p class="muted">If not confirmed, last week's number is used Monday 12:00 PM.</p></div>
<div class="c"><h3>Recent history</h3>${S.sandHist.slice().reverse().map(h=>`<div class="row"><span>${h[0]}</span><b>${h[1]}</b></div>`).join("")}</div></div>`},
inventory(){return head("Supplies","Inventory",can()?`<button class="btn y" onclick="deduct()">Simulate 1 week of use</button>`:"")+
`<div class="note">Weekly use is deducted automatically after each Saturday. Weeks simulated: <b>${S.weeks}</b>. Stock numbers are samples — fill in real counts.</div>
<div class="c" style="overflow-x:auto"><table><tr><th>Item</th><th>Current</th><th>Ideal</th><th>Weekly use</th><th></th></tr>
${S.inv.map((i,n)=>{const lo=i[2]<i[3]*0.5||i[2]<i[4];return`<tr><td><b>${lo?"⚠️ ":""}${esc(i[0])}</b></td><td>${can()?`<input type="number" value="${i[2]}" style="width:70px" onchange="S.inv[${n}][2]=+this.value;save();go()">`:i[2]} ${i[1]}</td><td>${i[3]}</td><td>${i[4]}</td><td>${lo?'<span class="tag warn">Reorder soon</span>':'<span class="tag ok">In stock</span>'}</td></tr>`}).join("")}</table></div>`},
team(){const t=V._tab||"shifts",tabs=[["shifts","Shifts & check-ins"],["hours","Hours"],["routes","Driver routes"],["places","Delivery places"]].concat(role=="Owner"?[["access","Admin roles"]]:[]);
let b="";if(t=="shifts")b=`<div class="c"><h3>Saturday · Maa's Meals · 10 AM–12 PM</h3>${PEOPLE.map(p=>`<div class="row"><span>${p}</span><span class="tag ${S.checked[p]?"ok":"gold"}">${S.checked[p]?"Checked in "+S.checked[p]:"Not checked in"}</span></div>`).join("")}</div>`;
if(t=="hours")b=`<div class="c"><h3>Volunteer hours</h3>${Object.entries(S.hours).map(([p,h])=>`<div class="row"><span>${p}</span><b>${h} hrs</b></div>`).join("")}</div>`;
if(t=="routes")b=S.routes.map(r=>`<div class="c"><h3>🚗 ${r.d}</h3><ol>${r.stops.map(s=>`<li>${s} <span class="muted">${(SHELTERS.find(x=>x[0]==s)||[])[2]||""}</span></li>`).join("")}</ol></div>`).join("");
if(t=="places")b=`<div class="c" style="overflow-x:auto"><table><tr><th>Organization</th><th>Serves</th><th>Address</th></tr>${SHELTERS.map(s=>`<tr><td><b>${s[0]}</b></td><td>${s[1]}</td><td>${s[2]}</td></tr>`).join("")}</table><p class="muted">Public organizations from the App Breakdown sheet. Phone numbers left out of this preview.</p></div>`;
if(t=="access")b=`<div class="c"><h3>Admin roles (Owner only)</h3>${Object.entries(S.admins).map(([p,a])=>`<div class="row"><span>${p} ${a?'<span class="tag pp">Admin</span>':""}</span><button class="sw ${a?"on":""}" onclick="S.admins['${p}']=!S.admins['${p}'];save();go()" aria-label="toggle admin"></button></div>`).join("")}</div>`;
if(role=="Volunteer"&&!["shifts","hours"].includes(t)){V._tab="shifts";return V.team()}
return head("Team","Volunteers & routes")+`<div class="tabs">${tabs.filter(x=>role!="Volunteer"||["shifts","hours"].includes(x[0])).map(([k,n])=>`<button class="${k==t?"on":""}" onclick="V._tab='${k}';go()">${n}</button>`).join("")}</div>`+b},
kiosk(){return head("Saturday · Maa's Meals","Check-in kiosk")+`<div class="note">Tap your name to check in. Tap again to check out (adds 2 hours in this preview).</div>
<div class="kiosk">${PEOPLE.map(p=>`<button class="${S.checked[p]?"in":""}" onclick="kio('${p}')">${S.checked[p]?"✓ ":""}${p}</button>`).join("")}</div>`},
schedule(){return head("Programs","Program schedules")+`<div class="g g3">${PROGRAMS.map(p=>`<div class="c"><h3>${p.n}</h3><p><b>${p.d}</b><br>${p.t}</p><p class="muted">${p.x}<br>${p.loc}</p></div>`).join("")}</div>`}};
function go(){const id=(location.hash.slice(1)||"overview");const sec=SECTIONS.find(s=>s[0]==id&&s[3].includes(role))||SECTIONS[0];
$("nav").innerHTML=SECTIONS.filter(s=>s[3].includes(role)).map(s=>`<a href="#${s[0]}" class="${s==sec?"on":""}">${s[1]} ${s[2]}</a>`).join("");$("main").innerHTML=V[sec[0]]()}
function appr(i,ok){const p=S.pending.splice(i,1)[0];if(ok)S.hours[p.n]=(S.hours[p.n]||0)+p.h;save();go();toast(ok?"Hours approved":"Hours declined")}
function lockMenu(){S.locked=true;save();go();toast("Menu approved and locked")}
function sendV(){S.locked=true;S.sent=true;save();go();toast("Preview only: menu would be sent to "+VENDORS.length+" vendors. Nothing was sent.")}
function deduct(){S.inv.forEach(i=>i[2]=Math.max(0,i[2]-i[4]));S.weeks++;save();go();const l=low();toast("1 week deducted · "+l.length+" items need reordering")}
function kio(p){if(S.checked[p]){delete S.checked[p];S.hours[p]=(S.hours[p]||0)+2;toast(p+" checked out · +2 hrs")}else{S.checked[p]=new Date().toLocaleTimeString([],{hour:"numeric",minute:"2-digit"});toast(p+" checked in")}save();go()}
function resetDemo(){S=fresh();save();V._tab="shifts";go();toast("Demo reset")}
$("reset").onclick=resetDemo;$("role").onchange=e=>{role=e.target.value;localStorage.setItem("maasOpsRole",role);go()};addEventListener("hashchange",go);go();
if("serviceWorker"in navigator)navigator.serviceWorker.register("sw.js");
