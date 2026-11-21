
/* ==========================================================
   HASSAAN NADEEM — DEVELOPER PORTFOLIO
   File: js/main.js

   Features:
   01. Mobile navigation
   02. Sticky header state
   03. Scroll reveal animations
   04. Automatic copyright year
   05. Accessibility and reduced-motion support
   ========================================================== */

(() => {
  "use strict";

  /* ========================================================
     01. ELEMENT REFERENCES
     ======================================================== */

  const header = document.querySelector("#site-header");
  const menuToggle = document.querySelector("[data-menu-toggle]");
  const navigation = document.querySelector("#primary-navigation");
  const yearElement = document.querySelector("[data-current-year]");

  const mobileBreakpoint = window.matchMedia(
    "(max-width: 800px)"
  );

  /* ========================================================
     02. MOBILE NAVIGATION
     ======================================================== */

  function isMenuOpen() {
    return navigation?.classList.contains("is-open") ?? false;
  }

  function setMenuOpen(open) {
    if (!menuToggle || !navigation) return;

    const shouldOpen = open && mobileBreakpoint.matches;

    menuToggle.classList.toggle("is-active", shouldOpen);
    navigation.classList.toggle("is-open", shouldOpen);

    menuToggle.setAttribute(
      "aria-expanded",
      String(shouldOpen)
    );

    menuToggle.setAttribute(
      "aria-label",
      shouldOpen ? "Close navigation menu" : "Open navigation menu"
    );

    document.body.classList.toggle(
      "menu-open",
      shouldOpen
    );
  }

  function closeMenu(returnFocus = false) {
    if (!isMenuOpen()) return;

    setMenuOpen(false);

    if (returnFocus) {
      menuToggle?.focus();
    }
  }

  if (menuToggle && navigation) {

    // Toggle navigation when the menu button is pressed.
    menuToggle.addEventListener("click", () => {
      setMenuOpen(!isMenuOpen());
    });

    // Close navigation after selecting a section.
    navigation.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", () => {
        closeMenu();
      });
    });

    // Close the menu when clicking outside the header.
    document.addEventListener("pointerdown", (event) => {
      if (
        isMenuOpen() &&
        header &&
        !header.contains(event.target)
      ) {
        closeMenu();
      }
    });

    // Escape closes the menu and returns keyboard focus.
    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape" && isMenuOpen()) {
        closeMenu(true);
      }
    });

    // Reset mobile navigation when switching to desktop.
    function handleBreakpointChange() {
      closeMenu();
    }

    if (typeof mobileBreakpoint.addEventListener === "function") {
      mobileBreakpoint.addEventListener(
        "change",
        handleBreakpointChange
      );
    } else if (typeof mobileBreakpoint.addListener === "function") {
      mobileBreakpoint.addListener(handleBreakpointChange);
    }

    // Handle changes to the URL fragment.
    window.addEventListener("hashchange", () => {
      closeMenu();
    });
  }

  /* ========================================================
     03. STICKY HEADER SCROLL STATE
     ======================================================== */

  if (header) {
    let scrollScheduled = false;

    function updateHeader() {
      header.classList.toggle(
        "is-scrolled",
        window.scrollY > 20
      );

      scrollScheduled = false;
    }

    function handleScroll() {
      if (scrollScheduled) return;

      scrollScheduled = true;

      window.requestAnimationFrame(updateHeader);
    }

    window.addEventListener("scroll", handleScroll, {
      passive: true
    });

    // Initialize correctly when restoring a scrolled page.
    updateHeader();
  }

  /* ========================================================
     04. SCROLL REVEAL ANIMATIONS
     ======================================================== */

  const revealElements = document.querySelectorAll(
    "[data-reveal]"
  );

  const prefersReducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  );

  function initializeRevealAnimations() {
    if (!revealElements.length) return;

    // Keep content visible when motion should be reduced.
    if (prefersReducedMotion.matches) return;

    // The site remains fully readable without this API.
    if (!("IntersectionObserver" in window)) return;

    const observer = new IntersectionObserver(
      (entries, currentObserver) => {

        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;

          entry.target.classList.add("is-visible");

          // Each element only needs to animate once.
          currentObserver.unobserve(entry.target);
        });

      },
      {
        root: null,
        rootMargin: "0px 0px -35px 0px",
        threshold: 0.08
      }
    );

    revealElements.forEach((element) => {
      observer.observe(element);
    });

    // Only enable hidden starting states after observers exist.
    document.documentElement.classList.add("js-enabled");
  }

  initializeRevealAnimations();

  /* ========================================================
     05. AUTOMATIC COPYRIGHT YEAR
     ======================================================== */

  if (yearElement) {
    yearElement.textContent = String(
      new Date().getFullYear()
    );
  }

  /* ========================================================
     06. KEYBOARD FOCUS HANDLING
     ======================================================== */

  // If keyboard focus leaves an open mobile menu,
  // close it when focus moves outside the header.
  if (header) {
    document.addEventListener("focusin", (event) => {
      if (
        isMenuOpen() &&
        !header.contains(event.target)
      ) {
        closeMenu();
      }
    });
  }

})();