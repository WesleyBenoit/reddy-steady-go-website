(function () {
  "use strict";

  // TODO: replace with a real Web3Forms access key.
  // Get one free at https://web3forms.com/ using kris@pave911.com — no signup
  // required, the key is emailed instantly. Submissions will be delivered to
  // whatever email address you register the key with.
  var WEB3FORMS_ACCESS_KEY = "REPLACE_WITH_YOUR_WEB3FORMS_ACCESS_KEY";
  var WEB3FORMS_ENDPOINT = "https://api.web3forms.com/submit";

  document.addEventListener("DOMContentLoaded", function () {
    initPhoneFormatting();
    initWeb3Forms();
  });

  function initPhoneFormatting() {
    var inputs = document.querySelectorAll("[data-phone-format]");
    inputs.forEach(function (input) {
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

  function initWeb3Forms() {
    var forms = document.querySelectorAll("form[data-web3forms]");
    forms.forEach(function (form) {
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
      if (errorBox) errorBox.classList.remove("visible");

      // Honeypot: Web3Forms convention is a checkbox named "botcheck".
      // If it's checked, a bot filled it in — pretend success and stop.
      var honeypot = form.querySelector('input[name="botcheck"]');
      if (honeypot && honeypot.checked) {
        form.reset();
        if (successBox) successBox.classList.add("visible");
        return;
      }

      var invalidField = validateForm(form);
      if (invalidField) {
        invalidField.focus();
        return;
      }

      if (WEB3FORMS_ACCESS_KEY.indexOf("REPLACE_WITH") === 0) {
        showError(errorBox, "Form is not connected yet — the site owner needs to add a Web3Forms access key (see js/forms.js).");
        return;
      }

      var formData = new FormData(form);
      formData.set("access_key", WEB3FORMS_ACCESS_KEY);

      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.textContent = "Sending…";
      }

      fetch(WEB3FORMS_ENDPOINT, {
        method: "POST",
        headers: { Accept: "application/json" },
        body: formData
      })
        .then(function (response) {
          return response.json();
        })
        .then(function (data) {
          if (data.success) {
            form.reset();
            if (successBox) successBox.classList.add("visible");
          } else {
            showError(errorBox, data.message || "Something went wrong. Please call us instead.");
          }
        })
        .catch(function () {
          showError(errorBox, "Network error — your message wasn't sent. Please call us instead.");
        })
        .finally(function () {
          if (submitBtn) {
            submitBtn.disabled = false;
            submitBtn.textContent = submitLabel;
          }
        });
    });
  }

  function showError(errorBox, message) {
    if (!errorBox) return;
    errorBox.textContent = message;
    errorBox.classList.add("visible");
  }

  function validateForm(form) {
    var firstInvalid = null;
    var fields = form.querySelectorAll("input[required], select[required], textarea[required], input[type=email]");
    fields.forEach(function (field) {
      var message = "";
      if (field.hasAttribute("required") && !field.value.trim()) {
        message = "This field is required.";
      } else if (field.type === "email" && field.value.trim() && !isValidEmail(field.value.trim())) {
        message = "Enter a valid email address.";
      } else if (field.hasAttribute("data-phone-format") && field.value.trim()) {
        var digits = field.value.replace(/\D/g, "");
        if (digits.length !== 10) message = "Enter a 10-digit phone number.";
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
})();
