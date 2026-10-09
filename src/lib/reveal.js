import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { prefersReducedMotion } from './env.js';

/**
 * Restrained reveal-on-scroll: elements with `.reveal` rise and fade in; image
 * frames with `.reveal-img` are uncovered like ink rolling down the page.
 * The visual states live in CSS — this only adds `.is-in`.
 */
export function initReveals(root) {
  const els = [...root.querySelectorAll('.reveal:not(.is-in), .reveal-img:not(.is-in)')];
  if (prefersReducedMotion()) {
    els.forEach((el) => el.classList.add('is-in'));
    return () => {};
  }
  const triggers = ScrollTrigger.batch(els, {
    start: 'top 90%',
    once: true,
    onEnter: (batch) =>
      batch.forEach((el, i) => {
        el.style.transitionDelay = `${i * 70}ms`;
        el.classList.add('is-in');
      }),
  });

  // Large headlines rise through a clipped baseline as the reader reaches them.
  const headlineTweens = [...root.querySelectorAll('.section-title, .studio__title, .pullquote')].map((heading) =>
    gsap.fromTo(
      heading,
      { clipPath: 'inset(0 0 100% 0)', y: 30 },
      {
        clipPath: 'inset(0 0 0% 0)',
        y: 0,
        ease: 'none',
        scrollTrigger: {
          trigger: heading,
          start: 'top 92%',
          end: 'top 58%',
          scrub: 0.55,
        },
      }
    )
  );

  // Pointer-position ink blooms echo Outcrowd's radial card hover in newsprint.
  const inkTargets = [...root.querySelectorAll('.directory__row')];
  const onMove = (event) => {
    const rect = event.currentTarget.getBoundingClientRect();
    event.currentTarget.style.setProperty('--ink-x', `${event.clientX - rect.left}px`);
    event.currentTarget.style.setProperty('--ink-y', `${event.clientY - rect.top}px`);
  };
  inkTargets.forEach((target) => target.addEventListener('pointermove', onMove));

  return () => {
    triggers.forEach((t) => t.kill());
    headlineTweens.forEach((tween) => tween.kill());
    inkTargets.forEach((target) => target.removeEventListener('pointermove', onMove));
  };
}
