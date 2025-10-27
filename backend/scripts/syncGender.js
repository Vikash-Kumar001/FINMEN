import mongoose from 'mongoose';
import User from '../models/User.js';
import SchoolStudent from '../models/School/SchoolStudent.js';
import fs from 'fs';
import path from 'path';

// Read .env file
let MONGO_URI = 'mongodb://localhost:27017/finmen';
const envPath = path.join(process.cwd(), 'backend', '.env');
if (fs.existsSync(envPath)) {
  const envContent = fs.readFileSync(envPath, 'utf8');
  const mongoMatch = envContent.match(/MONGO_URI=(.+)/);
  if (mongoMatch) {
    MONGO_URI = mongoMatch[1].trim();
  }
}

async function syncStudentGender() {
  try {
    // Connect to MongoDB
    console.log('Connecting to MongoDB...');
    await mongoose.connect(MONGO_URI);
    console.log('Connected to MongoDB');

    let updated = 0;
    let skipped = 0;

    // Get all school students (bypass tenantId validation for migration)
    // Use collection.find() to bypass Mongoose hooks
    const studentsData = await mongoose.connection.db.collection('schoolstudents').find({}).toArray();
    const userIds = studentsData.map(s => s.userId).filter(Boolean);
    const users = await User.find({ _id: { $in: userIds } }).lean();
    const userMap = new Map(users.map(u => [u._id.toString(), u]));
    
    console.log(`Found ${studentsData.length} students to check`);
    
    for (const studentData of studentsData) {
      if (studentData.userId) {
        try {
          const user = userMap.get(studentData.userId.toString());
          if (!user) continue;
          
          const schoolStudentGender = studentData.personalInfo?.gender;
          const userGender = user.gender;
          
          // Check if user has gender
          if (!userGender && schoolStudentGender) {
            // Update user with gender from SchoolStudent
            await mongoose.connection.db.collection('users').updateOne(
              { _id: new mongoose.Types.ObjectId(user._id.toString()) },
              { $set: { gender: schoolStudentGender } }
            );
            console.log(`✓ Updated User gender for ${user.name}: ${schoolStudentGender}`);
            updated++;
          } else if (!schoolStudentGender && userGender) {
            // Update SchoolStudent with gender from User
            await mongoose.connection.db.collection('schoolstudents').updateOne(
              { _id: new mongoose.Types.ObjectId(studentData._id.toString()) },
              { 
                $set: { 
                  'personalInfo.gender': userGender,
                  'personalInfo': { ...studentData.personalInfo, gender: userGender }
                } 
              }
            );
            console.log(`✓ Updated SchoolStudent gender for ${user.name}: ${userGender}`);
            updated++;
          } else if (userGender || schoolStudentGender) {
            skipped++;
          }
        } catch (error) {
          console.error(`✗ Error updating student:`, error.message);
        }
      }
    }

    console.log(`\n✅ Sync complete!`);
    console.log(`   Updated: ${updated} records`);
    console.log(`   Skipped: ${skipped} records (already had gender)`);

    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  } catch (error) {
    console.error('Error syncing gender:', error);
    await mongoose.disconnect();
    process.exit(1);
  }
}

// Run the sync
syncStudentGender();

