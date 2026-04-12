"""
AI SRE Terminal — FastAPI Backend
POST /classify → {severity, category, confidence, route, action, response_time}
"""

from fastapi import FastAPI, HTTPException
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse
from pydantic import BaseModel
import time
import re

app = FastAPI(title="AI SRE Terminal", version="0.1.0")

# Serve static files
app.mount("/static", StaticFiles(directory="static"), name="static")


@app.get("/")
async def index():
    return FileResponse("static/index.html")


class IncidentInput(BaseModel):
    text: str


# --- Classification Logic ---

CATEGORY_RULES = [
    (r"(?:suspicious|attack|login|credential|unauthorized|breach|malware|phishing|ddos|intrusion)", "SECURITY"),
    (r"(?:503|502|500|connection.?pool|crashloop|oom|crash|restart|pod.*kill|failing|error.*rate)", "INFRASTRUCTURE"),
    (r"(?:payment|billing|transaction|checkout|charge|refund|invoice)", "APPLICATION"),
    (r"(?:disk|cpu|memory|latency|ssl|certificate|certificate.*expir|dns|network|timeout)", "INFRASTRUCTURE"),
    (r"(?:deploy|rollback|config|feature.*flag|ab.*test|release)", "DEPLOYMENT"),
    (r"(?:depend|upstream|third.?party|vendor|api.*down|external)", "DEPENDENCY"),
]

SEVERITY_RULES = [
    (r"(?:503|502|crashloop|oom|attack|breach|suspicious|credential|failing.*\d+%|outage|down)", "P1"),
    (r"(?:disk.*9[0-9]%|ssl.*expir|certificate.*expir|latency.*\d+x|replication.*lag|high.*memory)", "P2"),
    (r"(?:slow|degrad|warning|minor|intermittent)", "P3"),
]

ROUTE_MAP = {
    "SECURITY": "Telegram → #security-oncall",
    "INFRASTRUCTURE": "Telegram → #oncall-primary",
    "APPLICATION": "Telegram → #app-team",
    "DEPLOYMENT": "Slack → #deployments",
    "DEPENDENCY": "Slack → #incidents",
}

ACTION_MAP = {
    "SECURITY": {
        "P1": "Block source IPs + force password reset + enable WAF rules",
        "P2": "Monitor + escalate if pattern continues",
        "P3": "Log and review during next shift",
    },
    "INFRASTRUCTURE": {
        "P1": "Auto-restart affected pods + scale connection pool + page on-call",
        "P2": "Trigger auto-scaling + notify infra team",
        "P3": "Add to morning review queue",
    },
    "APPLICATION": {
        "P1": "Enable circuit breaker + activate fallback service + page team",
        "P2": "Notify team + prepare rollback",
        "P3": "Log issue + assign to next sprint",
    },
    "DEPLOYMENT": {
        "P1": "Auto-rollback + lock pipeline",
        "P2": "Hold deployments + investigate",
        "P3": "Review config diff",
    },
    "DEPENDENCY": {
        "P1": "Activate fallback provider + page vendor liaison",
        "P2": "Monitor SLA + prepare switch",
        "P3": "Document and track",
    },
}


def classify_incident(text: str) -> dict:
    start = time.time()
    lower = text.lower()

    # Category
    category = "APPLICATION"  # default
    for pattern, cat in CATEGORY_RULES:
        if re.search(pattern, lower):
            category = cat
            break

    # Severity
    severity = "P3"  # default
    for pattern, sev in SEVERITY_RULES:
        if re.search(pattern, lower):
            severity = sev
            break

    # Confidence (heuristic based on match strength)
    match_count = sum(1 for p, _ in CATEGORY_RULES if re.search(p, lower))
    confidence = min(60 + match_count * 15, 98)

    # Route & Action
    route = ROUTE_MAP.get(category, "Slack → #incidents")
    action = ACTION_MAP.get(category, {}).get(severity, "Human triage required")

    elapsed = time.time() - start

    return {
        "category": category,
        "severity": severity,
        "confidence": confidence,
        "route": route,
        "action": action,
        "response_time": round(elapsed + 1.5 + (hash(text) % 100) / 100, 1),  # simulated LLM time
    }


@app.post("/classify")
async def classify(input: IncidentInput):
    if not input.text or len(input.text.strip()) < 10:
        raise HTTPException(status_code=400, detail="Incident description too short (min 10 chars)")

    result = classify_incident(input.text)
    result["input_preview"] = input.text[:120] + ("..." if len(input.text) > 120 else "")
    return result


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
