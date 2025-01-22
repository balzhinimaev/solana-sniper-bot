import mongoose from "mongoose";

interface Wallet {
    userId: number;
    encryptedKey: string;
}

const schema = new mongoose.Schema<Wallet>({
    userId: { type: Number, required: true, unique: true },
    encryptedKey: { type: String, required: true }
});

export const WalletModel = mongoose.model<Wallet>("Wallet", schema);