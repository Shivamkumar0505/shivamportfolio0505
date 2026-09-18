// ===== SMOOTH SCROLLING =====
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      target.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });
    }
  });
});

// ===== MOBILE MENU =====
const hamburger = document.getElementById('hamburger');
const navLinks = document.getElementById('nav-links');
if (hamburger && navLinks) {
  hamburger.addEventListener('click', () => {
    navLinks.style.display = navLinks.style.display === 'flex' ? 'none' : 'flex';
    navLinks.style.flexDirection = 'column';
    navLinks.style.position = 'absolute';
    navLinks.style.top = '100%';
    navLinks.style.left = '0';
    navLinks.style.right = '0';
    navLinks.style.background = '#fff';
    navLinks.style.padding = '1rem';
    navLinks.style.boxShadow = '0 10px 25px rgba(0,0,0,0.05)';
  });
}

// ===== TYPING ANIMATION =====
const words = ['CSE Student', 'Web Developer', 'Programmer'];
let wordIndex = 0, charIndex = 0, isDeleting = false;
const typedEl = document.getElementById('typed-text');

function type() {
  if (!typedEl) return;
  const current = words[wordIndex];
  if (isDeleting) {
    typedEl.textContent = current.substring(0, charIndex--);
    if (charIndex < 0) { isDeleting = false; wordIndex = (wordIndex + 1) % words.length; setTimeout(type, 400); return; }
  } else {
    typedEl.textContent = current.substring(0, charIndex++);
    if (charIndex > current.length) { isDeleting = true; setTimeout(type, 1800); return; }
  }
  setTimeout(type, isDeleting ? 60 : 100);
}
type();

// ===== VISITOR COUNTER =====
function animateCount(el, target, duration = 2000) {
  let start = 0;
  const step = target / (duration / 16);
  const timer = setInterval(() => {
    start += step;
    if (start >= target) { el.textContent = target.toLocaleString(); clearInterval(timer); return; }
    el.textContent = Math.floor(start).toLocaleString();
  }, 16);
}

let visitorCount = parseInt(localStorage.getItem('sk_visits') || '0') + 1;
localStorage.setItem('sk_visits', visitorCount);

const vcEl = document.getElementById('visitor-count');
if (vcEl) {
  const vcObserver = new IntersectionObserver(entries => {
    if (entries[0].isIntersecting) {
      animateCount(vcEl, visitorCount);
      vcObserver.disconnect();
    }
  }, { threshold: 0.5 });
  vcObserver.observe(vcEl);
}

// ===== CONTACT FORM =====
const form = document.getElementById('contact-form');
const status = document.getElementById('form-status');
if (form) {
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const btn = document.getElementById('send-btn');
    btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
    btn.disabled = true;
    setTimeout(() => {
      status.textContent = '✅ Message sent! I\'ll get back to you soon.';
      status.className = 'form-status success';
      form.reset();
      btn.innerHTML = '<i class="fas fa-paper-plane"></i> Send Message';
      btn.disabled = false;
      setTimeout(() => { status.style.display = 'none'; }, 4000);
    }, 1500);
  });
}

// ===== CV MODAL =====
function openCVModal() {
  document.getElementById('cv-modal').classList.add('open');
  document.body.style.overflow = 'hidden';
}
function closeCVModal(e) {
  const modal = document.getElementById('cv-modal');
  if (!e || e.target === modal) {
    modal.classList.remove('open');
    document.body.style.overflow = '';
  }
}
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') closeCVModal();
});

// ===== CERTIFICATE GALLERY DRAG TO SCROLL =====
(function () {
  const carousel = document.getElementById('cert-carousel');
  const cards = document.querySelectorAll('.cert-img-card');
  if (!carousel || cards.length === 0) return;

  let isDown = false;
  let dragged = false;
  let startX;
  let scrollLeft;

  carousel.addEventListener('mousedown', (e) => {
    isDown = true;
    dragged = false;
    startX = e.pageX - carousel.offsetLeft;
    scrollLeft = carousel.scrollLeft;
  });

  carousel.addEventListener('mouseleave', () => { isDown = false; });
  carousel.addEventListener('mouseup', () => { isDown = false; });

  carousel.addEventListener('mousemove', (e) => {
    if (!isDown) return;
    e.preventDefault();
    const x = e.pageX - carousel.offsetLeft;
    const walk = (x - startX) * 2;
    if (Math.abs(walk) > 10) dragged = true;
    carousel.scrollLeft = scrollLeft - walk;
  });

  // Fullscreen Modal
  const modal = document.getElementById('cert-modal');
  const modalContent = document.getElementById('cert-modal-content');
  const modalCaption = document.getElementById('cert-modal-caption');
  const modalCounter = document.getElementById('cert-modal-counter');
  const modalClose = document.getElementById('cert-modal-close');
  const modalPrev = document.getElementById('cert-modal-prev');
  const modalNext = document.getElementById('cert-modal-next');
  let modalIndex = 0;

  const certData = Array.from(cards).map(card => {
    const img = card.querySelector('img');
    return {
      src: img ? img.src : '',
      title: card.dataset.title,
      issuer: card.dataset.issuer,
      date: card.dataset.date
    };
  });

  function openCertModal(index) {
    modalIndex = index;
    renderModalSlide();
    modal.classList.add('open');
    document.body.style.overflow = 'hidden';
  }

  function closeCertModal() {
    modal.classList.remove('open');
    document.body.style.overflow = '';
    modalContent.innerHTML = '';
  }

  function renderModalSlide() {
    const cert = certData[modalIndex];
    modalContent.innerHTML = `<img src="${cert.src}" alt="${cert.title}" />`;
    modalCaption.textContent = `${cert.title} — ${cert.issuer} · ${cert.date}`;
    modalCounter.textContent = `${modalIndex + 1} / ${certData.length}`;
  }

  function nextModalSlide() {
    modalIndex = (modalIndex + 1) % certData.length;
    renderModalSlide();
  }

  function prevModalSlide() {
    modalIndex = (modalIndex - 1 + certData.length) % certData.length;
    renderModalSlide();
  }

  modalClose.addEventListener('click', closeCertModal);
  modalPrev.addEventListener('click', prevModalSlide);
  modalNext.addEventListener('click', nextModalSlide);
  modal.addEventListener('click', (e) => { if (e.target === modal) closeCertModal(); });

  cards.forEach((card, i) => {
    card.addEventListener('click', (e) => {
      if (dragged) { e.preventDefault(); return; }
      openCertModal(i);
    });
  });

  document.addEventListener('keydown', (e) => {
    if (!modal.classList.contains('open')) return;
    if (e.key === 'Escape') closeCertModal();
    if (e.key === 'ArrowRight') nextModalSlide();
    if (e.key === 'ArrowLeft') prevModalSlide();
  });
})();
