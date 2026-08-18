const cron = require('node-cron');
const User = require('../models/user.model.js');
const Registration = require('../models/registration.model.js');

// Schedule job to run every day exactly at 22:00 (10:00 PM)
// Format: 'Minute Hour DayOfMonth Month DayOfWeek'
cron.schedule('0 22 * * *', async () => {
  console.log('⏰ [CRON JOB] Running the 10:00 PM Auto-Pilot Registration...');

  try {
    // 1. Calculate tomorrow's date
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(0, 0, 0, 0);

    // 2. Find all students who have Auto-Pilot 'mode1' enabled
    const autoPilotUsers = await User.find({ role: 'student', autoPilotMode: 'mode1' });

    console.log(`Found ${autoPilotUsers.length} users with Auto-Pilot Mode 1 enabled.`);

    let autoRegisteredCount = 0;

    // 3. Iterate through them and register if they haven't manually done so
    for (const user of autoPilotUsers) {
      const existingReg = await Registration.findOne({ studentId: user._id, date: tomorrow });
      
      if (!existingReg) {
        // If no registration exists, auto-register them for all basic meals
        const qrData = `MESS-${user._id}-${tomorrow.getTime()}`;
        
        await Registration.create({
          studentId: user._id,
          messId: user.messId, // Crucial for multi-tenancy
          date: tomorrow,
          meals: { breakfast: true, lunch: true, dinner: true },
          specialItemsSelected: [],
          status: 'registered',
          qrCodeData: qrData
        });
        
        autoRegisteredCount++;
      }
    }

    console.log(`✅ [CRON JOB] Successfully auto-registered ${autoRegisteredCount} students for tomorrow's meals!`);
  } catch (error) {
    console.error('❌ [CRON JOB] Failed to run Auto-Pilot:', error);
  }
});

console.log('⚙️  Scheduler initialized: 10 PM Auto-Pilot job is active and waiting.');
