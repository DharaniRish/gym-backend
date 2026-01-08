import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Exercise from '../models/Exercise.js';
import connectDB from '../config/database.js';

dotenv.config();

const exercises = [
    {
        name: 'Push Up',
        description: 'A classic bodyweight exercise that strengthens the chest, shoulders, and triceps.',
        muscleGroup: 'Chest',
        difficulty: 'Beginner',
        videoUrl: 'https://www.youtube.com/watch?v=IODxDxX7oi4', // Placeholder
        steps: [
            'Start in a plank position with hands slightly wider than shoulders.',
            'Lower your body until your chest nearly touches the floor.',
            'Push back up to the starting position.',
            'Keep your core tight throughout the movement.'
        ],
        aiTips: 'Keep your elbows at a 45-degree angle to protect your shoulders.',
        commonMistakes: ['Sagging hips', 'Flaring elbows too wide'],
        breathing: 'Inhale as you lower, exhale as you push up.'
    },
    {
        name: 'Squat',
        description: 'A fundamental leg exercise for quads, hamstrings, and glutes.',
        muscleGroup: 'Legs',
        difficulty: 'Beginner',
        videoUrl: 'https://www.youtube.com/watch?v=YaXPRqUwItQ', // Placeholder
        steps: [
            'Stand with feet shoulder-width apart.',
            'Lower your hips back and down as if sitting in a chair.',
            'Keep your chest up and back straight.',
            'Drive through your heels to return to standing.'
        ],
        aiTips: 'Ensure your knees track over your toes, not inward.',
        commonMistakes: ['Heels lifting off ground', 'Rounding the back'],
        breathing: 'Inhale on the way down, exhale heavily on the way up.'
    },
    {
        name: 'Plank',
        description: 'Core stability exercise.',
        muscleGroup: 'Core',
        difficulty: 'Beginner',
        videoUrl: 'https://www.youtube.com/watch?v=pSHjTRCQxIw',
        steps: [
            'Forearms on the ground, elbows under shoulders.',
            'Legs extended back, balancing on toes.',
            'Maintain a straight line from head to heels.'
        ],
        aiTips: 'Squeeze your glutes and quads to keep the line straight.',
        commonMistakes: ['Hips too high or too low', 'Holding breath'],
        breathing: 'Breathe normally and rhythmically.'
    },
    {
        name: 'Dumbbell Curl',
        description: 'Isolation exercise for biceps.',
        muscleGroup: 'Arms',
        difficulty: 'Beginner',
        videoUrl: 'https://www.youtube.com/watch?v=ykJmrZ5v0Oo',
        steps: [
            'Hold a dumbbell in each hand, palms facing forward.',
            'Keep elbows close to torso.',
            'Curl the weights up towards shoulders.',
            'Lower slowly.'
        ],
        aiTips: 'Avoid swinging your body to lift the weight.',
        commonMistakes: ['Swinging torso', 'Elbows moving forward'],
        breathing: 'Exhale up, inhale down.'
    }
];

const seedExercises = async () => {
    try {
        // Determine mongo URI - try to read from local .env or assume default if missing
        // Since we can't easily read the .env from here appropriately without the app context, 
        // we rely on the connectDB function which should pick up process.env
        await connectDB();

        await Exercise.deleteMany();
        console.log('Exercises cleared');

        await Exercise.insertMany(exercises);
        console.log('Exercises added');

        process.exit();
    } catch (error) {
        console.error(`Error: ${error.message}`);
        process.exit(1);
    }
};

seedExercises();
