export function useVoiceAPI() {
  const speakPremium = async (text: string) => {
    try {
      // Placeholder for future API call
      console.log("Premium TTS:", text);

      // Later replace with ElevenLabs/OpenAI API
    } catch (e) {
      console.error(e);
    }
  };

  return { speakPremium };
}
