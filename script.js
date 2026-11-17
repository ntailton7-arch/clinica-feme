(function () {
  document.getElementById('year').textContent = new Date().getFullYear();

  const header = document.getElementById('header');
  const burger = document.getElementById('burger');
  const nav = document.getElementById('nav');
  const intro = document.getElementById('intro');

  // Header muda ao rolar
  const onScroll = () => header.classList.toggle('is-scrolled', window.scrollY > 40);
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });

  // Menu responsivo
  const closeMenu = () => {
    nav.classList.remove('is-open');
    burger.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  };
  burger.addEventListener('click', () => {
    const open = nav.classList.toggle('is-open');
    burger.setAttribute('aria-expanded', open);
    document.body.style.overflow = open ? 'hidden' : '';
  });
  nav.querySelectorAll('a').forEach(a => a.addEventListener('click', closeMenu));

  // Sem GSAP (offline) ou movimento reduzido: mostra tudo e sai
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (!window.gsap || reduce) {
    if (intro) intro.remove();
    return;
  }
  gsap.registerPlugin(ScrollTrigger);

  // Esconde só depois de garantir que o GSAP está ativo
  gsap.set('.hero__title .line>span', { yPercent: 110 });
  gsap.set('.hero .reveal', { opacity: 0, y: 24 });
  gsap.set('.site-bg__img', { scale: 1.08 });

  // Entrada cinematográfica
  const tl = gsap.timeline();
  tl.to('.intro__logo', { scale: 1.06, duration: 1.2, ease: 'power2.out' })
    .to('.intro', { yPercent: -100, duration: 1, ease: 'power4.inOut' }, '+=.15')
    .to('.hero__title .line>span', { yPercent: 0, duration: 1.3, stagger: .14, ease: 'power4.out' }, '-=.45')
    .to('.hero .reveal', { opacity: 1, y: 0, duration: 1, stagger: .15, ease: 'power3.out' }, '-=.9')
    .add(() => intro && intro.remove());

  // Parallax suave no fundo
  gsap.to('.site-bg__img', {
    yPercent: 8, rotate: 4, ease: 'none',
    scrollTrigger: { trigger: document.body, start: 'top top', end: 'bottom bottom', scrub: 1.2 }
  });

  // Títulos aparecendo
  gsap.utils.toArray('.split').forEach(el => {
    gsap.from(el, {
      opacity: 0, y: 50, duration: 1.2, ease: 'power3.out',
      scrollTrigger: { trigger: el, start: 'top 85%' }
    });
  });

  // Revelações por seção (exceto hero)
  gsap.utils.toArray('.reveal').forEach(el => {
    if (el.closest('.hero')) return;
    gsap.from(el, {
      opacity: 0, y: 40, duration: 1, ease: 'power3.out',
      scrollTrigger: { trigger: el, start: 'top 88%' }
    });
  });

  // Parallax em imagens
  gsap.utils.toArray('.arch img, .ph img, .member__photo img').forEach(img => {
    gsap.fromTo(img, { yPercent: -6 }, {
      yPercent: 6, ease: 'none',
      scrollTrigger: { trigger: img.parentElement, start: 'top bottom', end: 'bottom top', scrub: true }
    });
  });
})();
