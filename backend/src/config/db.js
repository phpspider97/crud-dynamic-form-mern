import mongoose from 'mongoose'
function mongoConnect(mongoUrl){ 
    mongoose.connect(mongoUrl).then(()=>{
        //console.log('Database connected')
    }).catch((err)=>{
        console.log(`Error : ${err.message}`)
    })
} 
export default mongoConnect