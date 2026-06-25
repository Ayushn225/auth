import app from "./app";
import { connectDB } from "./config/config";
import http from 'http';
import dotenv from "dotenv";

dotenv.config();

async function startServer(){
    //connect to db
    await connectDB();

    const server = http.createServer(app);

    server.listen(process.env.PORT, ()=>{
        console.log(`server is listening at port: http://localhost:${process.env.PORT}`)
    })
    
}

startServer().catch((err =>{
    console.log("error: ", err);
    process.exit(1);
}))