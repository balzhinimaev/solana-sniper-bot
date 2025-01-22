import { config } from './config';
import TwitterClient from './twitter/twitterClient';
import { TwitterStreamManager } from './twitter/streamManager';
import ContractParser from './twitter/parser';
import { SolanaRPC } from './solana/utils/rpc';
import logger from './utils/logger';

// Graceful shutdown handling
process.on('SIGINT', shutdown);
process.on('SIGTERM', shutdown);

let streamManager: TwitterStreamManager;

async function start() {
    try {
        logger.info('Starting Solana Sniper Bot...');

        // Инициализация Twitter клиента
        const twitterClient = new TwitterClient(
            config.twitterApiKey,
            config.twitterApiKey // Здесь должен быть API Secret, если используется
        );

        // Инициализация Solana RPC
        const solanaRPC = new SolanaRPC(config.solanaRpcUrl);

        // Инициализация парсера контрактов
        const contractParser = new ContractParser(solanaRPC);

        // Создание менеджера потока
        streamManager = new TwitterStreamManager(
            twitterClient,
            contractParser,
            config.trackedAccounts
        );

        // Запуск мониторинга
        await streamManager.startStream();

        logger.info('Bot successfully initialized and ready');

    } catch (error) {
        logger.error('Fatal error during initialization:', error);
        process.exit(1);
    }
}

async function shutdown() {
    try {
        logger.info('Shutting down bot...');

        if (streamManager) {
            await streamManager.stopStream();
        }

        logger.info('Bot stopped gracefully');
        process.exit(0);

    } catch (error) {
        logger.error('Error during shutdown:', error);
        process.exit(1);
    }
}

// Запуск приложения
start().catch(error => {
    logger.error('Unhandled error:', error);
    process.exit(1);
});