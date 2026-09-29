document.addEventListener('DOMContentLoaded', () => {

    /* ==========================================================================
       0. PRELOADER SCREEN FADE-OUT
       ========================================================================== */
    const preloader = document.getElementById('preloader');
    if (preloader) {
        const hidePreloader = () => {
            setTimeout(() => {
                preloader.classList.add('fade-content');
            }, 1200);
            
            setTimeout(() => {
                preloader.classList.add('loaded');
                // Start scroll reveal animations after preloader leaves
                setTimeout(initScrollReveal, 300);
            }, 1500);
        };
        if (document.readyState === 'complete') {
            hidePreloader();
        } else {
            window.addEventListener('load', hidePreloader);
        }
    } else {
        // Start immediately if no preloader
        setTimeout(initScrollReveal, 100);
    }

    /* ==========================================================================
       1. STICKY NAVBAR & NAVIGATION LOGIC
       ========================================================================== */
    const navbar = document.querySelector('.navbar');
    const navLinks = document.querySelectorAll('.nav-link');
    const sections = document.querySelectorAll('section');
    const navToggle = document.getElementById('nav-toggle');
    const mobileMenu = document.getElementById('mobile-menu');
    const mobileLinks = document.querySelectorAll('.mobile-link');

    // Initial theme set
    document.body.classList.add('bg-theme-home');

    // Scroll listener for sticky navbar styling
    window.addEventListener('scroll', () => {
        if (window.scrollY > 40) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
        
        // Update Scroll Progress indicator
        const winScroll = document.documentElement.scrollTop || document.body.scrollTop;
        const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        const scrolled = (winScroll / height) * 100;
        const progressBar = document.getElementById('scroll-progress');
        if (progressBar) {
            progressBar.style.width = scrolled + '%';
        }
        
        // Active link tracking & dynamic color themes
        let currentSectionId = 'home';
        sections.forEach(section => {
            const sectionTop = section.offsetTop - 200;
            const sectionHeight = section.offsetHeight;
            if (window.scrollY >= sectionTop && window.scrollY < sectionTop + sectionHeight) {
                currentSectionId = section.getAttribute('id');
            }
        });

        if (currentSectionId) {
            // Remove previous bg-theme classes
            document.body.className = document.body.className.replace(/\bbg-theme-\S+/g, '');
            // Add current active section theme class
            document.body.classList.add(`bg-theme-${currentSectionId}`);
        }

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${currentSectionId}`) {
                link.classList.add('active');
            }
        });
    });

    // Mobile Menu Toggle
    navToggle.addEventListener('click', () => {
        mobileMenu.classList.toggle('open');
        const icon = navToggle.querySelector('i');
        if (mobileMenu.classList.contains('open')) {
            icon.className = 'fa-solid fa-xmark';
        } else {
            icon.className = 'fa-solid fa-bars-staggered';
        }
    });

    // Close Mobile Menu on link click
    mobileLinks.forEach(link => {
        link.addEventListener('click', () => {
            mobileMenu.classList.remove('open');
            navToggle.querySelector('i').className = 'fa-solid fa-bars-staggered';
        });
    });


    /* ==========================================================================
       2. TYPING TEXT ANIMATION
       ========================================================================== */
    const typingSpan = document.getElementById('typing-text');
    const taglines = ["Web Developer", "UI/UX Designer", "Data Analytics", "Cyber Security", "Creative Coder"];
    let tagIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    let typingSpeed = 100;

    function typeEffect() {
        const currentTag = taglines[tagIndex];
        
        if (isDeleting) {
            typingSpan.textContent = currentTag.substring(0, charIndex - 1);
            charIndex--;
            typingSpeed = 50; // faster deletion
        } else {
            typingSpan.textContent = currentTag.substring(0, charIndex + 1);
            charIndex++;
            typingSpeed = 120; // standard typing
        }

        if (!isDeleting && charIndex === currentTag.length) {
            typingSpeed = 2200; // Pause at the end of word
            isDeleting = true;
        } else if (isDeleting && charIndex === 0) {
            isDeleting = false;
            tagIndex = (tagIndex + 1) % taglines.length;
            typingSpeed = 500; // Pause before typing next word
        }

        setTimeout(typeEffect, typingSpeed);
    }
    
    // Start typing effect after a small delay
    setTimeout(typeEffect, 1000);


    /* ==========================================================================
       3. INTERACTIVE CARD TILT EFFECT
       ========================================================================== */
    const tiltCards = document.querySelectorAll('.project-card, .stat-block, .certificate-card, .timeline-content, .hero-visual .organic-frame-wrapper, .about-visual .organic-frame-wrapper, .touch-card');

    tiltCards.forEach(card => {
        card.addEventListener('mouseenter', () => {
            // Apply fast, responsive transition for cursor tracking
            card.style.transition = 'transform 0.15s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.15s cubic-bezier(0.16, 1, 0.3, 1), border-color 0.25s ease';
        });

        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left; // x coordinate inside the card
            const y = e.clientY - rect.top;  // y coordinate inside the card
            
            // Set custom properties for spotlight hover effect
            card.style.setProperty('--mouse-x', `${x}px`);
            card.style.setProperty('--mouse-y', `${y}px`);
            
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            
            // Calculate rotation degree (subtle max 8 deg for clean look)
            const rotateX = ((centerY - y) / centerY) * 8; 
            const rotateY = ((x - centerX) / centerX) * 8;
            
            card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.015, 1.015, 1.015)`;
            
            // Apply slight shadow shift
            card.style.boxShadow = `${-rotateY * 1.2}px ${rotateX * 1.2}px 35px rgba(75, 24, 36, 0.12)`;
        });

        card.addEventListener('mouseleave', () => {
            // Apply smooth transition when card returns to center position
            card.style.transition = 'transform 0.7s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.7s cubic-bezier(0.16, 1, 0.3, 1), border-color 0.5s ease';
            card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)';
            card.style.boxShadow = '';
        });
    });


    /* ==========================================================================
       4. SCROLL REVEAL ANIMATIONS & PROGRESS BARS
       ========================================================================== */
    const scrollRevealElements = document.querySelectorAll('.scroll-reveal');
    const barFills = document.querySelectorAll('.bar-fill');
    let skillsAnimated = false;
    let statsAnimated = false;
 
    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                
                // If the expertise section container becomes active, animate progress bars
                if (entry.target.classList.contains('progress-bars-container') && !skillsAnimated) {
                    animateProgressBars();
                }

                // If the about section stats become active, animate stats counters
                if (entry.target.classList.contains('about-stats-container') && !statsAnimated) {
                    animateStatsCounters();
                }
            }
        });
    }, {
        threshold: 0.05,
        rootMargin: '0px 0px -80px 0px'
    });
 
    function initScrollReveal() {
        scrollRevealElements.forEach(elem => {
            revealObserver.observe(elem);
        });
    }
 
    function animateProgressBars() {
        skillsAnimated = true;
        barFills.forEach(fill => {
            const targetWidth = fill.getAttribute('data-progress');
            fill.style.width = targetWidth;
        });
    }

    function animateStatsCounters() {
        statsAnimated = true;
        const statValues = document.querySelectorAll('.stat-value');
        statValues.forEach(stat => {
            const target = parseInt(stat.getAttribute('data-target'));
            if (isNaN(target)) return;
            const suffix = stat.getAttribute('data-suffix') || '';
            let count = 0;
            const duration = 1200; // milliseconds
            const increment = target / (duration / 16); // 16ms per frame
            
            const updateCount = () => {
                count += increment;
                if (count < target) {
                    stat.textContent = Math.floor(count) + suffix;
                    requestAnimationFrame(updateCount);
                } else {
                    stat.textContent = target + suffix;
                }
            };
            updateCount();
        });
    }


    /* ==========================================================================
       5. DRIFTING SPARK STARS CANVAS ANIMATION
       ========================================================================== */
    const canvas = document.getElementById('particles-canvas');
    const ctx = canvas.getContext('2d');

    let width = canvas.width = window.innerWidth;
    let height = canvas.height = window.innerHeight;

    let stars = [];
    // Number of stars scaling by resolution
    const starCount = Math.min(45, Math.floor((width * height) / 30000));
    const maxConnectionDistance = 180;
    
    // Mouse coords representation
    let mouse = {
        x: null,
        y: null,
        targetX: 0,
        targetY: 0,
        radius: 200
    };

    let stardust = [];

    // Spark Star Object
    class SparkStar {
        constructor() {
            this.reset();
            // Stagger spawn coordinates across the screen initially
            this.x = Math.random() * width;
            this.y = Math.random() * height;
        }

        reset() {
            this.x = Math.random() * width;
            this.y = Math.random() * height;
            
            // Subtle slow speeds
            this.vx = (Math.random() - 0.5) * 0.25;
            this.vy = (Math.random() - 0.5) * 0.25;
            
            // Sizing parameters
            this.outerRadius = Math.random() * 8 + 4; // Star size
            this.innerRadius = this.outerRadius * 0.22; // Skinny points
            this.rotation = Math.random() * Math.PI;
            this.rotationSpeed = (Math.random() - 0.5) * 0.008;

            // Pick colors from the dusty rose, burgundy, beige swatches
            const rand = Math.random();
            if (rand < 0.4) {
                this.color = { r: 212, g: 128, b: 123 }; // Dusty Rose (#D4807B)
            } else if (rand < 0.7) {
                this.color = { r: 75, g: 24, b: 36 };    // Burgundy (#4B1824)
            } else {
                this.color = { r: 245, g: 225, b: 211 }; // Soft Beige (#F5E1D3)
            }

            this.alpha = Math.random() * 0.4 + 0.15;
            this.baseAlpha = this.alpha;
        }

        update() {
            this.x += this.vx;
            this.y += this.vy;
            this.rotation += this.rotationSpeed;

            // Wrap around screen boundaries
            if (this.x < -20 || this.x > width + 20 || this.y < -20 || this.y > height + 20) {
                this.reset();
                if (Math.random() > 0.5) {
                    this.x = this.vx > 0 ? -10 : width + 10;
                } else {
                    this.y = this.vy > 0 ? -10 : height + 10;
                }
            }

            // Mouse hover sway
            if (mouse.x !== null) {
                const dx = mouse.x - this.x;
                const dy = mouse.y - this.y;
                const dist = Math.sqrt(dx*dx + dy*dy);

                if (dist < mouse.radius) {
                    const force = (mouse.radius - dist) / mouse.radius;
                    // Attract gently or push depending on theme (let's pull gently)
                    this.x += (dx / dist) * force * 0.5;
                    this.y += (dy / dist) * force * 0.5;
                    this.alpha = Math.min(0.8, this.baseAlpha + force * 0.3);
                } else {
                    if (this.alpha > this.baseAlpha) {
                        this.alpha -= 0.01;
                    }
                }
            } else {
                if (this.alpha > this.baseAlpha) {
                    this.alpha -= 0.01;
                }
            }
        }

        draw() {
            ctx.save();
            ctx.translate(this.x, this.y);
            ctx.rotate(this.rotation);
            ctx.beginPath();
            
            // Draw a skinny 4-point star path
            let angle = Math.PI / 4;
            for (let i = 0; i < 8; i++) {
                let r = (i % 2 === 0) ? this.outerRadius : this.innerRadius;
                let currAngle = i * angle;
                ctx.lineTo(Math.cos(currAngle) * r, Math.sin(currAngle) * r);
            }
            
            ctx.closePath();
            ctx.fillStyle = `rgba(${this.color.r}, ${this.color.g}, ${this.color.b}, ${this.alpha})`;
            ctx.fill();
            ctx.restore();
        }
    }

    // Shimmering interactive mouse trail stardust particles
    class StardustParticle {
        constructor(x, y) {
            this.x = x;
            this.y = y;
            // Shimmering drift speeds
            this.vx = (Math.random() - 0.5) * 0.6;
            this.vy = (Math.random() - 0.5) * 0.6 - 0.15; // upward drift
            this.size = Math.random() * 2.2 + 0.6;
            this.alpha = 1.0;
            this.fadeSpeed = Math.random() * 0.018 + 0.008;
            
            const r = Math.random();
            if (r < 0.45) {
                this.color = "212, 128, 123"; // Rose
            } else if (r < 0.8) {
                this.color = "245, 225, 211"; // Beige
            } else {
                this.color = "75, 24, 36";    // Burgundy
            }
        }
        
        update() {
            this.x += this.vx;
            this.y += this.vy;
            this.alpha -= this.fadeSpeed;
            if (this.size > 0.1) {
                this.size -= 0.015;
            }
        }
        
        draw() {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(${this.color}, ${this.alpha})`;
            ctx.fill();
        }
    }

    window.addEventListener('mousemove', (e) => {
        mouse.targetX = e.clientX;
        mouse.targetY = e.clientY;
        mouse.x = e.clientX;
        mouse.y = e.clientY;

        // Spawn a couple stardust trail particles
        for (let i = 0; i < 2; i++) {
            stardust.push(new StardustParticle(e.clientX, e.clientY));
        }
    });

    window.addEventListener('mouseleave', () => {
        mouse.targetX = null;
        mouse.targetY = null;
        mouse.x = null;
        mouse.y = null;
    });

    window.addEventListener('click', (e) => {
        // Radial stardust sparkle burst on click
        const burstCount = 18;
        for (let i = 0; i < burstCount; i++) {
            const particle = new StardustParticle(e.clientX, e.clientY);
            const angle = (i / burstCount) * Math.PI * 2;
            const speed = Math.random() * 2.5 + 1.2;
            particle.vx = Math.cos(angle) * speed;
            particle.vy = Math.sin(angle) * speed - 0.2; // upwards bias
            particle.size = Math.random() * 3 + 1;
            particle.fadeSpeed = Math.random() * 0.012 + 0.008;
            stardust.push(particle);
        }
    });

    window.addEventListener('resize', () => {
        width = canvas.width = window.innerWidth;
        height = canvas.height = window.innerHeight;
        initStars();
    });

    function initStars() {
        stars = [];
        for (let i = 0; i < starCount; i++) {
            stars.push(new SparkStar());
        }
    }

    // Connect close stars with faint lines
    function drawConnections() {
        for (let i = 0; i < stars.length; i++) {
            const s1 = stars[i];

            for (let j = i + 1; j < stars.length; j++) {
                const s2 = stars[j];

                const dx = s1.x - s2.x;
                const dy = s1.y - s2.y;
                const dist = Math.sqrt(dx*dx + dy*dy);

                if (dist < maxConnectionDistance) {
                    const alpha = (1 - (dist / maxConnectionDistance)) * 0.04;
                    
                    ctx.beginPath();
                    ctx.moveTo(s1.x, s1.y);
                    ctx.lineTo(s2.x, s2.y);
                    
                    // Create line gradient using star colors
                    const grad = ctx.createLinearGradient(s1.x, s1.y, s2.x, s2.y);
                    grad.addColorStop(0, `rgba(${s1.color.r}, ${s1.color.g}, ${s1.color.b}, ${alpha})`);
                    grad.addColorStop(1, `rgba(${s2.color.r}, ${s2.color.g}, ${s2.color.b}, ${alpha})`);
                    
                    ctx.strokeStyle = grad;
                    ctx.lineWidth = 0.6;
                    ctx.stroke();
                }
            }
        }
    }

    function animate() {
        ctx.clearRect(0, 0, width, height);

        // Update and draw stars
        stars.forEach(s => {
            s.update();
            s.draw();
        });

        // Update, draw, and filter stardust
        for (let i = stardust.length - 1; i >= 0; i--) {
            const p = stardust[i];
            p.update();
            p.draw();
            if (p.alpha <= 0 || p.size <= 0.1) {
                stardust.splice(i, 1);
            }
        }

        // Draw structural networking lines
        drawConnections();

        requestAnimationFrame(animate);
    }

    /* ==========================================================================
       6. LIGHTBOX MODAL FOR CERTIFICATES
       ========================================================================== */
    const lightbox = document.getElementById('certificate-lightbox');
    const lightboxImg = document.getElementById('lightbox-img');
    const lightboxCaption = document.getElementById('lightbox-caption');
    const lightboxClose = document.querySelector('.lightbox-close');
    const certificateCards = document.querySelectorAll('.certificate-card');

    certificateCards.forEach(card => {
        card.addEventListener('click', () => {
            const img = card.querySelector('.certificate-img');
            const title = card.querySelector('.certificate-title').textContent;
            const issuer = card.querySelector('.certificate-issuer').textContent;
            
            lightboxImg.src = img.src;
            lightboxCaption.textContent = `${title} (${issuer.trim()})`;
            lightbox.classList.add('show');
            document.body.style.overflow = 'hidden'; // Disable background scrolling
        });
    });

    function closeLightbox() {
        lightbox.classList.remove('show');
        document.body.style.overflow = ''; // Restore background scrolling
    }

    lightboxClose.addEventListener('click', closeLightbox);

    // Close lightbox on click outside the image
    lightbox.addEventListener('click', (e) => {
        if (e.target === lightbox || e.target.classList.contains('lightbox-wrapper')) {
            closeLightbox();
        }
    });

    // Close lightbox on Esc key press
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && lightbox.classList.contains('show')) {
            closeLightbox();
        }
    });

    // Copy email to clipboard utility
    const copyEmailBtn = document.getElementById('copy-email-btn');
    const emailTooltip = document.getElementById('email-tooltip');
    
    if (copyEmailBtn && emailTooltip) {
        copyEmailBtn.addEventListener('click', () => {
            const emailText = "harshithasuresh35@gmail.com";
            navigator.clipboard.writeText(emailText).then(() => {
                emailTooltip.textContent = "Copied!";
                copyEmailBtn.querySelector('i').className = 'fa-solid fa-check';
                copyEmailBtn.style.color = 'var(--color-rose)';
                
                setTimeout(() => {
                    emailTooltip.textContent = "Copy email";
                    copyEmailBtn.querySelector('i').className = 'fa-regular fa-copy';
                    copyEmailBtn.style.color = '';
                }, 2000);
            }).catch(err => {
                console.error('Failed to copy text: ', err);
            });
        });
    }

    // Magnetic Button Hover Effects
    const magneticButtons = document.querySelectorAll('.btn, .play-btn-link, .touch-social-btn, .copy-email-btn');
    magneticButtons.forEach(btn => {
        btn.addEventListener('mousemove', (e) => {
            const rect = btn.getBoundingClientRect();
            const x = e.clientX - rect.left - rect.width / 2;
            const y = e.clientY - rect.top - rect.height / 2;
            
            // Gently attract the button to cursor (max offset 12px)
            btn.style.transform = `translate(${x * 0.22}px, ${y * 0.22}px)`;
            btn.style.transition = 'transform 0.1s cubic-bezier(0.16, 1, 0.3, 1)';
        });
        
        btn.addEventListener('mouseleave', () => {
            btn.style.transform = '';
            btn.style.transition = 'transform 0.5s cubic-bezier(0.16, 1, 0.3, 1)';
        });
    });

    // Run particle system initialization
    initStars();
    animate();

});
