import UserModel from "../models/UserModel.js"
import UserEducationModel from "../models/UserEducationModel.js"
import { validationResult } from 'express-validator'
import mongoose from 'mongoose'

const addEditUserEducation = async (bodyData) => {
    const arr_degree = bodyData.degree
    const arr_college = bodyData.college
    const arr_start_year = bodyData.start_year
    const arr_end_year = bodyData.end_year
    
    if(Object.keys(arr_degree).length>0){
        for(let key in arr_degree){
            if(arr_degree[key] == ''){ continue; }
            let educationData = {
                user_id:bodyData.user_id,
                degree:arr_degree[key],
                college:arr_college[key],
                start_year:arr_start_year[key],
                end_year:arr_end_year[key],
            }    
            const is_add_or_update = key.split('-')[0] 
            if(is_add_or_update == 'add'){
                await UserEducationModel(educationData).save()
            }else{ 
                delete educationData['user_id']  
                const education_id = key.split('-')[1] 
                await UserEducationModel.updateOne({_id:education_id},{$set:educationData})
            }
        }
    }
    return true
}

const addUser = async (req,res) => { 
    try{ 
        const errors = validationResult(req)
        if(!errors.isEmpty()){
            return res.status(400).json({ errors: errors.array() })
        }
        const {first_name,last_name,email,phone,dob,address} = req.body
        const data = await new UserModel({first_name,last_name,email,phone,dob,address}).save() 
        req.body.user_id = data._id
        await addEditUserEducation(req.body)
        return res.status(200).json({status:true,message:'User added successfully!!',data})
    }catch(err){
        return res.status(401).json({status:false,message:err.message})
    }
}
const editUser = async (req,res) => { 
    try{  
        const errors = validationResult(req)
        if(!errors.isEmpty()){
            return res.status(400).json({ errors: errors.array() })
        }   
        const data = await UserModel.updateOne({_id:req.params.id},{$set:req.body}) 
        req.body.user_id = req.params.id
        await addEditUserEducation(req.body)
        return res.status(200).json({status:true,message:'User updated successfully!!',data})
    }catch(err){
        return res.status(401).json({status:false,message:err.message})
    }
}
 
const deleteUser = async (req,res) => { 
    try{
        await UserModel.deleteOne({_id:req.params.id})
        await UserEducationModel.deleteMany({user_id:req.params.id})
        return res.status(200).json({status:true,message:"User deleted successfully!!"})
    }catch(err){
        return res.status(401).json({status:false,message:err.message})
    }
}

const deleteBulkUser = async (req,res) => { 
    try{ 
        await UserModel.deleteMany({_id: {$in : req.body}})
        return res.status(200).json({status:true,message:"User record deleted successfully!!"})
    }catch(err){
        return res.status(401).json({status:false,message:err.message})
    }
}

const getUser = async (req,res) => {
    try{
        const data =  await UserModel.aggregate([
            { $match:{_id: new mongoose.Types.ObjectId(req.params.id)} }, 
            {
                $lookup : {
                    from: 'user_education',
                    localField: '_id',
                    foreignField: 'user_id',
                    as: 'user_education'
                }
            }
        ]) 
        return res.status(200).json({status:true,message:'Get user record!!',data:data[0]})
    }catch(err){
        return res.status(401).json({status:false,message:err.message})
    }
}

const getAllUser = async (req,res) => { 
    try{  
        const data =  await UserModel.aggregate([ 
            {
                $lookup : {
                    from: 'user_education',
                    localField: '_id',
                    foreignField: 'user_id',
                    as: 'user_education'
                }
            },
        ]) 
        return res.status(200).json({status:true,message:'Get all user record!!',data})
    }catch(err){
        return res.status(401).json({status:false,message:err.message})
    }
}

export const userController = {
    addUser,
    editUser,
    deleteUser,
    getUser,
    getAllUser,
    deleteBulkUser
} 