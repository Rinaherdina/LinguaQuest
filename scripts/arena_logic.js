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
    
    // PERBAIKAN: Gunakan window.userState agar pasti terbaca dari global
    const currentState = window.userState;
    
    // Pengaman: Jika elemen HTML atau userState belum siap, hentikan fungsi
    if (!arenaMap || !currentState) {
        console.warn("Arena Logic: Menunggu userState atau elemen arena-map...");
        return;
    }
    
    arenaMap.innerHTML = ''; // Bersihkan peta

    // arenaLevels biasanya didefinisikan di atas fungsi ini atau di data.js
    arenaLevels.forEach(lvl => {
        // Baris 25: Pastikan menggunakan currentState yang sudah diverifikasi
        const isLocked = lvl.id > currentState.currentLevel;
        
        // Mengambil metadata warna dan ikon dari data.js (curriculumMetadata)
        const meta = typeof curriculumMetadata !== 'undefined' ? curriculumMetadata[lvl.id] : null;
        const nodeColor = meta ? meta.color : '#4CAF50';

        const levelNode = document.createElement('div');
        levelNode.className = `level-node ${isLocked ? 'locked' : 'active'}`;
        
        // Logika Klik
        if (!isLocked) {
            levelNode.onclick = () => {
                if (typeof openLevelMenu === 'function') openLevelMenu(lvl.id);
            };
        } else {
            levelNode.onclick = () => {
                if (typeof showPremiumWall === 'function') {
                    showPremiumWall(`Selesaikan level sebelumnya untuk membuka Level ${lvl.id}`);
                } else {
                    alert("Selesaikan level sebelumnya!");
                }
            };
        }

        // Tampilan Visual Bulatan
        levelNode.innerHTML = `
            <div class="node-circle" style="background: ${isLocked ? '#ccc' : nodeColor}; color: white; border: 4px solid white; box-shadow: 0 4px 10px rgba(0,0,0,0.1);">
                ${isLocked ? '<i class="fas fa-lock"></i>' : lvl.id}
            </div>
            <div class="level-label">
                <strong style="color: ${isLocked ? '#999' : '#333'}">${lvl.title}</strong><br>
                <small style="font-size: 0.6rem; color: #666;">${lvl.focus}</small>
            </div>
        `;

        arenaMap.appendChild(levelNode);
    });
}

// ==========================================
// BLOK 3: LOGIKA NAVIGASI MENU LEVEL
// Fungsi: Membuka sub-menu (Dictation, Tenses, dll)
// ==========================================
function openLevelMenu(levelId) {
    // Sembunyikan Home
    const homeView = document.getElementById('home-view');
    const levelMenuView = document.getElementById('level-menu-view');
    
    if (homeView) homeView.style.display = 'none';
    
    if (levelMenuView) {
        levelMenuView.style.display = 'block';
        const levelData = arenaLevels.find(l => l.id === levelId);
        
        // Update Judul di Sub-Menu secara dinamis
        const titleEl = levelMenuView.querySelector('h2');
        if (titleEl) titleEl.innerText = `Level ${levelId}: ${levelData.title}`;
    }
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

