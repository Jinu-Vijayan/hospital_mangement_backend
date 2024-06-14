const mongoose = require("mongoose");

const appointmentSchema = new mongoose.Schema({
    firstName : {
        type : String,
        required : [true, "firstName is a required field"],
    },
    lastName : {
        type : String,
        required : [true, "lastName is a required field"],
    },
    dob : {
        type : Date,
        required : [true, "dob is a required field"],
    },
    email : {
        type : String,
        required : false,
        default : ""
    },
    phone : {
        type : String,
        required : [true, "phone is a required field"],
    },
    address : {
        type : String,
        required : [true, "address is a required field"],
    },
    gender : {
        type : String,
        required : [true, "gender is a required field"],
        enum : ["M", "F", "O"]
    },
    appointmentDate : {
        type : Date,
        required : [true, "appointmentDate is a required field"],
    },
    department : {
        type : String,
        required : [true, "department is a required field"],
    },
    hasVisited : {
        type : Boolean,
        required : [true, "hasVisited is a required field"],
    },
    userId : {
        type : mongoose.Schema.ObjectId,
        required : [true, "userId is a requireed field"],
        ref : "users"
    },
    doctorId : {
        type : mongoose.Schema.ObjectId,
        required : [true, "userId is a requireed field"],
        ref : "users"
    },
    status : {
        type : String,
        enum : ["Accepted", "Pending", "Rejected", "Cancelled"],
        default : "Pending"
    }
},{
    timestamps : true
});

const AppointmentModel = mongoose.model("appointments",appointmentSchema);

module.exports = {
    AppointmentModel
}