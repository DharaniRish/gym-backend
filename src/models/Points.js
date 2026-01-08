import mongoose from 'mongoose';

const pointsSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  points: { type: Number, required: true },
  source: {
    type: String,
    enum: ['daily_login', 'workout_completion', 'attendance_streak', 'diet_completion', 'community_post', 'achievement'],
    required: true,
  },
  description: { type: String },
  relatedId: {
    type: mongoose.Schema.Types.ObjectId,
  },
}, {
  timestamps: true,
});

pointsSchema.index({ user: 1, createdAt: -1 });

const Points = mongoose.model('Points', pointsSchema);

export default Points;






