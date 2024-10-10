import Conversation from '../models/conversationModel.js';
import { getReciverSocketId, io } from '../socket/socket.js';
import Message from './../models/messageModel.js';
export const sendMessage = async (req, res) => {
  try {
    const { message } = req.body;
    const reciverId = req.params.id;
    const senderId = req.user.userId;
    let conversation = await Conversation.findOne({
      participants: { $all: [senderId, reciverId] },
    });
    if (!conversation) {
      conversation = await Conversation.create({
        participants: [senderId, reciverId],
      });
    }
    const newMessage = await Message.create({
      message,
      senderId,
      receiverId: reciverId,
    });
    if (newMessage) {
      conversation.messages.push(newMessage._id);
      await conversation.save();
    }
    await newMessage.save();
    const reciverSocketId = getReciverSocketId(reciverId);
    if (reciverSocketId) {
      io.to(reciverSocketId).emit('getMessage', newMessage);
    }
    res.status(201).json({
      message: 'Message sent successfully!',
      success: true,
      newMessage,
    });
  } catch (error) {
    console.log(error.message);
  }
};

export const getMessages = async (req, res) => {
  try {
    const senderId = req.user.userId;
    const reciverId = req.params.id;
    if (!senderId || !reciverId) {
      return res.status(400).json({
        success: false,
        message: 'Sender ID and Receiver ID must be provided.',
      });
    }

    const conversation = await Conversation.findOne({
      participants: { $all: [senderId, reciverId] },
    }).populate('messages');
    if (!conversation) {
      res.status(200).json({
        success: true,
        messages: [],
      });
    }
    console.log(conversation, 'conversation');
    console.log(conversation?.messages, 'messages');
    res.status(200).json({
      message: 'Messages fetched successfully!',
      success: true,
      messages: conversation?.messages,
    });
  } catch (error) {
    console.log(error.message);
  }
};
