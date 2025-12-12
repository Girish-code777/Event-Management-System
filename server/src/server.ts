import { config } from 'dotenv';
config();
import app from './app';
import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import User from './models/User';
import Event from './models/Event';
import bcrypt from 'bcryptjs';

const PORT = process.env.PORT ? Number(process.env.PORT) : 4000;
const MONGO_URI = process.env.MONGO_URI as string | undefined;

async function start() {
  try {
    let uri = MONGO_URI;
    let mem: MongoMemoryServer | null = null;

    if (uri) {
      try {
        await mongoose.connect(uri, { serverSelectionTimeoutMS: 3000 } as any);
        console.log('MongoDB connected');
      } catch (e) {
        console.warn('Primary MongoDB not available. Falling back to in-memory.');
        mem = await MongoMemoryServer.create();
        uri = mem.getUri();
        await mongoose.connect(uri);
        console.log('In-memory MongoDB connected');
      }
    } else {
      mem = await MongoMemoryServer.create();
      uri = mem.getUri();
      await mongoose.connect(uri);
      console.log('In-memory MongoDB connected');
    }
    async function seed() {
      const users = await User.countDocuments();
      if (users === 0) {
        const passwordHash = await bcrypt.hash('admin123', 10);
        await User.create({ name: 'Admin', email: 'admin@example.com', passwordHash, role: 'admin' });
      }
      const anyAdmin = await User.findOne({ role: 'admin' });
      if (!anyAdmin) return;
      // Ensure assistant bot user exists
      const botEmail = 'assistant@rrc.local';
      const botExists = await User.findOne({ email: botEmail });
      if (!botExists) {
        const botPass = await bcrypt.hash('bot_placeholder', 4);
        await User.create({ name: 'Assistant', email: botEmail, passwordHash: botPass, role: 'coordinator' });
      }
      const eventsCount = await Event.countDocuments();
      if (eventsCount === 0) {
        const today = new Date();
        const fmt = (d: Date) => d.toISOString().slice(0,10);
        await Event.create([
          { name: 'AI Symposium 2025', category: 'Tech', description: 'Talks, workshops, and demos on AI and ML.', date: fmt(new Date(today.getTime()+86400000*3)), startTime: '10:00', endTime: '16:00', venue: 'Aryabhata Seminar Hall', capacity: 300, createdBy: anyAdmin._id, coordinators: [anyAdmin._id], isPublished: true, tags: ['AI','ML'] },
          { name: 'Cultural Fest: Aurora', category: 'Cultural', description: 'Music, dance, drama and more under the lights.', date: fmt(new Date(today.getTime()+86400000*10)), startTime: '17:00', endTime: '22:00', venue: 'APJ Abdul Kalam Hall', capacity: 800, createdBy: anyAdmin._id, coordinators: [anyAdmin._id], isPublished: true, tags: ['Fest','Music'] },
          { name: 'Hackathon: CodeStorm', category: 'Hackathon', description: '24-hour coding challenge with exciting prizes.', date: fmt(new Date(today.getTime()+86400000*20)), startTime: '09:00', endTime: '09:00', venue: 'Innovation Lab', capacity: 150, createdBy: anyAdmin._id, coordinators: [anyAdmin._id], isPublished: true, tags: ['Hackathon','Coding'] },
          { name: 'Quiz', category: 'Academic', description: 'Inter-department general knowledge and tech quiz.', date: fmt(new Date(today.getTime()+86400000*5)), startTime: '11:00', endTime: '13:00', venue: 'Seminar Hall 1', capacity: 120, createdBy: anyAdmin._id, coordinators: [anyAdmin._id], isPublished: true, tags: ['Quiz'] },
          { name: 'Volleyball', category: 'Sports', description: 'Inter-college volleyball tournament.', date: fmt(new Date(today.getTime()+86400000*7)), startTime: '09:00', endTime: '17:00', venue: 'Sports Ground', capacity: 200, createdBy: anyAdmin._id, coordinators: [anyAdmin._id], isPublished: true, tags: ['Sports','Team'] },
          { name: 'Kabbadi', category: 'Sports', description: 'Traditional sport event—show your strength and agility.', date: fmt(new Date(today.getTime()+86400000*8)), startTime: '09:00', endTime: '17:00', venue: 'Sports Ground', capacity: 180, createdBy: anyAdmin._id, coordinators: [anyAdmin._id], isPublished: true, tags: ['Sports'] },
          { name: 'Badminton', category: 'Sports', description: 'Singles and doubles badminton championship.', date: fmt(new Date(today.getTime()+86400000*9)), startTime: '10:00', endTime: '18:00', venue: 'Indoor Stadium', capacity: 160, createdBy: anyAdmin._id, coordinators: [anyAdmin._id], isPublished: true, tags: ['Sports','Indoor'] },
          { name: 'Box Cricket', category: 'Sports', description: 'Fast-paced indoor cricket format with small teams.', date: fmt(new Date(today.getTime()+86400000*11)), startTime: '10:00', endTime: '18:00', venue: 'Indoor Arena', capacity: 150, createdBy: anyAdmin._id, coordinators: [anyAdmin._id], isPublished: true, tags: ['Cricket','Indoor'] },
          { name: 'Debate', category: 'Cultural', description: 'Formal debate competition on contemporary topics.', date: fmt(new Date(today.getTime()+86400000*6)), startTime: '14:00', endTime: '17:00', venue: 'Seminar Hall 2', capacity: 100, createdBy: anyAdmin._id, coordinators: [anyAdmin._id], isPublished: true, tags: ['Oration'] },
          { name: 'Essay Writing', category: 'Academic', description: 'Essay competition to test clarity of thought and writing.', date: fmt(new Date(today.getTime()+86400000*6)), startTime: '10:00', endTime: '12:00', venue: 'Language Lab', capacity: 100, createdBy: anyAdmin._id, coordinators: [anyAdmin._id], isPublished: true, tags: ['Writing'] },
          { name: 'Dance', category: 'Cultural', description: 'Solo and group dance performances across genres.', date: fmt(new Date(today.getTime()+86400000*12)), startTime: '18:00', endTime: '21:00', venue: 'Auditorium', capacity: 500, createdBy: anyAdmin._id, coordinators: [anyAdmin._id], isPublished: true, tags: ['Dance','Stage'] },
          { name: 'Singing', category: 'Cultural', description: 'Solo and duet singing competition.', date: fmt(new Date(today.getTime()+86400000*13)), startTime: '18:00', endTime: '21:00', venue: 'Auditorium', capacity: 400, createdBy: anyAdmin._id, coordinators: [anyAdmin._id], isPublished: true, tags: ['Music','Vocal'] },
          { name: 'Fashion Walk', category: 'Cultural', description: 'Showcase your style in the fashion walk.', date: fmt(new Date(today.getTime()+86400000*14)), startTime: '19:00', endTime: '21:00', venue: 'Open Stage', capacity: 600, createdBy: anyAdmin._id, coordinators: [anyAdmin._id], isPublished: true, tags: ['Fashion','Showcase'] },
          { name: 'Treasure Hunt', category: 'Fun', description: 'Team up and solve clues to find hidden treasures.', date: fmt(new Date(today.getTime()+86400000*4)), startTime: '10:00', endTime: '13:00', venue: 'Campus Grounds', capacity: 200, createdBy: anyAdmin._id, coordinators: [anyAdmin._id], isPublished: true, tags: ['Team','Puzzle'] },
          { name: 'Technical Talk', category: 'Tech', description: 'Invited talk on cutting-edge technology trends.', date: fmt(new Date(today.getTime()+86400000*15)), startTime: '15:00', endTime: '17:00', venue: 'Conference Hall', capacity: 250, createdBy: anyAdmin._id, coordinators: [anyAdmin._id], isPublished: true, tags: ['Talk','Tech'] },
        ]);
      }
    }

    await seed();
    app.listen(PORT, () => console.log(`Server listening on http://localhost:${PORT}`));

    const shutdown = async () => {
      await mongoose.connection.close();
      if (mem) await mem.stop();
      process.exit(0);
    };
    process.on('SIGINT', shutdown);
    process.on('SIGTERM', shutdown);
  } catch (err) {
    console.error('Failed to start server', err);
    process.exit(1);
  }
}

start();
