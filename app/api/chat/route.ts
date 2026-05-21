import { NextResponse } from "next/server";

type Role =
  | "system"
  | "user"
  | "assistant";

type ChatMessage = {
  role: Role;
  content: string;
};

type UserMemory = {
  personality: string[];
  preferences: string[];
  projects: string[];
  facts: string[];
};

const chatMemory = new Map<
  string,
  ChatMessage[]
>();

const longMemory = new Map<
  string,
  UserMemory
>();

const SYSTEM_PROMPT = `
You are Thinksy Ultra.

You are an advanced futuristic AI assistant.

PERSONALITY:
- intelligent
- fast
- emotionally aware
- natural
- human-like
- highly analytical
- premium
- modern

CORE RULES:
- remember conversation context
- continue naturally
- never forget ongoing topics
- be concise when needed
- be detailed for studying/coding
- always format beautifully
- use markdown
- use bullet points
- use headings
- use code blocks
- use LaTeX formatting
- never sound robotic
- adapt to user psychology
- detect emotional tone
- act highly intelligent

CODING RULES:
- always use production-grade code
- explain clearly
- format perfectly
- optimize performance
- think step-by-step internally

STUDY RULES:
- explain concepts simply
- use examples
- use formulas
- use tables when useful

MEMORY:
You remember:
- user personality
- user goals
- projects
- preferences
- recurring interests
- coding style
- emotional patterns

STYLE:
Modern premium AI.
`;

function extractMemory(
  text: string,
  memory: UserMemory
) {
  const lower = text.toLowerCase();

  const patterns = [
    "i like",
    "i love",
    "my project",
    "i am building",
    "my app",
    "remember that",
    "i prefer",
    "my name is",
    "i want",
    "i hate",
  ];

  const important = patterns.some(
    (p) => lower.includes(p)
  );

  if (!important) return memory;

  const updated = {
    personality: [
      ...memory.personality,
    ],
    preferences: [
      ...memory.preferences,
    ],
    projects: [...memory.projects],
    facts: [...memory.facts],
  };

  if (
    lower.includes("i like") ||
    lower.includes("i love")
  ) {
    updated.preferences.push(text);
  }

  if (
    lower.includes("project") ||
    lower.includes("building") ||
    lower.includes("app")
  ) {
    updated.projects.push(text);
  }

  if (
    lower.includes("i am") ||
    lower.includes("my name")
  ) {
    updated.facts.push(text);
  }

  return updated;
}

function buildMemoryPrompt(
  memory: UserMemory
) {
  return `
KNOWN USER MEMORY:

Personality:
${memory.personality.join("\n")}

Preferences:
${memory.preferences.join("\n")}

Projects:
${memory.projects.join("\n")}

Facts:
${memory.facts.join("\n")}
`;
}

export async function POST(
  req: Request
) {
  try {
    const body = await req.json();

    const {
      message,
      chatId = "default",
      userId = "guest",
    } = body;

    if (!message) {
      return NextResponse.json({
        reply: "No message.",
      });
    }

    const previous =
      chatMemory.get(chatId) || [];

    const memory =
      longMemory.get(userId) || {
        personality: [],
        preferences: [],
        projects: [],
        facts: [],
      };

    const updatedMemory =
      extractMemory(
        message,
        memory
      );

    longMemory.set(
      userId,
      updatedMemory
    );

    const memoryPrompt =
      buildMemoryPrompt(
        updatedMemory
      );

    const messages: ChatMessage[] = [
      {
        role: "system",
        content:
          SYSTEM_PROMPT +
          "\n\n" +
          memoryPrompt,
      },

      ...previous.slice(-20),

      {
        role: "user",
        content: message,
      },
    ];

    const response = await fetch(
      "https://openrouter.ai/api/v1/chat/completions",
      {
        method: "POST",

        headers: {
          Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
          "Content-Type":
            "application/json",
          "HTTP-Referer":
            "https://thinksyultra.vercel.app",
          "X-Title":
            "Thinksy Ultra",
        },

        body: JSON.stringify({
          model:
            "openrouter/free",

          messages,

          temperature: 0.7,

          top_p: 0.95,

          max_tokens: 2500,
        }),
      }
    );

    const data =
      await response.json();

    if (data.error) {
      return NextResponse.json({
        reply:
          "API Error: " +
          data.error.message,
      });
    }

    const reply =
      data.choices?.[0]?.message
        ?.content ||
      "No response generated.";

    const updatedChat: ChatMessage[] =
      [
        ...previous,

        {
          role: "user",
          content: message,
        },

        {
          role: "assistant",
          content: reply,
        },
      ];

    chatMemory.set(
      chatId,
      updatedChat.slice(-40)
    );

    return NextResponse.json({
      reply,
    });
  } catch (error) {
    console.log(error);

    return NextResponse.json({
      reply:
        "Server error occurred.",
    });
  }
}
