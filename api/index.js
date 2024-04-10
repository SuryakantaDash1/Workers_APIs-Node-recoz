import express from 'express';
import bodyParser from 'body-parser';
import dotenv from 'dotenv';
import connect from './database/conn.js'; 
import router from './router/route.js';
import route from './router/projectRoute.js';

const app = express();

app.use(express.json());
app.use(bodyParser.json());
dotenv.config();

const PORT = process.env.PORT || 5000;

app.get('/', (req, res) => {
    res.status(201).json("Home");
});

app.use('/api', router);
app.use('/api', route);

connect();

app.listen(PORT, () => {
    console.log(`Server is running on ${PORT}`);
});












