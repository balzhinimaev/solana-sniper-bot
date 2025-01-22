import { config } from '../config';
import crypto from 'crypto';

const IV_LENGTH = 16; // Размер IV для AES

export function encrypt(text: string) {
    const iv = crypto.randomBytes(IV_LENGTH);
    const cipher = crypto.createCipheriv(
        'aes-256-cbc',
        Buffer.from(config.encryptionKey, 'hex'),
        iv
    );

    const encrypted = Buffer.concat([cipher.update(text), cipher.final()]);
    return iv.toString('hex') + ':' + encrypted.toString('hex');
}