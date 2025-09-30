// DOM Content Loaded Event
document.addEventListener('DOMContentLoaded', function() {
    // Initialize all functionality
    initNavigation();
    initSmoothScrolling();
    initAnimations();
    initActiveNavLinks();
    initDashboardSlider();
});

// Navigation Toggle for Mobile
function initNavigation() {
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');

    if (hamburger && navMenu) {
        hamburger.addEventListener('click', function() {
            hamburger.classList.toggle('active');
            navMenu.classList.toggle('active');
        });

        // Close mobile menu when clicking on a nav link
        document.querySelectorAll('.nav-link').forEach(n => 
            n.addEventListener('click', function() {
                hamburger.classList.remove('active');
                navMenu.classList.remove('active');
            })
        );

        // Close mobile menu when clicking outside
        document.addEventListener('click', function(e) {
            if (!hamburger.contains(e.target) && !navMenu.contains(e.target)) {
                hamburger.classList.remove('active');
                navMenu.classList.remove('active');
            }
        });
    }
}

// Smooth Scrolling for Internal Anchors
function initSmoothScrolling() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                const headerOffset = 80;
                const elementPosition = target.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// Initialize Animations and Interactions
function initAnimations() {
    // Fade in animation for elements
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);

    // Observe elements that should fade in
    const fadeElements = document.querySelectorAll('.skill-card, .project-card, .social-card');
    fadeElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });

    // Add hover effects to buttons and cards
    addHoverEffects();
}

// Add Hover Effects
function addHoverEffects() {
    // Enhanced button hover effects
    const buttons = document.querySelectorAll('.btn');
    buttons.forEach(button => {
        button.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-2px)';
            this.style.boxShadow = '0 5px 15px rgba(0,0,0,0.2)';
        });

        button.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
            this.style.boxShadow = 'none';
        });
    });

    // Enhanced card hover effects
    const cards = document.querySelectorAll('.skill-card, .project-card, .social-card');
    cards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-8px) scale(1.02)';
            this.style.boxShadow = '0 15px 35px rgba(0,0,0,0.1)';
        });

        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
            this.style.boxShadow = '0 5px 15px rgba(0,0,0,0.1)';
        });
    });

    // Social icon hover effects
    const socialIcons = document.querySelectorAll('.social-icon');
    socialIcons.forEach(icon => {
        icon.addEventListener('mouseenter', function() {
            this.style.transform = 'scale(1.1) rotate(5deg)';
        });

        icon.addEventListener('mouseleave', function() {
            this.style.transform = 'scale(1) rotate(0deg)';
        });
    });
}

// Highlight Active Navigation Links
function initActiveNavLinks() {
    const navLinks = document.querySelectorAll('.nav-link');
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    
    navLinks.forEach(link => {
        const linkPage = link.getAttribute('href');
        
        // Remove active class from all links first
        link.classList.remove('active');
        
        // Add active class to current page link
        if (linkPage === currentPage || 
            (currentPage === '' && linkPage === 'index.html') ||
            (currentPage === '/' && linkPage === 'index.html')) {
            link.classList.add('active');
        }
    });
}

// Scroll-based Navbar Background Change
function initScrollEffects() {
    const navbar = document.querySelector('.navbar');
    let lastScrollTop = 0;

    window.addEventListener('scroll', function() {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        
        // Add shadow when scrolling
        if (scrollTop > 100) {
            navbar.style.boxShadow = '0 2px 20px rgba(10, 25, 49, 0.3)';
        } else {
            navbar.style.boxShadow = '0 2px 10px rgba(10, 25, 49, 0.1)';
        }

        lastScrollTop = scrollTop;
    });
}

// Initialize scroll effects
initScrollEffects();

// ===== DASHBOARD SLIDER LOGIC =====
function initDashboardSlider() {
    const slider = document.querySelector('.dashboard-slider');
    if (!slider) return; // Keluar jika tidak ada slider di halaman ini

    const track = slider.querySelector('.slider-track');
    const prevButton = slider.querySelector('.slider-button.prev');
    const nextButton = slider.querySelector('.slider-button.next');
    let slides = Array.from(track.children);

    if (slides.length === 0) return; // Keluar jika tidak ada slide

    // --- Logika Infinity Loop ---
    let counter = 1; // Mulai dari slide pertama yang asli
    const firstClone = slides[0].cloneNode(true);
    const lastClone = slides[slides.length - 1].cloneNode(true);

    firstClone.id = 'first-clone';
    lastClone.id = 'last-clone';

    track.append(firstClone);
    track.prepend(lastClone);
    
    // Update daftar slides setelah kloning
    slides = Array.from(track.children);
    
    const setSliderPosition = () => {
        const slideWidth = slides[0].getBoundingClientRect().width;
        track.style.transition = 'none'; // Matikan transisi untuk reposisi instan
        track.style.transform = `translateX(${-slideWidth * counter}px)`;
    };
    
    // Pindahkan ke slide pertama yang asli saat pertama kali dimuat
    // Gunakan setTimeout untuk memastikan layout sudah stabil
    setTimeout(setSliderPosition, 100);

    // Fungsi untuk menggerakkan slider
    const moveSlider = () => {
        const slideWidth = slides[0].getBoundingClientRect().width;
        track.style.transition = 'transform 0.5s ease-in-out';
        track.style.transform = `translateX(${-slideWidth * counter}px)`;
    };

    // Tombol Next
    nextButton.addEventListener('click', () => {
        if (counter >= slides.length - 1) return; // Mencegah klik beruntun
        counter++;
        moveSlider();
    });

    // Tombol Prev
    prevButton.addEventListener('click', () => {
        if (counter <= 0) return; // Mencegah klik beruntun
        counter--;
        moveSlider();
    });

    // Event listener untuk "lompatan" ajaib setelah transisi selesai
    track.addEventListener('transitionend', () => {
        const slideWidth = slides[0].getBoundingClientRect().width;
        if (slides[counter].id === 'last-clone') {
            track.style.transition = 'none';
            counter = slides.length - 2;
            track.style.transform = `translateX(${-slideWidth * counter}px)`;
        }
        if (slides[counter].id === 'first-clone') {
            track.style.transition = 'none';
            counter = 1;
            track.style.transform = `translateX(${-slideWidth * counter}px)`;
        }
    });

    // Menyesuaikan slider saat ukuran window berubah
    window.addEventListener('resize', setSliderPosition);
}

// Form Validation (if forms are added later)
function validateForm(form) {
    const requiredFields = form.querySelectorAll('[required]');
    let isValid = true;

    requiredFields.forEach(field => {
        if (!field.value.trim()) {
            isValid = false;
            field.classList.add('error');
        } else {
            field.classList.remove('error');
        }
    });

    return isValid;
}

// Utility Functions
function debounce(func, wait, immediate) {
    let timeout;
    return function executedFunction() {
        const context = this;
        const args = arguments;
        const later = function() {
            timeout = null;
            if (!immediate) func.apply(context, args);
        };
        const callNow = immediate && !timeout;
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
        if (callNow) func.apply(context, args);
    };
}

// Lazy Loading for Images (if images are added)
function initLazyLoading() {
    const images = document.querySelectorAll('img[data-src]');
    
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.classList.remove('lazy');
                imageObserver.unobserve(img);
            }
        });
    });

    images.forEach(img => imageObserver.observe(img));
}

// Theme Toggle (for future dark mode implementation)
function initThemeToggle() {
    const themeToggle = document.querySelector('.theme-toggle');
    
    if (themeToggle) {
        themeToggle.addEventListener('click', function() {
            document.body.classList.toggle('dark-theme');
            
            // Save theme preference
            const isDark = document.body.classList.contains('dark-theme');
            localStorage.setItem('theme', isDark ? 'dark' : 'light');
        });

        // Load saved theme
        const savedTheme = localStorage.getItem('theme');
        if (savedTheme === 'dark') {
            document.body.classList.add('dark-theme');
        }
    }
}

// Keyboard Navigation Enhancement
document.addEventListener('keydown', function(e) {
    // Escape key closes mobile menu
    if (e.key === 'Escape') {
        const hamburger = document.querySelector('.hamburger');
        const navMenu = document.querySelector('.nav-menu');
        
        if (hamburger && navMenu) {
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
        }
    }
});

// Performance Monitoring
function initPerformanceMonitoring() {
    // Monitor page load time
    window.addEventListener('load', function() {
        const loadTime = performance.now();
        console.log(`Page loaded in ${Math.round(loadTime)}ms`);
    });
}

// Initialize performance monitoring in development
if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
    initPerformanceMonitoring();
}

// Export functions for testing (if needed)
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        initNavigation,
        initSmoothScrolling,
        initAnimations,
        initActiveNavLinks,
        validateForm,
        debounce
    };
}