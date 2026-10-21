/* Opens any link marked data-lightbox in a pop-up viewer instead of a new page. */
(function () {
  "use strict";
  function init() {
    var dialog = document.querySelector("dialog.lightbox");
    if (!dialog || typeof dialog.showModal !== "function") return; // links still open the image normally
    var img = dialog.querySelector("img");
    var caption = dialog.querySelector(".lightbox-caption");
    var lastLink = null;

    document.addEventListener("click", function (e) {
      var link = e.target.closest("[data-lightbox]");
      if (!link) return;
      e.preventDefault();
      lastLink = link;
      img.src = link.getAttribute("href");
      img.alt = link.getAttribute("data-caption") || "";
      caption.textContent = link.getAttribute("data-caption") || "";
      dialog.showModal();
    });

    dialog.querySelector(".lightbox-close").addEventListener("click", function () { dialog.close(); });
    // Click outside the image closes it
    dialog.addEventListener("click", function (e) { if (e.target === dialog) dialog.close(); });
    dialog.addEventListener("close", function () {
      img.removeAttribute("src");
      if (lastLink) lastLink.focus();
    });
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init);
  else init();
})();
