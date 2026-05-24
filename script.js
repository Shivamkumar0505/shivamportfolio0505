// ===== LOADER =====
window.addEventListener('load', () => {
  setTimeout(() => {
    document.getElementById('loader').classList.add('hidden');
  }, 1500);
});

// ===== PARTICLES =====
const canvas = document.getElementById('particles');
const ctx = canvas.getContext('2d');
let particles = [];

function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}
resizeCanvas();
window.addEventListener('resize', resizeCanvas);

class Particle {
  constructor() { this.reset(); }
  reset() {
    this.x = Math.random() * canvas.width;
    this.y = Math.random() * canvas.height;
    this.size = Math.random() * 2 + 0.5;
    this.speedX = (Math.random() - 0.5) * 0.4;
    this.speedY = (Math.random() - 0.5) * 0.4;
    this.opacity = Math.random() * 0.5 + 0.1;
    const colors = ['124,58,237', '168,85,247', '236,72,153', '59,130,246', '0,245,160'];
    this.color = colors[Math.floor(Math.random() * colors.length)];
  }
  update() {
    this.x += this.speedX;
    this.y += this.speedY;
    if (this.x < 0 || this.x > canvas.width || this.y < 0 || this.y > canvas.height) this.reset();
  }
  draw() {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(${this.color},${this.opacity})`;
    ctx.fill();
  }
}

for (let i = 0; i < 120; i++) particles.push(new Particle());

function animateParticles() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  particles.forEach(p => { p.update(); p.draw(); });
  // Draw connections
  for (let i = 0; i < particles.length; i++) {
    for (let j = i + 1; j < particles.length; j++) {
      const dx = particles[i].x - particles[j].x;
      const dy = particles[i].y - particles[j].y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < 100) {
        ctx.beginPath();
        ctx.strokeStyle = `rgba(124,58,237,${0.08 * (1 - dist / 100)})`;
        ctx.lineWidth = 0.5;
        ctx.moveTo(particles[i].x, particles[i].y);
        ctx.lineTo(particles[j].x, particles[j].y);
        ctx.stroke();
      }
    }
  }
  requestAnimationFrame(animateParticles);
}
animateParticles();

// ===== NAVBAR =====
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 50);
});

// Hamburger menu
const hamburger = document.getElementById('hamburger');
const navLinks = document.getElementById('nav-links');
hamburger.addEventListener('click', () => {
  navLinks.classList.toggle('open');
});
navLinks.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => navLinks.classList.remove('open'));
});

// ===== THEME TOGGLE =====
const themeBtn = document.getElementById('theme-toggle');
const body = document.body;
let isDark = true;
themeBtn.addEventListener('click', () => {
  isDark = !isDark;
  body.className = isDark ? 'dark-mode' : 'light-mode';
  themeBtn.innerHTML = isDark ? '<i class="fas fa-sun"></i>' : '<i class="fas fa-moon"></i>';
});

// ===== TYPING ANIMATION =====
const words = ['CSE Student', 'Web Developer', 'Programmer'];
let wordIndex = 0, charIndex = 0, isDeleting = false;
const typedEl = document.getElementById('typed-text');

function type() {
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

// ===== SCROLL REVEAL =====
const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry, i) => {
    if (entry.isIntersecting) {
      setTimeout(() => entry.target.classList.add('visible'), i * 80);
    }
  });
}, { threshold: 0.1 });
document.querySelectorAll('.reveal').forEach(el => observer.observe(el));

// ===== SKILL PROGRESS BARS =====
const skillObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.querySelectorAll('.progress-fill').forEach(bar => {
        bar.style.width = bar.dataset.width + '%';
      });
    }
  });
}, { threshold: 0.3 });
const skillsSection = document.getElementById('skills');
if (skillsSection) skillObserver.observe(skillsSection);

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
const vcObserver = new IntersectionObserver(entries => {
  if (entries[0].isIntersecting) {
    animateCount(vcEl, visitorCount);
    vcObserver.disconnect();
  }
}, { threshold: 0.5 });
if (vcEl) vcObserver.observe(vcEl);

// ===== CONTACT FORM =====
const form = document.getElementById('contact-form');
const status = document.getElementById('form-status');
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
    setTimeout(() => { status.textContent = ''; status.className = 'form-status'; }, 4000);
  }, 1500);
});

// ===== ACTIVE NAV HIGHLIGHT =====
const sections = document.querySelectorAll('section[id]');
const navItems = document.querySelectorAll('.nav-links a');
window.addEventListener('scroll', () => {
  let current = '';
  sections.forEach(sec => {
    if (window.scrollY >= sec.offsetTop - 120) current = sec.getAttribute('id');
  });
  navItems.forEach(a => {
    a.style.color = a.getAttribute('href') === '#' + current ? 'var(--purple-l)' : '';
  });
});

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
    carousel.classList.add('active');
    startX = e.pageX - carousel.offsetLeft;
    scrollLeft = carousel.scrollLeft;
    carousel.style.scrollSnapType = 'none'; // smoother dragging
  });

  carousel.addEventListener('mouseleave', () => {
    isDown = false;
    carousel.classList.remove('active');
    carousel.style.scrollSnapType = 'x mandatory';
  });

  carousel.addEventListener('mouseup', () => {
    isDown = false;
    carousel.classList.remove('active');
    carousel.style.scrollSnapType = 'x mandatory';
  });

  carousel.addEventListener('mousemove', (e) => {
    if (!isDown) return;
    e.preventDefault();
    const x = e.pageX - carousel.offsetLeft;
    const walk = (x - startX) * 2; // scroll multiplier
    if (Math.abs(walk) > 10) dragged = true;
    carousel.scrollLeft = scrollLeft - walk;
  });

  // === Fullscreen Certificate Modal ===
  const modal = document.getElementById('cert-modal');
  const modalContent = document.getElementById('cert-modal-content');
  const modalCaption = document.getElementById('cert-modal-caption');
  const modalCounter = document.getElementById('cert-modal-counter');
  const modalClose = document.getElementById('cert-modal-close');
  const modalPrev = document.getElementById('cert-modal-prev');
  const modalNext = document.getElementById('cert-modal-next');
  let modalIndex = 0;

  const certData = [];
  cards.forEach(card => {
    const media = card.querySelector('.cert-media');
    const placeholder = card.querySelector('.cert-placeholder-wrap');
    const title = card.dataset.title;
    const issuer = card.dataset.issuer;
    const date = card.dataset.date;
    certData.push({
      hasImg: !!media,
      imgSrc: media ? media.src : null,
      bgStyle: placeholder ? placeholder.getAttribute('style') : null,
      iconHtml: placeholder ? placeholder.querySelector('.cert-placeholder i')?.outerHTML : '',
      title,
      issuer,
      date
    });
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
    if (cert.hasImg) {
      modalContent.innerHTML = `<img src="${cert.imgSrc}" style="max-height: 80vh; object-fit: contain; width: auto; max-width: 100%; border-radius: 12px; box-shadow: 0 20px 60px rgba(0,0,0,0.5);" />`;
    } else {
      modalContent.innerHTML = `<div class="cert-modal-placeholder" style="${cert.bgStyle || ''}">${cert.iconHtml}<span style="font-size:1rem;letter-spacing:2px;text-transform:uppercase;opacity:0.6;">Certificate Preview</span></div>`;
    }
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

  modal.addEventListener('click', (e) => {
    if (e.target === modal) closeCertModal();
  });

  cards.forEach((card, i) => {
    card.addEventListener('click', (e) => {
      if (dragged) {
        e.preventDefault();
        return;
      }
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
