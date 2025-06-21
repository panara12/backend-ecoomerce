const express = require('express')
const app = express()
const mongoose = require('mongoose')
const port=4000
const users = require('./routes/user')
const products = require('./routes/product')
const cart = require('./routes/cart')
const cors = require('cors')
const MongoStore =require("connect-mongo");
const session = require("express-session");
const cookieParser = require("cookie-parser");
const order = require("./routes/order");



const path = require('path');

const allowedOrigins = [
  "http://localhost:5173",
  "https://frontend-ecommmerce-j4j8nqepi-abhays-projects-c36dff84.vercel.app",
  "https://frontend-ecommmerce-git-main-abhays-projects-c36dff84.vercel.app"
];

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true, // Needed for authentication (cookies, sessions)
  })
);

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "https://frontend-ecommmerce-j4j8nqepi-abhays-projects-c36dff84.vercel.app");
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
  res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");
  next();
});

app.use('/assets', express.static(path.join(__dirname, 'assets')));
app.use(express.json())
app.use(cookieParser());

// Session Middleware
app.use(
    session({
      secret: "you_don't_know_that", 
      resave: false,
      saveUninitialized: false,
      store: MongoStore.create({
        mongoUrl: "mongodb+srv://panaraabhay2:abhay112004@cluster0.gmcq64y.mongodb.net/laser_db?retryWrites=true&w=majority&appName=Cluster0",
        collectionName: "sessions",
        ttl: 24 * 60 * 60 // Session expires in 1 day
      }),
      cookie: {
        httpOnly: true, 
        secure: true, 
        maxAge: 24 * 60 * 60 * 1000, // 1 day
      },
    })
  );


app.get('/',(req,res)=>{
    res.send("get it");
})

app.use('/user',users)
app.use('/product',products)
app.use('/cart',cart)
app.use("/order", order);


mongoose.connect('mongodb+srv://panaraabhay2:abhay112004@cluster0.gmcq64y.mongodb.net/laser_db?retryWrites=true&w=majority&appName=Cluster0')
.then(()=>{
    console.log("connnected");
    app.listen(port,()=>{
        console.log("running");
    })
})
.catch(()=>{
    console.log("not connnected");
})
