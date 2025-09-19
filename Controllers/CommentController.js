const Comment=require("../Models/Comment")





exports.addComment=async (req,res)=>{
    try{
        const {content, postId ,userId }= req.body;
        // if(content==""|null){
        //     return res.json({message:"Content field is required"})
        // }
        const comment=new Comment({content,postId,userId});
        await comment.save();
        const populatedComment = await Comment.findById(comment._id).populate('userId', 'nom prenom');
        res.json({
            message:"Comment added successfully",
            comment:populatedComment
        });

    }catch(e){
        console.error(e.message);
        res.json({message:"problem adding comment"});
    }
}

exports.getAllCommentsByPostId=async (req,res)=>{
    try{
        const comments=await Comment.find({postId:req.params.id}).sort({createdAt:-1 })
        .populate('userId', 'nom prenom');
        const numberOfComments = comments.length;
        res.json(
            {
                comments:comments,
                number:numberOfComments
            }

        )

    }catch(e){
        console.error(e.message);
        res.json({message:"problem getting comments"});

    }

}
exports.getNumberOfComments =async(req,res)=>{
    try{
        const comments=await Comment.find({postId:req.params.id}).countDocuments();
        res.json({number:comments})
    }catch(e){
        console.error(e.message);
        res.json({message:"problem getting number of comments"})
    }
}
exports.deleteCommentById =async (req,res)=>{
    try{
        const comment=await Comment.findByIdAndDelete(req.params.id);
        if(!comment){
            return res.json({message:"Comment not found"})
        }
        res.json({message:"Comment deleted successfully"})
        
    }catch(e){
        console.error(e.message);
        res.json({message:"problem deleting comment"})
    }
} 

exports.updateCommentById =async (req,res)=>{
    const { id } = req.params;
    const { content } = req.body;
  
    try {
      // Trouver et mettre à jour le commentaire
      const updatedComment = await Comment.findByIdAndUpdate(
        id,
        { content, updatedAt: Date.now() }, // Mettre à jour le champ updatedAt aussi
        { new: true } // Retourne le commentaire mis à jour
      ).populate("userId", "nom prenom");
  
      if (!updatedComment) {
        return res.json({ message: 'Comment not found' });
      }
  
      res.json({
        message: 'Comment updated successfully',
        comment: updatedComment,
      });
    } catch (error) {
      console.error('Error updating comment:', error);
      res.status(500).json({ message: 'Internal server error', error });
    }
    }