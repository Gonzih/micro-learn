import TelegramBot from "node-telegram-bot-api";
import type { Profile } from "./db.js";
export declare function initTelegram(): TelegramBot | null;
export declare function sendMessage(chatId: string, text: string): Promise<void>;
export declare function sendDailyReminder(profile: Profile): Promise<void>;
export declare function sendWeeklySummary(profile: Profile): Promise<void>;
