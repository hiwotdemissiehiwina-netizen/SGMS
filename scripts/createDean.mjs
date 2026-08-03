import mongoose from 'mongoose';

const MONGODB_URI = 'mongodb://127.0.0.1:27017/sgms_database';

// Schema Definitions
const DepartmentSchema = new mongoose.Schema({ name: String });
const Department = mongoose.models.Department || mongoose.model('Department', DepartmentSchema);

const AdminSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  fullName: { type: String, required: true },
  role: { type: String, default: 'ADMIN' },
  departmentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Department' },
});
const Admin = mongoose.models.Admin || mongoose.model('Admin', AdminSchema);

async function run() {
  await mongoose.connect(MONGODB_URI);

  // 1. ዲፓርትመንት መኖሩን ማረጋገጥ (ለምሳሌ IT)
  let dept = await Department.findOne({ name: 'Information Technology' });
  if (!dept) {
    dept = await Department.create({ name: 'Information Technology' });
  }

  // 2. የድሮውን የተበላሸ 'it_dean' ማጽዳት
  await Admin.deleteOne({ username: 'it_dean' });

  // 3. አዲስ Normal Admin መፍጠር
  await Admin.create({
    username: 'it_dean',
    password: 'password123',
    fullName: 'IT Department Dean',
    role: 'ADMIN',
    departmentId: dept._id,
  });

  console.log('✅ Normal Admin (it_dean) created successfully!');
  process.exit(0);
}

run();