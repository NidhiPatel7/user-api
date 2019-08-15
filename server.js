var mongoose = require('mongoose');
var express = require('express');
var bodyParser = require('body-parser');
var logger = require('morgan');
var cors = require('cors');

var User = require('./user-model');
//setup database connection
var connectionString = 'mongodb://user:api1234@cluster0-shard-00-00-mmxtf.mongodb.net:27017,cluster0-shard-00-01-mmxtf.mongodb.net:27017,cluster0-shard-00-02-mmxtf.mongodb.net:27017/test?ssl=true&replicaSet=Cluster0-shard-0&authSource=admin&retryWrites=true&w=majority';


mongoose.connect(connectionString,{ useNewUrlParser: true });
var  db = mongoose.connection;
db.once('open', () => console.log('Database connected'));
db.on('error', () => console.log('Database error'));

//setup express server
var app = express();
app.use(cors());//connect to diffrent domain
app.use(bodyParser.json()); // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded
app.use(logger('dev'));

//setup routes for testing
var router = express.Router();
router.get('/testing', (req, res) => {
  res.send('<h1>Testing is working</h1>')
})

//setup routes for users and get data for all users
router.get('/users', (req, res) => {

	User.find()//find for user-model
	.then((users) => {
      return res.json(users);//return users data
      // return res.json('hi');
	});
  // return res.json('hiiii');
})

//for get data of particular peson
//http://localhost:4000/userapi/users/1
router.get('/users/:id', (req, res) => {

	User.findOne({id:req.params.id})
	.then((User) => {
	    return res.json(User);
	});
})

//for add data
router.post('/users', (req, res) => {

	var User = new User();
	User.id = Date.now();
	
	var data = req.body;
	Object.assign(User,data);
	//Object.assign add data in old var like copy past {...varname}
	User.save()
	.then((User) => {
	  	return res.json(User);
	});
});


app.use('/userapi', router);

// launch our backend into a port
const apiPort = 4000;
app.listen(apiPort, () => console.log('Listening on port '+apiPort));