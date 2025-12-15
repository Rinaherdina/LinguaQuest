// scripts/tenses-logic.js
// Logika inti untuk manipulasi kata kerja, penentuan tenses, dan PENILAIAN 3 TIPE.

// Pastikan semua import dari data.js sudah benar
import { TENSES_DATA, PRONOUNS } from './data.js';
import { IRREGULAR_VERBS } from './irregular_verbs.js';

// ====================================================================
// --- DATA OBJEK/KETERANGAN LOGIS DEFAULT ---
// ====================================================================
const VERB_OBJECT_MAP = {
    // Kelompok Kata Kerja Makanan
    'eat': { object: 'an apple', time: 'every day' }, 
    'drink': { object: 'some water', time: 'after work' },
    
    // Kelompok Kata Kerja Aksi/Hiburan
    'watch': { object: 'a good movie', time: 'on TV' },
    'read': { object: 'a fantasy book', time: 'last night' },
    'see': { object: 'the new exhibit', time: 'at the museum' },

    // Kelompok Kata Kerja Gerakan/Perjalanan
    'go': { object: 'to the park', time: 'in the morning' },
    'run': { object: 'a marathon', time: 'on the track' },
    'take': { object: 'the bus', time: 'to the city' },

    // Kelompok Kata Kerja Belajar/Kerja
    'study': { object: 'the new lesson', time: 'for the exam' },
    'write': { object: 'an important letter', time: 'quickly' },
    'speak': { object: 'English fluently', time: 'in class' },
    'do': { object: 'homework', time: 'at home' },
    
    // Default fallback jika tidak ada dalam daftar
    'default': { object: 'the main task', time: 'every day' } 
};

// DATA KHUSUS UNTUK TENSES NOMINAL (TO BE)
const NOMINAL_COMPLEMENT_MAP = {
    'i': { complement: 'a student', time: 'right now' },
    'he': { complement: 'happy', time: 'today' },
    'she': { complement: 'at the office', time: 'this morning' },
    'it': { complement: 'interesting', time: 'right now' },
    'we': { complement: 'tired', time: 'tonight' },
    'you': { complement: 'smart', time: 'in class' },
    'they': { complement: 'friends', time: 'now' },
    'default': { complement: 'ready', time: 'at 8 AM' } 
};

// DAFTAR BENTUK NEGATIF YANG DIIZINKAN (LENGKAP dan KONTRAKSI)
const ALLOWED_NOT_FORMS = {
    'do': ['do not', "don't"],
    'does': ['does not', "doesn't"],
    'did': ['did not', "didn't"],
    'is': ['is not', "isn't"],
    'are': ['are not', "aren't"],
    'am': ['am not', 'am not'], 
    'have': ['have not', "haven't"],
    'has': ['has not', "hasn't"],
    'had': ['had not', "hadn't"],
    'will': ['will not', "won't"], 
    'would': ['would not', "wouldn't"],
    'was': ['was not', "wasn't"],
    'were': ['were not', "weren't"],
};


// ====================================================================
// --- A. HELPER FUNCTIONS (Logika Inti Kata Kerja & Subjek) ---
// ====================================================================

/**
 * Menghasilkan bentuk V-ing (Gerund/Present Participle) yang lebih akurat.
 * @param {string} v1 - Kata kerja V1.
 * @returns {string} - Kata kerja V-ing.
 */
function getVingForm(v1) {
    const verb = v1.toLowerCase().trim();
    if (verb.endsWith('e') && verb.length > 1 && verb !== 'be' && verb !== 'fee' && verb !== 'dye') {
        return `${verb.slice(0, -1)}ing`;
    }
    if (verb.endsWith('ie')) {
        return `${verb.slice(0, -2)}ying`;
    }
    return `${verb}ing`;
}

/**
 * Memeriksa apakah subjek adalah Orang Ketiga Tunggal (Third Singular).
 * @param {string} subject - Subjek kalimat.
 * @returns {boolean}
 */
function isThirdSingular(subject) {
    const s = subject.toLowerCase().trim();
    const tsPronouns = PRONOUNS.thirdSingular.map(p => p.toLowerCase());
    if (tsPronouns.includes(s)) {
        return true;
    }
    const knownPluralsAndFirstSecond = [
        ...PRONOUNS.firstPlural, 
        ...PRONOUNS.thirdPlural, 
        PRONOUNS.firstSingular, 
        PRONOUNS.secondSingular
    ].map(p => p.toLowerCase());

    if (!knownPluralsAndFirstSecond.includes(s) && s.length > 0) {
        if (!s.includes(' and ') && !s.endsWith('s')) {
            return true;
        }
    }
    return false;
}

/**
 * Memeriksa apakah tensesId adalah tipe Nominal (Tenses Be)
 * @param {string} tensesId 
 * @returns {boolean}
 */
function isNominalTense(tensesId) {
    return tensesId === 'simple_present_nominal' || tensesId === 'simple_past_nominal';
}

/**
 * Mengambil bentuk V1, V2, V3, dan V-ing dari kata kerja.
 * @param {string} v1 - Kata kerja bentuk dasar (V1).
 * @returns {{ v1: string, v2: string, v3: string, v_ing: string }}
 */
function getVerbForms(v1) {
    const verb = v1.toLowerCase().trim();
    if (!verb) return { v1: '', v2: '', v3: '', v_ing: '' };

    const irregularForms = IRREGULAR_VERBS[verb];
    const v_ing = getVingForm(verb);

    if (irregularForms) {
        return { 
            v1: verb, 
            v2: irregularForms.v2, 
            v3: irregularForms.v3, 
            v_ing: v_ing 
        };
    } else {
        let v2v3;
        if (verb.endsWith('e')) {
            v2v3 = `${verb}d`;
        } else if (verb.endsWith('y') && !/[aeiou]y/i.test(verb)) {
            v2v3 = `${verb.slice(0, -1)}ied`;
        } else {
            v2v3 = `${verb}ed`;
        }
        return { 
            v1: verb, 
            v2: v2v3, 
            v3: v2v3, 
            v_ing: v_ing
        };
    }
}

/**
 * Mengambil kata kerja bantu (Auxiliary) yang tepat berdasarkan Tenses dan Subjek.
 * @param {string} tensesId - ID tenses.
 * @param {string} subject - Subjek kalimat.
 * @returns {object}
 */
function getAuxiliary(tensesId, subject) {
    const isTS = isThirdSingular(subject); 
    const s = subject.toLowerCase().trim();

    switch (tensesId) {
        case 'simple_present':
        case 'simple_present_nominal': 
            return { aux_do: isTS ? 'does' : 'do', aux_be: (s === 'i' ? 'am' : (isTS ? 'is' : 'are')) };
        case 'present_continuous':
        case 'simple_future_goingto':
            if (s === 'i') return { aux_be: 'am' };
            if (isTS) return { aux_be: 'is' };
            return { aux_be: 'are' };
        case 'present_perfect':
        case 'present_perfect_continuous':
            return { aux_have: isTS ? 'has' : 'have' };
        case 'past_continuous':
        case 'simple_past_nominal': 
            if (s === 'i' || isTS) return { aux_be: 'was' };
            return { aux_be: 'were' };
        case 'simple_past':
            return { aux_did: 'did' };
        case 'past_perfect':
        case 'past_perfect_continuous':
            return { aux_had: 'had' };
        case 'simple_future':
        case 'future_continuous':
        case 'future_perfect':
        case 'future_perfect_continuous':
        case 'past_future_tense':
        case 'past_future_continuous':
        case 'past_future_perfect':
        case 'past_future_perfect_continuous':
            return { aux_will: 'will', aux_would: 'would' };
        default:
            return {};
    }
}

/**
 * Mengambil V1-s/es yang benar untuk Simple Present Tense (Positive) Third Singular.
 * @param {string} V1 - Kata kerja bentuk dasar.
 * @returns {string} - V1-s/es yang benar.
 */
export function getV1sForm(V1) {
    // 1. Pengecekan Kritis: Tangani jika V1 undefined, null, atau bukan string
    if (!V1 || typeof V1 !== 'string' || V1.trim().length === 0) {
        return '';
    }

    // Normalisasi: Ubah ke huruf kecil untuk pengecekan konsisten
    let verb = V1.toLowerCase();
    let requiredVForm;
    
    // 2. Penanganan Pengecualian 'be' (to be)
    if (verb === 'be') {
        return 'is'; 
    }

    // 3. Logika penambahan ES/S (V1 yang direvisi)
    if (verb.endsWith('s') || verb.endsWith('sh') || verb.endsWith('ch') || verb.endsWith('x') || verb.endsWith('o')) {
        // Contoh: pass -> passes, wash -> washes, teach -> teaches
        requiredVForm = `${V1}es`; // Gunakan V1 asli (dengan case) untuk output
    } else if (verb.endsWith('y') && !/[aeiou]y/i.test(V1)) {
        // Contoh: study -> studies (huruf sebelum 'y' adalah konsonan)
        requiredVForm = `${V1.slice(0, -1)}ies`;
    } else {
        // Contoh: eat -> eats, run -> runs
        requiredVForm = `${V1}s`;
    }
    
    return requiredVForm;
}

/**
 * Menghasilkan kalimat acuan (Positive, Negative, atau Interrogative) yang benar.
 */
export function generateReferenceSentence(tensesId, subject, verbForms, aux, object, time, sentenceType) {
    const { v1: V1, v2: V2, v3: V3, v_ing: V_ING } = verbForms;
    const isTS = isThirdSingular(subject);
    let result = '';
    const s = subject.toLowerCase().trim();

    // === START: KHUSUS NOMINAL TENSES (TENSES BE) ===
    const isNominal = isNominalTense(tensesId);
    if (isNominal) {
        const complementData = NOMINAL_COMPLEMENT_MAP[s] || NOMINAL_COMPLEMENT_MAP.default;
        const beForm = aux.aux_be; 
        const complement = complementData.complement;
        let timeClauseNominal = complementData?.time || '';
        
        if (tensesId === 'simple_past_nominal') {
            timeClauseNominal = 'yesterday'; 
        }

        if (sentenceType === 'positive') result = `${subject} ${beForm} ${complement} ${timeClauseNominal}.`;
        if (sentenceType === 'negative') result = `${subject} ${beForm} NOT ${complement} ${timeClauseNominal}.`;
        if (sentenceType === 'interrogative') result = `${beForm} ${subject} ${complement} ${timeClauseNominal}?`;
        
        result = result.trim().replace(/\s{2,}/g, ' ');
        if (result.length > 0) {
            result = result.charAt(0).toUpperCase() + result.slice(1);
        }
        return result; 
    }
    // === END: KHUSUS NOMINAL TENSES ===

    let v1s = getV1sForm(V1); 

    // Penentuan Auxiliary yang dibutuhkan
    let didAux = aux.aux_did || 'did';
    let doDoesAux = aux.aux_do || (isTS ? 'does' : 'do');
    let beAux = aux.aux_be;
    let haveAux = aux.aux_have;
    let hadAux = aux.aux_had;
    let willAux = 'will';
    let wouldAux = 'would';
    
    // Keterangan Waktu/Konjungsi Sesuai Tenses
    let timeClause;
    switch(tensesId) {
        case 'simple_present': timeClause = time; break;
        case 'simple_past': timeClause = 'yesterday'; break;
        case 'simple_future': timeClause = 'tomorrow'; break;
        case 'present_continuous': timeClause = 'right now'; break;
        case 'past_continuous': timeClause = 'when you called'; break;
        case 'future_continuous': timeClause = 'at this time tomorrow'; break;
        case 'present_perfect': timeClause = 'already'; break;
        case 'past_perfect': timeClause = 'before the meeting started'; break;
        case 'future_perfect': timeClause = 'by next week'; break;
        case 'present_perfect_continuous': timeClause = 'for three hours'; break;
        case 'past_perfect_continuous': timeClause = 'when the lights went out'; break;
        case 'future_perfect_continuous': timeClause = 'by Christmas'; break;
        case 'simple_future_goingto': timeClause = 'this evening'; break;
        case 'past_future_tense': timeClause = 'but they couldn\'t'; break;
        case 'past_future_continuous': timeClause = 'at that time'; break;
        case 'past_future_perfect': timeClause = 'if they had time'; break;
        case 'past_future_perfect_continuous': timeClause = 'for two hours'; break;
        default: timeClause = '';
    }

    switch (tensesId) {
        case 'simple_present':
            if (sentenceType === 'positive') result = `${subject} ${isTS ? v1s : V1} ${object} ${timeClause}.`;
            if (sentenceType === 'negative') result = `${subject} ${doDoesAux} NOT ${V1} ${object} ${timeClause}.`;
            if (sentenceType === 'interrogative') result = `${doDoesAux} ${subject} ${V1} ${object} ${timeClause}?`;
            break;
        case 'simple_past':
            if (sentenceType === 'positive') result = `${subject} ${V2} ${object} ${timeClause}.`;
            if (sentenceType === 'negative') result = `${subject} ${didAux} NOT ${V1} ${object} ${timeClause}.`;
            if (sentenceType === 'interrogative') result = `${didAux} ${subject} ${V1} ${object} ${timeClause}?`;
            break;
        case 'simple_future':
            if (sentenceType === 'positive') result = `${subject} ${willAux} ${V1} ${object} ${timeClause}.`;
            if (sentenceType === 'negative') result = `${subject} ${willAux} NOT ${V1} ${object} ${timeClause}.`;
            if (sentenceType === 'interrogative') result = `${willAux} ${subject} ${V1} ${object} ${timeClause}?`;
            break;
        case 'present_continuous':
            if (sentenceType === 'positive') result = `${subject} ${beAux} ${V_ING} ${object} ${timeClause}.`;
            if (sentenceType === 'negative') result = `${subject} ${beAux} NOT ${V_ING} ${object} ${timeClause}.`;
            if (sentenceType === 'interrogative') result = `${beAux} ${subject} ${V_ING} ${object} ${timeClause}?`;
            break;
        case 'present_perfect':
            if (sentenceType === 'positive') result = `${subject} ${haveAux} ${V3} ${object} ${timeClause}.`;
            if (sentenceType === 'negative') result = `${subject} ${haveAux} NOT ${V3} ${object} yet.`; 
            if (sentenceType === 'interrogative') result = `${haveAux} ${subject} ${V3} ${object} yet?`;
            break;
        case 'past_continuous':
            if (sentenceType === 'positive') result = `${subject} ${beAux} ${V_ING} ${object} ${timeClause}.`;
            if (sentenceType === 'negative') result = `${subject} ${beAux} NOT ${V_ING} ${object} ${timeClause}.`;
            if (sentenceType === 'interrogative') result = `${beAux} ${subject} ${V_ING} ${object} ${timeClause}?`;
            break;
        case 'future_continuous':
            if (sentenceType === 'positive') result = `${subject} ${willAux} be ${V_ING} ${object} ${timeClause}.`;
            if (sentenceType === 'negative') result = `${subject} ${willAux} NOT be ${V_ING} ${object} ${timeClause}.`;
            if (sentenceType === 'interrogative') result = `${willAux} ${subject} be ${V_ING} ${object} ${timeClause}?`;
            break;
        case 'past_perfect':
            if (sentenceType === 'positive') result = `${subject} ${hadAux} ${V3} ${object} ${timeClause}.`;
            if (sentenceType === 'negative') result = `${subject} ${hadAux} NOT ${V3} ${object} ${timeClause}.`;
            if (sentenceType === 'interrogative') result = `${hadAux} ${subject} ${V3} ${object} ${timeClause}?`;
            break;
        case 'future_perfect':
            if (sentenceType === 'positive') result = `${subject} ${willAux} have ${V3} ${object} ${timeClause}.`;
            if (sentenceType === 'negative') result = `${subject} ${willAux} NOT have ${V3} ${object} ${timeClause}.`;
            if (sentenceType === 'interrogative') result = `${willAux} ${subject} have ${V3} ${object} ${timeClause}?`;
            break;
        case 'present_perfect_continuous':
            if (sentenceType === 'positive') result = `${subject} ${haveAux} been ${V_ING} ${object} ${timeClause}.`;
            if (sentenceType === 'negative') result = `${subject} ${haveAux} NOT been ${V_ING} ${object} ${timeClause}.`;
            if (sentenceType === 'interrogative') result = `${haveAux} ${subject} been ${V_ING} ${object} ${timeClause}?`;
            break;
        case 'past_perfect_continuous':
            if (sentenceType === 'positive') result = `${subject} ${hadAux} been ${V_ING} ${object} ${timeClause}.`;
            if (sentenceType === 'negative') result = `${subject} ${hadAux} NOT been ${V_ING} ${object} ${timeClause}.`;
            if (sentenceType === 'interrogative') result = `${hadAux} ${subject} been ${V_ING} ${object} ${timeClause}?`;
            break;
        case 'future_perfect_continuous':
            if (sentenceType === 'positive') result = `${subject} ${willAux} have been ${V_ING} ${object} ${timeClause}.`;
            if (sentenceType === 'negative') result = `${subject} ${willAux} NOT have been ${V_ING} ${object} ${timeClause}.`;
            if (sentenceType === 'interrogative') result = `${willAux} ${subject} have been ${V_ING} ${object} ${timeClause}?`;
            break;
        case 'simple_future_goingto':
            if (sentenceType === 'positive') result = `${subject} ${beAux} going to ${V1} ${object} ${timeClause}.`;
            if (sentenceType === 'negative') result = `${subject} ${beAux} NOT going to ${V1} ${object} ${timeClause}.`;
            if (sentenceType === 'interrogative') result = `${beAux} ${subject} going to ${V1} ${object} ${timeClause}?`;
            break;
        case 'past_future_tense':
            if (sentenceType === 'positive') result = `${subject} ${wouldAux} ${V1} ${object} ${timeClause}.`;
            if (sentenceType === 'negative') result = `${subject} ${wouldAux} NOT ${V1} ${object} if they knew the truth.`; 
            if (sentenceType === 'interrogative') result = `${wouldAux} ${subject} ${V1} ${object} if you asked?`;
            break;
        case 'past_future_continuous':
            if (sentenceType === 'positive') result = `${subject} ${wouldAux} be ${V_ING} ${object} ${timeClause}.`;
            if (sentenceType === 'negative') result = `${subject} ${wouldAux} NOT be ${V_ING} ${object} when you called.`;
            if (sentenceType === 'interrogative') result = `${wouldAux} ${subject} be ${V_ING} ${object} then?`;
            break;
        case 'past_future_perfect':
            if (sentenceType === 'positive') result = `${subject} ${wouldAux} have ${V3} ${object} ${timeClause}.`;
            if (sentenceType === 'negative') result = `${subject} ${wouldAux} NOT have ${V3} ${object} without help.`;
            if (sentenceType === 'interrogative') result = `${wouldAux} ${subject} have ${V3} ${object} earlier?`;
            break;
        case 'past_future_perfect_continuous':
            if (sentenceType === 'positive') result = `${subject} ${wouldAux} have been ${V_ING} ${object} ${timeClause}.`;
            if (sentenceType === 'negative') result = `${subject} ${wouldAux} NOT have been ${V_ING} ${object} by then.`;
            if (sentenceType === 'interrogative') result = `${wouldAux} ${subject} have been ${V_ING} ${object} all day?`;
            break;
        default:
             result = (sentenceType === 'interrogative') ? 'Tenses tidak terdefinisi?' : 'Tenses tidak terdefinisi.';
             break;
    }

    // Final check dan kapitalisasi
    result = result.trim().replace(/\s{2,}/g, ' ');
    if (result.length > 0) {
        result = result.charAt(0).toUpperCase() + result.slice(1);
    }
    return result;
}


// ====================================================================
// --- B. EXPORTED FUNCTIONS (Tampilan & Struktur) ---
// ====================================================================

function getTensesInfo(tensesId) {
    return TENSES_DATA.find(t => t.id === tensesId);
}

/**
 * 🎯 BARU: Mengambil materi detail (fungsi, penggunaan, keterangan waktu) untuk Tenses.
 */
export function getTensesMaterial(tensesId) {
    const info = getTensesInfo(tensesId);
    
    // Jika data tenses tidak ditemukan, kembalikan objek dengan SEMUA ARRAY KOSONG
    if (!info) {
        return {
            id: null,
            name: 'Data Tenses Tidak Ditemukan',
            formula_pos: '', 
            formula_neg: '',
            formula_int: '',
            fungsi: [], // <-- PENTING: Harus Array kosong
            penggunaan: [], // <-- PENTING: Harus Array kosong
            keterangan_waktu: [] // <-- PENTING: Harus Array kosong
        };
    }

    return {
        id: info.id,
        name: info.name,
        formula_pos: info.formula_pos,
        formula_neg: info.formula_neg,
        formula_int: info.formula_int,
        
        // PENTING: Tambahkan fallback "|| []" untuk memastikan properti ini adalah Array
        fungsi: info.fungsi || [], 
        penggunaan: info.penggunaan || [],
        keterangan_waktu: info.keterangan_waktu || [] 
    };
}


function getAllTenses() {
    return TENSES_DATA; 
}

function getAllPronouns() {
    return [
        PRONOUNS.firstSingular, 
        PRONOUNS.secondSingular, 
        ...PRONOUNS.thirdSingular.slice(0, 3), 
        PRONOUNS.firstPlural, 
        ...PRONOUNS.thirdPlural.slice(0, 1),
    ];
}

function checkIrregularVerb(verbInput) {
    const verb = verbInput.toLowerCase().trim();
    
    if (!verb) {
        return { message: "Masukkan kata kerja dasar (V1)." };
    }
    
    const forms = getVerbForms(verb); 

    if (forms.v1) {
        const isIrregular = IRREGULAR_VERBS.hasOwnProperty(verb);
        let message;

        if (isIrregular) {
            // Skenario 1: Kata kerja Irregular yang terdaftar di data.js (V2/V3 akurat)
            message = `Kata kerja <strong>${verbInput}</strong> terdaftar sebagai **IRREGULAR (Tidak Beraturan)**.`;
        } else {
            // Skenario 2: Kata kerja tidak terdaftar, maka dianggap Regular.
            // Ini mencakup: 1. Regular Verb yang benar. 2. Irregular Verb yang sangat langka.
            message = `Kata kerja <strong>${verbInput}</strong> tidak terdaftar dalam daftar khusus irregular. Hasil di bawah dihasilkan dengan aturan **REGULAR (Beraturan)**.`;
        }

        return {
            message: message,
            v1: forms.v1,
            v2: forms.v2,
            v3: forms.v3,
        };
    } else {
        return {
            message: `Kata kerja <strong>${verbInput}</strong> tidak dapat diolah atau bukan kata kerja dasar.`,
        };
    }
}

function checkVerbForms(verbInput) {
    // Fungsi ini hanya memanggil checkIrregularVerb, ini sudah benar.
    return checkIrregularVerb(verbInput); 
}

/**
 * Mendapatkan urutan Auxiliary dan V-Form yang diharapkan (Inti dari rumus tenses).
 */
function getExpectedCoreStructure(tensesId, subject, verbForms, aux) {
    const { v1: V1, v2: V2, v3: V3, v_ing: V_ING } = verbForms;
    const isTS = isThirdSingular(subject);
    let expected = [];

    if (isNominalTense(tensesId)) {
        return [aux.aux_be];
    }

    switch (tensesId) {
        case 'simple_present':
            if (isTS) expected.push(V1); 
            else expected.push(V1);
            break;
        case 'simple_past':
            expected.push(V2); 
            break;
        case 'simple_future':
            expected.push('will', V1);
            break;
        case 'present_continuous':
            expected.push(aux.aux_be, V_ING);
            break;
        case 'simple_future_goingto':
            expected.push(aux.aux_be, 'going', 'to', V1);
            break;
        case 'present_perfect':
            expected.push(aux.aux_have, V3);
            break;
        case 'past_continuous':
            expected.push(aux.aux_be, V_ING);
            break;
        case 'future_continuous':
            expected.push('will', 'be', V_ING);
            break;
        case 'past_perfect':
            expected.push(aux.aux_had, V3);
            break;
        case 'future_perfect':
            expected.push('will', 'have', V3);
            break;
        case 'present_perfect_continuous':
            expected.push(aux.aux_have, 'been', V_ING);
            break;
        case 'past_perfect_continuous':
            expected.push(aux.aux_had, 'been', V_ING);
            break;
        case 'future_perfect_continuous':
            expected.push('will', 'have', 'been', V_ING);
            break;
        case 'past_future_tense':
            expected.push('would', V1);
            break;
        case 'past_future_continuous':
            expected.push('would', 'be', V_ING);
            break;
        case 'past_future_perfect':
            expected.push('would', 'have', V3);
            break;
        case 'past_future_perfect_continuous':
            expected.push('would', 'have', 'been', V_ING);
            break;
        default:
            expected = [];
    }

    return expected.filter(word => word); 
}


/**
 * 🎯 FUNGSI PENILAIAN UTAMA: Mengevaluasi kalimat input pengguna.
 */
function evaluateUserSentence(tensesId, subject, verbInput, userInput, sentenceType) {
    const tensesInfo = getTensesInfo(tensesId);
    if (!tensesInfo) {
        return { correct: false, message: 'Tenses tidak ditemukan.', correct_sentence: '' };
    }

    const verbForms = getVerbForms(verbInput);
    const V1 = verbForms.v1;
    const { v2: V2, v3: V3, v_ing: V_ING } = verbForms;
    const isTS = isThirdSingular(subject);
    const aux = getAuxiliary(tensesId, subject);
    const doDoesAux = aux.aux_do || (isTS ? 'does' : 'do');
    const didAux = aux.aux_did || 'did';
    const isNominal = isNominalTense(tensesId);

    // 1. Buat Kalimat Acuan (Reference)
    let mapKey = V1 in VERB_OBJECT_MAP ? V1 : 'default';
    let { object, time } = VERB_OBJECT_MAP[mapKey];
    
    if (isNominal) {
        const s = subject.toLowerCase().trim();
        const complementData = NOMINAL_COMPLEMENT_MAP[s] || NOMINAL_COMPLEMENT_MAP.default;
        object = complementData.complement;
        time = complementData.time; 
    }

    let referenceSentence = generateReferenceSentence(tensesId, subject, verbForms, aux, object, time, sentenceType);
    
    // 2. Normalisasi Input Pengguna
    const userTrimmed = userInput.trim().replace(/[.,?!]$/g, '').replace(/\s{2,}/g, ' '); 
    const userWords = userTrimmed.toLowerCase().split(/\s+/).filter(w => w.length > 0);
    
    let error_message = `Kalimat Anda salah.`;
    let errorFound = false;

    // Ambil rumus tenses untuk ditampilkan sebagai hint
    const formulaKey = (sentenceType === 'positive') ? 'formula_pos' : (sentenceType === 'negative') ? 'formula_neg' : 'formula_int';
    const expectedFormula = tensesInfo[formulaKey] || tensesInfo.formula_pos;
    error_message += ` Rumus untuk **${tensesInfo.name} (${sentenceType.toUpperCase()})** adalah: <code>${expectedFormula}</code>.`;


    // 3. Penentuan Struktur Inti yang Diharapkan (Untuk Cek Urutan Wajib)
    let expectedWords = []; 
    let coreStructure = getExpectedCoreStructure(tensesId, subject, verbForms, aux);
    
    // Logika penentuan expectedWords
    if (sentenceType === 'positive') {
        if (isNominal) {
            expectedWords.push(aux.aux_be);
        } else if (tensesId === 'simple_present') {
            expectedWords.push(isTS ? getV1sForm(V1) : V1);
        } else if (tensesId === 'simple_past') {
            expectedWords.push(V2);
        } else {
            expectedWords = coreStructure;
        }
    } else if (sentenceType === 'negative') {
        let firstAux = isNominal ? aux.aux_be : coreStructure[0];
        
        if (!isNominal && (tensesId === 'simple_present' || tensesId === 'simple_past')) {
            firstAux = (tensesId === 'simple_present') ? doDoesAux : didAux;
            expectedWords.push(firstAux, 'not', V1);
        } else {
            expectedWords.push(firstAux, 'not', ...coreStructure.slice(1));
        }
    } else if (sentenceType === 'interrogative') {
        let firstAux = isNominal ? aux.aux_be : coreStructure[0];
        
        if (!isNominal && (tensesId === 'simple_present' || tensesId === 'simple_past')) {
            firstAux = (tensesId === 'simple_present') ? doDoesAux : didAux;
            expectedWords.push(firstAux, subject.toLowerCase(), V1);
        } else {
            expectedWords.push(firstAux, subject.toLowerCase(), ...coreStructure.slice(1));
        }
    }


    // --- 4. PENGECEKAN KATA PER KATA (SINTAKSIS) ---

    // 4.1. Cek Subjek/Aux Awal (Posisi 0)
    const expectedStartWord = (sentenceType === 'interrogative') ? 
        (isNominal ? aux.aux_be : expectedWords[0]) : subject.toLowerCase();

    if (userWords[0] !== expectedStartWord) {
        error_message += `<br>❌ Kesalahan Struktur Awal: Kalimat harus dimulai dengan **${expectedStartWord.toUpperCase()}** (Subjek atau Auxiliary pembuka).`;
        errorFound = true;
    }

    // 4.2. Pengecekan Inti Kalimat (Auxiliary/Verb Form)
    if (!errorFound) {
        
        if (sentenceType === 'positive') {
            // Cek Kata Kunci Wajib (Aux/V-Form) setelah Subjek (posisi 1)
            const requiredWord = expectedWords[0];
            if (userWords[1] !== requiredWord) {
                // Khusus Simple Present (cek V1 atau V1s)
                if (tensesId === 'simple_present' && userWords[1] !== V1 && userWords[1] !== getV1sForm(V1)) {
                    error_message += `<br>❌ Kesalahan Kata Kerja/Auxiliary: Harusnya **${isTS ? getV1sForm(V1).toUpperCase() : V1.toUpperCase()}**.`;
                    errorFound = true;
                // Khusus Simple Past (cek V2)
                } else if (tensesId === 'simple_past' && userWords[1] !== V2) {
                    error_message += `<br>❌ Kesalahan Kata Kerja/Auxiliary: Harusnya **${V2.toUpperCase()}**.`;
                    errorFound = true;
                // Kasus umum (Aux, V-ing, V3, atau To Be)
                } else if (!['simple_present', 'simple_past'].includes(tensesId) && userWords[1] !== requiredWord) {
                    error_message += `<br>❌ Kesalahan Kata Kerja/Auxiliary: Harusnya **${requiredWord.toUpperCase()}**.`;
                    errorFound = true;
                }
            }
            
        } else if (sentenceType === 'negative') {
            const expectedAux1 = isNominal ? aux.aux_be : (tensesId === 'simple_present' ? doDoesAux : (tensesId === 'simple_past' ? didAux : aux.aux_be || aux.aux_have || aux.aux_had || 'will' || 'would'));
            
            // 4.2.1. Cek Aux + NOT (fleksibel: full form atau contraction)
            const requiredNotForms = ALLOWED_NOT_FORMS[expectedAux1] || [`${expectedAux1} not`]; 
            
            let isFullForm = false;
            let isContractedForm = false;
            
            // Cek Bentuk Penuh (Subjek + Aux + NOT)
            if (userWords.length > 2 && userWords[1] === expectedAux1 && userWords[2] === 'not') {
                isFullForm = true;
            }

            // Cek Bentuk Kontraksi (Subjek + Contraction)
            if (!isFullForm) {
                const userContraction = userWords[1]; 
                
                // Cek apakah input pengguna (misal: "dont") sesuai dengan bentuk yang diizinkan (misal: "don't" atau "do not")
                if (requiredNotForms.includes(userContraction) || 
                    requiredNotForms.includes(userContraction.replace(/'/g, ''))) {
                    isContractedForm = true;
                }
            }
            
            if (!isFullForm && !isContractedForm) {
                const formsHint = requiredNotForms.map(f => `**${f.toUpperCase()}**`).join(' ATAU ');
                error_message += `<br>❌ Kesalahan Negasi: Setelah subjek harus diikuti oleh Auxiliary + NOT. Harusnya ${formsHint}.`;
                errorFound = true;
            }

            // 4.2.2. Cek V-Form/Kata Kunci Utama (Hanya jika bukan Nominal)
            if (!errorFound && !isNominal) {
                const startIndexOfVForm = isContractedForm ? 2 : 3; 
                const remainingWords = userWords.slice(startIndexOfVForm);
                
                // V-form utama untuk tenses verbal negatif selalu V1, V3, atau V-ing
                let finalVForm = (tensesId === 'simple_present' || tensesId === 'simple_past' || tensesId.includes('future')) ? V1 : 
                                    (tensesId.includes('perfect') && !tensesId.includes('continuous')) ? V3 : V_ING; 
                
                // Khusus Perfect Continuous, kita harus cek 'been' dan V-ing
                if (tensesId.includes('perfect_continuous')) {
                    if (!remainingWords.includes('been') || !remainingWords.includes(V_ING)) {
                        error_message += `<br>❌ Kesalahan Struktur: Harusnya ada **BEEN** dan bentuk **${V_ING.toUpperCase()}** (V-ing).`;
                        errorFound = true;
                    }
                } else if (!remainingWords.includes(finalVForm)) {
                    let vHint = (finalVForm === V1) ? 'V1' : (finalVForm === V3) ? 'V3' : 'V-ing';
                    error_message += `<br>❌ Kesalahan Bentuk Kata Kerja: Gunakan bentuk **${finalVForm.toUpperCase()}** (${vHint}).`;
                    errorFound = true;
                }
            }

        } else if (sentenceType === 'interrogative') {
            // Cek Subjek (Posisi 1)
            if (userWords[1] !== subject.toLowerCase()) {
                error_message += `<br>❌ Kesalahan Subjek: Setelah Auxiliary (**${expectedStartWord.toUpperCase()}**), harus diikuti subjek (**${subject}**).`;
                errorFound = true;
            }

            // Cek V-Form/Kata Kunci Utama (Posisi 2 ke atas, hanya jika bukan Nominal)
            if (!errorFound && !isNominal) {
                const remainingWords = userWords.slice(2); 
                
                let finalVForm = V1;
                if (tensesId.includes('continuous') && !tensesId.includes('perfect')) finalVForm = V_ING;
                if (tensesId.includes('perfect') && !tensesId.includes('continuous')) finalVForm = V3;
                if (tensesId.includes('perfect_continuous')) finalVForm = V_ING; 
                
                // Khusus Perfect Continuous, cek 'have/had' + 'been' + V-ing
                if (tensesId.includes('perfect_continuous')) {
                    if (!remainingWords.includes('been') || !remainingWords.includes(V_ING)) {
                        error_message += `<br>❌ Kesalahan Struktur: Harusnya ada **BEEN** dan bentuk **${V_ING.toUpperCase()}** (V-ing) setelah subjek.`;
                        errorFound = true;
                    }
                } else if (!remainingWords.includes(finalVForm)) {
                    let vHint = (finalVForm === V1) ? 'V1' : (finalVForm === V3) ? 'V3' : 'V-ing';
                    error_message += `<br>❌ Kesalahan Bentuk Kata Kerja: Gunakan bentuk **${finalVForm.toUpperCase()}** (${vHint}).`;
                    errorFound = true;
                }
            }
        }
    }


    // 5. Kesimpulan Penilaian
    if (!errorFound) {
        let finalFeedback = {
            correct: true,
            message: `🎉 Luar biasa! Sintaksis ${sentenceType.toUpperCase()} Anda **benar**!`,
            correct_sentence: referenceSentence,
            formula: expectedFormula
        };
        // Cek Tanda Baca Akhir (Saran)
        const expectedPunctuation = (sentenceType === 'interrogative') ? '?' : '.';
        if (!userInput.trim().endsWith(expectedPunctuation)) {
            finalFeedback.message += `<br>⚠️ Saran: Kalimat seharusnya diakhiri dengan tanda **${expectedPunctuation}** (Kesalahan Minor).`;
        }
        
        return finalFeedback;
    } else {
        return {
            correct: false,
            message: error_message, 
            correct_sentence: referenceSentence,
            formula: expectedFormula
        };
    }
}

/**
 * Fungsi untuk generate contoh kalimat untuk Tenses Transformer.
 */
function generateTensesExamples(tensesId, subject, verbInput) {
    const tensesInfo = getTensesInfo(tensesId);
    if (!tensesInfo) return {};

    const verbForms = getVerbForms(verbInput);
    const aux = getAuxiliary(tensesId, subject);
    const V1 = verbForms.v1;
    let mapKey = V1 in VERB_OBJECT_MAP ? V1 : 'default';
    let { object, time } = VERB_OBJECT_MAP[mapKey];

    if (isNominalTense(tensesId)) {
        const s = subject.toLowerCase().trim();
        const complementData = NOMINAL_COMPLEMENT_MAP[s] || NOMINAL_COMPLEMENT_MAP.default;
        object = complementData.complement;
        time = complementData.time; 
    }

    const positive = generateReferenceSentence(tensesId, subject, verbForms, aux, object, time, 'positive');
    const negative = generateReferenceSentence(tensesId, subject, verbForms, aux, object, time, 'negative');
    const interrogative = generateReferenceSentence(tensesId, subject, verbForms, aux, object, time, 'interrogative');

    return {
        positive,
        negative,
        interrogative,
        formula: tensesInfo
    };
}


// ====================================================================
// --- C. EXPORT MODUL FINAL ---
// ====================================================================

export { 
    getTensesInfo, 
    getAllTenses, 
    getAllPronouns, 
    checkVerbForms,
    evaluateUserSentence,
    generateTensesExamples,
};