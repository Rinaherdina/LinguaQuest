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
        idioms: { totalDone: 0, dailyLimit: 3, doneToday: 0 },
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
        color: "#4CAF50", 
        icon: "fa-seedling" 
    },
    2: { 
        title: "THE VOYAGER", 
        desc: "Menceritakan masa lalu dan pengalaman.", 
        color: "#2196F3", 
        icon: "fa-ship" 
    },
    3: { 
        title: "THE SCHOLAR", 
        desc: "Kalimat sempurna dan konteks profesional.", 
        color: "#9C27B0", 
        icon: "fa-book-reader" 
    },
    4: { 
        title: "THE CHALLENGER", 
        desc: "Kalimat pengandaian (Conditionals) & Pasif.", 
        color: "#FF9800", 
        icon: "fa-fire" 
    },
    5: { 
        title: "THE MASTER", 
        desc: "Konteks akademik, bisnis, dan sastra.", 
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
        // Otomatis naik level setiap 200 soal
        let autoLevel = Math.floor(index / 200) + 1; 
        if (autoLevel > 5) autoLevel = 5;

        return {
            ...soal,
            level: autoLevel,
            target: soal.target || "",
            meaning: soal.meaning || soal.translation || "Arti tidak tersedia"
        };
    });

    SENTENCE_BUILDER_EXERCISES.length = 0;
    SENTENCE_BUILDER_EXERCISES.push(...synced);
    console.log("✅ Sentence Builder Sync: " + SENTENCE_BUILDER_EXERCISES.length + " soal terproses.");
}

// Final Log
console.log("✅ Data Engine: Semua variabel (User, Dictionary, Story) siap digunakan.");