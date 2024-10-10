import sharp from 'sharp';
import Post from '../models/postModel.js';
import cloudinary from '../utilities/cloudinarySetup.js';
import Comment from '../models/commentModel.js';
import User from '../models/userModel.js';
import { getReciverSocketId, io } from '../socket/socket.js';
export const createPost = async (req, res) => {
  try {
    const { caption } = req.body;
    const image = req.file;
    const author = req.user.userId;
    if (!image) {
      return res
        .status(401)
        .json({ message: 'Image are required!', success: false });
    }
    // console.log(image, 'img');
    const optimizedImage = await sharp(image.buffer)
      .resize(500, 500, { fit: 'inside' })
      .toFormat('jpeg', { quality: 80 })
      .toBuffer();
    const imageUri = `data:image/jpeg;base64,${optimizedImage.toString(
      'base64'
    )}`;
    const cloudenaryResponse = await cloudinary.uploader.upload(imageUri);
    const newPost = await Post.create({
      caption,
      image: cloudenaryResponse.secure_url,
      author,
    });
    const user = await User.findById(author);
    if (user) {
      user.posts.push(newPost._id);
      await user.save();
    }
    await newPost.populate({
      path: 'author',
      select: '-password',
    });
    res.status(201).json({
      message: 'Post created successfully!',
      success: true,
      post: newPost,
    });
  } catch (error) {
    console.log(error);
  }
};

export const getAllPosts = async (_, res) => {
  try {
    const posts = await Post.find()
      .sort({ createdAt: -1 })
      .populate({
        path: 'author',
        select: 'username profilePic',
      })
      .populate({
        path: 'comments',
        select: 'text author',
        sort: { createdAt: -1 },
        populate: {
          path: 'author',
          select: 'username profilePic',
        },
      });
    res.status(200).json({
      message: 'Posts fetched successfully!',
      success: true,
      posts,
    });
  } catch (error) {
    console.log(error.message);
  }
};

export const getUserPosts = async (req, res) => {
  try {
    const posts = await Post.find({ author: req.params.id })
      .sort({ createdAt: -1 })
      .populate({
        path: 'author',
        select: 'username profilePic',
      })
      .populate({
        path: 'comments', // Populate comments directly
        select: 'text author',
        sort: { createdAt: -1 },
        populate: {
          path: 'author',
          select: 'username profilePic',
        },
      });

    res.status(200).json({
      message: 'User Posts fetched successfully!',
      success: true,
      posts,
    });
  } catch (error) {
    console.log(error.message);
  }
};

export const likeDislikePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) {
      return res
        .status(404)
        .json({ message: 'Post does not exist!', success: false });
    }
    const user = await User.findById(req.user.userId);
    if (!user) {
      return res
        .status(404)
        .json({ message: 'User does not exist!', success: false });
    }
    if (post.likes.includes(req.user.userId)) {
      const index = post.likes.indexOf(req.user.userId);
      post.likes.splice(index, 1);
      await post.save();
      //leter include socket io here to send notification
      const user = await User.findById(req.user.userId).select('-password');
      if (post.author.toString() !== req.user.userId) {
        const notification = {
          senderId: req.user.userId,
          postId: req.params.id,
          userDetails: user,
          message: 'disliked your post',
        };
        const postOwnerId = getReciverSocketId(post.author.toString());
        io.to(postOwnerId).emit('notification', notification);
      }
      res.status(200).json({
        message: 'Post disliked successfully!',
        success: true,
        post,
      });
    } else {
      post.likes.push(req.user.userId);
      await post.save();
      //leter include socket io here to send notification
      const user = await User.findById(req.user.userId).select('-password');
      if (post.author.toString() !== req.user.userId) {
        const notification = {
          senderId: req.user.userId,
          postId: req.params.id,
          userDetails: user,
          message: 'liked your post',
        };
        const postOwnerId = getReciverSocketId(post.author.toString());
        io.to(postOwnerId).emit('notification', notification);
      }
      res.status(200).json({
        message: 'Post liked successfully!',
        success: true,
        post,
      });
    }
  } catch (error) {
    console.log(error.message);
  }
};

export const addComment = async (req, res) => {
  try {
    const { text } = req.body;
    if (!text) {
      return res
        .status(404)
        .json({ message: 'Comment text is required!', success: false });
    }

    const post = await Post.findById(req.params.id);
    if (!post) {
      return res
        .status(404)
        .json({ message: 'Post does not exist!', success: false });
    }

    const user = await User.findById(req.user.userId);
    if (!user) {
      return res
        .status(404)
        .json({ message: 'User does not exist!', success: false });
    }

    const comment = await Comment.create({
      text,
      author: req.user.userId,
      post: req.params.id,
    });

    post.comments.push(comment._id);
    await post.save();
    const populatedComment = await Comment.findById(comment._id).populate({
      path: 'author',
      select: 'username profilePic',
    });

    res.status(201).json({
      message: 'Comment added successfully!',
      success: true,
      comment: populatedComment,
    });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ message: 'Server error', success: false });
  }
};

export const getCommentsOfPost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) {
      return res
        .status(404)
        .json({ message: 'Post does not exist!', success: false });
    }
    const comments = await Comment.find({ post: req.params.id })
      .populate({
        path: 'author',
        select: 'username profilePic',
      })
      .sort({ createdAt: -1 });
    res.status(200).json({
      message: 'Comments fetched successfully!',
      success: true,
      comments,
    });
  } catch (error) {
    console.log(error.message);
  }
};

export const deletePost = async (req, res) => {
  try {
    console.log(req.params.id);
    const post = await Post.findById(req.params.id);
    if (!post) {
      return res
        .status(404)
        .json({ message: 'Post does not exist!', success: false });
    }
    if (post.author.toString() !== req.user.userId) {
      return res
        .status(401)
        .json({ message: 'Unauthorized access!', success: false });
    }
    await Post.findByIdAndDelete(req.params.id);
    await User.updateOne(
      { _id: req.user.userId },
      { $pull: { posts: req.params.id } }
    );
    await Comment.deleteMany({ post: req.params.id });
    res.status(200).json({
      message: 'Post deleted successfully!',
      success: true,
    });
  } catch (error) {
    console.log(error.message);
  }
};

export const bookmarkPost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) {
      return res
        .status(404)
        .json({ message: 'Post does not exist!', success: false });
    }
    const user = await User.findById(req.user.userId);
    if (!user) {
      return res
        .status(404)
        .json({ message: 'User does not exist!', success: false });
    }
    if (user.bookmarks.includes(req.params.id)) {
      const index = user.bookmarks.indexOf(req.params.id);
      console.log(index, 'index');
      user.bookmarks.splice(index, 1);
      await user.save();
      res.status(200).json({
        message: 'Post unbookmarked successfully!',
        success: true,
        post,
        type: 'unbookmark',
      });
    } else {
      user.bookmarks.push(req.params.id);
      await user.save();
      res.status(200).json({
        message: 'Post bookmarked successfully!',
        success: true,
        post,
        type: 'bookmark',
      });
    }
  } catch (error) {
    console.log(error.message);
  }
};

export const updatePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) {
      return res
        .status(404)
        .json({ message: 'Post does not exist!', success: false });
    }
    if (req.file) {
      const optimizedImage = await sharp(req.file.buffer)
        .resize({ width: 500, height: 500 }, { fit: 'inside' })
        .toFormat('jpeg', { quality: 80 })
        .toBuffer();
      const imageUri = `data:image/jpeg;base64,${optimizedImage.toString(
        'base64'
      )}`;
      const cloudinaryResponse = await cloudinary.uploader.upload(imageUri, {
        public_id: post.image.split('/').pop().split('.')[0],
        overwrite: true,
      });
      post.image = cloudinaryResponse.secure_url;
    }
    if (req.body.caption) {
      post.caption = req.body.caption;
    }
    await post.save();
    res.status(200).json({
      message: 'Post updated successfully!',
      success: true,
      post,
    });
  } catch (error) {
    console.log(error.message);
  }
};

export const getAllBookmarks = async (req, res) => {
  try {
    const user = await User.findById(req.user.userId);

    if (!user) {
      return res
        .status(404)
        .json({ message: 'User does not exist!', success: false });
    }
    if (user.bookmarks.length === 0) {
      return res.status(200).json({
        message: 'No bookmarks found!',
        success: true,
        posts: [],
      });
    }
    const posts = await Post.find({ _id: { $in: user.bookmarks } });

    res.status(200).json({
      message: 'Posts fetched successfully!',
      success: true,
      posts,
    });
  } catch (error) {
    console.log(error.message);
  }
};
