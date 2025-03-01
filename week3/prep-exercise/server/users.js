import newDatabase from './database.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

const isPersistent = true;
const database = newDatabase({ isPersistent });
const SECRET_KEY = '25b3a1a394281e1cd1ba35b5d145fe319057f77927347a4e0b5903a195df3a13';

export const register = async (req, res) => {
  const { username, password } = req.body;

  if(!username || !password) {
    return res.status(400).json({ message: 'Username and password are required!' });
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const user = database.create({ username, password: hashedPassword });

  res.status(201).json({ id: user.id, username: user.username });
};

export const login = async (req, res) => {
  const { username, password } = req.body;

  if(!username || !password) {
    return res.status(400).json({ message: 'Username and password are required!' });
  }
  
  const user = database.getByUsername(username);

  if(!user) {
    return res.status(400).json({ message: 'User not found!' });
  }

  const isPasswordValid = await bcrypt.compare(password, user.password);

  if(!isPasswordValid) {
    return res.status(400).json({ message: 'Invalid password!' });
  }

  const token = jwt.sign({ id: user.id }, SECRET_KEY);

  res.status(201).json({ token });
};

export const getProfile = (req, res) => {
  const token = req.headers.authorization?.split(' ')[1];

  if(!token) {
    return res.status(401).json({ message: 'Authorization token is required!' });
  }

  try {
    const decoded = jwt.verify(token, SECRET_KEY);
    const user = database.getById(decoded.id);

    if(!user) {
      return res.status(404).json({ message: 'User not found.' });
    }

    res.status(200).json({ id: user.id, username: user.username });
  } catch (error) {
    res.status(401).json({ message: 'Invalid or expired token.' });
  }
};

export const logout = (req, res) => {
  res.status(204).end();
};