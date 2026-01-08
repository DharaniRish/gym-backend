import mongoose from 'mongoose';

const commentSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  content: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

const postSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  content: { type: String, required: true },
  images: [{ type: String }],
  type: {
    type: String,
    enum: ['workout', 'transformation', 'motivation', 'question', 'general'],
    default: 'general',
  },
  likes: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  }],
  comments: [commentSchema],
  views: { type: Number, default: 0 },
}, {
  timestamps: true,
});

const Post = mongoose.model('Post', postSchema);

export default Post;






