import express from 'express';
import cors from 'cors';
import authRouter from './routes/auth';
import eventsRouter from './routes/events';
import chatRouter from './routes/chat';
import type { Request, Response } from 'express';

const app = express();

app.use(cors({
  origin: (origin, cb) => {
    const allowed = [
      'http://localhost:5173',
      'http://localhost:5174',
      process.env.CORS_ORIGIN || ''
    ].filter(Boolean);
    if (!origin || allowed.includes(origin)) return cb(null, true);
    return cb(null, false);
  },
  credentials: false
}));
app.use(express.json());

app.get('/health', (_req: Request, res: Response) => res.json({ status: 'ok' }));
app.use('/auth', authRouter);
app.use('/events', eventsRouter);
app.use('/chat', chatRouter);

export default app;
