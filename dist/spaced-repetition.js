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
export function applyRating(currentInterval, easeFactor, reviewCount, rating) {
    let newInterval;
    let newEaseFactor;
    switch (rating) {
        case "know":
            newEaseFactor = easeFactor + 0.1;
            newInterval = Math.max(3, Math.round(currentInterval * newEaseFactor));
            break;
        case "fuzzy":
            newEaseFactor = easeFactor;
            newInterval = 1;
            break;
        case "forgot":
            newEaseFactor = Math.max(1.3, easeFactor - 0.2);
            newInterval = 1;
            break;
    }
    const newReviewCount = reviewCount + 1;
    const learned = newReviewCount >= 3 && newInterval > 7;
    const nextReview = addDays(todayString(), newInterval);
    return {
        intervalDays: newInterval,
        easeFactor: newEaseFactor,
        learned,
        nextReview,
    };
}
export function todayString() {
    return new Date().toISOString().slice(0, 10);
}
export function addDays(dateStr, days) {
    const d = new Date(dateStr);
    d.setDate(d.getDate() + days);
    return d.toISOString().slice(0, 10);
}
export function encouragementMessage(rating, streak) {
    const streakMsg = streak >= 7
        ? `🔥 ${streak}-day streak — you're on fire!`
        : streak >= 3
            ? `⚡ ${streak} days in a row — keep it up!`
            : streak === 1
                ? "Great start — come back tomorrow to build your streak!"
                : `Day ${streak} — building the habit!`;
    switch (rating) {
        case "know":
            return `Excellent! You've got this one. ${streakMsg}`;
        case "fuzzy":
            return `Good effort — a quick review tomorrow will cement it. ${streakMsg}`;
        case "forgot":
            return `No worries — forgetting is part of learning. You'll see this again tomorrow. ${streakMsg}`;
    }
}
//# sourceMappingURL=spaced-repetition.js.map