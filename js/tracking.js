(function () {
  "use strict";

  var config = window.RSG_CONFIG || {};
  var attribution = initAttribution();

  window.RSGAttribution = attribution;
  window.RSGTrack = trackEvent;

  initGoogleAnalytics(config.googleAnalyticsId);
  initSearchConsoleMeta(config.googleSearchConsoleVerification);
  initGoogleBusinessProfileLinks(config.googleBusinessProfileUrl);
  initInteractionTracking();

  function initGoogleAnalytics(measurementId) {
    if (!measurementId || !/^G-[A-Z0-9]+$/i.test(measurementId)) return;

    window.dataLayer = window.dataLayer || [];
    window.gtag =
      window.gtag ||
      function () {
        window.dataLayer.push(arguments);
      };

    window.gtag("js", new Date());
    window.gtag("config", measurementId, {
      page_title: document.title,
      page_location: window.location.href
    });

    if (document.querySelector('script[src*="googletagmanager.com/gtag/js"]')) return;

    var script = document.createElement("script");
    script.async = true;
    script.src = "https://www.googletagmanager.com/gtag/js?id=" + encodeURIComponent(measurementId);
    document.head.appendChild(script);
  }

  function initSearchConsoleMeta(verificationCode) {
    if (!verificationCode || document.querySelector('meta[name="google-site-verification"]')) return;

    var meta = document.createElement("meta");
    meta.name = "google-site-verification";
    meta.content = verificationCode;
    document.head.appendChild(meta);
  }

  function initGoogleBusinessProfileLinks(profileUrl) {
    if (!profileUrl) return;

    document.querySelectorAll("[data-google-business-profile]").forEach(function (link) {
      link.setAttribute("href", profileUrl);
      link.removeAttribute("hidden");
    });
  }

  function initInteractionTracking() {
    document.addEventListener("click", function (event) {
      var target = event.target.closest("a, button");
      if (!target) return;

      var href = target.getAttribute("href") || "";
      if (href.indexOf("tel:") === 0) {
        trackEvent("phone_click", { link_text: getText(target), phone_number: href.replace("tel:", "") });
      } else if (href.indexOf("mailto:") === 0) {
        trackEvent("email_click", { link_text: getText(target) });
      } else if (href.indexOf("contact.html") !== -1 || target.matches("[data-planner-contact]")) {
        trackEvent("estimate_cta_click", { link_text: getText(target), destination: href });
      } else if (target.matches("[data-planner-build]")) {
        trackEvent("project_planner_build", { link_text: getText(target) });
      } else if (target.matches("[data-google-business-profile]")) {
        trackEvent("google_business_profile_click", { link_text: getText(target) });
      }
    });

    document.addEventListener(
      "submit",
      function (event) {
        var form = event.target.closest("form");
        if (!form) return;
        trackEvent("form_submit_attempt", getFormContext(form));
      },
      true
    );
  }

  function initAttribution() {
    var stored = getStoredAttribution();
    if (stored) return stored;

    var params = new URLSearchParams(window.location.search);
    var data = {
      landing_page: window.location.href,
      referrer: document.referrer || "",
      first_seen_at: new Date().toISOString()
    };

    ["utm_source", "utm_medium", "utm_campaign", "utm_term", "utm_content", "gclid", "gbraid", "wbraid"].forEach(function (key) {
      var value = params.get(key);
      if (value) data[key] = value;
    });

    try {
      window.sessionStorage.setItem("rsg_attribution", JSON.stringify(data));
    } catch (error) {
      return data;
    }

    return data;
  }

  function getStoredAttribution() {
    try {
      var stored = window.sessionStorage.getItem("rsg_attribution");
      return stored ? JSON.parse(stored) : null;
    } catch (error) {
      return null;
    }
  }

  function trackEvent(eventName, params) {
    var payload = mergeObjects(
      {
        page_location: window.location.href,
        page_title: document.title
      },
      attribution,
      params || {}
    );

    if (typeof window.gtag === "function") {
      window.gtag("event", eventName, payload);
    }
  }

  function getFormContext(form) {
    var serviceField = form.querySelector('[name="Service"], [name="service"]');
    var projectTypeField = form.querySelector('[name="Project Type"]');
    var timelineField = form.querySelector('[name="Project Timeline"]');
    var budgetField = form.querySelector('[name="Budget Range"]');
    return {
      form_id: form.id || form.getAttribute("name") || "website_form",
      form_name: form.getAttribute("aria-label") || form.getAttribute("data-form-name") || "",
      service: serviceField ? serviceField.value : "",
      project_type: projectTypeField ? projectTypeField.value : "",
      timeline: timelineField ? timelineField.value : "",
      budget_range: budgetField ? budgetField.value : ""
    };
  }

  function getText(element) {
    return (element.textContent || "").replace(/\s+/g, " ").trim().slice(0, 120);
  }

  function mergeObjects() {
    var output = {};
    Array.prototype.forEach.call(arguments, function (source) {
      Object.keys(source || {}).forEach(function (key) {
        if (source[key] !== "" && source[key] !== null && source[key] !== undefined) {
          output[key] = source[key];
        }
      });
    });
    return output;
  }
})();
