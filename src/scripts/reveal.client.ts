const REVEAL_OPTIONS: IntersectionObserverInit = {
  threshold: 0.12,
  rootMargin: '0px 0px -8% 0px',
};

function bootReveal(): void {
  if (typeof window === 'undefined') return;

  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.setAttribute('data-revealed', '');
        observer.unobserve(entry.target);
      }
    });
  }, REVEAL_OPTIONS);

  const observe = (): void => {
    const targets = document.querySelectorAll<HTMLElement>('[data-reveal]:not([data-revealed])');
    targets.forEach((el) => {
      if (reduced) {
        // Skip animation entirely under reduced motion
        el.setAttribute('data-revealed', '');
        return;
      }
      observer.observe(el);
    });
  };

  observe();

  // Re-scan after Astro view transitions / dynamic content
  document.addEventListener('astro:after-swap', observe);
}

bootReveal();
