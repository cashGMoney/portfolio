/* Sends the contact form to Zoho Forms through a hidden frame, so the
   visitor stays on this page, then shows a thank-you message. */
(function () {
  "use strict";
  var form = document.querySelector(".contact-form");
  var target = document.querySelector(".zoho-target");
  if (!form || !target) return;
  var status = form.querySelector(".form-status");
  var button = form.querySelector("button[type=submit]");
  var sending = false;
  var timer = null;

  function done(ok) {
    if (!sending) return;
    sending = false;
    clearTimeout(timer);
    button.disabled = false;
    button.textContent = "Send message";
    if (ok) {
      form.reset();
      status.className = "form-status is-success";
      status.textContent = "Thanks, your message was sent. I'll be in touch soon.";
    } else {
      status.className = "form-status is-error";
      status.textContent = "Your message didn't send. Please try again, or reach me on LinkedIn.";
    }
  }

  form.addEventListener("submit", function () {
    // Let the browser post the form into the hidden frame.
    sending = true;
    button.disabled = true;
    button.textContent = "Sending…";
    status.className = "form-status";
    status.textContent = "";
    timer = setTimeout(function () { done(false); }, 20000);
  });

  // The hidden frame loads Zoho's confirmation page once the entry is saved.
  target.addEventListener("load", function () { done(true); });
})();
