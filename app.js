import express from "express";
import bodyParser from "body-parser";
import axios from "axios"
import pg from "pg";

const app = express();
const port = 3000;
app.use(bodyParser.urlencoded({extended:true}))
app.use(express.static("public"));
const genres = [
    "Literary Fiction",
    "Historical Fiction",
    "Science Fiction",
    "Fantasy",
    "Mystery",
    "Thriller",
    "Horror",
    "Romance",
    "Adventure",
    "Western",
    "Humor/Satire",
    "Dystopian",
    "Magical Realism",
    "Biography/Autobiography",
    "Memoir",
    "Self-Help/Personal Development",
    "Business/Economics",
    "Psychology",
    "Philosophy",
    "History",
    "Politics/Government",
    "True Crime",
    "Travel",
    "Science/Nature",
    "Health/Fitness",
    "Cookbooks/Food",
    "Art/Photography",
    "Epic Poetry",
    "Lyric Poetry",
    "Sonnets",
    "Free Verse",
    "Haiku",
    "Narrative Poetry",
    "Confessional Poetry",
    "Spoken Word Poetry",
    "Tragedy",
    "Comedy",
    "Historical Drama",
    "Absurdist Drama",
    "Musical Theater",
    "Play Anthologies",
    "Picture Books",
    "Middle Grade Fiction",
    "Young Adult (YA) Fiction",
    "Children's Fantasy",
    "Adventure Stories for Kids",
    "Bible Studies",
    "Religious Fiction",
    "Spiritual Non-Fiction",
    "Sacred Texts",
    "Academic/Textbooks",
    "Reference Books",
    "Coffee Table Books",
    "DIY/Crafts",
    "Gardening",
    "Graphic Novels/Comics",
    "LGBTQ+ Literature"
  ];

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

let adminBooks = [
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
},]
app.get("/",async(req,res)=>{
    console.log("enetered home");
    try{
        const result = await db.query("select * from books")
        books = result.rows
        res.render("index.ejs",{books:books})
    }catch(err){
        console.log(err)
    }
    
})

app.post("/review",async(req,res)=>{
    console.log("enetered review");
    const id = req.body.clickedID;
    const result = await db.query("select * from books where id=$1",[id]);
    const book = result.rows[0]
    const views = book.viewss + 1;
    await db.query("update  books set viewss = $1 where id = $2",[views,id]);
    res.render("review.ejs",{
        title:book.bookname,
        author:book.authorname,
        review:book.review,
        isbn:book.isbn,
        genre:book.genre,
        publishedYear:book.pubblishedyear,
        views:2,
        likes:book.likes,
        date:book.timeadded
    })
})

// Fn

async function insert(title,author,review,publishedYear,genre){
    try{
        const book = await axios.get(`https://openlibrary.org/search.json?q=${title}&fields=isbn`)
        const isbn = book.data.docs[0].isbn[0]
        console.log(isbn);
        try{
                db.query("insert into books(bookname,authorname,review,pubblishedyear,genre,isbn) values ($1,$2,$3,$4,$5,$6)",
                [title,author,review,publishedYear,genre,isbn])
            }catch(err){
                console.log(err);
            }
    }catch(err){
        console.log(err);

    }
}

async function deleteA(id){
    try{
        await db.query("select * from adminbooks where id = $1",[id]);
        alert("Deleted Successfully")
       }catch(err){
        console.log(err);
       }
}

// Admin side

app.get("/admin",async(req,res)=>{
    console.log("enetered get admin");
    try{
        const result = await db.query("select * from books order by timeadded desc")
        books = result.rows
        res.render("admin.ejs",{books:books})
    }catch(err){
        res.render("admin.ejs",{
            error:"Can't Access the database at the moment"
        })
    }
})

app.get("/addreview",(req,res)=>{
    console.log("enetered get addreview ");
    res.render("addreview.ejs",{genres:genres});
})

app.post("/addreview",async(req,res)=>{
    const title = req.body.title;
    const author = req.body.author;
    const publishedYear = req.body.year;
    const review = req.body.review;
    const genre = req.body.genre;

    await insert(title,author,review,publishedYear,genre)
    res.redirect("/admin")
    
})
app.get("/approve",async(req,res)=>{
    try{
        const result = await db.query("select * from adminbooks");
        console.log(result.rows);
        res.render("approve.ejs",{books:result.rows});
    }catch(err){
        console.log(err);
    }

    
})

app.post("/approve",async(req,res)=>{
    const id = req.body.approve
    try{
        const result = await db.query("select * from adminbooks where id = $1",[id]);
        const book = result.rows[0]
        if(!book){
            await insert(book.title,book.authorname,book.review,book.pubblishedyear,book.genre)
            await deleteA(id)
        }
        
    }catch(err){
        console.log(err);
    }finally{
        res.redirect("/admin")
        alert("Book added successfully");
    }
})

app.post("/disapporve",async(req,res)=>{
   const id =  req.body.disapprove
   try{
    await deleteA(id)
   }catch(err){
    console.log(err);
   }finally{
    res.redirect("/approve")
   }
})

app.post("/read",async(req,res)=>{
    const id = req.body.read
    try{
        const result = await db.query("select * from adminbooks where id = $1",[id])
        const book = result.rows[0]
        console.log(id);
        res.render("read.ejs",{
            title:book.bookname,
            author:book.authorname,
            genre:book.genre,
            publishedYear:book.pubblishedyear,
            review:book.review,
            views:book.viewss
        });
    }catch(err){
        console.log(err);
    }
})
app.post("/edit",async(req,res)=>{
    console.log("enetered edit");
    const id = req.body.edit
    try{
        const result = await db.query("select * from books where id = $1",[id])
        const book = result.rows[0]
        res.render("edit.ejs",{
            id:id,
            title:book.bookname,
            author:book.authorname,
            review:book.review,
            genrees:book.genre,
            publishedYear:book.pubblishedyear,
            genres:genres
        })
    }catch(err){
        res.render("edit.ejs",{
            error:"Not able to load"
        })
    }
})

app.post("/update",async(req,res)=>{
    console.log("enetered update");
    const id = req.body.id
    const title = req.body.title
    const author = req.body.author
    const review = req.body.review
    const year = req.body.year
    const genre = req.body.genre
    try{
        console.log(review);
        const up = await db.query("update books set bookname = $1,authorname = $2,review = $3,pubblishedyear=$4,genre=$5 where id=$6",[title,author,review,year,genre,id])
        console.log(up);
        res.redirect("/admin")
    }catch(err){
        console.log(err);
    }
})

app.post("/delete",async(req,res)=>{
    const id = req.body.delete
    try{
        await db.query("delete from books where id = $1",[id])
        res.redirect("/admin");
    }catch(err){
        console.log(err)
    }
})
app.listen(port,()=>{
    console.log(`Server is running on port : ${port}`);
})