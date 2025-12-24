window.STORY_BANK = window.STORY_BANK || [];

const lv3Stories = [
    // ==========================================
    // 1. PAST PERFECT (Sudah selesai sebelum kejadian lampau lainnya)
    // ==========================================
    {
        id: "lv3_past_perf_01",
        level: 3,
        tense: "past perfect",
        title: "The Successful Proposal",
        content: "Before the meeting started yesterday, the team had already prepared a detailed proposal. The manager realized that they had considered every potential challenge in their analysis. By the time the client arrived, the department had organized all the necessary digital equipment. The team felt confident because they had researched the client's preferences for months. Everyone appreciated the hard work that had gone into the project.",
        questions: [
            { q: "What had the team done before the meeting started?", opt: ["Met the client", "Prepared a detailed proposal", "Left the office", "Had a lunch break"], ans: 1, hint: "Look for the action completed 'before the meeting'." },
            { q: "What had the manager realized about the team's analysis?", opt: ["It was too short", "They had considered every challenge", "It was missing data", "It was not professional"], ans: 1, hint: "Check the word 'challenge' in the second sentence." },
            { q: "What had the department organized by the time the client arrived?", opt: ["A big party", "A new office", "Digital equipment", "Traditional food"], ans: 2, hint: "Look for 'digital equipment'." },
            { q: "Why did the team feel confident?", opt: ["They had researched preferences", "The client was their friend", "They had no competition", "They had a lot of wealth"], ans: 0, hint: "Confidence came from 'research'." },
            { q: "Had the team spent a long time on research?", opt: ["No, only one day", "Yes, for months", "No, they ignored it", "Yes, for one week"], ans: 1, hint: "The text mentions 'for months'." }
        ]
    },
    {
        id: "lv3_past_perf_02",
        level: 3,
        tense: "past perfect",
        title: "A Scientific Discovery",
        content: "By the time the university announced the news, the scientist had already confirmed the theory. She had examined thousands of samples before she reached a final conclusion. Her innovation had provided a unique solution to an existing environmental problem. Before this discovery occurred, many people had doubted her approach. However, her persistence showed that she had deserved the national recognition.",
        questions: [
            { q: "When did the scientist confirm the theory?", opt: ["After the announcement", "Before the announcement", "During the party", "Last year"], ans: 1, hint: "The first sentence uses 'By the time'." },
            { q: "How many samples had she examined?", opt: ["None", "A few", "Thousands", "One hundred"], ans: 2, hint: "Look for 'thousands of samples'." },
            { q: "What had her innovation provided?", opt: ["A temporary problem", "A unique solution", "A financial crisis", "A new office"], ans: 1, hint: "Look for 'unique solution'." },
            { q: "What had people done before the discovery occurred?", opt: ["Supported her", "Doubted her approach", "Ignored the news", "Celebrated the success"], ans: 1, hint: "Find the word 'doubted'." },
            { q: "Why did she deserve the recognition?", opt: ["Because she was lucky", "Because of her persistence", "Because she was rich", "Because she was young"], ans: 1, hint: "The text says 'persistence showed...'." }
        ]
    },

    // ==========================================
    // 2. FUTURE PERFECT (Akan sudah selesai di masa depan)
    // ==========================================
    {
        id: "lv3_fut_perf_01",
        level: 3,
        tense: "future perfect",
        title: "Future Career Goals",
        content: "By next year, Budi will have achieved his goal of becoming a professional manager. He will have completed his leadership training by the end of this month. His company will have promoted him because he will have shown great responsibility in his current role. By the time he turns thirty, he will have obtained a significant amount of experience. He believes that his contribution will have improved the entire organization.",
        questions: [
            { q: "What will Budi have achieved by next year?", opt: ["Bought a car", "Become a professional manager", "Traveled the world", "Opened a restaurant"], ans: 1, hint: "Check his main goal in the first sentence." },
            { q: "When will he have completed his leadership training?", opt: ["Next year", "By the end of this month", "Tomorrow", "In ten years"], ans: 1, hint: "Look for the specific timeframe for 'training'." },
            { q: "Why will the company have promoted him?", opt: ["Because he is lucky", "Because of his responsibility", "Because he is rich", "Because he is a volunteer"], ans: 1, hint: "It is due to his 'responsibility'." },
            { q: "What will he have obtained by age thirty?", opt: ["A new house", "Significant experience", "A digital camera", "A scientific theory"], ans: 1, hint: "Look for 'obtained' and 'experience'." },
            { q: "What will his contribution have done?", opt: ["Wasted time", "Improved the organization", "Caused a problem", "Reduced the salary"], ans: 1, hint: "Check the last sentence." }
        ]
    },
    {
        id: "lv3_fut_perf_02",
        level: 3,
        tense: "future perfect",
        title: "Global Technology Vision",
        content: "By 2030, technology will have transformed our society in many ways. Scientists will have developed more efficient methods to protect the environment. Artificial intelligence will have replaced many repetitive tasks in various professions. Most individuals will have become aware of the importance of digital security. By then, the universal access to information will have increased global intelligence.",
        questions: [
            { q: "What will have happened by 2030?", opt: ["Society will have transformed", "Nothing will change", "The ocean will disappear", "Money will be useless"], ans: 0, hint: "The first sentence mentions 'transformed'." },
            { q: "What will scientists have developed?", opt: ["Expensive cars", "Efficient methods to protect nature", "New planets", "Traditional food"], ans: 1, hint: "Look for 'efficient methods'." },
            { q: "What will have happened to repetitive tasks?", opt: ["They will increase", "AI will have replaced them", "They will become harder", "They will be ignored"], ans: 1, hint: "Look for 'replaced' and 'AI'." },
            { q: "What will most individuals have become aware of?", opt: ["Global wealth", "Digital security", "History", "Physical health"], ans: 1, hint: "Check 'aware' and 'digital security'." },
            { q: "What will have increased global intelligence?", opt: ["Universal access to information", "Strict rules", "Expensive education", "Large population"], ans: 0, hint: "The last sentence provides the reason." }
        ]
    },

    // ==========================================
    // 3. PRESENT PERFECT CONTINUOUS (Sudah & masih berlangsung)
    // ==========================================
    {
        id: "lv3_pres_perf_cont_01",
        level: 3,
        tense: "present perfect continuous",
        title: "Community Interaction",
        content: "The local community has been discussing the new environmental strategy for weeks. The leaders have been encouraging residents to participate in the recycling program. Many volunteers have been providing additional guidance to those who are confused. Scientists have been observing the positive effects of this movement on the local wildlife. Everyone has been working hard to ensure a stable future for the next generation.",
        questions: [
            { q: "How long has the community been discussing the strategy?", opt: ["For days", "For weeks", "For years", "For months"], ans: 1, hint: "Look for the time duration 'weeks'." },
            { q: "What have the leaders been encouraging?", opt: ["To waste money", "To participate in recycling", "To ignore the rules", "To move to another city"], ans: 1, hint: "Check 'encourage' and 'recycling'." },
            { q: "Who has been providing additional guidance?", opt: ["Journalists", "Volunteers", "Engineers", "Actors"], ans: 1, hint: "Identify the group providing help." },
            { q: "What have scientists been observing?", opt: ["A terrible storm", "Positive effects on wildlife", "Financial loss", "Traffic problems"], ans: 1, hint: "Look for 'observing' and 'wildlife'." },
            { q: "Why has everyone been working hard?", opt: ["To get rich", "To ensure a stable future", "To win a competition", "To avoid work"], ans: 1, hint: "Check the purpose in the last sentence." }
        ]
    },
    {
        id: "lv3_pres_perf_cont_02",
        level: 3,
        tense: "present perfect continuous",
        title: "Professional Development",
        content: "Alice has been considering a career change recently. She has been researching various professions that require creativity and independent thought. She has been attending several training units to improve her digital skills. Her friends have been supporting her decision because they recognize her potential. She has been feeling more confident as she gains more knowledge through this process.",
        questions: [
            { q: "What has Alice been considering recently?", opt: ["Buying a house", "A career change", "A long vacation", "Studying history"], ans: 1, hint: "The first sentence mentions 'career change'." },
            { q: "What kind of professions has she been researching?", opt: ["Professions requiring creativity", "Ordinary jobs", "Physical labor", "Scientific research only"], ans: 0, hint: "Look for 'creativity' and 'independent thought'." },
            { q: "What has she been doing to improve her skills?", opt: ["Watching TV", "Attending training units", "Ignoring her friends", "Sleeping more"], ans: 1, hint: "Look for 'training units'." },
            { q: "Why have her friends been supporting her?", opt: ["They want her money", "They recognize her potential", "They are bored", "They want her to move"], ans: 1, hint: "Check 'support' and 'potential'." },
            { q: "How has she been feeling lately?", opt: ["Anxious", "More confident", "Terrible", "Upset"], ans: 1, hint: "Look for her emotion in the last sentence." }
        ]
    },

    // ==========================================
    // 4. PAST PERFECT CONTINUOUS (Sudah berlangsung lama sebelum titik waktu lampau)
    // ==========================================
    {
        id: "lv3_past_perf_cont_01",
        level: 3,
        tense: "past perfect continuous",
        title: "The Long Negotiation",
        content: "Before they reached an agreement, the two companies had been negotiating for over a year. The managers had been handling many complex issues regarding the partnership. They had been trying to find a realistic solution that would satisfy both sides. The employees had been worrying about their job security during the entire process. Finally, their patience resulted in a successful outcome that benefited everyone.",
        questions: [
            { q: "How long had the companies been negotiating?", opt: ["One month", "Over a year", "Five years", "One week"], ans: 1, hint: "Look for 'over a year' in the first sentence." },
            { q: "What kind of issues had the managers been handling?", opt: ["Simple ones", "Complex issues", "Financial crimes", "Personal problems"], ans: 1, hint: "Look for the adjective 'complex'." },
            { q: "What were they trying to find?", opt: ["A new office", "A realistic solution", "A secret weapon", "An expensive lawyer"], ans: 1, hint: "Check 'realistic solution'." },
            { q: "What had the employees been worrying about?", opt: ["Their lunch", "Job security", "The weather", "The price of metal"], ans: 1, hint: "Look for 'job security'." },
            { q: "What resulted in a successful outcome?", opt: ["Luck", "Patience", "A storm", "An accident"], ans: 1, hint: "The last sentence mentions 'patience'." }
        ]
    },
    {
        id: "lv3_past_perf_cont_02",
        level: 3,
        tense: "past perfect continuous",
        title: "Scientific Persistence",
        content: "The researchers had been examining the surface of the planet for months before they found any evidence of water. They had been operating the remote equipment under very strict conditions. The team had been suffering from lack of sleep because they had been focusing on the data day and night. Their determination was remarkable. They had been expecting a discovery, but the reality was even more extraordinary than their theory.",
        questions: [
            { q: "Where had the researchers been examining?", opt: ["The ocean floor", "The surface of the planet", "A forest", "A factory"], ans: 1, hint: "Check the location in the first sentence." },
            { q: "Under what conditions had they been operating equipment?", opt: ["Illegal conditions", "Very strict conditions", "Comfortable conditions", "Public conditions"], ans: 1, hint: "Look for the adjective 'strict'." },
            { q: "Why had the team been suffering from lack of sleep?", opt: ["They were at a party", "They were focusing on data", "They were traveling", "They were arguing"], ans: 1, hint: "Look for the reason for 'lack of sleep'." },
            { q: "How was their determination described?", opt: ["Ordinary", "Remarkable", "Useless", "Negative"], ans: 1, hint: "Find the adjective used for 'determination'." },
            { q: "How was the reality compared to their theory?", opt: ["It was the same", "It was worse", "It was more extraordinary", "It was boring"], ans: 2, hint: "Check the very last sentence." }
        ]
    }
];

window.STORY_BANK.push(...lv3Stories);