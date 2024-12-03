const express=require('express');
const { uploadImage, addPost } = require('../Controllers/PostController');
const upload = require('../middleware/upload');

const router= express.Router();


router.post("/upload/image",upload.single('photo'), uploadImage)

router.post("/addPost",upload.single('photo'),addPost)

module.exports=router;