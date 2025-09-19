const Post = require("../Models/Post");
const User = require("../Models/User");


exports.uploadImage=(req,res)=>{
    try {
        res.status(200).json({
          message: 'Image uploaded successfully',
          file: req.file // Returns file details
        });
      } catch (error) {
        res.status(500).json({ error: error.message });
      }
}

exports.addPost= async (req,res)=>{
    try {
        const { title, content, userId } = req.body;
        const photo = req.file ? req.file.path : null; 
        // File path of the uploaded photo
        
        if(content==""){
          return res.json({message: "Content required"})
        }
        const post = new Post({ title, content, photo, userId });

        await post.save();

        console.log(req.file); // Add this to debug
         console.log(req.body);
    
        res.json({ message: 'Post created successfully', post });
      } catch (error) {
        console.error(error);
        res.json({ message: 'Error creating post' });
      }
}


exports.getAllPosts= async (req,res)=>{
    try {
        const posts = await Post.find()
        .sort({createdAt:-1})
        .populate('userId', 'nom prenom email ')
        res.json(posts);
    } catch (error) {
        console.error(error);
        res.json({ message: 'Error getting posts' });
    }
}

exports.getPostsByUserId= async (req, res) => {
  try{
    const userPosts = await Post.find({userId:req.params.id}).sort({createdAt:-1})
    .populate('userId', 'nom prenom email ');
    // if(userPosts.length === 0){
    //   return res.json({ message: "You don't have any posts yet."  , posts:userPosts });
    // }
    res.json(userPosts);
}catch(e){
  console.error(e);
  res.json({ message: 'Error getting posts' });
 
}
}

exports.deletePostById=async (req, res) => {

  try{
    const post = await Post.findByIdAndDelete(req.params.id);
    if(!post){
      return res.status(404).json({ message: 'Post not found'});
    }
    res.json({ message: 'Post deleted successfully' });

  }catch(e){
    console.error(e);
    res.json({ message: 'Error deleting post' });


  }
}

exports.updatePost= async(req, res)=>{
 
  try{
    const postData={
      title:req.body.title ,
      content:req.body.content,
    }
    const pohto=req.file ? req.file.path : null ;
    if(pohto){
      postData.photo=pohto;
    }  
    if(postData.content==''){
      return res.json({ message: 'Invalid data' });
    }

    const post = await Post.findByIdAndUpdate(req.params.id, postData, { new: true }).populate("userId","nom prenom");
    if(!post){
      return res.status(404).json({ message: 'Post not found' });
    }
    res.json({ message: 'Post updated successfully', post:post });

}catch(e){
  console.error(e);
  res.json({ message: 'Error updating post' });
 
}


}
exports.likePost = async (req, res) => {
  const { postId } = req.params;
  const { userId } = req.body;

  if (!userId || !postId) {
    return res.status(400).json({ message: 'User ID and Post ID are required' });
  }
  try {
    const post = await Post.findById(postId);

    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    
    const hasLiked = post.likes.includes(userId);


    await Post.updateOne(
      { _id: postId },
      hasLiked
        ? { $pull: { likes: userId } } // Dislike
        : { $push: { likes: userId } } // Like
    );

    res.json({
      message: hasLiked ? 'Post disliked successfully' : 'Post liked successfully',
      liked: !hasLiked,
      userId: userId
    });
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: 'Error liking/disliking post', error: e.message });
  }
};

exports.getLikesOfPost=async(req,res)=>{
  try{
    const post = await Post.findById(req.params.id).populate('likes', 'nom prenom email');
    if(!post){
      return res.status(404).json({ message: 'Post not found' });
    }
    res.json(post.likes);


  }catch (e) {
    console.error(e);
    res.json({ message: 'Error getting likes of post' });
  }
}

exports.toggleReport=async (req,res)=>{
  const { postId } = req.params;
  const {userId}=req.body
  try{
    const post = await Post.findById(postId);
    if(!post){
      return res.status(404).json({ message: 'Post not found' });
    }
    if(post.reports.includes(userId)){
      await Post.updateOne(
        { _id: postId },
        { $pull: { reports: userId } } // Remove report
      );
    }else{
      await Post.updateOne(
        { _id: postId },
        { $push: { reports: userId } } // Add report
      );
    }
    res.json({ message: post.reports.includes(userId)? 'Post unreported successfully' :'Post reported successfully'  });


}catch(e) {
  console.error(e);
  res.json({ message: 'Error reporting/unreporting post' });
}



}



