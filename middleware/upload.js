const multer =require('multer');
const path=require("path");



const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, 'uploads/'); // Directory to store images
    },
    filename: function (req, file, cb) {
      cb(null, Date.now() + path.extname(file.originalname)); // Unique filename
    }
  });
  
const fileFilter = (req, file, cb) => {
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif'];
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed!'), false);
    }
  };

const upload = multer({
     storage: storage,
    limits: { fileSize: 1024 * 1024 * 5 } ,
    fileFilter: fileFilter
 });

 module.exports=upload;