var _ 			= require('lodash'),
	express 	= require('express'),
	bodyParser 	= require('body-parser'),
	User 		= require('./models/user'),
	Bookshelf 	= require('./config/database'),
	cors		= require('cors'),
	jwt			= require('jsonwebtoken'),
	constants	= require('./config/constants');

var	app 		= express();
// body-parser middleware for handling request variables
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.use(cors());

var Users = Bookshelf.Collection.extend({
	model: User
});

// application routing
var router = express.Router();
router.route('/users').get(user_list);  // fetches all users
router.route('/users').post(new_user); // creates a new user
router.route('/users/:id').get(user_obj); // fetch an user's details
router.route('/users/:id').put(update_user_obj); // update user's details
router.route('/users/:id').delete(delete_user_obj); // delete an user

router.route('/sessions/create').post(login_user);

app.use('/api', router);

// Launch NodeJS server with port #3002
app.listen(3002, function(){
	console.log('Express server listening on port %d in %s mode',  3002, 'development');
});

// private functions
var retrieved_users = null;  // yet to retrieve users

(function retrieve_users(){
	console.log('Retrieve User List');
	Users.forge().fetch()
		.then(user_fetch_success)
		.catch(user_fetch_error);
//	var result = {error:true, data:{message: 'Incomplete Retrieve'}};

	function user_fetch_success(collection){
		console.log('User Fetch Success...');
		retrieved_users = { error: false, data: collection.toJSON() };
	}
	function user_fetch_error(err){
		console.log('User error...');
		console.log(err);
		retrieved_users = { error: true, data: {message: err.message} };
	}
//	return result;
})();


// functions referred in router above

function user_list(request, response){
	console.log('Get User List');
	Users.forge().fetch()
		.then(user_fetch_success)
		.catch(user_fetch_error);

	function user_fetch_success(collection){
		console.log('User Fetch Success...');
		response.json({error: false, data: collection.toJSON()});
	}
	function user_fetch_error(err){
		console.log('User error...');
		console.log(err);
		response.status(500).json({error: true, data: {message: err.message}});	
	}

}

function new_user(request, response){

	console.log('New user being added...');
	console.log(request.body);
	console.log(request.query);

	User.forge({
		name: request.body.userName,
		first_name: request.body.firstName,
		last_name: request.body.lastName,
		email: request.body.email,
		password: request.body.password
	})
	.save()
	.then(new_user_success)
	.catch(new_user_error);

	function new_user_success(user){
		//response.json({error: false, data:{id: user.get('id')}});
		response.json({error: false, data:{user}});
	}
	function new_user_error(err){
		response.status(500).json({error: true, data:{message:err.message}});
	}

}

function user_obj(request, response){
	console.log('Request object is: ');
	console.log(request);
	User.forge({id: request.params.id})
		.fetch()
		.then(user_obj_success)
		.catch(user_obj_error);

	function user_obj_success(user){
		if(!user){
			console.log('No user found');
			response.status(404).json({error: true, data:{}});
		} else {
			console.log('user is found');
			console.log(user);
			response.json({error: false, data: user.toJSON()});
		}
	}

	function user_obj_error(err) {
		console.log('Error in finding user');
		console.log(err);
		response.status(500).json({error: true, data:{message: err.message}});
	}

}

function update_user_obj(request, response){
	User.forge({id: request.params.id}).fetch({require: true})
		.then(update_user_obj_success)
		.catch(update_user_obj_error);

	function update_user_obj_success(user){
		user.save({
			name: request.body.name || user.get('name'),
			email: request.body.email || user.get('email')
		}).then(function(){
			response.json({error: false, data:{message: 'User details updated'}});
		})
		.catch(function(){
			response.status(500).json({error: true, data: {message: err.message}});
		});
	}
	function update_user_obj_error(err){
		response.status(500).json({error: true, data: {message: err.message}});
	}

}

function delete_user_obj(request, response){
	User.forge({id: request.params.id}).fetch({require: true})
		.then(delete_user_obj_success)
		.catch(delete_user_obj_error);

	function delete_user_obj_success(user){
		user.destroy()
			.then(function(){
				response.json({error: true, data: {message: 'User successfully deleted'} });
			})
			.catch(function(err){
				response.status(500).json({error: true, data: {message: err.message}});
			});
	}
	function delete_user_obj_error(err){
		response.status(500).json({error: true, data: {message: err.message}});
	}
}

function create_token(user){
	return jwt.sign(_.omit(user, 'password'), constants.secret, {expiresIn: 60*60*2});
}

function login_user(request, response){
	console.log('Login user...');
	console.log('Email Received as: '+request.body.email);
	console.log('Password Received as: '+request.body.password);

	if( !request.body.email || !request.body.password){
		console.log('Email and Password needed....');
		return response.status(400).send("Email and Password needed");
	}
	
	var user;
	console.log('Retrived Users data: ');
	console.log(retrieved_users.data);

	if(retrieved_users.error){
		return response.status(400).send("Error in User List");	
	}
	user = _.find(retrieved_users.data, {email: request.body.email});

	console.log('User object:');
	console.log(user);

	if(!user){
		console.log("Email or Password do not match");
		return response.status(401).send("Email or Password do not match");
	}
	if(user.password !== request.body.password){
		console.log("Email or Password don't match");
		return response.status(401).send("Email or Password don't match");
	}
	console.log('Login success...');
	response.status(201).send({
		id_token: create_token(user)
	})
}

