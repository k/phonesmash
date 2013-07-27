
/*
 * GET users listing.
 */


// if user accesses site from mobile device, route here
exports.generate_session = function(req, res) {
	res.render('mobile', { title: 'Phonesmash' });
	
};

// once on mobile view, user posts session data here
exports.verify = function(req, res) {
	res.send(req.body);
}

