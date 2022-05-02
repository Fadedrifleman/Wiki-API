const bodyParser = require('body-parser');
const express = require('express');
const mongoose = require('mongoose');
const ejs = require('ejs');

const app = express();

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

mongoose.connect("mongodb+srv://admin-shivam:Test123@wikiapi.cqzr5.mongodb.net/wikiDB");

const articleSchema =  {
    _id: String,
    title: String,
    content: String
};

const Article = mongoose.model("Article", articleSchema);

//<------------------Requests targeting all articles-------------------->//

const getArticles = (req, res) => {
    Article.find((err, foundArticles) => {
        if(!err) {
            res.send(foundArticles);
        } else {
            res.send(err);
        }
    });
};

const postArticle = (req, res) => {
    const newArticle = new Article({
        title: req.body.title,
        content: req.body.content
    });
    newArticle.save(function(err) {
        if(!err) {
            res.send("Article added successfully");
        } else {
            res.send(err);
        }
    });
};

const deleteArticles = (req, res) => {
    Article.deleteMany(function (err) {
        if (!err) {
            res.send("All articles deleted sucessfully");
        } else {
            res.send(err);
        }
    });
};

//<------------------Requests targeting a spicific articles articles-------------------->//

const getArticle = (req, res) => {
    Article.findById(req.params.articleId, (err, foundArticle) => {
        if(!foundArticle) {
            res.send("No article found");
        } else {
            res.send(foundArticle);
        }
    });
};

const putArticle = (req, res) => {
    Article.replaceOne(
        {_id: req.params.articleId},
        {title: req.body.title, content: req.body.content},
        (err) => {
            if(!err) {
                res.send("Article updated");
            } else {
                res.send(err);
            }
        }
    );
     
};

const patchArticle = (req, res) => {
    Article.updateOne(
        {_id: req.params.articleId},
        {$set: req.body},
        (err) => {
            if(!err) {
                res.send("Article updated");
            } else {
                res.send(err);
            }
        }
    );
};

const deleteArticle = (req, res) => {
    Article.deleteOne(
        {_id: req.params.articleId},
        (err) => {
            if(!err) {
                res.send("Article deleted");
            } else {
                res.send(err);
            }
        }
    )
};

//<---------------Request routes--------------->//

app.route("/articles").get(getArticles).post(postArticle).delete(deleteArticles);
app.route("/articles/:articleId").get(getArticle).put(putArticle).patch(patchArticle).delete(deleteArticle);

//<---------------Server port initialization-------------->//

let port = process.env.PORT;
if(port == null || port == ""){
    port = 3000;
}
app.listen(port, () => {
    console.log("server started at " + port);
});