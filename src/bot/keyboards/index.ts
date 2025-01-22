import { Markup } from "telegraf";

export const mainMenu = Markup.inlineKeyboard([
    [
        Markup.button.callback("👛 Кошелек", "wallet_menu"),
        Markup.button.callback("⚙️ Настройки", "settings_menu")
    ],
    [
        Markup.button.callback("📊 Аккаунты Twitter", "twitter_menu"),
        Markup.button.callback("📱 История", "history_menu")
    ],
    [Markup.button.callback("❓ Помощь", "help_menu")]
]);

export const walletMenu = Markup.inlineKeyboard([
    [
        Markup.button.callback("💼 Подключить", "connect_wallet"),
        Markup.button.callback("👀 Показать", "show_wallet")
    ],
    [
        Markup.button.callback("💰 Баланс", "check_balance"),
        Markup.button.callback("🔄 Обновить", "update_wallet")
    ],
    [Markup.button.callback("⬅️ Назад", "back_to_main")]
]);

export const settingsMenu = Markup.inlineKeyboard([
    [
        Markup.button.callback("💵 Сумма", "set_amount"),
        Markup.button.callback("📊 Slippage", "set_slippage")
    ],
    [
        Markup.button.callback("🔄 Авто-покупка", "toggle_auto"),
        Markup.button.callback("🏦 Биржи", "exchanges")
    ],
    [Markup.button.callback("⬅️ Назад", "back_to_main")]
]);