import Mentor from '@models/Mentor';
import Premium from '@models/Premium';
import Stripe from 'stripe';
import { z } from 'zod';
const stripe = new Stripe(process.env.STRIPE_SECRET);

export default async (req: IReq, res: IRes) => {
  const schema = z.object({
    mentorID: z.string().min(24).max(26),
  });

  const value = schema.safeParse(req.body);

  if (!value.success) {
    return res.status(400).json({
      errors: value.error.errors,
      message: 'Invalid data',
    });
  }

  const mentor = await Mentor.findOne({
    _id: value.data.mentorID,
    isActive: true,
  });

  if (!mentor) {
    return res.status(404).json({
      message: 'Mentor not found',
    });
  }

  const orderDetails = {
    mentor: value.data.mentorID,
  };

  const premium = await new Premium(orderDetails).save();

  const session = await stripe.checkout.sessions.create({
    line_items: [
      {
        price_data: {
          currency: 'usd',
          product_data: {
            name: `Buy Premium Membership`,
          },
          unit_amount: 500, // 5 USD,
          recurring: {
            interval: 'month',
          },
        },
        quantity: 1,
      },
    ],
    mode: 'subscription',
    customer_email: req.user.email,
    billing_address_collection: 'auto',
    metadata: {
      userID: String(req.user._id),
      premiumID: String(premium._id),
    },
    success_url: `${process.env.FRONTEND_URL}?success=true&id=${premium._id}`,
    cancel_url: `${process.env.FRONTEND_URL}?canceled=true`,
  });

  return res.json({
    redirectURL: session.url,
  });
};
