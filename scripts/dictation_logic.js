// dictation_logic.js

const DictationManager = {
    currentPool: [],
    
    // Fungsi untuk memuat file JS secara dinamis
    loadLevelFile: function(level) {
        return new Promise((resolve, reject) => {
            // Jika data sudah ada di memori, tidak perlu load file lagi
            if (window[`DICTATION_L${level}_SENTENCES`]) {
                return resolve();
            }

            const script = document.createElement('script');
            script.src = `scripts/dictation_L${level}_sentences.js`;
            script.onload = () => {
                console.log(`File Level ${level} berhasil dimuat secara dinamis.`);
                resolve();
            };
            script.onerror = () => reject(`Gagal memuat file Level ${level}`);
            document.head.appendChild(script);
        });
    },

    prepareData: async function(level) {
        try {
            // 1. Tampilkan loading sebentar jika perlu
            // 2. Load filenya hanya saat level tersebut diklik
            await this.loadLevelFile(level);

            const sourceName = `DICTATION_L${level}_SENTENCES`;
            const rawData = window[sourceName];

            // 3. Proses data (seperti logika sebelumnya)
            this.currentPool = rawData.map(row => ({
                id: row[0],
                target: row[4],
                hint: row[5]
            })).filter(item => item.target);

            // 4. Acak 1000 kalimat tersebut
            this.shuffle();
            
            return true;
        } catch (error) {
            console.error(error);
            return false;
        }
    },

    shuffle: function() {
        for (let i = this.currentPool.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [this.currentPool[i], this.currentPool[j]] = [this.currentPool[j], this.currentPool[i]];
        }
    }
};