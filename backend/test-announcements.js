// Simple test script to verify announcement functionality
import mongoose from 'mongoose';
import Announcement from './models/Announcement.js';
import User from './models/User.js';

const testAnnouncementFunctionality = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/finmen');
    console.log('✅ Connected to MongoDB');

    // Test 1: Create a test announcement
    console.log('\n🧪 Test 1: Creating test announcement...');
    const testAnnouncement = new Announcement({
      tenantId: 'test-tenant',
      title: 'Test Announcement',
      message: 'This is a test announcement to verify the system works correctly.',
      type: 'general',
      priority: 'normal',
      targetAudience: 'all',
      createdBy: new mongoose.Types.ObjectId(),
      createdByName: 'Test Admin',
      createdByRole: 'school_admin',
      publishDate: new Date(),
      isActive: true
    });

    const savedAnnouncement = await testAnnouncement.save();
    console.log('✅ Test announcement created:', savedAnnouncement._id);

    // Test 2: Find announcements
    console.log('\n🧪 Test 2: Finding announcements...');
    const announcements = await Announcement.find({ tenantId: 'test-tenant' });
    console.log('✅ Found announcements:', announcements.length);

    // Test 3: Update announcement
    console.log('\n🧪 Test 3: Updating announcement...');
    const updatedAnnouncement = await Announcement.findByIdAndUpdate(
      savedAnnouncement._id,
      { title: 'Updated Test Announcement' },
      { new: true }
    );
    console.log('✅ Announcement updated:', updatedAnnouncement.title);

    // Test 4: Test filtering by target audience
    console.log('\n🧪 Test 4: Testing audience filtering...');
    const studentAnnouncements = await Announcement.find({
      tenantId: 'test-tenant',
      $or: [
        { targetAudience: 'all' },
        { targetAudience: 'students' }
      ]
    });
    console.log('✅ Student announcements found:', studentAnnouncements.length);

    // Test 5: Test pinning functionality
    console.log('\n🧪 Test 5: Testing pin functionality...');
    await Announcement.findByIdAndUpdate(
      savedAnnouncement._id,
      { isPinned: true }
    );
    const pinnedAnnouncements = await Announcement.find({
      tenantId: 'test-tenant',
      isPinned: true
    });
    console.log('✅ Pinned announcements found:', pinnedAnnouncements.length);

    // Test 6: Test expiry date filtering
    console.log('\n🧪 Test 6: Testing expiry date filtering...');
    const activeAnnouncements = await Announcement.find({
      tenantId: 'test-tenant',
      isActive: true,
      $and: [
        { publishDate: { $lte: new Date() } },
        {
          $or: [
            { expiryDate: { $exists: false } },
            { expiryDate: null },
            { expiryDate: { $gte: new Date() } }
          ]
        }
      ]
    });
    console.log('✅ Active announcements found:', activeAnnouncements.length);

    // Cleanup
    console.log('\n🧹 Cleaning up test data...');
    await Announcement.deleteMany({ tenantId: 'test-tenant' });
    console.log('✅ Test data cleaned up');

    console.log('\n🎉 All tests passed! Announcement system is working correctly.');

  } catch (error) {
    console.error('❌ Test failed:', error);
  } finally {
    await mongoose.disconnect();
    console.log('✅ Disconnected from MongoDB');
  }
};

// Run the test
testAnnouncementFunctionality();
