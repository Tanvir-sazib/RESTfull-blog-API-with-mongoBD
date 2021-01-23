const express = require("express");
const app = express();
const bodyParser = require("body-parser")
const mongoose = require("mongoose")
app.use(bodyParser.urlencoded({extended:true }));
app.set('view engine','ejs');
app.use(express.static("public"));

mongoose.connect("mongodb://localhost:27017/wikiDB",{useNewUrlParser: true, useUnifiedTopology:true});

const articleSchema = mongoose.Schema({
    title: String,
    content: String
})

const Article = mongoose.model("article",articleSchema);

app.route("/articles")

.get(function(req, res){
    Article.find({},function(err,foundArticle){
        if(!err){
            res.send(foundArticle);
        }else{
            res.send(err);
        }
        
    })
})

.post(function(req,res){
    const newArticle = new Article({
        title: req.body.title,
        content: req.body.content
    })
    newArticle.save(function(err){
        if(err){
            res.send(err);
        }else{
            res.send("successfully added an article.")
        }
    });
})

.delete(function(req,res){
    Article.deleteMany({},function(err){
        if(!err){
            res.send("Successfully deleted all articles.")
        }else{
            res.send(err);
        }
    })
});


app.route("/articles/:articleTitle")
.get(function(req,res){
    Article.findOne({title: req.params.articleTitle},function(err,foundItem){
        if(!err){
            res.send(foundItem);
        }else{
            res.send("No article mached at this Title!")
        }
    })
})
.put(function(req,res){
    Article.update({title:req.params.articleTitle},
        {title:req.body.title, content:req.body.content},
        {overwrite:true},
        function(err){
            if(!err){
                res.send("Successfully updated article.");
            }
        })

})
.patch(function(req,res){
    Article.update({title:req.params.articleTitle},
        {$set:req.body},
        function(err){
          if(!err){
              res.send("Successfully updated the article.")
          }  
        })
}) 
.delete(function(req,res){
    Article.deleteOne({title:req.params.articleTitle},
        function(err){
            if(!err){
                res.send('Successfully deleted item.');
            }
        })
})
app.listen(3000,function(){
    console.log("server is running on port 3000.");
})