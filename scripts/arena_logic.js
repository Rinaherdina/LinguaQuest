// ==========================================
// BLOK 1: KONFIGURASI KURIKULUM (THE ARENA)
// Fungsi: Definisi nama, fokus tenses, dan status gembok
// ==========================================
const arenaLevels = [
    { id: 1, title: "THE NEWBIE", focus: "Fokus pada 3 Tenses Dasar", locked: false },
    { id: 2, title: "THE VOYAGER", focus: "Fokus pada 4 Tenses Lanjutan", locked: true },
    { id: 3, title: "THE SCHOLAR", focus: "Fokus pada 4 Tenses Menengah", locked: true },
    { id: 4, title: "THE CHALLENGER", focus: "Fokus 4 Tenses (Persiapan TOEFL)", locked: true },
    { id: 5, title: "THE MASTER", focus: "1 Tense Terakhir & Master Mode", locked: true }
];

// ==========================================
// BLOK 2: LOGIKA RENDER PETA (ARENA)
// Fungsi: Menampilkan bulatan level secara dinamis ke HTML
// ==========================================
function renderArena() {
    const arenaMap = document.getElementById('arena-map');
    const currentState = window.userState;
    
    if (!arenaMap || !currentState) return;
    
    arenaMap.innerHTML = ''; 

    arenaLevels.forEach(lvl => {
        // PERBAIKAN LOGIKA: Level terbuka jika ID level <= currentLevel user
        const isLocked = lvl.id > currentState.currentLevel;
        
        // Ambil warna dari metadata di data.js
        const meta = (typeof curriculumMetadata !== 'undefined') ? curriculumMetadata[lvl.id] : null;
        const nodeColor = meta ? meta.color : '#4CAF50';

        const levelNode = document.createElement('div');
        levelNode.className = `level-node ${isLocked ? 'locked' : 'active'}`;
        
        // Logika Klik
        levelNode.onclick = () => {
            if (!isLocked) {
                // Jika level sudah terbuka, buka menu pilihan (SB, Dictation, dll)
                openLevelMenu(lvl.id);
            } else {
                // Jika masih terkunci, beri peringatan ujian
                const prevLevel = lvl.id - 1;
                showPremiumWall(`Lulus Ujian Final Level ${prevLevel} untuk membuka ini!`);
            }
        };

        levelNode.innerHTML = `
            <div class="node-circle" style="background: ${isLocked ? '#bdc3c7' : nodeColor};">
                ${isLocked ? '<i class="fas fa-lock"></i>' : lvl.id}
            </div>
            <div class="level-label">
                <strong style="color: ${isLocked ? '#95a5a6' : '#2c3e50'}">${lvl.title}</strong><br>
                <small>${lvl.focus}</small>
            </div>
        `;
        arenaMap.appendChild(levelNode);
    });
}

// ==========================================
// BLOK 3: LOGIKA NAVIGASI MENU LEVEL
// Fungsi: Membuka sub-menu (Dictation, Tenses, dll)
// ==========================================
// ==========================================
// BLOK 3: LOGIKA NAVIGASI MENU LEVEL
// Fungsi: Membuka sub-menu (Dictation, Tenses, dll)
// ==========================================
function openLevelMenu(levelId) {
    const homeView = document.getElementById('home-view');
    const levelMenuView = document.getElementById('level-menu-view');
    
    // 1. Validasi Metadata
    const meta = typeof curriculumMetadata !== 'undefined' ? curriculumMetadata[levelId] : null;
    if (!meta || !levelMenuView) return;

    // 2. Hitung Progress XP untuk Progress Bar & Validasi Unlock
    const userXP = window.userState.points || 0;
    const targetXP = meta.xpToExam || 1000;
    const progressPercent = Math.min((userXP / targetXP) * 100, 100);
    
    // Tentukan apakah ujian terbuka (Premium atau XP cukup)
    const isUnlocked = window.userState.isPremium || progressPercent >= 100;

    // 3. Transisi Tampilan (Sembunyikan Peta, Munculkan Menu)
    if (homeView) homeView.style.display = 'none';
    levelMenuView.style.display = 'block';
    window.scrollTo(0, 0); // Reset scroll ke atas

    // 4. Render isi menu ke dalam levelMenuView secara dinamis
    levelMenuView.innerHTML = `
        <div class="menu-header" style="background:${meta.color}; padding: 20px; color: white; text-align: center; position: relative; border-radius: 0 0 20px 20px;">
            <button onclick="closeLevelMenu()" style="position: absolute; left: 15px; top: 15px; background: none; border: none; color: white; font-size: 20px; cursor: pointer;">
                <i class="fas fa-arrow-left"></i>
            </button>
            <h2 style="margin: 0; font-size: 1.4rem;">Level ${levelId}: ${meta.title}</h2>
            <p style="margin: 5px 0 0; font-size: 0.8rem; opacity: 0.9;">${meta.desc || ''}</p>
        </div>

        <div class="menu-body" style="padding: 20px;">
            <div style="display: grid; gap: 15px; margin-bottom: 30px;">
                <button class="btn-upgrade btn-secondary" onclick="startSentenceBuilder()" style="width: 100%; text-align: left; padding: 18px; display: flex; align-items: center; gap: 15px;">
                    <i class="fas fa-align-left fa-lg" style="color: #4CAF50;"></i> 
                    <div>
                        <strong style="display:block;">Sentence Builder</strong>
                        <small style="color: #666;">Susun kata menjadi kalimat benar</small>
                    </div>
                </button>
                
                <button class="btn-upgrade btn-secondary" onclick="startDictation()" style="width: 100%; text-align: left; padding: 18px; display: flex; align-items: center; gap: 15px;">
                    <i class="fas fa-headset fa-lg" style="color: #2196F3;"></i>
                    <div>
                        <strong style="display:block;">Dictation</strong>
                        <small style="color: #666;">Dengar dan tulis apa yang diucapkan</small>
                    </div>
                </button>
            </div>

            <hr style="border: 0; border-top: 1px solid #eee; margin: 25px 0;">

            <div class="exam-section" style="background: #fdfdfd; border: 2px dashed #ddd; border-radius: 15px; padding: 20px; text-align: center;">
                <h4 style="margin-top: 0; color: #333;">Level Final Exam</h4>
                
                <button class="btn-upgrade ${isUnlocked ? 'btn-premium' : 'btn-locked'}" 
                        onclick="${isUnlocked ? 'openFinalExamModule()' : ''}" 
                        style="width: 100%; padding: 15px; margin-bottom: 10px; cursor: ${isUnlocked ? 'pointer' : 'not-allowed'};">
                    ${isUnlocked ? '<i class="fas fa-rocket"></i> MULAI UJIAN FINAL' : '<i class="fas fa-lock"></i> UJIAN TERKUNCI'}
                </button>

                ${!window.userState.isPremium ? `
                    <div style="width: 100%; background: #eee; height: 12px; border-radius: 6px; overflow: hidden; margin-top: 15px; border: 1px solid #ddd;">
                        <div style="width: ${progressPercent}%; background: linear-gradient(90deg, #f1c40f, #f39c12); height: 100%; transition: width 0.5s;"></div>
                    </div>
                    <small style="display: block; margin-top: 8px; color: #555; font-weight: bold;">
                        ${userXP.toLocaleString()} / ${targetXP.toLocaleString()} XP
                    </small>
                    <p style="font-size: 0.75rem; color: #888; margin-top: 4px;">Kumpulkan XP untuk membuka ujian secara gratis</p>
                ` : `
                    <div style="margin-top: 10px; color: #d4af37; font-weight: bold; font-size: 0.9rem;">
                        <i class="fas fa-crown"></i> AKSES PREMIUM AKTIF
                    </div>
                `}
            </div>
        </div>
    `;
}

/**
 * Fungsi untuk kembali ke peta utama
 */
function closeLevelMenu() {
    const homeView = document.getElementById('home-view');
    const levelMenuView = document.getElementById('level-menu-view');
    if (homeView) homeView.style.display = 'block';
    if (levelMenuView) levelMenuView.style.display = 'none';
    
    // Render ulang arena untuk memastikan status gembok terbaru muncul
    if (typeof renderArena === 'function') renderArena();
}

// Tambahkan juga fungsi penutup agar user bisa kembali ke peta
function closeLevelMenu() {
    const homeView = document.getElementById('home-view');
    const levelMenuView = document.getElementById('level-menu-view');
    if (homeView) homeView.style.display = 'block';
    if (levelMenuView) levelMenuView.style.display = 'none';
}

// ==========================================
// BLOK 4: SINKRONISASI SISTEM
// Fungsi: Menghubungkan Arena dengan Main Engine saat startup
// ==========================================
function initArenaLogic() {
    renderArena();
    console.log("Arena Logic: Berhasil tersinkronisasi dengan Main Engine.");
}

// Pastikan fungsi ini bisa dibaca oleh file lain
window.openLevelMenu = openLevelMenu; 
window.renderArena = renderArena;
window.initArenaLogic = initArenaLogic;

function openFinalExamModule() {
    const currentLv = userState.currentLevel;
    const meta = curriculumMetadata[currentLv];
    const userXP = userState.points; // Asumsi points adalah XP
    const isPremium = userState.isPremium;

    // Syarat Terbuka: User Premium ATAU XP sudah mencukupi
    const isUnlocked = isPremium || userXP >= meta.xpToExam;

    if (isUnlocked) {
        startGlobalLevelExam();
    } else {
        const xpNeeded = meta.xpToExam - userXP;
        showPremiumWall(`
            <div style="text-align:center;">
                <i class="fas fa-lock fa-3x" style="color:#f1c40f; margin-bottom:15px;"></i>
                <h3>Ujian Masih Terkunci</h3>
                <p>Kumpulkan <b>${xpNeeded} XP</b> lagi untuk membuka ujian secara gratis, atau buka instan dengan Premium.</p>
                <div style="margin-top:20px; font-size:12px; color:#666;">
                    XP Kamu: ${userXP} / Target: ${meta.xpToExam}
                </div>
            </div>
        `);
    }
}

function tryOpenExam() {
    const currentLv = userState.currentLevel;
    const requiredXP = curriculumMetadata[currentLv].xpToExam;
    const userXP = userState.points;
    const isPremium = userState.isPremium;

    // Gerbang terbuka jika: User Premium (bypass) ATAU XP sudah 1000+
    if (isPremium || userXP >= requiredXP) {
        startGlobalLevelExam(); // Jalankan ujian
    } else {
        const gap = requiredXP - userXP;
        // Tampilkan pesan bahwa gerbang masih terkunci
        showPremiumWall(`
            <div style="text-align:center;">
                <div style="font-size:50px; margin-bottom:15px;">🚧</div>
                <h3>Gerbang Ujian Terkunci</h3>
                <p>Anda butuh <b>${gap} XP</b> lagi untuk membuka ujian ini.</p>
                <progress value="${userXP}" max="${requiredXP}" style="width:100%; height:20px;"></progress>
                <p style="font-size:12px; margin-top:5px;">${userXP} / ${requiredXP} XP</p>
            </div>
        `);
    }
}

/**
 * Memulai Ujian Kenaikan Level (Global Exam)
 */
function startGlobalLevelExam() {
    const currentLv = userState.currentLevel;
    
    // 1. Ambil soal dari SB dan Dictation sesuai level saat ini
    const sbSoal = window.SENTENCE_BUILDER_EXERCISES.filter(s => s.level === currentLv);
    const dictSoal = window.dictationBank.filter(s => s.level === currentLv);

    if (sbSoal.length < 5 || dictSoal.length < 5) {
        return alert("Soal ujian belum cukup. Kumpulkan soal lokal lebih banyak di level ini!");
    }

    // 2. Acak soal (Ambil 5 SB dan 5 Dictation untuk ujian)
    const examSet = [
        ...sbSoal.sort(() => 0.5 - Math.random()).slice(0, 5),
        ...dictSoal.sort(() => 0.5 - Math.random()).slice(0, 5)
    ];

    // 3. Inisialisasi State Ujian
    window.examState = {
        questions: examSet,
        currentIndex: 0,
        score: 0,
        requiredToPass: 8 // Minimal 8 dari 10 benar
    };

    renderExamQuestion();
}

function renderExamQuestion() {
    const state = window.examState;
    const currentSoal = state.questions[state.currentIndex];
    const isDictation = currentSoal.id.startsWith('d_'); // Cek apakah ini soal dikte

    const html = `
        <div class="theory-card">
            <div style="text-align:center; margin-bottom: 20px;">
                <span class="badge" style="background:#673AB7; color:white;">EXAM QUESTION ${state.currentIndex + 1}/10</span>
            </div>
            
            ${isDictation ? `
                <div style="text-align:center; margin-bottom:20px;">
                    <button onclick="playVoice('${currentSoal.target.replace(/'/g, "\\'")}', 0.8)" class="node-circle" style="width:70px; height:70px; background:#2196F3; color:white; border:none; border-radius:50%;">
                        <i class="fas fa-volume-up fa-2xl"></i>
                    </button>
                    <p style="margin-top:10px; font-style:italic; color:#666;">"${currentSoal.hint}"</p>
                </div>
            ` : `
                <p style="text-align:center; font-weight:bold; font-size:1.1rem; margin-bottom:15px;">"${currentSoal.meaning}"</p>
            `}

            <input type="text" id="exam-input" placeholder="Tulis jawaban bahasa Inggris..." 
                style="width:100%; padding:15px; border-radius:12px; border:2px solid #673AB7; font-size:1rem;">
            
            <button onclick="submitExamAnswer()" class="btn-upgrade btn-premium" style="width:100%; margin-top:20px;">KIRIM JAWABAN</button>
        </div>
    `;

    openGameOverlay(html, `FINAL EXAM LV ${userState.currentLevel}`);
}

function submitExamAnswer() {
    const state = window.examState;
    const currentSoal = state.questions[state.currentIndex];
    const input = document.getElementById('exam-input').value.trim().toLowerCase().replace(/[.!?,]/g, '');
    const correct = (currentSoal.target).toLowerCase().replace(/[.!?,]/g, '');

    if (input === correct) state.score++;

    state.currentIndex++;

    if (state.currentIndex < state.questions.length) {
        renderExamQuestion();
    } else {
        finishExam();
    }
}

function finishExam() {
    const state = window.examState;
    const passed = state.score >= state.requiredToPass;

    let resultHTML = "";

    if (passed) {
        const nextLv = userState.currentLevel + 1;
        userState.currentLevel = nextLv;
        userState.points += 100; // Bonus kelulusan
        saveUserData();
        
        resultHTML = `
            <div style="text-align:center;">
                <i class="fas fa-medal fa-4x" style="color:#FFD700; margin-bottom:15px;"></i>
                <h2>SELAMAT!</h2>
                <p>Anda lulus ujian dengan skor <b>${state.score}/10</b>.</p>
                <p>Sekarang Anda berada di <b>Level ${nextLv}</b>.</p>
                <button onclick="location.reload()" class="btn-upgrade btn-premium" style="width:100%; margin-top:20px;">BUKA MAP BARU</button>
            </div>
        `;
    } else {
        resultHTML = `
            <div style="text-align:center;">
                <i class="fas fa-times-circle fa-4x" style="color:#f44336; margin-bottom:15px;"></i>
                <h2>BELUM LULUS</h2>
                <p>Skor Anda: ${state.score}/10. Minimal kelulusan: ${state.requiredToPass}.</p>
                <p>Silakan belajar lagi di modul harian.</p>
                <button onclick="closeGameOverlay()" class="btn-upgrade btn-secondary" style="width:100%; margin-top:20px;">KEMBALI KE MAP</button>
            </div>
        `;
    }

    openGameOverlay(resultHTML, "HASIL UJIAN");
}