
import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const getFinancialInsight = async (balance: number) => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `O usuário tem um saldo de R$ ${balance.toFixed(2)}. Dê uma dica financeira curta e amigável (em português) no estilo Nubank (direto ao ponto, jovem e prestativo). Máximo 15 palavras.`,
      config: {
        temperature: 0.7,
        topP: 0.9,
      }
    });
    return response.text || "Continue cuidando bem do seu dinheiro!";
  } catch (error) {
    console.error("Gemini Error:", error);
    return "Mantenha o controle das suas finanças com sabedoria.";
  }
};
