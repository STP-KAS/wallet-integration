(function () {
  const platform = document.body.getAttribute("data-platform") || "windows";
  const labels = {
    windows: "Windows",
    linux: "Linux",
    ubuntu: "Ubuntu",
    appleos: "Apple OS (macOS)",
    ios: "iOS",
    android: "Android",
  };

  const title = document.querySelector("[data-platform-label]");
  if (title) title.textContent = labels[platform] || platform;

  const statusEl = document.querySelector("[data-status]");
  function status(msg, cls) {
    if (!statusEl) return;
    statusEl.textContent = msg || "";
    statusEl.className = "status " + (cls || "");
  }

  function escape(s) {
    return String(s)
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;");
  }

  async function loadCatalog() {
    const res = await fetch("/catalog/wallets.json");
    if (!res.ok) throw new Error("Could not load catalog/wallets.json. Serve from the repo root.");
    return res.json();
  }

  function renderCatalog(file) {
    const box = document.querySelector("[data-catalog]");
    if (!box) return;
    const list = (file.wallets || []).filter(function (w) {
      return (w.os || []).indexOf(platform) !== -1;
    });
    box.innerHTML = list
      .map(function (w) {
        const chips =
          '<span class="pill">' +
          escape(w.connect) +
          "</span>" +
          (w.kns ? '<span class="pill">KNS</span>' : "") +
          (w.krc20 ? '<span class="pill">KRC-20</span>' : "");
        const action =
          w.connect === "inject"
            ? '<button type="button" data-wallet-id="' + escape(w.id) + '">Connect ' + escape(w.name) + "</button>"
            : '<a class="btn ghost" href="' +
              escape(w.url) +
              '" target="_blank" rel="noopener">Open ' +
              escape(w.name) +
              "</a>";
        return (
          '<article class="card"><h3>' +
          escape(w.name) +
          "</h3><p>" +
          chips +
          "</p><p>" +
          escape(w.note) +
          '</p><p class="muted">' +
          escape((w.platforms || []).join(" · ")) +
          "</p><p>" +
          action +
          "</p></article>"
        );
      })
      .join("");
  }

  function paintSession() {
    const W = window.KaspaWallets;
    if (!W) return;
    const c = W.current();
    const addr = document.querySelector("[data-wallet-addr]");
    const det = document.querySelector("[data-detected]");
    if (addr) addr.textContent = c.address ? W.shortAddr(c.address) : "not connected";
    if (addr && c.address) addr.title = c.address;
    if (det) det.textContent = (W.detected().join(", ") || "none") + " in this tab";
    document.querySelectorAll("[data-wallet-logout]").forEach(function (btn) {
      btn.hidden = !c.address;
    });
    W.paintButtons();
  }

  async function connect(id) {
    const W = window.KaspaWallets;
    status("Connecting " + id + "…");
    try {
      const session = await W.connect(id);
      status("Logged in · " + W.shortAddr(session.address), "ok");
      paintSession();
      await loadHoldings();
    } catch (err) {
      status(err && err.message ? err.message : String(err), "bad");
    }
  }

  async function loadHoldings() {
    const W = window.KaspaWallets;
    const c = W.current();
    const box = document.querySelector("[data-holdings]");
    if (!box || !c.address) {
      if (box) box.innerHTML = "";
      return;
    }
    box.innerHTML = "<p class='muted'>Reading KAS, tokens, and domains…</p>";
    try {
      const net = await W.walletNetwork(c.id);
      const mod = await import("/inject/holdings.mjs");
      const h = await mod.loadHoldings(c.address, net);
      const tokens = (h.tokens || [])
        .map(function (t) {
          return "<tr><th>" + escape(t.tick) + "</th><td>" + escape(t.amount) + "</td></tr>";
        })
        .join("");
      const domains = (h.domains || [])
        .map(function (d) {
          return "<tr><th>" + escape(d.name) + "</th><td>" + escape(d.verified ? "verified" : d.status || "") + "</td></tr>";
        })
        .join("");
      box.innerHTML =
        "<p class='mono'>" +
        escape(c.address) +
        "</p><p>" +
        escape(h.network) +
        (h.primary ? " · " + escape(h.primary) : "") +
        "</p><p><strong>" +
        (h.kas != null ? escape(h.kas) + " KAS" : "KAS not checked") +
        "</strong></p>" +
        (h.kasError ? "<p class='bad'>" + escape(h.kasError) + "</p>" : "") +
        (tokens ? "<table><tbody>" + tokens + "</tbody></table>" : "<p class='muted'>No KRC-20 tokens reported.</p>") +
        (domains ? "<table><tbody>" + domains + "</tbody></table>" : "<p class='muted'>No KNS domains reported.</p>");
    } catch (err) {
      box.innerHTML = "<p class='bad'>" + escape(err.message || String(err)) + "</p>";
    }
  }

  function bindPay() {
    const form = document.querySelector("[data-pay-form]");
    if (!form) return;
    form.addEventListener("submit", async function (e) {
      e.preventDefault();
      const to = form.querySelector('[name="to"]').value.trim();
      const kas = Number(form.querySelector('[name="kas"]').value);
      if (!to || !isFinite(kas) || kas <= 0) {
        status("Need a kaspa: address and an amount.", "warn");
        return;
      }
      const sompi = Math.round(kas * 100000000);
      const result = await window.KaspaPay.pay(to, sompi, { priorityFee: 10000 });
      const out = document.querySelector("[data-pay-out]");
      if (result.method === "inject" && result.txid) {
        status("Sent. txid " + result.txid, "ok");
        if (out) out.textContent = result.txid;
        return;
      }
      if (out) {
        out.innerHTML =
          '<a href="' +
          escape(result.uri) +
          '">' +
          escape(result.uri) +
          "</a>";
      }
      if (result.error) status(result.error + " — open the kaspa: link instead.", "warn");
      else status("No inject in this tab. Open the kaspa: URI in any Kaspa wallet.", "warn");
    });
  }

  document.addEventListener("click", function (e) {
    const pick = e.target.closest("[data-wallet-id]");
    if (pick) {
      connect(pick.getAttribute("data-wallet-id"));
      return;
    }
    if (e.target.closest("[data-wallet-logout]")) {
      window.KaspaWallets.logout().then(function () {
        status("");
        paintSession();
        const box = document.querySelector("[data-holdings]");
        if (box) box.innerHTML = "";
      });
    }
  });

  bindPay();
  loadCatalog()
    .then(renderCatalog)
    .catch(function (err) {
      status(err.message, "bad");
    });
  window.KaspaWallets.resume().then(function (c) {
    paintSession();
    if (c && c.address) loadHoldings();
  });
})();
