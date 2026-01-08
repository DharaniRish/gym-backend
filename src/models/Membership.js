import mongoose from 'mongoose';

const membershipSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  planType: {
    type: String,
    enum: ['monthly', 'quarterly', 'yearly'],
    required: true,
  },
  startDate: { type: Date, required: true },
  endDate: { type: Date, required: true },
  amount: { type: Number, required: true },
  status: {
    type: String,
    enum: ['active', 'expired', 'cancelled'],
    default: 'active',
  },
  paymentMethod: { type: String },
  transactionId: { type: String },
  invoiceNumber: { type: String, unique: true },
}, {
  timestamps: true,
});

membershipSchema.index({ user: 1, status: 1 });

const Membership = mongoose.model('Membership', membershipSchema);

export default Membership;






