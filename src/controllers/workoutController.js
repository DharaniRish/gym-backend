import Workout from '../models/Workout.js';
import { generateWorkoutPlan } from '../services/workoutGenerator.js';
import Points from '../models/Points.js';
import User from '../models/User.js';

// @desc    Generate workout plan
// @route   POST /api/workouts/generate
// @access  Private
export const generateWorkout = async (req, res) => {
  try {
    const { goal, daysPerWeek, height, weight, age } = req.body;
    const userId = req.user.id;

    // Get user profile if not provided
    const user = await User.findById(userId);
    const userHeight = height || user.profile?.height;
    const userWeight = weight || user.profile?.weight;
    const userAge = age || user.profile?.age;

    if (!userHeight || !userWeight || !userAge) {
      return res.status(400).json({
        message: 'Please provide height, weight, and age in profile or request'
      });
    }

    // Generate workout plan
    const workoutData = generateWorkoutPlan(goal, daysPerWeek, userHeight, userWeight, userAge);

    // Create workout
    const workout = await Workout.create({
      user: userId,
      goal,
      weeklySplit: workoutData.weeklySplit,
      daysPerWeek,
      workoutDays: workoutData.workoutDays,
    });

    res.status(201).json({
      message: 'Workout plan generated successfully',
      workout,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get user workouts
// @route   GET /api/workouts
// @access  Private
export const getWorkouts = async (req, res) => {
  try {
    const userId = req.user.id;
    const workouts = await Workout.find({ user: userId })
      .sort({ createdAt: -1 });

    res.json(workouts);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get single workout
// @route   GET /api/workouts/:id
// @access  Private
export const getWorkout = async (req, res) => {
  try {
    const workout = await Workout.findOne({
      _id: req.params.id,
      user: req.user.id,
    });

    if (!workout) {
      return res.status(404).json({ message: 'Workout not found' });
    }

    res.json(workout);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update workout
// @route   PUT /api/workouts/:id
// @access  Private
export const updateWorkout = async (req, res) => {
  try {
    const workout = await Workout.findOne({
      _id: req.params.id,
      user: req.user.id,
    });

    if (!workout) {
      return res.status(404).json({ message: 'Workout not found' });
    }

    // Allow updating workout days and exercises
    if (req.body.workoutDays) {
      workout.workoutDays = req.body.workoutDays;
    }
    if (req.body.status) {
      workout.status = req.body.status;
    }

    await workout.save();

    res.json({
      message: 'Workout updated successfully',
      workout,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update workout session
// @route   PUT /api/workouts/:id/session
// @access  Private
export const updateSession = async (req, res) => {
  try {
    const { day, exercisesCompleted } = req.body;

    // Find workout with strict user check
    const workout = await Workout.findOne({
      _id: req.params.id,
      user: req.user.id,
    });

    if (!workout) {
      return res.status(404).json({ message: 'Workout not found' });
    }

    // Initialize activeSession if it doesn't exist or is for a different day
    if (!workout.activeSession || workout.activeSession.day !== day) {
      workout.activeSession = {
        day,
        startedAt: new Date(),
        exercisesCompleted: []
      };
    }

    // Update completed exercises
    // If exercisesCompleted is provided as a complete list, replace it.
    // If we want incremental updates, we'd need a different logic, but full list replacement is safer for sync.
    if (exercisesCompleted) {
      workout.activeSession.exercisesCompleted = exercisesCompleted;
    }

    await workout.save();

    res.json({
      message: 'Session updated',
      activeSession: workout.activeSession
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Complete workout
// @route   POST /api/workouts/:id/complete
// @access  Private
// Modified to use activeSession if available, or fallback to request body
export const completeWorkout = async (req, res) => {
  try {
    const workout = await Workout.findOne({
      _id: req.params.id,
      user: req.user.id,
    });

    if (!workout) {
      return res.status(404).json({ message: 'Workout not found' });
    }

    // Determine completion data source: activeSession or request body
    let dayCompleted, exercisesCompleted;

    if (workout.activeSession && workout.activeSession.day) {
      dayCompleted = workout.activeSession.day;
      exercisesCompleted = workout.activeSession.exercisesCompleted;

      // Clear active session
      workout.activeSession = undefined;
    } else {
      // Fallback or explicit completion without session
      dayCompleted = req.body.day;
      exercisesCompleted = req.body.exercisesCompleted || [];
    }

    // Add to completed workouts
    workout.completedWorkouts.push({
      date: new Date(),
      day: dayCompleted,
      exercisesCompleted: exercisesCompleted,
    });

    await workout.save();

    // Award points
    const user = await User.findById(req.user.id);
    user.gamification.points += 50;

    // Check for level up
    const newLevel = Math.floor(user.gamification.points / 500) + 1;
    if (newLevel > user.gamification.level) {
      user.gamification.level = newLevel;
    }

    // UPDATE STREAK LOGIC
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    let lastWorkout = null;
    if (user.gamification.lastWorkoutDate) {
      lastWorkout = new Date(user.gamification.lastWorkoutDate);
      lastWorkout.setHours(0, 0, 0, 0);
    }

    if (!lastWorkout) {
      // First workout ever
      user.gamification.attendanceStreak = 1;
    } else {
      const diffTime = Math.abs(today - lastWorkout);
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

      if (diffDays === 1) {
        // Consecutive day
        user.gamification.attendanceStreak += 1;
      } else if (diffDays > 1) {
        // Missed a day or more, reset (unless it's 0 which means same day)
        user.gamification.attendanceStreak = 1;
      }
      // If diffDays === 0, do nothing (same day workout)
    }

    user.gamification.lastWorkoutDate = new Date();

    await user.save();

    // Record points
    await Points.create({
      user: req.user.id,
      points: 50,
      source: 'workout_completion',
      description: 'Completed workout',
      relatedId: workout._id,
    });

    res.json({
      message: 'Workout completed successfully',
      pointsAwarded: 50,
      newLevel: user.gamification.level,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// @desc    Delete workout
// @route   DELETE /api/workouts/:id
// @access  Private
export const deleteWorkout = async (req, res) => {
  try {
    const workout = await Workout.findOneAndDelete({
      _id: req.params.id,
      user: req.user.id,
    });

    if (!workout) {
      return res.status(404).json({ message: 'Workout not found' });
    }

    res.json({ message: 'Workout deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};






