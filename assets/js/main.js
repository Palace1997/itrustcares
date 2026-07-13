/* iTrust Cares — interactions: mobile nav, FAQ accordion, scroll reveal, year */
(function () {
  "use strict";

  /* ----- Mobile navigation ----- */
  var toggle = document.querySelector(".nav__toggle");
  var menu = document.getElementById("nav-menu");
  if (toggle && menu) {
    toggle.addEventListener("click", function () {
      var open = menu.classList.toggle("open");
      toggle.setAttribute("aria-expanded", String(open));
    });
    // Close menu when a link is tapped (mobile)
    menu.querySelectorAll("a").forEach(function (a) {
      a.addEventListener("click", function () {
        menu.classList.remove("open");
        toggle.setAttribute("aria-expanded", "false");
      });
    });
  }

  /* ----- FAQ accordion ----- */
  document.querySelectorAll(".acc-trigger").forEach(function (btn) {
    btn.addEventListener("click", function () {
      var expanded = btn.getAttribute("aria-expanded") === "true";
      var panel = document.getElementById(btn.getAttribute("aria-controls"));
      btn.setAttribute("aria-expanded", String(!expanded));
      if (panel) {
        panel.style.maxHeight = expanded ? null : panel.scrollHeight + "px";
      }
    });
  });

  /* ----- Scroll animations: reveal variants + progress bar + hero parallax ----- */
  var animReduce = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var animTargets = document.querySelectorAll(".reveal, [data-anim]");

  if (animReduce || !("IntersectionObserver" in window)) {
    animTargets.forEach(function (el) { el.classList.add("in"); });
  } else {
    // reveal on enter
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) { entry.target.classList.add("in"); io.unobserve(entry.target); }
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -40px 0px" });
    animTargets.forEach(function (el) { io.observe(el); });

    // progress bar
    var bar = document.createElement("div");
    bar.className = "progressbar";
    bar.setAttribute("aria-hidden", "true");
    if (document.body) document.body.appendChild(bar);

    // hero parallax (elements marked [data-parallax])
    var parallax = Array.prototype.slice.call(document.querySelectorAll("[data-parallax]"));

    var ticking = false;
    function onScroll() {
      var st = window.scrollY || document.documentElement.scrollTop || 0;
      var doch = document.documentElement.scrollHeight - window.innerHeight;
      bar.style.width = (doch > 0 ? (st / doch) * 100 : 0) + "%";
      parallax.forEach(function (el) {
        var r = el.getBoundingClientRect();
        var offset = (r.top + r.height / 2 - window.innerHeight / 2) * -0.10;
        el.style.transform = "translateY(" + offset.toFixed(1) + "px)";
      });
      ticking = false;
    }
    window.addEventListener("scroll", function () {
      if (!ticking) { requestAnimationFrame(onScroll); ticking = true; }
    }, { passive: true });
    onScroll();
  }

  /* ----- Stat count-up animation ----- */
  var counters = document.querySelectorAll(".stat__num[data-count]");
  var prefersReduced = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (counters.length && "IntersectionObserver" in window && !prefersReduced) {
    var cObs = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        var el = entry.target;
        var target = parseInt(el.getAttribute("data-count"), 10);
        cObs.unobserve(el);
        if (isNaN(target)) return;
        var start = null, duration = 1200;
        function step(ts) {
          if (start === null) start = ts;
          var p = Math.min((ts - start) / duration, 1);
          // ease-out for a natural finish
          var eased = 1 - Math.pow(1 - p, 3);
          el.textContent = Math.round(eased * target) + "%";
          if (p < 1) requestAnimationFrame(step);
        }
        requestAnimationFrame(step);
      });
    }, { threshold: 0.4 });
    counters.forEach(function (c) { cObs.observe(c); });
  }

  /* ----- Form submission (AJAX to Formspree, graceful fallback) ----- */
  document.querySelectorAll("form[data-ajax]").forEach(function (form) {
    var status = form.querySelector(".form-status");
    var btn = form.querySelector("[type=submit]");

    function show(msg, ok) {
      if (!status) return;
      status.hidden = false;
      status.textContent = msg;
      status.className = "form-status " + (ok ? "is-ok" : "is-err");
    }

    form.addEventListener("submit", function (e) {
      e.preventDefault();
      if (typeof form.checkValidity === "function" && !form.checkValidity()) {
        form.reportValidity();
        return;
      }
      var action = form.getAttribute("action") || "";
      if (action.indexOf("YOUR_") !== -1) {
        show("This form isn't connected yet — add your Formspree form ID to enable submissions.", false);
        return;
      }
      var original = btn ? btn.textContent : "";
      if (btn) { btn.disabled = true; btn.textContent = "Sending…"; }

      fetch(action, { method: "POST", body: new FormData(form), headers: { "Accept": "application/json" } })
        .then(function (res) {
          if (res.ok) {
            form.reset();
            show("Thank you — your message has been sent. We'll be in touch soon.", true);
          } else {
            return res.json().then(function (d) {
              show(d && d.errors && d.errors.length
                ? d.errors.map(function (x) { return x.message; }).join(", ")
                : "Something went wrong. Please call our office or try again.", false);
            });
          }
        })
        .catch(function () {
          show("Network error. Please check your connection or call our office.", false);
        })
        .then(function () {
          if (btn) { btn.disabled = false; btn.textContent = original; }
        });
    });
  });

  /* ----- Testimonial carousel (featured, rotating) ----- */
  var reduceMotion = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  document.querySelectorAll("[data-carousel]").forEach(function (car) {
    var slides = Array.prototype.slice.call(car.querySelectorAll(".tc-slide"));
    var dots = Array.prototype.slice.call(car.querySelectorAll(".tc-dot"));
    if (slides.length < 2) return;
    car.classList.add("is-enhanced");
    var idx = 0, timer = null;

    function show(n) {
      idx = (n + slides.length) % slides.length;
      slides.forEach(function (s, k) { s.classList.toggle("is-active", k === idx); });
      dots.forEach(function (d, k) {
        d.classList.toggle("is-active", k === idx);
        d.setAttribute("aria-current", k === idx ? "true" : "false");
      });
    }
    function next() { show(idx + 1); }
    function start() { if (!reduceMotion) { timer = window.setInterval(next, 6500); } }
    function stop() { if (timer) { window.clearInterval(timer); timer = null; } }
    function restart() { stop(); start(); }

    var nextBtn = car.querySelector(".tc-next");
    var prevBtn = car.querySelector(".tc-prev");
    if (nextBtn) nextBtn.addEventListener("click", function () { next(); restart(); });
    if (prevBtn) prevBtn.addEventListener("click", function () { show(idx - 1); restart(); });
    dots.forEach(function (d, k) { d.addEventListener("click", function () { show(k); restart(); }); });
    car.addEventListener("mouseenter", stop);
    car.addEventListener("mouseleave", start);

    show(0);
    start();
  });

  /* ----- Current year in footer ----- */
  var yr = document.getElementById("year");
  if (yr) { yr.textContent = new Date().getFullYear(); }
})();
