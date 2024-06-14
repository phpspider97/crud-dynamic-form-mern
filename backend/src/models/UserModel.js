import mongoose from 'mongoose'

const userSchema = new mongoose.Schema({
    first_name : {
        type : String,
        required : true
    },
    last_name : {
        type : String,
        required : true
    },
    email : {
        type : String,
        required : true,
        unique: true
    },
    phone : {
        type : String,
        required : false,
    },
    dob : {
        type : String,
        required : true
    },
    address : {
        type : String,
        required : true
    },
     
},{ timestamps : true })

const UserModel = mongoose.model('user',userSchema,'user')

export default UserModel