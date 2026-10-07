const menuToggle = document.getElementById('menuToggle');
const sideMenu = document.getElementById('sideMenu');
const overlay = document.getElementById('overlay');
const exploreBtn = document.getElementById('exploreBtn');
const craftonkIdBtnHero = document.getElementById('craftonkIdBtnHero');

function closeMenu() {
    if (!sideMenu) return;
    sideMenu.classList.remove('open');
    if (overlay) overlay.classList.remove('active');
    if (menuToggle) menuToggle.classList.remove('menu-open');
    document.body.style.overflow = '';
}

function openMenu() {
    if (!sideMenu) return;
    sideMenu.classList.add('open');
    if (overlay) overlay.classList.add('active');
    if (menuToggle) menuToggle.classList.add('menu-open');
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