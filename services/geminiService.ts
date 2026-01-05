import { GoogleGenAI } from "@google/genai";
import { Trade, TraderProfile } from "../types";

// Always initialize the client using a direct reference to process.env.API_KEY.
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const getAIInsights = async (trades: Trade[], profile: TraderProfile) => {
  if (trades.length === 0) return "Registre alguns trades para que eu possa analisar sua performance!";

  const prompt = `
    Como um mentor de trading profissional e analista estatístico, analise o seguinte histórico de trades e o perfil do trader.
    
    Perfil:
    - Capital Inicial: $${profile.initialCapital}
    - Risco Máximo por Trade: ${profile.maxTradeRisk}%
    
    Histórico de Trades (últimos 50):
    ${JSON.stringify(trades.slice(-50), null, 2)}
    
    Sua tarefa:
    1. Identificar padrões de erro recorrentes (técnicos ou psicológicos).
    2. Identificar os setups e horários mais lucrativos.
    3. Alertar sobre overtrading ou quebra de gerenciamento de risco.
    4. Fornecer 3 recomendações práticas de ajuste no plano de trade.
    
    Formate sua resposta em Markdown profissional, direto ao ponto e altamente analítico.
  `;

  try {
    const response = await ai.models.generateContent({
      // Use 'gemini-3-pro-preview' for complex text analysis tasks as per guidelines.
      model: "gemini-3-pro-preview",
      contents: prompt,
      config: {
        temperature: 0.7,
        topP: 0.95,
      },
    });

    // Directly access the .text property from the GenerateContentResponse object.
    return response.text || "Não foi possível gerar a análise no momento.";
  } catch (error) {
    console.error("AI Analysis Error:", error);
    return "Erro ao conectar com o analista de IA. Verifique sua conexão.";
  }
};