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

function buildWhatsAppContactUrl(form) {
  const whatsappNumber = '525525668086';
  const nombre = form.querySelector('#nombre')?.value.trim() || 'No especificado';
  const telefono = form.querySelector('#telefono')?.value.trim() || 'No especificado';
  const correo = form.querySelector('#correo')?.value.trim() || 'No especificado';
  const mensaje = form.querySelector('#mensaje')?.value.trim() || 'No especificado';

  const whatsappMessage = [
    'Hola, me gustaria solicitar defensa legal para mi negocio.',
    '',
    `Nombre: ${nombre}`,
    `Telefono: ${telefono}`,
    `Correo: ${correo}`,
    '',
    'Situacion:',
    mensaje
  ].join('\n');

  return `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(whatsappMessage)}`;
}

function redirectContactFormToWhatsApp(form) {
  if (!form.checkValidity()) {
    form.reportValidity();
    return;
  }

  window.location.href = buildWhatsAppContactUrl(form);
}

document.addEventListener('DOMContentLoaded', async () => {
  const header = document.getElementById('header');
  if (header) {
    window.addEventListener('scroll', () => {
      if (window.scrollY > 50) {
        header.classList.add('scrolled');
      } else {
        header.classList.remove('scrolled');
      }
    });
  }

  const mobileBtn = document.getElementById('mobile-btn');
  const navLinks = document.getElementById('nav-links');

  if (mobileBtn && navLinks) {
    mobileBtn.addEventListener('click', () => {
      navLinks.classList.toggle('active');
      const isActive = navLinks.classList.contains('active');
      mobileBtn.innerHTML = isActive ? '<i class="ph ph-x"></i>' : '<i class="ph ph-list"></i>';
    });

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

  const revealElements = document.querySelectorAll('.reveal');

  const revealCallback = (entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('active');
      }
    });
  };

  const revealOptions = {
    threshold: 0.15,
    rootMargin: '0px 0px -50px 0px'
  };

  const revealObserver = new IntersectionObserver(revealCallback, revealOptions);

  revealElements.forEach(el => {
    revealObserver.observe(el);
  });

  const contactForm = document.querySelector('.contact-form');
  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      redirectContactFormToWhatsApp(contactForm);
    });
  }
});
