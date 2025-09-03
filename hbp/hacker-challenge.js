// 挑戰問題和答案
const challenges = [
    {
        question: "聽這首歌，猜猜看這首歌的名字是？",
        answer: "Wicked",
        alternatives: ["wicked", "WICKED"],
        hint: "提示：這是一首韓國的歌曲",
        audioFile: "q1.wav"
    },
    {
        question: "聽這首歌，猜猜看這首歌的名字是？",
        answer: "Like Jennie",
        alternatives: ["like jennie", "LIKE JENNIE"],
        hint: "提示：這也是一首來自韓國女歌手的歌曲",
        audioFile: "q2.wav"
    },
    {
        question: "看看這雙眼睛，猜猜這是誰？",
        answer: "林俊傑",
        alternatives: ["JJ Lin", "JJ"],
        hint: "提示：他沒有開健身房",
        imageFile: "q3.png"
    },
    {
        question: "看看這雙眼睛，猜猜這是誰？",
        answer: "Coffee",
        alternatives: ["coffee", "咖啡"],
        hint: "提示：他很可愛",
        imageFile: "q4.png"
    },
    {
        question: "聽這首歌，猜猜看這些歌來自哪個團體？",
        answer: "Twice",
        alternatives: ["twice", "TWICE"],
        hint: "提示：韓國團體",
        audioFile: "q5.wav"
    }
];

// 當前狀態
let currentQuestionIndex = 0;
let isTyping = false;

// DOM 元素
const welcomeMessage = document.getElementById('welcomeMessage');
const challengeArea = document.getElementById('challengeArea');
const finalResult = document.getElementById('finalResult');
const startChallengeBtn = document.getElementById('startChallenge');
const currentQuestionSpan = document.getElementById('currentQuestion');
const questionText = document.getElementById('questionText');
const answerInput = document.getElementById('answerInput');
const submitBtn = document.getElementById('submitAnswer');
const feedback = document.getElementById('feedback');
const progressFill = document.getElementById('progressFill');
const decryptedMessage = document.getElementById('decryptedMessage');

// 初始化
document.addEventListener('DOMContentLoaded', function() {
    updateTime();
    setInterval(updateTime, 1000);
    typeWelcomeMessage();
    
    // 事件監聽器
    startChallengeBtn.addEventListener('click', startChallenge);
    submitBtn.addEventListener('click', submitAnswer);
    answerInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            submitAnswer();
        }
    });
});

// 更新時間
function updateTime() {
    const now = new Date();
    const timeString = now.toLocaleTimeString('zh-TW', { 
        hour12: false,
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
    });
    const timeElement = document.getElementById('currentTime');
    if (timeElement) {
        timeElement.textContent = timeString;
    }
}

// 打字機效果
function typeWelcomeMessage() {
    const messages = [
        "> INITIALIZING HACK PROTOCOL...",
        "> ACCESS GRANTED TO MAINFRAME",
        "> SCANNING NETWORK VULNERABILITIES...",
        "> TARGET LOCATED: HBProject DELIVERY SYSTEM",
        "> ENCRYPTION LEVEL: MILITARY GRADE",
        "",
        "> WARNING: UNAUTHORIZED ACCESS DETECTED",
        "> SECURITY PROTOCOLS ACTIVATED",
        "> INITIATING COUNTER-HACK SEQUENCE...",
        "",
        "> 您的包裹資訊已被加密鎖定",
        "> 想要解鎖？完成以下安全驗證",
        "> 答對所有問題即可獲得解密金鑰",
        "",
        "> 準備好接受挑戰了嗎？"
    ];
    
    const typedTextElement = document.getElementById('typedText');
    let messageIndex = 0;
    let charIndex = 0;
    
    function typeChar() {
        if (messageIndex < messages.length) {
            if (charIndex < messages[messageIndex].length) {
                typedTextElement.textContent += messages[messageIndex][charIndex];
                charIndex++;
                setTimeout(typeChar, 30 + Math.random() * 50);
            } else {
                typedTextElement.textContent += '\n';
                messageIndex++;
                charIndex = 0;
                setTimeout(typeChar, 200);
            }
        } else {
            isTyping = false;
            startChallengeBtn.style.display = 'flex';
            startChallengeBtn.style.animation = 'fadeIn 0.5s ease-out';
        }
    }
    
    isTyping = true;
    typeChar();
}

// 開始挑戰
function startChallenge() {
    welcomeMessage.style.display = 'none';
    challengeArea.style.display = 'block';
    currentQuestionIndex = 0;
    showQuestion();
}

// 顯示問題
function showQuestion() {
    const challenge = challenges[currentQuestionIndex];
    currentQuestionSpan.textContent = currentQuestionIndex + 1;
    questionText.textContent = challenge.question;
    answerInput.value = '';
    answerInput.focus();
    feedback.textContent = '';
    feedback.className = 'feedback';
    
    // 清理之前的媒體內容
    cleanupPreviousMedia();
    
    // 如果是音樂題目，播放音檔
    if (challenge.audioFile) {
        playAudioChallenge(challenge.audioFile);
    }
    
    // 如果是圖片題目，顯示圖片
    if (challenge.imageFile) {
        showImageChallenge(challenge.imageFile);
    }
    
    // 更新進度條
    const progress = ((currentQuestionIndex) / challenges.length) * 100;
    progressFill.style.width = progress + '%';
}

// 提交答案
function submitAnswer() {
    const userAnswer = answerInput.value.trim().toLowerCase();
    const challenge = challenges[currentQuestionIndex];
    const correctAnswers = [challenge.answer.toLowerCase(), ...challenge.alternatives.map(alt => alt.toLowerCase())];
    
    if (userAnswer === '') {
        showFeedback('請輸入答案！', 'incorrect');
        return;
    }
    
    if (correctAnswers.includes(userAnswer)) {
        showFeedback('正確！', 'correct');
        
        // 清理媒體內容
        cleanupPreviousMedia();
        
        setTimeout(() => {
            currentQuestionIndex++;
            if (currentQuestionIndex < challenges.length) {
                showQuestion();
            } else {
                showFinalResult();
            }
        }, 1500);
    } else {
        showFeedback(`錯誤！${challenge.hint}`, 'incorrect');
        
        // 添加震動效果
        challengeArea.style.animation = 'shake 0.5s ease-in-out';
        setTimeout(() => {
            challengeArea.style.animation = '';
        }, 500);
    }
}

// 播放音樂挑戰
function playAudioChallenge(audioFile) {
    // 移除之前的音樂播放器（如果有的話）
    const existingPlayer = document.getElementById('audioPlayer');
    if (existingPlayer) {
        existingPlayer.remove();
    }
    
    // 創建音樂播放器
    const audioPlayer = document.createElement('audio');
    audioPlayer.id = 'audioPlayer';
    audioPlayer.controls = true;
    audioPlayer.autoplay = true;
    audioPlayer.loop = true;
    audioPlayer.src = audioFile;
    audioPlayer.volume = 0.7;
    
    // 添加播放器樣式
    audioPlayer.style.cssText = `
        width: 100%;
        margin: 20px 0;
        background: rgba(0, 255, 255, 0.1);
        border: 1px solid #00ffff;
        border-radius: 5px;
        filter: hue-rotate(180deg);
    `;
    
    // 將播放器插入到問題後面
    const questionContainer = questionText.parentNode;
    questionContainer.appendChild(audioPlayer);
    
    // 添加播放提示
    const audioHint = document.createElement('div');
    audioHint.className = 'audio-hint';
    audioHint.innerHTML = '🎵 請仔細聽音樂，然後輸入歌名';
    audioHint.style.cssText = `
        color: #00ffff;
        text-align: center;
        margin: 10px 0;
        font-size: 14px;
        animation: pulse 2s infinite;
    `;
    questionContainer.appendChild(audioHint);
    
    // 錯誤處理
    audioPlayer.onerror = function() {
        console.error('音檔載入失敗');
        audioHint.innerHTML = '⚠️ 音檔載入失敗，請檢查檔案路徑';
        audioHint.style.color = '#ff6b6b';
    };
}

// 清理之前的媒體內容
function cleanupPreviousMedia() {
    // 移除音樂播放器
    const existingPlayer = document.getElementById('audioPlayer');
    if (existingPlayer) {
        existingPlayer.pause();
        existingPlayer.remove();
    }
    
    // 移除音樂提示
    const audioHint = document.querySelector('.audio-hint');
    if (audioHint) {
        audioHint.remove();
    }
    
    // 移除圖片
    const existingImage = document.getElementById('challengeImage');
    if (existingImage) {
        existingImage.remove();
    }
    
    // 移除圖片提示
    const imageHint = document.querySelector('.image-hint');
    if (imageHint) {
        imageHint.remove();
    }
}

// 顯示圖片挑戰
function showImageChallenge(imageFile) {
    // 創建圖片元素
    const challengeImage = document.createElement('img');
    challengeImage.id = 'challengeImage';
    challengeImage.src = imageFile;
    challengeImage.alt = '挑戰圖片';
    
    // 添加圖片樣式
    challengeImage.style.cssText = `
        width: 100%;
        max-width: 400px;
        height: auto;
        margin: 20px auto;
        display: block;
        border: 2px solid #00ffff;
        border-radius: 10px;
        box-shadow: 0 0 20px rgba(0, 255, 255, 0.3);
        filter: brightness(1.1) contrast(1.2);
        transition: all 0.3s ease;
    `;
    
    // 將圖片插入到問題後面
    const questionContainer = questionText.parentNode;
    questionContainer.appendChild(challengeImage);
    
    // 添加圖片提示
    const imageHint = document.createElement('div');
    imageHint.className = 'image-hint';
    imageHint.innerHTML = '👁️ 仔細觀察這雙眼睛，猜猜這是誰';
    imageHint.style.cssText = `
        color: #00ffff;
        text-align: center;
        margin: 15px 0;
        font-size: 14px;
        animation: pulse 2s infinite;
        padding: 10px;
        background: rgba(0, 255, 255, 0.1);
        border: 1px dashed #00ffff;
        border-radius: 5px;
    `;
    questionContainer.appendChild(imageHint);
    
    // 圖片載入效果
    challengeImage.onload = function() {
        challengeImage.style.opacity = '0';
        challengeImage.style.transform = 'scale(0.8)';
        setTimeout(() => {
            challengeImage.style.opacity = '1';
            challengeImage.style.transform = 'scale(1)';
        }, 100);
    };
    
    // 錯誤處理
    challengeImage.onerror = function() {
        console.error('圖片載入失敗');
        imageHint.innerHTML = '⚠️ 圖片載入失敗，請檢查檔案路徑';
        imageHint.style.color = '#ff6b6b';
    };
}

// 顯示反饋
function showFeedback(message, type) {
    feedback.textContent = message;
    feedback.className = `feedback ${type}`;
}

// 顯示最終結果
function showFinalResult() {
    challengeArea.style.display = 'none';
    finalResult.style.display = 'block';
    
    // 進度條完成
    progressFill.style.width = '100%';
    
    // 解密訊息動畫
    const encryptedText = "GUVF VF N GRFG ZRFFNTR. LBH UNIR FHPPRFFSHYYL QRPELCGRQ GUR QNGN.";
    const decryptedText = "恭喜！您已成功通過所有安全驗證。包裹位置已解鎖，點擊下方按鈕查看詳細資訊！";
    
    let currentText = encryptedText;
    let decryptProgress = 0;
    
    function decryptAnimation() {
        if (decryptProgress < decryptedText.length) {
            const randomChars = '!@#$%^&*()_+-=[]{}|;:,.<>?~`';
            let newText = '';
            
            for (let i = 0; i < Math.max(encryptedText.length, decryptedText.length); i++) {
                if (i < decryptProgress) {
                    newText += decryptedText[i] || '';
                } else if (i < decryptedText.length) {
                    newText += randomChars[Math.floor(Math.random() * randomChars.length)];
                }
            }
            
            decryptedMessage.textContent = newText;
            decryptProgress++;
            setTimeout(decryptAnimation, 100);
        } else {
            decryptedMessage.textContent = decryptedText;
            
            // 顯示生日驚喜按鈕
            setTimeout(() => {
                const birthdayButton = document.createElement('a');
                birthdayButton.href = 'birthday-surprise.html';
                birthdayButton.className = 'birthday-link';
                birthdayButton.innerHTML = `
                    <i class="fas fa-gift"></i>
                    查看包裹位置 🎁
                `;
                
                decryptedMessage.parentNode.appendChild(birthdayButton);
                
                // 按鈕出現動畫
                setTimeout(() => {
                    birthdayButton.style.opacity = '1';
                    birthdayButton.style.transform = 'translateY(0)';
                }, 100);
            }, 1000);
        }
    }
    
    setTimeout(decryptAnimation, 1000);
}

// 添加震動動畫
const style = document.createElement('style');
style.textContent = `
    @keyframes shake {
        0%, 100% { transform: translateX(0); }
        25% { transform: translateX(-10px); }
        75% { transform: translateX(10px); }
    }
    
    @keyframes pulse {
        0%, 100% { opacity: 1; }
        50% { opacity: 0.6; }
    }
`;
document.head.appendChild(style);

// 添加隨機故障效果
function addGlitchEffects() {
    setInterval(() => {
        const elements = document.querySelectorAll('.glitch-title, .terminal-title, .question-text');
        elements.forEach(element => {
            if (Math.random() < 0.1) { // 10% 機率
                element.style.textShadow = `
                    ${Math.random() * 4 - 2}px 0 #ff0000,
                    ${Math.random() * 4 - 2}px 0 #00ffff
                `;
                setTimeout(() => {
                    element.style.textShadow = '';
                }, 100);
            }
        });
    }, 2000);
}

// 啟動故障效果
setTimeout(addGlitchEffects, 3000);

// 防止右鍵和F12（增加沉浸感）
document.addEventListener('contextmenu', function(e) {
    e.preventDefault();
    console.log('> UNAUTHORIZED ACCESS ATTEMPT DETECTED');
});

document.addEventListener('keydown', function(e) {
    if (e.key === 'F12' || (e.ctrlKey && e.shiftKey && e.key === 'I')) {
        e.preventDefault();
        console.log('> DEVELOPER TOOLS BLOCKED');
    }
});

// 添加背景音效提示（可選）
function playBeep() {
    // 創建簡單的嗶聲
    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    oscillator.frequency.value = 800;
    gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.1);
    
    oscillator.start();
    oscillator.stop(audioContext.currentTime + 0.1);
}

// 在關鍵時刻播放音效
document.addEventListener('click', function() {
    try {
        playBeep();
    } catch (error) {
        // 忽略音效錯誤
    }
});

console.log(`
██╗  ██╗██████╗ ██████╗ ██████╗  ██████╗      ██╗███████╗ ██████╗████████╗
██║  ██║██╔══██╗██╔══██╗██╔══██╗██╔═══██╗     ██║██╔════╝██╔════╝╚══██╔══╝
███████║██████╔╝██████╔╝██████╔╝██║   ██║     ██║█████╗  ██║        ██║   
██╔══██║██╔══██╗██╔═══╝ ██╔══██╗██║   ██║██   ██║██╔══╝  ██║        ██║   
██║  ██║██████╔╝██║     ██║  ██║╚██████╔╝╚█████╔╝███████╗╚██████╗   ██║   
╚═╝  ╚═╝╚═════╝ ╚═╝     ╚═╝  ╚═╝ ╚═════╝  ╚════╝ ╚══════╝ ╚═════╝   ╚═╝   

> HACKER CHALLENGE SYSTEM INITIALIZED
> WELCOME TO THE MATRIX...
`);
