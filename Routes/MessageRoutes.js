const express=require('express');
const { sendMessage, getMessages, deleteMessage } = require('../Controllers/MessageController');
const router=express.Router();


router.post("/sendMessage",sendMessage)

router.get("/getMessages/:conversationId",getMessages)
router.delete("/deleteMessage/:messageId/:userId",deleteMessage)









module.exports=router;