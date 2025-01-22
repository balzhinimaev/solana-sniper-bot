// src/bot/scenes/homeScene.ts
import { Scenes } from "telegraf";
import { MyContext } from "../types/MyContext";
import { mainMenu } from "../keyboards";
import { sendOrEditMessage } from "../utils/messages";
import logger from "../../utils/logger";

export const homeScene = new Scenes.BaseScene<MyContext>("home");

homeScene.enter((ctx) =>
    sendOrEditMessage(
        ctx,
        "<b>🤖 Solana Sniper Bot</b>\n\n" +
        "Автоматическая покупка токенов по сигналам из Twitter\n\n" +
        "Выберите раздел, чтобы начать работу:",
        mainMenu
    )
);

homeScene.on("message", async (ctx) =>
    sendOrEditMessage(
        ctx,
        "<b>🤖 Solana Sniper Bot</b>\n\n" +
        "Автоматическая покупка токенов по сигналам из Twitter\n\n" +
        "Выберите раздел, чтобы начать работу:",
        mainMenu
    )
);

homeScene.action("wallet_menu", async (ctx) => {
    try {
        ctx.scene.enter("wallet-wizard")
        ctx.answerCbQuery()
    } catch (error) {
        logger.error(error)
    }
})