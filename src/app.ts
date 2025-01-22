import { config } from './config';
import { TwitterStreamManager } from './twitter/streamManager';
import ContractParser from './twitter/parser';
import { SolanaRPC } from './solana/utils/rpc';
import SolanaTransaction from './solana/transaction';
import { WalletModel } from './models/Wallet';
import { bot, setupWebhook } from './bot'; // Импорт бота из отдельного файла
import logger from './utils/logger';
import mongoose from 'mongoose';
import express from 'express';
import TwitterClient from './twitter/twitterClient';

// Инициализация Express приложения
const app = express();
app.use(express.json());

// Подключение к базе данных
mongoose.connect(<string>config.mongoUri, {
    dbName: 'solana-sniper-bot'
})
    .then(() => {
        console.log("Подключено к базе данных");
    })
    .catch((error) => {
        console.error('Ошибка при подключении к базе данных:', error);
    });

// Graceful shutdown handling
const shutdown = async () => {
    logger.info('Shutting down...');

    // Остановка всех компонентов
    await mongoose.disconnect();
    bot.stop();
    if (streamManager) {
        await streamManager.stopStream();
    }

    logger.info('All components stopped');
    process.exit(0);
};

process.once('SIGINT', shutdown);
process.once('SIGTERM', shutdown);

// Основная функция инициализации
let streamManager: TwitterStreamManager;

async function initialize() {
    try {
        // Инициализация Twitter компонентов
        const twitterClient = new TwitterClient(
            config.twitterApiKey,
            config.twitterApiSecret // Используем секрет из конфига
        );

        const solanaRPC = new SolanaRPC(config.solanaRpcUrl);
        const contractParser = new ContractParser(solanaRPC);

        streamManager = new TwitterStreamManager(
            twitterClient,
            contractParser,
            config.trackedAccounts
        );

        // Инициализация Solana транзакций
        const solanaTx = new SolanaTransaction();

        // Запуск мониторинга Twitter
        // await streamManager.startStream();

        // Настройка вебхуков
        // await setupWebhook();

        // Интеграция Express с ботом
        // app.post(config.webhookPath, (req, res) => {
        //     bot.handleUpdate(req.body, res);
        // });

        // Запуск сервера
        // app.listen(config.port, () => {
        //     logger.info(`Server started on port ${config.port}`);

        //     // Тест Solana компонентов
        //     testSolanaComponents(solanaTx).catch(logger.error);
        // });

    } catch (error) {
        logger.error('Initialization failed:', error);
        process.exit(1);
    }
}

async function testSolanaComponents(solanaTx: SolanaTransaction) {
    try {
        const balance = await solanaTx.getBalance(<string>config.testWalletPublicKey);
        logger.info(`Test wallet balance: ${balance / 1e9} SOL`);

        const txHash = await solanaTx.sendTestTransaction();
        logger.info(`Test transaction: https://explorer.solana.com/tx/${txHash}?cluster=devnet`);
    } catch (error) {
        logger.error('Solana test failed:', error);
    }
}

// Запуск приложения
initialize().catch((error) => {
    logger.error('Critical error during initialization:', error);
    process.exit(1);
});