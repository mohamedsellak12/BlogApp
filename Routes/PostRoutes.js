const express=require('express');
const { uploadImage, addPost, getAllPosts, deletePostById, updatePost, getPostsByUserId,
     likePost, getLikesOfPost, toggleReport } = require('../Controllers/PostController');
const upload = require('../middleware/upload');

const router= express.Router();


router.post("/upload/image",upload.single('photo'), uploadImage)

router.post("/addPost",upload.single('photo'),addPost)
router.get("/allPosts",getAllPosts)
router.delete("/deletepost/:id",deletePostById)
router.put("/updatePost/:id",upload.single('photo'),updatePost)
router.get("/yourposts/:id",getPostsByUserId);
router.put("/like/:postId",likePost)
router.get("/likeofpost/:id",getLikesOfPost)
router.put("/report/:postId",toggleReport)


module.exports=router;