var express = require("express");
var app = express();
app.listen(3000);

//mongoose
const mongoose = require('mongoose');
mongoose.connect('mongodb+srv://teonguyen:7vyUdLNTwXKdOG4K@cluster0-qah5q.mongodb.net/APIServer_1?retryWrites=true&w=majority', {useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify:true}, function(err){
    if(err){ console.log("Mongo connected error!!!!"); } else { console.log("Mongo connected successfully."); }
});

//body-parser
var bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: false }));

//Bcrypt
const bcrypt = require('bcrypt');
const saltRounds = 10;

//Models
const User = require("./Models/User");

//User - Resgiter
app.post("/User/Register", function(req, res){

    //Check Username or Email exist
    User.find({
        "$or": [{
            "Username": req.body.Username
        }, {
            "Email": req.body.Email
        }]
    }, function(err, data){
        if(data.length==0){
            
            bcrypt.genSalt(saltRounds, function(err, salt) {
                bcrypt.hash(req.body.Password, salt, function(err2, hash) {
                    if(!err){
        
                        var khachhang = new User({
                            Username        : req.body.Username,
                            Password        : hash,
                            Active          : false,
                            CodeActive      : RandomString(30),
                            Group           : 0,
                            RegisterDate    : Date.now(),
                    
                            HoTen           : req.body.HoTen,
                            Email           : req.body.Email,
                            SoDT            : req.body.SoDT,
                            DiaChi          : req.body.DiaChi
                        });
                        khachhang.save(function(err3){
                            if(err3){

                                // Gửi mail active
                                // http://locahost:3000/active/:CodeActive

                                res.json({"kq":0,"errMsg":err3});
                            }else{
                                res.json({"kq":1});
                            }
                        });
        
                    }else{
                        res.json({"kq":0,"errMsg":err2});
                    }
                });
            });

        }else{
            res.json({"kq":0,"errMsg":"Username or Email is not availble"});
        }
    });
    
});

//User - Active
app.get("/Active/:codeActive", function(req, res){
    User.findOne({CodeActive:req.params.codeActive}, function(err, data){
        if(err){
            res.json({"kq":0,"errMsg":err});
        }else{
            
            if(data.length==0){
                res.json({"kq":0,"errMsg":"Code không tồn tại."});
            }else{
                if(data.Active==false){

                    User.findOneAndUpdate({_id:data._id},{Active:true}, function(err2){
                        if(err2){
                            res.json({"kq":0,"errMsg":err2});
                        }else{
                            res.json({"kq":1});
                        }
                    });
    
                }else{
                    res.json({"kq":0,"errMsg":"Code này đã được active rồi."});
                }
            }

        }
    });
});

//User - Login

app.get("/", function(req, res){
    res.send("Hello world");
});

//Functions
function RandomString(dai){

    var mang = ["a","b", "c", "d", "e", "f", "g", "h", "j", "k", "m", "n", "p","q","r","s","y","u","v","x","y","z","w", 
                "A","B", "C", "D", "E", "F", "G", "H", "J", "K", "M", "N", "P","Q","R","S","Y","U","V","X","Y","Z","W",
                "1","2","3","4","5","6","7","8","9"];

    //[i, l, I, L, o, 0, O]

    var kq = "";
    for(var i=0; i<dai; i++){
        kq = kq + mang[ Math.floor(Math.random() * mang.length) ]
    }

    return kq;
}