// 頁面加載完成後執行
document.addEventListener('DOMContentLoaded', function() {
    // 設置包裹圖片
    setupPackageImage();
    
    // 啟動動畫效果
    startAnimations();
    
    // 播放生日音樂（如果有的話）
    playBirthdayMusic();
});

// 設置包裹圖片
function setupPackageImage() {
    const packageImg = document.getElementById('packageImage');
    
    if (packageImg) {
        packageImg.style.opacity = '0';
        packageImg.style.transition = 'opacity 1s ease-in-out';
        
        // 圖片加載完成後顯示
        packageImg.onload = function() {
            setTimeout(() => {
                packageImg.style.opacity = '1';
            }, 1000);
        };
        
        // 如果圖片加載失敗，顯示替代內容
        packageImg.onerror = function() {
            const packagePreview = document.querySelector('.package-preview');
            packagePreview.innerHTML = `
                <div style="
                    display: flex; 
                    flex-direction: column; 
                    align-items: center; 
                    justify-content: center; 
                    height: 100%; 
                    color: #666;
                    cursor: pointer;
                " onclick="openPackageModal()">
                    <i class="fas fa-gift" style="font-size: 4rem; color: #ff6b6b; margin-bottom: 15px;"></i>
                    <p style="margin: 0; font-size: 1.2rem; font-weight: bold;">生日驚喜包裹</p>
                    <p style="margin: 5px 0 0 0; font-size: 1rem;">點擊查看內容</p>
                </div>
            `;
        };
    }
}

// 開啟包裹彈出視窗
function openPackageModal() {
    const modal = document.getElementById('packageModal');
    modal.classList.add('show');
    document.body.style.overflow = 'hidden'; // 防止背景滾動
    
    // 播放開啟音效
    playModalSound();
}

// 關閉包裹彈出視窗
function closePackageModal() {
    const modal = document.getElementById('packageModal');
    modal.classList.remove('show');
    document.body.style.overflow = ''; // 恢復滾動
}

// 播放彈出視窗音效
function playModalSound() {
    try {
        playNote(523, 0.2); // C5
        setTimeout(() => playNote(659, 0.2), 100); // E5
        setTimeout(() => playNote(784, 0.3), 200); // G5
    } catch (error) {
        // 忽略音頻錯誤
    }
}

// 啟動動畫效果
function startAnimations() {
    // 啟動生日文字動畫
    animateBirthdayText();
    
    // 啟動彩紙動畫
    startConfetti();
    
    // 啟動背景動畫
    animateBackground();
}

// 生日文字動畫
function animateBirthdayText() {
    const title = document.querySelector('.birthday-title');
    if (title) {
        title.style.opacity = '0';
        title.style.transform = 'translateY(-50px)';
        
        setTimeout(() => {
            title.style.transition = 'opacity 1s ease-out, transform 1s ease-out';
            title.style.opacity = '1';
            title.style.transform = 'translateY(0)';
        }, 500);
    }
}

// 彩紙動畫
function startConfetti() {
    const colors = ['#ff6b6b', '#ffa500', '#4d96ff', '#6bcf7f', '#c44569', '#f8b500'];
    const confettiContainer = document.body;
    
    function createConfetti() {
        const confetti = document.createElement('div');
        confetti.className = 'confetti';
        confetti.style.cssText = `
            position: fixed;
            top: -10px;
            left: ${Math.random() * 100}vw;
            width: 10px;
            height: 10px;
            background: ${colors[Math.floor(Math.random() * colors.length)]};
            z-index: 1000;
            pointer-events: none;
            animation: confetti-fall ${Math.random() * 3 + 2}s linear forwards;
            border-radius: ${Math.random() > 0.5 ? '50%' : '0'};
            transform: rotate(${Math.random() * 360}deg);
        `;
        
        confettiContainer.appendChild(confetti);
        
        setTimeout(() => {
            confetti.remove();
        }, 5000);
    }
    
    // 每 300ms 創建一個彩紙
    setInterval(createConfetti, 300);
    
    // 添加彩紙 CSS 動畫
    if (!document.getElementById('confetti-style')) {
        const style = document.createElement('style');
        style.id = 'confetti-style';
        style.textContent = `
            @keyframes confetti-fall {
                to {
                    transform: translateY(100vh) rotate(720deg);
                    opacity: 0;
                }
            }
        `;
        document.head.appendChild(style);
    }
}

// 背景動畫
function animateBackground() {
    const container = document.querySelector('.container');
    if (container) {
        container.style.animation = 'birthday-glow 4s ease-in-out infinite alternate';
    }
    
    // 添加背景動畫 CSS
    if (!document.getElementById('background-style')) {
        const style = document.createElement('style');
        style.id = 'background-style';
        style.textContent = `
            @keyframes birthday-glow {
                0% { box-shadow: 0 0 20px rgba(255, 107, 107, 0.3); }
                50% { box-shadow: 0 0 40px rgba(255, 165, 0, 0.4); }
                100% { box-shadow: 0 0 60px rgba(77, 150, 255, 0.5); }
            }
        `;
        document.head.appendChild(style);
    }
}

// 播放生日音樂
function playBirthdayMusic() {
    // 檢查是否已經有音樂在播放
    const existingAudio = document.getElementById('backgroundMusic');
    if (existingAudio) {
        return;
    }
    
    try {
        // 創建音頻元素播放背景音樂
        const audio = new Audio('hb.wav');
        audio.volume = 0.5; // 設置音量為50%
        audio.loop = true; // 循環播放
        audio.id = 'backgroundMusic';
        
        // 將音頻元素添加到頁面
        document.body.appendChild(audio);
        
        // 播放音樂
        audio.play().catch(error => {
            console.log('音樂播放失敗：', error);
            // 如果音樂播放失敗，顯示提示並等待用戶互動
            showMusicPrompt();
        });
        
    } catch (error) {
        console.log('無法播放音樂：', error);
        // 如果出錯，顯示提示並等待用戶互動
        showMusicPrompt();
    }
}

// 顯示音樂播放提示
function showMusicPrompt() {
    // 檢查是否已經有提示
    if (document.getElementById('musicPrompt')) {
        return;
    }
    
    // 創建音樂提示元素
    const musicPrompt = document.createElement('div');
    musicPrompt.id = 'musicPrompt';
    musicPrompt.innerHTML = `
        <div class="music-prompt-content">
            <i class="fas fa-music"></i>
            <p>點擊任意處播放生日音樂 🎵</p>
        </div>
    `;
    
    // 添加樣式
    musicPrompt.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: linear-gradient(135deg, #ff6b6b, #ffd93d);
        color: white;
        padding: 15px 20px;
        border-radius: 50px;
        box-shadow: 0 4px 15px rgba(255, 107, 107, 0.3);
        z-index: 1000;
        font-family: 'Noto Sans TC', sans-serif;
        font-weight: 500;
        cursor: pointer;
        animation: bounce 2s infinite;
        transition: all 0.3s ease;
    `;
    
    document.body.appendChild(musicPrompt);
    
    // 添加彈跳動畫
    const style = document.createElement('style');
    style.textContent = `
        @keyframes bounce {
            0%, 20%, 50%, 80%, 100% { transform: translateY(0); }
            40% { transform: translateY(-10px); }
            60% { transform: translateY(-5px); }
        }
        .music-prompt-content {
            display: flex;
            align-items: center;
            gap: 10px;
        }
        .music-prompt-content i {
            font-size: 18px;
        }
        .music-prompt-content p {
            margin: 0;
            font-size: 14px;
        }
        #musicPrompt:hover {
            transform: scale(1.05);
            box-shadow: 0 6px 20px rgba(255, 107, 107, 0.4);
        }
    `;
    document.head.appendChild(style);
    
    // 點擊提示時播放音樂
    musicPrompt.addEventListener('click', function() {
        startMusicWithUserInteraction();
        musicPrompt.remove();
    });
}

// 在用戶互動後開始播放音樂
function startMusicWithUserInteraction() {
    const audio = document.getElementById('backgroundMusic');
    if (audio) {
        audio.play().catch(error => {
            console.log('音樂播放失敗：', error);
            // 如果還是失敗，嘗試合成音樂
            playFallbackMusic();
        });
    } else {
        // 重新創建音頻元素
        const newAudio = new Audio('hb.wav');
        newAudio.volume = 0.5;
        newAudio.loop = true;
        newAudio.id = 'backgroundMusic';
        document.body.appendChild(newAudio);
        
        newAudio.play().catch(error => {
            console.log('音樂播放失敗：', error);
            playFallbackMusic();
        });
    }
}

// 添加全局點擊監聽器來啟動音樂
let musicStarted = false;
document.addEventListener('click', function() {
    if (!musicStarted) {
        const audio = document.getElementById('backgroundMusic');
        if (audio && audio.paused) {
            audio.play().catch(error => {
                console.log('音樂播放失敗：', error);
            });
            musicStarted = true;
            
            // 移除音樂提示
            const prompt = document.getElementById('musicPrompt');
            if (prompt) {
                prompt.remove();
            }
        }
    }
}, { once: false });

// 回退音樂（原來的合成音樂）
function playFallbackMusic() {
    // 播放簡單的生日快樂樂曲
    const notes = [
        {note: 262, duration: 0.5}, // C4
        {note: 262, duration: 0.3}, // C4
        {note: 294, duration: 0.8}, // D4
        {note: 262, duration: 0.8}, // C4
        {note: 349, duration: 0.8}, // F4
        {note: 330, duration: 1.2}, // E4
        
        {note: 262, duration: 0.5}, // C4
        {note: 262, duration: 0.3}, // C4
        {note: 294, duration: 0.8}, // D4
        {note: 262, duration: 0.8}, // C4
        {note: 392, duration: 0.8}, // G4
        {note: 349, duration: 1.2}, // F4
    ];
    
    let currentTime = 0;
    notes.forEach((noteData, index) => {
        setTimeout(() => {
            playNote(noteData.note, noteData.duration);
        }, currentTime * 1000);
        currentTime += noteData.duration + 0.1;
    });
}

// 播放音符
function playNote(frequency, duration) {
    try {
        const audioContext = new (window.AudioContext || window.webkitAudioContext)();
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);
        
        oscillator.frequency.value = frequency;
        oscillator.type = 'sine';
        
        gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + duration);
        
        oscillator.start(audioContext.currentTime);
        oscillator.stop(audioContext.currentTime + duration);
    } catch (error) {
        // 忽略音頻錯誤
    }
}

// ESC 鍵關閉彈出視窗
document.addEventListener('keydown', function(event) {
    if (event.key === 'Escape') {
        closePackageModal();
    }
});

// 點擊彈出視窗背景關閉
document.addEventListener('click', function(event) {
    const modal = document.getElementById('packageModal');
    if (event.target === modal) {
        closePackageModal();
    }
});

// 啟動各種動畫效果
function startAnimations() {
    // 額外的彩帶動畫
    createExtraConfetti();
    
    // 動態背景效果
    createFloatingHearts();
    
    // 閃爍星星效果
    createTwinklingStars();
    
    // 卡片懸停效果
    setupCardHover();
}

// 創建額外的彩帶
function createExtraConfetti() {
    const confettiContainer = document.querySelector('.confetti-container');
    
    // 每隔3秒創建一波新的彩帶
    setInterval(() => {
        for (let i = 0; i < 10; i++) {
            const confetti = document.createElement('div');
            confetti.className = 'confetti';
            confetti.style.left = Math.random() * 100 + '%';
            confetti.style.background = getRandomColor();
            confetti.style.animationDelay = Math.random() * 2 + 's';
            confetti.style.animationDuration = (Math.random() * 3 + 2) + 's';
            
            confettiContainer.appendChild(confetti);
            
            // 動畫結束後移除元素
            setTimeout(() => {
                if (confetti.parentNode) {
                    confetti.parentNode.removeChild(confetti);
                }
            }, 5000);
        }
    }, 3000);
}

// 創建浮動愛心
function createFloatingHearts() {
    const heartsContainer = document.querySelector('.floating-decorations');
    
    setInterval(() => {
        const heart = document.createElement('div');
        heart.textContent = ['💖', '💕', '💗', '💝'][Math.floor(Math.random() * 4)];
        heart.style.position = 'absolute';
        heart.style.left = Math.random() * 100 + '%';
        heart.style.top = '100%';
        heart.style.fontSize = (Math.random() * 1 + 1) + 'rem';
        heart.style.opacity = '0.8';
        heart.style.animation = `float-up ${Math.random() * 3 + 4}s ease-out forwards`;
        heart.style.pointerEvents = 'none';
        
        heartsContainer.appendChild(heart);
        
        setTimeout(() => {
            if (heart.parentNode) {
                heart.parentNode.removeChild(heart);
            }
        }, 7000);
    }, 2000);
}

// 創建閃爍星星
function createTwinklingStars() {
    const stars = document.querySelectorAll('.star');
    
    stars.forEach(star => {
        setInterval(() => {
            star.style.transform = `scale(${Math.random() * 0.5 + 0.8}) rotate(${Math.random() * 360}deg)`;
            star.style.filter = `brightness(${Math.random() * 0.5 + 0.8})`;
        }, 1000);
    });
}

// 設置卡片懸停效果
function setupCardHover() {
    const card = document.querySelector('.birthday-card');
    
    card.addEventListener('mouseenter', function() {
        this.style.transform = 'scale(1.02) rotateY(5deg)';
    });
    
    card.addEventListener('mouseleave', function() {
        this.style.transform = 'scale(1) rotateY(0deg)';
    });
}

// 獲取隨機顏色
function getRandomColor() {
    const colors = ['#ff6b6b', '#ffd93d', '#6bcf7f', '#4d96ff', '#ff9ff3', '#54a0ff'];
    return colors[Math.floor(Math.random() * colors.length)];
}

// 添加 CSS 動畫關鍵幀
const style = document.createElement('style');
style.textContent = `
    @keyframes float-up {
        0% {
            transform: translateY(0);
            opacity: 0.8;
        }
        100% {
            transform: translateY(-100vh);
            opacity: 0;
        }
    }
    
    .confetti {
        border-radius: 50%;
    }
    
    .confetti:nth-child(odd) {
        transform: rotate(45deg);
    }
`;
document.head.appendChild(style);

// 添加點擊效果
document.addEventListener('click', function(e) {
    createClickEffect(e.clientX, e.clientY);
});

// 創建點擊效果
function createClickEffect(x, y) {
    const effect = document.createElement('div');
    effect.style.position = 'fixed';
    effect.style.left = x + 'px';
    effect.style.top = y + 'px';
    effect.style.width = '20px';
    effect.style.height = '20px';
    effect.style.background = getRandomColor();
    effect.style.borderRadius = '50%';
    effect.style.pointerEvents = 'none';
    effect.style.zIndex = '9999';
    effect.style.transform = 'translate(-50%, -50%)';
    effect.style.animation = 'click-burst 0.6s ease-out forwards';
    
    document.body.appendChild(effect);
    
    setTimeout(() => {
        if (effect.parentNode) {
            effect.parentNode.removeChild(effect);
        }
    }, 600);
}

// 添加點擊爆炸動畫
const clickStyle = document.createElement('style');
clickStyle.textContent = `
    @keyframes click-burst {
        0% {
            transform: translate(-50%, -50%) scale(0);
            opacity: 1;
        }
        100% {
            transform: translate(-50%, -50%) scale(4);
            opacity: 0;
        }
    }
`;
document.head.appendChild(clickStyle);

// 添加提示動畫的 CSS
const hintStyle = document.createElement('style');
hintStyle.textContent = `
    @keyframes hint-pulse {
        0%, 100% {
            transform: translateX(-50%) scale(1);
            box-shadow: 0 8px 25px rgba(77, 150, 255, 0.3);
        }
        50% {
            transform: translateX(-50%) scale(1.05);
            box-shadow: 0 12px 35px rgba(77, 150, 255, 0.5);
        }
    }
    
    .scan-hint:hover div {
        transform: translateX(-50%) scale(1.1) !important;
        background: linear-gradient(135deg, #667eea, #764ba2) !important;
    }
`;
document.head.appendChild(hintStyle);

console.log(`
🎉🎂🎉🎂🎉🎂🎉🎂🎉🎂🎉🎂🎉🎂🎉🎂🎉🎂🎉🎂
🎂                                                    🎂
🎉            🎉 生日快樂！Happy Birthday! 🎉          🎉
🎂                                                    🎂
🎉  願您的生活充滿歡樂，心想事成，身體健康！        🎉
🎂                                                    🎂
🎉🎂🎉🎂🎉🎂🎉🎂🎉🎂🎉🎂🎉🎂🎉🎂🎉🎂🎉🎂
`);
