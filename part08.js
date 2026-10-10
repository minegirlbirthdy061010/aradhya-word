
(() => {
  "use strict";

  const app = document.getElementById("distanceApp");
  if (!app || app.dataset.initialized === "true") return;
  app.dataset.initialized = "true";

  const sceneIds = [
    "openingScene",
    "missYouScene",
    "justSeeYouScene",
    "distanceMapScene",
    "notFarScene",
    "heartConnectionScene",
    "sameSkyScene",
    "waitingScene",
    "finalDistanceScene",
    "giftTransitionScene"
  ];

  const scenes = sceneIds.map(id => document.getElementById(id));
  const counter = document.getElementById("sceneCounter");
  const particles = document.getElementById("particles");
  const openGiftButton = document.getElementById("openGiftButton");

  if (scenes.some(scene => !scene)) {
    console.error("Part 08: One or more scene sections are missing.");
    return;
  }

  const reducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;

  let currentIndex = 0;
  let runId = 0;
  let timers = [];
  let audioContext = null;
  let audioStarted = false;

  // Har scene ke liye readable cinematic timing.
  const revealInterval = reducedMotion ? 250 : 1550;
  const endingPause = reducedMotion ? 900 : 3200;

  const sceneHold = [
    2100, // Opening
    2300, // I miss you
    2100, // Just to see you
    2300, // Distance map
    2200, // Not far
    2700, // Heart connection
    2200, // Same sky
    2600, // Waiting
    4000, // Final emotional line
    0     // Gift scene waits for a tap
  ];

  function schedule(callback, delay) {
    const timer = window.setTimeout(callback, delay);
    timers.push(timer);
    return timer;
  }

  function clearTimers() {
    timers.forEach(window.clearTimeout);
    timers = [];
  }

  function updateCounter(index) {
    if (counter) {
      counter.textContent =
        String(index + 1).padStart(2, "0") + " / " +
        String(scenes.length).padStart(2, "0");
    }
  }

  function hideSceneText(scene) {
    scene.querySelectorAll(".reveal").forEach(element => {
      element.classList.remove("cinematic-visible");
      element.classList.add("cinematic-hidden");
    });
  }

  function revealText(scene, thisRun, onComplete) {
    const elements = Array.from(scene.querySelectorAll(".reveal"));
    let index = 0;

    if (elements.length === 0) {
      onComplete();
      return;
    }

    function showNext() {
      if (thisRun !== runId) return;

      if (index >= elements.length) {
        onComplete();
        return;
      }

      const element = elements[index];
      element.classList.remove("cinematic-hidden");
      element.classList.add("cinematic-visible");
      index += 1;

      schedule(showNext, revealInterval);
    }

    // Pehli line turant nahi, halka cinematic pause lekar aati hai.
    schedule(showNext, reducedMotion ? 100 : 650);
  }

  function activateScene(index) {
    clearTimers();
    runId += 1;

    const thisRun = runId;
    currentIndex = index;

    scenes.forEach((scene, sceneIndex) => {
      scene.classList.remove("active", "leaving");

      if (sceneIndex !== index) {
        hideSceneText(scene);
      }
    });

    const scene = scenes[index];
    scene.classList.add("active");

    updateCounter(index);

    if (openGiftButton) {
      openGiftButton.hidden = true;
      openGiftButton.disabled = true;
    }

    revealText(scene, thisRun, () => {
      if (thisRun !== runId) return;

      // Gift scene is the only scene that waits for a button tap.
      if (index === scenes.length - 1) {
        if (openGiftButton) {
          openGiftButton.hidden = false;
          openGiftButton.disabled = false;
          openGiftButton.classList.add("gift-button-ready");
        }
        return;
      }

      const hold = sceneHold[index] ?? 2200;

      schedule(() => {
        if (thisRun === runId) {
          activateScene(index + 1);
        }
      }, hold);
    });
  }

  function makeParticles() {
    if (!particles) return;

    const amount = reducedMotion ? 8 : 26;
    const fragment = document.createDocumentFragment();

    for (let i = 0; i < amount; i += 1) {
      const particle = document.createElement("span");
      particle.className = "particle";

      particle.style.left = `${Math.random() * 100}%`;
      particle.style.setProperty(
        "--duration",
        `${8 + Math.random() * 10}s`
      );
      particle.style.setProperty(
        "--delay",
        `${-Math.random() * 15}s`
      );

      const size = 1.5 + Math.random() * 2.5;
      particle.style.width = `${size}px`;
      particle.style.height = `${size}px`;

      fragment.appendChild(particle);
    }

    particles.appendChild(fragment);
  }

  // Optional generated ambience. It begins only after a user gesture.
  // No MP3 file is loaded or downloaded.
  function startAmbience() {
    if (audioStarted || reducedMotion) return;

    const AudioContextClass =
      window.AudioContext || window.webkitAudioContext;

    if (!AudioContextClass) return;

    try {
      audioContext = new AudioContextClass();
      audioStarted = true;

      if (audioContext.state === "suspended") {
        audioContext.resume().catch(() => {});
      }

      const master = audioContext.createGain();
      master.gain.value = 0.0001;
      master.connect(audioContext.destination);

      const now = audioContext.currentTime;
      master.gain.setTargetAtTime(0.018, now, 2.2);

      // Soft, sustained tones rather than a loud melody.
      [130.81, 196.00, 261.63].forEach((frequency, index) => {
        const oscillator = audioContext.createOscillator();
        const volume = audioContext.createGain();

        oscillator.type = index === 1 ? "sine" : "triangle";
        oscillator.frequency.value = frequency;

        volume.gain.value = index === 0 ? 0.20 : 0.09;

        oscillator.connect(volume);
        volume.connect(master);
        oscillator.start();
      });
    } catch (error) {
      // The story still works if audio is unavailable.
      audioStarted = false;
    }
  }

  if (openGiftButton) {
    openGiftButton.hidden = true;
    openGiftButton.disabled = true;
    openGiftButton.classList.remove("gift-button-ready");

    openGiftButton.addEventListener("click", () => {
      if (currentIndex !== scenes.length - 1) return;

      const nextPage = app.dataset.nextPage || "part10.html";

      // Use a relative local page path for GitHub Pages.
      window.location.href = nextPage;
    });
  }

  // The first touch/click enables browser audio when supported.
  document.addEventListener("pointerdown", startAmbience, {
    once: true,
    passive: true
  });

  document.addEventListener("keydown", startAmbience, {
    once: true
  });

  makeParticles();
  activateScene(0);
})();
