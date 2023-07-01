var express = require("express"),
 app = express(),
 bodyParser = require("body-parser"),
 mongoose = require("mongoose"),
 methodOverride = require("method-override"),
 expressSanitizer = require("express-sanitizer");

// APP CONFIG
mongoose.connect("mongodb+srv://simeondominic:Oud1dJPKKBHAmC2U@clustersimeon.nbcxvn4.mongodb.net/");
app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended: true}));
app.use(expressSanitizer());
app.use(methodOverride("_method"));

// MONGOOSE/MODEL CONFIG
var blogschema = new mongoose.Schema({
    title: String,
    image: String,
    body: String,
    created: {type: Date, default: Date.now}
});
var Blog = mongoose.model("Blog", blogschema);

//ROUTES

app.get("/", function(req, res){
    res.redirect("/blogs");
});
// INDEX ROUTE
app.get("/blogs", async function(req, res){
    try {
        var blogs = await Blog.find({});
        res.render("index", {blogs: blogs});
    }
    catch (err) {
        console.log(err);
    }
});

// NEW ROUTE
app.get("/blogs/new", function(req, res){
    res.render("new");
})

// CREATE ROUTE

app.post("/blogs", async function(req, res){
    // Get Data From Form
    var title = req.body.title;
    var image = req.body.image;
    var body = req.body.body;
    body = req.sanitize(body);
    var newblog = {title: title, image: image, body: body};
    // Create New Blog
    try {
        var newblog = await Blog.create(newblog);
        res.redirect("/blogs");
    }
    catch(err){
        res.render("new")
        console.log(err);
    }
});

// SHOW ROUTE

app.get("/blogs/:id", async function(req, res){
    // Save blog id to variable and trim
    var foundBlog = req.params.id.trim();
    // Find blog with provided id
    try {
        var blogs = await Blog.findById(foundBlog);
        res.render("show", {blogs: blogs});
    }
    catch(err){
        console.log(err);
    }
});

// EDIT ROUTE

app.get("/blogs/:id/edit", async function(req, res){
    // Save blog id to variable
    var foundBlog = req.params.id.trim();
    // Find blog with provided id
    try {
        var blogs = await Blog.findById(foundBlog);
        res.render("edit", {blogs: blogs});
    }
    catch(err){
        res.redirect("/blogs")
        console.log(err);
    }
})

// UPDATE ROUTE

app.put("/blogs/:id", async function(req, res){
    // save blog id to variable
    var updatedBlog = req.params.id.trim();
    // get blog data from form
    var title = req.body.title;
    var image = req.body.image;
    var body = req.body.body;
    body = req.sanitize(body);
    var blogData = {title: title, image: image, body: body};
    // Update blog
    try{
        await Blog.findByIdAndUpdate(updatedBlog, blogData)
        res.redirect("/blogs/" + updatedBlog)
    }
    catch(err){
        res.redirect("/blogs");
        console.log(err);
    }

})

// DELETE ROUTE

app.delete("/blogs/:id", async function(req, res){
    // save blog id to variable
    var deleteBlog = req.params.id.trim();
    // delete blog
    try{
        await Blog.findByIdAndDelete(deleteBlog);
        res.redirect("/blogs");
    }
    catch(err){
        res.redirect("/blogs");
        console.log(err);
    }
})
app.listen(3000, function(){
    console.log("Blog Server Started");
});