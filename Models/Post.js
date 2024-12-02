const mongoose= require("mongoose")

const Schema=mongoose.Schema 
const postSchema=new Schema({
    title: { type: String, required: true },
    content: { type: String, required: true },
    photo: { type: String ,required: false },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
},{timestamps: true}


)
module.exports=mongoose.model('Post',postSchema);