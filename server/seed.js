const mongoose = require('mongoose');
const bcrypt   = require('bcryptjs');
require('dotenv').config();

const User     = require('./models/User');
const Decision = require('./models/Decision');

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/decidr';

const daysAgo = (n) => {
  const d = new Date();
  d.setDate(d.getDate() - n);
  return d;
};

async function main() {
  await mongoose.connect(MONGO_URI);
  console.log('✅ Connected to MongoDB');
  console.log('🌱 Seeding...\n');

  // Clean
  await User.deleteMany({});
  await Decision.deleteMany({});

  // Demo user
  const hashed = await bcrypt.hash('password123', 10);
  const user   = await User.create({ name: 'Alex Kumar', email: 'alex@decidr.app', password: hashed });
  console.log(`👤 Created user: alex@decidr.app / password123`);

  // ── Decision 1: Waking up at 5am (90 days, strong upward trend) ──
  await Decision.create({
    userId:      user._id,
    title:       'Started waking up at 5am every day',
    description: 'Wanted more focused morning time before work and family.',
    category:    'Habits',
    startedAt:   daysAgo(90),
    checkins: [
      { productivity: 4, mood: 5, energy: 4, notes: 'Baseline before starting',             loggedAt: daysAgo(90) },
      { productivity: 4, mood: 4, energy: 3, notes: 'Hard first week, tired constantly',    loggedAt: daysAgo(80) },
      { productivity: 5, mood: 5, energy: 4, notes: 'Getting used to it',                  loggedAt: daysAgo(70) },
      { productivity: 6, mood: 6, energy: 5, notes: 'Sleep schedule stabilizing',           loggedAt: daysAgo(60) },
      { productivity: 7, mood: 6, energy: 6, notes: 'Morning time is genuinely valuable',  loggedAt: daysAgo(45) },
      { productivity: 7, mood: 7, energy: 7, notes: 'Best productivity in years',          loggedAt: daysAgo(30) },
      { productivity: 8, mood: 7, energy: 8, notes: 'This feels natural now',              loggedAt: daysAgo(14) },
      { productivity: 8, mood: 8, energy: 8, notes: 'Incredible change overall',           loggedAt: daysAgo(3)  },
    ],
  });
  console.log('✅ Decision 1: Waking up at 5am (8 check-ins)');

  // ── Decision 2: No social media after 9pm ──
  await Decision.create({
    userId:      user._id,
    title:       'Cut social media after 9pm',
    description: 'To improve sleep and reduce late-night anxiety.',
    category:    'Mental Health',
    startedAt:   daysAgo(60),
    checkins: [
      { productivity: 5, mood: 4, energy: 5, notes: 'Baseline — scrolling til midnight',   loggedAt: daysAgo(60) },
      { productivity: 5, mood: 5, energy: 5, notes: 'Hard not to check notifications',     loggedAt: daysAgo(50) },
      { productivity: 6, mood: 6, energy: 6, notes: 'Sleeping earlier, more rested',       loggedAt: daysAgo(40) },
      { productivity: 6, mood: 7, energy: 7, notes: 'Huge difference in morning mood',     loggedAt: daysAgo(25) },
      { productivity: 7, mood: 8, energy: 7, notes: 'Reading before bed — loving it',      loggedAt: daysAgo(10) },
      { productivity: 7, mood: 8, energy: 8, notes: 'Will never go back',                  loggedAt: daysAgo(2)  },
    ],
  });
  console.log('✅ Decision 2: No social media after 9pm (6 check-ins)');

  // ── Decision 3: 30-min daily walk ──
  await Decision.create({
    userId:      user._id,
    title:       '30-minute walk every morning',
    description: 'Light exercise to boost energy and get sunlight before screens.',
    category:    'Health & Fitness',
    startedAt:   daysAgo(45),
    checkins: [
      { productivity: 5, mood: 5, energy: 3, notes: 'Baseline — sluggish every morning',   loggedAt: daysAgo(45) },
      { productivity: 5, mood: 5, energy: 4, notes: 'Legs sore but mood better',           loggedAt: daysAgo(38) },
      { productivity: 6, mood: 6, energy: 6, notes: 'Energy noticeably higher by afternoon', loggedAt: daysAgo(28) },
      { productivity: 7, mood: 7, energy: 7, notes: 'Miss it on rest days',                loggedAt: daysAgo(15) },
      { productivity: 7, mood: 8, energy: 8, notes: 'Best 30 mins of the day',             loggedAt: daysAgo(5)  },
    ],
  });
  console.log('✅ Decision 3: 30-min daily walk (5 check-ins)');

  // ── Decision 4: Weekly 1:1s with team ──
  await Decision.create({
    userId:      user._id,
    title:       'Started weekly 1:1s with each team member',
    description: 'Better alignment and catch blockers before they become problems.',
    category:    'Career',
    startedAt:   daysAgo(30),
    checkins: [
      { productivity: 6, mood: 6, energy: 6, notes: 'Baseline — team feels disconnected',  loggedAt: daysAgo(30) },
      { productivity: 7, mood: 6, energy: 6, notes: 'Team responding well',                loggedAt: daysAgo(21) },
      { productivity: 7, mood: 7, energy: 6, notes: 'Fewer surprises in standups',         loggedAt: daysAgo(10) },
      { productivity: 8, mood: 7, energy: 7, notes: 'Should have done this from day one',  loggedAt: daysAgo(2)  },
    ],
  });
  console.log('✅ Decision 4: Weekly 1:1s (4 check-ins)');

  // ── Decision 5: No caffeine after 2pm (new, early stage) ──
  await Decision.create({
    userId:      user._id,
    title:       'No caffeine after 2pm',
    description: 'Sleep quality suffering — trying to fix the root cause.',
    category:    'Health & Fitness',
    startedAt:   daysAgo(7),
    checkins: [
      { productivity: 6, mood: 6, energy: 7, notes: 'Baseline — afternoon coffee for years', loggedAt: daysAgo(7) },
      { productivity: 5, mood: 5, energy: 5, notes: 'Withdrawal headaches are real',          loggedAt: daysAgo(4) },
      { productivity: 6, mood: 6, energy: 6, notes: 'Sleeping deeper already',                loggedAt: daysAgo(1) },
    ],
  });
  console.log('✅ Decision 5: No caffeine after 2pm (3 check-ins)');

  console.log('\n🎉 Seed complete!');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('  Email:    alex@decidr.app');
  console.log('  Password: password123');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
}

main()
  .catch((e) => { console.error('❌ Seed failed:', e.message); process.exit(1); })
  .finally(() => mongoose.disconnect());
