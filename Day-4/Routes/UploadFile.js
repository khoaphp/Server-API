//multer
var multer  = require('multer');

var storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, 'public/upload')
    },
    filename: function (req, file, cb) {
      cb(null, Date.now()  + "-" + file.originalname)
    }
});  
var upload = multer({ 
    storage: storage,
    fileFilter: function (req, file, cb) {
        console.log(file);
        if( file.mimetype=="image/bmp" || 
            file.mimetype=="image/png" ||
            file.mimetype=="image/jpg" ||
            file.mimetype=="image/jpeg"    
        ){
            cb(null, true)
        }else{
            return cb(new Error('Only image are allowed!'))
        }
    }
}).single("file-0");



module.exports = function(app){

    app.post("/uploadImage", function(req, res){
        
        upload(req, res, function (err) {
            if (err instanceof multer.MulterError) {
                res.json({kq:0, errMsg:err});
            } else if (err) {
                res.json({kq:0, errMsg:err});
            }else{
                res.json({kq:1, fileHinh:req.file});
            }
    
        });

    });

}