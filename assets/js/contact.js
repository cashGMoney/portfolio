/* Sizes the Zoho Forms frame to fit the whole form, so it never scrolls
   inside itself. Zoho sends the form's height when the link ends with
   ?zf_rszfm=1. This is the same method as Zoho's own JavaScript embed. */
(function () {
  "use strict";
  window.addEventListener("message", function (event) {
    if (!/\.zohopublic\.com$/.test(new URL(event.origin).hostname)) return;
    if (typeof event.data !== "string") return;
    var parts = event.data.split("|");
    if (parts.length < 2) return;
    var perma = parts[0];
    var height = parseInt(parts[1], 10);
    if (!perma || !height) return;
    var frames = document.querySelectorAll(".zoho-form iframe");
    for (var i = 0; i < frames.length; i++) {
      if (frames[i].src.indexOf(perma) !== -1) {
        frames[i].style.height = (height + 15) + "px";
      }
    }
  }, false);
})();
