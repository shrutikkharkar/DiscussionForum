const express = require('express');
const app = express();

const BEPORT = process.env.BEPORT
const BEHOST = process.env.BEHOST
const FEPORT = process.env.FEPORT
const FEHOST = process.env.FEHOST
/* For socket io
const server = require('http').createServer(app);
const io = require('socket.io')(server, {cors: {origin: '*'} })


For socket io */

const server = require('http').createServer(app);
const io = require('socket.io')(server, {cors: {origin: '*'} })


const mongoose = require('mongoose');
const dotenv = require('dotenv')
const UserRouteUrls = require('./routes/User.route')
const questionListRouteUrls = require('./routes/QuestionList.route')
const AnswerListRouteUrls = require('./routes/AnswerList.route')
const CommentListRouteUrls = require('./routes/CommentList.route')
const NotificationListRouteUrls = require('./routes/NotificationList.route')
const TagListRouteUrls = require('./routes/TagList.route')

const cors = require('cors');
const cookieParser = require("cookie-parser");

dotenv.config(); //create process.env on run


mongoose.connect(process.env.DATABASE_ACCESS, 
  {
    useNewUrlParser: true,
    useUnifiedTopology: true
  }, 
  (err) => 
  {
    if(err) return console.error(err);
    console.log('Database connected');
  }
);


app.use(express.json()); // Hence we have activated bodyParser, helps to accept JSON
app.use(cookieParser());
app.use(cors({
  origin: [`http://localhost:3000`],
  credentials: true
}));// used to accept http request from front end

app.use('/user', UserRouteUrls)
app.use('/question', questionListRouteUrls)
app.use('/answer', AnswerListRouteUrls) 
app.use('/comment', CommentListRouteUrls) 
app.use('/notification', NotificationListRouteUrls) 
app.use('/tag', TagListRouteUrls) 



const PORT = process.env.PORT || 3001

// app.listen(PORT, () => {
//     console.log(`I am listening on port ${PORT}`);
// })



io.on('connection', (socket) => {
  console.log("User connected " + socket.id);

  // socket.on("message", (data) => {
  //   socket.broadcast.emit('message', data);
  //   //use broadcast when message is to be sent to everyone except you  madeChange
  // })
  socket.on("makeChange", (data) => {
    io.sockets.emit('madeChange', data);
    //use broadcast when message is to be sent to everyone except you  madeChange
  })

  // socket.on('sendLikedNotification', function (data) {
  //   socket.join(data.id); // We are using room of socket io

  //   io.sockets.in(data.id).emit('new_msg', {msg: 'Someone Liked your post'});

  // });

  

  //A special namespace "disconnect" for when a client disconnects
  socket.on("disconnect", () => console.log("Client disconnected"));

})


server.listen(PORT, () => {
  console.log(`I am listening on port socket ${PORT}`);
})
/* For socket io

server.listen(PORT, () => {
    console.log(`I am listening on port socket ${PORT}`);
})

io.on('connection', (socket) => {
  console.log("User connected " + socket.id);

  socket.on("message", (data) => {
    socket.broadcast.emit('message', data);
    //use broadcast when message is to be sent to everyone except you
  })
})

*/
//Body parser - help pass incoming and outgooing request
