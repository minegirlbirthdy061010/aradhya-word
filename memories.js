/* =========================================================
   ARADHYA'S WORLD
   PART 3 — PREMIUM MEMORY ARCHIVE
   ========================================================= */


/* =========================================================
   SCREEN REFERENCES
   ========================================================= */

const screens = {

    collecting:
        document.getElementById("collectingScreen"),

    leak:
        document.getElementById("memoryLeakScreen"),

    fixing:
        document.getElementById("fixingScreen"),

    analysing:
        document.getElementById("analysingScreen"),

    crash:
        document.getElementById("crashScreen"),

    recovery:
        document.getElementById("recoveryScreen"),

    success:
        document.getElementById("successScreen"),

    albumCover:
        document.getElementById("albumCoverScreen"),

    album:
        document.getElementById("albumScreen")
};


function showScreen(screen){

    Object.values(screens).forEach(item => {
        item.classList.remove("active");
    });

    screen.classList.add("active");
}


/* =========================================================
   AUDIO ENGINE
   ========================================================= */

let audioContext = null;

let masterGain = null;
let musicGain = null;
let heartbeatGain = null;
let effectsGain = null;

let musicStarted = false;
let musicTimer = null;

let heartbeatTimer = null;

let audioReady = false;


function initAudio(){

    if(audioContext) return;

    const AudioContext =
        window.AudioContext ||
        window.webkitAudioContext;

    if(!AudioContext) return;

    audioContext = new AudioContext();

    masterGain =
        audioContext.createGain();

    musicGain =
        audioContext.createGain();

    heartbeatGain =
        audioContext.createGain();

    effectsGain =
        audioContext.createGain();


    masterGain.gain.value = 0.55;

    musicGain.gain.value = 0.0001;

    heartbeatGain.gain.value = 0.0001;

    effectsGain.gain.value = 0.22;


    musicGain.connect(masterGain);
    heartbeatGain.connect(masterGain);
    effectsGain.connect(masterGain);

    masterGain.connect(
        audioContext.destination
    );

    audioReady = true;
}


async function unlockAudio(){

    initAudio();

    if(!audioContext) return;

    if(audioContext.state === "suspended"){

        try{
            await audioContext.resume();
        }catch(error){}
    }

    startPremiumMusic();
}


/* =========================================================
   MUSIC
   ========================================================= */

const melody = [

    [261.63, .55],
    [329.63, .55],
    [392.00, .75],
    [329.63, .55],

    [293.66, .55],
    [349.23, .55],
    [440.00, .8],
    [349.23, .55],

    [261.63, .55],
    [329.63, .55],
    [392.00, .7],
    [523.25, .9],

    [440.00, .6],
    [392.00, .6],
    [329.63, .7],
    [293.66, .8]

];


let melodyIndex = 0;


function playTone(
    frequency,
    duration,
    destination,
    volume,
    type = "sine",
    startTime = audioContext.currentTime
){

    if(!audioContext) return;

    const oscillator =
        audioContext.createOscillator();

    const gain =
        audioContext.createGain();

    oscillator.type = type;

    oscillator.frequency.setValueAtTime(
        frequency,
        startTime
    );

    gain.gain.setValueAtTime(
        0.0001,
        startTime
    );

    gain.gain.exponentialRampToValueAtTime(
        volume,
        startTime + .04
    );

    gain.gain.exponentialRampToValueAtTime(
        0.0001,
        startTime + duration
    );

    oscillator.connect(gain);
    gain.connect(destination);

    oscillator.start(startTime);
    oscillator.stop(startTime + duration + .05);
}


function scheduleMusic(){

    if(!audioContext || !musicStarted)
        return;

    const [frequency,duration] =
        melody[melodyIndex];

    const now =
        audioContext.currentTime + .05;


    /* main soft piano */

    playTone(
        frequency,
        duration,
        musicGain,
        .045,
        "triangle",
        now
    );


    /* warm upper harmonic */

    playTone(
        frequency * 2,
        duration * .72,
        musicGain,
        .012,
        "sine",
        now + .08
    );


    /* subtle fifth */

    playTone(
        frequency * 1.5,
        duration * .45,
        musicGain,
        .008,
        "sine",
        now + .22
    );


    melodyIndex++;

    if(melodyIndex >= melody.length)
        melodyIndex = 0;


    musicTimer =
        setTimeout(
            scheduleMusic,
            duration * 1000
        );
}


function startPremiumMusic(){

    if(!audioContext || musicStarted)
        return;

    musicStarted = true;

    musicGain.gain.cancelScheduledValues(
        audioContext.currentTime
    );

    musicGain.gain.setValueAtTime(
        .0001,
        audioContext.currentTime
    );

    musicGain.gain.exponentialRampToValueAtTime(
        .12,
        audioContext.currentTime + 3
    );

    scheduleMusic();
}


function fadeMusic(target, duration = 2){

    if(!audioContext || !musicGain)
        return;

    musicGain.gain.cancelScheduledValues(
        audioContext.currentTime
    );

    musicGain.gain.setTargetAtTime(
        Math.max(target,.0001),
        audioContext.currentTime,
        duration / 3
    );
}


/* =========================================================
   SOUND EFFECTS
   ========================================================= */

function playNoise(
    duration = .15,
    volume = .05
){

    if(!audioContext) return;

    const buffer =
        audioContext.createBuffer(
            1,
            audioContext.sampleRate * duration,
            audioContext.sampleRate
        );

    const data =
        buffer.getChannelData(0);

    for(let i = 0; i < data.length; i++){

        data[i] =
            Math.random() * 2 - 1;
    }

    const source =
        audioContext.createBufferSource();

    const gain =
        audioContext.createGain();

    source.buffer = buffer;

    gain.gain.setValueAtTime(
        volume,
        audioContext.currentTime
    );

    gain.gain.exponentialRampToValueAtTime(
        .0001,
        audioContext.currentTime + duration
    );

    source.connect(gain);
    gain.connect(effectsGain);

    source.start();
}


function softBeep(){

    if(!audioContext) return;

    playTone(
        660,
        .08,
        effectsGain,
        .035,
        "sine"
    );
}


function typewriterTick(){

    if(!audioContext) return;

    playTone(
        900 + Math.random() * 250,
        .035,
        effectsGain,
        .018,
        "square"
    );
}


function systemBeep(){

    if(!audioContext) return;

    playTone(
        740,
        .12,
        effectsGain,
        .045,
        "sine"
    );
}


/* =========================================================
   HEARTBEAT
   ========================================================= */

function heartbeatSound(
    intensity = 1
){

    if(!audioContext) return;

    const now =
        audioContext.currentTime;


    playTone(
        75,
        .13,
        heartbeatGain,
        .16 * intensity,
        "sine",
        now
    );


    playTone(
        58,
        .17,
        heartbeatGain,
        .12 * intensity,
        "sine",
        now + .16
    );
}


function startHeartbeat(
    interval = 900,
    intensity = 1
){

    stopHeartbeat();

    heartbeatSound(intensity);

    heartbeatTimer =
        setInterval(
            () => heartbeatSound(intensity),
            interval
        );
}


function stopHeartbeat(){

    if(heartbeatTimer){

        clearInterval(
            heartbeatTimer
        );

        heartbeatTimer = null;
    }
}


/* =========================================================
   FLATLINE
   ========================================================= */

function flatlineSound(){

    if(!audioContext) return;

    stopHeartbeat();

    fadeMusic(.0001);


    const oscillator =
        audioContext.createOscillator();

    const gain =
        audioContext.createGain();

    oscillator.type = "sine";

    oscillator.frequency.value = 880;

    gain.gain.setValueAtTime(
        .0001,
        audioContext.currentTime
    );

    gain.gain.exponentialRampToValueAtTime(
        .12,
        audioContext.currentTime + .12
    );

    gain.gain.setValueAtTime(
        .12,
        audioContext.currentTime + .8
    );

    gain.gain.exponentialRampToValueAtTime(
        .0001,
        audioContext.currentTime + 1.8
    );

    oscillator.connect(gain);
    gain.connect(effectsGain);

    oscillator.start();

    oscillator.stop(
        audioContext.currentTime + 2
    );
}


/* =========================================================
   BACKGROUND PARTICLES
   ========================================================= */

function createDust(){

    const layer =
        document.getElementById(
            "memoryDustLayer"
        );

    for(let i = 0; i < 55; i++){

        const dust =
            document.createElement("div");

        dust.className =
            "memory-dust";

        dust.style.left =
            Math.random() * 100 + "%";

        dust.style.top =
            50 + Math.random() * 55 + "%";

        dust.style.animationDuration =
            (7 + Math.random() * 10) + "s";

        dust.style.animationDelay =
            (-Math.random() * 12) + "s";

        layer.appendChild(dust);
    }
}


function createParticles(){

    const layer =
        document.getElementById(
            "particleLayer"
        );

    for(let i = 0; i < 35; i++){

        const particle =
            document.createElement("div");

        particle.className =
            "background-particle";

        particle.style.left =
            Math.random() * 100 + "%";

        particle.style.top =
            100 + Math.random() * 30 + "%";

        particle.style.animationDuration =
            (8 + Math.random() * 12) + "s";

        particle.style.animationDelay =
            (-Math.random() * 12) + "s";

        layer.appendChild(particle);
    }
}


function createBokeh(){

    const layer =
        document.getElementById(
            "bokehLayer"
        );

    for(let i = 0; i < 12; i++){

        const bokeh =
            document.createElement("div");

        bokeh.className =
            "bokeh";

        bokeh.style.left =
            Math.random() * 100 + "%";

        bokeh.style.top =
            Math.random() * 100 + "%";

        bokeh.style.animationDelay =
            (-Math.random() * 14) + "s";

        bokeh.style.animationDuration =
            (10 + Math.random() * 10) + "s";

        layer.appendChild(bokeh);
    }
}


/* =========================================================
   TOUCH SPARKS
   ========================================================= */

document.addEventListener(
    "pointerdown",
    event => {

        unlockAudio();

        const spark =
            document.createElement("div");

        spark.className =
            "touch-spark";

        spark.style.left =
            event.clientX + "px";

        spark.style.top =
            event.clientY + "px";

        document.body.appendChild(
            spark
        );

        setTimeout(
            () => spark.remove(),
            700
        );
    },
    {passive:true}
);


/* =========================================================
   MAIN LOADING
   ========================================================= */

let mainProgress = 1;

const mainProgressBar =
    document.getElementById(
        "mainProgress"
    );

const mainPercentage =
    document.getElementById(
        "mainPercentage"
    );

const loadingStatus =
    document.getElementById(
        "loadingStatus"
    );


const loadingMessages = [

    "Initialising memory archive...",

    "Searching old memories...",

    "Scanning precious moments...",

    "Finding little things...",

    "Collecting smiles...",

    "Recovering forgotten moments...",

    "Synchronising memories...",

    "Almost there..."

];


let messageIndex = 0;


function runMainLoading(){

    const timer =
        setInterval(() => {

            if(mainProgress >= 70){

                clearInterval(timer);

                setTimeout(
                    startMemoryLeak,
                    1400
                );

                return;
            }


            /* slower premium progression */

            let increment = 1;

            if(mainProgress < 20){

                increment =
                    Math.random() < .10
                    ? 0
                    : 1;

            }else if(mainProgress < 50){

                increment =
                    Math.random() < .08
                    ? 0
                    : 1;

            }else{

                increment =
                    Math.random() < .12
                    ? 0
                    : 1;
            }


            mainProgress += increment;

            if(mainProgress > 70)
                mainProgress = 70;


            mainProgressBar.style.width =
                mainProgress + "%";

            mainPercentage.textContent =
                mainProgress;


            if(
                mainProgress % 7 === 0 ||
                Math.random() < .12
            ){

                messageIndex =
                    (messageIndex + 1)
                    % loadingMessages.length;

                loadingStatus.textContent =
                    loadingMessages[
                        messageIndex
                    ];

                typewriterTick();
            }

        }, 400);
}


/* =========================================================
   MEMORY FRAGMENTS
   ========================================================= */

const memoryFragments = [

    "that smile...",
    "that call...",
    "that one night...",
    "the first time I saw you...",
    "that little conversation...",
    "your voice...",
    "that photo...",
    "that laugh...",
    "remember this? ❤️",
    "2 July...",
    "8:30 PM...",
    "our little moments...",
    "that secret memory...",
    "you & me...",
    "one more memory...",
    "don't forget this...",
    "that beautiful day...",
    "another memory found...",
    "still remember this...",
    "precious memory...",
    "the way you smiled...",
    "that tiny moment...",
    "something worth remembering...",
    "this one stayed..."
];


let fragmentIndex = 0;
let fragmentTimer = null;


function randomFragment(){

    return memoryFragments[
        fragmentIndex++ %
        memoryFragments.length
    ];
}


function createMemoryFragment(){

    const fragment =
        document.createElement("div");

    fragment.className =
        "memory-fragment";


    if(Math.random() < .25)
        fragment.classList.add("deep");

    if(Math.random() < .3)
        fragment.classList.add("front");


    fragment.textContent =
        randomFragment();


    const vw =
        window.innerWidth;

    const vh =
        window.innerHeight;


    /*
       Start WELL outside the screen.
       Then fly through the screen.
    */

    const side =
        Math.floor(
            Math.random() * 4
        );


    let startX;
    let startY;

    let endX;
    let endY;


    const centerX =
        vw * (.25 + Math.random() * .5);

    const centerY =
        vh * (.25 + Math.random() * .5);


    if(side === 0){

        startX =
            -220 - Math.random() * 350;

        startY =
            Math.random() * vh;

        endX =
            centerX;

        endY =
            centerY;

    }else if(side === 1){

        startX =
            vw + 220 + Math.random() * 350;

        startY =
            Math.random() * vh;

        endX =
            centerX;

        endY =
            centerY;

    }else if(side === 2){

        startX =
            Math.random() * vw;

        startY =
            -180 - Math.random() * 300;

        endX =
            centerX;

        endY =
            centerY;

    }else{

        startX =
            Math.random() * vw;

        startY =
            vh + 180 + Math.random() * 300;

        endX =
            centerX;

        endY =
            centerY;
    }


    const rotateStart =
        -30 + Math.random() * 60;

    const rotateMid =
        -20 + Math.random() * 40;

    const rotateEnd =
        -35 + Math.random() * 70;


    const duration =
        2400 + Math.random() * 2500;


    fragment.style.left =
        startX + "px";

    fragment.style.top =
        startY + "px";

    fragment.style.transform =
        `rotate(${rotateStart}deg) scale(.75)`;


    document.body.appendChild(
        fragment
    );


    requestAnimationFrame(() => {

        fragment.style.transition =
            `transform ${duration}ms cubic-bezier(.15,.65,.2,1),
             opacity ${duration * .25}ms ease`;

        fragment.style.opacity =
            "1";

        fragment.style.transform =
            `translate(
                ${endX - startX}px,
                ${endY - startY}px
             )
             rotate(${rotateMid}deg)
             scale(${.9 + Math.random() * .25})`;

    });


    setTimeout(() => {

        fragment.style.transition =
            `transform ${duration * .45}ms cubic-bezier(.7,.1,.9,.3),
             opacity ${duration * .4}ms ease`;

        fragment.style.transform =
            `translate(
                ${endX - startX + (
                    Math.random() * 500 - 250
                )}px,
                ${endY - startY + (
                    Math.random() * 500 - 250
                )}px
             )
             rotate(${rotateEnd}deg)
             scale(.5)`;

        fragment.style.opacity =
            "0";

    }, duration * .58);


    setTimeout(
        () => fragment.remove(),
        duration * 1.15
    );
}


/* =========================================================
   MEMORY LEAK
   ========================================================= */

let leakProgress = 70;

function startMemoryLeak(){

    showScreen(
        screens.leak
    );


    leakProgress = 70;


    const bar =
        document.getElementById(
            "leakProgress"
        );

    const percentage =
        document.getElementById(
            "leakPercentage"
        );

    const status =
        document.getElementById(
            "leakStatus"
        );


    fragmentTimer =
        setInterval(() => {

            /*
               MANY fragments.
               They come from outside screen.
            */

            const amount =
                2 + Math.floor(
                    Math.random() * 3
                );

            for(let i = 0; i < amount; i++){

                setTimeout(
                    createMemoryFragment,
                    i * 100
                );
            }

        }, 420);


    const timer =
        setInterval(() => {

            leakProgress +=
                Math.random() < .25
                ? 0
                : 1;


            if(leakProgress > 90)
                leakProgress = 90;


            bar.style.width =
                leakProgress + "%";

            percentage.textContent =
                leakProgress;


            if(leakProgress >= 78){

                status.textContent =
                    "Memories are escaping faster...";

            }

            if(leakProgress >= 84){

                status.textContent =
                    "Archive integrity falling...";

            }

            if(leakProgress >= 89){

                status.textContent =
                    "Containment almost lost...";

            }


            softBeep();


            if(leakProgress >= 90){

                clearInterval(timer);

                if(fragmentTimer){

                    clearInterval(
                        fragmentTimer
                    );

                    fragmentTimer = null;
                }


                setTimeout(
                    startFixing,
                    1800
                );
            }

        }, 600);
}


/* =========================================================
   FIXING 80 → 100
   ========================================================= */

function startFixing(){

    showScreen(
        screens.fixing
    );


    let progress = 80;


    const bar =
        document.getElementById(
            "fixProgress"
        );

    const percentage =
        document.getElementById(
            "fixPercentage"
        );

    const status =
        document.getElementById(
            "heartbeatStatus"
        );

    const text =
        document.getElementById(
            "fixingText"
        );


    startHeartbeat(
        1050,
        .35
    );


    const timer =
        setInterval(() => {

            progress += 1;


            bar.style.width =
                progress + "%";

            percentage.textContent =
                progress;


            /*
               Heartbeat continuously grows.
            */

            const intensity =
                .35 +
                ((progress - 80) / 20)
                * 1.25;


            const interval =
                1050 -
                ((progress - 80) * 20);


            startHeartbeat(
                Math.max(650,interval),
                intensity
            );


            if(progress < 86){

                status.textContent =
                    "Heartbeat returning...";

                text.textContent =
                    "Trying to reconnect memory core...";

            }else if(progress < 93){

                status.textContent =
                    "Heartbeat getting stronger...";

                text.textContent =
                    "Recovering precious memory data...";

            }else{

                status.textContent =
                    "Memory core responding...";

                text.textContent =
                    "Almost recovered...";

            }


            if(progress >= 100){

                clearInterval(timer);

                stopHeartbeat();

                setTimeout(
                    startAnalysis,
                    1200
                );
            }

        }, 650);
}


/* =========================================================
   ANALYSIS
   ========================================================= */

function startAnalysis(){

    showScreen(
        screens.analysing
    );


    const main =
        document.getElementById(
            "analysisMainText"
        );

    const sub =
        document.getElementById(
            "analysisSubText"
        );


    const stages = [

        [
            "Analysing...",
            "Searching through memory data..."
        ],

        [
            "Calculating...",
            "Trying to measure the number of memories..."
        ],

        [
            "Processing...",
            "Processing every little moment..."
        ]

    ];


    let index = 0;


    function nextStage(){

        main.textContent =
            stages[index][0];

        sub.textContent =
            stages[index][1];

        typewriterTick();

        index++;


        if(index < stages.length){

            setTimeout(
                nextStage,
                2600
            );

        }else{

            setTimeout(
                startCrash,
                3000
            );
        }
    }


    nextStage();
}


/* =========================================================
   CRASH
   ========================================================= */

function startCrash(){

    showScreen(
        screens.crash
    );


    stopHeartbeat();

    flatlineSound();


    const crash =
        document.getElementById(
            "crashScreen"
        );

    crash.classList.add(
        "glitching"
    );


    document.getElementById(
        "screenFlash"
    ).classList.add(
        "flash"
    );


    setTimeout(() => {

        crash.classList.remove(
            "glitching"
        );

    },1800);


    setTimeout(
        startRecovery,
        5200
    );
}


/* =========================================================
   RECOVERY
   ========================================================= */

function startRecovery(){

    showScreen(
        screens.recovery
    );


    let progress = 0;


    const bar =
        document.getElementById(
            "recoveryProgress"
        );

    const percentage =
        document.getElementById(
            "recoveryPercentage"
        );

    const status =
        document.getElementById(
            "recoveryStatus"
        );

    const heart =
        document.getElementById(
            "recoveryHeartbeat"
        );


    fadeMusic(.025);


    let heartbeatInterval =
        null;


    function revivalBeat(){

        heartbeatSound(
            .15 +
            (progress / 100) * .65
        );


        heart.style.opacity =
            (.18 +
            (progress / 100) * .75)
            .toFixed(2);


        heart.style.transform =
            `scale(
                ${1 +
                (progress / 100) * .15}
            )`;
    }


    revivalBeat();


    heartbeatInterval =
        setInterval(
            revivalBeat,
            1450
        );


    const timer =
        setInterval(() => {

            /*
               Slow recovery.
            */

            progress +=
                Math.random() < .25
                ? 0
                : 1;


            if(progress > 100)
                progress = 100;


            bar.style.width =
                progress + "%";

            percentage.textContent =
                progress;


            if(progress < 20){

                status.textContent =
                    "No response...";

            }else if(progress < 40){

                status.textContent =
                    "Searching for surviving memories...";

            }else if(progress < 65){

                status.textContent =
                    "A weak signal has returned...";

            }else if(progress < 85){

                status.textContent =
                    "Memory core responding...";

            }else{

                status.textContent =
                    "Restoring archive integrity...";

            }


            if(progress >= 100){

                clearInterval(timer);

                clearInterval(
                    heartbeatInterval
                );

                heartbeatSound(1);

                setTimeout(
                    () => showSuccess(),
                    1300
                );
            }

        }, 250);
}


/* =========================================================
   SUCCESS
   ========================================================= */

function showSuccess(){

    showScreen(
        screens.success
    );


    fadeMusic(.035);

    heartbeatSound(1);

}


/* =========================================================
   ARCHIVE BUTTON
   ========================================================= */

document.getElementById(
    "openArchiveButton"
).addEventListener(
    "click",
    () => {

        unlockAudio();

        stopHeartbeat();

        fadeMusic(.06);


        showScreen(
            screens.albumCover
        );

        softBeep();
    }
);


/* =========================================================
   ALBUM
   ========================================================= */

const albumData = [

    {
        photos:[
            "memory-01.jpg",
            "memory-02.jpg",
            "memory-03.jpg",
            "memory-04.jpg"
        ],

        quote:
            "Some memories don't need words. They simply stay. 🤍"
    },

    {
        photos:[
            "memory-05.jpg",
            "memory-06.jpg",
            "memory-07.jpg",
            "memory-08.jpg"
        ],

        quote:
            "Out of all the little moments, somehow these became our favourites. ✨"
    },

    {
        photos:[
            "memory-09.jpg",
            "memory-10.jpg",
            "memory-11.jpg",
            "memory-12.jpg"
        ],

        quote:
            "A picture freezes a moment, but the feeling stays alive. 🌸"
    },

    {
        photos:[
            "memory-13.jpg",
            "memory-14.jpg",
            "memory-15.jpg",
            "memory-16.jpg"
        ],

        quote:
            "Somewhere between ordinary days, we created something unforgettable. 💞"
    },

    {
        photos:[
            "memory-17.jpg",
            "memory-18.jpg",
            "memory-19.jpg",
            "memory-20.jpg"
        ],

        quote:
            "If memories could speak, I think ours would have a lot to say. 🫀"
    },

    {
        photos:[
            "memory-21.jpg",
            "memory-22.jpg",
            "memory-23.jpg",
            "memory-24.jpg"
        ],

        quote:
            "And this is only a few pages of everything still waiting to be remembered. ❤️"
    }

];


let currentPage = 0;


const albumPage =
    document.getElementById(
        "albumPage"
    );

const currentPageText =
    document.getElementById(
        "currentPage"
    );

const pageNumberLabel =
    document.getElementById(
        "pageNumberLabel"
    );

const pageQuote =
    document.getElementById(
        "pageQuote"
    );

const nextButton =
    document.getElementById(
        "nextPageButton"
    );

const previousButton =
    document.getElementById(
        "previousPageButton"
    );


document.getElementById(
    "totalPages"
).textContent =
    albumData.length;


function updateAlbum(){

    const data =
        albumData[currentPage];


    const photos = [

        document.getElementById("photo1"),

        document.getElementById("photo2"),

        document.getElementById("photo3"),

        document.getElementById("photo4")

    ];


    photos.forEach(
        (photo,index) => {

            const frame =
                photo.parentElement;

            photo.style.display =
                "block";


            photo.onload = () => {

                frame.classList.add(
                    "has-photo"
                );
            };


            photo.onerror = () => {

                photo.style.display =
                    "none";

                frame.classList.remove(
                    "has-photo"
                );
            };


            photo.src =
                data.photos[index];

        }
    );


    currentPageText.textContent =
        currentPage + 1;

    pageNumberLabel.textContent =
        String(
            currentPage + 1
        ).padStart(2,"0");


    pageQuote.textContent =
        data.quote;


    previousButton.disabled =
        currentPage === 0;

    nextButton.disabled = false;
}


/* =========================================================
   OPEN ALBUM
   ========================================================= */

document.getElementById(
    "openAlbumButton"
).addEventListener(
    "click",
    () => {

        unlockAudio();

        fadeMusic(.11);

        showScreen(
            screens.album
        );

        currentPage = 0;

        updateAlbum();

        softBeep();
    }
);


/* =========================================================
   NEXT PAGE
   ========================================================= */

nextButton.addEventListener(
    "click",
    () => {

        if (currentPage >= albumData.length - 1) {

            const albumEnding =
                document.getElementById("albumEnding");

            if (albumEnding) {

                albumEnding.classList.add("show");

            }

            softBeep();

            return;
        }

        albumPage.classList.remove(
            "turn-next",
            "turn-prev"
        );

        void albumPage.offsetWidth;

        albumPage.classList.add(
            "turn-next"
        );

        setTimeout(() => {

            currentPage++;

            updateAlbum();

        }, 320);

        softBeep();
    }
);


/* =========================================================
   PREVIOUS PAGE
   ========================================================= */

nextButton.addEventListener(
    "click",
    () => {

        if (currentPage >= albumData.length - 1) {

            const albumEnding =
                document.getElementById("albumEnding");

            if (albumEnding) {

                albumEnding.classList.add("show");

            }

            softBeep();

            return;
        }

        albumPage.classList.remove(
            "turn-next",
            "turn-prev"
        );

        void albumPage.offsetWidth;

        albumPage.classList.add(
            "turn-next"
        );

        setTimeout(() => {

            currentPage++;

            updateAlbum();

        }, 320);

        softBeep();
    }
);


/* =========================================================
   ALBUM BACK / HOME
   ========================================================= */

document.getElementById(
    "albumBackButton"
).addEventListener(
    "click",
    () => {

        showScreen(
            screens.albumCover
        );

        fadeMusic(.055);

        softBeep();
    }
);


document.getElementById(
    "albumHomeButton"
).addEventListener(
    "click",
    () => {

        showScreen(
            screens.albumCover
        );

        fadeMusic(.055);

        softBeep();
    }
);


/* =========================================================
   SWIPE
   ========================================================= */

let touchStartX = 0;
let touchEndX = 0;


albumPage.addEventListener(
    "touchstart",
    event => {

        touchStartX =
            event.changedTouches[0].screenX;
    },
    {passive:true}
);


albumPage.addEventListener(
    "touchend",
    event => {

        touchEndX =
            event.changedTouches[0].screenX;

        const difference =
            touchEndX - touchStartX;


        if(Math.abs(difference) < 50)
            return;


        if(difference < 0){

            nextButton.click();

        }else{

            previousButton.click();
        }
    },
    {passive:true}
);


/* =========================================================
   IMAGE DRAG PREVENTION
   ========================================================= */

document.addEventListener(
    "dragstart",
    event => {

        if(
            event.target.tagName ===
            "IMG"
        ){

            event.preventDefault();
        }
    }
);


/* =========================================================
   START
   ========================================================= */

createDust();
createParticles();
createBokeh();

showScreen(
    screens.collecting
);


/*
   Browser autoplay protection:
   the first user touch unlocks audio.
*/

setTimeout(
    () => {

        unlockAudio();

        runMainLoading();

    },
    900
);


/* initial album state */

updateAlbum();


/* =========================================================
   PART 3 → PART 4 CONNECTION
========================================================= */

const continueToBirthday =
    document.getElementById("continueToBirthday");

if (continueToBirthday) {

    continueToBirthday.addEventListener(
        "click",
        () => {

            window.location.href =
                "birthday.html";

        }
    );
}
