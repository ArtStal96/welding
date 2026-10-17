function loadCart() {
    return JSON.parse(localStorage.getItem("cart")) || [];
}

function saveCart(cart) {
    localStorage.setItem("cart", JSON.stringify(cart));
    document.dispatchEvent(new Event("cartUpdated"));
}

function addToCart(id, qty = 1) {
    let cart = loadCart();
    let item = cart.find(i => i.id === id);

    if (item) item.quantity += qty;
    else cart.push({ id, quantity: qty });

    saveCart(cart);
}

function removeFromCart(id) {
    saveCart(loadCart().filter(i => i.id !== id));
}

function changeQty(id, delta) {
    let cart = loadCart();
    let item = cart.find(i => i.id === id);

    if (!item) return;

    item.quantity += delta;
    if (item.quantity <= 0) removeFromCart(id);
    else saveCart(cart);
}
