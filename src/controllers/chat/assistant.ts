import { ChatGoogleGenerativeAI } from '@langchain/google-genai';
import { z } from 'zod';

export default async (req: IReq, res: IRes) => {
  const schema = z.object({
    chat: z.array(z.array(z.string()).min(2).max(2)).default([]),
    message: z.string().optional(),
  });

  const value = schema.safeParse(req.body);

  if (!value.success) {
    return res.status(400).json({
      errors: value.error.errors,
      message: 'Invalid data',
    });
  }

  if (!req.user?.isPremium) {
    return res.status(403).json({
      message: 'You need to be a premium user to access this feature',
    });
  }

  value.data.chat.unshift([
    'system',
    `My name is ${req.user.firstName} ${req.user.lastName}. I am a ${req.user.pricePerMonth ? 'Mentor' : 'Mentee'} at ConnectWise. This is my bio - \`${req.user.bio}\` You will act as my virtual assistant. I will ask you questions and you will provide me with the answers. Please, don't ask questions about my personal info. Let's start by Greeting!`,
  ]);

  if (value.data.chat.length > 1 && value.data.message?.length > 1) {
    value.data.chat.push(['human', value.data.message]);
  }

  if (value.data.chat.length > 1 && !value.data.message) {
    return res.status(400).json({
      message: 'Please provide a message',
    });
  }

  const model = new ChatGoogleGenerativeAI({
    model: 'gemini-1.5-flash',
    maxOutputTokens: 2048,
  });

  if (value.data.message) {
    value.data.chat.push(['human', value.data.message]);
  }

  // Batch and stream are also supported
  const data = await model.invoke(value.data.chat as [string, string][]);

  return res.send({
    content: data.content,
  });
};
