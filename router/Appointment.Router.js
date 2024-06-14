const express = require("express");
const { createAppointment, getAllAppointments, editAppointment } = require("../controller");
const {passport, Authorization} = require("../middleware");

const AppointmentRouter = express.Router();

AppointmentRouter.post("/create",passport.authenticate('jwt', { session: false }),createAppointment);

AppointmentRouter.get("/all",passport.authenticate("jwt",{session: false}),Authorization(["ADMIN","PATIENT","DOCTOR"]),getAllAppointments);

AppointmentRouter.put("/edit/:id",passport.authenticate("jwt",{session: false}),Authorization(["ADMIN","PATIENT","DOCTOR"]),editAppointment)

module.exports = {
    AppointmentRouter
}