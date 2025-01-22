// src/bot/scenes/walletWizard.ts
import { Composer, Markup, Scenes } from "telegraf";
import { encrypt } from "../../utils/encryption"; // Убедитесь, что функция называется encrypt
import { MyContext } from "../types/MyContext";
import { WalletModel } from "../../models/Wallet"; // Импорт модели для сохранения
import logger from "../../utils/logger";
import { sendOrEditMessage } from "../utils/messages";
// Описываем тип для состояния Wizard-сцены
interface WizardState {
    language?: string;
}

export const walletWizard = new Scenes.WizardScene<
    MyContext & { wizard: { state: WizardState } }>(
    "wallet-wizard",
    new Composer<MyContext>(),

    // Шаг 1: Подключение кошелька пользователя
    async (ctx) => {
        if (ctx.message && "text" in ctx.message) {

            const userInput = ctx.message.text;

            try {
                await ctx.reply(userInput)
            } catch (error) {
                await ctx.reply(
                    "Произошла ошибка при подключении кошелька."
                );
                logger.error(error)
            }

        } else if (ctx.callbackQuery && "data" in ctx.callbackQuery) {
            const action = ctx.callbackQuery.data;
            if (action === "back") {

                greetingWalletWizard(ctx)

            }
            if (action === "main_menu") {
                return ctx.scene.enter("home")
            }
            await ctx.answerCbQuery();
        }
    },
);

// При входе в сцену
walletWizard.enter((ctx) => greetingWalletWizard(ctx));

async function greetingWalletWizard(ctx: MyContext) {
    try {
        const userId = ctx.from?.id;

        if (!userId) {
            await sendOrEditMessage(
                ctx,
                `<b>🤖 Solana Sniper Bot</b> <b>/ Wallet</b>\n\nНе удалось определить ваш Telegram ID. Попробуйте снова.`,
                undefined,
                true
            );
            return;
        }

        // Получение информации о кошельке из базы данных
        const wallet = await WalletModel.findOne({ userId });

        if (wallet) {
            const walletPreview = `${wallet.encryptedKey.slice(0, 8)}...${wallet.encryptedKey.slice(-8)}`;
            await sendOrEditMessage(
                ctx,
                `<b>🤖 Solana Sniper Bot</b> <b>/ Wallet</b>\n\nВаш текущий подключенный кошелек: \n\n<code>${walletPreview}</code>\n\nВыберите действие:`,
                Markup.inlineKeyboard([
                    [Markup.button.callback("Сменить кошелек", "change_wallet")],
                    [Markup.button.callback("Посмотреть настройки", "view_wallet_settings")],
                    [Markup.button.callback("Назад в главное меню", "main_menu")],
                ])
            );
        } else {
            await sendOrEditMessage(
                ctx,
                `<b>🤖 Solana Sniper Bot</b> <b>/ Wallet</b>\n\nКошелек не подключен. Выберите действие:`,
                Markup.inlineKeyboard([
                    [Markup.button.callback("Подключить кошелек", "connect_wallet")],
                    [Markup.button.callback("Назад в главное меню", "main_menu")],
                ])
            );
        }

    } catch (error) {
        logger.error("Ошибка в приветственном экране кошелька:", error);
        await sendOrEditMessage(
            ctx,
            `<b>🤖 Solana Sniper Bot</b> <b>/ Wallet</b>\n\nПроизошла ошибка. Попробуйте позже.`,
            undefined,
            true
        );
    }
}

walletWizard.action("connect_wallet", async (ctx) => {
    await sendOrEditMessage(
        ctx,
        `<b>🤖 Solana Sniper Bot</b> <b>/ Wallet</b>\n\nВведите приватный ключ или Seed-фразу для подключения кошелька:`,
        Markup.inlineKeyboard([
            [Markup.button.callback("Назад", "back")],
        ])
    );
    ctx.answerCbQuery()
    return ctx.wizard.selectStep(1); // Переход к шагу 1
});

walletWizard.action("change_wallet", async (ctx) => {
    await sendOrEditMessage(
        ctx,
        `<b>🤖 Solana Sniper Bot</b> <b>/ Wallet</b>\n\nВведите новый приватный ключ или Seed-фразу для смены кошелька:`
    );
    ctx.scene.leave();
});

walletWizard.action("view_wallet_settings", async (ctx) => {
    const userId = ctx.from?.id;
    if (!userId) {
        await sendOrEditMessage(
            ctx,
            `<b>🤖 Solana Sniper Bot</b> <b>/ Wallet</b>\n\nНе удалось загрузить настройки.`
        );
        return;
    }

    const wallet = await WalletModel.findOne({ userId });
    if (wallet) {
        const settings = wallet.settings;
        await sendOrEditMessage(
            ctx,
            `<b>🤖 Solana Sniper Bot</b> <b>/ Wallet</b>\n\nВаши настройки:\n- Комиссия: ${settings.transactionFee} SOL\n- Слипидж: ${settings.slippage}%\n- Биржи: ${settings.preferredExchanges.join(", ")}`,
            Markup.inlineKeyboard([
                [Markup.button.callback("Изменить настройки", "change_wallet_settings")],
                [Markup.button.callback("Назад", "wallet_scene")],
            ])
        );
    } else {
        await sendOrEditMessage(
            ctx,
            `<b>🤖 Solana Sniper Bot</b> <b>/ Wallet</b>\n\nНастройки не найдены. Попробуйте подключить кошелек.`
        );
    }
    ctx.scene.leave();
});

walletWizard.action("main_menu", async (ctx) => {
    ctx.scene.enter("home");
    ctx.answerCbQuery()
    return
});

