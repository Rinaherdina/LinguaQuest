/**
 * FUNGSI MULAI KUIS KILAT KOSAKATA
 */
function startVocabQuiz() {
    const levelKey = "LV" + (window.userState.currentLevel || 1);
    const vocabList = window.VOCAB_MASTER[levelKey];
    
    if (!vocabList || vocabList.length < 4) {
        alert("Butuh minimal 4 kata di level ini untuk memulai kuis!");
        return;
    }

    // Ambil 5-10 kata secara acak untuk kuis sesi ini
    const quizData = [...vocabList].sort(() => 0.5 - Math.random()).slice(0, 10);
    let currentStep = 0;
    let score = 0;

    const showQuestion = () => {
        const item = quizData[currentStep];
        const progress = ((currentStep + 1) / quizData.length) * 100;
        
        // Buat pilihan jawaban (1 benar, 3 salah)
        let options = [item.translation];
        while (options.length < 4) {
            let randomWord = vocabList[Math.floor(Math.random() * vocabList.length)].translation;
            if (!options.includes(randomWord)) options.push(randomWord);
        }
        options.sort(() => 0.5 - Math.random());

        let html = `
            <div class="game-header">
                <div class="progress-container">
                    <div id="progress-fill" style="width: ${progress}%;"></div>
                </div>
            </div>
            <div class="theory-card" style="text-align:center;">
                <span class="badge" style="background:#e1f5fe; color:var(--primary-blue);">${item.type}</span>
                <h1 style="font-size: 2.5rem; margin: 20px 0; color: var(--text-dark);">${item.word}</h1>
                <p style="color: #666; font-style: italic; margin-bottom: 30px;">"${item.example}"</p>
                
                <div style="display: grid; gap: 12px;">
                    ${options.map(opt => `
                        <button class="word-chip" style="width:100%; margin:0; padding:15px;" 
                                onclick="checkVocabAnswer('${opt}', '${item.translation}', this)">
                            ${opt}
                        </button>
                    `).join('')}
                </div>
            </div>
        `;
        
        openGameOverlay(html);
    };

    // Fungsi internal untuk cek jawaban
    window.checkVocabAnswer = (selected, correct, btn) => {
        const buttons = document.querySelectorAll('.word-chip');
        buttons.forEach(b => b.style.pointerEvents = 'none'); // Disable klik ganda

        if (selected === correct) {
            btn.style.background = "#d3f9d8";
            btn.style.borderColor = "#2b8a3e";
            score += 2;
            window.userState.gems += 1; // Bonus kecil
        } else {
            btn.style.background = "#fff5f5";
            btn.style.borderColor = "#c92a2a";
            // Tampilkan jawaban yang benar
            buttons.forEach(b => {
                if (b.innerText.trim() === correct) b.style.background = "#d3f9d8";
            });
        }

        setTimeout(() => {
            currentStep++;
            if (currentStep < quizData.length) {
                showQuestion();
            } else {
                finishVocabQuiz(score, quizData.length);
            }
        }, 1200);
    };

    showQuestion();
}

function finishVocabQuiz(finalScore, total) {
    let html = `
        <div class="theory-card" style="text-align:center; padding-top: 50px;">
            <i class="fas fa-trophy" style="font-size: 4rem; color: gold; margin-bottom: 20px;"></i>
            <h2>Latihan Selesai!</h2>
            <p style="margin: 10px 0 25px 0; color: #666;">Kamu berhasil menguasai kosakata baru hari ini.</p>
            
            <div style="background: #f0f7ff; padding: 20px; border-radius: 15px; margin-bottom: 20px;">
                <div style="font-size: 0.9rem; color: #4facfe;">TOTAL SKOR</div>
                <div style="font-size: 2rem; font-weight: bold; color: var(--primary-blue);">+${finalScore} XP</div>
            </div>

            <button class="btn-upgrade btn-premium" onclick="closeGame(); updateUI();">
                KEMBALI KE BERANDA
            </button>
        </div>
    `;
    openGameOverlay(html);
}