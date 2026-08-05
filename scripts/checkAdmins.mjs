import mongoose from 'mongoose';

const MONGODB_URI = 'mongodb://127.0.0.1:27017/sgms_database';

const AdminSchema = new mongoose.Schema({
  username: String,
  password: String,
  role: String,
});

const Admin = mongoose.models.Admin || mongoose.model('Admin', AdminSchema);

async function check() {
  try {
    await mongoose.connect(MONGODB_URI);
    const admins = await Admin.find({});
    console.log('--- በዳታቤዝህ ውስጥ ያሉ ሁሉም አድሚኖች ---');
    console.log(admins);
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

check();