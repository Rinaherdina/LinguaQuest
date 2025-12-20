// ==========================================
// 1. GLOBAL REGISTRATION & NAVIGATION
// ==========================================
window.switchTab = switchTab;
window.startDictation = startDictation;
window.startSentenceBuilder = startSentenceBuilder;
window.startTenses = (typeof startTensesModule !== 'undefined') ? startTensesModule : () => {};
window.startSpeaking = (typeof startSpeakingModule !== 'undefined') ? startSpeakingModule : () => {};
window.openIdiomPage = openIdiomPage;
window.watchAdForLife = watchAdForLife;
window.closeGame = closeGame;
window.checkDictation = checkDictation;
window.claimChallengeXP = claimChallengeXP;
window.showFullArchive = showFullArchive;
window.filterArchive = filterArchive;
window.openVocabPage = openVocabPage;
window.playVocabAudio = playVocabAudio;

// ==========================================
// 2. STATE MANAGEMENT & CONFIG
// ==========================================
let userState = window.userState || {
    currentLevel: 1,
    points: 0,
    lives: 5,
    gems: 20,
    streakCount: 0,
    stats: {
        sentenceBuilder: { doneToday: 0, dailyLimit: 5 },
        dictation: { doneToday: 0, dailyLimit: 5 },
        tenses: { doneToday: 0, dailyLimit: 5 },
        speaking: { doneToday: 0, dailyLimit: 5 }
    },
    collectedIdioms: [],
    idiomsOpenedToday: 0,
    lastActiveDate: ""
};

const READING_URL = "https://docs.google.com/spreadsheets/d/e/2PACX-1vQMm5ZPDIt2jlcIwKSL7yUDqUJ27U1KvDpi1uXeydUws3YogJcNNkBSMDE74gXE9n_JofDbNTHoVoYa/pub?output=csv";
window.dictationBank = [];

// ==========================================
// 3. INITIALIZATION & SYNC
// ==========================================
window.onload = async () => {
    console.log("Memulai Sinkronisasi LinguaQuest...");

    // 1. DATA CORE: Load data user agar variabel window.userState tersedia
    loadUserData(); 
    
    // 2. DAILY LOGIC: Cek reset harian dan perbarui Streak
    checkDailyReset();
    if (typeof updateStreak === 'function') {
        updateStreak(); 
    }

    // 3. SB DATA SYNC: Proses data Sentence Builder lokal
    if (typeof syncSentenceBuilderData === 'function') {
        syncSentenceBuilderData();
    }

    // 4. DICTATION SYNC (LOCAL): Proses data Dikte dari file lokal (Blok 7)
    // Kita panggil fungsi lokal yang baru saja kita simpan di Blok 7
    if (typeof syncDictationLocalData === 'function') {
        syncDictationLocalData();
    }

    // 5. ARENA ENGINE: Menggambar peta & gembok level
    if (typeof initArenaLogic === 'function') {
        initArenaLogic();
    }

    // 6. UI UPDATE: Memperbarui tampilan skor, nyawa, dan progress bar
    if (typeof updateUI === 'function') {
        updateUI();
    }
    
    console.log("✅ LinguaQuest Ready: User Level " + (userState.currentLevel || 1));
};

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
    const stats = userState.stats || {};
    const livesEl = document.getElementById('life-count');
    const pointsEl = document.getElementById('point-count');
    const gemsEl = document.getElementById('gem-count');
    const streakEl = document.getElementById('streak-count');

    const totalDone = 
        (stats.sentenceBuilder?.doneToday || 0) + 
        (stats.dictation?.doneToday || 0) + 
        (stats.tenses?.doneToday || 0) +
        (stats.speaking?.doneToday || 0); 

    if(livesEl) livesEl.innerText = userState.isPremium ? "∞" : (userState.lives || 0);
    if(pointsEl) pointsEl.innerText = userState.points || 0;
    if(gemsEl) gemsEl.innerText = userState.gems || 0;
    if(streakEl) streakEl.innerText = userState.streakCount || 0;

    const mainProgress = document.getElementById('main-progress-fill');
    if (mainProgress) {
        const totalLimit = 20; 
        const percentage = (totalDone / totalLimit) * 100;
        mainProgress.style.width = Math.min(percentage, 100) + "%";
    }
}

// ==========================================
// 5. IDIOM GAME LOGIC & COLLECTION
// ==========================================
function openIdiomPage() {
    const source = window.dictionaryData || [];
    if (source.length === 0) return alert("Data Idiom belum dimuat!");

    const today = new Date().toDateString();
    
    // 1. Logika Sinkronisasi Harian: Cek apakah hari sudah berganti
    if (userState.lastIdiomDate !== today) {
        const randomIdiom = source[Math.floor(Math.random() * source.length)];
        userState.todayIdiom = randomIdiom;
        userState.lastIdiomDate = today;
        userState.stats.idioms.doneToday = 0; // Reset status klaim XP harian
        saveUserData();
    }

    const current = userState.todayIdiom;

    // 2. Simpan ke koleksi profil jika belum ada
    if (!userState.collectedIdioms.includes(current.id)) {
        userState.collectedIdioms.push(current.id);
        saveUserData();
        // Langsung perbarui tampilan profil jika sedang terbuka
        renderIdiomCollection(); 
    }

    // 3. Tampilkan Overlay UI
    openGameOverlay(`
        <div class="theory-card" style="text-align:center">
            <h3 style="margin-top:20px; color: #666;">Idiom Hari Ini</h3>
            <h1 style="color:#2196F3; margin:15px 0; font-size: 2rem;">${current.target}</h1>
            
            <div style="background:#f0f7ff; padding:20px; border-radius:15px; margin-bottom:15px; border-left: 5px solid #2196F3;">
                <p style="font-size: 1.1rem;"><strong>Arti:</strong> ${current.meaning}</p>
            </div>

            <div id="idiom-ch-container" style="margin-top:20px; text-align:left; background:#fff8e1; padding:15px; border-radius:10px; border: 1px dashed #ffd54f;">
                <label style="font-weight:bold;">⚡ Challenge (+5 XP):</label>
                ${userState.stats.idioms.doneToday > 0 
                    ? `<p style="color:#2e7d32; margin-top:10px; font-weight:bold;">✅ Kalimat sudah dikirim hari ini!</p>`
                    : `<p style="font-size: 0.8rem; color: #856404;">Buat kalimat menggunakan idiom di atas!</p>
                       <input type="text" id="idiom-challenge-input" placeholder="Tulis kalimatmu..." 
                              style="width:100%; padding:12px; margin-top:10px; border: 1px solid #ddd; border-radius: 8px; box-sizing: border-box;">
                       <button id="btn-claim-idiom" onclick="claimChallengeXP()" class="btn-upgrade btn-secondary" style="width:100%; margin-top:10px;">KIRIM & KLAIM XP</button>`
                }
            </div>
            <button class="btn-upgrade btn-premium" style="width:100%; margin-top:20px" onclick="closeGame()">TUTUP</button>
        </div>
    `, "IDIOM EXPLORER");
}

/**
 * Menambah XP dari tantangan menulis kalimat
 */
function claimChallengeXP() {
    const input = document.getElementById('idiom-challenge-input');
    if (input && input.value.trim().length > 5) {
        addXP(5);
        if (typeof playSuccessSound === 'function') playSuccessSound();
        
        userState.stats.idioms.doneToday = 1; // Tandai sudah klaim hari ini
        userState.stats.idioms.totalDone += 1;
        saveUserData();

        const container = document.getElementById('idiom-ch-container');
        container.innerHTML = `<p style="color:#2e7d32; font-weight:bold; text-align:center; padding:10px;">🌟 +5 XP Berhasil diklaim!</p>`;
    } else {
        alert("Tulis kalimat yang lebih panjang (minimal 6 karakter).");
    }
}

/**
 * Menampilkan koleksi idiom di grid profil
 */
function renderIdiomCollection() {
    const listArea = document.getElementById('idiom-collection-list');
    if (!listArea) return;

    // Ambil 9 koleksi terbaru
    const latestIds = [...(userState.collectedIdioms || [])].reverse().slice(0, 9);
    
    if (latestIds.length === 0) {
        listArea.innerHTML = `<p style="font-size:12px; color:#999; text-align:center;">Belum ada idiom yang dipelajari.</p>`;
        return;
    }

    listArea.innerHTML = `
        <div style="display:grid; grid-template-columns:repeat(3,1fr); gap:8px; padding:5px;">
            ${latestIds.map(id => {
                // Cari data lengkap idiom berdasarkan ID-nya
                const item = window.dictionaryData.find(d => d.id === id);
                const title = item ? item.target : "Unknown";
                return `
                    <div title="${title}" style="background:white; padding:8px 4px; font-size:10px; border:1px solid #eee; text-align:center; border-radius:8px; box-shadow:0 2px 4px rgba(0,0,0,0.05); white-space:nowrap; overflow:hidden; text-overflow:ellipsis;">
                        ${title}
                    </div>`;
            }).join('')}
        </div>`;
}

// ==========================================
// 6. SENTENCE BUILDER (MODULAR & LIVES SYNC)
// ==========================================
function startSentenceBuilder() {
    // 1. Validasi Akses (Limit harian & Nyawa)
    if (!canPlayModule('sentenceBuilder')) return;

    const source = typeof SENTENCE_BUILDER_EXERCISES !== 'undefined' ? SENTENCE_BUILDER_EXERCISES : [];
    
    // 2. Filter soal berdasarkan level user saat ini
    const available = source.filter(s => parseInt(s.level) === (userState.currentLevel || 1));
    
    if (available.length === 0) {
        return alert(`Soal untuk Level ${userState.currentLevel} sedang disiapkan!`);
    }
    
    // 3. Ambil soal acak
    const data = available[Math.floor(Math.random() * available.length)];
    
    // 4. Pecah kalimat menjadi potongan kata (Chips)
    const words = data.target.trim().split(/\s+/);
    const shuffledWords = [...words].sort(() => Math.random() - 0.5);

    const htmlContent = `
        <div class="theory-card" style="text-align:center;">
            <div style="display:flex; justify-content:space-between; margin-bottom:10px;">
                <span style="font-size:0.8rem; color:#666;">Progress: ${userState.stats.sentenceBuilder.doneToday}/5</span>
                <span style="font-size:0.8rem; color:#f44336;"><i class="fas fa-heart"></i> ${userState.isPremium ? '∞' : userState.lives}</span>
            </div>
            <p style="margin-bottom: 5px; color: #666;">Susun kalimat ini:</p>
            <h3 style="color: #333; margin-bottom: 20px; font-style:italic;">"${data.meaning || 'Arti tidak tersedia'}"</h3>
            
            <div id="sb-target-area" style="min-height:100px; border-bottom:3px solid #2196F3; margin:20px 0; display:flex; gap:8px; flex-wrap:wrap; justify-content:center; padding:15px; background: #f0f8ff; border-radius: 15px; box-shadow: inset 0 2px 5px rgba(0,0,0,0.05);"></div>
            
            <div id="sb-word-pool" style="display:flex; gap:10px; flex-wrap:wrap; justify-content:center; background:#fff; padding:20px; border-radius:15px; border:2px dashed #cbd5e0; min-height: 120px;"></div>
            
            <button id="btn-check-sb" class="btn-upgrade btn-premium" style="width:100%; margin-top:25px" 
                onclick="checkSentence('${data.target.replace(/'/g, "\\'")}')">PERIKSA JAWABAN</button>
            
            <div id="sb-feedback" style="margin-top: 20px; padding: 15px; border-radius: 12px; display: none; font-weight: bold;"></div>
        </div>
    `;

    openGameOverlay(htmlContent, "SENTENCE BUILDER LV " + userState.currentLevel);

    // Render Words as Chips
    const pool = document.getElementById('sb-word-pool');
    shuffledWords.forEach(word => {
        const btn = document.createElement('button');
        btn.innerText = word;
        btn.className = 'word-chip'; // Pastikan CSS word-chip ada di style.css
        btn.onclick = () => moveWord(btn);
        pool.appendChild(btn);
    });
}

function moveWord(btn) {
    const target = document.getElementById('sb-target-area');
    const pool = document.getElementById('sb-word-pool');
    // Toggle posisi: Jika di pool pindah ke target, dan sebaliknya
    if (btn.parentElement.id === 'sb-word-pool') {
        target.appendChild(btn);
    } else {
        pool.appendChild(btn);
    }
}

function checkSentence(correct) {
    const userWords = Array.from(document.getElementById('sb-target-area').children).map(b => b.innerText.trim()).join(' ');
    const feedbackEl = document.getElementById('sb-feedback');
    const btnCheck = document.getElementById('btn-check-sb');

    feedbackEl.style.display = 'block';

    if (userWords === correct.trim()) {
        // Logika Benar (Tetap seperti sebelumnya)
        userState.stats.sentenceBuilder.doneToday++;
        userState.points += 10;
        saveUserData();

        feedbackEl.style.backgroundColor = "#e8f5e9";
        feedbackEl.style.color = "#2e7d32";
        feedbackEl.innerHTML = `✅ Benar! +10 XP <br><button onclick="startSentenceBuilder()" class="btn-upgrade" style="background:#2e7d32; color:white; margin-top:10px; width:100%;">SOAL BERIKUTNYA</button>`;
        btnCheck.style.display = 'none';
        playSuccessSound();
    } else {
        // PERBAIKAN: Logika Salah dengan Menampilkan Jawaban Benar
        handleWrong(); // Mengurangi nyawa

        feedbackEl.style.backgroundColor = "#ffebee";
        feedbackEl.style.color = "#c62828";
        
        // Menampilkan pesan salah dan kunci jawaban
        feedbackEl.innerHTML = `
            ❌ Salah! Sisa nyawa: ${userState.isPremium ? '∞' : userState.lives}<br>
            <div style="margin-top: 10px; font-weight: normal; font-size: 0.9rem; border-top: 1px solid #ffcdd2; padding-top: 10px;">
                <span style="font-weight: bold;">Jawaban yang benar:</span><br>
                <i style="color: #333;">"${correct}"</i>
            </div>
            <button onclick="startSentenceBuilder()" class="btn-upgrade" style="background:#c62828; color:white; margin-top:10px; width:100%;">COBA SOAL LAIN</button>
        `;
        btnCheck.style.display = 'none';
    }
}

// ==========================================
// 7. DICTATION LOGIC (LOCAL DATA SYNC)
// ==========================================
/**
 * 1. Sinkronisasi Data (Pastikan Level Terkunci)
 */
function syncDictationLocalData() {
    window.dictationBank = []; 

    const sources = [
        { data: window.DICTATION_L1_SENTENCES, lv: 1 },
        { data: window.DICTATION_L2_SENTENCES, lv: 2 },
        { data: window.DICTATION_L3_SENTENCES, lv: 3 },
        { data: window.DICTATION_L4_SENTENCES, lv: 4 },
        { data: window.DICTATION_L5_SENTENCES, lv: 5 }
    ];

    sources.forEach(source => {
        if (source.data && Array.isArray(source.data)) {
            const formatted = source.data.map(row => ({
                id: row[0],
                level: Number(source.lv), // Pastikan ini Number
                target: row[4],  
                hint: row[5]     
            }));
            window.dictationBank.push(...formatted);
        }
    });
    console.log("✅ Dictation Bank Ready. Level 1 count:", window.dictationBank.filter(s => s.level === 1).length);
}

/**
 * 2. Memulai Dictation (Filter Spesifik)
 */
function startDictation() {
    if (!window.dictationBank || window.dictationBank.length === 0) {
        syncDictationLocalData();
    }

    if (typeof canPlayModule === 'function' && !canPlayModule('dictation')) return;

    // AMBIL LEVEL DARI USER STATE DAN PAKSA JADI NUMBER
    const currentLv = Number(userState.currentLevel) || 1;

    // FILTER KETAT: Hanya soal yang levelnya sama persis
    const available = window.dictationBank.filter(s => Number(s.level) === currentLv);
    
    if (available.length === 0) {
        console.error("Filter gagal. Level dicari:", currentLv, "Data tersedia:", window.dictationBank);
        return alert(`Soal untuk Level ${currentLv} tidak ditemukan.`);
    }

    // Ambil acak hanya dari hasil filter tersebut
    const data = available[Math.floor(Math.random() * available.length)];
    const safeTarget = encodeURIComponent(data.target);

    // TAMPILAN UI
    const htmlContent = `
        <div class="theory-card" style="text-align:center">
            <div style="display:flex; justify-content:space-between; margin-bottom:15px; font-size:0.8rem; color:#666;">
                <span>MODUL DIKTE: LEVEL ${currentLv}</span>
                <span><i class="fas fa-heart" style="color:#f44336;"></i> ${userState.isPremium ? '∞' : userState.lives}</span>
            </div>

            <div style="margin:20px 0; display:flex; justify-content:center; gap:20px;">
                <button onclick="playVoice(decodeURIComponent('${safeTarget}'), 0.8)" class="node-circle" style="width:65px; height:65px; background:#2196F3; border:none; border-radius:50%; color:white; cursor:pointer;">
                    <i class="fas fa-volume-up fa-xl"></i>
                </button>
                <button onclick="playVoice(decodeURIComponent('${safeTarget}'), 0.4)" class="node-circle" style="width:50px; height:50px; background:#FFF176; border:none; border-radius:50%; color:#F57F17; cursor:pointer;">
                    <i class="fas fa-snail"></i>
                </button>
            </div>

            <p style="font-size:1rem; color:#555; margin-bottom:15px;"><i>"${data.hint}"</i></p>
            
            <textarea id="dictation-input" placeholder="Tulis kalimat yang Anda dengar..." 
                style="width:100%; height:80px; padding:12px; border-radius:12px; border:2px solid #ddd;"></textarea>
            
            <div id="dictation-feedback" style="margin-top:10px; padding:12px; border-radius:10px; display:none; font-weight:bold;"></div>

            <button id="btn-check-dict" class="btn-upgrade btn-premium" style="width:100%; margin-top:15px;" 
                onclick="checkDictation(decodeURIComponent('${safeTarget}'))">PERIKSA JAWABAN</button>
        </div>
    `;

    openGameOverlay(htmlContent, "DICTATION LV " + currentLv);
    setTimeout(() => playVoice(data.target, 0.8), 500);
}

/**
 * 3. Validasi Jawaban
 */
function checkDictation(correct) {
    const userInput = document.getElementById('dictation-input').value.trim();
    const feedbackEl = document.getElementById('dictation-feedback');
    const btnCheck = document.getElementById('btn-check-dict');

    if (!userInput) return alert("Silakan tulis jawaban terlebih dahulu.");

    const cleanUser = userInput.toLowerCase().replace(/[.!?,]/g, '').trim();
    const cleanCorrect = correct.toLowerCase().replace(/[.!?,]/g, '').trim();

    feedbackEl.style.display = 'block';

    if (cleanUser === cleanCorrect) {
        userState.stats.dictation.doneToday++;
        userState.points += 15;
        saveUserData();

        feedbackEl.style.backgroundColor = "#e8f5e9";
        feedbackEl.style.color = "#2e7d32";
        feedbackEl.innerHTML = `✅ Sempurna! +15 XP <br>
            <button onclick="startDictation()" class="btn-upgrade" style="background:#2e7d32; color:white; margin-top:10px; width:100%; border:none; border-radius:8px; padding:10px;">SOAL BERIKUTNYA</button>`;
        btnCheck.style.display = 'none';
        
        if (typeof playSuccessSound === 'function') playSuccessSound();
    } else {
        // Panggil fungsi handleWrong untuk urusan nyawa & feedback dasar
        handleWrong(); 
        
        feedbackEl.style.backgroundColor = "#ffebee";
        feedbackEl.style.color = "#c62828";
        feedbackEl.innerHTML = `
            ❌ Masih ada yang keliru.<br>
            <div style="margin-top:8px; font-weight:normal; font-size:0.85rem; border-top:1px solid #ffcdd2; padding-top:8px;">
                <b>Kunci Jawaban:</b><br><span style="color:#333;">"${correct}"</span>
            </div>
            <button onclick="startDictation()" class="btn-upgrade" style="background:#c62828; color:white; margin-top:10px; width:100%; border:none; border-radius:8px; padding:10px;">COBA SOAL LAIN</button>
        `;
        btnCheck.style.display = 'none';
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
    userState.weeklyXP = (userState.weeklyXP || 0) + amount;
    saveUserData();
    console.log(`XP Bertambah! Total sekarang: ${userState.points}`);
}

// PERBAIKAN: Fungsi nextLevel tanpa window.gameState
function nextLevel() {
    if (userState.currentLevel < 5) {
        userState.currentLevel++;
        console.log("Level Up to: " + userState.currentLevel);
        saveUserData();
    }
}

function canPlayModule(moduleKey) {
    // 1. Bypass untuk user Premium
    if (userState.isPremium) return true;

    // 2. Cek Nyawa
    if (userState.lives <= 0) {
        showPremiumWall("Nyawa Habis! Tunggu reset harian atau gunakan Premium.");
        return false;
    }

    // 3. Cek Limit Harian berdasarkan moduleKey (dictation, sentenceBuilder, dsb)
    const stats = userState.stats[moduleKey];
    if (stats) {
        if (stats.doneToday >= stats.dailyLimit) {
            showPremiumWall(`Limit harian ${moduleKey.replace(/([A-Z])/g, ' $1')} tercapai!`);
            return false;
        }
    }

    return true;
}

/**
 * REVISI: Penanganan Jawaban Salah
 * Fungsi: Mengurangi nyawa dan memberikan feedback visual.
 */
function handleWrong() {
    // User premium tidak kehilangan nyawa
    if (userState.isPremium) return;

    // Kurangi nyawa (tidak boleh di bawah 0)
    if (userState.lives > 0) {
        userState.lives--;
    }
    
    saveUserData(); // Simpan perubahan ke LocalStorage
    updateUI();     // Perbarui tampilan jumlah hati di navbar

    // Cari elemen feedback yang aktif di overlay
    const feedbackEl = document.getElementById('sb-feedback') || 
                       document.getElementById('dictation-feedback') || 
                       document.getElementById('exam-feedback');

    if (feedbackEl) {
        feedbackEl.style.display = 'block';
        feedbackEl.style.backgroundColor = "#ffebee";
        feedbackEl.style.color = "#c62828";
        feedbackEl.innerHTML = `❌ Salah! Sisa nyawa: ${userState.lives}`;
    }

    // Jika nyawa habis setelah pengurangan ini
    if (userState.lives <= 0) {
        setTimeout(() => {
            closeGameOverlay(); // Tutup game yang sedang jalan
            showPremiumWall("Nyawa Anda telah habis! Belajar lagi besok atau aktifkan Premium.");
        }, 1500);
    }
}

function saveUserData() {
    localStorage.setItem('linguaQuest_User', JSON.stringify(userState));
    updateUI();
}

function loadUserData() {
    const saved = localStorage.getItem('linguaQuest_User');
    if (saved) {
        const parsed = JSON.parse(saved);
        userState = Object.assign(userState, parsed);
    }
}

function checkDailyReset() {
    const today = new Date().toDateString();
    if (userState.lastActiveDate !== today) {
        for (let key in userState.stats) {
            userState.stats[key].doneToday = 0;
        }
        userState.idiomsOpenedToday = 0;
        userState.vocabClaimedToday = false;
        userState.adsWatchedToday = 0;
        userState.lastActiveDate = today;
        saveUserData();
    }
}

function playVoice(text, rate = 0.8) {
    // Memastikan browser mendukung SpeechSynthesis
    if ('speechSynthesis' in window) {
        // Batalkan suara yang sedang berjalan agar tidak tumpang tindih
        window.speechSynthesis.cancel();

        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = 'en-US';
        utterance.rate = rate;
        
        // Menangani eror "Audio play blocked" dengan memastikan dipicu oleh klik
        window.speechSynthesis.speak(utterance);
    } else {
        console.error("Browser tidak mendukung Text-to-Speech.");
    }
}

function openGameOverlay(contentHTML, title = "LINGUAQUEST") {
    const overlay = document.getElementById('game-overlay');
    const gameContent = document.getElementById('game-content');
    const header = `
        <div class="game-overlay-header" style="background: #2196F3; padding: 25px 15px; border-radius: 0 0 30px 30px; text-align:center; position:relative;">
            <button onclick="closeGame()" style="position:absolute; top:20px; left:15px; background:none; border:none; color:white; cursor:pointer;">
                <i class="fas fa-chevron-left"></i> Kembali
            </button>
            <h2 style="color: white; margin: 0;">${title}</h2>
        </div>
    `;
    gameContent.innerHTML = header + `<div class="theory-card">${contentHTML}</div>`;
    overlay.style.display = 'flex';
}

function closeGame() {
    const overlay = document.getElementById('game-overlay');
    if(overlay) overlay.style.display = 'none';
}

function watchAdForLife() {
    if (userState.adsWatchedToday >= 3) return alert("Jatah iklan habis.");
    alert("Iklan dimulai...");
    setTimeout(() => {
        userState.lives += 1;
        userState.adsWatchedToday++;
        saveUserData();
        closePremiumWall();
        alert("+1 Nyawa Berhasil!");
    }, 3000);
}

function updateProfileUI() {
    const s = userState.stats;
    const reportArea = document.getElementById('idiom-collection-list'); 
    if(reportArea) {
        reportArea.innerHTML = `
            <div style="background:#f0f7ff; padding:15px; border-radius:15px;">
                <div class="stat-row">🧩 Sentence: <b>${s.sentenceBuilder.doneToday}/${s.sentenceBuilder.dailyLimit}</b></div>
                <div class="stat-row">🎧 Dictation: <b>${s.dictation.doneToday}/${s.dictation.dailyLimit}</b></div>
                <div style="margin-top:10px; font-weight:bold; color:#ff9600;">Total XP: ${userState.points}</div>
            </div>
        `;
    }
    const pointsEl = document.getElementById('profile-xp-display');
    if (pointsEl) {
        // Menampilkan total XP (Contoh: 1250 XP)
        pointsEl.innerText = `${userState.points} XP`; 
    }
    
    // Progress Bar Menuju Level Berikutnya
    const nextMeta = curriculumMetadata[userState.currentLevel];
    if (nextMeta) {
        const progress = Math.min((userState.points / nextMeta.xpToExam) * 100, 100);
        const bar = document.getElementById('xp-progress-bar');
        if (bar) bar.style.width = progress + "%";
    }
}

function showPremiumWall(reason) {
    const modal = document.getElementById('premium-modal');
    if (modal) {
        document.getElementById('premium-reason').innerText = reason;
        modal.style.display = 'flex';
    } else {
        alert(reason);
    }
}

function closePremiumWall() {
    const modal = document.getElementById('premium-modal');
    if (modal) modal.style.display = 'none';
}

function playSuccessSound() {
    const audio = new Audio('https://www.soundjay.com/buttons/sounds/button-37.mp3'); 
    audio.play().catch(e => console.log("Audio play blocked"));
}

// ==========================================
// 10. VOCABULARY SYSTEM
// ==========================================
function openVocabPage() {
    const currentLv = userState.currentLevel || 1;
    const levelKey = "LV" + currentLv;
    const master = window.VOCAB_MASTER || {};
    
    // Proteksi: Jika data level tidak ada atau level > 5
    if (currentLv > 5) {
        return alert("Selamat! Anda telah menyelesaikan semua level yang tersedia.");
    }

    const dailyVocab = getDailyVocab(); 
    if (!dailyVocab || dailyVocab.length === 0) {
        return alert("Data kosakata " + levelKey + " tidak ditemukan. Pastikan file vocabulary-" + levelKey.toLowerCase() + ".js sudah terpasang.");
    }

    // Gamifikasi: Reward XP harian (sekali saja)
    if (!userState.vocabClaimedToday) {
        if (typeof addXP === "function") addXP(5);
        userState.vocabClaimedToday = true;
        saveUserData();
    }

    let htmlContent = `
        <div class="theory-card">
            <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:15px;">
                <h2 style="color:#2196F3; margin:0;">📚 Level ${currentLv}</h2>
                <span class="badge" style="background:#e3f2fd; color:#2196F3; padding:5px 10px; border-radius:15px; font-size:0.8rem;">Daily Selection</span>
            </div>
            
            <p style="font-size:0.9rem; color:#666; margin-bottom:15px;">Pelajari 5 kata harian berikut untuk persiapan Ujian Final Level ${currentLv}.</p>

            <div style="max-height:300px; overflow-y:auto; margin-bottom:20px; border:1px solid #f0f0f0; border-radius:10px;">
                ${dailyVocab.map(item => `
                    <div class="archive-item" style="display:flex; justify-content:space-between; align-items:center; padding:12px; border-bottom:1px solid #eee;">
                        <div>
                            <strong style="font-size:1.1rem; color:#333;">${item.word}</strong> 
                            <small style="color:#888; margin-left:5px;">${item.phonetic || ''}</small><br>
                            <small style="color:#2196F3; font-weight:bold;">${item.translation}</small>
                        </div>
                        <button onclick="playVocabAudio('${item.word}')" style="background:#f0f7ff; border:none; color:#2196F3; width:35px; height:35px; border-radius:50%; cursor:pointer;">
                            <i class="fas fa-volume-up"></i>
                        </button>
                    </div>
                `).join('')}
            </div>

            <div style="background:#fff9db; padding:15px; border-radius:10px; border:1px solid #ffe066; margin-bottom:15px;">
                <p style="font-size:0.85rem; color:#856404; margin:0 0 10px 0;"><strong>Siap Naik Level?</strong><br>Selesaikan Ujian Final yang menggabungkan semua modul.</p>
                <button class="btn-upgrade btn-premium" style="width:100%;" onclick="goToFinalExam()">
                    <i class="fas fa-graduation-cap"></i> IKUT UJIAN FINAL LV ${currentLv}
                </button>
            </div>
            
            <button class="btn-upgrade btn-secondary" style="width:100%;" onclick="closeGame()">BELAJAR LAGI NANTI</button>
        </div>
    `;
    openGameOverlay(htmlContent, "VOCABULARY TRAINING");
}

// Fungsi jembatan ke ujian final (soalnya akan kita bahas nanti)
function goToFinalExam() {
    if (confirm("Ujian Final akan menguji semua modul di Level " + userState.currentLevel + ". Siap dimulai?")) {
        closeGame(); // Tutup menu vocab
        startGlobalLevelExam(); // Panggil mesin ujian dari file level_exam_master.js
    }
}

function getDailyVocab() {
    // 1. Ambil level user saat ini (default ke level 1 jika tidak ada)
    const currentLv = userState.currentLevel || 1;
    const levelKey = "LV" + currentLv;
    
    // 2. Ambil master data dari window (kumpulan file vocabulary-lv.js)
    const master = window.VOCAB_MASTER || {};
    const allVocab = master[levelKey] || [];
    
    // Jika data kosong, kirim balik array kosong agar tidak error
    if (allVocab.length === 0) return [];
    
    // 3. LOGIKA DAILY SEED (Gamifikasi: 5 Kata Tetap Sama Selama Seharian)
    const seed = new Date().toDateString();
    const seededRandom = (str) => {
        let hash = 0;
        for (let i = 0; i < str.length; i++) {
            // Algoritma hashing sederhana untuk mengacak berdasarkan tanggal
            hash = ((hash << 5) - hash) + str.charCodeAt(i);
            hash |= 0;
        }
        return Math.abs(hash) / 2147483647;
    };

    // 4. Acak dan ambil hanya 5 kata (Sesuai aturan Freemium)
    return [...allVocab]
        .sort((a, b) => seededRandom(seed + a.word) - seededRandom(seed + b.word))
        .slice(0, 5)
        .map(item => ({
            ...item,
            // Memastikan kunci 'translation' selalu ada untuk tampilan
            translation: item.translation || item.meaning || "Tidak ada arti"
        }));
}

function playVocabAudio(text) {
    if (!text) return;
    
    // Batalkan suara yang sedang berjalan agar tidak tumpang tindih
    window.speechSynthesis.cancel();
    
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'en-US'; // Setel ke Bahasa Inggris
    utterance.rate = 0.85;    // Sedikit lebih lambat agar jelas bagi pelajar
    utterance.pitch = 1.0;
    
    window.speechSynthesis.speak(utterance);
}
// ==========================================
// 11. ADDITIONAL UTILITIES & ACCESS CONTROL
// ==========================================
function checkPremiumAccess(actionType) {
    if (userState.isPremium) return true; 

    // Cek limit harian Dictation
    if (actionType === 'dictation') {
        const done = userState.stats.dictation?.doneToday || 0;
        const limit = userState.stats.dictation?.dailyLimit || 5;
        if (done >= limit) {
            showPremiumWall("Limit Harian Dictation Tercapai! (5/5)");
            return false;
        }
    }
    
    // Cek limit harian Story
    if (actionType === 'story') {
        // Karena di data.js belum ada stats.story, kita asumsikan limit 1
        if ((userState.storyDoneToday || 0) >= 1) {
            showPremiumWall("Limit membaca cerita harian tercapai.");
            return false;
        }
    }
    
    return true;
}

/**
 * Validasi apakah kata ada di daftar kosakata (Vocab Master)
 */
function isValidEnglishWord(word) {
    const levelKey = "LV" + (userState.currentLevel || 1);
    const vocabList = window.VOCAB_MASTER ? window.VOCAB_MASTER[levelKey] : null;
    
    if (!vocabList) return true; // Bypass jika data master tidak ada
    const cleanWord = word.toLowerCase().trim().replace(/[^a-z]/g, '');
    return vocabList.some(entry => entry.word.toLowerCase() === cleanWord);
}

/**
 * REVISI: Logika Ujian Global
 */
function startGlobalLevelExam() {
    const currentLv = userState.currentLevel;
    
    // Ambil soal SB & Dictation yang sesuai level user sekarang
    const sbSoal = window.SENTENCE_BUILDER_EXERCISES.filter(s => s.level === currentLv);
    const dictSoal = window.dictationBank.filter(s => s.level === currentLv);

    // Minimal 10 soal untuk ujian
    const examPool = [
        ...sbSoal.sort(() => 0.5 - Math.random()).slice(0, 5),
        ...dictSoal.sort(() => 0.5 - Math.random()).slice(0, 5)
    ];

    window.examState = {
        questions: examPool,
        currentIndex: 0,
        score: 0
    };

    renderNextExamQuestion();
}

function renderNextExamQuestion() {
    const state = window.examState;
    const data = state.questions[state.currentIndex];
    const isDict = data.id && data.id.startsWith('d_'); // Cek jika ID diawali 'd_' (Dictation)

    const html = `
        <div class="theory-card" style="text-align:center;">
            <h3>Ujian Kenaikan Level ${userState.currentLevel}</h3>
            <p>Soal ${state.currentIndex + 1} / 10</p>
            <hr>
            ${isDict ? 
                `<button onclick="playVoice('${data.target}', 0.8)" class="btn-upgrade btn-secondary">🔊 Dengar Suara</button>
                 <p><i>"${data.hint}"</i></p>` :
                `<p style="font-size:1.2rem;"><b>"${data.meaning}"</b></p>`
            }
            <input type="text" id="exam-input" class="input-modern" style="width:100%; margin:15px 0;" placeholder="Jawaban Inggris...">
            <button onclick="submitExamAnswer()" class="btn-upgrade btn-premium" style="width:100%;">LANJUT</button>
        </div>
    `;
    openGameOverlay(html, "GLOBAL FINAL EXAM");
}