import jwt from 'jsonwebtoken'
const jwtSalt = 'Thisissalt'
export const authCheck = (req,res,next) => {
    try{
        const authHeader = req.headers.authorization
        if(!authHeader) return res.status(401).json({message:'Please provide authorization header.'})
        const token = authHeader?.split(' ')[1]
        const tokenData = jwt.verify(token,jwtSalt)
        req.userID = tokenData._id 
        next()
    }catch(err){
        res.status(500).json({message:err.message})
    }
}