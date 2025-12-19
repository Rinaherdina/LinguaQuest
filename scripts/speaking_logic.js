let speakingHearts = 5;
let currentSpeakingStep = 0;
let speakingQuizData = [];

function startSpeakingModule() {
    const levelKey = "LV" + (window.userState.currentLevel || 1);
    const allVocab = window.VOCAB_MASTER[levelKey] || [];
    
    // Ambil 5 kalimat acak dari database
    speakingQuizData = [...allVocab]
        .filter(item => item.example)
        .sort(() => 0.5 - Math.random())
        .slice(0, 5);

    if (speakingQuizData.length === 0) {
        alert("Belum ada data kalimat untuk level ini.");
        return;
    }

    currentSpeakingStep = 0;
    speakingHearts = 5;
    showSpeakingChallenge();
}

function showSpeakingChallenge() {
    const item = speakingQuizData[currentSpeakingStep];
    const sentence = item.example;

    let html = `
        <div class="game-header">
            <div style="color: #ff4b4b; font-weight: bold; font-size: 1.2rem;">❤️ ${speakingHearts}</div>
            <div style="color: #666;">Step ${currentSpeakingStep + 1}/5</div>
        </div>
        <div class="theory-card" style="text-align:center;">
            <p style="color:var(--primary-blue); font-weight:bold; letter-spacing:1px;">SPEAK THIS SENTENCE:</p>
            <h2 id="target-sentence" style="font-size: 1.8rem; margin: 20px 0; color: #333;">"${sentence}"</h2>
            
            <div style="display: flex; gap: 10px; justify-content: center; margin-bottom: 25px;">
                <button onclick="playSpeakingAudio('${sentence}', 1.0)" class="word-chip" style="background:#e3f2fd; border:none;">
                    <i class="fas fa-volume-up"></i> Normal
                </button>
                <button onclick="playSpeakingAudio('${sentence}', 0.5)" class="word-chip" style="background:#fff3e0; border:none; color: #ef6c00;">
                    <i class="fas fa-turtle"></i> Slow Hint
                </button>
            </div>

            <div id="speaking-status" style="margin: 20px 0; font-weight: bold; min-height: 24px; color: #666;">
                Ready to listen...
            </div>

            <button id="mic-trigger" onclick="recordUserVoice('${sentence.replace(/'/g, "\\'")}')" 
                 style="width:90px; height:90px; background:var(--primary-blue); border-radius:50%; margin:0 auto; display:flex; align-items:center; justify-content:center; cursor:pointer; color:white; font-size:2rem; border:none; box-shadow: 0 4px 15px rgba(0,0,0,0.2);">
                <i class="fas fa-microphone"></i>
            </button>
            <p style="margin-top:15px; font-size:0.8rem; color:#999;">Tap the mic and speak clearly</p>
        </div>
    `;
    openGameOverlay(html);
}

// Fitur Suara (Normal & Lambat)
function playSpeakingAudio(text, speed) {
    window.speechSynthesis.cancel(); // Hentikan suara sebelumnya
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'en-US';
    utterance.rate = speed; // Di sinilah fungsi lambat bekerja
    window.speechSynthesis.speak(utterance);
}

function recordUserVoice(correctText) {
    const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
    recognition.lang = 'en-US';
    const statusDiv = document.getElementById('speaking-status');
    const micBtn = document.getElementById('mic-trigger');

    recognition.onstart = () => {
        micBtn.style.background = "#ff4b4b";
        micBtn.style.transform = "scale(1.1)";
        statusDiv.innerText = "Listening...";
    };

    recognition.onresult = (event) => {
        const result = event.results[0][0].transcript.toLowerCase().replace(/[.,!]/g, "");
        const target = correctText.toLowerCase().replace(/[.,!]/g, "");

        if (result === target) {
            statusDiv.innerHTML = "<span style='color: #2b8a3e;'>Excellent! Perfect pronunciation! ✨</span>";
            window.userState.xp += 10;
            setTimeout(() => {
                currentSpeakingStep++;
                if (currentSpeakingStep < speakingQuizData.length) showSpeakingChallenge();
                else finishSpeakingModule();
            }, 1500);
        } else {
            speakingHearts--;
            statusDiv.innerHTML = `<span style='color: #c92a2a;'>You said: "${result}"</span>`;
            if (speakingHearts <= 0) {
                setTimeout(showSpeakingGameOver, 1000);
            } else {
                setTimeout(showSpeakingChallenge, 2500);
            }
        }
    };

    recognition.onend = () => {
        micBtn.style.background = "var(--primary-blue)";
        micBtn.style.transform = "scale(1)";
    };

    recognition.start();
}

function showSpeakingGameOver() {
    let html = `
        <div class="theory-card" style="text-align:center;">
            <div style="font-size: 4rem; margin-bottom: 20px;">💔</div>
            <h2>Out of Hearts!</h2>
            <p style="color: #666; margin-bottom: 20px;">Don't give up! Pronunciation takes practice.</p>
            
            <button class="btn-upgrade btn-ad" onclick="watchAdForSpeaking()">
                <i class="fas fa-video"></i> Watch 3 Ads for +3 Hearts
            </button>
            <button class="btn-upgrade btn-premium" style="margin-top:10px;" onclick="openPremiumWall()">
                <i class="fas fa-crown"></i> Get Unlimited Hearts
            </button>
            <button class="btn-upgrade btn-secondary" style="margin-top:10px;" onclick="closeGame()">
                Return Home
            </button>
        </div>
    `;
    openGameOverlay(html);
}

let speakingAdCount = 0;
function watchAdForSpeaking() {
    speakingAdCount++;
    alert(`Ad watched (${speakingAdCount}/3)`);
    if (speakingAdCount >= 3) {
        speakingAdCount = 0;
        speakingHearts = 3;
        showSpeakingChallenge();
    }
}

function finishSpeakingModule() {
    // Hitung total XP (misal 10 XP per soal, jadi total 50 XP)
    const earnedXP = speakingQuizData.length * 10;
    
    // Update state global user (pastikan window.userState ada di main.js)
    if (window.userState) {
        window.userState.xp += earnedXP;
    }

    let html = `
        <div class="theory-card" style="text-align:center; padding: 30px 20px;">
            <div style="font-size: 4rem; margin-bottom: 20px;">🏆</div>
            <h2 style="color: var(--primary-blue);">Latihan Selesai!</h2>
            <p style="color: #666; margin-bottom: 20px;">
                Luar biasa! Pelafalanmu semakin lancar dan natural.
            </p>
            
            <div style="background: #f0f7ff; border-radius: 15px; padding: 20px; margin-bottom: 25px;">
                <div style="font-size: 0.9rem; color: #666; text-transform: uppercase; letter-spacing: 1px;">XP Didapat</div>
                <div style="font-size: 2.5rem; font-weight: bold; color: var(--primary-blue);">+${earnedXP}</div>
            </div>

            <button class="btn-upgrade btn-premium" style="width:100%;" onclick="closeGame()">
                KEMBALI KE MENU
            </button>
        </div>
    `;
    
    // Mainkan suara sukses (opsional)
    const successAudio = new SpeechSynthesisUtterance("Amazing work! You earned " + earnedXP + " XP");
    successAudio.lang = 'en-US';
    window.speechSynthesis.speak(successAudio);

    openGameOverlay(html);
}