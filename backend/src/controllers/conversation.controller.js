import Conversation from "../models/Conversation.js";

export const createConversation = async (req, res) => {
  try {
    const myId = req.user.id;
    const { receiverId } = req.body;

    if (!receiverId || receiverId == myId) {
      return res.status(400).json({ message: "Invalid receiver" })
    }
    let conversation = await Conversation.findOne({ participants: { $all: [myId, receiverId] } })
      .populate("participants", "-password");

    if (conversation) {
      return res.status(200).json(conversation);
    }

    const newConversation = await Conversation.create({ participants: [myId, receiverId] });
    const populatedConversation = await Conversation.findById(newConversation._id)
      .populate("participants", "-password");

    return res.status(201).json(populatedConversation);

  } catch (error) {
    console.log("Error creating conversation", error)
    return res.status(500).json({ message: "Error creating conversation" })
  }
}

export const getConversation = async (req, res) => {
  try {
    const myId = req.user.id;

    const conversations = await Conversation.find({
      participants: myId,
    })
      .populate("participants", "-password")
      .populate("lastMessage")
      .sort({ updatedAt: -1 });

    return res.status(200).json({
      conversations,
      count: conversations.length,
    });
  } catch (error) {
    console.log("Error getting conversation", error);
    return res.status(500).json({ message: "Error getting conversation" });
  }
};


