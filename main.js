/* ============================================
   LimitedTicket — Main JavaScript (Redesigned)
   Interactive | Animated | Performance-First
   ============================================ */

(function () {
    'use strict';

    document.addEventListener('DOMContentLoaded', init);

    function init() {
        initNavigation();
        initHeaderScroll();
        initBackToTop();
        initScrollAnimations();
        initCountUp();
        initFAQAccessibility();
        initInteractiveChecklist();
        initHeroParticles();
        initComingSoonParticles();
    }

    // =============================================
    // NAVIGATION
    // =============================================
    function initNavigation() {
        var toggle = document.querySelector('.nav-toggle');
        var menu = document.querySelector('.nav-menu');
        if (!toggle || !menu) return;

        toggle.addEventListener('click', function () {
            var expanded = toggle.getAttribute('aria-expanded') === 'true';
            toggle.setAttribute('aria-expanded', String(!expanded));
            menu.classList.toggle('active');
            document.body.style.overflow = expanded ? '' : 'hidden';
        });

        var links = menu.querySelectorAll('.nav-link, .nav-cta');
        links.forEach(function (link) {
            link.addEventListener('click', function () {
                toggle.setAttribute('aria-expanded', 'false');
                menu.classList.remove('active');
                document.body.style.overflow = '';
            });
        });

        document.addEventListener('keydown', function (e) {
            if (e.key === 'Escape' && menu.classList.contains('active')) {
                toggle.setAttribute('aria-expanded', 'false');
                menu.classList.remove('active');
                document.body.style.overflow = '';
                toggle.focus();
            }
        });
    }

    // =============================================
    // HEADER SCROLL EFFECT
    // =============================================
    function initHeaderScroll() {
        var header = document.getElementById('site-header');
        if (!header) return;

        var scrollThreshold = 80;
        var ticking = false;

        function onScroll() {
            if (!ticking) {
                window.requestAnimationFrame(function () {
                    if (window.scrollY > scrollThreshold) {
                        header.classList.add('scrolled');
                    } else {
                        header.classList.remove('scrolled');
                    }
                    ticking = false;
                });
                ticking = true;
            }
        }

        window.addEventListener('scroll', onScroll, { passive: true });
        onScroll();
    }

    // =============================================
    // BACK TO TOP
    // =============================================
    function initBackToTop() {
        var btn = document.getElementById('back-to-top');
        if (!btn) return;

        var showThreshold = 600;
        var ticking = false;

        function onScroll() {
            if (!ticking) {
                window.requestAnimationFrame(function () {
                    if (window.scrollY > showThreshold) {
                        btn.classList.add('visible');
                    } else {
                        btn.classList.remove('visible');
                    }
                    ticking = false;
                });
                ticking = true;
            }
        }

        window.addEventListener('scroll', onScroll, { passive: true });

        btn.addEventListener('click', function () {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }

    // =============================================
    // SCROLL ANIMATIONS
    // =============================================
    function initScrollAnimations() {
        if (!('IntersectionObserver' in window)) return;

        var selectors = [
            '.value-card',
            '.pillar-card',
            '.category-card',
            '.step-card',
            '.proof-card',
            '.readiness-feature',
            '.score-card',
            '.section-header'
        ];

        var elements = document.querySelectorAll(selectors.join(','));

        elements.forEach(function (el, index) {
            el.classList.add('animate-on-scroll');
            el.style.transitionDelay = (index % 6) * 0.08 + 's';
        });

        var observer = new IntersectionObserver(
            function (entries) {
                entries.forEach(function (entry) {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('is-visible');
                        observer.unobserve(entry.target);
                    }
                });
            },
            {
                threshold: 0.1,
                rootMargin: '0px 0px -40px 0px'
            }
        );

        elements.forEach(function (el) {
            observer.observe(el);
        });
    }

    // =============================================
    // COUNT UP ANIMATION
    // =============================================
    function initCountUp() {
        if (!('IntersectionObserver' in window)) return;

        var statNumbers = document.querySelectorAll('.hero-stat-number[data-count]');
        if (!statNumbers.length) return;

        var observer = new IntersectionObserver(
            function (entries) {
                entries.forEach(function (entry) {
                    if (entry.isIntersecting) {
                        animateCount(entry.target);
                        observer.unobserve(entry.target);
                    }
                });
            },
            { threshold: 0.5 }
        );

        statNumbers.forEach(function (el) {
            observer.observe(el);
        });
    }

    function animateCount(el) {
        var target = parseInt(el.getAttribute('data-count'), 10);
        var duration = 1800;
        var startTime = null;

        function step(timestamp) {
            if (!startTime) startTime = timestamp;
            var progress = Math.min((timestamp - startTime) / duration, 1);
            var eased = 1 - Math.pow(1 - progress, 3);
            var current = Math.floor(eased * target);

            el.textContent = current;

            if (progress < 1) {
                window.requestAnimationFrame(step);
            } else {
                el.textContent = target;
            }
        }

        window.requestAnimationFrame(step);
    }

    // =============================================
    // FAQ ACCESSIBILITY
    // =============================================
    function initFAQAccessibility() {
        var faqItems = document.querySelectorAll('.faq-item');

        faqItems.forEach(function (item) {
            var summary = item.querySelector('summary');
            if (summary) {
                summary.setAttribute('role', 'button');
                summary.setAttribute('aria-expanded', item.hasAttribute('open') ? 'true' : 'false');

                item.addEventListener('toggle', function () {
                    summary.setAttribute('aria-expanded', item.open ? 'true' : 'false');
                });
            }
        });
    }

    // =============================================
    // INTERACTIVE CHECKLIST
    // =============================================
    function initInteractiveChecklist() {
        var checklist = document.getElementById('interactive-checklist');
        if (!checklist) return;

        var items = checklist.querySelectorAll('.checklist-item');
        var fillBar = document.getElementById('checklist-fill');
        var countLabel = document.getElementById('checklist-count');

        function updateProgress() {
            var total = items.length;
            var checked = 0;
            items.forEach(function (item) {
                if (item.getAttribute('data-checked') === 'true') {
                    checked++;
                }
            });

            var percent = (checked / total) * 100;
            if (fillBar) fillBar.style.width = percent + '%';
            if (countLabel) countLabel.textContent = checked + ' of ' + total + ' complete';
        }

        items.forEach(function (item) {
            item.addEventListener('click', function (e) {
                e.preventDefault();
                var isChecked = item.getAttribute('data-checked') === 'true';
                item.setAttribute('data-checked', isChecked ? 'false' : 'true');

                var checkbox = item.querySelector('input[type="checkbox"]');
                if (checkbox) checkbox.checked = !isChecked;

                updateProgress();
            });
        });

        // Initial state
        updateProgress();
    }

    // =============================================
    // HERO PARTICLES
    // =============================================
    function initHeroParticles() {
        var container = document.getElementById('hero-particles');
        if (!container) return;

        var prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        if (prefersReducedMotion) return;

        var particleCount = 20;

        for (var i = 0; i < particleCount; i++) {
            var particle = document.createElement('div');
            var size = Math.random() * 3 + 1;
            var opacity = Math.random() * 0.25 + 0.05;
            var x = Math.random() * 100;
            var y = Math.random() * 100;
            var duration = Math.random() * 10 + 8;
            var delay = Math.random() * 8;

            particle.style.cssText =
                'position:absolute;' +
                'width:' + size + 'px;' +
                'height:' + size + 'px;' +
                'background:rgba(168,85,247,' + opacity + ');' +
                'border-radius:50%;' +
                'left:' + x + '%;' +
                'top:' + y + '%;' +
                'animation:heroParticle ' + duration + 's ease-in-out infinite;' +
                'animation-delay:' + delay + 's;' +
                'pointer-events:none;';
            container.appendChild(particle);
        }

        if (!document.getElementById('hero-particle-keyframes')) {
            var style = document.createElement('style');
            style.id = 'hero-particle-keyframes';
            style.textContent =
                '@keyframes heroParticle {' +
                '0%, 100% { transform: translate(0, 0) scale(1); opacity: 0.2; }' +
                '25% { transform: translate(20px, -30px) scale(1.3); opacity: 0.5; }' +
                '50% { transform: translate(-15px, -60px) scale(1); opacity: 0.15; }' +
                '75% { transform: translate(25px, -20px) scale(1.2); opacity: 0.4; }' +
                '}';
            document.head.appendChild(style);
        }
    }

    // =============================================
    // COMING SOON PARTICLES
    // =============================================
    function initComingSoonParticles() {
        var container = document.querySelector('.coming-soon-particles');
        if (!container) return;

        var prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        if (prefersReducedMotion) return;

        for (var i = 0; i < 30; i++) {
            var particle = document.createElement('div');
            particle.style.cssText =
                'position:absolute;' +
                'width:' + (Math.random() * 4 + 1) + 'px;' +
                'height:' + (Math.random() * 4 + 1) + 'px;' +
                'background:rgba(168,85,247,' + (Math.random() * 0.3 + 0.05) + ');' +
                'border-radius:50%;' +
                'left:' + Math.random() * 100 + '%;' +
                'top:' + Math.random() * 100 + '%;' +
                'animation:particleFloat ' + (Math.random() * 8 + 6) + 's ease-in-out infinite;' +
                'animation-delay:' + Math.random() * 5 + 's;';
            container.appendChild(particle);
        }

        if (!document.getElementById('particle-keyframes')) {
            var style = document.createElement('style');
            style.id = 'particle-keyframes';
            style.textContent =
                '@keyframes particleFloat {' +
                '0%, 100% { transform: translate(0, 0) scale(1); opacity: 0.3; }' +
                '25% { transform: translate(20px, -40px) scale(1.5); opacity: 0.6; }' +
                '50% { transform: translate(-10px, -80px) scale(1); opacity: 0.3; }' +
                '75% { transform: translate(15px, -40px) scale(1.3); opacity: 0.5; }' +
                '}';
            document.head.appendChild(style);
        }
    }
})();
