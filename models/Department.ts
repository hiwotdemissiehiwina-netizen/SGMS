import mongoose, { Schema } from 'mongoose';

const departmentSchema = new Schema(
  {
    name: { type: String, required: true },
    code: { type: String, required: true },
  },
  { timestamps: true }
);

export default mongoose.models.Department || mongoose.model('Department', departmentSchema);