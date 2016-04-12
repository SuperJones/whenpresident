var express = require("express");
var parser = require("body-parser");
var hbs     = require("express-handlebars");
var mongoose      = require("./db/connection");

var app     = express();

app.set("port", process.env.PORT || 3001);
app.set("view engine", "hbs");
app.engine(".hbs", hbs({
  extname:        ".hbs",
  partialsDir:    "views/",
  layoutsDir:     "views/",
  defaultLayout:  "layout-main"
}));
app.use("/assets", express.static("public"));
app.use(parser.urlencoded({extended: true}));

var Candidate = mongoose.model("Candidate");


app.get("/", function(req, res){
  res.render("app-welcome");
});

app.get("/candidates", function(req, res){
  Candidate.find({}).then(function(candidateFromDB){
    res.render("candidates-index", {
      candidates: candidateFromDB
    });
  });
});

app.get("/candidates/:name", function(req, res){
  var desiredName = req.params.name;
  Candidate.findOne({name: desiredName}).then(function(candidate){
    res.render("candidates-show", {
      candidate: candidate
    });
  });
});

// post form data
app.post("/candidates", function(req, res){
  // res.json(req.body);
  Candidate.create(req.body.candidate).then(function(newCandidate){
    res.redirect("/candidates/" + newCandidate.name);
  });
});

app.listen(app.get("port"), function(){
  console.log("It's aliiive!");
});
