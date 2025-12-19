/**
 * LINGUAQUEST - Tenses & Verb Master Engine (Enhanced Version)
 * Fitur: 3 Sandbox Forms, Smart Correction, Irregular Verb Integration
 */

// Gunakan tensesData milik Anda (Level 1 - Level 5)
const tensesData = {
    level1: [
        { id: "s_present", name: "Simple Present", usage: "Kebiasaan & Fakta umum.", v_form: "S + V1(s/es)", n_form: "S + am/is/are + Adj/Noun", ex: ["He drinks milk.", "They are happy."] },
        { id: "s_past", name: "Simple Past", usage: "Kejadian masa lalu.", v_form: "S + V2", n_form: "S + was/were + Adj/Noun", ex: ["I went to Bali.", "She was sad."] },
        { id: "s_future", name: "Simple Future", usage: "Rencana masa depan.", v_form: "S + will + V1", n_form: "S + will be + Adj/Noun", ex: ["We will study.", "It will be cold."] }
    ],
    level2: [
        { id: "pres_cont", name: "Present Continuous", usage: "Sedang dilakukan sekarang.", v_form: "S + am/is/are + V-ing", n_form: "-", ex: ["I am eating.", "They are playing."] },
        { id: "past_cont", name: "Past Continuous", usage: "Sedang terjadi di masa lalu.", v_form: "S + was/were + V-ing", n_form: "-", ex: ["He was sleeping."] },
        { id: "fut_cont", name: "Future Continuous", usage: "Sedang terjadi nanti.", v_form: "S + will be + V-ing", n_form: "-", ex: ["I will be working."] },
        { id: "pres_perf", name: "Present Perfect", usage: "Sudah terjadi.", v_form: "S + have/has + V3", n_form: "S + have/has + been", ex: ["I have eaten.", "She has been here."] }
    ],
    level3: [
        { id: "past_perf", name: "Past Perfect", usage: "Sudah selesai sebelum aksi lain.", v_form: "S + had + V3", n_form: "S + had been", ex: ["The train had left."] },
        { id: "fut_perf", name: "Future Perfect", usage: "Akan sudah selesai.", v_form: "S + will have + V3", n_form: "S + will have been", ex: ["I will have finished."] },
        { id: "pres_p_cont", name: "Pres. Perf. Continuous", usage: "Sudah dan masih berlangsung.", v_form: "S + have/has + been + V-ing", n_form: "-", ex: ["I have been waiting."] },
        { id: "past_p_cont", name: "Past Perf. Continuous", usage: "Sudah berlangsung lama di masa lalu.", v_form: "S + had been + V-ing", n_form: "-", ex: ["He had been crying."] }
    ],
    level4: [
        { id: "fut_p_cont", name: "Fut. Perf. Continuous", usage: "Durasi yang akan sudah berlangsung.", v_form: "S + will have been + V-ing", n_form: "-", ex: ["I will have been staying."] },
        { id: "p_fut", name: "Past Future", usage: "Rencana yang gagal.", v_form: "S + would + V1", n_form: "S + would be", ex: ["I would come."] },
        { id: "p_fut_cont", name: "Past Future Cont.", usage: "Akan sedang terjadi di masa lalu.", v_form: "S + would be + V-ing", n_form: "-", ex: ["He would be sleeping."] }
    ],
    level5: [
        { id: "p_fut_perf", name: "Past Future Perfect", usage: "Seharusnya sudah terjadi.", v_form: "S + would have + V3", n_form: "S + would have been", ex: ["She would have known."] },
        { id: "p_fut_p_cont", name: "Past Fut. Perf. Cont.", usage: "Durasi yang seharusnya sudah berjalan.", v_form: "S + would have been + V-ing", n_form: "-", ex: ["We would have been living."] }
    ]
};

let activeTense = null;

function startTensesModule() {
    if (!canPlayModule('tenses')) return; 

    const container = document.getElementById('game-content');
    
    const elegantHeader = `
        <div class="game-overlay-header" style="background: #2196F3; padding: 25px 15px; border-radius: 0 0 30px 30px; text-align:center; position:relative;">
            <button onclick="closeGame()" style="position:absolute; top:20px; left:15px; background:none; border:none; color:white; font-weight:bold; cursor:pointer;">
                <i class="fas fa-chevron-left"></i> Kembali
            </button>
            <i class="fas fa-brain" style="font-size: 2.2rem; color: #ff9600;"></i>
            <h2 style="color: white; margin: 0; text-transform: uppercase;">TENSES MASTER</h2>
        </div>
    `;

    container.innerHTML = elegantHeader + `
        <div id="tenses-module" style="padding: 15px;">
            <p style="text-align:center; font-size:0.9rem; color:#666;">Pilih Tense untuk memulai latihan:</p>
            <div class="tenses-selector" id="tenses-tabs" style="display:flex; gap:8px; overflow-x:auto; padding-bottom:10px; margin-bottom:15px;"></div>
            
            <div id="tense-display-card" style="display:none; background:white; padding:20px; border-radius:15px; box-shadow: 0 4px 15px rgba(0,0,0,0.05);">
                <div class="theory-box">
                    <h3 id="t-name" style="color:#2196F3; margin:0;"></h3>
                    <p id="t-usage" style="font-style:italic; color:#666; font-size:0.85rem; margin-bottom:10px;"></p>
                    
                    <div style="background:#fff3e0; padding:10px; border-radius:8px; margin-bottom:10px; font-size:0.8rem; border-left:4px solid #ff9800;">
                        <strong>🕒 Time Signals:</strong> <span id="t-time">Yesterday, Last night, Ago...</span>
                    </div>

                    <div class="formula-details" style="background:#f8f9fa; padding:12px; border-radius:10px; margin-bottom:15px; border-left:4px solid #2196F3;">
                        <p style="margin:2px 0; font-size:0.9rem;"><b>Verbal:</b> <span id="f-v" style="font-family:monospace; color:#d32f2f;"></span></p>
                        <p style="margin:2px 0; font-size:0.9rem;"><b>Nominal:</b> <span id="f-n" style="font-family:monospace; color:#d32f2f;"></span></p>
                    </div>
                </div>

                <div class="sandbox-box" style="border-top:2px dashed #eee; padding-top:15px;">
                    <h4 style="margin:0 0 10px 0;"><i class="fas fa-flask"></i> Sandbox: 3 Bentuk Kalimat</h4>
                    <input type="text" id="in-pos" placeholder="Tulis kalimat Positif (+)" style="width:100%; padding:10px; border-radius:8px; border:1px solid #ddd; margin-bottom:8px;">
                    <input type="text" id="in-neg" placeholder="Tulis kalimat Negatif (-)" style="width:100%; padding:10px; border-radius:8px; border:1px solid #ddd; margin-bottom:8px;">
                    <input type="text" id="in-int" placeholder="Tulis kalimat Tanya (?)" style="width:100%; padding:10px; border-radius:8px; border:1px solid #ddd; margin-bottom:12px;">
                    
                    <button class="btn-upgrade btn-premium" style="width:100%;" onclick="validateMasterSandbox()">CEK SEMUA STRUKTUR</button>
                    <div id="sandbox-res" style="margin-top:12px; font-size:0.9rem; line-height:1.4;"></div>
                </div>
            </div>

            <div class="verb-checker-box" style="margin-top:20px; background:#fff8e1; padding:15px; border-radius:15px; border:1px solid #ffe082;">
                <h4 style="margin:0 0 10px 0;"><i class="fas fa-search"></i> Verb Checker (V1-V2-V3)</h4>
                <input type="text" id="verb-check-input" oninput="liveVerbCheck()" placeholder="Cek kata kerja (ex: eat, buy)..." 
                       style="width:100%; padding:10px; border-radius:8px; border:1px solid #ffcc80;">
                <div id="verb-check-res" style="margin-top:10px; font-weight:bold; color:#f57c00;"></div>
            </div>
        </div>
    `;
    
    document.getElementById('game-overlay').style.display = 'flex';
    renderTenseTabs();
}

function renderTenseTabs() {
    const tabs = document.getElementById('tenses-tabs');
    // Jika elemen tabs tidak ditemukan di HTML, hentikan fungsi agar tidak error
    if (!tabs) {
        console.warn("Elemen 'tenses-tabs' tidak ditemukan di halaman ini.");
        return;
    }

    tabs.innerHTML = "";
    
    // 1. Ambil level saat ini (memastikan formatnya angka)
    let currentLvlNum = window.userState.currentLevel;
    if (typeof currentLvlNum === 'string') {
        currentLvlNum = parseInt(currentLvlNum.replace('LV', '')) || 1;
    }

    // 2. Kumpulkan tenses yang tersedia hingga level saat ini
    let available = [];
    for (let i = 1; i <= currentLvlNum; i++) {
        const key = `level${i}`;
        if (typeof tensesData !== 'undefined' && tensesData[key]) {
            available = [...available, ...tensesData[key]];
        }
    }

    // 3. Render tombol ke dalam tab
    available.forEach(tense => {
        const btn = document.createElement('button');
        btn.innerText = tense.name;
        btn.className = "tense-btn"; // Sesuai dengan CSS Anda
        
        // Logika klik tombol
        btn.onclick = () => {
            console.log("Memulai latihan untuk:", tense.name);
            // Pastikan fungsi startQuiz didefinisikan di file ini atau main.js
            if (typeof startQuiz === 'function') {
                startQuiz(tense.id);
            } else if (typeof startTenseQuiz === 'function') {
                startTenseQuiz(tense.id);
            } else {
                console.error("Fungsi quiz belum didefinisikan.");
                alert("Fungsi mulai kuis belum siap.");
            }
        };
        
        tabs.appendChild(btn);
    });
} 

function showLevelInfo() {
    if (typeof curriculumMetadata !== 'undefined' && window.userState) {
        const metadata = curriculumMetadata[window.userState.currentLevel];
        if (metadata) {
            console.log("Welcome to level: " + metadata.title);
        }
    }
}

// Inisialisasi saat script dimuat (Opsional, tergantung alur main.js Anda)
// document.addEventListener('DOMContentLoaded', renderTenseTabs);

// LOGIKA VALIDASI 3 KALIMAT
function validateMasterSandbox() {
    const pos = document.getElementById('in-pos').value.trim();
    const neg = document.getElementById('in-neg').value.trim();
    const int = document.getElementById('in-int').value.trim();
    const res = document.getElementById('sandbox-res');
    
    if(!activeTense) return alert("Pilih tense terlebih dahulu!");
    if(!pos || !neg || !int) {
        res.innerHTML = "<span style='color:#c62828'>⚠️ Lengkapi ketiga bentuk kalimat!</span>";
        return;
    }

    let results = { pos: null, neg: null, int: null };

    // Jalankan verifikasi sesuai Tense aktif
    if(activeTense.id === 's_present') {
        results.pos = verifyPresent(pos, 'positive');
        results.neg = verifyPresent(neg, 'negative');
        results.int = verifyPresent(int, 'interrogative');
    } else if(activeTense.id === 's_past') {
        results.pos = verifyPast(pos, 'positive');
        results.neg = verifyPast(neg, 'negative');
        results.int = verifyPast(int, 'interrogative');
    } else if(activeTense.id === 's_future') {
        results.pos = verifyFuture(pos, 'positive');
        results.neg = verifyFuture(neg, 'negative');
        results.int = verifyFuture(int, 'interrogative');
    }

    // Tampilkan Hasil
    if(results.pos.valid && results.neg.valid && results.int.valid) {
        res.innerHTML = "<div style='background:#e8f5e9; padding:10px; border-radius:8px; color:green;'>✔️ <b>Perfect!</b> Struktur benar. +10 XP</div>";
        
        // Simpan ke State (data.js)
        window.userState.points += 10;
        window.userState.stats.tenses.doneToday++;
        window.userState.stats.tenses.totalDone++;
        
        if (typeof saveUserData === 'function') saveUserData();
        if (typeof updateUI === 'function') updateUI();
        if (typeof playSuccessSound === 'function') playSuccessSound();

        // Bersihkan input
        document.getElementById('in-pos').value = "";
        document.getElementById('in-neg').value = "";
        document.getElementById('in-int').value = "";
    } else {
        let errors = [];
        if(!results.pos.valid) errors.push("➕ " + results.pos.error);
        if(!results.neg.valid) errors.push("➖ " + results.neg.error);
        if(!results.int.valid) errors.push("❓ " + results.int.error);
        res.innerHTML = `<div style='background:#fff3e0; padding:10px; border-radius:8px; color:#d84315;'><b>Koreksi:</b><br>${errors.join('<br>')}</div>`;
    }
}        
        
// ==========================================
// MESIN VERIFIKASI TENSES (LEVEL 1)
// ==========================================
/**
 * LINGUAQUEST - Tenses Engine Level 1 (Full Rules)
 * Mendukung: I, You, We, They, He, She, It, Name
 */

// --- HELPER: Deteksi Tipe Subjek ---
function getSubjectType(subject) {
    const s = subject.toLowerCase();
    if (['he', 'she', 'it'].includes(s)) return 'singular';
    if (['i', 'you', 'we', 'they'].includes(s)) return 'plural';
    return 'name'; // Asumsi nama tunggal
}

// --- 1. VERIFIKASI SIMPLE PRESENT ---
function verifyPresent(text, type) {
    const words = text.toLowerCase().replace(/[.!?]/g, '').trim().split(/\s+/);
    const subject = words[0];
    const sType = getSubjectType(subject);

    // --- TAMBAHAN: VALIDASI KOSAKATA ---
    // Kita cek apakah kata kerja/benda yang dimasukkan user ada di kamus level ini
    for (let i = 1; i < words.length; i++) {
        const wordToCheck = words[i];
        // Abaikan kata bantu umum (grammar) agar tidak salah deteksi
        const grammarWords = ['am', 'is', 'are', 'do', 'does', 'not', 'don\'t', 'doesn\'t', 'a', 'the', 'an'];
        if (!grammarWords.includes(wordToCheck)) {
            if (!isValidEnglishWord(wordToCheck)) {
                return { 
                    valid: false, 
                    error: `Kata '${wordToCheck}' tidak ada dalam daftar kosakata ${window.gameState.currentLevel}.` 
                };
            }
        }
    }

    if (type === 'positive') {
        const isNominal = words.some(w => ['am', 'is', 'are'].includes(w));
        if (isNominal) return { valid: true };
        
        const verb = words[1];
        if ((sType === 'singular' || sType === 'name') && verb && !verb.endsWith('s') && !verb.endsWith('es')) {
            return { valid: false, error: `Subjek '${subject}' butuh V1+s/es (contoh: ${verb}s).` };
        }
        return { valid: words.length >= 2, error: "Gunakan pola S + V1." };
    }

    if (type === 'negative') {
        if (sType === 'singular' || sType === 'name') {
            const hasDoesNot = text.includes("doesn't") || text.includes("does not") || text.includes("is not") || text.includes("isn't");
            return hasDoesNot ? { valid: true } : { valid: false, error: `Gunakan 'doesn't' atau 'is not' untuk '${subject}'.` };
        } else {
            const hasDoNot = text.includes("don't") || text.includes("do not") || text.includes("am not") || text.includes("are not") || text.includes("aren't");
            return hasDoNot ? { valid: true } : { valid: false, error: `Gunakan 'don't' atau 'am/are not' untuk '${subject}'.` };
        }
    }

    if (type === 'interrogative') {
        const first = words[0];
        if (sType === 'singular' || sType === 'name') {
            return ['does', 'is'].includes(first) ? { valid: true } : { valid: false, error: "Awali dengan 'Does' atau 'Is'." };
        }
        return ['do', 'am', 'are'].includes(first) ? { valid: true } : { valid: false, error: "Awali dengan 'Do', 'Am', atau 'Are'." };
    }
}

// --- 2. VERIFIKASI SIMPLE PAST ---
function verifyPast(text, type) {
    const words = text.toLowerCase().replace(/[.!?]/g, '').split(' ');
    const subject = words[0];
    const sType = getSubjectType(subject);
    const irr = window.IRREGULAR_VERBS || {};
    const allV2 = Object.values(irr).map(v => v.v2.toLowerCase());

    if (type === 'positive') {
        const hasV2 = words.some(w => allV2.includes(w) || w.endsWith('ed'));
        const hasWas = words.includes('was');
        const hasWere = words.includes('were');
        
        if ((subject === 'i' || sType === 'singular' || sType === 'name') && words.includes('were')) {
            return { valid: false, error: `Gunakan 'was', bukan 'were' untuk '${subject}'.` };
        }
        return (hasV2 || hasWas || hasWere) ? { valid: true } : { valid: false, error: "Gunakan V2 atau Was/Were." };
    }

    if (type === 'negative') {
        const hasDidNot = text.includes("didn't") || text.includes("did not");
        const hasWasNot = text.includes("wasn't") || text.includes("was not") || text.includes("weren't") || text.includes("were not");
        return hasDidNot || hasWasNot ? { valid: true } : { valid: false, error: "Gunakan didn't atau was/were not." };
    }

    if (type === 'interrogative') {
        return ['did', 'was', 'were'].includes(words[0]) ? { valid: true } : { valid: false, error: "Awali dengan Did/Was/Were." };
    }
}

// --- 3. VERIFIKASI SIMPLE FUTURE ---
function verifyFuture(text, type) {
    const cleanText = text.toLowerCase();
    const words = cleanText.replace(/[.!?]/g, '').split(' ');

    if (type === 'positive') {
        return (words.includes('will') || cleanText.includes('going to')) ? { valid: true } : { valid: false, error: "Gunakan 'will' atau 'be going to'." };
    }

    if (type === 'negative') {
        return (cleanText.includes("won't") || cleanText.includes("will not") || cleanText.includes("not going to")) ? { valid: true } : { valid: false, error: "Gunakan 'won't' atau 'not going to'." };
    }

    if (type === 'interrogative') {
        return ['will', 'am', 'is', 'are'].includes(words[0]) ? { valid: true } : { valid: false, error: "Awali dengan Will atau Am/Is/Are." };
    }
}

// LIVE VERB CHECKER
function liveVerbCheck() {
    const val = document.getElementById('verb-check-input').value.toLowerCase().trim();
    const res = document.getElementById('verb-check-res');
    if(!val) { res.innerHTML = ""; return; }

    const irr = window.IRREGULAR_VERBS || {};
    
    if(irr[val]) {
        res.innerHTML = `<span style="color: #2196F3;">Irregular:</span> ${val} → ${irr[val].v2} → ${irr[val].v3}`;
    } else {
        // Logika akhiran -ed sederhana
        let v23 = val.endsWith('e') ? val + 'd' : (val.endsWith('y') ? val.slice(0,-1) + 'ied' : val + 'ed');
        res.innerHTML = `<span style="color: #4CAF50;">Regular:</span> ${val} → ${v23} → ${v23}`;
    }
}