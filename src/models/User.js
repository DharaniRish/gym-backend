import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please provide a name'],
    trim: true,
  },
  email: {
    type: String,
    required: [true, 'Please provide an email'],
    unique: true,
    lowercase: true,
    trim: true,
  },
  password: {
    type: String,
    required: [true, 'Please provide a password'],
    minlength: 6,
    select: false,
  },
  role: {
    type: String,
    enum: ['member', 'trainer', 'admin'],
    default: 'member',
  },
  profile: {
    height: { type: Number }, // in cm
    weight: { type: Number }, // in kg
    age: { type: Number },
    bmi: { type: Number },
    fitnessGoal: {
      type: String,
      enum: ['fat_loss', 'muscle_gain', 'strength', 'endurance', 'general'],
    },
    profileImage: { type: String },
    bio: { type: String },
  },
  membership: {
    planType: {
      type: String,
      enum: ['monthly', 'quarterly', 'yearly', 'none', 'custom'],
      default: 'none',
    },
    planId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'MembershipPlan',
    },
    startDate: { type: Date },
    endDate: { type: Date },
    status: {
      type: String,
      enum: ['active', 'expired', 'none'],
      default: 'none',
    },
    amount: { type: Number },
  },
  gamification: {
    points: { type: Number, default: 0 },
    level: { type: Number, default: 1 },
    badges: [{ type: String }],
    attendanceStreak: { type: Number, default: 0 },
    lastWorkoutDate: { type: Date },
    lastLoginDate: { type: Date },
  },
  assignedTrainer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  refreshToken: { type: String },
  resetPasswordToken: { type: String },
  resetPasswordExpire: { type: Date },
}, {
  timestamps: true,
});

// Hash password and update level before saving
userSchema.pre('save', async function (next) {
  // Auto-calculate level based on points
  if (this.gamification && this.gamification.points !== undefined) {
    this.gamification.level = Math.floor(this.gamification.points / 500) + 1;
  }

  // Hash password if modified
  if (!this.isModified('password')) {
    return next();
  }

  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Calculate BMI
userSchema.methods.calculateBMI = function () {
  if (this.profile.height && this.profile.weight) {
    const heightInMeters = this.profile.height / 100;
    this.profile.bmi = (this.profile.weight / (heightInMeters * heightInMeters)).toFixed(1);
  }
};

// Compare password
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

const User = mongoose.model('User', userSchema);

export default User;






