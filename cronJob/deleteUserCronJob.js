import cron from 'node-cron';
import { User } from '../models/userModel.js';

export const deleteUnverifiedAccounts = () => {

    const cronJob = cron.schedule('*/30 * * * *', async () => {
        const thirtyMin = new Date(Date.now() - 30 * 60 * 1000);
        await User.deleteMany({
            createdAt: { $lt: thirtyMin },
            accountVerified: false
        })
    })
    return cronJob
};