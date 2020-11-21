var express = require("express");
var app = express();
app.set("view engine", "ejs");
app.set("views", "./views");
app.use(express.static("public"));
app.listen(3000);

//Mongoose
const mongoose = require('mongoose');
mongoose.connect('mongodb+srv://touliver:20i3xpQJNRTWWiwM@cluster0.qah5q.mongodb.net/touliver?retryWrites=true&w=majority', {useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify:false}, function(err){
    if(err){
        console.log("Mongodb connected error! " + err);
    }else{
        console.log("Mongodb connected successfully.");
    }
});

//body-parser
var bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: false }));

require("./routes/home")(app);
