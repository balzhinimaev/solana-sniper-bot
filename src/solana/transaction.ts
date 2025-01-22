import { Connection, Keypair, PublicKey, SystemProgram, Transaction, sendAndConfirmTransaction } from '@solana/web3.js';
import { config } from '../config';
import logger from '../utils/logger';

export default class SolanaTransaction {
    private connection: Connection;

    constructor() {
        this.connection = new Connection(config.solanaRpcUrl);
    }

    async getBalance(publicKey: string): Promise<number> {
        try {
            return await this.connection.getBalance(new PublicKey(publicKey));
        } catch (error) {
            logger.error('Ошибка получения баланса:', error);
            throw error;
        }
    }

    async sendTestTransaction(): Promise<string> {
        try {
            const fromWallet = Keypair.fromSecretKey(
                new Uint8Array(JSON.parse(<string>config.testWalletPrivateKey))
            );

            const toWallet = Keypair.generate();

            const transaction = new Transaction().add(
                SystemProgram.transfer({
                    fromPubkey: fromWallet.publicKey,
                    toPubkey: toWallet.publicKey,
                    lamports: 1000000 // 0.001 SOL
                })
            );

            return await sendAndConfirmTransaction(
                this.connection,
                transaction,
                [fromWallet]
            );
        } catch (error) {
            logger.error('Ошибка транзакции:', error);
            throw error;
        }
    }
}