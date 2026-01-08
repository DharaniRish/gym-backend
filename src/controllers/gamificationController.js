import Points from '../models/Points.js';
import User from '../models/User.js';
import Workout from '../models/Workout.js';
import Post from '../models/Post.js';

// @desc    Get user points
// @route   GET /api/gamification/points
// @access  Private
export const getUserPoints = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    const pointsHistory = await Points.find({ user: req.user.id })
      .sort({ createdAt: -1 })
      .limit(50);

    res.json({
      totalPoints: user.gamification.points,
      level: user.gamification.level,
      badges: user.gamification.badges,
      attendanceStreak: user.gamification.attendanceStreak,
      pointsHistory,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get leaderboard
// @route   GET /api/gamification/leaderboard
// @access  Private
export const getLeaderboard = async (req, res) => {
  try {
    const { period = 'all' } = req.query; // all, weekly, monthly

    let dateFilter = {};
    if (period === 'weekly') {
      const weekAgo = new Date();
      weekAgo.setDate(weekAgo.getDate() - 7);
      dateFilter = { createdAt: { $gte: weekAgo } };
    } else if (period === 'monthly') {
      const monthAgo = new Date();
      monthAgo.setMonth(monthAgo.getMonth() - 1);
      dateFilter = { createdAt: { $gte: monthAgo } };
    }

    // Get users with their points
    const users = await User.find({ role: 'member' })
      .select('name profile.profileImage gamification')
      .sort({ 'gamification.points': -1 })
      .limit(100);

    // If period filter, calculate points from Points collection
    let leaderboard;
    if (period !== 'all') {
      const pointsData = await Points.aggregate([
        { $match: { ...dateFilter } },
        {
          $group: {
            _id: '$user',
            totalPoints: { $sum: '$points' },
          },
        },
        { $sort: { totalPoints: -1 } },
        { $limit: 100 },
      ]);

      const userIds = pointsData.map(p => p._id);
      const usersWithPoints = await User.find({ _id: { $in: userIds } })
        .select('name profile.profileImage gamification');

      leaderboard = usersWithPoints.map(user => {
        const pointsEntry = pointsData.find(p => p._id.toString() === user._id.toString());
        return {
          user: {
            id: user._id,
            name: user.name,
            profileImage: user.profile?.profileImage,
          },
          points: pointsEntry?.totalPoints || 0,
          level: user.gamification.level,
        };
      }).sort((a, b) => b.points - a.points);
    } else {
      leaderboard = users.map((user, index) => ({
        rank: index + 1,
        user: {
          id: user._id,
          name: user.name,
          profileImage: user.profile?.profileImage,
        },
        points: user.gamification?.points || 0,
        level: user.gamification?.level || 1,
        badges: user.gamification?.badges?.length || 0,
      }));
    }

    res.json({
      period,
      leaderboard,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get badges
// @route   GET /api/gamification/badges
// @access  Private
export const getBadges = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);

    // Define available badges
    const availableBadges = [
      { id: 'first_workout', name: 'First Workout', description: 'Complete your first workout' },
      { id: 'week_warrior', name: 'Week Warrior', description: 'Complete 7 workouts' },
      { id: 'month_master', name: 'Month Master', description: 'Complete 30 workouts' },
      { id: 'streak_starter', name: 'Streak Starter', description: 'Maintain a 7-day streak' },
      { id: 'streak_champion', name: 'Streak Champion', description: 'Maintain a 30-day streak' },
      { id: 'level_5', name: 'Level 5', description: 'Reach level 5' },
      { id: 'level_10', name: 'Level 10', description: 'Reach level 10' },
      { id: 'social_butterfly', name: 'Social Butterfly', description: 'Create 10 community posts' },
    ];

    // Check which badges user has earned
    const userBadges = availableBadges.map(badge => ({
      ...badge,
      earned: user.gamification.badges.includes(badge.id),
    }));

    res.json({
      badges: userBadges,
      totalEarned: user.gamification.badges.length,
      totalAvailable: availableBadges.length,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Check and award badges (internal function, can be called after actions)
export const checkAndAwardBadges = async (userId, action) => {
  try {
    const user = await User.findById(userId);
    if (!user) return;

    const workouts = await Workout.find({ user: userId });
    const completedCount = workouts.reduce((sum, w) => sum + w.completedWorkouts.length, 0);
    const posts = await Post.countDocuments({ user: userId });

    const badgesToAward = [];

    // Check various badge conditions
    if (completedCount >= 1 && !user.gamification.badges.includes('first_workout')) {
      badgesToAward.push('first_workout');
    }
    if (completedCount >= 7 && !user.gamification.badges.includes('week_warrior')) {
      badgesToAward.push('week_warrior');
    }
    if (completedCount >= 30 && !user.gamification.badges.includes('month_master')) {
      badgesToAward.push('month_master');
    }
    if (user.gamification.attendanceStreak >= 7 && !user.gamification.badges.includes('streak_starter')) {
      badgesToAward.push('streak_starter');
    }
    if (user.gamification.attendanceStreak >= 30 && !user.gamification.badges.includes('streak_champion')) {
      badgesToAward.push('streak_champion');
    }
    if (user.gamification.level >= 5 && !user.gamification.badges.includes('level_5')) {
      badgesToAward.push('level_5');
    }
    if (user.gamification.level >= 10 && !user.gamification.badges.includes('level_10')) {
      badgesToAward.push('level_10');
    }
    if (posts >= 10 && !user.gamification.badges.includes('social_butterfly')) {
      badgesToAward.push('social_butterfly');
    }

    if (badgesToAward.length > 0) {
      user.gamification.badges.push(...badgesToAward);
      await user.save();

      // Award bonus points for badges
      await Points.create({
        user: userId,
        points: badgesToAward.length * 100,
        source: 'achievement',
        description: `Earned ${badgesToAward.length} badge(s)`,
      });

      user.gamification.points += badgesToAward.length * 100;
      await user.save();
    }

    return badgesToAward;
  } catch (error) {
    console.error('Badge check error:', error);
    return [];
  }
};

