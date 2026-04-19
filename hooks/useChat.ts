const updateLastMessage = (content: string) => {
  setChats(prev =>
    prev.map(chat => {
      if (chat.id !== activeId) return chat;

      const updated = [...chat.messages];
      updated[updated.length - 1] = {
        role: "assistant",
        content
      };

      return { ...chat, messages: updated };
    })
  );
};
