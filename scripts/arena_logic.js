// scripts/arena_logic.js

// ====================================================================
// --- A. IMPORT LOGIC DAN DATA ---
// ====================================================================

// Import data yang dibutuhkan. Hapus ALL_EXERCISES dari sini karena akan dideklarasikan di bawah.
import { 
    ARENA_EXERCISES, 
    GAMIFICATION_CONFIG, 
    LESSON_PATH, 
    MAX_AD_LIVES_RESTORE // Pastikan konstanta ini ada di data.js
} from './data.js'; 

// Import data Idiom dan Sentence Builder dari file terpisah
import { IDIOM_LIST } from './idiom_data.js'; 
import { SENTENCE_BUILDER_EXERCISES } from './sb_data.js'; 

// Gabungkan semua data latihan menjadi satu array global untuk memudahkan filtering.
// (Ini adalah BARIS 19 yang benar)
const ALL_EXERCISES = ARENA_EXERCISES
    .concat(SENTENCE_BUILDER_EXERCISES)
    .concat(IDIOM_LIST.map(e => ({ 
        ...e, 
        type: 'IDIOM', 
        gratis: true  
    }))); 

// --- STATE ARENA ---
let currentSentenceData = {};

// --- Variabel Global & State Dictation/Heart System ---
// Jika Heart System Dictation dan SB terpisah:
let dictationLives = 5;
let dictationAdsUsedToday = 0; 
let dictationProgress = { completed: 0, total: 10 }; 

// --- Variabel Global & State Sentence Builder (SB) ---
// (Digantikan oleh logic di getSBChallengeStatus() di bawah)

// Menggunakan index terpisah untuk setiap tipe soal (Gabungkan duplikasi exerciseIndices)
let exerciseIndices = {
    'DICTATION': -1,
    'PRONUNCIATION': -1,
    'SENTENCE_BUILDER': -1,
    'TRANSLATION': -1, 
    'IDIOM': -1
};

// --- Konstanta XP & Reward ---
const XP_REWARD_QUIZ = 10; 
const XP_REWARD_IDIOM_CHECKIN = 5; 
const XP_MIN_ACCURACY = 80;

// ====================================================================
// --- B. HELPER FUNCTIONS ---
// ====================================================================

/**
 * Helper: Normalisasi Teks
 */
function normalizeText(text) {
    if (!text) return "";
    return text.trim().replace(/[.,!?"-]/g, '').replace(/\s+/g, ' ').toLowerCase(); 
}

/**
 * Helper: Hitung Akurasi (Logika Levenshtein Distance)
 */
function calculateAccuracy(s1, s2) {
    if (s1 === s2) return 100;
    const len1 = s1.length;
    const len2 = s2.length;
    const matrix = [];
    for (let i = 0; i <= len1; i++) {
        matrix[i] = [i];
    }
    for (let j = 1; j <= len2; j++) {
        matrix[0][j] = j;
    }
    for (let i = 1; i <= len1; i++) {
        for (let j = 1; j <= len2; j++) {
            const cost = (s1[i - 1] === s2[j - 1]) ? 0 : 1;
            matrix[i][j] = Math.min(
                matrix[i - 1][j] + 1, 
                matrix[i][j - 1] + 1, 
                matrix[i - 1][j - 1] + cost 
            );
        }
    }
    const distance = matrix[len1][len2];
    const maxLen = Math.max(len1, len2);
    return Math.round(Math.max(0, (1 - (distance / Math.max(1, maxLen))) * 100));
}

/**
 * Helper: Mengecek apakah hari baru telah dimulai
 */
function isNewDay() {
    const today = new Date().toDateString(); 
    const lastAccessDay = localStorage.getItem('lastDailyIdiomDay');
    
    return lastAccessDay !== today; 
}


// --- LOGIKA IDIOM HARIAN (CHECK-IN & STREAK) ---

/**
 * Memastikan ID Idiom Harian sudah diatur untuk hari ini (Siklus Gratis).
 */
function getOrCreateDailyIdiom() {
    const type = 'IDIOM';
    const allFreeIdioms = ALL_EXERCISES.filter(e => e.type === type && e.gratis);
    
    if (allFreeIdioms.length === 0) return null;

    const currentIdiomId = localStorage.getItem('currentDailyIdiomId');
    let targetIdiom;

    if (isNewDay()) {
        let currentIndex = -1;
        if (currentIdiomId) {
            currentIndex = allFreeIdioms.findIndex(e => e.id === currentIdiomId);
        }
        
        let nextIndex = (currentIndex + 1) % allFreeIdioms.length;
        targetIdiom = allFreeIdioms[nextIndex];

        // Simpan Idiom baru dan tandai hari ini
        localStorage.setItem('currentDailyIdiomId', targetIdiom.id);
        localStorage.setItem('lastDailyIdiomDay', new Date().toDateString()); // MASTER KEY
        localStorage.removeItem('hasViewedDailyIdiom'); // Reset status dilihat
        
        return targetIdiom;
    } else {
        // Masih hari yang sama: Ambil Idiom yang tersimpan
        return allFreeIdioms.find(e => e.id === currentIdiomId) || allFreeIdioms[0];
    }
}

/**
 * Memberikan reward XP dan mengelola Streak Harian untuk Idiom Harian.
 */
function manageDailyIdiomReward() {
    // PASTIKAN window.addPoints sudah didefinisikan di main.js
    window.addPoints('BINTANG_ILMU', XP_REWARD_IDIOM_CHECKIN); 

    // 2. Kelola Streak 
    const lastStreakDay = localStorage.getItem('lastDailyIdiomDay'); 
    const today = new Date().toDateString();
    let currentStreak = parseInt(localStorage.getItem('currentStreak')) || 0;

    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);

    // Cek apakah hari terakhir akses adalah kemarin
    if (lastStreakDay === yesterday.toDateString()) {
        currentStreak += 1; // Lanjut streak
    } else if (lastStreakDay !== today) { // Jika tidak sama dengan hari ini atau kemarin
        currentStreak = 1; // Mulai streak baru (jika hari ini baru pertama kali diakses)
    }

    // 3. Cek Bonus (Hari ke-7) 
    if (currentStreak % 7 === 0 && currentStreak !== 0) {
        const BONUS_XP = 25;
        window.addPoints('BINTANG_ILMU', BONUS_XP);
        console.log(`🏆 Bonus Streak 7 Hari (+${BONUS_XP} XP)!`);
    }

    // 4. Simpan status Streak
    localStorage.setItem('currentStreak', currentStreak);
}


// --- LOGIKA SENTENCE BUILDER HARIAN (KUOTA 5 SOAL & NYAWA) ---

/**
 * Mengelola status Tantangan Harian untuk Sentence Builder (SB).
 */
function getSBChallengeStatus() {
    const today = new Date().toDateString();
    
    // Inisialisasi status hari ini jika hari baru
    if (localStorage.getItem('lastSBChallengeDay') !== today) {
        localStorage.setItem('lastSBChallengeDay', today);
        localStorage.setItem('sbLives', 5);      // Nyawa Awal = 5 (Toleransi Kesalahan)
        localStorage.setItem('sbSolvedCount', 0);    // Jumlah Soal SB yang diselesaikan hari ini
        localStorage.setItem('sbAdsUsedToday', 0); // Reset iklan harian
    }
    
    return {
        lives: parseInt(localStorage.getItem('sbLives')) || 5, // Default 5 jika belum ada
        solvedCount: parseInt(localStorage.getItem('sbSolvedCount')) || 0,
        adsUsed: parseInt(localStorage.getItem('sbAdsUsedToday')) || 0,
        adsAvailable: MAX_AD_LIVES_RESTORE - (parseInt(localStorage.getItem('sbAdsUsedToday')) || 0),
        // Batas total 5 soal. isMaxedOut di sini berarti sudah mengerjakan 5 soal.
        isMaxedOut: (parseInt(localStorage.getItem('sbSolvedCount')) || 0) >= 5 
    };
}

/**
 * Kurangi Nyawa saat pengguna SALAH menjawab.
 */
function decreaseSBLiveOnMistake() {
    let lives = parseInt(localStorage.getItem('sbLives')) || 5; // Default 5
    if (lives > 0) {
        lives -= 1;
        localStorage.setItem('sbLives', lives);
    }
    return lives;
}

/**
 * Tambah Nyawa SB dengan menonton iklan
 */
function restoreSBLivesByAd(amount) {
    let adsUsed = parseInt(localStorage.getItem('sbAdsUsedToday')) || 0;
    let lives = parseInt(localStorage.getItem('sbLives')) || 5;
    
    if (adsUsed < MAX_AD_LIVES_RESTORE) {
        lives = Math.min(5, lives + amount); // Tambah maksimal 3 nyawa, max total 5
        adsUsed += 1;
        
        localStorage.setItem('sbLives', lives);
        localStorage.setItem('sbAdsUsedToday', adsUsed);
    }
    return lives;
}

/**
 * Tambah hitungan soal yang diselesaikan hari ini (max 5)
 */
function increaseSBSolvedCount() {
    let solvedCount = parseInt(localStorage.getItem('sbSolvedCount')) || 0;
    solvedCount += 1;
    localStorage.setItem('sbSolvedCount', solvedCount);
    return solvedCount;
}

/**
 * Memastikan ID Sentence Builder Harian sudah diatur untuk hari ini (Siklus Gratis).
 */
function getOrCreateDailySentenceBuilder() {
    const type = 'SENTENCE_BUILDER';
    const allFreeSB = ALL_EXERCISES.filter(e => e.type === type && e.gratis);
    
    if (allFreeSB.length === 0) return null;

    // Karena logikanya "tiap hari ganti soal", kita akan reset index setiap hari
    if (isNewDay()) {
        exerciseIndices[type] = -1; // Reset index ke -1 untuk memastikan soal pertama muncul
        localStorage.setItem('lastSBChallengeDay', new Date().toDateString()); // Reset status SB
    }
    
    // Ambil soal berikutnya
    exerciseIndices[type] = (exerciseIndices[type] + 1) % allFreeSB.length;
    return allFreeSB[exerciseIndices[type]];
}

// ====================================================================
// --- FUNGSI HEART SYSTEM (Contoh Placeholder) ---
// ====================================================================

function getDictationChallengeStatus() {
    // Fungsi Placeholder
    return {
        lives: dictationLives,
        adsUsed: adsUsedToday,
        adsAvailable: MAX_AD_LIVES_RESTORE - adsUsedToday,
        progress: dictationProgress,
        isNewDay: true, // Placeholder
    };
}

/**
 * Mengurangi nyawa Dictation (Dictation Live) saat terjadi kesalahan.
 * Jika nyawa mencapai nol, mode dictation dihentikan.
 * @returns {number} Sisa nyawa saat ini.
 */
export function decreaseDictationLiveOnMistake() {
    // ASUMSI: Anda mengimpor MAX_DICTATION_LIVES dari data.js
    let currentLives = parseInt(localStorage.getItem('dictationCurrentLives')) || MAX_DICTATION_LIVES;

    if (currentLives > 0) {
        currentLives -= 1;
        localStorage.setItem('dictationCurrentLives', currentLives);
    }

    // PENTING: Anda harus memastikan ada fungsi yang memperbarui tampilan nyawa di UI (biasanya di main.js)
    // Contoh: window.updateDictationLivesUI(currentLives);

    return currentLives;
}

export function restoreDictationLivesByAd() {
    let adsUsed = parseInt(localStorage.getItem('dictationAdsUsedToday')) || 0;
    
    // Cek apakah kuota iklan masih ada
    if (adsUsed < MAX_AD_LIVES_RESTORE) {
        // Reset nyawa penuh
        localStorage.setItem('dictationCurrentLives', MAX_DICTATION_LIVES);
        // Tambah kuota iklan yang sudah terpakai hari ini
        adsUsed += 1;
        localStorage.setItem('dictationAdsUsedToday', adsUsed);
        return true; // Berhasil
    }
    return false; // Gagal (kuota iklan habis)
}

// ====================================================================
// --- FUNGSI UTAMA PENGAMBIL SOAL (NEXT EXERCISE) ---
// ====================================================================

/**
 * Mengambil soal latihan berikutnya berdasarkan tipe, 
 * termasuk logika pengecekan Nyawa/Premium untuk Dictation.
 * * @param {string} type - Tipe latihan (DICTATION, SENTENCE_BUILDER, IDIOM, dll.)
 * @param {string|null} contextId - Tidak digunakan di sini, tapi dipertahankan untuk kompatibilitas.
 * @returns {object|null} Objek soal atau objek state khusus (PAYWALL/AD_PROMPT).
 */
function getNextExercise(type, contextId = null) {
    // --- 1. LOGIKA DICTATION (Memerlukan Pengecekan Nyawa) ---
    if (type === 'DICTATION') {
        const status = getDictationChallengeStatus();
        
        // Cek Nyawa: Nyawa Habis dan Iklan Habis
        if (status.lives <= 0 && status.adsUsed >= MAX_AD_LIVES_RESTORE) {
            return { type: 'PAYWALL', context: 'DICTATION' }; 
        }
        
        // Cek Nyawa: Nyawa Habis tapi Iklan Masih Tersedia
        if (status.lives <= 0 && status.adsUsed < MAX_AD_LIVES_RESTORE) {
            return { type: 'AD_PROMPT', context: 'DICTATION' }; 
        }
        
        // Jika nyawa OK, ambil soal Dictation (dari fungsi khusus Dictation)
        return getDictationExercise(); 
    }
    
    // --- 2. LOGIKA SENTENCE BUILDER (Pengecekan Nyawa & Kuota Harian) ---
    if (type === 'SENTENCE_BUILDER') {
        const status = getSBChallengeStatus();
        
        // Cek Kuota/Nyawa: Sudah Maxed Out (5 soal) atau Nyawa Habis dan Iklan Habis
        if (status.isMaxedOut || (status.lives <= 0 && status.adsUsed >= MAX_AD_LIVES_RESTORE)) {
            return { type: 'PAYWALL', context: 'SENTENCE_BUILDER' }; 
        }
        
        // Cek Nyawa: Nyawa Habis tapi Iklan Masih Tersedia
        if (status.lives <= 0 && status.adsUsed < MAX_AD_LIVES_RESTORE) {
            return { type: 'AD_PROMPT', context: 'SENTENCE_BUILDER' }; 
        }

        // Jika nyawa OK dan belum maxed out, ambil soal SB berikutnya
        return getOrCreateDailySentenceBuilder();
    }
    
    // --- 3. LOGIKA IDIOM, PRONUNCIATION, TRANSLATION, dll. (Rotasi Sederhana) ---
    
    const isDemoType = type === 'SENTENCE_BUILDER_DEMO' || type === 'IDIOM_DEMO';
    const actualType = isDemoType ? type.replace('_DEMO', '') : type;
    
    // Filter soal berdasarkan tipe dari ALL_EXERCISES
    let exercises = ALL_EXERCISES.filter(e => e.type === actualType);
    
    // Filter soal gratis jika dalam Demo Mode atau tipe harian (Kuota)
    if (isDemoType || ['IDIOM', 'SENTENCE_BUILDER'].includes(actualType)) {
        // ASUMSI: userIsPremium() diakses dari window/main.js
        if (!window.userIsPremium) {
            exercises = exercises.filter(e => e.gratis);
        }
    }

    if (exercises.length === 0) return null;
    
    // Reset Index jika belum ada atau hari baru untuk IDIOM
    if (exerciseIndices[actualType] === undefined || (isNewDay() && actualType === 'IDIOM')) {
        exerciseIndices[actualType] = -1; // Reset index untuk hari baru
    }

    // Naikkan index dan wrap around (modulo)
    exerciseIndices[actualType] = (exerciseIndices[actualType] + 1) % exercises.length;

    let nextExercise = exercises[exerciseIndices[actualType]];
    
    return nextExercise;
}

/**
 * Helper: Render Paywall
 */
function createPremiumWall(type) {
    const typeLabel = type === 'IDIOM' ? 'Idiom Harian' : 'Susun Kalimat';
    return `
        <div class="premium-wall-card">
            <h3>🔒 Modul ${typeLabel} Terkunci</h3>
            <p>Anda telah mencapai batas soal gratis di modul ${typeLabel} hari ini (5 Soal) atau nyawa Anda telah habis.</p>
            <p>Buka Premium untuk akses tak terbatas ke 1000+ soal dan fitur lainnya!</p>
            <button class="primary-btn" onclick="window.navigateToSubscription()">Buka Akses Premium Sekarang</button>
            <button class="secondary-btn" onclick="window.loadView('home')">Kembali ke Beranda</button>
        </div>
    `;
}

// --- LOGIKA DRAG & DROP UNTUK SENTENCE BUILDER ---

function allowDrop(ev) {
    ev.preventDefault();
}

function drag(ev) {
    const data = ev.dataTransfer.setData("text", ev.target.id);
    const draggedElement = ev.target;
    // Pengecekan ketat untuk menghindari error pada elemen non-token
    if (draggedElement && draggedElement.id && draggedElement.classList.contains('word-token')) { 
        ev.dataTransfer.setData("text", draggedElement.id);
        draggedElement.classList.add('dragging');
    }
}

function drop(ev) {
    ev.preventDefault();
    const data = ev.dataTransfer.getData("text");
    const draggedElement = document.getElementById(data); 

    // Pengecekan Null pada draggedElement
    if (!draggedElement) return;
    
    // Pengecekan Null pada classList (Solusi Error Null)
    if (!draggedElement.classList) return;
    
    draggedElement.classList.remove('dragging');

    // Cek apakah target drop adalah area kalimat atau token yang sudah ditempatkan
    if (ev.target.id === 'sentence-area' || ev.target.classList.contains('word-token-placed')) {
        
        // 1. Tentukan target yang tepat untuk penempatan
        const dropTarget = ev.target.classList.contains('word-token-placed') ? ev.target.parentNode : ev.target;
        dropTarget.appendChild(draggedElement);
        
        // 2. Update Class dan Atribut (Menjadi token yang sudah diletakkan)
        draggedElement.classList.remove('word-token');
        draggedElement.classList.add('word-token-placed');
        
        // 3. Pasang onclick untuk mengembalikan token
        draggedElement.setAttribute('onclick', 'window.removeToken(this)'); 
        draggedElement.removeAttribute('draggable'); // Hapus draggable jika sudah diletakkan
        
    } else if (ev.target.id === 'word-pool') {
        
        // 1. Drop kembali ke pool
        ev.target.appendChild(draggedElement);
        
        // 2. Update Class dan Atribut (Menjadi token yang ada di pool)
        draggedElement.classList.add('word-token');
        draggedElement.classList.remove('word-token-placed');
        
        // 3. Hapus onclick dan kembalikan draggable
        draggedElement.removeAttribute('onclick'); 
        draggedElement.setAttribute('draggable', 'true');
    }
}

function removeToken(tokenElement) {
    const wordPool = document.getElementById('word-pool');
    if (wordPool) {
        // Pindahkan elemen kembali ke pool
        wordPool.appendChild(tokenElement);
        
        // Update Class dan Atribut
        tokenElement.classList.add('word-token');
        tokenElement.classList.remove('word-token-placed');
        tokenElement.removeAttribute('onclick'); // Hapus handler klik
        tokenElement.setAttribute('draggable', 'true'); // Kembalikan kemampuan drag
    }
}

// ====================================================================
// --- C. TEXT-TO-SPEECH (TTS) / SUARA (Tidak berubah) ---
// ====================================================================
function speakText(text) { 
    if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel(); 
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = 'en-US'; 
        window.speechSynthesis.speak(utterance);
    } else {
        console.warn("Browser tidak mendukung Text-to-Speech.");
    }
}

// ====================================================================
// --- D. UNIVERSAL RENDERER & ROUTING ---
// ====================================================================

function loadArenaExercise(type, containerId = 'app-content', isDemoMode = false, levelId = null) { 
    const container = document.getElementById(containerId);
    if (!container) return;
    
    // Khusus untuk Level Path: Muat tampilan daftar level
    if (type === 'LESSON_LEVELS') {
        renderLessonCards(containerId);
        return;
    }
    
    // Khusus untuk Modul Level: Muat tampilan daftar modul di level tertentu
    if (type === 'LESSON_MODULES' && levelId) {
        renderLevelModulesView(containerId, levelId); 
        return;
    }

    // Tampilan standar: Back button dan arena-main-content
    if (containerId === 'app-content' && !isDemoMode) {
        container.innerHTML = '';
        container.innerHTML = `<button class="secondary-btn back-button" onclick="window.loadView('home')">← Kembali ke Beranda</button>
                               <div id="arena-main-content"></div>`;
    }
    
    const arenaContentDiv = document.getElementById('arena-main-content') || container; 
    
    const demoTypeMap = {
        'SENTENCE_BUILDER': 'SENTENCE_BUILDER_DEMO',
        'IDIOM': 'IDIOM_DEMO'
    };
    const actualType = isDemoMode && demoTypeMap[type] ? demoTypeMap[type] : type;
    
    const sbStatus = getSBChallengeStatus(); 

    if (type === 'IDIOM' && isDemoMode) {
        currentSentenceData = getOrCreateDailyIdiom();
    } else if (type === 'SENTENCE_BUILDER' && isDemoMode) { 
        
        if (sbStatus.isMaxedOut || sbStatus.lives <= 0) {
            arenaContentDiv.innerHTML = createPremiumWall(type); 
            return;
        }

        currentSentenceData = getNextExercise(actualType); 
        
    } else {
        // Untuk Premium atau modul non-harian (Dictation, Pronunciation, Translation)
        currentSentenceData = getNextExercise(actualType);
    }
    
    if (!currentSentenceData) {
        if (['IDIOM', 'SENTENCE_BUILDER'].includes(type) && !window.userIsPremium) {
             arenaContentDiv.innerHTML = createPremiumWall(type);
             return;
        }
        arenaContentDiv.innerHTML = "<p>Semua soal di modul ini telah selesai. Mohon tunggu update!</p>";
        return;
    }

    // --- Render sesuai Tipe ---
    switch (type) {
        case 'IDIOM': 
            renderIdiomView(arenaContentDiv, isDemoMode); 
            break;
        case 'DICTATION':
            renderDictationView(arenaContentDiv);
            break;
        case 'PRONUNCIATION':
            renderPronunciationView(arenaContentDiv);
            break;
        case 'SENTENCE_BUILDER': 
            renderSentenceBuilderView(arenaContentDiv, isDemoMode);
            break;
        case 'TRANSLATION': 
            renderTranslationView(arenaContentDiv);
            break;
        default:
            arenaContentDiv.innerHTML = `<p>Tipe latihan ${type} tidak dikenal.</p>`;
    }
}

// ====================================================================
// --- E. VIEW RENDERER SPESIFIK & CHECKERS ---
// ====================================================================

// --- LESSON PATH (Kartu Level) VIEW ---

function renderLessonCards(containerId) {
    const container = document.getElementById(containerId);
    if (!container) {
        console.error("Container ID untuk kartu level tidak ditemukan.");
        return;
    }

    // --- PERBAIKAN FATAL: LESSON_LEVELS DIGANTI MENJADI LESSON_PATH ---
    if (!LESSON_PATH || LESSON_PATH.length === 0) { 
        container.innerHTML = '<p>Data Kurikulum Level belum dimuat atau kosong.</p>';
        return;
    }
    
    // Asumsi: Fungsi global ini ada di main.js dan mengembalikan XP pengguna.
    const userXp = window.getUserXp ? window.getUserXp() : 0;
    const userIsPremium = window.userIsPremium || false;

    let html = `
        <h2 class="welcome-heading">Peta Kurikulum Bahasa Inggris</h2>
        <p class="text-center">Pilih level untuk melihat modul pelajaran.</p>
        <div class="lesson-path-container" id="lesson-list">
    `;
    
    // --- REVISI LOGIKA LOCKING KARTU LEVEL ---
    LESSON_PATH.forEach(level => {
        // Logika lock: Terkunci jika userXP kurang dari requiredXp ATAU level adalah premium dan user tidak premium.
        const isLocked = userXp < level.requiredXp || (level.premium && !userIsPremium); 
        
        // --- INI ADALAH const onclickHandler YANG ANDA CARI! ---
        const onclickHandler = isLocked 
            ? `alert("Level ini terkunci! ${level.premium ? 'Akses Premium diperlukan.' : `Selesaikan Level sebelumnya (Butuh XP: ${level.requiredXp}).`}")`
            : `window.loadLevelModules('${level.id}')`; 
        
        // HANYA NAMA LEVEL
        const levelTitle = level.name; 
        
        // Ikon Premium
        const premiumIcon = level.premium 
            ? '<i class="fas fa-gem" style="color: var(--color-secondary); margin-left: 5px;"></i>' 
            : '';
            
        // Ikon Level (Menggunakan level.icon yang sudah ada di data.js)
        let iconHtml = level.icon ? `<i class="fas ${level.icon}"></i>` : '<i class="fas fa-book"></i>';
        
        html += `
            <div class="lesson-card ${isLocked ? 'locked' : ''}" onclick="${onclickHandler}">
                <div class="lesson-icon">
                    ${iconHtml}
                </div>
                <div class="lesson-details">
                    <h4>${levelTitle} ${premiumIcon}</h4>
                    <p>${level.desc || 'Deskripsi tidak tersedia.'}</p> 
                </div>
                <div class="lock-indicator">
                    ${isLocked ? '<i class="fas fa-lock"></i>' : '<i class="fas fa-chevron-right"></i>'}
                </div>
            </div>
        `;
    });

    html += `</div>`;
    container.innerHTML = html;
}

// --- LEVEL MODULES VIEW --- (Tampilan setelah Level diklik)

function renderLevelModulesView(containerId, levelId) {
    const container = document.getElementById(containerId);
    if (!container) return;

    // Cari detail level
    const level = LESSON_PATH.find(l => l.id === levelId);
    
    // --- REVISI FATAL: LESSON_MODULES sudah dihapus. Ambil modul dari level.modules di LESSON_PATH ---
    const modules = level ? level.modules : []; 
    // const modules = LESSON_MODULES.filter(m => m.level === levelId); // <-- BARIS LAMA, DIHAPUS

    if (!level || modules.length === 0) {
        container.innerHTML = `
            <button class="secondary-btn back-button" onclick="window.loadArenaExercise('LESSON_LEVELS', '${containerId}')">← Kembali ke Level</button>
            <p>Tidak ada modul yang ditemukan untuk level ini (${levelId}).</p>
        `;
        return;
    }
    
    let modulesHtml = '';
    modules.forEach(module => {
        // Menggunakan properti 'lock' dari LESSON_PATH
        const isModuleLocked = module.lock; 
        const moduleClass = isModuleLocked ? 'module-card locked' : 'module-card';
        
        // Asumsi: loadModuleContent akan memuat halaman latihan sebenarnya
        const action = isModuleLocked 
            ? 'alert("Modul ini terkunci. Selesaikan modul sebelumnya!")'
            : `window.loadModuleContent('${module.id}')`; 

        modulesHtml += `
            <div class="${moduleClass}">
                <div class="module-header">
                    <h4>${module.name}</h4>
                    <small>Latihan: ${module.content ? module.content.join(', ') : 'Belum diatur'}</small>
                </div>
                <button class="primary-btn module-start-btn" onclick="${action}" ${isModuleLocked ? 'disabled' : ''}>
                    ${isModuleLocked ? '<i class="fas fa-lock"></i> Terkunci' : 'Mulai Sekarang'}
                </button>
            </div>
        `;
    });

    const html = `
        <button class="secondary-btn back-button" onclick="window.loadArenaExercise('LESSON_LEVELS', '${containerId}')">← Kembali ke Peta Level</button>
        <div class="section-card">
            <h2 style="border-left-color: var(--color-info);">${level.name}</h2>
            <p>${level.desc || 'Deskripsi tidak tersedia.'}</p>
            <div class="module-list">
                ${modulesHtml}
            </div>
        </div>
    `;
    container.innerHTML = html;
}

/**
 * Memuat tampilan Modul Level spesifik (Dipanggil dari onclick kartu Level).
 * FUNGSI INI HARUS ADA KARENA DIPANGGIL DARI HTML DI renderLessonCards.
 */
function loadLevelModules(levelId) {
    // Fungsi ini hanya memanggil router utama, loadArenaExercise,
    // dengan tipe 'LESSON_MODULES' dan levelId yang relevan.
    loadArenaExercise('LESSON_MODULES', 'app-content', false, levelId);
}

// --- IDIOM VIEW & CHECKERS (Tidak berubah) ---

function renderIdiomCard() {
    const type = 'IDIOM';
    const exercise = getOrCreateDailyIdiom(); 
    
    if (!exercise) {
        return `
            <div class="idiom-card home-card-mini locked" style="margin-top: 15px;">
                <i class="fas fa-lock"></i>
                <h4>Idiom Harian (Terkunci)</h4>
                <p>Tidak ada idiom gratis saat ini.</p>
                <button class="primary-btn btn-idiom-white" onclick="window.loadView('premium')">Buka Premium</button>
            </div>
        `;
    }

    const target = exercise.target;
    const meaning = exercise.meaning;
    const hasViewed = localStorage.getItem('hasViewedDailyIdiom') === 'true';

    const action = `window.loadArenaExercise('${type}', 'app-content', ${!window.userIsPremium})`;
    
    const icon = hasViewed ? 'fas fa-check-circle text-success' : 'fas fa-lightbulb';
    const statusText = hasViewed && !window.userIsPremium ? '✅ Sudah Dilihat' : '⏳ Belum Dilihat';
    const cardTitle = window.userIsPremium ? 'Idiom Premium' : `Idiom Harian (${statusText})`;
    
    return `
        <div class="idiom-card home-card-mini ${hasViewed ? 'completed' : ''}" onclick="${action}">
            <i class="${icon}"></i>
            <div class="card-details">
                <h4>${cardTitle}</h4>
                <p><strong>"${target}"</strong></p>
                <small>${meaning.substring(0, 50)}...</small>
            </div>
            <i class="fas fa-chevron-right"></i>
        </div>
    `;
}

function renderIdiomView(container, isDemo = false) { 
    const isPremiumMode = !isDemo && window.userIsPremium;
    
    if (isDemo && localStorage.getItem('hasViewedDailyIdiom') !== 'true') {
        manageDailyIdiomReward(); 
        localStorage.setItem('hasViewedDailyIdiom', 'true'); // Tandai telah dilihat
    }
    
    const target = currentSentenceData.target;
    const meaning = currentSentenceData.meaning;
    
    let mainButtonHTML;
    let title;

    if (isPremiumMode) {
        title = 'Idiom Akses Premium';
        mainButtonHTML = `
            <button class="primary-btn btn-idiom-white mt-3" onclick="window.loadArenaExercise('IDIOM', 'app-content', false)">
                Idiom Premium Berikutnya →
            </button>
        `;
    } else {
        title = 'Idiom Harian (Gratis)';
        mainButtonHTML = `
            <div class="premium-wall-card small-wall mt-3">
                <p>Anda telah melihat Idiom Harian hari ini. Kembali besok untuk yang baru!</p>
                <button class="primary-btn" onclick="window.navigateToSubscription()">Buka Akses Premium (Tak Terbatas)</button>
            </div>
            <button class="secondary-btn" onclick="window.loadView('home')">
                ← Kembali ke Beranda
            </button>
        `;
    }

    const html = `
        <div class="section-card idiom-card">
            <h3>📖 ${title}</h3>
            <p>Pahami Idiom Bahasa Inggris ini untuk meningkatkan pemahaman kontekstual Anda.</p>
            
            <div class="idiom-target">
                <h4>"${target}"</h4>
            </div>
            
            <p class="meaning-label">Artinya adalah:</p>
            <div class="idiom-meaning">
                ${meaning}
            </div>
            
            ${mainButtonHTML}
        </div>
    `;
    container.innerHTML = html;
}

// --- SENTENCE BUILDER VIEW & CHECKERS (Tidak berubah) ---

function renderSentenceBuilderCard() {
    const type = 'SENTENCE_BUILDER';
    const status = getSBChallengeStatus();
    const exercise = getOrCreateDailySentenceBuilder();
    
    if (!exercise) {
        return `
            <div class="idiom-card home-card-mini locked" style="margin-top: 15px;">
                <i class="fas fa-lock"></i>
                <h4>Susun Kalimat Harian (Terkunci)</h4>
                <p>Tidak ada latihan kalimat gratis saat ini.</p>
                <button class="primary-btn btn-idiom-white" onclick="window.loadView('premium')">Buka Premium</button>
            </div>
        `;
    }

    const target = exercise.target;
    // Menggunakan regex yang lebih baik untuk memisahkan kata dan tanda baca
    const words = target.match(/[\w']+|[.,!?"-]/g); 
    const hint = words.slice(0, 3).join(' ') + '...';
    
    const isPremiumMode = window.userIsPremium;
    // Terkunci jika Kuota Habis (5/5) ATAU Nyawa Habis (<= 0)
    const isLocked = !isPremiumMode && (status.isMaxedOut || status.lives <= 0); 
    
    let action = '';
    let statusText = ''; // Variabel ini seharusnya tidak terduplikasi
    
    // PERBAIKAN: Hapus baris duplikat yang menyebabkan SINTAKS ERROR
    let livesText = `Nyawa Tersisa: ${status.lives} | Soal Hari Ini: ${status.solvedCount}/5`;
    
    if (isPremiumMode) {
        action = `window.loadArenaExercise('${type}', 'app-content', false)`;
        statusText = 'Akses Tak Terbatas';
    } else if (isLocked) {
        action = `window.navigateToSubscription()`;
        statusText = `Terkunci (${status.isMaxedOut ? 'Kuota Habis' : 'Nyawa Habis'})`;
    } else {
        action = `window.loadArenaExercise('${type}', 'app-content', true)`;
        statusText = `Lanjut Latihan (${5 - status.solvedCount} Soal Tersisa)`;
        if (status.solvedCount === 0) {
            statusText = 'Mulai Tantangan Harian!';
        }
    }

    const cardTitle = isPremiumMode ? 'Susun Kalimat Premium' : 'Susun Kalimat Harian';
    const icon = isLocked ? 'fas fa-lock' : 'fas fa-puzzle-piece';

    const liveStatusHtml = !isPremiumMode ? `
        <div class="live-status mt-2">
            <i class="fas fa-heart text-danger"></i> 
            <span>${livesText}</span>
        </div>
    ` : '';
    
    return `
        <div class="idiom-card home-card-mini sentence-builder-card ${isLocked ? 'locked' : ''}" style="margin-top: 15px;" onclick="${action}">
            <i class="${icon}"></i>
            <div class="card-details">
                <h4>${cardTitle} (${statusText})</h4>
                <p>Petunjuk: <strong>"${hint}"</strong></p>
                <small>Uji kemampuan tata bahasa Anda.</small>
            </div>
            ${liveStatusHtml}
            <i class="fas fa-chevron-right"></i>
        </div>
    `;
}

function renderSentenceBuilderView(container, isDemo) {
    const backButton = isDemo ? `<button class="secondary-btn back-button" onclick="window.loadView('home')">← Kembali ke Beranda</button>` : '';
    const targetSentence = currentSentenceData.target; 
    
    const words = targetSentence.match(/[\w']+|[.,!?"-]/g);

    // Mengacak urutan kata
    const shuffledWords = [...words].sort(() => Math.random() - 0.5);
    let tokenHtml = shuffledWords.map((word, index) => 
        `<span 
            class="word-token" 
            draggable="true" 
            id="drag${index}" 
            ondragstart="window.drag(event)"
        >${word}</span>`
    ).join('');
    
    const nextExerciseCall = isDemo ? "window.loadView('home')" : "window.attemptNextSentenceBuilder()"; 

    const html = `
    ${backButton}
        <div class="section-card">
            <h3>✏️ Susun Kalimat ${isDemo ? '(Latihan Harian)' : ''}</h3>
            <p>Susun kata-kata di bawah ini menjadi kalimat yang benar.</p>

            <div id="sentence-area" class="drop-zone" ondrop="window.drop(event)" ondragover="window.allowDrop(event)">
                Susun Kalimatmu di sini...
            </div>
            
            <div id="word-pool" class="word-container" ondrop="window.drop(event)" ondragover="window.allowDrop(event)">
                ${tokenHtml}
            </div>

            <button class="primary-btn" id="sb-submit-btn" onclick="window.checkSentenceBuilder('${isDemo}')">
                Cek Jawaban
            </button>
            <button class="secondary-btn" id="sb-next-btn" style="display:none;" onclick="${nextExerciseCall}">Soal Berikutnya</button>
            <div id="builder-feedback" class="feedback-area"></div>
        </div>
    `;
    
    container.innerHTML = html;
}

function attemptNextSentenceBuilder() {
    // Dipanggil hanya oleh Premium
    loadArenaExercise('SENTENCE_BUILDER', 'app-content', false);
}

function checkSentenceBuilder(isDemoString) {
    const isDemo = isDemoString === 'true' || isDemoString === true; 
    const feedbackDiv = document.getElementById('builder-feedback');
    const targetSentence = currentSentenceData.target; 
    const submitBtn = document.getElementById('sb-submit-btn');
    const nextBtn = document.getElementById('sb-next-btn');

    let userSentence = '';
    const userTokens = document.querySelectorAll('#sentence-area .word-token-placed');
    userTokens.forEach((token, index) => {
        let word = token.textContent.trim();
        const isPunctuation = word.match(/^[.,!?"-]$/);
        if (index > 0) {
            if (isPunctuation) {
                if (userSentence.slice(-1) === ' ') {
                    userSentence = userSentence.slice(0, -1);
                }
            } else {
                userSentence += ' ';
            }
        }
        userSentence += word;
    });

    const normalizedTarget = targetSentence.trim().replace(/\s+/g, ' ');
    const normalizedUser = userSentence.trim().replace(/\s+/g, ' ');

    if (normalizedUser === normalizedTarget) {
        
        // --- JAWABAN BENAR ---
        const XP_REWARD = XP_REWARD_QUIZ;
        // PASTIKAN window.addPoints sudah didefinisikan di main.js
        window.addPoints('BINTANG_ILMU', XP_REWARD); 
        
        if (isDemo) {
            const solvedCount = increaseSBSolvedCount(); 
            const finalStatus = getSBChallengeStatus();
            
            feedbackDiv.innerHTML = `<span class="feedback-correct">✅ Tepat! Anda mendapatkan +${XP_REWARD} XP!</span>`;
            submitBtn.style.display = 'none';

            if (!finalStatus.isMaxedOut) {
                // Kuota belum habis (ada soal tersisa)
                nextBtn.innerHTML = `Lanjut Soal Berikutnya (${5 - finalStatus.solvedCount} Tersisa)`; 
                nextBtn.setAttribute('onclick', `window.loadArenaExercise('SENTENCE_BUILDER', 'app-content', true)`);
            } else {
                // Kuota 5 sudah habis 
                nextBtn.innerHTML = 'Kembali ke Beranda';
                nextBtn.setAttribute('onclick', 'window.loadView("home")');
                feedbackDiv.innerHTML += `<p class="mt-2 text-info">Anda telah menyelesaikan kuota 5 soal gratis hari ini.</p>`;
            }
            nextBtn.style.display = 'block';

        } else {
            // Logika Premium
            feedbackDiv.innerHTML = `<span class="feedback-correct">✅ Sempurna! Kalimatmu sudah benar. Anda mendapatkan +${XP_REWARD} XP!</span>`;
            submitBtn.style.display = 'none';
            nextBtn.style.display = 'block';
            nextBtn.innerHTML = 'Soal Premium Berikutnya →';
            setTimeout(() => window.attemptNextSentenceBuilder(), 1500); 
        }

    } else {
        // --- JAWABAN SALAH ---
        const currentStatus = getSBChallengeStatus();
        const remainingLives = isDemo ? decreaseSBLiveOnMistake() : currentStatus.lives; 

        let errorFeedback = `<span class="feedback-wrong">❌ Belum tepat! Tersisa ${remainingLives} Nyawa.</span>`;
        
        if (isDemo && remainingLives <= 0) {
            // Nyawa Habis -> Blokir Akses Harian
            // Di sini Anda bisa langsung memuat paywall (misalnya: loadArenaExercise('SENTENCE_BUILDER', 'app-content', true) akan dicek lagi di loadArenaExercise)
             errorFeedback += `<p class="mt-2 text-danger">Semua nyawa harian Anda telah habis. Coba lagi besok!</p>`;
             submitBtn.style.display = 'none';
             nextBtn.style.display = 'block';
             nextBtn.innerHTML = 'Kembali ke Beranda';
             nextBtn.setAttribute('onclick', 'window.loadView("home")');
            
        } else if (isDemo && remainingLives > 0) {
            // Salah, tapi Nyawa masih ada. Tampilkan tombol Lanjut.
            submitBtn.disabled = true; // Non-aktifkan tombol cek
            nextBtn.style.display = 'block'; // Tampilkan tombol Lanjut
            nextBtn.innerHTML = 'Coba Soal Lain (Nyawa Tersisa: ' + remainingLives + ') →';
            // Set tombol untuk memuat soal berikutnya (Demo Mode)
            nextBtn.setAttribute('onclick', `window.loadArenaExercise('SENTENCE_BUILDER', 'app-content', true)`);
        } else {
              // Logika Premium (Salah, tapi tidak ada Nyawa/Kuota)
              submitBtn.disabled = false;
        }
        
        feedbackDiv.innerHTML = errorFeedback + `
            <p>Jawaban Anda: ${normalizedUser}</p>
            <p class="demo-note">Target: ${normalizedTarget}</p>
        `;
    }
}


// --- DICTATION VIEW & CHECKERS (Tidak berubah) ---
// scripts/arena_logic.js

// Array pola Modul untuk 5 sesi Dictation harian
const DAILY_DICTATION_MIX = [
    'm1_simple_pres', // Sesi 1: Simple Present
    'm2_simple_past', // Sesi 2: Simple Past
    'm3_simple_fut',  // Sesi 3: Simple Future
    'm1_simple_pres', // Sesi 4: Simple Present
    'm2_simple_past', // Sesi 5: Simple Past
];

/**
 * Membuat daftar putar (playlist) ID soal Dictation harian.
 * @param {string} levelId - ID Level yang sedang dikerjakan (e.g., 'A1_ID').
 * @returns {Array<string>} Daftar ID soal yang dipilih.
 */
function generateDailyDictationPlaylist(levelId = 'A1_ID') {
    const playlist = [];
    const MAX_SESSIONS = 5;

    // Filter semua soal Dictation dari ALL_EXERCISES
    const dictationExercises = ALL_EXERCISES.filter(e => 
        e.type === 'DICTATION' && 
        e.level === levelId
        // Anda mungkin perlu menambahkan filter soal yang belum selesai di sini 
        // setelah Anda mengimplementasikan pelacakan kemajuan (progress tracking)
    );

    // Iterasi pola mix untuk memilih 5 soal
    for (const moduleId of DAILY_DICTATION_MIX) {
        if (playlist.length >= MAX_SESSIONS) break;

        // Filter soal yang hanya dari Module ID saat ini (e.g., 'm1_simple_pres')
        const availableExercises = dictationExercises.filter(e => e.moduleId === moduleId);

        if (availableExercises.length > 0) {
            // Ambil soal secara acak DARI DALAM MODUL YANG TEPAT
            const randomIndex = Math.floor(Math.random() * availableExercises.length);
            playlist.push(availableExercises[randomIndex].id);
        }
    }

    // Jika playlist kurang dari 5 (karena data kurang), isi sisanya dengan acak
    while (playlist.length < MAX_SESSIONS && dictationExercises.length > 0) {
          const randomIndex = Math.floor(Math.random() * dictationExercises.length);
          playlist.push(dictationExercises[randomIndex].id);
    }

    // Simpan playlist dan index ke localStorage
    localStorage.setItem('dictationDailyPlaylist', JSON.stringify(playlist));
    localStorage.setItem('dictationCurrentIndex', 0);
    return playlist;
}

/**
 * Mengambil soal Dictation berikutnya dari playlist harian.
 * Juga memajukan index setelah soal berhasil diambil.
 * @returns {object | null} Data soal Dictation berikutnya atau null jika playlist habis.
 */
export function getDictationExercise() {
    const playlist = JSON.parse(localStorage.getItem('dictationDailyPlaylist'));
    let currentIndex = parseInt(localStorage.getItem('dictationCurrentIndex')) || 0;

    if (!playlist || currentIndex >= playlist.length) {
        return null; // Playlist habis
    }

    const nextExerciseId = playlist[currentIndex];
    
    // Cari data soal di ALL_EXERCISES
    const exerciseData = ALL_EXERCISES.find(e => e.id === nextExerciseId);

    // Majukan index untuk sesi berikutnya
    localStorage.setItem('dictationCurrentIndex', currentIndex + 1);

    return exerciseData;
}


// ====================================================================
// --- FUNGSI LOGIC DICTATION BARU (Untuk di-export ke main.js) ---
// ====================================================================

/**
 * Mengurangi nyawa Dictation ketika pengguna membuat kesalahan.
 * @returns {number} Sisa nyawa saat ini.
 
/**
 * Mengembalikan nyawa Dictation penuh (misalnya, setelah menonton iklan).
 * @returns {boolean} True jika pemulihan berhasil, False jika kuota iklan habis.
 */

// ====================================================================
// --- BAGIAN VIEW & CHECKERS YANG SUDAH ADA ---
// ====================================================================

function renderDictationView(container) { 
    // ... (Logika render) ...
}

function checkDictation() {
    // ... (Implementasi logika check dictation) ...
    const XP_REWARD = XP_REWARD_QUIZ; 
    // ...
    window.addPoints('BINTANG_ILMU', XP_REWARD);
    // ...
}

function attemptNextDictation() { 
    loadArenaExercise('DICTATION', 'app-content', false);
}

// --- PRONUNCIATION VIEW & CHECKERS (Tidak berubah) ---
function renderPronunciationView(container) {
    // ... (Logika render) ...
}

function startRecognition(targetText) { 
    // ... (Implementasi logika STT) ...
    const XP_REWARD = XP_REWARD_QUIZ; 
    // ...
    window.addPoints('BINTANG_ILMU', XP_REWARD);
    // ...
}

function attemptNextPronunciation() { 
    loadArenaExercise('PRONUNCIATION', 'app-content', false);
}

// --- TRANSLATION VIEW & CHECKERS (Tidak berubah) ---
function renderTranslationView(container) {
    // ... (Logika render) ...
}

function checkTranslation() {
    // ... (Implementasi logika check translation) ...
    const XP_REWARD = XP_REWARD_QUIZ; 
    // ...
    window.addPoints('BINTANG_ILMU', XP_REWARD);
    // ...
}

function attemptNextTranslation() { 
    loadArenaExercise('TRANSLATION', 'app-content', false);
}

// --- IDIOM VIEW & CHECKERS (Tidak berubah) ---
function attemptNextIdiom() {
    loadArenaExercise('IDIOM', 'app-content', false);
}


// ====================================================================
// --- F. EXPORTS (SEKARANG LENGKAP) ---
// ====================================================================

export { 
    loadArenaExercise,
    checkDictation,
    checkSentenceBuilder,
    getNextExercise,
    
    // EXPORT FUNGSI DICTATION (Terselesaikan!)
    getDictationChallengeStatus,
    checkTranslation, 
    attemptNextDictation,
    attemptNextTranslation, 
    attemptNextSentenceBuilder, 
    attemptNextPronunciation,
    attemptNextIdiom,
    speakText,
    startRecognition,
    
    // Drag & Drop handlers
    allowDrop,
    drag,
    drop,
    removeToken,
    renderIdiomCard,
    renderSentenceBuilderCard,
    
    // EXPORT LEVEL
    renderLessonCards, 
    renderLevelModulesView,
    loadLevelModules,
        
    // Fungsi Logic & Helpers
    normalizeText,
    calculateAccuracy,
    isNewDay,
    getOrCreateDailyIdiom,
    manageDailyIdiomReward,

    // Sentence Builder Logic
    getSBChallengeStatus,
    decreaseSBLiveOnMistake,
    increaseSBSolvedCount,
    restoreSBLivesByAd,
};