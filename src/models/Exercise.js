import mongoose from 'mongoose';

const exerciseSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true,
    },
    description: {
        type: String,
        required: true,
    },
    muscleGroup: {
        type: String,
        required: true,
        enum: ['Chest', 'Back', 'Legs', 'Shoulders', 'Arms', 'Core', 'Full Body'],
    },
    difficulty: {
        type: String,
        enum: ['Beginner', 'Intermediate', 'Advanced'],
        default: 'Beginner',
    },
    imageUrl: {
        type: String,
        default: 'https://placehold.co/600x400?text=Exercise+Image',
    },
    videoUrl: {
        type: String, // URL to video (YouTube unlisted or Cloudinary)
        required: true,
    },
    steps: [{
        type: String, // Step-by-step instructions
        required: true,
    }],
    aiTips: {
        type: String, // Pre-generated tips or general advice
    },
    commonMistakes: [{
        type: String,
    }],
    breathing: {
        type: String,
    },
    creator: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        default: null,
    },
    isCustom: {
        type: Boolean,
        default: false,
    },
}, {
    timestamps: true,
});

const Exercise = mongoose.model('Exercise', exerciseSchema);

export default Exercise;
