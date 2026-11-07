(function () {
  "use strict";

  /* ---------- Live clock (day, date, time) ---------- */
  var timeEl = document.getElementById("clock-time");
  var dateEl = document.getElementById("clock-date");
  function tick() {
    if (!timeEl || !dateEl) return;
    var now = new Date();
    var narrow = window.matchMedia("(max-width:640px)").matches;
    timeEl.textContent = now.toLocaleTimeString(undefined, {
      hour: "2-digit", minute: "2-digit", second: "2-digit"
    });
    dateEl.textContent = now.toLocaleDateString(undefined, {
      weekday: narrow ? "short" : "long",
      day: "2-digit",
      month: narrow ? "short" : "long",
      year: "numeric"
    });
  }
  tick();
  setInterval(tick, 1000);

  /* ---------- Theme toggle (remembered per browser) ---------- */
  var root = document.documentElement;
  try {
    var saved = localStorage.getItem("theme");
    if (saved === "dark" || saved === "light") root.setAttribute("data-theme", saved);
  } catch (e) {}
  var themeBtn = document.getElementById("theme-btn");
  if (themeBtn) {
    themeBtn.addEventListener("click", function () {
      var current = root.getAttribute("data-theme");
      if (!current) {
        current = window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
      }
      var next = current === "dark" ? "light" : "dark";
      root.setAttribute("data-theme", next);
      try { localStorage.setItem("theme", next); } catch (e) {}
    });
  }

  /* ---------- Mobile menu ---------- */
  var menuBtn = document.getElementById("menu-btn");
  var navrow = document.getElementById("navrow");
  if (menuBtn && navrow) {
    menuBtn.addEventListener("click", function () {
      var open = navrow.classList.toggle("open");
      menuBtn.setAttribute("aria-expanded", open ? "true" : "false");
    });
  }

  /* ---------- Sidebar toggle on chapter pages (mobile) ---------- */
  var sbBtn = document.getElementById("sb-toggle");
  var sbCard = document.getElementById("sb-card");
  if (sbBtn && sbCard) {
    sbBtn.addEventListener("click", function () {
      sbCard.classList.toggle("open");
    });
  }

  /* ---------- Table-of-index filter ---------- */
  var filter = document.getElementById("toc-filter");
  if (filter) {
    filter.addEventListener("input", function () {
      var q = filter.value.trim().toLowerCase();
      document.querySelectorAll("details.subject").forEach(function (d) {
        var any = false;
        d.querySelectorAll(".unit-list li").forEach(function (li) {
          var hit = !q || li.textContent.toLowerCase().indexOf(q) !== -1;
          li.style.display = hit ? "" : "none";
          if (hit) any = true;
        });
        var titleHit = d.querySelector("summary").textContent.toLowerCase().indexOf(q) !== -1;
        d.style.display = (any || titleHit || !q) ? "" : "none";
        if (q && (any || titleHit)) d.open = true;
      });
    });
  }

  /* ---------- GoatCounter: tracking + visible visit counter ---------- */
  var code = (window.SITE_CONFIG && window.SITE_CONFIG.goatcounterCode) || "";
  var counterEl = document.getElementById("gc-count");
  if (code && code !== "YOURCODE") {
    var s = document.createElement("script");
    s.async = true;
    s.src = "//gc.zgo.at/count.js";
    s.setAttribute("data-goatcounter", "https://" + code + ".goatcounter.com/count");
    document.head.appendChild(s);

    if (counterEl) {
      // Small delay so this visit is usually included in the number
      setTimeout(function () {
        fetch("https://" + code + ".goatcounter.com/counter/TOTAL.json")
          .then(function (r) { return r.json(); })
          .then(function (j) { counterEl.textContent = j.count; })
          .catch(function () { counterEl.textContent = "—"; });
      }, 1500);
    }
  } else if (counterEl) {
    counterEl.textContent = "—";
    counterEl.title = "Set your GoatCounter code in assets/config.js";
  }
})();
