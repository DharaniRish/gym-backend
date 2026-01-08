import Exercise from '../models/Exercise.js';
import OpenAI from 'openai';

// Initialize OpenAI client
// Note: Requires OPENAI_API_KEY in .env
const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY || 'mock-key',
    dangerouslyAllowBrowser: true // Just in case, though this is backend
});

// @desc    Get all exercises
// @route   GET /api/exercises
// @access  Public
export const getExercises = async (req, res) => {
    try {
        const { difficulty, muscleGroup } = req.query;
        let query = {};

        if (difficulty) query.difficulty = difficulty;
        if (muscleGroup) query.muscleGroup = muscleGroup;

        const exercises = await Exercise.find(query);
        res.json(exercises);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get exercise by ID
// @route   GET /api/exercises/:id
// @access  Public
export const getExerciseById = async (req, res) => {
    try {
        const exercise = await Exercise.findById(req.params.id);
        if (exercise) {
            res.json(exercise);
        } else {
            res.status(404).json({ message: 'Exercise not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get AI Coach detailed guide
// @route   POST /api/exercises/ask-ai
// @access  Private
export const getAiExplanation = async (req, res) => {
    const { exerciseName, query } = req.body;

    try {
        // Fetch exercise from DB for context and fallback
        const dbExercise = await Exercise.findOne({ name: { $regex: new RegExp(`^${exerciseName}$`, 'i') } });

        const getBestVideo = (name, dbUrl) => {
            if (dbUrl && dbUrl.includes('youtube.com')) return dbUrl;
            const normalized = name.toLowerCase();
            const map = {
                "bench press": "https://www.youtube.com/embed/rT7DgCr-3pg",
                "squat": "https://www.youtube.com/embed/gcNh17Ckjgg",
                "squats": "https://www.youtube.com/embed/gcNh17Ckjgg",
                "deadlift": "https://www.youtube.com/embed/op9kVnSso6Q",
                "pull-ups": "https://www.youtube.com/embed/eGo4IYlbE5g",
                "overhead press": "https://www.youtube.com/embed/2yjwXTZQDDI",
                "barbell rows": "https://www.youtube.com/embed/RQU8wZubT-A",
                "romanian deadlifts": "https://www.youtube.com/embed/R_b_V8a8n3o",
                "pushups": "https://www.youtube.com/embed/IODxDxX7oi4",
                "plank": "https://www.youtube.com/embed/ASdvN_XEl_c"
            };
            return map[normalized] || "https://www.youtube.com/embed/dQw4w9WgXcQ";
        };

        const fallbackData = {
            title: "Verified Guide",
            message: query ? `I'm currently assisting in verified mode. Regarding your question: "${query}", I recommend sticking to the verified form cues below for ${exerciseName}.` : `Welcome! Here is the verified guide for ${exerciseName}.`,
            steps: dbExercise?.steps?.length > 0 ? dbExercise.steps : ["Start with a proper warm-up.", "Maintain a stable stance.", "Perform with controlled tempo."],
            mistakes: dbExercise?.commonMistakes?.length > 0 ? dbExercise.commonMistakes : ["Rushing through reps.", "Not breathing correctly."],
            videoUrl: getBestVideo(exerciseName, dbExercise?.videoUrl),
            isAi: false
        };

        if (!process.env.OPENAI_API_KEY || process.env.OPENAI_API_KEY === 'mock-key') {
            return res.json(fallbackData);
        }

        const systemPrompt = `
        You are an AI fitness coach inside a MERN stack gym application. 
        Current Exercise: ${exerciseName}
        ${dbExercise ? `Context: ${dbExercise.description}` : ''}
        
        Instructions:
        1. If user provides a query, answer it specifically based on ${exerciseName}.
        2. If no query, provide a general "How-To" guide.
        3. Do NOT include video URLs in your chat message.
        4. Focus on form, safety, and performance.
        5. Return response in valid JSON format.
        
        JSON structure:
        {
          "title": "Chat Response",
          "message": "AI advice here...",
          "steps": ["Step 1", "Step 2"],
          "mistakes": ["Mistake 1", "Mistake 2"]
        }
        `;

        const userMessage = query ? `User Question: ${query}` : `Provide a general guide for ${exerciseName}.`;

        try {
            const completion = await openai.chat.completions.create({
                messages: [
                    { role: "system", content: systemPrompt },
                    { role: "user", content: userMessage }
                ],
                model: "gpt-3.5-turbo",
                temperature: 0.7,
                response_format: { type: "json_object" }
            });

            const parsedData = JSON.parse(completion.choices[0].message.content);
            parsedData.isAi = true;
            parsedData.videoUrl = fallbackData.videoUrl;
            return res.json(parsedData);
        } catch (apiError) {
            console.error('OpenAI API/Parsing Error:', apiError.message);
            return res.json(fallbackData);
        }

    } catch (error) {
        console.error('AI Coach Controller Error:', error);
        res.status(500).json({ message: "AI Coach is having trouble thinking right now." });
    }
};

// @desc    Submit workout feedback
// @route   POST /api/exercises/feedback
// @access  Private
export const submitFeedback = async (req, res) => {
    const { exerciseName, pain, difficulty } = req.body;

    // Ideally, save this to User progress or logs
    // For now, return AI advice based on feedback

    let advice = "Great job completing the exercise!";
    if (pain) {
        advice = `Caution: If you felt pain in your ${pain}, please rest and consult a professional. Try lowering the weight or checking your form.`;
    } else if (difficulty === 'hard') {
        advice = "It's supposed to be challenging! Make sure you are recovering well.";
    }

    res.json({ message: 'Feedback received', advice });
};
