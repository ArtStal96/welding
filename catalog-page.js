// ============================
// АВТО-ПЕРЕВОД НАЗВАНИЙ
// ============================
async function autoTranslate(text, targetLang) {
    if (!text) return "";
    const res = await fetch(
        `https://api.mymemory.translated.net/get?q=${encodeURIComponent(text)}&langpair=ru|${targetLang}`
    );
    const data = await res.json();
    return data.responseData.translatedText || text;
}

// ============================
// ПРАВИЛЬНЫЕ КУРСЫ ВАЛЮТ
// ============================
const catalogRates = {
    PLN: 1,
    EUR: 1 / 4.20,
    USD: 1 / 3.95
};

function convertCatalogPrice(pricePLN, currency) {
    return (pricePLN * catalogRates[currency]).toFixed(2);
}

// ============================
// ЗАГРУЗКА КАТАЛОГА
// ============================
document.addEventListener("DOMContentLoaded", async () => {
    const grid = document.getElementById("catalogGrid");
    const loader = document.getElementById("catalogLoader");

    const lang = localStorage.getItem("lang") || "ru";
    const currency = localStorage.getItem("currency") || "PLN";

    // Проверяем, что product-data.js загружен
    if (!window.products || !Array.isArray(products)) {
        console.error("Ошибка: products не найден.");
        loader.innerHTML = "<p>Ошибка загрузки каталога</p>";
        return;
    }

    // Показываем лоадер
    loader.style.display = "flex";

    // Небольшая задержка для плавности
    await new Promise(res => setTimeout(res, 200));

    // Очищаем каталог
    grid.innerHTML = "";

    // Создаём карточки товаров
    for (const product of products) {

        // 🔥 Переводим название
        let translatedName = product.name;
        if (lang !== "ru") {
            translatedName = await autoTranslate(product.name, lang);
        }

        // 🔥 Конвертация цены
        const convertedPrice = convertCatalogPrice(product.price, currency);

        const card = document.createElement("div");
        card.className = "product-card";

        card.innerHTML = `
            <img src="${product.img_main}" alt="${translatedName}" class="catalog-img">

            <h3 class="catalog-name">${translatedName}</h3>

            <p class="catalog-price" data-price="${product.price}">
                ${convertedPrice} ${currency}
            </p>

            <a href="product.html?id=${product.id}" 
               class="catalog-btn" 
               data-lang="more">
               ${LANG[lang].more}
            </a>
        `;

        grid.appendChild(card);
    }

    // Убираем загрузчик
    loader.style.display = "none";

    // Применяем перевод UI
    applyLang();
});

// ============================
// ПЕРЕКОНВЕРТАЦИЯ ЦЕН ПРИ СМЕНЕ ВАЛЮТЫ
// ============================
function convertCatalogPrices() {
    const currency = localStorage.getItem("currency") || "PLN";

    document.querySelectorAll(".catalog-price").forEach(el => {
        const base = parseFloat(el.dataset.price);
        const converted = convertCatalogPrice(base, currency);
        el.textContent = `${converted} ${currency}`;
    });
}

// ============================
// СКРЫТИЕ ЛОАДЕРА
// ============================
window.addEventListener("load", () => {
    const loader = document.getElementById("catalogLoader");
    if (!loader) return;

    loader.style.opacity = "0";

    setTimeout(() => {
        loader.style.display = "none";
    }, 400);
});
// Открытие формы
document.getElementById("checkoutBtn")?.addEventListener("click", () => {
    const cart = loadCart();

    if (cart.length === 0) {
        alert("Корзина пуста");
        return;
    }

    document.getElementById("orderForm").style.display = "block";
    window.scrollTo(0, document.body.scrollHeight);
});

