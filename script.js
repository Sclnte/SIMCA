// Smooth scroll for nav links
  document.querySelectorAll('nav ul li a.nav-link').forEach(link => {
    link.addEventListener('click', e => {
      e.preventDefault();
      const targetId = e.target.getAttribute('href').substring(1);
      const targetSection = document.getElementById(targetId);
      if (targetSection) {
        targetSection.scrollIntoView({behavior: 'smooth'});
      }
    });
  });