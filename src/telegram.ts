import TelegramBot from "node-telegram-bot-api";
import cron from "node-cron";
import { getDb } from "./db.js";
import type { Profile } from "./db.js";

let bot: TelegramBot | null = null;

export function initTelegram(): TelegramBot | null {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  if (!token) {
    return null;
  }
  try {
    bot = new TelegramBot(token, { polling: false });
    scheduleReminders();
    return bot;
  } catch (err) {
    console.error("[telegram] Failed to initialize bot:", err);
    return null;
  }
}

export async function sendMessage(chatId: string, text: string): Promise<void> {
  if (!bot) return;
  try {
    await bot.sendMessage(chatId, text, { parse_mode: "Markdown" });
  } catch (err) {
    console.error("[telegram] Failed to send message:", err);
  }
}

export async function sendDailyReminder(profile: Profile): Promise<void> {
  if (!profile.telegram_chat_id) return;
  const db = getDb();
  const domain = profile.domain;

  const message =
    `🧠 *Time for your daily micro-lesson!*\n\n` +
    `*Domain:* ${domainLabel(domain)}\n` +
    `Your 5-minute learning session is ready. Ask Claude to \`get_daily_lesson\` to start.\n\n` +
    `_Consistency is the compounding interest of learning._`;

  await sendMessage(profile.telegram_chat_id, message);
}

export async function sendWeeklySummary(profile: Profile): Promise<void> {
  if (!profile.telegram_chat_id) return;
  const db = getDb();

  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
  const fromDate = sevenDaysAgo.toISOString().slice(0, 10);
  const today = new Date().toISOString().slice(0, 10);

  const sessions = db
    .prepare(
      `SELECT * FROM daily_sessions WHERE profile_id = ? AND date >= ? AND date <= ?`
    )
    .all(profile.id, fromDate, today) as Array<{
    completed: number;
    concepts_covered: number;
    streak_day: number;
  }>;

  const completedDays = sessions.filter((s) => s.completed).length;
  const totalConcepts = sessions.reduce((sum, s) => sum + s.concepts_covered, 0);
  const currentStreak = sessions.length > 0 ? sessions[sessions.length - 1].streak_day : 0;

  const learnedCount = (
    db
      .prepare("SELECT COUNT(*) as cnt FROM concepts WHERE profile_id = ? AND learned = 1")
      .get(profile.id) as { cnt: number }
  ).cnt;

  const message =
    `📊 *Your Weekly Learning Summary*\n\n` +
    `*Domain:* ${domainLabel(profile.domain)}\n` +
    `✅ Active days this week: ${completedDays}/7\n` +
    `📚 Concepts reviewed: ${totalConcepts}\n` +
    `🎓 Total concepts learned: ${learnedCount}\n` +
    `🔥 Current streak: ${currentStreak} days\n\n` +
    `Keep going — ${7 - completedDays > 0 ? `${7 - completedDays} more day(s) to go this week!` : "Perfect week! 🌟"}`;

  await sendMessage(profile.telegram_chat_id, message);
}

function scheduleReminders(): void {
  // Check every minute if any profile needs a reminder
  cron.schedule("* * * * *", async () => {
    try {
      const db = getDb();
      const now = new Date();
      const currentTime = `${String(now.getHours()).padStart(2, "0")}:${String(
        now.getMinutes()
      ).padStart(2, "0")}`;
      const dayOfWeek = now.getDay(); // 0 = Sunday

      const profiles = db
        .prepare("SELECT * FROM profiles WHERE telegram_chat_id IS NOT NULL")
        .all() as Profile[];

      for (const profile of profiles) {
        if (profile.reminder_time === currentTime) {
          await sendDailyReminder(profile);

          // Sunday weekly summary
          if (dayOfWeek === 0) {
            await sendWeeklySummary(profile);
          }
        }
      }
    } catch (err) {
      console.error("[telegram] Scheduler error:", err);
    }
  });
}

function domainLabel(domain: string): string {
  return domain
    .split("-")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
}
