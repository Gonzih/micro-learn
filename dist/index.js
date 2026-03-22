#!/usr/bin/env node
import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { CallToolRequestSchema, ListToolsRequestSchema, } from "@modelcontextprotocol/sdk/types.js";
import { v4 as uuidv4 } from "uuid";
import { DOMAINS, getDomainById } from "./domains.js";
import { LESSONS, getLessonsByDomain, searchLessons } from "./lessons.js";
import { getProfile, createProfile, getConcept, getConceptsByProfile, getDueConcepts, createConcept, updateConcept, getOrCreateSession, incrementSessionConcepts, getStreak, getUpcomingReviews, } from "./db.js";
import { applyRating, todayString, addDays, encouragementMessage } from "./spaced-repetition.js";
import { initTelegram } from "./telegram.js";
// Boot Telegram if credentials available
initTelegram();
const server = new Server({
    name: "micro-learn",
    version: "0.1.0",
}, {
    capabilities: {
        tools: {},
    },
});
// ─── Tool definitions ─────────────────────────────────────────────────────────
server.setRequestHandler(ListToolsRequestSchema, async () => {
    return {
        tools: [
            {
                name: "subscribe",
                description: "Subscribe to a learning domain. Creates a learner profile and returns your first lesson.",
                inputSchema: {
                    type: "object",
                    properties: {
                        profileId: {
                            type: "string",
                            description: "Unique identifier for the learner (e.g. your name or email). Defaults to MICRO_LEARN_PROFILE_ID env var.",
                        },
                        domain: {
                            type: "string",
                            description: "Domain to learn (e.g. 'system-design', 'financial-literacy'). Defaults to MICRO_LEARN_DOMAIN env var.",
                        },
                        dailyTimeMinutes: {
                            type: "number",
                            description: "How many minutes per day to study (default: 5).",
                        },
                        reminderTime: {
                            type: "string",
                            description: "Daily reminder time in HH:MM format (default: '09:00').",
                        },
                    },
                    required: [],
                },
            },
            {
                name: "get_daily_lesson",
                description: "Get today's micro-lesson. Returns a due spaced-repetition review first, or a new lesson if nothing is due.",
                inputSchema: {
                    type: "object",
                    properties: {
                        profileId: {
                            type: "string",
                            description: "Your learner profile ID.",
                        },
                    },
                    required: [],
                },
            },
            {
                name: "rate_lesson",
                description: "Rate your understanding of a lesson after studying it. Updates spaced repetition schedule.",
                inputSchema: {
                    type: "object",
                    properties: {
                        profileId: {
                            type: "string",
                            description: "Your learner profile ID.",
                        },
                        conceptId: {
                            type: "string",
                            description: "The concept ID returned by get_daily_lesson.",
                        },
                        rating: {
                            type: "string",
                            enum: ["know", "fuzzy", "forgot"],
                            description: "'know' = understood well, 'fuzzy' = partially understood, 'forgot' = didn't remember.",
                        },
                    },
                    required: ["conceptId", "rating"],
                },
            },
            {
                name: "get_domains",
                description: "List all available learning domains with descriptions and categories.",
                inputSchema: {
                    type: "object",
                    properties: {},
                    required: [],
                },
            },
            {
                name: "get_progress",
                description: "Get your learning progress: streak, retention rate, concepts learned.",
                inputSchema: {
                    type: "object",
                    properties: {
                        profileId: {
                            type: "string",
                            description: "Your learner profile ID.",
                        },
                    },
                    required: [],
                },
            },
            {
                name: "search_concept",
                description: "Search for lessons by keyword or topic.",
                inputSchema: {
                    type: "object",
                    properties: {
                        query: {
                            type: "string",
                            description: "Search term (concept name, keyword, or topic).",
                        },
                        domain: {
                            type: "string",
                            description: "Optional: restrict search to a specific domain.",
                        },
                    },
                    required: ["query"],
                },
            },
            {
                name: "get_upcoming_reviews",
                description: "See which concepts are due for spaced repetition review.",
                inputSchema: {
                    type: "object",
                    properties: {
                        profileId: {
                            type: "string",
                            description: "Your learner profile ID.",
                        },
                        days: {
                            type: "number",
                            description: "How many days ahead to look (default: 7).",
                        },
                    },
                    required: [],
                },
            },
        ],
    };
});
// ─── Tool handlers ────────────────────────────────────────────────────────────
server.setRequestHandler(CallToolRequestSchema, async (request) => {
    const { name, arguments: args } = request.params;
    const a = (args ?? {});
    try {
        switch (name) {
            case "subscribe":
                return await handleSubscribe(a);
            case "get_daily_lesson":
                return await handleGetDailyLesson(a);
            case "rate_lesson":
                return await handleRateLesson(a);
            case "get_domains":
                return handleGetDomains();
            case "get_progress":
                return await handleGetProgress(a);
            case "search_concept":
                return handleSearchConcept(a);
            case "get_upcoming_reviews":
                return await handleGetUpcomingReviews(a);
            default:
                return errorContent(`Unknown tool: ${name}`);
        }
    }
    catch (err) {
        const msg = err instanceof Error ? err.message : String(err);
        return errorContent(`Error: ${msg}`);
    }
});
// ─── Handlers ─────────────────────────────────────────────────────────────────
async function handleSubscribe(a) {
    const profileId = str(a.profileId) || process.env.MICRO_LEARN_PROFILE_ID || uuidv4();
    const domainId = str(a.domain) || process.env.MICRO_LEARN_DOMAIN || "system-design";
    const dailyTimeMinutes = num(a.dailyTimeMinutes) ?? 5;
    const reminderTime = str(a.reminderTime) || process.env.MICRO_LEARN_REMINDER_TIME || "09:00";
    const domain = getDomainById(domainId);
    if (!domain) {
        return errorContent(`Unknown domain '${domainId}'. Use get_domains to see available options.`);
    }
    let profile = getProfile(profileId);
    if (!profile) {
        profile = createProfile({
            id: profileId,
            domain: domainId,
            reminder_time: reminderTime,
            telegram_chat_id: process.env.TELEGRAM_CHAT_ID ?? null,
            daily_time_minutes: dailyTimeMinutes,
        });
    }
    // Pick first lesson for preview
    const domainLessons = getLessonsByDomain(domainId);
    const firstLesson = domainLessons[0] ?? null;
    return jsonContent({
        subscribed: true,
        profileId,
        domain: domain.name,
        message: `Welcome to micro-learn! You've subscribed to ${domain.name}. Use get_daily_lesson to start your first lesson.`,
        firstLessonPreview: firstLesson
            ? {
                conceptName: firstLesson.conceptName,
                hook: firstLesson.hook,
            }
            : null,
        streak: 0,
        reminderTime,
        dailyTimeMinutes,
    });
}
async function handleGetDailyLesson(a) {
    const profileId = str(a.profileId) || process.env.MICRO_LEARN_PROFILE_ID;
    if (!profileId)
        return errorContent("profileId is required.");
    const profile = getProfile(profileId);
    if (!profile) {
        return errorContent(`Profile '${profileId}' not found. Use subscribe first.`);
    }
    const today = todayString();
    // Ensure a session exists for today
    getOrCreateSession(profile.id, profile.domain, today, uuidv4());
    // 1. Check for due reviews
    const dueConcepts = getDueConcepts(profileId, today);
    let lesson = null;
    let conceptId;
    let isReview = false;
    if (dueConcepts.length > 0) {
        const due = dueConcepts[0];
        conceptId = due.id;
        isReview = true;
        // Parse lesson from stored JSON
        try {
            lesson = JSON.parse(due.lesson_content);
        }
        catch {
            lesson = LESSONS.find((l) => l.conceptName === due.concept_name) ?? null;
        }
    }
    else {
        // 2. Find a new lesson not yet seen
        const domainLessons = getLessonsByDomain(profile.domain);
        const seenNames = new Set(getConceptsByProfile(profileId).map((c) => c.concept_name));
        const unseen = domainLessons.filter((l) => !seenNames.has(l.conceptName));
        if (unseen.length === 0) {
            return jsonContent({
                message: "You've covered all available lessons in this domain! Keep reviewing due concepts or use subscribe to add another domain.",
                lesson: null,
                conceptId: null,
            });
        }
        lesson = unseen[0];
        // Create concept record
        const newConcept = createConcept({
            id: uuidv4(),
            profile_id: profileId,
            domain: profile.domain,
            concept_name: lesson.conceptName,
            lesson_content: JSON.stringify(lesson),
            ease_factor: 2.5,
            interval_days: 1,
            next_review: addDays(today, 1),
            review_count: 0,
            last_rating: null,
            learned: 0,
        });
        conceptId = newConcept.id;
    }
    if (!lesson) {
        return errorContent("Could not load lesson content.");
    }
    incrementSessionConcepts(profileId, today);
    const streak = getStreak(profileId, today);
    return jsonContent({
        conceptId,
        isReview,
        estimatedMinutes: lesson.estimatedMinutes,
        streak,
        lesson: {
            conceptName: lesson.conceptName,
            domain: lesson.domain,
            hook: lesson.hook,
            coreConcept: lesson.coreConcept,
            appliedExample: lesson.appliedExample,
            questionRecall: lesson.questionRecall,
            questionApplication: lesson.questionApplication,
            keyTakeaway: lesson.keyTakeaway,
        },
        instructions: "Read through the lesson, then use rate_lesson with 'know', 'fuzzy', or 'forgot' based on how well you understood and remembered the material.",
    });
}
async function handleRateLesson(a) {
    const profileId = str(a.profileId) || process.env.MICRO_LEARN_PROFILE_ID;
    if (!profileId)
        return errorContent("profileId is required.");
    const conceptId = str(a.conceptId);
    if (!conceptId)
        return errorContent("conceptId is required.");
    const rating = str(a.rating);
    if (!["know", "fuzzy", "forgot"].includes(rating)) {
        return errorContent("rating must be 'know', 'fuzzy', or 'forgot'.");
    }
    const concept = getConcept(conceptId);
    if (!concept)
        return errorContent(`Concept '${conceptId}' not found.`);
    if (concept.profile_id !== profileId) {
        return errorContent("Concept does not belong to this profile.");
    }
    const result = applyRating(concept.interval_days, concept.ease_factor, concept.review_count, rating);
    updateConcept(conceptId, {
        ease_factor: result.easeFactor,
        interval_days: result.intervalDays,
        next_review: result.nextReview,
        review_count: concept.review_count + 1,
        last_rating: rating,
        learned: result.learned ? 1 : concept.learned,
    });
    const today = todayString();
    const streak = getStreak(profileId, today);
    const encouragement = encouragementMessage(rating, streak);
    return jsonContent({
        rated: rating,
        conceptName: concept.concept_name,
        nextReview: result.nextReview,
        intervalDays: result.intervalDays,
        learned: result.learned,
        streak,
        encouragement,
    });
}
function handleGetDomains() {
    return jsonContent({
        domains: DOMAINS.map((d) => ({
            id: d.id,
            name: d.name,
            description: d.description,
            category: d.category,
            topicCount: d.topics.length,
            sampleTopics: d.topics.slice(0, 3),
        })),
        totalDomains: DOMAINS.length,
        categories: [...new Set(DOMAINS.map((d) => d.category))],
    });
}
async function handleGetProgress(a) {
    const profileId = str(a.profileId) || process.env.MICRO_LEARN_PROFILE_ID;
    if (!profileId)
        return errorContent("profileId is required.");
    const profile = getProfile(profileId);
    if (!profile)
        return errorContent(`Profile '${profileId}' not found.`);
    const concepts = getConceptsByProfile(profileId);
    const today = todayString();
    const streak = getStreak(profileId, today);
    const learned = concepts.filter((c) => c.learned === 1);
    const reviewing = concepts.filter((c) => c.learned === 0);
    const due = getDueConcepts(profileId, today);
    const totalReviews = concepts.reduce((sum, c) => sum + c.review_count, 0);
    const knowReviews = concepts.filter((c) => c.last_rating === "know").length;
    const retentionRate = totalReviews > 0 ? Math.round((knowReviews / concepts.length) * 100) : 0;
    const domainLessons = getLessonsByDomain(profile.domain);
    const progressPct = domainLessons.length > 0
        ? Math.round((concepts.length / domainLessons.length) * 100)
        : 0;
    return jsonContent({
        profileId,
        domain: profile.domain,
        streak,
        conceptsTotal: concepts.length,
        conceptsLearned: learned.length,
        conceptsReviewing: reviewing.length,
        conceptsDueToday: due.length,
        retentionRate: `${retentionRate}%`,
        domainProgress: `${progressPct}% of ${domainLessons.length} lessons covered`,
        lessonsRemaining: domainLessons.length - concepts.length,
    });
}
function handleSearchConcept(a) {
    const query = str(a.query);
    if (!query)
        return errorContent("query is required.");
    const domain = str(a.domain) || undefined;
    const results = searchLessons(query, domain);
    return jsonContent({
        query,
        domain: domain ?? "all",
        results: results.map((l) => ({
            id: l.id,
            domain: l.domain,
            conceptName: l.conceptName,
            hook: l.hook,
            keyTakeaway: l.keyTakeaway,
        })),
        count: results.length,
    });
}
async function handleGetUpcomingReviews(a) {
    const profileId = str(a.profileId) || process.env.MICRO_LEARN_PROFILE_ID;
    if (!profileId)
        return errorContent("profileId is required.");
    const profile = getProfile(profileId);
    if (!profile)
        return errorContent(`Profile '${profileId}' not found.`);
    const days = num(a.days) ?? 7;
    const today = todayString();
    const until = addDays(today, days);
    const concepts = getUpcomingReviews(profileId, until);
    const dueToday = concepts.filter((c) => c.next_review <= today);
    const thisWeek = concepts.filter((c) => c.next_review > today);
    return jsonContent({
        profileId,
        lookAheadDays: days,
        dueToday: dueToday.map((c) => ({
            conceptId: c.id,
            conceptName: c.concept_name,
            reviewCount: c.review_count,
            lastRating: c.last_rating,
        })),
        upcoming: thisWeek.map((c) => ({
            conceptId: c.id,
            conceptName: c.concept_name,
            nextReview: c.next_review,
            reviewCount: c.review_count,
            lastRating: c.last_rating,
        })),
        totalDue: dueToday.length,
        totalUpcoming: thisWeek.length,
    });
}
// ─── Helpers ──────────────────────────────────────────────────────────────────
function str(v) {
    return typeof v === "string" ? v.trim() : "";
}
function num(v) {
    if (typeof v === "number")
        return v;
    if (typeof v === "string" && v.trim() !== "") {
        const n = Number(v);
        return isNaN(n) ? null : n;
    }
    return null;
}
function jsonContent(data) {
    return {
        content: [
            {
                type: "text",
                text: JSON.stringify(data, null, 2),
            },
        ],
    };
}
function errorContent(message) {
    return {
        content: [
            {
                type: "text",
                text: JSON.stringify({ error: message }, null, 2),
            },
        ],
        isError: true,
    };
}
// ─── Start server ─────────────────────────────────────────────────────────────
async function main() {
    const transport = new StdioServerTransport();
    await server.connect(transport);
    console.error("[micro-learn] MCP server running on stdio");
}
main().catch((err) => {
    console.error("[micro-learn] Fatal error:", err);
    process.exit(1);
});
//# sourceMappingURL=index.js.map