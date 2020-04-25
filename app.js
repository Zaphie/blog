//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
var _ = require("lodash");
const mongoose = require("mongoose");

const homeStartingContent = " Tú eres creador de tu vida, y tú puedes construir el camino de una vida más plena y mejor.Tú eres más fuerte que tus miedos. Tus fuerzas son mayores que tus dudas. Aunque tu mente esté confundida, tu corazón siempre sabe la respuesta. Con el tiempo, lo que hoy es difícil mañana será una conquista. Esfuérzate por lo que realmente te llena el alma. Y ten la virtud de saber esperar.";
const aboutContent = "Es solo un blog, creado como parte de un ejercicio. El resultado es que el usuario pueda escribir un post y subirlos a la web, se guarda en una Base de Datos. Hay más trabajo backEnd que frontEnd";
const contactContent = "Si eres mi amigo tienes mi contacto. Mua .";

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

let posts = [];
const mongoUrl = process.env.mongoUrl || "mongodb+srv://admin:test123@cluster0-xglba.mongodb.net/blogDB?retryWrites=true&w=majority";
mongoose.connect(mongoUrl, {useNewUrlParser: true, useUnifiedTopology: true});
// mongodb://localhost:27017/blogDB

const postSchema = new mongoose.Schema({
  title :String,
  content: String
});

const Post= mongoose.model("Post", postSchema);

app.get("/", function(req, res){
  Post.find({"title": {$exists:true}, "content": {$exists:true}}, function(err, posts){
    console.log (posts);
    res.render("home", {
      intro: homeStartingContent,
      posts: posts
    });
   });
  });



app.get("/about", function(req, res){
  res.render("about", {aboutString: aboutContent});
});


app.get("/contact", function(req, res){
  res.render("contact", {contactString: contactContent});
});

app.get("/compose", function(req, res){
  res.render("compose");
});

app.post("/compose", function(req, res){
  const post = new Post ({
    title : req.body.newtitle,
    content: req.body.newContentPost
  });
  post.save(function(err){
    if(!err){
      res.redirect("/");
    }
  });

  console.log(post.title);
  console.log(post.content);
  

});


app.get("/post/:postId", function(req, res){
  const requestedPostId = req.params.postId;
  Post.findOne({_id:requestedPostId}, function(err, post){
          res.render("post",{
        title: post.title,
        content: post.content
      });
    });
});




app.listen( process.env.PORT || 3000, function() {
  console.log("Server started on port 3000");
});
