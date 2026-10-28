import { useEffect } from 'react';
import { blip, whoosh, sting } from '../sound/engine';

// Everything that makes the page feel alive while you move through it:
//  - things marked data-reveal float in as they scroll into view
//  - the planets in the background drift as you scroll
//  - sound: a blip when you hover a link or button, a whoosh between screens, a sting for Signal Detected
export default function useAlive(route, hudRef) {
  // Reveal on scroll
  useEffect(() => {
    const root = hudRef.current?.querySelector('.hud__screen');
    if (!root) return undefined;
    let io;
    const t = setTimeout(() => {
      const items = [...root.querySelectorAll('[data-reveal]')];
      if (typeof IntersectionObserver === 'undefined') { items.forEach((el) => el.classList.add('is-in')); return; }
      items.forEach((el, i) => { el.classList.add('is-armed'); el.style.setProperty('--d', `${(i % 4) * 90}ms`); });
      io = new IntersectionObserver((entries) => {
        entries.forEach((e) => { if (e.isIntersecting) { e.target.classList.add('is-in'); io.unobserve(e.target); } });
      }, { root, threshold: 0.12 });
      items.forEach((el) => io.observe(el));
    }, 650);
    return () => { clearTimeout(t); io?.disconnect(); };
  }, [route.id, route.sub, hudRef]);

  // Background drift with scroll
  useEffect(() => {
    const hud = hudRef.current;
    const root = hud?.querySelector('.hud__screen');
    if (!root) return undefined;
    let raf = 0;
    const onScroll = () => {
      if (raf) return;
      raf = requestAnimationFrame(() => { hud.style.setProperty('--sy', String(root.scrollTop)); raf = 0; });
    };
    root.addEventListener('scroll', onScroll, { passive: true });
    hud.style.setProperty('--sy', '0');
    return () => root.removeEventListener('scroll', onScroll);
  }, [route.id, hudRef]);

  // Sound on hover
  useEffect(() => {
    const onOver = (e) => {
      const el = e.target.closest?.('a[href], button, [role="button"]');
      if (el && !el.contains(e.relatedTarget)) blip();
    };
    document.addEventListener('mouseover', onOver);
    return () => document.removeEventListener('mouseover', onOver);
  }, []);

  // Sound on screen change
  useEffect(() => {
    whoosh();
    if (route.id === 'signal') setTimeout(sting, 700);
  }, [route.id]);
}
