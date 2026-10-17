import pandas as pd
import json

# === 1. Читаем Excel ===
df = pd.read_excel("products.xlsx")

# === 2. Конвертируем в список словарей ===
products = df.to_dict(orient="records")

# === 3. Создаём product-data.js ===
with open("product-data.js", "w", encoding="utf-8") as f:
    f.write("const products = ")
    json.dump(products, f, ensure_ascii=False, indent=4)
    f.write(";")

print("Готово! product-data.js обновлён.")