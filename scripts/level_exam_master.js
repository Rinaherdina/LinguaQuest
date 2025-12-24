/**
 * LINGUAQUEST - LEVEL EXAM MASTER ENGINE (Final Revision)
 */

// ==========================================
// 1. DATA SOAL STATIS (TEMPLATE)
// ==========================================
window.EXAM_MASTER_DATA = {
    "LV1": [
        { type: "choice", q: "What is the English word for 'Buku'?", opt: ["Pen", "Eraser", "Book", "Map"], a: "Book", category: "VOCAB" },
        { type: "choice", q: "Complete the sentence: 'I ___ a student.'", opt: ["is", "am", "are", "be"], a: "am", category: "TENSES" }
    ],
    "LV2": [
        { type: "choice", q: "Which one is an adjective?", opt: ["Run", "Beautiful", "Eat", "Quickly"], a: "Beautiful", category: "GRAMMAR", explanation: "Adjective adalah kata sifat yang menjelaskan benda." },
        { type: "choice", q: "I am interested ___ learning English.", opt: ["in", "on", "at", "to"], a: "in", category: "PREPOSITION" }
    ],
    "LV3": [
        { type: "choice", q: "Choose the formal way to say 'Ask for':", opt: ["Request", "Get", "Tell", "Need"], a: "Request", category: "BUSINESS" },
        { type: "choice", q: "She ___ to the office since 2010.", opt: ["has worked", "is working", "works", "work"], a: "has worked", category: "TENSES" }
    ],
    "LV4": [
        { type: "choice", q: "TOEFL Part: Identify the error: 'The children (A) is (B) playing (C) in the (D) garden.'", opt: ["A", "B", "C", "D"], a: "B", category: "ERROR RECOGNITION", explanation: "The children adalah plural, maka seharusnya menggunakan 'are' bukan 'is'." },
        { type: "choice", q: "Despite ___ the traffic, he arrived on time.", opt: ["of", "the", "in", "heavy"], a: "heavy", category: "STRUCTURE" }
    ],
    "LV5": [
        { type: "choice", q: "Academic Vocabulary: What is a synonym for 'Abundant'?", opt: ["Plentiful", "Scarce", "Small", "Rare"], a: "Plentiful", category: "ACADEMIC" },
        { type: "choice", q: "Rarely ___ such a beautiful sunset.", opt: ["I have seen", "have I seen", "I saw", "saw I"], a: "have I seen", category: "INVERSION", explanation: "Setelah kata keterangan negatif seperti 'Rarely', kalimat harus dibalik (Inversion)." }
    ]
};

// ==========================================
// 2. STATE MANAGEMENT
// ==========================================
let currentExamIndex = 0;
let examScore = 0;
let examDataHolder = [];
let examHistory = [];

// ==========================================
// 3. CORE FUNCTIONS
// ==========================================

window.startGlobalLevelExam = function() {
    const currentLv = userState.currentLevel || 1;
    
    // Reset State
    currentExamIndex = 0;
    examScore = 0;
    examHistory = [];
    
    // Generate soal secara otomatis dari 8 modul
    examDataHolder = generateExamPaper(currentLv);

    if (examDataHolder.length === 0) {
        return alert("Materi untuk level ini belum cukup untuk membuat ujian.");
    }

    // Tampilkan kisi-kisi dulu sebelum mulai
    showPreExamReview(currentLv);
};

function showPreExamReview(lv) {
    const tips = {
        1: "Fokus pada <b>To Be</b> (am, is, are) dan ejaan dasar!",
        2: "Hati-hati dengan kata sifat -ed vs -ing dan penggunaan 'Agree'.",
        3: "Gunakan bahasa formal kantor (Business English).",
        4: "Fokus pada preposisi (In, On, At) dan TOEFL Structure.",
        5: "Perhatikan nuansa kata dan Academic Listening."
    };

    const reviewHTML = `
        <div style="text-align:center; padding:10px;">
            <div style="font-size:50px; margin-bottom:15px;">💡</div>
            <h2 style="margin-bottom:10px;">Kisi-Kisi Ujian LV ${lv}</h2>
            <div style="background:#fff3cd; color:#856404; padding:15px; border-radius:15px; border:1px solid #ffeeba; text-align:left; line-height:1.5;">
                <p>Ujian terdiri dari <b>${examDataHolder.length} soal campuran</b>:</p>
                <ul style="padding-left:20px; margin-top:10px;">
                    <li>${tips[lv] || "Tinjau kembali materi harianmu!"}</li>
                    <li>Sistem akan menilai Speaking, Listening, dan Grammar.</li>
                    <li>Minimal skor kelulusan adalah <b>80%</b>.</li>
                </ul>
            </div>
            <button class="btn-upgrade btn-premium" style="width:100%; margin-top:20px; padding:15px;" onclick="showExamQuestion()">
                SAYA SIAP, MULAI SEKARANG!
            </button>
        </div>
    `;
    openGameOverlay(reviewHTML, "PRE-EXAM REVIEW");
}

function showExamQuestion() {
    const qData = examDataHolder[currentExamIndex];
    let html = `<div style="text-align:center;">
        <div style="background:#eee; padding:5px; border-radius:5px; font-size:11px; margin-bottom:15px; font-weight:bold;">
            MODUL: ${qData.category || 'GENERAL'} | SOAL ${currentExamIndex + 1} / ${examDataHolder.length}
        </div>`;

    // --- LOGIKA TIPE SOAL ---
    if (qData.category === "SPEAKING" || qData.pronunciation) {
        html += `
            <h3 style="color:#2ecc71;"><i class="fas fa-microphone"></i> Speaking Challenge</h3>
            <p>Ucapkan kalimat ini dengan jelas:</p>
            <h2 style="margin:20px 0;">"${qData.target || qData.text}"</h2>
            <button id="exam-mic-btn" onclick="startExamSpeaking('${qData.target || qData.text}')" class="node-circle" style="width:80px; height:80px; background:#e74c3c; color:white; border-radius:50%; margin: 0 auto; display:flex; align-items:center; justify-content:center; border:none; cursor:pointer;">
                <i class="fas fa-microphone fa-2x"></i>
            </button>
            <p id="speaking-status" style="margin-top:10px; font-size:12px; color:#888;">Ketuk mic dan mulai bicara</p>
        `;
    } 
    else if (qData.category === "STORY") {
        html += `
            <div style="background:#f9f9f9; padding:15px; border-radius:10px; text-align:left; margin-bottom:15px; font-style:italic;">
                "${qData.snippet || qData.context || 'Read the context carefully.'}"
            </div>
            <p><b>Question:</b> ${qData.question || qData.q}</p>
            <div style="display:grid; gap:10px;">
                ${(qData.options || qData.opt).map(o => `<button class="btn-upgrade btn-secondary" onclick="checkExamAnswer('${o}')">${o}</button>`).join('')}
            </div>
        `;
    }
    else {
        // Default Choice / Vocab / Tenses
        html += `
            <p style="font-size:18px; margin-bottom:20px;">${qData.q || qData.question || qData.meaning}</p>
            <div style="display:grid; gap:10px;">
                ${(qData.opt || qData.options || []).map(o => `<button class="btn-upgrade btn-secondary" onclick="checkExamAnswer('${o}')">${o}</button>`).join('')}
            </div>
        `;
    }

    html += `</div>`;
    openGameOverlay(html, "FINAL EXAM - LEVEL " + userState.currentLevel);
}

function checkExamAnswer(userAnswer) {
    const q = examDataHolder[currentExamIndex];
    const correctAnswer = q.a || q.correctAnswer || q.target || "";
    
    const isCorrect = userAnswer.toLowerCase().trim().replace(/[.!?,]/g, '') === 
                      correctAnswer.toLowerCase().trim().replace(/[.!?,]/g, '');

    examHistory.push({
        question: q.q || q.question || q.meaning || q.target || "Listening Item",
        userAns: userAnswer,
        correctAns: correctAnswer,
        status: isCorrect,
        explanation: q.explanation || null
    });

    if (isCorrect) {
        examScore++;
        if (typeof playSuccessSound === 'function') playSuccessSound();
    } else {
        if (typeof playErrorSound === 'function') playErrorSound();
    }

    currentExamIndex++;
    if (currentExamIndex < examDataHolder.length) {
        showExamQuestion();
    } else {
        finishExam();
    }
}

function finishExam() {
    const totalQuestions = examDataHolder.length;
    const finalScore = Math.round((examScore / totalQuestions) * 100);
    const passingGrade = 80;
    const isPassed = finalScore >= passingGrade;

    if (isPassed) {
        showCertificate(finalScore);
    } else {
        showFailResult(finalScore);
    }
}

function showFailResult(score) {
    const failHTML = `
        <div style="text-align:center; padding:10px;">
            <div style="font-size:60px; margin-bottom:10px;">😢</div>
            <h2 style="color:#e74c3c;">SKOR ANDA: ${score}%</h2>
            <p>Maaf, Anda butuh minimal <b>80%</b> untuk lulus.</p>
            <div style="margin-top:20px; display:grid; gap:10px;">
                <button class="btn-upgrade btn-premium" style="background:#3498db;" onclick="showAnswerReview()">
                    <i class="fas fa-search"></i> LIHAT ULASAN JAWABAN
                </button>
                <button class="btn-upgrade btn-secondary" onclick="startGlobalLevelExam()">
                    <i class="fas fa-redo"></i> COBA LAGI
                </button>
            </div>
        </div>
    `;
    openGameOverlay(failHTML, "HASIL UJIAN");
}

function showCertificate(score) {
    const today = new Date().toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric' });
    const levelTitle = (typeof arenaLevels !== 'undefined') ? arenaLevels.find(l => l.id === userState.currentLevel)?.title : "Mastery";

    const certHTML = `
        <div style="padding: 20px; text-align: center; background: #fff; border: 10px double #d4af37; position: relative;">
            <h4 style="margin: 0; color: #d4af37; letter-spacing: 2px;">CERTIFICATE OF ACHIEVEMENT</h4>
            <p style="font-size: 12px; margin: 5px 0 20px;">LinguaQuest Mastery Program</p>
            <p style="margin: 0; font-style: italic;">This is to certify that you have mastered</p>
            <h2 style="margin: 10px 0; color: #2c3e50;">LEVEL ${userState.currentLevel}: ${levelTitle}</h2>
            <div style="margin: 20px auto; width: 80%; border-bottom: 1px solid #ddd;"></div>
            <h1 style="margin: 5px 0; color: #2ecc71;">${score}%</h1>
            <p style="font-size: 12px; color: #7f8c8d; margin-top: 20px;">Issued on: ${today}</p>
            <button class="btn-upgrade btn-premium" style="width:100%; margin-top:25px;" onclick="proceedToNextLevel()">
                KLAIM REWARD & LANJUT <i class="fas fa-arrow-right"></i>
            </button>
        </div>
    `;
    openGameOverlay(certHTML, "LEVEL PASSED!");
}

function proceedToNextLevel() {
    userState.currentLevel++;
    userState.points += 200;
    userState.gems += 50;
    
    if (typeof saveUserData === 'function') saveUserData();
    closeGameOverlay();
    if (typeof renderArena === 'function') renderArena();
    
    alert(`Selamat! Anda naik ke Level ${userState.currentLevel}`);
}

// ==========================================
// 4. GENERATORS (8 MODULES)
// ==========================================

function generateExamPaper(lv) {
    let paper = [];
    const isToeflZone = (lv >= 4);
    const amt = isToeflZone ? 3 : 2; // Porsi soal per modul

    const getMod = (data, level) => {
        if (!data || !Array.isArray(data)) return [];
        return data.filter(item => item.level === level).sort(() => 0.5 - Math.random());
    };

    // 1. Indoglish Buster
    const indoglish = (window[`indoglish_data${lv}`] || []).sort(() => 0.5 - Math.random()).slice(0, amt);
    // 2. Daily Vocab
    const vocab = getMod(window.DAILY_VOCAB, lv).slice(0, amt);
    // 3. Idioms
    const idioms = getMod(window.IDIOM_DATA, lv).slice(0, amt);
    // 4. Sentence Builder
    const sb = getMod(window.SENTENCE_BUILDER_EXERCISES, lv).slice(0, amt);
    // 5. Dictation
    const dict = getMod(window.dictationBank, lv).slice(0, amt);
    // 6. Tenses
    const tenses = generateTensesQuestions(isToeflZone ? 4 : 2);
    // 7. Story Mode
    const story = getMod(window.STORY_DATA, lv).slice(0, amt);
    // 8. Speaking
    const speaking = getMod(window.SPEAKING_DATA, lv).slice(0, amt);

    paper = [...indoglish, ...vocab, ...idioms, ...sb, ...dict, ...tenses, ...story, ...speaking];
    
    // Gabungkan dengan data statis EXAM_MASTER_DATA jika ada
    if (window.EXAM_MASTER_DATA && window.EXAM_MASTER_DATA["LV" + lv]) {
        paper = [...paper, ...window.EXAM_MASTER_DATA["LV" + lv]];
    }

    return paper.sort(() => 0.5 - Math.random());
}

function generateTensesQuestions(count) {
    const questions = [];
    const verbs = ["eat", "study", "work", "play", "sleep"];
    const subjects = ["I", "You", "They", "We", "He", "She", "It"];
    
    for(let i=0; i<count; i++) {
        const sub = subjects[Math.floor(Math.random() * subjects.length)];
        const correctBe = (sub === "I") ? "am" : (["He","She","It"].includes(sub) ? "is" : "are");

        questions.push({
            type: "choice",
            q: `Tenses Challenge: Manakah pasangan yang benar? [ ${sub.toUpperCase()} + BE ]`,
            opt: ["am", "is", "are", "be"].sort(() => 0.5 - Math.random()),
            a: correctBe,
            category: "TENSES"
        });
    }
    return questions;
}

function showAnswerReview() {
    let reviewRows = examHistory.map((item, index) => {
        let teacherExplanation = "";
        if (userState.isPremium) {
            teacherExplanation = `<div style="font-size: 11px; color: #666; margin-top: 5px; font-style: italic;">
                👨‍🏫 Penjelasan: ${item.explanation || "Analisis tata bahasa menunjukkan ini adalah pola standar level " + userState.currentLevel + "."}
            </div>`;
        } else {
            teacherExplanation = `<div style="font-size: 11px; color: #e67e22; margin-top: 5px; font-weight: bold;">
                🔒 Penjelasan Guru tersedia untuk user Premium.
            </div>`;
        }

        return `
        <div style="padding: 15px; border-bottom: 1px solid #eee; text-align: left; background: ${item.status ? '#f0fff4' : '#fff5f5'};">
            <div style="font-size: 11px; font-weight: bold; color: ${item.status ? '#27ae60' : '#c0392b'};">
                SOAL #${index + 1} - ${item.status ? 'BENAR' : 'SALAH'}
            </div>
            <div style="margin: 5px 0; font-size: 14px;">Q: ${item.question}</div>
            <div style="font-size: 13px;">
                Jawaban Anda: <span style="color: ${item.status ? '#27ae60' : '#c0392b'}">${item.userAns || '(Kosong)'}</span>
            </div>
            ${!item.status ? `<div style="font-size: 13px; color: #27ae60; font-weight: bold;">Seharusnya: ${item.correctAns}</div>` : ''}
            ${teacherExplanation}
        </div>`;
    }).join('');

    const reviewHTML = `
        <div style="max-height: 400px; overflow-y: auto; border-radius: 10px; border: 1px solid #ddd; background: white;">
            ${reviewRows}
        </div>
        <button class="btn-upgrade btn-premium" style="width:100%; margin-top:20px;" onclick="startGlobalLevelExam()">
            ULANGI UJIAN (SOAL BARU)
        </button>
    `;
    openGameOverlay(reviewHTML, "ULASAN JAWABAN");
}

function startExamSpeaking(targetText) {
    const btn = document.getElementById('exam-mic-btn');
    const status = document.getElementById('speaking-status');
    
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
        alert("Browser Anda tidak mendukung Speech Recognition.");
        return;
    }

    const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
    recognition.lang = 'en-US';
    
    status.innerText = "Mendengarkan...";
    btn.style.animation = "pulse 1s infinite";

    recognition.onresult = function(event) {
        const result = event.results[0][0].transcript;
        btn.style.animation = "none";
        checkExamAnswer(result);
    };

    recognition.onerror = function() {
        btn.style.animation = "none";
        status.innerText = "Gagal mendengar, coba lagi.";
    };

    recognition.start();
}