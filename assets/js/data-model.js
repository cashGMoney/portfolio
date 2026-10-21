/* ==========================================================
   Interactive data model for the Red Rock admissions CRM.

   Usage:
     <div class="dm" data-model="interactive"></div>   clickable diagram
     <div class="dm" data-model="static"></div>        preview only

   To change the diagram, edit MODULES and LINKS below.
   ========================================================== */

(function () {
  "use strict";

  // Each module: display name, short description, and its position in
  // the wide (desktop) and narrow (phone) layouts. Positions are centers.
  var MODULES = {
    testing:  { name: "Testing Center.RR", group: "students",  wide: [110, 70],  narrow: [92, 40],
      about: "Accuplacer bookings from Zoho Bookings, with math, reading, writing and essay scores." },
    inquiries:{ name: "Inquiries.RR", group: "students",       wide: [420, 50],  narrow: [268, 40],
      about: "First contact at the front desk: name, email, program of interest and preferred cohort. Converts into an application." },
    apps:     { name: "Applications.RR", group: "students",    wide: [270, 160], narrow: [92, 130],
      about: "The applicant's record: program, cohort schedule, ACT/SAT check, Accuplacer results, required documents and stage." },
    programs: { name: "Programs.RR", group: "catalog",        wide: [860, 80],  narrow: [268, 130],
      about: "Each program offered, with its description and total hours." },
    enrolled: { name: "Enrolled.RR", group: "students",        wide: [100, 280], narrow: [92, 220],
      about: "Students with a confirmed seat, tied to their cohort's schedule and current stage." },
    courses:  { name: "Courses.RR", group: "catalog",         wide: [720, 200], narrow: [268, 220],
      about: "The courses inside each program, with hours and the order they're taken in." },
    cohorts:  { name: "Cohorts.RR", group: "catalog",         wide: [520, 320], narrow: [180, 330],
      about: "A scheduled run of a course: start and end dates, days, hours per day, seat capacity, tuition and fees." },
    materials:{ name: "Materials.RR", group: "costs",       wide: [330, 420], narrow: [78, 440],
      about: "Supplies a cohort needs, with the cost of each." },
    books:    { name: "Books.RR", group: "costs",           wide: [610, 430], narrow: [180, 530],
      about: "Required textbooks with ISBN and cost." },
    costs:    { name: "AssociatedCosts.RR", group: "costs", wide: [830, 360], narrow: [282, 440],
      about: "Other fees and items attached to a cohort." }
  };

  // Color groups. The colors themselves live in style.css (.grp-*).
  var GROUPS = {
    students: "Student records",
    catalog:  "Programs and scheduling",
    costs:    "Costs and materials"
  };

  // Connections between modules (lookups in Zoho). Order doesn't matter.
  var LINKS = [
    ["testing", "apps"],
    ["inquiries", "apps"],
    ["inquiries", "programs"],
    ["inquiries", "cohorts"],
    ["apps", "programs"],
    ["apps", "cohorts"],
    ["enrolled", "apps"],
    ["enrolled", "programs"],
    ["enrolled", "courses"],
    ["enrolled", "cohorts"],
    ["courses", "programs"],
    ["courses", "cohorts"],
    ["programs", "cohorts"],
    ["cohorts", "costs"],
    ["cohorts", "books"],
    ["cohorts", "materials"]
  ];

  var LAYOUTS = {
    wide:   { width: 960, height: 470 },
    narrow: { width: 360, height: 575, centerX: 180 }
  };
  var NODE_H = 36;
  var SVG_NS = "http://www.w3.org/2000/svg";

  function el(tag, attrs) {
    var node = document.createElementNS(SVG_NS, tag);
    for (var k in attrs) node.setAttribute(k, attrs[k]);
    return node;
  }

  function nodeWidth(name) {
    return Math.round(name.length * 7.6 + 44);
  }

  function neighbors(id) {
    var out = [];
    LINKS.forEach(function (l) {
      if (l[0] === id) out.push(l[1]);
      else if (l[1] === id) out.push(l[0]);
    });
    return out;
  }

  // Curved connector between the nearest sides of two boxes.
  function edgePath(a, b, layoutName, centerX) {
    // On phones the modules sit in two columns. A line that skips a row
    // leaves from the inner side of the upper box and drops down the gap
    // between the columns, so it never runs behind another module.
    if (layoutName === "narrow") {
      var top = a.y <= b.y ? a : b, low = a.y <= b.y ? b : a;
      if (low.y - top.y > 100 && top.x !== centerX) {
        var inward = top.x < centerX ? 1 : -1;
        var sx = top.x + inward * top.w / 2;
        var ex = low.x, ey = low.y - NODE_H / 2;
        return "M" + sx + " " + top.y + " C" + (centerX + (low.x === centerX ? 0 : inward * -6)) + " " + top.y + " " + ex + " " + (ey - 70) + " " + ex + " " + ey;
      }
    }
    var ax = a.x, ay = a.y, bx = b.x, by = b.y;
    var gapX = Math.abs(bx - ax) - (a.w + b.w) / 2;
    var gapY = Math.abs(by - ay) - NODE_H;
    if (gapX > 12 || gapX > gapY) {
      var dir = bx > ax ? 1 : -1;
      var x1 = ax + dir * a.w / 2, x2 = bx - dir * b.w / 2;
      var mid = (x2 - x1) / 2;
      return "M" + x1 + " " + ay + " C" + (x1 + mid) + " " + ay + " " + (x2 - mid) + " " + by + " " + x2 + " " + by;
    }
    var dirY = by > ay ? 1 : -1;
    var y1 = ay + dirY * NODE_H / 2, y2 = by - dirY * NODE_H / 2;
    var midY = (y2 - y1) / 2;
    return "M" + ax + " " + y1 + " C" + ax + " " + (y1 + midY) + " " + bx + " " + (y2 - midY) + " " + bx + " " + y2;
  }

  function build(container) {
    var interactive = container.getAttribute("data-model") === "interactive";
    var selected = null;
    var currentLayout = null;
    var svg, edgeLayer, nodeLayer, edgeEls = [], nodeEls = {};

    var stage = document.createElement("div");
    stage.className = "dm-stage";
    container.appendChild(stage);

    if (interactive) {
      var legend = document.createElement("ul");
      legend.className = "dm-legend";
      Object.keys(GROUPS).forEach(function (key) {
        var li = document.createElement("li");
        li.className = "grp-" + key;
        li.textContent = GROUPS[key];
        legend.appendChild(li);
      });
      container.appendChild(legend);
    }

    var panel = null;
    if (interactive) {
      panel = document.createElement("div");
      panel.className = "dm-panel";
      panel.setAttribute("aria-live", "polite");
      container.appendChild(panel);
    }

    function render(layoutName) {
      currentLayout = layoutName;
      var L = LAYOUTS[layoutName];
      stage.innerHTML = "";
      edgeEls = [];
      nodeEls = {};

      svg = el("svg", {
        viewBox: "0 0 " + L.width + " " + L.height,
        role: interactive ? "group" : "img",
        "aria-label": "Data model with ten connected modules" + (interactive ? ". Select a module to highlight its connections." : "")
      });
      edgeLayer = el("g", { "class": "dm-edges" });
      nodeLayer = el("g", { "class": "dm-nodes" });
      svg.appendChild(edgeLayer);
      svg.appendChild(nodeLayer);
      stage.appendChild(svg);

      var geo = {};
      Object.keys(MODULES).forEach(function (id) {
        var m = MODULES[id];
        var pos = m[layoutName];
        geo[id] = { x: pos[0], y: pos[1], w: nodeWidth(m.name) };
      });

      LINKS.forEach(function (l) {
        var path = el("path", { d: edgePath(geo[l[0]], geo[l[1]], layoutName, L.centerX), "class": "dm-edge" });
        path._ends = l;
        edgeLayer.appendChild(path);
        edgeEls.push(path);
      });

      Object.keys(MODULES).forEach(function (id) {
        var g = geo[id];
        var group = el("g", { "class": "dm-node grp-" + MODULES[id].group, transform: "translate(" + (g.x - g.w / 2) + " " + (g.y - NODE_H / 2) + ")" });
        group.appendChild(el("rect", { width: g.w, height: NODE_H, rx: 8 }));
        group.appendChild(el("circle", { cx: 16, cy: NODE_H / 2, r: 4.5, "class": "dm-dot" }));
        var text = el("text", { x: g.w / 2 + 7, y: NODE_H / 2, "dominant-baseline": "central", "text-anchor": "middle" });
        text.textContent = MODULES[id].name;
        group.appendChild(text);

        if (interactive) {
          group.setAttribute("tabindex", "0");
          group.setAttribute("role", "button");
          group.setAttribute("aria-label", MODULES[id].name);
          group.addEventListener("click", function (e) {
            e.stopPropagation();
            select(selected === id ? null : id);
          });
          group.addEventListener("keydown", function (e) {
            if (e.key === "Enter" || e.key === " ") {
              e.preventDefault();
              select(selected === id ? null : id);
            } else if (e.key === "Escape") {
              select(null);
            }
          });
        }
        nodeLayer.appendChild(group);
        nodeEls[id] = group;
      });

      if (interactive) {
        svg.addEventListener("click", function () { select(null); });
      }
      select(selected, true);
    }

    function select(id, silent) {
      selected = id;
      var linked = id ? neighbors(id) : [];
      container.classList.toggle("has-selection", !!id);

      Object.keys(nodeEls).forEach(function (key) {
        var n = nodeEls[key];
        n.classList.toggle("is-selected", key === id);
        n.classList.toggle("is-linked", linked.indexOf(key) !== -1);
        if (interactive) n.setAttribute("aria-pressed", key === id ? "true" : "false");
      });

      edgeEls.forEach(function (path) {
        var on = !!id && path._ends.indexOf(id) !== -1;
        path.classList.toggle("is-active", on);
        // Draw active connectors on top of the gray ones.
        if (on) edgeLayer.appendChild(path);
      });

      if (panel && !silent) updatePanel(id, linked);
      if (panel && silent && !panel.innerHTML) updatePanel(id, linked);
    }

    function updatePanel(id, linked) {
      panel.innerHTML = "";
      if (!id) {
        var hint = document.createElement("p");
        hint.className = "dm-hint";
        hint.textContent = "Select a module to see what it connects to.";
        panel.appendChild(hint);
        return;
      }
      var m = MODULES[id];
      var title = document.createElement("h3");
      title.textContent = m.name;
      var tag = document.createElement("p");
      tag.className = "dm-tag grp-" + m.group;
      tag.textContent = GROUPS[m.group];
      var about = document.createElement("p");
      about.textContent = m.about;
      var label = document.createElement("p");
      label.className = "dm-label";
      label.textContent = "Connects to " + linked.length + (linked.length === 1 ? " module" : " modules");
      var list = document.createElement("ul");
      list.className = "dm-links";
      linked.forEach(function (key) {
        var li = document.createElement("li");
        var btn = document.createElement("button");
        btn.type = "button";
        btn.textContent = MODULES[key].name;
        btn.addEventListener("click", function () {
          select(key);
          nodeEls[key].focus({ preventScroll: true });
        });
        li.appendChild(btn);
        list.appendChild(li);
      });
      panel.appendChild(tag);
      panel.appendChild(title);
      panel.appendChild(about);
      panel.appendChild(label);
      panel.appendChild(list);
    }

    function pickLayout() {
      // Previews always use the wide layout; the interactive version switches on small screens.
      var name = interactive && container.clientWidth < 560 ? "narrow" : "wide";
      if (name !== currentLayout) render(name);
    }

    pickLayout();
    if (window.ResizeObserver) {
      new ResizeObserver(pickLayout).observe(container);
    } else {
      window.addEventListener("resize", pickLayout);
    }
  }

  function init() {
    var nodes = document.querySelectorAll("[data-model]");
    for (var i = 0; i < nodes.length; i++) build(nodes[i]);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
