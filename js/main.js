/* Uwe Fläschel · Handelsvertretung – gemeinsames Script für alle Seiten */
(function () {
  "use strict";

  var doc = document.documentElement;
  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  // Browser mit Cross-Document View Transitions animieren den Seitenwechsel selbst (CSS @view-transition).
  var nativeTransitions = "CSSViewTransitionRule" in window;

  /* ---------------------------------------------------------------- Mobile-Navigation */
  var topbar = document.querySelector(".topbar");
  var burger = document.querySelector(".burger");
  if (topbar && burger) {
    var setOpen = function (open) {
      topbar.classList.toggle("is-open", open);
      burger.setAttribute("aria-expanded", String(open));
      burger.setAttribute("aria-label", open ? "Menü schließen" : "Menü öffnen");
    };
    burger.addEventListener("click", function () {
      setOpen(!topbar.classList.contains("is-open"));
    });
    topbar.querySelectorAll(".nav a").forEach(function (a) {
      a.addEventListener("click", function () { setOpen(false); });
    });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape") setOpen(false);
    });
  }

  /* ---------------------------------------------------------------- Markenwechsel */
  // Alle Links zur jeweils anderen Marke (Switch oben + Markenkarten) lassen den
  // Switch-Regler zuerst hinübergleiten und wechseln dann die Seite.
  var brandSwitch = document.querySelector(".brandswitch");
  document.querySelectorAll("[data-brand-link]").forEach(function (link) {
    link.addEventListener("click", function (e) {
      if (link.getAttribute("aria-current") === "page") {
        e.preventDefault();
        window.scrollTo({ top: 0, behavior: reduceMotion ? "auto" : "smooth" });
        return;
      }
      if (nativeTransitions || reduceMotion) return;
      if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      e.preventDefault();
      if (brandSwitch) brandSwitch.setAttribute("data-active", link.getAttribute("data-brand-link"));
      doc.classList.add("is-leaving");
      window.setTimeout(function () { window.location.href = link.href; }, 380);
    });
  });
  // Zurück-Navigation aus dem bfcache: Zustand wiederherstellen
  window.addEventListener("pageshow", function (e) {
    if (!e.persisted) return;
    doc.classList.remove("is-leaving");
    if (brandSwitch) brandSwitch.setAttribute("data-active", brandSwitch.getAttribute("data-initial") || "none");
  });

  /* ---------------------------------------------------------------- Reveal beim Scrollen */
  var revealEls = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window && !reduceMotion) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("is-in");
        io.unobserve(entry.target);
      });
    }, { rootMargin: "0px 0px -8% 0px", threshold: 0.08 });
    revealEls.forEach(function (el) { io.observe(el); });
  } else {
    revealEls.forEach(function (el) { el.classList.add("is-in"); });
  }

  /* ---------------------------------------------------------------- Zähler */
  var counters = document.querySelectorAll("[data-count]");
  var runCounter = function (el) {
    var target = parseInt(el.getAttribute("data-count"), 10);
    var suffix = el.getAttribute("data-suffix") || "";
    var start = null;
    var duration = 1400;
    var step = function (ts) {
      if (start === null) start = ts;
      var p = Math.min((ts - start) / duration, 1);
      var eased = 1 - Math.pow(1 - p, 3);
      el.textContent = Math.round(target * eased) + suffix;
      if (p < 1) window.requestAnimationFrame(step);
    };
    window.requestAnimationFrame(step);
  };
  if ("IntersectionObserver" in window && !reduceMotion) {
    var co = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        runCounter(entry.target);
        co.unobserve(entry.target);
      });
    }, { threshold: 0.6 });
    counters.forEach(function (el) { co.observe(el); });
  }

  /* ---------------------------------------------------------------- Anfrage-Formular */
  // Kein Server nötig: das Formular baut eine fertige E-Mail im Mailprogramm des Besuchers.
  var form = document.querySelector("[data-inquiry]");
  if (form) {
    var topic = form.querySelector("[name=thema]");

    // "Anfragen"-Links in den Leistungskarten wählen das passende Thema vor
    document.querySelectorAll("[data-topic]").forEach(function (link) {
      link.addEventListener("click", function () {
        if (topic) topic.value = link.getAttribute("data-topic");
      });
    });

    form.addEventListener("submit", function (e) {
      e.preventDefault();
      if (!form.checkValidity()) {
        form.reportValidity();
        return;
      }
      var val = function (name) {
        var f = form.querySelector("[name=" + name + "]");
        return f ? f.value.trim() : "";
      };
      var brand = form.getAttribute("data-inquiry");
      var subject = "Anfrage " + brand + (val("thema") ? ": " + val("thema") : "");
      var lines = [
        "Guten Tag Herr Fläschel,",
        "",
        val("nachricht"),
        "",
        "Thema: " + (val("thema") || "–"),
        "Name: " + val("name"),
        "Firma: " + (val("firma") || "–"),
        "E-Mail: " + val("email"),
        "Telefon: " + (val("telefon") || "–")
      ];
      window.location.href = "mailto:" + form.getAttribute("data-mail") +
        "?subject=" + encodeURIComponent(subject) +
        "&body=" + encodeURIComponent(lines.join("\n"));
      form.classList.add("is-sent");
    });
  }

  /* ---------------------------------------------------------------- Jahr im Footer */
  document.querySelectorAll("[data-year]").forEach(function (el) {
    el.textContent = String(new Date().getFullYear());
  });
})();
