const API = "https://dailyexpensecalculate.onrender.com/api/user";
// Loading overlay helper (per-page)
const _loadingOverlay = document.getElementById('loadingOverlay');
function showLoading(){ if(_loadingOverlay) _loadingOverlay.style.display = 'flex'; }
function hideLoading(){ if(_loadingOverlay) _loadingOverlay.style.display = 'none'; }

// Inline message helper (shows message in #authMessage if present)
function showMessage(text, type='error'){
	const el = document.getElementById('authMessage');
	if(!el){ alert(text); return; }
	el.className = 'auth-message ' + (type === 'success' ? 'success' : 'error');
	el.innerText = text;
	el.style.display = 'block';
	if(type === 'success'){
		setTimeout(()=>{ el.style.display = 'none'; }, 2000);
	} else {
		// keep error visible a little longer
		setTimeout(()=>{ el.style.display = 'none'; }, 5000);
	}
}

async function register(){
	const nameInput = document.getElementById("name");
	const emailInput = document.getElementById("email");
	const passwordInput = document.getElementById("password");

	const name = nameInput.value;
	const email = emailInput.value;
	const password = passwordInput.value;

	showLoading();
	try {
		const res = await fetch(API+"/register",{
			method:"POST",
			headers:{ "Content-Type":"application/json" },
			body:JSON.stringify({name,email,password})
		});
		const data = await res.json().catch(()=>({}));
		if(!res.ok){
			// try to extract field names from validation message
			const msg = data.message || 'Registration failed.';
			const fields = [];
			const re = /`([^`]+)`/g;
			let m;
			while((m = re.exec(msg)) !== null){ fields.push(m[1]); }
			if(fields.length) showMessage('Please provide: ' + fields.join(', '));
			else showMessage(msg || 'Registration failed.');
			return;
		}

		showMessage(data.message || 'Registered Successfully', 'success');
		nameInput.value = "";
		emailInput.value = "";
		passwordInput.value = "";
		setTimeout(()=>{ window.location.href = "login.html"; }, 800);
	} catch (err) {
		console.error('Register error', err);
		showMessage('Registration failed.');
	} finally {
		hideLoading();
	}
}

async function login(){
	const emailInput = document.getElementById("email");
	const passwordInput = document.getElementById("password");

	const email = emailInput.value;
	const password = passwordInput.value;

	showLoading();
	try {
		const res = await fetch(API + "/login",{
			method:"POST",
			headers:{ "Content-Type":"application/json" },
			body:JSON.stringify({email,password})
		});

		const data = await res.json().catch(()=>({}));
		if(!res.ok){
			const msg = data.message || 'Login failed.';
			// show friendly message
			showMessage(msg);
			return;
		}

		// success
		showMessage('Login successful', 'success');
		emailInput.value = "";
		passwordInput.value = "";
		localStorage.setItem("token", data.token);
		if (data.user && data.user.name) localStorage.setItem("name", data.user.name);
		setTimeout(()=>{ window.location.href = "index.html"; }, 600);
	} catch (err) {
		console.error('Login error', err);
		showMessage('Login failed.');
	} finally {
		hideLoading();
	}
}

// Toggle password visibility for inputs
function togglePassword(inputId, btn){
	const input = document.getElementById(inputId);
	if(!input) return;
	if(input.type === 'password'){
		input.type = 'text';
		if(btn) btn.innerText = 'Hide';
	} else {
		input.type = 'password';
		if(btn) btn.innerText = 'Show';
	}
}