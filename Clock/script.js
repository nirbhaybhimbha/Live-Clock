(function () {
    // Build ticks (60 around the dial)
    const ticksContainer = document.getElementById('ticks');
    for (let i = 0; i < 60; i++) {
        const t = document.createElement('div');
        t.className = 'tick' + (i % 5 === 0 ? ' major' : '');
        const angle = i * 6; // 360/60
        t.style.transform = `rotate(${angle}deg) translate(-50%, 0)`;
        ticksContainer.appendChild(t);
    }

    const elHour = document.getElementById('hour');
    const elMinute = document.getElementById('minute');
    const elSecond = document.getElementById('second');
    const elTime = document.getElementById('time');
    const elDate = document.getElementById('date');
    const elZone = document.getElementById('zone');
    const elAMPM = document.getElementById('ampm');
    const elPhase = document.getElementById('dayphase');
    const card = document.getElementById('card');

    // Format helpers
    const pad = (n) => String(n).padStart(2, '0');
    const month = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const weekday = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

    // Theme: day/night
    function computePhase(h) {
        if (h >= 5 && h < 11) return "Morning";
        if (h >= 11 && h < 17) return "Afternoon";
        if (h >= 17 && h < 21) return "Evening";
        return "Night";
    }

    // Smooth animation with requestAnimationFrame (true sweep seconds)
    function tick() {
        const now = new Date();
        const ms = now.getMilliseconds();
        const s = now.getSeconds() + ms / 1000;
        const m = now.getMinutes() + s / 60;
        const h = now.getHours() + m / 60;

        // Angles
        const secAngle = s * 6;                // 360/60
        const minAngle = m * 6;
        const hourAngle = (h % 12) * 30;       // 360/12

        // Apply transforms
        elSecond.style.transform = `translate(-50%,-100%) rotate(${secAngle}deg)`;
        elMinute.style.transform = `translate(-50%,-100%) rotate(${minAngle}deg)`;
        elHour.style.transform = `translate(-50%,-100%) rotate(${hourAngle}deg)`;

        // Digital text (update once per frame—cheap enough)
        const hh = now.getHours();
        const ampm = hh >= 12 ? "PM" : "AM";
        const h12 = ((hh + 11) % 12) + 1;
        elTime.textContent = `${pad(h12)}:${pad(now.getMinutes())}:${pad(now.getSeconds())}`;
        elAMPM.textContent = ampm;
        elDate.textContent = `${weekday[now.getDay()]}, ${month[now.getMonth()]} ${now.getDate()}, ${now.getFullYear()}`;

        // Phase chips + theme swap (class on <body>)
        const phase = computePhase(hh);
        elPhase.textContent = phase;
        document.body.classList.toggle('night', phase === "Night");
        document.body.classList.toggle('day', phase !== "Night");

        requestAnimationFrame(tick);
    }

    // Show IANA time zone
    try {
        elZone.textContent = Intl.DateTimeFormat().resolvedOptions().timeZone || 'Local Time';
    } catch (_) {
        elZone.textContent = 'Local Time';
    }

    // Start!
    requestAnimationFrame(tick);
})();
