// ============================
// АВТО-ПЕРЕВОД ТЕКСТОВЫХ ПОЛЕЙ
// ============================
async function autoTranslate(text, targetLang) {
    if (!text) return "";
    const res = await fetch(
        `https://api.mymemory.translated.net/get?q=${encodeURIComponent(text)}&langpair=ru|${targetLang}`
    );
    const data = await res.json();
    return data.responseData.translatedText || text;
}

async function translateTextFields(product) {
    const lang = localStorage.getItem("lang") || "ru";
    if (lang === "ru") return product;

    const translated = { ...product };

    // Основные поля
    translated.name = await autoTranslate(product.name, lang);
    translated.description = await autoTranslate(product.description, lang);
    translated.purpose = await autoTranslate(product.purpose, lang);
    translated.shape = await autoTranslate(product.shape, lang);

    // 🔥 Перевод характеристик
    translated.material = await autoTranslate(product.material, lang);
    translated.top_color = await autoTranslate(product.top_color, lang);
    translated.leg_material = await autoTranslate(product.leg_material, lang);
    translated.legs_color = await autoTranslate(product.legs_color, lang);

    return translated;
}

// ============================
// POPUP
// ============================
function showAddedPopup() {
    const popup = document.getElementById("addedPopup");
    popup.classList.add("show");
    setTimeout(() => popup.classList.remove("show"), 2000);
}

// ============================
// ОСНОВНОЙ КОД
// ============================
(async () => {

    const urlParams = new URLSearchParams(window.location.search);
    const productId = parseInt(urlParams.get("id"));

    let product = window.products.find(p => p.id === productId);

    if (!product) {
        document.body.innerHTML = `
            <h1 style="color:white;text-align:center;margin-top:120px;">
                Товар не найден
            </h1>`;
        return;
    }

    // Переводим текстовые поля
    product = await translateTextFields(product);

    // Название
    document.getElementById("productName").textContent = product.name;

    // Цена
    const priceEl = document.getElementById("productPrice");
    priceEl.dataset.base = product.price;

    // Устанавливаем цену в текущей валюте
    const currency = localStorage.getItem("currency") || "PLN";
    const rates = { PLN: 1, EUR: 1 / 4.30, USD: 1 / 3.95 };
    priceEl.textContent = (product.price * rates[currency]).toFixed(2) + " " + currency;

    // Основное изображение
    const mainImg = document.getElementById("productImg");
    mainImg.src = product.img_main;
    mainImg.alt = product.name;

    // Галерея
    const galleryContainer = document.getElementById("gallery");

    const galleryImages = [
        product.img_main,
        product.img_1,
        product.img_2,
        product.img_3,
        product.img_4,
        product.img_5,
        product.img_6,
        product.img_7,
        product.img_8,
        product.img_9,
        product.img_10
    ].filter(src => src && src.trim() !== "");

    galleryImages.forEach((src, index) => {
        const img = document.createElement("img");
        img.src = src;
        img.classList.add("thumb");
        if (index === 0) img.classList.add("active");

        img.addEventListener("click", () => {
            mainImg.classList.add("fade");
            setTimeout(() => {
                mainImg.src = src;
                mainImg.classList.remove("fade");
            }, 200);

            document.querySelectorAll(".thumb").forEach(t => t.classList.remove("active"));
            img.classList.add("active");
        });

        galleryContainer.appendChild(img);
    });

    // ============================
    // СОЗДАНИЕ КНОПОК
    // ============================
    function createButtons(containerId, dataString, defaultValue) {
        const container = document.getElementById(containerId);
        container.innerHTML = "";

        if (!dataString) return;

        dataString.split(",").forEach(item => {
            const value = item.trim();
            const btn = document.createElement("button");
            btn.classList.add("option-btn");
            btn.textContent = value;

            if (value === defaultValue) btn.classList.add("active");

            btn.addEventListener("click", () => {
                container.querySelectorAll("button").forEach(b => b.classList.remove("active"));
                btn.classList.add("active");
                updatePrice();
            });

            container.appendChild(btn);
        });
    }

    // ============================
    // КНОПКИ ПАРАМЕТРОВ
    // ============================
    createButtons("widthButtons", product.width_options, product.width);
    createButtons("depthButtons", product.depth_options, product.depth);
    createButtons("heightButtons", product.height_options, product.height);
    createButtons("thicknessButtons", product.thickness_options, product.thickness);

    createButtons("materialButtons", product.materials, product.material);
    createButtons("topColorButtons", product.top_colors, product.top_color);

    createButtons("legProfileButtons", product.leg_profile_options, product.leg_profile);

    const legProfileBlock = document.querySelector('[data-block="legProfile"]');
    if (!product.leg_profile_options) {
        legProfileBlock.style.display = "none";
    }

    createButtons("legMaterialButtons", product.leg_materials, product.leg_material);
    createButtons("legsColorButtons", product.legs_colors, product.legs_colors.split(",")[0]);

    const materialImg = document.getElementById("materialImg");
    if (product.material_preview) materialImg.src = product.material_preview;

    function getSelected(containerId) {
        const active = document.querySelector(`#${containerId} .active`);
        return active ? active.textContent : "";
    }

    // ============================
    // ПЕРЕСЧЁТ ЦЕНЫ
    // ============================
    function updatePrice() {
        let finalPrice = product.price;

        const w = getSelected("widthButtons");
        const d = getSelected("depthButtons");
        const h = getSelected("heightButtons");
        const t = getSelected("thicknessButtons");
        const lp = getSelected("legProfileButtons");

        const priceSet = product.size_prices[t];

        if (priceSet) {
            if (priceSet.width[w]) finalPrice += priceSet.width[w];
            if (priceSet.depth[d]) finalPrice += priceSet.depth[d];
            if (priceSet.height[h]) finalPrice += priceSet.height[h];

            if (priceSet.leg_profile && priceSet.leg_profile[lp]) {
                finalPrice += priceSet.leg_profile[lp];
            }
        }

        // Логика профиля опор
        if (product.leg_profile_options) {
            const legProfileButtons = document.getElementById("legProfileButtons");

            if (t === "18 мм") {
                legProfileBlock.style.display = "block";
                legProfileButtons.innerHTML = "";

                const btn = document.createElement("button");
                btn.classList.add("option-btn", "active");
                btn.textContent = "50×25";
                btn.addEventListener("click", () => updatePrice());
                legProfileButtons.appendChild(btn);
            }

            if (t === "36 мм") {
                legProfileBlock.style.display = "block";
                legProfileButtons.innerHTML = "";

                ["50×25", "60×40"].forEach(value => {
                    const btn = document.createElement("button");
                    btn.classList.add("option-btn");
                    btn.textContent = value;

                    if (value === lp) btn.classList.add("active");

                    btn.addEventListener("click", () => {
                        legProfileButtons.querySelectorAll("button").forEach(b => b.classList.remove("active"));
                        btn.classList.add("active");
                        updatePrice();
                    });

                    legProfileButtons.appendChild(btn);
                });
            }
        }

        // Обновляем цену
        priceEl.dataset.base = finalPrice;

        const currency = localStorage.getItem("currency") || "PLN";
        const rates = { PLN: 1, EUR: 1 / 4.30, USD: 1 / 3.95 };

        priceEl.textContent = (finalPrice * rates[currency]).toFixed(2) + " " + currency;
    }

    updatePrice();

    // ============================
    // ОПИСАНИЕ
    // ============================
    const specs = document.createElement("div");
    specs.classList.add("product-description-block");

    specs.innerHTML = `
        <h2 data-lang="description"></h2>
        ${product.description}

        <h2 data-lang="characteristics"></h2>

        <p><strong data-lang="purpose"></strong>: <span>${product.purpose}</span></p>
        <p><strong data-lang="shape"></strong>: <span>${product.shape}</span></p>
        <p><strong data-lang="material"></strong>: <span>${product.material}</span></p>
        <p><strong data-lang="top_color"></strong>: <span>${product.top_color}</span></p>
        <p><strong data-lang="leg_material"></strong>: <span>${product.leg_material}</span></p>
        <p><strong data-lang="legs_color"></strong>: <span>${product.legs_color}</span></p>
    `;

    document.getElementById("productDescription").appendChild(specs);

    applyLang();

    // ============================
    // ДОБАВЛЕНИЕ В КОРЗИНУ
    // ============================
    document.getElementById("addBtn").addEventListener("click", () => {

        if (product.in_stock === "no") {
            alert("Товара нет в наличии");
            return;
        }

        const item = {
            id: product.id,
            name: product.name,
            price: priceEl.dataset.base,
            img: product.img_main,

            width: getSelected("widthButtons"),
            depth: getSelected("depthButtons"),
            height: getSelected("heightButtons"),
            thickness: getSelected("thicknessButtons"),

            material: getSelected("materialButtons"),
            topColor: getSelected("topColorButtons"),

            legProfile: getSelected("legProfileButtons"),
            legMaterial: getSelected("legMaterialButtons"),
            legsColor: getSelected("legsColorButtons"),

            quantity: 1
        };

        const cart = JSON.parse(localStorage.getItem("cart") || "[]");
        cart.push(item);
        localStorage.setItem("cart", JSON.stringify(cart));

        showAddedPopup();

        setTimeout(() => {
            window.location.href = "cart.html";
        }, 600);
    });

})();
