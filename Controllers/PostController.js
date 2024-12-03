const Post = require("../Models/Post");


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
    
        const post = new Post({ title, content, photo, userId });
        await post.save();
        
        console.log(req.file); // Add this to debug
         console.log(req.body);
    
        res.status(201).json({ message: 'Post created successfully', post });
      } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error creating post', error });
      }
}