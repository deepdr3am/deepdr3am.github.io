// DOM 元素
const faqItems = document.querySelectorAll('.faq-item');
const searchInput = document.getElementById('searchInput');
const contactBtn = document.querySelector('.contact-btn');

// FAQ 展開/收縮功能
function initializeFAQ() {
    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        const answer = item.querySelector('.faq-answer');
        
        question.addEventListener('click', () => {
            // 關閉其他已展開的項目
            faqItems.forEach(otherItem => {
                if (otherItem !== item && otherItem.classList.contains('active')) {
                    otherItem.classList.remove('active');
                }
            });
            
            // 切換當前項目
            item.classList.toggle('active');
            
            // 添加點擊動畫效果
            question.style.transform = 'scale(0.98)';
            setTimeout(() => {
                question.style.transform = 'scale(1)';
            }, 150);
        });
    });
}

// 搜索功能
function initializeSearch() {
    searchInput.addEventListener('input', (e) => {
        const searchTerm = e.target.value.toLowerCase().trim();
        
        faqItems.forEach(item => {
            const question = item.querySelector('.faq-question h3').textContent.toLowerCase();
            const answer = item.querySelector('.faq-answer').textContent.toLowerCase();
            
            if (question.includes(searchTerm) || answer.includes(searchTerm)) {
                item.style.display = 'block';
                item.style.animation = 'fadeInUp 0.5s ease-out';
                
                // 高亮搜索結果
                if (searchTerm && question.includes(searchTerm)) {
                    highlightSearchTerm(item.querySelector('.faq-question h3'), searchTerm);
                } else {
                    removeHighlight(item.querySelector('.faq-question h3'));
                }
            } else {
                item.style.display = 'none';
            }
        });
        
        // 如果搜索框為空，顯示所有項目並移除高亮
        if (!searchTerm) {
            faqItems.forEach(item => {
                item.style.display = 'block';
                removeHighlight(item.querySelector('.faq-question h3'));
            });
        }
    });
}

// 高亮搜索詞
function highlightSearchTerm(element, searchTerm) {
    const originalText = element.getAttribute('data-original-text') || element.textContent;
    if (!element.getAttribute('data-original-text')) {
        element.setAttribute('data-original-text', originalText);
    }
    
    const regex = new RegExp(`(${searchTerm})`, 'gi');
    const highlightedText = originalText.replace(regex, '<mark style="background-color: #fff3cd; padding: 2px 4px; border-radius: 3px;">$1</mark>');
    element.innerHTML = highlightedText;
}

// 移除高亮
function removeHighlight(element) {
    const originalText = element.getAttribute('data-original-text');
    if (originalText) {
        element.textContent = originalText;
    }
}

// 聯繫客服按鈕功能
function initializeContactButton() {
    const contactBtn = document.getElementById('contactServiceBtn');
    if (contactBtn) {
        contactBtn.addEventListener('click', () => {
            // 顯示客服忙碌訊息
            showCustomAlert('客服狀態', '目前客服人員皆在忙碌中，請稍後再試', 'warning');
        });
    }
}

// 自定義彈出視窗函數
function showCustomAlert(title, message, type = 'info') {
    // 移除已存在的彈出視窗
    const existingAlert = document.querySelector('.custom-alert');
    if (existingAlert) {
        existingAlert.remove();
    }

    // 創建彈出視窗元素
    const alertOverlay = document.createElement('div');
    alertOverlay.className = 'custom-alert';
    
    // 根據類型設定圖示和顏色
    let icon, color;
    switch (type) {
        case 'warning':
            icon = 'fas fa-exclamation-triangle';
            color = '#f59e0b';
            break;
        case 'error':
            icon = 'fas fa-times-circle';
            color = '#ef4444';
            break;
        case 'success':
            icon = 'fas fa-check-circle';
            color = '#10b981';
            break;
        default:
            icon = 'fas fa-info-circle';
            color = '#3b82f6';
    }
    
    alertOverlay.innerHTML = `
        <div class="alert-backdrop"></div>
        <div class="alert-content">
            <div class="alert-header">
                <i class="${icon}" style="color: ${color}"></i>
                <h3>${title}</h3>
            </div>
            <div class="alert-body">
                <p>${message}</p>
            </div>
            <div class="alert-footer">
                <button class="alert-btn" onclick="this.closest('.custom-alert').remove()">
                    <i class="fas fa-check"></i>
                    我知道了
                </button>
            </div>
        </div>
    `;
    
    // 添加樣式
    alertOverlay.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        z-index: 10000;
        display: flex;
        align-items: center;
        justify-content: center;
        animation: fadeIn 0.3s ease-out;
    `;
    
    document.body.appendChild(alertOverlay);
    
    // 點擊背景關閉
    alertOverlay.querySelector('.alert-backdrop').addEventListener('click', () => {
        alertOverlay.remove();
    });
    
    // ESC鍵關閉
    const handleEscape = (e) => {
        if (e.key === 'Escape') {
            alertOverlay.remove();
            document.removeEventListener('keydown', handleEscape);
        }
    };
    document.addEventListener('keydown', handleEscape);
}

// 平滑滾動到頁面頂部
function scrollToTop() {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
}

// 鍵盤快捷鍵支援
function initializeKeyboardShortcuts() {
    document.addEventListener('keydown', (e) => {
        // Ctrl/Cmd + F 聚焦到搜索框
        if ((e.ctrlKey || e.metaKey) && e.key === 'f') {
            e.preventDefault();
            searchInput.focus();
            searchInput.select();
        }
        
        // ESC 鍵清空搜索
        if (e.key === 'Escape') {
            if (document.activeElement === searchInput) {
                searchInput.value = '';
                searchInput.dispatchEvent(new Event('input'));
                searchInput.blur();
            }
        }
    });
}

// 視窗滾動效果
function initializeScrollEffects() {
    let lastScrollTop = 0;
    
    window.addEventListener('scroll', () => {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        
        // 添加滾動視差效果
        const header = document.querySelector('.header');
        if (header) {
            const scrolled = window.pageYOffset;
            const parallax = scrolled * 0.5;
            header.style.transform = `translateY(${parallax}px)`;
        }
        
        lastScrollTop = scrollTop;
    });
}

// 延遲載入動畫
function initializeIntersectionObserver() {
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
    
    // 觀察 FAQ 項目
    faqItems.forEach((item, index) => {
        item.style.opacity = '0';
        item.style.transform = 'translateY(30px)';
        item.style.transition = `opacity 0.6s ease ${index * 0.1}s, transform 0.6s ease ${index * 0.1}s`;
        observer.observe(item);
    });
}

// 觸控設備支援
function initializeTouchSupport() {
    let touchStartY = 0;
    
    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        
        question.addEventListener('touchstart', (e) => {
            touchStartY = e.touches[0].clientY;
        });
        
        question.addEventListener('touchend', (e) => {
            const touchEndY = e.changedTouches[0].clientY;
            const touchDiff = Math.abs(touchStartY - touchEndY);
            
            // 如果觸控移動距離小於 10px，視為點擊
            if (touchDiff < 10) {
                e.preventDefault();
            }
        });
    });
}

// 頁面載入完成後初始化
document.addEventListener('DOMContentLoaded', () => {
    // 初始化所有功能
    initializeFAQ();
    initializeSearch();
    initializeContactButton();
    initializeKeyboardShortcuts();
    initializeScrollEffects();
    initializeIntersectionObserver();
    initializeTouchSupport();
    
    // 顯示載入完成動畫
    document.body.style.opacity = '0';
    document.body.style.transition = 'opacity 0.5s ease';
    
    setTimeout(() => {
        document.body.style.opacity = '1';
    }, 100);
    
    console.log('FAQ 頁面載入完成！');
});

// 防止頁面離開時的意外操作
window.addEventListener('beforeunload', (e) => {
    // 如果用戶正在搜索，提醒保存搜索內容
    if (searchInput.value.trim()) {
        const message = '您的搜索內容將會丟失，確定要離開嗎？';
        e.returnValue = message;
        return message;
    }
});

// 錯誤處理
window.addEventListener('error', (e) => {
    console.error('頁面發生錯誤：', e.error);
    
    // 向用戶顯示友好的錯誤信息
    if (!document.querySelector('.error-message')) {
        const errorDiv = document.createElement('div');
        errorDiv.className = 'error-message';
        errorDiv.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: #fed7d7;
            color: #c53030;
            padding: 15px 20px;
            border-radius: 8px;
            border: 1px solid #feb2b2;
            z-index: 1000;
            max-width: 300px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.1);
        `;
        errorDiv.innerHTML = `
            <strong>系統提示</strong><br>
            頁面載入時發生了一些問題，請重新整理頁面或聯繫客服。
            <button onclick="this.parentElement.remove()" style="
                background: none;
                border: none;
                color: #c53030;
                font-weight: bold;
                float: right;
                cursor: pointer;
                margin-top: -5px;
            ">×</button>
        `;
        document.body.appendChild(errorDiv);
        
        // 5秒後自動移除錯誤信息
        setTimeout(() => {
            if (errorDiv.parentElement) {
                errorDiv.remove();
            }
        }, 5000);
    }
});

// 導出功能供外部使用
window.FAQPage = {
    scrollToTop,
    highlightSearchTerm,
    removeHighlight
};
