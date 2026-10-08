/* =========================================================
   ARADHYA'S WORLD — PART 5
   PREMIUM CINEMATIC ENGINE
========================================================= */

document.addEventListener("DOMContentLoaded", () => {

    "use strict";


    /* =====================================================
       ELEMENTS
    ===================================================== */

    const screens = {
        intro: document.getElementById("introScreen"),
        reasons: document.getElementById("reasonsScreen"),
        twist: document.getElementById("twistScreen"),
        lied: document.getElementById("liedScreen"),
        papers: document.getElementById("paperScreen"),
        heart: document.getElementById("heartScreen"),
        final: document.getElementById("finalScreen")
    };

    const startButton =
        document.getElementById("startButton");

    const skipReason =
        document.getElementById("skipReason");

    const twistButton =
        document.getElementById("twistButton");

    const continueButton =
        document.getElementById("continueButton");

    const reasonCard =
        document.getElementById("reasonCard");

    const reasonNumber =
        document.getElementById("reasonNumber");

    const reasonLargeNumber =
        document.getElementById("reasonLargeNumber");

    const reasonFooterNumber =
        document.getElementById("reasonFooterNumber");

    const reasonTitle =
        document.getElementById("reasonTitle");

    const reasonDescription =
        document.getElementById("reasonDescription");

    const progressBar =
        document.getElementById("progressBar");

    const progressLabel =
        document.getElementById("progressLabel");

    const twistText =
        document.getElementById("twistText");

    const paperField =
        document.getElementById("paperField");

    const cameraWorld =
        document.getElementById("cameraWorld");

    const heartFormation =
        document.getElementById("heartFormation");

    const finalStars =
        document.getElementById("finalStars");


    /* =====================================================
       REASONS
    ===================================================== */

    const reasons = [

        {
            title: "Your smile.",
            text: "Somehow, it makes everything feel a little lighter."
        },

        {
            title: "Your eyes.",
            text: "There is something about them that makes me forget everything else."
        },

        {
            title: "The way you care.",
            text: "Even the smallest things somehow mean so much to me."
        },

        {
            title: "Your voice.",
            text: "I could hear it for hours and still wish for a little more."
        },

        {
            title: "The way you make ordinary moments feel special.",
            text: "With you, even the simplest moment becomes a memory."
        },

        {
            title: "Your little habits.",
            text: "The tiny things you probably don't even notice... I notice them."
        },

        {
            title: "Your anger.",
            text: "Even that somehow feels special because it comes from you."
        },

        {
            title: "The way you make me smile without even trying.",
            text: "Sometimes you don't even know what you did. You just did it."
        },

        {
            title: "The person you are.",
            text: "Not because you're perfect, but because you're beautifully you."
        },

        {
            title: "Simply... you.",
            text: "Maybe this is the biggest reason of them all."
        }

    ];


    /* =====================================================
       INFINITE REASONS
    ===================================================== */

    const extraReasons = [

        "Your laugh",
        "Your voice",
        "Your eyes",
        "Your care",
        "Your little talks",
        "Your patience",
        "Your kindness",
        "Your smile",
        "Your presence",
        "Your silly moments",
        "Your way of understanding",
        "Your random messages",
        "Your little reactions",
        "Your honesty",
        "Your warmth",
        "Your beautiful heart",
        "Your way of making things better",
        "Your good mornings",
        "Your good nights",
        "Your little complaints",
        "Your trust",
        "Your support",
        "Your softness",
        "Your strength",
        "Your dreams",
        "Your cute madness",
        "Your attention",
        "Your memories",
        "Your existence",
        "Your beautiful soul",
        "Your unexpected sweetness",
        "Your way of saying my name",
        "Your little secrets",
        "Your random thoughts",
        "Your happiness",
        "Your way of making me feel understood",
        "Your calmness",
        "Your excitement",
        "Your stories",
        "Your presence in my thoughts",
        "Your tiny expressions",
        "Your way of making ordinary days special",
        "Your heart",
        "Your everything"

    ];


    /* =====================================================
       STATE
    ===================================================== */

    let currentScreen = "intro";

    let reasonIndex = 0;

    let reasonTimer = null;

    let transitionBusy = false;

    let paperStarted = false;

    let finalShown = false;


    /* =====================================================
       RESPONSIVE SETTINGS
    ===================================================== */

    function performanceSettings() {

        const width = window.innerWidth;

        const memory =
            navigator.deviceMemory || 4;

        const cores =
            navigator.hardwareConcurrency || 4;

        let quality = "high";

        if (
            width < 380 ||
            memory <= 2 ||
            cores <= 2
        ) {
            quality = "low";
        }

        else if (
            width < 600 ||
            memory <= 4
        ) {
            quality = "medium";
        }

        return quality;
    }


    /* =====================================================
       SCREEN CONTROL
    ===================================================== */

    function showScreen(name) {

        if (!screens[name]) return;

        Object.values(screens).forEach(screen => {
            screen.classList.remove("active");
        });

        screens[name].classList.add("active");

        currentScreen = name;

        updateProgress(name);
    }


    function updateProgress(name) {

        const data = {

            intro: {
                width: 5,
                text: "A little confession"
            },

            reasons: {
                width: 10 + reasonIndex * 2.3,
                text: `Reason ${reasonIndex + 1} of 10`
            },

            twist: {
                width: 37,
                text: "Something isn't right..."
            },

            lied: {
                width: 49,
                text: "One little confession"
            },

            papers: {
                width: 66,
                text: "There are more..."
            },

            heart: {
                width: 86,
                text: "Too many reasons"
            },

            final: {
                width: 100,
                text: "Just you ❤️"
            }

        };

        const item = data[name];

        if (!item) return;

        progressBar.style.width =
            `${Math.min(item.width, 100)}%`;

        progressLabel.textContent =
            item.text;
    }


    /* =====================================================
       BACKGROUND STARS
    ===================================================== */

    function createStars() {

        const container =
            document.getElementById("stars");

        const quality =
            performanceSettings();

        const count =
            quality === "low"
                ? 35
                : quality === "medium"
                    ? 55
                    : 85;

        const fragment =
            document.createDocumentFragment();

        for (let i = 0; i < count; i++) {

            const star =
                document.createElement("span");

            star.className = "star";

            star.style.left =
                `${Math.random() * 100}%`;

            star.style.top =
                `${Math.random() * 100}%`;

            star.style.setProperty(
                "--duration",
                `${2 + Math.random() * 4}s`
            );

            star.style.animationDelay =
                `${Math.random() * 5}s`;

            fragment.appendChild(star);
        }

        container.appendChild(fragment);
    }


    /* =====================================================
       FLOATING HEARTS
    ===================================================== */

    function createFloatingHearts() {

        const container =
            document.getElementById("floatingHearts");

        const quality =
            performanceSettings();

        const count =
            quality === "low"
                ? 8
                : quality === "medium"
                    ? 12
                    : 18;

        const fragment =
            document.createDocumentFragment();

        for (let i = 0; i < count; i++) {

            const heart =
                document.createElement("span");

            heart.className =
                "floating-heart";

            heart.textContent =
                Math.random() > .25
                    ? "♡"
                    : "♥";

            heart.style.left =
                `${Math.random() * 100}%`;

            heart.style.setProperty(
                "--size",
                `${9 + Math.random() * 17}px`
            );

            heart.style.setProperty(
                "--duration",
                `${11 + Math.random() * 11}s`
            );

            heart.style.setProperty(
                "--delay",
                `${-Math.random() * 16}s`
            );

            heart.style.setProperty(
                "--drift",
                `${-65 + Math.random() * 130}px`
            );

            fragment.appendChild(heart);
        }

        container.appendChild(fragment);
    }


    /* =====================================================
       PETALS
    ===================================================== */

    function createPetals() {

        const container =
            document.getElementById("floatingPetals");

        const quality =
            performanceSettings();

        const count =
            quality === "low"
                ? 5
                : quality === "medium"
                    ? 9
                    : 14;

        const fragment =
            document.createDocumentFragment();

        for (let i = 0; i < count; i++) {

            const petal =
                document.createElement("span");

            petal.className = "petal";

            petal.style.left =
                `${Math.random() * 100}%`;

            petal.style.setProperty(
                "--duration",
                `${11 + Math.random() * 12}s`
            );

            petal.style.setProperty(
                "--delay",
                `${-Math.random() * 14}s`
            );

            petal.style.setProperty(
                "--drift",
                `${-100 + Math.random() * 200}px`
            );

            fragment.appendChild(petal);
        }

        container.appendChild(fragment);
    }


    /* =====================================================
       REASON RENDER
    ===================================================== */

    function renderReason(index) {

        const reason =
            reasons[index];

        if (!reason) return;

        reasonCard.classList.remove("enter");

        reasonCard.classList.add("exit");

        setTimeout(() => {

            reasonNumber.textContent =
                String(index + 1).padStart(2, "0");

            reasonLargeNumber.textContent =
                String(index + 1).padStart(2, "0");

            reasonFooterNumber.textContent =
                String(index + 1).padStart(2, "0");

            reasonTitle.textContent =
                reason.title;

            reasonDescription.textContent =
                reason.text;

            reasonCard.classList.remove("exit");

            void reasonCard.offsetWidth;

            reasonCard.classList.add("enter");

            updateProgress("reasons");

        }, 650);
    }


    /* =====================================================
       START REASONS
    ===================================================== */

    function startReasons() {

        reasonIndex = 0;

        showScreen("reasons");

        setTimeout(() => {

            renderReason(0);

            startReasonTimer();

        }, 350);
    }


    /* =====================================================
       AUTOMATIC 5–8 SEC REASON TIMER
    ===================================================== */

    function startReasonTimer() {

        clearTimeout(reasonTimer);

        const duration =
            5000 +
            Math.random() * 3000;

        reasonTimer =
            setTimeout(() => {

                advanceReason();

            }, duration);
    }


    /* =====================================================
       NEXT REASON
    ===================================================== */

    function advanceReason() {

        if (
            transitionBusy ||
            currentScreen !== "reasons"
        ) {
            return;
        }

        transitionBusy = true;

        clearTimeout(reasonTimer);

        if (reasonIndex < reasons.length - 1) {

            reasonIndex++;

            renderReason(reasonIndex);

            setTimeout(() => {

                transitionBusy = false;

                startReasonTimer();

            }, 800);

        }

        else {

            setTimeout(() => {

                transitionBusy = false;

                startTwist();

            }, 900);
        }
    }


    /* =====================================================
       TWIST
    ===================================================== */

    function startTwist() {

        clearTimeout(reasonTimer);

        showScreen("twist");

        twistText.style.opacity = "0";

        twistText.style.transform =
            "translateY(10px)";

        setTimeout(() => {

            twistText.textContent =
                "Only ten reasons.";

            twistText.style.opacity = "1";

            twistText.style.transform =
                "translateY(0)";

        }, 1000);

        setTimeout(() => {

            twistText.style.opacity = "0";

        }, 2700);

        setTimeout(() => {

            twistText.textContent =
                "Or maybe... not.";

            twistText.style.opacity = "1";

        }, 3500);
    }


    /* =====================================================
       TWIST BUTTON
    ===================================================== */

    function twistAction() {

        if (transitionBusy) return;

        transitionBusy = true;

        showScreen("lied");

        setTimeout(() => {

            startPaperWorld();

        }, 2500);
    }


    /* =====================================================
       PAPER WORLD
    ===================================================== */

    function startPaperWorld() {

        if (paperStarted) return;

        paperStarted = true;

        showScreen("papers");

        createFlyingPapers();

        setTimeout(() => {

            cameraWorld.style.transform =
                "translate3d(0,0,0) scale(.66)";

        }, 1700);

        setTimeout(() => {

            assembleGiantHeart();

        }, 6500);
    }


    /* =====================================================
       PAPER DATA
    ===================================================== */

    function createFlyingPapers() {

        paperField.innerHTML = "";

        const quality =
            performanceSettings();

        let count;

        if (quality === "low") {
            count = 75;
        }

        else if (quality === "medium") {
            count = 105;
        }

        else {
            count = 145;
        }

        const fragment =
            document.createDocumentFragment();

        const width =
            window.innerWidth;

        const height =
            window.innerHeight;


        for (let i = 0; i < count; i++) {

            const paper =
                document.createElement("div");

            paper.className =
                "flying-paper";

            paper.textContent =
                extraReasons[
                    i % extraReasons.length
                ];


            /* ---------------------------------------------
               RESPONSIVE PAPER SIZE
            --------------------------------------------- */

            const paperWidth =
                Math.max(
                    95,
                    Math.min(
                        155,
                        width * .30
                    )
                );

            const paperHeight =
                Math.max(
                    48,
                    Math.min(
                        78,
                        height * .085
                    )
                );

            paper.style.setProperty(
                "--paper-width",
                `${paperWidth}px`
            );

            paper.style.setProperty(
                "--paper-height",
                `${paperHeight}px`
            );

            paper.style.setProperty(
                "--paper-font",
                `${Math.max(
                    10,
                    Math.min(17,width * .032)
                )}px`
            );


            /* ---------------------------------------------
               START POSITION
               Huge 3D spread around viewport
            --------------------------------------------- */

            const startX =
                (Math.random() - .5)
                * width
                * 1.8;

            const startY =
                (Math.random() - .5)
                * height
                * 2.0;

            const startZ =
                -700 +
                Math.random() * 1200;


            /* ---------------------------------------------
               MID POSITION
            --------------------------------------------- */

            const midX =
                (Math.random() - .5)
                * width
                * 1.15;

            const midY =
                (Math.random() - .5)
                * height
                * 1.15;

            const midZ =
                -350 +
                Math.random() * 700;


            /* ---------------------------------------------
               END POSITION
               Scattered around center
            --------------------------------------------- */

            const endX =
                (Math.random() - .5)
                * width
                * .72;

            const endY =
                (Math.random() - .5)
                * height
                * .72;

            const endZ =
                -250 +
                Math.random() * 500;


            paper.style.setProperty(
                "--start-x",
                `${startX}px`
            );

            paper.style.setProperty(
                "--start-y",
                `${startY}px`
            );

            paper.style.setProperty(
                "--start-z",
                `${startZ}px`
            );

            paper.style.setProperty(
                "--mid-x",
                `${midX}px`
            );

            paper.style.setProperty(
                "--mid-y",
                `${midY}px`
            );

            paper.style.setProperty(
                "--mid-z",
                `${midZ}px`
            );

            paper.style.setProperty(
                "--end-x",
                `${endX}px`
            );

            paper.style.setProperty(
                "--end-y",
                `${endY}px`
            );

            paper.style.setProperty(
                "--end-z",
                `${endZ}px`
            );


            /* ---------------------------------------------
               ROTATION
            --------------------------------------------- */

            paper.style.setProperty(
                "--rx",
                `${-35 + Math.random() * 70}deg`
            );

            paper.style.setProperty(
                "--ry",
                `${-35 + Math.random() * 70}deg`
            );

            paper.style.setProperty(
                "--rz",
                `${-80 + Math.random() * 160}deg`
            );

            paper.style.setProperty(
                "--mid-rz",
                `${-35 + Math.random() * 70}deg`
            );

            paper.style.setProperty(
                "--end-rz",
                `${-12 + Math.random() * 24}deg`
            );


            paper.style.setProperty(
                "--start-scale",
                `${.45 + Math.random() * .55}`
            );


            paper.style.setProperty(
                "--fly-duration",
                `${4.2 + Math.random() * 3.8}s`
            );


            paper.style.animationDelay =
                `${Math.random() * 2.2}s`;

            fragment.appendChild(paper);


            requestAnimationFrame(() => {

                requestAnimationFrame(() => {

                    paper.classList.add("fly");

                });

            });
        }

        paperField.appendChild(fragment);
    }


    /* =====================================================
       HEART MATHEMATICS
    ===================================================== */

    function heartCoordinates(t, scale) {

        /*
            Classic parametric heart curve
        */

        const x =
            16 *
            Math.pow(Math.sin(t), 3);

        const y =
            13 * Math.cos(t)
            - 5 * Math.cos(2 * t)
            - 2 * Math.cos(3 * t)
            - Math.cos(4 * t);

        return {
            x: x * scale,
            y: -y * scale
        };
    }

    /* =====================================================
       GIANT HEART ASSEMBLY
    ===================================================== */

    function assembleGiantHeart() {

        cameraWorld.style.transform =
            "translate3d(0,0,0) scale(.38)";

        setTimeout(() => {

            showScreen("heart");

            buildHeartParticles();

        }, 1200);
    }


    function buildHeartParticles() {

        heartFormation.innerHTML = "";

        const quality =
            performanceSettings();

        const count =
            quality === "low"
                ? 240
                : quality === "medium"
                    ? 340
                    : 480;


        const viewportWidth =
            window.innerWidth;

        const viewportHeight =
            window.innerHeight;


        /*
            Responsive heart dimensions.
        */

        const heartWidth =
            Math.min(
                viewportWidth * .82,
                480
            );

        const heartHeight =
            Math.min(
                viewportHeight * .58,
                430
            );


        const fragment =
            document.createDocumentFragment();


        for (let i = 0; i < count; i++) {

            /*
                Distribute particles around heart
                with slight interior density.
            */

            const t =
                (Math.PI * 2 * i) / count;

            const interior =
                Math.pow(
                    Math.random(),
                    .48
                );

            const point =
                heartCoordinates(
                    t,
                    interior
                );


            const heartX =
                (point.x / 16)
                * (heartWidth / 2);

            const heartY =
                (point.y / 17)
                * (heartHeight / 2);


            /*
                Random starting positions
                around entire screen.
            */

            const fromX =
                (Math.random() - .5)
                * viewportWidth
                * 1.9;

            const fromY =
                (Math.random() - .5)
                * viewportHeight
                * 1.9;

            const fromZ =
                -800 +
                Math.random() * 1100;


            const dot =
                document.createElement("span");

            dot.className =
                "heart-dot";

            dot.textContent =
                Math.random() > .94
                    ? "♡"
                    : "•";


            dot.style.setProperty(
                "--heart-x",
                `${heartX}px`
            );

            dot.style.setProperty(
                "--heart-y",
                `${heartY}px`
            );

            dot.style.setProperty(
                "--heart-z",
                `${-80 + Math.random() * 160}px`
            );

            dot.style.setProperty(
                "--from-x",
                `${fromX}px`
            );

            dot.style.setProperty(
                "--from-y",
                `${fromY}px`
            );

            dot.style.setProperty(
                "--from-z",
                `${fromZ}px`
            );

            dot.style.setProperty(
                "--from-r",
                `${-180 + Math.random() * 360}deg`
            );

            dot.style.setProperty(
                "--heart-r",
                `${-12 + Math.random() * 24}deg`
            );

            dot.style.setProperty(
                "--size",
                `${3 + Math.random() * 7}px`
            );

            dot.style.setProperty(
                "--opacity",
                `${.25 + Math.random() * .7}`
            );

            dot.style.setProperty(
                "--duration",
                `${1.7 + Math.random() * 2.1}s`
            );

            dot.style.setProperty(
                "--delay",
                `${Math.random() * 2.8}s`
            );

            fragment.appendChild(dot);
        }


        heartFormation.appendChild(fragment);


        /*
            After assembly, add a very subtle floating
            motion to the whole heart.
        */

        setTimeout(() => {

            heartFormation.style.animation =
                "heartBreath 5s ease-in-out infinite";

        }, 6000);


        /*
            Final reveal after heart formation.
        */

        setTimeout(() => {

            if (!finalShown) {

                finalShown = true;

                showFinal();

            }

        }, 10500);
    }
  

/* =====================================================
       FINAL SPARKLES
    ===================================================== */

    function createFinalSparkles() {

        finalStars.innerHTML = "";

        const quality =
            performanceSettings();

        const count =
            quality === "low"
                ? 12
                : quality === "medium"
                    ? 18
                    : 28;

        const fragment =
            document.createDocumentFragment();

        for (let i = 0; i < count; i++) {

            const sparkle =
                document.createElement("span");

            sparkle.className =
                "final-sparkle";

            sparkle.textContent =
                Math.random() > .35
                    ? "✦"
                    : "·";

            sparkle.style.left =
                `${Math.random() * 100}%`;

            sparkle.style.top =
                `${Math.random() * 100}%`;

            sparkle.style.setProperty(
                "--duration",
                `${2 + Math.random() * 4}s`
            );

            sparkle.style.setProperty(
                "--delay",
                `${Math.random() * 3}s`
            );

            fragment.appendChild(sparkle);
        }

        finalStars.appendChild(fragment);
    }


    /* =====================================================
       FINAL
    ===================================================== */

    function showFinal() {

        createFinalSparkles();

        showScreen("final");
    }


    /* =====================================================
       NAVIGATION
    ===================================================== */

    startButton.addEventListener(
        "click",
        startReasons
    );


    skipReason.addEventListener(
        "click",
        advanceReason
    );


    twistButton.addEventListener(
        "click",
        twistAction
    );


    continueButton.addEventListener(
        "click",
        () => {

            continueButton.disabled = true;

            continueButton.style.transform =
                "scale(.96)";

            setTimeout(() => {

                window.location.href =
                    "part06.html";

            }, 400);
        }
    );


    /* =====================================================
       SWIPE SUPPORT
    ===================================================== */

    let touchStartX = 0;
    let touchStartY = 0;

    document.addEventListener(
        "touchstart",
        event => {

            if (
                currentScreen !== "reasons"
            ) {
                return;
            }

            touchStartX =
                event.touches[0].clientX;

            touchStartY =
                event.touches[0].clientY;

        },
        { passive: true }
    );


    document.addEventListener(
        "touchend",
        event => {

            if (
                currentScreen !== "reasons"
            ) {
                return;
            }

            const endX =
                event.changedTouches[0].clientX;

            const endY =
                event.changedTouches[0].clientY;

            const dx =
                endX - touchStartX;

            const dy =
                endY - touchStartY;

            /*
                Only horizontal swipe.
            */

            if (
                Math.abs(dx) > 60 &&
                Math.abs(dx) > Math.abs(dy)
            ) {

                if (dx < 0) {
                    advanceReason();
                }
            }

        },
        { passive: true }
    );


    /* =====================================================
       PREVENT DOUBLE TAP ZOOM / LONG PRESS
    ===================================================== */

    document.addEventListener(
        "dblclick",
        event => {
            event.preventDefault();
        }
    );


    /* =====================================================
       RESIZE SAFETY
    ===================================================== */

    let resizeTimer;

    window.addEventListener(
        "resize",
        () => {

            clearTimeout(resizeTimer);

            resizeTimer =
                setTimeout(() => {

                    /*
                        Do not recreate the current
                        experience during resize.
                    */

                    if (
                        currentScreen === "heart" &&
                        heartFormation.children.length
                    ) {
                        /*
                            Heart remains safely inside
                            its responsive viewport.
                        */
                    }

                }, 250);
        }
    );


    /* =====================================================
       INITIALIZE
    ===================================================== */

    createStars();
    createFloatingHearts();
    createPetals();

    updateProgress("intro");

});