(function () {
  "use strict";

  var WEB3FORMS_ENDPOINT = "https://api.web3forms.com/submit";
  var ESTIMATE_EMAIL = "Kris@reddysteadygo.com";

  document.addEventListener("DOMContentLoaded", function () {
    initPhoneFormatting();
    initEstimateForms();
  });

  function initPhoneFormatting() {
    document.querySelectorAll("[data-phone-format]").forEach(function (input) {
      input.addEventListener("input", function () {
        var digits = input.value.replace(/\D/g, "").slice(0, 10);
        var formatted = digits;
        if (digits.length > 6) {
          formatted = "(" + digits.slice(0, 3) + ") " + digits.slice(3, 6) + "-" + digits.slice(6);
        } else if (digits.length > 3) {
          formatted = "(" + digits.slice(0, 3) + ") " + digits.slice(3);
        } else if (digits.length > 0) {
          formatted = "(" + digits;
        }
        input.value = formatted;
      });
    });
  }

  function initEstimateForms() {
    document.querySelectorAll("form[data-web3forms]").forEach(function (form) {
      setupForm(form);
    });
  }

  function setupForm(form) {
    var submitBtn = form.querySelector('button[type="submit"]');
    var submitLabel = submitBtn ? submitBtn.textContent : "";
    var successBox = document.getElementById(form.getAttribute("data-success-target") || "");
    var errorBox = document.getElementById(form.getAttribute("data-error-target") || "");

    form.setAttribute("novalidate", "novalidate");

    form.addEventListener("submit", function (event) {
      event.preventDefault();
      clearFieldErrors(form);
      hideStatus(successBox);
      hideStatus(errorBox);

      var honeypot = form.querySelector('input[name="botcheck"]');
      if (honeypot && honeypot.checked) {
        form.reset();
        showStatus(successBox, "Thanks. We will follow up shortly.");
        return;
      }

      var invalidField = validateForm(form);
      if (invalidField) {
        invalidField.focus();
        return;
      }

      var accessKey = getWeb3FormsAccessKey();
      if (!accessKey) {
        trackLeadEvent("lead_email_fallback", form);
        openMailFallback(form, successBox);
        return;
      }

      submitToWeb3Forms(form, submitBtn, submitLabel, successBox, errorBox, accessKey);
    });
  }

  function submitToWeb3Forms(form, submitBtn, submitLabel, successBox, errorBox, accessKey) {
    var formData = new FormData(form);
    formData.set("access_key", accessKey);
    formData.set("page_url", window.location.href);
    formData.set("page_title", document.title);
    appendAttributionFields(formData);

    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.textContent = "Sending...";
    }

    fetch(WEB3FORMS_ENDPOINT, {
      method: "POST",
      body: formData
    })
      .then(function (response) {
        return response.json();
      })
      .then(function (data) {
        if (data.success) {
          form.reset();
          showStatus(successBox, "Thanks. Your message has been sent. We will follow up within one business day.");
          trackLeadEvent("lead_form_submit", form);
        } else {
          showStatus(errorBox, data.message || "Something went wrong. Please call (402) 415-9253 instead.");
          trackLeadEvent("lead_form_error", form);
        }
      })
      .catch(function () {
        showStatus(errorBox, "Network error. Your message was not sent. Please call (402) 415-9253 instead.");
        trackLeadEvent("lead_form_error", form);
      })
      .finally(function () {
        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.textContent = submitLabel;
        }
      });
  }

  function openMailFallback(form, successBox) {
    var subject = getFieldValue(form, "subject") || "Estimate request from Reddy Steady Go website";
    var lines = ["New estimate request", ""];

    collectVisibleFields(form).forEach(function (field) {
      lines.push(field.label + ": " + field.value);
    });

    lines.push("");
    lines.push("Page: " + window.location.href);
    addAttributionLines(lines);
    lines.push("");
    lines.push("Sent from reddysteadygo website form.");

    var href =
      "mailto:" +
      encodeURIComponent(ESTIMATE_EMAIL) +
      "?subject=" +
      encodeURIComponent(subject) +
      "&body=" +
      encodeURIComponent(lines.join("\n"));

    window.location.href = href;
    showStatus(successBox, getFallbackSuccessMessage(form));
  }

  function getWeb3FormsAccessKey() {
    var config = window.RSG_CONFIG || {};
    return config.web3FormsAccessKey ? config.web3FormsAccessKey.trim() : "";
  }

  function appendAttributionFields(formData) {
    var attribution = getAttribution();
    Object.keys(attribution).forEach(function (key) {
      formData.set(key, attribution[key]);
    });
  }

  function addAttributionLines(lines) {
    var attribution = getAttribution();
    if (attribution.landing_page) lines.push("Landing page: " + attribution.landing_page);
    if (attribution.referrer) lines.push("Referrer: " + attribution.referrer);
    ["utm_source", "utm_medium", "utm_campaign", "utm_term", "utm_content", "gclid"].forEach(function (key) {
      if (attribution[key]) lines.push(key + ": " + attribution[key]);
    });
  }

  function getAttribution() {
    return window.RSGAttribution || {};
  }

  function trackLeadEvent(eventName, form) {
    if (typeof window.RSGTrack !== "function") return;
    var service = getFieldValue(form, "Service") || getFieldValue(form, "service");
    window.RSGTrack(eventName, {
      form_id: form.id || form.getAttribute("name") || "website_form",
      service: service,
      project_type: getFieldValue(form, "Project Type"),
      timeline: getFieldValue(form, "Project Timeline"),
      budget_range: getFieldValue(form, "Budget Range")
    });
  }

  function collectVisibleFields(form) {
    var fields = [];
    form.querySelectorAll("input, select, textarea").forEach(function (field) {
      if (!field.name || field.type === "hidden" || field.name === "botcheck") return;
      var value = getFieldSummaryValue(field);
      if (!value) return;
      var label = findLabelText(form, field) || field.name;
      fields.push({ label: label.replace(/\s*\*$/, ""), value: value });
    });
    return fields;
  }

  function getFieldSummaryValue(field) {
    if (field.type === "file") {
      if (!field.files || !field.files.length) return "";
      return Array.prototype.slice
        .call(field.files)
        .map(function (file) {
          return file.name + " (" + formatFileSize(file.size) + ") - attach manually if your email app opens";
        })
        .join(", ");
    }
    return field.value ? field.value.trim() : "";
  }

  function getFallbackSuccessMessage(form) {
    if (hasFileUploads(form)) {
      return "Your email app is opening with the estimate request. Attach your photo or plan file before sending the email to complete your request.";
    }
    return "Your email app is opening with the estimate request. Send the email to complete your request.";
  }

  function hasFileUploads(form) {
    return Array.prototype.some.call(form.querySelectorAll('input[type="file"]'), function (field) {
      return field.files && field.files.length;
    });
  }

  function findLabelText(form, field) {
    if (!field.id) return "";
    var label = form.querySelector('label[for="' + field.id + '"]');
    return label ? label.textContent.trim() : "";
  }

  function getFieldValue(form, name) {
    var field = form.querySelector('[name="' + name + '"]');
    return field && field.value ? field.value.trim() : "";
  }

  function showStatus(box, message) {
    if (!box) return;
    box.textContent = message;
    box.classList.add("visible");
  }

  function hideStatus(box) {
    if (!box) return;
    box.classList.remove("visible");
  }

  function validateForm(form) {
    var firstInvalid = null;
    var fields = form.querySelectorAll("input[required], select[required], textarea[required], input[type=email], input[type=url], input[type=file]");
    fields.forEach(function (field) {
      var message = "";
      if (field.hasAttribute("required") && !field.value.trim()) {
        message = "This field is required.";
      } else if (field.type === "email" && field.value.trim() && !isValidEmail(field.value.trim())) {
        message = "Enter a valid email address.";
      } else if (field.type === "url" && field.value.trim() && !isValidUrl(field.value.trim())) {
        message = "Enter a valid link, starting with https://.";
      } else if (field.hasAttribute("data-phone-format") && field.value.trim()) {
        var digits = field.value.replace(/\D/g, "");
        if (digits.length !== 10) message = "Enter a 10-digit phone number.";
      } else if (field.type === "file" && field.files && field.files.length) {
        message = validateFileField(field);
      }

      if (message) {
        markFieldInvalid(field, message);
        if (!firstInvalid) firstInvalid = field;
      }
    });
    return firstInvalid;
  }

  function markFieldInvalid(field, message) {
    field.classList.add("field-invalid");
    field.setAttribute("aria-invalid", "true");
    var errorEl = document.getElementById(field.id + "-error");
    if (errorEl) {
      errorEl.textContent = message;
      errorEl.classList.add("visible");
    }
  }

  function clearFieldErrors(form) {
    form.querySelectorAll(".field-invalid").forEach(function (field) {
      field.classList.remove("field-invalid");
      field.removeAttribute("aria-invalid");
    });
    form.querySelectorAll(".field-error").forEach(function (el) {
      el.classList.remove("visible");
      el.textContent = "";
    });
  }

  function isValidEmail(value) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
  }

  function isValidUrl(value) {
    try {
      var url = new URL(value);
      return url.protocol === "https:" || url.protocol === "http:";
    } catch (error) {
      return false;
    }
  }

  function validateFileField(field) {
    var maxSize = parseInt(field.getAttribute("data-max-file-size") || "0", 10);
    var acceptedTypes = (field.getAttribute("accept") || "")
      .split(",")
      .map(function (type) {
        return type.trim();
      })
      .filter(Boolean);

    for (var i = 0; i < field.files.length; i += 1) {
      var file = field.files[i];
      if (maxSize && file.size > maxSize) {
        return "File must be under " + formatFileSize(maxSize) + ".";
      }
      if (acceptedTypes.length && !isAcceptedFile(file, acceptedTypes)) {
        return "Use a JPG, PNG, WebP, or PDF file.";
      }
    }

    return "";
  }

  function isAcceptedFile(file, acceptedTypes) {
    var extension = "." + file.name.split(".").pop().toLowerCase();
    return acceptedTypes.some(function (type) {
      if (type.charAt(0) === ".") return type.toLowerCase() === extension;
      if (type.indexOf("/*") !== -1) return file.type.indexOf(type.replace("/*", "/")) === 0;
      return file.type === type;
    });
  }

  function formatFileSize(bytes) {
    if (bytes < 1024) return bytes + " B";
    if (bytes < 1048576) return Math.round(bytes / 102.4) / 10 + " KB";
    return Math.round(bytes / 104857.6) / 10 + " MB";
  }
})();
