# AI SRE .dev — Site Design Document

## Problem Statement
Site-visiting card for SRE Engineer with AI/LLM specialization. Target: recruiters and clients must see competence in action, not just read about it.

## Chosen Approach: Variant B — "Live Incident Terminal"
Engineering Terminal design (ai-bootcamp clone) + interactive AI demo on the page.

## Architecture
- Static site (HTML/CSS/JS) with terminal aesthetic
- FastAPI backend for incident classification demo
- Single endpoint: POST /classify → {severity, category, suggestion, action}

## Page Structure (6 sections)
1. NAV: fixed top bar, pulse dot, "Lisbon // SRE + AI", status ticker
2. HERO: "Incidents don't wait. AI shouldn't either." + CTA
3. WHAT I DO: 3 pillars — SRE/Observability | AI/LLM Routing | Cloud Infra
4. AI SRE PIPELINE: static visual flow (Incident → Classify → Route → Fix)
5. TRY IT: interactive demo — input incident → live LLM classification
6. TRACK RECORD: case rows (CBOE, Crypto, GPU Ops, Real Estate)
7. CTA: "Let's Talk" → email/LinkedIn/Telegram

## Key Decisions
- Design: Engineering Terminal (ai-bootcamp clone)
- Fonts: Roboto Condensed (display) + JetBrains Mono (body/code)
- Colors: #f5f5f0 bg, #0a0a0f text, #f5a623 accent
- Demo: textarea → API call → terminal-style output with severity colors
- Backend: FastAPI, OpenAI/Anthropic for classification

## Open Questions
- API key management for demo (proxy through backend)
- Rate limiting for demo endpoint
- Hosting (AWS/GCP — user's territory)

---
*Generated via brainstorming workflow — 2026-04-12*
