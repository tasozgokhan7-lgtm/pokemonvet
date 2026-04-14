/* =============================================
   PetLife Veteriner Kliniği – Main JS
   ============================================= */

// ---- Navbar: scroll efekti ----
const header = document.getElementById('header');
const onScroll = () => {
  header.classList.toggle('scrolled', window.scrollY > 40);
};
window.addEventListener('scroll', onScroll, { passive: true });
onScroll();

// ---- Hamburger menü ----
const hamburger = document.getElementById('hamburger');
const navLinks  = document.getElementById('navLinks');

hamburger.addEventListener('click', () => {
  hamburger.classList.toggle('open');
  navLinks.classList.toggle('open');
});

// Menü linkine tıklayınca kapat
navLinks.querySelectorAll('.nav-link').forEach(link => {
  link.addEventListener('click', () => {
    hamburger.classList.remove('open');
    navLinks.classList.remove('open');
  });
});

// ---- Aktif nav link (scroll spy) ----
const sections = document.querySelectorAll('section[id]');
const navItems = document.querySelectorAll('.nav-link');

const spyObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      navItems.forEach(n => n.classList.remove('active'));
      const active = document.querySelector(`.nav-link[href="#${entry.target.id}"]`);
      if (active) active.classList.add('active');
    }
  });
}, { threshold: 0.4 });

sections.forEach(s => spyObserver.observe(s));

// ---- AOS – scroll animasyonları ----
const aosObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry, i) => {
    if (entry.isIntersecting) {
      // Kart gruba göre biraz gecikme ekle
      setTimeout(() => {
        entry.target.classList.add('aos-visible');
      }, i * 80);
      aosObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.1 });

document.querySelectorAll('[data-aos]').forEach(el => aosObserver.observe(el));

// ---- Galeri Lightbox ----
const lightbox      = document.getElementById('lightbox');
const lightboxImg   = document.getElementById('lightboxImg');
const lightboxClose = document.getElementById('lightboxClose');

document.querySelectorAll('.gallery-item').forEach(item => {
  item.addEventListener('click', () => {
    const img = item.querySelector('img');
    lightboxImg.src = img.src;
    lightboxImg.alt = img.alt;
    lightbox.classList.add('open');
    document.body.style.overflow = 'hidden';
  });
});

const closeLightbox = () => {
  lightbox.classList.remove('open');
  document.body.style.overflow = '';
};

lightboxClose.addEventListener('click', closeLightbox);
lightbox.addEventListener('click', e => {
  if (e.target === lightbox) closeLightbox();
});
document.addEventListener('keydown', e => {
  if (e.key === 'Escape') closeLightbox();
});

// ---- İletişim Formu ----
const form        = document.getElementById('contactForm');
const formSuccess = document.getElementById('formSuccess');

form.addEventListener('submit', (e) => {
  e.preventDefault();

  const name  = form.querySelector('#name').value.trim();
  const phone = form.querySelector('#phone').value.trim();

  if (!name || !phone) {
    // Basit validasyon
    [form.querySelector('#name'), form.querySelector('#phone')].forEach(el => {
      if (!el.value.trim()) {
        el.style.borderColor = '#e74c3c';
        el.addEventListener('input', () => { el.style.borderColor = ''; }, { once: true });
      }
    });
    return;
  }

  // Buton loading durumu
  const btn = form.querySelector('button[type="submit"]');
  const originalText = btn.innerHTML;
  btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Gönderiliyor...';
  btn.disabled = true;

  // Simüle edilmiş gönderim (gerçek entegrasyon için EmailJS / backend kullanın)
  setTimeout(() => {
    form.reset();
    btn.innerHTML = originalText;
    btn.disabled = false;
    formSuccess.classList.add('show');
    setTimeout(() => formSuccess.classList.remove('show'), 5000);
  }, 1200);
});

// ---- Sayaç animasyonu (hero stats) ----
const counters = document.querySelectorAll('.stat-num');

const countObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    const el = entry.target;
    const suffix = el.querySelector('span') ? el.querySelector('span').outerHTML : '';
    const target = parseInt(el.textContent.replace(/\D/g, '')) || 0;
    let start = 0;
    const duration = 1400;
    const step = (target / duration) * 16;

    const tick = () => {
      start = Math.min(start + step, target);
      el.innerHTML = Math.floor(start) + suffix;
      if (start < target) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
    countObserver.unobserve(el);
  });
}, { threshold: 0.6 });

counters.forEach(c => countObserver.observe(c));

// ---- Smooth scroll için offset (sticky header) ----
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', e => {
    const target = document.querySelector(anchor.getAttribute('href'));
    if (!target) return;
    e.preventDefault();
    const offset = 80;
    window.scrollTo({
      top: target.getBoundingClientRect().top + window.scrollY - offset,
      behavior: 'smooth'
    });
  });
});
