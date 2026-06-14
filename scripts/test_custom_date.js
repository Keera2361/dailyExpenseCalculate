const base = 'http://localhost:8000';

async function req(path, opts = {}){
  const res = await fetch(base + path, opts);
  const text = await res.text();
  try { return { status: res.status, body: JSON.parse(text) }; }
  catch(e){ return { status: res.status, body: text }; }
}

(async ()=>{
  try{
    const email = `customtest+${Date.now()}@example.com`;
    console.log('Registering', email);
    let r = await req('/api/user/register',{method:'POST', headers:{'Content-Type':'application/json'}, body:JSON.stringify({name:'Tester', email, password:'password'})});
    console.log('Register:', r.status, r.body);

    r = await req('/api/user/login',{method:'POST', headers:{'Content-Type':'application/json'}, body:JSON.stringify({email, password:'password'})});
    console.log('Login:', r.status, r.body);
    if(!r.body || !r.body.token){
      console.error('Login failed, aborting');
      process.exit(1);
    }
    const token = r.body.token;

    const expense = { item: 'CustomDateTest', amount: 12.34, date: '2026-02-02T12:00:00.000Z' };
    r = await req('/api/expenses/add',{method:'POST', headers:{'Content-Type':'application/json', 'Authorization':'Bearer '+token}, body:JSON.stringify(expense)});
    console.log('Add expense:', r.status, r.body);

    r = await req('/api/expenses', { headers: { 'Authorization': 'Bearer '+token } });
    console.log('Get expenses:', r.status, r.body);

  } catch (err){
    console.error('Test error', err);
    process.exit(1);
  }
})();
