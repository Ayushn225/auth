import express from 'express';
import dotenv from "dotenv";
import authRouter from "./routes/auth.routes"
import userRouter from "./routes/user.routes"
import cookieParser from 'cookie-parser';

dotenv.config();

const app = express();

//express json middleware
app.use(express.json());
app.use(cookieParser());
app.use(authRouter);
app.use("/user", userRouter);

app.get('/health', (req, res)=>{
    res.json({status: "ok"})
});

export default app;