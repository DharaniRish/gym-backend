import User from '../models/User.js';
import Workout from '../models/Workout.js';
import Diet from '../models/Diet.js';
import Points from '../models/Points.js';
import MembershipPlan from '../models/MembershipPlan.js';

// @desc    Get user profile
// @route   GET /api/users/profile
// @access  Private
export const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id)
      .populate('assignedTrainer', 'name email profile.profileImage')
      .populate('membership.planId')
      .select('-password -refreshToken');

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update user profile
// @route   PUT /api/users/profile
// @access  Private
export const updateProfile = async (req, res) => {
  try {
    console.log("updateProfile called with:", req.body);
    const { name, height, weight, age, fitnessGoal, bio } = req.body;

    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (name) user.name = name;

    // Ensure profile object exists
    if (!user.profile) user.profile = {};

    if (height !== undefined && height !== '') {
      const parsedHeight = Number(height);
      if (!isNaN(parsedHeight)) user.profile.height = parsedHeight;
    }

    if (weight !== undefined && weight !== '') {
      const parsedWeight = Number(weight);
      if (!isNaN(parsedWeight)) user.profile.weight = parsedWeight;
    }

    if (age !== undefined && age !== '') {
      const parsedAge = Number(age);
      if (!isNaN(parsedAge)) user.profile.age = parsedAge;
    }

    if (fitnessGoal) user.profile.fitnessGoal = fitnessGoal;
    if (bio !== undefined) user.profile.bio = bio;

    // Recalculate BMI if height or weight changed
    if (height !== undefined || weight !== undefined) {
      if (user.calculateBMI) {
        try {
          user.calculateBMI();
        } catch (bmiError) {
          console.error("BMI Calculation failed:", bmiError);
          // Continue without updating BMI
        }
      }
    }

    await user.save();

    res.json({
      message: 'Profile updated successfully',
      user,
    });
  } catch (error) {
    console.error("Profile Update Error (Full Stack):", error);
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get user statistics
// @route   GET /api/users/stats
// @access  Private
export const getUserStats = async (req, res) => {
  try {
    const userId = req.user.id;

    // Get workouts
    const workouts = await Workout.find({ user: userId, status: 'active' });
    const completedWorkouts = await Workout.find({ user: userId, status: 'completed' });

    // Get diets
    const diets = await Diet.find({ user: userId, status: 'active' });

    // Get points history (last 30 days)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    const recentPoints = await Points.find({
      user: userId,
      createdAt: { $gte: thirtyDaysAgo },
    });

    // Calculate fitness score (0-100)
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    let fitnessScore = 0; // Base score

    // Add points based on attendance streak
    fitnessScore += Math.min((user.gamification?.attendanceStreak || 0) * 2, 20);

    // Add points based on completed workouts
    fitnessScore += Math.min((completedWorkouts?.length || 0) * 2, 20);

    // Add points based on level
    fitnessScore += Math.min((user.gamification?.level || 1) * 2, 10);

    fitnessScore = Math.min(fitnessScore, 100);

    // Calculate total calories burned (estimated)
    const estimatedCaloriesPerWorkout = 300;
    const totalCaloriesBurned = (completedWorkouts || []).reduce((sum, workout) => {
      const completedCount = workout.completedWorkouts ? workout.completedWorkouts.length : 0;
      return sum + (completedCount * estimatedCaloriesPerWorkout);
    }, 0);

    res.json({
      fitnessScore: Math.round(fitnessScore),
      totalWorkouts: workouts?.length || 0,
      completedWorkouts: completedWorkouts?.length || 0,
      activeDiets: diets?.length || 0,
      totalPoints: user.gamification?.points || 0,
      level: user.gamification?.level || 1,
      attendanceStreak: user.gamification?.attendanceStreak || 0,
      totalCaloriesBurned,
      recentPoints: recentPoints?.length || 0,
      bmi: user.profile?.bmi || 'N/A',
      weight: user.profile?.weight || 'N/A',
    });
  } catch (error) {
    console.error("Stats Error:", error);
    res.status(500).json({ message: error.message });
  }
};

// @desc    Upload profile image
// @route   POST /api/users/profile-image
// @access  Private
export const uploadProfileImage = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No image file provided' });
    }

    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Upload to Cloudinary
    const { uploadToCloudinary } = await import('../config/cloudinary.js');
    const result = await uploadToCloudinary(req.file.buffer, 'gymverse/profiles');

    user.profile.profileImage = result.secure_url;
    await user.save();

    res.json({
      message: 'Profile image uploaded successfully',
      imageUrl: result.secure_url,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Subscribe to a plan
// @route   POST /api/users/subscribe
// @access  Private
export const subscribeToPlan = async (req, res) => {
  try {
    const { planId } = req.body;
    const plan = await MembershipPlan.findById(planId);

    if (!plan) {
      return res.status(404).json({ message: 'Plan not found' });
    }

    const user = await User.findById(req.user.id);

    user.membership.planId = plan._id;
    user.membership.planType = 'custom';
    user.membership.amount = plan.price;
    user.membership.status = 'active';
    user.membership.startDate = new Date();

    // Expiration date
    const endDate = new Date();
    endDate.setMonth(endDate.getMonth() + (plan.duration || 1));
    user.membership.endDate = endDate;

    await user.save();

    res.json({ message: `Subscribed to ${plan.name}`, user });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Cancel plan
// @route   POST /api/users/cancel-plan
// @access  Private
export const cancelPlan = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    user.membership = {
      planType: 'none',
      status: 'none',
      amount: 0
    };

    await user.save();

    res.json({ message: 'Plan cancelled successfully', user });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
