'use strict';

var response = require('../res'),
    connection = require('../conn'),
    jwt = require('jsonwebtoken'),
    bcrypt = require('bcryptjs'),
    config = require('../config')

exports.users = function(req, res) {

    connection.query('SELECT * FROM user', function(error, rows, fields) {
        if (error) {
            console.log(error)
        } else {
            response.ok(rows, res)
        }
    });
};

exports.findUsers = function(req, res) {

    var user_id = req.params.user_id;

    connection.query('SELECT * FROM user where id = ?', [user_id],
        function(error, rows, fields) {
            if (error) {
                console.log(error)
            } else {
                response.ok(rows, res)
            }
        });
};



exports.token = function(req, res) {

    var token = req.headers['token'];
    if (!token) return res.status(401).send({ auth: false, message: 'No token provided.' });

    jwt.verify(token, config.secret, function(err, decoded) {
        console.log(err)
        if (err) return res.status(500).send({ auth: false, message: 'Failed to authenticate token.' });


        // response.ok(decoded, res)
        connection.query('SELECT * FROM user where token = ?', [token],
            function(error, rows, fields) {
                if (error) {
                    console.log(error)
                    response.error("failed", res)
                } else {
                    if (rows.length > 0) {
                        response.ok(rows[0], res)
                    } else {
                        response.error("User not found", res)
                    }
                }
            });
    });
};

exports.signIn = function(req, res) {

    var email = req.body.email;
    var password = req.body.password;
    var username = ""
    var full_name
    var avatar = ""
    var id = ""
    var token = ""
    var profile_picture = ""

    connection.query('SELECT * FROM user where email = ?', [email],
        function(error, rows, fields) {
            if (error) {
                console.log(error)
                response.error("failed", res)
            } else {
                if (rows.length > 0) {
                    connection.query('SELECT * FROM user where email = ? and password = ?', [email, password],
                        function(error, rows, fields) {
                            if (rows.length > 0) {

                                id = rows[0].id
                                username = rows[0].username
                                full_name = rows[0].full_name
                                profile_picture = rows[0].profile_picture
                                token = jwt.sign({ email: email, full_name: full_name, username: username, id: id, profile_picture: profile_picture }, config.secret)

                                connection.query('UPDATE user SET token = ? WHERE id = ?', [token, id])

                                // res.status(200).send({ auth: true, token: token })
                                response.ok(token, res)
                            } else {
                                response.error("Wrong password bitch", res)
                            }
                        });
                } else {
                    response.error("User not found", res)
                }
            }
        });
};

exports.uploadPicture = async function(req, res) {

    var token = req.headers['token'];
    if (!token) return res.status(401).send({ auth: false, message: 'No token provided.' });

    jwt.verify(token, config.secret, function(err, decoded) {
        if (err) return res.status(500).send({ auth: false, message: 'Failed to authenticate token.' });

        try {
            if (!req.files) {
                res.send({
                    status: false,
                    message: 'No file uploaded'
                });
            } else if (!req.files.picture.mimetype.includes('image/')) {
                response.error("Tipe file tidak suppoer", res)
            } else {


                //Use the name of the input field (i.e. "avatar") to retrieve the uploaded file
                let picture = req.files.picture;
                let picture_name = "user_" + decoded.id + "." + picture.mimetype.split("/")[1]

                connection.query('UPDATE user SET profile_picture = ? WHERE id = ?', [picture_name, decoded.id],
                    function(error, rows, fields) {
                        if (error) {
                            console.log(error)
                        } else {
                            //Use the mv() method to place the file in upload directory (i.e. "uploads")
                            picture.mv('./public/images/profile_picture/' + picture_name);
                            // picture.mv('./public/images/profile_picture/user_' + decoded.id + ".jpg");
                            console.log(picture)
                                //send response
                                // res.send({
                                //     status: true,
                                //     message: 'File is uploaded',
                                //     data: {
                                //         name: picture.name,
                                //         mimetype: picture.mimetype,
                                //         size: picture.size
                                //     }
                                // });

                            response.ok("berhasil", res)
                        }
                    });
            }
        } catch (err) {
            response.error(err, res)
            console.log(err)
        }
    });


};

exports.createUsers = function(req, res) {

    var first_name = req.body.first_name;
    var last_name = req.body.last_name;

    connection.query('INSERT INTO user (first_name, last_name) values (?,?)', [first_name, last_name],
        function(error, rows, fields) {
            if (error) {
                console.log(error)
            } else {
                response.ok("Berhasil menambahkan user!", res)
            }
        });
};

exports.updateUsers = function(req, res) {

    var username = req.body.username;
    var email = req.body.email;
    var bio = req.body.bio;
    var full_name = req.body.full_name;
    var user_id = req.body.user_id;

    connection.query('UPDATE user SET username = ?, email = ?, bio = ?, full_name = ? WHERE id = ?', [username, email, bio, full_name, user_id],
        function(error, rows, fields) {
            if (error) {
                console.log(error)
            } else {
                response.ok("Berhasil merubah user!", res)
            }
        });
};

exports.deleteUsers = function(req, res) {

    var user_id = req.body.user_id;

    connection.query('DELETE FROM user WHERE id = ?', [user_id],
        function(error, rows, fields) {
            if (error) {
                console.log(error)
            } else {
                response.ok("Berhasil menghapus user!", res)
            }
        });
};

exports.index = function(req, res) {
    response.ok("Hello from the Node JS RESTful side!", res)
};

function tokenValidate(token) {
    connection.query('SELECT * FROM user WHERE token = ?', [token],
        function(error, rows, fields) {
            if (error) {
                console.log(error)
            } else {
                if (rows.length > 1) {
                    return true
                } else {
                    return false
                }
            }
        });
}