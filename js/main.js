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

  /* ---------------------------------------------------------------- Kopfzeile beim Scrollen + Schnellkontakt */
  var actionbar = document.querySelector(".actionbar");
  var contact = document.getElementById("kontakt");
  var contactInView = false;
  var onScroll = function () {
    var y = window.scrollY;
    if (topbar) topbar.classList.toggle("is-scrolled", y > 40);
    if (actionbar) actionbar.classList.toggle("is-visible", y > window.innerHeight * 0.6 && !contactInView);
  };
  if (contact && actionbar && "IntersectionObserver" in window) {
    new IntersectionObserver(function (entries) {
      contactInView = entries[0].isIntersecting;
      onScroll();
    }, { threshold: 0.15 }).observe(contact);
  }
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  /* ---------------------------------------------------------------- Tabs (Einsatzbereiche) */
  document.querySelectorAll("[data-tabs]").forEach(function (wrap) {
    var tabs = Array.prototype.slice.call(wrap.querySelectorAll("[role=tab]"));
    var select = function (tab, focus) {
      tabs.forEach(function (t) {
        var on = t === tab;
        var panel = document.getElementById(t.getAttribute("aria-controls"));
        t.setAttribute("aria-selected", String(on));
        t.tabIndex = on ? 0 : -1;
        if (panel) {
          panel.hidden = !on;
          panel.classList.toggle("is-shown", on);
        }
      });
      if (focus) tab.focus();
      // auf dem Handy den aktiven Reiter in die horizontale Leiste holen
      var list = tab.parentElement;
      if (list.scrollWidth > list.clientWidth) {
        list.scrollTo({ left: tab.offsetLeft - 16, behavior: reduceMotion ? "auto" : "smooth" });
      }
    };
    tabs.forEach(function (tab, i) {
      tab.addEventListener("click", function () { select(tab, false); });
      tab.addEventListener("keydown", function (e) {
        var next = null;
        if (e.key === "ArrowRight") next = tabs[(i + 1) % tabs.length];
        if (e.key === "ArrowLeft") next = tabs[(i - 1 + tabs.length) % tabs.length];
        if (e.key === "Home") next = tabs[0];
        if (e.key === "End") next = tabs[tabs.length - 1];
        if (next) { e.preventDefault(); select(next, true); }
      });
    });
    var current = tabs.filter(function (t) { return t.getAttribute("aria-selected") === "true"; })[0] || tabs[0];
    if (current) select(current, false);
  });

  /* ---------------------------------------------------------------- Karussell (Kundenstimmen) */
  document.querySelectorAll(".g-track").forEach(function (track) {
    var section = track.closest("section");
    var prev = section && section.querySelector(".g-voices__prev");
    var next = section && section.querySelector(".g-voices__next");
    if (!prev || !next) return;
    var step = function () {
      var card = track.querySelector(".g-voice");
      return card ? card.getBoundingClientRect().width + 20 : track.clientWidth * 0.8;
    };
    var update = function () {
      prev.disabled = track.scrollLeft <= 4;
      next.disabled = track.scrollLeft + track.clientWidth >= track.scrollWidth - 4;
    };
    prev.addEventListener("click", function () { track.scrollBy({ left: -step(), behavior: reduceMotion ? "auto" : "smooth" }); });
    next.addEventListener("click", function () { track.scrollBy({ left: step(), behavior: reduceMotion ? "auto" : "smooth" }); });
    track.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    update();
  });

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
