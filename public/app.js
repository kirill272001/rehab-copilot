const form = document.querySelector("#case-form");
const fieldset = document.querySelector("#case-fields");
const saveButton = document.querySelector("#save-button");
const formStatus = document.querySelector("#form-status");
const listStatus = document.querySelector("#list-status");
const caseList = document.querySelector("#case-list");
const detailsStatus = document.querySelector("#details-status");
const caseDetails = document.querySelector("#case-details");
const refreshButton = document.querySelector("#refresh-button");

const fieldNames = ["title", "age", "symptoms", "patientHistory"];

const errorMessages = {
    "Must be a string": "Введіть текст.",
    "Must not be empty": "Заповніть це поле.",
    "Must be an integer": "Введіть ціле число.",
    "Must be between 18 and 120": "Вік має бути від 18 до 120 років.",
    "Must not exceed 100 characters": "Максимум 100 символів.",
    "Must not exceed 3000 characters": "Максимум 3000 символів.",
    "Must not exceed 5000 characters": "Максимум 5000 символів.",
};

let saving = false;
let listRequestNumber = 0;
let detailsRequestNumber = 0;

function formatDate(value) {
    return new Date(value).toLocaleString("uk-UA");
}

function clearFieldErrors() {
    for (const name of fieldNames) {
        document.getElementById(`${name}-error`).textContent = "";
        document.getElementById(name).removeAttribute("aria-invalid");
    }
}

function showFieldErrors(errors) {
    for (const name of fieldNames) {
        const message = errors[name];

        if (message) {
            document.getElementById(`${name}-error`).textContent =
                errorMessages[message] ?? message;

            document.getElementById(name).setAttribute("aria-invalid", "true");
        }
    }
}

function showDetails(item) {
    caseDetails.replaceChildren();

    const fields = [
        ["Назва", item.title],
        ["Вік", item.age],
        ["Скарги", item.symptoms],
        ["Анамнез", item.patientHistory],
        ["ID", item.id],
        ["Створено", formatDate(item.createdAt)],
    ];

    for (const [label, value] of fields) {
        const term = document.createElement("dt");
        const description = document.createElement("dd");

        term.textContent = label;
        description.textContent = String(value);

        caseDetails.append(term, description);
    }
}

async function openCase(id) {
    const requestNumber = ++detailsRequestNumber;

    caseDetails.replaceChildren();
    detailsStatus.textContent = "Завантаження випадку…";

    try {
        const response = await fetch(`/cases/${encodeURIComponent(id)}`);

        // Поздний ответ на предыдущий выбор не должен менять экран.
        if (requestNumber !== detailsRequestNumber) return;

        if (!response.ok) {
            detailsStatus.textContent =
                response.status === 404
                    ? "Цей випадок не знайдено."
                    : "Не вдалося відкрити випадок. Спробуйте ще раз.";
            return;
        }

        const item = await response.json();

        if (requestNumber !== detailsRequestNumber) return;

        showDetails(item);
        detailsStatus.textContent = "";
    } catch {
        if (requestNumber !== detailsRequestNumber) return;

        detailsStatus.textContent =
            "Немає зв’язку із сервером. Перевірте, чи він працює.";
    }
}

async function loadCases() {
    const requestNumber = ++listRequestNumber;

    listStatus.textContent = "Завантаження списку…";
    caseList.replaceChildren();

    try {
        const response = await fetch("/cases");

        if (!response.ok) {
            throw new Error("Failed to load cases");
        }

        const items = await response.json();

        if (requestNumber !== listRequestNumber) return;

        listStatus.textContent =
            items.length === 0 ? "Збережених випадків поки немає." : "";

        for (const item of items) {
            const li = document.createElement("li");
            const button = document.createElement("button");
            const title = document.createElement("strong");
            const meta = document.createElement("span");

            button.type = "button";
            button.className = "case-button";
            meta.className = "case-meta";

            title.textContent = item.title;
            meta.textContent =
                `Вік: ${item.age} · ${formatDate(item.createdAt)}`;

            button.append(title, meta);
            button.addEventListener("click", () => openCase(item.id));
            li.append(button);
            caseList.append(li);
        }
    } catch {
        if (requestNumber !== listRequestNumber) return;

        listStatus.textContent =
            "Не вдалося завантажити список. Перевірте сервер і натисніть «Оновити».";
    }
}

form.addEventListener("submit", async (event) => {
    // Отправляем данные своим кодом, без перезагрузки страницы.
    event.preventDefault();

    if (saving) return;

    clearFieldErrors();

    const ageText = document.getElementById("age").value;

    const input = {
        title: document.getElementById("title").value,
        age: ageText === "" ? null : Number(ageText),
        symptoms: document.getElementById("symptoms").value,
        patientHistory: document.getElementById("patientHistory").value,
    };

    saving = true;
    fieldset.disabled = true;
    saveButton.textContent = "Збереження…";
    formStatus.textContent = "Надсилаємо дані на сервер…";

    try {
        const response = await fetch("/cases", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(input),
        });

        const data = await response.json();

        if (!response.ok) {
            showFieldErrors(data.errors ?? {});
            formStatus.textContent =
                response.status === 400
                    ? "Виправте помилки. Введені дані залишилися у формі."
                    : "Сервер не зміг зберегти випадок. Дані залишилися у формі.";
            return;
        }

        form.reset();
        formStatus.textContent = "Випадок збережено.";

        // Не позволяем старому запросу заменить только что созданный случай.
        detailsRequestNumber++;
        showDetails(data);
        detailsStatus.textContent = "";

        await loadCases();
    } catch {
        formStatus.textContent =
            "Не вдалося підтвердити збереження. Дані залишилися у формі. " +
            "Перед повторною спробою оновіть список — випадок міг зберегтися.";
    } finally {
        saving = false;
        fieldset.disabled = false;
        saveButton.textContent = "Зберегти випадок";

        form.querySelector('[aria-invalid="true"]')?.focus();
    }
});

refreshButton.addEventListener("click", loadCases);
loadCases();