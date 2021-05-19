const express = require("express");
const bodyParser = require("body-parser");
const esjs = require("ejs");
const mongoose = require("mongoose");

const app = express();

app.set("view engine","ejs");

app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static("public"));

mongoose.connect("mongodb://localhost:27017/wikiDB",{useNewUrlParser:true,useUnifiedTopology:true});

const articleSchema = {
  title:String,
  content:String
}

const Article = mongoose.model("Article",articleSchema);

/////////////////////////////////////////Request Targeting all Articles ///////////



//HTTP VERBS FOR RESTful API PART 1: /articles
// Metoda 1-clasic

//GET - Fetches all the articles

/*
app.get("/articles",function(req,res){
  Article.find(function(err,foundArticles){
    if(!err){
    res.send(foundArticles); // ne trimite toate datele din baza de date catre user
  }else{
    res.send(err);
  }
  });
});

//Post - Creates one new article
//folosim postman pentru a salva API
app.post("/articles",function(req,res){
  //creaza un nou articol folosindu-se de modelul Article
  const newArticle = new Article({
    title: req.body.title, //face request catre postman si titlu
    content: req.body.content // face request catre postman si content
  });

  //functia err verifica daca avem erori si face sa se opreasca , sa nu functioneze la nesfarsit postman
  newArticle.save(function(err){
    if(!err){
      res.send("Succesfully added a new article");
    }else{
      res.send(err);
    }
  }); //salveaza articolul in baza noastra de date

});

//Delete - Deletes all the articles

app.delete("/articles",function(req,res){
  Article.deleteMany(function(err){ // deoarece nu am pus nici o conditie functie de care sa stergem se vor sterge toate articolele
    if(!err){
      res.send("Succesfully deleted all articles");
    }else{
      res.send(err);
    }
  })
})
*/


//Metoda 2- chained route handlers using express
//Chained route handlers using express -pentru a scrie mai putin cod sa nu repetam la fiecare app ce route vrem putem face astfel:
app.route("/articles")

  .get(function(req,res){
  Article.find(function(err,foundArticles){
    if(!err){
    res.send(foundArticles); // ne trimite toate datele din baza de date catre user
  }else{
    res.send(err);
  }
  });
})

  .post(function(req,res){
  //creaza un nou articol folosindu-se de modelul Article
  const newArticle = new Article({
    title: req.body.title, //face request catre postman si titlu
    content: req.body.content // face request catre postman si content
  });

  //functia err verifica daca avem erori si face sa se opreasca , sa nu functioneze la nesfarsit postman
  newArticle.save(function(err){
    if(!err){
      res.send("Succesfully added a new article");
    }else{
      res.send(err);
    }
  }); //salveaza articolul in baza noastra de date

})

  .delete(function(req,res){
  Article.deleteMany(function(err){ // deoarece nu am pus nici o conditie functie de care sa stergem se vor sterge toate articolele
    if(!err){
      res.send("Succesfully deleted all articles");
    }else{
      res.send(err);
    }
  })
});

//////////// Request Targeting A specific Article ////////////

//html URL encoding at w3schools.com pentru a vedea ce trebuie sa punem in url in functie de caracter
//ex: space = %20

app.route("/articles/:articleTitle") // :articleTitle - ne selecteaza dinamic cautarile clientului
// GET REQUEST ON A SPECIFIC ARTICLE
  .get(function(req,res){
    Article.findOne({title: req.params.articleTitle },function(err,foundArticle){//req.params.articleTitle - face request la ce s a scris in url si verifica daca este acelasi cu titlul
      if(foundArticle){
        res.send(foundArticle);
      }else{
        res.send("The Article doesn't exist");
      };
    });
  })
  //PUT REQUEST
//Put a specific article - replace one item in our database with an item sent by the client
//atunci cand utilizezi put si de exemplu clientul modifica doar content nu si titlul atunci titlu v-a fii sters iar obiectul in baza de date v-a ramane doar cu content
  .put(function(req,res){
    Article.update(
      {title:req.params.articleTitle},//conditia dupa care dorim sa modificam
      {title:req.body.title, content:req.body.content},//ce dorim sa modificam,cautam folosing body parser
      {overwrite:true},//trebuie de fiecare data
      function(err){//functia care verifica de erori si afiseaza
        if(!err){
          res.send("Succesfully Updated Document");
        }else{
          res.send(err);
        }
      })

  })
  //PATCH request
//update a particular article but only the fields that we actually provided data for
  .patch(function(req,res){
    Article.update(
    {title:req.params.articleTitle},
    {$set: req.body},//prin $set facem update doar la ce dorim noi,folosing doar req.body se v-a face update dinamic la ce doreste userul,nu conteaza daca este title sau content
    function(err){
      if(!err){
        res.send("Succesfully patched the article");
      }
    }
  )
})
//Delete request for a specific article
//delete a specific article
  .delete(function(req,res){
    Article.deleteOne(
      {title:req.params.articleTitle},
      function(err){
        if(!err){
          res.send("Succesfully deleted the Article")
        }else{
          res.send(err)
        }
      }
    )
  });










app.listen(3000, function(){
  console.log("Server is running on port 3000");
})
