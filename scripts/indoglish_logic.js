// --- STATE MANAGEMENT INDOGLISH (Revisi Anti-Error) ---
// Jangan melakukan operasi .slice() di sini karena data belum dimuat
window.indoglishCurrentIndex = 0;
window.allQuestions = []; 

let indoglishCurrentIndex = 0;
window.allQuestions = []; // Gunakan window agar global

function startIndoglishBuster() {
    if (typeof canPlayModule === 'function' && !canPlayModule('indoglish')) return; 

    const lv = window.userState.currentLevel || 1;
    // PANGGIL DATA SESUAI LEVEL
    const sourceData = window[`indoglish_data${lv}`];

    if (!sourceData || sourceData.length === 0) {
        showToast("Materi level ini sedang disiapkan!", "error");
        return;
    }

    // PINDAHKAN LOGIKA DAILY SEED KE SINI
    const today = new Date().getDate(); 
    const startIndex = (today * 5) % sourceData.length; 
    let selected = sourceData.slice(startIndex, startIndex + 5);

    if (selected.length < 5) {
        selected = selected.concat(sourceData.slice(0, 5 - selected.length));
    }

    window.allQuestions = selected; 
    window.indoglishCurrentIndex = 0; 

    renderIndoglishStep();
}

/**
 * Menampilkan Soal ke Overlay
 */
function renderIndoglishStep() {
    const data = window.currentIndoglishSession[indoglishCurrentIndex];
    
    const html = `
        <div class="theory-card" style="text-align:center; animation: fadeIn 0.5s;">
            <div style="margin-bottom:15px;">
                <span class="badge" style="background:#ff9800; color:white; padding:5px 12px; border-radius:20px; font-size:0.7rem;">
                    INDOGLISH BUSTER LV.${userState.currentLevel}
                </span>
            </div>
            
            <h2 style="margin-bottom:20px; color:#333;">${data.question}</h2>
            
            <div id="indoglish-options" style="display:grid; gap:12px;">
                ${data.options.map(opt => `
                    <button class="indoglish-opt-btn" 
                            onclick="processIndoglishAnswer('${opt}', '${data.correctAnswer}', '${data.explanation.replace(/'/g, "\\'")}')">
                        ${opt}
                    </button>
                `).join('')}
            </div>
            
            <div id="indoglish-explanation-box" style="display:none; margin-top:20px; padding:15px; border-radius:12px; text-align:left; line-height:1.5;">
            </div>
        </div>
    `;

    openGameOverlay(html, "MISSION: ANTI-INDOGLISH");
}

/**
 * Logika Cek Jawaban
 */
function processIndoglishAnswer(selected, correct, explanation) {
    const box = document.getElementById('indoglish-explanation-box');
    const buttons = document.querySelectorAll('#indoglish-options button');
    
    // Kunci tombol agar tidak spam
    buttons.forEach(b => b.disabled = true);

    // Cek apakah user berhak melihat penjelasan (Admin/Premium)
    const canSeeExplanation = userState.isPremium || window.isAdminMode;

    if (selected === correct) {
        // 1. Reward & Sound
        playFeedback('success');
        addXP(15); 

        // 2. Feedback Visual
        box.style.display = 'block';
        box.style.background = '#e8f5e9';
        box.style.color = '#2e7d32';
        
        // Logika Premium: Hanya tampilkan penjelasan jika premium/admin
        if (canSeeExplanation) {
            box.innerHTML = `<b>✅ Perfect!</b><br>${explanation}`;
        } else {
            box.innerHTML = `<b>✅ Benar!</b><br><small>Upgrade Premium untuk melihat bedah materinya.</small>`;
        }

        // 3. Navigasi ke Soal Berikutnya / Penutup
        setTimeout(() => {
            indoglishCurrentIndex++;
            // Menggunakan window.currentIndoglishSession (hasil filter 5 soal tadi)
            if (indoglishCurrentIndex < window.currentIndoglishSession.length) {
                renderIndoglishStep();
            } else {
                // Panggil layar ringkasan XP
                finishIndoglishSession();
            }
        }, 2500);

    } else {
        // 1. Penalti Nyawa (Fungsi Global dari main.js)
        handleWrong(); 
        if (typeof playErrorSound === 'function') playErrorSound();

        // 2. Tampilkan Feedback Merah
        box.style.display = 'block';
        box.style.background = '#ffebee';
        box.style.color = '#c62828';

        if (canSeeExplanation) {
            box.innerHTML = `<b>❌ Indoglish Alert!</b><br>${explanation}`;
        } else {
            box.innerHTML = `<b>❌ Kurang Tepat!</b><br><small>Jawaban yang benar adalah: <b>${correct}</b>. Lihat penjelasannya di Premium.</small>`;
        }

        // 3. Beri kesempatan ulang jika nyawa masih ada
        setTimeout(() => {
            if (userState.lives > 0 || canSeeExplanation) {
                buttons.forEach(b => b.disabled = false);
                box.style.display = 'none';
            }
        }, 3000);
    }
}

/**
 * Mengambil 5 soal acak dari bank data
 */
function getRandomIndoglishQuestions(allQuestions, limit = 5) {
    // 1. Acak seluruh urutan soal
    const shuffled = [...allQuestions].sort(() => 0.5 - Math.random());
    
    // 2. Ambil sejumlah limit (misal 5)
    return shuffled.slice(0, limit);
}

function handleAnswer(selectedOption, correctAnswer, explanation) {
    if (selectedOption === correctAnswer) {
        // Logika Menang
        playSuccessSound();
        addXP(10); 
        showNextButton();
    } else {
        // Logika Kalah (Sistem Nyawa)
        decreaseLife(); // Fungsi yang mengurangi nyawa di profil
        showExplanationPopUp(explanation); // Menampilkan kenapa Indoglish itu salah
        
        if (currentLife <= 0) {
            showPremiumWall(); // Arahkan ke iklan/premium
        }
    }
}

function showIndoglishFeedback(isCorrect, data) {
    const box = document.getElementById('indoglish-explanation-box');
    
    if (userState.isPremium || window.isAdminMode) {
        // TAMPILAN PREMIUM: Penjelasan Lengkap
        box.innerHTML = isCorrect ? 
            `✅ <b>Correct!</b><br>${data.explanation}` : 
            `❌ <b>Wrong!</b><br>${data.explanation}<br><br><i>Kenapa salah? ${data.wrongReason}</i>`;
    } else {
        // TAMPILAN FREE: Singkat saja
        box.innerHTML = isCorrect ? 
            `✅ <b>Jawaban Benar!</b>` : 
            `❌ <b>Jawaban Salah!</b><br><small>Upgrade Premium untuk melihat penjelasan guru.</small>`;
    }
    box.style.display = 'block';
}

function finishIndoglishSession() {
    // 1. Update Progres Harian di UserState
    if (userState.stats.indoglish) {
        userState.stats.indoglish.doneToday += 1;
    }
    
    // 2. Simpan Data ke LocalStorage
    saveUserData();

    // 3. Tampilkan UI Ringkasan (Summary)
    const html = `
        <div class="theory-card" style="text-align:center; animation: popIn 0.5s ease-out;">
            <div style="font-size: 50px; margin-bottom: 20px;">🏆</div>
            <h2 style="color: #4CAF50;">Misi Selesai!</h2>
            <p>Kamu berhasil membasmi 5 kesalahan <b>Indoglish</b> hari ini!</p>
            
            <div style="background: #f9f9f9; padding: 20px; border-radius: 15px; margin: 20px 0;">
                <div style="display: flex; justify-content: space-around;">
                    <div>
                        <span style="display:block; font-size: 0.8rem; color: #888;">XP DIDAPAT</span>
                        <span style="font-size: 1.5rem; font-weight: bold; color: #ff9800;">+75 XP</span>
                    </div>
                    <div>
                        <span style="display:block; font-size: 0.8rem; color: #888;">STATUS</span>
                        <span style="font-size: 1.5rem; font-weight: bold; color: #2196F3;">COMPLETED</span>
                    </div>
                </div>
            </div>

            <button onclick="closeGame()" class="btn-upgrade btn-premium" style="width:100%; padding: 15px;">
                KEMBALI KE BERANDA
            </button>
            
            ${!userState.isPremium ? `
                <p style="margin-top:15px; font-size: 0.8rem; color: #666;">
                    Mau lihat penjelasan detail dari guru di setiap soal? <br>
                    <a href="#" onclick="showPremiumWall('Lihat Penjelasan Guru'); return false;" style="color: #2196F3; font-weight:bold;">Aktifkan Premium</a>
                </p>
            ` : ''}
        </div>
    `;

    openGameOverlay(html, "MISSION ACCOMPLISHED");
    
    // Mainkan suara sukses besar
    playFeedback('success');
}

/**
 * REVISI: Tambahkan pengecekan ini di dalam fungsi processIndoglishAnswer 
 * tepat setelah jawaban benar (Correct).
 */
function handleNextIndoglishStep() {
    indoglishCurrentIndex++;
    
    if (indoglishCurrentIndex < window.currentIndoglishSession.length) {
        renderIndoglishStep();
    } else {
        // Jika sudah mencapai 5 soal, panggil penutup
        finishIndoglishSession();
    }
}