import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import { useCallback, useEffect, useRef, useState } from 'react';

/*
  Contact Cybernetic — reconstruction of the MotionSites public implementation recipe.
  Creator credit: MotionSites · https://motionsites.ai/
  Source: https://motionsites.ai/?prompt=contact-cybernetic
  Showcase: https://showcase.foxora.studio/prompts/motion-contact-cybernetic/

  QA-only reference URLs (never used as runtime media):
  poster  https://showcase.foxora.studio/thumbnails/motion-contact-cybernetic.webp
  motion  https://showcase.foxora.studio/motion/motion-contact-cybernetic.webp
  visual  https://pub-86dc5b5484314368ac5436a674b0d919.r2.dev/hero%20sections/animated%20(42).webp

  The only runtime film is the source-provided MP4 named in the public recipe.
*/

const VIDEO_SRC =
  'https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260601_110537_3a579fa0-7bbc-4d94-9d25-0e816c7840f5.mp4';

const SERVICES = ['Brand', 'Digital', 'Campaign', 'Other'];
const LINKS = ['Labs', 'Studio', 'Openings', 'Shop'];

const TRANSLATIONS = {
  en: {
    nav: { Labs: 'Labs', Studio: 'Studio', Openings: 'Openings', Shop: 'Shop' },
    contact: 'Get in touch',
    headline: "we'd love to\nhear from you!",
    intro1: 'Whether you have questions, feedback,',
    intro2: "drop us a message and we'll get back to you as soon as possible.",
    serviceHeading: 'What sort of service?',
    helper: 'Select all that apply',
    services: SERVICES,
    empty: 'Please click to select services above.',
    banner: (values) => `Ready to inquire about: ${values}`,
    go: "Let's Go",
    submitted: "Thanks — your inquiry is ready. We'll be in touch shortly.",
    reset: 'Start over',
    videoLabel: 'Glossy cybernetic bust rotating in iridescent light',
    menuLabel: 'Site menu',
    openMenu: 'Open menu',
    closeMenu: 'Close menu',
    homeLabel: 'Mainframe home',
    servicesLabel: 'Select services',
    langSwitch: '切换到中文',
  },
  zh: {
    nav: { Labs: '实验室', Studio: '工作室', Openings: '职位', Shop: '商店' },
    contact: '联系我们',
    headline: '我们期待\n收到你的来信！',
    intro1: '无论是疑问还是反馈，',
    intro2: '给我们留言，我们会尽快回复。',
    serviceHeading: '您需要哪类服务？',
    helper: '可多选',
    services: ['品牌', '数字', '营销活动', '其他'],
    empty: '请先点击上方选择服务。',
    banner: (values) => `已选择咨询：${values}`,
    go: '马上开始',
    submitted: '已收到您的咨询，我们会尽快联系您。',
    reset: '重新开始',
    videoLabel: '光泽赛博人像在虹彩光线中旋转',
    menuLabel: '网站菜单',
    openMenu: '打开菜单',
    closeMenu: '关闭菜单',
    homeLabel: 'Mainframe 首页',
    servicesLabel: '选择服务',
    langSwitch: 'Switch to English',
  },
};

function useTypewriter(text, speed = 38, startDelay = 600) {
  const prefersReduced = useReducedMotion();
  const [displayed, setDisplayed] = useState(prefersReduced ? text : '');
  const [done, setDone] = useState(Boolean(prefersReduced));

  useEffect(() => {
    if (prefersReduced) {
      setDisplayed(text);
      setDone(true);
      return undefined;
    }

    let index = 0;
    let tickTimer;
    setDisplayed('');
    setDone(false);

    const startTimer = window.setTimeout(() => {
      const tick = () => {
        index += 1;
        setDisplayed(text.slice(0, index));
        if (index >= text.length) {
          setDone(true);
        } else {
          tickTimer = window.setTimeout(tick, speed);
        }
      };
      tick();
    }, startDelay);

    return () => {
      window.clearTimeout(startTimer);
      window.clearTimeout(tickTimer);
    };
  }, [text, speed, startDelay, prefersReduced]);

  return { displayed, done };
}

function useIsDesktop() {
  const [isDesktop, setIsDesktop] = useState(
    () => typeof window !== 'undefined' && window.matchMedia('(min-width: 1024px)').matches,
  );

  useEffect(() => {
    const query = window.matchMedia('(min-width: 1024px)');
    const onChange = (event) => setIsDesktop(event.matches);
    query.addEventListener('change', onChange);
    return () => query.removeEventListener('change', onChange);
  }, []);

  return isDesktop;
}

function Header({ menuOpen, setMenuOpen, reducedMotion, lang, setLang, t }) {
  useEffect(() => {
    if (!menuOpen) return undefined;
    const onKeyDown = (event) => {
      if (event.key === 'Escape') setMenuOpen(false);
    };
    document.addEventListener('keydown', onKeyDown);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKeyDown);
      document.body.style.overflow = '';
    };
  }, [menuOpen, setMenuOpen]);

  return (
    <>
      <header className="pointer-events-none fixed inset-x-0 top-0 z-30 px-5 py-4 sm:px-8 sm:py-5">
        <div className="pointer-events-auto flex items-center justify-between gap-6">
          <a
            href="/"
            className="shrink-0 text-[17px] font-medium leading-none tracking-[-0.02em] text-[#17161c] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1c2e1e] focus-visible:ring-offset-4 lg:text-[26px]"
            aria-label={t.homeLabel}
          >
            Mainframe<sup className="ml-0.5 text-[0.55em] leading-none">®</sup>
            <span className="ml-1.5 align-middle text-[0.55em] leading-none" aria-hidden="true">
              ✱
            </span>
          </a>

          <nav aria-label="Primary" className="hidden items-center gap-1.5 md:flex lg:gap-2">
            {LINKS.map((label, index) => (
              <span key={label} className="inline-flex items-baseline gap-1.5 lg:gap-2">
                <a
                  href={`/${label.toLowerCase()}`}
                  className="text-[13px] leading-none tracking-[-0.01em] text-[#24242a] opacity-80 transition-opacity hover:opacity-45 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1c2e1e] focus-visible:ring-offset-4 lg:text-[23px]"
                >
                  {t.nav[label]}
                </a>
                {index < LINKS.length - 1 && (
                  <span className="text-[13px] text-[#8d8c95] lg:text-[23px]" aria-hidden="true">
                    ,
                  </span>
                )}
              </span>
            ))}
          </nav>

          <div className="flex shrink-0 items-center gap-3 lg:gap-5">
            <button
              type="button"
              data-language-toggle="true"
              onClick={() => setLang((current) => (current === 'en' ? 'zh' : 'en'))}
              aria-label={t.langSwitch}
              aria-pressed={lang === 'zh'}
              className="inline-flex h-11 min-w-[62px] items-center justify-center gap-1 rounded-full border border-[#e3e7e1] bg-white/80 px-2.5 text-[12px] font-medium text-[#17161c] shadow-[0_1px_2px_rgba(20,30,20,0.04)] transition-colors hover:bg-[#f7f9f6] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1c2e1e] focus-visible:ring-offset-2"
            >
              <span className={lang === 'zh' ? 'text-[#1c2e1e]' : 'text-[#9a9da0]'}>中</span>
              <span className="text-[#c9cdc7]" aria-hidden="true">
                /
              </span>
              <span className={lang === 'en' ? 'text-[#1c2e1e]' : 'text-[#9a9da0]'}>EN</span>
            </button>

            <a
              href="/contact"
              className="hidden text-[12px] leading-none text-[#17161c] underline underline-offset-[3px] transition-opacity hover:opacity-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1c2e1e] focus-visible:ring-offset-4 md:inline-block lg:text-[19px]"
            >
              {t.contact}
            </a>

            <button
              type="button"
              aria-label={menuOpen ? t.closeMenu : t.openMenu}
              aria-expanded={menuOpen}
              aria-controls="mobile-menu"
              onClick={() => setMenuOpen((open) => !open)}
              className="relative inline-flex h-11 w-11 items-center justify-center rounded-md text-[#17161c] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1c2e1e] focus-visible:ring-offset-4 md:hidden"
            >
            <span className="relative block h-[14px] w-[22px]">
              <motion.span
                className="absolute left-0 block h-[1.5px] w-full rounded bg-current"
                animate={menuOpen ? { top: 6, rotate: 45 } : { top: 1, rotate: 0 }}
                transition={reducedMotion ? { duration: 0 } : { duration: 0.22 }}
                style={{ top: 1 }}
              />
              <motion.span
                className="absolute left-0 top-[6px] block h-[1.5px] w-full rounded bg-current"
                animate={{ opacity: menuOpen ? 0 : 1 }}
                transition={reducedMotion ? { duration: 0 } : { duration: 0.15 }}
              />
              <motion.span
                className="absolute left-0 block h-[1.5px] w-full rounded bg-current"
                animate={menuOpen ? { top: 6, rotate: -45 } : { top: 11, rotate: 0 }}
                transition={reducedMotion ? { duration: 0 } : { duration: 0.22 }}
                style={{ top: 11 }}
              />
            </span>
            </button>
          </div>
        </div>
      </header>

      <AnimatePresence>
        {menuOpen && (
          <motion.div
            id="mobile-menu"
            role="dialog"
            aria-modal="true"
            aria-label={t.menuLabel}
            initial={reducedMotion ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={reducedMotion ? { opacity: 1 } : { opacity: 0 }}
            transition={{ duration: reducedMotion ? 0 : 0.2 }}
            className="fixed inset-0 z-20 flex flex-col bg-white/95 px-5 pt-28 backdrop-blur-sm sm:px-8 md:hidden"
          >
            <nav aria-label="Mobile" className="flex flex-col gap-1">
              {[...LINKS, 'Get in touch'].map((label) => (
                <a
                  key={label}
                  href={`/${label.toLowerCase().replace(/\s+/g, '-')}`}
                  onClick={() => setMenuOpen(false)}
                  className="flex min-h-[52px] items-center border-b border-[#ecefeb] text-[24px] tracking-[-0.02em] text-[#17161c] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1c2e1e]"
                >
                  {t.nav[label] || t.contact}
                </a>
              ))}
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

function CyberneticFilm({ desktop, reducedMotion, videoLabel }) {
  const videoRef = useRef(null);
  const lastX = useRef(null);
  const targetTime = useRef(0);
  const seeking = useRef(false);

  const seekTo = useCallback((time) => {
    const video = videoRef.current;
    if (!video || !Number.isFinite(video.duration) || video.duration <= 0) return;
    const clamped = Math.min(Math.max(time, 0), video.duration);
    targetTime.current = clamped;
    if (!seeking.current) {
      seeking.current = true;
      video.currentTime = clamped;
    }
  }, []);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return undefined;

    const onSeeked = () => {
      if (Math.abs(video.currentTime - targetTime.current) > 0.015) {
        video.currentTime = targetTime.current;
      } else {
        seeking.current = false;
      }
    };
    const onLoaded = () => {
      targetTime.current = 0;
      video.currentTime = 0;
    };

    video.addEventListener('seeked', onSeeked);
    video.addEventListener('loadedmetadata', onLoaded);
    return () => {
      video.removeEventListener('seeked', onSeeked);
      video.removeEventListener('loadedmetadata', onLoaded);
    };
  }, []);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    if (!desktop || reducedMotion) {
      video.pause();
      lastX.current = null;
      if (video.readyState > 0) video.currentTime = 0;
      if (!reducedMotion && !desktop) {
        video.play().catch(() => {});
      }
      return;
    }
    video.pause();
    if (video.readyState > 0) video.currentTime = 0;
  }, [desktop, reducedMotion]);

  useEffect(() => {
    if (!desktop || reducedMotion) return undefined;

    const onMove = (event) => {
      const video = videoRef.current;
      if (!video) return;
      if (lastX.current === null) {
        lastX.current = event.clientX;
        return;
      }
      const delta = event.clientX - lastX.current;
      lastX.current = event.clientX;
      const duration = Number.isFinite(video.duration) ? video.duration : 0;
      const next = targetTime.current + (delta / window.innerWidth) * 0.8 * duration;
      seekTo(next);
    };

    window.addEventListener('mousemove', onMove, { passive: true });
    return () => window.removeEventListener('mousemove', onMove);
  }, [desktop, reducedMotion, seekTo]);

  return (
    <div className="order-last relative z-0 aspect-square w-full overflow-hidden bg-[var(--canvas)] pointer-events-none md:aspect-video lg:absolute lg:inset-0 lg:z-0 lg:order-none lg:h-full lg:aspect-auto lg:bg-transparent">
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-[radial-gradient(120%_100%_at_75%_30%,#efedf9_0%,#f5f3fd_55%,#f7f6fc_100%)]"
      />
      <video
        ref={videoRef}
        className="film-zoom relative h-full w-full object-cover object-right lg:object-right-bottom"
        src={VIDEO_SRC}
        muted
        playsInline
        loop
        autoPlay={!desktop && !reducedMotion}
        preload="auto"
        aria-label={videoLabel}
        tabIndex={-1}
      />
    </div>
  );
}

function ServicePills({ selected, setSelected, reducedMotion, onGo, submitted, onReset, t }) {
  const toggle = (service) => {
    setSelected((current) =>
      current.includes(service)
        ? current.filter((item) => item !== service)
        : [...current, service],
    );
  };

  return (
    <section aria-labelledby="services-heading" className="mt-14 lg:mt-[3.6rem]">
      <h2
        id="services-heading"
        className="text-[21px] font-normal tracking-[-0.025em] text-[var(--accent)] lg:text-[28px]"
      >
        {t.serviceHeading}
      </h2>
      <p className="mt-1.5 text-[13px] text-[#8a918a] lg:text-[14px]">{t.helper}</p>

      <div
        role="group"
        aria-label={t.servicesLabel}
        className="mt-6 flex flex-wrap items-center gap-2.5 lg:mt-7 lg:gap-3"
      >
        {SERVICES.map((service, index) => {
          const active = selected.includes(service);
          return (
            <motion.button
              key={service}
              type="button"
              aria-pressed={active}
              onClick={() => toggle(service)}
              whileTap={reducedMotion ? undefined : { scale: 0.96 }}
              transition={{ duration: 0.16 }}
              className={[
                'inline-flex min-h-[44px] items-center justify-center gap-2 rounded-[12px] border px-5 text-[14px] font-medium lg:px-8 lg:text-[16px]',
                'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)] focus-visible:ring-offset-2',
                active
                  ? 'border-[var(--accent)] bg-[var(--accent)] text-white shadow-[0_6px_18px_rgba(28,46,30,0.18)]'
                  : 'border-[var(--border)] bg-[var(--surface)] text-[var(--accent)] shadow-[0_1px_2px_rgba(20,30,20,0.035)] hover:bg-[#f7f9f6]',
              ].join(' ')}
            >
              <AnimatePresence initial={false}>
                {active && (
                  <motion.svg
                    key="check"
                    aria-hidden="true"
                    viewBox="0 0 16 16"
                    className="h-3.5 w-3.5 overflow-visible"
                    initial={reducedMotion ? false : { scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={reducedMotion ? { opacity: 0 } : { scale: 0, opacity: 0 }}
                    transition={{ duration: reducedMotion ? 0 : 0.18 }}
                  >
                    <path
                      d="M3 8.4 6.4 12 13 4.8"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.8"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </motion.svg>
                )}
              </AnimatePresence>
              {t.services[index]}
            </motion.button>
          );
        })}
      </div>

      <div className="mt-6 min-h-[28px]" aria-live="polite">
        <AnimatePresence mode="wait" initial={false}>
          {submitted ? (
            <motion.div
              key="submitted"
              initial={reducedMotion ? false : { opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={reducedMotion ? { opacity: 1 } : { opacity: 0, y: -6 }}
              transition={{ duration: reducedMotion ? 0 : 0.24 }}
              className="max-w-xl rounded-2xl border border-[#e6ebe5] bg-[#fafbf9] p-5 shadow-[var(--shadow)]"
            >
              <p className="text-[15px] text-[var(--accent)]">
                {t.submitted}
              </p>
              <button
                type="button"
                onClick={onReset}
                className="mt-3 min-h-[44px] rounded-lg border border-[#e6ebe5] bg-white px-4 text-[13px] font-medium text-[var(--accent)] hover:bg-[#f7f9f6] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)]"
              >
                {t.reset}
              </button>
            </motion.div>
          ) : selected.length === 0 ? (
            <motion.p
              key="empty"
              initial={reducedMotion ? false : { opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={reducedMotion ? { opacity: 1 } : { opacity: 0 }}
              transition={{ duration: reducedMotion ? 0 : 0.2 }}
              className="text-[12px] italic text-[var(--accent)] opacity-50"
            >
              {t.empty}
            </motion.p>
          ) : (
            <motion.div
              key="banner"
              initial={reducedMotion ? false : { opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={reducedMotion ? { opacity: 1 } : { opacity: 0, y: -8 }}
              transition={{ duration: reducedMotion ? 0 : 0.28 }}
              className="flex max-w-xl flex-wrap items-center justify-between gap-4 rounded-2xl border border-[#e6ebe5] bg-[#fafbf9] p-5 shadow-[var(--shadow)]"
            >
              <p className="text-[14px] leading-snug text-[var(--accent)] lg:text-[15px]">
                {t.banner(
                  selected
                    .map((value) => t.services[SERVICES.indexOf(value)] || value)
                    .join(', '),
                )}
              </p>
              <button
                type="button"
                onClick={onGo}
                className="inline-flex min-h-[44px] items-center justify-center rounded-xl bg-[var(--accent)] px-5 text-[14px] font-medium text-white transition-colors hover:bg-[#2a4430] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)] focus-visible:ring-offset-2"
              >
                {t.go}
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}

export default function App() {
  const prefersReduced = Boolean(useReducedMotion());
  const isDesktop = useIsDesktop();
  const [lang, setLang] = useState('en');
  const t = TRANSLATIONS[lang];
  const { displayed, done } = useTypewriter(t.headline);
  const [selected, setSelected] = useState([]);
  const [submitted, setSubmitted] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    document.documentElement.lang = lang === 'zh' ? 'zh-CN' : 'en';
  }, [lang]);

  return (
    <div className="relative flex min-h-screen flex-col overflow-x-hidden bg-white font-sans text-neutral-900 antialiased selection:bg-[#eaece9] selection:text-[#1c2e1e] lg:block lg:min-h-screen">
      <Header
        menuOpen={menuOpen}
        setMenuOpen={setMenuOpen}
        reducedMotion={prefersReduced}
        lang={lang}
        setLang={setLang}
        t={t}
      />

      <CyberneticFilm
        desktop={isDesktop}
        reducedMotion={prefersReduced}
        videoLabel={t.videoLabel}
      />

      <main className="relative z-10 order-first flex flex-1 flex-col justify-center px-5 pb-16 pt-28 sm:px-8 lg:flex lg:min-h-screen lg:flex-none lg:items-center lg:pb-0 lg:pt-0">
        <div className="mx-auto w-full max-w-7xl lg:pl-5">
          <h1 className="whitespace-pre-line text-[clamp(42px,5vw,72px)] font-normal leading-[1.08] tracking-[-0.045em] text-[var(--text)]">
            {displayed}
            {!done && <span className="type-caret" aria-hidden="true" />}
          </h1>

          <p className="mt-7 max-w-[640px] text-[clamp(15px,1.35vw,20px)] leading-[1.5] text-[var(--muted)] lg:mt-8">
            {t.intro1}
            <br />
            {t.intro2}
          </p>

          <ServicePills
            selected={selected}
            setSelected={setSelected}
            reducedMotion={prefersReduced}
            submitted={submitted}
            onGo={() => setSubmitted(true)}
            onReset={() => {
              setSubmitted(false);
              setSelected([]);
            }}
            t={t}
          />
        </div>
      </main>
    </div>
  );
}
