/* =========================================================
   ARADHYA'S WORLD ❤️
   PART 2 — BALLOON MEMORY GAME
   BALLOON.JS
   ========================================================= */


/* =========================================================
   1. ELEMENTS
   ========================================================= */

const introScreen = document.getElementById("introScreen");
const balloonGameScreen = document.getElementById("balloonGameScreen");
const noteScreen = document.getElementById("noteScreen");
const progressScreen = document.getElementById("progressScreen");
const goldenScreen = document.getElementById("goldenScreen");
const finalBurstScreen = document.getElementById("finalBurstScreen");

const startGameButton = document.getElementById("startGameButton");

const normalBalloonLayer =
    document.getElementById("normalBalloonLayer");

const specialBalloonLayer =
    document.getElementById("specialBalloonLayer");

const balloonEffectLayer =
    document.getElementById("balloonEffectLayer");

const collectedNumber =
    document.getElementById("collectedNumber");

const gameHint =
    document.getElementById("gameHint");

const noteBalloonIcon =
    document.getElementById("noteBalloonIcon");

const noteTitle =
    document.getElementById("noteTitle");

const noteMessage =
    document.getElementById("noteMessage");

const noteCounter =
    document.getElementById("noteCounter");

const continueGameButton =
    document.getElementById("continueGameButton");

const progressTitle =
    document.getElementById("progressTitle");

const progressCollected =
    document.getElementById("progressCollected");

const progressFill =
    document.getElementById("progressFill");

const progressMessage =
    document.getElementById("progressMessage");

const progressContinueButton =
    document.getElementById("progressContinueButton");

const goldenBalloon =
    document.getElementById("goldenBalloon");

const goldenInstruction =
    document.getElementById("goldenInstruction");

const screenFlash =
    document.getElementById("screenFlash");

const sparkleLayer =
    document.getElementById("sparkleLayer");

const floatingHeartLayer =
    document.getElementById("floatingHeartLayer");

const petalLayer =
    document.getElementById("petalLayer");

const touchSparkLayer =
    document.getElementById("touchSparkLayer");

const finalFirecrackerLayer =
    document.getElementById("finalFirecrackerLayer");

const finalParticleLayer =
    document.getElementById("finalParticleLayer");

const part3Button =
    document.getElementById("part3Button");


/* =========================================================
   2. GAME DATA
   ========================================================= */

let specialCollected = 0;
let gameStarted = false;
let gamePaused = false;
let goldenReady = false;
let finalFinished = false;

let normalBalloonTimer = null;
let specialBalloonTimer = null;


/*
    Nine individual memories.

    Text can later be edited from here without changing
    the game structure.
*/

const memories = [

    {
        title: "A Little Reminder 💗",
        message:
            "You make every ordinary day feel a little more beautiful just by being you.",
        effect: "hearts"
    },

    {
        title: "For That Smile ✨",
        message:
            "Some smiles are easy to remember. Yours somehow stays with me.",
        effect: "petals"
    },

    {
        title: "Something About You 🌸",
        message:
            "You have this beautiful way of making even the smallest moments feel special.",
        effect: "flowers"
    },

    {
        title: "A Tiny Secret ⭐",
        message:
            "If happiness had a favourite person, I think it would know exactly where to find you.",
        effect: "sparkles"
    },

    {
        title: "You Know What? 💫",
        message:
            "You make life feel a little softer, warmer and much more meaningful.",
        effect: "stars"
    },

    {
        title: "Just Because 🎉",
        message:
            "You deserve all the little reasons to smile today... and every day after this.",
        effect: "confetti"
    },

    {
        title: "One More Thing 💕",
        message:
            "Even from far away, somehow you still manage to make the world feel closer.",
        effect: "mixed"
    },

    {
        title: "Almost There ✨",
        message:
            "Out of all the little memories in this world, I am happiest that some belong to us.",
        effect: "dream"
    },

    {
        title: "The Ninth One ❤️",
        message:
            "And somehow, after all these memories, there is still so much more waiting to be written.",
        effect: "grand"
    }

];


/* =========================================================
   3. BALLOON COLORS
   ========================================================= */

const balloonColors = [

    ["#ffd0dd", "#e994b4"],
    ["#ffc5b8", "#ee947e"],
    ["#d9c8f2", "#ad91d0"],
    ["#bcdff0", "#7fb8d8"],
    ["#f6d5b5", "#e7aa76"],
    ["#efc8dc", "#d99ab9"]
];


/* =========================================================
   4. SCREEN CONTROLLER
   ========================================================= */

function showScreen(screen) {

    const screens = [
        introScreen,
        balloonGameScreen,
        noteScreen,
        progressScreen,
        goldenScreen,
        finalBurstScreen
    ];

    screens.forEach(item => {
        item.classList.remove("active");
    });

    screen.classList.add("active");
}


/* =========================================================
   5. INTRO
   ========================================================= */

startGameButton.addEventListener("click", () => {

    if (gameStarted) return;

    gameStarted = true;

    showScreen(balloonGameScreen);

    gameHint.textContent =
        "Find the glowing heart balloons ✨";

    createBackgroundEffects();

    startNormalBalloons();

    /*
        Special balloons begin appearing shortly after
        the game begins so the player can understand
        the normal balloon flow first.
    */

    setTimeout(() => {
        if (!finalFinished) {
            startSpecialBalloons();
        }
    }, 1200);

});


/* =========================================================
   6. NORMAL BALLOONS
   ========================================================= */

function startNormalBalloons() {

    if (normalBalloonTimer) {
        clearInterval(normalBalloonTimer);
    }

    /*
        Continuous stream of normal balloons.
    */

    normalBalloonTimer = setInterval(() => {

        if (!gamePaused && !goldenReady && !finalFinished) {
            createNormalBalloon();
        }

    }, 280);

}


/* =========================================================
   7. CREATE NORMAL BALLOON
   ========================================================= */

function createNormalBalloon() {

    const balloon =
        document.createElement("div");

    balloon.className = "normal-balloon";

    const string =
        document.createElement("div");

    string.className = "normal-balloon-string";

    balloon.appendChild(string);

    const color =
        balloonColors[
            Math.floor(
                Math.random() * balloonColors.length
            )
        ];

    const size =
        45 + Math.random() * 25;

    const x =
        5 + Math.random() * 90;

    const drift =
        10 + Math.random() * 30;

    const duration =
        4.8 + Math.random() * 2.6;

    const rotation =
        -7 + Math.random() * 14;

    balloon.style.left = `${x}%`;

    balloon.style.setProperty(
        "--balloon-size",
        `${size}px`
    );

    balloon.style.setProperty(
        "--balloon-light",
        color[0]
    );

    balloon.style.setProperty(
        "--balloon-dark",
        color[1]
    );

    balloon.style.setProperty(
        "--drift",
        `${drift}px`
    );

    balloon.style.setProperty(
        "--rotation",
        `${rotation}deg`
    );

    balloon.style.setProperty(
        "--rise-duration",
        `${duration}s`
    );

    normalBalloonLayer.appendChild(balloon);

    balloon.addEventListener(
        "pointerdown",
        () => popNormalBalloon(balloon),
        { once: true }
    );

    setTimeout(() => {

        if (balloon.isConnected) {
            balloon.remove();
        }

    }, (duration + 1) * 1000);

}


/* =========================================================
   8. POP NORMAL BALLOON
   ========================================================= */

function popNormalBalloon(balloon) {

    if (gamePaused || finalFinished) return;

    playBalloonPopSound(false);

    createSmallPopEffect(
        balloon,
        "normal"
    );

    balloon.remove();
}


/* =========================================================
   9. SPECIAL BALLOONS
   ========================================================= */

function startSpecialBalloons() {

    if (specialBalloonTimer) {
        clearInterval(specialBalloonTimer);
    }

    /*
        Special balloon appears regularly but not too often.
        Only one active special balloon is allowed at a time.
    */

    specialBalloonTimer = setInterval(() => {

        if (
            !gamePaused &&
            !goldenReady &&
            specialCollected < 9 &&
            document.querySelector(
                ".special-balloon"
            ) === null
        ) {
            createSpecialBalloon();
        }

    }, 1800);

}


/* =========================================================
   10. CREATE SPECIAL HEART BALLOON
   ========================================================= */

function createSpecialBalloon() {

    if (specialCollected >= 9) return;

    const balloon =
        document.createElement("div");

    balloon.className =
        "special-balloon";

    balloon.dataset.memory =
        specialCollected;

    const shape =
        document.createElement("div");

    shape.className =
        "special-balloon-shape";

    const knot =
        document.createElement("div");

    knot.className =
        "special-balloon-knot";

    const string =
        document.createElement("div");

    string.className =
        "special-balloon-string";

    balloon.appendChild(shape);
    balloon.appendChild(knot);
    balloon.appendChild(string);

    const x =
        8 + Math.random() * 84;

    const duration =
        6.5 + Math.random() * 1.8;

    balloon.style.left =
        `${x}%`;

    balloon.style.setProperty(
        "--special-duration",
        `${duration}s`
    );

    specialBalloonLayer.appendChild(balloon);

    balloon.addEventListener(
        "pointerdown",
        () => collectSpecialBalloon(balloon),
        { once: true }
    );

    /*
        If it reaches the top without being clicked,
        remove it and allow the next loop to bring it back.
    */

    setTimeout(() => {

        if (
            balloon.isConnected &&
            !balloon.classList.contains("popping")
        ) {
            balloon.remove();
        }

    }, (duration + 0.5) * 1000);

}


/* =========================================================
   11. COLLECT SPECIAL BALLOON
   ========================================================= */

function collectSpecialBalloon(balloon) {

    if (
        gamePaused ||
        goldenReady ||
        finalFinished
    ) {
        return;
    }

    gamePaused = true;

    const memoryIndex =
        Number(balloon.dataset.memory);

    const memory =
        memories[memoryIndex];

    balloon.classList.add("popping");

    playBalloonPopSound(true);

    createSpecialEffect(
        memory.effect,
        balloon
    );

    flashScreen();

    setTimeout(() => {

        if (balloon.isConnected) {
            balloon.remove();
        }

        showMemoryNote(
            memory,
            memoryIndex
        );

    }, 330);

}


/* =========================================================
   12. SHOW MEMORY NOTE
   ========================================================= */

function showMemoryNote(memory, index) {

    noteTitle.textContent =
        memory.title;

    noteMessage.textContent =
        memory.message;

    noteCounter.textContent =
        `Special Balloon #${index + 1}`;

    noteBalloonIcon.textContent =
        "♥";

    showScreen(noteScreen);

}


/* =========================================================
   13. CONTINUE FROM NOTE
   ========================================================= */

continueGameButton.addEventListener(
    "click",
    () => {

        showProgressCard();

    }
);


/* =========================================================
   14. PROGRESS CARD
   ========================================================= */

function showProgressCard() {

    specialCollected++;

    collectedNumber.textContent =
        specialCollected;

    progressCollected.textContent =
        specialCollected;

    progressFill.style.width =
        `${(specialCollected / 9) * 100}%`;

    if (specialCollected < 9) {

        progressTitle.textContent =
            `${specialCollected} Special Balloon${
                specialCollected === 1 ? "" : "s"
            } Collected`;

        const remaining =
            9 - specialCollected;

        progressMessage.textContent =
            `${remaining} more little ${
                remaining === 1
                    ? "memory is"
                    : "memories are"
            } waiting for you. 💗`;

        showScreen(progressScreen);

    } else {

        progressTitle.textContent =
            "All 9 Special Balloons Collected ❤️";

        progressMessage.textContent =
            "You found every little memory. One final balloon is waiting... ✨";

        showScreen(progressScreen);

    }

}


/* =========================================================
   15. PROGRESS CONTINUE
   ========================================================= */

progressContinueButton.addEventListener(
    "click",
    () => {

        if (specialCollected >= 9) {

            beginGoldenBalloon();

        } else {

            gamePaused = false;

            showScreen(balloonGameScreen);

        }

    }
);


/* =========================================================
   16. GOLDEN BALLOON
   ========================================================= */

function beginGoldenBalloon() {

    goldenReady = true;

    gamePaused = true;

    /*
        Stop creating new balloons.
    */

    if (normalBalloonTimer) {
        clearInterval(normalBalloonTimer);
    }

    if (specialBalloonTimer) {
        clearInterval(specialBalloonTimer);
    }

    /*
        Existing normal balloons get a graceful
        disappearing burst.
    */

    clearRemainingBalloons();

    showScreen(goldenScreen);

    goldenBalloon.classList.remove(
        "reached-center"
    );

    goldenInstruction.classList.remove(
        "show"
    );

    /*
        Give the screen a moment to breathe.
    */

    setTimeout(() => {

        goldenBalloon.classList.add(
            "reached-center"
        );

    }, 500);

    /*
        Instruction appears once the balloon
        reaches its final position.
    */

    setTimeout(() => {

        goldenInstruction.classList.add(
            "show"
        );

    }, 1900);

}


/* =========================================================
   17. CLEAR REMAINING BALLOONS
   ========================================================= */

function clearRemainingBalloons() {

    const allBalloons =
        document.querySelectorAll(
            ".normal-balloon, .special-balloon"
        );

    allBalloons.forEach(
        (balloon, index) => {

            setTimeout(() => {

                createSmallPopEffect(
                    balloon,
                    "cleanup"
                );

                balloon.remove();

            }, index * 35);

        }
    );

}


/* =========================================================
   18. GOLDEN BALLOON CLICK
   ========================================================= */

goldenBalloon.addEventListener(
    "pointerdown",
    () => {

        if (
            !goldenReady ||
            finalFinished
        ) {
            return;
        }

        finalFinished = true;

        goldenInstruction.classList.remove(
            "show"
        );

        goldenBalloon.classList.add(
            "golden-pop"
        );

        playBalloonPopSound(true);

        createGoldenFirecracker();

        flashScreen();

        setTimeout(() => {

            showFinalScreen();

        }, 700);

    }
);


/* =========================================================
   19. FINAL SCREEN
   ========================================================= */

function showFinalScreen() {

    showScreen(finalBurstScreen);

    setTimeout(() => {

        finalBurstScreen.classList.add(
            "show-content"
        );

        createFinalParticles();

    }, 300);

}


/* =========================================================
   20. FINAL FIRECRACKER
   ========================================================= */

function createGoldenFirecracker() {

    finalFirecrackerLayer.innerHTML = "";

    const rayCount = 34;

    for (let i = 0; i < rayCount; i++) {

        const ray =
            document.createElement("div");

        ray.className =
            "firecracker-ray";

        ray.style.setProperty(
            "--angle",
            `${(360 / rayCount) * i}deg`
        );

        ray.style.height =
            `${65 + Math.random() * 100}px`;

        ray.style.animationDelay =
            `${Math.random() * 0.08}s`;

        finalFirecrackerLayer.appendChild(ray);

    }

}


/* =========================================================
   21. FINAL PARTICLES
   ========================================================= */

function createFinalParticles() {

    finalParticleLayer.innerHTML = "";

    for (let i = 0; i < 75; i++) {

        const particle =
            document.createElement("div");

        particle.className =
            "final-particle";

        const angle =
            Math.random() * Math.PI * 2;

        const distance =
            90 + Math.random() * 330;

        const dx =
            Math.cos(angle) * distance;

        const dy =
            Math.sin(angle) * distance;

        particle.style.setProperty(
            "--dx",
            `${dx}px`
        );

        particle.style.setProperty(
            "--dy",
            `${dy}px`
        );

        particle.style.setProperty(
            "--particle-size",
            `${3 + Math.random() * 6}px`
        );

        particle.style.setProperty(
            "--burst-duration",
            `${1.1 + Math.random() * 1.1}s`
        );

        particle.style.animationDelay =
            `${Math.random() * 0.2}s`;

        finalParticleLayer.appendChild(
            particle
        );

    }

}


/* =========================================================
   22. SPECIAL EFFECT CONTROLLER
   ========================================================= */

function createSpecialEffect(
    effectType,
    balloon
) {

    const rect =
        balloon.getBoundingClientRect();

    const centerX =
        rect.left + rect.width / 2;

    const centerY =
        rect.top + rect.height / 2;

    if (effectType === "hearts") {
        createHeartBurst(
            centerX,
            centerY
        );
    }

    else if (effectType === "petals") {
        createPetalBurst(
            centerX,
            centerY
        );
    }

    else if (effectType === "flowers") {
        createFlowerBurst(
            centerX,
            centerY
        );
    }

    else if (effectType === "sparkles") {
        createSparkleBurst(
            centerX,
            centerY
        );
    }

    else if (effectType === "stars") {
        createStarBurst(
            centerX,
            centerY
        );
    }

    else if (effectType === "confetti") {
        createConfettiBurst(
            centerX,
            centerY
        );
    }

    else if (effectType === "mixed") {
        createHeartBurst(centerX, centerY);
        createSparkleBurst(centerX, centerY);
    }

    else if (effectType === "dream") {
        createSparkleBurst(centerX, centerY);
        createPetalBurst(centerX, centerY);
    }

    else if (effectType === "grand") {
        createHeartBurst(centerX, centerY);
        createStarBurst(centerX, centerY);
        createSparkleBurst(centerX, centerY);
    }

}


/* =========================================================
   23. GENERIC EFFECT PARTICLE
   ========================================================= */

function createEffectParticle(
    x,
    y,
    symbol,
    className,
    distance = 100
) {

    const particle =
        document.createElement("div");

    particle.className =
        className;

    particle.textContent =
        symbol;

    particle.style.position =
        "fixed";

    particle.style.left =
        `${x}px`;

    particle.style.top =
        `${y}px`;

    particle.style.zIndex =
        "800";

    particle.style.pointerEvents =
        "none";

    const angle =
        Math.random() * Math.PI * 2;

    const spread =
        distance * (
            0.55 +
            Math.random() * 0.75
        );

    const dx =
        Math.cos(angle) * spread;

    const dy =
        Math.sin(angle) * spread;

    particle.style.setProperty(
        "--effect-x",
        `${dx}px`
    );

    particle.style.setProperty(
        "--effect-y",
        `${dy}px`
    );

    particle.style.setProperty(
        "--effect-rotate",
        `${-120 + Math.random() * 240}deg`
    );

    balloonEffectLayer.appendChild(
        particle
    );

    particle.animate(
        [
            {
                opacity: 1,
                transform:
                    "translate(-50%, -50%) scale(0.5)"
            },
            {
                opacity: 1,
                transform:
                    "translate(-50%, -50%) scale(1)"
            },
            {
                opacity: 0,
                transform:
                    `translate(
                        calc(-50% + ${dx}px),
                        calc(-50% + ${dy}px)
                    )
                    rotate(${particle.style.getPropertyValue("--effect-rotate")})
                    scale(0.25)`
            }
        ],
        {
            duration:
                800 + Math.random() * 600,

            easing:
                "cubic-bezier(.15,.75,.25,1)",

            fill:
                "forwards"
        }
    );

    setTimeout(() => {

        particle.remove();

    }, 1600);

}


/* =========================================================
   24. HEART BURST
   ========================================================= */

function createHeartBurst(x, y) {

    const symbols = [
        "♥",
        "♡",
        "💕",
        "💗"
    ];

    for (let i = 0; i < 18; i++) {

        createEffectParticle(
            x,
            y,
            symbols[
                Math.floor(
                    Math.random() *
                    symbols.length
                )
            ],
            "effect-heart",
            130
        );

    }

}


/* =========================================================
   25. PETAL BURST
   ========================================================= */

function createPetalBurst(x, y) {

    for (let i = 0; i < 20; i++) {

        createEffectParticle(
            x,
            y,
            "🌸",
            "effect-petal",
            140
        );

    }

}


/* =========================================================
   26. FLOWER BURST
   ========================================================= */

function createFlowerBurst(x, y) {

    const flowers = [
        "🌷",
        "🌸",
        "🌺",
        "🌼"
    ];

    for (let i = 0; i < 16; i++) {

        createEffectParticle(
            x,
            y,
            flowers[
                Math.floor(
                    Math.random() *
                    flowers.length
                )
            ],
            "effect-flower",
            125
        );

    }

}


/* =========================================================
   27. SPARKLE BURST
   ========================================================= */

function createSparkleBurst(x, y) {

    for (let i = 0; i < 24; i++) {

        createEffectParticle(
            x,
            y,
            "✦",
            "effect-sparkle",
            150
        );

    }

}


/* =========================================================
   28. STAR BURST
   ========================================================= */

function createStarBurst(x, y) {

    for (let i = 0; i < 18; i++) {

        createEffectParticle(
            x,
            y,
            "★",
            "effect-star",
            145
        );

    }

}


/* =========================================================
   29. CONFETTI BURST
   ========================================================= */

function createConfettiBurst(x, y) {

    const confettiSymbols = [
        "◆",
        "●",
        "■",
        "✦"
    ];

    for (let i = 0; i < 28; i++) {

        createEffectParticle(
            x,
            y,
            confettiSymbols[
                Math.floor(
                    Math.random() *
                    confettiSymbols.length
                )
            ],
            "effect-confetti",
            170
        );

    }

}


/* =========================================================
   30. SMALL POP EFFECT
   ========================================================= */

function createSmallPopEffect(
    balloon,
    type
) {

    const rect =
        balloon.getBoundingClientRect();

    const x =
        rect.left + rect.width / 2;

    const y =
        rect.top + rect.height / 2;

    const symbols =
        type === "cleanup"
            ? ["✦", "·", "♡"]
            : ["·", "✦", "♡"];

    for (let i = 0; i < 7; i++) {

        createEffectParticle(
            x,
            y,
            symbols[
                Math.floor(
                    Math.random() *
                    symbols.length
                )
            ],
            "effect-sparkle",
            55
        );

    }

}


/* =========================================================
   31. SCREEN FLASH
   ========================================================= */

function flashScreen() {

    screenFlash.classList.remove(
        "flash"
    );

    void screenFlash.offsetWidth;

    screenFlash.classList.add(
        "flash"
    );

}


/* =========================================================
   32. BACKGROUND SPARKLES
   ========================================================= */

function createBackgroundEffects() {

    /*
        Sparkles
    */

    for (let i = 0; i < 30; i++) {

        const sparkle =
            document.createElement("div");

        sparkle.className =
            "sky-sparkle";

        sparkle.style.left =
            `${Math.random() * 100}%`;

        sparkle.style.top =
            `${Math.random() * 100}%`;

        sparkle.style.animationDuration =
            `${1.5 + Math.random() * 3}s`;

        sparkle.style.animationDelay =
            `${Math.random() * 3}s`;

        sparkleLayer.appendChild(
            sparkle
        );

    }

    /*
        Floating hearts
    */

    setInterval(() => {

        if (
            gamePaused ||
            finalFinished
        ) {
            return;
        }

        createFloatingHeart();

    }, 2500);

    /*
        Occasional petals
    */

    setInterval(() => {

        if (
            gamePaused ||
            finalFinished
        ) {
            return;
        }

        createFallingPetal();

    }, 3300);

}


/* =========================================================
   33. FLOATING HEART
   ========================================================= */

function createFloatingHeart() {

    const heart =
        document.createElement("div");

    heart.className =
        "sky-heart";

    heart.textContent =
        Math.random() > 0.5
            ? "♥"
            : "♡";

    heart.style.left =
        `${Math.random() * 100}%`;

    heart.style.bottom =
        "-25px";

    heart.style.fontSize =
        `${10 + Math.random() * 10}px`;

    heart.style.animationDuration =
        `${7 + Math.random() * 5}s`;

    floatingHeartLayer.appendChild(
        heart
    );

    setTimeout(() => {
        heart.remove();
    }, 13000);

}


/* =========================================================
   34. FALLING PETAL
   ========================================================= */

function createFallingPetal() {

    const petal =
        document.createElement("div");

    petal.className =
        "sky-petal";

    petal.style.left =
        `${Math.random() * 100}%`;

    petal.style.top =
        "-20px";

    petal.style.animationDuration =
        `${6 + Math.random() * 5}s`;

    petalLayer.appendChild(
        petal
    );

    setTimeout(() => {
        petal.remove();
    }, 12000);

}


/* =========================================================
   35. TOUCH SPARK
   ========================================================= */

document.addEventListener(
    "pointerdown",
    event => {

        if (
            event.target.closest(
                "button"
            )
        ) {
            return;
        }

        createTouchSparks(
            event.clientX,
            event.clientY
        );

    }
);


function createTouchSparks(x, y) {

    for (let i = 0; i < 5; i++) {

        const spark =
            document.createElement("div");

        spark.className =
            "touch-spark";

        spark.style.left =
            `${x}px`;

        spark.style.top =
            `${y}px`;

        const angle =
            Math.random() *
            Math.PI * 2;

        const distance =
            10 + Math.random() * 24;

        spark.style.setProperty(
            "--spark-x",
            `${Math.cos(angle) * distance}px`
        );

        spark.style.setProperty(
            "--spark-y",
            `${Math.sin(angle) * distance}px`
        );

        touchSparkLayer.appendChild(
            spark
        );

        setTimeout(() => {
            spark.remove();
        }, 700);

    }

}



/* =========================================================
   36. BALLOON POP SOUND
   ========================================================= */

let audioContext = null;

function getAudioContext() {

    if (!audioContext) {

        const AudioContext =
            window.AudioContext ||
            window.webkitAudioContext;

        if (!AudioContext) {
            return null;
        }

        audioContext =
            new AudioContext();

    }

    if (
        audioContext.state ===
        "suspended"
    ) {
        audioContext.resume();
    }

    return audioContext;

}


function playBalloonPopSound(special) {

    const ctx =
        getAudioContext();

    if (!ctx) return;

    const now =
        ctx.currentTime;

    /*
        Short noise burst.
        This creates a soft balloon-pop style sound
        without requiring an MP3 file.
    */

    const buffer =
        ctx.createBuffer(
            1,
            ctx.sampleRate * 0.16,
            ctx.sampleRate
        );

    const data =
        buffer.getChannelData(0);

    for (
        let i = 0;
        i < data.length;
        i++
    ) {

        const fade =
            1 - i / data.length;

        data[i] =
            (
                Math.random() * 2 - 1
            ) *
            fade *
            fade;

    }

    const source =
        ctx.createBufferSource();

    source.buffer =
        buffer;

    const filter =
        ctx.createBiquadFilter();

    filter.type =
        "lowpass";

    filter.frequency.value =
        special
            ? 2100
            : 1700;

    const gain =
        ctx.createGain();

    gain.gain.setValueAtTime(
        0.0001,
        now
    );

    gain.gain.exponentialRampToValueAtTime(
        special ? 0.34 : 0.22,
        now + 0.008
    );

    gain.gain.exponentialRampToValueAtTime(
        0.0001,
        now + 0.15
    );

    source.connect(filter);
    filter.connect(gain);
    gain.connect(ctx.destination);

    source.start(now);
    source.stop(now + 0.17);

    /*
        Special balloon gets a tiny soft sparkle tone.
    */

    if (special) {

        const oscillator =
            ctx.createOscillator();

        const sparkleGain =
            ctx.createGain();

        oscillator.type =
            "sine";

        oscillator.frequency.setValueAtTime(
            880,
            now
        );

        oscillator.frequency.exponentialRampToValueAtTime(
            1320,
            now + 0.18
        );

        sparkleGain.gain.setValueAtTime(
            0.0001,
            now
        );

        sparkleGain.gain.exponentialRampToValueAtTime(
            0.08,
            now + 0.02
        );

        sparkleGain.gain.exponentialRampToValueAtTime(
            0.0001,
            now + 0.25
        );

        oscillator.connect(
            sparkleGain
        );

        sparkleGain.connect(
            ctx.destination
        );

        oscillator.start(now);
        oscillator.stop(now + 0.27);

    }

}


/* =========================================================
   37. FINAL BUTTON
   ========================================================= */

part3Button.addEventListener("click", () => {
    window.location.replace("memories.html");
});


/* =========================================================
   38. CLEANUP
   ========================================================= */

window.addEventListener(
    "pagehide",
    () => {

        if (normalBalloonTimer) {
            clearInterval(normalBalloonTimer);
        }

        if (specialBalloonTimer) {
            clearInterval(specialBalloonTimer);
        }

        if (audioContext) {

            try {
                audioContext.close();
            } catch (error) {}

        }

    }
);


/* =========================================================
   39. INITIAL STATE
   ========================================================= */

showScreen(introScreen);
