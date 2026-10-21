/* Opens the resume in a pop-up. The page images live in about.html. */
(function () {
  "use strict";
  function init() {
    var dialog = document.querySelector(".resume-dialog");
    if (!dialog || typeof dialog.showModal !== "function") return; // links fall back to opening the PDF
    var opener = null;

    function open(link) {
      opener = link || null;
      dialog.showModal();
      dialog.querySelector(".resume-pages").scrollTop = 0;
    }

    document.addEventListener("click", function (e) {
      var link = e.target.closest("[data-resume]");
      if (!link) return;
      e.preventDefault();
      open(link);
    });
    dialog.querySelector(".resume-close").addEventListener("click", function () { dialog.close(); });
    dialog.addEventListener("click", function (e) { if (e.target === dialog) dialog.close(); });
    dialog.addEventListener("close", function () {
      if (opener) opener.focus();
      if (location.hash === "#resume") history.replaceState(null, "", location.pathname);
    });

    // Opened from the home page "View resume" button
    if (location.hash === "#resume") open();
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init);
  else init();
})();
