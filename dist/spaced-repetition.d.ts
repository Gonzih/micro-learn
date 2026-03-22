export type Rating = "know" | "fuzzy" | "forgot";
export interface SRResult {
    intervalDays: number;
    easeFactor: number;
    learned: boolean;
    nextReview: string;
}
/**
 * Simplified SM-2 spaced repetition algorithm.
 *
 * Ratings:
 *  - 'know'   → interval = max(3, current * ease_factor), ease_factor += 0.1
 *  - 'fuzzy'  → interval = 1, ease_factor unchanged
 *  - 'forgot' → interval = 1, ease_factor = max(1.3, ease_factor - 0.2)
 *
 * A concept is marked 'learned' when review_count >= 3 AND interval > 7 days.
 */
export declare function applyRating(currentInterval: number, easeFactor: number, reviewCount: number, rating: Rating): SRResult;
export declare function todayString(): string;
export declare function addDays(dateStr: string, days: number): string;
export declare function encouragementMessage(rating: Rating, streak: number): string;
