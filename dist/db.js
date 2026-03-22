import Database from "better-sqlite3";
import { homedir } from "os";
import { join } from "path";
import { mkdirSync } from "fs";
function resolveDbPath() {
    const envPath = process.env.MICRO_LEARN_DB;
    if (envPath) {
        return envPath.replace(/^~/, homedir());
    }
    const dir = join(homedir(), ".micro-learn");
    mkdirSync(dir, { recursive: true });
    return join(dir, "learning.sqlite");
}
let _db = null;
export function getDb() {
    if (_db)
        return _db;
    const path = resolveDbPath();
    _db = new Database(path);
    _db.pragma("journal_mode = WAL");
    initSchema(_db);
    return _db;
}
function initSchema(db) {
    db.exec(`
    CREATE TABLE IF NOT EXISTS profiles (
      id TEXT PRIMARY KEY,
      domain TEXT NOT NULL,
      reminder_time TEXT DEFAULT '09:00',
      telegram_chat_id TEXT,
      daily_time_minutes INTEGER DEFAULT 5,
      created_at TEXT DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS concepts (
      id TEXT PRIMARY KEY,
      profile_id TEXT NOT NULL,
      domain TEXT NOT NULL,
      concept_name TEXT NOT NULL,
      lesson_content TEXT NOT NULL,
      ease_factor REAL DEFAULT 2.5,
      interval_days INTEGER DEFAULT 1,
      next_review TEXT NOT NULL,
      review_count INTEGER DEFAULT 0,
      last_rating TEXT,
      learned INTEGER DEFAULT 0,
      created_at TEXT DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS daily_sessions (
      id TEXT PRIMARY KEY,
      profile_id TEXT NOT NULL,
      domain TEXT NOT NULL,
      date TEXT NOT NULL,
      concepts_covered INTEGER DEFAULT 0,
      streak_day INTEGER DEFAULT 1,
      completed INTEGER DEFAULT 0
    );
  `);
}
export function getProfile(id) {
    const db = getDb();
    return db.prepare("SELECT * FROM profiles WHERE id = ?").get(id) ?? null;
}
export function createProfile(profile) {
    const db = getDb();
    db.prepare(`INSERT INTO profiles (id, domain, reminder_time, telegram_chat_id, daily_time_minutes)
     VALUES (?, ?, ?, ?, ?)`).run(profile.id, profile.domain, profile.reminder_time, profile.telegram_chat_id, profile.daily_time_minutes);
    return getProfile(profile.id);
}
export function getConcept(id) {
    const db = getDb();
    return db.prepare("SELECT * FROM concepts WHERE id = ?").get(id) ?? null;
}
export function getConceptsByProfile(profileId) {
    const db = getDb();
    return db.prepare("SELECT * FROM concepts WHERE profile_id = ?").all(profileId);
}
export function getDueConcepts(profileId, today) {
    const db = getDb();
    return db
        .prepare("SELECT * FROM concepts WHERE profile_id = ? AND next_review <= ? ORDER BY next_review ASC")
        .all(profileId, today);
}
export function getConceptByLesson(profileId, conceptName) {
    const db = getDb();
    return (db
        .prepare("SELECT * FROM concepts WHERE profile_id = ? AND concept_name = ?")
        .get(profileId, conceptName) ?? null);
}
export function createConcept(concept) {
    const db = getDb();
    db.prepare(`INSERT INTO concepts (id, profile_id, domain, concept_name, lesson_content,
      ease_factor, interval_days, next_review, review_count, last_rating, learned)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`).run(concept.id, concept.profile_id, concept.domain, concept.concept_name, concept.lesson_content, concept.ease_factor, concept.interval_days, concept.next_review, concept.review_count, concept.last_rating, concept.learned);
    return getConcept(concept.id);
}
export function updateConcept(id, fields) {
    const db = getDb();
    const entries = Object.entries(fields);
    if (entries.length === 0)
        return;
    const setClauses = entries.map(([k]) => `${k} = ?`).join(", ");
    const values = entries.map(([, v]) => v);
    db.prepare(`UPDATE concepts SET ${setClauses} WHERE id = ?`).run(...values, id);
}
export function getOrCreateSession(profileId, domain, date, sessionId) {
    const db = getDb();
    let session = db
        .prepare("SELECT * FROM daily_sessions WHERE profile_id = ? AND date = ?")
        .get(profileId, date);
    if (!session) {
        const streak = computeStreak(profileId, date);
        db.prepare(`INSERT INTO daily_sessions (id, profile_id, domain, date, concepts_covered, streak_day, completed)
       VALUES (?, ?, ?, ?, 0, ?, 0)`).run(sessionId, profileId, domain, date, streak);
        session = db
            .prepare("SELECT * FROM daily_sessions WHERE id = ?")
            .get(sessionId);
    }
    return session;
}
export function incrementSessionConcepts(profileId, date) {
    const db = getDb();
    db.prepare("UPDATE daily_sessions SET concepts_covered = concepts_covered + 1 WHERE profile_id = ? AND date = ?").run(profileId, date);
}
function computeStreak(profileId, today) {
    const db = getDb();
    const sessions = db
        .prepare("SELECT date FROM daily_sessions WHERE profile_id = ? AND completed = 1 ORDER BY date DESC")
        .all(profileId);
    if (sessions.length === 0)
        return 1;
    let streak = 1;
    const todayDate = new Date(today);
    for (let i = 0; i < sessions.length; i++) {
        const sessionDate = new Date(sessions[i].date);
        const diffDays = Math.round((todayDate.getTime() - sessionDate.getTime()) / (1000 * 60 * 60 * 24));
        if (diffDays === streak) {
            streak++;
        }
        else if (diffDays > streak) {
            break;
        }
    }
    return streak;
}
export function getStreak(profileId, today) {
    return computeStreak(profileId, today);
}
export function getUpcomingReviews(profileId, until) {
    const db = getDb();
    return db
        .prepare("SELECT * FROM concepts WHERE profile_id = ? AND next_review <= ? ORDER BY next_review ASC")
        .all(profileId, until);
}
//# sourceMappingURL=db.js.map