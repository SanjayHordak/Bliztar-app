import express from 'express';
import path from 'path';
import {ENV} from './config/env.js';

const app = express();
const __dirname = path.resolve();
const port = ENV.PORT || 5000;

app.get("/api/health",(req,res)=>{
    res.status(200).json({message:'Success'});
});

//make the app for deployment
if(ENV.NODE_ENV==='production'){
    app.use(express.static(path.join(__dirname,'../../admin/dist')));

    app.get("/{*any}",(req,res)=>{
        res.sendFile(path.join(__dirname,"../../admin","dist","index.html"));
    })
};
app.listen(port,()=>
    console.log(`Server is running on port ${port}`));