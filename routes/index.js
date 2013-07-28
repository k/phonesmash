// render the desktop/mobile index pages
exports.index = function(req, res){

	var ua = req.header('user-agent');

	if(/mobile/i.test(ua)) {
	  res.render('mobile');
	} else {
  	res.render('desktop', { title: 'Phonesmash' });
  }

};