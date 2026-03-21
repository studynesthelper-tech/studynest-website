/* StudyNest — script.js */
"use strict";

// ── Nav scroll effect ──────────────────────────────────────
(function () {
  const nav = document.getElementById("nav");
  if (!nav) return;
  const onScroll = () => {
    nav.classList.toggle("scrolled", window.scrollY > 40);
  };
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();
})();

// ── Reveal on scroll ──────────────────────────────────────
(function () {
  const els = document.querySelectorAll(".reveal");
  if (!els.length) return;

  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) {
          e.target.classList.add("visible");
          io.unobserve(e.target);
        }
      });
    },
    { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
  );

  els.forEach((el) => io.observe(el));
})();

// ── Sticky CTA visibility ──────────────────────────────────
(function () {
  const sticky = document.getElementById("stickyCta");
  if (!sticky) return;
  const hero   = document.querySelector(".hero");
  if (!hero) return;

  const io = new IntersectionObserver(
    ([e]) => {
      // Show sticky bar only when hero CTA is out of view
      sticky.style.display = e.isIntersecting ? "none" : "block";
    },
    { threshold: 0 }
  );
  io.observe(hero);
})();

// ── Smooth anchor scroll ──────────────────────────────────
document.querySelectorAll('a[href^="#"]').forEach((a) => {
  a.addEventListener("click", (e) => {
    const target = document.querySelector(a.getAttribute("href"));
    if (!target) return;
    e.preventDefault();
    const offset = 80;
    const top = target.getBoundingClientRect().top + window.scrollY - offset;
    window.scrollTo({ top, behavior: "smooth" });
  });
});

// ── FAQ keyboard accessibility ────────────────────────────
document.querySelectorAll(".faq-item summary").forEach((s) => {
  s.addEventListener("keydown", (e) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      s.click();
    }
  });
});

// ── Install CTA click tracking (stub) ─────────────────────
document.querySelectorAll('a[href="#install"]').forEach((a) => {
  a.addEventListener("click", () => {
    // Replace with real analytics / Chrome Web Store URL
    // window.open("https://chrome.google.com/webstore/...", "_blank");
    console.log("[StudyNest] Install CTA clicked");
  });
});
