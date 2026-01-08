import mongoose from 'mongoose';

const mealSchema = new mongoose.Schema({
  name: { type: String, required: true },
  items: [{
    text: { type: String, required: true },
    completed: { type: Boolean, default: false }
  }],
  calories: { type: Number, required: true },
  protein: { type: Number, default: 0 },
  carbs: { type: Number, default: 0 },
  fats: { type: Number, default: 0 },
  minutes: { type: Number, default: 0 },
  completed: { type: Boolean, default: false },
  notes: { type: String },
});

const dailyMealSchema = new mongoose.Schema({
  date: { type: Date, required: true },
  breakfast: mealSchema,
  lunch: mealSchema,
  dinner: mealSchema,
  snacks: [mealSchema],
  totalCalories: { type: Number, required: true },
  totalProtein: { type: Number, default: 0 },
  totalCarbs: { type: Number, default: 0 },
  totalFats: { type: Number, default: 0 },
});

const dietSchema = new mongoose.Schema({
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
  preference: {
    type: String,
    enum: ['vegetarian', 'non_vegetarian', 'vegan'],
    required: true,
  },
  budget: {
    type: String,
    enum: ['low', 'medium', 'high'],
    default: 'medium',
  },
  dailyMeals: [dailyMealSchema],
  duration: { type: Number, default: 7 }, // days
  targetCalories: { type: Number, required: true },
  targetProtein: { type: Number, default: 0 },
  targetCarbs: { type: Number, default: 0 },
  targetFats: { type: Number, default: 0 },
  status: {
    type: String,
    enum: ['active', 'completed', 'paused'],
    default: 'active',
  },
  startDate: { type: Date, default: Date.now },
  endDate: { type: Date },
}, {
  timestamps: true,
});

const Diet = mongoose.model('Diet', dietSchema);

export default Diet;






