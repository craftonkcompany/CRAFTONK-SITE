const menuToggle = document.getElementById('menuToggle');
const sideMenu = document.getElementById('sideMenu');
const overlay = document.getElementById('overlay');
const exploreBtn = document.getElementById('exploreBtn');
const craftonkIdBtnHero = document.getElementById('craftonkIdBtnHero');
const menuLinks = document.querySelectorAll('.menu-link');

function closeMenu() {
    sideMenu.classList.remove('open');
    overlay.classList.remove('active');
    menuToggle.classList.remove('menu-open');
    document.body.style.overflow = '';
}

function openMenu() {
    sideMenu.classList.add('open');
    overlay.classList.add('active');
    menuToggle.classList.add('menu-open');
    document.body.style.overflow = 'hidden';
}

if (menuToggle) {
    menuToggle.addEventListener('click', (e) => {
        e.stopPropagation();
        if (sideMenu.classList.contains('open')) {
            closeMenu();
        } else {
            openMenu();
        }
    });
}

if (overlay) {
    overlay.addEventListener('click', closeMenu);
}

menuLinks.forEach(link => {
    link.addEventListener('click', (e) => {
        const href = link.getAttribute('href');
        if (href && href !== '#') {
            e.preventDefault();
            closeMenu();
            setTimeout(() => {
                window.location.href = href;
            }, 200);
        }
    });
});

if (exploreBtn) {
    exploreBtn.addEventListener('click', () => {
        window.location.href = 'projects.html';
    });
}

if (craftonkIdBtnHero) {
    craftonkIdBtnHero.addEventListener('click', () => {
        window.location.href = 'craftonk-id.html';
    });
}

document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && sideMenu && sideMenu.classList.contains('open')) {
        closeMenu();
    }
});