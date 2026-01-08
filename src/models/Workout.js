import mongoose from 'mongoose';

const exerciseSchema = new mongoose.Schema({
  name: { type: String, required: true },
  sets: { type: Number, required: true },
  reps: { type: String, required: true }, // Can be "10-12" or "12"
  rest: { type: Number, default: 60 }, // in seconds
  notes: { type: String },
});

const workoutDaySchema = new mongoose.Schema({
  day: {
    type: String,
    enum: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'],
    required: true,
  },
  exercises: [exerciseSchema],
  focus: { type: String }, // e.g., "Push", "Pull", "Legs"
});

const workoutSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  goal: {
    type: String,
    enum: ['fat_loss', 'muscle_gain', 'strength', 'endurance'],
    required: true,
  },
  weeklySplit: {
    type: String,
    enum: ['push_pull_legs', 'upper_lower', 'full_body', 'custom'],
    required: true,
  },
  daysPerWeek: { type: Number, required: true },
  workoutDays: [workoutDaySchema],
  status: {
    type: String,
    enum: ['active', 'completed', 'paused'],
    default: 'active',
  },
  assignedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  completedWorkouts: [{
    date: { type: Date },
    day: { type: String },
    exercisesCompleted: [{ type: String }],
  }],
  activeSession: {
    day: { type: String },
    startedAt: { type: Date },
    exercisesCompleted: [{ type: String }]
  },
  startDate: { type: Date, default: Date.now },
  endDate: { type: Date },
}, {
  timestamps: true,
});

const Workout = mongoose.model('Workout', workoutSchema);

export default Workout;






