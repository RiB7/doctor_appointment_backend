import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import doctorRoutes from './routes/doctors'; 

const app = express();

app.use(cors());
app.use(express.json());

app.use('/doctors', doctorRoutes); 

app.get('/', (req, res) => {
  res.send('API is working!');
});

const PORT = process.env.PORT || 5000;
mongoose.connect('mongodb://localhost:27017/doctorDB')
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch((err) => console.error('MongoDB connection error:', err));
