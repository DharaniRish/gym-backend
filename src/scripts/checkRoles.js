import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, '../../.env') });

const userSchema = new mongoose.Schema({
    email: String,
    role: String
});

const User = mongoose.model('User', userSchema);

async function checkUsers() {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Connected to MongoDB');

        const users = await User.find({}, 'email role');
        console.log('All Users and Roles:');
        users.forEach(u => {
            console.log(`- ${u.email}: ${u.role}`);
        });

        const trainers = await User.find({ role: { $in: ['trainer', 'admin'] } });
        console.log(`\nFound ${trainers.length} authorized users (trainer/admin).`);

    } catch (err) {
        console.error('Error:', err.message);
    } finally {
        await mongoose.disconnect();
    }
}

checkUsers();
