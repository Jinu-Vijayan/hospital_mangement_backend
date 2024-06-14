const Authorization = (role) => (req,res,next) => {

    if(!role.includes(req.user.role)){

        return res.status(403).json({
            success : false,
            message : "Forbidden action"
        })

    }

    next();
}

module.exports = {
    Authorization
}