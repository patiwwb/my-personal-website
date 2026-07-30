(function () {
  var doc = document.documentElement;

  /* Theme toggle */
  var btn = document.getElementById("theme-toggle");
  function setLabel() {
    var dark = doc.getAttribute("data-theme") !== "light";
    btn.setAttribute(
      "aria-label",
      dark ? "Switch to light theme" : "Switch to dark theme"
    );
  }
  if (btn) {
    setLabel();
    btn.addEventListener("click", function () {
      var next = doc.getAttribute("data-theme") === "light" ? "dark" : "light";
      doc.setAttribute("data-theme", next);
      try {
        localStorage.setItem("theme", next);
      } catch (e) {}
      setLabel();
    });
  }

  /* Nav hairline once scrolled */
  var nav = document.getElementById("nav");
  function onScroll() {
    nav.classList.toggle("scrolled", window.scrollY > 8);
  }
  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });

  /* Reveal on scroll */
  var targets = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window) {
    var io = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("in");
            io.unobserve(entry.target);
          }
        });
      },
      { rootMargin: "0px 0px -8% 0px", threshold: 0.05 }
    );
    targets.forEach(function (el) {
      io.observe(el);
    });
  } else {
    targets.forEach(function (el) {
      el.classList.add("in");
    });
  }

  /* Highlight the section currently in view */
  var links = Array.prototype.slice.call(
    document.querySelectorAll(".nav-links a")
  );
  var byId = {};
  links.forEach(function (a) {
    byId[a.getAttribute("href").slice(1)] = a;
  });
  var sections = Object.keys(byId)
    .map(function (id) {
      return document.getElementById(id);
    })
    .filter(Boolean);
  if ("IntersectionObserver" in window && sections.length) {
    var active = null;
    var so = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          var link = byId[entry.target.id];
          if (entry.isIntersecting) {
            if (active) active.classList.remove("active");
            active = link;
            if (active) active.classList.add("active");
          } else if (link === active) {
            active.classList.remove("active");
            active = null;
          }
        });
      },
      { rootMargin: "-40% 0px -55% 0px", threshold: 0 }
    );
    sections.forEach(function (s) {
      so.observe(s);
    });
  }
})();
