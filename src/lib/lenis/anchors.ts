import { getInstance } from './instance';

export function mountAnchors(root: Document | HTMLElement = document): () => void {
  const handler = (event: MouseEvent): void => {
    const target = event.target as HTMLElement | null;
    if (!target) return;
    const link = target.closest<HTMLAnchorElement>('a[href^="#"]');
    if (!link) return;

    const href = link.getAttribute('href');
    if (!href || href === '#') return;

    const el = document.querySelector<HTMLElement>(href);
    if (!el) return;

    event.preventDefault();
    const lenis = getInstance();
    if (lenis) {
      lenis.scrollTo(el, { offset: -72, duration: 1.4 });
    } else {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  root.addEventListener('click', handler as EventListener);
  return () => root.removeEventListener('click', handler as EventListener);
}
