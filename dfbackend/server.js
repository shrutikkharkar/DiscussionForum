const express = require('express');
const app = express();


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
  origin: [`${process.env.FEHOST}:${process.env.FEPORT}`],
  credentials: true
}));// used to accept http request from front end

app.use('/user', UserRouteUrls)
app.use('/question', questionListRouteUrls)
app.use('/answer', AnswerListRouteUrls) 
app.use('/comment', CommentListRouteUrls) 
app.use('/notification', NotificationListRouteUrls) 
app.use('/tag', TagListRouteUrls) 



// const PORT = process.env.PORT || 3001

// app.listen(PORT, () => {
//     console.log(`I am listening on port ${PORT}`);
// })



io.on('connection', (socket) => {
  console.log("User connected " + socket.id);
  console.log( socket.client.conn.server.clientsCount + " users connected" );

  // socket.on("message", (data) => {
  //   socket.broadcast.emit('message', data);
  //   //use broadcast when message is to be sent to everyone except you  madeChange
  // })

  // socket.on("makeChange", (data) => {
  //   io.sockets.emit('madeChange', data);
  //   //use broadcast when message is to be sent to everyone except you  madeChange
  // })

  // socket.on('askQuestion', (data) => {
  //   console.log(data);
  //   io.sockets.emit('askedQuestion', "Someone has just asked a question!");
  // })

  let onJoinAnswerPage = (data) => {
    socket.join(data.questionID); // We are using room of socket io
    console.log("QUESTION ID " + data.questionID)

    socket.on('newAnswer', function(data){
      io.sockets.in(data.questionID).emit('getNewAnswers', {msg: 'New answer to this question'});
    })
  }
  socket.on('join', onJoinAnswerPage);
  socket.off('join', onJoinAnswerPage);


  let onJoinQuestionPage = (data) => {
    socket.join(data); // We are using room of socket io
    console.log("Joined QUESTION page " + data)

    socket.on('newQuestion', function(data){
      io.sockets.in(data).emit('getNewQuestions', {msg: 'New question added'});
    })
  }
  socket.on('joinQuestionPage', onJoinQuestionPage);
  socket.off('joinQuestionPage', onJoinQuestionPage);

  


  // io.sockets.in('id').emit('askedQuestion', {msg: 'Someone asked new message'});

  // socket.on('sendLikedNotification', function (data) {
  //   socket.join(data.id); // We are using room of socket io

  //   io.sockets.in(data.id).emit('new_msg', {msg: 'Someone Liked your post'});

  // });

  

  //A special namespace "disconnect" for when a client disconnects
  socket.on("disconnect", () => {
    console.log("User disconnected");
    socket.removeAllListeners();
  });

})


server.listen(process.env.BEPORT, () => {
  console.log(`I am listening on port socket ${process.env.BEPORT}`);
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
