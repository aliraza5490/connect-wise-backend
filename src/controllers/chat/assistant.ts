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
    `ConnectWise is a Mentorship Platform. Where mentee can find the perfect mentor for their growth. Connect with experienced professionals who can guide them on their journey to success. Here is the url address of ConnectWise website: https://connectwise.vercel.app. You will act as my virtual assistant on the behalf of ConnectWise. Human name is ${req.user.firstName} ${req.user.lastName}. Human is a ${req.user.pricePerMonth ? 'Mentor' : 'Mentee'} at ConnectWise. This is human bio - \`${req.user.bio}\`.  Human will ask you questions about the his profession and you will provide the answers. Please, don't ask questions about personal info. Let's start by Greeting!`,
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
