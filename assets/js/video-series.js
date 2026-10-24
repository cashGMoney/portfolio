/* Video series on the case study. Each list item's data-video holds a
   YouTube or Loom share link. Items without one show "Coming soon".
   Nothing autoplays on page load. */
(function () {
  "use strict";

  function youTubeId(value) {
    if (!value) return "";
    value = value.trim();
    var m = value.match(/(?:youtu\.be\/|v=|embed\/|shorts\/|live\/)([A-Za-z0-9_-]{11})/);
    if (m) return m[1];
    return /^[A-Za-z0-9_-]{11}$/.test(value) ? value : "";
  }

  // Returns the embed address for a YouTube or Loom link, or "" if not recognized.
  function embedUrl(value, autoplay) {
    if (!value) return "";
    var loom = value.match(/loom\.com\/(?:share|embed)\/([a-f0-9]{32})/i);
    if (loom) return "https://www.loom.com/embed/" + loom[1] + "?hide_owner=true&hide_share=true&hideEmbedTopBar=true";
    var yt = youTubeId(value);
    if (yt) return "https://www.youtube-nocookie.com/embed/" + yt + "?rel=0&modestbranding=1" + (autoplay ? "&autoplay=1" : "");
    return "";
  }

  function init() {
    var series = document.querySelector(".video-series");
    if (!series) return;
    var frame = series.querySelector(".vs-player .media-frame");
    var now = series.querySelector(".vs-now");
    var capTitle = series.querySelector(".vs-cap-title");
    var capDesc = series.querySelector(".vs-cap-desc");
    var items = Array.prototype.slice.call(series.querySelectorAll(".vs-item"));
    var total = items.length;

    items.forEach(function (btn) {
      var ready = !!embedUrl(btn.getAttribute("data-video"));
      btn.classList.toggle("is-ready", ready);
      var len = btn.querySelector(".vs-length");
      if (len && !len.textContent.trim()) len.remove();
    });

    function show(index, autoplay) {
      var btn = items[index];
      var src = embedUrl(btn.getAttribute("data-video"), autoplay);
      var title = btn.getAttribute("data-title");
      items.forEach(function (b, i) {
        b.classList.toggle("is-active", i === index);
        b.setAttribute("aria-current", i === index ? "true" : "false");
      });
      frame.innerHTML = "";
      if (src) {
        var iframe = document.createElement("iframe");
        iframe.src = src;
        iframe.title = title;
        iframe.allow = "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share";
        iframe.allowFullscreen = true;
        iframe.loading = "lazy";
        frame.appendChild(iframe);
      } else {
        var ph = document.createElement("div");
        ph.className = "media-placeholder vs-placeholder";
        ph.innerHTML = '<span class="vs-ph-title"></span><span>Video coming soon</span>';
        ph.querySelector(".vs-ph-title").textContent = title;
        frame.appendChild(ph);
      }
      now.textContent = "Part " + (index + 1) + " of " + total;
      capTitle.textContent = title;
      var desc = btn.querySelector(".vs-desc");
      capDesc.textContent = desc ? desc.textContent : "";
    }

    items.forEach(function (btn, i) {
      btn.addEventListener("click", function () { show(i, true); });
    });
    // Open on the first part that has a video, so visitors never land on "coming soon".
    var first = 0;
    for (var k = 0; k < total; k++) {
      if (items[k].classList.contains("is-ready")) { first = k; break; }
    }
    show(first, false);
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init);
  else init();
})();
