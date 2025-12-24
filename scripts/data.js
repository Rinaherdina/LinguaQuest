// ==========================================
// 1. GLOBAL STATE MANAGEMENT
// ==========================================
const savedData = localStorage.getItem('lingua_user_data');

window.userState = savedData ? JSON.parse(savedData) : {
    lives: 5, 
    xp: 0,
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
    collectedIdioms: [], 
    todayIdiom: null,    
    lastIdiomDate: null,  
    idiomSentenceInput: "", 
    lastStoryDate: null,

    getLevelString: function() {
        return "LV" + this.currentLevel;
    },
    stats: {
        sentenceBuilder: { totalDone: 0, correct: 0, dailyLimit: 5, doneToday: 0 },
        idioms: { totalDone: 0, dailyLimit: 1, doneToday: 0 },
        dictation: { totalDone: 0, dailyLimit: 5, doneToday: 0 },
        tenses: { totalDone: 0, dailyLimit: 5, doneToday: 0 },
        speaking: { totalDone: 0, dailyLimit: 5, doneToday: 0 }, // Pastikan ada totalDone
        story: { totalDone: 0, dailyLimit: 1, doneToday: 0 }
    }
};

// Inisialisasi Bank Data Global agar tidak undefined
window.dictionaryData = window.dictionaryData || []; 
window.SENTENCE_BUILDER_EXERCISES = window.SENTENCE_BUILDER_EXERCISES || [];
window.dictationBank = window.dictationBank || [];
window.speakingBank = window.speakingBank || []; // TAMBAHAN: Bank data Speaking

// ==========================================
// 2. METADATA KURIKULUM (UI/UX)
// ==========================================
var curriculumMetadata = {
    1: { title: "THE NEWBIE", desc: "Dasar-dasar kalimat harian & Present Tense.", xpToExam: 1000, color: "#4CAF50", icon: "fa-seedling" },
    2: { title: "THE VOYAGER", desc: "Menceritakan masa lalu dan pengalaman.", xpToExam: 2500, color: "#2196F3", icon: "fa-ship" },
    3: { title: "THE SCHOLAR", desc: "Kalimat sempurna dan konteks profesional.", xpToExam: 3500, color: "#9C27B0", icon: "fa-book-reader" },
    4: { title: "THE CHALLENGER", desc: "Kalimat pengandaian (Conditionals) & Pasif.", xpToExam: 4500, color: "#FF9800", icon: "fa-fire" },
    5: { title: "THE MASTER", desc: "Konteks akademik, bisnis, dan sastra.", xpToExam: 5500, color: "#F44336", icon: "fa-crown" }
};

// ==========================================
// 3. BANK DATA (STORY)
// ==========================================
var STORY_DATA = {
    1: {
        title: "A Day in London",
        content: "Every morning, John wakes up at 6 AM. He drinks a cup of coffee and reads the news.",
        questions: [
            {
                question: "What does John do every morning?",
                options: ["He sleeps", "He drinks coffee", "He runs", "He cooks"],
                correct: 1,
                explanation: "Teks menyebutkan John minum kopi."
            }
        ]
    }
};

// ==========================================
// 4. FUNGSI SINKRONISASI (CLEANER)
// ==========================================

function syncAllData() {
    // 1. Sync Sentence Builder
    if (window.SENTENCE_BUILDER_EXERCISES.length > 0) {
        window.SENTENCE_BUILDER_EXERCISES = window.SENTENCE_BUILDER_EXERCISES.map((soal, index) => ({
            ...soal,
            level: soal.level || Math.floor(index / 100) + 1,
            meaning: soal.meaning || soal.translation || "No meaning"
        }));
    }

    // 2. Sync Speaking (Pastikan data speaking punya level)
    if (window.speakingBank.length > 0) {
        window.speakingBank = window.speakingBank.map((s, index) => ({
            ...s,
            level: s.level || Math.floor(index / 50) + 1
        }));
    }

    console.log("✅ Data Sync Complete: SB & Speaking synchronized.");
}

// Jalankan sync saat file dimuat
syncAllData();