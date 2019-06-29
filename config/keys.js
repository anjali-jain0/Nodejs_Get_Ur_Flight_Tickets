if(process.env.NODE_ENV === 'production'){
	module.exports = require('./key2');
} else {
	module.exports = require('./key1');
}