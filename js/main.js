(function () {
  "use strict";

  document.addEventListener("DOMContentLoaded", function () {
    initNav();
    renderStats();
    renderCertifications();
    renderTestimonials();
    initTestimonials();
    initGalleryFilters();
    initFooterYear();
  });

  function getSiteData() {
    return window.SITE_DATA || { stats: [], testimonials: [], certifications: [] };
  }

  function renderStats() {
    var container = document.getElementById("stats-bar-data");
    var data = getSiteData().stats;
    if (!container || !data.length) return;
    container.innerHTML = data
      .map(function (stat) {
        return (
          '<div class="stat"><strong>' + stat.value + "</strong><span>" + stat.label + "</span></div>"
        );
      })
      .join("");
  }

  function renderCertifications() {
    var containers = document.querySelectorAll("[data-certifications]");
    var data = getSiteData().certifications;
    if (!containers.length || !data.length) return;
    var html = data
      .map(function (cert) {
        var label = cert.verified ? cert.label : cert.label + "*";
        return (
          '<span class="credential-badge"><span class="seal" aria-hidden="true">' +
          cert.icon +
          "</span>" +
          label +
          "</span>"
        );
      })
      .join("");
    containers.forEach(function (container) {
      container.innerHTML = html;
    });
  }

  function renderTestimonials() {
    var container = document.getElementById("testimonial-track");
    var data = getSiteData().testimonials;
    if (!container || !data.length) return;
    container.innerHTML = data
      .map(function (t, i) {
        return (
          '<div class="testimonial' +
          (i === 0 ? " active" : "") +
          '"><div class="stars" aria-hidden="true">&#9733;&#9733;&#9733;&#9733;&#9733;</div><blockquote>&ldquo;' +
          t.quote +
          '&rdquo;</blockquote><cite>' +
          t.name +
          " <span>" +
          t.context +
          "</span></cite></div>"
        );
      })
      .join("");
  }

  function initNav() {
    var toggle = document.querySelector(".nav-toggle");
    var links = document.getElementById("nav-links");
    if (!toggle || !links) return;

    toggle.addEventListener("click", function () {
      var expanded = toggle.getAttribute("aria-expanded") === "true";
      toggle.setAttribute("aria-expanded", String(!expanded));
      links.classList.toggle("open");
    });

    links.querySelectorAll("a").forEach(function (link) {
      link.addEventListener("click", function () {
        toggle.setAttribute("aria-expanded", "false");
        links.classList.remove("open");
      });
    });
  }

  function initTestimonials() {
    var items = document.querySelectorAll(".testimonial");
    var dotsWrap = document.querySelector(".testimonial-dots");
    if (!items.length || !dotsWrap) return;

    var current = 0;

    items.forEach(function (_, i) {
      var dot = document.createElement("button");
      dot.type = "button";
      dot.setAttribute("aria-label", "Show testimonial " + (i + 1));
      if (i === 0) dot.classList.add("active");
      dot.addEventListener("click", function () {
        show(i);
      });
      dotsWrap.appendChild(dot);
    });

    var dots = dotsWrap.querySelectorAll("button");

    function show(index) {
      items[current].classList.remove("active");
      dots[current].classList.remove("active");
      current = index;
      items[current].classList.add("active");
      dots[current].classList.add("active");
    }

    setInterval(function () {
      show((current + 1) % items.length);
    }, 6000);
  }

  function initGalleryFilters() {
    var buttons = document.querySelectorAll(".gallery-filters button");
    var tiles = document.querySelectorAll("#gallery-grid .gallery-tile");
    if (!buttons.length || !tiles.length) return;

    buttons.forEach(function (btn) {
      btn.addEventListener("click", function () {
        buttons.forEach(function (b) {
          b.classList.remove("active");
        });
        btn.classList.add("active");
        var filter = btn.getAttribute("data-filter");
        tiles.forEach(function (tile) {
          var match = filter === "all" || tile.getAttribute("data-category") === filter;
          tile.style.display = match ? "" : "none";
        });
      });
    });
  }

  function initFooterYear() {
    var el = document.getElementById("year");
    if (el) el.textContent = new Date().getFullYear();
  }
})();
