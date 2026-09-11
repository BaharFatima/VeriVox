/* VeriVox — Backend-Connected State Engine */

const VX = (() => {
  // Dynamically resolve API URL so it works whether served via FastAPI (port 8000), Live Server (port 5500/3000), or file://
  const API_BASE = (typeof window !== "undefined" && (window.location.protocol === "file:" || (window.location.port && window.location.port !== "8000")))
    ? "http://localhost:8000/api"
    : "/api";

  let state = {
    monitoring: true,
    alertDismissed: false,
    account: {},
    session: {},
    models: [],
    controls: {},
    alerts: [],
    soarRules: [],
    baselines: [],
    forensics: [],
    sessions: []
  };

  let _readyPromise = null;

  async function fetchState() {
    try {
      const res = await fetch(`${API_BASE}/state`);
      if (!res.ok) throw new Error(`HTTP error ${res.status}`);
      const data = await res.json();
      Object.assign(state, data);
      document.dispatchEvent(new CustomEvent("vx:ready", { detail: state }));
      return state;
    } catch (e) {
      console.error("Failed to load backend state from", `${API_BASE}/state`, e);
      return state;
    }
  }

  function ready() {
    if (!_readyPromise) {
      _readyPromise = fetchState();
    }
    return _readyPromise;
  }

  async function saveAccount() {
    try {
      await fetch(`${API_BASE}/account`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(state.account)
      });
    } catch (e) {
      console.error("Failed to save account", e);
    }
  }

  async function saveControls() {
    try {
      await fetch(`${API_BASE}/controls`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(state.controls)
      });
    } catch (e) {
      console.error("Failed to save controls", e);
    }
  }

  async function toggleMonitoring(val) {
    try {
      state.monitoring = val !== undefined ? val : !state.monitoring;
      const res = await fetch(`${API_BASE}/monitoring/toggle`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ monitoring: state.monitoring })
      });
      const data = await res.json();
      state.monitoring = data.monitoring;
    } catch (e) {
      console.error("Failed to toggle monitoring", e);
    }
  }

  async function save() {
    await saveAccount();
    await saveControls();
    await fetch(`${API_BASE}/monitoring/toggle`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ monitoring: state.monitoring })
    });
  }

  async function reset() {
    await fetch(`${API_BASE}/reset`, { method: "POST" });
    location.reload();
  }

  async function createSOARRule(ruleObj) {
    try {
      const res = await fetch(`${API_BASE}/soar-rules`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: ruleObj.name, trigger: ruleObj.trigger, action: ruleObj.action })
      });
      return await res.json();
    } catch (e) {
      console.error("Failed to create SOAR rule", e);
    }
  }

  async function updateSOARRule(id, updates) {
    try {
      const res = await fetch(`${API_BASE}/soar-rules/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updates)
      });
      return await res.json();
    } catch (e) {
      console.error("Failed to update SOAR rule", e);
    }
  }

  async function deleteSOARRule(id) {
    try {
      await fetch(`${API_BASE}/soar-rules/${id}`, { method: "DELETE" });
    } catch (e) {
      console.error("Failed to delete SOAR rule", e);
    }
  }

  async function createBaseline(baselineObj) {
    try {
      const res = await fetch(`${API_BASE}/baselines`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: baselineObj.name, speaker: baselineObj.speaker })
      });
      return await res.json();
    } catch (e) {
      console.error("Failed to create baseline", e);
    }
  }

  async function updateBaseline(id, updates) {
    try {
      const res = await fetch(`${API_BASE}/baselines/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updates)
      });
      return await res.json();
    } catch (e) {
      console.error("Failed to update baseline", e);
    }
  }

  async function deleteBaseline(id) {
    try {
      await fetch(`${API_BASE}/baselines/${id}`, { method: "DELETE" });
    } catch (e) {
      console.error("Failed to delete baseline", e);
    }
  }

  async function createForensicCase(caseObj) {
    try {
      const res = await fetch(`${API_BASE}/forensics`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(caseObj)
      });
      return await res.json();
    } catch (e) {
      console.error("Failed to create forensic case", e);
    }
  }

  async function addCaseNote(caseId, noteObj) {
    try {
      const res = await fetch(`${API_BASE}/forensics/${caseId}/notes`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(noteObj)
      });
      return await res.json();
    } catch (e) {
      console.error("Failed to add case note", e);
    }
  }

  async function toggleCaseStatus(caseId, status) {
    try {
      const res = await fetch(`${API_BASE}/forensics/${caseId}/status`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(status ? { status } : {})
      });
      return await res.json();
    } catch (e) {
      console.error("Failed to toggle case status", e);
    }
  }

  function toast(message, kind) {
    let stack = document.querySelector(".toast-stack");
    if (!stack) {
      stack = document.createElement("div");
      stack.className = "toast-stack";
      document.body.appendChild(stack);
    }
    const el = document.createElement("div");
    el.className = "toast" + (kind ? " " + kind : "");
    el.textContent = message;
    stack.appendChild(el);
    setTimeout(() => el.remove(), 3200);
  }

  function uid(prefix) {
    return prefix + Math.random().toString(36).slice(2, 8);
  }

  function applyTheme() {
    document.documentElement.setAttribute("data-theme", state.account.theme || "light");
  }

  return {
    state,
    ready,
    fetchState,
    saveAccount,
    saveControls,
    toggleMonitoring,
    save,
    reset,
    createSOARRule,
    updateSOARRule,
    deleteSOARRule,
    createBaseline,
    updateBaseline,
    deleteBaseline,
    createForensicCase,
    addCaseNote,
    toggleCaseStatus,
    toast,
    uid,
    applyTheme,
    API_BASE
  };
})();

document.addEventListener("DOMContentLoaded", async () => {
  await VX.ready();
  VX.applyTheme();

  const bell = document.querySelector(".icon-button[aria-label='Notifications']");
  if (bell) {
    const dot = bell.querySelector("b");
    if (dot) dot.style.display = VX.state.alerts.length ? "block" : "none";

    const panel = document.createElement("div");
    panel.className = "bell-panel";
    panel.innerHTML = `<div class="bp-head">Recent alerts</div>` + (
      VX.state.alerts.length
        ? VX.state.alerts.map(a => `<div class="bp-item"><strong>${a.title}</strong><br>${a.desc}<small>${a.time}</small></div>`).join("")
        : `<div class="bp-empty">You're all caught up.</div>`
    );
    bell.style.position = "relative";
    bell.after(panel);
    bell.addEventListener("click", (e) => {
      e.stopPropagation();
      panel.classList.toggle("open");
    });
    document.addEventListener("click", () => panel.classList.remove("open"));
  }

  const menuBtn = document.querySelector(".menu-button");
  if (menuBtn) {
    const scrim = document.createElement("div");
    scrim.className = "drawer-scrim";
    const panel = document.createElement("div");
    panel.className = "side-menu-panel";
    panel.innerHTML = `
      <div class="brand" style="padding:0 0 24px"><span class="brand-mark">◇</span><span>Veri<span>Vox</span></span></div>
      <nav class="side-nav">
        <a class="nav-item" href="index.html">▣ Live Guard</a>
        <a class="nav-item" href="analytics.html">▥ Analytics</a>
        <a class="nav-item" href="soar-rules.html">☷ SOAR Rules</a>
        <a class="nav-item" href="voice-baselines.html">◎ Voice Baselines</a>
        <a class="nav-item" href="forensics.html">⌕ Forensics</a>
        <a class="nav-item" href="account.html">♤ Account</a>
      </nav>
    `;
    document.body.append(scrim, panel);
    const close = () => { scrim.classList.remove("open"); panel.classList.remove("open"); };
    menuBtn.addEventListener("click", () => { scrim.classList.add("open"); panel.classList.add("open"); });
    scrim.addEventListener("click", close);
  }

  const stripClose = document.querySelector(".alert-strip .close");
  const strip = document.querySelector(".alert-strip");
  if (strip && VX.state.alertDismissed) strip.style.display = "none";
  if (stripClose) {
    stripClose.addEventListener("click", async () => {
      strip.style.display = "none";
      VX.state.alertDismissed = true;
      await fetch(`${VX.API_BASE}/alert/dismiss`, { method: "POST" });
    });
  }

  const workspace = document.querySelector(".workspace");
  if (workspace) workspace.addEventListener("click", () => VX.toast("Single-workspace plan — upgrade to add more."));
});