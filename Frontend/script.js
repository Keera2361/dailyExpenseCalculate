const API = "http://localhost:8000/api/expenses";

if(!localStorage.getItem("token")){
window.location.href = "login.html";
}

let chart;

async function addExpense(){

const itemInput = document.getElementById("item");
const amountInput = document.getElementById("amount");

const item = itemInput.value;
const amount = amountInput.value;

if(!item || !amount){
alert("Please enter item and amount");
return;
};

await fetch(API+"/add",{
method:"POST",
headers:{
"Content-Type":"application/json"
},
body:JSON.stringify({item,amount})
});

itemInput.value = "";
amountInput.value = "";

loadExpenses();

};

async function deleteAllExpenses(){

    if(!confirm("Delete all expenses?")) return;

    await fetch(API + "/delete/all",{
    method:"DELETE"
    });

    loadExpenses();

};

async function deleteExpense(id){

await fetch(API + "/delete/" + id,{
method:"DELETE"
});

loadExpenses();

};

async function loadExpenses(){

const res = await fetch(API);
const data = await res.json();

const list = document.getElementById("expenseList");
list.innerHTML="";

let total = 0;

let monthlyData = {};

const today = new Date().toDateString();

data.forEach(expense => {

const expenseDate = new Date(expense.date).toDateString();

if(expenseDate !== today) return;

total += expense.amount;

const li = document.createElement("li");
li.innerHTML = `
${expense.item} - ₹${expense.amount}
<button onclick="deleteExpense('${expense._id}')">Delete</button>
`;

list.appendChild(li);

const month = new Date(expense.date).toLocaleString('default',{month:'short'});

if(!monthlyData[month]) monthlyData[month]=0;

monthlyData[month]+=expense.amount;

});

document.getElementById("total").innerText = total;

createChart(monthlyData);

};

function createChart(data){

const months = Object.keys(data);
const values = Object.values(data);

const ctx = document.getElementById("expenseChart");

if(chart) chart.destroy();

chart = new Chart(ctx,{
type:"bar",
data:{
labels:months,
datasets:[{
label:"Monthly Spending",
data:values
}]
}
});

};

loadExpenses();

function logout(){
    
    if(!localStorage.getItem("token")){
        window.location.href = "login.html";
        return;}

localStorage.removeItem("token");

window.location.href="login.html";

};