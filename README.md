# micro-learn

> Daily 5-minute AI-powered micro-learning sessions with spaced repetition

micro-learn is a Model Context Protocol (MCP) server that brings **Duolingo-style professional learning** to Claude Desktop and any MCP-compatible AI assistant. Spend 5 focused minutes each day on a carefully chosen concept — from system design to financial literacy — and let spaced repetition ensure it sticks.

---

## What Is It?

Think of micro-learn as Duolingo for professional skills:

- **5-minute daily sessions** — small enough to be sustainable, long enough to be meaningful
- **25+ learning domains** — technology, finance, health, law, language, science, leadership
- **50+ pre-built lessons** with genuine educational content (not AI filler)
- **Spaced repetition scheduling** (simplified SM-2, same algorithm as Anki) — reviews concepts at the optimal moment before you'd forget them
- **Streak tracking** — because consistency beats intensity
- **Optional Telegram reminders** — your daily nudge at a time you choose

---

## Installation

```bash
npm install -g @gonzih/micro-learn
```

Or run directly with `npx`:

```bash
npx @gonzih/micro-learn
```

---

## Quick Start (Claude Desktop)

Add to your `claude_desktop_config.json`:

```json
{
  "mcpServers": {
    "micro-learn": {
      "command": "npx",
      "args": ["-y", "@gonzih/micro-learn"],
      "env": {
        "MICRO_LEARN_PROFILE_ID": "your-name",
        "MICRO_LEARN_DOMAIN": "system-design",
        "MICRO_LEARN_REMINDER_TIME": "09:00"
      }
    }
  }
}
```

Then in Claude:

```
Subscribe me to the system-design domain.
Get my daily lesson.
[read the lesson]
Rate my lesson as "know".
```

---

## Available Domains (25+)

### Technology
| ID | Name | Description |
|----|------|-------------|
| `system-design` | System Design | Architect scalable, reliable software systems |
| `algorithms` | Algorithms & Data Structures | Fundamental building blocks of computation |
| `security` | Cybersecurity Fundamentals | Threats, defenses, and best practices |
| `cloud-architecture` | Cloud Architecture | Resilient apps on modern cloud platforms |
| `ai-ml-basics` | AI & Machine Learning Basics | Core concepts powering the AI revolution |

### Business & Finance
| ID | Name | Description |
|----|------|-------------|
| `financial-literacy` | Financial Literacy | Compound interest, investing, smart money habits |
| `startup-fundamentals` | Startup Fundamentals | Build and scale a startup |
| `marketing-growth` | Marketing & Growth | Customer acquisition and retention strategies |
| `negotiation` | Negotiation | Principled negotiation used by diplomats and executives |
| `product-management` | Product Management | Ship products users love |

### Health & Medicine
| ID | Name | Description |
|----|------|-------------|
| `nutrition-science` | Nutrition Science | What the evidence says about food and metabolism |
| `mental-health-literacy` | Mental Health Literacy | Psychological concepts for thriving |
| `first-aid-refresher` | First Aid Refresher | Life-saving knowledge everyone should have |

### Law & Compliance
| ID | Name | Description |
|----|------|-------------|
| `contract-basics` | Contract Law Basics | Agreements governing professional and business life |
| `privacy-law` | Privacy Law | GDPR, CCPA, and data privacy landscape |
| `employment-law` | Employment Law | Rights and obligations in the workplace |

### Language & Communication
| ID | Name | Description |
|----|------|-------------|
| `public-speaking` | Public Speaking | Communicate with confidence and persuasion |
| `writing-craft` | Writing Craft | Clarity, force, and elegance across contexts |
| `spanish-professional` | Spanish for Professionals | Practical Spanish for business |
| `japanese-basics` | Japanese Basics | Foundation for travel, business, culture |
| `mandarin-basics` | Mandarin Basics | Foundation for the world's most spoken language |

### Science & Environment
| ID | Name | Description |
|----|------|-------------|
| `climate-literacy` | Climate Literacy | Science, economics, and solutions of the climate crisis |
| `biotech-basics` | Biotech Basics | Biology revolution reshaping medicine and agriculture |
| `physics-intuition` | Physics Intuition | Intuitive understanding of laws governing our universe |

### Leadership
| ID | Name | Description |
|----|------|-------------|
| `management-101` | Management 101 | Core skills for leading teams effectively |
| `decision-making` | Decision Making | Think clearly under uncertainty |
| `emotional-intelligence` | Emotional Intelligence | Self-awareness, empathy, navigating emotions |

---

## Lesson Format

Each lesson is structured for maximum retention in 5 minutes:

| Field | Purpose |
|-------|---------|
| **Hook** | Surprising fact or question that creates curiosity |
| **Core Concept** | 2-minute explanation with analogy |
| **Applied Example** | Real-world case study or data |
| **Recall Question** | Tests memory of core content |
| **Application Question** | Tests ability to use the knowledge |
| **Key Takeaway** | One sentence to carry forward |

---

## MCP Tools

| Tool | Description |
|------|-------------|
| `subscribe` | Subscribe to a learning domain |
| `get_daily_lesson` | Get today's lesson (review or new) |
| `rate_lesson` | Rate understanding (know/fuzzy/forgot) |
| `get_domains` | List all available domains |
| `get_progress` | View streak, retention rate, progress |
| `search_concept` | Search lessons by keyword |
| `get_upcoming_reviews` | See upcoming spaced repetition reviews |

---

## The Science

### Spaced Repetition (Ebbinghaus & SM-2)
Hermann Ebbinghaus (1885) discovered the **Forgetting Curve**: without review, we forget ~50% of new information within an hour and ~70% within a day. Spaced repetition schedules reviews at increasing intervals — just before you'd forget — dramatically improving long-term retention.

micro-learn uses a simplified version of the **SM-2 algorithm** (SuperMemo, 1987), the same algorithm underlying Anki, the world's most popular flashcard system. Research consistently shows spaced repetition produces retention rates of 80–90% with a fraction of the review time of massed practice.

### 5-Minute Learning Windows (Microlearning)
Microlearning research (Thalheimer, 2017; Murre & Dros, 2015) finds that short, focused learning sessions with retrieval practice outperform longer sessions for retention of specific, bounded concepts. The 5-minute window aligns with attention research: cognitive load peaks within the first 10 minutes and declines thereafter for most learners.

Robert Bjork's work on **desirable difficulties** supports the recall/application question structure: retrieving information strengthens memory more than re-reading it (the testing effect).

### Habit Formation (BJ Fogg & Habit Loop)
BJ Fogg's Tiny Habits framework: link a new habit to an existing trigger (morning coffee → lesson), keep it small enough that motivation isn't required, and celebrate immediately. micro-learn's streak tracking leverages the **Habit Loop** (Charles Duhigg): Cue (daily reminder) → Routine (5-minute lesson) → Reward (streak counter, encouragement message).

---

## Configuration

| Environment Variable | Default | Description |
|---------------------|---------|-------------|
| `MICRO_LEARN_PROFILE_ID` | (required) | Your learner identifier |
| `MICRO_LEARN_DOMAIN` | `system-design` | Default learning domain |
| `MICRO_LEARN_REMINDER_TIME` | `09:00` | Daily reminder time (HH:MM) |
| `MICRO_LEARN_DB` | `~/.micro-learn/learning.sqlite` | Database file path |
| `TELEGRAM_BOT_TOKEN` | (optional) | Telegram bot token for reminders |
| `TELEGRAM_CHAT_ID` | (optional) | Your Telegram chat ID |

---

## Telegram Setup

1. Message [@BotFather](https://t.me/botfather) on Telegram → `/newbot` → copy the token
2. Message your new bot, then visit `https://api.telegram.org/bot<TOKEN>/getUpdates` to find your `chat_id`
3. Add to Claude Desktop config:

```json
"env": {
  "TELEGRAM_BOT_TOKEN": "123456:ABC-DEF...",
  "TELEGRAM_CHAT_ID": "987654321",
  "MICRO_LEARN_REMINDER_TIME": "08:30"
}
```

You'll receive:
- Daily reminder at your configured time
- Weekly summary every Sunday

---

## Contributing

Contributions welcome! The highest-value contributions are:

1. **New lesson content** — add more lessons to `src/lessons.ts` following the existing format. Keep them genuinely educational.
2. **New domain topics** — expand `src/domains.ts`
3. **Language support** — translate lessons into other languages
4. **Features** — progress charts, multi-domain subscriptions, export to Anki

Please ensure all lesson content is factually accurate and cites sources where relevant.

---

## License

MIT — see [LICENSE](LICENSE)
