const Message=require('../Models/Message')
const Conversation=require('../Models/Conversation');



exports.sendMessage= async (req,res)=>{
    const { conversationId, senderId, content } = req.body;

    try {
    const message = new Message({ conversationId, senderId, content });
    if(content==""){
      return res.json("Content field is required")
    }

    // Enregistrer le message
    await message.save();

    // Mettre à jour le dernier message de la conversation
    await Conversation.findByIdAndUpdate(conversationId, {
      lastMessage: content,
      updatedAt: Date.now(),
    });

    res.status(201).json(message);

    }
    catch (error) {
    console.error('Error sending message:', error);
    res.status(500).json({ message: 'Internal server error' });
  }

}

exports.getMessages= async (req,res)=>{
    const { conversationId } = req.params;
    try{
        const messages = await Message.find({ conversationId }).sort({ createdAt: 1 });
        res.json(messages)
    }
    catch(e){
        console.error(e.message);
        res.status(500).json({message:e.message});
    }
}


exports.deleteMessage = async (req, res) => {
  const { messageId } = req.params;
  const { userId } = req.params;

  try {
    const message = await Message.findById(messageId);
    if (!message) {
      return res.status(404).json({ message: "Message not found" });
    }

    if (message.senderId.toString() === userId) {
      console.log('Sender ID matches User ID:', userId);
      // Delete the message
      await Message.findByIdAndDelete(messageId);

      // Update the conversation's last message
      const conversation = await Conversation.findById(message.conversationId);
      if (conversation.lastMessage === message.content) {
        const lastmessage = await Message.findOne({
          conversationId: message.conversationId,
          deletedBy: { $ne: userId }, // Exclude messages deleted for this user
        }).sort({ createdAt: -1 });

        conversation.lastMessage = lastmessage ? lastmessage.content : null;
        await conversation.save();
      }

      return res.json({ message: "Message deleted successfully" });
    } else {
      // Mark the message as deleted for this user
      if (!message.deletedBy.includes(userId)) {
        message.deletedBy.push(userId);
        await message.save();
      }

      return res.json({ message: "Message hidden for user", message });
    }
  } catch (e) {
    console.error(e.message);
    res.status(500).json({ message: e.message });
  }
};

