// Quality Autos Website JavaScript
// Main functionality for carousel, navigation, and interactions

document.addEventListener('DOMContentLoaded', function() {
    
    // ==========================================
    // CAROUSEL FUNCTIONALITY
    // ==========================================
    
    const carousel = document.getElementById('carousel');
    const slides = document.querySelectorAll('.carousel__slide');
    const dots = document.querySelectorAll('.carousel__dot');
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');
    
    let currentSlide = 0;
    let autoPlayInterval;
    let isAutoPlaying = true;
    
    // Auto-play settings
    const AUTOPLAY_DURATION = 5000; // 5 seconds
    
    /**
     * CAROUSEL UPDATE INSTRUCTIONS:
     * 
     * To add a new slide:
     * 1. Add a new .carousel__slide div in index.html
     * 2. Add corresponding .carousel__dot button
     * 3. Add CSS background color in style.css for the new slide
     * 4. Update the slides and dots NodeLists will automatically include new elements
     * 
     * To modify existing slides:
     * 1. Edit the title/subtitle text in the HTML
     * 2. Update the CTA link href attribute
     * 3. Change background colors in the CSS file
     */
    
    // Initialize carousel
    function initCarousel() {
        if (slides.length === 0) return;
        
        console.log('Initializing carousel with', slides.length, 'slides');
        
        // Set first slide as active
        showSlide(0);
        
        // Start autoplay
        startAutoPlay();
        
        // Add event listeners
        setupCarouselEvents();
    }
    
    // Show specific slide
    function showSlide(index) {
        // Ensure index is within bounds
        if (index >= slides.length) index = 0;
        if (index < 0) index = slides.length - 1;
        
        console.log('Showing slide:', index);
        
        // Remove active class from all slides and dots
        slides.forEach(slide => slide.classList.remove('active'));
        dots.forEach(dot => dot.classList.remove('active'));
        
        // Add active class to current slide and dot
        if (slides[index]) {
            slides[index].classList.add('active');
        }
        if (dots[index]) {
            dots[index].classList.add('active');
        }
        
        currentSlide = index;
    }
    
    // Navigate to next slide
    function nextSlide() {
        showSlide(currentSlide + 1);
    }
    
    // Navigate to previous slide
    function prevSlide() {
        showSlide(currentSlide - 1);
    }
    
    // Start auto-play
    function startAutoPlay() {
        if (!isAutoPlaying || slides.length <= 1) return;
        
        console.log('Starting autoplay');
        stopAutoPlay(); // Clear any existing interval
        
        autoPlayInterval = setInterval(() => {
            nextSlide();
        }, AUTOPLAY_DURATION);
    }
    
    // Stop auto-play
    function stopAutoPlay() {
        if (autoPlayInterval) {
            clearInterval(autoPlayInterval);
            autoPlayInterval = null;
        }
    }
    
    // Setup carousel event listeners
    function setupCarouselEvents() {
        console.log('Setting up carousel events');
        
        // Navigation arrows
        if (prevBtn) {
            prevBtn.addEventListener('click', function(e) {
                e.preventDefault();
                console.log('Previous button clicked');
                prevSlide();
                stopAutoPlay();
                setTimeout(startAutoPlay, 1000);
            });
        }
        
        if (nextBtn) {
            nextBtn.addEventListener('click', function(e) {
                e.preventDefault();
                console.log('Next button clicked');
                nextSlide();
                stopAutoPlay();
                setTimeout(startAutoPlay, 1000);
            });
        }
        
        // Navigation dots
        dots.forEach((dot, index) => {
            dot.addEventListener('click', function(e) {
                e.preventDefault();
                console.log('Dot clicked:', index);
                showSlide(index);
                stopAutoPlay();
                setTimeout(startAutoPlay, 1000);
            });
        });
        
        // Pause on hover
        if (carousel) {
            carousel.addEventListener('mouseenter', function() {
                console.log('Carousel hovered - pausing autoplay');
                stopAutoPlay();
            });
            
            carousel.addEventListener('mouseleave', function() {
                console.log('Carousel unhovered - resuming autoplay');
                if (isAutoPlaying) {
                    startAutoPlay();
                }
            });
        }
        
        // Touch/swipe support for mobile
        setupTouchEvents();
    }
    
    // Touch and swipe events for mobile
    function setupTouchEvents() {
        let startX = 0;
        let endX = 0;
        const minSwipeDistance = 50;
        
        if (carousel) {
            carousel.addEventListener('touchstart', function(e) {
                startX = e.touches[0].clientX;
            });
            
            carousel.addEventListener('touchend', function(e) {
                endX = e.changedTouches[0].clientX;
                handleSwipe();
            });
        }
        
        function handleSwipe() {
            const swipeDistance = startX - endX;
            
            if (Math.abs(swipeDistance) > minSwipeDistance) {
                if (swipeDistance > 0) {
                    // Swipe left - next slide
                    nextSlide();
                } else {
                    // Swipe right - previous slide
                    prevSlide();
                }
                
                // Restart autoplay after swipe
                stopAutoPlay();
                setTimeout(startAutoPlay, 1000);
            }
        }
    }
    
    // ==========================================
    // MOBILE NAVIGATION
    // ==========================================
    
    const menuToggle = document.getElementById('menu-toggle');
    const nav = document.getElementById('nav');
    const navLinks = document.querySelectorAll('.nav__link');
    
    // Toggle mobile menu
    function toggleMobileMenu() {
        console.log('Toggling mobile menu');
        if (menuToggle && nav) {
            menuToggle.classList.toggle('active');
            nav.classList.toggle('active');
        }
    }
    
    // Setup mobile menu events
    if (menuToggle) {
        menuToggle.addEventListener('click', function(e) {
            e.preventDefault();
            toggleMobileMenu();
        });
    }
    
    // Close mobile menu when clicking nav links
    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            if (nav && nav.classList.contains('active')) {
                toggleMobileMenu();
            }
        });
    });
    
    // Close mobile menu when clicking outside
    document.addEventListener('click', function(e) {
        if (nav && nav.classList.contains('active') && 
            !nav.contains(e.target) && 
            !menuToggle.contains(e.target)) {
            toggleMobileMenu();
        }
    });
    
    // ==========================================
    // SMOOTH SCROLLING
    // ==========================================
    
    // Smooth scroll for anchor links
    function setupSmoothScrolling() {
        console.log('Setting up smooth scrolling');
        
        const anchorLinks = document.querySelectorAll('a[href^="#"]');
        console.log('Found', anchorLinks.length, 'anchor links');
        
        anchorLinks.forEach(anchor => {
            anchor.addEventListener('click', function(e) {
                e.preventDefault();
                
                const targetId = this.getAttribute('href');
                console.log('Clicking anchor link:', targetId);
                
                if (targetId === '#' || targetId === '#home') {
                    window.scrollTo({
                        top: 0,
                        behavior: 'smooth'
                    });
                    return;
                }
                
                const targetSection = document.querySelector(targetId);
                
                if (targetSection) {
                    const header = document.querySelector('.header');
                    const headerHeight = header ? header.offsetHeight : 80;
                    const targetPosition = targetSection.offsetTop - headerHeight - 20;
                    
                    console.log('Scrolling to position:', targetPosition);
                    
                    window.scrollTo({
                        top: targetPosition,
                        behavior: 'smooth'
                    });
                } else {
                    console.warn('Target section not found:', targetId);
                }
            });
        });
    }
    
    // ==========================================
    // CONTACT FORM
    // ==========================================
    
    function setupContactForm() {
        const contactForm = document.querySelector('.contact__form');
        console.log('Contact form found:', contactForm ? 'Yes' : 'No');
        
        if (contactForm) {
            // Ensure form fields are editable
            const formInputs = contactForm.querySelectorAll('input, select, textarea');
            formInputs.forEach(input => {
                input.removeAttribute('readonly');
                input.removeAttribute('disabled');
            });
            
            contactForm.addEventListener('submit', function(e) {
                e.preventDefault();
                console.log('Contact form submitted');
                
                // Get form data
                const formData = new FormData(contactForm);
                const name = formData.get('name') ? formData.get('name').trim() : '';
                const phone = formData.get('phone') ? formData.get('phone').trim() : '';
                const service = formData.get('service') ? formData.get('service').trim() : '';
                const message = formData.get('message') ? formData.get('message').trim() : '';
                
                console.log('Form data:', { name, phone, service, message });
                
                // Basic validation
                if (!name || !phone) {
                    alert('Please fill in all required fields (Name and Phone)');
                    return;
                }
                
                // Phone validation (basic pattern)
                const phonePattern = /^[\+]?[0-9\s\-]{10,15}$/;
                if (!phonePattern.test(phone)) {
                    alert('Please enter a valid phone number');
                    return;
                }
                
                // Simulate form submission
                const submitBtn = contactForm.querySelector('button[type="submit"]');
                const originalText = submitBtn.textContent;
                
                submitBtn.textContent = 'Sending...';
                submitBtn.disabled = true;
                
                // Simulate API call delay
                setTimeout(() => {
                    alert('Thank you for your inquiry! We will contact you within 24 hours.');
                    contactForm.reset();
                    
                    submitBtn.textContent = originalText;
                    submitBtn.disabled = false;
                }, 1500);
            });
        }
    }
    
    // ==========================================
    // SCROLL ANIMATIONS
    // ==========================================
    
    // Simple scroll reveal animation
    function handleScrollAnimations() {
        // Check if IntersectionObserver is supported
        if (!window.IntersectionObserver) {
            console.log('IntersectionObserver not supported');
            return;
        }
        
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }
            });
        }, observerOptions);
        
        // Observe service cards and feature cards
        const animatedElements = document.querySelectorAll('.service-card, .feature-card, .about__text, .about__image');
        
        animatedElements.forEach(el => {
            el.style.opacity = '0';
            el.style.transform = 'translateY(30px)';
            el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
            observer.observe(el);
        });
    }
    
    // ==========================================
    // KEYBOARD NAVIGATION
    // ==========================================
    
    function setupKeyboardNavigation() {
        document.addEventListener('keydown', function(e) {
            // Only handle carousel keyboard navigation when carousel is in viewport
            if (!carousel) return;
            
            const carouselRect = carousel.getBoundingClientRect();
            const isCarouselVisible = carouselRect.top < window.innerHeight && carouselRect.bottom > 0;
            
            if (!isCarouselVisible) return;
            
            switch(e.key) {
                case 'ArrowLeft':
                    e.preventDefault();
                    prevSlide();
                    stopAutoPlay();
                    setTimeout(startAutoPlay, 2000);
                    break;
                case 'ArrowRight':
                    e.preventDefault();
                    nextSlide();
                    stopAutoPlay();
                    setTimeout(startAutoPlay, 2000);
                    break;
                case ' ': // Spacebar
                    e.preventDefault();
                    if (isAutoPlaying) {
                        stopAutoPlay();
                        isAutoPlaying = false;
                        console.log('Autoplay paused');
                    } else {
                        isAutoPlaying = true;
                        startAutoPlay();
                        console.log('Autoplay resumed');
                    }
                    break;
            }
        });
    }
    
    // ==========================================
    // UTILITY FUNCTIONS
    // ==========================================
    
    // Debounce function for performance
    function debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }
    
    // Handle window resize
    const handleResize = debounce(() => {
        // Re-initialize carousel if needed
        if (window.innerWidth <= 768) {
            // Mobile adjustments
        }
    }, 250);
    
    window.addEventListener('resize', handleResize);
    
    // ==========================================
    // CTA TRACKING
    // ==========================================
    
    function setupCTATracking() {
        const ctaButtons = document.querySelectorAll('.carousel__cta, .service-card__link, .btn--primary, .contact-phone');
        
        ctaButtons.forEach(button => {
            button.addEventListener('click', function() {
                const buttonText = this.textContent.trim();
                const section = this.closest('section') ? this.closest('section').className : 'header';
                
                console.log('CTA Clicked:', {
                    buttonText: buttonText,
                    section: section,
                    url: this.href || 'no-url',
                    timestamp: new Date().toISOString()
                });
            });
        });
    }
    
    // ==========================================
    // INITIALIZE ALL COMPONENTS
    // ==========================================
    
    console.log('Quality Autos: Starting initialization...');
    
    // Initialize all components
    setTimeout(() => {
        initCarousel();
        setupSmoothScrolling();
        setupContactForm();
        handleScrollAnimations();
        setupKeyboardNavigation();
        setupCTATracking();
        
        // Add loading class removal
        document.body.classList.add('loaded');
        
        console.log('Quality Autos website initialized successfully!');
    }, 100);
});

// ==========================================
// PERFORMANCE MONITORING
// ==========================================

window.addEventListener('load', function() {
    if (performance.timing) {
        const loadTime = performance.timing.loadEventEnd - performance.timing.navigationStart;
        console.log('Page load time:', loadTime + 'ms');
        
        if (loadTime > 3000) {
            console.warn('Page load time is above 3 seconds. Consider optimization.');
        }
    }
});

// Error handling
window.addEventListener('error', function(e) {
    console.error('JavaScript Error:', e.error);
});

// Expose functions for testing
window.QualityAutos = {
    showSlide: function(index) {
        const event = new CustomEvent('showSlide', { detail: { index: index } });
        document.dispatchEvent(event);
    },
    toggleMobileMenu: function() {
        const menuToggle = document.getElementById('menu-toggle');
        const nav = document.getElementById('nav');
        if (menuToggle && nav) {
            menuToggle.classList.toggle('active');
            nav.classList.toggle('active');
        }
    }
};