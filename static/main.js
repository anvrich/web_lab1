import { check } from './validation.js';

let y = null;
document.querySelectorAll('.y-btn').forEach(button => {
    button.addEventListener('click' , () => {
        y = button.getAttribute('data-value');
        document.querySelectorAll(".y-btn").forEach(btn => btn.classList.remove('active'));
        button.classList.add('active')
    })
})

document.getElementById('send').addEventListener('click', async (e) => {
    e.preventDefault();
    const xInput = document.getElementById('x').value;
    const x = xInput.replace(',','.');
    const r =  Array.from(document.querySelectorAll('input[name="r"]:checked')).map(input => input.value);
    if (!check(x, y, r)) return;
    try {
        const results = await fetchResults(x, y, r);
        results.forEach(res => {
            res.originalX = xInput;
            addRowToTable(res);
            saveResultToLocalStorage(res);
        });
    } catch (error) {
        showError('Ошибка при обработке ответа сервера');
    }
});

window.addEventListener("load", () => {
    const savedResults = JSON.parse(localStorage.getItem("results") || "[]");
    savedResults.forEach(addRowToTable);
});

async function fetchResults(x, y, rValues) {
    const promises = rValues.map(r =>
        fetch(`http://localhost:8080/calculate?x=${parseFloat(x)}&y=${parseInt(y)}&r=${parseInt(r)}`, {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' },
        }).then(res => res.json())
    );
    return Promise.all(promises);
}

function saveResultToLocalStorage(res) {
    const results = JSON.parse(localStorage.getItem("results") || "[]");
    results.push(res);
    localStorage.setItem("results", JSON.stringify(results));
}

function addRowToTable(res) {
    const tbody = document.querySelector(".jsTableRes");
    const row = document.createElement("tr");

    row.innerHTML = `
        <td>${tbody.rows.length + 1}</td>
        <td>${res.originalX || res.x}</td>
        <td>${res.y}</td>
        <td>${res.r}</td>
        <td>${res.result === "true" ? "Точно в цель" : "Промах"}</td>
        <td>${res.time}</td>
        <td>${res.workTime}</td>
    `;
    tbody.appendChild(row);
}

document.getElementById('clear-storage').addEventListener('click', () => {
    localStorage.removeItem("results");
    document.querySelector(".jsTableRes").innerHTML = "";
});

function showError(message) {
    document.getElementById("input-log").innerText = message;
}
