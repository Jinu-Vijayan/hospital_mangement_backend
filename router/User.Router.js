const express = require("express");
const { addNewAdmin, login, addNewDoctor, registerPatient, logout, getProfile } = require("../controller");
const {passport, Authorization} = require("../middleware");
const { upload } = require("../services")

const UserRouter = express.Router();

UserRouter.post("/login", login);

UserRouter.post("/admin/addnew",passport.authenticate('jwt', { session: false }),Authorization(["ADMIN"]),addNewAdmin);

UserRouter.post("/doctor/addnew",passport.authenticate("jwt",{session:false}),Authorization(["ADMIN"]),upload.single("avatar"),addNewDoctor);

UserRouter.post("/patient/register",registerPatient);

UserRouter.get("/profile",passport.authenticate("jwt",{session : false}),getProfile)

UserRouter.post("/logout",passport.authenticate("jwt",{session : false}),logout)

module.exports = {
    UserRouter
}