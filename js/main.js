// ===== Navigation & Header =====
const header = document.getElementById('header');
const nav = document.getElementById('nav');
const hamburger = document.querySelector('.hamburger');
const navMenu = document.querySelector('.nav-menu');
const navLinks = document.querySelectorAll('.nav-menu a');

// Hamburger menu toggle
hamburger?.addEventListener('click', () => {
    navMenu.classList.toggle('active');
    hamburger.classList.toggle('active');
});

// Close mobile menu when clicking on a link
navLinks.forEach(link => {
    link.addEventListener('click', () => {
        navMenu.classList.remove('active');
        hamburger?.classList.remove('active');
    });
});

// Header scroll effect
let lastScroll = 0;
window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;
    
    if (currentScroll > 100) {
        header.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.15)';
    } else {
        header.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.1)';
    }
    
    lastScroll = currentScroll;
});

// Active navigation link based on scroll position
const sections = document.querySelectorAll('section[id]');

function highlightNavigation() {
    const scrollY = window.pageYOffset;
    
    sections.forEach(section => {
        const sectionHeight = section.offsetHeight;
        const sectionTop = section.offsetTop - 100;
        const sectionId = section.getAttribute('id');
        
        if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
            document.querySelectorAll('.nav-menu a').forEach(link => {
                link.classList.remove('active');
                if (link.getAttribute('href') === `#${sectionId}`) {
                    link.classList.add('active');
                }
            });
        }
    });
}

window.addEventListener('scroll', highlightNavigation);

// ===== Animated Statistics Counter =====
const stats = document.querySelectorAll('.stat-number');
let statsAnimated = false;

function animateStats() {
    if (statsAnimated) return;
    
    const statsSection = document.querySelector('.about-stats');
    if (!statsSection) return;
    
    const statsSectionTop = statsSection.offsetTop;
    const statsSectionHeight = statsSection.offsetHeight;
    const scrollY = window.pageYOffset;
    
    if (scrollY > statsSectionTop - window.innerHeight + 100) {
        statsAnimated = true;
        
        stats.forEach(stat => {
            const target = parseInt(stat.getAttribute('data-count'));
            const duration = 2000;
            const increment = target / (duration / 16);
            let current = 0;
            
            const updateCount = () => {
                current += increment;
                if (current < target) {
                    stat.textContent = Math.floor(current);
                    requestAnimationFrame(updateCount);
                } else {
                    stat.textContent = target + '+';
                }
            };
            
            updateCount();
        });
    }
}

window.addEventListener('scroll', animateStats);

// ===== Scroll Down Arrow =====
const scrollDown = document.querySelector('.scroll-down');
scrollDown?.addEventListener('click', () => {
    const aboutSection = document.getElementById('about');
    aboutSection?.scrollIntoView({ behavior: 'smooth' });
});

// ===== Quote Form Submission =====
const quoteForm = document.getElementById('quoteForm');

quoteForm?.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    // Get form data
    const formData = {
        company: document.getElementById('company').value,
        name: document.getElementById('name').value,
        phone: document.getElementById('phone').value,
        email: document.getElementById('email').value,
        service: document.getElementById('service').value,
        message: document.getElementById('message').value,
        status: '접수',
        created_date: new Date().toISOString()
    };
    
    try {
        // Submit to API
        const response = await fetch('tables/quotes', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(formData)
        });
        
        if (response.ok) {
            alert('견적 요청이 성공적으로 접수되었습니다.\n빠른 시일 내에 연락드리겠습니다.');
            quoteForm.reset();
        } else {
            throw new Error('Failed to submit');
        }
    } catch (error) {
        console.error('Error submitting quote:', error);
        alert('견적 요청 중 오류가 발생했습니다.\n전화로 문의해 주시기 바랍니다.\n☎ 061-XXX-XXXX');
    }
});

// ===== Notice List =====
async function loadNotices() {
    const noticeList = document.getElementById('noticeList');
    if (!noticeList) return;
    
    try {
        const response = await fetch('tables/notices?limit=10&sort=-created_at');
        const data = await response.json();
        
        if (data.data && data.data.length > 0) {
            noticeList.innerHTML = data.data.map((notice, index) => {
                const isNew = isWithinDays(notice.created_at, 7);
                const date = new Date(notice.created_at).toLocaleDateString('ko-KR');
                
                return `
                    <div class="notice-item">
                        <div class="notice-header">
                            <h3 class="notice-title">
                                ${notice.title}
                                ${isNew ? '<span class="notice-badge">NEW</span>' : ''}
                            </h3>
                            <span class="notice-date">${date}</span>
                        </div>
                        <p class="notice-preview">${notice.content.substring(0, 100)}...</p>
                    </div>
                `;
            }).join('');
        } else {
            noticeList.innerHTML = `
                <div class="notice-empty">
                    <i class="fas fa-clipboard-list"></i>
                    <p>등록된 공지사항이 없습니다.</p>
                </div>
            `;
        }
    } catch (error) {
        console.error('Error loading notices:', error);
        noticeList.innerHTML = `
            <div class="notice-empty">
                <i class="fas fa-exclamation-circle"></i>
                <p>공지사항을 불러오는 중 오류가 발생했습니다.</p>
            </div>
        `;
    }
}

// Helper function to check if date is within X days
function isWithinDays(timestamp, days) {
    const now = new Date().getTime();
    const date = new Date(timestamp).getTime();
    const diffDays = (now - date) / (1000 * 60 * 60 * 24);
    return diffDays <= days;
}

// Load notices on page load
document.addEventListener('DOMContentLoaded', loadNotices);

// ===== Scroll to Top Button =====
const scrollToTopBtn = document.getElementById('scrollToTop');

window.addEventListener('scroll', () => {
    if (window.pageYOffset > 300) {
        scrollToTopBtn.classList.add('visible');
    } else {
        scrollToTopBtn.classList.remove('visible');
    }
});

scrollToTopBtn?.addEventListener('click', () => {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
});

// ===== Smooth Scroll for all anchor links =====
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            const headerHeight = header.offsetHeight;
            const targetPosition = target.offsetTop - headerHeight;
            
            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });
        }
    });
});

// ===== Form Validation =====
const inputs = document.querySelectorAll('.quote-form input, .quote-form select, .quote-form textarea');

inputs.forEach(input => {
    input.addEventListener('blur', () => {
        if (input.hasAttribute('required') && !input.value.trim()) {
            input.style.borderColor = '#dc3545';
        } else {
            input.style.borderColor = '#e0e0e0';
        }
    });
    
    input.addEventListener('focus', () => {
        input.style.borderColor = '#0066cc';
    });
});

// Phone number formatting
const phoneInput = document.getElementById('phone');
phoneInput?.addEventListener('input', (e) => {
    let value = e.target.value.replace(/[^0-9]/g, '');
    if (value.length > 11) value = value.slice(0, 11);
    
    if (value.length > 6) {
        value = value.slice(0, 3) + '-' + value.slice(3, 7) + '-' + value.slice(7);
    } else if (value.length > 3) {
        value = value.slice(0, 3) + '-' + value.slice(3);
    }
    
    e.target.value = value;
});

// ===== Animation on Scroll =====
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

// Observe elements for animation
document.addEventListener('DOMContentLoaded', () => {
    const animatedElements = document.querySelectorAll('.service-card, .client-card, .stat-card, .feature-item');
    
    animatedElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });
});

// ===== Console Info =====
console.log('%c대신네트웍스 순천지사', 'font-size: 24px; color: #F1982A; font-weight: bold;');
console.log('%cIT 인프라의 새로운 기준', 'font-size: 14px; color: #666;');
console.log('Version: 1.0.0');
console.log('Contact: suncheon@dsnw.net');