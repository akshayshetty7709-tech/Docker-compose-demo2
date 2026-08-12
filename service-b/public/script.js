const statColors = { mint: "#4fd1a5", amber: "#f2b154", coral: "#f2604f", indigo: "#6c8cff" };

function renderStats(stats) {
  const row = document.getElementById("statRow");
  row.innerHTML = stats.map(s => `
    <div class="stat-card" style="--stat-color:${statColors[s.color]}">
      <div class="stat-label">${s.label}</div>
      <div class="stat-value">${s.value}</div>
      <div class="stat-delta ${s.deltaDirection}">${s.delta}</div>
    </div>
  `).join("");
}

function renderPipelines(pipelines) {
  const body = document.getElementById("pipelineBody");
  body.innerHTML = pipelines.map(p => `
    <tr>
      <td class="pipeline-name">${p.name}</td>
      <td><span class="branch-tag">${p.branch}</span></td>
      <td><span class="status-badge ${p.status}"><span class="dot"></span>${p.statusLabel}</span></td>
      <td class="duration-cell">${p.duration}</td>
      <td class="time-cell">${p.triggered}</td>
    </tr>
  `).join("");
}

function renderInfra(services) {
  const list = document.getElementById("infraList");
  list.innerHTML = services.map(s => `
    <div class="infra-item">
      <span class="infra-name"><span class="status-dot ${s.status} ${s.status === 'healthy' ? 'pulse' : ''}"></span>${s.name}</span>
      <span class="infra-metric">${s.metric}</span>
    </div>
  `).join("");
}

const logMessages = [
  { tag: "deploy", cls: "", text: "starting rollout for api-gateway:v2.14.0" },
  { tag: "build", cls: "ok", text: "image built in 34.2s — pushed to registry" },
  { tag: "k8s", cls: "", text: "scaling replica set to 4/4 pods" },
  { tag: "health", cls: "ok", text: "readiness probe passed on all pods" },
  { tag: "cache", cls: "warn", text: "cache hit ratio dropped to 71% — monitoring" },
  { tag: "deploy", cls: "ok", text: "rollout complete — 0 errors, 0 restarts" },
  { tag: "cron", cls: "", text: "nightly backup job queued" },
];

function appendLogLine() {
  const term = document.getElementById("logTerminal");
  const msg = logMessages[Math.floor(Math.random() * logMessages.length)];
  const time = new Date().toLocaleTimeString("en-US", { hour12: false });
  const line = document.createElement("div");
  line.className = "log-line";
  line.innerHTML = `[${time}] <span class="tag">${msg.tag}</span> <span class="${msg.cls}">${msg.text}</span>`;
  term.appendChild(line);
  term.scrollTop = term.scrollHeight;
  while (term.children.length > 40) term.removeChild(term.firstChild);
}

fetch("/api/dashboard")
  .then(res => res.json())
  .then(data => {
    renderStats(data.stats);
    renderPipelines(data.pipelines);
    renderInfra(data.infrastructure);
    for (let i = 0; i < 5; i++) appendLogLine();
    setInterval(appendLogLine, 3200);
  })
  .catch(() => {
    document.getElementById("statRow").innerHTML =
      `<p style="color:#838d9c">Couldn't load dashboard data. Is the API running?</p>`;
  });
