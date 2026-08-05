import mongoose from 'mongoose';

const GrievanceSchema = new mongoose.Schema({
  ticketId: { 
    type: String, 
    required: true, 
    unique: true 
  },
  studentName: { 
    type: String, 
    default: 'Anonymous' 
  },
  studentId: { 
    type: String, 
    default: 'N/A' 
  },
  department: { 
    type: String, 
    required: true 
  },
  subject: { 
    type: String, 
    required: true 
  },
  message: { 
    type: String, 
    required: true 
  },
  isAnonymous: { 
    type: Boolean, 
    default: false 
  },
  status: { 
    type: String, 
    enum: ['Pending', 'In Progress', 'Resolved'], 
    default: 'Pending' 
  },
  responses: [{
    responderName: String,
    message: String,
    createdAt: { type: Date, default: Date.now }
  }]
}, { timestamps: true });

export default mongoose.models.Grievance || mongoose.model('Grievance', GrievanceSchema);