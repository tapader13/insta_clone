import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import connectDB from './utilities/db.js';
import userRoute from './routes/userRoute.js';
import postRoute from './routes/postRoute.js';
import messageRoute from './routes/messageRoute.js';
import { app, server } from './socket/socket.js';
import path from 'path';
//config
dotenv.config({});

const __dirname = path.resolve();
//middlewares

app.use(express.json());
const corsOptions = {
  origin: 'http://localhost:5173',
  credentials: true,
};
app.use(cors(corsOptions));
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));

//default route
// app.get('/', (_, res) => {
//   res.send('Hello World!');
// });

//routes
app.use('/api/v1/user', userRoute);
app.use('/api/v1/post', postRoute);
app.use('/api/v1/message', messageRoute);

app.use(express.static(path.join(__dirname, '/frontend/dist')));
app.get('*', (req, res) => {
  res.sendFile(path.resolve(__dirname, 'frontend', 'dist', 'index.html'));
});
//listen
server.listen(process.env.PORT, () => {
  connectDB();
  console.log(`Listening on port ${process.env.PORT}`);
});
