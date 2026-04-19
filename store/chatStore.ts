export type Message = {
  role: "user" | "assistant";
  content: string;
};

export type Chat = {
  id: string;
  title: string;
  messages: Message[];
};

export function createNewChat(): Chat {
  return {
    id: Date.now().toString(),
    title: "New Chat",
    messages: [],
  };
}
