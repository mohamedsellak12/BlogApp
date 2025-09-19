const mongoose= require("mongoose")

const Schema=mongoose.Schema 
const postSchema=new Schema({
    title: { type: String, required: false },
    content: { type: String, required: true },
    photo: { type: String ,required: false },
    likes:[
        {type:mongoose.Schema.Types.ObjectId, ref:'User', required:false , default:[]}
    ],
    reports:[
        {type:mongoose.Schema.Types.ObjectId, ref:'User', required:false , default:[]}
    ],
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' , required: true },
},{timestamps: true}


)
module.exports=mongoose.model('Post',postSchema);