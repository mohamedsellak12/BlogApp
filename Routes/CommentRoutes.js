const express=require('express');
const { addComment, getAllCommentsByPostId, deleteCommentById, getNumberOfComments, updateCommentById } = require('../Controllers/CommentController');
const route=express.Router();





route.post("/addComment",addComment);

route.get("/getCommentsOfPost/:id",getAllCommentsByPostId)
route.delete("/deleteComment/:id",deleteCommentById)
route.get("/numberOfComments/:id",getNumberOfComments)
route.put("/updateComment/:id",updateCommentById)












module.exports=route;