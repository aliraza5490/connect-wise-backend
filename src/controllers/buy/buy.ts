import Mentor from '@models/Mentor';
import Order from '@models/Order';
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
    user: req.user._id,
    mentor: value.data.mentorID,
    price: mentor.pricePerMonth,
  };

  const order = await new Order(orderDetails).save();

  const session = await stripe.checkout.sessions.create({
    line_items: [
      {
        price_data: {
          currency: 'usd',
          product_data: {
            name: `Buy mentorship from ${mentor.firstName} ${mentor.lastName}`,
          },
          unit_amount: Number((mentor.pricePerMonth * 100).toFixed(0)),
        },
        quantity: 1,
      },
    ],
    mode: 'payment',
    customer_email: req.user.email,
    metadata: {
      userID: String(req.user._id),
      orderID: String(order._id),
    },
    success_url: `${process.env.FRONTEND_URL}?success=true&id=${order._id}`,
    cancel_url: `${process.env.FRONTEND_URL}?canceled=true`,
  });

  return res.json({
    redirectURL: session.url,
  });
};
