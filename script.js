/* ============================
   MOBILE MENU
============================ */
const burger = document.getElementById("burgerBtn");

if (burger) {
    burger.addEventListener("click", () => {
        document.body.classList.toggle("menu-open");
    });
}

/* ============================
   LANGUAGE SYSTEM (через lang.js)
============================ */

// Кнопки языка
document.querySelectorAll("[data-setlang]").forEach(btn => {
    btn.addEventListener("click", () => {
        const lang = btn.getAttribute("data-setlang");
        localStorage.setItem("lang", lang);
        applyLang();

        // Обновляем каталог, если мы на catalog.html
        if (document.body.dataset.page === "catalog") {
            location.reload();
        }
    });
});

// Применяем язык при загрузке
applyLang();

/* ============================
   CURRENCY SYSTEM
============================ */

const currencyButtons = document.querySelectorAll("[data-currency]");

// Правильные курсы валют
const rates = {
    PLN: 1,
    EUR: 1 / 4.30,
    USD: 1 / 3.95
};

function convertPrices(currency) {
    localStorage.setItem("currency", currency);

    // Конвертация цен в каталоге
    document.querySelectorAll("[data-price]").forEach(el => {
        const base = parseFloat(el.dataset.price);
        const converted = (base * rates[currency]).toFixed(2);
        el.textContent = `${converted} ${currency}`;
    });

    // Конвертация цены на странице товара
    const productPrice = document.getElementById("productPrice");
    if (productPrice && productPrice.dataset.base) {
        const base = parseFloat(productPrice.dataset.base);
        productPrice.textContent = `${(base * rates[currency]).toFixed(2)} ${currency}`;
    }
}

currencyButtons.forEach(btn => {
    btn.addEventListener("click", () => {
        convertPrices(btn.dataset.currency);

        // Обновляем каталог, если мы на catalog.html
        if (document.body.dataset.page === "catalog") {
            location.reload();
        }
    });
});

// Применяем валюту при загрузке
convertPrices(localStorage.getItem("currency") || "PLN");
