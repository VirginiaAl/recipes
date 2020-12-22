import express from 'express';
import bodyParser from 'body-parser';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import logger from "morgan";
import cookieParser from "cookie-parser";
import session from "express-session";

import connectMongo from "connect-mongo";
const MongoStore = connectMongo(session);

import postsRoutes from './routes/posts.js';

const app = express();
dotenv.config();

app.use(bodyParser.json({limit: '30mb', extended: true})); //limit uploading pics
app.use(bodyParser.urlencoded({limit: '30mb', extended: true}));

var whitelist = ["http://localhost:3000"];
var corsOptions = {
  origin: function (origin, callback) {
    var originIsWhitelisted = whitelist.indexOf(origin) !== -1;
    callback(null, originIsWhitelisted);
  },
  credentials: true,
};
app.use(cors(corsOptions));
app.use(logger("dev"));
app.use(cookieParser());
app.use(express.static("public"));
app.use(
  session({
    secret: "Nico",
    resave: false,
    saveUninitialized: true,
    store: new MongoStore({ mongooseConnection: mongoose.connection }),
  })
);

//cors firts then routes, so we can access to data
app.use("/posts", postsRoutes);


const PORT = process.env.PORT || 5000;

mongoose
  .connect(process.env.CONNECTION_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then((x) =>
    console.log(`Connected to Mongo! DB Name: "${x.connections[0].name}"`)
  )
  .catch((error) => console.log(error.message));

mongoose.set('useFindAndModify', false)

app.listen(PORT, console.log("listening at 5000"));

