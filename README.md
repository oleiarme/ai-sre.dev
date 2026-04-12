# AI SRE Terminal

**[🚀 LIVE DEMO](https://oleiarme.github.io/ai-sre-terminal/)** — SRE + AI сайт-визитка с интерактивным демо классификации инцидентов.

Проект создан для демонстрации навыков SRE-инженера по интеграции LLM в пайплайны обработки инцидентов.

## GitHub Pages / Деплой

Этот проект автоматически развертывается на GitHub Pages с помощью **GitHub Actions**. 
- Весь фронтенд с логикой симуляции (без бэкенда) находится в папке `static/`.
- GitHub Action копирует содержимое `static/` в корень сайта.

## Запуск на Windows

### Вариант 1: Python (рекомендуется для API)

```bash
# 1. Установи Python 3.10+
# 2. Открой терминал в папке проекта
cd ai-sre-terminal

# 3. Установи зависимости
pip install fastapi uvicorn

# 4. Запусти сервер
python api/main.py
```

Открой http://localhost:8000

### Вариант 2: Только фронтенд (без бэкенда)

Просто открой `static/index.html` в браузере.
Демо работает на встроенном JS-классификаторе (симуляция).

## Структура

```
ai-sre-terminal/
├── .github/workflows/
│   └── deploy.yml       # Авто-деплой на GitHub Pages
├── api/
│   └── main.py          # FastAPI бэкенд (POST /classify)
├── static/
│   ├── index.html       # Полный сайт с встроенным JS
│   └── styles.css       # Стили (без зависимостей)
└── README.md
```

## API

POST /classify — классификация инцидента (только при запуске бэкенда локально)

```bash
curl -X POST http://localhost:8000/classify \
  -H "Content-Type: application/json" \
  -d '{"text": "API returning 503, crashloop on pod X, connection pool exhausted"}'
```

Ответ:
```json
{
  "category": "INFRASTRUCTURE",
  "severity": "P1",
  "confidence": 90,
  "route": "Telegram → #oncall-primary",
  "action": "Auto-restart affected pods + scale connection pool + page on-call",
  "response_time": 2.5
}
```
