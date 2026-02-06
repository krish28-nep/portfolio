// Default Configuration
const defaultConfig = {
    hero_tagline: "Building innovative digital solutions with modern technologies. Passionate about creating seamless user experiences.",
    about_title: "About Me",
    contact_title: "Get In Touch"
};

let config = { ...defaultConfig };

// Element SDK Initialization
if (window.elementSdk) {
    window.elementSdk.init({
        defaultConfig,
        onConfigChange: async (newConfig) => {
            config = { ...defaultConfig, ...newConfig };

            // Update hero tagline
            const heroTagline = document.getElementById('hero-tagline');
            if (heroTagline) {
                heroTagline.textContent = config.hero_tagline || defaultConfig.hero_tagline;
            }

            // Update about title
            const aboutTitle = document.getElementById('about-title');
            if (aboutTitle) {
                aboutTitle.textContent = config.about_title || defaultConfig.about_title;
            }

            // Update contact title
            const contactTitle = document.getElementById('contact-title');
            if (contactTitle) {
                contactTitle.textContent = config.contact_title || defaultConfig.contact_title;
            }
        },
        mapToCapabilities: (config) => ({
            recolorables: [],
            borderables: [],
            fontEditable: undefined,
            fontSizeable: undefined
        }),
        mapToEditPanelValues: (config) => new Map([
            ["hero_tagline", config.hero_tagline || defaultConfig.hero_tagline],
            ["about_title", config.about_title || defaultConfig.about_title],
            ["contact_title", config.contact_title || defaultConfig.contact_title]
        ])
    });
}

// Create particles
function createParticles() {
    const container = document.getElementById('particles');
    for (let i = 0; i < 20; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        particle.style.width = Math.random() * 300 + 50 + 'px';
        particle.style.height = particle.style.width;
        particle.style.left = Math.random() * 100 + '%';
        particle.style.animationDelay = Math.random() * 20 + 's';
        particle.style.animationDuration = Math.random() * 20 + 20 + 's';
        container.appendChild(particle);
    }
}
createParticles();

// Theme Toggle
const themeToggle = document.getElementById('theme-toggle');
const sunIcon = document.getElementById('sun-icon');
const moonIcon = document.getElementById('moon-icon');
const html = document.documentElement;

themeToggle.addEventListener('click', () => {
    document.body.classList.toggle('light-mode');
    sunIcon.classList.toggle('hidden');
    moonIcon.classList.toggle('hidden');
});

// Mobile Menu Toggle
const hamburger = document.getElementById('hamburger');
const mobileMenu = document.getElementById('mobile-menu');
const mobileLinks = document.querySelectorAll('.mobile-link');

hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    mobileMenu.classList.toggle('active');
});

mobileLinks.forEach(link => {
    link.addEventListener('click', () => {
        hamburger.classList.remove('active');
        mobileMenu.classList.remove('active');
    });
});



// Scroll Reveal Animation
function reveal() {
    const reveals = document.querySelectorAll('.reveal');

    reveals.forEach(element => {
        const windowHeight = window.innerHeight;
        const elementTop = element.getBoundingClientRect().top;
        const elementVisible = 150;

        if (elementTop < windowHeight - elementVisible) {
            element.classList.add('active');
        }
    });
}

window.addEventListener('scroll', reveal);
reveal();

// Contact Form Validation
const contactForm = document.getElementById('contact-form');
const nameInput = document.getElementById('name');
const emailInput = document.getElementById('email');
const messageInput = document.getElementById('message');
const nameError = document.getElementById('name-error');
const emailError = document.getElementById('email-error');
const messageError = document.getElementById('message-error');
const toast = document.getElementById('toast');

function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

function showToast(message) {
    toast.textContent = message;
    toast.classList.add('show');
    setTimeout(() => {
        toast.classList.remove('show');
    }, 3000);
}

function clearErrors() {
    nameError.classList.remove('show');
    emailError.classList.remove('show');
    messageError.classList.remove('show');
    nameInput.classList.remove('input-error');
    emailInput.classList.remove('input-error');
    messageInput.classList.remove('input-error');
}

contactForm.addEventListener('submit', (e) => {
    e.preventDefault();
    clearErrors();

    let isValid = true;

    if (!nameInput.value.trim()) {
        nameError.classList.add('show');
        nameInput.classList.add('input-error');
        isValid = false;
    }

    if (!emailInput.value.trim() || !validateEmail(emailInput.value)) {
        emailError.classList.add('show');
        emailInput.classList.add('input-error');
        isValid = false;
    }

    if (!messageInput.value.trim()) {
        messageError.classList.add('show');
        messageInput.classList.add('input-error');
        isValid = false;
    }

    if (isValid) {
        showToast('Message sent successfully! I\'ll get back to you soon.');
        contactForm.reset();
    }
});

// Input focus clear errors
nameInput.addEventListener('focus', () => {
    nameError.classList.remove('show');
    nameInput.classList.remove('input-error');
});

emailInput.addEventListener('focus', () => {
    emailError.classList.remove('show');
    emailInput.classList.remove('input-error');
});

messageInput.addEventListener('focus', () => {
    messageError.classList.remove('show');
    messageInput.classList.remove('input-error');
});

(function () { function c() { var b = a.contentDocument || a.contentWindow.document; if (b) { var d = b.createElement('script'); d.innerHTML = "window.__CF$cv$params={r:'9c994fff63c8b5d1',t:'MTc3MDM2NjkwOS4wMDAwMDA='};var a=document.createElement('script');a.nonce='';a.src='/cdn-cgi/challenge-platform/scripts/jsd/main.js';document.getElementsByTagName('head')[0].appendChild(a);"; b.getElementsByTagName('head')[0].appendChild(d) } } if (document.body) { var a = document.createElement('iframe'); a.height = 1; a.width = 1; a.style.position = 'absolute'; a.style.top = 0; a.style.left = 0; a.style.border = 'none'; a.style.visibility = 'hidden'; document.body.appendChild(a); if ('loading' !== document.readyState) c(); else if (window.addEventListener) document.addEventListener('DOMContentLoaded', c); else { var e = document.onreadystatechange || function () { }; document.onreadystatechange = function (b) { e(b); 'loading' !== document.readyState && (document.onreadystatechange = e, c()) } } } })();