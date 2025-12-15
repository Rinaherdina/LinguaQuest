// scripts/story_logic.js

// --- PERUBAHAN: Import STORY_MODE_DATA multi-chapter dan GAMIFICATION_CONFIG
import { STORY_MODE_DATA, GAMIFICATION_CONFIG } from './data.js'; 

// State global untuk melacak posisi cerita
let currentChapterId = STORY_MODE_DATA[0].id; // Default ke Chapter 1
let currentStoryStepIndex = 0; 
let currentChapterData = STORY_MODE_DATA[0].steps; // Data langkah Chapter 1

// ====================================================================
// --- A. UTAMA RENDERER DAN CONTROLLER ---
// ====================================================================

/**
 * Mereset indeks cerita dan memulai cerita dari awal (Dipanggil dari main.js).
 * @param {number} [chapterId] - ID Chapter yang akan dimuat (default ke Chapter pertama).
 */
function renderStoryMode(chapterId) {
    // Jika tidak ada ID yang diberikan, gunakan default/saat ini
    const targetChapter = chapterId ? STORY_MODE_DATA.find(c => c.id === chapterId) : STORY_MODE_DATA[0];
    
    if (!targetChapter) {
        document.getElementById('story-content').innerHTML = `<p class="feedback-wrong">Chapter tidak ditemukan.</p>`;
        return;
    }
    
    // Update State Global
    currentChapterId = targetChapter.id;
    currentChapterData = targetChapter.steps;
    currentStoryStepIndex = 0;

    // Cek IAP Wall di level Chapter (Jika chapter terkunci)
    if (!targetChapter.gratis && !window.userIsPremium) {
        renderIapWall(targetChapter.title);
        return;
    }

    loadCurrentStoryStep();
}

/**
 * Memuat dan merender langkah cerita saat ini.
 */
function loadCurrentStoryStep() {
    // Diasumsikan 'story-content' ada di template yang dimuat oleh loadView('story') di main.js
    const storyContentDiv = document.getElementById('story-content');
    if (!storyContentDiv) return;

    // Ambil data langkah cerita saat ini dari Chapter yang aktif
    const step = currentChapterData[currentStoryStepIndex];

    if (!step) {
        // Akhir dari Chapter saat ini
        renderChapterComplete();
        return;
    }

    let html = '';
    
    // --- Rendering Berdasarkan Tipe Langkah ---
    
    // 1. Tipe: TEXT (Narasi/Dialog)
    if (step.type === 'TEXT') {
        html = `
            <div class="story-step-text">
                <h3>${step.speaker}</h3>
                <div class="story-text">"${step.text}"</div>
            </div>
            <button class="btn-next" onclick="window.nextStoryStep(${step.nextId})">
                Lanjut ➡️
            </button>
        `;
    
    // 2. Tipe: TENSES_CHECK_EXERCISE (Soal Interaktif)
    } else if (step.type === 'TENSES_CHECK_EXERCISE') {
        // Asumsi: step.correctAnswer, step.nextId, step.tensesId, step.sentencePart, step.hint
        html = `
            <div class="section-card story-exercise">
                <h2>Cek Bahasa</h2>
                <h3>${step.tensesId.toUpperCase().replace('_', ' ')} Challenge</h3>
                <p>Isi bagian yang kosong untuk melanjutkan cerita:</p>
                
                <div class="target-sentence">
                    ${step.sentencePart.replace('___', '<input type="text" id="tenses-answer" placeholder="..." style="width: 120px; display: inline-block;">')}
                </div>
                
                <p class="demo-note">Petunjuk: ${step.hint}</p>
                
                <button class="primary-btn" onclick="window.checkTensesExercise('${step.correctAnswer}', ${step.nextId})">
                    Cek Jawaban
                </button>
                <div id="story-feedback" class="feedback-area"></div>
            </div>
        `;

    // 3. Tipe: IAP_WALL (Demo Selesai / Pagar Premium)
    } else if (step.type === 'IAP_WALL' && !window.userIsPremium) {
        renderIapWall(STORY_MODE_DATA.find(c => c.id === currentChapterId).title || "Chapter Ini");
        return;
    
    // Jika IAP_WALL tetapi user Premium, kita skip langkah ini dan langsung ke nextId jika ada
    } else if (step.type === 'IAP_WALL' && window.userIsPremium) {
        nextStoryStep(step.nextId);
        return;

    } else {
        html = `
            <div class="story-box">
                <p>Tipe langkah cerita tidak dikenali: ${step.type}</p>
                <button class="primary-btn" onclick="window.loadView('home')">Kembali ke Beranda</button>
            </div>
        `;
    }

    storyContentDiv.innerHTML = html;
}

/**
 * Merender halaman IAP Wall yang terpisah.
 */
function renderIapWall(chapterTitle) {
    const storyContentDiv = document.getElementById('story-content');
    storyContentDiv.innerHTML = `
        <div class="card iap-wall-story">
            <h2>🔒 ${chapterTitle} Terkunci</h2>
            <p>Kamu berhasil melewati gerbang! Untuk melanjutkan petualangan epik ke Chapter selanjutnya, kamu memerlukan LinguaQuest Premium.</p>
            <button class="btn-premium" onclick="window.navigateToSubscription()">
                Dapatkan Premium Sekarang!
            </button>
            <button class="secondary-btn" onclick="window.loadView('home')">
                Kembali ke Beranda
            </button>
        </div>
    `;
}

/**
 * Merender halaman penyelesaian Chapter.
 */
function renderChapterComplete() {
    const storyContentDiv = document.getElementById('story-content');
    
    // Tentukan ID Chapter berikutnya
    const currentChapterIndex = STORY_MODE_DATA.findIndex(c => c.id === currentChapterId);
    const nextChapter = STORY_MODE_DATA[currentChapterIndex + 1];

    // Tambahkan XP saat Chapter Selesai
    const xpReward = GAMIFICATION_CONFIG.XP_PER_STORY_COMPLETION || 50;
    window.addXP(xpReward);

    const nextChapterButton = nextChapter ? 
        `<button class="primary-btn" onclick="window.renderStoryMode(${nextChapter.id})">Lanjut ke ${nextChapter.title}</button>` :
        `<button class="primary-btn" onclick="window.loadView('home')">Kembali ke Lesson Path</button>`;

    storyContentDiv.innerHTML = `
        <h2>🎉 Chapter ${currentChapterId} Selesai! (+${xpReward} XP)</h2>
        <p>Anda mendapatkan <strong>${xpReward} XP</strong> dan sukses menyelesaikan misi ini. XP Anda saat ini adalah ${window.userState.xp}.</p>
        
        ${nextChapterButton}
        <button class="secondary-btn" onclick="window.loadView('learn')">Lanjut ke Arena Latihan</button>
    `;

    currentStoryStepIndex = 0; 
}


// ====================================================================
// --- B. LOGIKA INTERAKSI ---
// ====================================================================

/**
 * Mencari index langkah berdasarkan ID dalam Chapter yang sedang aktif.
 * @param {number} stepId - ID langkah cerita yang dicari.
 * @returns {number} Index langkah cerita, atau -1 jika tidak ditemukan.
 */
function findStepIndexById(stepId) {
    return currentChapterData.findIndex(step => step.id === stepId);
}

/**
 * Navigasi ke langkah cerita berikutnya menggunakan ID langkah (bukan indeks array).
 * @param {number} nextId - ID langkah cerita berikutnya (dari data.js).
 */
function nextStoryStep(nextId) {
    const nextIndex = findStepIndexById(nextId);

    if (nextIndex !== -1) {
        currentStoryStepIndex = nextIndex;
        loadCurrentStoryStep();
    } else {
        // Jika nextId tidak ditemukan, asumsikan ini adalah akhir chapter
        renderChapterComplete();
    }
}

/**
 * Memeriksa jawaban Tenses Exercise dalam Story Mode.
 * @param {string} targetAnswer - Jawaban yang benar.
 * @param {number} nextId - ID langkah cerita berikutnya jika benar.
 */
function checkTensesExercise(targetAnswer, nextId) {
    const userInput = document.getElementById('tenses-answer').value;
    const feedbackDiv = document.getElementById('story-feedback');
    const xpReward = GAMIFICATION_CONFIG.XP_PER_CORRECT_ANSWER || 10; // XP per jawaban benar

    if (!userInput.trim()) {
        feedbackDiv.innerHTML = `<span class="feedback-wrong">⚠️ Masukkan jawaban terlebih dahulu!</span>`;
        return;
    }

    // Normalisasi: trim dan lowercase untuk perbandingan yang fleksibel
    const normalizedTarget = targetAnswer.toLowerCase().trim();
    const normalizedUser = userInput.toLowerCase().trim();

    if (normalizedUser === normalizedTarget) {
        // --- BARU: Tambahkan XP ---
        window.addXP(xpReward);
        
        feedbackDiv.innerHTML = `<span class="feedback-correct">✅ Tepat! Kata sandi (tenses) diterima. Anda mendapatkan +${xpReward} XP!</span>`;
        
        // Nonaktifkan tombol untuk mencegah klik ganda
        document.querySelector('.primary-btn').disabled = true;
        document.getElementById('tenses-answer').disabled = true;

        // Lanjutkan ke langkah berikutnya setelah jeda
        setTimeout(() => {
            nextStoryStep(nextId);
        }, 1500);
    } else {
        feedbackDiv.innerHTML = `<span class="feedback-wrong">❌ Jawaban salah. Coba periksa petunjuk di bawah!</span>`;
    }
}


// ====================================================================
// --- C. EXPORT KE MODUL LAIN (main.js) ---
// ====================================================================

// Mengekspor semua fungsi yang akan diakses oleh main.js/HTML
export { 
    renderStoryMode, // Diperbarui untuk bisa menerima chapterId
    nextStoryStep,
    checkTensesExercise 
    // loadCurrentStoryStep tidak perlu diekspor karena hanya dipanggil internal
};