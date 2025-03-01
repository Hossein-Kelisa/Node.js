import express from 'express';
import { register, login, getProfile, logout } from './users.js';

let app = express();
app.use(express.json());

app.post('/auth/register', register);  //this will register a new user

app.post('/auth/login', login);   //this will login a user

app.get('/auth/profile', getProfile);  //this will get the profile of the user

app.post('/auth/logout', logout);  //this will logout the user

// Serve the front-end application from the `client` folder
app.use(express.static('client'));

app.listen(3000, () => {
  console.log('Server is running on port 3000');
});