# micro-learn Skill

**micro-learn** is an MCP tool for daily 5-minute professional micro-learning with spaced repetition. Use it to build expertise 5 minutes at a time across 25+ domains.

## What you can do

- **Start learning**: Subscribe to a domain and get your first lesson
- **Daily lesson**: Get today's concept (automatically serves spaced repetition reviews when due)
- **Rate understanding**: Tell micro-learn how well you grasped a concept — it schedules the next review accordingly
- **Track progress**: View your streak, retention rate, and how many concepts you've learned
- **Search**: Find lessons on any topic across all domains
- **Plan reviews**: See what's coming up in your spaced repetition schedule

## How to use

### Getting started
"Subscribe me to [domain]" → calls `subscribe`

### Daily routine
"Get my daily lesson" → calls `get_daily_lesson`

After reading: "I knew that well / I was a bit fuzzy / I forgot that" → calls `rate_lesson`

### Checking in
"How am I progressing?" → calls `get_progress`
"What reviews are coming up?" → calls `get_upcoming_reviews`
"Search for lessons about [topic]" → calls `search_concept`
"What domains are available?" → calls `get_domains`

## Available domains

**Technology**: system-design, algorithms, security, cloud-architecture, ai-ml-basics

**Business & Finance**: financial-literacy, startup-fundamentals, marketing-growth, negotiation, product-management

**Health & Medicine**: nutrition-science, mental-health-literacy, first-aid-refresher

**Law & Compliance**: contract-basics, privacy-law, employment-law

**Language & Communication**: public-speaking, writing-craft, spanish-professional, japanese-basics, mandarin-basics

**Science & Environment**: climate-literacy, biotech-basics, physics-intuition

**Leadership**: management-101, decision-making, emotional-intelligence

## Lesson structure

Each 5-minute lesson contains:
1. **Hook** — surprising fact or question to create curiosity
2. **Core Concept** — clear explanation with analogy
3. **Applied Example** — real-world case study
4. **Recall Question** — test your memory
5. **Application Question** — test your ability to use the knowledge
6. **Key Takeaway** — the one thing to remember

## Rating scale

| Rating | Meaning | Next review |
|--------|---------|-------------|
| `know` | Could explain it to someone else | Increasing intervals (days → weeks → months) |
| `fuzzy` | Understood while reading, can't fully recall | Tomorrow |
| `forgot` | Couldn't remember or was confused | Tomorrow (with slight difficulty adjustment) |

## Configuration (Claude Desktop)

```json
{
  "mcpServers": {
    "micro-learn": {
      "command": "npx",
      "args": ["-y", "@gonzih/micro-learn"],
      "env": {
        "MICRO_LEARN_PROFILE_ID": "your-name",
        "MICRO_LEARN_DOMAIN": "system-design"
      }
    }
  }
}
```

## Tips for effective use

- **Be honest when rating** — the spaced repetition only works with accurate self-assessment
- **Do it daily** — even one concept per day compounds significantly over a year
- **Engage with questions** — try to answer the recall and application questions before reading the key takeaway
- **Stack the habit** — pair your daily lesson with an existing routine (morning coffee, lunch break)
