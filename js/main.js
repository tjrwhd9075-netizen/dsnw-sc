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
const ADMIN_PASSWORD = 'dsnwsc';

// Load quotes from localStorage
function getQuotes() {
    const quotes = localStorage.getItem('dsnw_quotes');
    return quotes ? JSON.parse(quotes) : [];
}

// Save quotes to localStorage
function saveQuotes(quotes) {
    localStorage.setItem('dsnw_quotes', JSON.stringify(quotes));
}

// Generate unique ID
function generateId() {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
}

// Format date
function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('ko-KR', { year: 'numeric', month: '2-digit', day: '2-digit' });
}

quoteForm?.addEventListener('submit', (e) => {
    e.preventDefault();
    
    // Get form data
    const quoteData = {
        id: generateId(),
        company: document.getElementById('company').value,
        name: document.getElementById('name').value,
        phone: document.getElementById('phone').value,
        email: document.getElementById('email').value,
        service: document.getElementById('service').value,
        message: document.getElementById('message').value,
        password: document.getElementById('quotePassword').value,
        status: '접수',
        createdAt: new Date().toISOString()
    };
    
    // Save to localStorage
    const quotes = getQuotes();
    quotes.unshift(quoteData);
    saveQuotes(quotes);
    
    alert('견적 요청이 성공적으로 접수되었습니다.\n빠른 시일 내에 연락드리겠습니다.');
    quoteForm.reset();
    
    // Refresh quote list
    loadQuoteList();
});

// ===== Quote History =====
let selectedQuoteId = null;

function loadQuoteList() {
    const quoteTableBody = document.getElementById('quoteTableBody');
    const quoteEmpty = document.getElementById('quoteEmpty');
    const quoteTable = document.getElementById('quoteTable');
    
    if (!quoteTableBody) return;
    
    const quotes = getQuotes();
    
    if (quotes.length === 0) {
        quoteTable.style.display = 'none';
        quoteEmpty.style.display = 'flex';
        return;
    }
    
    quoteTable.style.display = 'table';
    quoteEmpty.style.display = 'none';
    
    quoteTableBody.innerHTML = quotes.map((quote, index) => `
        <tr data-id="${quote.id}" class="quote-row">
            <td>${quotes.length - index}</td>
            <td>${quote.company}</td>
            <td>${quote.service}</td>
            <td>${formatDate(quote.createdAt)}</td>
            <td><span class="status-badge status-${quote.status === '접수' ? 'pending' : 'done'}">${quote.status}</span></td>
        </tr>
    `).join('');
    
    // Add click event to rows
    document.querySelectorAll('.quote-row').forEach(row => {
        row.addEventListener('click', () => {
            selectedQuoteId = row.dataset.id;
            openPasswordModal();
        });
    });
}

// Password Modal
const passwordModal = document.getElementById('passwordModal');
const closePasswordModal = document.getElementById('closePasswordModal');
const confirmPassword = document.getElementById('confirmPassword');
const viewPasswordInput = document.getElementById('viewPassword');

function openPasswordModal() {
    if (passwordModal) {
        passwordModal.classList.add('active');
        viewPasswordInput.value = '';
        viewPasswordInput.focus();
    }
}

function closeModal() {
    if (passwordModal) {
        passwordModal.classList.remove('active');
        selectedQuoteId = null;
    }
}

closePasswordModal?.addEventListener('click', closeModal);

passwordModal?.addEventListener('click', (e) => {
    if (e.target === passwordModal) {
        closeModal();
    }
});

viewPasswordInput?.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        confirmPassword?.click();
    }
});

confirmPassword?.addEventListener('click', () => {
    const enteredPassword = viewPasswordInput.value;
    const quotes = getQuotes();
    const quote = quotes.find(q => q.id === selectedQuoteId);
    
    if (!quote) {
        alert('견적 정보를 찾을 수 없습니다.');
        closeModal();
        return;
    }
    
    // Check password (admin password or user password)
    if (enteredPassword === ADMIN_PASSWORD || enteredPassword === quote.password) {
        closeModal();
        showQuoteDetail(quote, enteredPassword === ADMIN_PASSWORD);
    } else {
        alert('비밀번호가 일치하지 않습니다.');
        viewPasswordInput.value = '';
        viewPasswordInput.focus();
    }
});

// Show Quote Detail
function showQuoteDetail(quote, isAdmin) {
    const quoteViewContainer = document.getElementById('quoteViewContainer');
    const quoteViewBody = document.getElementById('quoteViewBody');
    
    if (!quoteViewContainer || !quoteViewBody) return;
    
    quoteViewBody.innerHTML = `
        <form id="quoteEditForm">
            <div class="detail-row">
                <label>회사명</label>
                <input type="text" id="editCompany" value="${quote.company}" ${isAdmin ? '' : ''}>
            </div>
            <div class="detail-row">
                <label>담당자명</label>
                <input type="text" id="editName" value="${quote.name}">
            </div>
            <div class="detail-row">
                <label>연락처</label>
                <input type="text" id="editPhone" value="${quote.phone}">
            </div>
            <div class="detail-row">
                <label>이메일</label>
                <input type="email" id="editEmail" value="${quote.email}">
            </div>
            <div class="detail-row">
                <label>서비스 종류</label>
                <select id="editService">
                    <option value="네트워크 구축" ${quote.service === '네트워크 구축' ? 'selected' : ''}>네트워크 구축</option>
                    <option value="정보보안" ${quote.service === '정보보안' ? 'selected' : ''}>정보보안</option>
                    <option value="서버/스토리지" ${quote.service === '서버/스토리지' ? 'selected' : ''}>서버/스토리지</option>
                    <option value="클라우드" ${quote.service === '클라우드' ? 'selected' : ''}>클라우드</option>
                    <option value="영상보안(CCTV)" ${quote.service === '영상보안(CCTV)' ? 'selected' : ''}>영상보안(CCTV)</option>
                    <option value="유지보수" ${quote.service === '유지보수' ? 'selected' : ''}>유지보수</option>
                    <option value="기타" ${quote.service === '기타' ? 'selected' : ''}>기타</option>
                </select>
            </div>
            <div class="detail-row">
                <label>상세 내용</label>
                <textarea id="editMessage" rows="5">${quote.message}</textarea>
            </div>
            <div class="detail-row">
                <label>상태</label>
                <select id="editStatus" ${isAdmin ? '' : 'disabled'}>
                    <option value="접수" ${quote.status === '접수' ? 'selected' : ''}>접수</option>
                    <option value="진행중" ${quote.status === '진행중' ? 'selected' : ''}>진행중</option>
                    <option value="완료" ${quote.status === '완료' ? 'selected' : ''}>완료</option>
                </select>
            </div>
            <div class="detail-row">
                <label>요청일</label>
                <span>${formatDate(quote.createdAt)}</span>
            </div>
            <div class="detail-actions">
                <button type="button" class="btn btn-primary" id="saveQuoteEdit">저장</button>
                <button type="button" class="btn btn-danger" id="deleteQuote">삭제</button>
            </div>
        </form>
    `;
    
    quoteViewContainer.style.display = 'block';
    quoteViewContainer.dataset.quoteId = quote.id;
    
    // Save button
    document.getElementById('saveQuoteEdit')?.addEventListener('click', () => {
        saveQuoteEdit(quote.id);
    });
    
    // Delete button (admin only)
    document.getElementById('deleteQuote')?.addEventListener('click', () => {
        if (confirm('정말 삭제하시겠습니까?')) {
            deleteQuote(quote.id);
        }
    });
}

function saveQuoteEdit(quoteId) {
    const quotes = getQuotes();
    const quoteIndex = quotes.findIndex(q => q.id === quoteId);
    
    if (quoteIndex === -1) {
        alert('견적 정보를 찾을 수 없습니다.');
        return;
    }
    
    quotes[quoteIndex] = {
        ...quotes[quoteIndex],
        company: document.getElementById('editCompany').value,
        name: document.getElementById('editName').value,
        phone: document.getElementById('editPhone').value,
        email: document.getElementById('editEmail').value,
        service: document.getElementById('editService').value,
        message: document.getElementById('editMessage').value,
        status: document.getElementById('editStatus').value
    };
    
    saveQuotes(quotes);
    alert('저장되었습니다.');
    loadQuoteList();
    
    document.getElementById('quoteViewContainer').style.display = 'none';
}

function deleteQuote(quoteId) {
    let quotes = getQuotes();
    quotes = quotes.filter(q => q.id !== quoteId);
    saveQuotes(quotes);
    
    alert('삭제되었습니다.');
    loadQuoteList();
    
    document.getElementById('quoteViewContainer').style.display = 'none';
}

// Close quote view
document.getElementById('closeQuoteView')?.addEventListener('click', () => {
    document.getElementById('quoteViewContainer').style.display = 'none';
});

// Load quote list on page load
document.addEventListener('DOMContentLoaded', loadQuoteList);

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