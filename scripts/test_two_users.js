const base = 'http://localhost:8000';

async function req(path, opts = {}){
  const res = await fetch(base + path, opts);
  const text = await res.text();
  try { return { status: res.status, body: JSON.parse(text) }; }
  catch(e){ return { status: res.status, body: text }; }
}

(async ()=>{
  try{
    // User A
    const emailA = `userA+${Date.now()}@example.com`;
    await req('/api/user/register',{method:'POST', headers:{'Content-Type':'application/json'}, body:JSON.stringify({name:'UserA', email:emailA, password:'password'})});
    let rA = await req('/api/user/login',{method:'POST', headers:{'Content-Type':'application/json'}, body:JSON.stringify({email:emailA, password:'password'})});
    const tokenA = rA.body.token;

    // User B
    const emailB = `userB+${Date.now()}@example.com`;
    await req('/api/user/register',{method:'POST', headers:{'Content-Type':'application/json'}, body:JSON.stringify({name:'UserB', email:emailB, password:'password'})});
    let rB = await req('/api/user/login',{method:'POST', headers:{'Content-Type':'application/json'}, body:JSON.stringify({email:emailB, password:'password'})});
    const tokenB = rB.body.token;

    // Add expenses
    await req('/api/expenses/add',{method:'POST', headers:{'Content-Type':'application/json','Authorization':'Bearer '+tokenA}, body:JSON.stringify({item:'A-expense', amount:10})});
    await req('/api/expenses/add',{method:'POST', headers:{'Content-Type':'application/json','Authorization':'Bearer '+tokenB}, body:JSON.stringify({item:'B-expense', amount:20})});

    // Fetch expenses for each
    const resA = await req('/api/expenses',{headers:{'Authorization':'Bearer '+tokenA}});
    const resB = await req('/api/expenses',{headers:{'Authorization':'Bearer '+tokenB}});

    console.log('User A expenses:', resA.status, resA.body);
    console.log('User B expenses:', resB.status, resB.body);

  } catch (err){
    console.error('Test error', err);
    process.exit(1);
  }
})();
