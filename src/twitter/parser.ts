import { SolanaRPC } from '../solana/utils/rpc';
import logger from '../utils/logger';

export default class ContractParser {
    private patterns = {
        pumpFun: /https:\/\/pump\.fun\/coin\/(\w+)/,
        jupiter: /https:\/\/jup\.ag\/swap\/SOL-(\w+)/,
        base58: /[1-9A-HJ-NP-Za-km-z]{32,44}/g,
    };

    constructor(private rpc: SolanaRPC) { }

    async extractContract(text: string): Promise<string | null> {
        try {
            // Проверяем Pump.fun ссылки
            const pumpMatch = text.match(this.patterns.pumpFun);
            if (pumpMatch?.[1]) return pumpMatch[1];

            // Проверяем Jupiter ссылки
            const jupMatch = text.match(this.patterns.jupiter);
            if (jupMatch?.[1]) return jupMatch[1];

            // Ищем Base58 адрес в тексте
            const base58Matches = text.match(this.patterns.base58);
            if (base58Matches) {
                for (const addr of base58Matches) {
                    const isValid = await this.rpc.validateAddress(addr);
                    if (isValid) return addr;
                }
            }

            return null;
        } catch (error) {
            logger.error('Contract parsing failed:', error);
            return null;
        }
    }
}