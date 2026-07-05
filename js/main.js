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
    initScrollReveal();
    initLazyMaps();
    initProjectPlanner();
    initAreaRouter();
    initContactPrefill();
    initPrintButtons();
    initCompanyCopy();
    initConversionDock();
  });

  function initLazyMaps() {
    document.querySelectorAll("[data-map-embed]").forEach(function (container) {
      var button = container.querySelector(".map-embed-placeholder");
      if (!button) return;
      button.addEventListener("click", function () {
        var iframe = document.createElement("iframe");
        iframe.src = container.getAttribute("data-map-src");
        iframe.title = container.getAttribute("data-map-title") || "Map";
        iframe.loading = "lazy";
        container.innerHTML = "";
        container.appendChild(iframe);
      });
    });
  }

  function initScrollReveal() {
    if (!("IntersectionObserver" in window)) return;
    if (window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    // Excludes .gallery-tile and individual .testimonial slides deliberately:
    // both get shown/hidden via style.display by other scripts (filters,
    // the testimonial rotator), and IntersectionObserver won't re-fire just
    // because display changes, so a tile revealed after being filtered back
    // in could get stuck at opacity 0.
    var targets = document.querySelectorAll(
      ".card, .feature, .step, .case-study-card, .capability-card, .buyer-hub-card, .leadership-card, .faq-item, .stat, .credential-badge, .testimonial-track, .planner-panel, .planner-output"
    );
    if (!targets.length) return;

    var observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15, rootMargin: "0px 0px -40px 0px" }
    );

    targets.forEach(function (el, i) {
      el.classList.add("reveal");
      el.style.transitionDelay = Math.min(i % 4, 3) * 60 + "ms";
      observer.observe(el);
    });
  }

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
          '<span class="credential-badge"><span class="seal" aria-hidden="true"><svg class="icon"><use href="assets/icons.svg#icon-' +
          cert.icon +
          '"></use></svg></span>' +
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

  function initProjectPlanner() {
    var root = document.querySelector("[data-project-planner]");
    if (!root) return;

    var serviceEl = root.querySelector("[data-planner-service]");
    var propertyEl = root.querySelector("[data-planner-property]");
    var timelineEl = root.querySelector("[data-planner-timeline]");
    var areaEl = root.querySelector("[data-planner-area]");
    var conditionEls = root.querySelectorAll("[data-planner-condition]");
    var buildBtn = root.querySelector("[data-planner-build]");
    var copyBtn = root.querySelector("[data-planner-copy]");
    var emailLink = root.querySelector("[data-planner-email]");
    var contactLink = root.querySelector("[data-planner-contact]");
    var briefEl = root.querySelector("[data-planner-brief]");
    var scoreEl = root.querySelector("[data-planner-score]");
    var statusDetailEl = root.querySelector("[data-planner-status-detail]");
    var nextEl = root.querySelector("[data-planner-next]");
    if (!serviceEl || !propertyEl || !timelineEl || !areaEl || !briefEl || !nextEl) return;

    var serviceGuidance = {
      Concrete: {
        summary: "I need help with concrete work. Please confirm what measurements, finish details, removal notes, and site access information you need for a written estimate.",
        next: ["Approximate length and width of the area", "Whether old concrete needs removal", "Preferred finish and any drainage concerns"]
      },
      Masonry: {
        summary: "I need help with masonry work. Please confirm what photos, dimensions, material preferences, and structural or drainage concerns you need to review.",
        next: ["Photos of the wall, chimney, steps, or hardscape", "Preferred brick, block, or stone style", "Leaning, cracking, drainage, or access issues"]
      },
      "Commercial Paving": {
        summary: "I need help with commercial paving or parking-lot work. Please confirm what site photos, square footage, traffic constraints, striping needs, and ADA details you need.",
        next: ["Site photos or a marked aerial view", "Business hours, traffic flow, and access constraints", "Striping, ADA, drainage, sealcoating, or phasing needs"]
      },
      "Concrete Repair / Mudjacking": {
        summary: "I need help with concrete repair or slab leveling. Please confirm what photos, trip-hazard locations, slab condition, and drainage details you need.",
        next: ["Photos of sunken slabs and nearby cracks", "Areas that hold water or create trip hazards", "Whether replacement may be needed if the concrete is failing"]
      }
    };

    function getCheckedConditions() {
      return Array.prototype.slice.call(conditionEls)
        .filter(function (field) {
          return field.checked;
        })
        .map(function (field) {
          return field.value;
        });
    }

    function buildBrief() {
      var service = serviceEl.value;
      var property = propertyEl.value;
      var timeline = timelineEl.value;
      var area = areaEl.value;
      var guidance = serviceGuidance[service] || serviceGuidance.Concrete;
      var conditions = getCheckedConditions();
      var requestStatus = "Add site details";
      var statusDetail = "Select any site conditions that apply so Kris can reduce back-and-forth and prepare the right questions before calling back.";
      if (conditions.length >= 3) {
        requestStatus = "Ready to send";
        statusDetail = "Strong request. Kris gets the service, location, timing, and key site issues before the first call.";
      } else if (conditions.length >= 1) {
        requestStatus = "Good start";
        statusDetail = "Enough for a useful callback. Add photos, dimensions, access notes, or drainage details if you have them.";
      }
      var conditionText = conditions.length ? conditions.join("; ") : "Not sure yet. Please tell me what to check or photograph.";

      var brief = [
        "Estimate request for Reddy Steady Go LLC",
        "",
        "Service needed: " + service,
        "Property type: " + property,
        "Project location: " + area,
        "Preferred timing: " + timeline,
        "Site notes: " + conditionText,
        "",
        guidance.summary,
        "",
        "Requested next step: Please call or reply with what you need next for a written estimate."
      ].join("\n");

      briefEl.textContent = brief;
      if (scoreEl) scoreEl.textContent = requestStatus;
      if (statusDetailEl) statusDetailEl.textContent = statusDetail;

      nextEl.innerHTML = guidance.next
        .map(function (item) {
          return "<li>" + item + "</li>";
        })
        .join("");

      var subject = "Estimate request - " + service + " in " + area;
      var href =
        "mailto:Kris@reddysteadygo.com?subject=" +
        encodeURIComponent(subject) +
        "&body=" +
        encodeURIComponent(brief);

      if (emailLink) emailLink.href = href;
      if (contactLink) {
        contactLink.href =
          "contact.html?service=" +
          encodeURIComponent(service) +
          "&message=" +
          encodeURIComponent(brief) +
          "#contact-form";
      }
      return brief;
    }

    function copyBrief() {
      var text = briefEl.textContent || buildBrief();
      var original = copyBtn ? copyBtn.textContent : "";

      function markCopied() {
        if (!copyBtn) return;
        copyBtn.textContent = "Copied";
        setTimeout(function () {
          copyBtn.textContent = original;
        }, 1800);
      }

      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(text).then(markCopied, fallbackCopy);
      } else {
        fallbackCopy();
      }

      function fallbackCopy() {
        var textarea = document.createElement("textarea");
        textarea.value = text;
        textarea.setAttribute("readonly", "readonly");
        textarea.style.position = "fixed";
        textarea.style.left = "-9999px";
        document.body.appendChild(textarea);
        textarea.select();
        try {
          document.execCommand("copy");
          markCopied();
        } finally {
          document.body.removeChild(textarea);
        }
      }
    }

    [serviceEl, propertyEl, timelineEl, areaEl].forEach(function (field) {
      field.addEventListener("change", buildBrief);
    });
    conditionEls.forEach(function (field) {
      field.addEventListener("change", buildBrief);
    });
    if (buildBtn) buildBtn.addEventListener("click", buildBrief);
    if (copyBtn) copyBtn.addEventListener("click", copyBrief);
    buildBrief();
  }

  function initAreaRouter() {
    document.querySelectorAll("[data-area-router]").forEach(function (form) {
      form.addEventListener("submit", function (event) {
        event.preventDefault();
        var select = form.querySelector("[data-area-select]");
        if (select && select.value) window.location.href = select.value;
      });
    });
  }

  function initContactPrefill() {
    var form = document.getElementById("contact-form");
    if (!form || !window.URLSearchParams) return;
    var params = new URLSearchParams(window.location.search);
    var service = params.get("service");
    var message = params.get("message");
    var serviceField = form.querySelector("#service");
    var messageField = form.querySelector("#message");

    if (service && serviceField) {
      Array.prototype.slice.call(serviceField.options).some(function (option) {
        if (option.text === service || option.value === service) {
          serviceField.value = option.value || option.text;
          return true;
        }
        return false;
      });
    }

    if (message && messageField && !messageField.value) {
      messageField.value = message;
    }
  }

  function initPrintButtons() {
    document.querySelectorAll("[data-print-page]").forEach(function (button) {
      button.addEventListener("click", function () {
        window.print();
      });
    });
  }

  function initCompanyCopy() {
    document.querySelectorAll("[data-copy-company]").forEach(function (button) {
      button.addEventListener("click", function () {
        var text = [
          "Reddy Steady Go LLC",
          "Owner / Principal: Kris Reddy",
          "Address: 13811 L Street, Omaha, NE 68137",
          "Phone: (402) 415-9253",
          "Email: Kris@reddysteadygo.com",
          "Services: concrete, masonry, commercial paving, parking lot maintenance, mudjacking, and concrete repair",
          "NAICS: 238110 Concrete Contractors; 238140 Masonry Contractors; 237310 Highway, Street, and Bridge Construction; 238990 Other Specialty Trade Contractors",
          "Website: https://reddysteadygo.com/"
        ].join("\n");
        var original = button.textContent;

        function done() {
          button.textContent = "Company info copied";
          setTimeout(function () {
            button.textContent = original;
          }, 1800);
        }

        if (navigator.clipboard && navigator.clipboard.writeText) {
          navigator.clipboard.writeText(text).then(done, fallbackCopy);
        } else {
          fallbackCopy();
        }

        function fallbackCopy() {
          var textarea = document.createElement("textarea");
          textarea.value = text;
          textarea.setAttribute("readonly", "readonly");
          textarea.style.position = "fixed";
          textarea.style.left = "-9999px";
          document.body.appendChild(textarea);
          textarea.select();
          try {
            document.execCommand("copy");
            done();
          } finally {
            document.body.removeChild(textarea);
          }
        }
      });
    });
  }

  function initConversionDock() {
    if (document.querySelector("[data-conversion-dock]")) return;

    var inArea = window.location.pathname.indexOf("/areas/") !== -1;
    var prefix = inArea ? "../" : "";
    var dock = document.createElement("nav");
    dock.className = "conversion-dock";
    dock.setAttribute("aria-label", "Quick actions");
    dock.setAttribute("data-conversion-dock", "");
    dock.innerHTML = [
      '<a href="' + prefix + 'index.html#project-planner"><span>Plan</span><strong>Project Planner</strong></a>',
      '<a href="tel:+14024159253"><span>Call</span><strong>(402) 415-9253</strong></a>',
      '<a href="' + prefix + 'contact.html#contact-form"><span>Estimate</span><strong>Send Details</strong></a>',
      '<a href="' + prefix + 'capabilities.html#buyer-hub"><span>Buyer</span><strong>Capabilities</strong></a>'
    ].join("");

    document.body.appendChild(dock);
  }
})();
