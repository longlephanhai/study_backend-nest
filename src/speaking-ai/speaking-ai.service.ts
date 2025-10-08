import { Injectable } from '@nestjs/common';
import { OpenAI } from 'openai';
import * as textToSpeech from '@google-cloud/text-to-speech';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class SpeakingAiService {
  private openai: OpenAI;
  private ttsClient: textToSpeech.TextToSpeechClient;
  private apiKey: string;

  private conversationHistory: { role: 'system' | 'user' | 'assistant'; content: string }[] = [];

  constructor(private configService: ConfigService) {
    this.apiKey = this.configService.get<string>('OPENAI_API_KEY')!;
    this.openai = new OpenAI({ apiKey: this.apiKey });
    this.ttsClient = new textToSpeech.TextToSpeechClient();
  }

  async startConversation(topic: string): Promise<string> {
    if (!topic) return 'Please provide a topic so we can begin our conversation.';
    this.conversationHistory = [
      {
        role: 'system',
        content: `
You are an English speaking coach helping a learner practice conversation on the topic "${topic}".
Your goal is to guide them step-by-step.

1. Start by asking one very simple question about this topic (e.g., yes/no or short answer).  
2. Wait for their reply, then ask a slightly more complex question related to the same topic.  
3. Continue asking deeper or more detailed questions each time — gradually increasing difficulty.  
4. Always ask only ONE question at a time.  
5. Correct grammar or vocabulary gently when needed and give a better way to say it.  
6. Encourage natural conversation — keep it engaging and friendly.  
7. Never mention that you are an AI. Speak as a real human teacher.
`
      }
    ];


    const response = await this.openai.chat.completions.create({
      model: 'gpt-4',
      messages: this.conversationHistory,
      max_tokens: 50,
    });

    const message = response.choices?.[0]?.message?.content?.trim() || 'Let’s start our conversation!';
    this.conversationHistory.push({ role: 'assistant', content: message });
    return message;
  }

  async getChatGptResponse(text: string): Promise<string> {
    this.conversationHistory.push({ role: 'user', content: text });

    const response = await this.openai.chat.completions.create({
      model: 'gpt-4',
      messages: this.conversationHistory,
      max_tokens: 60,
    });

    const message = response.choices?.[0]?.message?.content?.trim();
    if (!message) throw new Error('No valid response from GPT');

    this.conversationHistory.push({ role: 'assistant', content: message });
    return message;
  }

  async convertTextToSpeech(text: string): Promise<Buffer> {
    const [response] = await this.ttsClient.synthesizeSpeech({
      input: { text },
      voice: { languageCode: 'en-US', ssmlGender: 'NEUTRAL' },
      audioConfig: { audioEncoding: 'MP3' },
    });
    if (!Buffer.isBuffer(response.audioContent)) {
      throw new Error('Invalid audio content');
    }
    return response.audioContent;
  }
}
