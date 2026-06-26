import express from 'express';
import dotenv from "dotenv";
import authRouter from "./routes/auth.routes"

dotenv.config();

const app = express();
//express json middleware
app.use(express.json());
app.use(authRouter)


app.get('/health', (req, res)=>{
    res.json({status: "ok"})
});

export default app;