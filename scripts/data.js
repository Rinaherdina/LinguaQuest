// scripts/data.js

// ====================================================================
// --- 0. KONSTANTA VERB FORM & AUXILIARY (PENTING UNTUK IMPOR DI main.js) ---
// ====================================================================
export const V1 = 'V1';
export const V2 = 'V2';
export const V3 = 'V3';
export const V_ING = 'V-ing';
export const AUXILIARY = 'Auxiliary';

// ====================================================================
// --- 1. DATA READING (SOP: Dideklarasikan walaupun Kosong) ---
// ====================================================================
const READING_DATA = [];

// ====================================================================
// --- 2. Data Kata Ganti (Pronouns) ---
// ====================================================================
const PRONOUNS = {
    firstSingular: "I",
    secondSingular: "You",
    thirdSingular: ["He", "She", "It", "My cat", "The teacher"], 
    firstPlural: "We",
    secondPlural: "You",
    thirdPlural: ["They", "The students", "My friends", "Cats and dogs"] 
};

// ====================================================================
// --- 3. Data 20 Tenses (Verbal & Nominal) ---
// ====================================================================
const TENSES_DATA = [
    // --- A. TENSES VERBAL DASAR (GRATIS) ---
    {
        id: 'simple_present',
        name: 'Simple Present Tense',
        gratis: true, 
        desc: 'Menyatakan kebiasaan, fakta umum, atau jadwal tetap.',
        formula_pos: 'S + V1 (s/es) + O',
        formula_neg: 'S + do/does + NOT + V1 + O',
        formula_int: 'Do/Does + S + V1 + O ?'
    },
    {
        id: 'simple_past',
        name: 'Simple Past Tense',
        gratis: true, 
        desc: 'Menyatakan aksi yang selesai di masa lalu.',
        formula_pos: 'S + V2 + O',
        formula_neg: 'S + did + NOT + V1 + O',
        formula_int: 'Did + S + V1 + O ?'
    },
    {
        id: 'simple_future',
        name: 'Simple Future Tense (Will)',
        gratis: true, 
        desc: 'Menyatakan aksi yang akan dilakukan di masa depan.',
        formula_pos: 'S + will + V1 + O',
        formula_neg: 'S + will + NOT + V1 + O',
        formula_int: 'Will + S + V1 + O ?'
    },
    
    // --- B. TENSES NOMINAL (TO BE) BARU (GRATIS) ---
    {
        id: 'simple_present_nominal',
        name: 'Simple Present Nominal (Be)',
        gratis: true,
        desc: 'Menyatakan kondisi, status, profesi, atau lokasi saat ini (Noun, Adj, Adv).',
        formula_pos: 'S + am/is/are + Complement (N/Adj/Adv)',
        formula_neg: 'S + am/is/are + NOT + Complement',
        formula_int: 'Am/Is/Are + S + Complement ?'
    },
    {
        id: 'simple_past_nominal',
        name: 'Simple Past Nominal (Be)',
        gratis: true,
        desc: 'Menyatakan kondisi, status, profesi, atau lokasi di masa lalu (Noun, Adj, Adv).',
        formula_pos: 'S + was/were + Complement (N/Adj/Adv)',
        formula_neg: 'S + was/were + NOT + Complement',
        formula_int: 'Was/Were + S + Complement ?'
    },
    
    // --- C. TENSES VERBAL LANJUTAN (SEMUA DISIMULASIKAN PREMIUM: gratis: false) ---
    {
        id: 'present_continuous',
        name: 'Present Continuous Tense',
        gratis: false, // PREMIUM
        desc: 'Menyatakan aksi yang sedang berlangsung saat ini.',
        formula_pos: 'S + am/is/are + V-ing + O',
        formula_neg: 'S + am/is/are + NOT + V-ing + O',
        formula_int: 'Am/Is/Are + S + V-ing + O ?'
    },
    {
        id: 'present_perfect',
        name: 'Present Perfect Tense',
        gratis: false, // PREMIUM
        desc: 'Menyatakan aksi yang dimulai di masa lalu dan berlanjut atau memiliki hasil di masa kini.',
        formula_pos: 'S + have/has + V3 + O',
        formula_neg: 'S + have/has + NOT + V3 + O',
        formula_int: 'Have/Has + S + V3 + O ?'
    },
    {
        id: 'past_continuous',
        name: 'Past Continuous Tense',
        gratis: false, // PREMIUM
        desc: 'Menyatakan aksi yang sedang berlangsung di masa lalu.',
        formula_pos: 'S + was/were + V-ing + O',
        formula_neg: 'S + was/were + NOT + V-ing + O',
        formula_int: 'Was/Were + S + V-ing + O ?'
    },
    {
        id: 'future_continuous',
        name: 'Future Continuous Tense',
        gratis: false, // PREMIUM
        desc: 'Menyatakan aksi yang akan sedang dilakukan di masa depan.',
        formula_pos: 'S + will be + V-ing + O',
        formula_neg: 'S + will NOT be + V-ing + O',
        formula_int: 'Will + S + be + V-ing + O ?'
    },
    {
        id: 'past_perfect',
        name: 'Past Perfect Tense',
        gratis: false, // PREMIUM
        desc: 'Menyatakan aksi yang selesai sebelum aksi lain di masa lalu.',
        formula_pos: 'S + had + V3 + O',
        formula_neg: 'S + had + NOT + V3 + O',
        formula_int: 'Had + S + V3 + O ?'
    },
    {
        id: 'future_perfect',
        name: 'Future Perfect Tense',
        gratis: false, // PREMIUM
        desc: 'Menyatakan aksi yang akan selesai pada waktu tertentu di masa depan.',
        formula_pos: 'S + will have + V3 + O',
        formula_neg: 'S + will NOT have + V3 + O',
        formula_int: 'Will + S + have + V3 + O ?'
    },
    {
        id: 'present_perfect_continuous',
        name: 'Present Perfect Continuous Tense',
        gratis: false, // PREMIUM
        desc: 'Menyatakan aksi yang telah berlangsung hingga sekarang.',
        formula_pos: 'S + have/has been + V-ing + O',
        formula_neg: 'S + have/has NOT been + V-ing + O',
        formula_int: 'Have/Has + S + been + V-ing + O ?'
    },
    {
        id: 'past_perfect_continuous',
        name: 'Past Perfect Continuous Tense',
        gratis: false, // PREMIUM
        desc: 'Menyatakan aksi yang telah berlangsung sebelum aksi lain di masa lalu.',
        formula_pos: 'S + had been + V-ing + O',
        formula_neg: 'S + had NOT been + V-ing + O',
        formula_int: 'Had + S + been + V-ing + O ?'
    },
    {
        id: 'future_perfect_continuous',
        name: 'Future Perfect Continuous Tense',
        gratis: false, // PREMIUM
        desc: 'Menyatakan aksi yang akan telah berlangsung hingga waktu tertentu di masa depan.',
        formula_pos: 'S + will have been + V-ing + O',
        formula_neg: 'S + will NOT have been + V-ing + O',
        formula_int: 'Will + S + have been + V-ing + O ?'
    },
    {
        id: 'simple_future_goingto',
        name: 'Simple Future (Going To)',
        gratis: false, // PREMIUM
        desc: 'Menyatakan intensi atau rencana yang sudah pasti di masa depan.',
        formula_pos: 'S + am/is/are + going to + V1 + O',
        formula_neg: 'S + am/is/are + NOT + going to + V1 + O',
        formula_int: 'Am/Is/Are + S + going to + V1 + O ?'
    },
    {
        id: 'past_future_tense',
        name: 'Past Future Tense',
        gratis: false, // PREMIUM
        desc: 'Menyatakan aksi yang direncanakan di masa lalu untuk masa depan (dalam konteks masa lalu).',
        formula_pos: 'S + would + V1 + O',
        formula_neg: 'S + would + NOT + V1 + O',
        formula_int: 'Would + S + V1 + O ?'
    },
    {
        id: 'past_future_continuous',
        name: 'Past Future Continuous Tense',
        gratis: false, // PREMIUM
        desc: 'Menyatakan aksi yang seharusnya sedang dilakukan di masa lalu (dalam konteks masa lalu).',
        formula_pos: 'S + would be + V-ing + O',
        formula_neg: 'S + would NOT be + V-ing + O',
        formula_int: 'Would + S + be + V-ing + O ?'
    },
    {
        id: 'past_future_perfect',
        name: 'Past Future Perfect Tense',
        gratis: false, // PREMIUM
        desc: 'Menyatakan aksi yang seharusnya telah selesai di masa lalu (Conditional Type 3).',
        formula_pos: 'S + would have + V3 + O',
        formula_neg: 'S + would NOT have + V3 + O',
        formula_int: 'Would + S + have + V3 + O ?'
    },
    {
        id: 'past_future_perfect_continuous',
        name: 'Past Future Perfect Continuous Tense',
        gratis: false, // PREMIUM
        desc: 'Menyatakan aksi yang seharusnya telah berlangsung di masa lalu (dalam konteks masa lalu).',
        formula_pos: 'S + would have been + V-ing + O',
        formula_neg: 'S + would NOT have been + V-ing + O',
        // REVISI: Mengganti Will menjadi Would
        formula_int: 'Would + S + have been + V-ing + O ?'
    },
];

// ====================================================================
// --- 4. Konfigurasi Gamifikasi (BINTANG ILMU, HEART, & PREMIUM WALLS) ---
// ====================================================================
const GAMIFICATION_CONFIG = {
    // A. Pengalaman & Pangkat
    LEVEL_XP_THRESHOLD: [
        { level: 1, minStars: 0, title: 'Pelatih Kata (A1)', icon: 'fa-seedling' }, 
        { level: 2, minStars: 100, title: 'Penjelajah Tenses (A2)', icon: 'fa-leaf' }, 
        { level: 3, minStars: 300, title: 'Ahli Sintaksis (B1)', icon: 'fa-star-half-alt' }, 
        { level: 4, minStars: 600, title: 'Master Linguistik (B2)', icon: 'fa-star' }, 
        { level: 5, minStars: 1000, title: 'Penyihir Bahasa', icon: 'fa-crown' },
    ],
    STARS_PER_CORRECT_ANSWER: 10,
    STARS_PER_STORY_COMPLETION: 50, 
    MASTERY_POINTS_PER_UNIT: 5, 
    MASTERY_THRESHOLD_FOR_CROWN: 100,

    // B. Konfigurasi Arena / Heart System (Premium Wall #4)
    MAX_ARENA_HEARTS_FREE: 5, // Nyawa Maksimum untuk pengguna gratis
    HEART_RECHARGE_TIME_MS: 4 * 60 * 60 * 1000, // 4 jam untuk isi ulang 1 Heart (contoh)

    // C. Konfigurasi Premium Wall Lainnya
    FREE_REVIEW_LIMIT_PER_DAY: 1, // Batas Ujian/Review per hari untuk gratisan (Premium Wall #2)
    COST_REPAIR_STREAK_STARS: 20, // Biaya Bintang Ilmu untuk perbaikan Streak (Premium Wall #3)
    MAX_FREE_TRIAL_EXERCISES: 3, 

}; // <-- Tutup Objek GAMIFICATION_CONFIG di sini

// ====================================================================
// --- D. KONSTANTA DICTATION BARU (Ditempatkan di sini, di luar objek) ---
// ====================================================================
export const MAX_AD_LIVES_RESTORE = 2; // Maksimal 2 kali per hari memulihkan nyawa dengan iklan
export const MAX_DICTATION_LIVES = 5; // Nyawa Dictation Maksimal

// ====================================================================
// --- 5. Lesson Path / Kurikulum Berjenjang ---
// ====================================================================
const LESSON_PATH = [
    // Level 1 (A1): Penyelamat Kata Dasar (GRATIS)
    {
        id: 'basic_greetings',
        name: 'Level A1: Penyelamat Kata Dasar', 
        desc: 'Pelajari frasa dasar, kata ganti, dan Simple Tenses (Present, Past, Future).',
        icon: 'fa-sign-language',
        requiredXp: 0,
        premium: false, // LEVEL GRATIS
        modules: [
            { id: 'm1_sp', name: 'Tenses: Simple Present (Fokus)', content: ['simple_present', 'simple_present_nominal'], lock: false, maxMastery: 100 },
            { id: 'm2_spast', name: 'Tenses: Simple Past', content: ['simple_past', 'simple_past_nominal'], lock: false, maxMastery: 100 },
            { id: 'm3_sfut', name: 'Tenses: Simple Future', content: ['simple_future'], lock: false, maxMastery: 80 },
            { id: 'm4_pronouns', name: 'Kosakata & Kata Ganti', content: ['dictation', 'translation'], lock: false, maxMastery: 50 },
            { id: 'm5_habits', name: 'Latihan: Kebiasaan Harian', content: ['pronunciation'], lock: false, maxMastery: 50 },
            { id: 'm6_review', name: 'Ujian Penguasaan A1', content: ['REVIEW'], lock: false, maxMastery: 50 },
        ]
    },
    // Level 2 (A2): Arkeolog Tenses (GRATIS)
    {
        id: 'intermediate_past',
        name: 'Level A2: Arkeolog Tenses',
        desc: 'Memahami Tenses Sempurna (Perfect Tenses) dan kejadian yang sedang berlangsung di masa lalu.',
        icon: 'fa-history',
        requiredXp: 500,
        premium: false, // LEVEL GRATIS
        modules: [
            { id: 'm7_pp', name: 'Present Perfect Tense', content: ['present_perfect', 'TRANSLATION'], lock: false, maxMastery: 120 },
            { id: 'm8_pc', name: 'Past Continuous Tense', content: ['past_continuous', 'SENTENCE_BUILDER'], lock: false, maxMastery: 120 },
            { id: 'm9_irreg_adv', name: 'Irregular Verbs Lanjut (V2-V3)', content: ['VERB_CHECKER'], lock: false, maxMastery: 100 },
            { id: 'm10_review', name: 'Ujian Penguasaan A2', content: ['REVIEW'], lock: false, maxMastery: 50 },
        ]
    },
    // Level 3 (B1): Pembangun Sintaksis (LEVEL PREMIUM EKSKLUSIF)
    {
        id: 'upper_intermediate',
        name: 'Level B1: Pembangun Sintaksis',
        desc: 'Mempelajari Tenses Continuous Lanjutan, Past Perfect, dan Kalimat Bersyarat Dasar.',
        icon: 'fa-route',
        requiredXp: 1500,
        premium: true, // PREMIUM WALL BERLAKU DI SINI
        modules: [
            { id: 'm11_ppc', name: 'Present Perfect Continuous', content: ['present_perfect_continuous', 'DICTATION'], lock: true, maxMastery: 150 },
            { id: 'm12_past_perf', name: 'Past Perfect Tense', content: ['past_perfect', 'TRANSLATION'], lock: true, maxMastery: 150 },
            { id: 'm13_cond1', name: 'Conditional Type 1', content: ['simple_future'], lock: true, maxMastery: 100 },
            { id: 'm14_review', name: 'Ujian Penguasaan B1', content: ['REVIEW'], lock: true, maxMastery: 50 },
        ]
    },
    // Level 4 (B2): Master Kronologi (LEVEL PREMIUM EKSKLUSIF)
    {
        id: 'advanced',
        name: 'Level B2: Master Kronologi',
        desc: 'Menggunakan kalimat pasif, Modals, dan Conditional Type 2 & 3.',
        icon: 'fa-brain',
        requiredXp: 3000,
        premium: true, // PREMIUM WALL BERLAKU DI SINI
        modules: [
            { id: 'm15_passive', name: 'Passive Voice (Dasar)', content: ['past_continuous'], lock: true, maxMastery: 200 },
            { id: 'm16_modals', name: 'Modal Auxiliaries Lanjut', content: ['simple_future'], lock: true, maxMastery: 150 },
            { id: 'm17_cond3', name: 'Conditional Type 3', content: ['past_future_perfect'], lock: true, maxMastery: 150 },
            { id: 'm18_review', name: 'Ujian Penguasaan B2', content: ['REVIEW'], lock: true, maxMastery: 50 },
        ]
    },
];

// ====================================================================
// --- 6. Data Story Mode (Organisasi Chapter) ---
// ====================================================================
const STORY_MODE_DATA = [
    {
        id: 1,
        title: "Chapter 1: The Gate of Grammarville (GRATIS)",
        summary: "Ikuti petualanganmu dan terapkan kemampuan bahasa Inggrismu secara kontekstual.",
        gratis: true,
        steps: [
            { id: 101, type: 'TEXT', speaker: 'Narator', text: 'Selamat datang di LinguaQuest! Sebelum masuk, kamu harus menjawab soal tenses sederhana.', nextId: 102 },
            { 
                id: 102, 
                type: 'TENSES_CHECK_EXERCISE', 
                tensesId: 'simple_present', 
                nextId: 103, 
                correctAnswer: 'eats', 
                targetVerb: 'eat', 
                sentencePart: 'The dragon usually ___ three chickens a day.',
                hint: 'Gunakan Simple Present Tense. Perhatikan subjek tunggal (The dragon).'
            },
            { id: 103, type: 'TEXT', speaker: 'Penjaga Gerbang', text: 'Tepat sekali. Sekarang, misi selanjutnya memerlukan lebih banyak kekuatan.', nextId: 104 },
            { 
                id: 104, 
                type: 'IAP_WALL', 
                requiredFeature: 'story_mode_lanjutan', 
                message: 'Kamu berhasil melewati gerbang! Untuk melanjutkan petualangan epik ke Chapter 2 (dan seterusnya), kamu memerlukan LinguaQuest Premium.', 
                nextAction: 'Kembali ke Beranda' 
            },
        ]
    },
    {
        id: 2,
        title: "Chapter 2: The Forest of Phrasal Verbs (PREMIUM)",
        summary: "Hadapi tantangan kata kerja majemuk dan pelajari cara menggunakannya dalam dialog.",
        gratis: false,
        steps: [
            { id: 201, type: 'TEXT', speaker: 'Narator', text: 'Hutan ini penuh teka-teki. Kamu harus menguasai phrasal verbs.', nextId: 202 },
            { id: 202, type: 'SENTENCE_BUILDER', target: 'He took off his shoes before entering the house.', nextId: 203, level: 'MEDIUM' },
            { id: 203, type: 'TEXT', speaker: 'Petunjuk', text: 'Tepat! "Take off" berarti melepaskan. Lanjutkan!', nextId: null },
        ]
    }
];

// ====================================================================
// --- 7. Data Latihan Arena (Skill Arena) ---
// ====================================================================
const ARENA_EXERCISES = [
    { id: 1, type: 'IDIOM', target: 'Spill the beans', meaning: 'Membocorkan rahasia', category: 'General', gratis: true, module: 'module_5_irregular_verbs' },
    { id: 2, type: 'IDIOM', target: 'Break the ice', meaning: 'Memecahkan suasana kaku', category: 'General', gratis: true, module: 'module_5_irregular_verbs' },
    { id: 301, type: 'SENTENCE_BUILDER', target: 'She finished her assignment quickly.', gratis: true, level: 'EASY', module: 'module_1_simple_present'},
    { id: 201, type: 'DICTATION', target: 'I need to buy some groceries for dinner.', level: 'EASY', gratis: true, module: 'module_2_pronouns' },
    { id: 401, type: 'PRONUNCIATION', target: 'The quick brown fox jumps over the lazy dog.', level: 'CHALLENGE', gratis: true, module: 'module_3_daily_habit' },
    { 
        id: 501, 
        type: 'TRANSLATION', 
        source: 'We are going to visit our grandparents this weekend.', 
        target: 'Kami akan mengunjungi kakek dan nenek kami akhir pekan ini.', 
        level: 'EASY', 
        gratis: true,
        module: 'module_2_pronouns'
    },
    // ... (Latihan lainnya)
];

// ====================================================================
// --- 8. DATA UJIAN PENGUASAAN (Level A1: m6_review) ---
// ====================================================================
export const QUIZ_DATA = {
    // Ujian Penguasaan Level A1: Modul ID 'm6_review'
    'm6_review': [
        // 1. TENSES (SIMPLE PRESENT) - Multiple Choice
        { 
            id: 1, 
            type: 'MULTIPLE_CHOICE_TENSES', 
            question: "My mother always _____ the dishes after dinner.",
            options: ['wash', 'washes', 'washed', 'washing'], 
            answer: 'washes',
            tensesId: 'simple_present',
            hint: 'Fokus pada kebiasaan dan subjek tunggal (V1 + s/es).'
        },
        // 2. TENSES (SIMPLE PAST)
        { 
            id: 2, 
            type: 'MULTIPLE_CHOICE_TENSES', 
            question: "They _____ to the cinema yesterday.",
            options: ['go', 'goes', 'went', 'gone'], 
            answer: 'went',
            tensesId: 'simple_past',
            hint: 'Cari bentuk V2 (kata kerja tak beraturan) yang tepat untuk "go".'
        },
        // 3. TENSES (SIMPLE FUTURE)
        { 
            id: 3, 
            type: 'MULTIPLE_CHOICE_TENSES', 
            question: "We _____ visit our friends next week.",
            options: ['are', 'will', 'do', 'have'], 
            answer: 'will',
            tensesId: 'simple_future',
            hint: 'Kata kerja modal untuk menyatakan masa depan (Simple Future).'
        },
        // 4. NOMINAL (SIMPLE PRESENT)
        { 
            id: 4, 
            type: 'MULTIPLE_CHOICE_TENSES', 
            question: "The book on the table _____ mine.",
            options: ['am', 'is', 'are', 'be'], 
            answer: 'is',
            tensesId: 'simple_present_nominal',
            hint: 'Gunakan to be untuk subjek tunggal.'
        },
        // 5. NEGATIVE FORM (SIMPLE PRESENT)
        { 
            id: 5, 
            type: 'MULTIPLE_CHOICE_TENSES', 
            question: "She _____ like eating spicy food.",
            options: ['don\'t', 'doesn\'t', 'isn\'t', 'won\'t'], 
            answer: 'doesn\'t',
            tensesId: 'simple_present',
            hint: 'Gunakan auxiliary verb yang tepat untuk subjek "She" dalam kalimat negatif.'
        },
        // 6. IRREGULAR VERB KNOWLEDGE
        { 
            id: 6, 
            type: 'MULTIPLE_CHOICE_TENSES', 
            question: "What is the V2 (Past Simple) form of the verb 'write'?",
            options: ['writed', 'wrote', 'written', 'writing'], 
            answer: 'wrote',
            tensesId: 'simple_past',
            hint: 'Periksa daftar kata kerja tak beraturan.'
        },
        // 7. INTERROGATIVE FORM (SIMPLE PAST)
        { 
            id: 7, 
            type: 'MULTIPLE_CHOICE_TENSES', 
            question: "_____ you clean your room yesterday?",
            options: ['Do', 'Did', 'Will', 'Are'], 
            answer: 'Did',
            tensesId: 'simple_past',
            hint: 'Gunakan auxiliary verb untuk pertanyaan Simple Past.'
        },
        
        // 8-12. SENTENCE BUILDER (Menguji Struktur Kalimat)
        { 
            id: 8, 
            type: 'SENTENCE_BUILDER', 
            target: 'I don\'t watch television every day.',
            words: ['I', 'watch', 'don\'t', 'every', 'television', 'day.'],
            level: 'EASY', 
            hint: 'Susunlah menjadi kalimat negatif Simple Present.'
        },
        { 
            id: 9, 
            type: 'SENTENCE_BUILDER', 
            target: 'They were happy last night.',
            words: ['were', 'happy', 'They', 'last', 'night.'],
            level: 'EASY',
            hint: 'Susunlah menjadi kalimat nominal Simple Past.'
        },
        { 
            id: 10, 
            type: 'SENTENCE_BUILDER', 
            target: 'Will she call you later?',
            words: ['call', 'you', 'Will', 'later', 'she', '?'],
            level: 'EASY',
            hint: 'Susunlah menjadi kalimat tanya Simple Future.'
        },
        { 
            id: 11, 
            type: 'SENTENCE_BUILDER', 
            target: 'The students studied English.',
            words: ['The', 'English', 'students', 'studied', '.'],
            level: 'EASY',
            hint: 'Susunlah menjadi kalimat Simple Past positif.'
        },
        { 
            id: 12, 
            type: 'SENTENCE_BUILDER', 
            target: 'We will meet at the library.',
            words: ['library', 'We', 'the', 'at', 'will', 'meet', '.'],
            level: 'EASY',
            hint: 'Susunlah menjadi kalimat Simple Future positif.'
        },

        // 13-16. TRANSLATION (Menguji Pemahaman Tenses dalam Konteks)
        { 
            id: 13, 
            type: 'TRANSLATION', 
            source: 'Mereka tidak pergi ke sekolah kemarin.', 
            target: 'They did not go to school yesterday.', 
            level: 'EASY', 
            hint: 'Gunakan Simple Past Negatif.'
        },
        { 
            id: 14, 
            type: 'TRANSLATION', 
            source: 'Apakah kamu seorang dokter?', 
            target: 'Are you a doctor?', 
            level: 'EASY', 
            hint: 'Gunakan Simple Present Nominal Interogatif.'
        },
        { 
            id: 15, 
            type: 'TRANSLATION', 
            source: 'Saya akan membeli mobil baru bulan depan.', 
            target: 'I will buy a new car next month.', 
            level: 'EASY', 
            hint: 'Gunakan Simple Future Tense.'
        },
        { 
            id: 16, 
            type: 'TRANSLATION', 
            source: 'Kami makan malam di restoran itu setiap hari Minggu.', 
            target: 'We eat dinner at that restaurant every Sunday.', 
            level: 'EASY', 
            hint: 'Gunakan Simple Present Tense untuk kebiasaan.'
        },

        // 17-19. DICTATION (Menguji Pendengaran dan Ejaan)
        { 
            id: 17, 
            type: 'DICTATION', 
            target: 'She is a very smart student.', 
            level: 'EASY', 
            tensesId: 'simple_present_nominal', 
            hint: 'Tulis kembali kalimat yang Anda dengar (Simple Present Nominal).'
        },
        { 
            id: 18, 
            type: 'DICTATION', 
            target: 'Did he finish his homework?', 
            level: 'EASY',
            // REVISI: Mengganti ID yang terlalu panjang menjadi Simple Past
            tensesId: 'simple_past', 
            hint: 'Tulis kembali kalimat yang Anda dengar (Simple Past Interogatif).'
        },
        { 
            id: 19, 
            type: 'DICTATION', 
            target: 'The concert will start at eight.', 
            level: 'EASY',
            // REVISI: Mengganti ID nominal menjadi Simple Future (verbal)
            tensesId: 'simple_future', 
            hint: 'Tulis kembali kalimat yang Anda dengar (Simple Future).'
        },

        // 20. PRONUNCIATION (Menguji Pengucapan)
        { 
            id: 20, 
            type: 'PRONUNCIATION', 
            target: 'I went home late last night.', 
            level: 'EASY', 
            hint: 'Ucapkan kalimat ini dengan jelas. Perhatikan pelafalan "went".'
        },
    ],
    // 'm10_review': [ ... Data Ujian A2 di sini nanti ... ],
    // ...
};

// ====================================================================
// --- 9. EXPORT FINAL (Memastikan semua data terekspos) ---
// ====================================================================
export { 
    PRONOUNS, 
    TENSES_DATA, 
    STORY_MODE_DATA,
    ARENA_EXERCISES,
    GAMIFICATION_CONFIG,
    LESSON_PATH,
    READING_DATA,
};