const express = require('express');
const app = express();
const mongoose = require('mongoose');
const dotenv = require('dotenv')
const UserRouteUrls = require('./routes/User.route')
const questionListRouteUrls = require('./routes/QuestionList.route')
const AnswerListRouteUrls = require('./routes/AnswerList.route')
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
  origin: ['http://localhost:3000'],
  credentials: true
}));// used to accept http request from front end

app.use('/user', UserRouteUrls)
app.use('/question', questionListRouteUrls)
app.use('/answer', AnswerListRouteUrls) 




const PORT = process.env.PORT || 3001

app.listen(PORT, () => {
    console.log(`I am listening on port ${PORT}`);
})

//Body parser - help pass incoming and outgooing request
