// ===== DATA =====
const questions = [
  {
    question: "On which date did we meet?",
    answer: "October 30",
    options: ["October 31", "November 31", "October 30", "November 30"],
  },
  {
    question: "What’s my fav song?",
    answer: "Tera rastaan chodu na from Chennai Express",
    options: ["Darkhaast", "Apna bana le piya", "Varoon", "Tera rastaan chodu na from Chennai Express"],
  },
  {
    question: "What would I choose to do in my last moments?",
    answer: "Hold your hand",
    options: ["Do kisi attack to you", "Vahli to zenlal", "Play games", "Hold your hand"],
  },
  {
    question: "What do I like most about you?",
    answer: "Smile",
    options: ["Cheeks", "Smile", "Hand with Jewellery stack", "Eyes"],
  },
  {
    question: "What were you wearing when we had our first kiss?",
    answer: "White night dress pajamas",
    options: ["White night dress pajamas", "Pink t shirt and green shorts", "White t shirt and green shorts", "Blue t shirt and green shorts"],
  },
];

const helperLines = [
  "No pressure… but my heart is watching 👀",
  "Choose wisely, cutie 😌",
  "This quiz is 99% love, 1% stress",
  "If you get it wrong, I’ll still pretend you’re perfect 🙂",
  "The correct answer is the one that makes me blush 😳 (jk… maybe)",
];

const noMessages = [
  "No?? 😭 okay wait, try again.",
  "My heart just did a backflip… in a bad way.",
  "Are you sure? I bribed the code with chocolates 🍫",
  "Plot twist: the 'No' button is emotionally unavailable.",
  "Bestie… don’t do this to me 😔",
  "Okay fine, I’ll ask again (respectfully) 😌",
  "This is now a loop. Welcome.",
];

// ===== STATE =====
let idx = 0;
let selected = null;
let answers = new Array(questions.length).fill(null);
let actualScore = 0;

let noCount = 0;

// ===== ELEMENTS =====
const screens = {
  landing: document.getElementById("screen-landing"),
  quiz: document.getElementById("screen-quiz"),
  results: document.getElementById("screen-results"),
  valentine: document.getElementById("screen-valentine"),
  celebrate: document.getElementById("screen-celebrate"),
};

const startBtn = document.getElementById("startBtn");
const backBtn = document.getElementById("backBtn");
const nextBtn = document.getElementById("nextBtn");

const questionText = document.getElementById("questionText");
const optionsWrap = document.getElementById("optionsWrap");
const helperText = document.getElementById("helperText");
const progressText = document.getElementById("progressText");
const progressFill = document.getElementById("progressFill");
const qcard = document.getElementById("qcard");

const resultsLine = document.getElementById("resultsLine");
const scoreNow = document.getElementById("scoreNow");
const loveBonusBanner = document.getElementById("loveBonusBanner");
const toValentineBtn = document.getElementById("toValentineBtn");

const valMsg = document.getElementById("valMsg");
const yesBtn = document.getElementById("yesBtn");
const noBtn = document.getElementById("noBtn");
const valBtns = document.getElementById("valBtns");

const restartBtn = document.getElementById("restartBtn");

// Confetti canvases
const confettiCanvas = document.getElementById("confettiCanvas");
const confettiCanvas2 = document.getElementById("confettiCanvas2");

// Hearts background layer
const heartsLayer = document.getElementById("hearts-layer");

// ===== SCREEN MANAGEMENT =====
function showScreen(name) {
  Object.values(screens).forEach(s => s.classList.add("hidden"));
  screens[name].classList.remove("hidden");

  // little entrance animation
  const card = screens[name];
  card.classList.remove("pop-in");
  void card.offsetWidth;
  card.classList.add("pop-in");
}

// ===== QUIZ RENDER =====
function renderQuestion() {
  selected = answers[idx];
  nextBtn.disabled = (selected === null);

  const total = questions.length;
  progressText.textContent = `Question ${idx + 1}/${total}`;
  const percent = ((idx + 1) / total) * 100;
  progressFill.style.width = `${percent}%`;

  // aria progress update
  const pb = screens.quiz.querySelector(".progress-bar");
  pb.setAttribute("aria-valuenow", String(idx + 1));

  const q = questions[idx];
  questionText.textContent = q.question;

  // helper line
  helperText.textContent = helperLines[Math.floor(Math.random() * helperLines.length)];

  optionsWrap.innerHTML = "";
  q.options.forEach(opt => {
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = "optBtn";
    btn.textContent = opt;
    btn.setAttribute("aria-label", `Option: ${opt}`);

    if (selected === opt) btn.classList.add("selected");

    btn.addEventListener("click", (e) => {
      // store selection
      selected = opt;
      answers[idx] = opt;
      nextBtn.disabled = false;

      // update styles
      [...optionsWrap.querySelectorAll(".optBtn")].forEach(b => b.classList.remove("selected"));
      btn.classList.add("selected");

      // sparkle burst
      sparkleBurst(e.currentTarget);
    });

    optionsWrap.appendChild(btn);
  });

  // Back disabled on first Q
  backBtn.disabled = idx === 0;

  // pop qcard
  qcard.classList.remove("pop-in");
  void qcard.offsetWidth;
  qcard.classList.add("pop-in");
}

// ===== SPARKLES =====
function sparkleBurst(target) {
  const rect = target.getBoundingClientRect();
  const cx = rect.width / 2;
  const cy = rect.height / 2;

  const count = 10;
  for (let i = 0; i < count; i++) {
    const s = document.createElement("span");
    s.className = "sparkle";
    const angle = Math.random() * Math.PI * 2;
    const dist = 18 + Math.random() * 22;
    const dx = Math.cos(angle) * dist;
    const dy = Math.sin(angle) * dist;

    s.style.setProperty("--dx", `${dx}px`);
    s.style.setProperty("--dy", `${dy}px`);

    s.style.left = `${cx}px`;
    s.style.top = `${cy}px`;

    target.appendChild(s);
    setTimeout(() => s.remove(), 650);
  }
}

// ===== SCORE =====
function computeActualScore() {
  let score = 0;
  for (let i = 0; i < questions.length; i++) {
    if (answers[i] === questions[i].answer) score++;
  }
  return score;
}

async function animateResults() {
  showScreen("results");

  loveBonusBanner.classList.add("hidden");
  toValentineBtn.disabled = true;

  resultsLine.textContent = "Calculating score...";
  scoreNow.textContent = "0";

  await sleep(650);
  actualScore = computeActualScore();

  // show actual for a beat (funny honesty moment)
  resultsLine.textContent = "Okay wait… doing math 🤓";
  await sleep(650);

  scoreNow.textContent = String(actualScore);
  resultsLine.textContent = `You scored ${actualScore}/5…`;
  await sleep(900);

  // LOVE BONUS
  loveBonusBanner.classList.remove("hidden");
  resultsLine.textContent = "LOVE BONUS ACTIVATED 💞 (because you’re my favorite human)";
  await sleep(350);

  // animate up to full score
  await animateCountUp(actualScore, 5, 900, (val) => {
    scoreNow.textContent = String(val);
  });

  // confetti + heart shower
  triggerConfetti(confettiCanvas, 160);
  heartShower(18);

  await sleep(800);
  resultsLine.textContent = "Final Score: 5/5 🥰 (obviously)";
  toValentineBtn.disabled = false;
}

function animateCountUp(from, to, duration, onUpdate) {
  return new Promise(resolve => {
    const start = performance.now();
    const diff = to - from;

    function tick(now) {
      const t = Math.min(1, (now - start) / duration);
      const eased = easeOutCubic(t);
      const val = Math.round(from + diff * eased);
      onUpdate(val);
      if (t < 1) requestAnimationFrame(tick);
      else resolve();
    }
    requestAnimationFrame(tick);
  });
}

function easeOutCubic(t){ return 1 - Math.pow(1 - t, 3); }
function sleep(ms){ return new Promise(r => setTimeout(r, ms)); }

// ===== VALENTINE LOOP =====
function setupValentineScreen() {
  noCount = 0;
  valMsg.textContent = "Be honest… but also choose “Yes” 😌";
  yesBtn.style.transform = "scale(1)";
  yesBtn.style.filter = "brightness(1)";
  resetNoButtonPosition();
}

function onNoClick() {
  noCount++;
  // shake card
  screens.valentine.classList.remove("shake");
  void screens.valentine.offsetWidth;
  screens.valentine.classList.add("shake");

  const msg = noMessages[(noCount - 1) % noMessages.length];
  valMsg.textContent = msg;

  // grow yes button
  const scale = Math.min(1.0 + noCount * 0.08, 1.65);
  yesBtn.style.transform = `scale(${scale})`;
  yesBtn.style.filter = `brightness(${1 + Math.min(noCount * 0.06, 0.35)})`;

  // move no button safely
  moveNoButtonSafely();

  // tiny sadness sparkles (red)
  sparkleBurst(noBtn);
}

function resetNoButtonPosition() {
  noBtn.style.position = "relative";
  noBtn.style.left = "0px";
  noBtn.style.top = "0px";
}

function moveNoButtonSafely() {
  // Make it position absolute within valBtns
  const container = valBtns.getBoundingClientRect();
  const yesRect = yesBtn.getBoundingClientRect();

  noBtn.style.position = "absolute";

  // bounds inside container (padding)
  const pad = 10;

  // Must measure noBtn AFTER switching to absolute:
  // Temporarily set to center so measurement is stable
  noBtn.style.left = `${(container.width / 2) - 60}px`;
  noBtn.style.top = `6px`;

  const noRect = noBtn.getBoundingClientRect();
  const bw = noRect.width;
  const bh = noRect.height;

  const maxX = container.width - bw - pad;
  const maxY = container.height - bh - pad;

  // Try multiple random positions that don't overlap Yes too much
  for (let tries = 0; tries < 18; tries++) {
    const x = pad + Math.random() * Math.max(1, maxX - pad);
    const y = pad + Math.random() * Math.max(1, maxY - pad);

    // Convert yes rect to container coordinates
    const yesX = yesRect.left - container.left;
    const yesY = yesRect.top - container.top;
    const yesW = yesRect.width;
    const yesH = yesRect.height;

    // simple overlap check
    const overlap =
      x < yesX + yesW &&
      x + bw > yesX &&
      y < yesY + yesH &&
      y + bh > yesY;

    if (!overlap) {
      noBtn.style.left = `${x}px`;
      noBtn.style.top = `${y}px`;
      return;
    }
  }

  // fallback: put it below
  noBtn.style.left = `${pad}px`;
  noBtn.style.top = `${Math.max(pad, container.height - bh - pad)}px`;
}

function onYesClick() {
  showScreen("celebrate");
  triggerConfetti(confettiCanvas2, 220);
  heartShower(24);
}

// ===== CONFETTI (simple canvas particles) =====
function triggerConfetti(canvas, amount = 140) {
  const ctx = canvas.getContext("2d");
  const dpr = window.devicePixelRatio || 1;

  // size canvas to card
  const parent = canvas.parentElement;
  const rect = parent.getBoundingClientRect();
  canvas.width = Math.floor(rect.width * dpr);
  canvas.height = Math.floor(rect.height * dpr);
  canvas.style.width = `${rect.width}px`;
  canvas.style.height = `${rect.height}px`;
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

  const W = rect.width;
  const H = rect.height;

  const pieces = [];
  for (let i = 0; i < amount; i++) {
    pieces.push({
      x: Math.random() * W,
      y: -20 - Math.random() * H * 0.2,
      vx: -2 + Math.random() * 4,
      vy: 2 + Math.random() * 4.5,
      r: 3 + Math.random() * 4,
      rot: Math.random() * Math.PI,
      vr: -0.15 + Math.random() * 0.3,
      a: 0.9,
      // random pastel-ish color
      color: randomConfettiColor(),
    });
  }

  let frames = 0;
  const maxFrames = 140;

  function draw() {
    frames++;
    ctx.clearRect(0, 0, W, H);

    pieces.forEach(p => {
      p.x += p.vx;
      p.y += p.vy;
      p.vy += 0.03; // gravity
      p.rot += p.vr;
      p.a *= 0.995;

      ctx.save();
      ctx.globalAlpha = Math.max(0, p.a);
      ctx.translate(p.x, p.y);
      ctx.rotate(p.rot);
      ctx.fillStyle = p.color;
      ctx.fillRect(-p.r, -p.r, p.r * 2, p.r * 2);
      ctx.restore();
    });

    if (frames < maxFrames) requestAnimationFrame(draw);
    else ctx.clearRect(0, 0, W, H);
  }

  requestAnimationFrame(draw);
}

function randomConfettiColor() {
  const colors = ["#ff4d8d", "#ff9ad5", "#ffd1e8", "#ff2e63", "#ffb3d1", "#ffffff"];
  return colors[Math.floor(Math.random() * colors.length)];
}

// ===== HEART BACKGROUND =====
function startHeartsBackground() {
  // create hearts gradually
  const maxHearts = 16;
  setInterval(() => {
    const existing = heartsLayer.querySelectorAll(".floating-heart").length;
    if (existing >= maxHearts) return;

    const h = document.createElement("div");
    h.className = "floating-heart";
    h.textContent = Math.random() < 0.5 ? "💗" : "💞";

    const left = Math.random() * 100;
    const duration = 6 + Math.random() * 6;
    const drift = (-30 + Math.random() * 60).toFixed(0) + "px";
    const scale = (0.7 + Math.random() * 1.1).toFixed(2);

    h.style.left = `${left}vw`;
    h.style.animationDuration = `${duration}s`;
    h.style.setProperty("--drift", drift);
    h.style.setProperty("--scale", scale);

    heartsLayer.appendChild(h);
    setTimeout(() => h.remove(), duration * 1000 + 200);
  }, 450);
}

function heartShower(count = 16) {
  for (let i = 0; i < count; i++) {
    const h = document.createElement("div");
    h.className = "floating-heart";
    h.textContent = Math.random() < 0.5 ? "💖" : "💘";
    const left = Math.random() * 100;
    const duration = 3.5 + Math.random() * 2.5;
    const drift = (-50 + Math.random() * 100).toFixed(0) + "px";
    const scale = (0.9 + Math.random() * 1.4).toFixed(2);

    h.style.left = `${left}vw`;
    h.style.opacity = "0.9";
    h.style.animationDuration = `${duration}s`;
    h.style.setProperty("--drift", drift);
    h.style.setProperty("--scale", scale);

    heartsLayer.appendChild(h);
    setTimeout(() => h.remove(), duration * 1000 + 200);
  }
}

// ===== EVENTS =====
startBtn.addEventListener("click", () => {
  idx = 0;
  answers.fill(null);
  showScreen("quiz");
  renderQuestion();
});

backBtn.addEventListener("click", () => {
  if (idx > 0) {
    idx--;
    renderQuestion();
  }
});

nextBtn.addEventListener("click", async () => {
  if (answers[idx] === null) return;

  if (idx < questions.length - 1) {
    idx++;
    renderQuestion();
  } else {
    // finished
    await animateResults();
  }
});

toValentineBtn.addEventListener("click", () => {
  showScreen("valentine");
  setupValentineScreen();
});

noBtn.addEventListener("click", onNoClick);
yesBtn.addEventListener("click", onYesClick);

restartBtn.addEventListener("click", () => {
  showScreen("landing");
});

// Start hearts
startHeartsBackground();

// Start on landing
showScreen("landing");

// Keep confetti canvases sized on resize (optional)
window.addEventListener("resize", () => {
  // nothing needed; confetti sizes itself on trigger
});