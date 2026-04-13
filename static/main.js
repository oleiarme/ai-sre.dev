// ═══════════════════════════════════════════
// ai-sre.dev — Terminal Portfolio Engine
// ═══════════════════════════════════════════

const output = document.getElementById('output');
const cursor = document.getElementById('cursor');
let isTyping = false;
let commandHistory = [];
let historyIndex = -1;

// ── Content Database ──────────────────────
const COMMANDS = {
  about: () => `
<span class="heading">╔══════════════════════════════════════╗</span>
<span class="heading">║       Oleksandr Skrypnikov          ║</span>
<span class="heading">╚══════════════════════════════════════╝</span>

<span class="bright">Role:</span>  SRE Engineer · AI/LLM Infrastructure
<span class="bright">Base:</span>  Lisbon, Portugal (Remote EU/UK)
<span class="bright">Focus:</span> Building AI-powered incident pipelines.
         From alert to classification to Telegram.

I design systems that don't just survive failures —
they <span class="bright">predict</span> and <span class="bright">prevent</span> them using LLMs.

Philosophy: <span class="amber">"Incidents don't wait. AI shouldn't either."</span>

<span class="dim">━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━</span>
`,

  skills: () => `
<span class="heading">╔══════════════════════════════════════╗</span>
<span class="heading">║         Skills & Stack              ║</span>
<span class="heading">╚══════════════════════════════════════╝</span>

<span class="bright">SRE / Observability</span>
 <span class="skill-tag">Prometheus</span> <span class="skill-tag">Grafana</span> <span class="skill-tag">Alert Routing</span>
 <span class="skill-tag">On-call Management</span> <span class="skill-tag">Post-mortems</span>

<span class="bright">AI / LLM Operations</span>
 <span class="skill-tag">OpenAI</span> <span class="skill-tag">Anthropic</span> <span class="skill-tag">RAG Pipelines</span>
 <span class="skill-tag">Incident Classification</span> <span class="skill-tag">Multi-model Routing</span>

<span class="bright">Infrastructure & Cloud</span>
 <span class="skill-tag">Kubernetes</span> <span class="skill-tag">Terraform</span> <span class="skill-tag">AWS</span>
 <span class="skill-tag">GCP</span> <span class="skill-tag">GPU Cluster Ops (~200 GPUs)</span>

<span class="bright">Languages</span>
 <span class="skill-tag">Python (FastAPI)</span> <span class="skill-tag">Go</span> <span class="skill-tag">Bash</span>
 <span class="skill-tag">TypeScript</span> <span class="skill-tag">SQL</span>

<span class="dim">━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━</span>
`,

  experience: () => `
<span class="heading">╔══════════════════════════════════════╗</span>
<span class="heading">║         Track Record                ║</span>
<span class="heading">╚══════════════════════════════════════╝</span>

<span class="bright">[CBOE] Options Trading Platform</span>
  • Low-latency trading infra (99.99% uptime)
  • Real-time risk calculations & market data feeds

<span class="bright">[CRYPTO] Exchange Infrastructure</span>
  • Multi-region deployment & automated failover
  • 24/7 on-call automation with AI triage

<span class="bright">[GPU_OPS] Cluster Operations</span>
  • Managing ~200 GPUs for ML training
  • Thermal monitoring & cost optimization

<span class="bright">[REAL_ESTATE] Automation</span>
  • End-to-end data pipelines & browser automation
  • Document processing using LLMs

<span class="dim">━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━</span>
`,

  projects: () => `
<span class="heading">╔══════════════════════════════════════╗</span>
<span class="heading">║         Projects                    ║</span>
<span class="heading">╚══════════════════════════════════════╝</span>

<span class="bright">ai-sre-classifier</span>  <span class="amber">[GitHub]</span>
  Incident classification pipeline with LLM routing
  <span class="dim">Python · OpenAI · FastAPI · Telegram API</span>

<span class="bright">predictive-scaler</span>  <span class="amber">[GitHub]</span>
  ML model that predicts traffic patterns and pre-scales
  <span class="dim">Python · TensorFlow · Kubernetes HPA</span>

<span class="bright">sre-dashboard-gen</span>  <span class="amber">[GitHub]</span>
  Auto-generates Grafana dashboards from SLO definitions
  <span class="dim">Go · Grafana API · Terraform</span>

<span class="dim">━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━</span>
`,

  classify: (args) => {
    if (!args) {
      return `
<span class="heading">AI Incident Classifier</span>

Usage: <span class="bright">classify &lt;incident description&gt;</span>
Example: <span class="bright">classify 503 errors on api-gateway</span>

Try it now with any description of a system failure.
`;
    }
    
    const lower = args.toLowerCase();
    let category, severity, confidence, route, action;

    if (lower.includes('503') || lower.includes('connection pool') || lower.includes('failing') || lower.includes('crashloop') || lower.includes('oom')) {
      category = 'INFRASTRUCTURE';
      severity = 'P1';
      confidence = 92;
      route = 'Telegram → #oncall-primary';
      action = 'Auto-restart pod + scale connection pool';
    } else if (lower.includes('disk') || lower.includes('ssl') || lower.includes('certificate') || lower.includes('latency')) {
      category = 'INFRASTRUCTURE';
      severity = 'P2';
      confidence = 88;
      route = 'Telegram → #infra-team';
      action = 'Manual review recommended';
    } else if (lower.includes('suspicious') || lower.includes('attack') || lower.includes('login') || lower.includes('credential')) {
      category = 'SECURITY';
      severity = 'P1';
      confidence = 95;
      route = 'Telegram → #security-oncall';
      action = 'Block IPs + force password reset';
    } else if (lower.includes('payment') || lower.includes('billing') || lower.includes('transaction')) {
      category = 'APPLICATION';
      severity = 'P1';
      confidence = 90;
      route = 'Telegram → #payments-team';
      action = 'Enable circuit breaker + fallback';
    } else {
      category = 'APPLICATION';
      severity = 'P3';
      confidence = 75;
      route = 'Slack → #incidents';
      action = 'Human triage required';
    }

    return `
<span class="heading">> ANALYZING INCIDENT...</span>
<span class="dim">${args}</span>

<span class="bright">CATEGORY:</span>    <span style="color:${category === 'SECURITY' ? '#dc2626' : '#f5a623'}">${category}</span>
<span class="bright">SEVERITY:</span>    <span style="color:${severity === 'P1' ? '#dc2626' : '#f5a623'}">${severity}</span>
<span class="bright">CONFIDENCE:</span>  ${confidence}%
<span class="bright">ROUTE:</span>       <span class="amber">${route}</span>
<span class="bright">ACTION:</span>      ${action}

<span class="bright" style="color:#16a34a">> STATUS: CLASSIFIED in ${(Math.random() * 1.5 + 1.5).toFixed(1)}s</span>
`;
  },

  contact: () => `
<span class="heading">╔══════════════════════════════════════╗</span>
<span class="heading">║         Contact                     ║</span>
<span class="heading">╚══════════════════════════════════════╝</span>

<span class="bright">Email:</span>    <a class="link" href="mailto:oleksandr.v.skrypnikov@gmail.com">oleksandr.v.skrypnikov@gmail.com</a>
<span class="bright">GitHub:</span>   <a class="link" href="https://github.com/oleiarme/ai-sre.dev">github.com/oleiarme/ai-sre.dev</a>
<span class="bright">LinkedIn:</span> <a class="link" href="https://linkedin.com/in/oleksandr-skrypnikov-ai">linkedin.com/in/oleksandr-skrypnikov-ai</a>
<span class="bright">Telegram:</span> <a class="link" href="https://t.me/XelaSk">@XelaSk</a>

<span class="dim">━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━</span>
<span class="amber">Based in Lisbon, Portugal. Open to remote EU/UK.
Staff/Principal SRE roles, AI Platform Engineering.</span>
`,

  help: () => `
<span class="heading">Available commands:</span>

  <span class="bright">about</span>      — Who I am
  <span class="bright">skills</span>     — Tech stack & expertise
  <span class="bright">experience</span> — Work history
  <span class="bright">projects</span>   — Open-source & side projects
  <span class="bright">classify</span>   — <span class="amber">DEMO: AI Incident Classifier</span>
  <span class="bright">contact</span>    — Get in touch
  <span class="bright">help</span>       — This message
  <span class="bright">clear</span>      — Clear terminal
  <span class="bright">sudo hire me</span> — 😉

<span class="dim">Tip: Click the buttons below or type a command + Enter</span>
`,

  clear: () => {
    output.innerHTML = '';
    return null;
  },

  'sudo hire me': () => `
<span class="bright">
  ╔══════════════════════════════════════════╗
  ║                                          ║
  ║    ACCESS GRANTED ✓                      ║
  ║                                          ║
  ║    Let's build something resilient.       ║
  ║    Drop me a line → contact              ║
  ║                                          ║
  ╚══════════════════════════════════════════╝
</span>
`,

  neofetch: () => `
<span class="bright">       ⚡ AI SRE</span>       <span class="dim">───────────</span>
<span class="dim">      ╱╲</span>               <span class="bright">OS:</span>     Cloud-Native Linux
<span class="dim">     ╱  ╲</span>              <span class="bright">Uptime:</span> 5+ years in production
<span class="dim">    ╱ ⚡  ╲</span>             <span class="bright">Shell:</span>  bash 5.2 + AI copilot
<span class="dim">   ╱      ╲</span>            <span class="bright">Cloud:</span>  AWS + GCP + K8s
<span class="dim">  ╱────────╲</span>           <span class="bright">AI:</span>     LLMs + RAG + Agents
<span class="dim">  ╲        ╱</span>            <span class="bright">SLOs:</span>   99.99% and climbing
<span class="dim">   ╲      ╱</span>             <span class="bright">MTTR:</span>   < 5 min (auto-remediated)
<span class="dim">    ╲    ╱</span>              <span class="bright">On-call:</span> Pagers are quiet 😌
<span class="dim">     ╲  ╱</span>
<span class="dim">      ╲╱</span>
`
};

// ── Boot Sequence ─────────────────────────
const BOOT_LINES = [
  ['BIOS: AI-SRE v2.0.26', 'OK'],
  ['Loading kernel: resilience.sys', 'OK'],
  ['Initializing: anomaly-detector.service', 'OK'],
  ['Initializing: predictive-scaler.service', 'OK'],
  ['Initializing: auto-remediation.service', 'OK'],
  ['Mounting: /dev/production', 'OK'],
  ['Starting: observability-pipeline', 'OK'],
  ['Loading: SLO definitions ... 99.99%', 'OK'],
  ['Network: cloud-native mesh active', 'OK'],
  ['─'.repeat(46), ''],
  ['System ready. All services nominal.', ''],
];

async function bootSequence() {
  isTyping = true;
  for (const [text, status] of BOOT_LINES) {
    const line = document.createElement('div');
    line.className = 'boot-line';
    const statusStr = status === 'OK'
      ? `<span class="boot-ok">[${status}]</span>`
      : status ? `<span class="amber">[${status}]</span>` : '';
    line.innerHTML = `${text} ${statusStr}`;
    output.appendChild(line);
    output.scrollTop = output.scrollHeight;
    await sleep(150);
  }

  // Welcome message
  await sleep(300);
  const welcome = document.createElement('div');
  welcome.innerHTML = `
<span class="heading">
╔══════════════════════════════════════════════════╗
║                                                  ║
║   Welcome to ai-sre.dev                          ║
║   AI-Driven Site Reliability Engineer            ║
║                                                  ║
║   Type <span class="amber">help</span> to see available commands.       ║
║                                                  ║
╚══════════════════════════════════════════════════╝
</span>`;
  output.appendChild(welcome);
  output.scrollTop = output.scrollHeight;
  isTyping = false;
}

// ── Command Execution ─────────────────────
async function executeCommand(cmd) {
  if (isTyping) return;

  const trimmed = cmd.trim();
  if (!trimmed) return;

  commandHistory.push(trimmed);
  historyIndex = commandHistory.length;

  // Echo command
  const echo = document.createElement('div');
  echo.className = 'cmd-line output-line';
  echo.innerHTML = `<span class="prompt-text">ai-sre@dev:~$ </span>${escapeHtml(cmd)}`;
  output.appendChild(echo);

  // Find command
  const [cmdName, ...args] = trimmed.toLowerCase().split(/\s+/);
  const handler = COMMANDS[cmdName];
  if (handler) {
    // Pass original case for arguments (useful for classify)
    const argString = trimmed.split(/\s+/).slice(1).join(' ');
    const result = handler(argString);
    if (result) {
      await typeOutput(result);
    }
  } else {
    const errDiv = document.createElement('div');
    errDiv.className = 'output-line';
    errDiv.innerHTML = `<span class="red">Command not found: ${escapeHtml(trimmed)}</span>\n<span class="dim">Type <span class="bright">help</span> for available commands.</span>`;
    output.appendChild(errDiv);
  }

  output.scrollTop = output.scrollHeight;
}

// ── Typing Animation ──────────────────────
async function typeOutput(html) {
  isTyping = true;
  const container = document.createElement('div');
  container.className = 'output-line';
  container.innerHTML = html;
  output.appendChild(container);
  output.scrollTop = output.scrollHeight;

  // Quick reveal instead of char-by-char (cleaner for HTML)
  await sleep(80);
  isTyping = false;
}

// ── Keyboard Input ────────────────────────
let inputBuffer = '';

document.addEventListener('keydown', (e) => {
  if (isTyping) return;

  if (e.key === 'Enter') {
    const cmd = inputBuffer;
    inputBuffer = '';
    updateInputDisplay();
    executeCommand(cmd);
  } else if (e.key === 'Backspace') {
    inputBuffer = inputBuffer.slice(0, -1);
    updateInputDisplay();
  } else if (e.key === 'ArrowUp') {
    e.preventDefault();
    if (historyIndex > 0) {
      historyIndex--;
      inputBuffer = commandHistory[historyIndex] || '';
      updateInputDisplay();
    }
  } else if (e.key === 'ArrowDown') {
    e.preventDefault();
    if (historyIndex < commandHistory.length - 1) {
      historyIndex++;
      inputBuffer = commandHistory[historyIndex] || '';
    } else {
      historyIndex = commandHistory.length;
      inputBuffer = '';
    }
    updateInputDisplay();
  } else if (e.key.length === 1) {
    inputBuffer += e.key;
    updateInputDisplay();
  }
});

function updateInputDisplay() {
  const inputLine = document.querySelector('.input-line');
  const promptSpan = inputLine.querySelector('.prompt');
  // Remove old text nodes
  const old = inputLine.querySelector('.typed');
  if (old) old.remove();
  if (inputBuffer) {
    const span = document.createElement('span');
    span.className = 'typed';
    span.textContent = inputBuffer;
    inputLine.insertBefore(span, cursor);
  }
}

// ── Nav Buttons ───────────────────────────
document.querySelectorAll('.nav-bar button').forEach(btn => {
  btn.addEventListener('click', () => {
    const cmd = btn.dataset.cmd;
    if (cmd) executeCommand(cmd);
  });
});

// ── Helpers ───────────────────────────────
function sleep(ms) {
  return new Promise(r => setTimeout(r, ms));
}

function escapeHtml(str) {
  const div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML;
}

// ── Start ─────────────────────────────────
bootSequence();
