const countdown = new Date(Date.parse(new Date()) + 11 * 1000);

const days = document.querySelector(".days").querySelector(".flip-card");
const hours = document.querySelector(".hours").querySelector(".flip-card");
const minutes = document.querySelector(".minutes").querySelector(".flip-card");
const seconds = document.querySelector(".seconds").querySelector(".flip-card");

function getTimeRemaining(countdown) {
    const now = new Date();
    const diff = countdown - now;

    if (diff <= 0) {
        return {
            diff: 0,
            days: 0,
            hours: 0,
            minutes: 0,
            seconds: 0
        };
    }

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor(diff / (1000 * 60 * 60) % 24);
    const minutes = Math.floor(diff / 1000 / 60 % 60);
    const seconds = Math.floor(diff / 1000 % 60);

    return {
        diff,
        days,
        hours,
        minutes,
        seconds
    };

}

function initializeClock(countdown) {
    function updateClock() {
        const t = getTimeRemaining(countdown);
        addFlip(days, t.days);
        addFlip(hours, t.hours);
        addFlip(minutes, t.minutes);
        addFlip(seconds, t.seconds);

        if (t.diff <= 0) {
            clearInterval(timeinterval);
            startCinematicTransition();
        }
    }

    updateClock();
    const timeinterval = setInterval(updateClock, 1000);
}

function startCinematicTransition() {
    const main = document.querySelector('main');
    const footer = document.querySelector('footer');
    const h1 = document.querySelector('h1');

    main.style.transition = 'opacity 1s ease';
    footer.style.transition = 'opacity 1s ease';
    h1.style.transition = 'opacity 1s ease';

    main.style.opacity = '0';
    footer.style.opacity = '0';
    h1.style.opacity = '0';

    setTimeout(() => {
        main.style.display = 'none';
        footer.style.display = 'none';
        h1.style.display = 'none';

        const textContainer = document.createElement('div');
        textContainer.style.position = 'fixed';
        textContainer.style.top = '0';
        textContainer.style.left = '0';
        textContainer.style.width = '100%';
        textContainer.style.height = '100%';
        textContainer.style.display = 'flex';
        textContainer.style.justifyContent = 'center';
        textContainer.style.alignItems = 'center';
        textContainer.style.zIndex = '1000';

        const text = document.createElement('h1');
        text.innerText = "Hanford Coding Club Presents";
        text.style.color = 'white';
        text.style.fontFamily = "'Red Hat Text', sans-serif";
        text.style.fontSize = '3rem';
        text.style.letterSpacing = '5px';
        text.style.textTransform = 'uppercase';
        text.style.opacity = '0';
        text.style.transition = 'opacity 2s ease-in-out';
        text.style.margin = '0'; 

        textContainer.appendChild(text);
        document.body.appendChild(textContainer);

        void text.offsetWidth;
        text.style.opacity = '1';

        setTimeout(async () => {
            document.documentElement.style.backgroundColor = 'black'; 
            document.body.style.transition = 'opacity 2s ease-in-out';
            document.body.style.opacity = '0';

            try {
                const response = await fetch('index.html');
                const html = await response.text();

                setTimeout(() => {
                    window.history.pushState({}, "", "index.html");

                    const parser = new DOMParser();
                    const doc = parser.parseFromString(html, 'text/html');

                    document.head.innerHTML = doc.head.innerHTML;

                    document.body.style = ''; 
                    document.body.style.opacity = '0'; 
                    document.documentElement.style.backgroundColor = ''; 

                    document.body.innerHTML = doc.body.innerHTML;
                    document.body.className = doc.body.className;

                    requestAnimationFrame(() => {
                        document.body.style.transition = 'opacity 1s ease-in-out';
                        document.body.style.opacity = '1';

                        setTimeout(() => {
                            document.body.style.transition = '';
                            document.body.style.opacity = '';
                        }, 1000);
                    });

                    const scripts = document.body.querySelectorAll('script');
                    scripts.forEach(oldScript => {
                        const newScript = document.createElement('script');
                        Array.from(oldScript.attributes).forEach(attr => newScript.setAttribute(attr.name, attr.value));
                        if (oldScript.innerHTML) newScript.innerHTML = oldScript.innerHTML;
                        oldScript.parentNode.replaceChild(newScript, oldScript);
                    });

                }, 2000); 

            } catch (e) {
                console.error("Failed to load content", e);
            }
        }, 3000); 

    }, 1000);
}

const addFlip = (card, time) => {
    const currTime = card.querySelector(".top-half").innerText;
    if (time == currTime) return;

    let t = time <= 9 ? `0${time}` : time;
    const topHalf = card.querySelector(".top-half");
    const bottomHalf = card.querySelector(".bottom-half");
    const topFlip = document.createElement("div");
    const bottomFlip = document.createElement("div");

    topFlip.classList.add("top-flip");
    topFlip.innerText = currTime;

    bottomFlip.classList.add("bottom-flip");

    topFlip.addEventListener("animationstart", () => {
        topHalf.innerText = t;
    });

    topFlip.addEventListener("animationend", () => {
        topFlip.remove();
        bottomFlip.innerText = t;
    });

    bottomFlip.addEventListener("animationend", () => {
        bottomHalf.innerText = t;
        bottomFlip.remove();
    });

    card.appendChild(topFlip);
    card.appendChild(bottomFlip);
};

initializeClock(countdown);