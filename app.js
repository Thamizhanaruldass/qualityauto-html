// Quality Auto's Website JavaScript

document.addEventListener('DOMContentLoaded', function() {
    // Initialize all components
    initCarousel();
    initNavigation();
    initSmoothScrolling();
    initFormValidation();
    initStickyHeader();
    initImageLazyLoading();
});

// Carousel Functionality
function initCarousel() {
    const slides = document.querySelectorAll('.carousel__slide');
    const dots = document.querySelectorAll('.carousel__dot');
    const prevBtn = document.getElementById('prevSlide');
    const nextBtn = document.getElementById('nextSlide');
    
    let currentSlide = 0;
    let slideInterval;
    
    // Auto advance slides every 4 seconds
    function startAutoSlide() {
        slideInterval = setInterval(() => {
            nextSlide();
        }, 4000);
    }
    
    // Stop auto slide when user interacts
    function stopAutoSlide() {
        clearInterval(slideInterval);
    }
    
    // Show specific slide
    function showSlide(index) {
        // Remove active class from all slides and dots
        slides.forEach(slide => slide.classList.remove('active'));
        dots.forEach(dot => dot.classList.remove('active'));
        
        // Add active class to current slide and dot
        slides[index].classList.add('active');
        dots[index].classList.add('active');
        
        currentSlide = index;
    }
    
    // Next slide
    function nextSlide() {
        const next = (currentSlide + 1) % slides.length;
        showSlide(next);
    }
    
    // Previous slide
    function prevSlide() {
        const prev = (currentSlide - 1 + slides.length) % slides.length;
        showSlide(prev);
    }
    
    // Event listeners for controls
    nextBtn.addEventListener('click', () => {
        stopAutoSlide();
        nextSlide();
        setTimeout(startAutoSlide, 5000); // Restart auto slide after 5 seconds
    });
    
    prevBtn.addEventListener('click', () => {
        stopAutoSlide();
        prevSlide();
        setTimeout(startAutoSlide, 5000);
    });
    
    // Event listeners for dots
    dots.forEach((dot, index) => {
        dot.addEventListener('click', () => {
            stopAutoSlide();
            showSlide(index);
            setTimeout(startAutoSlide, 5000);
        });
    });
    
    // Pause on hover
    const carousel = document.querySelector('.carousel');
    carousel.addEventListener('mouseenter', stopAutoSlide);
    carousel.addEventListener('mouseleave', startAutoSlide);
    
    // Start auto slide
    startAutoSlide();
}

// Navigation Functionality
function initNavigation() {
    const navToggle = document.getElementById('nav-toggle');
    const navMenu = document.getElementById('nav-menu');
    const navLinks = document.querySelectorAll('.nav__link');
    
    // Toggle mobile menu
    navToggle.addEventListener('click', () => {
        navToggle.classList.toggle('active');
        navMenu.classList.toggle('active');
    });
    
    // Close menu when clicking on a link
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            navToggle.classList.remove('active');
            navMenu.classList.remove('active');
        });
    });
    
    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
        if (!navToggle.contains(e.target) && !navMenu.contains(e.target)) {
            navToggle.classList.remove('active');
            navMenu.classList.remove('active');
        }
    });
    
    // Update active nav link on scroll
    updateActiveNavLink();
}

// Smooth Scrolling
function initSmoothScrolling() {
    const navLinks = document.querySelectorAll('.nav__link[href^="#"]');
    
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            
            const targetId = link.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            if (targetSection) {
                const headerHeight = document.querySelector('.header').offsetHeight;
                const targetPosition = targetSection.offsetTop - headerHeight;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// Update active navigation link based on scroll position
function updateActiveNavLink() {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav__link');
    
    window.addEventListener('scroll', () => {
        const scrollPos = window.scrollY + 200;
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            const sectionId = section.getAttribute('id');
            
            if (scrollPos >= sectionTop && scrollPos < sectionTop + sectionHeight) {
                navLinks.forEach(link => link.classList.remove('active'));
                const activeLink = document.querySelector(`.nav__link[href="#${sectionId}"]`);
                if (activeLink) {
                    activeLink.classList.add('active');
                }
            }
        });
    });
}

// Sticky Header
function initStickyHeader() {
    const header = document.getElementById('header');
    
    window.addEventListener('scroll', () => {
        if (window.scrollY > 100) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });
}

// Form Validation and Submission
function initFormValidation() {
    const form = document.getElementById('contact-form');
    const formSuccess = document.getElementById('form-success');
    
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        
        if (validateForm()) {
            submitForm();
        }
    });
    
    // Real-time validation
    const inputs = form.querySelectorAll('input, textarea, select');
    inputs.forEach(input => {
        input.addEventListener('blur', () => {
            validateField(input);
        });
        
        input.addEventListener('input', () => {
            clearFieldError(input);
        });
    });
}

function validateForm() {
    let isValid = true;
    
    // Name validation
    const name = document.getElementById('name');
    if (!name.value.trim()) {
        showFieldError(name, 'Name is required');
        isValid = false;
    } else if (name.value.trim().length < 2) {
        showFieldError(name, 'Name must be at least 2 characters');
        isValid = false;
    }
    
    // Phone validation
    const phone = document.getElementById('phone');
    const phoneRegex = /^[+]?[\d\s\-\(\)]{10,}$/;
    if (!phone.value.trim()) {
        showFieldError(phone, 'Phone number is required');
        isValid = false;
    } else if (!phoneRegex.test(phone.value.trim())) {
        showFieldError(phone, 'Please enter a valid phone number');
        isValid = false;
    }
    
    // Email validation (optional but if provided, must be valid)
    const email = document.getElementById('email');
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (email.value.trim() && !emailRegex.test(email.value.trim())) {
        showFieldError(email, 'Please enter a valid email address');
        isValid = false;
    }
    
    return isValid;
}

function validateField(field) {
    clearFieldError(field);
    
    switch (field.id) {
        case 'name':
            if (!field.value.trim()) {
                showFieldError(field, 'Name is required');
            } else if (field.value.trim().length < 2) {
                showFieldError(field, 'Name must be at least 2 characters');
            }
            break;
        case 'phone':
            const phoneRegex = /^[+]?[\d\s\-\(\)]{10,}$/;
            if (!field.value.trim()) {
                showFieldError(field, 'Phone number is required');
            } else if (!phoneRegex.test(field.value.trim())) {
                showFieldError(field, 'Please enter a valid phone number');
            }
            break;
        case 'email':
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (field.value.trim() && !emailRegex.test(field.value.trim())) {
                showFieldError(field, 'Please enter a valid email address');
            }
            break;
    }
}

function showFieldError(field, message) {
    const errorElement = document.getElementById(field.id + '-error');
    if (errorElement) {
        errorElement.textContent = message;
        errorElement.classList.add('show');
    }
    field.classList.add('error');
}

function clearFieldError(field) {
    const errorElement = document.getElementById(field.id + '-error');
    if (errorElement) {
        errorElement.classList.remove('show');
    }
    field.classList.remove('error');
}

function submitForm() {
    const form = document.getElementById('contact-form');
    const formSuccess = document.getElementById('form-success');
    const submitBtn = form.querySelector('button[type="submit"]');
    
    // Show loading state
    const originalText = submitBtn.textContent;
    submitBtn.textContent = 'Sending...';
    submitBtn.disabled = true;
    
    // Simulate form submission (in real implementation, this would be an actual API call)
    setTimeout(() => {
        // Hide form and show success message
        form.style.display = 'none';
        formSuccess.classList.remove('hidden');
        
        // Reset form after showing success
        setTimeout(() => {
            form.reset();
            form.style.display = 'block';
            formSuccess.classList.add('hidden');
            submitBtn.textContent = originalText;
            submitBtn.disabled = false;
            
            // Clear any remaining errors
            const errorMessages = form.querySelectorAll('.error-message');
            errorMessages.forEach(error => error.classList.remove('show'));
            
            const inputs = form.querySelectorAll('input, textarea, select');
            inputs.forEach(input => input.classList.remove('error'));
        }, 3000);
    }, 1000);
}

// Image Lazy Loading
function initImageLazyLoading() {
    const images = document.querySelectorAll('img[loading="lazy"]');
    
    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.setAttribute('data-loaded', 'true');
                    observer.unobserve(img);
                }
            });
        });
        
        images.forEach(img => {
            img.setAttribute('data-loaded', 'false');
            imageObserver.observe(img);
        });
    } else {
        // Fallback for older browsers
        images.forEach(img => {
            img.setAttribute('data-loaded', 'true');
        });
    }
}

// Utility function to handle resize events
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
window.addEventListener('resize', debounce(() => {
    // Close mobile menu on resize to desktop
    if (window.innerWidth > 768) {
        const navToggle = document.getElementById('nav-toggle');
        const navMenu = document.getElementById('nav-menu');
        
        navToggle.classList.remove('active');
        navMenu.classList.remove('active');
    }
}, 250));

// Add CSS class for error state
const style = document.createElement('style');
style.textContent = `
    .form-control.error {
        border-color: var(--color-error);
        box-shadow: 0 0 0 3px rgba(var(--color-error-rgb), 0.1);
    }
`;
document.head.appendChild(style);