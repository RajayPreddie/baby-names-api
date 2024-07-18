import express from 'express';
import dotenv from 'dotenv';
import { Sequelize } from 'sequelize';
import babyNameRoutes from '../src/routes/babyNames';

dotenv.config();

const app = express();
const port = process.env.PORT || 8080;

const sequelize = new Sequelize(process.env.DATABASE_URL as string, {
  dialect: 'postgres',
  protocol: 'postgres',
  logging: false
});

app.use(express.json());
// Home route
app.get('/', (req, res) => {
  res.send('Welcome to the Baby Names API!');
})

app.use('/api/babyNames', babyNameRoutes);


app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

module.exports = app;