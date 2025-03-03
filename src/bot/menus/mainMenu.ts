// src/bot/menus/mainMenu.ts
import { Markup } from "telegraf";

export const mainMenu = Markup.inlineKeyboard([
    [
        Markup.button.callback("💼 Кошелек", "wallet_action"),
        Markup.button.callback("⚙️ Настройки", "settings_action")
    ],
    [
        Markup.button.callback("Аккаунты Twitter", "twitter_action")
    ],
    [
        Markup.button.callback("📊 История", "history_action"),
    ]
]);