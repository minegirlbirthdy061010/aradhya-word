
// ==========================================================
// PART 06 — HEART BASKET GAME
// JS PART 1/3 — SETUP + HEART POOL + RESPONSIVE BASKET
// ==========================================================

(() => {
  "use strict";

  const TOTAL_HEARTS = 50;
  const GAME_SECONDS = 40;
  const MAX_ACTIVE_HEARTS = 19;
  const SPAWN_INTERVAL = 185;

  const HEART_COLORS = [
    "#f17fa8", "#e86e9d", "#f59bbc",
    "#dc6798", "#f4a4c1", "#d95a8d",
    "#f7b4cd"
  ];
const HEART_EMOJIS = [
  "💓", "❤️", "💝", "💞",
  "💖", "💗", "💘", "💕",
  "🩷", "💟"
];
  const HEART_SIZES = [19, 22, 24, 27, 30];

  const $ = (id) => document.getElementById(id);

  const gameApp = $("heartGame");
  const introScene = $("introScene");
  const gameScene = $("gameScene");
  const winScene = $("winScene");

  const startButton = $("startButton");
  const continueButton = $("continueButton");

  const timerCard = $("timerCard");
  const timerText = $("timerText");
  const caughtText = $("caughtText");
  const progressTrack = $("progressTrack");
  const progressFill = $("progressFill");
  const gameField = $("gameField");
  const heartsLayer = $("heartsLayer");
  const effectsLayer = $("effectsLayer");
  const basket = $("basket");
  const basketHeartCount = $("basketHeartCount");
  const gameHint = $("gameHint");
  const progressDots = $("progressDots");
  const winSparkles = $("winSparkles");
  const resultTitle = $("resultTitle");
  const cheatingMessage = $("cheatingMessage");
  const announcement = $("gameAnnouncement");
  const ambientParticles = $("ambientParticles");

  const requiredElements = [
    gameApp, introScene, gameScene, winScene,
    startButton, continueButton, timerCard, timerText,
    caughtText, progressTrack, progressFill, gameField,
    heartsLayer, effectsLayer, basket, basketHeartCount,
    gameHint, resultTitle, cheatingMessage
  ];

  if (requiredElements.some((element) => !element)) {
    console.error(
      "Heart Basket Game: HTML element missing. Check part06.html IDs."
    );
    return;
  }

  const state = {
    hearts: [],
    caught: 0,
    started: false,
    ended: false,
    assisting: false,
    startTime: 0,
    elapsed: 0,
    lastFrame: 0,
    rafId: 0,
    fieldWidth: 0,
    fieldHeight: 0,
    basketCenter: 0,
    targetCenter: 0,
    lastTimerSecond: GAME_SECONDS,
    pointerActive: false,
    activePointerId: null,
    audioContext: null,
    assistTimeouts: [],
    lastHintTime: 0
  };

  let nextSpawnAllowed = 0;
  let resizeObserver = null;
  let disposed = false;

  const random = (min, max) => Math.random() * (max - min) + min;

  const randomInt = (min, max) =>
    Math.floor(random(min, max + 1));

  const clamp = (value, min, max) =>
    Math.max(min, Math.min(max, value));

  function announce(message) {
    if (announcement) announcement.textContent = message;
  }

  function showScene(sceneToShow) {
    [introScene, gameScene, winScene].forEach((scene) => {
      const isActive = scene === sceneToShow;
      scene.classList.toggle("active", isActive);
      scene.hidden = !isActive;
      scene.setAttribute("aria-hidden", String(!isActive));
    });
  }

  function getBasketWidth() {
    return basket.getBoundingClientRect().width || 108;
  }

  function getBasketHeight() {
    return basket.getBoundingClientRect().height || 88;
  }

  function measureGameField() {
    const rect = gameField.getBoundingClientRect();

    state.fieldWidth = rect.width;
    state.fieldHeight = rect.height;

    state.basketCenter = clamp(
      state.basketCenter || rect.width / 2,
      getBasketWidth() / 2,
      rect.width - getBasketWidth() / 2
    );

    state.targetCenter = clamp(
      state.targetCenter || state.basketCenter,
      getBasketWidth() / 2,
      rect.width - getBasketWidth() / 2
    );

    renderBasket();
  }

  // Position is the basket's CENTER, so it stays inside the field.
  // No slow easing: the basket follows the user's finger immediately.

  function setBasketTarget(clientX) {
    const rect = gameField.getBoundingClientRect();
    const halfBasket = getBasketWidth() / 2;

    state.targetCenter = clamp(
      clientX - rect.left,
      halfBasket,
      Math.max(halfBasket, rect.width - halfBasket)
    );

    state.basketCenter = state.targetCenter;
    renderBasket();
  }

  function renderBasket() {
    const halfBasket = getBasketWidth() / 2;

    state.basketCenter = clamp(
      state.basketCenter,
      halfBasket,
      Math.max(halfBasket, state.fieldWidth - halfBasket)
    );

    basket.style.left = `${state.basketCenter}px`;
  }

  // Ambient background particles.

  function createAmbientParticles() {
    if (!ambientParticles) return;

    ambientParticles.replaceChildren();

    const count = window.matchMedia("(max-width: 600px)").matches
      ? 12
      : 20;

    const fragment = document.createDocumentFragment();

    for (let i = 0; i < count; i++) {
      const particle = document.createElement("span");
      particle.className = "ambient-particle";

      particle.style.left = `${random(2, 98)}%`;
      particle.style.setProperty(
        "--particle-size",
        `${random(2, 5)}px`
      );
      particle.style.setProperty(
        "--particle-duration",
        `${random(7, 13)}s`
      );
      particle.style.setProperty(
        "--particle-delay",
        `${random(-12, 0)}s`
      );

      fragment.appendChild(particle);
    }

    ambientParticles.appendChild(fragment);
  }

  function createFallingHeart(index) {
    const element = document.createElement("span");
    element.className = "falling-heart";
    element.setAttribute("aria-hidden", "true");

    const special = (index + 1) % 6 === 0;

    if (special) {
      element.classList.add("special-heart");
    }

    const size = HEART_SIZES[index % HEART_SIZES.length];
    const color = HEART_COLORS[index % HEART_COLORS.length];
    element.textContent =
  HEART_EMOJIS[Math.floor(Math.random() * HEART_EMOJIS.length)];

    element.style.setProperty("--heart-size", `${size}px`);
    element.style.setProperty("--heart-color", color);
    element.style.display = "none";

    heartsLayer.appendChild(element);

    return {
      element,
      index,
      special,
      size,
      x: 0,
      y: -40,
      speed: 100,
      drift: 0,
      phase: random(0, Math.PI * 2),
      swaySpeed: random(1.1, 2.7),
      rotation: random(-22, 22),
      rotationSpeed: random(-45, 45),
      active: false,
      caught: false,
      spawnedOnce: false,
      spawnAt: 0,
      retryAt: 0
    };
  }

  function createHeartPool() {
    state.hearts = [];
    heartsLayer.replaceChildren();

    const fragment = document.createDocumentFragment();

    for (let i = 0; i < TOTAL_HEARTS; i++) {
      const heart = createFallingHeart(i);
      fragment.appendChild(heart.element);
      state.hearts.push(heart);
    }

    heartsLayer.appendChild(fragment);
  }

  function renderHeart(heart, elapsedSeconds) {
    const sway = Math.sin(
      elapsedSeconds * heart.swaySpeed + heart.phase
    ) * heart.drift;

    const rotation =
      heart.rotation +
      Math.sin(elapsedSeconds * 1.7 + heart.phase) * 10;

    heart.element.style.transform =
      `translate3d(${heart.x + sway}px, ${heart.y}px, 0) ` +
      `rotate(${rotation}deg)`;
  }

  function resetHeartToTop(heart, retry = false) {
    const maxX = Math.max(0, state.fieldWidth - heart.size - 4);

    heart.x = random(3, maxX);
    heart.y = random(-75, -25);
    heart.speed = random(105, 190) * (heart.special ? 0.9 : 1);
    heart.drift = random(5, 20);
    heart.phase = random(0, Math.PI * 2);
    heart.rotation = random(-24, 24);
    heart.rotationSpeed = random(-48, 48);
    heart.active = true;
    heart.spawnedOnce = true;
    heart.element.style.display = "grid";
    heart.element.style.opacity = "1";
    heart.element.classList.remove("is-catching");

    if (retry) {
      heart.retryAt = state.elapsed + random(.35, .7);
    }

    renderHeart(heart, state.elapsed);
  }

  function getActiveHeartCount() {
    let count = 0;

    for (const heart of state.hearts) {
      if (heart.active) count++;
    }

    return count;
  }

  // Keep the field populated without creating DOM nodes every frame.
  // Missed hearts re-enter the queue so the player can try again.

  function spawnScheduledHearts(elapsed) {
    if (elapsed < nextSpawnAllowed) return;
    if (getActiveHeartCount() >= MAX_ACTIVE_HEARTS) return;

    let candidate = state.hearts.find(
      (heart) =>
        !heart.caught &&
        !heart.active &&
        !heart.spawnedOnce
    );

    if (!candidate) {
      candidate = state.hearts.find(
        (heart) =>
          !heart.caught &&
          !heart.active &&
          heart.spawnedOnce &&
          elapsed >= heart.retryAt
      );
    }

    if (!candidate) return;

    resetHeartToTop(candidate);
    nextSpawnAllowed = elapsed + SPAWN_INTERVAL / 1000;
  }

  function updateScore() {
    caughtText.textContent = String(state.caught);
    basketHeartCount.textContent = String(state.caught);

    const percentage = (state.caught / TOTAL_HEARTS) * 100;
    progressFill.style.width = `${percentage}%`;
    progressTrack.setAttribute("aria-valuenow", String(state.caught));

    if (progressDots) {
      const filled = Math.floor(state.caught / 10);
      progressDots.textContent =
        "♥".repeat(filled) + "♡".repeat(5 - filled);
    }
  }

  function updateHint(message) {
    const hintText = gameHint.querySelector("span:last-child");

    if (hintText) hintText.textContent = message;
  }

  function updateBasketVisual() {
    const heart = $("score-heart");

    if (heart) {
      heart.classList.remove("is-popping");
      void heart.offsetWidth;
      heart.classList.add("is-popping");
    }
  }

// ==========================================================
// JS PART 2/3 — CONTROLS + CATCH FX + GAME LOOP
// Continue directly after Part 1. Do not open a new IIFE.
// ==========================================================

function playCatchSound(special = false) {
  try {
    const AudioContextClass =
      window.AudioContext || window.webkitAudioContext;

    if (!AudioContextClass) return;

    if (!state.audioContext) {
      state.audioContext = new AudioContextClass();
    }

    const context = state.audioContext;

    if (context.state === "suspended") {
      context.resume().catch(() => {});
    }

    const oscillator = context.createOscillator();
    const gain = context.createGain();
    const now = context.currentTime;

    oscillator.type = "sine";
    oscillator.frequency.setValueAtTime(
      special ? 880 : 660,
      now
    );
    oscillator.frequency.exponentialRampToValueAtTime(
      special ? 1320 : 990,
      now + .085
    );

    gain.gain.setValueAtTime(.0001, now);
    gain.gain.exponentialRampToValueAtTime(.055, now + .012);
    gain.gain.exponentialRampToValueAtTime(.0001, now + .13);

    oscillator.connect(gain);
    gain.connect(context.destination);

    oscillator.start(now);
    oscillator.stop(now + .14);
  } catch (error) {
    // Sound is optional; the game must continue if audio is unavailable.
  }
}

function pulseBasket() {
  basket.classList.remove("is-catching");
  void basket.offsetWidth;
  basket.classList.add("is-catching");

  window.setTimeout(() => {
    basket.classList.remove("is-catching");
  }, 300);
}

function createCatchBurst(x, y, special = false) {
  const fragment = document.createDocumentFragment();

  const ring = document.createElement("span");
  ring.className = "catch-ring";
  ring.style.left = `${x}px`;
  ring.style.top = `${y}px`;
  ring.style.setProperty(
    "--ring-size",
    `${special ? 45 : 33}px`
  );

  fragment.appendChild(ring);

  const sparkCount = special ? 10 : 7;
  const sparkSymbols = ["✦", "✧", "·", "♡"];
  const sparkColors = [
    "#ffffff", "#f7a2c1", "#df6898", "#f5c2d7"
  ];

  for (let i = 0; i < sparkCount; i++) {
    const spark = document.createElement("span");
    spark.className = "catch-spark";
    spark.textContent = sparkSymbols[i % sparkSymbols.length];
    spark.style.left = `${x}px`;
    spark.style.top = `${y}px`;
    spark.style.setProperty(
      "--spark-size",
      `${random(8, special ? 17 : 14)}px`
    );
    spark.style.setProperty(
      "--spark-color",
      sparkColors[i % sparkColors.length]
    );
    spark.style.setProperty(
      "--spark-x",
      `${random(-48, 48)}px`
    );
    spark.style.setProperty(
      "--spark-y",
      `${random(-52, 30)}px`
    );
    spark.style.setProperty(
      "--spark-rotate",
      `${random(-150, 150)}deg`
    );

    fragment.appendChild(spark);
  }

  if (special) {
    const heartSpark = document.createElement("span");
    heartSpark.className = "heart-spark";
    heartSpark.textContent = "♥";
    heartSpark.style.left = `${x}px`;
    heartSpark.style.top = `${y}px`;
    heartSpark.style.setProperty("--spark-size", "21px");
    heartSpark.style.setProperty("--spark-color", "#e85e94");
    heartSpark.style.setProperty("--spark-x", "0px");
    heartSpark.style.setProperty("--spark-y", "-45px");

    fragment.appendChild(heartSpark);
  }

  effectsLayer.appendChild(fragment);

  // Clean up each effect when its animation ends.
  effectsLayer.querySelectorAll(
    ".catch-ring, .catch-spark, .heart-spark"
  ).forEach((effect) => {
    if (effect.dataset.cleanupBound) return;

    effect.dataset.cleanupBound = "true";
    effect.addEventListener("animationend", () => {
      effect.remove();
    }, { once: true });
  });
}

function createCatchLabel(x, y, text) {
  const label = document.createElement("span");
  label.className = "catch-pop";
  label.textContent = text;
  label.style.left = `${x}px`;
  label.style.top = `${y}px`;

  effectsLayer.appendChild(label);

  label.addEventListener("animationend", () => {
    label.remove();
  }, { once: true });
}

function catchHeart(heart) {
  if (!heart.active || heart.caught) return;

  heart.active = false;
  heart.caught = true;
  heart.element.style.display = "none";
  heart.element.classList.remove("is-catching");

  state.caught = Math.min(TOTAL_HEARTS, state.caught + 1);
  updateScore();
  pulseBasket();
  playCatchSound(heart.special);

  const burstX = clamp(
    heart.x + heart.size / 2,
    10,
    state.fieldWidth - 10
  );

  const basketTop =
    state.fieldHeight - 15 - getBasketHeight();

  createCatchBurst(
    burstX,
    Math.max(12, basketTop + 8),
    heart.special
  );

  if (heart.special) {
    createCatchLabel(
      burstX,
      Math.max(10, basketTop - 10),
      "Special love! ✨"
    );
  } else if (state.caught === 1) {
    createCatchLabel(
      burstX,
      Math.max(10, basketTop - 10),
      "One little heart! 💗"
    );
  }

  if (state.caught === 1) {
    updateHint("Your first heart! Keep going, malkin! 💗");
    announce("One heart collected.");
  } else if (state.caught === 10) {
    updateHint("10 hearts already! You're doing lovely! ✨");
    announce("10 hearts collected.");
  } else if (state.caught === 25) {
    updateHint("Halfway there! Catch the rest, my favourite! 💕");
    announce("25 hearts collected. Halfway there.");
  } else if (state.caught === 40) {
    updateHint("Almost there! A few more hearts! 👑");
    announce("40 hearts collected. Almost there.");
  } else if (state.caught === TOTAL_HEARTS) {
    updateHint("You caught every heart! ❤️");
    announce("All 50 hearts collected.");
  }
}

function updateHearts(deltaSeconds, elapsedSeconds) {
  spawnScheduledHearts(elapsedSeconds);

  const basketWidth = getBasketWidth();
  const basketTop =
    state.fieldHeight - 15 - getBasketHeight();

  const basketLeft = state.basketCenter - basketWidth * .43;
  const basketRight = state.basketCenter + basketWidth * .43;

  for (const heart of state.hearts) {
    if (!heart.active || heart.caught) continue;

    heart.y += heart.speed * deltaSeconds;
    heart.rotation += heart.rotationSpeed * deltaSeconds;

    renderHeart(heart, elapsedSeconds);

    const heartLeft = heart.x;
    const heartRight = heart.x + heart.size;
    const heartBottom = heart.y + heart.size;

    const horizontalOverlap =
      heartRight >= basketLeft && heartLeft <= basketRight;

    const verticalOverlap =
      heartBottom >= basketTop &&
      heart.y <= state.fieldHeight - 5;

    if (horizontalOverlap && verticalOverlap) {
      catchHeart(heart);
      continue;
    }

    // Missed hearts return after a short delay instead of disappearing
    // permanently. This keeps the 50-heart goal achievable.
    if (heart.y > state.fieldHeight + 8) {
      heart.active = false;
      heart.element.style.display = "none";
      heart.retryAt = elapsedSeconds + random(.25, .6);
    }
  }
}

function updateTimer(elapsedSeconds) {
  const remaining = Math.max(
    0,
    GAME_SECONDS - Math.floor(elapsedSeconds)
  );

  timerText.textContent = String(remaining);

  if (remaining <= 5) {
    timerCard.classList.add("is-warning");
  } else {
    timerCard.classList.remove("is-warning");
  }

  if (remaining !== state.lastTimerSecond) {
    state.lastTimerSecond = remaining;

    if (remaining === 10) {
      updateHint("10 seconds left! Catch those hearts! 💗");
      announce("10 seconds remaining.");
    } else if (remaining === 5) {
      updateHint("5 seconds! Come on, malkin! ✨");
      announce("5 seconds remaining.");
    }
  }

  return remaining;
}

// Move the basket instantly when the pointer moves.
// Pointer capture keeps touch input reliable near the field edges.

function onPointerDown(event) {
  if (!state.started || state.ended || state.assisting) return;
  if (event.pointerType === "mouse" && event.button !== 0) return;

  state.pointerActive = true;
  state.activePointerId = event.pointerId;

  setBasketTarget(event.clientX);

  try {
    gameField.setPointerCapture(event.pointerId);
  } catch (error) {
    // Pointer capture is optional on browsers that do not support it.
  }

  event.preventDefault();
}

function onPointerMove(event) {
  if (!state.started || state.ended || state.assisting) return;

  const isMatchingPointer =
    state.pointerActive &&
    event.pointerId === state.activePointerId;

  const isMouseHover =
    event.pointerType === "mouse";

  if (!isMatchingPointer && !isMouseHover) return;

  setBasketTarget(event.clientX);

  if (isMatchingPointer) event.preventDefault();
}

function onPointerUp(event) {
  if (event.pointerId !== state.activePointerId) return;

  state.pointerActive = false;
  state.activePointerId = null;

  try {
    if (gameField.hasPointerCapture(event.pointerId)) {
      gameField.releasePointerCapture(event.pointerId);
    }
  } catch (error) {
    // No action required.
  }
}

gameField.addEventListener("pointerdown", onPointerDown);
gameField.addEventListener("pointermove", onPointerMove, {
  passive: false
});
gameField.addEventListener("pointerup", onPointerUp);
gameField.addEventListener("pointercancel", onPointerUp);
gameField.addEventListener("lostpointercapture", onPointerUp);

// Keyboard alternative for accessibility and desktop use.
gameField.tabIndex = 0;

gameField.addEventListener("keydown", (event) => {
  if (!state.started || state.ended || state.assisting) return;

  const step = event.shiftKey ? 45 : 24;

  if (event.key === "ArrowLeft") {
    state.targetCenter = clamp(
      state.targetCenter - step,
      getBasketWidth() / 2,
      state.fieldWidth - getBasketWidth() / 2
    );
    state.basketCenter = state.targetCenter;
    renderBasket();
    event.preventDefault();
  } else if (event.key === "ArrowRight") {
    state.targetCenter = clamp(
      state.targetCenter + step,
      getBasketWidth() / 2,
      state.fieldWidth - getBasketWidth() / 2
    );
    state.basketCenter = state.targetCenter;
    renderBasket();
    event.preventDefault();
  }
});

// ==========================================================
// JS PART 3/3 — WIN + ASSIST + INIT
// Continue directly after Part 2.
// ==========================================================

function createWinSparkles() {
  if (!winSparkles) return;

  winSparkles.replaceChildren();

  const mobile = window.matchMedia("(max-width: 600px)").matches;
  const count = mobile ? 14 : 23;
  const symbols = ["✦", "✧", "♥", "·"];
  const colors = ["#ed80a8", "#f6a2bd", "#ffffff", "#e6a8c2"];
  const fragment = document.createDocumentFragment();

  for (let i = 0; i < count; i++) {
    const sparkle = document.createElement("span");

    sparkle.className = "win-sparkle";
    sparkle.textContent = symbols[i % symbols.length];

    sparkle.style.setProperty("--win-x", `${random(3, 97)}%`);
    sparkle.style.setProperty("--win-y", `${random(5, 95)}%`);
    sparkle.style.setProperty("--win-size", `${random(10, 19)}px`);
    sparkle.style.setProperty("--win-duration", `${random(2.5, 4.8)}s`);
    sparkle.style.setProperty("--win-delay", `${random(-4.5, 0)}s`);
    sparkle.style.setProperty("--win-color", colors[i % colors.length]);

    fragment.appendChild(sparkle);
  }

  winSparkles.appendChild(fragment);
}

function finishGame(usedAssist) {
  if (state.ended) return;

  state.ended = true;
  state.started = false;
  state.assisting = false;
  state.pointerActive = false;
  state.activePointerId = null;

  if (state.rafId) {
    cancelAnimationFrame(state.rafId);
    state.rafId = 0;
  }

  state.assistTimeouts.forEach((timeoutId) => {
    clearTimeout(timeoutId);
  });
  state.assistTimeouts = [];

  state.hearts.forEach((heart) => {
    heart.active = false;
    heart.element.style.display = "none";
  });

  timerText.textContent = "0";
  timerCard.classList.remove("is-warning");

  // Final state is always exactly 50 hearts.
  state.caught = TOTAL_HEARTS;
  updateScore();

  cheatingMessage.hidden = !usedAssist;

  resultTitle.textContent = usedAssist
    ? "Every little heart found its way to you. 💗"
    : "You caught every little piece of my heart. ✨";

  showScene(winScene);
  createWinSparkles();

  if (usedAssist) {
    announce("You won! All 50 hearts are collected.");
  } else {
    announce("Congratulations! You caught all 50 hearts.");
  }
}

function beginSecretAssist() {
  if (state.ended || state.assisting) return;

  state.assisting = true;
  state.started = false;
  state.pointerActive = false;

  if (state.rafId) {
    cancelAnimationFrame(state.rafId);
    state.rafId = 0;
  }

  updateHint("Malkin ke liye thodi si magic help! 😂❤️");

  const remainingHearts = state.hearts.filter(
    (heart) => !heart.caught
  );

  if (remainingHearts.length === 0) {
    finishGame(false);
    return;
  }

  const fieldHeight = state.fieldHeight;
  const basketTargetX = state.basketCenter;
  const basketTop = fieldHeight - 15 - getBasketHeight();

  remainingHearts.forEach((heart, index) => {
    heart.active = false;
    heart.element.style.display = "grid";
    heart.element.style.transition = "none";
    heart.element.style.opacity = "1";

    // Keep the animation lightweight: each heart reuses its element.
    const startX = clamp(
      heart.x,
      0,
      Math.max(0, state.fieldWidth - heart.size)
    );

    const startY = clamp(
      heart.y,
      -heart.size,
      Math.max(0, fieldHeight - heart.size)
    );

    const targetX = clamp(
      basketTargetX - heart.size / 2,
      0,
      Math.max(0, state.fieldWidth - heart.size)
    );

    const targetY = Math.max(0, basketTop - heart.size / 2);

    heart.element.style.transform =
      `translate3d(${startX}px, ${startY}px, 0) rotate(0deg)`;

    // Force the browser to commit the initial position before transition.
    void heart.element.offsetWidth;

    const delay = index * 48;
    const timeoutId = window.setTimeout(() => {
      if (state.ended) return;

      heart.caught = true;
      heart.element.style.transition =
        "transform .42s cubic-bezier(.22,1,.36,1), opacity .42s ease";

      heart.element.style.transform =
        `translate3d(${targetX}px, ${targetY}px, 0) scale(.55)`;

      heart.element.style.opacity = "0";

      state.caught = Math.min(TOTAL_HEARTS, state.caught + 1);
      updateScore();

      createCatchBurst(
        basketTargetX,
        Math.max(12, basketTop + 5),
        index % 3 === 0
      );

      if (index % 4 === 0) {
        pulseBasket();
      }

      const hideTimeout = window.setTimeout(() => {
        heart.element.style.display = "none";
        heart.element.style.transition = "none";
      }, 450);

      state.assistTimeouts.push(hideTimeout);

      if (index === remainingHearts.length - 1) {
        const finalTimeout = window.setTimeout(() => {
          finishGame(true);
        }, 520);

        state.assistTimeouts.push(finalTimeout);
      }
    }, delay);

    state.assistTimeouts.push(timeoutId);
  });
}

function gameFrame(timestamp) {
  if (!state.started || state.ended || state.assisting) return;

  if (!state.lastFrame) state.lastFrame = timestamp;

  const deltaSeconds = Math.min(
    (timestamp - state.lastFrame) / 1000,
    0.045
  );

  state.lastFrame = timestamp;
  state.elapsed = Math.max(0, (timestamp - state.startTime) / 1000);

  const remaining = updateTimer(state.elapsed);

  // Keep basket rendering synchronized with the current pointer position.
  renderBasket();

  updateHearts(deltaSeconds, state.elapsed);

  if (state.caught >= TOTAL_HEARTS) {
    finishGame(false);
    return;
  }

  if (remaining <= 0) {
    beginSecretAssist();
    return;
  }

  state.rafId = requestAnimationFrame(gameFrame);
}

function resetGame() {
  if (state.rafId) {
    cancelAnimationFrame(state.rafId);
    state.rafId = 0;
  }

  state.assistTimeouts.forEach(clearTimeout);
  state.assistTimeouts = [];

  state.caught = 0;
  state.started = false;
  state.ended = false;
  state.assisting = false;
  state.startTime = 0;
  state.elapsed = 0;
  state.lastFrame = 0;
  state.lastTimerSecond = GAME_SECONDS;
  state.pointerActive = false;
  state.activePointerId = null;

  nextSpawnAllowed = 0;

  timerText.textContent = String(GAME_SECONDS);
  timerCard.classList.remove("is-warning");

  cheatingMessage.hidden = true;
  resultTitle.textContent = "Every heart, collected with love.";

  effectsLayer.replaceChildren();

  updateHint("Catch them all, my favourite person! 💗");

  createHeartPool();
  updateScore();
  measureGameField();
}

function startGame() {
  if (state.started || state.ended || disposed) return;

  showScene(gameScene);
  resetGame();

  measureGameField();

  state.basketCenter = state.fieldWidth / 2;
  state.targetCenter = state.basketCenter;
  renderBasket();

  state.started = true;
  state.startTime = performance.now();
  state.lastFrame = 0;
  state.elapsed = 0;

  updateHint("30 seconds! Catch all 50 hearts, malkin! ❤️");
  announce("Game started. Catch all 50 falling hearts.");

  state.rafId = requestAnimationFrame(gameFrame);
}

// Pause the game clock when the page is hidden.
// Returning to the page won't consume the remaining game time.

let pausedAt = 0;

function onVisibilityChange() {
  if (document.hidden) {
    if (state.started && !state.ended && !state.assisting) {
      pausedAt = performance.now();

      if (state.rafId) {
        cancelAnimationFrame(state.rafId);
        state.rafId = 0;
      }
    }
    return;
  }

  if (pausedAt && state.started && !state.ended && !state.assisting) {
    state.startTime += performance.now() - pausedAt;
    state.lastFrame = 0;
    pausedAt = 0;
    state.rafId = requestAnimationFrame(gameFrame);
  }
}

document.addEventListener("visibilitychange", onVisibilityChange);

// Resize handling keeps the basket and hearts within the game field.

function onResize() {
  measureGameField();

  for (const heart of state.hearts) {
    if (!heart.active) continue;

    heart.x = clamp(
      heart.x,
      0,
      Math.max(0, state.fieldWidth - heart.size)
    );

    renderHeart(heart, state.elapsed);
  }

  renderBasket();
}

if ("ResizeObserver" in window) {
  resizeObserver = new ResizeObserver(onResize);
  resizeObserver.observe(gameField);
} else {
  window.addEventListener("resize", onResize, { passive: true });
}

startButton.addEventListener("click", startGame);

/* ---------- CONTINUE TO PART 07 ---------- */

continueButton.addEventListener("click", () => {
  if (continueButton.disabled) return;

  continueButton.disabled = true;
  continueButton.setAttribute("aria-busy", "true");

  announce("Our story continues…");

  const label = continueButton.querySelector(".button-label");

  if (label) {
    label.textContent = "Opening Our Story… ♡";
  }

  // Give the button a brief visual response before navigation.
  continueButton.style.opacity = "0.85";

  window.setTimeout(() => {
    window.location.href = "part07.html";
  }, 450);
});

function cleanup() {
  disposed = true;

  if (state.rafId) {
    cancelAnimationFrame(state.rafId);
  }

  state.assistTimeouts.forEach(clearTimeout);
  state.assistTimeouts = [];

  if (resizeObserver) resizeObserver.disconnect();

  window.removeEventListener("resize", onResize);
}

window.addEventListener("pagehide", cleanup, { once: true });

// Initial setup
createAmbientParticles();
createHeartPool();
updateScore();
measureGameField();
showScene(introScene);

gameField.style.touchAction = "none";

})();

