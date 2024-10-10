import bycrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/userModel.js';
import cloudinary from '../utilities/cloudinarySetup.js';
import fileToDataUri from '../utilities/dataUriChange.js';
import Post from '../models/postModel.js';
import { getReciverSocketId, io } from '../socket/socket.js';
export const register = async (req, res) => {
  try {
    const { username, email, password } = req.body;
    if (!username || !email || !password) {
      return res
        .status(401)
        .json({ message: 'All fields are required!', success: false });
    }
    const existingUser = await User.findOne({ email });
    const existingUser2 = await User.findOne({ username });
    if (existingUser || existingUser2) {
      return res.status(401).json({
        message: 'User already exists!',
        success: false,
      });
    }
    const hashedPassword = await bycrypt.hash(password, 10);
    await User.create({
      username,
      email,
      password: hashedPassword,
    });
    res.status(201).json({
      message: 'User created successfully!',
      success: true,
    });
  } catch (error) {
    console.log(error.message);
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res
        .status(401)
        .json({ message: 'All fields are required!', success: false });
    }
    const existingUser = await User.findOne({ email });
    if (!existingUser) {
      return res.status(401).json({
        message: 'User does not exist!',
        success: false,
      });
    }
    const isMatch = await bycrypt.compare(password, existingUser.password);
    if (!isMatch) {
      return res.status(401).json({
        message: 'Invalid credentials!',
        success: false,
      });
    }
    const token = jwt.sign(
      { userId: existingUser._id },
      process.env.JWT_SECRET,
      {
        expiresIn: '30d',
      }
    );
    const populatedPost = await Promise.all(
      existingUser.posts.map(async (post) => {
        return await Post.findById(post);
      })
    );
    res
      .cookie('token', token, {
        httpOnly: true,
        sameSite: 'strict',
        maxAge: 30 * 24 * 60 * 60 * 1000,
      })
      .status(200)
      .json({
        message: 'User logged in successfully!',
        success: true,
        user: {
          username: existingUser.username,
          email: existingUser.email,
          _id: existingUser._id,
          profilePic: existingUser.profilePic,
          bio: existingUser.bio,
          gender: existingUser.gender,
          bookmarks: existingUser.bookmarks,
          followers: existingUser.followers,
          following: existingUser.following,
          posts: populatedPost,
        },
      });
  } catch (error) {
    console.log(error.message);
  }
};

export const logout = async (_, res) => {
  try {
    res
      .cookie('token', '', {
        maxAge: 0,
      })
      .status(200)
      .json({ message: 'User logged out successfully!', success: true });
  } catch (error) {
    console.log(error.message);
  }
};

export const getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password');
    if (!user) {
      return res
        .status(404)
        .json({ message: 'User not found!', success: false });
    }
    res.status(200).json({
      message: 'User fetched successfully!',
      success: true,
      user,
    });
  } catch (error) {
    console.log(error.message);
  }
};

export const updateUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.userId).select('-password');

    if (!user) {
      return res
        .status(404)
        .json({ message: 'User not found!', success: false });
    }
    const { bio, gender } = req.body;
    const profilePic = req.file;
    console.log(bio, gender, profilePic);
    let profilePicUrl;
    if (profilePic) {
      const fileUrl = fileToDataUri(profilePic);
      profilePicUrl = await cloudinary.uploader.upload(fileUrl);
    }
    if (bio) user.bio = bio;
    if (gender) user.gender = gender;
    if (profilePic) user.profilePic = profilePicUrl.secure_url;

    await user.save();
    res.status(200).json({
      message: 'User updated successfully!',
      success: true,
      user,
    });
  } catch (error) {
    console.log(error.message);
  }
};

export const getSuggestedUsers = async (req, res) => {
  try {
    const users = await User.find({ _id: { $ne: req.user.userId } }).select(
      '-password'
    );
    console.log(users);
    if (!users) {
      return res
        .status(404)
        .json({ message: 'Users not found!', success: false });
    }
    res.status(200).json({
      message: 'Suggested users fetched successfully!',
      success: true,
      users,
    });
  } catch (error) {
    console.log(error.message);
  }
};

export const followUnfollow = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    const loggedUser = await User.findById(req.user.userId);
    if (!user) {
      return res
        .status(404)
        .json({ message: 'User not found!', success: false });
    }
    if (!loggedUser) {
      return res
        .status(404)
        .json({ message: 'User not found!', success: false });
    }
    if (user._id === loggedUser._id) {
      return res.status(401).json({
        message: 'You cannot follow or unfollow yourself!',
        success: false,
      });
    }
    if (loggedUser.following.includes(user._id)) {
      await Promise.all([
        User.updateOne(
          { _id: loggedUser._id },
          { $pull: { following: user._id } }
        ),
        User.updateOne(
          { _id: user._id },
          { $pull: { followers: loggedUser._id } }
        ),
      ]);
      const userDlts = await User.findById(req.user.userId).select('-password');
      const profileId = getReciverSocketId(req.params.id.toString());
      const notification = {
        senderId: req.user.userId,
        userDetails: userDlts,
        message: 'Unfollowed you!',
      };
      io.to(profileId).emit('followNotification', notification);
      res.status(200).json({
        message: 'Unfollowed successfully!',
        success: true,
      });
    } else {
      await Promise.all([
        User.updateOne(
          { _id: loggedUser._id },
          { $push: { following: user._id } }
        ),
        User.updateOne(
          { _id: user._id },
          { $push: { followers: loggedUser._id } }
        ),
      ]);
      const userDlts = await User.findById(req.user.userId).select('-password');
      const profileId = getReciverSocketId(req.params.id.toString());
      const notification = {
        senderId: req.user.userId,
        userDetails: userDlts,
        message: 'Followed you!',
      };
      io.to(profileId).emit('followNotification', notification);
      res.status(200).json({
        message: 'Followed successfully!',
        success: true,
      });
    }
  } catch (error) {
    console.log(error.message);
  }
};
