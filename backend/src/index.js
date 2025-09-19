import express from 'express';
import cors from 'cors';
import connectDB from './config/db.js';
import guestsRouter from './routes/guests.js';
import usersRouter from './routes/users.js';
import zonesRouter from './routes/zones.js';
import notificationsRouter from './routes/notifications.js';
import leaderboardRouter from './routes/leaderboard.js';
import pipelineRouter from './routes/pipeline.js';
import analyticsRouter from './routes/analytics.js';

// Connect to MongoDB
connectDB();

const app = express();
app.use(cors());
app.use(express.json());

app.use('/api/roast-crm/guests', guestsRouter);
app.use('/api/roast-crm/users', usersRouter);
app.use('/api/roast-crm/zones', zonesRouter);
app.use('/api/roast-crm/notifications', notificationsRouter);
app.use('/api/roast-crm/leaderboard', leaderboardRouter);
app.use('/api/roast-crm/pipeline', pipelineRouter);
app.use('/api/roast-crm/analytics', analyticsRouter);

app.get('/api/me', (req, res) => {
    res.json({
        _id: 'current-user',
        name: 'John Doe',
        email: 'john@church.org',
        phone: '+2348012345678',
        role: 'WORKER',
        zoneName: 'Central Zone',
        guestCount: 12,
        isActive: true,
        zoneIds: ['zone-1']
    });
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
