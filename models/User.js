import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
  fullName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { 
    type: String, 
    enum: ['student', 'staff', 'admin'], 
    default: 'student' 
  },
  departmentId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Department',
    default: null 
  }
}, { timestamps: true });

export default mongoose.models.User || mongoose.model('User', UserSchema);