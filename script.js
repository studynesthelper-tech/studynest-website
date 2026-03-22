"use strict";

/* ════════════════════════════════════════════════
   1. NAV SCROLL
════════════════════════════════════════════════ */
(function () {
  const nav = document.getElementById("nav");
  if (!nav) return;
  function check() { nav.classList.toggle("scrolled", window.scrollY > 40); }
  window.addEventListener("scroll", check, { passive: true });
  check();
})();

/* ════════════════════════════════════════════════
   2. REVEAL ON SCROLL
════════════════════════════════════════════════ */
(function () {
  const els = document.querySelectorAll(".reveal");
  if (!els.length) return;
  const io = new IntersectionObserver(
    entries => entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add("visible"); io.unobserve(e.target); } }),
    { threshold: 0.1, rootMargin: "0px 0px -36px 0px" }
  );
  els.forEach(el => io.observe(el));
})();

/* ════════════════════════════════════════════════
   3. HERO POPUP SLIDESHOW  (5 slides, auto + click)
════════════════════════════════════════════════ */
/* ════════════════════════════════════════════════
   HERO PANEL SLIDESHOW — auto-advances through all features
════════════════════════════════════════════════ */
(function () {
  const slides    = Array.from(document.querySelectorAll("#popupSlides .ps"));
  const dotWrap   = document.getElementById("popupDots");
  const labelEl   = document.getElementById("snSlideLabel");
  const dockBtns  = Array.from(document.querySelectorAll("#popupTabs .sn-dock-btn"));
  if (!slides.length) return;

  let current = 0;
  let timer   = null;
  const INTERVAL = 2800;

  // Build dot indicators
  slides.forEach((sl, i) => {
    const d = document.createElement("button");
    d.className = "sn-dot" + (i === 0 ? " active" : "");
    d.setAttribute("aria-label", sl.dataset.label || `Slide ${i + 1}`);
    d.addEventListener("click", () => { goTo(i); resetTimer(); });
    dotWrap.appendChild(d);
  });

  function updateLabel(i) {
    if (labelEl) labelEl.textContent = slides[i].dataset.label || "";
  }

  function goTo(n) {
    slides[current].classList.remove("active");
    dotWrap.children[current].classList.remove("active");
    current = (n + slides.length) % slides.length;
    slides[current].classList.add("active");
    dotWrap.children[current].classList.add("active");
    updateLabel(current);
    dockBtns.forEach((b, i) => b.classList.toggle("active", i === 0 && current === 0));
  }

  function resetTimer() {
    clearInterval(timer);
    timer = setInterval(() => goTo(current + 1), INTERVAL);
  }

  // Pause on hover
  const panel = document.querySelector(".sn-panel");
  if (panel) {
    panel.addEventListener("mouseenter", () => clearInterval(timer));
    panel.addEventListener("mouseleave", () => resetTimer());
  }

  updateLabel(0);
  resetTimer();
})();

/* ════════════════════════════════════════════════
   4. SCREENSHOTS SLIDESHOW
════════════════════════════════════════════════ */
(function () {
  const tabs  = Array.from(document.querySelectorAll("#ssTabs .ss-tab"));
  const slides = Array.from(document.querySelectorAll("#ssStage .ss-slide"));
  const dotWrap = document.getElementById("ssDots");
  const prev  = document.getElementById("ssPrev");
  const next  = document.getElementById("ssNext");
  if (!slides.length) return;

  let current = 0;

  /* Build dots */
  slides.forEach((_, i) => {
    const d = document.createElement("button");
    d.className = "sd" + (i === 0 ? " active" : "");
    d.setAttribute("aria-label", `Screenshot ${i + 1}`);
    d.addEventListener("click", () => go(i));
    dotWrap.appendChild(d);
  });

  function go(n) {
    slides[current].classList.remove("active");
    tabs[current]?.classList.remove("active");
    dotWrap.children[current]?.classList.remove("active");
    current = (n + slides.length) % slides.length;
    slides[current].classList.add("active");
    tabs[current]?.classList.add("active");
    dotWrap.children[current]?.classList.add("active");

    /* Auto-detect placeholder: if img fails, add class */
    const img = slides[current].querySelector("img");
    const wrap = slides[current].querySelector(".ss-img-wrap");
    if (img && wrap) {
      if (!img.complete || img.naturalWidth === 0) {
        wrap.classList.add("ss-placeholder");
      } else {
        wrap.classList.remove("ss-placeholder");
      }
    }
  }

  /* Tab clicks */
  tabs.forEach((t, i) => t.addEventListener("click", () => go(i)));

  /* Arrow buttons */
  prev?.addEventListener("click", () => go(current - 1));
  next?.addEventListener("click", () => go(current + 1));

  /* Touch swipe */
  let startX = 0;
  const stage = document.getElementById("ssStage");
  stage?.addEventListener("touchstart", e => { startX = e.touches[0].clientX; }, { passive: true });
  stage?.addEventListener("touchend", e => {
    const dx = e.changedTouches[0].clientX - startX;
    if (Math.abs(dx) > 50) go(current + (dx < 0 ? 1 : -1));
  });

  /* Init placeholder check on load */
  slides.forEach((sl, i) => {
    const img = sl.querySelector("img");
    const wrap = sl.querySelector(".ss-img-wrap");
    if (!img || !wrap) return;
    img.addEventListener("error", () => wrap.classList.add("ss-placeholder"));
    img.addEventListener("load",  () => wrap.classList.remove("ss-placeholder"));
    if (img.complete && img.naturalWidth === 0) wrap.classList.add("ss-placeholder");
  });
})();

/* ════════════════════════════════════════════════
   5. STICKY BAR (show after hero scrolls out)
════════════════════════════════════════════════ */
(function () {
  const bar  = document.getElementById("stickyBar");
  const hero = document.querySelector(".hero");
  if (!bar || !hero) return;
  const io = new IntersectionObserver(
    ([e]) => { bar.style.display = e.isIntersecting ? "none" : "flex"; },
    { threshold: 0 }
  );
  io.observe(hero);
})();

/* ════════════════════════════════════════════════
   6. SMOOTH ANCHOR SCROLL
════════════════════════════════════════════════ */
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener("click", e => {
    const target = document.querySelector(a.getAttribute("href"));
    if (!target) return;
    e.preventDefault();
    window.scrollTo({ top: target.getBoundingClientRect().top + window.scrollY - 80, behavior: "smooth" });
  });
});

/* ════════════════════════════════════════════════
   7. CTA CLICK TRACKING (swap href for real store URL)
════════════════════════════════════════════════ */
document.querySelectorAll('a[href*="chrome.google.com"]').forEach(a => {
  a.addEventListener("click", () => {
    // Replace the href above with your real Chrome Web Store link:
    // a.href = "https://chrome.google.com/webstore/detail/studynest/YOUR_EXTENSION_ID";
    console.log("[StudyNest] Chrome Store CTA clicked");
  });
});