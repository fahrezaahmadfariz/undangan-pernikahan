(function () {
  var DICT = {
    id: {
      "meta.title": "Undangan Pernikahan Aldila & Albar",
      "meta.desc": "Undangan pernikahan Aldila & Albar — 12 Juni 2027.",

      "lang.group": "Pilih bahasa",
      "env.to": "Kepada Yth. Bapak/Ibu/Saudara/i",
      "guest.placeholder": "Tamu Undangan",
      "guest.to": "Kepada Yth.",
      "envelope.open": "✨ Buka Undangan ✨",
      "envelope.hint": "ketuk untuk membuka",

      "hero.day": "Sabtu",
      "hero.date": "12 Juni 2027",

      "couple.title": "Mempelai",
      "couple.sub": "Dengan memohon rahmat dan ridho Tuhan Yang Maha Esa, kami bermaksud menyelenggarakan pernikahan putra-putri kami:",
      "couple.d1": "Putri pertama dari",
      "couple.d2": "Putra kedua dari",

      "cd.sub": "Menghitung hari menuju hari bahagia kami",
      "cd.days": "Hari",
      "cd.hours": "Jam",
      "cd.mins": "Menit",
      "cd.secs": "Detik",

      "event.title": "Rangkaian Acara",
      "event.akad": "Akad Nikah",
      "event.resepsi": "Resepsi",
      "event.day": "Sabtu, 12 Juni 2027",
      "event.map": "📍 Buka Peta",

      "gallery.title": "Galeri Bahagia",

      "rsvp.title": "RSVP & Buku Tamu",
      "rsvp.sub": "Konfirmasi kehadiran dan tuliskan ucapan terbaik Anda untuk kedua mempelai.",
      "form.name": "Nama",
      "form.attend": "Kehadiran",
      "form.choose": "Pilih…",
      "form.yes": "Hadir",
      "form.no": "Tidak Hadir",
      "form.message": "Ucapan",
      "form.namePlaceholder": "Nama Anda",
      "form.msgPlaceholder": "Tuliskan doa & ucapan…",
      "form.err.name": "Mohon isi nama Anda.",
      "form.err.attend": "Mohon pilih kehadiran.",
      "form.err.message": "Mohon tulis ucapan Anda.",
      "form.submit": "Kirim RSVP",
      "form.sending": "Mengirim…",
      "rsvp.ok.demo": "Terima kasih! RSVP Anda tersimpan (demo) 💕",
      "rsvp.ok": "Terima kasih! RSVP Anda sudah terkirim 💕",
      "rsvp.err.net": "Gagal mengirim. Periksa koneksi Anda 🙏",
      "rsvp.err": "Gagal mengirim. Coba lagi ya 🙏",

      "gb.title": "Ucapan Para Tamu",
      "gb.empty": "Jadilah yang pertama mengucapkan!",
      "gb.hadir": "Hadir",
      "gb.tidak": "Tidak Hadir",

      "close.thanks": "Terima kasih atas doa & restunya",
      "close.we": "Kami yang berbahagia,",
      "close.family": "Keluarga Besar Mempelai",

      "music.on": "Matikan musik",
      "music.off": "Nyalakan musik",
      "music.none": "Musik belum tersedia — taruh lagu di assets/audio/music.mp3",
      "music.sfxOn": "Sound dinyalakan — taruh lagu di assets/audio/music.mp3",
      "music.sfxOff": "Sound dimatikan — taruh lagu di assets/audio/music.mp3"
    },

    en: {
      "meta.title": "Wedding Invitation of Aldila & Albar",
      "meta.desc": "Wedding invitation of Aldila & Albar — 12 June 2027.",

      "lang.group": "Choose language",
      "env.to": "To the Honorable Mr./Mrs./Ms.",
      "guest.placeholder": "Valued Guest",
      "guest.to": "To the Honorable",
      "envelope.open": "✨ Open Invitation ✨",
      "envelope.hint": "tap to open",

      "hero.day": "Saturday",
      "hero.date": "12 June 2027",

      "couple.title": "The Couple",
      "couple.sub": "With gratitude and blessings from God Almighty, we invite you to celebrate the wedding of our beloved children:",
      "couple.d1": "First daughter of",
      "couple.d2": "Second son of",

      "cd.sub": "Counting down to our big day",
      "cd.days": "Days",
      "cd.hours": "Hours",
      "cd.mins": "Minutes",
      "cd.secs": "Seconds",

      "event.title": "Event Schedule",
      "event.akad": "Wedding Ceremony",
      "event.resepsi": "Reception",
      "event.day": "Saturday, 12 June 2027",
      "event.map": "📍 Open Map",

      "gallery.title": "Happy Moments",

      "rsvp.title": "RSVP & Guestbook",
      "rsvp.sub": "Confirm your attendance and write your best wishes for the couple.",
      "form.name": "Name",
      "form.attend": "Attendance",
      "form.choose": "Choose…",
      "form.yes": "Attending",
      "form.no": "Not Attending",
      "form.message": "Wishes",
      "form.namePlaceholder": "Your name",
      "form.msgPlaceholder": "Write your prayers & wishes…",
      "form.err.name": "Please enter your name.",
      "form.err.attend": "Please select your attendance.",
      "form.err.message": "Please write your wish.",
      "form.submit": "Send RSVP",
      "form.sending": "Sending…",
      "rsvp.ok.demo": "Thank you! Your RSVP is saved (demo) 💕",
      "rsvp.ok": "Thank you! Your RSVP has been sent 💕",
      "rsvp.err.net": "Failed to send. Check your connection 🙏",
      "rsvp.err": "Failed to send. Please try again 🙏",

      "gb.title": "Guest Wishes",
      "gb.empty": "Be the first to leave a wish!",
      "gb.hadir": "Attending",
      "gb.tidak": "Not Attending",

      "close.thanks": "Thank you for your love & blessings",
      "close.we": "With love,",
      "close.family": "The Families of Aldila & Albar",

      "music.on": "Turn off music",
      "music.off": "Turn on music",
      "music.none": "Music not available yet — put a song at assets/audio/music.mp3",
      "music.sfxOn": "Sound on — put a song at assets/audio/music.mp3",
      "music.sfxOff": "Sound off — put a song at assets/audio/music.mp3"
    }
  };

  var lang = "id";
  try {
    if (localStorage.getItem("lang") === "en") lang = "en";
  } catch (e) {}

  function t(key) {
    var table = DICT[lang] || DICT.id;
    if (table[key] != null) return table[key];
    if (DICT.id[key] != null) return DICT.id[key];
    return key;
  }

  function swapText() {
    var root = document.documentElement;
    var table = DICT[lang] || DICT.id;
    var i, el, key, val;

    root.lang = lang;

    var texts = document.querySelectorAll("[data-i18n]");
    for (i = 0; i < texts.length; i++) {
      el = texts[i];
      key = el.getAttribute("data-i18n");
      val = table[key] != null ? table[key] : DICT.id[key];
      if (val != null) el.textContent = val;
    }

    var phs = document.querySelectorAll("[data-i18n-placeholder]");
    for (i = 0; i < phs.length; i++) {
      el = phs[i];
      key = el.getAttribute("data-i18n-placeholder");
      val = table[key] != null ? table[key] : DICT.id[key];
      if (val != null) el.setAttribute("placeholder", val);
    }

    var arias = document.querySelectorAll("[data-i18n-aria]");
    for (i = 0; i < arias.length; i++) {
      el = arias[i];
      key = el.getAttribute("data-i18n-aria");
      val = table[key] != null ? table[key] : DICT.id[key];
      if (val != null) {
        el.setAttribute("aria-label", val);
        el.setAttribute("title", val);
      }
    }

    var metas = document.querySelectorAll("[data-i18n-content]");
    for (i = 0; i < metas.length; i++) {
      el = metas[i];
      key = el.getAttribute("data-i18n-content");
      val = table[key] != null ? table[key] : DICT.id[key];
      if (val != null) el.setAttribute("content", val);
    }
  }

  function reducedMotion() {
    return window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  }

  function applyLang(next, animate) {
    if (next !== "en" && next !== "id") next = "id";
    lang = next;
    try { localStorage.setItem("lang", next); } catch (e) {}

    var root = document.documentElement;

    function done() {
      swapText();
      root.classList.remove("lang-fading", "lang-pending");
      document.dispatchEvent(new CustomEvent("langchange", { detail: { lang: next } }));
    }

    if (animate && !reducedMotion()) {
      root.classList.add("lang-fading");
      setTimeout(done, 180);
    } else {
      done();
    }
  }

  window.I18N = {
    t: t,
    applyLang: applyLang,
    get lang() { return lang; },
    dict: DICT
  };

  document.addEventListener("DOMContentLoaded", function () {
    if (!document.documentElement.classList.contains("lang-fading")) {
      swapText();
      document.documentElement.classList.remove("lang-pending");
      document.dispatchEvent(new CustomEvent("langchange", { detail: { lang: lang } }));
    }
  });
})();
