// ==========================================
// BLOK 1: KONFIGURASI & STATE
// ==========================================
const arenaLevels = [
    { id: 1, title: "THE NEWBIE", focus: "Fokus pada 3 Tenses Dasar", locked: false },
    { id: 2, title: "THE VOYAGER", focus: "Fokus pada 4 Tenses Lanjutan", locked: true },
    { id: 3, title: "THE SCHOLAR", focus: "Fokus pada 4 Tenses Menengah", locked: true },
    { id: 4, title: "THE CHALLENGER", focus: "Fokus 4 Tenses (Persiapan TOEFL)", locked: true },
    { id: 5, title: "THE MASTER", focus: "1 Tense Terakhir & Master Mode", locked: true }
];

// ==========================================
// BLOK 2: RENDER UI UTAMA (MAP)
// ==========================================
function renderArena() {
    const arenaMap = document.getElementById('arena-map');
    const currentState = window.userState;
    
    if (!arenaMap || !currentState) return;
    
    arenaMap.innerHTML = ''; 

    arenaLevels.forEach(lvl => {
        const isLocked = lvl.id > currentState.currentLevel;
        const meta = (typeof curriculumMetadata !== 'undefined') ? curriculumMetadata[lvl.id] : null;
        const nodeColor = meta ? meta.color : '#4CAF50';

        const levelNode = document.createElement('div');
        levelNode.className = `level-node ${isLocked ? 'locked' : 'active'}`;
        
        levelNode.onclick = () => {
            if (!isLocked) {
                openLevelMenu(lvl.id);
            } else {
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
// BLOK 3: NAVIGASI & MENU LEVEL
// ==========================================
function openLevelMenu(levelId) {
    const homeView = document.getElementById('home-view');
    const levelMenuView = document.getElementById('level-menu-view');
    
    const meta = typeof curriculumMetadata !== 'undefined' ? curriculumMetadata[levelId] : null;
    if (!meta || !levelMenuView) return;

    const userXP = window.userState.points || 0;
    const targetXP = meta.xpToExam || 1000;
    const progressPercent = Math.min((userXP / targetXP) * 100, 100);
    const isUnlocked = window.userState.isPremium || progressPercent >= 100;

    if (homeView) homeView.style.display = 'none';
    levelMenuView.style.display = 'block';
    window.scrollTo(0, 0);

    levelMenuView.innerHTML = `
        <div class="menu-header" style="background:${meta.color}; padding: 20px; color: white; text-align: center; position: relative; border-radius: 0 0 20px 20px;">
            <button onclick="closeLevelMenu()" style="position: absolute; left: 15px; top: 15px; background: none; border: none; color: white; font-size: 20px; cursor: pointer;">
                <i class="fas fa-arrow-left"></i>
            </button>
            <h2 style="margin: 0; font-size: 1.4rem;">Level ${levelId}: ${meta.title}</h2>
            <p style="margin: 5px 0 0; font-size: 0.8rem; opacity: 0.9;">${meta.desc || ''}</p>
        </div>

        <div class="menu-body" style="padding: 20px;">
            <div style="display: grid; gap: 12px; margin-bottom: 30px;">
                
                <button class="btn-upgrade ${isUnlocked ? 'btn-premium' : 'btn-locked'}" 
                        style="padding: 18px; border: none; box-shadow: 0 4px 15px rgba(0,0,0,0.1);"
                        onclick="tryOpenExam()">
                    <div style="display: flex; align-items: center; gap: 15px; text-align: left;">
                        <i class="fas fa-graduation-cap" style="font-size: 1.8rem;"></i>
                        <div>
                            <span style="display:block; font-weight: bold; font-size: 1rem;">GLOBAL LEVEL EXAM</span>
                            <small style="opacity: 0.8;">Ujian kenaikan ke level berikutnya</small>
                        </div>
                    </div>
                </button>

                <hr style="border: 0; border-top: 1px solid #eee; margin: 10px 0;">

                <button class="btn-upgrade" style="background: white; border: 2px solid var(--warning-orange); color: var(--text-dark); padding: 12px;" onclick="startIndoglishModule()">
                    <div style="display: flex; align-items: center; gap: 12px; text-align: left;">
                        <i class="fas fa-shield-alt" style="color: var(--warning-orange);"></i>
                        <div>
                            <span style="display:block; font-weight: bold;">Indoglish Buster</span>
                            <small style="color: #666;">Latihan anti-Indoglish</small>
                        </div>
                    </div>
                </button>

                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px;">
                    <button class="btn-upgrade btn-secondary" onclick="startStory()">
                        <i class="fas fa-book-open"></i> Story
                    </button>
                    <button class="btn-upgrade btn-secondary" onclick="startSpeaking()">
                        <i class="fas fa-microphone-alt"></i> Speaking
                    </button>
                    <button class="btn-upgrade btn-secondary" onclick="startDictation()">
                        <i class="fas fa-headset"></i> Dictation
                    </button>
                    <button class="btn-upgrade btn-secondary" onclick="startTenses()">
                        <i class="fas fa-flask"></i> Tenses
                    </button>
                </div>
            </div>
        </div>
    `;
}

function closeLevelMenu() {
    const homeView = document.getElementById('home-view');
    const levelMenuView = document.getElementById('level-menu-view');
    if (homeView) homeView.style.display = 'block';
    if (levelMenuView) levelMenuView.style.display = 'none';
    renderArena();
}

// ==========================================
// BLOK 4: LOGIKA GERBANG UJIAN
// ==========================================
function tryOpenExam() {
    const currentLv = userState.currentLevel;
    const meta = curriculumMetadata[currentLv];
    const userXP = userState.points || 0;
    const isPremium = userState.isPremium;
    const requiredXP = meta ? (meta.xpToExam || 1000) : 1000;

    if (isPremium || userXP >= requiredXP) {
        // MEMANGGIL FUNGSI DARI level_exam_master.js
        if (typeof startGlobalLevelExam === 'function') {
            startGlobalLevelExam();
        } else {
            alert("Sistem Ujian sedang loading. Tunggu sebentar...");
            console.error("level_exam_master.js belum terload!");
        }
    } else {
        const gap = requiredXP - userXP;
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

// ==========================================
// BLOK 5: INITIALIZATION
// ==========================================
function initArenaLogic() {
    renderArena();
    console.log("Arena Logic: Synced with Master Exam Engine.");
}

// Global Exports
window.openLevelMenu = openLevelMenu; 
window.renderArena = renderArena;
window.initArenaLogic = initArenaLogic;
window.tryOpenExam = tryOpenExam;