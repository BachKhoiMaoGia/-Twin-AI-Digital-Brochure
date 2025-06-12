// Scroll Animation Observer
const observerOptions = {
    threshold: 0.2, // Reduced threshold for mobile
    rootMargin: '0px 0px -30px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
        }
    });
}, observerOptions);

// Detect mobile device
const isMobile = () => {
    return window.innerWidth <= 768 || 'ontouchstart' in window;
};

// Detect iOS
const isIOS = () => {
    return /iPad|iPhone|iPod/.test(navigator.userAgent);
};

// Observe all scroll-triggered elements
document.addEventListener('DOMContentLoaded', () => {
    const scrollElements = document.querySelectorAll('[data-scroll], .reveal-text');
    scrollElements.forEach(el => observer.observe(el));
    
    // Initialize page navigation
    initPageNavigation();
    
    // Initialize scroll indicator
    initScrollIndicator();
    
    // Initialize neural network animation (disabled on mobile for performance)
    if (!isMobile()) {
        initNeuralNetwork();
        initParallaxEffects();
    }
    
    // Mobile-specific optimizations
    if (isMobile()) {
        initMobileOptimizations();
    }
    
    // Add loading animation delay for mobile
    setTimeout(() => {
        document.body.classList.add('loaded');
    }, isMobile() ? 300 : 100);
});

// Mobile optimizations
function initMobileOptimizations() {
    // Disable parallax on mobile
    const parallaxElements = document.querySelectorAll('.neural-network, .main-logo');
    parallaxElements.forEach(el => {
        el.style.transform = 'none';
    });
    
    // Optimize touch scrolling
    document.body.style.webkitOverflowScrolling = 'touch';
    
    // Prevent zoom on double tap
    let lastTouchEnd = 0;
    document.addEventListener('touchend', function (event) {
        const now = (new Date()).getTime();
        if (now - lastTouchEnd <= 300) {
            event.preventDefault();
        }
        lastTouchEnd = now;
    }, false);
    
    // Handle orientation change
    window.addEventListener('orientationchange', () => {
        setTimeout(() => {
            window.scrollTo(0, window.scrollY + 1);
            window.scrollTo(0, window.scrollY - 1);
        }, 100);
    });
    
    // Optimize scroll performance on mobile
    let scrollTimer = null;
    window.addEventListener('scroll', () => {
        if (scrollTimer !== null) {
            clearTimeout(scrollTimer);
        }
        document.body.classList.add('scrolling');
        scrollTimer = setTimeout(() => {
            document.body.classList.remove('scrolling');
        }, 150);
    }, { passive: true });
}

// Page Navigation - Mobile Optimized
function initPageNavigation() {
    const navDots = document.querySelectorAll('.nav-dot');
    const pages = document.querySelectorAll('.page');
    
    // Update active dot on scroll - optimized for mobile
    const pageObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const pageNumber = entry.target.id.split('-')[1];
                updateActiveDot(pageNumber);
            }
        });
    }, { 
        threshold: isMobile() ? 0.3 : 0.5,
        rootMargin: isMobile() ? '-20% 0px -20% 0px' : '0px'
    });
    
    pages.forEach(page => pageObserver.observe(page));
    
    // Click/Touch handlers for navigation dots
    navDots.forEach((dot, index) => {
        // Handle both click and touch
        const handleNavigation = (e) => {
            e.preventDefault();
            const targetPage = document.getElementById(`page-${index + 1}`);
            if (targetPage) {
                // Smooth scroll with offset for mobile navigation
                const offset = isMobile() ? 0 : 0;
                const elementPosition = targetPage.offsetTop;
                const scrollToPosition = elementPosition + offset;
                
                window.scrollTo({
                    top: scrollToPosition,
                    behavior: 'smooth'
                });
                
                // Haptic feedback on iOS
                if (isIOS() && navigator.vibrate) {
                    navigator.vibrate(10);
                }
            }
        };
        
        dot.addEventListener('click', handleNavigation);
        dot.addEventListener('touchend', handleNavigation);
        
        // Prevent double-firing on devices that support both
        dot.addEventListener('touchend', (e) => {
            e.preventDefault();
        });
    });
}

function updateActiveDot(pageNumber) {
    const navDots = document.querySelectorAll('.nav-dot');
    navDots.forEach(dot => dot.classList.remove('active'));
    
    const activeDot = document.querySelector(`.nav-dot[data-page="${pageNumber}"]`);
    if (activeDot) {
        activeDot.classList.add('active');
    }
}

// Scroll Indicator - Touch Optimized
function initScrollIndicator() {
    const scrollIndicator = document.querySelector('.scroll-indicator');
    if (scrollIndicator) {
        const handleScrollToNext = (e) => {
            e.preventDefault();
            const page2 = document.getElementById('page-2');
            if (page2) {
                page2.scrollIntoView({ 
                    behavior: 'smooth',
                    block: 'start'
                });
                
                // Haptic feedback
                if (isIOS() && navigator.vibrate) {
                    navigator.vibrate(10);
                }
            }
        };
        
        scrollIndicator.addEventListener('click', handleScrollToNext);
        scrollIndicator.addEventListener('touchend', handleScrollToNext);
        
        // Add touch feedback
        scrollIndicator.addEventListener('touchstart', () => {
            scrollIndicator.style.transform = 'translateX(-50%) scale(0.95)';
        });
        
        scrollIndicator.addEventListener('touchend', () => {
            scrollIndicator.style.transform = 'translateX(-50%) scale(1)';
        });
    }
}

// Neural Network Animation
function initNeuralNetwork() {
    const neuralNetwork = document.querySelector('.neural-network');
    if (!neuralNetwork) return;
    
    // Create animated particles
    for (let i = 0; i < 20; i++) {
        const particle = document.createElement('div');
        particle.className = 'neural-particle';
        particle.style.cssText = `
            position: absolute;
            width: 4px;
            height: 4px;
            background: rgba(36, 166, 255, 0.8);
            border-radius: 50%;
            animation: floatParticle ${5 + Math.random() * 5}s ease-in-out infinite;
            left: ${Math.random() * 100}%;
            top: ${Math.random() * 100}%;
            animation-delay: ${Math.random() * 5}s;
        `;
        neuralNetwork.appendChild(particle);
    }
    
    // Add particle animation keyframes
    const style = document.createElement('style');
    style.textContent = `
        @keyframes floatParticle {
            0%, 100% { 
                transform: translate(0, 0) scale(1);
                opacity: 0.8;
            }
            25% { 
                transform: translate(${Math.random() * 50 - 25}px, ${Math.random() * 50 - 25}px) scale(1.2);
                opacity: 1;
            }
            50% { 
                transform: translate(${Math.random() * 100 - 50}px, ${Math.random() * 100 - 50}px) scale(0.8);
                opacity: 0.6;
            }
            75% { 
                transform: translate(${Math.random() * 50 - 25}px, ${Math.random() * 50 - 25}px) scale(1.1);
                opacity: 0.9;
            }
        }
    `;
    document.head.appendChild(style);
}

// Parallax Effects
function initParallaxEffects() {
    let ticking = false;
    
    function updateParallax() {
        const scrolled = window.pageYOffset;
        const parallaxElements = document.querySelectorAll('.neural-network, .main-logo');
        
        parallaxElements.forEach(element => {
            const speed = element.dataset.speed || 0.5;
            const yPos = -(scrolled * speed);
            element.style.transform = `translateY(${yPos}px)`;
        });
        
        ticking = false;
    }
    
    function requestTick() {
        if (!ticking) {
            requestAnimationFrame(updateParallax);
            ticking = true;
        }
    }
    
    window.addEventListener('scroll', requestTick);
}

// Logo Animation Enhancement
function enhanceLogoAnimation() {
    const logoAnimation = document.querySelector('.logo-animation');
    if (!logoAnimation) return;
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // Add neural connection animation
                createNeuralConnections(logoAnimation);
            }
        });
    }, { threshold: 0.5 });
    
    observer.observe(logoAnimation);
}

function createNeuralConnections(container) {
    const connections = 8;
    
    for (let i = 0; i < connections; i++) {
        const line = document.createElement('div');
        line.className = 'neural-connection';
        line.style.cssText = `
            position: absolute;
            height: 2px;
            background: linear-gradient(90deg, transparent, rgba(36, 166, 255, 0.8), transparent);
            animation: drawConnection 2s ease-out ${i * 0.2}s forwards;
            transform-origin: left center;
            left: 50%;
            top: 50%;
        `;
        
        // Random direction and length
        const angle = (360 / connections) * i;
        const length = 100 + Math.random() * 100;
        
        line.style.width = `${length}px`;
        line.style.transform = `translate(-50%, -50%) rotate(${angle}deg) scaleX(0)`;
        
        container.appendChild(line);
        
        setTimeout(() => {
            line.remove();
        }, 3000);
    }
    
    // Add connection animation keyframes
    const style = document.createElement('style');
    style.textContent = `
        @keyframes drawConnection {
            to { transform: translate(-50%, -50%) rotate(var(--angle)) scaleX(1); }
        }
    `;
    document.head.appendChild(style);
}

// Smooth scrolling for internal links
document.addEventListener('click', (e) => {
    if (e.target.matches('a[href^="#"]')) {
        e.preventDefault();
        const targetId = e.target.getAttribute('href').substring(1);
        const targetElement = document.getElementById(targetId);
        
        if (targetElement) {
            targetElement.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    }
});

// Add loading animation
window.addEventListener('load', () => {
    document.body.classList.add('loaded');
});

// Mouse movement parallax for page 3
document.addEventListener('mousemove', (e) => {
    const page3 = document.querySelector('.page-3');
    if (!page3) return;
    
    const rect = page3.getBoundingClientRect();
    if (rect.top <= window.innerHeight && rect.bottom >= 0) {
        const x = (e.clientX - window.innerWidth / 2) / window.innerWidth;
        const y = (e.clientY - window.innerHeight / 2) / window.innerHeight;
        
        const logo = page3.querySelector('.main-logo');
        if (logo) {
            logo.style.transform = `translate(${x * 20}px, ${y * 20}px)`;
        }
    }
});

// CTA Button Interactions
document.querySelectorAll('.cta-button').forEach(button => {
    // Mouse events for desktop
    if (!isMobile()) {
        button.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-3px) scale(1.05)';
        });
        
        button.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
        });
    }
    
    // Touch events for mobile
    button.addEventListener('touchstart', function(e) {
        this.style.transform = 'translateY(-1px) scale(0.98)';
        this.style.transition = 'transform 0.1s ease';
    }, { passive: true });
    
    button.addEventListener('touchend', function(e) {
        this.style.transform = 'translateY(0) scale(1)';
        this.style.transition = 'transform 0.3s ease';
        
        // Haptic feedback
        if (navigator.vibrate) {
            navigator.vibrate(15);
        }
    }, { passive: true });
    
    // Prevent context menu on long press
    button.addEventListener('contextmenu', function(e) {
        e.preventDefault();
    });
});

// Enhanced Smooth Scrolling for Mobile
document.addEventListener('click', (e) => {
    if (e.target.matches('a[href^="#"]')) {
        e.preventDefault();
        const targetId = e.target.getAttribute('href').substring(1);
        const targetElement = document.getElementById(targetId);
        
        if (targetElement) {
            const headerOffset = isMobile() ? 0 : 0;
            const elementPosition = targetElement.offsetTop;
            const scrollToPosition = elementPosition - headerOffset;
            
            window.scrollTo({
                top: scrollToPosition,
                behavior: 'smooth'
            });
        }
    }
});

// Touch Gesture Support for Page Navigation
let touchStartY = 0;
let touchStartX = 0;
let isScrolling = false;

document.addEventListener('touchstart', (e) => {
    touchStartY = e.touches[0].clientY;
    touchStartX = e.touches[0].clientX;
}, { passive: true });

document.addEventListener('touchmove', (e) => {
    isScrolling = true;
}, { passive: true });

document.addEventListener('touchend', (e) => {
    if (isScrolling) {
        isScrolling = false;
        return;
    }
    
    const touchEndY = e.changedTouches[0].clientY;
    const touchEndX = e.changedTouches[0].clientX;
    const deltaY = touchStartY - touchEndY;
    const deltaX = touchStartX - touchEndX;
    
    // Swipe gestures (minimal threshold to avoid conflicts)
    if (Math.abs(deltaY) > Math.abs(deltaX) && Math.abs(deltaY) > 100) {
        // Vertical swipe - could be used for page navigation
        // Currently disabled to avoid conflicts with normal scrolling
    }
}, { passive: true });

// Performance Optimization for Mobile Scrolling
let scrollTimeout;
document.addEventListener('scroll', () => {
    document.body.classList.add('scrolling');
    
    clearTimeout(scrollTimeout);
    scrollTimeout = setTimeout(() => {
        document.body.classList.remove('scrolling');
    }, 100);
}, { passive: true });

// Add progress indicator
function addProgressIndicator() {
    const progressBar = document.createElement('div');
    progressBar.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 0%;
        height: 3px;
        background: linear-gradient(90deg, var(--primary-blue), var(--secondary-blue));
        z-index: 9999;
        transition: width 0.3s ease;
    `;
    document.body.appendChild(progressBar);
    
    window.addEventListener('scroll', () => {
        const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
        const scrolled = window.scrollY;
        const progress = (scrolled / scrollHeight) * 100;
        progressBar.style.width = `${Math.min(progress, 100)}%`;
    });
}

// Initialize progress indicator
addProgressIndicator();

// iOS Viewport Fix
if (isIOS()) {
    const viewport = document.querySelector('meta[name=viewport]');
    if (viewport) {
        viewport.content = 'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no, viewport-fit=cover';
    }
}

// Android Chrome Address Bar Fix
const setVH = () => {
    const vh = window.innerHeight * 0.01;
    document.documentElement.style.setProperty('--vh', `${vh}px`);
};

setVH();
window.addEventListener('resize', setVH);
window.addEventListener('orientationchange', () => {
    setTimeout(setVH, 100);
});

console.log('Twin AI Digital Brochure loaded successfully! 🚀');
console.log(`Device type: ${isMobile() ? 'Mobile' : 'Desktop'}`);
console.log(`Platform: ${isIOS() ? 'iOS' : 'Other'}`);
