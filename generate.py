import pandas as pd
import json

# === 1. Читаем Excel ===
df = pd.read_excel("products.xlsx")

# === 2. Преобразуем строки NaN в пустые строки ===
df = df.fillna("")

# === 3. Превращаем Excel в список словарей ===
products = df.to_dict(orient="records")

# === 4. Генерируем JS-файл ===
js_content = "window.products = " + json.dumps(products, ensure_ascii=False, indent=4) + ";"

with open("product-data.js", "w", encoding="utf-8") as f:
    f.write(js_content)

print("Excel → JS обновлён ✔")
