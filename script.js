  (function () {
    var roles = [
      "AI Coding Engineer",
      "AI & LLM Developer",
      "Software Developer",
      "Website Designer"
    ];
    var el = document.getElementById("role");
    var i = 0;

    // year display removed

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

    /* ---- mobile: use normal page scroll (refreshable) ---- */
    (function disableFullpageOnMobile() {
      var mq = window.matchMedia("(max-width: 768px)");
      function disable() {
        document.documentElement.classList.remove("fp-active");
        document.body.classList.remove("fp-active");
        var panel = document.querySelector(".panel");
        var black = document.querySelector(".black");
        if (panel) panel.style.transform = "";
        if (black) black.style.transform = "";
      }
      disable();
      if (mq.addEventListener) mq.addEventListener("change", disable);
      else if (mq.addListener) mq.addListener(disable);
    })();
  })();
