import express from 'express';
import authRouter from './routes/authRoutes';
import apiRouter from './routes/apiRoutes';

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(authRouter);
app.use(apiRouter);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

