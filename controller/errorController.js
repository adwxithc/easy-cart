const devErrors=(req ,res, error,homeLink)=>{
    const {statusCode,message,stack,status}=error
    const isFetchRequest = req.headers['sec-fetch-dest'] == 'empty';

    if (!isFetchRequest) {

                    console.log('---------------------------------------render')
        res.status(statusCode).render('error/error',{
            statusCode:statusCode,
            status:status,
            message:message,
            stackTrace:stack,
            error:error,
            homeLink:homeLink
        })
      } else {
        console.log('--------------------------fetch')
            res.status(statusCode).json({
                statusCode:statusCode,
                status:status,
                message:message,
                stackTrace:stack,
                error:error,
                homeLink:homeLink
            })
      }
}
const prodErrors=(req,res,error,homeLink)=>{

    const { isOperational, statusCode, message, status } = error;

    const finalStatusCode = isOperational ? statusCode : 500;
    const finalMessage = isOperational ? message : 'Internal server error';
    const finalStatus = isOperational? status : 'error'

    if (!req.xhr) {
                    
        res.status(finalStatusCode).render('error/error',{
            statusCode:finalStatusCode,
            message:finalMessage,
            status:finalStatus,
            homeLink:homeLink

        })
      } else {

            res.status(finalStatusCode).json({
                statusCode:finalStatusCode,
                message:finalMessage,
                status:finalStatus,
                homeLink:homeLink
            })
      }
}

module.exports=(error, req, res, next)=>{
    console.log(error)
    error.statusCode=error.statusCode || 500;
    error.status=error.status || 'error';

    const homeLink=req.session.adminId? '/admin/adminDashboard': '/'

    if(process.env.NODE_ENV==='development'){
        devErrors(req,res, error, homeLink)
    }else if(process.env.NODE_ENV==='production'){
        prodErrors(req, res, error, homeLink)

    }
    

}