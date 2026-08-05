import mongoose, { Schema, model, models } from 'mongoose';

const adminSchema = new Schema(
  {
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    fullName: { type: String, required: true },
    role: { 
      type: String, 
      enum: ['super_admin', 'department_admin'], 
      default: 'department_admin' 
    },
    departmentId: { 
      type: Schema.Types.ObjectId, 
      ref: 'Department',
      default: null 
    },
  },
  { timestamps: true }
);

const Admin = models.Admin || model('Admin', adminSchema);

export default Admin;