const mongoose = require('mongoose');
const Trip = mongoose.model('trips');
const User = mongoose.model('users');

// GET: /trips - lists all trips
const tripsList = async (req, res) => {
    Trip
        .find({}) // Empty filter for all
        .exec((err, trips) => {
            if ((!trips) || (trips.length == 0)) {
                return res
                    .status(404)
                    .json({"message": "trips not found"});
            } else if (err) {
                return res
                    .status(404)
                    .json(err);
            } else {
                return res
                    .status(200)
                    .json(trips);
            }
        });
};

// GET: /trips/:tripCode - returns a single trip
 const tripsFindByCode = async (req, res) => {
    Trip
        .find({'code': req.params.tripCode})
        .exec((err, trip) => {
            if ((!trip) || (trip.length == 0)) {
                return res
                    .status(404)
                    .json({"message": "trip not found"});
            } else if (err) {
                return res
                    .status(404)
                    .json(err);
            } else {
                return res
                    .status(200)
                    .json(trip);
            }
        });
 };

 // POST
 const tripsAddTrip = async (req, res) => {
     getUser(req, res,
        (req, res) => {
            Trip
                .create({
                    code: req.body.code,
                    name: req.body.name,
                    length: req.body.length,
                    start: req.body.start,
                    resort: req.body.resort,
                    perPerson: req.body.perPerson,
                    image: req.body.image,
                    description: req.body.description
                },
                (err, trip) => {
                    if (err) {
                        return res
                            .status(400) // bad request, invalid content
                            .json(err);
                    } else {
                        return res
                            .status(201) // created
                            .json(trip);
                    }
                });
            }
    );
 }

 // PUT
 const tripsUpdateTrip = async (req, res) => {
    getUser(req, res,
        (req, res) => {
            console.log(req.body);
            Trip
                .findOneAndUpdate({ 'code': req.params.tripCode }, {
                    code: req.body.code,
                    name: req.body.name,
                    length: req.body.length,
                    start: req.body.start,
                    resort: req.body.resort,
                    perPerson: req.body.perPerson,
                    image: req.body.image,
                    description: req.body.description
                }, { new: true })
                .then(trip => {
                    if (!trip) {
                        return res
                            .status(404)
                            ,send({
                                message: "Trip not found with code " + req.params.tripCode
                            });
                    }
                    res.send(trip);
                })
                .catch(err => {
                    if (err.kind === 'ObjectId') {
                        return res
                            .status(404)
                            .send({
                                message: "Trip not found with code " + req.params.tripCode
                            });
                    }
                    return res
                    .status(500) // server error
                    .jason(err);
                });
        }
    );
 }

 // DELETE
 const tripsDeleteTrip = async (req, res) => {
    getUser(req, res,
        (req, res) => {
            console.log(req.body);
            Trip
                .deleteOne({'code': req.params.tripCode})
                .then(trip => {
                    if (!trip) {
                        return res
                            .status(404)
                            ,send({
                                message: "Trip not found with code " + req.params.tripCode
                            });
                    }
                })
                .catch(err => {
                    if (err.kind === 'ObjectId') {
                        return res
                            .status(404)
                            .send({
                                message: "Trip not found with code " + req.params.tripCode
                            });
                    }
                    return res
                    .status(500) // server error
                    .json(err);
                });
        }
    );
 }

 // getUser method
 const getUser = (req, res, callback) => {
     if (req.payload && req.payload.email) {
         User
            .findOne({ email: req.payload.email })
            .exec((err, user) => {
                if (!User) {
                    return res
                        .status(404)
                        .json({ "message": "User not found" });
                } else if (err) {
                    console.log(err);
                    return res
                        .status(404)
                        .json(err);
                }
                callback(req, res, user.name);
            });
     } else {
         return res
            .status(404)
            .json({ "message": "User not found" });
     }
 };


module.exports = {
    tripsList,
    tripsFindByCode,
    tripsAddTrip,
    tripsUpdateTrip,
    tripsDeleteTrip
};