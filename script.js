/* =========================================================
   ARADHYA'S WORLD — PART 1
   FINAL SCRIPT
========================================================= */


/* =========================================================
   ELEMENTS
========================================================= */

const screens = {
    password: document.getElementById("passwordScreen"),
    congratulations: document.getElementById("congratulationsScreen"),
    welcome: document.getElementById("welcomeScreen"),
    scanner: document.getElementById("scannerScreen"),
    analysis: document.getElementById("analysisScreen"),
    detected: document.getElementById("detectedScreen"),
    heart: document.getElementById("heartScreen")
};

const passwordInput = document.getElementById("passwordInput");
const unlockButton = document.getElementById("unlockButton");
const passwordHint = document.getElementById("passwordHint");
const passwordCard = document.querySelector(".password-card");

const scanProgress = document.getElementById("scanProgress");
const scanPercentage = document.getElementById("scanPercentage");
const scanText = document.getElementById("scanText");
const scannerMessage = document.getElementById("scannerMessage");

const analysisText = document.getElementById("analysisText");
const analysisSubtext = document.getElementById("analysisSubtext");
const temperatureValue = document.getElementById("temperatureValue");

const interactiveHeart = document.getElementById("interactiveHeart");

const heartBurstLayer = document.getElementById("heartBurstLayer");

const continueContainer =
    document.getElementById("continueContainer");

const continueButton =
    document.getElementById("continueButton");

const transitionOverlay =
    document.getElementById("transitionOverlay");

const petalLayer =
    document.getElementById("petalLayer");

const heartLayer =
    document.getElementById("heartLayer");

const particleLayer =
    document.getElementById("particleLayer");


/* =========================================================
   SETTINGS
========================================================= */

const CORRECT_PASSWORD = "061010";

let wrongAttempts = 0;
let heartActivated = false;
let musicStarted = false;
let transitionStarted = false;


/* =========================================================
   SCREEN CONTROL
========================================================= */

function showScreen(screen) {

    Object.values(screens).forEach(function (item) {

        if (!item) return;

        item.classList.remove("active");
    });

    if (screen) {
        screen.classList.add("active");
    }
}


/* =========================================================
   INITIAL SCREEN
========================================================= */

showScreen(screens.password);


/* =========================================================
   BACKGROUND DECORATIONS
========================================================= */

function createPetals() {

    if (!petalLayer) return;

    const total = 15;

    for (let i = 0; i < total; i++) {

        const petal = document.createElement("span");

        petal.className = "petal";

        petal.style.left =
            Math.random() * 100 + "%";

        petal.style.animationDuration =
            (7 + Math.random() * 8) + "s";

        petal.style.animationDelay =
            (Math.random() * 8) + "s";

        petal.style.opacity =
            0.25 + Math.random() * 0.45;

        petalLayer.appendChild(petal);
    }
}


function createFloatingHearts() {

    if (!heartLayer) return;

    const symbols = [
        "♡",
        "♥",
        "♡",
        "💗",
        "♡"
    ];

    const total = 12;

    for (let i = 0; i < total; i++) {

        const heart = document.createElement("span");

        heart.className = "floating-heart";

        heart.textContent =
            symbols[Math.floor(Math.random() * symbols.length)];

        heart.style.left =
            Math.random() * 100 + "%";

        heart.style.animationDuration =
            (8 + Math.random() * 9) + "s";

        heart.style.animationDelay =
            (Math.random() * 10) + "s";

        heart.style.fontSize =
            (12 + Math.random() * 12) + "px";

        heartLayer.appendChild(heart);
    }
}


function createParticles() {

    if (!particleLayer) return;

    const total = 35;

    for (let i = 0; i < total; i++) {

        const particle =
            document.createElement("span");

        particle.className =
            "background-particle";

        particle.style.left =
            Math.random() * 100 + "%";

        particle.style.animationDuration =
            (7 + Math.random() * 10) + "s";

        particle.style.animationDelay =
            (Math.random() * 10) + "s";

        particle.style.transform =
            "scale(" +
            (0.5 + Math.random()) +
            ")";

        particleLayer.appendChild(particle);
    }
}


createPetals();
createFloatingHearts();
createParticles();


/* =========================================================
   MOBILE TOUCH SPARK
========================================================= */

document.addEventListener(
    "pointerdown",
    function (event) {

        if (!event.isPrimary) return;

        createTouchSpark(
            event.clientX,
            event.clientY
        );
    },
    {
        passive: true
    }
);


function createTouchSpark(x, y) {

    const layer =
        document.getElementById("touchEffectLayer");

    if (!layer) return;

    const spark =
        document.createElement("span");

    spark.style.position = "fixed";
    spark.style.left = x + "px";
    spark.style.top = y + "px";
    spark.style.width = "8px";
    spark.style.height = "8px";
    spark.style.borderRadius = "50%";
    spark.style.background = "rgba(255,255,255,0.95)";
    spark.style.boxShadow =
        "0 0 15px rgba(255,130,180,0.9)";
    spark.style.pointerEvents = "none";
    spark.style.zIndex = "500";

    layer.appendChild(spark);

    spark.animate(
        [
            {
                transform: "translate(-50%, -50%) scale(1)",
                opacity: 1
            },
            {
                transform: "translate(-50%, -50%) scale(0)",
                opacity: 0
            }
        ],
        {
            duration: 500,
            easing: "ease-out"
        }
    );

    setTimeout(function () {
        spark.remove();
    }, 520);
}


/* =========================================================
   PASSWORD HINTS
========================================================= */

const hints = [
    "It's a very special date ❤️",
    "The answer is hidden in your birthday ✨",
    "DDMMYY FORMAT 💗"
];


function handleWrongPassword() {

    wrongAttempts++;

    passwordCard.classList.remove("shake");
    passwordCard.classList.remove("error");

    void passwordCard.offsetWidth;

    passwordCard.classList.add("shake");
    passwordCard.classList.add("error");

    const index =
        Math.min(wrongAttempts - 1, hints.length - 1);

    passwordHint.textContent =
        hints[index];

    passwordInput.value = "";

    setTimeout(function () {

        passwordCard.classList.remove("shake");

    }, 600);
}


/* =========================================================
   PASSWORD CHECK
========================================================= */

function unlockWorld() {

    const entered =
        passwordInput.value.trim();

    if (entered !== CORRECT_PASSWORD) {

        handleWrongPassword();

        return;
    }

    passwordInput.blur();

    passwordHint.textContent = "";

    unlockButton.disabled = true;
    passwordInput.disabled = true;

    startBackgroundMusic();

    startCongratulationsSequence();
}


/* =========================================================
   PASSWORD EVENTS
========================================================= */

unlockButton.addEventListener(
    "click",
    unlockWorld
);


passwordInput.addEventListener(
    "keydown",
    function (event) {

        if (event.key === "Enter") {

            event.preventDefault();

            unlockWorld();
        }
    }
);


/* =========================================================
   CONGRATULATIONS
========================================================= */

function startCongratulationsSequence() {

    showScreen(
        screens.congratulations
    );

    setTimeout(function () {

        startWelcomeSequence();

    }, 2000);
}


/* =========================================================
   WELCOME
========================================================= */

function startWelcomeSequence() {

    showScreen(
        screens.welcome
    );

    setTimeout(function () {

        startScanner();

    }, 1800);
}


/* =========================================================
   SCANNER
========================================================= */

function startScanner() {

    /*
        IMPORTANT:
        Scanner screen is activated BEFORE
        any scanner animation starts.
    */

    showScreen(
        screens.scanner
    );

    scanProgress.style.width = "0%";
    scanPercentage.textContent = "0%";

    scanText.textContent =
        "Scanning...";

    scannerMessage.textContent =
        "Initialising scanner...";

    /*
        Total scan time:
        approximately 8 seconds.
    */

    const duration = 12000;

    const startTime =
        performance.now();

    function updateScanner(currentTime) {

        const elapsed =
            currentTime - startTime;

        let progress =
            (elapsed / duration) * 100;

        if (progress > 100) {
            progress = 100;
        }

        scanProgress.style.width =
            progress + "%";

        scanPercentage.textContent =
            Math.floor(progress) + "%";

        if (progress < 20) {

            scannerMessage.textContent =
                "Connecting to beauty database...";

        } else if (progress < 40) {

            scannerMessage.textContent =
                "Scanning visual signature...";

        } else if (progress < 60) {

            scannerMessage.textContent =
                "Checking cuteness levels...";

        } else if (progress < 80) {

            scannerMessage.textContent =
                "Detecting extraordinary charm...";

        } else if (progress < 100) {

            scannerMessage.textContent =
                "Almost there... something unusual detected ❤️";

        } else {

            scannerMessage.textContent =
                "Scan complete ❤️";
        }

        if (progress < 100) {

            requestAnimationFrame(
                updateScanner
            );

        } else {

            setTimeout(
                startAnalysis,
                700
            );
        }
    }

    requestAnimationFrame(
        updateScanner
    );
}


/* =========================================================
   TEMPERATURE / ANALYSIS
========================================================= */

function startAnalysis() {

    showScreen(
        screens.analysis
    );

    temperatureValue.textContent =
        "--°C";

    analysisText.textContent =
        "Analysing temperature...";

    analysisSubtext.textContent =
        "Please wait...";

    const temperatureSteps = [
        {
            time: 0,
            value: "36.8°C",
            text: "Analysing temperature...",
            sub: "Checking normal range..."
        },
        {
            time: 1000,
            value: "38.2°C",
            text: "Unusual warmth detected...",
            sub: "System is recalibrating..."
        },
        {
            time: 2200,
            value: "40.1°C",
            text: "Why is scanner getting so warm?",
            sub: "This is definitely unusual..."
        },
        {
            time: 3400,
            value: "42.7°C",
            text: "Processing...",
            sub: "Trying to understand the result..."
        }
    ];

    temperatureSteps.forEach(
        function (step) {

            setTimeout(function () {

                temperatureValue.textContent =
                    step.value;

                analysisText.textContent =
                    step.text;

                analysisSubtext.textContent =
                    step.sub;

            }, step.time);
        }
    );

    /*
        Analysis lasts roughly 5 seconds.
    */

    setTimeout(
        showDetectedScreen,
        5000
    );
}


/* =========================================================
   ARADHYA DETECTED
========================================================= */

function showDetectedScreen() {

    showScreen(
        screens.detected
    );

    /*
        The status card is already present in HTML.
        CSS handles its cinematic reveal.

        After the card remains visible for several
        seconds, the glowing heart appears automatically.
    */

    setTimeout(
        showHeartScreen,
        7000
    );
}


/* =========================================================
   HEART SCREEN
========================================================= */

function showHeartScreen() {

    showScreen(
        screens.heart
    );

    heartActivated = false;

    continueContainer.classList.remove(
        "visible"
    );
}


/* =========================================================
   HEART TAP
========================================================= */

function activateHeart() {

    if (heartActivated) {
        return;
    }

    heartActivated = true;

    createHeartBurst();

    /*
        Let the burst play first.
    */

    setTimeout(function () {

        continueContainer.classList.add(
            "visible"
        );

    }, 900);
}


interactiveHeart.addEventListener(
    "click",
    activateHeart
);


interactiveHeart.addEventListener(
    "keydown",
    function (event) {

        if (
            event.key === "Enter" ||
            event.key === " "
        ) {

            event.preventDefault();

            activateHeart();
        }
    }
);


/* =========================================================
   HEART BURST
========================================================= */

function createHeartBurst() {

    heartBurstLayer.innerHTML = "";

    heartBurstLayer.classList.add(
        "active"
    );

    const heartSymbols = [
        "❤️",
        "💗",
        "💕",
        "💖",
        "♡"
    ];

    /*
        Heart burst
    */

    for (let i = 0; i < 18; i++) {

        const heart =
            document.createElement("span");

        heart.className =
            "burst-heart";

        heart.textContent =
            heartSymbols[
                Math.floor(
                    Math.random() *
                    heartSymbols.length
                )
            ];

        const angle =
            (Math.PI * 2 * i) / 18;

        const distance =
            90 + Math.random() * 130;

        const x =
            Math.cos(angle) * distance;

        const y =
            Math.sin(angle) * distance;

        heart.style.left = "50%";
        heart.style.top = "50%";

        heart.style.setProperty(
            "--x",
            x + "px"
        );

        heart.style.setProperty(
            "--y",
            y + "px"
        );

        heart.style.setProperty(
            "--rotation",
            (-45 + Math.random() * 90) + "deg"
        );

        heart.style.animationDelay =
            (Math.random() * 0.15) + "s";

        heartBurstLayer.appendChild(
            heart
        );
    }


    /*
        Spark particles
    */

    for (let i = 0; i < 32; i++) {

        const spark =
            document.createElement("span");

        spark.className =
            "burst-spark";

        const angle =
            Math.random() * Math.PI * 2;

        const distance =
            70 + Math.random() * 170;

        const x =
            Math.cos(angle) * distance;

        const y =
            Math.sin(angle) * distance;

        spark.style.left = "50%";
        spark.style.top = "50%";

        spark.style.setProperty(
            "--x",
            x + "px"
        );

        spark.style.setProperty(
            "--y",
            y + "px"
        );

        spark.style.animationDelay =
            (Math.random() * 0.2) + "s";

        heartBurstLayer.appendChild(
            spark
        );
    }


    /*
        Remove burst layer after animation.
    */

    setTimeout(function () {

        heartBurstLayer.classList.remove(
            "active"
        );

    }, 1500);
}


/* =========================================================
   CONTINUE TO PART 2
========================================================= */

continueButton.addEventListener(
    "click",
    function () {

        if (transitionStarted) {
            return;
        }

        transitionStarted = true;

        continueContainer.classList.remove(
            "visible"
        );

        transitionOverlay.classList.add(
            "active"
        );

        /*
            Smooth transition before Part 2.
        */

        setTimeout(function () {

            window.location.href =
                "balloon.html";

        }, 1800);
    }
);


/* =========================================================
   CODE-GENERATED BACKGROUND MUSIC
   NO MP3 REQUIRED
========================================================= */

let audioContext = null;
let masterGain = null;
let musicTimer = null;
let musicStep = 0;


function startBackgroundMusic() {

    if (musicStarted) {
        return;
    }

    musicStarted = true;

    try {

        const AudioContext =
            window.AudioContext ||
            window.webkitAudioContext;

        if (!AudioContext) {
            return;
        }

        audioContext =
            new AudioContext();

        masterGain =
            audioContext.createGain();

        masterGain.gain.value = 0.035;

        masterGain.connect(
            audioContext.destination
        );

        if (
            audioContext.state ===
            "suspended"
        ) {

            audioContext.resume();
        }

        playMusicStep();

        musicTimer =
            setInterval(
                playMusicStep,
                2400
            );

    } catch (error) {

        /*
            If a device does not support
            Web Audio, the visual experience
            still works normally.
        */

        console.log(
            "Background music unavailable on this device."
        );
    }
}


/* =========================================================
   MUSIC NOTES
========================================================= */

function noteFrequency(note) {

    const frequencies = {

        C3: 130.81,
        D3: 146.83,
        E3: 164.81,
        F3: 174.61,
        G3: 196.00,
        A3: 220.00,
        B3: 246.94,

        C4: 261.63,
        D4: 293.66,
        E4: 329.63,
        F4: 349.23,
        G4: 392.00,
        A4: 440.00,
        B4: 493.88,

        C5: 523.25,
        E5: 659.25,
        G5: 783.99,
        A5: 880.00
    };

    return frequencies[note] || 261.63;
}


/* =========================================================
   PLAY SOFT NOTE
========================================================= */

function playSoftNote(
    frequency,
    startTime,
    duration,
    volume,
    type
) {

    if (!audioContext || !masterGain) {
        return;
    }

    const oscillator =
        audioContext.createOscillator();

    const gain =
        audioContext.createGain();

    oscillator.type =
        type || "sine";

    oscillator.frequency.value =
        frequency;

    gain.gain.setValueAtTime(
        0.0001,
        startTime
    );

    gain.gain.exponentialRampToValueAtTime(
        volume,
        startTime + 0.08
    );

    gain.gain.exponentialRampToValueAtTime(
        0.0001,
        startTime + duration
    );

    oscillator.connect(gain);
    gain.connect(masterGain);

    oscillator.start(startTime);

    oscillator.stop(
        startTime + duration + 0.05
    );
}


/* =========================================================
   MUSIC PATTERN
========================================================= */

function playMusicStep() {

    if (!audioContext) {
        return;
    }

    const now =
        audioContext.currentTime;

    const progression = [

        {
            bass: "C3",
            notes: ["C4", "E4", "G4"]
        },

        {
            bass: "A3",
            notes: ["A3", "C4", "E4"]
        },

        {
            bass: "F3",
            notes: ["F3", "A3", "C4"]
        },

        {
            bass: "G3",
            notes: ["G3", "B3", "D4"]
        }
    ];

    const chord =
        progression[
            musicStep %
            progression.length
        ];

    /*
        Soft bass
    */

    playSoftNote(
        noteFrequency(chord.bass),
        now,
        2.1,
        0.20,
        "sine"
    );


    /*
        Chord tones
    */

    chord.notes.forEach(
        function (note, index) {

            playSoftNote(
                noteFrequency(note),
                now + (index * 0.08),
                1.9,
                0.055,
                "triangle"
            );
        }
    );


    /*
        Small melody
    */

    const melody = [
        "E5",
        "G5",
        "A5",
        "G5"
    ];

    const melodyNote =
        melody[
            musicStep %
            melody.length
        ];

    playSoftNote(
        noteFrequency(melodyNote),
        now + 0.35,
        0.75,
        0.028,
        "sine"
    );


    musicStep++;
}


/* =========================================================
   STOP MUSIC WHEN PAGE LEAVES
========================================================= */

window.addEventListener(
    "pagehide",
    function () {

        if (musicTimer) {

            clearInterval(
                musicTimer
            );

            musicTimer = null;
        }

        if (audioContext) {

            try {
                audioContext.close();
            } catch (error) {
                // Nothing required.
            }
        }
    }
);