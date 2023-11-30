const loadBanner=async(req,res)=>{
    try {
        res.render('banner')
        
    } catch (error) {
        console.log(error)
    }
}

module.exports={
    loadBanner
}