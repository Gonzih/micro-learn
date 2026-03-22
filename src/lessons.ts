export interface Lesson {
  id: string;
  domain: string;
  conceptName: string;
  hook: string;
  coreConcept: string;
  appliedExample: string;
  questionRecall: string;
  questionApplication: string;
  keyTakeaway: string;
  estimatedMinutes: number;
}

export const LESSONS: Lesson[] = [
  // ─── SYSTEM DESIGN (10) ───────────────────────────────────────────────────
  {
    id: "sd-001",
    domain: "system-design",
    conceptName: "CAP Theorem",
    hook: "Every distributed system must make an impossible promise: you can only reliably guarantee two of three properties — Consistency, Availability, and Partition Tolerance. Pick wisely.",
    coreConcept:
      "The CAP Theorem (Brewer, 2000) states that a distributed data store can provide at most two of: Consistency (every read receives the most recent write), Availability (every request receives a response), and Partition Tolerance (the system keeps working even when network messages are dropped). In practice, network partitions are unavoidable in any distributed system — your cloud provider's switch will fail, a packet will be lost. So the real choice is between CP (consistent but potentially unavailable during a partition) and AP (available but potentially serving stale data). Think of it like a bank: a CP system will refuse to show your balance if it can't confirm it's current. An AP system will show you the last known balance even if it might be 2 seconds old.",
    appliedExample:
      "HBase and Zookeeper are CP: they'll refuse reads/writes if they lose quorum, ensuring you never see inconsistent data. DynamoDB and Cassandra are AP by default: they keep serving requests during partitions, but you might get eventual consistency. Cassandra lets you tune consistency level per query — QUORUM for strong consistency, ONE for maximum availability.",
    questionRecall:
      "What are the three properties in the CAP Theorem, and why can't you have all three in a distributed system?",
    questionApplication:
      "You're building a shopping cart service. Briefly losing the latest item added is acceptable, but the cart must always be accessible. Which CAP trade-off do you choose, and why?",
    keyTakeaway:
      "Network partitions are inevitable; your real choice is CP (consistency wins) vs AP (availability wins). Design your system knowing which you need before you need it.",
    estimatedMinutes: 5,
  },
  {
    id: "sd-002",
    domain: "system-design",
    conceptName: "Load Balancing",
    hook: "Google serves over 8.5 billion searches per day. No single machine could handle that. Load balancers are the traffic cops that make distributed scale possible.",
    coreConcept:
      "A load balancer distributes incoming requests across a pool of servers so no single server becomes a bottleneck. The main algorithms are: Round Robin (requests go to servers in sequence — simple, good for homogeneous servers), Least Connections (send to whichever server has the fewest active connections — better when requests vary in duration), IP Hash (the same client always reaches the same server — useful for session stickiness), and Weighted Round Robin (some servers get more traffic based on their capacity). Load balancers also perform health checks, automatically removing unhealthy servers. They exist at Layer 4 (TCP level, fast, protocol-agnostic) and Layer 7 (HTTP level, can route based on URL path or headers).",
    appliedExample:
      "AWS Application Load Balancer (ALB) is Layer 7 — it can route /api/* to your API servers and /static/* to your CDN origin servers in the same rule set. AWS Network Load Balancer (NLB) is Layer 4 — millions of requests per second with ultra-low latency. Netflix uses Ribbon, a client-side load balancer, where each service instance discovers peers and balances calls itself without a central bottleneck.",
    questionRecall:
      "What is the difference between Round Robin and Least Connections load balancing algorithms?",
    questionApplication:
      "Your video transcoding jobs take wildly different amounts of time (10 seconds to 10 minutes). Which load balancing algorithm would you choose for distributing jobs to worker servers, and why?",
    keyTakeaway:
      "Load balancers are the foundation of horizontal scaling. Choose your algorithm based on request homogeneity: round robin for uniform work, least connections for variable-duration tasks.",
    estimatedMinutes: 5,
  },
  {
    id: "sd-003",
    domain: "system-design",
    conceptName: "Caching with Redis",
    hook: "RAM access takes ~100 nanoseconds. A disk seek takes ~10 milliseconds. A database query over a network can take 50–200ms. Caching collapses that gap by orders of magnitude.",
    coreConcept:
      "Caching stores frequently accessed data in fast memory so you don't recompute or re-fetch it. The Cache-Aside pattern (also called Lazy Loading) is most common: (1) App checks cache, (2) if miss, app queries DB, (3) app writes result to cache, (4) next request hits cache. The Write-Through pattern writes to cache and DB simultaneously on every write — slower writes but cache is always fresh. Write-Behind (Write-Back) writes to cache immediately and to DB asynchronously — fastest writes but risks data loss. Redis is an in-memory data structure store supporting strings, hashes, lists, sets, sorted sets, and more. Cache eviction policies include LRU (Least Recently Used), LFU (Least Frequently Used), and TTL-based expiry.",
    appliedExample:
      "Twitter caches your home timeline in Redis. When you log in, your timeline (a list of tweet IDs) is read from Redis — not recomputed from billions of follows. Cache invalidation — knowing when to expire stale data — is the famously hard problem. Phil Karlton said: 'There are only two hard things in Computer Science: cache invalidation and naming things.'",
    questionRecall:
      "Describe the Cache-Aside pattern. What happens on a cache hit vs a cache miss?",
    questionApplication:
      "Your e-commerce product page queries 5 different database tables. It's called 10,000 times per minute. Product data changes about once per hour. Design a caching strategy including what to cache and what TTL to set.",
    keyTakeaway:
      "Cache-Aside is the default pattern. Set TTLs aggressively for read-heavy, slow-changing data. Cache invalidation is hard — prefer TTL over manual invalidation when possible.",
    estimatedMinutes: 5,
  },
  {
    id: "sd-004",
    domain: "system-design",
    conceptName: "Database Sharding",
    hook: "Instagram hit 1 billion users with a PostgreSQL database. How? They broke it into thousands of shards before anyone noticed the cracks.",
    coreConcept:
      "Sharding is horizontal partitioning: splitting one large database into many smaller databases (shards), each holding a subset of the data. Compare to vertical scaling (bigger machine) — sharding lets you scale infinitely by adding more machines. Sharding strategies: Range-Based (user IDs 1–1M on shard 1, 1M–2M on shard 2 — simple but causes hot spots), Hash-Based (shard = hash(user_id) % num_shards — even distribution but hard to add shards), Directory-Based (a lookup table maps each key to its shard — flexible but the directory becomes a bottleneck). Cross-shard queries and transactions are the main pain points — you lose the ability to JOIN across shards easily.",
    appliedExample:
      "Instagram shards by user ID using a library called ids that encodes the shard number in every generated ID. All data for a given user (photos, follows, likes) lives on the same shard, so user-centric queries are fast. For feed generation across users, they use a separate fanout service. Vitess (used by YouTube, Slack) sits in front of MySQL and handles sharding transparently.",
    questionRecall:
      "What is the difference between horizontal scaling (sharding) and vertical scaling? What is a hot spot in range-based sharding?",
    questionApplication:
      "You're sharding a multi-tenant SaaS database by tenant_id. One tenant (a Fortune 500 company) generates 80% of all traffic. What problem does this cause and how would you address it?",
    keyTakeaway:
      "Shard by a key that distributes load evenly and co-locates related data. Hash-based sharding distributes evenly; range-based is simpler but risks hot spots. Avoid cross-shard transactions.",
    estimatedMinutes: 5,
  },
  {
    id: "sd-005",
    domain: "system-design",
    conceptName: "Event-Driven Architecture",
    hook: "When Uber's surge pricing kicks in, it doesn't call 47 different services. It publishes one event and lets services react. That's event-driven architecture.",
    coreConcept:
      "In event-driven architecture (EDA), services communicate by publishing and subscribing to events rather than calling each other directly. The Pub/Sub pattern: a Publisher emits events to a broker (Kafka, RabbitMQ, SNS), and Subscribers listen for events they care about. Benefits: loose coupling (publisher doesn't know who consumes), scalability (consumers scale independently), resilience (if a consumer is down, events queue up). Event Sourcing takes this further: instead of storing current state, you store every event that led to that state — like a bank ledger vs just a balance. CQRS (Command Query Responsibility Segregation) often pairs with event sourcing: writes (commands) go to one model, reads (queries) to another.",
    appliedExample:
      "When you book an Uber, an OrderCreated event fires. The driver-matching service, pricing service, notification service, and analytics service all subscribe to it independently. Adding a new fraud-detection service requires zero changes to the booking service. Kafka processes 1.7 trillion events per day across LinkedIn, handling everything from user activity to site metrics.",
    questionRecall:
      "What is the difference between an event-driven (pub/sub) architecture and a traditional request/response (REST) architecture?",
    questionApplication:
      "You're building an e-commerce system. A user places an order. List three downstream services that need to react and explain why event-driven architecture is better than the order service calling each one directly.",
    keyTakeaway:
      "Events decouple services: the publisher doesn't need to know who cares. This makes systems resilient and extensible — new consumers can subscribe without touching existing code.",
    estimatedMinutes: 5,
  },
  {
    id: "sd-006",
    domain: "system-design",
    conceptName: "Content Delivery Networks (CDN)",
    hook: "Netflix serves 15% of global internet traffic. Most of it never touches Netflix's data centers — it comes from servers sitting inside your ISP.",
    coreConcept:
      "A CDN is a geographically distributed network of servers (edge nodes or Points of Presence — PoPs) that cache content close to users. Instead of every request traveling from Tokyo to a US data center (150ms round trip), it hits a Tokyo edge node (5ms). CDNs handle static assets (images, JS, CSS), video streaming, and increasingly dynamic content. Cache behaviors: on a cache miss, the edge fetches from the origin and caches it with a TTL. Pull CDNs fetch content on first request. Push CDNs pre-load content before it's requested — good for large files with predictable access. CDNs also provide DDoS protection (attacks hit edge nodes, not your origin), TLS termination, and compression.",
    appliedExample:
      "Netflix built its own CDN (Open Connect) and placed servers inside ISPs worldwide. During peak hours, 95% of Netflix traffic is served directly from ISPs' networks. Cloudflare's CDN has 300+ PoPs and serves 20% of all web traffic. For a typical SPA, putting your JavaScript bundle on a CDN cuts load time for international users by 60–80%.",
    questionRecall:
      "What is a CDN edge node and how does it reduce latency for end users?",
    questionApplication:
      "Your web app is hosted in US-East. You have users in Brazil, India, and Germany who complain about slow load times. You have static assets (images, JS) and a dynamic API. What would you put on a CDN and what would you keep at origin?",
    keyTakeaway:
      "CDNs slash latency by serving from nodes close to users. Aggressively cache static assets (long TTL). Dynamic content requires careful cache-key design or should remain at origin.",
    estimatedMinutes: 5,
  },
  {
    id: "sd-007",
    domain: "system-design",
    conceptName: "Circuit Breaker Pattern",
    hook: "Your house's electrical panel has circuit breakers that trip before a fault burns down your wiring. Distributed systems need the same protection — without it, one slow service can take down everything.",
    coreConcept:
      "The Circuit Breaker pattern prevents cascading failures. When Service A calls Service B and B starts failing slowly, A's threads pile up waiting for B — exhausting A's thread pool, causing A to fail too, which causes everything that depends on A to fail. This is a cascading failure. The Circuit Breaker has three states: Closed (normal, requests flow through), Open (breaker has tripped — requests fail immediately with a fallback, not waiting for timeout), Half-Open (after a cooldown period, a few probe requests try B; if they succeed, the breaker closes; if they fail, it re-opens). This fails fast instead of slow, preserving resources. Timeout + retry + circuit breaker together form the resilience triad.",
    appliedExample:
      "Netflix's Hystrix (now in maintenance mode, succeeded by Resilience4j) pioneered circuit breakers in microservices. When Netflix's recommendation service is slow, Hystrix trips the breaker and serves cached or generic recommendations instead — degraded but functional. The 2012 AWS US-East outage cascaded because services kept retrying failed calls without circuit breakers, amplifying load on an already struggling system.",
    questionRecall:
      "Name the three states of a Circuit Breaker and describe what happens in each state.",
    questionApplication:
      "Your payment service calls a third-party fraud-detection API that occasionally becomes slow (10s timeouts). How would you implement a circuit breaker, and what fallback behavior would you use when the breaker is open?",
    keyTakeaway:
      "Fail fast, not slow. A circuit breaker turns a slow failure (thread exhaustion) into a fast failure (immediate rejection), preventing one struggling service from dragging down the entire system.",
    estimatedMinutes: 5,
  },
  {
    id: "sd-008",
    domain: "system-design",
    conceptName: "Rate Limiting",
    hook: "In 2019, a single misconfigured bot sent 143,000 requests per second to a startup's API and bankrupted them with cloud bills before anyone noticed. Rate limiting is your shield.",
    coreConcept:
      "Rate limiting controls how many requests a client can make in a given time window. Algorithms: Fixed Window Counter (count requests per minute, reset at :00 — simple but allows 2x bursts at window boundaries), Sliding Window Log (track exact timestamps of each request — precise but memory-intensive), Sliding Window Counter (approximation using weighted previous window count — good balance), Token Bucket (a bucket fills with tokens at a fixed rate; each request consumes a token; burst allowed while tokens exist — most flexible), Leaky Bucket (requests queue and drain at a fixed rate — smooths bursts). Rate limits are typically keyed by API key, user ID, or IP address. Responses use HTTP 429 Too Many Requests with a Retry-After header.",
    appliedExample:
      "GitHub's REST API allows 5,000 requests/hour for authenticated users, 60 for unauthenticated. Stripe rate-limits by API key with burst allowances. Redis is the standard backend for distributed rate limiters — INCR + EXPIRE for fixed window, sorted sets for sliding window. Cloudflare processes 6 trillion requests daily and uses rate limiting as a first line of DDoS defense.",
    questionRecall:
      "What is the Token Bucket algorithm for rate limiting? What advantage does it have over a fixed window counter?",
    questionApplication:
      "You're building a public API for your SaaS product. Free users get 100 requests/hour, Pro users get 10,000/hour. Requests come from multiple servers (distributed). How do you implement this, and where do you store the counters?",
    keyTakeaway:
      "Token Bucket is the most versatile algorithm: it allows controlled bursting while enforcing average rate limits. Use Redis for distributed rate limit state, keyed by user/API key.",
    estimatedMinutes: 5,
  },
  {
    id: "sd-009",
    domain: "system-design",
    conceptName: "Consistent Hashing",
    hook: "When you add or remove a server from a cache cluster using regular hashing, almost every cached item goes to a different server — causing a thundering herd that can crash your database. Consistent hashing solves this with elegant math.",
    coreConcept:
      "In regular hashing, server = hash(key) % N. Change N (add/remove a server) and nearly every key remaps. Consistent hashing places both servers and keys on a virtual ring (0 to 2^32). A key is served by the first server clockwise from it on the ring. Adding a server only remaps keys between it and its predecessor — O(K/N) keys instead of O(K). Virtual nodes (vnodes): each physical server is represented by multiple points on the ring (e.g., 150 virtual nodes each). This creates more even distribution and means removing one server spreads its load across all remaining servers rather than just its neighbor.",
    appliedExample:
      "Amazon's DynamoDB, Apache Cassandra, and Riak all use consistent hashing with virtual nodes. Cassandra's ring topology means adding a node to a 10-node cluster only moves ~10% of data. Akamai's CDN uses consistent hashing to map URLs to edge servers. Memcached client libraries implement consistent hashing so that cache clusters can be scaled without cache stampedes.",
    questionRecall:
      "Why does standard modular hashing cause massive cache misses when a server is added or removed? How does consistent hashing solve this?",
    questionApplication:
      "You have a 5-node Memcached cluster with 1TB of cached data. You need to add 2 more nodes. With consistent hashing and 150 vnodes per server, approximately what percentage of cached data needs to move?",
    keyTakeaway:
      "Consistent hashing limits remapping to ~1/N of keys when the cluster changes. Virtual nodes are essential for even load distribution. It's the foundation of most distributed cache and database ring topologies.",
    estimatedMinutes: 5,
  },
  {
    id: "sd-010",
    domain: "system-design",
    conceptName: "CQRS",
    hook: "Reading from a database and writing to it have completely different performance profiles and access patterns. CQRS asks: what if you used entirely separate models for each?",
    coreConcept:
      "Command Query Responsibility Segregation (CQRS) separates the model you use to write data (commands) from the model you use to read data (queries). In a traditional CRUD system, one model serves both — which is a compromise that suits neither well. With CQRS: the Write Side handles commands (CreateOrder, UpdateAddress), validates business rules, and emits events. The Read Side maintains one or more denormalized projections optimized for specific queries, updated by consuming those events asynchronously. This allows read and write sides to scale independently. Read replicas, materialized views, even entirely different databases per side. The trade-off: eventual consistency between write and read sides, and operational complexity.",
    appliedExample:
      "A bank account in CQRS: the write side enforces 'balance cannot go negative', emits TransactionCompleted events. The read side maintains a pre-built view: daily_balance_summary table, perfect for the dashboard query with no JOINs. Greg Young popularized CQRS paired with Event Sourcing. Microsoft's Azure Cosmos DB change feed, Kafka Streams, and AWS DynamoDB Streams are all used to update CQRS read models in production systems.",
    questionRecall:
      "What two concerns does CQRS separate, and what is the main trade-off you accept when adopting it?",
    questionApplication:
      "Your social media app has 10M users. The 'user profile page' query joins 6 tables and takes 800ms. You don't want to add more indexes to the write tables. How would CQRS help, and what would the read model look like?",
    keyTakeaway:
      "CQRS lets reads and writes optimize independently. The read model is a denormalized projection built for query speed, updated asynchronously from write-side events. Accept eventual consistency as the price of that flexibility.",
    estimatedMinutes: 5,
  },

  // ─── FINANCIAL LITERACY (10) ──────────────────────────────────────────────
  {
    id: "fl-001",
    domain: "financial-literacy",
    conceptName: "Compound Interest",
    hook: "Albert Einstein allegedly called compound interest the 'eighth wonder of the world.' Whether he said it or not, the math is miraculous: $10,000 invested at 10% for 30 years becomes $174,494 — without adding a single dollar.",
    coreConcept:
      "Compound interest means earning interest on your interest, not just on your principal. Formula: A = P(1 + r/n)^(nt), where P is principal, r is annual rate, n is compounding frequency, t is years. The Rule of 72: divide 72 by your interest rate to find how many years to double your money. At 6%, money doubles every 12 years. At 10%, every 7.2 years. Time is the most powerful variable — starting at 25 vs 35 can mean a $500,000 difference at retirement with identical contributions. The flip side: credit card debt at 24% APR doubles in 3 years. Compound interest works for you in investments and against you in debt.",
    appliedExample:
      "If you invest $500/month from age 25 to 65 at 7% average annual return, you accumulate ~$1.3 million. If you wait until 35, same contributions, same rate, you get ~$609,000 — half as much, despite only 10 fewer years. Warren Buffett made 99% of his wealth after age 50 — he calls himself 'a snowball rolling down a very long hill.'",
    questionRecall:
      "What is the Rule of 72? How would you use it to estimate how long it takes $20,000 to grow to $40,000 at 8% annual return?",
    questionApplication:
      "You have $5,000 in credit card debt at 20% APR and $5,000 you could invest in an index fund averaging 8% annually. What does compound interest tell you about which to prioritize first?",
    keyTakeaway:
      "Time is the dominant variable in compound growth. Start early, even with small amounts. The same math that builds wealth in investments destroys wealth in high-interest debt — eliminate high-rate debt first.",
    estimatedMinutes: 5,
  },
  {
    id: "fl-002",
    domain: "financial-literacy",
    conceptName: "Index Funds vs Active Management",
    hook: "Warren Buffett bet $1 million that a simple S&P 500 index fund would beat a hand-picked portfolio of hedge funds over 10 years. He won by a landslide: index fund returned 85.4%, hedge funds averaged 22%.",
    coreConcept:
      "An index fund passively tracks a market index (S&P 500, total market, bonds) by holding all its constituents in proportion. An actively managed fund employs analysts and portfolio managers to pick stocks. The core problem with active management: expense ratios average 0.5–1.5% annually vs 0.03–0.1% for index funds. Over 20 years, a 1% expense ratio costs ~18% of your final portfolio value due to compounding drag. Studies consistently show 80–90% of actively managed funds underperform their benchmark index over 15 years. The Efficient Market Hypothesis explains why: prices already reflect all publicly available information, so consistent outperformance requires either luck or illegal inside information.",
    appliedExample:
      "Vanguard's S&P 500 Index Fund (VFIAX) has a 0.04% expense ratio. A comparable actively managed large-cap fund charges 0.75%. On $100,000 invested for 30 years at 7% gross return: index fund grows to $741,000; active fund to $640,000 — $100,000 less just from fees. Jack Bogle founded Vanguard and created the first retail index fund in 1976. The industry called it 'Bogle's Folly.' Today index funds hold over $15 trillion.",
    questionRecall:
      "What is an expense ratio, and why does even a 1% difference in expense ratio matter so much over time?",
    questionApplication:
      "Your 401(k) offers a target-date fund with 0.12% expense ratio, an S&P 500 index fund at 0.04%, and an actively managed growth fund at 1.2%. You have 30 years until retirement. How do you allocate, and what's your reasoning?",
    keyTakeaway:
      "In investing, costs compound just like returns — but in reverse. Low-cost index funds outperform most active managers over the long run. Minimize fees, maximize time in market.",
    estimatedMinutes: 5,
  },
  {
    id: "fl-003",
    domain: "financial-literacy",
    conceptName: "Tax-Advantaged Accounts",
    hook: "The US government offers you a legal way to never pay taxes on investment growth. Most people leave tens of thousands of dollars in free tax savings on the table every year.",
    coreConcept:
      "Tax-advantaged accounts let your investments grow without being taxed each year. Traditional 401(k)/IRA: contributions are pre-tax (reduces taxable income now), growth is tax-deferred, withdrawals in retirement are taxed as income. Best if you expect to be in a lower tax bracket in retirement. Roth 401(k)/IRA: contributions are after-tax (no deduction now), but growth and qualified withdrawals are tax-free forever. Best if you expect higher future tax rates or want tax diversification. HSA (Health Savings Account): triple tax advantage — contributions pre-tax, growth tax-free, withdrawals for medical expenses tax-free. After 65, works like a Traditional IRA. 2024 limits: 401(k) $23,000, IRA $7,000, HSA $4,150 individual. Always capture the full employer 401(k) match — it's an instant 50–100% return.",
    appliedExample:
      "If you invest $7,000/year in a taxable account earning 7%, you pay ~15% capital gains tax annually, netting ~5.95% effective return. In a Roth IRA, you earn the full 7%. Over 30 years: Roth IRA ≈ $708,000, taxable account ≈ $567,000 — $141,000 difference purely from tax shelter. Microsoft offers a 50% 401(k) match up to 6% of salary — an employee earning $100,000 who contributes 6% gets $3,000 free annually from the employer.",
    questionRecall:
      "What is the key difference between a Traditional IRA and a Roth IRA in terms of when you pay taxes?",
    questionApplication:
      "You're 28 years old, in the 22% marginal tax bracket, and expect to be in the 32% bracket at retirement. You can afford $500/month for investing. What accounts do you prioritize and why?",
    keyTakeaway:
      "Max tax-advantaged accounts before taxable investing. Roth accounts favor younger investors and those expecting higher future tax rates. Always capture the full employer match — it's free money.",
    estimatedMinutes: 5,
  },
  {
    id: "fl-004",
    domain: "financial-literacy",
    conceptName: "Emergency Fund",
    hook: "60% of Americans cannot cover a $1,000 emergency expense from savings. A single unexpected car repair, medical bill, or job loss sends them into high-interest debt — sabotaging years of financial progress.",
    coreConcept:
      "An emergency fund is 3–6 months of essential living expenses in liquid, safe savings. 'Essential expenses' means rent/mortgage, food, utilities, minimum debt payments, insurance — not your full current lifestyle spend. 3 months suits those with stable income (government job, tenured position) or dual income households. 6 months suits freelancers, commission-based workers, single income households, or those in volatile industries. Where to keep it: High-Yield Savings Account (HYSA) — FDIC insured, earns 4–5% (2024 rates), immediately accessible. Not in stocks (can drop 40% exactly when you need it) or CDs (early withdrawal penalties). The emergency fund's ROI is the interest rate you'd otherwise pay on emergency debt — often 20–24% on credit cards.",
    appliedExample:
      "Marcus by Goldman Sachs, Ally, and SoFi HYSAs currently offer 4.5–5% APY — 10x the national average savings rate of 0.46%. On a $15,000 emergency fund, that's $675/year in interest, essentially free money for keeping your cash accessible. During COVID-19, workers without emergency funds exhausted retirement accounts early — paying 10% penalty + income tax, permanently destroying compound growth.",
    questionRecall:
      "Why is a High-Yield Savings Account better for an emergency fund than investing in a stock index fund?",
    questionApplication:
      "Your monthly essential expenses are $3,500. You currently have $2,000 in savings and $8,000 in student loans at 5% interest and $3,000 in credit card debt at 22%. In what order do you build your emergency fund vs pay down debt?",
    keyTakeaway:
      "Build a starter emergency fund ($1,000) before attacking debt, then complete 3–6 months after high-interest debt is gone. Keep it in a HYSA — accessible but earning meaningful interest.",
    estimatedMinutes: 5,
  },
  {
    id: "fl-005",
    domain: "financial-literacy",
    conceptName: "Dollar-Cost Averaging",
    hook: "Emotional investing is catastrophic: individual investors consistently buy high (when markets feel exciting) and sell low (when markets feel scary). Dollar-cost averaging removes emotion from the equation entirely.",
    coreConcept:
      "Dollar-Cost Averaging (DCA) means investing a fixed dollar amount at regular intervals regardless of market conditions. When prices are high, your fixed amount buys fewer shares. When prices are low, it buys more shares. Over time, this naturally results in a lower average cost per share than if you tried to time the market. The alternative — Lump Sum Investing — is mathematically optimal when you have a large sum, because markets go up ~70% of months. But DCA wins on psychology: you're far less likely to panic-sell or wait for the 'perfect entry.' DALBAR's annual Quantitative Analysis of Investor Behavior consistently shows the average investor underperforms the S&P 500 by 3–4% annually due to emotional trading.",
    appliedExample:
      "During the 2020 COVID crash, the S&P 500 fell 34% in 33 days. Investors who sold locked in losses. DCA investors who kept buying automatically purchased shares at 34% off. By August 2020, the index had fully recovered. Contributing $500/month to your 401(k) regardless of news is DCA in action. Vanguard found that lump sum investing beats DCA ~67% of the time over 12 months — but only if you actually invest rather than waiting for a dip that may never come.",
    questionRecall:
      "How does Dollar-Cost Averaging result in a lower average cost per share over time compared to investing a fixed share count?",
    questionApplication:
      "You receive a $50,000 inheritance. You know you should invest it, but you're terrified of investing it all right before a crash. How would you think about lump sum vs DCA here, and what does the data say?",
    keyTakeaway:
      "DCA removes emotional timing errors from investing. Automatic, regular investments capture market downturns as buying opportunities. For regular income, DCA is default-optimal. For lump sums, lump sum wins on average — but only if you execute it.",
    estimatedMinutes: 5,
  },
  {
    id: "fl-006",
    domain: "financial-literacy",
    conceptName: "Asset Allocation",
    hook: "Nobel laureate Harry Markowitz called diversification 'the only free lunch in finance.' Your mix of stocks, bonds, and cash — your asset allocation — determines 90% of your long-term investment outcomes.",
    coreConcept:
      "Asset allocation is how you divide investments among asset classes: stocks (high risk, high return, high volatility), bonds (lower risk, lower return, negative correlation to stocks), cash/equivalents (negligible return, maximum safety). The classic rule of thumb: hold your age in bonds (age 30 → 30% bonds, 70% stocks). Modern versions adjust: 110 minus age, or 120 minus age for longer lifespans. Rebalancing — periodically resetting back to target allocation — forces you to sell high (the outperforming class) and buy low (the underperforming class). Academic research (Brinson, Hood, Beebower 1986) found asset allocation explains 91.5% of portfolio return variation — more than security selection or market timing.",
    appliedExample:
      "Vanguard's Target Retirement 2055 fund automatically holds ~90% stocks, 10% bonds for a 30-year-old, gradually shifting to 50/50 at retirement. During the 2008 financial crisis, a 60/40 portfolio (stocks/bonds) fell ~26% vs the S&P 500 at -55% — bonds acted as a shock absorber. The 60/40 portfolio is still considered the benchmark for balanced investing, though rising correlation between stocks and bonds during 2022 inflation challenged its assumptions.",
    questionRecall:
      "What is rebalancing, and why does it mechanically force a 'buy low, sell high' discipline?",
    questionApplication:
      "You're 35 years old with $200,000 in a 401(k), all in stocks. Markets have risen 30% in 2 years and you're nervous. How do you think about rebalancing, and what allocation might be appropriate?",
    keyTakeaway:
      "Asset allocation — not individual stock picks — drives most investment outcomes. Decide your stock/bond split based on time horizon and risk tolerance, then rebalance annually to maintain it.",
    estimatedMinutes: 5,
  },
  {
    id: "fl-007",
    domain: "financial-literacy",
    conceptName: "Debt Paydown Strategy",
    hook: "Two people with identical debt can take radically different paths to freedom — one mathematically optimal, one psychologically powerful. Understanding both lets you choose the right weapon for your specific war.",
    coreConcept:
      "Avalanche Method: pay minimums on all debts, then throw extra money at the highest-interest debt first. Mathematically optimal — minimizes total interest paid. Snowball Method: pay minimums on all debts, then attack the smallest balance first. Psychologically powerful — quick wins build momentum and habit. Research by Harvard Business Review found snowball users pay down more debt because behavior change matters more than optimization for many people. A third option: Avalanche-Snowball Hybrid — when a high-interest debt also has a small balance, they converge. Real-world priority: (1) Minimum payments everywhere to avoid fees/damage, (2) Emergency fund starter ($1,000), (3) Capture full employer 401(k) match, (4) High-interest debt (>7%) via avalanche, (5) Invest vs low-interest debt (<4%) based on expected returns.",
    appliedExample:
      "Three debts: Credit Card $3,000 at 22%, Car $12,000 at 6%, Student Loan $25,000 at 4.5%. Avalanche: attack credit card first (saves most interest). Snowball: also attacks credit card first (it's the smallest high-rate debt anyway). If instead the car was $2,000 at 6%: Snowball would attack car, Avalanche would attack credit card — this is where they diverge. Savings: Avalanche saves on average $1,000–$3,000 in interest on typical debt loads vs snowball.",
    questionRecall:
      "What is the core difference between the Debt Avalanche and Debt Snowball methods? Which is mathematically optimal?",
    questionApplication:
      "You have: $800 credit card at 28%, $5,000 medical debt at 0%, $15,000 car loan at 7%, $40,000 student loans at 5%. You have $400/month extra. Design your paydown sequence using the avalanche method.",
    keyTakeaway:
      "Avalanche saves the most money; Snowball saves the most motivation. Choose based on your psychology. For most people, the best strategy is the one they'll actually stick to.",
    estimatedMinutes: 5,
  },
  {
    id: "fl-008",
    domain: "financial-literacy",
    conceptName: "Options Basics",
    hook: "Options are financial contracts that give you the right, but not the obligation, to buy or sell a stock at a specific price. Used correctly, they're insurance policies. Used recklessly, they've wiped out accounts overnight.",
    coreConcept:
      "A Call Option gives you the right to buy 100 shares at the Strike Price before the Expiration Date. You pay a Premium for this right. If the stock rises above the strike + premium, you profit. If it doesn't, you lose only the premium. A Put Option gives you the right to sell 100 shares at the strike price. Useful as insurance: owning puts on your portfolio hedges against a crash. Key terms: In-the-Money (ITM): option has intrinsic value — call when stock price > strike. At-the-Money (ATM): stock price ≈ strike. Out-of-the-Money (OTM): option has no intrinsic value yet. Theta decay: options lose value as expiration approaches, even if the stock doesn't move — time is the option seller's friend and buyer's enemy.",
    appliedExample:
      "AAPL is at $150. You buy a call with $155 strike expiring in 30 days for $3 premium (=$300 for 100 shares). If AAPL hits $165, your option is worth $10 intrinsically — you made $700 on a $300 investment (133% gain). If AAPL stays at $150, your option expires worthless — you lose $300. Selling covered calls on stocks you own generates income: own 100 shares of AAPL at $150, sell a $160 call for $2 ($200). If stock stays below $160, you keep $200. If it rises above $160, you sell at $160 (capped upside but still profitable).",
    questionRecall:
      "What is the difference between a call option and a put option? What does it mean for an option to be 'in the money'?",
    questionApplication:
      "You own 500 shares of a tech stock at $80. You're worried about a market downturn in the next 3 months but don't want to sell. How could you use put options to protect yourself, and what would you be giving up?",
    keyTakeaway:
      "Options are leverage instruments: large gains or total loss of premium. Call = right to buy, Put = right to sell. Theta decay works against buyers. Learn covered calls and protective puts before speculative options strategies.",
    estimatedMinutes: 5,
  },
  {
    id: "fl-009",
    domain: "financial-literacy",
    conceptName: "Real Estate vs Stocks",
    hook: "Real estate made more American millionaires in the 20th century than any other asset class. Yet index fund investing has outperformed real estate on a risk-adjusted basis for the past 50 years. Both statements are true — and both are incomplete.",
    coreConcept:
      "Real Estate advantages: Leverage (you control $400,000 of property with $80,000 down — 5x leverage), Cash flow (rental income), Tax benefits (depreciation deduction, 1031 exchanges), Inflation hedge (rents and values rise with inflation). Stock advantages: Liquidity (sell in seconds vs months), No management (passive), Lower transaction costs (stocks: 0%, real estate: 6–10%), True diversification (own 3,000 companies for $10). Historical returns: US stocks ≈ 10% annually, real estate price appreciation ≈ 4% (Case-Shiller national index), but total return with rent ≈ 8–10%. The Illiquidity Premium: real estate investors earn extra return partly because the asset is hard to sell — you're compensated for locking up capital.",
    appliedExample:
      "A $400,000 rental property with $80,000 down, generating $2,000/month rent, $1,600/month costs (mortgage, taxes, insurance, maintenance): $400/month cash flow, or $4,800/year on $80,000 invested = 6% cash-on-cash return, before appreciation. If property appreciates 4%/year, that's $16,000/year gain on $80,000 down = 20% return on equity. Leverage amplifies both gains and losses — if the property drops 20%, your entire down payment is wiped out.",
    questionRecall:
      "What is 'cash-on-cash return' in real estate, and how does leverage affect it compared to buying stocks outright?",
    questionApplication:
      "You have $100,000 to invest. Option A: put it all in a total market index fund. Option B: use it as a down payment on a $500,000 rental property. What factors would drive your decision beyond just expected return?",
    keyTakeaway:
      "Real estate offers leverage, cash flow, and tax benefits; stocks offer liquidity and passive simplicity. Both belong in a diversified portfolio. Real estate's true return includes rent — appreciation alone understates it.",
    estimatedMinutes: 5,
  },
  {
    id: "fl-010",
    domain: "financial-literacy",
    conceptName: "Credit Score",
    hook: "Your credit score is a three-digit number that can cost or save you $100,000+ over your lifetime in interest. Most people don't know what actually moves it — and accidentally destroy it trying to improve it.",
    coreConcept:
      "FICO score (most used) ranges from 300–850. Components: Payment History (35%) — single most important factor, one 30-day late payment can drop score 50–100 points. Credit Utilization (30%) — ratio of balance to credit limit; keep below 30%, ideally below 10%. Length of Credit History (15%) — don't close old cards; their age still counts. Credit Mix (10%) — having both revolving (cards) and installment (loans) credit helps. New Credit (10%) — each hard inquiry drops score ~5 points temporarily. Score ranges: 800+ Exceptional, 740–799 Very Good, 670–739 Good (average American), 580–669 Fair, below 580 Poor. A 760 vs 650 FICO on a 30-year $400,000 mortgage: rate difference of ~1.5%, costing $130,000 extra in interest.",
    appliedExample:
      "Common mistakes: closing old credit cards (removes available credit, raising utilization ratio and shortening history), applying for multiple cards quickly (multiple hard inquiries), carrying a balance to 'show activity' (myth — utilization is measured at statement date regardless). Quick wins: pay card statement balance before statement closes (reduces reported utilization), ask for credit limit increases without hard inquiry, become an authorized user on an old account with good history.",
    questionRecall:
      "What are the five components of a FICO score and their approximate weights?",
    questionApplication:
      "Your credit score is 680. You want to buy a house in 18 months. You have two cards with 60% utilization and one old card you were thinking of closing. What specific actions do you take to maximize your score before the mortgage application?",
    keyTakeaway:
      "Payment history and utilization drive 65% of your score. Never close old accounts. Pay down utilization below 10% before major credit applications. One year of consistent on-time payments can move a score 50–80 points.",
    estimatedMinutes: 5,
  },

  // ─── MENTAL HEALTH LITERACY (10) ─────────────────────────────────────────
  {
    id: "mh-001",
    domain: "mental-health-literacy",
    conceptName: "Cognitive Distortions",
    hook: "Your brain actively lies to you in predictable, catalogued ways. Cognitive Behavioral Therapy (CBT) identified 10 thought patterns that generate anxiety, depression, and conflict — none of them are accurate reflections of reality.",
    coreConcept:
      "Cognitive distortions are systematic errors in thinking identified by Aaron Beck (1960s) and expanded by David Burns. Key types: All-or-Nothing Thinking (\"I missed my workout, I've completely failed\"), Catastrophizing (\"This mistake will get me fired\"), Mind Reading (\"They didn't text back, they must hate me\"), Emotional Reasoning (\"I feel stupid, therefore I am stupid\"), Should Statements (\"I should be better at this\" — internalized rules causing shame), Personalization (\"The project failed because of me\" — ignoring other factors), Filtering (magnifying negatives, discounting positives), Overgeneralization (\"This always happens to me\"). CBT's core technique: identify the distortion, examine the evidence for and against, generate a more balanced thought.",
    appliedExample:
      "You present in a meeting and one person looks unengaged. All-or-Nothing: 'That was a disaster.' Mind Reading: 'They think I'm incompetent.' The CBT reframe: 'One person seemed distracted. I don't know why. Others seemed engaged. I can ask for feedback if I'm unsure.' Research by Hofmann et al. (2012) meta-analysis: CBT is effective for depression, anxiety, OCD, PTSD, and more across 269 studies.",
    questionRecall:
      "What is 'emotional reasoning' as a cognitive distortion? Give an example of how it works in practice.",
    questionApplication:
      "You receive a critical comment in a code review and immediately think 'I'm a terrible engineer, I shouldn't be in this role.' Identify which cognitive distortions are present and write a more balanced counter-thought.",
    keyTakeaway:
      "Thoughts are not facts. Cognitive distortions are predictable brain bugs. Naming the distortion ('that's catastrophizing') creates distance from it and is the first step to a more accurate, less painful perspective.",
    estimatedMinutes: 5,
  },
  {
    id: "mh-002",
    domain: "mental-health-literacy",
    conceptName: "Window of Tolerance",
    hook: "Why can you handle stress brilliantly on Tuesday and completely fall apart over the same situation on Thursday? The Window of Tolerance — a neuroscience concept — explains exactly why your capacity to cope isn't fixed.",
    coreConcept:
      "Dan Siegel (1999) described the Window of Tolerance as the optimal arousal zone where you can function effectively. Within it: you feel present, can think clearly, handle emotions, access empathy. Hyperarousal (above the window): anxiety, panic, rage, hypervigilance — the sympathetic nervous system's fight-or-flight. Hypoarousal (below the window): numbness, dissociation, depression, shutdown — the dorsal vagal 'freeze' response. Trauma, chronic stress, poor sleep, and hunger all narrow the window. Positive relationships, exercise, mindfulness, and therapy widen it. Understanding this explains why people 'overreact' — they're literally outside the window where rational behavior is possible. You can't shame someone back into their window; you need to regulate together (co-regulation) or help them self-regulate.",
    appliedExample:
      "In conflict resolution: if someone is hyperaroused (voice raised, defensive), logical argument will fail — their prefrontal cortex is offline. First, lower arousal through pacing, pausing, acknowledging feelings ('It sounds like you're frustrated'). Only when they're back in the window can you problem-solve. This is why the adage 'never negotiate angry' has neuroscience behind it. In parenting, a child mid-tantrum cannot access reasoning — co-regulation (calm presence, not reasoning) returns them to the window.",
    questionRecall:
      "What are the two states outside the Window of Tolerance and what does each feel like?",
    questionApplication:
      "You're in a heated performance review. You notice your heart racing, your thoughts scattering, and you're about to say something reactive. Using the Window of Tolerance model, what do you understand is happening and what do you do?",
    keyTakeaway:
      "Stress, sleep deprivation, and trauma narrow your window of tolerance. Outside the window, rational function is impaired. Recognizing when you or others are outside the window — and regulating first, reasoning second — is emotional intelligence in practice.",
    estimatedMinutes: 5,
  },
  {
    id: "mh-003",
    domain: "mental-health-literacy",
    conceptName: "RAIN Technique",
    hook: "Most people either act out their difficult emotions or suppress them entirely. RAIN offers a third path — one that neuroscience confirms actually processes emotion rather than cycling it.",
    coreConcept:
      "RAIN is a mindfulness-based technique developed by Michele McDonald and popularized by Tara Brach. R — Recognize: name what you're feeling ('I'm feeling shame/anger/fear'). Labeling emotion activates the prefrontal cortex and reduces amygdala reactivity — the 'name it to tame it' effect (Lieberman et al., 2007). A — Allow: let the feeling be present without trying to fix, suppress, or escape it. Resistance increases suffering (the 'second arrow' of Buddhism). I — Investigate: with curiosity, explore how it feels in the body. Where do you feel it? What does it need? N — Nurture: offer yourself the compassion you'd give a close friend. Self-compassion (Kristin Neff's research) is consistently associated with resilience and reduced depression/anxiety. The 'after-RAIN' state: often a quality of spaciousness — the emotion processed rather than stuck.",
    appliedExample:
      "You're rejected from a job you really wanted. Without RAIN: either hours of self-criticism (rumination) or numbing with TV/alcohol. With RAIN: Recognize ('I'm feeling shame and disappointment'), Allow (sit with it briefly, don't rush to 'fix'), Investigate ('I feel it in my chest, tight; it's telling me I'm not good enough'), Nurture ('This is genuinely disappointing. It makes sense that I feel this way. Many capable people get rejected. I can try again.'). Brach's research and clinical work shows RAIN interrupts the shame-rumination cycle within minutes.",
    questionRecall:
      "What does each letter in RAIN stand for, and what does the 'Recognize' step do neurologically?",
    questionApplication:
      "You make a significant mistake at work and feel a wave of shame. Walk through all four steps of RAIN applied to this specific situation.",
    keyTakeaway:
      "RAIN processes difficult emotions instead of suppressing or amplifying them. Naming emotion reduces its intensity. Allowing — not resisting — is counter-intuitive but essential. Self-compassion is not weakness; it's what resilient people actually practice.",
    estimatedMinutes: 5,
  },
  {
    id: "mh-004",
    domain: "mental-health-literacy",
    conceptName: "Negativity Bias",
    hook: "Your brain processes bad news five times more intensely than good news of equal magnitude. This was brilliant 100,000 years ago. Today, it's why the news feels catastrophic and why one criticism overshadows ten compliments.",
    coreConcept:
      "Negativity bias is the evolved tendency to weight negative experiences more heavily than positive ones. Rick Hanson: 'The brain is like Velcro for negative experiences and Teflon for positive ones.' Evolutionary logic: missing a threat was fatal; missing a reward was merely costly. This served us on the savanna. In modern life, it means: one bad performance review erases ten good ones emotionally, relationship conflict is weighted 5x more than positive interactions (Gottman's 5:1 ratio for healthy relationships), news media exploits negativity bias because threat-related content captures attention, loss aversion (Kahneman) means we feel losses roughly twice as intensely as equivalent gains. Neurologically: negative stimuli activate the amygdala faster and with stronger response than positive stimuli.",
    appliedExample:
      "John Gottman's 40 years of marriage research: stable couples have approximately a 5:1 positive-to-negative interaction ratio. Not because they avoid conflict, but because they maintain enough positive interactions to buffer the negativity bias. In investing: loss aversion causes investors to sell winners too early (capture gains) and hold losers too long (avoid realizing losses), systematically reducing returns. To counteract negativity bias: deliberately 'install' positive experiences by savoring them for 15–20 seconds (Hanson's 'taking in the good').",
    questionRecall:
      "What is negativity bias and what evolutionary purpose did it serve? Why is it maladaptive in many modern contexts?",
    questionApplication:
      "You lead a team. You gave five pieces of positive feedback and one critical correction in a team meeting. A team member leaves feeling demoralized. Using negativity bias, explain what happened and how you'd adjust your communication approach.",
    keyTakeaway:
      "Negative experiences stick harder than positive ones — by evolutionary design. Counter this by actively savoring positives, understanding that criticism lands 5x harder than praise, and in relationships, maintaining a 5:1 positive ratio.",
    estimatedMinutes: 5,
  },
  {
    id: "mh-005",
    domain: "mental-health-literacy",
    conceptName: "Attachment Styles",
    hook: "The way you were cared for in the first years of your life created a template — an 'internal working model' — that unconsciously shapes every significant relationship you'll have as an adult. But templates can be updated.",
    coreConcept:
      "John Bowlby's Attachment Theory (1969) and Mary Ainsworth's Strange Situation experiments identified four attachment styles: Secure (~55% of population): comfortable with intimacy and interdependence, able to ask for help, not threatened by partner's independence — associated with consistent, responsive early caregiving. Anxious-Preoccupied (~20%): hypervigilant to relationship threats, craves closeness, fears abandonment, can be 'clingy' — associated with inconsistent caregiving. Dismissive-Avoidant (~25%): values independence strongly, uncomfortable with emotional intimacy, tends to suppress emotional needs — associated with caregivers who discouraged emotional expression. Fearful-Avoidant/Disorganized (~5%): wants closeness but fears it, linked to early trauma or frightening caregivers. Attachment styles are not destiny — earned secure attachment through therapy, self-awareness, and secure relationships is well-documented.",
    appliedExample:
      "In conflict: an anxious person escalates ('Why aren't you responding to me?'), an avoidant person withdraws ('I need space'). This anxious-avoidant dance is the most common conflict pattern in relationships and creates a painful loop: anxious escalation triggers avoidant withdrawal which triggers more anxious escalation. Understanding the dynamic allows both people to name the pattern rather than getting absorbed in content: 'I notice we're in our pattern. I feel anxious, you're pulling away. Can we try to do this differently?'",
    questionRecall:
      "What are the four attachment styles? Which is the most common and what parenting pattern tends to produce it?",
    questionApplication:
      "Your partner tends to withdraw and go quiet when you're upset, which makes you escalate and pursue them more intensely. Using attachment theory, analyze what might be happening for each of you and suggest one change each person could make.",
    keyTakeaway:
      "Attachment styles are learned patterns, not fixed traits. Recognizing your style and your partner's creates compassion for the dynamic rather than blame. Earned secure attachment is possible at any age through awareness and relationships.",
    estimatedMinutes: 5,
  },
  {
    id: "mh-006",
    domain: "mental-health-literacy",
    conceptName: "Behavioral Activation",
    hook: "Depression tells you that nothing will feel good, so why try? This is the cruelest lie depression tells — because the research shows that action must come before motivation, not after it.",
    coreConcept:
      "Behavioral Activation (BA) is a core CBT technique for depression based on a simple but counterintuitive insight: depressed people withdraw from rewarding activities because they don't feel like doing them — which deepens depression in a downward spiral. BA reverses this: schedule specific, concrete, achievable activities (walks, social contact, hobbies) before you feel like doing them. The theory (Lewinsohn, 1974): depression results from reduced positive reinforcement from the environment. Action generates more action; the motivation follows behavior, not the reverse. BA has been shown to be as effective as antidepressants for moderate depression in multiple RCTs (Dimidjian et al., 2006). Key principle: start with the smallest possible action — walking to the mailbox, making one phone call. Momentum builds from there.",
    appliedExample:
      "The 2-Minute Rule (James Clear/David Allen): if it takes less than 2 minutes, do it now. More relevantly: commit only to the first 2 minutes of an action. 'I'll just put on my running shoes.' Often the activation energy barrier is what breaks — once started, inertia carries you forward. For severe depression: schedule every hour of the day with low-demand but engaging activities. Monitor mood ratings before/after to build evidence against the depression's 'nothing helps' narrative.",
    questionRecall:
      "Why does Behavioral Activation tell you to act before you feel like acting? What is the theoretical model behind it?",
    questionApplication:
      "You've been feeling low and isolated for two weeks. You've stopped exercising, stopped seeing friends, and spend evenings watching TV. Using Behavioral Activation principles, design a realistic plan for the next week.",
    keyTakeaway:
      "Motivation follows action in depression — not the other way around. Schedule small, specific activities. Don't wait to feel like it. The downward spiral of withdrawal can be reversed by behavioral engagement, starting with the smallest possible step.",
    estimatedMinutes: 5,
  },
  {
    id: "mh-007",
    domain: "mental-health-literacy",
    conceptName: "Mindfulness vs Rumination",
    hook: "The average person spends 47% of their waking hours thinking about something other than what they're doing, according to Harvard research. And this mind-wandering almost always makes people less happy — regardless of what they're wandering to.",
    coreConcept:
      "Mindfulness is present-moment, non-judgmental awareness of experience. Rumination is repetitive, passive focus on distress — mental time travel to the past (guilt, regret) or future (worry, anxiety). Killingsworth & Gilbert (2010) tracked 2,250 people via smartphone: 'A wandering mind is an unhappy mind' — mind-wandering predicted worse mood regardless of the activity. Mindfulness research (Jon Kabat-Zinn's MBSR program): 8 weeks reduces anxiety, depression, and pain, increases cortical thickness in prefrontal regions, reduces amygdala reactivity. The key distinction: mindfulness includes thoughts ('I notice I'm thinking about tomorrow's meeting') — it's meta-awareness, not thought suppression. Rumination circles the same content without resolution; mindfulness observes without being captured by content.",
    appliedExample:
      "The standard MBSR breath exercise: attend to breath sensation. When mind wanders (it will), gently return. Each return is a 'rep' — you're training the prefrontal cortex's ability to override the default mode network (the brain's rumination circuit). 10 minutes daily for 8 weeks shows measurable brain changes. Rumination maintenance: 'Why did I say that?' loops don't produce insight — they produce more rumination. The antidote is either problem-solving (if actionable) or radical acceptance (if not).",
    questionRecall:
      "What is the difference between mindfulness and rumination? What did the Killingsworth & Gilbert study find about mind-wandering and happiness?",
    questionApplication:
      "You have an important presentation tomorrow and find yourself repeatedly cycling through worst-case scenarios tonight. Distinguish between productive preparation and rumination, and describe a mindfulness technique to interrupt the cycle.",
    keyTakeaway:
      "Rumination is passive, repetitive, and increases distress. Mindfulness is active awareness that interrupts rumination without suppressing thoughts. Even 10 minutes daily of breath-focused practice produces measurable reductions in anxiety and depression within weeks.",
    estimatedMinutes: 5,
  },
  {
    id: "mh-008",
    domain: "mental-health-literacy",
    conceptName: "Stress Inoculation",
    hook: "Moderate stress makes you stronger. Zero stress makes you brittle. Too much stress breaks you. The dose determines whether stress is your greatest performance enhancer or your worst health destroyer.",
    coreConcept:
      "Hormesis is the biological principle that low doses of a stressor produce beneficial adaptive effects while high doses are harmful (Calabrese, 2008). Eustress ('good stress') is challenging but within your capacity — it drives growth, focus, and skill development. Distress overwhelms capacity. Yerkes-Dodson Law (1908): performance follows an inverted U — too little arousal (bored) and too much arousal (panicked) both impair performance; the peak is in the middle. Stress Inoculation Training (Meichenbaum) is a CBT technique: deliberately expose yourself to manageable stressors to build resilience and coping skills before facing real high-stakes situations. Navy SEALs, surgeons, and pilots use controlled stress exposure in training to prevent performance degradation under pressure. Kelly McGonigal's reframe: viewing stress as energizing (rather than harmful) literally changes its physiological profile — higher DHEA, better recovery.",
    appliedExample:
      "Cold showers are hormetic stress: brief cold exposure triggers norepinephrine release (100–300% increase per Huberman Lab review), improves mood, and builds tolerance for discomfort. Progressive overload in exercise is hormesis: muscles micro-tear and rebuild stronger. For anxiety: graduated exposure (starting with less feared situations and building up) is the gold standard — avoiding feared situations strengthens anxiety, facing them (gradually) extinguishes it.",
    questionRecall:
      "What is the Yerkes-Dodson Law and what does it suggest about the relationship between stress and performance?",
    questionApplication:
      "You have severe public speaking anxiety. Your instinct is to avoid presenting until you feel ready. Using stress inoculation principles, design a graduated exposure plan over 3 months.",
    keyTakeaway:
      "Moderate, manageable stress builds resilience; chronic overwhelming stress destroys it. Deliberately seek out small challenges to build capacity. Avoiding stress consistently weakens your response to it.",
    estimatedMinutes: 5,
  },
  {
    id: "mh-009",
    domain: "mental-health-literacy",
    conceptName: "Social Baseline Theory",
    hook: "Your brain doesn't treat social connection as a luxury — it treats it as a metabolic necessity. Being socially isolated consumes more of your body's energy budget than being with trusted others. Loneliness is not just sad; it's physiologically expensive.",
    coreConcept:
      "Social Baseline Theory (Lane Beckes & James Coan, 2011) proposes that the brain assumes social connection as its baseline metabolic state. The brain evolved in a highly cooperative social context — safety, resources, and threat detection were fundamentally shared. When you're with trusted people, the brain can 'outsource' some threat monitoring and regulatory functions — literally reducing the neural effort required to manage your environment. Evidence: Coan's hand-holding studies — threatening electric shocks produced significantly less activity in threat-processing brain regions when participants held a spouse's hand vs. a stranger's vs. no one's. The benefit scaled with relationship quality. Implications: social connection is a physiological resource, not just an emotional preference. Loneliness (Cacioppo's research) raises cortisol, disrupts sleep, increases inflammation, and is associated with mortality risk comparable to smoking 15 cigarettes/day.",
    appliedExample:
      "In high-stress work environments: teams that celebrate together, share meals, and build genuine relationships are not 'wasting time' — they're building a physiological buffer against stress-related performance degradation. Military units bond intensely not just for morale but because genuine social connection measurably improves resilience under fire. Remote work research consistently finds higher loneliness and burnout — not because remote workers are weaker, but because the social baseline assumption is unmet.",
    questionRecall:
      "What does Social Baseline Theory mean by the brain 'outsourcing' regulatory functions to others?",
    questionApplication:
      "You've been working remotely for a year and notice higher stress and worse sleep than when you worked in an office. Using Social Baseline Theory, explain what might be happening physiologically and suggest three concrete interventions.",
    keyTakeaway:
      "Social connection is a physiological resource, not a luxury. Your nervous system is literally more efficient when in trusted company. Loneliness has health impacts equivalent to smoking. Invest in social connection as seriously as diet and exercise.",
    estimatedMinutes: 5,
  },
  {
    id: "mh-010",
    domain: "mental-health-literacy",
    conceptName: "Polyvagal Theory",
    hook: "You have a nerve running from your brainstem to nearly every organ in your body — it's called the vagus nerve, and it's the biological infrastructure of safety, connection, and calm. Understanding it changes how you understand anxiety, trauma, and human connection.",
    coreConcept:
      "Stephen Porges' Polyvagal Theory (1994) describes three evolutionary layers of the autonomic nervous system, each handling threat differently: Ventral Vagal (newest, mammalian): the 'social engagement system' — activates when safe, enables connection, communication, open facial expression, prosodic voice, curiosity. Sympathetic (middle): mobilization — fight or flight. Activates when safety is threatened. Dorsal Vagal (oldest, reptilian): immobilization — freeze, shutdown, dissociation. Activates when threat is inescapable and fight/flight have failed. These are hierarchical — the nervous system tries ventral vagal first (social connection), then sympathetic, then dorsal vagal. 'Neuroception' is the body's unconscious scan for safety/danger cues that determines which state activates — it precedes conscious perception and can be wrong (trauma survivors neuroceive danger where there is none).",
    appliedExample:
      "Physiological sigh (double inhale through nose, long exhale through mouth): the extended exhale activates the ventral vagal brake on the heart (through the sinoatrial node), rapidly shifting from sympathetic to ventral vagal. This is the fastest known method for real-time nervous system downregulation. Cold water on face activates the dive reflex — slows heart rate via vagus nerve. Eye contact, prosodic voice (melodic, varied), and safe touch all activate the ventral vagal social engagement system.",
    questionRecall:
      "What are the three states described by Polyvagal Theory and what does each state feel like?",
    questionApplication:
      "You're about to walk into a high-stakes negotiation and feel frozen and slightly dissociated (dorsal vagal shutdown). Using Polyvagal Theory, what would you do in the 5 minutes before you walk in to shift your state?",
    keyTakeaway:
      "The nervous system prioritizes safety signals over reasoning. The vagus nerve is the physiological pathway to calm and connection. Slow exhales, prosodic voice, and safe social contact are tools — not metaphors — for nervous system regulation.",
    estimatedMinutes: 5,
  },

  // ─── PUBLIC SPEAKING (10) ─────────────────────────────────────────────────
  {
    id: "ps-001",
    domain: "public-speaking",
    conceptName: "The Rule of Three",
    hook: "Julius Caesar: 'Veni, vidi, vici.' Steve Jobs: 'An iPod, a phone, and an internet communicator.' Abraham Lincoln: 'Government of the people, by the people, for the people.' Three is not coincidence — it's cognitive architecture.",
    coreConcept:
      "The Rule of Three is the rhetorical principle that ideas grouped in threes are more satisfying, memorable, and persuasive than any other grouping. Cognitively: two feels like a comparison, four feels like a list, three feels complete — it creates a pattern with a satisfying resolution on the third beat. In speech writing: use tricolon (three parallel clauses), break key messages into three points, use three examples to illustrate a concept. Aristotle identified three modes of persuasion: Ethos (credibility), Pathos (emotion), Logos (logic). Linguists note 'third is the charm' in nearly every oral tradition worldwide. The pattern creates what cognitive psychologists call a 'Gestalt closure' — the brain completes the pattern and encodes it as a unit.",
    appliedExample:
      "Steve Jobs' iPhone introduction (2007) is a masterclass in the rule of three. First, he announced 'three revolutionary products' — an iPod, a phone, an internet communicator. He repeated this three times, building tension. Then: 'These are not three separate devices — this is one device!' The structure created anticipation and revelation. Martin Luther King's 'I Have a Dream' contains dozens of triads. In practical presentations: structure your talk as Problem / Solution / Call to Action — three parts, every time.",
    questionRecall:
      "Why does the Rule of Three work cognitively? What pattern does the brain expect after two items?",
    questionApplication:
      "You're pitching a new product to investors. Rewrite this sentence using the Rule of Three: 'Our product is good because it saves time and it's easy to use and it's affordable and it integrates with existing tools.'",
    keyTakeaway:
      "Three is the most persuasive number in communication. Structure key messages in threes, use tricolons, break complex ideas into three parts. When in doubt, cut to three.",
    estimatedMinutes: 5,
  },
  {
    id: "ps-002",
    domain: "public-speaking",
    conceptName: "Vocal Variety",
    hook: "Research shows listeners decide whether they'll pay attention to a speaker within the first 30 seconds — based almost entirely on vocal quality. A monotone voice loses the audience before the first idea lands.",
    coreConcept:
      "Vocal variety consists of four dimensions: Pitch (high to low — raise pitch for questions/excitement, lower it for authority/gravitas), Pace (fast conveys excitement/urgency; slow conveys importance/weight — most speakers go too fast when nervous), Volume (loud for emphasis, quiet to draw listeners in — a sudden drop to near-whisper can be more arresting than shouting), Tone/Quality (warm, energetic, authoritative — audiences mirror your emotional state). The resonance principle: your voice has natural resonance in your chest (warm, authoritative) and head (brighter, more energetic). Most people default to one register. Practicing downward inflection at sentence ends signals confidence; upward inflection (uptalk) undermines it. The pause (its own lesson) is a vocal tool — silence contrasts with sound and creates emphasis.",
    appliedExample:
      "Martin Luther King Jr's 'I Have a Dream' is the canonical example: he slows dramatically for 'I have a dream,' drops to near-whisper at the emotional peaks, then builds to full volume. The contrast creates the emotional architecture of the speech. Record yourself for 3 minutes and play it back — most people are shocked by how flat they sound. Mark up your script: underline words to stress, put '/' for short pause, '//' for long pause, 'slow' and 'fast' in margins.",
    questionRecall:
      "What are the four dimensions of vocal variety? Which do most nervous speakers neglect first?",
    questionApplication:
      "You're delivering a presentation about layoffs to your team. You want to convey both gravity/empathy and confidence/clarity. How would you adjust your pitch, pace, and volume for this specific context?",
    keyTakeaway:
      "Vocal variety is the delivery equivalent of punctuation — it tells audiences which ideas matter. Practice recording yourself; most people sound more monotone than they feel. Slow down, lower your pitch, and use silence as emphasis.",
    estimatedMinutes: 5,
  },
  {
    id: "ps-003",
    domain: "public-speaking",
    conceptName: "Opening Hook",
    hook: "You have 30 seconds. That's how long research gives you before an audience decides whether to mentally check in or check out. Most speakers waste those 30 seconds on logistics, housekeeping, and pleasantries.",
    coreConcept:
      "The opening hook is the single most important moment of any presentation. Effective opening types: Startling Statistic ('60% of adults cannot perform basic financial calculations — and most of them are in this room'), Counter-Intuitive Question ('What if everything you know about motivation is wrong?'), Vivid Story ('Three years ago, my company was 48 hours from bankruptcy'), Bold Claim ('The meeting we're about to have will either save or waste 500 hours of collective team time this quarter'), Silence (stand at the lectern, make eye contact, pause for 5 full seconds — creates instant anticipation). Never open with: 'Hi, I'm [name], today I'll be talking about...', logistics ('Can everyone hear me?'), jokes unless you're an expert comedian, or apologies ('I didn't have much time to prepare'). The hook sets emotional tone and frames why the audience should care.",
    appliedExample:
      "Nancy Duarte analyzed hundreds of great speeches and found that the opener establishes the gap between 'what is' and 'what could be' — the tension that drives the entire talk. Simon Sinek's TED Talk: 'How do you explain when things don't go as we assume? Or better, how do you explain why some people and organizations are able to inspire where others aren't?' — opens with a question that promises to resolve a tension everyone has felt. TED's own speaker coaching: first 30 words of your talk should be memorized so thoroughly that extreme nerves cannot disrupt them.",
    questionRecall:
      "Name three types of effective opening hooks and two common openings you should always avoid.",
    questionApplication:
      "You're presenting a proposal to adopt a new software tool that will disrupt the team's current workflow. Write an opening hook (3–4 sentences) that would make the audience lean forward rather than cross their arms.",
    keyTakeaway:
      "The first 30 seconds are the most consequential of any talk. Never waste them on logistics. Memorize your opener. Create a gap — a tension between current reality and possibility — that your talk then resolves.",
    estimatedMinutes: 5,
  },
  {
    id: "ps-004",
    domain: "public-speaking",
    conceptName: "The Power of Pause",
    hook: "The most powerful word in public speaking has no sound. Silence — used deliberately — signals confidence, creates emphasis, and gives audiences time to absorb meaning. Yet most speakers are terrified of it.",
    coreConcept:
      "The pause is a tool, not an absence. Types of pauses: Breathing Pause (natural rhythm, keeps sentences from running together), Dramatic Pause (before or after a key point — creates emphasis, signals 'this matters'), Transition Pause (between sections — signals the audience to file away what they heard and prepare for something new), Rhetorical Pause (after a question — gives the audience genuine space to process). Average speaking pace: 130–150 words per minute. Nervous speakers accelerate to 180–200 wpm — pauses become casualties. The audience's perspective: a 3-second pause that feels like an eternity to the speaker feels like a brief, pleasant moment of reflection to the listener. Filler words ('um,' 'uh,' 'like,' 'you know') are what speakers substitute for pauses when they're afraid of silence — replacing nothing with noise.",
    appliedExample:
      "Barack Obama is celebrated for his pauses. In his 2004 DNC keynote: he regularly paused 3–5 seconds mid-sentence, particularly before critical words. This created an almost rhythmic quality that kept audiences riveted. Toastmasters' main exercise for nervous speakers: stand at the podium, say nothing, make eye contact, breathe, and count silently to five before beginning. Most speakers report this as the most challenging exercise they've done — and the most transformative. The pause is counterintuitively the cure for the filler word habit.",
    questionRecall:
      "What are three different types of pauses in public speaking and when would you use each?",
    questionApplication:
      "You're presenting data that shows your project is 3 months behind schedule. Write out (with pause marks) how you would deliver the sentence: 'The project is behind schedule. But here is why this is actually an opportunity.'",
    keyTakeaway:
      "Silence is emphasis. A 3-second pause feels eternal to the speaker and completely natural to the audience. Eliminate filler words by replacing them with deliberate pauses. Pause before and after every key idea.",
    estimatedMinutes: 5,
  },
  {
    id: "ps-005",
    domain: "public-speaking",
    conceptName: "Body Language",
    hook: "Amy Cuddy's power pose research went viral — and then faced a replication crisis. What the science actually shows about body language in speaking is both more nuanced and more actionable than any single study.",
    coreConcept:
      "Body language in public speaking involves: Posture (feet hip-width, weight balanced, spine tall — signals groundedness; swaying, shifting, or leaning signals anxiety), Gesture (gestures should be open, visible above the waist, and match the verbal content — 'three points' while showing three fingers anchors the idea), Eye Contact (crucial for trust — see the lighthouse technique in a separate lesson), Movement (purposeful movement toward a part of the audience shows engagement; pacing nervously shows anxiety — movement should be intentional), Facial Expression (match your emotional content — if you're excited, look excited; mismatches destroy credibility). Mehrabian's '7%/38%/55%' rule is widely misquoted — it applies only to communicating feelings and attitudes, not general communication. But delivery does matter enormously for perceived credibility and likeability.",
    appliedExample:
      "Cuddy's original finding (power poses affect testosterone/cortisol) did not replicate, but the self-perception effect did: adopting open, expansive posture before a high-stakes situation increased feelings of confidence and reduced anxiety. This is consistent with embodied cognition research. Practical: 2 minutes of expansive posture backstage before speaking shifts your psychological state — even if the hormones don't change as dramatically as originally claimed. Video yourself from the waist up and count gesture frequency: most people gesture too rarely, making them appear stiff.",
    questionRecall:
      "What are three body language elements that signal confidence to an audience? What signals nervousness?",
    questionApplication:
      "You're presenting standing at a podium with a fixed microphone. You can't move freely. How do you use posture, gesture, and facial expression to maintain audience engagement?",
    keyTakeaway:
      "Open posture, purposeful gestures, and eye contact are the three pillars of credible physical presence. Move intentionally or don't move. Adopt an expansive posture backstage before speaking — it shifts your internal state regardless of what it does to your hormones.",
    estimatedMinutes: 5,
  },
  {
    id: "ps-006",
    domain: "public-speaking",
    conceptName: "Storytelling Structure",
    hook: "A human brain processes a compelling story and a lived experience in remarkably similar ways. When you tell a great story, your listener's brain synchronizes with yours. That's not poetry — it's neuroscience.",
    coreConcept:
      "The Hero's Journey (Campbell) is the underlying structure of most compelling stories: Ordinary World (context), Call to Adventure (challenge/problem), Refusal/Acceptance, Trials (struggle with real obstacles), Transformation, Return (insight or resolution). For presentations, Nancy Duarte's SPARKLINE is simpler: alternate between 'What Is' (current state, relatable) and 'What Could Be' (possibility, aspirational) until the audience is moved to act. Story structure for speaking: (1) Context/Stakes — who, where, when, why it matters. (2) Conflict — the obstacle or tension (this is where most presenters omit — you can't have a story without conflict). (3) Resolution — what happened, what was learned. Stories need specificity: 'A customer' is forgettable; 'Maria, a 34-year-old nurse in Phoenix' is vivid.",
    appliedExample:
      "Brené Brown's TED Talk on vulnerability opens with: 'A year after I started my research, I had what I call a breakdown. My therapist called it a spiritual awakening.' This is specific, personal, and immediately vulnerable — creating instant emotional identification. Google's 'Year in Search' ads follow pure hero's journey — person faces devastating challenge, seeks help, finds connection, transforms. Princeton neuroscientist Uri Hasson demonstrated via fMRI that when a speaker tells a personal story, listeners' brain activity (especially in prefrontal and parietal areas) synchronizes with the speaker's — a phenomenon called neural coupling.",
    questionRecall:
      "What is the minimum structure of a good story? Why is conflict essential — what happens to a story without it?",
    questionApplication:
      "You need to convince your team to adopt a new process. Instead of presenting bullet points, structure this as a story: the team was struggling, you tried the new process, here's what happened. Write a 3-sentence version using the context/conflict/resolution structure.",
    keyTakeaway:
      "Stories require conflict — without tension, there's no narrative. Be specific with details (names, places, numbers). Alternate between 'what is' and 'what could be' to move audiences emotionally. The brain processes stories as experience, not information.",
    estimatedMinutes: 5,
  },
  {
    id: "ps-007",
    domain: "public-speaking",
    conceptName: "Handling Q&A",
    hook: "Many speakers prepare obsessively for 20 minutes of presentation and wing 10 minutes of Q&A — which is often when audience perception of competence is most strongly formed.",
    coreConcept:
      "Q&A management techniques: The Bridge technique (from political communications): when asked a question outside your expertise or a trap question, acknowledge it then redirect to your key message. 'That's an important question about X — what I can tell you is Y.' Pause before answering: 3 seconds feels thoughtful to the audience, even if you already know the answer. It prevents reactive responses and signals confidence. Repeat/rephrase the question for the full audience: 'So the question is whether our timeline is realistic — let me address that.' If you don't know: 'I don't have that data with me — let me get back to you by Friday' is far better than guessing. Hostile questions: name the concern (shows you heard it), separate the person from the position, answer the substance. Never argue. Preparing: generate 20 likely questions before every talk, answer them in writing, practice the top 5.",
    appliedExample:
      "Richard Feynman's Caltech lectures demonstrate masterful Q&A: he almost always restated questions in his own words ('What you're really asking is...'), often simplifying them — this reframe allowed him to answer the deeper question beneath the surface question. Politicians use bridging so consistently you can train yourself to spot it: 'I appreciate that question, but what's really important is...' is a textbook bridge. Preparing Q&A: Jeff Weiner (LinkedIn CEO) reportedly prepared for board meetings by writing out every question he expected and his ideal answer, then having his team stress-test with unexpected ones.",
    questionRecall:
      "What is the 'bridge technique' in Q&A? When would you use it and what does it sound like?",
    questionApplication:
      "You've just presented a proposal and someone asks: 'This sounds expensive. Are you sure we can afford this?' You don't have budget numbers memorized. Walk through exactly how you would respond using Q&A best practices.",
    keyTakeaway:
      "Prepare 20 questions before every important talk. In Q&A: pause, rephrase, answer directly. Use the bridge to redirect hostile questions. 'I don't know, I'll find out' is always better than guessing. Q&A is where trust is often won or lost.",
    estimatedMinutes: 5,
  },
  {
    id: "ps-008",
    domain: "public-speaking",
    conceptName: "Nervousness Reframe",
    hook: "Public speaking anxiety is the most common phobia — more common than fear of death, according to some surveys. But the physiological state of nervousness and excitement are identical. The only difference is the story you tell about it.",
    coreConcept:
      "Arousal reappraisal (Alison Wood Brooks, Harvard, 2014): instead of trying to 'calm down' before a speech (fighting your arousal), tell yourself 'I am excited.' This reappraisal aligns with your actual physiological state (high arousal) rather than fighting it. Brooks found that people who said 'I am excited' before high-stakes tasks performed 17% better than those who said 'I am calm' — because calm requires suppressing a physiological state, while excitement is the same state with a different label. The physiological symptoms of stage fright (elevated heart rate, adrenaline, heightened attention) are optimal performance physiology — your body is doing you a favor. Elite athletes use the same arousal before competition. Additional techniques: process focus (I'm going to give this idea, not perform this speech), contribution focus (this talk serves the audience, not my ego).",
    appliedExample:
      "Barbra Streisand famously avoided live performance for 27 years due to stage fright after forgetting lyrics. Her therapist helped her reframe: the audience wants you to succeed. Survey data: 85% of audience members report rooting for the speaker to do well. They feel empathy when speakers struggle — not schadenfreude. The practical implication: your audience is your ally, not your judge. Before your next talk, say 'I'm excited' aloud three times. It sounds silly; the research shows it works.",
    questionRecall:
      "What is 'arousal reappraisal' and how is it different from trying to 'calm down' before a presentation?",
    questionApplication:
      "You have a major presentation in 10 minutes. Your hands are shaking, heart is racing, and you feel like fleeing. Using arousal reappraisal and what you know about performance physiology, walk through exactly how you'd talk to yourself right now.",
    keyTakeaway:
      "Nervousness and excitement are physiologically identical. Stop fighting your arousal — reframe it as excitement instead. Your body is preparing you for peak performance, not punishment. The audience wants you to succeed.",
    estimatedMinutes: 5,
  },
  {
    id: "ps-009",
    domain: "public-speaking",
    conceptName: "Eye Contact",
    hook: "Eye contact is the most powerful trust signal in human communication — and almost every speaker does it wrong. Scanning the room, avoiding it entirely, or staring at slides are all forms of disconnection that audiences register immediately.",
    coreConcept:
      "The Lighthouse Method: rather than scanning continuously (which feels to no one like genuine contact), divide your audience into zones (left, center, right, and with large groups: front, middle, back). Complete a thought — a full sentence or phrase — while looking at one person in one zone. Then naturally move your gaze to another zone for the next thought. Each person in a zone feels they're receiving genuine eye contact. Research: genuine eye contact (3–5 seconds per person) increases perceived speaker credibility, warmth, and trustworthiness. Less than 1 second feels shifty; more than 7 seconds feels confrontational. With slides: 'billboard rule' — glance at the slide to reference it, then turn fully back to the audience before speaking. Never read from the slide. For virtual presentations: look at the camera (not your own image) to create the perception of eye contact.",
    appliedExample:
      "Ronald Reagan was nicknamed 'The Great Communicator' — observers noted he made each person in a large room feel personally addressed. Study of his debate tapes shows regular 3–5 second sustained contact with specific audience members across all zones. For virtual calls: put a sticky note with a smiley face next to your webcam. This reminds you to look at the camera (where your virtual eye contact lives) rather than at the faces on screen (which produces the appearance of looking down).",
    questionRecall:
      "Describe the Lighthouse Method for eye contact. How long should you hold eye contact with one person before moving?",
    questionApplication:
      "You're presenting to 8 people around a conference table. You tend to look at your most senior stakeholder most of the time. Using the lighthouse method, how would you distribute your eye contact differently?",
    keyTakeaway:
      "Complete a thought while holding one person's gaze; move to a new person for the next thought. 3–5 seconds per person feels warm; less feels avoidant. For virtual presentations, the camera is your eye contact — not the faces on screen.",
    estimatedMinutes: 5,
  },
  {
    id: "ps-010",
    domain: "public-speaking",
    conceptName: "The PREP Formula",
    hook: "Asked an unexpected question in a meeting, most people either over-answer (panic-talking) or under-answer (freeze). PREP is a four-part structure that makes any answer sound organized — even when you're improvising.",
    coreConcept:
      "PREP: Point (state your position clearly upfront — one sentence), Reason (explain why — your logic, evidence, or principle), Example (make it concrete — a specific story, data point, or case), Point (return to your original position — restate it, sometimes with a 'so' or 'therefore'). PREP is effective because it mirrors how audiences process information: they want to know your conclusion first (unlike academic writing), then why, then proof. The first P prevents buried lede — stating your main point after extensive context-setting, which loses audiences. The final P reinforces memory through repetition. PREP applies to answers, short speeches, emails, and executive summaries. Alternative frameworks: STAR (Situation, Task, Action, Result — better for behavioral interview stories) and Bottom Line Up Front (BLUF — military/executive communication: conclusion first, then supporting detail).",
    appliedExample:
      "Question: 'Should we expand into the European market?' Without PREP: 'Well, there are a lot of factors to consider. The European market has some regulatory challenges like GDPR, but also there's potential revenue, though our team is stretched... I think maybe yes?' With PREP: 'Yes, we should expand into Europe. [Point] The market opportunity is three times our current TAM, and two competitors are already moving there. [Reason] Our product has already been purchased by 12 European companies without marketing effort. [Example] So yes — I recommend we begin a scoped pilot in Germany and Netherlands this year. [Point]' Same content; completely different perceived competence.",
    questionRecall:
      "What does PREP stand for and why does it start with the Point rather than building up to it?",
    questionApplication:
      "Someone asks you in a meeting: 'What do you think about switching our entire product from subscription to usage-based pricing?' You have 30 seconds. Use PREP to structure a response.",
    keyTakeaway:
      "State your conclusion first, then support it. PREP (Point, Reason, Example, Point) transforms improvised answers into organized responses. Practice it in low-stakes conversations — answer emails and Slack messages in PREP format to build the habit.",
    estimatedMinutes: 5,
  },

  // ─── CLIMATE LITERACY (10) ────────────────────────────────────────────────
  {
    id: "cl-001",
    domain: "climate-literacy",
    conceptName: "Carbon Budget",
    hook: "The entire remaining carbon budget to keep warming below 1.5°C is about 400 billion tonnes of CO2. Humanity currently emits 40 billion tonnes per year. Do the math: we have roughly 10 years at current rates.",
    coreConcept:
      "A carbon budget is the total cumulative amount of CO2 (and equivalent greenhouse gases) that can be emitted while keeping global warming below a temperature threshold with a given probability. The IPCC's Sixth Assessment Report (2021): to limit warming to 1.5°C with 50% likelihood, the remaining budget from 2020 is ~500 GtCO2; at 1.5°C with 67% likelihood, ~400 GtCO2. At 40 GtCO2/year, this budget is exhausted by approximately 2030 (without reductions). The 1.5°C target matters because: coral reef survival (>99% die above 2°C vs ~70% at 1.5°C), extreme weather frequency, sea level rise, and feedback loops are all dramatically worse at 2°C than 1.5°C. 'Net zero' means balancing emissions with removals — not eliminating all emissions, but removing as much as you emit.",
    appliedExample:
      "The Paris Agreement (2015): 195 countries agreed to limit warming to 'well below 2°C' with efforts toward 1.5°C. Current Nationally Determined Contributions (NDCs) put us on track for approximately 2.5–2.7°C by 2100. The gap between pledges and required action is called the 'emissions gap' — UNEP calculates countries need to roughly triple their ambition. Carbon budgets help translate abstract temperatures into concrete tonnage limits that can be tracked, allocated, and enforced.",
    questionRecall:
      "What is a carbon budget and how does the 1.5°C carbon budget compare to current annual global emissions?",
    questionApplication:
      "A country emits 500 million tonnes of CO2 per year and has pledged to reach net zero by 2050. Its 'fair share' of the 1.5°C budget is 8 billion tonnes total. Is its 2050 net-zero pledge consistent with the 1.5°C budget? Show your reasoning.",
    keyTakeaway:
      "The carbon budget is finite and nearly exhausted. Cumulative emissions determine warming — not the rate in any given year. Every year of delay shrinks the remaining budget and makes the required annual reductions steeper.",
    estimatedMinutes: 5,
  },
  {
    id: "cl-002",
    domain: "climate-literacy",
    conceptName: "Climate Tipping Points",
    hook: "Some changes in the climate system are reversible. Others are not. Tipping points are thresholds after which the system changes irreversibly under its own momentum — no matter what humans do afterward.",
    coreConcept:
      "A climate tipping point is a critical threshold where a small push causes a large, self-reinforcing, irreversible change. Key tipping points: Arctic Sea Ice loss (reflective white ice replaced by dark ocean — absorbs more heat, accelerating warming), Greenland Ice Sheet collapse (at 1.5–2°C: slow melt adding 7 meters of sea level rise over centuries), West Antarctic Ice Sheet (potential 3–5 additional meters of sea level), Amazon Dieback (deforestation + warming could push the Amazon from carbon sink to carbon source — 25% of the Amazon already degraded), Permafrost Thaw (stores 1.5 trillion tonnes of CO2 and methane — roughly 2x atmospheric CO2; release creates a feedback loop no policy can stop), Atlantic Meridional Overturning Circulation (AMOC) weakening. Armstrong McKay et al. (Science, 2022): many tipping points may trigger below 2°C — and they can cascade, triggering each other.",
    appliedExample:
      "The Siberian permafrost contains more stored carbon than all the coal reserves on Earth. As permafrost thaws, ancient organic matter decomposes, releasing CO2 and methane (80x more potent than CO2 over 20 years). This creates a self-amplifying feedback: warming thaws permafrost, which releases GHGs, which causes more warming, which thaws more permafrost. Once triggered past a threshold, this process cannot be stopped by human emission reductions — a true planetary runaway. This is why climate scientists are more alarmed than the 'average 2°C is manageable' framing suggests.",
    questionRecall:
      "What makes a climate tipping point different from gradual, reversible climate change? Give two examples of tipping points.",
    questionApplication:
      "A policymaker argues: 'Even if we overshoot 1.5°C, we can use carbon capture to bring CO2 back down later.' Using tipping point science, what is the strongest counterargument to this?",
    keyTakeaway:
      "Tipping points are irreversible thresholds, not gradual changes. Several may trigger below 2°C of warming, and they can cascade. The risk of triggering tipping points is a key reason why preventing overshoot is fundamentally different from temporarily overshooting and then reducing emissions.",
    estimatedMinutes: 5,
  },
  {
    id: "cl-003",
    domain: "climate-literacy",
    conceptName: "Carbon Capture",
    hook: "Bill Gates calls Direct Air Capture 'one of the most important technologies we could possibly develop.' Currently, all DAC machines in the world combined capture less CO2 in a year than humanity emits in 4 seconds.",
    coreConcept:
      "Carbon capture falls into two categories: Natural Carbon Sinks: forests, oceans, wetlands, and soil absorb CO2. Forests absorb ~2.6 GtCO2/year, oceans ~2.9 GtCO2/year — together about 13% of global emissions. Degradation (deforestation, ocean acidification) is reducing sink capacity. Technological Solutions: Bioenergy with Carbon Capture and Storage (BECCS) — grow biomass, burn it for energy, capture the CO2 — theoretically carbon negative. Direct Air Capture (DAC) — fans pull air over chemical sorbents that bind CO2. Current cost: $400–$1,000 per tonne. Climeworks' Mammoth plant in Iceland (2024): captures 36,000 tonnes/year — humanity emits 40 billion tonnes/year. The scale gap is roughly 1 million-fold. Carbon sequestration stores captured CO2 (geological formation, mineralization). IPCC models: most 1.5°C scenarios require some carbon removal — but as complement to emission cuts, not substitute.",
    appliedExample:
      "The cost problem: current DAC costs ~$400–1,000/tonne. Oil companies profit from selling a tonne of CO2-equivalent at ~$20–50 (as fossil fuel revenue). Economic viability requires massive cost reduction (target: $100/tonne) or carbon pricing that makes emitting expensive. Stripe, Shopify, and Alphabet are early buyers through advance purchase agreements, funding the learning curve. Enhanced weathering (spreading silicate rock dust on farmland) shows promise at potentially $50–200/tonne and co-benefits for agriculture.",
    questionRecall:
      "What is Direct Air Capture (DAC) and what is the current scale gap between DAC capacity and global emissions?",
    questionApplication:
      "A company claims to be 'carbon neutral' by purchasing DAC credits to offset all its emissions. What questions would you ask to evaluate whether this claim represents genuine climate action?",
    keyTakeaway:
      "Carbon removal is necessary but not sufficient — it complements steep emission cuts, it doesn't replace them. Current DAC cost and scale make it a minor contribution for now. Natural sinks are being degraded at the same time they're most needed.",
    estimatedMinutes: 5,
  },
  {
    id: "cl-004",
    domain: "climate-literacy",
    conceptName: "Renewable Energy Costs",
    hook: "In 2010, solar power cost $0.37 per kilowatt-hour. By 2023, it cost $0.044 — an 88% drop in 13 years. This is faster cost reduction than any energy technology in history, and it's still accelerating.",
    coreConcept:
      "Lazard's Levelized Cost of Energy (LCOE) analysis tracks the all-in cost of generating electricity from each source over a plant's lifetime: Solar PV (utility-scale): $24–96/MWh in 2023 vs $359/MWh in 2009. Onshore Wind: $24–75/MWh. Offshore Wind: $72–140/MWh. Combined Cycle Gas: $39–101/MWh. Coal: $65–152/MWh. Nuclear: $141–221/MWh. Solar and wind are now the cheapest sources of new electricity generation in most of the world. Wright's Law (learning curves): solar costs fall ~20% for every doubling of cumulative capacity — this is driven by manufacturing scale, improved efficiency, and supply chain maturity. Storage costs (lithium-ion batteries) have dropped 97% since 1991 and are following a similar curve.",
    appliedExample:
      "The renewable energy cost collapse has been one of the most wrong-predicted trends in history: the IEA's 2010 World Energy Outlook projected solar would cost $0.21/kWh by 2050; it reached $0.044 by 2023. This systematic underestimation happened because modelers didn't account for learning curve dynamics. The transition economics are now reversed: in most markets, it's cheaper to build new wind/solar than to operate existing coal plants. Texas added more wind capacity than any state between 2000–2022 purely on economics, not environmental policy.",
    questionRecall:
      "What is LCOE and how does solar compare to coal on this metric in 2023?",
    questionApplication:
      "A utility company argues it should keep its coal plant running because it's 'already paid for.' Using LCOE analysis, what economic argument could you make against this position?",
    keyTakeaway:
      "Renewables are now the cheapest source of new electricity generation globally. This is economics, not idealism. Wright's Law suggests costs will continue falling as deployment scales. The remaining challenge is grid integration — storage, transmission, and backup capacity.",
    estimatedMinutes: 5,
  },
  {
    id: "cl-005",
    domain: "climate-literacy",
    conceptName: "Electric Vehicles & Lifecycle Emissions",
    hook: "Electric vehicles emit zero exhaust. But manufacturing an EV battery generates more CO2 than building an equivalent gas car. Does an EV actually reduce emissions? The answer depends on where you live — and it's yes almost everywhere.",
    coreConcept:
      "Lifecycle analysis (LCA) accounts for emissions from manufacturing + fueling + end-of-life. EV manufacturing: battery production generates approximately 7–10 extra tonnes of CO2 compared to a comparable ICE vehicle — the 'carbon debt.' EV operation: no tailpipe emissions, but electric grid carbon intensity matters. On average US grid (2023): EVs emit roughly 50% less lifecycle CO2 than gas cars. In France (90% nuclear): ~80% lower. In coal-heavy regions (Poland, parts of Asia): marginally lower or similar. As grids decarbonize, every EV on the road gets cleaner without any changes to the car itself. Battery recycling is improving: companies like Redwood Materials recover >95% of lithium, cobalt, and nickel. The 'breakeven point' — when an EV recovers its manufacturing carbon debt — is approximately 1–3 years of driving on an average grid.",
    appliedExample:
      "ICCT (2021) study across Europe, US, China, and India: battery EVs emit 66–69% lower lifecycle GHGs in Europe, 60–68% in the US, 37–45% in China, and 19–34% in India over the vehicle's lifetime. The key variable is grid carbon intensity. Tesla's Model 3 manufactured in Shanghai with Chinese grid electricity has higher lifecycle emissions than one manufactured in Nevada — same car, different supply chain carbon footprint. This underscores why grid decarbonization and EV adoption are complementary policies.",
    questionRecall:
      "What is the 'carbon debt' of manufacturing an EV, and what determines how quickly it is repaid?",
    questionApplication:
      "You live in a state where 70% of electricity comes from natural gas. Your neighbor says 'EVs are just coal cars — they just move the emissions to the power plant.' How do you respond with the lifecycle analysis data?",
    keyTakeaway:
      "EVs are lower-lifecycle-emission vehicles in almost every grid context, and they get cleaner as grids decarbonize. The manufacturing carbon debt is real but is repaid within 1–3 years of driving. Grid decarbonization multiplies the climate benefit of every EV on the road.",
    estimatedMinutes: 5,
  },
  {
    id: "cl-006",
    domain: "climate-literacy",
    conceptName: "Methane vs CO2",
    hook: "Methane is 80 times more potent than CO2 as a greenhouse gas over 20 years. It's also the one we can reduce fastest — and cheapest. It's the overlooked lever in climate action.",
    coreConcept:
      "Greenhouse gases are compared using Global Warming Potential (GWP). CO2's GWP = 1 (the baseline). Methane (CH4): GWP = 80 over 20 years, GWP = 28 over 100 years. The difference: methane is more potent but shorter-lived (12-year atmospheric lifetime vs 300–1000 years for CO2). This creates two important implications: (1) Reducing methane has a fast climate payoff — atmospheric methane starts decreasing within years of emission cuts vs CO2 which persists for centuries. (2) The 20-year GWP matters for near-term tipping point risks. Sources: fossil fuels (natural gas leaks, coal mines) account for ~35% of methane emissions; livestock (enteric fermentation — cattle burps and manure) ~30%; landfills and wastewater ~20%; wetlands (natural) ~15%. The Global Methane Pledge (COP26): 150 countries pledged 30% reduction by 2030.",
    appliedExample:
      "Natural gas is marketed as a 'clean' bridge fuel because it produces ~50% less CO2 than coal when burned. But methane leakage from extraction, pipelines, and distribution undermines this advantage: a leakage rate above ~3.2% makes natural gas worse than coal on a 20-year GWP basis. Studies of US natural gas infrastructure find leakage rates of 2.3–3.7% (Alvarez et al., Science, 2018) — right at or above the break-even point. This is the 'methane problem' that makes natural gas expansion environmentally questionable even as a transition fuel.",
    questionRecall:
      "Why is methane's 20-year GWP more relevant than its 100-year GWP for near-term climate policy? What are the three largest sources of methane emissions?",
    questionApplication:
      "An energy company argues that switching from coal to natural gas power plants reduces climate impact by 50% because gas burns cleaner. What is the key piece of information missing from this argument, and how might it change the conclusion?",
    keyTakeaway:
      "Methane is 80x more potent than CO2 over 20 years but is short-lived — cutting it produces fast climate benefits. Fossil fuel methane leaks may undermine natural gas's climate advantage over coal. Reducing methane is one of the fastest available levers for slowing near-term warming.",
    estimatedMinutes: 5,
  },
  {
    id: "cl-007",
    domain: "climate-literacy",
    conceptName: "Ocean Acidification",
    hook: "The ocean has absorbed 30% of all human CO2 emissions — a gift that has saved us from far worse warming. The cost: seawater pH has dropped 0.1 units since the industrial revolution, representing a 26% increase in acidity. Marine life is paying the bill.",
    coreConcept:
      "When CO2 dissolves in seawater, it forms carbonic acid (H2CO3), which dissociates into bicarbonate and hydrogen ions — the H+ ions are what make water acidic. Pre-industrial ocean pH: ~8.2. Current: ~8.1. Projected by 2100 (high emissions): ~7.8. The pH scale is logarithmic: each 0.1-unit drop represents ~26% more acidic. The primary biological impact is on calcification: marine organisms (corals, oysters, clams, pteropods, some plankton) build shells and skeletons from calcium carbonate. As water becomes more acidic, carbonate ions decrease, making it harder (and then impossible) to build shells — shells can actually dissolve in acidic water. Coral bleaching is temperature-driven; coral dissolution is acidity-driven — reefs face a double threat. Pteropods (zooplankton) are a primary food source for salmon, herring, and whales — their dissolution disrupts the entire food web.",
    appliedExample:
      "The Pacific Northwest oyster industry lost 80% of its hatchery production in 2008 when abnormally acidic water upwelled along the coast — one of the first economic casualties of ocean acidification. NOAA research in the Southern Ocean found pteropod shells dissolving in real-time in water that is already below the aragonite saturation threshold. The Great Barrier Reef has bleached four times since 2016 (1998, 2002, 2016, 2017, 2020, 2022) — bleaching used to occur every 25–30 years. At 2°C warming, 99% of coral reefs are projected to experience annual bleaching.",
    questionRecall:
      "What chemical process causes ocean acidification, and why is the 0.1-unit pH drop more significant than it sounds?",
    questionApplication:
      "A friend says 'Marine life has survived pH changes before over millions of years, so this is nothing new.' How do you respond using what you know about the rate of change and its biological significance?",
    keyTakeaway:
      "Ocean acidification is the direct chemical consequence of CO2 absorption — separate from warming. The threat to calcifying organisms (corals, shellfish, plankton) has cascading effects on marine food webs. The rate of change matters as much as the magnitude — evolutionary adaptation requires thousands of generations, not decades.",
    estimatedMinutes: 5,
  },
  {
    id: "cl-008",
    domain: "climate-literacy",
    conceptName: "Climate Justice",
    hook: "The countries least responsible for historical emissions are experiencing the most severe climate impacts. Bangladesh contributes 0.47% of global emissions and faces losing 17% of its land area to sea level rise. This is the defining injustice of the 21st century.",
    coreConcept:
      "Climate justice examines climate change through the lens of equity and human rights. Key dimensions: Historical Responsibility: the US has emitted more cumulative CO2 than any other country (~25% of total). Sub-Saharan Africa has emitted less than 4% collectively. Who bears consequences bears no relationship to who caused the problem. Frontline Communities: within wealthy nations, low-income communities and communities of color bear disproportionate exposure to climate impacts — coastal flooding, extreme heat, air pollution from fossil fuel infrastructure. Loss and Damage: a UNFCCC mechanism recognizing that some climate impacts (lost land, cultures, livelihoods) cannot be adapted to — they must be compensated. At COP28 (2023), a Loss and Damage Fund was formally established. Adaptation Finance: wealthy nations pledged $100B/year by 2020 for developing countries — target was not met until 2022.",
    appliedExample:
      "Kiribati is a Pacific island nation of 119,000 people contributing negligible GHG emissions. Its highest point is 2 meters above sea level. At current warming trajectories, it will be uninhabitable by 2050–2100. The government is pre-emptively purchasing land in Fiji and training citizens for migration. The Marshall Islands is negotiating to maintain statehood even as its physical territory disappears. The Inuit Circumpolar Council submitted a petition to the Inter-American Commission on Human Rights in 2005, arguing US emissions violated Inuit human rights — a landmark legal framing of climate as a human rights issue.",
    questionRecall:
      "What is 'Loss and Damage' in climate negotiations, and why is it distinct from adaptation finance?",
    questionApplication:
      "A wealthy country argues it shouldn't pay into the Loss and Damage Fund because it has already reduced its own emissions significantly. Using the principle of historical responsibility, construct the counterargument.",
    keyTakeaway:
      "Climate impact and climate responsibility are inversely distributed globally. Those least responsible for emissions face the worst consequences. Climate justice — centering frontline communities and historical accountability — is inseparable from effective climate policy.",
    estimatedMinutes: 5,
  },
  {
    id: "cl-009",
    domain: "climate-literacy",
    conceptName: "Individual vs System Change",
    hook: "The concept of the 'personal carbon footprint' was popularized by a BP advertising campaign in 2004. The world's largest oil company invented the framework that made you responsible for climate change. That's worth knowing.",
    coreConcept:
      "In 2004, BP launched a carbon footprint calculator and advertising campaign shifting climate responsibility from corporations to individuals. This framing is not false — individual choices do matter — but it is strategically incomplete. Scale analysis: the 100 largest corporations are responsible for 71% of global emissions (CDP, 2017). The highest-impact individual actions (having one fewer child, living car-free, avoiding transatlantic flights) are not in the standard 'turn off the lights' advice. Researchers Wynes & Nicholas (2017, Environmental Research Letters) ranked personal actions by actual CO2 impact: highest — living car-free (2.4t/year), avoiding one transatlantic flight (1.6t), plant-based diet (0.8t); lowest — recycling (0.2t), line-drying clothes (0.07t), switching light bulbs (0.1t). Political action (voting, advocacy, supporting climate policy) has leverage orders of magnitude beyond personal consumption — a law that raises fuel efficiency standards saves more CO2 than millions of individual vehicle choices.",
    appliedExample:
      "The psychological danger of 'personal responsibility' framing: it creates moral licensing (I recycled, so I can fly) and despair (my actions are too small to matter). The more accurate framing: individual high-impact choices matter AND systemic change is where the multiplier is. Flying less matters (it's one of the highest per-person impacts). Voting for carbon pricing matters more (it changes the economics for millions). Shareholder activism matters (divesting public universities from fossil fuels shifts capital markets). Both/and, not either/or.",
    questionRecall:
      "Which three individual actions have the highest actual CO2 impact according to Wynes & Nicholas (2017)? Which common actions are surprisingly low-impact?",
    questionApplication:
      "A colleague says 'I use a metal straw and compost, so I'm doing my part.' Using what you know about carbon footprint magnitude and system change, how do you respond constructively — neither dismissing their efforts nor leaving them satisfied with low-impact actions?",
    keyTakeaway:
      "Individual action matters — focus on high-impact choices (diet, flights, car). But systemic change (policy, corporate accountability, collective action) operates at multiplied scale. The 'personal carbon footprint' framing was designed to shift responsibility from industry to individuals. Understand the origin of the frame.",
    estimatedMinutes: 5,
  },
  {
    id: "cl-010",
    domain: "climate-literacy",
    conceptName: "Energy Transition Speed",
    hook: "Everyone says the energy transition must happen faster than any in history. But history shows that energy transitions are slow — coal took 70 years to go from 5% to 50% of global energy. Is 2050 net zero actually achievable?",
    coreConcept:
      "Historical energy transitions are slow at system scale. Vaclav Smil's energy transition research: every major energy transition (wood to coal, coal to oil) took 50–70 years to reach 25% of the global energy mix. However: technology diffusion is accelerating. Solar and wind are following S-curves faster than any previous energy technology. Key insight: S-curves start slow, then accelerate explosively. Solar is past the inflection point in many markets. The current transition has three differences from historical ones: (1) It must be deliberate and policy-driven, not market-organic. (2) It spans all sectors simultaneously (electricity, transport, buildings, industry, agriculture) vs historical transitions which were electricity-sector dominant. (3) The legacy infrastructure is vast — $1 trillion in stranded fossil fuel assets. Speed factors: policy (IRA in US, Green Deal in EU), cost (renewables cheapest ever), security (energy independence motivation post-Ukraine), technology maturity.",
    appliedExample:
      "Denmark went from 5% to 50% wind electricity in 25 years — faster than any historical transition at national scale. Germany's Energiewende: renewables grew from 5% to 46% of electricity in 20 years. China installed more solar in 2023 alone than the US has installed in its entire history. The IEA's Net Zero by 2050 scenario (2021) projects no new fossil fuel development needed from 2021. The IPCC's 1.5°C scenarios all show electricity sector decarbonization by 2035–2040 in wealthy nations. Key bottleneck: electricity is only 20% of final energy. Decarbonizing heat, industrial processes, and aviation is far harder than decarbonizing power.",
    questionRecall:
      "Why do historical energy transitions suggest 2050 net zero is difficult? What factors make the current transition different from historical precedents?",
    questionApplication:
      "An investor says 'Energy transitions always take 70 years — we can't hit 2050 net zero, so I'm investing in fossil fuels for the long term.' What is the strongest argument that the historical analogy may not hold for the current transition?",
    keyTakeaway:
      "Historical transitions were slow and organic. The current one is faster, policy-driven, and technologically mature in electricity — but electricity is only 20% of final energy. Industrial, aviation, and heat decarbonization are the hard remaining problems. Speed is increasing but the challenge is larger than electricity alone.",
    estimatedMinutes: 5,
  },
];

export function getLessonById(id: string): Lesson | undefined {
  return LESSONS.find((l) => l.id === id);
}

export function getLessonsByDomain(domain: string): Lesson[] {
  return LESSONS.filter((l) => l.domain === domain);
}

export function searchLessons(query: string, domain?: string): Lesson[] {
  const q = query.toLowerCase();
  let pool = domain ? getLessonsByDomain(domain) : LESSONS;
  return pool.filter(
    (l) =>
      l.conceptName.toLowerCase().includes(q) ||
      l.hook.toLowerCase().includes(q) ||
      l.coreConcept.toLowerCase().includes(q) ||
      l.keyTakeaway.toLowerCase().includes(q)
  );
}
