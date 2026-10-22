/* Video series on the case study. Each list item's data-video holds a
   YouTube link (any format) or video ID. Items without one show
   "Coming soon". Nothing autoplays on page load. */
(function () {
  "use strict";

  function youTubeId(value) {
    if (!value) return "";
    value = value.trim();
    var m = value.match(/(?:youtu\.be\/|v=|embed\/|shorts\/|live\/)([A-Za-z0-9_-]{11})/);
    if (m) return m[1];
    return /^[A-Za-z0-9_-]{11}$/.test(value) ? value : "";
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
      var ready = !!youTubeId(btn.getAttribute("data-video"));
      btn.classList.toggle("is-ready", ready);
      var len = btn.querySelector(".vs-length");
      if (len && !len.textContent.trim()) len.remove();
    });

    function show(index, autoplay) {
      var btn = items[index];
      var id = youTubeId(btn.getAttribute("data-video"));
      var title = btn.getAttribute("data-title");
      items.forEach(function (b, i) {
        b.classList.toggle("is-active", i === index);
        b.setAttribute("aria-current", i === index ? "true" : "false");
      });
      frame.innerHTML = "";
      if (id) {
        var iframe = document.createElement("iframe");
        iframe.src = "https://www.youtube-nocookie.com/embed/" + id + "?rel=0&modestbranding=1" + (autoplay ? "&autoplay=1" : "");
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
    show(0, false);
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init);
  else init();
})();
