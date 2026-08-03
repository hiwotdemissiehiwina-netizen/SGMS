import mongoose, { Schema } from 'mongoose';

const grievanceSchema = new Schema(
  {
    studentName: { type: String, required: true },
    studentId: { type: String, required: true },
    reason: { type: String, required: true },
    status: { type: String, default: 'pending' },
    departmentId: { 
      type: Schema.Types.ObjectId, 
      ref: 'Department', 
      required: true 
    },
  },
  { timestamps: true }
);

export default mongoose.models.Grievance || mongoose.model('Grievance', grievanceSchema);