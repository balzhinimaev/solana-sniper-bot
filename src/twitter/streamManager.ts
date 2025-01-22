import { TweetStream } from 'twitter-api-v2';
import TwitterClient from './twitterClient';
import ContractParser from './parser';
import logger from '../utils/logger';

export class TwitterStreamManager {
    private stream: TweetStream | null = null;

    constructor(
        private readonly client: TwitterClient,
        private readonly parser: ContractParser,
        private readonly trackedAccounts: string[]
    ) { }

    async startStream(): Promise<void> {
        try {
            // Удаление старых правил
            const existingRules = await this.client.getStreamRules();
            if (existingRules.data?.length) {
                await this.client.deleteStreamRules(existingRules.data.map(rule => rule.id));
                logger.info(`Removed ${existingRules.data.length} existing rules`);
            }

            // Создание новых правил
            const rules = this.trackedAccounts.map(account => ({
                value: `from:${account} has:links`,
                tag: `account-${account}`
            }));

            await this.client.addStreamRules(rules);
            logger.info(`Added ${rules.length} new tracking rules`);

            // Инициализация потока
            this.stream = await this.client.getStreamClient();

            this.stream.on('data', async event => {
                if (event.data?.text) {
                    const contract = await this.parser.extractContract(event.data.text);
                    if (contract) {
                        logger.info(`Detected contract: ${contract}`);
                        // Здесь будет вызов сервиса для покупки токена
                    }
                }
            });

            this.stream.on('error', error => {
                logger.error('Stream error:', error);
                this.reconnect();
            });

            this.stream.on('connection closed', () => {
                logger.warn('Connection closed by Twitter');
                this.reconnect();
            });

            logger.info('Twitter stream started successfully');

        } catch (error) {
            logger.error('Failed to start stream:', error);
            this.reconnect();
        }
    }

    private reconnect(attempt = 1): void {
        const delay = Math.min(1000 * attempt, 30000);

        logger.info(`Reconnecting in ${delay}ms (attempt ${attempt})`);

        setTimeout(async () => {
            await this.stopStream();
            await this.startStream();
        }, delay);
    }

    async stopStream(): Promise<void> {
        if (this.stream) {
            this.stream.close();
            this.stream = null;
            logger.info('Twitter stream stopped');
        }
    }
}