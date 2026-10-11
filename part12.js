/* ==========================================================
   ARADHYA'S WORLD — PART 12
   GRAND FINALE
   Scene Navigation • 30s Fireworks • Generated Music
   Responsive Effects • Replay to index.html
========================================================== */

(() => {
  "use strict";

  const TOTAL_SCENES = 16;
  const FIREWORKS_SCENE = 8;
  const FIREWORKS_DURATION = 30000;
  const REPLAY_URL = "./index.html";

  const $ = (selector, root = document) =>
    root.querySelector(selector);

  const $$ = (selector, root = document) =>
    Array.from(root.querySelectorAll(selector));

  const scenes = $$(".finale-scene");
  const progressBar = $("#finaleProgressBar");
  const announcement = $("#sceneAnnouncement");
  const transition = $("#sceneTransition");
  const musicToggle = $("#musicToggle");
  const fireworksCanvas = $("#fireworksCanvas");
  const photo = $("#firstEverPhoto");
  const replayButton = $("#finalGiftButton");

  let currentScene = 1;
  let navigationLocked = false;
  let fireworksDeadline = 0;
  let fireworksTimer = null;
  let transitionTimer = null;
  let fireworksRunning = false;
  let fireworksFrame = 0;

  /* ------------------------------
     SCENE VALIDATION
  ------------------------------ */

  const getScene = (number) =>
    $(`#scene-${number}`);

  function sceneExists(number) {
    return (
      Number.isInteger(number) &&
      number >= 1 &&
      number <= TOTAL_SCENES &&
      Boolean(getScene(number))
    );
  }

  /* ------------------------------
     PROGRESS BAR
  ------------------------------ */

  function updateProgress(number) {
    const percent = (number / TOTAL_SCENES) * 100;

    if (progressBar) {
      progressBar.style.width = `${percent}%`;
      progressBar.setAttribute(
        "aria-valuenow",
        String(number)
      );
      progressBar.setAttribute(
        "aria-valuemin",
        "1"
      );
      progressBar.setAttribute(
        "aria-valuemax",
        String(TOTAL_SCENES)
      );
    }
  }

  /* ------------------------------
     SCENE NAVIGATION
  ------------------------------ */

  function stopFireworks() {
    fireworksRunning = false;

    if (fireworksTimer !== null) {
      clearTimeout(fireworksTimer);
      fireworksTimer = null;
    }

    if (fireworksFrame) {
      cancelAnimationFrame(fireworksFrame);
      fireworksFrame = 0;
    }

    fireworksDeadline = 0;

    if (fireworksCanvas) {
      const context = fireworksCanvas.getContext("2d");

      if (context) {
        context.clearRect(
          0,
          0,
          fireworksCanvas.width,
          fireworksCanvas.height
        );
      }
    }
  }

  function showTransition() {
    if (!transition) return;

    transition.classList.add("is-visible");
    transition.setAttribute("aria-hidden", "false");

    if (transitionTimer !== null) {
      clearTimeout(transitionTimer);
    }

    transitionTimer = setTimeout(() => {
      transition.classList.remove("is-visible");
      transition.setAttribute("aria-hidden", "true");
      transitionTimer = null;
    }, 260);
  }

  function goToScene(number, options = {}) {
    if (!sceneExists(number)) return;
    if (number === currentScene && !options.force) return;
    if (navigationLocked && !options.force) return;

    navigationLocked = true;

    if (currentScene === FIREWORKS_SCENE) {
      stopFireworks();
    }

    showTransition();

    scenes.forEach((scene) => {
      const isTarget = scene.id === `scene-${number}`;

      scene.classList.toggle("is-active", isTarget);
      scene.setAttribute(
        "aria-hidden",
        isTarget ? "false" : "true"
      );
    });

    currentScene = number;
    updateProgress(number);

    if (announcement) {
      const heading = $(
        "h1, h2, h3",
        getScene(number)
      );

      announcement.textContent = heading
        ? heading.textContent.trim()
        : `Scene ${number} of ${TOTAL_SCENES}`;
    }

    if (number === FIREWORKS_SCENE) {
      startFireworks();
    }

    if (number === 9) {
      stopFireworks();
    }

    if (number === TOTAL_SCENES) {
      stopFireworks();
    }

    // Let the transition finish without blocking the next tap for long.
    setTimeout(() => {
      navigationLocked = false;
    }, 280);

    // Bring keyboard and screen-reader focus to the new scene.
    const targetScene = getScene(number);

    if (targetScene) {
      targetScene.setAttribute("tabindex", "-1");

      setTimeout(() => {
        try {
          targetScene.focus({ preventScroll: true });
        } catch (_) {
          targetScene.focus();
        }
      }, 50);
    }
  }

  /* ------------------------------
     MANUAL SCENE BUTTONS
  ------------------------------ */

  document.addEventListener("click", (event) => {
    const nextButton = event.target.closest(
      "[data-next-scene], .scene-continue"
    );

    if (!nextButton) return;

    // Replay is handled separately below.
    if (nextButton === replayButton) return;

    // Fireworks must finish their full 30 seconds.
    if (currentScene === FIREWORKS_SCENE) return;

    const rawNumber = nextButton.getAttribute(
      "data-next-scene"
    );

    if (rawNumber === null) return;

    const nextNumber = Number(rawNumber);

    if (!sceneExists(nextNumber)) {
      console.warn(
        "Invalid data-next-scene value:",
        rawNumber
      );
      return;
    }

    event.preventDefault();
    goToScene(nextNumber);
  });

  /* ------------------------------
     REPLAY
  ------------------------------ */

  if (replayButton) {
    replayButton.addEventListener("click", (event) => {
      event.preventDefault();
      stopFireworks();
      stopMusic();
      window.location.href = REPLAY_URL;
    });
  }

  /* ------------------------------
     FIRST PHOTO FALLBACK
  ------------------------------ */

  if (photo) {
    const photoFrame = photo.closest(
      ".finale-photo-frame"
    );

    const updatePhotoState = () => {
      if (!photoFrame) return;

      photoFrame.classList.toggle(
        "photo-unavailable",
        !photo.complete || photo.naturalWidth === 0
      );
    };

    photo.addEventListener("load", updatePhotoState);
    photo.addEventListener("error", updatePhotoState);

    if (photo.complete) {
      updatePhotoState();
    }
  }

  /* ==========================================================
     GENERATED BACKGROUND MUSIC
     No MP3 or external audio file required.
  ========================================================== */

  let audioContext = null;
  let masterGain = null;
  let musicInterval = null;
  let musicEnabled = false;
  let musicStep = 0;

  const melody = [
    [261.63, 329.63, 392.00],
    [293.66, 349.23, 440.00],
    [246.94, 329.63, 392.00],
    [261.63, 329.63, 392.00],
    [220.00, 293.66, 349.23],
    [246.94, 329.63, 392.00],
    [196.00, 261.63, 329.63],
    [220.00, 293.66, 349.23]
  ];

  function initialiseAudio() {
    if (audioContext) return true;

    const AudioContextClass =
      window.AudioContext ||
      window.webkitAudioContext;

    if (!AudioContextClass) {
      if (musicToggle) {
        musicToggle.setAttribute(
          "aria-label",
          "Music is not supported in this browser"
        );
      }

      return false;
    }

    try {
      audioContext = new AudioContextClass();

      masterGain = audioContext.createGain();
      masterGain.gain.value = 0.0001;
      masterGain.connect(audioContext.destination);

      return true;
    } catch (error) {
      console.warn("Audio could not be started:", error);
      return false;
    }
  }

  function playTone(frequency, startTime, duration, volume) {
    if (!audioContext || !masterGain) return;

    const oscillator = audioContext.createOscillator();
    const noteGain = audioContext.createGain();

    oscillator.type = "sine";
    oscillator.frequency.setValueAtTime(
      frequency,
      startTime
    );

    noteGain.gain.setValueAtTime(
      0.0001,
      startTime
    );

    noteGain.gain.exponentialRampToValueAtTime(
      Math.max(volume, 0.0002),
      startTime + 0.08
    );

    noteGain.gain.exponentialRampToValueAtTime(
      0.0001,
      startTime + duration
    );

    oscillator.connect(noteGain);
    noteGain.connect(masterGain);

    oscillator.start(startTime);
    oscillator.stop(startTime + duration + 0.04);

    oscillator.addEventListener("ended", () => {
      oscillator.disconnect();
      noteGain.disconnect();
    }, { once: true });
  }

  function playMusicPhrase() {
    if (!audioContext || !musicEnabled) return;

    const chord = melody[musicStep % melody.length];
    const start = audioContext.currentTime + 0.04;

    // Soft, warm chord.
    chord.forEach((frequency, index) => {
      playTone(
        frequency,
        start + index * 0.035,
        1.45,
        index === 0 ? 0.045 : 0.025
      );
    });

    // A gentle high note gives the phrase a little sparkle.
    const topNote = chord[2] * 2;

    playTone(
      topNote,
      start + 0.36,
      0.85,
      0.012
    );

    musicStep++;
  }

  async function startMusic() {
    if (!initialiseAudio()) return;

    try {
      await audioContext.resume();

      musicEnabled = true;

      masterGain.gain.cancelScheduledValues(
        audioContext.currentTime
      );

      masterGain.gain.setTargetAtTime(
        0.45,
        audioContext.currentTime,
        0.8
      );

      playMusicPhrase();

      if (musicInterval !== null) {
        clearInterval(musicInterval);
      }

      musicInterval = setInterval(
        playMusicPhrase,
        1500
      );

      updateMusicButton();
    } catch (error) {
      console.warn("Music could not start:", error);
    }
  }

  function stopMusic() {
    musicEnabled = false;

    if (musicInterval !== null) {
      clearInterval(musicInterval);
      musicInterval = null;
    }

    if (audioContext && masterGain) {
      masterGain.gain.cancelScheduledValues(
        audioContext.currentTime
      );

      masterGain.gain.setTargetAtTime(
        0.0001,
        audioContext.currentTime,
        0.25
      );
    }

    updateMusicButton();
  }

  function updateMusicButton() {
    if (!musicToggle) return;

    musicToggle.setAttribute(
      "aria-pressed",
      String(musicEnabled)
    );

    musicToggle.classList.toggle(
      "music-is-on",
      musicEnabled
    );

    musicToggle.setAttribute(
      "aria-label",
      musicEnabled ? "Turn music off" : "Turn music on"
    );

    const label = $(
      "[data-music-label]",
      musicToggle
    );

    if (label) {
      label.textContent = musicEnabled
        ? "Music On"
        : "Music";
    }
  }

  if (musicToggle) {
    musicToggle.addEventListener("click", () => {
      if (musicEnabled) {
        stopMusic();
      } else {
        startMusic();
      }
    });
  }

  /* ==========================================================
     FIREWORKS
     Scene 8 runs for 30 seconds, then moves to scene 9.
  ========================================================== */

  let canvasContext = null;
  let canvasWidth = 0;
  let canvasHeight = 0;
  let pixelRatio = 1;
  let lastLaunchTime = 0;

  const rockets = [];
  const sparks = [];

  const MAX_ROCKETS = 7;
  const MAX_SPARKS = 650;

  const fireworkColors = [
    "#ffd98a",
    "#ff9fb8",
    "#c7a6ff",
    "#fff1c7",
    "#ffb78f",
    "#a9e7ff",
    "#f7c5ff"
  ];

  function random(min, max) {
    return Math.random() * (max - min) + min;
  }

  function resizeFireworksCanvas() {
    if (!fireworksCanvas) return;

    const rect = fireworksCanvas.getBoundingClientRect();

    if (!rect.width || !rect.height) return;

    canvasWidth = rect.width;
    canvasHeight = rect.height;

    // Cap pixel density to reduce mobile GPU load.
    pixelRatio = Math.min(
      window.devicePixelRatio || 1,
      1.5
    );

    fireworksCanvas.width = Math.round(
      canvasWidth * pixelRatio
    );

    fireworksCanvas.height = Math.round(
      canvasHeight * pixelRatio
    );

    if (!canvasContext) {
      canvasContext = fireworksCanvas.getContext(
        "2d",
        { alpha: true }
      );
    }

    if (canvasContext) {
      canvasContext.setTransform(
        pixelRatio,
        0,
        0,
        pixelRatio,
        0,
        0
      );
    }
  }

  function launchFirework() {
    if (rockets.length >= MAX_ROCKETS) return;

    const targetX = random(
      canvasWidth * 0.12,
      canvasWidth * 0.88
    );

    const targetY = random(
      canvasHeight * 0.12,
      canvasHeight * 0.55
    );

    const startX = random(
      canvasWidth * 0.15,
      canvasWidth * 0.85
    );

    const startY = canvasHeight + random(5, 35);

    const travelTime = random(42, 72);

    rockets.push({
      x: startX,
      y: startY,
      startX,
      startY,
      targetX,
      targetY,
      progress: 0,
      travelTime,
      age: 0,
      color: fireworkColors[
        Math.floor(Math.random() * fireworkColors.length)
      ],
      trail: []
    });
  }

  function explodeFirework(rocket) {
    const available = Math.max(
      0,
      MAX_SPARKS - sparks.length
    );

    if (!available) return;

    const count = Math.min(
      Math.floor(random(45, 78)),
      available
    );

    const hue = rocket.color;

    for (let i = 0; i < count; i++) {
      const angle = (Math.PI * 2 * i) / count +
        random(-0.08, 0.08);

      const speed = random(1.1, 4.1);

      sparks.push({
        x: rocket.x,
        y: rocket.y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        gravity: random(0.018, 0.055),
        drag: random(0.982, 0.993),
        alpha: 1,
        decay: random(0.009, 0.018),
        radius: random(1.1, 2.6),
        color: hue,
        twinkle: Math.random() > 0.72
      });
    }
  }

  function drawRocket(rocket) {
    if (!canvasContext) return;

    canvasContext.save();

    // Short glowing trail.
    canvasContext.strokeStyle = rocket.color;
    canvasContext.globalAlpha = 0.7;
    canvasContext.lineWidth = 2;
    canvasContext.beginPath();
    canvasContext.moveTo(
      rocket.x,
      rocket.y + 10
    );
    canvasContext.lineTo(
      rocket.x,
      rocket.y
    );
    canvasContext.stroke();

    canvasContext.globalAlpha = 1;
    canvasContext.fillStyle = "#fff9e7";
    canvasContext.shadowBlur = 12;
    canvasContext.shadowColor = rocket.color;
    canvasContext.beginPath();
    canvasContext.arc(
      rocket.x,
      rocket.y,
      2.1,
      0,
      Math.PI * 2
    );
    canvasContext.fill();

    canvasContext.restore();
  }

  function updateRockets() {
    for (let i = rockets.length - 1; i >= 0; i--) {
      const rocket = rockets[i];

      rocket.age++;
      rocket.progress += 1 / rocket.travelTime;

      const t = Math.min(rocket.progress, 1);
      const eased = 1 - Math.pow(1 - t, 1.4);

      rocket.x =
        rocket.startX +
        (rocket.targetX - rocket.startX) * eased;

      rocket.y =
        rocket.startY +
        (rocket.targetY - rocket.startY) * eased;

      drawRocket(rocket);

      if (t >= 1) {
        explodeFirework(rocket);
        rockets.splice(i, 1);
      }
    }
  }

  function updateSparks() {
    if (!canvasContext) return;

    for (let i = sparks.length - 1; i >= 0; i--) {
      const spark = sparks[i];

      spark.vx *= spark.drag;
      spark.vy *= spark.drag;
      spark.vy += spark.gravity;

      spark.x += spark.vx;
      spark.y += spark.vy;
      spark.alpha -= spark.decay;

      if (
        spark.alpha <= 0 ||
        spark.x < -30 ||
        spark.x > canvasWidth + 30 ||
        spark.y > canvasHeight + 30
      ) {
        sparks.splice(i, 1);
        continue;
      }

      canvasContext.save();

      const flicker = spark.twinkle
        ? random(0.65, 1)
        : 1;

      canvasContext.globalAlpha = Math.max(
        0,
        spark.alpha * flicker
      );

      canvasContext.fillStyle = spark.color;
      canvasContext.shadowColor = spark.color;
      canvasContext.shadowBlur = 8;

      canvasContext.beginPath();
      canvasContext.arc(
        spark.x,
        spark.y,
        spark.radius,
        0,
        Math.PI * 2
      );

      canvasContext.fill();
      canvasContext.restore();
    }
  }

  function fireworksLoop(timestamp) {
    if (!fireworksRunning) return;

    // Use wall-clock time so the scene doesn't extend beyond 30s
    // just because the browser temporarily pauses animation frames.
    if (Date.now() >= fireworksDeadline) {
      finishFireworks();
      return;
    }

    if (!canvasContext) {
      resizeFireworksCanvas();
    }

    if (canvasContext) {
      canvasContext.clearRect(
        0,
        0,
        canvasWidth,
        canvasHeight
      );

      // A small number of launches at varied intervals.
      if (
        timestamp - lastLaunchTime >
        random(300, 560)
      ) {
        launchFirework();
        lastLaunchTime = timestamp;
      }

      updateRockets();
      updateSparks();
    }

    fireworksFrame = requestAnimationFrame(
      fireworksLoop
    );
  }

  function startFireworks() {
    stopFireworks();

    if (!fireworksCanvas) {
      // Even if the canvas is missing, preserve the 30s flow.
      fireworksDeadline = Date.now() + FIREWORKS_DURATION;
      fireworksTimer = setTimeout(
        finishFireworks,
        FIREWORKS_DURATION
      );
      return;
    }

    resizeFireworksCanvas();

    rockets.length = 0;
    sparks.length = 0;

    fireworksRunning = true;
    fireworksDeadline = Date.now() + FIREWORKS_DURATION;
    lastLaunchTime = 0;

    // A deadline-based timer plus the animation-loop check
    // makes the auto-advance robust when the tab is backgrounded.
    fireworksTimer = setTimeout(
      finishFireworks,
      FIREWORKS_DURATION
    );

    fireworksFrame = requestAnimationFrame(
      fireworksLoop
    );
  }

  function finishFireworks() {
    if (currentScene !== FIREWORKS_SCENE) {
      stopFireworks();
      return;
    }

    stopFireworks();

    // Fireworks are finished; now reveal the birthday wish.
    goToScene(9, { force: true });
  }

  document.addEventListener("visibilitychange", () => {
    if (
      document.visibilityState === "visible" &&
      currentScene === FIREWORKS_SCENE &&
      fireworksDeadline &&
      Date.now() >= fireworksDeadline
    ) {
      finishFireworks();
    }
  });

  window.addEventListener("resize", () => {
    if (
      currentScene === FIREWORKS_SCENE &&
      fireworksRunning
    ) {
      resizeFireworksCanvas();
    }
  });

  /* ==========================================================
     AMBIENT PARTICLES
  ========================================================== */

  function createAmbientParticles() {
    const container = $("#ambientParticles");

    if (!container) return;

    container.replaceChildren();

    const smallScreen = window.matchMedia(
      "(max-width: 520px)"
    ).matches;

    const reducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    const count = reducedMotion
      ? 8
      : smallScreen
        ? 16
        : 25;

    const symbols = ["✦", "·", "✧", "♡"];

    for (let i = 0; i < count; i++) {
      const particle = document.createElement("span");

      particle.className = "ambient-particle";
      particle.setAttribute("aria-hidden", "true");
      particle.textContent = symbols[
        Math.floor(Math.random() * symbols.length)
      ];

      particle.style.left = `${random(2, 98)}%`;
      particle.style.top = `${random(5, 95)}%`;
      particle.style.animationDelay = `${random(0, 6)}s`;
      particle.style.animationDuration = `${random(5, 12)}s`;
      particle.style.opacity = String(random(0.25, 0.7));
      particle.style.fontSize = `${random(8, 17)}px`;

      container.appendChild(particle);
    }
  }

  /* ------------------------------
     REDUCED MOTION
  ------------------------------ */

  const reducedMotionQuery = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  );

  if (reducedMotionQuery.matches) {
    document.documentElement.classList.add(
      "reduced-motion"
    );
  }

  /* ------------------------------
     INITIALISE
  ------------------------------ */

  function initialise() {
    document.documentElement.classList.add(
      "aradhya-finale-ready"
    );

    // Ensure only the first scene is active on load.
    scenes.forEach((scene) => {
      const isFirst = scene.id === "scene-1";

      scene.classList.toggle("is-active", isFirst);
      scene.setAttribute(
        "aria-hidden",
        isFirst ? "false" : "true"
      );
    });

    currentScene = 1;
    updateProgress(1);
    updateMusicButton();
    createAmbientParticles();

    if (transition) {
      transition.setAttribute("aria-hidden", "true");
    }
  }

  initialise();

})();