/* ============================================
   KUNJ DARJI — PORTFOLIO SCRIPTS
   Interactivity, Animations, Form Validation
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {

    // ========== PRELOADER ==========
    const preloader = document.getElementById('preloader');
    window.addEventListener('load', () => {
        setTimeout(() => {
            preloader.classList.add('hidden');
            // Trigger hero animations after preloader hides
            triggerHeroAnimations();
        }, 600);
    });

    // Fallback: hide preloader after 3s even if load event is slow
    setTimeout(() => {
        if (!preloader.classList.contains('hidden')) {
            preloader.classList.add('hidden');
            triggerHeroAnimations();
        }
    }, 3000);


    // ========== HERO FADE-UP ANIMATIONS ==========
    function triggerHeroAnimations() {
        const fadeElements = document.querySelectorAll('.fade-up');
        fadeElements.forEach(el => {
            const delay = parseInt(el.getAttribute('data-delay')) || 0;
            setTimeout(() => {
                el.classList.add('visible');
            }, delay + 200);
        });
    }


    // ========== STICKY NAVBAR ==========
    const navbar = document.getElementById('mainNavbar');
    const navLinks = document.querySelectorAll('.nav-link');
    const sections = document.querySelectorAll('section[id]');

    function handleNavbarScroll() {
        // Add/remove scrolled class
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }

        // Highlight active nav link based on scroll position
        let current = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop - 120;
            const sectionHeight = section.offsetHeight;
            if (window.scrollY >= sectionTop && window.scrollY < sectionTop + sectionHeight) {
                current = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${current}`) {
                link.classList.add('active');
            }
        });
    }

    window.addEventListener('scroll', handleNavbarScroll);
    handleNavbarScroll(); // Run once on load


    // ========== SMOOTH SCROLL FOR NAV LINKS ==========
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = link.getAttribute('href');
            const targetEl = document.querySelector(targetId);

            if (targetEl) {
                targetEl.scrollIntoView({ behavior: 'smooth' });
            }

            // Close mobile nav after click
            const navCollapse = document.getElementById('navbarContent');
            const bsCollapse = bootstrap.Collapse.getInstance(navCollapse);
            if (bsCollapse) {
                bsCollapse.hide();
            }
        });
    });

    // Also handle all anchor links with smooth scroll
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        if (!anchor.classList.contains('nav-link')) {
            anchor.addEventListener('click', (e) => {
                const targetId = anchor.getAttribute('href');
                if (targetId && targetId !== '#') {
                    e.preventDefault();
                    const targetEl = document.querySelector(targetId);
                    if (targetEl) {
                        targetEl.scrollIntoView({ behavior: 'smooth' });
                    }
                }
            });
        }
    });


    // ========== SCROLL REVEAL ANIMATION ==========
    const scrollRevealElements = document.querySelectorAll('.scroll-reveal');

    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                revealObserver.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.15,
        rootMargin: '0px 0px -50px 0px'
    });

    scrollRevealElements.forEach(el => {
        revealObserver.observe(el);
    });


    // ========== SKILL BARS ANIMATION ==========
    const skillBars = document.querySelectorAll('.skill-bar-fill');

    const skillObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const width = entry.target.getAttribute('data-width');
                entry.target.style.width = width + '%';
                skillObserver.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.5
    });

    skillBars.forEach(bar => {
        skillObserver.observe(bar);
    });


    // ========== COUNTER ANIMATION ==========
    const statNumbers = document.querySelectorAll('.stat-number');

    function animateCounter(el) {
        const target = parseInt(el.getAttribute('data-count'));
        const duration = 1500;
        const startTime = performance.now();

        function updateCounter(currentTime) {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            // Ease out cubic
            const eased = 1 - Math.pow(1 - progress, 3);
            const current = Math.round(eased * target);
            el.textContent = current;

            if (progress < 1) {
                requestAnimationFrame(updateCounter);
            }
        }

        requestAnimationFrame(updateCounter);
    }

    const counterObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateCounter(entry.target);
                counterObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });

    statNumbers.forEach(num => {
        counterObserver.observe(num);
    });


    // ========== PROJECT FILTER ==========
    const filterBtns = document.querySelectorAll('.filter-btn');
    const projectItems = document.querySelectorAll('.project-item');

    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            // Update active state
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            const filter = btn.getAttribute('data-filter');

            projectItems.forEach(item => {
                const category = item.getAttribute('data-category');

                if (filter === 'all' || category.includes(filter)) {
                    item.classList.remove('hidden');
                    item.style.opacity = '0';
                    item.style.transform = 'translateY(20px)';
                    // Trigger reflow for animation
                    requestAnimationFrame(() => {
                        item.style.opacity = '1';
                        item.style.transform = 'translateY(0)';
                    });
                } else {
                    item.classList.add('hidden');
                }
            });
        });
    });


    // ========== DARK / LIGHT MODE TOGGLE ==========
    const themeToggle = document.getElementById('themeToggle');
    const themeIcon = document.getElementById('themeIcon');
    const htmlEl = document.documentElement;

    // Check saved theme preference
    const savedTheme = localStorage.getItem('portfolio-theme');
    if (savedTheme) {
        htmlEl.setAttribute('data-bs-theme', savedTheme);
        updateThemeIcon(savedTheme);
    }

    themeToggle.addEventListener('click', () => {
        const currentTheme = htmlEl.getAttribute('data-bs-theme');
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';

        htmlEl.setAttribute('data-bs-theme', newTheme);
        localStorage.setItem('portfolio-theme', newTheme);
        updateThemeIcon(newTheme);
    });

    function updateThemeIcon(theme) {
        if (theme === 'dark') {
            themeIcon.classList.remove('fa-sun');
            themeIcon.classList.add('fa-moon');
        } else {
            themeIcon.classList.remove('fa-moon');
            themeIcon.classList.add('fa-sun');
        }
    }


    // ========== CONTACT FORM VALIDATION ==========
    const contactForm = document.getElementById('contactForm');
    const nameInput = document.getElementById('nameInput');
    const emailInput = document.getElementById('emailInput');
    const subjectInput = document.getElementById('subjectInput');
    const messageInput = document.getElementById('messageInput');
    const submitBtn = document.getElementById('submitBtn');
    const formToast = document.getElementById('formToast');
    const toastClose = document.getElementById('toastClose');

    // Email regex
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    // Clear error on input
    [nameInput, emailInput, subjectInput, messageInput].forEach(input => {
        input.addEventListener('input', () => {
            input.classList.remove('is-invalid');
        });
    });

    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();
        let isValid = true;

        // Validate name
        if (nameInput.value.trim().length < 2) {
            nameInput.classList.add('is-invalid');
            isValid = false;
        }

        // Validate email
        if (!emailRegex.test(emailInput.value.trim())) {
            emailInput.classList.add('is-invalid');
            isValid = false;
        }

        // Validate subject
        if (subjectInput.value.trim().length < 2) {
            subjectInput.classList.add('is-invalid');
            isValid = false;
        }

        // Validate message
        if (messageInput.value.trim().length < 10) {
            messageInput.classList.add('is-invalid');
            document.getElementById('messageError').textContent =
                'Message must be at least 10 characters.';
            isValid = false;
        }

        if (!isValid) return;

        // Simulate form submission
        const btnText = submitBtn.querySelector('.btn-text');
        const btnLoading = submitBtn.querySelector('.btn-loading');
        const btnIcon = submitBtn.querySelector('.btn-icon');

        btnText.classList.add('d-none');
        btnIcon.classList.add('d-none');
        btnLoading.classList.remove('d-none');
        submitBtn.disabled = true;

        setTimeout(() => {
            // Reset button
            btnText.classList.remove('d-none');
            btnIcon.classList.remove('d-none');
            btnLoading.classList.add('d-none');
            submitBtn.disabled = false;

            // Reset form
            contactForm.reset();

            // Show success toast
            formToast.classList.add('show');

            // Auto-hide toast after 5s
            setTimeout(() => {
                formToast.classList.remove('show');
            }, 5000);
        }, 1500);
    });

    // Close toast manually
    toastClose.addEventListener('click', () => {
        formToast.classList.remove('show');
    });


    // ========== BACK TO TOP BUTTON ==========
    const backToTop = document.getElementById('backToTop');

    window.addEventListener('scroll', () => {
        if (window.scrollY > 500) {
            backToTop.classList.add('show');
        } else {
            backToTop.classList.remove('show');
        }
    });

    backToTop.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });


    // ========== RESUME BUTTON (Placeholder) ==========
    const resumeBtn = document.getElementById('resumeBtn');
    resumeBtn.addEventListener('click', (e) => {
        e.preventDefault();
        // Create a simple alert-like notification
        const notification = document.createElement('div');
        notification.style.cssText = `
            position: fixed;
            top: 90px;
            right: 30px;
            padding: 16px 24px;
            background: var(--bg-card);
            border: 1px solid var(--border-color);
            border-radius: 12px;
            box-shadow: 0 8px 30px rgba(0,0,0,0.3);
            z-index: 9999;
            font-size: 0.88rem;
            color: var(--text-primary);
            display: flex;
            align-items: center;
            gap: 10px;
            animation: toast-in 0.4s ease;
        `;
        notification.innerHTML = `
            <i class="fas fa-info-circle" style="color: var(--accent);"></i>
            Resume link will be added soon!
        `;
        document.body.appendChild(notification);

        setTimeout(() => {
            notification.style.opacity = '0';
            notification.style.transform = 'translateY(-10px)';
            notification.style.transition = '0.3s ease';
            setTimeout(() => notification.remove(), 300);
        }, 3000);
    });


    // ========== FOOTER YEAR ==========
    document.getElementById('currentYear').textContent = new Date().getFullYear();


    // ========== TYPING EFFECT FOR HERO (Subtle) ==========
    // Adds a blinking cursor to the code block
    const codeBody = document.querySelector('.code-body code');
    if (codeBody) {
        const cursor = document.createElement('span');
        cursor.style.cssText = `
            display: inline-block;
            width: 8px;
            height: 16px;
            background: var(--accent);
            margin-left: 2px;
            animation: blink 1s step-end infinite;
            vertical-align: middle;
        `;
        codeBody.appendChild(cursor);

        // Add blink keyframes dynamically
        const style = document.createElement('style');
        style.textContent = `
            @keyframes blink {
                0%, 100% { opacity: 1; }
                50% { opacity: 0; }
            }
        `;
        document.head.appendChild(style);
    }

});