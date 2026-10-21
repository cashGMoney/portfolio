/* Sends the contact form in the background and shows a message on the page. */
(function () {
  "use strict";
  var form = document.querySelector(".contact-form");
  if (!form) return;
  var status = form.querySelector(".form-status");
  var button = form.querySelector("button[type=submit]");

  form.addEventListener("submit", function (e) {
    e.preventDefault();
    if (form.action.indexOf("YOUR_FORM_ID") !== -1) {
      status.className = "form-status is-error";
      status.textContent = "This form isn't connected yet. Add your Formspree form ID in contact.html.";
      return;
    }
    button.disabled = true;
    button.textContent = "Sending…";
    status.className = "form-status";
    status.textContent = "";
    fetch(form.action, { method: "POST", body: new FormData(form), headers: { Accept: "application/json" } })
      .then(function (res) {
        if (!res.ok) throw new Error();
        form.reset();
        status.className = "form-status is-success";
        status.textContent = "Thanks, your message was sent. I'll be in touch soon.";
      })
      .catch(function () {
        status.className = "form-status is-error";
        status.textContent = "Your message didn't send. Please try again, or reach me on LinkedIn.";
      })
      .then(function () {
        button.disabled = false;
        button.textContent = "Send message";
      });
  });
})();
