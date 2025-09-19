
const mongoose= require("mongoose")
const bcrypt=require("bcrypt")
const Schema=mongoose.Schema 

const userSchema = new Schema({
        nom: {
            type: String,
            required: true,
        },
        prenom:{
            type: String,
            required: true,
        },
        password: {
            type: String,
            required: true
        },
        email: {
            type: String,
            email: true,
            required: true,
            unique: true
        },
       photo:{
        type: String,
        require:false 
       },
       role:{
        type: String,
        enum: ['admin','user'],
        default:'user'
       },
       friends:[
        {type:mongoose.Schema.Types.ObjectId, ref:'User', required:false , default:[]}
       ],
       resetPasswordToken: { type: String, default: null },
       resetPasswordExpires: { type: Date, default: null },
    })


    userSchema.pre('save', async function (next) {
        if (!this.isModified('password')){
            return next();
        } 
        this.password = await bcrypt.hash(this.password, 10); // Hash with a salt of 10 rounds
        next();
    });


module.exports=mongoose.model("User",userSchema);