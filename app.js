/* LinguaClass — приложение для изучения английского (5–11 классы).
   Чистый JS без зависимостей. */

(() => {
  "use strict";

  /* =========================================================
     Утилиты
     ========================================================= */
  const $ = (sel, root = document) => root.querySelector(sel);
  const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));

  const esc = (s) =>
    String(s)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");

  const clamp = (n, a, b) => Math.max(a, Math.min(b, n));

  function hashString(str) {
    let h = 2166136261;
    for (let i = 0; i < str.length; i++) {
      h ^= str.charCodeAt(i);
      h = Math.imul(h, 16777619);
    }
    return h >>> 0;
  }

  function mulberry32(seed) {
    let a = seed >>> 0;
    return function () {
      a = (a + 0x6d2b79f5) >>> 0;
      let t = a;
      t = Math.imul(t ^ (t >>> 15), t | 1);
      t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }

  function shuffle(arr, rng) {
    const a = arr.slice();
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(rng() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  }

  const pick = (arr) => arr[Math.floor(Math.random() * arr.length)];

  /* Лис-маскот: единый вид реплик */
  function foxRow(text, opts = {}) {
    const mood = opts.mood ? ` ${opts.mood}` : "";
    return `<div class="fox-row">
      <div class="fox-emoji${mood}">🦊</div>
      <div class="bubble">${text}</div>
    </div>`;
  }

  function norm(s) {
    return String(s)
      .toLowerCase()
      .replace(/[’‘`]/g, "'")
      .replace(/[.,!?;:"()\[\]—–-]/g, " ")
      .replace(/\s+/g, " ")
      .trim();
  }
  function expandContractions(s) {
    return s
      .replace(/\bcan't\b/g, "cannot")
      .replace(/\bcan not\b/g, "cannot")
      .replace(/\bwon't\b/g, "will not")
      .replace(/\bshan't\b/g, "shall not")
      .replace(/\b(\w+)n't\b/g, "$1 not")
      .replace(/\bi'm\b/g, "i am")
      .replace(/\b(\w+)'re\b/g, "$1 are")
      .replace(/\b(\w+)'ve\b/g, "$1 have")
      .replace(/\b(\w+)'ll\b/g, "$1 will")
      .replace(/\b(\w+)'d\b/g, "$1 would")
      .replace(/\b(he|she|it|that|there|here|what|who)'s\b/g, "$1 is")
      .replace(/\blet's\b/g, "let us");
  }
  const looseNorm = (s) => expandContractions(norm(s).replace(/'/g, ""));

  const STOPWORDS = new Set(
    (
      "a an the to of in on at for with from by as is are am was were be been being and or but if so not no do does did have has had will would can could should must may might my your his her its our their this that these those there here i you he she it we they me him them us who which what when where why how very also just than then"
    ).split(" ")
  );

  function todayKey(d = new Date()) {
    const p = (n) => String(n).padStart(2, "0");
    return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())}`;
  }

  function yesterdayKey() {
    const d = new Date();
    d.setDate(d.getDate() - 1);
    return todayKey(d);
  }

  /* =========================================================
     Хранилище
     ========================================================= */
  const KEY = "linguaclass.v1";
  const HEART_MS = 5 * 60 * 1000; // 1 сердце за 5 минут
  const HEART_MAX = 5;

  function defaultState() {
    return {
      v: 1,
      onboarded: false,
      name: "",
      classId: "c5",
      sound: true,
      xp: 0,
      gems: 60,
      hearts: HEART_MAX,
      heartsAt: Date.now(),
      streak: 0,
      maxStreak: 0,
      lastDay: null,
      dailyXp: 0,
      dailyDay: null,
      goal: 20,
      perfect: 0,
      theme: "auto",
      done: {}
    };
  }

  function loadState() {
    try {
      const raw = localStorage.getItem(KEY);
      if (!raw) return defaultState();
      const parsed = JSON.parse(raw);
      const base = defaultState();
      return {
        ...base,
        ...parsed,
        done: parsed.done && typeof parsed.done === "object" ? parsed.done : {}
      };
    } catch (e) {
      return defaultState();
    }
  }

  let state = loadState();
  const save = () => {
    try {
      localStorage.setItem(KEY, JSON.stringify(state));
    } catch (e) {
      /* приватный режим */
    }
  };

  /* =========================================================
     Тема оформления
     ========================================================= */
  const DARK_BG = "#121518";
  const LIGHT_BG = "#58cc02";

  const prefersDark = () =>
    !!(window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches);

  function isDarkTheme() {
    const mode = state.theme || "auto";
    return mode === "dark" || (mode === "auto" && prefersDark());
  }

  function applyTheme() {
    const dark = isDarkTheme();
    document.documentElement.dataset.theme = dark ? "dark" : "light";
    const meta = document.getElementById("themeColorMeta");
    if (meta) meta.setAttribute("content", dark ? DARK_BG : LIGHT_BG);
  }

  function setTheme(mode) {
    state.theme = mode;
    save();
    applyTheme();
  }

  if (window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").addEventListener) {
    window.matchMedia("(prefers-color-scheme: dark)").addEventListener("change", () => {
      if ((state.theme || "auto") === "auto") applyTheme();
    });
  }

  function syncHearts() {
    if (state.hearts >= HEART_MAX) {
      state.hearts = HEART_MAX;
      state.heartsAt = Date.now();
      return 0;
    }
    const elapsed = Date.now() - (state.heartsAt || Date.now());
    const gain = Math.floor(elapsed / HEART_MS);
    if (gain > 0) {
      const before = state.hearts;
      state.hearts = Math.min(HEART_MAX, state.hearts + gain);
      state.heartsAt =
        state.hearts >= HEART_MAX ? Date.now() : state.heartsAt + gain * HEART_MS;
      save();
      return state.hearts - before;
    }
    return 0;
  }

  function heartTimerText() {
    if (state.hearts >= HEART_MAX) return "";
    const left = Math.max(0, HEART_MS - (Date.now() - state.heartsAt));
    const m = Math.floor(left / 60000);
    const s = Math.floor((left % 60000) / 1000);
    return `${m}:${String(s).padStart(2, "0")}`;
  }

  /* =========================================================
     Контент
     ========================================================= */
  const CLASSES = window.CURRICULUM;
  const KINDS = window.LESSON_KINDS;

  const getClass = (id) => CLASSES.find((c) => c.id === id) || CLASSES[0];
  const lid = (classId, u, l) => `${classId}.u${u}.l${l}`;

  function flatLessons(cls) {
    const out = [];
    cls.units.forEach((unit, u) => {
      KINDS.forEach((k, l) => {
        out.push({
          id: lid(cls.id, u, l),
          unitIndex: u,
          lessonIndex: l,
          unit,
          kind: k
        });
      });
    });
    return out;
  }

  function lessonStars(classId, u, l) {
    const rec = state.done[lid(classId, u, l)];
    return rec ? rec.stars : 0;
  }

  function lessonStatus(cls, u, l) {
    const id = lid(cls.id, u, l);
    if (state.done[id]) return "done";
    const flat = flatLessons(cls);
    const firstUndone = flat.findIndex((x) => !state.done[x.id]);
    return flat.findIndex((x) => x.id === id) === firstUndone
      ? "current"
      : "locked";
  }

  /* =========================================================
     Генератор упражнений
     ========================================================= */
  function cleanWord(w) {
    return w.replace(/[.,!?;:"]/g, "").trim();
  }

  function wordTokens(sentence) {
    return sentence
      .split(/\s+/)
      .map(cleanWord)
      .filter(Boolean);
  }

  function buildLesson(cls, uIdx, lIdx) {
    const unit = cls.units[uIdx];
    const kindInfo = KINDS[lIdx];
    const rng = mulberry32(hashString(`${cls.id}:${uIdx}:${lIdx}`));

    const vocab = shuffle(
      unit.vocab.map(([en, ru]) => ({ en, ru })),
      rng
    );
    const sents = shuffle(
      unit.sentences.map((s) => ({ ...s })),
      rng
    );

    const classVocab = cls.units.flatMap((u) => u.vocab.map(([en, ru]) => ({ en, ru })));

    const ruPool = (exclude) => {
      const seen = new Set([exclude]);
      const out = [];
      for (const v of shuffle(classVocab, rng)) {
        if (!seen.has(v.ru)) {
          seen.add(v.ru);
          out.push(v.ru);
        }
        if (out.length >= 3) break;
      }
      return out;
    };

    const enPool = (exclude) => {
      const seen = new Set([exclude.toLowerCase()]);
      const out = [];
      for (const v of shuffle(classVocab, rng)) {
        const key = v.en.toLowerCase();
        if (!seen.has(key)) {
          seen.add(key);
          out.push(v.en);
        }
        if (out.length >= 3) break;
      }
      return out;
    };

    const extraWords = (answer) => {
      const used = new Set(wordTokens(answer).map((w) => w.toLowerCase()));
      const pool = [];
      for (const s of shuffle(unit.sentences, rng)) {
        for (const w of wordTokens(s.en)) {
          const k = w.toLowerCase();
          if (w.length > 1 && !used.has(k) && !pool.includes(k)) pool.push(k);
        }
      }
      for (const v of shuffle(classVocab, rng)) {
        const k = v.en.replace(/\s+/g, " ").toLowerCase();
        if (!used.has(k) && !pool.includes(k)) pool.push(k);
      }
      return shuffle(pool, rng).slice(0, 3);
    };

    const ex = [];
    const take = (arr, n) => arr.slice(0, n);

    const choiceEnRu = (v) => ({
      type: "choice",
      prompt: "Выбери правильный перевод",
      text: v.en,
      options: shuffle([v.ru, ...ruPool(v.ru)], rng),
      correctIndex: -1,
      answer: v.ru
    });
    const choiceRuEn = (v) => ({
      type: "choiceRev",
      prompt: "Как это будет по-английски?",
      text: v.ru,
      options: shuffle([v.en, ...enPool(v.en)], rng),
      answer: v.en
    });
    const listenWord = (v) => ({
      type: "listen",
      prompt: "Послушай и выбери перевод",
      audioText: v.en,
      text: "",
      options: shuffle([v.ru, ...ruPool(v.ru)], rng),
      answer: v.ru
    });
    const listenSentence = (s) => ({
      type: "listen",
      prompt: "Послушай и выбери перевод",
      audioText: s.en,
      text: "",
      options: shuffle([s.ru, ...sentenceRuPool(s.ru)], rng),
      answer: s.ru
    });
    const sentenceRuPool = (exclude) => {
      const seen = new Set([exclude]);
      const out = [];
      for (const s of shuffle(unit.sentences, rng)) {
        if (!seen.has(s.ru)) {
          seen.add(s.ru);
          out.push(s.ru);
        }
        if (out.length >= 3) break;
      }
      return out;
    };
    const typeWord = (v) => ({
      type: "type",
      prompt: "Напиши по-английски",
      text: v.ru,
      answer: v.en,
      hint: v.en[0] + "…"
    });
    const typeSentence = (s) => ({
      type: "type",
      prompt: "Переведи на английский",
      text: s.ru,
      answer: s.en,
      hint: wordTokens(s.en)
        .map((w, i) => (i === 0 ? w[0] + "…" : "…"))
        .join(" ")
    });
    const wordbank = (s) => ({
      type: "wordbank",
      prompt: "Собери предложение",
      text: s.ru,
      answer: s.en,
      tokens: shuffle([...wordTokens(s.en), ...extraWords(s.en)], rng)
    });
    const listenType = (v) => ({
      type: "listenType",
      prompt: "Послушай и напиши по-английски",
      audioText: v.en,
      text: "",
      answer: v.en,
      hint: v.en[0] + "…"
    });
    const match = (pairs) => {
      const clean = pairs.map((p) => ({ en: p.en, ru: p.ru }));
      return {
        type: "match",
        prompt: "Соедини пары",
        pairs: clean,
        left: shuffle(clean.map((p, i) => ({ ...p, pid: i })), rng),
        right: shuffle(clean.map((p, i) => ({ ...p, pid: i })), rng)
      };
    };
    const gap = (s) => {
      const words = s.en.split(/\s+/);
      const candidates = words
        .map((w, i) => ({ i, w }))
        .filter(({ i, w }) => {
          const c = cleanWord(w).toLowerCase();
          return (
            i > 0 &&
            c.length > 2 &&
            !STOPWORDS.has(c) &&
            !/[0-9]/.test(c)
          );
        });
      if (!candidates.length) return null;
      const vocabMatch = candidates.find(({ w }) =>
        unit.vocab.some(([en]) => en.toLowerCase() === cleanWord(w).toLowerCase())
      );
      const target = vocabMatch || candidates[0];
      const answer = cleanWord(target.w);
      const blanked = words
        .map((w, i) => (i === target.i ? "___" : w))
        .join(" ");
      return {
        type: "gap",
        prompt: "Заполни пропуск",
        text: blanked,
        answer,
        options: shuffle([answer, ...enPool(answer)], rng)
      };
    };

    // проставляем correctIndex после перемешивания
    const fix = (e) => {
      if (e.options) e.correctIndex = e.options.indexOf(e.answer);
      return e;
    };

    const v = vocab;
    const s = sents;

    if (kindInfo.kind === "words") {
      ex.push(match(take(v, 4)));
      ex.push(fix(choiceEnRu(v[0])));
      ex.push(fix(choiceEnRu(v[1])));
      ex.push(fix(choiceEnRu(v[2])));
      ex.push(fix(choiceRuEn(v[3])));
      ex.push(fix(choiceRuEn(v[4])));
      ex.push(fix(listenWord(v[5])));
      ex.push(fix(typeWord(v[6])));
      ex.push(fix(typeWord(v[7])));
    } else if (kindInfo.kind === "phrases") {
      ex.push(fix(wordbank(s[0])));
      ex.push(fix(wordbank(s[1])));
      ex.push(fix(choiceEnRu({ en: s[2].en, ru: s[2].ru })));
      ex.push(fix(listenSentence(s[3])));
      const g1 = gap(s[4]) || gap(s[2]) || gap(s[0]);
      ex.push(fix(g1 || typeWord(v[5])));
      ex.push(fix(wordbank(s[5])));
      const g2 = gap(s[3]) || gap(s[1]);
      ex.push(fix(g2 || choiceRuEn(v[7])));
      const short = s.find((x) => wordTokens(x.en).length <= 5);
      ex.push(fix(short ? typeSentence(short) : typeWord(v[8])));
      ex.push(fix(choiceEnRu({ en: s[4].en, ru: s[4].ru })));
    } else if (kindInfo.kind === "listen") {
      ex.push(fix(listenSentence(s[0])));
      ex.push(fix(listenWord(v[0])));
      ex.push(fix(listenSentence(s[1])));
      ex.push(fix(listenWord(v[1])));
      ex.push(fix(listenType(v[2])));
      ex.push(fix(listenSentence(s[2])));
      ex.push(fix(listenType(v[3])));
      ex.push(fix(wordbank(s[3])));
      ex.push(match(take(v.slice(4, 8), 4)));
    } else {
      ex.push(match(take(v, 4)));
      ex.push(fix(wordbank(s[0])));
      ex.push(fix(choiceEnRu(v[0])));
      ex.push(fix(listenSentence(s[1])));
      ex.push(fix(choiceRuEn(v[1])));
      ex.push(fix(gap(s[2]) || typeWord(v[2])));
      ex.push(fix(listenType(v[3])));
      ex.push(fix(typeSentence(s[3]) || typeWord(v[4])));
      ex.push(fix(choiceEnRu(v[5])));
    }

    // страховка от пустых вариантов
    return ex
      .filter(Boolean)
      .map((e) => {
        if (e.options) {
          e.options = e.options.filter((o, i, a) => a.indexOf(o) === i);
          e.correctIndex = e.options.indexOf(e.answer);
        }
        return e;
      })
      .slice(0, 9);
  }

  /* =========================================================
     Звук и речь
     ========================================================= */
  let audioCtx = null;
  function ctx() {
    if (!audioCtx) {
      const AC = window.AudioContext || window.webkitAudioContext;
      if (!AC) return null;
      try {
        audioCtx = new AC();
      } catch (e) {
        return null;
      }
    }
    if (audioCtx.state === "suspended") audioCtx.resume().catch(() => {});
    return audioCtx;
  }

  function tone(freq, dur, delay, type = "sine", vol = 0.07) {
    const c = ctx();
    if (!c) return;
    const osc = c.createOscillator();
    const gain = c.createGain();
    const t0 = c.currentTime + delay;
    osc.type = type;
    osc.frequency.setValueAtTime(freq, t0);
    gain.gain.setValueAtTime(0, t0);
    gain.gain.linearRampToValueAtTime(vol, t0 + 0.012);
    gain.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);
    osc.connect(gain).connect(c.destination);
    osc.start(t0);
    osc.stop(t0 + dur + 0.03);
  }

  function sfx(kind) {
    if (!state.sound) return;
    if (kind === "correct") {
      tone(660, 0.13, 0);
      tone(880, 0.18, 0.1);
    } else if (kind === "wrong") {
      tone(200, 0.18, 0, "square", 0.05);
      tone(150, 0.22, 0.1, "square", 0.05);
    } else if (kind === "finish") {
      [523, 659, 784, 1046].forEach((f, i) => tone(f, 0.22, i * 0.11, "triangle", 0.06));
    } else if (kind === "tap") {
      tone(440, 0.05, 0, "sine", 0.03);
    }
  }

  function vibrate(pattern) {
    try {
      if (navigator.vibrate) navigator.vibrate(pattern);
    } catch (e) {
      /* ignore */
    }
  }

  let voices = [];
  function loadVoices() {
    if (!("speechSynthesis" in window)) return;
    voices = window.speechSynthesis.getVoices() || [];
  }
  if ("speechSynthesis" in window) {
    loadVoices();
    window.speechSynthesis.onvoiceschanged = loadVoices;
  }

  function speak(text) {
    if (!("speechSynthesis" in window) || !text) return;
    try {
      window.speechSynthesis.cancel();
      const u = new SpeechSynthesisUtterance(text);
      u.lang = "en-US";
      u.rate = 0.92;
      u.pitch = 1;
      const v =
        voices.find((x) => /^en[-_]US/i.test(x.lang)) ||
        voices.find((x) => /^en[-_]GB/i.test(x.lang)) ||
        voices.find((x) => /^en/i.test(x.lang));
      if (v) u.voice = v;
      window.speechSynthesis.speak(u);
    } catch (e) {
      /* ignore */
    }
  }

  /* =========================================================
     Состояние интерфейса
     ========================================================= */
  let screen = "home";
  let currentLesson = null;
  let lastResult = null;
  let onboardClass = null;

  const app = $("#app");
  const modalRoot = $("#modal-root");

  function render() {
    switch (screen) {
      case "onboarding":
        renderOnboarding();
        break;
      case "lesson":
        renderLesson();
        break;
      case "result":
        renderResult();
        break;
      case "hearts":
        renderNoHearts();
        break;
      case "dict":
        renderDict();
        break;
      case "profile":
        renderProfile();
        break;
      default:
        renderHome();
    }
    window.scrollTo(0, 0);
  }

  function go(next) {
    screen = next;
    render();
  }

  /* =========================================================
     Модальные окна
     ========================================================= */
  function openModal(html, opts = {}) {
    modalRoot.innerHTML = `<div class="overlay"><div class="modal ${
      opts.wide ? "modal-wide" : ""
    }">${html}</div></div>`;
    const overlay = $(".overlay", modalRoot);
    overlay.addEventListener("click", (e) => {
      if (e.target === overlay) closeModal();
    });
  }
  function closeModal() {
    modalRoot.innerHTML = "";
  }

  /* =========================================================
     Установка как приложение (PWA)
     ========================================================= */
  let deferredInstallPrompt = null;
  window.addEventListener("beforeinstallprompt", (e) => {
    e.preventDefault();
    deferredInstallPrompt = e;
  });

  function isStandalone() {
    return (
      window.matchMedia("(display-mode: standalone)").matches ||
      window.navigator.standalone === true
    );
  }

  function isIOS() {
    return /iphone|ipad|ipod/i.test(navigator.userAgent);
  }

  function openInstallModal() {
    if (isStandalone()) {
      openModal(
        `<h3 class="h3">Приложение уже установлено</h3>
         <p class="muted">Вы открыли LinguaClass с иконки на домашнем экране — всё работает как в обычном приложении.</p>
         <div class="modal-actions">
           <button class="btn btn-primary" data-close>Понятно</button>
         </div>`
      );
      $("[data-close]", modalRoot).addEventListener("click", closeModal);
      return;
    }

    if (deferredInstallPrompt) {
      openModal(
        `<h3 class="h3">Установить LinguaClass</h3>
         <p class="muted">Иконка появится на домашнем экране, приложение будет открываться на весь экран.</p>
         <div class="modal-actions">
           <button class="btn btn-secondary" data-close>Позже</button>
           <button class="btn btn-primary" id="installGo">Установить</button>
         </div>`
      );
      $("[data-close]", modalRoot).addEventListener("click", closeModal);
      $("#installGo").addEventListener("click", async () => {
        closeModal();
        try {
          deferredInstallPrompt.prompt();
          await deferredInstallPrompt.userChoice;
        } catch (e) {
          /* пользователь отменил */
        }
        deferredInstallPrompt = null;
      });
      return;
    }

    const steps = isIOS()
      ? `<ol class="install-steps">
           <li>Откройте сайт в <b>Safari</b>.</li>
           <li>Нажмите кнопку <b>«Поделиться»</b> (квадрат со стрелкой вверх).</li>
           <li>Выберите <b>«На экран „Домой“»</b>.</li>
           <li>Нажмите <b>«Добавить»</b> — иконка появится на домашнем экране.</li>
         </ol>`
      : `<ol class="install-steps">
           <li>Откройте сайт в <b>Chrome</b>.</li>
           <li>Нажмите меню <b>⋮</b> справа сверху.</li>
           <li>Выберите <b>«Установить приложение»</b> (или «Добавить на главный экран»).</li>
           <li>Подтвердите установку.</li>
         </ol>`;

    openModal(
      `<h3 class="h3">Установить как приложение</h3>
       ${steps}
       <p class="tiny muted">Полноценный режим приложения и офлайн-доступ включаются при открытии по HTTPS-адресу. В локальной сети приложение тоже устанавливается, но без офлайн-кэша.</p>
       <div class="modal-actions">
         <button class="btn btn-primary" data-close>Понятно</button>
       </div>`
    );
    $("[data-close]", modalRoot).addEventListener("click", closeModal);
  }

  function classPickerHtml(selectedId) {
    return `<div class="classes-grid">${CLASSES.map(
      (c) => `
      <button class="class-card ${c.id === selectedId ? "selected" : ""}" data-class="${c.id}">
        <div class="class-card-top">
          <span class="class-title">${esc(c.title)}</span>
          <span class="class-check">${c.id === selectedId ? "✓" : ""}</span>
        </div>
        <span class="class-level">${esc(c.level)}</span>
        <span class="class-desc">${esc(c.desc)}</span>
      </button>`
    ).join("")}</div>`;
  }

  /* =========================================================
     ЭКРАН: онбординг
     ========================================================= */
  function renderOnboarding() {
    screen = "onboarding";
    if (!onboardClass) onboardClass = state.classId;
    const cls = getClass(onboardClass);
    app.innerHTML = `
      <div class="onboard">
        <div class="brand">
          <div class="brand-mark">A</div>
          <div class="brand-name">LinguaClass</div>
          <p class="brand-sub">Английский по школьной программе — короткими уроками, как в игре.</p>
        </div>

        ${foxRow("Я лис-учитель. Выбери класс — и начнём!")}

        <div class="onboard-block">
          <h2 class="h2">Выбери свой класс</h2>
          <p class="muted">Программа и сложность подстроятся под тебя.</p>
          ${classPickerHtml(onboardClass)}
        </div>

        <div class="onboard-block">
          <label class="label" for="onbName">Как тебя зовут? <span class="muted">(необязательно)</span></label>
          <input id="onbName" class="input" maxlength="24" placeholder="Например, Аня" value="${esc(
            state.name
          )}" autocomplete="off" />
        </div>

        <div class="onboard-info">
          <div><b>${cls.units.length}</b><span>юнита</span></div>
          <div><b>${cls.units.length * 4}</b><span>урока</span></div>
          <div><b>${cls.goal}</b><span>XP в день</span></div>
        </div>

        <button class="btn btn-primary btn-lg" id="onbStart">Начать учиться</button>
        <p class="tiny muted center">Прогресс хранится на устройстве. Интернет не нужен.</p>
      </div>`;

    $$(".class-card", app).forEach((btn) => {
      btn.addEventListener("click", () => {
        onboardClass = btn.dataset.class;
        state.classId = onboardClass;
        state.goal = getClass(onboardClass).goal;
        sfx("tap");
        renderOnboarding();
      });
    });

    $("#onbStart").addEventListener("click", () => {
      const name = $("#onbName").value.trim();
      state.name = name;
      state.classId = onboardClass;
      state.goal = cls.goal;
      state.onboarded = true;
      state.dailyDay = todayKey();
      save();
      ctx();
      go("home");
    });
  }

  /* =========================================================
     ЭКРАН: главная
     ========================================================= */
  function renderHome() {
    screen = "home";
    syncHearts();
    const cls = getClass(state.classId);
    const today = todayKey();
    if (state.dailyDay !== today) {
      state.dailyDay = today;
      state.dailyXp = 0;
      save();
    }
    const goal = state.goal || cls.goal;
    const dailyPct = clamp(Math.round((state.dailyXp / goal) * 100), 0, 100);

    const lessonsDone = Object.keys(state.done).length;
    const level = Math.floor(state.xp / 120) + 1;
    const nextLesson = flatLessons(cls).find((x) => !state.done[x.id]);

    let foxSays;
    if (dailyPct >= 100) {
      foxSays = "Цель дня закрыта! Лис гордится тобой 🎉";
    } else if (state.hearts <= 0) {
      foxSays = "Сердца на нуле — отдохни немного, лис подождёт 💤";
    } else if (lessonsDone === 0) {
      foxSays = "Привет! Я лис. Поехали, первый урок уже ждёт 👇";
    } else if (state.streak >= 3) {
      foxSays = `Серия ${state.streak} дней — лис в восторге 🔥`;
    } else if (nextLesson) {
      foxSays = `До цели ${Math.max(0, goal - state.dailyXp)} XP. Дальше тема «${esc(
        nextLesson.unit.title
      )}»`;
    } else {
      foxSays = "Все уроки пройдены! Лис советует повторить любимый юнит 🏆";
    }

    app.innerHTML = `
      <div class="page">
        <header class="topbar">
          <button class="class-chip" id="openClasses">
            <span class="chip-dot"></span>${esc(cls.title)} <span class="chev">▾</span>
          </button>
          <div class="topstats">
            <span class="stat" title="Серия дней">🔥 ${state.streak}</span>
            <span class="stat" title="Кристаллы">💎 ${state.gems}</span>
            <span class="stat stat-hearts" title="Сердца">❤️ ${state.hearts}</span>
          </div>
        </header>

        <section class="goal-card">
          <div class="goal-ring" style="--pct:${dailyPct}">
            <svg viewBox="0 0 44 44">
              <circle class="ring-bg" cx="22" cy="22" r="18"></circle>
              <circle class="ring-fg" cx="22" cy="22" r="18"
                style="stroke-dasharray:113.1;stroke-dashoffset:${113.1 - (113.1 * dailyPct) / 100}"></circle>
            </svg>
            <div class="ring-label">${dailyPct}%</div>
          </div>
          <div class="goal-info">
            <div class="goal-title">Цель на сегодня</div>
            <div class="goal-sub">${state.dailyXp} из ${goal} XP · уровень ${level}</div>
            <div class="goal-bar"><span style="width:${dailyPct}%"></span></div>
          </div>
        </section>

        ${foxRow(foxSays, { mood: dailyPct >= 100 ? "happy" : "" })}

        ${cls.units
          .map((unit, u) => {
            const nodes = KINDS.map((k, l) => {
              const status = lessonStatus(cls, u, l);
              const stars = lessonStars(cls.id, u, l);
              const offs = [0, -52, 0, 52];
              return `
                <div class="node-wrap ${status}" style="--off:${offs[l]}px">
                  <button class="node ${status}" data-start="${u}:${l}" ${
                status === "locked" ? "disabled" : ""
              } aria-label="${esc(k.title)}">
                    <span class="node-emoji">${
                      status === "locked" ? "🔒" : k.emoji
                    }</span>
                    ${
                      status === "done"
                        ? `<span class="node-badge">${"★".repeat(stars)}${
                            stars < 3 ? `<i>${"☆".repeat(3 - stars)}</i>` : ""
                          }</span>`
                        : ""
                    }
                  </button>
                  <div class="node-label">${esc(k.title)}</div>
                </div>`;
            }).join("");

            const unitDone = KINDS.every((k, l) => state.done[lid(cls.id, u, l)]);
            return `
              <section class="unit-block">
                <div class="unit-head ${unitDone ? "unit-done" : ""}">
                  <div class="unit-emoji">${unit.emoji}</div>
                  <div class="unit-text">
                    <div class="unit-kicker">Юнит ${u + 1}${unitDone ? " · пройден" : ""}</div>
                    <div class="unit-title">${esc(unit.title)}</div>
                    <div class="unit-grammar">${esc(unit.grammar)}</div>
                  </div>
                </div>
                <div class="nodes">${nodes}</div>
              </section>`;
          })
          .join("")}

        <div class="home-footer">
          <span class="tiny muted">LinguaClass · v1.3 · прогресс хранится на устройстве</span>
        </div>
      </div>

      ${bottomNav("home")}`;

    $("#openClasses").addEventListener("click", openClassModal);
    $$("[data-start]").forEach((btn) => {
      btn.addEventListener("click", () => {
        const [u, l] = btn.dataset.start.split(":").map(Number);
        startLesson(cls.id, u, l);
      });
    });
    bindNav();
  }

  function openClassModal() {
    openModal(
      `<div class="modal-head">
        <h3 class="h3">Выбери класс</h3>
        <button class="icon-btn" data-close>✕</button>
      </div>
      <p class="muted small">Прогресс каждого класса сохраняется отдельно.</p>
      ${classPickerHtml(state.classId)}
      <button class="btn btn-secondary btn-block" data-close>Закрыть</button>`,
      { wide: true }
    );
    $$(".class-card", modalRoot).forEach((btn) => {
      btn.addEventListener("click", () => {
        state.classId = btn.dataset.class;
        state.goal = getClass(btn.dataset.class).goal;
        save();
        closeModal();
        render();
      });
    });
    $$("[data-close]", modalRoot).forEach((b) =>
      b.addEventListener("click", closeModal)
    );
  }

  function bottomNav(active) {
    const items = [
      { id: "home", icon: "🏠", label: "Учить" },
      { id: "dict", icon: "📖", label: "Словарь" },
      { id: "profile", icon: "🙂", label: "Профиль" }
    ];
    return `<nav class="tabbar">${items
      .map(
        (i) => `
      <button class="tab ${active === i.id ? "active" : ""}" data-nav="${i.id}">
        <span class="tab-icon">${i.icon}</span>
        <span class="tab-label">${i.label}</span>
      </button>`
      )
      .join("")}</nav>`;
  }

  function bindNav() {
    $$("[data-nav]").forEach((btn) =>
      btn.addEventListener("click", () => {
        sfx("tap");
        go(btn.dataset.nav);
      })
    );
  }

  /* =========================================================
     УРОК
     ========================================================= */
  function startLesson(classId, u, l, opts = {}) {
    syncHearts();
    const cls = getClass(classId);
    if (state.hearts <= 0 && !opts.free) {
      go("hearts");
      return;
    }
    const exs = buildLesson(cls, u, l);
    currentLesson = {
      cls,
      u,
      l,
      id: lid(classId, u, l),
      exs,
      i: 0,
      phase: "answer",
      extras: exs.map(() => ({
        selected: null,
        typed: "",
        bank: null,
        answer: [],
        matched: new Set(),
        sel: null,
        wrong: null
      })),
      correct: 0,
      mistakes: 0,
      combo: 0,
      maxCombo: 0,
      startedAt: Date.now(),
      free: !!opts.free
    };
    go("lesson");
    setTimeout(() => speakCurrent(), 350);
  }

  function currentEx() {
    return currentLesson.exs[currentLesson.i];
  }
  function currentExtra() {
    return currentLesson.extras[currentLesson.i];
  }
  function speakCurrent() {
    const ex = currentEx();
    if (ex && ex.audioText) speak(ex.audioText);
  }

  function renderExercise(ex, st) {
    switch (ex.type) {
      case "choice":
      case "choiceRev":
        return `
          <div class="ex">
            <div class="ex-prompt">${esc(ex.prompt)}</div>
            <div class="ex-question">${esc(ex.text)}</div>
            <div class="options">
              ${ex.options
                .map((o, i) => {
                  let cls = "option";
                  if (st.selected === i) cls += " selected";
                  if (currentLesson.phase === "feedback") {
                    if (i === ex.correctIndex) cls += " correct";
                    else if (st.selected === i) cls += " wrong";
                  }
                  return `<button class="${cls}" data-opt="${i}" ${
                    currentLesson.phase === "feedback" ? "disabled" : ""
                  }>${esc(o)}</button>`;
                })
                .join("")}
            </div>
          </div>`;

      case "gap":
        return `
          <div class="ex">
            <div class="ex-prompt">${esc(ex.prompt)}</div>
            <div class="ex-question gap-text">${esc(ex.text).replace(
              "___",
              '<span class="blank">___</span>'
            )}</div>
            <div class="options">
              ${ex.options
                .map((o, i) => {
                  let cls = "option";
                  if (st.selected === i) cls += " selected";
                  if (currentLesson.phase === "feedback") {
                    if (i === ex.correctIndex) cls += " correct";
                    else if (st.selected === i) cls += " wrong";
                  }
                  return `<button class="${cls}" data-opt="${i}" ${
                    currentLesson.phase === "feedback" ? "disabled" : ""
                  }>${esc(o)}</button>`;
                })
                .join("")}
            </div>
          </div>`;

      case "listen":
        return `
          <div class="ex">
            <div class="ex-prompt">${esc(ex.prompt)}</div>
            <button class="speaker-card" data-speak>🔊<span>Нажми, чтобы услышать ещё раз</span></button>
            <div class="options">
              ${ex.options
                .map((o, i) => {
                  let cls = "option";
                  if (st.selected === i) cls += " selected";
                  if (currentLesson.phase === "feedback") {
                    if (i === ex.correctIndex) cls += " correct";
                    else if (st.selected === i) cls += " wrong";
                  }
                  return `<button class="${cls}" data-opt="${i}" ${
                    currentLesson.phase === "feedback" ? "disabled" : ""
                  }>${esc(o)}</button>`;
                })
                .join("")}
            </div>
          </div>`;

      case "listenType":
        return `
          <div class="ex">
            <div class="ex-prompt">${esc(ex.prompt)}</div>
            <button class="speaker-card" data-speak>🔊<span>Прослушать</span></button>
            <input id="typeInput" class="input input-type" type="text" inputmode="text"
              autocomplete="off" autocapitalize="none" spellcheck="false"
              placeholder="${esc(ex.hint || "Напиши ответ")}" value="${esc(st.typed)}"
              ${currentLesson.phase === "feedback" ? "disabled" : ""} />
            ${
              currentLesson.phase === "feedback"
                ? `<div class="answer-line">Правильно: <b>${esc(ex.answer)}</b></div>`
                : ""
            }
          </div>`;

      case "type":
        return `
          <div class="ex">
            <div class="ex-prompt">${esc(ex.prompt)}</div>
            <div class="ex-question">${esc(ex.text)}</div>
            <input id="typeInput" class="input input-type" type="text" inputmode="text"
              autocomplete="off" autocapitalize="none" spellcheck="false"
              placeholder="${esc(ex.hint || "Напиши ответ")}" value="${esc(st.typed)}"
              ${currentLesson.phase === "feedback" ? "disabled" : ""} />
            ${
              currentLesson.phase === "feedback"
                ? `<div class="answer-line">Правильно: <b>${esc(ex.answer)}</b></div>`
                : ""
            }
          </div>`;

      case "wordbank": {
        if (!st.bank) {
          st.bank = ex.tokens.map((w) => ({ w, used: false }));
        }
        const answered = st.answer.map((idx) => st.bank[idx].w);
        return `
          <div class="ex">
            <div class="ex-prompt">${esc(ex.prompt)}</div>
            <div class="ex-question">${esc(ex.text)}</div>
            <div class="wb-answer ${answered.length ? "" : "empty"}">
              ${
                answered.length
                  ? answered
                      .map(
                        (w, i) =>
                          `<button class="token answer-token" data-unpick="${i}" ${
                            currentLesson.phase === "feedback" ? "disabled" : ""
                          }>${esc(w)}</button>`
                      )
                      .join("")
                  : `<span class="wb-hint">Нажимай на слова ниже</span>`
              }
            </div>
            <div class="wb-bank">
              ${st.bank
                .map((t, i) => {
                  if (!t.used) {
                    return `<button class="token" data-pick="${i}" ${
                      currentLesson.phase === "feedback" ? "disabled" : ""
                    }>${esc(t.w)}</button>`;
                  }
                  return `<button class="token token-ghost" disabled>${esc(t.w)}</button>`;
                })
                .join("")}
            </div>
          </div>`;
      }

      case "match": {
        const done = st.matched;
        return `
          <div class="ex">
            <div class="ex-prompt">${esc(ex.prompt)}</div>
            <div class="match">
              <div class="match-col">
                ${ex.left
                  .map((p, i) => {
                    const isDone = done.has(p.pid);
                    const sel =
                      st.sel && st.sel.side === "l" && st.sel.i === i ? "selected" : "";
                    const wrong =
                      st.wrong && st.wrong.side === "l" && st.wrong.i === i ? "wrong" : "";
                    return `<button class="match-btn ${isDone ? "done" : ""} ${sel} ${wrong}"
                      data-match="l" data-i="${i}" ${isDone ? "disabled" : ""}>${esc(
                      p.en
                    )}</button>`;
                  })
                  .join("")}
              </div>
              <div class="match-col">
                ${ex.right
                  .map((p, i) => {
                    const isDone = done.has(p.pid);
                    const sel =
                      st.sel && st.sel.side === "r" && st.sel.i === i ? "selected" : "";
                    const wrong =
                      st.wrong && st.wrong.side === "r" && st.wrong.i === i ? "wrong" : "";
                    return `<button class="match-btn ${isDone ? "done" : ""} ${sel} ${wrong}"
                      data-match="r" data-i="${i}" ${isDone ? "disabled" : ""}>${esc(
                      p.ru
                    )}</button>`;
                  })
                  .join("")}
              </div>
            </div>
          </div>`;
      }
      default:
        return `<div class="ex">${esc(ex.prompt || "")}</div>`;
    }
  }

  function renderLesson() {
    screen = "lesson";
    const L = currentLesson;
    const ex = currentEx();
    const st = currentExtra();
    const total = L.exs.length;
    const pct = ((L.i + (L.phase === "feedback" ? 1 : 0)) / total) * 100;

    let bottom;
    if (L.phase === "feedback") {
      const ok = st.wasCorrect;
      bottom = `
        <div class="feedback ${ok ? "ok" : "bad"}">
          <div class="fb-head">
            <span class="fb-icon">${ok ? "✓" : "✕"}</span>
            <span class="fb-title">${
              ok ? pick(["Верно!", "Отлично!", "Лис доволен!"]) : pick(["Не совсем", "Почти!", "Лис подскажет"])
            }</span>
            <span class="fb-fox ${ok ? "happy" : "sad"}">🦊</span>
          </div>
          <div class="fb-body">
            ${
              ok
                ? `<span class="fb-correct">${esc(answerText(ex))}</span>`
                : `<span class="fb-wrong-label">Правильный ответ:</span> <span class="fb-correct">${esc(
                    answerText(ex)
                  )}</span>`
            }
            ${L.combo >= 3 && ok ? `<span class="fb-combo">🔥 серия ${L.combo}</span>` : ""}
          </div>
          <button class="btn btn-primary btn-block" id="nextBtn">${
            L.i + 1 >= total ? "Завершить урок" : "Продолжить"
          }</button>
        </div>`;
    } else {
      const disabled =
        (ex.type === "choice" ||
          ex.type === "choiceRev" ||
          ex.type === "gap" ||
          ex.type === "listen") &&
        st.selected === null;
      bottom = `<div class="check-wrap"><button class="btn btn-primary btn-block" id="checkBtn" ${
        disabled ? "disabled" : ""
      }>Проверить</button></div>`;
    }

    app.innerHTML = `
      <div class="lesson">
        <div class="lesson-top">
          <button class="icon-btn" id="quitBtn" aria-label="Выйти">✕</button>
          <div class="progress"><div class="progress-fill" style="width:${pct}%"></div></div>
          <div class="hearts-pill">❤️ <span>${state.hearts}</span></div>
        </div>

        <div class="lesson-body">
          <div class="ex-kicker">${esc(KINDS[L.l].title)} · ${esc(
      L.cls.units[L.u].title
    )}</div>
          ${renderExercise(ex, st)}
        </div>

        <div class="lesson-bottom">${bottom}</div>
      </div>`;

    // События
    $("#quitBtn").addEventListener("click", confirmQuit);
    $$("[data-speak]").forEach((b) =>
      b.addEventListener("click", () => speak(ex.audioText))
    );

    if (L.phase === "answer") {
      if (ex.type === "match") bindMatch(ex, st);
      else if (ex.type === "wordbank") bindWordbank(st);
      else if (ex.type === "type" || ex.type === "listenType") bindType(st);
      else bindOptions(st);
    } else {
      $("#nextBtn").addEventListener("click", nextExercise);
    }
  }

  function bindOptions(st) {
    $$("[data-opt]").forEach((btn) =>
      btn.addEventListener("click", () => {
        st.selected = Number(btn.dataset.opt);
        sfx("tap");
        renderLesson();
      })
    );
    const check = $("#checkBtn");
    if (check) {
      check.disabled = st.selected === null;
      check.onclick = checkAnswer;
    }
  }

  function bindType(st) {
    const input = $("#typeInput");
    const check = $("#checkBtn");
    if (input) {
      input.focus();
      input.addEventListener("input", () => {
        st.typed = input.value;
        if (check) check.disabled = st.typed.trim().length === 0;
      });
      input.addEventListener("keydown", (e) => {
        if (e.key === "Enter") {
          e.preventDefault();
          if (st.typed.trim()) checkAnswer();
        }
      });
    }
    if (check) check.onclick = checkAnswer;
  }

  function bindWordbank(st) {
    $$("[data-pick]").forEach((btn) =>
      btn.addEventListener("click", () => {
        const i = Number(btn.dataset.pick);
        if (!st.bank[i].used) {
          st.bank[i].used = true;
          st.answer.push(i);
          sfx("tap");
          renderLesson();
        }
      })
    );
    $$("[data-unpick]").forEach((btn) =>
      btn.addEventListener("click", () => {
        const pos = Number(btn.dataset.unpick);
        const idx = st.answer[pos];
        if (idx != null) {
          st.bank[idx].used = false;
          st.answer.splice(pos, 1);
          sfx("tap");
          renderLesson();
        }
      })
    );
    const check = $("#checkBtn");
    if (check) {
      check.disabled = st.answer.length === 0;
      check.onclick = checkAnswer;
    }
  }

  function bindMatch(ex, st) {
    $$("[data-match]").forEach((btn) =>
      btn.addEventListener("click", () => {
        const side = btn.dataset.match;
        const i = Number(btn.dataset.i);
        const item = side === "l" ? ex.left[i] : ex.right[i];
        if (!st.sel) {
          st.sel = { side, i, pid: item.pid };
          sfx("tap");
          renderLesson();
          return;
        }
        if (st.sel.side === side) {
          st.sel = st.sel.i === i ? null : { side, i, pid: item.pid };
          renderLesson();
          return;
        }
        // сравнение
        if (st.sel.pid === item.pid) {
          st.matched.add(item.pid);
          st.sel = null;
          st.wrong = null;
          sfx("correct");
          vibrate(10);
          if (st.matched.size === ex.pairs.length) {
            st.wasCorrect = true;
            currentLesson.correct++;
            currentLesson.combo++;
            currentLesson.maxCombo = Math.max(
              currentLesson.maxCombo,
              currentLesson.combo
            );
            currentLesson.phase = "feedback";
            sfx("finish");
            renderLesson();
          } else {
            renderLesson();
          }
        } else {
          st.wrong = { side, i };
          st.sel = null;
          currentLesson.mistakes++;
          currentLesson.combo = 0;
          loseHeart();
          sfx("wrong");
          vibrate([30, 40, 30]);
          renderLesson();
        }
      })
    );
  }

  function answerText(ex) {
    if (ex.type === "match") return "Все пары соединены";
    if (ex.options) return ex.options[ex.correctIndex];
    return ex.answer || "";
  }

  function loseHeart() {
    state.hearts = Math.max(0, state.hearts - 1);
    if (state.hearts < HEART_MAX && !state.heartsAt) state.heartsAt = Date.now();
    save();
  }

  function checkAnswer() {
    if (currentLesson.phase !== "answer") return;
    const L = currentLesson;
    const ex = currentEx();
    const st = currentExtra();
    let ok = false;

    if (ex.type === "choice" || ex.type === "choiceRev" || ex.type === "gap" || ex.type === "listen") {
      if (st.selected === null) return;
      ok = st.selected === ex.correctIndex;
    } else if (ex.type === "type") {
      ok = looseNorm(st.typed) === looseNorm(ex.answer);
    } else if (ex.type === "listenType") {
      ok = looseNorm(st.typed) === looseNorm(ex.answer);
    } else if (ex.type === "wordbank") {
      const built = st.answer.map((i) => st.bank[i].w).join(" ");
      ok = looseNorm(built) === looseNorm(ex.answer);
    }

    st.wasCorrect = ok;
    if (ok) {
      L.correct++;
      L.combo++;
      L.maxCombo = Math.max(L.maxCombo, L.combo);
      sfx("correct");
      vibrate(10);
    } else {
      L.mistakes++;
      L.combo = 0;
      loseHeart();
      sfx("wrong");
      vibrate([30, 40, 30]);
    }
    if (ex.type === "wordbank" || ex.type === "type" || ex.type === "listenType") {
      st.typed = st.typed;
    }
    L.phase = "feedback";
    renderLesson();
  }

  function nextExercise() {
    const L = currentLesson;
    if (state.hearts <= 0 && !L.free) {
      go("hearts");
      return;
    }
    if (L.i + 1 >= L.exs.length) {
      finishLesson();
      return;
    }
    L.i++;
    L.phase = "answer";
    renderLesson();
    setTimeout(() => speakCurrent(), 300);
  }

  function finishLesson() {
    const L = currentLesson;
    const total = L.exs.length;
    const acc = total ? Math.round((L.correct / total) * 100) : 0;
    const perfect = L.mistakes === 0;
    let xp = 10 + L.correct * 2 + (perfect ? 10 : 0);
    if (L.free) xp = Math.round(xp / 2);
    const stars = acc >= 90 ? 3 : acc >= 70 ? 2 : 1;

    const today = todayKey();
    if (state.dailyDay !== today) {
      state.dailyDay = today;
      state.dailyXp = 0;
    }
    state.dailyXp += xp;
    state.xp += xp;
    state.gems += perfect ? 5 : 2;
    if (perfect && state.hearts < HEART_MAX) state.hearts++;
    if (perfect) state.perfect = (state.perfect || 0) + 1;

    if (state.lastDay !== today) {
      state.streak = state.lastDay === yesterdayKey() ? state.streak + 1 : 1;
      state.lastDay = today;
      state.maxStreak = Math.max(state.maxStreak || 0, state.streak);
    }

    const prev = state.done[L.id];
    const bestStars = Math.max(prev ? prev.stars : 0, stars);
    state.done[L.id] = {
      stars: bestStars,
      acc: Math.max(prev ? prev.acc : 0, acc),
      xp: (prev ? prev.xp : 0) + xp,
      ts: Date.now()
    };
    save();
    sfx("finish");

    lastResult = {
      cls: L.cls,
      u: L.u,
      l: L.l,
      xp,
      acc,
      perfect,
      stars,
      bestStars,
      maxCombo: L.maxCombo,
      correct: L.correct,
      total,
      free: L.free,
      hearts: state.hearts
    };

    go("result");
  }

  function confirmQuit() {
    openModal(
      `<h3 class="h3">Выйти из урока?</h3>
       <p class="muted">Прогресс этого урока не сохранится.</p>
       <div class="modal-actions">
         <button class="btn btn-secondary" data-close>Остаться</button>
         <button class="btn btn-danger" id="quitYes">Выйти</button>
       </div>`
    );
    $("[data-close]", modalRoot).addEventListener("click", closeModal);
    $("#quitYes").addEventListener("click", () => {
      closeModal();
      go("home");
    });
  }

  /* =========================================================
     ЭКРАН: результат урока
     ========================================================= */
  function renderResult() {
    screen = "result";
    const r = lastResult;
    if (!r) {
      go("home");
      return;
    }
    const confetti = Array.from({ length: 26 })
      .map((_, i) => {
        const colors = ["#58cc02", "#1cb0f6", "#ffc800", "#ff4b4b", "#ce82ff"];
        const left = Math.random() * 100;
        const delay = Math.random() * 0.6;
        const dur = 1.6 + Math.random() * 1.4;
        const size = 6 + Math.random() * 8;
        return `<span class="confetti" style="left:${left}%;background:${
          colors[i % colors.length]
        };width:${size}px;height:${size * 1.6}px;animation-delay:${delay}s;animation-duration:${dur}s"></span>`;
      })
      .join("");

    app.innerHTML = `
      <div class="result">
        <div class="confetti-layer">${confetti}</div>
        <div class="result-emoji">${r.perfect ? "🏆" : r.acc >= 70 ? "🎉" : "💪"}</div>
        <h1 class="result-title">${
          r.perfect ? "Идеальный урок!" : r.acc >= 70 ? "Урок пройден!" : "Хорошая попытка!"
        }</h1>
        <p class="result-sub">${esc(r.cls.title)} · ${esc(
      r.cls.units[r.u].title
    )} · ${esc(KINDS[r.l].title)}</p>

        <div class="result-stars">
          ${[1, 2, 3]
            .map(
              (n) =>
                `<span class="rstar ${r.stars >= n ? "on" : ""}">★</span>`
            )
            .join("")}
        </div>

        <p class="fox-note"><span class="fox-emoji ${r.stars === 3 ? "happy" : ""}">🦊</span> ${
          r.stars === 3
            ? "Идеально! Лис аплодирует."
            : r.acc >= 70
            ? "Хорошо! Лис довольно кивает."
            : "Ничего страшного — лис тоже учился постепенно."
        }</p>

        <div class="result-grid">
          <div class="result-card"><span class="rc-num">+${r.xp}</span><span class="rc-label">XP</span></div>
          <div class="result-card"><span class="rc-num">${r.acc}%</span><span class="rc-label">Точность</span></div>
          <div class="result-card"><span class="rc-num">${r.maxCombo}</span><span class="rc-label">Лучшая серия</span></div>
        </div>

        ${
          r.free
            ? `<p class="note">Тренировка без сердец: XP уменьшен вдвое.</p>`
            : ""
        }

        <div class="result-actions">
          <button class="btn btn-primary btn-block" id="resHome">Продолжить</button>
          <button class="btn btn-secondary btn-block" id="resAgain">Пройти заново</button>
        </div>
        <p class="tiny muted center">Серия: 🔥 ${state.streak} · Всего XP: ${state.xp}</p>
      </div>`;

    $("#resHome").addEventListener("click", () => go("home"));
    $("#resAgain").addEventListener("click", () =>
      startLesson(r.cls.id, r.u, r.l, { free: r.free })
    );
  }

  /* =========================================================
     ЭКРАН: сердца закончились
     ========================================================= */
  function renderNoHearts() {
    screen = "hearts";
    syncHearts();
    const canBuy = state.gems >= 20;
    app.innerHTML = `
      <div class="page hearts-page">
        <div class="hearts-big">
          <span>💔</span>
        </div>
        ${foxRow("Сердца закончились. Подождём вместе — скоро восстановится.", {
          mood: "sad"
        })}
        <h1 class="h1 center">Сердца закончились</h1>
        <p class="muted center">Сердце восстанавливается каждые 5 минут.<br/>Следующее — через ${heartTimerText() || "5:00"}.</p>
        <div class="hearts-slots">${Array.from({ length: HEART_MAX })
          .map((_, i) => `<span class="hslot ${i < state.hearts ? "on" : ""}">❤️</span>`)
          .join("")}</div>
        <button class="btn btn-primary btn-block" id="buyHearts" ${
          canBuy ? "" : "disabled"
        }>Пополнить за 20 💎 <span class="btn-note">у тебя ${state.gems} 💎</span></button>
        <button class="btn btn-secondary btn-block" id="trainFree">Тренировка без наград</button>
        <button class="btn btn-ghost btn-block" id="heartsHome">На главную</button>
      </div>`;
    $("#buyHearts").addEventListener("click", () => {
      if (state.gems < 20) return;
      state.gems -= 20;
      state.hearts = HEART_MAX;
      state.heartsAt = Date.now();
      save();
      go("home");
    });
    $("#trainFree").addEventListener("click", () => {
      const cls = getClass(state.classId);
      const flat = flatLessons(cls);
      const next = flat.find((x) => !state.done[x.id]) || flat[0];
      startLesson(cls.id, next.unitIndex, next.lessonIndex, { free: true });
    });
    $("#heartsHome").addEventListener("click", () => go("home"));
  }

  /* =========================================================
     ЭКРАН: словарь
     ========================================================= */
  let dictQuery = "";
  function renderDict() {
    screen = "dict";
    const cls = getClass(state.classId);
    const q = norm(dictQuery);

    const unitsHtml = cls.units
      .map((unit, u) => {
        const words = unit.vocab.filter(
          ([en, ru]) => !q || norm(en).includes(q) || norm(ru).includes(q)
        );
        if (!words.length) return "";
        return `
          <section class="dict-unit">
            <h3 class="dict-unit-title">${unit.emoji} ${esc(unit.title)}</h3>
            ${words
              .map(
                ([en, ru]) => `
              <div class="word-row">
                <button class="word-audio" data-say="${esc(en)}" aria-label="Произнести">🔊</button>
                <div class="word-text">
                  <span class="word-en">${esc(en)}</span>
                  <span class="word-ru">${esc(ru)}</span>
                </div>
              </div>`
              )
              .join("")}
          </section>`;
      })
      .join("");

    app.innerHTML = `
      <div class="page">
        <header class="simple-head">
          <h1 class="h1">Словарь</h1>
          <span class="muted small">${esc(cls.title)}</span>
        </header>
        <input id="dictSearch" class="input search" type="search" placeholder="Поиск слова или перевода" aria-label="Поиск по словарю" value="${esc(
          dictQuery
        )}" autocomplete="off" />
        <p class="tiny muted">Всего слов в курсе: ${cls.units.reduce(
          (n, u) => n + u.vocab.length,
          0
        )}. Нажми 🔊, чтобы услышать произношение.</p>
        ${
          unitsHtml ||
          `<div class="fox-empty">
             <div class="fox-emoji">🦊</div>
             <p>Лис обыскал весь словарь, но ничего не нашёл.<br/>Попробуй другое слово.</p>
           </div>`
        }
      </div>
      ${bottomNav("dict")}`;

    const search = $("#dictSearch");
    search.addEventListener("input", () => {
      dictQuery = search.value;
      const pos = search.selectionStart;
      renderDict();
      const s2 = $("#dictSearch");
      s2.focus();
      s2.setSelectionRange(pos, pos);
    });
    $$("[data-say]").forEach((b) =>
      b.addEventListener("click", () => speak(b.dataset.say))
    );
    bindNav();
  }

  /* =========================================================
     ЭКРАН: профиль
     ========================================================= */
  function achievements() {
    const lessons = Object.keys(state.done).length;
    return [
      {
        icon: "🌱",
        title: "Первый шаг",
        desc: "Пройди свой первый урок",
        done: lessons >= 1
      },
      {
        icon: "📚",
        title: "Десятка",
        desc: "Пройди 10 уроков",
        done: lessons >= 10
      },
      {
        icon: "💯",
        title: "Без ошибок",
        desc: "Идеальный урок",
        done: (state.perfect || 0) >= 1
      },
      {
        icon: "🔥",
        title: "Три дня подряд",
        desc: "Серия из 3 дней",
        done: (state.maxStreak || 0) >= 3
      },
      {
        icon: "⚡",
        title: "Неделя силы",
        desc: "Серия из 7 дней",
        done: (state.maxStreak || 0) >= 7
      },
      {
        icon: "🏅",
        title: "500 XP",
        desc: "Накопи 500 XP",
        done: state.xp >= 500
      }
    ];
  }

  function renderProfile() {
    screen = "profile";
    syncHearts();
    const cls = getClass(state.classId);
    const lessonsDone = Object.keys(state.done).length;
    const level = Math.floor(state.xp / 120) + 1;
    const levelXp = state.xp % 120;
    const achs = achievements();
    const initial = (state.name || "Я").trim().charAt(0).toUpperCase();
    const totalLessons = cls.units.length * KINDS.length;
    const doneInClass = flatLessons(cls).filter((x) => state.done[x.id]).length;
    const coursePct = totalLessons
      ? Math.round((doneInClass / totalLessons) * 100)
      : 0;

    app.innerHTML = `
      <div class="page">
        <header class="profile-head">
          <div class="avatar">${esc(initial)}</div>
          <div class="profile-names">
            <h1 class="h1">${esc(state.name || "Ученик")}</h1>
            <button class="class-chip small" id="profClass">${esc(cls.title)} <span class="chev">▾</span></button>
          </div>
        </header>

        <section class="level-card">
          <div class="level-row">
            <span class="level-badge">Уровень ${level}</span>
            <span class="muted small">${levelXp} / 120 XP</span>
          </div>
          <div class="level-bar"><span style="width:${(levelXp / 120) * 100}%"></span></div>
        </section>

        ${foxRow(
          coursePct >= 100
            ? "Весь курс пройден! Лис снимает шляпу 🎩"
            : `Курс пройден на ${coursePct}%. ${
                coursePct >= 50 ? "Лис впечатлён!" : "Лис верит в тебя!"
              }`,
          { mood: coursePct >= 50 ? "happy" : "" }
        )}

        <div class="stat-grid">
          <div class="stat-card"><span class="sc-num">${state.xp}</span><span class="sc-label">Всего XP</span></div>
          <div class="stat-card"><span class="sc-num">${state.streak}</span><span class="sc-label">Дней подряд</span></div>
          <div class="stat-card"><span class="sc-num">${lessonsDone}</span><span class="sc-label">Уроков пройдено</span></div>
          <div class="stat-card"><span class="sc-num">${state.perfect || 0}</span><span class="sc-label">Идеальных</span></div>
        </div>

        <h2 class="h2">Достижения</h2>
        <div class="ach-list">
          ${achs
            .map(
              (a) => `
            <div class="ach ${a.done ? "done" : ""}">
              <span class="ach-icon">${a.icon}</span>
              <div class="ach-text">
                <span class="ach-title">${esc(a.title)}</span>
                <span class="ach-desc">${esc(a.desc)}</span>
              </div>
              <span class="ach-state">${a.done ? "✓" : "…"}</span>
            </div>`
            )
            .join("")}
        </div>

        <h2 class="h2">Настройки</h2>
        <div class="settings">
          <button class="setting-row" id="installApp">
            <span class="setting-label">📲 Установить приложение</span>
            <span class="chev">›</span>
          </button>
          <button class="setting-row" id="toggleSound">
            <span class="setting-label">🔔 Звуковые эффекты</span>
            <span class="switch ${state.sound ? "on" : ""}"><i></i></span>
          </button>
          <button class="setting-row" id="toggleTheme">
            <span class="setting-label">🌙 Тёмная тема</span>
            <span class="switch ${isDarkTheme() ? "on" : ""}"><i></i></span>
          </button>
          <button class="setting-row" id="resetAll">
            <span class="setting-label">🗑 Сбросить весь прогресс</span>
            <span class="chev">›</span>
          </button>
        </div>

        <p class="tiny muted center" style="margin-top:20px">LinguaClass · офлайн-приложение</p>
      </div>
      ${bottomNav("profile")}`;

    $("#profClass").addEventListener("click", openClassModal);
    $("#installApp").addEventListener("click", openInstallModal);
    $("#toggleSound").addEventListener("click", () => {
      state.sound = !state.sound;
      save();
      renderProfile();
    });
    $("#toggleTheme").addEventListener("click", () => {
      setTheme(isDarkTheme() ? "light" : "dark");
      sfx("tap");
      renderProfile();
    });
    $("#resetAll").addEventListener("click", () => {
      openModal(
        `<h3 class="h3">Сбросить прогресс?</h3>
         <p class="muted">XP, серия и все пройденные уроки будут удалены. Это действие нельзя отменить.</p>
         <div class="modal-actions">
           <button class="btn btn-secondary" data-close>Отмена</button>
           <button class="btn btn-danger" id="resetYes">Сбросить</button>
         </div>`
      );
      $("[data-close]", modalRoot).addEventListener("click", closeModal);
      $("#resetYes").addEventListener("click", () => {
        const name = state.name;
        const classId = state.classId;
        state = defaultState();
        state.name = name;
        state.classId = classId;
        state.goal = getClass(classId).goal;
        state.onboarded = true;
        save();
        closeModal();
        render();
      });
    });
    bindNav();
  }

  /* =========================================================
     Запуск
     ========================================================= */
  // Небольшой API для отладки и QA (не влияет на работу приложения)
  window.LinguaClass = {
    get state() {
      return state;
    },
    get lesson() {
      return currentLesson;
    },
    get screen() {
      return screen;
    },
    buildLesson,
    flatLessons,
    startLesson,
    go,
    save,
    reset() {
      state = defaultState();
      save();
      go("onboarding");
    }
  };

  function init() {
    applyTheme();
    syncHearts();
    if (!state.onboarded) {
      screen = "onboarding";
    } else {
      screen = "home";
    }
    render();

    document.addEventListener("visibilitychange", () => {
      if (!document.hidden) {
        const gained = syncHearts();
        if (gained && (screen === "home" || screen === "hearts" || screen === "profile")) {
          render();
        } else if (screen === "hearts") {
          render();
        }
      }
    });

    // Первый тап разблокирует звук в мобильных браузерах
    document.addEventListener(
      "pointerdown",
      () => {
        ctx();
      },
      { once: true }
    );

    if ("serviceWorker" in navigator && location.protocol.startsWith("http")) {
      navigator.serviceWorker.register("./sw.js").catch(() => {});
    }
  }

  init();
})();
