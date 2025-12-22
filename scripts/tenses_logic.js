// ==========================================
// 1. DATABASE TENSES (VERBAL & NOMINAL)
// ==========================================
if (typeof userStats === 'undefined') {
    var userStats = { currentLevel: 1 }; // Fallback jika main.js belum dimuat sempurna
}
let activeTense = null; 
const tensesData = {
    level1: [
        {
            id: "s_present",
            name: "Simple Present Tense",
            usage: "Fakta umum atau kebiasaan rutin.",
            time_signals: "Every day, always, usually.",
            v_formula: { pos: "S + V1 (s/es)", neg: "S + do/does + not + V1", int: "Do/Does + S + V1?" },
            n_formula: { pos: "S + am/is/are + Adj/Noun", neg: "S + am/is/are + not + Adj/Noun", int: "Am/Is/Are + S + Adj/Noun?" },
            examples_v: ["(+) I eat rice.", "(-) I do not eat rice.", "(?) Do you eat rice?"],
            examples_n: ["(+) She is a doctor.", "(-) She is not a doctor.", "(?) Is she a doctor?"]
        },
        {
            id: "s_past",
            name: "Simple Past Tense",
            usage: "Kejadian yang sudah selesai di masa lalu.",
            time_signals: "Yesterday, last night, two days ago.",
            v_formula: { pos: "S + V2", neg: "S + did + not + V1", int: "Did + S + V1?" },
            n_formula: { pos: "S + was/were + Adj/Noun", neg: "S + was/were + not + Adj/Noun", int: "Was/Were + S + Adj/Noun?" },
            examples_v: ["(+) They played soccer.", "(-) They did not play soccer.", "(?) Did they play soccer?"],
            examples_n: ["(+) You were tired.", "(-) You were not tired.", "(?) Were you tired?"]
        },
        {
            id: "s_future",
            name: "Simple Future Tense",
            usage: "Rencana atau aksi di masa depan.",
            time_signals: "Tomorrow, next week, tonight.",
            v_formula: { pos: "S + will + V1", neg: "S + will + not + V1", int: "Will + S + V1?" },
            n_formula: { pos: "S + will be + Adj/Noun", neg: "S + will not be + Adj/Noun", int: "Will + S + be + Adj/Noun?" },
            examples_v: ["(+) I will go home.", "(-) I will not go home.", "(?) Will you go home?"],
            examples_n: ["(+) It will be sunny.", "(-) It will not be sunny.", "(?) Will it be sunny?"]
        }
    ],
                
    level2: [
        {
            id: "pres_cont",
            name: "Present Continuous",
            usage: "Aksi yang sedang berlangsung sekarang.",
            time_signals: "Now, right now, at the moment.",
            v_formula: { pos: "S + am/is/are + V-ing", neg: "S + am/is/are + not + V-ing", int: "Am/Is/Are + S + V-ing?" },
            n_formula: { pos: "S + am/is/are + being + Adj", neg: "S + am/is/are + not + being + Adj", int: "Am/Is/Are + S + being + Adj?" },
            examples_v: ["(+) I am studying.", "(-) I am not studying.", "(?) Are you studying?"],
            examples_n: ["(+) He is being lazy.", "(-) He is not being lazy.", "(?) Is he being lazy?"]
        },
        {
            id: "past_cont",
            name: "Past Continuous",
            usage: "Aksi yang sedang berlangsung di masa lalu.",
            time_signals: "When, while, at 7 PM yesterday.",
            v_formula: { pos: "S + was/were + V-ing", neg: "S + was/were + not + V-ing", int: "Was/Were + S + V-ing?" },
            n_formula: { pos: "S + was/were + being + Adj", neg: "S + was/were + not + being + Adj", int: "Was/Were + S + being + Adj?" },
            examples_v: ["(+) They were eating.", "(-) They were not eating.", "(?) Were they eating?"],
            examples_n: ["(+) I was being honest.", "(-) I was not being honest.", "(?) Was I being honest?"]
        },
        {
            id: "fut_cont",
            name: "Future Continuous",
            usage: "Aksi yang akan sedang berlangsung nanti.",
            time_signals: "At this time tomorrow.",
            v_formula: { pos: "S + will be + V-ing", neg: "S + will not be + V-ing", int: "Will + S + be + V-ing?" },
            n_formula: { pos: "S + will be + being + Adj", neg: "S + will not be + being + Adj", int: "Will + S + be + being + Adj?" },
            examples_v: ["(+) We will be working.", "(-) We will not be working.", "(?) Will we be working?"],
            examples_n: ["(+) She will be being kind.", "(-) She will not be being kind.", "(?) Will she be being kind?"]
        },
       {
            id: "pres_perf",
            name: "Present Perfect",
            usage: "Aksi yang sudah selesai (waktu tidak spesifik).",
            time_signals: "Just, already, yet, since, for.",
            v_formula: { pos: "S + have/has + V3", neg: "S + have/has + not + V3", int: "Have/Has + S + V3?" },
            n_formula: { pos: "S + have/has + been + Adj/Noun", neg: "S + have/has + not + been + Adj/Noun", int: "Have/Has + S + been + Adj/Noun?" },
            examples_v: ["(+) I have eaten.", "(-) I have not eaten.", "(?) Have you eaten?"],
            examples_n: ["(+) We have been busy.", "(-) We have not been busy.", "(?) Have you been busy?"]
        }
],

level3: [
        {
            id: "past_perf",
            name: "Past Perfect",
            usage: "Aksi yang selesai sebelum aksi lain di masa lalu.",
            time_signals: "Before, after, by the time.",
            v_formula: { pos: "S + had + V3", neg: "S + had + not + V3", int: "Had + S + V3?" },
            n_formula: { pos: "S + had + been + Adj/Noun", neg: "S + had + not + been + Adj/Noun", int: "Had + S + been + Adj/Noun?" },
            examples_v: ["(+) He had left.", "(-) He had not left.", "(?) Had he left?"],
            examples_n: ["(+) It had been dark.", "(-) It had not been dark.", "(?) Had it been dark?"]
        },
        {
            id: "fut_perf",
            name: "Future Perfect",
            usage: "Aksi yang akan sudah selesai di masa depan.",
            time_signals: "By tomorrow, by next year.",
            v_formula: { pos: "S + will have + V3", neg: "S + will not have + V3", int: "Will + S + have + V3?" },
            n_formula: { pos: "S + will have + been + Adj/Noun", neg: "S + will not have + been + Adj/Noun", int: "Will + S + have + been + Adj/Noun?" },
            examples_v: ["(+) I will have finished.", "(-) I will not have finished.", "(?) Will you have finished?"],
            examples_n: ["(+) They will have been here.", "(-) They will not have been here.", "(?) Will they have been here?"]
        },
        {
            id: "pres_p_cont",
            name: "Present Perfect Continuous",
            usage: "Aksi dimulai di masa lalu dan masih berlanjut.",
            time_signals: "Since, for, all day.",
            v_formula: { pos: "S + have/has + been + V-ing", neg: "S + have/has + not + been + V-ing", int: "Have/Has + S + been + V-ing?" },
            n_formula: { pos: "S + have/has + been + being + Adj", neg: "S + have/has + not + been + being + Adj", int: "Have/Has + S + been + being + Adj?" },
            examples_v: ["(+) I have been waiting.", "(-) I have not been waiting.", "(?) Have you been waiting?"],
            examples_n: ["(+) She has been being nice.", "(-) She has not been being nice.", "(?) Has she been being nice?"]
        },
        {
            id: "past_p_cont",
            name: "Past Perfect Continuous",
            usage: "Durasi aksi sebelum aksi lain di masa lalu.",
            time_signals: "For 2 hours, before.",
            v_formula: { pos: "S + had + been + V-ing", neg: "S + had + not + been + V-ing", int: "Had + S + been + V-ing?" },
            n_formula: { pos: "S + had + been + being + Adj", neg: "S + had + not + been + being + Adj", int: "Had + S + been + being + Adj?" },
            examples_v: ["(+) He had been playing.", "(-) He had not been playing.", "(?) Had he been playing?"],
            examples_n: ["(+) You had been being calm.", "(-) You had not been being calm.", "(?) Had you been being calm?"]
        },
        ],

    level4: [
        {
            id: "fut_p_cont",
            name: "Future Perfect Continuous",
            usage: "Durasi aksi yang berlangsung di masa depan.",
            time_signals: "By next month, for 5 years.",
            v_formula: { pos: "S + will have + been + V-ing", neg: "S + will not have + been + V-ing", int: "Will + S + have + been + V-ing?" },
            n_formula: { pos: "S + will have + been + being + Adj", neg: "S + will not have + been + being + Adj", int: "Will + S + have + been + being + Adj?" },
            examples_v: ["(+) I will have been working.", "(-) I will not have been working.", "(?) Will you have been working?"],
            examples_n: ["(+) It will have been being hot.", "(-) It will not have been being hot.", "(?) Will it have been being hot?"]
        },
        {
            id: "s_p_future",
            name: "Simple Past Future",
            usage: "Rencana masa lalu atau pengandaian.",
            time_signals: "Would, should.",
            v_formula: { pos: "S + would + V1", neg: "S + would + not + V1", int: "Would + S + V1?" },
            n_formula: { pos: "S + would + be + Adj/Noun", neg: "S + would not + be + Adj/Noun", int: "Would + S + be + Adj/Noun?" },
            examples_v: ["(+) I would go.", "(-) I would not go.", "(?) Would you go?"],
            examples_n: ["(+) He would be happy.", "(-) He would not be happy.", "(?) Would he be happy?"]
        },
        {
            id: "p_fut_cont",
            name: "Past Future Continuous",
            usage: "Aksi yang seharusnya sedang berlangsung di masa lalu.",
            time_signals: "By this time.",
            v_formula: { pos: "S + would + be + V-ing", neg: "S + would not + be + V-ing", int: "Would + S + be + V-ing?" },
            n_formula: { pos: "S + would + be + being + Adj", neg: "S + would not + be + being + Adj", int: "Would + S + be + being + Adj?" },
            examples_v: ["(+) We would be dancing.", "(-) We would not be dancing.", "(?) Would we be dancing?"],
            examples_n: ["(+) You would be being brave.", "(-) You would not be being brave.", "(?) Would you be being brave?"]
        },

        ],
    level5: [
        {
            id: "p_fut_perf",
            name: "Past Future Perfect",
            usage: "Aksi yang seharusnya sudah selesai di masa lalu.",
            time_signals: "By last week.",
            v_formula: { pos: "S + would + have + V3", neg: "S + would not have + V3", int: "Would + S + have + V3?" },
            n_formula: { pos: "S + would + have + been + Adj/Noun", neg: "S + would not have + been + Adj/Noun", int: "Would + S + have + been + Adj/Noun?" },
            examples_v: ["(+) She would have won.", "(-) She would not have won.", "(?) Would she have won?"],
            examples_n: ["(+) I would have been late.", "(-) I would not have been late.", "(?) Would you have been late?"]
        },
        {
            id: "p_f_p_cont",
            name: "Past Future Perfect Continuous",
            usage: "Durasi aksi yang seharusnya sudah berlangsung di masa lalu.",
            time_signals: "For 3 years.",
            v_formula: { pos: "S + would + have + been + V-ing", neg: "S + would not have + been + V-ing", int: "Would + S + have + been + V-ing?" },
            n_formula: { pos: "S + would + have + been + being + Adj", neg: "S + would not have + been + being + Adj", int: "Would + S + have + been + being + Adj?" },
            examples_v: ["(+) I would have been waiting.", "(-) I would not have been waiting.", "(?) Would you have been waiting?"],
            examples_n: ["(+) It would have been being cold.", "(-) It would not have been being cold.", "(?) Would it have been being cold?"]
        }
    ]
};

function startTensesModule() {
    if (!canPlayModule('tenses')) return; 

    const container = document.getElementById('game-content');
    
    // Background diatur ke #f5f5f5 agar sama dengan modul lainnya
    container.innerHTML = `
        <div class="game-overlay-header" style="background: #2196F3; padding: 25px 15px; border-radius: 0 0 30px 30px; text-align:center; position:relative;">
            <button onclick="closeGameOverlay()" style="position:absolute; top:20px; left:15px; background:none; border:none; color:white; font-weight:bold; cursor:pointer;">
                <i class="fas fa-chevron-left"></i> Kembali
            </button>
            <i class="fas fa-brain" style="font-size: 2.2rem; color: #ff9600;"></i>
            <h2 style="color: white; margin: 0; text-transform: uppercase;">TENSES MASTER</h2>
        </div>

        <div id="tenses-module" style="padding: 15px; background: #f5f5f5; min-height: 100vh;">
            <div class="tenses-selector" id="tenses-tabs" style="display:flex; gap:8px; overflow-x:auto; padding-bottom:10px; margin-bottom:15px;"></div>
            
            <div id="tense-display-card" style="display:none; background:white; padding:20px; border-radius:15px; box-shadow: 0 4px 15px rgba(0,0,0,0.05);">
                <h3 id="t-name" style="color:#2196F3; margin:0;"></h3>
                <p id="t-usage" style="font-style:italic; color:#666; font-size:0.85rem; margin: 5px 0;"></p>
                
                <div style="background:#fff3e0; padding:10px; border-radius:8px; margin:10px 0; font-size:0.8rem; border-left:4px solid #ff9800;">
                    <strong>🕒 Time Signals:</strong> <span id="t-time"></span>
                </div>

                <div class="formula-details" style="background:#f8f9fa; padding:12px; border-radius:10px; margin: 15px 0; border-left:4px solid #2196F3;">
                    <h5 style="margin:0 0 5px 0; color:#2196F3;">VERBAL FORMULA:</h5>
                    <div style="font-family:monospace; font-size:0.85rem; color:#d32f2f; margin-bottom:10px;">
                        <div>(+) <span id="f-v-pos"></span></div>
                        <div>(-) <span id="f-v-neg"></span></div>
                        <div>(?) <span id="f-v-int"></span></div>
                    </div>

                    <h5 style="margin:10px 0 5px 0; color:#2196F3;">NOMINAL FORMULA:</h5>
                    <div style="font-family:monospace; font-size:0.85rem; color:#d32f2f;">
                        <div>(+) <span id="f-n-pos"></span></div>
                        <div>(-) <span id="f-n-neg"></span></div>
                        <div>(?) <span id="f-n-int"></span></div>
                    </div>
                </div>

                <div style="font-size:0.85rem; margin-bottom:15px;">
                    <strong style="color:#0d47a1;"><i class="fas fa-lightbulb"></i> Contoh Kalimat:</strong>
                    <ul id="v-examples-list" style="color:#1565c0; padding-left:20px; margin-top:5px;"></ul>
                    <ul id="n-examples-list" style="color:#1565c0; padding-left:20px; margin-top:5px;"></ul>
                </div>

                <div class="sandbox-box" style="border-top:2px dashed #eee; padding-top:15px;">
                    <h4 style="margin:0 0 10px 0; font-size:0.9rem;"><i class="fas fa-flask"></i> Sandbox: Eksperimen Kalimat</h4>
                    <input type="text" id="in-pos" placeholder="Kalimat Positif (+)" style="width:100%; padding:10px; margin-bottom:8px; border-radius:8px; border:1px solid #ddd;">
                    <input type="text" id="in-neg" placeholder="Kalimat Negatif (-)" style="width:100%; padding:10px; margin-bottom:8px; border-radius:8px; border:1px solid #ddd;">
                    <input type="text" id="in-int" placeholder="Kalimat Tanya (?)" style="width:100%; padding:10px; margin-bottom:12px; border-radius:8px; border:1px solid #ddd;">
                    
                    <button class="btn-upgrade btn-premium" style="width:100%; cursor:pointer;" onclick="validateMasterSandbox()">CEK STRUKTUR & DAPAT XP</button>
                    <div id="sandbox-res" style="margin-top:12px;"></div>
                </div>

                <div style="margin-top:20px; background:#f1f8e9; padding:15px; border-radius:12px; border:1px solid #c8e6c9;">
                    <h4 style="margin:0 0 10px 0; color:#2e7d32; font-size:0.9rem;"><i class="fas fa-search"></i> Verb Master Helper</h4>
                    <input type="text" id="verb-check-input" oninput="liveVerbCheck()" placeholder="Cek perubahan Verb (cth: eat, study)..." style="width:100%; padding:10px; border-radius:8px; border:1px solid #a5d6a7;">
                    <div id="verb-check-res" style="margin-top:10px;"></div>
                </div>
            </div>
        </div>
    `;
    
    document.getElementById('game-overlay').style.display = 'flex';
    renderTenseTabs();
}

function selectTenseForStudy(tense) {
    activeTense = tense; 
    
    const card = document.getElementById('tense-display-card');
    if (card) card.style.display = 'block';

    const setTenseText = (id, text) => {
        const el = document.getElementById(id);
        if (el) el.innerText = text || "-";
    };

    // Update Data Utama
    setTenseText('t-name', tense.name);
    setTenseText('t-usage', tense.usage);
    setTenseText('t-time', tense.time_signals);

    // Update Rumus (Sesuai HTML Anda yang menggunakan ID tunggal f-v dan f-n)
    const verbalFormula = `(+) ${tense.v_formula.pos}\n(-) ${tense.v_formula.neg}\n(?) ${tense.v_formula.int}`;
    const nominalFormula = `(+) ${tense.n_formula.pos}\n(-) ${tense.n_formula.neg}\n(?) ${tense.n_formula.int}`;
    
    setTenseText('f-v', verbalFormula);
    setTenseText('f-n', nominalFormula);

    // Render Contoh
    const vList = document.getElementById('v-examples-list');
    if (vList) vList.innerHTML = tense.examples_v.map(ex => `<li>${ex}</li>`).join('');

    const nList = document.getElementById('n-examples-list');
    if (nList) nList.innerHTML = tense.examples_n.map(ex => `<li>${ex}</li>`).join('');
    
    // Reset Sandbox
    ['in-pos', 'in-neg', 'in-int'].forEach(id => {
        const el = document.getElementById(id);
        if (el) el.value = "";
    });
    
    const res = document.getElementById('sandbox-res');
    if (res) {
        res.innerHTML = "";
        res.style.display = "none";
    }
    
    if (card) card.scrollIntoView({ behavior: 'smooth' });
}

function renderTenseTabs() {
    const tabs = document.getElementById('tenses-tabs');
    if (!tabs) return;
    tabs.innerHTML = "";
    
    // Gabungkan semua tense yang tersedia berdasarkan level user
    let available = [];
    const userLvl = window.userState?.currentLevel || 1;
    const maxLevel = parseInt(userLvl.toString().replace('LV','')) || 1;

    for (let i = 1; i <= maxLevel; i++) {
        if (tensesData[`level${i}`]) {
            available = [...available, ...tensesData[`level${i}`]];
        }
    }

    available.forEach(tense => {
        const btn = document.createElement('button');
        btn.innerText = tense.name;
        btn.className = "tense-btn"; // Pastikan CSS ini ada
        btn.style = "padding: 8px 15px; border-radius: 20px; border: 1px solid #2196F3; background: white; white-space: nowrap; cursor: pointer;";
        btn.onclick = () => startTenseQuiz(tense.id);
        tabs.appendChild(btn);
    });
}

/**
 * FUNGSI: Validasi Sandbox Mandiri
 * Deskripsi: Mengecek struktur kalimat tanpa bergantung pada database Vocab Master.
 */
function validateMasterSandbox() {
    if (!activeTense) return alert("Pilih materi tense terlebih dahulu!");

    const posInput = document.getElementById('in-pos').value.trim();
    const negInput = document.getElementById('in-neg').value.trim();
    const intInput = document.getElementById('in-int').value.trim();

    // Validasi input kosong
    if (!posInput || !negInput || !intInput) {
        return alert("Harap isi ketiga bentuk kalimat (Positif, Negatif, dan Tanya)!");
    }

    let results = [];
    const id = activeTense.id;

    try {
        // 1. Kelompok SIMPLE (Present & Past)
        if (id === 's_present' || id === 'pres_simple') {
            results = [
                verifyPresent(posInput, 'positive'),
                verifyPresent(negInput, 'negative'),
                verifyPresent(intInput, 'interrogative')
            ];
        } 
        else if (id === 's_past' || id === 'past_simple') {
            results = [
                verifyPast(posInput, 'positive'),
                verifyPast(negInput, 'negative'),
                verifyPast(intInput, 'interrogative')
            ];
        }
        // 2. Kelompok FUTURE & PAST FUTURE
        else if (id.includes('future') || id.includes('fut_simple')) {
            results = [
                verifyFuture(posInput, 'positive', id),
                verifyFuture(negInput, 'negative', id),
                verifyFuture(intInput, 'interrogative', id)
            ];
        }
        // 3. Kelompok PERFECT CONTINUOUS (Cek ini duluan sebelum Perfect biasa)
        else if (id.includes('perf_cont')) {
            results = [
                verifyPerfectContinuous(posInput, 'positive', id),
                verifyPerfectContinuous(negInput, 'negative', id),
                verifyPerfectContinuous(intInput, 'interrogative', id)
            ];
        }
        // 4. Kelompok PERFECT
        else if (id.includes('perf')) {
            results = [
                verifyPerfect(posInput, 'positive', id),
                verifyPerfect(negInput, 'negative', id),
                verifyPerfect(intInput, 'interrogative', id)
            ];
        }
        // 5. Kelompok CONTINUOUS
        else if (id.includes('cont')) {
            results = [
                verifyContinuous(posInput, 'positive', id),
                verifyContinuous(negInput, 'negative', id),
                verifyContinuous(intInput, 'interrogative', id)
            ];
        } 
        else {
            return alert(`Sistem verifikasi untuk ID Tense '${id}' belum terhubung.`);
        }

        // Tampilkan hasil ke UI
        displaySandboxResult(results);

    } catch (error) {
        console.error("Error saat verifikasi:", error);
        alert("Terjadi kesalahan teknis saat memeriksa kalimat. Silakan coba lagi.");
    }
}

function displaySandboxResult(results) {
    const resDiv = document.getElementById('sandbox-res');
    const allValid = results.every(r => r.valid);
    
    if (allValid) {
        resDiv.innerHTML = `
            <div style="background: #e8f5e9; color: #2e7d32; padding: 15px; border-radius: 10px; border: 1px solid #c8e6c9;">
                <i class="fas fa-check-circle"></i> <b>Sempurna!</b> Semua struktur kalimat benar.
                <br><small>+20 XP Berhasil didapatkan!</small>
            </div>`;
        
        // SINKRONISASI: Gunakan fungsi dari main.js
        if (typeof awardTensesXP === 'function') {
            awardTensesXP(20); 
        } else {
            addPoints(20);
        }
    } else {
        const errorMessages = results.filter(r => !r.valid).map(r => `<li>${r.error}</li>`).join('');
        resDiv.innerHTML = `
            <div style="background: #ffebee; color: #c62828; padding: 15px; border-radius: 10px; border: 1px solid #ffcdd2;">
                <b>Periksa kembali:</b>
                <ul style="margin: 5px 0 0 20px; font-size: 0.85rem;">${errorMessages}</ul>
            </div>`;
    }
    resDiv.style.display = "block";
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
    if (!subject) return 'plural';
    const s = subject.toLowerCase().trim();
    const rules = window.TENSES_SUBJECT_RULES || { 
        singular: ['he', 'she', 'it'], 
        plural: ['i', 'you', 'we', 'they'] 
    };
    
    if (rules.plural.includes(s)) return 'plural';
    if (rules.singular.includes(s)) return 'singular';
    return 'singular'; // Default untuk nama orang tunggal
}

/**
 * Helper untuk mengambil subjek berdasarkan tipe kalimat
 */
function detectSubject(words, type) {
    if (type === 'interrogative') {
        // Pada kalimat tanya: "Do [you] study?", subjek ada di indeks 1
        return words.length > 1 ? words[1] : words[0];
    }
    // Pada (+) dan (-): "[You] do not study", subjek ada di indeks 0
    return words[0];
}

function getCleanWords(text) {
    return text.toLowerCase().trim().replace(/[.!?]$/, "").split(/\s+/);
}

// --- HELPER: Deteksi Singkatan & Not ---
function hasNegativePattern(text) {
    const clean = text.toLowerCase();
    // Mendeteksi 'not' atau singkatan yang diakhiri n't (isn't, wasn't, doesn't, dll)
    return clean.includes("not") || clean.includes("n't");
}

// --- 1. VERIFIKASI SIMPLE PRESENT (REVISED) ---
function verifyPresent(text, type) {
    const cleanText = text.toLowerCase().trim().replace(/[.!?]$/, "");
    const words = getCleanWords(text);
    if (words.length < 1) return { valid: false, error: "Tuliskan kalimat terlebih dahulu." };

    const subject = detectSubject(words, type);
    const sType = getSubjectType(subject);

    if (type === 'positive') {
        const hasBe = words.some(w => ['am', 'is', 'are'].includes(w));
        if (hasBe) return { valid: true }; 
        const verb = words[1];
        if (!verb) return { valid: false, error: "Kata kerja tidak ditemukan." };
        if (sType === 'singular') {
            const endsCorrectly = verb.endsWith('s') || verb.endsWith('es') || verb.endsWith('ies');
            if (!endsCorrectly) return { valid: false, error: `Untuk '${subject}', kata kerja harus berakhir s/es.` };
        }
        return { valid: true };
    }

    if (type === 'negative') {
        if (!hasNegativePattern(cleanText)) {
            return { valid: false, error: "Kalimat negatif harus mengandung 'not' atau singkatan seperti 'n't'." };
        }
        
        if (sType === 'singular') {
            // Mendukung: doesn't, does not, isn't, is not
            const validSing = cleanText.includes("doesn") || cleanText.includes("does not") || 
                              cleanText.includes("isn") || cleanText.includes("is not");
            return validSing ? { valid: true } : { valid: false, error: "Gunakan 'doesn't' atau 'is not' untuk subjek tunggal." };
        } else {
            // Mendukung: don't, do not, aren't, are not, am not
            const validPlur = cleanText.includes("don") || cleanText.includes("do not") || 
                              cleanText.includes("aren") || cleanText.includes("are not") || 
                              cleanText.includes("am not");
            return validPlur ? { valid: true } : { valid: false, error: `Gunakan 'don't' atau 'am/are not' untuk subjek '${subject}'.` };
        }
    }

    if (type === 'interrogative') {
        const firstWord = words[0];
        if (sType === 'singular') {
            return ['does', 'is'].includes(firstWord) ? { valid: true } : { valid: false, error: "Awali dengan 'Does' atau 'Is' untuk subjek tunggal." };
        } else {
            const validAux = subject === 'i' ? ['do', 'am'] : ['do', 'are'];
            return validAux.includes(firstWord) ? { valid: true } : { valid: false, error: `Awali dengan '${validAux.join('/')}' untuk subjek '${subject}'.` };
        }
    }
}

// --- 2. VERIFIKASI SIMPLE PAST (REVISED) ---
function verifyPast(text, type) {
    const cleanText = text.toLowerCase().trim().replace(/[.!?]$/, "");
    const words = getCleanWords(text);
    if (words.length < 2) return { valid: false, error: "Kalimat minimal terdiri dari Subjek + Verb/Be." };

    if (type === 'positive') {
        if (!words.some(w => ['was', 'were'].includes(w)) && words.includes('did')) {
            return { valid: false, error: "Kalimat (+) Past Tense tidak perlu 'did', gunakan Verb-2." };
        }
        return { valid: true }; 
    }
    if (type === 'negative') {
        if (!hasNegativePattern(cleanText)) {
            return { valid: false, error: "Kalimat negatif harus mengandung 'not' atau singkatan 'n't'." };
        }
        // Mendukung: didn't, did not, wasn't, was not, weren't, were not
        const hasNeg = cleanText.includes("didn") || cleanText.includes("did not") || 
                       cleanText.includes("wasn") || cleanText.includes("was not") || 
                       cleanText.includes("weren") || cleanText.includes("were not");
        return hasNeg ? { valid: true } : { valid: false, error: "Gunakan 'didn't' atau 'was/were not'." };
    }
    if (type === 'interrogative') {
        return ['did', 'was', 'were'].includes(words[0]) ? { valid: true } : { valid: false, error: "Awali dengan 'Did', 'Was', atau 'Were'." };
    }
}

// --- 3. VERIFIKASI SIMPLE FUTURE (FIXED REFERENCE) ---
function verifyFuture(text, type) {
    const cleanText = text.toLowerCase().trim().replace(/[.!?]$/, "");
    const words = getCleanWords(text);
    if (words.length < 2) return { valid: false, error: "Kalimat tidak lengkap." };

    if (type === 'positive') {
        const isFuture = cleanText.includes('will') || cleanText.includes('going to');
        return isFuture ? { valid: true } : { valid: false, error: "Gunakan 'will' atau 'be going to'." };
    }
    if (type === 'negative') {
        // Mendukung: won't, will not, isn't/aren't going to
        if (!hasNegativePattern(cleanText)) return { valid: false, error: "Kalimat negatif butuh 'not' atau singkatan." };
        const hasAux = cleanText.includes('will') || cleanText.includes('won') || cleanText.includes('going');
        return hasAux ? { valid: true } : { valid: false, error: "Struktur future tidak ditemukan." };
    }
    if (type === 'interrogative') {
        return ['will', 'am', 'is', 'are'].includes(words[0]) ? { valid: true } : { valid: false, error: "Awali dengan 'Will' atau 'To-Be'." };
    }
}

// --- 4. VERIFIKASI CONTINUOUS TENSE ---
// --- 4. VERIFIKASI CONTINUOUS TENSE (REVISED) ---
function verifyContinuous(text, type, tenseId) {
    const cleanText = text.toLowerCase().trim().replace(/[.!?]$/, "");
    const words = getCleanWords(text);
    
    // Validasi dasar Verb-ing
    const hasIng = words.some(w => w.length > 3 && w.endsWith('ing'));
    if (!hasIng) return { valid: false, error: "Wajib menggunakan Verb-ing (contoh: studying, working)." };

    const subject = detectSubject(words, type);
    const sType = getSubjectType(subject);

    let beReq = "";
    if (tenseId === 'pres_cont') {
        if (subject === 'i') beReq = "am";
        else beReq = (sType === 'singular') ? "is" : "are";
    } else if (tenseId === 'past_cont') {
        // Was untuk I, He, She, It. Were untuk You, We, They.
        beReq = (['i', 'he', 'she', 'it'].includes(subject)) ? "was" : "were";
    } else if (tenseId === 'fut_cont') {
        beReq = "will"; // Untuk interogatif mengecek kata pertama
    }

    if (type === 'positive') {
        const hasBe = (tenseId === 'fut_cont') ? cleanText.includes('will be') : words.includes(beReq);
        return hasBe ? { valid: true } : { valid: false, error: `Pola Continuous butuh '${tenseId === 'fut_cont' ? 'will be' : beReq}' sebelum Verb-ing.` };
    }

    if (type === 'negative') {
        if (!hasNegativePattern(cleanText)) return { valid: false, error: "Kalimat negatif wajib mengandung 'not' atau 'n't'." };
        
        // Cek apakah ada To-Be yang sesuai sebelum/bersama not
        const hasCorrectBe = (tenseId === 'fut_cont') ? (cleanText.includes('will') || cleanText.includes('won')) : cleanText.includes(beReq.slice(0, 3));
        return hasCorrectBe ? { valid: true } : { valid: false, error: `Gunakan '${beReq}' + not.` };
    }

    if (type === 'interrogative') {
        const firstWord = words[0];
        return firstWord === beReq ? { valid: true } : { valid: false, error: `Awali dengan '${beReq}'.` };
    }
}

// --- 5. VERIFIKASI PERFECT CONTINUOUS (REVISED) ---
function verifyPerfectContinuous(text, type, tenseId) {
    const cleanText = text.toLowerCase().trim().replace(/[.!?]$/, "");
    const words = getCleanWords(text);
    
    // Pola dasar: Have/Has/Had + Been + V-ing
    const hasBeen = words.includes('been');
    const hasIng = words.some(w => w.endsWith('ing'));

    if (!hasBeen || !hasIng) {
        return { valid: false, error: "Pola ini wajib mengandung 'been' + 'Verb-ing'." };
    }

    const subject = detectSubject(words, type);
    const sType = getSubjectType(subject);

    // Tentukan Auxiliary utama
    let aux = "";
    if (tenseId === 'pres_perf_cont') {
        aux = (sType === 'singular') ? 'has' : 'have';
    } else if (tenseId === 'past_perf_cont') {
        aux = 'had';
    } else if (tenseId === 'fut_perf_cont') {
        aux = 'will';
    }

    if (type === 'positive') {
        const hasAux = (tenseId === 'fut_perf_cont') ? cleanText.includes('will have') : words.includes(aux);
        return hasAux ? { valid: true } : { valid: false, error: `Kata bantu '${tenseId === 'fut_perf_cont' ? 'will have' : aux}' tidak ditemukan.` };
    }

    if (type === 'negative') {
        if (!hasNegativePattern(cleanText)) return { valid: false, error: "Kalimat negatif wajib mengandung 'not' atau 'n't'." };
        const hasAux = (tenseId === 'fut_perf_cont') ? (cleanText.includes('will') || cleanText.includes('won')) : cleanText.includes(aux);
        return hasAux ? { valid: true } : { valid: false, error: `Gunakan '${aux}' sebelum 'not'.` };
    }

    if (type === 'interrogative') {
        return words[0] === aux ? { valid: true } : { valid: false, error: `Awali dengan '${aux}'.` };
    }
    
    return { valid: true };
}

// --- 7. FUNGSI VALIDASI KOSAKATA (PENTING: Agar tidak error 'undefined') ---
function isValidEnglishWord(word) { return true; }

// --- 8. FUNGSI ADD POINTS (PASTIKAN DI LUAR FUNGSI LAIN) ---
function addPoints(pts) {
    const state = window.userState || (typeof userState !== 'undefined' ? userState : null);
    if (state) {
        state.points = (state.points || 0) + pts;
        if (typeof saveUserData === 'function') saveUserData();
        if (typeof updateUI === 'function') updateUI();
    }
}

// LIVE VERB CHECKER
function liveVerbCheck() {
    const val = document.getElementById('verb-check-input').value.toLowerCase().trim();
    const res = document.getElementById('verb-check-res');
    if(!val) { res.innerHTML = ""; return; }

    const irr = window.IRREGULAR_VERBS || {};
    
    // Logika Otomatis V-ing (Continuous)
    let vIng = val;
    if (val.endsWith('e') && !val.endsWith('ee')) {
        vIng = val.slice(0, -1) + "ing"; // write -> writing
    } else if (val.match(/[aeiou][b-df-hj-np-tv-z]$/)) {
        vIng = val + val.slice(-1) + "ing"; // run -> running (dobel konsonan)
    } else {
        vIng = val + "ing"; // read -> reading
    }

    if(irr[val]) {
        res.innerHTML = `
            <div style="background:#e3f2fd; padding:8px; border-radius:5px;">
                <b style="color:#2196F3;">Irregular:</b> ${val} <i class="fas fa-arrow-right"></i> ${irr[val].v2} <i class="fas fa-arrow-right"></i> ${irr[val].v3}<br>
                <small style="color:#666;">Continuous: <b>${vIng}</b></small>
            </div>`;
    } else {
        // Logika akhiran -ed sederhana (Regular)
        let v23 = val.endsWith('e') ? val + 'd' : (val.endsWith('y') ? val.slice(0,-1) + 'ied' : val + 'ed');
        res.innerHTML = `
            <div style="background:#e8f5e9; padding:8px; border-radius:5px;">
                <b style="color:#4CAF50;">Regular:</b> ${val} <i class="fas fa-arrow-right"></i> ${v23} <i class="fas fa-arrow-right"></i> ${v23}<br>
                <small style="color:#666;">Continuous: <b>${vIng}</b></small>
            </div>`;
    }
}

/**
 * FUNGSI: Menampilkan Detail Tense & Mengaktifkan Sandbox
 * Menghubungkan tombol di Tab dengan tampilan kartu.
 */
function startTenseQuiz(tenseId) {
    let tense = null;
    for (let lv in tensesData) {
        tense = tensesData[lv].find(t => t.id === tenseId);
        if (tense) break;
    }

    if (!tense) return;
    activeTense = tense;

    const card = document.getElementById('tense-display-card');
    card.style.display = 'block';

    // Mengisi Data Tense
    document.getElementById('t-name').innerText = tense.name;
    document.getElementById('t-usage').innerText = tense.usage;
    document.getElementById('t-time').innerText = tense.time_signals;
    
    // Mengisi Rumus
    document.getElementById('f-v-pos').innerText = tense.v_formula.pos;
    document.getElementById('f-v-neg').innerText = tense.v_formula.neg;
    document.getElementById('f-v-int').innerText = tense.v_formula.int;
    document.getElementById('f-n-pos').innerText = tense.n_formula.pos;
    document.getElementById('f-n-neg').innerText = tense.n_formula.neg;
    document.getElementById('f-n-int').innerText = tense.n_formula.int;

    // Mengisi Contoh
    document.getElementById('v-examples-list').innerHTML = tense.examples_v.map(ex => `<li>${ex}</li>`).join('');
    document.getElementById('n-examples-list').innerHTML = tense.examples_n ? tense.examples_n.map(ex => `<li>${ex}</li>`).join('') : "";
    
    // Reset Sandbox
    document.getElementById('in-pos').value = "";
    document.getElementById('in-neg').value = "";
    document.getElementById('in-int').value = "";
    document.getElementById('sandbox-res').innerHTML = "";

    card.scrollIntoView({ behavior: 'smooth' });
}

// Tambahkan ini di tenses_logic.js untuk testing
window.addEventListener('keydown', (e) => {
    // Jika menekan tombol 'L' + '7' secara bersamaan
    if (e.key === 'L' && e.ctrlKey) {
        userState.stats.tenses.unlockedLevel = 5;
        updateUI();
        console.log("Admin: Semua level terbuka.");
    }
});

// ==========================================
// ADMIN & TESTING TOOLS (SECRET TRIGGER)
// ==========================================

window.addEventListener('keydown', function(e) {
    // 1. Ctrl + Shift + U: Buka Semua Level
    if (e.ctrlKey && e.shiftKey && e.key === 'U') {
        userState.stats.tenses.unlockedLevel = 5;
        updateUI();
        alert("Admin: Semua level dibuka!");
    }

    // 2. Ctrl + Shift + F: Auto Fill (Paling berguna saat Demo)
    if (e.ctrlKey && e.shiftKey && e.key === 'F') {
        autoFillSandbox();
    }

    // 3. Ctrl + Shift + R: Reset ke Level 1
    if (e.ctrlKey && e.shiftKey && e.key === 'R') {
        if (confirm("Reset Progres?")) {
            userState.stats.tenses.unlockedLevel = 1;
            saveUserData();
            location.reload();
        }
    }
});

/**
 * FUNGSI ADMIN: Mengisi Sandbox secara otomatis untuk keperluan demo.
 * Hanya mengambil data contoh dari activeTense.
 */
function autoFillSandbox() {
    if (!activeTense) return;

    // Mengambil contoh pertama dari list contoh yang ada di data
    const posExample = activeTense.examples_v[0] || "I study English.";
    
    // Logika sederhana untuk menghasilkan negatif dan tanya dari contoh
    // (Atau Anda bisa menambahkan field 'demo' khusus di data.js Anda nanti)
    document.getElementById('in-pos').value = posExample;
    
    // Memberikan instruksi pengisian manual jika contoh lain tidak tersedia
    document.getElementById('in-neg').value = "I do not " + posExample.split(' ').slice(1).join(' ');
    document.getElementById('in-int').value = "Do I " + posExample.split(' ').slice(1).join(' ');

    console.log("Admin: Sandbox auto-filled for demo.");
}

/**
 * Menampilkan hasil validasi ke layar, memutar suara, dan memicu Toast.
 */
function displaySandboxResult(results) {
    const resDiv = document.getElementById('sandbox-res');
    if (!resDiv) return console.error("Elemen 'sandbox-res' tidak ditemukan!");

    resDiv.innerHTML = ""; // Bersihkan tampilan lama
    resDiv.style.display = "block"; // Pastikan container terlihat

    // Cek apakah semua jawaban (Positif, Negatif, Tanya) benar
    const allValid = results.every(r => r.valid === true);

    results.forEach((res, index) => {
        const p = document.createElement('p');
        p.style.margin = "5px 0";
        p.style.padding = "10px";
        p.style.borderRadius = "8px";
        p.style.fontSize = "0.9rem";
        p.style.fontWeight = "bold";

        // Berikan warna latar belakang tipis agar lebih modern
        p.style.backgroundColor = res.valid ? "rgba(46, 204, 113, 0.1)" : "rgba(231, 76, 60, 0.1)";
        p.style.color = res.valid ? "#27ae60" : "#c0392b";

        const labels = ["POSITIF", "NEGATIF", "TANYA"];
        p.innerHTML = `<span>${res.valid ? "✅" : "❌"}</span> ${labels[index]}: ${res.valid ? "Sempurna!" : res.error}`;
        
        resDiv.appendChild(p);
    });

    // --- LOGIKA FEEDBACK SUARA & TOAST ---
    if (allValid) {
        if (typeof playSuccessSound === 'function') playSuccessSound();
        showToast("Luar biasa! Semua struktur benar.", "success");
        
        // Sebagai Admin, Anda bisa melihat progres simulasi bertambah
        if (window.isAdminMode) {
            console.log("Admin: Simulasi penambahan XP sukses.");
        }
    } else {
        if (typeof playErrorSound === 'function') playErrorSound();
        showToast("Beberapa kalimat masih salah.", "error");
    }
}