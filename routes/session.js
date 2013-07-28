// if user accesses site from mobile device, route here
exports.index = function(req, res) {
	res.render('mobile');
	
};

// once on mobile view, user posts session data here
exports.verify = function(req, res) {
	res.send(req.body);
}

