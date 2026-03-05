import User from '../models/User.js';
import Workout from '../models/Workout.js';
import Diet from '../models/Diet.js';
import Post from '../models/Post.js';
import Membership from '../models/Membership.js';
import Points from '../models/Points.js';

// @desc    Get all users
// @route   GET /api/admin/users
// @access  Private (Admin)
export const getAllUsers = async (req, res) => {
  try {
    const { role, page = 1, limit = 10 } = req.query;
    const query = role ? { role } : {};

    const users = await User.find(query)
      .select('-password -refreshToken')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await User.countDocuments(query);

    res.json({
      users,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get user by ID
// @route   GET /api/admin/users/:id
// @access  Private (Admin)
export const getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id)
      .select('-password -refreshToken')
      .populate('assignedTrainer', 'name email');

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update user
// @route   PUT /api/admin/users/:id
// @access  Private (Admin)
export const updateUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Update allowed fields
    const { name, email, role, profile, membership } = req.body;
    if (name) user.name = name;
    if (email) user.email = email;
    if (role) user.role = role;
    if (profile) {
      Object.assign(user.profile, profile);
      if (profile.height || profile.weight) {
        user.calculateBMI();
      }
    }
    if (membership) {
      Object.assign(user.membership, membership);
    }

    await user.save();

    res.json({
      message: 'User updated successfully',
      user,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete user
// @route   DELETE /api/admin/users/:id
// @access  Private (Admin)
export const deleteUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Delete related data
    await Workout.deleteMany({ user: user._id });
    await Diet.deleteMany({ user: user._id });
    await Post.deleteMany({ user: user._id });
    await Points.deleteMany({ user: user._id });
    await Membership.deleteMany({ user: user._id });

    await User.findByIdAndDelete(user._id);

    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get dashboard statistics
// @route   GET /api/admin/stats
// @access  Private (Admin)
export const getDashboardStats = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalMembers = await User.countDocuments({ role: 'member' });
    const totalTrainers = await User.countDocuments({ role: 'trainer' });
    const totalAdmins = await User.countDocuments({ role: 'admin' });

    const activeMemberships = await Membership.countDocuments({ status: 'active' });
    const totalWorkouts = await Workout.countDocuments();
    const totalDiets = await Diet.countDocuments();
    const totalPosts = await Post.countDocuments();

    // Revenue calculation (from memberships)
    const memberships = await Membership.find({ status: 'active' });
    const totalRevenue = memberships.reduce((sum, m) => sum + (m.amount || 0), 0);

    // Recent activity
    const recentUsers = await User.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .select('name email role createdAt');

    res.json({
      users: {
        total: totalUsers,
        members: totalMembers,
        trainers: totalTrainers,
        admins: totalAdmins,
      },
      memberships: {
        active: activeMemberships,
      },
      content: {
        workouts: totalWorkouts,
        diets: totalDiets,
        posts: totalPosts,
      },
      revenue: {
        total: totalRevenue,
        currency: 'USD',
      },
      recentUsers,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get trainers
// @route   GET /api/admin/trainers
// @access  Private (Admin)
export const getTrainers = async (req, res) => {
  try {
    const trainers = await User.find({ role: 'trainer' })
      .select('name email profile gamification createdAt')
      .populate({
        path: 'assignedTrainer',
        select: 'name',
      })
      .sort({ name: 1 });

    // Get member count for each trainer
    const trainersWithCounts = await Promise.all(
      trainers.map(async (trainer) => {
        const memberCount = await User.countDocuments({ assignedTrainer: trainer._id });
        return {
          ...trainer.toObject(),
          memberCount,
        };
      })
    );

    res.json(trainersWithCounts);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create membership
// @route   POST /api/admin/memberships
// @access  Private (Admin)
export const createMembership = async (req, res) => {
  try {
    const { userId, planType, amount } = req.body;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Calculate end date
    const startDate = new Date();
    const endDate = new Date();
    if (planType === 'monthly') {
      endDate.setMonth(endDate.getMonth() + 1);
    } else if (planType === 'quarterly') {
      endDate.setMonth(endDate.getMonth() + 3);
    } else if (planType === 'yearly') {
      endDate.setFullYear(endDate.getFullYear() + 1);
    }

    // Generate invoice number
    const invoiceNumber = `INV-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;

    const membership = await Membership.create({
      user: userId,
      planType,
      startDate,
      endDate,
      amount,
      status: 'active',
      invoiceNumber,
    });

    // Update user membership
    user.membership = {
      planType,
      startDate,
      endDate,
      status: 'active',
      amount,
    };
    await user.save();

    res.status(201).json({
      message: 'Membership created successfully',
      membership,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

import MembershipPlan from '../models/MembershipPlan.js';

// @desc    Get all membership plans
// @route   GET /api/admin/plans
// @access  Private (Admin)
export const getMembershipPlans = async (req, res) => {
  try {
    const plans = await MembershipPlan.find().sort({ createdAt: -1 });
    res.json(plans);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create a membership plan
// @route   POST /api/admin/plans
// @access  Private (Admin)
export const createMembershipPlan = async (req, res) => {
  try {
    const { name, price, duration, features } = req.body;
    if (!name || !price || !duration) {
      return res.status(400).json({ message: 'Name, price, and duration are required.' });
    }
    const plan = await MembershipPlan.create({ name, price, duration, features: features || [], isActive: true });
    res.status(201).json(plan);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update a membership plan
// @route   PUT /api/admin/plans/:id
// @access  Private (Admin)
export const updateMembershipPlan = async (req, res) => {
  try {
    const plan = await MembershipPlan.findById(req.params.id);
    if (!plan) return res.status(404).json({ message: 'Plan not found' });

    const { name, price, duration, features, isActive } = req.body;
    if (name !== undefined) plan.name = name;
    if (price !== undefined) plan.price = price;
    if (duration !== undefined) plan.duration = duration;
    if (features !== undefined) plan.features = features;
    if (isActive !== undefined) plan.isActive = isActive;

    await plan.save();
    res.json(plan);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete a membership plan
// @route   DELETE /api/admin/plans/:id
// @access  Private (Admin)
export const deleteMembershipPlan = async (req, res) => {
  try {
    const plan = await MembershipPlan.findByIdAndDelete(req.params.id);
    if (!plan) return res.status(404).json({ message: 'Plan not found' });
    res.json({ message: 'Plan deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


