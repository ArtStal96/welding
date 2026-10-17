/* ============================
   КОРЗИНА — ЗАГРУЗКА / СОХРАНЕНИЕ
============================ */
function loadCart() {
    return JSON.parse(localStorage.getItem("cart") || "[]");
}

function saveCart(cart) {
    localStorage.setItem("cart", JSON.stringify(cart));
    updateCartCount();
}

/* ============================
   СЧЁТЧИК КОРЗИНЫ
============================ */
function updateCartCount() {
    const cart = loadCart();
    const el = document.getElementById("cartCount");
    if (el) el.textContent = cart.length;
}

/* ============================
   РЕНДЕР КОРЗИНЫ
============================ */
function renderCart() {
    const cart = loadCart();
    const container = document.getElementById("cartItems");

    if (!container) return;

    container.innerHTML = "";

    if (cart.length === 0) {
        container.innerHTML = `<p class="empty">Корзина пуста</p>`;
        updateTotal();
        return;
    }

    cart.forEach((item, index) => {
        const div = document.createElement("div");
        div.className = "cart-item";

        div.innerHTML = `
            <img src="${item.img}" alt="${item.name}">
            <div class="cart-info">
                <div class="cart-name">${item.name}</div>
                <div class="cart-price">${item.price} PLN</div>

                <div class="cart-params">
                    <p>Ширина: ${item.width}</p>
                    <p>Глубина: ${item.depth}</p>
                    <p>Высота: ${item.height}</p>
                    <p>Толщина: ${item.thickness}</p>
                    <p>Материал: ${item.material}</p>
                    <p>Цвет столешницы: ${item.topColor}</p>
                    <p>Материал ножек: ${item.legMaterial}</p>
                    <p>Цвет ножек: ${item.legsColor}</p>
                </div>
            </div>

            <div class="cart-controls">
                <button class="qty-btn" data-action="minus" data-index="${index}">-</button>
                <span class="qty">${item.quantity}</span>
                <button class="qty-btn" data-action="plus" data-index="${index}">+</button>

                <button class="remove-btn" data-action="remove" data-index="${index}">
                    Удалить
                </button>
            </div>
        `;

        container.appendChild(div);
    });

    updateTotal();
}

/* ============================
   ИТОГОВАЯ СУММА
============================ */
function updateTotal() {
    const cart = loadCart();
    const total = cart.reduce((sum, item) => sum + Number(item.price) * item.quantity, 0);

    const totalEl = document.getElementById("cartTotal");
    if (totalEl) totalEl.textContent = total + " PLN";
}

/* ============================
   ИЗМЕНЕНИЕ КОЛИЧЕСТВА
============================ */
function changeQty(index, delta) {
    const cart = loadCart();

    cart[index].quantity += delta;

    if (cart[index].quantity <= 0) {
        cart.splice(index, 1);
    }

    saveCart(cart);
    renderCart();
}

/* ============================
   УДАЛЕНИЕ ТОВАРА
============================ */
function removeItem(index) {
    const cart = loadCart();
    cart.splice(index, 1);
    saveCart(cart);
    renderCart();
}

/* ============================
   ОБРАБОТЧИК КНОПОК
============================ */
document.addEventListener("click", e => {
    const btn = e.target;
    const index = btn.dataset.index;

    if (!btn.dataset.action) return;

    if (btn.dataset.action === "minus") changeQty(index, -1);
    if (btn.dataset.action === "plus") changeQty(index, 1);
    if (btn.dataset.action === "remove") removeItem(index);
});

/* ============================
   ИНИЦИАЛИЗАЦИЯ
============================ */
updateCartCount();
renderCart();

/* ============================
   ОТКРЫТИЕ ФОРМЫ ЗАКАЗА
============================ */
document.getElementById("checkoutBtn")?.addEventListener("click", () => {
    const cart = loadCart();

    if (cart.length === 0) {
        alert("Корзина пуста");
        return;
    }

    document.getElementById("orderForm").style.display = "block";
    window.scrollTo(0, document.body.scrollHeight);
});

/* ============================
   BLIK — АНИМАЦИЯ
============================ */
let blikInterval = null;

function startBlikTimer() {
    clearInterval(blikInterval);
    let time = 30;

    const timerEl = document.getElementById("blikTimer");
    const animEl = document.getElementById("blikAnimation");

    timerEl.textContent = time;
    animEl.style.display = "block";

    blikInterval = setInterval(() => {
        time--;
        timerEl.textContent = time;

        if (time <= 0) {
            clearInterval(blikInterval);
            alert("BLIK код истёк. Введите новый.");
            document.getElementById("blikCode").value = "";
            animEl.style.display = "none";
        }
    }, 1000);
}

/* ============================
   ПЕРЕКЛЮЧЕНИЕ СПОСОБА ОПЛАТЫ
============================ */
document.getElementById("orderPayment")?.addEventListener("change", () => {
    const payment = document.getElementById("orderPayment").value;
    const payBtn = document.getElementById("payOnlineBtn");
    const sendBtn = document.getElementById("sendOrderBtn");

    // Сброс
    payBtn.style.display = "none";
    payBtn.className = "pay-btn-base";
    sendBtn.style.display = "block";

    // BLIK поле
    if (payment === "BLIK") {
        document.getElementById("blikField").style.display = "block";
        startBlikTimer();
    } else {
        document.getElementById("blikField").style.display = "none";
        document.getElementById("blikAnimation").style.display = "none";
        clearInterval(blikInterval);
    }

    // Онлайн‑оплата
    if (payment === "VISA") {
        payBtn.style.display = "block";
        payBtn.classList.add("pay-btn-visa");
        sendBtn.style.display = "none";
    }

    if (payment === "MasterCard") {
        payBtn.style.display = "block";
        payBtn.classList.add("pay-btn-mastercard");
        sendBtn.style.display = "none";
    }

    if (payment === "BLIK") {
        payBtn.style.display = "block";
        payBtn.classList.add("pay-btn-blik");
        sendBtn.style.display = "none";
    }
});

/* ============================
   МАСКА ТЕЛЕФОНА
============================ */
const phoneInput = document.getElementById("orderPhone");

phoneInput?.addEventListener("input", () => {
    let v = phoneInput.value.replace(/[^\d+]/g, "");

    if (v.includes("+")) {
        v = "+" + v.replace(/\+/g, "").replace(/[^\d]/g, "");
    }

    const digits = v.replace(/\D/g, "");

    if (digits.length <= 3) {
        phoneInput.value = v;
        return;
    }

    const country = digits.slice(0, 3);
    let rest = digits.slice(3);

    let result = "+" + country;

    while (rest.length > 0) {
        result += " " + rest.slice(0, 3);
        rest = rest.slice(3);
    }

    phoneInput.value = result;
});

/* ============================
   ZIP → ГОРОД (Польша)
============================ */
document.getElementById("orderZip")?.addEventListener("input", async () => {
    const zip = document.getElementById("orderZip").value.replace(/\D/g, "");

    if (zip.length === 5) {
        const formatted = zip.slice(0, 2) + "-" + zip.slice(2, 5);

        try {
            const res = await fetch(`https://kodpocztowy.intami.pl/api/${formatted}`);
            const data = await res.json();

            if (data.city) {
                document.getElementById("orderCity").value = data.city;
            }
        } catch (e) {
            console.log("ZIP API error");
        }
    }
});

/* ============================
   ДАТА ДОСТАВКИ
============================ */
const dateInput = document.getElementById("orderDate");

if (dateInput) {
    const today = new Date();
    const minDate = today.toISOString().split("T")[0];

    const maxDateObj = new Date();
    maxDateObj.setDate(today.getDate() + 14);
    const maxDate = maxDateObj.toISOString().split("T")[0];

    dateInput.min = minDate;
    dateInput.max = maxDate;

    dateInput.addEventListener("change", () => {
        const d = new Date(dateInput.value);

        if (d.getDay() === 0) {
            alert("Доставка в воскресенье недоступна");
            dateInput.value = "";
        }
    });
}

/* ============================
   ОТПРАВКА ЗАКАЗА (нал / курьер)
============================ */
document.getElementById("sendOrderBtn")?.addEventListener("click", () => {
    const cart = loadCart();

    const order = {
        name: document.getElementById("orderName").value.trim(),
        phone: document.getElementById("orderPhone").value.trim(),
        country: document.getElementById("orderCountry").value.trim(),
        city: document.getElementById("orderCity").value.trim(),
        zip: document.getElementById("orderZip").value.trim(),
        address: document.getElementById("orderAddress").value.trim(),
        delivery: document.getElementById("orderDelivery").value,
        payment: document.getElementById("orderPayment").value,
        blik: document.getElementById("blikCode")?.value.trim() || "",
        date: document.getElementById("orderDate").value,
        items: cart
    };

    if (!order.name || !order.phone || !order.country || !order.city || !order.zip || !order.address || !order.date) {
        alert("Заполните все поля");
        return;
    }

    if (order.payment === "BLIK" && order.blik.length !== 6) {
        alert("Введите корректный 6‑значный BLIK код");
        return;
    }

    fetch("api/sendOrder.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(order)
    })
    .then(res => res.json())
    .then(() => {
        alert("Заказ отправлен! Мы свяжемся с вами.");
        localStorage.removeItem("cart");
        updateCartCount();
        renderCart();
        window.location.href = "index.html";
    })
    .catch(() => {
        alert("Ошибка отправки заказа. Попробуйте позже.");
    });
});
/* ============================
   AI‑ПРОВЕРКА
============================ */
async function aiCheck(data) {
    const res = await fetch("api/ai-check.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data)
    });

    return await res.json();
}
/* ============================
   ОНЛАЙН‑ОПЛАТА (P24)
============================ */
document.getElementById("payOnlineBtn")?.addEventListener("click", async () => {
    const cart = loadCart();

    const order = {
        email: document.getElementById("orderName").value.trim() + "@client.com",
        total: Number(document.getElementById("cartTotal").textContent.replace(" PLN", "")),
        items: cart
    };

    const res = await fetch("api/create-payment.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(order)
    });

    const data = await res.json();

    if (data.redirectUrl) {
        window.location.href = data.redirectUrl;
    } else {
        alert("Ошибка создания платежа");
    }
});
