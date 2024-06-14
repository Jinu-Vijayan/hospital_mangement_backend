const express = require("express");
const mongoose = require("mongoose");
const { UserRouter, AppointmentRouter } = require("./router");
const { ErrorHandler } = require("./middleware");
const cors = require("cors");
require("dotenv").config();

const PORT = process.env.PORT || 10000;
const MONGO_URI = process.env.MONGO_URI;
const ALLOWED_ORIGINS = process.env.ALLOWED_ORIGINS;

const app = express();

const corsOptions = {
    origin: 'http://localhost:3000',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    headers: ['Content-Type', 'Authorization']
}

// Middleware
app.use(express.json());
app.use(cors(corsOptions));


mongoose.connect(`${MONGO_URI}hospitalMangement`)
.then(()=>{
    console.log("Database connection successful");
}).catch((err)=>{
    console.log(err);
});

app.use("/api/v1/user", UserRouter);

app.use("/api/v1/appointments",AppointmentRouter)

app.use("/*",(req,res)=>{
    return res.status(404).json({
        message : "Route not found"
    })
});

app.use(ErrorHandler);

app.listen(PORT,()=>{
    console.log("Server up and running at port", PORT);
})