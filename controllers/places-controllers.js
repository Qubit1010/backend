const { validationResult } = require("express-validator");
const HttpError = require("../models/http.error");
const uuid = require("uuid");
const getCoordsForAddress = require("../utils/location");
const Place = require("../models/placeModel");
const User = require("../models/userModel");
const { default: mongoose } = require("mongoose");
const uuid4 = uuid.v4();

// let DUMMY_PLACES = [
//   {
//     id: "p1",
//     title: "Empire State Building",
//     description: "One of the most famous sky scrapers in the world!",
//     location: {
//       lat: 40.7484474,
//       lng: -73.9871516,
//     },
//     address: "20 W 34th St, New York, NY 10001",
//     creator: "u1",
//   },
// ];

const getPlaceById = async (req, res, next) => {
  const placeId = req.params.pid; //{pid: 'p1'}
  // const place = DUMMY_PLACES.find((p) => {
  //   return p.id === placeId;
  // });
  let place;
  try {
    place = await Place.findById(placeId);
  } catch (err) {
    const error = new HttpError(
      "Something went wrong, Could not find a place.",
      500
    );
    return next(error);
  }

  if (!place) {
    const error = new HttpError(
      "Could not find a place for the provided id.",
      404
    );
    return next(error);
  }

  res.status(200).json(place);
  // res.json(place);
};

const getPlacesByUserId = async (req, res, next) => {
  const userId = req.params.uid; //{pid: 'p1'}
  // const place = DUMMY_PLACES.filter((p) => {
  //   return p.creator === userId;
  // });
  let userWithPlaces;
  try {
    userWithPlaces = await User.findById(userId).populate('places');
  } catch (err) {
    const error = new HttpError(
      "Something went wrong, Fetching places failed!",
      500
    );
    return next(error);
  }
  if (!userWithPlaces) {
    return next(
      new HttpError("Could not find a place for the provided user id.")
    );
  }
  res.status(200).json(userWithPlaces);
};

const createPlace = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(
      new HttpError("Invalid inputs passed, please check your data.", 422)
    );
  }

  const { title, description, address, creator, image } = req.body;

  let coordinates;
  try {
    coordinates = await getCoordsForAddress(address);
  } catch (error) {
    return next(error);
  }

  let user;
  try {
    user = await User.findById(creator);
  } catch (err) {
    const error = new HttpError("Creating place failed.", 500);
    return next(error);
  }

  if (!user) {
    return next(new HttpError("Could not find user for provided id.", 404));
  }

  const place = await Place.create({
    title,
    description,
    location: coordinates,
    image:
      "https://cdn.pixabay.com/photo/2023/05/09/07/18/space-7980556_960_720.jpg",
    address,
    creator,
  });

  if (place) {
    const sess = await mongoose.startSession();
    sess.startTransaction();
    await place.save({ session: sess });
    user.places.push(place);
    await user.save({ session: sess });
    await sess.commitTransaction();
  } else {
    return next(new HttpError("Creating place failed", 500));
  }

  res.status(201).json(place);
  // const createdPlace = {
  //   id: uuid4,
  //   title,
  //   description,
  //   location: coordinates,
  //   address,
  //   creator,
  // };
  // DUMMY_PLACES.push(createdPlace);
};

const updatePlace = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(
      new HttpError("Invalid inputs passed, please check your data.", 422)
    );
  }
  const placeId = req.params.pid;

  // const updatedPlace = { ...DUMMY_PLACES.find((p) => p.id === placeId) };
  // const placeIndex = DUMMY_PLACES.findIndex((p) => p.id === placeId);
  // updatedPlace.title = title;
  // updatedPlace.description = description;
  // DUMMY_PLACES[placeIndex] = updatedPlace;
  const updatedPlace = await Place.findByIdAndUpdate(placeId, req.body);
  res.status(200).json(updatedPlace);
};

const deletePlace = async (req, res, next) => {
  const placeId = req.params.pid;
  // if (!DUMMY_PLACES.find((p) => p.id === placeId)) {
  //   throw new HttpError("Could not find a place for that id.", 404);
  // }
  const place = await Place.findById(placeId).populate("creator");
  if (!place) {
    return next(new HttpError("task not found", 400));
    // res.status(400);
    // throw new Error("task not found");
  }

  if (place) {
    const sess = await mongoose.startSession();
    sess.startTransaction();
    await place.deleteOne({ session: sess });
    place.creator.places.pull(place);
    await place.creator.save({ session: sess });
    await sess.commitTransaction();
  } else {
    return next(new HttpError("Creating place failed", 500));
  }

  res.status(200).json({ message: "Deleted place." });
  // DUMMY_PLACES = DUMMY_PLACES.filter((p) => p.id !== placeId);
};

module.exports = {
  getPlaceById,
  getPlacesByUserId,
  createPlace,
  updatePlace,
  deletePlace,
};
