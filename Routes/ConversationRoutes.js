const express=require('express');
const { createConversation, getConversations, deleteCoversation, softDeleteConversation, permanentlyDeleteConversation } = require('../Controllers/ConversationController');
const router=express.Router();



router.post("/createConversation/:userId",createConversation)
router.get("/getConversations/:userId",getConversations)
router.put("/deleteConversation/:conversationId",softDeleteConversation)
router.delete("/deleteConversationPermanently/:conversationId",permanentlyDeleteConversation)


module.exports=router;