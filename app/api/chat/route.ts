import { NextResponse } from "next/server";
import pdfParse from "pdf-parse";

export const runtime = "nodejs";

// =============================
// TYPES
// =============================

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

type UploadedFile = {
  name: string;
  type: string;
  size: number;
};

// =============================
// MEMORY
// =============================

const chatMemory = new Map<
  string,
  ChatMessage[]
>();

const longMemory = new Map<
  string,
  UserMemory
>();

// =============================
// SYSTEM PROMPT
// =============================

const SYSTEM_PROMPT = `
You are Thinksy Ultra.

You are the world's most advanced futuristic AI assistant.

PERSONALITY:
- intelligent
- emotionally aware
- premium
- modern
- futuristic
- natural
- human-like
- highly analytical
- fast
- visually formatted

BEHAVIOR:
- remember long conversations
- understand emotions
- adapt to the user's tone
- speak naturally
- avoid robotic responses
- think deeply
- explain clearly

FORMATTING:
- always use markdown
- use headings
- use bold text
- use tables
- use bullet points
- use emojis only when useful
- use code blocks
- use spacing beautifully
- make answers visually premium

CODING:
- production-grade code
- optimized
- secure
- modern
- scalable
- use TypeScript best practices

IMAGE ANALYSIS:
- analyze uploaded images carefully
- describe images
- detect objects
- detect UI issues
- understand screenshots
- understand diagrams

PDF ANALYSIS:
- summarize PDFs
- extract important concepts
- explain clearly

MEMORY:
You remember:
- user preferences
- projects
- personality
- coding style
- interests
- goals

STYLE:
Modern premium AI assistant.
`;

// =============================
// MEMORY EXTRACTION
// =============================

function extractMemory(
  text: string,
  memory: UserMemory
) {
  const lower = text.toLowerCase();

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
    lower.includes("my name") ||
    lower.includes("i am")
  ) {
    updated.facts.push(text);
  }

  return updated;
}

function buildMemoryPrompt(
  memory: UserMemory
) {
  return `
KNOWN USER MEMORY

Preferences:
${memory.preferences.join("\n")}

Projects:
${memory.projects.join("\n")}

Facts:
${memory.facts.join("\n")}
`;
}

// =============================
// FILE PROCESSOR
// =============================

async function processFiles(
  files: File[]
) {
  let extractedText = "";

  const uploadedFiles: UploadedFile[] =
    [];

  for (const file of files) {
    uploadedFiles.push({
      name: file.name,
      type: file.type,
      size: file.size,
    });

    // =========================
    // IMAGES
    // =========================

    if (
      file.type.startsWith("image/")
    ) {
      const buffer = Buffer.from(
        await file.arrayBuffer()
      );

      const base64 =
        buffer.toString("base64");

      extractedText += `

USER UPLOADED IMAGE:
Name: ${file.name}

IMAGE DATA:
data:${file.type};base64,${base64}

`;
    }

    // =========================
    // PDF
    // =========================

    else if (
      file.type ===
      "application/pdf"
    ) {
      const buffer = Buffer.from(
        await file.arrayBuffer()
      );

      const pdf =
        await pdfParse(buffer);

      extractedText += `

PDF FILE: ${file.name}

PDF CONTENT:
${pdf.text}

`;
    }

    // =========================
    // TEXT
    // =========================

    else if (
      file.type.includes("text") ||
      file.name.endsWith(".txt")
    ) {
      const text =
        await file.text();

      extractedText += `

TEXT FILE: ${file.name}

${text}

`;
    }
  }

  return {
    extractedText,
    uploadedFiles,
  };
}

// =============================
// MAIN ROUTE
// =============================

export async function POST(
  req: Request
) {
  try {
    const formData =
      await req.formData();

    const message =
      formData
        .get("message")
        ?.toString() || "";

    const chatId =
      formData
        .get("chatId")
        ?.toString() || "default";

    const userId =
      formData
        .get("userId")
        ?.toString() || "guest";

    const files =
      formData.getAll(
        "files"
      ) as File[];

    if (!message && files.length === 0) {
      return NextResponse.json({
        reply:
          "Please send a message or file.",
      });
    }

    // =========================
    // MEMORY
    // =========================

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

    // =========================
    // FILES
    // =========================

    const {
      extractedText,
      uploadedFiles,
    } = await processFiles(files);

    // =========================
    // FINAL USER MESSAGE
    // =========================

    const finalUserMessage = `
USER MESSAGE:
${message}

UPLOADED FILES:
${JSON.stringify(
  uploadedFiles,
  null,
  2
)}

EXTRACTED CONTENT:
${extractedText}
`;

    // =========================
    // AI MESSAGES
    // =========================

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
        content: finalUserMessage,
      },
    ];

    // =========================
    // OPENROUTER REQUEST
    // =========================

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
            "meta-llama/llama-3.3-70b-instruct:free",

          messages,

          temperature: 0.7,

          top_p: 0.95,

          max_tokens: 4000,
        }),
      }
    );

    const data =
      await response.json();

    // =========================
    // ERROR
    // =========================

    if (data.error) {
      return NextResponse.json({
        reply:
          "API Error: " +
          data.error.message,
      });
    }

    // =========================
    // AI RESPONSE
    // =========================

    const reply =
      data.choices?.[0]?.message
        ?.content ||
      "No response generated.";

    // =========================
    // SAVE CHAT
    // =========================

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

    // =========================
    // RETURN
    // =========================

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
