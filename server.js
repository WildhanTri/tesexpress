var express = require('express'),
    app = express(),
    port = process.env.PORT || 3000,
    bodyParser = require('body-parser'),
    controller = require('./controller/user');

const fileUpload = require('express-fileupload');
const morgan = require('morgan');
const _ = require('lodash');

app.use(function(req, res, next) {
    //Enabling CORS
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "GET,HEAD,OPTIONS,POST,PUT");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type,Accept, x-client-key, x-client-token, x-client-secret, Authorization,Token");
    next();
});

app.use(fileUpload({
    createParentPath: true,
    limits: {
        fileSize: 10 * 1024 * 1024 * 1024 //2MB max file(s) size
    }
}));
app.use(morgan('dev'));
app.use(bodyParser.urlencoded({ extended: true, limit: '100mb' }));
app.use(bodyParser.json({ limit: '100mb' }));
app.use('/user/profile_picture', express.static('public/images/profile_picture/'))

var routes = require('./routes/routes');
routes(app);

app.listen(port);
console.log('RESTful API server started on: ' + port);