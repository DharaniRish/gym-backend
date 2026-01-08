import User from '../models/User.js';
import MembershipPlan from '../models/MembershipPlan.js';

export const checkWorkoutGenerationLimit = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const user = await User.findById(userId).populate('membership.planId');

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Check if membership is active
    if (user.membership.status !== 'active') {
      return res.status(403).json({
        message: 'Active membership required',
        upgradeRequired: true,
        feature: 'workout_generation'
      });
    }

    // Get plan permissions
    const plan = user.membership.planId;
    if (!plan) {
      return res.status(403).json({
        message: 'Membership plan not found',
        upgradeRequired: true,
        feature: 'workout_generation'
      });
    }

    // Check if user has permission
    if (!plan.permissions.canGenerateWorkouts) {
      return res.status(403).json({
        message: 'Your plan does not include workout generation',
        upgradeRequired: true,
        feature: 'workout_generation'
      });
    }

    // Check monthly limit
    const currentMonth = new Date().getMonth();
    const lastResetMonth = user.usageStats.lastResetDate.getMonth();

    // Reset usage if new month
    if (currentMonth !== lastResetMonth) {
      user.usageStats.workoutsGenerated = 0;
      user.usageStats.lastResetDate = new Date();
      await user.save();
    }

    // Check limit
    if (user.usageStats.workoutsGenerated >= plan.permissions.maxWorkoutsPerMonth) {
      return res.status(403).json({
        message: `Monthly workout limit reached (${plan.permissions.maxWorkoutsPerMonth})`,
        upgradeRequired: true,
        feature: 'workout_generation'
      });
    }

    // Increment usage counter
    user.usageStats.workoutsGenerated += 1;
    await user.save();

    next();
  } catch (error) {
    console.error('Workout limit check error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const checkDietGenerationLimit = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const user = await User.findById(userId).populate('membership.planId');

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Check if membership is active
    if (user.membership.status !== 'active') {
      return res.status(403).json({
        message: 'Active membership required',
        upgradeRequired: true,
        feature: 'diet_generation'
      });
    }

    // Get plan permissions
    const plan = user.membership.planId;
    if (!plan) {
      return res.status(403).json({
        message: 'Membership plan not found',
        upgradeRequired: true,
        feature: 'diet_generation'
      });
    }

    // Check if user has permission
    if (!plan.permissions.canGenerateDiets) {
      return res.status(403).json({
        message: 'Your plan does not include diet generation',
        upgradeRequired: true,
        feature: 'diet_generation'
      });
    }

    // Check monthly limit
    const currentMonth = new Date().getMonth();
    const lastResetMonth = user.usageStats.lastResetDate.getMonth();

    // Reset usage if new month
    if (currentMonth !== lastResetMonth) {
      user.usageStats.dietsGenerated = 0;
      user.usageStats.lastResetDate = new Date();
      await user.save();
    }

    // Check limit
    if (user.usageStats.dietsGenerated >= plan.permissions.maxDietsPerMonth) {
      return res.status(403).json({
        message: `Monthly diet limit reached (${plan.permissions.maxDietsPerMonth})`,
        upgradeRequired: true,
        feature: 'diet_generation'
      });
    }

    // Increment usage counter
    user.usageStats.dietsGenerated += 1;
    await user.save();

    next();
  } catch (error) {
    console.error('Diet limit check error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};
