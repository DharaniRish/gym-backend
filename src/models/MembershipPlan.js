import mongoose from 'mongoose';

const membershipPlanSchema = new mongoose.Schema({
    trainer: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        // optional: system or trainer who created the plan
        required: false,
    },
    name: {
        type: String,
        required: true,
        trim: true,
    },
    price: {
        type: Number,
        required: true,
    },
    duration: {
        type: Number, // in months
        required: true,
        default: 1,
    },
    features: [{
        type: String,
    }],
    permissions: {
        canGenerateWorkouts: {
            type: Boolean,
            default: false,
        },
        canGenerateDiets: {
            type: Boolean,
            default: false,
        },
        maxWorkoutsPerMonth: {
            type: Number,
            default: 0,
        },
        maxDietsPerMonth: {
            type: Number,
            default: 0,
        },
        prioritySupport: {
            type: Boolean,
            default: false,
        },
    },
    isActive: {
        type: Boolean,
        default: true,
    }
}, {
    timestamps: true,
});

const MembershipPlan = mongoose.model('MembershipPlan', membershipPlanSchema);

export default MembershipPlan;
