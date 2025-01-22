import mongoose, { Schema, Document } from "mongoose";

interface WalletSettings {
    transactionFee: number; // Оплата за транзакцию
    slippage: number; // Слипидж в процентах
    preferredExchanges: string[]; // Предпочитаемые биржи
}

export interface Wallet extends Document {
    userId: number;
    encryptedKey: string; // Зашифрованный ключ
    settings: WalletSettings;
    createdAt?: Date;
    updatedAt?: Date;
}

const WalletSchema = new Schema<Wallet>(
    {
        userId: {
            type: Number,
            required: true,
            unique: true
        },
        encryptedKey: {
            type: String,
            required: true
        },
        settings: {
            transactionFee: {
                type: Number,
                required: true,
                default: 0.001
            }, // Оплата за транзакцию
            slippage: {
                type: Number,
                required: true,
                default: 0.5
            }, // Слипидж (по умолчанию 0.5%)
            preferredExchanges: {
                type: [String],
                default: ["Radium", "Orca"]
            } // Предпочитаемые биржи
        }
    },
    {
        timestamps: true // Добавляет createdAt и updatedAt
    }
);

// Создаем модель
export const WalletModel = mongoose.model<Wallet>("Wallet", WalletSchema);
