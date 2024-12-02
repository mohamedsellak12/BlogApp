const mongoose= require("mongoose")

const Schema=mongoose.Schema 

const commentSchema= new Schema({
    comment: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    postId:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Post'
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
})
module.exports=mongoose.model('Comment',commentSchema);