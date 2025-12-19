// ==========================================
// 1. GLOBAL REGISTRATION & NAVIGATION
// ==========================================
window.switchTab = switchTab;
window.startDictation = startDictation;
window.startSentenceBuilder = startSentenceBuilder;
window.startTenses = startTensesModule;
window.startSpeaking = startSpeakingModule;
window.openIdiomPage = function() { renderRandomIdiom(); };
window.watchAdForLife = watchAdForLife;
window.closeGame = closeGame;
window.checkDictation = checkDictation;
window.claimChallengeXP = claimChallengeXP;
window.showFullArchive = showFullArchive;
window.filterArchive = filterArchive;
window.gameState = {
    currentLevel: 'LV1',
    score: 0,
    isGameOver: false
};

// ==========================================
// 2. STATE MANAGEMENT & CONFIG
// ==========================================
let userState = window.userState;

const READING_URL = "https://docs.google.com/spreadsheets/d/e/2PACX-1vQMm5ZPDIt2jlcIwKSL7yUDqUJ27U1KvDpi1uXeydUws3YogJcNNkBSMDE74gXE9n_JofDbNTHoVoYa/pub?output=csv";
const DICT_URL = "https://docs.google.com/spreadsheets/d/e/2PACX-1vScYr7mvqndccYlbRN3BTEtuaqhgSrciwNJbLxA7ck9lciyOflk8S17aXh6b7sHMsd02TWU6abVH-jZ/pub?output=csv";

window.dictationBank = [];

// ==========================================
// 3. INITIALIZATION & SYNC
// ==========================================
window.onload = async () => {
    loadUserData();
    checkDailyReset();
    updateStreak();
    
    if (typeof initArenaLogic === 'function') {
        initArenaLogic();
        window.openLevelMenu = openLevelMenu;
    }

    if (typeof syncSentenceBuilderData === 'function') {
        syncSentenceBuilderData();
    }

    updateUI();
    await syncDictationData();
};

async function syncDictationData() {
    try {
        const response = await fetch(DICT_URL);
        const csvData = await response.text();
        const rows = csvData.split('\n').slice(1); 

        window.dictationBank = rows.map(row => {
            const cols = row.split(/,(?=(?:(?:[^"]*"){2})*[^"]*$)/).map(c => c.replace(/^"|"$/g, '').trim());
            return { 
                level: parseInt(cols[0]) || 1,
                target: cols[2] || "", 
                hint: cols[1] || "",
                tense: "Dictation Exercise"
            };
        });
        console.log("✅ Dictation Bank Synced");
    } catch (error) {
        console.error("Gagal sinkron data:", error);
    }
}

// ==========================================
// 4. NAVIGATION & UI
// ==========================================
function switchTab(tab) {
    const views = ['home-view', 'level-menu-view', 'profile-section', 'league-section'];
    views.forEach(id => {
        const el = document.getElementById(id);
        if (el) el.style.display = 'none';
    });

    const targetView = (tab === 'home') ? 'home-view' : 
                       (tab === 'level-menu') ? 'level-menu-view' : 
                       (tab === 'profile') ? 'profile-section' : 
                       (tab === 'league') ? 'league-section' : null;

    if (targetView && document.getElementById(targetView)) {
        document.getElementById(targetView).style.display = 'block';
    }

    updateBottomNavUI(tab);
    if (tab === 'profile') {
        renderIdiomCollection();
        updateProfileUI();
    }
}

function updateBottomNavUI(tab) {
    const navItems = document.querySelectorAll('.nav-item');
    navItems.forEach(item => {
        item.classList.remove('active');
        const span = item.querySelector('span');
        if (span && span.innerText.toLowerCase() === (tab === 'home' ? 'beranda' : tab === 'profile' ? 'profil' : 'liga')) {
            item.classList.add('active');
        }
    });
}

function updateUI() {
    // Update Bar Atas
    const livesEl = document.getElementById('life-count');
    const pointsEl = document.getElementById('point-count');
    const gemsEl = document.getElementById('gem-count');
    const streakEl = document.getElementById('streak-count');
    const totalDone = (userState.stats.sentenceBuilder?.doneToday || 0) + 
                      (userState.stats.dictation?.doneToday || 0) + 
                      (userState.stats.tenses?.doneToday || 0)
                      (userState.stats.speaking?.doneToday || 0); 

    if(livesEl) livesEl.innerText = userState.isPremium ? "∞" : userState.lives;
    if(pointsEl) pointsEl.innerText = userState.points;
    if(gemsEl) gemsEl.innerText = userState.gems;
    if(streakEl) streakEl.innerText = userState.streakCount || 0;

    // Update Progress Bar di Home jika ada
    const mainProgress = document.getElementById('main-progress-fill');
    if (mainProgress) {
    // Tambahkan userState.stats.speaking.doneToday
    // Gunakan "|| 0" sebagai pengaman jika data belum terbuat di localStorage
    const speakingDone = userState.stats.speaking ? userState.stats.speaking.doneToday : 0;
    
    const totalDone = 
        userState.stats.sentenceBuilder.doneToday + 
        userState.stats.dictation.doneToday + 
        userState.stats.tenses.doneToday +
        speakingDone; // Modul ke-4

    // Sesuaikan limit. Jika tiap modul limitnya 5, maka totalnya 20
    const totalLimit = 20; 
    
    mainProgress.style.width = Math.min((totalDone / totalLimit) * 100, 100) + "%";
}

// ==========================================
// 5. IDIOM GAME LOGIC
// ==========================================
function renderRandomIdiom() {
    // 1. Ambil sumber data (pastikan namanya sesuai dengan di idiom_data.js)
    const sourceData = window.dictionaryData; 
    const today = new Date().toDateString();

    // 2. Validasi awal: apakah data sudah dimuat?
    if (!sourceData || sourceData.length === 0) {
        console.error("Data idiom tidak ditemukan di window.dictionaryData");
        return alert("Data idiom belum siap atau gagal dimuat.");
    }

    if (userState.idiomsOpenedToday >= 3 && !userState.isPremium) {
        return showPremiumWall("Limit Harian Tercapai!");
    }

    // 3. Logika pengambilan idiom hari ini
    if (userState.lastIdiomDate !== today || !userState.todayIdiom) {
        // Cari yang belum dikoleksi
        const uncollected = sourceData.filter(item => !userState.collectedIdioms.includes(item.target));
        const pool = uncollected.length > 0 ? uncollected : sourceData;
        
        // Pilih acak dari pool
        const randomIndex = Math.floor(Math.random() * pool.length);
        userState.todayIdiom = pool[randomIndex];
        
        userState.lastIdiomDate = today;
        userState.idiomsOpenedToday++;
        
        if (!userState.collectedIdioms.includes(userState.todayIdiom.target)) {
            userState.collectedIdioms.push(userState.todayIdiom.target);
        }
        saveUserData();
    }

    const current = userState.todayIdiom;

    // 4. CEK TERAKHIR: Jika 'current' masih kosong karena alasan teknis
    if (!current) {
        return alert("Gagal mengambil idiom hari ini.");
    }

    // 5. Render ke Overlay
    openGameOverlay(`
        <div class="theory-card" style="text-align:center">
            <h3>Idiom Hari Ini</h3>
            <h1 style="margin:15px 0; color: #2196F3;">${current.target}</h1>
            <p><strong>Arti:</strong> ${current.meaning}</p>
            <div style="margin-top:20px; text-align:left; background:#fff8e1; padding:15px; border-radius:10px;">
                <label style="font-weight:bold;">⚡ Challenge (+5 XP):</label>
                <input type="text" id="idiom-challenge-input" placeholder="Tulis kalimatmu..." style="width:100%; padding:10px; margin-top:10px; border: 1px solid #ddd; border-radius: 8px;">
                <button onclick="claimChallengeXP()" class="btn-upgrade btn-secondary" style="width:100%; margin-top:10px;">KIRIM</button>
            </div>
            <button class="btn-upgrade btn-premium" style="width:100%; margin-top:20px" onclick="closeGame()">TUTUP</button>
        </div>
    `);
}

function claimChallengeXP() {
    const input = document.getElementById('idiom-challenge-input');
    if (input && input.value.length > 5) {
        addXP(5);
        playSuccessSound();
        alert("🌟 +5 XP!");
        input.disabled = true;
    }
}

function playSuccessSound() {
    const audio = new Audio('https://www.soundjay.com/buttons/sounds/button-37.mp3'); 
    audio.play().catch(e => console.log("Audio play blocked"));
}

// ==========================================
// SENTENCE BUILDER WITH FEEDBACK CARD
// ==========================================

function startSentenceBuilder() {
    // 1. Validasi Aturan Belajar (Nyawa & Limit 5 Soal)
    if (!canPlayModule('sentenceBuilder')) return;

    // 2. Ambil Data dari sb_data.js
    const source = typeof SENTENCE_BUILDER_EXERCISES !== 'undefined' ? SENTENCE_BUILDER_EXERCISES : [];
    const available = source.filter(s => parseInt(s.level) === userState.currentLevel);
    
    if (available.length === 0) return alert("Soal tidak ditemukan untuk level ini.");
    
    const data = available[Math.floor(Math.random() * available.length)];
    const words = data.target.split(' ');
    const shuffledWords = [...words].sort(() => Math.random() - 0.5);

    // 3. Susun Konten HTML (Gunakan backtick di awal dan akhir)
    const htmlContent = `
        <div class="theory-card" style="text-align:center;">
            <p style="margin-bottom: 10px; color: #666;">Artinya:</p>
            <h3 style="color: #333; margin-bottom: 20px;">"${data.meaning || 'Arti tidak tersedia'}"</h3>
            
            <div id="sb-target-area" style="min-height:80px; border-bottom:2px solid #2196F3; margin:20px 0; display:flex; gap:8px; flex-wrap:wrap; justify-content:center; padding:10px; background: #f0f8ff; border-radius: 10px;"></div>
            
            <div id="sb-word-pool" style="display:flex; gap:10px; flex-wrap:wrap; justify-content:center; background:#f9f9f9; padding:20px; border-radius:15px; border:2px dashed #ddd; min-height: 100px;"></div>
            
            <button id="btn-check-sb" class="btn-upgrade btn-premium" style="width:100%; margin-top:25px" 
                onclick="checkSentence('${data.target.replace(/'/g, "\\'")}')">
                PERIKSA JAWABAN
            </button>
            
            <div id="sb-feedback" style="margin-top: 20px; padding: 15px; border-radius: 12px; display: none; font-weight: bold; transition: 0.4s;"></div>
        </div>
    `;

    // 4. Buka Overlay dengan Header Biru Elegan
    openGameOverlay(htmlContent, "SENTENCE BUILDER");

    // 5. Render Tombol Kata ke dalam Pool
    const pool = document.getElementById('sb-word-pool');
    shuffledWords.forEach(word => {
        const btn = document.createElement('button');
        btn.innerText = word;
        btn.className = 'word-chip';
        btn.onclick = () => moveWord(btn);
        pool.appendChild(btn);
    });
}

function checkSentence(correct) {
    const userWords = Array.from(document.getElementById('sb-target-area').children).map(b => b.innerText.trim()).join(' ');
    const feedbackEl = document.getElementById('sb-feedback');
    const btnCheck = document.getElementById('btn-check-sb');

    feedbackEl.style.display = 'block';

    if (userWords === correct.trim()) {
        // UPDATE STATISTIK
        userState.stats.sentenceBuilder.correct++;
        userState.stats.sentenceBuilder.totalDone++;
        userState.stats.sentenceBuilder.doneToday++;
        userState.points += 10;
        saveUserData();

        feedbackEl.style.backgroundColor = "#e8f5e9";
        feedbackEl.style.color = "#2e7d32";
        feedbackEl.innerHTML = `✅ Benar! +10 XP <br><button onclick="startSentenceBuilder()" class="btn-upgrade" style="background:#2e7d32; color:white; margin-top:10px; width:100%;">SOAL BERIKUTNYA</button>`;
        btnCheck.style.display = 'none';
        playSuccessSound();
    } else {
        handleWrong(); // Memanggil manajemen nyawa global
    }
}

function moveWord(btn) {
    const target = document.getElementById('sb-target-area');
    const pool = document.getElementById('sb-word-pool');
    if (btn.parentElement.id === 'sb-word-pool') target.appendChild(btn);
    else pool.appendChild(btn);
}

// ==========================================
// 7. DICTATION LOGIC
// ==========================================
// ==========================================
// 7. DICTATION LOGIC (FIXED)
// ==========================================
function startDictation() {
    if (!canPlayModule('dictation')) return;

    // Pastikan sumber data tersedia
    const source = (typeof DICTATION_L1_SENTENCES !== 'undefined') ? DICTATION_L1_SENTENCES : [];
    
    if (source.length === 0) {
        return alert("Data Dictation tidak ditemukan! Pastikan file dictation_L1_sentences.js sudah terpanggil.");
    }

    // Mengambil satu baris acak
    const randomRow = source[Math.floor(Math.random() * source.length)];

    /** * PERBAIKAN DI SINI:
     * Karena format data Anda adalah array di dalam array [[...]], 
     * kita harus memastikan mengambil elemen pertama jika data dibungkus double array,
     * lalu ambil indeks ke-4 untuk kalimat Inggris dan ke-5 untuk artinya.
     */
    const activeRow = Array.isArray(randomRow[0]) ? randomRow[0] : randomRow;
    
    const sentenceTarget = String(activeRow[4]); // "He teaches math..."
    const meaningTarget = activeRow[5];          // "Dia mengajar..."

    const htmlContent = `
        <div class="theory-card" style="text-align:center">
            <div style="margin:30px 0; display: flex; justify-content: center; align-items: center; gap: 20px;">
                <button onclick="playVoice('${sentenceTarget.replace(/'/g, "\\'")}', 0.8)" 
                        class="node-circle" style="width:70px; height:70px; background:#2196F3; color:white; border:none; border-radius:50%; cursor:pointer; font-size:1.5rem;">
                    <i class="fas fa-volume-up"></i>
                </button>

                <button onclick="playVoice('${sentenceTarget.replace(/'/g, "\\'")}', 0.4)" 
                        class="node-circle" style="width:55px; height:55px; background:#FFF176; color:#F57F17; border:2px solid #F57F17; border-radius:50%; cursor:pointer; font-size:1.2rem;"
                        title="Perlambat suara">
                    <i class="fas fa-snail"></i>
                </button>
            </div>
            
            <p style="color:#666; margin-bottom: 5px;">Dengarkan kalimatnya</p>
            <p style="font-size:0.85rem; color:#999; margin-bottom: 20px;"><i>Artinya: ${meaningTarget}</i></p>
            
            <textarea id="dictation-input" placeholder="Tulis yang Anda dengar..." style="width:100%; height:80px; padding:12px; border-radius:12px; border:2px solid #ddd;"></textarea>
            
            <button class="btn-upgrade btn-premium" style="width:100%; margin-top:20px;" 
                onclick="checkDictation('${sentenceTarget.replace(/'/g, "\\'")}')">PERIKSA JAWABAN</button>
            
            <div id="dictation-feedback" style="margin-top:15px; padding:15px; border-radius:10px; display:none; font-weight:bold;"></div>
        </div>
    `;

    openGameOverlay(htmlContent, "DICTATION MODE");
    
    // Putar suara otomatis saat pertama kali buka
    setTimeout(() => playVoice(sentenceTarget, 0.8), 500);
}

function checkDictation(correct) {
    const userInput = document.getElementById('dictation-input').value.trim().toLowerCase();
    // Membersihkan tanda baca agar pengecekan lebih adil bagi siswa
    const cleanCorrect = correct.toLowerCase().replace(/[.!?,]/g, '').trim();
    const feedbackEl = document.getElementById('dictation-feedback');
    const progressFill = document.getElementById('progress-fill'); // Ambil elemen dari index.html
    // Update Progress Bar (Gamifikasi Visual)
    const progress = (userState.stats.dictation.doneToday / userState.stats.dictation.dailyLimit) * 100;
    document.getElementById('progress-fill').style.width = progress + "%";

    feedbackEl.style.display = 'block';

    if (userInput.replace(/[.!?,]/g, '') === cleanCorrect) {
        // 1. Update Statistik & Skor
        userState.stats.dictation.totalDone++;
        userState.stats.dictation.doneToday++;
        userState.points += 15;
        
        // 2. Animasi Progress Bar (Tambahan agar UI index.html aktif)
        if (progressFill) {
            // Contoh: Jika target harian 5 soal, maka naik 20% per soal
            const currentProgress = (userState.stats.dictation.doneToday / 5) * 100;
            progressFill.style.width = Math.min(currentProgress, 100) + "%";
        }

        saveUserData();

        feedbackEl.style.backgroundColor = "#d7ffb8";
        feedbackEl.style.color = "#58cc02";
        feedbackEl.innerHTML = "✅ Benar! +15 XP";
        
        playSuccessSound();
        
        setTimeout(() => {
            closeGame();
            updateProfileUI();
            
            // Reset progress bar untuk sesi berikutnya jika sudah tutup
            if (progressFill && userState.stats.dictation.doneToday >= 5) {
                progressFill.style.width = "0%";
            }
        }, 2000);
    } else {
        // 3. Logika Salah Jawaban
        feedbackEl.style.backgroundColor = "#ffdfe0";
        feedbackEl.style.color = "#ff4b4b";
        feedbackEl.innerHTML = "❌ Salah, coba dengarkan lagi.";
        handleWrong();
    }
}

// ==========================================
// 8. ARCHIVE & PROFILE
// ==========================================
function showFullArchive() {
    const archiveArea = document.getElementById('full-archive-list');
    if (!archiveArea) return;
    const sourceData = window.dictionaryData || [];
    
    archiveArea.innerHTML = userState.collectedIdioms.map(term => {
        const detail = sourceData.find(d => d.target === term);
        return `<div class="archive-item" style="padding:10px; border-bottom:1px solid #eee;">
            <strong>${term}</strong><br><small>${detail ? detail.meaning : ''}</small>
        </div>`;
    }).join('');
    document.getElementById('archive-modal').style.display = 'flex';
}

function filterArchive() {
    const input = document.getElementById('idiom-search').value.toLowerCase();
    const items = document.getElementsByClassName('archive-item');
    for (let item of items) {
        item.style.display = item.innerText.toLowerCase().includes(input) ? "block" : "none";
    }
}

// ==========================================
// 9. CORE UTILITIES
// ==========================================
function updateStreak() {
    const today = new Date().toDateString();
    if (!userState.lastLoginDate) {
        userState.streakCount = 1;
    } else {
        const diff = Math.floor((new Date(today) - new Date(userState.lastLoginDate)) / 86400000);
        if (diff === 1) userState.streakCount++;
        else if (diff > 1) userState.streakCount = 1;
    }
    userState.lastLoginDate = today;
    saveUserData();
}

function addXP(amount) {
    userState.points += amount;
    userState.weeklyXP += amount;
    saveUserData();
}

function nextLevel() {
    const currentNum = parseInt(window.gameState.currentLevel.replace('LV', ''));
    if (currentNum < 5) {
        window.gameState.currentLevel = `LV${currentNum + 1}`;
        console.log("Level Up to: " + window.gameState.currentLevel);
    }
}

// ==========================================
// CORE GAMIFICATION MANAGER
// ==========================================

// 1. Cek apakah boleh main (Global Check)
function canPlayModule(moduleKey) {
    if (userState.isPremium) return true;

    // Cek Nyawa
    if (userState.lives <= 0) {
        showPremiumWall("Nyawa Habis! Tonton iklan atau tunggu besok.");
        return false;
    }

    // Cek Limit Harian Modul
    const m = userState.stats[moduleKey];
    if (m && m.doneToday >= m.dailyLimit) {
        showPremiumWall(`Limit harian ${moduleKey} tercapai!`);
        return false;
    }
    return true;
}

// 2. Logika Salah Jawaban (Global)
function handleWrong() {
    if (userState.isPremium) return;

    userState.lives--;
    saveUserData();
    
    if (userState.lives <= 0) {
        userState.lives = 0;
        showPremiumWall("Nyawa Habis!");
    } else {
        // Feedback visual sederhana jika masih ada nyawa
        const feedbackEl = document.getElementById('sb-feedback') || document.getElementById('dictation-feedback');
        if (feedbackEl) {
            feedbackEl.style.display = 'block';
            feedbackEl.style.backgroundColor = "#ffebee";
            feedbackEl.style.color = "#c62828";
            feedbackEl.innerHTML = `❌ Salah! Sisa nyawa: ${userState.lives}`;
        }
    }
}

function saveUserData() {
    localStorage.setItem('linguaQuest_User', JSON.stringify(userState));
    updateUI();
}

function loadUserData() {
    const saved = localStorage.getItem('linguaQuest_User');
    if (saved) window.userState = Object.assign(window.userState, JSON.parse(saved));
}

function checkDailyReset() {
    const today = new Date().toDateString();
    if (userState.lastActiveDate !== today) {
        for (let key in userState.stats) {
            userState.stats[key].doneToday = 0;
        }
        userState.adsWatchedToday = 0;
        userState.lastActiveDate = today;
        saveUserData();
    }
}

function playVoice(text, rate = 1) {
    window.speechSynthesis.cancel(); 

    // 1. Bersihkan teks dari karakter teknis
    let cleanText = String(text).replace(/_/g, ' ').trim();
    const utterance = new SpeechSynthesisUtterance(cleanText);
    
    utterance.lang = 'en-US';
    utterance.rate = rate;

    // 2. AMBIL DAFTAR SUARA
    let voices = window.speechSynthesis.getVoices();

    // 3. PILIH SUARA (Google US English sangat disarankan untuk edukasi)
    // Kita cari yang namanya mengandung 'Google' dan 'en-US'
    let selectedVoice = voices.find(v => v.name.includes('Google') && v.lang === 'en-US');
    
    // Jika Google tidak ada, cari suara en-US apa saja yang tersedia
    if (!selectedVoice) {
        selectedVoice = voices.find(v => v.lang === 'en-US' || v.lang === 'en_US');
    }

    // Pasangkan suara yang dipilih ke utterance
    if (selectedVoice) {
        utterance.voice = selectedVoice;
    }

    // 4. JALANKAN
    window.speechSynthesis.speak(utterance);
}

// Tambahan: Supaya daftar suara sudah 'ready' saat aplikasi dibuka
window.speechSynthesis.onvoiceschanged = () => {
    window.speechSynthesis.getVoices();
};

function openGameOverlay(contentHTML, title = "LINGUAQUEST") {
    const overlay = document.getElementById('game-overlay');
    const gameContent = document.getElementById('game-content');
    
    const elegantHeader = `
        <div class="game-overlay-header" style="background: #2196F3 !important; padding: 25px 15px; border-radius: 0 0 30px 30px;">
            <button onclick="closeGame()" style="position:absolute; top:20px; left:15px; background:none; border:none; color:white; font-weight:bold; cursor:pointer;">
                <i class="fas fa-chevron-left" style="color: #ff9600;"></i> Beranda
            </button>
            <i class="fas fa-graduation-cap" style="font-size: 2.2rem; color: #ff9600;"></i>
            <h2 style="color: white; margin: 0; text-transform: uppercase;">${title}</h2>
        </div>
    `;

    gameContent.innerHTML = elegantHeader + `<div class="theory-card">${contentHTML}</div>`;
    overlay.style.display = 'flex';
}

function closeGame() {
    document.getElementById('game-overlay').style.display = 'none';
}

function watchAdForLife() {
    if (userState.adsWatchedToday >= 3) {
        alert("Jatah iklan hari ini sudah habis.");
        return;
    }

    alert("Iklan dimulai (5 detik)...");
    setTimeout(() => {
        userState.lives += 1;
        userState.adsWatchedToday += 1;
        saveUserData();
        closePremiumWall();
        alert(`Berhasil! +1 Nyawa. (Sisa iklan: ${3 - userState.adsWatchedToday})`);
    }, 5000);
}

function renderIdiomCollection() {
    const listArea = document.getElementById('idiom-collection-list');
    if (!listArea) return;
    const latest = [...userState.collectedIdioms].reverse().slice(0, 9);
    listArea.innerHTML = `<div style="display:grid; grid-template-columns:repeat(3,1fr); gap:5px;">
        ${latest.map(term => `<div style="background:white; padding:5px; font-size:10px; border:1px solid #ddd; text-align:center;">${term}</div>`).join('')}
    </div>`;
}

function updateProfileUI() {
    const s = userState.stats;
    const reportArea = document.getElementById('idiom-collection-list'); 
    
    if(reportArea) {
        reportArea.innerHTML = `
            <div style="background:#f0f7ff; padding:15px; border-radius:15px; text-align:left; margin-top:10px;">
                <h4 style="margin-bottom:12px; color:#2196F3; border-bottom: 2px solid #e1f5fe; padding-bottom: 5px;">
                    <i class="fas fa-chart-bar"></i> Laporan Belajar
                </h4>
                
                <div class="stat-row">🧩 Sentence Builder: <b>${s.sentenceBuilder.doneToday}/${s.sentenceBuilder.dailyLimit}</b></div>
                <div class="stat-row">🎧 Dictation Mode: <b>${s.dictation.doneToday}/${s.dictation.dailyLimit}</b></div>
                <div class="stat-row">🧠 Tenses Master: <b>${s.tenses.doneToday}/${s.tenses.dailyLimit}</b></div>
                <div class="stat-row">🗣️ Speaking Module: <b>${s.speaking?.doneToday || 0}/${s.speaking?.dailyLimit || 5}</b></div>

                <div style="margin-top:10px; padding-top:10px; border-top:1px solid #ddd; font-weight:bold; color:#ff9600;">
                    Total Skor: ${userState.points} XP
                </div>
            </div>
        `;
    }
}

// ==========================================
// 10. PREMIUM & ACCESS CONTROL
// ==========================================

function openIdiomPage() {
    const source = typeof IDIOM_DATA !== 'undefined' ? IDIOM_DATA : [];
    if (source.length === 0) return alert("Data Idiom tidak ditemukan!");

    // Ambil data acak
    const current = source[Math.floor(Math.random() * source.length)];
    
    // Update state agar tidak undefined saat render
    userState.todayIdiom = current;

    openGameOverlay(`
        <div class="theory-card" style="text-align:center">
            <button class="back-btn" onclick="document.getElementById('game-overlay').style.display='none'">
                <i class="fas fa-arrow-left"></i> Kembali
            </button>
            <h3 style="margin-top:20px;">Idiom Hari Ini</h3>
            <h1 style="color:#2196F3; margin:15px 0;">${current.target}</h1>
            <div style="background:#f0f7ff; padding:15px; border-radius:10px; margin-bottom:15px;">
                <p><strong>Arti:</strong> ${current.meaning}</p>
            </div>
            <button class="btn-upgrade btn-premium" style="width:100%;" onclick="document.getElementById('game-overlay').style.display='none'">TUTUP</button>
        </div>
    `);
}

function showPremiumWall(reason) {
    const modal = document.getElementById('premium-modal');
    if (modal) {
        const reasonText = document.getElementById('premium-reason');
        if (reasonText) reasonText.innerText = reason;
        modal.style.display = 'flex';
    } else {
        // Fallback jika elemen modal belum ada di HTML
        alert("Fitur Premium: " + reason);
    }
}

function closePremiumWall() {
    const modal = document.getElementById('premium-modal');
    if (modal) modal.style.display = 'none';
}

function checkPremiumAccess(actionType) {
    if (userState.isPremium) return true; // Jika premium, bebas akses

    if (actionType === 'dictation') {
        if (userState.sentencesDoneToday >= 5) {
            showPremiumWall("Limit Harian Dictation Tercapai!");
            return false;
        }
    }
    
    if (actionType === 'story') {
        // Asumsi jika ada fitur story
        if (userState.storyDoneToday >= 1) {
            showPremiumWall("Anda hanya bisa membaca 1 cerita per hari.");
            return false;
        }
    }
    
    return true;
}

function isValidEnglishWord(word) {
    // levelKey dan vocabList hidup di dalam sini sebagai variabel lokal fungsi
    const levelKey = window.userState.getLevelString(); 
    const vocabList = window.VOCAB_MASTER[levelKey];
    
    if (!vocabList) return true;
    const cleanWord = word.toLowerCase().trim().replace(/[^a-z]/g, '');
    return vocabList.some(entry => entry.word.toLowerCase() === cleanWord);
}

/**
 * Membuka Halaman Kosakata (List Kata per Level)
 */
function openVocabPage() {
    const dailyVocab = getDailyVocab(); 
    
    if (!dailyVocab || dailyVocab.length === 0) {
        alert("Daftar kata belum siap!");
        return;
    }

    // 1. Tombol yang Anda tanyakan dimasukkan ke dalam sini sebagai bagian dari htmlContent
    let htmlContent = `
        <div class="theory-card" style="position:relative; z-index:10000;">
            <h2 style="color:var(--primary-blue); margin-bottom:15px;">📚 Daily Vocab</h2>
            
            <div style="display: grid; gap: 10px; margin-bottom: 20px; max-height:350px; overflow-y:auto;">
                ${dailyVocab.map(item => `
                    <div class="archive-item">
                        <div style="display:flex; justify-content:space-between;">
                            <strong>${item.word}</strong>
                            <button onclick="playVocabAudio('${item.word}')" style="background:none; border:none; color:var(--primary-blue); cursor:pointer;">
                                <i class="fas fa-volume-up"></i>
                            </button>
                        </div>
                        <div style="color:#666;">${item.translation || item.meaning}</div>
                    </div>
                `).join('')}
            </div>
            
            <button class="btn-upgrade btn-ad" 
                    style="width:100%; position:relative; z-index:10001; pointer-events:auto; cursor:pointer;" 
                    onclick="startVocabQuiz()">
                <i class="fas fa-bolt"></i> MULAI LATIHAN KILAT
            </button>

            <button class="btn-upgrade btn-secondary" 
                    style="margin-top:10px; width:100%; position:relative; z-index:10001; cursor:pointer;" 
                    onclick="closeGame()">
                KEMBALI
            </button>
        </div>
    `;

    // 2. Fungsi pemanggil overlay diletakkan di paling bawah setelah htmlContent siap
    openGameOverlay(htmlContent);
}

// Pastikan fungsi audio ini juga ada agar tombol volume tidak error
function playVocabAudio(text) {
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'en-US';
    window.speechSynthesis.speak(utterance);
}

/** * HELPER: Mengambil 5 kata random per hari & selaraskan properti 'meaning'
 * Taruh ini di main.js agar bisa dipakai di mana saja
 */
function getDailyVocab() {
    const levelKey = "LV" + (window.userState.currentLevel || 1);
    const allVocab = window.VOCAB_MASTER[levelKey] || [];
    
    // 1. Logika agar randomnya tetap sama selama 24 jam
    const seed = new Date().toISOString().slice(0, 10).replace(/-/g, "");
    const seededRandom = (s) => {
        const x = Math.sin(s) * 10000;
        return x - Math.floor(x);
    };

    // 2. Acak dan ambil 5 kata
    let dailyList = [...allVocab]
        .sort((a, b) => seededRandom(seed + a.word) - seededRandom(seed + b.word))
        .slice(0, 5);

    // 3. Penyelarasan properti: Ubah 'meaning' jadi 'translation' secara otomatis
    return dailyList.map(item => ({
        ...item,
        translation: item.translation || item.meaning || "Tidak ada arti"
    }));
}