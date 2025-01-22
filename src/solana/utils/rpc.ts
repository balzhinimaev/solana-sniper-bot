import { Connection, PublicKey } from '@solana/web3.js';

export class SolanaRPC {
    private connection: Connection;

    constructor(endpoint: string = 'https://api.mainnet-beta.solana.com') {
        this.connection = new Connection(endpoint);
    }

    async validateAddress(address: string): Promise<boolean> {
        try {
            const publicKey = new PublicKey(address);
            const info = await this.connection.getAccountInfo(publicKey);
            return info !== null;
        } catch {
            return false;
        }
    }
}