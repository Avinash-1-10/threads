import mongoose from "mongoose";

const postSchema = new mongoose.Schema({
    postBy:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true
    },
    text:{
        type:String,
        maxLength:500,
    },
    img:{
        type:String,
    }
},{timestamps:true})

const Post = mongoose.model("Post", postSchema);

export default Post;