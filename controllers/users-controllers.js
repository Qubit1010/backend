const HttpError = require("../models/http.error");
const { validationResult } = require('express-validator');
const uuid = require("uuid");
const uuid4 = uuid.v4();


const DUMMY_USERS   = [{
        id: "u1",
        name: "Itid",
        email: "test@123.com",
        password: "12341",
},]

const getUsers = (req, res, next) => {
    res.json({ user: DUMMY_USERS})
}

const signUp = (req, res, next) => {

    const errors = validationResult(req);
  if (!errors.isEmpty()) {
    throw new HttpError('Invalid inputs passed, please check your data.', 422);
  }
    const {name, email, password} = req.body
    
    const hasUser = DUMMY_USERS.find(u => u.email === email);
    if (hasUser) {
      throw new HttpError('Could not create user, email already exists.', 422);
    }    
    
    const createUser = {
        id: uuid4,
        name,
        email,
        password,
      };

      DUMMY_USERS.push(createUser)

      res.status(201).json({ user: createUser });
}

const login = (req, res, next) => {
    const { email, password } = req.body;

    const identifiedUser = DUMMY_USERS.find(u => u.email === email);
    if (!identifiedUser || identifiedUser.password !== password) {
      throw new HttpError('Could not identify user, credentials seem to be wrong.', 401);
    }
  
    res.json({message: 'Logged in!'});
}

module.exports = {getUsers, signUp, login}