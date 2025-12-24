/**
 * LINGUAQUEST - STORY & READING ENGINE (REVISI V2.3)
 * Dioptimalkan untuk Format: 1 Teks Panjang + Multiple Questions
 */

let storyBank = []; 
let currentStoryData = null; 
let storyScore = 0;
let currentQuestionIndex = 0;

/**
 * BLOK 1: SINKRONISASI DATA
 * Mendukung data lokal (STORY_BANK) atau Cloud (Sheets)
 */
async function syncStoryData() {
    // Jika ada data lokal di window.STORY_BANK, gunakan itu sebagai prioritas
    if (window.STORY_BANK && window.STORY_BANK.length > 0) {
        storyBank = window.STORY_BANK;
        console.log("✅ Reading Bank Ready (Local): " + storyBank.length + " stories.");
        return;
    }

    try {
        console.log("Memulai sinkronisasi Reading dari Cloud...");
        const response = await fetch(READING_URL); 
        if (!response.ok) throw new Error("Gagal akses Sheets.");
        
        const csvText = await response.text();
        const lines = csvText.split('\n');
        
        const updatedBank = [];
        // Logika CSV disini perlu disesuaikan jika kolom kuis bertambah banyak
        // Untuk saat ini kita asumsikan data sudah terisi di STORY_BANK lokal
        storyBank = updatedBank;
    } catch (e) {
        console.error("❌ Gagal Sinkronisasi Reading:", e.message);
    }
}

/**
 * BLOK 2: KONTROL PERMAINAN
 */
async function startStoryMode() {
    // 1. Cek Limit Akses (Fitur Freemium)
    if (typeof checkPremiumAccess === 'function') {
        if (!checkPremiumAccess('story')) return;
    }

    if (storyBank.length === 0) {
        await syncStoryData();
    }

    const levelNum = window.userState ? window.userState.currentLevel : 1;
    const storiesForLevel = storyBank.filter(s => s.level === levelNum);

    if (storiesForLevel.length === 0) {
        alert(`Maaf, Cerita untuk Level ${levelNum} belum tersedia.`);
        return;
    }

    // Ambil 1 cerita acak dari bank level tersebut
    const selectedStory = storiesForLevel[Math.floor(Math.random() * storiesForLevel.length)];

    currentStoryData = {
        title: selectedStory.title,
        content: highlightVocab(selectedStory.content), // Fitur Highlight Otomatis
        questions: selectedStory.questions // Ini sekarang adalah Array of 5 questions
    };

    storyScore = 0;
    currentQuestionIndex = 0;
    renderReadingPhase();
}

/**
 * HELPER: Highlight Kata (Sesuai VOCAB_MASTER Anda)
 */
function highlightVocab(text) {
    // 1. Proteksi jika data tidak ada
    if (!window.VOCAB_MASTER || !text) return text;
    
    const levelKey = "LV" + (window.userState.currentLevel || 1);
    const currentVocab = window.VOCAB_MASTER[levelKey] || [];
    
    let highlightedText = text;

    // 2. Urutkan vocab dari yang terpanjang ke terpendek
    // Penting! Agar "Ice Cream" di-highlight lebih dulu sebelum kata "Ice"
    const sortedVocab = [...currentVocab].sort((a, b) => b.word.length - a.word.length);
    
    sortedVocab.forEach(item => {
        // Regex: \b (batas kata), gi (global & case insensitive), 
        // dan (?![^<]*>) memastikan tidak mengganti teks di dalam tag HTML
        const regex = new RegExp(`\\b${item.word}\\b(?![^<]*>)`, 'gi');
        
        highlightedText = highlightedText.replace(regex, (matched) => {
            return `<span title="${item.meaning}" style="color:#4f46e5; font-weight:bold; border-bottom:2px solid #c7d2fe; cursor:help;">${matched}</span>`;
        });
    });

    return highlightedText;
}

/**
 * BLOK 3: TAMPILAN UI
 */
function renderReadingPhase() {
    openGameOverlay(`
        <div class="theory-card" style="max-height: 85vh; overflow-y: auto;">
            <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:15px">
                <span class="badge" style="background:#f5f3ff; color:#7c3aed; padding:5px 10px; border-radius:5px; font-size:0.8rem; font-weight:bold;">
                    📚 READING LEVEL ${window.userState.currentLevel}
                </span>
                <button onclick="closeGame()" style="background:none; border:none; font-size:1.5rem; cursor:pointer">&times;</button>
            </div>
        
            <h2 style="color:#1e293b; margin-bottom:10px;">${currentStoryData.title}</h2>
            <hr style="border:0; border-top:1px solid #eee; margin-bottom:15px;">
          
            <div class="story-text-content" style="font-size: 1.15rem; line-height: 1.8; color: #334155; text-align: justify; margin-bottom: 25px; white-space: pre-line; background: #fff; padding: 15px; border-radius: 10px;">
                ${currentStoryData.content}
            </div>

            <div style="background: #f0f9ff; padding: 15px; border-radius: 10px; border-left: 5px solid #0ea5e9; margin-bottom: 20px;">
                <small style="color:#0369a1;"><strong>Instruksi:</strong> Baca teks di atas dengan teliti, lalu jawab 5 pertanyaan di tahap berikutnya.</small>
            </div>
            <button class="btn-upgrade btn-premium" style="width:100%; padding: 18px; font-weight: bold;" onclick="startStoryQuiz()">
                SAYA SUDAH SELESAI MEMBACA
            </button>
        </div>
    `);
}

function startStoryQuiz() {
    renderQuizQuestion();
}

function renderQuizQuestion() {
    const q = currentStoryData.questions[currentQuestionIndex];
    // Progress bar dihitung dari total soal (biasanya 5)
    const progress = ((currentQuestionIndex) / currentStoryData.questions.length) * 100;

    openGameOverlay(`
        <div class="theory-card">
            <div class="progress-container" style="margin-bottom: 20px; background:#eee; border-radius:10px; height:10px;">
                <div id="progress-fill" style="width: ${progress}%; height: 100%; background: #4f46e5; border-radius: 10px; transition: 0.4s;"></div>
            </div>

            <p style="font-size: 0.85rem; color: #64748b; margin-bottom:10px; font-weight:bold; letter-spacing: 1px;">
                PERTANYAAN ${currentQuestionIndex + 1} / ${currentStoryData.questions.length}
            </p>
            <h3 style="margin-bottom: 25px; line-height: 1.5; color:#1e293b; font-size: 1.3rem;">${q.q}</h3>

            <div id="quiz-options" style="display: flex; flex-direction: column; gap: 12px;">
                ${q.opt.map((option, i) => `
                    <button class="sub-card" style="text-align: left; padding: 16px; cursor: pointer; border: 2px solid #e2e8f0; background: white; border-radius:12px; font-size: 1rem;" onclick="checkStoryAnswer(${i})">
                        <strong style="margin-right:10px; color:#4f46e5">${String.fromCharCode(65 + i)}.</strong> ${option}
                    </button>
                `).join('')}
            </div>
           
            <div id="quiz-feedback" style="margin-top: 20px; display: none; padding: 15px; border-radius: 12px;"></div>
        </div>
    `);
}

function checkStoryAnswer(selectedIndex) {
    const q = currentStoryData.questions[currentQuestionIndex];
    const feedbackDiv = document.getElementById('quiz-feedback');
    const optionsDiv = document.getElementById('quiz-options');
    const buttons = optionsDiv.querySelectorAll('button');

    // Kunci semua tombol agar tidak bisa klik ganda
    buttons.forEach(btn => btn.style.pointerEvents = 'none');

    const isCorrect = selectedIndex === q.ans;

    // Persiapan variabel untuk pesan umpan balik
    let feedbackContent = "";

    if (isCorrect) {
        storyScore++; // Menambah skor lokal untuk kalkulasi akhir
        feedbackContent = `
            <div style="color: #166534; background: #f0fdf4; padding: 15px; border-radius: 10px; border: 1px solid #bbf7d0;">
                <strong>✨ Benar! (+5 XP)</strong>`;
        
        buttons[selectedIndex].style.borderColor = '#22c55e';
        buttons[selectedIndex].style.background = '#f0fdf4';
    } else {
        feedbackContent = `
            <div style="color: #991b1b; background: #fef2f2; padding: 15px; border-radius: 10px; border: 1px solid #fecaca;">
                <strong>❌ Kurang Tepat</strong><br>
                Jawaban benar: <b>${q.opt[q.ans]}</b>`;
        
        buttons[selectedIndex].style.borderColor = '#ef4444';
        buttons[q.ans].style.borderColor = '#22c55e'; 
    }

    // --- BLOK PENJELASAN GURU (PREMIUM ONLY) ---
    if (window.userState && window.userState.isPremium) {
        // Jika user premium, tampilkan isi q.hint
        feedbackContent += `
            <hr style="margin: 10px 0; border: 0; border-top: 1px solid #ccc; opacity: 0.3;">
            <p style="font-size: 0.9rem; color: #1e293b; line-height: 1.4;">
                <strong>👨‍🏫 Penjelasan Guru:</strong><br>${q.hint || "Pilihan ini tepat berdasarkan konteks teks di atas."}
            </p>`;
    } else {
        // Jika user gratis, tampilkan pesan terkunci
        feedbackContent += `
            <div style="margin-top: 10px; padding: 10px; background: #fffbeb; border-radius: 8px; font-size: 0.8rem; border: 1px dashed #fcd34d; color: #92400e;">
                🔒 <i>Penjelasan Guru hanya tersedia untuk member <b>Premium</b>.</i>
            </div>`;
    }

    feedbackContent += `</div>`;
    feedbackDiv.innerHTML = feedbackContent;
    feedbackDiv.style.display = 'block';

    // Tombol Lanjut (Logika navigasi tetap sama)
    const nextBtn = document.createElement('button');
    nextBtn.className = "btn-upgrade btn-premium";
    nextBtn.style.cssText = "margin-top: 20px; width: 100%; padding: 15px; font-weight: bold; cursor: pointer;";
    nextBtn.innerText = currentQuestionIndex < currentStoryData.questions.length - 1 ? "SOAL BERIKUTNYA" : "LIHAT HASIL AKHIR";
    
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
    // 1. Hitung XP Baru (5 XP per soal benar, bukan 20)
    const xpGained = storyScore * 5; 
    
    // 2. Hitung Bonus Gems untuk tampilan (Logika detail ada di processStoryReward)
    let gemsGained = 0;
    const totalQuestions = currentStoryData.questions.length;
    
    if (storyScore === totalQuestions) {
        gemsGained = 3; // Bonus Perfect
    } else if (storyScore >= 3) {
        gemsGained = 1; // Bonus Lulus
    }

    // 3. Panggil fungsi inti di main.js untuk update database & state
    if (typeof processStoryReward === 'function') {
        processStoryReward(storyScore, totalQuestions);
    }

    // 4. Tampilkan Overlay Hasil dengan UI Reward baru
    openGameOverlay(`
        <div class="theory-card" style="text-align: center; padding: 40px 20px;">
            <div style="font-size: 5rem; margin-bottom: 10px;">🏆</div>
            <h2 style="color:#1e293b">Misi Selesai!</h2>
            <p style="font-size: 1.1rem; color:#64748b; margin-bottom: 25px;">
                Hasil pemahaman bacaan Anda:<br>
                <strong style="font-size: 1.5rem; color:#4f46e5;">${storyScore} / ${totalQuestions}</strong> Benar
            </p>
          
            <div style="display: flex; gap: 10px; justify-content: center; margin-bottom: 30px;">
                <div style="flex: 1; background: #f0f9ff; padding: 15px; border-radius: 15px; border: 1px solid #bae6fd;">
                    <span style="display:block; font-size:0.8rem; color:#0369a1; font-weight:bold;">XP DIDAPAT</span>
                    <span style="font-size: 1.8rem; font-weight: bold; color: #0284c7;">+${xpGained}</span>
                </div>
                
                ${gemsGained > 0 ? `
                <div style="flex: 1; background: #fff1f2; padding: 15px; border-radius: 15px; border: 1px solid #fecdd3;">
                    <span style="display:block; font-size:0.8rem; color:#be123c; font-weight:bold;">GEMS</span>
                    <span style="font-size: 1.8rem; font-weight: bold; color: #e11d48;">+${gemsGained} 💎</span>
                </div>
                ` : ''}
            </div>

            <button class="btn-upgrade btn-premium" style="width:100%; padding:18px; font-weight:bold;" onclick="location.reload()">
                KLAIM REWARD & KEMBALI
            </button>
        </div>
    `);
}