const HttpError = require("../models/http.error");
const { validationResult } = require("express-validator");
// const uuid = require("uuid");
const User = require("../models/userModel");
// const uuid4 = uuid.v4();

// const DUMMY_USERS = [
//   {
//     id: "u1",
//     name: "Itid",
//     email: "test@123.com",
//     password: "12341",
//   },
// ];

const getUsers = async (req, res, next) => {
  const users = await User.find({}, "-password");

  if (!users) {
    return next(
      new HttpError("Fetching users failed, please try again later.", 422)
    );
  }

  res.status(201).json(users); 
  // res.json({ user: DUMMY_USERS });
};

const signUp = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(
      new HttpError("Invalid inputs passed, please check your data.", 422)
    );
  }
  const { name, email, password, image, } = req.body;

  // const hasUser = DUMMY_USERS.find((u) => u.email === email);
  // if (hasUser) {
  //   throw new HttpError("Could not create user, email already exists.", 422);
  // }
  // const createUser = {
  //   id: uuid4,
  //   name,
  //   email,
  //   password,
  // };
  // DUMMY_USERS.push(createUser);

  // check if user exists

  const userExists = await User.findOne({ email });
  if (userExists) {
    return next(
      new HttpError("Could not create user, email already exists.", 422)
    );
  }

  const user = await User.create({
    name,
    email,
    password,
    image:
      "https://cdn.pixabay.com/photo/2023/05/09/07/18/space-7980556_960_720.jpg",
    places: [],
  });

  if (user) {
    res.status(201).json({
      _id: user.id,
      name: user.name,
      email: user.email,
      places: user.places,
    });
  } else {
    return next(
      new HttpError("Invalid User Data", 400)
    );
  }
};

const login = async (req, res, next) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });

  if (!user || user.password !== password) {
    return next(
      new HttpError("Invalid Credentials, could not log you in.", 401)
    );
  }

  // const identifiedUser = DUMMY_USERS.find((u) => u.email === email);
  // if (!identifiedUser || identifiedUser.password !== password) {
  //   return next(
  //     new HttpError("Could not identify user, credentials seem to be wrong.", 401));
  // }

  res.json({ message: "Logged in!" });
};

module.exports = { getUsers, signUp, login };
