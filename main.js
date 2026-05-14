// Initialize Lucide Icons
lucide.createIcons();

// Navbar Scroll Effect
const navbar = document.querySelector('.navbar');
window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
});

// Mobile Menu Toggle
const mobileMenuBtn = document.getElementById('mobile-menu-btn');
const navLinks = document.querySelector('.navbar .nav-links');

if (mobileMenuBtn && navLinks) {
    mobileMenuBtn.dataset.initialized = "true";
    mobileMenuBtn.onclick = null; // Clear fallback to prevent double toggle
    mobileMenuBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        navLinks.classList.toggle('active');
        const icon = mobileMenuBtn.querySelector('i');
        if (navLinks.classList.contains('active')) {
            if (icon) icon.setAttribute('data-lucide', 'x');
        } else {
            if (icon) icon.setAttribute('data-lucide', 'menu');
        }
        if (window.lucide) lucide.createIcons();
    });

    // Close menu when clicking outside or on a link
    document.addEventListener('click', (e) => {
        if (navLinks.classList.contains('active')) {
            const isClickInside = navLinks.contains(e.target) || mobileMenuBtn.contains(e.target);
            if (!isClickInside || (e.target.tagName === 'A' && !e.target.classList.contains('dropdown-trigger'))) {
                navLinks.classList.remove('active');
                const icon = mobileMenuBtn.querySelector('i');
                if (icon) icon.setAttribute('data-lucide', 'menu');
                if (window.lucide) lucide.createIcons();
            }
        }
    });

    // Dropdown toggle for mobile
    const dropdownTriggers = document.querySelectorAll('.dropdown-trigger');
    dropdownTriggers.forEach(trigger => {
        trigger.onclick = null; // Clear fallback
        trigger.addEventListener('click', (e) => {
            if (window.innerWidth <= 991) {
                e.preventDefault();
                e.stopPropagation();
                const parent = trigger.parentElement;
                parent.classList.toggle('active');
            }
        });
    });
}

// Dropdown Mobile Support
const dropdownTriggers = document.querySelectorAll('.dropdown-trigger');
dropdownTriggers.forEach(trigger => {
    trigger.addEventListener('click', (e) => {
        if (window.innerWidth <= 991) {
            e.preventDefault();
            const dropdown = trigger.parentElement;
            dropdown.classList.toggle('active');
        }
    });
});

// FAQ Toggle
const faqItems = document.querySelectorAll('.faq-item');
faqItems.forEach(item => {
    const question = item.querySelector('.faq-question');
    if (question) {
        question.addEventListener('click', () => {
            const isActive = item.classList.contains('active');
            faqItems.forEach(i => i.classList.remove('active'));
            if (!isActive) {
                item.classList.add('active');
            }
        });
    }
});

// Contact Form Submission (Full VPS Version)
const contactForm = document.getElementById('contact-form');
if (contactForm) {
    contactForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const btn = contactForm.querySelector('button');
        const originalText = btn.innerText;
        
        // Get form data
        const formData = {
            name: document.getElementById('form-name').value,
            email: document.getElementById('form-email').value,
            message: document.getElementById('form-message').value
        };

        try {
            btn.innerText = 'Mengirim...';
            btn.disabled = true;

            // Send to local PHP script
            const response = await fetch('contact.php', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData)
            });

            if (response.ok) {
                // Success feedback
                btn.innerText = 'Berhasil Dikirim!';
                btn.style.backgroundColor = '#10b981';
                contactForm.reset();
            } else {
                throw new Error('Gagal mengirim ke server.');
            }

            setTimeout(() => {
                btn.innerText = originalText;
                btn.style.backgroundColor = '';
                btn.disabled = false;
            }, 3000);

        } catch (error) {
            console.error("Error submitting form: ", error);
            btn.innerText = 'Gagal Mengirim';
            btn.style.backgroundColor = '#ef4444';
            setTimeout(() => {
                btn.innerText = originalText;
                btn.style.backgroundColor = '';
                btn.disabled = false;
            }, 3000);
        }
    });
}

// Portfolio Filter
const filterBtns = document.querySelectorAll('.filter-btn');
filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        filterBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
    });
});

// Smooth Scroll for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        const href = this.getAttribute('href');
        if (href === '#') return;
        
        e.preventDefault();
        const target = document.querySelector(href);
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Scroll Reveal Animation
const observerOptions = {
    threshold: 0.1
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

document.querySelectorAll('.service-card, .step-card, .book-card, .value-item, .article-card').forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(30px)';
    el.style.transition = 'all 0.6s cubic-bezier(0.4, 0, 0.2, 1)';
    observer.observe(el);
});
