import { check } from './validation.js';

let selectedY = null;

document.querySelectorAll('.y-btn').forEach(button => {
    button.addEventListener('click', function () {
        selectedY = this.getAttribute('data-value');
        document.querySelectorAll('.y-btn').forEach(btn => btn.classList.remove('active'));
        this.classList.add('active');
    });
});


document.getElementById('send').addEventListener('click', (e) => {
    e.preventDefault();

    const x = document.getElementById('x').value;
    const y = selectedY; // Используем выбранное значение Y
    const r = document.querySelector('input[name="r"]:checked')?.value || null;
console.log(x,y,r)
    if (!check(x, y, r)) {
        return;
    }

    fetch(`http://localhost:8080/calculate?x=${parseFloat(x)}&y=${parseFloat(y)}&r=${parseFloat(r)}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        }
    })
        .then(response => response.json())
        .then(parsedRes => {
            addRowToTable(parsedRes);
            saveResultToLocalStorage(parsedRes);
        })
        .catch(error => {
            console.error("Ошибка при обработке ответа сервера:", error);
            document.getElementById("input-log").innerText = 'Ошибка при обработке ответа сервера';
        });
});

function saveResultToLocalStorage(res) {
    const results = JSON.parse(localStorage.getItem("results") || "[]");
    results.push(res);
    localStorage.setItem("results", JSON.stringify(results));
}

window.addEventListener("load", () => {
    const savedResults = JSON.parse(localStorage.getItem("results") || "[]");
    savedResults.forEach(res => addRowToTable(res));
});

function addRowToTable(res) {
    const tbody = document.querySelector(".jsTableRes");
    const row = document.createElement("tr");
    const rowIndex = tbody.rows.length + 1;

    row.innerHTML = `
        <td>${rowIndex}</td>
        <td>${res.x}</td>
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

    const tbody = document.querySelector(".jsTableRes");
    tbody.innerHTML = "";
});

function handleCheckBox(elem) {
    if (elem.checked) {
        const collection = document.getElementsByClassName("r");
        for (let i = 0; i < collection.length; i++) {
            if (collection[i] !== elem) {
                collection[i].checked = false;
            }
        }
    }
}

document.querySelectorAll('.r').forEach(checkbox => {
    checkbox.addEventListener('change', (event) => handleCheckBox(event.target));
});







