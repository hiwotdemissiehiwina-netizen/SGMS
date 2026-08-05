import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

// .env ፋይሉን ከ Root folder ለማንበብ
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, '../.env') });

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/sgms-system';

console.log('Using MongoDB URI:', MONGODB_URI);

const departmentSchema = new mongoose.Schema({
  name: { type: String, required: true },
  code: { type: String, required: true },
});

const adminSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  fullName: { type: String, required: true },
  role: { type: String, default: 'department_admin' },
  departmentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Department' },
});

const Department = mongoose.models.Department || mongoose.model('Department', departmentSchema);
const Admin = mongoose.models.Admin || mongoose.model('Admin', adminSchema);

const departmentsData = [
  { name: 'Aesthetics', code: 'AES', username: 'aesthetics_dean', password: 'password123' },
  { name: 'Electrical & Electronics', code: 'EE', username: 'electrical_dean', password: 'password123' },
  { name: 'ICT', code: 'ICT', username: 'ict_dean', password: 'password123' },
  { name: 'Textile & Garment', code: 'TG', username: 'textile_dean', password: 'password123' },
  { name: 'Hotel & Tourism', code: 'HT', username: 'hotel_dean', password: 'password123' },
  { name: 'Automotive Technology', code: 'AT', username: 'auto_dean', password: 'password123' },
  { name: 'Wood Work & Metal Technology', code: 'WM', username: 'woodmetal_dean', password: 'password123' },
  { name: 'Business & Finance', code: 'BF', username: 'business_dean', password: 'password123' },
  { name: 'Construction Technology', code: 'CT', username: 'construction_dean', password: 'password123' },
  { name: 'Urban Agriculture', code: 'UA', username: 'agriculture_dean', password: 'password123' },
];

async function seedDatabase() {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(MONGODB_URI);
    console.log('Connected successfully!');

    await Department.deleteMany({});
    await Admin.deleteMany({});
    console.log('Cleared old departments and admins.');

    for (const item of departmentsData) {
      const department = await Department.create({
        name: item.name,
        code: item.code,
      });

      await Admin.create({
        username: item.username,
        password: item.password,
        fullName: `${item.name} Department Dean`,
        role: 'department_admin',
        departmentId: department._id,
      });

      console.log(`✅ Created: ${item.name} -> Username: ${item.username}`);
    }

    // ሱፐር አድሚንም አብሮ እንዲፈጠር
    await Admin.create({
      username: 'superadmin',
      password: 'password123',
      fullName: 'Super Admin',
      role: 'super_admin',
    });
    console.log('✅ Created Super Admin -> Username: superadmin');

    console.log('\n🎉 Database Seed Completed!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  }
}

seedDatabase();