import express from 'express';
import dotenv from "dotenv";

dotenv.config();

const app = express();
//express json middleware
app.use(express.json());


app.get('/health', (req, res)=>{
    res.json({status: "ok"})
});

export default app;