const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { UserModel } = require("../model");
const { catchAsync } = require("../middleware");
const { uploadFile } = require("../services");

const SALT_ROUND = process.env.SALT_ROUND;

const login = async(req,res) => {

    const {email,password} = req.body;

    const JWT_SECRET_KEY  = process.env.JWT_SECRET_KEY;

    const user = await UserModel.findOne({email : email});

    if(!user){
        
        return res.status(400).json({
            success : false,
            message : "Incorrect credentials"
        });
    }

    const isPasswordMaching = await bcrypt.compare(password,user.password);

    if(!isPasswordMaching){
        return res.status(400).json({
            success : false,
            message : "Incorrect credentials"
        });
    }

    const token = jwt.sign({
        userId : user._id,
        email : email,
        role : user.role,
        name : `${user.firstName} ${user.lastName}`
    },JWT_SECRET_KEY,{expiresIn : 60 * 60 });

    await user.updateOne({
        token : `Bearer ${token}`
    })

    return res.status(200).json({
        success : true,
        message : "login successful",
        token : `Bearer ${token}`
    })
}

const addNewAdmin =async (req,res,next) => {

    const {firstName, lastName, dob, phone, password, email, gender} = req.body;

    if(!firstName || !lastName || !dob || !phone || !email || !password || !gender){

        return res.status(400).json({
            success : false,
            message : "Send all required data"
        });

    };

    const user = await UserModel.findOne({email: email});

    if(user){
        return res.status(400).json({
            success : false,
            message : "Email already in use"
        })
    }


    const salt =await bcrypt.genSalt(Number(SALT_ROUND));

    const hasedPassword = await bcrypt.hash(password,salt);

    const newAdmin = {
        ...req.body,
        password : hasedPassword,
        role : "ADMIN"
    }

    const adminUser = await UserModel.create(newAdmin);

    return res.status(201).json({
        success : true,
        message : "New admin created",
        userId : adminUser._id
    });

}

const addNewDoctor = async (req,res,next) => {

    const {firstName, lastName, dob, phone, password, email, gender,docDepartment} = req.body;

    if(!req.file){
        return res.status(400).json({
            success : false,
            message : "Upload file for the avatar"
        })
    }

    if(!firstName || !lastName || !dob || !phone || !email || !password || !gender || !docDepartment){

        return res.status(400).json({
            success : false,
            message : "Send all required data"
        });

    };

    const user = await UserModel.findOne({email : email});

    if(user){
        return res.status(404).json({
            success : false,
            message : "Email already in use"
        });
    }

    const result = await uploadFile(req);
    console.log(result);

    const salt = await bcrypt.genSalt(Number(SALT_ROUND));

    const hashedPassword  = await bcrypt.hash(password,salt)

    const newUser = await UserModel.create({
        ...req.body,
        password : hashedPassword,
        role : "DOCTOR",
        docAvatar : result.secure_url
    })

    res.status(201).json({
        success : true,
        message : "Doctor creation successful",
        userId : newUser._id
    })
}

const registerPatient = async (req,res) => {

    const {firstName, lastName, dob, phone, password, email, gender} = req.body;

    if(!firstName || !lastName || !dob || !phone || !email || !password || !gender){

        return res.status(400).json({
            success : false,
            message : "Send all required data"
        });

    };

    const user = await UserModel.findOne({email: email});

    if(user){
        return res.status(400).json({
            success : false,
            message : "Email already in use"
        })
    }

    const salt =await bcrypt.genSalt(Number(SALT_ROUND));

    const hasedPassword = await bcrypt.hash(password,salt);

    const newUser = {
        ...req.body,
        password : hasedPassword,
        role : "PATIENT"
    }

    const patientUser = await UserModel.create(newUser);
    
    return res.status(201).json({
        success : true,
        message : "Account created successfully",
        userId : patientUser._id
    })
}

const getProfile = async (req,res) => {

    console.log(req.user);

    const genders = {
        "M" : "Male",
        "F" : "Female",
        "O" : "Other"
    }

    const responseData = {
        userId : req.user._id,
        firstName : req.user.firstName,
        lastName : req.user.lastName,
        email : req.user.email,
        phone : req.user.phone,
        dob : req.user.dob,
        gender : genders[req.user.gender],
        docDepartment : req.user.docDepartment,
        docAvatar : req.user.docAvatar
    }

    return res.status(200).json({
        success : true,
        message : "Profile data fetched",
        userData : responseData
    })
}

const logout = async (req,res) => {

    await UserModel.findByIdAndUpdate(req.user._id,{
        token : null
    });

    res.status(200).json({
        success : true, 
        message : "User logged out"
    })
}

module.exports = {
    login : catchAsync(login),
    addNewAdmin : catchAsync(addNewAdmin),
    addNewDoctor : catchAsync(addNewDoctor),
    registerPatient : catchAsync(registerPatient),
    getProfile : catchAsync(getProfile),
    logout : catchAsync(logout)
}