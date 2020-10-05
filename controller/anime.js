'use strict';

var response = require('../res'),
    connection = require('../conn'),
    jwt = require('jsonwebtoken'),
    bcrypt = require('bcryptjs'),
    config = require('../config')

exports.anime = function(req, res) {
    var token = req.headers['token'];
    if (!token) return res.status(401).send({ auth: false, message: 'No token provided.' });

    jwt.verify(token, config.secret, function(err, decoded) {
        if (err) return res.status(500).send({ auth: false, message: 'Failed to authenticate token.' });

        var ps = []
        var sql = "SELECT * FROM anime WHERE 1=1 "

        if (req.query.q != null) {
            var querySplit = req.query.q.split(" ");

            var value = ""
            for (let qs of querySplit) {
                value += "+" + qs
            }

            sql += " AND MATCH(title) AGAINST('" + value + "') "
        }

        if (req.query.page != null && req.query.offset != null) {
            sql += " LIMIT ?,? "
            ps.push(req.query.page)
            ps.push(req.query.offset)
        }

        console.log(sql)
        connection.query(sql, function(error, rows, fields) {
            if (error) {
                console.log(error)
                response.error("failed", res)
            } else {
                response.ok(rows, res)
            }
        });

    });
};

exports.findAnime = function(req, res) {

    var id = req.params.id;

    connection.query('SELECT * FROM anime where id = ?', [id],
        function(error, rows, fields) {
            if (error) {
                console.log(error)
                response.error("failed", res)
            } else {
                response.ok(rows, res)
            }
        });
};

exports.insertAnime = function(req, res) {

    var token = req.headers['token'];
    if (!token) return res.status(401).send({ auth: false, message: 'No token provided.' });

    jwt.verify(token, config.secret, function(err, decoded) {

        var ps = []
        if (req.body instanceof Array) {
            var query = "INSERT INTO `anime` (`id`, `title`, `type`, `desciption`, `episode`, `release_date`, `release_day`, `cover_pict`, `thumb_pict`) VALUES "

            let index = 0;
            for (let r of req.body) {

                if (index != 0) {
                    query += ","
                }
                query += "(?,?,?,?,?,?,?,?,?)"

                ps.push(r.id)
                ps.push(r.title)
                ps.push(r.type)
                ps.push(r.description)
                ps.push(r.episode)
                ps.push(r.release_date)
                ps.push(r.release_day)
                ps.push(r.cover_pict)
                ps.push(r.thumb_pict)

                index++
            }

            connection.query(query, ps,
                function(error, rows, fields) {
                    if (error) {
                        console.log(error)
                        response.ok("failed", res)
                    } else {
                        response.ok("success", res)
                    }
                });
        } else {
            ps.push(req.body.title)
            ps.push(req.body.type)
            ps.push(req.body.description)
            ps.push(req.body.episode)
            ps.push(req.body.release_date)
            ps.push(req.body.release_day)
            ps.push(req.body.cover_pict)
            ps.push(req.body.thumb_pict)

            connection.query('INSERT INTO `anime` (`title`, `type`, `desciption`, `episode`, `release_date`, `release_day`, `cover_pict`, `thumb_pict`) VALUES (?,?,?,?,?,?,?,?)', ps,
                function(error, rows, fields) {
                    if (error) {
                        console.log(error)
                        response.error("failed", res)
                    } else {
                        response.ok("success", res)
                    }
                });
        }

    });
};


exports.insertAnimeSynonym = function(req, res) {

    var token = req.headers['token'];
    if (!token) return res.status(401).send({ auth: false, message: 'No token provided.' });

    jwt.verify(token, config.secret, function(err, decoded) {

        var ps = []
        if (req.body instanceof Array) {
            var query = "INSERT INTO `anime_synonym` (`id_anime`, `value`) VALUES  "

            let index = 0;
            for (let r of req.body) {

                if (index != 0) {
                    query += ","
                }
                query += "(?,?)"

                ps.push(r.id_anime)
                ps.push(r.value)

                index++
            }

            connection.query(query, ps,
                function(error, rows, fields) {
                    if (error) {
                        console.log(error)
                        response.ok("failed", res)
                    } else {
                        response.ok("success", res)
                    }
                });
        } else {
            ps.push(req.body.id_anime)
            ps.push(req.body.value)

            connection.query('INSERT INTO `anime_synonym` (`id_anime`, `value`) VALUES (?,?)', ps,
                function(error, rows, fields) {
                    if (error) {
                        console.log(error)
                        response.error("failed", res)
                    } else {
                        response.ok("success", res)
                    }
                });
        }

    });
};

exports.insertAnimeSource = function(req, res) {

    var token = req.headers['token'];
    if (!token) return res.status(401).send({ auth: false, message: 'No token provided.' });

    jwt.verify(token, config.secret, function(err, decoded) {

        var ps = []
        if (req.body instanceof Array) {
            var query = "INSERT INTO `anime_source` (`id_anime`, `value`) VALUES "

            let index = 0;
            for (let r of req.body) {

                if (index != 0) {
                    query += ","
                }
                query += "(?,?)"

                ps.push(r.id_anime)
                ps.push(r.value)

                index++
            }

            connection.query(query, ps,
                function(error, rows, fields) {
                    if (error) {
                        console.log(error)
                        response.ok("failed", res)
                    } else {
                        response.ok("success", res)
                    }
                });
        } else {
            ps.push(req.body.id_anime)
            ps.push(req.body.value)

            connection.query('INSERT INTO `anime_source` (`id_anime`, `value`) VALUES (?,?)', ps,
                function(error, rows, fields) {
                    if (error) {
                        console.log(error)
                        response.error("failed", res)
                    } else {
                        response.ok("success", res)
                    }
                });
        }

    });
};


exports.updateAnime = function(req, res) {
    var ps = []

    ps.push(req.body.title)
    ps.push(req.body.alternative_title)
    ps.push(req.body.type)
    ps.push(req.body.description)
    ps.push(req.body.episode)
    ps.push(req.body.id_anime_season)
    ps.push(req.body.release_date)
    ps.push(req.body.release_day)
    ps.push(req.body.cover_pict)
    ps.push(req.body.thumb_pict)
    ps.push(req.body.id)

    connection.query('UPDATE `anime` SET `title`=?,`alternative_title`=?,`type`=?,`desciption`=?,`episode`=?,`id_anime_season`=?,`release_date`=?,`release_day`=?,`cover_pict`=?,`thumb_pict`=? WHERE id = ?', ps,
        function(error, rows, fields) {
            if (error) {
                console.log(error)
                response.error("failed", res)
            } else {
                response.ok("success", res)
            }
        });
};

exports.deleteAnime = function(req, res) {

    var ps = []

    ps.push(req.body.id)

    connection.query('DELETE FROM anime WHERE id = ?', [id],
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