/* ==========================================================
   PART 11 — BE READY FOR THAT DAY ❤️
   COMPLETE JAVASCRIPT
   File: part11.js
   ========================================================== */

(() => {
  "use strict";

  if (window.__ARADHYA_PART11_INITIALIZED__) return;
  window.__ARADHYA_PART11_INITIALIZED__ = true;

  /* ---------- ELEMENT HELPERS ---------- */

  const $ = (selector, root = document) =>
    root.querySelector(selector);

  const $$ = (selector, root = document) =>
    Array.from(root.querySelectorAll(selector));

  const experience = $("#futureExperience");

  if (!experience) {
    console.error("Part 11: #futureExperience not found.");
    return;
  }

  const progress = $("#futureProgress");
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
  ];

  if (scenes.some((scene) => !scene)) {
    console.error("Part 11: One or more scenes are missing.");
    return;
  }

  /* ---------- STATE ---------- */

  let currentSceneIndex = 0;
  let isTransitioning = false;
  let isEnding = false;
  let sceneRunId = 0;

  let activeTimers = [];
  let effectTimeouts = [];
  let petalInterval = null;

  const reducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;

  function wait(ms) {
    return new Promise((resolve) => {
      const timer = window.setTimeout(resolve, ms);
      activeTimers.push(timer);
    });
  }

  function clearSceneTimers() {
    activeTimers.forEach((timer) => window.clearTimeout(timer));
    activeTimers = [];
  }

  function clearEffectTimers() {
    effectTimeouts.forEach((timer) => window.clearTimeout(timer));
    effectTimeouts = [];

    if (petalInterval !== null) {
      window.clearInterval(petalInterval);
      petalInterval = null;
    }
  }

  function setStatus(message = "") {
    if (status) status.textContent = message;
  }

  /* ---------- PROGRESS ---------- */

  function updateProgress(index) {
    const percentage = scenes.length <= 1
      ? 100
      : Math.round((index / (scenes.length - 1)) * 100);

    if (progressFill) {
      progressFill.style.width = `${percentage}%`;
    }

    if (progress) {
      progress.setAttribute("aria-valuenow", String(percentage));
    }
  }

  /* ---------- SCENE TEXT ---------- */

  function getSceneLines(scene) {
    return $$("[data-sequence-line]", scene);
  }

  function hideSceneLines(scene) {
    const lines = getSceneLines(scene);

    lines.forEach((line) => {
      line.classList.remove("line-visible");
      line.classList.toggle("line-hidden", !reducedMotion);
      line.setAttribute("aria-hidden", String(!reducedMotion));
    });

    return lines;
  }

  async function revealSceneLines(scene, runId) {
    const lines = hideSceneLines(scene);

    for (let i = 0; i < lines.length; i += 1) {
      if (runId !== sceneRunId || isEnding) return;

      const line = lines[i];

      line.classList.remove("line-hidden");
      line.classList.add("line-visible");
      line.setAttribute("aria-hidden", "false");

      if (!reducedMotion && i < lines.length - 1) {
        await wait(620);
      }
    }
  }

  /* ---------- BUTTON VISIBILITY ---------- */

  function setSceneButtons(scene, visible) {
    $$(".future-button", scene).forEach((button) => {
      button.hidden = !visible;
      button.disabled = !visible;
      button.setAttribute("aria-hidden", String(!visible));
    });
  }

  function getSceneButton(scene) {
    return $(".future-button", scene);
  }

  /* ---------- RING BOX ---------- */

  function openRingBox(box) {
    if (!box) return;

    box.classList.add("is-open");

    const lid = $(".ring-box-lid, .final-ring-lid", box);

    if (lid) lid.classList.add("is-open");
  }

  function closeRingBox(box) {
    if (!box) return;

    box.classList.remove("is-open");

    const lid = $(".ring-box-lid, .final-ring-lid", box);

    if (lid) lid.classList.remove("is-open");
  }

  async function runSceneVisuals(scene, runId) {
    let box = null;

    if (scene.id === "openingScene") {
      box = $("#openingRingBox");
    } else if (scene.id === "ringScene") {
      box = $("#heroRingBox");
    } else if (scene.id === "finalScene") {
      box = $("#finalRingBox");
    }

    if (!box) return;

    closeRingBox(box);

    await wait(reducedMotion ? 0 : 450);

    if (runId !== sceneRunId || isEnding) return;

    openRingBox(box);
  }

  /* ---------- ENTER SCENE ---------- */

  async function enterScene(index) {
    if (isEnding || index < 0 || index >= scenes.length) return;

    clearSceneTimers();

    sceneRunId += 1;
    const runId = sceneRunId;

    currentSceneIndex = index;
    isTransitioning = true;

    const scene = scenes[index];

    scenes.forEach((item, itemIndex) => {
      const active = itemIndex === index;

      item.classList.toggle("active", active);
      item.setAttribute("aria-hidden", String(!active));

      if (!active) setSceneButtons(item, false);
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

    if (currentSceneIndex >= scenes.length - 1) return;

    await enterScene(currentSceneIndex + 1);
  }

  /* ---------- OPENING BUTTON ---------- */

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

  /* ---------- NEXT-SCENE BUTTONS ---------- */

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

  /* ---------- COMPLETE ENDING ---------- */

  async function beginEnding() {
    // IMPORTANT: Do not set isEnding or isTransitioning
    // before this function is called from the button handler.
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
    closeRingBox(finalRingBox);

    await wait(reducedMotion ? 100 : 900);

    // Fade the final scene into the ending overlay.
    experience.classList.add("is-ending");

    if (endingOverlay) {
      endingOverlay.classList.add("active");
      endingOverlay.setAttribute("aria-hidden", "false");
      endingOverlay.style.visibility = "visible";
      endingOverlay.style.opacity = "1";
      endingOverlay.style.pointerEvents = "auto";
    }

    if (endingText) {
      endingText.textContent = "Until then… ❤️";
      endingText.style.opacity = "1";
    }

    // Keep the message visible for a moment.
    await wait(reducedMotion ? 300 : 2200);

    // Fade out the message.
    if (endingText) {
      endingText.style.transition = reducedMotion
        ? "none"
        : "opacity 900ms ease";

      endingText.style.opacity = "0";
    }

    await wait(reducedMotion ? 0 : 700);

    // Fade the golden light and overlay.
    if (warmLight) {
      warmLight.style.transition = reducedMotion
        ? "none"
        : "opacity 1200ms ease, transform 1400ms ease";

      warmLight.style.opacity = "0";
    }

    if (endingOverlay) {
      endingOverlay.style.transition = reducedMotion
        ? "none"
        : "opacity 1200ms ease";

      endingOverlay.style.opacity = "0";
    }

    await wait(reducedMotion ? 100 : 1400);

    // Automatically navigate to Part 12.
    window.location.href = "part12.html";
  }

  /* ---------- FINAL BUTTON: FIXED ---------- */

  const finalButton = $("#continueToPart12");

  if (finalButton) {
    finalButton.addEventListener("click", async () => {
      if (isEnding || isTransitioning) return;

      if (currentSceneIndex !== scenes.length - 1) return;

      /*
       * FIX:
       * Do NOT set isEnding = true here.
       * Do NOT set isTransitioning = true here.
       * beginEnding() sets both flags itself.
       */
      await beginEnding();
    });
  } else {
    console.error(
      "Part 11: #continueToPart12 button was not found."
    );
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

  /* ---------- BOKEH ---------- */

  function createBokeh() {
    const layer = $(".bokeh-layer");

    if (!layer || layer.dataset.ready === "true") return;

    layer.dataset.ready = "true";

    const count = window.innerWidth < 520 ? 12 : 20;
    const fragment = document.createDocumentFragment();

    for (let i = 0; i < count; i += 1) {
      const particle = document.createElement("span");

      particle.className = "bokeh";

      particle.style.setProperty("--x", `${Math.random() * 100}%`);
      particle.style.setProperty("--y", `${12 + Math.random() * 82}%`);
      particle.style.setProperty("--size", `${4 + Math.random() * 12}px`);
      particle.style.setProperty("--duration", `${7 + Math.random() * 8}s`);
      particle.style.setProperty("--delay", `${Math.random() * -12}s`);

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

      particle.style.setProperty("--x", `${Math.random() * 100}%`);
      particle.style.setProperty("--y", `${30 + Math.random() * 70}%`);
      particle.style.setProperty("--size", `${1.5 + Math.random() * 2.5}px`);
      particle.style.setProperty("--duration", `${5 + Math.random() * 7}s`);
      particle.style.setProperty("--delay", `${Math.random() * -10}s`);
      particle.style.setProperty("--drift", `${-25 + Math.random() * 50}px`);

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

    petal.style.setProperty("--x", `${Math.random() * 100}%`);
    petal.style.setProperty("--size", `${7 + Math.random() * 10}px`);
    petal.style.setProperty("--duration", `${9 + Math.random() * 8}s`);
    petal.style.setProperty("--drift", `${-80 + Math.random() * 160}px`);
    petal.style.setProperty("--spin", `${160 + Math.random() * 360}deg`);

    layer.appendChild(petal);

    const cleanup = window.setTimeout(() => {
      petal.remove();
    }, 19000);

    effectTimeouts.push(cleanup);
  }

  function startPetals() {
    if (reducedMotion) return;

    createPetal();
    createPetal();

    petalInterval = window.setInterval(() => {
      if (!isEnding) createPetal();
    }, 1800);
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

    if (endingOverlay) {
      endingOverlay.classList.remove("active");
      endingOverlay.setAttribute("aria-hidden", "true");
    }

    enterScene(0);
  }

  /* ---------- CLEANUP ---------- */

  window.addEventListener("pagehide", () => {
    clearSceneTimers();
    clearEffectTimers();
  });

  /* ---------- START ---------- */

  initialize();
})();
