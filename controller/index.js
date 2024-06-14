const { createAppointment, getAllAppointments, editAppointment } = require("./Appointment.Controller");
const { addNewAdmin, login, addNewDoctor, registerPatient, logout, getProfile } = require("./User.Controller");

module.exports = {
    login,
    addNewAdmin,
    addNewDoctor,
    registerPatient,
    getProfile,
    logout,
    createAppointment,
    getAllAppointments,
    editAppointment
}