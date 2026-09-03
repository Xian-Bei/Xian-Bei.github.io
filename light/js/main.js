(function () {
  "use strict";

  var prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* Soft spotlight follows pointer (CSS vars on :root) */
  if (!prefersReducedMotion) {
    var spotTicking = false;
    window.addEventListener(
      "pointermove",
      function (e) {
        if (spotTicking) return;
        spotTicking = true;
        window.requestAnimationFrame(function () {
          var x = (e.clientX / Math.max(window.innerWidth, 1)) * 100;
          var y = (e.clientY / Math.max(window.innerHeight, 1)) * 100;
          document.documentElement.style.setProperty("--spot-x", x + "%");
          document.documentElement.style.setProperty("--spot-y", y + "%");
          spotTicking = false;
        });
      },
      { passive: true }
    );
  }

  /* Footer year */
  var yearEl = document.getElementById("year");
  if (yearEl) {
    yearEl.textContent = String(new Date().getFullYear());
  }

  /* Mobile navigation */
  var header = document.querySelector(".site-header");
  var nav = document.getElementById("site-nav");
  var toggle = document.querySelector(".nav-toggle");
  var navLinks = nav ? nav.querySelectorAll('a[href^="#"]') : [];

  function setNavOpen(open) {
    if (!nav || !toggle || !header) return;
    nav.classList.toggle("is-open", open);
    header.classList.toggle("nav-open", open);
    toggle.setAttribute("aria-expanded", open ? "true" : "false");
    toggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");
  }

  if (toggle && nav) {
    toggle.addEventListener("click", function () {
      var open = !nav.classList.contains("is-open");
      setNavOpen(open);
    });

    navLinks.forEach(function (link) {
      link.addEventListener("click", function () {
        if (window.matchMedia("(max-width: 768px)").matches) {
          setNavOpen(false);
        }
      });
    });

    window.addEventListener("resize", function () {
      if (window.innerWidth > 768) {
        setNavOpen(false);
      }
    });
  }

  /* Scroll spy */
  var sectionIds = ["skills", "publications", "education", "awards", "service"];
  var sections = sectionIds
    .map(function (id) {
      return document.getElementById(id);
    })
    .filter(Boolean);

  var navAnchors = document.querySelectorAll(".site-nav a[data-nav]");

  function getActiveSection() {
    var headerH = header ? header.offsetHeight : 64;
    var mid = window.scrollY + headerH + 40;
    var current = null;
    for (var i = 0; i < sections.length; i++) {
      var el = sections[i];
      var top = el.offsetTop;
      if (top <= mid) {
        current = el;
      }
    }
    if (!current && sections.length && window.scrollY < sections[0].offsetTop - headerH) {
      current = sections[0];
    }
    return current;
  }

  function updateActiveNav() {
    var active = getActiveSection();
    var id = active ? active.id : "";
    navAnchors.forEach(function (a) {
      var href = a.getAttribute("href") || "";
      var isMatch = href === "#" + id;
      a.classList.toggle("is-active", isMatch);
    });
  }

  var scrollTicking = false;
  window.addEventListener(
    "scroll",
    function () {
      if (!scrollTicking) {
        window.requestAnimationFrame(function () {
          updateActiveNav();
          scrollTicking = false;
        });
        scrollTicking = true;
      }
    },
    { passive: true }
  );
  updateActiveNav();

  /* Typewriter for hero tagline */
  var tw = document.getElementById("typewriter");
  if (tw && !prefersReducedMotion) {
    var full = tw.getAttribute("data-typewriter") || tw.textContent || "";
    tw.textContent = "";
    var i = 0;
    var speed = 42;

    function step() {
      if (i <= full.length) {
        tw.textContent = full.slice(0, i);
        i += 1;
        window.setTimeout(step, speed);
      }
    }
    window.setTimeout(step, 400);
  } else if (tw) {
    var staticText = tw.getAttribute("data-typewriter");
    if (staticText) {
      tw.textContent = staticText;
    }
  }
})();
