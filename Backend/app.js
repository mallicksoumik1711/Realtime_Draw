const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
require('dotenv').config();

//routes
const authRoutes = require('./routes/authRoutes');
const drawRoomRoutes = require('./routes/drawRoomRoutes');
const userRoutes = require('./routes/userRoutes');

const app = express();

app.use(cors());
app.use(express.json());

connectDB();

app.get('/', (req, res)=>{
    res.send("Backend is running");
});

app.use('/api/auth', authRoutes);
app.use('/api/drawroom', drawRoomRoutes);
app.use('/api/users', userRoutes);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () =>{
    console.log(`Server is running on port ${PORT}`); //locally
});