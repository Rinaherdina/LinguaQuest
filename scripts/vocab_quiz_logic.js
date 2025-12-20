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
        let correctAns = item.translation || item.meaning;
        let options = [correctAns];
        while (options.length < 4) {
            let randomItem = vocabList[Math.floor(Math.random() * vocabList.length)];
            let randomWord = randomItem.translation || randomItem.meaning;
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
    const minScoreToPass = total * 1.5; // Contoh: Benar minimal 8 dari 10 soal (skor 16)
    const isPassed = finalScore >= minScoreToPass;

    let resultHTML = "";

    if (isPassed) {
        // LOGIKA NAIK LEVEL
        if (userState.currentLevel < 5) {
            userState.currentLevel += 1;
            userState.points += finalScore;
            saveUserData(); // Simpan ke LocalStorage
            
            resultHTML = `
                <i class="fas fa-medal" style="font-size: 4rem; color: #ffca28; margin-bottom: 20px;"></i>
                <h2 style="color: #2e7d32;">SELAMAT! LULUS!</h2>
                <p>Skor kamu: <b>${finalScore}</b>. Kamu sekarang naik ke <b>Level ${userState.currentLevel}</b>!</p>
            `;
        } else {
            resultHTML = `<h2>Luar Biasa!</h2><p>Kamu telah mencapai level maksimal.</p>`;
        }
    } else {
        resultHTML = `
            <i class="fas fa-times-circle" style="font-size: 4rem; color: #e53935; margin-bottom: 20px;"></i>
            <h2 style="color: #c62828;">BELUM LULUS</h2>
            <p>Skor kamu: ${finalScore}. Minimal skor untuk naik level adalah ${minScoreToPass}. Ayo belajar lagi!</p>
        `;
    }

    let html = `
        <div class="theory-card" style="text-align:center; padding: 40px 20px;">
            ${resultHTML}
            <button class="btn-upgrade btn-premium" style="margin-top:25px; width:100%;" onclick="closeGame(); updateUI();">
                KEMBALI KE BERANDA
            </button>
        </div>
    `;
    openGameOverlay(html, "HASIL UJIAN");
}