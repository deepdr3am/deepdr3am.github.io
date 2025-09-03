// 預設的訂單資料
const orderDatabase = {
    'PYTHB0920': {
        orderNumber: 'PYTHB0920',
        orderDate: '2025/09/20',
        status: '提早送達',
        statusIcon: 'fas fa-check-circle',
        receiverName: '潘*婷',
        receiverPhone: '0983-***-***',
        deliveryAddress: '新北市中和區**********',
        estimatedDelivery: '2025/09/20 送達',
        paymentMethod: '線上刷卡',
        paymentStatus: '已付款',
        totalAmount: '資料遺失',
        timeline: {
            step1: '2025/09/01 10:15',
            step2: '2025/09/02 17:30',
            step3: '2025/09/03 09:15',
            step4: '2025/09/03 18:30'
        },
        products: [
            {
                name: '資料遺失',
                description: '資料遺失',
                quantity: 1,
                price: '資料遺失',
                icon: 'fas fa-question'
            },
        ]
    },
};

// DOM 元素
const orderNumberInput = document.getElementById('orderNumber');
const searchBtn = document.getElementById('searchBtn');
const errorMessage = document.getElementById('errorMessage');
const loadingSpinner = document.getElementById('loadingSpinner');
const orderDetails = document.getElementById('orderDetails');

// 初始化
document.addEventListener('DOMContentLoaded', function() {
    initializeOrderSearch();
});

function initializeOrderSearch() {
    // 搜索按鈕點擊事件
    searchBtn.addEventListener('click', searchOrder);
    
    // Enter 鍵搜索
    orderNumberInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            searchOrder();
        }
    });
    
    // 輸入框即時驗證
    orderNumberInput.addEventListener('input', function() {
        hideErrorMessage();
        const value = this.value.toUpperCase();
        this.value = value;
        
        // 啟用/禁用搜索按鈕
        searchBtn.disabled = value.length < 3;
        if (value.length < 3) {
            searchBtn.style.opacity = '0.5';
            searchBtn.style.cursor = 'not-allowed';
        } else {
            searchBtn.style.opacity = '1';
            searchBtn.style.cursor = 'pointer';
        }
    });
    
    // 初始狀態設定
    searchBtn.disabled = true;
    searchBtn.style.opacity = '0.5';
    searchBtn.style.cursor = 'not-allowed';
}

function searchOrder() {
    const orderNumber = orderNumberInput.value.trim().toUpperCase();
    
    // 驗證輸入
    if (!orderNumber) {
        showErrorMessage('請輸入訂單編號');
        return;
    }
    
    if (orderNumber.length < 3) {
        showErrorMessage('訂單編號至少需要3個字符');
        return;
    }
    
    // 顯示載入動畫
    showLoading();
    
    // 模擬API請求延遲
    setTimeout(() => {
        const orderData = orderDatabase[orderNumber];
        
        if (orderData) {
            hideLoading();
            displayOrderDetails(orderData);
        } else {
            hideLoading();
            showErrorMessage('找不到此訂單編號，請檢查後重新輸入');
        }
    }, 1500); // 1.5秒延遲模擬網路請求
}

function showLoading() {
    hideErrorMessage();
    hideOrderDetails();
    loadingSpinner.style.display = 'block';
    searchBtn.disabled = true;
    searchBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> 查詢中...';
}

function hideLoading() {
    loadingSpinner.style.display = 'none';
    searchBtn.disabled = false;
    searchBtn.innerHTML = '<i class="fas fa-search"></i> 查詢訂單';
}

function showErrorMessage(message) {
    hideOrderDetails();
    errorMessage.querySelector('span').textContent = message;
    errorMessage.style.display = 'flex';
    
    // 3秒後自動隱藏錯誤訊息
    setTimeout(hideErrorMessage, 3000);
}

function hideErrorMessage() {
    errorMessage.style.display = 'none';
}

function hideOrderDetails() {
    orderDetails.style.display = 'none';
}

function displayOrderDetails(orderData) {
    // 更新訂單基本資訊
    document.getElementById('displayOrderNumber').textContent = orderData.orderNumber;
    document.getElementById('orderDate').textContent = orderData.orderDate;
    document.getElementById('orderStatus').textContent = orderData.status;
    document.getElementById('statusIcon').className = orderData.statusIcon;
    
    // 更新時間軸
    document.getElementById('step1Time').textContent = orderData.timeline.step1;
    document.getElementById('step2Time').textContent = orderData.timeline.step2;
    document.getElementById('step3Time').textContent = orderData.timeline.step3;
    document.getElementById('step4Time').textContent = orderData.timeline.step4;
    
    // 更新時間軸狀態
    updateTimelineStatus(orderData.status);
    
    // 更新收件資訊
    document.getElementById('receiverName').textContent = orderData.receiverName;
    document.getElementById('receiverPhone').textContent = orderData.receiverPhone;
    document.getElementById('deliveryAddress').textContent = orderData.deliveryAddress;
    document.getElementById('estimatedDelivery').textContent = orderData.estimatedDelivery;
    
    // 更新付款資訊
    document.getElementById('paymentMethod').textContent = orderData.paymentMethod;
    document.getElementById('paymentStatus').textContent = orderData.paymentStatus;
    document.getElementById('totalAmount').textContent = orderData.totalAmount;
    
    // 更新商品列表
    displayProducts(orderData.products);
    
    // 顯示訂單詳情
    orderDetails.style.display = 'block';
    
    // 平滑滾動到結果
    orderDetails.scrollIntoView({ 
        behavior: 'smooth', 
        block: 'start' 
    });
}

function updateTimelineStatus(status) {
    const timelineItems = document.querySelectorAll('.timeline-item');
    
    // 重置所有狀態
    timelineItems.forEach(item => {
        item.classList.remove('completed', 'active');
    });
    
    // 根據訂單狀態設定時間軸
    switch (status) {
        case '處理中':
            timelineItems[0].classList.add('completed');
            timelineItems[1].classList.add('active');
            break;
        case '配送中':
            timelineItems[0].classList.add('completed');
            timelineItems[1].classList.add('completed');
            timelineItems[2].classList.add('active');
            break;
        case '已送達':
            timelineItems.forEach((item, index) => {
                if (index < 4) item.classList.add('completed');
            });
            break;
        default:
            timelineItems[0].classList.add('active');
    }
}

function displayProducts(products) {
    const productList = document.getElementById('productList');
    productList.innerHTML = '';
    
    products.forEach(product => {
        const productItem = document.createElement('div');
        productItem.className = 'product-item';
        
        productItem.innerHTML = `
            <div class="product-image">
                <i class="${product.icon}"></i>
            </div>
            <div class="product-info">
                <h5>${product.name}</h5>
                <p>${product.description} × ${product.quantity}</p>
            </div>
            <div class="product-price">${product.price}</div>
        `;
        
        productList.appendChild(productItem);
    });
}

// 查看包裹位置功能
document.getElementById('trackPackageLocation').addEventListener('click', function() {
    const orderNumber = document.getElementById('displayOrderNumber').textContent;
    
    // 顯示包裹位置信息
    showPackageLocationModal(orderNumber);
});

// 顯示包裹位置彈出視窗
function showPackageLocationModal(orderNumber) {
    // 移除已存在的彈出視窗
    const existingModal = document.querySelector('.location-modal');
    if (existingModal) {
        existingModal.remove();
    }

    // 創建彈出視窗
    const modal = document.createElement('div');
    modal.className = 'location-modal';
    
    modal.innerHTML = `
        <div class="modal-backdrop"></div>
        <div class="modal-content">
            <div class="modal-header">
                <i class="fas fa-map-marker-alt" style="color: #667eea;"></i>
                <h3>包裹位置追蹤</h3>
                <button class="modal-close" onclick="this.closest('.location-modal').remove()">
                    <i class="fas fa-times"></i>
                </button>
            </div>
            <div class="modal-body">
                <div class="location-info">
                    <h4>訂單編號: ${orderNumber}</h4>
                    <div class="current-location">
                        <i class="fas fa-truck"></i>
                        <div>
                            <strong>目前位置</strong>
                            <p>資訊遺失</p>
                            <small>最後更新: ${new Date().toLocaleString('zh-TW')}</small>
                        </div>
                    </div>
                    <div class="location-map">
                        <div class="map-placeholder">
                            <i class="fas fa-map"></i>
                            <p>地圖載入失敗...</p>
                        </div>
                    </div>
                    <div class="delivery-status hacked">
                        <div class="hacked-warning">
                            <i class="fas fa-exclamation-triangle"></i>
                            <span>警告：系統已被入侵</span>
                        </div>
                        <p><strong>預計送達:</strong> <span class="corrupted-text">資料已被竄改</span></p>
                        <p><strong>配送狀態:</strong> <span class="hacked-status">⚠️ 資訊已被竊取</span></p>
                        <div class="hacker-message">
                            <p class="glitch-text">您的配送資訊已落入我們手中...</p>
                            <p>想要找回您的包裹？</p>
                            <a href="hacker-challenge.html" class="hacker-link" target="_blank">
                                <i class="fas fa-skull"></i>
                                點擊這裡接受挑戰
                            </a>
                        </div>
                    </div>
                </div>
            </div>
            <div class="modal-footer">
                <button class="modal-btn" onclick="this.closest('.location-modal').remove()">
                    <i class="fas fa-check"></i>
                    確認
                </button>
            </div>
        </div>
    `;
    
    // 添加樣式
    modal.style.cssText = `
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
    
    document.body.appendChild(modal);
    
    // 點擊背景關閉
    modal.querySelector('.modal-backdrop').addEventListener('click', () => {
        modal.remove();
    });
}

// 複製訂單編號功能
document.getElementById('displayOrderNumber').addEventListener('click', function() {
    const orderNumber = this.textContent;
    
    // 使用 Clipboard API 複製文字
    if (navigator.clipboard) {
        navigator.clipboard.writeText(orderNumber).then(() => {
            showToast('訂單編號已複製到剪貼板');
        });
    } else {
        // 降級方案
        const textArea = document.createElement('textarea');
        textArea.value = orderNumber;
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
        showToast('訂單編號已複製到剪貼板');
    }
});

// 顯示提示訊息
function showToast(message) {
    // 檢查是否已存在 toast
    const existingToast = document.querySelector('.toast');
    if (existingToast) {
        existingToast.remove();
    }
    
    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: #48bb78;
        color: white;
        padding: 15px 20px;
        border-radius: 8px;
        z-index: 1000;
        animation: slideInRight 0.3s ease-out;
        box-shadow: 0 4px 12px rgba(0,0,0,0.2);
    `;
    toast.textContent = message;
    
    document.body.appendChild(toast);
    
    // 3秒後移除
    setTimeout(() => {
        toast.style.animation = 'slideOutRight 0.3s ease-in';
        setTimeout(() => {
            if (toast.parentElement) {
                toast.remove();
            }
        }, 300);
    }, 3000);
}

// 添加動畫樣式
if (!document.querySelector('#toast-animations')) {
    const style = document.createElement('style');
    style.id = 'toast-animations';
    style.textContent = `
        @keyframes slideInRight {
            from { transform: translateX(100%); opacity: 0; }
            to { transform: translateX(0); opacity: 1; }
        }
        @keyframes slideOutRight {
            from { transform: translateX(0); opacity: 1; }
            to { transform: translateX(100%); opacity: 0; }
        }
    `;
    document.head.appendChild(style);
}

// 防止表單重複提交
let isSearching = false;

function searchOrder() {
    if (isSearching) return;
    
    const orderNumber = orderNumberInput.value.trim().toUpperCase();
    
    if (!orderNumber) {
        showErrorMessage('請輸入訂單編號');
        return;
    }
    
    if (orderNumber.length < 3) {
        showErrorMessage('訂單編號至少需要3個字符');
        return;
    }
    
    isSearching = true;
    showLoading();
    
    setTimeout(() => {
        const orderData = orderDatabase[orderNumber];
        
        if (orderData) {
            hideLoading();
            displayOrderDetails(orderData);
        } else {
            hideLoading();
            showErrorMessage('找不到此訂單編號，請檢查後重新輸入');
        }
        
        isSearching = false;
    }, 1500);
}

// 頁面載入完成提示
console.log('訂單查詢系統載入完成！');
console.log('測試用訂單編號: ORD12345, ORD67890, ORD11111');
