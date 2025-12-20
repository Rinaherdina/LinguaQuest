/**
 * LINGUAQUEST - DATA ENGINE V5.2
 * Lokasi: scripts/data.js
 * Deskripsi: Pusat penyimpanan variabel global, metadata kurikulum, dan pengolahan data.
 */

// ==========================================
// 1. GLOBAL STATE MANAGEMENT
// ==========================================

// Gunakan pengecekan window untuk menghindari eror "already declared"
window.userState = window.userState || {
    lives: 5, 
    points: 0, 
    gems: 20, 
    streakCount: 0,
    lastLoginDate: null,
    lastActiveDate: null, 
    isPremium: false, 
    currentLevel: 1,
    weeklyXP: 0, 
    idiomsOpenedToday: 0, 
    sentencesDoneToday: 0,
    adsWatchedToday: 0, 
    collectedIdioms: [], // Tempat menyimpan ID idiom yang sudah dibuka
    todayIdiom: null,    // Menyimpan objek idiom hari ini
    lastIdiomDate: null,  // Menyimpan tanggal terakhir buka idiom
    idiomSentenceInput: "", // Simpan input kalimat user jika perlu
    
    getLevelString: function() {
        return "LV" + this.currentLevel;
    },
    // LAPORAN PENCAPAIAN (Untuk Profil)
    stats: {
        sentenceBuilder: { totalDone: 0, correct: 0, dailyLimit: 5, doneToday: 0 },
        idioms: { totalDone: 0, dailyLimit: 1, doneToday: 0 },
        dictation: { totalDone: 0, dailyLimit: 5, doneToday: 0 },
        tenses: { totalDone: 0, dailyLimit: 5, doneToday: 0 },
        speaking: { doneToday: 0, dailyLimit: 5 }
    }
};

window.dictionaryData = window.dictionaryData || []; 
window.SENTENCE_BUILDER_EXERCISES = window.SENTENCE_BUILDER_EXERCISES || [];

// ==========================================
// 2. METADATA KURIKULUM (UI/UX)
// ==========================================

var curriculumMetadata = {
    1: { 
        title: "THE NEWBIE", 
        desc: "Dasar-dasar kalimat harian & Present Tense.",
        xpToExam: 1000, 
        color: "#4CAF50", 
        icon: "fa-seedling" 
    },
    2: { 
        title: "THE VOYAGER", 
        desc: "Menceritakan masa lalu dan pengalaman.", 
        xpToExam: 2500,
        color: "#2196F3", 
        icon: "fa-ship" 
    },
    3: { 
        title: "THE SCHOLAR", 
        desc: "Kalimat sempurna dan konteks profesional.", 
        xpToExam: 3500,
        color: "#9C27B0", 
        icon: "fa-book-reader" 
    },
    4: { 
        title: "THE CHALLENGER", 
        desc: "Kalimat pengandaian (Conditionals) & Pasif.", 
        xpToExam: 4500,
        color: "#FF9800", 
        icon: "fa-fire" 
    },
    5: { 
        title: "THE MASTER", 
        desc: "Konteks akademik, bisnis, dan sastra.", 
        xpToExam: 5500,
        color: "#F44336", 
        icon: "fa-crown" 
    }
};

// ==========================================
// 3. BANK DATA (STORY & DICTIONARY)
// ==========================================

var STORY_DATA = {
    1: {
        title: "A Day in London",
        content: "Every morning, John wakes up at 6 AM...",
        questions: [
            {
                question: "What does John do every morning?",
                options: ["He sleeps", "He drinks coffee", "He runs", "He cooks"],
                correct: 1,
                explanation: "Teks menyebutkan John minum kopi."
            }
        ]
    }
    // Tambahkan level 2-5 di sini nantinya
};

// ==========================================
// 4. FUNGSI PENGOLAHAN DATA
// ==========================================

/**
 * Memberikan level otomatis pada soal Sentence Builder
 * Dipanggil di main.js setelah semua data termuat
 */
function syncSentenceBuilderData() {
    if (SENTENCE_BUILDER_EXERCISES.length === 0) return;

    let synced = SENTENCE_BUILDER_EXERCISES.map((soal, index) => {
        // Jika soal tidak punya properti level, sistem akan menebak levelnya
        // berdasarkan urutan (setiap 200 soal ganti level)
        let autoLevel = soal.level || Math.floor(index / 200) + 1; 
        if (autoLevel > 5) autoLevel = 5;

        return {
            ...soal,
            // Jika di file data lupa kasih level, default ke level user sekarang
            level: soal.level || window.userState.currentLevel, 
            target: soal.target || "",
            // Mendukung kunci 'meaning' atau 'translation' agar fleksibel
            meaning: soal.meaning || soal.translation || "Arti tidak tersedia"
        };
    });

    SENTENCE_BUILDER_EXERCISES.length = 0;
    SENTENCE_BUILDER_EXERCISES.push(...synced);
    console.log("✅ SB Sync: " + SENTENCE_BUILDER_EXERCISES.length + " soal siap.");
}

// Final Log
console.log("✅ Data Engine: Semua variabel (User, Dictionary, Story) siap digunakan.");