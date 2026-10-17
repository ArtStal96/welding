import json

# 1. Читаем JSON
with open("products.json", "r", encoding="utf-8") as f:
    products = json.load(f)

# 2. Генерируем JS
js_content = "window.products = " + json.dumps(products, ensure_ascii=False, indent=4) + ";"

# 3. Записываем в product-data.js
with open("product-data.js", "w", encoding="utf-8") as f:
    f.write(js_content)

print("Pages → JS обновлён ✔")
