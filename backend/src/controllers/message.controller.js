import Message from "../models/Message.js";
import Conversation from "../models/Conversation.js";

export const sendMessage = async (req, res) => {
  try {
    const { conversationId, content, receiverId } = req.body;
    const myId = req.user.id;

    if (!conversationId || !content || !receiverId) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    if (receiverId === myId) {
      return res.status(400).json({ message: "Invalid receiver" });
    }

    const message = await Message.create({
      conversationId,
      sender: myId,
      receiver: receiverId,
      content,
      messageType: "text",
    });

    await Conversation.findByIdAndUpdate(conversationId, {
      lastMessage: message._id,
    });

    return res.status(201).json(message);
  } catch (error) {
    console.log("Error in sendMessage controller", error);
    return res.status(500).json({ message: "Error in sendMessage controller" });
  }
};

export const getMessages = async (req, res) => {
  try {
    const { conversationId } = req.params;

    if (!conversationId) {
      return res.status(400).json({ message: "Conversation ID required" });
    }

    const messages = await Message.find({ conversationId })
      .sort({ createdAt: 1 }); // oldest → newest

    return res.status(200).json(messages);
  } catch (error) {
    console.log("Error in getMessages controller", error);
    return res.status(500).json({ message: "Error in getMessages controller" });
  }
};

export const deleteMessage = async (req, res) => {
  try {
    const { messageId } = req.params;
    const myId = req.user.id;

    if (!messageId) {
      return res.status(400).json({ message: "Message ID required" });
    }

    const message = await Message.findById(messageId);

    if (!message) {
      return res.status(404).json({ message: "Message not found" });
    }

    if (message.sender.toString() !== myId) {
      return res.status(403).json({ message: "Not allowed to delete this message" });
    }

    await Message.findByIdAndDelete(messageId);

    const conversation = await Conversation.findById(message.conversationId);

    if (
      conversation &&
      conversation.lastMessage?.toString() === messageId
    ) {
      const previousMessage = await Message.findOne({
        conversationId: message.conversationId,
      }).sort({ createdAt: -1 });

      conversation.lastMessage = previousMessage
        ? previousMessage._id
        : null;

      await conversation.save();
    }

    return res.status(200).json({ message: "Message deleted successfully" });
  } catch (error) {
    console.log("Error in deleteMessage controller", error);
    return res.status(500).json({ message: "Error in deleteMessage controller" });
  }
};

