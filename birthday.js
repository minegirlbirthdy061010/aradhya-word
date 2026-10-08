"use strict";

/* =========================================================
   ARADHYA'S WORLD — PART 4
   BIRTHDAY CELEBRATION
   JAVASCRIPT
   PART 1 / 5
========================================================= */


/* =========================================================
   GLOBAL STATE
========================================================= */

const state = {
    currentPhase: "openingPhase",

    audioStarted: false,
    audioContext: null,

    candleBlown: false,
    cakeCut: false,

    fireworksStarted: false,
    fireworksFinished: false,

    notesStarted: false,
    noteIndex: 0,

    transitionBusy: false
};


/* =========================================================
   ELEMENT HELPERS
========================================================= */

const $ = (selector) =>
    document.querySelector(selector);

const $$ = (selector) =>
    Array.from(document.querySelectorAll(selector));


/* =========================================================
   PHASES
========================================================= */

const phases = {
    opening: $("#openingPhase"),
    candle: $("#candlePhase"),
    cake: $("#cakePhase"),
    fireworks: $("#fireworksPhase"),
    notes: $("#notesPhase")
};

/* =========================================================
   OPENING HEART → CANDLE
========================================================= */

const openingHeart = $("#openingHeart");

openingHeart.addEventListener("click", () => {

    openingHeart.classList.add("heart-activated");

    setTimeout(() => {

        phases.opening.classList.remove("active");
        phases.opening.classList.add("exit");

        phases.candle.classList.add("active");

        setTimeout(() => {
            phases.opening.classList.remove("exit");
        }, 1500);

    }, 500);
});
/* =========================================================
   BASIC PHASE SWITCHER
========================================================= */

function switchPhase(nextPhase, callback) {

    if (!nextPhase || state.transitionBusy) {
        return;
    }

    const current = phases[state.currentPhase];

    if (current === nextPhase) {
        if (callback) callback();
        return;
    }

    state.transitionBusy = true;

    if (current) {
        current.classList.remove("active");
        current.classList.add("exit");
    }

    setTimeout(() => {

        Object.values(phases).forEach((phase) => {

            if (!phase) return;

            if (phase !== nextPhase) {
                phase.classList.remove("active");
            }

            phase.classList.remove("exit");

        });

        nextPhase.classList.add("active");

        state.currentPhase = nextPhase.id;

        setTimeout(() => {
            state.transitionBusy = false;

            if (callback) {
                callback();
            }

        }, 180);

    }, 850);
}


/* =========================================================
   OPENING INITIALIZATION
========================================================= */

function initializeOpening() {

    if (!phases.opening) return;

    phases.opening.classList.add("active");

    state.currentPhase = "openingPhase";

    createGlobalParticles();
    createGlobalHearts();
    createGlobalSparkles();

    showAudioHint();
}


/* =========================================================
   GLOBAL PARTICLES
========================================================= */

function createGlobalParticles() {

    const container = $("#floatingParticles");

    if (!container) return;

    container.innerHTML = "";

    const count =
        window.innerWidth < 500
            ? 24
            : 38;

    for (let i = 0; i < count; i++) {

        const particle =
            document.createElement("span");

        particle.className =
            "global-particle";

        particle.style.left =
            `${Math.random() * 100}%`;

        particle.style.animationDuration =
            `${7 + Math.random() * 10}s`;

        particle.style.animationDelay =
            `${-Math.random() * 12}s`;

        particle.style.opacity =
            `${0.25 + Math.random() * 0.55}`;

        const size =
            2 + Math.random() * 4;

        particle.style.width =
            `${size}px`;

        particle.style.height =
            `${size}px`;

        container.appendChild(particle);
    }
}


/* =========================================================
   GLOBAL HEARTS
========================================================= */

function createGlobalHearts() {

    const container = $("#floatingHearts");

    if (!container) return;

    container.innerHTML = "";

    const count =
        window.innerWidth < 500
            ? 8
            : 13;

    for (let i = 0; i < count; i++) {

        const heart =
            document.createElement("span");

        heart.className =
            "global-heart";

        heart.textContent = "♥";

        heart.style.left =
            `${Math.random() * 100}%`;

        heart.style.fontSize =
            `${9 + Math.random() * 12}px`;

        heart.style.animationDuration =
            `${10 + Math.random() * 12}s`;

        heart.style.animationDelay =
            `${-Math.random() * 15}s`;

        container.appendChild(heart);
    }
}


/* =========================================================
   GLOBAL SPARKLES
========================================================= */

function createGlobalSparkles() {

    const container = $("#sparkleField");

    if (!container) return;

    container.innerHTML = "";

    const count =
        window.innerWidth < 500
            ? 12
            : 22;

    for (let i = 0; i < count; i++) {

        const sparkle =
            document.createElement("span");

        sparkle.className =
            "global-sparkle";

        sparkle.style.left =
            `${Math.random() * 100}%`;

        sparkle.style.top =
            `${Math.random() * 100}%`;

        sparkle.style.animationDuration =
            `${1.5 + Math.random() * 3}s`;

        sparkle.style.animationDelay =
            `${-Math.random() * 4}s`;

        container.appendChild(sparkle);
    }
}


/* =========================================================
   AUDIO ENGINE
========================================================= */

let masterGain = null;
let musicGain = null;

let musicTimer = null;
let musicStep = 0;


/* =========================================================
   AUDIO START
========================================================= */

function startAudio() {

    if (state.audioStarted) {
        return;
    }

    try {

        const AudioContext =
            window.AudioContext ||
            window.webkitAudioContext;

        if (!AudioContext) {
            return;
        }

        state.audioContext =
            new AudioContext();

        const ctx =
            state.audioContext;


        masterGain =
            ctx.createGain();

        musicGain =
            ctx.createGain();


        masterGain.gain.value = 0.8;

        musicGain.gain.value = 0;


        musicGain.connect(masterGain);
        masterGain.connect(ctx.destination);


        musicGain.gain.setTargetAtTime(
            0.12,
            ctx.currentTime,
            1.8
        );


        state.audioStarted = true;

        startAmbientMusic();

        hideAudioHint();

    } catch (error) {

        console.warn(
            "Audio could not start:",
            error
        );

    }
}


/* =========================================================
   RESUME AUDIO
========================================================= */

function resumeAudio() {

    if (
        state.audioContext &&
        state.audioContext.state === "suspended"
    ) {
        state.audioContext.resume();
    }
}


/* =========================================================
   MASTER SOUND
========================================================= */

function playTone(
    frequency,
    duration = 0.4,
    type = "sine",
    volume = 0.05,
    delay = 0
) {

    if (!state.audioContext || !musicGain) {
        return;
    }

    const ctx =
        state.audioContext;

    const now =
        ctx.currentTime + delay;

    const oscillator =
        ctx.createOscillator();

    const gain =
        ctx.createGain();

    oscillator.type = type;

    oscillator.frequency.setValueAtTime(
        frequency,
        now
    );

    gain.gain.setValueAtTime(
        0.0001,
        now
    );

    gain.gain.exponentialRampToValueAtTime(
        Math.max(volume, 0.001),
        now + 0.025
    );

    gain.gain.exponentialRampToValueAtTime(
        0.0001,
        now + duration
    );

    oscillator.connect(gain);
    gain.connect(musicGain);

    oscillator.start(now);
    oscillator.stop(now + duration + 0.05);
}


/* =========================================================
   SOFT CHIME
========================================================= */

function playChime(volume = 0.045) {

    playTone(
        659.25,
        1.3,
        "sine",
        volume
    );

    playTone(
        783.99,
        1.6,
        "sine",
        volume * 0.7,
        0.12
    );

    playTone(
        987.77,
        1.9,
        "sine",
        volume * 0.45,
        0.24
    );
}


/* =========================================================
   AMBIENT MUSIC
========================================================= */

function startAmbientMusic() {

    if (!state.audioContext) {
        return;
    }

    if (musicTimer) {
        clearInterval(musicTimer);
    }

    musicStep = 0;

    const melody = [
        261.63,
        329.63,
        392.00,
        329.63,
        293.66,
        349.23,
        440.00,
        349.23,
        261.63,
        329.63,
        392.00,
        493.88,
        440.00,
        392.00,
        329.63,
        293.66
    ];

    const bass = [
        130.81,
        130.81,
        146.83,
        146.83,
        164.81,
        164.81,
        146.83,
        146.83
    ];

    musicTimer =
        setInterval(() => {

            if (!state.audioContext) {
                return;
            }

            const note =
                melody[
                    musicStep %
                    melody.length
                ];

            const bassNote =
                bass[
                    Math.floor(musicStep / 2) %
                    bass.length
                ];

            playTone(
                note,
                1.9,
                "sine",
                0.025
            );

            playTone(
                note * 2,
                1.1,
                "triangle",
                0.008,
                0.08
            );

            playTone(
                bassNote,
                2.2,
                "sine",
                0.014
            );

            if (musicStep % 4 === 0) {
                playTone(
                    note * 3,
                    2.4,
                    "sine",
                    0.004,
                    0.18
                );
            }

            musicStep++;

        }, 950);
}


/* =========================================================
   AUDIO HINT
========================================================= */

function showAudioHint() {

    const hint =
        $("#audioUnlockHint");

    if (!hint) return;

    setTimeout(() => {
        hint.classList.add("show");
    }, 1200);

    setTimeout(() => {
        hint.classList.remove("show");
    }, 5500);
}

function hideAudioHint() {

    const hint =
        $("#audioUnlockHint");

    if (!hint) return;

    hint.classList.remove("show");
}


/* =========================================================
   GLOBAL FIRST INTERACTION
========================================================= */

function unlockAudioFromInteraction() {

    startAudio();
    resumeAudio();

    document.removeEventListener(
        "pointerdown",
        unlockAudioFromInteraction
    );

    document.removeEventListener(
        "touchstart",
        unlockAudioFromInteraction
    );
}

document.addEventListener(
    "pointerdown",
    unlockAudioFromInteraction,
    {
        passive: true
    }
);

document.addEventListener(
    "touchstart",
    unlockAudioFromInteraction,
    {
        passive: true
    }
);


/* =========================================================
   INITIAL LOAD
========================================================= */

window.addEventListener(
    "load",
    initializeOpening
);
/* =========================================================
   CANDLE SYSTEM
   PART 2 / 5
========================================================= */


/* =========================================================
   CANDLE ELEMENTS
========================================================= */

const candleTap =
    $("#candleTap");

const candleStage =
    $("#candleStage");

const candleFlameWrap =
    $(".candle-flame-wrap");

const micStatus =
    $("#micStatus");


/* =========================================================
   OPEN CANDLE SCENE
========================================================= */

function openCandleScene() {

    if (state.candleBlown) {
        return;
    }

    switchPhase(
        phases.candle,
        () => {

            prepareCandleScene();

        }
    );
}


/* =========================================================
   CANDLE PREPARATION
========================================================= */

function prepareCandleScene() {

    if (micStatus) {

        micStatus.textContent =
            "🎙️ Listening for your wish...";

    }

    if (candleFlameWrap) {

        candleFlameWrap.style.opacity =
            "1";

    }

    startMicrophoneDetection();
}


/* =========================================================
   CANDLE TAP
========================================================= */

if (candleTap) {

    candleTap.addEventListener(
        "pointerdown",
        (event) => {

            event.preventDefault();

            startAudio();
            resumeAudio();

            blowOutCandle();

        },
        {
            passive: false
        }
    );
}


/* =========================================================
   CANDLE KEYBOARD FALLBACK
========================================================= */

document.addEventListener(
    "keydown",
    (event) => {

        if (
            state.currentPhase ===
            "candlePhase" &&
            (
                event.key === " " ||
                event.key === "Enter"
            )
        ) {

            blowOutCandle();

        }

    }
);


/* =========================================================
   MICROPHONE DETECTION
========================================================= */

let microphoneStream = null;
let microphoneContext = null;
let analyser = null;
let microphoneSource = null;

let micListening = false;
let micLastTrigger = 0;


async function startMicrophoneDetection() {

    if (state.candleBlown) {
        return;
    }

    if (!navigator.mediaDevices) {

        if (micStatus) {
            micStatus.textContent =
                "✨ Tap the candle to make your wish";
        }

        return;
    }

    if (!navigator.mediaDevices.getUserMedia) {

        if (micStatus) {
            micStatus.textContent =
                "✨ Tap the candle to make your wish";
        }

        return;
    }

    try {

        microphoneStream =
            await navigator.mediaDevices.getUserMedia({
                audio: true
            });

        const AudioContext =
            window.AudioContext ||
            window.webkitAudioContext;

        if (!AudioContext) {
            return;
        }

        microphoneContext =
            new AudioContext();

        analyser =
            microphoneContext.createAnalyser();

        analyser.fftSize = 512;

        analyser.smoothingTimeConstant =
            0.72;

        microphoneSource =
            microphoneContext.createMediaStreamSource(
                microphoneStream
            );

        microphoneSource.connect(
            analyser
        );

        micListening = true;

        monitorMicrophone();

    } catch (error) {

        console.log(
            "Microphone unavailable"
        );

        if (micStatus) {
            micStatus.textContent =
                "✨ Tap the candle to make your wish";
        }

    }
}


/* =========================================================
   MONITOR MICROPHONE
========================================================= */

function monitorMicrophone() {

    if (!micListening || state.candleBlown) {
        return;
    }

    const buffer =
        new Uint8Array(
            analyser.frequencyBinCount
        );

    analyser.getByteTimeDomainData(buffer);

    let total = 0;

    for (let i = 0; i < buffer.length; i++) {

        const value =
            (buffer[i] - 128) / 128;

        total += value * value;
    }

    const rms =
        Math.sqrt(
            total / buffer.length
        );

    const now =
        performance.now();

    /*
       Normal room noise is ignored.
       A clear blow creates a stronger
       burst of microphone energy.
    */

    if (
        rms > 0.13 &&
        now - micLastTrigger > 1300
    ) {

        micLastTrigger = now;

        blowOutCandle();

        return;
    }

    requestAnimationFrame(
        monitorMicrophone
    );
}


/* =========================================================
   STOP MICROPHONE
========================================================= */

function stopMicrophone() {

    micListening = false;

    if (microphoneStream) {

        microphoneStream
            .getTracks()
            .forEach(
                track => track.stop()
            );

        microphoneStream = null;
    }

    if (microphoneContext) {

        microphoneContext.close()
            .catch(() => {});

        microphoneContext = null;
    }

    analyser = null;
    microphoneSource = null;
}


/* =========================================================
   CANDLE BLOW
========================================================= */

function blowOutCandle() {

    if (state.candleBlown) {
        return;
    }

    state.candleBlown = true;

    stopMicrophone();

    playCandleBlowSound();

    extinguishFlame();

    createCandleEmbers();

    setTimeout(() => {

        openCakeScene();

    }, 1900);
}


/* =========================================================
   EXTINGUISH FLAME
========================================================= */

function extinguishFlame() {

    if (!candleFlameWrap) {
        return;
    }

    candleFlameWrap.style.transition =
        "opacity .55s ease, transform .65s ease";

    candleFlameWrap.style.transform =
        "translateX(-50%) scale(.15)";

    candleFlameWrap.style.opacity =
        "0";


    if (candleStage) {

        candleStage.classList.add(
            "candle-extinguished"
        );

    }
}


/* =========================================================
   CANDLE BLOW SOUND
========================================================= */

function playCandleBlowSound() {

    if (!state.audioContext || !musicGain) {
        return;
    }

    const ctx =
        state.audioContext;

    const bufferSize =
        ctx.sampleRate * 0.45;

    const buffer =
        ctx.createBuffer(
            1,
            bufferSize,
            ctx.sampleRate
        );

    const data =
        buffer.getChannelData(0);

    for (let i = 0; i < bufferSize; i++) {

        data[i] =
            (Math.random() * 2 - 1) *
            Math.pow(
                1 - i / bufferSize,
                2.2
            );
    }

    const source =
        ctx.createBufferSource();

    const gain =
        ctx.createGain();

    const filter =
        ctx.createBiquadFilter();

    source.buffer = buffer;

    filter.type = "lowpass";
    filter.frequency.value = 2200;

    gain.gain.value = 0.09;

    source.connect(filter);
    filter.connect(gain);
    gain.connect(musicGain);

    source.start();
}


/* =========================================================
   CANDLE EMBERS
========================================================= */

function createCandleEmbers() {

    if (!candleStage) return;

    for (let i = 0; i < 18; i++) {

        const ember =
            document.createElement("span");

        ember.style.position =
            "absolute";

        ember.style.left =
            `${50 + (Math.random() * 20 - 10)}%`;

        ember.style.top =
            "38%";

        ember.style.width =
            `${2 + Math.random() * 4}px`;

        ember.style.height =
            ember.style.width;

        ember.style.borderRadius =
            "50%";

        ember.style.background =
            "rgba(255,190,110,.95)";

        ember.style.boxShadow =
            "0 0 10px rgba(255,160,80,.8)";

        ember.style.pointerEvents =
            "none";

        ember.style.zIndex = "25";

        const dx =
            (Math.random() * 100 - 50);

        const dy =
            -(25 + Math.random() * 100);

        ember.animate(
            [
                {
                    transform:
                        "translate(0,0) scale(1)",
                    opacity: 1
                },
                {
                    transform:
                        `translate(${dx}px,${dy}px) scale(.1)`,
                    opacity: 0
                }
            ],
            {
                duration:
                    700 + Math.random() * 700,
                easing:
                    "cubic-bezier(.2,.7,.3,1)",
                fill:
                    "forwards"
            }
        );

        candleStage.appendChild(
            ember
        );

        setTimeout(() => {
            ember.remove();
        }, 1500);
    }
}


/* =========================================================
   CAKE OPENING
========================================================= */

function openCakeScene() {

    switchPhase(
        phases.cake,
        () => {

            prepareCakeScene();

        }
    );
}


/* =========================================================
   CAKE PREPARATION
========================================================= */

function prepareCakeScene() {

    state.cakeCut = false;

    const knife =
        $("#cakeKnife");

    if (knife) {

        knife.style.transform =
            "rotate(-13deg)";

    }

    const cake =
        $(".birthday-cake");

    if (cake) {

        cake.style.animation =
            "cakeEnter 1.6s cubic-bezier(.22,.61,.36,1) both";

    }

    startCakeIdleEffects();
}


/* =========================================================
   CAKE IDLE
========================================================= */

let cakeIdleTimer = null;

function startCakeIdleEffects() {

    if (cakeIdleTimer) {
        clearInterval(cakeIdleTimer);
    }

    cakeIdleTimer =
        setInterval(() => {

            if (
                state.currentPhase !==
                "cakePhase" ||
                state.cakeCut
            ) {
                return;
            }

            createCakeSpark();

        }, 750);
}


/* =========================================================
   CAKE SPARK
========================================================= */

function createCakeSpark() {

    const stage =
        $("#cakeStage");

    if (!stage) return;

    const spark =
        document.createElement("span");

    spark.style.position =
        "absolute";

    spark.style.left =
        `${35 + Math.random() * 30}%`;

    spark.style.top =
        `${25 + Math.random() * 30}%`;

    spark.style.width = "4px";
    spark.style.height = "4px";

    spark.style.borderRadius =
        "50%";

    spark.style.background =
        "#fff";

    spark.style.boxShadow =
        "0 0 9px rgba(255,255,255,.9)";

    spark.style.pointerEvents =
        "none";

    spark.style.zIndex = "70";

    stage.appendChild(spark);

    spark.animate(
        [
            {
                transform:
                    "translateY(8px) scale(.3)",
                opacity: 0
            },
            {
                transform:
                    "translateY(0) scale(1)",
                opacity: 1
            },
            {
                transform:
                    "translateY(-18px) scale(.1)",
                opacity: 0
            }
        ],
        {
            duration: 1000,
            easing: "ease-out",
            fill: "forwards"
        }
    );

    setTimeout(() => {
        spark.remove();
    }, 1100);
}
/* =========================================================
   CAKE KNIFE / SWIPE SYSTEM
   PART 3 / 5
========================================================= */


const cakeKnife =
    $("#cakeKnife");

const cakeStageElement =
    $("#cakeStage");

let knifeDragging = false;
let knifeStartX = 0;
let knifeStartY = 0;
let knifeCurrentX = 0;
let knifeCurrentY = 0;


/* =========================================================
   KNIFE POINTER DOWN
========================================================= */

if (cakeKnife) {

    cakeKnife.addEventListener(
        "pointerdown",
        (event) => {

            if (
                state.currentPhase !==
                "cakePhase" ||
                state.cakeCut
            ) {
                return;
            }

            event.preventDefault();

            startAudio();
            resumeAudio();

            knifeDragging = true;

            knifeStartX =
                event.clientX;

            knifeStartY =
                event.clientY;

            knifeCurrentX =
                event.clientX;

            knifeCurrentY =
                event.clientY;

            cakeKnife.setPointerCapture(
                event.pointerId
            );

            cakeKnife.style.transition =
                "none";

            cakeKnife.style.transform =
                "rotate(-13deg) scale(1.05)";

        },
        {
            passive: false
        }
    );


    cakeKnife.addEventListener(
        "pointermove",
        (event) => {

            if (!knifeDragging) {
                return;
            }

            event.preventDefault();

            knifeCurrentX =
                event.clientX;

            knifeCurrentY =
                event.clientY;

            const dx =
                knifeCurrentX -
                knifeStartX;

            const dy =
                knifeCurrentY -
                knifeStartY;

            /*
               Knife follows the finger.
               Movement is deliberately smooth.
            */

            cakeKnife.style.transform =
                `translate(${dx}px,${dy}px) rotate(-13deg) scale(1.05)`;

        },
        {
            passive: false
        }
    );


    cakeKnife.addEventListener(
        "pointerup",
        (event) => {

            if (!knifeDragging) {
                return;
            }

            event.preventDefault();

            knifeDragging = false;

            const dx =
                knifeCurrentX -
                knifeStartX;

            const dy =
                knifeCurrentY -
                knifeStartY;

            const distance =
                Math.sqrt(
                    dx * dx +
                    dy * dy
                );

            cakeKnife.style.transition =
                "transform .65s cubic-bezier(.22,.61,.36,1)";

            cakeKnife.style.transform =
                "rotate(-13deg)";

            if (
                distance > 65 ||
                Math.abs(dx) > 45
            ) {

                cutTheCake();

            }

        },
        {
            passive: false
        }
    );


    cakeKnife.addEventListener(
        "pointercancel",
        () => {

            knifeDragging = false;

            cakeKnife.style.transition =
                "transform .5s ease";

            cakeKnife.style.transform =
                "rotate(-13deg)";

        }
    );
}


/* =========================================================
   CAKE TAP FALLBACK
========================================================= */

if (cakeStageElement) {

    cakeStageElement.addEventListener(
        "dblclick",
        () => {

            if (
                state.currentPhase ===
                "cakePhase" &&
                !state.cakeCut
            ) {

                cutTheCake();

            }

        }
    );
}


/* =========================================================
   CUT CAKE
========================================================= */

function cutTheCake() {

    if (state.cakeCut) {
        return;
    }

    state.cakeCut = true;

    if (cakeIdleTimer) {
        clearInterval(cakeIdleTimer);
    }

    playCakeCutSound();

    animateCakeCut();

    createCakeCutParticles();

    setTimeout(() => {

        playCakeCelebrationSound();

    }, 650);


    setTimeout(() => {

        openFireworksScene();

    }, 2300);
}


/* =========================================================
   CAKE CUT ANIMATION
========================================================= */

function animateCakeCut() {

    const cake =
        $(".birthday-cake");

    const glow =
        $("#cakeCutGlow");

    const cream =
        $("#creamStretch");

    if (glow) {

        glow.classList.remove("show");

        void glow.offsetWidth;

        glow.classList.add("show");

    }

    if (cream) {

        cream.classList.remove("show");

        void cream.offsetWidth;

        cream.classList.add("show");

    }

    if (cake) {

        cake.style.transition =
            "transform .9s cubic-bezier(.22,.61,.36,1)";

        cake.style.transform =
            "scaleX(.96)";

        setTimeout(() => {

            cake.style.transform =
                "scaleX(1)";

        }, 700);

    }
}


/* =========================================================
   CAKE CUT SOUND
========================================================= */

function playCakeCutSound() {

    if (!state.audioContext || !musicGain) {
        return;
    }

    const ctx =
        state.audioContext;

    const now =
        ctx.currentTime;


    const oscillator =
        ctx.createOscillator();

    const gain =
        ctx.createGain();

    oscillator.type =
        "sawtooth";

    oscillator.frequency.setValueAtTime(
        800,
        now
    );

    oscillator.frequency.exponentialRampToValueAtTime(
        130,
        now + 0.25
    );

    gain.gain.setValueAtTime(
        0.0001,
        now
    );

    gain.gain.exponentialRampToValueAtTime(
        0.07,
        now + 0.02
    );

    gain.gain.exponentialRampToValueAtTime(
        0.0001,
        now + 0.32
    );

    oscillator.connect(gain);
    gain.connect(musicGain);

    oscillator.start(now);
    oscillator.stop(now + 0.35);
}


/* =========================================================
   CAKE CELEBRATION SOUND
========================================================= */

function playCakeCelebrationSound() {

    playTone(
        523.25,
        1.2,
        "sine",
        0.045
    );

    playTone(
        659.25,
        1.2,
        "sine",
        0.04,
        0.1
    );

    playTone(
        783.99,
        1.4,
        "sine",
        0.035,
        0.2
    );

    playChime(.035);
}


/* =========================================================
   CAKE CUT PARTICLES
========================================================= */

function createCakeCutParticles() {

    const stage =
        $("#cakeStage");

    if (!stage) return;

    const symbols = [
        "✦",
        "✧",
        "♥",
        "✿",
        "•"
    ];

    for (let i = 0; i < 35; i++) {

        const particle =
            document.createElement("span");

        particle.textContent =
            symbols[
                Math.floor(
                    Math.random() *
                    symbols.length
                )
            ];

        particle.style.position =
            "absolute";

        particle.style.left =
            "50%";

        particle.style.top =
            "45%";

        particle.style.color =
            "rgba(255,235,245,.95)";

        particle.style.fontSize =
            `${8 + Math.random() * 13}px`;

        particle.style.zIndex =
            "100";

        particle.style.pointerEvents =
            "none";

        const dx =
            Math.random() * 260 - 130;

        const dy =
            -(20 + Math.random() * 190);

        const rotation =
            Math.random() * 360;

        stage.appendChild(
            particle
        );

        particle.animate(
            [
                {
                    transform:
                        "translate(-50%,-50%) scale(.2) rotate(0deg)",
                    opacity: 0
                },
                {
                    transform:
                        "translate(-50%,-50%) scale(1) rotate(80deg)",
                    opacity: 1,
                    offset: .18
                },
                {
                    transform:
                        `translate(calc(-50% + ${dx}px),calc(-50% + ${dy}px)) scale(.15) rotate(${rotation}deg)`,
                    opacity: 0
                }
            ],
            {
                duration:
                    900 + Math.random() * 900,
                easing:
                    "cubic-bezier(.15,.7,.25,1)",
                fill:
                    "forwards"
            }
        );

        setTimeout(() => {
            particle.remove();
        }, 1900);
    }
}


/* =========================================================
   FIREWORKS CANVAS
========================================================= */

const fireworksCanvas =
    $("#fireworksCanvas");

const fireworksContext =
    fireworksCanvas
        ? fireworksCanvas.getContext("2d")
        : null;


let canvasWidth = 0;
let canvasHeight = 0;
let canvasDpr = 1;

let fireworksAnimationFrame = null;

let fireworksRunning = false;

let fireworksStartTime = 0;

let fireworksLastSpawn = 0;

const fireworksRockets = [];
const fireworksBursts = [];
const fireworksParticles = [];


/* =========================================================
   FIREWORK COLORS
========================================================= */

const FIREWORK_PALETTES = [
    {
        core: "255,244,190",
        main: "255,190,90",
        secondary: "255,230,145"
    },
    {
        core: "255,245,250",
        main: "255,125,180",
        secondary: "255,205,230"
    },
    {
        core: "245,240,255",
        main: "190,150,255",
        secondary: "225,205,255"
    },
    {
        core: "255,255,225",
        main: "255,220,90",
        secondary: "255,245,180"
    },
    {
        core: "255,245,255",
        main: "245,145,205",
        secondary: "255,205,235"
    }
];


/* =========================================================
   RESIZE CANVAS
========================================================= */

function resizeFireworksCanvas() {

    if (!fireworksCanvas) {
        return;
    }

    canvasDpr =
        Math.min(
            window.devicePixelRatio || 1,
            2
        );

    canvasWidth =
        window.innerWidth;

    canvasHeight =
        window.innerHeight;

    fireworksCanvas.width =
        Math.floor(
            canvasWidth *
            canvasDpr
        );

    fireworksCanvas.height =
        Math.floor(
            canvasHeight *
            canvasDpr
        );

    fireworksCanvas.style.width =
        `${canvasWidth}px`;

    fireworksCanvas.style.height =
        `${canvasHeight}px`;

    if (fireworksContext) {

        fireworksContext.setTransform(
            canvasDpr,
            0,
            0,
            canvasDpr,
            0,
            0
        );
    }
}


window.addEventListener(
    "resize",
    resizeFireworksCanvas
);

resizeFireworksCanvas();


/* =========================================================
   FIREWORK ROCKET CLASS
========================================================= */

class FireworkRocket {

    constructor(
        x,
        targetY,
        palette
    ) {

        this.x = x;

        this.y =
            canvasHeight + 15;

        this.startX = x;

        this.targetY =
            targetY;

        this.palette =
            palette;

        this.speed =
            7.5 + Math.random() * 2.2;

        this.acceleration =
            -0.035;

        this.trail = [];

        this.dead = false;

        this.width =
            1.2 + Math.random() * .9;
    }


    update() {

        this.trail.push({
            x: this.x,
            y: this.y
        });

        if (this.trail.length > 11) {
            this.trail.shift();
        }

        this.speed +=
            this.acceleration;

        this.y -=
            this.speed;

        /*
           Small horizontal drift creates
           natural rocket movement without
           teleporting.
        */

        this.x +=
            Math.sin(this.y * .025) * .12;

        if (
            this.y <=
            this.targetY
        ) {

            this.explode();

            this.dead = true;
        }
    }


    draw() {

        if (!fireworksContext) {
            return;
        }

        const ctx =
            fireworksContext;

        ctx.save();

        /*
           Rocket trail
        */

        if (this.trail.length > 1) {

            ctx.beginPath();

            ctx.moveTo(
                this.trail[0].x,
                this.trail[0].y
            );

            for (
                let i = 1;
                i < this.trail.length;
                i++
            ) {

                ctx.lineTo(
                    this.trail[i].x,
                    this.trail[i].y
                );
            }

            ctx.strokeStyle =
                `rgba(${this.palette.secondary},.42)`;

            ctx.lineWidth =
                this.width;

            ctx.stroke();
        }


        /*
           Rocket head
        */

        ctx.beginPath();

        ctx.arc(
            this.x,
            this.y,
            2.1,
            0,
            Math.PI * 2
        );

        ctx.fillStyle =
            `rgb(${this.palette.core})`;

        ctx.shadowBlur = 10;

        ctx.shadowColor =
            `rgb(${this.palette.main})`;

        ctx.fill();

        ctx.restore();
    }


    explode() {

        createBurst(
            this.x,
            this.y,
            this.palette
        );

        playFireworkExplosion(
            this.y
        );
    }

}

/* =========================================================
   FIREWORK ENGINE
   PART 4 / 5
========================================================= */


/* =========================================================
   BURST
========================================================= */

class FireworkBurst {

    constructor(
        x,
        y,
        palette
    ) {

        this.x = x;
        this.y = y;

        this.palette =
            palette;

        this.age = 0;

        this.maxAge =
            45 + Math.random() * 25;

        this.rotation =
            Math.random() *
            Math.PI * 2;

        this.type =
            Math.floor(
                Math.random() * 7
            );

        this.radius =
            5;

        this.dead = false;
    }


    update() {

        this.age++;

        this.radius +=
            2.1;

        if (
            this.age >
            this.maxAge
        ) {

            this.dead = true;
        }
    }


    draw() {

        if (!fireworksContext) {
            return;
        }

        const ctx =
            fireworksContext;

        const alpha =
            Math.max(
                0,
                1 -
                this.age /
                this.maxAge
            );

        ctx.save();

        ctx.translate(
            this.x,
            this.y
        );

        ctx.rotate(
            this.rotation
        );

        ctx.globalAlpha =
            alpha * .55;

        ctx.strokeStyle =
            `rgba(${this.palette.main},1)`;

        ctx.lineWidth = 1.2;

        ctx.beginPath();

        if (this.type === 0) {

            ctx.arc(
                0,
                0,
                this.radius,
                0,
                Math.PI * 2
            );

        } else if (this.type === 1) {

            for (
                let i = 0;
                i < 5;
                i++
            ) {

                const a =
                    i *
                    Math.PI *
                    2 /
                    5;

                const r =
                    this.radius;

                const x =
                    Math.cos(a) * r;

                const y =
                    Math.sin(a) * r;

                if (i === 0) {
                    ctx.moveTo(x,y);
                } else {
                    ctx.lineTo(x,y);
                }
            }

            ctx.closePath();

        } else if (this.type === 2) {

            for (
                let i = 0;
                i < 16;
                i++
            ) {

                const a =
                    i *
                    Math.PI *
                    2 /
                    16;

                const r =
                    i % 2 === 0
                        ? this.radius
                        : this.radius * .45;

                const x =
                    Math.cos(a) * r;

                const y =
                    Math.sin(a) * r;

                if (i === 0) {
                    ctx.moveTo(x,y);
                } else {
                    ctx.lineTo(x,y);
                }
            }

            ctx.closePath();

        } else {

            ctx.arc(
                0,
                0,
                this.radius *
                (.55 + .45 * alpha),
                0,
                Math.PI * 2
            );
        }

        ctx.stroke();

        ctx.restore();
    }
}


/* =========================================================
   PARTICLE
========================================================= */

class FireworkParticle {

    constructor(
        x,
        y,
        angle,
        speed,
        palette,
        special = false
    ) {

        this.x = x;
        this.y = y;

        this.vx =
            Math.cos(angle) *
            speed;

        this.vy =
            Math.sin(angle) *
            speed;

        this.gravity =
            .045 +
            Math.random() * .025;

        this.drag =
            .985;

        this.life =
            55 +
            Math.random() * 45;

        this.maxLife =
            this.life;

        this.palette =
            palette;

        this.size =
            .9 +
            Math.random() * 1.8;

        this.special =
            special;

        this.twinkle =
            Math.random() >
            .72;

        this.dead = false;
    }


    update() {

        this.vx *=
            this.drag;

        this.vy *=
            this.drag;

        this.vy +=
            this.gravity;

        this.x +=
            this.vx;

        this.y +=
            this.vy;

        this.life -= 1;

        if (this.life <= 0) {
            this.dead = true;
        }
    }


    draw() {

        if (!fireworksContext) {
            return;
        }

        const ctx =
            fireworksContext;

        const alpha =
            Math.max(
                0,
                this.life /
                this.maxLife
            );

        let glow =
            alpha;

        if (
            this.twinkle &&
            Math.random() > .65
        ) {
            glow *= .25;
        }

        ctx.save();

        ctx.globalAlpha =
            glow;

        ctx.beginPath();

        ctx.arc(
            this.x,
            this.y,
            this.size,
            0,
            Math.PI * 2
        );

        ctx.fillStyle =
            `rgba(${this.palette.main},1)`;

        ctx.shadowBlur =
            this.special
                ? 14
                : 7;

        ctx.shadowColor =
            `rgba(${this.palette.main},1)`;

        ctx.fill();

        ctx.restore();
    }
}


/* =========================================================
   CREATE BURST
========================================================= */

function createBurst(
    x,
    y,
    palette,
    customType = null
) {

    const burst =
        new FireworkBurst(
            x,
            y,
            palette
        );

    if (customType !== null) {
        burst.type = customType;
    }

    fireworksBursts.push(
        burst
    );


    /*
       Dense but controlled.
       This keeps 7–8 fireworks visible
       without making the phone choke.
    */

    const particleCount =
        80 +
        Math.floor(
            Math.random() * 45
        );

    for (
        let i = 0;
        i < particleCount;
        i++
    ) {

        const angle =
            Math.random() *
            Math.PI *
            2;

        const speed =
            1.8 +
            Math.random() * 4.8;

        fireworksParticles.push(
            new FireworkParticle(
                x,
                y,
                angle,
                speed,
                palette,
                Math.random() > .85
            )
        );
    }


    /*
       Secondary glitter
    */

    for (
        let i = 0;
        i < 22;
        i++
    ) {

        const angle =
            Math.random() *
            Math.PI *
            2;

        const speed =
            0.8 +
            Math.random() * 2.5;

        fireworksParticles.push(
            new FireworkParticle(
                x,
                y,
                angle,
                speed,
                {
                    core: palette.core,
                    main: palette.secondary,
                    secondary: palette.main
                },
                true
            )
        );
    }
}


/* =========================================================
   CREATE ROCKET
========================================================= */

function launchFirework(
    x,
    targetY
) {

    const palette =
        FIREWORK_PALETTES[
            Math.floor(
                Math.random() *
                FIREWORK_PALETTES.length
            )
        ];

    fireworksRockets.push(
        new FireworkRocket(
            x,
            targetY,
            palette
        )
    );

    playFireworkLaunchSound();
}


/* =========================================================
   SPAWN FIREWORK
========================================================= */

function spawnFirework() {

    /*
       Different vertical heights:
       low / medium / high / very high
    */

    const heightType =
        Math.random();

    let targetY;

    if (heightType < .20) {

        targetY =
            canvasHeight *
            (.55 + Math.random() * .08);

    } else if (heightType < .52) {

        targetY =
            canvasHeight *
            (.38 + Math.random() * .10);

    } else if (heightType < .82) {

        targetY =
            canvasHeight *
            (.23 + Math.random() * .10);

    } else {

        targetY =
            canvasHeight *
            (.12 + Math.random() * .08);
    }


    const x =
        canvasWidth *
        (.08 + Math.random() * .84);

    launchFirework(
        x,
        targetY
    );
}


/* =========================================================
   FIREWORK LOOP
========================================================= */

function updateFireworks(
    timestamp
) {

    if (!fireworksRunning) {
        return;
    }


    /*
       Fade the previous frame very slightly
       instead of clearing instantly.
       Creates cinematic trails.
    */

    fireworksContext.fillStyle =
        "rgba(2,3,8,.20)";

    fireworksContext.fillRect(
        0,
        0,
        canvasWidth,
        canvasHeight
    );


    /*
       Launch cadence.
       During main celebration we maintain
       approximately 7–8 simultaneous bursts.
    */

    const elapsed =
        timestamp -
        fireworksStartTime;


    let spawnInterval;

    if (elapsed < 7000) {

        spawnInterval = 850;

    } else if (elapsed < 28000) {

        spawnInterval = 1250;

    } else {

        spawnInterval = 850;
    }


    if (
        timestamp -
        fireworksLastSpawn >
        spawnInterval
    ) {

        fireworksLastSpawn =
            timestamp;

        /*
           Occasionally launch two rockets
           close together for double bursts.
        */

        spawnFirework();

        if (
            Math.random() < .28 &&
            elapsed > 4500 &&
            elapsed < 33000
        ) {

            setTimeout(
                () => {

                    if (fireworksRunning) {
                        spawnFirework();
                    }

                },
                230 + Math.random() * 220
            );
        }
    }


    /*
       Rockets
    */

    for (
        let i =
            fireworksRockets.length - 1;
        i >= 0;
        i--
    ) {

        const rocket =
            fireworksRockets[i];

        rocket.update();
        rocket.draw();

        if (rocket.dead) {

            fireworksRockets.splice(
                i,
                1
            );
        }
    }


    /*
       Bursts
    */

    for (
        let i =
            fireworksBursts.length - 1;
        i >= 0;
        i--
    ) {

        const burst =
            fireworksBursts[i];

        burst.update();
        burst.draw();

        if (burst.dead) {

            fireworksBursts.splice(
                i,
                1
            );
        }
    }


    /*
       Particles
    */

    for (
        let i =
            fireworksParticles.length - 1;
        i >= 0;
        i--
    ) {

        const particle =
            fireworksParticles[i];

        particle.update();
        particle.draw();

        if (
            particle.dead ||
            particle.y >
                canvasHeight + 80
        ) {

            fireworksParticles.splice(
                i,
                1
            );
        }
    }


    /*
       End of main show
    */

    if (elapsed > 39000) {

        finishFireworks();

        return;
    }


    fireworksAnimationFrame =
        requestAnimationFrame(
            updateFireworks
        );
}


/* =========================================================
   START FIREWORKS
========================================================= */

function openFireworksScene() {

    if (state.fireworksStarted) {
        return;
    }

    state.fireworksStarted = true;

    switchPhase(
        phases.fireworks,
        () => {

            startFireworks();

        }
    );
}


/* =========================================================
   FIREWORK START
========================================================= */

function startFireworks() {

    if (!fireworksCanvas) {
        return;
    }

    resizeFireworksCanvas();

    fireworksRunning = true;

    fireworksStartTime =
        performance.now();

    fireworksLastSpawn =
        fireworksStartTime -
        1000;


    fireworksRockets.length = 0;
    fireworksBursts.length = 0;
    fireworksParticles.length = 0;


    /*
       Strong opening volley.
    */

    for (let i = 0; i < 3; i++) {

        setTimeout(
            () => {

                if (fireworksRunning) {
                    spawnFirework();
                }

            },
            i * 350
        );
    }


    fireworksAnimationFrame =
        requestAnimationFrame(
            updateFireworks
        );
}


/* =========================================================
   LAUNCH SOUND
========================================================= */

function playFireworkLaunchSound() {

    if (!state.audioContext || !musicGain) {
        return;
    }

    const ctx =
        state.audioContext;

    const now =
        ctx.currentTime;

    const oscillator =
        ctx.createOscillator();

    const gain =
        ctx.createGain();

    oscillator.type =
        "sine";

    oscillator.frequency.setValueAtTime(
        100,
        now
    );

    oscillator.frequency.exponentialRampToValueAtTime(
        620,
        now + .45
    );

    gain.gain.setValueAtTime(
        .0001,
        now
    );

    gain.gain.exponentialRampToValueAtTime(
        .045,
        now + .08
    );

    gain.gain.exponentialRampToValueAtTime(
        .0001,
        now + .52
    );

    oscillator.connect(gain);
    gain.connect(musicGain);

    oscillator.start(now);
    oscillator.stop(
        now + .55
    );
}


/* =========================================================
   EXPLOSION SOUND
========================================================= */

function playFireworkExplosion(
    y
) {

    if (!state.audioContext || !musicGain) {
        return;
    }

    const ctx =
        state.audioContext;

    const now =
        ctx.currentTime;


    /*
       Low-frequency boom
    */

    const oscillator =
        ctx.createOscillator();

    const gain =
        ctx.createGain();

    oscillator.type =
        "sine";

    oscillator.frequency.setValueAtTime(
        85,
        now
    );

    oscillator.frequency.exponentialRampToValueAtTime(
        38,
        now + .42
    );

    const heightFactor =
        1 -
        Math.min(
            y / canvasHeight,
            1
        );

    gain.gain.setValueAtTime(
        .0001,
        now
    );

    gain.gain.exponentialRampToValueAtTime(
        .055 +
        heightFactor * .025,
        now + .018
    );

    gain.gain.exponentialRampToValueAtTime(
        .0001,
        now + .55
    );

    oscillator.connect(gain);
    gain.connect(musicGain);

    oscillator.start(now);
    oscillator.stop(
        now + .6
    );


    /*
       Tiny high sparkle layer
    */

    playTone(
        1150,
        .22,
        "triangle",
        .012
    );
}

/* =========================================================
   FIREWORK FINALE + NOTES
   PART 5 / 5
========================================================= */


/* =========================================================
   FIREWORK FINISH
========================================================= */

function finishFireworks() {

    if (state.fireworksFinished) {
        return;
    }

    state.fireworksFinished = true;

    /*
       Stop automatic launching,
       but let existing particles finish.
    */

    fireworksRunning = false;

    if (fireworksAnimationFrame) {

        cancelAnimationFrame(
            fireworksAnimationFrame
        );

        fireworksAnimationFrame = null;
    }


    /*
       Big finale volley
    */

    createFinaleFireworks();


    setTimeout(() => {

        revealFireworksMessage();

    }, 1300);


    setTimeout(() => {

        const indicator =
            $("#fireworksEndIndicator");

        if (indicator) {
            indicator.classList.add(
                "show"
            );
        }

    }, 3000);


    /*
       Move to notes after the
       complete cinematic finale.
    */

    setTimeout(() => {

        openNotesScene();

    }, 6900);
}


/* =========================================================
   FINALE FIREWORKS
========================================================= */

function createFinaleFireworks() {

    const positions = [
        .16,
        .31,
        .50,
        .69,
        .84
    ];

    positions.forEach(
        (position, index) => {

            setTimeout(
                () => {

                    const target =
                        canvasHeight *
                        (
                            .18 +
                            Math.random() *
                            .28
                        );

                    launchFirework(
                        canvasWidth *
                        position,
                        target
                    );

                },
                index * 250
            );
        }
    );


    /*
       Final central giant burst
    */

    setTimeout(
        () => {

            const palette =
                FIREWORK_PALETTES[0];

            createBurst(
                canvasWidth * .5,
                canvasHeight * .28,
                palette,
                2
            );

            playFireworkExplosion(
                canvasHeight * .28
            );

        },
        1500
    );
}


/* =========================================================
   FIREWORK PARTICLE MESSAGE REVEAL
========================================================= */

function revealFireworksMessage() {

    const message =
        $("#fireworksBirthdayMessage");

    const happy =
        $("#fireworksHappy");

    const aradhya =
        $("#fireworksAradhya");


    /* -----------------------------------------
       Hide normal HTML message
    ----------------------------------------- */

    if (message) {
        message.classList.remove("show");
        message.style.opacity = "0";
        message.style.pointerEvents = "none";
    }

    if (happy) {
        happy.style.opacity = "0";
    }

    if (aradhya) {
        aradhya.style.opacity = "0";
    }


    /* -----------------------------------------
       PARTICLE TEXT CANVAS
    ----------------------------------------- */

    let textCanvas =
        document.getElementById(
            "fireworkTextCanvas"
        );

    if (!textCanvas) {

        textCanvas =
            document.createElement("canvas");

        textCanvas.id =
            "fireworkTextCanvas";

        textCanvas.style.position =
            "absolute";

        textCanvas.style.inset = "0";

        textCanvas.style.width = "100%";
        textCanvas.style.height = "100%";

        textCanvas.style.zIndex = "30";

        textCanvas.style.pointerEvents =
            "none";

        document
            .getElementById("fireworksPhase")
            .appendChild(textCanvas);
    }


    const ctx =
        textCanvas.getContext("2d");

    const rect =
        textCanvas.getBoundingClientRect();

    const dpr =
        Math.min(
            window.devicePixelRatio || 1,
            1.5
        );

    textCanvas.width =
        rect.width * dpr;

    textCanvas.height =
        rect.height * dpr;

    ctx.setTransform(
        dpr,
        0,
        0,
        dpr,
        0,
        0
    );


    const width = rect.width;
    const height = rect.height;


    /* -----------------------------------------
       CREATE LETTER PARTICLES
    ----------------------------------------- */

    function getTextPoints(text, y, size) {

        const temp =
            document.createElement("canvas");

        const tctx =
            temp.getContext("2d");

        temp.width = width;
        temp.height = height;

        tctx.textAlign = "center";
        tctx.textBaseline = "middle";

        tctx.font =
            `700 ${size}px Arial`;

        tctx.fillText(
            text,
            width / 2,
            y
        );

        const data =
            tctx.getImageData(
                0,
                0,
                width,
                height
            ).data;

        const points = [];

        const gap =
            width < 500 ? 5 : 6;

        for (
            let py = 0;
            py < height;
            py += gap
        ) {

            for (
                let px = 0;
                px < width;
                px += gap
            ) {

                const alpha =
                    data[
                        (py * width + px) * 4
                        + 3
                    ];

                if (alpha > 100) {

                    points.push({
                        x: px,
                        y: py
                    });
                }
            }
        }

        return points;
    }


    const happySize =
        Math.min(
            width * .105,
            52
        );

    const aradhyaSize =
        Math.min(
            width * .16,
            78
        );


    const happyPoints =
        getTextPoints(
            "HAPPY BIRTHDAY",
            height * .43,
            happySize
        );

    const aradhyaPoints =
        getTextPoints(
            "ARADHYA",
            height * .55,
            aradhyaSize
        );


    const targetPoints = [
        ...happyPoints,
        ...aradhyaPoints
    ];


    /* -----------------------------------------
       PARTICLES START FROM RANDOM
       FIREWORK-LIKE POSITIONS
    ----------------------------------------- */

    const particles =
        targetPoints.map(
            point => {

                const angle =
                    Math.random() *
                    Math.PI * 2;

                const distance =
                    180 +
                    Math.random() * 420;

                return {

                    x:
                        width / 2 +
                        Math.cos(angle) *
                        distance,

                    y:
                        height * .35 +
                        Math.sin(angle) *
                        distance,

                    tx: point.x,
                    ty: point.y,

                    size:
                        Math.random() * 1.5
                        + .7,

                    delay:
                        Math.random() *
                        900,

                    progress: 0,

                    speed:
                        .018 +
                        Math.random() * .012,

                    phase:
                        Math.random() *
                        Math.PI * 2
                };
            }
        );


    let startTime =
        performance.now();


    /* -----------------------------------------
       SMOOTH PARTICLE FORMATION
    ----------------------------------------- */

    function animateText(now) {

        const elapsed =
            now - startTime;

        ctx.clearRect(
            0,
            0,
            width,
            height
        );


        let active =
            false;


        particles.forEach(
            particle => {

                const localTime =
                    elapsed -
                    particle.delay;

                if (localTime < 0)
                    return;

                active = true;

                particle.progress =
                    Math.min(
                        1,
                        particle.progress +
                        particle.speed
                    );


                const eased =
                    1 -
                    Math.pow(
                        1 -
                        particle.progress,
                        4
                    );


                const wobble =
                    Math.sin(
                        elapsed * .004 +
                        particle.phase
                    ) * 1.4;


                const x =
                    particle.x +
                    (
                        particle.tx -
                        particle.x
                    ) * eased;


                const y =
                    particle.y +
                    (
                        particle.ty -
                        particle.y
                    ) * eased +
                    wobble;


                ctx.beginPath();

                ctx.arc(
                    x,
                    y,
                    particle.size,
                    0,
                    Math.PI * 2
                );


                ctx.fillStyle =
                    "rgba(255,220,150,.95)";

                ctx.shadowBlur = 12;

                ctx.shadowColor =
                    "rgba(255,170,90,.9)";

                ctx.fill();

            }
        );


        ctx.shadowBlur = 0;


        if (active) {

            requestAnimationFrame(
                animateText
            );

        } else {

            setTimeout(() => {

                /* Keep the particle-written
                   message glowing briefly */

                ctx.globalAlpha = .9;

                playChime(.08);

            }, 300);
        }
    }


    requestAnimationFrame(
        animateText
    );


    /* -----------------------------------------
       FINAL HEART FIREWORK
    ----------------------------------------- */

    setTimeout(() => {

        if (
            typeof createBurst ===
            "function"
        ) {

            createBurst(
                width * .5,
                height * .64,
                FIREWORK_PALETTES[0],
                1.8
            );

        }

        playFireworkExplosion(
            height * .64
        );

    }, 2300);


    /* -----------------------------------------
       FINAL MUSIC CHORD
    ----------------------------------------- */

    setTimeout(() => {

        playTone(
            783.99,
            1.5,
            "sine",
            .035
        );

        playTone(
            987.77,
            1.8,
            "sine",
            .025,
            .18
        );

    }, 700);
}


/* =========================================================
   NOTES DATA
========================================================= */

const birthdayNotes = [

    {
        title:
            "A Little Thing",

        content:
            "Some memories are small, but somehow they become the biggest part of our story. And whenever I look back at everything, I realise how many little moments became special just because they had you in them.",

        signature:
            "— Saksham ❤️"
    },

    {
        title:
            "You Are Special",

        content:
            "There are so many people in this world, but somehow one person can make everything feel a little brighter. For me, that person is you. Your smile, your little talks, and even the simplest moments have a way of staying with me.",

        signature:
            "— Saksham ✨"
    },

    {
        title:
            "Our Memories",

        content:
            "From the first time I saw you to all those conversations and tiny memories we collected along the way, our story has slowly become something I never want to forget. Every chapter has something that makes me smile.",

        signature:
            "— Saksham 💞"
    },

    {
        title:
            "Thank You",

        content:
            "Thank you for being a part of my life and for giving so many ordinary days an extraordinary feeling. I hope this little celebration reminds you that you are genuinely appreciated and very, very special.",

        signature:
            "— Saksham 🫀"
    },

    {
        title:
            "Keep Smiling",

        content:
            "No matter how busy life becomes, I hope you always keep that beautiful smile. Keep chasing the things that make you happy, keep dreaming big, and never forget how much light you bring into the lives around you.",

        signature:
            "— Saksham 🌷"
    },

    {
        title:
            "One More Chapter",

        content:
            "This isn't the end of our little birthday journey. It is simply another page in the story. There are still so many memories to make, so many laughs to share, and so many beautiful moments waiting somewhere ahead.",

        signature:
            "— Saksham ❤️"
    }

];


/* =========================================================
   NOTES ELEMENTS
========================================================= */

const noteNumber =
    $("#noteNumber");

const noteTitle =
    $("#noteTitle");

const noteContent =
    $("#noteContent");

const noteSignature =
    $("#noteSignature");

const noteCounter =
    $("#noteCounter");

const previousNote =
    $("#previousNote");

const nextNote =
    $("#nextNote");

const notesComplete =
    $("#notesComplete");


/* =========================================================
   OPEN NOTES
========================================================= */

function openNotesScene() {

    switchPhase(
        phases.notes,
        () => {

            state.notesStarted = true;

            state.noteIndex = 0;

            renderNote();

            createNotesParticles();

            playChime(.045);

        }
    );
}


/* =========================================================
   RENDER NOTE
========================================================= */

function renderNote() {

    const note =
        birthdayNotes[
            state.noteIndex
        ];

    if (!note) {
        return;
    }


    if (noteNumber) {

        noteNumber.textContent =
            String(
                state.noteIndex + 1
            ).padStart(2, "0");
    }


    if (noteTitle) {

        noteTitle.textContent =
            note.title;
    }


    if (noteContent) {

        noteContent.innerHTML =
            `<p>${note.content}</p>`;
    }


    if (noteSignature) {

        noteSignature.textContent =
            note.signature;
    }


    if (noteCounter) {

        noteCounter.textContent =
            `${String(state.noteIndex + 1).padStart(2, "0")} / ${String(birthdayNotes.length).padStart(2, "0")}`;
    }


    if (previousNote) {

        previousNote.style.opacity =
            state.noteIndex === 0
                ? ".3"
                : "1";

        previousNote.style.pointerEvents =
            state.noteIndex === 0
                ? "none"
                : "auto";
    }


    if (nextNote) {

        nextNote.style.opacity =
            state.noteIndex ===
            birthdayNotes.length - 1
                ? ".3"
                : "1";

        nextNote.style.pointerEvents =
            state.noteIndex ===
            birthdayNotes.length - 1
                ? "none"
                : "auto";
    }


    if (notesComplete) {

        if (
            state.noteIndex ===
            birthdayNotes.length - 1
        ) {

            notesComplete.classList.add(
                "show"
            );

        } else {

            notesComplete.classList.remove(
                "show"
            );
        }
    }


    animateNoteChange();
}


/* =========================================================
   NOTE CHANGE ANIMATION
========================================================= */

function animateNoteChange() {

    const paper =
        $(".note-paper");

    if (!paper) {
        return;
    }

    paper.animate(
        [
            {
                opacity: .55,
                transform:
                    "rotate(-.4deg) translateY(10px) scale(.985)"
            },
            {
                opacity: 1,
                transform:
                    "rotate(-.4deg) translateY(0) scale(1)"
            }
        ],
        {
            duration: 500,
            easing:
                "cubic-bezier(.22,.61,.36,1)"
        }
    );
}


/* =========================================================
   NEXT NOTE
========================================================= */

if (nextNote) {

    nextNote.addEventListener(
        "click",
        () => {

            startAudio();
            resumeAudio();

            if (
                state.noteIndex >=
                birthdayNotes.length - 1
            ) {
                return;
            }

            state.noteIndex++;

            playChime(.025);

            renderNote();

        }
    );
}


/* =========================================================
   PREVIOUS NOTE
========================================================= */

if (previousNote) {

    previousNote.addEventListener(
        "click",
        () => {

            startAudio();
            resumeAudio();

            if (
                state.noteIndex <= 0
            ) {
                return;
            }

            state.noteIndex--;

            playTone(
                392,
                .5,
                "sine",
                .02
            );

            renderNote();

        }
    );
}


/* =========================================================
   NOTES PARTICLES
========================================================= */

function createNotesParticles() {

    const container =
        $("#notesParticles");

    if (!container) {
        return;
    }

    container.innerHTML = "";

    const count =
        window.innerWidth < 500
            ? 16
            : 25;

    for (
        let i = 0;
        i < count;
        i++
    ) {

        const particle =
            document.createElement("span");

        particle.style.position =
            "absolute";

        particle.style.left =
            `${Math.random() * 100}%`;

        particle.style.top =
            `${Math.random() * 100}%`;

        particle.style.width =
            `${2 + Math.random() * 4}px`;

        particle.style.height =
            particle.style.width;

        particle.style.borderRadius =
            "50%";

        particle.style.background =
            "rgba(255,255,255,.5)";

        particle.style.boxShadow =
            "0 0 8px rgba(255,255,255,.55)";

        particle.style.pointerEvents =
            "none";

        particle.animate(
            [
                {
                    transform:
                        "translateY(10px) scale(.5)",
                    opacity: .1
                },
                {
                    transform:
                        "translateY(-15px) scale(1)",
                    opacity: .65
                },
                {
                    transform:
                        "translateY(-35px) scale(.3)",
                    opacity: 0
                }
            ],
            {
                duration:
                    3500 +
                    Math.random() * 5000,

                delay:
                    -Math.random() * 5000,

                iterations:
                    Infinity,

                easing:
                    "ease-in-out"
            }
        );

        container.appendChild(
            particle
        );
    }
}


/* =========================================================
   CONTINUE TO PART 5
========================================================= */

const continueToPart5 =
    $("#continueToPart5");

if (continueToPart5) {

    continueToPart5.addEventListener(
        "click",
        () => {

            startAudio();
            resumeAudio();

            const transition =
                $("#birthdayTransition");

            if (transition) {

                transition.classList.add(
                    "show"
                );
            }

            setTimeout(() => {

                /*
                   Part 5 filename.
                   Change ONLY this filename if
                   your next page has a different name.
                */

                window.location.href =
                    "part5.html";

            }, 1100);

        }
    );
}


/* =========================================================
   TOUCH SPARK SYSTEM
========================================================= */

const touchSparkContainer =
    $("#touchSparkContainer");


function createTouchSparks(
    x,
    y
) {

    if (!touchSparkContainer) {
        return;
    }

    const count = 8;

    for (
        let i = 0;
        i < count;
        i++
    ) {

        const spark =
            document.createElement("span");

        spark.className =
            "touch-spark";

        spark.style.left =
            `${x}px`;

        spark.style.top =
            `${y}px`;

        const angle =
            (
                Math.PI * 2 *
                i /
                count
            );

        const distance =
            15 +
            Math.random() * 25;

        spark.style.setProperty(
            "--spark-x",
            `${Math.cos(angle) * distance}px`
        );

        spark.style.setProperty(
            "--spark-y",
            `${Math.sin(angle) * distance}px`
        );

        touchSparkContainer.appendChild(
            spark
        );

        setTimeout(() => {

            spark.remove();

        }, 700);
    }
}


/* =========================================================
   TOUCH EVENTS
========================================================= */

document.addEventListener(
    "pointerdown",
    (event) => {

        /*
           Don't create unnecessary sparks
           when clicking navigation controls.
        */

        const target =
            event.target;

        if (
            target.closest("button") ||
            target.closest(".cake-knife")
        ) {
            return;
        }

        createTouchSparks(
            event.clientX,
            event.clientY
        );

    },
    {
        passive: true
    }
);


/* =========================================================
   FIREWORKS CLEANUP ON PAGE HIDE
========================================================= */

document.addEventListener(
    "visibilitychange",
    () => {

        if (
            document.hidden &&
            fireworksRunning
        ) {

            if (fireworksAnimationFrame) {

                cancelAnimationFrame(
                    fireworksAnimationFrame
                );

                fireworksAnimationFrame =
                    null;
            }

        } else if (
            !document.hidden &&
            fireworksRunning
        ) {

            fireworksAnimationFrame =
                requestAnimationFrame(
                    updateFireworks
                );
        }

    }
);


/* =========================================================
   PREVENT ACCIDENTAL SCROLL
========================================================= */

document.addEventListener(
    "touchmove",
    (event) => {

        /*
           Allow scrolling only inside
           the note content.
        */

        if (
            event.target.closest(
                ".note-content"
            )
        ) {
            return;
        }

        event.preventDefault();

    },
    {
        passive: false
    }
);


/* =========================================================
   INITIAL AUDIO TOUCH
========================================================= */

document.addEventListener(
    "pointerdown",
    () => {

        startAudio();
        resumeAudio();

    },
    {
        once: true,
        passive: true
    }
);


/* =========================================================
   INITIAL PHASE SAFETY
========================================================= */

if (phases.opening) {

    phases.opening.classList.add(
        "active"
    );

    state.currentPhase =
        "openingPhase";
}


/* =========================================================
   DEBUG-FRIENDLY RESIZE
========================================================= */

window.addEventListener(
    "resize",
    () => {

        if (
            state.currentPhase ===
            "fireworksPhase"
        ) {

            resizeFireworksCanvas();

        }

    }
);


/* =========================================================
   END
========================================================= */