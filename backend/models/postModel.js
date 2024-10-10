import mongoose from 'mongoose';
const postSchema = new mongoose.Schema(
  {
    caption: { type: String, default: '' },
    image: { type: String, required: true },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    comments: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Comment' }],
    likes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  },
  {
    timestamps: true,
  }
);

const Post = mongoose.model('Post', postSchema);
export default Post;
