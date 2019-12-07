var express=require('express');
const keys = require('./config/keys');
const stripe = require('stripe')(keys.stripeSecretKey);
var Nexmo=require('nexmo');

var nodemailer = require('nodemailer');

var app=express();

var bodyParser=require('body-parser');

var urlencodedParser=bodyParser.urlencoded({extended: false});

const nexmo = new Nexmo({
  apiKey: '0aabd16f',
  apiSecret: 'sxBlxAb8zkpkxPSU'
},{debug:true});


app.set("view engine",'ejs');

app.use(express.static('./public'));

var mongoose=require('mongoose');

mongoose.connect('mongodb://booking:booking1@ds237932.mlab.com:37932/projectticketbooking');

var RFlightSchema = new mongoose.Schema({
	airline:String,
	returntime:String,
	arrivetime:String,
	duration:String,
	returnairport:String,
	returnarrive:String,
	returndate:String,
	price:String,
	passenger:String,
	from:String,
	to:String,
	windowside:Number,
	aisle:Number,
	middle:Number
}); 

var DflightSchema = new mongoose.Schema({
	airline:String,
	departtime:String,
	arrivetime:String,
	duration:String,
	departairport:String,
	departarrive:String,
	departdate:String,

	// 1.) this only - take price as number and after stripe see

	price:String,
	passenger:String,
	from:String,
	to:String,
	windowside:Number,
	aisle:Number,
	middle:Number
}); 

var ConfirmSchema= new mongoose.Schema({
	airline:String,
	from:String,
	to:String,
	price:String,
	seatprefered:String,
	name:String,
	age:Number
});

var PassengerSchema= new mongoose.Schema({
	fname:String,
	lname:String,
	dob:String,
	nationality:String,
	country:String,
	phone:String,
	email:String
});

var CardSchema= new mongoose.Schema({
	cardtype:String,
	name:String,
	cardnumber:String,
	expirydate:String,
	securitycode:String
});

var Rflight= mongoose.model('Rflight',RFlightSchema);
var Dflight= mongoose.model('Dflight',DflightSchema);
var Confirm= mongoose.model('Confirm',ConfirmSchema); 
var Passenger= mongoose.model('Passenger',PassengerSchema); 
var Card= mongoose.model('Card',CardSchema); 

var rflightOne= Rflight({windowside:20,aisle:11,middle:0,airline:'Indigo',returntime:'21:00',arrivetime:'23:33',
						duration:'2H10M',returnairport:'Maharana Pratap Airport',returnarrive:'Udaipur-Mumbai',
						returndate:'01/04/2018',price:'5000 rupees',passenger:'ADD',from:'Mumbai-Juhu',
						to:'Udaipur-Maharana Pratap'})
	.save(function(err){
	if(err) throw err;
});

var rflightTwo= Rflight({windowside:10,aisle:7,middle:1,from:'Jaipur-Snaganeer',to:'Udaipur-Rana Pratap',
						airline:'Spacejet',returntime:'03:45',arrivetime:'11:45',duration:'1H2M',
						returnairport:'Rana Pratap Airport',returnarrive:'Udaipur-Jaipur',returndate:'02/03/2018',
						price:'6000 rupees',passenger:'ADD'})
	.save(function(err){
	if(err) throw err;
}); 

var dflightOne= Dflight({windowside:1,aisle:0,middle:0,from:'Udaipur-Rana Pratap',to:'Jaipur-Sanganner',
						airline:'Indigo',departtime:'01:12',arrivetime:'01:00',duration:'1H40M',
						departairport:'Rana Pratap Airport',departarrive:'Udaipur-Jaipur',departdate:'04/05/2018',
						price:'8000 rupees',passenger:'ADD'})
	.save(function(err){
	if(err) throw err;
}); 

var dflightTwo= Dflight({windowside:1,aisle:1,middle:1,from:'Udaipur-Maharana Pratap',to:'Mumbai-Juhu',
						airline:'Spacejet',departtime:'23:10',arrivetime:'22:00',duration:'2H20M',
						departairport:'Maharana Pratap Airport',departarrive:'Udaipur-Mumbai',departdate:'06/06/2018',
						price:'6000 rupees',passenger:'ADD'})
	.save(function(err){
	if(err) throw err;
});

app.get('/',function(req,res){
	res.render('ticketmain');
});

app.get('/ticketfirstpage',function(req,res){
	res.render('ticketfirstpage');
});


app.post('/search',urlencodedParser,function(req,res){
    
    var query={from : req.body.lplace , to : req.body.gplace};
    Dflight.find(query,function(err,data){
		if(err) throw err;
        app.locals.infod=data;
    });
    var query={from : req.body.rlplace , to : req.body.rgplace};
	Rflight.find(query,function(err,data){
		if(err) throw err;
		app.locals.info=data;
		res.render('ticketflightinfo');
});

     });

app.post('/addreturn/:id/:airline/:from/:to/:price',urlencodedParser,function(req,res){
    
	var query={_id:req.params.id};
    Rflight.find(query,function(err,data){
    	if(err) throw err;

    	if(data.length>0){
    	var seat=req.body.seat;
    	if(seat=='aisle'){
    	var no=Number(data[0].aisle)-1;
    	Rflight.update(query,{aisle:no},function(err){
    		if(err) throw err;
    	});
    	} else if(seat=='windowside'){
    	var no=Number(data[0].windowside)-1;
    	Rflight.update(query,{windowside:no},function(err){
    		if(err) throw err;
    	});
    	} else{
    	var no=Number(data[0].middle)-1;
    	Rflight.update(query,{middle:no},function(err){
    		if(err) throw err;
    	});
    	}
    }
    });

	Rflight.findById({_id:req.params.id},function(err,data){
		if(err) throw err;
		var confirmOne=Confirm({seatprefered:req.body.seat,name:req.body.name,age:req.body.age,
				from:req.params.from,to:req.params.to,price:req.params.price,airline:req.params.airline}).save(function(err){
			if(err) throw err;
		});
	});
});

app.post('/adddepart/:id/:airline/:from/:to/:price',urlencodedParser,function(req,res){

    var query={_id:req.params.id};
    Dflight.find(query,function(err,data){
    	if(err) throw err;
    	if(data.length>0){
    	var seat=req.body.seat;
    	if(seat=='aisle'){
    	var no=Number(data[0].aisle)-1;
    	Dflight.update(query,{aisle:no},function(err){
    		if(err) throw err;
    	});
    	} else if(seat=='windowside'){
    	var no=Number(data[0].windowside)-1;
    	Dflight.update(query,{windowside:no},function(err){
    		if(err) throw err;
    	});
    	} else{
    	var no=Number(data[0].middle)-1;
    	Dflight.update(query,{middle:no},function(err){
    		if(err) throw err;
    	});
    	}
    }
	});

	Dflight.find(query,function(err,data){
		if(err) throw err;
		var confirmTwo=Confirm({seatprefered:req.body.seat,name:req.body.name,age:req.body.age,
								from:req.params.from,to:req.params.to,price:req.params.price,airline:req.params.airline})
								.save(function(err){
			if(err) throw err;
		});
	});
});

app.get('/passengerinfo',function(req,res){

	res.render('ticketpassengerinfo');
});

app.post('/confirm',urlencodedParser,function(req,res){

    var passenger1=Passenger({fname:req.body.fname,lname:req.body.lname,dob:req.body.dob,
    						  nationality:req.body.nationality,country:req.body.country,phone:req.body.phnnumber,
    						  email:req.body.email}).save(function(err){
    	if(err) throw err;
    });
    Confirm.find({},function(err,data){
	    if(err) throw err;
	    res.render('ticketconfirm',{ticketdata:data});
});});

app.get('/return/flightdetails/:id',function(req,res){

	var query={_id:req.params.id};
	Rflight.find(query,function(err,data){
		if(err) throw err;
		res.render('ticketflightdetails',{data:data,of:'return'});
	});
});


app.get('/depart/flightdetails/:id',function(req,res){

	var query={_id:req.params.id};
	Dflight.find(query,function(err,data){
		if(err) throw err;
		res.render('ticketflightdetails',{data:data,of:'depart'});
	});
});

app.get('/current',function(req,res){

	 Confirm.find({},function(err,data){
	    if(err) throw err;
	     Passenger.find({},function(err,data){
	    	if(err) throw err;
			res.render('ticketcurrent',{email:data[0].email,number:data[0].phone,ticketdata:data});
	});});
});

app.get('/pinfo',function(req,res){

	Passenger.find({},function(err,data){
		if(err) throw err;
		res.render('ticketpinfo',{data:data});
	});
});

app.get('/cancel/:id/:email/:number',urlencodedParser,function(req,res){
	var query={_id:req.params.id};
	Confirm.remove(query,function(err){
		if(err) throw err;
	});
  	
  	var msg = 'Your flight ticket has been cancel..Refund will be processed!!';
  	nexmo.message.sendSms('Nexmo',req.params.number,msg);

    var transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: "jainanjali043@gmail.com",
        pass: "anjali043"
    }
});

var mailOptions = {
  from: 'jainanjali043@gmail.com',
  to: req.params.email,
  subject: 'Confirm Mail',
  text: 'Your flight ticket has been cancel..Refund will be processed!!' 
};

transporter.sendMail(mailOptions, function(error, response){
  if (error) {
    console.log(error);
  } 
  else {
    console.log('Email sent: ' + response.message);
  }
});
	res.render('/current');
});


app.get('/payment',function(req,res){

	Confirm.find({},function(err,data){
	    if(err) throw err;
	    if(data.length>0){
	    var totalprice=0;
	    for(var f=0;f<data.length;f++){
	    	totalprice+=Number(data[0].price);
	    }
	    Passenger.find({},function(err,data){
	    	if(err) throw err;
	    	res.render('ticketpayment',{email:data[0].email,number:data[0].phone,price:totalprice,
	    								stripePublishableKey:keys.stripePublishableKey});
	    });}
	});
});

app.get('/end/:email/:number',function(req,res){

	var msg = 'Your flight ticket has been booked!!';
	nexmo.message.sendSms('Nexmo',req.params.number,msg);

	var transporter = nodemailer.createTransport({
	  service: 'gmail',
	    auth: {
	        user: "jainanjali043@gmail.com",
	        pass: "anjali043"
	    }
	});

	var mailOptions = {
	  from: 'jainanjali043@gmail.com',
	  to: req.params.email,
	  subject: 'Confirm Mail',
	  text: 'Your flight ticket has been booked!!' 
	};

	transporter.sendMail(mailOptions, function(error, response){
	  if (error) {
	    console.log(error);
	  } 
	  else {
	    console.log('Email sent: ' + response.message);
	  }
	});

	res.render('ticketendpage');
});

app.post('/charge/:price/:email/:number',urlencodedParser,function(req,res){
	const amount=req.params.price;
	stripe.customers.create({
		email:req.body.stripeEmail,
		source:req.body.stripeToken
	})
	.then(function(customer){
		stripe.charges.create({
			amount:amount,
			decription:'Ticket Booked',
			currency:'usd',
			customer:customer.id
		})
	})
	.then(function(charge){
		res.redirect('/end/' + req.params.email + '/' + req.params.number);
	});
});

app.listen('8080');