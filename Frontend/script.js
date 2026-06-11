const API = "http://localhost:8000/api/expenses";

if(!localStorage.getItem("token")){
    window.location.href = "login.html";
}

const TOKEN = localStorage.getItem("token");

let chart;

// pre-fill date input with today's date (YYYY-MM-DD)
const _dateInput = document.getElementById("date");
if (_dateInput && !_dateInput.value) {
    _dateInput.value = new Date().toISOString().split('T')[0];
}

// toggle date input visibility when checkbox changes
const useDateCheckbox = document.getElementById('useDate');
if (useDateCheckbox) {
    useDateCheckbox.addEventListener('change', () => {
        if (_dateInput) _dateInput.style.display = useDateCheckbox.checked ? 'inline-block' : 'none';
    });
}

async function addExpense(){

const itemInput = document.getElementById("item");
const amountInput = document.getElementById("amount");
const dateInput = document.getElementById("date");
const useDate = useDateCheckbox && useDateCheckbox.checked;

const item = itemInput.value.trim();
const amount = parseFloat(amountInput.value);
const dateValue = useDate && dateInput && dateInput.value ? new Date(dateInput.value).toISOString() : new Date().toISOString();

if(!item || isNaN(amount)){
    alert("Please enter item and amount");
    return;
};

await fetch(API+"/add",{
    method:"POST",
    headers:{
        "Content-Type":"application/json",
        "Authorization": "Bearer " + TOKEN
    },
    body:JSON.stringify({item,amount,date: dateValue})
});

itemInput.value = "";
amountInput.value = "";
if(dateInput) dateInput.value = new Date().toISOString().split('T')[0];
if(useDateCheckbox) { useDateCheckbox.checked = false; if(_dateInput) _dateInput.style.display = 'none'; }

loadExpenses();

};

async function deleteAllExpenses(){

    if(!confirm("Delete all expenses?")) return;

    await fetch(API + "/delete/all",{
    method:"DELETE",
    headers: {
        "Authorization": "Bearer " + TOKEN
    }
    });

    loadExpenses();

};

async function deleteExpense(id){

await fetch(API + "/delete/" + id,{
method:"DELETE",
headers: {
    "Authorization": "Bearer " + TOKEN
}
});

loadExpenses();

};

async function loadExpenses(){

const res = await fetch(API, {
    headers: {
        "Authorization": "Bearer " + TOKEN
    }
});
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
const displayDate = new Date(expense.date).toLocaleDateString();
li.innerHTML = `
${expense.item} - ₹${expense.amount} <span style="color:#666;font-size:0.9em;">(${displayDate})</span>
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