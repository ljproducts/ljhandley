// Kawaii Portfolio JavaScript
document.addEventListener('DOMContentLoaded', function() {
    // Initialize all functionality
    initNavigation();
    initProgressAnimation();
    initScrollAnimations();
    initCaseStudies();
    initContactForm();
    initMorphingAnimation();
    initFloatingElements();
    
    // Navigation and smooth scrolling
    function initNavigation() {
        const navItems = document.querySelectorAll('.nav-item');
        const sections = document.querySelectorAll('section');
        
        // Navigation click handlers
        navItems.forEach((item, index) => {
            item.addEventListener('click', () => {
                const sectionId = item.getAttribute('data-section');
                const section = document.getElementById(sectionId);
                
                if (section) {
                    section.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            });
        });
        
        // Update active navigation on scroll
        function updateActiveNav() {
            const scrollPosition = window.pageYOffset + window.innerHeight / 2;
            
            sections.forEach((section, index) => {
                const sectionTop = section.offsetTop;
                const sectionBottom = sectionTop + section.offsetHeight;
                
                if (scrollPosition >= sectionTop && scrollPosition <= sectionBottom) {
                    navItems.forEach(nav => nav.classList.remove('active'));
                    if (navItems[index]) {
                        navItems[index].classList.add('active');
                    }
                }
            });
        }
        
        // Scroll button handlers
        const scrollButtons = document.querySelectorAll('[data-scroll]');
        scrollButtons.forEach(button => {
            button.addEventListener('click', (e) => {
                e.preventDefault();
                const target = button.getAttribute('data-scroll');
                const section = document.getElementById(target);
                
                if (section) {
                    section.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            });
        });
        
        // Attach scroll listener
        let ticking = false;
        function handleScroll() {
            updateActiveNav();
            updateProgressHeart();
            ticking = false;
        }
        
        function requestTick() {
            if (!ticking) {
                requestAnimationFrame(handleScroll);
                ticking = true;
            }
        }
        
        window.addEventListener('scroll', requestTick);
        
        // Initial call
        updateActiveNav();
    }
    
    // Progress heart animation
    function initProgressAnimation() {
        const progressTrail = document.querySelector('.progress-trail');
        const progressHeart = document.querySelector('.progress-heart');
        
        window.updateProgressHeart = function() {
            const windowHeight = window.innerHeight;
            const documentHeight = document.documentElement.scrollHeight - windowHeight;
            const scrollTop = window.pageYOffset;
            const progress = Math.min((scrollTop / documentHeight) * 100, 100);
            
            if (progressTrail) {
                progressTrail.style.setProperty('--progress', progress + '%');
                progressTrail.querySelector('::after') || 
                (progressTrail.style.background = `linear-gradient(to right, var(--kawaii-mint) ${progress}%, rgba(255, 255, 255, 0.3) ${progress}%)`);
            }
            
            // Update heart animation based on progress
            if (progressHeart) {
                if (progress > 90) {
                    progressHeart.textContent = '💖';
                    progressHeart.style.animation = 'heartbeat 1s ease-in-out infinite';
                } else if (progress > 50) {
                    progressHeart.textContent = '💕';
                } else {
                    progressHeart.textContent = '🤍';
                }
            }
        };
        
        // Create progress trail effect
        if (progressTrail) {
            progressTrail.innerHTML = '';
            const trailElement = document.createElement('div');
            trailElement.style.cssText = `
                position: absolute;
                top: 0;
                left: 0;
                height: 100%;
                width: 0%;
                background: linear-gradient(90deg, var(--kawaii-mint), var(--kawaii-sky));
                border-radius: 10px;
                transition: width 0.3s ease;
            `;
            progressTrail.appendChild(trailElement);
            
            // Update progress function
            window.updateProgressHeart = function() {
                const windowHeight = window.innerHeight;
                const documentHeight = document.documentElement.scrollHeight - windowHeight;
                const scrollTop = window.pageYOffset;
                const progress = Math.min((scrollTop / documentHeight) * 100, 100);
                
                trailElement.style.width = progress + '%';
                
                // Update heart based on progress
                if (progressHeart) {
                    if (progress > 90) {
                        progressHeart.textContent = '💖';
                    } else if (progress > 50) {
                        progressHeart.textContent = '💕';
                    } else {
                        progressHeart.textContent = '🤍';
                    }
                }
            };
        }
        
        updateProgressHeart();
    }
    
    // Scroll-triggered animations
    function initScrollAnimations() {
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach((entry, index) => {
                if (entry.isIntersecting) {
                    // Stagger the animations
                    setTimeout(() => {
                        entry.target.classList.add('animate');
                    }, index * 150);
                }
            });
        }, observerOptions);
        
        // Observe all animatable elements
        const animatableElements = document.querySelectorAll('[data-animate]');
        animatableElements.forEach(element => {
            observer.observe(element);
        });
        
        // Special timeline animation
        const timelineItems = document.querySelectorAll('.timeline-item');
        const timelineObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animate');
                }
            });
        }, { threshold: 0.3 });
        
        timelineItems.forEach(item => {
            timelineObserver.observe(item);
        });
    }
    
    // Case study navigation (separate pages, not modals)
    function initCaseStudies() {
        const projectButtons = document.querySelectorAll('.project-btn');
        const caseStudyPages = document.getElementById('caseStudyPages');
        const backButtons = document.querySelectorAll('.back-btn');
        
        // Open case study
        projectButtons.forEach(button => {
            button.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                
                const caseStudyId = button.getAttribute('data-case-study');
                openCaseStudy(caseStudyId);
            });
        });
        
        // Back button functionality
        backButtons.forEach(button => {
            button.addEventListener('click', (e) => {
                e.preventDefault();
                closeCaseStudy();
                
                // Scroll to projects section
                const target = button.getAttribute('data-back');
                if (target) {
                    setTimeout(() => {
                        const section = document.getElementById(target);
                        if (section) {
                            section.scrollIntoView({
                                behavior: 'smooth',
                                block: 'start'
                            });
                        }
                    }, 300);
                }
            });
        });
        
        function openCaseStudy(caseStudyId) {
            if (!caseStudyId) return;
            
            // Hide all case study pages
            const allCaseStudies = document.querySelectorAll('.case-study-page');
            allCaseStudies.forEach(page => page.classList.add('hidden'));
            
            // Show the specific case study
            const targetCaseStudy = document.getElementById(caseStudyId + '-study');
            if (targetCaseStudy) {
                targetCaseStudy.classList.remove('hidden');
            }
            
            // Show the case study container
            if (caseStudyPages) {
                caseStudyPages.classList.remove('hidden');
                document.body.style.overflow = 'hidden';
                
                // Scroll to top of case study
                setTimeout(() => {
                    caseStudyPages.scrollTop = 0;
                }, 100);
            }
            
            // Add kawaii entrance animation
            if (targetCaseStudy) {
                targetCaseStudy.style.opacity = '0';
                targetCaseStudy.style.transform = 'translateY(30px)';
                
                setTimeout(() => {
                    targetCaseStudy.style.transition = 'all 0.6s ease';
                    targetCaseStudy.style.opacity = '1';
                    targetCaseStudy.style.transform = 'translateY(0)';
                }, 150);
            }
        }
        
        function closeCaseStudy() {
            if (caseStudyPages) {
                caseStudyPages.classList.add('hidden');
                document.body.style.overflow = 'auto';
            }
            
            // Hide all case studies
            const allCaseStudies = document.querySelectorAll('.case-study-page');
            allCaseStudies.forEach(page => page.classList.add('hidden'));
        }
        
        // Close on escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && !caseStudyPages.classList.contains('hidden')) {
                closeCaseStudy();
            }
        });
        
        // Close on background click (optional - be careful with this)
        if (caseStudyPages) {
            caseStudyPages.addEventListener('click', (e) => {
                if (e.target === caseStudyPages) {
                    closeCaseStudy();
                }
            });
        }
    }
    
    // Contact form handling
    function initContactForm() {
        const form = document.getElementById('contactForm');
        const downloadBtn = document.getElementById('downloadResume');
        
        if (form) {
            form.addEventListener('submit', (e) => {
                e.preventDefault();
                
                const formData = new FormData(form);
                const name = formData.get('name');
                const email = formData.get('email');
                const message = formData.get('message');
                
                // Basic validation
                if (!name || !email || !message) {
                    showKawaiiMessage('Please fill in all fields! 🥺', 'error');
                    return;
                }
                
                // Email validation
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                if (!emailRegex.test(email)) {
                    showKawaiiMessage('Please enter a valid email address! 📧', 'error');
                    return;
                }
                
                // Simulate form submission
                const submitButton = form.querySelector('button[type="submit"]');
                const originalText = submitButton.innerHTML;
                
                submitButton.innerHTML = 'Sending... 🚀';
                submitButton.disabled = true;
                
                // Add kawaii sending animation
                submitButton.style.animation = 'kawaii-float 1s ease-in-out infinite';
                
                setTimeout(() => {
                    showKawaiiMessage('Thank you for your message! I\'ll get back to you within 24 hours! 💕', 'success');
                    form.reset();
                    submitButton.innerHTML = originalText;
                    submitButton.disabled = false;
                    submitButton.style.animation = '';
                }, 2000);
            });
        }
        
        // Resume download
        if (downloadBtn) {
            downloadBtn.addEventListener('click', (e) => {
                e.preventDefault();
                
                const originalText = downloadBtn.innerHTML;
                downloadBtn.innerHTML = 'Preparing... 📄';
                downloadBtn.disabled = true;
                
                setTimeout(() => {
                    showKawaiiMessage('Resume download ready! In a real implementation, this would download the PDF! 📥', 'success');
                    downloadBtn.innerHTML = originalText;
                    downloadBtn.disabled = false;
                }, 1500);
            });
        }
        
        function showKawaiiMessage(message, type) {
            // Remove existing messages
            const existingMessage = document.querySelector('.kawaii-message');
            if (existingMessage) {
                existingMessage.remove();
            }
            
            // Create kawaii message
            const messageElement = document.createElement('div');
            messageElement.className = 'kawaii-message';
            messageElement.innerHTML = message;
            
            const bgColor = type === 'error' ? 'var(--kawaii-coral)' : 'var(--kawaii-mint)';
            
            messageElement.style.cssText = `
                position: fixed;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                background: ${bgColor};
                color: var(--color-text);
                padding: 20px 30px;
                border-radius: var(--border-radius-kawaii);
                box-shadow: var(--shadow-hover);
                z-index: 10000;
                font-weight: 600;
                text-align: center;
                max-width: 400px;
                animation: kawaii-message-in 0.5s ease-out;
            `;
            
            // Add CSS animation
            const style = document.createElement('style');
            style.textContent = `
                @keyframes kawaii-message-in {
                    from {
                        opacity: 0;
                        transform: translate(-50%, -50%) scale(0.8);
                    }
                    to {
                        opacity: 1;
                        transform: translate(-50%, -50%) scale(1);
                    }
                }
            `;
            document.head.appendChild(style);
            
            document.body.appendChild(messageElement);
            
            // Auto remove after 4 seconds
            setTimeout(() => {
                messageElement.style.animation = 'kawaii-message-in 0.3s ease-in reverse';
                setTimeout(() => {
                    if (messageElement.parentNode) {
                        messageElement.remove();
                    }
                }, 300);
            }, 4000);
        }
    }
    
    // Morphing icon animation
    function initMorphingAnimation() {
        const morphingIcon = document.getElementById('morphingIcon');
        if (!morphingIcon) return;
        
        const foodIcons = ['🧁', '🍩', '🍪', '🎂', '🥧'];
        const techIcons = ['📊', '💻', '📱', '⚡', '🚀'];
        let currentIndex = 0;
        let isTech = false;
        
        setInterval(() => {
            // Fade out
            morphingIcon.style.opacity = '0';
            morphingIcon.style.transform = 'scale(0.8) rotate(180deg)';
            
            setTimeout(() => {
                // Change icon
                if (isTech) {
                    morphingIcon.textContent = foodIcons[currentIndex];
                } else {
                    morphingIcon.textContent = techIcons[currentIndex];
                }
                
                isTech = !isTech;
                currentIndex = (currentIndex + 1) % foodIcons.length;
                
                // Fade in
                morphingIcon.style.opacity = '1';
                morphingIcon.style.transform = 'scale(1) rotate(0deg)';
            }, 300);
        }, 3000);
    }
    
    // Enhanced floating elements
    function initFloatingElements() {
        const floatingElements = document.querySelectorAll('.floating-food, .floating-sparkle, .floating-heart');
        
        floatingElements.forEach((element, index) => {
            // Randomize initial positions
            const randomX = Math.random() * 90;
            const randomY = Math.random() * 90;
            const randomDelay = Math.random() * 4;
            const randomDuration = 6 + Math.random() * 4;
            
            element.style.left = randomX + '%';
            element.style.top = randomY + '%';
            element.style.animationDelay = randomDelay + 's';
            element.style.animationDuration = randomDuration + 's';
            
            // Add click interaction for fun
            element.addEventListener('click', () => {
                element.style.animation = 'none';
                element.style.transform = 'scale(1.5) rotate(360deg)';
                element.style.transition = 'all 0.5s ease';
                
                setTimeout(() => {
                    element.style.animation = `kawaii-float ${randomDuration}s ease-in-out infinite`;
                    element.style.transform = '';
                    element.style.transition = '';
                }, 500);
            });
        });
        
        // Add sparkle trail effect on mouse move
        let sparkleTimeout;
        document.addEventListener('mousemove', (e) => {
            if (Math.random() > 0.98) { // Very occasional sparkles
                createSparkle(e.clientX, e.clientY);
            }
        });
        
        function createSparkle(x, y) {
            const sparkle = document.createElement('div');
            sparkle.textContent = ['✨', '⭐', '💫'][Math.floor(Math.random() * 3)];
            sparkle.style.cssText = `
                position: fixed;
                left: ${x}px;
                top: ${y}px;
                pointer-events: none;
                z-index: 1000;
                font-size: 12px;
                animation: sparkle-fade 2s ease-out forwards;
            `;
            
            // Add sparkle animation
            const style = document.createElement('style');
            style.textContent = `
                @keyframes sparkle-fade {
                    0% {
                        opacity: 1;
                        transform: scale(0) rotate(0deg);
                    }
                    50% {
                        opacity: 1;
                        transform: scale(1) rotate(180deg);
                    }
                    100% {
                        opacity: 0;
                        transform: scale(0.5) rotate(360deg);
                    }
                }
            `;
            document.head.appendChild(style);
            
            document.body.appendChild(sparkle);
            
            setTimeout(() => {
                if (sparkle.parentNode) {
                    sparkle.remove();
                }
            }, 2000);
        }
    }
    
    // Article click handlers
    const articleCards = document.querySelectorAll('.article-card');
    articleCards.forEach(card => {
        card.addEventListener('click', () => {
            const title = card.querySelector('h3').textContent;
            
            // Create kawaii modal-like message for articles
            const messageElement = document.createElement('div');
            messageElement.innerHTML = `
                <div style="text-align: center; margin-bottom: 20px; font-size: 40px;">📚</div>
                <h3 style="margin: 0 0 10px 0; color: var(--color-text);">"${title}"</h3>
                <p style="margin: 0; color: var(--color-text-light); line-height: 1.5;">
                    This is a sample article for portfolio demonstration. 
                    In a real implementation, this would open the actual article! 🎨
                </p>
                <button onclick="this.parentElement.remove()" style="
                    margin-top: 20px;
                    padding: 10px 20px;
                    background: var(--kawaii-mint);
                    border: none;
                    border-radius: 20px;
                    color: var(--color-text);
                    font-weight: 600;
                    cursor: pointer;
                ">Got it! 👍</button>
            `;
            
            messageElement.style.cssText = `
                position: fixed;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                background: var(--color-surface);
                padding: 30px;
                border-radius: var(--border-radius-kawaii);
                box-shadow: var(--shadow-hover);
                z-index: 10000;
                max-width: 400px;
                text-align: center;
                backdrop-filter: blur(10px);
            `;
            
            document.body.appendChild(messageElement);
        });
    });
    
    // Initialize everything
    console.log('🧁 Kawaii Portfolio loaded successfully! From kitchen to product with love! 💕');
    
    // Add some kawaii console messages for fun
    console.log('🍩 Tip: Click on the floating food elements for a surprise!');
    console.log('✨ Move your mouse around to create sparkles!');
    console.log('💖 Scroll to see the progress heart change!');
    console.log('📱 New Instagram Menu Tab case study added with comprehensive product strategy!');
});