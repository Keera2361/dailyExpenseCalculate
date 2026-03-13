const API = "http://localhost:8000/api/user";

async function register(){

const nameInput = document.getElementById("name");
const emailInput = document.getElementById("email");
const passwordInput = document.getElementById("password");

const name = nameInput.value;
const email = emailInput.value;
const password = passwordInput.value;

const res = await fetch(API+"/register",{
method:"POST",
headers:{
"Content-Type":"application/json"
},
body:JSON.stringify({name,email,password})
});

const data = await res.json();

alert(data.message || "Registered Successfully");

nameInput.value = "";
emailInput.value = "";
passwordInput.value = "";

window.location.href="login.html";

}

async function login(){

const emailInput = document.getElementById("email");
const passwordInput = document.getElementById("password");

const email = emailInput.value;
const password = passwordInput.value;

const res = await fetch(API + "/login",{
method:"POST",
headers:{
"Content-Type":"application/json"
},
body:JSON.stringify({email,password})
});

const data = await res.json();

if(!data.token){
alert(data.message || "Login Failed");
return;
}

alert("Login Successful");

emailInput.value = "";
passwordInput.value = "";

localStorage.setItem("token", data.token);

window.location.href = "index.html";

}