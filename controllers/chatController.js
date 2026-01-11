const Chat = require("../models/Chat");
const User = require("../models/User");

// @desc    Create or create Chat
// @route   POST /api/chat
// @access  Private
const accessChat = async (req, res) => {
  const { userId } = req.body;

  if (!userId) {
    console.log("UserId param not sent with request");
    return res.sendStatus(400);
  }

  // Check if chat exists with these two participants
  var isChat = await Chat.find({
    participants: { $all: [req.user._id, userId] },
  })
    .populate("participants", "-password")
    .populate("messages.sender", "name email avatar");

  if (isChat.length > 0) {
    res.send(isChat[0]);
  } else {
    var chatData = {
      participants: [req.user._id, userId],
      messages: [],
      lastMessage: "",
      updatedAt: Date.now(),
    };

    try {
      const createdChat = await Chat.create(chatData);
      const FullChat = await Chat.findOne({ _id: createdChat._id }).populate(
        "participants",
        "-password"
      );
      res.status(200).json(FullChat);
    } catch (error) {
      res.status(400);
      throw new Error(error.message);
    }
  }
};

// @desc    Fetch all chats for a user
// @route   GET /api/chat
// @access  Private
const fetchChats = async (req, res) => {
  try {
    Chat.find({ participants: { $elemMatch: { $eq: req.user._id } } })
      .populate("participants", "-password")
      .populate("messages.sender", "name email avatar")
      .sort({ updatedAt: -1 })
      .then((results) => {
        res.status(200).send(results);
      });
  } catch (error) {
    res.status(400);
    throw new Error(error.message);
  }
};

// @desc    Send New Message
// @route   POST /api/chat/message
// @access  Private
const sendMessage = async (req, res) => {
  const { chatId, content } = req.body;

  if (!content || !chatId) {
    console.log("Invalid data passed into request");
    return res.sendStatus(400);
  }

  try {
    const newMessage = {
      sender: req.user._id,
      text: content,
      read: false,
    };

    // Push message to chat and update lastMessage
    const updatedChat = await Chat.findByIdAndUpdate(
      chatId,
      {
        $push: { messages: newMessage },
        $set: { lastMessage: content, lastMessageTime: Date.now() },
      },
      { new: true }
    )
      .populate("participants", "-password")
      .populate("messages.sender", "name email avatar");

    if (!updatedChat) {
      res.status(404);
      throw new Error("Chat not found");
    }

    // Return the last message added
    res.json(updatedChat.messages[updatedChat.messages.length - 1]);
  } catch (error) {
    res.status(400);
    throw new Error(error.message);
  }
};

module.exports = {
  accessChat,
  fetchChats,
  sendMessage,
};
