module.exports = function (req, res, next) {

  res.sendHttpError = function(error) {
    
    res.status(error.status);
    res.render('errorHttp', {error: error.message});
  };
  next();
}