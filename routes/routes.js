'use strict';

module.exports = function(app) {
    var userController = require('../controller/user');
    var animeController = require('../controller/anime');
    var aniuserController = require('../controller/anime-user');


    //USER
    app.route('/')
        .get(userController.index);

    app.route('/user')
        .get(userController.users)
        .post(userController.createUsers)
        .put(userController.updateUsers)
        .delete(userController.deleteUsers);

    app.route('/user/upload-picture')
        .post(userController.uploadPicture);
    app.route('/user/signIn')
        .post(userController.signIn);
    app.route('/user/token')
        .get(userController.token);
    app.route('/user/:id')
        .get(userController.findUsers);


    //ANIME
    app.route('/')
        .get(animeController.index);

    app.route('/anime')
        .get(animeController.anime)
        .post(animeController.insertAnime)
        .put(animeController.updateAnime)
        .delete(animeController.deleteAnime);


    app.route('/anime/source')
        .post(animeController.insertAnimeSource)
    app.route('/anime/synonym')
        .post(animeController.insertAnimeSynonym)

    app.route('/anime/:id')
        .get(animeController.findAnime);


    //ANIME - USER

    app.route('/anime-user')
        .get(aniuserController.animeUser)
        .post(aniuserController.insertAnimeUser)
        .put(aniuserController.updateAnimeUser)

    app.route('/anime-user/:id')
        .get(aniuserController.findAnimeUser)
        .delete(aniuserController.deleteAnimeUser);


};