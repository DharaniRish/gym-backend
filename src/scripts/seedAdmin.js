import User from '../models/User.js';

/**
 * Seed a default admin user if no admin exists in the database.
 * Credentials are read from environment variables.
 */
const seedAdmin = async () => {
    try {
        const existingAdmin = await User.findOne({ role: 'admin' });

        if (existingAdmin) {
            console.log(`✅ Admin already exists: ${existingAdmin.email}`);
            return;
        }

        const email = process.env.ADMIN_EMAIL || 'admin@gymverse.com';
        const password = process.env.ADMIN_PASSWORD || 'Admin@1234';
        const name = process.env.ADMIN_NAME || 'GymVerse Admin';

        await User.create({
            name,
            email,
            password,
            role: 'admin',
        });

        console.log('🚀 Default admin created!');
        console.log(`   📧 Email   : ${email}`);
        console.log(`   🔑 Password: ${password}`);
        console.log('   ⚠️  Please change your password after first login!');
    } catch (error) {
        console.error('❌ Admin seed error:', error.message);
    }
};

export default seedAdmin;
