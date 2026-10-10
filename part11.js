/* ==========================================================
   PART 11 — BE READY FOR THAT DAY ❤️
   JAVASCRIPT PART 1 OF 2
   Scene Controller • Text Reveals • Visual Effects
   File: part11.js
   ========================================================== */

(() => {
  "use strict";

  /* ---------- PREVENT DOUBLE INITIALIZATION ---------- */

  if (window.__ARADHYA_PART11_INITIALIZED__) return;
  window.__ARADHYA_PART11_INITIALIZED__ = true;

  /* ---------- ELEMENT HELPERS ---------- */

  const $ = (selector, root = document) =>
    root.querySelector(selector);

  const $$ = (selector, root = document) =>
    Array.from(root.querySelectorAll(selector));

  const experience = $("#futureExperience");

  if (!experience) {
    console.error(
      "Part 11: #futureExperience not found. Check part11.html."
    );
    return;
  }

  const progressFill = $("#futureProgressFill");
  const status = $("#futureStatus");
  const endingOverlay = $("#futureEndingOverlay");
  const endingText = $("#futureEndingText");

  const scenes = [
    $("#openingScene"),
    $("#ringScene"),
    $("#questionScene"),
    $("#meetingScene"),
    $("#untilScene"),
    $("#finalScene")
  ].filter(Boolean);

  if (!scenes.length) {
    console.error("Part 11: No scene elements were found.");
    return;
  }

  /* ---------- STATE ---------- */

  let currentSceneIndex = 0;
  let isTransitioning = false;
  let isEnding = false;
  let activeTimers = [];
  let effectTimers = [];
  let sceneRunId = 0;

  const reducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;

  const wait = (ms) =>
    new Promise((resolve) => {
      const timer = window.setTimeout(resolve, ms);
      activeTimers.push(timer);
    });

  function clearSceneTimers() {
    activeTimers.forEach(window.clearTimeout);
    activeTimers = [];
  }

  function clearEffectTimers() {
    effectTimers.forEach(window.clearTimeout);
    effectTimers = [];
  }

  function setStatus(message = "") {
    if (status) status.textContent = message;
  }

  function updateProgress(index) {
    if (!progressFill) return;

    const percentage =
      scenes.length <= 1
        ? 100
        : (index / (scenes.length - 1)) * 100;

    progressFill.style.width = `${percentage}%`;
  }

  /* ---------- SCENE TEXT PREPARATION ---------- */

  function prepareSceneLines(scene) {
    if (!scene) return [];

    const lines = $$(".scene-line[data-sequence-line]", scene);

    lines.forEach((line) => {
      line.classList.remove("line-hidden", "line-visible");
      line.style.removeProperty("animation-delay");
      line.setAttribute("aria-hidden", "false");
    });

    return lines;
  }

  function hideSceneLines(scene) {
    const lines = prepareSceneLines(scene);

    if (reducedMotion) return lines;

    lines.forEach((line) => {
      line.classList.remove("line-visible");
      line.classList.add("line-hidden");
      line.setAttribute("aria-hidden", "true");
    });

    return lines;
  }

  /* ---------- REVEAL TEXT SEQUENTIALLY ---------- */

  async function revealSceneLines(scene, runId) {
    const lines = hideSceneLines(scene);

    if (!lines.length) return;

    const lineDelay = reducedMotion ? 0 : 620;

    for (let i = 0; i < lines.length; i += 1) {
      if (runId !== sceneRunId || isEnding) return;

      const line = lines[i];

      line.classList.remove("line-hidden");
      line.classList.add("line-visible");
      line.setAttribute("aria-hidden", "false");

      if (lineDelay > 0 && i < lines.length - 1) {
        await wait(lineDelay);
      }
    }
  }

  /* ---------- BUTTON VISIBILITY ---------- */

  function setSceneButtons(scene, visible) {
    if (!scene) return;

    const buttons = $$(
      ".future-button",
      scene
    );

    buttons.forEach((button) => {
      button.hidden = !visible;
      button.disabled = !visible;
      button.setAttribute("aria-hidden", String(!visible));
    });
  }

  function getSceneButton(scene) {
    if (!scene) return null;

    return $(".future-button", scene);
  }

  /* ---------- RING BOX ANIMATION ---------- */

  function openRingBox(box) {
    if (!box) return;

    box.classList.add("is-open");

    const lid = $(".ring-box-lid, .final-ring-lid", box);

    if (lid) {
      lid.classList.add("is-open");
    }
  }

  function closeRingBox(box) {
    if (!box) return;

    box.classList.remove("is-open");

    const lid = $(".ring-box-lid, .final-ring-lid", box);

    if (lid) {
      lid.classList.remove("is-open");
    }
  }

  async function runSceneVisuals(scene, runId) {
    if (!scene || runId !== sceneRunId) return;

    if (scene.id === "openingScene") {
      closeRingBox($("#openingRingBox"));
      await wait(reducedMotion ? 0 : 450);

      if (runId !== sceneRunId) return;

      openRingBox($("#openingRingBox"));
    }

    if (scene.id === "ringScene") {
      closeRingBox($("#heroRingBox"));
      await wait(reducedMotion ? 0 : 350);

      if (runId !== sceneRunId) return;

      openRingBox($("#heroRingBox"));
    }

    if (scene.id === "finalScene") {
      closeRingBox($("#finalRingBox"));
      await wait(reducedMotion ? 0 : 450);

      if (runId !== sceneRunId) return;

      openRingBox($("#finalRingBox"));
    }
  }

  /* ---------- ENTER A SCENE ---------- */

  async function enterScene(index) {
    if (isEnding || index < 0 || index >= scenes.length) return;

    clearSceneTimers();

    sceneRunId += 1;
    const runId = sceneRunId;

    currentSceneIndex = index;
    isTransitioning = true;

    const scene = scenes[index];

    scenes.forEach((item, sceneIndex) => {
      const active = sceneIndex === index;

      item.classList.toggle("active", active);
      item.setAttribute("aria-hidden", String(!active));

      if (!active) {
        setSceneButtons(item, false);
      }
    });

    updateProgress(index);
    setStatus("A little piece of our future ❤️");

    const button = getSceneButton(scene);

    if (button) {
      button.hidden = true;
      button.disabled = true;
      button.setAttribute("aria-hidden", "true");
    }

    await runSceneVisuals(scene, runId);

    if (runId !== sceneRunId || isEnding) return;

    await revealSceneLines(scene, runId);

    if (runId !== sceneRunId || isEnding) return;

    if (button) {
      button.hidden = false;
      button.disabled = false;
      button.setAttribute("aria-hidden", "false");
    }

    isTransitioning = false;
    setStatus("");
  }

  /* ---------- FORWARD-ONLY NAVIGATION ---------- */

  async function goForward() {
    if (isTransitioning || isEnding) return;

    if (currentSceneIndex >= scenes.length - 1) {
      return;
    }

    const nextIndex = currentSceneIndex + 1;

    await enterScene(nextIndex);
  }

  /* ---------- CONNECT OPENING BUTTON ---------- */

  const openingButton = $("#continueFuture");

  if (openingButton) {
    openingButton.addEventListener("click", async () => {
      if (isTransitioning || isEnding) return;

      openingButton.disabled = true;
      await goForward();

      if (!isEnding && openingButton.isConnected) {
        openingButton.disabled = false;
      }
    });
  }

  /* ---------- CONNECT ALL NEXT-SCENE BUTTONS ---------- */

  $$("[data-next-scene]").forEach((button) => {
    button.addEventListener("click", async () => {
      if (isTransitioning || isEnding) return;

      button.disabled = true;
      await goForward();

      if (!isEnding && button.isConnected) {
        button.disabled = false;
      }
    });
  });

  /* ---------- CONNECT FINAL TRANSITION BUTTON ---------- */

  const finalButton = $("#continueToPart12");

  if (finalButton) {
    finalButton.addEventListener("click", async () => {
      if (isTransitioning || isEnding) return;

      if (currentSceneIndex !== scenes.length - 1) return;

      isEnding = true;
      isTransitioning = true;
      finalButton.disabled = true;

      await beginEnding();
    });
  }

  /* ---------- ENDING PLACEHOLDER ---------- */

  async function beginEnding() {
  if (isEnding || isTransitioning) return;

  isEnding = true;
  isTransitioning = true;

  clearSceneTimers();
  setStatus("");

  const finalRingBox = $("#finalRingBox");
  const warmLight = $(".future-ending-warm-light");
  const finalButton = $("#continueToPart12");

  if (finalButton) {
    finalButton.disabled = true;
    finalButton.style.pointerEvents = "none";
  }

  // Close the ring box.
  if (finalRingBox) {
    closeRingBox(finalRingBox);
  }

  await wait(900);

  // Reveal the cinematic ending.
  if (experience) {
    experience.classList.add("is-ending");
  }

  if (endingOverlay) {
    endingOverlay.classList.add("active");
    endingOverlay.setAttribute("aria-hidden", "false");
    endingOverlay.style.opacity = "1";
    endingOverlay.style.visibility = "visible";
  }

  if (endingText) {
    endingText.textContent = "Until then… ❤️";
    endingText.style.opacity = "1";
  }

  await wait(2200);

  // Fade out the final message.
  if (endingText) {
    endingText.style.transition = "opacity 900ms ease";
    endingText.style.opacity = "0";
  }

  await wait(700);

  // Fade the golden light into darkness.
  if (warmLight) {
    warmLight.style.transition =
      "opacity 1200ms ease, transform 1400ms ease";
    warmLight.style.opacity = "0";
  }

  if (endingOverlay) {
    endingOverlay.style.transition = "opacity 1200ms ease";
    endingOverlay.style.opacity = "0";
  }

  await wait(1400);

  // Open Part 12.
  window.location.href = "part12.html";
}

  /* ---------- FAIRY LIGHTS ---------- */

  function createFairyLights() {
    const layer = $(".fairy-lights");

    if (!layer || layer.dataset.ready === "true") return;

    layer.dataset.ready = "true";

    const count = window.innerWidth < 520 ? 14 : 22;
    const fragment = document.createDocumentFragment();

    for (let i = 0; i < count; i += 1) {
      const light = document.createElement("span");

      light.style.setProperty(
        "--light-x",
        `${(i / Math.max(count - 1, 1)) * 100}%`
      );

      light.style.setProperty(
        "--light-y",
        `${15 + Math.sin(i * 0.7) * 19}px`
      );

      light.style.setProperty(
        "--light-speed",
        `${2.1 + Math.random() * 2.4}s`
      );

      light.style.setProperty(
        "--light-delay",
        `${Math.random() * 2.5}s`
      );

      fragment.appendChild(light);
    }

    layer.appendChild(fragment);
  }

  /* ---------- BOKEH PARTICLES ---------- */

  function createBokeh() {
    const layer = $(".bokeh-layer");

    if (!layer || layer.dataset.ready === "true") return;

    layer.dataset.ready = "true";

    const count = window.innerWidth < 520 ? 12 : 20;
    const fragment = document.createDocumentFragment();

    for (let i = 0; i < count; i += 1) {
      const particle = document.createElement("span");

      particle.className = "bokeh";

      particle.style.setProperty(
        "--x",
        `${Math.random() * 100}%`
      );

      particle.style.setProperty(
        "--y",
        `${12 + Math.random() * 82}%`
      );

      particle.style.setProperty(
        "--size",
        `${4 + Math.random() * 12}px`
      );

      particle.style.setProperty(
        "--duration",
        `${7 + Math.random() * 8}s`
      );

      particle.style.setProperty(
        "--delay",
        `${Math.random() * -12}s`
      );

      fragment.appendChild(particle);
    }

    layer.appendChild(fragment);
  }

  /* ---------- GOLD DUST ---------- */

  function createGoldDust() {
    const layer = $("#goldDust");

    if (!layer || layer.dataset.ready === "true") return;

    layer.dataset.ready = "true";

    const count = window.innerWidth < 520 ? 17 : 28;
    const fragment = document.createDocumentFragment();

    for (let i = 0; i < count; i += 1) {
      const particle = document.createElement("span");

      particle.className = "dust-particle";

      particle.style.setProperty(
        "--x",
        `${Math.random() * 100}%`
      );

      particle.style.setProperty(
        "--y",
        `${30 + Math.random() * 70}%`
      );

      particle.style.setProperty(
        "--size",
        `${1.5 + Math.random() * 2.5}px`
      );

      particle.style.setProperty(
        "--duration",
        `${5 + Math.random() * 7}s`
      );

      particle.style.setProperty(
        "--delay",
        `${Math.random() * -10}s`
      );

      particle.style.setProperty(
        "--drift",
        `${-25 + Math.random() * 50}px`
      );

      fragment.appendChild(particle);
    }

    layer.appendChild(fragment);
  }

  /* ---------- FALLING ROSE PETALS ---------- */

  function createPetal() {
    const layer = $("#petalLayer");

    if (!layer || isEnding) return;

    const petal = document.createElement("span");

    petal.className = "petal";

    petal.style.setProperty(
      "--x",
      `${Math.random() * 100}%`
    );

    petal.style.setProperty(
      "--size",
      `${7 + Math.random() * 10}px`
    );

    petal.style.setProperty(
      "--duration",
      `${9 + Math.random() * 8}s`
    );

    petal.style.setProperty(
      "--drift",
      `${-80 + Math.random() * 160}px`
    );

    petal.style.setProperty(
      "--spin",
      `${160 + Math.random() * 360}deg`
    );

    layer.appendChild(petal);

    const cleanup = window.setTimeout(() => {
      petal.remove();
    }, 19000);

    effectTimers.push(cleanup);
  }

  function startPetals() {
    if (reducedMotion) return;

    createPetal();
    createPetal();

    const timer = window.setInterval(() => {
      if (!isEnding) createPetal();
    }, 1800);

    effectTimers.push(timer);
  }

  /* ---------- INITIALIZATION ---------- */

  function initialize() {
    createFairyLights();
    createBokeh();
    createGoldDust();
    startPetals();

    scenes.forEach((scene, index) => {
      scene.classList.toggle("active", index === 0);
      scene.setAttribute("aria-hidden", String(index !== 0));
      setSceneButtons(scene, false);
    });

    /*
      Keep Part 1 visible on startup.
      Text and the first button are activated through enterScene().
    */

    enterScene(0);
  }

  /* ---------- CLEANUP ON PAGE EXIT ---------- */

  window.addEventListener("pagehide", () => {
    clearSceneTimers();
    clearEffectTimers();
  });

  /* ---------- START ---------- */

  initialize();

  /*
    JavaScript Part 2 adds:
    - Final warm-light fade timing
    - Closing ring-box moment
    - Smooth black fade
    - Reliable navigation to part12.html
    - Final accessibility and cleanup polish
  */
})();