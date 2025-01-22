// src/bot/index.ts
import express from "express";
import { Telegraf, session, Scenes } from "telegraf";
import { config } from "../config";
import { MyContext } from "./types/MyContext";
import { mainMenu } from "./menus/mainMenu";
import { walletScene } from "./scenes/walletScene";
import { getNgrokUrl } from "../utils/ngrok";
import logger from "../utils/logger";

export const bot = new Telegraf<MyContext>(config.botToken);
const app = express();

// Настройка вебхука
export const setupWebhook = async () => {
    if (config.mode === "production") {
        await bot.telegram.setWebhook(`${config.siteUrl}${config.webhookPath}`);
    } else {
        // Используем ngrok для разработки
        const ngrokUrl = await getNgrokUrl();
        if (ngrokUrl) {
            await bot.telegram.setWebhook(`${ngrokUrl}${config.webhookPath}`);
            logger.info(`Вебхук установлен`)
        }
    }
};

// Сцены
const stage = new Scenes.Stage<MyContext>([walletScene]);
bot.use(session());
bot.use(stage.middleware());

// Стартовая команда
bot.start(async (ctx) => {
    await ctx.reply("Добро пожаловать в Solana Sniper Bot!", mainMenu);
});

// Обработка главного меню
bot.action("wallet_action", (ctx) => ctx.scene.enter("wallet_scene"));

// Интеграция с Express
app.use(express.json());
app.post(config.webhookPath, (req, res) => {
    bot.handleUpdate(req.body, res);
});

app.listen(config.port, () => {
    console.log(`Бот запущен на порту ${config.port}`);
    setupWebhook();
});