/**
 * YouTube Script Writer - Backend API Server
 * Handles AI-powered content generation for YouTube creators
 */

require("dotenv").config();
const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
const Anthropic = require("@anthropic-ai/sdk");

const app = express();
const PORT = process.env.PORT || 3001;

// ─── Security & Middleware ────────────────────────────────────────────────────
app.use(helmet());
app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:5173",
    methods: ["GET", "POST"],
    allowedHeaders: ["Content-Type"],
  })
);
app.use(express.json({ limit: "10kb" }));

// Rate limiting: 30 requests per 15 minutes per IP
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 30,
  message: { error: "Too many requests. Please try again in 15 minutes." },
});
app.use("/api/", limiter);

// ─── Anthropic Client ─────────────────────────────────────────────────────────
const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

// ─── Prompt Templates ─────────────────────────────────────────────────────────
const SYSTEM_PROMPTS = {
  horror: `You are a master horror script writer for YouTube with a gift for atmospheric storytelling.
Your scripts create genuine dread through building tension, psychological horror, and vivid imagery.
Structure all scripts with: [HOOK], [SETUP], [RISING TENSION], [CLIMAX], [TWIST/RESOLUTION].
Use second-person narration ("you") to immerse viewers. Include director's notes in [brackets].
Format output with clear scene breaks and pacing cues. Aim for scripts that feel cinematic and original.`,

  educational: `You are an expert educational content creator for YouTube with a talent for making complex topics accessible.
Your scripts follow proven pedagogical frameworks: hook → context → core content → examples → summary → CTA.
Structure all scripts with: [HOOK], [LEARNING OBJECTIVES], [MAIN CONTENT with numbered sections], [KEY TAKEAWAYS], [CALL TO ACTION].
Use clear language, memorable analogies, and concrete examples. Include timestamps suggestions.
Make content engaging without sacrificing accuracy. Always end with a strong subscriber CTA.`,

  shorts: `You are a viral short-form video script specialist for YouTube Shorts, TikTok, and Reels.
You understand the first 1-3 seconds are everything. Every word must earn its place.
Structure all scripts with: [HOOK - 0-3s], [VALUE/STORY - 3-45s], [PUNCHLINE/CTA - final 5s].
Write for spoken delivery with natural rhythm. Include visual direction notes. Keep total runtime 15-60 seconds.
Think in patterns: "Did you know...", "Here's why...", "The secret to...", reveal formats, satisfying loops.`,

  hooks: `You are a YouTube optimization specialist who crafts irresistible hooks and titles.
You understand psychology: curiosity gaps, FOMO, specific numbers, emotional triggers, and pattern interrupts.
For hooks: write 3-5 variations (curiosity, shock, story, promise, question formats). Each 1-2 sentences max.
For titles: follow formulas like "[Number] [Adjective] [Topic] That [Benefit]", "Why [Surprising Claim]", "The [Secret/Truth] About [Topic]".
Always justify why each hook/title works psychologically. Include power words and CTR optimization tips.`,

  seo: `You are a YouTube SEO expert and metadata strategist with deep knowledge of the algorithm.
You craft descriptions that rank in search, satisfy viewers, and drive channel growth.
Structure all descriptions with: [OPENING HOOK - first 2-3 lines visible before "Show More"], [VIDEO SUMMARY], [TIMESTAMPS], [RESOURCES/LINKS section], [ABOUT CHANNEL], [HASHTAGS].
Research and include: primary keyword (natural placement), LSI keywords, long-tail variations, relevant hashtags (3-5), call-to-subscribe, and social links placeholders.
Optimize for both YouTube search and Google video results. Aim for 200-500 words total.`,
};

const buildUserPrompt = (mode, params) => {
  const { topic, tone, length, keywords, targetAudience, additionalContext } =
    params;

  const baseInfo = `
Topic: ${topic}
${tone ? `Tone/Style: ${tone}` : ""}
${length ? `Target Length: ${length}` : ""}
${keywords ? `Keywords to include: ${keywords}` : ""}
${targetAudience ? `Target Audience: ${targetAudience}` : ""}
${additionalContext ? `Additional Context: ${additionalContext}` : ""}
`.trim();

  const modeInstructions = {
    horror: `Write a complete horror script for YouTube about the topic below. Make it gripping from the first sentence. Use vivid, atmospheric language that paints pictures in the viewer's mind.\n\n${baseInfo}`,
    educational: `Write a complete educational YouTube script about the topic below. Make it informative, engaging, and structured for maximum retention.\n\n${baseInfo}`,
    shorts: `Write a complete YouTube Shorts script about the topic below. Optimize for maximum engagement in under 60 seconds. Every second counts.\n\n${baseInfo}`,
    hooks: `Generate compelling hooks and title variations for a YouTube video about the topic below. Include psychological reasoning for each.\n\n${baseInfo}`,
    seo: `Write a complete YouTube SEO description for a video about the topic below. Optimize for discoverability and click-through.\n\n${baseInfo}`,
  };

  return modeInstructions[mode];
};

// ─── Input Validation ─────────────────────────────────────────────────────────
const validateInput = (body) => {
  const { mode, topic } = body;
  const validModes = ["horror", "educational", "shorts", "hooks", "seo"];

  if (!mode || !validModes.includes(mode)) {
    return "Invalid mode. Must be one of: horror, educational, shorts, hooks, seo";
  }
  if (!topic || typeof topic !== "string" || topic.trim().length < 3) {
    return "Topic is required and must be at least 3 characters";
  }
  if (topic.length > 500) {
    return "Topic must be under 500 characters";
  }
  return null;
};

// ─── Routes ───────────────────────────────────────────────────────────────────

// Health check
app.get("/api/health", (req, res) => {
  res.json({
    status: "ok",
    message: "YouTube Script Writer API is running",
    timestamp: new Date().toISOString(),
  });
});

// Main content generation endpoint
app.post("/api/generate", async (req, res) => {
  const validationError = validateInput(req.body);
  if (validationError) {
    return res.status(400).json({ error: validationError });
  }

  const { mode, topic, tone, length, keywords, targetAudience, additionalContext } = req.body;

  try {
    const message = await anthropic.messages.create({
      model: "claude-sonnet-4-20250514",
      max_tokens: 2048,
      system: SYSTEM_PROMPTS[mode],
      messages: [
        {
          role: "user",
          content: buildUserPrompt(mode, {
            topic,
            tone,
            length,
            keywords,
            targetAudience,
            additionalContext,
          }),
        },
      ],
    });

    const content = message.content[0]?.text || "";

    res.json({
      success: true,
      mode,
      topic,
      content,
      usage: {
        inputTokens: message.usage.input_tokens,
        outputTokens: message.usage.output_tokens,
      },
      generatedAt: new Date().toISOString(),
    });
  } catch (err) {
    console.error("Generation error:", err.message);

    if (err.status === 401) {
      return res.status(500).json({ error: "API authentication failed. Check your API key." });
    }
    if (err.status === 429) {
      return res.status(429).json({ error: "AI service rate limit reached. Please wait a moment." });
    }

    res.status(500).json({ error: "Failed to generate content. Please try again." });
  }
});

// Streaming endpoint for real-time output
app.post("/api/generate/stream", async (req, res) => {
  const validationError = validateInput(req.body);
  if (validationError) {
    return res.status(400).json({ error: validationError });
  }

  const { mode, topic, tone, length, keywords, targetAudience, additionalContext } = req.body;

  res.setHeader("Content-Type", "text/event-stream");
  res.setHeader("Cache-Control", "no-cache");
  res.setHeader("Connection", "keep-alive");
  res.setHeader("Access-Control-Allow-Origin", process.env.FRONTEND_URL || "http://localhost:5173");

  try {
    const stream = await anthropic.messages.stream({
      model: "claude-sonnet-4-20250514",
      max_tokens: 2048,
      system: SYSTEM_PROMPTS[mode],
      messages: [
        {
          role: "user",
          content: buildUserPrompt(mode, { topic, tone, length, keywords, targetAudience, additionalContext }),
        },
      ],
    });

    for await (const chunk of stream) {
      if (chunk.type === "content_block_delta" && chunk.delta.type === "text_delta") {
        res.write(`data: ${JSON.stringify({ text: chunk.delta.text })}\n\n`);
      }
    }

    const finalMessage = await stream.finalMessage();
    res.write(`data: ${JSON.stringify({ done: true, usage: finalMessage.usage })}\n\n`);
    res.end();
  } catch (err) {
    console.error("Stream error:", err.message);
    res.write(`data: ${JSON.stringify({ error: "Stream failed. Please try again." })}\n\n`);
    res.end();
  }
});

// ─── Start Server ─────────────────────────────────────────────────────────────
app.listen(PORT, () => {
  console.log(`\n🎬 YouTube Script Writer API`);
  console.log(`📡 Server running at http://localhost:${PORT}`);
  console.log(`🔑 API Key: ${process.env.ANTHROPIC_API_KEY ? "✓ Configured" : "✗ MISSING"}\n`);
});
