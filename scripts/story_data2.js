window.STORY_BANK = window.STORY_BANK || [];

const lv2Stories = [
    // ==========================================
    // 1. PRESENT CONTINUOUS (Sedang Berlangsung Sekarang)
    // ==========================================
    {
        id: "lv2_pres_cont_01",
        level: 2,
        tense: "present continuous",
        title: "Busy at the Airport",
        content: "Right now, many people are traveling to different cities. At the airport, a famous journalist is interviewing a pilot near the entrance. The passengers are carrying their heavy suitcases to the check-in counter. An engineer is repairing a small problem with the signal system, while the security officers are checking everyone's passports. Everyone is waiting because the weather is changing quickly.",
        questions: [
            { q: "What is the journalist doing at the moment?", opt: ["Checking passports", "Interviewing a pilot", "Repairing a signal", "Carrying suitcases"], ans: 1, hint: "Look for the action of the 'journalist' in the second sentence." },
            { q: "Who is fixing the signal system?", opt: ["A pilot", "A journalist", "An engineer", "A passenger"], ans: 2, hint: "Check the profession mentioned with the word 'repairing'." },
            { q: "What are the passengers carrying?", opt: ["Passports", "Heavy suitcases", "Cameras", "Tickets"], ans: 1, hint: "Look for what the passengers have in their hands." },
            { q: "Where is the interview happening?", opt: ["In the airplane", "At the hotel", "Near the entrance", "At the station"], ans: 2, hint: "The text mentions 'near the...'" },
            { q: "Why is everyone waiting?", opt: ["The pilot is late", "The weather is changing", "The airport is closed", "The signal is dead"], ans: 1, hint: "The last sentence explains the reason." }
        ]
    },
    {
        id: "lv2_pres_cont_02",
        level: 2,
        tense: "present continuous",
        title: "The Creative Studio",
        content: "In the modern office, the team is working on a special project. The manager is organizing a meeting while the artist is designing a new logo. The photographer is taking pictures of a professional actor in the corner. Some employees are discussing a difficult problem, and they are searching for a creative solution together. They are enjoying their work because the atmosphere is very calm.",
        questions: [
            { q: "What is the artist doing right now?", opt: ["Organizing a meeting", "Designing a logo", "Taking pictures", "Repairing equipment"], ans: 1, hint: "Look for the word 'artist' and 'designing'." },
            { q: "Who is the photographer taking pictures of?", opt: ["The manager", "A journalist", "A professional actor", "An engineer"], ans: 2, hint: "Check the object of the photographer's action." },
            { q: "What are the employees searching for?", opt: ["A creative solution", "A new office", "A dictionary", "A lost suitcase"], ans: 0, hint: "They are looking for a way to solve the 'problem'." },
            { q: "What is the manager's current task?", opt: ["Discussing problems", "Designing logos", "Organizing a meeting", "Greeting customers"], ans: 2, hint: "The manager is busy with a 'meeting'." },
            { q: "How is the atmosphere in the office?", opt: ["Terrible", "Messy", "Calm", "Loud"], ans: 2, hint: "The last sentence describes the environment." }
        ]
    },

    // ==========================================
    // 2. PAST CONTINUOUS (Sedang Berlangsung di Masa Lalu)
    // ==========================================
    {
        id: "lv2_past_cont_01",
        level: 2,
        tense: "past continuous",
        title: "The Mountain Adventure",
        content: "Yesterday at 10 AM, Budi and his friends were exploring a deep forest near the mountain. While they were climbing the hill, the wind was blowing strongly. Budi was checking the map because he was worrying about the path. His friends were talking about the wildlife they saw earlier. Suddenly, they noticed that a strange shadow was following them from behind the trees.",
        questions: [
            { q: "What were they doing yesterday at 10 AM?", opt: ["Arriving at the hotel", "Exploring a forest", "Repairing a bike", "Buying tickets"], ans: 1, hint: "Check the first sentence for the main activity." },
            { q: "What was happening while they were climbing?", opt: ["It was raining", "The sun was shining", "The wind was blowing", "Thunder was starting"], ans: 2, hint: "Look for the word 'wind'." },
            { q: "Why was Budi checking the map?", opt: ["He was bored", "He was worrying about the path", "He was looking for a restaurant", "He was studying history"], ans: 1, hint: "The text mentions he was worried." },
            { q: "What were his friends talking about?", opt: ["The weather", "The price of food", "The wildlife", "Their future"], ans: 2, hint: "They discussed the animals/nature around them." },
            { q: "What was following them?", opt: ["A dangerous animal", "A local guide", "A strange shadow", "A scientist"], ans: 2, hint: "Find the word 'shadow' in the last sentence." }
        ]
    },
    {
        id: "lv2_past_cont_02",
        level: 2,
        tense: "past continuous",
        title: "A Night at the Museum",
        content: "Last night, the security officer was walking through the ancient history section. While he was checking the mirrors, he heard a loud noise. At that moment, a group of scientists was preparing a new exhibit in the next room. They were moving a valuable stone statue carefully. The lights were flickering because a storm was happening outside the building.",
        questions: [
            { q: "Where was the security officer walking?", opt: ["In the library", "In the ancient history section", "In the factory", "On the beach"], ans: 1, hint: "Identify the specific area in the museum." },
            { q: "What were the scientists doing?", opt: ["Taking photos", "Cleaning the floor", "Preparing a new exhibit", "Repairing the roof"], ans: 2, hint: "Look for the activity of the 'scientists'." },
            { q: "What kind of object were they moving?", opt: ["A plastic chair", "A valuable stone statue", "A heavy suitcase", "A modern painting"], ans: 1, hint: "The text says it was 'valuable' and made of 'stone'." },
            { q: "Why were the lights flickering?", opt: ["The battery was low", "A storm was happening", "The signal was weak", "Someone was playing"], ans: 1, hint: "The weather outside caused the light problem." },
            { q: "What did the officer hear while checking mirrors?", opt: ["Music", "A loud noise", "A secret", "A greeting"], ans: 1, hint: "He heard something 'loud'." }
        ]
    },

    // ==========================================
    // 3. FUTURE CONTINUOUS (Akan Sedang Berlangsung)
    // ==========================================
    {
        id: "lv2_fut_cont_01",
        level: 2,
        tense: "future continuous",
        title: "Next Week's Journey",
        content: "This time next week, Anita will be traveling to an island for her vacation. She will be staying at a comfortable hotel near the beach. While her friends are working in the office, she will be enjoying the natural scenery. She will be taking many photos because she wants to remember every moment. She will also be wearing her favorite jewelry for the beach party.",
        questions: [
            { q: "Where will Anita be staying next week?", opt: ["At a station", "In a palace", "At a comfortable hotel", "In a forest"], ans: 2, hint: "Look for the type of accommodation." },
            { q: "What will she be doing while her friends work?", opt: ["Solving problems", "Enjoying natural scenery", "Repairing equipment", "Writing a report"], ans: 1, hint: "Her friends work, but she is on vacation." },
            { q: "Why will she be taking many photos?", opt: ["To sell them", "To become a journalist", "To remember every moment", "To show her manager"], ans: 2, hint: "It is related to her 'memory'." },
            { q: "What will she be wearing for the party?", opt: ["A uniform", "Favorite jewelry", "A heavy suitcase", "A mask"], ans: 1, hint: "Look for the 'jewelry' mentioned at the end." },
            { q: "Where is the hotel located?", opt: ["Near the mountain", "Near the beach", "Near the airport", "Near the museum"], ans: 1, hint: "The text says 'near the...'" }
        ]
    },
    {
        id: "lv2_fut_cont_02",
        level: 2,
        tense: "future continuous",
        title: "The Science Project",
        content: "Tomorrow afternoon, the engineer will be testing the new technology in the factory. At the same time, the manager will be explaining the safety instructions to the employees. They will be working hard to improve the production process. The team will be using special equipment to measure the temperature. They believe this project will be a great success in the future.",
        questions: [
            { q: "Who will be testing the new technology?", opt: ["A journalist", "A lawyer", "An engineer", "An actor"], ans: 2, hint: "Find the profession in the first sentence." },
            { q: "What will the manager be doing tomorrow?", opt: ["Repairing machines", "Explaining safety instructions", "Buying tickets", "Cleaning the floor"], ans: 1, hint: "The manager's job is about 'instructions'." },
            { q: "Why will they be working hard?", opt: ["To spend money", "To improve production", "To find a secret", "To avoid a storm"], ans: 1, hint: "They want to make the process better." },
            { q: "What will the team be measuring?", opt: ["The price", "The distance", "The temperature", "The weight"], ans: 2, hint: "Look for the word 'measure'." },
            { q: "What do they believe about the project?", opt: ["It will fail", "It will be a success", "It is impossible", "It is ordinary"], ans: 1, hint: "Check the last sentence." }
        ]
    },

    // ==========================================
    // 4. PRESENT PERFECT (Sudah Terjadi & Masih Terasa)
    // ==========================================
    {
        id: "lv2_pres_perf_01",
        level: 2,
        tense: "present perfect",
        title: "Travel Experience",
        content: "Tono has traveled to many international cities this year. He has visited five famous museums and has seen many ancient statues. He has already bought a ticket for his next adventure to a desert island. Tono has also improved his English language skills during his journey. However, he has not decided where to stay yet because the prices are very expensive.",
        questions: [
            { q: "How many museums has Tono visited?", opt: ["Three", "Five", "Ten", "None"], ans: 1, hint: "Look for the number mentioned." },
            { q: "What has he seen in the museums?", opt: ["Modern technology", "Ancient statues", "Newspapers", "Space equipment"], ans: 1, hint: "Look for the word 'ancient'." },
            { q: "What has he already bought?", opt: ["A suitcase", "A dictionary", "A ticket", "A mirror"], ans: 2, hint: "It is for his next adventure." },
            { q: "What skill has Tono improved?", opt: ["Cooking", "Driving", "English language", "Photography"], ans: 2, hint: "Check the word 'improved'." },
            { q: "Why has he not decided where to stay?", opt: ["He is busy", "The prices are expensive", "The hotel is full", "He lost his passport"], ans: 1, hint: "The last sentence mentions 'prices'." }
        ]
    },
    {
        id: "lv2_pres_perf_02",
        level: 2,
        tense: "present perfect",
        title: "The Successful Scientist",
        content: "Professor Green has discovered a new way to prevent pollution in the ocean. He has worked on this project for ten years. The government has supported his research and has provided special equipment for his laboratory. Many citizens have noticed the positive change in the environment. Professor Green has achieved his goal, and he has received a national award for his effort.",
        questions: [
            { q: "What has Professor Green discovered?", opt: ["A new island", "A way to prevent pollution", "A hidden treasure", "A new language"], ans: 1, hint: "Look for his discovery about the 'ocean'." },
            { q: "How long has he worked on this project?", opt: ["Five years", "Ten years", "Two years", "One year"], ans: 1, hint: "Check the duration in the text." },
            { q: "Who has supported his research?", opt: ["A journalist", "The government", "A famous actor", "A customer"], ans: 1, hint: "Find the entity that provided help." },
            { q: "What have the citizens noticed?", opt: ["A terrible storm", "A high price", "A positive change", "A strange shadow"], ans: 2, hint: "Look for what the 'citizens' saw." },
            { q: "What has the Professor received for his effort?", opt: ["A suitcase", "A national award", "A discount", "A dictionary"], ans: 1, hint: "The last sentence mentions an 'award'." }
        ]
    }
];

// Gabungkan ke STORY_BANK utama
window.STORY_BANK.push(...lv2Stories);