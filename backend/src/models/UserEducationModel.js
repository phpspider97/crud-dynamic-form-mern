import mongoose, { Schema } from 'mongoose'

const userEducation = new mongoose.Schema({
    user_id : {
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'user',
        required : true,
    },
    degree : {
        type : String,
        required : true
    },
    college : {
        type : String,
        required : true
    },
    start_year : {
        type : Date,
        required : true
    },
    end_year : {
        type : Date,
        required : true
    },
},{ timestamps : true })

const UserEducation = mongoose.model('user_education',userEducation,'user_education')

export default UserEducation