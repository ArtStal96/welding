// ============================
// 4 ЯЗЫКА ДЛЯ ВСЕГО САЙТА
// ============================

const LANG = {
    ru: {
        // Меню
        menu_home: "Главная",
        menu_catalog: "Каталог",
        menu_about: "О нас",
        menu_cart: "Корзина",

        // Каталог
        more: "Подробнее",
        price: "Цена",
        loading_catalog: "Загрузка каталога...",

        // Страница товара
        add_to_cart: "Добавить в корзину",
        description: "Описание",
        characteristics: "Характеристики",
        purpose: "Назначение",
        shape: "Форма",
        width: "Ширина",
        depth: "Глубина",
        height: "Высота",
        thickness: "Толщина",
        material: "Материал",
        top_color: "Цвет столешницы",
        leg_profile: "Профиль опор",
        leg_material: "Материал ножек",
        legs_color: "Цвет ножек",

        // Корзина
        cart_title: "Корзина",
        cart_empty: "Корзина пуста",
        cart_total: "Итого",
        cart_checkout: "Оформить заказ",
        cart_remove: "Удалить",

        // Футер
        footer_rights: "Все права защищены",
    },

    pl: {
        menu_home: "Strona główna",
        menu_catalog: "Katalog",
        menu_about: "O nas",
        menu_cart: "Koszyk",

        more: "Więcej",
        price: "Cena",
        loading_catalog: "Ładowanie katalogu...",

        add_to_cart: "Dodaj do koszyka",
        description: "Opis",
        characteristics: "Charakterystyka",
        purpose: "Przeznaczenie",
        shape: "Kształt",
        width: "Szerokość",
        depth: "Głębokość",
        height: "Wysokość",
        thickness: "Grubość",
        material: "Materiał",
        top_color: "Kolor blatu",
        leg_profile: "Profil nóg",
        leg_material: "Materiał nóg",
        legs_color: "Kolor nóg",

        cart_title: "Koszyk",
        cart_empty: "Koszyk jest pusty",
        cart_total: "Razem",
        cart_checkout: "Zamów",
        cart_remove: "Usuń",

        footer_rights: "Wszelkie prawa zastrzeżone",
    },

    de: {
        menu_home: "Startseite",
        menu_catalog: "Katalog",
        menu_about: "Über uns",
        menu_cart: "Warenkorb",

        more: "Mehr",
        price: "Preis",
        loading_catalog: "Katalog wird geladen...",

        add_to_cart: "In den Warenkorb",
        description: "Beschreibung",
        characteristics: "Eigenschaften",
        purpose: "Verwendung",
        shape: "Form",
        width: "Breite",
        depth: "Tiefe",
        height: "Höhe",
        thickness: "Dicke",
        material: "Material",
        top_color: "Farbe der Tischplatte",
        leg_profile: "Beinprofil",
        leg_material: "Beinmaterial",
        legs_color: "Beinfarbe",

        cart_title: "Warenkorb",
        cart_empty: "Der Warenkorb ist leer",
        cart_total: "Gesamt",
        cart_checkout: "Bestellen",
        cart_remove: "Entfernen",

        footer_rights: "Alle Rechte vorbehalten",
    },

    en: {
        menu_home: "Home",
        menu_catalog: "Catalog",
        menu_about: "About",
        menu_cart: "Cart",

        more: "More",
        price: "Price",
        loading_catalog: "Loading catalog...",

        add_to_cart: "Add to cart",
        description: "Description",
        characteristics: "Characteristics",
        purpose: "Purpose",
        shape: "Shape",
        width: "Width",
        depth: "Depth",
        height: "Height",
        thickness: "Thickness",
        material: "Material",
        top_color: "Top color",
        leg_profile: "Leg profile",
        leg_material: "Leg material",
        legs_color: "Leg color",

        cart_title: "Cart",
        cart_empty: "Your cart is empty",
        cart_total: "Total",
        cart_checkout: "Checkout",
        cart_remove: "Remove",

        footer_rights: "All rights reserved",
    }
};

// ============================
// ПРИМЕНЕНИЕ ПЕРЕВОДА
// ============================

function applyLang() {
    const lang = localStorage.getItem("lang") || "ru";

    document.querySelectorAll("[data-lang]").forEach(el => {
        const key = el.getAttribute("data-lang");
        if (LANG[lang] && LANG[lang][key]) {
            el.textContent = LANG[lang][key];
        }
    });
}

// ============================
// СМЕНА ЯЗЫКА
// ============================

function setLang(lang) {
    localStorage.setItem("lang", lang);
    applyLang();
}
