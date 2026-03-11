// Load Components
async function loadComponent(id, file) {
  try {
    const response = await fetch(file);
    if (!response.ok) throw new Error(`Error loading ${file}`);
    const html = await response.text();
    document.getElementById(id).innerHTML = html;
  } catch (error) {
    console.error(error);
  }
}

document.addEventListener('DOMContentLoaded', async () => {
  
  // Load all components concurrently
  await Promise.all([
    loadComponent('header-placeholder', 'components/header.html'),
    loadComponent('hero-placeholder', 'components/hero.html'),
    loadComponent('services-placeholder', 'components/services.html'),
    loadComponent('establishments-placeholder', 'components/establishments.html'),
    loadComponent('problems-placeholder', 'components/problems.html'),
    loadComponent('experience-placeholder', 'components/experience.html'),
    loadComponent('directors-placeholder', 'components/directors.html'),
    loadComponent('process-placeholder', 'components/process.html'),
    loadComponent('news-placeholder', 'components/news.html'),
    loadComponent('contact-placeholder', 'components/contact.html'),
    loadComponent('footer-placeholder', 'components/footer.html')
  ]);

  // After components are loaded, initialize functionality

  // Efecto de scroll para el Header
  const header = document.getElementById('header');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  });

  // Menú móvil (Hamburguesa)
  const mobileBtn = document.getElementById('mobile-btn');
  const navLinks = document.getElementById('nav-links');

  if (mobileBtn && navLinks) {
    mobileBtn.addEventListener('click', () => {
      navLinks.classList.toggle('active');
      const isActive = navLinks.classList.contains('active');
      // Cambiar icono
      mobileBtn.innerHTML = isActive ? '<i class="ph ph-x"></i>' : '<i class="ph ph-list"></i>';
    });

    // Cerrar menú móvil al hacer clic en enlaces
    const navItems = document.querySelectorAll('.nav-links a');
    navItems.forEach(item => {
      item.addEventListener('click', () => {
        if (navLinks.classList.contains('active')) {
          navLinks.classList.remove('active');
          mobileBtn.innerHTML = '<i class="ph ph-list"></i>';
        }
      });
    });
  }

  // Animaciones tipo 'Framer' al hacer scroll con IntersectionObserver
  const revealElements = document.querySelectorAll('.reveal');

  const revealCallback = (entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('active');
        // Descomentar si se desea que la animación ocurra solo una vez
        // observer.unobserve(entry.target);
      }
    });
  };

  const revealOptions = {
    threshold: 0.15,
    rootMargin: "0px 0px -50px 0px"
  };

  const revealObserver = new IntersectionObserver(revealCallback, revealOptions);

  revealElements.forEach(el => {
    revealObserver.observe(el);
  });

  // Validación básica del formulario de contacto simulado
  const contactForm = document.querySelector('.contact-form');
  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      
      const btn = contactForm.querySelector('button[type="submit"]');
      const originalText = btn.innerHTML;
      
      // Simular botón de carga
      btn.innerHTML = '<i class="ph ph-spinner ph-spin"></i> Enviando...';
      btn.disabled = true;
      
      setTimeout(() => {
        alert('Solicitud enviada exitosamente. Un abogado se pondrá en contacto a la brevedad para atender su verificación.');
        btn.innerHTML = originalText;
        btn.disabled = false;
        contactForm.reset();
      }, 1500);
    });
  }

});
