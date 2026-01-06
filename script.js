/**
 * IRON PULSE GYM - CORE ENGINE
 * Pure JavaScript, Premium UX
 */

// 1. APP CONFIG & STATE
let cachedClasses = [];
let startY = 0;
const REFRESH_THRESHOLD = 90;

// 2. INITIALIZATION
window.addEventListener('load', () => {
    initTheme();       // Restore theme & icons
    initMotivation();  // Load daily quote
    initClasses();     // Load dynamic schedule
    setupPWA();        // Handle offline/install

    // Loader logic: smooth fade-out
    const loader = document.getElementById('loader');
    const app = document.getElementById('app-content');
    
    setTimeout(() => {
        loader.style.opacity = '0';
        setTimeout(() => {
            loader.style.display = 'none';
            app.style.display = 'block';
        }, 500);
    }, 1800);
});

// 3. THEME ENGINE (Updated for FA Icons)
function toggleTheme() {
    const root = document.documentElement;
    const themeBtn = document.getElementById('theme-btn');
    const isDark = root.getAttribute('data-theme') === 'dark';
    
    if (isDark) {
        root.removeAttribute('data-theme');
        themeBtn.innerHTML = '<i class="fas fa-sun"></i>';
        localStorage.setItem('gym-theme', 'light');
    } else {
        root.setAttribute('data-theme', 'dark');
        themeBtn.innerHTML = '<i class="fas fa-moon"></i>';
        localStorage.setItem('gym-theme', 'dark');
    }
    if (navigator.vibrate) navigator.vibrate(10);
}

function initTheme() {
    const savedTheme = localStorage.getItem('gym-theme');
    const themeBtn = document.getElementById('theme-btn');
    if (savedTheme === 'dark') {
        document.documentElement.setAttribute('data-theme', 'dark');
        themeBtn.innerHTML = '<i class="fas fa-moon"></i>';
    }
}

// 4. NAVIGATION (Restored SPA Logic)
function showPage(pageId, element) {
    // Page switching
    document.querySelectorAll('.page').forEach(page => page.classList.remove('active'));
    document.getElementById(pageId).classList.add('active');
    document.getElementById(pageId).scrollTop = 0;

    // Navigation item active state
    document.querySelectorAll('.nav-item').forEach(nav => nav.classList.remove('active'));
    if (element) element.classList.add('active');

    // Haptic Feedback
    if (navigator.vibrate) navigator.vibrate(15);
}

// 5. DYNAMIC DATA LOADING
async function initMotivation() {
    try {
        const res = await fetch('motivation.json');
        const data = await res.json();
        const quote = data.quotes[Math.floor(Math.random() * data.quotes.length)];
        document.getElementById('quote-text').innerText = `"${quote}"`;
    } catch (e) { console.log("Motivation loaded from local fallback."); }
}

async function initClasses() {
    try {
        const res = await fetch('classes.json');
        const data = await res.json();
        cachedClasses = data.gymClasses;
        renderClasses('All');
    } catch (e) { console.log("Using static fallback for classes."); }
}

function renderClasses(filter) {
    const list = document.getElementById('schedule-list');
    list.innerHTML = '';
    const filtered = filter === 'All' ? cachedClasses : cachedClasses.filter(c => c.type === filter);
    
    filtered.forEach(item => {
        const card = document.createElement('div');
        card.className = 'class-card';
        card.style = "background: var(--surface); padding: 15px; border-radius: 12px; margin-bottom: 10px; border: 1px solid var(--border); display: flex; align-items: center; justify-content: space-between;";
        card.innerHTML = `
            <div>
                <div style="font-weight: bold; color: var(--primary);">${item.time}</div>
                <h4 style="margin: 5px 0;">${item.name}</h4>
                <p style="margin: 0; font-size: 12px; color: var(--text-muted);">with Coach ${item.coach}</p>
            </div>
            <div style="font-size: 10px; background: var(--bg-color); border: 1px solid var(--border); padding: 4px 10px; border-radius: 6px; color: var(--text-main);">${item.type}</div>
        `;
        list.appendChild(card);
    });
}

function filterClasses(type) {
    document.querySelectorAll('.chip').forEach(c => c.classList.toggle('active', c.innerText === type));
    renderClasses(type);
}

// 6. FAQ ACCORDION LOGIC (The Reveal Feature)
function toggleFAQ(element) {
    // Close other FAQs if one is clicked (optional accordion behavior)
    document.querySelectorAll('.faq-item').forEach(item => {
        if (item !== element) item.classList.remove('open');
    });
    
    element.classList.toggle('open');
    if (navigator.vibrate) navigator.vibrate(5);
}

// 7. PULL TO REFRESH (Fixed for Mobile UX)
document.addEventListener('touchstart', e => { startY = e.touches[0].pageY; }, {passive: true});
document.addEventListener('touchmove', e => {
    const y = e.touches[0].pageY;
    const diff = y - startY;
    const activePage = document.querySelector('.page.active');
    
    if (activePage.scrollTop === 0 && diff > 0 && diff < 100) {
        document.getElementById('pull-to-refresh').style.top = (diff - 60) + 'px';
    }
}, {passive: true});

document.addEventListener('touchend', e => {
    const y = e.changedTouches[0].pageY;
    if (y - startY > 80 && document.querySelector('.page.active').scrollTop === 0) {
        location.reload();
    }
    document.getElementById('pull-to-refresh').style.top = '-60px';
});

// 8. PWA/OFFLINE LOGIC
function setupPWA() {
    window.addEventListener('online', () => {
        const toast = document.getElementById('offline-toast');
        toast.innerText = "Back Online!";
        toast.style.background = "#2ecc71";
        setTimeout(() => toast.classList.remove('show'), 3000);
    });

    window.addEventListener('offline', () => {
        const toast = document.getElementById('offline-toast');
        toast.innerText = "Offline Mode Active";
        toast.style.background = "#e63946";
        toast.classList.add('show');
    });
}



// 1. Define your hero images (Add your generated images to your assets folder)
const heroImages = [
    'assets/hero-1.jpg',
    'assets/hero-2.jpg',
    'assets/hero-3.jpg'
];

function changeHeroImage() {
    const hero = document.getElementById('hero-dynamic');
    // Pick a random image from the array
    const randomImage = heroImages[Math.floor(Math.random() * heroImages.length)];
    
    // Apply it to the background
    hero.style.backgroundImage = `linear-gradient(rgba(0,0,0,0.3), rgba(0,0,0,0.1)), url('${randomImage}')`;
}

// 2. Call this inside your existing window 'load' event
window.addEventListener('load', () => {
    changeHeroImage(); // This changes the image on every refresh
    // ... rest of your existing init code
});

