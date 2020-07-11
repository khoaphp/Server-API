const User = require("../Models/User");

const LoaiSP = require("../Models/LoaiSP");

module.exports = function(app, RandomString){

    app.get("/SP_Add", function(req, res){
        // Lay DS dang co
        LoaiSP.find(function(err, data){
            if(err){
                res.json({kq:0, errMsg:err});
            }else{
                res.render("SP_Add", {mangLoaiSP:data});
            }
        });
    });

    app.post("/Ajax_Add_New_LoaiSP", function(req, res){
        var newLoaiSP = LoaiSP({
            Ten: req.body.TenLoaiSP,
            SP: []
        });
        newLoaiSP.save(function(err){
            if(err){
                res.json({kq:0, errMsg:err});
            }else{

                // Lay DS dang co
                LoaiSP.find(function(err, data){
                    if(err){
                        res.json({kq:0, errMsg:err});
                    }else{
                        res.json({kq:1, mangLoaiSP:data});
                    }
                });
                
            }
        });
    });

    app.post("/Ajax_Update_TenLoai", function(req, res){
        LoaiSP.findByIdAndUpdate(req.body.IDLoai, {Ten:req.body.Ten}, function(err){
            if(err){
                res.json({kq:0, errMsg:err});
            }else{
                LoaiSP.find(function(err, data){
                    if(err){
                        res.json({kq:0, errMsg:err});
                    }else{
                        res.json({kq:1, mangLoaiMoi:data});
                    }
                });
            }
        });
    });

}