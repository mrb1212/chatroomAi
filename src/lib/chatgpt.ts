import { ChatMessage } from '../types';
import { useNotificationStore } from '../store/notificationStore';

const OPENAI_API_KEY = import.meta.env.VITE_OPENAI_API_KEY;
const API_URL = 'https://api.openai.com/v1/chat/completions';

const legalPrompts = {
  contract: `As an Iranian legal expert, help draft a contract following these guidelines:
1. Use formal Persian legal language
2. Include all required legal clauses
3. Reference relevant Iranian civil code articles
4. Ensure compliance with current laws
5. Include proper signature and witness sections`,
  
  consultation: `Provide legal consultation following these guidelines:
1. Reference specific Iranian laws and regulations
2. Explain legal concepts in simple Persian
3. Provide practical next steps
4. Recommend when to seek in-person legal counsel
5. Include relevant case precedents if applicable`,
  
  document: `Help prepare legal documents following these guidelines:
1. Use official Persian legal terminology
2. Follow proper document structure
3. Include all required sections
4. Ensure compliance with Iranian law
5. Provide filing instructions if applicable`,
};

const systemPrompt = `You are a knowledgeable Iranian legal advisor. Respond in Persian (Farsi) and:
1. Provide accurate legal advice based on Iranian law
2. Cite relevant legal codes and precedents
3. Explain complex legal concepts in simple terms
4. Maintain professional and formal language
5. When unsure, recommend consulting with a lawyer
6. Do not provide advice on sensitive political matters
7. Focus on practical legal solutions and guidance
8. Reference specific Iranian legal codes when applicable
9. Explain the legal process and next steps clearly
10. Maintain confidentiality and professional ethics`;

export async function getChatGPTResponse(messages: ChatMessage[], type?: keyof typeof legalPrompts): Promise<string> {
  if (!OPENAI_API_KEY) {
    throw new Error('کلید API تنظیم نشده است');
  }

  const conversation = [
    { role: 'system', content: type ? legalPrompts[type] + '\n' + systemPrompt : systemPrompt },
    ...messages.map(msg => ({
      role: msg.role,
      content: msg.content
    }))
  ];

  try {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${OPENAI_API_KEY}`,
        'Origin': window.location.origin
      },
      credentials: 'same-origin',
      body: JSON.stringify({
        model: 'gpt-4',
        messages: conversation,
        temperature: 0.7,
        max_tokens: 1000,
        top_p: 0.9,
        frequency_penalty: 0.5,
        presence_penalty: 0.5
      })
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error?.message || 'خطا در دریافت پاسخ از ChatGPT');
    }

    const data = await response.json();
    return data.choices[0].message.content;
  } catch (error) {
    console.error('ChatGPT API error:', error);
    const { addNotification } = useNotificationStore.getState();
    addNotification('خطا در برقراری ارتباط با سرور. لطفاً دوباره تلاش کنید.', 'error');
    throw error;
  }
}