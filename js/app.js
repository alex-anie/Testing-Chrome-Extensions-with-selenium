// DOM Elements
const menuToggle = document.querySelector('.menu-toggle');
const navLinks = document.querySelector('.nav-links');
const dots = document.querySelectorAll('.dot');
const testimonialItems = document.querySelectorAll('.testimonial-item');
const header = document.querySelector('header');

// Toggle mobile menu
menuToggle.addEventListener('click', () => {
    navLinks.classList.toggle('active');
    menuToggle.classList.toggle('active');
    
    // Change icon
    if (menuToggle.classList.contains('active')) {
        menuToggle.innerHTML = '<i class="fas fa-times"></i>';
    } else {
        menuToggle.innerHTML = '<i class="fas fa-bars"></i>';
    }
});

// Testimonial slider
dots.forEach((dot, index) => {
    dot.addEventListener('click', () => {
        // Remove active class from all dots and testimonials
        dots.forEach(d => d.classList.remove('active'));
        testimonialItems.forEach(item => item.classList.remove('active'));
        
        // Add active class to current dot and testimonial
        dot.classList.add('active');
        testimonialItems[index].classList.add('active');
    });
});

// Auto-rotate testimonials
let currentTestimonial = 0;
function rotateTestimonials() {
    // Remove active class from all dots and testimonials
    dots.forEach(dot => dot.classList.remove('active'));
    testimonialItems.forEach(item => item.classList.remove('active'));
    
    // Increment current testimonial
    currentTestimonial = (currentTestimonial + 1) % testimonialItems.length;
    
    // Add active class to current dot and testimonial
    dots[currentTestimonial].classList.add('active');
    testimonialItems[currentTestimonial].classList.add('active');
}

// Set interval for testimonial rotation (7 seconds)
if (testimonialItems.length > 1) {
    setInterval(rotateTestimonials, 7000);
}

// Scroll effects
window.addEventListener('scroll', () => {
    // Header shadow on scroll
    if (window.scrollY > 50) {
        header.style.boxShadow = '0 5px 15px rgba(0, 0, 0, 0.1)';
    } else {
        header.style.boxShadow = 'none';
    }
    
    // Reveal elements on scroll
    revealElements();
});

// Reveal elements when they come into view
function revealElements() {
    const elements = document.querySelectorAll('.card, .hero-content, .hero-image, .testimonial-content, .cta');
    
    elements.forEach(element => {
        const elementTop = element.getBoundingClientRect().top;
        const windowHeight = window.innerHeight;
        
        if (elementTop < windowHeight - 100) {
            element.style.opacity = '1';
            element.style.transform = 'translateY(0)';
        }
    });
}

// Initialize animations
document.addEventListener('DOMContentLoaded', () => {
    // Set initial opacity and transform for animation elements
    const animatedElements = document.querySelectorAll('.card, .hero-content, .hero-image, .testimonial-content, .cta');
    
    animatedElements.forEach(element => {
        element.style.opacity = '0';
        element.style.transform = 'translateY(30px)';
        element.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    });
    
    // Run initial reveal
    setTimeout(revealElements, 300);
    
    // Smooth scroll for navigation links
    const navAnchors = document.querySelectorAll('nav a');
    
    navAnchors.forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            // Close mobile menu if open
            if (navLinks.classList.contains('active')) {
                navLinks.classList.remove('active');
                menuToggle.classList.remove('active');
                menuToggle.innerHTML = '<i class="fas fa-bars"></i>';
            }
        });
    });
    
    // Add click events to buttons
    const buttons = document.querySelectorAll('.btn');
    
    buttons.forEach(button => {
        button.addEventListener('click', function() {
            // Add ripple effect
            const ripple = document.createElement('span');
            ripple.classList.add('ripple');
            this.appendChild(ripple);
            
            // Position the ripple
            const rect = this.getBoundingClientRect();
            const size = Math.max(rect.width, rect.height);
            ripple.style.width = ripple.style.height = `${size}px`;
            ripple.style.left = `${event.clientX - rect.left - size/2}px`;
            ripple.style.top = `${event.clientY - rect.top - size/2}px`;
            
            // Remove ripple after animation
            setTimeout(() => {
                ripple.remove();
            }, 600);
        });
    });
});

// Form validation for any forms that might be added later
function validateForm(form) {
    const inputs = form.querySelectorAll('input, textarea');
    let isValid = true;
    
    inputs.forEach(input => {
        if (input.hasAttribute('required') && !input.value.trim()) {
            markInvalid(input, 'This field is required');
            isValid = false;
        } else if (input.type === 'email' && input.value && !validateEmail(input.value)) {
            markInvalid(input, 'Please enter a valid email');
            isValid = false;
        } else {
            clearInvalid(input);
        }
    });
    
    return isValid;
}

function markInvalid(input, message) {
    input.classList.add('invalid');
    
    // Create or update error message
    let errorMessage = input.parentElement.querySelector('.error-message');
    if (!errorMessage) {
        errorMessage = document.createElement('div');
        errorMessage.className = 'error-message';
        input.parentElement.appendChild(errorMessage);
    }
    errorMessage.textContent = message;
}

function clearInvalid(input) {
    input.classList.remove('invalid');
    const errorMessage = input.parentElement.querySelector('.error-message');
    if (errorMessage) {
        errorMessage.remove();
    }
}

function validateEmail(email) {
    const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
}

// Add event listeners to any contact forms that might be added later
document.addEventListener('DOMContentLoaded', () => {
    const forms = document.querySelectorAll('form');
    forms.forEach(form => {
        form.addEventListener('submit', function(e) {
            if (!validateForm(this)) {
                e.preventDefault();
            }
        });
    });
});