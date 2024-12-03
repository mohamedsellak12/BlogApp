const User=require("../Models/User.js");
const bcrypt=require("bcrypt")
const jwt=require("jsonwebtoken");
const blacklist=new Set()
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
        return res.status(400).json({message: "user not found"})
    }
    const token=jwt.sign({id: user._id}, 'jwt_secret',{expiresIn: '24h'});
    if(user.role==='admin') {
        res.json({message: 'login successful as an admin',token})
     
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
    const userDeleted=await User.findByIdAndDelete(req.params.id);
    if(!userDeleted){
      return res.status(404).json({message:"User not found"})
    }
    res.json({message: "User deleted successfully"})
  }catch(e){
    console.error(e.message);
    res.status(500).json({message:e.message});
  }
}