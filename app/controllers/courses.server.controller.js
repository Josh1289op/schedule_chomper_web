'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	errorHandler = require('./errors.server.controller'),
	Course = mongoose.model('Course'),
	_ = require('lodash');

/**
 * Create a Course
 */
exports.create = function(req, res) {
	var course = new Course(req.body);

	course.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(course);
		}
	});
};

/**
 * Show the current Course
 */
exports.read = function(req, res) {
	res.jsonp(req.course);
};

/**
 * Update a Course
 */
exports.update = function(req, res) {
	var course = req.course ;
	console.log(course);
	course = _.extend(course , req.body);

	course.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(course);
		}
	});
};

/**
 * Delete an Course
 */
exports.delete = function(req, res) {
	var course = req.course ;

	course.remove(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(course);
		}
	});
};

/**
 * List of Courses
 */
exports.list = function(req, res) {
	Course.find().sort('-created').populate('user', 'displayName').exec(function(err, courses) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(courses);
		}
	});
};

/**
 * Course middleware
 */
exports.courseByID = function(req, res, next, id) {
	Course.findById(id).populate('user', 'displayName').exec(function(err, course) {
		if (err) return next(err);
		if (! course) return next(new Error('Failed to load Course ' + id));
		req.course = course ;
		next();
	});
};

exports.courseCode = function(req, res, next, code) {
	Course.find().where({code: new RegExp('^' + code, 'i')}).exec(function(err, courses) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(courses);
		}
	});
};

exports.exactCourses = function(req, res, next, code, instructor) {
	Course.find().where({code: new RegExp('^' + code, 'i'), instructor: instructor}).exec(function(err, courses) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			console.log(res);
			res.jsonp(courses);
		}
	});
};


/**
 * Course authorization middleware
 */
exports.hasAuthorization = function(req, res, next) {
	if (req.course.user.id !== req.user.id) {
		return res.status(403).send('User is not authorized');
	}
	next();
};
