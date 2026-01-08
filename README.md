
# GYMVERSE - AI-Powered Fitness Application

A full-stack MERN application that acts as an AI-powered virtual gym assistant with role-based access, workout/diet planning, gamification, and community features.

## Tech Stack

- **Frontend*: React.js + Vite + Tailwind CSS
- **Backend**: Node.js + Express.js
- **Database**: MongoDB with Mongoose
- **Authentication**: JWT (Access + Refresh Tokens)
- **AI**: OpenAI API for chatbot
- **Architecture**: MVC pattern

## Features

- 🤖 AI-Powered Chatbot (Virtual Gym Trainer)
- 👥 Role-Based Access (Member/Trainer/Admin)
- 💪 Smart Workout Planner
- 🥗 AI Diet Planner
- 🎮 Gamification System (Points, Badges, Leaderboard)
- 👥 Community Feed
- 📊 Analytics & Progress Tracking
- 🌙 Dark/Light Mode
- 📱 Fully Responsive

## Setup Instructions

### Prerequisites

- Node.js (v18 or higher)
- MongoDB (local or Atlas)
- OpenAI API Key
- Cloudinary Account (for image uploads)

### Backend Setup

1. Navigate to backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Create `.env` file from `.env.example`:
```bash
cp .env.example .env
```

4. Update `.env` with your credentials:
   - MongoDB URI
   - JWT secrets
   - OpenAI API key
   - Cloudinary credentials
   - Email configuration

5. Start the server:
```bash
npm run dev
```

Backend will run on `http://localhost:5000`

### Frontend Setup

1. Navigate to frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Create `.env` file:
```bash
cp .env.example .env
```

4. Update `.env` with API URL (default: `http://localhost:5000/api`)

5. Start the development server:
```bash
npm run dev
```

Frontend will run on `http://localhost:3000`

## User Roles

1. **Member**: Access to workouts, diet plans, chatbot, community, gamification
2. **Trainer**: Manage members, assign workouts, view progress, schedule sessions
3. **Admin**: Full system access, user management, analytics, content management

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login
- `POST /api/auth/refresh` - Refresh access token
- `POST /api/auth/forgot-password` - Request password reset
- `POST /api/auth/reset-password` - Reset password

### Users
- `GET /api/users/profile` - Get user profile
- `PUT /api/users/profile` - Update profile
- `GET /api/users/stats` - Get user statistics

### Workouts
- `POST /api/workouts/generate` - Generate workout plan
- `GET /api/workouts` - Get user workouts
- `PUT /api/workouts/:id` - Update workout
- `POST /api/workouts/:id/complete` - Mark workout as complete

### Diets
- `POST /api/diets/generate` - Generate diet plan
- `GET /api/diets` - Get user diets
- `PUT /api/diets/:id` - Update diet

### Chatbot
- `POST /api/chatbot/chat` - Send message to AI
- `GET /api/chatbot/history` - Get chat history

### Community
- `GET /api/community/posts` - Get all posts
- `POST /api/community/posts` - Create post
- `POST /api/community/posts/:id/like` - Like post
- `POST /api/community/posts/:id/comment` - Comment on post

### Gamification
- `GET /api/gamification/points` - Get user points
- `GET /api/gamification/leaderboard` - Get leaderboard
- `GET /api/gamification/badges` - Get badges

## Project Structure

```
gymverse/
├── backend/          # Express.js backend
│   ├── src/
│   │   ├── config/   # Database, Cloudinary config
│   │   ├── controllers/
│   │   ├── models/
│   │   ├── routes/
│   │   ├── middleware/
│   │   ├── services/
│   │   └── utils/
│   └── package.json
├── frontend/         # React.js frontend
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── context/
│   │   ├── hooks/
│   │   └── utils/
│   └── package.json
└── README.md
```

## License

ISC


