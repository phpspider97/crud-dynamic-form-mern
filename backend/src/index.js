import express from 'express'
import cors from 'cors' 
import cluster from 'cluster' 
const app = express()
const PORT = process.env.PORT || 3333
import 'dotenv/config'
import os from'os' 
const numCPUs = os.cpus().length 

import userRoute from './routes/userRoute.js'  
import mongoConnect from './config/db.js'
 
mongoConnect(process.env.MONGO_URL)

//import './util/circuitBreaker.js' 
app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
  
if(cluster.isPrimary) { 
    for (let i = 0; i < numCPUs; i++) {
        cluster.fork();
    }
    cluster.on('exit', (worker, code, signal) => {
        console.log(`Worker ${worker.process.pid} died`);
    })
}else{
    app.use('/user',userRoute) 

    app.get('/',(req,res)=>{ 
        logger.info('Some one visit in index page.')
        res.send('<h1>This is user backend!!</h1>')
    })
  
    app.listen(PORT,()=>{
        console.log(`Backend server connected @ ${process.pid}!!`)
    })
}