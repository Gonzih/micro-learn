import Database from "better-sqlite3";
export declare function getDb(): Database.Database;
export interface Profile {
    id: string;
    domain: string;
    reminder_time: string;
    telegram_chat_id: string | null;
    daily_time_minutes: number;
    created_at: string;
}
export interface Concept {
    id: string;
    profile_id: string;
    domain: string;
    concept_name: string;
    lesson_content: string;
    ease_factor: number;
    interval_days: number;
    next_review: string;
    review_count: number;
    last_rating: string | null;
    learned: number;
    created_at: string;
}
export interface DailySession {
    id: string;
    profile_id: string;
    domain: string;
    date: string;
    concepts_covered: number;
    streak_day: number;
    completed: number;
}
export declare function getProfile(id: string): Profile | null;
export declare function createProfile(profile: Omit<Profile, "created_at">): Profile;
export declare function getConcept(id: string): Concept | null;
export declare function getConceptsByProfile(profileId: string): Concept[];
export declare function getDueConcepts(profileId: string, today: string): Concept[];
export declare function getConceptByLesson(profileId: string, conceptName: string): Concept | null;
export declare function createConcept(concept: Omit<Concept, "created_at">): Concept;
export declare function updateConcept(id: string, fields: Partial<Omit<Concept, "id" | "profile_id" | "domain" | "concept_name" | "lesson_content" | "created_at">>): void;
export declare function getOrCreateSession(profileId: string, domain: string, date: string, sessionId: string): DailySession;
export declare function incrementSessionConcepts(profileId: string, date: string): void;
export declare function getStreak(profileId: string, today: string): number;
export declare function getUpcomingReviews(profileId: string, until: string): Concept[];
