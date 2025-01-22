import dotenv from 'dotenv';

// Загрузка переменных из .env
dotenv.config();

export const config = {
    botToken: process.env.BOT_TOKEN!,
    twitterApiKey: process.env.TWITTER_API_KEY!,
    twitterApiSecret: process.env.TWITTER_API_SECRET!,
    mongoUri: process.env.MONGO_URI!,
    solanaRpcUrl: process.env.SOLANA_RPC_URL || 'https://api.devnet.solana.com',
    trackedAccounts: process.env.TRACKED_ACCOUNTS?.split(',') || [],
    encryptionKey: process.env.ENCRYPTION_KEY || "",
    mode: "development",
    siteUrl: "https://test.com",
    port: process.env.PORT || 5000,
    webhookPath: process.env.WEBHOOK_PATH || "",
    ngrokApiUrl: 'http://localhost:4040',
    testWalletPublicKey: process.env.TEST_WALLET_PUBLIC_KEY, // Для тестов
    testWalletPrivateKey: process.env.TEST_WALLET_PRIVATE_KEY // Для тестов
};