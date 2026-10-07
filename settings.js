/* ============================================================
   Craftonk - тема, cookie, Яндекс.Метрика
   ============================================================ */

var storage = {
    get: function (key) {
        try { return localStorage.getItem(key); }
        catch (e) { console.warn('[storage] не доступен:', e); return null; }
    },
    set: function (key, value) {
        try { localStorage.setItem(key, value); return true; }
        catch (e) { console.warn('[storage] не сохраняется:', e); return false; }
    },
    remove: function (key) {
        try { localStorage.removeItem(key); }
        catch (e) { console.warn('[storage] не удаляется:', e); }
    }
};

/* ---------- Тема ---------- */
var themeToggle = document.getElementById('theme-toggle');
var themeIcon = document.getElementById('theme-icon');

function renderThemeIcon(isDark) {
    if (!themeIcon) return;
    themeIcon.className = isDark ? 'icon icon-moon' : 'icon icon-sun';
}

function applyTheme(isDark) {
    if (isDark) {
        document.documentElement.setAttribute('data-theme', 'dark');
        storage.set('theme', 'dark');
    } else {
        document.documentElement.setAttribute('data-theme', 'light');
        storage.set('theme', 'light');
    }
    if (themeToggle) themeToggle.checked = isDark;
    renderThemeIcon(isDark);
}

(function initTheme() {
    var isDark = document.documentElement.getAttribute('data-theme') === 'dark';
    if (themeToggle) themeToggle.checked = isDark;
    renderThemeIcon(isDark);
})();

if (themeToggle) {
    themeToggle.addEventListener('change', function () {
        applyTheme(themeToggle.checked);
    });
}

window.addEventListener('storage', function (e) {
    if (e.key === 'theme') {
        var isDark = e.newValue === 'dark';
        if (isDark) {
            document.documentElement.setAttribute('data-theme', 'dark');
        } else {
            document.documentElement.setAttribute('data-theme', 'light');
        }
        if (themeToggle) themeToggle.checked = isDark;
        renderThemeIcon(isDark);
    }
});

/* ---------- Cookie ---------- */
var CONSENT_KEY = 'cookie-consent';
var CONSENT_DATE_KEY = 'cookie-consent-date';

function buildCookieBanner() {
    if (document.getElementById('cookie-banner')) return;

    var banner = document.createElement('div');
    banner.id = 'cookie-banner';
    banner.setAttribute('role', 'dialog');
    banner.setAttribute('aria-live', 'polite');

    var textWrap = document.createElement('div');
    textWrap.className = 'cookie-text';

    var icon = document.createElement('span');
    icon.className = 'icon icon-cookie';
    textWrap.appendChild(icon);

    var paragraph = document.createElement('p');
    paragraph.appendChild(document.createTextNode(
        'Мы используем файлы cookie и локальное хранилище, ' +
        'чтобы запомнить ваши настройки и анализировать трафик ' +
        'через Яндекс.Метрику. Подробнее - в '
    ));

    var policyLink = document.createElement('a');
    policyLink.href = '#';
    policyLink.id = 'cookie-policy-link';
    policyLink.textContent = 'политике cookie';
    policyLink.addEventListener('click', function (e) {
        e.preventDefault();
        alert('Здесь будет ссылка на страницу с политикой cookie.');
    });
    paragraph.appendChild(policyLink);
    paragraph.appendChild(document.createTextNode('.'));

    textWrap.appendChild(paragraph);

    var actions = document.createElement('div');
    actions.className = 'cookie-actions';

    var declineBtn = document.createElement('button');
    declineBtn.type = 'button';
    declineBtn.id = 'cookie-decline';
    declineBtn.className = 'btn-secondary-custom';
    declineBtn.textContent = 'Отказаться';
    declineBtn.addEventListener('click', function (e) {
        e.preventDefault();
        setCookieChoice('declined');
    });

    var acceptBtn = document.createElement('button');
    acceptBtn.type = 'button';
    acceptBtn.id = 'cookie-accept';
    acceptBtn.className = 'btn-primary-custom cookie-accept';
    acceptBtn.textContent = 'Принять';
    acceptBtn.addEventListener('click', function (e) {
        e.preventDefault();
        setCookieChoice('accepted');
    });

    actions.appendChild(declineBtn);
    actions.appendChild(acceptBtn);

    banner.appendChild(textWrap);
    banner.appendChild(actions);

    document.body.appendChild(banner);
}

function showCookieBanner() {
    var banner = document.getElementById('cookie-banner');
    if (!banner) return;
    banner.style.display = 'block';
    setTimeout(function () {
        banner.classList.add('show');
    }, 20);
}

function hideCookieBanner() {
    var banner = document.getElementById('cookie-banner');
    if (!banner) return;
    banner.classList.remove('show');
    banner.style.display = 'none';
    if (banner.parentNode) banner.parentNode.removeChild(banner);
}

function setCookieChoice(value) {
    var saved = storage.set(CONSENT_KEY, value);
    storage.set(CONSENT_DATE_KEY, new Date().toISOString());
    console.log('[cookie] выбор:', value, 'сохранён:', saved);
    hideCookieBanner();
    updateCookieStatusUI();
    if (value === 'accepted') {
        loadYandexMetrika();
    }
}

function updateCookieStatusUI() {
    var el = document.getElementById('cookie-status');
    if (!el) return;
    var choice = storage.get(CONSENT_KEY);
    if (choice === 'accepted') el.textContent = 'Принято';
    else if (choice === 'declined') el.textContent = 'Отклонено';
    else el.textContent = 'Выбор не сделан';
}

function updateMetrikaStatusUI() {
    var status = document.getElementById('metrika-status');
    var dot = document.getElementById('metrika-dot');
    if (!status || !dot) return;
    if (window.__ymLoaded) {
        status.textContent = 'Активна (счётчик 113538990)';
        dot.classList.add('active');
    } else {
        status.textContent = 'Не активна';
        dot.classList.remove('active');
    }
}

/* ---------- Яндекс.Метрика ---------- */
var YM_COUNTER_ID = 113538990;

function loadYandexMetrika() {
    if (window.__ymLoaded) return;
    window.__ymLoaded = true;

    (function (m, e, t, r, i, k, a) {
        m[i] = m[i] || function () { (m[i].a = m[i].a || []).push(arguments); };
        m[i].l = 1 * new Date();
        for (var j = 0; j < document.scripts.length; j++) {
            if (document.scripts[j].src === r) { return; }
        }
        k = e.createElement(t);
        a = e.getElementsByTagName(t)[0];
        k.async = 1;
        k.src = r;
        a.parentNode.insertBefore(k, a);
    })(window, document, 'script',
       'https://mc.yandex.ru/metrika/tag.js?id=' + YM_COUNTER_ID, 'ym');

    ym(YM_COUNTER_ID, 'init', {
        ssr: true,
        webvisor: true,
        clickmap: true,
        ecommerce: 'dataLayer',
        referrer: document.referrer,
        url: location.href,
        accurateTrackBounce: true,
        trackLinks: true
    });

    var ns = document.createElement('noscript');
    var imgDiv = document.createElement('div');
    var img = document.createElement('img');
    img.src = 'https://mc.yandex.ru/watch/' + YM_COUNTER_ID;
    img.style.position = 'absolute';
    img.style.left = '-9999px';
    img.alt = '';
    imgDiv.appendChild(img);
    ns.appendChild(imgDiv);
    document.body.appendChild(ns);

    updateMetrikaStatusUI();
    console.log('[cookie] Яндекс.Метрика загружена.');
}

/* ---------- Инициализация ---------- */
buildCookieBanner();

if (!storage.get(CONSENT_KEY)) {
    showCookieBanner();
} else {
    var existing = document.getElementById('cookie-banner');
    if (existing && existing.parentNode) {
        existing.parentNode.removeChild(existing);
    }
}

var cookieResetBtn = document.getElementById('cookie-reset');
if (cookieResetBtn) {
    cookieResetBtn.addEventListener('click', function () {
        storage.remove(CONSENT_KEY);
        storage.remove(CONSENT_DATE_KEY);
        updateCookieStatusUI();
        updateMetrikaStatusUI();
        buildCookieBanner();
        showCookieBanner();
    });
}

updateCookieStatusUI();
updateMetrikaStatusUI();

if (storage.get(CONSENT_KEY) === 'accepted') {
    loadYandexMetrika();
}