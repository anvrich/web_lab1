let log = document.getElementById('input-log');

export function check(x, y, r) {
    log.innerHTML = "";
    log.classList.remove("success");

    if (validateX(x) && validateY(y) && validateR(r)) {
        showMessage("Все данные корректны!", true);
        return true;
    }
    return false;
}

export function validateX(x) {
    const parsedX = parseFloat(x);
    if (!isNaN(parsedX) && parsedX >= -3 && parsedX <= 3) {
        return true;
    } else {
        showMessage('Введите корректное значение для X в диапазоне от -3 до 3');
        return false;
    }
}

export function validateY(y) {
    if (!y) {
        showMessage('Выберите значение для Y');
        return false;
    }

    const parsedY = parseFloat(y);
    if (isNaN(parsedY) || parsedY < -3 || parsedY > 5) {
        showMessage('Введите корректное значение для Y в диапазоне от -3 до 5');
        return false;
    }
    return true;
}

export function validateR(r) {
    const collection = document.getElementsByClassName("r");
    let isSelected = false;

    for (let i = 0; i < collection.length; i++) {
        if (collection[i].checked) {
            isSelected = true;
            break;
        }
    }

    if (!isSelected) {
        showMessage('Выберите значение для R');
        return false;
    }

    return true;
}

function showMessage(message, isSuccess = false) {
    log.innerHTML = message;
    if (isSuccess) {
        log.classList.add("success");
    } else {
        log.classList.remove("success");
    }
    log.style.display = "block";
}
