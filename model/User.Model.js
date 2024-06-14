const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    firstName : {
        type : String,
        required : [true, "First name is a required field"]
    },
    lastName : {
        type : String,
        required : [true, "Last name is a required field"]
    },
    email : {
        type : String,
        required : [true, "email is a required field"],
        unique : [true, "email already in use"]
    },
    password : {
        type : String, 
        required : [true, "password is a required field"],
        minLength : [6,"password must have 6 characters or more"]
    },
    phone : {
        type : String,
        required : [true, "phone number is a required field"],
        minLength : [10, "phone number must have 10 digits"],
        maxLength : [10, "phone number should not exceed 10 digits"]
    },
    uid : {
        type : String, 
        required : false,
        default : ""
    },
    dob : {
        type : Date,
        required : true
    },
    role : {
        type : String,
        required : [true, "role is a required field"],
        enum : ["ADMIN", "PATIENT", "DOCTOR"]
    },
    gender : {
        type : String,
        required : [true, "gender is a required field"],
        enum : ["M","F","O"]
    },
    docDepartment : {
        type : String,
        required : false,
        default : ""
    },
    docAvatar : {
        type : String,
        required : false,
        default : ""
    },
    token : {
        type : String,
        required : false,
        default : null
    }

});

const UserModel = mongoose.model("users",userSchema);

module.exports = {
    UserModel
};