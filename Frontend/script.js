// Use deployed API endpoint
const API = 'https://dailyexpensecalculate.onrender.com/api/expenses';

if(!localStorage.getItem("token")){
    window.location.href = "login.html";
}

const TOKEN = localStorage.getItem("token");

// Display logged-in user's name if available
const USER_NAME = localStorage.getItem('name');
const userGreetingEl = document.getElementById('userGreeting');
if (userGreetingEl) {
    userGreetingEl.innerText = USER_NAME ? `Hello, ${USER_NAME}` : '';
}

// Loading overlay helper
const _loadingOverlay = document.getElementById('loadingOverlay');
function showLoading(){ if(_loadingOverlay) _loadingOverlay.style.display = 'flex'; }
function hideLoading(){ if(_loadingOverlay) _loadingOverlay.style.display = 'none'; }

let chart;

// Current date filter (defaults to today)
let filterDateObj;
// filterMode: 'all' | 'today' | 'date'
let filterMode = 'all';

// pre-fill date input with today's date (YYYY-MM-DD)
const _dateInput = document.getElementById("date");
if (_dateInput && !_dateInput.value) {
    _dateInput.value = new Date().toISOString().split('T')[0];
}

// initialize filterDateObj to the date input (or today)
filterDateObj = _dateInput && _dateInput.value ? new Date(_dateInput.value + 'T12:00:00') : new Date();

// toggle date input visibility when checkbox changes and update filter
const useDateCheckbox = document.getElementById('useDate');
if (useDateCheckbox) {
    useDateCheckbox.addEventListener('change', () => {
        if (_dateInput) _dateInput.style.display = useDateCheckbox.checked ? 'inline-block' : 'none';
        // set filter date to the selected date or to today
        if (useDateCheckbox.checked && _dateInput && _dateInput.value) {
            filterDateObj = new Date(_dateInput.value + 'T12:00:00');
            filterMode = 'date';
                updateFilterLabel();
        } else {
            filterDateObj = new Date();
            filterMode = 'today';
                updateFilterLabel();
        }
        loadExpenses();
    });
}

// update filter when the date input changes
if (_dateInput) {
    _dateInput.addEventListener('change', () => {
        if (_dateInput.value) filterDateObj = new Date(_dateInput.value + 'T12:00:00');
        // selecting a date implies date-filter mode
        filterMode = 'date';
        updateFilterLabel();
        loadExpenses();
    });
}

async function addExpense(){

const itemInput = document.getElementById("item");
const amountInput = document.getElementById("amount");
            showLoading();
const dateInput = document.getElementById("date");
const useDate = useDateCheckbox && useDateCheckbox.checked;

const item = itemInput.value.trim();
const amount = parseFloat(amountInput.value);
// Normalize user-picked dates to midday UTC to avoid timezone shifts
const dateValue = useDate && dateInput && dateInput.value
    ? new Date(dateInput.value + 'T12:00:00').toISOString()
    : new Date().toISOString();

if(!item || isNaN(amount)){
    alert("Please enter item and amount");
    return;
};

try{
    const res = await fetch(API + "/add", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": "Bearer " + TOKEN
        },
        body: JSON.stringify({ item, amount, date: dateValue })
    });

    const body = await res.json().catch(()=>null);
    if (!res.ok) {
        const msg = (body && body.message) ? body.message : `Server returned ${res.status}`;
        alert('Could not add expense: ' + msg);
        return;
    }

    // keep the selected date visible after adding when user used custom date
    itemInput.value = "";
    amountInput.value = "";
    if (useDate && dateInput && dateInput.value) {
        filterDateObj = new Date(dateInput.value + 'T12:00:00');
        // keep the date input value as-is (do not reset)
    } else {
        filterDateObj = new Date();
        // reset date input to today when not using custom date
        if (dateInput) dateInput.value = new Date().toISOString().split('T')[0];
    }

    updateFilterLabel();
    loadExpenses();

} catch (err) {
    console.error('Add expense error', err);
    alert('Network error: could not reach the server.');
}



};

async function deleteAllExpenses(){

    if(!confirm("Delete all expenses?")) return;

    await fetch(API + "/delete/all",{
    method:"DELETE",
    headers: {
        "Authorization": "Bearer " + TOKEN
    }
    });

    await loadExpenses();

};

async function deleteExpense(id){

await fetch(API + "/delete/" + id,{
method:"DELETE",
headers: {
    "Authorization": "Bearer " + TOKEN
}
});

    await loadExpenses();

};

async function loadExpenses(){
    showLoading();
    try {
        const res = await fetch(API, {
            headers: {
                "Authorization": "Bearer " + TOKEN
            }
        });
        const data = await res.json();

        const list = document.getElementById("expenseList");
        list.innerHTML = "";

        let total = 0;
        let monthlyData = {};

        // Apply filter mode
        const now = new Date();
        data.forEach(expense => {
            const expenseObj = new Date(expense.date);

            if (filterMode === 'date') {
                if (!filterDateObj) return;
                if (expenseObj.getFullYear() !== filterDateObj.getFullYear() ||
                    expenseObj.getMonth() !== filterDateObj.getMonth() ||
                    expenseObj.getDate() !== filterDateObj.getDate()) return;
            } else if (filterMode === 'today') {
                if (expenseObj.getFullYear() !== now.getFullYear() ||
                    expenseObj.getMonth() !== now.getMonth() ||
                    expenseObj.getDate() !== now.getDate()) return;
            }

            total += expense.amount;

            const li = document.createElement("li");
            const displayDate = expenseObj.toLocaleDateString();
            li.innerHTML = `\n${expense.item} - ₹${expense.amount} <span style="color:#666;font-size:0.9em;">(${displayDate})</span>\n<button class="btn btn-danger btn-small" onclick="deleteExpense('${expense._id}')">Delete</button>\n`;

            list.appendChild(li);

            const month = expenseObj.toLocaleString('default',{month:'short'});
            if(!monthlyData[month]) monthlyData[month]=0;
            monthlyData[month]+=expense.amount;
        });

        document.getElementById("total").innerText = total;
        createChart(monthlyData);

    } catch (err) {
        console.error('Load expenses error', err);
        alert('Could not load expenses.');
    } finally {
        hideLoading();
    }

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
const showAllBtn = document.getElementById('showAllBtn');
if (showAllBtn) {
    showAllBtn.addEventListener('click', () => {
        filterMode = 'all';
        // clear custom date UI
        if (useDateCheckbox) { useDateCheckbox.checked = false; }
        if (_dateInput) { _dateInput.style.display = 'none'; }
        updateFilterLabel();
        loadExpenses();
    });
}

// show initial label
updateFilterLabel();

function updateFilterLabel(){
    const label = document.getElementById('filterLabel');
    if (!label) return;
    if (filterMode === 'date' && filterDateObj){
        const opts = { day: 'numeric', month: 'short', year: 'numeric' };
        label.innerText = `Showing: ${filterDateObj.toLocaleDateString(undefined, opts)}`;
    } else if (filterMode === 'today'){
        label.innerText = 'Showing: Today';
    } else {
        label.innerText = 'Showing: All';
    }
}

function logout(){
    localStorage.removeItem("token");
    localStorage.removeItem("name");
    window.location.href = "login.html";
}