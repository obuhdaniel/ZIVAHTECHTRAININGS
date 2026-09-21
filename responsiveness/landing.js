if (window.lucide) lucide.createIcons();

const menuBtn = document.getElementById('menuBtn');
const mobileMenu = document.getElementById('mobileMenu');

function setMenuIcon(name) {
  const icon = menuBtn?.querySelector('i');
  if (!icon) return;
  icon.setAttribute('data-lucide', name);
  if (window.lucide) lucide.createIcons();
}

function closeMenu() {
  mobileMenu?.classList.remove('open');
  setMenuIcon('menu');
}

menuBtn?.addEventListener('click', () => {
  const isOpen = mobileMenu?.classList.toggle('open');
  setMenuIcon(isOpen ? 'x' : 'menu');
});

mobileMenu?.querySelectorAll('a').forEach(a => {
  a.addEventListener('click', closeMenu);
});