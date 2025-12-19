/**
 * LINGUAQUEST - STORY & READING ENGINE (REVISI V2.2)
 * Terintegrasi dengan VOCAB_MASTER & userState.currentLevel
 */

let storyBank = []; 
let currentStoryData = null; 
let storyScore = 0;
let currentQuestionIndex = 0;

/**
 * BLOK 1: SINKRONISASI DATA (CLOUD)
 */
async function syncStoryData() {
    try {
        console.log("Memulai sinkronisasi Reading dari Cloud...");
        // READING_URL harus sudah didefinisikan di config atau file lain
        const response = await fetch(READING_URL); 
        
        if (!response.ok) throw new Error("Gagal akses Sheets.");
        
        const csvText = await response.text();
        const lines = csvText.split('\n');
        
        const updatedBank = [];
        for (let i = 1; i < lines.length; i++) {
            if (!lines[i].trim()) continue;
            const cols = lines[i].split(/,(?=(?:(?:[^"]*"){2})*[^"]*$)/).map(c => c.replace(/^"|"$/g, '').trim());

            if (cols.length >= 9) {
                updatedBank.push({
                    level: parseInt(cols[0]) || 1, 
                    title: cols[1], 
                    content: cols[2], 
                    question: cols[3], 
                    options: [cols[4], cols[5], cols[6], cols[7]], 
                    correct: parseInt(cols[8]) || 0, 
                    explanation: cols[9] || "" 
                });
            }
        }
        storyBank = updatedBank;
        console.log("✅ Reading Bank Ready: " + storyBank.length + " rows.");
    } catch (e) {
        console.error("❌ Gagal Sinkronisasi Reading:", e.message);
    }
}

/**
 * BLOK 2: KONTROL PERMAINAN
 */
async function startStoryMode() {
    if (storyBank.length === 0) {
        await syncStoryData();
    }

    // PENYESUAIAN: Ambil angka level dari userState.currentLevel (1, 2, 3...)
    const levelNum = window.userState ? window.userState.currentLevel : 1;
    
    const questionsForLevel = storyBank.filter(s => s.level === levelNum);

    if (questionsForLevel.length === 0) {
        alert(`Maaf, Cerita untuk Level ${levelNum} belum tersedia.`);
        return;
    }

    const randomStoryTitle = questionsForLevel[0].title;
    const sameStoryQuestions = questionsForLevel.filter(q => q.title === randomStoryTitle);

    currentStoryData = {
        title: randomStoryTitle,
        content: highlightVocab(sameStoryQuestions[0].content), // Fitur Highlight Otomatis
        questions: sameStoryQuestions 
    };

    storyScore = 0;
    currentQuestionIndex = 0;
    renderReadingPhase();
}

/**
 * HELPER: Highlight Kata yang ada di daftar kosakata level saat ini
 */
function highlightVocab(text) {
    if (!window.VOCAB_MASTER) return text;
    const levelKey = "LV" + window.userState.currentLevel;
    const currentVocab = window.VOCAB_MASTER[levelKey] || [];
    
    let highlightedText = text;
    currentVocab.forEach(item => {
        // Regex untuk mencari kata yang sama persis (case insensitive)
        const regex = new RegExp(`\\b${item.word}\\b`, 'gi');
        highlightedText = highlightedText.replace(regex, `<span style="color:#4f46e5; font-weight:bold; border-bottom:2px solid #c7d2fe;">$&</span>`);
    });
    return highlightedText;
}

/**
 * BLOK 3: TAMPILAN UI
 */
function renderReadingPhase() {
    const levelDisplay = window.userState.currentLevel;
    
    // Memanggil fungsi dari main.js untuk membuka overlay
    openGameOverlay(`
        <div class="theory-card" style="max-height: 80vh; overflow-y: auto;">
            <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:15px">
                <span class="badge" style="background:#f5f3ff; color:#7c3aed; padding:5px 10px; border-radius:5px; font-size:0.8rem; font-weight:bold;">
                    📚 READING LEVEL ${levelDisplay}
                </span>
                <button onclick="closeGame()" style="background:none; border:none; font-size:1.5rem; cursor:pointer">&times;</button>
            </div>
        
            <h2 style="color:#1e293b; margin-bottom:10px;">${currentStoryData.title}</h2>
            <hr style="border:0; border-top:1px solid #eee; margin-bottom:15px;">
          
            <div class="story-text-content" style="font-size: 1.1rem; line-height: 1.8; color: #334155; text-align: justify; margin-bottom: 25px; white-space: pre-line;">
                ${currentStoryData.content}
            </div>

            <div style="background: #f0f9ff; padding: 15px; border-radius: 10px; border-left: 5px solid #0ea5e9; margin-bottom: 20px;">
                <small style="color:#0369a1;"><strong>Tips:</strong> Kata yang berwarna biru adalah kosakata target level ini!</small>
            </div>
            <button class="btn-upgrade btn-premium" style="width:100%" onclick="startStoryQuiz()">
                MULAI KUIS (+20 XP)
            </button>
        </div>
    `);
}

function startStoryQuiz() {
    renderQuizQuestion();
}

function renderQuizQuestion() {
    const q = currentStoryData.questions[currentQuestionIndex];
    const progress = (currentQuestionIndex / currentStoryData.questions.length) * 100;

    openGameOverlay(`
        <div class="theory-card">
            <div class="progress-container" style="margin-bottom: 20px; background:#eee; border-radius:10px; height:8px;">
                <div id="progress-fill" style="width: ${progress}%; height: 100%; background: #4f46e5; border-radius: 10px; transition: 0.4s;"></div>
            </div>

            <p style="font-size: 0.8rem; color: #64748b; margin-bottom:5px; font-weight:bold;">PERTANYAAN ${currentQuestionIndex + 1} / ${currentStoryData.questions.length}</p>
            <h3 style="margin-bottom: 20px; line-height: 1.4; color:#1e293b;">${q.question}</h3>

            <div id="quiz-options" style="display: flex; flex-direction: column; gap: 12px;">
                ${q.options.map((opt, i) => `
                    <button class="sub-card" style="text-align: left; padding: 15px; cursor: pointer; border: 2px solid #e2e8f0; background: white; border-radius:12px; transition:0.2s;" onclick="checkStoryAnswer(${i})">
                        <strong style="margin-right:10px; color:#4f46e5">${String.fromCharCode(65 + i)}.</strong> ${opt}
                    </button>
                `).join('')}
            </div>
           
            <div id="quiz-feedback" style="margin-top: 20px; display: none; padding: 15px; border-radius: 12px; font-size:0.95rem; line-height:1.5"></div>
        </div>
    `);
}

function checkStoryAnswer(selectedIndex) {
    const q = currentStoryData.questions[currentQuestionIndex];
    const feedbackDiv = document.getElementById('quiz-feedback');
    const optionsDiv = document.getElementById('quiz-options');
    const buttons = optionsDiv.querySelectorAll('button');

    buttons.forEach(btn => btn.disabled = true);

    if (selectedIndex === q.correct) {
        storyScore++;
        feedbackDiv.style.display = 'block';
        feedbackDiv.style.background = '#f0fdf4';
        feedbackDiv.style.color = '#166534';
        feedbackDiv.style.border = '1px solid #bbf7d0';
        feedbackDiv.innerHTML = `<strong>✨ Benar!</strong><br>${q.explanation}`;
        buttons[selectedIndex].style.borderColor = '#22c55e';
        buttons[selectedIndex].style.background = '#f0fdf4';
    } else {
        feedbackDiv.style.display = 'block';
        feedbackDiv.style.background = '#fef2f2';
        feedbackDiv.style.color = '#991b1b';
        feedbackDiv.style.border = '1px solid #fecaca';
        feedbackDiv.innerHTML = `<strong>❌ Kurang Tepat</strong><br>${q.explanation}`;
        buttons[selectedIndex].style.borderColor = '#ef4444';
        buttons[q.correct].style.borderColor = '#22c55e'; 
    }

    const nextBtn = document.createElement('button');
    nextBtn.className = "btn-upgrade btn-premium";
    nextBtn.style.marginTop = "20px";
    nextBtn.style.width = "100%";
    nextBtn.innerText = currentQuestionIndex < currentStoryData.questions.length - 1 ? "Lanjut ke Soal Berikutnya" : "Lihat Skor Akhir";
    
    nextBtn.onclick = () => {
        currentQuestionIndex++;
        if (currentQuestionIndex < currentStoryData.questions.length) {
            renderQuizQuestion();
        } else {
            finishStoryMode();
        }
    };
    feedbackDiv.appendChild(nextBtn);
}

function finishStoryMode() {
    const totalXP = storyScore * 20; // Hadiah lebih besar untuk Reading
    if (typeof window.userState.points !== 'undefined') {
        window.userState.points += totalXP;
    }

    openGameOverlay(`
        <div class="theory-card" style="text-align: center; padding: 40px 20px;">
            <div style="font-size: 5rem; margin-bottom: 10px;">🏆</div>
            <h2 style="color:#1e293b">Story Challenge Selesai!</h2>
            <p style="font-size: 1.1rem; color:#64748b; margin-bottom: 25px;">
                Anda menjawab benar <strong>${storyScore}</strong> dari ${currentStoryData.questions.length} soal.
            </p>
          
            <div style="background: #fffbeb; padding: 20px; border-radius: 15px; margin-bottom: 30px; border: 1px dashed #fcd34d;">
                <span style="display:block; font-size:0.9rem; color:#92400e">HADIAH XP</span>
                <span style="font-size: 2rem; font-weight: bold; color: #d97706;">+${totalXP} XP</span>
            </div>

            <button class="btn-upgrade btn-premium" style="width:100%; padding:15px;" onclick="closeGame()">
                KEMBALI KE MENU
            </button>
        </div>
    `);
    
    // Update UI jika fungsi tersedia
    if (typeof updateUI === 'function') updateUI();
}