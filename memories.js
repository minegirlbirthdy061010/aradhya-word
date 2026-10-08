/* =========================================================
   MEMORIES.JS — PART 1
   ENTRY → COLLECTING MEMORIES
   ========================================================= */

(() => {
    "use strict";

    /* =====================================================
       1. GET ELEMENTS
       ===================================================== */

    const entryPhase =
        document.getElementById("entryPhase");

    const collectingPhase =
        document.getElementById("collectingPhase");

    const startMemoryButton =
        document.getElementById("startMemoryButton");

    const loadingProgress =
        document.getElementById("loadingProgress");

    const loadingPercentage =
        document.getElementById("loadingPercentage");

    const loadingStatus =
        document.getElementById("loadingStatus");

    const collectingMemoryCloud =
        document.getElementById("collectingMemoryCloud");

    const backgroundMusic =
        document.getElementById("backgroundMusic");


    /* =====================================================
       2. BASIC SAFETY CHECK
       ===================================================== */

    if (
        !entryPhase ||
        !collectingPhase ||
        !startMemoryButton ||
        !loadingProgress ||
        !loadingPercentage ||
        !loadingStatus
    ) {
        console.error(
            "Memories Part 1: Required HTML elements are missing."
        );

        return;
    }


    /* =====================================================
       3. STATE
       ===================================================== */

    let isStarted = false;
    let collectionInterval = null;
    let collectionProgress = 0;


    /* =====================================================
       4. INITIAL STATE
       ===================================================== */

    entryPhase.classList.add("active");
    entryPhase.classList.remove("hidden");

    collectingPhase.classList.add("hidden");
    collectingPhase.classList.remove("active");

    loadingProgress.style.width = "0%";
    loadingPercentage.textContent = "0%";

    loadingStatus.textContent =
        "Searching our memories...";


    /* =====================================================
       5. PHASE SWITCH
       ===================================================== */

    function showPhase(nextPhase) {

        const allPhases = [
            entryPhase,
            collectingPhase
        ];

        allPhases.forEach((phase) => {

            if (phase === nextPhase) {

                phase.classList.remove("hidden");

                requestAnimationFrame(() => {
                    phase.classList.add("active");
                });

            } else {

                phase.classList.remove("active");

                setTimeout(() => {

                    if (!phase.classList.contains("active")) {
                        phase.classList.add("hidden");
                    }

                }, 800);
            }
        });
    }


    /* =====================================================
       6. START MEMORY EXPERIENCE
       ===================================================== */

    function startMemoryExperience() {

        if (isStarted) {
            return;
        }

        isStarted = true;

        startMemoryButton.disabled = true;

        startMemoryButton.style.pointerEvents = "none";

        /* ---------------------------------------------
           Small touch feedback
           --------------------------------------------- */

        createTouchHeart(
            startMemoryButton,
            "❤️"
        );


        /* ---------------------------------------------
           Start collecting phase
           --------------------------------------------- */

        showPhase(collectingPhase);


        /* ---------------------------------------------
           Try starting music.
           Browser may block autoplay, so failure is
           intentionally ignored.
           --------------------------------------------- */

        if (backgroundMusic) {

            backgroundMusic.volume = 0.45;

            const musicPromise =
                backgroundMusic.play();

            if (
                musicPromise &&
                typeof musicPromise.catch === "function"
            ) {
                musicPromise.catch(() => {
                    /*
                       Browser autoplay restriction.
                       Music can be started later from a
                       user interaction.
                    */
                });
            }
        }


        /* ---------------------------------------------
           Begin loading
           --------------------------------------------- */

        startMemoryCollection();
    }


    /* =====================================================
       7. MEMORY COLLECTION
       ===================================================== */

    function startMemoryCollection() {

        if (collectionInterval) {
            clearInterval(collectionInterval);
        }

        collectionProgress = 0;

        updateCollectionProgress(
            collectionProgress
        );

        collectionInterval =
            setInterval(() => {

                collectionProgress +=
                    getProgressStep(collectionProgress);

                if (collectionProgress >= 70) {

                    collectionProgress = 70;

                    updateCollectionProgress(
                        collectionProgress
                    );

                    clearInterval(
                        collectionInterval
                    );

                    collectionInterval = null;

                    collectingFinished();

                    return;
                }

                updateCollectionProgress(
                    collectionProgress
                );

            }, 120);
    }


    /* =====================================================
       8. PROGRESS STEP
       ===================================================== */

    function getProgressStep(progress) {

        if (progress < 10) {
            return 1;
        }

        if (progress < 30) {
            return 1;
        }

        if (progress < 50) {
            return 1;
        }

        if (progress < 65) {
            return 1;
        }

        return 1;
    }


    /* =====================================================
       9. UPDATE PROGRESS
       ===================================================== */

    function updateCollectionProgress(value) {

        const safeValue =
            Math.max(
                0,
                Math.min(
                    70,
                    Math.round(value)
                )
            );

        loadingProgress.style.width =
            safeValue + "%";

        loadingPercentage.textContent =
            safeValue + "%";


        /* ---------------------------------------------
           Status messages
           --------------------------------------------- */

        if (safeValue < 15) {

            loadingStatus.textContent =
                "Searching our memories...";

        } else if (safeValue < 30) {

            loadingStatus.textContent =
                "Finding little moments...";

        } else if (safeValue < 45) {

            loadingStatus.textContent =
                "Gathering precious memories...";

        } else if (safeValue < 60) {

            loadingStatus.textContent =
                "Saving the moments that matter...";

        } else if (safeValue < 70) {

            loadingStatus.textContent =
                "Almost there...";

        } else {

            loadingStatus.textContent =
                "Memories collected...";
        }
    }


    /* =====================================================
       10. COLLECTION COMPLETE
       ===================================================== */

    function collectingFinished() {

        loadingStatus.textContent =
            "Memories collected...";

        loadingPercentage.textContent =
            "70%";

        loadingProgress.style.width =
            "70%";


        /*
           IMPORTANT:

           Part 1 intentionally stops here.

           Memory Leak / Part 2 JS will be connected
           only after Part 1 has been tested.
        */

        console.log(
            "Memories Part 1 complete: Collection reached 70%."
        );
      if (typeof window.startMemoryLeakPhase === "function") {
    window.startMemoryLeakPhase();
} else {
    console.error("Part 2 function not found: startMemoryLeakPhase");
      }
    }


    /* =====================================================
       11. TOUCH HEART EFFECT
       ===================================================== */

    function createTouchHeart(
        element,
        symbol = "♥"
    ) {

        if (!element) {
            return;
        }

        const rect =
            element.getBoundingClientRect();

        const heart =
            document.createElement("span");

        heart.textContent = symbol;

        heart.className =
            "touch-heart";

        heart.style.left =
            (rect.left + rect.width / 2) + "px";

        heart.style.top =
            (rect.top + rect.height / 2) + "px";

        heart.style.setProperty(
            "--heart-size",
            "20px"
        );

        const touchLayer =
            document.getElementById(
                "touchEffectLayer"
            );

        if (!touchLayer) {
            return;
        }

        touchLayer.appendChild(heart);

        setTimeout(() => {

            heart.remove();

        }, 1100);
    }


    /* =====================================================
       12. BUTTON EVENTS
       ===================================================== */

    startMemoryButton.addEventListener(
        "click",
        startMemoryExperience
    );


    /* =====================================================
       13. CLEANUP
       ===================================================== */

    window.addEventListener(
        "beforeunload",
        () => {

            if (collectionInterval) {

                clearInterval(
                    collectionInterval
                );

                collectionInterval = null;
            }
        }
    );


    /* =====================================================
       14. DEBUG MESSAGE
       ===================================================== */

    console.log(
    "Memories Part 1 complete: Collection reached 70%."
);

if (typeof window.startMemoryLeakPhase === "function") {
    window.startMemoryLeakPhase();
} else {
    console.error("Part 2 function not found: startMemoryLeakPhase");
}

})();
/* =========================================================
   MEMORIES.JS — PART 2
   MEMORY LEAK → HEARTBEAT
   ========================================================= */

(() => {
    "use strict";


    /* =====================================================
       1. GET ELEMENTS
       ===================================================== */

    const memoryLeakPhase =
        document.getElementById("memoryLeakPhase");

    const heartbeatPhase =
        document.getElementById("heartbeatPhase");

    const memoryLeakFill =
        document.getElementById("memoryLeakFill");

    const memoryLeakPercentage =
        document.getElementById("memoryLeakPercentage");

    const memoryLeakContinueButton =
        document.getElementById(
            "memoryLeakContinueButton"
        );

    const leakText =
        document.getElementById("leakText");

    const leakSubText =
        document.getElementById("leakSubText");

    const leakMemoryCounter =
        document.getElementById("leakMemoryCounter");

    const leakFragments =
        document.getElementById("leakFragments");

    const heartbeatText =
        document.getElementById("heartbeatText");

    const heartbeatValue =
        document.getElementById("heartbeatValue");

    const heartbeatCircle =
        document.getElementById("heartbeatCircle");

    const heartbeatSound =
        document.getElementById("heartbeatSound");


    /* =====================================================
       2. SAFETY CHECK
       ===================================================== */

    if (
        !memoryLeakPhase ||
        !heartbeatPhase ||
        !memoryLeakFill ||
        !memoryLeakPercentage ||
        !leakText ||
        !leakSubText ||
        !leakMemoryCounter ||
        !leakFragments ||
        !heartbeatText ||
        !heartbeatValue ||
        !heartbeatCircle
    ) {
        console.error(
            "Memories Part 2: Required HTML elements are missing."
        );

        return;
    }


    /* =====================================================
       3. STATE
       ===================================================== */

    let leakRunning = false;
    let leakProgress = 70;

    let leakInterval = null;
    let leakSpawnInterval = null;

    let heartbeatRunning = false;
    let heartbeatInterval = null;

    let heartbeatValueNumber = 80;


    /* =====================================================
       4. PHASE SWITCH
       ===================================================== */

    function showPart2Phase(nextPhase) {
    const phases = [
        memoryLeakPhase,
        heartbeatPhase,
        document.getElementById("entryPhase"),
        document.getElementById("collectingPhase")
    ];

    phases.forEach((phase) => {
        if (!phase) return;

        if (phase === nextPhase) {
            phase.classList.remove("hidden");

            requestAnimationFrame(() => {
                phase.classList.add("active");
            });
        } else {
            phase.classList.remove("active");
            phase.classList.add("hidden");
        }
    });
    }
    /* =====================================================
       5. START MEMORY LEAK
       ===================================================== */

    function startMemoryLeakPhase() {

        if (leakRunning) {
            return;
        }

        leakRunning = true;

        console.log(
            "Memories Part 2: Memory leak started."
        );

        showPart2Phase(
            memoryLeakPhase
        );

        resetMemoryLeak();

        beginMemoryLeakProgress();

        beginMemoryFragmentLeak();

        startLeakTextSequence();
    }


    /* =====================================================
       6. RESET LEAK
       ===================================================== */

    function resetMemoryLeak() {

        leakProgress = 70;

        memoryLeakFill.style.width =
            "70%";

        memoryLeakPercentage.textContent =
            "70%";

        leakMemoryCounter.textContent =
            "Memories escaping: 0";

        leakText.textContent =
            "Wait... something's wrong.";

        leakSubText.textContent =
            "The archive is behaving strangely.";

        leakFragments.innerHTML = "";

        if (memoryLeakContinueButton) {

            memoryLeakContinueButton
                .classList.add("hidden");
        }
    }


    /* =====================================================
       7. LEAK TEXT SEQUENCE
       ===================================================== */

    function startLeakTextSequence() {

        setTimeout(() => {

            if (!leakRunning) {
                return;
            }

            leakText.textContent =
                "Wait... something wrong with this system";

            leakSubText.textContent =
                "The memory archive is becoming unstable.";

        }, 900);


        setTimeout(() => {

            if (!leakRunning) {
                return;
            }

            leakText.textContent =
                "Memory leak detected....";

            leakSubText.textContent =
                "Precious memories are escaping.";

        }, 1900);


        setTimeout(() => {

            if (!leakRunning) {
                return;
            }

            leakText.textContent =
                "Trying to fix memory leak";

            leakSubText.textContent =
                "Please stay with me...";

        }, 4300);
    }


    /* =====================================================
       8. LEAK PROGRESS
       ===================================================== */

    function beginMemoryLeakProgress() {

        if (leakInterval) {
            clearInterval(leakInterval);
        }

        leakInterval =
            setInterval(() => {

                leakProgress += 1;

                if (leakProgress >= 85) {

                    leakProgress = 85;

                    updateLeakProgress();

                    clearInterval(
                        leakInterval
                    );

                    leakInterval = null;

                    finishMemoryLeak();

                    return;
                }

                updateLeakProgress();

            }, 450);
    }


    /* =====================================================
       9. UPDATE LEAK PROGRESS
       ===================================================== */

    function updateLeakProgress() {

        const safeProgress =
            Math.max(
                70,
                Math.min(
                    85,
                    Math.round(
                        leakProgress
                    )
                )
            );

        memoryLeakFill.style.width =
            safeProgress + "%";

        memoryLeakPercentage.textContent =
            safeProgress + "%";

        const escaping =
            Math.max(
                0,
                Math.floor(
                    (safeProgress - 69) * 3
                )
            );

        leakMemoryCounter.textContent =
            "Memories escaping: " +
            escaping;
    }


    /* =====================================================
       10. MEMORY FRAGMENTS
       ===================================================== */

    const memoryFragments = [

        "First hi",

        "That smile",

        "That night",

        "That call",

        "Those eyes",

        "That laugh",

        "The waiting",

        "Our first chat",

        "That little moment",

        "Miss you",

        "Good night",

        "Good morning",

        "That photo",

        "That feeling",

        "Our story",

        "The first time",

        "That conversation",

        "The way you smiled",

        "One more memory",

        "Still remember..."

    ];


    /* =====================================================
       11. SPAWN ONE MEMORY FRAGMENT
       ===================================================== */

    function spawnMemoryFragment() {

        if (!leakFragments) {
            return;
        }

        const fragment =
            document.createElement("span");

        fragment.className =
            "memory-fragment";

        const randomIndex =
            Math.floor(
                Math.random() *
                memoryFragments.length
            );

        fragment.textContent =
            memoryFragments[randomIndex];


        /* ---------------------------------------------
           Random starting location
           --------------------------------------------- */

        const startPositions = [

            {
                x: 25 + Math.random() * 20,
                y: 28 + Math.random() * 25
            },

            {
                x: 50 + Math.random() * 25,
                y: 25 + Math.random() * 30
            },

            {
                x: 20 + Math.random() * 60,
                y: 55 + Math.random() * 18
            },

            {
                x: 35 + Math.random() * 30,
                y: 20 + Math.random() * 20
            }
        ];

        const position =
            startPositions[
                Math.floor(
                    Math.random() *
                    startPositions.length
                )
            ];


        fragment.style.left =
            position.x + "%";

        fragment.style.top =
            position.y + "%";


        /* ---------------------------------------------
           Random escape direction
           --------------------------------------------- */

        const escapeX =
            (Math.random() * 2 - 1) * 170;

        const escapeY =
            -80 -
            Math.random() * 260;


        const rotation =
            (Math.random() * 24) - 12;


        const duration =
            5.5 +
            Math.random() * 3.5;


        fragment.style.setProperty(
            "--leak-x",
            escapeX + "px"
        );

        fragment.style.setProperty(
            "--leak-y",
            escapeY + "px"
        );

        fragment.style.setProperty(
            "--leak-rotate",
            rotation + "deg"
        );

        fragment.style.setProperty(
            "--leak-duration",
            duration + "s"
        );


        leakFragments.appendChild(
            fragment
        );


        /* ---------------------------------------------
           Remove after animation
           --------------------------------------------- */

        setTimeout(() => {

            fragment.remove();

        }, (duration * 1000) + 300);
    }


    /* =====================================================
       12. CONTINUOUS MEMORY LEAK
       ===================================================== */

    function beginMemoryFragmentLeak() {

        if (leakSpawnInterval) {
            clearInterval(
                leakSpawnInterval
            );
        }

        spawnMemoryFragment();

        leakSpawnInterval =
            setInterval(() => {

                if (!leakRunning) {
                    return;
                }

                spawnMemoryFragment();

            }, 520);
    }


    /* =====================================================
       13. FINISH MEMORY LEAK
       ===================================================== */

    function finishMemoryLeak() {

        leakRunning = false;

        if (leakSpawnInterval) {

            clearInterval(
                leakSpawnInterval
            );

            leakSpawnInterval = null;
        }


        leakText.textContent =
            "Trying to fix memory leak";

        leakSubText.textContent =
            "Memory leak contained... for now.";

        leakMemoryCounter.textContent =
            "Memory leak stabilized";


        if (memoryLeakContinueButton) {

            memoryLeakContinueButton
                .classList.remove("hidden");

            memoryLeakContinueButton.textContent =
                "Continue";
        }


        console.log(
            "Memories Part 2: Memory leak stabilized at 85%."
        );


        /*
           Automatically begin heartbeat after
           the leak settles.

           No forced jump while the leak is active.
        */

        setTimeout(() => {

            startHeartbeatPhase();

        }, 1100);
    }


    /* =====================================================
       14. START HEARTBEAT
       ===================================================== */

    function startHeartbeatPhase() {

        if (heartbeatRunning) {
            return;
        }

        heartbeatRunning = true;

        showPart2Phase(
            heartbeatPhase
        );

        heartbeatValueNumber = 80;

        heartbeatText.textContent =
            "Checking the connection...";

        heartbeatValue.textContent =
            "80%";

        startHeartbeatSound();

        startHeartbeatProgress();

        console.log(
            "Memories Part 2: Heartbeat started."
        );
    }


    /* =====================================================
       15. HEARTBEAT SOUND
       ===================================================== */

    function startHeartbeatSound() {

        if (!heartbeatSound) {
            return;
        }

        heartbeatSound.pause();

        heartbeatSound.currentTime = 0;

        heartbeatSound.loop = true;

        heartbeatSound.volume = 0.7;


        const playPromise =
            heartbeatSound.play();

        if (
            playPromise &&
            typeof playPromise.catch === "function"
        ) {

            playPromise.catch(() => {

                console.log(
                    "Heartbeat sound waiting for browser permission."
                );

            });
        }
    }


    /* =====================================================
       16. HEARTBEAT PROGRESS
       ===================================================== */

    function startHeartbeatProgress() {

        if (heartbeatInterval) {

            clearInterval(
                heartbeatInterval
            );
        }

        heartbeatInterval =
            setInterval(() => {

                heartbeatValueNumber += 1;

                if (
                    heartbeatValueNumber >= 100
                ) {

                    heartbeatValueNumber =
                        100;

                    updateHeartbeat();

                    clearInterval(
                        heartbeatInterval
                    );

                    heartbeatInterval = null;

                    heartbeatFinished();

                    return;
                }

                updateHeartbeat();

            }, 170);
    }


    /* =====================================================
       17. UPDATE HEARTBEAT
       ===================================================== */

    function updateHeartbeat() {

        heartbeatValue.textContent =
            heartbeatValueNumber + "%";


        if (heartbeatValueNumber < 88) {

            heartbeatText.textContent =
                "Something is still connected...";

        } else if (
            heartbeatValueNumber < 96
        ) {

            heartbeatText.textContent =
                "The memories are responding...";

        } else {

            heartbeatText.textContent =
                "Connection restored...";
        }


        /* ---------------------------------------------
           Make visible heartbeat gradually stronger
           --------------------------------------------- */

        const intensity =
            1 +
            (
                (heartbeatValueNumber - 80) /
                20
            ) * .28;


        heartbeatCircle.style.transform =
            "scale(" +
            intensity +
            ")";


        heartbeatCircle.style.boxShadow =
            "0 0 " +
            (
                25 +
                (
                    heartbeatValueNumber - 80
                ) * 1.2
            ) +
            "px rgba(204,52,104,.18)";
    }


    /* =====================================================
       18. HEARTBEAT COMPLETE
       ===================================================== */

    function heartbeatFinished() {

        heartbeatValueNumber = 100;

        heartbeatValue.textContent =
            "100%";

        heartbeatText.textContent =
            "Connection restored...";

        /*
           IMPORTANT:

           Heartbeat sound intentionally continues.

           The next JS part will take over from here
           and handle AI calculation / overload.
        */

        console.log(
            "Memories Part 2 complete: Heartbeat reached 100%."
        );
      if (typeof startOverloadPhase === "function") {
    startOverloadPhase();
      }
    }


    /* =====================================================
       19. OPTIONAL MANUAL CONTINUE
       ===================================================== */

    if (memoryLeakContinueButton) {

        memoryLeakContinueButton
            .addEventListener(
                "click",
                () => {

                    if (
                        heartbeatRunning
                    ) {
                        return;
                    }

                    startHeartbeatPhase();
                }
            );
    }


    /* =====================================================
       20. GLOBAL CONNECTION
       ===================================================== */

    window.startMemoryLeakPhase =
        startMemoryLeakPhase;


    /* =====================================================
       21. CLEANUP
       ===================================================== */

    window.addEventListener(
        "beforeunload",
        () => {

            if (leakInterval) {

                clearInterval(
                    leakInterval
                );

                leakInterval = null;
            }

            if (leakSpawnInterval) {

                clearInterval(
                    leakSpawnInterval
                );

                leakSpawnInterval = null;
            }

            if (heartbeatInterval) {

                clearInterval(
                    heartbeatInterval
                );

                heartbeatInterval = null;
            }

            if (heartbeatSound) {

                heartbeatSound.pause();
            }
        }
    );


    /* =====================================================
       22. DEBUG
       ===================================================== */

    console.log(
        "Memories Part 2 loaded successfully."
    );

})();
/* =========================================================
   MEMORIES.JS — PART 3
   AI CALCULATION → SYSTEM OVERLOAD → CRASH → RECOVERY
   ========================================================= */

(() => {
    "use strict";

    /* =====================================================
       1. GET ELEMENTS
       ===================================================== */

    const heartbeatPhase =
        document.getElementById("heartbeatPhase");

    const overloadPhase =
        document.getElementById("overloadPhase");

    const recoveryPhase =
        document.getElementById("recoveryPhase");

    const calculationParticles =
        document.getElementById("calculationParticles");

    const aiCore =
        document.getElementById("ai-core");

    const calculatingText =
        document.getElementById("calculatingText");

    const memoryCount =
        document.getElementById("memoryCount");

    const processingText =
        document.getElementById("processingText");

    const calculationProgress =
        document.getElementById("calculationProgress");

    const calculationPercentage =
        document.getElementById("calculationPercentage");

    const overloadMessage =
        document.getElementById("overloadMessage");

    const recoveryText =
        document.getElementById("recoveryText");

    const recoveryProgress =
        document.getElementById("recoveryProgress");

    const recoveryPercentage =
        document.getElementById("recoveryPercentage");

    const recoveryStatus =
        document.getElementById("recoveryStatus");

    const heartbeatSound =
        document.getElementById("heartbeatSound");

    const systemSound =
        document.getElementById("systemSound");


    /* =====================================================
       2. SAFETY CHECK
       ===================================================== */

    if (
        !overloadPhase ||
        !recoveryPhase ||
        !calculatingText ||
        !memoryCount ||
        !processingText ||
        !calculationProgress ||
        !calculationPercentage ||
        !overloadMessage ||
        !recoveryText ||
        !recoveryProgress ||
        !recoveryPercentage ||
        !recoveryStatus
    ) {
        console.error(
            "Memories Part 3: Required HTML elements are missing."
        );

        return;
    }


    /* =====================================================
       3. STATE
       ===================================================== */

    let overloadRunning = false;
    let recoveryRunning = false;

    let calculationInterval = null;
    let recoveryInterval = null;

    let calculationValue = 0;
    let recoveryValue = 0;

    let memoryNumber = 0;

    let calculationStep = 0;


    /* =====================================================
       4. PHASE SWITCHING
       ===================================================== */

    function showPart3Phase(nextPhase) {

        const phases = [
            heartbeatPhase,
            overloadPhase,
            recoveryPhase
        ];

        phases.forEach((phase) => {

            if (!phase) return;

            if (phase === nextPhase) {

                phase.classList.remove("hidden");

                requestAnimationFrame(() => {
                    phase.classList.add("active");
                });

            } else {

                phase.classList.remove("active");

                setTimeout(() => {

                    if (!phase.classList.contains("active")) {
                        phase.classList.add("hidden");
                    }

                }, 800);
            }
        });
    }


    /* =====================================================
       5. START AI OVERLOAD
       ===================================================== */

    function startOverloadPhase() {

        if (overloadRunning) return;

        overloadRunning = true;

        console.log(
            "Memories Part 3: AI calculation started."
        );

        showPart3Phase(overloadPhase);

        resetOverload();

        startCalculation();

        startCalculationParticles();
    }


    /* =====================================================
       6. RESET OVERLOAD
       ===================================================== */

    function resetOverload() {

        calculationValue = 0;
        memoryNumber = 0;
        calculationStep = 0;

        if (calculationInterval) {
            clearInterval(calculationInterval);
            calculationInterval = null;
        }

        calculationProgress.style.width = "0%";

        calculationPercentage.textContent = "0%";

        memoryCount.textContent =
            "0";

        calculatingText.textContent =
            "Analysing......";

        processingText.textContent =
            "Preparing memory archive...";

        overloadMessage.textContent =
            "";

        if (aiCore) {
            aiCore.classList.remove("overloaded");
            aiCore.classList.remove("crashed");
        }
    }


    /* =====================================================
       7. CALCULATION TEXT SEQUENCE
       ===================================================== */

    function updateCalculationText() {

        if (!overloadRunning) return;

        if (calculationStep === 0) {

            calculatingText.textContent =
                "Analysing......";

            processingText.textContent =
                "Scanning memories...";

        } else if (calculationStep === 1) {

            calculatingText.textContent =
                "Calculating......";

            processingText.textContent =
                "Counting precious moments...";

        } else if (calculationStep === 2) {

            calculatingText.textContent =
                "Processing......";

            processingText.textContent =
                "Comparing memories...";

        } else if (calculationStep === 3) {

            calculatingText.textContent =
                "I cannot count them anymore";

            processingText.textContent =
                "There are too many memories...";
        }
    }


    /* =====================================================
       8. AI CALCULATION
       ===================================================== */

    function startCalculation() {

        if (calculationInterval) {
            clearInterval(calculationInterval);
        }

        calculationValue = 0;
        memoryNumber = 0;
        calculationStep = 0;

        updateCalculationText();

        calculationInterval =
            setInterval(() => {

                if (!overloadRunning) return;

                calculationValue += 1;

                memoryNumber +=
                    Math.floor(
                        4 + Math.random() * 9
                    );

                calculationProgress.style.width =
                    calculationValue + "%";

                calculationPercentage.textContent =
                    calculationValue + "%";

                memoryCount.textContent =
                    memoryNumber.toLocaleString();

                if (calculationValue === 20) {

                    calculationStep = 1;
                    updateCalculationText();

                }

                if (calculationValue === 45) {

                    calculationStep = 2;
                    updateCalculationText();

                }

                if (calculationValue === 70) {

                    calculationStep = 3;
                    updateCalculationText();

                }

                if (calculationValue >= 100) {

                    calculationValue = 100;

                    calculationProgress.style.width =
                        "100%";

                    calculationPercentage.textContent =
                        "100%";

                    clearInterval(
                        calculationInterval
                    );

                    calculationInterval = null;

                    finishCalculation();
                }

            }, 95);
    }


    /* =====================================================
       9. CALCULATION FINISHED
       ===================================================== */

    function finishCalculation() {

        if (!overloadRunning) return;

        calculatingText.textContent =
            "I cannot count them anymore";

        processingText.textContent =
            "System overload";

        overloadMessage.textContent =
            "Too many memories detected...";

        console.log(
            "Memories Part 3: Memory calculation overloaded."
        );

        setTimeout(() => {

            if (!overloadRunning) return;

            crashSystem();

        }, 1300);
    }


    /* =====================================================
       10. SYSTEM CRASH
       ===================================================== */

    function crashSystem() {

        if (!overloadRunning) return;

        console.log(
            "Memories Part 3: System crash started."
        );

        if (calculationInterval) {

            clearInterval(
                calculationInterval
            );

            calculationInterval = null;
        }

        /* Stop heartbeat completely */

        if (heartbeatSound) {

            heartbeatSound.pause();

            heartbeatSound.currentTime = 0;
        }


        /* Stop system sound first */

        if (systemSound) {

            systemSound.pause();

            systemSound.currentTime = 0;
        }


        /* AI core crash state */

        if (aiCore) {

            aiCore.classList.add("overloaded");

            setTimeout(() => {

                aiCore.classList.add("crashed");

            }, 300);
        }


        /* Play crash / flatline sound */

        if (systemSound) {

            systemSound.volume = 0.8;

            const playPromise =
                systemSound.play();

            if (
                playPromise &&
                typeof playPromise.catch === "function"
            ) {

                playPromise.catch(() => {});

            }
        }


        /* Glitch effect */

        createCrashGlitches();


        overloadMessage.textContent =
            "This system has been crashed because there are too many memories";


        calculatingText.textContent =
            "";

        processingText.textContent =
            "";


        setTimeout(() => {

            startRecoveryPhase();

        }, 1800);
    }


    /* =====================================================
       11. CRASH GLITCHES
       ===================================================== */

    function createCrashGlitches() {

        if (!overloadPhase) return;

        for (let i = 0; i < 18; i++) {

            const glitch =
                document.createElement("span");

            glitch.textContent = "ERROR";

            glitch.style.position = "absolute";

            glitch.style.left =
                Math.random() * 100 + "%";

            glitch.style.top =
                Math.random() * 100 + "%";

            glitch.style.fontSize =
                (10 + Math.random() * 18) + "px";

            glitch.style.fontWeight =
                "700";

            glitch.style.letterSpacing =
                "2px";

            glitch.style.opacity =
                "0.75";

            glitch.style.color =
                "rgba(130,25,65,.65)";

            glitch.style.pointerEvents =
                "none";

            glitch.style.zIndex =
                "20";

            glitch.style.transform =
                "translate(-50%, -50%)";

            overloadPhase.appendChild(glitch);

            setTimeout(() => {

                glitch.remove();

            }, 900 + Math.random() * 700);
        }
    }


    /* =====================================================
       12. CALCULATION PARTICLES
       ===================================================== */

    function startCalculationParticles() {

        if (!calculationParticles) return;

        calculationParticles.innerHTML = "";

        for (let i = 0; i < 18; i++) {

            const particle =
                document.createElement("span");

            particle.style.position =
                "absolute";

            particle.style.width =
                (3 + Math.random() * 5) + "px";

            particle.style.height =
                particle.style.width;

            particle.style.borderRadius =
                "50%";

            particle.style.background =
                "rgba(204,52,104,.35)";

            particle.style.left =
                Math.random() * 100 + "%";

            particle.style.top =
                Math.random() * 100 + "%";

            particle.style.animation =
                "memoryParticleFloat " +
                (3 + Math.random() * 4) +
                "s ease-in-out infinite";

            particle.style.animationDelay =
                Math.random() * 2 + "s";

            calculationParticles.appendChild(
                particle
            );
        }
    }


    /* =====================================================
       13. RECOVERY
       ===================================================== */

    function startRecoveryPhase() {

        overloadRunning = false;

        if (recoveryRunning) return;

        recoveryRunning = true;

        console.log(
            "Memories Part 3: Recovery started."
        );

        showPart3Phase(recoveryPhase);

        resetRecovery();

        startRecoveryProgress();

        startWeakHeartbeat();
    }


    /* =====================================================
       14. RESET RECOVERY
       ===================================================== */

    function resetRecovery() {

        recoveryValue = 0;

        recoveryProgress.style.width =
            "0%";

        recoveryPercentage.textContent =
            "0%";

        recoveryText.textContent =
            "Attempting recovery......";

        recoveryStatus.textContent =
            "System damaged. Trying to restore the memory archive...";
    }


    /* =====================================================
       15. RECOVERY PROGRESS
       ===================================================== */

    function startRecoveryProgress() {

        if (recoveryInterval) {

            clearInterval(
                recoveryInterval
            );
        }

        recoveryValue = 0;

        recoveryInterval =
            setInterval(() => {

                recoveryValue += 1;

                recoveryProgress.style.width =
                    recoveryValue + "%";

                recoveryPercentage.textContent =
                    recoveryValue + "%";


                if (recoveryValue < 30) {

                    recoveryText.textContent =
                        "Attempting recovery......";

                    recoveryStatus.textContent =
                        "Reconnecting damaged memory sectors...";

                } else if (recoveryValue < 60) {

                    recoveryText.textContent =
                        "Restoring memories......";

                    recoveryStatus.textContent =
                        "Recovering lost fragments...";

                } else if (recoveryValue < 85) {

                    recoveryText.textContent =
                        "Rebuilding archive......";

                    recoveryStatus.textContent =
                        "Almost recovered...";

                } else if (recoveryValue < 100) {

                    recoveryText.textContent =
                        "Finalizing recovery......";

                    recoveryStatus.textContent =
                        "Stabilizing the memory archive...";

                }


                if (recoveryValue >= 100) {

                    recoveryValue = 100;

                    recoveryProgress.style.width =
                        "100%";

                    recoveryPercentage.textContent =
                        "100%";

                    clearInterval(
                        recoveryInterval
                    );

                    recoveryInterval = null;

                    finishRecovery();
                }

            }, 110);
    }


    /* =====================================================
       16. WEAK HEARTBEAT DURING RECOVERY
       ===================================================== */

    function startWeakHeartbeat() {

        if (!heartbeatSound) return;

        heartbeatSound.pause();

        heartbeatSound.currentTime = 0;

        heartbeatSound.loop = true;

        heartbeatSound.volume = 0.18;

        const playPromise =
            heartbeatSound.play();

        if (
            playPromise &&
            typeof playPromise.catch === "function"
        ) {

            playPromise.catch(() => {});
        }
    }


    /* =====================================================
       17. RECOVERY FINISHED
       ===================================================== */

    function finishRecovery() {

        recoveryValue = 100;

        recoveryText.textContent =
            "Recovery successful";

        recoveryStatus.textContent =
            "A memory archive has been found";


        if (heartbeatSound) {

            heartbeatSound.volume = 0.32;
        }


        console.log(
            "Memories Part 3 complete: Recovery successful."
        );
    }


    /* =====================================================
       18. GLOBAL CONNECTION
       ===================================================== */

    window.startOverloadPhase =
        startOverloadPhase;


    /* =====================================================
       19. CLEANUP
       ===================================================== */

    window.addEventListener(
        "beforeunload",
        () => {

            if (calculationInterval) {

                clearInterval(
                    calculationInterval
                );

                calculationInterval = null;
            }

            if (recoveryInterval) {

                clearInterval(
                    recoveryInterval
                );

                recoveryInterval = null;
            }

            if (heartbeatSound) {

                heartbeatSound.pause();
            }

            if (systemSound) {

                systemSound.pause();
            }
        }
    );


    console.log(
        "Memories Part 3 loaded successfully."
    );

})();