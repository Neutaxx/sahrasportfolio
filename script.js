/* ═══════════════════════════════════════════
   SAHRA · PORTFOLIO · SCRIPT
   Navigation · Galleries · Lightbox
   ═══════════════════════════════════════════ */

(function () {
  "use strict";

  /* ────── View navigation ────── */
  const views = document.querySelectorAll(".view");

  function showView(id) {
    views.forEach((v) => v.classList.remove("active"));
    const target = document.getElementById(id);
    if (target) {
      target.classList.add("active");
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
    closeDropdown();
  }

  document.querySelectorAll("[data-view]").forEach((el) => {
    el.addEventListener("click", (e) => {
      e.preventDefault();
      const id = el.getAttribute("data-view");
      if (id) showView(id);
    });
  });

  /* ────── Dropdown (click on mobile / hover handled by CSS) ────── */
  const dropdown = document.querySelector(".dropdown");
  const toggle = document.querySelector(".dropdown-toggle");

  function closeDropdown() {
    if (dropdown) dropdown.classList.remove("open");
  }

  if (toggle) {
    toggle.addEventListener("click", (e) => {
      e.stopPropagation();
      dropdown.classList.toggle("open");
    });
  }

  document.addEventListener("click", (e) => {
    if (dropdown && !dropdown.contains(e.target)) closeDropdown();
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      closeDropdown();
      closeLightbox();
    }
  });

  /* ────── Gallery population ────── */
  /**
   * Define, per cycle and per section, which image filenames to display.
   * Leave the array empty for an empty (+ Add image) gallery.
   * Files go inside the `images/` folder.
   *
   * Section keys must match their order inside the cycle view:
   *   0 ielts, 1 grammar, 2 notes, 3 formative, 4 summative, 5+ specifics
   */
  const GALLERY_DATA = {
    cycle1: {
      ielts: ["Modulo 1.jpeg", "modulo 2.jpeg"],
      grammar: [], notes: [], formative: [], summative: []
    },
    cycle2: {
      ielts: ["modulo 3.jpeg", "modulo 4.jpeg"],
      grammar: [], notes: [],
      formative: ["Actividad Formativa ciclo 2.jpeg"],
      summative: [],
      sources: [], apa: []
    },
    cycle3: {
      ielts: ["modulo 5.jpeg", "modulo 6.jpeg"],
      grammar: [], notes: [], formative: [], summative: [],
      mock: []
    },
    cycle4: {
      ielts: ["modulo 7.jpeg", "modulo 8.jpeg"],
      grammar: [], notes: [], formative: [], summative: []
    },
    cycle5: {
      ielts: ["modulo 9.jpeg"],
      grammar: [], notes: [], formative: [], summative: [],
      campaign: []
    },
    cycle6: {
      ielts: ["modulo 10.jpeg"],
      grammar: [], notes: [],
      formative: ["Summary activity sexto ciclo 1.jpeg", "Summary activity sexto ciclo 2.jpeg"],
      summative: [],
      reflection: []
    },
    cycle7: {
      ielts: ["modulo 11.jpeg"],
      grammar: [], notes: [], formative: [], summative: []
    },
  };

  // Map each cycle's section order to its data key
  const SECTION_ORDER = {
    cycle1: ["ielts", "grammar", "notes", "formative", "summative"],
    cycle2: ["ielts", "grammar", "notes", "formative", "summative", "sources", "apa"],
    cycle3: ["ielts", "grammar", "notes", "formative", "summative", "mock"],
    cycle4: ["ielts", "grammar", "notes", "formative", "summative"],
    cycle5: ["ielts", "grammar", "notes", "formative", "summative", "campaign"],
    cycle6: ["ielts", "grammar", "notes", "formative", "summative", "reflection"],
    cycle7: ["ielts", "grammar", "notes", "formative", "summative"],
  };

  // Default minimum empty slots to show when there's no image
  const EMPTY_SLOTS = 4;

  function buildGalleries() {
    Object.keys(SECTION_ORDER).forEach((cycleId) => {
      const cycleEl = document.getElementById(cycleId);
      if (!cycleEl) return;

      const galleries = cycleEl.querySelectorAll(".gallery");
      const order = SECTION_ORDER[cycleId];
      const data = GALLERY_DATA[cycleId] || {};

      galleries.forEach((gallery, idx) => {
        const key = order[idx];
        const images = (data[key] || []);
        gallery.innerHTML = "";

        if (images.length > 0) {
          images.forEach((src) => gallery.appendChild(makeImageSlot(src)));
        } else {
          for (let i = 0; i < EMPTY_SLOTS; i++) {
            gallery.appendChild(makeEmptySlot());
          }
        }
      });
    });
  }

  function makeImageSlot(src) {
    const slot = document.createElement("div");
    slot.className = "image-slot";
    const img = document.createElement("img");
    img.src = "images/" + encodeURIComponent(src);
    img.alt = "";
    img.loading = "lazy";
    img.addEventListener("error", () => {
      // replace with empty slot if image fails to load
      const empty = makeEmptySlot();
      slot.replaceWith(empty);
    });
    slot.appendChild(img);
    slot.addEventListener("click", () => openLightbox(img.src));
    return slot;
  }

  function makeEmptySlot() {
    const slot = document.createElement("div");
    slot.className = "image-slot empty";
    const label = document.createElement("span");
    label.className = "add-label";
    label.textContent = "+ Add image";
    slot.appendChild(label);
    return slot;
  }

  /* ────── Lightbox ────── */
  const lightbox = document.getElementById("lightbox");
  const lightboxImg = lightbox ? lightbox.querySelector(".lightbox-img") : null;
  const lightboxClose = lightbox ? lightbox.querySelector(".lightbox-close") : null;

  function openLightbox(src) {
    if (!lightbox || !lightboxImg) return;
    lightboxImg.src = src;
    lightbox.classList.add("open");
    lightbox.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";
  }
  function closeLightbox() {
    if (!lightbox) return;
    lightbox.classList.remove("open");
    lightbox.setAttribute("aria-hidden", "true");
    document.body.style.overflow = "";
  }

  if (lightbox) {
    lightbox.addEventListener("click", (e) => {
      if (e.target === lightbox) closeLightbox();
    });
  }
  if (lightboxClose) lightboxClose.addEventListener("click", closeLightbox);

  /* ────── Petal parallax with mouse ────── */
  const petals = document.querySelectorAll(".petal");
  let mouseX = 0, mouseY = 0, targetX = 0, targetY = 0;
  document.addEventListener("mousemove", (e) => {
    targetX = (e.clientX / window.innerWidth - 0.5) * 2;
    targetY = (e.clientY / window.innerHeight - 0.5) * 2;
  });
  function loop() {
    mouseX += (targetX - mouseX) * 0.04;
    mouseY += (targetY - mouseY) * 0.04;
    petals.forEach((p, i) => {
      const depth = (i % 3 + 1) * 8;
      p.style.marginLeft = (mouseX * depth) + "px";
      p.style.marginTop = (mouseY * depth * 0.5) + "px";
    });
    requestAnimationFrame(loop);
  }
  loop();

  /* ────── Init ────── */
  document.addEventListener("DOMContentLoaded", buildGalleries);
  // In case the script loads after DOMContentLoaded:
  if (document.readyState !== "loading") buildGalleries();
})();
