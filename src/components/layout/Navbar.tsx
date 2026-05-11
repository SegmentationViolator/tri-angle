import { useCallback, useState } from 'react';
import { useLenisScroll } from '@hooks/useLenisScroll';
import type { LenisScrollPayload } from '@lib/lenis';
import styles from './Navbar.module.scss';

interface NavLink {
  readonly label: string;
  readonly href: string;
}

const NAV_LINKS: readonly NavLink[] = [
  { label: 'Capabilities', href: '#capabilities' },
  { label: 'Work', href: '#work' },
  { label: 'Contact', href: '#contact' },
];

export default function Navbar(): JSX.Element {
  const [scrolled, setScrolled] = useState<boolean>(false);

  const onScroll = useCallback((payload: LenisScrollPayload) => {
    setScrolled(payload.scroll > 24);
  }, []);

  useLenisScroll(onScroll);

  return (
    <header
      className={`${styles.navbar} ${scrolled ? styles.scrolled : ''}`}
      role="banner"
    >
      <nav className={styles.inner} aria-label="Primary">
        <a href="#hero" className={styles.brand} aria-label="Tri-Angle home">
          <span className={styles.mark} aria-hidden="true">△</span>
          <span className={styles.wordmark}>Tri-Angle</span>
        </a>

        <ul className={styles.links}>
          {NAV_LINKS.map((link) => (
            <li key={link.href}>
              <a href={link.href} className={styles.link}>
                {link.label}
              </a>
            </li>
          ))}
        </ul>

        <a href="#contact" className={styles.cta}>
          Start a project
        </a>
      </nav>
    </header>
  );
}
