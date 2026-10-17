from fastapi import FastAPI
from pydantic import BaseModel
import subprocess
import json

app = FastAPI()

class Input(BaseModel):
    action: str
    total: float | None = None
    items: list | None = None
    ip: str | None = None
    ua: str | None = None

@app.post("/analyze")
def analyze(data: Input):
    prompt = f"""
Ты — система безопасности интернет-магазина.
Твоя задача — определить риск мошенничества.

Данные:
- Действие: {data.action}
- Сумма: {data.total}
- IP: {data.ip}
- User-Agent: {data.ua}
- Товары: {data.items}

Верни JSON:
{{
  "risk": число от 0 до 1
}}
"""

    result = subprocess.run(
        ["ollama", "run", "qwen2.5:7b"],
        input=prompt.encode(),
        stdout=subprocess.PIPE
    )

    try:
        response = json.loads(result.stdout.decode())
    except:
        response = {"risk": 0.5}

    return response
