var db = require('./db.js');
var request = require('request');
var connect = db.conn();

//return member's status
exports.liveordie = function(req, res){
	var uid = parseInt(req.body.uid);
	var info = {status : req.body.status};

	var ret = new Object;
	ret.uid = parseInt(req.body.operator_uid);
	ret.object = "member";
	ret.action = "liveordie";

	var check = !isNaN(ret.uid) && !isNaN(uid);
	//parse string to bool and invert
	if ((info.status == "true") || (info.status == "1")) info.status = false;
	else if (info.status == "false" || (info.status == "0")) info.status = true;
	else check = 0;

	if (check) {
		connect.query("UPDATE member SET ? WHERE uid = "+uid, info, function(err, result){
			if (err){
				ret.brea = 1;
				res.json(ret);
				console.log("Failed! Member liveordie with database error.");
			}
			else {
				if (result.changeRows) {
					ret.brea = 0;
					ret.payload = {
						type : "Attribute Name",
						status : info.status
					};
					res.json(ret);
					console.log("Success! Member liveordie change successfully.");
				}
				else {
					ret.brea = 3;
					res.json(ret);
					console.log("Failed! Member liveordie database has nothing to change.");
				}
			}
		});
	}
	else {
		ret.brea = 2;
		res.json(ret);
		console.log("Failed! Member liveordie with uncomplete values.");
	}
}

//update member's location
exports.update = function(req, res){
	var member = new Object;
	member.uid = parseInt(req.body.uid);
	member.position_e = parseFloat(req.body.position_e);
	member.position_n = parseFloat(req.body.position_n);

	var ret = new Object;
	ret.uid = parseInt(req.body.operator_uid);
	ret.object = "member";
	ret.action = "update";

	var check = 1;
	for (var key in member) {
		check = check && !isNaN(member[key]);
	}
	check = check && !isNaN(ret.uid);
	if (check) {
		connect.query("UPDATE member SET ? WHERE uid = "+member.uid, member, function(err, result){
			if (err) {
				ret.brea = 1;
				res.json(ret);
				console.log("Failed! Member update with database error.");
			}
			else {
				if (result.changeRows) {
					ret.brea = 0;
					res.json(ret);
					console.log("Success! Member update successfully.");
				}
				else {
					ret.brea = 3;
					res.json(ret);
					console.log("Failed! Member database has nothing to change.");
				}
			}
		});
	}
	else {
		ret.brea = 2;
		res.json(ret);
		console.log("Failed! Member update with uncomplete values.");
	}
}

//return member's information
exports.read = function(req, res){
	var uid = parseInt(req.query.uid);

	var ret = new Object;
	ret.uid = parseInt(req.query.operator_uid);
	ret.object = "member";
	ret.action = "read";

	if (!isNaN(ret.uid)) {
		if (!isNaN(uid)) {
			connect.query("SELECT * FROM member WHERE uid = "+uid, function(err, rows){
				if (err) {
					ret.brea = 1;
					res.json(ret);
					console.log("Failed! (uid) Member read with database error.");
				}
				else {
					if (rows.length == 0) {
						ret.brea = 3;
						res.json(ret);
						console.log("Failed! (uid) Member database is still empty.");
					}
					else {
						ret.brea = 0;
						ret.payload = {
							type : "objects",
							objects : rows
						}
						res.json(ret);
						console.log("Success! (uid) Member data read successfully.");
					}
				} 
			});
		}
		else {
			connect.query("SELECT * FROM member", function(err, rows){
				if (err) {
					ret.brea = 1;
					res.json(ret);
					console.log("Failed! Member read with database error.");
				}
				else {
					if (rows.length == 0) {
						ret.brea = 3;
						res.json(ret);
						console.log("Failed! Member database is still empty.");
					}
					else {
						ret.brea = 0;
						ret.payload = {
							type : "objects",
							objects : rows
						}
						res.json(ret);
						console.log("Success! Member data read successfully.");
					}
				}
			});
		}
	}
	else {
		ret.brea = 2;
		res.json(ret);
		console.log("Failed! Member read without operator_uid.");
	}
}
//edit member's money
exports.money = function(req, res){
	var uid = parseInt(req.body.uid);
	var amount = parseInt(req.body.money_amount);

	var ret = new Object;
	ret.uid = parseInt(req.body.operator_uid);
	ret.object = "member";
	ret.action = "money";

	var info;
	var check = !isNaN(ret.uid) && !isNaN(uid) && !isNaN(amount);
	if (check) {
		connect.query("SELECT money FROM member WHERE uid = "+uid, function(err, rows){
			if (err){
				ret.brea = 1;
				res.json(ret);
				console.log("Failed! Member money get with database error.");
			}
			else {
				if (rows.length == 0) {
					ret.brea = 3;
					res.json(ret);
					console.log("Failed! Member database is still empty.");
				}
				else {
					ret.brea = 0;
					info = rows;
					console.log("Success! Member money get successfully.");
				}
			}
		});
		if (ret.brea == 0) {
			info.money = info.money + amount;
			connect.query("UPDATE member SET ? WHERE uid = "+uid, info, function(err, result){
				if (err){
					ret.brea = 1;
					res.json(ret);
					console.log("Failed! Member money update with database error.");
				}
				else {
					if (result.changeRows) {
						ret.brea = 0;
						res.json(ret);
						console.log("Success! Member money update successfully.");	
					}
					else {
						ret.brea = 3;
						res.json(ret);
						console.log("Failed! Member money database has nothing to change.");
					}
				}
			});
		}
	}
	else {
		ret.brea = 2;
		res.json(ret);
		console.log("Failed! Member money with uncomplete values.");
	}
}
//get emergency
exports.callhelp = function(req, res){
	var member = new Object;
	member.uid = parseInt(req.body.uid);
	member.position_e = parseFloat(req.body.position_e);
	member.position_n = parseFloat(req.body.position_n);

	var ret = new Object;
	ret.uid = parseInt(req.body.operator_uid);
	ret.object = "member";
	ret.action = "callhelp";

	var check = 1;
	for (var key in member) {
		check = check && !isNaN(member[key]);
	}
	check = check && !isNaN(ret.uid);
	if (check) {
		ret.brea = 0;
		console.log("Help!!!");
		console.log("At ("+member.position_e+","+member.position_n+")");

		connect.query("SELECT name FROM member WHERE uid = "+member.uid, function(err, rows){
			if (err){
				ret.brea = 1;
				res.json(ret);
				console.log("Failed to get name! Member name search with database error.");
			}
			else {
				if (rows.length == 0) {
					ret.brea = 3;
					res.json(ret);
					console.log("Failed to get name! Member database is still empty.");
				}
				else {
					ret.brea = 0;
					console.log(rows.name+" press the help button!");
				}
			}
		});
	}
	else {
		ret.brea = 2;
		res.json(ret);
		console.log("Someone needs help but send uncomplete values!!!");
		console.log("Please check if someone really needs help!!!");
	}
}

// Login auth
exports.login = function(req, res){
	var email = req.body.email;
	var password = req.body.password;

	var ret = new Object;
	ret.object = "member";
	ret.action = "login";

	var check = (email!=null) && (password!=null);
	if (check) {
		request.get({url:'http://www.ee.nthu.edu.tw/engcamp/api/auth.php?token=nthuee&email='+email+'&id='+password},
			function optionalCallback(err, httpResponse, body) {
				if (err) {
					console.error("Failed! Login auth access failed:", err);
					ret.uid = 0;
					ret.brea = 1;
					ret.payload = {
						type : "Attribute Name",
						correct : 1
					}
				}
				else if (httpResponse.statusCode == 200){
					console.log("Success! Login auth access success. User auth success.");
					var data = JSON.parse(body);
					ret.uid = data.rid;
					ret.brea = 0;
					ret.payload = {
						type : "Attribute Name",
						correct : 0
					}
				}
				else{
					console.log("Failed! Login auth access success. User auth failed.");
					ret.uid = 0;
					ret.brea = 0;
					ret.payload = {
						type : "Attribute Name",
						correct : 1
					}
				}
				res.json(ret);
			}
		);
	}
	else {
		ret.brea = 2;
		res.json(ret);
		console.log("Failed! Login with uncomplete values.");
	}
}