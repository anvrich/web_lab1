let log = document.getElementById('input-log');

export function check(x, y, rValues) {
    clearLog();
    if (validateX(x) && validateY(y) && validateR(rValues)) {
        showMessage("Все данные корректны!", true);
        return true;
    }
    return false;
}

function validateX(x) {
    return validateNumber(x, -3, 3, 'Введите корректное значение для X в диапазоне от -3 до 3');
}

function validateY(y) {
    return validateNumber(y, -3, 5, 'Выберите корректное значение для Y из предложенных (-3 до 5)');
}

function validateR(rValues) {
    if (!Array.isArray(rValues) || rValues.length === 0) {
        showMessage('Выберите хотя бы одно значение для R');
        return false;
    }
    return rValues.every(r => validateNumber(r, 1, 5, 'Введите корректное значение для R в диапазоне от 1 до 5'));
}

function validateNumber(value, min, max, errorMessage) {
    const parsedValue = parseFloat(value);
    if (isNaN(parsedValue) || parsedValue < min || parsedValue > max) {
        showMessage(errorMessage);
        return false;
    }
    return true;
}

function showMessage(message, isSuccess = false) {
    log.innerHTML = message;
    log.classList.toggle("success", isSuccess);
    log.style.display = "block";
}

function clearLog() {
    log.innerHTML = "";
    log.classList.remove("success");
}
