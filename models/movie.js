const mongoose = require('mongoose');
const config = require('../config/database');
const http = require('http');

//User schema
const MovieSchema = mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    director: {
        type: String,
    },
    actors: {
        type: String,
    },
    location: {
        type: String,
    },
    releaseDate: {
        type: String,
    },
    budget: {
        type: String,
    },
    poster: {
        type: String,
    },
    plot: {
        type: String,
    },
    metascore: {
        type: String,
    },
    imdbId: {
        type: String,
    },
    rating: {
        type: Number,
    },
    nbVotes: {
        type: Number,
    },
    contentAddedInfo: {
        type: Array,
    },
    contentAddedSection: {
        type: Array,
    }
});

const Movie = module.exports = mongoose.model('Movie', MovieSchema);

module.exports.getMovieByTitle = function (title, callback) {
    const query = { title: title }
    Movie.findOne(query, callback);
}

module.exports.getAllMovies = function (callback) {
    //Movie.find({}, callback);
    Movie.find({}, callback).sort({ title: 1 });
}

module.exports.getMovie = function (id, callback) {
    Movie.findById(id, callback);
}

module.exports.addMovie = function (newMovie, callback) {
    newMovie.save(callback);
}

module.exports.updateMovie = function (id, movie, callback) {
    Movie.update({ "_id": id }, movie, callback);
}

module.exports.deleteMovie = function (id, callback) {
    Movie.deleteOne({ _id: id }, callback);
}

module.exports.getMovieFromIMDb = function (id, callback) {
    //const query = {title: title}
    var options = {
        hostname: 'www.omdbapi.com',
        path: '/?i=' + id + '&apikey=' + config.OMDb_API_KEY + '&plot=full',
        headers: { 'Content-Type': 'application/json' },
        method: 'GET'
    };

    call = function (response) {
        var str = '';

        response.on('data', function (chunk) {
            str += chunk;
        });

        response.on('end', function () {
            callback(JSON.parse(str));
        });
    }

    http.request(options, call).end();
};

module.exports.searchMovieFromIMDb = function (param, callback) {

    var options = {
        hostname: 'www.omdbapi.com',
        path: '/?s=' + param.search + '&apikey=' + config.OMDb_API_KEY + '',
        headers: { 'Content-Type': 'application/json' },
        method: 'GET'
    };

    call = function (response) {
        var str = '';

        response.on('data', function (chunk) {
            str += chunk;
        });

        response.on('end', function () {
            callback(JSON.parse(str));
        });

        response.on('error', function () {
            let back = {
                success: false,
                msg: "Error from Database"
            }
            callback(back);
        });
    }

    http.request(options, call).end();
};
/****************TMDb********************/
module.exports.searchMovieFromTMDb = function (param, callback) {

    var options = {
        hostname: 'api.themoviedb.org',
        headers: { 'Content-Type': 'application/json' },
        method: 'GET'
    };

    if (param.type === "series") {
        options.path = '/3/search/tv?api_key=' + config.TMDb_API_KEY + '&query=' + param.query + '&year=' + param.year;
    } else {
        options.path = '/3/search/movie?api_key=' + config.TMDb_API_KEY + '&query=' + param.query + '&year=' + param.year;
    }

    call = function (response) {
        var str = '';

        response.on('data', function (chunk) {
            str += chunk;
        });

        response.on('end', function () {
            callback(JSON.parse(str));
        });

        response.on('error', function () {
            let back = {
                success: false,
                msg: "Error from Database"
            }
            callback(back);
        });
    }

    http.request(options, call).end();
};

module.exports.getMovieFromTMDb = function (param, callback) {

    var options = {
        hostname: 'api.themoviedb.org',
        headers: { 'Content-Type': 'application/json' },
        method: 'GET'
    };

    if (param.type === "series") {
        options.path = '/3/tv/' + param.id + '?api_key=' + config.TMDb_API_KEY;
    } else {
        options.path = '/3/movie/' + param.id + '?api_key=' + config.TMDb_API_KEY;
    }

    call = function (response) {
        var str = '';

        response.on('data', function (chunk) {
            str += chunk;
        });

        response.on('end', function () {
            
            try {
                callback(JSON.parse(str));
            }
            catch (e) { // non-standard
                console.log(str);
                callback({
                    error: true,
                });
            }
            
        });
    }

    http.request(options, call).end();
};

module.exports.getVideosMovie = function (id, callback) {

    var options = {
        hostname: 'api.themoviedb.org',
        headers: { 'Content-Type': 'application/json' },
        method: 'GET',
        path: '/3/movie/' + id + '/videos?api_key=' + config.TMDb_API_KEY,
    };

    call = function (response) {
        var str = '';

        response.on('data', function (chunk) {
            str += chunk;
        });

        response.on('end', function () {
            try {
                callback(JSON.parse(str));
            }
            catch (e) { // non-standard
                console.log(str);
                callback({
                    error: true,
                });
            }
        });
    }

    http.request(options, call).end();
};

module.exports.getBestRating = function (callback) {
    Movie.find({}, callback).sort({ rating: -1 }).limit(5);
}

module.exports.getMostRated = function (callback) {
    Movie.find({}, callback).sort({ nbVotes: -1 }).limit(5);
}

module.exports.getStats = function (callback) {
    //Movie.count(callback);
    var bestRating = new Promise((resolve, reject) => {
        resolve(Movie.find().sort({ rating: -1 }).limit(5));
    });
    var mostRated = new Promise((resolve, reject) => {
        resolve(Movie.find().sort({ nbVotes: -1 }).limit(5));
    });
    var numberMovies = new Promise((resolve, reject) => {
        resolve(Movie.count());
    });
    var err = false;

    Promise.all([bestRating, mostRated, numberMovies]).then(values => {
        callback(err, values);
    });

}
