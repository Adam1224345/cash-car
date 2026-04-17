document.addEventListener('DOMContentLoaded', () => {

    // ==========================================
    // INJECT MOBILE FAB (Floating Action Button)
    // ==========================================
    const fab = document.createElement('a');
    fab.href = 'index#quote-section';
    fab.className = 'mobile-cta-fab';
    fab.innerHTML = `
        <svg viewBox="0 0 24 24" width="18" height="18" stroke="currentColor" stroke-width="2.5" fill="none"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>
        <span>Get Free Quote</span>
    `;
    document.body.appendChild(fab);

    // ================================
    // MOBILE MENU TOGGLE (Full Screen)
    // ================================
    const mobileBtn = document.querySelector('.mobile-menu-btn');
    const navLinks  = document.querySelector('.nav-links');

    if (mobileBtn && navLinks) {
        mobileBtn.addEventListener('click', () => {
            navLinks.classList.toggle('mobile-active');
            const spans = mobileBtn.querySelectorAll('span');
            document.body.style.overflow = navLinks.classList.contains('mobile-active') ? 'hidden' : '';
            
            if (navLinks.classList.contains('mobile-active')) {
                spans[0].style.transform = 'rotate(45deg) translate(5px, 6px)';
                spans[1].style.opacity   = '0';
                spans[2].style.transform = 'rotate(-45deg) translate(5px, -6px)';
            } else {
                spans.forEach(s => { s.style.transform = 'none'; s.style.opacity = '1'; });
            }
        });
    }

    // ==========================================
    // SCROLL INTERACTIONS (Navbar & FAB)
    // ==========================================
    const header = document.querySelector('.navbar');
    window.addEventListener('scroll', () => {
        const scrolled = window.scrollY > 50;
        
        // Header polish
        if (header) {
            header.style.padding = scrolled ? '8px 0' : '15px 0';
            header.style.background = scrolled ? 'rgba(255,255,255,0.95)' : '#fff';
            header.style.backdropFilter = scrolled ? 'blur(10px)' : 'none';
            header.style.boxShadow = scrolled ? 'var(--shadow-md)' : 'var(--shadow-sm)';
        }

        // FAB visibility
        if (fab) {
            fab.style.display = (scrolled && window.innerWidth < 769) ? 'flex' : 'none';
            fab.style.opacity = scrolled ? '1' : '0';
            fab.style.transform = scrolled ? 'translateY(0)' : 'translateY(20px)';
        }
    });

    // ==========================================
    // PARALLAX HERO EFFECT (Desktop Only)
    // ==========================================
    const heroContent = document.querySelector('.hero-content');
    if (heroContent && window.innerWidth > 992) {
        document.addEventListener('mousemove', (e) => {
            const x = (window.innerWidth / 2 - e.pageX) / 45;
            const y = (window.innerHeight / 2 - e.pageY) / 45;
            heroContent.style.transform = `translateX(${x}px) translateY(${y}px)`;
        });
    }

    // ==========================================
    // INTERACTIVE CARD TILT (Vanilla JS)
    // ==========================================
    const cards = document.querySelectorAll('.benefit-card, .service-card, .glass-panel');
    cards.forEach(card => {
        if (window.innerWidth > 992) {
            card.addEventListener('mousemove', (e) => {
                const rect = card.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                const xc = rect.width / 2;
                const yc = rect.height / 2;
                const dx = x - xc;
                const dy = y - yc;
                card.style.transform = `perspective(1000px) rotateY(${dx / 20}deg) rotateX(${-dy / 20}deg) translateY(-5px)`;
            });
            card.addEventListener('mouseleave', () => {
                card.style.transform = 'perspective(1000px) rotateY(0deg) rotateX(0deg) translateY(0)';
            });
        }
    });

    // ================================
    // TOAST NOTIFICATION SYSTEM
    // ================================
    function showToast(title, message, isError = false) {
        let container = document.querySelector('.toast-container');
        if (!container) {
            container = document.createElement('div');
            container.className = 'toast-container';
            document.body.appendChild(container);
        }

        const toast = document.createElement('div');
        toast.className = `custom-toast${isError ? ' error' : ''}`;
        toast.innerHTML = `<h4>${title}</h4><p>${message}</p>`;
        container.appendChild(toast);

        setTimeout(() => toast.classList.add('show'), 20);
        setTimeout(() => {
            toast.classList.remove('show');
            setTimeout(() => toast.remove(), 500);
        }, 4500);
    }

    // ================================
    // FORM LOGIC (REUSED)
    // ================================
    // FORM VALIDATION HELPERS
    // ================================
    function setFieldError(input, msg) {
        input.classList.add('input-error');
        let err = input.parentElement.querySelector('.field-error');
        if (!err) {
            err = document.createElement('span');
            err.className = 'field-error';
            input.parentElement.appendChild(err);
        }
        err.textContent = msg;
    }

    function clearFieldError(input) {
        input.classList.remove('input-error');
        const err = input.parentElement.querySelector('.field-error');
        if (err) err.remove();
    }

    function validateForm(form) {
        let valid = true;
        form.querySelectorAll('input[required], textarea[required]').forEach(input => {
            clearFieldError(input);
            const val = input.value.trim();
            if (!val) {
                setFieldError(input, 'This field is required.');
                valid = false;
            } else if (input.name === 'reg-number' && !/^[A-Z0-9 ]{2,8}$/i.test(val)) {
                setFieldError(input, 'Enter a valid UK registration (e.g. AB21 CDE).');
                valid = false;
            } else if (input.name === 'postcode' && !/^[A-Z]{1,2}\d{1,2}[A-Z]?\s*\d[A-Z]{2}$/i.test(val)) {
                setFieldError(input, 'Enter a valid UK postcode (e.g. EH10 4RF).');
                valid = false;
            } else if (input.type === 'email' && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val)) {
                setFieldError(input, 'Enter a valid email address.');
                valid = false;
            }
        });
        return valid;
    }

    const forms = document.querySelectorAll('form');
    forms.forEach(form => {
        // Clear errors on input
        form.querySelectorAll('input, textarea').forEach(input => {
            input.addEventListener('input', () => clearFieldError(input));
        });

        form.addEventListener('submit', (e) => {
            e.preventDefault();
            if (!validateForm(form)) return;

            const btn = form.querySelector('button[type="submit"]');
            if (!btn) return;

            const original = btn.innerText;
            btn.innerHTML = '<span class="spinner"></span> Processing…';
            btn.disabled = true;

            setTimeout(() => {
                btn.innerText = original;
                btn.disabled = false;
                form.reset();
                showToast('Success!', 'Thank you! We have received your details safely.');
            }, 2000);
        });
    });

    // ================================
    // FAQ ACCORDION
    // ================================
    document.querySelectorAll('.faq-question').forEach(question => {
        question.addEventListener('click', () => {
            const item = question.parentElement;
            document.querySelectorAll('.faq-item').forEach(other => {
                if (other !== item) other.classList.remove('active');
            });
            item.classList.toggle('active');
        });
    });

    // ================================
    // SCROLL REVEAL (Intersection Obs)
    // ================================
    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry, idx) => {
            if (entry.isIntersecting) {
                setTimeout(() => {
                    entry.target.classList.add('visible');
                }, idx * 100);
                revealObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });

    const selectors = ['.benefit-card', '.service-card', '.review-card', '.step-row', '.faq-item', '.contact-detail-card', '.process-item'];
    selectors.forEach(sel => {
        document.querySelectorAll(sel).forEach(el => {
            el.classList.add('reveal');
            revealObserver.observe(el);
        });
    });

    // ================================
    // SMOOTH SCROLL (REFINED)
    // ================================
    document.querySelectorAll('a[href^="#"], a[href*="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const href = this.getAttribute('href');
            const targetId = href.includes('#') ? '#' + href.split('#')[1] : null;
            
            if (targetId && targetId !== '#') {
                const target = document.querySelector(targetId);
                if (target) {
                    e.preventDefault();
                    window.scrollTo({ top: target.offsetTop - 80, behavior: 'smooth' });
                    
                    // Close mobile menu if open
                    if (navLinks.classList.contains('mobile-active')) {
                        mobileBtn.click();
                    }
                }
            }
        });
    });

    // ==========================================
    // STATS ANIMATION (Intersection Obs)
    // ==========================================
    const statsBar = document.querySelector('.stats-bar');
    if (statsBar) {
        let counted = false;
        new IntersectionObserver((entries) => {
            if (entries[0].isIntersecting && !counted) {
                counted = true;
                document.querySelectorAll('.stat-number').forEach(counter => {
                    const target = parseInt(counter.dataset.target);
                    const duration = 2000;
                    let start = null;
                    const step = (now) => {
                        if (!start) start = now;
                        const progress = Math.min((now - start) / duration, 1);
                        const value = Math.floor(progress * target);
                        counter.innerText = value.toLocaleString() + (target === 98 ? '%' : '+');
                        if (progress < 1) requestAnimationFrame(step);
                    };
                    requestAnimationFrame(step);
                });
            }
        }, { threshold: 0.5 }).observe(statsBar);
    }
});
