// --- STATE MANAGEMENT (Versi Anti-Error & Sinkron) ---
window.speakingHearts = window.speakingHearts || 5;
window.currentSpeakingStep = window.currentSpeakingStep || 0;
window.speakingQuizData = window.speakingQuizData || [];
window.hasWatchedAdForLife = window.hasWatchedAdForLife || false;
window.speakingAdCount = window.speakingAdCount || 0;

/**
 * Memulai Modul Speaking
 */
function startSpeakingModule() {
    const user = window.userState;
    const currentLv = user.currentLevel || 1;

    // Ambil data berdasarkan level
    const dataVarName = `SPEAKING_DATA_LV${currentLv}`;
    const levelData = window[dataVarName];

    if (!levelData || levelData.length === 0) {
        alert(`Data Speaking Level ${currentLv} tidak ditemukan.`);
        return;
    }

    // Proses Flattening (Dialog ke urutan percakapan)
    const randomDialogs = [...levelData].sort(() => 0.5 - Math.random()).slice(0, 5);
    
    window.speakingQuizData = []; // Reset data quiz global
    randomDialogs.forEach(d => {
        d.dialog.forEach(line => {
            window.speakingQuizData.push({
                theme: d.title,
                expected: line.text,
                role: line.role,
                keyword: line.text.split(' ')[0]
            });
        });
    });

    // Reset State Sesi & Sinkronisasi Nyawa
    window.currentSpeakingStep = 0;
    window.speakingHearts = user.isPremium ? 99 : (user.lives || 5);
    window.hasWatchedAdForLife = false;
    window.speakingAdCount = 0;
    
    showSpeakingChallenge();
}

/**
 * Tampilan UI
 */
function showSpeakingChallenge() {
    const item = window.speakingQuizData[window.currentSpeakingStep];
    if (!item) return finishSpeakingModule();

    const targetText = item.expected.replace(/'/g, "\\'");
    const user = window.userState;
    
    let html = `
        <div class="game-header" style="display:flex; justify-content:space-between; align-items:center; padding: 10px 20px;">
            <div style="color: #ff4b4b; font-weight: bold; font-size: 1.2rem;">
                <i class="fas fa-heart"></i> ${user.isPremium ? '∞' : window.speakingHearts}
            </div>
            <div style="background: #eee; height: 10px; width: 40%; border-radius: 5px; overflow:hidden;">
                <div style="background: var(--primary-blue); height:100%; width:${(window.currentSpeakingStep/window.speakingQuizData.length)*100}%;"></div>
            </div>
            <div style="color: #666; font-size: 0.8rem;">Step ${window.currentSpeakingStep + 1}/${window.speakingQuizData.length}</div>
        </div>

        <div class="theory-card" style="background: #fdfdfd; padding: 20px;">
            <p style="text-align:center; color:#aaa; font-size:0.7rem; text-transform:uppercase; margin-bottom:15px;">
                Topic: ${item.theme}
            </p>

            <div id="chat-container" style="display: flex; flex-direction: column; gap: 15px; margin-bottom: 20px; min-height: 150px;">
                ${window.currentSpeakingStep > 0 ? `
                    <div class="bubble-left" style="align-self: flex-start; background: #e8e8e8; padding: 10px 15px; border-radius: 15px 15px 15px 0; max-width: 80%; font-size: 0.9rem; color: #666;">
                        ${window.speakingQuizData[window.currentSpeakingStep - 1].expected}
                    </div>
                ` : ''}

                <div class="bubble-right" style="align-self: flex-end; background: #d1e7ff; padding: 15px; border-radius: 15px 15px 0 15px; max-width: 85%; border: 2px solid var(--primary-blue);">
                    <div style="font-size: 0.6rem; color: var(--primary-blue); font-weight: bold; margin-bottom: 5px;">SAY THIS:</div>
                    <h3 id="target-sentence" style="margin: 0; color: #333; font-size: 1.1rem; line-height:1.4;">
                        "${item.expected}"
                    </h3>
                </div>
            </div>

            <div style="display: flex; gap: 10px; justify-content: center; margin-bottom: 20px;">
                <button onclick="playSpeakingAudio('${targetText}', 0.9)" class="word-chip" style="background:#e3f2fd; border:none; padding:8px 15px; border-radius:20px;">
                    <i class="fas fa-volume-up"></i> Listen
                </button>
                <button onclick="playSpeakingAudio('${targetText}', 0.6)" class="word-chip" style="background:#fff3e0; border:none; color: #ef6c00; padding:8px 15px; border-radius:20px;">
                    <i class="fas fa-turtle"></i> Slower
                </button>
            </div>

            <div id="speaking-status" style="text-align:center; margin: 15px 0; font-weight: bold; color: #666; font-size: 0.9rem; min-height:1.2rem;">
                Tap mic and speak
            </div>

            <div style="display: flex; justify-content: center;">
                <button id="mic-trigger" onclick="recordUserVoice('${targetText}', '${item.keyword}')" 
                     style="width:80px; height:80px; background:var(--primary-blue); border-radius:50%; display:flex; align-items:center; justify-content:center; cursor:pointer; color:white; font-size:1.8rem; border:none; box-shadow: 0 4px 15px rgba(0,0,0,0.2); transition: 0.3s;">
                    <i class="fas fa-microphone"></i>
                </button>
            </div>
        </div>
    `;
    openGameOverlay(html, "SPEAKING CHALLENGE");
}

/**
 * Voice Recording & Logic
 */
function recordUserVoice(correctText, keyword) {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
        alert("Your browser does not support Speech Recognition. Please use Chrome.");
        return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = 'en-US';
    const statusDiv = document.getElementById('speaking-status');
    const micBtn = document.getElementById('mic-trigger');

    recognition.onstart = () => {
        micBtn.style.background = "#ff4b4b";
        micBtn.style.animation = "pulse 1s infinite";
        statusDiv.innerText = "Listening...";
    };

    recognition.onresult = (event) => {
        const result = event.results[0][0].transcript.toLowerCase().trim().replace(/[.,!]/g, "");
        const target = correctText.toLowerCase().trim().replace(/[.,!]/g, "");

        const isVerySimilar = calculateSimilarity(result, target) > 0.85;

        if (result === target || isVerySimilar) {
            if (typeof playSuccessSound === 'function') playSuccessSound();
            statusDiv.innerHTML = "<span style='color: #2b8a3e;'>Excellent! ✨</span>";

            setTimeout(() => {
                window.currentSpeakingStep++;
                if (window.currentSpeakingStep < window.speakingQuizData.length) showSpeakingChallenge();
                else finishSpeakingModule();
            }, 1500);
        } 
        else if (result.includes(keyword.toLowerCase())) {
            statusDiv.innerHTML = `<span style='color: #f59f00;'>Say the FULL sentence!</span>`;
            playSpeakingAudio("Please say the full sentence", 1.0);
        }
        else {
            if (typeof playErrorSound === 'function') playErrorSound();
            
            // Kurangi Nyawa Sesi & Global
            if (!window.userState.isPremium) {
                window.speakingHearts--;
                window.userState.lives = window.speakingHearts; 
                if (typeof saveUserData === 'function') saveUserData();
                if (typeof updateUI === 'function') updateUI();
            }
            
            statusDiv.innerHTML = `<span style='color: #c92a2a;'>You said: "${result}"</span>`;
            
            if (window.speakingHearts <= 0) {
                setTimeout(showSpeakingGameOver, 1000);
            } else {
                setTimeout(showSpeakingChallenge, 2500);
            }
        }
    };

    recognition.onend = () => {
        micBtn.style.background = "var(--primary-blue)";
        micBtn.style.animation = "none";
    };

    recognition.start();
}

// Helper untuk Fuzzy Match
function calculateSimilarity(s1, s2) {
    let longer = s1.length < s2.length ? s2 : s1;
    let shorter = s1.length < s2.length ? s1 : s2;
    if (longer.length === 0) return 1.0;
    return (longer.length - editDistance(longer, shorter)) / parseFloat(longer.length);
}

function editDistance(s1, s2) {
    s1 = s1.toLowerCase(); s2 = s2.toLowerCase();
    let costs = new Array();
    for (let i = 0; i <= s1.length; i++) {
        let lastValue = i;
        for (let j = 0; j <= s2.length; j++) {
            if (i == 0) costs[j] = j;
            else {
                if (j > 0) {
                    let newValue = costs[j - 1];
                    if (s1.charAt(i - 1) != s2.charAt(j - 1))
                        newValue = Math.min(Math.min(newValue, lastValue), costs[j]) + 1;
                    costs[j - 1] = lastValue;
                    lastValue = newValue;
                }
            }
        }
        if (i > 0) costs[s2.length] = lastValue;
    }
    return costs[s2.length];
}

function showSpeakingGameOver() {
    const actionButton = !hasWatchedAdForLife 
        ? `<button class="btn-upgrade btn-ad" onclick="watchAdForSpeaking()" style="width:100%; background:#4CAF50; color:white; border:none; padding:15px; border-radius:12px; margin-bottom:10px; font-weight:bold;">
                <i class="fas fa-video"></i> Watch Ads (3/3) for +3 Hearts
           </button>`
        : `<p style="color:red; font-size:0.8rem; margin-bottom:10px;">Extra chances used up!</p>`;

    let html = `
        <div style="text-align:center; padding:10px;">
            <div style="font-size: 4rem; margin-bottom: 15px;">💔</div>
            <h2>Out of Hearts!</h2>
            <p style="color: #666; margin-bottom: 20px;">Pronunciation takes practice. Keep going!</p>
            ${actionButton}
            <button class="btn-upgrade btn-premium" style="width:100%;" onclick="openPremiumWall()">
                <i class="fas fa-crown"></i> Get Unlimited Hearts
            </button>
            <button class="btn-upgrade btn-secondary" style="margin-top:10px; width:100%; background:#eee; border:none; padding:10px; border-radius:8px;" onclick="closeGame()">Return Home</button>
        </div>
    `;
    openGameOverlay(html, "GAME OVER");
}

function finishSpeakingModule() {
    const earnedXP = 50; 
    
    // Gunakan fungsi addXP dari main.js agar sinkron ke UI dan LocalStorage
    if (typeof window.addXP === 'function') {
        window.addXP(earnedXP);
    }

    // Update stats harian
    if (window.userState.stats && window.userState.stats.speaking) {
        window.userState.stats.speaking.doneToday++;
    }

    // Cek Level Up / Exam Readiness
    const isExamReady = window.userState.points >= 1000 && !window.userState.isPremium;

    let html = `
        <div style="text-align:center; padding: 20px;">
            <div style="font-size: 4rem; margin-bottom: 20px;">🏆</div>
            <h2 style="color: var(--primary-blue);">Lesson Complete!</h2>
            <div style="background: #f0f7ff; border-radius: 15px; padding: 20px; margin-bottom: 20px;">
                <div style="font-size: 0.9rem; color: #666; text-transform: uppercase;">Total XP Collected</div>
                <div style="font-size: 2.5rem; font-weight: bold; color: var(--primary-blue);">${window.userState.points}</div>
            </div>
            ${isExamReady ? `
                <div style="background: #fff3e0; padding: 15px; border-radius: 10px; border: 1px solid #ffb74d; margin-bottom: 20px;">
                    <p style="color: #e65100; font-weight: bold; margin: 0;">🎓 GLOBAL EXAM READY!</p>
                    <button class="btn-upgrade" onclick="startGlobalLevelExam()" style="background:#e65100; margin-top:10px; border:none; color:white; padding:10px; width:100%; border-radius:8px;">START EXAM</button>
                </div>
            ` : ''}
            <button class="btn-upgrade btn-premium" style="width:100%;" onclick="closeGame()">KEMBALI KE MENU</button>
        </div>
    `;
    
    playSpeakingAudio("Amazing work! You earned 50 XP", 1.0);
    openGameOverlay(html, "SUCCESS");
}

// Similarity Helpers (editDistance, calculateSimilarity tetap seperti sebelumnya)

// Utility
function playSpeakingAudio(text, speed) {
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'en-US';
    utterance.rate = speed;
    window.speechSynthesis.speak(utterance);
}

function watchAdForSpeaking() {
    speakingAdCount++;
    if (speakingAdCount < 3) {
        alert(`Ad watched (${speakingAdCount}/3)`);
    } else {
        speakingAdCount = 0;
        speakingHearts = 3;
        hasWatchedAdForLife = true;
        showSpeakingChallenge();
    }
}