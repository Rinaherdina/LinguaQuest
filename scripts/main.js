// ==========================================
// 1. GLOBAL REGISTRATION & NAVIGATION
// ==========================================
window.switchTab = switchTab;
window.startDictation = startDictation;
window.startSentenceBuilder = startSentenceBuilder;
window.startSpeaking = () => { 
    if (typeof startSpeakingModule === 'function') {
        startSpeakingModule();
    } else {
        console.error("Modul Speaking belum dimuat.");
    }
};
window.openIdiomPage = openIdiomPage;
window.watchAdForLife = watchAdForLife;
window.closeGame = closeGame;
window.checkDictation = checkDictation;
window.claimChallengeXP = claimChallengeXP;
window.showFullArchive = showFullArchive;
window.filterArchive = filterArchive;
window.openVocabPage = openVocabPage;
window.playVocabAudio = playVocabAudio;
window.startTenses = function() {
    if (typeof startTensesModule === 'function') {
        startTensesModule();
    } else {
        console.error("Fungsi startTensesModule tidak ditemukan. Pastikan tenses_logic.js sudah dimuat.");
    }
};

// Variabel status admin global
window.isAdminMode = false;

// ==========================================
// 2. STATE MANAGEMENT & CONFIG
// ==========================================
window.userState = window.userState || {
    currentLevel: 1,
    points: 0,
    lives: 5,
    gems: 20,
    streakCount: 0,
    isPremium: false,
    stats: {
        sentenceBuilder: { doneToday: 0, dailyLimit: 5 },
        dictation: { doneToday: 0, dailyLimit: 5 },
        tenses: { doneToday: 0, dailyLimit: 5 },
        speaking: { doneToday: 0, dailyLimit: 5 },
        indoglish: { doneToday: 0, dailyLimit: 5 }
    },
    collectedIdioms: [],
    idiomsOpenedToday: 0,
    lastActiveDate: ""
};

// Gunakan var untuk alias agar bisa ditimpa/diakses antar file tanpa error
var userState = window.userState;
window.dictationBank = [];

// Fungsi Helper XP agar sinkron dengan semua modul
window.addXP = function(amount) {
    userState.points += amount;
    console.log(`XP Bertambah: +${amount}. Total XP: ${userState.points}`);
    if (typeof updateUI === 'function') updateUI();
    if (typeof saveUserData === 'function') saveUserData();
};

// ==========================================
// 3. INITIALIZATION & SYNC
// ==========================================
window.onload = async () => {
    console.log("Memulai Sinkronisasi LinguaQuest...");
    
    if (typeof loadUserData === 'function') loadUserData(); 
    if (typeof checkDailyReset === 'function') checkDailyReset();
    
    if (typeof updateStreak === 'function') updateStreak(); 
    if (typeof syncSentenceBuilderData === 'function') syncSentenceBuilderData();
    if (typeof syncDictationLocalData === 'function') syncDictationLocalData();
    if (typeof initArenaLogic === 'function') initArenaLogic();
    if (typeof updateUI === 'function') updateUI();
    
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
    
    // --- 1. Bagian Atas (Stats Bar) ---
    const lifeElem = document.getElementById('life-count');
    const gemElem = document.getElementById('gem-count');
    const pointElem = document.getElementById('point-count');
    const streakElem = document.getElementById('streak-count');

    // Menangani tampilan nyawa tak terbatas jika premium
    if (lifeElem) lifeElem.innerText = userState.isPremium ? "∞" : (userState.lives || 0);
    if (gemElem) gemElem.innerText = userState.gems || 0;
    if (pointElem) pointElem.innerText = userState.points || 0;
    if (streakElem) streakElem.innerText = userState.streakCount || 0;

    // --- 2. Bagian Profil (Accumulated Stats) ---
    const profileXP = document.getElementById('profile-xp-display');
    if (profileXP) profileXP.innerText = `${userState.points} XP`;

    // Update Progress Bar Menuju Level Berikutnya (Ganjaran XP)
    const nextMeta = curriculumMetadata[userState.currentLevel];
    if (nextMeta) {
        const progress = Math.min((userState.points / nextMeta.xpToExam) * 100, 100);
        const bar = document.getElementById('xp-progress-bar');
        if (bar) bar.style.width = progress + "%";
    }

    // --- 3. Progress Bar Aktivitas Harian (Main Home) ---
    const mainProgress = document.getElementById('main-progress-fill');
    if (mainProgress) {
        // Menghitung total pengerjaan modul hari ini
        const totalDone = 
            (stats.sentenceBuilder?.doneToday || 0) + 
            (stats.dictation?.doneToday || 0) + 
            (stats.tenses?.doneToday || 0) +
            (stats.speaking?.doneToday || 0); 
            
        const totalLimit = 20; // Target 20 latihan per hari
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
    const sourceData = window.dictionaryData || []; // Pastikan ada fallback array kosong
    const item = sourceData.find(d => d.id === id);

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
    // 1. Tambah poin total & akumulasi statistik profil
    userState.points += amount;
    userState.weeklyXP = (userState.weeklyXP || 0) + amount;
    
    // Tambahkan ke statistik kumulatif seumur hidup (jika ada)
    if (!userState.stats.totalXP) userState.stats.totalXP = 0;
    userState.stats.totalXP += amount;

    // 2. Gunakan fungsi suara terpusat untuk menghindari error konsol
    playSuccessSound();

    // 3. Notifikasi Toast
    if (typeof showToast === 'function') {
        showToast(`+${amount} XP Berhasil Didapatkan!`, 'success');
    }

    // 4. Simpan & Update UI Secara Menyeluruh
    // Fungsi saveUserData yang baru sudah mencakup updateUI() dan updateProfileUI()
    saveUserData(); 

    console.log(`XP Bertambah! Total XP Profil: ${userState.stats.totalXP}`);
}
 
// PERBAIKAN: Fungsi nextLevel tanpa window.gameState
function nextLevel() {
    if (userState.currentLevel < 5) {
        userState.currentLevel++;
        console.log("Level Up to: " + userState.currentLevel);
        saveUserData();
    }
}

/**
 * Memeriksa apakah user diizinkan memainkan modul tertentu.
 * Mendukung bypass untuk Admin (via Secret Trigger) dan Premium.
 */
function canPlayModule(moduleKey) {
    // 1. PRIORITAS UTAMA: Mode Admin (Demo Mode)
    if (window.isAdminMode) return true;

    // 2. Bypass untuk user Premium
    if (userState.isPremium) return true;

    // 3. Cek Nyawa
    if (userState.lives <= 0) {
        showPremiumWall("Nyawa Habis! Gunakan Premium untuk lanjut.");
        return false;
    }

    // 4. Cek Limit Harian & Progres
    const stats = userState.stats[moduleKey];
    if (stats) {
        if (stats.doneToday >= stats.dailyLimit) {
            showPremiumWall(`Limit harian ${moduleKey} tercapai!`);
            return false;
        }
        // Tambahan: Jika ini modul tenses, cek level
        if (moduleKey === 'tenses' && typeof activeTense !== 'undefined' && activeTense) {
            if (stats.unlockedLevel < activeTense.level) {
                alert("Selesaikan level sebelumnya!");
                return false;
            }
        }
    }

    return true;
}

/**
 * REVISI: Penanganan Jawaban Salah
 * Fungsi: Mengurangi nyawa dan memberikan feedback visual.
 */
function handleWrong() {
    if (userState.isPremium) return;

    // --- TAMBAHAN: Efek Suara Gagal ---
    const errorSound = document.getElementById('sound-error');
    if(errorSound) { errorSound.currentTime = 0; errorSound.play().catch(() => {}); }

    // --- TAMBAHAN: Toast Notification Merah ---
    if (typeof showToast === 'function') {
        showToast("Jawaban Salah! Nyawa Berkurang.", "error");
    }

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
    // 1. Validasi data
    if (!userState || typeof userState !== 'object') {
        console.error("Gagal menyimpan: Data user tidak valid.");
        return;
    }

    // 2. Simpan ke LocalStorage agar data tidak hilang saat refresh
    localStorage.setItem('linguaQuest_User', JSON.stringify(userState));
    
    // 3. Update Tampilan Stats Bar (Hati, Gem, Poin di atas)
    if (typeof updateUI === 'function') {
        updateUI();
    }

    // 4. TAMBAHAN: Update Tampilan Profil (XP Kumulatif & Progress Bar)
    // Ini memastikan angka di tab profil selalu sama dengan data terbaru
    if (typeof updateProfileUI === 'function') {
        updateProfileUI();
    }
    
    console.log("💾 Progress & Statistik Profil berhasil disinkronkan.");
}

function loadUserData() {
    const saved = localStorage.getItem('linguaQuest_User');
    if (saved) {
        const parsed = JSON.parse(saved);
        
        // Gabungkan data lama dengan yang tersimpan
        userState = Object.assign(userState, parsed);

        // PROTEKSI: Jika user lama belum punya stats tenses, tambahkan secara otomatis
        if (!userState.stats.tenses) {
            userState.stats.tenses = { doneToday: 0, dailyLimit: 5 };
            console.log("Stats Tenses diinisialisasi untuk user lama.");
        }
    }
}

function checkDailyReset() {
    const today = new Date().toDateString();
    
    // Cek apakah hari ini berbeda dengan hari terakhir user aktif
    if (userState.lastActiveDate !== today) {
        console.log("🌅 Hari baru dimulai! Mereset limit harian...");

        // 1. Reset limit pengerjaan modul
        for (let key in userState.stats) {
            if (userState.stats[key] && typeof userState.stats[key] === 'object') {
                userState.stats[key].doneToday = 0;
            }
        }
        
        // 2. Reset limit iklan & aktivitas harian
        userState.adsWatchedToday = 0; 
        userState.idiomsOpenedToday = 0;
        userState.vocabClaimedToday = false;
        
        // 3. Update tanggal terakhir aktif agar tidak reset berulang kali
        userState.lastActiveDate = today;
        
        // 4. Bonus Harian: Kembalikan nyawa ke standar (5) jika di bawah itu
        // Jika user punya nyawa > 5 (dari iklan kemarin), nyawa tetap aman (tidak dikurangi)
        if (userState.lives < 5) {
            userState.lives = 5;
        }
        
        // 5. Simpan dan update tampilan secara menyeluruh
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
    // 1. Cek jika jatah iklan sudah habis
    if (userState.adsWatchedToday >= 3) {
        // Tampilkan pesan langsung di dalam modal premium
        showPremiumWall("Jatah iklan hari ini sudah habis (3/3). Aktifkan Premium untuk akses tanpa batas!");
        return; 
    }

    // 2. Jika masih ada jatah, jalankan proses "Nonton Iklan"
    showToast("Memulai iklan... (3 detik)", "info");
    
    setTimeout(() => {
        userState.lives += 1;
        userState.adsWatchedToday += 1;
        
        saveUserData(); // Otomatis update UI dan simpan data
        closePremiumWall();
        
        showToast("Berhasil! +1 Nyawa ditambahkan.", "success");
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
    const reasonText = document.getElementById('premium-reason');
    
    if (!modal) return console.error("Elemen 'premium-modal' tidak ditemukan di HTML!");

    if (reasonText) reasonText.innerText = reason;

    // PENTING: Cari area konten di dalam modal untuk menaruh tombol
    // Pastikan di index.html ada elemen dengan class 'premium-popup' atau 'theory-card'
    const contentArea = modal.querySelector('.premium-popup') || modal.querySelector('.theory-card');
    
    if (contentArea) {
        // 1. Bersihkan tombol lama agar tidak DOUBLE (Screenshot 144)
        let oldActions = contentArea.querySelector('.premium-actions');
        if (oldActions) oldActions.remove();

        // 2. Buat kontainer baru
        const actionButtons = document.createElement('div');
        actionButtons.className = 'premium-actions';
        actionButtons.style.width = "100%";
        actionButtons.style.marginTop = "20px";

        // 3. Isi dengan tombol yang benar (Integrasi Iklan & Premium)
        actionButtons.innerHTML = `
            <button class="btn-upgrade btn-ad" onclick="watchAdForLife()" style="width:100%; margin-bottom:10px; background:#4CAF50; color:white; border:none; padding:12px; border-radius:10px; cursor:pointer;">
                <i class="fas fa-play-circle"></i> TONTON IKLAN (+1 ❤️)
            </button>
            <button class="btn-upgrade btn-premium" onclick="alert('Fitur Premium segera hadir!')" style="width:100%; background: #FFD700; color: #333; font-weight:bold; border:none; padding:12px; border-radius:10px; cursor:pointer;">
                <i class="fas fa-crown"></i> AKTIFKAN PREMIUM
            </button>
            <button onclick="closePremiumWall()" style="width:100%; margin-top:10px; background:none; border:none; color:#666; cursor:pointer;">
                NANTI SAJA
            </button>
        `;
        
        contentArea.appendChild(actionButtons);
    }

    modal.style.display = 'flex';
}

function closePremiumWall() {
    const modal = document.getElementById('premium-modal');
    if (modal) modal.style.display = 'none';
}

function playSuccessSound() {
    const audio = document.getElementById('sound-success');
    
    if (audio) {
        // Mengembalikan durasi ke nol agar bisa diputar berulang kali dengan cepat
        audio.currentTime = 0; 
        
        audio.play().catch(e => {
            // Memberikan pesan yang lebih informatif di konsol
            console.warn("Audio play prevented by browser. User must interact with the page first.");
        });
    } else {
        console.error("Elemen audio 'sound-success' tidak ditemukan di index.html");
    }
}

/**
 * Fungsi Terpusat untuk Memberikan Reward
 */
function addReward(xp = 0, gems = 0) {
    userState.points += xp;
    userState.gems += gems;
    
    // Simpan ke statistik kumulatif profil
    if (!userState.stats.totalXP) userState.stats.totalXP = 0;
    userState.stats.totalXP += xp;
    
    saveUserData();
    updateUI();
    
    console.log(`Reward Berhasil: +${xp} XP, +${gems} Gems. Total XP Profil: ${userState.stats.totalXP}`);
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
// 11. REVISED ACCESS CONTROL (SINKRON DENGAN ADMIN)
// ==========================================
function checkPremiumAccess(actionType) {
    const label = actionType ? actionType.toUpperCase() : "FITUR";

    // 1. BYPASS ADMIN (Prioritas Tertinggi)
    if (window.isAdminMode) {
        showToast(`ADMIN: Bypass Akses ${label}`, 'success');
        return true;
    }

    // 2. BYPASS PREMIUM (User yang sudah bayar bebas akses)
    if (userState.isPremium) return true;

    // 3. CEK LIMIT HARIAN UNTUK USER GRATIS
    
    // A. Limit Dictation
    if (actionType === 'dictation') {
        const done = userState.stats.dictation?.doneToday || 0;
        const limit = userState.stats.dictation?.dailyLimit || 5;
        if (done >= limit) {
            showPremiumWall("Limit Harian Dictation Tercapai! (5/5)");
            return false;
        }
    }
    
    // B. Limit Story
    if (actionType === 'story') {
        if ((userState.storyDoneToday || 0) >= 1) {
            showPremiumWall("Limit membaca cerita harian tercapai. Upgrade Premium untuk akses tanpa batas!");
            return false;
        }
    }

    // C. Limit Tenses (Level Tinggi)
    if (actionType.includes('tense_level_')) {
        const level = parseInt(actionType.split('_').pop());
        if (level > 1) { // Contoh: Level 2-5 adalah Premium
            showPremiumWall(`Tenses Level ${level} adalah fitur Premium.`);
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
window.startGlobalLevelExam = function() {
    const user = window.userState;
    const neededXP = 1000;

    // JIKA XP BELUM CUKUP
    if (user.points < neededXP) {
        const progress = (user.points / neededXP) * 100;
        
        // Gunakan struktur HTML yang bersih untuk openGameOverlay
        let html = `
            <div style="text-align:center; padding: 10px;">
                <div style="font-size: 3rem; margin-bottom: 15px;">🔒</div>
                <h2 style="color:#333; margin-bottom:10px;">Gerbang Terkunci</h2>
                <p style="color:#666;">Kumpulkan XP untuk membuka ujian ini.</p>
                
                <div style="background:#eee; height:15px; border-radius:10px; margin:20px 0; overflow:hidden;">
                    <div style="background:#f1c40f; height:100%; width:${progress}%"></div>
                </div>
                
                <div style="font-weight:bold; color:#f39c12; margin-bottom:20px;">
                    ${user.points} / ${neededXP} XP
                </div>

                <button onclick="closeGame()" style="width:100%; padding:15px; background:#3498db; color:white; border:none; border-radius:10px; font-weight:bold;">
                    LANJUT BELAJAR
                </button>
            </div>
        `;
        openGameOverlay(html, "UJIAN TERKUNCI");
        return;
    }

    // JIKA XP CUKUP, MULAI UJIAN
    if (typeof initGlobalExam === 'function') {
        initGlobalExam();
    } else {
        showToast("Sistem ujian sedang disiapkan!", "info");
    }
};

function renderNextExamQuestion() {
    const state = window.examState;
    const data = state.questions[state.currentIndex];
    const isDict = data.id && typeof data.id === 'string' && data.id.startsWith('d_');

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

/**
 * SATU FUNGSI UNTUK SEMUA: Menangani akses, menu, dan inisialisasi modul
 */
function startTenses() {
    console.log("Memulai Modul Tenses...");

    // 1. Prioritas Utama: Cek Akses (Admin/Premium/Limit)
    // Fungsi checkPremiumAccess Anda sudah menangani bypass Admin
    if (!checkPremiumAccess('tenses')) return;

    // 2. Tutup Menu Level (Agar layar bersih)
    const levelMenuView = document.getElementById('level-menu-view');
    if (levelMenuView) {
        levelMenuView.style.display = 'none';
    }

    // 3. Jalankan Tampilan Modul
    // Pastikan ID 'game-overlay' dan 'tenses-module-ui' ada di index.html
    const overlay = document.getElementById('game-overlay');
    const tensesUI = document.getElementById('tenses-module-ui');

        if (overlay && tensesUI) {
        overlay.style.display = 'flex';
        tensesUI.style.display = 'block';
        
        // Munculkan pilihan Tense (Present, Past, Future)
        const selector = document.getElementById('tense-btns-container');
        if (selector) selector.style.display = 'flex';
        
        // Sembunyikan card detail jika sebelumnya masih terbuka
        const displayCard = document.getElementById('tense-display-card');
        if (displayCard) displayCard.style.display = 'none';

        showToast("Modul Tenses Terbuka", "success");
    } else {
        console.error("Elemen UI Tenses tidak ditemukan di HTML!");
        alert("Terjadi kesalahan teknis pada tampilan.");
    }
}

// FUNGSI NOTIFIKASI TOAST
function showToast(message, type = 'success') {
    const container = document.getElementById('toast-container');
    if (!container) return;

    const toast = document.createElement('div');
    const bgColor = type === 'success' ? '#4CAF50' : '#f44336'; // Hijau untuk sukses, Merah untuk gagal
    
    toast.style.cssText = `
        background: ${bgColor};
        color: white;
        padding: 12px 25px;
        border-radius: 50px;
        box-shadow: 0 4px 15px rgba(0,0,0,0.2);
        font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
        font-weight: bold;
        font-size: 0.9rem;
        min-width: 150px;
        text-align: center;
        animation: slideInToast 0.3s ease-out, fadeOutToast 0.5s 2.5s forwards;
    `;
    
    toast.innerHTML = `<i class="fas ${type === 'success' ? 'fa-check-circle' : 'fa-exclamation-circle'}"></i> ${message}`;
    container.appendChild(toast);

    // Hapus otomatis setelah 3 detik
    setTimeout(() => { toast.remove(); }, 3000);
}

// Tambahkan Animasi ke Header melalui JS agar index.html tetap bersih
const toastStyle = document.createElement('style');
toastStyle.innerHTML = `
    @keyframes slideInToast {
        from { transform: translateX(100%); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
    }
    @keyframes fadeOutToast {
        to { opacity: 0; transform: translateY(-20px); }
    }
`;
document.head.appendChild(toastStyle);

// ==========================================
// 12. TENSES MODULE INTEGRATION
// ==========================================

/**
 * Memulai modul tenses dengan pengecekan akses
 */
function startTenses() {
    // 1. Cek apakah user punya nyawa dan belum mencapai limit harian
    if (!canPlayModule('tenses')) return;

    // 2. Jika fungsi startTensesModule ada di tenses_logic.js, jalankan
    if (typeof startTensesModule === 'function') {
        startTensesModule();
    } else {
        console.error("File tenses_logic.js belum dimuat atau fungsi startTensesModule tidak ditemukan.");
        alert("Modul Tenses sedang dalam perbaikan.");
    }
}

/**
 * Menangani pemberian XP khusus untuk pencapaian Tenses
 */
function awardTensesXP(bonus = 10) {
    // Update State Global
    userState.points += bonus;
    userState.stats.tenses.doneToday++;
    
    // Feedback suara & visual
    if (typeof playSuccessSound === 'function') playSuccessSound();
    
    // Simpan & Update UI
    saveUserData();
    updateUI();
    
    console.log(`Tenses Mastered! +${bonus} XP. Total hari ini: ${userState.stats.tenses.doneToday}`);
}

/**
 * Menyediakan daftar subjek untuk dropdown atau validasi jika diperlukan
 */
const TENSES_SUBJECT_RULES = {
    singular: ['he', 'she', 'it'],
    plural: ['i', 'you', 'we', 'they'],
    be_map: {
        'i': 'am',
        'he': 'is', 'she': 'is', 'it': 'is',
        'you': 'are', 'we': 'are', 'they': 'are'
    }
};

function closeGameOverlay() {
    const overlay = document.getElementById('game-overlay');
    if (overlay) {
        overlay.style.display = 'none';
        // Hentikan suara jika ada yang sedang bermain
        if (typeof stopAllAudio === 'function') stopAllAudio();
    }
}
// Pastikan bisa diakses secara global
window.closeGameOverlay = closeGameOverlay;

// ==========================================
// CONFIGURATION
// ==========================================
/**
 * Memeriksa apakah level tenses tertentu sudah terbuka.
 * Otomatis terbuka jika Mode Admin aktif.
 */
function isLevelUnlocked(level) {
    // 1. Jika Admin Mode aktif (via ketuk logo/keyboard), akses terbuka
    if (window.isAdminMode === true) return true; 

    // 2. Jika user Premium, semua level terbuka
    if (userState.isPremium) return true;
    
    // 3. Logika asli untuk siswa umum (berdasarkan progres)
    return userState.stats.tenses.unlockedLevel >= level;
}

// ==========================================
// GLOBAL ADMIN & DEMO TOOLS (main.js)
// ==========================================

// Variabel status admin global agar canPlayModule() langsung memberikan akses
window.isAdminMode = false; 

// A. KEYBOARD SHORTCUT (Untuk Laptop/Desktop)
window.addEventListener('keydown', function(e) {
    // Ctrl + Shift + U: Unlock All
    if (e.ctrlKey && e.shiftKey && e.key === 'U') {
        activateAdminMode();
    }
    // Ctrl + Shift + R: Reset All
    if (e.ctrlKey && e.shiftKey && e.key === 'R') {
        resetUserProgress();
    }
});

// B. TAP LOGO 10x (Untuk Mobile/HP di Play Store)
let logoTapCount = 0;
let lastTapTime = 0;

document.addEventListener('click', function(e) {
    // Cek apakah yang diklik adalah logo (ID: app-logo atau class: navbar-brand)
    if (e.target.id === 'app-logo' || e.target.classList.contains('navbar-brand')) {
        const currentTime = new Date().getTime();
        if (currentTime - lastTapTime > 500) logoTapCount = 0; // Reset jika jeda terlalu lama

        logoTapCount++;
        lastTapTime = currentTime;

        if (logoTapCount === 10) {
            activateAdminMode();
            logoTapCount = 0;
        }
    }
});

/**
 * FUNGSI AKTIVASI ADMIN
 */
function activateAdminMode() {
    if (confirm("🚀 Aktifkan Mode Admin?")) {
        window.isAdminMode = true; 
        
        // Memastikan bypass akses premium di seluruh aplikasi
        if (typeof userState !== 'undefined') {
            userState.isPremium = true; 

            if (userState.stats && userState.stats.tenses) {
                userState.stats.tenses.unlockedLevel = 5;
            }
            
            // Simpan perubahan ke penyimpanan lokal
            if (typeof saveUserData === 'function') saveUserData();
            
            // Perbarui tampilan poin, nyawa, dan level di layar
            if (typeof updateUI === 'function') updateUI();
        }
        
        // Notifikasi visual menggunakan fungsi toast Anda
        showToast("MODE ADMIN AKTIF: Akses Terbuka!", "success");
    }
}

/**
 * FUNGSI RESET DATA
 */
function resetUserProgress() {
    if (confirm("Reset seluruh progres ke awal?")) {
        window.isAdminMode = false;
        userState.stats.tenses.unlockedLevel = 1;
        userState.lives = 5;
        // Tambahkan reset modul lain di sini jika ada
        saveUserData();
        location.reload();
    }
}

function playFeedback(type) {
    // 1. Logika Pemutar Suara (Terpusat)
    const id = type === 'success' ? 'sound-success' : 'sound-error';
    const audio = document.getElementById(id);
    
    if (audio) {
        audio.currentTime = 0; // Reset agar suara bisa diputar berulang dengan cepat
        audio.play().catch(() => {
            // Memberikan peringatan di konsol jika browser memblokir auto-play
            console.warn("Interaksi user diperlukan untuk suara."); 
        });
    }

    // 2. Logika Notifikasi Visual (Toast)
    // Tetap dijalankan meskipun audio gagal diputar
    if (typeof showToast === 'function') {
        if (type === 'success') {
            showToast("Jawaban Benar!", "success");
        } else {
            showToast("Jawaban Salah! Periksa kembali.", "error");
        }
    }
}

function playErrorSound() {
    const audio = document.getElementById('sound-error');
    if (audio) {
        audio.currentTime = 0;
        audio.play().catch(e => console.warn("Audio play blocked: " + e.message));
    }
}

// ==========================================
// 13. STORY MODE INTEGRATION (CORE)
// ==========================================

/**
 * Pemicu utama Story Mode dari tombol Menu
 */
async function startStory() {
    console.log("Memulai pemeriksaan akses Story Mode...");

    // 1. Cek Akses (Admin / Premium / Limit Harian)
    // Otomatis menggunakan aturan di Blok 11
    if (!checkPremiumAccess('story')) return;

    // 2. Cek Nyawa (User gratis butuh minimal 1 nyawa)
    if (userState.lives <= 0 && !userState.isPremium && !window.isAdminMode) {
        showPremiumWall("Nyawa habis! Tonton iklan untuk lanjut membaca.");
        return;
    }

    // 3. Pastikan Bank Data Cerita sudah sinkron
    if (typeof syncStoryData === 'function') {
        await syncStoryData();
    }

    // 4. Jalankan Engine Story dari story_logic.js
    if (typeof startStoryMode === 'function') {
        startStoryMode();
        showToast(`Membaca Cerita Level ${userState.currentLevel}`, "success");
    } else {
        console.error("File story_logic.js belum termuat sempurna.");
        alert("Modul Cerita sedang dalam perbaikan.");
    }
}

/**
 * Jembatan Reward: Menghubungkan story_logic.js ke sistem poin pusat
 */
function processStoryReward(correctCount, totalQuestions) {
    const xpGained = correctCount * 20; 
    
    // Tambahkan XP ke total profil & statistik mingguan
    if (xpGained > 0) {
        addXP(xpGained);
    }

    // Update status harian agar limit bekerja
    userState.storyDoneToday = (userState.storyDoneToday || 0) + 1;
    userState.lastActiveDate = new Date().toDateString();

    // Konsekuensi: Jika jawaban benar di bawah 60% (3 soal), nyawa berkurang
    if (correctCount < 3 && !userState.isPremium && !window.isAdminMode) {
        if (userState.lives > 0) {
            userState.lives--;
            updateUI(); // Refresh tampilan hati
        }
    }

    saveUserData();
}

// ==========================================
// BLOK 14. SPEAKING MODULE LOGIC
// ==========================================

let currentSpeakingStep = 0;
let speakingQuizData = [];
let speakingAdWatchedInSession = 0; // Melacak iklan per sesi latihan

/**
 * Memulai modul speaking dengan pengecekan akses global
 */
function startSpeakingModule() {
    // 1. Cek Akses menggunakan fungsi dari main.js
    if (typeof canPlayModule === 'function' && !canPlayModule('speaking')) return;

    const currentLv = window.userState.currentLevel || 1;
    const dataVarName = `SPEAKING_DATA_LV${currentLv}`;
    const levelData = window[dataVarName];

    if (!levelData || levelData.length === 0) {
        showToast(`Data Speaking Level ${currentLv} belum dimuat.`, 'error');
        return;
    }

    // 2. Persiapan Data (5 soal acak)
    speakingQuizData = [...levelData]
        .sort(() => 0.5 - Math.random())
        .slice(0, 5);

    currentSpeakingStep = 0;
    speakingHearts = window.userState.isPremium ? 99 : 5;
    speakingAdWatchedInSession = 0;
    
    showSpeakingChallenge();
}

function showSpeakingChallenge() {
    const item = speakingQuizData[currentSpeakingStep];
    const targetText = item.expected.replace(/'/g, "\\'");

    let html = `
        <div class="game-header" style="display:flex; justify-content:space-between; align-items:center; margin-bottom:15px;">
            <div style="color: #ff4b4b; font-weight: bold; font-size: 1.2rem;">
                <i class="fas fa-heart"></i> ${window.userState.isPremium ? '∞' : speakingHearts}
            </div>
            <div style="color: #666; font-weight:bold;">Step ${currentSpeakingStep + 1}/5</div>
        </div>
        
        <div style="text-align:center;">
            <span style="background:var(--primary-blue); color:white; padding:4px 12px; border-radius:20px; font-size:0.7rem; text-transform:uppercase;">
                Theme: ${item.theme}
            </span>
            
            <div style="background: #f8f9fa; padding: 15px; border-radius: 15px; margin: 15px 0; border-left: 5px solid var(--primary-blue);">
                <p style="font-size: 0.8rem; color: #666; margin:0;">Question:</p>
                <h3 style="margin: 5px 0; color: #333; font-size: 1.2rem;">"${item.question}"</h3>
            </div>

            <p style="color: #999; font-size: 0.8rem;">Your Answer:</p>
            <h2 id="target-sentence" style="font-size: 1.6rem; margin: 10px 0 20px 0; color: var(--primary-blue); line-height:1.2;">
                "${item.expected}"
            </h2>
            
            <div style="display: flex; gap: 10px; justify-content: center; margin-bottom: 25px;">
                <button onclick="playVoice('${targetText}', 0.9)" class="word-chip" style="border:none; background:#e3f2fd;">
                    <i class="fas fa-volume-up"></i> Normal
                </button>
                <button onclick="playVoice('${targetText}', 0.5)" class="word-chip" style="border:none; background:#fff3e0; color:#ef6c00;">
                    <i class="fas fa-turtle"></i> Slow
                </button>
            </div>

            <div id="speaking-status" style="margin: 15px 0; font-weight: bold; min-height: 24px; color: #666; font-size:0.9rem;">
                Tap the mic to speak...
            </div>

            <button id="mic-trigger" onclick="recordUserVoice('${targetText}', '${item.keyword}')" 
                 style="width:85px; height:85px; background:var(--primary-blue); border-radius:50%; margin:0 auto; display:flex; align-items:center; justify-content:center; cursor:pointer; color:white; font-size:1.8rem; border:none; box-shadow: 0 6px 20px rgba(33, 150, 243, 0.3);">
                <i class="fas fa-microphone"></i>
            </button>
        </div>
    `;
    openGameOverlay(html, "SPEAKING CHALLENGE");
}

function recordUserVoice(correctText, keyword) {
    const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
    recognition.lang = 'en-US';
    const statusDiv = document.getElementById('speaking-status');
    const micBtn = document.getElementById('mic-trigger');

    recognition.onstart = () => {
        micBtn.style.background = "#ff4b4b";
        micBtn.style.transform = "scale(1.1)";
        statusDiv.innerText = "Listening... Speak now!";
    };

    recognition.onresult = (event) => {
        const result = event.results[0][0].transcript.toLowerCase().trim().replace(/[.,!?]/g, "");
        const target = correctText.toLowerCase().trim().replace(/[.,!?]/g, "");

        // 1. JAWABAN SEMPURNA
        if (result === target) {
            if (typeof playSuccessSound === 'function') playSuccessSound();
            statusDiv.innerHTML = "<span style='color: #2b8a3e;'>Excellent! Point +10 ✨</span>";
            
            setTimeout(() => {
                currentSpeakingStep++;
                if (currentSpeakingStep < speakingQuizData.length) {
                    showSpeakingChallenge();
                } else {
                    finishSpeakingModule();
                }
            }, 1500);
        } 
        // 2. JAWABAN PENDEK (Hanya kata kunci)
        else if (result.includes(keyword.toLowerCase()) && result.length < target.length) {
            statusDiv.innerHTML = `<span style='color: #f59f00;'>I heard "${result}", but use the FULL sentence!</span>`;
            playVoice("Please say the full sentence", 1.0);
            // Tidak kurangi nyawa
        } 
        // 3. SALAH
        else {
            if (typeof playErrorSound === 'function') playErrorSound();
            
            if (!window.userState.isPremium) {
                speakingHearts--;
            }
            
            statusDiv.innerHTML = `<span style='color: #c92a2a;'>You said: "${result}"</span>`;
            
            if (speakingHearts <= 0) {
                setTimeout(showSpeakingGameOver, 1000);
            } else {
                setTimeout(showSpeakingChallenge, 2000);
            }
        }
    };

    recognition.onend = () => {
        micBtn.style.background = "var(--primary-blue)";
        micBtn.style.transform = "scale(1)";
    };

    recognition.start();
}

function finishSpeakingModule() {
    const earnedXP = 50; 
    
    // Integrasi dengan addXP di main.js
    if (typeof addXP === 'function') {
        addXP(earnedXP);
    } else {
        window.userState.points += earnedXP;
        saveUserData();
    }

    // Update stats harian
    if (window.userState.stats.speaking) {
        window.userState.stats.speaking.doneToday++;
    }

    const user = window.userState;
    // Cek apakah butuh Exam (1000 XP) - Nilai 1000 diambil dari deskripsi Anda
    const isExamReady = user.points >= 1000 && !user.isPremium;

    let html = `
        <div style="text-align:center; padding: 20px;">
            <div style="font-size: 4rem; margin-bottom: 15px;">🏆</div>
            <h2 style="color: var(--primary-blue); margin:0;">Level ${user.currentLevel} Speaking Clear!</h2>
            
            <div style="background: #f0f7ff; border-radius: 15px; padding: 20px; margin: 20px 0;">
                <div style="font-size: 0.8rem; color: #666; text-transform: uppercase;">Total XP Collected</div>
                <div style="font-size: 2.5rem; font-weight: bold; color: var(--primary-blue);">${user.points}</div>
            </div>

            ${isExamReady ? `
                <div style="background: #fff3e0; padding: 15px; border-radius: 12px; border: 1px solid #ffb74d; margin-bottom: 20px;">
                    <h4 style="color: #e65100; margin:0;">🎓 GLOBAL EXAM UNLOCKED!</h4>
                    <p style="font-size: 0.8rem; margin: 5px 0;">You have reached 1000 XP. Take the exam to unlock Level ${user.currentLevel + 1}.</p>
                    <button class="btn-upgrade" onclick="startGlobalLevelExam()" style="background:#e65100; color:white; width:100%; border:none; padding:12px; border-radius:10px; font-weight:bold; margin-top:10px;">START FINAL EXAM</button>
                </div>
            ` : ''}

            <button class="btn-upgrade btn-premium" style="width:100%;" onclick="closeGame()">
                KEMBALI KE MENU
            </button>
        </div>
    `;
    
    openGameOverlay(html, "LESSON COMPLETE");
    saveUserData();
}

function showSpeakingGameOver() {
    let html = `
        <div style="text-align:center; padding:10px;">
            <div style="font-size: 4rem; margin-bottom: 15px;">💔</div>
            <h2 style="margin:0;">Nyawa Habis!</h2>
            <p style="color: #666; margin: 10px 0 20px 0;">Jangan menyerah! Latihan membuat pelafalanmu sempurna.</p>
            
            ${speakingAdWatchedInSession < 1 ? `
                <button class="btn-upgrade btn-ad" onclick="watchAdForSpeakingExtra()" style="width:100%; background:#4CAF50; color:white; border:none; padding:15px; border-radius:12px; margin-bottom:10px; font-weight:bold;">
                    <i class="fas fa-video"></i> NONTON IKLAN (+3 ❤️)
                </button>
            ` : ''}

            <button class="btn-upgrade btn-premium" style="width:100%; background:#FFD700; color:#333; border:none; padding:15px; border-radius:12px; font-weight:bold;" onclick="closeGame(); showPremiumWall('Gunakan Premium untuk nyawa tak terbatas!');">
                <i class="fas fa-crown"></i> AKTIFKAN PREMIUM
            </button>
            
            <button onclick="closeGame()" style="width:100%; background:none; border:none; color:#999; margin-top:15px; cursor:pointer;">
                Nanti Saja
            </button>
        </div>
    `;
    openGameOverlay(html, "GAME OVER");
}

function watchAdForSpeakingExtra() {
    showToast("Memutar iklan...", "info");
    setTimeout(() => {
        speakingHearts = 3;
        speakingAdWatchedInSession++; // Batasi agar tidak spam iklan di satu sesi
        showSpeakingChallenge();
        showToast("3 Nyawa ditambahkan!", "success");
    }, 2000);
}

// ==========================================
// BLOK 15: INDOGLISH SYSTEM INTEGRATION
// ==========================================

// Tambahkan ke dalam loadUserData atau inisialisasi awal userState
if (!userState.stats.indoglish) {
    userState.stats.indoglish = { doneToday: 0, dailyLimit: 5 };
}

/**
 * Fungsi pemicu untuk membuka modul Indoglish
 */
window.startIndoglishModule = function() {
    // 1. Cek Akses (Nyawa & Limit) via fungsi yang sudah ada di main.js
    if (!canPlayModule('indoglish')) return;

    // 2. Jika lolos, panggil fungsi start dari logic file
    if (typeof startIndoglishBuster === 'function') {
        startIndoglishBuster();
    } else {
        console.error("indoglish_logic.js belum dimuat!");
        showToast("Modul sedang disiapkan...", "error");
    }
};