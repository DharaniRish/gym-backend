import Stripe from 'stripe';
import Membership from '../models/Membership.js';
import MembershipPlan from '../models/MembershipPlan.js';
import User from '../models/User.js';

let stripe;
if (process.env.STRIPE_SECRET_KEY) {
  stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
} else {
  console.warn('⚠️ STRIPE_SECRET_KEY not found. Stripe features will be limited to mock operations.');
}

export const createPaymentIntent = async (req, res) => {
  try {
    const { planId, isTrial = false } = req.body;
    const userId = req.user.id;

    // Get plan details
    const plan = await MembershipPlan.findById(planId);
    if (!plan) {
      return res.status(404).json({ message: 'Plan not found' });
    }

    // Check if user already has an active membership
    const existingMembership = await Membership.findOne({
      user: userId,
      status: 'active'
    });

    if (existingMembership && !isTrial) {
      return res.status(400).json({
        message: 'User already has an active membership'
      });
    }

    // For trial, create free membership
    if (isTrial) {
      const trialEndDate = new Date();
      trialEndDate.setDate(trialEndDate.getDate() + 7); // 7-day trial

      const membership = new Membership({
        user: userId,
        planType: 'trial',
        startDate: new Date(),
        endDate: trialEndDate,
        amount: 0,
        status: 'active',
        paymentMethod: 'trial',
        transactionId: `TRIAL-${Date.now()}`,
        invoiceNumber: `TRIAL-${Date.now()}`
      });

      await membership.save();

      // Update user
      await User.findByIdAndUpdate(userId, {
        'membership.status': 'active',
        'membership.planId': planId,
        'membership.startDate': new Date(),
        'membership.endDate': trialEndDate,
        'membership.amount': 0,
        'usageStats.lastResetDate': new Date()
      });

      return res.json({
        message: 'Trial activated successfully',
        membership,
        isTrial: true
      });
    }

    // Create payment intent for paid plan
    if (!stripe) {
      return res.status(503).json({
        message: 'Real payment gateway is not available. Please use the simulated checkout.',
        isMockAvailable: true
      });
    }

    const paymentIntent = await stripe.paymentIntents.create({
      amount: plan.price * 100, // Stripe expects amount in cents
      currency: 'usd',
      metadata: {
        userId: userId.toString(),
        planId: planId.toString(),
        planName: plan.name
      }
    });

    res.json({
      clientSecret: paymentIntent.client_secret,
      paymentIntentId: paymentIntent.id
    });
  } catch (error) {
    console.error('Payment intent creation error:', error);
    res.status(500).json({ message: 'Failed to create payment intent' });
  }
};

export const confirmPayment = async (req, res) => {
  try {
    const { paymentIntentId } = req.body;
    const userId = req.user.id;

    // Retrieve payment intent from Stripe
    if (!stripe) {
      return res.status(503).json({ message: 'Real payment gateway is not available' });
    }
    const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);

    if (paymentIntent.status !== 'succeeded') {
      return res.status(400).json({ message: 'Payment not completed' });
    }

    const { planId } = paymentIntent.metadata;

    // Get plan details
    const plan = await MembershipPlan.findById(planId);

    // Create membership
    const startDate = new Date();
    const endDate = new Date();
    endDate.setMonth(endDate.getMonth() + plan.duration);

    const membership = new Membership({
      user: userId,
      planType: plan.name.toLowerCase().replace(' ', '_'),
      startDate,
      endDate,
      amount: plan.price,
      status: 'active',
      paymentMethod: 'stripe',
      transactionId: paymentIntentId,
      invoiceNumber: `INV-${Date.now()}`
    });

    await membership.save();

    // Update user membership status
    await User.findByIdAndUpdate(userId, {
      membership: membership._id
    });

    res.json({
      message: 'Payment successful and membership activated',
      membership
    });
  } catch (error) {
    console.error('Payment confirmation error:', error);
    res.status(500).json({ message: 'Failed to confirm payment' });
  }
};

// @desc    Simulate a payment for a plan
// @route   POST /api/payments/mock-confirm
// @access  Private
export const mockProcessPayment = async (req, res) => {
  try {
    const { planId, cardDetails } = req.body;
    const userId = req.user.id;

    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 2000));

    // Get plan details
    const plan = await MembershipPlan.findById(planId);
    if (!plan) {
      return res.status(404).json({ message: 'Plan not found' });
    }

    // Create membership
    const startDate = new Date();
    const endDate = new Date();
    endDate.setMonth(endDate.getMonth() + (plan.duration || 1));

    const membership = new Membership({
      user: userId,
      planType: plan.name.toLowerCase().replace(' ', '_'),
      startDate,
      endDate,
      amount: plan.price,
      status: 'active',
      paymentMethod: 'credit_card',
      transactionId: `MOCK-TX-${Date.now()}`,
      invoiceNumber: `MOCK-INV-${Date.now()}`
    });

    await membership.save();

    // Update user membership status - populating planId for the frontend
    const user = await User.findById(userId);
    user.membership.planId = plan._id;
    user.membership.planType = 'custom';
    user.membership.amount = plan.price;
    user.membership.status = 'active';
    user.membership.startDate = startDate;
    user.membership.endDate = endDate;

    await user.save();

    const updatedUser = await User.findById(userId)
      .populate('membership.planId')
      .select('-password');

    res.json({
      success: true,
      message: 'Payment simulated and membership activated',
      membership,
      user: updatedUser
    });
  } catch (error) {
    console.error('Mock payment error:', error);
    res.status(500).json({ message: 'Failed to process mock payment' });
  }
};

export const getPaymentHistory = async (req, res) => {
  try {
    const userId = req.user.id;

    const memberships = await Membership.find({ user: userId })
      .sort({ createdAt: -1 });

    res.json(memberships);
  } catch (error) {
    console.error('Get payment history error:', error);
    res.status(500).json({ message: 'Failed to get payment history' });
  }
};
