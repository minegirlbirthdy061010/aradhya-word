
/* =================================================
   ARADHYA'S WORLD — PART 07
   YOU WON MY HEART ❤️
   JAVASCRIPT — PART 1/3

   Includes:
   - Shared variables and helpers
   - Scene management
   - Dreamy ambient particles
   - Opening text sequence
   - Safe timer management

   Paste Part 2 and Part 3 below this code.
================================================= */

"use strict";

/* ---------- CONFIGURATION ---------- */

const PART_08_URL = "part08.html";

const P07_REDUCED_MOTION = window.matchMedia(
  "(prefers-reduced-motion: reduce)"
).matches;

/* ---------- ELEMENT REFERENCES ---------- */

const p07 = {
  app: document.getElementById("heartReveal"),

  opening: document.getElementById("openingScene"),
  heart: document.getElementById("heartRevealScene"),
  trophy: document.getElementById("trophyScene"),
  ending: document.getElementById("endingScene"),

  openingWait: document.getElementById("openingWait"),
  openingSecret: document.getElementById("openingSecret"),

  realisationLines: document.querySelectorAll(".reveal-line"),
  emotionalLines: document.querySelectorAll(".emotional-line"),

  mainTitle: document.getElementById("mainRevealTitle"),
  emotionalMessage: document.getElementById("emotionalMessage"),

  trophyStage: document.getElementById("trophyStage"),
  awardPanel: document.querySelector(".award-panel"),

  fireflies: document.getElementById("fireflies"),
  rosePetals: document.getElementById("rosePetals"),
  ambientHearts: document.getElementById("ambientHearts"),
  goldParticles: document.getElementById("goldParticles"),

  trophyParticles: document.getElementById("trophyParticles"),
  transitionParticles: document.getElementById("transitionParticles"),
  goldenTransition: document.getElementById("goldenTransition"),

  continueButton: document.getElementById("continueButton"),
  announcement: document.getElementById("revealAnnouncement")
};

/* ---------- SHARED STATE ---------- */

let p07Timers = [];
let p07AmbientCreated = false;
let p07TransitionStarted = false;
let p07SequenceStarted = false;

/* ---------- HELPER FUNCTIONS ---------- */

function p07Later(callback, delay) {
  const timer = window.setTimeout(() => {
    p07Timers = p07Timers.filter((item) => item !== timer);
    callback();
  }, delay);

  p07Timers.push(timer);
  return timer;
}

function p07ClearTimers() {
  p07Timers.forEach((timer) => window.clearTimeout(timer));
  p07Timers = [];
}

function p07Random(min, max) {
  return Math.random() * (max - min) + min;
}

function p07RandomInt(min, max) {
  return Math.floor(p07Random(min, max + 1));
}

function p07Announce(message) {
  if (p07.announcement) {
    p07.announcement.textContent = message;
  }
}

function p07ShowScene(targetScene) {
  const scenes = [
    p07.opening,
    p07.heart,
    p07.trophy,
    p07.ending
  ];

  scenes.forEach((scene) => {
    if (!scene) return;

    const isActive = scene === targetScene;

    scene.classList.toggle("active", isActive);
    scene.setAttribute("aria-hidden", String(!isActive));
  });
}

function p07Reveal(element, announcement) {
  if (!element) return;

  element.classList.add("visible");

  if (announcement) {
    p07Announce(announcement);
  }
}

function p07ResetRevealLines() {
  p07.realisationLines.forEach((line) => {
    line.classList.remove("visible");
  });

  p07.emotionalLines.forEach((line) => {
    line.classList.remove("visible");
  });

  if (p07.openingWait) {
    p07.openingWait.classList.remove("visible");
  }

  if (p07.openingSecret) {
    p07.openingSecret.classList.remove("visible");
  }

  if (p07.mainTitle) {
    p07.mainTitle.classList.remove("visible");
  }

  if (p07.trophyStage) {
    p07.trophyStage.classList.remove("visible");
  }

  if (p07.awardPanel) {
    p07.awardPanel.classList.remove("visible");
  }
}

/* ---------- DREAMY AMBIENT ATMOSPHERE ---------- */

function p07CreateAmbientParticles() {
  if (p07AmbientCreated) return;
  p07AmbientCreated = true;

  const smallScreen = window.innerWidth < 480;

  const fireflyCount = smallScreen ? 12 : 22;
  const petalCount = smallScreen ? 9 : 17;
  const heartCount = smallScreen ? 7 : 12;
  const goldCount = smallScreen ? 24 : 42;

  // Golden fireflies
  if (p07.fireflies) {
    for (let i = 0; i < fireflyCount; i++) {
      const item = document.createElement("span");

      item.className = "firefly";
      item.style.left = `${p07Random(2, 98)}%`;
      item.style.top = `${p07Random(5, 95)}%`;
      item.style.setProperty("--duration", `${p07Random(6, 13)}s`);
      item.style.setProperty("--delay", `${p07Random(-12, 0)}s`);

      p07.fireflies.appendChild(item);
    }
  }

  // Slowly drifting rose petals
  if (p07.rosePetals) {
    for (let i = 0; i < petalCount; i++) {
      const item = document.createElement("span");

      item.className = "rose-petal";
      item.style.setProperty("--left", `${p07Random(0, 100)}%`);
      item.style.setProperty("--size", `${p07Random(8, 16)}px`);
      item.style.setProperty("--rotation", `${p07Random(-80, 80)}deg`);
      item.style.setProperty("--duration", `${p07Random(10, 20)}s`);
      item.style.setProperty("--delay", `${p07Random(-20, 0)}s`);

      p07.rosePetals.appendChild(item);
    }
  }

  // Small translucent floating hearts
  if (p07.ambientHearts) {
    const heartSymbols = ["♡", "♥", "💗", "💞"];

    for (let i = 0; i < heartCount; i++) {
      const item = document.createElement("span");

      item.className = "ambient-heart";
      item.textContent =
        heartSymbols[p07RandomInt(0, heartSymbols.length - 1)];

      item.style.setProperty("--left", `${p07Random(2, 96)}%`);
      item.style.setProperty("--size", `${p07Random(12, 22)}px`);
      item.style.setProperty("--duration", `${p07Random(10, 18)}s`);
      item.style.setProperty("--delay", `${p07Random(-18, 0)}s`);

      p07.ambientHearts.appendChild(item);
    }
  }

  // Soft golden particles
  if (p07.goldParticles) {
    for (let i = 0; i < goldCount; i++) {
      const item = document.createElement("span");

      item.className = "gold-particle";
      item.style.setProperty("--left", `${p07Random(1, 99)}%`);
      item.style.setProperty("--top", `${p07Random(1, 99)}%`);
      item.style.setProperty("--size", `${p07Random(1.5, 4)}px`);
      item.style.setProperty("--duration", `${p07Random(4, 10)}s`);
      item.style.setProperty("--delay", `${p07Random(-10, 0)}s`);

      p07.goldParticles.appendChild(item);
    }
  }
}

/* ---------- OPENING TEXT SEQUENCE ---------- */

function p07StartOpening() {
  if (p07SequenceStarted) return;

  p07SequenceStarted = true;

  p07ClearTimers();
  p07ResetRevealLines();
  p07ShowScene(p07.opening);
  p07CreateAmbientParticles();

  p07Announce("Wait…");

  const initialDelay = P07_REDUCED_MOTION ? 100 : 750;
  const secretDelay = P07_REDUCED_MOTION ? 450 : 1900;
  const linesStartDelay = P07_REDUCED_MOTION ? 800 : 3600;
  const lineInterval = P07_REDUCED_MOTION ? 250 : 1650;

  p07Later(() => {
    p07Reveal(p07.openingWait, "Wait…");
  }, initialDelay);

  p07Later(() => {
    p07Reveal(
      p07.openingSecret,
      "There’s something I forgot to tell you."
    );
  }, secretDelay);

  p07.realisationLines.forEach((line, index) => {
    p07Later(() => {
      p07Reveal(line, line.textContent.trim());
    }, linesStartDelay + index * lineInterval);
  });

  const lastLineTime =
    linesStartDelay +
    Math.max(0, p07.realisationLines.length - 1) * lineInterval;

  // Continue to the next reveal only after the opening sequence.
  p07Later(() => {
    p07StartHeartReveal();
  }, lastLineTime + (P07_REDUCED_MOTION ? 700 : 1800));
}

/* ---------- PAGE INITIALIZATION ---------- */

function p07Initialize() {
  if (!p07.app) {
    console.error(
      "Part 07 could not initialize: #heartReveal was not found."
    );
    return;
  }

  p07CreateAmbientParticles();
  p07StartOpening();
}

window.addEventListener("pagehide", p07ClearTimers, { once: true });

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", p07Initialize, {
    once: true
  });
} else {
  p07Initialize();
}

/*
 * IMPORTANT:
 * p07StartHeartReveal() will be defined in Part 2/3.
 * Keep all three parts in this same file, in order.
 */

/* =================================================
   ARADHYA'S WORLD — PART 07
   YOU WON MY HEART ❤️
   JAVASCRIPT — PART 2/3

   Includes:
   - Heart reveal
   - Emotional message sequence
   - Golden particle effects
   - Trophy and award scene
================================================= */

/* ---------- GOLDEN PARTICLE GENERATOR ---------- */

function p07CreateGoldenParticles(container, count, transition = false) {
  if (!container) return;

  container.replaceChildren();

  const particleCount = P07_REDUCED_MOTION
    ? Math.min(count, 12)
    : count;

  for (let i = 0; i < particleCount; i++) {
    const particle = document.createElement("span");

    particle.className = transition
      ? "transition-particle"
      : "trophy-particle";

    particle.style.setProperty("--left", `${p07Random(0, 100)}%`);
    particle.style.setProperty("--top", `${p07Random(0, 100)}%`);
    particle.style.setProperty("--size", `${p07Random(2, 5)}px`);
    particle.style.setProperty("--delay", `${p07Random(0, 1.5)}s`);
    particle.style.setProperty("--duration", `${p07Random(2, 5)}s`);

    const angle = p07Random(0, Math.PI * 2);
    const distance = p07Random(70, 260);

    particle.style.setProperty(
      "--dx",
      `${Math.cos(angle) * distance}px`
    );

    particle.style.setProperty(
      "--dy",
      `${Math.sin(angle) * distance}px`
    );

    container.appendChild(particle);
  }
}

/* ---------- HEART REVEAL SCENE ---------- */

function p07StartHeartReveal() {
  p07ClearTimers();
  p07ShowScene(p07.heart);

  p07Announce("You caught them. You collected them. You kept going.");

  if (p07.mainTitle) {
    p07.mainTitle.classList.remove("visible");
  }

  p07.emotionalLines.forEach((line) => {
    line.classList.remove("visible");
  });

  // Reveal the glowing heart and title first.
  p07Later(() => {
    if (p07.mainTitle) {
      p07.mainTitle.classList.add("visible");
    }

    p07Announce("YOU WON MY HEART.");
  }, P07_REDUCED_MOTION ? 150 : 1100);

  // Reveal each emotional sentence in order.
  p07.emotionalLines.forEach((line, index) => {
    p07Later(() => {
      p07Reveal(line, line.textContent.trim());
    }, P07_REDUCED_MOTION
      ? 450 + index * 250
      : 2300 + index * 1850);
  });

  const finalLineTime = P07_REDUCED_MOTION
    ? 450 + Math.max(0, p07.emotionalLines.length - 1) * 250
    : 2300 + Math.max(0, p07.emotionalLines.length - 1) * 1850;

  // Move to the trophy only after the emotional reveal finishes.
  p07Later(() => {
    p07StartTrophyScene();
  }, finalLineTime + (P07_REDUCED_MOTION ? 800 : 2000));
}

/* ---------- TROPHY AND AWARD SCENE ---------- */

function p07StartTrophyScene() {
  p07ClearTimers();
  p07ShowScene(p07.trophy);

  p07CreateGoldenParticles(p07.trophyParticles, 34);

  if (p07.trophyStage) {
    p07.trophyStage.classList.add("visible");
  }

  if (p07.awardPanel) {
    p07.awardPanel.classList.add("visible");
  }

  p07Announce(
    "Congratulations, Malkinn. You won my heart. Officially."
  );

  /*
   * Show the final Continue screen after the trophy
   * and award have had time to be seen.
   *
   * This does NOT open Part 08 automatically.
   * The Continue button remains a manual action.
   */
  p07Later(() => {
    p07ShowScene(p07.ending);

    p07Announce(
      "Whenever you're ready, Malkinn. Continue to Part 08."
    );
  }, P07_REDUCED_MOTION ? 3000 : 9500);
}

/* =================================================
   ARADHYA'S WORLD — PART 07
   YOU WON MY HEART ❤️
   JAVASCRIPT — PART 3/3

   Includes:
   - Continue button interaction
   - Cinematic golden transition
   - Part 08 navigation
   - Reduced-motion support
================================================= */

/* ---------- FINAL CONTINUE TRANSITION ---------- */

function p07ContinueToPart08() {
  if (p07TransitionStarted) return;
  p07TransitionStarted = true;

  if (!p07.continueButton || !p07.goldenTransition) {
    console.error(
      "Part 07 transition elements are missing from part07.html."
    );
    p07TransitionStarted = false;
    return;
  }

  // Prevent double taps.
  p07.continueButton.disabled = true;
  p07.continueButton.setAttribute("aria-busy", "true");

  p07Announce(
    "A little golden surprise is waiting for you."
  );

  // Generate particles before the golden overlay appears.
  p07CreateGoldenParticles(
    p07.transitionParticles,
    60,
    true
  );

  // Begin the cinematic transition.
  p07.goldenTransition.setAttribute("aria-hidden", "false");
  p07.goldenTransition.classList.add("active");

  /*
   * Keep the transition covering the screen while navigating.
   * part08.html must exist in the same folder.
   */
  const navigationDelay = P07_REDUCED_MOTION ? 500 : 2800;

  p07Later(() => {
    window.location.href = PART_08_URL;
  }, navigationDelay);
}

/* ---------- BUTTON CONNECTION ---------- */

function p07ConnectContinueButton() {
  if (!p07.continueButton) {
    console.error(
      "Continue button #continueButton was not found."
    );
    return;
  }

  p07.continueButton.addEventListener(
    "click",
    p07ContinueToPart08
  );
}

/* ---------- FINAL INITIALIZATION ---------- */

/*
 * Part 1 already initializes the opening sequence.
 * This listener only connects the final Continue button.
 */
p07ConnectContinueButton();

/* =================================================
   END OF PART 07 JAVASCRIPT
   File: part07.js

   Required files:
   - part07.html
   - part07.css
   - part07.js
   - part08.html (for the Continue transition)
================================================= */
