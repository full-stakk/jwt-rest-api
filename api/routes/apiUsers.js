const ApiUser = require('../../api/models/apiUser'),
    validator = require('../util/inputValidation'),
    moment = require('moment');

module.exports = function (router) {
    router.route('/user')
        .all(function (req, res, next) {
            if(req.method.toLowerCase() === 'put') {
                const rejected = validator.rejectArgs('user', req.body.updates);
                if(rejected) {
                    res.status(503).json({
                        message: 'You do not have permission to alter your id or api key. Contact support if you wish to do so.'
                    });
                }  else {
                    next();
                }
            }
        })
        .get(function (req, res) {
            if(req.query && req.query.api_id) {
                ApiUser.forge({
                    api_id: req.query.api_id
                })
                .fetch()
                .then((model) => {
                    const attrs = model.attributes;
                    res.status(200).json({
                        api_id: attrs.api_id,
                        name: attrs.name,
                        phone: attrs.phone,
                        email: attrs.email,
                        created: attrs.created_at
                    });
                })
                .catch((err) => {
                    serverError(res, err);
                });
            } else {
                missingParams(res);
            }
        })
        .put(function (req, res) {
            if(req.body && req.body.api_id && req.body.updates && req.body.updates.length > 0) {
                ApiUser.forge({
                    api_id: req.body.api_id
                })
                .fetch()
                .then((model) => {
                    return model.save(req.body.updates,
                    {
                        patch: true
                    });
                })
                .then(() => {
                    res.status(200).json({
                        message: 'Successfully updated.'
                    });
                })
                .catch((err) => {
                    serverError(res, err);
                });
            } else {
                missingParams(res);
            }
        })
        .delete(function (req, res) {
            if (req.body && req.body.api_id) {
                ApiUser.forge({
                    api_id: req.body.api_id
                })
                .fetch()
                .then((model) => {
                    return model.save({
                        disabled: true,
                        disabled_at: moment().format("YYYY-MM-DD HH:mm:ss")
                    },
                    {
                        patch: true
                    });
                })
                .then(() => {
                    res.status(200).json({
                        message: 'Successfully updated.'
                    });
                })
                .catch((err) => {
                    serverError(res, err);
                });
            } else {
                missingParams(res);
            }
        });
};

function missingParams (res) {
    res.status(400).json({
        message: 'You are missing required parameters.'
    });
}

function serverError (res, err) {
    res.status(500).json({
        message: 'Something went wrong. If you are receiving this message please contact the maintainer.',
        error: err
    });
}