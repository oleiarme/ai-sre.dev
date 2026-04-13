# AI SRE Terminal

**[🚀 LIVE DEMO](https://oleiarme.github.io/ai-sre.dev/)** — An interactive SRE + AI portfolio site with a live incident classification demo.

Built to showcase hands-on experience integrating LLMs into incident response pipelines — from alert ingestion to classification, routing, and automated remediation.

## Deploy

This project is automatically deployed to **GitHub Pages** via **GitHub Actions**.

- All frontend logic (no backend required) lives in `static/`
- The GitHub Actions workflow copies `static/` to the site root on every push to `main`

## Running Locally

### Option 1: Full stack with Python API

```bash
# 1. Requires Python 3.10+
cd ai-sre.dev

# 2. Install dependencies
pip install fastapi uvicorn

# 3. Start the server
python api/main.py
```

Open http://localhost:8000

### Option 2: Frontend only (no backend)

Open `static/index.html` directly in a browser.  
The classifier demo runs entirely in JS (simulated).

## Project Structure

```
ai-sre.dev/
├── .github/workflows/
│   └── deploy.yml       # Auto-deploy to GitHub Pages
├── api/
│   └── main.py          # FastAPI backend (POST /classify)
├── static/
│   ├── index.html       # Full site with embedded JS
│   └── styles.css       # Styles (zero dependencies)
└── README.md
```

## API

`POST /classify` — classify an incident (requires local backend)

```bash
curl -X POST http://localhost:8000/classify \
  -H "Content-Type: application/json" \
  -d '{"text": "API returning 503, crashloop on pod X, connection pool exhausted"}'
```

Response:

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
