import dotenv from 'dotenv';

// Загрузка переменных из .env
dotenv.config();

export const config = {
    botToken: process.env.BOT_TOKEN!,
    twitterApiKey: process.env.TWITTER_API_KEY!,
    mongoUri: process.env.MONGO_URI!,
    solanaRpcUrl: process.env.SOLANA_RPC_URL || 'https://api.mainnet-beta.solana.com',
    trackedAccounts: process.env.TRACKED_ACCOUNTS?.split(',') || [],
};