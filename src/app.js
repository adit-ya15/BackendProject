import express from "express"
import cors from "cors"
import cookieParser from "cookie-parser"

const app = express()
const rawOrigin = (process.env.CORS_ORIGIN || "").trim()
const corsOrigin = rawOrigin === "*" ? true : rawOrigin || true

app.use(cors({
    origin: corsOrigin,
    credentials: true,
}))//app.use for middlewares most of the time

app.use(express.json({limit: "16kb"}))
app.use(express.urlencoded({extended:true, limit: "16kb"}))
app.use(express.static("public"))
app.use(cookieParser())

//routes import

import userRouter from './routes/user.routes.js'

//routes declaration
app.use("/api/v1/users", userRouter)


//this should be our url http:localhost:8000/api/v1/users/register


export { app }