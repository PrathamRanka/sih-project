import express from 'express';
import cors from 'cors'; // 1. Import cors
import { processResult, getResults } from './controllers/resultController.js';
import multer from 'multer';
import dotenv from 'dotenv';
dotenv.config();

const app = express();

// 2. Enable CORS for your frontend's URL
app.use(cors({ origin: 'http://localhost:5173' }));

app.use(express.json());

const upload = multer();
app.post('/api/results', upload.single('image'), processResult);
app.get('/api/results', getResults);

// Add an error handler middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Internal Server Error' });
});

app.listen(5000, () => {
  console.log('Server is running on port 5000');
});