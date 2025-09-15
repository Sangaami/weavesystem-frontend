
const sampleUsers = [
  {role:'manager', user:'manager', pass:'mgr123'},
  {role:'weaver', user:'weaver', pass:'weave123'},
  {role:'customer', user:'customer', pass:'cust123'}
];
if(!localStorage.getItem('weavers')) localStorage.setItem('weavers', JSON.stringify([]));
if(!localStorage.getItem('inventory')) localStorage.setItem('inventory', JSON.stringify([]));
if(!localStorage.getItem('orders')) localStorage.setItem('orders', JSON.stringify([]));

function login(e){
  e.preventDefault();
  const role = document.getElementById('role').value;
  const user = document.getElementById('username').value.trim();
  const pass = document.getElementById('password').value.trim();
  const ok = sampleUsers.find(u=>u.role===role && u.user===user && u.pass===pass);
  const msg = document.getElementById('loginMsg');
  if(ok){
    localStorage.setItem('currentUser', JSON.stringify({role, user}));
    if(role==='manager') window.location.href='manager.html';
    if(role==='weaver') window.location.href='weaver.html';
    if(role==='customer') window.location.href='customer.html';
  } else {
    msg.textContent='Invalid credentials for selected role.';
    msg.classList.add('warn');
  }
}
function logout(){
  localStorage.removeItem('currentUser');
  window.location.href='index.html';
}
function mgr_init(){
  const cur = JSON.parse(localStorage.getItem('currentUser')||'null');
  if(!cur || cur.role!=='manager') { window.location.href='index.html'; return; }
  document.getElementById('mgrHero').style.backgroundImage='url(images/bg_manager.svg)';
  renderWeavers(); renderInventory(); renderStats();
}
function addWeaverMgr(){
  const name = document.getElementById('mgr_wname').value.trim();
  const skill = document.getElementById('mgr_wskill').value.trim();
  const rate = parseFloat(document.getElementById('mgr_wr').value)||0;
  if(!name){ alert('Enter name'); return; }
  const weavers = JSON.parse(localStorage.getItem('weavers'));
  weavers.push({id:Date.now(), name, skill, rate, production:0, attendance:0});
  localStorage.setItem('weavers', JSON.stringify(weavers));
  renderWeavers(); renderStats();
  document.getElementById('mgr_wname').value='';
}
function renderWeavers(){
  const list = JSON.parse(localStorage.getItem('weavers'));
  const tbody = document.getElementById('weaver_list');
  tbody.innerHTML='';
  list.forEach(w=>{
    const tr = document.createElement('tr');
    tr.innerHTML = `<td>${w.name}</td><td>${w.skill}</td><td>${w.production}</td><td>${w.attendance}</td><td>${w.rate||0}</td>
      <td><button class="btn" onclick="mgr_addProduction(${w.id})">+Prod</button>
      <button class="btn secondary" onclick="mgr_markAttendance(${w.id})">Attend</button>
      <button class="btn" onclick="mgr_removeWeaver(${w.id})">Remove</button></td>`;
    tbody.appendChild(tr);
  });
}
function mgr_addProduction(id){
  const units = parseInt(prompt('Units to add:', '1')||'0');
  if(!units) return;
  const weavers = JSON.parse(localStorage.getItem('weavers'));
  const w = weavers.find(x=>x.id===id);
  w.production += units;
  localStorage.setItem('weavers', JSON.stringify(weavers));
  renderWeavers(); renderStats();
}
function mgr_markAttendance(id){
  const weavers = JSON.parse(localStorage.getItem('weavers'));
  const w = weavers.find(x=>x.id===id);
  w.attendance += 1;
  localStorage.setItem('weavers', JSON.stringify(weavers));
  renderWeavers(); renderStats();
}
function mgr_removeWeaver(id){
  if(!confirm('Remove weaver?')) return;
  let weavers = JSON.parse(localStorage.getItem('weavers'));
  weavers = weavers.filter(w=>w.id!==id);
  localStorage.setItem('weavers', JSON.stringify(weavers));
  renderWeavers(); renderStats();
}
function addInventory(){
  const name = document.getElementById('inv_name').value.trim();
  const qty = parseInt(document.getElementById('inv_qty').value)||0;
  if(!name){ alert('Enter item'); return; }
  const inv = JSON.parse(localStorage.getItem('inventory'));
  inv.push({id:Date.now(), name, qty});
  localStorage.setItem('inventory', JSON.stringify(inv));
  renderInventory(); renderStats();
  document.getElementById('inv_name').value=''; document.getElementById('inv_qty').value='';
}
function renderInventory(){
  const inv = JSON.parse(localStorage.getItem('inventory'));
  const tbody = document.getElementById('inv_list'); tbody.innerHTML='';
  inv.forEach(i=>{
    const tr = document.createElement('tr');
    tr.innerHTML = `<td>${i.name}</td><td>${i.qty}</td><td><button class="btn" onclick="mgr_removeInventory(${i.id})">Remove</button></td>`;
    tbody.appendChild(tr);
  });
}
function mgr_removeInventory(id){
  let inv = JSON.parse(localStorage.getItem('inventory'));
  inv = inv.filter(x=>x.id!==id); localStorage.setItem('inventory', JSON.stringify(inv));
  renderInventory(); renderStats();
}
function renderStats(){
  const weavers = JSON.parse(localStorage.getItem('weavers'));
  const inv = JSON.parse(localStorage.getItem('inventory'));
  const orders = JSON.parse(localStorage.getItem('orders'));
  document.getElementById('stat_weavers').textContent = weavers.length;
  const totalProd = weavers.reduce((s,w)=>s + (w.production||0), 0);
  document.getElementById('stat_prod').textContent = totalProd;
  document.getElementById('stat_stock').textContent = inv.reduce((s,i)=>s + (i.qty||0),0);
  document.getElementById('stat_sales').textContent = orders.reduce((s,o)=>s + (o.qty||0),0);
}
function wv_init(){
  const cur = JSON.parse(localStorage.getItem('currentUser')||'null');
  if(!cur || cur.role!=='weaver') { window.location.href='index.html'; return; }
  document.getElementById('wvHero').style.backgroundImage='url(images/bg_weaver.svg)';
  renderWeaverProfile();
}
function renderWeaverProfile(){
  const weavers = JSON.parse(localStorage.getItem('weavers'));
  const w = weavers[0] || {name:'No weaver', skill:'-', production:0, attendance:0, rate:0};
  document.getElementById('wv_name').textContent = w.name;
  document.getElementById('wv_skill').textContent = w.skill;
  document.getElementById('wv_prod').textContent = w.production;
  document.getElementById('wv_att').textContent = w.attendance;
  document.getElementById('wv_wage').textContent = w.rate || 0;
}
function wv_markPresent(){
  const weavers = JSON.parse(localStorage.getItem('weavers'));
  if(weavers.length===0){ alert('No weavers added by manager'); return; }
  weavers[0].attendance +=1;
  localStorage.setItem('weavers', JSON.stringify(weavers));
  renderWeaverProfile(); 
  alert('Attendance marked!');
}
function wv_addProduction(){
  const val = parseInt(document.getElementById('wv_addprod').value)||0;
  if(!val){ alert('Enter units'); return; }
  const weavers = JSON.parse(localStorage.getItem('weavers'));
  if(weavers.length===0){ alert('No weavers'); return; }
  weavers[0].production += val;
  localStorage.setItem('weavers', JSON.stringify(weavers));
  renderWeaverProfile();
  document.getElementById('wv_addprod').value='';
}
function cust_init(){
  const cur = JSON.parse(localStorage.getItem('currentUser')||'null');
  if(!cur || cur.role!=='customer') { window.location.href='index.html'; return; }
  document.getElementById('custHero').style.backgroundImage='url(images/bg_customer.svg)';
  renderProducts();
  renderOrders();
}
function addOrderCust(){
  const name = document.getElementById('cust_name').value.trim();
  const prod = document.getElementById('cust_prod').value.trim();
  const qty = parseInt(document.getElementById('cust_qty').value)||0;
  if(!name || !prod || !qty){ alert('Fill fields'); return; }
  const orders = JSON.parse(localStorage.getItem('orders'));
  orders.push({id:Date.now(), name, prod, qty});
  localStorage.setItem('orders', JSON.stringify(orders));
  renderOrders(); renderProducts(); 
  alert('Order placed!');
  document.getElementById('cust_name').value=''; document.getElementById('cust_prod').value=''; document.getElementById('cust_qty').value='';
}
function renderOrders(){
  const orders = JSON.parse(localStorage.getItem('orders'));
  const tbody = document.getElementById('order_list'); tbody.innerHTML='';
  orders.forEach(o=>{
    const tr = document.createElement('tr');
    tr.innerHTML = `<td>${o.name}</td><td>${o.prod}</td><td>${o.qty}</td>`;
    tbody.appendChild(tr);
  });
}
function renderProducts(){
  const inv = JSON.parse(localStorage.getItem('inventory'));
  const tbody = document.getElementById('product_list'); tbody.innerHTML='';
  inv.forEach(i=>{
    const tr = document.createElement('tr');
    tr.innerHTML = `<td>${i.name}</td><td>${i.qty}</td>`;
    tbody.appendChild(tr);
  });
}
