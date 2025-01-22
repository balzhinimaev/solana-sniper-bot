import { Markup } from "telegraf";
import { MyContext } from "../types/MyContext";

export const sendOrEditMessage = async (
    ctx: MyContext,
    text: string,
    buttons?: ReturnType<typeof Markup.inlineKeyboard>,
    reply?: boolean
) => {
    const inlineKeyboard = buttons?.reply_markup?.inline_keyboard || [];

    if (reply) {
        await ctx.reply(text, {
            parse_mode: "HTML",
            reply_markup: { inline_keyboard: inlineKeyboard },
            link_preview_options: { is_disabled: true }
        });
    } else {
        if (ctx.updateType === "callback_query") {
            try {
                await ctx.editMessageText(text, {
                    parse_mode: "HTML",
                    reply_markup: { inline_keyboard: inlineKeyboard },
                    link_preview_options: { is_disabled: true },
                });
            } catch (err) {
                // Игнорируем ошибку если сообщение не изменилось
            }
        } else {
            await ctx.reply(text, {
                parse_mode: "HTML",
                reply_markup: { inline_keyboard: inlineKeyboard },
                link_preview_options: { is_disabled: true },
            });
        }
    }
};
