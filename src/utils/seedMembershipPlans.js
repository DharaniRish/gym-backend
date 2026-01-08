import MembershipPlan from '../models/MembershipPlan.js';

const membershipPlans = [
  {
    name: 'Free',
    price: 0,
    duration: 1, // Unlimited, but with restrictions
    features: [
      'Basic dashboard access',
      'Community forum',
      'Limited exercise library'
    ],
    permissions: {
      canGenerateWorkouts: false,
      canGenerateDiets: false,
      maxWorkoutsPerMonth: 0,
      maxDietsPerMonth: 0,
      prioritySupport: false,
    },
    isActive: true,
  },
  {
    name: 'Basic',
    price: 9.99,
    duration: 1,
    features: [
      'AI workout generation (5/month)',
      'AI diet planning (3/month)',
      'Progress tracking',
      'Basic support'
    ],
    permissions: {
      canGenerateWorkouts: true,
      canGenerateDiets: true,
      maxWorkoutsPerMonth: 5,
      maxDietsPerMonth: 3,
      prioritySupport: false,
    },
    isActive: true,
  },
  {
    name: 'Premium',
    price: 19.99,
    duration: 1,
    features: [
      'Unlimited AI workout generation',
      'Unlimited AI diet planning',
      'Advanced analytics',
      'Priority support',
      'Custom meal plans',
      'Trainer consultations'
    ],
    permissions: {
      canGenerateWorkouts: true,
      canGenerateDiets: true,
      maxWorkoutsPerMonth: 999, // Effectively unlimited
      maxDietsPerMonth: 999,
      prioritySupport: true,
    },
    isActive: true,
  },
  {
    name: 'Pro',
    price: 29.99,
    duration: 1,
    features: [
      'Everything in Premium',
      'Personal trainer assignment',
      'Video workout demos',
      'Nutritionist consultations',
      'Custom supplement recommendations',
      '24/7 support'
    ],
    permissions: {
      canGenerateWorkouts: true,
      canGenerateDiets: true,
      maxWorkoutsPerMonth: 999,
      maxDietsPerMonth: 999,
      prioritySupport: true,
    },
    isActive: true,
  }
];

export const seedMembershipPlans = async () => {
  try {
    // Clear existing plans
    await MembershipPlan.deleteMany({});

    // Insert new plans
    const plans = await MembershipPlan.insertMany(membershipPlans);
    console.log('Membership plans seeded successfully:', plans.length);
    return plans;
  } catch (error) {
    console.error('Error seeding membership plans:', error);
    throw error;
  }
};

export default seedMembershipPlans;
