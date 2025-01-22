// src/bot/index.ts
import express from "express";
import { Telegraf, session, Scenes } from "telegraf";
import { config } from "../config";
import { MyContext } from "./types/MyContext";
import { mainMenu } from "./menus/mainMenu";
import { getNgrokUrl } from "../utils/ngrok";
import logger from "../utils/logger";
import { homeScene } from "./scenes/homeScene";
import { walletWizard } from "./scenes/walletWizard";

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
const stage = new Scenes.Stage<MyContext>([walletWizard, homeScene]);
bot.use(session());
bot.use(stage.middleware());

// Стартовая команда
bot.start(async (ctx) => {
    try {
        ctx.scene.enter("home")
    } catch (error) {
        logger.error(error)
    }
});

// Интеграция с Express
app.use(express.json());
app.post(config.webhookPath, (req, res) => {
    bot.handleUpdate(req.body, res);
});

app.listen(config.port, () => {
    console.log(`Бот запущен на порту ${config.port}`);
    setupWebhook();
});