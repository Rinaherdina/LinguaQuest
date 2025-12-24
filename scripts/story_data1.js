window.STORY_BANK = window.STORY_BANK || [];

const lv1Stories = [
    // 1. DAILY ROUTINE (Present Tense)
    {
        id: "lv1_reading_01",
        level: 1,
        tense: "simple present",
        title: "My Daily Life",
        content: "Every morning, I wake up and drink a glass of water. My mother cooks breakfast in the kitchen while my father reads a book. I am a student, so I go to school with my friend. At school, we study English and learn many things. My teacher is very smart and kind. We like to play in the park after class. In the evening, I finish my homework and sleep early.",
        questions: [
            { q: "What does the writer drink in the morning?", opt: ["Milk", "Coffee", "Water", "Tea"], ans: 2, hint: "Look at the first sentence." },
            { q: "Where does the mother cook breakfast?", opt: ["Bedroom", "Kitchen", "Garden", "Office"], ans: 1, hint: "Kitchen is for cooking." },
            { q: "Who is smart and kind?", opt: ["The friend", "The father", "The teacher", "The dog"], ans: 2, hint: "Check the description of the teacher." },
            { q: "What do they do in the park?", opt: ["Study", "Sleep", "Play", "Read"], ans: 2, hint: "They like to play." },
            { q: "When does the writer finish homework?", opt: ["Morning", "Afternoon", "Evening", "Night"], ans: 2, hint: "Check the last sentence." }
        ],
        reward: 20
    },

    // 2. YESTERDAY'S TRIP (Past Tense)
    {
        id: "lv1_reading_02",
        level: 1,
        tense: "simple past",
        title: "A Trip to the Beach",
        content: "Yesterday, my family went to the beach. The sky was blue and the sun was hot. My brother and I swam in the water. My father sat on a chair and watched us. We brought some bread and apples for lunch. My sister drew a beautiful picture on the sand. We felt very happy because the place was quiet and clean. We went home in the afternoon.",
        questions: [
            { q: "Where did the family go yesterday?", opt: ["School", "Market", "Beach", "Hospital"], ans: 2, hint: "Check the title or first sentence." },
            { q: "How was the sun?", opt: ["Cold", "Hot", "Small", "Dark"], ans: 1, hint: "Sun usually makes things hot." },
            { q: "What did they eat for lunch?", opt: ["Rice and fish", "Bread and apples", "Meat and egg", "Cake"], ans: 1, hint: "Look for food names." },
            { q: "Who drew a picture on the sand?", opt: ["The brother", "The sister", "The mother", "The teacher"], ans: 1, hint: "Check the sister's action." },
            { q: "Why were they happy?", opt: ["Because it was noisy", "Because it was expensive", "Because it was quiet and clean", "Because it was far"], ans: 2, hint: "Look for 'quiet and clean'." }
        ],
        reward: 20
    },

    // 3. FUTURE PLANS (Future Tense)
    {
        id: "lv1_reading_03",
        level: 1,
        tense: "simple future",
        title: "Next Holiday Plans",
        content: "Next week, I will visit my grandfather in the town. I will go there by bus. I will bring a new shirt for him. We will walk in his large garden and see many flowers. My grandfather will show me how to plant a tree. I hope the weather will be bright. It will be a perfect holiday for me.",
        questions: [
            { q: "When will the writer visit the grandfather?", opt: ["Today", "Yesterday", "Next week", "Next month"], ans: 2, hint: "Future time marker." },
            { q: "How will the writer go there?", opt: ["By car", "By bus", "By bike", "By train"], ans: 1, hint: "Check the transport." },
            { q: "What will the writer bring?", opt: ["A book", "A new shirt", "A bag", "A watch"], ans: 1, hint: "Look for 'shirt'." },
            { q: "What will they do in the garden?", opt: ["Run", "Sleep", "Walk and see flowers", "Eat"], ans: 2, hint: "Garden activities." },
            { q: "What is the writer's hope?", opt: ["Bright weather", "Rainy day", "New shoes", "Many money"], ans: 0, hint: "Check 'I hope...'." }
        ],
        reward: 20
    },

    // 4. AT THE MARKET (Present Tense)
    {
        id: "lv1_reading_04",
        level: 1,
        tense: "simple present",
        title: "Helping Mother",
        content: "Today is Sunday. I help my mother at the market. The market is very busy and noisy. Mother wants to buy some meat, fish, and vegetables. I carry a big bag for her. Everything is cheap here. We also see a fruit shop. I want an orange, but mother gives me a red apple. I am hungry, so I want to go home and cook.",
        questions: [
            { q: "What day is it today?", opt: ["Monday", "Friday", "Sunday", "Saturday"], ans: 2, hint: "First sentence." },
            { q: "How is the market?", opt: ["Quiet", "Busy and noisy", "Empty", "Clean"], ans: 1, hint: "Market description." },
            { q: "What does the writer carry?", opt: ["A small pen", "A big bag", "A chair", "A bottle"], ans: 1, hint: "Check the writer's action." },
            { q: "What fruit does the mother give?", opt: ["Orange", "Banana", "Red apple", "Grape"], ans: 2, hint: "Look for the fruit color." },
            { q: "Why does the writer want to go home?", opt: ["Tired", "Sad", "Hungry", "Bored"], ans: 2, hint: "Check the last sentence." }
        ],
        reward: 20
    },

    // 5. THE NEW CAT (Past Tense)
    {
        id: "lv1_reading_05",
        level: 1,
        tense: "simple past",
        title: "A Lucky Day",
        content: "Last night, I heard a sound outside my door. I opened the window and looked down. I saw a small cat. It was wet and cold because of the rain. I felt sorry for the cat, so I brought it inside. I gave it some warm milk and a soft towel. The cat stopped crying and fell asleep. I called it 'Lucky'.",
        questions: [
            { q: "When did the story happen?", opt: ["This morning", "Last night", "Yesterday afternoon", "Two days ago"], ans: 1, hint: "Time marker." },
            { q: "Why was the cat wet and cold?", opt: ["Because of the sun", "Because of the rain", "Because of the wind", "Because it swam"], ans: 1, hint: "Weather condition." },
            { q: "What did the writer give to the cat?", opt: ["Water", "Warm milk and a towel", "Bread", "A toy"], ans: 1, hint: "Look for cat's food/drink." },
            { q: "What did the cat do after drinking milk?", opt: ["Ran away", "Jumped", "Fell asleep", "Played"], ans: 2, hint: "Last part of the story." },
            { q: "What is the cat's name?", opt: ["Happy", "Star", "Lucky", "Buddy"], ans: 2, hint: "Check the last sentence." }
        ],
        reward: 20
    },

    // 6. SCHOOL DOCTOR (Present Tense)
    {
        id: "lv1_reading_06",
        level: 1,
        tense: "simple present",
        title: "The School Clinic",
        content: "My sister is a nurse at the hospital, but today she visits my school. She talks to the students about health. She says we need to wash our hands and brush our teeth every day. If we feel sick, we must tell a teacher or a doctor. Eating fruit is good for the body. I think her job is very important because she helps many people.",
        questions: [
            { q: "What is the sister's job?", opt: ["Teacher", "Doctor", "Nurse", "Chef"], ans: 2, hint: "Check her profession." },
            { q: "What must we do every day?", opt: ["Sleep in class", "Wash hands and brush teeth", "Buy toys", "Run fast"], ans: 1, hint: "Health advice." },
            { q: "What should we do if we feel sick?", opt: ["Cry", "Tell a teacher or doctor", "Go home alone", "Read a book"], ans: 1, hint: "Check the advice for sick people." },
            { q: "What food is good for the body?", opt: ["Sugar", "Salt", "Fruit", "Coffee"], ans: 2, hint: "Look for healthy food." },
            { q: "Why is her job important?", opt: ["She is famous", "She is rich", "She helps people", "She is beautiful"], ans: 2, hint: "Check the last sentence." }
        ],
        reward: 20
    },

    // 7. LEARNING TO DRIVE (Future Tense)
    {
        id: "lv1_reading_07",
        level: 1,
        tense: "simple future",
        title: "Future Skill",
        content: "When I am older, I will learn how to drive a car. My father will teach me on the road near our house. I will be very careful and slow at first. I will use a blue car because it is my favorite color. I will also take my friends to the city. I hope I will be a good driver and pass the test easily.",
        questions: [
            { q: "What will the writer learn?", opt: ["To swim", "To drive a car", "To cook", "To sing"], ans: 1, hint: "Look for 'drive'." },
            { q: "Who will teach the writer?", opt: ["Mother", "Teacher", "Father", "Brother"], ans: 2, hint: "The person teaching." },
            { q: "What color car will the writer use?", opt: ["Red", "Green", "Blue", "Black"], ans: 2, hint: "Favorite color." },
            { q: "Where will the writer take the friends?", opt: ["To the beach", "To the city", "To the park", "To the school"], ans: 1, hint: "Check the destination." },
            { q: "What is the writer's hope for the test?", opt: ["To fail", "To pass easily", "To be late", "To be angry"], ans: 1, hint: "Last sentence." }
        ],
        reward: 20
    },

    // 8. THE BUSY CHEF (Present Tense)
    {
        id: "lv1_reading_08",
        level: 1,
        tense: "simple present",
        title: "Inside the Kitchen",
        content: "Mr. Tan is a chef in a big restaurant. He is always busy. Every morning, he cleans the kitchen and checks the meat and fish. He uses a sharp knife to cut the vegetables. He cooks many delicious songs—no, he cooks many delicious meals. People love his food because it is never bitter or sour. He is a very famous man in this town.",
        questions: [
            { q: "Where does Mr. Tan work?", opt: ["School", "Bank", "Restaurant", "Hospital"], ans: 2, hint: "A chef works here." },
            { q: "What does he do every morning?", opt: ["Sleep", "Cleans the kitchen", "Buys a car", "Plays a game"], ans: 1, hint: "Chef's morning routine." },
            { q: "What tool does he use to cut vegetables?", opt: ["Pen", "Spoon", "Knife", "Desk"], ans: 2, hint: "Tool for cutting." },
            { q: "How is the taste of his food?", opt: ["Bitter", "Sour", "Delicious", "Bad"], ans: 2, hint: "Check the description of food." },
            { q: "Is Mr. Tan famous?", opt: ["No", "Yes", "Maybe", "He is poor"], ans: 1, hint: "Last sentence." }
        ],
        reward: 20
    },

    // 9. A NEW HOME (Past Tense)
    {
        id: "lv1_reading_09",
        level: 1,
        tense: "simple past",
        title: "Moving House",
        content: "Last month, my family moved to a new house. The house was big and had many windows. I had a small room, but it was very bright. We put a table and a chair near the window. My brother helped me carry the boxes. We washed the floor and cleaned the walls. We stayed there for the first night and felt very safe.",
        questions: [
            { q: "When did the family move?", opt: ["Last week", "Last month", "Last year", "Yesterday"], ans: 1, hint: "Check the time marker." },
            { q: "How was the house?", opt: ["Small", "Big with many windows", "Dirty", "Old"], ans: 1, hint: "Check the house description." },
            { q: "What was near the window?", opt: ["A bed", "A table and chair", "A lamp", "A cat"], ans: 1, hint: "Look for furniture names." },
            { q: "What did the brother do?", opt: ["He slept", "He helped carry boxes", "He cooked", "He sang"], ans: 1, hint: "Check brother's action." },
            { q: "How did they feel on the first night?", opt: ["Scared", "Sad", "Safe", "Hungry"], ans: 2, hint: "Check the last word." }
        ],
        reward: 20
    },

    // 10. COMPUTER CLASS (Future Tense)
    {
        id: "lv1_reading_10",
        level: 1,
        tense: "simple future",
        title: "The New Computer",
        content: "Tomorrow, my father will buy a new computer for me. I will use it for my study. I will learn how to write a song and draw a picture on it. My sister will borrow it sometimes to watch a movie. We will keep the computer clean and safe. I will be very happy and work hard with my new computer.",
        questions: [
            { q: "When will the father buy the computer?", opt: ["Today", "Tomorrow", "Next week", "Yesterday"], ans: 1, hint: "Look at the first word." },
            { q: "What will the writer do with the computer first?", opt: ["Play games", "Use it for study", "Sell it", "Sleep"], ans: 1, hint: "Check 'use it for...'." },
            { q: "What will the writer learn on the computer?", opt: ["To cook", "To write a song and draw", "To swim", "To drive"], ans: 1, hint: "Check the activities." },
            { q: "What will the sister do with it?", opt: ["Wash it", "Borrow it to watch a movie", "Break it", "Give it away"], ans: 1, hint: "Check sister's plan." },
            { q: "How will they keep the computer?", opt: ["Dirty", "Clean and safe", "Old", "Empty"], ans: 1, hint: "Check the maintenance plan." }
        ],
        reward: 20
    },
    {
        id: "st_pa_11",
        level: 1,
        tense: "past",
        title: "A Fun Saturday",
        content: "Last Saturday, I stayed at home with my brother. In the morning, we cleaned our bedroom and washed our shoes. In the afternoon, we played football in the garden. My father bought a big pizza for our lunch. We also watched a funny movie on the computer. We laughed a lot because the movie was very good. We felt tired at night, so we slept early.",
        questions: [
            { q: "When did the story happen?", opt: ["Last Friday", "Last Saturday", "Last Sunday", "Yesterday"], ans: 1, hint: "Check the first sentence." },
            { q: "What did they wash in the morning?", opt: ["The car", "The clothes", "Their shoes", "The floor"], ans: 2, hint: "Look for what they did after cleaning the room." },
            { q: "Where did they play football?", opt: ["In the park", "At school", "In the garden", "On the road"], ans: 2, hint: "Find the place for playing." },
            { q: "What did the father buy for lunch?", opt: ["Bread", "Pizza", "Rice", "Fish"], ans: 1, hint: "Look for a food name." },
            { q: "Why did they laugh?", opt: ["Because they were hungry", "Because the movie was funny", "Because they won a game", "Because it was raining"], ans: 1, hint: "Check the description of the movie." }
        ]
    },

    // 12. FUTURE CAREER (Future Tense)
    {
        id: "st_fu_12",
        level: 1,
        tense: "future",
        title: "When I Grow Up",
        content: "I want to be a great singer in the future. I will learn how to sing beautiful songs every day. My mother will buy a new microphone for me next month. I will also learn to play the guitar with my friend. I will travel to many cities and show my music to everyone. I hope people will like my voice. It will be a very exciting job for me.",
        questions: [
            { q: "What does the writer want to be?", opt: ["A doctor", "A singer", "A teacher", "A chef"], ans: 1, hint: "Look for the profession." },
            { q: "What will the mother buy next month?", opt: ["A guitar", "A computer", "A microphone", "A dress"], ans: 2, hint: "A tool for a singer." },
            { q: "Who will the writer learn guitar with?", opt: ["Father", "Teacher", "Brother", "Friend"], ans: 3, hint: "Find the person mentioned." },
            { q: "Where will the writer travel?", opt: ["To the beach", "To many cities", "To the school", "To the market"], ans: 1, hint: "Look for the destination." },
            { q: "How is the writer's feeling about the job?", opt: ["Bored", "Scared", "Excited", "Sad"], ans: 2, hint: "Check the last sentence." }
        ]
    },

    // 13. COOKING WITH FATHER (Past Tense)
    {
        id: "st_pa_13",
        level: 1,
        tense: "past",
        title: "Cooking Dinner",
        content: "Last night, I helped my father in the kitchen. We cooked a special dinner for my mother's birthday. My father cut the meat and I washed the vegetables. We used salt and sugar to make the food delicious. After one hour, the food was ready. My mother was very surprised and happy. We ate the dinner together and the taste was perfect.",
        questions: [
            { q: "Why did they cook a special dinner?", opt: ["For Christmas", "For mother's birthday", "For a New Year", "For lunch"], ans: 1, hint: "Check the reason for cooking." },
            { q: "What did the writer do in the kitchen?", opt: ["Cut the meat", "Washed the vegetables", "Bought the food", "Cleaned the floor"], ans: 1, hint: "Check the writer's specific action." },
            { q: "What did they use to make the food delicious?", opt: ["Milk and water", "Salt and sugar", "Fruit and bread", "Tea and coffee"], ans: 1, hint: "Look for the ingredients." },
            { q: "How long did they cook?", opt: ["Thirty minutes", "One hour", "Two hours", "All day"], ans: 1, hint: "Look for the time mentioned." },
            { q: "How was the taste of the food?", opt: ["Bitter", "Sour", "Perfect", "Bad"], ans: 2, hint: "Check the last sentence." }
        ]
    },

    // 14. THE NEW BIKE (Present Tense)
    {
        id: "st_pr_14",
        level: 1,
        tense: "present",
        title: "My Blue Bike",
        content: "I have a new bike. The color is bright blue. Every afternoon, I ride my bike to the park near my house. The bike is very fast and easy to use. I always wear my hat and shoes when I ride it. Sometimes, I meet my friends and we race together. I keep my bike clean and put it in the garage at night. I love my bike very much.",
        questions: [
            { q: "What color is the bike?", opt: ["Red", "Blue", "Green", "Yellow"], ans: 1, hint: "Look for the color." },
            { q: "Where does the writer go with the bike?", opt: ["To the market", "To the park", "To the school", "To the hospital"], ans: 1, hint: "Check the destination." },
            { q: "What does the writer wear for safety?", opt: ["Uniform", "Coat", "Hat and shoes", "Watch"], ans: 2, hint: "Look for clothes mentioned." },
            { q: "Where does the writer put the bike at night?", opt: ["In the kitchen", "In the garden", "In the garage", "On the road"], ans: 2, hint: "Check the storage place." },
            { q: "How is the bike described?", opt: ["Slow and old", "Big and heavy", "Fast and easy to use", "Dirty and small"], ans: 2, hint: "Check the adjectives." }
        ]
    },

    // 15. VISITING GRANDPARENTS (Future Tense)
    {
        id: "st_fu_15",
        level: 1,
        tense: "future",
        title: "A Trip to the Village",
        content: "Next month, my family will visit my grandparents in a small village. We will stay there for three days. My grandfather will show me his farm. We will see many animals like cows, ducks, and chickens. My grandmother will cook traditional food for us. I will also swim in the river with my cousins. I think it will be a very peaceful holiday.",
        questions: [
            { q: "How long will they stay in the village?", opt: ["One day", "Two days", "Three days", "One week"], ans: 2, hint: "Look for the duration." },
            { q: "What will the grandfather show?", opt: ["His car", "His farm", "His new house", "His money"], ans: 1, hint: "Find the grandfather's property." },
            { q: "What animals will they see?", opt: ["Lions and tigers", "Cats and dogs", "Cows, ducks, and chickens", "Birds and fish"], ans: 2, hint: "Look for farm animals." },
            { q: "What will the writer do in the river?", opt: ["Wash clothes", "Swim", "Catch fish", "Drink water"], ans: 1, hint: "Check the river activity." },
            { q: "How does the writer describe the holiday?", opt: ["Noisy", "Boring", "Peaceful", "Expensive"], ans: 2, hint: "Check the last sentence." }
        ]
    }
    // Tambahkan sampai no 20 jika diperlukan...
];

window.STORY_BANK.push(...lv1Stories);