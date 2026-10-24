  (function () {
    var roles = [
      "AI Coding Engineer",
      "AI & LLM Developer",
      "Software Developer",
      "Website Designer"
    ];
    var el = document.getElementById("role");
    var i = 0;

    document.getElementById("year").textContent = new Date().getFullYear();

    /* ---- rotating quote (random, never the same twice in a row) ---- */
    var QUOTES = [
      { t: "Forget not that the earth delights to feel your bare feet.", a: "Kahlil Gibran", r: "Middle East" },
      { t: "The most grave of errors is to believe without evidence.", a: "Al-Kindi", r: "Middle East" },
      { t: "If you want to be happy, be.", a: "Leo Tolstoy", r: "Russia" },
      { t: "Beauty will save the world.", a: "Fyodor Dostoevsky", r: "Russia" },
      { t: "Whatever you can do, or dream you can, begin it.", a: "Johann Wolfgang von Goethe", r: "Germany" },
      { t: "I dream my paintings and I paint my dreams.", a: "Edvard Munch", r: "Norway" },
      { t: "The moving finger writes; and, having writ, moves on.", a: "Omar Khayyam", r: "Iran" }
    ];

    (function showQuote() {
      var prev = null;
      try { prev = sessionStorage.getItem("quoteIdx"); } catch (e) {}

      var idx = Math.floor(Math.random() * QUOTES.length);
      if (QUOTES.length > 1 && String(idx) === prev) {
        idx = (idx + 1 + Math.floor(Math.random() * (QUOTES.length - 1))) % QUOTES.length;
      }

      try { sessionStorage.setItem("quoteIdx", String(idx)); } catch (e) {}

      var q = QUOTES[idx];
      document.getElementById("qText").textContent = "\u201C" + q.t + "\u201D";
      document.getElementById("qBy").textContent = " \u2014 " + q.a;
    })();

    setInterval(function () {
      el.classList.add("fade");
      setTimeout(function () {
        i = (i + 1) % roles.length;
        el.textContent = roles[i];
        el.classList.remove("fade");
      }, 320);
    }, 2600);

    /* ---- contact form ---- */
    var form = document.getElementById("contactForm");
    var status = document.getElementById("formStatus");
    var countEl = document.getElementById("count");
    var msgEl = document.getElementById("f-msg");
    // EmailJS Configuration
    const SERVICE_ID = "service_0w279v9";
    const TEMPLATE_ID = "template_9wf38af";
    const PUBLIC_KEY = "iAu_N7Hoc8D9cLYYs";
 
    function say(text, kind) {
      status.textContent = text;
      status.className = "form-status" + (kind ? " " + kind : "");
    }

    msgEl.addEventListener("input", function () {
      countEl.textContent = msgEl.value.length;
    });

    var phoneEl = document.getElementById("f-phone");

    function setBad(input, bad) {
      input.closest(".field").classList.toggle("bad", bad);
      return !bad;
    }

    function validate(input) {
      var v = input.value.trim();
      if (input.id === "f-mail") {
        return setBad(input, !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v));
      }
      if (input.id === "f-msg") {
        return setBad(input, v.length === 0);
      }
      if (input.id === "f-phone") return true;
      return setBad(input, v.length === 0);
    }

    function clearErrors() {
      Array.prototype.forEach.call(
        form.querySelectorAll(".field"),
        function (f) { f.classList.remove("bad"); }
      );
    }

    ["f-name", "f-mail", "f-msg"].forEach(function (id) {
      var input = document.getElementById(id);
      if (!input) return;
      input.addEventListener("input", function () {
        if (input.closest(".field").classList.contains("bad")) validate(input);
      });
    });

    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var ok = true;
      ["f-name", "f-mail", "f-msg"].forEach(function (id) {
        var input = document.getElementById(id);
        if (input && !validate(input)) ok = false;
      });

      if (!ok) {
        say("Please fix the highlighted fields.", "err");
        return;
      }

      var name = document.getElementById("f-name").value.trim();
      var mail = document.getElementById("f-mail").value.trim();
      var phone = document.getElementById("f-phone").value.trim();
      var msg = msgEl.value.trim();

      var templateParams = {
        from_name: name,
        from_email: mail,
        phone: phone || "Not provided",
        message: msg
      };

      if (typeof emailjs === "undefined" || !emailjs || !emailjs.send) {
        say("Email service not loaded. Check your internet and refresh.", "err");
        return;
      }

      say("Sending\u2026");
      emailjs.send(SERVICE_ID, TEMPLATE_ID, templateParams, PUBLIC_KEY)
        .then(function(response) {
          say("Message sent successfully!", "ok");
          form.reset();
          clearErrors();
          countEl.textContent = "0";
          setTimeout(function() { status.textContent = ""; }, 5000);
        }, function(error) {
          console.error("EmailJS error:", error);
          say("Failed to send message. " + ((error && (error.text || error.message)) || ""), "err");
        });
    });

    document.getElementById("cancelBtn").addEventListener("click", function () {
      form.reset();
      clearErrors();
      countEl.textContent = "0";
      say("Message cleared.");
    });

    /* ---- mobile full-page slider (slides between the two pages) ---- */
    (function fullpageSlider() {
      var mq = window.matchMedia("(max-width: 768px)");
      var panel = document.querySelector(".panel");
      var black = document.querySelector(".black");
      var pages = [panel, black];
      var current = 0, animating = false, locked = false;

      function apply() {
        for (var i = 0; i < pages.length; i++) {
          // each page slides up by (current * 100%); page below starts at +100%
          var offset = (i - current) * 100;
          pages[i].style.transform = "translateY(" + offset + "%)";
        }
      }

      function enable() {
        document.documentElement.classList.add("fp-active");
        document.body.classList.add("fp-active");
        current = 0;
        apply();
      }

      function disable() {
        document.documentElement.classList.remove("fp-active");
        document.body.classList.remove("fp-active");
        for (var i = 0; i < pages.length; i++) pages[i].style.transform = "";
      }

      function go(dir) {
        if (animating || locked) return;
        var next = current + dir;
        if (next < 0 || next >= pages.length) return;
        current = next;
        animating = true;
        apply();
        setTimeout(function () { animating = false; }, 650);
      }

      function onModeChange() {
        if (mq.matches) enable(); else disable();
      }

      if (mq.addEventListener) mq.addEventListener("change", onModeChange);
      else if (mq.addListener) mq.addListener(onModeChange);
      if (mq.matches) enable();

      /* wheel */
      var wheelLock = false;
      window.addEventListener("wheel", function (e) {
        if (!mq.matches) return;
        e.preventDefault();
        if (wheelLock || animating) return;
        if (Math.abs(e.deltaY) < 8) return;
        wheelLock = true;
        go(e.deltaY > 0 ? 1 : -1);
        setTimeout(function () { wheelLock = false; }, 700);
      }, { passive: false });

      /* touch */
      var startY = 0, startX = 0, tracking = false;
      window.addEventListener("touchstart", function (e) {
        if (!mq.matches || e.touches.length !== 1) return;
        // let the form scroll internally when on page 2
        if (current === 1 && e.target.closest("input, textarea, .dialpop, .diallist")) return;
        tracking = true;
        startY = e.touches[0].clientY;
        startX = e.touches[0].clientX;
      }, { passive: true });

      window.addEventListener("touchmove", function (e) {
        if (!mq.matches || !tracking) return;
        // allow native scroll inside the contact card when needed
        if (current === 1) {
          var card = document.querySelector(".black .card");
          if (card && card.contains(e.target)) return;
        }
        e.preventDefault();
      }, { passive: false });

      window.addEventListener("touchend", function (e) {
        if (!mq.matches || !tracking) return;
        tracking = false;
        var dy = e.changedTouches[0].clientY - startY;
        var dx = e.changedTouches[0].clientX - startX;
        if (Math.abs(dy) < 45 || Math.abs(dy) < Math.abs(dx)) return;
        go(dy < 0 ? 1 : -1);
      }, { passive: true });

      /* keyboard */
      window.addEventListener("keydown", function (e) {
        if (!mq.matches) return;
        if (e.key === "ArrowDown" || e.key === "PageDown") { e.preventDefault(); go(1); }
        else if (e.key === "ArrowUp" || e.key === "PageUp") { e.preventDefault(); go(-1); }
      });
    })();
  })();
