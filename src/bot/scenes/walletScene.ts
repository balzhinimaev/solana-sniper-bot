// src/bot/scenes/walletScene.ts
import { Scenes } from "telegraf";
import { encrypt } from "../../utils/encryption"; // Убедитесь, что функция называется encrypt
import { MyContext } from "../types/MyContext";
import { WalletModel } from "../../models/Wallet"; // Импорт модели для сохранения

export const walletScene = new Scenes.WizardScene<MyContext>(
    "wallet_scene",
    async (ctx) => {
        await ctx.reply("Введите приватный ключ кошелька:");
        return ctx.wizard.next();
    },
    async (ctx) => {
        try {
            if (!ctx.message) { throw new Error("Некорректный формат сообщения") }
            if (!ctx.from) throw new Error("Не удалось получить данные пользователя");
            if (!("text" in ctx.message)) throw new Error("Некорректный формат сообщения");

            // Шифрование ключа
            const encryptedKey = encrypt(ctx.message.text); // Используем правильное имя функции

            // Сохранение в БД
            await WalletModel.findOneAndUpdate(
                { userId: ctx.from.id },
                { encryptedKey },
                { upsert: true, new: true }
            );

            await ctx.reply("✅ Кошелек успешно подключен!");
        } catch (error) {
            console.error("Ошибка при сохранении кошелька:", error);
            await ctx.reply("❌ Произошла ошибка при сохранении ключа");
        } finally {
            return ctx.scene.leave();
        }
    }
);