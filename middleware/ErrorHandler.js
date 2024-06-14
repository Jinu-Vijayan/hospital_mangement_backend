const ErrorHandler = (err,req,res,next) => {
    console.log("Error" , err);
    return res.status(500).json({
        succes : false,
        message : "Something went wrong"
    })
}

const catchAsync = (fn) => {

    return async (req,res,next) =>{
        try{

            await fn(req,res,next)

        } catch(err){

            console.log(err);
            next(err);

        }
    }

}

module.exports = {
    ErrorHandler,
    catchAsync
}