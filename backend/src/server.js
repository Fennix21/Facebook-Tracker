import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './routes/authRoutes.js';
import coreRoutes from './routes/coreRoutes.js';
import adminRoutes from './routes/adminRoutes.js';

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api', coreRoutes);
app.use('/api/admin', adminRoutes);

app.listen(process.env.PORT || 4000, () => console.log('Backend running'));
