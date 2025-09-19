const User=require("../Models/User.js");
const bcrypt=require("bcrypt")
const nodemailer=require("nodemailer")
const jwt=require("jsonwebtoken");
const blacklist=new Set()
const crypto=require("crypto");
const FriendRequest = require("../Models/FriendRequest.js");
const { findOne, findById } = require("../Models/Post.js");
exports.register=async (req,res)=>{
    try{
        const checkUser=await User.findOne({email:req.body.email})

        if(checkUser){
            return res.status(400).json({message:"Opss ! some things went wrong "})
        }

        const newUser = new User(req.body);

        const savedUser = await newUser.save();
        res.json(savedUser);
        
    }catch(e){
        //console.error(e);
        res.status(500).json({message:e.message});
    }
    // res.send("good")
}

exports.login=async (req,res)=>{
   try{
    const {email,password} = req.body
    const user=await User.findOne({email});
    if(!user){
        return res.status(400).json({message: "user not found"})
    }
    const isPassword=await bcrypt.compare(password,user.password);
    if(!isPassword){
        return res.json({message: "user not found"})
    }
    const token=jwt.sign({id: user._id}, 'jwt_secret',{expiresIn: '24h'});
    if(user.role==='admin') {
        res.json({message: 'login successful as an admin',token,
          user:{nom:user.nom ,prenom:user.prenom ,email:user.email , role:user.role ,id: user._id}}
        )

     
    }else{
        res.json({message: 'login successful as a user',token ,
             user:{nom:user.nom ,prenom:user.prenom ,email:user.email , role:user.role ,id: user._id}})
      
    }
    // res.json(user);
   }catch(err){
    res.status(500).json({msg:"Oops! Something went wrong"});
   }
}
exports.updateUserPassword=async(req,res)=>{
    try {
        const { currentPassword, newPassword } = req.body;
    
        // Validate request data
        if (!currentPassword || !newPassword) {
          return res.status(400).json({ error: 'Both current and new passwords are required' });
        }
    
        // Find the user in the database
        const user = await User.findById(req.params.id);
    
        if (!user) {
          return res.status(404).json({ error: 'User not found' });
        }
    
        // Verify current password
        const isMatch = await bcrypt.compare(currentPassword, user.password);
        if (!isMatch) {
          return res.status(400).json({ error: 'Incorrect current password' });
        }
    
        // Hash the new password
        const hashedPassword = await bcrypt.hash(newPassword, 10);
    
        // Update the user's password
        const result = await User.updateOne(
          { _id: req.params.id },
          { $set: { password: hashedPassword } }
        );
    
        // Check if the update was successful
        if (result.modifiedCount > 0) {
          res.json({ message: 'Password updated successfully' });
        } else {
          res.status(400).json({ error: 'Failed to update password' });
        }
      } catch (error) {
        console.error('Error updating password:', error.message);
        res.status(500).json({ error: 'An error occurred while updating the password' });
      }
}

exports.updateUserInfo= async(req, res) => {
  try {
    const updatedUser = await User.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updatedUser) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json({ message: 'the user updated successfully' , user:updatedUser });
  } catch (error) {
    console.error('Error updating user info:', error.message);
    res.status(500).json({ error: 'An error occurred while updating user info' });
  }
}

exports.logout = async (req, res)=>{
    const token = req.headers.authorization?.split(' ')[1]; 
    if (!token) {
        return res.status(401).json({ message: 'Access token missing or invalid' });
    }else if (token){
        blacklist.add(token);
        res.status(200).json({ message: 'User logged out' });
    }
}

exports.deleteUser= async (req,res) => {
  try{
    const verificationPassword=req.body.password;
    if(!verificationPassword){
      return res.json({message: "Password required"})
    }
    const user=await User.findById(req.params.id);
    if(!user){
      return res.json({message: "User not found"})
    }
    const isMatch= await bcrypt.compare(verificationPassword,user.password);
    if(!isMatch){
      return res.json({message: "Password incorrect"})
    }
    
    await user.deleteOne();
    res.json({message: "User deleted successfully"})
  }catch(e){
    console.error(e.message);
    res.status(500).json({message:e.message});
  }
}

exports.requestPasswordReset = async (req, res) => {
  const { email } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Generate a reset token
    const token = crypto.randomBytes(32).toString('hex');
    const expires = Date.now() + 3600000; // 1 hour from now

    // Save token and expiration date to user
    user.resetPasswordToken = token;
    user.resetPasswordExpires = expires;
    await user.save();

    // Send the reset email
    const transporter = nodemailer.createTransport({
      service: 'Gmail', // Use your email service
      auth: {
        user: 'mohamedsellak597@gmail.com',
        pass: 'wcgg qieg zwui cppi',
      },
    });

    const resetLink = `http://localhost:4200/reset-password/${token}`;
    const mailOptions = {
      from: 'mohamedsellak597@gmail.com',
      to: email,
      subject: 'Password Reset',
      text: `You requested a password reset. Click here to reset your password: ${resetLink}`,
      html: `
      <p>You requested a password reset. Click the link below to reset your password:</p>
      <a href="${resetLink}" target="_blank">Reset your Password</a>
    `,
    };

    await transporter.sendMail(mailOptions);

    res.json({ message: 'Password reset email sent' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error processing password reset request',error });
  }
};

exports.resetPassword = async (req, res) => {
  const { token } = req.params;
  const { newPassword } = req.body;

  try {
    const user = await User.findOne({
      resetPasswordToken: token,
      resetPasswordExpires: { $gt: Date.now() }, // Ensure token is not expired
    });

    if (!user) {
      return res.status(400).json({ message: 'Invalid or expired token' });
    }
    const hashPassword = await bcrypt.hash(newPassword,10);
    // Update the user's password
   const result=await User.updateOne(
    { _id: user._id },
    { $set: { password: hashPassword, resetPasswordToken: null, resetPasswordExpires: null } }
   )
   if (result.modifiedCount > 0) {
    res.json({ message: 'Password reset successfully' });
    } else {
    res.status(400).json({ error: 'Failed to update password' });
  }

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error resetting password',error: error});
  }
};

exports.getUserById=async (req,res)=>{
  try{
    const user=await User.findById(req.params.id);
    if(!user){
      return res.json({message: "User not found"})
    }
    res.json(user);
  }catch(e){
    console.error(e.message);
    res.status(500).json({message:e.message});
  }
}
exports.findByName=async(req,res)=>{
  const {query} = req.query
  try{
    if(!query){
      return res.json({message: "Search query required"})
    }
    const users=await User.find({

      $or:[
        { nom: { $regex: query, $options: 'i' } },
        { prenom: { $regex: query, $options: 'i' } },
      ]
    }
    )
    .sort({nom:1})
    .limit(10);
    
    res.json(users);
  }catch(e){
    console.error(e.message);
    res.status(500).json({message:e.message});
  }
}


exports.sendfriendRequest = async(req,res)=>{
  const {senderId, receiverId } = req.body;
  try{
    const friendRequest=await FriendRequest.findOne({sender:senderId,receiver:receiverId})
    if(friendRequest){
      await FriendRequest.findByIdAndDelete(friendRequest._id)
      return res.json({message: "Friend request canceled successfully"})
    }
    const newFriendRequest=new FriendRequest({sender:senderId, receiver:receiverId})
    await newFriendRequest.save();
    res.json({message: "Friend request sent successfully"})
  }catch(e){
    console.error(e.message);
    res.status(500).json({message:e.message});
  }
}
exports.acceptFriendRequest = async (req,res)=>{
  const {requestId}=req.params;
  try{
    const request=await FriendRequest.findById(requestId);
    if(!request || request.status!=="pending" ){
      return res.json({message: "Friend request not found"})
    }
    await User.findByIdAndUpdate(request.sender,{$push:{friends:request.receiver}});
    await User.findByIdAndUpdate(request.receiver,{$push:{friends:request.sender}});
    // await FriendRequest.findByIdAndDelete(requestId);
  }catch(e){
    console.error(e.message);
    res.status(500).json({message:e.message});
  }
}
exports.declineFriendRequest =async (req,res)=>{
  const {requestId}=req.params;
  try{
    const request=await FriendRequest.findByIdAndDelete(requestId);
    if(!request || request.status!=="pending"){
      return res.json({message: "Friend request not found"})
    }
    request.status="declined"
    await request.save();
    res.json({message: "Friend request declined successfully"})

  }catch(e){

  }

}
