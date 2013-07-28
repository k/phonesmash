// if user accesses site from mobile device, route here
exports.index = function(req, res) {
	res.render('mobile');	
};