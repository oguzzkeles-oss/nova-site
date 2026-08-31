/* NOVA ECE — novaece.com site behaviour v2.0 (framework yok, ~5 KB) */
(function () {
  "use strict";
  var doc = document, root = doc.documentElement, body = doc.body;
  root.classList.add("js");

  /* ---------- analytics (GA4/dataLayer hazır; PII gönderilmez) ---------- */
  window.dataLayer = window.dataLayer || [];
  function track(name, params) {
    var p = params || {};
    p.event = name;
    p.lang = root.lang || "tr";
    p.page = body.getAttribute("data-page") || "";
    window.dataLayer.push(p);
  }
  window.novaTrack = track;
  track("page_view_custom", {});
  var pv = body.getAttribute("data-track-pv");   /* teacher_page_view vb. */
  if (pv) track(pv, {});

  /* data-track: tıklama olayları */
  doc.addEventListener("click", function (e) {
    var el = e.target.closest("[data-track]");
    if (el) track(el.getAttribute("data-track"), { label: el.getAttribute("data-track-label") || el.textContent.trim().slice(0, 40) });
  });

  /* ---------- nav: solid + shrink ---------- */
  var nav = doc.querySelector(".nav");
  var darkHero = body.classList.contains("page-dark-hero");
  function onScroll() {
    var y = window.scrollY;
    if (nav) {
      nav.classList.toggle("small", y > 30);
      nav.classList.toggle("solid", !darkHero || y > 40);
    }
  }
  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });

  /* ---------- hamburger ---------- */
  var mBtn = doc.querySelector(".menu-btn");
  var mMenu = doc.getElementById("mobile-menu");
  function setMenu(open) {
    if (!mBtn || !mMenu) return;
    mMenu.classList.toggle("open", open);
    body.classList.toggle("menu-open", open);
    mBtn.setAttribute("aria-expanded", open ? "true" : "false");
    mMenu.setAttribute("aria-hidden", open ? "false" : "true");
    if (open) { var f = mMenu.querySelector("a"); if (f) f.focus(); } else { mBtn.focus(); }
  }
  if (mBtn && mMenu) {
    mBtn.addEventListener("click", function () { setMenu(!mMenu.classList.contains("open")); });
    doc.addEventListener("keydown", function (e) { if (e.key === "Escape" && mMenu.classList.contains("open")) setMenu(false); });
    mMenu.addEventListener("click", function (e) { if (e.target.closest("a")) setMenu(false); });
  }

  /* ---------- scroll reveal ---------- */
  var rvs = [].slice.call(doc.querySelectorAll(".rv"));
  if ("IntersectionObserver" in window && rvs.length) {
    var io = new IntersectionObserver(function (es) {
      es.forEach(function (en) { if (en.isIntersecting) { en.target.classList.add("vis"); io.unobserve(en.target); } });
    }, { rootMargin: "0px 0px -8% 0px" });
    rvs.forEach(function (el) {
      if (el.getBoundingClientRect().top < window.innerHeight) el.classList.add("vis");
      else io.observe(el);
    });
  } else { rvs.forEach(function (el) { el.classList.add("vis"); }); }

  /* ---------- bölüm görüntülenme olayları (ör. ai_section_view) ---------- */
  var views = [].slice.call(doc.querySelectorAll("[data-view-event]"));
  if ("IntersectionObserver" in window && views.length) {
    var vio = new IntersectionObserver(function (es) {
      es.forEach(function (en) {
        if (en.isIntersecting) { track(en.target.getAttribute("data-view-event"), {}); vio.unobserve(en.target); }
      });
    }, { threshold: 0.35 });
    views.forEach(function (el) { vio.observe(el); });
  }

  /* ---------- formlar (demo & iletişim) ---------- */
  var FORM_ENDPOINT = "https://formspree.io/f/xqpkeqzy"; /* Formspree — gönderiler kayıtlı e-postaya düşer */
  [].slice.call(doc.querySelectorAll("form[data-nova-form]")).forEach(function (form) {
    var kind = form.getAttribute("data-nova-form");
    function setErr(field, msg) {
      var wrap = field.closest(".field"); if (!wrap) return;
      wrap.classList.toggle("err", !!msg);
      var hint = wrap.querySelector(".hint"); if (hint) { hint.textContent = msg || hint.getAttribute("data-default") || ""; }
      if (msg) field.setAttribute("aria-invalid", "true"); else field.removeAttribute("aria-invalid");
    }
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      if (form.querySelector(".hp input") && form.querySelector(".hp input").value) return; /* honeypot */
      var ok = true, firstBad = null;
      [].slice.call(form.querySelectorAll("[required]")).forEach(function (f) {
        var v = f.value.trim(), msg = "";
        if (!v) msg = form.getAttribute("data-msg-required");
        else if (f.type === "email" && !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v)) msg = form.getAttribute("data-msg-email");
        setErr(f, msg);
        if (msg && !firstBad) firstBad = f;
        if (msg) ok = false;
      });
      if (!ok) { if (firstBad) firstBad.focus(); return; }
      var btn = form.querySelector("button[type=submit]");
      if (btn) { btn.disabled = true; btn.style.opacity = ".7"; }
      function done() {
        track(kind === "demo" ? "demo_request" : "contact_request", { method: FORM_ENDPOINT ? "endpoint" : "local" });
        form.hidden = true;
        var okBox = doc.getElementById(form.getAttribute("data-success"));
        if (okBox) { okBox.classList.add("show"); okBox.focus(); }
      }
      if (FORM_ENDPOINT) {
        var data = {};
        [].slice.call(form.elements).forEach(function (f) { if (f.name && !f.closest(".hp")) data[f.name] = f.value; });
        data._subject = kind === "demo" ? "NOVA ECE — Demo talebi" : "NOVA ECE — İletişim mesajı";
        if (data.eposta) data._replyto = data.eposta;
        fetch(FORM_ENDPOINT, { method: "POST", headers: { "Content-Type": "application/json", "Accept": "application/json" }, body: JSON.stringify(data) })
          .then(done).catch(function () { done(); });
      } else { setTimeout(done, 450); }
    });
  });

  /* ---------- interaktif demo stepper ---------- */
  [].slice.call(doc.querySelectorAll(".idemo[data-demo-url]")).forEach(function (idemo) {
    var tabs = [].slice.call(idemo.querySelectorAll(".idemo-tabs button"));
    var panes = [].slice.call(idemo.querySelectorAll(".idemo-pane"));
    var prev = idemo.querySelector("[data-dprev]"), next = idemo.querySelector("[data-dnext]");
    var cur = 0;
    function show(i) {
      cur = Math.max(0, Math.min(panes.length - 1, i));
      tabs.forEach(function (t, j) {
        t.setAttribute("aria-selected", j === cur ? "true" : "false");
        t.classList.toggle("done", j < cur);
      });
      panes.forEach(function (p, j) { p.hidden = j !== cur; });
      if (prev) prev.disabled = cur === 0;
      if (next) next.textContent = cur === panes.length - 1 ? next.getAttribute("data-last") : next.getAttribute("data-next");
      track("interactive_demo_step", { step: cur + 1 });
    }
    tabs.forEach(function (t, j) { t.addEventListener("click", function () { show(j); }); });
    if (prev) prev.addEventListener("click", function () { show(cur - 1); });
    if (next) next.addEventListener("click", function () {
      if (cur === panes.length - 1) { var d = idemo.getAttribute("data-demo-url"); if (d) { track("login_click", { src: "idemo" }); window.open(d, "_blank", "noopener"); } }
      else show(cur + 1);
    });
    show(0);
  });

  /* ---------- artifact önizleme dil değiştirici (yalnız tek-dosya önizlemede var) ---------- */
  var lsw = doc.getElementById("lang-switch-inline");
  if (lsw) {
    lsw.addEventListener("click", function (e) {
      var b = e.target.closest("button[data-lang]"); if (!b) return;
      var L = b.getAttribute("data-lang");
      root.lang = L;
      [].slice.call(doc.querySelectorAll("[data-lang-tree]")).forEach(function (tree) {
        tree.hidden = tree.getAttribute("data-lang-tree") !== L;
      });
      [].slice.call(lsw.querySelectorAll("button")).forEach(function (x) { x.classList.toggle("on", x === b); });
      track("language_change", { to: L });
    });
  }
})();

/* ============================================================================
   v2.1 eki — Kaynaklar (Insights) kategori filtresi
   Sorun: liste sayfasındaki kategori çipleri düz <span> idi, tıklanamıyordu.
   Davranış: çipe dokun → yalnız o kategorinin kartları; aynı çipe tekrar dokun →
   filtre temizlenir. Henüz içeriği olmayan kategoride nazik bir "yolda" notu.
   İlerlemeli iyileştirme: yalnız /insights/ liste sayfalarında ve beklenen
   yapı (grid3 + .acard + .chip) bulunduğunda çalışır; aksi hâlde hiçbir şey yapmaz.
   ========================================================================== */
(function () {
  "use strict";
  var doc = document, root = doc.documentElement;
  if (!/\/insights\/?(index\.html)?$/.test(location.pathname)) return;
  var grid = doc.querySelector(".grid3");
  if (!grid) return;
  var kartlar = [].slice.call(grid.querySelectorAll("a.acard"));
  var cipler = [].slice.call(doc.querySelectorAll(".truststrip .chip"));
  if (kartlar.length < 2 || cipler.length < 3) return;
  var track = window.novaTrack || function () {};
  var EN = (root.lang || "tr").indexOf("en") === 0;

  /* "Öğretmen rehberleri" (çip) ↔ "Öğretmen rehberi" (kart üst yazısı) eşleşsin diye normalizasyon */
  function anahtar(s) {
    return (s || "").toLocaleLowerCase(EN ? "en" : "tr").replace(/\s+/g, " ").trim()
      .replace(/rehberleri$/, "rehberi").replace(/guides$/, "guide")
      .replace(/güncellemeleri$/, "güncellemesi").replace(/updates$/, "update");
  }
  function eslesir(a, b) { return a === b || a.indexOf(b) === 0 || b.indexOf(a) === 0; }
  var kartAnahtari = kartlar.map(function (k) {
    var e = k.querySelector(".eyebrow");
    return anahtar(e ? e.textContent : "");
  });

  var bosNot = doc.createElement("p");
  bosNot.style.cssText = "grid-column:1/-1;margin:0;padding:22px 4px;color:#64748B;font-size:15px;display:none";
  grid.appendChild(bosNot);

  var aktif = null;
  function uygula() {
    var gorunen = 0;
    kartlar.forEach(function (k, i) {
      var goster = !aktif || eslesir(kartAnahtari[i], aktif);
      k.style.display = goster ? "" : "none";
      if (goster) gorunen++;
    });
    if (aktif && gorunen === 0) {
      bosNot.textContent = EN
        ? "The first pieces in this category are on the way — new content is added regularly."
        : "Bu kategorideki ilk içerikler yolda — düzenli olarak yeni içerik ekleniyor.";
      bosNot.style.display = "block";
    } else { bosNot.style.display = "none"; }
    cipler.forEach(function (c) {
      var on = !!aktif && eslesir(anahtar(c.textContent), aktif);
      c.setAttribute("aria-pressed", on ? "true" : "false");
      c.style.background = on ? "#4F46E5" : "";
      c.style.borderColor = on ? "#4F46E5" : "";
      c.style.color = on ? "#fff" : "";
      c.style.opacity = !aktif || on ? "1" : ".55";
    });
  }
  cipler.forEach(function (c) {
    c.setAttribute("role", "button");
    c.setAttribute("tabindex", "0");
    c.setAttribute("aria-pressed", "false");
    c.style.cursor = "pointer";
    function sec() {
      var a = anahtar(c.textContent);
      aktif = aktif === a ? null : a;
      uygula();
      track("insights_filter", { label: c.textContent.trim(), active: aktif ? 1 : 0 });
    }
    c.addEventListener("click", sec);
    c.addEventListener("keydown", function (e) { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); sec(); } });
  });
})();
