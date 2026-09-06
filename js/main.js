(function () {
  'use strict';

  document.addEventListener('DOMContentLoaded', function () {

    /* ===== Año actual en el footer ===== */
    var yearEl = document.getElementById('year');
    if (yearEl) {
      yearEl.textContent = new Date().getFullYear();
    }

    /* ===== Cambio de tema oscuro/claro ===== */
    var themeToggle = document.getElementById('theme-toggle');
    var rootElement = document.documentElement;
    var themeStorageKey = 'portfolio-theme';

    function applyTheme(theme) {
      rootElement.setAttribute('data-theme', theme);
      themeToggle.setAttribute(
        'aria-label',
        theme === 'dark' ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro'
      );
    }

    var savedTheme = null;
    try {
      savedTheme = localStorage.getItem(themeStorageKey);
    } catch (e) {
      savedTheme = null;
    }

    applyTheme(savedTheme === 'light' ? 'light' : 'dark');

    themeToggle.addEventListener('click', function () {
      var current = rootElement.getAttribute('data-theme');
      var next = current === 'dark' ? 'light' : 'dark';
      applyTheme(next);
      try {
        localStorage.setItem(themeStorageKey, next);
      } catch (e) {
        /* localStorage no disponible; el cambio solo aplica en sesión */
      }
    });

    /* ===== Animación de escritura (typing) en el hero ===== */
    var typingText = document.getElementById('typing-text');
    if (typingText) {
      var roles = ['Desarrollador Web'];
      var roleIndex = 0;
      var charIndex = 0;
      var isDeleting = false;
      var typingDelay = 90;
      var deletingDelay = 45;
      var holdDelay = 1800;

      function typeWriter() {
        var currentRole = roles[roleIndex];
        var visible = currentRole.substring(0, charIndex);

        typingText.textContent = visible;

        if (!isDeleting) {
          charIndex++;
          if (charIndex > currentRole.length) {
            isDeleting = true;
            setTimeout(typeWriter, holdDelay);
            return;
          }
        } else {
          charIndex--;
          if (charIndex === 0) {
            isDeleting = false;
            roleIndex = (roleIndex + 1) % roles.length;
            setTimeout(typeWriter, 400);
            return;
          }
        }

        setTimeout(typeWriter, isDeleting ? deletingDelay : typingDelay);
      }

      setTimeout(typeWriter, 800);
    }

    /* ===== Menú hamburguesa ===== */
    var hamburger = document.getElementById('hamburger');
    var navMenu = document.getElementById('nav-menu');

    function closeMenu() {
      hamburger.classList.remove('open');
      navMenu.classList.remove('open');
      hamburger.setAttribute('aria-expanded', 'false');
    }

    hamburger.addEventListener('click', function () {
      var isOpen = navMenu.classList.toggle('open');
      hamburger.classList.toggle('open', isOpen);
      hamburger.setAttribute('aria-expanded', String(isOpen));
    });

    document.querySelectorAll('.nav-link').forEach(function (link) {
      link.addEventListener('click', closeMenu);
    });

    document.addEventListener('click', function (e) {
      if (
        navMenu.classList.contains('open') &&
        !navMenu.contains(e.target) &&
        !hamburger.contains(e.target)
      ) {
        closeMenu();
      }
    });

    /* ===== Sombra del navbar al hacer scroll ===== */
    var navbar = document.querySelector('.navbar');

    function onScroll() {
      if (window.scrollY > 50) {
        navbar.classList.add('scrolled');
      } else {
        navbar.classList.remove('scrolled');
      }
    }
    onScroll();
    window.addEventListener('scroll', onScroll);

    /* ===== Link activo según sección visible (IntersectionObserver) ===== */
    var sections = document.querySelectorAll('section[id]');
    var navLinks = document.querySelectorAll('.nav-link');

    function setActiveLink(id) {
      navLinks.forEach(function (link) {
        link.classList.toggle('active', link.getAttribute('href') === '#' + id);
      });
    }

    if ('IntersectionObserver' in window) {
      var observer = new IntersectionObserver(
        function (entries) {
          entries.forEach(function (entry) {
            if (entry.isIntersecting) {
              setActiveLink(entry.target.id);
            }
          });
        },
        { rootMargin: '-45% 0px -50% 0px', threshold: 0 }
      );
      sections.forEach(function (section) {
        observer.observe(section);
      });
    }

    /* ===== Animaciones reveal al hacer scroll ===== */
    var revealEls = document.querySelectorAll('.reveal');

    function animateReveals() {
      revealEls.forEach(function (el) {
        var rect = el.getBoundingClientRect();
        if (rect.top < window.innerHeight - 40) {
          el.classList.add('visible');
        }
      });
    }

    if ('IntersectionObserver' in window) {
      var revealObserver = new IntersectionObserver(
        function (entries) {
          entries.forEach(function (entry) {
            if (entry.isIntersecting) {
              entry.target.classList.add('visible');
              revealObserver.unobserve(entry.target);
            }
          });
        },
        { threshold: 0.12 }
      );
      revealEls.forEach(function (el) {
        revealObserver.observe(el);
      });
    } else {
      animateReveals();
      window.addEventListener('scroll', animateReveals);
    }

    /* ===== Barras de habilidades animadas ===== */
    var skillBars = document.querySelectorAll('.skill-fill');
    var barsAnimated = false;

    function animateBars() {
      if (barsAnimated) return;
      var rect = skillBars[0].getBoundingClientRect();
      if (rect.top < window.innerHeight - 60) {
        skillBars.forEach(function (bar) {
          var progress = bar.getAttribute('data-progress');
          bar.style.width = progress + '%';
        });
        barsAnimated = true;
      }
    }

    if (skillBars.length) {
      if ('IntersectionObserver' in window && skillBars[0]) {
        var barsObserver = new IntersectionObserver(
          function (entries) {
            entries.forEach(function (entry) {
              if (entry.isIntersecting && !barsAnimated) {
                skillBars.forEach(function (bar) {
                  bar.style.width = bar.getAttribute('data-progress') + '%';
                });
                barsAnimated = true;
                barsObserver.disconnect();
              }
            });
          },
          { threshold: 0.3 }
        );
        barsObserver.observe(skillBars[0]);
      } else {
        window.addEventListener('scroll', animateBars);
        window.addEventListener('load', animateBars);
      }
    }

    /* ===== Filtros de proyectos ===== */
    var filterButtons = document.querySelectorAll('.filter-btn');
    var projectCards = document.querySelectorAll('.project-card');

    filterButtons.forEach(function (btn) {
      btn.addEventListener('click', function () {
        filterButtons.forEach(function (b) {
          b.classList.remove('active');
        });
        btn.classList.add('active');

        var filter = btn.getAttribute('data-filter');

        projectCards.forEach(function (card) {
          var category = card.getAttribute('data-category');
          var show = filter === 'todos' || filter === category;
          card.classList.toggle('hidden', !show);

          if (show) {
            card.classList.add('visible');
            card.style.animation = 'none';
            void card.offsetHeight;
            card.style.animation = 'cardIn 0.5s ease';
          }
        });
      });
    });

    /* ===== Keyframe de entrada para las tarjetas filtradas ===== */
    if (!document.getElementById('project-card-anim')) {
      var style = document.createElement('style');
      style.id = 'project-card-anim';
      style.textContent =
        '@keyframes cardIn { from { opacity: 0; transform: translateY(20px) scale(0.96); } to { opacity: 1; transform: translateY(0) scale(1); } }';
      document.head.appendChild(style);
    }

  });
})();