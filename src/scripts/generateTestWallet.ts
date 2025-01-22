import { Keypair } from '@solana/web3.js';

function generateWallet() {
    const testWallet = Keypair.generate();
    console.log('🔑 Тестовый кошелек создан:');
    console.log('Публичный ключ:', testWallet.publicKey.toString());
    console.log('Приватный ключ:', JSON.stringify(Array.from(testWallet.secretKey)));
}

generateWallet();