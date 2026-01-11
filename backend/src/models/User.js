import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true,
        unique:true,
        lowercase:true,
        trim:true
    },
    password:{
        type:String,
        required:true,
        minlength:6,
        select:false
    },
    phoneNumber: {
        type: String,
        required: true,
        unique: true,
        minlength: 10,
        maxlength: 10
    },
    profilePicture:{
        type:String,
        default:""
    },
    bio:{
        type:String,
        default:""
    }
},{
    timestamps: true
})

export default mongoose.model("User",userSchema);