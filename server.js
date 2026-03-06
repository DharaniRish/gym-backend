import dotenv from 'dotenv';
dotenv.config({ path: './.env' });

import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import { fileURLToPath } from 'url';

import connectDB from './src/config/database.js';
import { errorHandler } from './src/middleware/errorHandler.js';
import seedAdmin from './src/scripts/seedAdmin.js';

// Routes
import authRoutes from './src/routes/authRoutes.js';
import userRoutes from './src/routes/userRoutes.js';
import workoutRoutes from './src/routes/workoutRoutes.js';
import dietRoutes from './src/routes/dietRoutes.js';
import chatbotRoutes from './src/routes/chatbotRoutes.js';
import trainerRoutes from './src/routes/trainerRoutes.js';
import adminRoutes from './src/routes/adminRoutes.js';
import communityRoutes from './src/routes/communityRoutes.js';
import gamificationRoutes from './src/routes/gamificationRoutes.js';
import exerciseRoutes from './src/routes/exerciseRoutes.js';
import paymentRoutes from './src/routes/paymentRoutes.js';

// 🔗 Connect to MongoDB then seed default admin
(async () => {
  await connectDB();
  await seedAdmin();
})();

// Seed default membership plan
import MembershipPlan from './src/models/MembershipPlan.js';

(async () => {
  try {
    const count = await MembershipPlan.countDocuments();
    if (count === 0) {
      await MembershipPlan.create({
        name: 'Premium',
        price: 29.99,
        duration: 1,
        features: [
          'Personalized workout plans',
          'Custom diet plans',
          'Priority trainer access',
          'Progress tracking & reports',
        ],
        isActive: true,
      });
      console.log('✅ Default Premium plan created');
    }
  } catch (err) {
    console.error('❌ Membership seed error:', err.message);
  }
})();

const app = express();

/* ======================================================
   ✅ FINAL CORS CONFIG (PATCH SAFE – NO FUTURE ERRORS)
====================================================== */
const allowedOrigins = [
  'http://localhost:3000',
  'http://localhost:3001',
  'http://localhost:5173',
  'https://gymwebsite-fe.vercel.app',
  'https://gym-fe-zeta.vercel.app',
];

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin) return callback(null, true);
      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }
      return callback(new Error('CORS not allowed'));
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: [
      'Content-Type',
      'Authorization',
      'X-Requested-With',
      'Accept',
    ],
  })
);

// ✅ Explicit preflight handler (CRITICAL)
app.options('*', (req, res) => {
  res.header('Access-Control-Allow-Origin', req.headers.origin);
  res.header(
    'Access-Control-Allow-Methods',
    'GET,POST,PUT,PATCH,DELETE,OPTIONS'
  );
  res.header(
    'Access-Control-Allow-Headers',
    'Content-Type, Authorization, X-Requested-With, Accept'
  );
  res.header('Access-Control-Allow-Credentials', 'true');
  res.sendStatus(204);
});

/* ======================================================
   MIDDLEWARE
====================================================== */
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use('/uploads', express.static('uploads'));

/* ======================================================
   ROUTES
====================================================== */
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/workouts', workoutRoutes);
app.use('/api/diets', dietRoutes);
app.use('/api/chatbot', chatbotRoutes);
app.use('/api/trainer', trainerRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/community', communityRoutes);
app.use('/api/gamification', gamificationRoutes);
app.use('/api/exercises', exerciseRoutes);
app.use('/api/payments', paymentRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'GYMVERSE API is running',
    time: new Date().toISOString(),
  });
});

// Error handler (LAST)
app.use(errorHandler);

/* ======================================================
   SERVER START
====================================================== */
const PORT = process.env.PORT || 5000;
const isVercel = process.env.VERCEL === '1';
const isDirectRun = process.argv[1] === fileURLToPath(import.meta.url);

if (!isVercel || isDirectRun) {
  app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
  });
}

export default app;
