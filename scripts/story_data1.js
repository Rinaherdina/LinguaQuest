/**
 * LINGUAQUEST - STORY BANK MASTER
 * Format: 1 Teks Panjang + 5 Soal + Penjelasan
 * Tenses: Present, Past, Future
 */

window.STORY_BANK = [
    // ==========================================
    // 1. SIMPLE PRESENT (TEKS 1 - DAILY ROUTINE)
    // ==========================================
    {
        id: "st_pr_01",
        level: 1,
        tense: "present",
        title: "The Diligent Student",
        content: "Every morning, Budi wakes up early at 5 AM. He is a diligent <abbr title='Murid'>student</abbr> who loves his <abbr title='Sekolah'>school</abbr>. First, he drinks a glass of <abbr title='Air'>water</abbr> and cleans his <abbr title='Kamar tidur'>bedroom</abbr>. Then, he takes a bath and wears his <abbr title='Seragam'>uniform</abbr>. His <abbr title='Ibu'>mother</abbr> always cooks a healthy <abbr title='Sarapan'>breakfast</abbr> like <abbr title='Nasi'>rice</abbr> and <abbr title='Telur'>eggs</abbr> in the <abbr title='Dapur'>kitchen</abbr>. Budi eats his breakfast slowly because he does not want to be late. After that, he takes his <abbr title='Tas'>bag</abbr> and goes to school by <abbr title='Sepeda'>bike</abbr>. He arrives at school at 6:45 AM and greets his <abbr title='Guru'>teacher</abbr> with a big <abbr title='Senyum'>smile</abbr>.",
        questions: [
            {
                q: "What is the first thing Budi does after waking up?",
                opt: ["Takes a bath", "Drinks water", "Eats breakfast", "Cleans bedroom"],
                ans: 1,
                hint: "Check the word 'First' in the text."
            },
            {
                q: "Where does his mother cook breakfast?",
                opt: ["In the garden", "In the bedroom", "In the kitchen", "In the shop"],
                ans: 2,
                hint: "Look for the place where people cook."
            },
            {
                q: "How does Budi go to school?",
                opt: ["By bus", "By car", "By bike", "On foot"],
                ans: 2,
                hint: "Find the transport mentioned in the end."
            },
            {
                q: "What does he wear after taking a bath?",
                opt: ["Shoes", "Hat", "Uniform", "Watch"],
                ans: 2,
                hint: "Something students wear for school."
            },
            {
                q: "What time does he arrive at school?",
                opt: ["5:00 AM", "6:00 AM", "6:45 AM", "7:00 AM"],
                ans: 2,
                hint: "Check the numbers in the last paragraph."
            }
        ]
    }, 

    // ==========================================
    // 2. SIMPLE PAST (TEKS 2 - LAST VACATION)
    // ==========================================
    {
        id: "st_pa_01",
        level: 1,
        tense: "past",
        title: "A Trip to the Beach",
        content: "Last month, my <abbr title='Keluarga'>family</abbr> and I traveled to a beautiful <abbr title='Pantai'>beach</abbr>. The weather was very <abbr title='Panas'>hot</abbr> and the <abbr title='Langit'>sky</abbr> was <abbr title='Cerah'>bright</abbr> blue. My <abbr title='Ayah'>father</abbr> drove the <abbr title='Mobil'>car</abbr> for three hours from the <abbr title='Kota'>city</abbr>. When we arrived, my <abbr title='Saudara laki-laki'>brother</abbr> and I ran to the <abbr title='Air'>water</abbr> and swam for a long time. My <abbr title='Ibu'>mother</abbr> sat under a big <abbr title='Pohon'>tree</abbr> and read a <abbr title='Buku'>book</abbr>. We felt very <abbr title='Senang'>happy</abbr> because the place was <abbr title='Tenang'>quiet</abbr> and <abbr title='Bersih'>clean</abbr>. In the evening, we bought some fresh <abbr title='Ikan'>fish</abbr> and cooked it for <abbr title='Makan malam'>dinner</abbr>.",
        questions: [
            {
                q: "When did the family go to the beach?",
                opt: ["Yesterday", "Last week", "Last month", "Last year"],
                ans: 2,
                hint: "Check the very first sentence."
            },
            {
                q: "Who drove the car to the beach?",
                opt: ["The writer", "The father", "The mother", "The brother"],
                ans: 1,
                hint: "Look for the person driving."
            },
            {
                q: "What did the mother do at the beach?",
                opt: ["Swam", "Cooked fish", "Read a book", "Drove a car"],
                ans: 2,
                hint: "Find the activity under the tree."
            },
            {
                q: "Why did they feel happy?",
                opt: ["Place was noisy", "Place was dirty", "Place was quiet and clean", "They were tired"],
                ans: 2,
                hint: "Look for the adjectives 'quiet' and 'clean'."
            },
            {
                q: "What did they eat for dinner?",
                opt: ["Rice", "Egg", "Fish", "Bread"],
                ans: 2,
                hint: "They bought this from the market."
            }
        ]
    },

    // ==========================================
    // 3. SIMPLE FUTURE (TEKS 3 - FUTURE GOALS)
    // ==========================================
    {
        id: "st_fu_01",
        level: 1,
        tense: "future",
        title: "Sarah's Dream",
        content: "Next year, Sarah will finish her <abbr title='Belajar'>study</abbr> at the university. She wants to be a professional <abbr title='Dokter'>doctor</abbr> in a big <abbr title='Rumah sakit'>hospital</abbr>. She will work <abbr title='Keras'>hard</abbr> to help <abbr title='Sakit'>sick</abbr> people and <abbr title='Menyelamatkan'>save</abbr> lives. Sarah also plans to <abbr title='Bepergian'>travel</abbr> to many countries to <abbr title='Belajar'>learn</abbr> new things. She will buy a <abbr title='Kecil'>small</abbr> <abbr title='Rumah'>house</abbr> for her <abbr title='Orang tua'>parents</abbr> in a peaceful <abbr title='Kota kecil'>town</abbr>. She hopes her <abbr title='Keluarga'>family</abbr> will always be <abbr title='Sehat'>healthy</abbr> and proud of her. It will be a <abbr title='Sibuk'>busy</abbr> but <abbr title='Menyenangkan'>exciting</abbr> year for her.",
        questions: [
            {
                q: "What does Sarah want to be in the future?",
                opt: ["A teacher", "A nurse", "A doctor", "A pilot"],
                ans: 2,
                hint: "Look for her profession."
            },
            {
                q: "Where will she work?",
                opt: ["In an office", "In a school", "In a hospital", "In a bank"],
                ans: 2,
                hint: "Doctors work in this place."
            },
            {
                q: "What will she buy for her parents?",
                opt: ["A car", "A house", "A computer", "A phone"],
                ans: 1,
                hint: "Check the sentence about her parents."
            },
            {
                q: "Where will the house be located?",
                opt: ["In a big city", "In a busy market", "In a peaceful town", "Near the beach"],
                ans: 2,
                hint: "Look for the word 'town'."
            },
            {
                q: "How does she describe her next year?",
                opt: ["Boring", "Sad", "Busy and exciting", "Easy and slow"],
                ans: 2,
                hint: "Look at the very last sentence."
            }
        ]
    },

// --- TEKS 04: THE BUSY MARKET ---
    {
        id: "st_pr_04",
        level: 1,
        tense: "present",
        title: "The Busy Market",
        content: "Every <abbr title='Pagi'>morning</abbr>, Mr. Anton goes to the <abbr title='Pasar'>market</abbr> near his <abbr title='Rumah'>home</abbr>. He is a <abbr title='Koki'>chef</abbr> in a big <abbr title='Kantor'>office</abbr>. In the market, he sees many people. Some <abbr title='Perempuan'>women</abbr> buy <abbr title='Buah'>fruit</abbr>, <abbr title='Daging'>meat</abbr>, and <abbr title='Ikan'>fish</abbr>. Mr. Anton looks for fresh <abbr title='Sayuran'>vegetables</abbr>, <abbr title='Garam'>salt</abbr>, and <abbr title='Gula'>sugar</abbr>. He <abbr title='Membawa'>carries</abbr> a big <abbr title='Tas'>bag</abbr> to put all the things. He likes this market because the food is <abbr title='Murah'>cheap</abbr> and the people are <abbr title='Ramah'>friendly</abbr>. He always <abbr title='Tersenyum'>smiles</abbr> when he talks to the <abbr title='Penjual'>sellers</abbr>.",
        questions: [
            { q: "Where does Mr. Anton go every morning?", opt: ["To the school", "To the market", "To the hospital", "To the bank"], ans: 1 },
            { q: "What is Mr. Anton's job?", opt: ["A teacher", "A doctor", "A chef", "A driver"], ans: 2 },
            { q: "What does he look for in the market?", opt: ["Pen and paper", "Clothes and shoes", "Vegetables and salt", "Books and chairs"], ans: 2 },
            { q: "Why does he like the market?", opt: ["Because it is far", "Because it is expensive", "Because food is cheap", "Because it is noisy"], ans: 2 },
            { q: "What does he do when he talks to sellers?", opt: ["He cries", "He sleeps", "He smiles", "He runs"], ans: 2 }
        ]
    },

    // --- TEKS 05: AT THE ANIMAL PARK ---
    {
        id: "st_pr_05",
        level: 1,
        tense: "present",
        title: "At the Animal Park",
        content: "My <abbr title='Saudara perempuan'>sister</abbr> works at the <abbr title='Taman'>park</abbr>. She is a <abbr title='Penjaga hewan'>zoo keeper</abbr>. Every day, she <abbr title='Membantu'>helps</abbr> many <abbr title='Hewan'>animals</abbr>. She gives <abbr title='Susu'>milk</abbr> to the <abbr title='Kucing'>cats</abbr> and <abbr title='Air'>water</abbr> to the <abbr title='Burung'>birds</abbr>. The park is very <abbr title='Besar'>big</abbr> and <abbr title='Hijau'>green</abbr>. Many <abbr title='Keluarga'>families</abbr> visit the park on the weekend. The <abbr title='Anak laki-laki'>boys</abbr> and <abbr title='Anak perempuan'>girls</abbr> are <abbr title='Senang'>happy</abbr> when they see the tall <abbr title='Pohon'>trees</abbr> and beautiful <abbr title='Bunga'>flowers</abbr>. My sister <abbr title='Mencintai'>loves</abbr> her job because she <abbr title='Merasa'>feels</abbr> <abbr title='Tenang'>calm</abbr> there.",
        questions: [
            { q: "Where does the sister work?", opt: ["In a shop", "In a park", "In a kitchen", "In a room"], ans: 1 },
            { q: "What does she give to the birds?", opt: ["Bread", "Milk", "Water", "Fish"], ans: 2 },
            { q: "How is the park described?", opt: ["Small and dirty", "Big and green", "Old and dark", "Empty and quiet"], ans: 1 },
            { q: "When do families visit the park?", opt: ["Every night", "Every Monday", "On the weekend", "Every evening"], ans: 2 },
            { q: "Why does the sister love her job?", opt: ["She feels angry", "She feels bored", "She feels calm", "She feels scared"], ans: 2 }
        ]
    },

    // --- TEKS 06: THE SMART DOCTOR ---
    {
        id: "st_pr_06",
        level: 1,
        tense: "present",
        title: "The Smart Doctor",
        content: "Mr. Hasan is a <abbr title='Dokter'>doctor</abbr> in a small <abbr title='Kota'>town</abbr>. He is very <abbr title='Pintar'>smart</abbr> and <abbr title='Baik hati'>kind</abbr>. He <abbr title='Bangun'>wakes up</abbr> at 6 AM and <abbr title='Minum'>drinks</abbr> <abbr title='Kopi'>coffee</abbr>. Then, he <abbr title='Menyetir'>drives</abbr> his <abbr title='Mobil'>car</abbr> to the <abbr title='Rumah sakit'>hospital</abbr>. He <abbr title='Melihat/memeriksa'>sees</abbr> many <abbr title='Sakit'>sick</abbr> people every day. He <abbr title='Mendengarkan'>listens</abbr> to their problems and <abbr title='Memberi'>gives</abbr> them <abbr title='Obat'>medicine</abbr>. He tells them to <abbr title='Makan'>eat</abbr> <abbr title='Buah'>fruit</abbr> and <abbr title='Tidur'>sleep</abbr> enough. Mr. Hasan is never <abbr title='Lelah'>tired</abbr> because he <abbr title='Ingin'>wants</abbr> to help everyone.",
        questions: [
            { q: "What time does Mr. Hasan wake up?", opt: ["5 AM", "6 AM", "7 AM", "8 AM"], ans: 1 },
            { q: "What does he drink in the morning?", opt: ["Milk", "Tea", "Coffee", "Water"], ans: 2 },
            { q: "How does he go to the hospital?", opt: ["By bike", "By bus", "By car", "By walking"], ans: 2 },
            { q: "What does he give to sick people?", opt: ["Money", "Food", "Medicine", "Clothes"], ans: 2 },
            { q: "Why is he never tired?", opt: ["He wants to sleep", "He wants to help everyone", "He wants to go home", "He wants to eat"], ans: 1 }
        ]
    },

    // --- TEKS 07: LIFE IN THE GARDEN ---
    {
        id: "st_pr_07",
        level: 1,
        tense: "present",
        title: "Life in the Garden",
        content: "My <abbr title='Kakek'>grandfather</abbr> is a <abbr title='Petani'>farmer</abbr>. He has a beautiful <abbr title='Kebun'>garden</abbr> behind his <abbr title='Rumah'>house</abbr>. He <abbr title='Menanam'>plants</abbr> many things like <abbr title='Apel'>apples</abbr>, <abbr title='Bunga'>flowers</abbr>, and <abbr title='Rumput'>grass</abbr>. Every afternoon, he <abbr title='Menyiram'>washes</abbr> the plants with <abbr title='Air'>water</abbr>. I often <abbr title='Datang'>come</abbr> to his house to <abbr title='Membantu'>help</abbr> him. We <abbr title='Duduk'>sit</abbr> on a <abbr title='Kursi'>chair</abbr> and <abbr title='Mengobrol'>talk</abbr> about many things. The <abbr title='Matahari'>sun</abbr> is <abbr title='Terang'>bright</abbr> and the <abbr title='Udara'>air</abbr> is <abbr title='Bersih'>clean</abbr>. I <abbr title='Berharap'>hope</abbr> the plants grow <abbr title='Cepat'>fast</abbr>.",
        questions: [
            { q: "What is the grandfather's job?", opt: ["A doctor", "A farmer", "A teacher", "A chef"], ans: 1 },
            { q: "Where is the garden located?", opt: ["In front of the house", "Near the market", "Behind the house", "In the city"], ans: 2 },
            { q: "What does the grandfather do every afternoon?", opt: ["He sleeps", "He washes the plants", "He buys fruit", "He goes to the bank"], ans: 1 },
            { q: "Where do they sit?", opt: ["On the floor", "On the grass", "On a chair", "On a table"], ans: 2 },
            { q: "How is the air in the garden?", opt: ["Dirty", "Hot", "Clean", "Cold"], ans: 2 }
        ]
    },

    // --- TEKS 08: THE NEW CLASSROOM ---
    {
        id: "st_pr_08",
        level: 1,
        tense: "present",
        title: "The New Classroom",
        content: "Today is my first <abbr title='Hari'>day</abbr> in the new <abbr title='Kelas'>class</abbr>. The <abbr title='Ruangan'>room</abbr> is <abbr title='Besar'>big</abbr> and <abbr title='Bersih'>clean</abbr>. There is a <abbr title='Meja tulis'>desk</abbr> and a <abbr title='Kursi'>chair</abbr> for every <abbr title='Murid'>student</abbr>. I see a <abbr title='Jam dinding'>clock</abbr> and a <abbr title='Gambar'>picture</abbr> on the <abbr title='Dinding'>wall</abbr>. My <abbr title='Guru'>teacher</abbr> is Mrs. Susi. She <abbr title='Berbicara'>speaks</abbr> <abbr title='Pelan'>slowly</abbr> so we can <abbr title='Mengerti'>understand</abbr>. We <abbr title='Menggunakan'>use</abbr> <abbr title='Pena'>pens</abbr> and <abbr title='Buku'>books</abbr> to <abbr title='Menulis'>write</abbr> the lesson. I <abbr title='Merasa'>feel</abbr> <abbr title='Senang'>happy</abbr> because I have many <abbr title='Teman'>friends</abbr> here.",
        questions: [
            { q: "How is the new classroom?", opt: ["Small and dirty", "Big and clean", "Dark and old", "Quiet and empty"], ans: 1 },
            { q: "What is on the wall?", opt: ["A door", "A window", "A clock and a picture", "A bag"], ans: 2 },
            { q: "Who is the teacher?", opt: ["Mr. Anton", "Mrs. Susi", "Mr. Hasan", "Sarah"], ans: 1 },
            { q: "What do students use to write?", opt: ["Pencils and paper", "Pens and books", "Computers", "Phones"], ans: 1 },
            { q: "Why does the writer feel happy?", opt: ["Because he is tired", "Because he has many friends", "Because the class is difficult", "Because it is night"], ans: 1 }
        ]
    },

    // --- TEKS 09: THE MORNING BREAKFAST ---
    {
        id: "st_pr_09",
        level: 1,
        tense: "present",
        title: "The Morning Breakfast",
        content: "My <abbr title='Keluarga'>family</abbr> always has <abbr title='Sarapan'>breakfast</abbr> together at 7 AM. We <abbr title='Duduk'>sit</abbr> at the big <abbr title='Meja'>table</abbr> in the <abbr title='Dapur'>kitchen</abbr>. My <abbr title='Ayah'>father</abbr> drinks <abbr title='Teh'>tea</abbr> and my <abbr title='Ibu'>mother</abbr> drinks <abbr title='Susu'>milk</abbr>. I <abbr title='Makan'>eat</abbr> <abbr title='Roti'>bread</abbr> with <abbr title='Gula'>sugar</abbr>. My <abbr title='Saudara laki-laki'>brother</abbr> likes <abbr title='Nasi'>rice</abbr> and <abbr title='Telur'>eggs</abbr>. We <abbr title='Mengobrol'>talk</abbr> about our <abbr title='Pekerjaan'>job</abbr> and <abbr title='Sekolah'>school</abbr>. Before we <abbr title='Pergi'>go</abbr>, my mother <abbr title='Menutup'>closes</abbr> the <abbr title='Jendela'>windows</abbr> and <abbr title='Mengunci'>locks</abbr> the <abbr title='Pintu'>door</abbr>. It is a <abbr title='Bagus'>good</abbr> start for the day.",
        questions: [
            { q: "What time does the family have breakfast?", opt: ["6 AM", "7 AM", "8 AM", "9 AM"], ans: 1 },
            { q: "What does the father drink?", opt: ["Milk", "Coffee", "Tea", "Water"], ans: 2 },
            { q: "What does the writer eat?", opt: ["Rice and eggs", "Fish and meat", "Bread with sugar", "Fruit"], ans: 2 },
            { q: "Where do they sit?", opt: ["In the bedroom", "In the garden", "At the big table", "On the floor"], ans: 2 },
            { q: "What does the mother do before they go?", opt: ["She opens the door", "She closes the windows", "She cooks dinner", "She watches a movie"], ans: 1 }
        ]
    },

    // --- TEKS 10: THE CLEAN HOUSE ---
    {
        id: "st_pr_10",
        level: 1,
        tense: "present",
        title: "The Clean House",
        content: "Every Saturday, we <abbr title='Membersihkan'>clean</abbr> our <abbr title='Rumah'>house</abbr> together. My <abbr title='Ayah'>father</abbr> <abbr title='Mencuci'>washes</abbr> the <abbr title='Mobil'>car</abbr> and the <abbr title='Sepeda'>bike</abbr> in the <abbr title='Jalan'>road</abbr>. My <abbr title='Ibu'>mother</abbr> <abbr title='Membersihkan'>cleans</abbr> the <abbr title='Lantai'>floor</abbr> and the <abbr title='Dinding'>walls</abbr>. I <abbr title='Membantu'>help</abbr> my <abbr title='Saudara perempuan'>sister</abbr> to <abbr title='Menyikat'>brush</abbr> the <abbr title='Kamar mandi'>bathroom</abbr>. We <abbr title='Membuang'>throw</abbr> the <abbr title='Sampah'>trash</abbr> into the <abbr title='Kotak'>box</abbr>. After we <abbr title='Selesai'>finish</abbr>, the house <abbr title='Terlihat'>looks</abbr> <abbr title='Baru'>new</abbr> and <abbr title='Bersih'>clean</abbr>. We <abbr title='Merasa'>feel</abbr> <abbr title='Lelah'>tired</abbr> but <abbr title='Senang'>happy</abbr>.",
        questions: [
            { q: "When do they clean the house?", opt: ["Every Monday", "Every Friday", "Every Saturday", "Every Sunday"], ans: 2 },
            { q: "What does the father wash?", opt: ["The floor", "The car and the bike", "The windows", "The dishes"], ans: 1 },
            { q: "Who cleans the floor?", opt: ["The writer", "The father", "The mother", "The sister"], ans: 2 },
            { q: "What does the writer do?", opt: ["Washes the car", "Cleans the walls", "Helps the sister brush the bathroom", "Cooks lunch"], ans: 2 },
            { q: "How do they feel after finishing?", opt: ["Sad and hungry", "Tired but happy", "Angry and cold", "Sleepy and bored"], ans: 1 }
        ]
    }
]