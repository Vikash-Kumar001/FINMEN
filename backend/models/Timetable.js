import mongoose from 'mongoose';

const timetableSchema = new mongoose.Schema({
  tenantId: {
    type: String,
    required: true,
  },
  orgId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Organization',
  },
  classId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'SchoolClass',
  },
  className: {
    type: String,
    required: true,
  },
  section: {
    type: String,
  },
  academicYear: {
    type: String,
    required: true,
  },
  schedule: [{
    day: {
      type: String,
      enum: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
      required: true,
    },
    periods: [{
      periodNumber: Number,
      startTime: String, // "09:00 AM"
      endTime: String,   // "09:45 AM"
      subject: String,
      teacherId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
      },
      teacherName: String,
      room: String,
      isBreak: {
        type: Boolean,
        default: false,
      },
    }],
  }],
  effectiveFrom: {
    type: Date,
    default: Date.now,
  },
  effectiveTo: {
    type: Date,
  },
  isActive: {
    type: Boolean,
    default: true,
  },
}, {
  timestamps: true,
});

// Indexes
timetableSchema.index({ tenantId: 1, classId: 1, academicYear: 1 });
timetableSchema.index({ tenantId: 1, 'schedule.periods.teacherId': 1 });

const Timetable = mongoose.model('Timetable', timetableSchema);
export default Timetable;

