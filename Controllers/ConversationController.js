const Conversation=require("../Models/Conversation");
const Message = require("../Models/Message");


exports.createConversation=async (req,res)=>{
    try{
        const {userId}=req.params;
        const {senderId,recipientId }=req.body;
        // Check if the conversation already exists between these two users
        let conversation = await Conversation.findOne({
            participants: { $all: [senderId, recipientId] }
          });
        // if the user want to join the conversation again
        if (conversation) {
            // Ensure the deletedBy field exists before trying to access it
            if ( conversation.deletedBy.includes(userId)) {
                await Conversation.updateOne(
                    { _id: conversation._id },
                    { $pull: { deletedBy: userId } } // Remove the userId from deletedBy array
                  );
            }
          } else {
            // If no conversation exists, create a new one
            conversation = new Conversation({
              participants: [senderId, recipientId],
            });
            await conversation.save();
          }
        res.json( conversation) 
    }catch(error){
        res.status(500).json({error:error.message})
    }
 
}

exports.getConversations=async (req,res)=>{
    const {userId}=req.params
    try {
        const conversations = await Conversation.find({
            participants: userId,
            deletedBy: { $ne: userId }, // Exclude conversations marked as deleted by the user
        })
        .sort({ updatedAt: -1 })
        .populate({
            path:"participants",
             select:"nom prenom email",
        });
    
        res.json(conversations);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
   
 
}
exports.softDeleteConversation  = async (req,res)=>{
    
    const { conversationId } = req.params;
    const {userId}=req.body;

    try {
        const conversation = await Conversation.findById(conversationId);
    
        if (!conversation) {
            return res.status(404).json({ message: "Conversation not found" });
        }
    
        // If the user already deleted it, do nothing
        if (conversation.deletedBy.includes(userId)) {
            return res.status(400).json({ message: "Conversation already deleted by this user" });
        }
    
        // Add the user's ID to the `deletedBy` array
        conversation.deletedBy.push(userId);
        await conversation.save();
    
        res.json({ message: "Conversation deleted for the current user" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
    
 }

 exports.permanentlyDeleteConversation =async (req,res)=>{
    const { conversationId } = req.params;
    try{
        const conversation = await Conversation.findById(conversationId);
        if (!conversation) {
            return res.status(404).json({ message: "Conversation not found" });
        }
        if(conversation.deletedBy.length == conversation.participants.length) {
            await Conversation.findByIdAndDelete(conversationId);
            await Message.deleteMany({ conversationId });
            return { status: 200, message: "Conversation and messages permanently deleted" };
        }

    }catch(error){
        res.status(500).json({ error: error.message });
    }

 }

