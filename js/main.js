(function () {
  "use strict";

  var reduced = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var RSVP_ENDPOINT = ""; /* isi dengan "https://formspree.io/f/xxxx" nanti */

  function t(key) {
    return window.I18N ? I18N.t(key) : key;
  }

  /* ==========================================================
     TOAST
     ========================================================== */
  var toastEl = document.getElementById("toast");
  var toastTimer = null;
  function toast(msg) {
    if (!toastEl) return;
    toastEl.textContent = msg;
    toastEl.classList.add("show");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () {
      toastEl.classList.remove("show");
    }, 2600);
  }

  /* ==========================================================
     AUDIO — Web Audio SFX (prosedural) + musik latar
     ========================================================== */
  var AC = window.AudioContext || window.webkitAudioContext;
  var actx = null;
  var muted = true; /* semua sound mati sampai musik dinyalakan */

  function ensureCtx() {
    if (!AC) return null;
    if (!actx) actx = new AC();
    if (actx.state === "suspended") actx.resume();
    return actx;
  }

  function sfxSparkle() {
    if (muted) return;
    var ctx = ensureCtx();
    if (!ctx) return;
    var notes = [1046.5, 1318.5, 1568, 2093];
    notes.forEach(function (f, i) {
      var t0 = ctx.currentTime + i * 0.13;
      var o = ctx.createOscillator();
      var g = ctx.createGain();
      o.type = "sine";
      o.frequency.value = f;
      g.gain.setValueAtTime(0.0001, t0);
      g.gain.linearRampToValueAtTime(0.16, t0 + 0.02);
      g.gain.exponentialRampToValueAtTime(0.0001, t0 + 0.95);
      o.connect(g);
      g.connect(ctx.destination);
      o.start(t0);
      o.stop(t0 + 1);
    });
  }

  function sfxWhoosh() {
    if (muted) return;
    var ctx = ensureCtx();
    if (!ctx) return;
    var dur = 0.6;
    var buf = ctx.createBuffer(1, ctx.sampleRate * dur, ctx.sampleRate);
    var data = buf.getChannelData(0);
    for (var i = 0; i < data.length; i++) data[i] = (Math.random() * 2 - 1) * 0.5;
    var src = ctx.createBufferSource();
    src.buffer = buf;
    var filter = ctx.createBiquadFilter();
    filter.type = "bandpass";
    filter.frequency.setValueAtTime(300, ctx.currentTime);
    filter.frequency.exponentialRampToValueAtTime(2400, ctx.currentTime + dur);
    filter.Q.value = 1.2;
    var g = ctx.createGain();
    g.gain.setValueAtTime(0.0001, ctx.currentTime);
    g.gain.linearRampToValueAtTime(0.12, ctx.currentTime + 0.08);
    g.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + dur);
    src.connect(filter);
    filter.connect(g);
    g.connect(ctx.destination);
    src.start();
  }

  function sfxClick() {
    if (muted) return;
    var ctx = ensureCtx();
    if (!ctx) return;
    var t0 = ctx.currentTime;
    var o = ctx.createOscillator();
    var g = ctx.createGain();
    o.type = "triangle";
    o.frequency.setValueAtTime(950, t0);
    g.gain.setValueAtTime(0.09, t0);
    g.gain.exponentialRampToValueAtTime(0.0001, t0 + 0.08);
    o.connect(g);
    g.connect(ctx.destination);
    o.start(t0);
    o.stop(t0 + 0.1);
  }

  /* --- Musik latar --- */
  var music = new Audio();
  var musicReady = false;
  var musicMissing = false;
  music.loop = true;
  music.volume = 0.55;
  music.preload = "auto";
  music.src = "assets/audio/music.mp3";
  music.addEventListener("canplay", function () { musicReady = true; });
  music.addEventListener("error", function () { musicMissing = true; });

  var musicBtn = document.getElementById("music-btn");
  var musicIco = musicBtn ? musicBtn.querySelector(".music-ico") : null;

  function setMusicUI(on) {
    if (!musicBtn) return;
    musicBtn.classList.toggle("playing", on);
    musicBtn.setAttribute("aria-label", on ? t("music.on") : t("music.off"));
    if (musicIco) musicIco.textContent = on ? "🔊" : "🔇";
  }

  function startMusic() {
    if (musicMissing) {
      toast(t("music.none"));
      setMusicUI(!muted);
      return;
    }
    var p = music.play();
    if (p && p.then) {
      p.then(function () {
        muted = false;
        setMusicUI(true);
      }).catch(function () {
        setMusicUI(false);
      });
    } else {
      muted = false;
      setMusicUI(true);
    }
  }

  function stopMusic() {
    music.pause();
    muted = true;
    setMusicUI(false);
  }

  if (musicBtn) {
    musicBtn.addEventListener("click", function () {
      sfxClick();
      if (musicMissing) {
        /* file belum ada — tombol tetap berguna untuk mute/unmute SFX */
        muted = !muted;
        setMusicUI(!muted);
        toast(muted ? t("music.sfxOff") : t("music.sfxOn"));
        return;
      }
      if (!music.paused) {
        stopMusic();
      } else {
        startMusic();
      }
    });
  }

  /* Klik semua tombol → click sound */
  document.addEventListener("click", function (e) {
    if (e.target.closest("button, a.btn-royal")) sfxClick();
  });

  /* ==========================================================
     NAMA TAMU — ?to=Nama
     ========================================================== */
  var params = new URLSearchParams(window.location.search);
  var toName = (params.get("to") || "").trim().slice(0, 60);

  function applyGuestName() {
    if (!toName) return;
    document.querySelectorAll("[data-guest]").forEach(function (el) {
      el.textContent = toName;
    });
  }
  applyGuestName();

  /* ==========================================================
     BAHASA — tombol ID | EN
     ========================================================== */
  var langBtns = document.querySelectorAll(".lang-btn");
  langBtns.forEach(function (btn) {
    btn.addEventListener("click", function () {
      sfxClick();
      var next = btn.getAttribute("data-lang");
      if (!window.I18N || I18N.lang === next) return;
      I18N.applyLang(next, true);
    });
  });

  document.addEventListener("langchange", function () {
    var cur = window.I18N ? I18N.lang : "id";
    langBtns.forEach(function (b) {
      b.classList.toggle("active", b.getAttribute("data-lang") === cur);
    });
    applyGuestName();
    renderGuestbook();
    if (musicBtn) setMusicUI(!muted);
  });

  /* ==========================================================
     AMPLOP 3D
     ========================================================== */
  var screen = document.getElementById("envelope-screen");
  var envelope = document.getElementById("envelope");
  var openBtn = document.getElementById("open-btn");
  var opened = false;

  function openInvitation() {
    if (opened || !screen) return;
    opened = true;

    ensureCtx();
    muted = false; /* izinkan SFX selama proses pembukaan */
    sfxSparkle();

    var stage = screen.querySelector(".envelope-stage");
    if (stage) stage.classList.add("opening");
    if (envelope) envelope.classList.add("opening");

    setTimeout(function () {
      sfxWhoosh();
      screen.classList.add("done");
      document.body.classList.remove("locked");
      document.body.classList.add("unlocked");
      if (musicBtn) musicBtn.hidden = false;
      startMusic();
      initReveal();
      setTimeout(function () {
        if (screen && screen.parentNode) screen.parentNode.removeChild(screen);
      }, 1000);
    }, reduced ? 300 : 2000);
  }

  if (openBtn) openBtn.addEventListener("click", openInvitation);

  /* Tilt 3D amplop (desktop) */
  if (!reduced && envelope && window.matchMedia("(pointer: fine)").matches) {
    var stageEl = screen ? screen.querySelector(".envelope-stage") : null;
    if (stageEl) {
      stageEl.addEventListener("mousemove", function (e) {
        if (opened) return;
        var r = stageEl.getBoundingClientRect();
        var x = (e.clientX - r.left) / r.width - 0.5;
        var y = (e.clientY - r.top) / r.height - 0.5;
        envelope.style.transform = "rotateY(" + x * 14 + "deg) rotateX(" + -y * 10 + "deg)";
      });
      stageEl.addEventListener("mouseleave", function () {
        if (!opened) envelope.style.transform = "";
      });
    }
  }

  /* ==========================================================
     COUNTDOWN
     ========================================================== */
  var cdBox = document.getElementById("countdown-box");
  if (cdBox) {
    var target = new Date(cdBox.getAttribute("data-date")).getTime();
    var cdEls = {
      d: document.getElementById("cd-days"),
      h: document.getElementById("cd-hours"),
      m: document.getElementById("cd-mins"),
      s: document.getElementById("cd-secs")
    };
    var last = {};

    function pad(n) { return n < 10 ? "0" + n : "" + n; }

    function setCell(key, val) {
      var el = cdEls[key];
      if (!el || last[key] === val) return;
      el.textContent = val;
      last[key] = val;
      var cell = el.parentNode;
      cell.classList.remove("tick");
      void cell.offsetWidth;
      cell.classList.add("tick");
    }

    function tickDown() {
      var diff = Math.max(0, target - Date.now());
      var s = Math.floor(diff / 1000);
      setCell("d", pad(Math.floor(s / 86400)));
      setCell("h", pad(Math.floor(s / 3600) % 24));
      setCell("m", pad(Math.floor(s / 60) % 60));
      setCell("s", pad(s % 60));
    }

    tickDown();
    setInterval(tickDown, 1000);
  }

  /* ==========================================================
     REVEAL ON SCROLL
     ========================================================== */
  var revealObs = null;
  function initReveal() {
    var els = document.querySelectorAll(".reveal");
    if (reduced || !("IntersectionObserver" in window)) {
      els.forEach(function (el) { el.classList.add("in"); });
      return;
    }
    if (revealObs) return;
    revealObs = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) {
          en.target.classList.add("in");
          revealObs.unobserve(en.target);
        }
      });
    }, { threshold: 0.15, rootMargin: "0px 0px -40px 0px" });
    els.forEach(function (el) { revealObs.observe(el); });
  }

  /* ==========================================================
     PETALS (kelopak mawar jatuh)
     ========================================================== */
  var canvas = document.getElementById("petals");
  if (canvas && !reduced) {
    var c = canvas.getContext("2d");
    var W = 0, H = 0, petals = [];
    var colors = ["#F48FB1", "#F8BBD0", "#EC407A", "#FCE4EC", "#D4AF37"];

    function resize() {
      W = canvas.width = window.innerWidth;
      H = canvas.height = window.innerHeight;
      var count = W < 600 ? 16 : 30;
      petals = [];
      for (var i = 0; i < count; i++) petals.push(newPetal(true));
    }

    function newPetal(anywhere) {
      return {
        x: Math.random() * W,
        y: anywhere ? Math.random() * H : -20,
        r: 4 + Math.random() * 7,
        vy: 0.4 + Math.random() * 0.9,
        vx: -0.4 + Math.random() * 0.8,
        rot: Math.random() * Math.PI * 2,
        vr: -0.02 + Math.random() * 0.04,
        sway: Math.random() * Math.PI * 2,
        color: colors[(Math.random() * colors.length) | 0],
        alpha: 0.35 + Math.random() * 0.45
      };
    }

    function drawPetal(p) {
      c.save();
      c.translate(p.x, p.y);
      c.rotate(p.rot);
      c.globalAlpha = p.alpha;
      c.fillStyle = p.color;
      c.beginPath();
      c.ellipse(0, 0, p.r, p.r * 0.55, 0, 0, Math.PI * 2);
      c.fill();
      c.restore();
    }

    var raf = null;
    function loop() {
      c.clearRect(0, 0, W, H);
      for (var i = 0; i < petals.length; i++) {
        var p = petals[i];
        p.sway += 0.02;
        p.x += p.vx + Math.sin(p.sway) * 0.5;
        p.y += p.vy;
        p.rot += p.vr;
        if (p.y > H + 20 || p.x < -30 || p.x > W + 30) petals[i] = newPetal(false);
        drawPetal(p);
      }
      raf = requestAnimationFrame(loop);
    }

    window.addEventListener("resize", resize);
    resize();
    loop();

    document.addEventListener("visibilitychange", function () {
      if (document.hidden) {
        cancelAnimationFrame(raf);
      } else {
        raf = requestAnimationFrame(loop);
      }
    });
  }

  /* ==========================================================
     LIGHTBOX GALERI
     ========================================================== */
  var lightbox = document.getElementById("lightbox");
  var lbImg = document.getElementById("lightbox-img");
  var lbClose = document.getElementById("lightbox-close");

  document.querySelectorAll(".gallery-item").forEach(function (btn) {
    btn.addEventListener("click", function () {
      if (!lightbox || !lbImg) return;
      lbImg.src = btn.getAttribute("data-full") || btn.querySelector("img").src;
      lbImg.alt = btn.querySelector("img") ? btn.querySelector("img").alt : "";
      lightbox.hidden = false;
      requestAnimationFrame(function () { lightbox.classList.add("show"); });
    });
  });

  function closeLightbox() {
    if (!lightbox) return;
    lightbox.classList.remove("show");
    setTimeout(function () { lightbox.hidden = true; }, 300);
  }

  if (lbClose) lbClose.addEventListener("click", closeLightbox);
  if (lightbox) {
    lightbox.addEventListener("click", function (e) {
      if (e.target === lightbox) closeLightbox();
    });
  }
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape") closeLightbox();
  });

  /* ==========================================================
     RSVP + BUKU TAMU
     ========================================================== */
  var GB_KEY = "wedding_gb_aldila_albar";
  var gbList = document.getElementById("guestbook-list");
  var rsvpForm = document.getElementById("rsvp-form");
  var rsvpStatus = document.getElementById("rsvp-status");

  var seeds = [
    { name: "Keluarga Besar Wijaya", attend: "Hadir", message: "Semoga menjadi keluarga yang sakinah, mawaddah, warahmah. Bahagia selalu Aldila & Albar!" },
    { name: "Rina & Dimas", attend: "Hadir", message: "Selamat menempuh hidup baru! Semoga langgeng sampai kakek nenek 💕" }
  ];

  function getEntries() {
    try {
      var raw = localStorage.getItem(GB_KEY);
      var saved = raw ? JSON.parse(raw) : [];
      return saved.concat(seeds);
    } catch (e) {
      return seeds.slice();
    }
  }

  function renderGuestbook() {
    if (!gbList) return;
    var entries = getEntries();
    gbList.innerHTML = "";
    if (!entries.length) {
      gbList.innerHTML = '<li class="gb-empty"></li>';
      gbList.firstChild.textContent = t("gb.empty");
      return;
    }
    entries.forEach(function (en) {
      var li = document.createElement("li");
      li.className = "gb-item";
      var strong = document.createElement("strong");
      strong.textContent = en.name || "Tamu";
      var badge = document.createElement("span");
      badge.className = "gb-attend" + (en.attend === "Tidak Hadir" ? " no" : "");
      if (en.attend === "Hadir") badge.textContent = t("gb.hadir");
      else if (en.attend === "Tidak Hadir") badge.textContent = t("gb.tidak");
      else badge.textContent = en.attend || t("gb.hadir");
      strong.appendChild(badge);
      var p = document.createElement("p");
      p.textContent = en.message || "";
      li.appendChild(strong);
      li.appendChild(p);
      gbList.appendChild(li);
    });
  }

  function saveEntry(entry) {
    try {
      var raw = localStorage.getItem(GB_KEY);
      var saved = raw ? JSON.parse(raw) : [];
      saved.unshift(entry);
      localStorage.setItem(GB_KEY, JSON.stringify(saved.slice(0, 30)));
    } catch (e) { /* storage penuh — abaikan */ }
  }

  function validateField(field) {
    var input = field.querySelector("input, select, textarea");
    if (!input) return true;
    var ok = input.value.trim() !== "";
    if (ok && input.type === "email") {
      ok = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(input.value.trim());
    }
    field.classList.toggle("invalid", !ok);
    return ok;
  }

  if (rsvpForm) {
    rsvpForm.addEventListener("submit", function (e) {
      e.preventDefault();

      var valid = true;
      rsvpForm.querySelectorAll(".field").forEach(function (f) {
        if (!validateField(f)) valid = false;
      });
      if (!valid) {
        sfxClick();
        return;
      }

      var data = {
        name: rsvpForm.querySelector("#r-name").value.trim(),
        attend: rsvpForm.querySelector("#r-attend").value,
        message: rsvpForm.querySelector("#r-msg").value.trim()
      };

      var btn = rsvpForm.querySelector('button[type="submit"]');
      if (btn) { btn.disabled = true; btn.textContent = t("form.sending"); }

      function success(msg) {
        saveEntry(data);
        renderGuestbook();
        rsvpStatus.textContent = msg;
        rsvpStatus.classList.add("show");
        rsvpStatus.classList.remove("error");
        rsvpForm.reset();
        if (btn) { btn.disabled = false; btn.textContent = t("form.submit"); }
        if (typeof confettiBurst === "function") confettiBurst();
        sfxSparkle();
      }

      function fail(msg) {
        rsvpStatus.textContent = msg;
        rsvpStatus.classList.add("show", "error");
        if (btn) { btn.disabled = false; btn.textContent = t("form.submit"); }
      }

      if (RSVP_ENDPOINT) {
        fetch(RSVP_ENDPOINT, {
          method: "POST",
          headers: { "Content-Type": "application/json", Accept: "application/json" },
          body: JSON.stringify(data)
        })
          .then(function (r) {
            if (r.ok) success(t("rsvp.ok"));
            else fail(t("rsvp.err"));
          })
          .catch(function () {
            fail(t("rsvp.err.net"));
          });
      } else {
        setTimeout(function () {
          success(t("rsvp.ok.demo"));
        }, 700);
      }
    });

    rsvpForm.querySelectorAll("input, select, textarea").forEach(function (input) {
      input.addEventListener("input", function () {
        input.closest(".field").classList.remove("invalid");
      });
    });
  }

  renderGuestbook();

  /* ==========================================================
     KONFETI (dipanggil saat RSVP sukses)
     ========================================================== */
  window.confettiBurst = function () {
    if (reduced || !c) return;
    var pieces = [];
    for (var i = 0; i < 60; i++) {
      pieces.push({
        x: W / 2,
        y: H / 2,
        vx: -6 + Math.random() * 12,
        vy: -8 - Math.random() * 8,
        r: 4 + Math.random() * 5,
        rot: Math.random() * Math.PI,
        vr: -0.2 + Math.random() * 0.4,
        color: colors[(Math.random() * colors.length) | 0],
        life: 1
      });
    }
    var start = performance.now();
    function step(now) {
      var t = (now - start) / 1000;
      c.clearRect(0, 0, W, H);
      var alive = false;
      pieces.forEach(function (p) {
        p.vy += 0.25;
        p.x += p.vx;
        p.y += p.vy;
        p.rot += p.vr;
        p.life = Math.max(0, 1 - t / 2.2);
        if (p.life > 0) alive = true;
        c.save();
        c.globalAlpha = p.life;
        c.translate(p.x, p.y);
        c.rotate(p.rot);
        c.fillStyle = p.color;
        c.fillRect(-p.r / 2, -p.r / 2, p.r, p.r * 0.6);
        c.restore();
      });
      if (alive) requestAnimationFrame(step);
      else c.clearRect(0, 0, W, H);
    }
    requestAnimationFrame(step);
  };

  /* ==========================================================
     INIT — reveal juga untuk kasus tanpa amplop (debug)
     ========================================================== */
  if (!screen) initReveal();
})();
