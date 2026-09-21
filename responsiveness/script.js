if (window.lucide) lucide.createIcons();

const $ = (s, c = document) => c.querySelector(s);
const $$ = (s, c = document) => [...c.querySelectorAll(s)];

/* ── Sidebar Toggle (Mobile) ──────────────────────────── */
function toggleSidebar(open) {
  document.body.classList.toggle('sidebar-open', open);
}

$('#hamburger')?.addEventListener('click', () => toggleSidebar(true));
$('#closeSidebar')?.addEventListener('click', () => toggleSidebar(false));
$('#backdrop')?.addEventListener('click', () => toggleSidebar(false));

/* ── Navigation ───────────────────────────────────────── */
$$('.nav-item').forEach(item => {
  item.addEventListener('click', () => {
    $$('.nav-item').forEach(i => i.classList.remove('active'));
    item.classList.add('active');
    if (window.innerWidth < 1024) toggleSidebar(false);
  });
});

/* ── Payments Dropdown ────────────────────────────────── */
const payChev = $('.pay-chev');
const payMenu = $('#nav .pay-menu');

payChev?.addEventListener('click', e => {
  e.stopPropagation();
  const isOpen = payMenu && !payMenu.classList.contains('hidden');
  closeAllPanels();
  if (!isOpen && payMenu) {
    payMenu.classList.remove('hidden');
    payChev.style.transform = 'rotate(180deg)';
  } else if (payMenu) {
    payChev.style.transform = '';
  }
});

$$('#nav .pay-menu .panel-item').forEach(item => {
  item.addEventListener('click', () => {
    closeAllPanels();
  });
});

/* ── Panels (Dropdowns) ───────────────────────────────── */
function closeAllPanels() {
  $$('.panel:not(.hidden)').forEach(p => p.classList.add('hidden'));
  const pc = $('.pay-chev');
  if (pc) pc.style.transform = '';
}

document.addEventListener('click', e => {
  if (!e.target.closest('.panel-wrap') && !e.target.closest('.pay-menu')) {
    closeAllPanels();
  }
});

function togglePanel(btnId, panelId) {
  const btn = $(btnId), panel = $(panelId);
  if (!btn || !panel) return;
  btn.addEventListener('click', e => {
    e.stopPropagation();
    const isOpen = !panel.classList.contains('hidden');
    closeAllPanels();
    if (!isOpen) panel.classList.remove('hidden');
  });
}

togglePanel('#bellBtn', '#notifPanel');
togglePanel('#profileBtn', '#profilePanel');
togglePanel('#weekBtn', '#weekPanel');

$$('.more-btn').forEach(btn => {
  const panel = btn.closest('.panel-wrap')?.querySelector('.panel');
  if (!panel) return;
  btn.addEventListener('click', e => {
    e.stopPropagation();
    const isOpen = !panel.classList.contains('hidden');
    closeAllPanels();
    if (!isOpen) panel.classList.remove('hidden');
  });
});

/* ── Week Selector ────────────────────────────────────── */
$$('[data-week]').forEach(opt => {
  opt.addEventListener('click', () => {
    const lbl = $('#weekLabel');
    if (lbl) lbl.textContent = opt.dataset.week;
    closeAllPanels();
  });
});

/* ── Search Filter ────────────────────────────────────── */
function bindSearch(input) {
  input?.addEventListener('input', () => {
    const q = (($('#searchInput').value || '') + ($('#searchMobileInput').value || '')).trim().toLowerCase();
    $$('#apptList .appt-item').forEach(li => {
      const name = li.dataset.name?.toLowerCase() || '';
      li.style.display = name.includes(q) ? '' : 'none';
    });
    $$('#txTable tbody tr').forEach(tr => {
      const text = tr.textContent.toLowerCase();
      tr.style.display = text.includes(q) ? '' : 'none';
    });
  });
}

bindSearch($('#searchInput'));
bindSearch($('#searchMobileInput'));

/* ── Mobile Search Popover ────────────────────────────── */
const mobileSearchBtn = $('#mobileSearchBtn');
const mobileSearchPanel = $('#mobileSearchPanel');
const mobileSearchInput = $('#searchMobileInput');

mobileSearchBtn?.addEventListener('click', e => {
  e.stopPropagation();
  const isOpen = mobileSearchPanel && !mobileSearchPanel.classList.contains('hidden');
  closeAllPanels();
  if (!isOpen && mobileSearchPanel) {
    mobileSearchPanel.classList.remove('hidden');
    mobileSearchInput?.focus();
  }
});

$('#mobileSearchClose')?.addEventListener('click', e => {
  e.stopPropagation();
  mobileSearchPanel?.classList.add('hidden');
  if (mobileSearchInput) mobileSearchInput.value = '';
});

/* ── Modal ────────────────────────────────────────────── */
const modal = $('#modal');
const modalBody = $('#modalBody');

function openModal(html) {
  if (!modalBody || !modal) return;
  modalBody.innerHTML = html;
  modal.classList.add('open');
  if (window.lucide) lucide.createIcons();
}

function closeModal() {
  if (modal) modal.classList.remove('open');
}

window.closeModal = closeModal;

$('#modalBackdrop')?.addEventListener('click', closeModal);
$('#modalClose')?.addEventListener('click', closeModal);

document.addEventListener('keydown', e => {
  if (e.key === 'Escape') {
    closeModal();
    closeAllPanels();
    toggleSidebar(false);
  }
});

/* ── Appointment View Buttons ─────────────────────────── */
$$('.btn-view').forEach(btn => {
  btn.addEventListener('click', () => {
    const name = btn.dataset.name || '';
    const time = btn.dataset.time || '';
    const initials = name.split(' ').map(w => w[0]).join('');
    const colors = {
      'RF': { bg: '#e8f0fe', text: '#3478ed' },
      'AB': { bg: '#fde7ec', text: '#e74c4c' },
      'RE': { bg: '#e8f7ee', text: '#18a957' },
      'AM': { bg: '#fff4e5', text: '#f59e0b' },
      'DL': { bg: '#e5f7fb', text: '#43c4d9' },
      'SN': { bg: '#f3ebff', text: '#8b5cf6' },
    };
    const c = colors[initials] || { bg: '#e8f0fe', text: '#3478ed' };

    openModal(`
      <div class="flex items-center gap-4 mb-5">
        <div class="w-14 h-14 rounded-full flex items-center justify-center text-[18px] font-bold" style="background:${c.bg};color:${c.text}">${initials}</div>
        <div>
          <h3 class="text-[18px] font-semibold text-[#171717]">${name}</h3>
          <p class="text-[13px] text-[#707070]">Appointment at ${time}</p>
        </div>
      </div>
      <div class="grid grid-cols-2 gap-4 mb-5">
        <div class="p-3 rounded-xl bg-[#f8f9fb]">
          <p class="text-[11px] font-medium text-[#9aa4b2] uppercase tracking-wide">Status</p>
          <p class="text-[14px] font-semibold text-[#18a957] mt-0.5">Confirmed</p>
        </div>
        <div class="p-3 rounded-xl bg-[#f8f9fb]">
          <p class="text-[11px] font-medium text-[#9aa4b2] uppercase tracking-wide">Type</p>
          <p class="text-[14px] font-semibold text-[#171717] mt-0.5">Consultation</p>
        </div>
        <div class="p-3 rounded-xl bg-[#f8f9fb]">
          <p class="text-[11px] font-medium text-[#9aa4b2] uppercase tracking-wide">Branch</p>
          <p class="text-[14px] font-semibold text-[#171717] mt-0.5">Main Office</p>
        </div>
        <div class="p-3 rounded-xl bg-[#f8f9fb]">
          <p class="text-[11px] font-medium text-[#9aa4b2] uppercase tracking-wide">Amount</p>
          <p class="text-[14px] font-semibold text-[#171717] mt-0.5">$120.00</p>
        </div>
      </div>
      <div class="flex gap-3">
        <button onclick="closeModal()" class="flex-1 h-11 rounded-full bg-[#3478ed] text-white font-semibold text-[14px] border-none cursor-pointer hover:bg-[#2b68d6] transition-colors">Confirm</button>
        <button onclick="closeModal()" class="flex-1 h-11 rounded-full border border-[#e9e9e9] text-[#707070] font-semibold text-[14px] bg-white cursor-pointer hover:bg-[#f4f6f9] transition-colors">Cancel</button>
      </div>
    `);
  });
});

/* ── View Details Button ──────────────────────────────── */
$('#viewDetails')?.addEventListener('click', () => {
  openModal(`
    <h3 class="text-[18px] font-semibold text-[#171717] mb-4">Transaction Details</h3>
    <div class="space-y-3 mb-5">
      <div class="flex justify-between items-center py-2 border-b border-[#f3f4f6]">
        <span class="text-[13px] text-[#707070]">Total Transactions</span>
        <span class="text-[14px] font-semibold text-[#171717]">4</span>
      </div>
      <div class="flex justify-between items-center py-2 border-b border-[#f3f4f6]">
        <span class="text-[13px] text-[#707070]">Payments</span>
        <span class="text-[14px] font-semibold text-[#18a957]">2</span>
      </div>
      <div class="flex justify-between items-center py-2 border-b border-[#f3f4f6]">
        <span class="text-[13px] text-[#707070]">Refunds</span>
        <span class="text-[14px] font-semibold text-[#e74c4c]">2</span>
      </div>
      <div class="flex justify-between items-center py-2">
        <span class="text-[13px] text-[#707070]">Net Amount</span>
        <span class="text-[14px] font-bold text-[#171717]">$506.51</span>
      </div>
    </div>
    <button onclick="closeModal()" class="w-full h-11 rounded-full bg-[#3478ed] text-white font-semibold text-[14px] border-none cursor-pointer hover:bg-[#2b68d6] transition-colors">Close</button>
  `);
});

/* ── Resize handler: close sidebar on desktop ─────────── */
let prevWidth = window.innerWidth;
window.addEventListener('resize', () => {
  const w = window.innerWidth;
  if (prevWidth < 1024 && w >= 1024) toggleSidebar(false);
  prevWidth = w;
});
