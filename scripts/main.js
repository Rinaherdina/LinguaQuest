// ====================================================================
// --- A. IMPORT LOGIC DAN DATA ---
// ====================================================================

// --- Import data
import { 
    TENSES_DATA, 
    // ARENA_EXERCISES, 
    LESSON_PATH, 
    GAMIFICATION_CONFIG, 
    STORY_MODE_DATA,
    QUIZ_DATA,
    READING_DATA,
    // PRONOUNS dan IRREGULAR_VERBS tidak diimpor di sini
} from './data.js';

import { 
    getAllTenses, 
    getAllPronouns, 
    generateReferenceSentence, 
    getTensesMaterial,
    generateTensesExamples,
    getTensesInfo, 
    evaluateUserSentence, 
    checkVerbForms 
} from './tenses_logic.js';

// Import Logika Arena & Heart System
// DITAMBAH: Import fungsi-fungsi Dictation & Heart System dari arena_logic
import { 
    loadArenaExercise,
    checkDictation,
    checkSentenceBuilder,
    checkTranslation,
    attemptNextDictation,
    attemptNextPronunciation,
    attemptNextTranslation,
    attemptNextIdiom,
    speakText,
    startRecognition,
    allowDrop, 
    drag,       
    drop,       
    removeToken, 
    renderIdiomCard, 
    renderSentenceBuilderCard,
    renderLessonCards,
    renderLevelModulesView,
    loadLevelModules,
    // --- FUNGSI DICTATION BARU ---
    getDictationChallengeStatus,
    getDictationExercise,
    restoreDictationLivesByAd,
    decreaseDictationLiveOnMistake,
} from './arena_logic.js'; 

// Import Logika Story Mode
import { 
    renderStoryMode as startStoryMode, 
    nextStoryStep, 
    checkTensesExercise 
} from './story_logic.js';

// Import data Dictation (Hanya untuk konsistensi, akan diganti dengan ALL_EXERCISES di arena_logic)
import { DICTATION_L1_SENTENCES } from './dictation_L1_sentences.js';


// ====================================================================
// --- B. VARIABLE GLOBAL & STATE ---
// ====================================================================

let userIsPremium = false;
window.userIsPremium = userIsPremium;

let userState = {
    xp: 0, 
    level: 1,
    rankTitle: 'Penyelamat Kata Dasar',
    streak: 0,
    lastActivityDate: null,
    masteryMap: {} 
};
window.userState = userState; 
window.currentViewId = 'home'; // Default view

// Variabel Global untuk Kuis
let currentQuizData = []; 
let currentQuizModuleId = null;
let currentQuizScore = 0;
let currentQuizIndex = 0; 
let currentQuizTimeout; 

// Variabel Global untuk Reading
let currentReadingQuestions = [];
let currentReadingModuleId = null;
let readingIndex = 0;
let readingScore = 0;
let readingTimeout; 

// Variabel Global untuk Tenses Transformer
const PRONOUNS_LIST = getAllPronouns();
const DEFAULT_V1 = 'eat'; 
const DEFAULT_OBJECT = 'an apple';
const DEFAULT_COMPLEMENT = 'happy';

// --- Elemen DOM Utama Dictation (Dari HTML) ---
const appContent = document.getElementById('app-content');
const bottomNav = document.getElementById('bottom-nav');
const scoreValue = document.getElementById('score-value');
const dictationContainer = document.getElementById('dictation-challenge-container');
const promptContainer = document.getElementById('premium-ad-prompt-container');
const loadingScreen = document.getElementById('loading-screen');
// Variabel Dictation state
let currentExerciseData = null; 


// ====================================================================
// --- C. FUNGSI INTI PREMIUM WALL (Simulasi) ---
// ====================================================================

/**
 * Memeriksa status Premium pengguna (Simulasi).
 */
function isUserPremium() {
    window.userIsPremium = localStorage.getItem('isPremium') === 'true';
    return window.userIsPremium; 
}
window.isUserPremium = isUserPremium;

/**
 * Menampilkan modal Premium Wall (Simulasi).
 */
function showPremiumWall(title, message, featureId) {
    console.warn(`--- PREMIUM WALL TRIGGERED: ${featureId} ---`);
    alert(`[🔓 PREMIUM REQUIRED]\n\n${title}\n\n${message}\n\n(Fitur ${featureId} membutuhkan Langganan Premium. Klik OK untuk ke halaman Premium.)`);
    loadView('premium');
}
window.showPremiumWall = showPremiumWall;

// ====================================================================
// --- D. FUNGSI VIEW UTAMA (Dipindahkan ke Atas agar bisa diakses loadView) ---
// ====================================================================

/**
 * Merender view utama Tenses Transformer (Gabungan dari Tahap 1 & 2)
 */
function renderTensesTransformerView() {
    if (!appContent) return; // Tambahkan cek pengaman

    // Dropdown Tenses
    const tensesOptions = TENSES_DATA.map(t => 
        `<option value="${t.id}" ${!t.gratis && !window.userIsPremium ? 'disabled' : ''}>
            ${t.name} ${!t.gratis ? ' 💎 (Premium)' : ''}
        </option>`
    ).join('');

    appContent.innerHTML = `
        <button class="secondary-btn back-button" onclick="loadView('home')">← Kembali ke Beranda</button>
        <div class="tool-view tenses-transformer">
            <h2>✨ Tenses Evaluator & Transformer</h2>
            
            <div class="input-form-group section-card">
                <h3>Pengaturan Tenses</h3>
                <div class="input-group">
                    <label for="tenses-select">Pilih Tenses:</label>
                    <select id="tenses-select">${tensesOptions}</select>
                </div>
                <div class="input-group">
                    <label for="subject-input">Pilih Subjek (Pronoun):</label>
                    <select id="subject-input">${PRONOUNS_LIST.map(p => `<option value="${p}">${p}</option>`).join('')}</select>
                </div>
            </div>
            
            <div class="input-form-group verb-nominal-input section-card">
                <h3>Komponen Kalimat</h3>
                <div class="input-group">
                    <label for="verb-input">Kata Kerja Dasar (V1):</label>
                    <input type="text" id="verb-input" value="${DEFAULT_V1}" placeholder="e.g., eat, swim, go">
                </div>
                <div class="input-group">
                    <label for="object-input">Objek/Keterangan Verbal:</label>
                    <input type="text" id="object-input" value="${DEFAULT_OBJECT}" placeholder="e.g., a letter, football">
                </div>
                <div class="input-group">
                    <label for="complement-input">Komplemen (Nominal):</label>
                    <input type="text" id="complement-input" value="${DEFAULT_COMPLEMENT}" placeholder="e.g., happy, a teacher">
                </div>
            </div>

            <h3 class="section-title">Materi Tenses</h3>
            <div id="tenses-material-container" class="material-container section-card">
            </div>

            <h3 class="section-title">Kalimat Referensi</h3>
            <div id="tenses-output" class="result-box section-card">
                <p class="alert-info">Pilih Tenses dan Subjek untuk memulai transformasi.</p>
            </div>
            
            <div id="tenses-check-area" class="section-card" style="margin-top: 20px;">
                <h3>Uji Kalimat Anda (Evaluator)</h3>
                <p>Tulis kalimat Positif, Negatif, dan Tanya. Bandingkan dengan referensi di atas.</p>
                <div class="tenses-input-grid">
                    <div class="tenses-input-column">
                        <h4>(+) Positive</h4>
                        <input type="text" id="input-positive" placeholder="Tulis Kalimat Positif...">
                        <div id="feedback-positive" class="feedback-box"></div>
                    </div>
                    <div class="tenses-input-column">
                        <h4>(-) Negative</h4>
                        <input type="text" id="input-negative" placeholder="Tulis Kalimat Negatif...">
                        <div id="feedback-negative" class="feedback-box"></div>
                    </div>
                    <div class="tenses-input-column">
                        <h4>(?) Interrogative</h4>
                        <input type="text" id="input-interrogative" placeholder="Tulis Kalimat Tanya...">
                        <div id="feedback-interrogative" class="feedback-box"></div>
                    </div>
                </div>
                <button class="primary-btn" style="margin-top: 20px; width: 100%;" onclick="window.checkTensesTransformerInputs()">Cek Ketiga Kalimat</button>
            </div>
            
            <div id="tenses-result" class="result-box" style="display: none;"></div>
            
            <div class="section-card">
                <h3>Pengecek Bentuk Kata Kerja (V1/V2/V3)</h3>
                <div class="input-form-group verb-check-group">
                    <input type="text" id="verb-check-input" placeholder="Ketik kata kerja untuk cek V2/V3">
                    <button id="check-verb-btn" class="action-btn" onclick="window.handleVerbFormCheck()"><i class="fas fa-search"></i> Cek</button>
                </div>
                <div id="verb-check-result" class="result-box verb-check-output">
                    <p class="alert-info">Hasil pengecekan V1, V2, V3 akan muncul di sini.</p>
                </div>
            </div>
        </div>
    `;
}
// ASUMSI: Fungsi initTensesTransformerView, renderHomeDashboard, renderStoryModeView, renderPremiumPage harus didefinisikan di file ini atau diimpor.
// Karena belum ada, saya menempatkan yang Anda kirimkan di bawah.


// ====================================================================
// --- E. LOGIKA PREMIUM WALL (APLIKASI) ---
// ====================================================================

/**
 * Skenario 1: Memblokir akses ke Lesson Path Level Premium.
 */
function handleLessonPathClick(lessonId) {
    const lesson = LESSON_PATH.find(l => l.id === lessonId);
    if (lesson && lesson.premium && !window.userIsPremium) {
        showPremiumWall('🔓 Level Terkunci Premium', 'Level ini membutuhkan langganan Premium untuk diakses.', 'lesson_path_premium');
        return false;
    }
    return true;
}

/**
 * Skenario 2: Mencegah akses berulang ke Ujian/Review harian.
 */
function handleReviewQuizAttempt(moduleId) {
    // ASUMSI: Logika ini ada di file lain atau placeholder
    console.log(`Placeholder: handleReviewQuizAttempt untuk ${moduleId}`);
    return true;
}

/**
 * Skenario 3: Logic untuk Perbaikan Streak.
 */
function tryRepairStreak(userStars) {
    // ASUMSI: Logika perbaikan streak, misalnya, membayar 100 XP
    if (userStars >= 100) {
        if (confirm("Streak Anda putus! Apakah Anda ingin memperbaiki streak seharga 100 Bintang Ilmu?")) {
            addXP(-100);
            return true;
        }
    }
    return false;
}

// ====================================================================
// --- F. FUNGSI NAVIGASI UTAMA ---
// ====================================================================

/**
 * Mengganti tampilan utama aplikasi.
 */
function loadView(viewName) {
    if (!appContent) return;

    isUserPremium(); 
    
    window.currentViewId = viewName; 
    // Bersihkan appContent, TAPI kita perlu mempertahankan kontainer Dictation di DOM
    appContent.innerHTML = '';
    
    // Sembunyikan semua kontainer utama sebelum memuat yang baru
    dictationContainer.classList.add('hidden');
    promptContainer.classList.add('hidden');
    
    window.scrollTo(0, 0);

    // Kelola navigasi bawah
    const navButtons = document.querySelectorAll('#bottom-nav button');
    navButtons.forEach(button => {
        button.classList.remove('active');
        if (button.getAttribute('data-view') === viewName) {
            button.classList.add('active');
        }
    });
    
    // Routing
    if (viewName === 'home') {
        renderHomeDashboard();
    } else if (viewName === 'learn') {
        // Render SEMUA KARTU LEVEL (A1, A2, B1, dst.).
        loadLevelModules('A1_ID'); // Mengambil data level awal, harusnya memuat semua level
    } else if (viewName === 'tools') {
        renderTensesTransformerView(); 
        initTensesTransformerView(); // ASUMSI: fungsi ini ada
    } else if (viewName === 'story') {
        // renderStoryModeView(); // ASUMSI: fungsi ini ada
    } else if (viewName === 'premium') {
        // renderPremiumPage(); // ASUMSI: fungsi ini ada
    } else if (viewName === 'arena_dictation') {
        loadDictationChallenge(); // Panggil fungsi Dictation Challenge yang baru
    } else if (viewName.startsWith('arena_')) {
        const type = viewName.split('_')[1].toUpperCase();
        loadArenaExercise(type, 'app-content'); 
    } else if (viewName.startsWith('lesson_')) {
        renderLessonModule(viewName);
    }
    
    // Sembunyikan loading screen setelah konten dimuat
    loadingScreen.classList.add('hidden');
}
window.loadView = loadView; 

/**
 * Fungsi utilitas untuk kembali ke beranda.
 */
function goToHomePage() {
    loadView('home');
}
window.goToHomePage = goToHomePage;

// ====================================================================
// --- G. FUNGSI GAMIFIKASI & STATE PENGGUNA ---
// ====================================================================

/**
 * Memuat state pengguna (XP, Streak) dari Local Storage.
 */
function loadUserState() {
    const savedState = localStorage.getItem('linguaquest_user_state');
    if (savedState) {
        userState = JSON.parse(savedState);
        if (typeof userState.xp === 'undefined') userState.xp = 0;
        if (typeof userState.masteryMap === 'undefined') userState.masteryMap = {};
        if (typeof userState.rankTitle === 'undefined') userState.rankTitle = GAMIFICATION_CONFIG.LEVEL_XP_THRESHOLD[0].title;
    }
    isUserPremium(); 
    
    checkDailyStreak();
    updateLevelFromXP();
    window.userState = userState;
    
    // Initial display update
    document.getElementById('score-value').textContent = userState.xp.toLocaleString();
}

/**
 * Memperbarui Pangkat Pengguna berdasarkan total XP.
 */
function updateLevelFromXP() {
    let newLevel = 1;
    let newTitle = GAMIFICATION_CONFIG.LEVEL_XP_THRESHOLD[0].title;
    let rankUpdated = false;

    for (const levelData of GAMIFICATION_CONFIG.LEVEL_XP_THRESHOLD) {
        if (userState.xp >= levelData.minStars) { 
            newLevel = levelData.level;
            newTitle = levelData.title;
        }
    }

    if (userState.level !== newLevel) {
        userState.level = newLevel;
        rankUpdated = true;
    }
    if (userState.rankTitle !== newTitle) {
        userState.rankTitle = newTitle;
        rankUpdated = true;
    }

    if (rankUpdated && window.currentViewId === 'home') {
        renderHomeDashboard();
    }
}

/**
 * Menambahkan XP (Bintang Ilmu) dan memperbarui level.
 */
function addXP(amount) {
    if (amount <= 0) return;
    window.userState.xp += amount;
    
    updateLevelFromXP(); 
    saveUserState();
    document.getElementById('score-value').textContent = window.userState.xp.toLocaleString();
    
    if (window.currentViewId === 'home') {
        renderHomeDashboard();
    }
}
window.addXP = addXP;

// --- INISIALISASI POIN BINTANG ILMU (DIPINDAHKAN KE addXP untuk kesederhanaan) ---
// Fungsi helper untuk mendapatkan nilai Bintang Ilmu saat ini
function getCurrentBintangIlmu() {
    return userState.xp;
}

// --- DEFINISI FUNGSI GLOBAL addPoints (PENGGANTI LAMA) ---
// Fungsi ini dipanggil dari arena_logic.js
window.addPoints = function(type, amount) {
    // Kita asumsikan semua penambahan poin adalah untuk XP (Bintang Ilmu)
    if (type === 'DICTATION' || type === 'SENTENCE_BUILDER' || type === 'BINTANG_ILMU') {
        addXP(amount);
        console.log(`⭐ Bintang Ilmu Ditambahkan: +${amount}. Total Bintang Ilmu: ${userState.xp}`);
        return userState.xp;
    }
    return false;
};

/**
 * Menambah Mastery Points ke modul tertentu.
 */
function addMastery(moduleId, amount) {
    if (amount <= 0) return;
    
    if (!window.userState.masteryMap[moduleId]) {
        window.userState.masteryMap[moduleId] = 0;
    }

    const moduleConfig = LESSON_PATH.flatMap(p => p.modules).find(m => m.id === moduleId);
    if (!moduleConfig) return; 

    const maxMastery = moduleConfig.maxMastery || 100;

    window.userState.masteryMap[moduleId] = Math.min(
        window.userState.masteryMap[moduleId] + amount,
        maxMastery
    );

    saveUserState();
}
window.addMastery = addMastery;


/**
 * Mengecek dan memperbarui Streak harian.
 */
function checkDailyStreak() {
    const today = new Date().toDateString();
    const lastActivity = userState.lastActivityDate;
    
    if (lastActivity && lastActivity !== today) {
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        
        if (lastActivity !== yesterday.toDateString()) {
            // Streak putus
            if (!tryRepairStreak(userState.xp)) {
                 userState.streak = 0; // Atur streak ke 0 jika gagal perbaikan
            } else {
                // Perbaikan berhasil (Streak dipertahankan/diset ke 1)
                userState.lastActivityDate = today;
                userState.streak = userState.streak > 0 ? userState.streak : 1; 
                saveUserState();
                return; 
            }
        }
    }

    if (!lastActivity || lastActivity !== today) {
        if (lastActivity) {
            const yesterday = new Date();
            yesterday.setDate(yesterday.getDate() - 1);
            
            if (lastActivity === yesterday.toDateString()) {
                userState.streak += 1;
            } else {
                userState.streak = 1;
            }
        } else {
            userState.streak = 1; 
        }
        
        userState.lastActivityDate = today;
        saveUserState();
    }
}

/**
 * Mendapatkan konfigurasi level saat ini.
 */
function getCurrentLevelConfig() {
    const level = userState.level;
    const config = GAMIFICATION_CONFIG.LEVEL_XP_THRESHOLD.find(c => c.level === level) || GAMIFICATION_CONFIG.LEVEL_XP_THRESHOLD[0];
    const nextConfig = GAMIFICATION_CONFIG.LEVEL_XP_THRESHOLD.find(c => c.level === level + 1);
    
    return {
        ...config,
        nextStars: nextConfig ? nextConfig.minStars : userState.xp, 
        progress: nextConfig 
            ? (userState.xp - config.minStars) / (nextConfig.minStars - config.minStars) * 100
            : 100
    };
}


// ====================================================================
// --- H. RENDERER: Beranda & Lesson Path ---
// ====================================================================

function renderHomeDashboard() {
    const appContent = document.getElementById('app-content');
    
    const levelConfig = getCurrentLevelConfig();
    const nextLevelConfig = GAMIFICATION_CONFIG.LEVEL_XP_THRESHOLD.find(c => c.level === userState.level + 1);
    
    const starsNeeded = nextLevelConfig ? nextLevelConfig.minStars - userState.xp : 0;
    
    let html = `
        <h2 class="welcome-heading">Selamat Datang, Quester! 👋</h2>
        
        <div class="gamification-card section-card">
            <div class="level-info">
                <i class="fas ${levelConfig.icon} level-icon"></i>
                <div class="text-info">
                    <h4>${levelConfig.title} (Lv. ${userState.level})</h4>
                    <p>Streak Harian: ⚡️ ${userState.streak} hari</p>
                </div>
                <button class="btn-premium" onclick="loadView('premium')">💎 Premium</button>
            </div>
            <div class="xp-progress">
                <p>Bintang Ilmu: ${userState.xp} / ${nextLevelConfig ? nextLevelConfig.minStars : userState.xp} ${nextLevelConfig ? `(Sisa ${starsNeeded} Bintang Ilmu)` : '(Level Maksimal)'}</p>
                <div class="progress-bar-container">
                    <div class="progress-bar" style="width: ${levelConfig.progress}%;"></div>
                </div>
            </div>
        </div>
        
        <div class="section-card" style="margin-top: 30px;">
            <h2>🔥 Tantangan Harian (Eksklusif)</h2>
            
            ${renderIdiomCard()} 
            ${renderSentenceBuilderCard(true)} 
            
            <h3 style="margin-top: 30px;">Pusat Aksi Cepat</h3>
            <div class="home-action-btn-container">
                <button class="home-action-btn" onclick="window.renderLessonModule('${LESSON_PATH[0].id}')">
                    <i class="fas fa-book-open"></i> Lanjut Belajar: ${LESSON_PATH[0].name}
                </button>
                <button class="home-action-btn" onclick="loadView('tools')">
                    <i class="fas fa-magic"></i> Akses Tenses Evaluator
                </button>
            </div>

            <div class="premium-wall-short" style="margin-top: 20px;">
                <p>Ingin lebih banyak tantangan? Kunjungi Arena Latihan Intensif! **(Ingat Batas Heart untuk Gratis)**</p>
                <button class="primary-btn secondary-btn" style="width: auto; max-width: 300px; margin: 10px auto;" onclick="loadView('arena_dictation')">
                    <i class="fas fa-dumbbell"></i> Kunjungi Arena Latihan
                </button>
            </div>
        </div>

        <h3>🗺️ Jalur Pembelajaran (Lesson Path)</h3>
    `;
    
    // Render LESSON_PATH
    LESSON_PATH.forEach(lesson => {
        const isLockedByXP = userState.xp < lesson.requiredXp;
        const isLockedByPremium = lesson.premium && !isUserPremium(); 
        
        const isLocked = isLockedByXP || isLockedByPremium;

        const requiredRank = GAMIFICATION_CONFIG.LEVEL_XP_THRESHOLD.find(c => c.minStars === lesson.requiredXp)?.title || '??';
        
        let lockMessage = '';
        if (isLockedByPremium) {
            lockMessage = `Terkunci! Level ${lesson.name} adalah konten Premium eksklusif.`;
        } else if (isLockedByXP) {
            lockMessage = `Terkunci! Butuh ${lesson.requiredXp} Bintang Ilmu (Pangkat ${requiredRank}).`;
        }
        
        const buttonAction = isLocked 
            ? isLockedByPremium 
                ? `showPremiumWall('🔓 Level Terkunci Premium', 'Level ini membutuhkan langganan Premium untuk diakses.', 'lesson_path_premium')`
                : `alert('${lockMessage}')` 
            : `window.renderLessonModule('${lesson.id}')`;
        
        html += `
            <div class="lesson-card section-card ${isLocked ? 'locked' : ''}" onclick="${buttonAction}">
                <i class="fas ${lesson.icon} lesson-icon"></i>
                <div class="lesson-details">
                    <h4>${lesson.name} ${isLockedByPremium ? '💎' : ''}</h4>
                    <p>${lesson.desc}</p>
                </div>
                ${isLocked ? '<i class="fas fa-lock lock-indicator"></i>' : '<i class="fas fa-chevron-right lock-indicator"></i>'}
            </div>
        `;
    });
    
    html += `</div>`;
    appContent.innerHTML = html;
}
window.renderHomeDashboard = renderHomeDashboard;

/**
 * Merender detail Modul Pembelajaran setelah mengklik Lesson Path.
 */
function renderLessonModule(lessonId) {
    if (!handleLessonPathClick(lessonId)) {
        return;
    }
    
    const appContent = document.getElementById('app-content');
    const lesson = LESSON_PATH.find(l => l.id === lessonId);
    
    if (!lesson) {
        appContent.innerHTML = `<p class="feedback-wrong">Lesson ID tidak ditemukan.</p>`;
        return;
    }
    
    let html = `
        <button class="secondary-btn back-button" onclick="loadView('home')">← Kembali ke Lesson Path</button>
        <h2>${lesson.name}</h2>
        <p>${lesson.desc}</p>
        
        <div class="module-list">
    `;
    
    lesson.modules.forEach(module => {
        const isLocked = module.lock && !window.userIsPremium; 
        const lockIcon = isLocked ? '<i class="fas fa-lock"></i>' : '<i class="fas fa-play"></i>';
        
        const buttonAction = isLocked 
            ? `showPremiumWall('🔓 Modul Terkunci Premium', 'Modul ${module.name} memerlukan langganan Premium.', 'module_premium_lock')`
            : `window.loadModuleContent('${module.id}', '${module.content[0]}')`; // ASUMSI: window.loadModuleContent ada
        
        const currentMastery = window.userState.masteryMap[module.id] || 0;
        const maxMastery = module.maxMastery || 100;
        const progressPercent = (currentMastery / maxMastery) * 100;
        
        html += `
            <div class="module-card section-card ${isLocked ? 'locked' : ''}">
                <div class="module-header">
                    <h4>${module.name} ${isLocked ? '💎' : ''}</h4>
                    <small>Fokus: ${module.content.join(', ')}</small>
                </div>
                <div class="module-progress">
                    <p>Mastery: ${currentMastery}/${maxMastery} ${currentMastery >= maxMastery ? '👑' : ''}</p>
                    <div class="progress-bar-container small">
                        <div class="progress-bar" style="width: ${progressPercent}%;"></div>
                    </div>
                </div>
                <button class="primary-btn module-start-btn" onclick="${buttonAction}">
                    ${lockIcon} ${isLocked ? 'Terkunci' : 'Mulai Latihan'}
                </button>
            </div>
        `;
    });
    
    html += `</div>`;
    appContent.innerHTML = html;
}
window.renderLessonModule = renderLessonModule;

// ====================================================================
// --- I. LOGIKA DICTATION BARU (UI & Event Handlers) ---
// ====================================================================

function updateLivesDisplay() {
    const status = getDictationChallengeStatus();
    const livesDisplay = document.getElementById('dictation-lives-display');
    
    // Pastikan elemen ada di DOM
    if (livesDisplay) {
        livesDisplay.textContent = `❤️ ${status.lives}`;
        
        // Ubah warna jika nyawa kritis
        if (status.lives <= 1) {
            livesDisplay.style.color = 'var(--color-error)';
        } else {
            livesDisplay.style.color = 'var(--color-error)'; // Warna default heart adalah merah
        }
    }
    return status;
}

function loadDictationChallenge() {
    // Tambahkan kontainer ke DOM jika belum ada (karena appContent di-innerHTML = '')
    if (!document.body.contains(dictationContainer)) {
        appContent.appendChild(dictationContainer);
    }
    if (!document.body.contains(promptContainer)) {
        appContent.appendChild(promptContainer);
    }
    
    const status = updateLivesDisplay();
    
    // 1. Cek status Nyawa untuk Paywall/Ad Prompt
    if (status.lives <= 0) {
        if (status.adsAvailable > 0) {
            renderAdPrompt(status); 
        } else {
            renderPremiumWall(); 
        }
        return;
    }
    
    // 2. Jika nyawa OK, ambil soal berikutnya
    const exercise = getDictationExercise(); 
    
    if (!exercise) {
        appContent.innerHTML = `<h2>🎉 Selamat!</h2><p class="section-card">Semua tantangan Dictation harian (5/5) sudah selesai. Kembali lagi besok untuk Tantangan Harian yang baru!</p><button class="primary-btn" onclick="loadView('home')">Kembali ke Beranda</button>`;
        return;
    }

    currentExerciseData = exercise;
    renderDictationView(exercise);
}

function renderDictationView(exercise) {
    // Sembunyikan prompt, tampilkan dictation container
    promptContainer.classList.add('hidden');
    dictationContainer.classList.remove('hidden');
    
    // Pastikan container ada di appContent
    if (appContent.innerHTML !== '') {
        appContent.innerHTML = ''; 
    }
    appContent.appendChild(dictationContainer);
    
    // Reset elemen tampilan
    document.getElementById('dictation-input').value = '';
    document.getElementById('feedback-message').textContent = '';
    document.getElementById('feedback-message').className = 'feedback-text';
    document.getElementById('hint-display').classList.add('hidden');
    document.getElementById('correct-answer-display').classList.add('hidden');
    document.getElementById('check-answer-button').disabled = false;
    document.getElementById('show-hint-button').disabled = false;
    
    // Update info modul dan level
    document.getElementById('dictation-level-title').textContent = `Dictation Challenge: Level ${exercise.level.replace('_ID', '')}`;
    document.getElementById('dictation-module-info').textContent = `${exercise.tenses || exercise.moduleId}`;
}

function checkAnswer() {
    if (!currentExerciseData) return;
    
    const userInput = document.getElementById('dictation-input').value.trim();
    const targetAnswer = currentExerciseData.target.trim();
    const feedback = document.getElementById('feedback-message');
    const checkButton = document.getElementById('check-answer-button');

    // Cek Jawaban (Menggunakan logika Dictation dari arena_logic)
    const isCorrect = checkDictation(userInput, targetAnswer); 

    if (isCorrect) {
        // Jawaban BENAR
        feedback.textContent = '✅ Jawaban Tepat! Lanjut ke sesi berikutnya...';
        feedback.classList.remove('incorrect');
        feedback.classList.add('correct');
        
        window.addPoints('DICTATION', 50); 
        window.addMastery(currentExerciseData.moduleId, 5); // Tambah Mastery

        checkButton.disabled = true;
        setTimeout(loadDictationChallenge, 2000); 
    } else {
        // Jawaban SALAH
        const remainingLives = decreaseDictationLiveOnMistake();
        updateLivesDisplay();
        
        feedback.textContent = `❌ Salah! Sisa Nyawa: ${remainingLives}. Coba lagi.`;
        feedback.classList.remove('correct');
        feedback.classList.add('incorrect');
        
        // Tampilkan Jawaban Benar
        document.getElementById('correct-text').textContent = targetAnswer;
        document.getElementById('correct-answer-display').classList.remove('hidden');

        // Jika nyawa habis setelah kesalahan ini, panggil ulang untuk memicu prompt
        if (remainingLives <= 0) {
            checkButton.disabled = true;
            setTimeout(loadDictationChallenge, 2000);
        }
    }
}
window.checkAnswer = checkAnswer; // Jadikan global

function showHint() {
    if (!currentExerciseData) return;
    
    const hintDisplay = document.getElementById('hint-display');
    hintDisplay.innerHTML = `<strong>Hint (Terjemahan):</strong> ${currentExerciseData.hint}`;
    hintDisplay.classList.remove('hidden');
    document.getElementById('show-hint-button').disabled = true;
}
window.showHint = showHint; // Jadikan global

function setupDictationListeners() {
    // Cek Jawaban
    const checkBtn = document.getElementById('check-answer-button');
    if(checkBtn) checkBtn.addEventListener('click', window.checkAnswer);
    
    // Tampilkan Hint
    const hintBtn = document.getElementById('show-hint-button');
    if(hintBtn) hintBtn.addEventListener('click', window.showHint);
    
    // Audio (Simulasi)
    document.getElementById('play-audio-button')?.addEventListener('click', () => {
        if (currentExerciseData) {
            speakText(currentExerciseData.target); // Menggunakan fungsi speakText dari arena_logic
        }
    });

    document.getElementById('play-audio-slow-button')?.addEventListener('click', () => {
        if (currentExerciseData) {
            speakText(currentExerciseData.target, 0.7); // 0.7 adalah kecepatan lambat
        }
    });
}


// --- Logika Premium/Ad Prompt Renderer ---

function renderAdPrompt(status) {
    // Sembunyikan dictation container, tampilkan prompt
    dictationContainer.classList.add('hidden');
    promptContainer.classList.remove('hidden');
    appContent.appendChild(promptContainer);
    
    let html = `
        <h2>Nyawa Dictation Habis! ❤️ 0</h2>
        <p>Anda kehabisan nyawa hari ini. Pilih opsi untuk melanjutkan:</p>
        <p class="mb-3">Kesempatan Tonton Iklan Tersisa: <strong>${status.adsAvailable} / ${status.adsUsed + status.adsAvailable}</strong></p>
        <div class="prompt-actions">
            <button class="ad-button" onclick="window.handleAdRestore()">
                <i class="fas fa-video"></i> Tonton Iklan (+3 Nyawa)
            </button>
            <button class="premium-button-lg" onclick="window.navigateToSubscription()">
                <i class="fas fa-crown"></i> Buka Tak Terbatas (Premium)
            </button>
            <button class="back-button-lg" onclick="window.loadView('home')">
                Kembali ke Beranda
            </button>
        </div>
    `;
    promptContainer.innerHTML = html;
}

function renderPremiumWall() {
    // Sembunyikan dictation container, tampilkan prompt
    dictationContainer.classList.add('hidden');
    promptContainer.classList.remove('hidden');
    appContent.appendChild(promptContainer);
    
    let html = `
        <h2>⚠️ Tantangan Selesai Hari Ini</h2>
        <p>Anda telah menggunakan semua nyawa harian dan kesempatan menonton iklan.</p>
        <p class="mb-3">Akses tantangan tanpa batas sekarang juga!</p>
        <div class="prompt-actions">
            <button class="premium-button-lg" onclick="window.navigateToSubscription()">
                <i class="fas fa-crown"></i> Buka Tak Terbatas (Premium)
            </button>
            <button class="back-button-lg" onclick="window.loadView('home')">
                Kembali ke Beranda (Tunggu Sampai Besok)
            </button>
        </div>
    `;
    promptContainer.innerHTML = html;
}

window.handleAdRestore = function() {
    alert("Simulasi Iklan diputar selama 3 detik. Jangan klik apa-apa!");
    
    // Ganti button menjadi loading
    const adBtn = document.querySelector('.ad-button');
    if (adBtn) {
        adBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Loading...';
        adBtn.disabled = true;
    }
    
    setTimeout(() => {
        const result = restoreDictationLivesByAd();
        if (result.success) {
            alert(`Sukses! ${result.message}`);
            loadDictationChallenge(); // Lanjutkan tantangan
        } else {
            alert(`Gagal: ${result.message}`);
            loadDictationChallenge(); // Cek lagi status (yang seharusnya memicu Premium Wall)
        }
    }, 3000);
};

// --- Fungsi Placeholder Tenses Transformer (Wajib ada karena dipanggil di renderTensesTransformerView)
window.handleVerbFormCheck = function() {
    const verb = document.getElementById('verb-check-input').value.trim();
    const resultBox = document.getElementById('verb-check-result');
    if (verb) {
        const forms = checkVerbForms(verb); // Dari tenses_logic
        let html = `<p class="alert-success">V1: <strong>${forms.V1}</strong></p>`;
        html += `<p class="alert-success">V2: <strong>${forms.V2}</strong></p>`;
        html += `<p class="alert-success">V3: <strong>${forms.V3}</strong></p>`;
        resultBox.innerHTML = html;
    } else {
         resultBox.innerHTML = '<p class="alert-info">Masukkan kata kerja dasar.</p>';
    }
};

window.checkTensesTransformerInputs = function() {
    // ASUMSI: Logika check evaluasi ada di sini
    alert('Placeholder: Cek Evaluasi Kalimat (TBD)');
};

function initTensesTransformerView() {
    // Menginisialisasi event listener dan tampilan awal Tenses Transformer
    const tensesSelect = document.getElementById('tenses-select');
    const subjectInput = document.getElementById('subject-input');

    if (tensesSelect && subjectInput) {
        // Panggil fungsi display update awal
        updateTensesTransformerDisplay();
        
        // Tambahkan listeners
        tensesSelect.addEventListener('change', updateTensesTransformerDisplay);
        subjectInput.addEventListener('change', updateTensesTransformerDisplay);
        document.getElementById('verb-input')?.addEventListener('input', updateTensesTransformerDisplay);
        document.getElementById('object-input')?.addEventListener('input', updateTensesTransformerDisplay);
        document.getElementById('complement-input')?.addEventListener('input', updateTensesTransformerDisplay);
    }
}

function updateTensesTransformerDisplay() {
    const tensesId = document.getElementById('tenses-select').value;
    const subject = document.getElementById('subject-input').value;
    const verb = document.getElementById('verb-input')?.value || DEFAULT_V1;
    const object = document.getElementById('object-input')?.value || DEFAULT_OBJECT;
    const complement = document.getElementById('complement-input')?.value || DEFAULT_COMPLEMENT;
    
    // Render Materi Tenses
    document.getElementById('tenses-material-container').innerHTML = getTensesMaterial(tensesId);
    
    // Render Kalimat Referensi
    const sentences = generateReferenceSentence(tensesId, subject, verb, object, complement);
    let html = `
        <p class="reference-item correct">(+) ${sentences.positive}</p>
        <p class="reference-item incorrect">(-) ${sentences.negative}</p>
        <p class="reference-item info">(?) ${sentences.interrogative}</p>
    `;
    document.getElementById('tenses-output').innerHTML = html;
}
window.updateTensesTransformerDisplay = updateTensesTransformerDisplay;


// ====================================================================
// --- J. INISIALISASI ---
// ====================================================================

document.addEventListener('DOMContentLoaded', () => {
    // 1. Muat State Pengguna (XP, Level, Streak)
    loadUserState();
    
    // 2. Set listener untuk Dictation (Hanya agar elemen yang baru ada bisa dihubungkan)
    setupDictationListeners();
    
    // 3. Muat tampilan awal
    loadView('home'); 
});

// --- Export Fungsi Global (Jika dipanggil dari file HTML/modul lain) ---
window.getUserXp = getCurrentBintangIlmu; // Dipakai oleh Arena Logic

// ====================================================================
// --- F. LOGIKA MANAJEMEN APLIKASI UTAMA (LOADER & NAVIGASI) --- 
// (Asumsi data-data seperti TENSES_DATA, QUIZ_DATA, LESSON_PATH, dll., 
// sudah didefinisikan di file terpisah, e.g., data.js)
// ====================================================================

// Variabel Global untuk state aplikasi
window.currentViewId = 'home'; // Default view
window.userIsPremium = localStorage.getItem('isPremium') === 'true';
window.userMastery = JSON.parse(localStorage.getItem('userMastery')) || {};
window.userXP = parseInt(localStorage.getItem('userXP')) || 0;

/**
 * Menyimpan status user ke localStorage.
 */
function saveUserState() {
    localStorage.setItem('isPremium', window.userIsPremium);
    localStorage.setItem('userMastery', JSON.stringify(window.userMastery));
    localStorage.setItem('userXP', window.userXP.toString());
}

// ====================================================================
// --- FUNGSI BARU UNTUK MEMBATASI MASTERY (Mengatasi ReferenceError) ---
// ====================================================================
/**
 * Memastikan Mastery Points tidak melebihi batas maksimal modul.
 * @param {string} targetModuleId - ID modul yang baru saja diselesaikan.
 */
function enforceMaxMastery(targetModuleId) {
    // Cari modul di seluruh path
    const maxMastery = LESSON_PATH.flatMap(p => p.modules)
        .find(m => m.id === targetModuleId)?.maxMastery || 100;

    // Batasi Mastery
    if (window.userMastery[targetModuleId] > maxMastery) {
        window.userMastery[targetModuleId] = maxMastery;
    }
}
// ====================================================================

/**
 * Menampilkan notifikasi singkat.
 */
function showNotification(message) {
// ... (Sama persis dengan kode Anda) ...
}

// (Kode global yang tidak relevan dengan error, yang berada di antara showNotification dan G. LOGIKA LESSON PATH)
// Hapus baris ini:
/*
    // Batas 1x per hari jika tidak Premium
    const lastAttempt = localStorage.getItem(`lastReviewAttempt_${moduleId}`);
    const today = new Date().toDateString();

    // Hapus kelas aktif di navbar
    document.querySelectorAll('#bottom-nav button').forEach(btn => {
        btn.classList.remove('active');
    });
*/

// ====================================================================
// --- G. LOGIKA LESSON PATH & MODUL --- 
// ====================================================================

/**
 * Merender Tampilan Lesson Path (Home View).
 */
function renderLessonPathView() {
    const appContent = document.getElementById('app-content');
    let html = '<h2>🚀 Lesson Path: Mulai Belajar</h2>';

    LESSON_PATH.forEach(path => {
        const isLevelLocked = !path.gratis && !isUserPremium();
        const pathClass = isLevelLocked ? 'locked' : '';
        const levelMastery = calculateLevelMastery(path.id);

        html += `
            <div class="level-card ${pathClass}">
                <div class="level-header" onclick="${isLevelLocked ? `window.loadView('premium')` : ''}">
                    <h3>${path.name} ${isLevelLocked ? '💎' : ''}</h3>
                    <div class="mastery-progress">
                        <small>Penguasaan: ${levelMastery}%</small>
                        <div class="progress-bar-container"><div class="progress-bar" style="width: ${levelMastery}%;"></div></div>
                    </div>
                </div>
                
                <div class="module-list">
        `;

        path.modules.forEach(module => {
            const currentMastery = window.userMastery[module.id] || 0;
            const masteryPercentage = Math.round((currentMastery / module.maxMastery) * 100);
            const isModuleLocked = isLevelLocked || (!module.gratis && !isUserPremium());
            const moduleClass = isModuleLocked ? 'module-locked' : '';

            html += `
                <div class="module-item ${moduleClass}" onclick="${isModuleLocked ? `window.loadView('premium')` : `window.renderLessonModule('${module.id}')`}">
                    <div class="module-info">
                        <h4>${module.name} ${isModuleLocked ? '🔒' : '✅'}</h4>
                        <p>${module.description}</p>
                    </div>
                    <div class="mastery-status">
                        <small>Mastery: ${masteryPercentage}%</small>
                        <div class="progress-bar-container small-bar"><div class="progress-bar" style="width: ${masteryPercentage}%;"></div></div>
                    </div>
                </div>
            `;
        });

        html += `</div></div>`;
    });

    appContent.innerHTML = html;
}
window.renderLessonPathView = renderLessonPathView;

/**
 * Menghitung rata-rata Mastery dari semua modul dalam satu Level/Path.
 */
function calculateLevelMastery(pathId) {
    const path = LESSON_PATH.find(p => p.id === pathId);
    if (!path || path.modules.length === 0) return 0;

    let totalMastery = 0;
    let maxTotalMastery = 0;

    path.modules.forEach(module => {
        totalMastery += window.userMastery[module.id] || 0;
        maxTotalMastery += module.maxMastery;
    });

    if (maxTotalMastery === 0) return 0;

    return Math.round((totalMastery / maxTotalMastery) * 100);
}

    const currentMastery = window.userMastery[moduleId] || 0;
    const masteryPercentage = Math.round((currentMastery / module.maxMastery) * 100);

    let contentListHtml = '';

    // 1. Tenses Info/Tenses Evaluator
    if (module.tensesFocus && module.tensesFocus.length > 0) {
        module.tensesFocus.forEach(tId => {
            const tenses = TENSES_DATA.find(t => t.id === tId);
            if (tenses) {
                const isLocked = !tenses.gratis && !isUserPremium();
                const icon = isLocked ? '🔒' : 'ℹ️';
                const action = `window.loadModuleContent('${moduleId}', '${tId}')`;
                
                contentListHtml += `
                    <div class="content-item ${isLocked ? 'locked' : ''}" onclick="${action}">
                        ${icon} <strong>Tenses Evaluator:</strong> ${tenses.name} 
                    </div>
                `;
            }
        });
    }

    // 2. Quiz Review/Ujian
    if (QUIZ_DATA[moduleId]) {
        const action = `window.loadModuleContent('${moduleId}', 'REVIEW')`;
        contentListHtml += `
            <div class="content-item content-quiz" onclick="${action}">
                📝 **Ujian Review Modul** (75% Kelulusan)
            </div>
        `;
    }

    // 3. Reading Comprehension
    if (READING_DATA[moduleId] && READING_DATA[moduleId].length > 0) {
        const action = `window.loadModuleContent('${moduleId}', 'READING_COMPREHENSION')`;
        contentListHtml += `
            <div class="content-item content-reading" onclick="${action}">
                📚 **Pemahaman Bacaan**
            </div>
        `;
    }

// ====================================================================
// --- H. LOGIKA TENSES & TOOLS VIEW --- 
// ====================================================================

/**
 * Merender tampilan utama Tools.
 */
function renderToolsView() {
    const appContent = document.getElementById('app-content');
    
    // Siapkan opsi Tenses untuk dropdown
    const tensesOptions = TENSES_DATA.map(t => 
        `<option value="${t.id}" ${!t.gratis && !isUserPremium() ? 'disabled' : ''}>
            ${t.name} ${!t.gratis ? '💎 Premium' : ''}
        </option>`
    ).join('');

    appContent.innerHTML = `
        <div class="tools-view p-4 mx-auto" style="max-width: 900px;">
            <h2>🛠️ Tenses Evaluator & Transformer</h2>
            <p class="text-muted">Latih dan evaluasi kemampuan Anda membuat kalimat dalam berbagai Tenses.</p>
            
            <div class="section-card">
                <h3>1. Input Utama Kalimat</h3>
                <div class="row">
                    <div class="col-md-4 mb-3">
                        <label for="tenses-select">Pilih Tenses:</label>
                        <select id="tenses-select" class="form-control">${tensesOptions}</select>
                    </div>
                    <div class="col-md-4 mb-3">
                        <label for="subject-input">Subjek (Pronoun):</label>
                        <input type="text" id="subject-input" class="form-control" placeholder="Contoh: I, She, They">
                    </div>
                    <div class="col-md-4 mb-3">
                        <label for="verb-input">Kata Kerja Dasar (V1):</label>
                        <input type="text" id="verb-input" class="form-control" placeholder="Contoh: study, eat">
                    </div>
                </div>
                <div class="row">
                    <div class="col-md-6 mb-3">
                        <label for="object-input">Objek (Opsional):</label>
                        <input type="text" id="object-input" class="form-control" placeholder="Contoh: a book, the meal">
                    </div>
                    <div class="col-md-6 mb-3">
                        <label for="complement-input">Komplemen/Keterangan (Opsional):</label>
                        <input type="text" id="complement-input" class="form-control" placeholder="Contoh: now, yesterday">
                    </div>
                </div>
            </div>

            <div id="tenses-material-container" class="section-card mt-4">
                </div>

            <div id="tenses-output" class="section-card mt-4">
                <p class="alert-info">Masukkan data di atas untuk melihat transformasi kalimat.</p>
            </div>
            
            <div class="section-card mt-4">
                <h3>2. Evaluasi Kalimat Anda</h3>
                <p class="text-muted">Coba buat kalimat yang sama tanpa melihat referensi di atas, lalu cek.</p>
                
                <div class="form-group mb-3">
                    <label>Kalimat Positif (+):</label>
                    <input type="text" id="input-positive" class="form-control" placeholder="Tulis kalimat positif Anda...">
                    <div id="feedback-positive" class="feedback-area"></div>
                </div>
                <div class="form-group mb-3">
                    <label>Kalimat Negatif (-):</label>
                    <input type="text" id="input-negative" class="form-control" placeholder="Tulis kalimat negatif Anda...">
                    <div id="feedback-negative" class="feedback-area"></div>
                </div>
                <div class="form-group mb-3">
                    <label>Kalimat Interogatif (?):</label>
                    <input type="text" id="input-interrogative" class="form-control" placeholder="Tulis kalimat interogatif Anda...">
                    <div id="feedback-interrogative" class="feedback-area"></div>
                </div>

                <button class="primary-btn btn-block mt-3" onclick="window.checkTensesTransformerInputs()">Cek & Evaluasi Kalimat</button>
                <div id="tenses-result" style="display: none;" class="mt-3"></div>
            </div>
            
            <div class="section-card mt-4">
                <h3>3. Verb Forms Checker (V1, V2, V3)</h3>
                <p class="text-muted">Cek bentuk kata kerja (terutama Irregular Verbs).</p>
                <div class="input-group">
                    <input type="text" id="verb-check-input" class="form-control" placeholder="Masukkan V1, contoh: go">
                    <div class="input-group-append">
                        <button class="btn btn-secondary" type="button" onclick="window.handleVerbFormCheck()">Cek Bentuk</button>
                    </div>
                </div>
                <div id="verb-check-result" class="mt-3"></div>
            </div>
        </div>
    `;
}
window.renderToolsView = renderToolsView;


// ====================================================================
// --- I. LOGIKA PEMUATAN KONTEN MODUL --- 
// ====================================================================

/**
 * Memuat konten spesifik modul (Tenses info, Quiz, Reading, atau Arena Latihan).
 */
function loadModuleContent(moduleId, contentType) {
    const appContent = document.getElementById('app-content');
    
    // 1. Logika Tenses Evaluator (diarahkan ke halaman Tools)
    const tenses = TENSES_DATA.find(t => t.id === contentType);
    if (tenses) {
        if (!tenses.gratis && !isUserPremium()) {
             showPremiumWall(
                 '🔓 Tenses Lanjutan Terkunci',
                 `Tenses "${tenses.name}" adalah konten eksklusif Premium. Tingkatkan langganan Anda untuk membuka semua 20 Tenses!`,
                 'tenses_premium'
             );
             return;
        }

        loadView('tools');
        
        // Pilihan Tenses dan set nilai default
        setTimeout(() => {
            const tensesSelect = document.getElementById('tenses-select');
            if (tensesSelect) {
                tensesSelect.value = contentType;
                // Update input fields with defaults
                document.getElementById('subject-input').value = 'I';
                document.getElementById('verb-input').value = 'study';
                // Trigger output update
                updateTensesOutput(); 
            }
        }, 100);
        return;
    }
    
    // 2. Logika Pemuatan Ujian Review (QUIZ)
    if (contentType === 'REVIEW') {
        if (!handleReviewQuizAttempt(moduleId)) {
            return;
        }

        if (QUIZ_DATA[moduleId]) {
            currentQuizData = QUIZ_DATA[moduleId];
            currentQuizModuleId = moduleId;
            currentQuizScore = 0;
            currentQuizIndex = 0;
            renderQuizStartScreen(moduleId); 
        } else {
            appContent.innerHTML = `<div class="alert alert-warning">❌ Data Ujian untuk modul ${moduleId} belum tersedia.</div>`;
        }
        return;
    }
    
    // 3. Logika Pemuatan Reading Comprehension
    if (contentType === 'READING_COMPREHENSION') {
        const readingOptions = READING_DATA[moduleId]; 
        if (readingOptions && readingOptions.length > 0) {
            const randomIndex = Math.floor(Math.random() * readingOptions.length);
            const selectedReadingData = readingOptions[randomIndex];

            currentReadingModuleId = moduleId;
            currentReadingQuestions = selectedReadingData.questions; 
            readingIndex = 0;
            readingScore = 0;
            
            renderReadingStartScreen(selectedReadingData); 
        } else {
            appContent.innerHTML = `<div class="alert alert-warning">❌ Data Bacaan untuk modul ${moduleId} belum tersedia.</div>`;
        }
        return;
    }
    
    // 4. Jika konten adalah tipe Arena Latihan
    const arenaTypes = ['SENTENCE_BUILDER', 'IDIOM', 'DICTATION', 'TRANSLATION', 'PRONUNCIATION'];
    if (arenaTypes.includes(contentType.toUpperCase())) {
        // loadArenaExercise() diasumsikan ada di file lain atau harus diimplementasi
        // loadArenaExercise(contentType.toUpperCase(), 'app-content');
        appContent.innerHTML = `<div class="alert alert-info">Arena Latihan ${contentType.toUpperCase()} belum diimplementasi.</div>`;
        return;
    }
    
    // 5. Jika konten tidak dikenal
    appContent.innerHTML = `<p class="feedback-wrong">Tipe konten (${contentType}) tidak didukung.</p>`;
}
window.loadModuleContent = loadModuleContent; 


// ====================================================================
// --- J. LOGIKA UJIAN QUIZ (REVIEW) --- 
// ====================================================================

function renderQuizStartScreen(moduleId) {
    const appContent = document.getElementById('app-content');
    const module = LESSON_PATH.flatMap(p => p.modules).find(m => m.id === moduleId);

    if (!module) return;
    const requiredScore = Math.round(currentQuizData.length * 0.75);

    appContent.innerHTML = `
        <div class="card p-4 mx-auto" style="max-width: 600px;">
            <h3 class="text-center">${module.name}</h3>
            <p class="text-center text-muted">Ujian Penguasaan Level</p>
            <hr>
            <p>Ujian ini terdiri dari **${currentQuizData.length}** soal.</p>
            <p class="font-weight-bold text-success">Target Kelulusan: ${requiredScore} jawaban benar (75%).</p>
            <button class="primary-btn mt-3" onclick="window.startQuiz()">Mulai Ujian</button>
            <button class="btn btn-secondary mt-2" onclick="window.goToHomePage()">Kembali</button>
        </div>
    `;
}
window.renderQuizStartScreen = renderQuizStartScreen;


function startQuiz() {
    const today = new Date().toDateString();
    localStorage.setItem(`lastReviewAttempt_${currentQuizModuleId}`, today);

    // Acak data soal
    currentQuizData.sort(() => Math.random() - 0.5); 
    currentQuizScore = 0;
    currentQuizIndex = 0;
    renderQuizQuestion(currentQuizIndex);
}
window.startQuiz = startQuiz;


function renderQuizQuestion(index) {
    const appContent = document.getElementById('app-content');
    if (index >= currentQuizData.length) {
        renderQuizResult();
        return;
    }

    const question = currentQuizData[index];
    let questionHtml = '';
    
    // Hanya implementasi untuk MULTIPLE_CHOICE_TENSES untuk saat ini
    if (question.type === 'MULTIPLE_CHOICE_TENSES') {
        // Shuffle options just in case they are always in the same order
        const shuffledOptions = [...question.options].sort(() => Math.random() - 0.5); 
        const optionsHtml = shuffledOptions.map((opt, i) => `
            <button class="btn btn-block btn-quiz-option mt-2" data-answer="${opt.replace(/"/g, '&quot;')}" onclick="window.checkQuizAnswer(${index}, this.getAttribute('data-answer'))">${opt}</button>
        `).join('');
        
        questionHtml = `
            <div class="question-container">
                <p class="question-text">${question.question}</p>
                <div class="options-list">${optionsHtml}</div>
            </div>
        `;
    } else {
        questionHtml = `<p class="alert alert-info">Tipe soal **${question.type}** belum diimplementasi. Target: **${question.target || question.q || '??'}**</p>`;
    }
    
    appContent.innerHTML = `
        <div class="quiz-view p-4 mx-auto" style="max-width: 600px;">
            <p class="text-right text-muted">Soal ${index + 1} dari ${currentQuizData.length}</p>
            <div class="progress-bar-container mb-3"><div class="progress-bar" style="width: ${((index + 1) / currentQuizData.length) * 100}%;"></div></div>
            
            ${questionHtml || '<p class="alert alert-danger">Tipe soal belum diimplementasi!</p>'}
            
            <div id="quiz-feedback" class="mt-3"></div>
            <p class="mt-4"><small>Petunjuk: ${question.hint || 'Pilih jawaban terbaik untuk melengkapi/merespon kalimat.'}</small></p>
        </div>
    `;
}
window.renderQuizQuestion = renderQuizQuestion;


function checkQuizAnswer(index, userAnswer) {
    if (currentQuizTimeout) return;
    
    const question = currentQuizData[index];
    const feedbackArea = document.getElementById('quiz-feedback');
    let isCorrect = false;

    // Periksa jawaban
    if (userAnswer.toLowerCase().trim() === question.answer.toLowerCase().trim()) {
        isCorrect = true;
    } 
    
    // Visual feedback
    document.querySelectorAll('.btn-quiz-option').forEach(btn => {
        btn.disabled = true;
        if (btn.getAttribute('data-answer').toLowerCase().trim() === question.answer.toLowerCase().trim()) {
            btn.classList.add('btn-success');
        } else if (btn.getAttribute('data-answer').toLowerCase().trim() === userAnswer.toLowerCase().trim()) {
            btn.classList.add('btn-danger');
        }
    });

    if (isCorrect) {
        currentQuizScore++;
        feedbackArea.innerHTML = `<div class="alert alert-success">✅ Benar!</div>`;
    } else {
        feedbackArea.innerHTML = `<div class="alert alert-danger">❌ Salah. Jawaban yang benar: <strong>${question.answer}</strong>.</div>`;
    }

    currentQuizTimeout = setTimeout(() => {
        currentQuizIndex++;
        currentQuizTimeout = null;
        renderQuizQuestion(currentQuizIndex);
    }, 1500); 
}
window.checkQuizAnswer = checkQuizAnswer;


function renderQuizResult() {
    const appContent = document.getElementById('app-content');
    const totalQuestions = currentQuizData.length;
    const requiredScore = Math.round(totalQuestions * 0.75);
    const passed = currentQuizScore >= requiredScore;

    let resultHtml;
    let starsGained = 0;
    let masteryGained = 0;

    if (passed) {
        starsGained = currentQuizScore * GAMIFICATION_CONFIG.STARS_PER_CORRECT_ANSWER;
        // Ambil maxMastery dari modul, atau default 50 jika tidak ditemukan.
        masteryGained = LESSON_PATH.flatMap(p => p.modules).find(m => m.id === currentQuizModuleId)?.maxMastery || 50; 

        addXP(starsGained);
        addMastery(currentQuizModuleId, masteryGained); 

        resultHtml = `
            <h3 class="text-success text-center">🏆 Ujian Lulus! Level Up!</h3>
            <p>Anda mencapai target penguasaan ${requiredScore} soal. Modul ini telah Dikuasai!</p>
            <p>🌟 Bintang Ilmu Diterima: **+${starsGained}**</p>
            <p>👑 Mastery Points Diterima: **+${masteryGained}**</p>
        `;
    } else {
        resultHtml = `
            <h3 class="text-danger text-center">😔 Gagal Menguasai</h3>
            <p>Anda hanya menjawab ${currentQuizScore} dari ${totalQuestions} soal dengan benar. Anda membutuhkan minimal **${requiredScore}** untuk lulus.</p>
            <p>Silakan ulangi modul-modul A1 untuk meningkatkan penguasaan Anda.</p>
        `;
    }

    appContent.innerHTML = `
        <div class="card p-4 mx-auto mt-5" style="max-width: 600px;">
            <p class="text-center font-weight-bold">Hasil Akhir Ujian</p>
            <h1 class="text-center">${currentQuizScore} / ${totalQuestions}</h1>
            <hr>
            ${resultHtml}
            <button class="primary-btn mt-4" onclick="window.goToHomePage()">Lanjut ke Lesson Path</button>
            ${!passed ? `<button class="btn btn-secondary mt-2" onclick="window.startQuiz()">Ulangi Ujian</button>` : ''}
        </div>
    `;
}
window.renderQuizResult = renderQuizResult;


// ====================================================================
// --- K. LOGIKA READING COMPREHENSION --- 
// ====================================================================

function renderReadingStartScreen(readingInfo) {
    const appContent = document.getElementById('app-content');

    appContent.innerHTML = `
        <div class="card p-4 mx-auto" style="max-width: 800px;">
            <h3 class="text-center">📚 ${readingInfo.title}</h3>
            <p class="text-center text-muted">Fokus Tenses: ${readingInfo.tensesFocus}</p>
            <hr>
            
            <div class="reading-text p-3 bg-light rounded mb-4" style="white-space: pre-wrap; font-family: Georgia, serif;">
                ${readingInfo.text}
            </div>
            
            <p>Setelah membaca, Anda akan menjawab **${readingInfo.questions.length} soal** pilihan ganda. Dapatkan skor sempurna untuk mendapatkan bonus Mastery!</p>
            
            <button class="primary-btn mt-3" onclick="window.startReadingQuiz()">Mulai Soal Pemahaman</button>
            <button class="btn btn-secondary mt-2" onclick="window.goToHomePage()">Kembali</button>
        </div>
    `;
}
window.renderReadingStartScreen = renderReadingStartScreen;


function startReadingQuiz() {
    readingIndex = 0;
    readingScore = 0;
    renderReadingQuestion(readingIndex);
}
window.startReadingQuiz = startReadingQuiz;


function renderReadingQuestion(index) {
    const appContent = document.getElementById('app-content');
    
    // Cari teks bacaan yang relevan
    const readingModuleBank = READING_DATA[currentReadingModuleId];
    // Asumsi currentReadingQuestions hanya dari satu teks yang dipilih di loadModuleContent
    // Cari teks yang memiliki set pertanyaan yang sama
    const currentReadingText = readingModuleBank.find(r => r.questions === currentReadingQuestions)?.text || "Teks Bacaan Tidak Ditemukan.";

    if (index >= currentReadingQuestions.length) {
        renderReadingResult();
        return;
    }

    const question = currentReadingQuestions[index];
    const optionsHtml = question.options.map((opt, i) => `
        <button class="btn btn-block btn-quiz-option mt-2" data-answer="${opt.replace(/"/g, '&quot;')}" onclick="window.checkReadingAnswer(${index}, this.getAttribute('data-answer'))">${opt}</button>
    `).join('');

    appContent.innerHTML = `
        <div class="quiz-view p-4 mx-auto" style="max-width: 600px;">
            <p class="text-right text-muted">Soal ${index + 1} dari ${currentReadingQuestions.length}</p>
            <div class="progress-bar-container mb-3"><div class="progress-bar" style="width: ${((index + 1) / currentReadingQuestions.length) * 100}%;"></div></div>
            
            <div class="question-container">
                <p class="question-text font-weight-bold">${question.q}</p>
                <div class="options-list">${optionsHtml}</div>
            </div>
            
            <div id="reading-feedback" class="mt-3"></div>
            <button id="reading-next-btn" class="btn btn-secondary mt-3" disabled onclick="window.nextReadingQuestion()">Lanjut &raquo;</button>

            <button class="btn btn-link mt-4" type="button" data-toggle="collapse" data-target="#collapseText" aria-expanded="false" aria-controls="collapseText">
                Tampilkan Teks Bacaan
            </button>
            <div class="collapse" id="collapseText">
                <div class="card card-body bg-light small" style="white-space: pre-wrap;">
                    ${currentReadingText} 
                </div>
            </div>
        </div>
    `;
}
window.renderReadingQuestion = renderReadingQuestion;


function checkReadingAnswer(index, userAnswer) {
    if (readingTimeout) return;

    const question = currentReadingQuestions[index];
    const feedbackArea = document.getElementById('reading-feedback');
    const nextBtn = document.getElementById('reading-next-btn');
    
    document.querySelectorAll('.btn-quiz-option').forEach(btn => btn.disabled = true);

    let isCorrect = (userAnswer.toLowerCase().trim() === question.answer.toLowerCase().trim());
    
    document.querySelectorAll('.btn-quiz-option').forEach(btn => {
        if (btn.getAttribute('data-answer').toLowerCase().trim() === question.answer.toLowerCase().trim()) {
            btn.classList.add('btn-success');
        } else if (btn.getAttribute('data-answer').toLowerCase().trim() === userAnswer.toLowerCase().trim()) {
            btn.classList.add('btn-danger');
        }
    });

    if (isCorrect) {
        readingScore++;
        feedbackArea.innerHTML = `<div class="alert alert-success">✅ Benar!</div>`;
    } else {
        feedbackArea.innerHTML = `
            <div class="alert alert-danger">
                ❌ Salah. Jawaban: <strong>${question.answer}</strong>.
                <p class="mt-2 mb-0">Pembahasan: ${question.explanation || 'Pembahasan tidak tersedia.'}</p>
            </div>
        `;
    }
    
    nextBtn.disabled = false;
    nextBtn.classList.remove('btn-secondary');
    nextBtn.classList.add('primary-btn');
    
    // Dummy timeout agar tombol Next bisa diklik setelah feedback muncul
    // Ini adalah cara untuk mencegah user mengklik terlalu cepat, meskipun tombol sudah di-disable
    readingTimeout = setTimeout(() => {
        readingTimeout = null;
    }, 500); 
}
window.checkReadingAnswer = checkReadingAnswer;


function nextReadingQuestion() {
    readingIndex++;
    renderReadingQuestion(readingIndex);
}
window.nextReadingQuestion = nextReadingQuestion;


function renderReadingResult() {
    const appContent = document.getElementById('app-content');
    const totalQuestions = currentReadingQuestions.length;
    const moduleId = currentReadingModuleId;
    
    // Perhitungan Mastery: Skor/Total * 50 (Mastery Base)
    let masteryGained = Math.round((readingScore / totalQuestions) * 50); 
    if (readingScore === totalQuestions) {
        masteryGained += 25; // Bonus jika skor sempurna
    }

    // Stars Gained: Misal 1 star per 2 mastery point
    const starsGained = Math.round(masteryGained * GAMIFICATION_CONFIG.STARS_PER_CORRECT_ANSWER / 2);

    addMastery(moduleId, masteryGained);
    addXP(starsGained); 

    appContent.innerHTML = `
        <div class="card p-4 mx-auto mt-5" style="max-width: 600px;">
            <p class="text-center font-weight-bold">Hasil Pemahaman Bacaan</p>
            <h1 class="text-center">${readingScore} / ${totalQuestions}</h1>
            <hr>
            <h3 class="text-center text-info">Penguasaan Ditingkatkan!</h3>
            <p>👑 Mastery Points Diterima: **+${masteryGained}**</p>
            <p>🌟 Bintang Ilmu Diterima: **+${starsGained}**</p>
            <p>Nilai: ${Math.round(readingScore / totalQuestions * 100)}%</p>
            <button class="primary-btn mt-4" onclick="window.goToHomePage()">Kembali ke Lesson Path</button>
        </div>
    `;
}
window.renderReadingResult = renderReadingResult;


// ====================================================================
// --- L. FUNGSI TENSES TRANSFORMER (ALAT) - Versi Gabungan ---
// ====================================================================

/**
 * Merender materi tenses (fungsi dari Tahap 1, dipanggil di updateTensesOutput)
 */
function renderTensesMaterial(tensesId) {
    // getTensesMaterial diasumsikan tersedia
    const material = getTensesMaterial(tensesId);
    const container = document.getElementById('tenses-material-container');
    
    if (container && material) {
        container.innerHTML = `
            <div class="material-box">
                <h3>${material.name}</h3>
                <div class="formula-group">
                    <p><strong>(+) Positif:</strong> <code>${material.formula_pos}</code></p>
                    <p><strong>(-) Negatif:</strong> <code>${material.formula_neg}</code></p>
                    <p><strong>(?) Interrogatif:</strong> <code>${material.formula_int}</code></p>
                </div>
                
                <div class="material-content">
                    <h4>Fungsi Utama:</h4>
                    <ul>${material.fungsi.map(f => `<li>${f}</li>`).join('')}</ul>
                    <h4>Penggunaan Umum:</h4>
                    <ul>${material.penggunaan.map(p => `<li>${p}</li>`).join('')}</ul>
                    <h4>Keterangan Waktu (Adverb):</h4>
                    <p>${material.keterangan_waktu.join(', ')}</p>
                </div>
            </div>
        `;
    } else if (container) {
        container.innerHTML = '<p class="alert-info">Materi tenses tidak tersedia.</p>';
    }
}

/**
 * Mengupdate output kalimat (fungsi dari Tahap 1, direvisi)
 */
function updateTensesOutput() {
    // --- 1. Deklarasi Variabel Scope (PENTING untuk error handling) ---
    const outputContainer = document.getElementById('tenses-output');
    if (!outputContainer) return; // Hentikan jika container tidak ada

    // Pastikan semua nilai yang diambil selalu menjadi string yang bersih
    const tensesId = document.getElementById('tenses-select')?.value || '';
    const pronoun = document.getElementById('subject-input')?.value.trim() || ''; 
    const v1 = document.getElementById('verb-input')?.value.trim() || DEFAULT_V1;
    const object = document.getElementById('object-input')?.value.trim() || DEFAULT_OBJECT;
    const complement = document.getElementById('complement-input')?.value.trim() || DEFAULT_COMPLEMENT;

    // Cek apakah input minimal sudah ada
    if (!tensesId || !pronoun) {
        outputContainer.innerHTML = '<p class="alert-info">Pilih Tenses dan Subjek untuk memulai transformasi.</p>';
        return;
    }

    // 2. Menampilkan Materi Tenses
    renderTensesMaterial(tensesId);

    // getTensesInfo diasumsikan tersedia
    const tensesInfo = getTensesInfo(tensesId);
    
    // 3. Peringatan V1 (Opsional, sudah dihandle di rendering hasil)

    try {
        // 4. Panggil Fungsi Generator (generateReferenceSentence diasumsikan tersedia)
        const result = generateReferenceSentence(tensesId, pronoun, v1, object, complement);
        
        // 5. RENDERING HASIL
        outputContainer.innerHTML = `
            ${tensesInfo?.type === 'verbal' && v1 === DEFAULT_V1 ? 
                '<p class="alert-warning">Masukkan Kata Kerja Dasar (V1) untuk menghasilkan kalimat Verbal. Menggunakan default: ' + DEFAULT_V1 + '</p>' : ''}
                
            <div class="output-sentences">
                <h4>Hasil Transformasi Kalimat</h4>
                <p class="positive-sentence"><strong>(+) Positif:</strong> ${result.positive}</p>
                <p class="negative-sentence"><strong>(-) Negatif:</strong> ${result.negative}</p>
                <p class="interrogative-sentence"><strong>(?) Interrogatif:</strong> ${result.interrogative}</p>
                <p class="structure-info"><strong>Struktur yang Dihasilkan:</strong> ${result.expectedStructure || 'N/A'}</p>
            </div>
        `;
        
        // 6. Update Input Checker (untuk memudahkan pengguna menyalin/membandingkan)
        // Note: Ini dilakukan agar user bisa langsung 'Check' tanpa harus mengetik ulang
        document.getElementById('input-positive').value = result.positive;
        document.getElementById('input-negative').value = result.negative;
        document.getElementById('input-interrogative').value = result.interrogative;
        
    } catch (error) {
        // Blok catch untuk menangkap error dari generateReferenceSentence
        outputContainer.innerHTML = `<p class="alert-error">Error dalam menghasilkan kalimat: ${error.message}</p>`;
        console.error(error);
    }
}
window.updateTensesOutput = updateTensesOutput;

/**
 * Mengecek input kalimat pengguna 
 */
function checkTensesTransformerInputs() {
    const tensesId = document.getElementById('tenses-select').value;
    const subject = document.getElementById('subject-input').value;
    const verb = document.getElementById('verb-input').value.trim();

    // getTensesInfo diasumsikan tersedia
    const tensesInfo = getTensesInfo(tensesId);
    
    // Validasi
    if (!tensesInfo) {
        document.getElementById('feedback-positive').innerHTML = `<p class="feedback-wrong">Silakan pilih Tenses.</p>`;
        return;
    }
    if (!tensesInfo.gratis && !window.userIsPremium) {
        showPremiumWall(
            '🔓 Tenses Terkunci', 
            `Anda harus berlangganan Premium untuk menggunakan Tenses Evaluator bagi tenses: ${tensesInfo.name}.`,
            'tenses_tool_usage'
        );
        return;
    }
    // Asumsi: Kalimat verbal selalu butuh V1 untuk dievaluasi
    if (!verb && tensesInfo.type === 'verbal') { 
        document.getElementById('feedback-positive').innerHTML = `<p class="feedback-wrong">Masukkan kata kerja dasar (V1).</p>`;
        return;
    }

    const types = ['positive', 'negative', 'interrogative'];
    let allCorrect = true;
    
    const starsPerAnswer = GAMIFICATION_CONFIG.STARS_PER_CORRECT_ANSWER || 10;
    let totalStars = 0;

    types.forEach(type => {
        const inputId = `input-${type}`;
        const feedbackId = `feedback-${type}`;
        const userInput = document.getElementById(inputId).value;
        const resultDiv = document.getElementById(feedbackId);
        
        // evaluateUserSentence diasumsikan tersedia
        const result = evaluateUserSentence(tensesId, subject, verb, userInput, type); 
        
        let html = '';
        if (result.correct) {
            html = `<span class="feedback-correct">✅ ${result.message}</span>`;
            totalStars += starsPerAnswer;
        } else {
            allCorrect = false;
            html = `
                <span class="feedback-wrong">❌ ${result.message}</span>
                <p class="explanation-hint">Kalimat yang benar: <strong>${result.correct_sentence || 'Referensi tidak tersedia.'}</strong></p>
            `;
        }
        resultDiv.innerHTML = html;
    });

    if (allCorrect) {
        addXP(totalStars);
        document.getElementById('tenses-result').style.display = 'block';
        document.getElementById('tenses-result').innerHTML = `<h3 class="feedback-correct section-card">💯 Sempurna! Anda mendapatkan ${totalStars} Bintang Ilmu!</h3>`;
    } else {
        document.getElementById('tenses-result').style.display = 'none';
    }
}
window.checkTensesTransformerInputs = checkTensesTransformerInputs;


/**
 * Mengecek bentuk kata kerja
 */
function handleVerbFormCheck() {
    const verbInput = document.getElementById('verb-check-input').value.trim(); 
    const resultDiv = document.getElementById('verb-check-result');

    if (!verbInput) {
        resultDiv.innerHTML = '<span class="alert-warning">Masukkan kata kerja dasar (V1) untuk dicek.</span>';
        return;
    }
    
    // checkVerbForms diasumsikan tersedia
    const result = checkVerbForms(verbInput); 

    if (result.v1) {
        resultDiv.innerHTML = `
            ${result.message}
            <table class="tenses-table" style="margin-top: 10px;">
                <tr><th>V1 (Infinitive)</th><th>V2 (Past Simple)</th><th>V3 (Past Participle)</th></tr>
                <tr><td>${result.v1}</td><td>${result.v2}</td><td>${result.v3}</td></tr>
            </table>
        `;
    } else {
        resultDiv.innerHTML = `<span class="feedback-wrong">${result.message}</span>`;
    }
}
window.handleVerbFormCheck = handleVerbFormCheck;


// ====================================================================
// --- M. INTEGRASI STORY MODE & IAP --- 
// ====================================================================

function renderStoryModeView() {
    const appContent = document.getElementById('app-content');
    
    let storyListHtml = '';
    STORY_MODE_DATA.forEach(story => {
        const isLocked = !story.gratis && !isUserPremium();
        const action = isLocked 
            ? `showPremiumWall('🔓 Chapter Terkunci', 'Chapter ${story.id}: ${story.title} memerlukan Premium.', 'story_premium')`
            : `startStoryMode('${story.id}')`; // startStoryMode butuh ID (diasumsikan)
        
        storyListHtml += `<div class="story-card section-card ${isLocked ? 'locked' : ''}" onclick="${action}">
            <h4>${story.title} ${isLocked ? '💎' : ''}</h4>
            <p>${story.summary}</p>
        </div>`;
    });
    
    appContent.innerHTML = `
        <h2>📚 Story Mode: LinguaQuest Adventures</h2>
        <button class="secondary-btn back-button" onclick="window.loadView('home')">← Kembali ke Lesson Path</button>
        <div id="story-list" class="story-container">
            ${storyListHtml}
        </div>
    `;
    
    // Fungsi startStoryMode() diasumsikan ada di tempat lain
    // if (!storyListHtml && STORY_MODE_DATA.length > 0) startStoryMode(STORY_MODE_DATA[0].id); 
}
window.renderStoryModeView = renderStoryModeView;

function renderPremiumPage() {
    const appContent = document.getElementById('app-content');
    const status = window.userIsPremium ? 'ON' : 'OFF';
    appContent.innerHTML = `
        <div class="section-card premium-page-card">
            <h2>👑 LinguaQuest Premium</h2>
            <p>Buka potensi penuh Anda:</p>
            <ul>
                <li>✅ Nyawa (Heart) Arena Tak Terbatas</li>
                <li>✅ Akses ke Level B1 & B2 (Kurikulum Penuh)</li>
                <li>✅ Ujian Penguasaan Tanpa Batas Harian</li>
                <li>✅ Perbaikan Streak Gratis Selamanya</li>
                <li>✅ Semua 20 Tenses Terbuka di Evaluator</li>
            </ul>
            <button class="btn-premium btn-premium-lg" onclick="window.navigateToSubscription()">Beli Langganan Sekarang!</button>
            <button class="secondary-btn" onclick="window.loadView('home')">Kembali ke Lesson Path</button>
            <p style="margin-top: 20px;">
                <small>Debug: Untuk mengaktifkan/nonaktifkan Premium, klik: <button onclick="window.togglePremium()">Toggle Premium (${status})</button></small>
            </p>
        </div>
    `;
}
window.renderPremiumPage = renderPremiumPage;

function navigateToSubscription() {
    alert("Mengalihkan ke halaman berlangganan Premium...");
}
window.navigateToSubscription = navigateToSubscription;

function togglePremium() {
    const newStatus = !window.userIsPremium;
    localStorage.setItem('isPremium', newStatus ? 'true' : 'false');
    
    alert(`Status Premium: ${newStatus ? 'AKTIF' : 'NONAKTIF'}. Memuat ulang View.`);
    // Set status global
    window.userIsPremium = newStatus;
    loadView(window.currentViewId || 'home'); 
}
window.togglePremium = togglePremium;


// ====================================================================
// --- N. INISIALISASI APLIKASI & EXPORT KE GLOBAL WINDOW ---
// ====================================================================

document.addEventListener('DOMContentLoaded', () => {
    // Diasumsikan data.js sudah dimuat sebelum ini
    loadUserState();
    loadView('home');

    // Setup Event Listeners Navigasi
    document.querySelectorAll('#bottom-nav button').forEach(button => {
        button.addEventListener('click', () => {
            loadView(button.getAttribute('data-view'));
        });
    });
});

// --- Export fungsi utama yang dipanggil dari onclick di HTML ke window ---
// (Mengulang beberapa yang sudah ada untuk kepastian)
window.loadView = loadView;
window.goToHomePage = goToHomePage;
window.renderLessonModule = renderLessonModule; 
window.loadModuleContent = loadModuleContent; 
window.showPremiumWall = showPremiumWall;
window.saveUserState = saveUserState;
window.showNotification = showNotification;
window.renderLessonPathView = renderLessonPathView; // Sudah ada
window.calculateLevelMastery = calculateLevelMastery;
window.enforceMaxMastery = enforceMaxMastery; // EKSPOS FUNGSI BARU INI
window.loadArenaExercise = loadArenaExercise;

// Tenses Transformer Logic
window.checkTensesTransformerInputs = checkTensesTransformerInputs;
window.handleVerbFormCheck = handleVerbFormCheck; 
window.initTensesTransformerView = initTensesTransformerView;
window.updateTensesOutput = updateTensesOutput;

// Quiz Logic
window.startQuiz = startQuiz;
window.checkQuizAnswer = checkQuizAnswer;
window.renderQuizQuestion = renderQuizQuestion;

// Reading Logic
window.startReadingQuiz = startReadingQuiz;
window.checkReadingAnswer = checkReadingAnswer;
window.nextReadingQuestion = nextReadingQuestion;

// Premium/IAP
window.togglePremium = togglePremium;
window.navigateToSubscription = navigateToSubscription;

// Utility
window.addXP = addXP;
window.addMastery = addMastery;
window.isUserPremium = isUserPremium;

// CATATAN: Fungsi-fungsi yang diasumsikan berada di 'tenses_logic.js' atau 'data.js' 
// seperti getTensesMaterial, getTensesInfo, generateReferenceSentence, 
// evaluateUserSentence, checkVerbForms, dan semua variabel data (TENSES_DATA, QUIZ_DATA, dll.) 
// HARUS tersedia di file terpisah atau di atas kode ini agar aplikasi berfungsi.