// ==========================================
// 1. DATA SOAL UJIAN (EXAM_MASTER)
// ==========================================
window.EXAM_MASTER = {
    "LV1": [
        // TIPE: Choice (Vocab/Grammar)
        { 
            type: "choice", 
            q: "What is the English word for 'Buku'?", 
            opt: ["Pen", "Eraser", "Book", "Map"], 
            a: "Book" 
        },
        { 
            type: "choice", 
            q: "Complete the sentence: 'I ___ a student.'", 
            opt: ["is", "am", "are", "be"], 
            a: "am" 
        },
        // TIPE: Listening
        { 
            type: "listening", 
            q: "Dengarkan dan tulis kalimatnya:", 
            audio: "Good morning everyone", 
            a: "Good morning everyone" 
        },
        // TIPE: Choice (Grammar/Sentence)
        { 
            type: "choice", 
            q: "Susun kata ini: (Like) - (I) - (Coffee)", 
            opt: ["I like coffee", "Coffee like I", "Like I coffee", "I coffee like"], 
            a: "I like coffee" 
        },
        { 
            type: "choice", 
            q: "What is the opposite (lawan kata) of 'BIG'?", 
            opt: ["Large", "Huge", "Small", "Tall"], 
            a: "Small" 
        }
    ],
    "LV2": [
        /* Masukkan 50 soal Level 2 di sini nanti */
    ]
};

// ==========================================
// 2. ENGINE LOGIC (KODE-KODE YANG KITA BAHAS TADI)
// ==========================================
let currentExamIndex = 0;
let examScore = 0;
let examDataHolder = [];

function startGlobalLevelExam() {
    const currentLv = userState.currentLevel || 1;
    examDataHolder = window.EXAM_MASTER["LV" + currentLv];

    if (!examDataHolder || examDataHolder.length === 0) {
        return alert("Soal ujian untuk level " + currentLv + " belum tersedia.");
    }

    // Reset state ujian
    currentExamIndex = 0;
    examScore = 0;
    
    showExamQuestion();
}

function showExamQuestion() {
    const qData = examDataHolder[currentExamIndex];
    let html = `
        <div style="text-align:center;">
            <div style="background:#eee; padding:5px; border-radius:5px; font-size:12px; margin-bottom:15px;">
                SOAL ${currentExamIndex + 1} / ${examDataHolder.length}
            </div>
    `;

    if (qData.type === "choice") {
        html += `
            <h2 style="margin-bottom:20px;">${qData.q}</h2>
            <div style="display:grid; gap:10px;">
                ${qData.opt.map(o => `<button class="btn-upgrade btn-secondary" onclick="checkExamAnswer('${o.replace(/'/g, "\\'")}')">${o}</button>`).join('')}
            </div>
        `;
    } else if (qData.type === "listening") {
        html += `
            <button onclick="playVoice('${qData.audio}', 0.8)" class="node-circle" style="width:70px; height:70px; background:#2196F3; color:white; border-radius:50%; margin:0 auto 20px;">
                <i class="fas fa-volume-up"></i>
            </button>
            <p>${qData.q}</p>
            <input type="text" id="exam-input" placeholder="Jawaban..." style="width:100%; padding:12px; border:2px solid #ddd; border-radius:10px;">
            <button class="btn-upgrade btn-premium" style="width:100%; margin-top:15px;" onclick="checkExamAnswer(document.getElementById('exam-input').value)">KIRIM</button>
        `;
    }

    html += `</div>`;
    openGameOverlay(html, "FINAL EXAM LV " + userState.currentLevel);
}

function checkExamAnswer(userAnswer) {
    const q = examDataHolder[currentExamIndex];
    const isCorrect = userAnswer.toLowerCase().trim() === q.a.toLowerCase().trim();

    if (isCorrect) {
        examScore++;
        playSuccessSound();
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
    const wrongAnswers = totalQuestions - examScore;

    let resultHTML = `
        <div style="text-align:center; padding: 10px;">
            <div style="font-size: 80px; margin-bottom: 10px;">
                ${isPassed ? '🎉' : '📚'}
            </div>
            
            <h2 style="color: ${isPassed ? '#2ecc71' : '#e74c3c'}; margin-bottom: 5px;">
                ${isPassed ? 'LUAR BIASA! ANDA LULUS' : 'YUK, COBA LAGI!'}
            </h2>
            <p style="color: #666; margin-bottom: 20px;">
                Ujian Final Level ${userState.currentLevel}
            </p>

            <div style="background: #f8f9fa; border-radius: 20px; padding: 20px; margin-bottom: 25px; border: 2px solid ${isPassed ? '#2ecc71' : '#eee'};">
                <div style="font-size: 14px; color: #888; text-transform: uppercase; letter-spacing: 1px;">Skor Akhir</div>
                <div style="font-size: 48px; font-weight: bold; color: #333;">${finalScore}%</div>
                
                <div style="display: flex; justify-content: space-around; margin-top: 15px; border-top: 1px solid #ddd; padding-top: 15px;">
                    <div>
                        <div style="color: #2ecc71; font-weight: bold; font-size: 18px;">${examScore}</div>
                        <div style="font-size: 11px; color: #999;">BENAR</div>
                    </div>
                    <div>
                        <div style="color: #e74c3c; font-weight: bold; font-size: 18px;">${wrongAnswers}</div>
                        <div style="font-size: 11px; color: #999;">SALAH</div>
                    </div>
                </div>
            </div>

            <p style="font-size: 14px; color: #555; margin-bottom: 25px; line-height: 1.5;">
                ${isPassed 
                    ? `Selamat! Kamu telah menguasai materi Level ${userState.currentLevel}. Sekarang pintu Level ${userState.currentLevel + 1} telah terbuka lebar!` 
                    : `Kamu butuh <b>${passingGrade}%</b> untuk lulus. Jangan menyerah, sisa <b>${passingGrade - finalScore}%</b> lagi menuju Level berikutnya!`}
            </p>

            ${isPassed ? `
                <button class="btn-upgrade btn-premium" style="width:100%; padding: 15px;" onclick="proceedToNextLevel()">
                    MASUK LEVEL ${userState.currentLevel + 1} <i class="fas fa-arrow-right"></i>
                </button>
            ` : `
                <button class="btn-upgrade btn-secondary" style="width:100%; margin-bottom: 10px;" onclick="startGlobalLevelExam()">
                    ULANGI UJIAN
                </button>
                <button onclick="closeGame()" style="background:none; border:none; color:#888; cursor:pointer; font-size: 14px;">
                    Kembali ke Beranda
                </button>
            `}
        </div>
    `;

    openGameOverlay(resultHTML, isPassed ? "CONGRATULATIONS!" : "EXAM RESULT");
}

function generateExamPaper(lv) {
    // Ambil 5 soal SB level ini
    const sb = SENTENCE_BUILDER_EXERCISES.filter(s => s.level === lv).sort(() => 0.5 - Math.random()).slice(0, 5);
    // Ambil 5 soal Dictation level ini
    const dict = (window.dictationBank || []).filter(d => d.level === lv).sort(() => 0.5 - Math.random()).slice(0, 5);
    
    return [...sb, ...dict].sort(() => 0.5 - Math.random());
}

function proceedToNextLevel() {
    // 1. Tambahkan Level
    userState.currentLevel++;
    
    // 2. Berikan bonus Gems sebagai reward kelulusan
    userState.gems += 50; 
    
    // 3. Simpan data
    saveUserData();
    
    // 4. Tutup overlay dan refresh peta arena
    closeGame();
    if (typeof renderArena === 'function') renderArena();
    
    // 5. Beri notifikasi kecil
    alert("Selamat! +50 Gems bonus kelulusan!");
}
