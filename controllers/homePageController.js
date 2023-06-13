const path = require("path");

exports.getHomePage = async(req, res, next) =>{
    try{
        res.sendFile(
            path.join(__dirname,"../", "public", "views", "homePage.html")
        );
    }catch(err){
        console.log(err);
    }
}