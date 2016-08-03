var http = require('http');

var options = {
	hostname: 'ipinfo.io',
	port: 80,
	path: '/json',
	method: 'GET'
};

var req = http.request(options, function(res){
	var body = '';

	res.setEncoding('utf8');
	res.on('data', function(chunk){
		body += chunk;
	});
	res.on('end', function(){
		//console.log('body: ');
		//console.log(body);
		var json = JSON.parse(body);
		console.log('Your location: '+json.city+', '+json.region);
		console.log('Your country: '+json.country);
		console.log('Your Loc: '+json.loc);
		console.log('Org: '+json.org);
		console.log('IP Address: '+json.ip);
	});
});

req.end();