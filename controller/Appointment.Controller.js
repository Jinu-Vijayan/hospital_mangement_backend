const { catchAsync } = require("../middleware");
const { AppointmentModel, UserModel } = require("../model/");

const createAppointment = async (req,res) => {

    const {firstName, lastName, dob, phone, address, gender, appointmentDate, department, hasVisited, userId, doctorId} = req.body;

    if(!firstName|| !lastName|| !dob|| !phone|| !address|| !gender|| !appointmentDate|| !department|| !hasVisited|| !userId|| !doctorId){

        return res.status(400).json({
            success : false,
            message : "Send all required data"
        });

    }

    if(new Date(appointmentDate) <= new Date()){
        return res.status(400).json({
            success : false, 
            message : "Invalid appointmentDate"
        })
    }

    const newAppointment = await AppointmentModel.create({
        ...req.body,
        status : "Pending"
    });

    return res.status(201).json({
        success : true,
        message : "Appoinment created",
        appointmentId : newAppointment._id
    })
}

const getAllAppointments = async (req,res) => {

    const opts = {};

    if(req.user.role === "PATIENT"){

        opts.userId = req.user._id

    } else if (req.user.role === "DOCTOR"){

        opts.doctorId = req.user._id

    }

    console.log("options for db",opts)

    const appointments = await AppointmentModel.find(opts).populate({
        path: "userId doctorId",
        select: "firstName lastName email phone"
      });

    return res.status(200).json({
        success: true,
        message : "All appointments fetched",
        data : appointments
    })
}

const editAppointment = async (req,res) => {

    const {id} = req.params;
    const {status} = req.body;

    if(!status){

        return res.status(400).json({
            success : false,
            message : "status is a required field"
        })
    }

    const appointment = await AppointmentModel.findById(id).populate("userId doctorId");

    if(!appointment){

        return res.status(404).json({
            success : false,
            message : "Appointment cannot be found"
        });

    }

    const role = req.user.role;

    if((role === "DOCTOR" && (status === "Cancelled" || req.user.email !== appointment.doctorId.email)) || (role === "PATIENT" && (status !== "Cancelled" || req.user.email !== appointment.userId.email))){

        return res.status(403).json({
            success : false,
            message : "Forbidden"
        });

    }

    await AppointmentModel.findByIdAndUpdate(id, {status : status})

    return res.status(200).json({
        success : true,
        message : "Appointment edited successfuly"
    })
}

module.exports = {
    createAppointment : catchAsync(createAppointment),
    getAllAppointments : catchAsync(getAllAppointments),
    editAppointment : catchAsync(editAppointment)
}