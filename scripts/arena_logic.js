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
    
    // 1. Validasi Data
    const meta = typeof curriculumMetadata !== 'undefined' ? curriculumMetadata[levelId] : null;
    if (!meta || !levelMenuView) return;

    // 2. Sembunyikan Home
    if (homeView) homeView.style.display = 'none';
    levelMenuView.style.display = 'block';

    // 3. Hitung Progress XP untuk Progress Bar
    const userXP = window.userState.points || 0;
    const targetXP = meta.xpToExam || 1000;
    const progressPercent = Math.min((userXP / targetXP) * 100, 100);

    // 4. Render isi menu ke dalam levelMenuView
    // Kita isi HTML-nya secara dinamis agar tombol Ujian muncul di sini
    levelMenuView.innerHTML = `
        <div class="menu-header" style="background:${meta.color}; padding: 20px; color: white; text-align: center; position: relative;">
            <button onclick="closeLevelMenu()" style="position: absolute; left: 15px; top: 15px; background: none; border: none; color: white; font-size: 20px; cursor: pointer;">
                <i class="fas fa-arrow-left"></i>
            </button>
            <h2 style="margin: 0;">Level ${levelId}: ${meta.title}</h2>
            <p style="margin: 5px 0 0; font-size: 0.8rem; opacity: 0.9;">${meta.desc || ''}</p>
        </div>

        <div class="menu-body" style="padding: 20px;">
            <div style="display: grid; gap: 15px; margin-bottom: 30px;">
                <button class="btn-upgrade btn-secondary" onclick="startSentenceBuilder()" style="width: 100%; text-align: left; padding: 15px;">
                    <i class="fas fa-align-left"></i> Sentence Builder
                </button>
                <button class="btn-upgrade btn-secondary" onclick="startDictation()" style="width: 100%; text-align: left; padding: 15px;">
                    <i class="fas fa-headset"></i> Dictation
                </button>
            </div>

            <hr style="border: 0; border-top: 1px solid #eee; margin: 20px 0;">

            <div class="exam-section" style="background: #fdfdfd; border: 2px dashed #ddd; border-radius: 15px; padding: 20px; text-align: center;">
                <h4 style="margin-top: 0;">Level Final Exam</h4>
                
                <button class="btn-upgrade ${progressPercent >= 100 || window.userState.isPremium ? 'btn-premium' : 'btn-locked'}" 
                        onclick="openFinalExamModule()" 
                        style="width: 100%; padding: 15px; margin-bottom: 10px;">
                    ${progressPercent >= 100 || window.userState.isPremium ? 'MULAI UJIAN FINAL' : '<i class="fas fa-lock"></i> UJIAN TERKUNCI'}
                </button>

                ${!window.userState.isPremium ? `
                    <div style="width: 100%; background: #eee; height: 10px; border-radius: 5px; overflow: hidden; margin-top: 10px;">
                        <div style="width: ${progressPercent}%; background: #f1c40f; height: 100%; transition: width 0.5s;"></div>
                    </div>
                    <small style="display: block; margin-top: 5px; color: #777;">
                        ${userXP} / ${targetXP} XP untuk membuka ujian
                    </small>
                ` : '<small style="color: #d4af37;"><i class="fas fa-crown"></i> Akses Premium Terbuka</small>'}
            </div>
        </div>
    `;
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