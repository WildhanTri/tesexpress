'use strict';

exports.ok = function(values, res) {
    var data = {
        'status': 200,
        'object': values
    };
    res.json(data);
    res.end();
};


exports.invalidtoken = function(values, res) {
    var data = {
        'status': 401,
        'object': values
    };
    res.json(data);
    res.end();
};

exports.error = function(values, res) {
    var data = {
        'status': 500,
        'object': values
    };
    res.json(data);
    res.end();
};