/* ==========================================
   PART 10 — JAVASCRIPT PART 1/2
   Gift room + opening box + 9 little gifts
========================================== */

(() => {
  "use strict";

  const $ = (selector) => document.querySelector(selector);

  const experience = $("#giftExperience");

  if (!experience) {
    console.error("Part 10: #giftExperience not found.");
    return;
  }

  /* ---------- SCENE REFERENCES ---------- */

  const scenes = [
    $("#giftOpening"),
    $("#littleGifts"),
    $("#handmadeGifts"),
    $("#whyDifferent"),
    $("#realPart"),
    $("#whenWeMeet"),
    $("#everythingSaved"),
    $("#finalGiftMessage"),
    $("#letterTransition")
  ];

  const progressFill = $("#progressFill");
  const progressLabel = $("#progressLabel");

  let currentScene = 0;
  let currentGift = 0;
  let openingInProgress = false;
  let isTransitioning = false;
  let sceneTimers = [];

  /* ---------- GIFT DATA ---------- */

  const gifts = [
    {
      name: "Lipgloss 💋",
      emoji: "💄",
      note: "A little sparkle for that smile I love seeing.",
      visual: "lipgloss"
    },
    {
      name: "Eyeliner 🖤",
      emoji: "🖊️",
      note: "For those beautiful eyes that always stay in my memories.",
      visual: "eyeliner"
    },
    {
      name: "Kajal ✨",
      emoji: "🖤",
      note: "A tiny gift for the eyes I could look at forever.",
      visual: "kajal"
    },
    {
      name: "Nailpolish 💅",
      emoji: "💅",
      note: "A little colour, chosen with you in my thoughts.",
      visual: "nailpolish"
    },
    {
      name: "Scrunchy 🎀",
      emoji: "🎀",
      note: "A cute little something for my favourite girl.",
      visual: "scrunchy"
    },
    {
      name: "Clutcher 🌸",
      emoji: "🌸",
      note: "A little accessory, picked with a whole lot of care.",
      visual: "clutcher"
    },
    {
      name: "Earrings 💖",
      emoji: "💎",
      note: "Something pretty for someone who means so much to me.",
      visual: "earrings"
    },
    {
      name: "Chudi ❤️",
      emoji: "💗",
      note: "A little traditional charm, saved especially for you.",
      visual: "chudi"
    },
    {
      name: "Ring 💍",
      emoji: "💍",
      note: "A tiny circle, carrying a very big feeling. ❤️",
      visual: "ring"
    }
  ];

  /* ---------- SAFE SCENE UTILITIES ---------- */

  function clearSceneTimers() {
    sceneTimers.forEach((timer) => window.clearTimeout(timer));
    sceneTimers = [];
  }

  function sceneDelay(callback, delay) {
    const timer = window.setTimeout(callback, delay);
    sceneTimers.push(timer);
    return timer;
  }

  function setProgress(sceneIndex) {
    const percent = Math.round(((sceneIndex + 1) / scenes.length) * 100);

    if (progressFill) {
      progressFill.style.width = `${percent}%`;
    }

    if (progressLabel) {
      progressLabel.textContent = `A little world made for you · ${percent}%`;
    }

    const track = $(".progress-track");

    if (track) {
      track.setAttribute("aria-valuenow", String(percent));
    }
  }

  function showScene(index) {
    if (index < 0 || index >= scenes.length) {
      return false;
    }

    clearSceneTimers();

    scenes.forEach((scene, sceneIndex) => {
      if (!scene) return;

      scene.classList.remove("active", "fade-out");
      scene.setAttribute("aria-hidden", "true");

      if (sceneIndex === index) {
        scene.classList.add("active");
        scene.setAttribute("aria-hidden", "false");
      }
    });

    currentScene = index;
    setProgress(index);

    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });

    return true;
  }

  function moveToScene(index) {
    if (isTransitioning || index < 0 || index >= scenes.length) {
      return;
    }

    isTransitioning = true;

    const activeScene = scenes[currentScene];

    if (activeScene) {
      activeScene.classList.add("fade-out");
    }

    sceneDelay(() => {
      showScene(index);
      isTransitioning = false;
    }, 420);
  }

  function setHint(selector, message) {
    const element = $(selector);

    if (element) {
      element.textContent = message;
    }
  }

  /* ---------- ROOM ATMOSPHERE ---------- */

  function createBokeh() {
    const container = $("#roomBokeh");
    if (!container) return;

    container.replaceChildren();

    for (let i = 0; i < 16; i++) {
      const dot = document.createElement("span");

      dot.className = "bokeh-dot";
      dot.style.left = `${Math.random() * 100}%`;
      dot.style.top = `${Math.random() * 100}%`;
      dot.style.animationDelay = `${Math.random() * -8}s`;
      dot.style.animationDuration = `${6 + Math.random() * 8}s`;
      dot.style.opacity = `${0.15 + Math.random() * 0.4}`;

      container.appendChild(dot);
    }
  }

  function createGoldenDust() {
    const container = $("#goldenDust");
    if (!container) return;

    container.replaceChildren();

    for (let i = 0; i < 32; i++) {
      const particle = document.createElement("span");

      particle.className = "gold-dust-particle";
      particle.style.left = `${Math.random() * 100}%`;
      particle.style.top = `${55 + Math.random() * 45}%`;
      particle.style.animationDelay = `${Math.random() * -12}s`;
      particle.style.animationDuration = `${7 + Math.random() * 10}s`;
      particle.style.setProperty(
        "--drift",
        `${Math.round(Math.random() * 100 - 50)}px`
      );

      container.appendChild(particle);
    }
  }

  function createRosePetals() {
    const container = $("#rosePetals");
    if (!container) return;

    container.replaceChildren();

    for (let i = 0; i < 9; i++) {
      const petal = document.createElement("span");

      petal.className = "rose-petal";
      petal.style.left = `${Math.random() * 100}%`;
      petal.style.animationDelay = `${Math.random() * -15}s`;
      petal.style.animationDuration = `${12 + Math.random() * 10}s`;
      petal.style.setProperty(
        "--petal-drift",
        `${Math.round(Math.random() * 120 - 60)}px`
      );

      container.appendChild(petal);
    }
  }

  /* ---------- SCENE 1: OPEN THE MAIN BOX ---------- */

  const openMainBox = $("#openMainBox");

  function openGiftBox() {
    if (openingInProgress || currentScene !== 0) return;

    openingInProgress = true;

    const box = $("#openMainBox");
    const caption = $(".gift-box-caption");
    const hint = $(".opening-intro");

    if (box) {
      box.classList.add("box-opening");
      box.setAttribute("aria-pressed", "true");
    }

    if (caption) {
      caption.textContent = "A little something, saved for you… ❤️";
    }

    if (hint) {
      hint.textContent = "Opening your little world of gifts…";
    }

    sceneDelay(() => {
      moveToScene(1);
      openingInProgress = false;
    }, 1300);
  }

  if (openMainBox) {
    openMainBox.addEventListener("click", openGiftBox);
  }

  /* ---------- SCENE 2: GIFT DISPLAY ---------- */

  const giftObjectStage = $("#giftObjectStage");
  const giftNumber = $("#giftNumber");
  const giftItemName = $("#giftItemName");
  const giftItemNote = $("#giftItemNote");
  const giftDots = $("#giftDots");
  const nextGiftButton = $("#nextGiftButton");

  function createGiftDots() {
    if (!giftDots) return;

    giftDots.replaceChildren();

    gifts.forEach((gift, index) => {
      const dot = document.createElement("span");

      dot.className = "gift-dot";
      dot.setAttribute("aria-hidden", "true");

      if (index === currentGift) {
        dot.classList.add("active");
      }

      giftDots.appendChild(dot);
    });
  }

  function displayGift(index) {
    if (index < 0 || index >= gifts.length) return;

    currentGift = index;

    const gift = gifts[index];

    if (giftNumber) {
      giftNumber.textContent = `GIFT ${index + 1} OF ${gifts.length}`;
    }

    if (giftItemName) {
      giftItemName.textContent = gift.name;
    }

    if (giftItemNote) {
      giftItemNote.textContent = gift.note;
    }

    if (giftObjectStage) {
      giftObjectStage.replaceChildren();

      const visual = document.createElement("div");
      visual.className = "revealed-gift";
      visual.setAttribute("role", "img");
      visual.setAttribute("aria-label", gift.name);

      const emoji = document.createElement("div");
      emoji.className = "revealed-gift-emoji";
      emoji.textContent = gift.emoji;

      visual.appendChild(emoji);
      giftObjectStage.appendChild(visual);
    }

    createGiftDots();

    if (nextGiftButton) {
      nextGiftButton.textContent =
        index === gifts.length - 1
          ? "Now see what I made myself ✨"
          : "Next Gift ✨";
    }

    setHint(
      "#giftStatus",
      index === gifts.length - 1
        ? "That was the last little gift… but there is more. ❤️"
        : "Tap when you're ready for the next little surprise. ❤️"
    );
  }

  function nextGift() {
    if (currentScene !== 1 || isTransitioning) return;

    if (currentGift < gifts.length - 1) {
      displayGift(currentGift + 1);
      return;
    }

    moveToScene(2);
  }

  if (nextGiftButton) {
    nextGiftButton.addEventListener("click", nextGift);
  }

  /* ---------- INITIAL SETUP ---------- */

  createBokeh();
  createGoldenDust();
  createRosePetals();
  displayGift(0);
  setProgress(0);

  console.log("Part 10 JS Part 1 loaded successfully ❤️");

  /* Part 2 will add:
     - Handmade letter interactions
     - Emotional scenes 4–6
     - Saved gifts scene
     - Final gift message
     - Vintage letter transition to Part 11
  */
/* ==========================================
   PART 10 — JAVASCRIPT PART 2/2
   Handmade gifts + emotional scenes
   Saved gifts + final message + Part 11
========================================== */

/* ---------- SCENE 3: HANDMADE GIFTS ---------- */

const spreadLettersButton = $("#spreadLettersButton");
const unfoldVintageButton = $("#unfoldVintageButton");
const pullLetterButton = $("#pullLetterButton");
const nextHandmadeButton = $("#nextHandmadeButton");

function revealPreview(selector, heading, message) {
  const preview = $(selector);
  if (!preview) return;

  preview.replaceChildren();

  const title = document.createElement("h3");
  title.textContent = heading;

  const text = document.createElement("p");
  text.textContent = message;

  preview.append(title, text);
  preview.hidden = false;

  preview.scrollIntoView({
    behavior: "smooth",
    block: "nearest"
  });
}

if (spreadLettersButton) {
  spreadLettersButton.addEventListener("click", () => {
    revealPreview(
      "#lettersFan",
      "Open When Letters 💌",
      "Little letters for different days and feelings.\n\n" +
      "For the days you miss me, feel low, need a smile, " +
      "or simply want a reminder of how special you are to me. ❤️"
    );

    spreadLettersButton.textContent = "Letters opened ✓";
  });
}

if (unfoldVintageButton) {
  unfoldVintageButton.addEventListener("click", () => {
    revealPreview(
      "#vintagePreview",
      "A Letter From My Heart 🕯️",
      "Some feelings deserve more than a text message.\n\n" +
      "So I put a little piece of my heart on paper, " +
      "just for you. ❤️"
    );

    unfoldVintageButton.textContent = "Letter unfolded ✓";
  });
}

if (pullLetterButton) {
  pullLetterButton.addEventListener("click", () => {
    revealPreview(
      "#pullLetterPreview",
      "A Long Letter, Just for You 💗",
      "A little memory, a little smile, a little story…\n\n" +
      "And so many words that I wanted you to keep, " +
      "even after the paper is folded away."
    );

    pullLetterButton.textContent = "Letter revealed ✓";
  });
}

if (nextHandmadeButton) {
  nextHandmadeButton.addEventListener("click", () => {
    if (currentScene === 2 && !isTransitioning) {
      moveToScene(3);
    }
  });
}


/* ---------- SCENE 4: WHY THESE GIFTS ARE DIFFERENT ---------- */

const nextDifferentButton = $("#nextDifferentButton");

if (nextDifferentButton) {
  nextDifferentButton.addEventListener("click", () => {
    if (currentScene === 3 && !isTransitioning) {
      moveToScene(4);
    }
  });
}


/* ---------- SCENE 5: THE REAL PART ---------- */

const nextRealPartButton = $("#nextRealPartButton");

if (nextRealPartButton) {
  nextRealPartButton.addEventListener("click", () => {
    if (currentScene === 4 && !isTransitioning) {
      moveToScene(5);
    }
  });
}


/* ---------- SCENE 6: WHEN WE MEET ---------- */

const nextMeetButton = $("#nextMeetButton");

if (nextMeetButton) {
  nextMeetButton.addEventListener("click", () => {
    if (currentScene === 5 && !isTransitioning) {
      prepareSavedGifts();
      moveToScene(6);
    }
  });
}


/* ---------- SCENE 7: PUTTING EVERYTHING AWAY ---------- */

const savedGiftDisplay = $("#savedGiftDisplay");
const savedItems = $("#savedItems");
const savingMessage = $("#savingMessage");
const closeGiftBoxButton = $("#closeGiftBoxButton");

function prepareSavedGifts() {
  if (savedGiftDisplay) {
    savedGiftDisplay.replaceChildren();

    const emoji = document.createElement("div");
    emoji.className = "saved-gift-emoji";
    emoji.textContent = "🎁";

    savedGiftDisplay.appendChild(emoji);
  }

  if (savedItems) {
    savedItems.replaceChildren();

    const savedGiftNames = [
      "Lipgloss 💋",
      "Eyeliner 🖤",
      "Kajal ✨",
      "Nailpolish 💅",
      "Scrunchy 🎀",
      "Clutcher 🌸",
      "Earrings 💎",
      "Chudi ❤️",
      "Ring 💍",
      "Open When Letters 💌",
      "Vintage Love Letter 🕯️",
      "Long Pull Letter 💗"
    ];

    savedGiftNames.forEach((name) => {
      const item = document.createElement("span");
      item.className = "saved-item";
      item.textContent = name;
      savedItems.appendChild(item);
    });
  }

  if (savingMessage) {
    savingMessage.textContent =
      "Every little gift, every handwritten word… " +
      "all kept safe for the day I can give them to you. ❤️";
  }
}

function closeGiftBox() {
  if (currentScene !== 6 || isTransitioning) return;

  if (closeGiftBoxButton) {
    closeGiftBoxButton.disabled = true;
    closeGiftBoxButton.textContent = "Keeping everything safe… ❤️";
  }

  if (savedGiftDisplay) {
    savedGiftDisplay.classList.add("box-closing");
  }

  sceneDelay(() => {
    if (closeGiftBoxButton) {
      closeGiftBoxButton.disabled = false;
      closeGiftBoxButton.textContent = "Continue ✨";
    }

    if (currentScene === 6) {
      moveToScene(7);
    }
  }, 1000);
}

if (closeGiftBoxButton) {
  closeGiftBoxButton.addEventListener("click", closeGiftBox);
}


/* ---------- SCENE 8: FINAL GIFT MESSAGE ---------- */

const openNextLetterButton = $("#openNextLetterButton");

if (openNextLetterButton) {
  openNextLetterButton.addEventListener("click", () => {
    if (currentScene === 7 && !isTransitioning) {
      moveToScene(8);
    }
  });
}


/* ---------- SCENE 9: VINTAGE LETTER TRANSITION ---------- */

const transitionLetter = $("#transitionLetter");
const continueToPart11 = $("#continueToPart11");
const part11Status = $("#part11Status");

if (transitionLetter) {
  transitionLetter.setAttribute("tabindex", "0");
  transitionLetter.setAttribute("role", "img");
  transitionLetter.setAttribute(
    "aria-label",
    "A sealed vintage letter waiting to be opened"
  );
}

if (continueToPart11) {
  continueToPart11.addEventListener("click", () => {
    if (currentScene !== 8 || isTransitioning) return;

    window.location.href = "part11.html";
  });
}

/* ---------- OPTIONAL SOUND: NO MP3 REQUIRED ---------- */

let soundContext = null;
let soundEnabled = false;

function getSoundContext() {
  const AudioContextClass =
    window.AudioContext || window.webkitAudioContext;

  if (!AudioContextClass) return null;

  if (!soundContext) {
    soundContext = new AudioContextClass();
  }

  if (soundContext.state === "suspended") {
    soundContext.resume().catch(() => {});
  }

  return soundContext;
}

function playSoftChime() {
  if (!soundEnabled) return;

  const context = getSoundContext();
  if (!context) return;

  const now = context.currentTime;

  [523.25, 659.25, 783.99].forEach((frequency, index) => {
    const oscillator = context.createOscillator();
    const gain = context.createGain();

    oscillator.type = "sine";
    oscillator.frequency.value = frequency;

    const start = now + index * 0.09;

    gain.gain.setValueAtTime(0.0001, start);
    gain.gain.exponentialRampToValueAtTime(0.07, start + 0.025);
    gain.gain.exponentialRampToValueAtTime(0.0001, start + 0.45);

    oscillator.connect(gain);
    gain.connect(context.destination);

    oscillator.start(start);
    oscillator.stop(start + 0.5);
  });
}

/*
  Sound stays off until the visitor explicitly enables it.
  This avoids surprise audio and browser autoplay restrictions.
*/
const soundToggle = $("#soundToggle");

if (soundToggle) {
  soundToggle.addEventListener("click", () => {
    soundEnabled = !soundEnabled;

    if (soundEnabled) {
      getSoundContext();
      playSoftChime();
      soundToggle.textContent = "Sound: On 🔊";
      soundToggle.setAttribute("aria-pressed", "true");
    } else {
      soundToggle.textContent = "Sound: Off 🔇";
      soundToggle.setAttribute("aria-pressed", "false");
    }
  });
}


/* ---------- FINAL STARTUP ---------- */

setHint("#giftStatus", "Your first little surprise is waiting. ❤️");

console.log("Part 10 JavaScript fully connected ❤️");

/* Close the wrapper opened in JavaScript Part 1. */
})();