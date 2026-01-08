import MembershipPlan from '../models/MembershipPlan.js';
import User from '../models/User.js';
import Exercise from '../models/Exercise.js';
import { sendProgressReportEmail } from '../services/emailService.js';
import fs from 'fs';
import path from 'path';

// @desc    Create new membership plan
// @route   POST /api/trainer/plans
export const createPlan = async (req, res) => {
  try {
    const { name, price, duration, features } = req.body;

    const plan = await MembershipPlan.create({
      trainer: req.user.id,
      name,
      price,
      duration,
      features
    });

    res.status(201).json(plan);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get trainer's plans
// @route   GET /api/trainer/plans
export const getMyPlans = async (req, res) => {
  try {
    const plans = await MembershipPlan.find({ trainer: req.user.id });
    res.json(plans);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all available plans (for members)
// @route   GET /api/trainer/plans/all
export const getAllPlans = async (req, res) => {
  try {
    // Only fetch active plans
    const plans = await MembershipPlan.find({ isActive: true }).populate('trainer', 'name');
    res.json(plans);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get members assigned to trainer
// @route   GET /api/trainer/members
export const getTrainerMembers = async (req, res) => {
  try {
    // Members assigned explicitly OR members who bought a plan from this trainer
    // For simplicity in this demo, we'll fetch all members if the user is a trainer, 
    // or filter by some assignment logic.
    // Let's assume for now a "Trainer" can see users who have "membership.planId" belonging to a plan created by this trainer.

    const myPlans = await MembershipPlan.find({ trainer: req.user.id }).select('_id');
    const planIds = myPlans.map(p => p._id);

    const members = await User.find({
      $or: [
        { assignedTrainer: req.user.id },
        { 'membership.planId': { $in: planIds } }
      ]
    }).select('-password');

    res.json(members);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Add Custom Exercise (Media)
// @route   POST /api/trainer/media
export const addCustomExercise = async (req, res) => {
  try {
    const { name, videoUrl, muscleGroup, description, difficulty } = req.body;

    // Check if a file was uploaded or a URL provided
    let finalVideoUrl = videoUrl;
    if (req.file) {
      // For a real production app with Cloudinary (which is in package.json), 
      // we would upload req.file.path to Cloudinary here.
      // For local demo, we'll store the relative path.
      finalVideoUrl = `/uploads/exercises/${req.file.filename}`;
    }

    const exercise = await Exercise.create({
      name,
      videoUrl: finalVideoUrl,
      steps: ["Follow the video instructions."],
      description: description || "Custom trainer exercise",
      muscleGroup: muscleGroup || 'Full Body',
      difficulty: difficulty || 'Beginner',
      creator: req.user.id,
      isCustom: true
    });

    res.status(201).json(exercise);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get trainer's custom exercises
// @route   GET /api/trainer/media
export const getMyExercises = async (req, res) => {
  try {
    const exercises = await Exercise.find({ creator: req.user.id });
    res.json(exercises);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Send email to client
// @route   POST /api/trainer/message
// @desc    Send email to client
// @route   POST /api/trainer/message
export const sendClientMessage = async (req, res) => {
  console.log('➡️ sendClientMessage called');
  try {
    const { userId, message } = req.body;
    console.log('Processing request for userId:', userId);

    const user = await User.findById(userId).select('name email classification gamification membership');
    if (!user) {
      console.log('❌ User not found');
      return res.status(404).json({ message: 'User not found' });
    }

    const stats = {
      plan: user.membership?.planType || 'None',
      streak: user.gamification?.attendanceStreak || 0,
      level: user.gamification?.level || 1
    };

    console.log('📧 Attempting to send email to:', user.email);
    const success = await sendProgressReportEmail(user.email, user.name, stats, message);
    console.log('Email send result:', success);

    if (success) {
      res.json({ message: 'Progress report sent successfully' });
    } else {
      res.status(500).json({ message: 'Failed to send email' });
    }
  } catch (error) {
    console.error('🔥 CRITICAL ERROR in sendClientMessage:', error);
    res.status(500).json({ message: error.message, stack: error.stack });
  }
};
// @desc    Delete membership plan
// @route   DELETE /api/trainer/plans/:id
export const deletePlan = async (req, res) => {
  try {
    const plan = await MembershipPlan.findOne({
      _id: req.params.id,
      trainer: req.user.id
    });

    if (!plan) {
      return res.status(404).json({ message: 'Plan not found or unauthorized' });
    }

    // Check if any users are currently subscribed to this plan
    const subscribedUsers = await User.countDocuments({ 'membership.planId': req.params.id });
    if (subscribedUsers > 0) {
      // Instead of deleting, just deactivate it so current members aren't affected
      plan.isActive = false;
      await plan.save();
      return res.json({
        message: 'Plan has active subscribers. It has been deactivated instead of deleted.',
        deactivated: true
      });
    }

    await MembershipPlan.findByIdAndDelete(req.params.id);
    res.json({ message: 'Plan deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete Custom Exercise
// @route   DELETE /api/trainer/media/:id
export const deleteCustomExercise = async (req, res) => {
  try {
    const exercise = await Exercise.findOne({
      _id: req.params.id,
      creator: req.user.id
    });

    if (!exercise) {
      return res.status(404).json({ message: 'Exercise not found or unauthorized' });
    }

    // If it's a local file, delete it from the disk
    if (exercise.videoUrl && exercise.videoUrl.startsWith('/uploads/')) {
      const filePath = path.join(process.cwd(), exercise.videoUrl);
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    }

    await Exercise.findByIdAndDelete(req.params.id);
    res.json({ message: 'Exercise deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
