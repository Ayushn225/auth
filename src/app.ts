import express from 'express';
import dotenv from "dotenv";
import authRouter from "./routes/auth.routes"
import userRouter from "./routes/user.routes"
import adminRouter from "./routes/admin.routes"
import cookieParser from 'cookie-parser';

dotenv.config();

const app = express();

//express json middleware
app.use(express.json());
app.use(cookieParser());
app.use("/auth", authRouter);
app.use("/user", userRouter);
app.use("/admin", adminRouter);

app.get('/health', (req, res)=>{
    res.json({status: "ok"})
});

export default app;