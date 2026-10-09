import { useLayoutEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

import { websites } from '../content.js';
import { prefersReducedMotion } from '../lib/env.js';

gsap.registerPlugin(ScrollTrigger);

const WIRE = ['Brand strategy', 'Identity systems', 'Digital experiences', 'Campaigns', 'Print & editorial'];

function TypeLine({ children, className = '' }) {
  return (
    <span className={`motion-bridge__line ${className}`} aria-label={children}>
      {Array.from(children).map((char, index) => (
        <span key={`${char}-${index}`} className="motion-bridge__char" aria-hidden="true">
          {char === ' ' ? '\u00a0' : char}
        </span>
      ))}
    </span>
  );
}

function setPointerVars(event) {
  const target = event.currentTarget;
  const rect = target.getBoundingClientRect();
  const x = event.clientX - rect.left;
  const y = event.clientY - rect.top;
  target.style.setProperty('--mx', `${x}px`);
  target.style.setProperty('--my', `${y}px`);
  target.style.setProperty('--pull-x', `${((x / rect.width - 0.5) * 10).toFixed(2)}px`);
  target.style.setProperty('--pull-y', `${((y / rect.height - 0.5) * 10).toFixed(2)}px`);
}

function clearPointerVars(event) {
  event.currentTarget.style.setProperty('--pull-x', '0px');
  event.currentTarget.style.setProperty('--pull-y', '0px');
}

export default function MotionBridge({ onNavigate }) {
  const rootRef = useRef(null);

  useLayoutEffect(() => {
    const root = rootRef.current;
    if (!root || prefersReducedMotion()) return undefined;

    const context = gsap.context(() => {
      const chars = gsap.utils.toArray('.motion-bridge__char');
      const cards = gsap.utils.toArray('.motion-card');
      const rule = root.querySelector('.motion-bridge__rule-fill');
      const ticker = root.querySelector('.motion-wire__track');

      gsap.set(chars, { opacity: 0.09, yPercent: 68 });
      gsap.set(cards, { opacity: 0, yPercent: 48, scale: 0.9 });
      gsap.set(rule, { scaleX: 0 });

      const timeline = gsap.timeline({
        defaults: { ease: 'none' },
        scrollTrigger: {
          trigger: root,
          start: 'top top',
          end: 'bottom bottom',
          scrub: 0.7,
        },
      });

      timeline
        .to(rule, { scaleX: 1, duration: 0.16 }, 0)
        .to(chars, { opacity: 1, yPercent: 0, stagger: 0.0045, duration: 0.34 }, 0.03)
        .fromTo('.motion-bridge__line--left', { xPercent: -7 }, { xPercent: 2, duration: 0.74 }, 0)
        .fromTo('.motion-bridge__line--right', { xPercent: 7 }, { xPercent: -2, duration: 0.74 }, 0)
        .to(cards, { opacity: 1, yPercent: 0, scale: 1, stagger: 0.07, duration: 0.28 }, 0.2)
        .to(cards[0], { xPercent: -16, yPercent: -25, rotation: -5, duration: 0.45 }, 0.48)
        .to(cards[1], { yPercent: -34, rotation: 2.5, duration: 0.45 }, 0.48)
        .to(cards[2], { xPercent: 16, yPercent: -20, rotation: 5, duration: 0.45 }, 0.48)
        .to(ticker, { xPercent: -26, duration: 1 }, 0);
    }, root);

    return () => context.revert();
  }, []);

  const projects = websites.items.slice(0, 3);

  return (
    <section ref={rootRef} id="motion" className="motion-bridge" aria-labelledby="motion-bridge-title">
      <div className="motion-bridge__sticky">
        <div className="motion-bridge__top mono">
          <span>From the Kora Kaagaz desk</span>
          <span>Scroll to set the story in motion</span>
        </div>
        <div className="motion-bridge__rule" aria-hidden="true">
          <span className="motion-bridge__rule-fill" />
        </div>

        <div className="motion-bridge__headline">
          <p className="motion-bridge__eyebrow">Ideas should not sit quietly.</p>
          <h2 id="motion-bridge-title">
            <TypeLine className="motion-bridge__line--left">MAKE THE STORY</TypeLine>
            <TypeLine className="motion-bridge__line--right">IMPOSSIBLE TO MISS.</TypeLine>
          </h2>
        </div>

        <div className="motion-cards" aria-label="Selected live website projects">
          {projects.map((project, index) => (
            <a
              key={project.slug}
              className={`motion-card motion-card--${index + 1}`}
              href={project.url}
              target="_blank"
              rel="noopener noreferrer"
              onPointerMove={setPointerVars}
              onPointerLeave={clearPointerVars}
            >
              <span className="motion-card__surface">
                <span className="motion-card__folio mono">0{index + 1} / Live dispatch</span>
                <span className="motion-card__image">
                  <img src={project.image} alt="" loading="lazy" decoding="async" />
                </span>
                <span className="motion-card__client">{project.client}</span>
                <span className="motion-card__kind mono">{project.kind}</span>
              </span>
            </a>
          ))}
        </div>

        <button
          type="button"
          className="motion-bridge__cta"
          onClick={() => onNavigate('websites')}
          onPointerMove={setPointerVars}
          onPointerLeave={clearPointerVars}
        >
          <span>Open the portfolio</span>
          <span aria-hidden="true">↓</span>
        </button>

        <div className="motion-wire" aria-hidden="true">
          <div className="motion-wire__track">
            {[...WIRE, ...WIRE, ...WIRE].map((item, index) => (
              <span key={`${item}-${index}`}>
                {item} <i>✦</i>
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
