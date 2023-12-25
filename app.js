import express from "express";
import bodyParser from "body-parser";
import axios from "axios"
import pg from "pg";

const app = express();
const port = 3000;
const apiKey = "AIzaSyD6QYAns6DJoRUlmXQd-ENE1ho-T0BpeGg"
app.use(bodyParser.urlencoded({extended:true}))
app.use(express.static("public"));

const db = new pg.Client({
    user:"postgres",
    host:"localhost",
    database:"bookReview",
    password:"postgres",
    port:5432
});
db.connect();
let books= [
    {
        id:1,
        title:"Rich dad Poor Dad",
        author:"Robert Kiyosaki",
        review:"Lorem ipsum dolor sit amet consectetur adipisicing elit. Ratione praesentium fugit repellat optio corporis? Fuga voluptas cumque quas expedita, debitis quisquam. Suscipit culpa necessitatibus dignissimos rem dolorum ut assumenda debitis?"
    },
    {
        id:2,
        title:"Psychology of money",
        author:"Robert Kiyosaki",
        review:"Lorem ipsum dolor sit amet consectetur adipisicing elit. Ratione praesentium fugit repellat optio corporis? Fuga voluptas cumque quas expedita, debitis quisquam. Suscipit culpa necessitatibus dignissimos rem dolorum ut assumenda debitis?"
    },
]

app.get("/",async(req,res)=>{
    try{
        const result = await db.query("select * from books")
        books = result.rows
        console.log(result);
        res.render("index.ejs",{books:books})
    }catch(err){
        console.log(err)
    }
    
})

app.post("/review",async(req,res)=>{
    const id = req.body.clickedID;
    const result = await db.query("select * from books where id=$1",[id]);
    const book = result.rows[0]
    const views = book.reviewview + 1;
    await db.query("update  books set reviewview = $1 where id = $2",[views,id]);
    res.render("review.ejs",{
        title:book.bookname,
        author:book.authorname,
        review:book.review,
        isbn:book.isbn,
        genre:book.genre,
        publishedYear:book.pubblishedyear,
        views:book.viewss,
        likes:book.likes,
        date:book.timeadded
    })
})

// Admin side

app.get("/admin",async(req,res)=>{
    res.render("admin.ejs")
})

app.get("/addreview",(req,res)=>{
    res.render("addreview.ejs");
})

app.post("/addreview",async(req,res)=>{
    const title = req.body.title;
    const author = req.body.author;
    const publishedYear = req.body.year;
    const review = req.body.review;
    const genre = req.body.genre;

    try{
        const book = await axios.get(`https://openlibrary.org/search.json?q=${title}&fields=isbn`)
        const isbn = book.data.docs[0].isbn
        console.log(isbn);
        try{
                db.query("insert into books(bookname,authorname,review,pubblishedyear,genre,isbn) values ($1,$2,$3,$4,$5,$6)",
                [title,author,review,publishedYear,genre,isbn[0]])
                res.redirect("/admin")
            }catch(err){
                console.log(err);
            }
    }catch(err){
        console.log(err);

    }
})
app.get("/approve",(req,res)=>{
    res.render("approve.ejs");
})
app.listen(port,()=>{
    console.log(`Server is running on port : ${port}`);
})