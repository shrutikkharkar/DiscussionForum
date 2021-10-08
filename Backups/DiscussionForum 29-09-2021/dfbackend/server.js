const express = require('express');
const app = express();
const mongoose = require('mongoose');
const dotenv = require('dotenv')
const UserRouteUrls = require('./routes/User.route')
const questionListRouteUrls = require('./routes/QuestionList.route')
const AnswerListRouteUrls = require('./routes/AnswerList.route')
const TestRouteUrls = require("./routes/Test.route");
const cors = require('cors');
const jwt = require('jsonwebtoken');
// const passport = require("passport");
const user = require("./routes/User.route");
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
  origin: ['http://localhost:3000'],
  credentials: true
}));// used to accept http request from front end
app.use('/user', UserRouteUrls)
app.use('/question', questionListRouteUrls)
app.use('/answer', AnswerListRouteUrls)
app.use('/test', TestRouteUrls)

/*
// Passport middleware
app.use(passport.initialize());
// Passport config
require("./passport")(passport);
*/

// Routes
app.use("routes/User.route", user);


// app.post('users/login', async (req, res) => {
//   const user = await User.find(user => user.name = req.body.name)
//   if(user == null) {
//     return res.setStatus(400).send('Cannot find user')
//   }
//   try {
//     if(await bcrypt.compare(req.body.password, hashedPassword)){
//       res.send('Success')
//     }
//     else{
//       res.send('Not allowed')
//     }
//   }
//   catch(err) {
//     console.log(err)
//     res.status(500).send()
//   }
// })

/*Implementation of JWT

app.post('/login', (req, res) => {
  
  //User authentication

  const username = req.body.username
  const user = { name: username}

  const accessToken = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET)
  res.json({accessToken: accessToken})
  //To create key goto cmd -> node -> 
  //require('crypto').randomBytes(64).toString('hex')


})

function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization']
  const token = authHeader && authHeader.split(' ')[1]// this is pointing to TOKEN, (' ') is space between Bearer and TOKEN and [1] is position of TOKEN 
  if (token == null) return res.sendStatus(401)

  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
    if(err) return res.sendStatus(403)
    req.user = user
    next()
  })
}


*/

// const createToken = async() => {
//   const token = await jwt.sign({_id: "6110da0de372a240cc6b2224"}, process.env.ACCESS_TOKEN_SECRET, {
//     expiresIn: '1 day'
//   });
//   console.log(token)

//   const userVerify = await jwt.verify(token, process.env.ACCESS_TOKEN_SECRET)
//   console.log(userVerify)
// }


// createToken()
const PORT = process.env.PORT || 3001

app.listen(PORT, () => {
    console.log(`I am listening on port ${PORT}`);
})


/* 
//Body parser - help pass incoming and outgooing request
const express = require('express');
const app = express();
var bodyParser = require('body-parser');
const users = require('./routes/users');

app.use(bodyParser());
const MongoClient = require('mongodb').MongoClient

app.use('/users', users);

MongoClient.connect('mongodb+srv://users:users@cluster0.itxhs.mongodb.net/myFirstDatabase?retryWrites=true&w=majority', { useUnifiedTopology: true })
  .then(client => {
    console.log('Connected to Database')
    const db = client.db('discussionForum')
    const userDatabase = db.collection('users')

    app.get('/addUsers', (req, res) => {
      res.sendFile(__dirname + '/index.html');
    })
  
    app.post('/users', (req, res) => {
      userDatabase.insertOne(req.body)
        .then(result => {
          res.redirect('/addUsers')
          console.log(result)
        })
        .catch(error => console.error(error))
    })


    app.get('/', (req, res) => {
      db.collection('users').find().toArray()
        .then(results => {
          console.log(results)
        })
        .catch(error => console.error(error))
      // ...
    })
})



app.listen(3001, function() {
    console.log('I am listening on port 3001');
})

*/