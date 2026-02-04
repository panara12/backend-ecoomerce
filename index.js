const express = require('express')
const app = express()
const mongoose = require('mongoose')
const port = process.env.PORT || 4000
const users = require('./routes/user')
const products = require('./routes/product')
const cart = require('./routes/cart')
const cors = require('cors')
const MongoStore = require("connect-mongo");
const session = require("express-session");
const cookieParser = require("cookie-parser");
const order = require("./routes/order");
const path = require('path');

// Add your current Vercel URL here
const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost:3000",
  "https://abhay-testing.netlify.app"
];

console.log('Allowed origins:', allowedOrigins);

// Enable CORS for all routes
app.use(
  cors({
    origin: function (origin, callback) {
      console.log('Request from origin:', origin); // Debug log
      
      // Allow requests with no origin (mobile apps, Postman, etc.)
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        console.log('CORS blocked origin:', origin);
        callback(new Error(`Not allowed by CORS. Origin: ${origin}`));
      }
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  })
);

// Add explicit preflight handling
app.options('*', cors());

app.use('/assets', express.static(path.join(__dirname, 'assets')));
app.use(express.json())
app.use(cookieParser());

// Session Middleware
app.use(
  session({
    name:'user',
    secret: process.env.SESSION_SECRET || "you_don't_know_that", 
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({
      mongoUrl: process.env.MONGODB_URL,
      collectionName: "sessions",
      ttl: 24 * 60 * 60
    }),
    cookie: {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
      maxAge: 24 * 60 * 60 * 1000,
    },
  })
);

// Test route to check if backend is working
app.get('/', (req, res) => {
  res.json({ 
    message: "Backend is running!",
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development'
  });
});

app.use('/user', users)
app.use('/product', products)
app.use('/cart', cart)
app.use("/order", order);

const mongoUrl = process.env.MONGODB_URL;

mongoose.connect(mongoUrl)
  .then(() => {
    console.log("MongoDB connected");
    app.listen(port, () => {
      console.log(`Server running on port ${port}`);
      console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
    })
  })
  .catch((error) => {
    console.log("MongoDB connection failed:", error);
  })
