'use strict';

var response = require('../res'),
    connection = require('../conn'),
    jwt = require('jsonwebtoken'),
    bcrypt = require('bcryptjs'),
    config = require('../config')

exports.animeUser = function(req, res) {
    var token = req.headers['token'];
    if (!token) return res.status(401).send({ auth: false, message: 'No token provided.' });

    jwt.verify(token, config.secret, function(err, decoded) {
        if (err) return res.status(500).send({ auth: false, message: 'Failed to authenticate token.' });

        var ps = [token]
        var sql = "SELECT a.*,au.* FROM anime_user au " +
            "INNER JOIN anime a ON a.id = au.id_anime " +
            "INNER JOIN user u ON u.id = au.id_user WHERE u.token = ? "

        connection.query(sql, ps, function(error, rows, fields) {
            if (error) {
                console.log(error)
                response.error("failed", res)
            } else {
                response.ok(rows, res)
            }
        });

    });
};

exports.findAnimeUser = function(req, res) {

    var id = req.params.id;


    var sql = "SELECT a.*,au.* FROM anime_user au " +
        "INNER JOIN anime a ON a.id = au.id_anime WHERE au.id = ? "

    connection.query(sql, [id],
        function(error, rows, fields) {
            if (error) {
                console.log(error)
                response.error("failed", res)
            } else {
                var object = rows[0]
                console.log(object)
                var sql2 = "SELECT aus.* FROM anime_user_episode aus WHERE aus.id_anime_user = ? "

                connection.query(sql2, [object.id],
                    function(error, rows, fields) {
                        if (error) {
                            console.log(error)
                            response.error("failed", res)
                        } else {

                            object["episodes"] = rows

                            response.ok(object, res)
                        }
                    });
            }
        });
};

exports.insertAnimeUser = function(req, res) {

    var token = req.headers['token'];
    if (!token) return res.status(401).send({ auth: false, message: 'No token provided.' });

    jwt.verify(token, config.secret, function(err, decoded) {
        var ps = []
        var query = "INSERT INTO `anime_user` (`id_anime`, `id_user`, `status`) VALUES (?,?,?)"

        ps.push(req.body.id_anime)
        ps.push(req.body.id_user)
        ps.push(req.body.status)

        connection.query(query, ps,
            function(error, rows, fields) {
                if (error) {
                    console.log(error)
                    response.ok("failed", res)
                } else {
                    response.ok("success", res)
                }
            });
    });
};

exports.insertAnimeUser = function(req, res) {

    var token = req.headers['token'];
    if (!token) return res.status(401).send({ auth: false, message: 'No token provided.' });

    jwt.verify(token, config.secret, function(err, decoded) {
        var ps = []
        var query = "INSERT INTO `anime_user` (`id_anime`, `id_user`, `watched_episode`, `status`) VALUES (?,?,?,?)"

        ps.push(req.body.id_anime)
        ps.push(req.body.id_user)
        ps.push(req.body.watched_episode)
        ps.push(req.body.status)

        connection.query(query, ps,
            function(error, rows, fields) {
                if (error) {
                    console.log(error)
                    response.ok("failed", res)
                } else {
                    response.ok("success", res)
                }
            });
    });
};

exports.updateAnimeUser = function(req, res) {
    var ps = []

    ps.push(req.body.status)
    ps.push(req.body.watched_episode)
    ps.push(req.body.id)

    connection.query('UPDATE `anime_user` SET `status`=?,`watched_episode`=? WHERE id = ?', ps,
        function(error, rows, fields) {
            if (error) {
                console.log(error)
                response.error("failed", res)
            } else {
                response.ok("success", res)
            }
        });
};

exports.deleteAnimeUser = function(req, res) {

    var ps = []

    ps.push(req.params.id)

    connection.query('DELETE FROM anime_user WHERE id = ?', ps,
        function(error, rows, fields) {
            if (error) {
                console.log(error)
                response.error("failed", res)
            } else {
                response.ok("success", res)
            }
        });
};

exports.index = function(req, res) {
    response.ok("Hello from the Node JS RESTful side!", res)
};