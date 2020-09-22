// require modules
const express = require("express");
const ejs = require("ejs");
const _ = require('lodash');
const moment = require('moment');
const mongoose = require('mongoose');

const homeStartingContent = "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec eu finibus elit. Nunc blandit nisl in sollicitudin iaculis. Ut tellus elit, vestibulum vitae malesuada consequat, efficitur ac metus. In venenatis sem dolor, sed mollis turpis iaculis non. Suspendisse purus mauris, vehicula in lobortis nec, porta at lacus. Mauris eget feugiat nulla.";

const app = express();
app.set('view engine', 'ejs');
app.use(express.urlencoded({extended: true}));
app.use(express.static("public"));

// mongo db connection string
const connectionString = "";

mongoose.connect(
  connectionString,
  {useNewUrlParser: true, useUnifiedTopology: true}
);

// message object
const messageSchema = {
  name: String,
  content: {
    type: String,
    required: [true]
  },
  time: String
}

// mongodb object model
const Message = mongoose.model("Message", messageSchema);

// helper function to calculate the time elapsed since a message was posted
function timeFrom(date){
  return moment(date).fromNow();
}

// GET homepage
app.get("/", function(req, res){
  const posts = Message.find({}, function(err, result){
    if(err){
      console.log(err);
    }else {
      // console.log(result);
      res.render(
        "home",
        {startingContent: homeStartingContent, posts: result, mtm: timeFrom}
      );
    }
  });
});

// GET compose message page
app.get("/compose", function(req, res){
  res.render("compose");
});

// POST compose message page
app.post("/compose", function(req, res){
  const time = new Date().toISOString();
  let content = req.body.newBody;

  // store message content, author name, and post time in database
  const message = new Message({
    name: req.body.name,
    content: content,
    time: time
  });
  message.save();
  res.redirect("/");
});

// start server
let port = process.env.PORT;
if (port == null || port == ""){
  port = 3000;
}
app.listen(port, function() {
  console.log("Server started ...");
});
