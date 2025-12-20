// Wadah besar untuk semua soal ujian kenaikan level
window.EXAM_MASTER = {
    "LV1": [
        { 
            type: "vocab", 
            question: "Apa arti dari kata 'EAT'?", 
            options: ["Minum", "Makan", "Lari", "Tidur"], 
            answer: "Makan" 
        },
        { 
            type: "listening", 
            audioText: "I drink water", 
            question: "Tuliskan apa yang kamu dengar:", 
            answer: "I drink water" 
        },
        { 
            type: "grammar", 
            question: "Susun kalimat: (I) - (Apple) - (Eat)", 
            options: ["I apple eat", "I eat apple", "Apple eat I"], 
            answer: "I eat apple" 
        }
    ],
    "LV2": [
        // Isi soal gabungan untuk level 2 di sini nanti
    ]
};

/**
 * FUNGSI UTAMA UJIAN FINAL
 */
function startGlobalLevelExam() {
    const currentLv = userState.currentLevel || 1;
    const examData = window.EXAM_MASTER["LV" + currentLv];

    if (!examData || examData.length === 0) {
        alert("Soal ujian untuk level " + currentLv + " belum tersedia.");
        return;
    }

    console.log("Ujian Final Level " + currentLv + " dimulai...");
    // Di sini nanti kita akan buat logika kuis yang bisa 
    // mendeteksi "type" (vocab/listening/grammar)
    
    // Untuk sementara, kita beri pesan dulu
    alert("Kamu masuk ke ruang ujian Level " + currentLv + ". Siapkan mental!");
}